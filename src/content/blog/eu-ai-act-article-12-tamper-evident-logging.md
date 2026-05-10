---
title: "EU AI Act Article 12: tamper-evident logging for high-risk AI systems"
description: "EU AI Act Article 12 requires tamper-evident logging for every high-risk AI system. Deadline 2 August 2026. Here is what compliant logging actually means."
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
faqs:
  - question: "What does EU AI Act Article 12 require in practice?"
    answer: "Article 12 of the EU AI Act (Regulation (EU) 2024/1689) requires every high-risk AI system to automatically record events over its lifetime in a way that is tamper-evident. In practice this means: (1) automatic logging with no manual export step; (2) a defined event taxonomy covering inferences, model changes, and threshold changes; (3) an append-only store with cryptographic hash chaining so any modification is detectable; and (4) retention for the lifetime of the system. Obligations apply to high-risk AI systems under Annex III from 2 August 2026."
  - question: "What is the difference between tamper-evident and tamper-proof logging?"
    answer: "Tamper-proof prevents modification — achievable with hardware security modules but generally not at software scale. Tamper-evident means any modification is detectable after the fact: a cryptographic hash of each log entry references the previous one, so altering an old entry invalidates every entry that follows. EU AI Act Article 12 requires tamper-evident logs, not tamper-proof ones."
  - question: "Does EU AI Act Article 12 apply to deployers or only to providers?"
    answer: "Article 12 obligations sit primarily with providers — the entity that develops the high-risk AI system or has it placed on the market under its name. Deployers (firms that only use a third-party system) have separate obligations under Article 26, including the obligation to keep certain logs they generate during use. If you wrap a general-purpose AI model into a high-risk pipeline, you are the provider of the resulting high-risk system, and the GPAI provider's obligations under Articles 53+ do not absolve you of Article 12."
  - question: "What are the EU AI Act penalty figures for high-risk system non-compliance?"
    answer: "Article 99 of the EU AI Act sets administrative fines of up to €15 million or 3% of total worldwide annual turnover (whichever is higher) for non-compliance with high-risk system obligations. Up to €35 million or 7% applies to prohibited practices. Up to €7.5 million or 1.5% applies to supplying incorrect information to authorities."
---

