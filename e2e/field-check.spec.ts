import { test, expect, type Page } from '@playwright/test';
import { capturePhoto } from './helpers';

/**
 * PRD F1 — Field check (C1/C2 → C3 → C4 → receipt), driven against the live API.
 *
 * Submitting posts to POST /api/v1/observations and routes to /receipt/<id>
 * where <id> is the real observation id returned by the backend — proving the
 * write path end to end.
 */

// A real OneAquaHealth site code (Coimbra C1 "Exploratório").
const SITE = 'C1';

// Skip the one-time globe/welcome gate (localStorage, no account).
test.beforeEach(async ({ page }: { page: Page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('rk_entered', '1');
    localStorage.setItem('rk_role', 'keeper');
  });
});

async function clickButton(page: Page, name: string | RegExp) {
  await page.getByRole('button', { name }).first().click();
}

test('F1: complete a field check and land on a live receipt', async ({ page }) => {
  // C2 — site attention card.
  await page.goto(`/sites/${SITE}`);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await page.getByRole('link', { name: /go check it/i }).click();

  // C3 — mission brief with the mandatory safety line.
  await expect(page.getByText(/photo from the bank only/i)).toBeVisible();
  await page.getByRole('link', { name: /start mission/i }).click();

  // C4 — one question per screen (OAH fields).
  await expect(page).toHaveURL(/\/check/);

  await expect(page.getByText(/water appearance/i)).toBeVisible();
  await clickButton(page, 'Clear');
  await clickButton(page, /^Next$/);

  await expect(page.getByText(/litter or debris/i)).toBeVisible();
  await clickButton(page, /^None$/);
  await clickButton(page, /^Next$/);

  await expect(page.getByText(/foam on the surface/i)).toBeVisible();
  await clickButton(page, /^None$/);
  await clickButton(page, /^Next$/);

  await expect(page.getByText(/how is the flow/i)).toBeVisible();
  await clickButton(page, /^Normal$/);
  await clickButton(page, /^Next$/);

  await expect(page.getByText(/pipe or outfall/i)).toBeVisible();
  await clickButton(page, /^No$/);
  await clickButton(page, /^Next$/);

  // Camera steps: upstream + downstream required, bank optional. Use the file
  // fallback (no real camera in CI) to drive the real upload + analysis path.
  await expect(page.getByRole('heading', { name: /upstream/i })).toBeVisible();
  await capturePhoto(page);
  await clickButton(page, /^Next$/);

  await expect(page.getByRole('heading', { name: /downstream/i })).toBeVisible();
  await capturePhoto(page);
  await clickButton(page, /^Next$/);

  // Optional bank — skip it.
  await clickButton(page, /^Skip$/);

  // Feeling pick, then submit.
  await expect(page.getByText(/how did the river feel/i)).toBeVisible();
  await clickButton(page, /^Hopeful$/);
  await clickButton(page, /submit for verification/i);

  // The live POST returns an observation id → /receipt/<digits>.
  await expect(page).toHaveURL(/\/receipt\/\d+/, { timeout: 15_000 });

  // C6 — the receipt renders live data: the gap-closed line and a real FHIR id.
  await expect(page.getByText(/monitoring gap closed/i)).toBeVisible();
  await expect(page.getByText(/FHIR Observation rk-/i)).toBeVisible();

  // The captured photo, its geotag and the capture-authenticity meter appear.
  await expect(page.getByRole('heading', { name: /your photo/i })).toBeVisible();
  await expect(page.getByText(/capture authenticity/i)).toBeVisible();
  await expect(page.getByText(/within 150 m/i)).toBeVisible();
});
