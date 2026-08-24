# Learnings

Teaching guides written for future-you, not for users.

When a round teaches something that cost real time — a gotcha, a wrong assumption, a
thing the documentation does not say — it goes here as a numbered guide rather than
being scattered across commit messages and tracker entries.

The test for whether something belongs: **would you have wanted to read this before
starting?** If yes, write it down while it is still fresh.

These are distinct from the stage docs. A stage doc says how to do the work in general;
a learning guide says what actually happened here, including the parts that went wrong.

Naming: `<topic>-101.md`.

- `stage-implementation-101.md` — what building stage 01 taught: the layout traps, the
  contrast method, the JSX gotchas, and the verification checklist. Extended after stage 04
  with the section-by-section coverage walk, and again after stage 05 with two things that
  round cost: transcribing prose loses the **second** sentence of a two-sentence passage —
  three times, the third inside the wave built to close the first two — and the coverage
  walk only works when it is starved of context, since the plan and the reports are a
  record of intentions and intentions are what make a reader of the panels a poor auditor
  of them. Read it before building stages 06–18.
- `quality-gates-101.md` — what wiring the gates taught: eslint's warnings-exit-0 trap,
  teeth checks as the method, hooks in a subdirectory repo, and why the committed audit
  suite being stricter than the throwaway scripts was a feature. Extended after stage 02
  with the mutation-testing lesson: one mutation is not a teeth check, and the three
  vacuous-test patterns that shipped green against broken code. Extended again after stage
  05, which found **seven** tests that could not fail in the direction that mattered — four
  of them written into the plan before any implementer saw them — and named the cause the
  patterns share: the assertion samples the state in which the property cannot be violated.
  Extended again after the 2026-08 debt round with the distinction that round turned on:
  **a constant stales and a property does not**, and a property can still be vacuous if
  emptiness satisfies it. Read it on any new project's day one, and before writing tests
  for scoring/judgment logic.
- `deploying-101.md` — what W-5's first deploy taught: the three dashboard settings the
  repository cannot express (connected repo, framework preset, root directory), why a green
  build of the *wrong* repository looks exactly like success, `prepare` scripts failing on hosts
  with no `.git`, "no warning appeared" as fake evidence, and why the deployed URL belongs behind
  one env-overridable constant. Read it before deploying anything, and before believing a
  deployment list.
- `cold-reader-testing.md` — how to test whether a teaching doc actually works: an agent
  reads only the doc, forbidden from filling gaps with its own knowledge, and tries to
  produce the real artifact. A beginner persona finds completeness defects; role personas
  answer "is it ready for audience X?" It caught two content defects in stage 02 and
  settled its scope. Extended twice after stage 03. The second run found five gaps
  **the round itself had introduced**, so the report is the middle of the round rather than
  the end, and the fix wave answering it needs its own pass. The third run added the limit of
  the method: it caught two defects only by **executing** the doc's SQL, in a section whose
  prose lectures the reader about silent migration bugs — a backfill that corrupted every
  single-word name, and a loop whose own "repeat until zero rows" comment was false. Reading
  checks whether code says what you meant; running checks whether what you meant is true.
  Read it before calling any stage doc done.
- `decisions-need-tests-101.md` — why a recorded convention with no mechanical check decays
  at the speed of the next round. D-42 (cite headings, not line numbers) was written after
  an audit found 14 of 33 citations wrong, and four days later the next round on the same
  branch staled all 18 that remained — including two that had just been repaired. The two
  that survived were the two already converted. Read it whenever you are about to write
  "from now on we will…" in the tracker. Extended with the sharper version of the same
  failure: a check that runs, passes, and measures the wrong invariant — two branches were
  confirmed to have no files in common and that was reported as "zero conflict risk", when the
  question was whether they still meant the same thing. It cost an app shipping the security
  defect its own doc had just fixed.
  Extended after stage 05 with the narrower case where the check *and* the reasoning both
  exist and only the decision number is missing: a comment arguing why the blurb is not
  synced stopped nobody, and an approved design to reverse **D-36** got as far as
  implementation before the decision surfaced. Reasoning reads as an opinion; a number
  reads as a ruling. Also: a negative confirmed once is a sample of one — the single stage
  checked was the single stage that hid the counter-example. Extended after the 2026-08 debt
  round, where **three of four debt entries turned out to be wrong about themselves** — a
  recorded *diagnosis* decays the same way a convention does, and one of them was a
  sentence about to become a paragraph in a teaching document. Read it before turning any
  recorded finding into a deliverable.
- `contrast-checkers-lie.md` — the three ways a colour audit reports a failure that is not
  there: reading `getComputedStyle` while a `transition-colors` is still running, parsing
  `oklab()` with a regex instead of rasterizing it, and passing green over surfaces it
  never looked at. Each has happened here. Read it before changing a token in response to
  a contrast number.
- `rules-measure-the-wrong-thing-101.md` — what superseding D-38 taught: a rule can be right
  about what it cares about and wrong about what it counts. D-38 capped a stage's step count,
  reasoning that "a stepper stops being navigable when a step is a scroll" — a claim about
  panel weight, enforced by counting panels, which for fixed content moves the opposite way.
  It had also already been broken by stage 02 without a recorded deviation, so the project
  carried two disagreeing numbers for two stages. Measuring settled it: stage 03's *median*
  panel was 5.3 screens against 2.4 and 2.5 elsewhere, the stage with the most steps also
  having the heaviest panels. Includes the test that both bounds an allowlist and stops it
  rotting, and the half-mitigation a reviewer caught in the first version of it. Read it
  before writing any rule with a number in it.
