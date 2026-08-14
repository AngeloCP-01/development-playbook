# Development Playbook — Master Tasks

**Purpose:** the complete task list and scope overview. What exists, what is
planned, and what each milestone depends on. Status lives in
[tracker.md](tracker.md) — this file is the map, that file is the log.

**Legend:** ☐ Not started · ◐ In progress · ☑ Done · ⛔ Blocked

---

## Overview

Two deliverables from one body of content.

**The playbook** is eighteen markdown stage documents covering the software
lifecycle from first idea to long-term operation. Opinionated and specific to a
Next.js + TypeScript + Vercel stack, written for solo-but-production-grade work
with explicit callouts for what changes on a team.

**The web app** (`web/`) turns those documents into something you consult rather
than read: a stepper per stage, interactive exercises, numbered figures, and
inline definitions for jargon. It is a Next.js static site with no backend.

The second deliverable also has a teaching job. Stages will cover ground the
author has not worked in — solutions architecture, observability, incident
response — so the app has to introduce concepts, not only remind.

### Scope boundaries

- **In:** reference documents, an interactive web reader, worked examples
- **Out:** starter templates, scaffolding CLIs, Claude Code skills. If the docs
  prove useful, templates can be derived from them later — deriving templates
  from good docs is easy, and the reverse is not.

---

## Milestones

### P — Playbook content (markdown)

| ID | Milestone | Status |
|---|---|---|
| **P-0** | Foundation — README index, `reference/stack.md`, `reference/glossary.md` | ☑ |
| **P-1** | Mechanical core — 04, 11, 12, 13, 14 | ☑ |
| **P-2** | Daily loop — 05, 06, 07, 09, 10 | ☑ |
| **P-3** | Upfront thinking — 01, 02, 03, 08 | ☑ |
| **P-4** | Long tail — 15, 16, 17, 18 | ☑ |
| **P-5** | Reconcile docs with the app's real stack | ☑ |
| **P-6** | Fold the real working conventions into the stage docs | ☐ |
| **P-7** | Project scaffolding — kickoff, design system, loop directories | ☑ |
| **P-8** | Working standards — conventions, skills-as-process, humanizer, interaction patterns | ☑ |

### W — Web app

| ID | Milestone | Status |
|---|---|---|
| **W-0** | Scaffold — Next 16, TS, Tailwind 4, routing, 18 stage routes | ☑ |
| **W-1** | Design system — whiteprint/cyanotype tokens, type roles, primitives | ☑ |
| **W-2** | Stage 01 interactive — stepper, 9 figures, 5 exercises, worksheet, 10 terms; polished + patterns documented | ☑ |
| **W-3** | Stages 02–18 interactive | ◐ *(02, 03 done; 15 remain)* |
| **W-4** | Quality gates — tests, CI, committed a11y/responsive checks | ☑ |
| **W-5** | Deploy | ☑ *(live 2026-08-11; the deployment verifies itself via `pnpm test:prod`)* |
| **W-6** | Reference hub — cheatsheets, glossary and stack in one consultable section | ◐ *(skeleton `0207fd6` and source graphics `4727dc3` merged 2026-08-14; ten sheets still to transcribe)* |

### Dependency map

```text
P-0 ──> P-1 ──> P-2 ──> P-3 ──> P-4
 │                                │
 │                                └──> P-5 ──┐
 │                                           │
 └──> W-0 ──> W-1 ──> W-2 ──> W-3 ───────────┴──> W-5
                       │
                       └──> W-4 ──────────────────┘

W-4 gates W-5: do not deploy without a merge gate.
P-5 blocks nothing, but grows more expensive the longer it waits.
P-6 depends on nothing, but is best written while the conventions are fresh.
P-8 (done) is the source P-6 folds into the stage docs.
```

---

## Task detail

### P-5 — Reconcile docs with the app's real stack ☑ *(resolved: ESLint kept, D-22)*

The playbook prescribes tooling the app does not use. Either the app adopts it
or the doc is amended, but the two cannot keep disagreeing. See **TD-1**.

- [x] Decide: adopt Biome, or amend `reference/stack.md` + `docs/04` to ESLint
- [x] Decide: adopt Lefthook, or drop the git-hooks section
- [ ] Re-verify every version in `reference/stack.md` against `npm view`
- [ ] Confirm no stage doc contains a version number — they belong in stack.md

### P-6 — Fold the real working conventions into the stage docs ☐

`CLAUDE.md` now records how this project actually works — conventions ported from
`SmartJobSearchCRM` and verified against ~500 commits. The stage docs still describe a
generic version of the same ground. Close the gap so the playbook documents the practice
rather than an idealised one.

Map of what lands where:

| Convention | Stage |
|---|---|
| Conventional commits, scopes, branch naming, `--no-ff` merges, the TEMP idiom | 05 Development · 07 Code Review |
| Spec → plan → TDD → per-task review → whole-branch review | 02 Planning · 05 Development |
| Review severity (`Critical`/`Important`/`Minor`), finding IDs, provenance tags | 07 Code Review |
| Reviewer must disprove as well as confirm, including its own claims | 07 Code Review |
| TDD evidence: RED and GREEN output, failure "for the right reason", teeth check | 06 Testing |
| Test names that encode rationale, not mechanic | 06 Testing |
| TASKS/TRACKER conventions: evidence over adjectives, standing `Deferred` field | 02 Planning · 10 Documentation |
| Kickoff prompt files for cold-starting a session with full context | 10 Documentation |
| Which skill/MCP/agent for which job | 01 (done) · extend per stage |
| Skills as the process: TDD iron law, brainstorm-before-code, systematic-debugging, verification-before-completion | 05 Development · 06 Testing · 07 Code Review |
| Learning guides written for future-you (`docs/learnings/`) | 10 Documentation · 18 Continuous Improvement |
| Run `humanizer:humanizer` over prose before it is done | 10 Documentation |

