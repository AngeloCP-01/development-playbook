# Stage 07 — Code Review: interactive port

**Milestone:** W-3.7 · **Source:** `docs/07-code-review.md` (196 lines)
**Branch:** `feat/stage-07-code-review` · **Date:** 2026-08-28

---

## Problem

`docs/07-code-review.md` is written and unported. The web app renders a "sheet not drawn"
placeholder at `/stages/07-code-review`, because `src/lib/stages.ts:85` carries
`ready: false` and `07-code-review` is absent from `STAGE_CONTENT`
(`src/features/stage-content.ts`). Six of eighteen stages are interactive; this is the
seventh.

The doc is the shortest of the four W-3 candidates (196 lines against 08's 267, 09's 271,
10's 361) and sits in the natural adjacency from stage 06 in the daily loop. It was chosen
on both grounds, the same reasoning that picked stage 04 over 15.

Three things make this stage distinct from its predecessors:

1. **The content is half discipline, half checklist.** Three of seven `###` sections teach
   *when* and *how* to review (create distance, read the diff, explain aloud); the other
   four teach *what* to look for (edge cases, authorization, error handling, names, scope,
   deletion, reversibility). A prose port of the discipline half teaches nothing — the reader
   already knows they should step away. A prose port of the checklist half is a list the
   reader skims and forgets. Both halves need an interaction that forces the judgment.

2. **P-6 conventions land here.** Three conventions from `CLAUDE.md` are mapped to this stage
   by `docs/task.md:107–116`: review severity with finding IDs and provenance tags, the
   principle that a reviewer must disprove as well as confirm, and commit/branch conventions
   (shared with 05). These are not addenda — they are the most rigorous part of this
   project's review practice, and the stage cannot teach review without them.

3. **No AI section exists.** D-35 makes `### AI in ...` mandatory per stage. The doc
   mentions automated review tools in one paragraph (`docs/07-code-review.md:124–132`) but
   has no structured AI section. It needs one before the port can read it.

## Goals

1. A reader who arrives knowing that review exists but never having done one deliberately can
   leave able to spot the authorization gap, the vacuous test, and the bundled refactor in a
   diff they have not seen before — not because they memorised a checklist but because they
   practiced classifying issues against one.
2. Every `##` and `###` section of `docs/07-code-review.md` is carried by a named panel, with
   the mapping written before the panels are built rather than recovered afterwards.
3. The P-6 conventions (severity, provenance, disprove-as-well-as-confirm) are taught through
   a scored exercise, not listed in prose.
4. The port meets the house verification bar: contrast in both themes, no overflow
   320–2560px, zero console errors in a clean context, both vitest projects, the Playwright
   audit, and one `test:dev-console` run for the round.

## Non-goals

- **A `code-review` reference cheatsheet.** D-88's standing rule puts a bounded W-6 round
  *after* a W-3 stage ships, not inside it. The checklist panel is already a condensed
  reference; duplicating it as a sheet would add work with no new teaching.
- **Duplicating commit/branch conventions from stage 05.** The P-6 map says "shared with
  05". Stage 05 already carries conventional commits, scopes, branch naming, `--no-ff`
  merges, and the TEMP idiom. Stage 07 cross-links to 05 for these and carries only the
  review-specific conventions (severity, provenance, disprove-as-well-as-confirm).
- **A live diff viewer or syntax-highlighted diff component.** The review exercise shows
  code snippets with planted issues, not a scrollable unified diff. A diff viewer is a
  component that costs more than the teaching it would add — the point is recognising the
  issue category, not parsing diff syntax.
- **Google's Readability Program or Conventional Comments as formal frameworks.** Both appear
  in the references. The stage teaches the playbook's own severity system (Critical /
  Important / Minor) and provenance tags, which are more rigorous than either on the
  provenance axis. The references let a curious reader follow the thread.
- **Registering the parked `sql-reference` / `api-reference` drafts.** Untracked, gathered
  without an image, unrelated to this stage. They stay parked.

## Constraints

- **`ready: true` in `src/lib/stages.ts:85`, a `STAGE_CONTENT` entry, and a `STEP_IDS`
  tuple.** The three-file trace. The eighteen-stage invariant and the stage-title sync test
  already guard the registry against a half-registration.
