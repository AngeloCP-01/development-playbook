# Stage 09 port: final verification

Application checks ran on 2026-10-09 at `c8b7349`. The session resumed on
2026-10-12 at `adb2030`; that intervening commit changes documentation only,
and its diff against the tested application tree is empty. Final whole-branch
review remains due. No merge or deployment occurred.

The feature branch registers twelve freely navigable, hash-addressable
panels. Five outcome inspectors distinguish browser checkout, visible Paid
status and the three independent consumers. Baseline practice and nine
diagnostic decisions use visibly hypothetical evidence. The reader's own
eleven-field record shares one storage key across two worksheet views and
exports Markdown; a separate key holds five completion checks.

## Gate evidence

| Check | Actual result |
|---|---|
| Format | exit 0 |
| Lint | exit 0, zero warnings |
| Typecheck | exit 0, route typegen followed by TypeScript |
| Unit and render tests | 1459/1459 across 198 files |
| Production build | exit 0, 50 prerendered pages |
| Production browser audit | 24/24, both themes, responsive, touch, disclosures, hashes, panel weight and console |
| React development-console audit | 1/1, no development warnings on audited pages |
| Interacted-state color and geometry calculation | 574 observations, zero failures |

The production audit's slow-file advisory is retained in its raw output.
The final commands remove `NO_COLOR` only from their subprocess environment,
avoiding the earlier conflict with Playwright's forced color. They leave the
parent environment alone. Production and development servers ran separately.
The deployed-site smoke test is due after promotion; this round made no
deployed-site claim.

## Interacted states

The selected Chrome browser recorded 546 snapshots: 39 states at seven
widths (320, 390, 768, 1024, 1440, 1920, 2560), in both themes. These cover
every clock, committed baseline field, the assembled wrong record, all eight
glossary definitions, all nine diagnostic cases, all seven open fixes,
long literal worksheet text, export status, all AI plays, the five checks,
four team practices and eight open traps. The final production audit supplied
28 additional save-denied and copy-denied observations with 84 color pairs.

Native Space and ArrowDown select the baseline radios in both themes; the
focused label has a solid 2px outline. The assembled wrong record preserves
the server-only choice and reports 4 of 5 correct. The corrected
bottleneck-to-query transition starts at the first query with no selection,
no results and Commit disabled. The query SQL and its annotations were read
in the live page. All five curated references were opened and checked in
Chrome after the plan was written.

Computed text colors and ancestor backgrounds were recorded directly from
the visible DOM. The existing CSS parser handles `oklab()`; the calculation
composites alpha and applies WCAG AA thresholds. Calibration checks yield
21:1 for black on white and 1:1 for white on white, and reject unknown colors.
The 574 observations contain zero contrast, overflow or touch-target failures.
The lowest text contrast is 4.652:1. The largest revealed panel is all seven
fixes open: 3.324 screens at 1024×768, below the four-screen limit.

An early percentile sample was taken before the resize handler completed.
The collector now reads updated accessibility state before measuring. The
original sample is preserved in scratch evidence; the settled 390px note
runs from 31.55px to 373.55px with zero overflow. This was a measurement
timing error, not another application defect.

The production walkthrough's warning/error log was empty. Browser cleanup
initially stalled at a native confirmation; empty-string fill also left the
old test input unchanged in that connector. Native select-all and Backspace
updated the application correctly and cleared every verification-only field.
On 2026-10-12 the browser showed 0 of 11 fields and 0 of 5 checks, System
theme restored, viewport override reset, and all temporary previews stopped.
This cleanup ran against a development preview and is separate from the
production measurements above.

## Findings resolved before final review

- The missing-rail audit fixture still named Stage 09. `90da921` moves its
  negative case to the Stage 10 placeholder, retaining the guard and teeth.
- The missing-browser comparison inherited recorded sample and failure
  evidence from a generic fixture. `592a9e0` leaves those fields unrecorded,
  with an independent regression.
- The plan's test cleanup removed the shared ResizeObserver stub, and four
  glossary names did not match the canonical chapter. Task 7 repaired the
  local browser-API setup and named those terms in `af9cc5e`.
- Open glossary notes kept an old offset on resize. `915c991` resets and
  recalculates it; DOM and real browser RED, GREEN and isolated teeth support
  the fix, independently reviewed.
