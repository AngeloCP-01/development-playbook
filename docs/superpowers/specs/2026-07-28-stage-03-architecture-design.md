# Stage 03 — Architecture (W-3, second stage) — Design

**Date:** 2026-07-28
**Scope:** `docs/03-architecture.md`, `web/src/lib/`, `web/src/features/architecture/`,
`web/src/features/discovery/`, `web/e2e/`
**Status:** Approved (brainstorming) → pending implementation plan
**Round:** W-3 from `docs/task.md`, second stage in the revised order (D-27)

## Problem

Stage 02 hands off to a placeholder. Its spike step tells the reader a feasibility
question ends in a written decision, and the risk it teaches by example — an auth choice
that reshapes the data model — is explicitly deferred to stage 03. Follow that pointer and
you land on "sheet not drawn": `03-architecture` is absent from `STAGE_CONTENT`
(`web/src/features/stage-content.ts:9-12`) and `ready: false` in
`web/src/lib/stages.ts:50`.

Stage 03 is also the audience gap D-37 named. Cold-reader testing found stage 02
developer-complete but deliberately not serving solutions architects; stage 03 is where
that reader's work actually lives. It is the densest stage in the playbook and the most
diagram-friendly, which makes it the first real test of whether the pattern library
generalises past the two stages that produced it.

Two smaller problems ride along, both found while reading rather than reported.

**`docs/03-architecture.md` has no `### AI in architecture` section.** D-35 made that
mandatory for all eighteen stages and `web/PATTERNS.md:49-53` records it as standard rather
than drift, but the doc jumps from "Write the ADRs" (`docs/03-architecture.md:162`) to
"Defer aggressively" (`docs/03-architecture.md:170`). Stage 02 carries one at
`docs/02-planning.md:170`. So this round is doc work as well as app work.

**TD-13 is forced open by this stage.** Stage 02 ports its "Scaling to a team" section into
the app as a collapsed disclosure; stage 01 dropped its equivalent. Stage 03's team section
is the strongest of the three — Conway's law, boundaries becoming social, the point at
which splitting services is finally justified — so the stage cannot quietly duck the
question the way a thinner one could.

**The audit suite does not sweep ready stages automatically.** `web/e2e/audit.spec.ts:8-24`
is a hand-written `PAGES` array. The kickoff describes it as sweeping every ready stage;
that is wrong, and believing it is how a stage ships unaudited while CI stays green.

## Goals

- Stage 03 renders interactive: six stepper steps, nine numbered figures, three judgment
  exercises (`ReversibilityTable`, `ModelInterrogation`, `SplitTrigger`), one persisted
  worksheet, three to five verified references.
- The reader leaves with a domain model they wrote — entities, relationships, and an answer
  to each of the four interrogation questions the doc poses.
- The four questions that have defensible answers are taught as a scored exercise on the
  doc's invoice domain, before the reader applies them to their own.
- Stage 02's plan carries forward: its slices name the nouns, its risks name the decisions
  that need an ADR.
- `docs/03-architecture.md` gains `### AI in architecture`, tuned to this stage rather than
  restating stage 02's.
- TD-13 closes: team content ships as a collapsed disclosure in every stage, and stage 01
  is retrofitted this round so the precedent is uniform rather than asserted.
- Seven new glossary terms enter `terms.ts`; `reference/glossary.md` is regenerated, never
  hand-edited.

## Non-goals

- **No ADR worksheet.** The stage names three artifacts and stages 01 and 02 each ship
  exactly one persisted sheet. The domain model is the doc's own claim about what outlives
  every other decision, so it takes the slot. ADRs are taught through `ADRAnatomy` and a
  copyable template instead, which is enough given the format itself belongs to stage 10.
- **No SQL execution, validation, or schema diffing.** `SchemaInspector` explains a fixed
  DDL block. A schema the reader can edit and have checked is a different product, needs a
  parser, and teaches nothing the annotated version does not.
- **No ADR format deep-dive.** `docs/03-architecture.md:165` already defers format to
  `docs/10-documentation.md`. Duplicating it here would create exactly the drift D-36 just
  finished closing elsewhere.
