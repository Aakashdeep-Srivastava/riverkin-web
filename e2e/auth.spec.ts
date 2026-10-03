import { test, expect, type Page } from '@playwright/test';

const API = 'http://127.0.0.1:8000';

/** Skip onboarding so the sign-in panel shows; splash still plays briefly. */
async function toAuthStage(page: Page) {
  await page.addInitScript(() => localStorage.setItem('rk_onboarded', '1'));
  await page.goto('/welcome');
  // Splash is a full-screen button — tap to advance straight to sign-in.
  await page.getByRole('button', { name: /continue/i }).click();
}

test('welcome shows guest + Microsoft sign-in (no demo roles)', async ({ page }) => {
  await toAuthStage(page);
  await expect(page.getByRole('button', { name: /browse as a guest/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /sign in with microsoft/i })).toBeVisible();
  // The old demo role picker is gone.
  await expect(page.getByText(/continue as kari/i)).toHaveCount(0);
  // Legal links are present.
  await expect(page.getByRole('link', { name: /privacy policy/i })).toBeVisible();
});

test('guest can enter and reach the map', async ({ page }) => {
  await toAuthStage(page);
  await page.getByRole('button', { name: /browse as a guest/i }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole('tab', { name: /^All$/ })).toBeVisible(); // filter chip on the map
});

test('OIDC completion: a valid token signs you in', async ({ page, request }) => {
  const email = `e2e-${Date.now()}@example.com`;
  const res = await request.post(`${API}/api/v1/auth/register`, {
    data: { email, password: 'riverkeeper1', display_name: 'E2E Tester', role: 'keeper' },
  });
  expect(res.ok()).toBeTruthy();
  const token = (await res.json()).access_token as string;

  await page.goto(`/auth/complete?token=${token}`);
  await expect(page).toHaveURL(/\/$/, { timeout: 15_000 });
});

test('privacy and terms pages render', async ({ page }) => {
  await page.goto('/privacy');
  await expect(page.getByRole('heading', { name: /privacy policy/i })).toBeVisible();
  await page.goto('/terms');
  await expect(page.getByRole('heading', { name: /terms of service/i })).toBeVisible();
});
