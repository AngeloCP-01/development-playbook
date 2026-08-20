# Stage 05 — Development: app port (W-3.5b)

**Date:** 2026-08-19
**Branch:** `feat/stage-05-app-port`, cut from `develop`
**Milestone:** `W-3.5b` in `docs/task.md:613` — the only unchecked item under W-3.5

---

## Problem

`docs/05-development.md` is corrected and merged (`9ef3763`), and the app does not render
it. `05-development` is `ready: false` at `web/src/lib/stages.ts:71` and absent from
`STAGE_CONTENT` (`web/src/features/stage-content.ts:11`), so the route serves the "sheet
not drawn" placeholder. W-3 stays at 4/18 until this lands.

The doc round deliberately merged before the port started (**D-74**), so what the port
builds against is fixed and on `develop`. There is no moving target here, which is the
whole point of merging first.

Stage 05 is the most code-dense doc ported so far. It carries **fourteen fenced blocks
across 587 lines**, against stage 04's nineteen across 711. A rendered code line costs
20px in `AnnotatedArtifact`, so code is the dominant term in panel weight, and the seam has
to be cut on that rather than on section count.

The doc's own loudest claim sets the stage's central exercise:

> Step 3 is the one people omit, and in this playbook's experience it is the most common
> serious security bug in App Router applications.

`web/PATTERNS.md` is explicit that a stage turning on a decision has to make the reader
commit to an answer before the reasoning appears. A paragraph asserting that step 3 gets
omitted does not teach a reader to notice it missing.

---

## Goals

1. `05-development` renders interactively, `ready: true`, registered in `STAGE_CONTENT`.
2. Every one of the doc's eighteen headings is carried by a named panel, or listed as not
   ported with a reason. The coverage table is the deliverable, not a by-product.
3. The reader performs the authorization judgment rather than reading about it.
4. The twelve code blocks a reader is meant to paste are held to the doc
   character-for-character, so a drifted block fails the suite rather than the reader.
5. Both extractions land before any stage 05 content, with stage 04 green either side.

---

## Non-goals

- **A nineteenth stage, or any renumbering.** Rejected three times already; eighteen is
  test-enforced.
- **Migrating stage 01–03's hand-rolled disclosures onto `RevealList`.** `PATTERNS.md`
  records that each keeps a single row open where `RevealList` allows many, so converting
  one is a behaviour change needing its own decision. Not this round's.
- **Closing TD-34** (`RevealList` hardcodes `<h3>` for row headings). Stage 05 will inherit
  the flat outline like every other caller. Fixing it touches twelve instances across two
  shipped stages and belongs in its own branch.
- **Syntax highlighting in `AnnotatedArtifact`.** The `language` field is carried and
  unused for colour today. Stage 05 adds `'tsx'` to the union and nothing else. Highlighting
  is a real want and a different problem, and doing it here would make the extraction task
  a rewrite rather than a move.
- **A `references.ts` audit across stages 01–04.** Stage 05 adds its own entry only.
- **`pnpm test:prod`.** It checks the deployed site. Nothing in this round is deployed.

---

## Constraints

- **`main` is production.** This branch merges to `develop`, and only after you say so.
- **TDD, no exceptions.** Failing test first, RED output in the task report with a
  statement of why it failed for the right reason.
- **Panel ceiling.** `PANEL_SCREENS_MAX = 4.0` at 1024×768 is enforced by
  `web/e2e/audit.spec.ts:518`. This round targets **3.2**, which is stage 04's working
  number and the next-heaviest panel in stages 01 and 02. No new `PANEL_EXCEPTIONS` entry.
- **One judgment per step** (**D-52**). The count follows from the panel, never the reverse.
- **`### AI in development` is mandatory** (**D-35**). It already exists in the doc, so the
  port inherits it. `stage-metadata.test.ts` fails any built stage missing the heading.
- **`terms.ts` is the single glossary source.** New terms mean `pnpm gen:glossary`.
  `reference/glossary.md` is never hand-edited.
- **No `@testing-library/jest-dom`, no `user-event`.** This project installs neither.
  `fireEvent` plus plain DOM assertions, as `src/components/RevealList.test.tsx` does.
- **Route types are generated.** Typecheck through `pnpm typecheck`, never bare `tsc`.

