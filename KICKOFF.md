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
- `docs/task.md` — **only the section for the milestone this round is on** (named in
  *Project state* below); the file is ~19k tokens and the rest of it is not this round
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

### Project state (as of 2026-09-15 — W-3 is **12/18**, six stages remain.
Stages 01–07, 11, 12, 13, 14 and 15 are interactive. Stage 13 is platform-aware (8 steps,
Vercel + AWS). **Eighteen of twenty-three** reference sheets drawn.

**Stage 15 is interactive and complete on its branch, pending review and merge.**
`feat/stage-15-observability-port` (18 commits, `d9b4da2..HEAD`) carries the port:
sixteen steps — ten as planned, plus a mid-verification D-52 reshape that split four
panels the plan had only pre-authorized fixing one of (`docs/tracker.md`'s 2026-09-15
W-3.12 row has the full account). `ready: true`. Final gate on the branch: **179 files /
1348 tests**, expandable count **379**, `pnpm test:e2e` **18/18**, `pnpm test:dev-console`
**1/1, zero React dev-mode warnings**. **Not merged, not pushed, not deployed** — the
whole-branch review (opus, per `CLAUDE.md`) is next, then the user's merge decision.

**Start here, in order:**

1. **Check the branch before editing anything.** `git branch --show-current`. Should be
   `feat/stage-15-observability-port` if picking this branch up, or `develop` if starting
   something new. If the answer is `main`, or a branch you did not expect, stop and read
   `docs/learnings/branch-discipline-101.md`.
2. **Re-derive every number in this file before trusting it.** `git fetch`, then the
   commands under "Branch state". This file has a documented history of being wrong about
   numbers, all found by checking rather than reading. Counts include the commit that
   writes them, and every SHA in this file from before 2026-09-10 was rewritten (D-97).
3. **Run the two one-line checks that belong at every refresh:**
   `grep -n "NOT merged, NOT pushed, NOT deployed" docs/tracker.md` and
   `git ls-files reference/ | grep -iv "jpeg\|jpg\|png\|webp\|gif\|\.md$"`. The second
   found a résumé in the tree on 2026-09-10 (TD-46, D-97). It must return nothing.
4. **The next step for this branch is the whole-branch review**, opus, per
   `CLAUDE.md` → *Subagent models*, covering the full 18-commit diff from `develop`
   (`d9b4da2`) — not just the last few D-52 commits. Fix its findings and re-review before
   asking about a merge. The merge target is `develop`, never `main`, and the merge itself
   is the user's call every time.
5. **If starting fresh work instead**, the next W-3 stage is not yet chosen — see Open
   threads below. Open on Sonnet, medium effort, for routine rounds; Opus for a new
   brainstorm/spec/plan.

---

#### Stage 15 — the fix queue closed, and what the process caught doing it

All seven fix-queue items (I1–I6, M1) are fixed, test-first, on `fix/stage-15-fix-wave`.
Two were verified against the scratch harness at `/private/tmp/stage15-codex-harness/`
rather than trusted from the doc text: the canary now returns `503`/`{"ok":false}` on an
empty result, and the health check's logged error carries `type`/`message`/`stack`
instead of `{}`.

**The D-48 re-run happened, and it did its job.** A fresh cold reader, blind to the
fixes, replayed the exact Loaf scenario and the five lookup questions verbatim. It
confirmed I1–I5 closed with no regressions, and it surfaced one thing the fix queue
hadn't named: Definition of done required a liveness endpoint but no code example
existed for one. Fixed the same way — test first.

**The whole-branch review the mid-round merge owed then found two blocking defects the
fix wave itself had introduced** — this is the pattern D-48 exists to catch, one level
further in: `Sentry.init` was shown in `src/lib/observability.ts`, a module
`@sentry/nextjs` never actually calls it from, so the scrubber would silently never fire;
and the I2 fix logged a database connection string's password to stdout verbatim, in the
same document whose own `SECRETS` list exists to redact that exact pattern out of Sentry.
It also found the test pinning I2 was vacuous — asserted `serializers: {` and
`stdSerializers.err` without checking which *key* they applied to, so reverting to the
original bug (`err:` instead of `error:`) kept the suite green. All three fixed, plus one
untaught Definition-of-done checkbox (withholding a test heartbeat) and seven cheap,
correct minors. A haiku re-review independently confirmed every fix against the diff.

