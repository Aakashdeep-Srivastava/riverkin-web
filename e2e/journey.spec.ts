import { test, expect, type Page } from '@playwright/test';

/**
 * Full judge journey — from a cold start (no storage) through onboarding and the
 * guest sign-in, the complete field-check loop, and every tab/role surface. This
 * is the "everything works" smoke the demo relies on.
 */

async function clickButton(page: Page, name: string | RegExp) {
  await page.getByRole('button', { name }).first().click();
}

test('cold start → onboarding → guest → full loop → every surface', async ({ page }) => {
  // --- Cold start: real splash → onboarding → sign-in (nothing in storage). ---
  await page.goto('/welcome');
  await page.getByRole('button', { name: /continue/i }).click();

  // Onboarding slides (Next ×2 → Get started), then the sign-in panel.
  await clickButton(page, /^Next$/);
  await clickButton(page, /^Next$/);
  await clickButton(page, /get started/i);

  // --- Guest sign-in lands on the map. ---
  await page.getByRole('button', { name: /browse as a guest/i }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole('tab', { name: /^All$/ })).toBeVisible();

  // --- Open the top-priority site (glass card "View"). ---
  await page.getByRole('link', { name: /view/i }).first().click();
  await expect(page).toHaveURL(/\/sites\/.+/);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

  // --- C3 brief → C4 check. ---
  await page.getByRole('link', { name: /go check it/i }).click();
  await expect(page.getByText(/photo from the bank only/i)).toBeVisible();
  await page.getByRole('link', { name: /start mission/i }).click();
  await expect(page).toHaveURL(/\/check/);

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
  await clickButton(page, /capture photo/i);
  await clickButton(page, /^Next$/);
  await clickButton(page, /capture photo/i);
  await clickButton(page, /^Next$/);
  await clickButton(page, /^Skip$/);
  await clickButton(page, /^Hopeful$/);
  await clickButton(page, /submit for verification/i);

  // --- C6 receipt (live observation id). ---
  await expect(page).toHaveURL(/\/receipt\/\d+/, { timeout: 15_000 });
  await expect(page.getByText(/monitoring gap closed/i)).toBeVisible();

  // --- Every remaining surface renders without crashing. ---
  for (const path of ['/impact', '/missions', '/verify', '/crew', '/researcher', '/me']) {
    await page.goto(path);
    await expect(page.getByRole('heading').first()).toBeVisible();
  }
});
