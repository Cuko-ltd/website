---
title: "DORA compliance without a full-time CTO: what it actually requires"
description: "DORA applied January 2025. The regulation reads like documentation work and lands like systems work. Here is what your engineers actually have to build — and what it costs."
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
faqs:
  - question: "Which entities does DORA apply to?"
    answer: "DORA (Regulation (EU) 2022/2554) applies to financial entities including banks, investment firms, payment institutions, e-money institutions, crypto-asset service providers under MiCA, and insurers, as well as to their critical ICT third-party providers. Enforcement has been live since 17 January 2025."
  - question: "What are the five engineering pillars of DORA compliance?"
    answer: "The five mandatory DORA engineering pillars are: (1) ICT risk-management framework wired to the production stack (Articles 6–16); (2) incident classification rules that fire automatically (Articles 17–18); (3) a queryable register of information for every ICT third-party (Article 28); (4) digital operational resilience testing including TLPT for significant entities (Articles 24–26); and (5) tested third-party exit strategies (Article 28(8))."
  - question: "How do I make my fintech DORA compliant without a full-time CTO?"
    answer: "Start with a one-week diagnostic mapping your current state against the five engineering pillars and producing a prioritised gap register. Then engage a fractional CTO with compliance engineering experience to ship the framework as code over three to six months — inventory, classification rules in your alerting stack, register of information as a queryable database, exit runbooks tested in staging, and a resilience testing programme calendar. The fractional model fits the £40k–£150k tier-two engineering work; Big-4 firms quote tier-three prices for tier-two scope."
  - question: "What is the difference between TIBER-EU TLPT and a normal penetration test?"
    answer: "TIBER-EU is a specific threat-led penetration testing methodology overseen by the European Central Bank, with regulator involvement in scoping and execution. It is the testing standard required under DORA Articles 24–26 for entities classified as significant. A standard pentest does not satisfy these articles — it lacks the threat intelligence, regulator engagement, and remediation tracking that the TIBER-EU framework requires."
---

