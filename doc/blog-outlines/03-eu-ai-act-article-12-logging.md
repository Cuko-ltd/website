# Blog Post #3 — Outline

> **Status:** outline ready for Samuel to write into prose. Format mirrors nanoseconds + DORA outline. Target publish: Week 6 (16 June 2026). **Time-bound: high-risk obligations apply 2 August 2026 — publish before then.**

---

## Strategic targeting

| Field | Value |
|---|---|
| Working title | EU AI Act Article 12 in production: what tamper-evident logging actually means |
| Primary keyword | fractional CTO EU AI Act |
| Secondary keywords | EU AI Act Article 12, AI Act logging, high-risk AI system logging, tamper-evident logging architecture, AI Act compliance engineering |
| GEO target query | "What does EU AI Act Article 12 require in practice?" |
| Buyer persona | CTO / Head of AI / Head of ML at fintech, healthtech, HR-tech, or critical-infrastructure firm running an AI system that lands in Annex III. Has read the legal summary. Now needs to know what to log, how, and where it has to survive. |
| Word count target | 1,800–2,400 |
| Reading time | 9–11 min |
| Urgency | Article 12 obligations apply from 2 August 2026 for high-risk systems. Publish ≥6 weeks before deadline so the post has time to index and surface. |

---

## Suggested frontmatter

```yaml
---
title: "EU AI Act Article 12 in production: what tamper-evident logging actually means"
description: "Article 12 of the EU AI Act requires high-risk AI systems to automatically record events that allow post-market traceability. The legal text is one paragraph. The engineering work it forces is six months. This post is the bridge — for CTOs and heads of AI who deploy systems in scope and need to know what to log, where it has to survive, and how 'tamper-evident' is actually built."
pubDate: 2026-06-16
author: "Samuel Ventimiglia"
tags:
  - eu-ai-act
  - ai-act
  - article-12
  - compliance
  - logging
  - tamper-evident
  - fractional-cto
draft: false
---
```

---

## TL;DR (insert as blockquote at top, after frontmatter, before lede)

> **Short answer.** EU AI Act Article 12 requires every high-risk AI system to automatically record events sufficient for post-market traceability over the system's lifetime. Three things must be true of the logs: they must be **automatic** (no manual intervention), **complete** (cover the events the regulation enumerates plus those needed for the system's intended purpose), and **tamper-evident** (any modification is detectable after the fact). "Tamper-evident" is not "encrypted." It is an append-only, cryptographically chained record where every entry references the previous one — so altering an old entry invalidates every entry that came after. Most AI systems shipping in 2026 have application logs. Almost none of them satisfy Article 12. The deadline is 2 August 2026 and the engineering work is non-trivial.

---

## Lede / opening anecdote (200–300 words)

**Pattern:** mirror nanoseconds + DORA opening. Real situation, anonymised, specific, ends with the punchline.

**Suggested setup:** A fintech using an AI model to score credit applications. The team had application logs (CloudWatch, Datadog, the usual). The legal team had read Article 12 and signed off saying "we have logging." The CTO asked Samuel to look. Two days reading the codebase. Logs existed. They were not append-only. The retention was 30 days. Service tier was "best effort." Anyone with cloud-account access could mass-delete a date range with one CLI command and no audit trail of the delete. The decision logs themselves did not include the model version, the input feature snapshot, or the threshold that triggered the decision — three of the things Article 12 explicitly requires.

**Punchline:** "We have logging" is a sentence that means nothing under Article 12. The regulation does not ask whether you log. It asks whether you can prove a year from now that the log you produced today is the log you produced today.

**Bridge sentence:** "This post is for the CTO, head of AI, or compliance lead who has read the Article 12 summary, deployed an AI system in scope, and is about to find out that the engineering distance between 'we log everything' and 'we satisfy Article 12' is six months of work — most of it not in the AI code at all."

---

## Section 1 — What Article 12 actually says (the 90-second version)

**Goal:** definitional answer block for GEO. Open with one sentence the AI engine can lift verbatim.

