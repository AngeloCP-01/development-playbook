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

## The same failure, one layer up: verifying the wrong invariant

The guide above is about a decision with no check. There is a sharper version where the check
exists, runs, passes, and was measuring something that did not matter.

Stage 03's doc round ran in parallel with the port of that same doc into the app. Before
starting, the branches were checked for file overlap. There was none — the doc round touched
`docs/03-architecture.md` and `terms.ts`, the port touched `web/src/features/architecture/`. On
that basis the conclusion was "zero conflict risk", and it was reported that way.

The merge was in fact clean. The conclusion was still wrong, because **the port's data files are
the doc's content in another form.** That is what a port is. So editing the doc always changes
what the port owes, no matter which files each branch happens to touch. The check answered "will
git need me to resolve anything" when the question was "will these two things still agree".

What it cost: the app shipped an authorization exercise whose answer key taught the exact framing
a whole-branch review had already found produces cross-team privilege escalation. The doc was
fixed; its copy in `contracts.ts` was not, and nothing flagged the gap because the branches were
"disjoint".

**The general shape.** When a check passes, ask what it would have caught. `git merge-tree` can
tell you two branches merge; it cannot tell you they mean the same thing. Mechanical
independence and semantic independence are different properties, and only one of them has a
command.

The rule that came out of it is **D-51** — a stage's doc and its port never run concurrently,
and they merge as one unit — plus a continuously updated coverage map
(`docs/stage-03-status.md`) rather than discovering divergence at review time. Twice was enough.

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

---

## A recorded diagnosis decays the same way, and nothing marks the day it stops being true

This guide is about conventions that decay without a mechanical check. A debt entry's
**diagnosis** decays for the same reason and is more dangerous, because it reads as
finished work.

Four High-severity debts were closed in one round. Three of the four were wrong about
themselves.

The clearest was TD-32. Its entry said, in bold: *"Turbopack does not re-evaluate `env.ts`
when `.env.local` changes."* It was closing a defect in a teaching document, so that
sentence was about to become a paragraph a reader would follow.

Running it took twenty minutes and disproved it. Turbopack **does** re-evaluate, in the
same process, with no restart. What misleads is a window one request wide: the request that
lands before the reload takes effect is answered by the evaluation already in memory and
returns 200; every one after returns 500. Four trials, deterministic, on two Next versions.

```
trial 1 | healthy=200 | after blanking: 200 500 500 500 500 500
trial 2 | healthy=200 | after blanking: 200 500 500 500 500 500
trial 3 | healthy=200 | after blanking: 200 500 500 500 500 500
```

Both the entry and the corrected paragraph tell the reader to restart, so a reader following
either one ends up in the right place. That is exactly why this is worth a section: **the
instruction was right and the reason was wrong, and only the reason transfers.** A reader
told "Turbopack never re-evaluates" carries a false model into their next framework. A
reader told "the validation runs once at module evaluation, so re-testing it means causing
another one, and until that finishes the old evaluation answers" can work out what to do
anywhere.

### Why the entries were wrong, which generalises further than these four

They are not sloppy. They are the most careful records this project keeps, with measured
numbers and named commits. Each was wrong for the same structural reason:

**Every one was written from a single observation at the moment of discovery, and never
re-run.** TD-32's entry admits it in its own text — *"Observed there and not re-run for
this entry, which is why the restart is stated as the fix rather than as the only fix."*
That sentence is doing real work: the author knew the exposure and wrote it down. It still
took someone re-running the thing to convert the caveat into a correction.

TD-26 failed differently and worth naming separately. Its `Closes with:` specified
asserting a **pinned count** of expandables. A file written *after* that entry
(`e2e/count-expandables.mjs`) records the count moving 108 → 140 in ten days with no defect
in between, and says outright that the number is not a constant to assert against. Nobody
reconciled the two. **A debt entry is a snapshot; the repo kept learning after it was
written, and the entry did not.**

### The rule

**Before a recorded diagnosis becomes a deliverable, re-run it.**

Not before quoting it in conversation, and not before ranking it. Before it turns into a
paragraph in a document, a test's rationale, or a fix's design. The cost is minutes. The
failure mode it prevents is publishing a mechanism that is not real, in the document the
debt exists to correct.

Two cheap habits that would have caught all three:

- **Grep for anything written after the entry that touches the same subject.** The file
  that contradicted TD-26 was sitting in the same directory as the code it described.
- **Treat "not re-run" in an entry as a to-do, not a disclaimer.** It is the author telling
  you where the soft ground is.

Recorded as **D-50** for executable content, extended to recorded diagnoses as **D-85**.

## A decision whose number is not written next to the code reads as a habit

Added 2026-08-20, after this nearly reversed a decision that was right.

A coverage audit found two sentences of `docs/05-development.md` missing from its app. The
fix looked obvious: `stages.ts` has a `blurb` field, the doc has a `>` subtitle, sync them.
Before proposing it, one other stage was checked — stage 04 — and its blockquote was not
carried either. One check, generalised into "no stage carries this", recorded as a numbered
decision, and taken to the user as a design with three options.

All of it was wrong:

- **Three stages carry it verbatim.** Stage 04 was the one stage that paraphrases, so the
  grep that "confirmed" the rule had picked the single instance that hides it.
- **The question was already decided.** **D-36** closed TD-2 in July on exactly this: the
  blurb is "two purpose-built strings (doc subtitle vs UI tooltip) that diverge for 15/18 by
  design", so the sync test covers the title only and doc-header generation was rejected.
- **The evidence was identical.** The measurement that looked like drift — 15 of 18 — is the
  same figure D-36 quotes as the reason the divergence is intentional.

The design was approved and implementation had started before the decision surfaced.

**What made it invisible is the transferable part.** The test file carried the reasoning:

```ts
// The blurb is deliberately NOT checked: the doc's `>` line is a prose subtitle
// and stages.ts's `blurb` is a UI tooltip/header string ...
```

Accurate, well-argued, and it stopped nobody — because reasoning in a comment reads as one
engineer's opinion, and an opinion is something a later reader will improve on. The same
sentence ending in `(D-36)` reads as a ruling with a paper trail, and the natural next move
becomes "read D-36" rather than "write the sync test".

Two habits follow:

- **Cite the decision number in the code it constrains.** Not the argument instead of the
  number — the argument *and* the number. `decisions-need-tests-101` is about decisions
  that cannot be checked; this is the narrower case where the check exists, the reasoning
  exists, and only the provenance is missing.
- **A negative confirmed once is not confirmed.** "I looked and it wasn't there" is a sample
  of one. When a check is about to become a rule, sample until you find the counter-example
  or run out of instances. Here there were seventeen other stages and the answer was in the
  first three.

This is the second time this project has generalised from one silence — **D-73** records the
first, where one document's omission was read as the framework's behaviour. Both times the
controller did the generalising, and both times a written record already held the answer.
