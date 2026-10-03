import { test, type Page } from '@playwright/test';

/** Capture key screens for visual review of the brand redesign. Not an assertion. */

test.beforeEach(async ({ page }: { page: Page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('rk_entered', '1');
    localStorage.setItem('rk_role', 'keeper');
  });
});

async function shot(page: Page, name: string) {
  await page.waitForTimeout(900); // let fonts + any motion settle
  await page.screenshot({ path: `design/shots/${name}.png`, fullPage: true });
}

test('capture brand screens', async ({ page }) => {
  await page.goto('/');
  await page.waitForTimeout(1200);
  await page.screenshot({ path: 'design/shots/c1-home.png' }); // viewport (map is full-screen)

  await page.goto('/sites/CB-01');
  await shot(page, 'c2-site');

  await page.goto('/missions/CB-01');
  await shot(page, 'c3-mission');

  await page.goto('/check?site=CB-01');
  await shot(page, 'c4-check');

  await page.goto('/researcher');
  await shot(page, 'r1-researcher');
});
