# Cuko Ltd — brand and design system

This document is the source of truth for the Cuko Ltd visual and verbal identity as it lives on cuko.uk and any related digital surface (slide decks, GitHub READMEs, social cards). It exists so that anyone shipping work under the Cuko name — whether the founder, a future collaborator, an agency, or an AI assistant — can stay coherent without having to reverse-engineer the site.

When the document and the live code disagree, **the live code wins**. Update this document to match.

---

## 1. Identity

### 1.1 What Cuko Ltd is

A UK-registered private company providing fractional, hands-on Chief Technology Officer services. The company is the consulting vehicle of Samuel Ventimiglia and the steward of Cuko AIP, an open protocol for AI-agent ownership records.

### 1.2 What the brand has to do

- Convey **senior-engineer authority** without being intimidating.
- Convey **hands-on** — code lands, decisions get made.
- Convey **regulatory fluency** — for buyers in crypto-native finance, healthcare, AI infrastructure, and regulated cloud-native systems.
- Convey **trust** in plain visual terms: clear hierarchy, hard rules, no ornament.
- Avoid the "consultant in a turtleneck" register. Avoid the "agency with a manifesto" register. Avoid the "VC-funded SaaS" register.

### 1.3 What the brand is not

- Not playful. Not whimsical. Not minimalist-zen.
- Not a startup brand. Not a Web3 brand. Not a banking brand.
- Not anonymous. The site is a person doing the work, surfaced through a company.

---

## 2. Logo

### 2.1 Wordmark

```
Cuko_
```

`Cuko` set in JetBrains Mono Variable, weight 600, in `--ink`. The trailing underscore set in `--accent`. The underscore animates as a CLI prompt cursor: 1.06 s `steps(1)` blink, halted under `prefers-reduced-motion: reduce`.

The reference behind the cursor: a terminal prompt awaiting input. It is a deliberate signal that Cuko is built by and for engineers, not an MBA brand.

The wordmark hover state: `Cuko` shifts to `--accent`; the cursor stays.

### 2.2 Tagline

Set immediately below the wordmark in JetBrains Mono Variable, weight 400, `--ink-soft`, uppercase, letter-spacing 0.08em:

```
Cuko Ltd · Fractional Hands-on CTO
```

The legal entity name appears in the tagline rather than the wordmark itself. This keeps the wordmark short and recognisable at small sizes; the legal name remains visible immediately beneath.

### 2.3 Favicon mark

Square 256×256, ink-fill background, wordmark in cream `Cuko` and accent `_`, centred. Lives at `public/mark.svg` and is the source uploaded to realfavicongenerator.net to produce the full favicon set. At 16×16 the wordmark is no longer legible; the recognisability comes from the colour signature (dark square with a small accent stripe near baseline).

### 2.4 Files

| Path | Purpose |
|---|---|
| `public/logo.svg` | Wordmark on transparent, theme-aware via `prefers-color-scheme` |
| `public/mark.svg` | Square favicon source |
| `public/favicon.svg`, `favicon.ico`, `favicon-96x96.png`, `apple-touch-icon.png`, `web-app-manifest-{192,512}x{192,512}.png` | Generated via realfavicongenerator |
| `public/site.webmanifest` | PWA manifest, theme color `#1f4dff`, background `#f4f3ee` |

### 2.5 Don'ts

- Do not skew, rotate, or distort the wordmark.
- Do not change the cursor character (no `|`, no `▮`, no `█`).
- Do not place the wordmark on backgrounds outside the palette.
- Do not add tagline language above the wordmark.
- Do not use the wordmark on accent fills (the cursor disappears against accent).

---

## 3. Colour palette

The palette is electric-blue on warm cream with a near-black ink. The blue accent was chosen specifically to satisfy two constraints simultaneously: WCAG 2.2 AA in every role (text, fill, cursor on paper) and stability across the most common colour-vision deficiencies (deuteranomaly, protanopia, tritanopia). An earlier orange was rejected on those grounds.

### 3.1 Light tokens

