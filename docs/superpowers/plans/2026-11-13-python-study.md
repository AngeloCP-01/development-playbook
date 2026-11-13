# Python study reference implementation plan

> **For agentic workers:** Use `superpowers:executing-plans` in one fresh user-selected **GPT-6.1 Sol / Medium** implementation session. D-99/D-100/D-110 govern execution: one implementer, no per-task agents/reviews, one independent final **GPT-6.1 Sol / High** content/page/branch review.

**Goal:** teach Python mechanisms deeply enough to explain, predict, implement,
repair and test small programs, using the Node reference's teaching standard.

**Architecture:** compose one canonical Python Cheatsheet from topic-family data;
reuse StudySheet/TeachingBlock/SheetActivity and generated Markdown. A test-only
TypeScript manifest executes actual displayed Python in isolated child processes;
no interpreter or new interaction ships to the reader.

**Tech stack:** existing Next/React/Vitest/Playwright; standard-library Python
3.12+ examples, maintained conventional CPython 3.12 and 3.15 verification.

**Spec:** [approved Python design](../specs/2026-11-13-python-study-design.md),
selected by the user with “looks good to me” on 2026-11-13.
**Sources:** [single research record](../../../reference/python-source-research.md).
Read [AGENTS](../../../AGENTS.md), [web instructions](../../../web/AGENTS.md) and
[PATTERNS](../../../web/PATTERNS.md). Use installed Next guides/Context7 only when
changing framework APIs; established content composition needs no new Next API.

## Global constraints

- Start `feat/python-study-sheet` from the committed plan/handoff tip on
  `docs/2026-11-13-python-study-assessment` (resolve in git/KICKOFF). Design approval
  covers assessment **c6f3986**. Application base **c768af4** is pushed develop.
  Carry assessment/plan records into the feature branch; do not merge to begin.
- `/reference/python`, Python, Languages, no stage tether. Expected **29/31** drawn
  references, **18/18** stages; only Java/Spring Boot stay undrawn. Other thirty
  generated sheet bodies remain byte-identical to c768af4.
- Initial **14 panels / 45 topics / 45 owned activities**, using the spec's IDs.
  Counts may grow at measured teaching seams; preserve depth and document changes.
  At least ten executable coding/repair activities identified in the spec.
- Each topic: prerequisites/model, complete worked program, intermediate reasoning,
  changed-condition contrast, mistake/repair, substantive interview explanation
  and separate transfer practice. Explain unfamiliar syntax before using it.
- Python **3.12+ language/API compatibility**, standard library only, conventional
  GIL-enabled CPython baseline. Qualify build/platform/version-sensitive claims.
  No framework/data-science dependencies, new renderer, highlighting, browser
  runner, scoring, persistence, images, backend or deployment changes.
- Solutions start hidden and can be revealed/re-collapsed/reset using existing
  behavior. Default and one-topic-open panels, solutions closed, fit **3072px at
  1024x768**. Split at teaching seams instead of cutting explanation.
- Preserve servers/scratch. No merge, push or main promotion is authorized here.

## File and interface map

All app paths below are relative to `web/`; records paths are repo-relative.

| Files | Responsibility/interface |
| --- | --- |
| `src/lib/cheatsheets/python.ts` | Export `python: Cheatsheet`; compose families in spec order, citations and activities. |
| `src/lib/cheatsheets/python/{runtime,objects,collections,text,functions,iteration,classes,errors,files,modules,stdlib,async,concurrency,testing}.ts` | Each exports a matching named family (`runtime`, `objects`, etc.) typed `{ sections: Section[]; activities: SheetActivity[] }`. Study IDs follow the spec, independent of filenames. |
| `src/lib/cheatsheets/{planned,index}.ts` | Move only Python from placeholder to registered canonical content. |
| `src/lib/cheatsheets/python-published-checks.ts` | Test-only code traversal, interpreter probe, case materialization and bounded process execution; never import from production data/components. |
| `src/lib/cheatsheets/python-published-cases.ts` | Manifest classifying displayed IDs and runnable multi-file case groups; expectations/assertions, no replacement lesson implementation. Split case families under `python-checks/` if needed. |
| `src/lib/cheatsheets/{python,python-published,python-published-checks}.test.ts` | Content contracts, actual displayed programs/repairs and harness failure/recovery tests. |
| `src/components/PythonSheet.test.tsx` | Registered-page output, meaningful reasoning witnesses and local solution behavior. |
| `src/test/python-disclosures.test.ts`, `e2e/python.spec.ts`, `e2e/dev-console.spec.ts` | Disclosure-completeness sensitivity, focused page/keyboard/layout coverage and explicit development sweep. |
| `.github/workflows/ci.yml`, `web/AGENTS.md` | Provision interpreters for tests; document runtime selection/provisioning. No new runtime dependency in the deployed app. |
| `reference/cheatsheets.md`, `KICKOFF.md`, `docs/{task,tracker}.md` | Generated content and concise recovery/completion records. |

