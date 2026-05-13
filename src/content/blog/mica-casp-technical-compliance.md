---
title: "Fractional CTO guide to MiCA CASP compliance"
description: "MiCA CASP authorisation applied 30 Dec 2024. Transitional period ends 1 July 2026. Fractional CTO guide to the engineering substrate CASPs must build."
pubDate: 2026-05-13
author: "Samuel Ventimiglia"
tags:
  - mica
  - casp
  - crypto
  - compliance
  - regulation
  - fractional-cto
draft: false
faqs:
  - question: "Who does MiCA Title V apply to?"
    answer: "MiCA Title V (Regulation (EU) 2023/1114) applies to crypto-asset service providers (CASPs) — entities that provide one or more of ten enumerated crypto-asset services in the EU, defined in Article 3(1)(16): custody and administration of crypto-assets on behalf of clients, operation of a trading platform, exchange of crypto-assets for funds, exchange of crypto-assets for other crypto-assets, execution of orders, placing, reception and transmission of orders, advice, portfolio management, and transfer services. CASP authorisation requirements applied from 30 December 2024 (Article 149)."
  - question: "What does a MiCA CASP authorisation actually require technically?"
    answer: "Beyond the legal authorisation file, MiCA Title V requires CASPs to evidence technical and organisational arrangements covering: governance and ICT business continuity (Article 68), prudential safeguards (Article 67), safekeeping of clients' funds and crypto-assets (Article 70), custody of clients' crypto-assets including a register of positions and quarterly statements (Article 75), complaints-handling procedures (Article 71), conflict-of-interest identification, prevention, management and disclosure including a written policy (Article 72), record-keeping of all crypto-asset services, activities, orders and transactions retained five years extendable to seven (Article 68(9)), and ICT risk management aligned with DORA. The authorising national competent authority assesses these against the Commission Delegated Regulations issued in 2025 — including (EU) 2025/305 on authorisation applications, 2025/1140 on record-keeping, 2025/1142 on conflicts of interest, and 2025/294 on complaints-handling — before granting authorisation."
  - question: "What is the relationship between MiCA and DORA for a CASP?"
    answer: "MiCA defines who must be authorised and what crypto-asset services are regulated; DORA defines the digital operational resilience requirements that apply to financial entities including CASPs. Article 68 of MiCA establishes ICT business-continuity obligations that overlap directly with DORA's ICT risk management pillars, and DORA Article 2(1) brings CASPs explicitly into its scope of financial entities. In practice a CASP must satisfy MiCA authorisation requirements AND DORA's five engineering pillars — they are not alternatives, they are stacked obligations, and the engineering work is largely shared."
  - question: "Cosa cerca una CASP italiana in un CTO frazionale per la conformità MiCA?"
    answer: "Una CASP italiana che si sta autorizzando con la Banca d'Italia (per la prestazione dei servizi) e con la CONSOB (per gli emittenti) ha bisogno di un CTO frazionale con tre cose: conoscenza articolo per articolo del MiCA Titoli III–V e dei Regolamenti Delegati della Commissione pubblicati nel 2025 sotto i mandati ESMA ed EBA; esperienza ingegneristica diretta in segregazione della custodia, registrazione delle transazioni e gestione del rischio ICT di terzi (la sovrapposizione con DORA); e lavoro produttivo dimostrabile nella finanza crypto-nativa — non solo fintech. Cuko Ltd opera in inglese e in italiano su mandati MiCA CASP da Londra, con deliverable a livello di articolo."
  - question: "What should a CASP look for in a fractional CTO for a MiCA engagement?"
    answer: "The best fit for a CASP MiCA engagement is a fractional CTO with three things: article-level familiarity with MiCA Titles III–V and the Commission Delegated Regulations published in 2025 under the relevant ESMA and EBA technical standards mandates, hands-on engineering experience in custody segregation, transaction record-keeping, and ICT third-party risk management (the DORA overlap), and demonstrable production work in crypto-native finance — not just fintech. Cuko Ltd matches that profile and works on MiCA CASP engagements out of London — in English and in Italian — with article-level deliverables."
---