| Token | Hex | Role |
|---|---|---|
| `--ink` | `#0a0a0a` | Primary text, hard 2 px borders |
| `--ink-muted` | `#2e2e2e` | Body prose, descriptions |
| `--ink-soft` | `#565656` | Captions, labels, tagline, status bar |
| `--paper` | `#f4f3ee` | Page background (warm cream) |
| `--paper-alt` | `#e9e8e2` | Cell fills, code background, inline tag chips |
| `--rule` | `#0a0a0a` | Outer 2 px borders on grid components |
| `--rule-soft` | `#b8b6ad` | Inner 1 px row separators |
| `--accent` | `#1f4dff` | Cursor, current-state nav, link hover, accent rule, CTA fill |
| `--accent-ink` | `#f4f3ee` | Text on accent fills |
| `--grid-line` | `rgba(10,10,10,0.06)` | Faint horizontal grid overlay on body |

### 3.2 Dark tokens

| Token | Hex | Role |
|---|---|---|
| `--ink` | `#f4f3ee` | inverted from light |
| `--ink-muted` | `#c8c5b9` | |
| `--ink-soft` | `#969386` | |
| `--paper` | `#0a0a0a` | |
| `--paper-alt` | `#161614` | |
| `--rule` | `#f4f3ee` | |
| `--rule-soft` | `#4a4842` | |
| `--accent` | `#7595ff` | Lightened blue for visibility on dark |
| `--accent-ink` | `#0a0a0a` | Dark text on lighter accent fills |
| `--grid-line` | `rgba(244,243,238,0.06)` | |

### 3.3 Theme application

Three modes:

- **Auto** (default): follows OS `prefers-color-scheme` via media query.
- **Light**: explicit override via `data-theme="light"` on `<html>`.
- **Dark**: explicit override via `data-theme="dark"` on `<html>`.

User selection persists in `localStorage` under key `cuko-theme`. A pre-paint inline script in `<head>` reads the value before body renders to avoid flash-of-unstyled-content. CSS uses `:root[data-theme="dark"]` for explicit overrides alongside the `prefers-color-scheme` media query so explicit modes win over OS preference.

### 3.4 Contrast ratios (light theme)

| Pair | Ratio | WCAG |
|---|---|---|
| `--ink` on `--paper` | ~19 : 1 | AAA |
| `--ink-muted` on `--paper` | ~12 : 1 | AAA |
| `--ink-soft` on `--paper` | ~7.4 : 1 | AAA |
| `--ink-soft` on `--paper-alt` | ~6.3 : 1 | AA |
| `--accent` on `--paper` | ~5.5 : 1 | AA |
| `--accent-ink` on `--accent` | ~5.0 : 1 | AA |

All pairs in active use exceed WCAG 2.2 AA. Dark theme is held to the same bar.

### 3.5 Inclusive design

- The accent never carries information alone. Current-state nav uses fill **and** weight **and** an arrow code; the cursor is a character glyph (`_`); links are underlined.
- Tag chips use a coloured dot prefix and a hard border so users with reduced colour discrimination still see the chip boundary.
- Stat numerics are tabular-nums and use weight differential rather than colour alone.
- Under `prefers-contrast: more`, muted greys collapse to full ink and all borders force to `--rule`.

### 3.6 Palette do / don't

- **Do** use `--accent` for CTA fills, current state, the brand cursor, the hero accent rule, link hover, and the orange-equivalent dot in tag chips.
- **Don't** use `--accent` for body text.
- **Don't** introduce a new colour without writing a contrast check and a CVD note.
- **Don't** use opacity to dim text (it tanks effective contrast and was the cause of an early `nav-code` failure). Use a `--ink-soft` colour instead.

---

## 4. Typography

### 4.1 Families

- **Mono**: JetBrains Mono Variable, self-hosted via `@fontsource-variable/jetbrains-mono`. Used for headings, nav, labels, stats, FAQ titles, contact-card body, code, tag chips, and post titles.
- **Sans**: Inter Variable, self-hosted via `@fontsource-variable/inter`. Used for body prose only.