---

## Architecture

### Wave 0 — two extractions, before any stage 05 file exists

**`AnnotatedArtifact` → `src/components/`.** It currently lives at
`web/src/features/setup/AnnotatedArtifact.tsx` with its types in
`web/src/features/setup/artifacts.ts:1-14` and its client bits in
`ArtifactControls.tsx` (`OverflowFocus` at :35, `CopyArtifact` at :70). Stage 05 needs all
of it.

Moves:

- `src/components/AnnotatedArtifact.tsx`
- `src/components/ArtifactControls.tsx`
- `src/components/artifact.ts` — the `Artifact` and `ArtifactLine` types, with `language`
  widened from `'json' | 'jsonc' | 'yaml' | 'ts' | 'bash'` to include `'tsx'`

Stays: `features/setup/artifacts.ts` keeps stage 04's nineteen blocks and imports the type.
`AnnotatedArtifact.test.tsx` moves with its component and must stay green **unchanged** —
if it needs editing, the move stopped being a move.

*Rejected: cross-feature import* (`features/development/` importing from `features/setup/`).
Cheapest, and it makes stage 04 load-bearing for stage 05 without saying so anywhere. The
repo has no other feature-to-feature edge.

*Rejected: a stage-05-specific line inspector.* `AnnotatedArtifact` was derived from
`SchemaInspector` (`src/features/architecture/SchemaInspector.tsx:54`) by removing
click-to-select, so building selection back in for stage 05 would fork the lineage rather
than extend it. The selection interaction stage 05 wants is the drill, which is a different
component with different data.

**`doc-source` → a shared factory.** `web/src/features/setup/doc-source.ts` reads
`docs/04-project-setup.md` at module load and exports `DOC` (:23), `section` (:58), `h2`
(:63), `flat` (:82) and `fences` (:97). Stage 03's eight test files each hand-roll
`readFileSync` instead. Stage 05 would be the third generation.

Its own docblock is the argument for not copying it again:

> The plan asked for one shared helper at the head of Wave 1 and said so; four
> implementers working from their own task slices each wrote their own... the copies had
> *diverged*: only the `h2` pair carried the line-anchoring fix, so three modules were
> still cutting sections with an unbounded `indexOf` — the exact bug the traps module had
> already found and fixed.

New: `src/test/doc-source.ts`, exporting `docSource(relPath)` returning
`{ DOC, section, h2, flat, fences }`. Stage 04's module becomes a one-line call. The three
comment blocks explaining *why* each function is shaped the way it is move with the code —
they are the record of three bugs and are worth more than the code.

Stage 03's eight files are **not** migrated. Out of scope, and touching eight test files in
a shipped stage buys nothing this round needs.

### Wave 1 — data modules, `src/features/development/`

| Module | Holds | Held to the doc by |
|---|---|---|
| `steps.ts` | the thirteen-id tuple | `steps.test.ts`, ordered literal |
| `artifacts.ts` | twelve of the fourteen fenced blocks | `toBe` one whole fence (**D-66**) |
| `snippets.ts` | six drill snippets, verdicts, reasoning | authored — see Testing |
| `traps.ts` | `## Traps`, **8** entries | count and titles verbatim |
| `checklist.ts` | `## Definition of done` (**11** boxes), `## Artifacts` (**4**), `## Scaling to a team` (**4**) | checkboxes verbatim |
| `ai-plays.ts` | `### AI in development`, **6** plays with `kind` | bullet count read from the doc |
| `loop.ts` | the loop's stages | the pseudo-block |

Every count above was read out of the doc, not carried from a plan. Stage 03 shipped a
brief claiming eleven AI plays where the doc had nine, which is why `ai-plays.test.ts`
counts the doc's bullets rather than trusting a literal.

Two of the fourteen blocks are not artifacts: the loop pseudo-block becomes `loop.ts` and
feeds `LoopFlow`, and the commit-message block is quoted inline in the `commits` panel. The
remaining twelve, including the `pnpm dev` bash block, are `Artifact`s.

### Wave 2 — components and panels