## Review focus

Each risk has an assigned check below; these are likely blind spots beyond syntax.

1. A new code block or repair is unclassified, or a manifest ID points at the wrong
   displayed block: reject missing, duplicate and stale locations (Task 1/5).
2. A nested alias survives an apparent copy or a default is shared across calls:
   prove isolation on nested inputs and contrast intentional sharing (Task 2).
3. A lazy iterator is exhausted or its file closes before consumption: verify a
   second traversal and both normal/error resource ownership (Task 3).
4. Async/thread/process failure leaves work alive: assert cancellation/cleanup,
   fixed capacity and descendant termination without scheduler luck (Task 4).
5. Passing data tests hide missing page reasoning or undiscovered solutions:
   independent rendered witnesses and omitted-disclosure sensitivity (Task 5).

## Task 1: bounded Python checker and reproducible runtime selection

**Files:** `python-published-checks.ts`, its test; `.github/workflows/ci.yml`,
`web/AGENTS.md`. Do not register an empty in-progress Python study sheet yet.

**Interfaces:** `collectPythonLocations(sheet: Cheatsheet)` returns
`{ id: string; code: string; location: string }[]`, including section introductions,
row teaching/legacy examples and activity starters/solutions. Use the existing
Express collector's ID convention; avoid importing its Node-bound module.
`probePython(executable: string)` returns a Promise with executable, version,
implementation and build metadata. Select `PLAYBOOK_PYTHON` or default `python3`;
nonexistent interpreter, incompatible Python (<3.12) or unsupported implementation
must fail with an actionable error. Record exact patch/build; provisioning a
maintained patch is an explicit acceptance step, not an offline guessed check.

`runPythonCase(options: PythonCase): Promise<PythonRun>` consumes:
`sheet: Cheatsheet`, `files: Record<relativePath, displayedBlockId>`, `entry: string`, optional
`fixtures: Record<relativePath, string>`, optional separately labelled test-only
`checks: Record<relativePath, string>`, `checkEntry?: string`, `args?: string[]`,
`exit?: number`, `module?: string` (use `-m module` instead of executing entry
directly; entry must still identify the displayed module file). `checkEntry`
selects a test-only assertion script that imports the displayed functions; it is
mutually exclusive with module mode. Module/startup-order examples run their real
entry directly. Checks may assert behavior but never replace the taught function.
Return stdout/stderr/status and probed runtime. Fixtures/checks cannot overwrite
published files or provide the mechanism/repair being taught.

- [ ] Write meaningful harness tests first: missing interpreter, invalid entry,
  unknown displayed ID, duplicate classification, path escape/collision,
  wrong exit/stderr and a hung child with a live descendant. Use tiny synthetic
  Cheatsheet fixtures, not another Python lesson. Observe actual failures.
- [ ] Implement argument-array execution with `shell: false`, temporary cwd,
  explicit Python path, no inherited user Python path/startup configuration
  (`-E -s -B`, not `-I`, which would hide sibling example modules). Allow safe
  nested file paths for packages, reject traversal/absolute paths and collisions.
  Keep parent environment needed to launch the explicit interpreter.
- [ ] Bound children at 8 seconds, captured output at 1 MiB; execute each in its own
  POSIX process group (Mac/Linux local/CI), terminate descendants in finally on
  failure/timeout and escalate to kill after a 1-second grace period. Give these
  new runtime tests a 15-second outer test limit so the child budget and cleanup
  can finish; keep all existing test/audit limits unchanged. Diagnose
  resource failures before changing limits. Explicitly document checker host
  support; displayed spawn examples remain portable without a Windows checker claim.
- [ ] Prove timeout/overflow/failure cleanup with PID/handshake evidence and temp
  removal, plus successful multi-file imports and intentional-error matching.
  Successful cases require exit 0 and empty stderr unless a specific expected
  warning is part of the lesson. An intentional failure must match its stated
  exception/result, not merely exit nonzero. Confirm RED then GREEN.
- [ ] Add `actions/setup-python@v7` to existing verify before tests, selecting
  `python-version: '3.12'`, `check-latest: true`; pass its `python-path` output as
  `PLAYBOOK_PYTHON` for tests. Existing checkout/node actions stay unchanged.
  In Task 5, add a focused `python-examples` job, `strategy.fail-fast: false`, string matrix
  `['3.12', '3.15']`, same explicit interpreter output and frozen pnpm install,
  running only the checker and published-example tests after they exist.
  Do not duplicate the full app suite per version or skip Python from normal tests.
