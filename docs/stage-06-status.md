# Stage 06 — implementation status

**What this is:** the coverage map for stage 06, doc against app, section by section. It
exists for the reason stage 04's and 05's do — a stage and its port drift, and the drift
gets discovered rather than tracked — and this round is the third time the check earned its
place. A read-only coverage walk, given only the doc and the code and none of this branch's
plan or reports, found ten problems: eight missing or drifted pieces of content, one
structural defect in the tests meant to guard against exactly that, and one hazard baked
into the app's own copy-paste affordance that the doc does not even have. All ten are
closed below.

**Last verified:** 2026-08-27, on `feat/stage-06-testing` at `9dcff8b`, after the coverage
walk's fix wave and a full verification pass.

**Current state:** doc **316 lines, six `##` sections, eleven `###` ones**. App **eight
steps** (`steps.ts` cut seven at plan time; the eighth is a mid-round split, see below).
753 tests across 100 files; an 18-test audit suite passes clean. Lint, typecheck and
`format:check` clean. `reference/glossary.md` regenerated with a 16-line diff — eight new
terms (`mock`, `test-fixture`, `regression-test`, `invariant-test`, `teeth-check`,
`code-coverage`, `flaky-test`, `accessible-name`), one term (`smoke-test`) already in the
glossary and reused rather than redefined.

**`done` was planned as one panel and shipped as two.** The plan cut seven steps; wiring
this stage's four references into `done` alongside the checklist and the AI section pushed
it to **4.69 screens**, over the 4.0 ceiling the audit enforces. The overage did not come
from the references themselves — cutting them to the floor of three still landed around
4.4 — it came from three closing doc sections (Artifacts, Definition of done, Scaling to a
team) compressed into one panel at plan time, before anyone had measured what that costs.
The fix was to split rather than compress: `done` kept the checklist and the AI plays,
and a new `traps` panel took the eight trap callouts plus the references, closing last —
which also matches the doc's own order (Artifacts → Definition of done → Scaling to a
team → Traps) and this app's convention of ending a stage on a trap set. Eight panels is
unremarkable here: stage 03 has 22, stage 04 has 15, stage 05 has 13.

---

## Panel weight

Measured at 1024×768 with the audit's method (`#panel-<id>` bounding height ÷ 768), after
the coverage walk's fix wave landed.

| Step | Screens | Step | Screens |
|---|---|---|---|
| `triage` | 3.55 | `teeth` | 3.52 |
| `restraint` | 1.46 | `done` | 2.51 |
| `unit` | 3.93 | `traps` | 2.41 |
| `integration` | 2.97 | | |
| `e2e` | 2.22 | **median** | **2.74** |
| | | **max** | **3.93** |

All eight sit under the enforced 4.0 ceiling; no `PANEL_EXCEPTIONS` entry was added. The
median (2.74) reads higher than stage 05's (2.42), which on its own would suggest a denser
stage — but a median taken after a panel split is not telling you that. Splitting `done`
lowered its own height without cutting a sentence from the doc, which is exactly why this
round trusts the panel table as a shape check and treats the coverage table below, not the
median, as the actual guard against dropped content.

`unit` is the panel worth naming on its own: it measured 3.93 before the coverage walk's fix
wave and stayed exactly there afterward, on purpose. Two restored findings that would
naturally have landed in `unit` (a phrase about pushing logic into pure functions, a phrase
about integration tests being the best value-per-test) were placed in `triage`'s Figure 1
instead, because `unit` had 0.07 screens of headroom and nowhere to put them.

---

## Coverage, doc against app

All ten of the coverage walk's findings are closed. Findings are numbered as the walk
itself numbered them — 0 is the structural one, 1 through 8 are content, 9 is a hazard the
doc does not carry but the app's copy-button did.

