// Records SIMULATED room power readings into hotel_db.room_power_usage so the energy
// dashboard has readings over time. There is no physical meter feed, so each value is
// generated from the room's first recorded reading with realistic variation:
//   AC follows the time of day, TVs are sometimes off, microwaves are mostly on standby.
// Only occupied rooms get readings, one batch per run sharing a single timestamp.
//
// Usage (from the backend folder):
//   node scripts/record-energy-readings.js              one batch now
//   node scripts/record-energy-readings.js --dry-run    show the batch without saving
//   node scripts/record-energy-readings.js --backfill 6 six hourly batches ending now
//   node scripts/record-energy-readings.js --every 15   keep recording every 15 minutes
require('dotenv').config();
const { query, pool } = require('../src/db');

const db = '`' + (process.env.HOTEL_ENERGY_DB_NAME || 'hotel_db') + '`';
if (!/^`[A-Za-z0-9_]+`$/.test(db)) throw new Error('HOTEL_ENERGY_DB_NAME may only contain letters, numbers and underscores.');

const args = process.argv.slice(2);
const option = name => {
  const i = args.indexOf(name);
  return i === -1 ? null : Number(args[i + 1]);
};
const dryRun = args.includes('--dry-run');
const backfill = option('--backfill');
const every = option('--every');
const intervalMinutes = option('--interval') || 60;

const between = (min, max) => min + Math.random() * (max - min);

// Cooling demand peaks mid-afternoon and is lowest before dawn.
function acFactor(date) {
  const hour = date.getHours() + date.getMinutes() / 60;
  return 0.55 + 0.6 * Math.max(0, Math.sin((Math.PI * (hour - 7)) / 15));
}

// Typical ranges: TV 40-180 W when on, microwave 625-2,000 W only while heating, about
// 3 W on standby (Electrical Safety Office QLD; standby survey data).
function simulate(base, previous, at) {
  // Appliances tend to stay in the state they were in: a TV that was on usually stays on,
  // and occasionally a microwave is left running into the next reading.
  const tvWasOn = previous && previous.tv >= 40;
  const microwaveWasOn = previous && previous.microwave >= 600;
  const tvOn = Math.random() < (tvWasOn ? 0.8 : 0.35);
  const microwaveOn = Math.random() < (microwaveWasOn ? 0.35 : 0.08);
  return {
    ac: Math.round(Math.min(2400, base.ac * acFactor(at) * between(0.85, 1.15))),
    tv: tvOn ? Math.round(Math.min(180, Math.max(40, base.tv) * between(0.8, 1.2))) : Math.round(between(1, 4)),
    microwave: microwaveOn ? Math.round(between(750, 1200)) : Math.round(between(1, 4))
  };
}

async function recordBatch(at) {
  // The first reading for each room is the baseline, so repeated runs do not drift.
  const rooms = await query(`
    SELECT r.id, r.room_number, base.ac_watts, base.tv_watts,
           prev.tv_watts AS prev_tv, prev.microwave_watts AS prev_microwave
    FROM ${db}.rooms r
    LEFT JOIN (
      SELECT u.room_id, u.ac_watts, u.tv_watts FROM ${db}.room_power_usage u
      JOIN (SELECT room_id, MIN(id) AS id FROM ${db}.room_power_usage GROUP BY room_id) first
        ON first.id = u.id
    ) base ON base.room_id = r.id
    LEFT JOIN (
      SELECT u.room_id, u.tv_watts, u.microwave_watts FROM ${db}.room_power_usage u
      JOIN (SELECT room_id, MAX(id) AS id FROM ${db}.room_power_usage GROUP BY room_id) last
        ON last.id = u.id
    ) prev ON prev.room_id = r.id
    WHERE r.status = 'occupied'
    ORDER BY r.room_number
  `);
  const rows = rooms.map(r => ({
    roomId: r.id,
    roomNumber: r.room_number,
    ...simulate(
      { ac: Number(r.ac_watts) || 700, tv: Number(r.tv_watts) || 80 },
      r.prev_tv === null ? null : { tv: Number(r.prev_tv), microwave: Number(r.prev_microwave) },
      at
    )
  }));
  if (!dryRun) {
    for (const row of rows) {
      await query(
        `INSERT INTO ${db}.room_power_usage (room_id, tv_watts, ac_watts, microwave_watts, recorded_at)
         VALUES (:roomId, :tv, :ac, :microwave, :at)`,
        { ...row, at }
      );
    }
  }
  const total = rows.reduce((sum, r) => sum + r.ac + r.tv + r.microwave, 0);
  console.log(
    `${dryRun ? '[dry run] ' : ''}${at.toLocaleString('en-AU')} · ${rows.length} occupied rooms · ${total.toLocaleString('en-AU')} W total`
  );
  if (dryRun) console.table(rows);
}

async function main() {
  const now = new Date();
  now.setSeconds(0, 0);
  if (backfill) {
    for (let i = backfill - 1; i >= 0; i--) await recordBatch(new Date(now - i * intervalMinutes * 60000));
  } else {
    await recordBatch(now);
  }
  if (!every) return pool.end();
  console.log(`Recording every ${every} minutes. Press Ctrl+C to stop.`);
  setInterval(() => recordBatch(new Date()).catch(error => console.error('Recording failed:', error.message)), every * 60000);
}

main().catch(async error => {
  console.error('Recording failed:', error.message);
  await pool.end();
  process.exit(1);
});
