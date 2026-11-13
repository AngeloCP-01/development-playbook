# Development Playbook — Master Tasks

**Purpose:** the complete task list and scope overview. What exists, what is
planned, and what each milestone depends on. Status lives in
[tracker.md](tracker.md) — this file is the map, that file is the log.

**Legend:** ☐ Not started · ◐ In progress · ☑ Done · ⛔ Blocked

**Older completed task-detail sections live in [task-archive.md](task-archive.md)** —
grep it by id, don't read it whole.

---

## Overview

**Current state (2026-11-13): develop pushed; Python assessment/design prepared.**
User authorized pushing develop, then assessing/designing Python with the same
teaching goal as Node.js & Express. Push **c768af4** succeeded; pre-push typecheck
and **1841 tests / 242 files** passed. Python design is proposed, not implemented.

**Latest integrated work: W-6.3u.2 Node.js & Express.**
The user approved local no-ff integration of feature tip **1a4cad0** after the
verified depth revision (**7ee4b54**, test extension **d122175**). The merged
application tree is identical to that tested tree: 15 panels, 49 topics/activities,
six coding repairs, 28/31 drawn references and 18/18 stages. NE-R1–NE-R6 stay
closed. One prerequisite-navigation minor remains deferred. Develop was pushed
on 2026-11-13; no main promotion.
See [KICKOFF](../KICKOFF.md) and [tracker](tracker.md) for retained evidence.

