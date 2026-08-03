# Stage 03 Standard Practices Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Close TD-25 — add the five clusters of standard architecture practice missing from all
eighteen docs, so stage 03's ten-item characteristics list has material behind every entry.

**Architecture:** Thirteen `###` subsections become fourteen. One new section (schema evolution);
four clusters extend existing sections. `stage-03-structure.test.ts` is updated with the new
heading and teeth-checked.

**Tech Stack:** Markdown, TypeScript (`terms.ts` only), vitest.

**Spec:** `docs/superpowers/specs/2026-07-30-stage-03-standard-practices-design.md`

## A note on TDD in this plan

Same position as W-3.1, for the same reason: prose has no unit test and inventing one produces
the vacuous tests the teeth-check convention exists to catch. What is real:

- **Every task adding glossary terms has a genuine RED → GREEN**: editing `terms.ts` breaks
  `glossary.test.ts`'s file snapshot; `pnpm gen:glossary` fixes it.
- **Task 1 has a second real cycle**: adding a fourteenth heading breaks
  `stage-03-structure.test.ts`, which is updated and re-teeth-checked in the same commit.
- **Prose is gated by Task 7's cold-reader re-run**, not by assertions.

Steps that say "write the section" carry the claims, worked values and named patterns inline.

## Global Constraints

- **D-49 is the scope filter: standard, widely-used practice only.** The test each addition must
  pass: can a solo reader with the doc's worked example act on this? Circuit breaker passes
  (three third-party calls in the sketch). Sharding fails — name it, do not teach it.
- **D-42** — cite headings, never line numbers. `source-citations.test.ts` enforces it.
- **D-47** — grep `terms.ts` before writing prose about a concept.
- **D-48** — the fix wave after the cold reader gets its own verification pass.
- **D-20** — `humanizer:humanizer` before done. Keep the house voice; em dashes stay.
- **Do not touch `web/src/features/architecture/`.** W-3.2 is in flight there. The port of this
  round's content waits for that branch to merge.
- Every task ends with `pnpm test && pnpm lint && pnpm typecheck` green and a commit.
- All commands run from `web/`.

---

### Task 1: Section 9 — "Evolve the schema safely"

The structural change, so it goes first. Everything else extends sections that already exist.

**Files:**
- Modify: `docs/03-architecture.md` — new `###` between "Design the database" and "Design the API contracts"
- Modify: `web/src/lib/stage-03-structure.test.ts` — `EXPECTED` gains a fourteenth entry
- Modify: `web/src/lib/terms.ts`, `reference/glossary.md`

**Interfaces:**
- Consumes: nothing.
- Produces: the expand-contract vocabulary Task 3 refers to when it explains why a version
  column is decide-now.

- [ ] **Step 1: Add the glossary terms (RED)**

Add `expand-contract` and `strangler-fig` to `terms.ts`. Expand-contract's `soWhat` carries the
rule: every step is independently deployable, which is what makes it safe rather than merely
orderly. Strangler fig's names what it is for — replacing something while it keeps running.

```bash
cd web && pnpm test src/lib/glossary.test.ts    # FAIL, snapshot missing both — paste into report
cd web && pnpm gen:glossary && pnpm test src/lib/glossary.test.ts   # PASS
```

- [ ] **Step 2: Update the structure test to expect fourteen (RED)**

In `stage-03-structure.test.ts`, insert `'Evolve the schema safely'` into `EXPECTED` after
`'Design the database'`.

```bash
cd web && pnpm test src/lib/stage-03-structure.test.ts
```

Expected: FAIL — the doc has thirteen headings, the test now wants fourteen, and the diff names
the missing one. **Paste this.** This is the right order: the test states the intended shape
before the prose exists.

- [ ] **Step 3: Write the section**

Heading: `### Evolve the schema safely`, placed immediately after "Design the database".

Open on the debt the stage has been carrying since section 1: it has said four times that stored
data is the expensive kind, and never said what to do when you have to change it anyway. That is
not an argument for getting the schema right first time; it is an argument for knowing the
technique.

**Expand-contract**, also called parallel change. The point is that every step ships on its own:

```
1. Expand    add the new column, nullable. Nothing reads it.
2. Write     write both old and new. Deploy. Now every new row is correct.
3. Backfill  fill the old rows, in batches. No downtime, no long lock.
4. Move      switch reads to the new column. Deploy. Verify.
5. Stop      stop writing the old one. Deploy.
6. Contract  drop it.
```

State the rule that makes it worth naming: **never ship a destructive migration in the same
deploy as the code that needs it.** If the deploy fails, you want the rollback to be a code
rollback, and a dropped column cannot be rolled back. Note that steps 2 and 5 are the ones
people skip, and skipping them is what turns a rename into an outage.

Then the seam with stage 13, stated rather than assumed: **this section owns the *shape* of a
safe change; running it in a pipeline is
[13 — Production Deployment](13-production-deployment.md)'s.** Same seam the stage already uses
for auth and contracts.

**Strangler fig**, briefly, so the deferral in "Start with one application" has a technique
rather than a cliff. When a genuine split trigger fires, you do not rewrite: put something in
front, route one route at a time to the new thing, and delete the old when nothing reaches it.
Name it as the reason "we will split later" is a credible plan and not a hope.

- [ ] **Step 4: Confirm GREEN and teeth-check the structure test**

```bash
cd web && pnpm test src/lib/stage-03-structure.test.ts    # PASS, fourteen in order
```

Then teeth-check the thing that actually matters here: **move the new section** below "Design the
API contracts", re-run, confirm it fails, move it back. A test that passes on a misplaced
section would not have earned its keep. **Record the output.**

- [ ] **Step 5: Update Artifacts and Definition of done**

Definition of done gains: `- [ ] Any change to stored data has an expand-contract sequence, and
no destructive step shares a deploy with the code that needs it`.

- [ ] **Step 6: Gates and commit**

```bash
cd web && pnpm test && pnpm lint && pnpm typecheck
git add docs/03-architecture.md web/src/lib/stage-03-structure.test.ts web/src/lib/terms.ts reference/glossary.md
git commit -m "docs(architecture): teach expand-contract, the technique the stage kept implying"
```

---

### Task 2: Resilience patterns into "Sketch the system"

**Files:**
- Modify: `docs/03-architecture.md` — "Sketch the system"
- Modify: `web/src/lib/terms.ts`, `reference/glossary.md`

**Interfaces:**
- Consumes: the idempotency material already in this section.
- Produces: the timeout/retry vocabulary Task 5's trace table cites under availability.

- [ ] **Step 1: Add the glossary terms (RED → GREEN)**

`timeout`, `exponential-backoff`, `circuit-breaker`, `graceful-degradation`. Jitter is defined
inside `exponential-backoff` rather than getting its own entry — it is a modifier, not a concept.

```bash
cd web && pnpm test src/lib/glossary.test.ts    # FAIL — paste
cd web && pnpm gen:glossary && pnpm test src/lib/glossary.test.ts   # PASS
```

- [ ] **Step 2: Write the patterns, after the existing down-behaviour list**

The section already asks what happens when each box is down and answers three times for the
invoicing example. Those three answers *are* graceful degradation; name them as such, then give
the patterns that produce them:

- **A timeout on every network call.** Most clients default to waiting indefinitely, which
  converts someone else's slow day into your outage. The number matters less than having one.
- **Retry with exponential backoff and jitter.** Backoff because a service that just failed is
  usually recovering and hammering it prevents that. Jitter because without it every client
  retries in lockstep and you have built a thundering herd. And the precondition, which the
  section has already taught: **you may only retry what is safe to retry.** Retrying a charge
  without idempotency is how you bill someone twice.
- **A circuit breaker.** After N consecutive failures, stop calling and fail immediately for a
  cooldown. Frame it honestly: this is the pattern you reach for once retries have made you part
  of the outage rather than a victim of it.
- **Graceful degradation** as the decision, per feature, of what "works without this" means —
  which is the question the three answers above already answered.

Then the solo-scale correction, so this does not read as licence to build a resilience layer on
day one: **for most calls the right answer is a timeout and nothing else.** Retries earn their
place where the call is idempotent and the failure is transient; a breaker earns its place after
you have watched something fail. Name **bulkhead** in one clause as the pattern for isolating
resource pools, and say it rarely earns its keep in a single application.

