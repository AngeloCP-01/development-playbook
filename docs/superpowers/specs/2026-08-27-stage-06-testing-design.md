# Stage 06 — Testing: interactive port

**Milestone:** W-3.6 · **Source:** `docs/06-testing.md` (279 lines)
**Branch:** `feat/stage-06-testing` · **Date:** 2026-08-27

---

## Problem

`docs/06-testing.md` is written and unported. The web app renders a "sheet not drawn"
placeholder at `/stages/06-testing`, because `src/lib/stages.ts:81` carries
`ready: false` and `06-testing` is absent from `STAGE_CONTENT`
(`src/features/stage-content.ts`). Five of eighteen stages are interactive; this is the
sixth.

The doc is half the length of stage 05's (279 lines against 587) and considerably denser:
three full code samples, eleven `###` sections, and two passages of first-hand evidence
from this repository's own gate. Length is not the difficulty here. The difficulty is that
most of the doc is *judgment* — what to test, at which layer, and when a green run is
telling you nothing — and judgment ports badly into prose panels. A reader who finishes a
prose port can recite the distribution and still cannot place a change into it.

There is also a seam worth naming. Stage 05 defers testing to this stage five separate
times (`docs/05-development.md:25`, `:134`, `:165`, `:528`, and the traps block), so 06 is
the payoff for promises already made. It is not free to restate 05's material.

## Goals

1. A reader who arrives knowing no testing vocabulary can leave able to answer the doc's
   own sorting question — *if this breaks, how will I find out?* — against a change they
   have not seen before, and say which layer the answer implies.
2. Every `##` and `###` section of `docs/06-testing.md` is carried by a named panel, with
   the mapping written before the panels are built rather than recovered afterwards.
3. One feature — discounted checkout — is tested three ways across three consecutive
   panels, so the layers are visibly the same thing at different altitudes rather than
   three unrelated snippets.
4. The port meets the house verification bar: contrast in both themes, no overflow
   320–2560px, zero console errors in a clean context, both vitest projects, the Playwright
   audit, and one `test:dev-console` run for the round.

## Non-goals

- **A `testing` reference cheatsheet.** There is no `testing` sheet in
  `src/lib/cheatsheets/` and there should be one. D-88's standing rule puts a bounded W-6
  round *after* a W-3 stage ships, not inside it; folding it in here would make the round
  two rounds wearing one branch name and would blur what the gate is attesting to.
- **Registering the parked `sql-reference` / `api-reference` drafts.** Untracked, gathered
  without an image, unrelated to this stage. They stay parked.
- **A `test-pyramid` glossary entry.** The doc says "the distribution" throughout and never
  says pyramid. That reads as a choice rather than an oversight, and defining the more
  famous word would quietly overrule the author. Raised with the user during brainstorming
  and left out deliberately; it is a one-line change if that judgment is wrong.
- **A third scored exercise for the E2E selector lesson.** The doc's point there is a
  comparison (`.btn-primary-2` against `getByRole('button', { name: 'Buy now' })`), not a
  judgment call, so it goes through the existing `Contrast` primitive
  (`src/components/ui.tsx:74`). Three drills across seven panels would read as a quiz site.
- **Migrating stage 05's `AuthorizationDrill` or generalising it.** Stage 06 restates the
  authorization-refusal test as *the second test you write for every action*; that is the
  same subject one level up, and it is carried here by an annotated artifact rather than a
  second drill. Rejected explicitly during brainstorming: a second binary drill on the
  same subject reads as a repeat, not a payoff.

## Constraints

- **`ready: true` in `src/lib/stages.ts:81`, a `STAGE_CONTENT` entry, and a `STEP_IDS`
  tuple.** The three-file trace. The eighteen-stage invariant and the stage-title sync test
  already guard the registry against a half-registration.
- **Panels stay under four screens (D-52).** Seven panels over 279 doc lines is ~40
  lines/panel, against stage 05's ~45. Deliberate: stage 04's median panel came in at 1.74
  screens against stage 03's 3.02, and that number was the first visible symptom of five
  sections having gone missing.
