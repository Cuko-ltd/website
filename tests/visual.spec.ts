import { test, expect } from '@playwright/test';

// Visual regression compares pixels; baselines are platform-specific.
// Skip on CI by default to avoid macOS-vs-Linux font-rendering false positives.
// Run locally with `npm run test:visual`.
test.skip(
  !!process.env.CI && process.env.PW_VISUAL_REGRESSION !== '1',
  'Visual regression runs locally; set PW_VISUAL_REGRESSION=1 to enable on CI.',
);

const paths = ['/', '/services', '/compliance', '/work', '/about', '/contact', '/accessibility', '/privacy'];

for (const path of paths) {
  test(`visual: ${path}`, async ({ page }, testInfo) => {
    await page.goto(path);

    // Disable cursor blink + counter animation by setting reduced motion
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.reload();

    // Wait for fonts to settle so screenshots are stable
    await page.evaluate(() => document.fonts.ready);

    // Wait for reveal animations + counter to settle
    await page.waitForTimeout(800);

    const slug = path === '/' ? 'home' : path.replace(/^\//, '').replace(/\//g, '-');
    await expect(page).toHaveScreenshot(`${slug}.png`, {
      fullPage: true,
    });
  });
}