- [ ] Update the markdown stage docs listed above
      *(partial, 2026-07-23: teeth check + invariant tests → 06, teeth link → 07,
      warnings-gate trap + gate yaml → 11, DoD line → 05 — landed with W-4's doc pass.
      Remaining: commit/branch conventions → 05/07, review severity + provenance → 07,
      tracker conventions + kickoff files → 02/10, skills-per-stage → all.)*
- [ ] Mirror into the interactive stage as each is built under W-3
- [ ] Record any convention deliberately *not* adopted, and why
- [ ] Pass every touched doc through `humanizer:humanizer`

### W-3 — Stages 02–18 interactive ◐ *(02 and 03 done; 15 remain)*

Each stage repeats the same shape. Stage 01 is the reference implementation.

**Every stage carries an "AI plays" section** (D-34, D-35): where agents help in that
stage's work and where they mislead, mirroring stage 01's. It is a dedicated stepper step
in the app and a `### AI in <stage>` subsection in the doc, and it pushes a stage past the
4–6 content-step guideline (recorded in `PATTERNS.md`). See the per-stage AI-plays tracker
below for where each stage stands.

Per stage (checklist ticked for **02 Product Planning**, feat/stage-02-product-planning):
- [x] Read `web/PATTERNS.md`; pick a pattern per section (prose is the fallback, not the default)
- [x] Group the doc's sections into 4–6 stepper steps *(six: done · cut · sequence · size · write · horizon)*
- [x] Identify diagrams worth building; wrap each as a numbered `<Figure>` *(nine)*
- [x] Build 1–3 interactive exercises where judgement is being taught *(five: done-statement, cut table, slice sequencer, size scorer, horizon triage)*
- [x] Add glossary terms for jargon that stage introduces *(seven: mvp, product-roadmap, product-vision, appetite, vertical-slice, spike, feasibility-risk)*
- [x] Add 3–5 references (`src/lib/references.ts`), each stating what it adds *(four, all browser-verified)*
- [x] **Add an "AI plays" step for this stage's domain** — where agents help, where they mislead — in both the doc (`### AI in <stage>`) and the app; name real skills/MCPs
- [x] Register in `src/features/stage-content.ts`; flip `ready: true` in `stages.ts`
- [x] Verify: contrast in both themes, 320–2560px, no console errors *(9/9 audit suite against a production build)*
- [x] Run `humanizer:humanizer` over the stage's prose *(doc amendment; em-dashes kept as house voice)*

Per stage (checklist ticked for **03 Architecture**, feat/stage-03-architecture):
- [x] Read `web/PATTERNS.md`; pick a pattern per section (prose is the fallback, not the default)
- [x] Group the doc's sections into 4–6 stepper steps *(five content steps: reverse · model · constrain · shape · decide — the ceiling, on the densest stage; D-38)*
- [x] Identify diagrams worth building; wrap each as a numbered `<Figure>` *(nine, 1–9 ascending in DOM order)*
- [x] Build 1–3 interactive exercises where judgement is being taught *(four: reversibility table, model interrogation, split trigger, boundary map — plus the schema inspector and the domain worksheet)*
- [x] Add glossary terms for jargon that stage introduces *(seven new; `adr` and `blast-radius` reused from the D-36 migration)*
- [x] Add 3–5 references (`src/lib/references.ts`), each stating what it adds *(four, every URL opened in a real browser and its claim corroborated against the source)*
- [x] **Add an "AI plays" step for this stage's domain** — where agents help, where they mislead — in both the doc (`### AI in <stage>`) and the app; name real skills/MCPs *(the doc had no AI section at all — added in Task 1, and `stage-metadata.test.ts` now enforces D-35 for every stage)*
- [x] Register in `src/features/stage-content.ts`; flip `ready: true` in `stages.ts`
- [x] Verify: contrast in both themes, 320–2560px, no console errors *(10/10 audit suite over 20 URLs against a production build; 133/133 unit across 9 files; 22 routes prerendered. Plus a by-hand pass in the interacted state — every disclosure open and one radio committed per radiogroup — across 7 widths, which the suite does not do)*
- [x] Run `humanizer:humanizer` over the stage's prose *(doc amendment; em-dashes kept as house voice)*
- [ ] **Doc gaps outstanding.** The cold-reader pass found 14 gaps, 3 of them blocking
      (**TD-18**). The interactive build is complete; the underlying doc is not. See the
      tracker.
- [ ] **Architecture styles landscape outstanding** (**TD-21**, decision **D-44**). The stage
      teaches the modular monolith without naming it, and never asks what the system needs to
      *be* before deciding how it is shaped. Next round adds an architecture-characteristics
      step and an honest styles comparison — monolith, modular monolith, microservices,
      event-driven, serverless — each stating what would have to be true to pick it. The
      recommendation does not change; it stops being an assertion.

### W-3.1 — Stage 03 doc round (TD-22 + TD-21 + TD-18) ☑ *(done 2026-07-29)*