- **Cite doc sections by heading, never by line number (D-42).** Nothing in the gate can
  detect a stale line-number citation. Doc-anchored tests go through
  `docSource` (`src/test/doc-source.ts:20`), whose `section`/`h2` helpers anchor to a
  heading on its own line and bound at the next heading of equal-or-higher level.
- **`fireEvent` from `@testing-library/react` plus plain DOM assertions.** This project
  installs neither `jest-dom` nor `user-event`. Stage 04's plan assumed both and would have
  failed about twenty tests on `Invalid Chai property: toBeInTheDocument`.
- **No `setState` in an effect body.** `react-hooks/set-state-in-effect` is an error here,
  not a warning.
- **Glossary is single-sourced (D-36).** Terms go in `src/lib/terms.ts`;
  `reference/glossary.md` is generated by `pnpm gen:glossary` and is never hand-edited.
- **AI plays is mandatory per stage (D-35).**
- **`main` is production.** This branch merges to `develop`, and only when the user says so.

## Architecture

### Seven panels, with the coverage map fixed up front

| Panel | Doc sections carried | Lead interaction |
|---|---|---|
| 1. If this breaks, how will I find out? | epigraph · When this actually happens · Entry criteria · The one question worth asking · The distribution | `TriageDrill` (spine) + F1 |
| 2. The tests not to write | What not to test · Coverage | `RevealList` + `Contrast` |
| 3. Underneath: the pure function | Unit tests · integer cents · the edge-case probes | `AnnotatedArtifact` + `RevealList` + F2 |
| 4. One layer up: the action | Integration tests · the refusal test · real Postgres over mocks | `AnnotatedArtifact` |
| 5. On top: the money path | E2E tests · role and accessible name · `@smoke` · never `waitForTimeout` | `AnnotatedArtifact` + `Contrast` |
| 6. Proving a test bites | Test-first, mostly · The teeth check · Invariant tests over hand-edited data | `TeethCheck` |
| 7. Done, and done on a team | Artifacts · Definition of done · Scaling to a team · Traps | checklist · `TeamNotes` · trap callouts · `References` |

Panels 3 → 4 → 5 carry one feature at three altitudes. That continuity is the teaching, not
the individual snippets: seven accurate facts in isolation do not show a reader why the
layers are layers of one thing. F2 draws the feature with its three tests once, in panel 3
where the thread opens; panels 4 and 5 stitch back to it in a sentence rather than redrawing
it, since figures number across the stage and a repeated figure would break the count.

Panel 6 pairs *test-first* with *the teeth check* rather than giving each its own panel,
because the two are halves of one claim: test-first means the test failed first, and the
teeth check is what you owe when it could not. Flagged to the user as the one arguable seam
in the structure; approved as drawn.

### Two new components

**`TriageDrill` + `triage.ts`** — six changes, four options, scored across the set.
Structural reference is `DeployBlockers` (`src/features/setup/DeployBlockers.tsx:109`):
`role="radio"` inside a per-row `role="radiogroup"`, the answer locking on selection, the
running count in an `aria-live="polite"` region. The four options are the distribution's
four tiers, so the reader learns the shape by placing things into it rather than by reading
it listed.

Every row offers the same four options, which is `blockers.ts:26`'s device and is taken
deliberately: a shared option set forces the reader to read the change rather than recognise
the shape of the list. Each row's explanation says why the *wrong* readings are tempting,
not only why the right one is right.

**`TeethCheck` + `teeth.ts`** — three tests, "does this bite or is it decoration", binary
and scored, one panel. `AuthorizationDrill` (`src/features/development/AuthorizationDrill.tsx:83`)
is the shape. The three failure modes are ones this repository has actually hit, per
`docs/learnings/stage-implementation-101.md`: both sides of an assertion read off the same
data row, a mutation that never landed in the file, and a green run on a test that never
failed.

Both are guess-then-reveal per `web/PATTERNS.md:343` — the answer locks before the verdict
shows, and the set is scored, because a revealed answer the reader did not commit to teaches
nothing.

