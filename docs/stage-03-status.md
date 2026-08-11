# Stage 03 — implementation status

test
**What this is:** the coverage map for stage 03, doc against app, section by section. It
exists because this stage has now diverged from its own port twice, and both times the
divergence was discovered rather than tracked.

**Last verified:** 2026-08-03, on `feat/stage-03-app-port` at `5afbe09` — the D-52 round, the
eight recorded doc gaps, cold-reader run 4 and its fix wave, the D-48 verification pass, and
the whole-branch re-review's five Important findings all closed.

**Current state:** doc **14 sections / 1507 lines**. App **22 steps**. Glossary **73 terms**.
313 tests across 26 files, and a 14-test audit suite over 36 URLs. Lint and typecheck clean.
Every DDL block in the doc executed against PostgreSQL 17, and the backfill loop's _behaviour_
executed too — the re-review's I1 was a correctness bug no amount of reading would have caught,
found only by running the wrong instruction against 5000 rows and counting what it skipped.

**The reshape is done.** D-52 replaced D-38's step-count ceiling with a panel-weight rule, and
stage 03 has been re-cut to satisfy it. `PANEL_EXCEPTIONS` in `web/e2e/audit.spec.ts` is back
to its **two permanent entries**, which was the plan's stated exit condition, and the
panel-weight test passes against all 22 steps — nothing over four screens, `trace` included.
Task 11 changed the panel measurements last taken (`model` heaviest at 3.7, 2.7 median before
`require` split); a fresh table over all 22 panels belongs to the whole-branch review, not this
file. The ledger at `.superpowers/sdd/2026-07-31-step-panel-weight/progress.md` is the
authority on what has run.

**Twenty-two steps was not a target.** Every split was forced by a measurement, and several
landed one step later than the plan proposed because the plan's seam measured wrong. Count
follows content is what D-52 says; this is what it produced for the densest of the eighteen.

---

## Why this file exists

Stage 03 is two deliverables from one body of content, and the app's content is hand-ported
rather than generated (`CLAUDE.md`). That duplication is accepted; what is not accepted is
widening it silently. It widened twice:

- **W-3.1** rewrote the doc after the app was built → TD-23.
- **W-3.1b** rewrote the doc _while_ the port was in flight → the port's data files ended up
  encoding a superseded doc, including one security-relevant defect.

The rule that came out of it: **a stage's doc and its port never run concurrently, and they
merge as one unit.** This file is how that stays visible.

---

## Section-by-section coverage

Doc order. "Ported" means the app teaches the same thing, not merely that a component exists.

