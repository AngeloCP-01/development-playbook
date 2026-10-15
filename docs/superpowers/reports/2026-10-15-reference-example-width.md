# Reference example width repair, 2026-10-15

The caching reference's single code sample occupied half its description column.
`CheatsheetView` applied `sm:grid-cols-2` to every example group, including groups
with one example. The shared renderer now applies that class only when a row has
more than one example. Paired comparisons retain their desktop layout and stack
below the existing breakpoint.

The user requested direct implementation without brainstorming. This bounded
repair changes the renderer and its render tests; no spec or plan was needed.
Base: `9de6c99`, branch `fix/reference-example-width`, fix commit `e97c97c`.

## TDD evidence

The new test failed for the expected reason: the single-example group still
received the two-column class. Raw terminal excerpt from the first RED run,
before changing production code:

```text
> vitest run src/components/Cheatsheet.test.tsx

 ❯ |dom| src/components/Cheatsheet.test.tsx (17 tests | 1 failed) 145ms
   × a single example uses the description width instead of reserving an empty comparison column 5ms

 FAIL  |dom| src/components/Cheatsheet.test.tsx > a single example uses the description width instead of reserving an empty comparison column
AssertionError: expected 'mt-4 grid min-w-0 gap-3 sm:grid-cols-2' not to contain 'sm:grid-cols-2'

Expected: "sm:grid-cols-2"
Received: "mt-4 grid min-w-0 gap-3 sm:grid-cols-2"

 Test Files  1 failed (1)
      Tests  1 failed | 16 passed (17)
   Start at  08:29:26
   Duration  1.27s (transform 107ms, setup 104ms, import 184ms, tests 145ms, environment 721ms)
```

Raw GREEN excerpt after the minimal renderer change:

```text
> vitest run src/components/Cheatsheet.test.tsx

 Test Files  1 passed (1)
      Tests  17 passed (17)
   Start at  08:29:37
   Duration  1.34s (transform 127ms, setup 124ms, import 233ms, tests 155ms, environment 732ms)
```

The existing paired-example test also checks that its comparison layout remains.
The teeth check temporarily restored the unconditional class: only the new guard
failed, with **1 failed / 16 passed**. Restoring the fix returned **17/17**. Full raw
teeth and restored GREEN output is preserved locally under
`.superpowers/sdd/2026-10-15-reference-example-width/`.

## Verification

- Format, lint and generated-route typecheck: exit 0.
- Full Vitest suite: **1496/1496 across 207 files**, exit 0.
- Fresh production build and full Playwright audit: **24/24 in 9.3 minutes**,
  exit 0. Both-theme WCAG AA, all five overflow widths, touch targets, expanded
  disclosures, production console and navigation checks passed.
- Production browser geometry: **28 observations**, two sheets (`caching` and
  `solid-principles`), seven widths (320, 375, 768, 1024, 1440, 1920, 2560), both
  themes. Every single example filled its description column; paired examples
  remained side by side from 640px and stacked below it. No page overflow or
  console errors. At 1440px the caching example occupied **745/745px**.
- Inspected four caching screenshots: 320px and 1440px in both themes. Desktop
  code uses the available width; narrow code scrolls inside its box.

Raw command logs, browser output and screenshots are in the local evidence folder
above. The first geometry probe included `scaling`, which has no example groups;
the completed matrix uses caching's single example and SOLID's five paired groups.

The standard development-console command could not start because a user-owned
Next.js dev server already held the checkout's dev lock on port 3200. It was left
running. A direct browser probe confirmed that server served the fixed class and
equal example/description widths (**585/585px**). The unchanged console test was
run against it through an ignored temporary config with a fresh browser
context; this changes only the server address and omits server startup. It passed
**1/1 in 1.7 minutes**, exit 0, with no React warnings or other console messages.

## Review and scope

Independent read-only source review: **review clean**, no Critical, Important or
Minor findings. The reviewer checked both conditional branches, mobile stacking
and scroll containment. Browser geometry subsequently confirmed the layout.

Final whole-branch review also returned **review clean**, conditional on the
remaining production audit passing and its result being recorded. Both conditions
are now satisfied: the complete audit passed **24/24**, exit 0. The review covered
the source commit, tracker entry and this report, including the raw evidence and
four screenshots. The controller accepted three review boundaries: the running
audit remains the controller's responsibility; the older tracker overview and
separate records branch stay outside this repair; the original RED chronology
comes from its terminal excerpt, backed by a retained reproducible teeth run.

Humanizer pass: kept the report factual and concise; raw terminal excerpts were
left unchanged. Tracker ledger guards passed **2/2**, exit 0.

Final state: fix `e97c97c` is committed on `fix/reference-example-width`;
`develop` remains at `9de6c99`, and `main` was not changed. The report and tracker
entry are committed separately from implementation. No merge, push or deployment
was performed for this repair. The user's existing dev server and `image.png`
were left in place.

Deferred: full-row code layouts, changes to paired comparisons, syntax or content
changes, copy controls and other reference redesigns. Merge, push and production
promotion remain separate decisions.
