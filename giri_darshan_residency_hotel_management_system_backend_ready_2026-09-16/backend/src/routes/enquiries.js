const express = require('express');
const { query } = require('../db');
const { requireAuth, requireRole } = require('../middleware/auth');

const router = express.Router();

router.post('/', async (req, res, next) => {
  try {
    const { customerId, name, email, phone, subject, message } = req.body;
    if (!name || !email || !message) return res.status(400).json({ message: 'name, email and message are required.' });
    const result = await query(
      `INSERT INTO enquiries (customer_id, name, email, phone, subject, message)
       VALUES (:customerId, :name, :email, :phone, :subject, :message)`,
      { customerId: customerId || null, name, email, phone: phone || null, subject: subject || null, message }
    );
    res.status(201).json({ id: result.insertId, message: 'Enquiry submitted.' });
  } catch (error) { next(error); }
});

router.get('/', requireAuth, requireRole('staff', 'admin'), async (req, res, next) => {
  try {
    const rows = await query(`
      SELECT e.*, CONCAT(u.first_name, ' ', u.last_name) AS assigned_staff
      FROM enquiries e
      LEFT JOIN users u ON u.id = e.assigned_to
      ORDER BY e.created_at DESC
    `);
    res.json(rows);
  } catch (error) { next(error); }
});

router.patch('/:id', requireAuth, requireRole('staff', 'admin'), async (req, res, next) => {
  try {
    const { status, assignedTo } = req.body;
    if (status !== undefined && !['new', 'open', 'in_progress', 'responded', 'closed'].includes(status)) return res.status(400).json({ message: 'Invalid enquiry status.' });
    const result = await query(
      'UPDATE enquiries SET enquiry_status = COALESCE(:status, enquiry_status), assigned_to = COALESCE(:assignedTo, assigned_to) WHERE id = :id',
      { id: req.params.id, status: status || null, assignedTo: assignedTo || null }
    );
    if (!result.affectedRows) return res.status(404).json({ message: 'Enquiry not found.' });
    res.json({ message: 'Enquiry updated.' });
  } catch (error) { next(error); }
});

module.exports = router;