- [ ] Document local interpreter selection/provisioning and exact version reporting
  in web/AGENTS; use the writing-for-agents skill for that implementation edit.
  No install during test execution. Obtain maintained patch runtimes before release
  validation; local 3.12.7 alone cannot establish that acceptance requirement.
- [ ] Run focused checker tests. Inspect CI YAML against official source inputs
  recorded in the research register; actual hosted CI remains unclaimed until run.
  Commit the checker/runtime slice once coherent; do not commit a dangling CI command.

## Task 2: core language and object teaching

**Files:** families `runtime`, `objects`, `collections`, `text`, `functions`;
`python.ts`, registry/placeholder, `python.test.ts`, `PythonSheet.test.tsx`, manifest.
**Produces:** first 17 spec topics and their exclusively owned activities; the
full `python` export is composed incrementally, never by copying literal content
into components, Markdown or test implementations.

- [ ] Author core lessons in spec order, showing definitions before syntax-dependent
  specimens. Port the copying specimen into canonical data with its intermediate
  table and changed-condition contrast. Include complete worked examples for
  defaults, lexical scope/UnboundLocalError, closure capture/decorator return,
  hash/equality, slicing, Unicode/bytes and numeric boundaries.
- [ ] Add actual-code expectations for every authored block. Assert nested-copy
  isolation, two calls/two independent defaults, meaningful None/falsey inputs,
  closure capture of mutable versus immutable state, unhashable keys, stable
  equal-key sorting and negative division. Qualify cost/float claims from sources.
- [ ] Add a meaningful render test that finds the copy trace and its causal
  explanation independently of mapping over source strings; exercise a registered
  section, open the topic and reveal/re-collapse its local solution. Use failing
  render coverage for new output, not artificial failures for literal prose edits.
- [ ] Register Python when the first coherent content and manifest cases are ready.
  Keep 31 registered sheets; intermediate drawn totals become 29, remaining families
  follow before delivery. Check no legacy placeholder survives, and update actual
  drawn-count guards rather than weakening them.
- [ ] Run focused data/render/published tests, regenerate Markdown when needed and
  measure the longest names/objects and function topics early in the running page.
  Commit a coherent core-language slice; record measured splits/IDs in the design.

## Task 3: iteration, object protocols, cleanup and reusable programs

**Files:** families `iteration`, `classes`, `errors`, `files`, `modules`, `stdlib`;
composer, manifest/cases, data/render/published tests.
**Produces:** next 19 spec topics with local activities (36 total so far).

- [ ] Teach iterator creation/consumption/exhaustion and generator suspension with
  stepwise state; contrast materialization with a fresh-iterator factory. Teach
  class/instance attributes, bound methods, super/MRO, special methods, dataclasses
  and static typing before the record-processing examples depend on them.
- [ ] Teach specific error propagation/else/finally/chaining, with cleanup/suppression,
  files/encoding, JSON parse versus domain validation, bounded streaming and explicit
  file ownership. Show import/package/main contexts with all required files, a cycle
  symptom and repair, then environment/dependency boundaries. Add Counter/deque/heap/
  bisect selection with real intermediate structures and qualified costs.
- [ ] Classify and execute every new code location and repair. Include iterator second
  traversal, early termination while a file is open, body/parse failure cleanup,
  invalid JSON versus wrong shape/domain, dataclass field isolation/frozen child
  mutation, annotations accepting wrong types, package -m versus script context,
  import side effects/caching, heap ties and bisect insertion boundaries.
- [ ] Exercise the harness module-mode contract with a meaningful failing test
  before implementing that branch. Never manufacture successful imports by injecting
  a hidden implementation or altering displayed code.
- [ ] Add independent rendered witnesses for lazy-consumption and error-cleanup
  reasoning. Run focused checks and measure long iteration/resource lessons before
  further composition. Commit the coherent program/resource slice.

## Task 4: async, shared work and the tested report capstone

**Files:** families `async`, `concurrency`, `testing`; composer, manifest/cases,
actual-code/data/render tests.
**Produces:** final nine spec topics, completing 14 panels/45 topics initially.

- [ ] Teach coroutine creation versus await/task scheduling, TaskGroup ownership,
  ExceptionGroup/sibling cancellation, cleanup and propagation; contrast blocking
  work and to_thread without implying cancelled await stops its running thread.
  Implement fixed-worker/bounded-queue teaching, not unlimited task creation behind
  a semaphore. State which await actually suspends in each trace.