- **Panels stay under four screens (D-52).** Six panels over 196 doc lines plus P-6
  additions is roughly 40–50 lines/panel. Stage 06's median was 2.74 screens after a split;
  stage 07 is lighter and should track lower, which is fine for a stage whose interactions
  carry the teaching rather than the prose.
- **Cite doc sections by heading, never by line number (D-42).** Doc-anchored tests go
  through `docSource` (`src/test/doc-source.ts:20`), whose `section`/`h2` helpers anchor to
  a heading on its own line.
- **`fireEvent` from `@testing-library/react` plus plain DOM assertions.** This project
  installs neither `jest-dom` nor `user-event`.
- **No `setState` in an effect body.** `react-hooks/set-state-in-effect` is an error here.
- **Glossary is single-sourced (D-36).** Terms go in `src/lib/terms.ts`;
  `reference/glossary.md` is generated by `pnpm gen:glossary` and is never hand-edited.
- **AI plays is mandatory per stage (D-35).**
- **`main` is production.** This branch merges to `develop`, and only when the user says so.
- **Anchor citations from other docs.** `docs/03-architecture.md` and
  `docs/05-development.md` link to `07-code-review.md#...` anchors. Heading renames in 07
  would break them, guarded by `source-citations.test.ts`. Any rename requires updating
  those citations.
