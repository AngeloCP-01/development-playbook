# DSA Patterns implementation plan

**Goal:** deliver all fifteen selected DSA patterns as a JavaScript study
reference with everyday stories, worked reasoning and local interview practice.

**Architecture:** compose one `Cheatsheet` from content-family modules and reuse
the current `StudySheet`/`TeachingBlocks`/`SheetActivities` renderers and Markdown
generator. Add Algorithms to shared discovery. Execute published snippets through
Vitest data imports, keeping the actual displayed code as the source of truth.

**Stack:** existing Next/React/TypeScript app; literal standard JavaScript lessons;
Vitest and Playwright. No dependency or framework API upgrade.

**Design:** [DSA Patterns study reference](../specs/2026-11-09-dsa-patterns-design.md).
**Sources:** [single research record](../../../reference/dsa-patterns-source-research.md).
Read both, [AGENTS.md](../../../AGENTS.md) and [PATTERNS](../../../web/PATTERNS.md).

**Execution:** one implementer in a fresh user-selected **GPT-6.1 Sol / High**
session; use `superpowers:executing-plans` with D-99's scoped workflow. One
independent final **GPT-6 Astra / Low** review. No per-task agents/review rounds.
Start from the exact committed tip of `docs/2026-11-09-dsa-patterns-research`
after this plan is recorded; create `feat/dsa-patterns-reference`. Research base
is **45ca5f8**; confirm the final documentation SHA from KICKOFF/git before editing.

## Constraints and review focus

- Fifteen core mechanisms plus foundations/mixed practice; eight initial section
  hashes and function/code contracts are in the design. Splitting teaching at a
  measured seam is allowed; shrinking scope to a partial pilot is not.
- Reuse current block types and interactions. Keep thirty other sheet bodies,
  eighteen stages, four placeholders, native resources and dependencies unchanged.
- Final registry: 31 sheets, 27 drawn, Algorithms sixth group, DSA untethered.
  Update actual discovery/count guards; do not merely remove count assertions.
- No source images, new runner/scoring/persistence, standalone algorithm library,
  second maintained prose copy, push or deployment.
- Static prose/data need no artificial red tests. Use TDD for changed behavior
  and reproduced bugs. Observe meaningful failures for new shared discovery and
  DSA rendering; validation of examples must execute actual published code.
- Review duplicate/signed data, endpoint/equality conventions, graph identity and
  cycles, deep inputs and output-sensitive enumeration. Tasks 2/3 own those checks.
- Review every lesson's story-to-code mapping, helper prerequisites, correctness
  and storage claims. Task 4's delivered-page review covers these teaching risks.

## Task 1: register the reference and establish its rendered foundations

**Files:** create `web/src/lib/cheatsheets/dsa-patterns.ts`,
`web/src/lib/cheatsheets/dsa-patterns/foundations.ts`,
`web/src/lib/cheatsheets/dsa-patterns.test.ts`,
`web/src/components/DsaPatternsSheet.test.tsx`; modify
`web/src/lib/cheatsheets/types.ts`, `index.ts`, `index.test.ts`,
`web/src/app/reference/page.test.tsx` and count expectations in
`web/e2e/javascript.spec.ts`.

**Interfaces:** root exports `dsaPatterns: Cheatsheet`, slug `dsa-patterns`, title
`DSA Patterns`, group `Algorithms`, no stage. Each content-family module exports
a named object containing `sections: Section[]` and `activities: SheetActivity[]`
using types from `../types`. Composition is synchronous and side-effect free.
All sections/rows use subsection metadata; the root concatenates family arrays.

- [ ] Add meaningful failing discovery/render coverage against the existing
  registry: Algorithms and its DSA link absent, DSA unavailable as a study page.
  Confirm assertion failures rather than missing-import/tooling failures.
- [ ] Register the sheet/group and compose complete foundations: plain cost
  models, necessary structures/sorting/recursion, and explaining/testing a solution.
  Use no new production components or route-specific Next APIs.
- [ ] Render the actual registered sheet with `CheatsheetView`. Assert visible
  introduction, named trace table with actual cells, literal JavaScript and local
  solution hiding/reveal. Add section reset once a second section exists.
- [ ] Run focused discovery/render tests; preserve existing reference and stage
  partitions. Record truthful interim content status rather than final scope.

## Task 2: author scan, search and candidate lessons with published-code checks

**Files:** create content modules `dsa-patterns/scans.ts`,
`search-and-intervals.ts`, `candidates.ts`; compose them in `dsa-patterns.ts`.
Create `web/src/lib/cheatsheets/dsa-published.test.ts`; extend actual-sheet
data/render coverage.

**Interfaces:** modules export respectively `scans`, `searchAndIntervals`,
`candidates`, each `{ sections: Section[]; activities: SheetActivity[] }`.
Published functions/block IDs follow the design. Code evaluation and independent
oracles live only in the Node-project `dsa-published.test.ts`; import `dsaPatterns`
through Vitest so split TypeScript modules require no custom runtime loader.

- [ ] Author the eight core topics in these three families: four scans, binary
  search/sweep, monotonic stack/heap. Apply the complete lesson contract and
  credited practice links. Show all heap helper code before use.
- [ ] Execute the actual `TeachingBlock.code` and local solution code. Cover
  empty/single arrays where permitted, duplicate positions/ranks, negative/zero
  sums, matching prefixes, duplicate search plateaus, simultaneous endpoints,
  equal/ascending/descending heights and k outside 1..n. Verify input preservation.