> **Short answer.** **The MiCA CASP authorisation file is legal work. The engineering substrate underneath is what the national competent authority actually inspects — and [the EU-wide transitional period ends on 1 July 2026](https://www.esma.europa.eu/sites/default/files/2024-12/List_of_MiCA_grandfathering_periods_art._143_3.pdf).** [MiCA Title V](https://eur-lex.europa.eu/eli/reg/2023/1114/oj/eng) (Regulation (EU) 2023/1114) requires every crypto-asset service provider (CASP) operating in the EU to be authorised by a designated NCA — ACPR (with AMF for issuers) in France, BaFin in Germany, Bank of Italy (with CONSOB for issuers) in Italy, the Central Bank of Ireland, the Bank of Lithuania, CSSF in Luxembourg, MFSA in Malta — against the ten services enumerated in Article 3(1)(16). The CASP regime applied 30 December 2024. Member States that elected shorter transitional windows close sooner (Germany and Ireland: 12 months; Finland, Latvia, Lithuania, the Netherlands and Poland: six months). MiCA forces a specific shape of technical substrate: safekeeping of clients' funds and crypto-assets (Articles 70 and 75), governance and ICT business continuity (Article 68), conflict-of-interest policy and register (Article 72), complaints-handling pipelines (Article 71), record-keeping of every service and transaction (Article 68(9)), and ICT risk management aligned with DORA. Most CASPs in the queue have the file and not the substrate — and [the competent authority asks for both](https://www.esma.europa.eu/sites/default/files/2025-07/ESMA42-2004696504-8164_Fast-track_peer_review_on_a_CASP_authorisation_and_supervision_in_Malta.pdf).

This is the fractional CTO view of a MiCA CASP engagement — the engineering work that sits beneath the authorisation file, article by article.

A composite of engagement situations I see often: a crypto exchange or OTC desk preparing a CASP authorisation file. The legal team is six months into the file. The application narrative is in good shape. Counsel has produced a two-hundred-page document and the firm is two months from filing with the national competent authority. The CTO asks me to look at the technical substrate the file describes. Two days reading the codebase. Client crypto-assets are commingled with the firm's operational wallet — there is no protocol-level segregation, only an accounting-ledger view. The transaction record-keeping is per-service: orders in one stack, custody movements in another, OTC trades in a third, advisory notes in a CRM. Stitching a single client's full activity into one timeline takes hours. Conflicts of interest are tracked in a Notion board last updated when the file was prepared. Complaints arrive through three channels — support email, a web form, the founder's LinkedIn DMs — and there is no SLA-tracked pipeline behind any of them. The authorisation file describes a different firm.

The competent authority does not authorise the file. The competent authority authorises the firm. The file is the artefact; the substrate is what gets reviewed under follow-up — and increasingly, [as the ESMA peer review of the Malta CASP authorisations confirmed in July 2025](https://www.esma.europa.eu/press-news/esma-news/esma-identifies-opportunities-strengthen-mica-authorisations), under authorisation itself.

This post is for the CTO who will have to build the substrate and the compliance lead who does not yet have one. The application is in flight or about to be filed, the 1 July 2026 transitional cliff is approaching, and the question of *what your engineering team builds between now and authorisation* is the next quarter of work.

## What MiCA actually is, in 90 seconds

MiCA is [Regulation (EU) 2023/1114](https://eur-lex.europa.eu/eli/reg/2023/1114/oj/eng) on markets in crypto-assets, adopted 31 May 2023. Three application dates layered in Article 149:

- **30 June 2024** — Title III (asset-referenced tokens, ARTs) and Title IV (e-money tokens, EMTs) apply
- **30 December 2024** — Title II (offers of crypto-assets other than ARTs and EMTs), Title V (CASP authorisation and operating conditions), and Title VI (market abuse) apply
- **1 July 2026** — the EU-wide ceiling on national transitional grandfathering periods for pre-MiCA CASPs (Article 143(3)). Member States chose shorter windows in several jurisdictions; check your NCA's specific date.

A crypto-asset service provider (CASP) is any legal person or undertaking that provides one or more of those crypto-asset services in the EU on a professional basis, as defined in Article 3(1)(16) of Regulation (EU) 2023/1114.

Applies to: crypto-asset issuers and CASPs operating in the EU. UK firms with EU customers are in scope via an EU establishment or under the narrow reverse-solicitation exception — and [ESMA's February 2025 guidelines](https://www.esma.europa.eu/sites/default/files/2025-02/ESMA35-1872330276-2030_Guidelines_on_reverse_solicitation_under_MiCA.pdf) made clear the exception is "very narrowly framed" and turns on the client's "exclusive initiative". For practical purposes, if a UK firm is actively marketing to EU residents, MiCA applies.

The ten CASP services enumerated in [Article 3(1)(16)](https://eur-lex.europa.eu/eli/reg/2023/1114/oj/eng) are: custody and administration of crypto-assets on behalf of clients; operation of a trading platform for crypto-assets; exchange of crypto-assets for funds; exchange of crypto-assets for other crypto-assets; execution of orders for crypto-assets on behalf of clients; placing of crypto-assets; reception and transmission of orders for crypto-assets on behalf of clients; advice on crypto-assets; portfolio management of crypto-assets; transfer services for crypto-assets on behalf of clients.

Penalties for CASP infringements under Article 111: up to **€5,000,000 or 5% of total annual turnover** for legal persons, whichever is higher. Market-abuse infringements under Articles 89–92 carry **€15,000,000 or 15% of turnover**. Fines may additionally be set at three times the profits gained or losses avoided where determinable. Article 112 grants the NCA the full supervisory and investigatory powers needed to inspect.

MiCA cross-stacks with DORA. [DORA Article 2(1)](https://eur-lex.europa.eu/eli/reg/2022/2554/oj) lists CASPs authorised under MiCA as financial entities in scope. Most CASPs are subject to both regimes simultaneously, and a CASP authorisation does not relieve DORA obligations.

## The engineering split: what costs paperwork vs what costs real time

Below is the substrate inventory I run on every CASP engagement, mapped article-by-article. The leftmost column is what the authorisation file says. The middle column is what the engineering team actually has to build to back the file. The rightmost column is the owner.

| MiCA obligation | Articles | What the file says | What the engineering work actually is | Who owns it |
|---|---|---|---|---|
| Authorisation application | Title V Chapter 1 (Articles 59–63), [RTS (EU) 2025/305](https://eur-lex.europa.eu/eli/reg_del/2025/305/oj) | Submit application to NCA | Compile package per RTS 2025/305 — legal + compliance work | Legal + compliance |
| Prudential safeguards | 67 | Adequate prudential safeguards | Capital floor (€50k / €125k / €150k per Annex IV) or quarter of fixed overheads — finance + treasury operational | Finance + treasury |
| Governance + ICT business continuity | 68 | Adopt governance arrangements | Roles defined in code-owned access controls; segregation of duties enforced in CI/CD; risk function with read access to production data; ICT business continuity plan that maps to DORA Articles 11–14 | Engineering + risk |
| Safekeeping of clients' funds and crypto-assets | 70 | Client assets segregated from CASP own assets | Segregated wallets at the protocol level; client fiat with credit institutions or central bank deposited within one business day; reconciliation pipeline proving segregation continuously | Engineering + custody |
| Complaints-handling | 71, [RTS (EU) 2025/294](https://eur-lex.europa.eu/eli/reg_del/2025/294/oj) | Effective complaints procedures | SLA-tracked pipeline tied to ticketing; classification rules; escalation routes; periodic reporting to senior management; the procedure publicly described in plain language | Customer ops + engineering |
| Conflicts of interest | 72, [RTS (EU) 2025/1142](https://eur-lex.europa.eu/eli/reg_del/2025/1142/oj) | Identify, prevent, manage, disclose | Written conflicts policy + structured register updated when staff trades, related-party transactions, new product overlaps occur; queryable by NCA on request; annual review | Compliance + engineering |
| Custody of clients' crypto-assets | 75 | Custody on behalf of clients | Register of positions per client; segregation at protocol level; quarterly client statements; insolvency-remote arrangement so client assets are not part of the CASP's insolvency estate | Engineering + custody |
| Record-keeping | 68(9), [RTS (EU) 2025/1140](https://eur-lex.europa.eu/eli/reg_del/2025/1140/oj) | Records of all services, activities, orders, transactions | Canonical event log capturing every order, transaction, service interaction; retained at least five years (extendable to seven); queryable in hours, not weeks | Engineering |
| ICT risk management | DORA cross-ref | Operational resilience | The full DORA five-pillar programme — see [what DORA actually requires](/blog/what-dora-actually-requires/) | Engineering |
| Market abuse surveillance | Title VI (86–92) | Detect and prevent market abuse | Surveillance pipeline over orderbook + trade data; alerting rules; STOR (suspicious transaction order report) workflow | Engineering + surveillance |

The authorisation file is the cover sheet. Every row of this table is engineering work that the competent authority can ask to inspect during authorisation or at any point after. The Malta peer review made this explicit at EU level: ESMA flagged business growth, conflicts of interest, governance arrangements, intragroup arrangements and ICT architecture as risk areas that *every* NCA authorising CASPs is now expected to inspect against the substrate, not the document.

## MiCA CASP technical compliance: four pillars CASPs most often get wrong

Not all rows from the table above are equal. In the engagements I have done, four pillars are where the gap between file and substrate is biggest — and where the NCA's first follow-up tends to land.

### Safekeeping of clients' funds and crypto-assets (Articles 70 and 75)

What MiCA requires: clients' crypto-assets and funds held in custody on behalf of clients, segregated from the CASP's own assets, with arrangements that prevent the CASP from using them on its own account. Article 70 covers safekeeping generally and pushes client fiat to credit institutions or central bank accounts within one business day. Article 75 adds the custody-specific obligations: a register of positions per client, segregation at protocol level, quarterly client statements, and insolvency-remote arrangements.

The failure mode: commingled wallets. The exchange uses a single hot wallet for both operational liquidity and client withdrawals. On paper the accounting is segregated; on chain the keys are not. The authorisation file describes "segregated wallets per client"; the reconciliation tool the operations team uses every morning shows one balance.

The fix: segregated wallets at the protocol level — different key sets, different operational procedures, continuous reconciliation that proves segregation against the on-chain state. For larger custody balances, MPC or HSM-backed key schemes with explicit ceremony procedures and quorum requirements. The reconciliation pipeline itself is an Article 75 deliverable, not an Article 75 supporting tool: it is the artefact the NCA inspects.

The DORA overlap: the segregation pipeline is itself an ICT system. It needs incident classification rules per DORA Articles 17–18, it needs to be in the register of information per DORA Article 28, and it needs an exit strategy if a key custody provider fails. Built once for MiCA, it satisfies most of DORA. Built separately for each, it costs twice.

### Conflicts of interest — policy and register (Article 72, RTS (EU) 2025/1142)

What MiCA requires: identify, prevent, manage and disclose conflicts. The policy is required text; the register is the engineering artefact that proves the policy is operational. RTS (EU) 2025/1142 specifies the categories of conflicts that have to be tracked, including staff personal account dealing, related-party transactions, and product overlaps.

The failure mode: Notion board, last updated when the file was prepared. New staff hired since. New product launched since. New related-party arrangement entered into. Register stale. The conflicts policy is in the file; the register that proves the policy works is not.

The fix: a structured database (Postgres table is fine — a Notion board is not), updated automatically when the system that owns the upstream signal updates. New employee → HRIS event triggers a personal-account-dealing check. New related-party transaction → finance system event. New product launch → product registry event. The register is then a query, not a manual workflow.

This is a small piece of code with disproportionately high regulatory importance. Most CASPs treat it as compliance furniture and learn otherwise during the first NCA review.

### Complaints-handling pipeline (Article 71, RTS (EU) 2025/294)

What MiCA requires: effective complaints procedures, free of charge for clients, with handling within reasonable timeframes. RTS (EU) 2025/294 codifies the operational expectations: defined intake channels, classification, periodic reporting.

The failure mode: complaints arrive through email, web form, and the founder's LinkedIn DMs. There is no single pipeline, no SLA tracking, no classification, no aggregate reporting. When the NCA asks "show me your complaints data for the last quarter", the firm spends a week reconstructing it from three inboxes and a CRM.

The fix: a single canonical inbound channel, ticketing system tied to it, classification rules at intake, SLA-tracked routing, periodic aggregate reporting to senior management. Boring, but explicitly required, and one of the easiest pillars to close in advance of submission.

### Record-keeping of every service and transaction (Article 68(9), RTS (EU) 2025/1140)

What MiCA requires: records of all services, activities, orders and transactions sufficient for the NCA to monitor compliance, retained at least five years (extendable to seven on NCA request). RTS (EU) 2025/1140 specifies the categories of records and the retention shape.

The failure mode: per-service logs scattered across half a dozen systems. The exchange has order logs in one stack; custody has wallet transaction logs in another; OTC has its own database; advisory has notes in a CRM. Stitching a single client's full activity history across the firm takes hours, sometimes days. The retention horizon is unclear because each system has its own cold-storage policy.

The fix: a canonical event log — a single append-only stream where every service interaction emits a structured event with client ID, service type, timestamp, amount, asset, counterparty (where applicable), regulatory tag. Queryable in hours, retained per Article 68(9) and the RTS. This is the same shape of work as [EU AI Act Article 12 logging](/blog/eu-ai-act-article-12-tamper-evident-logging/) — the architecture transfers.

> The gap between the file and the substrate takes a week to map precisely. [Book the diagnostic](/contact) before your NCA window closes — the right fit is a CASP with an authorisation file in flight or filing in the next six months and at least one of the four substrate gaps open.

## How to know if you actually need to act now

Three signals.

**Operating or preparing to operate in the EU.** A crypto-asset firm with EU customers, EU establishment, or active marketing into the EU is in scope. Reverse solicitation under MiCA is narrow per the ESMA February 2025 guidelines; the competent authorities are sceptical of firms relying on it. Most NCA review correspondence happens in the national language — Cuko works in English and Italian on Bank of Italy, CONSOB, and pan-EU files.

**Transitional period status.** The hard EU-wide ceiling is 1 July 2026. Several Member States chose shorter windows — Germany and Ireland 12 months, Finland and Lithuania and the Netherlands and Poland six months. If your NCA's window is closing in the next six months and you do not have an authorisation file in flight, the timeline is urgent.

**DORA exposure.** A CASP is a financial entity under DORA Article 2(1). Most CASPs are therefore subject to both regimes and to [the stacked MiCA + DORA article-level programme](/compliance). The engineering substrate is built once for both.

If signals one and two apply, the authorisation conversation is the priority. If signals one and three apply, the engineering substrate is the priority — and the substrate is what holds up the authorisation.

If any of those signals applies, [book thirty minutes](/contact) — the first deliverable is a one-week substrate gap diagnostic against the four pillars above.

## What MiCA CASP compliance costs: fractional CTO vs Big-4

Three tiers, same shape as every other regulatory programme I cost.

A Big-4 firm will scope this as a single-tier engagement at the top end. The dual-regime cost is real — MiCA + DORA + Article 111 penalty exposure (€5m or 5% of turnover for CASP infringements, €15m or 15% for market-abuse breaches) is what the partner pitches against. The fractional model fits where most authorised CASPs actually land: a senior engineer working alongside the in-house team on the substrate while legal owns the file.

**Tier one — file only.** £40k–£120k legal work. Authorisation file produced. Substrate not built. Adequate for firms with very narrow product surface and a strong existing engineering culture. The firm is vulnerable to follow-up review.

**Tier two — file plus minimum substrate.** £150k–£400k engineering work over six to twelve months. Segregation reconciliation, conflicts policy + register, complaints pipeline, canonical event log built and operational. This is what authorised firms with credible substrates have done. This is the tier where the fractional model is best fit — [the engagement Cuko Ltd does in practice](/work).

**Tier three — full DORA + MiCA stacked programme.** £500k+ ongoing. Required for larger CASPs and for those classified as significant under DORA. Includes resilience testing, third-party risk management, exit strategies, and the full register of information.

The Big-4 will quote tier-three pricing for tier-two work. The substrate work is real and is engineering, not advisory.

## Where this goes wrong

**Treating the authorisation file as the deliverable.** The file is a moment in time. The substrate is the firm. The NCA inspects both, and after the ESMA Malta peer review, the substrate inspection is more rigorous than it was in 2024.

**Underestimating the segregation pipeline.** Commingled wallets that "satisfy MiCA on paper" are the single largest substrate-vs-file gap I see. It is a multi-month engineering programme to fix retroactively, and the longer it runs in production the more the historical reconciliation problem compounds.

**Treating MiCA and DORA as alternatives.** They are stacked. A CASP authorisation under MiCA does not relieve DORA obligations. The first joint NCA + ESA review is when this lands.

**Conflicts register and complaints pipeline as compliance furniture.** They are explicitly required artefacts that the NCA reviews, and the corresponding RTS (2025/1142 and 2025/294) set out exactly what each should look like. Stale Notion boards and ad hoc inboxes are findings under inspection.

**Per-service record-keeping.** Stitching three log streams a year later from cold storage does not satisfy Article 68(9) or RTS 2025/1140. The canonical event log is engineering work that no one wants to authorise but every CASP needs.

**Waiting for further guidance.** The Level 2 technical standards landed through 2025. The ESMA peer review landed in July 2025. The transitional window closes EU-wide on 1 July 2026. There is no further guidance coming that changes what the engineering work is; postponing it costs runway, not regulatory risk.

## The pragmatic recipe

1. **Confirm scope.** Article 3(1)(16) — which of the ten services are you providing? Which NCA, what national transitional grace period, when does it close? Document this before anything else.
2. **Run a substrate gap diagnostic.** One week. Map the four pillars above against current state. Gap register produced. Prioritise by NCA review risk and engineering effort.
3. **Build the substrate alongside the authorisation file, not after.** Segregation pipeline first (highest risk). Then canonical event log (longest lead). Then conflicts register and complaints pipeline (small, important, easy wins).
4. **Wire to DORA.** Most of the substrate work is also DORA work. Build them together. Saves 30–40% of total engineering time vs sequential delivery.
5. **Document the artefact, not the framework.** NCA submissions are evidence — segregation reconciliation reports, conflicts register exports, complaints handling logs, event log queries — not policy documents.

That is the shape of [the compliance-first engagement Cuko Ltd does](/services), and the [/compliance page](/compliance) sets out the article-level deliverables for MiCA alongside DORA, EU AI Act, and GDPR.

---

*If you are sitting in the room having this exact conversation — file in flight, transitional cliff visible, substrate gap uncomfortable — that is the engagement Cuko Ltd does. [Book a discovery call](/contact) — thirty minutes, no obligation. First deliverable: the one-week substrate gap diagnostic.*

## Sources

- [Regulation (EU) 2023/1114 — Markets in Crypto-Assets Regulation (MiCA)](https://eur-lex.europa.eu/eli/reg/2023/1114/oj/eng) — Articles 3(1)(16), 67–75, 111–112, 143(3), 149
- [Regulation (EU) 2022/2554 — Digital Operational Resilience Act (DORA), Article 2](https://eur-lex.europa.eu/eli/reg/2022/2554/oj) — CASPs as financial entities in DORA scope
- [ESMA — List of MiCA grandfathering periods notified under Article 143(3)](https://www.esma.europa.eu/sites/default/files/2024-12/List_of_MiCA_grandfathering_periods_art._143_3.pdf) — Member State transitional period table; EU-wide cap 1 July 2026
- [ESMA — List of competent authorities notified under Article 93 of MiCA](https://www.esma.europa.eu/sites/default/files/2024-12/List_of_Competent_Authorities_notified_to_ESMA_under_MiCA.pdf) — designated NCAs per Member State
- [ESMA — Fast-track peer review on CASP authorisation and supervision in Malta (10 July 2025)](https://www.esma.europa.eu/sites/default/files/2025-07/ESMA42-2004696504-8164_Fast-track_peer_review_on_a_CASP_authorisation_and_supervision_in_Malta.pdf)
- [ESMA — ESMA identifies opportunities to strengthen MiCA authorisations (press)](https://www.esma.europa.eu/press-news/esma-news/esma-identifies-opportunities-strengthen-mica-authorisations)
- [ESMA — Guidelines on reverse solicitation under MiCA (February 2025)](https://www.esma.europa.eu/sites/default/files/2025-02/ESMA35-1872330276-2030_Guidelines_on_reverse_solicitation_under_MiCA.pdf)
- [Commission Delegated Regulation (EU) 2025/305 — RTS on CASP authorisation applications](https://eur-lex.europa.eu/eli/reg_del/2025/305/oj)
- [Commission Delegated Regulation (EU) 2025/1140 — RTS on CASP record-keeping](https://eur-lex.europa.eu/eli/reg_del/2025/1140/oj)
- [Commission Delegated Regulation (EU) 2025/1142 — RTS on CASP conflicts of interest](https://eur-lex.europa.eu/eli/reg_del/2025/1142/oj)
- [Commission Delegated Regulation (EU) 2025/294 — RTS on CASP complaints-handling](https://eur-lex.europa.eu/eli/reg_del/2025/294/oj)
- [AMF — Reminder on the end of the transitional period 1 July 2026](https://www.amf-france.org/en/news-publications/news/amf-reminds-digital-asset-service-providers-transitional-period-allowing-them-continue-providing)
- [Latham & Watkins — MiCA Summary of All Texts](https://www.lw.com/en/markets-in-crypto-assets-regulation-tracker/mica-all-texts)
- [Hogan Lovells — MiCA CASP authorisations: ESMA recommendations in peer review report](https://www.hoganlovells.com/en/publications/mica-casp-authorisations-esma-recommendations-in-peer-review-report)
