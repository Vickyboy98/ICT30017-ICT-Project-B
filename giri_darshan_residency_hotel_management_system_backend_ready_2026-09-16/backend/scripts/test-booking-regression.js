// Runs current route code on an ephemeral local port, using labelled local test records.
const assert = require('node:assert/strict');
require('dotenv').config();
const express = require('express');
const { pool, query } = require('../src/db');
const { signToken } = require('../src/middleware/auth');
async function main() {
  const app = express();
  app.use(express.json());
  app.use('/bookings', require('../src/routes/bookings'));
  app.use('/payments', require('../src/routes/payments'));
  app.use('/verifications', require('../src/routes/verifications'));
  app.use((e, req, res, next) => res.status(e.status || 500).json({ message: e.message }));
  const server = app.listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  try {
    const [user] = await query("SELECT * FROM users WHERE role = 'customer' AND status = 'active' LIMIT 1");
    const [type] = await query('SELECT * FROM room_types WHERE is_active = TRUE LIMIT 1');
    const token = signToken(user);
    const base = { roomTypeId: type.id, checkInDate: '2035-06-10', checkOutDate: '2035-06-11', adults: 0, seniors: 1, primaryGuestName: 'QA Booking Regression' };
    async function post(body) {
      const r = await fetch(`http://127.0.0.1:${server.address().port}/bookings`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(body) });
      return { status: r.status, data: await r.json() };
    }
    for (const value of [-1, 0.5, 'invalid']) {
      assert.equal((await post({ ...base, adults: value })).status, 400);
    }
    console.log('PASS invalid guest counts rejected');
    const result = await post(base);
    assert.equal(result.status, 201, JSON.stringify(result.data));
    const [booking] = await query('SELECT * FROM bookings WHERE id = ?', [result.data.id]);
    assert.ok(booking.room_id);
    const guests = await query('SELECT * FROM booking_guests WHERE booking_id = ?', [booking.id]);
    assert.equal(guests.length, 1);
    assert.equal(guests[0].guest_type, 'senior');
    assert.equal(guests[0].guest_name, base.primaryGuestName);
    console.log('PASS physical room allocated and senior-only guest count exact');
    assert.equal((await post({ ...base, roomId: booking.room_id })).status, 409);
    console.log('PASS overlapping booking rejected');
    const [staff] = await query("SELECT * FROM users WHERE role = 'staff' AND status = 'active' LIMIT 1");
    async function call(path, method, body, actor = user) {
      const r = await fetch(`http://127.0.0.1:${server.address().port}${path}`, { method, headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${signToken(actor)}` }, body: JSON.stringify(body) });
      return { status: r.status, data: await r.json() };
    }
    assert.equal((await call(`/bookings/${booking.id}/status`, 'PATCH', { status: 'checked_in' }, staff)).status, 409);
    assert.equal((await call(`/payments/${booking.id}`, 'POST', { paymentMethod: 'demo' })).status, 201);
    assert.equal((await call(`/payments/${booking.id}`, 'POST', { paymentMethod: 'demo' })).status, 409);
    const fileData = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aB9sAAAAASUVORK5CYII=';
    const upload = await call(`/verifications/${booking.id}/upload`, 'POST', { documentType: 'other', fileData });
    assert.equal(upload.status, 201, JSON.stringify(upload));
    const documentUrl = `http://127.0.0.1:${server.address().port}/verifications/documents/${upload.data.documentId}`;
    assert.equal((await fetch(documentUrl)).status, 401);
    const download = await fetch(documentUrl, { headers: { Authorization: `Bearer ${signToken(staff)}` } });
    assert.equal(download.status, 200);
    assert.deepEqual(Buffer.from(await download.arrayBuffer()), Buffer.from(fileData.split(',')[1], 'base64'));
    console.log('PASS actual document upload, authenticated retrieval and exact file bytes');
    assert.equal((await call(`/verifications/${upload.data.verificationId}/action`, 'PATCH', { action: 'verified' }, staff)).status, 200);
    assert.equal((await call(`/bookings/${booking.id}/status`, 'PATCH', { status: 'checked_in' }, staff)).status, 200);
    assert.equal((await query('SELECT status FROM rooms WHERE id = ?', [booking.room_id]))[0].status, 'occupied');
    assert.equal((await call(`/bookings/${booking.id}/status`, 'PATCH', { status: 'checked_out' }, staff)).status, 200);
    const [stay] = await query('SELECT * FROM check_in_out WHERE booking_id = ?', [booking.id]);
    assert.ok(stay.check_in_time && stay.check_out_time);
    const [activeAfterCheckout] = await query("SELECT COUNT(*) AS count FROM bookings WHERE room_id=? AND booking_status NOT IN ('cancelled','rejected','checked_out')", [booking.room_id]);
    assert.equal((await query('SELECT status FROM rooms WHERE id = ?', [booking.room_id]))[0].status, Number(activeAfterCheckout.count) ? 'booked' : 'available');
    console.log('PASS demo payment, duplicate prevention, metadata submission, verification, check-in/out timestamps and room status');
    assert.equal((await call(`/bookings/${booking.id}/status`, 'PATCH', {status:'cancelled'}, staff)).status, 409);
    const cancellable = await post({...base, checkInDate:'2035-07-10',checkOutDate:'2035-07-11'});
    assert.equal(cancellable.status,201);
    assert.equal((await call(`/bookings/${cancellable.data.id}/status`, 'PATCH', {status:'cancelled'}, staff)).status,200);
    const [cancelled] = await query('SELECT * FROM bookings WHERE id=?',[cancellable.data.id]);
    assert.equal(cancelled.booking_status,'cancelled');
    const [remaining] = await query("SELECT COUNT(*) AS count FROM bookings WHERE room_id=? AND booking_status NOT IN ('cancelled','rejected','checked_out')",[cancelled.room_id]);
    assert.equal((await query('SELECT status FROM rooms WHERE id=?',[cancelled.room_id]))[0].status,remaining.count ? 'booked' : 'available');
    console.log('PASS cancellation persisted, other reservations preserved, completed stay protected');
    console.log(`Retained QA booking ID ${booking.id} for inspection.`);
  } finally {
    await new Promise(resolve => server.close(resolve));
    await pool.end();
  }
}
main().catch(e => { console.error(e); process.exitCode = 1; });
