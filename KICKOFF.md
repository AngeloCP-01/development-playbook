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
  in both `docs/task.md` and `docs/tracker.md` and was believed for a full day, by a
  session that had no reason to doubt it, until an unrelated `git log` surfaced the
  merge commit sitting in `develop`'s own history the whole time. `stage-implementation-101.md`
  (worked-example teaching pattern) and `quality-gates-101.md` (gate blind spots) both
  bear on whichever stage comes next.

### Project state (as of 2026-08-28 — **stage 06 is interactive and merged**; W-3 is
**6/18**, twelve stages remain. **Stage 07 (Code Review) is chosen as the next W-3
round and has not been started.** TD-43 is closed and merged. W-6 (reference hub) has
shipped six rounds since 2026-08-24, most recently a second `clean-code` section.)

**Start here, in order:**

1. **Check the branch before editing anything.** `git branch --show-current`. If it says
   `develop` or `main`, branch first. This bit twice in one session two days ago — see
   `docs/learnings/branch-discipline-101.md`.
2. **Before trusting anything this file says about merge status, run `git log`
   yourself.** The previous version of this exact file was itself wrong about stage 06
   being unmerged, for a full day, because nobody re-derived it — see
   `docs/learnings/decisions-need-tests-101.md`'s newest section. This file is a starting
   point, not a source of truth for git state.
3. **Stage 07 (Code Review) is the chosen next round, not yet started.** Picked over 08
   (Security Audit), 09 (Performance Optimization) and 10 (Documentation) on the same
   grounds stage 04 was picked over 15 — shortest doc of the four (196 lines) and the
   natural adjacency from 06 in the daily loop, not the next integer by default. Read
   `docs/07-code-review.md`, then `docs/learnings/stage-implementation-101.md` in full
   before porting anything — it carries the worked-example teaching pattern and the
   coverage-walk method, now proven on three stages running.
4. Run `git fetch` and re-derive `develop`'s position against `origin/develop` and
   `origin/main` — the exact commands are in "Branch state" below. Do not trust any commit
   SHA quoted in this file; every version of this paragraph has gone stale, including the
   one two sessions ago that got a whole stage's merge status wrong.

---

#### What shipped since the last kickoff

**TD-43 is closed and merged**, `ee98d52`, `--no-ff`. The React dev-mode key warning was
a false positive in React's own key-validation bookkeeping, not a missing key —
`Fragment key="content"` in `Stepper.tsx`. Full account: `docs/tracker.md`'s TD-43 row,
decision **D-87**. Two whole-branch reviewers ran on it; the code was right, three
records-level findings were fixed. Not open work — do not re-scope it.

**Stage 06 (Testing) is interactive and merged**, `cad21c1`, `--no-ff`, 2026-08-27, by a
session this kickoff has no other record of — 28 commits, eight panels
(`docs/06-testing.md`, 316 lines, ported to `web/src/features/testing/`), a context-starved
coverage walk that found ten problems against an already-green gate (the third time that
exact check has earned its place — stage 04 found five, stage 05 found ten), and two new
decisions: **D-92** (a panel over the 4.0 ceiling splits along the doc's own section
boundaries rather than compressing further) and **D-93** (a data-module test asserting
only against the source doc, never an app export, is vacuous by construction). Full
account: `docs/tracker.md`'s W-3.6 row. **This merge sat unnoticed in two status files for
a full day** — see the correction note below and
`docs/learnings/decisions-need-tests-101.md`. `docs/stage-06-status.md` has the coverage
map. Stages 07–18 render a "sheet not drawn" placeholder now, not 06–18.

**A stage's merge status went stale in `docs/task.md` and `docs/tracker.md`, and stayed
wrong for a full day.** Both files said stage 06 was "not yet merged" after `cad21c1` had
already landed in `develop`. A new round the next day, working from those two files
(this kickoff among them, at the time), believed it too and opened its own content
framed around a port that had actually shipped the day before. Caught by an unrelated
`git log`, not by process. Corrected in both files with the correction stated plainly,
and the round that had already started from the wrong belief left its own framing
uncorrected with a note attached, rather than silently rewritten. Full account:
`docs/learnings/decisions-need-tests-101.md`'s newest section. **The rule going forward:
before trusting any "merged"/"not merged" claim, including in this file, check
`git log` directly.**

