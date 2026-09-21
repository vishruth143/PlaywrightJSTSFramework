const { test, expect } = require('@playwright/test');

const BASE_URL = 'https://eventhub.rahulshettyacademy.com';
const EMAIL = 'test@email.com';
const PASSWORD = 'Test@1234';

async function login(page) {
  await page.goto(`${BASE_URL}/login`);
  await page.getByPlaceholder('you@email.com').fill(EMAIL);
  await page.getByLabel('Password').fill(PASSWORD);
  await page.locator('#login-btn').click();
  await expect(page.getByRole('link', { name: 'Browse Events →' })).toBeVisible();
}

function futureDateValue() {
  const future = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // +7 days
  const pad = (n) => String(n).padStart(2, '0');
  const yyyy = future.getFullYear();
  const mm = pad(future.getMonth() + 1);
  const dd = pad(future.getDate());
  const hh = pad(future.getHours());
  const min = pad(future.getMinutes());
  return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
}

test('create event, book it, and verify seat count drops by 1', async ({ page }) => {
  const eventTitle = `Test Event ${Date.now()}`;

  // Step 1 — Login
  await login(page);

  // Step 2 — Create a new event
  await page.goto(`${BASE_URL}/admin/events`);
  await page.locator('#event-title-input').fill(eventTitle);
  await page.locator('#admin-event-form textarea').fill('Automated test event description');
  await page.getByLabel('City').fill('Bengaluru');
  await page.getByLabel('Venue').fill('Test Venue');
  await page.getByLabel('Event Date & Time').fill(futureDateValue());
  await page.getByLabel('Price ($)').fill('100');
  await page.getByLabel('Total Seats').fill('50');
  await page.locator('#add-event-btn').click();
  await expect(page.getByText('Event created!')).toBeVisible();

  // Step 3 — Find the event card and capture seats
  await page.goto(`${BASE_URL}/events`);
  const eventCards = page.locator('[data-testid="event-card"]');
  await expect(eventCards.first()).toBeVisible();

  let matchedCard = eventCards.filter({ hasText: eventTitle });
  await expect(matchedCard).toBeVisible({ timeout: 5000 });

  const seatTextBefore = await matchedCard.locator(':text("seat")').innerText();
  const seatsBeforeBooking = parseInt(seatTextBefore.match(/\d+/)?.[0] ?? '', 10);

  // Step 4 — Start booking
  await matchedCard.locator('[data-testid="book-now-btn"]').click();

  // Step 5 — Fill booking form
  await expect(page.locator('#ticket-count')).toHaveText('1');
  await page.getByLabel('Full Name').fill('Automation Tester');
  await page.locator('#customer-email').fill(EMAIL);
  await page.getByPlaceholder('+91 98765 43210').fill('+91 98765 43210');
  await page.locator('.confirm-booking-btn').click();

  // Step 6 — Verify booking confirmation
  const bookingRefLocator = page.locator('.booking-ref').first();
  await expect(bookingRefLocator).toBeVisible();
  const bookingRef = (await bookingRefLocator.innerText()).trim();

  // Step 7 — Verify in My Bookings
  await page.getByRole('link', { name: 'View My Bookings' }).click();
  await expect(page).toHaveURL(`${BASE_URL}/bookings`);

  const bookingCards = page.locator('#booking-card');
  await expect(bookingCards.first()).toBeVisible();

  const matchedBookingCard = bookingCards.filter({
    has: page.locator('.booking-ref', { hasText: bookingRef }),
  });
  await expect(matchedBookingCard).toBeVisible();
  await expect(matchedBookingCard).toContainText(eventTitle);

  // Step 8 — Verify seat reduction
  await page.goto(`${BASE_URL}/events`);
  await expect(eventCards.first()).toBeVisible();

  matchedCard = eventCards.filter({ hasText: eventTitle });
  await expect(matchedCard).toBeVisible();

  const seatTextAfter = await matchedCard.locator(':text("seat")').innerText();
  const seatsAfterBooking = parseInt(seatTextAfter.match(/\d+/)?.[0] ?? '', 10);

  expect(seatsAfterBooking).toBe(seatsBeforeBooking - 1);
});