- **`ready` stays `false`.** None of this ports or advances W-3.
- **Guards exist now** for the doc: `stage-15-structure.test.ts` (51 tests) pins section
  order and every fix-queue and review claim; `term-usage.test.ts` and `terms.test.ts`
  cover the glossary additions; `AI_SECTION_STAGES` includes `15-observability` (and
  `11-ci-cd`, which it had been missing while stage 11 was shipped).
- **Not fixed, deliberately** (review's minors this round didn't take, noted in the
  tracker row rather than silently dropped): a breadcrumb code sample, a
  `requestContext.run()` code sample, deletion how-to (stage 08's job), Fly.io named but
  absent from the comparison tables (D-94 scoped this round to Vercel/AWS), and the
  canary's non-timing-safe token comparison.

#### Reference material for stage 15 — five sources registered, ten images still not

`reference/cheatsheet-sources.md` now has an `### Observability` entry (Priority 3,
Task 16, this round): the five text sources that fed the doc's prose (Atatus, Sujeeth
H R, Priya Dharshini, Tenil Sridhar, Kumar), each with title, author, and which section
they fed, plus five more search terms still worth running.

The **ten images** are still committed (`450190c`, rewritten from `c4f2a68`) but **none
is registered and none has provenance** — `reference/cheatsheet-sources.md` requires an
author and a URL at capture time, and a graphic with neither cannot be published. Ask
for the sources before registering any of them. The `observability` sheet stays
untranscribed until that happens.

`AGENTS.md` at the repo root arrived in the same commit: a copy of `CLAUDE.md` addressed
to Codex. It is the user's; leave it, and do not let the two drift without saying so.

> **The hazard TD-44 named fired on 2026-09-08.** The résumé and cover letter were
> committed with `reference/`. The unpushed history was rewritten on 2026-09-10 to take
> them out (D-97); the files are at `~/personal/parked-from-playbook/`, off the repo.
> `.gitignore` now guards the file kinds. The rewritten history is pushed, the backup
> refs are deleted and `gc --prune=now` has run: the blobs no longer exist anywhere
> (`.git` went 64 → 27 MB). Add files by explicit path, never `-A`.

---

#### What this session did (2026-09-10)

A context-budget round for the Max → Pro downgrade, then two merges, then these records.

- **`docs/audits/2026-09-10-context-usage-audit.md`** — 26 sessions and 375 subagent
  transcripts measured. Cache re-reads are 68% of weighted spend, subagents 39%, every
  cuttable plugin about 2%. Ten levers ranked; five applied the same day.
- **Applied outside the repo:** auto-compact on; global default Sonnet at medium effort;
  claude-mem trimmed to 15 observations and skipping shell/read tools; vercel,
  claude-in-chrome, impeccable disabled; the `memory` MCP server removed.
- **Applied in the repo:** `CLAUDE.md` gains the subagent tier table with four quality
  guards, the session → model mapping, and the tracker-archive rule. **`docs/tracker.md`
  is two files now** — closed debt and pre-August rows in `docs/tracker-archive.md`,
  guarded by `tracker-ledger.test.ts` (D-96). This file's read list says grep, never read.
- **Merged to `develop`:** `fix/stage-15-doc-round` (tasks 0–14, 25 commits) and
  `docs/2026-09-10-context-audit` (4 commits). Gate on `develop`: lint 0, typecheck
  clean, format clean, **1207/1207 across 162 files**. `test:e2e` and `test:dev-console`
  not run — nothing under `web/src` renders differently; two test files were added.
- **Found and fixed:** the personal files in history (above). **D-97**, **TD-46**.
- **After the records merged:** worktrees and stale branches cleaned up (above);
  `cv-cover-writer` moved from user scope to `career-ops` (it was a byte-identical
  duplicate); `ui-ux-pro-max` kept on the user's call, 0 uses in 26 sessions
  notwithstanding, and `CLAUDE.md` now says "available" rather than "in regular use".

