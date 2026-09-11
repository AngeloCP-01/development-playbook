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
- `docs/learnings/README.md` — ten guides written after rounds that cost real time.
  **Read `branch-discipline-101.md` first, before touching git at all.** Then
  **`plans-are-unverified-101.md`**, which is new and is about the artifact this round
  is going to execute: nothing in this repository reads a plan, and the one you are
  about to run proved it twice while it was being written.

### Project state (as of 2026-09-10 — W-3 is **11/18**, seven stages remain.
Stages 01–07, 11, 12, 13 and 14 are interactive. Stage 13 is platform-aware (8 steps,
Vercel + AWS). **Eighteen of twenty-three** reference sheets drawn.

**Stage 15's doc round is executed through Task 14 of 16 and merged.** `fcd46f1` on
`develop`, merged mid-round at the user's direction and **without a whole-branch review**.
`docs/15-observability.md` is 743 lines, 6 `##` and 12 `###`. What is left is **Task 15,
the fix wave**: six blocking findings and one minor from the re-run, then the re-run again
on the fixed doc (D-48), then the review that is owed, then the round closes.)

**Start here, in order:**

1. **Check the branch before editing anything.** `git branch --show-current`. There is no
   branch in flight. Cut `fix/stage-15-fix-wave` from `develop`. If the answer is
   `develop` or `main`, stop and read `docs/learnings/branch-discipline-101.md`.
2. **Re-derive every number in this file before trusting it.** `git fetch`, then the
   commands under "Branch state". This file has been wrong about **six** things so far,
   all found by checking rather than reading. Counts include the commit that writes them,
   and every SHA in this file from before 2026-09-10 was rewritten (D-97).
3. **Run the two one-line checks that belong at every refresh:**
   `grep -n "NOT merged, NOT pushed, NOT deployed" docs/tracker.md` and
   `git ls-files reference/ | grep -iv "jpeg\|jpg\|png\|webp\|gif\|\.md$"`. The second
   found a résumé in the tree on 2026-09-10 (TD-46, D-97). It must return nothing.
4. **Read the fix queue, not the whole plan:** `docs/superpowers/specs/2026-09-08-stage-15-cold-reader-findings.md`
   → *Re-run, after the fix waves* → *Task 15 fix queue*. Seven items. The plan's
   Task 15 (`docs/superpowers/plans/2026-09-08-stage-15-doc-round.md`, line ~2288) says
   how to budget it; nothing else in the plan is still open.
5. **Open on Sonnet, medium effort** (`CLAUDE.md` → *Session model*). The fix wave is
   execution; the findings already say what to do. Dispatch the whole-branch review on
   `opus`. If I3 (the data policy) or I6 (readiness vs liveness) turns into a design
   question, switch the thread to Opus for that and back.

---

#### Stage 15 — the fix queue, and the trap around it

Measured 2026-09-10 from the findings file and the doc. Re-check before acting.

- **I1** canary returns `200` with `{"ok":false}` on an empty result — a status-only
  monitor misses it. Reproduced by the harness. Define the empty-state policy, fail the
  status, test both branches.
- **I2** health logging drops the exception: `logger.warn({ event, error })` emits
  `error:{}` under default Pino. Reproduced. Serialize safely (`err`, within the redaction
  policy), test the emitted record.
- **I3** the opaque-identifier recommendation and Definition of done's "no personal data,
  no exception" still contradict. Narrow the policy to the allowed identifiers; require
  minimisation, retention, deletion. The deletion link exists already.
- **I4** `addContext(key, data)` accepts arbitrary records the scrubber never sees.
  Constrain to allowlisted fields; do not claim a universal scrubber.
- **I5** the jobs section requires watching duration and overlap; the checklist only
  verifies heartbeat absence. Add checkable evidence for both.
- **I6** liveness and readiness conflated: restart decisions use liveness, routing needs
  readiness (Kubernetes probe docs, checked 2026-09-09). Teach the mapping; say why one
  dependency failing need not make the whole instance unready.
- **M1** the health route does not import the logger it uses; annotate the scenery.
- **Two of these were introduced by the round itself** (I1, I2). That is the D-48 shape:
  the fix wave lands after the pass that justified it. So the re-run runs again, **same
  Loaf scenario verbatim**, after Task 15, and the five lookup questions now recorded in
  the file are the ones to reuse.
- **`ready` stays `false`.** Nothing here ports or advances W-3.
- **Guards exist now** for the doc: `stage-15-structure.test.ts` pins section order;
  `term-usage.test.ts` and `terms.test.ts` cover the glossary additions; `AI_SECTION_STAGES`
  includes `15-observability` (and `11-ci-cd`, which it had been missing while stage 11
  was shipped).

