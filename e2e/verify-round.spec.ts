import { test, expect, type Page } from '@playwright/test';

/**
 * PRD F2 — Verify round (C5). Serves cards one at a time with a 20 s ring,
 * Yes / No / Can't tell. Votes POST to /api/v1/verify/{item}/vote when the
 * cards are live; the round still completes against the bundled fallback.
 */

test.beforeEach(async ({ page }: { page: Page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('rk_entered', '1');
    localStorage.setItem('rk_role', 'keeper');
  });
});

test('F2: complete a verify round to the end screen', async ({ page }) => {
  await page.goto('/verify');

  // First card: AI question + Yes / No / Can't tell.
  await expect(page.getByRole('button', { name: /^Yes$/ })).toBeVisible();
  await expect(page.getByText(/peer verification/i)).toBeVisible();

  // Answer up to 6 cards; stop when the round-complete screen appears.
  for (let i = 0; i < 6; i++) {
    if (await page.getByRole('heading', { name: /round complete/i }).isVisible().catch(() => false)) {
      break;
    }
    await page.getByRole('button', { name: /^Yes$/ }).click();
    await page.waitForTimeout(300);
  }

  await expect(page.getByRole('heading', { name: /round complete/i })).toBeVisible();
  await expect(page.getByText(/you helped verify/i)).toBeVisible();
});