> **Short answer.** DORA ([Regulation (EU) 2022/2554](https://eur-lex.europa.eu/eli/reg/2022/2554/oj)) applied 17 January 2025 and binds in-scope financial entities to five engineering obligations that cost real time and budget: (1) an ICT risk-management framework wired to the actual production stack, not a Word document; (2) incident classification rules that emit the right notification when crossed; (3) a register of information for every ICT third-party that is queryable in days, not weeks; (4) digital operational resilience testing on a defined cadence, including threat-led penetration testing for significant entities; and (5) third-party exit strategies that have been tested. Everything else is paperwork around those five. A fractional CTO with compliance engineering experience — rather than a Big-4 framework consultant — is the cost-proportionate way to close that gap for firms that are not yet large enough to need a full-time appointment. If your team has not built the engineering substrate for these, you are not DORA compliant — you have a DORA document.

A composite of engagement situations I see often: a CASP sends over a DORA framework for review. Forty-seven page Word document, signed off by the legal team, formally adopted by the board. None of it is wired to the observability stack. Incident classification is a section heading, not a rule that fires. The third-party register is a spreadsheet last updated four months ago. Threat-led penetration testing is on the roadmap.

They think they are compliant because they have the document. The regulator does not read documents. The regulator reads incidents and registers and test results.

This post is for the founder, CTO, or compliance lead who has read the DORA summary, signed the framework, and is about to discover that the regulation was the easy part.

## What DORA actually is, in 90 seconds

The Digital Operational Resilience Act is [Regulation (EU) 2022/2554](https://eur-lex.europa.eu/eli/reg/2022/2554/oj), and it applies to financial entities — banks, investment firms, payment institutions, e-money institutions, crypto-asset service providers under MiCA, insurers — and to their critical ICT third-party providers. It [applied from 17 January 2025](https://chambers.com/articles/countdown-to-dora-the-regulation-applies-from-17-january-2025), so enforcement is live, not theoretical. On [18 November 2025 the European Supervisory Authorities designated the first 19 critical ICT third-party providers](https://www.eba.europa.eu/publications-and-media/press-releases/european-supervisory-authorities-designate-critical-ict-third-party-providers-under-digital), bringing those firms under direct ESA oversight. The deadline window for the first round of registers of information closed on [30 April 2025](https://www.cssf.lu/en/2025/04/dora-submission-timeframe-for-register-of-information-edesk-portal-open-as-of-1-april-2025/).

The regulation has five engineering pillars. ICT risk management sits in Articles 6–16. ICT-related incident management sits in Articles 17–23. Digital operational resilience testing sits in Articles 24–26. Management of ICT third-party risk sits in Articles 28–30. Information sharing arrangements (Articles 45–49) are voluntary and you can ignore them for the engineering work. Penalties are administrative and live: financial entities can be fined [up to 2% of total annual worldwide turnover](https://vendorica.com/dora/penalties/) for material non-compliance; ICT third-party providers face their own penalty schedule.

The first four pillars are mandatory. The first four are engineering work.

## The split: what costs paperwork, what costs real time

Most teams that cost DORA by reading the legal summary underestimate by an order of magnitude, because the regulation reads like documentation work and lands like systems work.

| DORA obligation | Articles | What the document says | What the engineering work actually is | Who owns it |
|---|---|---|---|---|
| ICT risk management framework | 6–16 | Adopt and maintain a framework | Inventory every system and data flow; map controls to actual repos and infra; emit the framework as code, not as PDF | Engineering + risk |
| Incident classification | 17–18 | Classify incidents by severity | Define rules in your alerting stack that fire when criteria cross; alert routes to the right people; playbooks rehearsed | SRE / on-call |
| Major-incident notification | 19–20 | Notify within prescribed windows | Notification template ready, decision tree for "major", communications path to regulator pre-approved | CISO + legal |
| ICT register of information | 28 | Maintain a register of ICT contracts | Queryable database of every third-party ICT relationship, contract terms, criticality classification, exit risk | Procurement + engineering |
| Resilience testing | 24–26 | Test ICT resilience on a defined basis | Tabletop exercises, scenario-based tests, threat-led penetration test (TLPT) for significant entities | Security + engineering |
| Third-party exit strategy | 28(8) | Document and test exit strategies | Migration runbook for every critical ICT provider; tested in staging at least once; data egress paths verified | Engineering |

The paperwork rows take a week each. The engineering rows take a quarter each. That is the gap.

## The five DORA compliance engineering pillars in detail

### 1. The ICT risk-management framework, as code

Articles 6–16 require identification, protection, detection, response, and recovery — the same shape as NIST CSF, mapped onto every system you run. The version that satisfies an auditor is not a PDF. It is an inventory of systems and data flows, with criticality classification, where the ICT risk register lives next to the source code, not in SharePoint, and where controls map to specific repositories.

The failure mode is consistent: the framework references "the trading system," but no engineer can name which repository, which deployment, or which runtime that means. The mapping has not been done. When an auditor asks "show me the controls for the trading system," what comes back is the framework document, not the running config.

The fix is unglamorous. Terraform-tagged resources for criticality and data classification. A lightweight `compliance/` directory in each repository with the controls that apply. CI fails if a critical-tier service ships without the required tags. The framework becomes a query against the live infrastructure, not a separate artefact maintained by hand.

### 2. Incident classification that actually fires

Articles 17 and 18 require every operational anomaly to be classified by impact — clients affected, financial value, data breach, reputational consequence — reported to senior management, and notified to the competent authority within prescribed windows when classified as major. The classification rules sit at the heart of this and they are most often broken.

Most teams have the framework definition of "major incident" written down and the rule definition missing from the alerting stack. By the time an engineer realises the threshold was crossed, the notification clock is half-spent. I have handled three production data breaches end-to-end including regulator notification under GDPR Article 33's 72-hour clock. The teams that have not rehearsed lose a day arguing about classification.

The fix is to put the classification rules in PagerDuty or Opsgenie or whatever your alerting stack is. When a rule fires, the on-call engineer sees the classification immediately, not after a triage meeting. The notification template is pre-approved. The decision tree is one page, not seventeen.

### 3. The register of information, queryable in hours

Article 28 requires a register of every contractual arrangement with ICT third-party providers, with criticality classification, location of data processing, and exit terms. The first submission window for this register [closed on 30 April 2025](https://www.cssf.lu/en/2025/04/dora-submission-timeframe-for-register-of-information-edesk-portal-open-as-of-1-april-2025/), and competent authorities forwarded the registers to the ESAs as the input data for designating critical ICT third-party providers. If your firm missed that submission window, you are already in a remediation conversation, not a planning conversation.

The failure mode here is the spreadsheet. The spreadsheet was last updated for the audit nine months ago. The team has signed three new SaaS contracts since then. The regulator asks for the register and the firm spends two weeks reconstructing it.

The fix is a structured database — not a spreadsheet — that procurement updates when contracts change, where engineering tags every dependency with its provider in code, and where the query "every critical ICT provider where data is processed outside the EEA" returns in seconds, not days.

### 4. Resilience testing on a defined cadence

Articles 24–26 require scenario-based testing of ICT resilience for all in-scope entities and threat-led penetration testing under the [TIBER-EU framework](https://www.ecb.europa.eu/paym/cyber-resilience/tiber-eu/) for significant entities. TLPT is not a normal pentest. It is a specific methodology with regulator involvement, and the procurement, scoping, and execution take months.

The failure mode I see most often is the TLPT contracted to a third party who treats it as a checklist exercise; no remediation plan; findings sit in JIRA for nine months. The regulator's interest is not in the report — it is in whether the findings closed.

The fix is a testing programme calendar with scenarios documented and approved by the board, evidence of execution and remediation. Game-day exercises that exercise the full incident-classification → notification → recovery loop, not just the technical recovery.

### 5. Third-party exit strategies that have been tested

Article 28(8) [requires](https://streamlex.eu/articles/dora-en-art-28/) that for every critical ICT provider you have a documented exit strategy, that the strategy is tested, and that you have alternative solutions identified and transition plans able to remove the contracted services and data and securely move them to alternative providers or back in-house. "Tested" means you have actually migrated some workload — not that you have written a runbook.

The failure mode is the cloud-provider exit strategy that reads "migrate to alternative cloud provider X" but no one has tried. The actual data export takes 14 days at the vendor's egress rate. The alternative has no Kubernetes operator parity. The runbook does not survive contact with a real migration.

The fix is, for each critical provider, a migration runbook, an alternative provider identified, the data egress mechanism verified, the cost of exit modelled, and the runbook tested in staging at least once.

## How to know if you actually need to act now

Most teams asking about DORA either have time or do not. The deciding signals are three.

**Signal one — in-scope entity status.** Are you a financial entity under DORA Article 2, or a critical ICT third-party provider designated by the ESAs? CASPs under MiCA are in scope. E-money institutions are in scope. Many UK firms with EU operations are in scope via their EU subsidiaries. If yes, you are in.

**Signal two — open enforcement window.** Have you received any communication from your competent authority — the FCA in the UK for regulated UK firms, BaFin in Germany, AMF in France, CONSOB in Italy — referencing DORA readiness? If yes, the clock is short.

**Signal three — a real incident or third-party exposure.** Has a critical ICT provider had a public outage, breach, or change of control in the past twelve months? Article 28 requires you to assess and document. If you have not, you are accumulating regulatory risk every month.

If none of the three apply, you have time. Build the framework as code over the next six months. Do not buy a £200k Big-4 engagement.

If any of the three apply, the diagnostic is the right next step. One week, mapped against the regulation, gap register produced.

## DORA compliance cost tiers (the section CFOs read)

Like every regulatory engineering programme, DORA cost has discontinuous tiers, not a smooth curve.

**Tier one — document and adopt.** £5k to £20k. A consultant writes the framework. You sign it. You have a compliant document and a non-compliant system. This is what most firms have done.

**Tier two — wire the framework into engineering.** £40k to £150k over three to six months. Inventory, classification rules, register, exit runbooks built and tested. This is what compliant firms have done.

**Tier three — significant entity full programme.** £200k+ per year ongoing including TLPT. Required if classified as significant.

The Big-4 will quote tier-three prices for tier-two work. The fractional model fits tier two exactly: a senior engineer who knows the regulation, ships the implementation, and trains the in-house team to maintain it.

The same regime-cost shape shows up in every cross-wall engineering decision — I wrote about [the latency-regime version of this argument here](/blog/when-you-actually-need-nanoseconds/). Pricing the next tier as if it were the current tier with a multiplier is the most expensive mistake I see in this work.

## Where this goes wrong

**The framework document trap.** Spending £15k on a beautifully written framework and zero on the engineering substrate. The regulator does not read documents — only artefacts. Incident logs, register exports, test results, exit-strategy test logs.

**Treating DORA as a one-off project.** DORA is continuous. Once you are in scope, every architectural change either preserves compliance or breaks it. Code review, deployment, monitoring, and hiring all change to match. The team that ships a new critical service without classification, alerting wiring, and register entry has just put the firm back into remediation.

**Outsourcing to a Big-4 and assuming it is handled.** Big-4 produces the framework. Big-4 does not ship the code. The implementation gap is yours to close, and the gap is where every audit finding lands.

**Ignoring the third-party exit strategy.** Exit strategies that have not been tested are not exit strategies. The Article 28(8) requirement is not satisfied by a Word document.

**Confusing TIBER-EU TLPT with a normal pentest.** A standard pentest does not satisfy Articles 24–26 for significant entities. The framework is specific.

## The pragmatic recipe

Confirm scope first. Are you a financial entity under Article 2? A CASP? A critical ICT third-party provider? Document the answer with the article reference. This is a fifteen-minute exercise that prevents months of misdirected work.

Run a gap diagnostic. One week. Each of the five pillars assessed against current state. Gap register produced. Prioritised by regulatory severity and engineering effort. The output is the plan.

Wire the framework into code. Engineering work, three to six months. Inventory, classification rules in alerting stack, register of information as a queryable database, exit runbooks tested in staging, resilience testing programme calendar.

Train the team to maintain it. Compliance is now part of the deployment loop. CI gates, code review checklists, quarterly resilience exercises. The fractional engagement ends when the in-house team can run the loop without you.

Document the artefacts, not the framework. Regulator submissions are evidence — incident reports filed, register exports, test results, exit-strategy test logs — not policy documents.

This is exactly the shape of the [compliance-first system design engagement Cuko Ltd does](/services), and it is the substantive heart of the [/compliance page](/compliance) where the article-level deliverables are listed in detail.

---

*If you are a financial entity, a CASP, or a critical ICT provider and the gap between your DORA framework and the engineering substrate has just become uncomfortable, that is the engagement Cuko Ltd does. [Book a discovery call](/contact) — thirty minutes, no obligation. The first deliverable is a one-week gap diagnostic against the five pillars.*

## Sources

- [Regulation (EU) 2022/2554 — Digital Operational Resilience Act (DORA)](https://eur-lex.europa.eu/eli/reg/2022/2554/oj) — full regulation text, article numbers, in-scope entities
- [Chambers and Partners — Countdown to DORA: applies from 17 January 2025](https://chambers.com/articles/countdown-to-dora-the-regulation-applies-from-17-january-2025) — application date
- [Vendorica — DORA Penalties and Enforcement](https://vendorica.com/dora/penalties/) — administrative fines up to 2% of total annual worldwide turnover; enforcement live since 17 January 2025
- [European Banking Authority — ESAs designate critical ICT third-party providers under DORA, 18 November 2025](https://www.eba.europa.eu/publications-and-media/press-releases/european-supervisory-authorities-designate-critical-ict-third-party-providers-under-digital) — first 19 CTPPs designated
- [CSSF Luxembourg — DORA submission timeframe for register of information, eDesk Portal open as of 1 April 2025](https://www.cssf.lu/en/2025/04/dora-submission-timeframe-for-register-of-information-edesk-portal-open-as-of-1-april-2025/) — register submission window
- [DORA Article 28 — Streamlex annotated text](https://streamlex.eu/articles/dora-en-art-28/) — Article 28(8) exit strategy requirements verbatim
- [European Central Bank — TIBER-EU framework](https://www.ecb.europa.eu/paym/cyber-resilience/tiber-eu/) — threat-led penetration testing methodology referenced in DORA Articles 24–26
- [DORA reference site — article ranges by topic](https://www.digital-operational-resilience-act.com/) — confirmation of article ranges for each engineering pillar
