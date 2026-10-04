import { test, expect } from '@playwright/test';
import { enterApp } from './helpers';

/**
 * Track-5 feature surfaces built on real OneAquaHealth data: the real ecosystem
 * panel, the live Impact + identity progression, the Community dashboard, and
 * the in-app notification center. All drive the live API on :8000.
 */

test.beforeEach(async ({ page }) => {
  await enterApp(page);
});

test('site detail shows the real OAH ecosystem baseline', async ({ page }) => {
  await page.goto('/sites/C1');
  await expect(page.getByRole('heading', { name: /ecosystem health/i })).toBeVisible();
  await expect(page.getByText(/ecological status/i)).toBeVisible();
  await expect(page.getByText(/one health risk/i)).toBeVisible();
  // Attribution to the data owner is present.
  await expect(page.getByText(/oneaquahealth/i).first()).toBeVisible();
});

test('impact screen is live with identity progression', async ({ page }) => {
  await page.goto('/impact');
  await expect(page.getByRole('heading', { name: /your impact/i })).toBeVisible();
  await expect(page.getByText(/river score/i).first()).toBeVisible();
  // A real tier name from the identity ladder.
  await expect(page.getByText(/observer|explorer|river keeper/i).first()).toBeVisible();
  await expect(page.getByText('Coverage fresh', { exact: true })).toBeVisible();
});

test('community dashboard ranks the five cities and lists challenges', async ({ page }) => {
  await page.goto('/community');
  await expect(page.getByRole('heading', { name: /community/i })).toBeVisible();
  await expect(page.getByText(/city standings/i)).toBeVisible();
  // The real OAH cities appear in the standings.
  await expect(page.getByText(/coimbra/i).first()).toBeVisible();
  // Usefulness framing, not vanity points.
  await expect(page.getByText(/not a personal scoreboard/i)).toBeVisible();
});

test('notification center opens and shows real nudges', async ({ page }) => {
  await page.goto('/community');
  await page.getByRole('button', { name: /notifications/i }).click();
  await expect(page.getByRole('heading', { name: /^notifications$/i })).toBeVisible();
  // At least the coverage milestone is always present from seeded state.
  await expect(page.getByText(/keep the map green/i)).toBeVisible();
});
