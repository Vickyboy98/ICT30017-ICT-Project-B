const express = require('express');
const { query, transaction } = require('../db');
const { requireAuth, requireRole } = require('../middleware/auth');
const { makeBookingRef, nightsBetween } = require('../utils/refs');

const router = express.Router();

router.get('/', requireAuth, async (req, res, next) => {
  try {
    let sql = 'SELECT * FROM vw_customer_bookings';
    const params = {};
    if (req.user.role === 'customer') {
      sql += ' WHERE customer_id = :customerId';
      params.customerId = req.user.id;
    }
    sql += ' ORDER BY check_in_date DESC, booking_id DESC';
    const rows = await query(sql, params);
    res.json(rows);
  } catch (error) {
    next(error);
  }
});

router.post('/', requireAuth, async (req, res, next) => {
  try {
    const {
      roomTypeId, roomId, checkInDate, checkOutDate,
      adults = 1, children = 0, seniors = 0, specialRequest, primaryGuestName
    } = req.body;
    if (!roomTypeId || !checkInDate || !checkOutDate) {
      return res.status(400).json({ message: 'roomTypeId, checkInDate and checkOutDate are required.' });
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(checkInDate) || !/^\d{4}-\d{2}-\d{2}$/.test(checkOutDate) || new Date(checkOutDate) <= new Date(checkInDate)) {
      return res.status(400).json({ message: 'Check-out date must be after check-in date.' });
    }

    if (![adults, children, seniors].every(n => Number.isSafeInteger(Number(n)) && Number(n) >= 0 && Number(n) <= 100)) {
      return res.status(400).json({ message: 'Guest counts must be whole numbers between 0 and 100.' });
    }
    const totalGuests = Number(adults) + Number(children) + Number(seniors);
    if (totalGuests < 1) return res.status(400).json({ message: 'At least one guest is required.' });

    const created = await transaction(async (conn) => {
      const [[roomType]] = await conn.execute('SELECT * FROM room_types WHERE id = ? AND is_active = TRUE', [roomTypeId]);
      if (!roomType) throw new Error('Room type not found.');
      if (roomType.max_capacity && totalGuests > roomType.max_capacity) {
        const err = new Error(`Selected room type allows maximum ${roomType.max_capacity} guests.`);
        err.status = 400;
        throw err;
      }

      let selectedRoomId = roomId || null;
      if (!selectedRoomId) {
        const [candidates] = await conn.execute("SELECT id FROM rooms WHERE room_type_id = ? AND status IN ('available', 'booked') ORDER BY id FOR UPDATE", [roomTypeId]);
        for (const candidate of candidates) {
          const [[busy]] = await conn.execute("SELECT COUNT(*) AS count FROM bookings WHERE room_id = ? AND booking_status NOT IN ('cancelled', 'rejected', 'checked_out') AND check_in_date < ? AND check_out_date > ?", [candidate.id, checkOutDate, checkInDate]);
          if (!busy.count) { selectedRoomId = candidate.id; break; }
        }
        if (!selectedRoomId) { const err = new Error('No rooms are available for these dates.'); err.status = 409; throw err; }
      }
      if (selectedRoomId) {
        const [[room]] = await conn.execute('SELECT id, room_type_id, status FROM rooms WHERE id = ? FOR UPDATE', [selectedRoomId]);
        if (!room) throw new Error('Selected room not found.');
        if (Number(room.room_type_id) !== Number(roomTypeId)) { const err = new Error('Selected room does not match the room type.'); err.status = 400; throw err; }
        if (!['available', 'booked'].includes(room.status)) {
          const err = new Error('Selected room is not available for booking.');
          err.status = 400;
          throw err;
        }
        const [[overlap]] = await conn.execute(`SELECT COUNT(*) AS count FROM bookings WHERE room_id = ? AND booking_status NOT IN ('cancelled', 'rejected', 'checked_out') AND check_in_date < ? AND check_out_date > ?`, [selectedRoomId, checkOutDate, checkInDate]);
        if (overlap.count > 0) { const err = new Error('Selected room is already booked for part of those dates.'); err.status = 409; throw err; }
      }

      const nights = nightsBetween(checkInDate, checkOutDate);
      const price = roomType.base_price_inr || 0;
      const totalAmount = price ? nights * price : null;
      const bookingRef = makeBookingRef();

      const [result] = await conn.execute(
        `INSERT INTO bookings
         (booking_ref, customer_id, room_id, room_type_id, check_in_date, check_out_date, adults, children, seniors, total_guests, special_request, booking_status, total_amount_inr)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'awaiting_payment', ?)`,
        [bookingRef, req.user.id, selectedRoomId, roomTypeId, checkInDate, checkOutDate, adults, children, seniors, totalGuests, specialRequest || null, totalAmount]
      );

      const guestName = String(primaryGuestName || `${req.user.first_name} ${req.user.last_name}`).trim();
      let primary = true;
      for (const [type, count] of [['adult', adults], ['senior', seniors], ['child', children]]) {
        for (let i = 0; i < Number(count); i += 1) {
          await conn.execute('INSERT INTO booking_guests (booking_id, guest_name, guest_type, is_primary) VALUES (?, ?, ?, ?)', [result.insertId, primary ? guestName : `${type} guest ${i + 1}`, type, primary]);
          primary = false;
        }
      }

      if (selectedRoomId) {
        await conn.execute('UPDATE rooms SET status = ? WHERE id = ?', ['booked', selectedRoomId]);
      }
      return { id: result.insertId, bookingRef, totalAmount };
    });

    res.status(201).json({ message: 'Booking created.', ...created });
  } catch (error) {
    next(error);
  }
});