- **TD-11 (design-token names) and TD-14 (card widths) stay open.** Both are polish passes
  across every stage. Doing them inside a stage build hides them in a large diff and
  settles a stage-wide convention from one stage's evidence.
- **No drag-and-drop sort for the reversibility exercise.** Sorting is the doc's verb, but
  drag is the worst pattern available for keyboard and touch, and `PATTERNS.md:155-161`
  makes both non-negotiable. Per-row commitment scores the same judgment.

## Constraints

- `PATTERNS.md:46-53`: four to six content steps plus one mandatory AI step. Stage 03 takes
  five plus AI, for six total.
- `PATTERNS.md:151-166`: real semantics, keyboard and touch first, ≥44px targets below
  `lg`, `aria-live` on anything that swaps in place, collapsed by default.
- React 19 forbids `setState` in an effect body. Persisted state goes through
  `useLocalStorage`, which uses `useSyncExternalStore` for this reason
  (`web/src/lib/useLocalStorage.ts:59`).
- Stepper panels are siblings, not a parent chain. Cross-step reads go through storage, not
  props — the constraint `PlanWorksheet.tsx:18-21` documents.
- `Figure` captions are JSX attributes: typographic quotes only. Inline `<Term>` needs
  explicit `{' '}` around it or the surrounding spaces get trimmed. Both shipped as bugs
  once.
- `terms.ts` is the single glossary source. `reference/glossary.md` is generated by
  `pnpm gen:glossary` and guarded by a file snapshot.
- Verification runs against a production build, not assertions.

## Architecture

### Part A — the content amendment, first

`docs/03-architecture.md` gains `### AI in architecture` as the final subsection of "The
work", after "Defer aggressively". Placement is deliberate: the section's sharpest warning
is that agents default to the exact complexity the defer list tells you not to build, and
that lands hardest immediately after the list. It also puts the doc's AI section last and
the app's AI step last, so the two orders agree — stage 02's do not, without consequence so
far, but there is no reason to repeat it.

Content, tuned to architecture rather than restating stage 02's:

- **Generate the option set** you would not have listed yourself, then discard most of it.
  A model's over-generation is useful when the failure mode is a decision made without
  knowing the alternatives existed.
- **Pressure-test a reversibility claim.** "This is cheap to undo" is a claim with a
  falsifiable answer — ask what would have to change and how many callers touch it.
- **Read a schema for missing constraints.** Uniqueness scope and delete behaviour are
  mechanical to check and easy for a person to skip.
- **Draft the ADR's first pass** from your own notes, so the alternatives are recorded
  while they are fresh.

Where it misleads, which is the load-bearing half:

- It proposes microservices, queues, and caching layers by default, because those are what
  architecture writing on the internet is about. Every one is on the doc's defer list.
- It invents scale. Asked to design for growth, it will design for growth you do not have
  and cannot describe.
- Schema advice arrives confident and context-free — it does not know your compliance
  boundary, your budget, or that this table is financial.
- An ADR it drafts unsupervised reads plausibly while recording reasons you never had.
  That is worse than no ADR, because it is the plausible reconstruction
  `docs/03-architecture.md:167-168` warns about, except you now have it in writing eight
  months early and will trust it.

Definition of done gains no AI line — stage 02's does not either
(`docs/02-planning.md:327-338`), and the section is guidance rather than a checkable state.

The doc passes `humanizer:humanizer` before it is considered done.

### Part B — the shared domain sheet

`web/src/lib/architecture-sheet.ts`, mirroring `discovery-sheet.ts`:

```ts
export type DomainSheet = {
  entities: string    // nouns and relationships, before tables
  derived: string     // values computed rather than stored
  deletion: string    // what happens on delete, per entity
  uniqueness: string  // what must be unique, and in what scope
  decisions: string   // expensive decisions that need an ADR
}

export const ARCHITECTURE_KEY = 'playbook:architecture-worksheet'
export const EMPTY_DOMAIN: DomainSheet = { ... }
```