- [ ] **Step 3: Gates and commit**

```bash
cd web && pnpm test && pnpm lint && pnpm typecheck
git add docs/03-architecture.md web/src/lib/terms.ts reference/glossary.md
git commit -m "docs(architecture): name the resilience patterns the failure question needed"
```

---

### Task 3: Consistency and concurrency into "Design the database"

Closes the hole the cold reader left open in G5.

**Files:**
- Modify: `docs/03-architecture.md` — "Design the database"
- Modify: `web/src/lib/terms.ts`, `reference/glossary.md`

**Interfaces:**
- Consumes: the transaction paragraph already there; Task 1's expand-contract for the
  version-column-is-stored-data point.
- Produces: eventual consistency, which Task 4's read-replica material points at.

- [ ] **Step 1: Add the glossary terms (RED → GREEN)**

`isolation-level`, `optimistic-locking`, `pessimistic-locking`, `eventual-consistency`,
`cap-theorem`.

```bash
cd web && pnpm test src/lib/glossary.test.ts    # FAIL — paste
cd web && pnpm gen:glossary && pnpm test src/lib/glossary.test.ts   # PASS
```

- [ ] **Step 2: Extend the transaction paragraph**

It currently says a transaction commits together or not at all, and stops. Add what the cold
reader asked for:

**Isolation levels.** Postgres defaults to **read committed**, which means a transaction never
sees uncommitted rows and *does* see rows committed by others while it runs. That is enough for
almost everything and it does not prevent the lost update below. **Serializable** does, at the
cost of transactions that fail on conflict and must be retried — which is a real cost, because
your code now needs a retry path.

**The lost update, and the two fixes.** Two people open the same shift, both see version A, both
save. The second write silently erases the first, and no constraint was violated.