### Three more components, by convention rather than invention

`TestingChecklist.tsx` (panel 7's definition of done, following `SetupChecklist` and
`DevChecklist`), `AIPlays.tsx` (D-35, per stage), and `LayerThread.tsx` — F2's drawing of
one feature carrying three tests, rendered from `layers.ts` inside a `Figure`. None is a new
pattern; all three derive what they show from data, so all three get render tests.

### Reused unchanged

`AnnotatedArtifact` for the three verbatim test files, with the authorization-refusal test
marked as panel 4's pivot line — the doc calls it "worth more than a hundred tests of the
happy path", which is what a pivot is for. `RevealList` for the five things not to test and
for the six edge-case probes applied to `calculateTotal`. `Contrast`, `TeamNotes`,
`References`, `Callout kind="trap"`, `Term`, `Figure`, `InlineCode`.

### Data modules

Mirroring `src/features/development/`: `steps.ts` (and its `STEP_IDS` tuple),
`doc-source.ts`, `triage.ts`, `teeth.ts`, `layers.ts`, `probes.ts`, `artifacts.ts`,
`checklist.ts`, `traps.ts`, `ai-plays.ts`.

### Glossary

Eight new entries in `src/lib/terms.ts`: `mock`, `flaky-test`, `regression-test`,
`invariant-test`, `teeth-check`, `code-coverage`, `accessible-name`, `test-fixture`.
`smoke-test` already exists and is wrapped on first appearance in panel 5. `pnpm
gen:glossary` regenerates `reference/glossary.md`.

### The doc gains a section before the port reads it

`docs/06-testing.md` has no `### AI in testing` section and does not mention AI once. Stages
01–05 each carry one (`docs/01-product-discovery.md:114`, `02:170`, `03:1332`, `04:611`,
`05:474`), and D-35 makes the convention mandatory. Found while planning the port.

The app cannot carry a panel the canonical doc has no source for, so the round opens with a
small doc task that writes the section, committed on its own with a `docs(testing)` scope
before any data module anchors to the doc. Panel 7's AI plays then read it like every other
section and get a doc-anchored test.

Rejected: shipping the port without AI plays and recording a D-35 exception as debt — it
would make stage 06 the one stage a reader finds the convention missing from. Also rejected:
a separate doc round first, which is cleaner against D-54 but costs a full round before any
of stage 06 is visible. Put to the user during planning; the in-branch doc task was chosen.

## Testing

**Doc-anchored data tests.** Each authored module gets a sibling `*.test.ts` holding its
content against `docs/06-testing.md` through `docSource`.

**The pinning rule, which is the load-bearing part.** Stage 05 lost the second sentence of a
two-sentence passage three times, the third inside the fix wave built to close the first two.
The shape is consistent: the first sentence carries the claim, the second carries the
qualifier, the example or the pointer, and the second is the half that makes the first
actionable. So every doc-anchored test pins **a phrase from each sentence**, and where a
passage is two sentences the pin from the second is mandatory. Worked examples for this doc:

- Not "if this breaks, how will I find out?" alone, but "If the answer is 'the typechecker
  catches it,' do not — you already have that coverage for free."
- Not `getByRole` alone, but "which is when you want it to break."
- Not "prove it bites" alone, but "Both outputs go in the task report."

**Code blocks are lifted, not retyped** — `sed -n 'START,ENDp' docs/06-testing.md` and paste.
`artifacts.ts` holds them verbatim so `artifacts.test.ts` can hold the string against the
doc's own fences via `fences()` (`src/test/doc-source.ts:82`).

**Sentence counting at the boundary.** When a paragraph moves into a panel, note how many
sentences went in and how many came out.

**Render tests** for every component deriving what it shows from data
(`web/PATTERNS.md:442`): `TriageDrill.test.tsx`, `TeethCheck.test.tsx`,
`TestingChecklist.test.tsx`, `AIPlays.test.tsx`, `LayerThread.test.tsx`. Assertions use
`fireEvent` and plain DOM reads.

