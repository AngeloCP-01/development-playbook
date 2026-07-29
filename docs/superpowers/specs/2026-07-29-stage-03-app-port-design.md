# Stage 03 — Port the amended doc into the app (W-3.2) — Design

**Date:** 2026-07-29
**Scope:** `web/src/features/architecture/`, `web/src/components/`, `web/src/lib/`,
`web/PATTERNS.md`, `web/e2e/audit.spec.ts`
**Status:** Approved (brainstorming) → pending implementation plan
**Round:** W-3.2 from `docs/task.md`, closing TD-23

## Problem

W-3.1 rewrote `docs/03-architecture.md` and deliberately left the app behind (D-46).
The doc went from eight subsections to thirteen and from 300 lines to 902. The app is
still the six steps built in W-3, reverse · model · constrain · shape · decide · ai
(`web/src/features/architecture/Architecture.tsx:24-492`), mirroring a doc that no longer
exists. That divergence is TD-23, and this round closes it.

Four doc subsections have no counterpart in the app at all: "What this system has to be",
"The shapes a system can take", "Sketch the system", and "Design the API contracts".

**It is not only additions, and that is the half that is easy to miss.** `scoring.ts`
carries the judgment data, and W-3.1 corrected three of its sets:

- `INTERROGATIONS` holds four questions (`scoring.ts:105-146`); the doc now asks five. The
  new one asks whether every actor has the same rights over an entity, which is what
  decides whether a role is an entity, a column, or a relationship, and it feeds the
  authorization pattern the app does not teach either.
- `SCHEMA_LINES` (`scoring.ts:245-297`) annotates the invoices DDL. The statements are
  unchanged, but the doc now teaches two of its lines as choices rather than defaults:
  `uuid` over `bigserial`, and `date` versus `timestamptz`. `due_date` currently
  carries no annotation at all (`scoring.ts:277`).
- `BOUNDARY_EDGES` (`scoring.ts:312-337`) shows three calls, all reads. The doc's
  "applies to writes as much as reads" has no edge.

`AIArchitecturePlays` is four helps and four misleads (`AIArchitecturePlays.tsx:37-81`)
against the doc's seven and five. One of its four helps restates the reversibility test
verbatim (`AIArchitecturePlays.tsx:46`). The doc has since promoted that test out of the
AI section and into "Sort decisions by reversibility", where the app never picked it up.

A port that only added components would leave the app asserting things the doc has
corrected, which is worse than the app being merely incomplete.

**The step structure has to be settled before any of it.** D-38 caps a dense stage at five
content steps plus the AI step (`docs/tracker.md:106`). Stage 03 was already at that
ceiling and the doc added five sections. D-46 records that W-3.2 must supersede D-38 with a
new ceiling and a reason, and that "stage 03 is special" is not one, because stage 04 will
make the same argument.

**14 glossary terms are defined and unused.** W-3.1 took `terms.ts` from 42 to 56 terms.
None of the 14 new ones is wrapped in a `<Term>` anywhere; the app's inline vocabulary is
still the ten terms stage 03 shipped with.

## Goals

- Doc and app agree about what stage 03 contains. TD-23 closes.
- Nine steps, one per doc movement, with the four missing subsections built.
- Every correction in `scoring.ts`, `AuthPaths`, `DeferredList` and `AIArchitecturePlays`
  lands, so no surface of the app contradicts the doc.
- D-38 is superseded by a rule that constrains what a step *contains* rather than how many
  there are, stated so that stage 04 has to argue rather than cite.
- All 14 unwired terms appear inline at their first use.
- The reader can answer the doc's fifth interrogation question, choose architecture
  characteristics and see what each one forces, read a container view and say what happens
  when each external system is down, and pick an authorization pattern per entity.
- `e2e/audit.spec.ts` sweeps all nine steps.

## Non-goals