Five fields against `PlanSheet`'s five, and the first four are the doc's four interrogation
questions in the order the doc asks them. The fifth is where the stage's own output — the
list of decisions needing an ADR — accumulates.

The key is separate so the three stages never collide, which is the reason
`PlanWorksheet.tsx:12-14` gives for its own.

### Part C — the stage

`web/src/features/architecture/`, registered in `STAGE_CONTENT` against `03-architecture`,
with `ready: true` in `stages.ts`.

**Step 1 · Reverse** — *Sort decisions by reversibility · Defer aggressively*

Merged because they are one axis: what deserves thinking now. The doc's own argument
supports it — the defer list is the reversibility test applied to infrastructure.

- `ReversibilityAxis` (Fig 1) — the doc's two lists as a single axis, cost-to-undo rising
  left to right, with the expensive end bracketed. Static figure.
- `ReversibilityTable` — guess-then-reveal over six decisions, built on `CutTable`'s shape.
  The reader commits cheap or expensive per row before any verdict shows, and scores across
  the set. Two rows are chosen to be genuinely arguable. A set of six obvious ones would
  score well and teach nothing.
- `DeferredList` — expand-to-reveal over the seven do-not-build items, `ValidationLadder`'s
  shape. Each opens to three lines: the real problem it solves, why it is not yours yet,
  what it costs you today. The third line is the one the doc makes and most writing on the
  subject does not.

**Step 2 · Model** — *Model the domain first*

- `DomainSketch` (Fig 2) — the User → Client → Invoice → LineItem sentences drawn as
  nouns and relationships. Small by design; this panel is the heaviest in the stage.
- `ModelInterrogation` — the four questions, each locked before its verdict, scored 0–4.
  `QuestionLab`'s shape. These are the only questions in the stage with defensible answers,
  which is why the scored treatment belongs here and not on the reader's own domain.
- `DriftDiagram` (Fig 3) — a stored `is_overdue` column agreeing with `due_date` on Monday
  and disagreeing on Tuesday. The figure that makes "computed, here" stick.
- `DomainWorksheet` — the persisted output, structurally copied from `PlanWorksheet`: same
  field shape, same copy-as-markdown and clear, its own key.
- `ArchCarryForward` — renders above the fields. Seeds `entities` from stage 02's `slices`
  and `decisions` from its `risks`, read-only by construction: it destructures `value` off
  `useLocalStorage` and never calls `setValue` or `reset`, the property
  `CarryForward.tsx:12-18` documents and depends on. Seeding is offered, never forced, and
  each button disables once its target holds text.

The `risks` → `decisions` seed is labelled "Stage 02 — risks you logged" rather than
claiming the text is already a decision. It usually will not be; the point is that the
auth risk stage 02 taught by example is sitting there waiting to become an ADR.

**Step 3 · Constrain** — *constraints live in the database*

Split from Model because the doc teaches two different things. Modelling is nouns and
relationships; this is "application code has bugs, gets bypassed by scripts, and races with
itself" (`docs/03-architecture.md:77-79`).

- `SchemaInspector` (Fig 4) — the doc's `CREATE TABLE invoices` block with selectable
  lines, `OpportunityTree`'s click-node shape. Selecting a line explains what it buys:
  `UNIQUE (owner_id, number)` scopes invoice numbers per user rather than globally;
  `amount_cents integer` is money without float error; `CHECK (status IN …)` is a fixed set
  the application cannot bypass; `ON DELETE RESTRICT` fails loudly instead of cascading
  financial history away.
- `DeleteBehaviour` (Fig 5) — `CASCADE` against `RESTRICT` on the same delete, with what
  survives each. The doc calls cascading deletes on financial data one careless statement
  away from destroying records you legally need to keep, and the figure shows that
  statement running.

**Step 4 · Shape** — *Start with one application · Boundaries inside the monolith*

- `OneAppCosts` (Fig 6) — the four costs of distribution, paid on day one, against benefits
  that need a team to collect.
