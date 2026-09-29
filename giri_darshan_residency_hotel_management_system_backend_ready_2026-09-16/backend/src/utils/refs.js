function makeBookingRef() {
  const now = new Date();
  const year = now.getFullYear();
  const stamp = String(now.getTime()).slice(-6);
  return `GD-${year}-${stamp}`;
}

function makeInvoiceNumber() {
  const now = new Date();
  const year = now.getFullYear();
  const stamp = String(now.getTime()).slice(-6);
  return `INV-${year}-${stamp}`;
}

function nightsBetween(checkIn, checkOut) {
  const oneDay = 24 * 60 * 60 * 1000;
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  return Math.max(1, Math.round((end - start) / oneDay));
}

module.exports = { makeBookingRef, makeInvoiceNumber, nightsBetween };
