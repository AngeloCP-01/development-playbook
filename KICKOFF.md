# Kickoff — Development Playbook

Paste the block below into a **new Claude Code session** opened in
`/Users/angelito/personal/Development-Playbook` to start a round with full context.

Update the *Project state* section before pasting — a stale kickoff is worse than none,
because it is trusted.

---

## Paste this into the new session:

I'm continuing work on the Development Playbook: eighteen markdown stage documents
covering the software lifecycle, plus a Next.js static site that turns them into
something you consult rather than read. It doubles as a learning tool — it will cover
ground I have not worked in, so stages need to teach, not just remind.

Before doing anything, read these for context:

- `CLAUDE.md` — how this project works: git conventions, delivery loop, review and TDD
  standards, tooling. Start here.
- `docs/task.md` — scope, milestones (`P-` content, `W-` web app), dependency map
- `docs/tracker.md` — what shipped with evidence, numbered decisions, technical debt
- `web/DESIGN.md` — the design system; any new UI matches it
- `README.md` — the playbook's own index and its central claim
- `web/AGENTS.md` — this Next.js version postdates your training data; read
  `node_modules/next/dist/docs/` before writing framework code
- `docs/learnings/README.md` — five guides written after rounds that cost real time. Two are
  directly relevant to W-3.2: `decisions-need-tests-101.md` (this round supersedes D-38, and
  that guide is about what makes a recorded decision actually hold) and
  `stage-implementation-101.md` (the layout traps and verification checklist for building a
  stage)

### Project state (as of 2026-07-31, after the D-52 round's first four tasks)