One round, three tracker entries, because all three live in `docs/03-architecture.md` and all
three force matching changes in `web/src/features/architecture/`. Runs the full loop:
brainstorm → spec → plan → TDD tasks → whole-branch review.

**Sequence matters: settle TD-22 first.** It probably changes the stage's step structure, and
designing TD-21 or TD-18 against the current six steps risks redoing that work.

**TD-22 — the missing activity (do this first)**

- [x] **Non-functional requirements** — a new step before the structural advice. What does
      this system need to be (available · auditable · low-latency · cheap to run · secure)?
      Three or four picked, not a checklist of twenty. Same artifact as TD-21's "architecture
      characteristics" under the name most readers meet — build it once.
      ~~This is also where TD-18's **G14** lands~~ **✗ corrected 2026-07-29: this checklist
      put G14 here; TD-18's own text puts it in the reversibility section, and TD-18 is
      right.** G14's defect is that the section gives two example lists and no test for
      producing your own, so the fix has to land where the lists are. Shipped in section 1
- [x] **A high-level design artifact** between the domain model and the schema — components,
      how they interact, external systems, data flow, deployment shape. Today Artifacts asks
      only for "a one-paragraph description plus a diagram only if it clarifies", which is an
      HLD with no structure
- [x] **Decide the functional-requirements boundary explicitly.** Stage 02 owns them (define
      done · the cut · vertical slices). Stage 03 should state that it *consumes* them, not
      restate them — getting this wrong duplicates stage 02 and breaks the filing-code claim
- [x] **Decide how much ceremony to keep.** Take the HLD/LLD thinking, leave the specification
      documents and sign-off. Say so in the doc, so a reader from an enterprise background
      knows the omission is deliberate
- [x] **Database design beyond the DDL** — an ER view, normalisation vocabulary, and the
      access-pattern thinking that would justify **G4**'s indexes
- [x] **API / contract design** — never posed today. Route shape, request/response contracts
      and versioning, with their differing reversibility costs
**TD-21 — the missing vocabulary**

- [x] **Styles comparison** — monolith · modular monolith · microservices · event-driven ·
      serverless. Each with what it costs, what it buys, and what would have to be true to
      choose it. Name the modular monolith as the thing the stage already teaches
- [x] **DDD vocabulary** — bounded context named where "Boundaries inside the monolith"
      currently gropes at it; ubiquitous language; ~~aggregates~~ (**✗ not shipped** — neither
      the doc nor `terms.ts` mentions aggregates; consistent with the "strategic lightly"
      instruction on this same line, since aggregates are tactical, but the tick overstated
      it. Caught by the whole-branch review, M5). Strategic DDD lightly, not the
      tactical machinery
**TD-18 — what a cold reader could not finish**

- [x] **G3 first, per TD-18** — the ownership / role / membership authorization split. The
      only gap that produces a confident wrong answer rather than a stall
- [x] **G4** — indexes: teach two in the DDL with reasoning, or drop them from Artifacts
- [x] **G5** — conditional uniqueness and one sentence on transactions, since the doc names
      races as the reason for database constraints and supplies no tool that expresses one
- [x] **Integration style** — synchronous versus asynchronous as a posed decision, which is
      the fork into event-driven
- [x] **C4** — name a diagramming standard where Artifacts currently says "a diagram only if
      it clarifies"
- [x] **Define the dismissed terms** — event sourcing and CQRS get a definition before they
      get a verdict. Expand `ADR` and `DDL` on first use
- [x] **C1** — resolve "defer multi-tenancy" against "stored data is expensive to reverse"
- [ ] ~~Mirror every change into `web/src/features/architecture/`~~ **✗ not done — deliberately
      deferred to W-3.2 per D-46, tracked as TD-23.** This was ticked in error when the round
      closed; the whole-branch review caught it (I4). The round was scoped doc-only precisely
      *because* this is the larger half, so marking it complete inverted the record. The DDL
      annotations, the interrogation set and the reversibility lists in `scoring.ts` all still
      describe the eight-subsection doc
- [x] Re-run the cold-reader pass afterwards on the amended doc, and record what it finds

### W-3.1b — Stage 03 completeness: resilience, consistency, evolution ◐ *(doc done 2026-07-30; app port pending W-3.2)*

Closes **TD-25**. An architecture-completeness audit against standard practice found that five
clusters of widely-taught material are absent from **all eighteen docs**, not merely deferred
to a later stage. Scope call is **D-49**: completeness beats length for this stage, and the
content stays to standard, widely-used practice rather than reaching for the exotic.

**Runs after W-3.2.** This was originally scoped to run *before* the port, on the reasoning
that amending the doc again would mean porting twice. That reasoning was sound and the premise
was wrong: `W-3.2` was already substantially built in a parallel session by the time this round
was scoped — 31 commits, a nine-step stage, +9,446 lines — so the port is the thing in flight
and this round follows it. **The double-port cost is therefore real and accepted**: this
round's new content needs its own port pass afterwards, and that pass should be folded into the
W-3.1b round rather than left as a third one.

**The tell that ties them together:** the characteristics section offers a **ten-item candidate
list** and supplies a **three-row trace table**. A reader who picks availability, scalability
or evolvability gets the test with no material to pass it. The missing seven map onto exactly
these clusters — so this round is what makes that section honest.

- [x] **Resilience patterns** — timeout, retry with exponential backoff and jitter, circuit
      breaker, graceful degradation. Extends "Sketch the system", which already asks *"what
      happens when each dependency is down?"* and answers with no patterns. Name bulkhead
      without teaching it; it rarely earns its place solo
