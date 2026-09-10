# Plans are unverified 101

What writing the stage 15 doc round taught, in the four hours between the plan being
committed and it being read again by something that was not its author.

The short version: **nothing in this repository reads a plan.** `pnpm lint`,
`pnpm typecheck`, `pnpm test`, `pnpm build` and `pnpm test:e2e` do not touch
`docs/superpowers/plans/`. Prettier skips markdown by design. The cold reader is
forbidden from reading anything except the one stage doc. So a plan is the single
most trusted artifact in a round and the only one with no checker at all — and it is
trusted precisely because an implementer works from a task slice alone and cannot see
the argument around it.

This is not the same failure as `decisions-need-tests-101.md`. That guide is about a
recorded claim **decaying** — true when written, false three rounds later. This one is
about a claim being **wrong at the moment it is written**, in the artifact nothing
re-reads.

## Two instances, in one plan, on one afternoon

**The arithmetic.** Seven task steps carried a cumulative expectation —
`Expected: PASS, 14 tests.` — and seven of them were wrong, because each was copied
forward from the previous task's line and adjusted by eye rather than by counting the
test blocks the task actually adds. The plan's own self-review caught them, but only
the mechanical half of it did: recounting found them, re-reading had not.

Worth naming plainly, because this repository has a pattern. `KICKOFF.md` has now been
wrong about four separate numbers. The records have been wrong about three more. The
plan had just quietly become the eighth place a wrong number lives, in the same session
that corrected the sixth and seventh.

**The omission that reproduced the defect it was fixing.** The round exists partly to
close C1: `docs/15-observability.md` defined a helper that sent customer email to Sentry
while its own Definition of done required "No secrets or personal data in error reports
**or logs**". The plan fixed the helper, taught `beforeSend` for the error tracker, and
taught **nothing that redacts a log line**. Half the checkbox. The plan reproduced the
defect class it was written to close, about four hundred lines below where it had
diagnosed it.

Neither cold reader could see this — they are only allowed the stage doc, and the stage
doc did not have the flaw yet. The self-review did not see it either, because a
self-review checks each addition against intent, and the intent was right.

## What actually caught it

**A source read after the plan was committed.** The user gathered five references on
observability and asked whether the document needed adjusting. One was an article on
Node.js logging whose ordinary, unremarkable advice included redaction at logger
construction. That is what surfaced the gap — not a reviewer, not a test, not either
cold reader.

**The sources came at the material from a different direction**, which is what makes
this generalise rather than a one-off. Everything else in the round reasoned outward
from the document — what does it say, what does it contradict, what does it omit
relative to its own promises. A source on the subject reasons from the field inward:
here is what people actually do. The two directions fail differently, which is why one
catches what the other cannot.

The corollary is a scheduling instruction rather than a research one. Read a source on
the subject **before** the plan and it shapes the plan, joining the same frame as
everything else. Read one **after** and it audits the plan. Same source, different
value, entirely because of when.

## The mitigations, cheapest first

1. **Recount every number in a plan; never carry one forward.** A count quoted from
   your own earlier paragraph is a copy, not a measurement. This is the same rule
   `KICKOFF.md` states about git state, applied to the artifact that instructs the
   implementer.

2. **Trace each requirement the round claims to close through to a step that closes
   it.** C1's checkbox reads "error reports or logs" — two nouns, and only one of them
   had a task. Read the requirement as a list of nouns and check each has an owner.

3. **Grep the plan for its own forward references before committing.** "Task 11 will
   reconcile this" is a claim with no checker, and this plan had one that no task
   delivered: Task 4 promised a reconciliation of "you do not need a unified platform"
   against an Artifacts entry requiring one dashboard, and Task 11 never picked it up.
   Found by accident, three tasks later. `grep -n "Task [0-9]" ` over your own plan
   costs one command.

4. **Read one external source on the subject after the plan is written.** Not for
   research — the research is done — but as the only reviewer of the plan that is not
   reasoning from inside it.

5. **Number the task you insert; do not renumber the plan.** When the references
   produced new work it went in as `Task 13b`, which keeps the committed numbering
   stable and records honestly that the material arrived after the plan did. A silently
   renumbered plan loses the fact that anything changed.

## What none of this catches

Voice, and whether the prose is any good. `cold-reader-testing.md` already says the
same about documents; it is equally true of plans, and a plan whose prose is pinned
verbatim — as this one's load-bearing sentences are — hands that problem to the
document rather than solving it.

Also: nothing here tells you the plan is too long. 2447 lines for one markdown
document's revision is defensible only because the sections it pins are the ones a test
or a reviewer checks. If a plan is restating prose that nothing will verify, it is a
second copy of the deliverable, and the second copy is the one that goes stale.
