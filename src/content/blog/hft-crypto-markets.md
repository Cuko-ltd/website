---
title: "How HFT is different in crypto markets"
description: "High-frequency trading in crypto isn't TradFi HFT with new tickers. 24/7 clocks, fragmented venues with no consolidated tape, and on-chain settlement rewrite the assumptions before you write a line of code."
pubDate: 2026-06-30
author: "Samuel Ventimiglia"
tags:
  - crypto
  - hft
  - low-latency
  - market-microstructure
  - trading-infrastructure
  - fractional-cto
draft: false
faqs:
  - question: "How is high-frequency trading different in crypto markets?"
    answer: "Crypto HFT differs from traditional HFT on five structural axes: markets trade 24/7 with no close and no maintenance window; liquidity is fragmented across hundreds of venues with no consolidated tape or NBBO, so you build your own order book; settlement splits into two latency regimes — microsecond off-chain matching on centralised exchanges versus block-time on-chain settlement on DEXs; the on-chain analog of HFT is MEV (maximal extractable value), where the public mempool acts as the order book and priority-gas auctions replace network-latency races; and the supporting plumbing — colocation, market-data normalisation, kill-switch risk controls — is far less standardised than in regulated equity or futures markets."
  - question: "Do you need microsecond latency to trade crypto?"
    answer: "It depends which regime you trade. On centralised-exchange matching engines, latency races are real and look like classic HFT — microseconds matter for cancel/replace and cross-venue arbitrage. On-chain, the latency floor is set by block time and consensus, not network round-trips, so chasing microseconds on the wire buys you nothing; the contest there is inclusion and ordering within a block (MEV), which is an auction, not a speed race. Most teams building a crypto trading product overspend on one regime's tooling while underspecifying the other."
  - question: "What is MEV and how does it relate to HFT?"
    answer: "MEV (maximal extractable value) is the maximum value that can be extracted from block production, beyond the standard block reward and gas fees, by including, excluding, and changing the order of transactions in a block. It is crypto's on-chain analog of high-frequency trading: the public mempool functions like a visible order book, and instead of racing on network latency, searchers compete in priority-gas auctions and through block builders to have their transactions ordered favourably. The strategies — arbitrage, liquidations, backrunning — rhyme with HFT, but the winning input is bid and ordering position, not wire speed."
  - question: "Why is there no consolidated tape in crypto markets?"
    answer: "Crypto markets have no regulatory equivalent of the US National Market System or a consolidated tape. Liquidity is spread across hundreds of centralised exchanges and on-chain venues, each with its own API, fee schedule, and matching behaviour, and there is no rule forcing a single best-bid-offer. A crypto trading firm therefore has to ingest, normalise, and stitch together market data from every venue it trades to construct its own view of the book — an engineering cost that traditional HFT firms inherit from the market structure for free."
  - question: "Should I build a crypto trading system in-house?"
    answer: "Build in-house only where latency or strategy logic is a genuine differentiator — typically the order-management, risk, and cross-venue execution layers. Buy or use vendor infrastructure for market-data normalisation, connectivity, and historical data unless you trade enough venues that the integration cost is unavoidable. The decision turns on which latency regime your strategy lives in and how many venues you must reach; getting that boundary wrong is one of the most expensive early mistakes a crypto trading CTO can make."
---

> **Short answer.** High-frequency trading in crypto is not traditional HFT with new tickers. Five structural facts rewrite the assumptions before you write a line of code: **markets run 24/7 with no close or maintenance window; liquidity is fragmented across hundreds of venues with no consolidated tape, so you build your own book; settlement splits into two latency regimes — microsecond off-chain matching on centralised exchanges versus block-time settlement on-chain; the on-chain analog of HFT is MEV, an ordering auction rather than a wire-speed race; and the colocation, market-data, and risk plumbing you'd inherit for free in regulated equities is something you assemble yourself.** Which of those matter to you depends entirely on which regime your strategy lives in — and most teams overspend on one while underspecifying the other.

A composite of engagement situations I see often: a founder building a crypto market-making desk, hiring from a traditional HFT background. The team's instincts are good. They talk about colocation, kernel bypass, tail latency, cancel/replace ratios. They have costed a microsecond-grade stack down to the cross-connects. Then I ask which venues they are trading, and how the strategy actually captures its edge.