- **Re-running the cold-reader pass.** It validates a stage *doc* against a beginner using
  it as intended (`docs/learnings/cold-reader-testing.md`). This round does not touch the
  doc, so a re-run would re-measure W-3.1's work and report W-3.1's result.
- **TD-19 (roving tabindex on scored radiogroups).** This round adds a scored radiogroup
  (`AuthzPatterns`), which makes the debt one row worse, but TD-19's own entry says the
  fix lands once across every scored exercise in three stages, not per stage. Adding
  `AuthzPatterns` to the list it already names is honest; fixing it here is a different
  round with a different review surface.
- **TD-20 (live regions mount populated).** Same reasoning, same shared fix.
- **Changing `docs/03-architecture.md`.** If the port surfaces a doc defect, it is recorded
  as a finding rather than fixed inline. W-3.1 shipped after a whole-branch review and a
  cold-reader re-run, and a drive-by prose edit here would bypass both.
- **A second surface for the stage.** Splitting stage 03 across two routes would fix the
  length problem by breaking the claim the whole structure rests on: stage numbers are
  filing codes, and a stage is one sheet.
- **`Stepper` changes.** Nine steps fit the existing component. The step chip pads with a
  literal `0` (`web/src/components/Stepper.tsx:128`), so a stage of ten or more would
  render "010". Noted as a latent limit, not fixed, because nothing needs ten.

## Constraints

- **The iron law.** No production code without a failing test first. In this repo that
  means the data layer: `scoring.ts` sets and any new judgment data get a failing
  `scoring.test.ts` case before the component that renders them. Presentational components
  with no judgment data have no unit-testable surface. That gap is covered by the audit
  suite and the verification passes, and the plan says which tasks are in which category
  rather than pretending coverage it does not have.
- **The app does not read the markdown.** The port is hand-transcription, which is the
  known duplication `CLAUDE.md` permits. Every new component cites its doc section
  **by heading, never by line number** (D-42), which `source-citations.test.ts` enforces.
- **Check `terms.ts` when fixing a concept** (D-47). Any concept corrected in this round
  gets a `terms.ts` grep before the prose is called done.
- **React 19 forbids setState in an effect body.** New persisted state uses
  `useLocalStorage` (`web/src/lib/useLocalStorage.ts`), which is `useSyncExternalStore` for
  exactly this reason.
- **Accent and semantic colour stay separate.** `brand` means attention; `go`/`danger`/
  `warn` carry meaning. The characteristics picker has no right answer, so it uses neither
  `go` nor `danger`.
- **320px is a real constraint.** The container view, the ER view and the deployment-styles
  comparison are the three widest new pieces.

## Architecture

### The step structure, and D-49

```
01 Reverse    Sort decisions by reversibility
02 Require    What this system has to be                      [new]
03 Model      Model the domain first
04 Shape      The shapes a system can take                    [new]
              Start with one application
              Boundaries inside the monolith
05 Sketch     Sketch the system                               [new]
06 Schema     Design the database
07 Contract   Design the API contracts                        [new]
              Authentication and authorization
08 Record     Write the ADRs
              Defer aggressively
09 AI plays   AI in architecture
```

**D-49 supersedes D-38.** D-38 capped step count to stop a step becoming a scroll, but
count does not control length. Contents do. Five steps holding thirteen subsections is
longer per step than nine steps holding thirteen. The replacement rule:

> **One step is one decision the reader makes, and carries at most one committed
> exercise.** How many steps a stage has follows from how many decisions its doc teaches.

Stage 04 does not inherit nine. It inherits the obligation to show its doc teaches that
many decisions, which is checkable against the doc's own headings, the same evidence
`stage-03-structure.test.ts` already pins for stage 03.

**What this rule can and cannot be tested against.** Step count and audit coverage are
mechanical and get tests. "At most one committed exercise" cannot be tested here: the
exercises are components, and this repo has no component harness by deliberate choice
(`web/src/features/architecture/scoring.ts:1-8`). It goes into `web/PATTERNS.md` as a
review rule, and D-49 records that the untested half is untested rather than implying a
gate that does not exist. That is the failure `docs/learnings/decisions-need-tests-101.md`
was written about.

