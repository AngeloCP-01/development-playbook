# Decisions need tests

A decision you write down and cannot check decays at the speed of the next round. This one is
documented because it happened here, twice, on the same branch, to the person who made the
decision.

## What happened

Stage 03's app cites the doc it was ported from. Every component carries a comment like:

```ts
/** Source: docs/03-architecture.md:130-142, "Boundaries inside the monolith". */
```

Mid-round, an audit found **14 of 33 of those citations wrong**. Four had been staled by that
round's own doc edits; ten were inherited from the round before. The worst was off by about 86
lines. Every one of them looked perfectly well-formed — a plausible file, a plausible range,
no syntax error, no failing test.

That produced **D-42**: cite a heading, not a line number. The reasoning was sound and written
out at length. A heading changes only when someone deliberately renames a section, which shows
up in a diff; a line number changes when anyone inserts a paragraph three sections above it.
Two citations were converted by hand as demonstration, and a follow-up commit repaired two
more that had staled.

Then the next round on the same branch took that document from 300 lines to 902.

**All 18 remaining citations staled.** Including the two that had just been repaired. The only
two that survived were the two that had been converted to headings — D-42's own argument,
reproduced against its own author, four days later.

## Why the decision alone did not work

It was correct. It was recorded in the tracker with its reasoning. It was discoverable. And it
still failed, for three reasons worth separating:

**Nothing enforced it.** `eslint`, `tsc`, the unit suite and the browser audit all pass with
every citation wrong. D-42 said so in its own text — *"nothing in lint, typecheck, the unit
suite or the audit suite can tell that one has drifted"* — and then the decision was left as
the only defence.

**Conversion was left implicit.** The decision said what the convention *is*, and two
citations were converted to demonstrate it. Nobody wrote "and convert the other 31." A
convention that applies to new code while old code keeps the broken form is a convention with
a growing exception list.

**The decay is silent and delayed.** You do not find out at the moment of breakage. You find
out when somebody follows a citation into unrelated prose and loses twenty minutes, which
happens months later, to someone who was not there.

## The fix, and what made it hold

One test, about forty lines, doing two things:

```ts
test('no source citation uses a line number (D-42)', ...)
test('every cited heading exists in the doc it names (D-42)', ...)
```

The first bans the form outright rather than discouraging it, because a stale line number is
invisible and a banned one is not. The second resolves each cited heading against the real
headings in the file it names, so renaming a section fails at the rename instead of drifting.

Both were teeth-checked, which is what separates this from a test that would have shipped
green over the same defect:

- Reintroduce a line number → the first fails, naming the file.
- Rename a cited heading in the doc → the second fails, naming **both** files that cite it.

Then all 27 remaining citations were converted, across both stages, in the same commit — not
only the ones that had broken. The ones in stage 02 were still correct at the time. They were
the same latent defect waiting for the next edit to that document.

## The general shape

When you record a convention, ask the three questions in order:

1. **What would catch a violation?** If the honest answer is "someone noticing", the
   convention will decay. Find the cheap mechanical check, or accept that you are writing an
   aspiration rather than a rule.
2. **Does it apply retroactively?** If yes, convert everything now. A convention with a
   grandfathered set is two conventions, and the old one wins by volume.
3. **How long until a violation surfaces?** The longer the delay, the more the check is worth,
   because delayed feedback is what makes a defect expensive rather than annoying.

Not every decision needs a test. D-45 (a doc may run long) and D-46 (this round is doc-only)
are judgment calls with no mechanical form, and pretending otherwise would produce a test that
asserts nothing. The ones that need tests are the ones that are **mechanically checkable and
silently violable** — file conventions, naming, cross-references, generated files staying in
sync.

The tell: if you can write the violation as a grep, write it as a test instead.

## Related

- `quality-gates-101.md` — teeth checks as the method, and the three vacuous-test patterns
  that shipped green against broken code here.
- **D-36** is the same lesson applied earlier and successfully: the glossary is generated from
  `terms.ts` and guarded by a file snapshot, so it cannot drift. That one was built with its
  check from the start, and it has never broken.
- **D-47** is the same lesson in a different direction: a single-sourced file is also a place
  defects *hide*. `terms.ts` defined `Authorization` with the exact defect three tracker
  entries and a cold-reader pass were trying to fix in prose, because all of them were reading
  prose. Grep the source when you fix a concept.
