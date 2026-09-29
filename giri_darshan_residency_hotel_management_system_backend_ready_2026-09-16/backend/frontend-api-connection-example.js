// Simple frontend API helper for later connection work.
// Keep this separate until the team is ready to replace static/local frontend data.

const API_BASE = 'http://localhost:5000/api';

function getToken() {
  return localStorage.getItem('gdr_token');
}

async function apiRequest(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || 'API request failed.');
  }
  return data;
}

async function login(email, password, role) {
  const data = await apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password, role })
  });
  localStorage.setItem('gdr_token', data.token);
  localStorage.setItem('gdr_user', JSON.stringify(data.user));
  return data;
}

async function registerCustomer(firstName, lastName, email, phone, password) {
  const data = await apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ firstName, lastName, email, phone, password })
  });
  localStorage.setItem('gdr_token', data.token);
  localStorage.setItem('gdr_user', JSON.stringify(data.user));
  return data;
}

async function loadRoomTypes() {
  return apiRequest('/rooms/types');
}

async function createBooking(bookingData) {
  return apiRequest('/bookings', {
    method: 'POST',
    body: JSON.stringify(bookingData)
  });
}

async function loadCustomerDashboard() {
  return apiRequest('/dashboard/customer');
}

async function loadAdminDashboard() {
  return apiRequest('/dashboard/admin');
}
