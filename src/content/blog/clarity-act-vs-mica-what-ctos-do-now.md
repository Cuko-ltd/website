---
title: "CLARITY Act vs MiCA: what CTOs do now"
description: "Senate Banking marks up CLARITY on 14 May 2026. If your firm is MiCA-authorised, ~80% of your engineering work already transfers to CLARITY-readiness. The mapping."
pubDate: 2026-05-13
author: "Samuel Ventimiglia"
tags:
  - clarity-act
  - mica
  - crypto
  - regulation
  - sec
  - cftc
  - fractional-cto
draft: false
newsArticle: true
legislation:
  - name: "Digital Asset Market Clarity Act of 2025"
    identifier: "H.R. 3633"
  - name: "Markets in Crypto-Assets Regulation"
    identifier: "Regulation (EU) 2023/1114"
faqs:
  - question: "What are the differences between the CLARITY Act and MiCA?"
    answer: "The CLARITY Act (H.R. 3633, Digital Asset Market Clarity Act of 2025) splits jurisdiction over digital assets between the SEC (securities) and the CFTC (digital commodities) using a four-part 'mature blockchain system' test — open-source code, transparent rules, no single controlling party, and no person or group holding 20% or more of tokens. MiCA (Regulation (EU) 2023/1114) classifies crypto-assets functionally into three categories — asset-referenced tokens (ART, Article 3(1)(6)), e-money tokens (EMT, Article 3(1)(7)), and other crypto-assets (Title II) — and regulates issuance plus service provision under one regime supervised by national competent authorities with ESMA and EBA technical standards. CLARITY is jurisdictional; MiCA is functional. CLARITY is mid-legislative process (Senate Banking Committee marks up H.R. 3633 on 14 May 2026); MiCA's CASP regime has applied since 30 December 2024."
  - question: "How should a crypto CTO prepare for the CLARITY Act?"
    answer: "Here is what I brief into the quarterly planning meeting at a firm at this stage. Build a dual classification map for every token the firm touches — one column for MiCA category (ART, EMT, other), one column for anticipated CLARITY status (security or digital commodity, with the mature-blockchain four-part test applied). Audit existing MiCA Article 70/75 custody segregation for CLARITY-readiness; the segregated wallet architecture transfers directly. Wire market-abuse surveillance to dual-output for both MiCA Title VI and the SEC/CFTC parallel anti-manipulation authorities. Build the canonical event log once — same shape as the MiCA Article 68 record and the DORA Article 28 register of information. Approximately 80% of the engineering work a MiCA-authorised CASP has already done transfers to CLARITY-readiness."
  - question: "What is a 'mature blockchain system' under the CLARITY Act?"
    answer: "Under the version of the Digital Asset Market Clarity Act that passed the House on 17 July 2025, a 'mature blockchain system' is one that is (1) functional for executing transactions, accessing services, or participating in transaction validation or decentralised governance; (2) composed of open-source code; (3) operates under pre-established, transparent rules; and (4) is not subject to the control of any single person or group, including by holding 20% or more of the tokens or voting rights. A digital asset intrinsically linked to a mature blockchain system is treated as a 'digital commodity' under CFTC jurisdiction rather than an investment contract under SEC jurisdiction. The Senate Banking Committee marks up the bill on 14 May 2026; the test may be amended during markup."
  - question: "Is the CLARITY Act law yet?"
    answer: "No. The CLARITY Act (H.R. 3633) passed the U.S. House of Representatives on 17 July 2025 by 294–134 (Roll Call 199). The Senate Banking, Housing, and Urban Affairs Committee marks up the bill in executive session on Thursday 14 May 2026 at 10:30 AM ET in Dirksen 538. The Senate Agriculture, Nutrition, and Forestry Committee advanced its own parallel bill, S.3755 (Digital Commodity Intermediaries Act), on 29 January 2026 by 12–11. A full Senate floor vote, reconciliation with the Senate companion language, a conference with the House, and presidential signature are still required before the CLARITY framework becomes law. The earliest realistic enactment is the second half of 2026."
---

