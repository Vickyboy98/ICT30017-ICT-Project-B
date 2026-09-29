// Database-ready clean version. Demo/generated records removed.
window.rooms = [];
window.parkingSpots = [];
window.staff = [];
window.bookings = [];
window.invoices = [];
window.securityLogs = [];
window.revenueData = [];

function initializeData() {
  window.rooms = [];
  window.parkingSpots = [];
  window.staff = [];
  window.bookings = [];
  window.invoices = [];
  window.securityLogs = [];
  window.revenueData = [];
}

function renderAll() {
  if (typeof renderRooms === 'function') renderRooms();
  if (typeof renderParking === 'function') renderParking();
  if (typeof updateStats === 'function') updateStats();
}

function getRandomDate() { return ''; }
function getRandomVehicle() { return ''; }
function getRandomGuestName() { return ''; }
function getGuests() { return []; }
