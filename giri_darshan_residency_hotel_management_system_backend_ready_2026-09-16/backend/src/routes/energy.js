const express = require('express');
const { query } = require('../db');
const { requireAuth, requireRole } = require('../middleware/auth');

const router = express.Router();
router.use(requireAuth, requireRole('staff', 'admin'));

router.get('/overview', async (req, res, next) => {
  try {
    const rooms = await query('SELECT * FROM vw_live_room_monitor ORDER BY floor_number, room_number');
    const summary = await query(`
      SELECT
        COUNT(*) AS total_readings,
        COALESCE(SUM(kwh_usage), 0) AS total_kwh,
        AVG(kwh_usage) AS average_kwh,
        COUNT(DISTINCT CASE WHEN usage_level IN ('high', 'critical') THEN room_id END) AS high_usage_rooms
      FROM room_power_readings
      WHERE reading_time >= DATE_SUB(NOW(), INTERVAL 1 DAY)
    `);
    const [sensors] = await query("SELECT COUNT(*) AS total_sensors, COALESCE(SUM(sensor_status = 'active'),0) AS active_sensors FROM room_sensors");
    const [faults] = await query("SELECT COUNT(*) AS open_faults FROM equipment_faults WHERE fault_status IN ('reported','in_progress')");
    res.json({ summary: { ...summary[0], ...sensors, ...faults }, rooms });
  } catch (error) { next(error); }
});

// Room power readings recorded in the shared hotel_db database on the same Aiven service.
// Each row is an instantaneous draw in watts per appliance (TV, AC, microwave).
const HOTEL_ENERGY_DB = process.env.HOTEL_ENERGY_DB_NAME || 'hotel_db';
if (!/^[A-Za-z0-9_]+$/.test(HOTEL_ENERGY_DB)) throw new Error('HOTEL_ENERGY_DB_NAME may only contain letters, numbers and underscores.');

