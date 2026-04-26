---
title: "When you actually need nanoseconds"
description: "Most software never needs sub-millisecond latency. Some does. The gap between the two is an order-of-magnitude problem, not an optimisation problem — and getting it wrong burns engineering budgets faster than almost anything else a CTO can authorise."
pubDate: 2026-04-26
author: "Samuel Ventimiglia"
tags:
  - latency
  - low-latency
  - real-time
  - architecture
  - industrial
  - go
  - fractional-cto
draft: false
---

A founder I worked with last year ran a single production line at a small industrial manufacturer. The line did one thing well: items came down a conveyor, a fixed barcode scanner read each item's identifier, and a QR-code printer marked the item with a derived traceability code before it left the station window. The pipeline was written in Go. It had been working, quietly and reliably, for three years.

Then procurement bought a new conveyor that moved at twice the speed.

The Go service had four-millisecond median latency on the whole scan-derive-print path and a tail at twenty-three milliseconds when the runtime decided to garbage-collect. At the old line speed, that was fine. At the new line speed, items would clear the print window in seven milliseconds. They had a roadmap meeting on the calendar to plan how to cope. Could I have a look first.

I spent two days reading their code. The Go was fine. The architecture was fine. They had no obvious performance bug. And yet, for what they actually wanted to do next, the system was sitting on the wrong side of a wall — and pretending otherwise would have cost them a quarter of engineering and a missed production deadline.

This post is for everyone who has ever sat in that meeting — the founder, the CTO, the lead engineer who just inherited the problem — and is trying to work out whether the next sprint should profile a hot loop or whether the next quarter should rewrite the architecture. They are different problems. They have different costs. And the question of which you are actually facing rarely surfaces clearly until someone has already spent six months on the wrong one.

## The order-of-magnitude wall

There is a polite fiction that latency lives on a continuum, and that "faster" is the same problem regardless of starting point. It is not. Latency lives in distinct regimes, separated by walls. Each wall is roughly an order of magnitude. Each wall costs you a fundamentally different rewrite to cross.

| Regime | Median latency | What lives here |
|---|---|---|
| Web | 100 ms – 1 s | HTTP APIs, single-region SaaS, traditional banking |
| Real-time-ish | 1 ms – 100 ms | Adtech bidders, live games, streaming, most trading platforms outside HFT |
| Sub-millisecond | 10 µs – 1 ms | Market makers, low-latency matching engines, network appliances, industrial control loops, inline production-line marking |
| Microsecond | 1 µs – 10 µs | HFT, in-memory databases, telco signal processing, machine-vision triggers |
| Hardware-bound | 100 ns – 1 µs | Co-located trading, packet inspection at line rate, kernel modules, EtherCAT and other deterministic fieldbuses |
| FPGA / ASIC | < 100 ns | Pure hardware paths, exchange matching, scientific instruments, real-time vision pipelines |

The numbers themselves are less important than the structure. Each row is a different *kind* of system. Moving down the table is not a matter of tuning the row above. It is a matter of throwing the row above out and rebuilding around different assumptions.

This is the part that usually breaks budgets. A team that built a four-millisecond Python pipeline can, with effort, get to one millisecond by switching to Go and removing some allocations. They cannot get to one hundred microseconds without changing the kernel. They cannot get to ten microseconds without changing the network stack. They cannot get to one microsecond without changing the silicon. Each of those is a separate company, organised around a different set of skills, hiring from a different talent pool, with different operational risks and different ways to get the answer subtly wrong.

## What changes at each wall

If you take only one thing from this post, take this: at each wall, four things flip.

**Language and runtime.** Python, Ruby, JavaScript run out of headroom around the millisecond mark. Java and Go can take you to 100 µs if you keep your hands inside the runtime — no GC pauses, no reflection, no virtual dispatch in the hot path. Below 100 µs the runtime itself becomes the binding constraint and you end up in C, C++, or Rust with manual allocation control. Below 10 µs the language matters less than what you stop the OS from doing on your behalf. Below 1 µs you are no longer programming; you are placing logic gates.

**Memory.** At web latencies, the heap is fine. At real-time-ish latencies, you start caring about allocator choice and GC tuning. At sub-millisecond, you preallocate buffers and avoid the heap on the critical path. At microsecond, you pin pages, lock memory, and make peace with NUMA topology. At hardware-bound, your "memory" is L1 cache and a small static SRAM.

**Inter-process communication.** Sockets work well above 100 µs. Below that, you switch to shared-memory ring buffers — usually single-producer-single-consumer, often lock-free. Below 10 µs, you skip the kernel for I/O entirely: kernel bypass via DPDK, RDMA, or io_uring with polling rings. Below 1 µs, IPC becomes a bus on a board.

**Time itself.** Above a millisecond, NTP is fine. Below that, you start needing PTP — IEEE 1588, hardware-stamped — across your whole network. Below 10 µs, you start adding GPS-disciplined oscillators and TAI-aware scheduling. Below 1 µs, you stop trusting wall-clock timestamps for anything correlative; you use sequence numbers and resolve order causally.

These four things are not a checklist you tick. They are the load-bearing assumptions of the row above. When you knock one out, the others come with it. There is no version of the system where you keep the Python heap and somehow rewrite the language and call that progress.

