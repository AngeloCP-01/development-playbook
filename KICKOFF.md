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
  **Read `branch-discipline-101.md` first, before touching git at all** — the mistake it
  documents happened twice in the session just before this one, the second time right
  after the first had been written up. `stage-implementation-101.md` (layout traps,
  verification checklist, and now the worked-example pattern for teaching a list of
  steps) and `quality-gates-101.md` (now including "two gates agreeing can mean they
  share a blind spot, not that the change is safe") both bear directly on stage 06.

### Project state (as of 2026-08-25 — **stage 05 is interactive and merged**; W-3 is
**5/18**, thirteen stages remain. **Stage 06 (Testing) is chosen as the next W-3 round
and has not been started.** TD-43 is closed and merged. W-6 (reference hub) resumed and
shipped four rounds this session.)

**Start here, in order:**

1. **Check the branch before editing anything.** `git branch --show-current`. If it says
   `develop` or `main`, branch first (`git checkout -b feat/stage-06-...`). This bit twice
   in the session that just ended — see `docs/learnings/branch-discipline-101.md`.
2. **Stage 06 is the chosen next round, not yet started.** Read `docs/06-testing.md`,
   then `docs/learnings/stage-implementation-101.md` in full before porting anything —
   it now carries the worked-example lesson from `sdlc` on top of the stage 04/05 coverage
   walk method.
3. Run `git fetch` and re-derive `develop`'s position against `origin/develop` and
   `origin/main` — the exact commands are in "Branch state" below. Do not trust any commit
   SHA quoted in this file; every version of this paragraph has gone stale.

---

#### What shipped since the last kickoff

**TD-43 is closed and merged**, `ee98d52`, `--no-ff`. The React dev-mode key warning was
a false positive in React's own key-validation bookkeeping, not a missing key —
`Fragment key="content"` in `Stepper.tsx`. Full account: `docs/tracker.md`'s TD-43 row,
decision **D-87**. Two whole-branch reviewers ran on it; the code was right, three
records-level findings were fixed. Not open work — do not re-scope it.

**W-6 (reference hub) resumed on a per-stage cadence, by explicit user override of the
2026-08-14 pause** (**D-88**). The standing rule now: after a `W-3` stage ships, check
for related reference material and run a bounded W-6 round before picking the next stage
— not instead of picking it. Four rounds ran this session:

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

`coding-standards` is now down to one section (code smells) with room to grow. Fourteen
`/reference/*` routes are registered, **nine drawn** (`architecture-patterns`,
`design-patterns`, `api-design`, `solid-principles`, `clean-code`, `git-commands`,
`git-branching`, `coding-standards`, `sdlc`) and five still empty (the language sheets).
Every round above was gated first-hand on the merged result, not inferred from the
branch: lint 0, typecheck 0, 667 tests / 84 files, build clean, audit 18/18.

**Still open in W-6, unclaimed:** naming conventions in `coding-standards` (the one
gathered source was Godot/GDScript-specific, wrong domain); `sql-reference` and
`api-reference` (hand-written drafts already exist — `reference/10-sql-concepts.md`,
`reference/rest-api-best-practices.md` — gathered without an image, still untracked,
still unregistered); the five language sheets (`javascript`, `python`, `java`,
`spring-boot`, `express`); `containers` (Docker/Kubernetes), deliberately not gathered
since it tethers to stage 11, which has no interactive port yet. Attribution is
unrecorded on most sources gathered this session — real per **D-63**, fix before
promoting past `develop`.

**A branch-hygiene mistake happened twice in this session, on the same day, the second
time right after the first was fixed and written up.** Read
`docs/learnings/branch-discipline-101.md` before starting stage 06 — the fix is checking
`git branch --show-current` before the first edit of every new round, especially right
after a merge, not remembering a rule.

---

#### The condensed history (03/04/05, TD-43, the four-debt round)

Full detail lives in `docs/tracker.md`; this is what a new session needs without
re-reading the whole log.

- **Stages 01–05 are interactive and merged.** 03 is 22 steps, 04 is 15, 05 is 13. Each
  port's coverage map: `docs/stage-03-status.md`, `-04-status.md`, `-05-status.md`.
  Stages 06–18 render a "sheet not drawn" placeholder; routing works for all 18.
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

**Last measured at the end of this session**: `develop` and `origin/develop` were
**level**, both at `73ba558` — the user pushed at some point during the session; this
file's draft assumed unpushed until re-checked and was wrong. `origin/main` was untouched
by anything in this session, so `develop` is still ahead of production by everything since
the last promotion. **No branch was left in flight** — the last merge
(`feat/sdlc-worked-example`) completed, was gated on the merged result, and the branch was
deleted. If this file is more than a session old, treat every number in this paragraph as
wrong until re-derived — that has been true of every prior version of this paragraph,
without exception, including the number this replaced within the same session.

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
  - **Cold-reader testing** (`docs/learnings/cold-reader-testing.md`) validates a stage
    doc before the interactive port starts, not after (D-54).
  - **Cite doc sections by heading, never by line number** (D-42) — nothing in the gate
    can detect a stale line-number citation.
  - `docs/learnings/contrast-checkers-lie.md` — read before changing a token in response
    to a contrast number; three reported failures in this repo were the checker.
  - `docs/learnings/rules-measure-the-wrong-thing-101.md` — a rule can be right about what
    it cares about and wrong about what it counts; measure before capping anything with a
    number.