> **Short answer.** **The [CLARITY Act (H.R. 3633)](https://www.congress.gov/bill/119th-congress/house-bill/3633) is jurisdictional — it splits digital assets between the SEC and the CFTC using a four-part "mature blockchain system" test. [MiCA (Regulation (EU) 2023/1114)](https://eur-lex.europa.eu/eli/reg/2023/1114/oj) is functional — it classifies crypto-assets by what they do (ART, EMT, or other) under a single EU regime. CLARITY is mid-legislative process; MiCA's CASP regime has been in force since 30 December 2024.** If you are MiCA-authorised or in flight, approximately 80% of the engineering work already transfers to CLARITY-readiness. The question is not whether to rebuild. The question is what the 20% is. The U.S. Senate Banking, Housing, and Urban Affairs Committee marks up H.R. 3633 in executive session on Thursday 14 May 2026 at 10:30 AM ET, in Dirksen 538 — [the first Senate Banking action on crypto market structure](https://www.banking.senate.gov/hearings/05/08/2026/executive-session) since the chairman's draft on 12 January 2026. This post is for the CTO who has to decide what their team does this quarter — and what they do not do.

A composite of engagement situations I see often: a crypto-native firm incorporated in Delaware, with EU customers served through a Lithuanian subsidiary, mid-way through a [MiCA CASP authorisation programme](/compliance) with the Bank of Lithuania. Custody is on segregated wallets with an MPC quorum scheme. The market-abuse surveillance pipeline ingests order-book data into a Kafka topic and runs a STOR (suspicious transaction order report) detector against it. There is a canonical event log behind it all that captures every order, transaction, deposit, withdrawal, and service interaction with a client identifier and a service-type tag. The legal team is on top of MiCA. They are now looking at the U.S. CLARITY framework moving through Congress and the question they bring is: do we rebuild?

The answer is no. You map. In the kind of engagement above, the mapping takes a quarter, the substrate audit takes another four to six weeks, and not a single custody pipeline gets rebuilt.

This post is for the CTO, founder, or head of engineering at a crypto firm with U.S. and EU exposure trying to plan the next two quarters with one eye on Brussels and one eye on Capitol Hill. The Senate Banking markup on 14 May is the most concrete legislative signal in months — the bill text is public, the four-part test is stable, and the question of *what your engineering team does between now and Senate floor* is no longer hypothetical.

## What changed this week

On 8 May 2026, [the Senate Banking Committee published the executive session notice](https://www.banking.senate.gov/hearings/05/08/2026/executive-session) for 14 May at 10:30 AM ET, Dirksen 538, to consider H.R. 3633. On 11–12 May, [Chairman Tim Scott and Senators Lummis and Tillis released the 309-page substitute](https://www.banking.senate.gov/newsroom/majority/chairman-scott-senators-lummis-tillis-release-market-structure-bill-text-ahead-of-banking-committee-markup) that the committee will mark up. The vehicle is the House-passed bill — H.R. 3633 itself — not a separately introduced Senate companion.

The House passed H.R. 3633 on [17 July 2025 by 294–134, Roll Call 199](https://clerk.house.gov/Votes/2025199). Seventy-eight Democrats joined every voting Republican. The Senate Agriculture, Nutrition, and Forestry Committee separately [advanced S.3755, the Digital Commodity Intermediaries Act, on 29 January 2026 by 12–11](https://www.agriculture.senate.gov/newsroom/rep/press/release/boozman-leads-ag-committee-in-advancing-crypto-market-structure-legislation), a party-line vote. The two committees have jurisdiction over different regulators — Banking over the SEC, Agriculture over the CFTC — and the framework requires both to land before a Senate floor vote.

The backdrop matters. The [GENIUS Act, a federal stablecoin framework, was signed into law on 18 July 2025](https://www.whitehouse.gov/fact-sheets/2025/07/fact-sheet-president-donald-j-trump-signs-genius-act-into-law/). On 17 March 2026, [the SEC and CFTC issued a joint interpretation (SEC Release 33-11412)](https://www.sec.gov/files/rules/interp/2026/33-11412.pdf) laying out a five-category crypto-asset taxonomy. CLARITY would codify a version of that into statute. Until 14 May, market-structure legislation had been stalled since January. That is what makes Thursday the news hook.

## CLARITY Act vs MiCA: the structural difference

The two regimes share a goal — give crypto-asset firms a clear regulator and a clear rulebook — and approach it from opposite directions. The CLARITY Act (H.R. 3633, the Digital Asset Market Clarity Act of 2025) is a jurisdictional framework: it allocates digital assets between two U.S. regulators — the SEC and the CFTC — based on whether the underlying blockchain passes a four-part "mature blockchain system" test. MiCA (Regulation (EU) 2023/1114, the Markets in Crypto-Assets Regulation) is a functional framework: it classifies crypto-assets by what they are and what they do — ART, EMT, or other — and regulates issuance and service provision under one EU regime supervised by national competent authorities with ESMA and EBA technical standards.

| Dimension | CLARITY Act (H.R. 3633) | MiCA (Regulation (EU) 2023/1114) |
|---|---|---|
| Regulators | SEC (securities) + CFTC (digital commodities) | National competent authorities, with ESMA and EBA technical standards |
| Classification mechanism | Four-part "mature blockchain system" test → digital commodity (CFTC) vs investment contract (SEC) | Functional taxonomy: ART (Art 3(1)(6)), EMT (Art 3(1)(7)), other crypto-assets (Title II) |
| Token-classification artefact | Self-assessment + (anticipated) regulator certification | Whitepaper + competent-authority notification or approval (Titles II–IV) |
| Custody | Post-passage rule-making by CFTC and SEC | Art 70 (segregation of funds) and Art 75 (custody of crypto-assets) — in force since 30 December 2024 |
| Market abuse | SEC anti-fraud for securities; CFTC anti-manipulation (CEA Section 6(c)) for commodities | Title VI — covers all crypto-assets, applied 30 December 2024 |
| Stablecoins | Covered by the GENIUS Act (signed 18 July 2025) | EMT regime, Title IV, applied 30 June 2024 |
| Status (May 2026) | House-passed; Senate Banking markup 14 May; Senate Ag advanced parallel S.3755 | In force; transitional grandfathering ends 1 July 2026 |

The "mature blockchain system" test is the load-bearing piece of CLARITY. The [House Financial Services section-by-section release](https://financialservices.house.gov/uploadedfiles/2025-07-10_-_sbs_-_clarity_act_of_2025_final.pdf) describes it as four cumulative conditions: the system is functional for executing transactions, accessing services, or participating in validation or governance; the code is open-source; the rules are pre-established and transparent; and no person or group controls the system, including by holding 20% or more of the tokens or associated voting rights. A digital asset "intrinsically linked" to a mature blockchain system is a *digital commodity* under CFTC spot-market jurisdiction. Everything else stays in SEC investment-contract territory.

MiCA does not ask whether the blockchain is mature. It asks what the token does. If the token references a basket of values or rights, it is an ART. If it references one official currency, it is an EMT. If it is neither, it is a crypto-asset of another kind under Title II. The same Bitcoin would be a digital commodity under CLARITY and an "other crypto-asset" under MiCA — but for different reasons, supervised by different regulators, on different timelines.

## What CTOs do now

The instinct under regulatory divergence is to rebuild for each regime. That is wrong. The substrate is shared. The classifications and audit trails differ. Approximately 80% of the engineering work an authorised CASP has already done — custody segregation, market-abuse surveillance, canonical event logging, register of information — transfers to CLARITY-readiness with audit-trail wiring rather than rebuild. Below is what I would brief into the next quarterly planning meeting at a firm with U.S. and EU exposure.

### 1. Build a dual classification map, not two regimes

The first deliverable is an artefact, not code. Take every token the firm touches — listed pairs, custody balances, treasury holdings, products denominated in or settling against the asset — and build a two-column map.

The MiCA column is straightforward. ART, EMT, or other crypto-asset (Title II). The whitepaper status and the competent-authority position are already known for any token traded in the EU; for tokens not yet offered in the EU, run the Article 3 definitions.

The CLARITY column is a self-assessment against the four-part mature-blockchain test. Document the answer to each part with evidence: the GitHub repo for the open-source condition; the governance documentation for transparent rules; the token-distribution analysis for the 20% threshold; the network usage data for the functional condition. The test may be amended on 14 May during markup — track the substitute text — but the four-part structure has been stable from House passage through the Senate Banking draft, and the 20% concentration threshold has survived every published draft.

This map is your first regulator-facing artefact under CLARITY. It is also a forcing function: tokens that fail two or three of the four tests are the tokens where the firm has the most legal and engineering exposure. The map tells you which projects deserve the next sprint of work.

### 2. Custody segregation: MiCA gives you a head start

If the firm is MiCA-authorised or in flight, [client crypto-asset segregation under MiCA Articles 70 and 75](https://eur-lex.europa.eu/eli/reg/2023/1114/oj) is already in production. Segregated wallets at the protocol level. Different key sets, different operational procedures. A reconciliation pipeline that proves segregation continuously against the on-chain state. MPC or HSM-backed key schemes for the bulk balance. Key-ceremony procedures and quorum requirements.

CLARITY rule-making post-passage will land on substantially the same architecture. The SEC and CFTC will issue custody rules under their respective jurisdictions — for digital commodities under CFTC Part 1 and 22 frameworks adapted for crypto, for digital securities under SEC Rule 15c3-3 adapted similarly. The audit trail will be different (U.S. regulators want different report shapes, on different cadences), but the underlying segregation pipeline is the same engineering work.

A CASP that has already built [DORA-aligned ICT risk management](/blog/what-dora-actually-requires/) — the register of information under Article 28, the incident classification rules under Articles 17 and 18 — has already done most of the operational-resilience scaffolding that any CLARITY rule-making will eventually demand of CFTC-registered digital commodity exchanges.

### 3. Market-abuse surveillance: assume parity

[MiCA Title VI](https://eur-lex.europa.eu/eli/reg/2023/1114/oj) covers market abuse for crypto-assets across the EU. The surveillance pipeline that ingests order-book and trade data, runs detection rules, and generates STOR workflows is required and operational at every authorised CASP.

CLARITY does not have a single market-abuse title. The SEC's existing anti-fraud authority covers digital securities. The CFTC's anti-manipulation authority under CEA Section 6(c) covers digital commodity spot markets. The [SEC/CFTC joint interpretation of 17 March 2026](https://www.sec.gov/files/rules/interp/2026/33-11412.pdf) signals that the two regulators intend to coordinate, but parallel jurisdiction is not unified jurisdiction.

What this means for engineering: build the surveillance pipeline once. Make the output schemas configurable so the same alert can populate a STOR (for MiCA) and a regulator-facing report in SEC or CFTC shape. The detection logic is the same. The report templates differ.

### 4. Canonical event log: build once, query many

Every regime so far — MiCA Article 68, DORA Article 28, the GDPR Article 30 record of processing, EU AI Act Article 12 logging, and any post-passage CLARITY rule — wants the same underlying artefact. A canonical, append-only event log that captures every service interaction with a structured payload: client identifier, service type, timestamp, amount, asset, counterparty, regulatory tag.

The shape is the same as the [tamper-evident logging architecture](/blog/eu-ai-act-article-12-tamper-evident-logging/) that the EU AI Act demands of providers of high-risk AI systems. If the firm has built it for one regime, the others fall out for free with query layers and report templates. If the firm has not built it, this is the highest-leverage piece of engineering work in the entire compliance programme — one substrate, many regulators.

## How to know if you need to act now

Three signals.

**You have U.S. customers, U.S. establishment, or U.S. marketing.** Then CLARITY is in scope on passage. Reverse solicitation under U.S. securities law is narrower than people remember, and the SEC's enforcement posture under the new administration is still securities-law-based for anything that fails the mature-blockchain test. If you serve U.S. customers, plan for CLARITY.

**You are already MiCA-authorised or in flight.** Then most of the engineering work transfers. The dual classification map is a quarter of work. The custody substrate is already there. The surveillance pipeline is already running. The canonical event log is already written. What remains is audit-trail wiring and U.S.-specific report templates.

**You have tokens in the ambiguous SEC/CFTC zone.** The 20% concentration test in the mature-blockchain definition is the line most projects fall around. If the token distribution shows any single entity above 20%, the asset fails the test and stays in SEC territory. That is a Q3 2026 deliverable to assess token-by-token and document.

If one or more of those signals applies, [book thirty minutes](/contact) — the first deliverable is the dual classification map.

## The cost structure

Three tiers, same shape as every other regulatory programme I cost.

A Deloitte or EY team will scope this as a greenfield CLARITY programme, because they do not carry forward your MiCA substrate work — that work belongs to their separate advisory relationship, often with a different partner and a different statement of work. You pay for two projects. In engagements I have reviewed, the dual-jurisdiction programme costs 30–40% less when the MiCA substrate is already in production: the difference between one engineering quarter and two. The point of the fractional model is one substrate, one team, one engagement — [which is what the work looks like in practice](/work).

**Tier one — legal-only mapping.** £20k–£50k. Counsel produces the token classification map. No engineering work. The firm is exposed in the same way a MiCA authorisation file without a substrate is exposed: the document exists, the firm has not changed. Adequate for firms with very narrow product surface and no U.S. footprint to defend.

**Tier two — classification map plus substrate extension.** £80k–£250k over a quarter or two. The dual classification map is built. The MiCA substrate is audited against the four-part mature-blockchain test for every token. Audit-trail templates are extended for SEC and CFTC report shapes. The surveillance pipeline is wired to dual-output. This is the realistic mid-market profile for a firm with U.S. and EU customers and a MiCA programme in flight, and the tier that fits [the fractional CTO model](/services). The Big-4 will quote tier-three pricing for this work.

**Tier three — greenfield U.S.-only CLARITY-native architecture.** £400k+. Only relevant for new firms incorporating after CLARITY passage with no MiCA footprint. Even here, the right architecture treats MiCA expansion as a near-term path rather than a separate project — the same substrate works for both, and building twice costs more than building once with two regulators in mind.

## Where this goes wrong

**Rebuilding the substrate twice.** The single largest failure mode. Engineering teams that have built MiCA-compliant custody, surveillance, and event logging assume CLARITY requires a parallel system. It does not. The substrate is shared; the artefacts and audit trails differ.

**Trusting reverse solicitation.** Under both MiCA and U.S. securities law, reverse solicitation is narrow and the regulators are sceptical. If the firm has *any* active marketing into the U.S. — paid acquisition, podcast sponsorships, conference presence — assume CLARITY scope on passage.

**Treating GENIUS Act and CLARITY as one project.** They are separate regimes. The GENIUS Act is law and covers stablecoins federally. CLARITY is in committee and covers market structure. A stablecoin issuer needs GENIUS compliance now and CLARITY readiness later. Conflating them produces confused project plans and missed deadlines.

**Trusting the March 17 SEC/CFTC interpretation as final guidance.** The joint interpretation is interpretive. It can be withdrawn. It can be overridden by statute. The CLARITY Act will likely codify a version of it, but the operative text is whatever passes Congress, not whatever the agencies are saying in March 2026.

**Waiting for final text.** The four-part mature-blockchain test has been stable from House Financial Services markup in May 2025 through House passage in July 2025 through the Senate Banking draft in January 2026 through the published substitute in May 2026. The 20% concentration threshold has survived every version. Waiting another six months for "final text" before starting the classification map is six months of avoidable exposure — and the single mistake I see most often in this conversation.

## The pragmatic recipe

1. **Build the dual classification map this quarter.** Article 3 of MiCA for the EU column. The four-part section-by-section test for the U.S. column. Evidence documented per token.
2. **Audit the MiCA substrate for CLARITY-readiness.** Custody segregation, market-abuse surveillance, canonical event log, register of information. Confirm what already exists. Identify the audit-trail wiring needed for SEC and CFTC report shapes. Prioritise by token exposure.
3. **Hold off on greenfield U.S.-only architecture until the Senate floor vote.** Even then, build with EU expansion baked in. One substrate, two regulators, two artefact pipelines.
4. **Track the markup amendments on 14 May.** Watch for changes to the four-part test (especially the 20% threshold), to the digital commodity definition, and to the SEC exemption pathway for primary-market raises. The substitute text is 309 pages; the changes that matter for engineering are concentrated in fewer than thirty. I will post the engineering-relevant amendments on [LinkedIn](https://www.linkedin.com/in/ventimigliasamuel/) in real time on Thursday — follow there for the 48-hour reaction.

That is the shape of the [compliance-first engagement Cuko Ltd does](/services). CLARITY does not yet have its own landing page here — it should not, until the Senate floor vote. The engineering work is already familiar.

---

*If you are sitting in the room having this exact conversation, that is the engagement Cuko Ltd does. [Book a discovery call](/contact) — thirty minutes, no obligation. The first deliverable is the dual classification map.*

## Sources

- [Senate Banking, Housing, and Urban Affairs Committee — Executive Session notice, 14 May 2026, Dirksen 538, 10:30 AM ET, to consider H.R. 3633](https://www.banking.senate.gov/hearings/05/08/2026/executive-session)
- [Chairman Scott, Senators Lummis and Tillis — Release of market-structure bill text ahead of Senate Banking Committee markup, 11–12 May 2026](https://www.banking.senate.gov/newsroom/majority/chairman-scott-senators-lummis-tillis-release-market-structure-bill-text-ahead-of-banking-committee-markup)
- [Senate Banking Committee — The facts: the CLARITY Act](https://www.banking.senate.gov/newsroom/majority/the-facts-the-clarity-act)
- [Congress.gov — H.R. 3633, Digital Asset Market Clarity Act of 2025](https://www.congress.gov/bill/119th-congress/house-bill/3633)
- [Clerk of the U.S. House of Representatives — Roll Call 199, 17 July 2025, H.R. 3633 passed 294–134](https://clerk.house.gov/Votes/2025199)
- [House Financial Services Committee — CLARITY Act of 2025 Section-by-Section, 10 July 2025 (PDF)](https://financialservices.house.gov/uploadedfiles/2025-07-10_-_sbs_-_clarity_act_of_2025_final.pdf)
- [Congressional Research Service — Legal Sidebar IN12583, CLARITY Act overview](https://www.congress.gov/crs-product/IN12583)
- [Senate Agriculture, Nutrition, and Forestry Committee — Boozman leads Ag Committee in advancing crypto market structure legislation, 29 January 2026](https://www.agriculture.senate.gov/newsroom/rep/press/release/boozman-leads-ag-committee-in-advancing-crypto-market-structure-legislation)
- [Congress.gov — S.3755, Digital Commodity Intermediaries Act, text](https://www.congress.gov/bill/119th-congress/senate-bill/3755/text)
- [The White House — Fact sheet: President Donald J. Trump signs GENIUS Act into law, 18 July 2025](https://www.whitehouse.gov/fact-sheets/2025/07/fact-sheet-president-donald-j-trump-signs-genius-act-into-law/)
- [Regulation (EU) 2023/1114 — Markets in Crypto-Assets Regulation (MiCA)](https://eur-lex.europa.eu/eli/reg/2023/1114/oj)
- [ESMA — Markets in Crypto-Assets Regulation (MiCA) implementation page](https://www.esma.europa.eu/esmas-activities/digital-finance-and-innovation/markets-crypto-assets-regulation-mica)
- [Regulation Tomorrow — ESMA statement on the end of transitional periods under MiCA, April 2026](https://www.regulationtomorrow.com/2026/04/esma-statement-on-the-end-of-transitional-periods-under-mica/)
- [SEC Release 33-11412 — Joint SEC/CFTC interpretation on digital asset regulation, 17 March 2026 (PDF)](https://www.sec.gov/files/rules/interp/2026/33-11412.pdf)
- [Paul Hastings — Crypto Policy Tracker: update on crypto market structure legislation, Senate Banking draft and CLARITY Act](https://www.paulhastings.com/insights/crypto-policy-tracker/update-on-crypto-market-structure-legislation-senate-banking-draft-and-clarity-act)
