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

### Project state (as of 2026-07-31)

- **Playbook content:** all 18 stage docs written (`P-0`…`P-4`).
  **Caution:** the "18/18 pass the seven-section template check" and "124/124 links resolve"
  figures quoted in the tracker came from **ad-hoc P-4 scripts that no longer exist** (TD-5).
  They are not committed tests and nothing re-runs them. Do not cite them as having passed.
  What *is* enforced: `stage-metadata.test.ts` (each doc's H1 matches `stages.ts`, and every
  built stage has its `### AI in …` heading), `glossary.test.ts`, and — new in W-3.1 —
  `stage-03-structure.test.ts` (pins that doc's fourteen subsections in order) and
  `source-citations.test.ts` (D-42: bans line-number citations and resolves every heading one).
- **Web app:** `web/` — Next 16, TypeScript, Tailwind 4, no backend. **Stages 01 and 02 are complete and interactive; 03 is
  mid-port on `feat/stage-03-app-port`** — 9 steps built against a doc that has since grown to
  14 sections. See `docs/stage-03-status.md` for exactly what is and is not ported.
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
  eslint at `--max-warnings 0`, **205 vitest tests across 18 files**, a **10-test playwright
  audit suite over 20 URLs**, lefthook hooks, and CI. Branch protection is on; the repo is
  public (D-26).
- **The audit suite does *not* sweep ready stages automatically.** `PAGES` in
  `web/e2e/audit.spec.ts` is a hand-written list of step hashes (**TD-12**). Adding a stage
  means editing that array by hand; nothing fails if you forget, so a stage can ship
  unaudited with the suite still green. An earlier version of this kickoff claimed otherwise.
- **Not deployed** (`W-5` open).
- **Branch/push:** work happens on `feat/`|`fix/`|`docs/<date>-` branches, merged to `main`
  with `--no-ff` and a hand-written subject, never squashed. **The user handles pushes.**
  `main` and `origin/main` are in sync at `249bd9d`, which CI ran green on
  (`30426083363`). **Everything since is unmerged on `feat/stage-03-app-port`.**

### This round's scope

**Continue `W-3.2` — finish porting stage 03 into the app, on `feat/stage-03-app-port`.**

**Read `docs/stage-03-status.md` first.** It is the coverage map: every doc section against its
app step, what is ported, what is partial, what is missing, and the remaining tasks. It is more
current than any checklist here, because it is updated when the doc moves rather than when a
round closes. At the last check: **5 sections fully ported, 8 partial, 1 not ported.**

**The doc has stopped moving.** `feat/stage-03-standard-practices` was merged *into* this
branch (**D-51**) rather than into `main`, so there is one stable target and the new material
gets ported once instead of twice. Nothing is on `main`; the branch is ~50 commits.

**Do these two first**, because they are cheap and they shape everything after:

1. **Mirror the corrections, not just the additions.** This is the one that is invisible if
   missed — the app currently *asserts things the doc has since retracted*. `scoring.ts`'s
   interrogation set is 5 questions and the doc has 6; `schema-blocks.ts` needs `version`,
   `deleted_at` and `invoice_sends`; the reversibility lists and DDL annotations both moved.
2. **Settle the step count and supersede D-38 with a reason.** The app is at 9 steps against a
   ceiling of 5 content + AI, and section 9 makes 10 likely. "Stage 03 is special" will not
   hold — stage 04 will make the same argument.

Then the bulk: **section 9 ("Evolve the schema safely") has no app step at all**, and five
clusters of new material need porting into the eight partial steps.

**Already fixed on this branch, do not redo:** the authorization exercise was scoring `role`
alone as correct on the manager-approves-a-swap scenario — the framing that produces cross-team
privilege escalation — and is now a checkbox conjunction, browser-verified. The TOC and glossary
now name **system design**, since the stage is called Architecture and nobody searches for that.

**Before merge, non-negotiable:** a whole-branch review covering doc *and* app. The port half
has never been reviewed — ~50 commits, ~11,000 lines — and the last review of this stage's app
caught two blocking defects, including one where sighted and screen-reader users were told
opposite things about the same diagram. Also add the new step hashes to `web/e2e/audit.spec.ts`
by hand (**TD-12**): nothing fails if you forget, so a step can ship unaudited with the suite
green.

**Three cautions this stage has earned:**

- **Executable content gets executed** (**D-50**). A whole-branch review found two defects in
  the doc's SQL by running it — a backfill that corrupted every single-word name, and a loop
  whose own "repeat until zero" comment was false. Reading had missed both. One `docker run`.
- **The cold-reader pass is the middle of a round, not the end.** Every run so far has found
  gaps the round itself introduced. Budget a fix wave, and verify the wave (**D-48**).
- **Grep `terms.ts` when you fix a concept** (**D-47**). It has now carried the same defect as
  the prose twice, because everyone checking was reading prose.

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