| Doc section | App | Notes |
|---|---|---|
| Front matter — blockquote and "When this actually happens" | `triage` | Full, both verbatim. The blockquote renders as an actual `<blockquote>`; the timing line links to 05-development |
| `## Entry criteria` | `triage` | Full. Both bullets, the first linking to 04-project-setup, the second's "that is the real one" reasoning carried whole |
| `### The one question worth asking` | `triage` | Full. The question stated as prose, then `TriageDrill` — six changes, scored against it |
| `### The distribution` | `triage` | Full. Figure 1, `DISTRIBUTION`'s four tiers; carries the restored "push logic into pure functions" (unit tier) and "best value-per-test in the whole suite" (integration tier) clauses (**findings 3 and 4**, closed) |
| `### Unit tests` | `unit` | Full. `ARTIFACTS.pricing` annotated, the integer-cents line, six edge-case probes as a `RevealList` (`PROBES`); the negative probe now names a negative price alongside the over-100%-discount case (**finding 8c**, closed) |
| `### Integration tests` | `integration` | Full. `ARTIFACTS.actions` annotated, the second-test `Callout`, `mock`/`test-fixture` term wraps, the Docker/service-container line. `asUser`/`getInvoice`, called but never defined in the doc's own fence, are now annotated as reader-supplied helpers (**finding 9**, closed) |
| `### E2E tests` | `e2e` | Full. `ARTIFACTS.checkout` annotated, a class-selector-versus-role `Contrast`, the `@smoke` tag linked to stage 14, the `waitForTimeout` trap as a `Callout` |
| `### Test-first, mostly` | `teeth` | Full. Three "earns its keep" cases as a `RevealList` (`TEST_FIRST_ROWS`), the exploratory-UI exception carried after it |
| `### The teeth check` | `teeth` | Full. `TeethCheck` — three verdicts to judge, two of them the documented ways a check lies and one a real bite, drawn from this repo's own `stage-implementation-101.md` |
| `### Invariant tests over hand-edited data` | `teeth` | Full. The thirteen-tests/four-fail claim about this playbook's own stage registry, stated as prose |
| `### What not to test` | `restraint` | Full. Five rows as a `RevealList` (`RESTRAINT_ROWS`); the presentational row now carries the component-test carve-out verbatim rather than the misleading "covered incidentally by E2E" it shipped with — the most misleading gap of the eight (**finding 1**, closed) |
| `### Coverage` | `restraint` | Full. A payment-logic/settings-page `Contrast`, the "blanket 80% threshold" number (**finding 8b**, closed), and the CI-scoping instruction that had been the section's sole missing sentence (**finding 2**, closed) |
| `### AI in testing` | `done` | Full. `AI_PREMISE`, all three sentences, and six `PLAYS`. The Superpowers-plugin attribution on the `bug-to-test` play is restored (**finding 7**, closed), and the closing "what none of this replaces" paragraph is restored as a new `AI_LIMIT` export, rendered as a sibling callout (**finding 5**, closed) |
| `## Artifacts` | `done` | Full. `ARTIFACT_LIST`, all four, above the checklist |
| `## Definition of done` | `done` | Full. Seven checkboxes verbatim, persisted per slug |
| `## Scaling to a team` | `done` | Full. Four `TEAM` notes; the "require tests in review" note's `(07)` is now also a real link to 07-code-review, matching how 04/05/14 already render as working links elsewhere in this stage (**finding 6**, closed) |
| `## Traps` | `traps` | Full. All eight, in doc order, as `Callout kind="trap"` |

**Finding 0**, the structural one, does not have a doc row of its own — it was a defect in
three of the tests holding the port, not in the port's content. `triage.test.ts`,
`layers.test.ts` and `ai-plays.test.ts` each asserted only against `docs/06-testing.md` and
never touched an app export, so each was green while the app was missing the exact phrase
it was named for — two of them were. All three now assert against a real `ARTIFACTS`/`OPTIONS`/`LAYERS`/`AI_LIMIT`
literal as well, and a new `Testing.test.tsx` render test pins each of the six restored
findings against the rendered panel by name.

