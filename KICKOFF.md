# Kickoff — Development Playbook

**Next-session handoff, 2026-10-13:** Stage 09's interactive port merged locally
into `develop` as `7a5576a`. W-3 is **15/18**, W-6 is **20 drawn / 25 registered**.
The user selected **W-6.3q: Stage 09 caching/scaling lookup companions** next.
Their sources are gathered; sheet implementation has not started.

Open the next session in `/Users/angelito/personal/Development-Playbook`.
Read task W-6.3q and the current tracker Next up entry, then
[the Stage 09 source audit](reference/stage-09-performance-sources.md).
The completed port's local branch and worktree are removed; its evidence is
preserved. Recheck current refs before creating the next work branch.

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

### Project state (verified 2026-10-13; recheck before work)

Stages 01–09 and 11–16 are interactive on local
`develop` (**15/18**); 10, 17 and 18 remain. Stage 08's port merged as `a03e190`. W-6 has **20 of
25** registered sheets drawn, including Stage 08's `security` sheet, merged
as `739c8ed`. Stage 09's revised chapter and source audit merged as
`ad283ce`; its twelve-panel port merged as `7a5576a` on 2026-10-12.

The Stage 09 chapter opens with an order journey and teaches the first
measurement before any fix. It separates browser checkout latency, payment
visibility, provider and webhook intervals, and the three `OrderPaid` consumers.
The worked 20-item cart and 21 inventory queries are illustrative, not live
measurements. A cold-reader pass and whole-branch review found and resolved
timeout-denominator and user-clock gaps. The raw evidence and deferrals are in
`docs/superpowers/reports/2026-10-08-stage-09-chapter.md`.

**W-3.16 is complete.** All eight implementation tasks and verification fixes
passed independent review; the final whole-branch review returned Ready to merge.
The merged tree passed **1459 tests across 198 files**, format/lint/typecheck
and a fresh **50-page build**. The application tree matches reviewed `c8b7349`;
its pre-merge production audit **24/24**, development-console audit **1/1** and
574 measured observations remain evidence for that unchanged application.
Those browser suites were not repeated after merge.
The [final verification](docs/superpowers/reports/2026-10-09-stage-09-final-verification.md)
retains gate output and chapter coverage. The completed
[execution report](docs/superpowers/reports/2026-10-08-stage-09-interactive-port.md)
retains raw TDD and teeth evidence. Consult the
[whole-branch review](docs/superpowers/reports/2026-10-12-stage-09-whole-branch-review.md)
only if a new scope overlaps a recorded deferral. Raw merged-tree output remains
in `.superpowers/sdd/2026-10-08-stage-09-interactive-port/merged-verification.md`.

**Next round: W-6.3q.** Start from
`reference/stage-09-performance-sources.md` and `reference/cheatsheet-sources.md`,
with `docs/09-performance-optimization.md` as the chapter boundary. Neither
`caching` nor `scaling` is in the registry, so adding drawn sheets changes both
the drawn count and the total. Five registered language sheets and W-6.4
glossary/stack surfacing remain separate.

Recommended approach: define caching first because it directly supports
Stage 09's measured-fix exercise, then bound scaling as an infrastructure
lookup. Keep application-cache invalidation distinct from CDN freshness.
Stage 09's team-scaling section does not prescribe load balancing as a routine
fix. Prefer original diagrams if needed; no gathered image has been selected
or cleared for publication.

The sheet boundaries and spec/plan need approval before implementation. Use
brainstorming first, recheck the gathered first-party sources, and choose the
execution approach after the plan exists. The earlier Subagent-Driven choice
applied to the completed port. Read the existing reference renderer/data types,
`web/PATTERNS.md`, `web/DESIGN.md` and `web/AGENTS.md` before writing web code.
The site has no order backend; measurements in examples remain hypothetical.

**Start here, in order:**

1. **Check the branch before editing anything.** The merged checkout is on
   `develop`; create a work branch before the next edit, as branch discipline
   requires.
   If the answer is `main`, stop and read `docs/learnings/branch-discipline-101.md`.