---

#### What this session did (2026-09-11)

Tasks 15 and 16 of the stage 15 doc round, start to finish, on `fix/stage-15-fix-wave`.

- **Task 15 (the fix wave):** all seven fix-queue items (I1–I6, M1) fixed, test-first,
  RED confirmed then GREEN each time. Two re-verified against the scratch harness at
  `/private/tmp/stage15-codex-harness/` rather than trusted from the doc text.
- **The D-48 re-run:** a fresh cold reader (sonnet, blind to the fixes) replayed the exact
  Loaf scenario and five lookup questions verbatim. I1–I5 confirmed closed, no
  regressions. It surfaced a gap the fix queue hadn't named — a required liveness
  endpoint with no code example — fixed the same way.
- **The whole-branch review the mid-round merge owed** (opus, covering the full round
  from `fdc4811`): found two blocking defects the fix wave itself introduced
  (`Sentry.init` in a module that never runs it; the I2 fix leaking a raw database
  password to stdout), a vacuous test (checked `serializers: {` presence, not the key),
  and one untaught DoD checkbox, plus seven cheap minors. All fixed; a haiku re-review
  confirmed every fix against the diff.
- **Task 16 (these records):** the tracker row below, this file, `docs/task.md`, and a
  new `### Observability` entry in `reference/cheatsheet-sources.md` registering the
  five text sources that fed the doc (the ten images stay unregistered — no provenance).
- A `docs/learnings/quality-gates-101.md` addition: two vacuous-verification lessons from
  the whole-branch review's blocking findings — a test that names the mechanism
  (`serializers: {`, `stdSerializers.err`) without checking the wiring (which *key*), and
  a re-run that verified a redaction mechanism ran without ever trying a secret-bearing
  input, so it never caught the mechanism failing to redact.
- **Gate, final on the branch:** lint 0, typecheck clean, format clean, **1218/1218
  across 162 files**.
- **Merged to `develop` as `7418684` (`--no-ff`), at the user's request.** Plus a fourth
  commit (`99c8a90` → included) recording Task 16. Branch `fix/stage-15-fix-wave` deleted.
  Gate re-run on `develop`: 1218/1218, still clean. `develop` level with `origin/develop`.
- **Not done:** the port (next, its own brainstorm/plan cycle); the ten-image
  registration; the "Next up" staleness noted in the tracker row.

---

#### What this session did (2026-09-15)

Executed the stage 15 interactive port, `feat/stage-15-observability-port`, Tasks 1–12
of `docs/superpowers/plans/2026-09-11-stage-15-interactive-port.md`.

- **Tasks 1–10 ran per the plan**, subagent-driven, sonnet implementers, a sonnet
  per-task reviewer on each (opus for Task 10, escalated per `CLAUDE.md` since it touches
  `stages.ts` and both registries). All ten closed clean or clean-after-fix. `ready: true`
  since Task 10; `pnpm test` after Task 10 was 179 files/1342 tests.
