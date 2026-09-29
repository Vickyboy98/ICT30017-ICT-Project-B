const express = require('express');
const bcrypt = require('bcryptjs');
const { query, transaction } = require('../db');
const { requireAuth, requireRole } = require('../middleware/auth');

const router = express.Router();
router.use(requireAuth, requireRole('admin'));

router.get('/', async (req, res, next) => {
  try {
    const rows = await query(`
      SELECT sp.*, u.first_name, u.last_name, u.email, u.phone, u.status AS user_status
      FROM staff_profiles sp
      JOIN users u ON u.id = sp.user_id
      ORDER BY sp.employee_code
    `);
    res.json(rows);
  } catch (error) { next(error); }
});

router.post('/', async (req, res, next) => {
  try {
    const { firstName, lastName, email, phone, password, employeeCode, department, jobTitle, hourlyRateInr, hireDate } = req.body;
    if (!firstName || !lastName || !email || !password || !employeeCode) {
      return res.status(400).json({ message: 'firstName, lastName, email, password and employeeCode are required.' });
    }
    const result = await transaction(async (conn) => {
      const passwordHash = await bcrypt.hash(password, 10);
      const [userResult] = await conn.execute(
        `INSERT INTO users (first_name, last_name, email, phone, password_hash, role)
         VALUES (?, ?, ?, ?, ?, 'staff')`,
        [firstName, lastName, email, phone || null, passwordHash]
      );
      const [profileResult] = await conn.execute(
        `INSERT INTO staff_profiles (user_id, employee_code, department, job_title, hourly_rate_inr, hire_date)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [userResult.insertId, employeeCode, department || null, jobTitle || null, hourlyRateInr || null, hireDate || null]
      );
      return { userId: userResult.insertId, staffProfileId: profileResult.insertId };
    });
    res.status(201).json({ message: 'Staff member created.', ...result });
  } catch (error) { next(error); }
});

router.patch('/:staffProfileId', async (req, res, next) => {
  try {
    const { department, jobTitle, hourlyRateInr, hireDate, employmentStatus } = req.body;
    await query(
      `UPDATE staff_profiles SET
         department = COALESCE(:department, department),
         job_title = COALESCE(:jobTitle, job_title),
         hourly_rate_inr = COALESCE(:hourlyRateInr, hourly_rate_inr),
         hire_date = COALESCE(:hireDate, hire_date),
         employment_status = COALESCE(:employmentStatus, employment_status)
       WHERE id = :staffProfileId`,
      { staffProfileId: req.params.staffProfileId, department: department || null, jobTitle: jobTitle || null, hourlyRateInr: hourlyRateInr ?? null, hireDate: hireDate || null, employmentStatus: employmentStatus || null }
    );
    res.json({ message: 'Staff profile updated.' });
  } catch (error) { next(error); }
});

router.post('/:staffProfileId/shifts', async (req, res, next) => {
  try {
    const { shiftDate, clockIn, clockOut, breakMinutes = 0, shiftStatus = 'scheduled' } = req.body;
    const result = await query(
      `INSERT INTO staff_shifts (staff_profile_id, shift_date, clock_in, clock_out, break_minutes, shift_status)
       VALUES (:staffProfileId, :shiftDate, :clockIn, :clockOut, :breakMinutes, :shiftStatus)`,
      { staffProfileId: req.params.staffProfileId, shiftDate, clockIn: clockIn || null, clockOut: clockOut || null, breakMinutes, shiftStatus }
    );
    res.status(201).json({ id: result.insertId, message: 'Shift saved.' });
  } catch (error) { next(error); }
});

module.exports = router;
