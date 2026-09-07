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
- `docs/learnings/README.md` — eight guides written after rounds that cost real time.
  **Read `branch-discipline-101.md` first, before touching git at all**, and
  **`decisions-need-tests-101.md`'s newest section before trusting any "merged" or "not
  merged" claim anywhere, including in this file** — a stage's merge status went stale
  in both `docs/task.md` and `docs/tracker.md` and was believed for a full day.
  `stage-implementation-101.md` (worked-example teaching pattern, Tailwind v4 token
  naming, atomic registration) and `quality-gates-101.md` (gate blind spots) both bear
  on whichever stage comes next.

### Project state (as of 2026-09-07 — W-3 is **11/18**, seven stages remain.
Stages 01–07, 11, 12, 13 and 14 are interactive. Stage 13 is platform-aware (8 steps,
Vercel + AWS). **Eighteen of twenty-three** reference sheets drawn. The W-6 round that
D-88 puts after a shipped stage has already run for stage 11 (two sheets, `github-actions`
and `ci-cd`), so the next round is a `W-3` stage, not another sheet. **The recommended
next round is stage 15 (Observability)** — completes the deploy→verify→observe pipeline
(12→13→14→15). The doc exists but has not been assessed. Other candidates:
08 (Security Audit, clean break), 09 (Performance, Core Web Vitals),
10 (Documentation, never stops).)

**Start here, in order:**

1. **Check the branch before editing anything.** `git branch --show-current`. If it says
   `develop` or `main`, branch first. This bit twice in one session — see
   `docs/learnings/branch-discipline-101.md`.
2. **Before trusting anything this file says about merge status, run `git log`
   yourself.** The previous version of this exact file was itself wrong about stage 06
   being unmerged, for a full day — see
   `docs/learnings/decisions-need-tests-101.md`'s newest section.
3. **Stage 15 (Observability) is the recommended next round.** Completes the shipping
   pipeline: 11 (CI/CD) → 12 (Staging) → 13 (Deploy) → 14 (Verify) → 15 (Observe), all
   interactive. Same doc-correction-then-port pattern. Read
   `docs/learnings/stage-implementation-101.md` before porting.
4. Run `git fetch` and re-derive `develop`'s position against `origin/develop` and
   `origin/main` — the exact commands are in "Branch state" below. Do not trust any commit
   SHA quoted in this file.

---

#### What shipped since the last kickoff

**`ci-cd` cheatsheet** (W-6.3m) — eighteenth drawn sheet, tethered to stage 11, and the
registry's **third concept/tool split** after `git-commands`÷`git-branching` and
`testing`÷`playwright`. Four sections: CI vs continuous delivery vs continuous
deployment; seven pipeline stages ordered cheapest-failure-first; who plays each role
across seven tool categories; six practices. Three gathered graphics, one displayed and
two consulted — the first use of D-89's convention since D-90 superseded its premise but
kept the reasoning on file. **Merged to `develop` as `6f52212`, branch deleted.**

**TD-45 closed** (merged as `99f6145`): the audit's overflow, touch-target and step-hash
sweeps asserted inside their path loop, so the first failing path threw and the rest of
the list was never loaded — nine sheets had never been measured at 320px. All sweeps now
collect and assert once. The one failure it was hiding is fixed, and **the audit is
18/18 for the first time**.

**TD-44 is still open and is a question for you**, not a chore: see "Open threads".

**Stage 11 (CI/CD) is interactive** (W-3.11), merged 2026-09-07.
Eight steps: annotated ci.yml/e2e.yml/dependabot.yml, click-to-place ordering
exercise (cheapest-failure-first), branch protection RevealList, scaling moves,
8 AI plays, 9 traps. Doc corrected: action versions @v4→@v7/@v6/@v7, AI section
added then expanded (8 plays covering Copilot review, Claude Code in CI, build
diagnosis, test gap analysis). Six glossary terms, four references. Coverage walk
14/14 sections, 0 gaps. W-3 at 11/18.

**`github-actions` cheatsheet shipped** (W-6.3l) — tethered to stage 11, 17th drawn.

Previously shipped (2026-09-04):
- Stage 14 (Post-Deployment Verification, W-3.10) — 6 steps, doc expanded to 343 lines
- `post-deploy-verification` (W-6.3j), `git-cheatsheet` (W-6.3k)