Half the book is cross-exchange arbitrage on centralised venues — classic, latency-sensitive, and their instincts fit it exactly. The other half is on-chain: arbitrage and liquidations on decentralised exchanges. And for that half, the microsecond stack they have costed buys them almost nothing, because the thing they are racing is not on the wire. It is an auction inside a block.

They had imported a mental model that is correct for one half of their book and actively misleading for the other. The latency they were about to pay for would have won them races that do not exist in the regime where most of their on-chain edge actually lives.

This post is for the founder or CTO building a crypto trading product who knows — or has hired people who know — how HFT works in equities and futures, and is about to discover that crypto microstructure agrees with that model in some places and quietly inverts it in others. The differences are not cosmetic. Each one moves a design decision you make in the stack.

## The five structural deltas

Crypto high-frequency trading differs from traditional HFT on five structural axes — the clock, the venues, the tape, settlement, and the supporting plumbing — and each one changes a decision you make when you build.

| Axis | Traditional HFT (equities / futures) | Crypto HFT |
|---|---|---|
| Clock | Session hours, defined close, maintenance windows | 24/7/365, no close, no window |
| Venues | A handful of regulated exchanges | Hundreds of CEXs plus on-chain DEXs |
| Consolidated view | NMS / consolidated tape, NBBO | None — you build your own book |
| Settlement | T+1, clearing house, post-trade | Off-chain (CEX) vs on-chain block-time |
| Latency floor | Network plus matching engine | CEX: network/engine. On-chain: block time plus consensus |
| Risk plumbing | Standardised, regulated, kill-switches mandated | Self-assembled, uneven across venues |

The numbers in your latency budget matter less than which row your strategy sits in. A strategy that lives in the CEX rows is a latency problem you already know how to solve. A strategy that lives in the on-chain rows is a different problem wearing the same vocabulary. The rest of this post takes the deltas one or two at a time and shows the design consequence of each.

## 24/7 markets break your ops model

Equities and futures markets have a close. That close is load-bearing in ways most engineers never have to think about, because it is where the batch work lives: end-of-day reconciliation, risk recalibration, the deploy window, the cold-start of tomorrow's book. Crypto has no close. The market does not stop, which means none of that work has a quiet window to run in. Reconciliation, deploys, and risk recalibration all happen against a live book or they do not happen at all.

