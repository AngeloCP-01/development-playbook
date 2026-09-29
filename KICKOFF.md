# Kickoff — Development Playbook

**Current round, 2026-09-29:** the user chose **stage 16 — Incident Management**.
Preparation is on `docs/2026-09-29-stage-16-preparation`, based on `develop` at
`91a6838`. Sources are gathered in `reference/cheatsheet-sources.md`; the document
assessment is recorded in `docs/superpowers/specs/2026-09-29-stage-16-cold-reader-findings.md`.
The document-repair spec in `docs/superpowers/specs/2026-09-29-stage-16-doc-round-design.md`
awaits review; implementation planning and the port have not started. W-3 remains 12/18. This update supersedes
the older instructions below to choose the next stage; September 16 verification
and branch counts below are historical, not measurements of this round.

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
- `docs/task.md` — **only the section for the milestone this round is on**. Older
  completed sections now live in `docs/task-archive.md` (new this round) — grep by id,
  don't read either file whole.
- `docs/tracker.md` — **do not read it whole.** Read `## Next up`, then list open debt
  with `grep '^### TD' docs/tracker.md`. For any decision you need, grep its ID
  (`grep -n 'D-54' docs/tracker.md docs/tracker-archive.md`). Closed debt and older
  Completed rows live in `docs/tracker-archive.md`, same rule: grep, never read.
- `web/DESIGN.md` — the design system; any new UI matches it
- `README.md` — the playbook's own index and its central claim
- `web/AGENTS.md` — this Next.js version postdates your training data; read
  `node_modules/next/dist/docs/` before writing framework code
- `docs/learnings/README.md` — guides written after rounds that cost real time.
  **Read `branch-discipline-101.md` first, before touching git at all.** Then
  **`plans-are-unverified-101.md`**: nothing in this repository reads a plan, and the
  stage 15 port plan proved it twice while it was being written, then a third time
  during its own execution — the D-52 fix the plan pre-authorized covered one panel,
  and the real number was four.

### Project state (as of 2026-09-16 — W-3 is **12/18**, six stages remain.

Stages 01–07, 11, 12, 13, 14 and 15 are interactive. Stage 13 is platform-aware (8 steps,
Vercel + AWS). **Eighteen of twenty-three** reference sheets drawn.