- **`References.test.tsx` fixture.** Currently points at `07-code-review` as the stage with
  no references (moved there during stage 06's round). Once 07 gets references, the fixture
  must point to the next stage without references.

## Architecture

### Six panels, with the coverage map fixed up front

| Panel | ID | Label | Doc sections carried | Lead interaction |
|---|---|---|---|---|
| 1 | `self-review` | Creating Distance | Entry criteria · Reviewing your own code (3 techniques) | Guess-then-reveal: match technique to the bias it defeats |
| 2 | `what-to-find` | What to Look For | What to actually look for (7 areas) · The checklist | **ReviewDrill** (spine) |
| 3 | `pr-discipline` | PR Discipline | PR descriptions · Size · Test the tests / teeth check | `AnnotatedArtifact` + `Contrast` |
| 4 | `team` | Scaling to a Team | Scaling to a team · P-6: severity/provenance/disprove | **SeverityDrill** |
| 5 | `ai` | AI in Code Review | AI in code review (new section) · Automated review has a place | `AIPlays` |
| 6 | `traps` | Traps | Traps · Artifacts · Definition of done | Trap callouts · checklist · `TeamNotes` · `References` |

Panel 1 carries the discipline — *how* to review. Its exercise is lightweight: three
techniques, three cognitive biases, match them. The real point is that the reader commits
an answer before learning that "read the diff, not the code" is the single most effective
trick, so the ranking sticks.

Panel 2 carries the substance — *what* to find. The ReviewDrill is the stage's signature:
six code snippets, each hiding one issue from a different checklist category, the reader
classifies each before seeing the answer. This is the panel that turns a list into a
practiced skill.

Panel 3 carries the mechanics around review — the PR template, the size ceiling, and the
teeth-check link to stage 06. The PR template is an annotated artifact with `pivot` on the
"Why" section, because that is where the doc says you notice the approach is wrong. A
`Contrast` shows a vague description against a specific one.

Panel 4 carries team practices and the P-6 conventions. The SeverityDrill is the P-6
payoff: five review comments, the reader classifies each as Critical / Important / Minor /
Nit. After the exercise, a reveal section teaches provenance tags and the
disprove-as-well-as-confirm principle — the parts that are unique to this project's
practice and have no industry precedent to lean on.

Panel 5 carries AI in code review. Standard `AIPlays` pattern: a `RevealList` of plays
with kind badges, a premise, and a limit callout.

Panel 6 closes with traps, the definition-of-done checklist, team notes, and references.

### Two new components

**`ReviewDrill` + `review-drill.ts`** — six code snippets, seven shared category options,
scored across the set. Structural reference is `TriageDrill`
(`src/features/testing/TriageDrill.tsx`): `role="radio"` inside a per-row
`role="radiogroup"`, the answer locking on selection, the running count in an
`aria-live="polite"` region.

The six snippets are chosen so each plants one issue from a different checklist category:

1. **Authorization** — a server action fetching a record by an ID from the URL param,
   with no ownership check. The query is filtered only by client-supplied ID, which is a
   finding per the doc's own words.
2. **Edge case** — a list component that maps items with no empty-state guard. Zero items
   renders nothing and the user sees a blank screen.
3. **Cleanup** — a form handler with a `console.log(formData)` still in production code.
4. **Naming** — a function called `processData` that sends an email notification. The name
   hides the side effect.
5. **Scope** — a feature diff that also renames a utility and reformats imports. Two
   changes bundled into one PR.
6. **Test quality** — a test asserting `result !== null` for a function whose return type
   is not nullable. The test passes with or without the change.

Each row's explanation says why the *wrong* readings are tempting, not only why the right
one is right. This is what made `TriageDrill` work in stage 06.

**`SeverityDrill` + `severity-drill.ts`** — five review comments, four severity options
(Critical / Important / Minor / Nit), scored and locked, same shape as ReviewDrill.

The five comments are chosen to span the severity range:

1. **Critical** — "This query is filtered by `userId` from the request body, not the
   session. Any user can read any other user's invoices." Authorization bypass.
2. **Critical** — "The migration drops the column before backfilling the new one.
   Existing rows lose their data and there is no rollback." Irreversible data loss.
3. **Important** — "The catch block is empty — the user sees nothing when this fails.
   A loading spinner that never stops." Silent failure, user-impacting.
4. **Minor** — "This logic is duplicated in three handlers. Consider extracting a helper."
   Refactoring suggestion, non-blocking.
5. **Nit** — "`getData` is vague. `fetchInvoices` says what it does." Naming polish.

After the drill, a `RevealList` covers provenance tags (`PRE-EXISTING`, `PLAN-AUTHORED
ERROR`, finding IDs like `I1`, `M3`) and the principle that a reviewer must disprove as
well as confirm. This material has no exercise — it is context the reader needs to
understand why findings carry metadata, not a judgment they need to practice.

### Three more components, by convention

**`CodeReviewChecklist.tsx`** — panel 6's definition of done, following `SetupChecklist`,
`DevChecklist`, and `TestingChecklist`. `'use client'`, `useLocalStorage`, checkboxes
keyed by `DoneItem.id`. Includes `<TeamNotes>` inside the checklist component.

**`AIPlays.tsx`** — D-35, per stage. `RevealList` of plays from `ai-plays.ts`, each with a
kind badge. Standard pattern from stages 01–06.

**`SelfReviewMatch.tsx`** — panel 1's lightweight exercise. Three techniques, three biases,
match them. Simpler than ReviewDrill — could be a `RevealList` where each facet asks "which
bias does this technique defeat?" with a reveal, or a small scored matcher. Design the
simplest version that forces a commitment before the reveal.

### Reused unchanged

`AnnotatedArtifact` for the PR description template. `Contrast` for good-vs-bad PR
descriptions and for the "review immediately" vs "review after a break" comparison.
`RevealList` for the seven review areas in panel 2 (alongside the drill, not replacing it —
the areas are the reference, the drill is the practice). `Callout kind="trap"` for the
eight traps. `Term` for glossary words on first appearance. `Figure` if any diagram earns
its place (the stage is text-heavy; a figure is not forced). `InlineCode` for all strings
rendered from doc data. `References` in the final panel.

### Data modules

| Module | Exports | Source |
|---|---|---|
| `steps.ts` | `STEP_IDS` tuple, `StepId` type | — |
| `doc-source.ts` | Re-export of `docSource('docs/07-code-review.md')` | — |
| `review-drill.ts` | `Snippet`, `SNIPPETS`, `Category`, `CATEGORIES` | Authored, checked against doc checklist categories |
| `severity-drill.ts` | `SeverityComment`, `COMMENTS`, `Severity`, `SEVERITIES` | Authored, P-6 conventions |
| `self-review.ts` | `Technique`, `TECHNIQUES` | `### Reviewing your own code` |
| `review-areas.ts` | `Area`, `AREAS` | `### What to actually look for` |
| `checklist-items.ts` | `CheckItem`, `CHECKLIST` | `### The checklist` |
| `pr-template.ts` | `Artifact` (for AnnotatedArtifact) | `### PR descriptions` |
| `team.ts` | `Practice`, `PRACTICES` | `## Scaling to a team` |
| `traps.ts` | `Trap`, `TRAPS` | `## Traps` |
| `done.ts` | `DoneItem`, `DONE`, `ARTIFACT_LIST` | `## Artifacts` · `## Definition of done` |
| `ai-plays.ts` | `Play`, `PLAYS`, `AI_PREMISE`, `AI_LIMIT` | `### AI in code review` (new) |

### Glossary

Four new entries in `src/lib/terms.ts`, linked to `07-code-review`:

- **rubber-stamping** — approving a change without genuine review; the anti-pattern the
  entire stage exists to prevent.
- **provenance** — tracking whether a review finding was introduced by the current change,
  pre-existing, or authored by the plan itself. Unique to this project's practice.
- **finding-severity** — the Critical / Important / Minor / Nit classification that
  separates blocking issues from polish, so every comment carries its weight.
- **self-review** — reviewing your own code with deliberate techniques to defeat the biases
  that make it harder than reviewing someone else's.

Existing terms that get `see: '07-code-review'` added: `teeth-check` (already exists from
stage 06).

`pnpm gen:glossary` regenerates `reference/glossary.md`.

### The doc gains two sections before the port reads it

`docs/07-code-review.md` needs two additions:

1. **`### AI in code review`** under `## The work`, after `### Automated review has a
   place`. Content outlined in this spec's panel 5 description. The two sections are
   related but distinct: "Automated review has a place" is a paragraph about static
   analysis tools in general; "AI in code review" is the structured AI plays section with
   specific guidance on what AI catches, what it misses, the human+AI workflow, and the
   rubber-stamping anti-pattern.

2. **`### Comment with severity`** under `## Scaling to a team`. The P-6 review-severity
   convention: Critical / Important / Minor as blocking tiers, finding IDs (`I1`, `M3`),
   provenance tags (`PRE-EXISTING`, `PLAN-AUTHORED ERROR`), and the principle that a
   reviewer must disprove as well as confirm. This is this project's contribution to the
   subject and has no direct industry equivalent to cite — the closest is IBM's Orthogonal
   Defect Classification (1992), which tracks defect age but not plan-vs-implementer origin.

Both committed with `docs(code-review)` scope before any data module anchors to the doc.

### References

3–5 outward links, test-enforced, placed in `src/lib/references.ts` under
`'07-code-review'`:

1. **SmartBear / Cisco, "Best Practices for Code Review"** — the canonical study (2,500
   reviews, 50 devs, 10 months). Source for the 200–400 LOC ceiling and the 60-minute
   session limit.
2. **Google Engineering Practices, "How to do a code review"** —
   `google.github.io/eng-practices/review/`. The minimalist severity system
   (Nit/Optional/FYI/unmarked) and the principle that every CL should improve the codebase.
3. **Conventional Comments** — `conventionalcomments.org`. The label-decorated format
   adopted by GitLab. Referenced for context; the stage teaches the playbook's own system.
4. **Bacchelli & Bird, "Expectations, Outcomes, and Challenges of Modern Code Review"
   (ICSE 2013)** — the Microsoft study showing knowledge transfer, not defect detection, is
   the primary actual outcome of review.

## Testing

**Doc-anchored data tests.** Each authored module gets a sibling `*.test.ts` holding its
content against `docs/07-code-review.md` through `docSource`. The section helpers
(`section`, `h2`, `flat`) handle hard-wrapped lines — no dotAll flag, no raw single-space
matching against the doc.

**The pinning rule.** Every doc-anchored test pins a phrase from each sentence of the
source passage, and where a passage is two sentences the pin from the second is mandatory.
Worked examples for this doc:

- Not "Create distance" alone, but "Bugs that are invisible while you are inside the
  problem become obvious once you are not."
- Not "Read the diff, not the code" alone, but "the diff view strips the surrounding code
  you have been staring at and shows only what changed."
- Not "Under 400 lines" alone, but "reviewers (including you) start skimming and approving
  on vibes."

**Code blocks are lifted, not retyped** — `sed -n 'START,ENDp' docs/07-code-review.md` and
paste. The PR description template (`pr-template.ts`) holds the block verbatim so
`pr-template.test.ts` can hold the string against the doc's fences via `fences()`.

**Sentence counting at the boundary.** When a paragraph moves into a panel, note how many
sentences went in and how many came out.

**Render tests** for every component deriving what it shows from data:
`ReviewDrill.test.tsx`, `SeverityDrill.test.tsx`, `CodeReviewChecklist.test.tsx`,
`AIPlays.test.tsx`, `SelfReviewMatch.test.tsx`. Assertions use `fireEvent` and plain DOM
reads.

Shape per drill test:
1. Render the component.
2. Locate each row via `getByRole('radiogroup', { name: ... })`.
3. Assert verdicts are hidden before any selection.
4. Click one option.
5. Assert the answer is locked (all radios in that group disabled).
6. Assert the verdict panel appears with `aria-live="polite"`.
7. Assert the running score updates.
8. Complete all rows and assert final score.

**`prose.test.ts`** ports into the new folder: the markdown-link guard plus the `.tsx` prose
scan. Discovers siblings structurally; modules written in later tasks are covered without
editing it.

**Teeth-check traps to avoid:** confirm a mutation actually landed before trusting what the
run says; never write `expect(rendered).toBe(String(row.field))` — assert literals.

## Verification

Cheapest first: `pnpm lint` at `--max-warnings 0` · `pnpm typecheck` (typegen first) ·
`pnpm test`, both projects · `pnpm test:e2e` against a production build ·
`pnpm test:dev-console` once for the round.

Then the three live passes from `DESIGN.md`, against a build rather than by reading the
code: contrast on every distinct text/background pair in both themes with every `Term` panel
expanded; 320–2560px with no horizontal overflow and no sub-44px touch target below `lg`;
zero console errors in a clean context, not a hot-reloaded one.

Then `humanizer:humanizer` over the panel prose.

**Panel weight is measured, not asserted.** Stage 07 is lighter than 06 (196 vs 279 doc
lines, 6 vs 8 panels). Expect a lower median, but verify it is not suspiciously low — the
coverage walk is the guard.

**The coverage walk runs mid-round, not at the end.** It is given `docs/07-code-review.md`
and `src/features/code-review/` only, with this spec, the plan, every task brief, every
task report and the controller's ledger withheld by name. Budget a fix wave after it.

## Documentation updates

- `docs/07-code-review.md` — gains `### AI in code review` and `### Comment with severity`,
  committed before the port reads it.
- `docs/stage-07-status.md` — new, carrying the coverage table as its coverage section,
  plus anything the walk finds and what was deliberately not ported, with reasons.
- `docs/tracker.md` — the W-3.7 entry with evidence (commit, test counts, what review
  caught), any new decisions, and a `Deferred:` list led by the `code-review` cheatsheet.
- `docs/task.md` — W-3 progress to 7/18.
- `reference/glossary.md` — regenerated, never hand-edited.
- `web/PATTERNS.md` — note naming `ReviewDrill` and `SeverityDrill` as instances of the
  guess-then-reveal row, if no genuinely new pattern emerges.
- `References.test.tsx` — fixture repointed to the next stage without references (likely
  `08-refactoring`).

## Risks

**The review exercise is too abstract.** Snippets that plant issues need to read like real
code a real PR would contain. If they look contrived — a function literally named
`processData` — the reader learns to spot exercises, not bugs. Mitigation: use realistic
domain names (invoice, order, user) and plant issues that are plausible mistakes, not
textbook examples.

**P-6 severity feels like project jargon.** The severity system is this project's
convention, not an industry standard. A reader might dismiss it as over-engineering.
Mitigation: the exercise teaches the skill (classify by impact) before naming the system,
and the references show that mature teams (Google, Microsoft, Netlify) all use some form of
classification — this one is more rigorous on provenance, not more complex on severity.

**Silent drops.** The named failure mode: content assigned to panels by the plan's line
ranges that was never taught. Mitigations: the coverage table fixed before the build, the
per-sentence pins, sentence counting at the boundary, and the context-starved walk.

**Heading renames breaking cross-stage citations.** `docs/03-architecture.md` and
`docs/05-development.md` link to `07-code-review.md#...` anchors. Any heading change in 07
must update those citations. Guarded by `source-citations.test.ts`, but worth naming because
the doc gains two new headings and existing ones should not move.

**The AI section is the newest content.** Unlike the rest of the doc, which has been stable,
the AI section is authored for this round from research. It carries the risk of reading as
generated rather than as something the playbook's author would say. `humanizer:humanizer`
runs over it, and the doc task commits it separately so review can focus on it.
