# Node fundamentals depth implementation plan

**Execution:** one fresh user-selected **GPT-6.1 Sol / Medium** implementer using
`superpowers:executing-plans`, D-99/D-100/D-110. One independent final
**GPT-6.1 Sol / High** content/page/branch review. No per-task agent/review rounds.

**Goal:** teach Node's execution and resource model thoroughly enough to explain,
predict and repair programs before applying those ideas to Express.

**Architecture:** extend the existing canonical Node/Express sheet and its
Node-process published-code checks; reuse current study/teaching/activity UI and
Markdown generator. Preserve all NE-R1–NE-R6 fixes. No product code runner.

**Stack:** existing Node22.23.4, exact dev-only Express5.3.0, Vitest/Playwright;
no new dependency or runtime/framework upgrade.

**Design:** [Node fundamentals depth](../specs/2026-11-10-node-fundamentals-depth-design.md).
**Sources:** [one research record](../../../reference/node-express-source-research.md),
including the depth audit, NF sources and coordinator design-probe evidence.
Read [AGENTS](../../../AGENTS.md) and [PATTERNS](../../../web/PATTERNS.md).

Start on **feat/node-express-study** at the exact committed design/handoff tip
in KICKOFF/git. Documentation starts from **49a101b**; application baseline is
**e852170**, accepted six-fix review recorded as **e3dac11**. Keep branch name.
Do not restore older twelve-panel/38-topic limits from the original plan.

## Global constraints and review focus

- `/reference/express`, title/group, 28/31 references and 18/18 stages stay.
  Preserve thirty other generated sheet bodies, existing twelve hashes and all
  38 topic IDs. Three new panel hashes and eleven new topic IDs start at 15/49.
  `scheduling` moves into `event-loop`; document its changed disclosure prefix.
- Teach all selected foundations; topic count is not the completion criterion.
  Keep at least six actual coding/repair activities with executable solutions.
  The changed panel introductions and trace cells must explain their reader task
  and intermediate state rather than repeat boilerplate/definitions.
- Preserve corrected ESM/CJS files, filtering/pagination, CSRF trace, ID guards,
  parser mutation and SIGTERM drain/cleanup tests. Express/security teaching is
  retained; no auth/DB service or new backend is selected.
- Context is part of each scheduling claim: CJS/ESM entry versus callback or
  active microtask checkpoint. No universal FIFO, observed-timing proof or test
  requiring both permissible top-level timer/immediate orders to occur.
- Child/Worker/file/stream fixtures need error ownership, bounded execution and
  guaranteed cleanup. Do not let the test harness's IPC handle fabricate liveness
  for a lesson meant to demonstrate natural process exit.

## Task 1: runtime, complete event-loop lesson and async control

**Files:** modify `web/src/lib/cheatsheets/express/runtime.ts`, `async.ts`,
`express.ts`; create `web/src/lib/cheatsheets/express/event-loop.ts`;
extend `express.test.ts`, `web/src/components/ExpressSheet.test.tsx` and published
Node tests. New content family exports `eventLoop` with the existing
`{ sections: Section[]; activities: SheetActivity[] }` interface.

- [ ] Add a meaningful failing actual-sheet render test for the phase-purpose
  map and connected I/O/queue walkthrough; observe absent required teaching,
  not a missing import. Keep prose edits free of artificial TDD requirements.
- [ ] Add fitting primary citations from the NF source record to the canonical
  sheet Sources area (event loop, work allocation, decoder/streams/process). Keep
  the full research/provenance in its one record.
- [ ] Rewrite runtime's three topics with layer ownership and contrasting sync/
  async examples. Use the design's full event-loop specimen as the minimum depth,
  not an output-only snippet. Explain stack/native work/ready callback states.
- [ ] Add `event-loop` with `event-loop-phases`, `timers-and-immediates` and moved
  `scheduling`. Preserve original topic/activity IDs for scheduling. Show the
  phase-purpose map, supported-version caveat, I/O context, CJS/ESM entry contexts
  and nextTick-created-inside-Promise counterexample. Keep starvation finite.