router.get('/hotel-readings', async (req, res, next) => {
  try {
    const db = '`' + HOTEL_ENERGY_DB + '`';
    const rooms = await query(`
      SELECT r.id, r.room_number, r.floor, r.status, rt.name AS room_type, rt.size_sqm, rt.capacity,
             u.id AS reading_id, u.tv_watts, u.ac_watts, u.microwave_watts, u.recorded_at
      FROM ${db}.rooms r
      LEFT JOIN ${db}.room_types rt ON rt.id = r.room_type_id
      LEFT JOIN (
        SELECT room_id, MAX(id) AS id FROM ${db}.room_power_usage GROUP BY room_id
      ) latest ON latest.room_id = r.id
      LEFT JOIN ${db}.room_power_usage u ON u.id = latest.id
      ORDER BY r.floor, r.room_number
    `);
    const [summary] = await query(`
      SELECT COUNT(*) AS total_readings, COUNT(DISTINCT recorded_at) AS reading_times,
             MIN(recorded_at) AS first_reading_at, MAX(recorded_at) AS last_reading_at
      FROM ${db}.room_power_usage
    `);
    // Building totals for the seven most recent reading times within 7 days of the latest
    // reading (oldest first), so a gap of weeks between batches does not distort the trend.
    const history = await query(`
      SELECT recorded_at, COUNT(*) AS rooms,
             SUM(tv_watts + ac_watts + microwave_watts) AS total_watts
      FROM ${db}.room_power_usage
      WHERE recorded_at >= (SELECT MAX(recorded_at) FROM ${db}.room_power_usage) - INTERVAL 7 DAY
      GROUP BY recorded_at
      ORDER BY recorded_at DESC
      LIMIT 7
    `);
    // Latest booking per room, with the number of guests on it.
    const bookings = await query(`
      SELECT b.room_id, b.booking_ref, b.status, b.check_in, b.check_out,
             1 + (SELECT COUNT(*) FROM ${db}.booking_guests g
                  WHERE g.booking_id = b.id AND g.guest_type = 'guest') AS guests
      FROM ${db}.bookings b
      JOIN (
        SELECT room_id, MAX(check_in) AS check_in FROM ${db}.bookings
        WHERE status <> 'cancelled' GROUP BY room_id
      ) latest ON latest.room_id = b.room_id AND latest.check_in = b.check_in
      WHERE b.status <> 'cancelled'
    `);
    const issues = await query(`
      SELECT id, room_id, issue, status, reported_at FROM ${db}.maintenance
      WHERE status IN ('open', 'in_progress') ORDER BY reported_at DESC
    `);
    // Each room's last six readings (oldest first) for the room trend and change arrows.
    const recent = await query(`
      SELECT room_id, recorded_at, tv_watts, ac_watts, microwave_watts FROM (
        SELECT u.*, ROW_NUMBER() OVER (PARTITION BY room_id ORDER BY recorded_at DESC, id DESC) AS n
        FROM ${db}.room_power_usage u
      ) ranked
      WHERE n <= 6
      ORDER BY room_id, recorded_at
    `);
    const bookingByRoom = new Map(bookings.map(b => [b.room_id, b]));
    res.json({
      source: HOTEL_ENERGY_DB,
      generatedAt: new Date().toISOString(),
      readings: {
        total: Number(summary.total_readings),
        readingTimes: Number(summary.reading_times),
        firstReadingAt: summary.first_reading_at,
        lastReadingAt: summary.last_reading_at
      },
      history: history.reverse().map(h => ({
        recordedAt: h.recorded_at,
        rooms: Number(h.rooms),
        totalWatts: Number(h.total_watts) || 0
      })),
      rooms: rooms.map(r => ({
        id: r.id,
        roomNumber: r.room_number,
        floor: r.floor,
        status: r.status,
        roomType: r.room_type,
        sizeSqm: r.size_sqm === null ? null : Number(r.size_sqm),
        capacity: r.capacity === null ? null : Number(r.capacity),
        reading: r.reading_id ? {
          id: r.reading_id,
          tvWatts: Number(r.tv_watts) || 0,
          acWatts: Number(r.ac_watts) || 0,
          microwaveWatts: Number(r.microwave_watts) || 0,
          totalWatts: (Number(r.tv_watts) || 0) + (Number(r.ac_watts) || 0) + (Number(r.microwave_watts) || 0),
          recordedAt: r.recorded_at
        } : null,
        booking: bookingByRoom.has(r.id) ? (b => ({
          ref: b.booking_ref,
          status: b.status,
          checkIn: b.check_in,
          checkOut: b.check_out,
          guests: Number(b.guests) || 1
        }))(bookingByRoom.get(r.id)) : null,
        issues: issues.filter(i => i.room_id === r.id).map(i => ({
          id: i.id,
          issue: i.issue,
          status: i.status,
          reportedAt: i.reported_at
        })),
        recent: recent.filter(u => u.room_id === r.id).map(u => ({
          recordedAt: u.recorded_at,
          microwaveWatts: Number(u.microwave_watts) || 0,
          totalWatts: (Number(u.tv_watts) || 0) + (Number(u.ac_watts) || 0) + (Number(u.microwave_watts) || 0)
        }))
      }))
    });
  } catch (error) { next(error); }
});

// Mark a maintenance issue as resolved (or back in progress) from the energy dashboard.
router.patch('/hotel-maintenance/:id', async (req, res, next) => {
  try {
    const db = '`' + HOTEL_ENERGY_DB + '`';
    const id = Number(req.params.id);
    const { status } = req.body;
    if (!Number.isSafeInteger(id) || id < 1 || !['open', 'in_progress', 'resolved'].includes(status)) {
      return res.status(400).json({ message: 'Choose a valid issue and status.' });
    }
    const result = await query(
      `UPDATE ${db}.maintenance SET status = :status,
         resolved_at = IF(:status = 'resolved', CURRENT_TIMESTAMP, NULL)
       WHERE id = :id`,
      { id, status }
    );
    if (!result.affectedRows) return res.status(404).json({ message: 'Issue not found.' });
    res.json({ message: status === 'resolved' ? 'Issue marked as resolved.' : 'Issue status updated.' });
  } catch (error) { next(error); }
});

