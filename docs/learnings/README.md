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
