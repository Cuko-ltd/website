import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const pages = [
  { path: '/',              name: 'home' },
  { path: '/services',      name: 'services' },
  { path: '/compliance',    name: 'compliance' },
  { path: '/work',          name: 'work' },
  { path: '/blog',          name: 'blog' },
  { path: '/blog/when-you-actually-need-nanoseconds', name: 'blog-post' },
  { path: '/about',         name: 'about' },
  { path: '/contact',       name: 'contact' },
  { path: '/accessibility', name: 'accessibility' },
  { path: '/privacy',       name: 'privacy' },
  { path: '/security',      name: 'security' },
];

// Axe rule selection: WCAG 2.0 A, 2.0 AA, 2.1 A, 2.1 AA, 2.2 AA, plus best-practice subset.
const axeTags = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

for (const { path, name } of pages) {
  test(`a11y: ${name} (${path}) — no axe violations`, async ({ page }) => {
    // Disable cursor blink + reveal animations before scanning so axe sees
    // a stable rendered DOM and does not flag opacity-mid-animation states.
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(path);
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(400);

    const results = await new AxeBuilder({ page })
      .withTags(axeTags)
      .analyze();

    if (results.violations.length > 0) {
      const summary = results.violations
        .map((v) => {
          const head = `  • [${v.id}] ${v.help} (impact: ${v.impact}, ${v.nodes.length} nodes)`;
          const nodes = v.nodes
            .slice(0, 5)
            .map((n) => `      - ${n.target.join(' ')} :: ${n.failureSummary?.split('\n')[0] ?? ''}`)
            .join('\n');
          return `${head}\n${nodes}`;
        })
        .join('\n');
      throw new Error(`Accessibility violations on ${path}:\n${summary}`);
    }

    expect(results.violations).toEqual([]);
  });
}

test('a11y: skip-link is the first focusable element on home', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  const focused = await page.evaluate(() => {
    const el = document.activeElement;
    return {
      text: el?.textContent?.trim() ?? '',
      classes: el?.className ?? '',
    };
  });
  expect(focused.text).toMatch(/skip to main content/i);
  expect(focused.classes).toContain('skip-link');
});

test('a11y: skip-link jumps focus to main', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');
  await page.waitForURL(/#main-content$/);
  const mainHasFocus = await page.evaluate(() => {
    const main = document.getElementById('main-content');
    return main !== null && main.contains(document.activeElement);
  });
  expect(mainHasFocus).toBe(true);
});