- `SplitTrigger` — guess-then-reveal over five candidate reasons to split a service out.
  Four are the doc's concrete triggers; the fifth is "it will scale better". The reader
  judges each before the verdict, and the fifth is the one the exercise exists for — the
  doc calls it a prediction, and usually a wrong one. Scored across the set.
- `BoundaryMap` (Fig 7) — click-node inspector over `features/{billing,clients,auth}`.
  Legal calls and the illegal cross-table query are drawn differently, with a second signal
  beyond colour. Selecting an edge explains the single rule that keeps a monolith from
  becoming a ball of mud.
- `TeamNotes` — the collapsed "If you are not solo" disclosure carrying the doc's team
  section. This is the TD-13 precedent, and it sits in Shape rather than at the end of the
  stage because every point it makes is about boundaries.

**Step 5 · Decide & record** — *Authentication · Write the ADRs*

Kept together because the doc joins them: "Whatever you choose, write the ADR"
(`docs/03-architecture.md:155`). Separating them leaves an ADR step with three paragraphs
and no worked decision, which is how ADRs come to read as bureaucracy.

- `AuthPaths` (Fig 8) — tabs over roll-your-own, managed provider, and library,
  `Toolkit`'s shape. Each states cost, risk, and what it does to your data model.
- Prose on authorization being the part people get wrong, linking to
  `docs/05-development.md#server-actions-need-validation-and-authorization`.
- `ADRAnatomy` (Fig 9) — expand-to-reveal over the five parts, each opening to the
  filled-in version of the auth decision just compared, plus copy-as-markdown of the blank
  template. Copy-artifact, `AIWorkflow`'s prompt shape.

**Step 6 · AI plays**

`AIArchitecturePlays`, mirroring `AIPlanningPlays` structurally and carrying Part A's
content. The doc and the app say the same thing, in the shape each medium wants.

### Part D — TD-13 and the stage 01 retrofit

`TeamNotes` is built in `architecture/` for stage 03, then a sibling disclosure is added to
stage 01's closing step carrying `docs/01-product-discovery.md`'s team section. Both use
the same collapsed shape stage 02 established. TD-13 moves to closed in the tracker with
the rule stated: team content ships as a collapsed disclosure in every stage.

The retrofit is deliberately the smallest possible change to a finished stage — one
component mounted in one step, no restructuring.

### New glossary terms

Seven, matching stage 02's count: `domain-model`, `derived-state`, `soft-delete`,
`join-table`, `monolith`, `authorization`, `database-constraint`.

`authorization` is written to contrast with authentication explicitly, because the doc's
point is that people conflate them and get the second one wrong. Existing `adr`,
`blast-radius`, `yagni`, and `spike` are reused, not redefined.

`pnpm gen:glossary` regenerates `reference/glossary.md`. It is never hand-edited.

### References

Four candidates, each picked to extend rather than repeat, and each verified in a real
browser before it ships — some publishers 403 command-line requests while serving people
fine. Final selection happens during implementation; these are the shortlist and the
reason for each.

- **Michael Nygard, "Documenting Architecture Decisions"** — the origin of the artifact
  this stage tells you to write, from the person who named it. Adds the format and the
  status lifecycle the stage defers to stage 10.
- **Martin Fowler, "MonolithFirst"** — the second lens on "start with one application",
  argued from teams who went microservices-first and regretted it. Adds evidence where the
  stage asserts.
- **Dan McKinley, "Choose Boring Technology"** — the innovation-token argument. Adds the
  budget framing the reversibility section implies but never states: you get a small number
  of interesting choices, so spend them deliberately.
- **Martin Fowler, "Who Needs an Architect?"** — the source of "architecture is the
  decisions that are hard to change", which is this stage's opening claim. Adds where the
  idea came from and its limits.

## Testing

TDD throughout. Pure logic goes in `web/src/features/architecture/scoring.ts`, tested
first, mirroring `planning/scoring.ts` and its test file.

RED before GREEN, with raw terminal output for both runs in the task report, and an
explicit statement that the failure was for the right reason. A teeth check on each fix:
break the implementation again and confirm that the new test — and only it — fails.

