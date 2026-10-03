import { test, expect, type Page } from '@playwright/test';

/**
 * FR11 — the missions engine. The Missions tab lists suggested field missions
 * from the live backend (GET /api/v1/missions); opening one shows the C3 brief
 * (GET /api/v1/missions/{id}) with its mandatory safety line.
 */

test.beforeEach(async ({ page }: { page: Page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('rk_entered', '1');
    localStorage.setItem('rk_role', 'keeper');
  });
});

test('Missions tab lists suggested missions and opens a brief', async ({ page }) => {
  await page.goto('/missions');

  await expect(page.getByRole('heading', { name: /suggested missions/i })).toBeVisible();

  // At least one live mission is listed; open the first.
  const first = page.locator('a[href^="/missions/"]').first();
  await expect(first).toBeVisible();
  await first.click();

  // On the C3 brief: a start CTA and the mandatory safety copy.
  await expect(page).toHaveURL(/\/missions\/.+/);
  await expect(page.getByRole('link', { name: /start mission/i })).toBeVisible();
  await expect(page.getByText(/stay safe/i)).toBeVisible();
  await expect(page.getByText(/from the bank only/i)).toBeVisible();
});
