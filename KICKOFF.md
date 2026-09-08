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

### Project state (as of 2026-09-08 — W-3 is **11/18**, seven stages remain.
Stages 01–07, 11, 12, 13 and 14 are interactive. Stage 13 is platform-aware (8 steps,
Vercel + AWS). **Eighteen of twenty-three** reference sheets drawn. Nothing is in flight
and the tree is clean.

**This session is for stage 15 (Observability), W-3.12.** It is already decided — do not
re-litigate it. Stage 11's W-6 round is done (two sheets), so the reference-sheet cadence
D-88 describes has been paid and the next move is a `W-3` stage. Stage 15 closes the
shipping pipeline: 11 CI/CD → 12 Staging → 13 Deploy → 14 Verify → 15 Observe, all
interactive. Its own W-6 round, if the material justifies one, comes after — not first.)

**Start here, in order:**

1. **Check the branch before editing anything.** `git branch --show-current`. If it says
   `develop` or `main`, branch first. This has bitten twice — see
   `docs/learnings/branch-discipline-101.md`.
2. **Re-derive every number in this file before trusting it.** `git fetch`, then the
   commands under "Branch state". This file has now been wrong three separate times: about
   a stage's merge status, about a test count, and about whether `develop` was pushed. It
   is trusted, which is exactly what makes a stale line expensive.
3. **Read `docs/learnings/stage-implementation-101.md` before porting anything**, and
   `web/PATTERNS.md` before designing a single panel. The default is not a paragraph — it
   is something the reader clicks. A stage that is only prose blocks is the anti-pattern.
4. **Cold-reader pass on `docs/15-observability.md` first** (D-54,
   `docs/learnings/cold-reader-testing.md`). It validates the doc *before* the port
   starts, not after. Stage 15's doc has never been assessed.

---

#### Stage 15 — what you need before you start

Measured 2026-09-08. Re-check anything you are about to act on.

- **`docs/15-observability.md` is 261 lines**: 6 `##` sections and 9 `###` subsections.
  The teachable spine is *Three things in order of value · Errors that are actually
  useful · Structured logs · The four signals · Health checks · Alerts you will not learn
  to ignore · Uptime monitoring from outside · Dashboards*, then Artifacts, Definition of
  done, Scaling to a team, Traps. That is more subsections than fit four-to-six `Step`
  objects, so grouping is a real design decision, not bookkeeping.
- **The doc has no `### AI in observability` section, and it needs one.**
  `stage-metadata.test.ts` fails any `ready: true` stage whose doc lacks that heading, so
  the port cannot land without writing it. Stage 11's round wrote its AI section and then
  expanded it 4→8 plays; budget for authoring, not transcribing. **None of the seven
  remaining stage docs has one** — this is true for every future port, not just this one.
- **`references.ts` has zero entries for `15-observability`.** Every ported stage so far
  carries references; this one starts empty, so gathering them is part of the round.
  `terms.ts` already has 3 terms pointing at the stage.
- **`stages.ts` has it `ready: false`**, blurb "Know something is wrong before your users
  tell you.", timing "Errors on day one; the rest grows continuously." Note the cadence:
  observability never stops, so any framing that implies a finished checkpoint fights the
  playbook's central claim.
- **The three-file registration is one atomic operation** — `stages.ts` (`ready: true`),
  `stage-content.ts`, `step-ids.ts`. Do it in the assembly task, not the scaffold task.
- **Panel content is testable now.** `Element.prototype.scrollIntoView` is stubbed in
  `src/test/setup.ts`. Before that, any test activating a step other than the first threw
  from inside a `Stepper` effect, which is why stage 14's component test had six tests
  that only ever inspected the rail. Write real panel assertions; and assume other stages'
  component tests still carry that blind spot.

#### What shipped in the session before this one (2026-09-07)

Four branches, all merged `--no-ff`, all deleted, each re-gated on the merged result.

- **`6f52212`** — `ci-cd` reference sheet (W-6.3m), the registry's third concept/tool
  split. Opened TD-44 and TD-45.
- **`99f6145`** — **TD-45 closed.** The audit's overflow, touch-target and step-hash
  sweeps asserted *inside* their path loop, so the first failure threw and the rest went
  unmeasured; nine sheets had never been checked at 320px. All sweeps now collect and
  assert once. **The audit reads 18/18 for the first time** — it said 17/18 for weeks, and
  that number was never what it appeared to be.
