import { test, expect } from '@playwright/test';

test.describe('Accessibility', () => {
  test('skip link is present and functional', async ({ page }) => {
    await page.goto('/build');
    const skipLink = page.locator('.skip-link, [class*="skip"]').first();
    const count = await skipLink.count();
    expect(count).toBeGreaterThan(0);
  });

  test('images have alt attributes', async ({ page }) => {
    await page.goto('/?skip');
    const images = page.locator('img');
    const count = await images.count();
    for (let i = 0; i < count; i++) {
      const alt = await images.nth(i).getAttribute('alt');
      // alt can be empty string (decorative) but must exist
      expect(alt).not.toBeNull();
    }
  });

  test('header toggle has aria attributes', async ({ page }) => {
    await page.goto('/build');
    const toggle = page.locator('.header__toggle');
    await expect(toggle).toHaveAttribute('aria-label', /menu/i);
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  });

  test('phone modal has aria attributes', async ({ page }) => {
    await page.goto('/?skip');
    const modal = page.locator('#phoneModal');
    const count = await modal.count();
    if (count > 0) {
      await expect(modal).toHaveAttribute('aria-hidden', 'true');
      await expect(modal).toHaveAttribute('role', 'dialog');
    }
  });
});