Self-hosted to keep the privacy notice clean (no Google Fonts CDN data leak) and to avoid a third-party fetch on every page load.

### 4.2 Hierarchy

| Role | Family | Weight | Size |
|---|---|---|---|
| Hero h1 (home) | Mono | 500 | clamp(2rem, 5.4vw, 4rem) |
| Hero h1 (interior) | Mono | 500 | clamp(1.8rem, 4.4vw, 2.8rem) |
| h2 | Mono | 500 | 1.4 – 1.6 rem |
| h3 | Mono | 500 | 1 – 1.05 rem |
| Body prose | Sans (Inter) | 400 | 1 – 1.12 rem |
| Section label | Mono | 500 | 0.7 rem uppercase, letter-spacing 0.08em |
| Nav link | Mono | 400 inactive / 600 current | 0.78 rem uppercase, letter-spacing 0.06em |
| Stat value | Mono | 500 | clamp(2rem, 5vw, 3.2rem), tabular-nums |
| Tag chip | Mono | 400 | 0.82 rem |

### 4.3 Numerics

Always use tabular-nums and lining-nums where numbers convey meaning:

```
font-feature-settings: 'tnum' 1, 'lnum' 1;
font-variant-numeric: tabular-nums lining-nums;
```

This keeps stat-grid values aligned and post dates predictable across viewports.

### 4.4 Balanced wrapping

Hero h1 and post-header h1 use `text-wrap: balance` so headlines do not orphan a single word. Other headings let the browser default.

---

## 5. Layout primitives

### 5.1 Page

Maximum width 64 rem, centred. Padding 1.5 rem horizontal, 3.5 rem top, 4 rem bottom on the home page; standard 2 rem top on interior pages.

### 5.2 Hard borders

Outer borders are 2 px solid `--rule`. Inner row separators are 1 px solid `--rule-soft`. No rounded corners anywhere except the 1 px radius on `:focus-visible` outlines. Corners stay sharp because brutalism.

Components that adopt the hard-bordered pattern:

- `.stat-grid` — 4-cell metric showcase
- `ul.services` — engagement-mode rows
- `dl.facts` — labelled key-value rows
- `.faq` — question / answer pairs
- `.contact-card` — book / email / channels block
- `.footer-grid` — entity / office / contact / site cells
- `.tag-grid` items — inline mono tags
- The masthead status bar
- The masthead nav row
- The post-list on `/blog`
- The palette preview cards (internal)

### 5.3 Spacing

A loose 8 px ladder. Section vertical rhythm uses 4 rem between sections, 2 rem padding top after the section's top rule, 1.4 rem under headings, 0.9 rem between paragraphs. Inside grid components, padding is 0.6 to 1.3 rem depending on density.

### 5.4 Containers

```
.page {
  max-width: 64rem;
  margin: 0 auto;
  padding: 1.5rem 1.5rem 4rem;
}
```

Body has `overflow-x: hidden` as a defensive net so a misbehaving fixed element cannot reintroduce horizontal scroll on small screens.

### 5.5 Grid background

Body has a faint horizontal-line gradient overlay using `--grid-line`:

```
background:
  linear-gradient(var(--grid-line) 1px, transparent 1px) 0 0 / 100% 4rem,
  var(--paper);
background-attachment: fixed;
```

Subtle technical-document feel; never the dominant element.

---

## 6. Components

### 6.1 Section label

Top-left of every section, mono, uppercase, 0.7 rem, in a small bordered chip:

```html
<span class="section-label">→ What I do</span>
```

The leading arrow is part of the brand. Do not omit it on new sections.

### 6.2 Stat grid

Four cells, large mono numerics with `NumberCounter` animating from 0 on viewport entry. Uses `IntersectionObserver` with a fallback for unsupported browsers and a snap-to-final-value when `prefers-reduced-motion: reduce`.

### 6.3 Service list

Vertical stack of bordered rows, each with a mono `.svc-name` and a sans-serif `.svc-desc`. Hover lifts the row to `--paper-alt`.

