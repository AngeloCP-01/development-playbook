# Stage 05 — implementation status

**What this is:** the coverage map for stage 05, doc against app, section by section. It
exists for the reason stage 04's does — a stage and its port drift, and the drift gets
discovered rather than tracked — and this round is the second time the check earned its
place. A read-only coverage walk, given only the doc and the code and none of this branch's
plan or reports, found ten sections whose material eleven per-task reviews and a fully green
gate had let through. Nine are closed below; the tenth is a deliberate deferral, not a miss.

**Last verified:** 2026-08-19, on `feat/stage-05-app-port` at `6cdc2c4`, after the coverage
walk's fix wave and a full verification pass.

**Current state:** doc **six `##` sections, twelve `###` ones, 587 lines**. App **thirteen
steps**. 645 tests across 80 files; a 17-test audit suite over **76 derived URLs** (the
63 stage 04 and earlier carried, plus stage 05's own thirteen). Lint, typecheck and
`format:check` clean. `reference/glossary.md` regenerated with no diff — seven new terms
(`server-component`, `client-component`, `server-action`, `feature-flag`, `zod`,
`error-boundary`, `rebase`) and ten `<Term id>` uses total across the stage, the other three
reused from earlier stages (`authorization`, `definition-of-done`, `vertical-slice`).

**Both provisional splits survived measurement, and this is only the second time that has
happened in this repo.** `steps.ts` authored `drill` and `boundaries` as separate from
`reads` and `action`, to merge if the arithmetic said so once real content replaced the
placeholders. It didn't. `action` measured **3.16** before `boundaries` had any content,
closing that merge off on its own; `boundaries` then measured a genuinely thin **0.96**,
and folding it into `action` would have pushed the combined panel over the round's 3.2
target with nothing gained. `reads` and `drill` combined measure **6.24** — nearly double
the target — so that merge was never close. Stage 04's four provisional pairs were the
first seam in this repo to survive unchanged; stage 03 had to re-cut five of its six.
Stage 05 makes it two.

---

## Panel weight

Measured at 1024×768 with the audit's method (`#panel-<id>` bounding height ÷ 768), after
the coverage walk's fix wave landed.

| Step | Screens | Step | Screens |
|---|---|---|---|
| `loop` | 2.14 | `boundaries` | 0.96 |
| `server` | 2.66 | `states` | 3.06 |
| `thin` | 2.71 | `commits` | 2.42 |
| `action` | 3.16 | `ai` | 1.35 |
| `callers` | 2.35 | `checklist` | 1.79 |
| `reads` | 2.42 | `traps` | 2.92 |
| `drill` | 3.82 | | |
| | | **median** | **2.42** |
| | | **max** | **3.82** |

`drill` is the one panel over this round's 3.2 aspiration — under the enforced 4.0 ceiling,
with no `PANEL_EXCEPTIONS` entry needed. It stays that height on purpose (Ruling O): D-52's
own rule caps a panel holding *two* judgments, not one judgment repeated across a scored
set, which is what `drill` is. Roughly half its height traces to one snippet
(`button-caller`, 47 code lines against 3–8 for the other five) that grew deliberately, on
instruction, to fix a scoring defect a reviewer found — the trade was made once and stands.
`boundaries` measures 0.96 because its doc section is short — eighteen lines, the only one
in `## The work` with no code fence at all. Every clause is present; there is simply less
of it than the median panel carries.

---

## Coverage, doc against app

Nine of the ten gaps the coverage walk found are closed here; each is marked. The tenth,
N9, is the front-matter row below, which turned out not to be a defect at all.

| Doc section | App | Notes |
|---|---|---|
| Front matter — blockquote | `blurb` (partial, by design) | **Not a defect** — D-36 governs; see below |
| `## Entry criteria` | `loop` | Full. Both criteria in prose, now linked to stages 04 and 02 (**N10** closed) |
| `### The loop` | `loop` | Full. Fig 1 via `LoopFlow`, a seven-node click-through, four stage links across three handoffs (06/07/12/13), `Term id="feature-flag"` |
| `### Vertical slices` | `loop` | Full. `Term id="vertical-slice"`, a Horizontal/Vertical `Contrast` on the doc's own user-profiles example, and the schema-narrowing paragraph — the 03/04 handoff and "change the schema for the one case you are shipping" — restored (**N2** closed) |
| `### Server Components by default` | `server` | Full. `ARTIFACTS.invoicesPage` annotated; Fig 2 via `ClientBoundary`, a five-node tree proving prerendering stays true regardless of where `'use client'` moves; the four-item interactivity test — event handlers, state, effects, browser APIs — restored in full, "effects" included (**N3** closed); the three session-strategy options behind the `requireUser` note restored (**N7** closed) |
| `### Keep route files thin` | `thin` | Full. `billingPage`, `getInvoices`, `invoiceTable` (behind a reveal), the ordinary-function-vs-buried-in-a-route contrast; the query-then-component stitch back to the vertical slice restored (**N8** closed) |
| `### Server Actions need validation and authorization` | `action`, `callers` | Full. `updateInvoice` annotated (owner-in-the-`where` pivot); four reveal rows for authenticate/validate/authorize/return-not-throw; `amountForm` and `retryButton` as the two callers, with the retry button's incompleteness now stated rather than left implicit (**N1** closed) |
| `### Authorize reads, not just writes` | `reads`, `drill` | Full, and the best-covered section in the stage either way: `getInvoice` and `invoiceDetailPage` annotated, a scope-vs-filter `Contrast`, then `AuthorizationDrill` — six snippets, both verbs, lock-before-reveal, scored |
| `### Types at the boundaries` | `boundaries` | Full. A four-row `RevealList` — HTTP bodies, env vars, third-party responses, database rows as the trusted exception; the dead "(04)" fossil replaced with a real link to stage 04 (**N4** closed) |
| `### Loading and error states` | `states` | Full. `loadingFile` and `errorFile` annotated, `unstable_retry` vs. `reset` carried as a pivot note, a Thrown/Returned `Contrast` for expected vs. unexpected failure |
| `### Commits and branches` | `commits` | Full. The doc's commit message quoted inline, `Term id="rebase"`, the two-day rule restated from the branching end |
| `### When you get stuck` | `commits` | Full. Four reveal rows (`STUCK_MOVES`), each with a "why it works" facet |
| `### Keep the feedback loop running` | `commits` | Full. `feedbackLoop` artifact, all four commands verbatim |
| `### AI in development` | `ai` | Full. `AI_PREMISE` and `AI_LIMIT` verbatim, six plays; the Superpowers-plugin attribution behind two of them restored (**N6** closed) |
| `## Artifacts` | `checklist` | Full. `ARTIFACT_ITEMS`, all four, rendered as a short list above the checklist rather than a second worksheet (Ruling A) |
| `## Definition of done` | `checklist` | Full. Eleven checkboxes verbatim, persisted per slug; the doc's own two-part split — before the PR, then after the preview builds — restored rather than flattened into one list (**N5** closed) |
| `## Scaling to a team` | `checklist` | Full. `TEAM_MOVES`, all four, each expanded past the doc's one-liner |
| `## Traps` | `traps` | Full. All eight, in doc order, as `Callout kind="trap"` |

---

## Not ported, deliberately

- **The front-matter blockquote (N9) — not a defect, and the reason this row was first
  written is wrong.** The audit is right that "Small improvements here compound harder than
  anywhere else in the playbook" and "this is where most of your hours go" are absent. The
  original entry here said no stage's app carried its blockquote, so this was a cross-stage
  question rather than a stage-05 defect. **Three stages carry it verbatim** — `01`, `02`
  and `03`'s `blurb` is the doc's `>` line character for character. The claim came from
  checking stage 04, which paraphrases, and generalising one silence into a rule.

  What actually governs is **D-36**, which closed TD-2 in July on this exact question: the
  blurb is "two purpose-built strings (doc subtitle vs UI tooltip) that diverge for 15/18
  by design", so `stage-metadata.test.ts` syncs the title only. `blurb` was never meant to
  carry the whole blockquote, any more than `cadence` is meant to carry `timing`. Under
  D-36 this is the convention working, not failing. **D-81** records the correction.

---

## What holds the port to the doc

Six data modules read `docs/05-development.md` at test time through `src/test/doc-source.ts`
— the shared factory stage 05 pulled out of stage 04's version rather than writing a third
copy, extracted before this stage's first file existed.

`artifacts.ts` holds its twelve blocks **character-for-character** against the doc's fenced
code, compared whole with `toBe` rather than by containment (**D-66**) — `toContain` cannot
see a truncated artifact, and the two pivots the whole stage turns on (the owner in
`updateInvoice`'s `where`, `unstable_retry` in `error.tsx`) are pinned as literals rather
than read off the data.

`snippets.ts` is the one module with no doc anchor. Four of its six snippets are wrong on
purpose and appear nowhere in the doc, so no sync test can hold them — their correctness
rests on review, and two rounds of it: the first found the check-then-write verdict's
reasoning was disprovable even though its conclusion was right, and found a caller snippet
whose verdict punished a correct reading of the code it showed. Both were fixed in the data,
not the prompt.

`term-usage.test.ts`, written during this stage's final task, is not scoped to stage 05 at
all — it scans every `.tsx` under `src/` for `<Term id>` against `TERMS` and holds all
eighteen stages to it going forward, closing the class of defect where a term id degrades
silently to plain text with nothing failing.
