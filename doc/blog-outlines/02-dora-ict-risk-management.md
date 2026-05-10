# Blog Post #2 — Outline

> **Status:** outline ready for Samuel to write into prose. Format mirrors `when-you-actually-need-nanoseconds.md`. Target publish: Week 3 (26 May 2026).

---

## Strategic targeting

| Field | Value |
|---|---|
| Working title | What DORA actually requires from your ICT risk management framework |
| Primary keyword | fractional CTO DORA compliance |
| Secondary keywords | DORA ICT risk management, DORA Article 17, DORA gap register, fractional CTO fintech |
| GEO target query | "How do I make my fintech DORA compliant without a full-time CTO?" |
| Buyer persona | Fintech CTO / VP Eng / COO at EU-regulated firm. Has read DORA legal summary. Now needs to know what to build. |
| Word count target | 1,800–2,400 |
| Reading time | 9–11 min |

---

## Suggested frontmatter

```yaml
---
title: "What DORA actually requires from your ICT risk management framework"
description: "DORA applied 17 January 2025. The legal summary takes ten minutes to read. The engineering work it forces takes months. This post is the bridge between the regulation as written and the systems your engineers will actually build — for founders and CTOs who do not have a full-time compliance engineering team and need to know which articles cost real engineering time and which articles cost paperwork."
pubDate: 2026-05-26
author: "Samuel Ventimiglia"
tags:
  - dora
  - compliance
  - fintech
  - regulation
  - ict-risk-management
  - fractional-cto
draft: false
---
```

---

## TL;DR (insert as blockquote at top, after frontmatter, before lede)

> **Short answer.** DORA (Regulation (EU) 2022/2554) applied 17 January 2025 and binds in-scope financial entities to five engineering obligations that cost real time and budget: (1) an ICT risk-management framework wired to the actual production stack, not a Word document; (2) incident classification rules that emit the right notification when crossed; (3) a register of information for every ICT third-party that is queryable in days, not weeks; (4) digital operational resilience testing on a defined cadence, including threat-led penetration testing for significant entities; and (5) third-party exit strategies that have been tested. Everything else is paperwork around those five. If your team has not built the engineering substrate for these, you are not DORA compliant — you have a DORA document.

---

## Lede / opening anecdote (200–300 words)

**Pattern:** mirror nanoseconds opening. Real situation, anonymised, specific.

**Suggested setup:** A CASP or e-money institution sent over their DORA framework for review. 47-page Word document, signed off by the legal team, formally adopted by the board. None of it was wired to the observability stack. Incident classification was a section heading, not a rule that fired. Third-party register was a spreadsheet last updated four months ago. Threat-led penetration testing was on the roadmap.

**Punchline of the lede:** They thought they were compliant because they had the document. The regulator does not read documents. The regulator reads incidents and registers and test results.

**Bridge sentence:** "This post is for the founder, CTO, or compliance lead who has read the DORA summary, signed the framework, and is about to discover that the regulation was the easy part."

---

## Section 1 — What DORA actually is (the 90-second version)

**Goal:** definitional answer block for GEO. State plainly so an AI engine can extract the answer.

**Content beats:**
- DORA = Regulation (EU) 2022/2554. In force from 17 January 2025.
- Applies to financial entities (banks, investment firms, payment institutions, e-money institutions, **CASPs** under MiCA, insurers) and their **critical ICT third-party providers**.
- Five engineering pillars: ICT risk management (Arts 5–10), incident management (Arts 17–23), resilience testing (Arts 24–27), third-party risk (Arts 28–30), information sharing (Arts 45–49 — voluntary, skip).
- The first four are mandatory. The first four are engineering work.
- Penalties: up to 2% of total annual worldwide turnover for entities; up to 1% of average daily worldwide turnover for ICT third-party providers (Article 35).
- ESAs designated critical ICT third-party providers in November 2025; oversight is live.

**Citation hook for GEO:** open this section with one sentence that directly answers "what is DORA and who does it apply to?" so the AI engine can lift it.

---

## Section 2 — The engineering split: what costs paperwork vs what costs real time

**Goal:** the framework table. This is the citation magnet — same role as the latency regime table in the nanoseconds post.

**Suggested table:**

