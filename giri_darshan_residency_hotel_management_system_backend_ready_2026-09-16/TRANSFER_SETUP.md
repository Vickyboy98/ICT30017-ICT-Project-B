# Giri Darshan Residency — Transfer Setup

This package contains the frontend prototype, Node.js/Express backend, MySQL schema, API tests, and embedded management pages.

## Requirements on the new PC

- Node.js 18 or newer
- MySQL Server 8 or newer
- MySQL Workbench
- A browser

## 1. Create the MySQL database

1. Open MySQL Workbench and connect to the local MySQL server.
2. Open `backend/sql/01_schema.sql`.
3. Run the complete script.
4. Confirm that the `giri_darshan_db` database exists.

## 2. Configure the backend

Open PowerShell in the `backend` folder and run:

```powershell
Copy-Item .env.example .env
```

Edit `.env` and set your local MySQL password. Generate a new JWT secret for the new PC; do not copy the old `.env` file.

Example:

```env
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=giri_darshan_db
JWT_SECRET=use-a-new-random-secret-at-least-32-characters-long
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://127.0.0.1:5500,http://localhost:5500
```

## 3. Install backend packages and seed demo data

```powershell
cd backend
npm install
npm run seed
```

Demo accounts created by the seed script:

```text
Admin:    admin@giridarshan.com / Password123!
Staff:    staff@giridarshan.com / Password123!
Customer: customer@giridarshan.com / Password123!
```

## 4. Start the backend

From `backend`:

```powershell
npm start
```

Verify it at `http://localhost:5000/api/health`. The response should show `"database":"connected"`.

## 5. Start the frontend

Open a second PowerShell window in the project root:

```powershell
cd D:\path\to\giri_darshan_residency
python -m http.server 5500
```

If Python is unavailable, use any static HTTP server. Then open:

`http://127.0.0.1:5500/`

Do not open `index.html` directly with a `file://` URL because browser security rules can block API requests and iframe resources.

## 6. Run local checks

From `backend`:

```powershell
npm run check
node scripts/test-booking-regression.js
node scripts/test-parking.js
```

These tests intentionally create QA records in the local database.

## Notes

- Payment is currently a demo workflow.
- Uploaded verification documents are stored in `backend/private-documents` and are not publicly served.
- Before hosting, configure HTTPS, production secrets, a production database, and a real payment gateway.
