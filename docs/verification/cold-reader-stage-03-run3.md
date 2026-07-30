# Cold-reader run 3 — stage 03, after W-3.1b

Method: D-32. One agent, allowed to read only `docs/03-architecture.md`, forbidden its own
architecture knowledge, the web, and following any cross-stage link. **Same shift-swap product
as runs 1 and 2**, so all three compare.

**Verdict: PARTIALLY** — "most of the Definition of done, and it is more than the last run."

## The five clusters this round added

| Cluster | Verdict | Note |
|---|---|---|
| Consistency and concurrency | **ACTIONABLE** | "The only cluster that fully closes." Acted on it without inventing anything |
| Statelessness and scaling | **ACTIONABLE** | "Best-scoped cluster in the amendment." The pooler passage called the strongest writing in the doc, because it gives the failure *signature* |
| Resilience patterns | PARTIAL → **fixed** | Timeout and degradation actionable; retry/breaker had no numbers. Breaker now has them |
| Evolve the schema safely | PARTIAL → **fixed** | Six-step shape right, could not *execute* it. Backfill guard, rolling deploys and lock safety all added |
| Fitness functions | PARTIAL, near vocabulary → **fixed** | Definition precise, mechanism absent, examples from the author's infrastructure. Rescoped to a note per characteristic, with building deferred to stage 06 |

## Fixed in the wave that followed

**The security defect, open across all three runs.** G3's edge: the doc said "which pattern
applies to which entity", singular. The reader wrote `Claim → Role`, and produced cross-team
privilege escalation — a Kitchen manager approving a Front-of-House shift. Patterns compose; the
doc now says so with the worked conjunction and the reason it matters: the version with one
pattern missing does not fail, it approves.

**Two contradictions this round introduced.** Widening the trace table made Auditability force
soft delete and Correctness force a locking strategy, while the worked `invoices` DDL had
neither column — two of eight rows contradicted by the schema readers copy from. Both columns
added and traced.

**A third contradiction between two new clusters.** A circuit breaker holds in-memory failure
counts; the statelessness rule forbids in-memory request state. Ten instances means ten
independent breakers. Now stated.

**A false cross-reference, inherited from W-3.1.** The contracts section claimed the
interrogation catches whether a verb is an entity. It did not contain that test. The test was
added rather than the claim deleted, because the reader called it the most useful
noun-derivation heuristic in the document.

**Over-reach, all three findings valid.** Expand-contract was stated unconditionally, so a
pre-launch solo developer with four test users was being told six deploys to rename a column —
ceremony against imagined traffic, in a document that refuses imagined scale. Fitness functions
asked for CI gates before the first table existed. Both rescoped with explicit thresholds.

**Three migration gaps found by executing the steps rather than reading them:** the backfill was
not idempotent (re-running silently reverts corrections, including a user's own edit), rolling
deploys were never stated (which is the entire reason steps 2 and 5 exist), and `ALTER` lock
safety fell between this stage and 13 and was owned by neither.

**Cross-row invariants.** Optimistic locking and the partial unique index sat sixty lines apart
and the doc never said row-level locking does not protect a rule spanning rows. Two managers
approving two *different* claims on the same shift is different rows, both versions match, both
succeed.

**G8, open across all three runs.** A shift at 09:00 Tuesday is a wall-clock fact attached to a
place, not an instant. Third case added.

**Consultability, 3/5 — down from 4/5** because this round lengthened the sections. Eight
subheadings added, TOC glosses rewritten to carry the words readers arrive with. The word
"timeout" had appeared in no heading or gloss anywhere in the document.

## Previously-open items

| Item | Status |
|---|---|
| **G5** — transactions with no isolation level or locking | **CLOSED.** "A clean close" |
| **G8** — no wall-clock/DST case | Was STILL OPEN across three runs → **fixed in the wave** |
| **G3 edge** — patterns in conjunction | Was STILL OPEN across three runs → **fixed in the wave** |
| **G1** — noun-derivation strike test has no general rule | **STILL OPEN.** The entity-vs-verb half is now answered; the property-vs-entity half is still one example |
| **G6** — soft-delete mechanic | **Partially closed.** `deleted_at` is now shown in the DDL with its cost named; the general choice between column, status and archive table is still unspecified |

## Still open — recorded, not fixed

- **G1's property-vs-entity strike test** still rests on one example (`total` is not an entity).
- **G6's general mechanic** — column versus status versus archive table, and how queries stop
  forgetting the filter.
- **No auth dependency in the container diagram.** The sketch has payment, email and blob
  storage; a web app's most certain external dependency is missing, and so is its down-case.
  Changing the diagram is a bigger edit than this wave took on.
- **Outbox cadence.** "Record the intent and send later" is the doc's own answer for a
  notification dependency, and the only scheduled job it shows runs daily — which is useless for
  a 6am shift confirmed the night before. Cadence is stage 11's, and the seam is not stated.
- **Batch iteration mechanism** beyond `LIMIT` (keyset pagination, loop construct) — the doc now
  gives a batch size and the guard, not the loop.

## What the reader could complete unaided

Characteristics traced to decisions, style chosen with alternatives rejected, the tenant axis
(the nested-tenancy rule "answered my company-versus-team question outright"), the domain model,
the schema with scoped uniqueness and the partial unique index, indexes traced to queries, the
single-row concurrency fix, feature boundaries, contract sorting including the verb-shaped route
question, and ADR scoping.
