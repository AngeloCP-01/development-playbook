# Kickoff: strengthen Node.js fundamentals before integration

Updated 2026-11-10. Follow [AGENTS.md](AGENTS.md), D-99/D-100/D-110.
Reader feedback after **e3dac11**: Node.js fundamentals, especially event-loop
teaching, are too shallow. **Integration is on hold for teaching revision.**
NE-R1–NE-R6 remain closed; their technical acceptance is retained as evidence,
while broader reader acceptance is reopened (D-111).

Next task: reassess and redesign Node core teaching using **GPT-6.1 Sol / High**.
Start with the [depth audit](reference/node-express-source-research.md#reader-feedback-node-fundamentals-depth-2026-11-10).
Cover runtime architecture, a full event-loop walkthrough, queues/timers, async
I/O versus CPU work, worker/process choices, events/streams and resource lifetime.
Use connected explanations, contrasting worked examples and transfer practice.
The old twelve-panel/38-topic count is not a ceiling. No new implementation scope
or code is delivered by this feedback record. Implementation later uses a fresh
user-selected **GPT-6.1 Sol / Medium** session.

The following records the earlier correction acceptance, not readiness to merge.

Branch **feat/node-express-study**. Coordinator accepted correction **e852170**,
reviewed **fa724bb...e852170**, handoff **b2c1cdc**. No merge/push/promotion.
All six P2s were closed at that review; the new fundamentals-depth concern
is separate and remains open.

Feature totals: **12 hashes / 38 topics / 38 activities**, **28/31** references,
**18/18** stages. Develop remains **27/31** pending approved integration.

NE-R1 now demonstrates actual ESM exports/live bindings, CJS exports/cache and
partial cycle state in six displayed files. NE-R2/R5 define and test filter-first,
stable bounded pages and invalid/repeated/unknown/nested query inputs; the parser
mutation is caught. NE-R3 explains cookie attachment, unreadable mutation and
accepted/missing/other-session synchronizer tokens in a sourced protocol trace.
NE-R4 checks Express observed IDs, with every missing topic/solution rejected.
NE-R6 observes readiness, in-flight work, draining, response completion, dependency
cleanup and exit; immediate exit without cleanup fails. Existing lifecycle guards
remain. No new backend/authentication system or browser-CSRF proof is claimed.

Fresh coordinator checks: **87 tests / 5 files**, exit 0, published-code/data/
render/disclosure-guard/Markdown; thirty other generated bodies unchanged. Live
light320 modules, dark768 CSRF and light1440 list: keyboard topic opening and code
focus, solutions hidden/revealed/re-collapsed, themes correct, zero overflow,
console warnings or page errors. Source/diff and actual page match the fixes.

Retained identified **e852170** checks, verified in implementation thread/raw logs:
format/lint/generated-route typecheck/build, **1779 tests / 241 files**, full
production browser **52/52**, dev-console **1/1**. Full production took 12.1m.
The documented temporary dev-console config targeted the existing port 3200 dev preview
without changing checked-in config or taking the user's other server. Earlier
artifact-race failures were rerun after build settled; no weakened assertions or
timeouts. No new full gate for acceptance records; application/generated tree
matches reviewed **b2c1cdc** exactly. Historical failures/limits remain in tracker
and source research. Closing records: ledger **2/2**, six local links and whitespace checks, all exit 0.
Humanizer editing pass applied to the acceptance handoff.

Integration decision is deferred until the fundamentals teaching revision is
reviewed. AGENTS requires separate user approval before a no-ff merge into develop.
Nothing is merged or pushed by this feedback record.

[Design](docs/superpowers/specs/2026-11-10-node-express-design.md),
[plan](docs/superpowers/plans/2026-11-10-node-express.md),
[sources](reference/node-express-source-research.md),
[task](docs/task.md), [tracker](docs/tracker.md).
Implementation thread **01a1c38c-5adb-7540-b46d-9638153021bc**; coordinator
**01a1bedf-bdad-7b72-ba40-9b5406807d43**.
Preview: http://localhost:3200/reference/express. Preserve the unrelated untracked
`.pnpm-store/`; keep it out of commits. Python, Java, Spring Boot and advanced
Node/Express follow-ons remain separate.