The rule is what forces two structural choices below: `InternalOrganisation` in step 04 is
a reveal rather than a scorer, so `SplitTrigger` stays that step's only commitment, and
step 07's `RouteShape` is a reveal so `AuthzPatterns` can be its commitment.

**Step ids change.** `constrain` → `schema`, and `decide` splits into `contract` and
`record`. The hashes are the app's deep-link surface; nothing is deployed (W-5 open) and
the only in-repo consumer is `PAGES` in `web/e2e/audit.spec.ts:9-30`, which this round
edits anyway. An unknown hash already falls back to step 0 rather than erroring
(`Stepper.tsx:25-29`).

**Rejected: ten steps**, splitting "Sketch the system" into a diagram step and an
integration step. It reads well and it breaks the rule in the same commit that states it:
one doc movement across two steps is exactly the coupling D-49 says a step should not have.

### Wave 1 — corrections

Ordered first, and deliberately. The app currently states things the doc has corrected;
that is a worse defect than the app being incomplete, and putting it last is where scope
pressure lands.

| Target | Change |
|---|---|
| `scoring.ts` `INTERROGATIONS` | Add `actor-rights`: does every actor have the same rights over this entity? Options are a column on `users` versus a role on the relationship. Answer: the relationship. Extend `overdue-status`'s reasoning with the doc's general form — compute a pure function of data you already hold, store a fact about a moment. Extend `invoice-delete`'s with the widened heuristic: keep anything somebody will later ask "where did that go?" about |
| `scoring.ts` `DECISIONS` | Surface the three-part test the doc promoted into "Sort decisions by reversibility": what would have to change, how many call sites touch it, and whether any of it is stored data — the last dominating. It becomes a typed field on the exercise's framing rather than prose, so the app teaches the test and not only the axis |
| `scoring.ts` `SCHEMA_LINES` | `pk` gains the `bigserial` alternative and why it leaks row count and arrival rate. `due_date` gains its first annotation: a calendar day means the same thing in every timezone and an instant does not |
| `scoring.ts` `BOUNDARY_EDGES` | A fourth edge — a write reaching into another module's table (approving a swap changes rows the approval flow does not own). Illegal for the same reason as the read, and the half that gets forgotten |
| `AuthPaths` | Unchanged in its three paths; the step around it gains `AuthzPatterns` |
| `DeferredList` | `multi-tenancy` (`DeferredList.tsx:61`) is currently a deferral. The doc now has it failing the deferral test, split into the axis you decide now — person or organisation — and everything built on top, which still defers |
| `AIArchitecturePlays` | Helps 4 → 7: argue down a characteristics list; find the box you left out of the sketch; read a schema for the index you need, with the queries, because without them it invents access patterns. Misleads 4 → 5: asked which style to use it answers with the one it has read most about, not the one your characteristics select. The `reversibility` help stops restating the test and points at it |
| Traps callout set | New first trap: choosing a style before choosing characteristics — the answer sounds identical either way and only one of them is a decision |

### Wave 2 — the four new steps

**02 Require.** `CharacteristicPicker` — ten candidates, the reader picks. Not scored,
because the doc offers a set to choose from rather than a set to complete. The teeth are in
the cap: past four it says so, and says why: characteristics trade against each other, and
a system meant to be everything has been told nothing. On commit it reveals the invoicing
example's three *and its three explicit declines*, since a characteristic you never
considered is not the same as one you rejected.

`TraceForward` follows: expand-to-reveal, one row per characteristic, each naming the
decision it forces and linking to the step where that decision lands (auditability → soft
delete, step 06; correctness → constraints in the database, step 06; cheap to run → one
application, step 04). It closes on the test: a characteristic that traces to no decision
was listed, not chosen.

