# Kickoff: JavaScript keyboard-scroll correction

Updated 2026-11-06. Follow [AGENTS.md](AGENTS.md), D-99–D-102.

## Correction and branch

Coordinator reviewed application **3d4b140** and found one P2: scrolling code
lacked the explicit keyboard tab stops required by `web/PATTERNS.md`.
`StudySheet` worked examples and `SheetActivities` starters/revealed solutions
now use `tabIndex={0}`. Internal scrolling and existing focus styling are retained.
Render tests cover both renderers; browser tests tab into all three code contexts
at 320px, check visible unobscured focus and ArrowRight horizontal movement in
both themes, then re-collapse the solution with the keyboard.

- Branch: `feat/javascript-study-sections`.
- Correction base: **b3b790e3a13d1e467a48d855f7b5b67ff63d58cc**.
- Correction application: **322c8733bb8553afd57c3fd32125105ac44f603a**.
  Later records do not change application inputs. Earlier application **3d4b140** checks remain historical.
- Session: **01a1a908-ddb6-7f91-bb4d-7834839b62e8**. The user explicitly said
  "proceed here" after the fresh-session notice. This correction-specific
  instruction does not change D-100 for future tasks. Recommended implementation
  setting remains **GPT-6.1 Sol / High**; no active-setting claim is made.

## Verification

Node **22.23.4**, pinned pnpm **10.33.0** through the task-local Corepack shim.
TDD: both new render tests failed because `tabindex` was absent (**2 failed /
4 passed**), then the focused files passed **6/6**. Fresh focused production
keyboard-scroll tests **2/2**, both themes, exit 0.

Fresh correction-tree checks: `pnpm format:check`, `pnpm lint`,
`pnpm typecheck` and `pnpm build` (**57 pages**) exit 0. Complete production
`pnpm test:e2e --fully-parallel --workers=2` **42/42**, **7.0m**, exit 0.
Full `pnpm test --maxWorkers=1` **1,637 tests / 233 files**, exit 0, **167.62s**.
Fresh isolated-copy `pnpm test:dev-console` **1/1**, **4.5m**, exit 0;
identical `src`/`public`, explicit Turbopack root and testDir configuration only.
This preserves the user's :3200 server. Additional revealed-body checks:
**36 keyboard toggles / two themes / zero warnings or errors**.

The first `pnpm test --maxWorkers=2` passed **1,632 tests / 231 files** but
failed to start fork workers for `CiCd.test.tsx` and
`PerformanceChecklist.test.tsx` (worker-response timeouts, no assertion failures).
The full suite was rerun alone with one worker and unchanged assertions/timeouts.

Closing records: ledger **2/2**, local links/anchors **141 targets / 5 files**,
`git diff --check`, all exit 0. Identified application checks are retained
after the records-only update; no assertions/timeouts were weakened.

## Coordinator return

Recommended next task/model: **review the bounded keyboard-scroll correction,
GPT-6 Astra / Low**, coordinator **01a18acc-3b54-7202-92f3-404cc94fd0ad**.
Read this implementation thread and review the actual correction commit/diff.
The fix and regression coverage are ready for coordinator confirmation; the prior content/spec review found no findings. This file and the implementation
response are the return package. Separate user approval is required before a
no-ff merge into develop. No merge, push or promotion occurred.

Scope remains seven sections, eleven worked examples and nine local activities,
**26/30** sheets and **18/18** stages. Content/generated files are unchanged by
this correction. Four other language sheets, a complete course, code execution,
grading/persistence, dependencies and diagrams remain deferred.

Pointers: [source/design](reference/javascript-source-research.md#sectioned-expansion-selected-2026-11-05),
[compact plan](docs/superpowers/plans/2026-11-05-javascript-study-expansion.md),
[completion evidence](docs/tracker.md#completed), [tasks](docs/task.md).