| DORA obligation | Article | What the document says | What the engineering work actually is | Who owns it |
|---|---|---|---|---|
| ICT risk management framework | Arts 5–10 | Adopt and maintain a framework | Inventory every system and data flow; map controls to actual repos and infra; emit the framework as code, not as PDF | Engineering + risk |
| Incident classification | Arts 17–18 | Classify incidents by severity | Define rules in your observability stack that fire when criteria cross; alert routes to the right people; training playbooks rehearsed | SRE / on-call |
| Major-incident notification | Arts 19–20 | Notify within prescribed windows | Notification template ready, decision tree for what counts as "major", communications path to regulator pre-approved | CISO + legal |
| ICT register of information | Art 28 | Maintain a register of ICT contracts | Queryable database of every third-party ICT relationship, contract terms, criticality classification, exit risk | Procurement + engineering |
| Resilience testing | Arts 24–27 | Test ICT resilience on a defined basis | Tabletop exercises, scenario-based tests, threat-led pentest (TLPT) for significant entities every 3 years | Security + engineering |
| Third-party exit strategy | Art 28(8) | Document and test exit strategies | Migration runbook for every critical ICT provider; tested in staging at least once; data egress paths verified | Engineering |

**Argument:** the paperwork rows take a week each. The engineering rows take a quarter each. Founders who cost the regulation by reading the legal summary underestimate by 10x.

---

## Section 3 — The five engineering pillars, in detail

For each pillar, give: what it is in one sentence, what the regulation actually requires you to build (not what to write), and the failure mode that exposes you.

### 3.1 ICT risk-management framework as code (Articles 5–10)

- **What it is:** identification, protection, detection, response, recovery — NIST CSF aliases mapped onto every system you run.
- **What you build:** an inventory of systems, data flows, classification of criticality. The ICT risk register lives next to the source code, not in SharePoint. Controls map to repos.
- **Failure mode:** the framework references "the trading system" but no engineer can name which repo, which deploy, or which runtime that means.
- **Implementation hint:** terraform-tagged resources + a lightweight `compliance/` directory in each repo with the controls that apply. CI fails if a critical-tier service ships without the required tags.

### 3.2 Incident classification that actually fires (Articles 17–18)

- **What it is:** every operational anomaly classified by impact (clients affected, financial value, data breach, reputational), reported to senior management, and (if "major") notified to the competent authority within prescribed windows.
- **What you build:** classification rules in PagerDuty / Opsgenie / your alerting stack. When a rule fires, the on-call engineer sees the classification immediately, not after a triage meeting.
- **Failure mode:** the framework defines "major incident" but the rule is not in the alerting stack, so by the time an engineer realises the threshold was crossed, the notification clock is half-spent.
- **Reference the breach experience:** Samuel has handled three production data breaches end-to-end including regulator notification. The 72-hour clock from GDPR Article 33 is the same shape — the team that has not rehearsed loses a day arguing about classification.

### 3.3 Register of information that is queryable in hours (Article 28)

- **What it is:** a register of every contractual arrangement with ICT third-party providers, with criticality classification, location of data processing, exit terms.
- **What you build:** a structured database (not a spreadsheet) that procurement updates when contracts change. Engineering tags every dependency with its provider in code. Queries: "every critical ICT provider where data is processed outside the EEA" returns in seconds.
- **Failure mode:** the spreadsheet was last updated for the audit nine months ago. The team has signed three new SaaS contracts since then. The regulator asks for the register and the company spends two weeks reconstructing it.
- **The April 2025 deadline:** ICT third-party reporting register submission deadline was 30 April 2025. If you missed this, you are already late — that is itself a Major ICT-related incident-adjacent issue.

### 3.4 Resilience testing on a defined cadence (Articles 24–27)

- **What it is:** scenario-based testing of ICT resilience for all in-scope entities; threat-led penetration testing (TLPT) for significant entities every three years per the TIBER-EU framework.
- **What you build:** a testing programme calendar, scenarios documented and approved by the board, evidence of execution and remediation. Game-day exercises that exercise the full incident-classification → notification → recovery loop.
- **Failure mode:** the TLPT is contracted to a third party who treats it as a checklist exercise; no remediation plan; findings sit in JIRA for nine months.
- **TLPT note:** this is expensive (£60k–£200k for a real exercise) and takes 6+ months to scope. If you are a significant entity and have not started, start now.

### 3.5 Third-party exit strategies that have been tested (Article 28(8))

- **What it is:** for every critical ICT provider, a documented and tested exit strategy. "Tested" means you have actually migrated some workload, not just written a runbook.
- **What you build:** for each critical provider — a migration runbook, an alternative provider identified, the data egress mechanism verified, the cost of exit modelled. Tested at least once in staging.
- **Failure mode:** the cloud-provider exit strategy reads "migrate to alternative cloud provider X" but no one has tried, the actual data export takes 14 days at vendor's egress rate, and the alternative has no Kubernetes operator parity.

---

## Section 4 — How to know if you actually need to act now

Pattern from nanoseconds post: three signals that mean this is urgent vs a deferrable problem.

