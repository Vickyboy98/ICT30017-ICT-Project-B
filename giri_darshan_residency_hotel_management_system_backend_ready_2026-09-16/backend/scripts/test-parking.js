require('dotenv').config();
const assert = require('node:assert/strict');
const express = require('express');
const { pool, query } = require('../src/db');
const { signToken } = require('../src/middleware/auth');
async function main() {
  const app = express(); app.use(express.json()); app.use(require('../src/routes/parking'));
  app.use((e,req,res,next)=>res.status(e.status || 500).json({message:e.message}));
  const server = app.listen(0,'127.0.0.1'); await new Promise(r=>server.once('listening',r));
  try {
    const [staff] = await query("SELECT * FROM users WHERE role='staff' AND status='active' LIMIT 1");
    const [booking] = await query("SELECT id FROM bookings WHERE booking_status IN ('awaiting_payment','confirmed') LIMIT 1");
    assert.ok(booking,'Test requires an open booking.');
    const spot = await query("INSERT INTO parking_spots (spot_code,spot_type,status) VALUES (?, 'car','available')",['QA-'+Date.now()]);
    const headers = {'Content-Type':'application/json',Authorization:'Bearer '+signToken(staff)};
    const base = 'http://127.0.0.1:'+server.address().port;
    const body = JSON.stringify({bookingId:booking.id,parkingSpotId:spot.insertId,vehicleNumber:'QA-TEST',vehicleType:'car'});
    const responses = await Promise.all([1,2].map(()=>fetch(base+'/allocate',{method:'POST',headers,body})));
    assert.deepEqual(responses.map(r=>r.status).sort(),[201,409]);
    const created = await responses.find(r=>r.status===201).json();
    const release = await fetch(base+'/allocations/'+created.id+'/release',{method:'PATCH',headers});
    assert.equal(release.status,200);
    assert.equal((await query('SELECT status FROM parking_spots WHERE id=?',[spot.insertId]))[0].status,'available');
    assert.equal((await fetch(base+'/allocations/'+created.id+'/release',{method:'PATCH',headers})).status,409);
    console.log('PASS concurrent allocation: one success, one conflict; release persisted; repeated release rejected. QA spot '+spot.insertId);
  } finally { server.close(); await pool.end(); }
}
main().catch(e=>{console.error(e);process.exitCode=1;});
