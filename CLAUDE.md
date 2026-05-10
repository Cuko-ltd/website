# CLAUDE.md

Project-specific rules and context for Claude Code working on the Cuko Ltd website.

---

## Project context

**What this is.** The marketing + content site for Cuko Ltd — Samuel Ventimiglia's fractional Chief Technology Officer consultancy. London-based; sectors: crypto-native finance, healthcare, AI/agent infrastructure, cloud-native. Differentiator: hands-on (writes production code) + article-level regulatory engineering depth across DORA, MiCA, EU AI Act, GDPR.

**Stack.**

- Astro 5 (static site generator), TypeScript, content collections
- `@fontsource-variable/inter` + `@fontsource-variable/jetbrains-mono` (self-hosted fonts, no Google Fonts CDN)
- `@astrojs/sitemap`, `@astrojs/rss`
- Playwright + axe-core for accessibility CI
- `@resvg/resvg-js` (devDep) for build-time og-image generation
- No frontend JS framework. No CSS framework. Hand-written CSS in `src/layouts/BaseLayout.astro` global block.

**Hosting + domain.** Cloudflare Pages (CNAME in `public/`). Live at https://cuko.uk.

**Key paths.**

- `src/pages/` — Astro routes; one `.astro` file per page
- `src/content/blog/` — Markdown blog posts loaded via content collection (schema in `src/content.config.ts`)
- `src/layouts/BaseLayout.astro` — universal HTML head, schema injection, global CSS, theme handling
- `src/lib/seo.ts` — single source of truth for Person, Organization, ProfessionalService, WebSite, FAQPage, BreadcrumbList, BlogPosting schemas + the SITE_URL, BOOKING_URL, CTA_LABEL constants
- `src/components/` — shared Astro components (Masthead, Footer, StickyCTA, JsonLd, NumberCounter)
- `public/llms.txt` — GEO discovery file; **must be updated on every blog post publish** with new entry under `## Blog posts`
- `public/og-image.png` — generated at build time by `scripts/generate-og-image.mjs` via the `prebuild` npm script
- `astro.config.mjs` — site URL, custom sitemap policy with per-URL priority + lastmod (sitemap policy lives in `policyFor()` and the `serialize()` callback)
- `doc/blog-outlines/` — internal blog post outlines drafted before writing prose; informal, not user-facing
- `.claude/agents/` — project-specific agent configurations available to this Claude Code instance

**Voice + content style.** Direct, first-person, practitioner. No corporate filler. Article-level regulation specificity over abstract framework talk. The published blog post `when-you-actually-need-nanoseconds.md` is the canonical voice template — match it.

---

## Editorial rule 1 — citations and sources

**Verify every cited fact before publishing.** Any statistic, date, regulation article reference, market figure, competitor claim, or third-party assertion in a blog post (or any user-facing page) must be checked against a primary or authoritative source before going live. Do not cite from memory. Do not paraphrase a number you cannot trace.

- **Primary source preferred:** the regulation text itself (EUR-Lex), the regulator's official guidance (FCA, ESAs, ENISA, ECB), the company's own filing, the published study with methodology.
- **Secondary acceptable** when the primary is paywalled or inaccessible: a reputable publication (FT, Sifted, Reuters) reporting with attribution.
- **Not acceptable:** SEO content farms, vendor blogs without methodology, AI-generated summaries, or unsourced LinkedIn posts.

**Every published blog post must include a Sources section** at the end, listing each cited fact with a working link to the primary or authoritative source. Format:

```markdown
## Sources

- [Regulation (EU) 2022/2554 — Digital Operational Resilience Act (DORA)](https://eur-lex.europa.eu/eli/reg/2022/2554/oj) — Articles 6–16, 17–23, 28
- [European Banking Authority — DORA Register of Information ITS](https://www.eba.europa.eu/...) — register submission deadline 30 April 2025
- [Sifted — Fintech Funding H1 2025](https://sifted.eu/...) — €4.6bn → €3.7bn EU fintech funding
```

**For inline links in body text:** when a specific stat, date, or article is mentioned in prose, link the supporting source on the first occurrence. Subsequent mentions of the same fact in the same post do not need to be re-linked.

**When a source cannot be verified:** either drop the claim, soften it to a non-numeric statement ("most teams" instead of "78% of teams"), or mark it explicitly as a first-party engagement-experience estimate ("based on the engagements I've reviewed, roughly half…").

**EUR-Lex caveat.** EUR-Lex pages render via JS and `WebFetch` will return empty content. Use `WebSearch` to find a verbatim or authoritative quote, or fetch from `artificialintelligenceact.eu` (annotated EU AI Act mirror) or `streamlex.eu` (DORA annotated mirror). Always include the EUR-Lex link in the Sources section even when verification was via mirror.

This rule applies to:

- Every blog post in `src/content/blog/`
- Every regulation landing page (`/dora`, `/eu-ai-act`, `/mica`, etc.)
- The `/compliance` page when adding new article references
- Any guest post, podcast notes, or LinkedIn post that names a number Cuko did not produce

This rule does **not** apply to:

- Internal planning docs in `doc/` (outlines, drafts, marketing plans)
- Cuko's own engagement claims (17 years, 40+ launches, 3 breach incidents — these are first-party operator claims, not third-party citations)
- Generic best-practice advice that does not turn on a specific number or article
- First-party cost estimates explicitly framed as engagement-experience figures (e.g. "£40k–£150k for tier-two compliance work — figures from Cuko engagement experience")

