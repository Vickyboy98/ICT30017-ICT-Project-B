const express = require('express');
const { query } = require('../db');
const { requireAuth, requireRole } = require('../middleware/auth');

const router = express.Router();

router.get('/types', async (req, res, next) => {
  try {
    const rows = await query(`
      SELECT rt.*, GROUP_CONCAT(a.amenity_name ORDER BY a.amenity_name SEPARATOR ', ') AS amenities
      FROM room_types rt
      LEFT JOIN room_type_amenities rta ON rta.room_type_id = rt.id
      LEFT JOIN amenities a ON a.id = rta.amenity_id
      WHERE rt.is_active = TRUE
      GROUP BY rt.id
      ORDER BY rt.id
    `);
    res.json(rows);
  } catch (error) {
    next(error);
  }
});

router.get('/', requireAuth, async (req, res, next) => {
  try {
    const { status, floor } = req.query;
    const params = {};
    let where = 'WHERE 1=1';
    if (status) { where += ' AND r.status = :status'; params.status = status; }
    if (floor) { where += ' AND r.floor_number = :floor'; params.floor = Number(floor); }
    const rows = await query(`
      SELECT r.*, rt.type_name, rt.base_price_inr, rt.max_capacity
      FROM rooms r
      JOIN room_types rt ON rt.id = r.room_type_id
      ${where}
      ORDER BY r.floor_number, r.room_number
    `, params);
    res.json(rows);
  } catch (error) {
    next(error);
  }
});

router.get('/live', requireAuth, requireRole('staff', 'admin'), async (req, res, next) => {
  try {
    const rows = await query('SELECT * FROM vw_live_room_monitor ORDER BY floor_number, room_number');
    res.json(rows);
  } catch (error) {
    next(error);
  }
});

router.post('/', requireAuth, requireRole('admin'), async (req, res, next) => {
  try {
    const { roomNumber, roomTypeId, floorNumber, status, bedrooms, bathrooms, notes } = req.body;
    if (!roomNumber || !roomTypeId) return res.status(400).json({ message: 'roomNumber and roomTypeId are required.' });
    const result = await query(
      `INSERT INTO rooms (room_number, room_type_id, floor_number, status, bedrooms, bathrooms, notes)
       VALUES (:roomNumber, :roomTypeId, :floorNumber, :status, :bedrooms, :bathrooms, :notes)`,
      { roomNumber, roomTypeId, floorNumber: floorNumber || null, status: status || 'available', bedrooms: bedrooms || null, bathrooms: bathrooms || null, notes: notes || null }
    );
    res.status(201).json({ id: result.insertId, message: 'Room created.' });
  } catch (error) {
    next(error);
  }
});

router.patch('/:id', requireAuth, requireRole('admin'), async (req, res, next) => {
  try {
    const { status, housekeepingStatus, bedrooms, bathrooms, notes } = req.body;
    if (status !== undefined && !['available','booked','occupied','maintenance','inactive'].includes(status)) return res.status(400).json({ message: 'Invalid room status.' });
    const result = await query(
      `UPDATE rooms SET
         status = COALESCE(:status, status),
         housekeeping_status = COALESCE(:housekeepingStatus, housekeeping_status),
         bedrooms = COALESCE(:bedrooms, bedrooms),
         bathrooms = COALESCE(:bathrooms, bathrooms),
         notes = COALESCE(:notes, notes)
       WHERE id = :id`,
      { id: req.params.id, status: status || null, housekeepingStatus: housekeepingStatus || null, bedrooms: bedrooms ?? null, bathrooms: bathrooms ?? null, notes: notes ?? null }
    );
    if (!result.affectedRows) return res.status(404).json({ message: 'Room not found.' });
    res.json({ message: 'Room updated.' });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', requireAuth, requireRole('admin'), async (req, res, next) => {
  try {
    await query('UPDATE rooms SET status = \'inactive\' WHERE id = :id', { id: req.params.id });
    res.json({ message: 'Room marked inactive.' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