- **Optimistic locking.** Add a `version integer NOT NULL DEFAULT 1`, and write
  `UPDATE … SET …, version = version + 1 WHERE id = $1 AND version = $2`. Zero rows updated
  means somebody got there first, and you tell the user rather than losing their work. Note that
  **the version column is stored data**, so by this stage's own axis it is decide-now — and
  adding it later is an expand-contract sequence (Task 1's section).
- **Pessimistic locking.** `SELECT … FOR UPDATE` inside a transaction, which makes the second
  reader wait. Correct when the work is short and conflict is likely; risky when it is long,
  because you are holding a lock and inviting a deadlock.

The rule for choosing: **optimistic when conflict is rare, pessimistic when it is expected.**

**Then the two terms a reader will meet everywhere**, named honestly and briefly so they are not
oversold. **CAP** says that when the network between your nodes fails, you choose consistency or
availability. With one Postgres you have no partition to survive, so it is mostly theory — it
becomes real the moment you add a replica or a second service. **Eventual consistency** is what
you get then: a replica is behind by some amount, so a user can write and immediately not see
their own change. That is a read-after-write anomaly, and it is why reads that must reflect a
just-completed write go to the primary.

- [ ] **Step 3: Gates and commit**

```bash
cd web && pnpm test && pnpm lint && pnpm typecheck
git add docs/03-architecture.md web/src/lib/terms.ts reference/glossary.md
git commit -m "docs(architecture): close the concurrency hole — isolation, locking, CAP"
```

---

### Task 4: Statelessness and scaling into sections 4 and 5

**Files:**
- Modify: `docs/03-architecture.md` — "The shapes a system can take" and "Start with one application"
- Modify: `web/src/lib/terms.ts`, `reference/glossary.md`

**Interfaces:**
- Consumes: Task 3's eventual consistency, for replica lag.
- Produces: nothing.

- [ ] **Step 1: Add the glossary terms (RED → GREEN)**

`statelessness`, `horizontal-scaling`, `read-replica`, `connection-pooling`.

```bash
cd web && pnpm test src/lib/glossary.test.ts    # FAIL — paste
cd web && pnpm gen:glossary && pnpm test src/lib/glossary.test.ts   # PASS
```

- [ ] **Step 2: Statelessness into section 4**

It belongs with the deployment axis, because it is the property that makes the axis mean
anything. **A stateless application keeps no request state in process memory** — sessions go in
a cookie, a table or a store, not a local variable. That is what lets you run several copies
behind a load balancer and what makes the serverless row in the table possible at all, since the
platform starts and stops instances at will. Say plainly that this is why the serverless row was
available to choose: without statelessness it is not.

Then scaling, briefly, because the table promises "scales independently" and never says how:
**vertical** is a bigger machine, simpler, and has a ceiling; **horizontal** is more machines,
needs statelessness, and has effectively none. A **load balancer** in front distributes across
them. **Read replicas** scale reads but not writes, and they lag — which is where the eventual
consistency from "Design the database" arrives in practice.

- [ ] **Step 3: Connection pooling into section 5**

This earns concrete treatment because it is the prescribed stack's best-known failure. A single
Postgres accepts a limited number of connections. Serverless functions scale by starting more
instances, and each one wants its own connection, so traffic that looks moderate exhausts the
limit and new requests fail on connect rather than on anything you wrote. The fix is a
**pooler** between them, which multiplexes many clients onto few connections. State the
consequence for the stage's own recommendation: the default architecture is right, and it has
this one sharp edge, and a reader deploying this stack should expect to meet it.

- [ ] **Step 4: Gates and commit**

```bash
cd web && pnpm test && pnpm lint && pnpm typecheck
git add docs/03-architecture.md web/src/lib/terms.ts reference/glossary.md
git commit -m "docs(architecture): name statelessness, scaling and the pooling edge"
```

---

### Task 5: Fitness functions, and widen the trace table

The round's actual deliverable — the reason the other four tasks exist.

**Files:**
- Modify: `docs/03-architecture.md` — "What this system has to be"
- Modify: `web/src/lib/terms.ts`, `reference/glossary.md`

**Interfaces:**
- Consumes: all four preceding tasks. The new trace rows cite their material.
- Produces: nothing.

- [ ] **Step 1: Add the glossary term (RED → GREEN)**

`fitness-function`.

```bash
cd web && pnpm test src/lib/glossary.test.ts    # FAIL — paste
cd web && pnpm gen:glossary && pnpm test src/lib/glossary.test.ts   # PASS
```

- [ ] **Step 2: Widen the trace table**

It has three rows against a ten-item candidate list. Add the four a reader is most likely to
pick, each tracing to material that now exists:

| Characteristic | What it forces later in this stage |
|---|---|
| Availability | A timeout on every external call; retries where they are safe; a decision about what still works when a dependency is down |
| Scalability | Statelessness, so more instances are an option; a pooler between serverless and Postgres |
| Evolvability | Expand-contract for stored data; boundaries that make a later split mechanical |
| Security | The authorization pattern per entity, not one for the system |

Add one sentence where the table is introduced, so widening it does not read as a list to
complete: **this is a reference for whichever three or four you chose, not a checklist.** The
"pick three or four" rule above it stands.

- [ ] **Step 3: Write the fitness-function close**

The section currently ends on the test that a characteristic tracing to no decision was not
chosen. Extend one step: **a characteristic nothing checks is a characteristic you are hoping
for.** A fitness function is an automated test that one still holds — not a unit test of
behaviour, a test of a property of the system.

Make the examples real rather than hypothetical, and this repo supplies them: a test asserting
no module imports across a feature boundary enforces the rule "Boundaries inside the monolith"
teaches; a build-size budget that fails CI defends a performance characteristic; a query-count
assertion catches an N+1 before it ships. And the self-referential one, which is honest and
cheap: this playbook pins its own document structure with `stage-03-structure.test.ts` and
enforces its own citation convention with `source-citations.test.ts`, because a convention
nothing checks decays — see `docs/learnings/decisions-need-tests-101.md`.

Close on the sequence the whole section now describes: **choose a characteristic, trace it to a
decision, then write the check that tells you when the decision stopped holding.**

- [ ] **Step 4: Gates and commit**

```bash
cd web && pnpm test && pnpm lint && pnpm typecheck
git add docs/03-architecture.md web/src/lib/terms.ts reference/glossary.md
git commit -m "docs(architecture): make the characteristics list honest, and name fitness functions"
```

---

### Task 6: Table of contents, Traps, AI section

**Files:**
- Modify: `docs/03-architecture.md`

- [ ] **Step 1: Add a table of contents**

After the title block, before "Entry criteria". Link the fourteen `###` subsections by anchor.
D-49 removed length as the check, which makes navigability the binding constraint, and the cold
reader listed the absent TOC under still-open.

- [ ] **Step 2: Traps entries for the new material**

In the section's existing voice, one line each:

- **Retrying a write that is not idempotent.** The retry is the bug, not the failure it was
  answering.
- **A destructive migration in the same deploy as the code that needs it.** The rollback you
  wanted is a code rollback, and a dropped column is not one.
- **Reading your own write from a replica.** It is not a race you can fix with a retry; send
  reads that must reflect a just-finished write to the primary.

- [ ] **Step 3: AI plays for the new material**

Where it earns: enumerate failure modes for a dependency, which is a list-generation job it is
good at; draft the six-step expand-contract sequence for a specific column change and check the
order. Where it misleads: asked how to make something resilient, it produces a resilience layer
— retries, breakers and a queue — for three third-party calls, which is the same
reach-for-distribution failure the section already names, wearing different clothes.

- [ ] **Step 4: Gates and commit**

```bash
cd web && pnpm test && pnpm lint && pnpm typecheck
git add docs/03-architecture.md
git commit -m "docs(architecture): add a table of contents, traps and AI plays for the new material"
```

---

### Task 7: Verification

- [ ] **Step 1: Clean-state suite**

```bash
cd web && rm -rf .next && pnpm test && pnpm lint && pnpm typecheck
```

- [ ] **Step 2: Cold-reader re-run**

Fresh agent, may read only `docs/03-architecture.md`, own knowledge forbidden, **same shift-swap
product** as both prior runs so all three compare. Report per cluster, and against the items the
last run left open: G1's strike test, G8's DST case, G5's isolation gap (**should now close**).

- [ ] **Step 3: Act on the report, then verify the fix wave (D-48)**

Fix what is cheap and blocking; record the rest. Then re-check the wave's own additions — read
any SQL as SQL, and re-run the skim over what the wave added. This is the step that was missing
last round and it cost two blocking defects.

- [ ] **Step 4: Link check by script**

Same approach as W-3.1: enumerate every internal link, resolve anchors against real headings,
state the count.

- [ ] **Step 5: `humanizer:humanizer` (D-20)**

Apply what clarifies; keep the house voice. Em dashes stay — density was checked at 0.103
against `02-planning.md`'s 0.124.

- [ ] **Step 6: Consultability pass — the gate that matters now**

Three lookups from the TOC and headings alone, no linear read: "how do I add a column without
downtime?", "my webhook handler keeps timing out, what do I do?", "two users edited the same
row, who wins?" A miss now means a heading is wrong, not that the doc is long.

- [ ] **Step 7: Commit the report**

---

### Task 8: Records

- [ ] **Step 1: `docs/task.md`** — tick W-3.1b, leaving the app-port sub-task open.
- [ ] **Step 2: `docs/tracker.md`** — close TD-25 with cold-reader evidence per cluster; a
      decision on section 9's placement and its seam with stage 13; a `Deferred:` list.
- [ ] **Step 3: `KICKOFF.md`** — project state and round scope.
- [ ] **Step 4:** `docs/learnings/` only if this round taught something the guides do not
      already cover. Do not manufacture one.
- [ ] **Step 5: Commit.**

---

## Verification (after all tasks)

- [ ] `rm -rf .next && pnpm test && pnpm lint && pnpm typecheck` — green
- [ ] Fourteen `###` subsections, in the order Task 1 pinned, teeth-checked
- [ ] Cold-reader re-run reported per cluster; G5 confirmed closed
- [ ] Fix wave verified separately (D-48)
- [ ] Every internal link resolves, counted
- [ ] `humanizer:humanizer` applied; consultability pass recorded
- [ ] Glossary regenerated, never hand-edited
- [ ] **`web/src/features/architecture/` untouched** — the port waits for W-3.2 to merge
- [ ] Whole-branch review before merge
