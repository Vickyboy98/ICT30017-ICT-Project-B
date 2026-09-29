const express = require('express');
const { query } = require('../db');
const { requireAuth, requireRole } = require('../middleware/auth');

const router = express.Router();
router.use(requireAuth);

router.get('/admin', requireRole('admin'), async (req, res, next) => {
  try {
    const rows = await query('SELECT * FROM vw_admin_dashboard_summary');
    const recentBookings = await query(`SELECT b.id AS booking_id, b.booking_ref, CONCAT(u.first_name, ' ', u.last_name) AS customer_name,
      COALESCE(rt.type_name, 'Unassigned') AS room_type, b.check_in_date, b.booking_status,
      COALESCE(b.total_amount_inr, 0) AS total_amount_inr
      FROM bookings b JOIN users u ON u.id = b.customer_id
      LEFT JOIN room_types rt ON rt.id = b.room_type_id
      ORDER BY b.created_at DESC LIMIT 8`);
    const weeklyRevenue = await query(`SELECT DATE(p.created_at) AS day, COALESCE(SUM(p.amount_inr), 0) AS amount_inr
      FROM payments p WHERE p.payment_status = 'paid' AND p.created_at >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
      GROUP BY DATE(p.created_at) ORDER BY day`);
    const bookingTrends = await query(`SELECT DATE(created_at) AS day, COUNT(*) AS value
      FROM bookings WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
      GROUP BY DATE(created_at) ORDER BY day`);
    const roomStatus = await query('SELECT status, COUNT(*) AS count FROM rooms GROUP BY status');
    const summary = rows[0] || {};
    const totalRooms = Number(summary.total_rooms || 0);
    const occupiedRooms = Number(summary.occupied_rooms || 0);
    res.json({ ...summary, recentBookings, weeklyRevenue, bookingTrends, roomStatus,
      occupancyRate: totalRooms ? Math.round((occupiedRooms / totalRooms) * 100) : 0 });
  } catch (error) { next(error); }
});

router.get('/customer', requireRole('customer'), async (req, res, next) => {
  try {
    const bookings = await query('SELECT * FROM vw_customer_bookings WHERE customer_id = :customerId ORDER BY check_in_date DESC', { customerId: req.user.id });
    const profileRows = await query('SELECT * FROM customer_profiles WHERE user_id = :customerId LIMIT 1', { customerId: req.user.id });
    const summary = {
      upcomingStays: bookings.filter(b => ['confirmed', 'checked_in', 'awaiting_payment', 'awaiting_verification'].includes(b.booking_status)).length,
      totalBookings: bookings.length,
      totalSpentInr: bookings.reduce((sum, b) => sum + Number(b.payment_status === 'paid' ? (b.total_amount_inr || 0) : 0), 0)
    };
    res.json({ profile: profileRows[0] || null, summary, bookings });
  } catch (error) { next(error); }
});

router.get('/staff', requireRole('staff', 'admin'), async (req, res, next) => {
  try {
    const pending = await query('SELECT COUNT(*) AS pending_verifications FROM guest_verifications WHERE verification_status IN (\'pending\', \'under_review\')');
    const checkins = await query('SELECT COUNT(*) AS todays_checkins FROM bookings WHERE check_in_date = CURDATE() AND booking_status IN (\'confirmed\', \'awaiting_verification\')');
    const enquiries = await query('SELECT COUNT(*) AS open_enquiries FROM enquiries WHERE enquiry_status IN (\'new\', \'open\', \'in_progress\')');
    res.json({ ...pending[0], ...checkins[0], ...enquiries[0] });
  } catch (error) { next(error); }
});

module.exports = router;