- [ ] Compare small deterministic/exhaustive cases with brute force: all pairs,
  all candidate windows/ranges, linear lower bound, explicit interval occupancy,
  backward nearest-smaller scan and sorted selection. Test oracle output/trace
  expectations independently of the implementation's own decisions. Accept any
  valid distinct index pair; require `null` only when no pair exists.
- [ ] Verify at least one meaningful corruption is detected by the published-code
  checks (for example query-after-insert or equal-height comparison); restore it.
  Use focused failures to diagnose the check rather than weakening expectations.
- [ ] Open every delivered topic in render tests and observe actual prose-to-table/
  code/interview composition and each assigned practice answer. Run focused tests.

## Task 3: author nodes, graphs, choices and greedy; complete all content

**Files:** create content modules `dsa-patterns/nodes.ts`, `graphs.ts`,
`choices.ts`, `greedy.ts`; update root composition, actual data/render tests and
`dsa-published.test.ts`. The named exports are `nodes`, `graphs`, `choices`,
`greedy`, with the same family-object interface.

- [ ] Author fast/slow and tree lessons, graph BFS/DFS and Kahn ordering,
  backtracking/DP, greedy/mixed selection. Introduce the necessary structures
  and state meaning before asking the reader to use them. Keep all fifteen topics.
- [ ] Execute published fixtures and solutions: null/self-cycle/repeated values,
  balanced/skewed trees and a deep iterative tree; isolated/disconnected graphs,
  start equals goal, unreachable nodes, cycles/self-loops/shared dependencies;
  repeated letters, amount zero/unreachable/greedy-hostile coins, and interval
  ties/overlap/weighted counterexample. Use iterative deep-graph implementations.
- [ ] Assert BFS paths use actual edges and have independently computed minimum
  length. Accept any valid topological order, reject every directed cycle;
  compare small graphs with an independent ordering oracle. Compare permutations
  as sets with unique output and DP/greedy results with bounded exhaustive search.
- [ ] Validate expected fifteen core topic IDs, unique hashes/blocks/ownership,
  complete shown helper dependencies and at least one credited fitting problem
  per pattern. Assert real rendered table headers/cells, code and practice for
  every section, and answer reset after panel changes. Do not replace those
  observations with string-presence or section-count guards alone.
- [ ] Apply one humanizer editing pass to substantive prose. Keep original problem
  statements/editorials external and local scenarios original. Update source
  findings only when a factual claim or algorithm variant changes.
- [ ] Run focused actual-data/render/published-code checks and generator tests.
  Regenerate `reference/cheatsheets.md` with `pnpm gen:cheatsheets`; confirm all
  thirty existing bodies byte-identical apart from their unchanged index context.
  TeachingBlock code uses the existing plain-code renderer; no highlighting
  generator change is required for these blocks.

## Task 4: browser/development coverage, final gate and independent review

**Files:** create `web/e2e/dsa-patterns.spec.ts`; modify
`web/e2e/dev-console.spec.ts`; extend existing `audit-pages.spec.ts`/
`web/src/lib/reference-audit.test.ts` only where needed for DSA discovery proof.
Use current `audit-pages.ts` and `panel-states.ts` unchanged unless a reproduced
failure demonstrates a defect. Finish task/tracker/KICKOFF after review.

- [ ] Browser test the actual DSA link/category/count, untethered page and sitemap;
  compare declared sections with the built rail and discovered audit hashes.
  Observe every nested topic and solution ID, direct hash loading, Back/Forward,
  keyboard rail navigation, re-collapse/reset and focus below the sticky rail.
- [ ] Extend dev-console's nested-disclosure sweep to DSA hashes alongside the
  existing JavaScript condition. Assert/record observed DSA IDs against authored
  topic/activity declarations so loading a base page cannot masquerade as coverage.
- [ ] Inspect 320/768/1440px and both themes, including code/table keyboard scroll,
  targets, layout and console. Measure each default panel and one-topic-open state
  at 1024×768 with solutions closed against the four-screen budget. Split content
  at a real seam when needed; retain IDs and validate every resulting hash.
- [ ] Execute representative actual published snippets in the real browser:
  hash/window/prefix, heap helper, BFS/topological and DP. Compare expected outputs;
  keep all test execution outside the reader page and production routes.
- [ ] Run the completed-tree gate once from `web/`: `pnpm format:check`,
  `pnpm lint`, `pnpm typecheck`, `pnpm test --maxWorkers=1`, `pnpm build`,
  `pnpm test:e2e --workers=1`; run `pnpm test:dev-console` once. Use supported
  runtime and existing ports/config. Preserve the user's servers; read installed
  Next guides and Context7 before any actual framework API change if one arises.
- [ ] Obtain one independent final **GPT-6 Astra / Low** review of the actual
  branch diff, research/design and running page. Include simple-but-correct
  analogies, all fifteen mechanisms, actual solutions/oracles, complexity costs
  and accessible material states. Resolve blocking findings and rerun only the
  checks later changes invalidate. Preserve limits and failed attempts honestly.
- [ ] Leave a reviewable preview and update task/tracker/KICKOFF with exact SHA,
  source paths, actual commands/counts, fresh versus retained checks, reviewer
  findings and implementation session reference. Return to coordinator
  **01a1bedf-bdad-7b72-ba40-9b5406807d43** for review of the actual diff.

## Recovery and completion

At a session boundary record the feature branch/commit, completed families,
remaining topic IDs, example-check status and any changed section hashes. A green
subset does not complete all fifteen. Do not rerun unchanged full suites merely
to update records. Final delivery requires all four tasks, one independent final
review and a preview; merge into develop requires the user's separate approval.