| #   | Doc section                      | App step                                                   | Ported       | Notes                                                                                                                                                                                                                                                                                                     |
| --- | -------------------------------- | ---------------------------------------------------------- | ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Sort decisions by reversibility  | `reverse`                                                  | ✅           | Axis figure + scored exercise. G14's test promoted here from the AI section                                                                                                                                                                                                                               |
| 2   | What this system has to be       | `require` · `trace`                                        | ✅           | Characteristics picker in `require`; the widened ten-row trace and fitness functions split out into `trace` on measurement (`require` alone ran 4.7 screens). Each trace row now points at the step that makes its decision                                                                               |
| 3   | Model the domain first           | `model` · `worksheet`                                      | ✅ **fixed** | Interrogation at 6 questions, in doc order. Split on measurement: deriving the nouns and writing your own domain down are two acts                                                                                                                                                                        |
| 4   | The shapes a system can take     | `shape`                                                    | ✅           | Styles landscape, and statelessness lifted out as the precondition it is rather than a peer. Vertical/horizontal, load balancing and read replicas ported                                                                                                                                                 |
| 5   | Start with one application       | `oneapp`                                                   | ✅           | Split triggers, and the serverless-to-Postgres pooling edge with its transaction-mode caveat                                                                                                                                                                                                              |
| 6   | Boundaries inside the monolith   | `boundaries`                                               | ✅           | Boundary map, bounded context, the write-side rule                                                                                                                                                                                                                                                        |
| 7   | Sketch the system                | `sketch` · `flow` · `resilience`                           | ✅           | Container view; the flow and the sync/async fork it poses; idempotency; and the four resilience patterns — timeout, backoff+jitter, circuit breaker, graceful degradation — with bulkhead named and not taught                                                                                            |
| 8   | Design the database              | `schema` · `indexes` · `tenancy` · `concurrency` · `races` | ✅           | The heaviest section in the stage, cut five ways on measurement. DDL inspector, ER view, indexes, partial unique index, tenancy, delete behaviour; then isolation levels, both locking strategies, and the cross-row trap as a scored exercise. CAP and eventual consistency named without being oversold |
| 9   | **Evolve the schema safely**     | `evolve`                                                   | ✅           | Was the only section with no step at all. The six-step sequence as a guess-then-reveal on which two get skipped; the pre-launch exemption as the panel's opening; the backfill held to the doc character-for-character by a test                                                                          |
| 10  | Design the API contracts         | `contract`                                                 | ✅           | Contract sort, verb-route problem                                                                                                                                                                                                                                                                         |
| 11  | Authentication and authorization | `access`                                                   | ✅ **fixed** | Was teaching the singular framing and scoring `role` alone as correct. Now a checkbox conjunction, browser-verified. Split out of `contract`: what the API promises and who may invoke it are different decisions                                                                                         |
| 12  | Write the ADRs                   | `record`                                                   | ✅           | ADR anatomy, one-per-independently-reversible-thing                                                                                                                                                                                                                                                       |
| 13  | Defer aggressively               | `record`                                                   | ✅           | Defer list + criterion + tenancy resolution, plus event sourcing and CQRS — CQRS as the seventh deferral-list item the port had dropped, event sourcing with the audit-table boundary the doc argues (an audit table alongside normal rows is not event sourcing)                                         |
| 14  | AI in architecture               | `ai`                                                       | ✅           | Nine plays and six misleads, which is what the doc has — the brief said eleven and four-new, and both were wrong. A test now counts the doc's own bullets and a second holds the app's order to it                                                                                                        |
| —   | Traps + further reading          | `traps`                                                    | ✅           | Not a doc section; the stage's closing set, which is how stage 02 closes too. Left in the AI panel until this round only because that panel was last                                                                                                                                                      |

**Tally: 14 fully ported · 0 partial · 0 unported.** The last cluster — fitness functions with
the widened trace, and the deferred-concept definitions — closed in `9798286`, Task 11 of the
plan.

---

## Remaining tasks

### Blocking the branch merge

- [x] **Port section 9, "Evolve the schema safely."** ✓ 2026-07-31 — the `evolve` step, 3.3
      screens on its first measurement. Guess-then-reveal on which two of the six get skipped;
      the answer is 2 and 5, and the exercise asks the question the verdict grades rather than
      asking for a confession and scoring a prediction.
- [x] **Port four of the five clusters.** ✓ 2026-07-31 — resilience into `resilience`,
      isolation and locking into `concurrency`/`races`, statelessness/scaling/pooling into
      `shape`, and the AI section's two missing plays and sixth mislead into `ai`.
- [x] **Port the last cluster.** ✓ `9798286`. Fitness functions and the widened ten-row trace
      split into a new `trace` step (`require` alone measured 4.7 screens); event sourcing and
      CQRS into `record`. Task 11 of the plan.
- [x] **Mirror the corrections, not just the additions.** ✓ done 2026-07-31. The sixth
      interrogation question, `version` and `deleted_at` on the invoices DDL, and the
      `invoice_sends` block, rendered as a figure. `ddl-sync.test.ts` now holds both
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
      count follows content. Measurement settled it: stage 03's median panel was 5.3 screens
      against 2.4 and 2.5 for stages 01 and 02, and D-38 had already been exceeded without a
      recorded deviation, by stage 02. Written into `docs/tracker.md` and `web/PATTERNS.md`.
- [x] **Add the new step hashes to `web/e2e/audit.spec.ts`.** ✓ done 2026-07-31, and it was
      worse than "the new ones are missing": the list still named `#constrain` and `#decide`,
      two steps renamed away in W-3, so those URLs fell back to step one and were audited twice
      while five real steps had never been audited at all — with the suite green. A new
      assertion holds every listed hash to resolving to the step it names, teeth-checked by
      putting `#decide` back. **Thirteen further hashes were added by hand** as the reshape ran
      — the stage-03 entries went from nine to twenty-two.
      **TD-12 stays open**: the list is still hand-written, and forgetting to add a step still
      audits nothing. What closed is the half that lied.
