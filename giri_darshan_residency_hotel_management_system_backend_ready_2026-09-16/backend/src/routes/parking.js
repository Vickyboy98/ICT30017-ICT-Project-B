const express = require('express');
const { query, transaction } = require('../db');
const { requireAuth, requireRole } = require('../middleware/auth');

const router = express.Router();
router.use(requireAuth);

router.get('/spots', requireRole('staff', 'admin'), async (req, res, next) => {
  try {
    const rows = await query('SELECT * FROM parking_spots ORDER BY spot_code');
    res.json(rows);
  } catch (error) { next(error); }
});

router.post('/spots', requireRole('admin'), async (req, res, next) => {
  try {
    const { spotCode, spotType = 'car', floorOrZone, status = 'available' } = req.body;
    const result = await query(
      'INSERT INTO parking_spots (spot_code, spot_type, floor_or_zone, status) VALUES (:spotCode, :spotType, :floorOrZone, :status)',
      { spotCode, spotType, floorOrZone: floorOrZone || null, status }
    );
    res.status(201).json({ id: result.insertId, message: 'Parking spot created.' });
  } catch (error) { next(error); }
});

router.patch('/spots/:id/status', requireRole('staff', 'admin'), async (req, res, next) => {
  try {
    const { status } = req.body;
    await query('UPDATE parking_spots SET status = :status WHERE id = :id', { status, id: req.params.id });
    res.json({ message: 'Parking spot status updated.' });
  } catch (error) { next(error); }
});

function fail(status, message) { const e = new Error(message); e.status = status; throw e; }

router.get('/allocations', requireRole('staff', 'admin'), async (req, res, next) => {
  try { res.json(await query('SELECT a.*, s.spot_code, b.booking_ref FROM parking_allocations a JOIN parking_spots s ON s.id=a.parking_spot_id JOIN bookings b ON b.id=a.booking_id ORDER BY a.id DESC')); } catch(e) { next(e); }
});

router.post('/allocate', requireRole('staff', 'admin'), async (req, res, next) => {
  try {
    const { bookingId, parkingSpotId, vehicleNumber, vehicleType } = req.body;
    if (!Number.isSafeInteger(Number(bookingId)) || Number(bookingId)<1 || !Number.isSafeInteger(Number(parkingSpotId)) || Number(parkingSpotId)<1) return res.status(400).json({message:'Select a booking and parking spot.'});
    if (vehicleType && !['bike','car','van','bus'].includes(vehicleType)) return res.status(400).json({message:'Invalid vehicle type.'});
    const id = await transaction(async conn => {
      const [[spot]] = await conn.execute('SELECT * FROM parking_spots WHERE id=? FOR UPDATE',[parkingSpotId]);
      if (!spot) fail(404,'Parking spot not found.');
      const [[existing]] = await conn.execute("SELECT id FROM parking_allocations WHERE parking_spot_id=? AND allocation_status IN ('reserved','active') LIMIT 1",[parkingSpotId]);
      if (spot.status !== 'available' || existing) fail(409,'Parking spot is already reserved or unavailable.');
      const [[booking]] = await conn.execute('SELECT booking_status FROM bookings WHERE id=?',[bookingId]);
      if (!booking) fail(404,'Booking not found.');
      if (['cancelled','rejected','checked_out'].includes(booking.booking_status)) fail(409,'This booking cannot reserve parking.');
      const [result] = await conn.execute('INSERT INTO parking_allocations (booking_id,parking_spot_id,vehicle_number,vehicle_type,start_datetime) VALUES (?,?,?,?,CURRENT_TIMESTAMP)',[bookingId,parkingSpotId,vehicleNumber || null,vehicleType || null]);
      await conn.execute("UPDATE parking_spots SET status='reserved' WHERE id=?",[parkingSpotId]);
      return result.insertId;
    });
    res.status(201).json({id,message:'Parking allocated.'});
  } catch(e) { next(e); }
});

router.patch('/allocations/:id/release', requireRole('staff', 'admin'), async (req,res,next) => {
  try {
    await transaction(async conn => {
      const [[record]] = await conn.execute('SELECT * FROM parking_allocations WHERE id=? FOR UPDATE',[req.params.id]);
      if (!record) fail(404,'Allocation not found.');
      if (!['active','reserved'].includes(record.allocation_status)) fail(409,'Parking has already been released.');
      await conn.execute("UPDATE parking_allocations SET allocation_status='completed',end_datetime=CURRENT_TIMESTAMP WHERE id=?",[record.id]);
      await conn.execute("UPDATE parking_spots SET status='available' WHERE id=?",[record.parking_spot_id]);
    });
    res.json({message:'Parking released.'});
  } catch(e) { next(e); }
});

module.exports = router;
