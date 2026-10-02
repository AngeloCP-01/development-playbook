# Development Playbook — Master Tasks

**Purpose:** the complete task list and scope overview. What exists, what is
planned, and what each milestone depends on. Status lives in
[tracker.md](tracker.md) — this file is the map, that file is the log.

**Legend:** ☐ Not started · ◐ In progress · ☑ Done · ⛔ Blocked

**Older completed task-detail sections live in [task-archive.md](task-archive.md)** —
grep it by id, don't read it whole.

---

## Overview

**Current state (2026-10-02): W-3 is 13/18 and W-6 is 19/24 on local
`develop`.** Stage 16's repaired chapter, fourteen-step port and bounded
`incident-management` reference companion are merged. The companion landed as
no-ff merge `a992d74`; its post-merge gate passed 1389 tests across 181 files,
lint, typecheck and format. Nothing from that round was pushed or deployed.

**Next W-3 candidate: 08 Security Audit, pending the user's choice.** It is the
first remaining stage by filing number; the archived W-3 order leaves the
remainder unordered. Begin with a source and executable-example review of
`08-security-audit.md` before designing its interactive port. Security guidance
and framework behavior need current verification. Stages 09, 10, 17 and 18
remain alternatives; W-6.4 glossary/stack surfacing is a separate task.

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
| **W-3** | Stages 02–18 interactive | ◐ *(13/18 merged to `develop`; five remain: 08, 09, 10, 17 and 18. Stage 16 landed as `3d2c266`.)* |
| **W-4** | Quality gates — tests, CI, committed a11y/responsive checks | ☑ |
| **W-5** | Deploy | ☑ *(live 2026-08-11; the deployment verifies itself via `pnpm test:prod`)* |
| **W-6** | Reference hub — cheatsheets, glossary and stack in one consultable section | ◐ *(nineteen of twenty-four registered sheets drawn on `develop` — `incident-management` merged as `a992d74`. Five language sheets remain: `javascript`, `python`, `java`, `spring-boot`, `express`)* |

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

### W-3 — Stages 02–18 interactive ◐ *(13/18 merged to `develop`; five remain: 08, 09, 10, 17 and 18. Stage 16 landed as `3d2c266`; see tracker W-3.13 for evidence.)*

Each stage repeats the same shape. Stage 01 is the reference implementation.

**Next candidate, not yet selected:** 08 Security Audit. Review the 270-line
chapter's claims and runnable snippets against current primary guidance. Repair
the chapter first, then port the settled content in the same stage round. The
earlier suggested order in `task-archive.md` lists the remaining stages without
ranking them; the tracker records why 08 is the current recommendation.

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