- [ ] Teach threads/processes/GIL with build/version qualifications, explicit lock
  ownership and a deterministic lost-update witness. Process examples use real
  files, importable worker functions, guarded entry and explicit spawn context.
  Explain serialization/startup costs without timing-based speed claims.
- [ ] Provide unittest examples and a complete local report capstone with validation,
  streaming, grouping and deterministic display; cover empty/malformed/duplicate
  records and a changed memory/concurrency requirement. Every needed helper is visible.
- [ ] Add actual-program cases proving partial order, cancellation/finally, sibling
  failure cleanup, fixed work/task bounds, thread stop ownership, lock repair and
  process failure/exit cleanup. Include direct repair-solution failure cases, not
  only a second teaching example with similar behavior. Diagnose before widening
  timeouts or accepting a changed expected result.
- [ ] Confirm all 45 topics have owned activities and at least ten genuine executable
  code repairs. Run all Python checks on maintained 3.12 and 3.15; record patches,
  platform/build and mismatches. Add the independent rendered async-ownership witness.
  Commit the coherent concurrency/capstone slice.

## Task 5: complete page coverage, generated content and delivery evidence

**Files:** `python.test.ts`, manifest/checker tests, `PythonSheet.test.tsx`,
`src/test/python-disclosures.test.ts`, `e2e/python.spec.ts`, `e2e/dev-console.spec.ts`,
applicable registry/reference guards, generated Markdown and project records.

- [ ] Enforce exact code-location classification: all displayed teaching/start/solution
  IDs once, no stale owners, reasons for command/config/interface fragments. Main
  worked paths and coding solutions must execute. Omitted/duplicate/stale ID fixtures
  must fail; consider one wrong-copy, eager-consumption or missing-cleanup mutation
  for consequential oracle sensitivity. Do not mistake type/count tests for teaching.
- [ ] Add the focused Python CI matrix specified in Task 1 now that published tests
  exist. Confirm both matrix legs run all displayed Python checks, with no skipped
  runtime failures and no entire-app duplication. Actual hosted results need a PR
  run; report local verification separately if no hosted run is requested.
- [ ] Extend dev-console branch selection with Python and assertStudyDisclosures.
  Add a direct omitted-topic/solution sensitivity test, preserving Express/DSA checks.
  Audit page discovery already derives study hashes from the registry; change only
  where real focused failures show missing Python coverage.
- [ ] Add focused browser traversal of all Python hashes/topics/solutions in both
  themes at 320/768/1440, checking readable code/tables, keyboard reveal/reset,
  history/back/forward, touch targets, console and overflow. Check default and each
  single-topic-open panel at 1024x768 against 3072px. Keep named prerequisite links
  useful. Record all splits; do not weaken height/completeness assertions.
- [ ] Regenerate `reference/cheatsheets.md` with `pnpm gen:cheatsheets`; compare the
  other thirty generated bodies to c768af4. Confirm 29/31 drawn, 18/18 stages and
  unchanged highlighting artifact. Apply humanizer to substantive teaching prose.
- [ ] Run the final gate once on completed source: `pnpm format:check`, `pnpm lint`,
  `pnpm typecheck`, `pnpm test`, `pnpm build`, `pnpm test:e2e`; run
  `pnpm test:dev-console` once. Use PLAYBOOK_PYTHON for real tests. Record final
  commit/tree, actual commands/counts and any focused diagnosis/rerun limits.
  Do not run deployment-only test:prod for this feature.
- [ ] Obtain one independent **Sol High** review of the actual diff/source/page and
  the spec's eight transfer tasks. Resolve blockers; rerun checks invalidated by
  fixes. Present live names/objects and asyncio lessons for reader depth assessment.
  Do not label the review a learner study or interview-success evidence.
- [ ] Update one concise tracker completion row, task and short KICKOFF. Report branch/
  commit, exact runtimes/results/limits, review provenance and implementation session
  reference to coordinator **01a1d36c-4998-7d31-91c4-6b41e9694eba**. Keep prior checks tied to their trees.
  Request separate approval before no-ff integration into develop; main is user's.

## Recovery and completion

At each coherent slice record the last commit, completed task checkboxes, remaining
families/case IDs, runtime paths and important failing command/reason in task/KICKOFF.
Do not repeat full gate runs per task or create per-task review reports. Resume by
checking git status/diff and reading the current records, design and remaining
plan items. Leave unrelated work untouched.

Plan self-review: all design sections map to Tasks 1–5; matrix/runtime selection,
canonical data, coverage, meaningful output tests, measured layout and final teaching
review have owners. Existing interfaces remain unchanged. This document is a plan,
not evidence that Python examples, CI or the delivered page already pass.