| Step | id | Doc sections | Pattern |
|---|---|---|---|
| 1 | `loop` | Entry criteria · The loop · Vertical slices | `LoopFlow` click-node inspector, `Contrast` for the cut |
| 2 | `server` | Server Components by default | `ClientBoundary` + the page artifact |
| 3 | `thin` | Keep route files thin | three artifacts in sequence, `RevealList` for the reasoning |
| 4 | `action` | Server Actions §1 — the three steps | the `actions.ts` artifact, `where` clause as pivot |
| 5 | `callers` | Server Actions §2 — form, retry button | two artifacts, `RevealList` |
| 6 | `reads` | Authorize reads, not just writes | two artifacts, `Contrast` |
| 7 | `drill` *(prov.)* | — | `AuthorizationDrill` |
| 8 | `boundaries` *(prov.)* | Types at the boundaries | `RevealList` |
| 9 | `states` | Loading and error states | two artifacts, `Contrast`, `unstable_retry` as pivot |
| 10 | `commits` | Commits and branches · When you get stuck · Keep the feedback loop running | artifact, `RevealList`, artifact |
| 11 | `ai` | AI in development | `AIPlays` |
| 12 | `checklist` | Artifacts · Definition of done | `DevChecklist` persisted worksheet |
| 13 | `traps` | Traps · Scaling to a team · references | `Callout kind="trap"` set, `TeamNotes`, `References` |

Thirteen against `docs/task.md:625`'s prediction of "well under fifteen". The prediction
was made on line count; the doc is denser than its length. If measurement disagrees,
`drill` merges into `reads` and `boundaries` into `action`, landing eleven. Both are
authored split because a merge undoes with a delete while a split costs new ids and every
reference to them — stage 04's practice, where four of fifteen were provisional and all
four survived.

**`### Server Actions` is split, and that split is not provisional.** At 141 doc lines and
three code blocks it is the heaviest section in any doc ported so far. Steps 4 and 5 hold
different judgments: what the endpoint owes, then what changes when a button calls it
instead of a form. Nothing changes, which is the lesson.

**The drill sits after `reads`.** It covers both verbs, and `### Authorize reads` is where
the doc generalizes past the verb, so the drill reads as synthesis rather than a quiz on
the step just finished.

Three components are new builds:

- **`AuthorizationDrill`** — six snippets, each marked safe or unsafe, locked before the
  verdict, scored across the set. `PATTERNS.md`: a revealed answer the reader did not
  commit to teaches nothing.
- **`ClientBoundary`** — the reader moves `'use client'` up and down a small tree and sees
  what crosses to the browser. This is where the doc corrects a live misconception, that
  the directive means "not rendered on the server" when Client Components are still
  prerendered. A paragraph does not dislodge a belief the reader arrived with.
- **`LoopFlow`** — click-node inspector over the loop's stages, each node linking out to
  the stage that owns it.

`AIPlays` and `DevChecklist` follow the established per-stage shapes rather than being
extracted; stages 01–04 each hold their own, and a fifth copy is the existing convention
rather than new drift.

### Wave 3 — terms, references, measurement

Roughly eight new `terms.ts` entries: `server-component`, `client-component`,
`server-action`, `feature-flag`, `error-boundary`, `revalidation`, `rebase`, and
Zod-as-boundary-parsing. Existing entries already cover `vertical-slice`, `authorization`,
`definition-of-done`, `yagni` and `pnpm`. Then `pnpm gen:glossary`.

`05-development` has no `references.ts` entry. Three to five links, each stating what it
adds beyond the stage, each opened in a real browser — `PATTERNS.md` notes some publishers
403 command-line requests while serving people fine.

---

## Testing

Failing test first, every task. RED output pasted in the report with the reason it failed
correctly.

**Data modules** (`unit`, node): each asserts against `docs/05-development.md` through
`docSource`. Artifacts use `toBe` against a whole fence rather than `toContain` — a
substring of a block is still contained, so containment cannot see an artifact that lost
its last line (**D-66**).

**Render tests** (`dom`, jsdom) for the components that derive what they display:
`AuthorizationDrill`, `ClientBoundary`, `LoopFlow`, `AIPlays`, `DevChecklist`.
`AnnotatedArtifact.test.tsx` moves unedited.

**The drill's data has no doc anchor, and that is deliberate.** Four of its six snippets
are wrong on purpose and appear nowhere in the doc, so no sync test can hold them. Two
consequences:

1. Their correctness rests on review, and the per-task reviewer is told so explicitly.
2. **The verdict assertion must not read the same field the render reads.**
   `stage-implementation-101.md` names this hole: a render test comparing
   `getAttribute('data-safe')` to `String(snippet.safe)` moves its expectation with the
   data and proves nothing. The test asserts a literal — *exactly two of the six are safe,
   and they are the scoped-query pair* — so flipping any snippet's verdict reddens it.

**Teeth check** on every fix: break the implementation again, confirm the new test and only
that test fails, and confirm the mutation actually landed in the file before trusting the
run. `perl -0pi -e` without `/g` replaces the first occurrence, which on this repo has
already been a docblock rather than the JSX.

---

## Verification

The three passes from `CLAUDE.md`, against a live build on a freshly started server:

- **Contrast** — every distinct text/background pair, both themes, all thirteen steps, AA.
  Expand every `Term` panel first, or the popover surfaces are missed. The colour parser
  must resolve `oklab()`.
- **Responsive** — 320→2560px, no horizontal overflow, no sub-44px touch target below `lg`.
- **Console** — zero errors in a clean context, not a hot-reloaded one.

Then the ones specific to a port:

- **Panel measurement at 1024×768**, the exit condition of every content task. This is what
  decides whether `drill` and `boundaries` merge. Nothing else decides it.
- **The coverage table** — `docs/stage-05-status.md`, a row per doc heading naming which
  panel carries it and what specifically, with a "not ported" list carrying reasons.
  **Walked by a dispatched reviewer, not by me.** The session that wrote the panels is the
  worst reader of them, because it remembers intending to cover things. This check found
  five silently-dropped sections in stage 04 that a green gate of 518 tests, a 17-test
  audit and five closed reviews could not see.
- **A median-panel sanity read.** Stage 04's median was 1.74 screens against stage 03's
  3.02, and that gap was content that had gone missing rather than a finer seam. A stage
  measuring well under its comparable is a signal to go looking.
- **Raw backticks in the built HTML.** `InlineCode` renders them; anything rendering a data
  string outside it does not. Grepping the built output is still the only method that finds
  these.
- `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build` on the merged result.

---

## Documentation updates

- `docs/stage-05-status.md` — new, the coverage table
- `docs/task.md` — W-3.5b checked, W-3 to 5/18
- `docs/tracker.md` — the W-3.5b row with evidence, new decisions, a `Deferred:` list
- `web/PATTERNS.md` — `AnnotatedArtifact`'s section moves from a `features/setup/` path to
  `src/components/`, and the safe/unsafe drill is a new row in the pattern table if it
  proves reusable
- `reference/glossary.md` — regenerated, never hand-edited
- `humanizer:humanizer` over this spec, the plan body, and the status doc

---

## Risks

**Wave 0 touches shipped code before this stage has a line of its own.** Two extractions
across stage 04's component, its three test files and its data module. Mitigated by
ordering: it goes first, so a failure is loud and early rather than tangled with new
content. `AnnotatedArtifact.test.tsx` staying green unedited is the check that the move was
a move.

**Thirteen steps may be wrong in either direction.** The provisional splits handle "too
many". "Too few" is the harder failure and looks identical to success, because a thin panel
and a complete panel both pass. The median-panel read and the coverage table are what catch
it, and both run before the port is believed.

**The drill is the only unanchored data in the stage.** Nothing can prove its snippets
teach the right thing. Named here so a reviewer reads it as the exception rather than
assuming the sync tests cover it.

**Code blocks were already wrong once, in the source.** The doc's own round found that its
blocks were excerpts with imports and callers stripped, and that a cold reader could not
produce one compiling file. The corrected doc fixed that. If an artifact is transcribed
rather than lifted, the port reintroduces the defect the doc round just closed — which is
why `toBe` against a whole fence, not `toContain`.

**Two Next-version claims in this doc are the kind that read as correct.** `unstable_retry`
against the remembered `reset`, and Client Components being prerendered. The doc round got
both right and got them right the hard way: a whole-branch review caught a *false claim a
per-task review's own fix had introduced* about `reset` being undefined. Check both against
`node_modules/next/dist/docs/` when porting `states`, and do not transcribe a subagent's
reasoning because its conclusion is right.