- **Playbook content:** all 18 stage docs written (`P-0`…`P-4`).
  **Caution:** the "18/18 pass the seven-section template check" and "124/124 links resolve"
  figures quoted in the tracker came from **ad-hoc P-4 scripts that no longer exist** (TD-5).
  They are not committed tests and nothing re-runs them. Do not cite them as having passed.
  What *is* enforced: `stage-metadata.test.ts` (each doc's H1 matches `stages.ts`, and every
  built stage has its `### AI in …` heading), `glossary.test.ts`, and — new in W-3.1 —
  `stage-03-structure.test.ts` (pins that doc's fourteen subsections in order) and
  `source-citations.test.ts` (D-42: bans line-number citations and resolves every heading one).
- **Web app:** `web/` — Next 16, TypeScript, Tailwind 4, no backend. **Stages 01 and 02 are
  complete and interactive; 03 is mid-port on `feat/stage-03-app-port`** — now **10 steps**
  (`reverse · require · model · worksheet · shape · sketch · schema · contract · record · ai`)
  against a 14-section doc. See `docs/stage-03-status.md` for what is and is not ported, and
  the ledger named under *This round's scope* for where the current round stopped.
- **Stage 03's doc is done; its app now lags it (TD-23).** W-3.1 closed **TD-18**, **TD-21** and **TD-22**, and **W-3.1b** closed **TD-25**'s doc half, in `docs/03-architecture.md`, which went from 8 subsections and 300 lines to
  **14 subsections and ~1,344 lines**, running requirements → HLD → LLD. The round was
  deliberately doc-only (**D-46**), so the app's six steps still mirror a doc that no longer
  exists. **Porting it is W-3.2 and it is the next round.** Note the app must mirror the
  *corrections* as well as the additions — `scoring.ts` holds the interrogation set, the DDL
  annotations and the reversibility lists, and all three changed.
- **The cold-reader method is now load-bearing, not a formality.** The re-run on the amended
  stage 03 scored 9 of 14 gaps closed and found five the round had *introduced*, including a
  Definition-of-done checkbox gated on idempotency that the doc never taught. Budget for a
  fix wave after every cold-reader pass; the first report is not the end of the round.
- **Every stage carries an "AI plays" section** (D-35), in both doc and app.
  `stage-metadata.test.ts` now **fails any stage whose doc lacks the `### AI in <stage>`
  heading**, because stage 03's doc turned out not to have one and the round had to write it
  before it could mirror it. Do not assume a stage doc already has its AI section — check.
- **Glossary + metadata are single-sourced** (D-36, TD-2/TD-3 closed): terms live in
  `web/src/lib/terms.ts`, `reference/glossary.md` is generated from it (`pnpm gen:glossary`),
  and a title sync test guards each doc's H1 against `stages.ts`. Never hand-edit
  `glossary.md`.
- **Stages 04–18** render a "sheet not drawn" placeholder. Routing works for all 18.
- **Quality gates live and proven** (`W-4` done): prettier (skips markdown by design),
  eslint at `--max-warnings 0`, **217 vitest tests across 20 files**, a **12-test playwright
  audit suite over 24 URLs**, lefthook hooks, and CI. Branch protection is on; the repo is
  public (D-26).
- **`PAGES` in `web/e2e/audit.spec.ts` is still hand-written** (**TD-12**), so adding a step
  means editing that array by hand. What changed this round: a dead hash used to pass
  silently, and now fails. The list had named `#constrain` and `#decide` for weeks after both
  steps were renamed away, so five of stage 03's steps had never been audited at all with the
  suite green. **TD-12 is not closed** — forgetting to add a step still audits nothing.
- **Not deployed** (`W-5` open).
- **Branch/push:** work happens on `feat/`|`fix/`|`docs/<date>-` branches, merged to `main`
  with `--no-ff` and a hand-written subject, never squashed. **The user handles pushes.**
  `main` and `origin/main` are in sync at **`eeb16f1`**. (An earlier kickoff said `249bd9d`;
  that is two commits stale — it is an ancestor, not the tip.) **Everything since is unmerged
  on `feat/stage-03-app-port`, which is 60 commits ahead.**

### This round's scope

**Resume the D-52 round at Task 5 of 12**, on `feat/stage-03-app-port`.

**Read these two first, in this order:**

1. `.superpowers/sdd/2026-07-31-step-panel-weight/progress.md` — the ledger. It records every
   task, its commits, every deviation from the plan and why, and what remains. It is
   git-ignored scratch, so read it before running anything that cleans the tree.
2. `docs/superpowers/plans/2026-07-31-step-panel-weight.md` — the plan. **Tasks 1–4 are done.
   Start at Task 5.** Its spec is `docs/superpowers/specs/2026-07-31-step-panel-weight-design.md`.

**What the round is.** **D-52 supersedes D-38.** D-38 capped a dense stage at five content
steps, reasoning that "a stepper stops being navigable when a step is a scroll" — then enforced
that by counting steps, which pushes the opposite way, since fewer steps for the same content
makes panels heavier. Measured at 1024×768, stage 03's median panel was **5.3 screens** against
2.4 and 2.5 for stages 01 and 02. D-38 had also already been broken without anyone recording a
deviation: stage 02 shipped six content steps plus AI.

So the rule is now: **a step holds one judgment, and its panel stays under four screens.** Count
follows content. It is enforced by a playwright assertion with a baselined exception list.

**The progress bar is `PANEL_EXCEPTIONS` in `web/e2e/audit.spec.ts`.** It holds **7 entries**;
two are permanent (`01#record`, `02#horizon`) and five are stage 03's temporary debt. **Each
remaining task deletes its own entry. When the list is two entries long, the reshape is done.**

**Tasks 5–12, in order:** split `sketch` into `sketch` + `resilience` (porting the four
resilience patterns) · split `schema` into `schema` + `concurrency` (porting isolation, locking,
CAP) · build the `evolve` step for doc section 9, which still has no step at all · split
`contract` into `contract` + `access` · compress `shape` and port scaling/pooling · compress
`ai` and port four more plays · port the last two clusters into `require` and `record` ·
record D-52 in the tracker and PATTERNS.md.

**The exit condition of a split task is the measurement, not the edit.** Task 4 proved why: the
plan's proposed seam produced a 1.0-screen step beside a 5.1-screen one, still over threshold.
The seam that worked was one section later. Re-cut and re-measure rather than assuming the
plan's seam is right.

**Two per-task steps that are easy to skip and have no safety net:**

- **Re-point the trace rows.** `TRACE_ROWS[].stepId` in `characteristics.ts` renders as a link
  in `TraceForward`. When a step splits, a row whose decision moved keeps naming a step that
  still exists, so the test passes and the link sends the reader to the wrong step. `steps.ts`
  single-sources the ids and makes a nonexistent id a compile error, but nothing can detect
  intent. This is step 3 of the plan's per-task loop for that reason.
- **Grep `terms.ts`** when you port a concept (**D-47**), then `pnpm gen:glossary`. Never
  hand-edit `reference/glossary.md`.

**Already done on this branch, do not redo:** the authorization exercise now scores a checkbox
conjunction rather than `role` alone (it had been teaching the framing that produces cross-team
privilege escalation), browser-verified. The TOC and glossary name **system design**. The
doc's corrections are mirrored into the port — the sixth interrogation question, `version` and
`deleted_at` on the invoices DDL, and the `invoice_sends` block — and `ddl-sync.test.ts` now
holds both `CREATE TABLE` blocks to the doc character-for-character, so that class of drift
fails a test instead of waiting for a reviewer.

**Before merge, non-negotiable:** a whole-branch review covering doc *and* app. The port half
has still never been reviewed — 60 commits — and the last review of this stage's app caught two
blocking defects, including one where sighted and screen-reader users were told opposite things
about the same diagram.

**On subagents in this repo, right now.** Three consecutive implementer dispatches died on
`API Error: Connection closed mid-response`, at three different points, on two different models.
A one-tool-call probe agent completed fine. **Read-only reviewer subagents have been reliable**
(one found a real Important defect). So: implement inline, dispatch reviewers. If implementer
dispatches work again, use them — but commit as soon as a test goes green, because a mid-flight
death loses everything uncommitted.

**Three cautions this stage has earned:**

- **Executable content gets executed** (**D-50**). A whole-branch review found two defects in
  the doc's SQL by running it — a backfill that corrupted every single-word name, and a loop
  whose own "repeat until zero" comment was false. Reading had missed both. One `docker run`.
- **The cold-reader pass is the middle of a round, not the end.** Every run so far has found
  gaps the round itself introduced. Budget a fix wave, and verify the wave (**D-48**).
- **Grep `terms.ts` when you fix a concept** (**D-47**). It has now carried the same defect as
  the prose twice, because everyone checking was reading prose.
- **An ordinal in prose is a citation, and it stales like one.** "The fifth interrogation
  question" went wrong in **four** places on this branch when a sixth question was inserted
  above it — the doc, `schema-blocks.ts`, a figure caption, and the `model` step's prose, the
  last found two rounds after the first three were fixed. Nothing in the gate sees it and a
  grep for it barely helps. Name the thing instead of counting to it.

---

## Quick reference — for you, not the new session

Notes for whoever is preparing this handoff:

- Refresh **Project state** and **This round's scope** before pasting. Delete closed
  items rather than leaving them ticked.
- Fill in the `[FILL IN: ...]` lean, or delete the line if genuinely undecided.
- If a round is already scoped, add a per-round sibling — `KICKOFF-W4.md` — rather than
  overwriting this one. The generic version stays useful.
- Open threads worth carrying forward:
  - The delivery loop has run many times now; stage 03's spec/plan pair
    (`docs/superpowers/{specs,plans}/2026-07-28-stage-03-architecture*`) is the fullest house
    example — 17 tasks, subagent-driven, with the ledger at
    `.superpowers/sdd/2026-07-28-stage-03-architecture/progress.md`.
  - **Cold-reader testing** (`docs/learnings/cold-reader-testing.md`) is how a stage doc is
    validated before it ships. Run the beginner-completeness pass **before** building the
    interactive stage, not after — stage 03 ran it last and now has a finished app on top of
    a doc with three blocking gaps.
  - **Most of stage 03's defects were plan-authored, not implementer error** (tracker,
    "Process observations"). A per-task review sees one diff; nothing but controller-level
    review catches a task whose output undermines another's. Budget for that.
  - **Cite doc sections by heading, never by line number** (D-42). An audit of `web/src/`
    found 14 of 33 citations wrong — four staled by this round, ten inherited from the
    stage 02 round, the worst off by ~86 lines. Nothing in the gate can detect it, and a
    grep for the pattern cannot either: it only sees citations that repeat the filename, so
    bare `:NNN` continuations and citations to other docs stay invisible. Open the lines.
  - `docs/learnings/contrast-checkers-lie.md` — read it before changing a token in response
    to a contrast number. Three of the failures reported in this repo were the checker.
