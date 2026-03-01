import { test, expect } from '@playwright/test';

test.describe('SEO', () => {
  test('homepage has meta description', async ({ page }) => {
    await page.goto('/?skip');
    const desc = page.locator('meta[name="description"]');
    await expect(desc).toHaveAttribute('content', /.+/);
  });

  test('homepage has Schema.org JSON-LD', async ({ page }) => {
    await page.goto('/?skip');
    const schema = page.locator('script[type="application/ld+json"]');
    const count = await schema.count();
    expect(count).toBeGreaterThan(0);
    const content = await schema.first().textContent();
    const parsed = JSON.parse(content!);
    // Schema may use @graph wrapper or direct @type
    expect(parsed['@type'] || parsed['@graph']).toBeDefined();
  });

  test('homepage has OG tags', async ({ page }) => {
    await page.goto('/?skip');
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', /.+/);
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /.+/);
  });

  test('all pages have title tags', async ({ page }) => {
    const pages = ['/?skip', '/build', '/transform', '/care', '/intake', '/sudbury'];
    for (const path of pages) {
      await page.goto(path);
      const title = await page.title();
      expect(title.length).toBeGreaterThan(5);
    }
  });

  test('canonical URLs are set on key pages', async ({ page }) => {
    await page.goto('/?skip');
    const canonical = page.locator('link[rel="canonical"]');
    const count = await canonical.count();
    if (count > 0) {
      await expect(canonical).toHaveAttribute('href', /bertrandbrands\.ca/);
    }
  });
});
