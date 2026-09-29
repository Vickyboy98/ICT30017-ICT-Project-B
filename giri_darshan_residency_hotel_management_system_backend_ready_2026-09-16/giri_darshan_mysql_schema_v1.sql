-- ============================================================
-- Giri Darshan Residency — MySQL Database Schema v1
-- Target: MySQL 8.0 / MySQL Workbench
-- Purpose: Clean database foundation for Project B backend/API
-- Notes:
--   1) This file creates tables only with minimal real/static room category seed data.
--   2) No fake customer bookings, payments, staff, invoices, or verification records are inserted.
--   3) Frontend should connect through a backend API, not directly from HTML/CSS/JS to MySQL.
-- ============================================================

CREATE DATABASE IF NOT EXISTS giri_darshan_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE giri_darshan_db;

-- Optional reset order for development only. Uncomment if you need to rebuild.
-- SET FOREIGN_KEY_CHECKS = 0;
-- DROP VIEW IF EXISTS vw_admin_dashboard_summary;
-- DROP VIEW IF EXISTS vw_customer_bookings;
-- DROP VIEW IF EXISTS vw_live_room_monitor;
-- DROP VIEW IF EXISTS vw_pending_staff_verifications;
-- DROP TABLE IF EXISTS audit_logs, notifications, invoices, payments, staff_verification_actions,
-- guest_verifications, guest_identification_documents, booking_guests, parking_allocations,
-- parking_spots, room_power_readings, room_sensors, equipment_faults, maintenance_requests,
-- staff_payroll, staff_shifts, staff_profiles, enquiries, bookings, rooms, room_type_amenities,
-- amenities, room_types, users;
-- SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================
-- 1. USERS AND ROLE-BASED LOGIN
-- Supports: Home -> Sign In -> Customer / Staff / Admin login
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    first_name      VARCHAR(80) NOT NULL,
    last_name       VARCHAR(80) NOT NULL,
    email           VARCHAR(160) NOT NULL UNIQUE,
    phone           VARCHAR(30),
    password_hash   VARCHAR(255) NOT NULL,
    role            VARCHAR(20) NOT NULL DEFAULT 'customer',
    status          VARCHAR(20) NOT NULL DEFAULT 'active',
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CHECK (role IN ('customer', 'staff', 'admin')),
    CHECK (status IN ('active', 'inactive', 'blocked'))
);

CREATE TABLE IF NOT EXISTS customer_profiles (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id         BIGINT NOT NULL UNIQUE,
    address_line    VARCHAR(255),
    city            VARCHAR(100),
    state_region    VARCHAR(100),
    country         VARCHAR(100),
    postcode        VARCHAR(20),
    loyalty_points  INT NOT NULL DEFAULT 0,
    membership_tier VARCHAR(30) NOT NULL DEFAULT 'Standard',
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CHECK (membership_tier IN ('Standard', 'Silver', 'Gold', 'Platinum'))
);

CREATE TABLE IF NOT EXISTS login_activity (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id         BIGINT,
    email_entered   VARCHAR(160),
    role_attempted  VARCHAR(20),
    login_status    VARCHAR(20) NOT NULL,
    ip_address      VARCHAR(60),
    device_info     VARCHAR(255),
    login_time      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    logout_time     TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    CHECK (role_attempted IS NULL OR role_attempted IN ('customer', 'staff', 'admin')),
    CHECK (login_status IN ('success', 'failed'))
);