- The Stepper's constant content key retained drill state across resolved
  client trees. `c8b7349` keys the Fragment by step ID, preserving its non-null
  key and remounting local judgments. Independent review cleared the fix.
  The predicted comparison-to-shorter-drill failure was disproved in the
  actual layout; it is not claimed as an observed bug.
- Task 1 originally placed editorial summaries in raw-output fences. The
  original assertion diagnostics were unavailable. The report discloses that
  gap and retains a new controlled RED/GREEN/teeth sequence; two repair rounds
  established byte-exact transcripts rather than inventing historical output.

## Evidence artifacts

- [Task and fix TDD transcripts and reviews](2026-10-08-stage-09-interactive-port.md)
- [Chapter-driven coverage walk](2026-10-09-stage-09-chapter-coverage.md)
- [546 manual snapshots and their color palette](2026-10-09-stage-09-ui-measurements.json)
- [28 permission-failure observations](2026-10-09-stage-09-denied-states.json)
- [574 calculated results](2026-10-09-stage-09-ui-results.json)

Deferred: W-6 caching/scaling sheets, image publication, real order telemetry,
shared-drill extraction and storage-hook repairs, integration, further pushes
and production promotion. Stage content remains hand-ported duplication,
as approved for this port; the application does not read chapter Markdown.

## Raw final command output

Each fence below is copied from the retained command log without editing.
Exit status is outside the fence. Literal terminal whitespace is intentional.

### format

```text

> web@0.1.0 format:check /Users/angelito/personal/Development-Playbook/.worktrees/stage-09-performance-port/web
> prettier --check .

Checking formatting...
All matched files use Prettier code style!
```

Command exit status: 0

### lint

```text

> web@0.1.0 lint /Users/angelito/personal/Development-Playbook/.worktrees/stage-09-performance-port/web
> eslint --max-warnings 0

```

Command exit status: 0

### typecheck

```text

> web@0.1.0 typecheck /Users/angelito/personal/Development-Playbook/.worktrees/stage-09-performance-port/web
> next typegen && tsc --noEmit

Generating route types...
✓ Types generated successfully
```

Command exit status: 0

### test

```text

> web@0.1.0 test /Users/angelito/personal/Development-Playbook/.worktrees/stage-09-performance-port/web
> vitest run


 RUN  v4.1.10 /Users/angelito/personal/Development-Playbook/.worktrees/stage-09-performance-port/web


 Test Files  198 passed (198)
      Tests  1459 passed (1459)
   Start at  15:27:39
   Duration  34.74s (transform 18.39s, setup 17.68s, import 50.02s, tests 43.82s, environment 88.60s)

```

Command exit status: 0

### build

```text

> web@0.1.0 build /Users/angelito/personal/Development-Playbook/.worktrees/stage-09-performance-port/web
> next build

▲ Next.js 16.2.10 (Turbopack)

  Creating an optimized production build ...
✓ Compiled successfully in 3.1s
  Running TypeScript ...
  Finished TypeScript in 10.1s ...
  Collecting page data using 7 workers ...
  Generating static pages using 7 workers (0/50) ...
  Generating static pages using 7 workers (12/50) 
  Generating static pages using 7 workers (24/50) 
  Generating static pages using 7 workers (37/50) 
✓ Generating static pages using 7 workers (50/50) in 591ms
  Finalizing page optimization ...

Route (app)
┌ ○ /
├ ○ /_not-found
├ ○ /reference
├ ● /reference/[slug]
│ ├ /reference/architecture-patterns
│ ├ /reference/design-patterns
│ ├ /reference/api-design
│ └ [+22 more paths]
├ ○ /robots.txt
├ ○ /sitemap.xml
└ ● /stages/[slug]
  ├ /stages/01-product-discovery
  ├ /stages/02-planning
  ├ /stages/03-architecture
  └ [+15 more paths]


○  (Static)  prerendered as static content
●  (SSG)     prerendered as static HTML (uses generateStaticParams)

```

Command exit status: 0

### e2e