**Two teeth-check traps to avoid**, both of which have bitten this repo: confirm a mutation
actually landed in the file before trusting what the run says, and never write an assertion
shaped `expect(rendered).toBe(String(row.flag))` — both sides move together and it proves
nothing. Assert literals.

**`prose.test.ts`** ports into the new folder: the markdown-link guard plus the `.tsx` prose
scan. It discovers siblings structurally, so modules written in later tasks are covered
without editing it.

## Verification

Cheapest first: `pnpm lint` at `--max-warnings 0` · `pnpm typecheck` (typegen first — a bare
`tsc` passes on a stale `.next` and fails on a clean checkout) · `pnpm test`, both projects ·
`pnpm test:e2e` against a production build · `pnpm test:dev-console` once for the round, the
only thing here that can see React's development validation.

Then the three live passes from `DESIGN.md`, against a build rather than by reading the code:
contrast on every distinct text/background pair in both themes with every `Term` panel
expanded; 320–2560px with no horizontal overflow and no sub-44px touch target below `lg`;
zero console errors in a clean context, not a hot-reloaded one.

Then `humanizer:humanizer` over the panel prose.

**Panel weight is measured, not asserted**, against stage 05's median. A stage coming in well
under its comparable is a signal to go looking rather than a compliment.

**The coverage walk runs mid-round, not at the end.** It is given `docs/06-testing.md` and
`src/features/testing/` only, with this spec, the plan, every task brief, every task report
and the controller's ledger withheld by name. Stage 05's first two walks ran inside per-task
reviews with full context and found nothing; the third, starved of it, found ten real gaps
against a green gate of 645 tests and fourteen closed reviews. Intentions are what make a
reader of the panels a poor auditor of them. Budget a fix wave after it.

Two cautions on the checkers themselves: a checker reporting mass failures is usually the
checker (a link audit here once reported 124 false breaks), and any colour parser must handle
`oklab()`, which Tailwind emits for alpha backgrounds.

## Documentation updates

- `docs/06-testing.md` — gains `### AI in testing`, committed before the port reads it.
- `docs/stage-06-status.md` — new, carrying the coverage table above as its coverage
  section, plus anything the walk finds and what was deliberately not ported, with reasons.
- `docs/tracker.md` — the W-3.6 entry with evidence (commit, test counts, what review
  caught), any new decisions, and a `Deferred:` list led by the `testing` cheatsheet.
- `docs/task.md` — W-3 progress to 6/18.
- `reference/glossary.md` — regenerated, never hand-edited.
- `web/PATTERNS.md` — only if a genuinely new pattern emerges. `TriageDrill` and `TeethCheck`
  are both instances of the guess-then-reveal row that already exists, so the expectation is
  a note naming them as instances rather than a new row.

## Risks

**The panels teach the vocabulary but not the judgment.** The spine exists to prevent this,
and the coverage walk is what would catch it if the drill ends up shallower than the prose it
replaced. Mitigation is in the drill's data: explanations that say why the wrong reading was
tempting.

**Silent drops.** The named failure mode of stage 04, where five sections assigned to panels
by the plan's own line ranges were never taught, and no test could tell the difference — a
data module asserted against the doc proves the text it has and says nothing about text it
never received. Mitigations: the coverage table fixed before the build, the per-sentence pins,
sentence counting at the boundary, and the context-starved walk.

**Restating stage 05.** The two stages share subject matter at the seam — authorization,
test-first, the debugging loop. Mitigation: 06 carries the *test*, 05 carries the *code*, and
panel 4's artifact is the refusal test rather than a second safe/unsafe drill.

**A vacuous teeth check.** Both known lies — the mutation that never landed, and both sides of
the assertion off one source — are called out in Testing above with the shape to avoid.

**Branch discipline.** The same mistake happened twice in one recent session, the second time
right after the first was written up, so the write-up alone does not prevent it. The branch
was cut before the first edit of this round and `git branch --show-current` gets checked before
each commit.