- [x] **Re-run the audit suite.** ✓ Runs on every task. **14 tests over 36 URLs**: overflow
      320–2560, touch targets, WCAG AA in both themes, zero console errors, the panel-weight
      rule, hash resolution, two guess-then-reveal contracts, and the authz Reset check the fix
      wave added. It caught a real defect this round — SQL blocks in a grid could not scroll,
      because a grid child defaults to `min-width: auto`, so the page scrolled sideways 204px at
      320px. **The fix wave also found that two of these checks were measuring almost nothing:**
      the expandable sweep walked the rail tabs instead of the panel, so across all 36 entries it
      opened five expandables and every page was contrast-checked on its stage's last step with
      nothing revealed. Corrected, it opens 108 and collects 867 distinct colour pairs against
      717 — with zero failures in either theme.
- [x] **Whole-branch review, covering doc and app together.** ✓ 2026-08-03. It was the
      load-bearing one and it earned the name: **seven blocking findings**, two minors promoted
      because they were reader-visible and introduced by this branch, and sixteen minors deferred
      to the tracker. The headline was that the branch's own verification claim was hollow — the
      contrast gate opened five expandables across 36 pages. Four per-task reviews had run before
      it and found **fourteen blocking defects** between them, at a rate that did not fall off:
      the last task reviewed, Task 11, produced three, and the whole-branch review then produced
      seven. Two of the fourteen were factual errors about Postgres that read plausibly and that
      no test could have caught until the tests were rewritten.

### Known gaps in the doc, recorded not fixed

From the third cold-reader run — full report in
`docs/verification/cold-reader-stage-03-run3.md`:

- [ ] **Capacity estimation is absent.** One hit for `capacity|back-of-envelope|QPS|throughput`
      across the whole doc, and it is the phrase "write throughput" in a trade-off list. It is a
      standard part of system design, so it passes D-49's filter — but the _heavy_ version (size
      a cache, plan for 10M users) is what "Designing for imagined scale" exists to refuse. The
      light version earns its place and is what the index section already assumes without asking
      for: roughly how much data will exist in a year, and how fast it arrives. Frame as "you
      need one number, not a model", and place it near indexes rather than in its own section.
- [ ] **G1** — the noun-derivation strike test rests on one example (`total` is not an entity).
      The entity-versus-verb half is now answered; the property-versus-entity half is not.
- [ ] **G6** — the soft-delete _mechanic_ is unspecified (column vs status vs archive table),
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

| Topic                                              | Owner                         |
| -------------------------------------------------- | ----------------------------- |
| Caching patterns (cache-aside, invalidation, TTL)  | 09 — Performance Optimization |
| Observability, alerting, error budgets             | 15 — Observability            |
| Threat modelling, secrets management               | 08 — Security Audit           |
| Running migrations in a pipeline                   | 13 — Production Deployment    |
| ADR format, length, status field, location         | 10 — Documentation (D-39, G9) |
| Authorization _enforcement_ (where the check goes) | 05 — Development              |
| Sharding, table partitioning, event-sourced CQRS   | Named, not taught (D-49)      |

---

## Decisions governing this stage

| #            | What it settles                                                                                                                                               |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **D-37**     | Audience is solo-but-production-grade; stage 03 is the solutions architect's home                                                                             |
| ~~**D-38**~~ | Five content steps + AI was a dense-stage ceiling — **superseded by D-52**                                                                                    |
| **D-52**     | A step holds one judgment and its panel stays under four screens at 1024×768; count follows content. Enforced by measurement in `audit.spec.ts`, not recorded |
| **D-42**     | Cite headings, never line numbers. Enforced by `source-citations.test.ts`                                                                                     |
| **D-44**     | Teach the styles trade-off without changing the recommendation                                                                                                |
| **D-45**     | Full HLD/LLD treatment, accepting the length                                                                                                                  |
| **D-46**     | W-3.1 shipped doc-only — **superseded in practice; doc and port now merge as one unit**                                                                       |
| **D-51**     | The doc is the source of truth for ported content; reconstructing it from memory is what produced a security defect here                                      |
| **D-47**     | Grep `terms.ts` when fixing a concept; it is a place defects hide                                                                                             |
| **D-48**     | A round's fix wave gets its own verification pass                                                                                                             |
| **D-49**     | Completeness beats length for this stage; standard practice is the filter                                                                                     |
| **D-50**     | Executable content gets executed, not read                                                                                                                    |