## How to know if you actually need it

Most teams that ask about nanoseconds do not need them. Some do. The ones that do tend to share three signals.

**The latency is in someone's contract.** A regulator, a venue, a counterparty, an SLA — someone is measuring you in microseconds and writing the number down. If the latency budget exists only inside the engineering team's heads, you almost certainly do not need to drop a regime. You have a *jitter* problem or a *throughput* problem dressed up as a latency problem.

**The arrival rate is bursty and unforgiving.** Trading exchanges send a market-data update every time a single thing happens. So do industrial sensors and telco protocols. If your input is "thousands of independent events per second, each with a deterministic deadline", you are looking at a real-time system, and you cannot bolt real-time onto a queue-based architecture by tuning it. If your input is "a million requests per second, each with a soft target", you have a throughput problem; horizontal scaling solves it cheaply and you should not be reading this section at all.

**There is a measurable counterparty you are losing to.** In any latency-competitive market — HFT, market making, adtech bidding, but also industrial throughput contracts and real-time control loops — the second-fastest implementation loses revenue or loses the contract. If the system you are building has a measurable competitor whose performance is observable — venue tape, RTB win-rate logs, network round-trip, line throughput per shift — then yes, you have a latency problem, and yes, it is probably architectural.

If none of those three signals are present, the answer is almost always *do not chase nanoseconds*. The cost is non-linear and the upside, in absence of those signals, is rounding error.

## The cost

Each regime change roughly multiplies the engineering budget by ten. Not the salary line — the *whole* budget: hires, hardware, observability, failure modes.

The reason is that each regime locks out the next set of off-the-shelf tools. At web latencies you can hire generalists from anywhere and they will be productive on day one with cloud primitives any provider sells you. At sub-millisecond you start needing engineers who know the exact runtime you are using, with experience tuning it; the candidate pool shrinks by an order of magnitude and the salary curve moves with it. At microsecond you need people who have done it before; you cannot train someone into the role inside a year. At hardware-bound you are hiring from a global pool of perhaps a few thousand people, almost all of whom are already employed, mostly by exchanges and HFT firms. FPGA work is a separate trade entirely.

Hardware compounds the same way. A web service runs on commodity instances. A real-time system runs on tuned instances with predictable network performance. A sub-millisecond system needs co-location, dedicated NICs, and the operations team to run them. A microsecond system needs fibre cross-connects, CPU pinning, BIOS-level tuning, and a small infrastructure team that knows what BIOS-level tuning means in practice.

A board considering a regime change is making a *capital allocation* decision, not a sprint-planning decision. The engineering team will tell you what it costs to get one regime down. The next regime down costs roughly ten times that, and the regime after that costs a hundred. There is no smooth curve. Pricing it as if there were is the most expensive mistake I see in this work.

## The pragmatic recipe

If you have read this far and concluded that yes, the system you are building genuinely needs to drop a regime, here is the playbook I have used on every engagement of this shape.

**Profile before you architect.** Always. Until you have a flame graph of where time is going under realistic load, every architectural conversation is hypothesis. The number of teams I have seen rewrite a system in Rust because "Python is slow" only to discover the binding latency was a single misplaced `await` is, in seventeen years, depressing.

**Identify the latency-binding subsystem.** It is almost never the whole system. Usually it is a hot loop, a single hop, a serialiser, a lock. Find it. Write down its current latency budget and its target. If the gap is less than a regime — sub-millisecond starting point, sub-millisecond target — you have an optimisation problem and you should solve it as one. If the gap crosses a regime, you have a rewrite, and you should plan it as one.

**Rewrite only the binding subsystem.** Not the whole stack. Most production architectures that survived a regime change kept the operational shell — provisioning, orchestration, logging, dashboards — intact, and rewrote the hot path inside it. The rewrite is usually small. The discipline to keep it small is the hard part.

**Run them side by side before swapping.** Shadow the new path with the old, compare outputs for a week, swap when they match. This is non-negotiable in regulated work and a kindness everywhere else.

**Set up regression testing as code, not as a vibe.** Latency regression tests, run on every commit, with thresholds that fail the build. If you do not, the gain you fought for will erode within two quarters as features land on top.

## Where this goes wrong

The most common failure I see is not under-engineering. It is over-engineering — a team rewriting in C++ because the founder read about HFT, when their actual customer-facing requirement was 200 ms and they had a perfectly good Go service that hit 80 ms on commodity hardware.

The second most common failure is mid-regime architectures that pretend to be one regime and operate as another. A trading system written in Java with GC pauses of 40 ms cannot honestly call itself sub-millisecond. The 99.9th percentile is what counts, and it lives inside the GC pause, not outside it.

The third is treating the regime change as a one-off project. Once you are in a faster regime, *every change you make* either preserves the regime or breaks it. There is no going back to the old velocity. Hires, code review, deployment, monitoring all have to change to match.

If you are weighing this for the first time and the question is which engineer to hire, what to write in C++, whether to take co-location now or later — get help that has done it. The cost of getting it right with experienced advice is small relative to the cost of getting it wrong without.

---

*If you are sitting in a room having this exact conversation, that is the engagement Cuko Ltd does. [Book a discovery call](/contact) — thirty minutes, no obligation.*
