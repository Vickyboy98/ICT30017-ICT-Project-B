const jwt = require('jsonwebtoken');
const { query } = require('../db');
const { randomUUID } = require('crypto');
if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET must be configured.');
const revokedTokens = new Map();
function pruneRevocations() {
  for (const [id, expiry] of revokedTokens) if (expiry <= Date.now() / 1000) revokedTokens.delete(id);
}
function revokeToken(req) {
  pruneRevocations();
  revokedTokens.set(req.auth.jti, req.auth.exp);
}

function signToken(user) {
  return jwt.sign(
    { id: user.id, role: user.role, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '1h', jwtid: randomUUID() }
  );
}

async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) return res.status(401).json({ message: 'Authentication required.' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
    pruneRevocations();
    if (!decoded.jti || revokedTokens.has(decoded.jti)) return res.status(401).json({ message: 'Session has ended. Please sign in again.' });
    req.auth = decoded;
    const users = await query(
      'SELECT id, first_name, last_name, email, phone, role, status FROM users WHERE id = :id LIMIT 1',
      { id: decoded.id }
    );
    if (!users.length || users[0].status !== 'active') {
      return res.status(401).json({ message: 'User is not active or does not exist.' });
    }
    req.user = users[0];
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'You do not have permission to access this resource.' });
    }
    next();
  };
}

module.exports = { signToken, requireAuth, requireRole, revokeToken };
