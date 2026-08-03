# Stage 03 completeness — resilience, consistency, evolution

**Round:** W-3.1b · **Closes:** TD-25 · **Date:** 2026-07-30

---

## Problem

Stage 03 was asked a direct question after W-3.1 merged: is it complete against standard,
widely-used software architecture practice? It is not. An audit grepping all eighteen docs for
the vocabulary a reader meets in Richards & Ford, Kleppmann or Newman returned zero hits for
`circuit breaker`, `backoff`, `stateless`, `load balancing`, `read replica`, `optimistic lock`,
`CAP theorem`, `eventual consistency`, `expand-contract`, `strangler` and `fitness function`.

**These are absent from the playbook, not deferred to a later stage.** That distinction is what
makes them debt rather than scope. Caching patterns really do belong to stage 09, observability
to 15, threat modelling to 08 — those boundaries are doing their job. The five clusters below
have no home anywhere.

**The unifying defect.** "What this system has to be" offers a **ten-item candidate list** and
supplies a **three-row trace table**. The cold reader already flagged it: a reader choosing
availability, security or evolvability gets the trace test with nothing to pass it. The missing
seven map onto exactly these clusters. The stage teaches you to choose characteristics it
cannot then help you satisfy.

Stated at its sharpest, because it is the argument for doing this round at all: **for a stage
whose entire thesis is the cost of reversing decisions, it is thinnest on what happens when
things fail or change.**

---

## Goals

1. Every characteristic on the candidate list has material behind it.
2. A reader can answer "what happens when this dependency is down" with a named pattern rather
   than an instinct.
3. A reader can change a column on a live table without downtime, using a named technique.
4. The concurrency hole the cold reader left open in G5 is closed.
5. Nothing added is exotic. Standard practice is the filter (D-49).

---

## Non-goals

**Caching patterns stay with stage 09.** Cache-aside, write-through, TTL and invalidation are
performance work with a measured trigger, and stage 03 already links there. Adding them here
would duplicate a stage and contradict this stage's own "add caching when you have a measured
problem".

**Observability stays with stage 15, threat modelling and secrets with stage 08.** Same
reasoning. Resilience patterns are in scope because they are *design* decisions made before any
code exists; watching them is stage 15's.

**Sharding, table partitioning and event-sourced CQRS get named, not taught.** D-49's filter is
"standard", and standard for a solo developer means knowing these exist and that you do not need
them. Teaching them would be the drift D-44 exists to prevent, in a new direction.

**Bulkhead is named without a worked example.** It is real and it is in the literature, but
isolating thread pools is not a decision a single Next.js application makes.

**The app port is not in this round's doc tasks** — but it *is* in this round. See Architecture.

---

## Constraints

- **D-49 governs scope.** Completeness beats length for stage 03; standard practice is the
  filter. Length stops being the check, so the **consultability pass becomes the gate that
  matters**.
- **D-42** — cite headings, not line numbers. Enforced by `source-citations.test.ts`.
- **D-47** — grep `terms.ts` before writing prose about a concept.
- **D-48** — the fix wave after the cold reader gets its own verification pass.
- **D-20** — `humanizer:humanizer` before done.
- **W-3.2 is in flight** on `feat/stage-03-app-port` (31 commits, a nine-step stage). Verified
  it touches none of this round's files, so the doc work runs in parallel. The port pass waits.
- **Live gates:** `stage-metadata.test.ts`, `glossary.test.ts`, `stage-03-structure.test.ts`
  (must be updated with the new section, and teeth-checked), `source-citations.test.ts`.

---

## Architecture

Thirteen sections become fourteen. Four clusters extend existing sections; one earns its own,
because changing stored data safely is a distinct activity rather than a property of the schema.

```
  1  Sort decisions by reversibility
  2  What this system has to be        + fitness functions · trace table widened
  3  Model the domain first
  4  The shapes a system can take      + statelessness · scaling mechanics
  5  Start with one application        + connection pooling (the serverless+Postgres trap)
  6  Boundaries inside the monolith
  7  Sketch the system                 + resilience patterns
  8  Design the database               + isolation levels · optimistic/pessimistic locking
  9  Evolve the schema safely          NEW · expand-contract · strangler fig
 10  Design the API contracts
 11  Authentication and authorization
 12  Write the ADRs
 13  Defer aggressively
 14  AI in architecture                + plays for the new material
```

Section 9 sits between the schema and the contracts because both are LLD and the reader has
just been told stored data is the expensive kind. It is the technique the stage has been
implying since section 1 and never taught.

### What each cluster contains

**Resilience, into section 7.** The section already asks the right question and answers it with
three product-specific judgements and no patterns. It gains the four that are in every
curriculum: a **timeout** on every network call, because most clients default to waiting
forever; **retry with exponential backoff and jitter**, with the rule that you may only retry
what is safe to retry — which is the idempotency the section already teaches, arriving as a
precondition rather than a footnote; a **circuit breaker**, framed as the answer to "your
retries have made you part of the outage"; and **graceful degradation**, which is what the
section's three existing answers already are, now named. Bulkhead named only.

**Consistency and concurrency, into section 8.** The doc says "use a transaction" and stops.
It gains: **isolation levels**, specifically that Postgres defaults to read committed and what
that does not prevent; **optimistic locking** with a version column and `UPDATE … WHERE version
= $expected`, presented as the lost-update fix — and noted as *stored data*, so it is decide-now
by the stage's own axis; **pessimistic locking** via `SELECT … FOR UPDATE` and when it is
right; **CAP** named honestly rather than reverently, since a single Postgres makes it mostly
theoretical and it becomes real the moment there are replicas; and **eventual consistency** as
a term, which is what a read replica gives you and where read-after-write anomalies come from.

