const bcrypt = require('bcryptjs');
require('dotenv').config();
const { query, pool } = require('../src/db');

async function upsertUser({ firstName, lastName, email, phone, password, role }) {
  const passwordHash = await bcrypt.hash(password, 10);
  const existing = await query('SELECT id FROM users WHERE email = :email LIMIT 1', { email });
  if (existing.length) {
    await query(
      `UPDATE users SET first_name = :firstName, last_name = :lastName, phone = :phone, password_hash = :passwordHash, role = :role, status = 'active'
       WHERE email = :email`,
      { firstName, lastName, email, phone, passwordHash, role }
    );
    return existing[0].id;
  }
  const result = await query(
    `INSERT INTO users (first_name, last_name, email, phone, password_hash, role)
     VALUES (:firstName, :lastName, :email, :phone, :passwordHash, :role)`,
    { firstName, lastName, email, phone, passwordHash, role }
  );
  return result.insertId;
}

async function main() {
  console.log('Seeding development data...');
  const password = 'Password123!';
  const adminId = await upsertUser({ firstName: 'Admin', lastName: 'User', email: 'admin@giridarshan.com', phone: '9000000001', password, role: 'admin' });
  const staffId = await upsertUser({ firstName: 'Front', lastName: 'Desk', email: 'staff@giridarshan.com', phone: '9000000002', password, role: 'staff' });
  const customerId = await upsertUser({ firstName: 'Demo', lastName: 'Customer', email: 'customer@giridarshan.com', phone: '9000000003', password, role: 'customer' });

  await query('INSERT IGNORE INTO customer_profiles (user_id, city, state_region, country, membership_tier) VALUES (:customerId, \'Kanchipuram\', \'Tamil Nadu\', \'India\', \'Standard\')', { customerId });
  await query(
    `INSERT INTO staff_profiles (user_id, employee_code, department, job_title, hourly_rate_inr, hire_date)
     VALUES (:staffId, 'GDR-STF-001', 'Front Office', 'Reception Staff', 180.00, CURDATE())
     ON DUPLICATE KEY UPDATE department = VALUES(department), job_title = VALUES(job_title), hourly_rate_inr = VALUES(hourly_rate_inr)`,
    { staffId }
  );

  await query(`
    UPDATE room_types SET
      base_price_inr = CASE type_name
        WHEN 'Non-A/C Room' THEN 1800
        WHEN 'A/C Room' THEN 2800
        WHEN 'Deluxe A/C Room' THEN 4200
        WHEN 'Suite Room' THEN 6500
        WHEN 'Suite Room non-A/C' THEN 5200
        ELSE base_price_inr
      END,
      max_capacity = CASE type_name
        WHEN 'Non-A/C Room' THEN 2
        WHEN 'A/C Room' THEN 2
        WHEN 'Deluxe A/C Room' THEN 3
        WHEN 'Suite Room' THEN 4
        WHEN 'Suite Room non-A/C' THEN 4
        ELSE max_capacity
      END,
      bed_details = CASE type_name
        WHEN 'Non-A/C Room' THEN 'Double Bed'
        WHEN 'A/C Room' THEN 'Double Bed'
        WHEN 'Deluxe A/C Room' THEN 'King Bed + Extra Bed Option'
        WHEN 'Suite Room' THEN 'King Bed + Living Area'
        WHEN 'Suite Room non-A/C' THEN 'King Bed + Living Area'
        ELSE bed_details
      END
  `);

  const roomTypes = await query('SELECT id, type_name FROM room_types');
  const byName = Object.fromEntries(roomTypes.map(r => [r.type_name, r.id]));
  const rooms = [
    ['101', 'Non-A/C Room', 1], ['102', 'A/C Room', 1], ['103', 'Deluxe A/C Room', 1], ['104', 'Suite Room', 1], ['105', 'Suite Room non-A/C', 1],
    ['201', 'Non-A/C Room', 2], ['202', 'A/C Room', 2], ['203', 'Deluxe A/C Room', 2], ['204', 'Suite Room', 2], ['205', 'A/C Room', 2],
    ['301', 'Non-A/C Room', 3], ['302', 'A/C Room', 3], ['303', 'Deluxe A/C Room', 3], ['304', 'Suite Room', 3], ['305', 'A/C Room', 3]
  ];
  for (const [number, type, floor] of rooms) {
    await query(
      `INSERT INTO rooms (room_number, room_type_id, floor_number, status, housekeeping_status)
       VALUES (:number, :typeId, :floor, 'available', 'clean')
       ON DUPLICATE KEY UPDATE room_type_id = VALUES(room_type_id), floor_number = VALUES(floor_number)`,
      { number, typeId: byName[type], floor }
    );
  }

  for (let i = 1; i <= 30; i++) {
    const spotCode = `P-${String(i).padStart(2, '0')}`;
    await query(
      `INSERT INTO parking_spots (spot_code, spot_type, floor_or_zone, status)
       VALUES (:spotCode, 'car', 'Main Parking', 'available')
       ON DUPLICATE KEY UPDATE spot_type = VALUES(spot_type), floor_or_zone = VALUES(floor_or_zone)`,
      { spotCode }
    );
  }

  const roomRows = await query('SELECT id, room_number FROM rooms');
  for (const room of roomRows) {
    await query(
      `INSERT INTO room_sensors (room_id, sensor_code, sensor_type, sensor_status, installed_at)
       VALUES (:roomId, :sensorCode, 'power_meter', 'active', CURDATE())
       ON DUPLICATE KEY UPDATE sensor_status = 'active'`,
      { roomId: room.id, sensorCode: `PWR-${room.room_number}` }
    );
  }

  console.log('Seed completed. Test logins:');
  console.log('Admin:    admin@giridarshan.com / Password123!');
  console.log('Staff:    staff@giridarshan.com / Password123!');
  console.log('Customer: customer@giridarshan.com / Password123!');
  await pool.end();
}

main().catch(async (error) => {
  console.error('Seed failed:', error.message);
  console.error(error);
  await pool.end();
  process.exit(1);
});