### 6.4 Facts list (definition list)

Two-column grid: mono uppercase term, body description. Stacks at 600 px. Used wherever a key-value structure communicates better than prose: stack lists, regulation article lists, retention schedules, palette tokens.

### 6.5 Tag grid

Inline mono chips with an accent-coloured dot prefix. Used for passions, abilities, post tags. Each chip has a hard 2 px border and inverts to `--ink` on hover.

### 6.6 Contact card

Mono, on `--paper-alt` background, 2 px outer border, 1.4 rem padding. Always opens with **Book a discovery call ↗** as the first line, then **Email**, then secondary channels. The Book line is the highest-priority CTA on the page.

### 6.7 Masthead

Three rows:

1. **Status bar** — three mono cells (brand, location, build revision) plus a right-aligned theme toggle. LON and REV cells hide below 540 px. All cells hide below 420 px so the bar collapses to just the toggle.
2. **Brand row** — wordmark left, primary CTA button right. CTA hidden below 720 px (sticky CTA covers).
3. **Primary nav** — seven items numbered 00–06, current item gets accent fill.

### 6.8 CTA button

Primary action, accent fill, hard 3 px shadow offset down-right. Hovers to `translate(-2px, -2px)` with shadow growing to 5 px. Active presses to `translate(1px, 1px)` with shadow shrinking to 1 px. The shadow direction never changes.

### 6.9 Sticky mobile CTA

Bottom-right floating button, accent fill, hard shadow, same hover behaviour. Visible below 720 px only. Honours `env(safe-area-inset-*)` so it clears the iOS home indicator.

### 6.10 Footer

Four cells: Entity, Office, Contact, Site. The Site cell holds the legal-and-policy link list (Privacy, Accessibility, Security) and copyright.

---

## 7. Motion

The chosen animation set is deliberately small. Five behaviours, all CSS-or-light-JS, all respecting `prefers-reduced-motion`.

1. **Page transitions** via Astro `<ClientRouter />`. Near-zero JS, browser-native.
2. **Hero stagger-reveal** on load. h1 + paragraphs fade-up at 60 ms, 180 ms, 320 ms, 460 ms, 600 ms.
3. **Accent rule draw-in** with `transform: scaleX` from 0 to 1 over 0.6 s, cubic ease-out.
4. **Hover micro-interactions** — nav cells invert, arrow links translate 4 px right, service rows shift to `--paper-alt`, tag chips invert, CTA buttons lift with shadow growth.
5. **Number counter sweep** — IntersectionObserver-triggered, 1.4 s cubic ease-out, snaps to final value when reduced-motion.

Brand cursor blinks at 1.06 s steps; halted under reduced-motion.

What is **not** in the set: parallax, scroll-jacking, custom cursors, scroll-snap, modal dialogs, toast notifications, or any motion the user did not initiate. The brand register is "calm, technical, deliberate" — not "kinetic, playful, web-design-conference".

---

## 8. Accessibility commitments

- WCAG 2.2 Level AA across all public pages, validated by axe-core in CI on every push.
- Semantic landmarks (`header`, `nav`, `main`, `section`, `footer`).
- Skip-to-main link as first focusable element on every page.
- Visible `:focus-visible` accent ring on every interactive element.
- Touch targets ≥ 44 × 44 CSS pixels under `(pointer: coarse)`.
- `prefers-reduced-motion` halts every animation including the brand cursor blink.
- `prefers-contrast: more` collapses muted greys to full ink and forces all borders to `--rule`.
- Print stylesheet renders monochrome with link URLs expanded inline.
- `lang="en-GB"` declared.
- Heading hierarchy strict (no skipped levels).
- Colour never sole signal — see §3.5.

The full statement lives at `/accessibility`.

---

## 9. Voice and tone

### 9.1 General

- **British English** throughout — *organise*, *behaviour*, *colour*, *centre*, etc.
- Sentence-case headlines. No title-case.
- Em dashes `—` (not `--`), with hair-spaces or no space depending on context. Use sparingly.
- No emojis in copy unless a section explicitly calls for one.
- No filler ("simply", "just", "really", "actually").
- No hedging where a stronger claim is true.

