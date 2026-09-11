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

### Project state (as of 2026-09-11 — W-3 is **11/18**, seven stages remain.
Stages 01–07, 11, 12, 13 and 14 are interactive. Stage 13 is platform-aware (8 steps,
Vercel + AWS). **Eighteen of twenty-three** reference sheets drawn.

**Stage 15's whole doc round — all 16 tasks — is done and merged.** The mid-round merge
(`fcd46f1`, 2026-09-10) landed the doc through Task 14 without a whole-branch review;
that gap is closed, not deferred. Task 15 (the fix wave), the D-48 re-run, the
whole-branch review the merge owed, and Task 16 (records) all ran on
`fix/stage-15-fix-wave` and merged to `develop` as `7418684` (`--no-ff`), branch deleted.
`docs/15-observability.md` is **853 lines**, 6 `##`, 12 `###`. `develop` is level with
`origin/develop`.

**The next thing is the port** (W-3.12 proper — an interactive `web/features/observability/`
component, the same three-file trace every other stage used: `stages.ts`, the feature
component, `stage-content.ts`). Nothing in the doc content is open; this is a fresh piece
of work, not a continuation of the fix wave. **Start with `superpowers:brainstorming`,
not a plan** — `CLAUDE.md`'s delivery loop puts brainstorming before writing-plans for
any creative/build work, and stage 15's content (Sentry, structured logging, health
checks, alerting, uptime monitoring, silent failures, jobs, dashboards) is dense enough
that how to split it into 4–6 `Step` objects is itself a design decision, not a mechanical
one. Read `web/PATTERNS.md` before that brainstorm — it says which interaction pattern
fits which content, and the default is not a paragraph.

**Start here, in order:**

1. **Check the branch before editing anything.** `git branch --show-current`. Should be
   `develop`. If you're about to start the port, cut a new branch (`feat/stage-15-observability-port`
   or similar) once the brainstorm has produced a spec to build from — not before. If the
   current branch is unexpectedly not `develop` or `main`, stop and read
   `docs/learnings/branch-discipline-101.md`.
2. **Re-derive every number in this file before trusting it.** `git fetch`, then the
   commands under "Branch state". This file has been wrong about **six** things in the
   past, all found by checking rather than reading. Counts include the commit that writes
   them, and every SHA in this file from before 2026-09-10 was rewritten (D-97).
3. **Run the two one-line checks that belong at every refresh:**
   `grep -n "NOT merged, NOT pushed, NOT deployed" docs/tracker.md` and
   `git ls-files reference/ | grep -iv "jpeg\|jpg\|png\|webp\|gif\|\.md$"`. The second
   found a résumé in the tree on 2026-09-10 (TD-46, D-97). It must return nothing.
4. **Read `docs/15-observability.md` and `web/PATTERNS.md`**, then invoke
   `superpowers:brainstorming` for the port — do not skip straight to a plan.
5. **Open on Opus, high effort** — this is a brainstorm/spec/plan session, and
   `CLAUDE.md` → *Session model* is explicit that the design decisions get made here and
   nowhere else. Switch to Sonnet for the execution session that follows, per *Plan, then
   record, then a new session*.

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
- **`develop` is at 1218 tests across 162 files** (was 1207 before the stage 15 fix-wave
  merge, 2026-09-11). **e2e last green 2026-09-07 (18/18)** — that predates this merge,
  and nothing under `web/src` renders differently, so it wasn't re-run; `test:dev-console`
  **unrun since 2026-09-07** — do not quote a number for it. It needs its own dev server
  and refuses to start while another `next dev` holds the directory.
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

**Measured 2026-09-11, after the stage 15 fix-wave merge, before this refresh's own
commit landed:**

| | SHA | |
|---|---|---|
| `develop` | `7418684` | **level with `origin/develop`** |
| `main` | `d659d32` (unchanged since 2026-09-10) | `develop` is **89 ahead** |

**SHAs from before 2026-09-10 were rewritten** (D-97): `c4f2a68` is `450190c`, `8e94b1f`
is `bf0070e`, and the originals no longer exist as objects. A SHA from a 2026-09-08 note
that `git log develop` cannot find was rewritten, not lost:
`git log --oneline develop | grep "<subject>"` finds it.

The promotion of `develop` to `main` is **the user's**, and 89 commits are waiting on it.

**`fix/stage-15-fix-wave` merged and was deleted, 2026-09-11.** `7418684`, `--no-ff`, 4
commits (the fix wave, the liveness endpoint the re-run surfaced, the whole-branch
review's fixes, Task 16's records). Gate on `develop` after the merge: 1218/1218, clean.

**No branch is in flight.** The next one is for the stage 15 port — cut it after the
brainstorm/plan produces something to build from, not before.

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
  - **The stage 15 port (W-3.12 proper) is the next content work.** `fix/stage-15-fix-wave`
    merged 2026-09-11 as `7418684`; `develop` is at 1218 tests. Start with
    `superpowers:brainstorming`, not a plan — this is fresh design work, not a
    continuation of the fix wave.
  - **Ten observability captures are tracked in `reference/` with no provenance.** Ask for
    authors and URLs before registering any of them. (The five text sources that fed the
    doc's prose *are* registered now, 2026-09-11.)
  - ~~**Personal files are still parked in a committed directory.**~~ Committed on
    2026-09-08, rewritten out on 2026-09-10 (D-97, TD-46). Now at
    `~/personal/parked-from-playbook/`; blobs purged locally and never pushed. Never
    `git add -A`.
  - **`pnpm test:dev-console` has not run since 2026-09-07.**
  - **Four branches merged unreviewed, from 2026-09-07** (`6f52212`, `99f6145`,
    `4fdb9bd`, `a8f56de`) — treat that code as less checked than usual. Stage 15's
    `fcd46f1` is no longer on this list: the 2026-09-11 whole-branch review covered the
    full round from `fdc4811`, including it.
  - **`docs/tracker.md`'s "Next up" section is roughly ten days stale** (still describes
    an 8/18 W-3 and a pre-stage-11/13/14/15 stage-04 step-splitting question). Found
    2026-09-11 while writing that round's tracker row, not fixed — refreshing it is a
    separate pass.
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
