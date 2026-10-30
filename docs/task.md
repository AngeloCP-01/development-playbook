# Development Playbook — Master Tasks

**Purpose:** the complete task list and scope overview. What exists, what is
planned, and what each milestone depends on. Status lives in
[tracker.md](tracker.md) — this file is the map, that file is the log.

**Legend:** ☐ Not started · ◐ In progress · ☑ Done · ⛔ Blocked

**Older completed task-detail sections live in [task-archive.md](task-archive.md)** —
grep it by id, don't read it whole.

---

## Overview

**Current work (2026-10-30): W-6.3s coordinator review complete; integration pending.** Commit **5ea8cb2** on `feat/technical-debt-reference` adds the four-section/fourteen-row **Technical Debt Review**, unchanged attributed Fowler quadrant, equivalent text, render tests and generated Markdown. Independent content/page review and coordinator review of **0532af2..e358608** found no actionable issue; fresh focused checks pass **31/31**. Feature references are **24 drawn / 29 registered**, W-3 **17/18**; local develop remains **23/28**, W-3 **16/18**. Stage 17 and this companion remain unmerged. [KICKOFF](../KICKOFF.md) holds the thread, checks and coordinator handoff.

**Workflow update (approved 2026-10-26, D-99):** Follow the scoped [development workflow](../AGENTS.md#development-workflow): source/content checks for research, a short checklist and inline work for routine pages, and stronger planning/TDD/review for shared or consequential behavior. Policy commits `7fc8cf7` and `af9854d` are integrated into local develop after separate user approval. Existing CI, accessibility and Git safeguards stay.

**Previous checkpoint (2026-10-23): Stage 10's corrected chapter and twelve-panel interactive port are merged locally into develop as `7819457` (`--no-ff`).** All nine plan tasks and independent reviews are complete; final fixes `bd90a05` / `2e3ccc8` cleared the three Minor findings. Fresh merged-tree format/lint/typecheck, **1,559 tests / 218 files** with one worker and unchanged limits, and a **52-page build** pass. The merge tree equals reviewed feature tip `81935a6`; retained final-source browser **3/3**, development-console **1/1** and **28 affected-panel states** were not rerun after merge. Earlier full **27/27** and **1,358-state** checks remain pre-cue evidence. [Integration report](superpowers/reports/2026-10-23-stage-10-integration.md). Local develop W-3 is **16/18**; W-6 **22/27**. Tracked origin/develop remains `79f9e31`; no push or main promotion occurred.
Stage 09's chapter merged as `ad283ce`, its
interactive port as `7a5576a`, and its caching/scaling references as `9de6c99`.
The single-example width repair followed as `79f9e31`. That width repair was the pre-Stage-10 baseline. Tracked `origin/develop` remains
`79f9e31`; the current local develop merge is recorded above.

On **local develop**, W-3 is **16/18**: stages 01-16 are interactive; 17 and 18 remain. W-6 is **23 drawn / 28 registered**. Five language placeholders and W-6.4 glossary/stack surfacing remain open. Older Stage 09/reference/width-repair evidence belongs to those historical trees.

**Next task/model:** user integration decision, recommended **GPT-6 Astra / Low** in the existing coordinator. W-6 implementation session **01a1860d-161c-7b71-972a-dba429ec0499** and actual **0532af2..e358608** diff have been reviewed; see [KICKOFF.md](../KICKOFF.md). The feature contains unmerged Stage 17 and the companion. No merge, push or main promotion is authorized by this review.

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
| **W-3** | Stages 02–18 interactive | ◐ *(16/18 merged to local `develop`; two remain: 17 and 18. Stage 10 landed as `7819457`.)* |
| **W-4** | Quality gates — tests, CI, committed a11y/responsive checks | ☑ |
| **W-5** | Deploy | ☑ *(live 2026-08-11; the deployment verifies itself via `pnpm test:prod`)* |
| **W-6** | Reference hub — cheatsheets, glossary and stack in one consultable section | ◐ *(23 of 28 registered sheets drawn on local `develop`; Stage 10 Documentation merged as `8eb294c`. Five language sheets and W-6.4 glossary/stack surfacing remain.)* |

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

### W-3 — Stages 02–18 interactive ◐ *(16/18 merged to local `develop`; two remain: 17 and 18. Stage 10 merged as `7819457`.)*

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
**Latest merged stage round:** W-3.17, Stage 10 Documentation, integrated locally as `7819457` after separate approval. Stage 09's W-6.3q
references and the subsequent layout repair are merged; their work is complete.

### W-3.18 — Stage 17 Maintenance ☑ *(AI Plays correction reviewed; integration pending, 2026-10-29)*

**Next-task model/session:** return to the existing coordinator, `gpt-6-astra`,
`low`, for the integration decision; correction review is complete. Implementation recommendation:
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
remains outstanding.

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

Deferred: coordinator integration decision, W-6 companion assessment/registration,
shared behavior, live dependency/database operations, merge, push and deployment.

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

**W-6.3s — Stage 17 Technical Debt Review ☑** *(coordinator reviewed; unmerged, 2026-10-30)*

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

Approved slug `technical-debt`, Standards group, tether `17-maintenance`.
Four sections/fourteen rows: four debt categories, four evidence prompts, three
response choices and three retirement checks. The quadrant classifies debt; it
is not a priority score. Keep the original credit/link and unchanged-image
statement in the existing source area. Defer the broad Maintenance checklist,
package-manager command card, new controls, shared renderer work and live actions.
See the [assessment and acceptance scope](../reference/stage-17-source-research.md#w-6-assessment-technical-debt-review-2026-10-29).
Feature W-6 is **24/29**; local develop remains **23/28**.
Implementation, final gate (**1,576/221**, **54 routes**, **27/27**) and independent
content/page review are complete at **5ea8cb2**. Coordinator reviewed
**0532af2..e358608**, no actionable findings; fresh **31/31** focused checks.
Separate integration approval remains. Coordinator recommendation **Astra Low**.

**W-6.4 — Glossary and stack surfaced in the hub ☐**

The reason `/reference` beat `/cheatsheets` as a section name. Closes the original
gap rather than adding a parallel one.

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
