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

### Project state (as of 2026-09-02 — **stage 13 (Production Deployment) is interactive and merged**;
W-3 is **9/18**, nine stages remain. **The AWS deployment content expansion is the
recommended next round** — restructure stage 13 into platform-agnostic + platform-specific
steps (Vercel / AWS). The user uses Vercel for personal projects and wants deeper AWS
coverage for work: blue/green, canary, rolling, CodeDeploy, ECS.)

**Start here, in order:**

1. **Check the branch before editing anything.** `git branch --show-current`. If it says
   `develop` or `main`, branch first. This bit twice in one session — see
   `docs/learnings/branch-discipline-101.md`.
2. **Before trusting anything this file says about merge status, run `git log`
   yourself.** The previous version of this exact file was itself wrong about stage 06
   being unmerged, for a full day — see
   `docs/learnings/decisions-need-tests-101.md`'s newest section.
3. **The AWS deployment expansion is the next round.** Stage 13 is interactive and merged
   (six steps, Vercel-focused). The approved design restructures it from 6 → 7 steps:
   - `deploys` — keep (platform-agnostic)
   - `migrations` — keep (platform-agnostic)
   - `vercel` — consolidate old `safety` + `rollback` (skew protection, Vercel rollback)
   - `aws` — **new, deeper**: pipeline (CodeDeploy/ECS/Lambda, GitHub Actions), blue/green
     (ALB target groups, traffic swap), canary/linear (traffic shifting, CloudWatch alarms),
     rolling (ECS `minimumHealthyPercent`/`maximumPercent`), rollback, "costs Vercel hides"
   - `flags` — extract from old `safety` (platform-agnostic)
   - `ai` — update for both platforms
   - `traps` — update with AWS-relevant traps

   **This needs a research pass first** — verify current AWS service specifics (CodeDeploy
   appspec format, ECS deployment controller options, current CLI commands). Then doc
   expansion (`docs/13-production-deployment.md`), then interactive port update. Same
   doc-correction-then-port pattern. Read `docs/learnings/stage-implementation-101.md`
   in full before porting anything.
4. Run `git fetch` and re-derive `develop`'s position against `origin/develop` and
   `origin/main` — the exact commands are in "Branch state" below. Do not trust any commit
   SHA quoted in this file.

---

#### What shipped since the last kickoff

**Stage 13 (Production Deployment) is interactive and merged**, `--no-ff` into
`develop`, 2026-09-02, branch deleted. Seven commits, six panels:
- Annotated expand/migrate/contract SQL artifact (three deploys, one pivot on
  irreversible `DROP COLUMN`)
- DeploymentChecklist (five DoD items, five artifacts, four team notes)
- RevealList for safety nets (skew protection + feature flags)
- AIPlays (four tool plays: generate migrations, dry-run, verify skew, rehearse rollback)
- Eight trap callouts
- Four references (Vercel Rollback, Skew Protection, Prisma Expand/Contract, AWS Strategies)

Doc correction phase preceded the port: `### AI in production deployment` (D-35
mandate), stage added to `AI_SECTION_STAGES`. `'sql'` added to `Artifact.language` union.

Final whole-branch review (opus) returned Ready with fixes — two missing render tests
(DeploymentChecklist + AIPlays), both fixed in one round. One plan defect caught by TDD
(team-note regex didn't match doc's list-item format).

**User feedback**: stage is too Vercel-focused. Approved design for an AWS expansion
round restructuring into platform-agnostic + platform-specific steps.

Previously shipped (same session, before stage 13):
- Stage 12 (Staging) — six panels, PreviewOrStaging scored exercise, coverage walk ran
- `deployment-environments` cheatsheet (W-6.3h) tethered to stage 12

**974 tests across 138 files, build clean, e2e 17/18 (1 pre-existing on
/reference/deployment-environments at 320px), dev-console 1/1.**

---

#### The condensed history (01–07, 12, the reference hub)

Full detail lives in `docs/tracker.md`; this is what a new session needs without
re-reading the whole log.

- **Stages 01–07, 12 and 13 are interactive and merged.** 03 is 22 steps, 04 is 15, 05
  is 13, 06 is 8, 07 is 6, 12 is 6, 13 is 6. Each port's coverage map:
  `docs/stage-03-status.md` through `-06-status.md` (stage 12's walk ran in the same
  session; stage 13's has not). Stages 08–11 and 14–18 render a "sheet not drawn"
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
- **974 tests across 138 files**, build clean, e2e 17/18 (1 pre-existing on
  `/reference/deployment-environments` at 320px).
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

**Last measured at the end of this session**: `develop` well ahead of `origin/develop`
(the user has not pushed since several rounds ago). `origin/main` unchanged. **No branch
was left in flight** — every merge this session completed, was gated on the merged
result, and had its branch deleted. **Re-derive before trusting anything here.**

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
