import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://cuko.uk',
  trailingSlash: 'ignore',
  integrations: [
    sitemap({
      changefreq: 'monthly',
      priority: 0.8,
      lastmod: new Date(),
    }),
  ],
});