Previously shipped (2026-09-02/03):
- Stage 13 AWS expansion (W-3.9b) — 8 steps, coverage walk ran
- Stage 13 initial interactive port (W-3.9) — six Vercel-focused steps
- Stage 12 (Staging, W-3.8) — six panels, coverage walk ran
- `aws-deployment` (W-6.3i), `deployment-environments` (W-6.3h)

**1161 tests across 160 files, build clean, e2e 18/18, dev-console 1/1.**
The audit is fully green for the first time — it read 17/18 for weeks, and TD-45 is
why that number was not what it appeared to be.

---

#### The condensed history (01–07, 12, the reference hub)

Full detail lives in `docs/tracker.md`; this is what a new session needs without
re-reading the whole log.

- **Stages 01–07, 11, 12, 13 and 14 are interactive and merged.** 03 is 22 steps, 04 is
  15, 05 is 13, 06 is 8, 07 is 6, 11 is 8 (ordering exercise signature piece), 12 is 6,
  13 is 8 (platform-aware: Vercel + AWS), 14 is 6. Coverage walks ran on stages 03–06,
  11, 12, 13, 14 (3 blocking fixed on 13). Stage 11: 14 sections, 0 gaps. Stage 14's
  walk ran 2026-09-07 and returned seven findings, 12 of 16 sections covered; five were
  fixed, one downgraded and one rejected on verification. Stages 08–10 and 15–18 render a "sheet not drawn"
  placeholder; routing works for all 18.
- **A per-task reviewer subagent, plus a whole-branch review, is the standard** — every
  reviewed round has found something a green gate did not. Stage 07's final review caught
  dead CSS classes across three files that no per-task review or e2e audit saw.
  **The same session cannot self-review.**
- **A coverage walk, blind to the branch's own plan and reports, finds real gaps a green
  gate and clean per-task reviews cannot see** — five on stage 04, ten on stage 05.
  `docs/learnings/stage-implementation-101.md` has the method. Budget a fix wave after it.
- **Glossary and stage metadata are single-sourced** (D-36): terms live in
  `web/src/lib/terms.ts` (`pnpm gen:glossary`), never hand-edit `glossary.md`.
- **Quality gates**: prettier (skips markdown and `highlighted.generated.ts` by design),
  eslint at `--max-warnings 0`, vitest in two projects (`unit` node, `dom` jsdom),
  `test:e2e` (18-test Playwright audit, refuses a stale server per TD-27),
  `test:dev-console` (React dev-mode warnings, outside the gate, run once per stage
  round — TD-35, D-84). Re-derive current counts rather than quoting them.
- **1161 tests across 160 files** (the previous kickoff said 1143, which was already
  wrong when written), build clean, **e2e 18/18**, dev-console 1/1. The long-standing
  "17/18, 1 pre-existing" is closed: the overflow was real and is fixed, and TD-45 —
  the reason the other 320px results were unknown rather than passing — is closed too.
- **Deployed**: `W-5` complete, live at https://acp-dev-playbook.vercel.app since
  2026-08-11. `pnpm test:prod` verifies the deployment itself, outside the merge gate.
  `docs/learnings/deploying-101.md` before touching deploy config.

---

#### Branch state — re-derive, do not trust any SHA below

```bash
git fetch
git log --oneline -1 develop origin/develop main origin/main
git rev-list --count origin/develop..develop
```

**Last measured at the end of this session (2026-09-07), after both merges.** `develop`
is at `a8f56de`, **3 commits ahead of `origin/develop`** (`32c1613`) and **42 ahead of
`main`** (`d659d32`), so a promotion is pending. The user pushed once mid-session, which
is why this number reset rather than climbing. `main` is 2 ahead of `develop`, which is
just its own `--no-ff` merge commits.

The previous version of this paragraph was wrong, which is why the numbers above are
measured rather than carried forward: it claimed `develop` was "well ahead of
`origin/develop` (the user has not pushed since several rounds ago)" when the two were
identical.

**No branch is in flight.** All four of this session's branches merged `--no-ff` and were
deleted: `feat/ci-cd-cheatsheet` as `6f52212`, `fix/audit-fail-fast` as `99f6145`,
`feat/ci-cd-sheet-expansion` as `4fdb9bd`, `fix/stage-14-coverage-walk` as `a8f56de`.
Each merged result was re-gated first-hand — lint 0, typecheck 0, 1161/160, build clean,
audit 18/18.