> **Short answer.** [Article 12 of the EU AI Act](https://artificialintelligenceact.eu/article/12/) requires every high-risk AI system to allow the automatic recording of events ('logs') over the lifetime of the system, sufficient to identify risk situations, support post-market monitoring, and (for biometric identification systems under Annex III point 1(a)) record the period of each use, the reference database, the input data leading to a match, and the people involved in verifying results. **The deadline is 2 August 2026 and the engineering work is non-trivial.** Three things must be true of those logs in practice: they must be **automatic** (no manual intervention), **complete** (cover the regulation-enumerated events plus those needed for the system's intended purpose), and **tamper-evident** (any modification is detectable after the fact). Tamper-evident is not encrypted. It is an append-only, cryptographically chained record where every entry references the previous one, so altering an old entry invalidates every entry that came after. Most AI systems shipping in 2026 have application logs. Almost none of them satisfy Article 12.

A composite of engagement situations I see often: a fintech using a model to score credit applications. The team has application logs — CloudWatch, Datadog, the usual stack. The legal team has read Article 12 and signed off saying "we have logging." The CTO asks me to look. Two days reading the codebase. Logs exist. They are not append-only. The retention is thirty days. Service tier is "best effort." Anyone with cloud-account access can mass-delete a date range with one CLI command and no audit trail of the delete. The decision logs themselves do not include the model version, the input feature snapshot, or the threshold that triggered the decision — three things Article 12 explicitly requires.

"We have logging" is a sentence that means nothing under Article 12. The regulation does not ask whether you log. It asks whether you can prove a year from now that the log you produced today is the log you produced today.

This post is for the CTO, head of AI, or compliance lead who has read the Article 12 summary, deployed an AI system in scope, and is about to find out that the engineering distance between "we log everything" and "we satisfy Article 12" is six months of work — most of it not in the AI code at all.

## What EU AI Act Article 12 requires, in 90 seconds

The EU AI Act is [Regulation (EU) 2024/1689](https://eur-lex.europa.eu/eli/reg/2024/1689/oj/eng), and Article 12 applies to **high-risk AI systems** as defined in Article 6 with reference to [Annex III](https://artificialintelligenceact.eu/annex/3/). Annex III enumerates eight categories: biometrics, critical infrastructure, education and vocational training, employment and workers management, access to essential private and public services (including creditworthiness and insurance pricing), law enforcement, migration and border control, and administration of justice and democratic processes. If your system lands in any of those, Article 12 is on you.

The text of [Article 12 itself](https://artificialintelligenceact.eu/article/12/) is short. Paragraph 1: high-risk AI systems shall technically allow for the automatic recording of events over the lifetime of the system. Paragraph 2: logging shall enable identification of risk situations under Article 79(1), enable post-market monitoring under Article 72, and enable monitoring of operations under Article 26(5). Paragraph 3: for systems under Annex III point 1(a) — the remote biometric identification subset — logging must record the period of each use, the reference database, the input data that led to a match, and the people involved in verifying the results.

The application timeline is staged. Per [Article 113](https://artificialintelligenceact.eu/article/113/), the prohibitions in Chapter II applied from 2 February 2025. GPAI obligations applied from 2 August 2025. **High-risk system obligations under Annex III apply from 2 August 2026.** The Article 6(1) high-risk classification rules for systems falling under Annex I product-safety legislation apply from 2 August 2027.

The penalty schedule in [Article 99](https://artificialintelligenceact.eu/article/99/) is sized to be felt: up to €35m or 7% of global annual turnover for prohibited practices, up to €15m or 3% for non-compliance with high-risk obligations, up to €7.5m or 1.5% for supplying incorrect information to authorities, whichever is higher in each tier.

Article 12 obligations sit primarily with **providers** — the entity that develops the system or has it placed on the market under its name. **Deployers** (firms that only use a third-party system) have separate obligations under Article 26, which include the obligation to keep certain logs they generate during use. If you wrap a general-purpose AI model into a high-risk pipeline, you are the provider of that high-risk system, and the GPAI provider's obligations under Articles 53+ do not absolve you of Article 12.

## The split: what costs paperwork, what costs real time

Most teams that cost Article 12 by reading the legal summary underestimate by an order of magnitude. The regulation reads like a configuration setting and lands like a systems programme.

| Article 12 obligation | What the regulation says | What "compliant logging" actually means | Engineering cost |
|---|---|---|---|
| Automatic recording | Logs generated without human intervention | Application emits structured log entries on every inference, every model load, every config change. No manual export step. | Low — most systems already do this |
| Lifetime coverage | Over the lifetime of the system | Logs retained for the full period the system is in service. Cold storage strategy; no thirty-day rotation policies | Medium — storage cost + retention policy |
| Identification of risk situations | Enable identification of incidents that may give rise to a risk | Specific event types defined and tagged; queryable after the fact; alerting on risk-relevant events | Medium — requires upfront taxonomy design |
| Substantial modifications | Capture changes that materially alter behaviour | Model version, training-data version, threshold config, feature pipeline version recorded with every inference | Medium-High — requires versioning discipline across the ML pipeline |
| Tamper-evidence | Logs that can prove integrity over time | Append-only store; cryptographic chaining; access controls preventing unauthorised deletion; verifiable independently | **High — most systems have none of this** |
| Annex III point 1(a) specifics (biometric ID only) | Period of use, reference DB, input data, verification persons | Same as above plus richer per-event metadata | Medium-High |

The first two rows are configuration. The last three are systems work. Most teams shipping AI in 2026 have the configuration and none of the systems work.

## What "tamper-evident" actually means in practice

This is the section that determines whether your Article 12 implementation survives a regulator request, so it is worth getting right.

### Tamper-evident is not tamper-proof

Tamper-proof prevents modification — hardware security modules, physical seals, generally not achievable in software at scale. Tamper-evident means modification is detectable after the fact. Any change leaves a trace. The ledger model.

Article 12 does not use the words "tamper-evident" verbatim. The article requires logs sufficient to enable risk identification under Article 79(1), post-market monitoring under Article 72, and operational monitoring under Article 26(5). The practical interpretation across regulator guidance and industry frameworks is that logs sufficient for those three uses cannot be retroactively modifiable without detection — because if they can be, none of the three uses are reliable. Tamper-evidence is therefore the engineering shape of compliance with the spirit of Article 12, even where the article does not name it.

### The minimum architecture

Every entry in a tamper-evident log contains: a monotonic timestamp, an event type drawn from a defined taxonomy, a structured payload (JSON Schema or Protobuf, not free-form), a hash of the previous entry (this is the chain), and a signature over the combined payload and previous hash, produced using a key the application cannot delete. Every read verifies the chain. Every periodic export verifies the chain end-to-end. Discrepancies fire alerts.

That is the architecture. The implementation choices live in three patterns.

The first is **append-only object storage with WORM (write-once-read-many) policies.** [AWS S3 Object Lock](https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lock.html) in compliance mode is the canonical example. AWS documentation is explicit: in compliance mode "a protected object version can't be overwritten or deleted by any user, including the root user in your AWS account." The retention period cannot be shortened or removed. The only way to delete an object under compliance mode before its retention date expires is to delete the AWS account itself. Equivalents exist on Google Cloud (Bucket Lock) and Azure (Immutable Blob Storage). This is cheap, well-supported, accepted by regulators in adjacent regimes (S3 Object Lock is assessed for SEC 17a-4, CFTC, and FINRA per the AWS docs), and sufficient for most fintech, HR-tech, and credit-scoring high-risk systems when paired with hash chaining at the application layer.

The second is an **immutable database or ledger** — Postgres with append-only enforcement at the database layer, Datomic, or specialist immutable-ledger databases. More flexible querying, higher operational cost.

The third is a **cryptographic ledger anchored externally** — a Trillian-style verifiable log where Merkle-tree-rooted entries are periodically anchored to a public chain or to a regulator-witnessed timestamp service. Highest assurance, highest engineering cost, required only for the most safety-critical systems and most safety-critical biometric ID deployments under Annex III point 1(a).

For the buyer this post is written for, pattern one is the right choice. S3 Object Lock in compliance mode plus application-layer hash chaining plus a KMS-managed signing key plus a periodic verification job that walks the chain. That architecture has been shipped in production. It satisfies Article 12.

### The retention question

Article 12 itself does not specify a numeric retention period — it specifies "lifetime of the system." Practical interpretation: as long as the model influences decisions whose effects could give rise to a risk that needs investigation. For credit scoring this is the loan term plus the regulatory limitation period, which often runs to seven or more years. For HR systems, the period of employment plus the relevant claims period.

Cold storage tiers (S3 Glacier Deep Archive and equivalents) are accepted. Logs do not need to be queryable in real time for old periods — they need to be retrievable and verifiable on request.

## How to know if your system is in scope

Three signals decide whether Article 12 is your problem this year.

**Signal one — Annex III mapping.** Does your AI system fall into one of the eight Annex III categories? Credit scoring is in there. Recruitment and worker management is in there. Biometric identification is in there. Critical infrastructure, education, law enforcement, migration, justice. If your system is in any of those, you are high-risk.

**Signal two — provider versus deployer.** Are you the provider, the deployer, or both? Article 12 obligations sit primarily with providers. Deployers have separate obligations under Article 26, including obligations to keep logs they generate during use. If you have built the system, even by wrapping a general-purpose model, you are the provider.

**Signal three — GPAI in a high-risk pipeline.** If you have wrapped a GPT-class model into a credit-scoring pipeline, an HR-screening pipeline, a clinical decision support pipeline, you are the provider of the resulting high-risk system. The GPAI provider has its own obligations under Article 53+, but those do not satisfy your Article 12 obligations for the wrapped system.

If signal one is yes, you have engineering work to do before 2 August 2026.

If signal one is no, Article 12 does not apply, though other articles still might (transparency obligations under Article 50 for limited-risk systems, for example). The cost frame in the next section is for the high-risk path.

## EU AI Act Article 12 compliance cost tiers (the section CFOs read)

Same regime-cost shape as every other compliance engineering programme, including the [DORA compliance equivalent for fintechs and CASPs](/blog/what-dora-actually-requires/).

**Tier one — "we have application logs."** £0. You have what you have. You are not Article 12 compliant. The regulator does not read your CloudWatch dashboard.

**Tier two — structured event logging with retention policy.** £15k to £40k. Define the event taxonomy, emit structured logs, store in a long-retention tier with access controls. Better. Still not tamper-evident. Sufficient for some interpretations of "automatic recording" but exposed in any post-market dispute.

**Tier three — append-only with cryptographic chaining.** £40k to £120k initial plus ongoing. The minimum architecture above. S3 Object Lock plus hash-chained entries plus signed events plus verification job plus alerting. This is the engineering target for most high-risk systems.

**Tier four — verifiable ledger anchored externally.** £150k+ initial plus ongoing. Trillian-style; appropriate for safety-critical or biometric systems where independent third-party verification is needed.

The Big-4 will quote tier-four prices for tier-two work. The fractional model fits tier three exactly: a senior engineer who knows the regulation, has shipped production tamper-evident logging, and trains the in-house team to maintain the verification routine.

## Where this goes wrong

**"We have logs."** Application logs in CloudWatch with thirty-day retention and full IAM-grantable delete is not Article 12 compliance. The most common failure mode by an order of magnitude.

**Encrypting logs and calling it tamper-evident.** Encryption protects confidentiality. It does not protect integrity. An encrypted log can be replaced wholesale and nothing detects the swap. Tamper-evidence requires chaining and signing.

**Logging the wrong things.** Logging that the model returned `score=0.83` is necessary but not sufficient. Article 12 read alongside Article 11 (technical documentation) requires model version, training-data version, input feature snapshot, threshold config, and downstream decision served to the user. Without these, the log cannot reconstruct the decision after the fact.

**Separating model logs from application logs.** The high-risk system is the whole pipeline, not the model. The log must capture the inference, the inputs, the post-processing, the threshold, and the decision served to the user. Stitching three log streams together a year later from cold storage is not "post-market traceability."

**Treating the GPAI provider's logging as your logging.** OpenAI's logs are not your logs. If you wrap a GPAI in your high-risk pipeline, you must produce your own logs of how you used it, what you sent, what came back, and what you did with the result.

**Forgetting Article 12's dependencies.** The risk-management system in Article 9, the technical documentation in Article 11, the quality-management system in Article 17, and the post-market monitoring system in Article 72 all consume the Article 12 logs. Build the logs in isolation and the post-market monitoring system has nothing to feed on. The same wire-to-other-articles pattern applies under DORA — if anything, it is more pronounced under the AI Act, because Article 12 is the load-bearing input to four other articles.

## The pragmatic recipe

Confirm scope. Annex III mapping. Provider versus deployer. Document the answer with reference to the specific article and Annex point. Fifteen-minute exercise; saves quarters of work.

Define the event taxonomy. What events must be logged? At minimum: inference call (with full input plus output plus model version plus config), model deployment, model rollback, threshold change, feature pipeline change, training-data version change, access to logs, deletion attempts (denied by policy). Write the taxonomy as JSON Schema. Commit it to the repository.

Implement the minimum architecture. Append-only store (S3 Object Lock or equivalent). Hash chain at application layer. Signing key in a KMS the application service role cannot delete. Verification job that walks the chain on schedule.

Wire to risk management (Article 9) and post-market monitoring (Article 72). Article 12 logs are the input. The risk-management system queries them for incident reconstruction. The post-market monitoring system queries them for performance drift. If these two systems do not consume the logs, you have logs that satisfy the letter of Article 12 and miss the spirit.

Document the artefact, not the framework. Regulator asks for evidence of Article 12 compliance — produce the event taxonomy, the verification job output, the chain integrity report for the past twelve months. Not a policy document.

Train the team. Compliance is not a one-off project. Every model change, every threshold change, every pipeline change either preserves the integrity of the chain or breaks it. CI gates that fail on schema drift. Quarterly chain-integrity exercises. The fractional engagement ends when the in-house team can run the loop.

This is exactly the shape of the [AI integration and compliance-first design engagements Cuko Ltd does](/services), and the [/compliance page](/compliance) sets out the article-level deliverables for the EU AI Act alongside DORA, MiCA, and GDPR.

---

*If you are a provider of a high-risk AI system and the gap between "we log everything" and Article 12 has just become uncomfortable, that is the engagement Cuko Ltd does. [Book a discovery call](/contact) — thirty minutes, no obligation. The first deliverable is a one-week scoping diagnostic: Annex III mapping, event-taxonomy gap, architecture proposal aligned to tier three. Article 12 obligations apply from 2 August 2026.*

## Sources

- [Regulation (EU) 2024/1689 — EU Artificial Intelligence Act](https://eur-lex.europa.eu/eli/reg/2024/1689/oj/eng) — full regulation text
- [EU AI Act Article 12 — Record-Keeping (annotated text)](https://artificialintelligenceact.eu/article/12/) — exact paragraph wording for paragraphs 1, 2, 3 including Annex III point 1(a) requirements
- [EU AI Act Annex III — High-Risk AI Systems referred to in Article 6(2)](https://artificialintelligenceact.eu/annex/3/) — eight enumerated categories
- [EU AI Act Article 113 — Entry into Force and Application Timeline](https://artificialintelligenceact.eu/article/113/) — staged dates: 2 February 2025 prohibitions, 2 August 2025 GPAI, 2 August 2026 high-risk Annex III, 2 August 2027 Article 6(1) Annex I
- [EU AI Act Article 99 — Penalties](https://artificialintelligenceact.eu/article/99/) — €35m / 7%, €15m / 3%, €7.5m / 1.5% tiered fines
- [AWS S3 Object Lock documentation](https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lock.html) — compliance mode prevents deletion by any user including the AWS account root user; assessed for SEC 17a-4, CFTC, FINRA
- [Google Trillian — verifiable data structures](https://github.com/google/trillian) — open-source Merkle-tree-based verifiable log used in Certificate Transparency; the architecture pattern referenced for tier-four tamper-evident logging
