import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('homepage loads', async ({ page }) => {
    const response = await page.goto('/');
    expect(response?.status()).toBe(200);
  });

  test('tier hub pages load', async ({ page }) => {
    for (const path of ['/build', '/transform', '/care']) {
      const response = await page.goto(path);
      expect(response?.status()).toBe(200);
    }
  });

  test('detail pages load', async ({ page }) => {
    const pages = [
      '/build/starter-onepage',
      '/build/starter-multipage',
      '/build/fullsite-booking',
      '/transform/foundation-growth',
      '/transform/smb-platform',
      '/transform/brand-platform',
      '/care/bronze',
      '/care/silver',
      '/care/gold',
    ];
    for (const path of pages) {
      const response = await page.goto(path);
      expect(response?.status()).toBe(200);
    }
  });

  test('intake page loads', async ({ page }) => {
    const response = await page.goto('/intake');
    expect(response?.status()).toBe(200);
  });

  test('intake accepts tier params', async ({ page }) => {
    await page.goto('/intake?tier=amber&offer=starter-onepage');
    await expect(page).toHaveTitle(/Intake|Quote/i);
  });

  test('confirmation pages load', async ({ page }) => {
    for (const path of ['/payment-confirmed', '/booking-confirmed', '/snapshot-confirmed', '/thanks']) {
      const response = await page.goto(path);
      expect(response?.status()).toBe(200);
    }
  });

  test('404 page renders', async ({ page }) => {
    const response = await page.goto('/nonexistent-page-xyz');
    expect(response?.status()).toBe(404);
  });
});
