---
name: SEO/GEO audit baseline — May 2026
description: Full audit findings from initial audit of cuko.uk conducted 2026-05-09; P0/P1/P2 gaps to address
type: project
---

**Audit date:** 2026-05-09
**Auditor:** SEO/GEO Optimizer agent

## What's already strong
- robots.txt correctly permits all major AI crawlers
- llms.txt is present and well-structured with entity, operator, commercial facts
- FAQPage JSON-LD on home page (7 Q&As, well-written)
- BlogPosting schema on post pages with wordCount, timeRequired, inLanguage
- BreadcrumbList on all pages
- Organization + Person + ProfessionalService schemas site-wide in BaseLayout
- Canonical tags auto-generated from Astro.url
- hreflang en-GB + x-default on all pages
- axe-core a11y testing in CI
- lang="en-GB" on html element
- Noindex correctly applied to /palette only
- Self-hosted fonts (no Google Fonts privacy/performance leak)
- RSS feed present and correctly tagged
- Security.txt (RFC 9116)
- Article-level regulatory detail on /compliance (excellent for GEO citation)

## P0 — Actively hurting (fix immediately)

1. **OG image file missing:** og:image references https://cuko.uk/og-image.png which does not exist in public/ or dist/. All pages produce a broken social card. Both og:image and twitter:image affected.
   - File: src/layouts/BaseLayout.astro lines 57, 65

2. **Person schema missing image property:** personSchema() in src/lib/seo.ts has no `image` field. Google uses Person.image for Knowledge Panel and AI engines use it for entity disambiguation. The portrait photo exists at src/assets/sam.jpg and is used on /about.

3. **Blog post has no opening direct-answer sentence:** The latency post starts with an anecdote (founder story). LLMs extract definitions from the first 150 words. There is no declarative "X is Y" sentence or TL;DR. This suppresses GEO citability for queries like "when do you need nanosecond latency".

## P1 — Significant gaps (address in next sprint)

4. **Sitemap: flat priority=0.8 for all pages including legal:** /privacy, /security, /accessibility should have priority=0.3; /blog/posts should have 0.9; / should be 1.0; /services, /compliance, /work, /about, /contact should be 0.8. The Astro sitemap integration applies global values only — requires a custom src/pages/sitemap.xml.ts approach or per-URL filter.

5. **No WebSite schema with SearchAction:** There is no root WebSite schema with potentialAction: SearchAction. Google uses this for Sitelinks Searchbox. The webPageSchema() function includes `isPartOf: { WebSite }` but that nested reference is not a standalone schema and does not trigger the feature.

6. **About page has explicit TODO for employer history (line 79):** `<!-- TODO Q9: prior employers / notable named projects, education, personal angle on why this work. -->` — This is a live E-E-A-T gap. Google and LLMs cannot verify experience claims without named prior employers or projects. The content is intentionally absent but it suppresses trust signals.

7. **BlogPosting schema missing image property:** The blog post schema at src/pages/blog/[...slug].astro has no `image` field in the BlogPosting JSON-LD. Google uses this for article rich results. Without it, the post is ineligible for image-enhanced results.

8. **Blog post missing author image and sameAs in inline schema:** The author object in the BlogPosting schema only has `name` and `url`. It should include `image` and `sameAs` (LinkedIn URL) to strengthen E-E-A-T signals for AI citation.

9. **Work page is thin — 3 anonymised case studies:** /work has 3 case study entries (insurance platform, crypto hedge fund, Cuko AIP) with no client sector depth, no before/after metrics on Cuko AIP, and no indication of timeline, team size, or stack. This page is the strongest E-E-A-T asset if fleshed out. Google and LLMs cannot cite specific experience without specifics.

10. **Contact page has no ContactPoint schema:** The contact page has rich channel information but no ContactPoint or Person schema contextualising it. This is easy structured data to add.

11. **RSS feed missing atom:link self-reference and image tag:** The RSS feed (src/pages/rss.xml.ts) does not include an atom:link rel=self or a channel <image> element. Both improve feed reader discovery and are recommended by Google's RSS guidelines.

12. **Twitter/X card missing twitter:site and twitter:creator tags:** BaseLayout only emits twitter:card, twitter:title, twitter:description, twitter:image. If there is an @handle, adding twitter:site and twitter:creator strengthens social graph identity.

## P2 — GEO-specific improvements (ongoing)

13. **llms.txt missing blog post entries:** The llms.txt pages list has only the static pages. The blog post URL and description should be added when posts are published.

14. **No "What is a fractional CTO" definitional paragraph near the top of /services:** The services page opens with "Eight engagement modes, ordered from highest hands-on intensity to advisor-only." LLMs answering "what is a fractional CTO" look for the first clear definition on the authoritative page. The definition exists on the home page FAQ but not on /services or /about intros.

15. **Blog posts have no related post cross-links:** The single blog post links only to /contact. As the blog grows, internal links to /services, /compliance, /work, and between posts build topical authority.

16. **Stat grid numbers are JS-animated from 0 — not in static HTML:** The NumberCounter component renders `<span class="num">0</span>` in the initial HTML. Crawlers that don't execute JS (Googlebot does, but many AI scrapers don't) see "0" for all stats. Consider adding the final value as the noscript or data attribute visible in the HTML before animation.
    - File: src/components/NumberCounter.astro
    - The `aria-label` on the counter span does have the correct value, so screen readers are fine.

17. **No FAQ or Q&A schema on /services or /compliance:** These pages contain implicit FAQs (pricing, regulation scope, engagement terms) but no FAQPage schema. Adding 3–5 FAQ pairs to each page would increase LLM extraction and Google rich result eligibility.

18. **Organization schema missing logo property:** The organizationSchema() in seo.ts has no `logo` field. Google uses Organization.logo for Knowledge Panel. The logo.svg is at /logo.svg.

19. **All sitemap lastmod values are the same build timestamp:** Sitemap shows 2026-04-26T20:03:43.959Z for all pages. Google uses lastmod to prioritise recrawling. Pages that rarely change (privacy, accessibility) should reflect actual content dates; blog posts should reflect pubDate.

20. **No article:published_time / article:author Open Graph tags on blog posts:** The blog post page emits og:type=website (inherited from BaseLayout). It should emit og:type=article with article:published_time, article:author, and article:tag for proper social sharing and LLM metadata extraction.
