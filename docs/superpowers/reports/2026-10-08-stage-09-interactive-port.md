# Stage 09 interactive port execution

Started 2026-10-09. Approved plan: `bb42a76`; implementation base: `112aa42`.
Branch: `feat/stage-09-performance-port`. Execution method: Subagent-Driven.
Status: all eight tasks implemented and independently reviewed. Final live
verification found a shared Stepper state leak; its test-first fix and review
are in progress. Merge, push and deployment are separate.

Worktree: `.worktrees/stage-09-performance-port`. The parent checkout remains
on the clean planning branch at `112aa42`. The user approved isolation during
Task 8; migration followed that task's clean review boundary.

The chapter remains canonical. The port uses visibly hypothetical order data
and a separate saved record for the reader's application.

## Baseline

`pnpm test` from `web/` before product edits:

```text
 RUN  v4.1.10 /Users/angelito/personal/Development-Playbook/web

 Test Files  185 passed (185)
      Tests  1416 passed (1416)
   Start at  08:27:57
   Duration  17.16s (transform 8.83s, setup 8.43s, import 21.69s, tests 22.55s, environment 42.04s)
```

## Execution rulings

- Use one implementer at a time and a fresh task reviewer before starting the
  next task. Independent tasks keep separate review scopes.
- Record initial missing-module failure and a behavior-assertion RED before
  filling the complete implementation. Build/environment failures do not
  count as feature evidence.
- Available GPT model tiers replace the legacy Anthropic names in CLAUDE.md:
  mechanical complete-source implementation uses Luna, normal review uses
  Sol, and integration/final review uses Astra. Exact model/effort are recorded
  per dispatch in the execution ledger.
- Worktree consent was requested. Until an explicit answer, work on the
  approved feature branch in the current checkout; elapsed time authorizes
  no worktree creation.

## Deliberate deferrals

W-6 caching/scaling sheets, third-party image publication, real order-system
measurements, shared-drill extraction and storage-hook repairs, merge, push
and production promotion remain separate. Live verification justified two
narrow shared-component fixes: open glossary positioning on resize and
Stepper panel identity. Neither changes the storage hook or extracts a drill.
## Task 1 report: Stage 09 performance record model

### Changed files

- `web/src/lib/performance-sheet.ts`
- `web/src/lib/performance-sheet.test.ts`

The model exports the eleven-field `PerformanceSheet`, field metadata for baseline and follow-up views, the storage key and empty record, normalization for unknown JSON-compatible inputs, and complete Markdown export with explicit empty-field markers.

### Original TDD run record

The original initial missing-module output, focused GREEN output, and full-suite output were captured below. The original assertion RED and teeth runs were executed, but their full diagnostic output was not saved to separate log files. An earlier version of this report incorrectly placed editorial summaries of those diagnostics inside purported raw terminal-output fences. Those summaries have been removed and are not presented as raw output. The original assertion RED and teeth diagnostic output is unavailable as a retained artifact; the new controlled verification below captures the same RED/GREEN/teeth sequence in full.

#### Initial RED: missing module

Command: `pnpm exec vitest run src/lib/performance-sheet.test.ts` from `web/`.

```text
 RUN  v4.1.10 /Users/angelito/personal/Development-Playbook/web

 ❯ |unit| src/lib/performance-sheet.test.ts (0 test)

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯ Failed Suites 1 ⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯

 FAIL  |unit| src/lib/performance-sheet.test.ts [ src/lib/performance-sheet.test.ts ]
Error: Cannot find module './performance-sheet' imported from /Users/angelito/personal/Development-Playbook/web/src/lib/performance-sheet.test.ts
 ❯ src/lib/performance-sheet.test.ts:2:1
      1| import { expect, test } from 'vitest'
      2| import {
       | ^
      3|   BASELINE_FIELDS, EMPTY_PERFORMANCE_SHEET, FOLLOWUP_FIELDS,
      4|   normalizePerformanceSheet, performanceMarkdown, SHEET_FIELDS,

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯

 Test Files  1 failed (1)
      Tests no tests
   Start at 08:30:30
   Duration 129ms (transform 17ms, setup 0ms, import 0ms, tests 0ms, environment 0ms)
```
Command exit status: 1

#### Original focused GREEN

Command: `pnpm exec vitest run src/lib/performance-sheet.test.ts`.

```text
 RUN  v4.1.10 /Users/angelito/personal/Development-Playbook/web

 Test Files  1 passed (1)
      Tests  3 passed (3)
   Start at 08:30:48
   Duration 167ms (transform 28ms, setup 0ms, import 52ms, tests 2ms, environment 0ms)
```
Command exit status: 0

#### Original full suite

Command: `pnpm test`.

```text
> web@0.1.0 test /Users/angelito/personal/Development-Playbook/web
> vitest run

 RUN  v4.1.10 /Users/angelito/personal/Development-Playbook/web

 Test Files  186 passed (186)
      Tests  1419 passed (1419)
   Start at 08:31:11
   Duration 17.72s (transform 9.43s, setup 8.41s, import 22.30s, tests 24.46s, environment 40.22s)
```
Command exit status: 0

### Evidence repair: new controlled verification

These runs were performed after review to replace the unavailable original assertion RED and teeth diagnostics. The committed model was copied to `/tmp/task-1-performance-sheet-committed.ts`, temporarily replaced with the known minimal compilable skeleton, then restored. The test source remained unchanged. The fallback mutation changed only `not recorded` to `missing`, then the model was restored and compared to HEAD; `git diff --exit-code -- src/lib/performance-sheet.ts` passed.

Each raw output is also retained in `.superpowers/sdd/2026-10-08-stage-09-interactive-port/` as the named log file.

#### Assertion RED against minimal skeleton

Raw capture: `task-1-evidence-repair-red.log`.

```text

 RUN  v4.1.10 /Users/angelito/personal/Development-Playbook/web

 ❯ |unit| src/lib/performance-sheet.test.ts (3 tests | 3 failed) 8ms
   × partial or malformed records keep known strings and supply empty fields, since browser JSON is untrusted 6ms
   × Markdown exports the entire record with explicit blanks, so either view can hand over the same artifact 1ms
   × the baseline and follow-up views partition the record without losing a field 1ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 3 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  |unit| src/lib/performance-sheet.test.ts > partial or malformed records keep known strings and supply empty fields, since browser JSON is untrusted
AssertionError: expected { outcome: '', metric: '', …(9) } to deeply equal { …(11) }

- Expected
+ Received

@@ -3,11 +3,11 @@
    "change": "",
    "correctness": "",
    "evidence": "",
    "hypothesis": "",
    "metric": "",
-   "outcome": "click to browser response",
+   "outcome": "",
    "scope": "",
    "target": "",
-   "verdict": "observe longer",
+   "verdict": "",
    "window": "",
  }

 ❯ src/lib/performance-sheet.test.ts:24:5
     22|       verdict: 'observe longer',
     23|     }),
     24|   ).toEqual({
       |     ^
     25|     ...EMPTY_PERFORMANCE_SHEET,
     26|     outcome: 'click to browser response',

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/3]⎯

 FAIL  |unit| src/lib/performance-sheet.test.ts > Markdown exports the entire record with explicit blanks, so either view can hand over the same artifact
AssertionError: expected '' to be '# Performance measurement record\n\n#…' // Object.is equality

- Expected
+ Received

- # Performance measurement record
-
- ## Outcome and observer
-
- Click → response
-
- ## Metric and population
-
- not recorded
-
- ## Scope
-
- not recorded
-
- ## Window and sample
-
- not recorded
-
- ## Baseline evidence
-
- not recorded
-
- ## Target and rationale
-
- not recorded
-
- ## Hypothesis and alternative
-
- not recorded
-
- ## Change and version
-
- not recorded
-
- ## After evidence
-
- not recorded
-
- ## Correctness and rollback
-
- not recorded
-
- ## Verdict and open gap
-
- No field comparison yet
-

 ❯ src/lib/performance-sheet.test.ts:38:18


⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/3]⎯

 FAIL  |unit| src/lib/performance-sheet.test.ts > the baseline and follow-up views partition the record without losing a field
AssertionError: expected [] to deeply equal [ 'outcome', 'metric', 'scope', …(3) ]

- Expected
+ Received

- [
-   "outcome",
-   "metric",
-   "scope",
-   "window",
-   "evidence",
-   "target",
- ]
+ []

 ❯ src/lib/performance-sheet.test.ts:47:45
     45|
     46| test('the baseline and follow-up views partition the record without lo…
     47|   expect(BASELINE_FIELDS.map((f) => f.key)).toEqual([
       |                                             ^
     48|     'outcome',
     49|     'metric',

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/3]⎯


 Test Files  1 failed (1)
      Tests  3 failed (3)
   Start at  08:35:52
   Duration  117ms (transform 18ms, setup 0ms, import 25ms, tests 8ms, environment 0ms)


```
Command exit status: 1

#### New GREEN after restoration

Raw capture: `task-1-evidence-repair-green.log`.

```text

 RUN  v4.1.10 /Users/angelito/personal/Development-Playbook/web


 Test Files  1 passed (1)
      Tests  3 passed (3)
   Start at  08:35:56
   Duration  99ms (transform 16ms, setup 0ms, import 22ms, tests 2ms, environment 0ms)


```
Command exit status: 0

#### Teeth mutation

Changed only the Markdown fallback from `not recorded` to `missing`.

Raw capture: `task-1-evidence-repair-teeth.log`.

```text

 RUN  v4.1.10 /Users/angelito/personal/Development-Playbook/web

 ❯ |unit| src/lib/performance-sheet.test.ts (3 tests | 1 failed) 6ms
   × Markdown exports the entire record with explicit blanks, so either view can hand over the same artifact 4ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  |unit| src/lib/performance-sheet.test.ts > Markdown exports the entire record with explicit blanks, so either view can hand over the same artifact
AssertionError: expected '# Performance measurement record\n\n#…' to be '# Performance measurement record\n\n#…' // Object.is equality

- Expected
+ Received

@@ -4,43 +4,43 @@

  Click → response

  ## Metric and population

- not recorded
-
- ## Scope
-
- not recorded
+ missing
+
+ ## Scope
+
+ missing

  ## Window and sample

- not recorded
+ missing

  ## Baseline evidence

- not recorded
+ missing

  ## Target and rationale

- not recorded
+ missing

  ## Hypothesis and alternative

- not recorded
+ missing

  ## Change and version

- not recorded
+ missing

  ## After evidence

- not recorded
+ missing

  ## Correctness and rollback

- not recorded
+ missing

  ## Verdict and open gap

  No field comparison yet


 ❯ src/lib/performance-sheet.test.ts:38:18


⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed (1)
      Tests  1 failed | 2 passed (3)
   Start at  08:36:00
   Duration  104ms (transform 16ms, setup 0ms, import 22ms, tests 6ms, environment 0ms)


```
Command exit status: 1

#### Restored GREEN and source equality

Raw capture: `task-1-evidence-repair-restored-green.log`. Following the passing test run, `git diff --exit-code -- src/lib/performance-sheet.ts` returned exit 0 with no output.

```text

 RUN  v4.1.10 /Users/angelito/personal/Development-Playbook/web


 Test Files  1 passed (1)
      Tests  3 passed (3)
   Start at  08:36:04
   Duration  107ms (transform 15ms, setup 0ms, import 21ms, tests 2ms, environment 0ms)


```
Command exit status: 0

### Verification

- `pnpm exec prettier --write src/lib/performance-sheet.ts src/lib/performance-sheet.test.ts` — completed; both files formatted.
- `pnpm lint` — exit 0.
- `pnpm test` — exit 0: 186 test files passed, 1,419 tests passed.
- The model source has no diff from the committed version after evidence repair.

### Self-review

- Normalization copies only known string fields from non-null, non-array objects; malformed input and non-string values retain the empty defaults.
- The baseline and follow-up metadata partition all eleven keys. The test checks their literal memberships and distinct key count.
- Markdown uses the full ordered field list, trims values, and marks blank values as `not recorded`; the independent literal expectation and teeth mutation cover this behavior.
- No implementation changes were required. The only unresolved limitation is that the original assertion RED and teeth diagnostic logs were not retained; new raw evidence is attached above and in the named scratch logs.

### Evidence-report repair

The initial shell command used repository-root paths while running from `web/`; it failed to modify the model and accidentally wrote a passing run to the RED filename. That mislabeled file was deleted immediately and excluded from evidence. The correctly named logs above were captured after correcting the working-directory paths.

### Task 1 evidence report repair round 2

No product files changed, and no tests were rerun. Following the rereview, a Python script read each of the four retained `.log` files as text and replaced the corresponding `Raw capture:` text fence in both the scratch report and this canonical report with that file's contents. It added only a final newline when a source log lacked one. The script also removed every synthetic `exit_code=` line from all text fences, including original test excerpts, and moved those statuses to prose immediately after their fences.

A second Python check extracted each of the four named fences from both reports and compared them with their corresponding retained logs after normalizing only one final newline. Actual check output:

```text
PASS .superpowers/sdd/2026-10-08-stage-09-interactive-port/task-1-report.md == task-1-evidence-repair-red.log (only final newline normalized)
PASS .superpowers/sdd/2026-10-08-stage-09-interactive-port/task-1-report.md == task-1-evidence-repair-green.log (only final newline normalized)
PASS .superpowers/sdd/2026-10-08-stage-09-interactive-port/task-1-report.md == task-1-evidence-repair-teeth.log (only final newline normalized)
PASS .superpowers/sdd/2026-10-08-stage-09-interactive-port/task-1-report.md == task-1-evidence-repair-restored-green.log (only final newline normalized)
PASS docs/superpowers/reports/2026-10-08-stage-09-interactive-port.md == task-1-evidence-repair-red.log (only final newline normalized)
PASS docs/superpowers/reports/2026-10-08-stage-09-interactive-port.md == task-1-evidence-repair-green.log (only final newline normalized)
PASS docs/superpowers/reports/2026-10-08-stage-09-interactive-port.md == task-1-evidence-repair-teeth.log (only final newline normalized)
PASS docs/superpowers/reports/2026-10-08-stage-09-interactive-port.md == task-1-evidence-repair-restored-green.log (only final newline normalized)
PASS all 8 report/log comparisons
```

### Task 1 independent review

Sol reviewed the model as spec compliant and code quality approved. I1
(blocking, implementer-authored evidence error) concerned editorial changes
inside raw-output fences. Two report repairs disclosed missing original logs
and preserved new controlled captures verbatim. Scoped re-review confirmed
all eight fence/log comparisons match; I1 is addressed. The product code
remained unchanged through both repairs. Task 1 is review clean.


---

# Task 2 report: separate order-journey clocks

Status: implemented and committed as `e2558fd83591b022908d886b0872eaac4476ee99` (`feat(performance): inspect user and consumer clocks`).
Base supplied by controller: `deaf861`. Branch: `feat/stage-09-performance-port`.

## Implementation

Owned files only:
- `web/src/features/performance/journey.ts`: Outcome API, six checkout request responsibilities, five measurement outcomes with the brief's exact observers, boundaries, evidence, diagnosis and limits.
- `web/src/features/performance/OrderJourney.tsx`: selectable clocks with a labeled live detail region, three sibling OrderPaid consumers, native pressed buttons and generated detail IDs.
- `web/src/features/performance/OrderJourney.test.tsx`: three real render tests, including changed input data.

## TDD and self-review

Before writing tests, the breaks identified were missing or substituted selected-clock boundaries, a serial or missing consumer branch, a notification delivery promise, and hardcoded default outcome details that ignore supplied data. Tests were written before either implementation file. The initial missing-module failure was followed by a minimal compilable component and real assertion failures before the full component.

Assertion RED failed for the expected reason: the minimal inspector omitted the hypothetical label and consumer list, and its detail omitted the custom observer (expected “Test browser observer”, received “Browser checkout”). No test environment error caused assertion RED.

Focused GREEN: 3/3. The specified teeth mutation replaced only payment's rendered stop with “Paid persisted on the server”; only the all-clocks boundary test failed, specifically expecting “Paid visible to the user”. Restored GREEN: 3/3. Full suite: 1422/1422 across 187 files. Formatting, lint and typecheck all returned 0. The pre-commit format/lint hooks passed.

Self-review: verified exact brief content and API, data-derived details, sibling branch semantics, aria-pressed selection and aria-controls IDs, polite selected-detail updates, theme tokens, 44px controls below lg, and the existing global focus-visible rule. Read AGENTS.md, worker contract, constraints, TDD and writing-good-tests, relevant installed Next.js Server/Client and use-client docs, DESIGN.md, PATTERNS.md, frontend-design's pinned-brief guidance, and verification-before-completion. No plan discrepancy or task error found.

Deferred: stage registry/readiness/assembly, worksheet and other exercises, saved records, real telemetry, glossary changes, shared extraction, merge/push/deploy. Live browser contrast/responsive/panel-weight and production/development console checks remain for the coordinator's assembled-stage verification; no live-browser result is claimed here. Coordinator-owned modified plan and canonical report were not staged.

## Retained raw evidence

Every terminal fence below is copied programmatically from its retained log file, including ANSI sequences and any truncation markers the tools themselves emitted. Exit metadata belongs outside the fences. Commands used `pnpm --dir web`, which executes from `web/`.

### red-import

Command: `pnpm --dir web exec vitest run src/features/performance/OrderJourney.test.tsx`

Exit status: 1. Expected initial missing component import; no tests yet.

Source: `task-2-red-import.log`

```text

 RUN  v4.1.10 /Users/angelito/personal/Development-Playbook/web

 ❯ |dom| src/features/performance/OrderJourney.test.tsx (0 test)

⎯⎯⎯⎯⎯⎯ Failed Suites 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  |dom| src/features/performance/OrderJourney.test.tsx [ src/features/performance/OrderJourney.test.tsx ]
Error: Failed to resolve import "./OrderJourney" from "src/features/performance/OrderJourney.test.tsx". Does the file exist?
  Plugin: vite:import-analysis
  File: /Users/angelito/personal/Development-Playbook/web/src/features/performance/OrderJourney.test.tsx:3:29
  1  |  import { fireEvent, render, screen, within } from "@testing-library/react";
  2  |  import { expect, test } from "vitest";
  3  |  import { OrderJourney } from "./OrderJourney";
     |                                ^
  4  |  import { OUTCOMES } from "./journey";
  5  |  var _jsxFileName = "/Users/angelito/personal/Development-Playbook/web/src/features/performance/OrderJourney.test.tsx";
 ❯ TransformPluginContext._formatLog node_modules/.pnpm/vite@8.1.5_@types+node@22.20.1_jiti@2.7.0/node_modules/vite/dist/node/chunks/node.js:30416:39
 ❯ TransformPluginContext.error node_modules/.pnpm/vite@8.1.5_@types+node@22.20.1_jiti@2.7.0/node_modules/vite/dist/node/chunks/node.js:30413:14
 ❯ normalizeUrl node_modules/.pnpm/vite@8.1.5_@types+node@22.20.1_jiti@2.7.0/node_modules/vite/dist/node/chunks/node.js:27438:18
 ❯ node_modules/.pnpm/vite@8.1.5_@types+node@22.20.1_jiti@2.7.0/node_modules/vite/dist/node/chunks/node.js:27506:30
 ❯ TransformPluginContext.transform node_modules/.pnpm/vite@8.1.5_@types+node@22.20.1_jiti@2.7.0/node_modules/vite/dist/node/chunks/node.js:27474:4
 ❯ EnvironmentPluginContainer.transform node_modules/.pnpm/vite@8.1.5_@types+node@22.20.1_jiti@2.7.0/node_modules/vite/dist/node/chunks/node.js:30201:14
 ❯ loadAndTransform node_modules/.pnpm/vite@8.1.5_@types+node@22.20.1_jiti@2.7.0/node_modules/vite/dist/node/chunks/node.js:20124:26

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed (1)
      Tests  no tests
   Start at  08:43:43
   Duration  872ms (transform 16ms, setup 98ms, import 0ms, tests 0ms, environment 639ms)

```

### red-assertion

Command: `pnpm --dir web exec vitest run src/features/performance/OrderJourney.test.tsx`

Exit status: 1. Expected real behavior failures against minimal component; 3 failed.

Source: `task-2-red-assertion.log`

```text

 RUN  v4.1.10 /Users/angelito/personal/Development-Playbook/web

 ❯ |dom| src/features/performance/OrderJourney.test.tsx (3 tests | 3 failed) 68ms
   × each selected clock renders its real observer and boundaries, since a fast route cannot prove a fast user outcome 15ms
   × OrderPaid has three independent consumer branches and never promises notification delivery 46ms
   × the detail follows changed input data rather than an outcome-id lookup hidden in the component 6ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 3 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  |dom| src/features/performance/OrderJourney.test.tsx > each selected clock renders its real observer and boundaries, since a fast route cannot prove a fast user outcome
TestingLibraryElementError: Unable to find an element with the text: Hypothetical exercise. This could be because the text is broken up by multiple elements. In this case, you can provide a function for your text matcher to make your matcher more flexible.

Ignored nodes: comments, script, style
[36m<body>[39m
  [36m<div>[39m
    [36m<section[39m
      [33maria-label[39m=[32m"Selected measurement"[39m
    [36m/>[39m
  [36m</div>[39m
[36m</body>[39m
 ❯ Object.getElementError node_modules/.pnpm/@testing-library+dom@10.4.1/node_modules/@testing-library/dom/dist/config.js:37:19
 ❯ node_modules/.pnpm/@testing-library+dom@10.4.1/node_modules/@testing-library/dom/dist/query-helpers.js:76:38
 ❯ node_modules/.pnpm/@testing-library+dom@10.4.1/node_modules/@testing-library/dom/dist/query-helpers.js:52:17
 ❯ node_modules/.pnpm/@testing-library+dom@10.4.1/node_modules/@testing-library/dom/dist/query-helpers.js:95:19
 ❯ src/features/performance/OrderJourney.test.tsx:8:17
      6| test('each selected clock renders its real observer and boundaries, si…
      7|   render(<OrderJourney />)
      8|   expect(screen.getByText('Hypothetical exercise')).toBeTruthy()
       |                 ^
      9|   for (const outcome of OUTCOMES) {
     10|     fireEvent.click(screen.getByRole('button', { name: outcome.label }…

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/3]⎯

 FAIL  |dom| src/features/performance/OrderJourney.test.tsx > OrderPaid has three independent consumer branches and never promises notification delivery
TestingLibraryElementError: Unable to find an accessible element with the role "list" and name "Independent OrderPaid consumers"

Here are the accessible roles:

  region:

  Name "Selected measurement":
  [36m<section[39m
    [33maria-label[39m=[32m"Selected measurement"[39m
  [36m/>[39m

  --------------------------------------------------

Ignored nodes: comments, script, style
[36m<body>[39m
  [36m<div>[39m
    [36m<section[39m
      [33maria-label[39m=[32m"Selected measurement"[39m
    [36m/>[39m
  [36m</div>[39m
[36m</body>[39m
 ❯ Object.getElementError node_modules/.pnpm/@testing-library+dom@10.4.1/node_modules/@testing-library/dom/dist/config.js:37:19
 ❯ node_modules/.pnpm/@testing-library+dom@10.4.1/node_modules/@testing-library/dom/dist/query-helpers.js:76:38
 ❯ node_modules/.pnpm/@testing-library+dom@10.4.1/node_modules/@testing-library/dom/dist/query-helpers.js:52:17
 ❯ node_modules/.pnpm/@testing-library+dom@10.4.1/node_modules/@testing-library/dom/dist/query-helpers.js:95:19
 ❯ src/features/performance/OrderJourney.test.tsx:21:27
     19| test('OrderPaid has three independent consumer branches and never prom…
     20|   render(<OrderJourney />)
     21|   const branches = screen.getByRole('list', { name: 'Independent Order…
       |                           ^
     22|   expect(within(branches).getAllByRole('listitem')).toHaveLength(3)
     23|   expect(branches.textContent).toMatch(/Inventory[\s\S]*Logistics[\s\S…

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/3]⎯

 FAIL  |dom| src/features/performance/OrderJourney.test.tsx > the detail follows changed input data rather than an outcome-id lookup hidden in the component
AssertionError: expected 'Browser checkout' to contain 'Test browser observer'

Expected: "Test browser observer"
Received: "Browser checkout"

 ❯ src/features/performance/OrderJourney.test.tsx:32:30
     30|   render(<OrderJourney outcomes={[custom]} />)
     31|   const detail = screen.getByRole('region', { name: 'Selected measurem…
     32|   expect(detail.textContent).toContain('Test browser observer')
       |                              ^
     33|   expect(detail.textContent).toContain('Test visible stop')
     34| })

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/3]⎯


 Test Files  1 failed (1)
      Tests  3 failed (3)
   Start at  08:43:53
   Duration  733ms (transform 21ms, setup 79ms, import 13ms, tests 68ms, environment 485ms)

```

### green

Command: `pnpm --dir web exec vitest run src/features/performance/OrderJourney.test.tsx`

Exit status: 0. Complete inspector; 3 passed.

Source: `task-2-green.log`

```text

 RUN  v4.1.10 /Users/angelito/personal/Development-Playbook/web


 Test Files  1 passed (1)
      Tests  3 passed (3)
   Start at  08:44:01
   Duration  880ms (transform 35ms, setup 89ms, import 68ms, tests 119ms, environment 523ms)

```

### teeth

Command: `pnpm --dir web exec vitest run src/features/performance/OrderJourney.test.tsx`

Exit status: 1. Specified payment stop mutation; exactly 1 failed, 2 passed.

Source: `task-2-teeth.log`

```text

 RUN  v4.1.10 /Users/angelito/personal/Development-Playbook/web

 ❯ |dom| src/features/performance/OrderJourney.test.tsx (3 tests | 1 failed) 108ms
   × each selected clock renders its real observer and boundaries, since a fast route cannot prove a fast user outcome 86ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  |dom| src/features/performance/OrderJourney.test.tsx > each selected clock renders its real observer and boundaries, since a fast route cannot prove a fast user outcome
AssertionError: expected 'Visible payment statusObserverUser-vi…' to contain 'Paid visible to the user'

Expected: "Paid visible to the user"
Received: "Visible payment statusObserverUser-visible payment displayStartPayment submittedStopPaid persisted on the serverEvidencePayment submission and visible Paid timestamps for the same order.Diagnostic intervalsSeparate payment initiation to webhook receipt, webhook receipt to persisted Paid, and persisted Paid to visible status.LimitA fast webhook handler does not establish how long the provider waited or the user waited for the status display."

 ❯ src/features/performance/OrderJourney.test.tsx:14:32
     12|     expect(detail.textContent).toContain(outcome.observer)
     13|     expect(detail.textContent).toContain(outcome.start)
     14|     expect(detail.textContent).toContain(outcome.stop)
       |                                ^
     15|     expect(detail.textContent).toContain(outcome.limits)
     16|   }

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed (1)
      Tests  1 failed | 2 passed (3)
   Start at  08:44:11
   Duration  919ms (transform 38ms, setup 84ms, import 76ms, tests 108ms, environment 561ms)

```

### restored

Command: `pnpm --dir web exec vitest run src/features/performance/OrderJourney.test.tsx`

Exit status: 0. Restored and formatted inspector; 3 passed.

Source: `task-2-restored.log`

```text

 RUN  v4.1.10 /Users/angelito/personal/Development-Playbook/web


 Test Files  1 passed (1)
      Tests  3 passed (3)
   Start at  08:44:25
   Duration  1.01s (transform 54ms, setup 183ms, import 94ms, tests 141ms, environment 482ms)

```

### format

Command: `pnpm --dir web exec prettier --write src/features/performance/journey.ts src/features/performance/OrderJourney.tsx src/features/performance/OrderJourney.test.tsx`

Exit status: 0. Owned files formatted.

Source: `task-2-format.log`

```text
src/features/performance/journey.ts 37ms
src/features/performance/OrderJourney.tsx 20ms
src/features/performance/OrderJourney.test.tsx 7ms
```

### typecheck

Command: `pnpm --dir web typecheck`

Exit status: 0. Route typegen and application tsc passed.

Source: `task-2-typecheck.log`

```text

> web@0.1.0 typecheck /Users/angelito/personal/Development-Playbook/web
> next typegen && tsc --noEmit

Generating route types...
✓ Types generated successfully
```

### lint

Command: `pnpm --dir web lint`

Exit status: 0. Zero-warning lint passed.

Source: `task-2-lint.log`

```text

> web@0.1.0 lint /Users/angelito/personal/Development-Playbook/web
> eslint --max-warnings 0

```

### full-suite

Command: `pnpm --dir web test`

Exit status: 0. 1422 tests in 187 files passed.

Source: `task-2-full-suite.log`

```text

> web@0.1.0 test /Users/angelito/personal/Development-Playbook/web
> vitest run


 RUN  v4.1.10 /Users/angelito/personal/Development-Playbook/web


 Test Files  187 passed (187)
      Tests  1422 passed (1422)
   Start at  08:44:28
   Duration  24.45s (transform 9.95s, setup 12.07s, import 27.91s, tests 38.49s, environment 61.48s)

```

### commit

Command: `git add <three owned files>; git commit -m 'feat(performance): inspect user and consumer clocks' -m '<required trailer>'`

Exit status: 0. Only the three owned files committed; pre-commit hooks passed.

Source: `task-2-commit.log`

```text
╭───────────────────────────────────────╮
│ lefthook  v2.1.10   hook:  [1mpre-commit[m │
╰───────────────────────────────────────╯
┃  format ❯ 
src/features/performance/OrderJourney.test.tsx 77ms (unchanged)
src/features/performance/OrderJourney.tsx 57ms (unchanged)
src/features/performance/journey.ts 7ms (unchanged)

┃  lint ❯ 

[38;2;56;56;56m  ────────────────────────────────────[m
summary: (done in 2.17 seconds)
✓ format (0.53 seconds)
✓ lint (2.15 seconds)
[feat/stage-09-performance-port e2558fd] feat(performance): inspect user and consumer clocks
 3 files changed, 223 insertions(+)
 create mode 100644 web/src/features/performance/OrderJourney.test.tsx
 create mode 100644 web/src/features/performance/OrderJourney.tsx
 create mode 100644 web/src/features/performance/journey.ts
```


## Task 2 independent review

Spec and quality: review clean. No findings. All ten raw fences match retained logs. Commit trailer verified; assembled-stage live checks remain pending. Review source: `task-2-review.md`.


---

# Task 3 implementation report

Commit: `ee2d71a80734efea6a68ab03983f5af9a63cbd8a`.

Implemented the approved five-field baseline practice in `web/src/features/performance/baseline.ts`, `BaselineLab.tsx`, and `BaselineLab.test.tsx`. Practice answers stay in component state. Readers commit each judgment before seeing reasoning, cannot change committed answers, can reset, and inspect their actual selections with individual verdicts. The score counts correct judgments rather than treating filled fields as valid. The record keeps field p95 unknown and separates user-outcome evidence from diagnostic evidence.

Self-review: compared the implementation to the supplied API/source contract; only Prettier changes differ. Verified native radio semantics, full-label input hit areas and min-h-11 controls, unique useId grouping, empty initial live messages, semantic go/danger verdicts, brand selection, no persistence writes, retained wrong answer text, and reset of index/draft/choices. No unrelated files staged. The existing stage content duplication is extended by the approved hand-port; chapter prose remains canonical.

Concerns: no discovered plan defect or test failure after restoration. Initial staging failed with `Unable to create .git/index.lock: Operation not permitted`; scoped authorized escalation succeeded. This was a filesystem sandbox boundary, not an automatic approval rejection. This component has not been inspected in a live assembled stage; contrast, responsive/panel-height, production console, and development-console audits remain with the coordinator's stage verification.

Deferred: registry/ready assembly (Task 8), reader worksheet (Task 7), W-6 sheets, real telemetry, shared-drill extraction, live browser audits, merge, push and deployment. Coordinator-owned plan and canonical report edits remain dirty and uncommitted.

Read: root/web AGENTS.md, constraints and worker contract, TDD skill and writing-good-tests.md, verification-before-completion skill, PATTERNS.md, DESIGN.md, installed Next use-client directive and server/client component guidance.

Raw evidence below is inserted directly from retained logs. Exit statuses and interpretations are outside terminal fences.

## red-import

Command: `pnpm exec vitest run src/features/performance/BaselineLab.test.tsx`

Exit status: 1. Initial missing-module RED: BaselineLab did not exist; this proves missing implementation, not behavior.

```text

 RUN  v4.1.10 /Users/angelito/personal/Development-Playbook/web

 ❯ |dom| src/features/performance/BaselineLab.test.tsx (0 test)

⎯⎯⎯⎯⎯⎯ Failed Suites 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  |dom| src/features/performance/BaselineLab.test.tsx [ src/features/performance/BaselineLab.test.tsx ]
Error: Failed to resolve import "./BaselineLab" from "src/features/performance/BaselineLab.test.tsx". Does the file exist?
  Plugin: vite:import-analysis
  File: /Users/angelito/personal/Development-Playbook/web/src/features/performance/BaselineLab.test.tsx:3:28
  1  |  import { fireEvent, render, screen } from "@testing-library/react";
  2  |  import { expect, test } from "vitest";
  3  |  import { BaselineLab } from "./BaselineLab";
     |                               ^
  4  |  import { BASELINE_PRACTICE } from "./baseline";
  5  |  var _jsxFileName = "/Users/angelito/personal/Development-Playbook/web/src/features/performance/BaselineLab.test.tsx";
 ❯ TransformPluginContext._formatLog node_modules/.pnpm/vite@8.1.5_@types+node@22.20.1_jiti@2.7.0/node_modules/vite/dist/node/chunks/node.js:30416:39
 ❯ TransformPluginContext.error node_modules/.pnpm/vite@8.1.5_@types+node@22.20.1_jiti@2.7.0/node_modules/vite/dist/node/chunks/node.js:30413:14
 ❯ normalizeUrl node_modules/.pnpm/vite@8.1.5_@types+node@22.20.1_jiti@2.7.0/node_modules/vite/dist/node/chunks/node.js:27438:18
 ❯ node_modules/.pnpm/vite@8.1.5_@types+node@22.20.1_jiti@2.7.0/node_modules/vite/dist/node/chunks/node.js:27506:30
 ❯ TransformPluginContext.transform node_modules/.pnpm/vite@8.1.5_@types+node@22.20.1_jiti@2.7.0/node_modules/vite/dist/node/chunks/node.js:27474:4
 ❯ EnvironmentPluginContainer.transform node_modules/.pnpm/vite@8.1.5_@types+node@22.20.1_jiti@2.7.0/node_modules/vite/dist/node/chunks/node.js:30201:14
 ❯ loadAndTransform node_modules/.pnpm/vite@8.1.5_@types+node@22.20.1_jiti@2.7.0/node_modules/vite/dist/node/chunks/node.js:20124:26

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed (1)
      Tests  no tests
   Start at  08:48:39
   Duration  761ms (transform 17ms, setup 99ms, import 0ms, tests 0ms, environment 534ms)

```

## red-assertion

Command: `pnpm exec vitest run src/features/performance/BaselineLab.test.tsx -t 'reasoning appears only after commit'`

Exit status: 1. Behavioral RED failed for the right reason: the minimal native-radio skeleton allowed commit before a choice; expected disabled true, received false. Two unrelated tests were intentionally skipped.

```text

 RUN  v4.1.10 /Users/angelito/personal/Development-Playbook/web

 ❯ |dom| src/features/performance/BaselineLab.test.tsx (3 tests | 1 failed | 2 skipped) 76ms
   × reasoning appears only after commit and reset clears committed hindsight 76ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  |dom| src/features/performance/BaselineLab.test.tsx > reasoning appears only after commit and reset clears committed hindsight
AssertionError: expected false to be true // Object.is equality

- Expected
+ Received

- true
+ false

 ❯ src/features/performance/BaselineLab.test.tsx:35:27
     33|   expect(screen.queryByText(first.why)).toBeNull()
     34|   const commit = screen.getByRole('button', { name: 'Commit measuremen…
     35|   expect(commit.disabled).toBe(true)
       |                           ^
     36|   fireEvent.click(screen.getByRole('radio', { name: first.options[1].l…
     37|   fireEvent.click(commit)

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed (1)
      Tests  1 failed | 2 skipped (3)
   Start at  08:48:53
   Duration  862ms (transform 38ms, setup 128ms, import 16ms, tests 76ms, environment 540ms)

```

## green

Command: `pnpm exec vitest run src/features/performance/BaselineLab.test.tsx`

Exit status: 0. All three planned render tests passed.

```text

 RUN  v4.1.10 /Users/angelito/personal/Development-Playbook/web


 Test Files  1 passed (1)
      Tests  3 passed (3)
   Start at  08:49:09
   Duration  996ms (transform 46ms, setup 99ms, import 86ms, tests 221ms, environment 507ms)

```

## teeth

Command: `pnpm exec vitest run src/features/performance/BaselineLab.test.tsx`

Exit status: 1. Specified assembled-record-only mutation replaced selected?.label with the correct-answer lookup. Exactly the wrong-observer test failed because the selected server label disappeared; the other two passed.

```text

 RUN  v4.1.10 /Users/angelito/personal/Development-Playbook/web

 ❯ |dom| src/features/performance/BaselineLab.test.tsx (3 tests | 1 failed) 201ms
   × a wrong observer remains visible in the assembled record, since a completed form is not a valid baseline 142ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  |dom| src/features/performance/BaselineLab.test.tsx > a wrong observer remains visible in the assembled record, since a completed form is not a valid baseline
AssertionError: expected 'Practice baseline recordOutcomePlace …' to contain 'Server handler entry to server respon…'

Expected: "Server handler entry to server response"
Received: "Practice baseline recordOutcomePlace order click to response receipt in the browserNeeds correction. The browser observes the selected user outcome. Server route duration is diagnostic and excludes part of the user wait.Metric and populationDuration p95 from completed outcomes; report total attempts, completed samples, failures and timeouts separatelyCorrect. State the completed-outcome denominator and keep the same rule after the change. Failure counts can overlap completed outcomes; they are not a partition to sum.ScopePOST /orders; version order-before; mobile Chrome; network profile mobile-4g-v1; 20-item cart; hypothetical inventory of 10000 SKUs; warm cacheCorrect. Name the route, deployment, segment, cart/data shape and cache state. Change the version deliberately and keep the workload comparable.Window and samplePlanned field window 2026-10-01 to 2026-10-07; completed sample and attempt counts not yet recorded; p95 not yet recordedCorrect. Leave unknown field values unfilled. Record sparse samples as insufficient, retain a controlled baseline and name the next observation window.EvidenceBrowser outcome record when collected; route trace and controlled cart reproduction as separate diagnostic evidenceCorrect. A trace explains instrumented work. A controlled run or one query plan cannot fill the user-outcome field percentile."

 ❯ src/features/performance/BaselineLab.test.tsx:22:30
     20|   finish(true)
     21|   const record = screen.getByRole('region', { name: 'Practice baseline…
     22|   expect(record.textContent).toContain('Server handler entry to server…
       |                              ^
     23|   expect(record.textContent).toContain('Needs correction')
     24|   expect(record.textContent).toContain('completed outcomes')

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed (1)
      Tests  1 failed | 2 passed (3)
   Start at  08:49:12
   Duration  759ms (transform 38ms, setup 71ms, import 71ms, tests 201ms, environment 331ms)

```

## restored

Command: `pnpm exec vitest run src/features/performance/BaselineLab.test.tsx`

Exit status: 0. Restored selected?.label; all three tests passed.

```text

 RUN  v4.1.10 /Users/angelito/personal/Development-Playbook/web


 Test Files  1 passed (1)
      Tests  3 passed (3)
   Start at  08:49:14
   Duration  839ms (transform 41ms, setup 69ms, import 76ms, tests 199ms, environment 415ms)

```

## format

Command: `pnpm exec prettier --write src/features/performance/baseline.ts src/features/performance/BaselineLab.tsx src/features/performance/BaselineLab.test.tsx`

Exit status: 0. Formatted only owned files.

```text
src/features/performance/baseline.ts 32ms
src/features/performance/BaselineLab.tsx 21ms
src/features/performance/BaselineLab.test.tsx 14ms
```

## typecheck

Command: `pnpm typecheck`

Exit status: 0. Next route generation and TypeScript passed.

```text

> web@0.1.0 typecheck /Users/angelito/personal/Development-Playbook/web
> next typegen && tsc --noEmit

Generating route types...
✓ Types generated successfully
```

## lint

Command: `pnpm lint`

Exit status: 0. Zero warnings gate passed.

```text

> web@0.1.0 lint /Users/angelito/personal/Development-Playbook/web
> eslint --max-warnings 0

```

## full-suite

Command: `pnpm test`

Exit status: 0. Full suite run once before commit: 1425/1425 tests, 188/188 files, no errors.

```text

> web@0.1.0 test /Users/angelito/personal/Development-Playbook/web
> vitest run


 RUN  v4.1.10 /Users/angelito/personal/Development-Playbook/web


 Test Files  188 passed (188)
      Tests  1425 passed (1425)
   Start at  08:49:29
   Duration  24.17s (transform 10.21s, setup 11.82s, import 25.51s, tests 41.04s, environment 59.99s)

```

## commit

Command: `git commit -m 'feat(performance): practice defining the first baseline' -m 'Co-Authored-By: Codex Opus 4.8 (1M context) <noreply@anthropic.com>'`

Exit status: 0. Commit hooks passed and left the owned source unchanged.

```text
╭───────────────────────────────────────╮
│ lefthook  v2.1.10   hook:  [1mpre-commit[m │
╰───────────────────────────────────────╯
┃  format ❯ 
src/features/performance/BaselineLab.test.tsx 57ms (unchanged)
src/features/performance/BaselineLab.tsx 23ms (unchanged)
src/features/performance/baseline.ts 5ms (unchanged)

┃  lint ❯ 

[38;2;56;56;56m  ────────────────────────────────────[m
summary: (done in 2.43 seconds)
✓ format (0.56 seconds)
✓ lint (2.42 seconds)
[feat/stage-09-performance-port ee2d71a] feat(performance): practice defining the first baseline
 3 files changed, 327 insertions(+)
 create mode 100644 web/src/features/performance/BaselineLab.test.tsx
 create mode 100644 web/src/features/performance/BaselineLab.tsx
 create mode 100644 web/src/features/performance/baseline.ts
```

## Task 3 independent review

Spec and quality: review clean. No findings. All ten terminal fences match retained logs. Trailer verified. Review source: `task-3-review.md`.


---

# Task 4 implementation report

Implemented the diagnosis, query-plan, and hypothetical before/after datasets; the quoted SQL artifact; and a native-radio decision drill. The drill locks the first commit, reveals reasoning on both verdict branches, derives correctness from supplied answers, resets state, and uses distinct useId radio names across instances. Verdicts use go/danger; selection uses brand. No invented p95 or traffic count is supplied.

Owned files: web/src/features/performance/decisions.ts, DecisionDrill.tsx, artifacts.ts, decisions.test.ts, DecisionDrill.test.tsx.

Self-review: selectable answers and distinct IDs validated; SQL matches the canonical chapter verbatim; comparison evidence renders before commit; altered supplied answer data changes the rendered verdict. Rationale regression and missing-sample correction both have focused teeth checks. Existing approved plan source was retained except for the correction below. No unrelated files staged.

Important, PLAN-AUTHORED ERROR: the internal/missing-browser comparison inherited adequate sample and recorded rates from COMPARABLE despite absent browser evidence. Raised to coordinator, who authorized explicit missing completed sample, attempt totals, and failure/timeout rates. Added independent literal assertions before correcting those three cells. Diagnosis and correctness evidence remain as stipulated. No canonical chapter factual correction was needed.

Deferred: Task 8 live browser native-arrow behavior, contrast, responsive overflow/touch checks, production audit and dev-console checks; stage registration; shared drill extraction; real ordering telemetry; merge, push, deployment. The stage data and SQL remain deliberate hand-ported chapter content, matching the existing architecture.

## import-red

Log: `.superpowers/sdd/2026-10-08-stage-09-interactive-port/task-4-import-red.log`

Exit: 1. Expected missing decisions and DecisionDrill modules; establishes the import RED.

```text

 RUN  v4.1.10 /Users/angelito/personal/Development-Playbook/web

 ❯ |unit| src/features/performance/decisions.test.ts (0 test)
 ❯ |dom| src/features/performance/DecisionDrill.test.tsx (0 test)

⎯⎯⎯⎯⎯⎯ Failed Suites 2 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  |unit| src/features/performance/decisions.test.ts [ src/features/performance/decisions.test.ts ]
Error: Cannot find module './decisions' imported from /Users/angelito/personal/Development-Playbook/web/src/features/performance/decisions.test.ts
 ❯ src/features/performance/decisions.test.ts:4:1
      2| import { resolve } from 'node:path'
      3| import { expect, test } from 'vitest'
      4| import { BOTTLENECK_CASES, COMPARISON_CASES, QUERY_CASES } from './dec…
       | ^
      5| import { INVENTORY_PLAN } from './artifacts'
      6|

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/2]⎯

 FAIL  |dom| src/features/performance/DecisionDrill.test.tsx [ src/features/performance/DecisionDrill.test.tsx ]
Error: Failed to resolve import "./DecisionDrill" from "src/features/performance/DecisionDrill.test.tsx". Does the file exist?
  Plugin: vite:import-analysis
  File: /Users/angelito/personal/Development-Playbook/web/src/features/performance/DecisionDrill.test.tsx:3:30
  1  |  import { fireEvent, render, screen, within } from "@testing-library/react";
  2  |  import { expect, test } from "vitest";
  3  |  import { DecisionDrill } from "./DecisionDrill";
     |                                 ^
  4  |  import { BOTTLENECK_CASES, COMPARISON_CASES, QUERY_CASES } from "./decisions";
  5  |  var _jsxFileName = "/Users/angelito/personal/Development-Playbook/web/src/features/performance/DecisionDrill.test.tsx";
 ❯ TransformPluginContext._formatLog node_modules/.pnpm/vite@8.1.5_@types+node@22.20.1_jiti@2.7.0/node_modules/vite/dist/node/chunks/node.js:30416:39
 ❯ TransformPluginContext.error node_modules/.pnpm/vite@8.1.5_@types+node@22.20.1_jiti@2.7.0/node_modules/vite/dist/node/chunks/node.js:30413:14
 ❯ normalizeUrl node_modules/.pnpm/vite@8.1.5_@types+node@22.20.1_jiti@2.7.0/node_modules/vite/dist/node/chunks/node.js:27438:18
 ❯ node_modules/.pnpm/vite@8.1.5_@types+node@22.20.1_jiti@2.7.0/node_modules/vite/dist/node/chunks/node.js:27506:30
 ❯ TransformPluginContext.transform node_modules/.pnpm/vite@8.1.5_@types+node@22.20.1_jiti@2.7.0/node_modules/vite/dist/node/chunks/node.js:27474:4
 ❯ EnvironmentPluginContainer.transform node_modules/.pnpm/vite@8.1.5_@types+node@22.20.1_jiti@2.7.0/node_modules/vite/dist/node/chunks/node.js:30201:14
 ❯ loadAndTransform node_modules/.pnpm/vite@8.1.5_@types+node@22.20.1_jiti@2.7.0/node_modules/vite/dist/node/chunks/node.js:20124:26

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/2]⎯


 Test Files  2 failed (2)
      Tests  no tests
   Start at  08:53:49
   Duration  844ms (transform 29ms, setup 96ms, import 0ms, tests 0ms, environment 599ms)

```

## assertion-red

Log: `.superpowers/sdd/2026-10-08-stage-09-interactive-port/task-4-assertion-red.log`

Exit: 1. Failed for the right reason: the minimal skeleton has empty SQL, no selectable answer, missing comparison verdict data, and no drill controls. All seven actual assertions failed.

```text

 RUN  v4.1.10 /Users/angelito/personal/Development-Playbook/web

 ❯ |unit| src/features/performance/decisions.test.ts (3 tests | 3 failed) 9ms
   × the quoted SQL is the chapter artifact rather than a query the site claims to execute 4ms
   × every case has a selectable answer and distinct option ids, since a missing answer makes a drill unfinishable 1ms
   × the comparison distinguishes missing evidence, changed scope, an acceptable outcome and harmful behavior 3ms
 ❯ |dom| src/features/performance/DecisionDrill.test.tsx (4 tests | 4 failed) 99ms
   × wrong and right answers both reveal the rationale and the first commit stays locked 75ms
   × comparison verdicts follow user evidence instead of the internal query improvement 11ms
   × changed answer data changes the rendered verdict, rather than a hidden id-based answer map 7ms
   × two drills use independent native radio names so choosing one cannot uncheck the other 5ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 7 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  |unit| src/features/performance/decisions.test.ts > the quoted SQL is the chapter artifact rather than a query the site claims to execute
AssertionError: expected '' to be 'EXPLAIN (ANALYZE, BUFFERS)\nSELECT sk…' // Object.is equality

- Expected
+ Received

- EXPLAIN (ANALYZE, BUFFERS)
- SELECT sku, available FROM inventory WHERE sku IN ('A', 'B');

 ❯ src/features/performance/decisions.test.ts:10:68
      8|   const chapter = readFileSync(resolve(process.cwd(), '../docs/09-perf…
      9|   const sql = chapter.match(/```sql\n([\s\S]*?)\n```/)?.[1]
     10|   expect(INVENTORY_PLAN.lines.map((line) => line.text).join('\n')).toB…
       |                                                                    ^
     11| })
     12|

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/7]⎯

 FAIL  |unit| src/features/performance/decisions.test.ts > every case has a selectable answer and distinct option ids, since a missing answer makes a drill unfinishable
AssertionError: expected false to be true // Object.is equality

- Expected
+ Received

- true
+ false

 ❯ src/features/performance/decisions.test.ts:17:70
     15|     expect(new Set(set.map((row) => row.id)).size).toBe(set.length)
     16|     for (const row of set) {
     17|       expect(row.options.some((option) => option.id === row.answer)).t…
       |                                                                      ^
     18|       expect(new Set(row.options.map((option) => option.id)).size).toB…
     19|     }

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/7]⎯

 FAIL  |unit| src/features/performance/decisions.test.ts > the comparison distinguishes missing evidence, changed scope, an acceptable outcome and harmful behavior
AssertionError: expected [ 'missing' ] to deeply equal [ 'observe', 'repeat', 'stop', …(1) ]

- Expected
+ Received

  [
-   "observe",
-   "repeat",
-   "stop",
-   "revert",
+   "missing",
  ]

 ❯ src/features/performance/decisions.test.ts:24:53
     22|
     23| test('the comparison distinguishes missing evidence, changed scope, an…
     24|   expect(COMPARISON_CASES.map((row) => row.answer)).toEqual(['observe'…
       |                                                     ^
     25|   for (const row of COMPARISON_CASES) {
     26|     expect(row.comparison?.map((field) => field.field)).toEqual([

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/7]⎯

 FAIL  |dom| src/features/performance/DecisionDrill.test.tsx > wrong and right answers both reveal the rationale and the first commit stays locked
TestingLibraryElementError: Unable to find an accessible element with the role "radio" and name "First"

Here are the accessible roles:

  paragraph:

  Name "":
  [36m<p />[39m

  --------------------------------------------------

Ignored nodes: comments, script, style
[36m<body>[39m
  [36m<div>[39m
    [36m<p>[39m
      [0mCart diagnosis[0m
    [36m</p>[39m
  [36m</div>[39m
[36m</body>[39m
 ❯ Object.getElementError node_modules/.pnpm/@testing-library+dom@10.4.1/node_modules/@testing-library/dom/dist/config.js:37:19
 ❯ node_modules/.pnpm/@testing-library+dom@10.4.1/node_modules/@testing-library/dom/dist/query-helpers.js:76:38
 ❯ node_modules/.pnpm/@testing-library+dom@10.4.1/node_modules/@testing-library/dom/dist/query-helpers.js:52:17
 ❯ node_modules/.pnpm/@testing-library+dom@10.4.1/node_modules/@testing-library/dom/dist/query-helpers.js:95:19
 ❯ src/features/performance/DecisionDrill.test.tsx:18:26
     16|   expect(screen.queryByText(item.why)).toBeNull()
     17|   const wrong = item.options.find((row) => row.id !== item.answer)!
     18|   fireEvent.click(screen.getByRole('radio', { name: wrong.label }))
       |                          ^
     19|   fireEvent.click(screen.getByRole('button', { name: 'Commit decision'…
     20|   expect(screen.getByText(item.why)).toBeTruthy()

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[4/7]⎯

 FAIL  |dom| src/features/performance/DecisionDrill.test.tsx > comparison verdicts follow user evidence instead of the internal query improvement
TestingLibraryElementError: Unable to find an accessible element with the role "table" and name "Before and after evidence"

Here are the accessible roles:

  paragraph:

  Name "":
  [36m<p />[39m

  --------------------------------------------------

Ignored nodes: comments, script, style
[36m<body>[39m
  [36m<div>[39m
    [36m<p>[39m
      [0mCompare outcomes[0m
    [36m</p>[39m
  [36m</div>[39m
[36m</body>[39m
 ❯ Object.getElementError node_modules/.pnpm/@testing-library+dom@10.4.1/node_modules/@testing-library/dom/dist/config.js:37:19
 ❯ node_modules/.pnpm/@testing-library+dom@10.4.1/node_modules/@testing-library/dom/dist/query-helpers.js:76:38
 ❯ node_modules/.pnpm/@testing-library+dom@10.4.1/node_modules/@testing-library/dom/dist/query-helpers.js:52:17
 ❯ node_modules/.pnpm/@testing-library+dom@10.4.1/node_modules/@testing-library/dom/dist/query-helpers.js:95:19
 ❯ src/features/performance/DecisionDrill.test.tsx:36:26
     34|   render(<DecisionDrill title="Compare outcomes" cases={COMPARISON_CAS…
     35|   for (const [index, item] of COMPARISON_CASES.entries()) {
     36|     const table = screen.getByRole('table', { name: 'Before and after …
       |                          ^
     37|     for (const row of item.comparison ?? []) {
     38|       expect(table.textContent).toContain(row.before)

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[5/7]⎯

 FAIL  |dom| src/features/performance/DecisionDrill.test.tsx > changed answer data changes the rendered verdict, rather than a hidden id-based answer map
TestingLibraryElementError: Unable to find an accessible element with the role "radio" and name "Second"

Here are the accessible roles:

  paragraph:

  Name "":
  [36m<p />[39m

  --------------------------------------------------

Ignored nodes: comments, script, style
[36m<body>[39m
  [36m<div>[39m
    [36m<p>[39m
      [0mChanged case[0m
    [36m</p>[39m
  [36m</div>[39m
[36m</body>[39m
 ❯ Object.getElementError node_modules/.pnpm/@testing-library+dom@10.4.1/node_modules/@testing-library/dom/dist/config.js:37:19
 ❯ node_modules/.pnpm/@testing-library+dom@10.4.1/node_modules/@testing-library/dom/dist/query-helpers.js:76:38
 ❯ node_modules/.pnpm/@testing-library+dom@10.4.1/node_modules/@testing-library/dom/dist/query-helpers.js:52:17
 ❯ node_modules/.pnpm/@testing-library+dom@10.4.1/node_modules/@testing-library/dom/dist/query-helpers.js:95:19
 ❯ src/features/performance/DecisionDrill.test.tsx:52:26
     50|   const custom = { ...source, answer: source.options[1].id, why: 'Chan…
     51|   render(<DecisionDrill title="Changed case" cases={[custom]} />)
     52|   fireEvent.click(screen.getByRole('radio', { name: custom.options[1].…
       |                          ^
     53|   fireEvent.click(screen.getByRole('button', { name: 'Commit decision'…
     54|   expect(screen.getByText('1 of 1 decisions correct')).toBeTruthy()

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[6/7]⎯

 FAIL  |dom| src/features/performance/DecisionDrill.test.tsx > two drills use independent native radio names so choosing one cannot uncheck the other
TestingLibraryElementError: Unable to find an accessible element with the role "group" and name "Missing case"

Here are the accessible roles:

  paragraph:

  Name "":
  [36m<p />[39m

  Name "":
  [36m<p />[39m

  --------------------------------------------------

Ignored nodes: comments, script, style
[36m<body>[39m
  [36m<div>[39m
    [36m<p>[39m
      [0mFirst[0m
    [36m</p>[39m
    [36m<p>[39m
      [0mSecond[0m
    [36m</p>[39m
  [36m</div>[39m
[36m</body>[39m
 ❯ Object.getElementError node_modules/.pnpm/@testing-library+dom@10.4.1/node_modules/@testing-library/dom/dist/config.js:37:19
 ❯ node_modules/.pnpm/@testing-library+dom@10.4.1/node_modules/@testing-library/dom/dist/query-helpers.js:76:38
 ❯ node_modules/.pnpm/@testing-library+dom@10.4.1/node_modules/@testing-library/dom/dist/query-helpers.js:109:15
 ❯ src/features/performance/DecisionDrill.test.tsx:60:25
     58| test('two drills use independent native radio names so choosing one ca…
     59|   render(<><DecisionDrill title="First" cases={QUERY_CASES} /><Decisio…
     60|   const groups = screen.getAllByRole('group', { name: QUERY_CASES[0].p…
       |                         ^
     61|   const first = within(groups[0]).getAllByRole('radio')[0] as HTMLInpu…
     62|   const second = within(groups[1]).getAllByRole('radio')[1] as HTMLInp…

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[7/7]⎯


 Test Files  2 failed (2)
      Tests  7 failed (7)
   Start at  08:54:04
   Duration  841ms (transform 37ms, setup 81ms, import 42ms, tests 107ms, environment 535ms)

```

## green

Log: `.superpowers/sdd/2026-10-08-stage-09-interactive-port/task-4-green.log`

Exit: 0. Seven tests passed against the implementation.

```text

 RUN  v4.1.10 /Users/angelito/personal/Development-Playbook/web


 Test Files  2 passed (2)
      Tests  7 passed (7)
   Start at  08:54:13
   Duration  995ms (transform 56ms, setup 93ms, import 100ms, tests 207ms, environment 528ms)

```

## teeth

Log: `.superpowers/sdd/2026-10-08-stage-09-interactive-port/task-4-teeth.log`

Exit: 1. Expected failure: wrong-answer rationale was deliberately hidden. Only the wrong/right rationale test failed; six passed.

```text

 RUN  v4.1.10 /Users/angelito/personal/Development-Playbook/web

 ❯ |dom| src/features/performance/DecisionDrill.test.tsx (4 tests | 1 failed) 209ms
   × wrong and right answers both reveal the rationale and the first commit stays locked 100ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  |dom| src/features/performance/DecisionDrill.test.tsx > wrong and right answers both reveal the rationale and the first commit stays locked
TestingLibraryElementError: Unable to find an element with the text: The repeated calls support a batching experiment. The image cannot explain the observed server time. Retest the browser outcome and preserve stock and order behavior.. This could be because the text is broken up by multiple elements. In this case, you can provide a function for your text matcher to make your matcher more flexible.

Ignored nodes: comments, script, style
[36m<body>[39m
  [36m<div>[39m
    [36m<div[39m
      [33mclass[39m=[32m"border border-line bg-raised p-5 sm:p-6 "[39m
    [36m>[39m
      [36m<p[39m
        [33mclass[39m=[32m"t-label mb-2 text-brand"[39m
      [36m>[39m
        [0mHypothetical exercise[0m
      [36m</p>[39m
      [36m<h3[39m
        [33mclass[39m=[32m"t-head mb-3 text-lg"[39m
      [36m>[39m
        [0mCart diagnosis[0m
      [36m</h3>[39m
      [36m<p[39m
        [33maria-live[39m=[32m"polite"[39m
        [33mclass[39m=[32m"t-data mb-4 text-sm text-muted"[39m
      [36m>[39m
        [0m0 of 1 decisions correct[0m
      [36m</p>[39m
      [36m<fieldset[39m
        [33mclass[39m=[32m"min-w-0 space-y-2"[39m
        [33mdisabled[39m=[32m""[39m
      [36m>[39m
        [36m<legend[39m
          [33mclass[39m=[32m"mb-3 text-sm font-medium"[39m
        [36m>[39m
          [0mA controlled 20-item cart shows 21 inventory queries. Repeated round trips dominate server time. Which hypothesis is supported?[0m
        [36m</legend>[39m
        [36m<label[39m
          [33mclass[39m=[32m"relative flex min-h-11 cursor-pointer items-start gap-3 border border-line p-3 text-sm focus-within:outline-2 focus-within:outline-brand"[39m
        [36m>[39m
          [36m<input[39m
            [33mclass[39m=[32m"peer absolute inset-0 h-full w-full cursor-pointer opacity-0 disabled:cursor-default"[39m
            [33mdisabled[39m=[32m""[39m
            [33mname[39m=[32m"_r_0_-cart"[39m
            [33mtype[39m=[32m"radio"[39m
            [33mvalue[39m=[32m"batch"[39m
          [36m/>[39m
          [36m<span[39m
            [33maria-hidden[39m=[32m"true"[39m
            [33mclass[39m=[32m"mt-1 size-4 shrink-0 border border-line peer-checked:border-brand peer-checked:bg-brand"[39m
          [36m/>[39m
          [36m<span[39m
            [33mclass[39m=[32m"min-w-0 break-words"[39m
          [36m>[39m
            [0mBatch the availability lookup and preserve the stock decision[0m
          [36m</span>[39m
        [36m</label>[39m
        [36m<label[39m
          [33mclass[39m=[32m"relative flex min-h-11 cursor-pointer items-start gap-3 border border-line p-3 text-sm focus-within:outline-2 focus-within:outline-brand"[39m
        [36m>[39m
          [36m<input[39m
            [33mclass[39m=[32m"peer absolute inset-0 h-full w-full cursor-pointer opacity-0 disabled:cursor-default"[39m
            [33mdisabled[39m=[32m""[39m
            [33mname[39m=[32m"_r_0_-cart"[39m
            [33mtype[39m=[32m"radio"[39m
            [33mvalue[39m=[32m"image"[39m
          [36m/>[39m
          [36m<span[39m
            [33maria-hidden[39m=[32m"true"[39m
            [33mclass[39m=[32m"mt-1 size-4 shrink-0 border border-line peer-checked:border-brand peer-checked:bg-brand"[39m
          [36m/>[39m
          [36m<span[39m
            [33mclass[39m=[32m"min-w-0 break-words"[39m
          [36m>[39m
            [0mResize the checkout image to fix server inventory time[0m
          [36m</span>[39m
        [36m</label>[39m
        [36m<label[39m
          [33mclass[39m=[32m"relative flex min-h-11 cursor-pointer items-start gap-3 border border-line p-3 text-sm focus-within:outline-2 focus-within:outline-brand"[39m
        [36m>[39m
          [36m<input[39m
            [33mclass[39m=[32m"peer absolute inset-0 h-full w-full cursor-pointer opacity-0 disabled:cursor-default"[39m
            [33mdisabled[39m=[32m""[39m
            [33mname[39m=[32m"_r_0_-cart"[39m
            [33mtype[39m=[32m"radio"[39m
            [33mvalue[39m=[32m"observe"[39m
          [36m/>[39m
          [36m<span[39m
            [33maria-hidden[39m=[32m"true"[39m
            [33mclass[39m=[32m"mt-1 size-4 shrink-0 border border-line peer-checked:border-brand peer-checked:bg-brand"[39m
          [36m/>[39m
          [36m<span[39m
            [33mclass[39m=[32m"min-w-0 break-words"[39m
          [36m>[39m
            [0mDeclare a production win from the query count[0m
          [36m</span>[39m
        [36m</label>[39m
      [36m</fieldset>[39m
      [36m<button[39m
        [33mclass[39m=[32m"mt-4 min-h-11 border border-line px-4 text-sm disabled:cursor-default disabled:text-subtle"[39m
        [33mdisabled[39m=[32m""[39m
        [33mtype[39m=[32m"button"[39m
      [36m>[39m
        [0mCommit decision[0m
      [36m</button>[39m
      [36m<div[39m
        [33maria-live[39m=[32m"polite"[39m
        [33mclass[39m=[32m"mt-4"[39m
      [36m>[39m
        [36m<p[39m
          [33mclass[39m=[32m"text-sm font-medium text-danger"[39m
        [36m>[39m
          [0mNeeds correction[0m
        [36m</p>[39m
        [36m<p[39m
          [33mclass[39m=[32m"mt-2 text-sm leading-relaxed text-muted"[39m
        [36m/>[39m
      [36m</div>[39m
      [36m<button[39m
        [33mclass[39m=[32m"mt-4 min-h-11 border border-line px-4 text-sm"[39m
        [33mtype[39m=[32m"button"[39m
      [36m>[39m
        [0mNext case[0m
      [36m</button>[39m
      [36m<button[39m
        [33mclass[39m=[32m"mt-4 ml-2 min-h-11 border border-line px-4 text-sm"[39m
        [33mtype[39m=[32m"button"[39m
      [36m>[39m
        [0mReset decisions[0m
      [36m</button>[39m
    [36m</div>[39m
  [36m</div>[39m
[36m</body>[39m
 ❯ Object.getElementError node_modules/.pnpm/@testing-library+dom@10.4.1/node_modules/@testing-library/dom/dist/config.js:37:19
 ❯ node_modules/.pnpm/@testing-library+dom@10.4.1/node_modules/@testing-library/dom/dist/query-helpers.js:76:38
 ❯ node_modules/.pnpm/@testing-library+dom@10.4.1/node_modules/@testing-library/dom/dist/query-helpers.js:52:17
 ❯ node_modules/.pnpm/@testing-library+dom@10.4.1/node_modules/@testing-library/dom/dist/query-helpers.js:95:19
 ❯ src/features/performance/DecisionDrill.test.tsx:20:17
     18|   fireEvent.click(screen.getByRole('radio', { name: wrong.label }))
     19|   fireEvent.click(screen.getByRole('button', { name: 'Commit decision'…
     20|   expect(screen.getByText(item.why)).toBeTruthy()
       |                 ^
     21|   expect(screen.getByText('0 of 1 decisions correct')).toBeTruthy()
     22|   for (const radio of screen.getAllByRole('radio')) expect((radio as H…

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed | 1 passed (2)
      Tests  1 failed | 6 passed (7)
   Start at  08:54:34
   Duration  967ms (transform 61ms, setup 103ms, import 105ms, tests 212ms, environment 488ms)

```

## restored

Log: `.superpowers/sdd/2026-10-08-stage-09-interactive-port/task-4-restored.log`

Exit: 0. Unconditional rationale restored: seven tests passed.

```text

 RUN  v4.1.10 /Users/angelito/personal/Development-Playbook/web


 Test Files  2 passed (2)
      Tests  7 passed (7)
   Start at  08:54:37
   Duration  820ms (transform 57ms, setup 62ms, import 105ms, tests 210ms, environment 394ms)

```

## correction-red

Log: `.superpowers/sdd/2026-10-08-stage-09-interactive-port/task-4-correction-red.log`

Exit: 1. Failed for the right reason: the missing-browser case inherited an adequate completed sample despite missing browser evidence. One failed, seven passed.

```text

 RUN  v4.1.10 /Users/angelito/personal/Development-Playbook/web

 ❯ |unit| src/features/performance/decisions.test.ts (4 tests | 1 failed) 6ms
   × missing browser evidence cannot inherit an adequate completed sample or recorded attempt rates 3ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  |unit| src/features/performance/decisions.test.ts > missing browser evidence cannot inherit an adequate completed sample or recorded attempt rates
AssertionError: expected 'New completed count documented; adequ…' to be 'Browser completed count and sample li…' // Object.is equality

Expected: "Browser completed count and sample limitations are not yet recorded"
Received: "New completed count documented; adequate for this hypothetical comparison"

 ❯ src/features/performance/decisions.test.ts:35:83
     33| test('missing browser evidence cannot inherit an adequate completed sa…
     34|   const item = COMPARISON_CASES.find((row) => row.id === 'internal')!
     35|   expect(item.comparison?.find((row) => row.field === 'Completed sampl…
       |                                                                                   ^
     36|   expect(item.comparison?.find((row) => row.field === 'Population')?.a…
     37|   expect(item.comparison?.find((row) => row.field === 'Failures and ti…

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed | 1 passed (2)
      Tests  1 failed | 7 passed (8)
   Start at  08:54:53
   Duration  906ms (transform 52ms, setup 73ms, import 102ms, tests 228ms, environment 455ms)

```

## correction-green

Log: `.superpowers/sdd/2026-10-08-stage-09-interactive-port/task-4-correction-green.log`

Exit: 0. Missing completed sample, planned population with missing attempt totals, and unrecorded failure/timeout rates are explicit; eight tests passed.

```text

 RUN  v4.1.10 /Users/angelito/personal/Development-Playbook/web


 Test Files  2 passed (2)
      Tests  8 passed (8)
   Start at  08:54:55
   Duration  383.25s (transform 277ms, setup 905ms, import 420ms, tests 1.07s, environment 380.75s)

```

## correction-teeth

Log: `.superpowers/sdd/2026-10-08-stage-09-interactive-port/task-4-correction-teeth.log`

Exit: 1. Deliberately removed completed-sample override. Only the new consistency test failed; seven passed.

```text

 RUN  v4.1.10 /Users/angelito/personal/Development-Playbook/web

 ❯ |unit| src/features/performance/decisions.test.ts (4 tests | 1 failed) 6ms
   × missing browser evidence cannot inherit an adequate completed sample or recorded attempt rates 4ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  |unit| src/features/performance/decisions.test.ts > missing browser evidence cannot inherit an adequate completed sample or recorded attempt rates
AssertionError: expected 'New completed count documented; adequ…' to be 'Browser completed count and sample li…' // Object.is equality

Expected: "Browser completed count and sample limitations are not yet recorded"
Received: "New completed count documented; adequate for this hypothetical comparison"

 ❯ src/features/performance/decisions.test.ts:35:83
     33| test('missing browser evidence cannot inherit an adequate completed sa…
     34|   const item = COMPARISON_CASES.find((row) => row.id === 'internal')!
     35|   expect(item.comparison?.find((row) => row.field === 'Completed sampl…
       |                                                                                   ^
     36|   expect(item.comparison?.find((row) => row.field === 'Population')?.a…
     37|   expect(item.comparison?.find((row) => row.field === 'Failures and ti…

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed | 1 passed (2)
      Tests  1 failed | 7 passed (8)
   Start at  09:01:39
   Duration  996ms (transform 61ms, setup 101ms, import 108ms, tests 219ms, environment 516ms)

```

## format

Log: `.superpowers/sdd/2026-10-08-stage-09-interactive-port/task-4-format.log`

Exit: 0. Prettier formatted the five owned files.

```text
src/features/performance/decisions.ts 40ms
src/features/performance/DecisionDrill.tsx 20ms
src/features/performance/artifacts.ts 1ms
src/features/performance/decisions.test.ts 18ms
src/features/performance/DecisionDrill.test.tsx 14ms
```

## correction-restored

Log: `.superpowers/sdd/2026-10-08-stage-09-interactive-port/task-4-correction-restored.log`

Exit: 0. Missing-sample override restored and formatted: eight tests passed.

```text

 RUN  v4.1.10 /Users/angelito/personal/Development-Playbook/web


 Test Files  2 passed (2)
      Tests  8 passed (8)
   Start at  09:01:42
   Duration  770ms (transform 47ms, setup 62ms, import 100ms, tests 232ms, environment 330ms)

```

## full

Log: `.superpowers/sdd/2026-10-08-stage-09-interactive-port/task-4-full.log`

Exit: 0. Full pnpm test passed: 1433 tests across 190 files. No failures or warnings.

```text

> web@0.1.0 test /Users/angelito/personal/Development-Playbook/web
> vitest run


 RUN  v4.1.10 /Users/angelito/personal/Development-Playbook/web


 Test Files  190 passed (190)
      Tests  1433 passed (1433)
   Start at  09:01:53
   Duration  26.60s (transform 11.81s, setup 12.70s, import 30.96s, tests 41.35s, environment 65.62s)

```

## typecheck

Log: `.superpowers/sdd/2026-10-08-stage-09-interactive-port/task-4-typecheck.log`

Exit: 0. pnpm typecheck generated routes then checked TypeScript successfully.

```text

> web@0.1.0 typecheck /Users/angelito/personal/Development-Playbook/web
> next typegen && tsc --noEmit

Generating route types...
✓ Types generated successfully
```

## lint

Log: `.superpowers/sdd/2026-10-08-stage-09-interactive-port/task-4-lint.log`

Exit: 0. Repository lint passed with zero warnings.

```text

> web@0.1.0 lint /Users/angelito/personal/Development-Playbook/web
> eslint --max-warnings 0

```

Commit: `592a9e0` (`feat(performance): judge diagnostic and outcome evidence`), five owned files, 530 insertions. Commit hooks passed format and lint.

Evidence handling: initial fence-validation regex was too broad and matched SQL triple backticks inside raw assertion output. Revalidated all 13 fences using full delimiter lines; each equals its retained log exactly. No log content changed. Initial git staging hit the filesystem sandbox's read-only .git restriction; authorized escalated staging/commit succeeded. No approval rejection occurred.

## Task 4 independent review

Review clean after one PLAN-AUTHORED ERROR fixed. No outstanding findings. All thirteen logs exactly match their report fences. Commit trailer verified. Review source: `task-4-review.md`.


---

# Task 5 implementation report

Status: implemented and committed as 831f14d53236a6e5b717ba9f1b2c6e1a983ed237.

Owned files: `web/src/features/performance/CopyText.tsx`, `web/src/features/performance/PerformanceWorksheet.tsx`, `web/src/features/performance/PerformanceWorksheet.test.tsx`.

Implementation: baseline and follow-up share an eleven-field normalized record through unchanged `useLocalStorage<unknown>`. Whole-record export awaits the clipboard operation and reveals exact read-only Markdown on rejection. Confirmed clear removes both views. Failed storage verification retains the mounted draft and displays the unavailable-saving warning.

Self-review: labels and hints use unique ids; status/count updates are announced; button targets are at least 44px; no effect-driven state updates; no hypothetical answers seed the record. The synchronous updater reads the newest record, preserving unseen fields. Clipboard mocking is confined to the external browser operation; storage and worksheet behavior remain real.

Test rationale: losing unseen fields, accepting malformed stored values, dropping unsaved input, swallowing clipboard rejection, clearing without confirmation, or ignoring storage events should fail these tests. The approved render suite compares the clipboard boundary payload against the separately tested Markdown builder.

Evidence: initial import RED was the missing component, then a compilable inert-field skeleton produced actual assertion RED: clipboard payload was undefined and clear left the saved record intact. This failed for the expected reason, missing persistence/export behavior, with a working jsdom setup. The malformed-record skeleton test also raised a JSON parse error because no save normalized the corrupted value; that error is retained below. Full implementation passed nine focused/data tests. The specified mutation removed draft retention and caused exactly the denied-read/write test to fail (`expected '' to be 'Unsaved browser outcome'`); restoring it passed all nine again. Full project suite: 1439 tests across 191 files passed. Typecheck, owned formatting, and lint passed.

Permission evidence: normal git staging/commit could not create `.git/index.lock` under the filesystem sandbox (exit 128). Escalated staging and commit succeeded; no automatic review rejection occurred. Commit hooks passed format and lint.

Concerns: no task-level defects found. Browser contrast/responsive, production audit, and development-console checks belong to the assembled-stage verification; this report claims only the recorded render/data/static checks.

Deferred: unavailable-storage drafts do not survive unmount/reload, by the approved contract; shared-hook changes, stage registration, browser audits, documentation ledgers, merge, push, and deployment remain outside this task.

## Initial missing-module RED

Retained log: `task-5-import-red.log`; actual process exit: 1.

```text

 RUN  v4.1.10 /Users/angelito/personal/Development-Playbook/web

 ❯ |dom| src/features/performance/PerformanceWorksheet.test.tsx (0 test)

⎯⎯⎯⎯⎯⎯ Failed Suites 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  |dom| src/features/performance/PerformanceWorksheet.test.tsx [ src/features/performance/PerformanceWorksheet.test.tsx ]
Error: Failed to resolve import "./PerformanceWorksheet" from "src/features/performance/PerformanceWorksheet.test.tsx". Does the file exist?
  Plugin: vite:import-analysis
  File: /Users/angelito/personal/Development-Playbook/web/src/features/performance/PerformanceWorksheet.test.tsx:3:37
  1  |  import { act, fireEvent, render, screen } from "@testing-library/react";
  2  |  import { afterEach, beforeEach, expect, test, vi } from "vitest";
  3  |  import { PerformanceWorksheet } from "./PerformanceWorksheet";
     |                                        ^
  4  |  import { EMPTY_PERFORMANCE_SHEET, PERFORMANCE_KEY, performanceMarkdown, SHEET_FIELDS } from "@/lib/performance-sheet";
  5  |  var _jsxFileName = "/Users/angelito/personal/Development-Playbook/web/src/features/performance/PerformanceWorksheet.t...
 ❯ TransformPluginContext._formatLog node_modules/.pnpm/vite@8.1.5_@types+node@22.20.1_jiti@2.7.0/node_modules/vite/dist/node/chunks/node.js:30416:39
 ❯ TransformPluginContext.error node_modules/.pnpm/vite@8.1.5_@types+node@22.20.1_jiti@2.7.0/node_modules/vite/dist/node/chunks/node.js:30413:14
 ❯ normalizeUrl node_modules/.pnpm/vite@8.1.5_@types+node@22.20.1_jiti@2.7.0/node_modules/vite/dist/node/chunks/node.js:27438:18
 ❯ node_modules/.pnpm/vite@8.1.5_@types+node@22.20.1_jiti@2.7.0/node_modules/vite/dist/node/chunks/node.js:27506:30
 ❯ TransformPluginContext.transform node_modules/.pnpm/vite@8.1.5_@types+node@22.20.1_jiti@2.7.0/node_modules/vite/dist/node/chunks/node.js:27474:4
 ❯ EnvironmentPluginContainer.transform node_modules/.pnpm/vite@8.1.5_@types+node@22.20.1_jiti@2.7.0/node_modules/vite/dist/node/chunks/node.js:30201:14
 ❯ loadAndTransform node_modules/.pnpm/vite@8.1.5_@types+node@22.20.1_jiti@2.7.0/node_modules/vite/dist/node/chunks/node.js:20124:26

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed (1)
      Tests  no tests
   Start at  09:06:41
   Duration  980ms (transform 17ms, setup 103ms, import 0ms, tests 0ms, environment 727ms)

```

## Compilable skeleton assertion RED

Retained log: `task-5-assertion-red.log`; actual process exit: 1.

```text

 RUN  v4.1.10 /Users/angelito/personal/Development-Playbook/web

 ❯ |dom| src/features/performance/PerformanceWorksheet.test.tsx (6 tests | 6 failed) 133ms
   × baseline and follow-up edits survive panel remounts and export the whole record from either view 90ms
   × malformed or partial stored values never crash and a later edit keeps valid fields from the other view 3ms
   × denied reads or writes retain a mounted editable draft and export it instead of claiming it was saved 6ms
   × a rejected clipboard operation offers exact manual Markdown without losing the worksheet 15ms
   × clearing requires confirmation and resets fields from both views rather than just the visible form 14ms
   × a storage event refreshes the other view and the next edit preserves that unseen field 5ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 6 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  |dom| src/features/performance/PerformanceWorksheet.test.tsx > baseline and follow-up edits survive panel remounts and export the whole record from either view
AssertionError: expected last "vi.fn()" call to have been called with [ Array(1) ]

- Expected:
[
  "# Performance measurement record

## Outcome and observer

Browser click to response

## Metric and population

Completed p95; failures/timeouts separate

## Scope

not recorded

## Window and sample

not recorded

## Baseline evidence

not recorded

## Target and rationale

not recorded

## Hypothesis and alternative

not recorded

## Change and version

not recorded

## After evidence

not recorded

## Correctness and rollback

not recorded

## Verdict and open gap

More field observations needed
",
]

+ Received:
undefined

 ❯ src/features/performance/PerformanceWorksheet.test.tsx:32:21
     30|   }
     31|   await act(async () => { fireEvent.click(screen.getByRole('button', {…
     32|   expect(writeText).toHaveBeenLastCalledWith(performanceMarkdown(expec…
       |                     ^
     33|   expect(screen.getByRole('status', { name: 'Copy status' }).textConte…
     34|   expect(JSON.parse(window.localStorage.getItem(PERFORMANCE_KEY)!)).to…

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/6]⎯

 FAIL  |dom| src/features/performance/PerformanceWorksheet.test.tsx > malformed or partial stored values never crash and a later edit keeps valid fields from the other view
SyntaxError: Expected property name or '}' in JSON at position 1 (line 1 column 2)
 ❯ src/features/performance/PerformanceWorksheet.test.tsx:46:24
     44|     const view = render(<PerformanceWorksheet view="baseline" />)
     45|     edit('Scope', 'Mobile; warm cache')
     46|     const saved = JSON.parse(window.localStorage.getItem(PERFORMANCE_K…
       |                        ^
     47|     expect(saved.scope).toBe('Mobile; warm cache')
     48|     expect(typeof saved.metric).toBe('string')

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/6]⎯

 FAIL  |dom| src/features/performance/PerformanceWorksheet.test.tsx > denied reads or writes retain a mounted editable draft and export it instead of claiming it was saved
TestingLibraryElementError: Unable to find an element with the text: /Saving is unavailable/. This could be because the text is broken up by multiple elements. In this case, you can provide a function for your text matcher to make your matcher more flexible.

Ignored nodes: comments, script, style
[36m<body>[39m
  [36m<div>[39m
    [36m<div>[39m
      [36m<label>[39m
        [0mOutcome and observer[0m
        [36m<textarea />[39m
      [36m</label>[39m
      [36m<label>[39m
        [0mMetric and population[0m
        [36m<textarea />[39m
      [36m</label>[39m
      [36m<label>[39m
        [0mScope[0m
        [36m<textarea />[39m
      [36m</label>[39m
      [36m<label>[39m
        [0mWindow and sample[0m
        [36m<textarea />[39m
      [36m</label>[39m
      [36m<label>[39m
        [0mBaseline evidence[0m
        [36m<textarea />[39m
      [36m</label>[39m
      [36m<label>[39m
        [0mTarget and rationale[0m
        [36m<textarea />[39m
      [36m</label>[39m
      [36m<button>[39m
        [0mCopy as Markdown[0m
      [36m</button>[39m
      [36m<button>[39m
        [0mClear whole record[0m
      [36m</button>[39m
    [36m</div>[39m
  [36m</div>[39m
[36m</body>[39m
 ❯ Object.getElementError node_modules/.pnpm/@testing-library+dom@10.4.1/node_modules/@testing-library/dom/dist/config.js:37:19
 ❯ node_modules/.pnpm/@testing-library+dom@10.4.1/node_modules/@testing-library/dom/dist/query-helpers.js:76:38
 ❯ node_modules/.pnpm/@testing-library+dom@10.4.1/node_modules/@testing-library/dom/dist/query-helpers.js:52:17
 ❯ node_modules/.pnpm/@testing-library+dom@10.4.1/node_modules/@testing-library/dom/dist/query-helpers.js:95:19
 ❯ src/features/performance/PerformanceWorksheet.test.tsx:65:19
     63|     edit('Scope', 'Unsaved scope')
     64|     expect((screen.getByLabelText('Outcome and observer') as HTMLTextA…
     65|     expect(screen.getByText(/Saving is unavailable/)).toBeTruthy()
       |                   ^
     66|     await act(async () => { fireEvent.click(screen.getByRole('button',…
     67|     expect(writeText).toHaveBeenLastCalledWith(performanceMarkdown({

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/6]⎯

 FAIL  |dom| src/features/performance/PerformanceWorksheet.test.tsx > a rejected clipboard operation offers exact manual Markdown without losing the worksheet
TestingLibraryElementError: Unable to find a label with the text of: Markdown record

Ignored nodes: comments, script, style
[36m<body>[39m
  [36m<div>[39m
    [36m<div>[39m
      [36m<label>[39m
        [0mHypothesis and alternative[0m
        [36m<textarea />[39m
      [36m</label>[39m
      [36m<label>[39m
        [0mChange and version[0m
        [36m<textarea />[39m
      [36m</label>[39m
      [36m<label>[39m
        [0mAfter evidence[0m
        [36m<textarea />[39m
      [36m</label>[39m
      [36m<label>[39m
        [0mCorrectness and rollback[0m
        [36m<textarea />[39m
      [36m</label>[39m
      [36m<label>[39m
        [0mVerdict and open gap[0m
        [36m<textarea />[39m
      [36m</label>[39m
      [36m<button>[39m
        [0mCopy as Markdown[0m
      [36m</button>[39m
      [36m<button>[39m
        [0mClear whole record[0m
      [36m</button>[39m
    [36m</div>[39m
  [36m</div>[39m
[36m</body>[39m
 ❯ Object.getElementError node_modules/.pnpm/@testing-library+dom@10.4.1/node_modules/@testing-library/dom/dist/config.js:37:19
 ❯ getAllByLabelText node_modules/.pnpm/@testing-library+dom@10.4.1/node_modules/@testing-library/dom/dist/queries/label-text.js:111:38
 ❯ node_modules/.pnpm/@testing-library+dom@10.4.1/node_modules/@testing-library/dom/dist/query-helpers.js:52:17
 ❯ node_modules/.pnpm/@testing-library+dom@10.4.1/node_modules/@testing-library/dom/dist/query-helpers.js:95:19
 ❯ src/features/performance/PerformanceWorksheet.test.tsx:80:25
     78|   edit('Hypothesis and alternative', 'Repeated queries explain the con…
     79|   await act(async () => { fireEvent.click(screen.getByRole('button', {…
     80|   const manual = screen.getByLabelText('Markdown record') as HTMLTextA…
       |                         ^
     81|   expect(manual.readOnly).toBe(true)
     82|   expect(manual.value).toBe(performanceMarkdown({

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[4/6]⎯

 FAIL  |dom| src/features/performance/PerformanceWorksheet.test.tsx > clearing requires confirmation and resets fields from both views rather than just the visible form
AssertionError: expected '{"outcome":"Saved outcome","metric":"…' to be null

- Expected:
null

+ Received:
"{\"outcome\":\"Saved outcome\",\"metric\":\"\",\"scope\":\"\",\"window\":\"\",\"evidence\":\"\",\"target\":\"\",\"hypothesis\":\"\",\"change\":\"\",\"after\":\"\",\"correctness\":\"\",\"verdict\":\"Saved verdict\"}"

 ❯ src/features/performance/PerformanceWorksheet.test.tsx:99:56
     97|   confirm.mockReturnValue(true)
     98|   fireEvent.click(screen.getByRole('button', { name: 'Clear whole reco…
     99|   expect(window.localStorage.getItem(PERFORMANCE_KEY)).toBeNull()
       |                                                        ^
    100|   expect((screen.getByLabelText('Outcome and observer') as HTMLTextAre…
    101|   expect(screen.getByText('0 of 11 fields recorded')).toBeTruthy()

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[5/6]⎯

 FAIL  |dom| src/features/performance/PerformanceWorksheet.test.tsx > a storage event refreshes the other view and the next edit preserves that unseen field
AssertionError: expected '' to be 'Changed in another tab' // Object.is equality

- Expected
+ Received

- Changed in another tab

 ❯ src/features/performance/PerformanceWorksheet.test.tsx:112:88
    110|     window.dispatchEvent(new StorageEvent('storage', { key: PERFORMANC…
    111|   })
    112|   expect((screen.getByLabelText('Outcome and observer') as HTMLTextAre…
       |                                                                                        ^
    113|   edit('Scope', 'Same scope')
    114|   expect(JSON.parse(window.localStorage.getItem(PERFORMANCE_KEY)!).ver…

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[6/6]⎯


 Test Files  1 failed (1)
      Tests  6 failed (6)
   Start at  09:06:50
   Duration  1.37s (transform 48ms, setup 113ms, import 27ms, tests 133ms, environment 959ms)

```

## Focused/data GREEN

Retained log: `task-5-green.log`; actual process exit: 0.

```text

 RUN  v4.1.10 /Users/angelito/personal/Development-Playbook/web


 Test Files  2 passed (2)
      Tests  9 passed (9)
   Start at  09:06:58
   Duration  1.23s (transform 65ms, setup 83ms, import 123ms, tests 169ms, environment 504ms)

```

## Specified teeth mutation

Retained log: `task-5-teeth.log`; actual process exit: 1.

```text

 RUN  v4.1.10 /Users/angelito/personal/Development-Playbook/web

 ❯ |dom| src/features/performance/PerformanceWorksheet.test.tsx (6 tests | 1 failed) 149ms
   × denied reads or writes retain a mounted editable draft and export it instead of claiming it was saved 10ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  |dom| src/features/performance/PerformanceWorksheet.test.tsx > denied reads or writes retain a mounted editable draft and export it instead of claiming it was saved
AssertionError: expected '' to be 'Unsaved browser outcome' // Object.is equality

- Expected
+ Received

- Unsaved browser outcome

 ❯ src/features/performance/PerformanceWorksheet.test.tsx:64:90
     62|     edit('Outcome and observer', 'Unsaved browser outcome')
     63|     edit('Scope', 'Unsaved scope')
     64|     expect((screen.getByLabelText('Outcome and observer') as HTMLTextA…
       |                                                                                          ^
     65|     expect(screen.getByText(/Saving is unavailable/)).toBeTruthy()
     66|     await act(async () => { fireEvent.click(screen.getByRole('button',…

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed (1)
      Tests  1 failed | 5 passed (6)
   Start at  09:07:08
   Duration  987ms (transform 46ms, setup 89ms, import 84ms, tests 149ms, environment 571ms)

```

## Owned-file formatting

Retained log: `task-5-format.log`; actual process exit: 0.

```text
src/features/performance/CopyText.tsx 36ms
src/features/performance/PerformanceWorksheet.tsx 17ms
src/features/performance/PerformanceWorksheet.test.tsx 30ms
```

## Restored focused/data GREEN

Retained log: `task-5-restored-green.log`; actual process exit: 0.

```text

 RUN  v4.1.10 /Users/angelito/personal/Development-Playbook/web


 Test Files  2 passed (2)
      Tests  9 passed (9)
   Start at  09:07:17
   Duration  929ms (transform 58ms, setup 101ms, import 108ms, tests 172ms, environment 483ms)

```

## Full project suite

Retained log: `task-5-full-suite.log`; actual process exit: 0.

```text

> web@0.1.0 test /Users/angelito/personal/Development-Playbook/web
> vitest run


 RUN  v4.1.10 /Users/angelito/personal/Development-Playbook/web


 Test Files  191 passed (191)
      Tests  1439 passed (1439)
   Start at  09:07:18
   Duration  30.13s (transform 14.43s, setup 14.47s, import 36.15s, tests 46.95s, environment 71.39s)

```

## Typecheck

Retained log: `task-5-typecheck.log`; actual process exit: 0.

```text

> web@0.1.0 typecheck /Users/angelito/personal/Development-Playbook/web
> next typegen && tsc --noEmit

Generating route types...
✓ Types generated successfully
```

## Lint

Retained log: `task-5-lint.log`; actual process exit: 0.

```text

> web@0.1.0 lint /Users/angelito/personal/Development-Playbook/web
> eslint --max-warnings 0

```

## Sandbox commit attempt

Retained log: `task-5-commit.log`; actual process exit: 128.

```text
fatal: Unable to create '/Users/angelito/personal/Development-Playbook/.git/index.lock': Operation not permitted
```

## Escalated commit and hooks

Retained log: `task-5-commit-escalated.log`; actual process exit: 0.

```text
╭───────────────────────────────────────╮
│ lefthook  v2.1.10   hook:  [1mpre-commit[m │
╰───────────────────────────────────────╯
┃  format ❯ 
src/features/performance/CopyText.tsx 38ms (unchanged)
src/features/performance/PerformanceWorksheet.test.tsx 24ms (unchanged)
src/features/performance/PerformanceWorksheet.tsx 14ms (unchanged)

┃  lint ❯ 

[38;2;56;56;56m  ────────────────────────────────────[m
summary: (done in 2.32 seconds)
✓ format (0.39 seconds)
✓ lint (2.30 seconds)
[feat/stage-09-performance-port 831f14d] feat(performance): save and export the measurement worksheet
 3 files changed, 383 insertions(+)
 create mode 100644 web/src/features/performance/CopyText.tsx
 create mode 100644 web/src/features/performance/PerformanceWorksheet.test.tsx
 create mode 100644 web/src/features/performance/PerformanceWorksheet.tsx
```


## Task 5 independent review

Spec and quality: review clean. No findings. All eleven report fences exactly match retained logs. Commit trailer verified. Review source: `task-5-review.md`.


---

# Task 6 implementation report

Implemented the five canonical completion checks with persistent unique known ids, reset isolation from the worksheet, four artifact reminders and the four shared TeamNotes rows. Used a distinct checklist key and the existing shared storage hook unchanged.

Files: checklist.ts, PerformanceChecklist.tsx, checklist.test.ts, PerformanceChecklist.test.tsx under web/src/features/performance/.

Self-review: source/API matches the approved task; native labeled inputs, per-instance ids, aria-live counts, 44px controls, known-id filtering and Set deduplication. Tests cover persistence, reset isolation, malformed data and rendered team ownership. No task defects found.

Deferred: stage registry assembly, live production/development browser audits, canonical report/ledger updates, merge, push and deployment remain with the coordinator. No live-browser validation claimed.

## import-red

True process exit: 1. Initial import RED: both absent task modules. This is setup evidence, not the assertion RED.

```text

 RUN  v4.1.10 /Users/angelito/personal/Development-Playbook/web

 ❯ |unit| src/features/performance/checklist.test.ts (0 test)
 ❯ |dom| src/features/performance/PerformanceChecklist.test.tsx (0 test)

⎯⎯⎯⎯⎯⎯ Failed Suites 2 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  |unit| src/features/performance/checklist.test.ts [ src/features/performance/checklist.test.ts ]
Error: Cannot find module './checklist' imported from /Users/angelito/personal/Development-Playbook/web/src/features/performance/checklist.test.ts
 ❯ src/features/performance/checklist.test.ts:4:1
      2| import { resolve } from 'node:path'
      3| import { expect, test } from 'vitest'
      4| import { DONE, TEAM, ARTIFACTS } from './checklist'
       | ^
      5|
      6| test('completion checks are the canonical chapter checks rather than a…

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/2]⎯

 FAIL  |dom| src/features/performance/PerformanceChecklist.test.tsx [ src/features/performance/PerformanceChecklist.test.tsx ]
Error: Failed to resolve import "./checklist" from "src/features/performance/PerformanceChecklist.test.tsx". Does the file exist?
  Plugin: vite:import-analysis
  File: /Users/angelito/personal/Development-Playbook/web/src/features/performance/PerformanceChecklist.test.tsx:4:42
  2  |  import { beforeEach, expect, test } from "vitest";
  3  |  import { PerformanceChecklist } from "./PerformanceChecklist";
  4  |  import { CHECKLIST_KEY, DONE, TEAM } from "./checklist";
     |                                             ^
  5  |  var _jsxFileName = "/Users/angelito/personal/Development-Playbook/web/src/features/performance/PerformanceChecklist.t...
  6  |  import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";
 ❯ TransformPluginContext._formatLog node_modules/.pnpm/vite@8.1.5_@types+node@22.20.1_jiti@2.7.0/node_modules/vite/dist/node/chunks/node.js:30416:39
 ❯ TransformPluginContext.error node_modules/.pnpm/vite@8.1.5_@types+node@22.20.1_jiti@2.7.0/node_modules/vite/dist/node/chunks/node.js:30413:14
 ❯ normalizeUrl node_modules/.pnpm/vite@8.1.5_@types+node@22.20.1_jiti@2.7.0/node_modules/vite/dist/node/chunks/node.js:27438:18
 ❯ node_modules/.pnpm/vite@8.1.5_@types+node@22.20.1_jiti@2.7.0/node_modules/vite/dist/node/chunks/node.js:27506:30
 ❯ TransformPluginContext.transform node_modules/.pnpm/vite@8.1.5_@types+node@22.20.1_jiti@2.7.0/node_modules/vite/dist/node/chunks/node.js:27474:4
 ❯ EnvironmentPluginContainer.transform node_modules/.pnpm/vite@8.1.5_@types+node@22.20.1_jiti@2.7.0/node_modules/vite/dist/node/chunks/node.js:30201:14
 ❯ loadAndTransform node_modules/.pnpm/vite@8.1.5_@types+node@22.20.1_jiti@2.7.0/node_modules/vite/dist/node/chunks/node.js:20124:26

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/2]⎯


 Test Files  2 failed (2)
      Tests  no tests
   Start at  09:11:47
   Duration  784ms (transform 28ms, setup 92ms, import 0ms, tests 0ms, environment 562ms)

```

## assertion-red

True process exit: 1. Genuine assertion RED failed for the right reason: canonical checks absent, native checkbox and recorded count absent, team disclosure absent. Four tests failed against the compilable minimal skeleton.

```text

 RUN  v4.1.10 /Users/angelito/personal/Development-Playbook/web

 ❯ |unit| src/features/performance/checklist.test.ts (1 test | 1 failed) 5ms
   × completion checks are the canonical chapter checks rather than an index-by-reflex list 5ms
 ❯ |dom| src/features/performance/PerformanceChecklist.test.tsx (3 tests | 3 failed) 71ms
   × ticked evidence persists on remount and reset removes the checklist without touching the worksheet 63ms
   × unknown, duplicate or malformed saved ids do not create a false completion count 2ms
   × team notes include a named budget, query-plan review and ownership of the after window 5ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 4 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  |unit| src/features/performance/checklist.test.ts > completion checks are the canonical chapter checks rather than an index-by-reflex list
AssertionError: expected [ 'Completion evidence placeholder' ] to deeply equal [ …(5) ]

- Expected
+ Received

  [
-   "The same outcome is measured before and after, with comparable segment, data and cache state",
-   "The production or field comparison records the window, sample, percentile, failures and timeouts",
-   "The measured outcome meets its stated target, or the unresolved gap is recorded",
-   "Correctness tests pass and the order, payment and inventory behavior remains intact",
-   "A failed or harmful change is reverted or explicitly carried as an open problem",
+   "Completion evidence placeholder",
  ]

 ❯ src/features/performance/checklist.test.ts:9:39
      7|   const chapter = readFileSync(resolve(process.cwd(), '../docs/09-perf…
      8|   const done = chapter.split('## Definition of done')[1].split('---')[…
      9|   expect(DONE.map((row) => row.text)).toEqual([...done.matchAll(/^- \[…
       |                                       ^
     10|   expect(ARTIFACTS).toHaveLength(4)
     11|   expect(TEAM.map((row) => row.id)).toEqual(['targets', 'budget', 'pla…

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/4]⎯

 FAIL  |dom| src/features/performance/PerformanceChecklist.test.tsx > ticked evidence persists on remount and reset removes the checklist without touching the worksheet
TestingLibraryElementError: Unable to find an accessible element with the role "checkbox" and name "Completion evidence placeholder"

Here are the accessible roles:

  paragraph:

  Name "":
  [36m<p />[39m

  --------------------------------------------------

Ignored nodes: comments, script, style
[36m<body>[39m
  [36m<div>[39m
    [36m<p>[39m
      [0mCompletion checklist pending[0m
    [36m</p>[39m
  [36m</div>[39m
[36m</body>[39m
 ❯ Object.getElementError node_modules/.pnpm/@testing-library+dom@10.4.1/node_modules/@testing-library/dom/dist/config.js:37:19
 ❯ node_modules/.pnpm/@testing-library+dom@10.4.1/node_modules/@testing-library/dom/dist/query-helpers.js:76:38
 ❯ node_modules/.pnpm/@testing-library+dom@10.4.1/node_modules/@testing-library/dom/dist/query-helpers.js:52:17
 ❯ node_modules/.pnpm/@testing-library+dom@10.4.1/node_modules/@testing-library/dom/dist/query-helpers.js:95:19
 ❯ src/features/performance/PerformanceChecklist.test.tsx:11:26
      9|   window.localStorage.setItem('playbook:performance-worksheet:v1', '{"…
     10|   const view = render(<PerformanceChecklist />)
     11|   fireEvent.click(screen.getByRole('checkbox', { name: DONE[0].text }))
       |                          ^
     12|   expect(screen.getByText('1 of 5 checks recorded')).toBeTruthy()
     13|   view.unmount()

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/4]⎯

 FAIL  |dom| src/features/performance/PerformanceChecklist.test.tsx > unknown, duplicate or malformed saved ids do not create a false completion count
TestingLibraryElementError: Unable to find an element with the text: 0 of 5 checks recorded. This could be because the text is broken up by multiple elements. In this case, you can provide a function for your text matcher to make your matcher more flexible.

Ignored nodes: comments, script, style
[36m<body>[39m
  [36m<div>[39m
    [36m<p>[39m
      [0mCompletion checklist pending[0m
    [36m</p>[39m
  [36m</div>[39m
[36m</body>[39m
 ❯ Object.getElementError node_modules/.pnpm/@testing-library+dom@10.4.1/node_modules/@testing-library/dom/dist/config.js:37:19
 ❯ node_modules/.pnpm/@testing-library+dom@10.4.1/node_modules/@testing-library/dom/dist/query-helpers.js:76:38
 ❯ node_modules/.pnpm/@testing-library+dom@10.4.1/node_modules/@testing-library/dom/dist/query-helpers.js:52:17
 ❯ node_modules/.pnpm/@testing-library+dom@10.4.1/node_modules/@testing-library/dom/dist/query-helpers.js:95:19
 ❯ src/features/performance/PerformanceChecklist.test.tsx:25:19
     23|     window.localStorage.setItem(CHECKLIST_KEY, raw)
     24|     const view = render(<PerformanceChecklist />)
     25|     expect(screen.getByText(raw.includes('obsolete') ? '1 of 5 checks …
       |                   ^
     26|     view.unmount()
     27|   }

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/4]⎯

 FAIL  |dom| src/features/performance/PerformanceChecklist.test.tsx > team notes include a named budget, query-plan review and ownership of the after window
TestingLibraryElementError: Unable to find an accessible element with the role "button" and name `/If you are not solo/i`

Here are the accessible roles:

  paragraph:

  Name "":
  [36m<p />[39m

  --------------------------------------------------

Ignored nodes: comments, script, style
[36m<body>[39m
  [36m<div>[39m
    [36m<p>[39m
      [0mCompletion checklist pending[0m
    [36m</p>[39m
  [36m</div>[39m
[36m</body>[39m
 ❯ Object.getElementError node_modules/.pnpm/@testing-library+dom@10.4.1/node_modules/@testing-library/dom/dist/config.js:37:19
 ❯ node_modules/.pnpm/@testing-library+dom@10.4.1/node_modules/@testing-library/dom/dist/query-helpers.js:76:38
 ❯ node_modules/.pnpm/@testing-library+dom@10.4.1/node_modules/@testing-library/dom/dist/query-helpers.js:52:17
 ❯ node_modules/.pnpm/@testing-library+dom@10.4.1/node_modules/@testing-library/dom/dist/query-helpers.js:95:19
 ❯ src/features/performance/PerformanceChecklist.test.tsx:32:23
     30| test('team notes include a named budget, query-plan review and ownersh…
     31|   render(<PerformanceChecklist />)
     32|   const open = screen.getByRole('button', { name: /If you are not solo…
       |                       ^
     33|   fireEvent.click(open)
     34|   for (const row of TEAM) expect(screen.getByText(row.detail)).toBeTru…

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[4/4]⎯


 Test Files  2 failed (2)
      Tests  4 failed (4)
   Start at  09:12:00
   Duration  785ms (transform 37ms, setup 90ms, import 44ms, tests 76ms, environment 513ms)

```

## green

True process exit: 0. Focused GREEN: four tests passed after implementing the supplied source.

```text

 RUN  v4.1.10 /Users/angelito/personal/Development-Playbook/web


 Test Files  2 passed (2)
      Tests  4 passed (4)
   Start at  09:12:13
   Duration  889ms (transform 69ms, setup 91ms, import 128ms, tests 132ms, environment 498ms)

```

## teeth

True process exit: 1. Teeth mutation hid only TEAM owner in the render. Exactly the team-notes render test failed because the observation owner detail was absent. The data test and other two render tests passed.

```text

 RUN  v4.1.10 /Users/angelito/personal/Development-Playbook/web

 ❯ |dom| src/features/performance/PerformanceChecklist.test.tsx (3 tests | 1 failed) 130ms
   × team notes include a named budget, query-plan review and ownership of the after window 12ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  |dom| src/features/performance/PerformanceChecklist.test.tsx > team notes include a named budget, query-plan review and ownership of the after window
TestingLibraryElementError: Unable to find an element with the text: Assign who observes the outcome after deployment and decides whether the change helped.. This could be because the text is broken up by multiple elements. In this case, you can provide a function for your text matcher to make your matcher more flexible.

Ignored nodes: comments, script, style
[36m<body>[39m
  [36m<div>[39m
    [36m<div[39m
      [33mclass[39m=[32m"border border-line bg-raised p-5 sm:p-6 "[39m
    [36m>[39m
      [36m<p[39m
        [33maria-live[39m=[32m"polite"[39m
        [33mclass[39m=[32m"t-data mb-4 text-sm text-muted"[39m
      [36m>[39m
        [0m0[0m
        [0m of [0m
        [0m5[0m
        [0m checks recorded[0m
      [36m</p>[39m
      [36m<ul[39m
        [33mclass[39m=[32m"space-y-2"[39m
      [36m>[39m
        [36m<li[39m
          [33mclass[39m=[32m"measure-full"[39m
        [36m>[39m
          [36m<label[39m
            [33mclass[39m=[32m"relative flex min-h-11 cursor-pointer items-start gap-3 border border-line p-3 text-sm focus-within:outline-2 focus-within:outline-brand"[39m
            [33mfor[39m=[32m"_r_c_-comparable"[39m
          [36m>[39m
            [36m<input[39m
              [33mclass[39m=[32m"peer absolute inset-0 h-full w-full cursor-pointer opacity-0"[39m
              [33mid[39m=[32m"_r_c_-comparable"[39m
              [33mtype[39m=[32m"checkbox"[39m
            [36m/>[39m
            [36m<span[39m
              [33maria-hidden[39m=[32m"true"[39m
              [33mclass[39m=[32m"mt-1 size-4 shrink-0 border border-line peer-checked:border-brand peer-checked:bg-brand"[39m
            [36m/>[39m
            [36m<span[39m
              [33mclass[39m=[32m"min-w-0 break-words"[39m
            [36m>[39m
              [0mThe same outcome is measured before and after, with comparable segment, data and cache state[0m
            [36m</span>[39m
          [36m</label>[39m
        [36m</li>[39m
        [36m<li[39m
          [33mclass[39m=[32m"measure-full"[39m
        [36m>[39m
          [36m<label[39m
            [33mclass[39m=[32m"relative flex min-h-11 cursor-pointer items-start gap-3 border border-line p-3 text-sm focus-within:outline-2 focus-within:outline-brand"[39m
            [33mfor[39m=[32m"_r_c_-field"[39m
          [36m>[39m
            [36m<input[39m
              [33mclass[39m=[32m"peer absolute inset-0 h-full w-full cursor-pointer opacity-0"[39m
              [33mid[39m=[32m"_r_c_-field"[39m
              [33mtype[39m=[32m"checkbox"[39m
            [36m/>[39m
            [36m<span[39m
              [33maria-hidden[39m=[32m"true"[39m
              [33mclass[39m=[32m"mt-1 size-4 shrink-0 border border-line peer-checked:border-brand peer-checked:bg-brand"[39m
            [36m/>[39m
            [36m<span[39m
              [33mclass[39m=[32m"min-w-0 break-words"[39m
            [36m>[39m
              [0mThe production or field comparison records the window, sample, percentile, failures and timeouts[0m
            [36m</span>[39m
          [36m</label>[39m
        [36m</li>[39m
        [36m<li[39m
          [33mclass[39m=[32m"measure-full"[39m
        [36m>[39m
          [36m<label[39m
            [33mclass[39m=[32m"relative flex min-h-11 cursor-pointer items-start gap-3 border border-line p-3 text-sm focus-within:outline-2 focus-within:outline-brand"[39m
            [33mfor[39m=[32m"_r_c_-target"[39m
          [36m>[39m
            [36m<input[39m
              [33mclass[39m=[32m"peer absolute inset-0 h-full w-full cursor-pointer opacity-0"[39m
              [33mid[39m=[32m"_r_c_-target"[39m
              [33mtype[39m=[32m"checkbox"[39m
            [36m/>[39m
            [36m<span[39m
              [33maria-hidden[39m=[32m"true"[39m
              [33mclass[39m=[32m"mt-1 size-4 shrink-0 border border-line peer-checked:border-brand peer-checked:bg-brand"[39m
            [36m/>[39m
            [36m<span[39m
              [33mclass[39m=[32m"min-w-0 break-words"[39m
            [36m>[39m
              [0mThe measured outcome meets its stated target, or the unresolved gap is recorded[0m
            [36m</span>[39m
          [36m</label>[39m
        [36m</li>[39m
        [36m<li[39m
          [33mclass[39m=[32m"measure-full"[39m
        [36m>[39m
          [36m<label[39m
            [33mclass[39m=[32m"relative flex min-h-11 cursor-pointer items-start gap-3 border border-line p-3 text-sm focus-within:outline-2 focus-within:outline-brand"[39m
            [33mfor[39m=[32m"_r_c_-correctness"[39m
          [36m>[39m
            [36m<input[39m
              [33mclass[39m=[32m"peer absolute inset-0 h-full w-full cursor-pointer opacity-0"[39m
              [33mid[39m=[32m"_r_c_-correctness"[39m
              [33mtype[39m=[32m"checkbox"[39m
            [36m/>[39m
            [36m<span[39m
              [33maria-hidden[39m=[32m"true"[39m
              [33mclass[39m=[32m"mt-1 size-4 shrink-0 border border-line peer-checked:border-brand peer-checked:bg-brand"[39m
            [36m/>[39m
            [36m<span[39m
              [33mclass[39m=[32m"min-w-0 break-words"[39m
            [36m>[39m
              [0mCorrectness tests pass and the order, payment and inventory behavior remains intact[0m
            [36m</span>[39m
          [36m</label>[39m
        [36m</li>[39m
        [36m<li[39m
          [33mclass[39m=[32m"measure-full"[39m
        [36m>[39m
          [36m<label[39m
            [33mclass[39m=[32m"relative flex min-h-11 cursor-pointer items-start gap-3 border border-line p-3 text-sm focus-within:outline-2 focus-within:outline-brand"[39m
            [33mfor[39m=[32m"_r_c_-disposition"[39m
          [36m>[39m
            [36m<input[39m
              [33mclass[39m=[32m"peer absolute inset-0 h-full w-full cursor-pointer opacity-0"[39m
              [33mid[39m=[32m"_r_c_-disposition"[39m
              [33mtype[39m=[32m"checkbox"[39m
            [36m/>[39m
            [36m<span[39m
              [33maria-hidden[39m=[32m"true"[39m
              [33mclass[39m=[32m"mt-1 size-4 shrink-0 border border-line peer-checked:border-brand peer-checked:bg-brand"[39m
            [36m/>[39m
            [36m<span[39m
              [33mclass[39m=[32m"min-w-0 break-words"[39m
            [36m>[39m
              [0mA failed or harmful change is reverted or explicitly carried as an open problem[0m
            [36m</span>[39m
          [36m</label>[39m
        [36m</li>[39m
      [36m</ul>[39m
      [36m<button[39m
        [33mclass[39m=[32m"mt-4 min-h-11 border border-line px-4 text-sm"[39m
        [33mtype[39m=[32m"button"[39m
      [36m>[39m
        [0mReset completion checks[0m
      [36m</button>[39m
      [36m<h3[39m
        [33mclass[39m=[32m"t-head mt-6 text-lg"[39m
      [36m>[39m
        [0mKeep these artifacts[0m
      [36m</h3>[39m
      [36m<ul[39m
        [33mclass[39m=[32m"mt-3 list-disc space-y-2 pl-5 text-sm text-muted"[39m
      [36m>[39m
        [36m<li>[39m
          [0mA baseline record naming the outcome, metric, scope, window, sample and target[0m
        [36m</li>[39m
        [36m<li>[39m
          [0mThe trace, query plan or controlled run that supports the chosen hypothesis[0m
        [36m</li>[39m
        [36m<li>[39m
          [0mThe change and its correctness/rollback checks[0m
        [36m</li>[39m
        [36m<li>[39m
          [0mA comparable before and after record, including unsuccessful attempts[0m
        [36m</li>[39m
      [36m</ul>[39m
      [36m<div[39m
        [33mclass[39m=[32m"mt-6"[39m
      [36m>[39m
        [36m<div[39m
          [33mclass[39m=[32m"border border-line bg-raised p-5 sm:p-6 p-0"[39m
        [36m>[39m
          [36m<h3>[39m
            [36m<button[39m
              [33maria-controls[39m=[32m"_r_d_"[39m
              [33maria-expanded[39m=[32m"true"[39m
              [33mclass[39m=[32m"flex min-h-11 w-full items-center justify-between gap-3.5 px-5 py-3.5 text-left transition-colors duration-150 hover:bg-sunken lg:min-h-9"[39m
              [33mtype[39m=[32m"button"[39m
            [36m>[39m
              [36m<span[39m
                [33mclass[39m=[32m"text-sm font-medium text-fg"[39m
              [36m>[39m
                [0mIf you are not solo[0m
              [36m</span>[39m
              [36m<svg[39m
                [33maria-hidden[39m=[32m"true"[39m
                [33mclass[39m=[32m"lucide lucide-chevron-down size-4 shrink-0 text-subtle transition-transform duration-150 rotate-180"[39m
                [33mfill[39m=[32m"none"[39m
                [33mheight[39m=[32m"24"[39m
                [33mstroke[39m=[32m"currentColor"[39m
                [33mstroke-linecap[39m=[32m"round"[39m
                [33mstroke-linejoin[39m=[32m"round"[39m
                [33mstroke-width[39m=[32m"2"[39m
                [33mviewBox[39m=[32m"0 0 24 24"[39m
                [33mwidth[39m=[32m"24"[39m
                [33mxmlns[39m=[32m"http://www.w3.org/2000/svg"[39m
              [36m>[39m
                [36m<path[39m
                  [33md[39m=[32m"m6 9 6 6 6-6"[39m
                [36m/>[39m
              [36m</svg>[39m
            [36m</button>[39m
          [36m</h3>[39m
          [36m<div[39m
            [33mclass[39m=[32m"space-y-2.5 border-t border-line bg-sunken px-5 py-4 text-[0.9375rem] leading-relaxed text-muted"[39m
            [33mid[39m=[32m"_r_d_"[39m
          [36m>[39m
            [36m<ul[39m
              [33mclass[39m=[32m"space-y-4"[39m
            [36m>[39m
              [36m<li>[39m
                [36m<h4[39m
                  [33mclass[39m=[32m"text-sm font-medium"[39m
                [36m>[39m
                  [0mPublish the targets[0m
                [36m</h4>[39m
                [36m<p[39m
                  [33mclass[39m=[32m"mt-1 text-sm text-muted"[39m
                [36m>[39m
                  [0mPublish the outcome, target and scope so everyone measures the same thing.[0m
                [36m</p>[39m
              [36m</li>[39m
              [36m<li>[39m
                [36m<h4[39m
                  [33mclass[39m=[32m"text-sm font-medium"[39m
                [36m>[39m
                  [0mName the CI budget[0m
                [36m</h4>[39m
                [36m<p[39m
                  [33mclass[39m=[32m"mt-1 text-sm text-muted"[39m
                [36m>[39m
                  [0mState the CI metric, threshold and representative run. A passing build alone is not a bundle-size budget.[0m
                [36m</p>[39m
              [36m</li>[39m
              [36m<li>[39m
                [36m<h4[39m
                  [33mclass[39m=[32m"text-sm font-medium"[39m
                [36m>[39m
                  [0mReview query plans[0m
                [36m</h4>[39m
                [36m<p[39m
                  [33mclass[39m=[32m"mt-1 text-sm text-muted"[39m
                [36m>[39m
                  [0mReview relevant query plans when data access changes on a measured slow path.[0m
                [36m</p>[39m
              [36m</li>[39m
            [36m</ul>[39m
          [36m</div>[39m
        [36m</div>[39m
      [36m</div>[39m
    [36m</div>[39m
  [36m</div>[39m
[36m</body>[39m
 ❯ Object.getElementError node_modules/.pnpm/@testing-library+dom@10.4.1/node_modules/@testing-library/dom/dist/config.js:37:19
 ❯ node_modules/.pnpm/@testing-library+dom@10.4.1/node_modules/@testing-library/dom/dist/query-helpers.js:76:38
 ❯ node_modules/.pnpm/@testing-library+dom@10.4.1/node_modules/@testing-library/dom/dist/query-helpers.js:52:17
 ❯ node_modules/.pnpm/@testing-library+dom@10.4.1/node_modules/@testing-library/dom/dist/query-helpers.js:95:19
 ❯ src/features/performance/PerformanceChecklist.test.tsx:34:41
     32|   const open = screen.getByRole('button', { name: /If you are not solo…
     33|   fireEvent.click(open)
     34|   for (const row of TEAM) expect(screen.getByText(row.detail)).toBeTru…
       |                                         ^
     35|   expect(open.getAttribute('aria-expanded')).toBe('true')
     36| })

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed | 1 passed (2)
      Tests  1 failed | 3 passed (4)
   Start at  09:12:15
   Duration  782ms (transform 48ms, setup 60ms, import 94ms, tests 132ms, environment 434ms)

```

## format

True process exit: 0. Formatted only the four owned files.

```text
src/features/performance/checklist.ts 27ms
src/features/performance/PerformanceChecklist.tsx 16ms
src/features/performance/checklist.test.ts 7ms
src/features/performance/PerformanceChecklist.test.tsx 8ms
```

## restored-green

True process exit: 0. Restored TEAM owner rendering and formatted; all four focused tests passed.

```text

 RUN  v4.1.10 /Users/angelito/personal/Development-Playbook/web


 Test Files  2 passed (2)
      Tests  4 passed (4)
   Start at  09:12:29
   Duration  899ms (transform 59ms, setup 113ms, import 106ms, tests 142ms, environment 473ms)

```

## full-suite

True process exit: 0. Full project suite: 193 test files and 1443 tests passed. No failures or warnings observed.

```text

> web@0.1.0 test /Users/angelito/personal/Development-Playbook/web
> vitest run


 RUN  v4.1.10 /Users/angelito/personal/Development-Playbook/web


 Test Files  193 passed (193)
      Tests  1443 passed (1443)
   Start at  09:12:31
   Duration  22.97s (transform 13.20s, setup 9.63s, import 30.89s, tests 31.64s, environment 53.19s)

```

## typecheck

True process exit: 0. Route typegen and TypeScript passed through pnpm typecheck.

```text

> web@0.1.0 typecheck /Users/angelito/personal/Development-Playbook/web
> next typegen && tsc --noEmit

Generating route types...
✓ Types generated successfully
```

## lint

True process exit: 0. Project eslint --max-warnings 0 passed.

```text

> web@0.1.0 lint /Users/angelito/personal/Development-Playbook/web
> eslint --max-warnings 0

```

Commit: 7385e1176ed2bf3466c30dca68f18bd3557f11fd. Only the four owned files were committed with the required trailer; working tree is clean.

The initial unprivileged git add and commit were blocked by the normal read-only .git sandbox (index.lock creation denied). Scoped authorized escalation completed staging and commit; this is resolved and no review rejection occurred.

## commit

True process exit: 128. Normal sandbox write restriction.

```text
fatal: Unable to create '/Users/angelito/personal/Development-Playbook/.git/index.lock': Operation not permitted
```

## commit-authorized

True process exit: 0. Authorized commit succeeded; commit hooks formatted unchanged files and lint passed.

```text
╭───────────────────────────────────────╮
│ lefthook  v2.1.10   hook:  [1mpre-commit[m │
╰───────────────────────────────────────╯
┃  format ❯ 
src/features/performance/PerformanceChecklist.test.tsx 38ms (unchanged)
src/features/performance/PerformanceChecklist.tsx 16ms (unchanged)
src/features/performance/checklist.test.ts 4ms (unchanged)
src/features/performance/checklist.ts 3ms (unchanged)

┃  lint ❯ 

[38;2;56;56;56m  ────────────────────────────────────[m
summary: (done in 2.17 seconds)
✓ format (0.40 seconds)
✓ lint (2.16 seconds)
[feat/stage-09-performance-port 7385e11] feat(performance): record completion and team ownership
 4 files changed, 222 insertions(+)
 create mode 100644 web/src/features/performance/PerformanceChecklist.test.tsx
 create mode 100644 web/src/features/performance/PerformanceChecklist.tsx
 create mode 100644 web/src/features/performance/checklist.test.ts
 create mode 100644 web/src/features/performance/checklist.ts
```


## Task 6 independent review

Spec and quality: review clean. No findings. All eleven raw fences match their logs and recorded exits. Commit trailer verified. Review source: `task-6-review.md`.


---

# Task 7 implementation report

Implemented the approved twelve teaching panels, seven optimization candidates, eight traps, three AI plays, evidence prompt and canonical coverage mapping. Added six terms and five Stage 09 references to their canonical registries, and generated the glossary with `pnpm gen:glossary`. Stage registration and readiness are untouched. Coordinator expanded ownership narrowly to canonical chapter vocabulary after the full-suite guard caught a plan-authored registry/chapter mismatch.

## Test rationale and deviations

The controlled disclosure test detects dropping a candidate's evidence, risk or comparable retest. The supplied test only inspected evidence and retest per row; added risk per row with InlineCode backticks removed, as agreed with the coordinator. The remaining tests detect ignored injected candidate data, inaccessible trap disclosures, conflated local budgets, corrupted copyable SQL lines, and missing clipboard fallback/evidence prompt contracts.

The import RED is missing modules only, not substantive behavior evidence. The minimal compilable skeleton then produced eight actual assertion failures: empty coverage, missing canonical term metadata, absent disclosures, absent target thresholds, absent SQL lines, and absent prompt copy controls. This failed for the right reason: the requested features and metadata had not yet been implemented.

The first implementation attempt passed 26/27 but failed the SQL render with `ResizeObserver is not defined`. Corrected initial diagnosis after tracing shared test setup: setup.ts already installs NoopResizeObserver, but the plan-authored blanket `afterEach(vi.unstubAllGlobals)` removes it after the first test. The SQL test now installs a local no-op browser API stub; it does not mock the real artifact, change the shared setup, or assert observer behavior. This setup failure is not claimed as implementation RED or GREEN.

The specified teeth mutation omitted the entire risk RevealFacet. Exactly the candidate disclosure test failed, at the added per-row risk assertion; seven Task 7 tests stayed green. Restored the complete risk facet and formatted before restored GREEN.

One generator invocation was attempted from repository root with a web-relative log destination; shell redirection failed before pnpm ran. Retried from web/. No generator output was falsely claimed from that failed invocation.

## Canonical vocabulary correction

The initial full-suite run failed for the expected registry-to-chapter mismatch: `a term pointing at a stage names something that stage actually says` reported four new orphans (LCP, INP, CLS and cache invalidation). This is PLAN-AUTHORED, not an implementer deviation: prescribed names and see links were absent verbatim from the canonical chapter. The coordinator approved narrow ownership of `docs/09-performance-optimization.md`, retaining all prescribed glossary names and metadata rather than weakening the guard or orphan allowlist.

Expanded the three first-encounter metric names while preserving ≤2.5 s, ≤200 ms, ≤0.1, p75 and both mobile/desktop segments, and named “cache invalidation” in the existing API caveat. Focused chapter/term/content guards passed 13/13. Removing only the expanded LCP name made exactly the orphan guard fail (12 others passed); restored name returned to 13/13. Humanizer pass preserved the plain technical threshold and API statements; no semantic rewrite was needed. Canonical chapter commits separately before the feature commit.

## Self-review

Preserved the drawing theme, native reusable disclosure/drill controls, explicit term spacing, semantic warning colour for correctness risk and brand attention labels. All invented measurements are labeled hypothetical; no real production p95 is claimed. SQL remains the two exact artifact lines. API caveats preserve Server Actions-only updateTag, migration locking/transaction/invalid-index risks, eager LCP loading and compatible static-export loader requirements. No runtime caching is enabled.

Humanizer pass: retained specific technical caveats and concrete language. Draft change: “This practice now uses browser checkout” → “This practice uses browser checkout.” Remaining review found no clustered filler or inflated claims requiring a rewrite. Final removes diff-anchored “now” without altering the teaching contract.

Deferred: Stage 8 registration/readiness and six term opening checks, live production/dev console/contrast/responsive auditing after assembly, real telemetry, W-6 sheets, shared-drill extraction, merge/push/deployment, and coordinator-owned canonical documentation.

## Completion

Commits: `af9cc5e` (canonical vocabulary) and `159e47c` (teaching panels and registries). Final full suite: **1451/1451 tests, 195/195 files**. Focused Task 7/registry suite: 27/27; canonical chapter suite: 13/13. Typecheck, lint and owned formatting passed. Commit hooks reported every owned TypeScript file unchanged by formatting and lint passed. Working tree clean after both commits. NOT merged, NOT pushed, NOT deployed.

Git metadata writes initially failed sandbox restrictions (`index.lock: Operation not permitted`); retried with approved git escalation. No automatic-review rejection occurred. The initial failed commit output is retained.

No unresolved Task 7 implementation defect. Stage-level browser checks and term opening remain coordinator/Task 8 follow-up, since this task does not register the stage.

## Evidence

### Initial missing-module RED (exit 1; no assertion evidence)

Raw log: `task-7-import-red.log`. Actual exit status: 1.

```text

 RUN  v4.1.10 /Users/angelito/personal/Development-Playbook/web

 ❯ |unit| src/features/performance/content.test.ts (0 test)
 ❯ |dom| src/features/performance/panels.test.tsx (0 test)

⎯⎯⎯⎯⎯⎯ Failed Suites 2 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  |unit| src/features/performance/content.test.ts [ src/features/performance/content.test.ts ]
Error: Cannot find module './content' imported from /Users/angelito/personal/Development-Playbook/web/src/features/performance/content.test.ts
 ❯ src/features/performance/content.test.ts:6:1
      4| import { getTerm } from '@/lib/terms'
      5| import { getReferences } from '@/lib/references'
      6| import { AI_PROMPT, COVERAGE, FIXES, TRAPS } from './content'
       | ^
      7|
      8| const chapter = () => readFileSync(resolve(process.cwd(), '../docs/09-…

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/2]⎯

 FAIL  |dom| src/features/performance/panels.test.tsx [ src/features/performance/panels.test.tsx ]
Error: Failed to resolve import "./panels-diagnose" from "src/features/performance/panels.test.tsx". Does the file exist?
  Plugin: vite:import-analysis
  File: /Users/angelito/personal/Development-Playbook/web/src/features/performance/panels.test.tsx:4:39
  2  |  import { afterEach, expect, test, vi } from "vitest";
  3  |  import { AIPanel, TrapsPanel } from "./panels-close";
  4  |  import { FixesPanel, QueryPanel } from "./panels-diagnose";
     |                                          ^
  5  |  import { TargetsPanel } from "./panels-measure";
  6  |  import { AI_PROMPT, FIXES, TRAPS } from "./content";
 ❯ TransformPluginContext._formatLog node_modules/.pnpm/vite@8.1.5_@types+node@22.20.1_jiti@2.7.0/node_modules/vite/dist/node/chunks/node.js:30416:39
 ❯ TransformPluginContext.error node_modules/.pnpm/vite@8.1.5_@types+node@22.20.1_jiti@2.7.0/node_modules/vite/dist/node/chunks/node.js:30413:14
 ❯ normalizeUrl node_modules/.pnpm/vite@8.1.5_@types+node@22.20.1_jiti@2.7.0/node_modules/vite/dist/node/chunks/node.js:27438:18
 ❯ node_modules/.pnpm/vite@8.1.5_@types+node@22.20.1_jiti@2.7.0/node_modules/vite/dist/node/chunks/node.js:27506:30
 ❯ TransformPluginContext.transform node_modules/.pnpm/vite@8.1.5_@types+node@22.20.1_jiti@2.7.0/node_modules/vite/dist/node/chunks/node.js:27474:4
 ❯ EnvironmentPluginContainer.transform node_modules/.pnpm/vite@8.1.5_@types+node@22.20.1_jiti@2.7.0/node_modules/vite/dist/node/chunks/node.js:30201:14
 ❯ loadAndTransform node_modules/.pnpm/vite@8.1.5_@types+node@22.20.1_jiti@2.7.0/node_modules/vite/dist/node/chunks/node.js:20124:26

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/2]⎯


 Test Files  2 failed (2)
      Tests  no tests
   Start at  09:17:01
   Duration  826ms (transform 60ms, setup 90ms, import 0ms, tests 0ms, environment 609ms)

```

### Compilable skeleton assertion RED (exit 1; 8 expected failures)

Raw log: `task-7-assertion-red.log`. Actual exit status: 1.

```text

 RUN  v4.1.10 /Users/angelito/personal/Development-Playbook/web

 ❯ |unit| src/features/performance/content.test.ts (2 tests | 2 failed) 6ms
   × coverage names every canonical section including bold fix and trap items 5ms
   × new first-encounter terms and five extending references exist in their single sources 1ms
 ❯ |dom| src/features/performance/panels.test.tsx (6 tests | 6 failed) 75ms
   × every candidate reveals evidence, correctness risk and comparable retest instead of a blanket recommendation 61ms
   × changed candidate data changes what the reader sees rather than only passing a data invariant 3ms
   × every canonical trap is consultable by its own label 3ms
   × targets distinguish inclusive published thresholds from local product budgets 2ms
   × the SQL artifact renders its exact copyable lines separately from notes 3ms
   × the AI prompt requires real evidence and handles rejected copying without an unhandled promise 2ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 8 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  |unit| src/features/performance/content.test.ts > coverage names every canonical section including bold fix and trap items
AssertionError: expected [] to deeply equal [ 'Entry criteria', …(11) ]

- Expected
+ Received

- [
-   "Entry criteria",
-   "Map the order journey",
-   "Measure the first baseline",
-   "Decide what fast enough means",
-   "Find the real bottleneck",
-   "The fixes that usually matter",
-   "When not to optimize",
-   "AI in performance optimization",
-   "Artifacts",
-   "Definition of done",
-   "Scaling to a team",
-   "Traps",
- ]
+ []

 ❯ src/features/performance/content.test.ts:13:33
     11|   const md = chapter()
     12|   const headings = [...md.matchAll(/^#{2,3} (.+)$/gm)].map((m) => m[1]…
     13|   expect(Object.keys(COVERAGE)).toEqual(headings)
       |                                 ^
     14|   const fixes = md.split('### The fixes that usually matter')[1].split…
     15|   const titles = (text: string) => [...text.matchAll(/^\*\*([^*]+)\.\*…

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/8]⎯

 FAIL  |unit| src/features/performance/content.test.ts > new first-encounter terms and five extending references exist in their single sources
AssertionError: expected undefined to be '09-performance-optimization' // Object.is equality

- Expected:
"09-performance-optimization"

+ Received:
undefined

 ❯ src/features/performance/content.test.ts:22:30
     20| test('new first-encounter terms and five extending references exist in…
     21|   for (const id of ['lcp', 'inp', 'cls', 'n-plus-one', 'query-plan', '…
     22|     expect(getTerm(id)?.see).toBe('09-performance-optimization')
       |                              ^
     23|   }
     24|   expect(getReferences('09-performance-optimization').map((row) => row…

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/8]⎯

 FAIL  |dom| src/features/performance/panels.test.tsx > every candidate reveals evidence, correctness risk and comparable retest instead of a blanket recommendation
TestingLibraryElementError: Unable to find an accessible element with the role "button" and name "Index or query shape"

There are no accessible roles. But there might be some inaccessible roles. If you wish to access them, then set the `hidden` option to `true`. Learn more about this here: https://testing-library.com/docs/dom-testing-library/api-queries#byrole

Ignored nodes: comments, script, style
[36m<body>[39m
  [36m<div />[39m
[36m</body>[39m
 ❯ Object.getElementError node_modules/.pnpm/@testing-library+dom@10.4.1/node_modules/@testing-library/dom/dist/config.js:37:19
 ❯ node_modules/.pnpm/@testing-library+dom@10.4.1/node_modules/@testing-library/dom/dist/query-helpers.js:76:38
 ❯ node_modules/.pnpm/@testing-library+dom@10.4.1/node_modules/@testing-library/dom/dist/query-helpers.js:52:17
 ❯ node_modules/.pnpm/@testing-library+dom@10.4.1/node_modules/@testing-library/dom/dist/query-helpers.js:95:19
 ❯ src/features/performance/panels.test.tsx:14:27
     12|   render(<FixesPanel />)
     13|   for (const row of FIXES) {
     14|     const toggle = screen.getByRole('button', { name: row.title })
       |                           ^
     15|     fireEvent.click(toggle)
     16|     const detail = document.getElementById(toggle.getAttribute('aria-c…

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/8]⎯

 FAIL  |dom| src/features/performance/panels.test.tsx > changed candidate data changes what the reader sees rather than only passing a data invariant
TestingLibraryElementError: Unable to find an accessible element with the role "button" and name `/Index or query shape/`

There are no accessible roles. But there might be some inaccessible roles. If you wish to access them, then set the `hidden` option to `true`. Learn more about this here: https://testing-library.com/docs/dom-testing-library/api-queries#byrole

Ignored nodes: comments, script, style
[36m<body>[39m
  [36m<div />[39m
[36m</body>[39m
 ❯ Object.getElementError node_modules/.pnpm/@testing-library+dom@10.4.1/node_modules/@testing-library/dom/dist/config.js:37:19
 ❯ node_modules/.pnpm/@testing-library+dom@10.4.1/node_modules/@testing-library/dom/dist/query-helpers.js:76:38
 ❯ node_modules/.pnpm/@testing-library+dom@10.4.1/node_modules/@testing-library/dom/dist/query-helpers.js:52:17
 ❯ node_modules/.pnpm/@testing-library+dom@10.4.1/node_modules/@testing-library/dom/dist/query-helpers.js:95:19
 ❯ src/features/performance/panels.test.tsx:35:26
     33| test('changed candidate data changes what the reader sees rather than …
     34|   render(<FixesPanel fixes={[{ ...FIXES[0], retest: 'Measure the chang…
     35|   fireEvent.click(screen.getByRole('button', { name: /Index or query s…
       |                          ^
     36|   expect(screen.getByText('Measure the changed user boundary.')).toBeT…
     37| })

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[4/8]⎯

 FAIL  |dom| src/features/performance/panels.test.tsx > every canonical trap is consultable by its own label
TestingLibraryElementError: Unable to find an accessible element with the role "button" and name `/Optimizing without measuring/`

There are no accessible roles. But there might be some inaccessible roles. If you wish to access them, then set the `hidden` option to `true`. Learn more about this here: https://testing-library.com/docs/dom-testing-library/api-queries#byrole

Ignored nodes: comments, script, style
[36m<body>[39m
  [36m<div />[39m
[36m</body>[39m
 ❯ Object.getElementError node_modules/.pnpm/@testing-library+dom@10.4.1/node_modules/@testing-library/dom/dist/config.js:37:19
 ❯ node_modules/.pnpm/@testing-library+dom@10.4.1/node_modules/@testing-library/dom/dist/query-helpers.js:76:38
 ❯ node_modules/.pnpm/@testing-library+dom@10.4.1/node_modules/@testing-library/dom/dist/query-helpers.js:52:17
 ❯ node_modules/.pnpm/@testing-library+dom@10.4.1/node_modules/@testing-library/dom/dist/query-helpers.js:95:19
 ❯ src/features/performance/panels.test.tsx:42:28
     40|   render(<TrapsPanel />)
     41|   for (const row of TRAPS) {
     42|     fireEvent.click(screen.getByRole('button', { name: new RegExp(row.…
       |                            ^
     43|     expect(screen.getByText(row.detail)).toBeTruthy()
     44|   }

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[5/8]⎯

 FAIL  |dom| src/features/performance/panels.test.tsx > targets distinguish inclusive published thresholds from local product budgets
AssertionError: expected '' to contain 'LCP ≤2.5 s'

- Expected
+ Received

- LCP ≤2.5 s

 ❯ src/features/performance/panels.test.tsx:49:37
     47| test('targets distinguish inclusive published thresholds from local pr…
     48|   render(<TargetsPanel />)
     49|   expect(document.body.textContent).toContain('LCP ≤2.5 s')
       |                                     ^
     50|   expect(document.body.textContent).toContain('INP ≤200 ms')
     51|   expect(document.body.textContent).toContain('CLS ≤0.1')

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[6/8]⎯

 FAIL  |dom| src/features/performance/panels.test.tsx > the SQL artifact renders its exact copyable lines separately from notes
AssertionError: expected [] to deeply equal [ 'EXPLAIN (ANALYZE, BUFFERS)', …(1) ]

- Expected
+ Received

- [
-   "EXPLAIN (ANALYZE, BUFFERS)",
-   "SELECT sku, available FROM inventory WHERE sku IN ('A', 'B');",
- ]
+ []

 ❯ src/features/performance/panels.test.tsx:59:17
     57|   const { container } = render(<QueryPanel />)
     58|   const lines = [...container.querySelectorAll('[data-artifact-line]')…
     59|   expect(lines).toEqual(INVENTORY_PLAN.lines.map((line) => line.text))
       |                 ^
     60| })
     61|

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[7/8]⎯

 FAIL  |dom| src/features/performance/panels.test.tsx > the AI prompt requires real evidence and handles rejected copying without an unhandled promise
TestingLibraryElementError: Unable to find an accessible element with the role "button" and name "Copy evidence prompt"

There are no accessible roles. But there might be some inaccessible roles. If you wish to access them, then set the `hidden` option to `true`. Learn more about this here: https://testing-library.com/docs/dom-testing-library/api-queries#byrole

Ignored nodes: comments, script, style
[36m<body>[39m
  [36m<div />[39m
[36m</body>[39m
 ❯ Object.getElementError node_modules/.pnpm/@testing-library+dom@10.4.1/node_modules/@testing-library/dom/dist/config.js:37:19
 ❯ node_modules/.pnpm/@testing-library+dom@10.4.1/node_modules/@testing-library/dom/dist/query-helpers.js:76:38
 ❯ node_modules/.pnpm/@testing-library+dom@10.4.1/node_modules/@testing-library/dom/dist/query-helpers.js:52:17
 ❯ node_modules/.pnpm/@testing-library+dom@10.4.1/node_modules/@testing-library/dom/dist/query-helpers.js:95:19
 ❯ src/features/performance/panels.test.tsx:66:50
     64|   vi.stubGlobal('navigator', { clipboard: { writeText } })
     65|   render(<AIPanel />)
     66|   await act(async () => { fireEvent.click(screen.getByRole('button', {…
       |                                                  ^
     67|   expect(writeText).toHaveBeenCalledWith(AI_PROMPT)
     68|   expect((screen.getByLabelText('Evidence prompt') as HTMLTextAreaElem…
 ❯ node_modules/.pnpm/@testing-library+react@16.3.2_@testing-library+dom@10.4.1_@types+react-dom@19.2.3_@type_796f041f1bf25f255ff84691b91a8ac6/node_modules/@testing-library/react/dist/act-compat.js:47:24
 ❯ process.env.NODE_ENV.exports.act node_modules/.pnpm/react@19.2.4/node_modules/react/cjs/react.development.js:814:22
 ❯ node_modules/.pnpm/@testing-library+react@16.3.2_@testing-library+dom@10.4.1_@types+react-dom@19.2.3_@type_796f041f1bf25f255ff84691b91a8ac6/node_modules/@testing-library/react/dist/act-compat.js:46:25
 ❯ src/features/performance/panels.test.tsx:66:9

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[8/8]⎯


 Test Files  2 failed (2)
      Tests  8 failed (8)
   Start at  09:17:16
   Duration  928ms (transform 138ms, setup 83ms, import 168ms, tests 82ms, environment 648ms)

```

### Generated glossary (exit 0; 1 snapshot updated)

Raw log: `task-7-generator.log`. Actual exit status: 0.

```text

> web@0.1.0 gen:glossary /Users/angelito/personal/Development-Playbook/web
> vitest run src/lib/glossary.test.ts --update


 RUN  v4.1.10 /Users/angelito/personal/Development-Playbook/web


  Snapshots  1 updated 
 Test Files  1 passed (1)
      Tests  1 passed (1)
   Start at  09:17:36
   Duration  370ms (transform 59ms, setup 0ms, import 71ms, tests 11ms, environment 0ms)

```

### First implementation attempt: environment/setup failure (exit 1; 26 passed, SQL ResizeObserver failure)

Raw log: `task-7-green.log`. Actual exit status: 1.

```text

 RUN  v4.1.10 /Users/angelito/personal/Development-Playbook/web

 ❯ |dom| src/features/performance/panels.test.tsx (6 tests | 1 failed) 364ms
   × the SQL artifact renders its exact copyable lines separately from notes 7ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  |dom| src/features/performance/panels.test.tsx > the SQL artifact renders its exact copyable lines separately from notes
ReferenceError: ResizeObserver is not defined
 ❯ src/components/ArtifactControls.tsx:51:22
     49|     // Width is the only thing that changes the answer, and it changes…
     50|     // viewport resize and on the rail collapsing at `lg`.
     51|     const observer = new ResizeObserver(sync)
       |                      ^
     52|     observer.observe(root)
     53|     return () => observer.disconnect()
 ❯ commitAttachRef node_modules/.pnpm/react-dom@19.2.4_react@19.2.4/node_modules/react-dom/cjs/react-dom-client.development.js:13482:44
 ❯ runWithFiberInDEV node_modules/.pnpm/react-dom@19.2.4_react@19.2.4/node_modules/react-dom/cjs/react-dom-client.development.js:874:13
 ❯ safelyAttachRef node_modules/.pnpm/react-dom@19.2.4_react@19.2.4/node_modules/react-dom/cjs/react-dom-client.development.js:13500:9
 ❯ commitLayoutEffectOnFiber node_modules/.pnpm/react-dom@19.2.4_react@19.2.4/node_modules/react-dom/cjs/react-dom-client.development.js:14089:26
 ❯ recursivelyTraverseLayoutEffects node_modules/.pnpm/react-dom@19.2.4_react@19.2.4/node_modules/react-dom/cjs/react-dom-client.development.js:15159:11
 ❯ commitLayoutEffectOnFiber node_modules/.pnpm/react-dom@19.2.4_react@19.2.4/node_modules/react-dom/cjs/react-dom-client.development.js:13949:11
 ❯ recursivelyTraverseLayoutEffects node_modules/.pnpm/react-dom@19.2.4_react@19.2.4/node_modules/react-dom/cjs/react-dom-client.development.js:15159:11
 ❯ commitLayoutEffectOnFiber node_modules/.pnpm/react-dom@19.2.4_react@19.2.4/node_modules/react-dom/cjs/react-dom-client.development.js:14065:11
 ❯ recursivelyTraverseLayoutEffects node_modules/.pnpm/react-dom@19.2.4_react@19.2.4/node_modules/react-dom/cjs/react-dom-client.development.js:15159:11

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed | 4 passed (5)
      Tests  1 failed | 26 passed (27)
   Start at  09:17:38
   Duration  1.44s (transform 348ms, setup 79ms, import 508ms, tests 407ms, environment 673ms)

```

### Focused GREEN (exit 0; 27/27)

Raw log: `task-7-green-fixed.log`. Actual exit status: 0.

```text

 RUN  v4.1.10 /Users/angelito/personal/Development-Playbook/web


 Test Files  5 passed (5)
      Tests  27 passed (27)
   Start at  09:18:14
   Duration  1.75s (transform 963ms, setup 100ms, import 1.15s, tests 424ms, environment 746ms)

```

### Owned-file formatting (exit 0)

Raw log: `task-7-format.log`. Actual exit status: 0.

```text
src/features/performance/content.ts 41ms
src/features/performance/panels-measure.tsx 12ms
src/features/performance/panels-diagnose.tsx 12ms
src/features/performance/panels-close.tsx 8ms
src/features/performance/content.test.ts 8ms
src/features/performance/panels.test.tsx 17ms
src/lib/terms.ts 50ms
src/lib/references.ts 13ms
```

### Restored focused GREEN after mutation and formatting (exit 0; 27/27)

Raw log: `task-7-restored.log`. Actual exit status: 0.

```text

 RUN  v4.1.10 /Users/angelito/personal/Development-Playbook/web


 Test Files  5 passed (5)
      Tests  27 passed (27)
   Start at  09:18:37
   Duration  2.63s (transform 685ms, setup 132ms, import 997ms, tests 694ms, environment 1.02s)

```

### Lint (exit 0)

Raw log: `task-7-lint.log`. Actual exit status: 0.

```text

> web@0.1.0 lint /Users/angelito/personal/Development-Playbook/web
> eslint --max-warnings 0

```

### Typecheck with route generation (exit 0)

Raw log: `task-7-typecheck.log`. Actual exit status: 0.

```text

> web@0.1.0 typecheck /Users/angelito/personal/Development-Playbook/web
> next typegen && tsc --noEmit

Generating route types...
✓ Types generated successfully
```

### Risk disclosure omission teeth check (exit 1; exactly 1 failed, 7 passed)

Raw log: `task-7-teeth.log`. Actual exit status: 1.

```text

 RUN  v4.1.10 /Users/angelito/personal/Development-Playbook/web

 ❯ |dom| src/features/performance/panels.test.tsx (6 tests | 1 failed) 278ms
   × every candidate reveals evidence, correctness risk and comparable retest instead of a blanket recommendation 129ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  |dom| src/features/performance/panels.test.tsx > every candidate reveals evidence, correctness risk and comparable retest instead of a blanket recommendation
AssertionError: expected 'EvidenceA representative slow order-h…' to contain 'Normal CREATE INDEX blocks writes whi…'

Expected: "Normal CREATE INDEX blocks writes while building. CONCURRENTLY takes longer, cannot run inside a transaction block, and failure can leave an invalid index. Check the migration runner and cleanup."
Received: "EvidenceA representative slow order-history plan can justify testing (owner_id, created_at DESC) for the owner filter and creation sort. Consider table size, selectivity and write cost.Comparable retestCompare the same query and workload, then measure the selected user outcome. Keep correctness and write cost visible."

 ❯ src/features/performance/panels.test.tsx:18:32
     16|     const detail = document.getElementById(toggle.getAttribute('aria-c…
     17|     expect(detail.textContent).toContain(row.evidence.replace(/`/g, ''…
     18|     expect(detail.textContent).toContain(row.risk.replace(/`/g, ''))
       |                                ^
     19|     expect(detail.textContent).toContain(row.retest)
     20|   }

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed | 1 passed (2)
      Tests  1 failed | 7 passed (8)
   Start at  09:18:18
   Duration  1.11s (transform 212ms, setup 104ms, import 274ms, tests 280ms, environment 432ms)

```

### Initial full suite (exit 1; 1450 passed, 1 failed across 195 files)

Raw log: `task-7-full.log`. Actual exit status: 1.

```text

> web@0.1.0 test /Users/angelito/personal/Development-Playbook/web
> vitest run


 RUN  v4.1.10 /Users/angelito/personal/Development-Playbook/web

 ❯ |unit| src/lib/term-usage.test.ts (2 tests | 1 failed) 53ms
   × a term pointing at a stage names something that stage actually says 42ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  |unit| src/lib/term-usage.test.ts > a term pointing at a stage names something that stage actually says
AssertionError: expected [ …(33) ] to deeply equal [ …(29) ]

- Expected
+ Received

@@ -1,6 +1,10 @@
  [
+   "lcp -> 09-performance-optimization (never says \"LCP (Largest Contentful Paint)\")",
+   "inp -> 09-performance-optimization (never says \"INP (Interaction to Next Paint)\")",
+   "cls -> 09-performance-optimization (never says \"CLS (Cumulative Layout Shift)\")",
+   "cache-invalidation -> 09-performance-optimization (never says \"Cache invalidation\")",
    "opportunity-solution-tree -> 01-product-discovery (never says \"Opportunity solution tree\")",
    "problem-interview -> 01-product-discovery (never says \"Problem interview\")",
    "mvp -> 02-planning (never says \"MVP (Minimum Viable Product)\")",
    "product-roadmap -> 02-planning (never says \"Product roadmap\")",
    "product-vision -> 02-planning (never says \"Product vision\")",

 ❯ src/lib/term-usage.test.ts:98:21
     96|   }
     97|
     98|   expect(offenders).toEqual(KNOWN_ORPHANS)
       |                     ^
     99| })
    100|

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed | 194 passed (195)
      Tests  1 failed | 1450 passed (1451)
   Start at  09:18:53
   Duration  28.06s (transform 16.84s, setup 12.86s, import 38.46s, tests 47.42s, environment 64.48s)

 ELIFECYCLE  Test failed. See above for more details.
```

### Canonical vocabulary GREEN (exit 0; 13/13)

Raw log: `task-7-chapter-green.log`. Actual exit status: 0.

```text

 RUN  v4.1.10 /Users/angelito/personal/Development-Playbook/web


 Test Files  3 passed (3)
      Tests  13 passed (13)
   Start at  09:20:58
   Duration  181ms (transform 120ms, setup 0ms, import 151ms, tests 37ms, environment 0ms)

```

### Expanded LCP name removal teeth (exit 1; orphan guard only, 12 passed)

Raw log: `task-7-chapter-teeth.log`. Actual exit status: 1.

```text

 RUN  v4.1.10 /Users/angelito/personal/Development-Playbook/web

 ❯ |unit| src/lib/term-usage.test.ts (2 tests | 1 failed) 32ms
   × a term pointing at a stage names something that stage actually says 21ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  |unit| src/lib/term-usage.test.ts > a term pointing at a stage names something that stage actually says
AssertionError: expected [ …(30) ] to deeply equal [ …(29) ]

- Expected
+ Received

@@ -1,6 +1,7 @@
  [
+   "lcp -> 09-performance-optimization (never says \"LCP (Largest Contentful Paint)\")",
    "opportunity-solution-tree -> 01-product-discovery (never says \"Opportunity solution tree\")",
    "problem-interview -> 01-product-discovery (never says \"Problem interview\")",
    "mvp -> 02-planning (never says \"MVP (Minimum Viable Product)\")",
    "product-roadmap -> 02-planning (never says \"Product roadmap\")",
    "product-vision -> 02-planning (never says \"Product vision\")",

 ❯ src/lib/term-usage.test.ts:98:21
     96|   }
     97|
     98|   expect(offenders).toEqual(KNOWN_ORPHANS)
       |                     ^
     99| })
    100|

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed | 2 passed (3)
      Tests  1 failed | 12 passed (13)
   Start at  09:21:00
   Duration  171ms (transform 106ms, setup 0ms, import 137ms, tests 40ms, environment 0ms)

```

### Restored canonical vocabulary GREEN (exit 0; 13/13)

Raw log: `task-7-chapter-restored.log`. Actual exit status: 0.

```text

 RUN  v4.1.10 /Users/angelito/personal/Development-Playbook/web


 Test Files  3 passed (3)
      Tests  13 passed (13)
   Start at  09:21:02
   Duration  177ms (transform 107ms, setup 0ms, import 138ms, tests 36ms, environment 0ms)

```

### Canonical vocabulary formatting (exit 0)

Raw log: `task-7-chapter-format.log`. Actual exit status: 0.

```text
```

### Final full suite GREEN (exit 0; 1451/1451 across 195 files)

Raw log: `task-7-full-restored.log`. Actual exit status: 0.

```text

> web@0.1.0 test /Users/angelito/personal/Development-Playbook/web
> vitest run


 RUN  v4.1.10 /Users/angelito/personal/Development-Playbook/web


 Test Files  195 passed (195)
      Tests  1451 passed (1451)
   Start at  09:21:18
   Duration  22.42s (transform 10.96s, setup 10.73s, import 26.81s, tests 29.72s, environment 55.74s)

```

### Initial sandbox-limited canonical commit attempt (exit 128)

Raw log: `task-7-doc-commit.log`. Actual exit status: 128.

```text
fatal: Unable to create '/Users/angelito/personal/Development-Playbook/.git/index.lock': Operation not permitted
```

### Canonical vocabulary commit (exit 0; af9cc5e)

Raw log: `task-7-doc-commit-escalated.log`. Actual exit status: 0.

```text
╭───────────────────────────────────────╮
│ lefthook  v2.1.10   hook:  [1mpre-commit[m │
╰───────────────────────────────────────╯
│  lint (skip) no files for inspection
│  format (skip) no files for inspection
[38;2;56;56;56m  ────────────────────────────────────[m
summary: (done in 0.02 seconds)
[feat/stage-09-performance-port af9cc5e] docs(performance): expand first-encounter metric names
 1 file changed, 4 insertions(+), 4 deletions(-)
```

### Owned feature commit and hooks (exit 0; 159e47c)

Raw log: `task-7-feature-commit.log`. Actual exit status: 0.

```text
╭───────────────────────────────────────╮
│ lefthook  v2.1.10   hook:  [1mpre-commit[m │
╰───────────────────────────────────────╯
┃  format ❯ 
src/features/performance/content.test.ts 41ms (unchanged)
src/features/performance/content.ts 12ms (unchanged)
src/features/performance/panels-close.tsx 11ms (unchanged)
src/features/performance/panels-diagnose.tsx 11ms (unchanged)
src/features/performance/panels-measure.tsx 8ms (unchanged)
src/features/performance/panels.test.tsx 11ms (unchanged)
src/lib/references.ts 23ms (unchanged)
src/lib/terms.ts 26ms (unchanged)

┃  lint ❯ 

[38;2;56;56;56m  ────────────────────────────────────[m
summary: (done in 2.22 seconds)
✓ format (0.53 seconds)
✓ lint (2.18 seconds)
[feat/stage-09-performance-port 159e47c] feat(performance): teach evidence-based optimization candidates
 9 files changed, 779 insertions(+)
 create mode 100644 web/src/features/performance/content.test.ts
 create mode 100644 web/src/features/performance/content.ts
 create mode 100644 web/src/features/performance/panels-close.tsx
 create mode 100644 web/src/features/performance/panels-diagnose.tsx
 create mode 100644 web/src/features/performance/panels-measure.tsx
 create mode 100644 web/src/features/performance/panels.test.tsx
```

## Report integrity

Programmatically extracted all 19 terminal fences and checked exact equality with retained log files, plus each separately recorded process exit. All 19 matched.

## Task 7 independent review

Spec compliant; task approved after two PLAN-AUTHORED corrections. No unresolved findings. All nineteen logs/exits match the report exactly; both isolated teeth checks substantiate the fixes. Commit trailers verified. Review source: `task-7-review.md`.


---

# Task 8 implementation report

Base: `7ea84fd`. Task: register the complete interactive Stage 09 and prove its browser flow.

## Recovery history

The original implementer, `/root/implement_8`, stopped on an Astra usage limit after completing the original RED sequence, writing the seven owned files, updating the three registries together and capturing focused GREEN. No Task 8 commit or report existed. This recovery retained its five original logs and exits, inspected the existing source against the approved brief, and did not repeat RED or reset the implementation. The remaining teeth, restored GREEN, formatting, typecheck, lint, full suite and browser GREEN were executed by `/root/implement_8_recovery`.

## Implementation and files

- `web/src/features/performance/steps.ts`: twelve ordered typed step ids and panels, with user-outcome judgment labels and hints.
- `web/src/features/performance/PerformanceOptimization.tsx`: shared Stepper plus the five curated References.
- `web/src/features/performance/PerformanceOptimization.test.tsx`: five real render tests for semantic labels, registration, mapped controls, six glossary first appearances and one persisted record across panel changes.
- `web/e2e/performance.spec.ts`: four production browser cases for native radio keys/locking, worksheet direct links/Back/reload/literal input in both themes, permission-denied retention/manual export, and internal-improvement judgment correction.
- `web/src/features/stage-content.ts`, `web/src/features/step-ids.ts`, `web/src/lib/stages.ts`: atomic Stage 09 registration, ids declaration and ready:true. No other stage metadata changed.

## Self-review and limits

The implementation matches the Task 8 source contracts after Prettier formatting. Every panel function is wired once to its approved id; the wrapper preserves the shared Stepper hash/back contract; the References slug is correct. The registry diff contains only the required imports/entries and Stage 09 ready field. `git diff --check` is clean. Render tests exercise the actual stage and shared components with independently declared ids/labels; the specified label mutation proves why the semantic guard is separate from the id guard. No shared hook, setup, gate or unrelated files changed.

Task-level validation: focused 70/70 across 13 files (recovered); semantic-label teeth one failed/20 passed; restored 21/21; final full suite 1457/1457 across 196 files; typecheck and lint pass; fresh production browser 4/4. The configured server has ended after Playwright. The port check before GREEN found no listener on 3100, so no process was stopped. The sandbox blocked a default localhost probe (EPERM); scoped read-only inspection and the required browser/build run succeeded with escalation. The old font failure remains environment evidence, not a product failure.

Deferred: independent task review; root's whole-branch review and full gate; revealed-state contrast/target/focus/height measurement and manual Chrome coverage walk; ledger/handoff aggregation; worktree migration at the clean reviewed-task boundary; W-6 sheets, real ordering telemetry, shared-drill extraction and shared hook repairs; merge, push and production promotion. This report does not claim integration readiness or deployment.

## Build freshness

The placeholder browser RED used BUILD_ID `f3vsEESOrVngybq2V9a_K`, captured in `task8-placeholder-build.json`. Browser GREEN used a newly built BUILD_ID and the unchanged configured freshness guard. Metadata below is read from the actual `.next/BUILD_ID`; its mtime exceeds every source file and its id differs from the placeholder.

```json
{
  "build_id": "Yk-7Ej2Ymx6U_vJuhQMsx",
  "build_id_mtime_ns": 1791525059051690061,
  "source_newest_mtime_ns": 1791524994442524960
}
```

## Raw terminal evidence

All commands run from `web/`. Each fence contains its retained log verbatim; exits and interpretations are outside fences.

### task8-01-missing-module-red

Command: `pnpm exec vitest run src/features/performance/PerformanceOptimization.test.tsx`. Exit: `1`.

Recovered initial import RED: the stage module did not exist. This establishes the missing boundary, not the assertion RED.

```text

 RUN  v4.1.10 /Users/angelito/personal/Development-Playbook/web

 ❯ |dom| src/features/performance/PerformanceOptimization.test.tsx (0 test)

⎯⎯⎯⎯⎯⎯ Failed Suites 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  |dom| src/features/performance/PerformanceOptimization.test.tsx [ src/features/performance/PerformanceOptimization.test.tsx ]
Error: Failed to resolve import "./PerformanceOptimization" from "src/features/performance/PerformanceOptimization.test.tsx". Does the file exist?
  Plugin: vite:import-analysis
  File: /Users/angelito/personal/Development-Playbook/web/src/features/performance/PerformanceOptimization.test.tsx:6:40
  4  |  import { STAGE_CONTENT } from "@/features/stage-content";
  5  |  import { STEP_IDS_BY_SLUG } from "@/features/step-ids";
  6  |  import { PerformanceOptimization } from "./PerformanceOptimization";
     |                                           ^
  7  |  import { COVERAGE } from "./content";
  8  |  var _jsxFileName = "/Users/angelito/personal/Development-Playbook/web/src/features/performance/PerformanceOptimizatio...
 ❯ TransformPluginContext._formatLog node_modules/.pnpm/vite@8.1.5_@types+node@22.20.1_jiti@2.7.0/node_modules/vite/dist/node/chunks/node.js:30416:39
 ❯ TransformPluginContext.error node_modules/.pnpm/vite@8.1.5_@types+node@22.20.1_jiti@2.7.0/node_modules/vite/dist/node/chunks/node.js:30413:14
 ❯ normalizeUrl node_modules/.pnpm/vite@8.1.5_@types+node@22.20.1_jiti@2.7.0/node_modules/vite/dist/node/chunks/node.js:27438:18
 ❯ node_modules/.pnpm/vite@8.1.5_@types+node@22.20.1_jiti@2.7.0/node_modules/vite/dist/node/chunks/node.js:27506:30
 ❯ TransformPluginContext.transform node_modules/.pnpm/vite@8.1.5_@types+node@22.20.1_jiti@2.7.0/node_modules/vite/dist/node/chunks/node.js:27474:4
 ❯ EnvironmentPluginContainer.transform node_modules/.pnpm/vite@8.1.5_@types+node@22.20.1_jiti@2.7.0/node_modules/vite/dist/node/chunks/node.js:30201:14
 ❯ loadAndTransform node_modules/.pnpm/vite@8.1.5_@types+node@22.20.1_jiti@2.7.0/node_modules/vite/dist/node/chunks/node.js:20124:26

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed (1)
      Tests  no tests
   Start at  09:26:49
   Duration  801ms (transform 23ms, setup 117ms, import 0ms, tests 0ms, environment 561ms)

```

### task8-02-assertion-red

Command: `pnpm exec vitest run src/features/performance/PerformanceOptimization.test.tsx`. Exit: `1`.

Recovered assertion RED failed for the right reason: a compilable empty wrapper exposes no tabs or panels, and Stage 09 remains ready:false. All five assertions fail against the missing implementation.

```text

 RUN  v4.1.10 /Users/angelito/personal/Development-Playbook/web

 ❯ |dom| src/features/performance/PerformanceOptimization.test.tsx (5 tests | 5 failed) 66ms
   × the rail names the outcome judgments in order rather than treating internal progress as the verdict 59ms
   × ready, registration and declared ids expose the same stage 2ms
   × the stage actually renders the mapped judgments and their interactive evidence 2ms
   × first appearances open all six new terms where the reader encounters them 1ms
   × saved baseline and follow-up fields remain one record after the actual stepper switches panels 1ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 5 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  |dom| src/features/performance/PerformanceOptimization.test.tsx > the rail names the outcome judgments in order rather than treating internal progress as the verdict
TestingLibraryElementError: Unable to find an accessible element with the role "tab"

There are no accessible roles. But there might be some inaccessible roles. If you wish to access them, then set the `hidden` option to `true`. Learn more about this here: https://testing-library.com/docs/dom-testing-library/api-queries#byrole

Ignored nodes: comments, script, style
[36m<body>[39m
  [36m<div />[39m
[36m</body>[39m
 ❯ Object.getElementError node_modules/.pnpm/@testing-library+dom@10.4.1/node_modules/@testing-library/dom/dist/config.js:37:19
 ❯ node_modules/.pnpm/@testing-library+dom@10.4.1/node_modules/@testing-library/dom/dist/query-helpers.js:76:38
 ❯ node_modules/.pnpm/@testing-library+dom@10.4.1/node_modules/@testing-library/dom/dist/query-helpers.js:109:15
 ❯ src/features/performance/PerformanceOptimization.test.tsx:24:23
     22| test('the rail names the outcome judgments in order rather than treati…
     23|   render(<PerformanceOptimization />)
     24|   const tabs = screen.getAllByRole('tab')
       |                       ^
     25|   expect(tabs.map((node) => node.id)).toEqual(IDS.map((id) => `tab-${i…
     26|   LABELS.forEach((label, index) => expect(tabs[index].textContent).toC…

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/5]⎯

 FAIL  |dom| src/features/performance/PerformanceOptimization.test.tsx > ready, registration and declared ids expose the same stage
AssertionError: expected false to be true // Object.is equality

- Expected
+ Received

- true
+ false

 ❯ src/features/performance/PerformanceOptimization.test.tsx:30:58
     28|
     29| test('ready, registration and declared ids expose the same stage', () …
     30|   expect(getStage('09-performance-optimization')?.ready).toBe(true)
       |                                                          ^
     31|   expect(STAGE_CONTENT['09-performance-optimization']).toBe(Performanc…
     32|   expect(STEP_IDS_BY_SLUG['09-performance-optimization']).toEqual(IDS)

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/5]⎯

 FAIL  |dom| src/features/performance/PerformanceOptimization.test.tsx > the stage actually renders the mapped judgments and their interactive evidence
Error: Unable to fire a "click" event - please provide a DOM element.
 ❯ createEvent node_modules/.pnpm/@testing-library+dom@10.4.1/node_modules/@testing-library/dom/dist/events.js:27:11
 ❯ Function.createEvent.<computed> [as click] node_modules/.pnpm/@testing-library+dom@10.4.1/node_modules/@testing-library/dom/dist/events.js:106:38
 ❯ Function.fireEvent.<computed> [as click] node_modules/.pnpm/@testing-library+dom@10.4.1/node_modules/@testing-library/dom/dist/events.js:110:68
 ❯ Function.fireEvent.<computed> [as click] node_modules/.pnpm/@testing-library+react@16.3.2_@testing-library+dom@10.4.1_@types+react-dom@19.2.3_@type_796f041f1bf25f255ff84691b91a8ac6/node_modules/@testing-library/react/dist/fire-event.js:15:52
 ❯ go src/features/performance/PerformanceOptimization.test.tsx:18:13
     16|
     17| function go(id: string) {
     18|   fireEvent.click(document.getElementById(`tab-${id}`)!)
       |             ^
     19|   return screen.getByRole('tabpanel')
     20| }
 ❯ src/features/performance/PerformanceOptimization.test.tsx:39:17

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/5]⎯

 FAIL  |dom| src/features/performance/PerformanceOptimization.test.tsx > first appearances open all six new terms where the reader encounters them
Error: Unable to fire a "click" event - please provide a DOM element.
 ❯ createEvent node_modules/.pnpm/@testing-library+dom@10.4.1/node_modules/@testing-library/dom/dist/events.js:27:11
 ❯ Function.createEvent.<computed> [as click] node_modules/.pnpm/@testing-library+dom@10.4.1/node_modules/@testing-library/dom/dist/events.js:106:38
 ❯ Function.fireEvent.<computed> [as click] node_modules/.pnpm/@testing-library+dom@10.4.1/node_modules/@testing-library/dom/dist/events.js:110:68
 ❯ Function.fireEvent.<computed> [as click] node_modules/.pnpm/@testing-library+react@16.3.2_@testing-library+dom@10.4.1_@types+react-dom@19.2.3_@type_796f041f1bf25f255ff84691b91a8ac6/node_modules/@testing-library/react/dist/fire-event.js:15:52
 ❯ go src/features/performance/PerformanceOptimization.test.tsx:18:13
     16|
     17| function go(id: string) {
     18|   fireEvent.click(document.getElementById(`tab-${id}`)!)
       |             ^
     19|   return screen.getByRole('tabpanel')
     20| }
 ❯ src/features/performance/PerformanceOptimization.test.tsx:62:19

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[4/5]⎯

 FAIL  |dom| src/features/performance/PerformanceOptimization.test.tsx > saved baseline and follow-up fields remain one record after the actual stepper switches panels
Error: Unable to fire a "click" event - please provide a DOM element.
 ❯ createEvent node_modules/.pnpm/@testing-library+dom@10.4.1/node_modules/@testing-library/dom/dist/events.js:27:11
 ❯ Function.createEvent.<computed> [as click] node_modules/.pnpm/@testing-library+dom@10.4.1/node_modules/@testing-library/dom/dist/events.js:106:38
 ❯ Function.fireEvent.<computed> [as click] node_modules/.pnpm/@testing-library+dom@10.4.1/node_modules/@testing-library/dom/dist/events.js:110:68
 ❯ Function.fireEvent.<computed> [as click] node_modules/.pnpm/@testing-library+react@16.3.2_@testing-library+dom@10.4.1_@types+react-dom@19.2.3_@type_796f041f1bf25f255ff84691b91a8ac6/node_modules/@testing-library/react/dist/fire-event.js:15:52
 ❯ go src/features/performance/PerformanceOptimization.test.tsx:18:13
     16|
     17| function go(id: string) {
     18|   fireEvent.click(document.getElementById(`tab-${id}`)!)
       |             ^
     19|   return screen.getByRole('tabpanel')
     20| }
 ❯ src/features/performance/PerformanceOptimization.test.tsx:71:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[5/5]⎯


 Test Files  1 failed (1)
      Tests  5 failed (5)
   Start at  09:26:58
   Duration  1.54s (transform 630ms, setup 82ms, import 793ms, tests 66ms, environment 506ms)

```

### task8-03-browser-red-attempt

Command: `pnpm exec playwright test e2e/performance.spec.ts`. Exit: `1`.

Recovered environment failure: three Google Fonts downloads failed before a server could start. This is not feature RED.

```text
[WebServer] (node:41231) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
[WebServer] (Use `node --trace-warnings ...` to show where the warning was created)
[WebServer] (node:41244) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
[WebServer] (Use `node --trace-warnings ...` to show where the warning was created)
[WebServer] (node:41244) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
[WebServer] (Use `node --trace-warnings ...` to show where the warning was created)
[WebServer] Turbopack build encountered 3 warnings:
[WebServer] [next]/internal/font/google/archivo_d462d458.module.css
[WebServer] Error while requesting resource
[WebServer] There was an issue establishing a connection while requesting https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,100..900&display=swap
[WebServer] 
[WebServer] 
[WebServer] [next]/internal/font/google/jetbrains_mono_f8290d5a.module.css
[WebServer] Error while requesting resource
[WebServer] There was an issue establishing a connection while requesting https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@100..800&display=swap
[WebServer] 
[WebServer] 
[WebServer] [next]/internal/font/google/newsreader_8524af2f.module.css
[WebServer] Error while requesting resource
[WebServer] There was an issue establishing a connection while requesting https://fonts.googleapis.com/css2?family=Newsreader:wght@200..800&display=swap
[WebServer] 
[WebServer] 
[WebServer] 
[WebServer] > Build error occurred
[WebServer] Error: Turbopack build failed with 3 errors:
[WebServer] [next]/internal/font/google/archivo_d462d458.module.css
[WebServer] next/font: error:
[WebServer] Failed to fetch `Archivo` from Google Fonts.
[WebServer] 
[WebServer] 
[WebServer] [next]/internal/font/google/jetbrains_mono_f8290d5a.module.css
[WebServer] next/font: error:
[WebServer] Failed to fetch `JetBrains Mono` from Google Fonts.
[WebServer] 
[WebServer] 
[WebServer] [next]/internal/font/google/newsreader_8524af2f.module.css
[WebServer] next/font: error:
[WebServer] Failed to fetch `Newsreader` from Google Fonts.
[WebServer] 
[WebServer] 
[WebServer]     at ignore-listed frames
Error: Process from config.webServer was not able to start. Exit code: 1

```

### task8-04-browser-red

Command: `pnpm exec playwright test e2e/performance.spec.ts`. Exit: `1`.

Recovered real browser RED failed for the right reason against a fresh placeholder build: zero baseline radios, absent worksheet fields and no comparison table. All four cases fail on those missing stage controls.

```text
[WebServer] (node:43938) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
[WebServer] (Use `node --trace-warnings ...` to show where the warning was created)
[WebServer] (node:43951) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
[WebServer] (Use `node --trace-warnings ...` to show where the warning was created)
[WebServer] (node:43951) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
[WebServer] (Use `node --trace-warnings ...` to show where the warning was created)
[WebServer] (node:44045) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
[WebServer] (Use `node --trace-warnings ...` to show where the warning was created)
[WebServer] (node:44703) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
[WebServer] (Use `node --trace-warnings ...` to show where the warning was created)
[WebServer] (node:44704) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
[WebServer] (Use `node --trace-warnings ...` to show where the warning was created)
[WebServer] (node:44707) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
[WebServer] (Use `node --trace-warnings ...` to show where the warning was created)
[WebServer] (node:44705) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
[WebServer] (Use `node --trace-warnings ...` to show where the warning was created)
[WebServer] (node:44702) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
[WebServer] (Use `node --trace-warnings ...` to show where the warning was created)
[WebServer] (node:44708) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
[WebServer] (Use `node --trace-warnings ...` to show where the warning was created)
[WebServer] (node:44706) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
[WebServer] (Use `node --trace-warnings ...` to show where the warning was created)
[WebServer] (node:44784) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
[WebServer] (Use `node --trace-warnings ...` to show where the warning was created)
[WebServer] (node:44872) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
[WebServer] (Use `node --trace-warnings ...` to show where the warning was created)

Running 4 tests using 1 worker

(node:45115) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
  ✘  1 e2e/performance.spec.ts:6:5 › performance choices use native radio keys and keep the first committed answer (6.0s)
(node:45594) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
  ✘  2 e2e/performance.spec.ts:25:5 › performance worksheets support direct links, Back and reload with long literal input in both themes (2.0m)
(node:53142) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
  ✘  3 e2e/performance.spec.ts:55:5 › permission failures retain the worksheet and offer manual export with zero page errors (2.0m)
(node:59234) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
  ✘  4 e2e/performance.spec.ts:85:5 › an internal improvement requires more observation rather than a production win (5.7s)


  1) e2e/performance.spec.ts:6:5 › performance choices use native radio keys and keep the first committed answer 

    Error: expect(locator).toHaveCount(expected) failed

    Locator:  locator('#panel-baseline').getByRole('radio')
    Expected: 2
    Received: 0
    Timeout:  5000ms

    Call log:
      - Expect "toHaveCount" with timeout 5000ms
      - waiting for locator('#panel-baseline').getByRole('radio')
        14 × locator resolved to 0 elements
           - unexpected value "0"


       8 |   const panel = page.locator('#panel-baseline')
       9 |   const radios = panel.getByRole('radio')
    > 10 |   await expect(radios).toHaveCount(2)
         |                        ^
      11 |   await radios.nth(0).focus()
      12 |   await radios.nth(0).press('Space')
      13 |   await expect(radios.nth(0)).toBeChecked()
        at /Users/angelito/personal/Development-Playbook/web/e2e/performance.spec.ts:10:24

    Error Context: test-results/performance-performance-ch-e910e--the-first-committed-answer/error-context.md

  2) e2e/performance.spec.ts:25:5 › performance worksheets support direct links, Back and reload with long literal input in both themes 

    Test timeout of 120000ms exceeded.

    Error: locator.fill: Test timeout of 120000ms exceeded.
    Call log:
      - waiting for getByLabel('Outcome and observer', { exact: true })


      33 |     await page.reload({ waitUntil: 'networkidle' })
      34 |     await expect(page.locator('html')).toHaveAttribute('data-theme', theme)
    > 35 |     await page.getByLabel('Outcome and observer', { exact: true }).fill(literal)
         |                                                                    ^
      36 |     await page.locator('#tab-followup').click()
      37 |     await expect(page.locator('#panel-followup')).toBeVisible()
      38 |     await page.getByLabel('Verdict and open gap', { exact: true }).fill('More field evidence required')
        at /Users/angelito/personal/Development-Playbook/web/e2e/performance.spec.ts:35:68

    Error Context: test-results/performance-performance-wo-abeb7-iteral-input-in-both-themes/error-context.md

  3) e2e/performance.spec.ts:55:5 › permission failures retain the worksheet and offer manual export with zero page errors 

    Test timeout of 120000ms exceeded.

    Error: locator.fill: Test timeout of 120000ms exceeded.
    Call log:
      - waiting for getByLabel('Outcome and observer', { exact: true })


      73 |   }, PERFORMANCE_KEY)
      74 |   await page.goto(`${STAGE}#record`, { waitUntil: 'networkidle' })
    > 75 |   await page.getByLabel('Outcome and observer', { exact: true }).fill('Unsaved observer and outcome')
         |                                                                  ^
      76 |   await page.getByLabel('Scope', { exact: true }).fill('Unsaved scope')
      77 |   await expect(page.getByLabel('Outcome and observer', { exact: true })).toHaveValue('Unsaved observer and outcome')
      78 |   await expect(page.getByText(/Saving is unavailable/)).toBeVisible()
        at /Users/angelito/personal/Development-Playbook/web/e2e/performance.spec.ts:75:66

    Error Context: test-results/performance-permission-fai-3a1fd-xport-with-zero-page-errors/error-context.md

  4) e2e/performance.spec.ts:85:5 › an internal improvement requires more observation rather than a production win 

    Error: expect(locator).toContainText(expected) failed

    Locator: locator('#panel-compare').getByRole('table', { name: 'Before and after evidence' })
    Expected substring: "Browser p95 and its sample are not recorded"
    Timeout: 5000ms
    Error: element(s) not found

    Call log:
      - Expect "toContainText" with timeout 5000ms
      - waiting for locator('#panel-compare').getByRole('table', { name: 'Before and after evidence' })


      86 |   await page.goto(`${STAGE}#compare`, { waitUntil: 'networkidle' })
      87 |   const panel = page.locator('#panel-compare')
    > 88 |   await expect(panel.getByRole('table', { name: 'Before and after evidence' })).toContainText('Browser p95 and its sample are not recorded')
         |                                                                                 ^
      89 |   await panel.getByRole('radio', { name: 'Stop this optimization pass and observe the outcome' }).check()
      90 |   await panel.getByRole('button', { name: 'Commit decision' }).click()
      91 |   await expect(panel.getByText('Needs correction')).toBeVisible()
        at /Users/angelito/personal/Development-Playbook/web/e2e/performance.spec.ts:88:81

    Error Context: test-results/performance-an-internal-im-75942-ather-than-a-production-win/error-context.md

  4 failed
    e2e/performance.spec.ts:6:5 › performance choices use native radio keys and keep the first committed answer 
    e2e/performance.spec.ts:25:5 › performance worksheets support direct links, Back and reload with long literal input in both themes 
    e2e/performance.spec.ts:55:5 › permission failures retain the worksheet and offer manual export with zero page errors 
    e2e/performance.spec.ts:85:5 › an internal improvement requires more observation rather than a production win 
```

### task8-05-focused-green

Command: `pnpm exec vitest run src/features/performance src/lib/performance-sheet.test.ts src/lib/stages.test.ts src/features/rails.test.tsx`. Exit: `0`.

Recovered focused GREEN: 70 tests pass across 13 files after assembly and atomic registration.

```text

 RUN  v4.1.10 /Users/angelito/personal/Development-Playbook/web


 Test Files  13 passed (13)
      Tests  70 passed (70)
   Start at  09:32:26
   Duration  4.81s (transform 4.57s, setup 2.18s, import 6.81s, tests 3.17s, environment 12.97s)

```

### task8-06-label-teeth

Command: `pnpm exec vitest run src/features/performance/PerformanceOptimization.test.tsx src/features/rails.test.tsx`. Exit: `1`.

Recovery teeth: only compare.label changed to Internal progress. Exactly the semantic rail label test fails; four other stage tests and all 16 rail-id guards pass (20 pass, one fail). Expected Compare outcomes; received 07Internal progress.

```text

 RUN  v4.1.10 /Users/angelito/personal/Development-Playbook/web

 ❯ |dom| src/features/performance/PerformanceOptimization.test.tsx (5 tests | 1 failed) 376ms
   × the rail names the outcome judgments in order rather than treating internal progress as the verdict 102ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  |dom| src/features/performance/PerformanceOptimization.test.tsx > the rail names the outcome judgments in order rather than treating internal progress as the verdict
AssertionError: expected '07Internal progress' to contain 'Compare outcomes'

Expected: "Compare outcomes"
Received: "07Internal progress"

 ❯ src/features/performance/PerformanceOptimization.test.tsx:26:68
     24|   const tabs = screen.getAllByRole('tab')
     25|   expect(tabs.map((node) => node.id)).toEqual(IDS.map((id) => `tab-${i…
     26|   LABELS.forEach((label, index) => expect(tabs[index].textContent).toC…
       |                                                                    ^
     27| })
     28|
 ❯ src/features/performance/PerformanceOptimization.test.tsx:26:10

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed | 1 passed (2)
      Tests  1 failed | 20 passed (21)
   Start at  13:49:37
   Duration  2.52s (transform 1.65s, setup 307ms, import 2.10s, tests 514ms, environment 1.59s)

```

### task8-07-restored-green

Command: `pnpm exec vitest run src/features/performance/PerformanceOptimization.test.tsx src/features/rails.test.tsx`. Exit: `0`.

Restored the exact pre-mutation steps file: all 21 tests pass across two files.

```text

 RUN  v4.1.10 /Users/angelito/personal/Development-Playbook/web


 Test Files  2 passed (2)
      Tests  21 passed (21)
   Start at  13:49:48
   Duration  2.29s (transform 1.49s, setup 308ms, import 1.93s, tests 636ms, environment 1.28s)

```

### task8-08-format

Command: `pnpm exec prettier --write src/features/performance/steps.ts src/features/performance/PerformanceOptimization.tsx src/features/performance/PerformanceOptimization.test.tsx e2e/performance.spec.ts src/features/stage-content.ts src/features/step-ids.ts src/lib/stages.ts`. Exit: `0`.

Only the seven owned files formatted; no behavior changes.

```text
src/features/performance/steps.ts 33ms
src/features/performance/PerformanceOptimization.tsx 3ms
src/features/performance/PerformanceOptimization.test.tsx 21ms
e2e/performance.spec.ts 38ms
src/features/stage-content.ts 6ms (unchanged)
src/features/step-ids.ts 3ms (unchanged)
src/lib/stages.ts 11ms (unchanged)
```

### task8-09-typecheck

Command: `pnpm typecheck`. Exit: `0`.

Route typegen plus tsc pass.

```text

> web@0.1.0 typecheck /Users/angelito/personal/Development-Playbook/web
> next typegen && tsc --noEmit

Generating route types...
✓ Types generated successfully
```

### task8-10-lint

Command: `pnpm lint`. Exit: `0`.

ESLint passes with zero warnings.

```text

> web@0.1.0 lint /Users/angelito/personal/Development-Playbook/web
> eslint --max-warnings 0

```

### task8-11-full-suite

Command: `pnpm test`. Exit: `0`.

Full project GREEN: 1457 tests pass across 196 files, including the formatted final sources.

```text

> web@0.1.0 test /Users/angelito/personal/Development-Playbook/web
> vitest run


 RUN  v4.1.10 /Users/angelito/personal/Development-Playbook/web


 Test Files  196 passed (196)
      Tests  1457 passed (1457)
   Start at  13:50:04
   Duration  36.68s (transform 14.89s, setup 21.21s, import 38.01s, tests 65.69s, environment 93.78s)

```

### task8-12-browser-green

Command: `pnpm exec playwright test e2e/performance.spec.ts --output=../.superpowers/sdd/2026-10-08-stage-09-interactive-port/task8-browser-green-artifacts`. Exit: `0`.

All four browser cases pass against a fresh production build. The configured webServer owns the build and server; globalSetup accepts freshness. Node prints NO_COLOR/FORCE_COLOR environment warnings, retained below. No application page errors in the explicit permission-failure check.

```text
[WebServer] (node:65883) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
[WebServer] (Use `node --trace-warnings ...` to show where the warning was created)
[WebServer] (node:65900) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
[WebServer] (Use `node --trace-warnings ...` to show where the warning was created)
[WebServer] (node:65900) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
[WebServer] (Use `node --trace-warnings ...` to show where the warning was created)
[WebServer] (node:65946) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
[WebServer] (Use `node --trace-warnings ...` to show where the warning was created)
[WebServer] (node:66479) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
[WebServer] (Use `node --trace-warnings ...` to show where the warning was created)
[WebServer] (node:66484) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
[WebServer] (Use `node --trace-warnings ...` to show where the warning was created)
[WebServer] (node:66480) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
[WebServer] (Use `node --trace-warnings ...` to show where the warning was created)
[WebServer] (node:66482) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
[WebServer] (Use `node --trace-warnings ...` to show where the warning was created)
[WebServer] (node:66477) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
[WebServer] (Use `node --trace-warnings ...` to show where the warning was created)
[WebServer] (node:66483) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
[WebServer] (Use `node --trace-warnings ...` to show where the warning was created)
[WebServer] (node:66478) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
[WebServer] (Use `node --trace-warnings ...` to show where the warning was created)
[WebServer] (node:66656) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
[WebServer] (Use `node --trace-warnings ...` to show where the warning was created)
[WebServer] (node:66671) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
[WebServer] (Use `node --trace-warnings ...` to show where the warning was created)

Running 4 tests using 1 worker

(node:66680) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
  ✓  1 e2e/performance.spec.ts:6:5 › performance choices use native radio keys and keep the first committed answer (1.3s)
  ✓  2 e2e/performance.spec.ts:29:5 › performance worksheets support direct links, Back and reload with long literal input in both themes (3.9s)
  ✓  3 e2e/performance.spec.ts:80:5 › permission failures retain the worksheet and offer manual export with zero page errors (751ms)
  ✓  4 e2e/performance.spec.ts:127:5 › an internal improvement requires more observation rather than a production win (815ms)

  4 passed (18.8s)
```

### task8-13-server-ended

Command: `lsof -nP -iTCP:3100 -sTCP:LISTEN`. Exit: `1`.

Exit 1 with no stdout is the expected no-listener result, confirming that the configured Task 8 server has ended.

```text
```

### task8-14-commit

Command: `python3 .superpowers/sdd/2026-10-08-stage-09-interactive-port/task8-commit.py`. Exit: `1`.

The default sandbox prevented .git/index.lock creation during git add; no commit was created and the index stayed unstaged. This is environment evidence.

```text
fatal: Unable to create '/Users/angelito/personal/Development-Playbook/.git/index.lock': Operation not permitted
Traceback (most recent call last):
  File "/Users/angelito/personal/Development-Playbook/.superpowers/sdd/2026-10-08-stage-09-interactive-port/task8-commit.py", line 4, in <module>
    subprocess.run(["git", "add", "--", *owned], check=True)
  File "/Users/angelito/.pyenv/versions/3.12.7/lib/python3.12/subprocess.py", line 571, in run
    raise CalledProcessError(retcode, process.args,
subprocess.CalledProcessError: Command '['git', 'add', '--', 'web/src/features/performance/steps.ts', 'web/src/features/performance/PerformanceOptimization.tsx', 'web/src/features/performance/PerformanceOptimization.test.tsx', 'web/e2e/performance.spec.ts', 'web/src/features/stage-content.ts', 'web/src/features/step-ids.ts', 'web/src/lib/stages.ts']' returned non-zero exit status 128.
```

### task8-15-commit-escalated

Command: `python3 .superpowers/sdd/2026-10-08-stage-09-interactive-port/task8-commit.py`. Exit: `0`.

Scoped escalation completed the approved seven-file local commit. Lefthook format and lint passed, with every owned source file unchanged by the hook.

```text
╭───────────────────────────────────────╮
│ lefthook  v2.1.10   hook:  [1mpre-commit[m │
╰───────────────────────────────────────╯
┃  format ❯ 
e2e/performance.spec.ts 83ms (unchanged)
src/features/performance/PerformanceOptimization.test.tsx 24ms (unchanged)
src/features/performance/PerformanceOptimization.tsx 4ms (unchanged)
src/features/performance/steps.ts 9ms (unchanged)
src/features/stage-content.ts 6ms (unchanged)
src/features/step-ids.ts 4ms (unchanged)
src/lib/stages.ts 15ms (unchanged)

┃  lint ❯ 

[38;2;56;56;56m  ────────────────────────────────────[m
summary: (done in 3.44 seconds)
✓ format (0.80 seconds)
✓ lint (3.43 seconds)
[feat/stage-09-performance-port 59b0e05] feat(performance): register the interactive stage
 7 files changed, 417 insertions(+), 1 deletion(-)
 create mode 100644 web/e2e/performance.spec.ts
 create mode 100644 web/src/features/performance/PerformanceOptimization.test.tsx
 create mode 100644 web/src/features/performance/PerformanceOptimization.tsx
 create mode 100644 web/src/features/performance/steps.ts
```

### task8-16-final-state

Command: `python3 final-state check (retained invocation checks git status, seven commit files, subject/trailer and committed diff whitespace)`. Exit: `0`.

Commit 59b0e058c96f79dc5e3d91dd12bb756833a05014 verified. Tree clean; exactly seven owned files; required subject/trailer present; committed diff whitespace clean. No merge or push performed.

```text
HEAD=59b0e058c96f79dc5e3d91dd12bb756833a05014
PASS: clean working tree; exactly seven owned commit files; subject and trailer verified.
PASS: committed diff whitespace check.
```

## Commit and handoff

Committed only the seven owned files as `59b0e058c96f79dc5e3d91dd12bb756833a05014`, `feat(performance): register the interactive stage`, with the required Co-Authored-By trailer. Working tree is clean. Independent review, root verification and records remain pending; not merged, not pushed, not deployed.

## Task 8 independent review

Spec compliant; task approved, no blockers. M1 (PRE-EXISTING environment): NO_COLOR/FORCE_COLOR warnings in retained terminal output. Final verification will remove NO_COLOR only from subprocess environments; the original output remains verbatim. All sixteen raw fences and exits match. Fresh BUILD_ID differs from placeholder; commit trailer verified. Review source: `task-8-review.md`.

The user selected an isolated worktree after execution had begun. All eight tasks are now implemented and reviewed, so the feature branch moves at this clean boundary before final gates. The original planning checkout returns to `docs/2026-10-08-stage-09-port-design` at `112aa42`. No merge or push approval was granted.


---

# Audit fixture integration fix report

Base: `f48a295fc893f7275ae681a9756b4e039acdc3f6`. Commit: `90da921485ffd909203fcb2565f2cf7c2df2d68e`.
Workdir: `/Users/angelito/personal/Development-Playbook/.worktrees/stage-09-performance-port`.

## Finding, hypothesis and fix

Important (blocking), PLAN-AUTHORED omitted integration fixture update; pre-existing test coupling. The full production gate passed 21 tests and failed only the negative missing-rail fixture in `web/e2e/audit-pages.spec.ts`. Its fixture still names Stage 09, which now correctly exposes twelve step ids. The helper's missing-rail guard is correct. The existing comment explicitly directs moving the fixture when Stage 09 is ported, following prior moves from Stages 04 through 08.

Hypothesis before edit: the failing rejection assertion names a now-built stage; changing only the fixture to still-unbuilt Stage 10 restores coverage of the missing-rail guard. Source inspection confirms Stage 10 has ready:false and is absent from STAGE_CONTENT. The narrow change moves the fixture to `10-documentation` and updates its historical comment to include the Stage 09 move. Production sources and the helper are unchanged in the commit.

## Verification and self-review

The existing full-gate RED is preserved below and was not repeated. Focused GREEN: 3/3. Teeth: disable only the helper's empty-rail throw; exactly the negative case fails and the two positive sweep cases pass. The helper was restored byte for byte in try/finally immediately after the run. Restored GREEN: 3/3. Owned formatting, full lint, committed whitespace check and Lefthook pass. Final state proves the only committed file is `web/e2e/audit-pages.spec.ts`, with the required subject and trailer, and the worktree is clean. No own server remains on port 3100.

No full unit rerun was performed, as explicitly scoped by the controller for this E2E fixture-only change. Root owns the full production audit rerun and final review. Existing manual Chrome UI evidence remains applicable because production code did not change. Browser process output includes NO_COLOR/FORCE_COLOR warnings, retained verbatim; no browser/build startup failure occurred.

Deferred: root's full audit rerun, independent scoped review, canonical report/tracker/handoff updates, merge, push and deployment. No agents were spawned and no integration action was performed.

## Raw terminal evidence

Browser, formatting and lint commands run from this worktree's `web/`; git checks and commit commands run from its repository root. Fences are verbatim retained logs. True exits and interpretations stay outside fences.

### gate-e2e

Command: `pnpm test:e2e`. Exit: `1`.

Existing full-gate RED, not repeated: 21 passed, one failed. The negative fixture resolves the twelve Stage 09 step ids instead of rejecting because Stage 09 was ported correctly. It failed for the right reason for this stale fixture, not a product defect.

```text

> web@0.1.0 test:e2e /Users/angelito/personal/Development-Playbook/.worktrees/stage-09-performance-port/web
> playwright test


Running 22 tests using 3 workers

  ✓   1 e2e/performance.spec.ts:6:5 › performance choices use native radio keys and keep the first committed answer (1.5s)
  ✓   4 e2e/performance.spec.ts:29:5 › performance worksheets support direct links, Back and reload with long literal input in both themes (3.8s)
  ✓   5 e2e/performance.spec.ts:80:5 › permission failures retain the worksheet and offer manual export with zero page errors (740ms)
  ✓   6 e2e/performance.spec.ts:127:5 › an internal improvement requires more observation rather than a production win (760ms)
  ✓   3 e2e/audit-pages.spec.ts:47:5 › the sweep reaches every step every built stage declares, since a selector that returned half a rail would shrink it in silence (11.4s)
  ✓   7 e2e/audit-pages.spec.ts:62:5 › appends the reference index and every registered sheet, so a sheet added later cannot slip out of the sweep (80ms)
  ✘   8 e2e/audit-pages.spec.ts:74:5 › refuses to sweep a stage that is ready but renders no steps, since silence there is the failure TD-12 describes (682ms)
  ✓   2 e2e/audit.spec.ts:46:7 › no horizontal overflow at 320px, because a field manual must never scroll sideways (40.1s)
  ✓   9 e2e/audit.spec.ts:46:7 › no horizontal overflow at 768px, because a field manual must never scroll sideways (27.6s)
  ✓  10 e2e/audit.spec.ts:46:7 › no horizontal overflow at 1024px, because a field manual must never scroll sideways (27.7s)
  ✓  11 e2e/audit.spec.ts:46:7 › no horizontal overflow at 1440px, because a field manual must never scroll sideways (28.7s)
  ✓  12 e2e/audit.spec.ts:46:7 › no horizontal overflow at 2560px, because a field manual must never scroll sideways (27.5s)
  ✓  13 e2e/audit.spec.ts:65:5 › interactive elements are at least 44px tall below lg (1.1m)
  ✓  14 e2e/audit.spec.ts:158:7 › every text/background pair passes WCAG AA in light mode (1.2m)
  ✓  15 e2e/audit.spec.ts:158:7 › every text/background pair passes WCAG AA in dark mode (1.2m)
  ✓  16 e2e/audit.spec.ts:337:5 › the sweep observes every disclosure open at least once, since a sweep that quietly stops opening things is indistinguishable from a clean pass (1.1m)
  ✓  17 e2e/audit.spec.ts:401:5 › zero console errors across every page and step (26.3s)
  ✓  18 e2e/audit.spec.ts:426:5 › the interrogation still explains itself after a wrong answer, since the reasoning is the lesson and not the reward (812ms)
  ✓  19 e2e/audit.spec.ts:463:5 › the locking exercise explains itself after a wrong answer too, since its wrong answer is the one the step was built for (772ms)
  ✓  20 e2e/audit.spec.ts:494:5 › reset clears the uncommitted draft as well as the committed answers, since a group that presents itself as unanswered must not have boxes ticked (973ms)
  ✓  21 e2e/audit.spec.ts:546:5 › every listed step hash lands on the step it names, since a dead hash falls back and audits step one twice (9.6s)
  ✓  22 e2e/audit.spec.ts:599:5 › no step panel exceeds four screens, because a step that is a scroll is two steps (11.4s)


  1) e2e/audit-pages.spec.ts:74:5 › refuses to sweep a stage that is ready but renders no steps, since silence there is the failure TD-12 describes 

    Error: expect(received).rejects.toThrow()

    Received promise resolved instead of rejected
    Resolved to value: ["clock", "baseline", "target", "bottleneck", "query", "fixes", "compare", "record", "followup", "ai", …]

      90 |   await expect(
      91 |     readStepIds(page, '09-performance-optimization'),
    > 92 |   ).rejects.toThrow(/renders no steps/)
         |             ^
      93 | })
      94 |
        at /Users/angelito/personal/Development-Playbook/.worktrees/stage-09-performance-port/web/e2e/audit-pages.spec.ts:92:13

    Error Context: test-results/audit-pages-refuses-to-swe-697f4-the-failure-TD-12-describes/error-context.md

  Slow test file: e2e/audit.spec.ts (8.0m)
  Consider running tests from slow files in parallel. See: https://playwright.dev/docs/test-parallel
  1 failed
    e2e/audit-pages.spec.ts:74:5 › refuses to sweep a stage that is ready but renders no steps, since silence there is the failure TD-12 describes 
  21 passed (8.2m)
 ELIFECYCLE  Command failed with exit code 1.
```

### audit-fixture-01-green

Command: `pnpm exec playwright test e2e/audit-pages.spec.ts --output=../.superpowers/sdd/2026-10-08-stage-09-interactive-port/audit-fixture-green-artifacts`. Exit: `0`.

Three focused browser tests pass after moving only the absent-rail fixture to Stage 10.

```text
[WebServer] (node:47834) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
[WebServer] (Use `node --trace-warnings ...` to show where the warning was created)
[WebServer] (node:47847) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
[WebServer] (Use `node --trace-warnings ...` to show where the warning was created)
[WebServer] (node:47847) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
[WebServer] (Use `node --trace-warnings ...` to show where the warning was created)
[WebServer] (node:47937) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
[WebServer] (Use `node --trace-warnings ...` to show where the warning was created)
[WebServer] (node:48656) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
[WebServer] (Use `node --trace-warnings ...` to show where the warning was created)
[WebServer] (node:48651) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
[WebServer] (Use `node --trace-warnings ...` to show where the warning was created)
[WebServer] (node:48654) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
[WebServer] (Use `node --trace-warnings ...` to show where the warning was created)
[WebServer] (node:48650) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
[WebServer] (Use `node --trace-warnings ...` to show where the warning was created)
[WebServer] (node:48655) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
[WebServer] (Use `node --trace-warnings ...` to show where the warning was created)
[WebServer] (node:48652) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
[WebServer] (Use `node --trace-warnings ...` to show where the warning was created)
[WebServer] (node:48653) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
[WebServer] (Use `node --trace-warnings ...` to show where the warning was created)
[WebServer] (node:48657) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
[WebServer] (Use `node --trace-warnings ...` to show where the warning was created)
[WebServer] (node:48671) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
[WebServer] (Use `node --trace-warnings ...` to show where the warning was created)

Running 3 tests using 1 worker

(node:48692) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
  ✓  1 e2e/audit-pages.spec.ts:47:5 › the sweep reaches every step every built stage declares, since a selector that returned half a rail would shrink it in silence (9.6s)
  ✓  2 e2e/audit-pages.spec.ts:62:5 › appends the reference index and every registered sheet, so a sheet added later cannot slip out of the sweep (54ms)
  ✓  3 e2e/audit-pages.spec.ts:74:5 › refuses to sweep a stage that is ready but renders no steps, since silence there is the failure TD-12 describes (687ms)

  3 passed (22.5s)
```

### audit-fixture-02-teeth

Command: `pnpm exec playwright test e2e/audit-pages.spec.ts --output=../.superpowers/sdd/2026-10-08-stage-09-interactive-port/audit-fixture-teeth-artifacts`. Exit: `1`.

Temporarily replace only if (ids.length === 0) with if (false) in the test helper audit-pages.ts. Exactly the negative case fails because readStepIds resolves []; both sweep cases pass. A try/finally restored the helper bytes immediately after the command.

```text
[WebServer] (node:51493) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
[WebServer] (Use `node --trace-warnings ...` to show where the warning was created)
[WebServer] (node:51506) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
[WebServer] (Use `node --trace-warnings ...` to show where the warning was created)
[WebServer] (node:51506) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
[WebServer] (Use `node --trace-warnings ...` to show where the warning was created)
[WebServer] (node:51600) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
[WebServer] (Use `node --trace-warnings ...` to show where the warning was created)
[WebServer] (node:51937) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
[WebServer] (Use `node --trace-warnings ...` to show where the warning was created)
[WebServer] (node:51941) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
[WebServer] (Use `node --trace-warnings ...` to show where the warning was created)
[WebServer] (node:51938) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
[WebServer] (Use `node --trace-warnings ...` to show where the warning was created)
[WebServer] (node:51939) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
[WebServer] (Use `node --trace-warnings ...` to show where the warning was created)
[WebServer] (node:51936) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
[WebServer] (Use `node --trace-warnings ...` to show where the warning was created)
[WebServer] (node:51935) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
[WebServer] (Use `node --trace-warnings ...` to show where the warning was created)
[WebServer] (node:51942) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
[WebServer] (Use `node --trace-warnings ...` to show where the warning was created)
[WebServer] (node:52020) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
[WebServer] (Use `node --trace-warnings ...` to show where the warning was created)
[WebServer] (node:52033) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
[WebServer] (Use `node --trace-warnings ...` to show where the warning was created)

Running 3 tests using 1 worker

(node:52039) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
  ✓  1 e2e/audit-pages.spec.ts:47:5 › the sweep reaches every step every built stage declares, since a selector that returned half a rail would shrink it in silence (9.7s)
  ✓  2 e2e/audit-pages.spec.ts:62:5 › appends the reference index and every registered sheet, so a sheet added later cannot slip out of the sweep (59ms)
  ✘  3 e2e/audit-pages.spec.ts:74:5 › refuses to sweep a stage that is ready but renders no steps, since silence there is the failure TD-12 describes (711ms)


  1) e2e/audit-pages.spec.ts:74:5 › refuses to sweep a stage that is ready but renders no steps, since silence there is the failure TD-12 describes 

    Error: expect(received).rejects.toThrow()

    Received promise resolved instead of rejected
    Resolved to value: []

      90 |   await expect(
      91 |     readStepIds(page, '10-documentation'),
    > 92 |   ).rejects.toThrow(/renders no steps/)
         |             ^
      93 | })
      94 |
        at /Users/angelito/personal/Development-Playbook/.worktrees/stage-09-performance-port/web/e2e/audit-pages.spec.ts:92:13

    Error Context: ../.superpowers/sdd/2026-10-08-stage-09-interactive-port/audit-fixture-teeth-artifacts/audit-pages-refuses-to-swe-697f4-the-failure-TD-12-describes/error-context.md

  1 failed
    e2e/audit-pages.spec.ts:74:5 › refuses to sweep a stage that is ready but renders no steps, since silence there is the failure TD-12 describes 
  2 passed (21.6s)
```

### audit-fixture-03-restored

Command: `pnpm exec playwright test e2e/audit-pages.spec.ts --output=../.superpowers/sdd/2026-10-08-stage-09-interactive-port/audit-fixture-restored-artifacts`. Exit: `0`.

All three cases pass with the helper restored.

```text
[WebServer] (node:53870) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
[WebServer] (Use `node --trace-warnings ...` to show where the warning was created)
[WebServer] (node:53955) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
[WebServer] (Use `node --trace-warnings ...` to show where the warning was created)
[WebServer] (node:53955) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
[WebServer] (Use `node --trace-warnings ...` to show where the warning was created)
[WebServer] (node:54457) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
[WebServer] (Use `node --trace-warnings ...` to show where the warning was created)
[WebServer] (node:55401) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
[WebServer] (Use `node --trace-warnings ...` to show where the warning was created)
[WebServer] (node:55405) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
[WebServer] (Use `node --trace-warnings ...` to show where the warning was created)
[WebServer] (node:55406) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
[WebServer] (Use `node --trace-warnings ...` to show where the warning was created)
[WebServer] (node:55402) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
[WebServer] (Use `node --trace-warnings ...` to show where the warning was created)
[WebServer] (node:55403) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
[WebServer] (Use `node --trace-warnings ...` to show where the warning was created)
[WebServer] (node:55404) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
[WebServer] (Use `node --trace-warnings ...` to show where the warning was created)
[WebServer] (node:55407) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
[WebServer] (Use `node --trace-warnings ...` to show where the warning was created)
[WebServer] (node:55487) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
[WebServer] (Use `node --trace-warnings ...` to show where the warning was created)
[WebServer] (node:55500) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
[WebServer] (Use `node --trace-warnings ...` to show where the warning was created)

Running 3 tests using 1 worker

(node:55514) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
  ✓  1 e2e/audit-pages.spec.ts:47:5 › the sweep reaches every step every built stage declares, since a selector that returned half a rail would shrink it in silence (9.8s)
  ✓  2 e2e/audit-pages.spec.ts:62:5 › appends the reference index and every registered sheet, so a sheet added later cannot slip out of the sweep (53ms)
  ✓  3 e2e/audit-pages.spec.ts:74:5 › refuses to sweep a stage that is ready but renders no steps, since silence there is the failure TD-12 describes (666ms)

  3 passed (27.9s)
```

### audit-fixture-04-format

Command: `pnpm exec prettier --write e2e/audit-pages.spec.ts`. Exit: `0`.

Formatted only the owned test file.

```text
e2e/audit-pages.spec.ts 74ms
```

### audit-fixture-05-lint

Command: `pnpm lint`. Exit: `0`.

Full lint passes with zero warnings.

```text

> web@0.1.0 lint /Users/angelito/personal/Development-Playbook/.worktrees/stage-09-performance-port/web
> eslint --max-warnings 0

```

### audit-fixture-06-server-ended

Command: `lsof -nP -iTCP:3100 -sTCP:LISTEN`. Exit: `1`.

Exit 1 and empty stdout confirm no listener remains on the configured production port. No unrelated process was stopped.

```text
```

### audit-fixture-07-commit

Command: `python3 .superpowers/sdd/2026-10-08-stage-09-interactive-port/audit-fixture-commit.py`. Exit: `0`.

Local commit contains only the approved test file; Lefthook format and lint pass, file unchanged by the hook.

```text
╭───────────────────────────────────────╮
│ lefthook  v2.1.10   hook:  [1mpre-commit[m │
╰───────────────────────────────────────╯
┃  format ❯ 
e2e/audit-pages.spec.ts 42ms (unchanged)

┃  lint ❯ 

[38;2;56;56;56m  ────────────────────────────────────[m
summary: (done in 1.83 seconds)
✓ format (0.34 seconds)
✓ lint (1.80 seconds)
[feat/stage-09-performance-port 90da921] test(audit): move missing-rail fixture to documentation
 1 file changed, 9 insertions(+), 9 deletions(-)
```

### audit-fixture-08-final-state

Command: `python3 final-state heredoc (git status, diff-tree, helper bytes, commit subject/trailer and diff --check)`. Exit: `0`.

Clean worktree and one owned committed file; the helper is byte-identical to its pre-fix version. Exact subject/trailer and whitespace check pass.

```text
HEAD=90da921485ffd909203fcb2565f2cf7c2df2d68e
PASS: clean worktree, only audit-pages.spec.ts committed, helper byte-identical to pre-fix HEAD, exact subject/trailer and diff whitespace verified.
```


## Audit fixture independent review

ADDRESSED, review clean after one fix; no new breakage. Nine raw logs/exits match, and helper restoration is byte-exact. Commit trailer verified. Review source: `audit-fixture-fix-review.md`.

---

# Denied-state verification report

Base: `90da921485ffd909203fcb2565f2cf7c2df2d68e`. Commit: `ac53bcf5b84f90213f18b50ccbbd9355e1a1d03c`.
Workdir: `/Users/angelito/personal/Development-Playbook/.worktrees/stage-09-performance-port`.

## Scope and implementation

Verification-only extension of the existing permission-failure case in `web/e2e/performance.spec.ts`. The approved plan requires interacted failed-save/copy layouts and colors in both themes at 320, 390, 768, 1024, 1440, 1920 and 2560 px. The previous case checked retention/export/errors in only the default theme. All four case declarations and the other three case bodies remain unchanged.

The existing storage/clipboard denial setup is preserved and denies only PERFORMANCE_KEY; theme storage remains allowed. Each theme is persisted and reloaded before editing a fresh draft. All prior retention, warning, copy failure, literal manual export and zero page-error assertions remain. The test measures save-denied before copy and combined copy-denied afterward at all seven widths. It asserts no document overflow, worksheet button/textarea/input/select dimensions at least 44 px below lg, three nonempty observed pairs per state, and panel height at most four 768 px screens at width 1024.

Save-state pairs are the warning plus independently labeled, filled Outcome and observer and Scope controls. Copy-state pairs are the save warning, nonempty Copy status and readonly Markdown textarea. The collector throws on a missing element or empty sample rather than silently skipping it. It emits PERFORMANCE_PERMISSION_STATE JSON with actual panel id, explicit state, theme, width, height, overflow, pairs and smallTargets. Each pair includes computed foreground CSS, every ancestor background CSS string, font size/weight and an actual text/value sample. Background order is the element itself followed by ancestors toward html; root's contrast calculation reverses and composes that order before foreground. No canvas, parser extraction or dependency was added.

## Evidence and self-review

Corrected focused GREEN: 4/4. Teeth: exactly the permission case fails after draft retention is temporarily removed; three others pass. Restored GREEN: 4/4. Both successful runs observe 28 unique states and 84 nonempty pairs with zero overflow and zero undersized controls. At 1024x768, both themes measure save-denied at 1463.890625 px (1.906 screens) and copy-denied at 1690.140625 px (2.201 screens). Final raw measurements are in `denied-state-measurements-restored.json`; `denied-state-measurements-green.json` holds the earlier corrected GREEN.

Two collector-edit failures occurred before GREEN: an incorrect positional field selector, then an incomplete source replacement causing an undefined identifier. They are retained below as implementer-authored test errors, not product RED. Both were corrected without weakening any assertion or changing application code. Final lint, owned formatting, Lefthook and committed diff whitespace pass; only the owned E2E file is committed and the worktree is clean. The temporarily mutated worksheet is byte-identical to its pre-fix commit. No own production server remains on port 3100. Browser/commit commands remove only NO_COLOR from their environment; no application environment or dependencies changed.

Deferred: root's external contrast calculation from captured CSS, scoped independent review and final production audit, canonical report/records updates, merge, push and deployment. No full unit or global-gate rerun was performed, as explicitly scoped by the controller for this additional verification. Existing manual Chrome UI evidence remains applicable because production code is unchanged. No agents were spawned.

## Raw terminal evidence

Browser/format/lint commands run from this worktree's web/; git and port inspection from its root. Fences equal the actual retained logs. Exits and interpretations remain outside them.

### denied-state-01-format

Command: `pnpm exec prettier --write e2e/performance.spec.ts`. Exit: `0`.

Initial owned-file formatting.

```text
e2e/performance.spec.ts 67ms
```

### denied-state-02-green

Command: `env -u NO_COLOR pnpm exec playwright test e2e/performance.spec.ts --output=../.superpowers/sdd/2026-10-08-stage-09-interactive-port/denied-state-green-artifacts`. Exit: `1`.

Initial attempt: three pass, permission measurement fails because the collector selected textarea index 1, which is Metric and population, not populated Scope. The nonempty-pair guard refused the empty sample. This is an implementer-authored collector error, not a product RED or defect.

```text

Running 4 tests using 1 worker

  ✓  1 e2e/performance.spec.ts:6:5 › performance choices use native radio keys and keep the first committed answer (1.5s)
  ✓  2 e2e/performance.spec.ts:29:5 › performance worksheets support direct links, Back and reload with long literal input in both themes (4.2s)
  ✘  3 e2e/performance.spec.ts:80:5 › permission failures retain the worksheet and offer manual export with zero page errors (1.5s)
  ✓  4 e2e/performance.spec.ts:228:5 › an internal improvement requires more observation rather than a production win (912ms)


  1) e2e/performance.spec.ts:80:5 › permission failures retain the worksheet and offer manual export with zero page errors 

    Error: page.evaluate: Error: Empty denied-state contrast target: draft-scope
        at eval (eval at evaluate (:303:30), <anonymous>:20:30)
        at Array.map (<anonymous>)
        at eval (eval at evaluate (:303:30), <anonymous>:16:32)
        at UtilityScript.evaluate (<anonymous>:305:16)
        at UtilityScript.<anonymous> (<anonymous>:1:44)
        at eval (eval at evaluate (:303:30), <anonymous>:20:30)
        at eval (eval at evaluate (:303:30), <anonymous>:16:32)
        at UtilityScript.evaluate (<anonymous>:305:16)
        at UtilityScript.<anonymous> (<anonymous>:1:44)
        at measureState (/Users/angelito/personal/Development-Playbook/.worktrees/stage-09-performance-port/web/e2e/performance.spec.ts:114:38)
        at /Users/angelito/personal/Development-Playbook/.worktrees/stage-09-performance-port/web/e2e/performance.spec.ts:215:5

    Error Context: ../.superpowers/sdd/2026-10-08-stage-09-interactive-port/denied-state-green-artifacts/performance-permission-fai-3a1fd-xport-with-zero-page-errors/error-context.md

  1 failed
    e2e/performance.spec.ts:80:5 › permission failures retain the worksheet and offer manual export with zero page errors 
  3 passed (22.2s)
```

### denied-state-01b-format

Command: `env -u NO_COLOR pnpm exec prettier --write e2e/performance.spec.ts`. Exit: `0`.

Intermediate formatting after beginning the label-based collector correction and adding explicit state/panel id.

```text
e2e/performance.spec.ts 99ms (unchanged)
```

### denied-state-02b-green

Command: `env -u NO_COLOR pnpm exec playwright test e2e/performance.spec.ts --output=../.superpowers/sdd/2026-10-08-stage-09-interactive-port/denied-state-green-fixed-artifacts`. Exit: `1`.

Second attempt: three pass, permission measurement fails with ReferenceError: outcome is not defined. A source replacement changed references but missed their declaration. This implementer-authored test-edit error was corrected by inspecting the actual source and defining label.control references, without touching application code or relaxing assertions.

```text

Running 4 tests using 1 worker

  ✓  1 e2e/performance.spec.ts:6:5 › performance choices use native radio keys and keep the first committed answer (1.2s)
  ✓  2 e2e/performance.spec.ts:29:5 › performance worksheets support direct links, Back and reload with long literal input in both themes (3.8s)
  ✘  3 e2e/performance.spec.ts:80:5 › permission failures retain the worksheet and offer manual export with zero page errors (1.4s)
  ✓  4 e2e/performance.spec.ts:229:5 › an internal improvement requires more observation rather than a production win (842ms)


  1) e2e/performance.spec.ts:80:5 › permission failures retain the worksheet and offer manual export with zero page errors 

    Error: page.evaluate: ReferenceError: outcome is not defined
        at eval (eval at evaluate (:303:30), <anonymous>:15:182)
        at UtilityScript.evaluate (<anonymous>:305:16)
        at UtilityScript.<anonymous> (<anonymous>:1:44)
        at eval (eval at evaluate (:303:30), <anonymous>:15:182)
        at UtilityScript.evaluate (<anonymous>:305:16)
        at UtilityScript.<anonymous> (<anonymous>:1:44)
        at measureState (/Users/angelito/personal/Development-Playbook/.worktrees/stage-09-performance-port/web/e2e/performance.spec.ts:114:38)
        at /Users/angelito/personal/Development-Playbook/.worktrees/stage-09-performance-port/web/e2e/performance.spec.ts:216:5

    Error Context: ../.superpowers/sdd/2026-10-08-stage-09-interactive-port/denied-state-green-fixed-artifacts/performance-permission-fai-3a1fd-xport-with-zero-page-errors/error-context.md

  1 failed
    e2e/performance.spec.ts:80:5 › permission failures retain the worksheet and offer manual export with zero page errors 
  3 passed (19.4s)
```

### denied-state-01c-format

Command: `env -u NO_COLOR pnpm exec prettier --write e2e/performance.spec.ts`. Exit: `0`.

Formatted the inspected final label-based collector.

```text
e2e/performance.spec.ts 72ms
```

### denied-state-02c-green

Command: `env -u NO_COLOR pnpm exec playwright test e2e/performance.spec.ts --output=../.superpowers/sdd/2026-10-08-stage-09-interactive-port/denied-state-green-final-artifacts`. Exit: `0`.

Corrected GREEN: four cases pass, 28 states and 84 nonempty observed pairs captured.

```text

Running 4 tests using 1 worker

  ✓  1 e2e/performance.spec.ts:6:5 › performance choices use native radio keys and keep the first committed answer (986ms)
  ✓  2 e2e/performance.spec.ts:29:5 › performance worksheets support direct links, Back and reload with long literal input in both themes (3.6s)
PERFORMANCE_PERMISSION_STATE {"theme":"light","width":320,"id":"panel-record","state":"save-denied","height":1787.59375,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(138, 90, 6)","bgs":["rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"draft-outcome","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved observer and outcome"},{"id":"draft-scope","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved scope"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"light","width":390,"id":"panel-record","state":"save-denied","height":1631.09375,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(138, 90, 6)","bgs":["rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"draft-outcome","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved observer and outcome"},{"id":"draft-scope","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved scope"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"light","width":768,"id":"panel-record","state":"save-denied","height":1463.890625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(138, 90, 6)","bgs":["rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"draft-outcome","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved observer and outcome"},{"id":"draft-scope","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved scope"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"light","width":1024,"id":"panel-record","state":"save-denied","height":1463.890625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(138, 90, 6)","bgs":["rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"draft-outcome","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved observer and outcome"},{"id":"draft-scope","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved scope"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"light","width":1440,"id":"panel-record","state":"save-denied","height":1463.890625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(138, 90, 6)","bgs":["rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"draft-outcome","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved observer and outcome"},{"id":"draft-scope","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved scope"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"light","width":1920,"id":"panel-record","state":"save-denied","height":1463.890625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(138, 90, 6)","bgs":["rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"draft-outcome","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved observer and outcome"},{"id":"draft-scope","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved scope"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"light","width":2560,"id":"panel-record","state":"save-denied","height":1463.890625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(138, 90, 6)","bgs":["rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"draft-outcome","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved observer and outcome"},{"id":"draft-scope","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved scope"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"light","width":320,"id":"panel-record","state":"copy-denied","height":2053.84375,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(138, 90, 6)","bgs":["rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"copy-status","fg":"rgb(70, 88, 110)","bgs":["rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Copy is unavailable. Select the Markdown below and copy it manually."},{"id":"manual-markdown","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"# Performance measurement record\n\n## Outcome and observer\n\nUnsaved observer and outcome\n\n## Metric and population\n\nnot recorded\n\n## Scope\n\nUnsaved scope\n\n## Win"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"light","width":390,"id":"panel-record","state":"copy-denied","height":1877.34375,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(138, 90, 6)","bgs":["rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"copy-status","fg":"rgb(70, 88, 110)","bgs":["rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Copy is unavailable. Select the Markdown below and copy it manually."},{"id":"manual-markdown","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"# Performance measurement record\n\n## Outcome and observer\n\nUnsaved observer and outcome\n\n## Metric and population\n\nnot recorded\n\n## Scope\n\nUnsaved scope\n\n## Win"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"light","width":768,"id":"panel-record","state":"copy-denied","height":1690.140625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(138, 90, 6)","bgs":["rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"copy-status","fg":"rgb(70, 88, 110)","bgs":["rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Copy is unavailable. Select the Markdown below and copy it manually."},{"id":"manual-markdown","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"# Performance measurement record\n\n## Outcome and observer\n\nUnsaved observer and outcome\n\n## Metric and population\n\nnot recorded\n\n## Scope\n\nUnsaved scope\n\n## Win"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"light","width":1024,"id":"panel-record","state":"copy-denied","height":1690.140625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(138, 90, 6)","bgs":["rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"copy-status","fg":"rgb(70, 88, 110)","bgs":["rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Copy is unavailable. Select the Markdown below and copy it manually."},{"id":"manual-markdown","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"# Performance measurement record\n\n## Outcome and observer\n\nUnsaved observer and outcome\n\n## Metric and population\n\nnot recorded\n\n## Scope\n\nUnsaved scope\n\n## Win"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"light","width":1440,"id":"panel-record","state":"copy-denied","height":1690.140625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(138, 90, 6)","bgs":["rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"copy-status","fg":"rgb(70, 88, 110)","bgs":["rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Copy is unavailable. Select the Markdown below and copy it manually."},{"id":"manual-markdown","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"# Performance measurement record\n\n## Outcome and observer\n\nUnsaved observer and outcome\n\n## Metric and population\n\nnot recorded\n\n## Scope\n\nUnsaved scope\n\n## Win"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"light","width":1920,"id":"panel-record","state":"copy-denied","height":1690.140625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(138, 90, 6)","bgs":["rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"copy-status","fg":"rgb(70, 88, 110)","bgs":["rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Copy is unavailable. Select the Markdown below and copy it manually."},{"id":"manual-markdown","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"# Performance measurement record\n\n## Outcome and observer\n\nUnsaved observer and outcome\n\n## Metric and population\n\nnot recorded\n\n## Scope\n\nUnsaved scope\n\n## Win"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"light","width":2560,"id":"panel-record","state":"copy-denied","height":1690.140625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(138, 90, 6)","bgs":["rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"copy-status","fg":"rgb(70, 88, 110)","bgs":["rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Copy is unavailable. Select the Markdown below and copy it manually."},{"id":"manual-markdown","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"# Performance measurement record\n\n## Outcome and observer\n\nUnsaved observer and outcome\n\n## Metric and population\n\nnot recorded\n\n## Scope\n\nUnsaved scope\n\n## Win"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"dark","width":320,"id":"panel-record","state":"save-denied","height":1787.59375,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(227, 171, 77)","bgs":["rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"draft-outcome","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved observer and outcome"},{"id":"draft-scope","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved scope"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"dark","width":390,"id":"panel-record","state":"save-denied","height":1631.09375,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(227, 171, 77)","bgs":["rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"draft-outcome","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved observer and outcome"},{"id":"draft-scope","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved scope"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"dark","width":768,"id":"panel-record","state":"save-denied","height":1463.890625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(227, 171, 77)","bgs":["rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"draft-outcome","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved observer and outcome"},{"id":"draft-scope","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved scope"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"dark","width":1024,"id":"panel-record","state":"save-denied","height":1463.890625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(227, 171, 77)","bgs":["rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"draft-outcome","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved observer and outcome"},{"id":"draft-scope","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved scope"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"dark","width":1440,"id":"panel-record","state":"save-denied","height":1463.890625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(227, 171, 77)","bgs":["rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"draft-outcome","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved observer and outcome"},{"id":"draft-scope","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved scope"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"dark","width":1920,"id":"panel-record","state":"save-denied","height":1463.890625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(227, 171, 77)","bgs":["rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"draft-outcome","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved observer and outcome"},{"id":"draft-scope","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved scope"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"dark","width":2560,"id":"panel-record","state":"save-denied","height":1463.890625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(227, 171, 77)","bgs":["rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"draft-outcome","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved observer and outcome"},{"id":"draft-scope","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved scope"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"dark","width":320,"id":"panel-record","state":"copy-denied","height":2053.84375,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(227, 171, 77)","bgs":["rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"copy-status","fg":"rgb(173, 192, 212)","bgs":["rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Copy is unavailable. Select the Markdown below and copy it manually."},{"id":"manual-markdown","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"# Performance measurement record\n\n## Outcome and observer\n\nUnsaved observer and outcome\n\n## Metric and population\n\nnot recorded\n\n## Scope\n\nUnsaved scope\n\n## Win"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"dark","width":390,"id":"panel-record","state":"copy-denied","height":1877.34375,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(227, 171, 77)","bgs":["rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"copy-status","fg":"rgb(173, 192, 212)","bgs":["rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Copy is unavailable. Select the Markdown below and copy it manually."},{"id":"manual-markdown","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"# Performance measurement record\n\n## Outcome and observer\n\nUnsaved observer and outcome\n\n## Metric and population\n\nnot recorded\n\n## Scope\n\nUnsaved scope\n\n## Win"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"dark","width":768,"id":"panel-record","state":"copy-denied","height":1690.140625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(227, 171, 77)","bgs":["rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"copy-status","fg":"rgb(173, 192, 212)","bgs":["rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Copy is unavailable. Select the Markdown below and copy it manually."},{"id":"manual-markdown","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"# Performance measurement record\n\n## Outcome and observer\n\nUnsaved observer and outcome\n\n## Metric and population\n\nnot recorded\n\n## Scope\n\nUnsaved scope\n\n## Win"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"dark","width":1024,"id":"panel-record","state":"copy-denied","height":1690.140625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(227, 171, 77)","bgs":["rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"copy-status","fg":"rgb(173, 192, 212)","bgs":["rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Copy is unavailable. Select the Markdown below and copy it manually."},{"id":"manual-markdown","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"# Performance measurement record\n\n## Outcome and observer\n\nUnsaved observer and outcome\n\n## Metric and population\n\nnot recorded\n\n## Scope\n\nUnsaved scope\n\n## Win"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"dark","width":1440,"id":"panel-record","state":"copy-denied","height":1690.140625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(227, 171, 77)","bgs":["rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"copy-status","fg":"rgb(173, 192, 212)","bgs":["rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Copy is unavailable. Select the Markdown below and copy it manually."},{"id":"manual-markdown","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"# Performance measurement record\n\n## Outcome and observer\n\nUnsaved observer and outcome\n\n## Metric and population\n\nnot recorded\n\n## Scope\n\nUnsaved scope\n\n## Win"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"dark","width":1920,"id":"panel-record","state":"copy-denied","height":1690.140625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(227, 171, 77)","bgs":["rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"copy-status","fg":"rgb(173, 192, 212)","bgs":["rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Copy is unavailable. Select the Markdown below and copy it manually."},{"id":"manual-markdown","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"# Performance measurement record\n\n## Outcome and observer\n\nUnsaved observer and outcome\n\n## Metric and population\n\nnot recorded\n\n## Scope\n\nUnsaved scope\n\n## Win"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"dark","width":2560,"id":"panel-record","state":"copy-denied","height":1690.140625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(227, 171, 77)","bgs":["rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"copy-status","fg":"rgb(173, 192, 212)","bgs":["rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Copy is unavailable. Select the Markdown below and copy it manually."},{"id":"manual-markdown","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"# Performance measurement record\n\n## Outcome and observer\n\nUnsaved observer and outcome\n\n## Metric and population\n\nnot recorded\n\n## Scope\n\nUnsaved scope\n\n## Win"}],"smallTargets":[]}
  ✓  3 e2e/performance.spec.ts:80:5 › permission failures retain the worksheet and offer manual export with zero page errors (2.5s)
  ✓  4 e2e/performance.spec.ts:235:5 › an internal improvement requires more observation rather than a production win (806ms)

  4 passed (21.1s)
```

### denied-state-03-teeth

Command: `env -u NO_COLOR pnpm exec playwright test e2e/performance.spec.ts --output=../.superpowers/sdd/2026-10-08-stage-09-interactive-port/denied-state-teeth-artifacts`. Exit: `1`.

Teeth mutation: temporarily replace setDraft(saved ? null : next) with setDraft(null) in PerformanceWorksheet. Exactly the permission case fails for the right reason: expected own draft outcome, received empty string. The other three browser cases pass. The scratch runner restores component bytes in try/finally immediately after the command.

```text

Running 4 tests using 1 worker

  ✓  1 e2e/performance.spec.ts:6:5 › performance choices use native radio keys and keep the first committed answer (1.1s)
  ✓  2 e2e/performance.spec.ts:29:5 › performance worksheets support direct links, Back and reload with long literal input in both themes (4.0s)
  ✘  3 e2e/performance.spec.ts:80:5 › permission failures retain the worksheet and offer manual export with zero page errors (6.4s)
  ✓  4 e2e/performance.spec.ts:235:5 › an internal improvement requires more observation rather than a production win (894ms)


  1) e2e/performance.spec.ts:80:5 › permission failures retain the worksheet and offer manual export with zero page errors 

    Error: expect(locator).toHaveValue(expected) failed

    Locator:  getByLabel('Outcome and observer', { exact: true })
    Expected: "Unsaved observer and outcome"
    Received: ""
    Timeout:  5000ms

    Call log:
      - Expect "toHaveValue" with timeout 5000ms
      - waiting for getByLabel('Outcome and observer', { exact: true })
        14 × locator resolved to <textarea rows="2" id="_r_0_-outcome" aria-describedby="_r_0_-outcome-hint" class="w-full resize-y border border-line bg-sunken px-3 py-2 text-[15px] leading-6 text-fg focus-visible:outline-2 focus-visible:outline-brand"></textarea>
           - unexpected value ""


      218 |     await expect(
      219 |       page.getByLabel('Outcome and observer', { exact: true }),
    > 220 |     ).toHaveValue('Unsaved observer and outcome')
          |       ^
      221 |     await expect(page.getByText(/Saving is unavailable/)).toBeVisible()
      222 |     await measureState('save-denied', theme)
      223 |     await page.getByRole('button', { name: 'Copy as Markdown' }).click()
        at /Users/angelito/personal/Development-Playbook/.worktrees/stage-09-performance-port/web/e2e/performance.spec.ts:220:7

    Error Context: ../.superpowers/sdd/2026-10-08-stage-09-interactive-port/denied-state-teeth-artifacts/performance-permission-fai-3a1fd-xport-with-zero-page-errors/error-context.md

  1 failed
    e2e/performance.spec.ts:80:5 › permission failures retain the worksheet and offer manual export with zero page errors 
  3 passed (24.6s)
```

### denied-state-04-restored

Command: `env -u NO_COLOR pnpm exec playwright test e2e/performance.spec.ts --output=../.superpowers/sdd/2026-10-08-stage-09-interactive-port/denied-state-restored-artifacts`. Exit: `0`.

Restored GREEN: all four cases pass; final 28 captures and 84 nonempty pairs retained. Worksheet byte restoration verified separately.

```text

Running 4 tests using 1 worker

  ✓  1 e2e/performance.spec.ts:6:5 › performance choices use native radio keys and keep the first committed answer (1.0s)
  ✓  2 e2e/performance.spec.ts:29:5 › performance worksheets support direct links, Back and reload with long literal input in both themes (3.6s)
PERFORMANCE_PERMISSION_STATE {"theme":"light","width":320,"id":"panel-record","state":"save-denied","height":1787.59375,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(138, 90, 6)","bgs":["rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"draft-outcome","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved observer and outcome"},{"id":"draft-scope","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved scope"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"light","width":390,"id":"panel-record","state":"save-denied","height":1631.09375,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(138, 90, 6)","bgs":["rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"draft-outcome","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved observer and outcome"},{"id":"draft-scope","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved scope"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"light","width":768,"id":"panel-record","state":"save-denied","height":1463.890625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(138, 90, 6)","bgs":["rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"draft-outcome","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved observer and outcome"},{"id":"draft-scope","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved scope"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"light","width":1024,"id":"panel-record","state":"save-denied","height":1463.890625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(138, 90, 6)","bgs":["rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"draft-outcome","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved observer and outcome"},{"id":"draft-scope","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved scope"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"light","width":1440,"id":"panel-record","state":"save-denied","height":1463.890625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(138, 90, 6)","bgs":["rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"draft-outcome","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved observer and outcome"},{"id":"draft-scope","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved scope"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"light","width":1920,"id":"panel-record","state":"save-denied","height":1463.890625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(138, 90, 6)","bgs":["rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"draft-outcome","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved observer and outcome"},{"id":"draft-scope","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved scope"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"light","width":2560,"id":"panel-record","state":"save-denied","height":1463.890625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(138, 90, 6)","bgs":["rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"draft-outcome","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved observer and outcome"},{"id":"draft-scope","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved scope"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"light","width":320,"id":"panel-record","state":"copy-denied","height":2053.84375,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(138, 90, 6)","bgs":["rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"copy-status","fg":"rgb(70, 88, 110)","bgs":["rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Copy is unavailable. Select the Markdown below and copy it manually."},{"id":"manual-markdown","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"# Performance measurement record\n\n## Outcome and observer\n\nUnsaved observer and outcome\n\n## Metric and population\n\nnot recorded\n\n## Scope\n\nUnsaved scope\n\n## Win"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"light","width":390,"id":"panel-record","state":"copy-denied","height":1877.34375,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(138, 90, 6)","bgs":["rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"copy-status","fg":"rgb(70, 88, 110)","bgs":["rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Copy is unavailable. Select the Markdown below and copy it manually."},{"id":"manual-markdown","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"# Performance measurement record\n\n## Outcome and observer\n\nUnsaved observer and outcome\n\n## Metric and population\n\nnot recorded\n\n## Scope\n\nUnsaved scope\n\n## Win"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"light","width":768,"id":"panel-record","state":"copy-denied","height":1690.140625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(138, 90, 6)","bgs":["rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"copy-status","fg":"rgb(70, 88, 110)","bgs":["rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Copy is unavailable. Select the Markdown below and copy it manually."},{"id":"manual-markdown","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"# Performance measurement record\n\n## Outcome and observer\n\nUnsaved observer and outcome\n\n## Metric and population\n\nnot recorded\n\n## Scope\n\nUnsaved scope\n\n## Win"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"light","width":1024,"id":"panel-record","state":"copy-denied","height":1690.140625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(138, 90, 6)","bgs":["rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"copy-status","fg":"rgb(70, 88, 110)","bgs":["rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Copy is unavailable. Select the Markdown below and copy it manually."},{"id":"manual-markdown","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"# Performance measurement record\n\n## Outcome and observer\n\nUnsaved observer and outcome\n\n## Metric and population\n\nnot recorded\n\n## Scope\n\nUnsaved scope\n\n## Win"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"light","width":1440,"id":"panel-record","state":"copy-denied","height":1690.140625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(138, 90, 6)","bgs":["rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"copy-status","fg":"rgb(70, 88, 110)","bgs":["rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Copy is unavailable. Select the Markdown below and copy it manually."},{"id":"manual-markdown","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"# Performance measurement record\n\n## Outcome and observer\n\nUnsaved observer and outcome\n\n## Metric and population\n\nnot recorded\n\n## Scope\n\nUnsaved scope\n\n## Win"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"light","width":1920,"id":"panel-record","state":"copy-denied","height":1690.140625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(138, 90, 6)","bgs":["rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"copy-status","fg":"rgb(70, 88, 110)","bgs":["rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Copy is unavailable. Select the Markdown below and copy it manually."},{"id":"manual-markdown","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"# Performance measurement record\n\n## Outcome and observer\n\nUnsaved observer and outcome\n\n## Metric and population\n\nnot recorded\n\n## Scope\n\nUnsaved scope\n\n## Win"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"light","width":2560,"id":"panel-record","state":"copy-denied","height":1690.140625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(138, 90, 6)","bgs":["rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"copy-status","fg":"rgb(70, 88, 110)","bgs":["rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Copy is unavailable. Select the Markdown below and copy it manually."},{"id":"manual-markdown","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"# Performance measurement record\n\n## Outcome and observer\n\nUnsaved observer and outcome\n\n## Metric and population\n\nnot recorded\n\n## Scope\n\nUnsaved scope\n\n## Win"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"dark","width":320,"id":"panel-record","state":"save-denied","height":1787.59375,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(227, 171, 77)","bgs":["rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"draft-outcome","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved observer and outcome"},{"id":"draft-scope","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved scope"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"dark","width":390,"id":"panel-record","state":"save-denied","height":1631.09375,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(227, 171, 77)","bgs":["rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"draft-outcome","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved observer and outcome"},{"id":"draft-scope","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved scope"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"dark","width":768,"id":"panel-record","state":"save-denied","height":1463.890625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(227, 171, 77)","bgs":["rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"draft-outcome","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved observer and outcome"},{"id":"draft-scope","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved scope"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"dark","width":1024,"id":"panel-record","state":"save-denied","height":1463.890625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(227, 171, 77)","bgs":["rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"draft-outcome","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved observer and outcome"},{"id":"draft-scope","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved scope"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"dark","width":1440,"id":"panel-record","state":"save-denied","height":1463.890625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(227, 171, 77)","bgs":["rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"draft-outcome","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved observer and outcome"},{"id":"draft-scope","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved scope"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"dark","width":1920,"id":"panel-record","state":"save-denied","height":1463.890625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(227, 171, 77)","bgs":["rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"draft-outcome","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved observer and outcome"},{"id":"draft-scope","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved scope"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"dark","width":2560,"id":"panel-record","state":"save-denied","height":1463.890625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(227, 171, 77)","bgs":["rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"draft-outcome","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved observer and outcome"},{"id":"draft-scope","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved scope"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"dark","width":320,"id":"panel-record","state":"copy-denied","height":2053.84375,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(227, 171, 77)","bgs":["rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"copy-status","fg":"rgb(173, 192, 212)","bgs":["rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Copy is unavailable. Select the Markdown below and copy it manually."},{"id":"manual-markdown","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"# Performance measurement record\n\n## Outcome and observer\n\nUnsaved observer and outcome\n\n## Metric and population\n\nnot recorded\n\n## Scope\n\nUnsaved scope\n\n## Win"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"dark","width":390,"id":"panel-record","state":"copy-denied","height":1877.34375,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(227, 171, 77)","bgs":["rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"copy-status","fg":"rgb(173, 192, 212)","bgs":["rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Copy is unavailable. Select the Markdown below and copy it manually."},{"id":"manual-markdown","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"# Performance measurement record\n\n## Outcome and observer\n\nUnsaved observer and outcome\n\n## Metric and population\n\nnot recorded\n\n## Scope\n\nUnsaved scope\n\n## Win"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"dark","width":768,"id":"panel-record","state":"copy-denied","height":1690.140625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(227, 171, 77)","bgs":["rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"copy-status","fg":"rgb(173, 192, 212)","bgs":["rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Copy is unavailable. Select the Markdown below and copy it manually."},{"id":"manual-markdown","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"# Performance measurement record\n\n## Outcome and observer\n\nUnsaved observer and outcome\n\n## Metric and population\n\nnot recorded\n\n## Scope\n\nUnsaved scope\n\n## Win"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"dark","width":1024,"id":"panel-record","state":"copy-denied","height":1690.140625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(227, 171, 77)","bgs":["rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"copy-status","fg":"rgb(173, 192, 212)","bgs":["rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Copy is unavailable. Select the Markdown below and copy it manually."},{"id":"manual-markdown","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"# Performance measurement record\n\n## Outcome and observer\n\nUnsaved observer and outcome\n\n## Metric and population\n\nnot recorded\n\n## Scope\n\nUnsaved scope\n\n## Win"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"dark","width":1440,"id":"panel-record","state":"copy-denied","height":1690.140625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(227, 171, 77)","bgs":["rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"copy-status","fg":"rgb(173, 192, 212)","bgs":["rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Copy is unavailable. Select the Markdown below and copy it manually."},{"id":"manual-markdown","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"# Performance measurement record\n\n## Outcome and observer\n\nUnsaved observer and outcome\n\n## Metric and population\n\nnot recorded\n\n## Scope\n\nUnsaved scope\n\n## Win"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"dark","width":1920,"id":"panel-record","state":"copy-denied","height":1690.140625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(227, 171, 77)","bgs":["rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"copy-status","fg":"rgb(173, 192, 212)","bgs":["rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Copy is unavailable. Select the Markdown below and copy it manually."},{"id":"manual-markdown","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"# Performance measurement record\n\n## Outcome and observer\n\nUnsaved observer and outcome\n\n## Metric and population\n\nnot recorded\n\n## Scope\n\nUnsaved scope\n\n## Win"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"dark","width":2560,"id":"panel-record","state":"copy-denied","height":1690.140625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(227, 171, 77)","bgs":["rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"copy-status","fg":"rgb(173, 192, 212)","bgs":["rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Copy is unavailable. Select the Markdown below and copy it manually."},{"id":"manual-markdown","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"# Performance measurement record\n\n## Outcome and observer\n\nUnsaved observer and outcome\n\n## Metric and population\n\nnot recorded\n\n## Scope\n\nUnsaved scope\n\n## Win"}],"smallTargets":[]}
  ✓  3 e2e/performance.spec.ts:80:5 › permission failures retain the worksheet and offer manual export with zero page errors (2.4s)
  ✓  4 e2e/performance.spec.ts:235:5 › an internal improvement requires more observation rather than a production win (768ms)

  4 passed (22.9s)
```

### denied-state-05-lint

Command: `env -u NO_COLOR pnpm lint`. Exit: `0`.

Full ESLint passes with zero warnings on the final test source.

```text

> web@0.1.0 lint /Users/angelito/personal/Development-Playbook/.worktrees/stage-09-performance-port/web
> eslint --max-warnings 0

```

### denied-state-06-server-ended

Command: `env -u NO_COLOR lsof -nP -iTCP:3100 -sTCP:LISTEN`. Exit: `1`.

Exit 1 with empty stdout confirms no configured production listener remains. No process was stopped.

```text
```

### denied-state-07-commit

Command: `env -u NO_COLOR python3 .superpowers/sdd/2026-10-08-stage-09-interactive-port/denied-state-commit.py`. Exit: `0`.

Only the owned browser spec committed; Lefthook format and lint pass. File unchanged by the hook.

```text
[38;2;0;0;0m╭[38;2;5;5;5m─[38;2;11;11;11m─[38;2;16;16;16m─[38;2;19;19;19m─[38;2;23;23;23m─[38;2;26;26;26m─[38;2;29;29;29m─[38;2;32;32;32m─[38;2;35;35;35m─[38;2;39;39;39m─[38;2;42;42;42m─[38;2;45;45;45m─[38;2;49;49;49m─[38;2;52;52;52m─[38;2;56;56;56m─[38;2;56;56;56m─[38;2;52;52;52m─[38;2;49;49;49m─[38;2;45;45;45m─[38;2;42;42;42m─[38;2;39;39;39m─[38;2;35;35;35m─[38;2;32;32;32m─[38;2;29;29;29m─[38;2;26;26;26m─[38;2;23;23;23m─[38;2;19;19;19m─[38;2;16;16;16m─[38;2;11;11;11m─[38;2;5;5;5m─[38;2;0;0;0m─[38;2;0;0;0m─[38;2;5;5;5m─[38;2;11;11;11m─[38;2;16;16;16m─[38;2;19;19;19m─[38;2;23;23;23m─[38;2;26;26;26m─[38;2;29;29;29m─[38;2;32;32;32m─[38;2;35;35;35m─[38;2;39;39;39m─[38;2;42;42;42m╮[m
[38;2;0;0;0m│[m 🥊 lefthook  v2.1.10   hook:  [1mpre-commit[m [38;2;52;52;52m│[m
[38;2;6;6;6m╰[38;2;12;12;12m─[38;2;17;17;17m─[38;2;20;20;20m─[38;2;24;24;24m─[38;2;27;27;27m─[38;2;31;31;31m─[38;2;34;34;34m─[38;2;38;38;38m─[38;2;41;41;41m─[38;2;45;45;45m─[38;2;48;48;48m─[38;2;52;52;52m─[38;2;56;56;56m─[38;2;56;56;56m─[38;2;52;52;52m─[38;2;48;48;48m─[38;2;45;45;45m─[38;2;41;41;41m─[38;2;38;38;38m─[38;2;34;34;34m─[38;2;31;31;31m─[38;2;27;27;27m─[38;2;24;24;24m─[38;2;20;20;20m─[38;2;17;17;17m─[38;2;12;12;12m─[38;2;6;6;6m─[38;2;0;0;0m─[38;2;0;0;0m─[38;2;5;5;5m─[38;2;11;11;11m─[38;2;16;16;16m─[38;2;19;19;19m─[38;2;23;23;23m─[38;2;26;26;26m─[38;2;29;29;29m─[38;2;32;32;32m─[38;2;35;35;35m─[38;2;39;39;39m─[38;2;42;42;42m─[38;2;45;45;45m─[38;2;49;49;49m─[38;2;52;52;52m╯[m
┃  format ❯ 
e2e/performance.spec.ts 107ms (unchanged)

┃  lint ❯ 

[38;2;56;56;56m  ────────────────────────────────────[m
summary: (done in 2.66 seconds)
✔️ format (0.63 seconds)
✔️ lint (2.63 seconds)
[feat/stage-09-performance-port ac53bcf] test(performance): measure denied-state layouts in both themes
 1 file changed, 124 insertions(+), 16 deletions(-)
```

### denied-state-08-final-state

Command: `env -u NO_COLOR python3 final-state heredoc (git status, diff-tree, worksheet bytes, preserved tests, subject/trailer and diff --check)`. Exit: `0`.

Clean worktree; only performance.spec.ts committed; worksheet restored; four case declarations and other three test bodies unchanged; exact subject/trailer, captured-state totals and committed whitespace pass.

```text
HEAD=ac53bcf5b84f90213f18b50ccbbd9355e1a1d03c
PASS: clean worktree; only performance.spec.ts committed; worksheet byte-identical; four declarations and three other test bodies unchanged; subject/trailer and diff whitespace verified.
PASS: 28 final captures, 84 nonempty pairs, zero overflow/small targets; 1024 heights 1463.890625 and 1690.140625 px in both themes.
```


## Denied-state independent review

Review clean. Twelve raw logs/exits match; 28 restored measurements and 84 nonempty pairs match the captured browser runs. Worksheet restoration is byte-exact; commit trailer verified. Review source: `denied-state-verification-review.md`.


---

# Glossary resize fix report

Finding: I2, Important (blocking), PRE-EXISTING shared component responsive defect.
Base: `ac53bcf5b84f90213f18b50ccbbd9355e1a1d03c`. Commit: `915c99114fbb91856ca9b33da33686a1303f9e33`.
Workdir: `/Users/angelito/personal/Development-Playbook/.worktrees/stage-09-performance-port`.

## Diagnosis before edit

Root's revealed-state walk captured open Cumulative Layout Shift note overflow, retained in `ui-measurements-before-glossary-fix.json`. Closing and reopening at the narrow width clears it. Inspection found that Term's positioning effect depends only on open: it resets the margin and clamps the initial rectangle but never observes viewport resize. Hypothesis: an open note retains its old horizontal position after layout changes; a resize callback must reset stale margin before measuring and recompute the existing right clamp.

The new tests were written before touching Term.tsx. DOM RED demonstrates the actual component leaving a 1002 px right edge in a 768 px viewport. Browser RED opens CLS at 2560, keeps it open while resizing across every required width in both themes, and captures overflow at 768/1024. All existing browser cases remain green. These are genuine behavior failures, not missing-module or environment failures.

## Implementation and owned files

- `web/src/components/Term.tsx`: the existing positioning effect uses one reposition callback on open and resize. It clears marginLeft before getBoundingClientRect, applies the unchanged 16 px right boundary, and removes its resize listener on close/unmount. DOM style mutation only; no state update in an effect. Escape/outside-click logic, unknown-key fallback, definitions and visual markup are unchanged.
- `web/src/components/Term.test.tsx`: one real render regression with mocked browser geometry only, since jsdom has no layout. It checks contained bounds after shrinking and return to the natural anchor after growing, with the same note still open. Expected coordinates are literal fixtures independent of Term's calculation. Window geometry and the prototype boundary are restored in finally without disturbing shared ResizeObserver setup.
- `web/e2e/performance.spec.ts`: one browser regression added after the unchanged four existing cases. CLS opens at 2560, stays open and visits 2560, 768, 1024, 320, 390, 1440 and 1920 in light and dark themes. Assertions cover horizontal note boundaries, no horizontal page overflow, visibility and expanded state. Normal vertical document scrolling remains outside this horizontal-clamp fix. Actual observations emit PERFORMANCE_GLOSSARY_RESIZE JSON.

## Verification and self-review

DOM GREEN/restored: 1/1. Browser GREEN/restored: 5/5. Removing only resize listener registration reproduces exactly the new DOM and browser failures; four existing browser cases still pass. Component bytes were restored immediately after teeth. Final full suite: 1458/1458 across 197 files. Typecheck, owned format, lint, Lefthook and committed whitespace pass. All fourteen restored open-note observations are horizontally contained with zero document overflow; retained data is `glossary-resize-restored-measurements.json`. The browser builds were fresh through the configured webServer/globalSetup; no own listener remains on port 3100.

Only the three owned files were committed with the required subject and trailer. Owned files and index are clean. Root's plan/canonical report aggregation remains modified and unstaged; both files were preserved byte for byte during this commit. The final state below reports them explicitly. No unrelated file, shared storage hook, drill or glossary data changed. All subprocess commands remove only NO_COLOR from their environment.

Deferred: root's scoped independent review, final global production/development-console gates, fresh manual Chrome reload and revealed-state verification, canonical report/tracker/handoff aggregation, primitive redesign/vertical placement, shared hook/drill extraction, merge, push and deployment. No agents were spawned or integration actions performed.

## Raw terminal evidence

DOM/browser/format/typecheck/lint/full-suite commands run from this worktree's web/; git and port checks run from its root. Every fence equals its retained actual log. True exit status and interpretation are outside each fence.

### glossary-01-dom-red

Command: `env -u NO_COLOR pnpm exec vitest run src/components/Term.test.tsx`. Exit: `1`.

Genuine assertion RED before any production edit: the real open Term note retains its old offset after resize. Right edge 1002 exceeds the independently expected 752 px boundary. Not an import failure or fake component.

```text

 RUN  v4.1.10 /Users/angelito/personal/Development-Playbook/.worktrees/stage-09-performance-port/web

 ❯ |dom| src/components/Term.test.tsx (1 test | 1 failed) 70ms
   × an open definition stays inside a narrower viewport and returns to its anchor when space grows 70ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  |dom| src/components/Term.test.tsx > an open definition stays inside a narrower viewport and returns to its anchor when space grows
AssertionError: expected 1002 to be less than or equal to 752
 ❯ src/components/Term.test.tsx:21:48
     19|     window.innerWidth = 768
     20|     fireEvent(window, new Event('resize'))
     21|     expect(note.getBoundingClientRect().right).toBeLessThanOrEqual(752)
       |                                                ^
     22|     expect(note.getBoundingClientRect().left).toBeGreaterThanOrEqual(1…
     23|     window.innerWidth = 1600

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed (1)
      Tests  1 failed (1)
   Start at  14:36:27
   Duration  885ms (transform 55ms, setup 104ms, import 48ms, tests 70ms, environment 555ms)

```

### glossary-02-browser-red

Command: `env -u NO_COLOR pnpm exec playwright test e2e/performance.spec.ts --output=../.superpowers/sdd/2026-10-08-stage-09-interactive-port/glossary-red-artifacts`. Exit: `1`.

Genuine browser RED against unchanged production: only the new open-definition case fails, with 116 px horizontal overflow at 768 and 126 px at 1024 in each theme. All four existing cases pass. The case records all fourteen geometry observations before reporting its failures.

```text

Running 5 tests using 1 worker

  ✓  1 e2e/performance.spec.ts:6:5 › performance choices use native radio keys and keep the first committed answer (1.2s)
  ✓  2 e2e/performance.spec.ts:29:5 › performance worksheets support direct links, Back and reload with long literal input in both themes (3.6s)
PERFORMANCE_PERMISSION_STATE {"theme":"light","width":320,"id":"panel-record","state":"save-denied","height":1787.59375,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(138, 90, 6)","bgs":["rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"draft-outcome","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved observer and outcome"},{"id":"draft-scope","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved scope"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"light","width":390,"id":"panel-record","state":"save-denied","height":1631.09375,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(138, 90, 6)","bgs":["rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"draft-outcome","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved observer and outcome"},{"id":"draft-scope","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved scope"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"light","width":768,"id":"panel-record","state":"save-denied","height":1463.890625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(138, 90, 6)","bgs":["rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"draft-outcome","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved observer and outcome"},{"id":"draft-scope","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved scope"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"light","width":1024,"id":"panel-record","state":"save-denied","height":1463.890625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(138, 90, 6)","bgs":["rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"draft-outcome","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved observer and outcome"},{"id":"draft-scope","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved scope"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"light","width":1440,"id":"panel-record","state":"save-denied","height":1463.890625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(138, 90, 6)","bgs":["rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"draft-outcome","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved observer and outcome"},{"id":"draft-scope","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved scope"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"light","width":1920,"id":"panel-record","state":"save-denied","height":1463.890625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(138, 90, 6)","bgs":["rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"draft-outcome","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved observer and outcome"},{"id":"draft-scope","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved scope"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"light","width":2560,"id":"panel-record","state":"save-denied","height":1463.890625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(138, 90, 6)","bgs":["rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"draft-outcome","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved observer and outcome"},{"id":"draft-scope","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved scope"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"light","width":320,"id":"panel-record","state":"copy-denied","height":2053.84375,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(138, 90, 6)","bgs":["rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"copy-status","fg":"rgb(70, 88, 110)","bgs":["rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Copy is unavailable. Select the Markdown below and copy it manually."},{"id":"manual-markdown","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"# Performance measurement record\n\n## Outcome and observer\n\nUnsaved observer and outcome\n\n## Metric and population\n\nnot recorded\n\n## Scope\n\nUnsaved scope\n\n## Win"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"light","width":390,"id":"panel-record","state":"copy-denied","height":1877.34375,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(138, 90, 6)","bgs":["rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"copy-status","fg":"rgb(70, 88, 110)","bgs":["rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Copy is unavailable. Select the Markdown below and copy it manually."},{"id":"manual-markdown","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"# Performance measurement record\n\n## Outcome and observer\n\nUnsaved observer and outcome\n\n## Metric and population\n\nnot recorded\n\n## Scope\n\nUnsaved scope\n\n## Win"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"light","width":768,"id":"panel-record","state":"copy-denied","height":1690.140625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(138, 90, 6)","bgs":["rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"copy-status","fg":"rgb(70, 88, 110)","bgs":["rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Copy is unavailable. Select the Markdown below and copy it manually."},{"id":"manual-markdown","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"# Performance measurement record\n\n## Outcome and observer\n\nUnsaved observer and outcome\n\n## Metric and population\n\nnot recorded\n\n## Scope\n\nUnsaved scope\n\n## Win"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"light","width":1024,"id":"panel-record","state":"copy-denied","height":1690.140625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(138, 90, 6)","bgs":["rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"copy-status","fg":"rgb(70, 88, 110)","bgs":["rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Copy is unavailable. Select the Markdown below and copy it manually."},{"id":"manual-markdown","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"# Performance measurement record\n\n## Outcome and observer\n\nUnsaved observer and outcome\n\n## Metric and population\n\nnot recorded\n\n## Scope\n\nUnsaved scope\n\n## Win"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"light","width":1440,"id":"panel-record","state":"copy-denied","height":1690.140625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(138, 90, 6)","bgs":["rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"copy-status","fg":"rgb(70, 88, 110)","bgs":["rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Copy is unavailable. Select the Markdown below and copy it manually."},{"id":"manual-markdown","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"# Performance measurement record\n\n## Outcome and observer\n\nUnsaved observer and outcome\n\n## Metric and population\n\nnot recorded\n\n## Scope\n\nUnsaved scope\n\n## Win"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"light","width":1920,"id":"panel-record","state":"copy-denied","height":1690.140625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(138, 90, 6)","bgs":["rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"copy-status","fg":"rgb(70, 88, 110)","bgs":["rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Copy is unavailable. Select the Markdown below and copy it manually."},{"id":"manual-markdown","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"# Performance measurement record\n\n## Outcome and observer\n\nUnsaved observer and outcome\n\n## Metric and population\n\nnot recorded\n\n## Scope\n\nUnsaved scope\n\n## Win"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"light","width":2560,"id":"panel-record","state":"copy-denied","height":1690.140625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(138, 90, 6)","bgs":["rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"copy-status","fg":"rgb(70, 88, 110)","bgs":["rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Copy is unavailable. Select the Markdown below and copy it manually."},{"id":"manual-markdown","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"# Performance measurement record\n\n## Outcome and observer\n\nUnsaved observer and outcome\n\n## Metric and population\n\nnot recorded\n\n## Scope\n\nUnsaved scope\n\n## Win"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"dark","width":320,"id":"panel-record","state":"save-denied","height":1787.59375,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(227, 171, 77)","bgs":["rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"draft-outcome","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved observer and outcome"},{"id":"draft-scope","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved scope"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"dark","width":390,"id":"panel-record","state":"save-denied","height":1631.09375,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(227, 171, 77)","bgs":["rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"draft-outcome","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved observer and outcome"},{"id":"draft-scope","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved scope"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"dark","width":768,"id":"panel-record","state":"save-denied","height":1463.890625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(227, 171, 77)","bgs":["rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"draft-outcome","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved observer and outcome"},{"id":"draft-scope","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved scope"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"dark","width":1024,"id":"panel-record","state":"save-denied","height":1463.890625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(227, 171, 77)","bgs":["rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"draft-outcome","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved observer and outcome"},{"id":"draft-scope","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved scope"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"dark","width":1440,"id":"panel-record","state":"save-denied","height":1463.890625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(227, 171, 77)","bgs":["rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"draft-outcome","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved observer and outcome"},{"id":"draft-scope","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved scope"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"dark","width":1920,"id":"panel-record","state":"save-denied","height":1463.890625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(227, 171, 77)","bgs":["rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"draft-outcome","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved observer and outcome"},{"id":"draft-scope","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved scope"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"dark","width":2560,"id":"panel-record","state":"save-denied","height":1463.890625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(227, 171, 77)","bgs":["rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"draft-outcome","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved observer and outcome"},{"id":"draft-scope","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved scope"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"dark","width":320,"id":"panel-record","state":"copy-denied","height":2053.84375,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(227, 171, 77)","bgs":["rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"copy-status","fg":"rgb(173, 192, 212)","bgs":["rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Copy is unavailable. Select the Markdown below and copy it manually."},{"id":"manual-markdown","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"# Performance measurement record\n\n## Outcome and observer\n\nUnsaved observer and outcome\n\n## Metric and population\n\nnot recorded\n\n## Scope\n\nUnsaved scope\n\n## Win"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"dark","width":390,"id":"panel-record","state":"copy-denied","height":1877.34375,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(227, 171, 77)","bgs":["rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"copy-status","fg":"rgb(173, 192, 212)","bgs":["rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Copy is unavailable. Select the Markdown below and copy it manually."},{"id":"manual-markdown","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"# Performance measurement record\n\n## Outcome and observer\n\nUnsaved observer and outcome\n\n## Metric and population\n\nnot recorded\n\n## Scope\n\nUnsaved scope\n\n## Win"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"dark","width":768,"id":"panel-record","state":"copy-denied","height":1690.140625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(227, 171, 77)","bgs":["rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"copy-status","fg":"rgb(173, 192, 212)","bgs":["rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Copy is unavailable. Select the Markdown below and copy it manually."},{"id":"manual-markdown","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"# Performance measurement record\n\n## Outcome and observer\n\nUnsaved observer and outcome\n\n## Metric and population\n\nnot recorded\n\n## Scope\n\nUnsaved scope\n\n## Win"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"dark","width":1024,"id":"panel-record","state":"copy-denied","height":1690.140625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(227, 171, 77)","bgs":["rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"copy-status","fg":"rgb(173, 192, 212)","bgs":["rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Copy is unavailable. Select the Markdown below and copy it manually."},{"id":"manual-markdown","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"# Performance measurement record\n\n## Outcome and observer\n\nUnsaved observer and outcome\n\n## Metric and population\n\nnot recorded\n\n## Scope\n\nUnsaved scope\n\n## Win"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"dark","width":1440,"id":"panel-record","state":"copy-denied","height":1690.140625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(227, 171, 77)","bgs":["rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"copy-status","fg":"rgb(173, 192, 212)","bgs":["rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Copy is unavailable. Select the Markdown below and copy it manually."},{"id":"manual-markdown","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"# Performance measurement record\n\n## Outcome and observer\n\nUnsaved observer and outcome\n\n## Metric and population\n\nnot recorded\n\n## Scope\n\nUnsaved scope\n\n## Win"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"dark","width":1920,"id":"panel-record","state":"copy-denied","height":1690.140625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(227, 171, 77)","bgs":["rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"copy-status","fg":"rgb(173, 192, 212)","bgs":["rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Copy is unavailable. Select the Markdown below and copy it manually."},{"id":"manual-markdown","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"# Performance measurement record\n\n## Outcome and observer\n\nUnsaved observer and outcome\n\n## Metric and population\n\nnot recorded\n\n## Scope\n\nUnsaved scope\n\n## Win"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"dark","width":2560,"id":"panel-record","state":"copy-denied","height":1690.140625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(227, 171, 77)","bgs":["rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"copy-status","fg":"rgb(173, 192, 212)","bgs":["rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Copy is unavailable. Select the Markdown below and copy it manually."},{"id":"manual-markdown","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"# Performance measurement record\n\n## Outcome and observer\n\nUnsaved observer and outcome\n\n## Metric and population\n\nnot recorded\n\n## Scope\n\nUnsaved scope\n\n## Win"}],"smallTargets":[]}
  ✓  3 e2e/performance.spec.ts:80:5 › permission failures retain the worksheet and offer manual export with zero page errors (2.3s)
  ✓  4 e2e/performance.spec.ts:235:5 › an internal improvement requires more observation rather than a production win (798ms)
PERFORMANCE_GLOSSARY_RESIZE {"theme":"light","width":2560,"left":1677,"right":2029,"overflow":0}
PERFORMANCE_GLOSSARY_RESIZE {"theme":"light","width":768,"left":531.65625,"right":883.65625,"overflow":116}
PERFORMANCE_GLOSSARY_RESIZE {"theme":"light","width":1024,"left":798.328125,"right":1150.328125,"overflow":126}
PERFORMANCE_GLOSSARY_RESIZE {"theme":"light","width":320,"left":45,"right":317,"overflow":0}
PERFORMANCE_GLOSSARY_RESIZE {"theme":"light","width":390,"left":45,"right":387,"overflow":0}
PERFORMANCE_GLOSSARY_RESIZE {"theme":"light","width":1440,"left":1075.65625,"right":1427.65625,"overflow":0}
PERFORMANCE_GLOSSARY_RESIZE {"theme":"light","width":1920,"left":1357,"right":1709,"overflow":0}
PERFORMANCE_GLOSSARY_RESIZE {"theme":"dark","width":2560,"left":1677,"right":2029,"overflow":0}
PERFORMANCE_GLOSSARY_RESIZE {"theme":"dark","width":768,"left":531.65625,"right":883.65625,"overflow":116}
PERFORMANCE_GLOSSARY_RESIZE {"theme":"dark","width":1024,"left":798.328125,"right":1150.328125,"overflow":126}
PERFORMANCE_GLOSSARY_RESIZE {"theme":"dark","width":320,"left":45,"right":317,"overflow":0}
PERFORMANCE_GLOSSARY_RESIZE {"theme":"dark","width":390,"left":45,"right":387,"overflow":0}
PERFORMANCE_GLOSSARY_RESIZE {"theme":"dark","width":1440,"left":1075.65625,"right":1427.65625,"overflow":0}
PERFORMANCE_GLOSSARY_RESIZE {"theme":"dark","width":1920,"left":1357,"right":1709,"overflow":0}
  ✘  5 e2e/performance.spec.ts:255:5 › an open glossary definition stays inside every viewport after resizing in both themes (2.4s)


  1) e2e/performance.spec.ts:255:5 › an open glossary definition stays inside every viewport after resizing in both themes 

    Error: light/768: {"left":531.65625,"right":883.65625,"overflow":116}
    light/1024: {"left":798.328125,"right":1150.328125,"overflow":126}
    dark/768: {"left":531.65625,"right":883.65625,"overflow":116}
    dark/1024: {"left":798.328125,"right":1150.328125,"overflow":126}

    expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 6

    - Array []
    + Array [
    +   "light/768: {\"left\":531.65625,\"right\":883.65625,\"overflow\":116}",
    +   "light/1024: {\"left\":798.328125,\"right\":1150.328125,\"overflow\":126}",
    +   "dark/768: {\"left\":531.65625,\"right\":883.65625,\"overflow\":116}",
    +   "dark/1024: {\"left\":798.328125,\"right\":1150.328125,\"overflow\":126}",
    + ]

      285 |     }
      286 |   }
    > 287 |   expect(failures, failures.join('\n')).toEqual([])
          |                                         ^
      288 | })
      289 |
        at /Users/angelito/personal/Development-Playbook/.worktrees/stage-09-performance-port/web/e2e/performance.spec.ts:287:41

    Error Context: ../.superpowers/sdd/2026-10-08-stage-09-interactive-port/glossary-red-artifacts/performance-an-open-glossa-63772-ter-resizing-in-both-themes/error-context.md

  1 failed
    e2e/performance.spec.ts:255:5 › an open glossary definition stays inside every viewport after resizing in both themes 
  4 passed (22.7s)
```

### glossary-03-format

Command: `env -u NO_COLOR pnpm exec prettier --write src/components/Term.tsx src/components/Term.test.tsx e2e/performance.spec.ts`. Exit: `0`.

Only three owned files formatted.

```text
src/components/Term.tsx 45ms (unchanged)
src/components/Term.test.tsx 7ms
e2e/performance.spec.ts 36ms
```

### glossary-04-dom-green

Command: `env -u NO_COLOR pnpm exec vitest run src/components/Term.test.tsx`. Exit: `0`.

DOM GREEN: narrowing keeps the note inside and widening restores its natural anchor, proving stale margin is cleared before measurement.

```text

 RUN  v4.1.10 /Users/angelito/personal/Development-Playbook/.worktrees/stage-09-performance-port/web


 Test Files  1 passed (1)
      Tests  1 passed (1)
   Start at  14:37:30
   Duration  854ms (transform 59ms, setup 94ms, import 53ms, tests 71ms, environment 531ms)

```

### glossary-05-browser-green

Command: `env -u NO_COLOR pnpm exec playwright test e2e/performance.spec.ts --output=../.superpowers/sdd/2026-10-08-stage-09-interactive-port/glossary-green-artifacts`. Exit: `0`.

Five production browser cases pass, including fourteen horizontal note bounds and overflow observations.

```text

Running 5 tests using 1 worker

  ✓  1 e2e/performance.spec.ts:6:5 › performance choices use native radio keys and keep the first committed answer (1.0s)
  ✓  2 e2e/performance.spec.ts:29:5 › performance worksheets support direct links, Back and reload with long literal input in both themes (3.6s)
PERFORMANCE_PERMISSION_STATE {"theme":"light","width":320,"id":"panel-record","state":"save-denied","height":1787.59375,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(138, 90, 6)","bgs":["rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"draft-outcome","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved observer and outcome"},{"id":"draft-scope","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved scope"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"light","width":390,"id":"panel-record","state":"save-denied","height":1631.09375,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(138, 90, 6)","bgs":["rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"draft-outcome","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved observer and outcome"},{"id":"draft-scope","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved scope"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"light","width":768,"id":"panel-record","state":"save-denied","height":1463.890625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(138, 90, 6)","bgs":["rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"draft-outcome","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved observer and outcome"},{"id":"draft-scope","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved scope"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"light","width":1024,"id":"panel-record","state":"save-denied","height":1463.890625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(138, 90, 6)","bgs":["rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"draft-outcome","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved observer and outcome"},{"id":"draft-scope","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved scope"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"light","width":1440,"id":"panel-record","state":"save-denied","height":1463.890625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(138, 90, 6)","bgs":["rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"draft-outcome","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved observer and outcome"},{"id":"draft-scope","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved scope"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"light","width":1920,"id":"panel-record","state":"save-denied","height":1463.890625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(138, 90, 6)","bgs":["rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"draft-outcome","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved observer and outcome"},{"id":"draft-scope","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved scope"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"light","width":2560,"id":"panel-record","state":"save-denied","height":1463.890625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(138, 90, 6)","bgs":["rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"draft-outcome","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved observer and outcome"},{"id":"draft-scope","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved scope"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"light","width":320,"id":"panel-record","state":"copy-denied","height":2053.84375,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(138, 90, 6)","bgs":["rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"copy-status","fg":"rgb(70, 88, 110)","bgs":["rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Copy is unavailable. Select the Markdown below and copy it manually."},{"id":"manual-markdown","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"# Performance measurement record\n\n## Outcome and observer\n\nUnsaved observer and outcome\n\n## Metric and population\n\nnot recorded\n\n## Scope\n\nUnsaved scope\n\n## Win"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"light","width":390,"id":"panel-record","state":"copy-denied","height":1877.34375,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(138, 90, 6)","bgs":["rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"copy-status","fg":"rgb(70, 88, 110)","bgs":["rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Copy is unavailable. Select the Markdown below and copy it manually."},{"id":"manual-markdown","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"# Performance measurement record\n\n## Outcome and observer\n\nUnsaved observer and outcome\n\n## Metric and population\n\nnot recorded\n\n## Scope\n\nUnsaved scope\n\n## Win"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"light","width":768,"id":"panel-record","state":"copy-denied","height":1690.140625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(138, 90, 6)","bgs":["rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"copy-status","fg":"rgb(70, 88, 110)","bgs":["rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Copy is unavailable. Select the Markdown below and copy it manually."},{"id":"manual-markdown","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"# Performance measurement record\n\n## Outcome and observer\n\nUnsaved observer and outcome\n\n## Metric and population\n\nnot recorded\n\n## Scope\n\nUnsaved scope\n\n## Win"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"light","width":1024,"id":"panel-record","state":"copy-denied","height":1690.140625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(138, 90, 6)","bgs":["rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"copy-status","fg":"rgb(70, 88, 110)","bgs":["rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Copy is unavailable. Select the Markdown below and copy it manually."},{"id":"manual-markdown","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"# Performance measurement record\n\n## Outcome and observer\n\nUnsaved observer and outcome\n\n## Metric and population\n\nnot recorded\n\n## Scope\n\nUnsaved scope\n\n## Win"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"light","width":1440,"id":"panel-record","state":"copy-denied","height":1690.140625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(138, 90, 6)","bgs":["rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"copy-status","fg":"rgb(70, 88, 110)","bgs":["rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Copy is unavailable. Select the Markdown below and copy it manually."},{"id":"manual-markdown","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"# Performance measurement record\n\n## Outcome and observer\n\nUnsaved observer and outcome\n\n## Metric and population\n\nnot recorded\n\n## Scope\n\nUnsaved scope\n\n## Win"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"light","width":1920,"id":"panel-record","state":"copy-denied","height":1690.140625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(138, 90, 6)","bgs":["rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"copy-status","fg":"rgb(70, 88, 110)","bgs":["rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Copy is unavailable. Select the Markdown below and copy it manually."},{"id":"manual-markdown","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"# Performance measurement record\n\n## Outcome and observer\n\nUnsaved observer and outcome\n\n## Metric and population\n\nnot recorded\n\n## Scope\n\nUnsaved scope\n\n## Win"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"light","width":2560,"id":"panel-record","state":"copy-denied","height":1690.140625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(138, 90, 6)","bgs":["rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"copy-status","fg":"rgb(70, 88, 110)","bgs":["rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Copy is unavailable. Select the Markdown below and copy it manually."},{"id":"manual-markdown","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"# Performance measurement record\n\n## Outcome and observer\n\nUnsaved observer and outcome\n\n## Metric and population\n\nnot recorded\n\n## Scope\n\nUnsaved scope\n\n## Win"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"dark","width":320,"id":"panel-record","state":"save-denied","height":1787.59375,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(227, 171, 77)","bgs":["rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"draft-outcome","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved observer and outcome"},{"id":"draft-scope","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved scope"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"dark","width":390,"id":"panel-record","state":"save-denied","height":1631.09375,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(227, 171, 77)","bgs":["rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"draft-outcome","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved observer and outcome"},{"id":"draft-scope","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved scope"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"dark","width":768,"id":"panel-record","state":"save-denied","height":1463.890625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(227, 171, 77)","bgs":["rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"draft-outcome","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved observer and outcome"},{"id":"draft-scope","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved scope"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"dark","width":1024,"id":"panel-record","state":"save-denied","height":1463.890625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(227, 171, 77)","bgs":["rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"draft-outcome","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved observer and outcome"},{"id":"draft-scope","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved scope"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"dark","width":1440,"id":"panel-record","state":"save-denied","height":1463.890625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(227, 171, 77)","bgs":["rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"draft-outcome","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved observer and outcome"},{"id":"draft-scope","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved scope"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"dark","width":1920,"id":"panel-record","state":"save-denied","height":1463.890625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(227, 171, 77)","bgs":["rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"draft-outcome","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved observer and outcome"},{"id":"draft-scope","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved scope"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"dark","width":2560,"id":"panel-record","state":"save-denied","height":1463.890625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(227, 171, 77)","bgs":["rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"draft-outcome","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved observer and outcome"},{"id":"draft-scope","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved scope"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"dark","width":320,"id":"panel-record","state":"copy-denied","height":2053.84375,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(227, 171, 77)","bgs":["rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"copy-status","fg":"rgb(173, 192, 212)","bgs":["rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Copy is unavailable. Select the Markdown below and copy it manually."},{"id":"manual-markdown","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"# Performance measurement record\n\n## Outcome and observer\n\nUnsaved observer and outcome\n\n## Metric and population\n\nnot recorded\n\n## Scope\n\nUnsaved scope\n\n## Win"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"dark","width":390,"id":"panel-record","state":"copy-denied","height":1877.34375,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(227, 171, 77)","bgs":["rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"copy-status","fg":"rgb(173, 192, 212)","bgs":["rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Copy is unavailable. Select the Markdown below and copy it manually."},{"id":"manual-markdown","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"# Performance measurement record\n\n## Outcome and observer\n\nUnsaved observer and outcome\n\n## Metric and population\n\nnot recorded\n\n## Scope\n\nUnsaved scope\n\n## Win"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"dark","width":768,"id":"panel-record","state":"copy-denied","height":1690.140625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(227, 171, 77)","bgs":["rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"copy-status","fg":"rgb(173, 192, 212)","bgs":["rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Copy is unavailable. Select the Markdown below and copy it manually."},{"id":"manual-markdown","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"# Performance measurement record\n\n## Outcome and observer\n\nUnsaved observer and outcome\n\n## Metric and population\n\nnot recorded\n\n## Scope\n\nUnsaved scope\n\n## Win"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"dark","width":1024,"id":"panel-record","state":"copy-denied","height":1690.140625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(227, 171, 77)","bgs":["rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"copy-status","fg":"rgb(173, 192, 212)","bgs":["rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Copy is unavailable. Select the Markdown below and copy it manually."},{"id":"manual-markdown","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"# Performance measurement record\n\n## Outcome and observer\n\nUnsaved observer and outcome\n\n## Metric and population\n\nnot recorded\n\n## Scope\n\nUnsaved scope\n\n## Win"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"dark","width":1440,"id":"panel-record","state":"copy-denied","height":1690.140625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(227, 171, 77)","bgs":["rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"copy-status","fg":"rgb(173, 192, 212)","bgs":["rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Copy is unavailable. Select the Markdown below and copy it manually."},{"id":"manual-markdown","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"# Performance measurement record\n\n## Outcome and observer\n\nUnsaved observer and outcome\n\n## Metric and population\n\nnot recorded\n\n## Scope\n\nUnsaved scope\n\n## Win"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"dark","width":1920,"id":"panel-record","state":"copy-denied","height":1690.140625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(227, 171, 77)","bgs":["rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"copy-status","fg":"rgb(173, 192, 212)","bgs":["rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Copy is unavailable. Select the Markdown below and copy it manually."},{"id":"manual-markdown","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"# Performance measurement record\n\n## Outcome and observer\n\nUnsaved observer and outcome\n\n## Metric and population\n\nnot recorded\n\n## Scope\n\nUnsaved scope\n\n## Win"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"dark","width":2560,"id":"panel-record","state":"copy-denied","height":1690.140625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(227, 171, 77)","bgs":["rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"copy-status","fg":"rgb(173, 192, 212)","bgs":["rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Copy is unavailable. Select the Markdown below and copy it manually."},{"id":"manual-markdown","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"# Performance measurement record\n\n## Outcome and observer\n\nUnsaved observer and outcome\n\n## Metric and population\n\nnot recorded\n\n## Scope\n\nUnsaved scope\n\n## Win"}],"smallTargets":[]}
  ✓  3 e2e/performance.spec.ts:80:5 › permission failures retain the worksheet and offer manual export with zero page errors (2.4s)
  ✓  4 e2e/performance.spec.ts:235:5 › an internal improvement requires more observation rather than a production win (756ms)
PERFORMANCE_GLOSSARY_RESIZE {"theme":"light","width":2560,"left":1677,"right":2029,"overflow":0}
PERFORMANCE_GLOSSARY_RESIZE {"theme":"light","width":768,"left":399.65625,"right":751.65625,"overflow":0}
PERFORMANCE_GLOSSARY_RESIZE {"theme":"light","width":1024,"left":655.328125,"right":1007.328125,"overflow":0}
PERFORMANCE_GLOSSARY_RESIZE {"theme":"light","width":320,"left":32,"right":304,"overflow":0}
PERFORMANCE_GLOSSARY_RESIZE {"theme":"light","width":390,"left":32,"right":374,"overflow":0}
PERFORMANCE_GLOSSARY_RESIZE {"theme":"light","width":1440,"left":1071.65625,"right":1423.65625,"overflow":0}
PERFORMANCE_GLOSSARY_RESIZE {"theme":"light","width":1920,"left":1357,"right":1709,"overflow":0}
PERFORMANCE_GLOSSARY_RESIZE {"theme":"dark","width":2560,"left":1677,"right":2029,"overflow":0}
PERFORMANCE_GLOSSARY_RESIZE {"theme":"dark","width":768,"left":399.65625,"right":751.65625,"overflow":0}
PERFORMANCE_GLOSSARY_RESIZE {"theme":"dark","width":1024,"left":655.328125,"right":1007.328125,"overflow":0}
PERFORMANCE_GLOSSARY_RESIZE {"theme":"dark","width":320,"left":32,"right":304,"overflow":0}
PERFORMANCE_GLOSSARY_RESIZE {"theme":"dark","width":390,"left":32,"right":374,"overflow":0}
PERFORMANCE_GLOSSARY_RESIZE {"theme":"dark","width":1440,"left":1071.65625,"right":1423.65625,"overflow":0}
PERFORMANCE_GLOSSARY_RESIZE {"theme":"dark","width":1920,"left":1357,"right":1709,"overflow":0}
  ✓  5 e2e/performance.spec.ts:255:5 › an open glossary definition stays inside every viewport after resizing in both themes (2.3s)

  5 passed (22.4s)
```

### glossary-06-dom-teeth

Command: `env -u NO_COLOR pnpm exec vitest run src/components/Term.test.tsx`. Exit: `1`.

Temporarily remove only window.addEventListener for resize. The new DOM regression alone fails for the same right-edge error; initial open positioning is retained.

```text

 RUN  v4.1.10 /Users/angelito/personal/Development-Playbook/.worktrees/stage-09-performance-port/web

 ❯ |dom| src/components/Term.test.tsx (1 test | 1 failed) 75ms
   × an open definition stays inside a narrower viewport and returns to its anchor when space grows 75ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  |dom| src/components/Term.test.tsx > an open definition stays inside a narrower viewport and returns to its anchor when space grows
AssertionError: expected 1002 to be less than or equal to 752
 ❯ src/components/Term.test.tsx:30:48
     28|     window.innerWidth = 768
     29|     fireEvent(window, new Event('resize'))
     30|     expect(note.getBoundingClientRect().right).toBeLessThanOrEqual(752)
       |                                                ^
     31|     expect(note.getBoundingClientRect().left).toBeGreaterThanOrEqual(1…
     32|     window.innerWidth = 1600

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed (1)
      Tests  1 failed (1)
   Start at  14:38:44
   Duration  1.10s (transform 92ms, setup 117ms, import 86ms, tests 75ms, environment 725ms)

```

### glossary-07-browser-teeth

Command: `env -u NO_COLOR pnpm exec playwright test e2e/performance.spec.ts --output=../.superpowers/sdd/2026-10-08-stage-09-interactive-port/glossary-teeth-artifacts`. Exit: `1`.

With resize registration removed, only the new browser case fails; four old cases pass. Same 768/1024 overflow in both themes. The runner restores the formatted component bytes immediately in try/finally after both teeth commands.

```text

Running 5 tests using 1 worker

  ✓  1 e2e/performance.spec.ts:6:5 › performance choices use native radio keys and keep the first committed answer (1.1s)
  ✓  2 e2e/performance.spec.ts:29:5 › performance worksheets support direct links, Back and reload with long literal input in both themes (3.6s)
PERFORMANCE_PERMISSION_STATE {"theme":"light","width":320,"id":"panel-record","state":"save-denied","height":1787.59375,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(138, 90, 6)","bgs":["rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"draft-outcome","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved observer and outcome"},{"id":"draft-scope","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved scope"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"light","width":390,"id":"panel-record","state":"save-denied","height":1631.09375,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(138, 90, 6)","bgs":["rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"draft-outcome","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved observer and outcome"},{"id":"draft-scope","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved scope"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"light","width":768,"id":"panel-record","state":"save-denied","height":1463.890625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(138, 90, 6)","bgs":["rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"draft-outcome","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved observer and outcome"},{"id":"draft-scope","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved scope"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"light","width":1024,"id":"panel-record","state":"save-denied","height":1463.890625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(138, 90, 6)","bgs":["rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"draft-outcome","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved observer and outcome"},{"id":"draft-scope","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved scope"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"light","width":1440,"id":"panel-record","state":"save-denied","height":1463.890625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(138, 90, 6)","bgs":["rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"draft-outcome","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved observer and outcome"},{"id":"draft-scope","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved scope"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"light","width":1920,"id":"panel-record","state":"save-denied","height":1463.890625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(138, 90, 6)","bgs":["rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"draft-outcome","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved observer and outcome"},{"id":"draft-scope","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved scope"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"light","width":2560,"id":"panel-record","state":"save-denied","height":1463.890625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(138, 90, 6)","bgs":["rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"draft-outcome","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved observer and outcome"},{"id":"draft-scope","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved scope"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"light","width":320,"id":"panel-record","state":"copy-denied","height":2053.84375,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(138, 90, 6)","bgs":["rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"copy-status","fg":"rgb(70, 88, 110)","bgs":["rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Copy is unavailable. Select the Markdown below and copy it manually."},{"id":"manual-markdown","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"# Performance measurement record\n\n## Outcome and observer\n\nUnsaved observer and outcome\n\n## Metric and population\n\nnot recorded\n\n## Scope\n\nUnsaved scope\n\n## Win"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"light","width":390,"id":"panel-record","state":"copy-denied","height":1877.34375,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(138, 90, 6)","bgs":["rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"copy-status","fg":"rgb(70, 88, 110)","bgs":["rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Copy is unavailable. Select the Markdown below and copy it manually."},{"id":"manual-markdown","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"# Performance measurement record\n\n## Outcome and observer\n\nUnsaved observer and outcome\n\n## Metric and population\n\nnot recorded\n\n## Scope\n\nUnsaved scope\n\n## Win"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"light","width":768,"id":"panel-record","state":"copy-denied","height":1690.140625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(138, 90, 6)","bgs":["rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"copy-status","fg":"rgb(70, 88, 110)","bgs":["rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Copy is unavailable. Select the Markdown below and copy it manually."},{"id":"manual-markdown","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"# Performance measurement record\n\n## Outcome and observer\n\nUnsaved observer and outcome\n\n## Metric and population\n\nnot recorded\n\n## Scope\n\nUnsaved scope\n\n## Win"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"light","width":1024,"id":"panel-record","state":"copy-denied","height":1690.140625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(138, 90, 6)","bgs":["rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"copy-status","fg":"rgb(70, 88, 110)","bgs":["rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Copy is unavailable. Select the Markdown below and copy it manually."},{"id":"manual-markdown","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"# Performance measurement record\n\n## Outcome and observer\n\nUnsaved observer and outcome\n\n## Metric and population\n\nnot recorded\n\n## Scope\n\nUnsaved scope\n\n## Win"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"light","width":1440,"id":"panel-record","state":"copy-denied","height":1690.140625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(138, 90, 6)","bgs":["rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"copy-status","fg":"rgb(70, 88, 110)","bgs":["rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Copy is unavailable. Select the Markdown below and copy it manually."},{"id":"manual-markdown","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"# Performance measurement record\n\n## Outcome and observer\n\nUnsaved observer and outcome\n\n## Metric and population\n\nnot recorded\n\n## Scope\n\nUnsaved scope\n\n## Win"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"light","width":1920,"id":"panel-record","state":"copy-denied","height":1690.140625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(138, 90, 6)","bgs":["rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"copy-status","fg":"rgb(70, 88, 110)","bgs":["rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Copy is unavailable. Select the Markdown below and copy it manually."},{"id":"manual-markdown","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"# Performance measurement record\n\n## Outcome and observer\n\nUnsaved observer and outcome\n\n## Metric and population\n\nnot recorded\n\n## Scope\n\nUnsaved scope\n\n## Win"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"light","width":2560,"id":"panel-record","state":"copy-denied","height":1690.140625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(138, 90, 6)","bgs":["rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"copy-status","fg":"rgb(70, 88, 110)","bgs":["rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Copy is unavailable. Select the Markdown below and copy it manually."},{"id":"manual-markdown","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"# Performance measurement record\n\n## Outcome and observer\n\nUnsaved observer and outcome\n\n## Metric and population\n\nnot recorded\n\n## Scope\n\nUnsaved scope\n\n## Win"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"dark","width":320,"id":"panel-record","state":"save-denied","height":1787.59375,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(227, 171, 77)","bgs":["rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"draft-outcome","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved observer and outcome"},{"id":"draft-scope","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved scope"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"dark","width":390,"id":"panel-record","state":"save-denied","height":1631.09375,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(227, 171, 77)","bgs":["rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"draft-outcome","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved observer and outcome"},{"id":"draft-scope","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved scope"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"dark","width":768,"id":"panel-record","state":"save-denied","height":1463.890625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(227, 171, 77)","bgs":["rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"draft-outcome","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved observer and outcome"},{"id":"draft-scope","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved scope"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"dark","width":1024,"id":"panel-record","state":"save-denied","height":1463.890625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(227, 171, 77)","bgs":["rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"draft-outcome","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved observer and outcome"},{"id":"draft-scope","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved scope"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"dark","width":1440,"id":"panel-record","state":"save-denied","height":1463.890625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(227, 171, 77)","bgs":["rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"draft-outcome","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved observer and outcome"},{"id":"draft-scope","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved scope"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"dark","width":1920,"id":"panel-record","state":"save-denied","height":1463.890625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(227, 171, 77)","bgs":["rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"draft-outcome","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved observer and outcome"},{"id":"draft-scope","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved scope"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"dark","width":2560,"id":"panel-record","state":"save-denied","height":1463.890625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(227, 171, 77)","bgs":["rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"draft-outcome","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved observer and outcome"},{"id":"draft-scope","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved scope"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"dark","width":320,"id":"panel-record","state":"copy-denied","height":2053.84375,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(227, 171, 77)","bgs":["rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"copy-status","fg":"rgb(173, 192, 212)","bgs":["rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Copy is unavailable. Select the Markdown below and copy it manually."},{"id":"manual-markdown","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"# Performance measurement record\n\n## Outcome and observer\n\nUnsaved observer and outcome\n\n## Metric and population\n\nnot recorded\n\n## Scope\n\nUnsaved scope\n\n## Win"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"dark","width":390,"id":"panel-record","state":"copy-denied","height":1877.34375,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(227, 171, 77)","bgs":["rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"copy-status","fg":"rgb(173, 192, 212)","bgs":["rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Copy is unavailable. Select the Markdown below and copy it manually."},{"id":"manual-markdown","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"# Performance measurement record\n\n## Outcome and observer\n\nUnsaved observer and outcome\n\n## Metric and population\n\nnot recorded\n\n## Scope\n\nUnsaved scope\n\n## Win"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"dark","width":768,"id":"panel-record","state":"copy-denied","height":1690.140625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(227, 171, 77)","bgs":["rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"copy-status","fg":"rgb(173, 192, 212)","bgs":["rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Copy is unavailable. Select the Markdown below and copy it manually."},{"id":"manual-markdown","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"# Performance measurement record\n\n## Outcome and observer\n\nUnsaved observer and outcome\n\n## Metric and population\n\nnot recorded\n\n## Scope\n\nUnsaved scope\n\n## Win"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"dark","width":1024,"id":"panel-record","state":"copy-denied","height":1690.140625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(227, 171, 77)","bgs":["rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"copy-status","fg":"rgb(173, 192, 212)","bgs":["rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Copy is unavailable. Select the Markdown below and copy it manually."},{"id":"manual-markdown","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"# Performance measurement record\n\n## Outcome and observer\n\nUnsaved observer and outcome\n\n## Metric and population\n\nnot recorded\n\n## Scope\n\nUnsaved scope\n\n## Win"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"dark","width":1440,"id":"panel-record","state":"copy-denied","height":1690.140625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(227, 171, 77)","bgs":["rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"copy-status","fg":"rgb(173, 192, 212)","bgs":["rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Copy is unavailable. Select the Markdown below and copy it manually."},{"id":"manual-markdown","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"# Performance measurement record\n\n## Outcome and observer\n\nUnsaved observer and outcome\n\n## Metric and population\n\nnot recorded\n\n## Scope\n\nUnsaved scope\n\n## Win"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"dark","width":1920,"id":"panel-record","state":"copy-denied","height":1690.140625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(227, 171, 77)","bgs":["rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"copy-status","fg":"rgb(173, 192, 212)","bgs":["rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Copy is unavailable. Select the Markdown below and copy it manually."},{"id":"manual-markdown","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"# Performance measurement record\n\n## Outcome and observer\n\nUnsaved observer and outcome\n\n## Metric and population\n\nnot recorded\n\n## Scope\n\nUnsaved scope\n\n## Win"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"dark","width":2560,"id":"panel-record","state":"copy-denied","height":1690.140625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(227, 171, 77)","bgs":["rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"copy-status","fg":"rgb(173, 192, 212)","bgs":["rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Copy is unavailable. Select the Markdown below and copy it manually."},{"id":"manual-markdown","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"# Performance measurement record\n\n## Outcome and observer\n\nUnsaved observer and outcome\n\n## Metric and population\n\nnot recorded\n\n## Scope\n\nUnsaved scope\n\n## Win"}],"smallTargets":[]}
  ✓  3 e2e/performance.spec.ts:80:5 › permission failures retain the worksheet and offer manual export with zero page errors (2.4s)
  ✓  4 e2e/performance.spec.ts:235:5 › an internal improvement requires more observation rather than a production win (798ms)
PERFORMANCE_GLOSSARY_RESIZE {"theme":"light","width":2560,"left":1677,"right":2029,"overflow":0}
PERFORMANCE_GLOSSARY_RESIZE {"theme":"light","width":768,"left":531.65625,"right":883.65625,"overflow":116}
PERFORMANCE_GLOSSARY_RESIZE {"theme":"light","width":1024,"left":798.328125,"right":1150.328125,"overflow":126}
PERFORMANCE_GLOSSARY_RESIZE {"theme":"light","width":320,"left":45,"right":317,"overflow":0}
PERFORMANCE_GLOSSARY_RESIZE {"theme":"light","width":390,"left":45,"right":387,"overflow":0}
PERFORMANCE_GLOSSARY_RESIZE {"theme":"light","width":1440,"left":1075.65625,"right":1427.65625,"overflow":0}
PERFORMANCE_GLOSSARY_RESIZE {"theme":"light","width":1920,"left":1357,"right":1709,"overflow":0}
PERFORMANCE_GLOSSARY_RESIZE {"theme":"dark","width":2560,"left":1677,"right":2029,"overflow":0}
PERFORMANCE_GLOSSARY_RESIZE {"theme":"dark","width":768,"left":531.65625,"right":883.65625,"overflow":116}
PERFORMANCE_GLOSSARY_RESIZE {"theme":"dark","width":1024,"left":798.328125,"right":1150.328125,"overflow":126}
PERFORMANCE_GLOSSARY_RESIZE {"theme":"dark","width":320,"left":45,"right":317,"overflow":0}
PERFORMANCE_GLOSSARY_RESIZE {"theme":"dark","width":390,"left":45,"right":387,"overflow":0}
PERFORMANCE_GLOSSARY_RESIZE {"theme":"dark","width":1440,"left":1075.65625,"right":1427.65625,"overflow":0}
PERFORMANCE_GLOSSARY_RESIZE {"theme":"dark","width":1920,"left":1357,"right":1709,"overflow":0}
  ✘  5 e2e/performance.spec.ts:255:5 › an open glossary definition stays inside every viewport after resizing in both themes (2.3s)


  1) e2e/performance.spec.ts:255:5 › an open glossary definition stays inside every viewport after resizing in both themes 

    Error: light/768: {"left":531.65625,"right":883.65625,"overflow":116}
    light/1024: {"left":798.328125,"right":1150.328125,"overflow":126}
    dark/768: {"left":531.65625,"right":883.65625,"overflow":116}
    dark/1024: {"left":798.328125,"right":1150.328125,"overflow":126}

    expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 6

    - Array []
    + Array [
    +   "light/768: {\"left\":531.65625,\"right\":883.65625,\"overflow\":116}",
    +   "light/1024: {\"left\":798.328125,\"right\":1150.328125,\"overflow\":126}",
    +   "dark/768: {\"left\":531.65625,\"right\":883.65625,\"overflow\":116}",
    +   "dark/1024: {\"left\":798.328125,\"right\":1150.328125,\"overflow\":126}",
    + ]

      303 |     }
      304 |   }
    > 305 |   expect(failures, failures.join('\n')).toEqual([])
          |                                         ^
      306 | })
      307 |
        at /Users/angelito/personal/Development-Playbook/.worktrees/stage-09-performance-port/web/e2e/performance.spec.ts:305:41

    Error Context: ../.superpowers/sdd/2026-10-08-stage-09-interactive-port/glossary-teeth-artifacts/performance-an-open-glossa-63772-ter-resizing-in-both-themes/error-context.md

  1 failed
    e2e/performance.spec.ts:255:5 › an open glossary definition stays inside every viewport after resizing in both themes 
  4 passed (22.4s)
```

### glossary-08-dom-restored

Command: `env -u NO_COLOR pnpm exec vitest run src/components/Term.test.tsx`. Exit: `0`.

Restored DOM GREEN: one test passes.

```text

 RUN  v4.1.10 /Users/angelito/personal/Development-Playbook/.worktrees/stage-09-performance-port/web


 Test Files  1 passed (1)
      Tests  1 passed (1)
   Start at  14:39:35
   Duration  897ms (transform 71ms, setup 102ms, import 67ms, tests 84ms, environment 549ms)

```

### glossary-09-browser-restored

Command: `env -u NO_COLOR pnpm exec playwright test e2e/performance.spec.ts --output=../.superpowers/sdd/2026-10-08-stage-09-interactive-port/glossary-restored-artifacts`. Exit: `0`.

Restored fresh production GREEN: all five browser cases pass. Fourteen viewport/theme captures have zero horizontal overflow and contained horizontal note bounds.

```text

Running 5 tests using 1 worker

  ✓  1 e2e/performance.spec.ts:6:5 › performance choices use native radio keys and keep the first committed answer (1.5s)
  ✓  2 e2e/performance.spec.ts:29:5 › performance worksheets support direct links, Back and reload with long literal input in both themes (4.2s)
PERFORMANCE_PERMISSION_STATE {"theme":"light","width":320,"id":"panel-record","state":"save-denied","height":1787.59375,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(138, 90, 6)","bgs":["rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"draft-outcome","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved observer and outcome"},{"id":"draft-scope","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved scope"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"light","width":390,"id":"panel-record","state":"save-denied","height":1631.09375,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(138, 90, 6)","bgs":["rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"draft-outcome","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved observer and outcome"},{"id":"draft-scope","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved scope"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"light","width":768,"id":"panel-record","state":"save-denied","height":1463.890625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(138, 90, 6)","bgs":["rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"draft-outcome","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved observer and outcome"},{"id":"draft-scope","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved scope"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"light","width":1024,"id":"panel-record","state":"save-denied","height":1463.890625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(138, 90, 6)","bgs":["rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"draft-outcome","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved observer and outcome"},{"id":"draft-scope","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved scope"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"light","width":1440,"id":"panel-record","state":"save-denied","height":1463.890625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(138, 90, 6)","bgs":["rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"draft-outcome","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved observer and outcome"},{"id":"draft-scope","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved scope"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"light","width":1920,"id":"panel-record","state":"save-denied","height":1463.890625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(138, 90, 6)","bgs":["rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"draft-outcome","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved observer and outcome"},{"id":"draft-scope","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved scope"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"light","width":2560,"id":"panel-record","state":"save-denied","height":1463.890625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(138, 90, 6)","bgs":["rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"draft-outcome","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved observer and outcome"},{"id":"draft-scope","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved scope"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"light","width":320,"id":"panel-record","state":"copy-denied","height":2053.84375,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(138, 90, 6)","bgs":["rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"copy-status","fg":"rgb(70, 88, 110)","bgs":["rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Copy is unavailable. Select the Markdown below and copy it manually."},{"id":"manual-markdown","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"# Performance measurement record\n\n## Outcome and observer\n\nUnsaved observer and outcome\n\n## Metric and population\n\nnot recorded\n\n## Scope\n\nUnsaved scope\n\n## Win"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"light","width":390,"id":"panel-record","state":"copy-denied","height":1877.34375,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(138, 90, 6)","bgs":["rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"copy-status","fg":"rgb(70, 88, 110)","bgs":["rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Copy is unavailable. Select the Markdown below and copy it manually."},{"id":"manual-markdown","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"# Performance measurement record\n\n## Outcome and observer\n\nUnsaved observer and outcome\n\n## Metric and population\n\nnot recorded\n\n## Scope\n\nUnsaved scope\n\n## Win"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"light","width":768,"id":"panel-record","state":"copy-denied","height":1690.140625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(138, 90, 6)","bgs":["rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"copy-status","fg":"rgb(70, 88, 110)","bgs":["rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Copy is unavailable. Select the Markdown below and copy it manually."},{"id":"manual-markdown","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"# Performance measurement record\n\n## Outcome and observer\n\nUnsaved observer and outcome\n\n## Metric and population\n\nnot recorded\n\n## Scope\n\nUnsaved scope\n\n## Win"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"light","width":1024,"id":"panel-record","state":"copy-denied","height":1690.140625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(138, 90, 6)","bgs":["rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"copy-status","fg":"rgb(70, 88, 110)","bgs":["rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Copy is unavailable. Select the Markdown below and copy it manually."},{"id":"manual-markdown","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"# Performance measurement record\n\n## Outcome and observer\n\nUnsaved observer and outcome\n\n## Metric and population\n\nnot recorded\n\n## Scope\n\nUnsaved scope\n\n## Win"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"light","width":1440,"id":"panel-record","state":"copy-denied","height":1690.140625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(138, 90, 6)","bgs":["rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"copy-status","fg":"rgb(70, 88, 110)","bgs":["rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Copy is unavailable. Select the Markdown below and copy it manually."},{"id":"manual-markdown","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"# Performance measurement record\n\n## Outcome and observer\n\nUnsaved observer and outcome\n\n## Metric and population\n\nnot recorded\n\n## Scope\n\nUnsaved scope\n\n## Win"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"light","width":1920,"id":"panel-record","state":"copy-denied","height":1690.140625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(138, 90, 6)","bgs":["rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"copy-status","fg":"rgb(70, 88, 110)","bgs":["rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Copy is unavailable. Select the Markdown below and copy it manually."},{"id":"manual-markdown","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"# Performance measurement record\n\n## Outcome and observer\n\nUnsaved observer and outcome\n\n## Metric and population\n\nnot recorded\n\n## Scope\n\nUnsaved scope\n\n## Win"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"light","width":2560,"id":"panel-record","state":"copy-denied","height":1690.140625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(138, 90, 6)","bgs":["rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"copy-status","fg":"rgb(70, 88, 110)","bgs":["rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Copy is unavailable. Select the Markdown below and copy it manually."},{"id":"manual-markdown","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"# Performance measurement record\n\n## Outcome and observer\n\nUnsaved observer and outcome\n\n## Metric and population\n\nnot recorded\n\n## Scope\n\nUnsaved scope\n\n## Win"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"dark","width":320,"id":"panel-record","state":"save-denied","height":1787.59375,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(227, 171, 77)","bgs":["rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"draft-outcome","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved observer and outcome"},{"id":"draft-scope","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved scope"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"dark","width":390,"id":"panel-record","state":"save-denied","height":1631.09375,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(227, 171, 77)","bgs":["rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"draft-outcome","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved observer and outcome"},{"id":"draft-scope","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved scope"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"dark","width":768,"id":"panel-record","state":"save-denied","height":1463.890625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(227, 171, 77)","bgs":["rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"draft-outcome","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved observer and outcome"},{"id":"draft-scope","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved scope"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"dark","width":1024,"id":"panel-record","state":"save-denied","height":1463.890625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(227, 171, 77)","bgs":["rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"draft-outcome","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved observer and outcome"},{"id":"draft-scope","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved scope"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"dark","width":1440,"id":"panel-record","state":"save-denied","height":1463.890625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(227, 171, 77)","bgs":["rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"draft-outcome","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved observer and outcome"},{"id":"draft-scope","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved scope"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"dark","width":1920,"id":"panel-record","state":"save-denied","height":1463.890625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(227, 171, 77)","bgs":["rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"draft-outcome","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved observer and outcome"},{"id":"draft-scope","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved scope"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"dark","width":2560,"id":"panel-record","state":"save-denied","height":1463.890625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(227, 171, 77)","bgs":["rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"draft-outcome","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved observer and outcome"},{"id":"draft-scope","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved scope"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"dark","width":320,"id":"panel-record","state":"copy-denied","height":2053.84375,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(227, 171, 77)","bgs":["rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"copy-status","fg":"rgb(173, 192, 212)","bgs":["rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Copy is unavailable. Select the Markdown below and copy it manually."},{"id":"manual-markdown","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"# Performance measurement record\n\n## Outcome and observer\n\nUnsaved observer and outcome\n\n## Metric and population\n\nnot recorded\n\n## Scope\n\nUnsaved scope\n\n## Win"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"dark","width":390,"id":"panel-record","state":"copy-denied","height":1877.34375,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(227, 171, 77)","bgs":["rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"copy-status","fg":"rgb(173, 192, 212)","bgs":["rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Copy is unavailable. Select the Markdown below and copy it manually."},{"id":"manual-markdown","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"# Performance measurement record\n\n## Outcome and observer\n\nUnsaved observer and outcome\n\n## Metric and population\n\nnot recorded\n\n## Scope\n\nUnsaved scope\n\n## Win"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"dark","width":768,"id":"panel-record","state":"copy-denied","height":1690.140625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(227, 171, 77)","bgs":["rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"copy-status","fg":"rgb(173, 192, 212)","bgs":["rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Copy is unavailable. Select the Markdown below and copy it manually."},{"id":"manual-markdown","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"# Performance measurement record\n\n## Outcome and observer\n\nUnsaved observer and outcome\n\n## Metric and population\n\nnot recorded\n\n## Scope\n\nUnsaved scope\n\n## Win"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"dark","width":1024,"id":"panel-record","state":"copy-denied","height":1690.140625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(227, 171, 77)","bgs":["rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"copy-status","fg":"rgb(173, 192, 212)","bgs":["rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Copy is unavailable. Select the Markdown below and copy it manually."},{"id":"manual-markdown","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"# Performance measurement record\n\n## Outcome and observer\n\nUnsaved observer and outcome\n\n## Metric and population\n\nnot recorded\n\n## Scope\n\nUnsaved scope\n\n## Win"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"dark","width":1440,"id":"panel-record","state":"copy-denied","height":1690.140625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(227, 171, 77)","bgs":["rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"copy-status","fg":"rgb(173, 192, 212)","bgs":["rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Copy is unavailable. Select the Markdown below and copy it manually."},{"id":"manual-markdown","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"# Performance measurement record\n\n## Outcome and observer\n\nUnsaved observer and outcome\n\n## Metric and population\n\nnot recorded\n\n## Scope\n\nUnsaved scope\n\n## Win"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"dark","width":1920,"id":"panel-record","state":"copy-denied","height":1690.140625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(227, 171, 77)","bgs":["rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"copy-status","fg":"rgb(173, 192, 212)","bgs":["rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Copy is unavailable. Select the Markdown below and copy it manually."},{"id":"manual-markdown","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"# Performance measurement record\n\n## Outcome and observer\n\nUnsaved observer and outcome\n\n## Metric and population\n\nnot recorded\n\n## Scope\n\nUnsaved scope\n\n## Win"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"dark","width":2560,"id":"panel-record","state":"copy-denied","height":1690.140625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(227, 171, 77)","bgs":["rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"copy-status","fg":"rgb(173, 192, 212)","bgs":["rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Copy is unavailable. Select the Markdown below and copy it manually."},{"id":"manual-markdown","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"# Performance measurement record\n\n## Outcome and observer\n\nUnsaved observer and outcome\n\n## Metric and population\n\nnot recorded\n\n## Scope\n\nUnsaved scope\n\n## Win"}],"smallTargets":[]}
  ✓  3 e2e/performance.spec.ts:80:5 › permission failures retain the worksheet and offer manual export with zero page errors (2.6s)
  ✓  4 e2e/performance.spec.ts:235:5 › an internal improvement requires more observation rather than a production win (755ms)
PERFORMANCE_GLOSSARY_RESIZE {"theme":"light","width":2560,"left":1677,"right":2029,"overflow":0}
PERFORMANCE_GLOSSARY_RESIZE {"theme":"light","width":768,"left":399.65625,"right":751.65625,"overflow":0}
PERFORMANCE_GLOSSARY_RESIZE {"theme":"light","width":1024,"left":655.328125,"right":1007.328125,"overflow":0}
PERFORMANCE_GLOSSARY_RESIZE {"theme":"light","width":320,"left":32,"right":304,"overflow":0}
PERFORMANCE_GLOSSARY_RESIZE {"theme":"light","width":390,"left":32,"right":374,"overflow":0}
PERFORMANCE_GLOSSARY_RESIZE {"theme":"light","width":1440,"left":1071.65625,"right":1423.65625,"overflow":0}
PERFORMANCE_GLOSSARY_RESIZE {"theme":"light","width":1920,"left":1357,"right":1709,"overflow":0}
PERFORMANCE_GLOSSARY_RESIZE {"theme":"dark","width":2560,"left":1677,"right":2029,"overflow":0}
PERFORMANCE_GLOSSARY_RESIZE {"theme":"dark","width":768,"left":399.65625,"right":751.65625,"overflow":0}
PERFORMANCE_GLOSSARY_RESIZE {"theme":"dark","width":1024,"left":655.328125,"right":1007.328125,"overflow":0}
PERFORMANCE_GLOSSARY_RESIZE {"theme":"dark","width":320,"left":32,"right":304,"overflow":0}
PERFORMANCE_GLOSSARY_RESIZE {"theme":"dark","width":390,"left":32,"right":374,"overflow":0}
PERFORMANCE_GLOSSARY_RESIZE {"theme":"dark","width":1440,"left":1071.65625,"right":1423.65625,"overflow":0}
PERFORMANCE_GLOSSARY_RESIZE {"theme":"dark","width":1920,"left":1357,"right":1709,"overflow":0}
  ✓  5 e2e/performance.spec.ts:255:5 › an open glossary definition stays inside every viewport after resizing in both themes (2.7s)

  5 passed (58.5s)
```

### glossary-10-typecheck

Command: `env -u NO_COLOR pnpm typecheck`. Exit: `0`.

Generated route types plus tsc pass on the final three-file sources.

```text

> web@0.1.0 typecheck /Users/angelito/personal/Development-Playbook/.worktrees/stage-09-performance-port/web
> next typegen && tsc --noEmit

Generating route types...
✓ Types generated successfully
```

### glossary-11-lint

Command: `env -u NO_COLOR pnpm lint`. Exit: `0`.

ESLint passes with zero warnings; positioning mutates DOM styles and has no setState in an effect.

```text

> web@0.1.0 lint /Users/angelito/personal/Development-Playbook/.worktrees/stage-09-performance-port/web
> eslint --max-warnings 0

```

### glossary-12-full-suite

Command: `env -u NO_COLOR pnpm test`. Exit: `0`.

The full suite ran once on the restored final sources: 1458/1458 across 197 files, all green.

```text

> web@0.1.0 test /Users/angelito/personal/Development-Playbook/.worktrees/stage-09-performance-port/web
> vitest run


 RUN  v4.1.10 /Users/angelito/personal/Development-Playbook/.worktrees/stage-09-performance-port/web


 Test Files  197 passed (197)
      Tests  1458 passed (1458)
   Start at  14:39:52
   Duration  47.30s (transform 17.14s, setup 22.39s, import 42.65s, tests 96.86s, environment 124.12s)

```

### glossary-13-server-ended

Command: `env -u NO_COLOR lsof -nP -iTCP:3100 -sTCP:LISTEN`. Exit: `1`.

Exit 1 with empty output confirms no own configured production server remains. No unrelated process was stopped.

```text
```

### glossary-14-commit

Command: `env -u NO_COLOR python3 .superpowers/sdd/2026-10-08-stage-09-interactive-port/glossary-commit.py`. Exit: `0`.

Exactly the three owned files committed; Lefthook format and lint pass with all files unchanged by the hook. Root-owned plan/report bytes are preserved and left unstaged.

```text
[38;2;0;0;0m╭[38;2;5;5;5m─[38;2;11;11;11m─[38;2;16;16;16m─[38;2;19;19;19m─[38;2;23;23;23m─[38;2;26;26;26m─[38;2;29;29;29m─[38;2;32;32;32m─[38;2;35;35;35m─[38;2;39;39;39m─[38;2;42;42;42m─[38;2;45;45;45m─[38;2;49;49;49m─[38;2;52;52;52m─[38;2;56;56;56m─[38;2;56;56;56m─[38;2;52;52;52m─[38;2;49;49;49m─[38;2;45;45;45m─[38;2;42;42;42m─[38;2;39;39;39m─[38;2;35;35;35m─[38;2;32;32;32m─[38;2;29;29;29m─[38;2;26;26;26m─[38;2;23;23;23m─[38;2;19;19;19m─[38;2;16;16;16m─[38;2;11;11;11m─[38;2;5;5;5m─[38;2;0;0;0m─[38;2;0;0;0m─[38;2;5;5;5m─[38;2;11;11;11m─[38;2;16;16;16m─[38;2;19;19;19m─[38;2;23;23;23m─[38;2;26;26;26m─[38;2;29;29;29m─[38;2;32;32;32m─[38;2;35;35;35m─[38;2;39;39;39m─[38;2;42;42;42m╮[m
[38;2;0;0;0m│[m 🥊 lefthook  v2.1.10   hook:  [1mpre-commit[m [38;2;52;52;52m│[m
[38;2;6;6;6m╰[38;2;12;12;12m─[38;2;17;17;17m─[38;2;20;20;20m─[38;2;24;24;24m─[38;2;27;27;27m─[38;2;31;31;31m─[38;2;34;34;34m─[38;2;38;38;38m─[38;2;41;41;41m─[38;2;45;45;45m─[38;2;48;48;48m─[38;2;52;52;52m─[38;2;56;56;56m─[38;2;56;56;56m─[38;2;52;52;52m─[38;2;48;48;48m─[38;2;45;45;45m─[38;2;41;41;41m─[38;2;38;38;38m─[38;2;34;34;34m─[38;2;31;31;31m─[38;2;27;27;27m─[38;2;24;24;24m─[38;2;20;20;20m─[38;2;17;17;17m─[38;2;12;12;12m─[38;2;6;6;6m─[38;2;0;0;0m─[38;2;0;0;0m─[38;2;5;5;5m─[38;2;11;11;11m─[38;2;16;16;16m─[38;2;19;19;19m─[38;2;23;23;23m─[38;2;26;26;26m─[38;2;29;29;29m─[38;2;32;32;32m─[38;2;35;35;35m─[38;2;39;39;39m─[38;2;42;42;42m─[38;2;45;45;45m─[38;2;49;49;49m─[38;2;52;52;52m╯[m
┃  format ❯ 
e2e/performance.spec.ts 120ms (unchanged)
src/components/Term.test.tsx 9ms (unchanged)
src/components/Term.tsx 24ms (unchanged)

┃  lint ❯ 

[38;2;56;56;56m  ────────────────────────────────────[m
summary: (done in 2.59 seconds)
✔️ format (0.50 seconds)
✔️ lint (2.58 seconds)
[feat/stage-09-performance-port 915c991] fix(a11y): reposition open glossary notes on resize
 3 files changed, 104 insertions(+), 4 deletions(-)
 create mode 100644 web/src/components/Term.test.tsx
```

### glossary-15-final-state

Command: `env -u NO_COLOR python3 final-state heredoc (commit files, owned/index status, preserved browser bodies, subject/trailer, whitespace and capture checks)`. Exit: `0`.

Owned files and index are clean. Root-owned plan and canonical report remain unstaged; this is not a claim that the whole worktree is clean. Existing four browser cases are unchanged; required commit subject/trailer and whitespace pass.

```text
HEAD=915c99114fbb91856ca9b33da33686a1303f9e33
PASS: exactly three owned files committed; owned working tree and index clean; existing four browser cases unchanged; subject/trailer and whitespace verified.
PASS: 14 final viewport/theme samples with horizontal note bounds contained and zero overflow.
Remaining coordinator-owned unstaged changes:
 M docs/superpowers/plans/2026-10-08-stage-09-interactive-port.md
 M docs/superpowers/reports/2026-10-08-stage-09-interactive-port.md
```


## Glossary resize independent review

I2 (PRE-EXISTING shared component, blocking the required responsive check): ADDRESSED, review clean after one fix. No new findings. Fifteen raw logs/exits match; the callback resets before measuring and removes its exact listener on close/unmount. Both new regression tests demonstrated teeth; all fourteen restored theme/width samples have zero horizontal overflow. Commit trailer verified. Review source: `glossary-resize-fix-review.md`.


## Shared Stepper reset fix

# Stepper local-state reset fix report

Finding: I3, Important (blocking), PRE-EXISTING shared lifecycle defect. The approved plan assumed panel unmount/reset; this was not a Task 8 implementation error.
Base: `915c99114fbb91856ca9b33da33686a1303f9e33`. Commit: `c8b73499285c4628d93d19f914ed4b9758d4db9b`.
Workdir: `/Users/angelito/personal/Development-Playbook/.worktrees/stage-09-performance-port`.

## Diagnosis and genuine tests before implementation

Root's live walkthrough found completed bottleneck answers carried into Query. Stepper keeps the panel DOM container and wraps each active content tree in a Fragment with the constant key content. Resolved server content can put the same client child type at the same position in two trees. React then preserves its local index, draft and choices despite a different active step. Source inspection confirms bottleneck and Query place DecisionDrill under matching Section/div shapes. A changed active step must establish a fresh local content lifetime while keeping Stepper's hash, seen state and rail intact.

The DOM regression uses the real Stepper and the same small stateful LocalJudgment child type at the same position in two Step objects. Its input is edited, then a tab switch and return must clear local state. The browser case completes both bottleneck decisions, checks Query and the return to bottleneck, then resets/completes all four comparisons and checks Query/Bottleneck again in both themes. Explicit Reset before comparison establishes the four-case scenario even while the earlier broken transitions are collected during RED. Expected first-case prompt prefixes and blank state are independent literal assertions.

DOM and browser RED were recorded before any Stepper production edit. Both fail for the expected stale-state reason; the existing five browser cases stay green. DISPROVED the anticipated completed-comparison to shorter-drill invalid index in this tested RSC shape: those transitions were already fresh in RED. Different child position appears to remount that path even under the constant Fragment, but that explanation is an inference; the clean observations themselves are retained. The defect confirmed by both tests is bottleneck/Query local-state carryover. No invalid comparison index is claimed as reproduced.

## Minimal implementation and owned files

- `web/src/components/Stepper.tsx`: one key change to Fragment key={step.id}, plus a short explanatory comment. The Fragment stays keyed with a non-null key, preserving TD-43's RSC warning workaround. The active step now remounts its child content; local drills cannot share their state across step identities. No stage-local key, effect reset, new API or DOM wrapper was added.
- `web/src/components/Stepper.test.tsx`: one real render regression for switch/return lifetime, with no mocks and no production test helper.
- `web/e2e/performance.spec.ts`: sixth case added; previous five declarations and bodies are unchanged. Eight actual transition snapshots emit PERFORMANCE_DRILL_RESET. Each requires its first case prompt, blank live score, no checked radio and a disabled Commit button.

## Verification and self-review

DOM GREEN/restored: 1/1. Browser GREEN/restored: 6/6. Restoring only the constant Fragment key fails exactly the new DOM and browser regressions; existing five browser cases pass. Stepper bytes are restored immediately after teeth. Final full suite: 1459/1459 across 198 files, run once. Typecheck, owned formatting, lint, Lefthook and committed whitespace pass. The stage's existing persisted-sheet Back/reload case remains green, showing that local panel reset does not discard storage-backed record data. The rail, hash navigation, seen markers and title/hint structure remain unchanged by the diff.

Final transition data is `stepper-reset-restored-states.json`; the eight observations in both themes have first cases, no results, no selection and disabled Commit. Fresh production builds are owned by configured Playwright webServer/globalSetup. No own production listener remains on port 3100. All subprocess commands remove only NO_COLOR from their environment.

Exactly the three owned files were committed with the required subject and trailer. Owned files and index are clean. Root's ongoing KICKOFF/task/plan/canonical-report edits are left unstaged; the final state lists the actual remaining changes. Plan/report bytes were preserved during commit. This is not a claim of a globally clean tree.

Deferred: scoped independent review, root's global production/development-console gates and fresh live walkthrough, TD-43 dev validation, canonical reporting/tracker/handoff updates, unrelated lifecycle or shared-hook/drill extraction, merge, push and deployment. No agents were spawned and no integration action performed.

## Raw terminal evidence

DOM/browser/format/typecheck/lint/full-suite commands run from this worktree's web/; commit/git/port checks from its root. Every fence is the retained actual log verbatim. Exits and interpretation remain outside fences.

### stepper-reset-01-dom-red

Command: `env -u NO_COLOR pnpm exec vitest run src/components/Stepper.test.tsx`. Exit: `1`.

Genuine DOM RED before production edit: switching to another step that resolves to the same stateful child leaves First committed idea in its input rather than an empty local judgment. No component or React mock is involved.

```text

 RUN  v4.1.10 /Users/angelito/personal/Development-Playbook/.worktrees/stage-09-performance-port/web

 ❯ |dom| src/components/Stepper.test.tsx (1 test | 1 failed) 92ms
   × switching steps and returning starts a fresh local judgment even when both panels resolve to the same child type 91ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  |dom| src/components/Stepper.test.tsx > switching steps and returning starts a fresh local judgment even when both panels resolve to the same child type
AssertionError: expected 'First committed idea' to be '' // Object.is equality

- Expected
+ Received

+ First committed idea

 ❯ src/components/Stepper.test.tsx:26:67
     24|   expect((screen.getByRole('textbox') as HTMLInputElement).value).toBe…
     25|   fireEvent.click(screen.getByRole('tab', { name: /Second judgment/ }))
     26|   expect((screen.getByRole('textbox') as HTMLInputElement).value).toBe…
       |                                                                   ^
     27|   fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Se…
     28|   fireEvent.click(screen.getByRole('tab', { name: /First judgment/ }))

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed (1)
      Tests  1 failed (1)
   Start at  15:19:07
   Duration  1.43s (transform 76ms, setup 160ms, import 79ms, tests 92ms, environment 943ms)

```

### stepper-reset-02-browser-red

Command: `env -u NO_COLOR pnpm exec playwright test e2e/performance.spec.ts --output=../.superpowers/sdd/2026-10-08-stage-09-interactive-port/stepper-reset-red-artifacts`. Exit: `1`.

Genuine browser RED against unchanged production: only the new sixth case fails. Both themes show Query starting its second case with 0 of 2 results and enabled Commit after completing bottleneck; returning to bottleneck preserves its second case, results and selection. All five existing cases pass. The completed-comparison checks already pass and do not demonstrate an invalid index.

```text

Running 6 tests using 1 worker

  ✓  1 e2e/performance.spec.ts:6:5 › performance choices use native radio keys and keep the first committed answer (1.2s)
  ✓  2 e2e/performance.spec.ts:29:5 › performance worksheets support direct links, Back and reload with long literal input in both themes (5.2s)
PERFORMANCE_PERMISSION_STATE {"theme":"light","width":320,"id":"panel-record","state":"save-denied","height":1787.59375,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(138, 90, 6)","bgs":["rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"draft-outcome","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved observer and outcome"},{"id":"draft-scope","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved scope"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"light","width":390,"id":"panel-record","state":"save-denied","height":1631.09375,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(138, 90, 6)","bgs":["rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"draft-outcome","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved observer and outcome"},{"id":"draft-scope","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved scope"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"light","width":768,"id":"panel-record","state":"save-denied","height":1463.890625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(138, 90, 6)","bgs":["rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"draft-outcome","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved observer and outcome"},{"id":"draft-scope","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved scope"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"light","width":1024,"id":"panel-record","state":"save-denied","height":1463.890625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(138, 90, 6)","bgs":["rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"draft-outcome","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved observer and outcome"},{"id":"draft-scope","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved scope"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"light","width":1440,"id":"panel-record","state":"save-denied","height":1463.890625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(138, 90, 6)","bgs":["rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"draft-outcome","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved observer and outcome"},{"id":"draft-scope","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved scope"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"light","width":1920,"id":"panel-record","state":"save-denied","height":1463.890625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(138, 90, 6)","bgs":["rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"draft-outcome","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved observer and outcome"},{"id":"draft-scope","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved scope"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"light","width":2560,"id":"panel-record","state":"save-denied","height":1463.890625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(138, 90, 6)","bgs":["rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"draft-outcome","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved observer and outcome"},{"id":"draft-scope","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved scope"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"light","width":320,"id":"panel-record","state":"copy-denied","height":2053.84375,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(138, 90, 6)","bgs":["rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"copy-status","fg":"rgb(70, 88, 110)","bgs":["rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Copy is unavailable. Select the Markdown below and copy it manually."},{"id":"manual-markdown","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"# Performance measurement record\n\n## Outcome and observer\n\nUnsaved observer and outcome\n\n## Metric and population\n\nnot recorded\n\n## Scope\n\nUnsaved scope\n\n## Win"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"light","width":390,"id":"panel-record","state":"copy-denied","height":1877.34375,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(138, 90, 6)","bgs":["rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"copy-status","fg":"rgb(70, 88, 110)","bgs":["rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Copy is unavailable. Select the Markdown below and copy it manually."},{"id":"manual-markdown","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"# Performance measurement record\n\n## Outcome and observer\n\nUnsaved observer and outcome\n\n## Metric and population\n\nnot recorded\n\n## Scope\n\nUnsaved scope\n\n## Win"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"light","width":768,"id":"panel-record","state":"copy-denied","height":1690.140625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(138, 90, 6)","bgs":["rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"copy-status","fg":"rgb(70, 88, 110)","bgs":["rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Copy is unavailable. Select the Markdown below and copy it manually."},{"id":"manual-markdown","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"# Performance measurement record\n\n## Outcome and observer\n\nUnsaved observer and outcome\n\n## Metric and population\n\nnot recorded\n\n## Scope\n\nUnsaved scope\n\n## Win"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"light","width":1024,"id":"panel-record","state":"copy-denied","height":1690.140625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(138, 90, 6)","bgs":["rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"copy-status","fg":"rgb(70, 88, 110)","bgs":["rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Copy is unavailable. Select the Markdown below and copy it manually."},{"id":"manual-markdown","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"# Performance measurement record\n\n## Outcome and observer\n\nUnsaved observer and outcome\n\n## Metric and population\n\nnot recorded\n\n## Scope\n\nUnsaved scope\n\n## Win"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"light","width":1440,"id":"panel-record","state":"copy-denied","height":1690.140625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(138, 90, 6)","bgs":["rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"copy-status","fg":"rgb(70, 88, 110)","bgs":["rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Copy is unavailable. Select the Markdown below and copy it manually."},{"id":"manual-markdown","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"# Performance measurement record\n\n## Outcome and observer\n\nUnsaved observer and outcome\n\n## Metric and population\n\nnot recorded\n\n## Scope\n\nUnsaved scope\n\n## Win"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"light","width":1920,"id":"panel-record","state":"copy-denied","height":1690.140625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(138, 90, 6)","bgs":["rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"copy-status","fg":"rgb(70, 88, 110)","bgs":["rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Copy is unavailable. Select the Markdown below and copy it manually."},{"id":"manual-markdown","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"# Performance measurement record\n\n## Outcome and observer\n\nUnsaved observer and outcome\n\n## Metric and population\n\nnot recorded\n\n## Scope\n\nUnsaved scope\n\n## Win"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"light","width":2560,"id":"panel-record","state":"copy-denied","height":1690.140625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(138, 90, 6)","bgs":["rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"copy-status","fg":"rgb(70, 88, 110)","bgs":["rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Copy is unavailable. Select the Markdown below and copy it manually."},{"id":"manual-markdown","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"# Performance measurement record\n\n## Outcome and observer\n\nUnsaved observer and outcome\n\n## Metric and population\n\nnot recorded\n\n## Scope\n\nUnsaved scope\n\n## Win"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"dark","width":320,"id":"panel-record","state":"save-denied","height":1787.59375,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(227, 171, 77)","bgs":["rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"draft-outcome","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved observer and outcome"},{"id":"draft-scope","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved scope"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"dark","width":390,"id":"panel-record","state":"save-denied","height":1631.09375,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(227, 171, 77)","bgs":["rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"draft-outcome","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved observer and outcome"},{"id":"draft-scope","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved scope"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"dark","width":768,"id":"panel-record","state":"save-denied","height":1463.890625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(227, 171, 77)","bgs":["rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"draft-outcome","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved observer and outcome"},{"id":"draft-scope","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved scope"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"dark","width":1024,"id":"panel-record","state":"save-denied","height":1463.890625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(227, 171, 77)","bgs":["rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"draft-outcome","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved observer and outcome"},{"id":"draft-scope","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved scope"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"dark","width":1440,"id":"panel-record","state":"save-denied","height":1463.890625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(227, 171, 77)","bgs":["rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"draft-outcome","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved observer and outcome"},{"id":"draft-scope","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved scope"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"dark","width":1920,"id":"panel-record","state":"save-denied","height":1463.890625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(227, 171, 77)","bgs":["rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"draft-outcome","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved observer and outcome"},{"id":"draft-scope","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved scope"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"dark","width":2560,"id":"panel-record","state":"save-denied","height":1463.890625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(227, 171, 77)","bgs":["rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"draft-outcome","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved observer and outcome"},{"id":"draft-scope","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved scope"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"dark","width":320,"id":"panel-record","state":"copy-denied","height":2053.84375,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(227, 171, 77)","bgs":["rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"copy-status","fg":"rgb(173, 192, 212)","bgs":["rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Copy is unavailable. Select the Markdown below and copy it manually."},{"id":"manual-markdown","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"# Performance measurement record\n\n## Outcome and observer\n\nUnsaved observer and outcome\n\n## Metric and population\n\nnot recorded\n\n## Scope\n\nUnsaved scope\n\n## Win"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"dark","width":390,"id":"panel-record","state":"copy-denied","height":1877.34375,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(227, 171, 77)","bgs":["rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"copy-status","fg":"rgb(173, 192, 212)","bgs":["rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Copy is unavailable. Select the Markdown below and copy it manually."},{"id":"manual-markdown","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"# Performance measurement record\n\n## Outcome and observer\n\nUnsaved observer and outcome\n\n## Metric and population\n\nnot recorded\n\n## Scope\n\nUnsaved scope\n\n## Win"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"dark","width":768,"id":"panel-record","state":"copy-denied","height":1690.140625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(227, 171, 77)","bgs":["rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"copy-status","fg":"rgb(173, 192, 212)","bgs":["rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Copy is unavailable. Select the Markdown below and copy it manually."},{"id":"manual-markdown","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"# Performance measurement record\n\n## Outcome and observer\n\nUnsaved observer and outcome\n\n## Metric and population\n\nnot recorded\n\n## Scope\n\nUnsaved scope\n\n## Win"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"dark","width":1024,"id":"panel-record","state":"copy-denied","height":1690.140625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(227, 171, 77)","bgs":["rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"copy-status","fg":"rgb(173, 192, 212)","bgs":["rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Copy is unavailable. Select the Markdown below and copy it manually."},{"id":"manual-markdown","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"# Performance measurement record\n\n## Outcome and observer\n\nUnsaved observer and outcome\n\n## Metric and population\n\nnot recorded\n\n## Scope\n\nUnsaved scope\n\n## Win"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"dark","width":1440,"id":"panel-record","state":"copy-denied","height":1690.140625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(227, 171, 77)","bgs":["rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"copy-status","fg":"rgb(173, 192, 212)","bgs":["rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Copy is unavailable. Select the Markdown below and copy it manually."},{"id":"manual-markdown","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"# Performance measurement record\n\n## Outcome and observer\n\nUnsaved observer and outcome\n\n## Metric and population\n\nnot recorded\n\n## Scope\n\nUnsaved scope\n\n## Win"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"dark","width":1920,"id":"panel-record","state":"copy-denied","height":1690.140625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(227, 171, 77)","bgs":["rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"copy-status","fg":"rgb(173, 192, 212)","bgs":["rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Copy is unavailable. Select the Markdown below and copy it manually."},{"id":"manual-markdown","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"# Performance measurement record\n\n## Outcome and observer\n\nUnsaved observer and outcome\n\n## Metric and population\n\nnot recorded\n\n## Scope\n\nUnsaved scope\n\n## Win"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"dark","width":2560,"id":"panel-record","state":"copy-denied","height":1690.140625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(227, 171, 77)","bgs":["rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"copy-status","fg":"rgb(173, 192, 212)","bgs":["rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Copy is unavailable. Select the Markdown below and copy it manually."},{"id":"manual-markdown","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"# Performance measurement record\n\n## Outcome and observer\n\nUnsaved observer and outcome\n\n## Metric and population\n\nnot recorded\n\n## Scope\n\nUnsaved scope\n\n## Win"}],"smallTargets":[]}
  ✓  3 e2e/performance.spec.ts:80:5 › permission failures retain the worksheet and offer manual export with zero page errors (2.8s)
  ✓  4 e2e/performance.spec.ts:235:5 › an internal improvement requires more observation rather than a production win (1.7s)
PERFORMANCE_GLOSSARY_RESIZE {"theme":"light","width":2560,"left":1677,"right":2029,"overflow":0}
PERFORMANCE_GLOSSARY_RESIZE {"theme":"light","width":768,"left":399.65625,"right":751.65625,"overflow":0}
PERFORMANCE_GLOSSARY_RESIZE {"theme":"light","width":1024,"left":655.328125,"right":1007.328125,"overflow":0}
PERFORMANCE_GLOSSARY_RESIZE {"theme":"light","width":320,"left":32,"right":304,"overflow":0}
PERFORMANCE_GLOSSARY_RESIZE {"theme":"light","width":390,"left":32,"right":374,"overflow":0}
PERFORMANCE_GLOSSARY_RESIZE {"theme":"light","width":1440,"left":1071.65625,"right":1423.65625,"overflow":0}
PERFORMANCE_GLOSSARY_RESIZE {"theme":"light","width":1920,"left":1357,"right":1709,"overflow":0}
PERFORMANCE_GLOSSARY_RESIZE {"theme":"dark","width":2560,"left":1677,"right":2029,"overflow":0}
PERFORMANCE_GLOSSARY_RESIZE {"theme":"dark","width":768,"left":399.65625,"right":751.65625,"overflow":0}
PERFORMANCE_GLOSSARY_RESIZE {"theme":"dark","width":1024,"left":655.328125,"right":1007.328125,"overflow":0}
PERFORMANCE_GLOSSARY_RESIZE {"theme":"dark","width":320,"left":32,"right":304,"overflow":0}
PERFORMANCE_GLOSSARY_RESIZE {"theme":"dark","width":390,"left":32,"right":374,"overflow":0}
PERFORMANCE_GLOSSARY_RESIZE {"theme":"dark","width":1440,"left":1071.65625,"right":1423.65625,"overflow":0}
PERFORMANCE_GLOSSARY_RESIZE {"theme":"dark","width":1920,"left":1357,"right":1709,"overflow":0}
  ✓  5 e2e/performance.spec.ts:255:5 › an open glossary definition stays inside every viewport after resizing in both themes (3.3s)
PERFORMANCE_DRILL_RESET {"theme":"light","id":"query","from":"completed-bottleneck","prompt":"Actual rows differ greatly from estimated rows on a slow query. Is the plan enough to name a missing index?","results":["0 of 2 decisions correct"],"selected":0,"commitDisabled":false}
PERFORMANCE_DRILL_RESET {"theme":"light","id":"bottleneck","from":"return-from-query","prompt":"Customers report slow checkout, but you have only one uninstrumented local run and no browser baseline. What comes first?","results":["2 of 2 decisions correct"],"selected":1,"commitDisabled":true}
PERFORMANCE_DRILL_RESET {"theme":"light","id":"query","from":"completed-comparison","prompt":"A small inventory table uses a sequential scan. Its measured query and user outcome meet their targets. What does the scan imply?","results":[],"selected":0,"commitDisabled":true}
PERFORMANCE_DRILL_RESET {"theme":"light","id":"bottleneck","from":"completed-comparison-via-query","prompt":"A controlled 20-item cart shows 21 inventory queries. Repeated round trips dominate server time. Which hypothesis is supported?","results":[],"selected":0,"commitDisabled":true}
PERFORMANCE_DRILL_RESET {"theme":"dark","id":"query","from":"completed-bottleneck","prompt":"Actual rows differ greatly from estimated rows on a slow query. Is the plan enough to name a missing index?","results":["0 of 2 decisions correct"],"selected":0,"commitDisabled":false}
PERFORMANCE_DRILL_RESET {"theme":"dark","id":"bottleneck","from":"return-from-query","prompt":"Customers report slow checkout, but you have only one uninstrumented local run and no browser baseline. What comes first?","results":["2 of 2 decisions correct"],"selected":1,"commitDisabled":true}
PERFORMANCE_DRILL_RESET {"theme":"dark","id":"query","from":"completed-comparison","prompt":"A small inventory table uses a sequential scan. Its measured query and user outcome meet their targets. What does the scan imply?","results":[],"selected":0,"commitDisabled":true}
PERFORMANCE_DRILL_RESET {"theme":"dark","id":"bottleneck","from":"completed-comparison-via-query","prompt":"A controlled 20-item cart shows 21 inventory queries. Repeated round trips dominate server time. Which hypothesis is supported?","results":[],"selected":0,"commitDisabled":true}
  ✘  6 e2e/performance.spec.ts:308:5 › each performance judgment starts fresh after switching from completed drills in both themes (5.1s)


  1) e2e/performance.spec.ts:308:5 › each performance judgment starts fresh after switching from completed drills in both themes 

    Error: light/query/completed-bottleneck: {"prompt":"Actual rows differ greatly from estimated rows on a slow query. Is the plan enough to name a missing index?","results":["0 of 2 decisions correct"],"selected":0,"commitDisabled":false}
    light/bottleneck/return-from-query: {"prompt":"Customers report slow checkout, but you have only one uninstrumented local run and no browser baseline. What comes first?","results":["2 of 2 decisions correct"],"selected":1,"commitDisabled":true}
    dark/query/completed-bottleneck: {"prompt":"Actual rows differ greatly from estimated rows on a slow query. Is the plan enough to name a missing index?","results":["0 of 2 decisions correct"],"selected":0,"commitDisabled":false}
    dark/bottleneck/return-from-query: {"prompt":"Customers report slow checkout, but you have only one uninstrumented local run and no browser baseline. What comes first?","results":["2 of 2 decisions correct"],"selected":1,"commitDisabled":true}

    expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 6

    - Array []
    + Array [
    +   "light/query/completed-bottleneck: {\"prompt\":\"Actual rows differ greatly from estimated rows on a slow query. Is the plan enough to name a missing index?\",\"results\":[\"0 of 2 decisions correct\"],\"selected\":0,\"commitDisabled\":false}",
    +   "light/bottleneck/return-from-query: {\"prompt\":\"Customers report slow checkout, but you have only one uninstrumented local run and no browser baseline. What comes first?\",\"results\":[\"2 of 2 decisions correct\"],\"selected\":1,\"commitDisabled\":true}",
    +   "dark/query/completed-bottleneck: {\"prompt\":\"Actual rows differ greatly from estimated rows on a slow query. Is the plan enough to name a missing index?\",\"results\":[\"0 of 2 decisions correct\"],\"selected\":0,\"commitDisabled\":false}",
    +   "dark/bottleneck/return-from-query: {\"prompt\":\"Customers report slow checkout, but you have only one uninstrumented local run and no browser baseline. What comes first?\",\"results\":[\"2 of 2 decisions correct\"],\"selected\":1,\"commitDisabled\":true}",
    + ]

      362 |     await fresh('bottleneck', 'completed-comparison-via-query')
      363 |   }
    > 364 |   expect(failures, failures.join('\n')).toEqual([])
          |                                         ^
      365 | })
      366 |
        at /Users/angelito/personal/Development-Playbook/.worktrees/stage-09-performance-port/web/e2e/performance.spec.ts:364:41

    Error Context: ../.superpowers/sdd/2026-10-08-stage-09-interactive-port/stepper-reset-red-artifacts/performance-each-performan-edb20-leted-drills-in-both-themes/error-context.md

  1 failed
    e2e/performance.spec.ts:308:5 › each performance judgment starts fresh after switching from completed drills in both themes 
  5 passed (42.1s)
```

### stepper-reset-03-format

Command: `env -u NO_COLOR pnpm exec prettier --write src/components/Stepper.tsx src/components/Stepper.test.tsx e2e/performance.spec.ts`. Exit: `0`.

Only three owned files formatted.

```text
src/components/Stepper.tsx 72ms (unchanged)
src/components/Stepper.test.tsx 8ms
e2e/performance.spec.ts 48ms
```

### stepper-reset-04-dom-green

Command: `env -u NO_COLOR pnpm exec vitest run src/components/Stepper.test.tsx`. Exit: `0`.

DOM GREEN: switching and returning both clear the real child local state.

```text

 RUN  v4.1.10 /Users/angelito/personal/Development-Playbook/.worktrees/stage-09-performance-port/web


 Test Files  1 passed (1)
      Tests  1 passed (1)
   Start at  15:21:31
   Duration  1.93s (transform 154ms, setup 422ms, import 79ms, tests 135ms, environment 1.10s)

```

### stepper-reset-05-browser-green

Command: `env -u NO_COLOR pnpm exec playwright test e2e/performance.spec.ts --output=../.superpowers/sdd/2026-10-08-stage-09-interactive-port/stepper-reset-green-artifacts`. Exit: `0`.

Six browser cases pass; all eight drill-switch states across both themes start at the first case, with blank results, no selection and disabled Commit.

```text

Running 6 tests using 1 worker

  ✓  1 e2e/performance.spec.ts:6:5 › performance choices use native radio keys and keep the first committed answer (1.2s)
  ✓  2 e2e/performance.spec.ts:29:5 › performance worksheets support direct links, Back and reload with long literal input in both themes (3.6s)
PERFORMANCE_PERMISSION_STATE {"theme":"light","width":320,"id":"panel-record","state":"save-denied","height":1787.59375,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(138, 90, 6)","bgs":["rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"draft-outcome","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved observer and outcome"},{"id":"draft-scope","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved scope"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"light","width":390,"id":"panel-record","state":"save-denied","height":1631.09375,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(138, 90, 6)","bgs":["rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"draft-outcome","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved observer and outcome"},{"id":"draft-scope","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved scope"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"light","width":768,"id":"panel-record","state":"save-denied","height":1463.890625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(138, 90, 6)","bgs":["rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"draft-outcome","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved observer and outcome"},{"id":"draft-scope","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved scope"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"light","width":1024,"id":"panel-record","state":"save-denied","height":1463.890625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(138, 90, 6)","bgs":["rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"draft-outcome","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved observer and outcome"},{"id":"draft-scope","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved scope"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"light","width":1440,"id":"panel-record","state":"save-denied","height":1463.890625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(138, 90, 6)","bgs":["rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"draft-outcome","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved observer and outcome"},{"id":"draft-scope","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved scope"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"light","width":1920,"id":"panel-record","state":"save-denied","height":1463.890625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(138, 90, 6)","bgs":["rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"draft-outcome","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved observer and outcome"},{"id":"draft-scope","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved scope"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"light","width":2560,"id":"panel-record","state":"save-denied","height":1463.890625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(138, 90, 6)","bgs":["rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"draft-outcome","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved observer and outcome"},{"id":"draft-scope","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved scope"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"light","width":320,"id":"panel-record","state":"copy-denied","height":2053.84375,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(138, 90, 6)","bgs":["rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"copy-status","fg":"rgb(70, 88, 110)","bgs":["rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Copy is unavailable. Select the Markdown below and copy it manually."},{"id":"manual-markdown","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"# Performance measurement record\n\n## Outcome and observer\n\nUnsaved observer and outcome\n\n## Metric and population\n\nnot recorded\n\n## Scope\n\nUnsaved scope\n\n## Win"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"light","width":390,"id":"panel-record","state":"copy-denied","height":1877.34375,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(138, 90, 6)","bgs":["rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"copy-status","fg":"rgb(70, 88, 110)","bgs":["rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Copy is unavailable. Select the Markdown below and copy it manually."},{"id":"manual-markdown","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"# Performance measurement record\n\n## Outcome and observer\n\nUnsaved observer and outcome\n\n## Metric and population\n\nnot recorded\n\n## Scope\n\nUnsaved scope\n\n## Win"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"light","width":768,"id":"panel-record","state":"copy-denied","height":1690.140625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(138, 90, 6)","bgs":["rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"copy-status","fg":"rgb(70, 88, 110)","bgs":["rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Copy is unavailable. Select the Markdown below and copy it manually."},{"id":"manual-markdown","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"# Performance measurement record\n\n## Outcome and observer\n\nUnsaved observer and outcome\n\n## Metric and population\n\nnot recorded\n\n## Scope\n\nUnsaved scope\n\n## Win"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"light","width":1024,"id":"panel-record","state":"copy-denied","height":1690.140625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(138, 90, 6)","bgs":["rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"copy-status","fg":"rgb(70, 88, 110)","bgs":["rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Copy is unavailable. Select the Markdown below and copy it manually."},{"id":"manual-markdown","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"# Performance measurement record\n\n## Outcome and observer\n\nUnsaved observer and outcome\n\n## Metric and population\n\nnot recorded\n\n## Scope\n\nUnsaved scope\n\n## Win"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"light","width":1440,"id":"panel-record","state":"copy-denied","height":1690.140625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(138, 90, 6)","bgs":["rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"copy-status","fg":"rgb(70, 88, 110)","bgs":["rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Copy is unavailable. Select the Markdown below and copy it manually."},{"id":"manual-markdown","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"# Performance measurement record\n\n## Outcome and observer\n\nUnsaved observer and outcome\n\n## Metric and population\n\nnot recorded\n\n## Scope\n\nUnsaved scope\n\n## Win"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"light","width":1920,"id":"panel-record","state":"copy-denied","height":1690.140625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(138, 90, 6)","bgs":["rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"copy-status","fg":"rgb(70, 88, 110)","bgs":["rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Copy is unavailable. Select the Markdown below and copy it manually."},{"id":"manual-markdown","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"# Performance measurement record\n\n## Outcome and observer\n\nUnsaved observer and outcome\n\n## Metric and population\n\nnot recorded\n\n## Scope\n\nUnsaved scope\n\n## Win"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"light","width":2560,"id":"panel-record","state":"copy-denied","height":1690.140625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(138, 90, 6)","bgs":["rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"copy-status","fg":"rgb(70, 88, 110)","bgs":["rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Copy is unavailable. Select the Markdown below and copy it manually."},{"id":"manual-markdown","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"# Performance measurement record\n\n## Outcome and observer\n\nUnsaved observer and outcome\n\n## Metric and population\n\nnot recorded\n\n## Scope\n\nUnsaved scope\n\n## Win"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"dark","width":320,"id":"panel-record","state":"save-denied","height":1787.59375,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(227, 171, 77)","bgs":["rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"draft-outcome","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved observer and outcome"},{"id":"draft-scope","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved scope"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"dark","width":390,"id":"panel-record","state":"save-denied","height":1631.09375,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(227, 171, 77)","bgs":["rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"draft-outcome","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved observer and outcome"},{"id":"draft-scope","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved scope"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"dark","width":768,"id":"panel-record","state":"save-denied","height":1463.890625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(227, 171, 77)","bgs":["rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"draft-outcome","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved observer and outcome"},{"id":"draft-scope","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved scope"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"dark","width":1024,"id":"panel-record","state":"save-denied","height":1463.890625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(227, 171, 77)","bgs":["rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"draft-outcome","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved observer and outcome"},{"id":"draft-scope","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved scope"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"dark","width":1440,"id":"panel-record","state":"save-denied","height":1463.890625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(227, 171, 77)","bgs":["rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"draft-outcome","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved observer and outcome"},{"id":"draft-scope","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved scope"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"dark","width":1920,"id":"panel-record","state":"save-denied","height":1463.890625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(227, 171, 77)","bgs":["rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"draft-outcome","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved observer and outcome"},{"id":"draft-scope","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved scope"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"dark","width":2560,"id":"panel-record","state":"save-denied","height":1463.890625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(227, 171, 77)","bgs":["rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"draft-outcome","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved observer and outcome"},{"id":"draft-scope","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved scope"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"dark","width":320,"id":"panel-record","state":"copy-denied","height":2053.84375,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(227, 171, 77)","bgs":["rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"copy-status","fg":"rgb(173, 192, 212)","bgs":["rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Copy is unavailable. Select the Markdown below and copy it manually."},{"id":"manual-markdown","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"# Performance measurement record\n\n## Outcome and observer\n\nUnsaved observer and outcome\n\n## Metric and population\n\nnot recorded\n\n## Scope\n\nUnsaved scope\n\n## Win"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"dark","width":390,"id":"panel-record","state":"copy-denied","height":1877.34375,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(227, 171, 77)","bgs":["rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"copy-status","fg":"rgb(173, 192, 212)","bgs":["rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Copy is unavailable. Select the Markdown below and copy it manually."},{"id":"manual-markdown","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"# Performance measurement record\n\n## Outcome and observer\n\nUnsaved observer and outcome\n\n## Metric and population\n\nnot recorded\n\n## Scope\n\nUnsaved scope\n\n## Win"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"dark","width":768,"id":"panel-record","state":"copy-denied","height":1690.140625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(227, 171, 77)","bgs":["rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"copy-status","fg":"rgb(173, 192, 212)","bgs":["rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Copy is unavailable. Select the Markdown below and copy it manually."},{"id":"manual-markdown","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"# Performance measurement record\n\n## Outcome and observer\n\nUnsaved observer and outcome\n\n## Metric and population\n\nnot recorded\n\n## Scope\n\nUnsaved scope\n\n## Win"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"dark","width":1024,"id":"panel-record","state":"copy-denied","height":1690.140625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(227, 171, 77)","bgs":["rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"copy-status","fg":"rgb(173, 192, 212)","bgs":["rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Copy is unavailable. Select the Markdown below and copy it manually."},{"id":"manual-markdown","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"# Performance measurement record\n\n## Outcome and observer\n\nUnsaved observer and outcome\n\n## Metric and population\n\nnot recorded\n\n## Scope\n\nUnsaved scope\n\n## Win"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"dark","width":1440,"id":"panel-record","state":"copy-denied","height":1690.140625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(227, 171, 77)","bgs":["rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"copy-status","fg":"rgb(173, 192, 212)","bgs":["rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Copy is unavailable. Select the Markdown below and copy it manually."},{"id":"manual-markdown","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"# Performance measurement record\n\n## Outcome and observer\n\nUnsaved observer and outcome\n\n## Metric and population\n\nnot recorded\n\n## Scope\n\nUnsaved scope\n\n## Win"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"dark","width":1920,"id":"panel-record","state":"copy-denied","height":1690.140625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(227, 171, 77)","bgs":["rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"copy-status","fg":"rgb(173, 192, 212)","bgs":["rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Copy is unavailable. Select the Markdown below and copy it manually."},{"id":"manual-markdown","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"# Performance measurement record\n\n## Outcome and observer\n\nUnsaved observer and outcome\n\n## Metric and population\n\nnot recorded\n\n## Scope\n\nUnsaved scope\n\n## Win"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"dark","width":2560,"id":"panel-record","state":"copy-denied","height":1690.140625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(227, 171, 77)","bgs":["rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"copy-status","fg":"rgb(173, 192, 212)","bgs":["rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Copy is unavailable. Select the Markdown below and copy it manually."},{"id":"manual-markdown","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"# Performance measurement record\n\n## Outcome and observer\n\nUnsaved observer and outcome\n\n## Metric and population\n\nnot recorded\n\n## Scope\n\nUnsaved scope\n\n## Win"}],"smallTargets":[]}
  ✓  3 e2e/performance.spec.ts:80:5 › permission failures retain the worksheet and offer manual export with zero page errors (2.5s)
  ✓  4 e2e/performance.spec.ts:235:5 › an internal improvement requires more observation rather than a production win (797ms)
PERFORMANCE_GLOSSARY_RESIZE {"theme":"light","width":2560,"left":1677,"right":2029,"overflow":0}
PERFORMANCE_GLOSSARY_RESIZE {"theme":"light","width":768,"left":399.65625,"right":751.65625,"overflow":0}
PERFORMANCE_GLOSSARY_RESIZE {"theme":"light","width":1024,"left":655.328125,"right":1007.328125,"overflow":0}
PERFORMANCE_GLOSSARY_RESIZE {"theme":"light","width":320,"left":32,"right":304,"overflow":0}
PERFORMANCE_GLOSSARY_RESIZE {"theme":"light","width":390,"left":32,"right":374,"overflow":0}
PERFORMANCE_GLOSSARY_RESIZE {"theme":"light","width":1440,"left":1071.65625,"right":1423.65625,"overflow":0}
PERFORMANCE_GLOSSARY_RESIZE {"theme":"light","width":1920,"left":1357,"right":1709,"overflow":0}
PERFORMANCE_GLOSSARY_RESIZE {"theme":"dark","width":2560,"left":1677,"right":2029,"overflow":0}
PERFORMANCE_GLOSSARY_RESIZE {"theme":"dark","width":768,"left":399.65625,"right":751.65625,"overflow":0}
PERFORMANCE_GLOSSARY_RESIZE {"theme":"dark","width":1024,"left":655.328125,"right":1007.328125,"overflow":0}
PERFORMANCE_GLOSSARY_RESIZE {"theme":"dark","width":320,"left":32,"right":304,"overflow":0}
PERFORMANCE_GLOSSARY_RESIZE {"theme":"dark","width":390,"left":32,"right":374,"overflow":0}
PERFORMANCE_GLOSSARY_RESIZE {"theme":"dark","width":1440,"left":1071.65625,"right":1423.65625,"overflow":0}
PERFORMANCE_GLOSSARY_RESIZE {"theme":"dark","width":1920,"left":1357,"right":1709,"overflow":0}
  ✓  5 e2e/performance.spec.ts:255:5 › an open glossary definition stays inside every viewport after resizing in both themes (2.8s)
PERFORMANCE_DRILL_RESET {"theme":"light","id":"query","from":"completed-bottleneck","prompt":"A small inventory table uses a sequential scan. Its measured query and user outcome meet their targets. What does the scan imply?","results":[],"selected":0,"commitDisabled":true}
PERFORMANCE_DRILL_RESET {"theme":"light","id":"bottleneck","from":"return-from-query","prompt":"A controlled 20-item cart shows 21 inventory queries. Repeated round trips dominate server time. Which hypothesis is supported?","results":[],"selected":0,"commitDisabled":true}
PERFORMANCE_DRILL_RESET {"theme":"light","id":"query","from":"completed-comparison","prompt":"A small inventory table uses a sequential scan. Its measured query and user outcome meet their targets. What does the scan imply?","results":[],"selected":0,"commitDisabled":true}
PERFORMANCE_DRILL_RESET {"theme":"light","id":"bottleneck","from":"completed-comparison-via-query","prompt":"A controlled 20-item cart shows 21 inventory queries. Repeated round trips dominate server time. Which hypothesis is supported?","results":[],"selected":0,"commitDisabled":true}
PERFORMANCE_DRILL_RESET {"theme":"dark","id":"query","from":"completed-bottleneck","prompt":"A small inventory table uses a sequential scan. Its measured query and user outcome meet their targets. What does the scan imply?","results":[],"selected":0,"commitDisabled":true}
PERFORMANCE_DRILL_RESET {"theme":"dark","id":"bottleneck","from":"return-from-query","prompt":"A controlled 20-item cart shows 21 inventory queries. Repeated round trips dominate server time. Which hypothesis is supported?","results":[],"selected":0,"commitDisabled":true}
PERFORMANCE_DRILL_RESET {"theme":"dark","id":"query","from":"completed-comparison","prompt":"A small inventory table uses a sequential scan. Its measured query and user outcome meet their targets. What does the scan imply?","results":[],"selected":0,"commitDisabled":true}
PERFORMANCE_DRILL_RESET {"theme":"dark","id":"bottleneck","from":"completed-comparison-via-query","prompt":"A controlled 20-item cart shows 21 inventory queries. Repeated round trips dominate server time. Which hypothesis is supported?","results":[],"selected":0,"commitDisabled":true}
  ✓  6 e2e/performance.spec.ts:308:5 › each performance judgment starts fresh after switching from completed drills in both themes (4.7s)

  6 passed (30.6s)
```

### stepper-reset-06-dom-teeth

Command: `env -u NO_COLOR pnpm exec vitest run src/components/Stepper.test.tsx`. Exit: `1`.

Temporarily restore only key="content". The new DOM regression alone fails for retained local state.

```text

 RUN  v4.1.10 /Users/angelito/personal/Development-Playbook/.worktrees/stage-09-performance-port/web

 ❯ |dom| src/components/Stepper.test.tsx (1 test | 1 failed) 98ms
   × switching steps and returning starts a fresh local judgment even when both panels resolve to the same child type 97ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  |dom| src/components/Stepper.test.tsx > switching steps and returning starts a fresh local judgment even when both panels resolve to the same child type
AssertionError: expected 'First committed idea' to be '' // Object.is equality

- Expected
+ Received

+ First committed idea

 ❯ src/components/Stepper.test.tsx:43:67
     41|   )
     42|   fireEvent.click(screen.getByRole('tab', { name: /Second judgment/ }))
     43|   expect((screen.getByRole('textbox') as HTMLInputElement).value).toBe…
       |                                                                   ^
     44|   fireEvent.change(screen.getByRole('textbox'), {
     45|     target: { value: 'Second idea' },

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed (1)
      Tests  1 failed (1)
   Start at  15:22:26
   Duration  912ms (transform 42ms, setup 108ms, import 78ms, tests 98ms, environment 523ms)

```

### stepper-reset-07-browser-teeth

Command: `env -u NO_COLOR pnpm exec playwright test e2e/performance.spec.ts --output=../.superpowers/sdd/2026-10-08-stage-09-interactive-port/stepper-reset-teeth-artifacts`. Exit: `1`.

Constant-key mutation reproduces only the new browser regression; existing five cases pass. The scratch runner restores the formatted Stepper bytes immediately in try/finally after both teeth runs.

```text

Running 6 tests using 1 worker

  ✓  1 e2e/performance.spec.ts:6:5 › performance choices use native radio keys and keep the first committed answer (1.1s)
  ✓  2 e2e/performance.spec.ts:29:5 › performance worksheets support direct links, Back and reload with long literal input in both themes (3.7s)
PERFORMANCE_PERMISSION_STATE {"theme":"light","width":320,"id":"panel-record","state":"save-denied","height":1787.59375,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(138, 90, 6)","bgs":["rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"draft-outcome","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved observer and outcome"},{"id":"draft-scope","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved scope"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"light","width":390,"id":"panel-record","state":"save-denied","height":1631.09375,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(138, 90, 6)","bgs":["rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"draft-outcome","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved observer and outcome"},{"id":"draft-scope","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved scope"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"light","width":768,"id":"panel-record","state":"save-denied","height":1463.890625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(138, 90, 6)","bgs":["rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"draft-outcome","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved observer and outcome"},{"id":"draft-scope","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved scope"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"light","width":1024,"id":"panel-record","state":"save-denied","height":1463.890625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(138, 90, 6)","bgs":["rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"draft-outcome","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved observer and outcome"},{"id":"draft-scope","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved scope"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"light","width":1440,"id":"panel-record","state":"save-denied","height":1463.890625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(138, 90, 6)","bgs":["rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"draft-outcome","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved observer and outcome"},{"id":"draft-scope","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved scope"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"light","width":1920,"id":"panel-record","state":"save-denied","height":1463.890625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(138, 90, 6)","bgs":["rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"draft-outcome","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved observer and outcome"},{"id":"draft-scope","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved scope"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"light","width":2560,"id":"panel-record","state":"save-denied","height":1463.890625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(138, 90, 6)","bgs":["rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"draft-outcome","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved observer and outcome"},{"id":"draft-scope","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved scope"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"light","width":320,"id":"panel-record","state":"copy-denied","height":2053.84375,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(138, 90, 6)","bgs":["rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"copy-status","fg":"rgb(70, 88, 110)","bgs":["rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Copy is unavailable. Select the Markdown below and copy it manually."},{"id":"manual-markdown","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"# Performance measurement record\n\n## Outcome and observer\n\nUnsaved observer and outcome\n\n## Metric and population\n\nnot recorded\n\n## Scope\n\nUnsaved scope\n\n## Win"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"light","width":390,"id":"panel-record","state":"copy-denied","height":1877.34375,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(138, 90, 6)","bgs":["rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"copy-status","fg":"rgb(70, 88, 110)","bgs":["rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Copy is unavailable. Select the Markdown below and copy it manually."},{"id":"manual-markdown","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"# Performance measurement record\n\n## Outcome and observer\n\nUnsaved observer and outcome\n\n## Metric and population\n\nnot recorded\n\n## Scope\n\nUnsaved scope\n\n## Win"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"light","width":768,"id":"panel-record","state":"copy-denied","height":1690.140625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(138, 90, 6)","bgs":["rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"copy-status","fg":"rgb(70, 88, 110)","bgs":["rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Copy is unavailable. Select the Markdown below and copy it manually."},{"id":"manual-markdown","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"# Performance measurement record\n\n## Outcome and observer\n\nUnsaved observer and outcome\n\n## Metric and population\n\nnot recorded\n\n## Scope\n\nUnsaved scope\n\n## Win"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"light","width":1024,"id":"panel-record","state":"copy-denied","height":1690.140625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(138, 90, 6)","bgs":["rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"copy-status","fg":"rgb(70, 88, 110)","bgs":["rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Copy is unavailable. Select the Markdown below and copy it manually."},{"id":"manual-markdown","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"# Performance measurement record\n\n## Outcome and observer\n\nUnsaved observer and outcome\n\n## Metric and population\n\nnot recorded\n\n## Scope\n\nUnsaved scope\n\n## Win"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"light","width":1440,"id":"panel-record","state":"copy-denied","height":1690.140625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(138, 90, 6)","bgs":["rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"copy-status","fg":"rgb(70, 88, 110)","bgs":["rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Copy is unavailable. Select the Markdown below and copy it manually."},{"id":"manual-markdown","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"# Performance measurement record\n\n## Outcome and observer\n\nUnsaved observer and outcome\n\n## Metric and population\n\nnot recorded\n\n## Scope\n\nUnsaved scope\n\n## Win"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"light","width":1920,"id":"panel-record","state":"copy-denied","height":1690.140625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(138, 90, 6)","bgs":["rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"copy-status","fg":"rgb(70, 88, 110)","bgs":["rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Copy is unavailable. Select the Markdown below and copy it manually."},{"id":"manual-markdown","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"# Performance measurement record\n\n## Outcome and observer\n\nUnsaved observer and outcome\n\n## Metric and population\n\nnot recorded\n\n## Scope\n\nUnsaved scope\n\n## Win"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"light","width":2560,"id":"panel-record","state":"copy-denied","height":1690.140625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(138, 90, 6)","bgs":["rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"copy-status","fg":"rgb(70, 88, 110)","bgs":["rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Copy is unavailable. Select the Markdown below and copy it manually."},{"id":"manual-markdown","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"# Performance measurement record\n\n## Outcome and observer\n\nUnsaved observer and outcome\n\n## Metric and population\n\nnot recorded\n\n## Scope\n\nUnsaved scope\n\n## Win"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"dark","width":320,"id":"panel-record","state":"save-denied","height":1787.59375,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(227, 171, 77)","bgs":["rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"draft-outcome","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved observer and outcome"},{"id":"draft-scope","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved scope"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"dark","width":390,"id":"panel-record","state":"save-denied","height":1631.09375,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(227, 171, 77)","bgs":["rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"draft-outcome","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved observer and outcome"},{"id":"draft-scope","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved scope"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"dark","width":768,"id":"panel-record","state":"save-denied","height":1463.890625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(227, 171, 77)","bgs":["rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"draft-outcome","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved observer and outcome"},{"id":"draft-scope","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved scope"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"dark","width":1024,"id":"panel-record","state":"save-denied","height":1463.890625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(227, 171, 77)","bgs":["rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"draft-outcome","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved observer and outcome"},{"id":"draft-scope","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved scope"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"dark","width":1440,"id":"panel-record","state":"save-denied","height":1463.890625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(227, 171, 77)","bgs":["rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"draft-outcome","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved observer and outcome"},{"id":"draft-scope","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved scope"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"dark","width":1920,"id":"panel-record","state":"save-denied","height":1463.890625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(227, 171, 77)","bgs":["rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"draft-outcome","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved observer and outcome"},{"id":"draft-scope","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved scope"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"dark","width":2560,"id":"panel-record","state":"save-denied","height":1463.890625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(227, 171, 77)","bgs":["rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"draft-outcome","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved observer and outcome"},{"id":"draft-scope","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved scope"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"dark","width":320,"id":"panel-record","state":"copy-denied","height":2053.84375,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(227, 171, 77)","bgs":["rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"copy-status","fg":"rgb(173, 192, 212)","bgs":["rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Copy is unavailable. Select the Markdown below and copy it manually."},{"id":"manual-markdown","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"# Performance measurement record\n\n## Outcome and observer\n\nUnsaved observer and outcome\n\n## Metric and population\n\nnot recorded\n\n## Scope\n\nUnsaved scope\n\n## Win"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"dark","width":390,"id":"panel-record","state":"copy-denied","height":1877.34375,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(227, 171, 77)","bgs":["rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"copy-status","fg":"rgb(173, 192, 212)","bgs":["rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Copy is unavailable. Select the Markdown below and copy it manually."},{"id":"manual-markdown","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"# Performance measurement record\n\n## Outcome and observer\n\nUnsaved observer and outcome\n\n## Metric and population\n\nnot recorded\n\n## Scope\n\nUnsaved scope\n\n## Win"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"dark","width":768,"id":"panel-record","state":"copy-denied","height":1690.140625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(227, 171, 77)","bgs":["rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"copy-status","fg":"rgb(173, 192, 212)","bgs":["rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Copy is unavailable. Select the Markdown below and copy it manually."},{"id":"manual-markdown","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"# Performance measurement record\n\n## Outcome and observer\n\nUnsaved observer and outcome\n\n## Metric and population\n\nnot recorded\n\n## Scope\n\nUnsaved scope\n\n## Win"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"dark","width":1024,"id":"panel-record","state":"copy-denied","height":1690.140625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(227, 171, 77)","bgs":["rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"copy-status","fg":"rgb(173, 192, 212)","bgs":["rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Copy is unavailable. Select the Markdown below and copy it manually."},{"id":"manual-markdown","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"# Performance measurement record\n\n## Outcome and observer\n\nUnsaved observer and outcome\n\n## Metric and population\n\nnot recorded\n\n## Scope\n\nUnsaved scope\n\n## Win"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"dark","width":1440,"id":"panel-record","state":"copy-denied","height":1690.140625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(227, 171, 77)","bgs":["rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"copy-status","fg":"rgb(173, 192, 212)","bgs":["rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Copy is unavailable. Select the Markdown below and copy it manually."},{"id":"manual-markdown","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"# Performance measurement record\n\n## Outcome and observer\n\nUnsaved observer and outcome\n\n## Metric and population\n\nnot recorded\n\n## Scope\n\nUnsaved scope\n\n## Win"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"dark","width":1920,"id":"panel-record","state":"copy-denied","height":1690.140625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(227, 171, 77)","bgs":["rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"copy-status","fg":"rgb(173, 192, 212)","bgs":["rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Copy is unavailable. Select the Markdown below and copy it manually."},{"id":"manual-markdown","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"# Performance measurement record\n\n## Outcome and observer\n\nUnsaved observer and outcome\n\n## Metric and population\n\nnot recorded\n\n## Scope\n\nUnsaved scope\n\n## Win"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"dark","width":2560,"id":"panel-record","state":"copy-denied","height":1690.140625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(227, 171, 77)","bgs":["rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"copy-status","fg":"rgb(173, 192, 212)","bgs":["rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Copy is unavailable. Select the Markdown below and copy it manually."},{"id":"manual-markdown","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"# Performance measurement record\n\n## Outcome and observer\n\nUnsaved observer and outcome\n\n## Metric and population\n\nnot recorded\n\n## Scope\n\nUnsaved scope\n\n## Win"}],"smallTargets":[]}
  ✓  3 e2e/performance.spec.ts:80:5 › permission failures retain the worksheet and offer manual export with zero page errors (2.6s)
  ✓  4 e2e/performance.spec.ts:235:5 › an internal improvement requires more observation rather than a production win (843ms)
PERFORMANCE_GLOSSARY_RESIZE {"theme":"light","width":2560,"left":1677,"right":2029,"overflow":0}
PERFORMANCE_GLOSSARY_RESIZE {"theme":"light","width":768,"left":399.65625,"right":751.65625,"overflow":0}
PERFORMANCE_GLOSSARY_RESIZE {"theme":"light","width":1024,"left":655.328125,"right":1007.328125,"overflow":0}
PERFORMANCE_GLOSSARY_RESIZE {"theme":"light","width":320,"left":32,"right":304,"overflow":0}
PERFORMANCE_GLOSSARY_RESIZE {"theme":"light","width":390,"left":32,"right":374,"overflow":0}
PERFORMANCE_GLOSSARY_RESIZE {"theme":"light","width":1440,"left":1071.65625,"right":1423.65625,"overflow":0}
PERFORMANCE_GLOSSARY_RESIZE {"theme":"light","width":1920,"left":1357,"right":1709,"overflow":0}
PERFORMANCE_GLOSSARY_RESIZE {"theme":"dark","width":2560,"left":1677,"right":2029,"overflow":0}
PERFORMANCE_GLOSSARY_RESIZE {"theme":"dark","width":768,"left":399.65625,"right":751.65625,"overflow":0}
PERFORMANCE_GLOSSARY_RESIZE {"theme":"dark","width":1024,"left":655.328125,"right":1007.328125,"overflow":0}
PERFORMANCE_GLOSSARY_RESIZE {"theme":"dark","width":320,"left":32,"right":304,"overflow":0}
PERFORMANCE_GLOSSARY_RESIZE {"theme":"dark","width":390,"left":32,"right":374,"overflow":0}
PERFORMANCE_GLOSSARY_RESIZE {"theme":"dark","width":1440,"left":1071.65625,"right":1423.65625,"overflow":0}
PERFORMANCE_GLOSSARY_RESIZE {"theme":"dark","width":1920,"left":1357,"right":1709,"overflow":0}
  ✓  5 e2e/performance.spec.ts:255:5 › an open glossary definition stays inside every viewport after resizing in both themes (2.6s)
PERFORMANCE_DRILL_RESET {"theme":"light","id":"query","from":"completed-bottleneck","prompt":"Actual rows differ greatly from estimated rows on a slow query. Is the plan enough to name a missing index?","results":["0 of 2 decisions correct"],"selected":0,"commitDisabled":false}
PERFORMANCE_DRILL_RESET {"theme":"light","id":"bottleneck","from":"return-from-query","prompt":"Customers report slow checkout, but you have only one uninstrumented local run and no browser baseline. What comes first?","results":["2 of 2 decisions correct"],"selected":1,"commitDisabled":true}
PERFORMANCE_DRILL_RESET {"theme":"light","id":"query","from":"completed-comparison","prompt":"A small inventory table uses a sequential scan. Its measured query and user outcome meet their targets. What does the scan imply?","results":[],"selected":0,"commitDisabled":true}
PERFORMANCE_DRILL_RESET {"theme":"light","id":"bottleneck","from":"completed-comparison-via-query","prompt":"A controlled 20-item cart shows 21 inventory queries. Repeated round trips dominate server time. Which hypothesis is supported?","results":[],"selected":0,"commitDisabled":true}
PERFORMANCE_DRILL_RESET {"theme":"dark","id":"query","from":"completed-bottleneck","prompt":"Actual rows differ greatly from estimated rows on a slow query. Is the plan enough to name a missing index?","results":["0 of 2 decisions correct"],"selected":0,"commitDisabled":false}
PERFORMANCE_DRILL_RESET {"theme":"dark","id":"bottleneck","from":"return-from-query","prompt":"Customers report slow checkout, but you have only one uninstrumented local run and no browser baseline. What comes first?","results":["2 of 2 decisions correct"],"selected":1,"commitDisabled":true}
PERFORMANCE_DRILL_RESET {"theme":"dark","id":"query","from":"completed-comparison","prompt":"A small inventory table uses a sequential scan. Its measured query and user outcome meet their targets. What does the scan imply?","results":[],"selected":0,"commitDisabled":true}
PERFORMANCE_DRILL_RESET {"theme":"dark","id":"bottleneck","from":"completed-comparison-via-query","prompt":"A controlled 20-item cart shows 21 inventory queries. Repeated round trips dominate server time. Which hypothesis is supported?","results":[],"selected":0,"commitDisabled":true}
  ✘  6 e2e/performance.spec.ts:308:5 › each performance judgment starts fresh after switching from completed drills in both themes (4.2s)


  1) e2e/performance.spec.ts:308:5 › each performance judgment starts fresh after switching from completed drills in both themes 

    Error: light/query/completed-bottleneck: {"prompt":"Actual rows differ greatly from estimated rows on a slow query. Is the plan enough to name a missing index?","results":["0 of 2 decisions correct"],"selected":0,"commitDisabled":false}
    light/bottleneck/return-from-query: {"prompt":"Customers report slow checkout, but you have only one uninstrumented local run and no browser baseline. What comes first?","results":["2 of 2 decisions correct"],"selected":1,"commitDisabled":true}
    dark/query/completed-bottleneck: {"prompt":"Actual rows differ greatly from estimated rows on a slow query. Is the plan enough to name a missing index?","results":["0 of 2 decisions correct"],"selected":0,"commitDisabled":false}
    dark/bottleneck/return-from-query: {"prompt":"Customers report slow checkout, but you have only one uninstrumented local run and no browser baseline. What comes first?","results":["2 of 2 decisions correct"],"selected":1,"commitDisabled":true}

    expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 6

    - Array []
    + Array [
    +   "light/query/completed-bottleneck: {\"prompt\":\"Actual rows differ greatly from estimated rows on a slow query. Is the plan enough to name a missing index?\",\"results\":[\"0 of 2 decisions correct\"],\"selected\":0,\"commitDisabled\":false}",
    +   "light/bottleneck/return-from-query: {\"prompt\":\"Customers report slow checkout, but you have only one uninstrumented local run and no browser baseline. What comes first?\",\"results\":[\"2 of 2 decisions correct\"],\"selected\":1,\"commitDisabled\":true}",
    +   "dark/query/completed-bottleneck: {\"prompt\":\"Actual rows differ greatly from estimated rows on a slow query. Is the plan enough to name a missing index?\",\"results\":[\"0 of 2 decisions correct\"],\"selected\":0,\"commitDisabled\":false}",
    +   "dark/bottleneck/return-from-query: {\"prompt\":\"Customers report slow checkout, but you have only one uninstrumented local run and no browser baseline. What comes first?\",\"results\":[\"2 of 2 decisions correct\"],\"selected\":1,\"commitDisabled\":true}",
    + ]

      407 |     await fresh('bottleneck', 'completed-comparison-via-query')
      408 |   }
    > 409 |   expect(failures, failures.join('\n')).toEqual([])
          |                                         ^
      410 | })
      411 |
        at /Users/angelito/personal/Development-Playbook/.worktrees/stage-09-performance-port/web/e2e/performance.spec.ts:409:41

    Error Context: ../.superpowers/sdd/2026-10-08-stage-09-interactive-port/stepper-reset-teeth-artifacts/performance-each-performan-edb20-leted-drills-in-both-themes/error-context.md

  1 failed
    e2e/performance.spec.ts:308:5 › each performance judgment starts fresh after switching from completed drills in both themes 
  5 passed (29.7s)
```

### stepper-reset-08-dom-restored

Command: `env -u NO_COLOR pnpm exec vitest run src/components/Stepper.test.tsx`. Exit: `0`.

Restored DOM GREEN: one regression passes.

```text

 RUN  v4.1.10 /Users/angelito/personal/Development-Playbook/.worktrees/stage-09-performance-port/web


 Test Files  1 passed (1)
      Tests  1 passed (1)
   Start at  15:23:35
   Duration  1.27s (transform 65ms, setup 144ms, import 112ms, tests 169ms, environment 740ms)

```

### stepper-reset-09-browser-restored

Command: `env -u NO_COLOR pnpm exec playwright test e2e/performance.spec.ts --output=../.superpowers/sdd/2026-10-08-stage-09-interactive-port/stepper-reset-restored-artifacts`. Exit: `0`.

Restored fresh production GREEN: all six cases pass, with eight correct drill-switch states retained.

```text

Running 6 tests using 1 worker

  ✓  1 e2e/performance.spec.ts:6:5 › performance choices use native radio keys and keep the first committed answer (989ms)
  ✓  2 e2e/performance.spec.ts:29:5 › performance worksheets support direct links, Back and reload with long literal input in both themes (3.6s)
PERFORMANCE_PERMISSION_STATE {"theme":"light","width":320,"id":"panel-record","state":"save-denied","height":1787.59375,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(138, 90, 6)","bgs":["rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"draft-outcome","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved observer and outcome"},{"id":"draft-scope","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved scope"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"light","width":390,"id":"panel-record","state":"save-denied","height":1631.09375,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(138, 90, 6)","bgs":["rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"draft-outcome","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved observer and outcome"},{"id":"draft-scope","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved scope"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"light","width":768,"id":"panel-record","state":"save-denied","height":1463.890625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(138, 90, 6)","bgs":["rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"draft-outcome","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved observer and outcome"},{"id":"draft-scope","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved scope"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"light","width":1024,"id":"panel-record","state":"save-denied","height":1463.890625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(138, 90, 6)","bgs":["rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"draft-outcome","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved observer and outcome"},{"id":"draft-scope","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved scope"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"light","width":1440,"id":"panel-record","state":"save-denied","height":1463.890625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(138, 90, 6)","bgs":["rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"draft-outcome","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved observer and outcome"},{"id":"draft-scope","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved scope"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"light","width":1920,"id":"panel-record","state":"save-denied","height":1463.890625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(138, 90, 6)","bgs":["rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"draft-outcome","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved observer and outcome"},{"id":"draft-scope","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved scope"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"light","width":2560,"id":"panel-record","state":"save-denied","height":1463.890625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(138, 90, 6)","bgs":["rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"draft-outcome","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved observer and outcome"},{"id":"draft-scope","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved scope"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"light","width":320,"id":"panel-record","state":"copy-denied","height":2053.84375,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(138, 90, 6)","bgs":["rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"copy-status","fg":"rgb(70, 88, 110)","bgs":["rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Copy is unavailable. Select the Markdown below and copy it manually."},{"id":"manual-markdown","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"# Performance measurement record\n\n## Outcome and observer\n\nUnsaved observer and outcome\n\n## Metric and population\n\nnot recorded\n\n## Scope\n\nUnsaved scope\n\n## Win"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"light","width":390,"id":"panel-record","state":"copy-denied","height":1877.34375,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(138, 90, 6)","bgs":["rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"copy-status","fg":"rgb(70, 88, 110)","bgs":["rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Copy is unavailable. Select the Markdown below and copy it manually."},{"id":"manual-markdown","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"# Performance measurement record\n\n## Outcome and observer\n\nUnsaved observer and outcome\n\n## Metric and population\n\nnot recorded\n\n## Scope\n\nUnsaved scope\n\n## Win"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"light","width":768,"id":"panel-record","state":"copy-denied","height":1690.140625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(138, 90, 6)","bgs":["rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"copy-status","fg":"rgb(70, 88, 110)","bgs":["rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Copy is unavailable. Select the Markdown below and copy it manually."},{"id":"manual-markdown","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"# Performance measurement record\n\n## Outcome and observer\n\nUnsaved observer and outcome\n\n## Metric and population\n\nnot recorded\n\n## Scope\n\nUnsaved scope\n\n## Win"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"light","width":1024,"id":"panel-record","state":"copy-denied","height":1690.140625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(138, 90, 6)","bgs":["rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"copy-status","fg":"rgb(70, 88, 110)","bgs":["rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Copy is unavailable. Select the Markdown below and copy it manually."},{"id":"manual-markdown","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"# Performance measurement record\n\n## Outcome and observer\n\nUnsaved observer and outcome\n\n## Metric and population\n\nnot recorded\n\n## Scope\n\nUnsaved scope\n\n## Win"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"light","width":1440,"id":"panel-record","state":"copy-denied","height":1690.140625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(138, 90, 6)","bgs":["rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"copy-status","fg":"rgb(70, 88, 110)","bgs":["rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Copy is unavailable. Select the Markdown below and copy it manually."},{"id":"manual-markdown","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"# Performance measurement record\n\n## Outcome and observer\n\nUnsaved observer and outcome\n\n## Metric and population\n\nnot recorded\n\n## Scope\n\nUnsaved scope\n\n## Win"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"light","width":1920,"id":"panel-record","state":"copy-denied","height":1690.140625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(138, 90, 6)","bgs":["rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"copy-status","fg":"rgb(70, 88, 110)","bgs":["rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Copy is unavailable. Select the Markdown below and copy it manually."},{"id":"manual-markdown","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"# Performance measurement record\n\n## Outcome and observer\n\nUnsaved observer and outcome\n\n## Metric and population\n\nnot recorded\n\n## Scope\n\nUnsaved scope\n\n## Win"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"light","width":2560,"id":"panel-record","state":"copy-denied","height":1690.140625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(138, 90, 6)","bgs":["rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"copy-status","fg":"rgb(70, 88, 110)","bgs":["rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Copy is unavailable. Select the Markdown below and copy it manually."},{"id":"manual-markdown","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"# Performance measurement record\n\n## Outcome and observer\n\nUnsaved observer and outcome\n\n## Metric and population\n\nnot recorded\n\n## Scope\n\nUnsaved scope\n\n## Win"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"dark","width":320,"id":"panel-record","state":"save-denied","height":1787.59375,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(227, 171, 77)","bgs":["rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"draft-outcome","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved observer and outcome"},{"id":"draft-scope","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved scope"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"dark","width":390,"id":"panel-record","state":"save-denied","height":1631.09375,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(227, 171, 77)","bgs":["rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"draft-outcome","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved observer and outcome"},{"id":"draft-scope","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved scope"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"dark","width":768,"id":"panel-record","state":"save-denied","height":1463.890625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(227, 171, 77)","bgs":["rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"draft-outcome","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved observer and outcome"},{"id":"draft-scope","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved scope"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"dark","width":1024,"id":"panel-record","state":"save-denied","height":1463.890625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(227, 171, 77)","bgs":["rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"draft-outcome","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved observer and outcome"},{"id":"draft-scope","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved scope"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"dark","width":1440,"id":"panel-record","state":"save-denied","height":1463.890625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(227, 171, 77)","bgs":["rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"draft-outcome","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved observer and outcome"},{"id":"draft-scope","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved scope"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"dark","width":1920,"id":"panel-record","state":"save-denied","height":1463.890625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(227, 171, 77)","bgs":["rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"draft-outcome","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved observer and outcome"},{"id":"draft-scope","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved scope"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"dark","width":2560,"id":"panel-record","state":"save-denied","height":1463.890625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(227, 171, 77)","bgs":["rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"draft-outcome","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved observer and outcome"},{"id":"draft-scope","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved scope"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"dark","width":320,"id":"panel-record","state":"copy-denied","height":2053.84375,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(227, 171, 77)","bgs":["rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"copy-status","fg":"rgb(173, 192, 212)","bgs":["rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Copy is unavailable. Select the Markdown below and copy it manually."},{"id":"manual-markdown","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"# Performance measurement record\n\n## Outcome and observer\n\nUnsaved observer and outcome\n\n## Metric and population\n\nnot recorded\n\n## Scope\n\nUnsaved scope\n\n## Win"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"dark","width":390,"id":"panel-record","state":"copy-denied","height":1877.34375,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(227, 171, 77)","bgs":["rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"copy-status","fg":"rgb(173, 192, 212)","bgs":["rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Copy is unavailable. Select the Markdown below and copy it manually."},{"id":"manual-markdown","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"# Performance measurement record\n\n## Outcome and observer\n\nUnsaved observer and outcome\n\n## Metric and population\n\nnot recorded\n\n## Scope\n\nUnsaved scope\n\n## Win"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"dark","width":768,"id":"panel-record","state":"copy-denied","height":1690.140625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(227, 171, 77)","bgs":["rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"copy-status","fg":"rgb(173, 192, 212)","bgs":["rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Copy is unavailable. Select the Markdown below and copy it manually."},{"id":"manual-markdown","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"# Performance measurement record\n\n## Outcome and observer\n\nUnsaved observer and outcome\n\n## Metric and population\n\nnot recorded\n\n## Scope\n\nUnsaved scope\n\n## Win"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"dark","width":1024,"id":"panel-record","state":"copy-denied","height":1690.140625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(227, 171, 77)","bgs":["rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"copy-status","fg":"rgb(173, 192, 212)","bgs":["rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Copy is unavailable. Select the Markdown below and copy it manually."},{"id":"manual-markdown","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"# Performance measurement record\n\n## Outcome and observer\n\nUnsaved observer and outcome\n\n## Metric and population\n\nnot recorded\n\n## Scope\n\nUnsaved scope\n\n## Win"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"dark","width":1440,"id":"panel-record","state":"copy-denied","height":1690.140625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(227, 171, 77)","bgs":["rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"copy-status","fg":"rgb(173, 192, 212)","bgs":["rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Copy is unavailable. Select the Markdown below and copy it manually."},{"id":"manual-markdown","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"# Performance measurement record\n\n## Outcome and observer\n\nUnsaved observer and outcome\n\n## Metric and population\n\nnot recorded\n\n## Scope\n\nUnsaved scope\n\n## Win"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"dark","width":1920,"id":"panel-record","state":"copy-denied","height":1690.140625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(227, 171, 77)","bgs":["rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"copy-status","fg":"rgb(173, 192, 212)","bgs":["rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Copy is unavailable. Select the Markdown below and copy it manually."},{"id":"manual-markdown","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"# Performance measurement record\n\n## Outcome and observer\n\nUnsaved observer and outcome\n\n## Metric and population\n\nnot recorded\n\n## Scope\n\nUnsaved scope\n\n## Win"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"dark","width":2560,"id":"panel-record","state":"copy-denied","height":1690.140625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(227, 171, 77)","bgs":["rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"copy-status","fg":"rgb(173, 192, 212)","bgs":["rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Copy is unavailable. Select the Markdown below and copy it manually."},{"id":"manual-markdown","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"# Performance measurement record\n\n## Outcome and observer\n\nUnsaved observer and outcome\n\n## Metric and population\n\nnot recorded\n\n## Scope\n\nUnsaved scope\n\n## Win"}],"smallTargets":[]}
  ✓  3 e2e/performance.spec.ts:80:5 › permission failures retain the worksheet and offer manual export with zero page errors (2.5s)
  ✓  4 e2e/performance.spec.ts:235:5 › an internal improvement requires more observation rather than a production win (834ms)
PERFORMANCE_GLOSSARY_RESIZE {"theme":"light","width":2560,"left":1677,"right":2029,"overflow":0}
PERFORMANCE_GLOSSARY_RESIZE {"theme":"light","width":768,"left":399.65625,"right":751.65625,"overflow":0}
PERFORMANCE_GLOSSARY_RESIZE {"theme":"light","width":1024,"left":655.328125,"right":1007.328125,"overflow":0}
PERFORMANCE_GLOSSARY_RESIZE {"theme":"light","width":320,"left":32,"right":304,"overflow":0}
PERFORMANCE_GLOSSARY_RESIZE {"theme":"light","width":390,"left":32,"right":374,"overflow":0}
PERFORMANCE_GLOSSARY_RESIZE {"theme":"light","width":1440,"left":1071.65625,"right":1423.65625,"overflow":0}
PERFORMANCE_GLOSSARY_RESIZE {"theme":"light","width":1920,"left":1357,"right":1709,"overflow":0}
PERFORMANCE_GLOSSARY_RESIZE {"theme":"dark","width":2560,"left":1677,"right":2029,"overflow":0}
PERFORMANCE_GLOSSARY_RESIZE {"theme":"dark","width":768,"left":399.65625,"right":751.65625,"overflow":0}
PERFORMANCE_GLOSSARY_RESIZE {"theme":"dark","width":1024,"left":655.328125,"right":1007.328125,"overflow":0}
PERFORMANCE_GLOSSARY_RESIZE {"theme":"dark","width":320,"left":32,"right":304,"overflow":0}
PERFORMANCE_GLOSSARY_RESIZE {"theme":"dark","width":390,"left":32,"right":374,"overflow":0}
PERFORMANCE_GLOSSARY_RESIZE {"theme":"dark","width":1440,"left":1071.65625,"right":1423.65625,"overflow":0}
PERFORMANCE_GLOSSARY_RESIZE {"theme":"dark","width":1920,"left":1357,"right":1709,"overflow":0}
  ✓  5 e2e/performance.spec.ts:255:5 › an open glossary definition stays inside every viewport after resizing in both themes (2.4s)
PERFORMANCE_DRILL_RESET {"theme":"light","id":"query","from":"completed-bottleneck","prompt":"A small inventory table uses a sequential scan. Its measured query and user outcome meet their targets. What does the scan imply?","results":[],"selected":0,"commitDisabled":true}
PERFORMANCE_DRILL_RESET {"theme":"light","id":"bottleneck","from":"return-from-query","prompt":"A controlled 20-item cart shows 21 inventory queries. Repeated round trips dominate server time. Which hypothesis is supported?","results":[],"selected":0,"commitDisabled":true}
PERFORMANCE_DRILL_RESET {"theme":"light","id":"query","from":"completed-comparison","prompt":"A small inventory table uses a sequential scan. Its measured query and user outcome meet their targets. What does the scan imply?","results":[],"selected":0,"commitDisabled":true}
PERFORMANCE_DRILL_RESET {"theme":"light","id":"bottleneck","from":"completed-comparison-via-query","prompt":"A controlled 20-item cart shows 21 inventory queries. Repeated round trips dominate server time. Which hypothesis is supported?","results":[],"selected":0,"commitDisabled":true}
PERFORMANCE_DRILL_RESET {"theme":"dark","id":"query","from":"completed-bottleneck","prompt":"A small inventory table uses a sequential scan. Its measured query and user outcome meet their targets. What does the scan imply?","results":[],"selected":0,"commitDisabled":true}
PERFORMANCE_DRILL_RESET {"theme":"dark","id":"bottleneck","from":"return-from-query","prompt":"A controlled 20-item cart shows 21 inventory queries. Repeated round trips dominate server time. Which hypothesis is supported?","results":[],"selected":0,"commitDisabled":true}
PERFORMANCE_DRILL_RESET {"theme":"dark","id":"query","from":"completed-comparison","prompt":"A small inventory table uses a sequential scan. Its measured query and user outcome meet their targets. What does the scan imply?","results":[],"selected":0,"commitDisabled":true}
PERFORMANCE_DRILL_RESET {"theme":"dark","id":"bottleneck","from":"completed-comparison-via-query","prompt":"A controlled 20-item cart shows 21 inventory queries. Repeated round trips dominate server time. Which hypothesis is supported?","results":[],"selected":0,"commitDisabled":true}
  ✓  6 e2e/performance.spec.ts:308:5 › each performance judgment starts fresh after switching from completed drills in both themes (4.5s)

  6 passed (53.6s)
```

### stepper-reset-10-typecheck

Command: `env -u NO_COLOR pnpm typecheck`. Exit: `0`.

Route typegen plus TypeScript pass on final sources.

```text

> web@0.1.0 typecheck /Users/angelito/personal/Development-Playbook/.worktrees/stage-09-performance-port/web
> next typegen && tsc --noEmit

Generating route types...
✓ Types generated successfully
```

### stepper-reset-11-lint

Command: `env -u NO_COLOR pnpm lint`. Exit: `0`.

ESLint passes with zero warnings.

```text

> web@0.1.0 lint /Users/angelito/personal/Development-Playbook/.worktrees/stage-09-performance-port/web
> eslint --max-warnings 0

```

### stepper-reset-12-full-suite

Command: `env -u NO_COLOR pnpm test`. Exit: `0`.

Full suite ran once on restored final sources: 1459/1459 across 198 files. No failures.

```text

> web@0.1.0 test /Users/angelito/personal/Development-Playbook/.worktrees/stage-09-performance-port/web
> vitest run


 RUN  v4.1.10 /Users/angelito/personal/Development-Playbook/.worktrees/stage-09-performance-port/web


 Test Files  198 passed (198)
      Tests  1459 passed (1459)
   Start at  15:24:25
   Duration  41.03s (transform 16.65s, setup 19.10s, import 41.91s, tests 75.91s, environment 110.83s)

```

### stepper-reset-13-server-ended

Command: `env -u NO_COLOR lsof -nP -iTCP:3100 -sTCP:LISTEN`. Exit: `1`.

Exit 1 with empty output confirms no own configured production server remains. No process was stopped.

```text
```

### stepper-reset-14-commit

Command: `env -u NO_COLOR python3 .superpowers/sdd/2026-10-08-stage-09-interactive-port/stepper-reset-commit.py`. Exit: `0`.

Exactly three owned files committed; Lefthook format and lint pass, all files unchanged by hook. Coordinator plan/report bytes preserved during commit and left unstaged.

```text
[38;2;0;0;0m╭[38;2;5;5;5m─[38;2;11;11;11m─[38;2;16;16;16m─[38;2;19;19;19m─[38;2;23;23;23m─[38;2;26;26;26m─[38;2;29;29;29m─[38;2;32;32;32m─[38;2;35;35;35m─[38;2;39;39;39m─[38;2;42;42;42m─[38;2;45;45;45m─[38;2;49;49;49m─[38;2;52;52;52m─[38;2;56;56;56m─[38;2;56;56;56m─[38;2;52;52;52m─[38;2;49;49;49m─[38;2;45;45;45m─[38;2;42;42;42m─[38;2;39;39;39m─[38;2;35;35;35m─[38;2;32;32;32m─[38;2;29;29;29m─[38;2;26;26;26m─[38;2;23;23;23m─[38;2;19;19;19m─[38;2;16;16;16m─[38;2;11;11;11m─[38;2;5;5;5m─[38;2;0;0;0m─[38;2;0;0;0m─[38;2;5;5;5m─[38;2;11;11;11m─[38;2;16;16;16m─[38;2;19;19;19m─[38;2;23;23;23m─[38;2;26;26;26m─[38;2;29;29;29m─[38;2;32;32;32m─[38;2;35;35;35m─[38;2;39;39;39m─[38;2;42;42;42m╮[m
[38;2;0;0;0m│[m 🥊 lefthook  v2.1.10   hook:  [1mpre-commit[m [38;2;52;52;52m│[m
[38;2;6;6;6m╰[38;2;12;12;12m─[38;2;17;17;17m─[38;2;20;20;20m─[38;2;24;24;24m─[38;2;27;27;27m─[38;2;31;31;31m─[38;2;34;34;34m─[38;2;38;38;38m─[38;2;41;41;41m─[38;2;45;45;45m─[38;2;48;48;48m─[38;2;52;52;52m─[38;2;56;56;56m─[38;2;56;56;56m─[38;2;52;52;52m─[38;2;48;48;48m─[38;2;45;45;45m─[38;2;41;41;41m─[38;2;38;38;38m─[38;2;34;34;34m─[38;2;31;31;31m─[38;2;27;27;27m─[38;2;24;24;24m─[38;2;20;20;20m─[38;2;17;17;17m─[38;2;12;12;12m─[38;2;6;6;6m─[38;2;0;0;0m─[38;2;0;0;0m─[38;2;5;5;5m─[38;2;11;11;11m─[38;2;16;16;16m─[38;2;19;19;19m─[38;2;23;23;23m─[38;2;26;26;26m─[38;2;29;29;29m─[38;2;32;32;32m─[38;2;35;35;35m─[38;2;39;39;39m─[38;2;42;42;42m─[38;2;45;45;45m─[38;2;49;49;49m─[38;2;52;52;52m╯[m
┃  format ❯ 
e2e/performance.spec.ts 98ms (unchanged)
src/components/Stepper.test.tsx 7ms (unchanged)
src/components/Stepper.tsx 29ms (unchanged)

┃  lint ❯ 

[38;2;56;56;56m  ────────────────────────────────────[m
summary: (done in 2.20 seconds)
✔️ format (0.47 seconds)
✔️ lint (2.18 seconds)
[feat/stage-09-performance-port c8b7349] fix(stepper): remount content when the active step changes
 3 files changed, 157 insertions(+), 2 deletions(-)
 create mode 100644 web/src/components/Stepper.test.tsx
```

### stepper-reset-15-final-state

Command: `env -u NO_COLOR python3 final-state heredoc (commit files, owned/index status, unchanged browser cases, subject/trailer, whitespace and state captures)`. Exit: `0`.

Owned files/index clean; previous five browser case bodies unchanged; exact subject/trailer, committed whitespace and eight fresh snapshots pass. Whole worktree remains dirty with explicitly listed coordinator-owned documentation edits.

```text
HEAD=c8b73499285c4628d93d19f914ed4b9758d4db9b
PASS: exactly three owned files committed; owned tree/index clean; existing five browser cases unchanged; subject/trailer and whitespace verified.
PASS: eight final drill-switch states across both themes show fresh first cases with no results/selection and disabled Commit.
Remaining coordinator-owned unstaged changes:
 M KICKOFF.md
 M docs/superpowers/plans/2026-10-08-stage-09-interactive-port.md
 M docs/superpowers/reports/2026-10-08-stage-09-interactive-port.md
 M docs/task.md
```



## Stepper reset independent review

### Spec Compliance

- ✅ Spec compliant. All three required files have the required hunks: `web/src/components/Stepper.tsx:198` changes only the Fragment identity and explains local reset; `web/src/components/Stepper.test.tsx:20` exercises real same-position child state through switch and return; `web/e2e/performance.spec.ts:308` adds the sixth browser case with both themes and completed-drill transitions. No storage-hook/drill extraction or additional production API was introduced.
- I3, Important (previously blocking), PRE-EXISTING shared Stepper lifecycle defect / plan assumption: **ADDRESSED**. `web/src/components/Stepper.tsx:201` keys the content boundary by active step identity; it preserves the non-null keyed Fragment and adds no DOM. The real DOM regression at `web/src/components/Stepper.test.tsx:38` proves local input state clears on both transitions.
- ⚠️ TD-43's development-console behavior is outside this task's evidence. The diff retains its non-null key and Fragment structure (`web/src/components/Stepper.tsx:197`); controller-owned development validation remains the verification source. This is not a task defect or a claim of final branch readiness.

### Strengths

- The production correction establishes identity at the shared lifetime boundary, without duplicated stage keys or effect-driven state resets (`web/src/components/Stepper.tsx:201`). Stepper navigation and seen state are outside the changed boundary.
- The DOM test uses a real stateful child twice, writes distinct drafts, and checks both switch and return. No mocks or production helpers mask React reconciliation (`web/src/components/Stepper.test.tsx:6`, `:23`, `:38`, `:43`, `:47`).
- The browser test completes two bottleneck decisions before switching and checks prompt, score, selection and disabled Commit together (`web/e2e/performance.spec.ts:343`, `:347`, `:371`, `:392`). It then completes all four comparisons and retains both shorter-drill transition checks (`:398`, `:404`, `:415`, `:418`). These are behavioral checks against independent prompt literals, not implementation snapshots.
- The explicit comparison reset (`web/e2e/performance.spec.ts:396`) allows the RED run to collect the earlier stale-state failures and still establish the comparison scenario. Recorded RED observations already show fresh comparison transitions, so the report correctly DISPROVES the invalid-index prediction rather than presenting it as a reproduced bug (`stepper-reset-fix-report.md:13`, `:76`).

### Issues

#### Critical (Must Fix)

- None.

#### Important (Should Fix)

- No new findings. I3 is ADDRESSED as above.

#### Minor (Nice to Have)

- None introduced by this change. Shared storage-hook/drill extraction remains explicitly deferred, outside the authorized fix (`stepper-reset-fix-report.md:29`).

### Evidence Checks

- Read `review-915c991..c8b7349.diff` once. Its hunks were complete; no changed source files were reopened, no outside production code was inspected, and no suite or git commands were rerun.
- A read-only Python check parsed all 15 evidence sections, compared each entire text fence byte-for-byte with its retained `.log`, and compared each reported exit with its `.exit`. All 15 match, including the empty no-listener fence (`stepper-reset-fix-report.md:35`, `:76`, `:179`, `:191`, `:209`, `:279`, `:320`, `:423`, `:441`, `:511`, `:526`, `:539`, `:561`, `:570`, `:596`). An initial parser expected an extra newline in that empty fence; correcting the parser confirmed the exact empty log. No evidence gap was found.
- Genuine RED and teeth both report DOM 1 failed for the expected retained input, and browser 1 failed / 5 passed for the new stale-drill case (`stepper-reset-fix-report.md:35`, `:76`, `:279`, `:320`). The old five browser cases continue passing, including saved worksheet Back/reload.
- Restored GREEN reports DOM 1 passed, browser 6 passed, and full suite 1459 passed across 198 files (`stepper-reset-fix-report.md:423`, `:441`, `:539`). Typegen/typecheck, zero-warning lint, formatting and commit-hook evidence have exit 0 (`:179`, `:511`, `:526`, `:570`). Diagnostic scan found no unexpected warnings or errors; RED/teeth assertion diagnostics are expected.
- Read the retained teeth runner without executing it: it mutates only `key={step.id}` back to `key="content"`, restores original bytes in `finally`, and asserts byte equality. Its reported restored runs are green (`stepper-reset-teeth.py:6`, `:10`, `:12`; `stepper-reset-fix-report.md:423`, `:441`).
- Read the RED and restored transition JSON captures. RED confirms stale Query/return states in both themes; its comparison states are already clean. All eight restored transitions show first prompts, empty results, zero selection and disabled Commit (`stepper-reset-02-browser-red-states.json:1`; `stepper-reset-restored-states.json:1`).
- Denied worksheet draft observations explicitly warn to export before leaving or reloading; storage-backed worksheet persistence remains covered by the passing unchanged browser case (`stepper-reset-fix-report.md:441`). No persistence guarantee is inferred for an unsaved denied draft.

### Assessment

**Task quality:** Approved; review clean after 1 fix. **Spec quality:** the narrow repair brief is satisfied; I3 ADDRESSED.

The keyed Fragment fixes the confirmed reconciliation defect at its source, and real DOM/browser RED, GREEN and teeth establish the regression test's sensitivity. Evidence reports commit `c8b7349`, owned files/index clean, coordinator documentation intentionally dirty; NOT merged, NOT deployed (`stepper-reset-fix-report.md:596`). Global audit and manual readiness belong to the separate final review.