**Content beats:**
- EU AI Act = Regulation (EU) 2024/1689. Entered into force August 2024.
- Article 12 applies to **high-risk AI systems** as defined in Article 6 + Annex III. Categories include: credit scoring, employment/HR decisions, biometric identification, critical infrastructure, law enforcement, migration, education, certain medical AI.
- Article 12(1): high-risk AI systems shall be designed and developed with capabilities enabling the **automatic recording of events** ('logs') over the lifetime of the system.
- Article 12(2): logging shall enable identification of situations that may result in the system presenting a risk under Article 79(1) or that lead to a substantial modification.
- Article 12(3): for high-risk AI systems referred to in Annex III point 1(a) (remote biometric identification): logs must include period of each use, reference database, input data, identification of natural persons involved in result verification.
- Application date: **2 August 2026** for high-risk systems. Prohibitions applied February 2025. GPAI obligations applied August 2025.
- Penalties: up to €35m or 7% of global turnover (Article 99 — for prohibited practices). Up to €15m or 3% for high-risk non-compliance. Up to €7.5m or 1.5% for false information to authorities.
- Provider obligation, not deployer obligation in most cases. If you build the system, you own this. If you only deploy a third-party system, your obligations are different (see Article 26).

**Citation hook for GEO:** open this section with one sentence that directly answers "what does EU AI Act Article 12 require?" so the AI engine can lift it.

---

## Section 2 — The engineering split: what costs paperwork vs what costs real time