// Report a room issue from the energy dashboard into hotel_db's maintenance table.
router.post('/hotel-maintenance', async (req, res, next) => {
  try {
    const db = '`' + HOTEL_ENERGY_DB + '`';
    const roomId = Number(req.body.roomId);
    const issue = typeof req.body.issue === 'string' ? req.body.issue.trim() : '';
    const description = typeof req.body.description === 'string' ? req.body.description.trim() : '';
    if (!Number.isSafeInteger(roomId) || roomId < 1 || !issue || issue.length > 255 || description.length > 2000) {
      return res.status(400).json({ message: 'Choose a room and describe the issue (up to 255 characters).' });
    }
    const [room] = await query(`SELECT id FROM ${db}.rooms WHERE id = :roomId`, { roomId });
    if (!room) return res.status(404).json({ message: 'Room not found.' });
    const result = await query(
      `INSERT INTO ${db}.maintenance (room_id, issue, description) VALUES (:roomId, :issue, :description)`,
      { roomId, issue, description: description || null }
    );
    res.status(201).json({ id: result.insertId, message: 'Issue reported to maintenance.' });
  } catch (error) { next(error); }
});

router.post('/readings', requireRole('admin'), async (req, res, next) => {
  try {
    const { roomId, sensorId, kwhUsage, usageLevel = 'normal' } = req.body;
    const result = await query(
      'INSERT INTO room_power_readings (room_id, sensor_id, kwh_usage, usage_level) VALUES (:roomId, :sensorId, :kwhUsage, :usageLevel)',
      { roomId, sensorId: sensorId || null, kwhUsage, usageLevel }
    );
    res.status(201).json({ id: result.insertId, message: 'Energy reading saved.' });
  } catch (error) { next(error); }
});

router.get('/faults', async (req, res, next) => {
  try {
    const rows = await query(`
      SELECT ef.*, r.room_number
      FROM equipment_faults ef
      JOIN rooms r ON r.id = ef.room_id
      ORDER BY ef.reported_at DESC
    `);
    res.json(rows);
  } catch (error) { next(error); }
});

router.post('/faults', requireRole('staff', 'admin'), async (req, res, next) => {
  try {
    const { roomId, sensorId, equipmentName, faultDescription, priority = 'medium' } = req.body;
    if (!Number.isSafeInteger(Number(roomId)) || Number(roomId) < 1 || typeof equipmentName !== 'string' || !equipmentName.trim() || equipmentName.length > 100 || !['low','medium','high','critical'].includes(priority)) return res.status(400).json({message:'Select a room, equipment name and valid priority.'});
    const result = await query(
      `INSERT INTO equipment_faults (room_id, sensor_id, equipment_name, fault_description, priority)
       VALUES (:roomId, :sensorId, :equipmentName, :faultDescription, :priority)`,
      { roomId, sensorId: sensorId || null, equipmentName, faultDescription: faultDescription || null, priority }
    );
    res.status(201).json({ id: result.insertId, message: 'Equipment fault reported.' });
  } catch (error) { next(error); }
});

router.patch('/faults/:id', requireRole('staff', 'admin'), async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['reported','in_progress','resolved','closed'].includes(status)) return res.status(400).json({message:'Invalid fault status.'});
    const result = await query('UPDATE equipment_faults SET fault_status = :status, resolved_at = IF(:status IN (\'resolved\', \'closed\'), CURRENT_TIMESTAMP, NULL) WHERE id = :id', { status, id: req.params.id });
    if (!result.affectedRows) return res.status(404).json({message:'Fault not found.'});
    res.json({ message: 'Fault status updated.' });
  } catch (error) { next(error); }
});

module.exports = router;
