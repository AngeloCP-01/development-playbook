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

### Project state (as of 2026-09-08 — W-3 is **11/18**, seven stages remain.
Stages 01–07, 11, 12, 13 and 14 are interactive. Stage 13 is platform-aware (8 steps,
Vercel + AWS). **Eighteen of twenty-three** reference sheets drawn.

**Stage 15's doc round is specified and not executed.** The plan is written, reviewed
against five gathered references, and committed. `docs/15-observability.md` has not been
touched — it is byte-identical to its state on `develop`. This session's job is to
**execute** it.)

**Start here, in order:**

1. **Check the branch before editing anything.** `git branch --show-current`. The work
   is on `fix/stage-15-doc-round`, which already exists — check it out, do not cut a new
   one. If the answer is `develop` or `main`, stop and read
   `docs/learnings/branch-discipline-101.md`. This has bitten twice.
2. **Re-derive every number in this file before trusting it.** `git fetch`, then the
   commands under "Branch state". This file has now been wrong about **six** separate
   things: a stage's merge status, a test count, whether `develop` was pushed, the
   ahead-of-`main` count, the number of subsections in stage 15's doc, and what
   `stage-metadata.test.ts` actually gates on. The last two were found this round by
   checking rather than reading.
3. **Read the plan and the findings it argues from**, in that order:
   - `docs/superpowers/plans/2026-09-08-stage-15-doc-round.md` — 18 tasks, 2447 lines
   - `docs/superpowers/specs/2026-09-08-stage-15-cold-reader-findings.md` — the evidence
4. **Then execute it**, Task 0 onward. The execution mode was never decided; see below.

---

#### Stage 15 — the round is planned, so this is what you actually need

Measured 2026-09-08. Re-check anything you are about to act on.

- **The plan is the source of truth, not this file.** Every task carries its own files,
  its RED, its implementation and its commit message. Work from the task slice.
- **Two cold readers ran on 2026-09-08** (D-54). They found six contradictions, four
  things the stage requires in `## Artifacts` or `## Definition of done` and never
  teaches, nine it never mentions, and scored **2/5** on symptom-shaped lookup. Both
  found the PII contradiction independently.
- **`docs/15-observability.md` is 261 lines with 6 `##` and 8 `###` subsections.** The
  previous version of this file said 9. It was 8 then too.
- **`stage-metadata.test.ts` does not gate on `ready`.** The previous version of this
  file said it fails any `ready: true` stage lacking an AI heading. `AI_SECTION_STAGES`
  is an explicit list, and the test's own comment says the explicitness is deliberate —
  so the slug is added at the *start* of a round. That is Task 10's RED, and it is real.
- **The same read found `11-ci-cd` missing from that list**, although stage 11 shipped an
  AI section on 2026-09-07. The guard has been blind to a shipped stage. Task 1 closes it.
- **Sentry is not a dependency of this repo.** `web/package.json` has no `@sentry/*`.
  The stage teaches it; the site does not use it. D-50's harness is the scratch project
  in Task 0, not `web/`.
- **`ready` stays `false`.** This branch does not port and does not advance W-3.
- **Panel content is testable now.** `Element.prototype.scrollIntoView` is stubbed in
  `src/test/setup.ts`. Assume other stages' component tests still carry the old blind
  spot.

#### The execution decision was never made

The round was planned and then stopped deliberately, at the user's request, to record
first. Two options were put up and neither was chosen:

- **Inline with checkpoints** — recommended when it was offered, and the reasoning still
  holds: tasks 2–13b all edit one prose document in sequence, so there is no independence
  to exploit; voice has to hold across thirteen edits and the cold reader explicitly
  cannot see voice drift; and the plan pins every load-bearing sentence verbatim. The
  cost is no fresh reviewer per task, which makes the whole-branch review before merge
  non-optional.
- **Subagent-driven** — the repo standard, and every reviewed round here has found
  something a green gate did not. Budget one retry per reviewer dispatch; 3 of 5 stalled
  in a previous round and every retry succeeded.

**Ask before starting.** It is a real fork and it was left open on purpose.

#### Reference material for stage 15 — gathered, unregistered

**Ten images landed in `reference/` on 2026-09-08 and none is committed or registered:**

```
3-pillars-of-observavilty.jpeg        SLA-SLI-SLO&ERRORBUDGET.jpeg
4-Golden-Signals-SRE.jpeg             latency-metrics.jpeg
Microservices-Observavility&Tracing.jpeg   logging.jpeg
mertrics-vs-logs-vs-traces.png        observavility&opentelemetry.png
sprinboot-logging-cheatsheet.jpeg
```

They map almost exactly onto the gathering list this round proposed, including the three
that fill things the doc asserts without teaching: SLI/SLO/SLA plus error budget, the
four golden signals, and latency percentiles. **None has provenance recorded**, which
`reference/cheatsheet-sources.md` requires at capture time — a graphic with no author and
no URL cannot be published on a live site. Ask for the sources before registering any of
them.

**Five articles were also read on 2026-09-08** and are listed at the top of the plan's
Task 13b, with which fed the document and which are sheet-only. They are the reason Task
13b exists.

> **The hazard TD-44 recorded is live right now.** `reference/` is a committed directory,
> so anything parked there is one `git add -A` from a public repo. Sitting in it
> untracked at handoff: the ten images above, plus `angelito_paa_software_developer.pdf`,
> `cover-letter-ai-fullstack.md` and `system-design-tradeoffs.jpeg`. **Stage the résumé
> and the cover letter nowhere.** Add files by explicit path, never with `-A` or `.`.

