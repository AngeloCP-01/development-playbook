# Kickoff — Development Playbook

**Next-session handoff, 2026-10-15: Stage 10 — Documentation.** The user selected
chapter review/corrections first, followed by the interactive port. Both phases
are unstarted. Stage 09's references merged as `9de6c99`; the single-example
width repair merged as `79f9e31`. W-3 is **15/18**, and W-6 is **22 drawn / 27
registered**.

Open the next session in `/Users/angelito/personal/Development-Playbook`.
The Stage 09 worktree has been removed. Read task **W-3.17**, tracker **Next up**
and `docs/10-documentation.md`. This refresh is on
`docs/2026-10-15-stage-10-kickoff`, based on develop `79f9e31`; check whether it
has been merged before choosing the Stage 10 work branch. No Stage 10 spec,
plan, chapter correction or port has been written in this refresh.

Refresh Project state and Branch state before reusing this paste-buffer.

---

## Paste this into the new session:

I'm continuing the Development Playbook: eighteen markdown stage documents and a
Next.js static site that turns them into something you consult rather than read.
The user selected **Stage 10 — Documentation**, starting with the canonical
chapter review and corrections, then its interactive port. The playbook is also
a learning tool, so a stage must teach decisions rather than only name them.

Read these before starting:

- `AGENTS.md` and `CLAUDE.md`: delivery loop, branch conventions, review and TDD.
- `docs/learnings/branch-discipline-101.md` before touching git; then
  `docs/learnings/plans-are-unverified-101.md` before writing a plan.
- `docs/task.md`, **W-3.17**; `docs/tracker.md`, **Next up**. Search older decisions
  by ID across the live files and their archives rather than reading them whole.
- `docs/10-documentation.md`: canonical prose for this round.
- **D-39** and **D-54** in `docs/tracker.md`, plus the ADR/G9 boundary in
  `docs/stage-03-status.md`. ADR format belongs to Stage 10; cold-reader review
  belongs before the port. Verify what the chapter already teaches before
  calling something a gap.
- `docs/learnings/stage-implementation-101.md` for the chapter/port workflow.
- Before port design: `web/PATTERNS.md`, `web/DESIGN.md` and the reference
  implementation. Before framework code: `web/AGENTS.md` and the relevant
  installed Next.js documentation under `web/node_modules/next/dist/docs/`.

### Project state (verified 2026-10-15; recheck before work)

**W-3: 15/18 interactive.** Stages 01–09 and 11–16 are ready. Stage 10 is selected;
17 and 18 remain separate. Stage 10 is still `ready: false`, and its route renders
the existing placeholder. Stage numbers are filing codes: documentation runs
continuously alongside the other work.

**W-6: 22/27 drawn.** Stage 09 caching/scaling references merged as `9de6c99`
with ordered primary/supporting citations. The five language placeholders are
JavaScript, Python, Java, Spring Boot and Express/Node. W-6.4 glossary/stack
surfacing remains open. Stage 09 reference work is complete.

**Latest source baseline: develop `79f9e31`.** The approved no-ff width-repair
merge contains fix `e97c97c` and records `c4fb495`. A single code sample fills
its description column; paired examples retain their comparison layout.
Post-merge format, lint, generated-route typecheck and **1496/1496 tests across
207 files** passed. The merged tree equals the reviewed tip; its fresh production
build/audit **24/24**, development-console audit **1/1** and **28 geometry
observations** remain applicable. The feature branch was deleted. The development
check used the verified existing dev server on port 3200 after the standard
3101 startup hit its lock; that user-owned server was left running.

Evidence, consulted only when the new scope overlaps it:

- [Width repair report](docs/superpowers/reports/2026-10-15-reference-example-width.md).
  Raw merged checks: `.superpowers/sdd/2026-10-15-reference-example-width/merged-state.json`.
- [Stage 09 reference execution](docs/superpowers/reports/2026-10-13-stage-09-reference.md).
  Reference merge `9de6c99` passed **1495/1495 across 207 files** and a **52-page
  build**. All 224 evidence files were preserved before worktree removal;
  post-merge logs remain under
  `.superpowers/sdd/2026-10-13-stage-09-reference-evidence/integration-2026-10-14/`.
- [Stage 09 port execution](docs/superpowers/reports/2026-10-08-stage-09-interactive-port.md)
  and [whole-branch review](docs/superpowers/reports/2026-10-12-stage-09-whole-branch-review.md).
  Port merge `7a5576a` completed W-3.16. Its chapter merged as `ad283ce`.

**Start here, in order:**

1. Check the checkout and refs. This handoff is in the parent repository on
   `docs/2026-10-15-stage-10-kickoff`. If that records branch is not integrated,
   finish its separately approved merge before cutting the Stage 10 work branch.
   Create the Stage 10 branch from develop; keep edits off develop and main.
   Preserve the user's untracked `image.png` and any running dev server.
2. Re-derive the registry counts and Branch state below. Fetch only if fresh
   remote state matters. Tracked refs are snapshots, not a deployment check.
3. Start **W-3.17's chapter phase** through brainstorming: agree the review scope,
   then the chapter-phase spec/plan and cold-reader checks. Use a foreign scenario
   for completeness and a heading-only consultability pass; preserve that scenario
   for the correction recheck. Read D-39 and D-54 before designing ADR exercises.
4. Correct verified chapter findings and recheck them before specifying the port.
   Recommended: chapter first, port second, so content corrections are established
   before being copied into React. Only the port's actual plan can justify an
   execution-method recommendation; retain per-task and final whole-branch review.
5. Keep stages 17/18, W-6.4, language sheets, new reference companions and unrelated
   shared repairs outside this round unless the user expands scope. Every merge
   needs approval; the user handles pushes and promotion to main.

The current session prepared records only. It did not start Stage 10's chapter
review, approve its future spec/plan, register the stage or change the W-3 count.

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
  it found three blocking issues the green gate missed. Use an independent
  reviewer; see `CLAUDE.md` → *Subagent models*.
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
git log -1 --oneline HEAD
git log -1 --oneline develop
git log -1 --oneline origin/develop
git log -1 --oneline main
git log -1 --oneline origin/main
git rev-list --left-right --count origin/develop...develop
git rev-list --count main..develop
git rev-list --count develop..main
git status --short --branch
git ls-files reference/ | rg -iv "jpeg|jpg|png|webp|gif|\.md$"
```

Fetch first if you need to compare against the current remote; otherwise the
`origin/*` lines above describe the last fetched refs.

**Source baseline at this refresh:** local develop and tracked origin/develop
both `79f9e31`, **0 ahead / 0 behind**. This documentation branch starts there;
records commits and its future approved merge may follow. Query the actual tip
rather than treating the source baseline as the new session's HEAD.

Local main is `d659d32`, **236 commits behind / 2 ahead** of develop at that
source baseline. Tracked origin/main is `873c9d2`; it contains reference merge
`9de6c99` but not width-repair merge `79f9e31`. Local main and origin/main differ;
neither these counts nor a merge into develop proves what is deployed. No fresh
fetch or deployed smoke test ran during this records refresh.

The old `docs/2026-10-14-stage-09-reference-merge-records` branch remains separate;
this handoff supersedes its current-status text. Do not resume its obsolete
Stage 09 integration checkpoint or the deleted feature worktree. No other branch
is being merged or deleted by this refresh.

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
    The sheet has no plate. Check current remote/deployment state before
    making a publication claim.
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