2. **Re-derive every number in this file before trusting it.** Run the
   commands under "Branch state"; fetch only if remote state matters. This
   file has a documented history of being wrong about numbers.
3. **Run the two one-line checks that belong at every refresh:**
   `rg -n "NOT merged, NOT pushed, NOT deployed" docs/tracker.md` and
   `git ls-files reference/ | rg -iv "jpeg|jpg|png|webp|gif|\.md$"`.
   The reference check must return nothing. The tracker currently has one
   historical struck-through hit in its 2026-09-08 W-3.12 row; verify that
   every hit is struck through and immediately corrected, not a live status.
4. **Begin W-6.3q with brainstorming.** Confirm the caching/scaling lookup
   boundaries from the gathered sources, then write the spec and plan. The
   Stage 09 port's eight tasks, fixes, final review and live checks are complete;
   use their reports as evidence rather than redispatching the port plan.
5. **Keep W-6.4 separate.** Glossary and stack surfacing remains open; ask
   before any future merge into `develop`, and never merge or push to `main`.

---

#### The condensed history (01–09, 11–16, the reference hub)

Full detail lives in `docs/tracker.md` and `docs/tracker-archive.md`; grep them by ID.

- **Stages 01–09 and 11–16 are interactive on local `develop`.** 03 is 22 steps, 04
  is 15, 05 is 13, 06 is 8, 07 is 6, 11 is 8, 12 is 6, 13 is 8 (platform-aware), 14 is 6,
  15 is 16 (after the D-52 reshape), and 16 is 14; Stage 08 is 10 and Stage 09 is 12.
  Coverage walks ran on 03–06, 09 and 11–14. Stages 10, 17 and 18
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
  `--max-warnings 0`, vitest in two projects, `test:e2e` (24-test Playwright audit),
  `test:dev-console` (outside the gate, once per stage round — TD-35, D-84).
- **The Stage 09 chapter merge passed 1416 tests across 185 files** on local
  `develop` (2026-10-08). Branch format, lint, typecheck and production build
  were green. The port's browser and development-console audits passed on its
  feature branch on 2026-10-09; see the current evidence above.
- **The e2e per-test timeout is 120s, not 60s** (`playwright.config.ts`, `2bb64e9`) — an
  18th stage in the sweep pushed WCAG AA and the disclosure sweep over the old budget;
  this is a repo-wide headroom fix, unrelated to stage 15's own content.
- **Deployed**: `W-5` complete, live at https://acp-dev-playbook.vercel.app since
  2026-08-11. `pnpm test:prod` verifies the deployment, outside the merge gate.

---

#### Branch state — re-derive before work

```bash
git log -1 --oneline develop
git log -1 --oneline origin/develop
git log -1 --oneline main
git rev-list --count origin/develop..develop
git rev-list --count main..develop
git rev-list --count develop..main
git status --short --branch
git ls-files reference/ | rg -iv "jpeg|jpg|png|webp|gif|\.md$"
```

Fetch first if you need to compare against the current remote; otherwise the
`origin/*` lines above describe the last fetched refs.

**Snapshot before the records merge, 2026-10-13:** local `develop` is
`7a5576a`, 65 commits ahead of tracked `origin/develop` (`377c734`), and
209 ahead of `main`; `main` (`d659d32`) is 2 ahead of `develop`. No fresh fetch
was performed. The user authorized merging the records branch
`docs/2026-10-13-stage-09-w6-handoff`, including this kickoff refresh, into
local `develop`. Its merge SHA and resulting ahead counts must be queried
using the commands above after integration. The user previously pushed the
port feature through `adb2030`; this records merge authorizes no push or deploy.

The planning branch `docs/2026-10-08-stage-09-port-design` remains at `112aa42`.
The separate handoff branch's scope was reconciled without merging that branch.
The parent checkout's untracked `.pnpm-store/` cache is left in place.

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
- **Tracked and deliberately parked**: `reference/10-sql-concepts.md` and
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
  - **`sql-reference`/`api-reference` still parked**, tracked drafts
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