---

#### What this session did (2026-09-08)

Four commits, no merge, and the stage doc deliberately untouched.

- **`a2d3552`** — the cold-reader findings, both runs, with the Loaf scenario recorded
  verbatim because the re-run has to reuse it. Also records what did **not** survive
  checking: the missing-triage finding is stage 16's job, the Sentry scope-leak claim is
  held pending an SDK check rather than written up as fact, and the cost complaint fails
  because five other stages discuss cost.
- **`1ab79c5`** — the plan. Its own self-review found seven task steps quoting cumulative
  test counts that did not match the tests each task adds.
- **`d5a4227`** — Task 13b, from the five gathered articles. The finding that justifies
  it: the round as planned taught scrubbing for the error tracker and nothing for the
  logs, while the checkbox it was fixing covers both. Reading source 5 also exposed a
  forward reference in the plan that no task delivered.
- **`6c5f816`** — records. `task.md` gains W-3.12; the tracker gains the round, **D-94**
  (stage 15 is platform-aware, Vercel and AWS) and **D-95** (a weak template section is a
  playbook-wide question, not a stage round's business); and
  `docs/learnings/plans-are-unverified-101.md` is new.

**No gate was run and none was due** — nothing under `web/` changed and
`docs/15-observability.md` has a zero-line diff against `develop`.

---

#### The condensed history (01–07, 11–14, the reference hub)

Full detail lives in `docs/tracker.md`; this is what a new session needs without
re-reading the whole log.

- **Stages 01–07, 11, 12, 13 and 14 are interactive and merged.** 03 is 22 steps, 04 is
  15, 05 is 13, 06 is 8, 07 is 6, 11 is 8 (ordering exercise signature piece), 12 is 6,
  13 is 8 (platform-aware: Vercel + AWS), 14 is 6. Coverage walks ran on 03–06, 11, 12,
  13, 14. Stages 08–10 and 15–18 render a "sheet not drawn" placeholder; routing works
  for all 18.
- **A per-task reviewer subagent, plus a whole-branch review, is the standard** — every
  reviewed round has found something a green gate did not. **The same session cannot
  self-review.**
- **A coverage walk, blind to the branch's own plan and reports, finds real gaps a green
  gate and clean per-task reviews cannot see.** Budget a fix wave after it.
- **Glossary and stage metadata are single-sourced** (D-36): terms live in
  `web/src/lib/terms.ts` (`pnpm gen:glossary`), never hand-edit `glossary.md`.
- **Quality gates**: prettier (skips markdown and `highlighted.generated.ts` by design),
  eslint at `--max-warnings 0`, vitest in two projects, `test:e2e` (18-test Playwright
  audit), `test:dev-console` (outside the gate, once per stage round — TD-35, D-84).
  Re-derive current counts rather than quoting them.
- **1161 tests across 160 files** as of `develop`, build clean, **e2e 18/18**.
  `test:dev-console` is **unrun since 2026-09-07**, not passing — do not quote a number
  for it. It needs its own dev server and refuses to start while another `next dev` holds
  the directory. Ask the user to stop theirs rather than killing their process.
- **Deployed**: `W-5` complete, live at https://acp-dev-playbook.vercel.app since
  2026-08-11. `pnpm test:prod` verifies the deployment, outside the merge gate.

---

#### Branch state — re-derive, do not trust any SHA below

```bash
git fetch
git log --oneline -1 develop origin/develop main
git rev-list --count develop..HEAD
git rev-list --count main..develop
```

**Measured 2026-09-08 at handoff:**

| | SHA | |
|---|---|---|
| `fix/stage-15-doc-round` | `6c5f816` | **4 ahead of `develop`**, the work of this session |
| `develop` | `fdc4811` | **level with `origin/develop`** |
| `main` | `d659d32` | `develop` is **48 ahead** |

**`develop` was 4 ahead of `origin/develop` earlier in this same session and is now
level** — the user pushed mid-session. That is the fourth time re-deriving has changed an
answer this file previously stated as fact, and it is why step 2 exists.

The promotion of `develop` to `main` is still pending and is **the user's**. Every count
above includes the commit that wrote it and goes stale on the next one.

**One branch is in flight:** `fix/stage-15-doc-round`, unmerged and unpushed, four
commits, all `docs(...)`. No code under `web/` is touched.

**Two stale branches predate all of this and were deliberately not touched**:
`docs/2026-08-12-stage-04-spec` and `feat/stage-03-standard-practices`. Check whether
they are merged before assuming either is safe to delete. Not this round's job.

**Branch/push convention, unchanged:** work on `feat/`|`fix/`|`docs/<date>-` branches, cut
from `develop`, never from `main`. Merge with `--no-ff` and a hand-written subject, never
squashed. **Ask before every merge.** The user handles pushes and the promotion PR.

---

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
  - **The stage 15 plan is written and unexecuted.** That is the next session's whole
    job, and the execution mode is an open question the user has not answered.
  - **Ten observability captures are in `reference/` with no provenance.** Ask for
    authors and URLs before registering any of them.
  - **Personal files are still parked in a committed directory** — a résumé PDF and a
    cover letter. Never `git add -A`.
  - **`pnpm test:dev-console` has not run since 2026-09-07.**
  - **Four branches merged unreviewed on 2026-09-07** (`6f52212`, `99f6145`, `4fdb9bd`,
    `a8f56de`). None got the whole-branch pass the standard calls for, so treat that code
    as less checked than usual if you touch it.
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