**W-6 (reference hub) resumed on a per-stage cadence, by explicit user override of the
2026-08-14 pause** (**D-88**). The standing rule now: after a `W-3` stage ships, check
for related reference material and run a bounded W-6 round before picking the next stage
— not instead of picking it. Six rounds have run since 2026-08-24:

- **W-6.3a** — six of the original ten empty cheatsheets drawn: `design-patterns` (all 23
  GoF patterns), `api-design` (fifteen-step roadmap condensed to six sections),
  `git-commands`, `git-branching`. Plus `sdlc`, a seventh sheet not in the original ten,
  untethered to any stage.
- **W-6.3b** — a fifth `CheatsheetGroup`, **Design Principles**, split out of
  `coding-standards` (**D-90**, superseding **D-89**'s premise within the same round):
  `solid-principles` and `clean-code`, each with real before/after code examples via a
  new `Row.example` field. Real syntax highlighting via Shiki (**D-91**) — a restrained
  four-role palette designed through `/impeccable`, one new token (`--syntax-string`),
  everything else reusing existing tokens per this app's own "accent means attention,
  semantic colours carry meaning and nothing else" rule. **Highlighting runs at generate
  time** (`pnpm gen:highlighted`), not import time — a top-level-await attempt passed
  `pnpm test` and `next build` but broke `pnpm test:e2e` outright, because Playwright's
  test transform cannot parse top-level await. `docs/learnings/quality-gates-101.md` has
  the full account, plus a second instance of the same class found one commit later
  (`.prettierignore` needed extending to the one generated `.ts` file in this repo).
- **W-6.3c / W-6.3d** — `sdlc` expanded twice at the user's direction: first with a
  concrete deliverable per phase and a Waterfall/Agile/DevOps comparison section, then
  rewritten again to thread **one running example** (adding password reset to a small
  app) through all seven phases, because naming deliverable types is not the same as
  teaching what they contain. `docs/learnings/stage-implementation-101.md` has the
  general lesson.
- **W-6.3e** — `testing` and `playwright`, both tethered to stage 06 (built the day
  before this round started, though the round did not know that yet — see the
  correction above). `testing` covers the five types plus the pyramid concept, sourced
  from a graphic and a matching dev.to article by the same author — the first
  cheatsheet source in this registry with a real URL from day one. `playwright` is a
  tool-specific companion, the same split `git-commands`/`git-branching` already use,
  grounded in a real test name quoted from `e2e/audit.spec.ts`. Two converted assets
  were deleted rather than shipped — `public-assets.test.ts` caught them as orphaned,
  the first time that check has fired in this registry.
- **W-6.3f** — a second section on `clean-code` (SOC, DYC, TDD, YAGNI), from a second
  gathered source (Neo Kim), consulted rather than displayed as a second plate (D-89
  again). Cross-references `solid-principles` and the new `testing` sheet rather than
  repeating them.

`coding-standards` is now down to one section (code smells) with room to grow. Sixteen
`/reference/*` routes are registered, **eleven drawn** (`architecture-patterns`,
`design-patterns`, `api-design`, `solid-principles`, `clean-code`, `git-commands`,
`git-branching`, `coding-standards`, `sdlc`, `testing`, `playwright`) and five still
empty (the language sheets). Every round above was gated first-hand on the merged
result, not inferred from the branch: lint 0, typecheck 0, 754 tests / 100 files, build
clean, audit 18/18.

**Still open in W-6, unclaimed:** naming conventions in `coding-standards` (the one
gathered source was Godot/GDScript-specific, wrong domain); `sql-reference` and
`api-reference` (hand-written drafts already exist — `reference/10-sql-concepts.md`,
`reference/rest-api-best-practices.md` — gathered without an image, still untracked,
still unregistered); the five language sheets (`javascript`, `python`, `java`,
`spring-boot`, `express`); `containers` (Docker/Kubernetes), deliberately not gathered
since it tethers to stage 11, which has no interactive port yet. Two gathered images
also sit unclaimed for any registered sheet: `JWT.png` and `reverse-proxy.jpg`, neither
testing-related. Attribution is unrecorded on most sources gathered across these
rounds — real per **D-63**, fix before promoting past `develop`.

**A branch-hygiene mistake happened twice in one session two days ago, the second time
right after the first was fixed and written up** — `docs/learnings/branch-discipline-101.md`.
It was nearly a third time this session: an edit landed on `develop` right after a merge,
caught before it was committed. The fix is checking `git branch --show-current` before
the first edit of every new round, especially right after a merge, every single time —
not remembering a rule, and not trusting a prior write-up to have fixed it.

---

#### The condensed history (03–06, TD-43, the four-debt round)

Full detail lives in `docs/tracker.md`; this is what a new session needs without
re-reading the whole log.

- **Stages 01–06 are interactive and merged.** 03 is 22 steps, 04 is 15, 05 is 13, 06 is
  8. Each port's coverage map: `docs/stage-03-status.md` through `-06-status.md`.
  Stages 07–18 render a "sheet not drawn" placeholder; routing works for all 18.
- **A per-task reviewer subagent, plus a whole-branch review, is the standard** — every
  reviewed round has found something a green gate did not (fourteen blocking defects on
  stage 03, seven more at whole-branch; four on stage 05 including a false claim a
  per-task fix had introduced). The one round that skipped review (the four-debt round)
  is flagged in `docs/tracker.md`'s Process observations as less checked than the rest.
  **The same session cannot self-review.**
- **A coverage walk, blind to the branch's own plan and reports, finds real gaps a green
  gate and clean per-task reviews cannot see** — five on stage 04, ten on stage 05.
  `docs/learnings/stage-implementation-101.md` has the method. Budget a fix wave after it;
  treat it as the middle of the round, not the end.
- **Glossary and stage metadata are single-sourced** (D-36): terms live in
  `web/src/lib/terms.ts` (`pnpm gen:glossary`), never hand-edit `glossary.md`.
- **Quality gates**: prettier (skips markdown and `highlighted.generated.ts` by design),
  eslint at `--max-warnings 0`, vitest in two projects (`unit` node, `dom` jsdom),
  `test:e2e` (18-test Playwright audit, refuses a stale server per TD-27),
  `test:dev-console` (React dev-mode warnings, outside the gate, run once per stage
  round — TD-35, D-84). Re-derive current counts rather than quoting them.
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

**Last measured at the end of this session**: `develop` at `f4da226`, **10 commits
ahead** of `origin/develop` (`cad21c1`, the stage 06 merge — the user has not pushed
since). `origin/main` unchanged at `5d76b8a`, so `develop` is ahead of production by
everything since that promotion. Local `main` is a stale ref, far behind `origin/main`
— `git fetch` first, then reason about `origin/main`, never local `main`. **No branch
was left in flight** — every merge this session completed, was gated on the merged
result, and had its branch deleted. **This exact paragraph was itself the source of a
day-long stale claim two versions ago** (see the correction above) — re-derive before
trusting anything here, including this sentence.

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
  `api-reference`, gathered without an image, not yet registered. Also still parked:
  `docs/superpowers/specs/2026-08-14-reference-hub-design.md`, a Reference-hub design
  taken to four decisions and stopped on which cheatsheet leads slice 1.
- If a round is already scoped, add a per-round sibling — `KICKOFF-W4.md` — rather than
  overwriting this one. The generic version stays useful.
- Open threads worth carrying forward:
  - **Read `docs/learnings/branch-discipline-101.md` before the first commit of any new
    round**, not just once. It documents the same mistake happening twice in one session,
    the second time immediately after the first was written up — the write-up alone did
    not prevent the repeat; only checking the branch, every time, does.
  - **A "merged"/"not merged" claim is a query to re-run, not a fact to reuse** —
    `docs/learnings/decisions-need-tests-101.md`'s newest section. A stage's merge status
    was wrong in two files for a full day, and a session believed it without checking
    `git log`. This file (`KICKOFF.md`) is exactly the kind of document that claim lived
    in — treat its own git-state claims the same way.
  - **Cold-reader testing** (`docs/learnings/cold-reader-testing.md`) validates a stage
    doc before the interactive port starts, not after (D-54).
  - **Cite doc sections by heading, never by line number** (D-42) — nothing in the gate
    can detect a stale line-number citation.
  - `docs/learnings/contrast-checkers-lie.md` — read before changing a token in response
    to a contrast number; three reported failures in this repo were the checker.
  - `docs/learnings/rules-measure-the-wrong-thing-101.md` — a rule can be right about what
    it cares about and wrong about what it counts; measure before capping anything with a
    number.