- [ ] Add `callbacks-to-await`; deepen `promise-control` and `events-and-cleanup`
  through callback/Promise/await forms, matched error channels and listener
  ownership. Give callback bridge, bounded work and listener cleanup activities
  actual starters/contracts, executable repairs and explanatory solutions.
- [ ] Execute actual authored programs in their stated files/contexts. Assert
  the successful I/O trace, both module-entry traces and nested-microtask trace.
  Accept either top-level timeout/immediate ordering subject to guaranteed
  relations. Do not use a timing loop to try to prove nondeterminism.
- [ ] Measure the event-loop panel and one open lesson at 1024×768 early. If its
  teaching exceeds four screens, split at the model/example handoff and record
  new hashes rather than shorten the explanation. Run focused render/code checks.

## Task 2: real work allocation, byte/stream mechanisms and process lifetime

**Files:** create `express/workers.ts` exporting `workers` and `express/process.ts`
exporting `processLifetime` (family objects, not Node imports); deepen `express/io.ts`
and `http.ts`; compose in `express.ts`; extend actual data/render/code checks.

- [ ] Add `work-and-workers`: `io-and-worker-pool`, `worker-threads`,
  `process-isolation`. Show a finite CPU callback, real async I/O, a small two-file
  Worker job and an isolated child. Compare where work runs, state ownership,
  messages, errors and cleanup; do not infer speedup or pool internals from time.
- [ ] Deepen buffers and files; add `incremental-decoding` and
  `manual-backpressure`. Show split UTF-8 decoding wrong/correct, bytes versus
  record framing, callback/promise fs success/failure and explicit path cleanup.
- [ ] Show controlled write(false)/release/drain and a separate pipeline path.
  Assert each accepted chunk appears once, production pauses until allowed,
  source/destination errors reach the owner and abort releases resources. Cover
  close/error while waiting; never await only a drain that cannot occur.
- [ ] Add `process-and-memory`: `handles-and-exit`, `retained-references`,
  `node-error-channels`. Use standalone children without test-owned active IPC
  for natural exit cases. Compare an ordinary pending Promise, a referenced
  timer and unref. Explain top-level-await differences if shown.
- [ ] Demonstrate listener/Map retention and idempotent removal with visible
  ownership counts. Explain stack/heap/references without pretending counts
  prove collection. No required RSS reduction, forced-GC test or finalizer timing.
- [ ] Add actual coding solutions for worker messaging, incremental decoding and
  manual backpressure (six coding/repair activities across tasks1/2 minimum).
  Test inputs, failures and cleanup from the displayed solutions themselves.
- [ ] Deepen `raw-http` with the request/body/response walkthrough and tie its
  events to the execution model. Preserve existing HTTP contracts and NE-R fixes.
  Keep the eight HTTP/Express/data/security/test/operations panels after the seven
  Node foundations panels, in the design's explicit order.

## Task 3: actual-code coverage, generation and teaching-sensitive checks

**Files:** extend `web/src/lib/cheatsheets/express-published.test.ts`; create
`express-foundations-published.test.ts` and a small test-only
`express-published-checks.ts` helper if separation is needed. Extend
`express.test.ts`, `web/src/components/ExpressSheet.test.tsx`,
`web/src/test/express-disclosures.test.ts`; regenerate `reference/cheatsheets.md`.

**Interfaces:** code lookup stays keyed by actual teaching/activity block ID.
Where needed, share `collectPublishedLocations(sheet)` (ID/code/location records)
and a bounded Node file-group executor between the existing and new test files.
The executor consumes literal displayed files, a declared entry/context and
test-owned assertions. It is a small test utility, not a general runner/framework.
New scenarios may be owned by a dedicated foundations test file; every code
location still belongs to exactly one executable/explicit-fragment classification.