- [x] **Consistency and concurrency** — CAP named, eventual consistency as a term rather than
      an adverb, isolation levels (Postgres defaults to read committed, and what serializable
      buys), **optimistic locking** via a version column, pessimistic via `SELECT … FOR
      UPDATE`. Extends "Design the database", which currently says "use a transaction" and
      stops. Closes the hole the cold reader left open in G5. A version column is stored data,
      so it is decide-now by the stage's own axis
- [x] **Safe schema evolution** — **expand-contract / parallel change**, and **strangler fig**
      for the service split the stage says to defer. Likely its own section, because it is a
      distinct activity: the stage's whole thesis is that stored data is expensive to reverse,
      and it never teaches how to change stored data safely. Names the cost, not the technique
- [x] **Statelessness and scaling mechanics** — statelessness (which is what *makes* the
      serverless style the stage teaches work), horizontal versus vertical, load balancing,
      read replicas, and **connection pooling** — the last matters concretely here, since
      serverless plus Postgres is the stack the playbook prescribes and pooling is its
      best-known failure mode. Extends the styles and one-application sections
- [x] **Fitness functions** — evolutionary architecture's idea that a characteristic should be
      automatically checked rather than hoped for. Extends "What this system has to be" and
      closes its loop. ~~This project already practises it … so the example is in the repo~~ **✗ approach abandoned
      during the round.** The cold reader found the repo-drawn examples were an appeal to
      infrastructure the reader does not have, so all three were removed and the work deferred
      to stage 06. See the TD-25 closure
- [x] **Widen the characteristics trace table** past three rows, so the ten-item candidate list
      stops promising more than the stage delivers
- [x] Expect **one new `###` section** (schema evolution); the rest extend existing sections.
      `stage-03-structure.test.ts` pins the thirteen headings and must be updated in the same
      commit as any structural change, with the teeth check re-run
- [ ] ⏳ **Port this round's content into the app as part of this round** — blocked until `feat/stage-03-app-port` merges, not as a third pass.
      W-3.2 will have just built a nine-step stage against the current doc; adding a section
      and extending five others means new components plus edits to `styles.ts`, `sketch.ts`,
      `schema-blocks.ts` and `contracts.ts`, all of which W-3.2 introduces
- [x] Glossary terms for every new concept (`terms.ts` → `pnpm gen:glossary`), and **grep
      `terms.ts` before writing prose** per D-47
- [x] Cold-reader re-run on the amended doc, same shift-swap product; **budget a fix wave
      after it and verify the wave itself** (D-48)
- [x] `humanizer:humanizer` pass (D-20); consultability check, which the cold reader cannot do

**Deliberately out of scope**, so the round does not sprawl: caching *patterns* stay with stage
09 (linked, not taught); observability with 15; threat modelling and secrets with 08; table
partitioning and sharding are named as the thing you do not need and not taught.


### W-3.3 — Close stage 03's eight recorded doc gaps ☑ *(done 2026-08-03, on `feat/stage-03-app-port`)*

The residue of three rounds, recorded rather than fixed at the time and closed here as one
unit: normal forms named and never defined; soft delete shown as one mechanic with no choice
posed, and its filter half missing entirely; the tenancy tables; the partial unique index,
which is the only way to express "at most one approved claim per shift"; the third-party-call
cadence; the pull-import contract row; and the auth box the container diagram never drew.

Doc **1,346 → 1,507 lines**. App still **22 steps** — every gap landed inside an existing
panel under D-52's four-screen rule, three of them behind expand-to-reveal (D-49), so closing
eight gaps cost no new steps.

**Cold-reader run 4 returned COMPLETE** (`docs/verification/cold-reader-stage-03-run4.md`),
the first of the four runs to do so. Its fix wave took a D-48 verification pass against a live
PostgreSQL 17 cluster, and the whole-branch **re-review** then found five Important findings —
the headline being a backfill instruction that silently skipped every row it was meant to
migrate. See the W-3.3 row in [tracker.md](tracker.md) for the evidence.

