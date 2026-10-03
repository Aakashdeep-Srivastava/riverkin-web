import { defineConfig, devices } from '@playwright/test';

/**
 * E2E against the real app driving the live RiverKin API.
 *
 * Assumes the API is already running on http://127.0.0.1:8000 (see the
 * riverkin-api repo). Playwright starts the Next.js dev server itself and waits
 * for it. Mobile viewport (390×844) matches the PRD's primary target.
 */
export default defineConfig({
  testDir: './e2e',
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: false,
  retries: 0,
  reporter: [['list']],
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      // System Chrome (channel) — the downloaded chromium binary is unavailable
      // in this environment, so drive the installed browser instead.
      name: 'mobile-chrome',
      use: { ...devices['Pixel 7'], channel: 'chrome' },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: true,
    timeout: 120_000,
    env: {
      NEXT_PUBLIC_API_URL: 'http://127.0.0.1:8000',
    },
  },
});
