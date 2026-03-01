import { test, expect } from '@playwright/test';

/**
 * Redirect tests — these only work against a production/preview build
 * (Vercel or `npm run preview`), not `npm run dev` which doesn't process
 * Astro redirects. Skipped when running against port 4321 (dev server).
 */

const isDevServer = (process.env.BASE_URL || 'http://localhost:4321').includes('4321');

test.describe('Redirects', () => {
  test.skip(() => isDevServer, 'Redirects only work against production build, not dev server');

  const redirects = [
    { from: '/start', to: '/intake' },
    { from: '/packages/starter', to: '/build/starter-onepage' },
    { from: '/packages/refresh', to: '/transform/foundation-growth' },
    { from: '/packages/platform', to: '/transform/brand-platform' },
    { from: '/amber', to: '/build' },
    { from: '/violet', to: '/transform' },
    { from: '/blue', to: '/care' },
    { from: '/exploratory', to: '/intake' },
    { from: '/book', to: '/intake' },
    { from: '/starter-site', to: '/build/starter-onepage' },
  ];

  for (const { from, to } of redirects) {
    test(`${from} redirects to ${to}`, async ({ page }) => {
      const response = await page.goto(from, { waitUntil: 'commit' });
      expect(page.url()).toContain(to);
    });
  }
});
