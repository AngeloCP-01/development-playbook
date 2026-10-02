# Kickoff — Development Playbook

**Next round, 2026-10-02: choose the next W-3 stage.** The bounded W-6
`incident-management` companion merged locally into `develop` as `a992d74`
(`--no-ff`). It is drawn and registered, with generated markdown. No image
plate was selected; the Stage 16 source ledger records the candidate's errors.
The branch gate passed 1389 tests across 181 files, format, lint, typecheck,
a 49-page production build and browser audit 18/18. Stages 08–10, 17 and 18
remain; W-3 is **13/18**. Nothing from this round was pushed or deployed.
The merged tree also passed 1389/1389 tests, lint, typecheck and format.
Read `docs/tracker.md` → Next up before choosing the next stage.

Paste the block below into a **new coding session** opened in
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

- `AGENTS.md` and `CLAUDE.md` — git conventions, delivery loop, review and TDD
  standards, tooling. Start here.
- `docs/task.md` — **only the section for the milestone this round is on**. Older
  completed sections now live in `docs/task-archive.md` — grep by id,
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

### Project state (verified 2026-10-02; recheck before work)

Stages 01–07 and 11–16 are interactive on local `develop` (**13/18**); 08–10,
17 and 18 remain. Stage 16 is `ready: true` after merge `3d2c266`; its port
branch was deleted. W-6 has **19 of 24** registered sheets drawn on local
`develop`; the Stage 16 companion merged as `a992d74`.

The Stage 16 source ledger is `reference/cheatsheet-sources.md` → *Stage 16
gathering round*. It has six attributed external sources and eight local image
captures. No graphic was selected for the new sheet: the NovelVista sequence
contradicts the repaired chapter, several captures lack exact source URLs, and
the slide template contains placeholder text.

The user chose a lean workflow for the bounded sheet: brief in-chat design,
TDD, self-review and the local gate, without a separate spec or plan. The
feature branch was deleted after the approved local merge.

**Start here, in order:**

1. **Check the branch before editing anything.** `git branch --show-current` should
   be `develop` unless a new work branch has been cut.
   If the answer is `main`, stop and read `docs/learnings/branch-discipline-101.md`.
2. **Re-derive every number in this file before trusting it.** `git fetch`, then the
   commands under "Branch state". This file has a documented history of being wrong
   about numbers, all found by checking rather than reading.
3. **Run the two one-line checks that belong at every refresh:**
   `rg -n "NOT merged, NOT pushed, NOT deployed" docs/tracker.md` and
   `git ls-files reference/ | rg -iv "jpeg|jpg|png|webp|gif|\.md$"`.
   The reference check must return nothing. The tracker currently has one
   historical struck-through hit in its 2026-09-08 W-3.12 row; verify that
   every hit is struck through and immediately corrected, not a live status.
4. **Choose the next W-3 stage.** Stages 08–10, 17 and 18 remain. Read their
   canonical docs and the W-3 order in `docs/task.md` before setting scope.
5. **Keep W-6.4 separate.** Glossary and stack surfacing remains open; ask
   before any future merge into `develop`, and never merge or push to `main`.

---

#### The condensed history (01–07, 11–16, the reference hub)

Full detail lives in `docs/tracker.md` and `docs/tracker-archive.md`; grep them by ID.

- **Stages 01–07 and 11–16 are interactive and merged.** 03 is 22 steps, 04
  is 15, 05 is 13, 06 is 8, 07 is 6, 11 is 8, 12 is 6, 13 is 8 (platform-aware), 14 is 6,
  15 is 16 (after the D-52 reshape), and 16 is 14. Coverage walks ran on
  03–06, 11–14; the later ports have not had one yet. Stages 08–10 and 17–18
  render a "sheet not drawn" placeholder; routing works for all 18.
- **The standard review loop has per-task and whole-branch reviews.** The user
  chose one whole-branch review for the Stage 16 port to reduce ceremony;
  it found three blocking issues the green gate missed. The same session
  cannot self-review; see `CLAUDE.md` → *Subagent models*.
- **A coverage walk, blind to the branch's own plan and reports, finds real gaps.**
  Budget a fix wave after it.
- **Glossary and stage metadata are single-sourced** (D-36): terms live in
  `web/src/lib/terms.ts` (`pnpm gen:glossary`), never hand-edit `glossary.md`.
- **Quality gates**: prettier (skips markdown and `highlighted.generated.ts`), eslint at
  `--max-warnings 0`, vitest in two projects, `test:e2e` (18-test Playwright audit),
  `test:dev-console` (outside the gate, once per stage round — TD-35, D-84).
- **The W-6 branch passed 1389 tests across 181 files** before its local merge,
  measured 2026-10-01. Lint, typecheck, format and production audit 18/18
  were green; Stage 16's development-console audit was 1/1.
- **The e2e per-test timeout is 120s, not 60s** (`playwright.config.ts`, `2bb64e9`) — an
  18th stage in the sweep pushed WCAG AA and the disclosure sweep over the old budget;
  this is a repo-wide headroom fix, unrelated to stage 15's own content.
- **Deployed**: `W-5` complete, live at https://acp-dev-playbook.vercel.app since
  2026-08-11. `pnpm test:prod` verifies the deployment, outside the merge gate.

---

#### Branch state — re-derive before work

```bash
git fetch
git log -1 --oneline develop
git log -1 --oneline origin/develop
git log -1 --oneline main
git rev-list --count origin/develop..develop
git rev-list --count main..develop
git rev-list --count develop..main
git status --short --branch
git ls-files reference/ | rg -iv "jpeg|jpg|png|webp|gif|\.md$"
```

**Verified 2026-10-01 after `git fetch`:** local `develop` was at `d272a73`,
six commits ahead of `origin/develop` (`3d9d70c`), and 137 ahead of `main`
(`d659d32`); `main` was two ahead of `develop` by merge history. This kickoff
edit will add another local commit, so run the commands above for current
counts. The worktree was clean and this was the sole worktree. A separate
`docs/2026-09-30-stage-16-handoff` branch still exists; the Stage 16 port
branch was deleted after merge. Nothing from the port round has been pushed.

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
  - **W-6 `incident-management` is merged locally.** Its sources and graphic
    caveats are in `reference/cheatsheet-sources.md` → Stage 16 gathering round.
    The sheet has no plate; neither it nor the Stage 16 port is deployed.
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
