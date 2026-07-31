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
| **W-3** | Stages 02–18 interactive | ◐ *(02, 03 done; 16 remain)* |
| **W-4** | Quality gates — tests, CI, committed a11y/responsive checks | ☑ |
| **W-5** | Deploy | ☐ |

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

### W-3 — Stages 02–18 interactive ◐ *(02 and 03 done; 16 remain)*

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

### W-3.2 — Port stage 03's doc round into the app ◐ *(in progress — `feat/stage-03-app-port`, 73 commits, D-52 reshape at task 10 of 12)*

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

The doc is 14 subsections and ~1,344 lines. The app is **21 steps**: reverse · require ·
model · worksheet · shape · oneapp · boundaries · sketch · flow · resilience · schema ·
indexes · tenancy · concurrency · races · evolve · contract · access · record · ai · traps.
(Two earlier versions of this checklist named step sets that had not existed for weeks. The
count moves every task now, so `web/src/features/architecture/steps.ts` is the answer and this
line is a snapshot.)

**Twenty-one is not a target and was not chosen.** Every split was forced by a measurement:
the panel came out over four screens, so it was cut at a seam where it held two judgments.
D-52 says count follows content, and this is what that produced for the densest of the
eighteen stages. Median panel is now 2.7 screens against 5.3 before the round.

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
- [ ] **Port the last cluster** — fitness functions and the widened ten-row trace into
      `require`, event sourcing and CQRS into `record`. Task 11
- [x] **`terms.ts` grepped on every ported concept** (D-47) ✓ — every term the four clusters
      needed already existed from the doc round, so nothing was added and `gen:glossary` did
      not run. Two candidates were deliberately **not** added ("backfill", "rolling deploy"):
      both are defined in place, and the glossary is generated from `terms.ts`, so an entry
      the doc does not carry would be inventing reference content rather than porting it
- [x] New step hashes added to `e2e/audit.spec.ts` by hand (TD-12) — eleven of them this
      round, one per new step. A *dead* hash now fails; a *missing* one still audits nothing,
      which is the half TD-12 still names
- [ ] **Whole-branch review before merge**, doc and app together. Still the load-bearing one:
      the port half has never had it, and the three per-task reviews run so far found eleven
      blocking defects between them — including two factual errors about Postgres that read
      plausibly and that no test could have caught until the tests were rewritten
- [ ] Close **TD-23** when doc and app agree again

#### AI-plays coverage, per stage

Each stage gets its own "AI plays" section, tuned to that stage's work (discovery's is
"point it at evidence, not validation"; planning's is "point it at cutting, not a thorough
plan"; architecture's, testing's and so on will each have their own). Status:

| Stage | Doc | App | Notes |
|---|---|---|---|
| 01 Product Discovery | ☑ | ☑ | Doc `### AI in discovery` backfilled; TD-15 closed |
| 02 Product Planning | ☑ | ☑ | Done: 7th step + `### AI in planning` |
| 03 Architecture | ☑ | ☑ | `### AI in architecture` + a 6th step. The doc had **no** AI section — the round had to write one before it could mirror it, which is why `stage-metadata.test.ts` now fails any stage whose doc lacks the heading |
| 04–18 | ☐ | ☐ | Build with each stage, per the checklist item above |

Suggested order. Revised 2026-07-24 (D-27): the first pass ranked purely by teaching
value and put 02 fifth. That ignored the reader's journey and the risk of proving the
pattern library on the hardest stage.

| Order | Stage | Why this one next |
|---|---|---|
| ~~1~~ ✓ | 02 Product Planning | **Done.** Complete + interactive + audience-validated (D-37: developer-complete; PM/SA are scope boundaries). Proved `web/PATTERNS.md`, the carry-forward chain, and the AI-plays pattern transfer. |
| ~~2~~ ✓ | 03 Architecture | **Doc done; app one cluster short (TD-23).** The densest stage by a distance: 14 doc sections, 21 app steps, 24 figures. TD-18, TD-21, TD-22 and TD-25's doc half all closed on it. Stress-tested the pattern library and produced two new rows (annotated artifact, and the panel-weight rule that replaced the step-count ceiling). |
| ~~3~~ ✓ | — | **Stage 03's doc gaps closed** across W-3.1, W-3.1b and three cold-reader runs. |
| **4 (next)** | — | **Finish W-3.2** — Task 11, then the whole-branch review covering doc and app together. The review is the blocker, not the port: 73 commits, never reviewed as a whole, and the three per-task reviews found eleven blocking defects between them. |
| 5 | 15 Observability | Unfamiliar ground; benefits most from figures |
| 6 | 16 Incident Management | Procedural, so a stepper fits naturally |
| 6 | 13 Production Deployment | Expand/migrate/contract needs a visual |
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

### W-5 — Deploy ☐

- [ ] `vercel link`; confirm Node version matches local
- [ ] Preview deploy per pull request
- [ ] Production deploy
- [ ] Post-deployment verification per `docs/14`

---

## Backlog — not scheduled

- Single source of truth for stage metadata (**TD-2**)
- Single source of truth for the glossary (**TD-3**)
- Search across stages
- A cadence view: the 18 stages plotted by real frequency rather than by number.
  That is the playbook's central claim and it is still only stated in prose.
- Print stylesheet — a field manual that prints is not a silly idea