**Deferred, recorded not fixed:** M5 (2NF is unviolatable under the `uuid` primary keys every
DDL here uses — a content decision about the worked example, not a patch) and M6 (the archive
table's volume threshold).

### W-3.2 — Port stage 03's doc round into the app ☑ *(merged to `main` 2026-08-03 as `790b3e4` — `--no-ff`, 106 commits, branch deleted)*

**Live coverage map: `docs/stage-03-status.md`.** Section by section, doc against app, with the
remaining tasks. Read it before picking up this round — it is more current than this checklist,
because it is updated when the doc moves rather than when a round closes.

`feat/stage-03-standard-practices` was merged **into** this branch on 2026-07-30 (D-51), so the
doc has stopped moving and the port has one stable target. Tally at that point: 5 sections fully
ported, 8 partial, 1 (section 9, "Evolve the schema safely") not ported at all.

**Two fixes already landed on this branch beyond the merge**, so the port does not have to
redo them: the authorization exercise (`contracts.ts`) was scoring `role` alone as correct on
the manager-approves-a-swap scenario, which is the framing that produces cross-team privilege
escalation — now a checkbox conjunction, browser-verified; and the TOC and glossary now name
**system design**, since the stage is called Architecture and nobody searches for that.

W-3.1 was deliberately doc-only, so `docs/03-architecture.md` and
`web/src/features/architecture/` now disagree about what the stage contains. That divergence
is **TD-23**, and this round closes it.

The doc is 14 subsections and ~1,344 lines. The app is **22 steps**: reverse · require · trace ·
model · worksheet · shape · oneapp · boundaries · sketch · flow · resilience · schema ·
indexes · tenancy · concurrency · races · evolve · contract · access · record · ai · traps.
(Two earlier versions of this checklist named step sets that had not existed for weeks. The
count moves every task now, so `web/src/features/architecture/steps.ts` is the answer and this
line is a snapshot.)

**Twenty-two is not a target and was not chosen.** Every split was forced by a measurement:
the panel came out over four screens, so it was cut at a seam where it held two judgments.
D-52 says count follows content, and this is what that produced for the densest of the
eighteen stages — `require` itself measured 4.7 screens with the widened trace still in it,
which is why `trace` exists as its own step.

- [x] **Decide the new step structure first.** ✓ 2026-07-31. **D-52** supersedes D-38: a step
      holds one judgment and its panel stays under four screens at 1024×768; count follows
      content. D-38 capped the wrong quantity — its own reason was about panel weight, and
      capping the count makes panels heavier. Measurement settled it, and also showed D-38 had
      already been broken by stage 02 without a recorded deviation
- [x] **Mirror the corrections, not just the additions** ✓ 2026-07-31 — the sixth interrogation
      question, `version` and `deleted_at` on the invoices DDL, and the `invoice_sends` block.
      `ddl-sync.test.ts` now holds both `CREATE TABLE` blocks to the doc character-for-character
- [x] **The D-52 reshape is done** ✓ 2026-07-31. `PANEL_EXCEPTIONS` is back to its **two
      permanent entries**, which was the plan's stated exit condition. Every stage-03 panel
      measures under four screens; the heaviest is `model` at 3.7. Tasks 1–10 of
      `docs/superpowers/plans/2026-07-31-step-panel-weight.md`
- [x] **Port section 9, "Evolve the schema safely"** ✓ 2026-07-31 — the `evolve` step. The
      six-step sequence as a guess-then-reveal on which two get skipped (2 and 5), the
      pre-launch exemption as the panel's opening rather than a footnote, and the backfill
      held to the doc character-for-character by a test, because that statement was wrong
      twice and both defects were found by running it (D-50)
- [x] **Port four of the five clusters** ✓ 2026-07-31 — resilience into `resilience`,
      isolation and locking into `concurrency`/`races`, scaling and pooling into `shape`,
      two more AI plays and the sixth mislead into `ai`
- [x] **Port the last cluster** ✓ 2026-07-31, `9798286` — fitness functions and the widened
      ten-row trace split out into a new `trace` step, event sourcing and CQRS into `record`.
      Task 11
- [x] **`terms.ts` grepped on every ported concept** (D-47) ✓ — every term the four clusters
      needed already existed from the doc round, so nothing was added and `gen:glossary` did
      not run. Two candidates were deliberately **not** added ("backfill", "rolling deploy"):
      both are defined in place, and the glossary is generated from `terms.ts`, so an entry
      the doc does not carry would be inventing reference content rather than porting it
- [x] New step hashes added to `e2e/audit.spec.ts` by hand (TD-12) — **thirteen** of them this
      round, taking stage 03's entries from nine to twenty-two. A *dead* hash now fails; a
      *missing* one still audits nothing, which is the half TD-12 still names. **TD-12 closed
      2026-08-14**: the list derives from the ready set now, so this was the last round that
      added a hash by hand
- [x] **Whole-branch review before merge**, doc and app together. ✓ 2026-08-03 — seven
      blocking findings, two minors promoted for being reader-visible and introduced by this
      branch, sixteen deferred. The four per-task reviews before it had found fourteen blocking
      defects between them, including two factual errors about Postgres that read plausibly and
      that no test could have caught until the tests were rewritten; the branch pass then found
      that the contrast and touch-target gates were opening five expandables across 36 pages
      and reporting a clean sweep
- [ ] Close **TD-23** when doc and app agree again

#### AI-plays coverage, per stage

Each stage gets its own "AI plays" section, tuned to that stage's work (discovery's is
"point it at evidence, not validation"; planning's is "point it at cutting, not a thorough
plan"; architecture's, testing's and so on will each have their own). Status:

| Stage | Doc | App | Notes |
|---|---|---|---|
| 01 Product Discovery | ☑ | ☑ | Doc `### AI in discovery` backfilled; TD-15 closed |
| 02 Product Planning | ☑ | ☑ | Done: 7th step + `### AI in planning` |
| 03 Architecture | ☑ | ☑ | `### AI in architecture`, its own step — the 21st of 22 after the D-52 reshape, and the 6th when it was written. The doc had **no** AI section — the round had to write one before it could mirror it, which is why `stage-metadata.test.ts` now fails any stage whose doc lacks the heading |
| 04 Project Setup | ☑ | ☐ | `### AI in project setup` was written test-first during the doc-correction round: `stage-metadata.test.ts` failed with `04-project-setup has no "### AI in ..." subsection` before the section existed, and the teeth check renamed the heading to `### AI for project setup` to confirm the assertion could still fail. The app step arrives with the port |
| 05–18 | ☐ | ☐ | Build with each stage, per the checklist item above |

Suggested order. Revised 2026-07-24 (D-27): the first pass ranked purely by teaching
value and put 02 fifth. That ignored the reader's journey and the risk of proving the
pattern library on the hardest stage.

| Order | Stage | Why this one next |
|---|---|---|
| ~~1~~ ✓ | 02 Product Planning | **Done.** Complete + interactive + audience-validated (D-37: developer-complete; PM/SA are scope boundaries). Proved `web/PATTERNS.md`, the carry-forward chain, and the AI-plays pattern transfer. |
| ~~2~~ ✓ | 03 Architecture | **Doc and app content agree; the whole-branch review has run, and TD-23 now waits only on the merge.** The densest stage by a distance: 14 doc sections, 22 app steps, 24 figures. TD-18, TD-21, TD-22 and TD-25's doc half all closed on it. Stress-tested the pattern library and produced two new rows (annotated artifact, and the panel-weight rule that replaced the step-count ceiling). |
| ~~3~~ ✓ | — | **Stage 03's doc gaps closed** across W-3.1, W-3.1b, W-3.3 and four cold-reader runs — run 4 returned **COMPLETE**, the first to do so. |
| ~~4~~ ✓ | — | **W-3.2 + W-3.3 merged** to `main` as `790b3e4` (`--no-ff`, 106 commits, branch deleted). Gate re-run on the merged result: 313/313, 14/14 audit, lint, typecheck and format clean. **Not pushed** — the user handles that. |
| ~~5~~ ✓ | — | **W-5 complete** — live at https://acp-dev-playbook.vercel.app, verified by `pnpm test:prod`. Every `W-` milestone except W-3 is now closed. |
| **6 (in progress)** | **04 Project Setup** | **Decided 2026-08-11**, against this table's earlier answer of 15. Reading 04 to compare the two found its Vercel section factually wrong — it says to match the Node version to `.nvmrc`, which Vercel does not read — and silent on the three things that broke this project's own first deploy (**TD-28**). So the round is *fix a doc that misleads* rather than *port a doc that is fine*, and it is the one stage checkable against this repository. **Scoped as a doc-correction phase before the port.** 15's case is recorded in `docs/tracker.md`'s Next up; it lost on having nothing to ground it against. **Doc phase complete 2026-08-13** on `fix/stage-04-doc-corrections`, unmerged: 323 → 711 lines at `38765e7`, TD-28 closed, **31 defects against the four TD-28 named**. **`RevealList` done 2026-08-14**, merged to `develop` as `e29f3fe`: eleven stage-03 accordions collapsed onto one component, not the five the plan scoped. **TD-12 closed the same day** on `fix/derive-audit-pages`, also merged — the audit's page list derives from the ready set, so the port will not be adding hashes by hand. **The port is still outstanding** — see W-3.4. |
| 7 | 16 Incident Management | Procedural, so a stepper fits naturally |
| 7 | 13 Production Deployment | Expand/migrate/contract needs a visual |
| — | remainder | 04–12, 14, 17, 18 |

**~~Settle before stage 03:~~ ✓ resolved 2026-07-27 (D-36).** TD-2 and TD-3 are closed:
`terms.ts` is the single glossary source (`reference/glossary.md` generated via
`pnpm gen:glossary`), and a title sync test guards stage metadata. Stage 03 is unblocked.

**~~Open product decision for stage 02:~~ ✓ resolved 2026-07-24.** Stage 02's worksheet
reads stage 01's saved answers via a read-only carry-forward (`src/lib/discovery-sheet.ts`,
shared by both stages). It seeds "Done means" and "Not in v1" from stage 01's `success`
and `notThis`, disabling each seed once the target field has text so it can never
overwrite. A shared cross-stage store was rejected as premature (it would make stage 01 a
migration target and fix a schema before stages 03–18 have said what they need). The chain
extends: the reader's own "Not in v1" entries become the items they triage in the horizon
step. Verified end-to-end in a live browser.