---

## Editorial rule 2 — SEO/GEO agent review before publish

**Every blog post must be reviewed by the `seo-geo-optimizer` agent before going live.** No exceptions. Run the review after the draft is written and source-verified, but before pushing to production. The agent's recommendations are advisory but should be treated as the default — apply all P0 + P1 edits unless there is a specific editorial reason not to.

**The agent must receive:**

1. The markdown source file path
2. The built HTML path (`dist/blog/<slug>/index.html`) for rendered structure inspection
3. The targeted primary keyword
4. The targeted GEO query (the buyer query the post should be cited for in ChatGPT / Perplexity / Claude / Google AI Overviews)
5. Notice of which schema infrastructure already exists site-wide (BlogPosting, Person, Organization, WebSite, BreadcrumbList, FAQPage when `faqs` frontmatter present, og:type=article, custom sitemap entry, llms.txt entry)
6. Notice that the Sources section is mandatory per Editorial rule 1 — recommend format improvements only, never removal

**Apply at minimum:**

- All P0 (must-fix before publish) recommendations
- All P1 (high-impact, ship next) recommendations
- P2 at editorial discretion

**The standard publish workflow** for a blog post is therefore:

1. **Outline.** Draft an outline in `doc/blog-outlines/NN-slug.md`. Use existing outlines as the format template. Include source-verification checklist + draft Sources section + draft FAQs.
2. **Source verify.** WebFetch / WebSearch every cited regulation article, date, penalty figure, market stat. Compile verified Sources list.
3. **Write prose.** Convert the outline to full markdown post in `src/content/blog/<slug>.md`. Include frontmatter (`title`, `description`, `pubDate`, `author`, `tags`, `draft: false`, `faqs` array). Mark composite anecdotes as such ("A composite of engagement situations I see often"). End with the standard italic CTA + Sources section.
4. **Update llms.txt.** Add the new post to the `## Blog posts` section in `public/llms.txt` with description + pubDate.
5. **Build.** `npm run build` — confirm no errors, sitemap updated with new URL + lastmod = pubDate, FAQ schema emitted in built HTML.
6. **SEO+GEO agent review.** Spawn `seo-geo-optimizer` agent with the brief above. Receive structured P0/P1/P2 report.
7. **Apply P0 + P1 edits.** Frontmatter changes (title, description, faqs), body changes (TL;DR rewording, H2 keyword variants, anchor text). Rebuild and verify.
8. **Commit.** Conventional commit message describing the post. Co-authored trailer.

---

## Conventions

**Frontmatter required fields** (per `src/content.config.ts`):

- `title` — string. Keep title portion under 60 chars (Google snippet truncation). Front-load primary keyword.
- `description` — string. Keep under 155 chars (meta description snippet truncation). Front-load primary keyword.
- `pubDate` — date. ISO format `YYYY-MM-DD`. Sets sitemap lastmod for the post URL.
- `author` — string. Defaults to `Samuel Ventimiglia`.
- `tags` — string array. Always include `fractional-cto` tag.
- `draft` — boolean. Default `false`. Set `true` to exclude from build, sitemap, RSS, blog index.
- `faqs` — optional array of `{question, answer}` objects. When present, the blog post template emits FAQPage JSON-LD automatically. Use to capture the buyer queries the post should answer for AI engines.

**Internal linking.** Every blog post should weave 3–5 internal links to `/services`, `/compliance`, `/work`, and prior blog posts. Anchor text descriptive, never "here" or "click here".

**Composite anecdotes.** When the lede uses a fictional or amalgamated client situation (rather than a real Samuel engagement), label it explicitly: "A composite of engagement situations I see often" or similar. This preserves credibility without requiring real engagement disclosure.

**TL;DR blockquote.** Every blog post opens with a `> **Short answer.**` blockquote in the first 200 words. The first 1–3 sentences must directly answer the GEO target query — LLMs lift these for citation. Place time-bounded urgency (regulation deadlines, application dates) early in the block, not buried.

**Sitemap policy.** `astro.config.mjs` has a `policyFor()` function that maps URL → priority + changefreq. New regulation landing pages should get priority 0.9, new blog posts inherit 0.9 automatically via the `/blog/` prefix branch. Update `policyFor()` when adding new top-level pages.

**llms.txt discipline.** This file is the GEO discovery surface. Every new blog post, regulation landing page, or commercial page must be reflected here within the same commit. The `## Blog posts` and `## Pages` sections are both indexed by AI engines.

**Voice and length.** Match the canonical post `src/content/blog/when-you-actually-need-nanoseconds.md`. Word count target 1,800–2,400. First-person, practitioner register. Article-level specificity over framework abstractions.

---

## Why these rules

The Cuko positioning depends on three things that compound: article-level regulatory precision (citations matter), discovery via AI engines (GEO matters), and authority that survives a single mistake (verification matters). A single mis-cited regulation article or out-of-date statistic in a published post undermines exactly the differentiator the brand is building. Big-4 firms can absorb a citation error because the brand pre-dates the post. Cuko cannot.

GEO systems (ChatGPT, Perplexity, Claude, Google AI Overviews) increasingly weight three signals when deciding which sources to surface: citation completeness (Sources sections with primary links), schema completeness (FAQPage, BlogPosting, Person), and answer-density structure (TL;DR blocks, definitional sentences front-loaded). The seo-geo-optimizer agent enforces those signals consistently across posts, which is more reliable than ad-hoc judgement on each draft.
