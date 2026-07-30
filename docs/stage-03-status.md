# Stage 03 — implementation status

**What this is:** the coverage map for stage 03, doc against app, section by section. It
exists because this stage has now diverged from its own port twice, and both times the
divergence was discovered rather than tracked.

**Last verified:** 2026-07-30, on `feat/stage-03-app-port` at the merge of
`feat/stage-03-standard-practices`.

**Current state:** doc **14 sections / 1,336 lines**. App **9 steps**. Glossary **72 terms**.
205 tests across 18 files. Every DDL block in the doc executed against PostgreSQL 17.

---

## Why this file exists

Stage 03 is two deliverables from one body of content, and the app's content is hand-ported
rather than generated (`CLAUDE.md`). That duplication is accepted; what is not accepted is
widening it silently. It widened twice:

- **W-3.1** rewrote the doc after the app was built → TD-23.
- **W-3.1b** rewrote the doc *while* the port was in flight → the port's data files ended up
  encoding a superseded doc, including one security-relevant defect.

The rule that came out of it: **a stage's doc and its port never run concurrently, and they
merge as one unit.** This file is how that stays visible.

---

## Section-by-section coverage

Doc order. "Ported" means the app teaches the same thing, not merely that a component exists.

| # | Doc section | App step | Ported | Notes |
|---|---|---|---|---|
| 1 | Sort decisions by reversibility | `reverse` | ✅ | Axis figure + scored exercise. G14's test promoted here from the AI section |
| 2 | What this system has to be | `require` | ⚠️ **partial** | Characteristics picker + trace exists. **Trace table went 3 → 10 rows and fitness functions were added after the port** |
| 3 | Model the domain first | `model` | ⚠️ **partial** | Interrogation ported at 5 questions. **A 6th was added ("is this a thing, or something that happened to a thing?")** |
| 4 | The shapes a system can take | `shape` | ⚠️ **partial** | Styles landscape ported. **Statelessness, horizontal/vertical, load balancing, read replicas added after** |
| 5 | Start with one application | `shape` | ⚠️ **partial** | Split triggers ported. **Connection pooling added after** |
| 6 | Boundaries inside the monolith | `shape` | ✅ | Boundary map, bounded context, the write-side rule |
| 7 | Sketch the system | `sketch` | ⚠️ **partial** | Container view, data flow, sync/async, idempotency ported. **Resilience patterns — timeout, backoff+jitter, circuit breaker, graceful degradation — added after** |
| 8 | Design the database | `schema` | ⚠️ **partial** | DDL inspector, ER view, indexes, partial unique index, tenancy ported. **Isolation levels, optimistic/pessimistic locking, CAP, eventual consistency, `version`, `deleted_at`, `invoice_sends` added after** |
| 9 | **Evolve the schema safely** | — | ❌ **not ported** | New section. Expand-contract, rolling deploys, backfill guards, `ALTER` lock safety, strangler fig. **No app step exists** |
| 10 | Design the API contracts | `contract` | ✅ | Contract sort, verb-route problem |
| 11 | Authentication and authorization | `contract` | ✅ **fixed** | Was teaching the singular framing and scoring `role` alone as correct. Now a checkbox conjunction, browser-verified |
| 12 | Write the ADRs | `record` | ✅ | ADR anatomy, one-per-independently-reversible-thing |
| 13 | Defer aggressively | `record` | ⚠️ **partial** | Defer list + criterion + tenancy resolution ported. **Event sourcing / CQRS definitions added after** |
| 14 | AI in architecture | `ai` | ⚠️ **partial** | Seven plays, five misleads ported. **Four plays and one mislead added after** |

**Tally: 5 fully ported · 8 partial · 1 not ported.**

---

## Remaining tasks

### Blocking the branch merge

- [ ] **Port section 9, "Evolve the schema safely."** No step exists. Needs the six-step
      sequence as an interactive artifact, and it is the strongest candidate for a
      guess-then-reveal (which step do people skip?) — the answer is 2 and 5.
- [ ] **Port the five clusters into the eight partial steps.** Resilience into `sketch`;
      isolation/locking into `schema`; statelessness/scaling/pooling into `shape`; fitness
      functions and the widened trace into `require`; event sourcing and CQRS into `record`.
- [ ] **Mirror the corrections, not just the additions.** `scoring.ts` carries the
      interrogation set (now 6 questions), the DDL annotations (now including `version` and
      `deleted_at`) and the reversibility lists. `schema-blocks.ts` needs the new columns and
      `invoice_sends`.
