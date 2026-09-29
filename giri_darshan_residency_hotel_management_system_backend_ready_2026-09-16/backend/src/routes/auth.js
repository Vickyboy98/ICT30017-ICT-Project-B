const express = require('express');
const bcrypt = require('bcryptjs');
const { query, transaction } = require('../db');
const { signToken, requireAuth, revokeToken } = require('../middleware/auth');

const router = express.Router();

router.post('/register', async (req, res, next) => {
  try {
    const body = req.body || {};
    const clean = key => typeof body[key] === 'string' ? body[key].trim() : '';
    const firstName = clean('firstName'), lastName = clean('lastName');
    const email = clean('email').toLowerCase(), phone = clean('phone');
    const password = body.password;
    res.set('Cache-Control', 'no-store');
    if (body.role !== undefined && body.role !== 'customer') return res.status(403).json({ message: 'Staff and admin accounts must be created by an administrator.' });
    if (!firstName || !lastName || firstName.length > 80 || lastName.length > 80 || phone.length > 30 || (body.phone != null && typeof body.phone !== 'string')) return res.status(400).json({ message: 'Enter valid names (up to 80 characters each) and phone (up to 30 characters).' });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 160) return res.status(400).json({ message: 'Enter a valid email address.' });
    if (typeof password !== 'string' || password.length < 8 || Buffer.byteLength(password, 'utf8') > 72) return res.status(400).json({ message: 'Password must contain at least 8 characters and no more than 72 bytes.' });
    const passwordHash = await bcrypt.hash(password, 10);
    const result = await transaction(async conn => {
      const [created] = await conn.execute(
        "INSERT INTO users (first_name, last_name, email, phone, password_hash, role) VALUES (?, ?, ?, ?, ?, 'customer')",
        [firstName, lastName, email, phone || null, passwordHash]
      );
      await conn.execute('INSERT INTO customer_profiles (user_id) VALUES (?)', [created.insertId]);
      const user = { id: created.insertId, first_name: firstName, last_name: lastName, email, phone, role: 'customer', status: 'active' };
      return { user, token: signToken(user) };
    });
    res.status(201).json(result);
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') return res.status(409).json({ message: 'Email is already registered. Please sign in.' });
    next(error);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { password, role } = req.body;
    const email = typeof req.body.email === 'string' ? req.body.email.trim() : '';
    if (!email || email.length > 160 || typeof password !== 'string' || !password || Buffer.byteLength(password, 'utf8') > 72 || !['customer', 'staff', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Enter a valid email, password and login role.' });
    }
    res.set('Cache-Control', 'no-store');

    const users = await query('SELECT * FROM users WHERE email = :email LIMIT 1', { email });
    const user = users[0];
    const ok = user ? await bcrypt.compare(password, user.password_hash) : false;
    const roleOk = !role || (user && user.role === role);

    await query(
      `INSERT INTO login_activity (user_id, email_entered, role_attempted, login_status, ip_address, device_info)
       VALUES (:userId, :email, :role, :status, :ip, :device)`,
      {
        userId: user ? user.id : null,
        email,
        role: role || (user ? user.role : null),
        status: ok && roleOk && user.status === 'active' ? 'success' : 'failed',
        ip: req.ip,
        device: (req.headers['user-agent'] || '').slice(0, 255) || null
      }
    );

    if (!user || !ok) return res.status(401).json({ message: 'Invalid email or password.' });
    if (user.status !== 'active') return res.status(403).json({ message: 'This account is not active.' });
    if (!roleOk) return res.status(403).json({ message: `This account is registered as ${user.role}, not ${role}.` });

    const safeUser = {
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      status: user.status
    };
    res.json({ user: safeUser, token: signToken(safeUser) });
  } catch (error) {
    next(error);
  }
});

router.get('/me', requireAuth, async (req, res) => {
  res.set('Cache-Control', 'no-store');
  res.json({ user: req.user });
});

router.post('/logout', requireAuth, async (req, res, next) => {
  revokeToken(req);
  try {
    await query(
      `UPDATE login_activity SET logout_time = CURRENT_TIMESTAMP
       WHERE user_id = :userId AND logout_time IS NULL
       ORDER BY login_time DESC LIMIT 1`,
      { userId: req.user.id }
    );
    res.json({ message: 'Logged out successfully.' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
