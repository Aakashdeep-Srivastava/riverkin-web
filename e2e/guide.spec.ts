import { test, expect, type Page } from '@playwright/test';
import { capturePhoto } from './helpers';

/**
 * Guided learning tour — launched from the app bar, it narrates and navigates
 * the whole loop (map → site → brief → check → receipt → impact → verify).
 */

test.beforeEach(async ({ page }: { page: Page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('rk_entered', '1');
    localStorage.setItem('rk_role', 'keeper');
  });
});

async function clickButton(page: Page, name: string | RegExp) {
  await page.getByRole('button', { name }).first().click();
}

test('guided tour walks the full loop', async ({ page }) => {
  await page.goto('/');

  // Launch from the app bar.
  await page.getByRole('button', { name: /take the guided tour/i }).click();

  const tour = page.getByRole('dialog', { name: /guided tour/i });
  await expect(tour).toBeVisible();
  await expect(tour.getByText(/the attention map/i)).toBeVisible();

  // Step 1 → open the top site.
  await tour.getByRole('button', { name: /open the top site/i }).click();
  await expect(page).toHaveURL(/\/sites\/.+/);

  // Step 2 → the mission brief.
  await tour.getByRole('button', { name: /see the brief/i }).click();
  await expect(page).toHaveURL(/\/missions\/.+/);

  // Step 3 → the check.
  await tour.getByRole('button', { name: /start the check/i }).click();
  await expect(page).toHaveURL(/\/check/);
  await expect(tour.getByText(/run the 5-minute check/i)).toBeVisible();

  // Complete the check; the tour auto-advances when the receipt appears.
  await clickButton(page, 'Clear');
  await clickButton(page, /^Next$/);
  await clickButton(page, /^None$/);
  await clickButton(page, /^Next$/);
  await clickButton(page, /^None$/);
  await clickButton(page, /^Next$/);
  await clickButton(page, /^Normal$/);
  await clickButton(page, /^Next$/);
  await clickButton(page, /^No$/);
  await clickButton(page, /^Next$/);
  await capturePhoto(page);
  await clickButton(page, /^Next$/);
  await capturePhoto(page);
  await clickButton(page, /^Next$/);
  await clickButton(page, /^Skip$/);
  await clickButton(page, /^Hopeful$/);
  await clickButton(page, /submit for verification/i);

  await expect(page).toHaveURL(/\/receipt\/\d+/, { timeout: 15_000 });
  await expect(tour.getByText(/your impact receipt/i)).toBeVisible();

  // Step 5 → impact, step 6 → verify, finish.
  await tour.getByRole('button', { name: /see your impact/i }).click();
  await expect(page).toHaveURL(/\/impact/);
  await tour.getByRole('button', { name: /help verify/i }).click();
  await expect(page).toHaveURL(/\/verify/);
  await tour.getByRole('button', { name: /finish tour/i }).click();

  // Tour closed.
  await expect(tour).toHaveCount(0);
});