#### Reference material for stage 15 — tracked, still unregistered

The ten images are committed (`450190c`, rewritten from `c4f2a68`) but **none is
registered and none has provenance** — `reference/cheatsheet-sources.md` requires an
author and a URL at capture time, and a graphic with neither cannot be published. Ask
for the sources before registering any of them. The `observability` sheet is deferred
until that happens.

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

#### The condensed history (01–07, 11–14, the reference hub)

Full detail lives in `docs/tracker.md` and `docs/tracker-archive.md`; grep them by ID.

- **Stages 01–07, 11, 12, 13 and 14 are interactive and merged.** 03 is 22 steps, 04 is
  15, 05 is 13, 06 is 8, 07 is 6, 11 is 8, 12 is 6, 13 is 8 (platform-aware), 14 is 6.
  Coverage walks ran on 03–06, 11–14. Stages 08–10 and 15–18 render a "sheet not drawn"
  placeholder; routing works for all 18.
- **A per-task reviewer subagent, plus a whole-branch review, is the standard** — every
  reviewed round has found something a green gate did not. **The same session cannot
  self-review.** Under the Pro policy the per-task reviewer is `sonnet` with evidence
  required, the final review is `opus`; `CLAUDE.md` → *Subagent models*.
- **A coverage walk, blind to the branch's own plan and reports, finds real gaps.**
  Budget a fix wave after it.
- **Glossary and stage metadata are single-sourced** (D-36): terms live in
  `web/src/lib/terms.ts` (`pnpm gen:glossary`), never hand-edit `glossary.md`.
- **Quality gates**: prettier (skips markdown and `highlighted.generated.ts`), eslint at
  `--max-warnings 0`, vitest in two projects, `test:e2e` (18-test Playwright audit),
  `test:dev-console` (outside the gate, once per stage round — TD-35, D-84).
- **1207 tests across 162 files** as of `develop` on 2026-09-10. **e2e last green
  2026-09-07 (18/18)**; `test:dev-console` **unrun since 2026-09-07** — do not quote a
  number for it. It needs its own dev server and refuses to start while another
  `next dev` holds the directory.
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

**Measured 2026-09-10 at handoff, before this refresh's own commit landed:**

| | SHA | |
|---|---|---|
| `develop` | `87ca223` | **level with `origin/develop`** — pushed 2026-09-10 |
| `main` | `d659d32` | `develop` is **82 ahead** |

**SHAs from before 2026-09-10 were rewritten** (D-97): `c4f2a68` is `450190c`, `8e94b1f`
is `bf0070e`, and the originals no longer exist as objects. A SHA from a 2026-09-08 note
that `git log develop` cannot find was rewritten, not lost:
`git log --oneline develop | grep "<subject>"` finds it.

The promotion of `develop` to `main` is **the user's**, and 82 commits are waiting on it.

**The stale-merge grep found one on this refresh**: the 2026-09-08 W-3.12 row still said
"NOT merged" after the branch merged that morning. Struck with the date. Run both checks
in step 3 every time; they are cheap and they keep finding things.

**No branch is in flight.** The next one is `fix/stage-15-fix-wave`, cut from `develop`.

**`git branch` is `develop` and `main`, and `git worktree list` is one line.** The two
stale branches and the three 2026-09-04 agent worktrees (1.8 GB) were removed on
2026-09-10 after checking every file they touched was already in `develop`. Their three
implementer reports were the only copies and now live in
`.superpowers/sdd/2026-09-04-stage-11-ci-cd/`, git-ignored like every workspace there.

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
  - **Task 15 of the stage 15 round is the next session's whole job** — seven findings,
    then the re-run on the same scenario (D-48), then the whole-branch review the merge
    skipped. Cut `fix/stage-15-fix-wave`; open on Sonnet.
  - **Ten observability captures are tracked in `reference/` with no provenance.** Ask for
    authors and URLs before registering any of them.
  - ~~**Personal files are still parked in a committed directory.**~~ Committed on
    2026-09-08, rewritten out on 2026-09-10 (D-97, TD-46). Now at
    `~/personal/parked-from-playbook/`; blobs purged locally and never pushed. Never
    `git add -A`.
  - **`pnpm test:dev-console` has not run since 2026-09-07.**
  - **Five branches merged unreviewed** — the four of 2026-09-07 (`6f52212`, `99f6145`,
    `4fdb9bd`, `a8f56de`) and stage 15's `fcd46f1` on 2026-09-10. Treat that code and
    that doc as less checked than usual.
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