---

## Not ported, deliberately

- **The restored "best value-per-test" phrase lives in one place, not two.** The coverage
  walk's fix instruction named `LAYERS` (rendered by `LayerThread` in the `unit` panel) as
  where to pin it; the panel-weight budget said otherwise. `unit` had zero headroom, so the
  phrase was placed once, in `triage`'s Figure 1 (where `unit`'s own tier already needed
  the sibling "push logic into pure functions" clause), and `layers.test.ts` was rewritten
  to pin a different, already-true `LAYERS` literal that carries the same "bugs live between
  the layers" idea instead. Duplicating one phrase into a second export for a test's sake
  would have been padding, not content.
- **"This question sorts tests better than any percentage target"** is not quoted verbatim.
  The `triage` panel renders the drill's own instruction ("Sort each change below by that
  question, not by habit") in its place, because the sentence is doing a job — pointing the
  reader at `TriageDrill` — that the interactive version does more directly than the
  original line, which was written for a document with no drill to point at.

---

## What holds the port to the doc

Eight data modules read `docs/06-testing.md` at test time through `src/test/doc-source.ts`
— the same shared factory stages 04 and 05 built and pulled out of their own versions,
reused here rather than written a third time. `triage.ts`, `layers.ts`, `teeth.ts`,
`probes.ts`, `checklist.ts`, `traps.ts`, `ai-plays.ts` and `artifacts.ts` each carry a
sibling `*.test.ts` that derives its expected content from the file on disk rather than
from a count typed into a brief.

`artifacts.ts` holds its three blocks (`pricing`, `actions`, `checkout`) character-for-
character against the doc's fenced code, compared whole with `toBe` rather than by
containment (**D-66**) — `toContain` cannot see a truncated artifact, and this stage's one
real hazard (`asUser`/`getInvoice` called but never defined) lives inside a block the test
holds to that standard.

`teeth.ts` is the one module with no doc anchor of its own — its three cases are original
to the app, drawn from `docs/learnings/stage-implementation-101.md`'s own catalogue of ways
a teeth check lies, rather than from the doc. Its correctness rests on review rather than a
sync test, the same position stage 05's `snippets.ts` was in.

`prose.test.ts` is not scoped to stage 06 at all: it walks every hand-authored data module
in the feature folder and fails on any authored string carrying markdown link syntax, since
`InlineCode` does not render it and a link ships as literal bracket-and-paren text on the
page (the same failure class **D-67** named for backticks). It discovers modules
structurally rather than by a maintained filename list, so a data module added in a later
stage-06 fix does not need this file edited to be covered. It is a near-verbatim port of
stage 05's `prose.test.ts` rather than new writing — the doc-filename swaps and this stage's
own doc-anchor examples travelled across, and the whole-branch review's M10 caught three
references (`Development.tsx`'s `STUCK_MOVES`, `snippets.ts`'s `code` field) the port had
left pointing at stage 05's files instead of `Testing.tsx`'s `DISTRIBUTION`/`RESTRAINT_ROWS`
and this stage's own `teeth.ts`.

`Testing.test.tsx`, added in the coverage walk's fix wave, is the newest guard and closes
the round's own headline defect: `DISTRIBUTION` and `RESTRAINT_ROWS` are hand-authored
inside `Testing.tsx` rather than in a data module (nothing else needs them independently of
the one figure each renders), so none of the six restored findings had ever been render-
tested before it existed. It asserts each finding reaches the rendered page, panel by
panel — a render test, not a data-module pin, which is strictly stronger: it cannot pass
while a component ignores the data underneath it.

`term-usage.test.ts`, written during stage 05, is not scoped to any one stage — it scans
every `.tsx` under `src/` for `<Term id>` against `TERMS` and held this stage's eight new
terms to the same standard as every other stage's.