**Both merged without a whole-branch review, on the user's call.** Every previous
branch's review found something a green gate did not, so treat both as less checked than
usual. `pnpm test:dev-console` did not run either: a `next dev` server was already up on
:3200 and Next refuses a second one for the same directory.

**Re-derive before trusting anything here.** That instruction is not boilerplate: this
paragraph has now been wrong twice, about two different things.

**Branch/push convention, unchanged:** work on `feat/`|`fix/`|`docs/<date>-` branches, cut
from `develop`, never from `main`. Merge with `--no-ff` and a hand-written subject, never
squashed. **Ask before every merge.** The user handles pushes and the `develop` → `main`
promotion PR.

---

## Quick reference — for you, not the new session

Notes for whoever is preparing this handoff:

- Refresh **Project state** and re-derive **Branch state** before pasting. Delete closed
  items rather than leaving them ticked.
- **Untracked and deliberately parked**: `reference/10-sql-concepts.md` and
  `reference/rest-api-best-practices.md` — hand-written drafts for `sql-reference` and
  `api-reference`, gathered without an image, not yet registered.
- If a round is already scoped, add a per-round sibling — `KICKOFF-W4.md` — rather than
  overwriting this one. The generic version stays useful.
- Open threads worth carrying forward:
  - **Four branches merged unreviewed this session** (`6f52212`, `99f6145`, `4fdb9bd`,
    `a8f56de`). Nothing is in flight, but none got the whole-branch pass the standard
    calls for.
  - **`develop` is 42 commits ahead of `main`** and 3 ahead of `origin/develop`. The
    promotion PR is the user's.
  - **Panel content is testable now.** `Element.prototype.scrollIntoView` is stubbed in
    `src/test/setup.ts`; without it any test activating a step other than the first threw
    from inside a `Stepper` effect. That is why stage 14's component test had six tests
    that only inspected the rail. Assume other stages' component tests have the same
    shape and the same blind spot.
  - **Grep `NOT merged, NOT pushed, NOT deployed` in `docs/tracker.md` at every merge.**
    Doing it once this session found three rows carrying the phrase: one merely out of
    date, and two false for weeks (W-6.3e, TD-43). It costs one command.
  - **TD-44 is a question, not a chore, and it is the user's to answer.** Two records
    say gathered originals are untracked and gitignored; all 62 files under `reference/`
    are tracked and `.gitignore` covers only `.DS_Store` and `.playwright-mcp/`. Either
    add the ignore rule and drop them from the index, or rewrite both paragraphs to
    describe tracking. Do not pick one silently. Opened as **TD-44**.
  - ~~**A green `pnpm test:e2e` is not a claim about every page**~~ — **closed
    2026-09-07 as TD-45.** Every sweep now collects across the whole path list and
    asserts once, so a run names every bad path instead of the first. Worth knowing why
    it mattered: nine sheets had never been measured at 320px, and all nine turned out
    clean, so the fix bought *known-good* rather than a pile of new bugs. **Keep the
    rule when adding a sweep**: assert after the loop, never inside it.
  - **Two numbers in the records were wrong when written, both found by re-deriving.**
    The test count (`1143` against a real `1152`) and the originals-are-untracked claim.
    Re-run the query; do not copy the answer.
  - **Read `docs/learnings/branch-discipline-101.md` before the first commit of any new
    round**, not just once.
  - **A "merged"/"not merged" claim is a query to re-run, not a fact to reuse** —
    `docs/learnings/decisions-need-tests-101.md`.
  - **Cold-reader testing** (`docs/learnings/cold-reader-testing.md`) validates a stage
    doc before the interactive port starts, not after (D-54).
  - **Cite doc sections by heading, never by line number** (D-42).
  - `docs/learnings/contrast-checkers-lie.md` — read before changing a token.
  - `docs/learnings/rules-measure-the-wrong-thing-101.md` — measure before capping.
  - **Tailwind v4 token naming** — `border-line` not `border-rule`, `bg-sunken` not
    `bg-surface-sunken`. Check the `@theme` block in `globals.css`, not the CSS custom
    property names. Three files × 8 instances caught only at final review.
  - **The three-file registration (stages.ts, stage-content.ts, step-ids.ts) is one
    atomic operation** — do it in the assembly task, not the scaffold task.