**Previous completed work: JavaScript sheet merged locally into develop (D-105).**
Application **7975be9** on `feat/javascript-promises-lesson` implements and verifies
the connected #async lesson, visible introduction, ordered teaching blocks and
JavaScript-wide context cleanup. The eight hashes, fourteen activities and original
four exercises remain. The [production preview](http://localhost:3100/reference/javascript#async)
is running; independent final review and coordinator review of **86ec79a** /
app **7975be9** have no actionable findings. Fresh coordinator checks are **59/7**
focused tests, **118** example assertions and **4/4** production browser tests.
Evidence and limits live in tracker; KICKOFF carries the review handoff.
The user accepted the pilot and authorized local no-ff integration of reviewed
feature **f3f376c** into develop **ede8e1f**. Local develop now has **26/30** sheets
and **18/18** stages; the merged application is identical to **7975be9**.
Push, main promotion and broader teaching rollout remain separate.

**Previously accepted application:**
Application **4ff8f8e** on `feat/javascript-fundamentals-subsections` implements
all six additions in eight main sections, with 25 topic subsections and 14 local
activities. The seven existing hashes and original four activities remain intact.
[Source/design and example evidence](../reference/javascript-source-research.md#all-six-additions-and-subsections-selected-2026-11-06),
[completed plan](superpowers/plans/2026-11-06-javascript-fundamentals-subsections.md)
and KICKOFF carry the handoff. Final unit/DOM **1,653/234**, production **43/43**
and retained dev-console **1/1** pass. Coordinator reviewed **973df70** /
application **4ff8f8e**, with no actionable Standards or Spec findings. Fresh
focused tests **37/7**, production browser **3/3** and published checks
**93 assertions** pass; narrow/middle/wide page inspection also passed.
Separate user integration approval remains. No merge, push or promotion.

**Earlier accepted implementation:**
On `feat/javascript-study-sections`, correction **322c873** starts at
**b3b790e**. `StudySheet` and `SheetActivities` scrolling code now has explicit
keyboard tab stops. Two render regressions failed before the fix; focused render
**6/6** and narrow browser scrolling/focus **2/2** pass. Fresh full gate:
**1,637 tests / 233 files**, 57-page build, production **42/42**,
dev-console **1/1**, plus 36 revealed-body toggles without warnings/errors.
See the tracker for exact commands, the worker-start failure/retry and isolated-dev limit.

Coordinator's review of **73414a8** / application **3d4b140** found this one P2;
content/spec had no findings. The user explicitly requested "proceed here" after
the D-100 notice; that instruction applies to this correction only. The bounded
correction was reviewed at **0aa3764**, application **322c873**. The P2
is resolved; Standards and Spec recheck found no new findings. Fresh coordinator
render checks **6/6** and both-theme keyboard-scroll browser checks **2/2** pass.
[KICKOFF](../KICKOFF.md) identifies the application commit and fresh evidence.
Selected content remains seven sections, eleven worked examples and nine local
activities; **26/30** feature sheets and **18/18** stages. No merge, push or promotion.

**Workflow update (approved 2026-10-26, D-99):** Follow the scoped [development workflow](../AGENTS.md#development-workflow): source/content checks for research, a short checklist and inline work for routine pages, and stronger planning/TDD/review for shared or consequential behavior. Policy commits `7fc8cf7` and `af9854d` are integrated into local develop after separate user approval. Existing CI, accessibility and Git safeguards stay.

**Previous checkpoint (2026-10-23): Stage 10's corrected chapter and twelve-panel interactive port are merged locally into develop as `7819457` (`--no-ff`).** All nine plan tasks and independent reviews are complete; final fixes `bd90a05` / `2e3ccc8` cleared the three Minor findings. Fresh merged-tree format/lint/typecheck, **1,559 tests / 218 files** with one worker and unchanged limits, and a **52-page build** pass. The merge tree equals reviewed feature tip `81935a6`; retained final-source browser **3/3**, development-console **1/1** and **28 affected-panel states** were not rerun after merge. Earlier full **27/27** and **1,358-state** checks remain pre-cue evidence. [Integration report](superpowers/reports/2026-10-23-stage-10-integration.md). Local develop W-3 is **16/18**; W-6 **22/27**. Tracked origin/develop remains `79f9e31`; no push or main promotion occurred.
Stage 09's chapter merged as `ad283ce`, its
interactive port as `7a5576a`, and its caching/scaling references as `9de6c99`.
The single-example width repair followed as `79f9e31`. That width repair was the pre-Stage-10 baseline. Tracked `origin/develop` remains
`79f9e31`; the current local develop merge is recorded above.

On **local develop**, W-3 is **18/18**: all eighteen stages are interactive, merged through **c9e5d07**. W-6 is **28 drawn / 31 registered**, including W-6.3v and W-6.3u.2. W-6.4 is integrated as **b8515a0**; three language placeholders remain open. Older Stage 09/reference/width-repair evidence belongs to those historical trees.

**Next task/model:** review/select the proposed Python study design, recommended
**GPT-6.1 Sol / High**. Python, Java and Spring Boot remain undrawn. After design
selection, prepare a compact plan and fresh **GPT-6.1 Sol / Medium** implementation
handoff. Main promotion remains the user's.

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
| **W-3** | Stages 02–18 interactive | ☑ *(18/18 merged to local `develop`; Stage 18 landed as `c9e5d07`.)* |
| **W-4** | Quality gates — tests, CI, committed a11y/responsive checks | ☑ |
| **W-5** | Deploy | ☑ *(live 2026-08-11; the deployment verifies itself via `pnpm test:prod`)* |
| **W-6** | Reference hub — cheatsheets, glossary and stack in one consultable section | ◐ *(25 of 30 registered sheets drawn; native glossary/stack integrated as `b8515a0`. Five language placeholders remain.)* |

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

### P-6 — Fold the real working conventions into the stage docs ☐

`AGENTS.md` records current project practice, including the scoped workflow approved
in D-99. Earlier conventions came from `SmartJobSearchCRM`; adopt the parts that
fit this research/static-site project. The rows below describe the current target
for this still-open task, rather than the superseded blanket process.

Map of what lands where:

| Convention | Stage |
|---|---|
| Conventional commits, scopes, branch naming, `--no-ff` merges, the TEMP idiom | 05 Development · 07 Code Review |
| Risk-based workflow: checklist for content/pages; design/compact plan for consequential behavior | 02 Planning · 05 Development |
| Review severity (`Critical`/`Important`/`Minor`), finding IDs, provenance tags | 07 Code Review |
| Reviewer must disprove as well as confirm, including its own claims | 07 Code Review |
| Behavioral TDD: meaningful RED/GREEN; selective regression-sensitivity checks | 06 Testing |
| Test names that encode rationale, not mechanic | 06 Testing |
| TASKS/TRACKER conventions: evidence over adjectives, standing `Deferred` field | 02 Planning · 10 Documentation |
| Kickoff prompt files for cold-starting a session with full context | 10 Documentation |
| Which skill/MCP/agent for which job | 01 (done) · extend per stage |
| Relevant skills, one implementer by default, escalation for shared/consequential behavior | 05 Development · 06 Testing · 07 Code Review |
| Learning guides written for future-you (`docs/learnings/`) | 10 Documentation · 18 Continuous Improvement |
| Run `humanizer:humanizer` over prose before it is done | 10 Documentation |

- [ ] Update the markdown stage docs listed above
      *(partial, 2026-07-23: teeth check + invariant tests → 06, teeth link → 07,
      warnings-gate trap + gate yaml → 11, DoD line → 05 — landed with W-4's doc pass.
      Remaining: commit/branch conventions → 05/07, review severity + provenance → 07,
      tracker conventions + kickoff files → 02/10, skills-per-stage → all.)*
- [ ] Mirror into the interactive stage as each is built under W-3
- [ ] Record any convention deliberately *not* adopted, and why
- [ ] Give substantive new prose one `humanizer:humanizer` pass

### W-3 — Stages 02–18 interactive ☑ *(18/18 merged to local `develop`; Stage 18 merged as `c9e5d07`.)*

Each stage repeats the same shape. Stage 01 is the reference implementation.

**Earlier merged stage round:** Stage 09 interactive port. The user approved the eight-task
plan and selected Subagent-Driven execution on 2026-10-09. All eight tasks are
implemented and independently reviewed before the approved no-ff merge
`7a5576a` into local `develop` on 2026-10-12. Stage 09 is registered and ready.
Final verification fixes passed independent review.
The gate passed 1459 tests across 198 files, 24 production browser checks
and the development-console audit. The independent whole-branch review
returned Ready to merge, with no new findings. The merged tree then passed
format, lint, typecheck, 1459 tests across 198 files and a fresh 50-page build.
The browser results apply to the identical application tree; those suites were
not rerun after merge. The local feature branch and worktree were removed.
**Latest merged stage round:** W-3.19, Stage 18 Continuous Improvement,
integrated locally as **c9e5d07** after separate user approval. All eighteen
stages are interactive; retained app checks apply to tested **679470f** inputs.

### W-3.19 — Stage 18 Continuous Improvement ☑ *(merged locally as `c9e5d07`)*

**Integration:** user-approved no-ff merge **c9e5d07**, parents **621cbdc / 254797d**.
Merge tree equals reviewed **254797d**; application inputs equal tested **679470f**.
All eighteen stages are now interactive on local develop. Retain the checks below
for identical application inputs; closing-record checks are in KICKOFF.

**Research checkpoint:** **30006f6**, branch `docs/2026-10-30-stage-18-research`,
starting develop **621cbdcff63dd23f5bcff5b650c1eb4484511492**.
Reader task: distinguish product outcomes from delivery/process signals and
choose the next improvement from evidence. Stage numbers remain filing codes.

- [x] Assess the existing chapter against primary sources; label illustrative
  examples and unknown project facts.
- [x] Gather useful visual references with source/permission records and assess
  possible later W-6 value in one research record (three link-only candidates).
- [x] Include `AI in continuous improvement` and require the later AI Plays step.
- [x] Apply D-99 prose/content checks and refresh the model-aware handoff.

Sources and original-claim assessment live in
[one research record](../reference/stage-18-source-research.md). The
[revised chapter](18-continuous-improvement.md) separates observations from
interpretations, adds a PDSA-based record and inconclusive worked result, and
replaces universal fix/delete/automation rules with contextual decisions.
Independent final content review found no actionable issues. Fresh checkpoint
checks: metadata/citations/ledger **41/41**, changed local links **11/11** and
whitespace, all exit 0. No app behavior changed; no app gate or browser claim.

**Implementation:** **679470f** on `feat/continuous-improvement`, from research
handoff **141c1e293d045f77798d55286f510694d067a94e**. The chapter stayed stable;
chapter and page were integrated together under D-51. **dc62d9f** replaces
the audit's obsolete Stage 18 placeholder assumption with a controlled empty-rail
fixture, retaining the real navigation/DOM check and rejection assertion.
Recommended implementation setting was `gpt-6.1-sol`, effort `high`; this does not
assert an environment-confirmed active model.
Return to coordinator **01a18acc-3b54-7202-92f3-404cc94fd0ad** with the branch,
commits, checks and implementation session **01a18acc-4d44-72f0-9e32-92b73a0b7a9f**.

**Page scope and acceptance checklist:**

- [x] Read `web/PATTERNS.md` and `web/DESIGN.md`; use existing interactions.
  Start with six content judgments: distinguish measures; investigate a signal;
  choose the next action; plan/study a change; improve delivery conditions;
  update guidance or pause feature work. Split only where panel weight needs it.
- [x] Teach through classification/reveal, observation inspectors, bounded
  decision exercises and an annotated improvement record. Carry the fictional
  invoice example through its inconclusive result. Keep denominators, minority
  needs, alternate explanations and harm checks visible.
- [x] Add a dedicated AI Plays step with the four chapter plays, supplied inputs,
  source/count checks and limits. No synthetic feedback presented as user evidence.
- [x] Port artifacts, done checks, team notes, traps and source links. Preserve
  recurring cadence and product-versus-delivery distinctions. Follow existing
  front-matter conventions; this adds the established chapter/page duplication.
- [x] Build under `web/src/features/continuous-improvement/`, register in
  `web/src/features/stage-content.ts`, then set ready in `web/src/lib/stages.ts`.
  Extend the chapter AI guard in `web/src/lib/stage-metadata.test.ts` to Stage 18;
  the chapter heading already exists and is now covered by that explicit list.
- [x] Add meaningful render coverage for data-derived output and exercises;
  reuse existing hash, disclosure and keyboard behavior. New shared behavior
  requires D-99's stronger path and behavior TDD; static content does not.
- [x] Run the completed web gate once: format, lint, generated-route typecheck,
  unit/DOM tests, production build and audit. Run dev-console once. Check affected
  panels/material states in both themes at narrow/middle/wide widths, keyboard,
  hash/Back/reload, contrast, touch targets, overflow and console.
- [x] Obtain one independent final content/page review of the actual final diff.
  Report reviewed commit and evidence; keep later changes visible.

**Final verification:** application **679470f** passed format/lint/typecheck,
**1,586 tests / 222 files**, a **54-route** production build and focused both-theme
browser checks. The full audit run passed **26/27**; its sole failure was the
obsolete assumption that Stage 18 had no rail. After **dc62d9f**, the corrected
audit-page suite passed **3/3** against the same build; the other 26 results are
retained for unchanged inputs. Development-console **1/1** used an identical
source copy with an isolated dev lock. Independent Astra Low content and live-page
review found no actionable issues. [Tracker](tracker.md) records commands and
limits; [KICKOFF](../KICKOFF.md) carries the coordinator return handoff.

Deferred: W-6 companion selection/implementation and image publication, shared
refactors, real analytics/research collection, push and promotion.
No external artwork is cleared for publication. W-3 is **18/18** on local develop;
W-6 remains **24/29**. Main promotion belongs to the user.

### W-3.18 — Stage 17 Maintenance ☑ *(merged locally into develop as `6b78fcf`, 2026-10-30)*

**Integration:** user-approved no-ff merge **6b78fcf**, with W-6.3s and D-100.
The merge tree equals **f86541c**; application inputs equal tested **5ea8cb2**.
Earlier implementation recommendation:
`gpt-6.1-sol`, `high`. For this correction the user explicitly selected continuation
of session `01a1850c-d865-7d02-a3c0-23916ced0f66`.
Use [KICKOFF.md](../KICKOFF.md) for starting commits and handoff requirements.

Reader task: choose and safely complete the next maintenance action, with evidence,
an owner and a follow-up date. Maintenance runs continuously; stage 17 is a filing
code, not a prerequisite after incidents.

**Original interactive scope approved 2026-10-29:** six panels: triage, updates, expiry,
data and recovery, debt and retirement, review record. Start branch
`feat/maintenance-page` from workflow handoff **23f481e**. Use existing `Stepper`,
`Drill`, `RevealList`, `Figure`, `Term` and team-note patterns; keep state local to
the existing components. The corrected chapter and its source record govern the
teaching content. The fictional queue and record must remain labelled; no live
maintenance operation or new reference sheet is included.

Acceptance: meaningful render coverage for scoring, explanations and conditional
output; rail/ready registration; useful first-use definitions and generated glossary;
all chapter topics and traps represented. Run the final web gate once, the
development-console sweep, and focused keyboard/layout/state checks in both themes
at narrow, middle and wide widths. One independent final content/page review is required.
Recommended implementation setting remains `gpt-6.1-sol`, `high`; the environment
does not confirm the active model. Integration requires separate approval.

- [x] Verify primary sources for dependency updates, debt/refactoring, retirement,
  expiry, retention and recovery; distinguish provider facts from playbook advice.
- [x] Gather useful visual references with original source and reuse terms; assess
  later W-6 lookup value without registering a sheet yet.
- [x] Update `17-maintenance.md`, including one clearly illustrative maintenance
  record; avoid unverified destructive commands and universal capacity targets.
- [x] Humanizer editing pass, one independent final content review, relevant
  chapter/title/ledger guards and changed local links/anchors.
- [x] Six panels, three scored exercises, review record, all seven traps, five
  generated glossary definitions and stage/rail registration; nine meaningful render tests.
- [x] Final application gate, both-theme keyboard/state/layout checks and development-console
  sweep; independent final content/page review with no actionable findings.

**D-35 correction:** the six-panel completion above is an earlier checkpoint,
not evidence that the required AI Plays section existed. Coordinator handoff
**345c972** confirmed the gap and governs this correction.

- [x] Add `### AI in maintenance` and the seventh `#ai` step, with four grounded
  assistance plays and visible evidence, privacy and authorization limits.
- [x] Demonstrate failing chapter/rail/render checks before fixing the omission;
  extend the chapter guard to Stage 17 and require coverage of every ready stage.
- [x] Humanizer pass, focused **64/64**, full **1,573/1,573 across 220 files**,
  format/lint/typecheck and **53-page build**; six affected theme/width cases.
- [x] Final production audit **27/27** in one run, development-console **1/1**,
  and scoped correction review PASS. Handoff ready for main coordinator review
  of **345c972..HEAD**, the actual evidence and this implementation session.

Correction checks apply to **28d4410** (app unchanged from **01b8dc2**).
Earlier **ebcb0ba** results below remain historical; the correction's completion
row in the tracker supersedes the earlier feature-complete claim. Main coordinator
review completed at **98688ec** with no actionable findings and fresh **48/48**
focused checks. The review covered the correction; separate merge approval
was granted for merge **6b78fcf**.

Chapter/source commit **8ee4efc**, based on develop `4f965e8`.
Sources: [Stage 17 research](../reference/stage-17-source-research.md). The chapter
uses an attributed original image with author permission. Focused guards pass
**50/50 across three files**, local links/anchors and formatting pass, and the
independent content review returned PASS with no actionable findings. These were
the chapter-only checks; the later app verification follows.

App commit **ebcb0ba**, acceptance **c507a7a**, from handoff **23f481e**:
format/lint/typecheck, **1,570 tests / 220 files**, **53-page build** pass.
Production audit: **25 passing checks retained plus two passing isolated timeout
reruns**, unchanged app and limits. Focused browser sweep: **36 combinations**
(six panels, both themes, 320/768/1440px), expanded/answered states, keyboard,
definitions and console pass. Development-console **1/1** passes using a temporary
config against the preserved 3200 server. Independent final review PASS; humanizer
pass complete. See the tracker completion row for commands and failure context.
Session: `01a1850c-d865-7d02-a3c0-23916ced0f66`.

Stage 17 and its W-6 companion are integrated as **6b78fcf**. Deferred: unrelated
shared behavior, live dependency/database operations, push and production promotion.

### W-3.17 — Stage 10 Documentation ☑ *(merged locally into develop as `7819457`, 2026-10-23)*

The [approved chapter design](superpowers/specs/2026-10-20-stage-10-documentation-design.md) and [five-task plan](superpowers/plans/2026-10-20-stage-10-documentation.md) were committed before implementation. The user’s “proceed up to implementation” authorized the recommended inline execution, retaining independent reviews and cold readers.

The [corrected chapter](10-documentation.md) now teaches the smallest useful document set, runnable-setup evidence, ADR supersession, current architecture/contracts, explicit drift checks/owners and grounded AI review. The shared ADR definition and generated glossary agree. Two Stage 03 inbound anchors were corrected after the full suite exposed a plan-authored dependency omission.

[Execution evidence](superpowers/reports/2026-10-20-stage-10-execution.md) retains raw RED/GREEN and actual mutation diffs/restorations. The [same-case recheck](superpowers/reports/2026-10-20-stage-10-correction-rerun.md) returned **5 HIT**, compared with **0 HIT / 3 PARTIAL / 2 MISS** at baseline; completeness found no remaining teaching defect in Toolshare. Missing project facts remain explicit. All four completed tasks have independent clean reviews, with the link and report-format findings resolved.

[Primary-source notes](../reference/stage-10-source-research.md) and [image provenance](../reference/cheatsheet-sources.md#stage-10-gathering-round--2026-10-15) remain. Research capture `e30c9a4` preserves three original diagrams and the user JPEG; none is published in the web app. The research appendix is replaced by active teaching and retained provenance.

- [x] Explore scope and commit chapter spec/plan before corrections
- [x] Review the plan and authorize inline execution through implementation
- [x] Correct confirmed findings through RED/GREEN, independent reviews and sensitivity checks
- [x] Rerun the exact held-out completeness/consultability instruments
- [x] Complete chapter verification and final whole-branch/fix reviews; integration still requires a fresh decision
- [x] Write and builder-check the separate [interactive-port spec](superpowers/specs/2026-10-20-stage-10-interactive-port-design.md); no important planning questions remain
- [x] Approve the port spec (`3165b62`) and write/self-review the [implementation plan](superpowers/plans/2026-10-20-stage-10-interactive-port.md)
- [x] Review the plan and select subagent-driven execution (user “proceed”, 2026-10-22)
- [x] Implement the port through TDD, per-task review and whole-branch review; verify both themes, responsive layout and both console modes
- [x] Register the port on the feature branch (`7f803bc`); final fixes `bd90a05` / `2e3ccc8` pass the clean scoped review
- [x] Refresh the final handoff and hash-verify the full execution archive
- [x] Record separately approved local integration (`7819457`) and fresh merged-tree verification

Local develop now has Stage 10 `ready: true` and W-3 is **16/18**. The merge tree equals the reviewed feature tip; fresh merged-tree verification is recorded in the integration report. W-6 stays **22/27**. Deferred: stages 17/18, W-6.4, five language sheets, unrelated repairs, new reference companions and promotion. Stage numbers remain filing codes, not a sequence.

### W-3.16 — Stage 09 interactive port ☑ *(merged locally into `develop` as `7a5576a`, 2026-10-12)*

Start from the [reviewed chapter](09-performance-optimization.md), its
[design spec](superpowers/specs/2026-10-08-stage-09-performance-design.md),
[chapter execution report](superpowers/reports/2026-10-08-stage-09-chapter.md),
and the [source audit](../reference/stage-09-performance-sources.md). Read
`web/PATTERNS.md` and `web/DESIGN.md` before choosing interactions. The
[separate port spec](superpowers/specs/2026-10-08-stage-09-interactive-port-design.md)
was approved on 2026-10-08. The
[eight-task plan](superpowers/plans/2026-10-08-stage-09-interactive-port.md)
was executed with Subagent-Driven development. Its tasks are complete; the
[execution report](superpowers/reports/2026-10-08-stage-09-interactive-port.md)
preserves TDD and review evidence. The
[final verification](superpowers/reports/2026-10-09-stage-09-final-verification.md)
records the full gate, 574 interacted-state measurements and chapter coverage.
The [whole-branch review](superpowers/reports/2026-10-12-stage-09-whole-branch-review.md)
covers all 54 changed files and records the remaining scope limits.

The port should make the reader choose a user-visible outcome, define its
start/end observer, record a comparable first baseline, distinguish checkout,
payment and `OrderPaid` consumer clocks, inspect diagnostic evidence, and only
then choose and retest a fix. Use hypothetical data visibly labelled as such;
this static site has no order backend or production telemetry. Keep the three
event consumers as branches unless an explicit business rule makes them serial.

Done for W-3.16 means the Stage 09 content is registered and `ready: true`,
the doc-to-port coverage is checked, component-derived behavior has render
tests, and both themes, responsive widths, touch targets and clean-console
audits pass. These checks are complete, and the user-approved merge landed on
2026-10-12. The
[integration receipt](superpowers/reports/2026-10-12-stage-09-integration.md)
travelled with the no-ff merge. Actual post-merge results are recorded in the
W-3.16 merged-tree tracker row; raw output remains in
`.superpowers/sdd/2026-10-08-stage-09-interactive-port/merged-verification.md`.

Deferred: the W-6 `caching` and `scaling` sheets, any third-party image,
real ordering-system measurements, push and deployment.

### W-3.15 — Stage 09, chapter audit ☑ *(merged locally into `develop` as `ad283ce`)*

The canonical chapter now starts with a baseline record before any candidate
fix. It separates browser checkout time, provider and webhook delays, visible
Paid status and the three `OrderPaid` consumers. A worked 20-item cart example
uses traces to justify batching, then compares the same user outcome after the
change. Unsupported index, bundle, image and low-traffic rules were corrected
against [the source audit](../reference/stage-09-performance-sources.md).

The chapter and guard were committed through `758c2cc` on
`docs/2026-10-08-stage-09-research` and merged as `ad283ce`. The cold reader exposed a missing timeout
denominator; the whole-branch reviewer found a user-clock versus route-clock
gap, fixed test-first. Final suite: 1416/1416 across 185 files; format, lint,
typecheck and the 50-page production build passed. See the W-3.15 tracker row
and [execution report](superpowers/reports/2026-10-08-stage-09-chapter.md)
for the RED/GREEN and review evidence.

Deferred: the Stage 09 interactive port and its UI audits, W-6 `caching` and
`scaling` sheets, image publication, push and deployment.

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

### W-3.14 — Stage 08, chapter audit and interactive port ☑

The corrected chapter now carries an invoice threat model, permission matrix,
two-user probes and a worked finding with retest. The interactive port has ten
steps, one permission inspector and a committed IDOR decision. The first
whole-branch review found missing reset, error and logging controls in the port;
commit `5a82e43` closed that gap and put primary source links beside the claims.
The approved no-ff merge `a03e190` brought Stage 08 to `develop`, taking W-3 to
14/18. The feature branch was deleted after the merged tree passed its gates.
The RED/GREEN record, gate results and deferrals are in
`docs/superpowers/reports/2026-10-02-stage-08-security-audit.md` and the W-3.14
row in `docs/tracker.md`.

### W-3.13 — Stage 16, document repair and interactive port ☑

The repaired incident-management chapter landed on `develop` as `3d9d70c`; the
interactive port followed as no-ff merge `3d2c266` on 2026-10-01. Fourteen
steps cover impact and severity judgment, the connected Nudge rehearsal,
recovery, postmortem follow-up and traps. Stage 16 is `ready: true`, taking W-3
to **13/18**. TDD and a whole-branch review caught and fixed three blocking
issues. The merged tree matched the reviewed tip and passed 1388 tests across
181 files; the full pre-merge gate and browser audits passed. The detailed RED,
GREEN, review and deferral record is in [tracker W-3.13](tracker.md#completed).

Deferred: the W-6 incident-management reference companion, two minor chapter
review follow-ups, the optional incident-record template and production
promotion. The local merge was authorized separately; nothing was pushed or
deployed.

### W-3.12 — Stage 15, doc round and port ☑ *(**doc round merged `develop` 2026-09-11 as `7418684`; port merged `develop` 2026-09-16 as `9d834e8`** (`--no-ff`), `ready: true`. Ten planned steps grew to sixteen after Task 11's verification found four panels — not the plan's pre-authorized one — over the D-52 screen budget; brainstormed and split in two rounds. Per-task review: sonnet for most tasks, opus for Task 10 (`stages.ts`/registries). **Final whole-branch review (opus) found two blocking issues — untested checklist persistence, two stale step-count references from the reshape — both fixed (`3604e59`) and independently re-verified with a teeth check.** Post-merge gate re-run on `develop` at `9d834e8`: 179 files/1351 tests, `pnpm lint` clean, `pnpm typecheck` clean)*

Stage 15 closes the shipping pipeline that 11 → 12 → 13 → 14 opened, and it is the
first stage whose doc was assessed **before** any of it was written, rather than
after the port had already been shaped by it.

**The doc round comes first, and it is not a formality.** Two cold readers ran on
2026-09-08 per D-54, each allowed to read only `docs/15-observability.md`. The
findings are recorded in full in
[`docs/superpowers/specs/2026-09-08-stage-15-cold-reader-findings.md`](superpowers/specs/2026-09-08-stage-15-cold-reader-findings.md)
and the round that closes them is
[`docs/superpowers/plans/2026-09-08-stage-15-doc-round.md`](superpowers/plans/2026-09-08-stage-15-doc-round.md).

What they found, in short:

- **Six contradictions.** The reference implementation sent customer email to Sentry
  while the Definition of done forbade personal data; the alert list required paging
  on a new error type and forbade paging on a single error, two bullets apart; the
  Artifacts entry demanded a four-signal dashboard from a section that listed three.
- **Four things the stage requires and never teaches** — `beforeSend`, the `logger`
  identifier its best example depends on, deploy markers, and monitoring a real user
  path on a service that has no homepage.
- **Nine things it never mentions**, headed by the two about silence: nothing in the
  stage detects a scheduled job that never ran, and "nothing is reporting and
  something is still wrong" had no answer anywhere. The material for the second was
  on the page twice — a deliberately swallowed `catch` and a business failure that
  throws nothing — and the lesson was never drawn.
- **Consultability 2/5.** The document is filed by tool and read by symptom.

**Five references were gathered by the user after the plan was committed**, and
changed it — recorded as Task 13b rather than folded in silently. The one that
justifies the task on its own: the round as planned taught scrubbing for the error
tracker and nothing for the logs, while the checkbox it was fixing covers both. That
is the same defect class the round exists to close, introduced by the round closing
it. See [`docs/learnings/plans-are-unverified-101.md`](learnings/plans-are-unverified-101.md).

**Where it stands, 2026-09-11: all 16 tasks are done.** Tasks 0–14 ran and merged
2026-09-10 (`fcd46f1`). Task 14's re-run scored 5/5 on both instruments, and produced
six blocking findings (I1–I6, two reproduced by a runtime harness) and M1. Task 15
closed all seven, test-first, on `fix/stage-15-fix-wave`. Per D-48, the re-run then ran
again on the fixed doc, same Loaf scenario verbatim, blind to the fixes: I1–I5 confirmed
closed, and it surfaced one gap the fix queue hadn't named (a required liveness
endpoint with no code example), fixed the same way. The whole-branch review the
mid-round merge owed then ran (covering the full round from before Task 0) and found
two blocking defects **the fix wave itself had introduced** — `Sentry.init` shown in a
module that never runs it, and the I2 fix logging a raw database password to stdout —
plus a vacuous test and one untaught DoD checkbox. All fixed and independently
re-reviewed. Task 16 wrote these records and registered the five text sources that fed
the doc in `reference/cheatsheet-sources.md`. Gate: 1218/1218 across 162 files on the
branch, reconfirmed on `develop` after merging. **Merged `--no-ff` as `7418684` at the
user's request, branch deleted, `develop` level with `origin/develop`.**

**The port's brainstorm ran on 2026-09-11, on Opus.** Four judgment exercises were chosen
(alert triage, log level, silence, scrubber) and a persisted baselines worksheet was
deferred to its own round at the user's direction. The spec (`f670aab`) and the plan
(`2071f9f`) landed on `develop`. The plan's intermediate state was also committed as
`e4750ad` under the subject "feat: scaffold data modules and test infrastructure" — that
commit holds only the plan markdown, no code, and is already on `origin`; the subject is
wrong about itself and is left as it is.

**The port executed 2026-09-15 on `feat/stage-15-observability-port`** (18 commits,
`d9b4da2..2ea6414`), subagent-driven, sonnet implementers, per-task reviewers on sonnet
(opus for Task 10, which touches `stages.ts` and both registries, per `CLAUDE.md`'s
measurement rule). Ten planned steps became **sixteen**: Task 11's verification measured
four panels over the D-52 screen budget, not the plan's pre-authorized one, and the
resulting reshape is recorded in full in `docs/tracker.md`'s 2026-09-15 W-3.12 row.
`ready: true`; gate at branch tip: **179 files / 1348 tests**, expandable count **379**,
`pnpm test:e2e` **18/18**, `pnpm test:dev-console` **1/1, zero warnings**. The final
whole-branch review (opus) found two blocking issues — untested checklist persistence,
two stale step-count references from the reshape — both fixed (`3604e59`) and
independently re-verified with a teeth check. **Merged to `develop` as `9d834e8`**
(`--no-ff`), 2026-09-16, branch deleted, `develop` pushed. Post-merge gate re-run on
`develop`: **179 files / 1351 tests**, `pnpm lint` clean, `pnpm typecheck` clean.

**Scope of the doc round, deliberately:** corrections, the untaught artifacts, the
missing sections, the `### AI in observability` section D-35 requires, glossary
repairs, and platform coverage extended to AWS to match stages 13 and 14. **The port is
now done and W-3 reached 12/18 at that point.**

**Deferred out of it, on the record:** trimming `## Traps` and deleting `## Artifacts`
— both raised by the readers, both rejected because they are the house template
across eighteen documents and changing one document to answer a playbook-wide
question creates drift rather than removing it. Also the bold-lead-in navigability
finding, which belongs to the port, since a stepper surfaces lead-ins as panel
structure.

---

### W-6 — Reference hub ◐ **RESUMED 2026-08-24, per-stage cadence (D-88)**

> **The pause is deliberately overridden, not lifted.** From 2026-08-14 to
> 2026-08-24 this section was paused because content work competes with `W-3`, the
> project. That reasoning still holds in general — **W-6 is not "the project"** —
> but the user made an explicit, informed call
> to run a bounded W-6 round after finishing each W-3 stage, when there is reference
> material naturally related to what was just built. Stage 05 (Development) shipped
> 2026-08-20; this round follows it. **The standing rule going forward**: after a
> stage ships, check whether related lookup material is worth adding, and if so run a
> scoped round before picking the next `W-3` stage — not instead of picking it.
>
> Resuming needs no re-decision each time: read this section, pick a sheet from
> `reference/cheatsheet-sources.md` tethered to a finished or in-progress stage, and
> fill its `sections: []`.

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
Originals are committed alongside the converted copy; the conversion recipe and measured
savings are in `reference/cheatsheet-sources.md`. Evidence in `docs/tracker.md`.

> This entry read "Originals stay untracked and gitignored" until 2026-09-08 and was
> wrong from the day it was written. Closed as **TD-44** in favour of describing what the
> repo does: 65 files under `reference/` are tracked, `.gitignore` never covered them,
> and ignoring them now would reclaim nothing because the bytes are already in history.

**W-6.3 — Fill the ten empty sheets ◐** *(six of the original ten drawn 2026-08-24,
plus three sheets not in the original count; five language sheets remain)*

Content work, not app work, now that the frame exists. **Drawn this round**:
`design-patterns` (all 23 patterns, three sections), `api-design` (fifteen-step
roadmap condensed to six sections), `git-commands`, `git-branching`. **A fifth
`CheatsheetGroup`, Design Principles, was added mid-round (D-90)**: SOLID and
Clean Code were drafted as two of `coding-standards`'s four planned sections, then
pulled back out into their own sheets, `solid-principles` and `clean-code`, once it
became clear they are principles carried across a codebase rather than
project-specific style rules — each now has its own before/after code examples
(`Row.example`, a new field, TDD'd). `coding-standards` is left with one section,
code smells; naming conventions is still held empty — the one gathered source
turned out to be Godot-specific, wrong domain, and a general or JS/TS replacement is
still being searched for. `sdlc` is untethered, not in the original ten either.
**Two real defects surfaced by the audit, not introduced by anything before this
round**: the new code-example grid blew out past 320px (a classic CSS grid item
`min-width: auto` case — fixed with `min-w-0` on the grid item), and `coding-standards`
is the first sheet ever to carry a `source.url`, which exercised a footer link with
no touch-target sizing for the first time — fixed with the same `min-h-11` treatment
used elsewhere. Both were caught by the existing audit suite, not a new check.
**Still `sections: []`**: `javascript`, `python`, `java`, `spring-boot`, `express` —
the language sheets, lowest priority per the gathering list. Most images gathered for
this round still have author/URL unrecorded; fix before promoting past `develop`
(D-63). Evidence in `docs/tracker.md`.

**W-6.3b — Real syntax highlighting on the two Design Principles sheets**
*(2026-08-25)*. Not a new sheet — `solid-principles` and `clean-code`'s existing
before/after examples now render through Shiki instead of plain mono text, in a
four-role palette matched to the whiteprint/cyanotype system (**D-91**). One real
defect found along the way: highlighting computed via a top-level `await` inside the
data modules passed `pnpm test` and `next build` but broke `pnpm test:e2e`
outright — fixed by moving highlighting to generate time (`pnpm gen:highlighted`),
the same committed-snapshot pattern `cheatsheets.md` and `glossary.md` already use.
Evidence in `docs/tracker.md`.

**W-6.3c — `sdlc` expanded into a two-section guide** *(2026-08-25, user request)*.
Not a new sheet either — the seven phases gained a concrete deliverable each, and a
second section compares Waterfall, Agile/Scrum and DevOps/Continuous against the
same seven phases. No code examples: SDLC is a process framework, and the user's own
scope call (asked, not assumed) was deliverables plus methodology comparison, not
code. Evidence in `docs/tracker.md`.

**W-6.3d — `sdlc`'s phases retaught through one running example** *(2026-08-25, user
request)*. The deliverable lists W-6.3c added named artifact types; this round
replaced them with one small scenario (adding password reset) carried through all
seven phases, so each phase's output visibly becomes the next phase's input rather
than seven disconnected examples. Evidence in `docs/tracker.md`.

**W-6.3e — Two new sheets, `testing` and `playwright`** *(2026-08-28, tethered to
stage 06)*. `testing` (five types plus the pyramid concept) and `playwright` (a
tool-specific companion, same split as `git-commands`/`git-branching`) — eleven of
sixteen registered sheets now drawn. Gathered from a status that read stage 06 as
"chosen but not built"; the port had actually shipped and merged the day before, and
this round's own commit is honest about having started from stale information. Also
where a "not yet merged" claim on stage 06 itself, sitting unnoticed in this file and
`docs/tracker.md` since the merge, was found and corrected. Evidence in
`docs/tracker.md`.

**W-6.3f — `clean-code` gains four more principles** *(2026-08-28, user request)*. Not
a new sheet — a second section, SOC/DYC/TDD/YAGNI, from a second gathered source (Neo
Kim), consulted rather than displayed as a second plate (D-89). Two cross-references
added: SOC to `solid-principles`, TDD to `CLAUDE.md`'s iron law and the new `testing`
sheet. Evidence in `docs/tracker.md`.

**W-6.3g through W-6.3l** are recorded in `docs/tracker.md` only, not narrated here:
`code-review`, `deployment-environments`, `aws-deployment`, `post-deploy-verification`,
`git-cheatsheet`, `github-actions`. Sheets seven through seventeen.

**W-6.3m — `ci-cd`, the concept half of stage 11's pair** *(2026-09-07, tethered to
stage 11)*. The eighteenth sheet drawn, and the third time the registry has split a
topic into a concept sheet and a tool sheet — `git-commands`/`git-branching`,
`testing`/`playwright`, now `ci-cd`/`github-actions`. Four sections: what CI, continuous
delivery and continuous deployment each actually automate; the seven pipeline stages
ordered cheapest-failure-first, each with what fails there; which tool plays which role
(runner, build, quality gate, registry, runtime, provisioning, config management); and
six practices. Built from three gathered graphics — ByteByteGo's workflow plate
displayed, two others consulted, the D-89 convention D-90 kept on file for exactly this
case. The displayed plate shows Jenkins and Kubernetes rather than this project's own
GitHub Actions and Vercel, accepted deliberately because the flow shape is what a
concept sheet teaches and the tool-landscape section makes the substitution explicit.
`github-actions` gained cross-references but no new sections. Evidence in
`docs/tracker.md`.

**W-6.3n — `ci-cd` expanded to seven sections** *(2026-09-07, user request)*. Not a new
sheet — the W-6.3m round displayed one plate and consulted two others, then took tool
*names* from the consulted pair and little else. The user noticed the two densest sources
were barely used. Three sections added, 24 rows → 49: **Commands worth knowing** (eleven
rows set in `code`), **Docker in the pipeline** (six), and **Traps** (six, the convention
every interactive stage carries and this sheet lacked), plus two "why" rows in the opening
section. The commands gap was the real defect: `types.ts` states a sheet "answers 'what
was that command again' in one screen", and the sheet named Maven, Terraform, Ansible and
kubectl while giving the reader nothing to type. Plate unchanged, since the 16-section
source is exactly what this repo's capture rule calls a prompt rather than something to
reproduce. Evidence in `docs/tracker.md`.

**W-6.3o — `incident-management`, Stage 16's lookup companion** *(merged
locally into `develop` 2026-10-02 as `a992d74`)*.
Four sections keep declaration, provisional severity, safe mitigation, communication,
recovery proof and follow-up together. The sheet uses the repaired Stage 16 chapter
as its operational scope and credits the Google SRE incident-response chapter.
No image plate was selected: the NovelVista candidate puts communication after
diagnosis and resolution before recovery validation, while the other captures need
provenance or contain placeholder and conflicting material. Evidence in
`docs/tracker.md`.

**Stage 08 source gathering ☑ (merged locally into `develop` 2026-10-02 as
`073daa8`).** Three attributed OWASP image captures are in `reference/`; see
`reference/cheatsheet-sources.md`. The authorization matrix lacks
object-ownership tests, and the two threat-model diagrams are historical
examples. At that point no `security` sheet or image plate was registered; the
two-user IDOR exercise and finding record still needed an original presentation
informed by the cited OWASP text guidance. That gathering did not advance W-6's
drawn-sheet count. W-6.3p below is the follow-up.

**W-6.3p — `security`, Stage 08's lookup companion ☑** *(merged locally into
`develop` 2026-10-05 as `739c8ed`)*. Four sections turn the two-user
invoice audit into a lookup for boundaries and policy, read/update/delete/export
probes, enforcement checks, and a retestable finding. An original 640 × 780 SVG
shows User B's known invoice ID crossing the browser/server boundary and being
denied by an owner-scoped lookup. The three gathered OWASP images remain source
captures, not published plates. The sheet adds one entry to the registry, so
`develop` is **20 drawn of 25 total**. Post-merge tests passed 1406/1406;
the feature branch was deleted. Evidence and
deferrals are in the W-6.3p tracker row, source ledger, and
`docs/superpowers/reports/2026-10-05-security-reference-sheet.md`.

**W-6.3q — Stage 09 caching/scaling lookup companions ☑** *(merged locally
into `develop` as `9de6c99`, 2026-10-14)*

The approved [spec](superpowers/specs/2026-10-13-stage-09-reference-design.md)
and [four-task plan](superpowers/plans/2026-10-13-stage-09-reference.md) delivered
shared supporting citations, a five-section caching guide and a four-section
infrastructure-scaling guide. All four task reviews, the whole-branch review
and the final scoped rereview are complete. M1's runner noise and M2's
Markdown citation-text gap were addressed. The
[execution report](superpowers/reports/2026-10-13-stage-09-reference.md)
retains raw TDD, teeth, source, lookup and review evidence.

The approved no-ff merge has parents `597fe0b` and `4e5532f`; its tree matches the
reviewed tip. Post-merge format, lint, generated-route typecheck, **1495/1495 tests
across 207 files** and a fresh **52-page build** passed. The feature branch and
worktree were removed after verification, with all 224 archived evidence files
preserved. W-6 is **22/27** on develop; W-3 remains **15/18**.

The later [single-example width repair](superpowers/reports/2026-10-15-reference-example-width.md)
merged as `79f9e31` on 2026-10-15. Its merged tree passed **1496/1496 across 207
files**, format, lint and typecheck; the identical reviewed tree passed
**24/24 production browser checks**, **1/1 development-console check** and
**28 geometry observations** across both themes and seven widths. Its feature
branch was deleted. Raw post-merge evidence is in
`.superpowers/sdd/2026-10-15-reference-example-width/merged-state.json`.

- [x] Recheck first-party sources and agree sheet boundaries
- [x] Implement caching, scaling, supporting citations and generated artifacts
      through the approved plan, TDD and per-task review
- [x] Complete whole-branch/scoped reviews and browser verification
- [x] Record actual registry counts and approved merge evidence; refresh the
      next-session handoff

Deferred from this slice: stages 10/17/18, W-6.4, five language sheets,
diagrams/image republication, runtime infrastructure, real order benchmarks,
shared-drill/storage repairs and production promotion. Stage 10 is now selected
as its own next round. Every future merge remains a separate user decision.

**W-6.3r — Stage 10 Documentation change-check companion ☑** *(merged locally into develop as `8eb294c`, 2026-10-27)*

The finished stage teaches the decisions across twelve panels. This bounded
round adds one all-visible reference card at `/reference/documentation`: choose
a form, adapt record fields, trace changed facts and qualify publishing claims.
It uses the existing renderer and citations, with no new state or components.
The compact summaries are an intentional additional view of the chapter; the
sheet module remains the single source for its generated Markdown.

- [x] Compare gathered candidates with the stage and recheck primary sources
- [x] Add the text-only sheet, registration, generated Markdown and render coverage
- [x] Run the final web gate once, check the affected page in both themes and obtain one final review
- [x] Record actual counts, verification and deferred work
- [x] Integrate after separate user approval (`8eb294c`); retain identified unchanged-app checks

No image plate is needed for the four-form lookup. The gathered JPEG's reuse
permission remains unconfirmed; all source images stay research assets. Deferred:
new interaction patterns, copy/export controls, shared refactors, other sheets,
W-6.4, stages 17/18, push/main promotion and deployment.

**W-6.3s — Stage 17 Technical Debt Review ☑** *(merged locally as `6b78fcf`, 2026-10-30)*

- [x] Compare gathered candidates with Stage 17 and the reference renderer.
- [x] Recheck selected primary sources and image reuse permission; record one
  bounded recommendation in the existing source record.
- [x] User selected the recommended four-section/fourteen-row scope with "proceed".
- [x] Implement from scope handoff **0532af2** in session
  **01a1860d-161c-7b71-972a-dba429ec0499**; recommended **Sol High**, active setting
  unconfirmed. Implementation **5ea8cb2**.
- [x] Register the sheet, preserve the unchanged attributed image, provide its
  full textual equivalent, render coverage and generated Markdown.
- [x] Final web gate, focused image/theme/width/keyboard checks and one final
  independent content/page review; integration needs separate approval.
- [x] User-approved no-ff integration into develop as **6b78fcf**; retain the
  identified final gate for unchanged application inputs.

Approved slug `technical-debt`, Standards group, tether `17-maintenance`.
Four sections/fourteen rows: four debt categories, four evidence prompts, three
response choices and three retirement checks. The quadrant classifies debt; it
is not a priority score. Keep the original credit/link and unchanged-image
statement in the existing source area. Defer the broad Maintenance checklist,
package-manager command card, new controls, shared renderer work and live actions.
See the [assessment and acceptance scope](../reference/stage-17-source-research.md#w-6-assessment-technical-debt-review-2026-10-29).
Local develop W-6 is **24/29** after approved merge **6b78fcf**.
Implementation, final gate (**1,576/221**, **54 routes**, **27/27**) and independent
content/page review are complete at **5ea8cb2**. Coordinator reviewed
**0532af2..e358608**, no actionable findings; fresh **31/31** focused checks.
The user approved integration as **6b78fcf**; app checks are retained for the
identical tree. Push and main promotion remain separate.

**W-6.3t — Stage 18 Improvement Review ☑** *(merged locally as `2cc7d5d`)*

- [x] Compare the finished stage and neighbouring sheets with the candidate.
- [x] Recheck primary sources and existing visual reuse limits; record one
  bounded recommendation in the existing Stage 18 research record.
- [x] Prepare implementation acceptance and model/session handoff.
- [x] User selected the recommended scope with "proceed" on 2026-11-04.
- [x] Implement the static sheet, stage tether, citations, generated Markdown
  and meaningful render coverage in the fresh implementation session
  (recommended Sol High; active setting not independently confirmed).
- [x] Complete the final web gate, focused both-theme/width/keyboard checks and
  one independent final content/page review.
- [x] Record branch/commit, actual checks and session reference in KICKOFF for
  coordinator review; direct posting to another Codex session is unavailable.
- [x] Coordinator reviewed **41c0f2f...75f028c**, including actual code/data,
  generated Markdown, render tests and raw results; no blocking findings.
- [x] User approved no-ff integration into develop as **2cc7d5d**, parents
  **ff6ce06 / 0e801ca**. Merge tree equals the reviewed feature tip; retain the
  identified verification for unchanged **04e3623** application inputs.

Assessment **a30f5e5**, branch `docs/2026-11-04-stage-18-reference-assessment`, from
local develop **ff6ce06ee082fea743be122dc976e666dec45cb8**. Approved slug
`improvement-review`, title **Improvement Review**, Standards group, tether
`18-continuous-improvement`. Four sections/fourteen rows: frame the problem (3),
plan the change (4), study the result (3), decide and follow up (4). Before/after
movement does not establish causality; inconclusive is an evidence status that
may accompany a temporary keep or another action. The record is adaptable
playbook guidance, not a prescribed template or automatic score.

The [assessment and acceptance scope](../reference/stage-18-source-research.md#w-6-assessment-improvement-review-2026-11-04)
names sources, implementation files and checks. All-visible prompts add a compact
retrieval view of teaching currently behind disclosures and a drill; the
anticipated benefit has not been measured with readers. Intentional chapter/sheet
overlap must stay consistent. No image plate, new controls, full DORA/SPACE card,
AI panel, chapter rewrite or shared renderer changes are proposed.

Recommended implementation: **GPT-6.1 Sol / High**, fresh user-selected session
after the recorded scope approval, from this assessment branch's committed tip; create
`feat/improvement-review-reference` and record the exact starting SHA. Return to
coordinator **01a18acc-3b54-7202-92f3-404cc94fd0ad**. Implementation **8b83bfd**
and guard correction **04e3623** are integrated as **2cc7d5d**; local develop
now has **25/30** references. Implementation session: **01a1a431-2038-7931-b6c7-f7d7e1fa352c**.
Five language sheets, W-6.4, actual product research, push and main promotion
remain separate. No companion is registered or published by this assessment.

**W-6.3u — Language and framework study sheets ◐** *(JavaScript and Node.js & Express integrated; Python assessment/design; three placeholders remain)*

**User direction, 2026-11-05 (D-101):** for JavaScript, Python, Java, Spring Boot
and Express & Node, focus on fundamentals, important topics and concepts that
support technical interviews. Add activities inside each sheet. Keep the coverage
selective and substantially shorter than a general tutorial site.

**Reader outcome:** recall a concept, explain how it behaves or why a choice fits,
and apply it to a small piece of code. Each sheet should support both review and
practice; the goal is not a comprehensive course or an API inventory.

**Common content brief:**

- Select foundational concepts with practical and interview relevance. Explain
  the mechanism and consequence concisely; include a small example or useful
  contrast where it helps. Put common mistakes close to the concept they affect.
- Add representative interview prompts that ask the reader to explain, predict,
  debug or choose between approaches. Avoid claiming universal employer coverage
  or frequency rankings without suitable evidence. Label illustrative prompts.
- Put short activities inside each sheet, with a prompt, expected result or
  reference solution, reasoning and a useful mistake/variation. Readers should
  be able to attempt an activity before revealing its explanation.
- Mix reasoning and small coding tasks where they fit the topic. Proposed
  starting budget: **6–10 selected topics and 3–4 activities per sheet**, to be
  adjusted after source/scope assessment. These numbers and formats are the
  coordinator's recommendation, not additional user-specified requirements.
- State the language/framework version and relevant execution context. Verify
  executable examples and reference solutions in that context; browser and Node
  behavior must be distinguished where it changes the answer. Do not replace
  missing checks with invented output or tool results.
- Use original concise teaching grounded in primary documentation. Keep one
  structured content source for web and generated Markdown, including activity
  prompts, solutions and reasoning. The Markdown must remain useful for study.

**Delivery and acceptance:**

- [x] Record the user's content/practice direction and its scoped extension of
  the earlier pure-lookup contract (D-101).
- [x] Assess JavaScript first: bounded topic list, primary sources, interview
  relevance, activities and executable-example checks. Keep findings in one
  research record; no broad five-language course is selected by this brief.
- [x] Propose the smallest optional activity representation and rendering needed
  for the first sheet, using existing disclosure/exercise patterns when suitable.
  JavaScript now uses optional shared activity support on its feature branch,
  following the approved compact plan, behavior TDD and independent review.
- [x] Implement JavaScript and reusable activity support after scope selection;
  application commit **0dcfe2d**, with completion evidence in W-6.3u.1.
- [ ] Assess/deliver Python, Java, Spring Boot and Express & Node as bounded slices.
- [x] Verify the JavaScript/shared attempt/reveal/reset behavior, accessible
  controls, rendered data/generated prompts, static-sheet compatibility,
  native resources/counts/audit, final gate/dev-console and affected
  theme/width/keyboard states; see W-6.3u.1 for evidence and limits.

No widget, scoring model, browser code runner, persistent progress, runtime
provisioning or exact topic list is selected here. Prefer a small activity format
before adding controls that need another behavior contract. Research/coordination
uses **GPT-6 Astra / Low**; implementation uses a fresh user-selected
**GPT-6.1 Sol / High** session under D-100. The earlier inline override applied to
W-6.4 only. Coordinator remains **01a18acc-3b54-7202-92f3-404cc94fd0ad**.

This brief applies to the five pending language/framework sheets; it does not
redesign the completed native Default Stack page or retroactively change the
existing sheets. Keep the eighteen-stage filing model. Integration still needs
separate approval; main promotion belongs to the user.

**W-6.3u.1 — JavaScript study sheet ◐** *(initial implementation verified; expansion required before integration)*

**Later user direction (D-102):** the original delivery below is too short for
the intended study task. The user selected 6–8 focused sections with worked
examples and 1–2 activities per section. The original evidence remains attached
to its tree; W-6.3u.1a is the current delivery target. Do not merge the shorter
version as a prerequisite.

Checkpoint **cd724c4** on `docs/2026-11-05-javascript-reference-assessment`, based
on D-101 brief **6f1f67e6dadefe890d9869100ebdbfff4525d386**. Research/model
recommendation **GPT-6 Astra / Low**. The user authorized assessment with
"proceed", then selected the nine-topic/four-activity/shared behavior scope
with "lets go with that" on 2026-11-05.

- [x] Check primary language/platform and employer-preparation sources; keep
  interview relevance distinct from unsupported frequency rankings.
- [x] Propose nine topics/four groups and four original activities.
- [x] Preserve a reproducible checker: **4 activities / 15 assertions**, Node
  **22.23.4**, strict CommonJS, exit 0; declare fixture and scheduling limits.
- [x] Record the small optional activity contract, interaction and Markdown
  design, compact plan, acceptance and model/session handoff.
- [x] User selected the JavaScript/shared activity scope with "lets go with that".
- [x] Implement in the requested fresh session, recommended **GPT-6.1 Sol / High**,
  with behavior TDD and actual-sheet render checks. Branch starts at **8ff159f**;
  application commit **0dcfe2d**. Session **01a1a908-ddb6-7f91-bb4d-7834839b62e8**.
- [x] Verify published examples, generated content, final web gate/dev-console,
  affected closed/open/re-collapsed states in both themes and one independent
  final content/page/branch review; return package in KICKOFF. Production **36
  passed + 1/1 isolated timeout retry**, dev **1/1**, additional dev toggles **16**;
  actual limits and reviewed commit are recorded in the tracker.
- [ ] Obtain separate user approval before no-ff integration into develop.

The [source/design/compact plan](../reference/javascript-source-research.md#proposed-scope-selection-and-compact-design)
proposes Values and bindings (equality/coercion, lexical scope/TDZ), Functions
and objects (closures, this/arrows, shallow copying, prototypes/classes), Arrays
(method choice and mutation), and Async work (promises/errors, scheduling).
Activities: closure counter, nested-copy repair, async iteration repair and a
bounded sync/promise/queueMicrotask/timer trace. Nine topics remain concise
lookups; this is not a complete course or claimed interview-frequency ranking.

Implemented `Cheatsheet.activities?` stores stable IDs, prompt/context, optional
labelled code, answer/solution, explanation and optional follow-up in one source.
Compose prompt-visible/answer-hidden cards with existing disclosure behavior;
no score, runner, persistence or new highlighting pipeline. Extend generated
Markdown with the same prompts/solutions, leaving no-activity sheets unchanged.
The plan names type/generator, composer, JavaScript module, example/artifact
validation and final shared-behavior verification. This is D-99 consequential
work; static copy/data still uses its normal exception.

Retained slug `javascript`, Languages group and no stage tether; only its
placeholder moved. Feature-branch counts are **26/30** drawn with four other
placeholders and **18/18** stages. Local develop remains **25/30** references.
No image selected. The published checker reads actual structured snippets:
**4 activities / 20 assertions**, Node **22.23.4**, strict CommonJS, exit 0.
Historical assessment evidence remains distinct from implementation evidence.

Return the completed branch/diff and actual checks to coordinator
**01a18acc-3b54-7202-92f3-404cc94fd0ad**, recommended **GPT-6 Astra / Low**;
[KICKOFF](../KICKOFF.md) names the implementation session and application commit.
D-100's fresh-session policy applies. Other four sheets, algorithm catalogues,
DOM/Node I/O puzzles, modules/generators/workers, new controls beyond disclosure,
diagrams/upgrades, push and promotion are deferred.

**W-6.3u.1a — Sectioned JavaScript expansion ◐** *(verified; coordinator review and integration pending)*

- [x] Inspect original feature **bd72e70** / application **0dcfe2d** and read
  implementation session **01a1a908-ddb6-7f91-bb4d-7834839b62e8** before using
  its handoff. Identify compressed rows and end-only practice as the depth gap.
- [x] Record the selected 6–8-section range and recommend seven sections/nine
  activities, with primary sources, worked examples and local practice in the
  [existing source record](../reference/javascript-source-research.md#sectioned-expansion-selected-2026-11-05).
- [x] Prepare the [compact implementation plan](superpowers/plans/2026-11-05-javascript-study-expansion.md)
  for optional study metadata, reusable section composition, local Markdown
  ordering and rendered reference-hash audit discovery.
- [x] Implement on `feat/javascript-study-sections`, from exact **17c4808**;
  application **be5cf77**, reviewed corrections **3d4b140**. The user asked
  "continue" after this thread's fresh-session notice, so work continued here.
  This task-specific continuation does not change D-100 for future work;
  recommended implementation setting remains **GPT-6.1 Sol / High**.
- [x] Validate actual expanded examples, all section/theme/keyboard states,
  unchanged ordinary sheets, final gate/dev-console and independent final review.
  Exact commits, retained/fresh checks and limits are in [KICKOFF](../KICKOFF.md).
- [x] Prepare branch/commit, actual checks, deferred scope and session reference
  for coordinator **01a18acc-3b54-7202-92f3-404cc94fd0ad** in KICKOFF and the
  implementation response.
- [x] Coordinator reviewed **73414a8** / application **3d4b140**, including
  independent Standards and Spec axes and focused production-page inspection.
  One P2 keyboard-scroll finding required correction; content/spec has no findings.
- [x] Add explicit tab stops to worked-example and activity code containers,
  with RED/GREEN render coverage and both-theme 320px keyboard scrolling/focus.
  Correction **322c873**, from **b3b790e**; latest user instruction
  "proceed here" authorizes this task in the existing implementation thread.
- [x] Prepare the verified correction diff/checks and session reference in
  KICKOFF and the implementation response for coordinator confirmation.
- [x] Coordinator confirmed **0aa3764** / correction **322c873**, no new findings;
  fresh render **6/6** and both-theme keyboard-scroll browser **2/2** pass.
- [ ] Obtain separate user approval before no-ff integration into develop.

No nineteenth stage, comprehensive course, runner/grading/persistence, broad
redesign of other references, or work on the remaining four sheets is selected.

**W-6.3u.1b — Fundamentals and interview-content research ☑** *(all six areas subsequently selected in D-103)*

Research authorized by the user on 2026-11-06, after acceptance of **322c873**.
Docs branch `docs/2026-11-06-javascript-content-research` starts from
**d0ae353dd63667fa0e76199d50681cfd254e1d6e**. The earlier implementation remains
accepted against its selected scope; this asks whether that scope teaches enough.

- [x] Compare the actual seven sections/fourteen teaching entries/nine activities
  with primary language documentation and employer preparation guidance.
- [x] Record absent versus shallow versus already-covered topics, activity
  candidates, source provenance and interview-evidence limits in the
  [existing research record](../reference/javascript-source-research.md#fundamentals-and-interview-content-reassessment-2026-11-06).
- [x] Recommend control flow/text and Map/Set, plus a small coding problem with
  requirement clarification, edge tests and complexity reasoning. Follow with
  defaults/rest/destructuring/optional access and error/promise composition.
- [x] Keep introductory modules as a scoped follow-up with explicit ESM context;
  preserve the current CommonJS execution boundary. Further timer/coercion puzzles,
  framework questions and large algorithm catalogues remain deferred.
- [x] User selected all six recommendations and sections with subsections.
  D-103 and W-6.3u.1c carry the new delivery; the phased recommendation above
  remains historical research rather than a continuing module deferral.
- [x] Prepare compact design/acceptance and a fresh **GPT-6.1 Sol / High** handoff.
  Coordination remains **GPT-6 Astra / Low**, **01a18acc-3b54-7202-92f3-404cc94fd0ad**.

The assessment itself changed no app/generated inputs and authorized no merge,
push, promotion or five-sheet curriculum expansion. The later all-six JavaScript
selection is recorded in W-6.3u.1c below.

**W-6.3u.1c — All JavaScript additions with subsections ☑** *(verified and accepted; integration pending)*

- [x] Record user selection of all six additions and section/subsection hierarchy,
  D-103. Eight main sections fit the earlier 6–8 range; preserve the seven main
  IDs and add modules. The implementation design proposes fourteen activities,
  1–2 per main section; the user did not specify this exact count.
- [x] Define additive row metadata, exclusive section/subsection activity
  assignment modes, accessible nested headings and single-source Markdown
  traversal in the [source/design record](../reference/javascript-source-research.md#all-six-additions-and-subsections-selected-2026-11-06).
- [x] Prepare the [compact implementation plan](superpowers/plans/2026-11-06-javascript-fundamentals-subsections.md)
  and KICKOFF. Start from the committed documentation tip descended from
  **76119c2**, creating `feat/javascript-fundamentals-subsections` in a fresh
  **GPT-6.1 Sol / High** session.
- [x] Implement all six areas using existing Stepper/RevealList/activities;
  retain ordinary/legacy rendering and the original four exercises.
- [x] Validate actual CJS and two-file ESM snippets, nested Markdown order,
  every nested disclosure, heading/focus/history behavior, panel budget and
  both-theme layouts; run final gate/dev-console and one independent final review.
- [x] Return exact branch/commit, actual checks, limits and session reference
  to coordinator **01a18acc-3b54-7202-92f3-404cc94fd0ad**, recommended
  **GPT-6 Astra / Low**, before separate user integration approval.
- [x] Coordinator accepted **973df70** / app **4ff8f8e**, no actionable findings;
  fresh focused tests **37/7**, production browser **3/3**, published checks
  **93 assertions** and three inspected page states pass.
- [ ] Obtain separate user approval for no-ff integration into develop.

No new stage, browser execution, scoring/persistence, dependencies, broad
framework/algorithm catalogue or work on the other four sheets is selected.

**W-6.3u.1d — Promises mini-lesson teaching prototype ☑** *(draft complete; reader depth feedback pending)*

- [x] User selected one representative mini-lesson as the quality prototype
  after finding the broader page lacking; use Promises/errors and one connected
  story. D-104 scopes this separately from the accepted implementation review.
- [x] Write the [learner-facing draft](superpowers/specs/2026-11-06-javascript-promises-mini-lesson.md):
  prerequisite/outcome, callback problem, promise mental model, supplied executor
  functions, chains and await, both failure paths, cleanup, aggregation,
  model answers/follow-ups and actionable transfer tasks.
- [x] Record nine primary-source findings and prototype evidence in the
  [existing source record](../reference/javascript-source-research.md#promise-mini-lesson-source-check-2026-11-06).
  The [checker](../reference/examples/javascript-promises-lesson-checks.cjs)
  reads literal draft examples and the existing transfer activity; Node
  **22.23.4**, strict CJS, **9 examples / 51 assertions**, exit 0.
- [x] Complete one independent editorial reader pass focused on reconstructing
  producer-to-caller behavior, rather than topic counts. Three material gaps
  were corrected and confirmed resolved; self-review/humanizer pass applied.
- [x] User selected the draft for a bounded page pilot, preferring to judge the
  result on the page. That does not claim final acceptance of teaching depth;
  the implementation/evaluation scope is W-6.3u.1e / D-105 below.
- [x] Prepare the pilot's single-source teaching/presentation plan. Shared
  behavior uses D-99's stronger path; D-100 workflow choice is pending. A
  whole-page rewrite is not automatically selected.

Docs branch `docs/2026-11-06-promises-mini-lesson` starts from **e991ab5**;
accepted app **4ff8f8e** is unchanged. This draft is an editorial prototype, not
a second maintained published lesson. Existing content authority, original
activities, main hashes and accessibility contracts remain.

**W-6.3u.1e — Runtime-neutral Promises page pilot ☑** *(user accepted; merged locally into develop)*

- [x] User selected the prototype for on-page evaluation and requested no
  Node-version coupling in JavaScript teaching (D-105).
- [x] Prepare the [compact implementation plan](superpowers/plans/2026-11-06-javascript-promises-pilot.md)
  for ordered teaching blocks, a visible opening, generator parity, runtime-neutral
  examples/copy, actual browser example checks and a reviewable preview.
- [x] User selected a fresh **GPT-6.1 Sol / High** implementation session, confirmed
  by session metadata. Started from **a92a495** on `feat/javascript-promises-lesson`.
- [x] Implement #async and context cleanup with behavior TDD; preserve the other
  seven sections, original exercise implementations, activity IDs and main hashes.
- [x] Verify actual published code in the command-line runtime and browser,
  generated parity, visible introduction, all topic states, keyboard/table/code
  access and final gate/dev-console. Leave a running preview for the user.
- [x] Obtain independent final teaching/content/branch/page review and return
  actual branch/commit/checks/session to coordinator
  **01a18acc-3b54-7202-92f3-404cc94fd0ad**, recommended **GPT-6 Astra / Low**.

User accepted the preview and approved local no-ff integration of **f3f376c**
into develop **ede8e1f** on 2026-11-09; the merge includes its integration records.
Runtime/version evidence stays in internal records. A page-wide teaching rewrite,
other-sheet rollout, runner/scoring/persistence, push and promotion remain outside scope.

**W-6.3u.2 — Node.js & Express study reference ☑** *(merged locally into develop)*

User direction (D-109), 2026-11-10: use the DSA review/interview approach,
fundamentals are mandatory, give many worked examples and add subsections when
needed for proper coverage. Reader outcome: explain, predict, build, debug and
test Node/Express behavior, including failures and basic production trade-offs.
The requested interview-preparation goal is not a guarantee of interview success.

- [x] Record user direction and investigate primary Node/Express/security sources.
- [x] Define teaching depth, content families, example-verification boundaries and
  compact implementation plan using existing study components.
- [x] Implement all selected families and meaningful local activities; fill
  `/reference/express`, title Node.js & Express, without adding a backend.
- [x] Execute actual published Node/Express examples and failure/security paths;
  verify the delivered page and final web/dev-console checks.
- [x] Obtain one independent final review; findings fixed with focused regressions.
- [x] Correct NE-R1/R2/R3: worked modules, real filtering/pagination and a concrete
  explained CSRF-defense contrast.
- [x] Correct NE-R4/R5/R6: complete Express dev-console IDs, nested-query contract
  and SIGTERM drain/cleanup-sensitive tests.
- [x] Coordinator accepted **fa724bb...e852170** at handoff **b2c1cdc**;
  NE-R1–NE-R6 closed, no remaining Standards/Spec findings.
- [x] Reassess and design deeper Node fundamentals after reader feedback (D-111/112),
  including a full event-loop lesson and connected worked explanations.
- [x] Implement the depth plan, executable changed-case examples and six coding repairs (**7ee4b54**, **d122175**).
- [x] Independent Sol High review of the revised page/branch supports all six transfer tasks; one prerequisite-link minor deferred.
- [x] User authorized local integration of verified **1a4cad0** on 2026-11-12 after the independent depth review. Further reader feedback remains welcome.
- [x] Obtain separate user approval and integrate into develop with a no-ff merge (2026-11-12).

[Sources](../reference/node-express-source-research.md),
[design](superpowers/specs/2026-11-10-node-express-design.md),
[plan](superpowers/plans/2026-11-10-node-express.md). The original delivery used twelve
panels/38 topics and a recurring small API. The Node fundamentals extension below
now governs depth and composition; split when measured without reducing coverage.
Keep slug/group and thirty other sheet bodies. Target 28/31 drawn/registered and
18/18 stages. Node 22-compatible JavaScript, actual validation baseline 22.23.4;
Express 5.3.0 may be an exact test-only devDependency. No Node/tooling upgrade.

Documentation branch `docs/2026-11-10-node-express-study` starts at **e28401e**;
implementation starts from its exact committed tip, creating
`feat/node-express-study`. Use fresh user-selected **GPT-6.1 Sol / Medium** under
D-100/D-110; return to coordinator `01a1bedf-bdad-7b72-ba40-9b5406807d43`, recommended
**GPT-6.1 Sol / High**. No new renderer/runner/scoring/persistence, real DB/auth
service, other language sheet, integration, push or promotion is selected.

Coordinator reviewed **976198b...67b8cb6** and found six P2s: missing worked
module mechanisms, incomplete filtering/pagination, no explained CSRF-defense
contrast, missing Express dev-console ID completeness assertion, no nested-query
contract check and a SIGTERM test insensitive to skipped cleanup. See KICKOFF
for exact evidence and acceptance. Fresh focused checks **66/5** pass but do not
establish those missing requirements. Correction/recheck are now complete at
**e852170** / **b2c1cdc**; the original findings above remain historical evidence. Fresh focused **87/5** and live corrected
lesson checks pass; full **1779/241**, production **52/52** and dev-console **1/1**
evidence verified in the implementation thread/logs. Integration needs user approval.

The [Node fundamentals extension](superpowers/specs/2026-11-10-node-fundamentals-depth-design.md)
and its [plan](superpowers/plans/2026-11-10-node-fundamentals-depth.md) now govern
this revision. Initial composition is 15 panels/49 topics, preserving twelve
existing hashes and 38 existing topic IDs; scheduling moves into the new event-loop
panel. Five coordinator draft trace probes passed on Node22.23.4. New Worker,
stream and lifetime examples still require implementation-time actual-code checks.
Return the actual event-loop lesson for reader assessment before integration.

**W-6.3u.3 — Python study reference ◐** *(assessment/design prepared; implementation not started)*

User selected Python assessment/design on 2026-11-13 with the same goal as
Node.js & Express: explain fundamentals, trace programs, implement/repair code
and reason through interview follow-ups. Starting application **c768af4** is now
pushed to origin/develop. Assessment branch `docs/2026-11-13-python-study-assessment`.

- [x] Inspect the Python placeholder, shared study contracts and Node depth acceptance.
- [x] Assess primary Python/PSF/PyPA sources with version and evidence boundaries.
- [x] Propose teaching structure, activities, actual-code verification and page acceptance.
- [ ] Select the design; then write the compact implementation plan.
- [ ] Implement in a fresh user-selected **GPT-6.1 Sol / Medium** session.
- [ ] Verify actual Python programs/repairs, final web gate/dev-console and affected states;
      obtain one independent final **GPT-6.1 Sol / High** content/page/branch review.
- [ ] Return live lessons for reader depth feedback and request separate integration approval.

[Research](../reference/python-source-research.md),
[proposed design](superpowers/specs/2026-11-13-python-study-design.md).
Coordinator proposal: fourteen panels, 45 topics and one owned activity per topic,
with at least ten coding/repair activities; split where teaching/layout requires.
Use existing structured teaching/disclosure/solution patterns and generated Markdown.
Python 3.12+ compatibility, standard library only, explicit maintained interpreter
provisioning and published-code checks. No browser runtime or new renderer.

Assessment/coordination recommendation **GPT-6.1 Sol / High**; return results to
this coordinating conversation. Future implementation starts from its committed
handoff, not an assumed develop tip, and reports branch/commit, actual checks,
limits and session reference. Counts stay **28/31**, **18/18** until implementation;
expected Python delivery **29/31**, with Java and Spring Boot deferred. Design
selection, plan, implementation, integration and main promotion remain outstanding.

**W-6.3v — DSA Patterns study reference ☑** *(reviewed and merged locally into develop)*

**Reader outcome:** recognize the conditions that make a technique useful,
explain its invariant or recurrence, implement it in JavaScript, test it, and
justify time and auxiliary/output space. Practice problems must show why the
pattern fits and what changed conditions would require another approach.
User clarification (D-107): explain as simply as possible through everyday
analogies, tiny traces and plain work/storage reasoning before technical terms
and JavaScript. The research distinguishes preparation relevance from measured
question frequency. The user selected all fifteen core patterns with "okay lets
proceed with that" (D-108). Algorithms grouping, eight initial panels, eighteen
activity budget and the worked function contracts are design choices.

- [x] Record the user's teaching/interview/problem/complexity direction and
  JavaScript choice (D-106).
- [x] Research primary algorithm teaching, original problem statements,
  employer interview guidance, and JavaScript implementation assumptions in
  [one source record](../reference/dsa-patterns-source-research.md).
- [x] Select all fifteen core patterns and the simple analogy-first approach.
- [x] Prepare the relevant content/design acceptance and fresh implementation
  handoff after scope selection; preserve one web/generated-Markdown source.
- [x] Implement, verify actual published examples and the finished reference,
  complete appropriate web checks and one independent final review.
- [x] Coordinator review **b3c500c...49ac670**, actual sessions and raw evidence;
  Standards: no actionable findings. Spec: two confirmed P2s, DSA-R1/R2.
- [x] Preserve authored mixed-choice explanation through composition, rendered
  solution and generated Markdown, with a meaningful failing regression first.
- [x] Check recursive and iterative published tree functions on right-only and
  branching shapes; confirm both right-child-removal mutations are detected.
- [x] Return correction **8dfc0fd**, actual checks and implementation session
  **01a1bf85-6807-7190-aba1-f90aff6ec680** for focused coordinator recheck.
- [x] Focused coordinator recheck of **8dfc0fd** at **89436fb**; both P2s resolved.
- [x] User approved local no-ff integration into develop; parents **c996177**
  and **89436fb**. No push or main promotion.

Research branch `docs/2026-11-09-dsa-patterns-research` starts at local develop
**c996177**; source findings are committed as **dbeafbf**.
Research/coordination recommendation: **GPT-6 Astra / Low**.
Implementation recommendation: fresh user-selected **GPT-6.1 Sol / High**.
Current coordinator: **01a1bedf-bdad-7b72-ba40-9b5406807d43**.
The [design](superpowers/specs/2026-11-09-dsa-patterns-design.md) and
[plan](superpowers/plans/2026-11-09-dsa-patterns.md) select a standalone reference
under Algorithms, using current study components; all fifteen ship together.
Application **0ffca35** delivers the untethered reference under Algorithms with
eight hashes and eighteen activities. Feature totals are **27/31** sheets and
**18/18** stages, now integrated locally into develop.
Other language sheets, broader JavaScript
rollout, code execution/scoring/persistence, push and promotion are separate.

**W-6.4 — Glossary and stack surfaced in the hub ☑** *(merged locally as `b8515a0`)*

Assessment **8f722f7** found that the hub, Sidebar, sitemap and audit listed only
sheets, while inline terms offered no full glossary lookup. That gap is closed
on local develop as **b8515a0**. Assessment branch
`docs/2026-11-04-reference-hub-assessment` started from develop
**097fdd0f6aea2c4f18ffb7dcd712607915c64590**.

- [x] Inspect current routes, discovery, glossary authority and stack content.
- [x] Recheck high-impact stack claims against primary sources and compare
  source strategies; record the local runtime support mismatch as TD-47.
- [x] Record a proposed compact design/plan, acceptance and model/session handoff.
- [x] User selected the native pages, stack source migration and TD-47 runtime
  prerequisite with "proceed" on 2026-11-04, following handoff **a0f40f5**.
- [x] Use a supported runtime and repair the explicit Node 22 patch contract
  (TD-47), with meaningful support/alignment checks.
- [x] Implement the approved data/generator, pages and shared discovery/coverage
  using D-99's consequential-change path and behavior TDD.
- [x] Complete the final web gate, dev-console sweep, affected theme/width/keyboard
  checks and one independent final content/page/branch review.
- [x] Record implementation session, branch/commit and actual verification in
  KICKOFF for coordinator review.
- [x] Coordinator reviewed **131c303...52e703e**, read the implementation thread,
  checked raw results and scoped independent standards/scope findings; no blockers.
- [x] User approved no-ff integration into develop as **b8515a0**, parents
  **097fdd0 / 14ca2da**. Merge tree equals the reviewed tip; retain the identified
  fresh/retained checks for unchanged **9231dc9** application inputs.

Approved routes `/reference/glossary` and `/reference/stack` are reference
resources, not cheatsheets or stages: counts remain **25/30** sheets and **18/18**
stages. Glossary consumes `terms.ts` directly, renders full definitions in name
order with stable key fragments and optional stage links, and leaves its Markdown
generator and inline popover unchanged. No search/filter state is proposed.

The stack now lives in canonical `web/src/lib/stack.ts`, consumed by its page
and a new pure Markdown generator. `reference/stack.md` remains at its existing
path as a generated snapshot. The user explicitly approved this authority change
in the scope selection above. Preserve its four groups,
22 choices, deviation/upkeep guidance and links, with the recorded factual
corrections and narrow matching Stage 04 prose alignment. Keep chosen product
families and distinguish starter defaults from this static app's installed tools.

The [source/design/compact plan](../reference/w6-4-source-research.md#w-64-assessment-and-proposed-compact-design)
names interfaces, files, tests, source limits and five dependent steps: runtime,
stack generation, pages, shared discovery/SEO/audit, final verification. New routing,
Sidebar behavior and generator contracts require TDD; static copy/data uses the
normal exception. Read installed framework guides before API changes. No MDX
pipeline, duplicate hand-port, broader framework abstraction or dependency upgrade.

Implementation **da18fd7 / 191e947 / 7b4967a / 567991e**, review corrections
**1ee672e**, touch-target correction **9231dc9**. Final build **57 routes** and
production audit **29/29** pass on **9231dc9**. Full format/lint/typecheck and
**1,609 tests / 228 files** pass on **1ee672e**; retain them for the one-class
minimum-width correction, with fresh affected-file lint/format and glossary
render **3/3**, final build and browser verification. Development-console **1/1**
passes on an isolated **1ee672e** source copy; only minimum width differs from
final React output. Independent final **Astra Low** review of **9231dc9** and six
rendered captures has no blocker. [KICKOFF](../KICKOFF.md) records limits and
commands. Implementation session **01a1a51d-8cb1-7983-8e51-1c3e48ecf142**;
the user explicitly selected implementation here as a D-100 exception.

Five language sheets, broader search, stage-to-sheet backlinks, term-popover
changes, real infrastructure, push and main promotion remain separate.

**Deferred beyond W-6:** the figure registry and the six architecture diagrams;
stage→sheet backlinks, since the tether is one-directional today; search; and
copy-to-clipboard on code rows, which waits for the first sheet that has any.

---

## Backlog — not scheduled

- ~~Single source of truth for stage metadata (**TD-2**)~~ ✓ closed 2026-07-27 by **D-36**,
  and narrowed rather than delivered: only the *title* was genuine duplication, and it is
  synced by `stage-metadata.test.ts`. `blurb` and `timing` are purpose-built UI strings that
  diverge from the doc for 15 of 18 stages **by design**. Left listed here as an open want,
  this line read as unfinished work — and in 2026-08 it contributed to a proposal to sync
  both fields verbatim, which would have reversed D-36 using D-36's own evidence (**D-81**).
- ~~Single source of truth for the glossary (**TD-3**)~~ ✓ closed 2026-07-27 by **D-36**:
  `terms.ts` is the source and `reference/glossary.md` is generated from it by snapshot
- Search across stages
- A cadence view: the 18 stages plotted by real frequency rather than by number.
  That is the playbook's central claim and it is still only stated in prose.
- Print stylesheet — a field manual that prints is not a silly idea
