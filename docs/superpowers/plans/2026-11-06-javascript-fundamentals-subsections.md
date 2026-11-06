# JavaScript fundamentals and subsections implementation plan

**Goal:** deliver all six selected content additions in eight main sections with
expandable subsections and local activities.

**Architecture:** extend existing row metadata and the checked study resolver;
compose subsections with RevealList and keep the current activity contract.
One typed source produces the page, examples and nested Markdown.

**Stack:** existing Next.js 16 / React 19 / TypeScript / Vitest / Playwright;
Node 22.23.4 for strict CJS and separately labelled ESM examples.

**Design:** [selected scope, contracts and acceptance](../../../reference/javascript-source-research.md#all-six-additions-and-subsections-selected-2026-11-06).

**Execution:** one implementer in a fresh **GPT-6.1 Sol / High** session under
D-100, using executing-plans. D-99 behavior TDD and one independent final review;
no per-task agent or review ceremony is required.

## Starting point and constraints

- Research tip **76119c2**, accepted app **322c873**. Start from this design's
  committed tip, record its exact SHA and create `feat/javascript-fundamentals-subsections`.
- Keep `/reference/javascript`, the seven existing main hashes plus new
  `modules`, **26/30** drawn sheets, **18/18** stages and existing dependencies.
- Preserve the four original closure/copy/async/scheduling activities. The
  selected topic table proposes fourteen activities, with 1–2 per main section.
- Other 29 generated sheet bodies, ordinary-sheet rendering and legacy study
  behavior remain unchanged. No browser code execution or saved/scored progress.
- Use Node **22.23.4**, pinned pnpm **10.33.0**. The task-local Corepack wrapper
  in `/private/tmp/w631a-bin/pnpm` is available if normal pnpm resolution fails.
- Read PATTERNS/DESIGN and relevant installed framework guidance before API edits.
- All new concepts retain their primary-source mapping in the existing research
  record. Module code runs as actual `.mjs`, without changing CJS example semantics.
- No merge, push or promotion; integration needs separate user approval.

## Review focus

- Partial/ambiguous metadata must fail clearly rather than lose or duplicate
  activities; legacy and ordinary sheets remain compatible (task 1).
- Nested reveal controls need correct headings, stable IDs and reset behavior;
  hidden solutions must never leak after main-section navigation (task 2).
- Tests/audit must reach child controls that do not exist until a parent opens,
  including keyboard focus and code scrolling below the sticky rail (tasks 2–4).
- Empty/duplicate/falsy inputs, failure cleanup and collection-cost assumptions
  must match the explanation; examples must come from actual authored fields (task 3).
- ESM examples must fail for the intended import error and then run correctly
  in their own context, without stale/missing fixtures masking the result (task 3).

## Task 1: subsection data and portable traversal

**Files:** `web/src/lib/cheatsheets/types.ts`, `study-sections.ts`, `render.ts`,
`render-activities.test.ts`, `index.test.ts`, existing generator snapshot tests.

**Interfaces:** optional `Row.study: { id: string; summary: string;
activityIds: string[] }`; optional `Section.study.activityIds` for subsection
mode only. `studySections(sheet): StudySection[] | null` adds optional resolved
subsections with their local activities. The design defines the two exclusive
assignment modes and all guards; legacy mode retains the existing list.

- [ ] Observe missing-behavior failures for a valid nested fixture's order and
  local activities, partial row metadata, conflicting assignment modes, orphan
  row metadata, unsafe/duplicate subsection IDs, blank summaries/titles and
  missing/duplicate/unassigned activity references.
- [ ] Implement checked resolution and nested Markdown headings/order. Preserve
  literal summary/code text and safe code fencing. Include examples and every
  activity field once, with no duplicate section-bottom practice.
- [ ] Confirm focused tests pass, legacy study and ordinary sheet output remain
  stable, and the generated structure supports main h3/subsection h4/Practice
  h5/activity h6 without invalid heading depths.

## Task 2: accessible nested teaching and regression protection

**Files:** `web/src/components/StudySheet.tsx`, `SheetActivities.tsx`,
`RevealList.tsx` and their meaningful render tests; `JavascriptSheet.test.tsx`,
`web/e2e/javascript.spec.ts`, relevant audit helpers/tests and `web/PATTERNS.md`.

**Interfaces:** optional `RevealList.headingLevel` defaults to 3;
`SheetActivities.headingLevel?: 2 | 4` defaults to 2 and selects solution level
3 or 5. Subsections use existing RevealRow summary/title/body slots. No new
Stepper history model or URL fragment syntax.

- [ ] Observe render failures for visible subsection title/summary, hidden
  teaching/answers, keyboard-operable disclosure, semantic heading order and
  the actual data-driven worked example/activity when opened.
- [ ] Implement nested composition and optional heading levels. Keep explicit
  code tab stops, prefixed IDs and sources outside the panel. Legacy/default
  callers keep current markup and behavior.
- [ ] Prove independent open subsections, reveal/re-collapse, close/reopen reset
  of nested answers and main-section Back/Forward/deep-link reset. Retain
  regression coverage for ordinary sheets and existing stage heading defaults.
- [ ] Add a rendered audit check that observes every subsection and local
  solution, including initially unmounted children. Change generic discovery
  only if a real failure demonstrates the need; keep stage rail isolation.

## Task 3: all selected teaching and real example validation

**Files:** `web/src/lib/cheatsheets/javascript.ts`, its data/render tests,
`reference/examples/javascript-published-checks.cjs`, generated
`reference/cheatsheets.md`, highlighting output only if regeneration changes it.

- [ ] Author the eight-section/subsection table in the design. Cover all six
  additions, preserve existing important mechanisms and add explanation
  checkpoints, tests and cost reasoning where relevant. Retain each activity's
  input/execution contract; convert collection-result to a worked example.
- [ ] Implement checks against actual published snippets and solutions for
  label normalization, inclusive loop boundary, empty/rest totals, nullish versus
  undefined-only defaults, Map/Set identity/order, unique-label edge cases,
  success/failure cleanup and partial outcomes. Keep deterministic promise fixtures.
- [ ] Materialize actual totals.mjs and activity main.mjs in a fresh temporary
  directory. Spawn `process.execPath` for the broken named-import case and fixed
  default-import case. Require the intended missing-export error and `USD 5 0`
  success output; clean only that directory in finally. Do not eval/rewrite ESM.
- [ ] Run `node --unhandled-rejections=strict reference/examples/javascript-published-checks.cjs`
  from repo root. Report actual assertions/context and no broader scheduling claims.
- [ ] Regenerate portable/highlighted outputs using existing commands. Confirm
  all 29 other sheet bodies unchanged. Apply the humanizer editing pass to new prose.

## Task 4: completed-tree checks and one independent final review

- [ ] Check defaults plus each individually opened subsection with hidden
  solutions at **1024×768**, within four screens. Inspect open-all/solution
  states for readability and overflow; do not add size exceptions.
- [ ] Check both themes at representative **320/768/1440px**, keyboard navigation,
  nested disclosures, proper focus clearance, code scrolling, all eight main
  hashes, target/contrast behavior and a clean console. Update browser tests
  to open required parents explicitly before asserting on child content.
- [ ] Run final `pnpm format:check`, `pnpm lint`, `pnpm typecheck`, `pnpm test`,
  `pnpm build` and `pnpm test:e2e` once on the completed app tree. Run
  `pnpm test:dev-console` once for the changed shared composition/headings.
  Diagnose failures; preserve meaningful assertions and timeouts.
- [ ] Obtain one independent **GPT-6 Astra / Low** review of the full app diff
  from **8ff159f**, emphasizing the new delta after **322c873**. Cover source
  accuracy, delivered hierarchy, data/Markdown compatibility and example evidence.
  Identify the exact reviewed commit, fix blockers and rerun invalidated checks.
- [ ] Record final branch/commit, actual commands/counts, limits, unresolved scope
  and implementation session in task/tracker/KICKOFF. Return to coordinator
  **01a18acc-3b54-7202-92f3-404cc94fd0ad**, recommended **GPT-6 Astra / Low**.

For recovery, keep the last completed checkbox, branch/commit, failing command
and remaining checks in KICKOFF. Later records-only changes may retain identified
application evidence for unchanged inputs. Approval of content does not authorize
integration; do not merge or push.