- **`4fdb9bd`** — `ci-cd` expanded 4→7 sections, 24→49 rows (W-6.3n), after the sheet
  shipped without using its two densest sources.
- **`a8f56de`** — **stage 14's coverage walk**, the one shipped stage that never had one.
  12 of 16 doc sections covered; five gaps fixed, one finding downgraded and one rejected
  on verification.

**All four merged without a whole-branch review**, on the user's call. Every previous
review in this repo found something a green gate did not.

**1161 tests across 160 files, build clean, e2e 18/18.** `pnpm test:dev-console` has not
run since 2026-09-07 — a `next dev` server was occupying :3200 and Next refuses a second
for the same directory. Run it once this round; it is the only thing that sees React's
development warnings.

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
- **1161 tests across 160 files**, build clean, **e2e 18/18**. `test:dev-console` is
  **unrun since 2026-09-07**, not passing — do not quote a number for it. The
  long-standing "17/18, 1 pre-existing" is closed: the overflow was real and is fixed,
  and TD-45 — the reason the other 320px results were unknown rather than merely
  unreported — is closed too. An earlier kickoff quoted 1143 here, which was already
  wrong when written; that is the habit step 2 exists to break.
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

**Measured 2026-09-08 at handoff.** `develop` and `origin/develop` are **identical** at
`10b1f6b` — the user pushed after the last merge. `develop` is **43 commits ahead of
`main`** (`d659d32`), so a promotion is pending and it is the user's to make. `main` is 2
ahead of `develop`, which is just its own `--no-ff` merge commits.

A version of this paragraph two sessions ago was wrong, claiming `develop` was "well
ahead of `origin/develop` (the user has not pushed since several rounds ago)" when the
two were identical. That is why every number here is measured at handoff rather than
carried forward, and why step 2 at the top says to re-derive.

**No branch is in flight, and the tree is clean.** All four branches from 2026-09-07
merged `--no-ff` and were deleted: `feat/ci-cd-cheatsheet` as `6f52212`,
`fix/audit-fail-fast` as `99f6145`, `feat/ci-cd-sheet-expansion` as `4fdb9bd`,
`fix/stage-14-coverage-walk` as `a8f56de`. Each merged result was re-gated first-hand —
lint 0, typecheck 0, 1161/160, build clean, audit 18/18.

**Two stale branches predate all of this and were deliberately not touched**:
`docs/2026-08-12-stage-04-spec` and `feat/stage-03-standard-practices`. Check whether
they are merged before assuming either is safe to delete. Not this round's job.

**All four merged without a whole-branch review, on the user's call.** Every previous
branch's review in this repo found something a green gate did not, so treat that code as
less checked than usual if you touch it.

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
  - **`pnpm test:dev-console` has not run since 2026-09-07.** It needs its own dev server
    and refuses to start while another `next dev` holds the same directory — the user had
    one on :3200. Ask them to stop it rather than killing their process. It is the only
    thing that sees React's development warnings, and it found a real bug on its first run.
  - **Four branches merged unreviewed on 2026-09-07** (`6f52212`, `99f6145`, `4fdb9bd`,
    `a8f56de`). None got the whole-branch pass the standard calls for.
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
  - ~~**TD-44**~~ — **closed 2026-09-08.** Gathered originals in `reference/` are
    committed, deliberately, and both records now say so. The consequence to remember:
    **anything parked in `reference/` is one `git add -A` from a public repo.** Do not
    leave unrelated files there.
  - ~~**A green `pnpm test:e2e` is not a claim about every page**~~ — **closed
    2026-09-07 as TD-45.** Every sweep now collects across the whole path list and
    asserts once, so a run names every bad path instead of the first. Worth knowing why
    it mattered: nine sheets had never been measured at 320px, and all nine turned out
    clean, so the fix bought *known-good* rather than a pile of new bugs. **Keep the
    rule when adding a sweep**: assert after the loop, never inside it.
  - **Three claims in the records were wrong when written, all found by re-deriving.**
    A test count (`1143` against a real `1152` at the time), the originals-are-untracked
    claim (TD-44), and two rows saying "NOT merged" about branches merged weeks earlier.
    Re-run the query; never copy the answer forward.
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