There is a second clock layered on top. Perpetual futures — the dominant instrument in crypto derivatives — use a periodic funding payment between longs and shorts to keep the contract tethered to spot. On major venues that funding typically settles every eight hours; [Binance's default schedule is three fundings a day](https://www.binance.com/en/support/faq/detail/360033525031). That cadence is not a market-hours boundary, but it is a scheduling constraint your risk and position logic has to respect — funding flips can dominate the economics of a held position regardless of where the price goes.

Then there is the weekend. With no close and no circuit breakers on most venues, thin overnight and weekend liquidity produces wider spreads and gap risk that a Friday-close risk model simply does not capture. Your limits cannot assume the market will wait for you.

The design consequence is blunt: zero-downtime deploys and online risk recalibration are not maturity milestones you grow into. They are table stakes from day one. If your [operational architecture](/services) assumes a window to do the dangerous work in, crypto will find that assumption within a week.

## Fragmentation without a consolidated tape

US equity markets run on the National Market System. Regulation NMS forces order protection and a consolidated view — there is a National Best Bid and Offer, and a [consolidated tape](https://www.sec.gov/rules/final/34-51808.pdf) every participant can reference. A traditional HFT firm inherits that single, coherent picture of the market for free.

Crypto has no equivalent. There is no NMS, no consolidated tape, no NBBO, and no rule compelling one. Liquidity is scattered across hundreds of centralised exchanges and on-chain venues, each with its own API, fee schedule, matching quirks, symbology, and rate limits. If you want a coherent view of the market, you build it: ingest every venue you trade, normalise the data — symbols, decimal conventions, fee-adjusted prices — time-sync it, and stitch it into your own consolidated book. This is real, sustained engineering work, and it is work the market structure hands traditional firms at no cost.

That fragmentation is also where a familiar opportunity lives. Cross-venue latency arbitrage is real on centralised exchanges, and it does reward speed. But the subtler point is that on the crypto side the edge is as much in normalisation *correctness* as in raw latency. A price that is fast but wrongly fee-adjusted, or off by a decimal, or stale by one venue's rate-limit window, is a very efficient way to lose money. I have seen more crypto strategies bleed from a normalisation bug than from being a hundred microseconds slow.

The design consequence: market-data normalisation is core infrastructure, not glue code you bolt on at the edges. Decide build-versus-buy here deliberately and early — it is one of the load-bearing choices in the whole stack, and the [systems that survive contact with production](/work) are the ones that treated it as such.

## On-chain versus off-chain: two latency regimes in one strategy

This is the delta that catches experienced HFT engineers, because it hides inside a single firm.

The centralised-exchange side behaves like classic HFT. Orders hit an off-chain matching engine; microseconds matter for queue position, cancel/replace under volatility, and cross-venue arbitrage. The mental model from [my earlier post on latency regimes](/blog/when-you-actually-need-nanoseconds) — that latency lives in regimes separated by order-of-magnitude walls — applies here directly. If your strategy lives on a CEX matching engine, you are in a genuine latency race and the usual playbook holds.

The on-chain side does not behave that way at all. A trade on a decentralised exchange settles on-chain, which means it is bound by block time and consensus finality, not by your network round-trip. Ethereum produces a block roughly every twelve seconds; even a fast chain like Solana targets slots on the order of four hundred milliseconds. Shaving microseconds off your wire path buys you nothing if the settlement still has to wait for the next block. The latency floor is set by the protocol, and no amount of colocation moves it.

Strategies that span both regimes — CEX-to-DEX arbitrage being the obvious one — live across a latency discontinuity. The slow leg dominates the round trip, and the slow leg is always the on-chain one. Designing the fast leg to microsecond precision while the slow leg waits on block time is effort spent on the part of the system that was never the constraint.

The design consequence: identify which regime each strategy lives in *before* you size the infrastructure, and budget latency spend accordingly. Do not pay centralised-exchange latency cost for a block-bound strategy. The expensive version of this mistake is a team that builds a microsecond stack and then runs a strategy whose edge was always going to be decided one block at a time.

## MEV is crypto's on-chain HFT

If on-chain settlement is block-bound, where does the speed game go? It moves inside the block. That is MEV, and it is the single most distinctively crypto thing in this entire post.

[Maximal extractable value, per Ethereum's own documentation](https://ethereum.org/developers/docs/mev/), "refers to the maximum value that can be extracted from block production in excess of the standard block reward and gas fees by including, excluding, and changing the order of transactions in a block." Read that again with HFT eyes and the analogy is exact. The public mempool — the set of pending, broadcast-but-not-yet-included transactions — functions like a visible order book that everyone can watch. Searchers run algorithms over it to spot profitable opportunities, exactly as a traditional firm watches the tape.

The contest, though, inverts the HFT instinct. On-chain you do not win by being first on the wire. You win by bidding correctly and securing ordering position within the block. The original analysis of this — the 2019 paper [*Flash Boys 2.0* by Daian, Goldfeder and co-authors](https://arxiv.org/abs/1904.05234) — named the mechanism a *priority gas auction*: bots competitively bidding up transaction fees to obtain early block position. Today that auction has matured into a builder market. Under proposer-builder separation, [block builders assemble the most profitable block and bid for the right to have a proposer use it](https://boost.flashbots.net/). The participant stack — searchers, builders, proposers — is the on-chain rhyme of the broker-exchange-venue stack you already know.

The strategies rhyme too: arbitrage, liquidations, and backrunning are all recognisable cousins of HFT strategies. What differs is the winning input. In a wire-speed race, the fastest correct implementation wins. In an MEV auction, the best-priced and best-ordered bundle wins, and being a microsecond faster onto the network is worth far less than understanding the auction. This is now a serious enough feature of market structure that [ESMA has published its own analysis of MEV's implications for crypto markets](https://www.esma.europa.eu/sites/default/files/2025-07/ESMA50-481369926-29744_Maximal_Extractable_Value_Implications_for_crypto_markets.pdf) — when the EU's securities regulator writes a paper on it, it has stopped being a curiosity. MEV is deep enough to deserve its own post; the point here is narrower. It is where the on-chain "speed" game actually lives, and it is an auction, not a footrace.

## Where the microseconds actually matter (and where they don't)

Pulling the threads together: crypto puts two latency regimes inside one firm, and the costly errors come from mixing them up.

Microseconds pay on the centralised-exchange side. Matching-engine races, cross-venue CEX arbitrage, cancel/replace under volatility — these are real latency contests, and the [order-of-magnitude-wall framing](/blog/when-you-actually-need-nanoseconds) tells you what each step down costs.

Microseconds do not pay on anything block-bound. On-chain, the floor is consensus, and the contest is MEV — bid and ordering, not wire speed. A team that pays for a microsecond stack to run a block-bound strategy has bought a faster car for a race decided at the toll booth.

Both failure directions are common. One team over-invests in on-chain wire speed that the protocol renders irrelevant; another under-invests in CEX latency while their actual edge erodes a microsecond at a time. The fix is the same in both cases: map every strategy to its regime first, then budget. There is a light regulatory edge here too — algorithmic and high-frequency activity in EU crypto markets now sits inside MiCA's [market-abuse regime](/compliance), and how you log and surveil your own order flow is a design input, not an afterthought.

## What this means if you're building

If you are standing up a crypto trading product, market-making desk, or exchange, the deltas above collapse into a short decision list.

**Map the regime first.** For every strategy, answer one question before you size any infrastructure: which latency regime does it actually live in — CEX-microsecond or on-chain-block-bound? Everything downstream depends on that answer, and it is cheap to get right and expensive to get wrong.

**Be deliberate about build versus buy.** Build the order-management, risk, and cross-venue execution layers, where your edge and your differentiation live. Buy or use vendor infrastructure for market-data connectivity and historical data, unless your venue count is high enough that integration cost forces the work in-house. Market-data normalisation is the one piece of "plumbing" worth treating as core.

**Assume 24/7 from day one.** Zero-downtime deploys, online risk recalibration, weekend-aware risk limits. Retrofitting these onto a system that assumed a maintenance window is a rewrite, not a patch.

**Own your risk controls.** Kill-switches and position limits are your responsibility, not the venue's. Crypto venues do not hand you the standardised, mandated controls that regulated exchanges do. If it is not in your stack, it does not exist.

The thread running through all of it is that crypto microstructure does not let you pick one mental model and apply it everywhere. The same desk runs a microsecond regime and a block-bound regime at once, and the architecture has to hold both honestly. That is the part worth getting right before the build budget is committed, not after.

*If you are building across both regimes and want a second pair of eyes on the architecture before the spend is locked in — someone who has shipped production systems on both sides of the CEX/on-chain line — [that is the work I do](/work). [Get in touch](/services).*

## Sources

- [Maximal extractable value (MEV) — ethereum.org](https://ethereum.org/developers/docs/mev/) — definition of MEV ("the maximum value that can be extracted from block production in excess of the standard block reward and gas fees by including, excluding, and changing the order of transactions in a block"); mempool, searcher, and proposer/builder roles
- [Daian, Goldfeder, Kell, Li, Zhao, Bentov, Breidenbach, Juels — *Flash Boys 2.0: Frontrunning, Transaction Reordering, and Consensus Instability in Decentralized Exchanges*, arXiv:1904.05234 (10 April 2019)](https://arxiv.org/abs/1904.05234) — origin of the priority-gas-auction (PGA) analysis
- [MEV-Boost — Flashbots](https://boost.flashbots.net/) — proposer-builder separation and the block-builder auction
- [ESMA — *Maximal Extractable Value: Implications for crypto markets* (July 2025)](https://www.esma.europa.eu/sites/default/files/2025-07/ESMA50-481369926-29744_Maximal_Extractable_Value_Implications_for_crypto_markets.pdf) — EU regulator analysis of MEV
- [Binance — Introduction to Binance Futures Funding Rates](https://www.binance.com/en/support/faq/detail/360033525031) — perpetual funding settles three times per day (every eight hours) by default
- [US SEC — Regulation NMS, Release No. 34-51808](https://www.sec.gov/rules/final/34-51808.pdf) — the National Market System / consolidated tape baseline that crypto has no equivalent of
- [Regulation (EU) 2023/1114 — Markets in Crypto-Assets Regulation (MiCA)](https://eur-lex.europa.eu/eli/reg/2023/1114/oj/eng) — Title VI market-abuse regime; MiCA fully applicable 30 December 2024
