# Stage 03's eight recorded doc gaps — design

## Problem

`docs/stage-03-status.md` carries seven gaps under "Known gaps in the doc, recorded not
fixed", and `docs/verification/cold-reader-stage-03-run3.md` carries an eighth the status
file never picked up (batch iteration). All eight have been recorded since the third
cold-reader run on 2026-07-30.

None of them stalls a reader. Run 3 confirmed the stage is completable unaided, and the
blocking gaps — G3's authorization edge, G5's isolation levels, G8's wall-clock case — were
closed in earlier waves. What these eight have in common is that they are **thinner than
this stage's own standard**: D-49 says completeness beats length and standard, widely-taught
practice is the filter, and each of these is standard practice the stage names without
teaching, or assumes without asking for.

Two of them are worse than thin, because the document contradicts itself:

- The **Availability** trace row promises "a decision about what still works when each
  dependency is down", and the container view omits the most certain external dependency a
  web application has. The row demands a down-case for a box that is not drawn.
- The doc's own answer for a failed notification is "record the intent and send later", and
  the only scheduled job it shows runs daily — which cannot serve a 6am shift confirmed the
  night before.

Leaving them recorded is defensible. Leaving them recorded while the stage's coverage map
reads 14 of 14 sections ported is not, because the next reader of that map concludes the
stage is finished.

## Goals

1. Close all eight, in the doc and in the app **in the same commit** — D-51's "doc and port
   merge as one unit".
2. Leave stage 03 with no open recorded doc gap, so a fourth cold-reader run measures the
   stage rather than a known deficit.
3. Add one guard against the class of drift this round is most likely to introduce: an app
   diagram that stops matching the doc's.

## Non-goals

- **No new steps.** The D-52 reshape spent twelve tasks settling the step structure at 22.
  Re-opening it to hold reference material would trade a solved problem for an unsolved one.
  Where a panel has no headroom, the content goes behind an expand-to-reveal, which
  `PATTERNS.md` sanctions and D-49 explicitly permits — "the threshold is never met by
  teaching less" is about deletion, not about disclosure.
- **No new doc subsection unless a gap has nowhere to live.** Capacity estimation in
  particular is placed *near indexes* rather than in a section of its own, because the heavy
  version of capacity planning is what "Designing for imagined scale" exists to refuse. A
  section invites the heavy version.
- **Not the sixteen deferred minors** from the whole-branch review, nor TD-26's residue, nor
  the `RevealList` de-duplication. Those belong to the merge decision and to their own
  entries. Mixing them in would make the cold-reader run measure two rounds at once.
- **Not a re-litigation of what is deliberately out of scope.** Caching patterns stay with
  09, observability with 15, migration mechanics with 13. This round closes gaps, it does
  not move boundaries.

## Constraints

- **D-49** — standard, widely-used practice is the filter; the exotic stays out. All eight
  pass it, which is why they were recorded rather than dismissed.
- **D-51** — the doc is the source of truth for ported content, and doc and port merge as
  one unit. Reconstructing content from memory is what produced a security defect in this
  stage before.
- **D-52** — a step holds one judgment and its panel stays under four screens at 1024×768.
  Current headroom, measured: `model` 3.7, `schema` 3.6, `evolve` 3.4, `shape` 3.4 are
  tight; `indexes` 1.9, `sketch` 2.3, `tenancy` 2.5, `resilience` 2.7 have room.
- **D-42** — cite doc sections by heading, never by line number. Enforced.
- **D-47** — grep `terms.ts` when a concept is ported, then `pnpm gen:glossary`.
- **D-48** — a round's fix wave gets its own verification pass.
- **D-50** — executable content gets executed. The batch-iteration change touches SQL.
- The branch is `feat/stage-03-app-port`, already 90 commits and already whole-branch
  reviewed. **That review will need re-running before merge**, because it describes a tree
  this round changes. Recorded here so the decision is visible rather than discovered.

## Architecture

Eight tasks, one per gap, each landing doc and app together. No task depends on another, so
they can run in any order; the order below is cheapest-first so that an interrupted round
leaves the most closed.

| # | Gap | Doc home | App home | Panel headroom |
|---|---|---|---|---|
| 1 | Deployment view recorded as a decision | "Sketch the system" | `sketch` prose | 2.3, ample |
| 2 | Capacity estimation | "Design the database", near Indexes | `indexes` prose | 1.9, ample |
| 3 | Outbox cadence and the stage-11 seam | "Sketch the system" | `resilience` prose | 2.7, ok |
| 4 | G1 — property versus entity | "Model the domain first" | inside the interrogation component | 3.7, none |
| 5 | Batch iteration | "Evolve the schema safely" | a fifth `EvolutionNotes` row | 3.4, collapsed |
| 6 | Normalisation 1NF–3NF | "Design the database", its Normalisation subsection | expand-to-reveal in `schema` | 3.6, collapsed |
| 7 | G6 — the soft-delete mechanic | "Design the database" | `tenancy`, beside `DeleteBehaviour` | 2.5, ok |
| 8 | Auth dependency in the container view | "Sketch the system" | `SystemSketch` node | 2.3, ample |

### What each gap says

The content is the design here, so it is settled in the spec rather than left to the plan.

**1. Deployment view.** The doc argues the declination and never records it as a decision.
One sentence in the stage's own vocabulary: the deployment view is declined because for one
application on one platform it duplicates the container view, and it earns its place the
moment anything runs on its own schedule or its own hardware.

**2. Capacity estimation.** One number, not a model: roughly how much data will exist in a
year, and how fast it arrives. Framed as what the index section already assumes without
asking for — you cannot judge whether an index matters without it. The heavy version (size a
cache, plan for 10M users) is named as the thing this stage refuses, so the light version
does not read as a licence for it.

