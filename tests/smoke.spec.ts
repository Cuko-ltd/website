import { test, expect } from '@playwright/test';

const pages = [
  { path: '/',         title: /Cuko Ltd/, h1: /fractional CTO/i },
  { path: '/services', title: /Services/,  h1: /Services/ },
  { path: '/work',     title: /Work/,      h1: /Selected work/ },
  { path: '/about',    title: /About/,     h1: /About/ },
  { path: '/contact',  title: /Contact/,   h1: /Contact/ },
];

for (const page of pages) {
  test.describe(`page: ${page.path}`, () => {
    test('loads with 200 and key elements present', async ({ page: p }) => {
      const consoleErrors: string[] = [];
      p.on('console', (msg) => {
        if (msg.type() === 'error') consoleErrors.push(msg.text());
      });

      const failedRequests: string[] = [];
      p.on('requestfailed', (req) => {
        failedRequests.push(`${req.url()} (${req.failure()?.errorText})`);
      });

      const resp = await p.goto(page.path);
      expect(resp?.status(), `HTTP status for ${page.path}`).toBe(200);

      await expect(p).toHaveTitle(page.title);
      await expect(p.locator('h1').first()).toBeVisible();
      await expect(p.locator('h1').first()).toContainText(page.h1);

      // Masthead present
      await expect(p.locator('header.masthead')).toBeVisible();
      // Brand cursor logo present
      await expect(p.locator('.brand-cursor')).toBeVisible();
      // Nav has at least 5 items
      const navLinks = p.locator('header.masthead nav a.nav-link');
      await expect(navLinks).toHaveCount(5);
      // Footer present
      await expect(p.locator('footer')).toBeVisible();

      expect(consoleErrors, 'no console errors').toEqual([]);
      expect(failedRequests, 'no failed requests').toEqual([]);
    });

    test('current nav item is highlighted', async ({ page: p }) => {
      await p.goto(page.path);
      const current = p.locator('header.masthead nav a.nav-link.is-current');
      await expect(current).toHaveCount(1);
      const expected = page.path === '/' ? 'HOME' : page.path.replace('/', '').toUpperCase();
      await expect(current).toContainText(new RegExp(expected, 'i'));
    });
  });
}

test.describe('home-only structure', () => {
  test('hero stats grid renders four cells', async ({ page }) => {
    await page.goto('/');
    const stats = page.locator('#metrics .stat');
    await expect(stats).toHaveCount(4);
  });

  test('FAQ list contains seven items', async ({ page }) => {
    await page.goto('/');
    const dts = page.locator('dl.faq dt');
    await expect(dts).toHaveCount(7);
  });

  test('number counter animates when scrolled into view', async ({ page }) => {
    await page.goto('/');
    await page.locator('#metrics').scrollIntoViewIfNeeded();
    const firstCounter = page.locator('#metrics .stat-value .num').first();
    // Counter should reach 17 (years) within 3s of becoming visible
    await expect
      .poll(async () => Number((await firstCounter.textContent()) ?? '0'), {
        timeout: 3000,
      })
      .toBeGreaterThanOrEqual(17);
  });
});

test.describe('services page', () => {
  test('lists eight engagement modes', async ({ page }) => {
    await page.goto('/services');
    const items = page.locator('ul.services li');
    await expect(items).toHaveCount(8);
  });
});

test.describe('seo', () => {
  test('robots.txt is reachable and lists AI crawlers', async ({ request }) => {
    const resp = await request.get('/robots.txt');
    expect(resp.status()).toBe(200);
    const body = await resp.text();
    expect(body).toContain('GPTBot');
    expect(body).toContain('ClaudeBot');
    expect(body).toContain('PerplexityBot');
    expect(body).toContain('Sitemap: https://cuko.uk/sitemap-index.xml');
  });

  test('llms.txt is reachable', async ({ request }) => {
    const resp = await request.get('/llms.txt');
    expect(resp.status()).toBe(200);
    const body = await resp.text();
    expect(body).toContain('Cuko Ltd');
    expect(body).toContain('Samuel Ventimiglia');
  });

  test('sitemap-index.xml is reachable', async ({ request }) => {
    const resp = await request.get('/sitemap-index.xml');
    expect(resp.status()).toBe(200);
    const body = await resp.text();
    expect(body).toContain('cuko.uk');
  });

  test('homepage has Person, Organization, ProfessionalService schemas', async ({ page }) => {
    await page.goto('/');
    const scripts = await page.locator('script[type="application/ld+json"]').allTextContents();
    const blob = scripts.join(' ');
    expect(blob).toContain('"@type":"Person"');
    expect(blob).toContain('"@type":"Organization"');
    expect(blob).toContain('"@type":"ProfessionalService"');
    expect(blob).toContain('"@type":"FAQPage"');
  });
});
