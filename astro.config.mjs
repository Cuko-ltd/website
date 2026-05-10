import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const SITE = 'https://cuko.uk';

// Per-URL sitemap policy. Higher priority for commercial pages, lower for legal boilerplate.
// changefreq is a hint to crawlers, not a guarantee.
function policyFor(url) {
  const path = url.replace(SITE, '').replace(/\/$/, '') || '/';
  if (path === '/') return { priority: 1.0, changefreq: 'monthly' };
  if (path === '/blog') return { priority: 0.9, changefreq: 'weekly' };
  if (path.startsWith('/blog/')) return { priority: 0.9, changefreq: 'monthly' };
  if (path === '/services' || path === '/compliance') return { priority: 0.9, changefreq: 'monthly' };
  if (path === '/work' || path === '/about' || path === '/contact') return { priority: 0.8, changefreq: 'monthly' };
  if (path === '/privacy' || path === '/accessibility' || path === '/security') {
    return { priority: 0.3, changefreq: 'yearly' };
  }
  return { priority: 0.5, changefreq: 'monthly' };
}

// Pre-compute lastmod for blog post URLs from frontmatter pubDate / updatedDate.
// Falls back to file mtime, then build time, if the post is malformed.
const BLOG_DIR = new URL('./src/content/blog/', import.meta.url).pathname;
const blogLastmod = new Map();
const blogDates = [];
try {
  for (const file of readdirSync(BLOG_DIR)) {
    if (!file.endsWith('.md') && !file.endsWith('.mdx')) continue;
    const slug = file.replace(/\.(md|mdx)$/, '');
    const full = join(BLOG_DIR, file);
    const raw = readFileSync(full, 'utf8');
    const fm = raw.match(/^---\n([\s\S]*?)\n---/);
    let date;
    if (fm) {
      const updated = fm[1].match(/^updatedDate:\s*(.+)$/m);
      const pub = fm[1].match(/^pubDate:\s*(.+)$/m);
      const draft = fm[1].match(/^draft:\s*(true|false)$/m);
      if (draft && draft[1] === 'true') continue;
      const raw = (updated?.[1] ?? pub?.[1] ?? '').trim().replace(/^['"]|['"]$/g, '');
      if (raw) date = new Date(raw);
    }
    if (!date || Number.isNaN(date.getTime())) date = statSync(full).mtime;
    const url = `${SITE}/blog/${slug}/`;
    blogLastmod.set(url, date);
    blogDates.push(date);
  }
} catch {
  // No posts yet — fine.
}
const blogIndexLastmod = blogDates.length
  ? new Date(Math.max(...blogDates.map((d) => d.getTime())))
  : new Date();
const buildTime = new Date();

export default defineConfig({
  site: SITE,
  trailingSlash: 'ignore',
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/palette'),
      serialize(item) {
        const policy = policyFor(item.url);
        const url = item.url.endsWith('/') ? item.url : `${item.url}/`;
        let lastmod;
        if (blogLastmod.has(url)) lastmod = blogLastmod.get(url);
        else if (item.url.replace(SITE, '').replace(/\/$/, '') === '/blog') lastmod = blogIndexLastmod;
        else lastmod = buildTime;
        return {
          ...item,
          priority: policy.priority,
          changefreq: policy.changefreq,
          lastmod: lastmod.toISOString(),
        };
      },
    }),
  ],
});