The reader's picks persist under an `arch.characteristics` key via `useLocalStorage` and
are echoed in step 04, where the doc says to run the same trace against your own three.
This extends the existing carry-forward chain rather than inventing a mechanism.
`ArchCarryForward.tsx` already reads stage 02's key read-only.

**04 Shape.** `DeploymentStyles` (monolith, modular monolith, microservices, serverless)
as expand-to-reveal rather than the doc's four-column table. Four columns at 320px is the
overflow the audit suite was written to catch, and the pattern library's own note says
expand-to-reveal is the workhorse for a list of items that each need a paragraph. Each
entry carries what it buys, what it costs, and what would have to be true. The
microservices entry gets the doc's emphasis: what it buys is organisational, what it costs
is technical and arrives on day one.

`InternalOrganisation` — layered versus hexagonal, decided on one question: how much of
your logic is worth testing without the database running. A reveal, not a scorer, so
`SplitTrigger` remains this step's single commitment.

The existing `OneAppCosts`, `SplitTrigger`, `BoundaryMap` and `TeamNotes` stay. Bounded
context and ubiquitous language wire into the boundaries prose, where the doc puts them.

**05 Sketch.** `SystemSketch` — the container view as a click-node inspector. Every
external box is selectable and its panel answers two things: what it does, and what happens
when it is down. Folding the failure question into the diagram rather than listing it
separately is the doc's own argument: the diagram is what forces the question, and the
return on drawing it is the one answer out of three that turns out to be real work.

Then the five-step data flow drawn end to end, the sync/async comparison, and idempotency
as an annotated SQL block: `processed_events` with its composite primary key, insert the
row first and do the work in the same transaction, and answer the sender **success**,
because a duplicate is the system working and returning a failure builds a retry loop out
of the mechanism meant to prevent one.

**07 Contract.** `ContractCost` (internal function, public API, received webhook) tied
back to step 01's axis, since a contract's cost is who you can force to move when you break
it. `RouteShape` covers the verb problem as a reveal: sub-resource versus verb-as-noun,
with the doc's hook that if you would want to know later who approved what and when, the
verb was an entity all along.

`AuthzPatterns` is this step's commitment: four scenarios, each answered with ownership,
role, or membership. It is the exercise the fifth interrogation question in step 03 sets
up, and the lesson is that the decision is not which pattern but which pattern per entity.

### Wave 2b — additions inside steps that already exist

Two steps keep their identity and gain substantial content. They are separated from the
four new steps above because the risk is different: here the work is grafting onto
components that already pass their tests.

**03 Model** gains the method the doc now opens with, which the app never had: getting to
the nouns is mechanical rather than intuitive. Take stage 02's vertical slices, underline
every noun, strike the ones that are a property of another noun. An invoice's total is a
column, and possibly not even that. What survives is the candidate list. It lands as
framing prose above `DomainSketch`, and it matters because the app currently presents the
sketch as if it arrived fully formed. `ModelInterrogation` renders five questions rather
than four, which is a data change from wave 1 with no component change.

**06 Schema** is the step that grows most, and it is where the doc's requirements → HLD →
LLD arc lands:

- `ERView` — the nouns with their cardinality made explicit. The teaching point is the
  second edge: `invoices` hangs off `users` as well as `clients`, so a client can be merged
  or reassigned without the invoices following it. That is a thing an ER view makes visible
  and a list of tables does not, which is the argument for drawing it at all.
- Normalisation as the working rule rather than the theory: if changing one fact means
  updating two rows, the model is wrong. Denormalising belongs to stage 09, after a
  measurement.
- `SchemaInspector` is generalised to take its lines as a prop and is rendered three times:
  the invoices DDL it already has, the two indexes, and the tenancy tables. Reuse rather
  than three near-identical components, and the annotated-artifact pattern is the same in
  all three. The index block's annotations carry the doc's point that both indexes come
  from the system sketch (one from a screen, one from the scheduled job) rather than from
  intuition.