Covered by `scoring.test.ts`:

- Reversibility verdicts: every row has a verdict, the arguable rows carry reasoning that
  names the cost rather than restating the answer, and scoring counts a row correct only
  once committed.
- Interrogation answers: four questions, each with one defensible answer and a reason that
  is the doc's reason, not a paraphrase.
- Schema annotations: every selectable line in the DDL has an annotation, and no annotation
  points at a line that is not in the block.
- Boundary edges: every edge in `BoundaryMap` resolves to an explanation, and the illegal
  edge is marked as such in data rather than by styling alone.

Covered by existing invariant suites, which the new content must not break:

- `terms.test.ts` — the seven new terms, plus the existing unknown-id degradation and
  visuals-have-definitions invariants.
- `glossary.test.ts` — the file snapshot, after regeneration.
- `references.test.ts` — the 3–5 cap.
- `stage-metadata.test.ts` — doc H1 against `stages.ts`. Stage 03's title already matches;
  the test guards it staying that way.

`web/e2e/audit.spec.ts` gains six entries in `PAGES` — one per step hash. This is a manual
edit, not automatic, and it is the step most likely to be skipped.

## Verification

Against a production build on :3100, not assertions:

- **Contrast** — every distinct text/background pair, both themes, all six steps, WCAG AA.
  The colour parser handles `oklab()`; a 1.34:1 report is the parser, not the palette.
- **Responsive** — 320 → 2560px, no horizontal overflow, no sub-44px touch target below
  `lg`. `SchemaInspector` is the specific risk: twelve monospace lines with a 56-character
  longest line. It gets its own `overflow-x: auto` container, and 320px is checked directly
  rather than inferred.
- **Console** — zero errors in a clean browser context, all six steps.
- **Carry-forward** — filled in stage 02, then stage 03, in one session: seeds appear,
  buttons disable once the target holds text, and nothing writes back to
  `playbook:planning-worksheet`.
- **Deep links** — each of the six hashes loads its step directly, and the back button
  walks between them.
- `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm test:e2e`, `pnpm build` all clean.

A final whole-branch review before merge, not only per task.

## Documentation updates

- `docs/03-architecture.md` — `### AI in architecture` added; humanizer pass.
- `reference/glossary.md` — regenerated by `pnpm gen:glossary`.
- `docs/task.md` — W-3 per-stage checklist ticked for stage 03; the AI-plays tracker
  updated.
- `docs/tracker.md` — the shipped entry with evidence (commit, test count, what review
  caught) and its `Deferred:` list; TD-13 closed with the rule; a decision recorded for the
  five-plus-AI step count and the domain-model-over-ADR worksheet choice.
- `web/PATTERNS.md` — only if stage 03 produces a pattern stages 04–18 should copy. Not
  assumed in advance.
- `KICKOFF.md` — project state and next round refreshed after merge.

## Risks

**The Model panel is the heaviest in the app.** Four pieces: sketch, scored exercise,
drift figure, worksheet. Mitigated by keeping Figures 2 and 3 small, but if it reads long
in review the drift figure moves to Constrain, where it also fits.

**`SchemaInspector` at 320px.** Monospace DDL inside an interactive inspector is the most
likely source of horizontal overflow this stage will produce. It is the one component whose
narrow-width behaviour is designed up front rather than audited afterwards.

**The `risks` → `decisions` seed may carry unhelpful text.** Stage 02's risks field is free
prose about risk, not a decision list. Labelled honestly and editable; the alternative —
no second seed — makes the carry-forward thinner than stage 02's and loses the one thread
that ties the auth risk to its ADR.

**Six steps sets a precedent for fifteen more stages.** `PATTERNS.md` says four to six
content steps; this stage takes five. If later stages read that as a floor rather than a
ceiling, the app drifts long. The tracker entry states five as the choice for a dense
stage, not the new default.

**Retrofitting stage 01 reopens a finished stage.** Deliberately minimal — one component,
one mount point — and it is the reason TD-13 is closed rather than deferred a third time.