- **Task 11 (verification) found real problems, not just evidence.** The e2e audit came
  back 13/18: **four** panels over the D-52 screen budget (`#errors`, `#logs`,
  `#silence`, `#done`), not the plan's pre-authorized one; the WCAG AA and
  disclosure-sweep tests exceeded a fixed 60s timeout mid-sweep (an 18th-stage headroom
  regression, unrelated to this branch's content); two new touch-target failures under
  44px (`#where`, `#signals`); `test:dev-console` blocked by another `next dev`.
  Implementer correctly stopped rather than improvising past its authorization.
- **User decided, in order:** brainstorm the 4-panel D-52 split rather than force a
  1-panel fix, bump the e2e timeout, and the user would stop their own dev server for
  the dev-console check.
- **Timeout raised 60s→120s** (`playwright.config.ts`, `2bb64e9`); the 3 previously
  timing-out tests re-verified individually, including WCAG AA in both themes.
- **Touch-target fix**: two `Callout` call sites in `panels-collect.tsx` were passing raw
  text instead of `<p>`-wrapped text, missing the audit's inline exemption. Wrapped both,
  matching every other `Callout` in the file (`7c47d33`).
- **D-52 four-panel split**, brainstormed and executed in two files, two rounds each,
  each round reviewed and approved: `panels-collect.tsx`'s `errors`/`logs` split further
  into `errors`+`scrubbing`+`reach` and `logs`+`levels`+`fields`; `panels-act.tsx`'s
  `silence`+`jobs` and `done`+`traps`, with a fix round making `traps` the doc's true
  final step (matching its own section order and stage 11's precedent). `STEP_IDS`
  10→16.
- **Full re-run: `pnpm test:e2e` 18/18, `pnpm test:dev-console` 1/1 zero warnings.**
  Expandable count re-measured against the post-split build: 379 (122 URLs, 269 ids,
  both confirming content moved rather than grew). **Final `pnpm test`: 179 files/1348
  tests.** Humanizer pass over both panel files: zero edits needed.
- **Task 12 (these records):** this file, `docs/task.md`, `docs/tracker.md`'s new
  2026-09-15 W-3.12 row, and `web/PATTERNS.md`'s D-52 note.
- **Not done, deliberately:** the whole-branch review (opus) and the merge decision —
  next, not part of this session. Not merged, not pushed, not deployed.

---

#### The condensed history (01–07, 11–15, the reference hub)

Full detail lives in `docs/tracker.md` and `docs/tracker-archive.md`; grep them by ID.

- **Stages 01–07, 11, 12, 13 and 14 are interactive and merged.** 03 is 22 steps, 04 is
  15, 05 is 13, 06 is 8, 07 is 6, 11 is 8, 12 is 6, 13 is 8 (platform-aware), 14 is 6.
  **Stage 15 is interactive on its own branch, unmerged** — 16 steps after the D-52
  reshape. Coverage walks ran on 03–06, 11–14; stage 15's port hasn't had one yet.
  Stages 08–10 and 16–18 render a "sheet not drawn" placeholder; routing works for all 18.
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
- **`develop` is at 1218 tests across 162 files** (unchanged since the stage 15 doc-round
  merge, 2026-09-11 — the port lives on `feat/stage-15-observability-port`, not yet
  merged). **On that branch, final: 179 files / 1348 tests, `test:e2e` 18/18,
  `test:dev-console` 1/1 with zero warnings** — both re-run after all D-52 fixes, 2026-09-15.
- **The e2e per-test timeout is now 120s, not 60s** (`playwright.config.ts`, `2bb64e9`) —
  an 18th stage in the sweep pushed WCAG AA and the disclosure sweep over the old budget;
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

**Measured 2026-09-15, before this refresh's own commit landed:**

| | SHA | |
|---|---|---|
| `develop` | `d9b4da2` | **2 ahead of `origin/develop`** (`e4750ad`) |
| `main` | `d659d32` (unchanged since 2026-09-10) | `develop` is **94 ahead** |

`develop`'s two unpushed commits are the port's spec+plan records commit (`d9b4da2`) and
one intermediate state (`e4750ad` is on `origin` already, under a subject that describes
itself wrong — see the note two sessions up). Neither is code; nothing under `web/src`
differs between `develop` and `origin/develop`.

**SHAs from before 2026-09-10 were rewritten** (D-97): `c4f2a68` is `450190c`, `8e94b1f`
is `bf0070e`, and the originals no longer exist as objects. A SHA from a 2026-09-08 note
that `git log develop` cannot find was rewritten, not lost:
`git log --oneline develop | grep "<subject>"` finds it.

The promotion of `develop` to `main` is **the user's**, and 94 commits are waiting on it.

**`feat/stage-15-observability-port` is in flight, cut from `develop` at `d9b4da2`.** 18
commits, `d9b4da2..HEAD` (`git log --oneline develop..feat/stage-15-observability-port`).
Ten planned steps, sixteen shipped after the D-52 reshape; `ready: true`. Not merged, not
pushed. **The whole-branch review (opus) is the next step on this branch**, then the
user's merge decision (target: `develop`, `--no-ff`, never `main`).

**`git branch` is `develop`, `feat/stage-15-observability-port` and `main`; `git worktree
list` is one line** (this working directory, on the port branch). The two stale remote
branches and the three 2026-09-04 agent worktrees (1.8 GB) were removed on 2026-09-10
after checking every file they touched was already in `develop`. Their three implementer
reports were the only copies and now live in `.superpowers/sdd/2026-09-04-stage-11-ci-cd/`,
git-ignored like every workspace there.

**Branch/push convention, unchanged:** work on `feat/`|`fix/`|`docs/<date>-` branches, cut
from `develop`, never from `main`. Merge with `--no-ff` and a hand-written subject, never
squashed. **Ask before every merge.** The user handles pushes and the promotion PR.


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
  - **The whole-branch review for `feat/stage-15-observability-port` is the next step,
    before any merge decision.** Opus, per `CLAUDE.md`, covering the full 18-commit diff
    from `develop` at `d9b4da2` — not just the D-52 fix-up commits. Fix its findings and
    re-review before asking about a merge. The merge target is `develop`, never `main`,
    and every merge is asked about, every time.
  - **The next W-3 stage is not chosen.** Six remain (08, 09, 10, 16, 17, 18). Pick after
    the stage 15 branch is merged, not before.
  - **The D-52 split's own reviews left two cosmetic Minor findings, deferred:**
    `Callout` `eyebrow` text on the split panels not updated to match the new step
    boundaries, and the panel-file comment numbering scheme inconsistent across the split.
  - **The baselines/alert-set persisted worksheet is its own bounded round**, deferred at
    the user's direction 2026-09-11, unstarted.
  - **`TriageDrill`/`AuthorizationDrill` (stage 06) are not yet migrated onto the shared
    `Drill` component** stage 15 introduced — still two implementations of the same
    pattern.
  - **Ten observability captures are tracked in `reference/` with no provenance.** Ask for
    authors and URLs before registering any of them. (The five text sources that fed the
    doc's prose *are* registered, since 2026-09-11.)
  - ~~**Personal files are still parked in a committed directory.**~~ Committed on
    2026-09-08, rewritten out on 2026-09-10 (D-97, TD-46). Now at
    `~/personal/parked-from-playbook/`; blobs purged locally and never pushed. Never
    `git add -A`.
  - **Four branches merged unreviewed, from 2026-09-07** (`6f52212`, `99f6145`,
    `4fdb9bd`, `a8f56de`) — treat that code as less checked than usual. Stage 15's
    `fcd46f1` is no longer on this list: the 2026-09-11 whole-branch review covered the
    full round from `fdc4811`, including it.
  - **`docs/tracker.md`'s "Next up" section is stale** (still describes an 8/18 W-3 and a
    pre-stage-11/13/14/15 stage-04 step-splitting question). Found 2026-09-11 while
    writing that round's tracker row, not fixed — refreshing it is a separate pass.
  - **Grep `NOT merged, NOT pushed, NOT deployed` in `docs/tracker.md` at every merge.**
    Doing it once found three rows carrying the phrase, two false for weeks.
  - **A "merged"/"not merged" claim is a query to re-run, not a fact to reuse** —
    `docs/learnings/decisions-need-tests-101.md`.
  - **A number in a plan is a measurement, not a quotation** —
    `docs/learnings/plans-are-unverified-101.md`. The tracker row for this round said
    "four commits" when there were three, inside the same commit that added the guide
    saying not to do that. Corrected on re-derivation.
  - **Cold-reader testing** validates a stage doc before the port starts, not after
    (D-54). The re-run must reuse the same scenario.
  - **Cite doc sections by heading, never by line number** (D-42).
  - `docs/learnings/contrast-checkers-lie.md` — read before changing a token.
  - `docs/learnings/rules-measure-the-wrong-thing-101.md` — measure before capping.
  - **Tailwind v4 token naming** — `border-line` not `border-rule`, `bg-sunken` not
    `bg-surface-sunken`. Check the `@theme` block in `globals.css`.
  - **The three-file registration (stages.ts, stage-content.ts, step-ids.ts) is one
    atomic operation** — do it in the assembly task, not the scaffold task.
