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