- [ ] Test new manifest/file-group capabilities with meaningful missing-file or
  unclassified-code failures before implementation. Ensure moving Node cases to
  another test file cannot silently skip them in both places or route them into
  an HTTP makeApp wrapper. No parallel maintained solution implementation.
- [ ] Cover every new or rewritten worked program, helper and coding solution.
  Preserve multi-file module and SIGTERM protocols. Verify Worker/child result,
  error and cleanup; stream/decoder/state contracts; partial scheduling orders.
- [ ] Test the trace oracle against each permitted top-level timer/immediate
  order and violations of guaranteed edges. The actual nested-microtask example
  must reject a naive global nextTick-first prediction. A producer that retries
  the chunk after false,
  or skips listener cleanup, must fail the applicable independent observation.
  Do not expect a valid ambiguous trace to fail solely because it differs from
  the last machine's output. Restore deliberately corrupted source after checks.
- [ ] Guard the exact required original/new topic IDs and preserved hashes plus
  declared new hashes, unique ownership and presence of the six coding solutions.
  Update literal total guards truthfully if measured splitting adds content.
- [ ] Render real phase/queue/byte/backpressure cells, literal files and transfer
  reasoning. At least one expected intermediate state per new panel is asserted
  independently of composed data. Exercise reveal/re-collapse and panel reset.
- [ ] Update omission tests to include every new hash/topic/solution; retain the
  actual dev-console helper's Express/DSA integration and JS traversal.
- [ ] Apply humanizer to substantial prose. Regenerate via `pnpm gen:cheatsheets`;
  compare thirty other bodies unchanged. Run focused actual-code/data/render/
  disclosure/Markdown checks; record precise contexts and failures, not only counts.

## Task 4: delivered-page checks, teaching-depth review and handoff

**Files:** extend `web/e2e/express.spec.ts` and data-driven tests where needed;
update the source evidence, task/tracker/KICKOFF at completion. No new production
renderer or shared navigation behavior is planned.

- [ ] Verify every old/new hash, all nested examples/solutions and direct-link/
  Back/Forward/keyboard navigation. Check both themes, 320/768/1440 and code/table
  scrolling; measure default and one-topic-open states at 1024×768 unchanged budget.
  Keep summaries useful and reading order clear on the longer rail.
- [ ] Run the completed-tree gate once: `pnpm format:check`, `pnpm lint`,
  `pnpm typecheck`, `pnpm test --maxWorkers=1`, `pnpm build`,
  `pnpm test:e2e --workers=1`, and development-console once. Preserve servers;
  document and remove temporary configs. Diagnose any failure without weakening
  assertions/timeouts. Retain old evidence only for identified unchanged inputs.
- [ ] Obtain one independent final **GPT-6.1 Sol / High** review of the actual
  source/page/branch. Require the design's six transfer tasks and page evidence
  for prerequisite explanations and changed-case reasoning. Presence of a table,
  valid output and green suites cannot substitute for this depth assessment.
- [ ] Resolve blockers and rerun checks invalidated by later edits. Leave a live
  event-loop lesson for the user's depth assessment; do not recommend integration
  based solely on mechanical test completion or claim a learner study.
- [ ] Record exact branch/application/records commits, old/new hashes, actual
  Node/Express versions, commands/counts/exits, review findings/limits, fresh versus
  retained checks and implementation thread. Return to coordinator
  **01a1bedf-bdad-7b72-ba40-9b5406807d43**, recommended **GPT-6.1 Sol / High**.

## Recovery

At a session boundary record completed families, remaining topic/example IDs,
fixture contexts, manifest status and teaching-depth gaps. Keep partial work
explicit; do not call the redesign complete while the event-loop mechanism is
still only a definition/one-line trace. Preserve the unrelated `.pnpm-store/`.
No merge/push/promotion. Other language sheets and deep engine/distributed-system
internals remain deferred.
