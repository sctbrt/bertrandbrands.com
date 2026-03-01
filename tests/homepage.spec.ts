import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('loads without console errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    await page.goto('/?skip');
    await expect(page).toHaveTitle(/Bertrand/);
    expect(errors).toHaveLength(0);
  });

  test('header is visible after intro skip', async ({ page }) => {
    await page.goto('/?skip');
    await page.waitForSelector('.header.visible', { timeout: 5000 });
    const header = page.locator('.header');
    await expect(header).toBeVisible();
  });

  test('nav links are present', async ({ page }) => {
    await page.goto('/?skip');
    await page.waitForSelector('.header.visible', { timeout: 5000 });
    // On desktop, nav links are visible without opening menu
    await expect(page.locator('.header__link', { hasText: 'Services' })).toBeAttached();
    await expect(page.locator('.header__link', { hasText: 'How It Works' })).toBeAttached();
    await expect(page.locator('.header__link', { hasText: 'About' })).toBeAttached();
  });

  test('tier groups render', async ({ page }) => {
    await page.goto('/?skip');
    await expect(page.locator('.tier-group').first()).toBeVisible();
  });

  test('FAQ accordion expands', async ({ page }) => {
    await page.goto('/?skip');
    const firstQuestion = page.locator('.faq__item summary').first();
    await firstQuestion.scrollIntoViewIfNeeded();
    await firstQuestion.click();
    const answer = page.locator('.faq__item .faq__answer').first();
    await expect(answer).toBeVisible();
  });
});