- `PartialUniqueIndex` — the rule `UNIQUE` cannot express: at most one *approved* claim per
  shift. It pairs the check-then-insert race, which two concurrent requests both pass
  believing they were first, with the index that makes the race impossible.
- The tenancy block carries `companies`, `teams` and `memberships`, and the reason roles
  live on the relationship: a person can manage one team and be an ordinary member of
  another, and a `users.role` column cannot say that. Nested tenancy gets its rule: the
  tenant key is the level at which data stops being shared.
- Transactions close the step: some invariants span rows and no constraint can express
  them, so the database holds the line only around a boundary you draw.

`DeleteBehaviour` stays where it is.

Rejected: folding the three SQL blocks into one tabbed inspector. Tabs would hide two
thirds of the step's content behind a control, and the blocks are not peer categories the
reader picks between. They are three different lessons read in order.

### Wave 3 — wiring and gates

All 14 terms land at first use: `architecture-characteristic` (02);
`modular-monolith`, `microservices`, `serverless`, `hexagonal-architecture`,
`bounded-context`, `ubiquitous-language` (04); `c4-model`, `event-driven-architecture`,
`idempotency` (05); `normalisation`, `partial-unique-index` (06); `event-sourcing`,
`cqrs` (08).

Three references join `web/src/lib/references.ts`: Ford and Richards on architecture
characteristics, Simon Brown on C4, Cockburn on hexagonal architecture. Each is verified
resolving before it ships.

Figures renumber across the whole stage, 9 → roughly 15. `Figure` numbers run across the
stage rather than per step and are passed explicitly, so every step's numbers shift. It is
mechanical and easy to get half-right, so it is its own task done last, after the set of
figures has stopped changing.

`PAGES` in `web/e2e/audit.spec.ts:9-30` gains the nine step hashes, replacing the six
(TD-12).

### Optional, and first to cut

Close TD-12's silent half: export step ids from each stage feature, and test that `PAGES`
covers every ready stage's steps. This round edits that array anyway, so the marginal cost
is small, but it touches all three built stages, which puts it outside the round's scope
if the round runs long. It is listed as the last task so cutting it costs nothing already
built.

## Testing

TDD applies to the data layer, which is where this stage's judgment lives.

**New failing tests first, in `scoring.test.ts`:**

- `INTERROGATIONS` has five questions, and `judgeInterrogation('actor-rights', …)` returns
  the relationship answer as correct and the `users.role` column as wrong.
- `BOUNDARY_EDGES` contains a write edge, and it is illegal.
- `SCHEMA_LINES` annotates `due_date`, and the `pk` note names the alternative it rejected.
- New sets get the same treatment as the existing ones: `CHARACTERISTICS` traces every
  entry to a decision (the doc's own test, expressed as an invariant, so a characteristic
  with no trace fails); `AUTHZ_SCENARIOS` scores; `CONTRACT_ROWS`, `DEPLOYMENT_STYLES`,
  `SKETCH_NODES` and `INDEX_LINES` assert shape and non-empty reasoning.
- `SKETCH_NODES` asserts every external node answers both questions, so a node cannot ship
  with a description and no failure mode, which is the whole reason the component pairs them.

**Teeth check on each.** Break the implementation, confirm the new test and only the new
test fails, then restore. The RED and GREEN terminal output goes in the task report with a
statement of why the failure was the right one.