**Signal 1 — In-scope entity status.** Are you a financial entity under DORA Article 2 OR a critical ICT third-party provider designated by the ESAs? If yes, you are in scope. CASPs under MiCA are in scope. E-money institutions are in scope. Many UK firms with EU operations are in scope via their EU subsidiaries.

**Signal 2 — Open enforcement window.** Have you received any communication from your competent authority — the FCA in the UK (for regulated UK firms), BaFin in Germany, AMF in France, CONSOB in Italy, etc. — referencing DORA readiness? If yes, the clock is short.

**Signal 3 — A real incident or third-party exposure.** Has a critical ICT provider had a public outage, breach, or change of control in the past 12 months? Article 28 requires you to assess and document. If you have not, you are accumulating regulatory risk every month.

**If none of the three:** you have time. Build the framework as code over the next 6 months. Do not buy a £200k Big-4 engagement.

**If any of the three:** the diagnostic is the right next step. One week, mapped against the regulation, gap register produced.

---

## Section 5 — The cost structure (this is the section CFOs read)

**Argument:** like the latency regime walls, DORA cost has discontinuous tiers.

- **Tier 1 — Document and adopt:** £5k–£20k. A consultant writes the framework. You sign it. You have a compliant document and a non-compliant system. This is what most firms have done.
- **Tier 2 — Wire the framework into engineering:** £40k–£150k over 3–6 months. Inventory, classification rules, register, exit runbooks built and tested. This is what compliant firms have done.
- **Tier 3 — Significant entity full programme:** £200k+ per year ongoing including TLPT. Required if classified as significant.

The Big-4 will quote Tier 3 prices for Tier 2 work. The fractional model fits Tier 2 exactly: a senior engineer who knows the regulation, ships the implementation, and trains the in-house team to maintain it.

---

## Section 6 — Where this goes wrong (the mistakes pattern)

Mirror the closing section of nanoseconds.

- **Mistake 1 — The framework document trap.** Spending £15k on a beautifully written framework and zero on the engineering substrate. The regulator does not read documents, only artefacts.
- **Mistake 2 — Treating DORA as a one-off project.** DORA is continuous. Once you are in scope, every architectural change either preserves compliance or breaks it. Code review, deployment, monitoring, hiring all change to match.
- **Mistake 3 — Outsourcing to a Big-4 and assuming it is handled.** Big-4 produces the framework. Big-4 does not ship the code. The implementation gap is yours to close.
- **Mistake 4 — Ignoring the third-party exit strategy.** Exit strategies that have not been tested are not exit strategies. The Article 28(8) requirement is not satisfied by a Word document.
- **Mistake 5 — Confusing TIBER-EU TLPT with a normal pentest.** TIBER-EU is a specific methodology with regulator involvement. A standard pentest does not satisfy Articles 26–27 for significant entities.

---

## Section 7 — The pragmatic recipe

**Step 1 — Confirm scope.** Are you a financial entity under Art 2? Are you a CASP? Are you a critical ICT third-party provider? Document the answer with reference to the article.

**Step 2 — Run a gap diagnostic.** One week of work. Each of the five pillars assessed against your current state. Gap register produced. Prioritised by regulatory severity and engineering effort.

**Step 3 — Wire the framework into code.** Engineering work, 3–6 months. Inventory, classification rules in alerting stack, register of information as a queryable database, exit runbooks tested in staging, resilience testing programme calendar.

**Step 4 — Train the team to maintain it.** Compliance is not a project — it is now part of the deployment loop. CI gates, code review checklists, quarterly resilience exercises. The fractional engagement ends when the in-house team can run the loop without you.

**Step 5 — Document the artefacts, not the framework.** Regulator submissions are evidence (incident reports filed, register exports, test results, exit strategy test logs), not policy documents.

---

## Closing CTA

**Pattern from nanoseconds post — italic note + link.**

Suggested:

> *If you are a financial entity, a CASP, or a critical ICT provider and the gap between your DORA framework and the engineering substrate has just become uncomfortable, that is the engagement [Cuko Ltd does](/services). [Book a discovery call](/contact) — thirty minutes, no obligation. The first deliverable is a one-week gap diagnostic against the five pillars.*

---

## Internal links to weave naturally

| Anchor text | Target | Where |
|---|---|---|
| "regulatory engineering" | /compliance | Section 1 or 2 |
| "fractional CTO engagement" | /services | Section 5 (cost) or closing CTA |
| "Hands-on build lead" | /services#modes | Section 7, recipe step 3 |
| "Compliance-first system design" | /services#modes | Section 2 |
| "selected work" | /work | Section 3 (proof of breach experience) |
| "When you actually need nanoseconds" | /blog/when-you-actually-need-nanoseconds/ | Section 5, on regime cost analogy |