### W-3.4 — Stage 04's doc-correction phase ◐ *(doc done 2026-08-13, merged as `dd44b30`; `RevealList` merged 2026-08-14 as `e29f3fe`; TD-12 closed as `a07a9b6`; **the port is all that remains**)*

The first round in this project shaped as a correction rather than a port, per **D-53**.
Stage 03's rounds ported prose that was already right; `docs/04-project-setup.md` was wrong
where a reader acts on it, which is what **TD-28** recorded and considerably understated.

Evidence for everything below is in `docs/tracker.md`'s row for this round. The short
version: TD-28 named four defects, all in `### 8. Connect Vercel`, and the round closed
**31** across every numbered section. Three instruments ran in sequence and each caught what
the previous one could not — reading the doc, executing every runnable block of it, and
handing the corrected doc to a cold reader with a task to finish.

- [x] **Execute the doc before correcting it** (**D-50**) ✓ `docs/verification/stage-04-doc-execution.md`.
      Fifteen claims scored, and the five defects it found that reading had missed were folded
      into Tasks 2 and 3 by the user's scope call rather than deferred
- [x] **Correct §1, §6, §7, §8, the Definition of done and Artifacts** ✓ — including the
      `prepare` script the doc never added, the `typecheck` and test scripts its own gates
      called, and the three settings a repository cannot express
- [x] **`reference/stack.md` names the file each environment reads** ✓ (**D-55**) — one clause
      on the Node row, which is the generalisation TD-28's headline defect rests on
- [x] **`### AI in project setup`, written test-first** ✓ — real RED from
      `stage-metadata.test.ts`, teeth-checked, suite 331 → **332 across 33 files**
