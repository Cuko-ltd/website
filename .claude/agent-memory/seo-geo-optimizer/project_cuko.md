---
name: Cuko Ltd website project context
description: Technical stack, site architecture, SEO infrastructure, and known constraints for cuko.uk
type: project
---

**Website:** https://cuko.uk (CNAME confirmed)
**Framework:** Astro 5 (static output), deployed via GitHub Pages based on CNAME file
**CMS:** Astro Content Collections for blog (src/content/blog/*.md)
**Build:** npm run build → dist/
**Testing:** Playwright with axe-core a11y tests; smoke tests; visual regression tests across 6 viewports

**Page inventory (as of 2026-05-09):**
- / (home) — hero, stats, 4 services preview, FAQ, contact CTA
- /services — all 8 engagement modes, commercials
- /compliance — GDPR, MiCA, DORA, EU AI Act with article-level detail
- /work — 3 named case studies (thin), recurring engagement patterns
- /about — bio, stack, principles (has TODO: prior employers)
- /contact — channels only
- /blog — index (1 post live)
- /blog/when-you-actually-need-nanoseconds/ — ~2100 word essay on latency regimes
- /privacy, /accessibility, /security — legal/compliance pages
- /palette — design system preview (noindex=true, correct)

**SEO infrastructure already in place:**
- Canonical tags on every page via BaseLayout
- hreflang en-GB + x-default on every page
- XML sitemap (sitemap-index.xml + sitemap-0.xml) via @astrojs/sitemap
- robots.txt: allows all major AI crawlers (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, etc.)
- llms.txt at /llms.txt with entity description, operator facts, commercial terms
- RSS feed at /rss.xml
- FAQPage schema on home page
- BlogPosting schema on each post
- Organization + Person + ProfessionalService schemas site-wide
- BreadcrumbList on all pages
- ItemList/Service schemas on /services and /compliance
- Blog schema on /blog index

**Key gaps identified in 2026-05 audit:** See audit_baseline_2026-05.md

**Sitemap note:** All 11 pages have identical priority=0.8 and changefreq=monthly. No differentiation.

**Why:** Astro @astrojs/sitemap does not support per-page priority without custom filtering.

**How to apply:** When recommending sitemap improvements, note the Astro sitemap integration limitations and suggest a custom sitemap page approach.