-- ============================================================
-- 2. ROOMS, ROOM TYPES, AMENITIES
-- Supports: Rooms page, room details, booking, room management, live room management
-- ============================================================
CREATE TABLE IF NOT EXISTS room_types (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    type_name       VARCHAR(100) NOT NULL UNIQUE,
    description     TEXT,
    base_price_inr  DECIMAL(10,2) NULL,
    max_capacity    INT NULL,
    bed_details     VARCHAR(120),
    room_size_sqm   DECIMAL(6,2),
    image_path      VARCHAR(255),
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS amenities (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    amenity_name    VARCHAR(120) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS room_type_amenities (
    room_type_id    BIGINT NOT NULL,
    amenity_id      BIGINT NOT NULL,
    PRIMARY KEY (room_type_id, amenity_id),
    FOREIGN KEY (room_type_id) REFERENCES room_types(id) ON DELETE CASCADE,
    FOREIGN KEY (amenity_id) REFERENCES amenities(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS rooms (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    room_number     VARCHAR(20) NOT NULL UNIQUE,
    room_type_id    BIGINT NOT NULL,
    floor_number    INT,
    status          VARCHAR(30) NOT NULL DEFAULT 'available',
    housekeeping_status VARCHAR(30) NOT NULL DEFAULT 'clean',
    bedrooms        INT NULL,
    bathrooms       INT NULL,
    notes           TEXT,
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (room_type_id) REFERENCES room_types(id),
    CHECK (status IN ('available', 'booked', 'occupied', 'maintenance', 'inactive')),
    CHECK (housekeeping_status IN ('clean', 'dirty', 'in_progress', 'inspected'))
);

-- ============================================================
-- 3. BOOKINGS AND GUEST FLOW
-- Supports: Customer booking, booking management, guest-count validation
-- ============================================================
CREATE TABLE IF NOT EXISTS bookings (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    booking_ref     VARCHAR(40) NOT NULL UNIQUE,
    customer_id     BIGINT NOT NULL,
    room_id         BIGINT NULL,
    room_type_id    BIGINT NOT NULL,
    check_in_date   DATE NOT NULL,
    check_out_date  DATE NOT NULL,
    adults          INT NOT NULL DEFAULT 1,
    children        INT NOT NULL DEFAULT 0,
    seniors         INT NOT NULL DEFAULT 0,
    total_guests    INT NOT NULL DEFAULT 1,
    special_request TEXT,
    booking_status  VARCHAR(30) NOT NULL DEFAULT 'pending',
    total_amount_inr DECIMAL(10,2) NULL,
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES users(id),
    FOREIGN KEY (room_id) REFERENCES rooms(id),
    FOREIGN KEY (room_type_id) REFERENCES room_types(id),
    CHECK (check_out_date > check_in_date),
    CHECK (adults >= 0 AND children >= 0 AND seniors >= 0 AND total_guests >= 1),
    CHECK (booking_status IN ('pending', 'awaiting_payment', 'awaiting_verification', 'confirmed', 'checked_in', 'checked_out', 'cancelled', 'rejected'))
);

CREATE TABLE IF NOT EXISTS booking_guests (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    booking_id      BIGINT NOT NULL,
    guest_name      VARCHAR(160) NOT NULL,
    guest_type      VARCHAR(20) NOT NULL DEFAULT 'adult',
    age             INT NULL,
    is_primary      BOOLEAN NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    CHECK (guest_type IN ('adult', 'child', 'senior'))
);

CREATE TABLE IF NOT EXISTS check_in_out (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    booking_id      BIGINT NOT NULL UNIQUE,
    checked_in_by   BIGINT NULL,
    checked_out_by  BIGINT NULL,
    check_in_time   TIMESTAMP NULL,
    check_out_time  TIMESTAMP NULL,
    check_in_notes  TEXT,
    check_out_notes TEXT,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    FOREIGN KEY (checked_in_by) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (checked_out_by) REFERENCES users(id) ON DELETE SET NULL
);

-- ============================================================
-- 4. PAYMENTS AND INVOICES
-- Supports: Booking payment flow, admin Payments & Invoices
-- Customer standalone payment/invoice page can remain disabled if not needed.
-- ============================================================
CREATE TABLE IF NOT EXISTS payments (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    booking_id      BIGINT NOT NULL,
    payment_method  VARCHAR(40) NOT NULL,
    payment_status  VARCHAR(30) NOT NULL DEFAULT 'pending',
    amount_inr      DECIMAL(10,2) NOT NULL,
    transaction_ref VARCHAR(120),
    paid_at         TIMESTAMP NULL,
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    CHECK (payment_method IN ('card', 'gpay', 'upi', 'paytm', 'cash', 'bank_transfer', 'demo')),
    CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded', 'cancelled'))
);

CREATE TABLE IF NOT EXISTS invoices (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    invoice_number  VARCHAR(50) NOT NULL UNIQUE,
    booking_id      BIGINT NOT NULL,
    payment_id      BIGINT NULL,
    subtotal_inr    DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    tax_inr         DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    total_inr       DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    invoice_status  VARCHAR(30) NOT NULL DEFAULT 'draft',
    issued_at       TIMESTAMP NULL,
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    FOREIGN KEY (payment_id) REFERENCES payments(id) ON DELETE SET NULL,
    CHECK (invoice_status IN ('draft', 'issued', 'paid', 'void'))
);

-- ============================================================
-- 5. GUEST IDENTIFICATION AND STAFF VERIFICATION
-- Supports: Guest Verification and Staff Document Verification
-- ============================================================
CREATE TABLE IF NOT EXISTS guest_identification_documents (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    booking_id      BIGINT NOT NULL,
    uploaded_by     BIGINT NOT NULL,
    document_type   VARCHAR(50) NOT NULL,
    document_number VARCHAR(100),
    file_path       VARCHAR(255),
    document_status VARCHAR(30) NOT NULL DEFAULT 'submitted',
    submitted_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE CASCADE,
    CHECK (document_type IN ('passport', 'aadhaar_card', 'drivers_license', 'national_id', 'other')),
    CHECK (document_status IN ('submitted', 'under_review', 'verified', 'rejected'))
);

CREATE TABLE IF NOT EXISTS guest_verifications (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    booking_id      BIGINT NOT NULL UNIQUE,
    document_id     BIGINT NULL,
    verification_status VARCHAR(30) NOT NULL DEFAULT 'pending',
    verified_by     BIGINT NULL,
    verified_at     TIMESTAMP NULL,
    rejection_reason TEXT,
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    FOREIGN KEY (document_id) REFERENCES guest_identification_documents(id) ON DELETE SET NULL,
    FOREIGN KEY (verified_by) REFERENCES users(id) ON DELETE SET NULL,
    CHECK (verification_status IN ('pending', 'under_review', 'verified', 'rejected', 'check_in_confirmed'))
);

CREATE TABLE IF NOT EXISTS staff_verification_actions (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    verification_id BIGINT NOT NULL,
    staff_id        BIGINT NOT NULL,
    action_type     VARCHAR(30) NOT NULL,
    notes           TEXT,
    action_time     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (verification_id) REFERENCES guest_verifications(id) ON DELETE CASCADE,
    FOREIGN KEY (staff_id) REFERENCES users(id),
    CHECK (action_type IN ('viewed', 'verified', 'rejected', 'confirmed_check_in'))
);

-- ============================================================
-- 6. STAFF MANAGEMENT
-- Supports: Staff Management page, shifts, weekly hours, payroll
-- ============================================================
CREATE TABLE IF NOT EXISTS staff_profiles (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id         BIGINT NOT NULL UNIQUE,
    employee_code   VARCHAR(40) NOT NULL UNIQUE,
    department      VARCHAR(80),
    job_title       VARCHAR(80),
    hourly_rate_inr DECIMAL(10,2) NULL,
    hire_date       DATE,
    employment_status VARCHAR(30) NOT NULL DEFAULT 'active',
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CHECK (employment_status IN ('active', 'inactive', 'on_leave', 'terminated'))
);

CREATE TABLE IF NOT EXISTS staff_shifts (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    staff_profile_id BIGINT NOT NULL,
    shift_date      DATE NOT NULL,
    clock_in        TIME NULL,
    clock_out       TIME NULL,
    break_minutes   INT NOT NULL DEFAULT 0,
    shift_status    VARCHAR(30) NOT NULL DEFAULT 'scheduled',
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (staff_profile_id) REFERENCES staff_profiles(id) ON DELETE CASCADE,
    CHECK (shift_status IN ('scheduled', 'completed', 'missed', 'cancelled'))
);

CREATE TABLE IF NOT EXISTS staff_payroll (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    staff_profile_id BIGINT NOT NULL,
    week_start_date DATE NOT NULL,
    week_end_date   DATE NOT NULL,
    total_hours     DECIMAL(7,2) NOT NULL DEFAULT 0.00,
    hourly_rate_inr DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    gross_pay_inr   DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    payroll_status  VARCHAR(30) NOT NULL DEFAULT 'draft',
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (staff_profile_id) REFERENCES staff_profiles(id) ON DELETE CASCADE,
    CHECK (payroll_status IN ('draft', 'approved', 'paid'))
);

-- ============================================================
-- 7. ENQUIRIES / CONTACT
-- Supports: Contact form and admin/staff enquiry management
-- ============================================================
CREATE TABLE IF NOT EXISTS enquiries (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    customer_id     BIGINT NULL,
    name            VARCHAR(160) NOT NULL,
    email           VARCHAR(160) NOT NULL,
    phone           VARCHAR(30),
    subject         VARCHAR(180),
    message         TEXT NOT NULL,
    enquiry_status  VARCHAR(30) NOT NULL DEFAULT 'new',
    assigned_to     BIGINT NULL,
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL,
    CHECK (enquiry_status IN ('new', 'open', 'in_progress', 'responded', 'closed'))
);

-- ============================================================
-- 8. PARKING MANAGEMENT
-- Supports: Parking page, parking status, booking parking allocation
-- ============================================================
CREATE TABLE IF NOT EXISTS parking_spots (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    spot_code       VARCHAR(30) NOT NULL UNIQUE,
    spot_type       VARCHAR(30) NOT NULL DEFAULT 'car',
    floor_or_zone   VARCHAR(60),
    status          VARCHAR(30) NOT NULL DEFAULT 'available',
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CHECK (spot_type IN ('bike', 'car', 'van', 'bus', 'driver_accommodation')),
    CHECK (status IN ('available', 'occupied', 'reserved', 'maintenance', 'inactive'))
);

CREATE TABLE IF NOT EXISTS parking_allocations (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    booking_id      BIGINT NOT NULL,
    parking_spot_id BIGINT NOT NULL,
    vehicle_number  VARCHAR(40),
    vehicle_type    VARCHAR(30),
    driver_accommodation_required BOOLEAN NOT NULL DEFAULT FALSE,
    allocation_status VARCHAR(30) NOT NULL DEFAULT 'reserved',
    start_datetime  DATETIME NULL,
    end_datetime    DATETIME NULL,
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    FOREIGN KEY (parking_spot_id) REFERENCES parking_spots(id),
    CHECK (vehicle_type IS NULL OR vehicle_type IN ('bike', 'car', 'van', 'bus')),
    CHECK (allocation_status IN ('reserved', 'active', 'completed', 'cancelled'))
);

-- ============================================================
-- 9. ENERGY USAGE AND MAINTENANCE
-- Supports: Energy Usage Overview, power consumption, sensor health, equipment faults
-- ============================================================
CREATE TABLE IF NOT EXISTS room_sensors (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    room_id         BIGINT NOT NULL,
    sensor_code     VARCHAR(80) NOT NULL UNIQUE,
    sensor_type     VARCHAR(50) NOT NULL DEFAULT 'power_meter',
    sensor_status   VARCHAR(30) NOT NULL DEFAULT 'active',
    installed_at    DATE NULL,
    last_seen_at    TIMESTAMP NULL,
    FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE,
    CHECK (sensor_type IN ('power_meter', 'temperature', 'occupancy', 'equipment')),
    CHECK (sensor_status IN ('active', 'inactive', 'faulty', 'maintenance'))
);

CREATE TABLE IF NOT EXISTS room_power_readings (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    room_id         BIGINT NOT NULL,
    sensor_id       BIGINT NULL,
    reading_time    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    kwh_usage       DECIMAL(10,3) NOT NULL,
    usage_level     VARCHAR(20) NOT NULL DEFAULT 'normal',
    FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE,
    FOREIGN KEY (sensor_id) REFERENCES room_sensors(id) ON DELETE SET NULL,
    CHECK (usage_level IN ('low', 'normal', 'medium', 'high', 'critical'))
);

CREATE TABLE IF NOT EXISTS equipment_faults (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    room_id         BIGINT NOT NULL,
    sensor_id       BIGINT NULL,
    equipment_name  VARCHAR(120) NOT NULL,
    fault_description TEXT,
    fault_status    VARCHAR(30) NOT NULL DEFAULT 'reported',
    priority        VARCHAR(20) NOT NULL DEFAULT 'medium',
    reported_at     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    resolved_at     TIMESTAMP NULL,
    FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE,
    FOREIGN KEY (sensor_id) REFERENCES room_sensors(id) ON DELETE SET NULL,
    CHECK (fault_status IN ('reported', 'in_progress', 'resolved', 'closed')),
    CHECK (priority IN ('low', 'medium', 'high', 'critical'))
);

CREATE TABLE IF NOT EXISTS maintenance_requests (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    room_id         BIGINT NOT NULL,
    reported_by     BIGINT NULL,
    assigned_to     BIGINT NULL,
    issue_type      VARCHAR(80) NOT NULL,
    description     TEXT,
    priority        VARCHAR(20) NOT NULL DEFAULT 'medium',
    status          VARCHAR(30) NOT NULL DEFAULT 'open',
    reported_at     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    completed_at    TIMESTAMP NULL,
    FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE,
    FOREIGN KEY (reported_by) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL,
    CHECK (priority IN ('low', 'medium', 'high', 'critical')),
    CHECK (status IN ('open', 'assigned', 'in_progress', 'completed', 'cancelled'))
);

-- ============================================================
-- 10. NOTIFICATIONS AND AUDIT LOGS
-- Supports: admin/user accountability and future dashboard alerts
-- ============================================================
CREATE TABLE IF NOT EXISTS notifications (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id         BIGINT NOT NULL,
    title           VARCHAR(180) NOT NULL,
    message         TEXT NOT NULL,
    notification_type VARCHAR(40) NOT NULL DEFAULT 'general',
    is_read         BOOLEAN NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CHECK (notification_type IN ('booking', 'payment', 'verification', 'maintenance', 'energy', 'parking', 'general'))
);

CREATE TABLE IF NOT EXISTS audit_logs (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id         BIGINT NULL,
    action_name     VARCHAR(120) NOT NULL,
    entity_name     VARCHAR(120),
    entity_id       BIGINT,
    old_value_json  JSON NULL,
    new_value_json  JSON NULL,
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- ============================================================
-- 11. INDEXES
-- ============================================================
CREATE INDEX idx_users_role_status ON users(role, status);
CREATE INDEX idx_bookings_customer ON bookings(customer_id);
CREATE INDEX idx_bookings_status_dates ON bookings(booking_status, check_in_date, check_out_date);
CREATE INDEX idx_rooms_status ON rooms(status);
CREATE INDEX idx_payments_status ON payments(payment_status);
CREATE INDEX idx_enquiries_status ON enquiries(enquiry_status);
CREATE INDEX idx_parking_status ON parking_spots(status);
CREATE INDEX idx_power_room_time ON room_power_readings(room_id, reading_time);
CREATE INDEX idx_verification_status ON guest_verifications(verification_status);

-- ============================================================
-- 12. VIEWS FOR FRONTEND/API READS
-- These make backend endpoint creation easier later.
-- ============================================================
CREATE OR REPLACE VIEW vw_customer_bookings AS
SELECT
    b.id AS booking_id,
    b.booking_ref,
    b.customer_id,
    CONCAT(u.first_name, ' ', u.last_name) AS customer_name,
    rt.type_name AS room_type,
    r.room_number,
    b.check_in_date,
    b.check_out_date,
    b.total_guests,
    b.booking_status,
    b.total_amount_inr,
    COALESCE(p.payment_status, 'pending') AS payment_status,
    COALESCE(gv.verification_status, 'pending') AS verification_status
FROM bookings b
JOIN users u ON u.id = b.customer_id
JOIN room_types rt ON rt.id = b.room_type_id
LEFT JOIN rooms r ON r.id = b.room_id
LEFT JOIN payments p ON p.booking_id = b.id
LEFT JOIN guest_verifications gv ON gv.booking_id = b.id;

CREATE OR REPLACE VIEW vw_live_room_monitor AS
SELECT
    r.id AS room_id,
    r.room_number,
    r.floor_number,
    rt.type_name AS room_type,
    r.status AS room_status,
    r.housekeeping_status,
    b.booking_ref,
    CONCAT(u.first_name, ' ', u.last_name) AS current_guest,
    b.check_in_date,
    b.check_out_date,
    latest_power.kwh_usage AS latest_kwh_usage,
    latest_power.usage_level AS energy_usage_level
FROM rooms r
JOIN room_types rt ON rt.id = r.room_type_id
LEFT JOIN bookings b ON b.room_id = r.id AND b.booking_status IN ('confirmed', 'checked_in')
LEFT JOIN users u ON u.id = b.customer_id
LEFT JOIN (
    SELECT pr1.room_id, pr1.kwh_usage, pr1.usage_level
    FROM room_power_readings pr1
    JOIN (
        SELECT room_id, MAX(reading_time) AS max_reading_time
        FROM room_power_readings
        GROUP BY room_id
    ) pr2 ON pr2.room_id = pr1.room_id AND pr2.max_reading_time = pr1.reading_time
) latest_power ON latest_power.room_id = r.id;

CREATE OR REPLACE VIEW vw_pending_staff_verifications AS
SELECT
    gv.id AS verification_id,
    b.booking_ref,
    CONCAT(u.first_name, ' ', u.last_name) AS guest_name,
    rt.type_name AS room_type,
    r.room_number,
    b.check_in_date,
    b.check_out_date,
    gid.document_type,
    gid.document_status,
    gv.verification_status,
    gv.created_at
FROM guest_verifications gv
JOIN bookings b ON b.id = gv.booking_id
JOIN users u ON u.id = b.customer_id
JOIN room_types rt ON rt.id = b.room_type_id
LEFT JOIN rooms r ON r.id = b.room_id
LEFT JOIN guest_identification_documents gid ON gid.id = gv.document_id
WHERE gv.verification_status IN ('pending', 'under_review');

CREATE OR REPLACE VIEW vw_admin_dashboard_summary AS
SELECT
    (SELECT COUNT(*) FROM rooms) AS total_rooms,
    (SELECT COUNT(*) FROM rooms WHERE status = 'available') AS available_rooms,
    (SELECT COUNT(*) FROM rooms WHERE status = 'booked') AS booked_rooms,
    (SELECT COUNT(*) FROM rooms WHERE status = 'occupied') AS occupied_rooms,
    (SELECT COUNT(*) FROM rooms WHERE status = 'maintenance') AS maintenance_rooms,
    (SELECT COUNT(*) FROM bookings WHERE booking_status IN ('confirmed', 'checked_in')) AS active_bookings,
    (SELECT COUNT(*) FROM parking_spots WHERE status = 'available') AS available_parking_spots,
    (SELECT COALESCE(SUM(amount_inr), 0) FROM payments WHERE payment_status = 'paid') AS total_paid_revenue_inr,
    (SELECT COUNT(*) FROM enquiries WHERE enquiry_status IN ('new', 'open', 'in_progress')) AS open_enquiries,
    (SELECT COUNT(*) FROM guest_verifications WHERE verification_status IN ('pending', 'under_review')) AS pending_verifications;

-- ============================================================
-- 13. MINIMAL REAL/STATIC SEED DATA
-- This is not fake customer/admin operation data. It only matches website room categories and amenities.
-- Prices/capacity are left NULL until client confirms actual values.
-- ============================================================
INSERT IGNORE INTO room_types (type_name, description, image_path) VALUES
('Non-A/C Room', 'Non-air-conditioned room category.', 'assets/images/a99a67ab-9570-4c9e-80af-f6fa0519f362.jpg'),
('A/C Room', 'Air-conditioned room category.', 'assets/images/e6aa0563-b200-485d-965d-f189869b6029.jpg'),
('Deluxe A/C Room', 'Deluxe air-conditioned room category.', 'assets/images/0f8f37e2-1ed3-43f7-a050-f7d2c035609a.jpg'),
('Suite Room', 'Suite room category.', 'assets/images/d78927e1-3aca-435d-9ab6-8520f17f1c34.jpg'),
('Suite Room non-A/C', 'Non-air-conditioned suite room category.', 'assets/images/6b51c8f2-69d8-4935-8296-590d2def0431.jpg');

INSERT IGNORE INTO amenities (amenity_name) VALUES
('Air conditioning'),
('Car parking available on cost'),
('Lift available'),
('WiFi available'),
('TV with cable'),
('Hot water 24/7'),
('Filtered drinking water'),
('Extra bedcot available'),
('Suite check-in and check-out'),
('Driver cabin with restroom');

-- Link common amenities to all room types where appropriate.
INSERT IGNORE INTO room_type_amenities (room_type_id, amenity_id)
SELECT rt.id, a.id
FROM room_types rt
JOIN amenities a ON a.amenity_name IN ('Car parking available on cost', 'Lift available', 'WiFi available', 'TV with cable', 'Hot water 24/7', 'Filtered drinking water');

INSERT IGNORE INTO room_type_amenities (room_type_id, amenity_id)
SELECT rt.id, a.id
FROM room_types rt
JOIN amenities a ON a.amenity_name = 'Air conditioning'
WHERE rt.type_name IN ('A/C Room', 'Deluxe A/C Room');

INSERT IGNORE INTO room_type_amenities (room_type_id, amenity_id)
SELECT rt.id, a.id
FROM room_types rt
JOIN amenities a ON a.amenity_name = 'Extra bedcot available'
WHERE rt.type_name IN ('Non-A/C Room', 'Deluxe A/C Room');

INSERT IGNORE INTO room_type_amenities (room_type_id, amenity_id)
SELECT rt.id, a.id
FROM room_types rt
JOIN amenities a ON a.amenity_name IN ('Suite check-in and check-out', 'Driver cabin with restroom')
WHERE rt.type_name IN ('Suite Room', 'Suite Room non-A/C');

-- ============================================================
-- End of schema v1
-- ============================================================