- [x] **Cold-reader run 1, before the port rather than after** ✓ (**D-54**)
      `docs/verification/cold-reader-stage-04-run1.md`. Completeness returned three blocking
      findings; consultability scored **3/5**, and one of its two misses was traced to this
      round's own correction rather than assumed inherited
- [x] **Fix wave, all twelve prioritised entries closed** ✓ — three of them not as specified,
      and one reversed on review and recorded as reversed (**D-56**)
- [x] **Whole-branch review of the fix wave** ✓ — eight findings, all addressed
- [x] **`RevealList`** ✓ *(done 2026-08-14 on `refactor/reveal-list`, merged as `e29f3fe`)* — scoped as
      five stage-03 accordions sharing one markup, and there were **eleven**. The five were the
      ones whose header comments admitted the duplication; the other six never said so. All
      eleven now call `RevealList` (twelve instances), plus `RevealFacet` for row bodies and
      `TeamNotes` moved to `src/components/`. **Two shared components widened**, both after an
      implementer reported a caller that did not fit rather than forcing it (**D-61**); **two
      deliberate visual changes**, both badge moves, declared in commit subjects. The branch's
      real product is the verification story: **seven checks that could not fail**, six of them
      controller-authored, recorded in `docs/tracker.md`'s Process observations. Evidence in
      that file's row: 31 commits, vitest 332/33 → **347/36**, sweep **140 expandables / 107
      panel ids** unchanged end to end, audit 14/14. Debt opened: **TD-34**, **TD-35**
- [x] **TD-12** ✓ *(done 2026-08-14 on `fix/derive-audit-pages`)* — the audit's thirty-six
      hand-written URLs replaced by `e2e/audit-pages.ts`, which reads stages from
      `STAGES.filter(s => s.ready)` and step ids from the rail each one renders. Ran on its own
      branch before the port, per the sequencing settled 2026-08-13, because the port is what
      would otherwise have added the next hashes by hand. The equivalence test spells all
      thirty-six out rather than recomputing them, and **carries a shelf-life note**: stage 04
      going ready turns it red for a correct reason, and the fix is to delete it, not to paste
      in what the derivation emits. Evidence in `docs/tracker.md`'s row: audit **14/14 →
      16/16**, vitest **350/37**, sweep unchanged at **140 expandables / 107 ids**. Debt
      opened: **TD-36**, for the direction it does not cover
- [ ] **Port-planning pass — the next round, and it is planning rather than code.** The
      spec's Phase 5 table cuts the doc into nine steps, and it was written when
      `docs/04-project-setup.md` was 323 lines. It is **711**. Mapping that table onto the doc
      as it stands puts four steps at roughly a hundred lines each — `scaffold` (§1+§2, 129),
      `gates` (§6+§7, 109), `strict` (§3+§4, 105), `env` (§5, 103) — against `deploy` (§8, 70),
      `proof` (§9+§10, 56), `ai` (38), `checklist` (DoD + team, 30) and `traps` (29). Three of
      the four heavy ones are **pairings the spec made when each half was about half its
      current size**, so the question the pass exists to answer is whether D-52's panel weight
      still lets them hold. Re-cut by measurement, not by re-reading the table (**D-51**: a
      plan specified against prose that then moved is the failure stage 03 hit five times out
      of six)
- [ ] **TD-36 folds into that round.** Stage 04's `steps.ts` should type its `Step[]` against
      `STEP_IDS` the way stage 03's does, and extending the same guard to stages 01 and 02 is
      a few lines inside a round already in those files — against its own round later
- [ ] **The port.** Unchanged by either the `RevealList` or the TD-12 round.
      `04-project-setup` is still `ready: false` and absent from `STAGE_CONTENT`, so the route
      renders "sheet not drawn". **W-3 is not advanced.** One tripwire is already armed:
      `web/e2e/audit-pages.spec.ts` goes **red the moment `ready: true` lands**, correctly —
      its thirty-six-URL literal proves the TD-12 migration and nothing after it, and the file
      says in writing that the fix is to delete the test rather than paste in what the
      derivation now emits
- [x] **Merge of the doc phase** ✓ — `fix/stage-04-doc-corrections` is in `develop` as
      `dd44b30`, `--no-ff`, which is where `refactor/reveal-list` was cut from
- [x] **Merge of `refactor/reveal-list`** ✓ — in `develop` as `e29f3fe`, `--no-ff`, after a
      whole-branch review that found the React key warning still live on three panels
- [x] **Merge of `fix/derive-audit-pages`** ✓ — in `develop` as `a07a9b6`, `--no-ff`,
      2026-08-14, after a scoped re-review returned *Ready to merge* with its two blocking
      items addressed. Gate re-run on the merged result: vitest **350/350 across 37 files**,
      lint, typecheck and `format:check` clean; `web/` is byte-identical to the reviewed tip,
      so the audit's 16/16 stands without a re-run. The merge took `develop` to **112 commits ahead of
      `main`**, and it is **unpushed**; `main` stays at `8d5045c`, and both the push and the
      promotion are the user's

### W-4 — Quality gates ☑

The playbook says CI on day one. The app does not have it. Closing this is also
how the project stops contradicting its own advice. See **TD-4**, **TD-5**.

- [x] Vitest, plus a first unit test (`stages.ts` helpers, `terms.ts` lookups)
- [x] Commit the throwaway audit scripts as a real Playwright suite: contrast in
      both themes, no overflow 320–2560px, touch targets ≥44px
- [x] `.github/workflows/ci.yml` — lint, typecheck, test, build
- [ ] Branch protection requiring the gate *(GitHub-side: require `verify` + `audit`,
      branches up to date)* — **TD-10**
