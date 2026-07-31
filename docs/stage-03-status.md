# Stage 03 — implementation status

**What this is:** the coverage map for stage 03, doc against app, section by section. It
exists because this stage has now diverged from its own port twice, and both times the
divergence was discovered rather than tracked.

**Last verified:** 2026-07-31, on `feat/stage-03-app-port` at `abaa6e2`, four tasks into the
D-52 round.

**Current state:** doc **14 sections / 1344 lines**. App **10 steps**. Glossary **73 terms**.
217 tests across 20 files, and a 12-test audit suite over 24 URLs. Lint and typecheck clean.
Every DDL block in the doc executed against PostgreSQL 17.

**The reshape is mid-flight.** D-52 replaced D-38's step-count ceiling with a panel-weight rule,
and stage 03 is being re-cut to satisfy it. Progress is countable: `PANEL_EXCEPTIONS` in
`web/e2e/audit.spec.ts` holds **7 entries**, two permanent and five stage-03 debt, and each
remaining task deletes its own. **Two entries means done.** The ledger at
`.superpowers/sdd/2026-07-31-step-panel-weight/progress.md` is the authority on what has run.

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
| 3 | Model the domain first | `model` | ✅ **fixed** | Interrogation now at 6 questions; the entity-versus-event one sits before actor-rights, in doc order |
| 4 | The shapes a system can take | `shape` | ⚠️ **partial** | Styles landscape ported. **Statelessness, horizontal/vertical, load balancing, read replicas added after** |
| 5 | Start with one application | `shape` | ⚠️ **partial** | Split triggers ported. **Connection pooling added after** |
| 6 | Boundaries inside the monolith | `shape` | ✅ | Boundary map, bounded context, the write-side rule |
| 7 | Sketch the system | `sketch` | ⚠️ **partial** | Container view, data flow, sync/async, idempotency ported. **Resilience patterns — timeout, backoff+jitter, circuit breaker, graceful degradation — added after** |
| 8 | Design the database | `schema` | ⚠️ **partial** | DDL inspector, ER view, indexes, partial unique index, tenancy ported. `version`, `deleted_at` and the `invoice_sends` block now mirrored and checked against the doc character-for-character. **Still missing: isolation levels, optimistic/pessimistic locking, CAP, eventual consistency** |
| 9 | **Evolve the schema safely** | — | ❌ **not ported** | New section. Expand-contract, rolling deploys, backfill guards, `ALTER` lock safety, strangler fig. **No app step exists** |
| 10 | Design the API contracts | `contract` | ✅ | Contract sort, verb-route problem |
| 11 | Authentication and authorization | `contract` | ✅ **fixed** | Was teaching the singular framing and scoring `role` alone as correct. Now a checkbox conjunction, browser-verified |
| 12 | Write the ADRs | `record` | ✅ | ADR anatomy, one-per-independently-reversible-thing |
| 13 | Defer aggressively | `record` | ⚠️ **partial** | Defer list + criterion + tenancy resolution ported. **Event sourcing / CQRS definitions added after** |
| 14 | AI in architecture | `ai` | ⚠️ **partial** | Seven plays, five misleads ported. **Four plays and one mislead added after** |

**Tally: 6 fully ported · 7 partial · 1 not ported.**

---

## Remaining tasks

### Blocking the branch merge

- [ ] **Port section 9, "Evolve the schema safely."** No step exists. Needs the six-step
      sequence as an interactive artifact, and it is the strongest candidate for a
      guess-then-reveal (which step do people skip?) — the answer is 2 and 5.
- [ ] **Port the five clusters into the eight partial steps.** Resilience into `sketch`;
      isolation/locking into `schema`; statelessness/scaling/pooling into `shape`; fitness
      functions and the widened trace into `require`; event sourcing and CQRS into `record`.
- [x] **Mirror the corrections, not just the additions.** ✓ done 2026-07-31. The sixth
      interrogation question, `version` and `deleted_at` on the invoices DDL, and the
      `invoice_sends` block, rendered as Figure 14. `ddl-sync.test.ts` now holds both
      `CREATE TABLE` blocks to the doc character-for-character, so this class of drift fails a
      test instead of waiting for a reviewer — teeth-checked by changing `DEFAULT 0` to
      `DEFAULT 1`, which failed that test and only that test.
      **One correction claimed here did not exist:** the reversibility lists are byte-identical
      to `main` apart from the new TOC row. `scoring.ts`'s `DECISIONS` needed nothing.
      **One defect found while mirroring:** the doc, `schema-blocks.ts` and a Figure caption all
      said "the answer to the fifth interrogation question" about actor-rights, which became the
      sixth when W-3.1b inserted one before it. Fixed in all three by naming the question instead
      of counting to it — D-47's pattern again, and the third time an ordinal in prose has gone
      stale.
- [x] **Settle the step count once and supersede D-38 with a reason.** ✓ done 2026-07-31.
      **D-52**: a step holds one judgment and its panel stays under four screens at 1024×768;
      count follows content. D-38 capped the wrong quantity — its own reason was about panel
      weight, and capping the count makes panels heavier. Measurement settled it: stage 03's
      median panel was 5.3 screens against 2.4 and 2.5 for stages 01 and 02. D-38 had also
      already been exceeded without a recorded deviation, by stage 02. Spec and plan at
      `docs/superpowers/{specs,plans}/2026-07-31-step-panel-weight*`; **still to be written
      into the tracker and PATTERNS.md** (plan Task 12).
- [x] **Add the new step hashes to `web/e2e/audit.spec.ts`.** ✓ done 2026-07-31, and it was
      worse than "the new ones are missing": the list still named `#constrain` and `#decide`,
      two steps renamed away in W-3, so those URLs fell back to step one and were audited twice
      while `require`, `sketch`, `schema`, `contract` and `record` had never been audited at all
      — with the suite green. Now nine real hashes, 23 URLs, 11/11 passing. A new assertion
      holds every listed hash to resolving to the step it names, teeth-checked by putting
      `#decide` back. **TD-12 stays open**: the list is still hand-written, and forgetting to add
      a step still audits nothing. What closed is the half that lied.
- [ ] **Whole-branch review, covering doc and app together.** The port half has never been
      reviewed — 31 commits, +9,446 lines, and the last review of this stage's app caught two
      blocking defects including one where sighted and screen-reader users were told opposite
      things.
- [ ] **Re-run the audit suite.** The ASCII diagrams and wide tables are the 320px overflow
      risk; the new checkbox group in `AuthzPatterns` needs a contrast and touch-target pass.

### Known gaps in the doc, recorded not fixed

From the third cold-reader run — full report in
`docs/verification/cold-reader-stage-03-run3.md`:

- [ ] **Capacity estimation is absent.** One hit for `capacity|back-of-envelope|QPS|throughput`
      across the whole doc, and it is the phrase "write throughput" in a trade-off list. It is a
      standard part of system design, so it passes D-49's filter — but the *heavy* version (size
      a cache, plan for 10M users) is what "Designing for imagined scale" exists to refuse. The
      light version earns its place and is what the index section already assumes without asking
      for: roughly how much data will exist in a year, and how fast it arrives. Frame as "you
      need one number, not a model", and place it near indexes rather than in its own section.
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