router.patch('/:id/status', requireAuth, requireRole('staff', 'admin'), async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!status) return res.status(400).json({ message: 'status is required.' });
    const allowedStatuses = ['pending', 'awaiting_payment', 'awaiting_verification', 'confirmed', 'checked_in', 'checked_out', 'cancelled', 'rejected'];
    if (!allowedStatuses.includes(status)) return res.status(400).json({ message: 'Invalid booking status.' });
    await transaction(async (conn) => {
      const [[booking]] = await conn.execute('SELECT room_id, booking_status FROM bookings WHERE id = ? FOR UPDATE', [req.params.id]);
      if (!booking) { const err = new Error('Booking not found.'); err.status = 404; throw err; }
      if (status === 'cancelled' && ['checked_in', 'checked_out'].includes(booking.booking_status)) { const err = new Error('A checked-in or completed stay cannot be cancelled.'); err.status = 409; throw err; }
      if (status === 'checked_in') {
        const [[verification]] = await conn.execute("SELECT id FROM guest_verifications WHERE booking_id = ? AND verification_status IN ('verified', 'check_in_confirmed')", [req.params.id]);
        if (booking.booking_status !== 'confirmed' || !verification || !booking.room_id) { const err = new Error('Check-in requires a confirmed booking, verified document and assigned room.'); err.status = 409; throw err; }
        await conn.execute('INSERT INTO check_in_out (booking_id, checked_in_by, check_in_time) VALUES (?, ?, CURRENT_TIMESTAMP)', [req.params.id, req.user.id]);
      }
      if (status === 'checked_out') {
        if (booking.booking_status !== 'checked_in') { const err = new Error('Only checked-in bookings can be checked out.'); err.status = 409; throw err; }
        await conn.execute('UPDATE check_in_out SET checked_out_by = ?, check_out_time = CURRENT_TIMESTAMP WHERE booking_id = ?', [req.user.id, req.params.id]);
      }
      await conn.execute('UPDATE bookings SET booking_status = ? WHERE id = ?', [status, req.params.id]);
      if (booking.room_id) {
        let roomStatus = status === 'checked_in' ? 'occupied' : ['checked_out', 'cancelled', 'rejected'].includes(status) ? 'available' : status === 'confirmed' ? 'booked' : null;
        if (roomStatus === 'available') {
          const [[other]] = await conn.execute("SELECT SUM(booking_status = 'checked_in') AS occupied, COUNT(*) AS reserved FROM bookings WHERE room_id = ? AND id <> ? AND booking_status NOT IN ('cancelled','rejected','checked_out')", [booking.room_id, req.params.id]);
          if (Number(other.occupied)) roomStatus = 'occupied';
          else if (other.reserved) roomStatus = 'booked';
        }
        if (roomStatus) await conn.execute('UPDATE rooms SET status = ? WHERE id = ?', [roomStatus, booking.room_id]);
      }
    });
    res.json({ message: 'Booking status updated.' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