---

## Source verification (per CLAUDE.md — mandatory before publish)

Every cited fact must trace to a primary or authoritative source with a working link. Verify each of the following while drafting:

- [ ] Regulation citation: DORA = Regulation (EU) 2022/2554, application date 17 January 2025 — verify via EUR-Lex
- [ ] Article ranges (Arts 5–10, 17–23, 24–27, 28–30, 28(8)) — verify each against EUR-Lex DORA text
- [ ] Penalty figures (2% / 1%) — verify via Article 35 of the regulation
- [ ] Register of information submission deadline (30 April 2025) — verify via EBA / ESA guidance
- [ ] TLPT cost range and 6-month scoping claim — sanity check against TIBER-EU framework guidance and a recent published industry report
- [ ] ESA designation of critical ICT third-party providers (November 2025) — verify via ESA press release
- [ ] Cost tier figures (£5k–£20k, £40k–£150k, £200k+) — frame as Samuel's first-party engagement-experience estimates, not third-party citations (acceptable per CLAUDE.md exception)

## Sources section (mandatory in published post — append before final CTA)

Compile as you draft. Format:

```markdown
## Sources

- [Regulation (EU) 2022/2554 — Digital Operational Resilience Act](https://eur-lex.europa.eu/eli/reg/2022/2554/oj)
- [EBA — DORA register of information Implementing Technical Standards](https://www.eba.europa.eu/...)
- [ESAs — Designation of critical ICT third-party providers (November 2025)](https://www.esma.europa.eu/...)
- [TIBER-EU framework — European Central Bank](https://www.ecb.europa.eu/paym/cyber-resilience/tiber-eu/)
```

## SEO + GEO checklist before publish

- [ ] Title matches keyword cluster, 50–60 chars
- [ ] Description (frontmatter) opens with the regulation name, contains "fractional CTO" and "DORA"
- [ ] TL;DR blockquote in first 200 words contains direct answer to GEO target query
- [ ] H2 sections include keyword variants ("ICT risk management", "Article 17", "DORA gap register")
- [ ] Internal links: 3–5 to /services, /compliance, /work, prior post
- [ ] **Sources section present at end of post with working links to primary sources for every cited fact**
- [ ] Update `public/llms.txt` Blog posts section with new entry + description
- [ ] Update sitemap will be automatic — verify lastmod = pubDate after build
- [ ] og:type=article + article:tag meta will be automatic via BaseLayout
- [ ] Run Rich Results Test on the live URL to verify BlogPosting + Person schema
- [ ] Submit URL to Google Search Console for indexing

---

## Distribution checklist (post-publish, same week)

- [ ] LinkedIn post Day 0 — quote the TL;DR, link in first comment, tag relevant fintech voices for visibility
- [ ] LinkedIn post Day 3 — pull one sub-section as a standalone insight (e.g. "The 47-page DORA document is not what makes you compliant. Here's what does."), link to full post
- [ ] LinkedIn post Day 7 — pull the cost-tier section as its own post, link to full post
- [ ] Update `public/llms.txt` immediately
- [ ] Drop link in Sifted Slack #compliance / Fintech Founders if community context allows (no spam, only if relevant thread)
- [ ] Add to Cuko sitemap (automatic via build)
- [ ] Email any VC operating partner you have engaged with previously: "Wrote this up for portfolio companies struggling with DORA. Pass on if useful."
- [ ] Run a GEO probe one week after publish: "How do I make my fintech DORA compliant without a full-time CTO?" — does cuko.uk appear?

---

## Notes for Samuel while writing

- **Voice:** keep the practitioner register from nanoseconds post. First person, specific anecdotes, willing to name the failure modes. Do not soften.
- **Specificity beats authority:** quote articles by number. Quote the 17 January 2025 application date. Quote the 30 April 2025 register deadline. Article-level precision is the differentiator competitors lack.
- **Resist the urge to cover Articles 11–16 and 31–34.** This post is the practitioner's view of what costs engineering time. The exhaustive article walkthrough belongs on `/dora` landing page (separate workstream).
- **Watch length.** 1,800–2,400 words. The nanoseconds post was 2,140 — same target.
- **One concrete example per section minimum.** The CASP framework anecdote in the lede should not be the only one. Either pull two more from past engagements (anonymised) or invent illustrative ones marked as composite.
- **Closing CTA should not feel like a sales close.** The nanoseconds CTA works because it is a single line at the end after the value has been delivered. Same shape here.