**3. Outbox cadence.** The cadence follows from the promise the feature made, not from a
default. A daily job serves an invoice reminder and cannot serve a 6am shift confirmed the
night before. Where the job runs, how it is scheduled and what happens when a run fails is
[11 — CI/CD](../../11-ci-cd.md)'s and [13](../../13-production-deployment.md)'s; deciding the
cadence the promise requires is this stage's. The seam gets stated rather than implied.

**4. G1, property versus entity.** The strike test needs a rule, not a second example. The
rule: **would you ever need to point at this on its own?** An entity has identity you refer
to later; a property only ever describes something else. `total` fails twice over — it is
derivable from the line items, and there is no circumstance in which you address it. A
second worked case is added so the rule has something to bite on beyond the example that
motivated it.

**5. Batch iteration.** The doc gives a batch size and both guards and stops before the
loop. Add: repeat until the statement reports zero rows, and on a large table iterate by key
rather than by `OFFSET`, because `OFFSET` re-scans everything it skips. `BACKFILL_SQL` is
held to the doc character-for-character by an existing test, so both sides move together or
the suite fails.

**6. Normalisation.** The doc names 1NF/2NF/3NF in one line. Give each a sentence, behind
the practical rule the doc already leads with — store a fact once — so the forms arrive as
the formal name for a rule the reader has already been given, not as theory to memorise.

**7. G6, the soft-delete mechanic.** Three mechanics with the reason each is chosen: a
nullable `deleted_at` column (the default, and what the DDL already shows); a status enum
(which conflates lifecycle with deletion and is why "deleted" as a status goes wrong); an
archive table (for volume, not for auditability). Then the half the doc skips: queries stop
forgetting the filter through a view or a single accessor, never through discipline.

**8. Auth dependency.** A node in the container view, with its down-case. The down-case is
the interesting part and it cross-links: nobody can sign in, and whether existing sessions
survive is the statelessness decision from "The shapes a system can take" — a session in a
cookie or a shared store outlives the provider being down, one in instance memory does not.

## Testing

Three existing guards constrain this work and will fail if a task does half its job:

- `stage-03-structure.test.ts` pins the doc's fourteen subsections in order. No task adds a
  subsection; if one turns out to need it, the test is updated in the same commit and the
  reason recorded.
- `source-citations.test.ts` enforces D-42 on every citation the app makes.
- `evolve.test.ts` holds `BACKFILL_SQL` to the doc's block character-for-character. Task 5
  moves both or fails.

One new guard, in the pattern this branch established twice (`ai-plays.test.ts` counts the
doc's own bullets; `ddl-sync.test.ts` holds two `CREATE TABLE` blocks):

- **The container view's external systems are counted and named against the doc.** Task 8
  adds a node to both sides; without a guard, the next edit to either drifts silently. The
  test reads `docs/03-architecture.md`, extracts the external systems the container view
  names, and asserts `SKETCH_NODES`' externals match — so a doc that grows a dependency
  fails the suite rather than leaving the app a diagram short.

Every task runs the full gate: `pnpm test`, `pnpm lint`, `pnpm typecheck`, `pnpm
format:check`, `pnpm test:e2e`. The panel-weight assertion is the one that matters most,
because six of eight tasks add rendered content.

Tests assert the *claim*, not the vocabulary. This branch shipped six tests whose names
outran their assertions, twice in tests cited in a commit body as the fix; every new
assertion in this round is verified by running it against a counter-example before it is
trusted.

## Verification

1. **Per task:** the full gate, plus a browser pass on any panel whose rendered content
   changed, at 320px and 1440px in both themes.
2. **After all eight:** a **fourth cold-reader run**, same shift-swap product and same
   constraints as runs 1–3, so the results are comparable. The report goes to
   `docs/verification/cold-reader-stage-03-run4.md`.
3. **Then a fix wave, budgeted rather than hoped for.** Every run so far has found gaps the
   round itself introduced — run 2 found five, run 3 found three contradictions and a
   security defect open across all three runs. D-48 applies: the fix wave gets its own
   verification pass.
4. **Then the whole-branch review is re-run** over the enlarged diff before merge. The
   existing one describes a tree this round changes.

## Documentation updates

- `docs/stage-03-status.md` — the eight items move from "recorded not fixed" to closed, with
  the commit that closed each. The tally line and the "last verified" SHA move with them.
- `docs/tracker.md` — a Completed row for this round, with evidence and a Deferred list. If
  the cold-reader run finds new gaps, they are recorded there rather than silently absorbed.
- `docs/verification/cold-reader-stage-03-run4.md` — the run's report.
- `docs/task.md` — the round's entry and its checkboxes.
- `reference/glossary.md` — regenerated if any task adds a term to `terms.ts`. Never
  hand-edited.

## Risks

**The auth node is the largest edit and the report said so.** It changes a hand-drawn ASCII
diagram in the doc, a laid-out component in the app, and touches the Availability trace row's
promise. Sized as its own task, done last, and guarded by the new count test.

**Six of eight tasks add rendered content to panels, two of which have no headroom.** The
placement table is designed so the tight panels take zero visible height, but the assumption
gets measured per task rather than trusted. If a panel crosses four screens, the content
moves behind an expand-to-reveal — not into a new step, and not deleted.

**The cold-reader run will find things this round introduces.** Three of three did. The risk
is not that it finds them; it is treating its report as the end of the round. The fix wave
is scheduled.

**The doc changes under an app that mirrors it.** This is the TD-23 failure mode, and the
mitigation is structural rather than procedural: every task commits both sides together, and
three tests already fail when one side moves without the other.