- [ ] Watch CI go red once: scratch branch, broken commit pushed with `--no-verify`,
      confirm Actions fails — **TD-10**
- [x] Fix or document whatever the suite reveals

### W-5 — Deploy ☑ *(live 2026-08-11 at https://acp-dev-playbook.vercel.app; verified by `pnpm test:prod`)*

- [x] Node version pinned where Vercel reads it — `engines.node` in `web/package.json`.
      `.nvmrc` reaches local and CI only, which left the one host that serves users unpinned
- [x] `metadataBase`, `sitemap.ts` (19 URLs, derived from `STAGES`) and `robots.ts`
- [x] Five `create-next-app` assets deleted from `public/`, with a test so they cannot return
- [x] `prepare` hook made safe for a checkout with no `.git` — found by review, and it would
      have failed the Vercel install step before Root Directory was ever read
- [x] **Root Directory set to `web`** in the Vercel project — no in-repo equivalent
- [x] **Framework Preset set to Next.js.** Not planned for, and not discoverable from the
      repository: the project had been created against a placeholder repo with nothing to
      detect, so it defaulted to *Other*, whose Output Directory is `public` — a directory this
      round had just deleted. The build failed with `No Output Directory named "public" found`,
      which names the symptom and not the cause
- [x] **Connected to the right repository.** It was pointed at `AngeloCP-01/acp-development-playbook`,
      a placeholder holding one unrelated commit, while the work lives in
      `AngeloCP-01/development-playbook`. Three green production builds of the wrong repo looked
      exactly like success
- [x] Preview deploy per pull request *(automatic, now that the project is connected)*
- [x] **Production deploy** — live and verified: `/robots.txt` reads `Allow: /` and names the
      sitemap, `/sitemap.xml` carries 19 `<loc>` entries on the real origin, and
      `/stages/03-architecture` renders with the title template applied
- [x] **Post-deployment verification per `docs/14`** — `pnpm test:prod` runs five `@smoke`
      checks against the deployed site: `robots.txt` and `sitemap.xml` carry the live origin,
      all 19 advertised URLs resolve, the home and a stage page render through the real
      layout, and the edge logs no console errors. Scoped to what a local build cannot do —
      contrast and overflow stay in `audit.spec.ts`, because the bytes CI checked are the
      bytes Vercel serves

---

### W-6 — Reference hub ◐ **PAUSED 2026-08-14** *(skeleton `0207fd6` and source graphics `4727dc3` merged; resume after the stage 04 port)*

> **Parked deliberately, not abandoned.** The frame is finished and merged — routes,
> rail, renderer, markdown generation, audit coverage and the source graphics. What
> remains (W-6.3, W-6.4) is content work that competes with `W-3`, which is the
> project. **Next active work is the stage 04 port under W-3.4, not this.**
>
> Resuming needs no re-decision: read this section, pick a sheet from
> `reference/cheatsheet-sources.md`, and fill its `sections: []`. Nothing else changes.

**Why it exists.** Two problems with one shape. `reference/glossary.md` and
`reference/stack.md` have been unreachable from the app since they were written — no
route renders either — and there was nowhere to put lookup material that answers "what
was that command" rather than teaching a decision.

Spec: `docs/superpowers/specs/2026-08-14-reference-hub-design.md`.
Plan: `docs/superpowers/plans/2026-08-14-reference-hub-skeleton.md`.

**W-6.1 — Skeleton ☑** *(merged 2026-08-14, `0207fd6`, 11 commits, +3175/−86)*

`/reference` plus a per-sheet route, eleven sheets registered behind one renderer,
a second nav landmark in the rail, sitemap entries guarded bidirectionally, and
`reference/cheatsheets.md` generated from the registry. Ten of the eleven sheets are
deliberately empty (**D-62**). Evidence in `docs/tracker.md`.

**W-6.2 — Source graphics on the sheets ☑** *(merged 2026-08-14, `4727dc3`)*

All four requirements closed. The images live in `web/public/reference/` as WebP,
**5.2MB of originals became 644K**, the plate frames them in both themes without
dimming, and the alt decision is derived from whether a text equivalent exists —
decorative on a drawn sheet, descriptive on an undrawn one, both directions tested.
Originals stay untracked and gitignored; the conversion recipe and measured savings
are in `reference/cheatsheet-sources.md`. Evidence in `docs/tracker.md`.

**W-6.3 — Fill the ten empty sheets ☐**

Content work, not app work, now that the frame exists. Three sources are already
gathered and logged in `reference/cheatsheet-sources.md`; the rest have search terms
listed there by priority. Two of the three still need their post URL and author
recorded before anything derived from them can ship on a public site.

**W-6.4 — Glossary and stack surfaced in the hub ☐**

The reason `/reference` beat `/cheatsheets` as a section name. Closes the original
gap rather than adding a parallel one.

**Deferred beyond W-6:** the figure registry and the six architecture diagrams;
stage→sheet backlinks, since the tether is one-directional today; search; and
copy-to-clipboard on code rows, which waits for the first sheet that has any.

---

## Backlog — not scheduled

- Single source of truth for stage metadata (**TD-2**)
- Single source of truth for the glossary (**TD-3**)
- Search across stages
- A cadence view: the 18 stages plotted by real frequency rather than by number.
  That is the playbook's central claim and it is still only stated in prose.
- Print stylesheet — a field manual that prints is not a silly idea