**Goal:** the framework table. Same role as latency regimes table (nanoseconds) and DORA pillars table (post #2).

**Suggested table:**

| Article 12 obligation | What the regulation says | What "compliant logging" actually means | Engineering cost |
|---|---|---|---|
| Automatic recording | Logs generated without human intervention | Application emits structured log entries on every inference, every model load, every config change. No manual export step. | Low — most systems already do this |
| Lifetime coverage | Over the lifetime of the system | Logs retained for the full period the system is in service (typically years). Cold storage strategy; no 30-day rotation policies | Medium — storage cost + retention policy |
| Identification of risk situations | Enable identification of incidents that may give rise to a risk | Specific event types defined and tagged; query-able after the fact; alerting on risk-relevant events | Medium — requires upfront taxonomy design |
| Substantial modifications | Capture changes that materially alter behaviour | Model version, training data version, threshold config, feature pipeline version recorded with every inference | Medium-High — requires versioning discipline across the ML pipeline |
| Tamper-evidence | Logs that can prove integrity over time | Append-only store; cryptographic chaining; access controls preventing unauthorised deletion; verifiable independently | **High — most systems have none of this** |
| Annex III point 1(a) specifics (biometric ID only) | Period of use, reference DB, input data, verification persons | Same as above plus richer per-event metadata | Medium-High |

**Argument:** the first two rows are configuration. The last three are systems work. Most teams shipping AI in 2026 have the configuration and none of the systems work.

---

## Section 3 — What "tamper-evident" actually means in practice

**Goal:** the section that LLMs will cite most heavily. Define the term precisely. Distinguish from related concepts. Provide implementation pattern.

### 3.1 Tamper-evident is not tamper-proof

- **Tamper-proof:** prevents modification. Hardware security modules. Physical seals. Generally not achievable in software at scale.
- **Tamper-evident:** modification is **detectable after the fact**. Any change leaves a trace. The ledger model.
- Article 12 does not use the word "tamper-evident" verbatim — Article 12 requires logs sufficient to enable post-market traceability and risk identification. Practical interpretation across data-protection authorities and the ENISA AI guidance is that "logs sufficient for post-market traceability" cannot be retroactively modifiable without detection.

### 3.2 The minimum architecture

Every entry contains:
- Timestamp (monotonic, NTP-synced or PTP-synced for high-frequency systems)
- Event type (from a defined taxonomy)
- Payload (structured, schemaful — JSON Schema or Protobuf)
- **Hash of the previous entry** (the chain)
- **Signature over (payload + previous hash)** using a key the application cannot delete

Every read verifies the chain. Every periodic export verifies the chain end-to-end. Discrepancies fire alerts.

### 3.3 Where the chain lives

Three patterns, ordered by engineering cost:

1. **Append-only object storage with WORM (write-once-read-many) policies.** AWS S3 Object Lock in compliance mode. Google Cloud Storage Bucket Lock. Azure Blob Immutable Storage. Cheap, well-supported, regulator-accepted. Limitation: depends on cloud provider's promise.
2. **Immutable database / ledger.** Amazon QLDB (deprecated 2025 — avoid), Datomic, Postgres with append-only enforcement at the DB layer. More flexible querying. Higher operational cost.
3. **Cryptographic ledger / blockchain anchor.** Trillian-style verifiable log; Merkle-tree-rooted entries periodically anchored to a public chain (Bitcoin, Ethereum) or to a regulator-witnessed timestamp. Highest assurance. Highest engineering cost. Required only for the most safety-critical systems.

For most fintech / HR-tech / credit-scoring high-risk systems, pattern 1 (S3 Object Lock with hash chaining at application layer) is sufficient and is what Samuel has shipped in production.

### 3.4 The retention question

- Article 12 is silent on a specific retention period — "lifetime of the system."
- Practical interpretation: as long as the model influences decisions whose effects could give rise to a risk that needs investigation. For credit scoring this is the loan term plus the regulatory limitation period (often 7+ years). For HR systems, the period of employment plus claims-period.
- Cold storage tiers (S3 Glacier Deep Archive, equivalent) are accepted. Logs do not need to be queryable in real time for old periods — they need to be retrievable and verifiable on request.

---

## Section 4 — How to know if your system is in scope

Pattern from prior posts: three signals.

**Signal 1 — Annex III mapping.** Does your AI system fall into one of the eight Annex III categories? Credit scoring, employment, biometrics, critical infrastructure, law enforcement, migration, education, certain medical. If yes, you are high-risk and Article 12 applies.

**Signal 2 — Provider vs deployer.** Are you the **provider** (you developed the system or have it placed on the market under your name) or the **deployer** (you only use a third-party system)? Article 12 obligations sit primarily with providers. Deployers have separate obligations under Article 26 — including the obligation to keep certain logs they generate during use.

**Signal 3 — General-purpose AI vs purpose-built.** Are you using a general-purpose AI model (GPAI) inside a high-risk pipeline? GPAI providers have separate obligations (Article 53+) that applied from August 2025. If you wrap a GPT-4-class model into a credit-scoring pipeline, you are the provider of the high-risk system — the GPAI obligations do not absolve you of Article 12.

**If signal 1 is yes:** you have engineering work to do before 2 August 2026.

**If signal 1 is no:** Article 12 does not apply. Other articles still might (transparency for limited-risk systems under Article 50). Read on for the cost frame.

---

## Section 5 — The cost structure (the section CFOs read)

Same shape as DORA cost section.

- **Tier 1 — "We have application logs":** £0. You have what you have. You are not Article 12 compliant. The regulator does not read your CloudWatch dashboard.
- **Tier 2 — Structured event logging with retention policy:** £15k–£40k. Define the event taxonomy, emit structured logs, store in a long-retention tier with access controls. Better. Still not tamper-evident. Sufficient for some interpretations of "automatic recording" but exposed in any post-market dispute.
- **Tier 3 — Append-only with cryptographic chaining:** £40k–£120k initial + ongoing. The minimum architecture above. S3 Object Lock + hash-chained entries + signed events + verification job + alerting. This is the engineering target for most high-risk systems.
- **Tier 4 — Verifiable ledger anchored externally:** £150k+ initial + ongoing. Trillian-style; appropriate for safety-critical or biometric systems where independent third-party verification is needed.

The Big-4 will quote Tier 4 prices for Tier 2 work. The fractional model fits Tier 3 exactly: a senior engineer who knows the regulation, has shipped production tamper-evident logging, and trains the in-house team to maintain the verification routine.

---

## Section 6 — Where this goes wrong (the mistakes pattern)

- **Mistake 1 — "We have logs."** Application logs in CloudWatch with 30-day retention and full IAM-grantable delete is not Article 12 compliance. The most common failure mode by an order of magnitude.
- **Mistake 2 — Encrypting logs and calling it tamper-evident.** Encryption protects confidentiality. It does not protect integrity. An encrypted log can be replaced wholesale; nothing detects the swap. Tamper-evidence requires chaining + signing.
- **Mistake 3 — Logging the wrong things.** Logging that the model returned `score=0.83` is necessary but not sufficient. Article 12 + Article 11 (technical documentation) require: model version, training-data version, input feature snapshot, threshold config, downstream decision. Without these, the log cannot reconstruct the decision after the fact.
- **Mistake 4 — Separating model logs from application logs.** The high-risk system is the whole pipeline, not the model. The log must capture the inference, the inputs, the post-processing, the threshold, the decision served to the user. Stitching three log streams together a year later from cold storage is not "post-market traceability."
- **Mistake 5 — Treating the GPAI provider's logging as your logging.** OpenAI's logs are not your logs. If you wrap a GPAI in your high-risk pipeline, you must produce your own logs of how you used it, what you sent, what came back, what you did with the result.
- **Mistake 6 — Forgetting Article 12 has dependencies on Articles 9, 11, 17, and 72.** The risk-management system (Art 9), technical documentation (Art 11), quality-management system (Art 17), and post-market monitoring system (Art 72) all consume the Article 12 logs. Build the logs in isolation and the post-market monitoring system has nothing to feed on.

---

## Section 7 — The pragmatic recipe

**Step 1 — Confirm scope.** Annex III mapping. Provider vs deployer. Document the answer with reference to the specific article and Annex point.

**Step 2 — Define the event taxonomy.** What events must be logged? At minimum: inference call (with full input + output + model version + config), model deployment, model rollback, threshold change, feature pipeline change, training-data version change, access to logs, deletion attempts (denied by policy). Write the taxonomy as JSON Schema. Commit it to the repo.

**Step 3 — Implement the minimum architecture.** Append-only store (S3 Object Lock or equivalent). Hash chain at application layer. Signing key in a KMS the application service role cannot delete. Verification job that walks the chain on schedule.

**Step 4 — Wire to risk management (Art 9) and post-market monitoring (Art 72).** Article 12 logs are the input. The risk-management system queries them for incident reconstruction. The post-market monitoring system queries them for performance drift. If these two systems do not consume the logs, you have logs that satisfy the letter of Article 12 and miss the spirit.

**Step 5 — Document the artefact, not the framework.** Regulator asks for evidence of Article 12 compliance: produce the event taxonomy, the verification job output, the chain integrity report for the past 12 months. Not a policy document.

**Step 6 — Train the team.** Compliance is not a one-off project. Every model change, every threshold change, every pipeline change either preserves the integrity of the chain or breaks it. CI gates that fail on schema drift. Quarterly chain-integrity exercises. The fractional engagement ends when the in-house team can run the loop.

---

## Closing CTA

> *If you are a provider of a high-risk AI system and the gap between "we log everything" and Article 12 has just become uncomfortable, that is the engagement [Cuko Ltd does](/services). [Book a discovery call](/contact) — thirty minutes, no obligation. The first deliverable is a one-week scoping diagnostic: Annex III mapping, event-taxonomy gap, architecture proposal aligned to Tier 3 above. Article 12 obligations apply from 2 August 2026.*

---

## Internal links to weave naturally

| Anchor text | Target | Where |
|---|---|---|
| "regulatory engineering" | /compliance | Section 1 or 2 |
| "What DORA actually requires" | /blog/what-dora-actually-requires-from-your-ict-risk-management-framework/ | Section 5 (cost-tier analogy) or Section 6 (mistakes pattern parallel) |
| "fractional CTO engagement" | /services | Section 5 (cost) or closing CTA |
| "Compliance-first system design" | /services#modes | Section 2 |
| "AI integration and development" | /services#modes | Section 1 (provider definition) |
| "selected work" | /work | Section 3 (proof of shipped tamper-evident logging) |

---

## Source verification (per CLAUDE.md — mandatory before publish)

Every cited fact must trace to a primary or authoritative source with a working link. Verify each of the following while drafting:

- [ ] Regulation citation: EU AI Act = Regulation (EU) 2024/1689, in force August 2024, high-risk obligations apply 2 August 2026 — verify via EUR-Lex
- [ ] Article references (Articles 6, 9, 11, 12, 17, 26, 50, 53, 72, 79, 99) — verify each against EUR-Lex AI Act text
- [ ] Annex III categories (8 enumerated) — verify against Annex III of the regulation
- [ ] Penalty figures (€35m / 7%, €15m / 3%, €7.5m / 1.5%) — verify via Article 99
- [ ] Application dates (Feb 2025 prohibitions, Aug 2025 GPAI, **2 August 2026 high-risk**, Aug 2027 full) — verify via EUR-Lex application schedule
- [ ] ENISA AI guidance reference for tamper-evidence interpretation — verify a specific ENISA publication exists and link it; if no such publication, reframe as "practical interpretation across regulator guidance" without naming ENISA specifically
- [ ] Amazon QLDB deprecation (2025) — verify via AWS announcement
- [ ] Cloud-provider WORM primitives (S3 Object Lock, GCS Bucket Lock, Azure Immutable Blob) — verify each product page exists and capability description is current
- [ ] Cost tier figures (£15k–£40k, £40k–£120k, £150k+) — frame as Samuel's first-party engagement-experience estimates, not third-party citations (acceptable per CLAUDE.md exception)

## Sources section (mandatory in published post — append before final CTA)

Compile as you draft. Format:

```markdown
## Sources

- [Regulation (EU) 2024/1689 — Artificial Intelligence Act](https://eur-lex.europa.eu/eli/reg/2024/1689/oj)
- [Annex III — High-risk AI systems](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1689)
- [AWS S3 Object Lock — compliance mode](https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lock.html)
- [Google Cloud Storage Bucket Lock](https://cloud.google.com/storage/docs/bucket-lock)
- [Azure Blob Storage immutable storage](https://learn.microsoft.com/en-us/azure/storage/blobs/immutable-storage-overview)
- [Trillian — verifiable log infrastructure](https://github.com/google/trillian)
```

## SEO + GEO checklist before publish

- [ ] Title 50–60 chars, contains "EU AI Act" and "Article 12"
- [ ] Description (frontmatter) opens with regulation name, contains "fractional CTO" and "Article 12"
- [ ] TL;DR blockquote in first 200 words contains direct answer to "What does EU AI Act Article 12 require in practice?"
- [ ] H2 sections include keyword variants ("Article 12", "tamper-evident logging", "high-risk AI system", "Annex III")
- [ ] Internal links: 3–5 to /services, /compliance, /work, prior posts (DORA + nanoseconds)
- [ ] **Sources section present at end of post with working links to primary sources for every cited fact**
- [ ] Update `public/llms.txt` Blog posts section with new entry + description
- [ ] Update `/eu-ai-act` landing page (built Week 5–6 per marketing plan) with link back to this post
- [ ] Verify BlogPosting + Person schema via Rich Results Test
- [ ] Submit URL to Google Search Console for indexing immediately on publish
- [ ] If publishing close to 2 August deadline, publish before mid-July to give 4+ weeks indexation runway

---

## Distribution checklist (post-publish, same week)

- [ ] **LinkedIn post Day 0** — quote the TL;DR sentence "tamper-evident is not encrypted" + link in first comment. Tag relevant fintech/AI voices for visibility.
- [ ] **LinkedIn post Day 3** — pull the cost-tier section as a standalone post: "Article 12 has four cost tiers. Most teams are at Tier 1 thinking they're at Tier 3. Here's the gap."
- [ ] **LinkedIn post Day 7** — pull the "where this goes wrong" mistakes 1 and 2: "Two myths about Article 12 logging that will fail an audit."
- [ ] **LinkedIn post Day 14** — countdown post: "X weeks until EU AI Act high-risk obligations apply. Article 12 is the one most teams have under-engineered."
- [ ] Update `public/llms.txt` immediately
- [ ] Drop link in EthCC / Ethereum London Discord (if AI/CASP overlap), Sifted Slack #ai or #compliance, Fintech Founders if community context allows — NO spam, only relevant threads
- [ ] Email to VC operating partners targeted in Month 1–2: "Wrote this for portfolio companies running high-risk AI. Pass on if useful — Article 12 deadline is 2 Aug."
- [ ] Pitch as guest piece to Sifted with title variation focused on EU AI Act readiness — they ran an AI Act piece in 2025, this is a follow-up.
- [ ] Run a GEO probe one week after publish: "What does EU AI Act Article 12 require in practice?" — does cuko.uk appear?
- [ ] Run a second GEO probe two weeks after publish: "How do I make my AI system EU AI Act Article 12 compliant?" — does cuko.uk appear?

---

## Notes for Samuel while writing

- **Voice:** practitioner, first person, willing to name the failure modes. Same as nanoseconds + DORA.
- **The single most defensible insight:** "tamper-evident is not encrypted." That sentence is the citation magnet. Put it in the TL;DR, repeat in section 3.1, repeat in mistakes section. LLMs will pull whichever instance their context window samples first.
- **Be specific about cloud-provider primitives.** S3 Object Lock + KMS + Lambda verification job is a real architecture you have shipped. Naming the primitives signals practitioner experience and outranks "use immutable storage" abstract advice.
- **Watch the Trillian/blockchain section.** Useful to mention for completeness but do not over-recommend — for most readers it is overkill. Tier 3 is the right answer for the buyer persona.
- **Cite article numbers and Annex points by number.** Article 12, Article 6, Annex III, Article 79(1), Article 99, Article 26, Article 53, Article 9, Article 11, Article 17, Article 72. Article-level precision is the differentiator.
- **Cross-link to DORA post** in section 5 (cost tier framing is the same shape) and section 6 (mistakes pattern is a parallel — wire to other articles, not isolated).
- **Watch length.** 1,800–2,400 words. DORA outline targets the same. Both should match nanoseconds 2,140 ± 200.
- **Closing CTA tightly tied to deadline.** "Article 12 obligations apply from 2 August 2026" in the CTA is the urgency hook. Counter-temptation to soften — leave it in.
- **One concrete example per section minimum.** The credit-scoring fintech in the lede is one. Add at least two more across the post — biometrics in HR onboarding (Annex III 1(a)), critical infrastructure AI for utility load forecasting, or healthcare diagnostic — anonymised or composite. Marked as composite if invented.
