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
  contrast method, the JSX gotchas, and the verification checklist. Read it before
  building stages 02–18.
- `quality-gates-101.md` — what wiring the gates taught: eslint's warnings-exit-0 trap,
  teeth checks as the method, hooks in a subdirectory repo, and why the committed audit
  suite being stricter than the throwaway scripts was a feature. Extended after stage 02
  with the mutation-testing lesson: one mutation is not a teeth check, and the three
  vacuous-test patterns that shipped green against broken code. Read it on any new
  project's day one, and before writing tests for scoring/judgment logic.
- `cold-reader-testing.md` — how to test whether a teaching doc actually works: an agent
  reads only the doc, forbidden from filling gaps with its own knowledge, and tries to
  produce the real artifact. A beginner persona finds completeness defects; role personas
  answer "is it ready for audience X?" It caught two content defects in stage 02 and
  settled its scope. Extended after stage 03's doc round, where the re-run found five gaps
  **the round itself had introduced** — so the report is the middle of the round, not the
  end, and the fix wave answering it needs its own pass. Read it before calling any stage
  doc done.
- `decisions-need-tests-101.md` — why a recorded convention with no mechanical check decays
  at the speed of the next round. D-42 (cite headings, not line numbers) was written after
  an audit found 14 of 33 citations wrong, and four days later the next round on the same
  branch staled all 18 that remained — including two that had just been repaired. The two
  that survived were the two already converted. Read it whenever you are about to write
  "from now on we will…" in the tracker.
- `contrast-checkers-lie.md` — the three ways a colour audit reports a failure that is not
  there: reading `getComputedStyle` while a `transition-colors` is still running, parsing
  `oklab()` with a regex instead of rasterizing it, and passing green over surfaces it
  never looked at. Each has happened here. Read it before changing a token in response to
  a contrast number.
