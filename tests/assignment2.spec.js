const { test, expect } = require('@playwright/test');

const BASE_URL = 'https://eventhub.rahulshettyacademy.com';
const EMAIL = process.env.EH_EMAIL || 'test@email.com';
const PASSWORD = process.env.EH_PASSWORD || 'Test@1234';
const NAME = 'Test User';
const PHONE = '9876543210';

/**
 * Logs in and confirms the "Browse Events" link is visible.
 * Adjust the login selectors below if the actual form differs.
 */
async function loginAndGoToBooking(page) {
  await page.goto(`${BASE_URL}/login`);
  await page.getByLabel(/email/i).fill(EMAIL);
  await page.getByLabel(/password/i).fill(PASSWORD);
  await page.getByRole('button', { name: /login|sign in/i }).click();

  await expect(page.getByRole('link', { name: 'Browse Events →' })).toBeVisible();
}

async function bookFirstEvent(page, ticketQty = 1) {
  await page.goto(`${BASE_URL}/events`);

  const firstCard = page.getByTestId('event-card').first();
  await firstCard.getByTestId('book-now-btn').click();

  if (ticketQty > 1) {
    const incrementBtn = page.locator('button:has-text("+")');
    for (let i = 1; i < ticketQty; i++) {
      await incrementBtn.click();
    }
  }

  await page.getByLabel(/full name/i).fill(NAME);
  await page.getByLabel(/email/i).fill(EMAIL);
  await page.getByLabel(/phone/i).fill(PHONE);
  await page.locator('.confirm-booking-btn').click();
}

async function goToBookingDetail(page) {
  await page.getByRole('link', { name: /view my bookings/i }).click();
  await expect(page).toHaveURL(/\/bookings/);

  await page.getByRole('link', { name: /view details/i }).first().click();
  await expect(page.getByText('Booking Information')).toBeVisible();
}

async function validateBookingRef(page) {
  const bookingRef = await page.locator('.font-mono').nth(0).innerText();
  const eventTitle = await page.locator('h1').innerText();
  expect(bookingRef.trim().charAt(0)).toBe(eventTitle.trim().charAt(0));
}

async function checkRefundEligibility(page) {
  await page.getByRole('button', { name: 'Check eligibility for refund' }).click();

  const spinner = page.locator('#refund-spinner');
  await expect(spinner).toBeVisible();
  await expect(spinner).toBeHidden({ timeout: 6000 });
}

test.describe('Refund eligibility', () => {
  test('Single ticket booking is eligible for refund', async ({ page }) => {
    await loginAndGoToBooking(page);
    await bookFirstEvent(page, 1);
    await goToBookingDetail(page);
    await validateBookingRef(page);
    await checkRefundEligibility(page);

    const result = page.locator('#refund-result');
    await expect(result).toBeVisible();
    await expect(result).toContainText('Eligible for refund');
    await expect(result).toContainText('Single-ticket bookings qualify for a full refund');
  });

  test('Group ticket booking is NOT eligible for refund', async ({ page }) => {
    await loginAndGoToBooking(page);
    await bookFirstEvent(page, 3);
    await goToBookingDetail(page);
    await validateBookingRef(page);
    await checkRefundEligibility(page);

    const result = page.locator('#refund-result');
    await expect(result).toBeVisible();
    await expect(result).toContainText('Not eligible for refund');
    await expect(result).toContainText('Group bookings (3 tickets) are non-refundable');
  });
});