- [ ] **Settle the step count once and supersede D-38 with a reason.** The app is at 9 steps
      against D-38's ceiling of 5 content + AI. Section 9 makes 10 likely. "Stage 03 is
      special" is not a reason — stage 04 will make the same argument.
- [ ] **Add the new step hashes to `web/e2e/audit.spec.ts`.** `PAGES` is hand-written
      (**TD-12**) and nothing fails if you forget, so a step can ship unaudited with the suite
      green.
- [ ] **Whole-branch review, covering doc and app together.** The port half has never been
      reviewed — 31 commits, +9,446 lines, and the last review of this stage's app caught two
      blocking defects including one where sighted and screen-reader users were told opposite
      things.
- [ ] **Re-run the audit suite.** The ASCII diagrams and wide tables are the 320px overflow
      risk; the new checkbox group in `AuthzPatterns` needs a contrast and touch-target pass.

### Known gaps in the doc, recorded not fixed

From the third cold-reader run — full report in
`docs/verification/cold-reader-stage-03-run3.md`:

- [ ] **G1** — the noun-derivation strike test rests on one example (`total` is not an entity).
      The entity-versus-verb half is now answered; the property-versus-entity half is not.
- [ ] **G6** — the soft-delete *mechanic* is unspecified (column vs status vs archive table),
      and nothing says how queries stop forgetting the filter.
- [ ] **Normalisation is named, not taught.** 1NF/2NF/3NF appear in one line. The option this
      round was scoped against promised `(1NF-3NF)`; what shipped is the practical rule plus
      the names. Normal forms pass D-49's standard-practice filter, so this is thinner than the
      round's own standard.
- [ ] **No auth dependency in the container diagram.** Payment, email and blob storage are
      drawn; a web app's most certain external dependency is absent, and so is its down-case,
      while the Availability trace row demands one per dependency.
- [ ] **Outbox cadence.** "Record the intent and send later" is the doc's own answer for a
      notification dependency, and the only scheduled job shown runs daily — useless for a 6am
      shift confirmed the night before. The seam with stage 11 is not stated.
- [ ] **Deployment view declined, not recorded as a decision.** Defensible for a one-app
      system and argued in the doc's prose, but it was promised by the option chosen and the
      deviation lives only inside the section.

### Deliberately out of scope

Not gaps — boundaries doing their job. Do not "fix" these here.

| Topic | Owner |
|---|---|
| Caching patterns (cache-aside, invalidation, TTL) | 09 — Performance Optimization |
| Observability, alerting, error budgets | 15 — Observability |
| Threat modelling, secrets management | 08 — Security Audit |
| Running migrations in a pipeline | 13 — Production Deployment |
| ADR format, length, status field, location | 10 — Documentation (D-39, G9) |
| Authorization *enforcement* (where the check goes) | 05 — Development |
| Sharding, table partitioning, event-sourced CQRS | Named, not taught (D-49) |

---

## Decisions governing this stage

| # | What it settles |
|---|---|
| **D-37** | Audience is solo-but-production-grade; stage 03 is the solutions architect's home |
| **D-38** | Five content steps + AI is a dense-stage ceiling — **now exceeded, needs superseding** |
| **D-42** | Cite headings, never line numbers. Enforced by `source-citations.test.ts` |
| **D-44** | Teach the styles trade-off without changing the recommendation |
| **D-45** | Full HLD/LLD treatment, accepting the length |
| **D-46** | W-3.1 shipped doc-only — **superseded in practice; doc and port now merge as one unit** |
| **D-47** | Grep `terms.ts` when fixing a concept; it is a place defects hide |
| **D-48** | A round's fix wave gets its own verification pass |
| **D-49** | Completeness beats length for this stage; standard practice is the filter |
| **D-50** | Executable content gets executed, not read |

---

## Verification history

| Pass | Result |
|---|---|
| Cold reader, run 1 (pre-W-3.1) | 14 gaps, 3 blocking → TD-18 |
| Cold reader, run 2 (post-W-3.1) | 9 closed, 3 partial, G9 deferred. Found 5 gaps the round introduced |
| Cold reader, run 3 (post-W-3.1b) | 2 clusters actionable first pass, 3 partial. Found a security defect open across all three runs |
| Whole-branch review, W-3.1 | Ready with fixes — 6 blocking, incl. unrunnable SQL and a ticked-but-undone checklist item |
| Whole-branch review, W-3.1b | Not ready — 5 blocking, incl. a false serializable claim and a backfill that corrupted mononyms. Found by **executing** the SQL |
| Whole-branch review, combined branch | **Not yet run. Required before merge.** |