```text

> web@0.1.0 test:e2e /Users/angelito/personal/Development-Playbook/.worktrees/stage-09-performance-port/web
> playwright test


Running 24 tests using 3 workers

  ✓   1 e2e/performance.spec.ts:6:5 › performance choices use native radio keys and keep the first committed answer (1.9s)
  ✓   4 e2e/performance.spec.ts:29:5 › performance worksheets support direct links, Back and reload with long literal input in both themes (5.9s)
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
  ✓   5 e2e/performance.spec.ts:80:5 › permission failures retain the worksheet and offer manual export with zero page errors (2.6s)
  ✓   6 e2e/performance.spec.ts:235:5 › an internal improvement requires more observation rather than a production win (786ms)
PERFORMANCE_GLOSSARY_RESIZE {"theme":"light","width":2560,"left":1677,"right":2029,"overflow":0}
PERFORMANCE_GLOSSARY_RESIZE {"theme":"light","width":768,"left":399.65625,"right":751.65625,"overflow":0}
PERFORMANCE_GLOSSARY_RESIZE {"theme":"light","width":1024,"left":655.328125,"right":1007.328125,"overflow":0}
PERFORMANCE_GLOSSARY_RESIZE {"theme":"light","width":320,"left":32,"right":304,"overflow":0}
PERFORMANCE_GLOSSARY_RESIZE {"theme":"light","width":390,"left":32,"right":374,"overflow":0}
PERFORMANCE_GLOSSARY_RESIZE {"theme":"light","width":1440,"left":1071.65625,"right":1423.65625,"overflow":0}
PERFORMANCE_GLOSSARY_RESIZE {"theme":"light","width":1920,"left":1357,"right":1709,"overflow":0}
  ✓   3 e2e/audit-pages.spec.ts:47:5 › the sweep reaches every step every built stage declares, since a selector that returned half a rail would shrink it in silence (13.7s)
  ✓   8 e2e/audit-pages.spec.ts:62:5 › appends the reference index and every registered sheet, so a sheet added later cannot slip out of the sweep (97ms)
PERFORMANCE_GLOSSARY_RESIZE {"theme":"dark","width":2560,"left":1677,"right":2029,"overflow":0}
PERFORMANCE_GLOSSARY_RESIZE {"theme":"dark","width":768,"left":399.65625,"right":751.65625,"overflow":0}
PERFORMANCE_GLOSSARY_RESIZE {"theme":"dark","width":1024,"left":655.328125,"right":1007.328125,"overflow":0}
PERFORMANCE_GLOSSARY_RESIZE {"theme":"dark","width":320,"left":32,"right":304,"overflow":0}
PERFORMANCE_GLOSSARY_RESIZE {"theme":"dark","width":390,"left":32,"right":374,"overflow":0}
PERFORMANCE_GLOSSARY_RESIZE {"theme":"dark","width":1440,"left":1071.65625,"right":1423.65625,"overflow":0}
PERFORMANCE_GLOSSARY_RESIZE {"theme":"dark","width":1920,"left":1357,"right":1709,"overflow":0}
  ✓   7 e2e/performance.spec.ts:255:5 › an open glossary definition stays inside every viewport after resizing in both themes (2.8s)
  ✓   9 e2e/audit-pages.spec.ts:74:5 › refuses to sweep a stage that is ready but renders no steps, since silence there is the failure TD-12 describes (730ms)
PERFORMANCE_DRILL_RESET {"theme":"light","id":"query","from":"completed-bottleneck","prompt":"A small inventory table uses a sequential scan. Its measured query and user outcome meet their targets. What does the scan imply?","results":[],"selected":0,"commitDisabled":true}
PERFORMANCE_DRILL_RESET {"theme":"light","id":"bottleneck","from":"return-from-query","prompt":"A controlled 20-item cart shows 21 inventory queries. Repeated round trips dominate server time. Which hypothesis is supported?","results":[],"selected":0,"commitDisabled":true}
PERFORMANCE_DRILL_RESET {"theme":"light","id":"query","from":"completed-comparison","prompt":"A small inventory table uses a sequential scan. Its measured query and user outcome meet their targets. What does the scan imply?","results":[],"selected":0,"commitDisabled":true}
PERFORMANCE_DRILL_RESET {"theme":"light","id":"bottleneck","from":"completed-comparison-via-query","prompt":"A controlled 20-item cart shows 21 inventory queries. Repeated round trips dominate server time. Which hypothesis is supported?","results":[],"selected":0,"commitDisabled":true}
PERFORMANCE_DRILL_RESET {"theme":"dark","id":"query","from":"completed-bottleneck","prompt":"A small inventory table uses a sequential scan. Its measured query and user outcome meet their targets. What does the scan imply?","results":[],"selected":0,"commitDisabled":true}
PERFORMANCE_DRILL_RESET {"theme":"dark","id":"bottleneck","from":"return-from-query","prompt":"A controlled 20-item cart shows 21 inventory queries. Repeated round trips dominate server time. Which hypothesis is supported?","results":[],"selected":0,"commitDisabled":true}
PERFORMANCE_DRILL_RESET {"theme":"dark","id":"query","from":"completed-comparison","prompt":"A small inventory table uses a sequential scan. Its measured query and user outcome meet their targets. What does the scan imply?","results":[],"selected":0,"commitDisabled":true}
PERFORMANCE_DRILL_RESET {"theme":"dark","id":"bottleneck","from":"completed-comparison-via-query","prompt":"A controlled 20-item cart shows 21 inventory queries. Repeated round trips dominate server time. Which hypothesis is supported?","results":[],"selected":0,"commitDisabled":true}
  ✓  10 e2e/performance.spec.ts:308:5 › each performance judgment starts fresh after switching from completed drills in both themes (5.3s)
  ✓   2 e2e/audit.spec.ts:46:7 › no horizontal overflow at 320px, because a field manual must never scroll sideways (42.8s)
  ✓  11 e2e/audit.spec.ts:46:7 › no horizontal overflow at 768px, because a field manual must never scroll sideways (26.1s)
  ✓  12 e2e/audit.spec.ts:46:7 › no horizontal overflow at 1024px, because a field manual must never scroll sideways (27.1s)
  ✓  13 e2e/audit.spec.ts:46:7 › no horizontal overflow at 1440px, because a field manual must never scroll sideways (28.1s)
  ✓  14 e2e/audit.spec.ts:46:7 › no horizontal overflow at 2560px, because a field manual must never scroll sideways (27.1s)
  ✓  15 e2e/audit.spec.ts:65:5 › interactive elements are at least 44px tall below lg (1.1m)
  ✓  16 e2e/audit.spec.ts:158:7 › every text/background pair passes WCAG AA in light mode (1.1m)
  ✓  17 e2e/audit.spec.ts:158:7 › every text/background pair passes WCAG AA in dark mode (1.2m)
  ✓  18 e2e/audit.spec.ts:337:5 › the sweep observes every disclosure open at least once, since a sweep that quietly stops opening things is indistinguishable from a clean pass (1.1m)
  ✓  19 e2e/audit.spec.ts:401:5 › zero console errors across every page and step (26.4s)
  ✓  20 e2e/audit.spec.ts:426:5 › the interrogation still explains itself after a wrong answer, since the reasoning is the lesson and not the reward (844ms)
  ✓  21 e2e/audit.spec.ts:463:5 › the locking exercise explains itself after a wrong answer too, since its wrong answer is the one the step was built for (725ms)
  ✓  22 e2e/audit.spec.ts:494:5 › reset clears the uncommitted draft as well as the committed answers, since a group that presents itself as unanswered must not have boxes ticked (867ms)
  ✓  23 e2e/audit.spec.ts:546:5 › every listed step hash lands on the step it names, since a dead hash falls back and audits step one twice (9.9s)
  ✓  24 e2e/audit.spec.ts:599:5 › no step panel exceeds four screens, because a step that is a scroll is two steps (10.5s)

  Slow test file: e2e/audit.spec.ts (7.9m)
  Consider running tests from slow files in parallel. See: https://playwright.dev/docs/test-parallel
  24 passed (8.2m)
```

Command exit status: 0

### dev-console

```text

> web@0.1.0 test:dev-console /Users/angelito/personal/Development-Playbook/.worktrees/stage-09-performance-port/web
> playwright test --config=playwright.dev.ts


Running 1 test using 1 worker

  ✓  1 e2e/dev-console.spec.ts:29:5 › @dev no React development warnings on any audited page, which the production audit cannot see at all (1.6m)

  1 passed (1.7m)
```

Command exit status: 0

### ui-colors

```text
{
  "snapshots": 574,
  "manualSnapshots": 546,
  "permissionSnapshots": 28,
  "parsedColors": 47,
  "failures": [],
  "minContrast": 4.652,
  "maxScreens1024": 3.324
}
```

Command exit status: 0
