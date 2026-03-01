import { test, expect } from '@playwright/test';

test.describe('Mobile', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test('mobile menu toggles', async ({ page }) => {
    await page.goto('/build');
    const toggle = page.locator('.header__toggle');
    await expect(toggle).toBeVisible();
    await toggle.click();
    const nav = page.locator('.header__nav');
    await expect(nav).toHaveClass(/is-open/);
    // Click a link to close
    await page.locator('.header__link', { hasText: 'Services' }).click();
    await expect(nav).not.toHaveClass(/is-open/);
  });

  test('phone CTA exists in mobile nav', async ({ page }) => {
    await page.goto('/build');
    // Open mobile menu first
    await page.locator('.header__toggle').click();
    // Phone CTA should be visible in the open mobile menu
    const callLink = page.locator('.header__link--cta-call');
    await expect(callLink).toBeAttached();
    await expect(callLink).toHaveAttribute('href', /^tel:/);
  });
});