**Section 9, new.** **Expand-contract** (also called parallel change) as a sequence where every
step is independently deployable: add the new column, write both, backfill, move reads, stop
writing the old, drop it. The rule that makes it worth naming: **never ship a destructive
migration in the same deploy as the code that needs it.** Then **strangler fig** for the
service extraction the stage says to defer, so the deferral has a technique attached rather than
being a dead end.

**Statelessness and scaling, into sections 4 and 5.** **Statelessness** first, because it is
what makes both horizontal scaling and the serverless style the stage already teaches possible,
and its absence is why the styles table currently has a hole. Then **horizontal versus
vertical**, **load balancing** briefly, and **read replicas** with their lag pointing at
eventual consistency in section 8. **Connection pooling** goes in section 5 with a concrete
edge: serverless plus Postgres is the stack this playbook prescribes, and connection exhaustion
is its best-known failure. A reader following this playbook will hit it.

**Fitness functions, into section 2.** The idea that a characteristic worth choosing is worth
checking automatically, or it is a hope. Examples grounded in this repo rather than invented:
`stage-03-structure.test.ts` pins a document's shape, `source-citations.test.ts` enforces D-42.
This closes section 2's loop — the trace table says characteristics force decisions; fitness
functions say the decisions get verified.

**The trace table widens** past three rows to cover availability, scalability, evolvability and
security, each tracing to material that now exists. That is what makes the ten-item candidate
list honest and is the reason all five clusters belong in one round.

### Two structural additions

**A table of contents.** D-49 removed length as the check, which makes navigability the
binding constraint instead. At ~1,100 lines the doc needs one, and the cold reader listed its
absence as still-open.

**Traps and the AI section** each gain entries for the new material, matching the existing
pattern rather than appending a block.

### The app port

W-3.1b includes porting its own content, rather than leaving a third round. This is deferred
until `feat/stage-03-app-port` merges, and it is a real cost the round accepts: the new section
and five extensions mean new components plus edits to `styles.ts`, `sketch.ts`,
`schema-blocks.ts` and `contracts.ts` — all files the in-flight port introduces.

---

## Testing

Same honest position as W-3.1: **prose has no unit test, and this spec will not invent one.**

**The real red-green cycle** is `terms.ts` against `glossary.test.ts`'s file snapshot, once per
task that adds terms. Expected new terms: timeout, exponential backoff, jitter, circuit breaker,
graceful degradation, isolation level, optimistic locking, pessimistic locking, CAP theorem,
eventual consistency, read replica, connection pooling, statelessness, horizontal scaling,
expand-contract, strangler fig, fitness function. Final list settled during implementation; a
term earns entry by being used inline.

**The structural change has a test that must be updated, not worked around.**
`stage-03-structure.test.ts` pins thirteen headings; section 9 makes it fourteen. The test is
updated in the same commit as the doc, and **teeth-checked again** — the point of that test is
that a reorder fails, and the reorder that matters here is section 9 landing in the wrong place.

**Prose is gated by the cold-reader re-run**, same shift-swap product as both prior runs so the
three results compare. Per D-48, a fix wave is budgeted after it and the wave gets its own pass.

---

## Verification

1. `pnpm test`, `pnpm lint`, `pnpm typecheck` from a cleaned `.next`.
2. `stage-03-structure.test.ts` updated and teeth-checked.
3. Cold-reader re-run, reported per cluster and against the still-open items from the last run
   (G1's strike test, G8's DST case, G5's isolation gap — G5 should now close).
4. Link check by script, as in W-3.1.
5. `humanizer:humanizer` (D-20).
6. **Consultability pass — the gate that matters now.** Three lookups from headings alone.
   Candidate questions: "how do I add a column without downtime?", "my webhook handler keeps
   timing out, what do I do?", "two users edited the same row, who wins?" With a TOC in place,
   failure here means a heading is wrong, not that the doc is too long.

---

## Documentation updates

- `docs/task.md` — W-3.1b ticked; the app-port sub-task left open until it is done.
- `docs/tracker.md` — TD-25 closed with cold-reader evidence; a decision recording the
  section-9 placement; anything the round deliberately left out.
- `reference/glossary.md` — regenerated, never hand-edited.
- `KICKOFF.md` — project state and round scope.
- `docs/learnings/` — only if this round teaches something the existing guides do not already
  cover. Not assumed.

---

## Risks

**The round becomes a distributed-systems textbook.** The clearest failure mode, and D-49's
"standard" filter is the only thing holding it back. Every addition needs the same test the
styles table passes: can a solo reader act on this, or is it vocabulary for a system they do
not have? Circuit breaker passes (three third-party calls in the worked example). Sharding
fails.

**Resilience content contradicts "defer aggressively".** A reader could finish section 7 and
build retry logic around a payment provider on day one. Mitigation: the patterns are framed as
decisions to *make*, with the cheap answer usually being "a timeout and nothing else" — and the
defer list keeps its criterion.

**Section 9 duplicates stage 13.** Deployment owns migrations-in-CI. The seam: section 9 owns
the *shape* of a safe change (the six-step sequence), stage 13 owns *running* it. Same seam the
stage already uses for auth and contracts, and it needs stating in text rather than assuming.

**The trace table turns into a checklist of twenty.** Widening it works against section 2's own
"pick three or four". Mitigation: the table is a reference for whichever three you picked, not a
list to complete, and the section should say so where the table is introduced.

**Two ports.** Accepted, recorded in TD-25. The risk is that the second pass slips and stage 03
ends up in the same doc/app divergence TD-23 just closed.