---

## Verification history

| Pass                                   | Result                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| -------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Cold reader, run 1 (pre-W-3.1)         | 14 gaps, 3 blocking → TD-18                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| Cold reader, run 2 (post-W-3.1)        | 9 closed, 3 partial, G9 deferred. Found 5 gaps the round introduced                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| Cold reader, run 3 (post-W-3.1b)       | 2 clusters actionable first pass, 3 partial. Found a security defect open across all three runs                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| Whole-branch review, W-3.1             | Ready with fixes — 6 blocking, incl. unrunnable SQL and a ticked-but-undone checklist item                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| Whole-branch review, W-3.1b            | Not ready — 5 blocking, incl. a false serializable claim and a backfill that corrupted mononyms. Found by **executing** the SQL                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| Per-task review, D-52 tasks 5–6        | 3 blocking: a `FOR UPDATE` described doing what `SKIP LOCKED` does; an overclaim against SERIALIZABLE enshrined in a test name; a card asserting a thing and its negation                                                                                                                                                                                                                                                                                                                                                                                              |
| Per-task review, D-52 tasks 7–8        | 3 blocking: the retracted overclaim surviving in the step hint; the _destructive_-migration rule applied to an additive step; six checkboxes sharing one accessible name                                                                                                                                                                                                                                                                                                                                                                                               |
| Per-task review, D-52 task 9           | 5 blocking: a false claim that transaction-mode pooling breaks a transactional lock, which the stage's own locking step contradicts; a stale step pointer; two tests passing on strings asserting the opposite of their names; a missing summary line; a stale hint                                                                                                                                                                                                                                                                                                    |
| Per-task review, D-52 task 11          | 3 blocking, 4 minor: a trace row naming a timeout "graceful degradation" against the definition the stage's own resilience step gives; a constant exported, tested and rendered nowhere while the prose beside it was hand-copied twice; a CQRS test asserting three words the topic cannot avoid                                                                                                                                                                                                                                                                      |
| Scoped re-review of the fix wave       | **All nine addressed, 0 open — ready to merge.** Reproduced every measurement from an independent harness and teeth-checked with different injections than the fix used: a constructed thirteenth trap, a fifth boundary edge, a 1.2–1.5:1 colour on leaves reachable only inside an expanded disclosure, and each stale assertion's counter-example planted in the real data and run against the real test file. Raised one Important non-blocking finding of its own (the touch-target exemption widened to excuse one element and exempted 880), fixed in `2734fb4` |
| Whole-branch review, combined branch   | **Ready with fixes** — 7 blocking, 18 minor. The contrast and touch-target gates opened five expandables across 36 pages, so the branch's headline verification claim was measuring the collapsed shell; three of the doc's twelve traps were never ported; the doc's pooler caveat still carried the error its port had already fixed; four more tests could not fail for the reason their names gave. Seven fixed plus two promoted minors; sixteen minors deferred                                                                                                  |
| Cold reader, run 4 (post-gaps)         | **COMPLETE** — the first run to reach that verdict. 4 stalls, 8 guesses. C1–C3, S1, S3, S4 and the partial-index/soft-delete interaction acted on in the fix wave                                                                                                                                                                                                                                                                                                                                                                                                      |
| D-48 verification pass of the fix wave | Built a live Postgres cluster and ran what the wave had only asserted. Confirmed the partial-index and soft-delete claims; found nothing new                                                                                                                                                                                                                                                                                                                                                                                                                           |
| Whole-branch **re-review**             | **Ready with fixes** — 5 Important, 12 minor. I1 was a backfill instruction that silently skipped every row it was meant to migrate; I4 was three sentences hand-counting six boxes against a diagram of eight. All five fixed in `5afbe09` with six minors; M5 and M6 recorded as deferred                                                                                                                                                                                                                                                                            |