### 9.2 Authority register

- Confident, not arrogant. State outcomes plainly. Avoid superlatives that need a footnote.
- Use specific numbers when they are real, anonymise where they are sensitive.
- Avoid jargon for jargon's sake. Avoid plain-English softening of technical terms when the technical term is more accurate.

### 9.3 Page personality

- **Home / Services / Compliance / Contact** — direct, factual. Short sentences. Outcomes first, then mechanism.
- **About** — slightly more personal. Lists Sam's experience and operating principles in his own voice.
- **Blog** — essays. Permission to be longer, more opinionated, more anecdotal. Each post should land a single argument.
- **Legal pages** (Privacy / Accessibility / Security) — neutral and complete. Avoid clever language; use the regulation's own terms.

### 9.4 Voice don'ts

- Do not write "we" when the company is one person; use "I" in the About page and the blog, "Cuko Ltd" or "we" in legal pages where a corporate voice is expected.
- Do not use marketing words: *robust*, *best-in-class*, *cutting-edge*, *next-generation*, *blazing fast*, *enterprise-grade* (unless the audience is regulated enterprise and the term is accurate).
- Do not start sentences with "We are excited to…", "We are happy to…". Cuko Ltd is not happy to do anything; it does the work.
- Do not use exclamation marks.

---

## 10. Maintenance

### 10.1 When changing the palette

Run the local accessibility test before committing:

```
npm run test:a11y
```

axe-core will fail the build if a contrast pair drops below AA. If it does, you have one of two choices: change the colour, or change which element uses it.

### 10.2 When adding a component

Re-use the primitives in §6 first. Only add a new pattern when the existing ones genuinely do not fit. New patterns must:

- Use the existing token system
- Match the 2 px outer border / 1 px inner rule convention
- Adopt mono headings and Inter body
- Pass `npm run test:a11y` and `npm run test:smoke` across the six configured viewports

### 10.3 When adding a page

1. Place under `src/pages/` (or `src/content/blog/` for posts).
2. Use `BaseLayout` with `title`, `description`, optional `structuredData`.
3. Add to `public/llms.txt` page list.
4. Add to `tests/smoke.spec.ts` `pages` array (with `inNav` flag).
5. Add to `tests/visual.spec.ts` paths.
6. Add to `tests/a11y.spec.ts` pages.
7. If footer-only, leave `inNav: false` and skip the nav.

### 10.4 When publishing a blog post

1. Add Markdown file to `src/content/blog/<slug>.md` with frontmatter:
   - `title`, `description`, `pubDate` required
   - `tags`, `updatedDate`, `author`, `readingTime` optional
   - `draft: true` to hide from index and RSS during writing
2. Reading time auto-computes from body word count if not set.
3. RSS, sitemap, blog index, and BlogPosting JSON-LD update automatically on build.
4. Run `npm run test:smoke` and `npm run test:a11y` before push.

### 10.5 When updating this document

Update timestamp below. If a token, primitive, or rule changes in the live code, this document should be updated in the same commit.

---

## 11. Source of truth

| Concern | Authoritative file |
|---|---|
| Token values | `src/layouts/BaseLayout.astro` (CSS variables) |
| Logo wordmark SVG | `public/logo.svg` |
| Favicon source | `public/mark.svg` |
| Animations | `src/layouts/BaseLayout.astro`, `src/components/*.astro` |
| Voice memory | `~/.claude/projects/<…>/memory/feedback_brand_aesthetic.md` |
| British English memory | `~/.claude/projects/<…>/memory/feedback_british_english.md` |
| Legal copy | `src/pages/{privacy,accessibility,security,compliance}.astro` |
| Site-wide JSON-LD | `src/lib/seo.ts` |

When this document and the live code disagree, fix the document and commit the fix. Never change the live code to match a stale doc without thinking.

---

*Last updated: 2026-04-26.*
