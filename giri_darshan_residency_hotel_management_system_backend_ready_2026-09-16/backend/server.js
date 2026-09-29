const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();
const { pool } = require('./src/db');

const authRoutes = require('./src/routes/auth');
const roomRoutes = require('./src/routes/rooms');
const bookingRoutes = require('./src/routes/bookings');
const paymentRoutes = require('./src/routes/payments');
const verificationRoutes = require('./src/routes/verifications');
const staffRoutes = require('./src/routes/staff');
const userRoutes = require('./src/routes/users');
const enquiryRoutes = require('./src/routes/enquiries');
const parkingRoutes = require('./src/routes/parking');
const energyRoutes = require('./src/routes/energy');
const dashboardRoutes = require('./src/routes/dashboard');

const app = express();
const allowedOrigins = (process.env.CORS_ORIGIN || '').split(',').map(s => s.trim()).filter(Boolean);
const isProduction = process.env.NODE_ENV === 'production';
if (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'change_this_to_a_long_random_secret' || process.env.JWT_SECRET.length < 32) {
  throw new Error('JWT_SECRET must be a unique secret of at least 32 characters.');
}

app.disable('x-powered-by');
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*') || origin === 'null') return callback(null, true);
    if (!isProduction) return callback(null, true);
    return callback(new Error('Origin is not allowed by CORS.'));
  },
  credentials: true
}));
app.use(express.json({ limit: '8mb' }));
app.use(express.urlencoded({ extended: true }));

const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 30, standardHeaders: 'draft-7', legacyHeaders: false, message: { message: 'Too many authentication attempts. Please try again later.' } });
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

app.get('/api/health', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT NOW() AS db_time');
    res.json({ status: 'ok', database: 'connected', dbTime: rows[0].db_time });
  } catch (error) {
    res.status(500).json({ status: 'error', database: 'not connected', message: error.message });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/verifications', verificationRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/users', userRoutes);
app.use('/api/enquiries', enquiryRoutes);
app.use('/api/parking', parkingRoutes);
app.use('/api/energy', energyRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.use((req, res) => res.status(404).json({ message: 'API route not found.' }));

app.use((error, req, res, next) => {
  console.error(error);
  if (error instanceof SyntaxError && error.type === 'entity.parse.failed') return res.status(400).json({ message: 'Request body contains invalid JSON.' });
  res.status(error.status || 500).json({ message: isProduction ? 'Server error.' : (error.message || 'Server error.'), details: isProduction ? undefined : error.stack });
});

const port = Number(process.env.PORT || 5000);
app.listen(port, () => {
  console.log(`Giri Darshan backend running on http://localhost:${port}`);
});
