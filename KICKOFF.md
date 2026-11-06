# Kickoff: JavaScript keyboard-scroll correction

Updated 2026-11-06. Follow [AGENTS.md](AGENTS.md), D-99–D-102.

## Current review and next task

Coordinator reviewed **73414a872be8b826d309c9058564a1896f40ca7e**, application
**3d4b140ae8517134c9fe4fb6916dbe33bfd35952**, full diff from **8ff159f** with
emphasis on the expansion after **bd72e70**. Independent Standards and Spec
reviews agree the delivered scope is sound; **one P2 standards finding remains**.

**Next task: fix keyboard access to scrolling code. Recommended: fresh
GPT-6.1 Sol / High session**, per D-100. Start from this committed records tip
on `feat/javascript-study-sections`; record its exact SHA. Keep the feature
history and return the bounded correction to the coordinator before integration.

- `web/src/components/StudySheet.tsx:36` and
  `web/src/components/SheetActivities.tsx:12` render horizontally scrolling
  `<pre>` blocks without explicit `tabIndex={0}`. PATTERNS lines 399–400 require
  a tab stop so keyboard users can reach the scroll. This affects both worked
  examples and activity starters/solutions; it currently relies on browser defaults.
- Coordinator confirmed four overflowing code blocks at 320px on open Promises,
  all with no explicit tabindex. Preserve existing internal scrolling and layout.
- Add focused render coverage for keyboard-focusable code in both renderers and
  a narrow browser check that tabs into an overflowing block and scrolls it with
  the keyboard. Include a revealed solution and visible focus. Observe the
  meaningful failure before fixing; confirm activity buttons/history still work.
- Run checks invalidated by the correction and the existing final app gate for
  the completed correction tree; run dev-console once for changed shared React
  output. Return exact commit, checks and session reference for coordinator review.
  Existing **3d4b140** evidence below remains historical, not correction evidence.

Fresh coordinator checks: eight focused unit/DOM files **52/52**, published
checker **52 assertions**, all **29 other sheet bodies unchanged** and whitespace
pass. Production inspection: 320px/light open Promises and 1024px/dark Functions
are readable, without page overflow; Functions default panel **2.06 screens**,
keyboard solution reveal/re-collapse, End and Back work. Console has zero
warnings/errors. The tracker records reviewer provenance and retained gate evidence.

Closing records on the review tree descended from **73414a8**: ledger **2/2**,
local links/anchors **141 targets / 5 files** and `git diff --check`, all exit 0.
No application inputs changed during coordinator review. No merge, push or promotion.

## Delivered scope

`/reference/javascript` now has seven navigable study sections, eleven worked
examples and nine local activities: values/equality; scope/closures;
functions/this; objects/prototypes; arrays; promises/errors; scheduling.
Prompts remain visible while solutions open independently. Shared checked
metadata drives section order and local practice in both web and Markdown.
All 29 other generated sheet bodies remain byte-identical to the design base.

Read the [source/design record](reference/javascript-source-research.md#sectioned-expansion-selected-2026-11-05),
[compact plan](docs/superpowers/plans/2026-11-05-javascript-study-expansion.md)
and [completion evidence](docs/tracker.md#completed).

## Branch, review and session

- Branch: `feat/javascript-study-sections`, exact base
  **17c480821240eb74261b5c18fb7864d6c377ca40**.
- Expansion **be5cf7720f19aad1c01aefbee420c5afb5f53123**;
  final application **3d4b140ae8517134c9fe4fb6916dbe33bfd35952**.
  Later delivery records do not change application inputs.
- Independent **GPT-6 Astra / Low** review covered **8ff159f..be5cf77**,
  emphasizing the expansion after **bd72e70**, including delivered page states.
  Two findings are fixed in **3d4b140**: duplicate browser-test registration and
  missing explicit equality-coercion explanation. Collection now reaches all
  40 cases; final actual-sheet/generator tests pass **3/3**. The later coordinator
  review above adds the remaining keyboard-scroll finding.
- Implementation session: **01a1a908-ddb6-7f91-bb4d-7834839b62e8**. The user
  requested "continue" after the fresh-session notice; work continued here.
  This does not change D-100 for future tasks. Recommended implementation model
  remains **GPT-6.1 Sol / High**; no active-model setting is claimed.

## Verification

Supported **Node 22.23.4**, pinned **pnpm 10.33.0** via a temporary Corepack shim.
Retained checkpoint checks: format/lint/generated-route typecheck exit 0;
full unit/DOM **1,635 tests / 233 files**. After the bounded review fixes,
fresh actual-sheet/generator **3/3**, production build **57 pages**, complete
production audit **40/40** (`--fully-parallel --workers=2`, unchanged timeouts)
and exact published-example checker **52 assertions**, all exit 0.

Fresh `pnpm test:dev-console` **1/1**, exit 0 (**3.7m**), ran sequentially
after production in an isolated copy with identical `src`/`public`; only explicit
Turbopack root and testDir configuration differ. It leaves the user’s :3200
server untouched. Additional development checks opened/re-collapsed all local
solutions: **36 keyboard toggles / two themes / zero warnings or errors**.

Closing records: ledger **2/2**, local links/anchors **140 targets / 5 files**,
`git diff --check`, and final example checker **52 assertions**, all exit 0. Application checks above are retained
for unchanged inputs after this records update. Earlier failed attempts and
reproductions are summarized in the tracker; no assertions/timeouts were weakened.

## Return and next action

Return the correction branch/diff and evidence to coordinator session
**01a18acc-3b54-7202-92f3-404cc94fd0ad**. Recommended next task/model:
**review the keyboard-scroll correction, GPT-6 Astra / Low**. Read the implementation
thread before relying on its handoff; review the actual diff and identified
commits. This file and the implementation response are the return package.
Separate user approval is required before a no-ff merge into develop. No merge,
push or production promotion occurred. Four other sheets, a complete course,
runner/grading/persistence, dependencies and diagrams remain deferred.