**Existing tests that must keep passing:** `stage-metadata.test.ts` (the doc's `### AI in
architecture` heading), `glossary.test.ts`, `stage-03-structure.test.ts` (doc headings,
untouched this round, so a failure means the round edited the doc by accident, which is
useful), `source-citations.test.ts` (every new component's doc citation resolves by
heading).

**Not unit-tested, and named as such:** the presentational components. `SystemSketch`'s
diagram, `TraceForward`'s disclosure behaviour, `DeploymentStyles`' expansion. They are
covered by the audit suite and the manual passes, and the plan marks those tasks as
implementation-only rather than claiming a RED run that would be theatre.

## Verification

Against a live build, not asserted:

- **Contrast** — every distinct text/background pair, both themes, all nine steps, WCAG AA.
  Read `docs/learnings/contrast-checkers-lie.md` before changing a token in response to a
  number; three of the failures reported in this repo were the checker, and the parser must
  handle `oklab()`.
- **Responsive** — 320→2560px, no horizontal overflow, no sub-44px touch target below `lg`.
  The container view, the ER view and the two SQL blocks are the specific risks; code does
  not reflow, so each gets its own `overflow-x-auto` container with `tabIndex={0}` per the
  annotated-artifact pattern rather than shrinking type.
- **Console** — zero errors in a clean browser context.
- **Per-step length** — each of the nine steps checked against D-49: one decision, at most
  one committed exercise. A step that reads as a scroll is the doc's length problem arriving
  on a second surface, which the kickoff names as this round's specific risk.
- `pnpm test`, `pnpm lint`, `pnpm typecheck` (which runs typegen first; a bare `tsc` passes
  only on a dirty `.next`), `pnpm build`, `pnpm test:e2e`.
- `humanizer:humanizer` over the new prose, not over the SQL, tables or terminal output.

## Documentation updates

- `docs/tracker.md` — D-49 appended (superseding D-38, which is not edited); TD-23 closed
  with evidence; TD-12 updated or closed depending on whether the optional task ships; the
  W-3.2 shipped entry with its `Deferred:` list.
- `docs/task.md` — W-3.2 ticked, with the AI-plays coverage table left alone (stage 03 was
  already ☑ in both columns and this round does not change that).
- `web/PATTERNS.md` — the 4–6 guidance becomes a typical range with D-49's rule stated
  beside it, and the new patterns this round produces are added to the table if any of them
  is genuinely new rather than an instance of an existing row.
- `KICKOFF.md` — Project state refreshed: stage 03 complete on both surfaces, TD-23 closed.
- No change to `reference/glossary.md`, which is generated. No change to
  `docs/03-architecture.md`.

## Risks

**The round is larger than the stage's original build.** Thirteen new components:
`CharacteristicPicker`, `TraceForward`, `DeploymentStyles`, `InternalOrganisation`,
`SystemSketch`, `DataFlow`, `SyncAsync`, `IdempotencyBlock`, `ERView`,
`PartialUniqueIndex`, `ContractCost`, `RouteShape` and `AuthzPatterns`. Plus edits to seven
existing ones, `SchemaInspector` generalised to take its lines as a prop, three `scoring.ts`
sets corrected and six added. Stage 03's
build ran 17 tasks across 24 commits and its whole-branch review found defects that
per-task review could not, because most of them were plan-authored rather than implementer
error (`docs/tracker.md`, "Process observations"). Mitigation: the three waves are ordered
so the round is releasable after wave 1, and the controller reviews across tasks rather
than only within them.

**Figure renumbering is the highest-frequency error in a port this size.** Numbers run
across the stage and are passed explicitly. Mitigation: one task, done last, after the
figure set is final.

**The characteristics carry-forward could overreach.** Stage 02's carry-forward is
read-only by construction and documented as such. A key written in step 02 and read in step
04 is within one stage, so it is simpler, but it is still a second writer of persisted
state in this stage alongside `DomainWorksheet`. Mitigation: separate key, read-only at the
consumer, and the same `useLocalStorage` hook rather than a direct `localStorage` read.

**A correction could be missed.** The list in wave 1 came from reading the doc against the
app, and the same method missed the `Authorization` definition in `terms.ts` three times
(D-47). Mitigation: wave 1 ends with a `terms.ts` audit of every concept this round
touches, not only the ones whose prose changed.

**Step ids changing breaks a hash somebody has.** Nothing is deployed and the only in-repo
consumer is the audit list. Accepted rather than mitigated; if the site were live, the
right answer would be to keep the old ids.
