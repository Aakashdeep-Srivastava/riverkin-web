import { test, expect, type Page } from '@playwright/test';

/**
 * Later layer — L2 Crew Lead setup → L1 Crew dashboard → C7 site timeline,
 * driven against the live crews + timeline API.
 */

test.beforeEach(async ({ page }: { page: Page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('rk_entered', '1');
    localStorage.setItem('rk_role', 'crew_lead');
  });
});

test('L2 → L1: create a crew, add a member, adopt a site, see the dashboard', async ({ page }) => {
  await page.goto('/crew/setup');

  // Step 1 — create crew.
  await page.getByLabel('Crew name').fill('Crew Coselhas');
  await page.getByLabel('City').fill('Coimbra');
  await page.getByRole('button', { name: /create crew/i }).click();
  await expect(page.getByText(/Crew Coselhas created/i)).toBeVisible();

  // Step 2 — add a pseudonymous member.
  await page.getByLabel('Member handle').fill('Scout 3');
  await page.getByRole('button', { name: /add member/i }).click();
  await expect(page.getByText('Scout 3')).toBeVisible();

  // Step 3 — adopt a site.
  await page.getByLabel('OAH site code').fill('CB-01');
  await page.getByRole('button', { name: /adopt site/i }).click();
  await expect(page.getByText('CB-01')).toBeVisible();

  // Go to the L1 dashboard — crew id was remembered locally.
  await page.getByRole('link', { name: /go to crew dashboard/i }).click();
  await expect(page).toHaveURL(/\/crew$/);
  await expect(page.getByRole('heading', { name: /Crew Coselhas/i })).toBeVisible();
  await expect(page.getByText(/adopted sites/i)).toBeVisible();
  await expect(page.getByText('Scout 3')).toBeVisible();
});

test('C7: site timeline renders activity', async ({ page }) => {
  await page.goto('/timeline/CB-01');
  await expect(page.getByText(/what changed/i)).toBeVisible();
});
