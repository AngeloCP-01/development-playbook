# Step panel weight — superseding D-38

**Date:** 2026-07-31 · **Branch:** `feat/stage-03-app-port` · **Milestone:** W-3.2

## Problem

D-38 caps a dense stage at five content steps plus the AI step. Stage 03's app is at eight
content steps plus AI, section 9 of its doc has no step at all, and five clusters of ported
material are still to land. The tracker calls this "needs superseding" and warns that
"stage 03 is special" will not survive stage 04 making the same argument.

Two things turned up while measuring it, and both change what the decision should say.

**D-38 was already being broken before stage 03.** It sets five content steps as the dense
ceiling. `web/PATTERNS.md:42` says four to six. Stage 02 shipped **six content steps plus AI**
(`web/src/features/planning/Planning.tsx` — `done · cut · sequence · size · ai · write ·
horizon`), which satisfies `PATTERNS.md` and exceeds D-38, and no deviation was recorded. So
the rule has been narrower than the documented guideline since the stage after the one it was
written for.

**The count was the wrong instrument.** D-38's stated reason is that "a stepper stops being
navigable when a step is a scroll" — a claim about how much one panel holds. Capping the count
pushes the opposite way: fewer steps for the same content means heavier panels. Measuring every
panel in the app at 1024×768 shows the proxy failing exactly there:

```
                      median   max    heaviest panel
stage 01   6 steps      2.4     6.7   record
stage 02   7 steps      2.5     5.6   horizon
stage 03   9 steps      5.3     8.4   schema
```

Stage 03's *typical* panel is heavier than 01's and 02's worst non-outlier panel. Six of its
nine panels are over four screens. The stage that broke the count ceiling is also the stage
that broke the thing the ceiling was protecting — and the ceiling never noticed, because it was
counting the wrong noun.

## Goals

- Replace D-38 with a rule that measures what it claims to care about.
- Make that rule fail a build rather than sit in a document. D-38 drifted across two stages
  with nothing to catch it (`docs/learnings/decisions-need-tests-101.md`).
- Give stage 04–18 a rule they can comply with rather than argue against, so the next dense
  stage does not relitigate this.
- Bring stage 03's panels under the threshold before the remaining port work makes them worse.

## Non-goals

- **Closing TD-12.** The audit `PAGES` list stays hand-written. This round adds a second
  hand-maintained list and should not pretend otherwise; the honest fix is deriving both from
  the step definitions, and that is its own task.
- **Re-cutting stages 01 and 02.** Their heavy panels are baselined as exceptions instead.
  Splitting them changes step hashes, which breaks deep links already shared, and reopens two
  stages that passed a whole-branch review. Rejected on cost, not on principle — the rule
  applies to them the moment either is edited.
- **A second navigation level** (grouping steps under HLD/LLD, which the doc's own table of
  contents already draws). Considered and rejected: it needs a new component, a new URL-hash
  scheme, and doubles the audit surface, and nothing else in the app has two levels. Revisit
  only if the flat rail proves unusable at fourteen steps.
- **Cutting what stage 03 teaches to fit.** Directly contradicts D-49 and would reopen TD-23
  deliberately.

## Constraints

- **D-49 holds.** Completeness beats length for stage 03; standard practice is the filter. The
  threshold may not be met by teaching less.
- **D-35 holds.** Every stage carries its AI step beyond the content steps.
- **Stage numbers are filing codes** (`CLAUDE.md`). Nothing here may re-imply a sequence, and
  eighteen stages is test-enforced.
- The rail already scrolls horizontally (`web/src/components/Stepper.tsx:98`), so step count
  degrades gracefully rather than breaking layout.

## Architecture

### The decision

**D-52, superseding D-38.** A step holds **one judgment**, and its panel does not exceed
**four screens at 1024×768**. Step count follows content. `PATTERNS.md`'s four-to-six becomes
the typical range for a stage, not a ceiling — a stage whose doc is genuinely fourteen sections
is expected to exceed it, and says so.

Four screens is picked from the data, not chosen for convenience: 01 and 02 both have a
next-heaviest panel at 3.2 screens, so the threshold clears every panel either stage has except
one each, with headroom. It is not tuned to let anything on stage 03 pass — six of nine fail.

### A defect the decision surfaces

`web/src/components/Stepper.tsx:128` renders the step number as `` `0${i + 1}` ``, which prints
`010` and `011` from the tenth step onward. Stage 03 crosses ten under this decision, so it has
to be fixed here rather than filed.

### Stage 03's shape

Two edits satisfy the threshold, and stage 03 needs both. **Split** where a panel holds two
genuinely different judgments — these are seams the doc itself draws, not new inventions.
**Compress** with the expand-to-reveal pattern already in `PATTERNS.md` where a panel is one
judgment that simply renders tall.

