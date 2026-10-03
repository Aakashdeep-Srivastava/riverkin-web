import { test, expect, type Page } from '@playwright/test';

/**
 * PRD R1 — Researcher dashboard. KPI row, expert review queue and a FHIR Bundle
 * viewer/download, all fed by the live API (/metrics, /expert/queue, /fhir).
 */

test.beforeEach(async ({ page }: { page: Page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('rk_entered', '1');
    localStorage.setItem('rk_role', 'researcher');
  });
});

test('R1: dashboard shows KPIs, queue and a FHIR bundle', async ({ page }) => {
  await page.goto('/researcher');

  await expect(page.getByRole('heading', { name: /trustworthy output/i })).toBeVisible();

  // KPI row.
  await expect(page.getByText(/coverage fresh/i)).toBeVisible();
  await expect(page.getByText(/sites needing attention/i)).toBeVisible();

  // Expert queue section header.
  await expect(page.getByText(/expert queue/i)).toBeVisible();

  // FHIR viewer renders a Bundle and offers a download.
  await expect(page.getByRole('heading', { name: /FHIR Bundle/i })).toBeVisible();
  await expect(page.getByText(/"resourceType": "Bundle"/)).toBeVisible();
  await expect(page.getByRole('button', { name: /download/i })).toBeVisible();
});