**Stage 15 is interactive and merged.** `feat/stage-15-observability-port` (18 commits,
`d9b4da2..2ea6414`) landed on `develop` as `9d834e8` (`--no-ff`), branch deleted.
`ready: true`, sixteen steps (ten as planned, plus a mid-verification D-52 reshape that
split four panels — full account in `docs/tracker.md`'s 2026-09-15 W-3.12 row). The
final whole-branch review (opus) found two blocking issues — untested checklist
persistence, two stale step-count references from the reshape — both fixed (`3604e59`)
and independently re-verified with a teeth check. Post-merge gate on `develop`: **179
files / 1351 tests**, `pnpm lint` clean, `pnpm typecheck` clean, `pnpm test:e2e` 18/18,
`pnpm test:dev-console` 1/1 zero warnings. `develop` is pushed — `origin/develop`
matches.

Records were archived this round too (D-96 pattern, extended to `task.md` for the first
time): 45 Completed rows moved to `docs/tracker-archive.md`, ten fully-completed
`docs/task.md` sections moved to the new `docs/task-archive.md`.

**Start here, in order:**

1. **Check the branch before editing anything.** `git branch --show-current`. Should be
   `develop` unless you already cut a work branch. If the answer is `main`, or a branch
   you did not expect, stop and read `docs/learnings/branch-discipline-101.md`.
2. **Re-derive every number in this file before trusting it.** `git fetch`, then the
   commands under "Branch state". This file has a documented history of being wrong
   about numbers, all found by checking rather than reading.
3. **Run the two one-line checks that belong at every refresh:**
   `grep -n "NOT merged, NOT pushed, NOT deployed" docs/tracker.md` and
   `git ls-files reference/ | grep -iv "jpeg\|jpg\|png\|webp\|gif\|\.md$"`. Both must
   return nothing.
4. **Pick the next W-3 stage before cutting a branch.** Six remain, no priority chosen:
   `08-security-audit` (Security Audit), `09-performance-optimization` (Performance
   Optimization), `10-documentation` (Documentation), `16-incident-management` (Incident
   Management), `17-maintenance` (Maintenance), `18-continuous-improvement` (Continuous
   Improvement). This has deliberately been left open rather than picked for you — ask
   the user which one, or default to numeric order (08 next) only if they have no
   preference. Read `docs/task.md`'s `### W-3` section for the shared per-stage
   checklist once a stage is chosen.
5. **If it's a real stage round**, run the delivery loop: brainstorm → spec → plan
   (Opus) → TDD tasks (sonnet, subagent-driven) → per-task review → whole-branch review
   (opus) → merge (ask first, target `develop`, never `main`).

---

#### The condensed history (01–07, 11–15, the reference hub)

Full detail lives in `docs/tracker.md` and `docs/tracker-archive.md`; grep them by ID.

- **Stages 01–07, 11, 12, 13, 14 and 15 are interactive and merged.** 03 is 22 steps, 04
  is 15, 05 is 13, 06 is 8, 07 is 6, 11 is 8, 12 is 6, 13 is 8 (platform-aware), 14 is 6,
  15 is 16 (after the D-52 reshape). Coverage walks ran on 03–06, 11–14; stage 15's port
  has not had one yet. Stages 08–10 and 16–18 render a "sheet not drawn" placeholder;
  routing works for all 18.
- **A per-task reviewer subagent, plus a whole-branch review, is the standard** — every
  reviewed round has found something a green gate did not. **The same session cannot
  self-review.** Under the Pro policy the per-task reviewer is `sonnet` with evidence
  required (escalated to `opus` for a task touching `stages.ts`/routing/build/CI), the
  final review is `opus`; `CLAUDE.md` → *Subagent models*.
- **A coverage walk, blind to the branch's own plan and reports, finds real gaps.**
  Budget a fix wave after it.
- **Glossary and stage metadata are single-sourced** (D-36): terms live in
  `web/src/lib/terms.ts` (`pnpm gen:glossary`), never hand-edit `glossary.md`.
- **Quality gates**: prettier (skips markdown and `highlighted.generated.ts`), eslint at
  `--max-warnings 0`, vitest in two projects, `test:e2e` (18-test Playwright audit),
  `test:dev-console` (outside the gate, once per stage round — TD-35, D-84).
- **`develop` is at 1351 tests across 179 files**, measured 2026-09-16 after the stage
  15 merge and its final-review fix wave.
- **The e2e per-test timeout is 120s, not 60s** (`playwright.config.ts`, `2bb64e9`) — an
  18th stage in the sweep pushed WCAG AA and the disclosure sweep over the old budget;
  this is a repo-wide headroom fix, unrelated to stage 15's own content.
- **Deployed**: `W-5` complete, live at https://acp-dev-playbook.vercel.app since
  2026-08-11. `pnpm test:prod` verifies the deployment, outside the merge gate.

---

#### Branch state — re-derive, do not trust any SHA below

```bash
git fetch
git log --oneline -1 develop origin/develop main
git rev-list --count origin/develop..develop
git rev-list --count main..develop
git ls-files reference/ | grep -iv "jpeg\|jpg\|png\|webp\|gif\|\.md$"
```

**Measured 2026-09-16, after the stage 15 merge and this records refresh:**

| | SHA | |
|---|---|---|
| `develop` | `9d834e8` | **0 ahead of `origin/develop`** — pushed, matches |
| `main` | `d659d32` | `develop` is **116 ahead**; `main` is **2 ahead** of `develop` (pre-existing merge-history commits, untouched this round) |

The promotion of `develop` to `main` is **the user's**, and 116 commits are waiting on
it.

**`git branch` is `develop` and `main`** (the port branch was deleted on merge); `git
worktree list` is one line (this working directory, on `develop`).

**Branch/push convention, unchanged:** work on `feat/`|`fix/`|`docs/<date>-` branches,
cut from `develop`, never from `main`. Merge with `--no-ff` and a hand-written subject,
never squashed. **Ask before every merge.** The user handles pushes and the promotion PR.

## Quick reference — for you, not the new session

Notes for whoever is preparing this handoff:

- Refresh **Project state** and re-derive **Branch state** before pasting. Delete closed
  items rather than leaving them ticked.
- **Open the session on the right model** (`CLAUDE.md` → *Session model*): Opus for a
  brainstorm/spec/plan session, Sonnet for execution, doc rounds and tracker refreshes.
  The global default is Sonnet at medium effort since 2026-09-10 (Pro budget).
- **Untracked and deliberately parked**: `reference/10-sql-concepts.md` and
  `reference/rest-api-best-practices.md` — hand-written drafts for `sql-reference` and
  `api-reference`, gathered without an image, not yet registered.
- Open threads worth carrying forward:
  - **The next W-3 stage is not chosen.** Six remain (08, 09, 10, 16, 17, 18) — see
    "Start here" above. This is deliberately left as a question, not a default.
  - **The D-52 split's own reviews left two cosmetic Minor findings, deferred:**
    `Callout` `eyebrow` text on the split panels not updated to match the new step
    boundaries, and the panel-file comment numbering scheme inconsistent across the
    split.
  - **The baselines/alert-set persisted worksheet is its own bounded round**, deferred at
    the user's direction 2026-09-11, unstarted.
  - **`TriageDrill`/`AuthorizationDrill` (stage 06) are not yet migrated onto the shared
    `Drill` component** stage 15 introduced — still two implementations of the same
    pattern.
  - **Ten observability captures are tracked in `reference/` with no provenance.** Ask
    for authors and URLs before registering any of them. (The five text sources that fed
    the doc's prose *are* registered, since 2026-09-11.)
  - **`sql-reference`/`api-reference` still parked**, untracked
    (`reference/10-sql-concepts.md`, `reference/rest-api-best-practices.md`).
  - **The tracker/task split now has two archives.** `docs/tracker-archive.md` and the
    new `docs/task-archive.md` — grep either by ID, don't assume a section is only in
    the live file. No automated guard exists yet for the task/task-archive split (unlike
    `tracker-ledger.test.ts` for tracker/tracker-archive); a follow-up could mirror that
    test if the split proves error-prone.
  - **Grep `NOT merged, NOT pushed, NOT deployed` in `docs/tracker.md` at every merge.**
    Doing it once found three rows carrying the phrase, two false for weeks.
  - **A "merged"/"not merged" claim is a query to re-run, not a fact to reuse** —
    `docs/learnings/decisions-need-tests-101.md`.
  - **A number in a plan is a measurement, not a quotation** —
    `docs/learnings/plans-are-unverified-101.md`.
  - **Cold-reader testing** validates a stage doc before the port starts, not after
    (D-54). The re-run must reuse the same scenario.
  - **Cite doc sections by heading, never by line number** (D-42).
  - `docs/learnings/contrast-checkers-lie.md` — read before changing a token.
  - `docs/learnings/rules-measure-the-wrong-thing-101.md` — measure before capping.
  - **Tailwind v4 token naming** — `border-line` not `border-rule`, `bg-sunken` not
    `bg-surface-sunken`. Check the `@theme` block in `globals.css`.
  - **The three-file registration (stages.ts, stage-content.ts, step-ids.ts) is one
    atomic operation** — do it in the assembly task, not the scaffold task.