| Now | Screens | Becomes | Why |
|---|---|---|---|
| `reverse` | 3.2 | `reverse` | Under. Unchanged |
| `require` | 2.7 | `require` | Under, and grows with fitness functions and the ten-row trace. Watch |
| `model` | 6.0 | `model` + `interrogate` | Deriving the nouns and interrogating them are different acts |
| `shape` | 7.1 | `shape`, compressed | One judgment — which shape — rendered tall. Styles landscape goes expand-to-reveal |
| `sketch` | 6.1 | `sketch` + `resilience` | What you depend on, then what happens when it is down |
| `schema` | 8.4 | `schema` + `concurrency` | Shape of the data, then what two writers do to it |
| — | — | `evolve` | Doc section 9, currently unported |
| `contract` | 5.3 | `contract` + `access` | The promise, then who may invoke it |
| `record` | 3.0 | `record` | Under. Grows with event sourcing and CQRS |
| `ai` | 4.7 | `ai`, compressed | One judgment. Eleven plays go expand-to-reveal |

**Thirteen content steps plus AI — fourteen.** Stated plainly because an earlier estimate in
conversation said twelve; recounting the splits gives fourteen, and the larger number is the
one to plan against.

`shape` is the panel most likely to need splitting after the compression is measured — it
carries three doc sections (4, 5, 6) and the argument that it is one judgment is the weakest on
this table. If it lands over four screens, it splits into `shape` and `boundaries`, taking the
stage to fifteen. Recorded now so that outcome reads as anticipated rather than as drift.

## Testing

A new e2e assertion in `web/e2e/audit.spec.ts`, since panel height needs a real browser and a
real build:

- Every step of every built stage is measured at 1024×768.
- Over four screens fails, naming the stage, the step and the measured height.
- `EXCEPTIONS` carries `01-product-discovery#record` and `02-planning#horizon` with their
  baselines and a one-line reason each.
- **An exception that improves must be re-baselined.** A panel measuring more than 0.5 screens
  under its recorded baseline fails too, with a message saying to lower it. The tolerance is
  there because panel height moves slightly with font loading and scrollbar width, and a rule
  that fires on noise gets suppressed. This is the part that stops the allowlist becoming what
  D-38 was: a number nothing enforces, drifting upward unobserved.

Teeth check: pad a passing panel with filler until it crosses four screens, confirm that panel
and only that panel fails; then lower a baselined exception and confirm the re-baseline branch
fires.

Unit-level, the existing suites cover the content moving between steps. Each split step keeps
its data in the same module, so `scoring.test.ts`, `schema-blocks.test.ts` and `ddl-sync.test.ts`
continue to hold without change.

## Verification

- `pnpm test` — full vitest suite green.
- `pnpm test:e2e` — 11 existing tests plus the new one, over the widened `PAGES`.
- `pnpm lint`, `pnpm typecheck`, `pnpm format:check`.
- Every new step hash added to `PAGES` by hand (**TD-12**), and the dead-hash guard added in
  `214bce0` confirms each resolves to the step it names.
- Browser pass on the new steps: 320→2560px, both themes, contrast and touch targets.
- Re-run the panel measurement and paste the table, so the decision's own claim is evidenced
  rather than asserted.

## Documentation updates

- `docs/tracker.md` — D-52 appended; D-38 marked superseded with its reasoning kept, per the
  append-never-edit convention. TD-12 re-stated to note it now governs two hand-written lists.
- `web/PATTERNS.md` — four-to-six reframed as typical rather than a ceiling; the panel rule and
  its threshold documented where a stage author will meet it.
- `docs/stage-03-status.md` — the step-count task ticked with the new shape; the section-9 and
  five-cluster tasks re-pointed at their new steps.
- `KICKOFF.md` — project state refreshed with the new step count.

## Risks

- **Fourteen tabs is a long rail.** It scrolls, and the active tab is scrolled into view, but
  no stage has tested that count. If it reads badly, the fallback is the two-level navigation
  rejected above — which is a larger change made under time pressure, and that is the risk.
- **Compression can hide content.** Expand-to-reveal satisfies the threshold by moving material
  behind a click, and a stage that collapses its teaching stops teaching it. The check is that
  what collapses is *elaboration*, never the judgment a step exists to provoke.
- **The exception list is a place defects hide** (D-47's pattern). Two entries today, and every
  entry is a stage exempt from the rule the project just wrote down. The re-baseline branch is
  the mitigation; it is not a guarantee.
- **Splitting steps changes hashes.** Stage 03 is unmerged and undeployed, so no external link
  breaks — this risk is real only if the split is deferred past a merge.
