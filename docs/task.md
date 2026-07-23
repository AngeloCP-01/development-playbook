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
| **W-3** | Stages 02–18 interactive | ☐ |
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
- [ ] Mirror into the interactive stage as each is built under W-3
- [ ] Record any convention deliberately *not* adopted, and why
- [ ] Pass every touched doc through `humanizer:humanizer`

### W-3 — Stages 02–18 interactive ☐

Each stage repeats the same shape. Stage 01 is the reference implementation.

Per stage:
- [ ] Read `web/PATTERNS.md`; pick a pattern per section (prose is the fallback, not the default)
- [ ] Group the doc's sections into 4–6 stepper steps
- [ ] Identify diagrams worth building; wrap each as a numbered `<Figure>`
- [ ] Build 1–3 interactive exercises where judgement is being taught
- [ ] Add glossary terms for jargon that stage introduces
- [ ] Register in `src/features/stage-content.ts`; flip `ready: true` in `stages.ts`
- [ ] Verify: contrast in both themes, 320–2560px, no console errors
- [ ] Run `humanizer:humanizer` over the stage's prose

Suggested order — highest teaching value first, since that is the point:

| Order | Stage | Why this one next |
|---|---|---|
| 1 | 03 Architecture | Densest concepts, most diagram-friendly, and where a solutions-architect view gets built |
| 2 | 15 Observability | Unfamiliar ground; benefits most from figures |
| 3 | 16 Incident Management | Procedural, so a stepper fits naturally |
| 4 | 13 Production Deployment | Expand/migrate/contract needs a visual |
| 5 | 02 Planning | Short, and pairs with 01 |
| — | remainder | 04–12, 14, 17, 18 |

### W-4 — Quality gates ☑

The playbook says CI on day one. The app does not have it. Closing this is also
how the project stops contradicting its own advice. See **TD-4**, **TD-5**.

- [x] Vitest, plus a first unit test (`stages.ts` helpers, `terms.ts` lookups)
- [x] Commit the throwaway audit scripts as a real Playwright suite: contrast in
      both themes, no overflow 320–2560px, touch targets ≥44px
- [x] `.github/workflows/ci.yml` — lint, typecheck, test, build
- [ ] Branch protection requiring the gate *(GitHub-side, after push: require `verify` + `audit`, branches up to date)*
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
