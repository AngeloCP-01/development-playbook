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
- `docs/learnings/README.md` — six guides written after rounds that cost real time. Two are
  directly relevant to W-3.2: `decisions-need-tests-101.md` — this round *did* supersede D-38,
  and that guide is about what makes a recorded decision actually hold, which D-38 did not — and
  `stage-implementation-101.md` (the layout traps and verification checklist for building a
  stage)

### Project state (as of 2026-08-03, after the D-52 round, the eight doc gaps, cold-reader run 4, and the whole-branch re-review)

- **Playbook content:** all 18 stage docs written (`P-0`…`P-4`).
  **Caution:** the "18/18 pass the seven-section template check" and "124/124 links resolve"
  figures quoted in the tracker came from **ad-hoc P-4 scripts that no longer exist** (TD-5).
  They are not committed tests and nothing re-runs them. Do not cite them as having passed.
  What *is* enforced: `stage-metadata.test.ts` (each doc's H1 matches `stages.ts`, and every
  built stage has its `### AI in …` heading), `glossary.test.ts`, `stage-03-structure.test.ts`
  (pins that doc's fourteen subsections in order), `source-citations.test.ts` (D-42), and
  `ddl-sync.test.ts` plus `evolve.test.ts`, which hold three SQL blocks in the app to the doc
  character-for-character.
- **Web app:** `web/` — Next 16, TypeScript, Tailwind 4, no backend. **Stages 01 and 02 are
  complete and interactive; 03 is on `feat/stage-03-app-port` at 22 steps**, every panel under
  four screens. See `docs/stage-03-status.md` for section-by-section coverage — it is the map,
  and it is current.
- **The D-52 reshape is done, and D-52 stands in place of D-38** (superseded, kept struck
  through for the record). `PANEL_EXCEPTIONS` in `web/e2e/audit.spec.ts` is back to its two
  permanent entries, which was the exit condition. **Twenty-two steps was not a target**: every
  split was forced by a measurement, and several landed one section later than the plan proposed
  because the plan's seam measured wrong.
- **Stage 03's port content is complete, and so are its eight recorded doc gaps** (W-3.3).
  The doc is at **1,507 lines / 14 sections**; the app is still 22 steps, because every gap
  landed inside an existing panel under the four-screen rule and three went behind
  expand-to-reveal (D-49). **TD-23 stays open** on the merge alone — both whole-branch passes
  have now run and every finding is fixed.
- **Cold-reader run 4 returned COMPLETE** — the first of four runs to do so
  (`docs/verification/cold-reader-stage-03-run4.md`). Two findings were recorded as deferred
  rather than fixed, and they are content decisions waiting on a call: 2NF is unviolatable
  under the `uuid` primary keys every DDL in this stage uses, and the archive table gives no
  volume threshold.
- **The cold-reader method is load-bearing, not a formality.** Budget a fix wave after every
  pass; the first report is not the end of the round (D-48).
- **A per-task reviewer subagent is now the standard** (see `docs/tracker.md`, "Process
  observations"). Four have run on this round and found **fourteen blocking defects**, including
  two factual errors about Postgres in teaching material; the whole-branch review then found
  **seven more**, so the rate did not fall off. **The same session cannot self-review**
  — the reading that produced the claim produces the check. Implement inline, dispatch reviewers.
- **Every stage carries an "AI plays" section** (D-35), in both doc and app.
  `stage-metadata.test.ts` **fails any stage whose doc lacks the `### AI in <stage>` heading**.
- **Glossary + metadata are single-sourced** (D-36, TD-2/TD-3 closed): terms live in
  `web/src/lib/terms.ts`, `reference/glossary.md` is generated from it (`pnpm gen:glossary`),
  and a title sync test guards each doc's H1 against `stages.ts`. Never hand-edit
  `glossary.md`.
- **Stages 04–18** render a "sheet not drawn" placeholder. Routing works for all 18.
- **Quality gates live and proven** (`W-4` done): prettier (skips markdown by design),
  eslint at `--max-warnings 0`, **328 vitest tests across 32 files** in two projects — `unit`
  (node, data invariants) and `dom` (jsdom, render tests, `*.test.tsx`) — a **14-test playwright
  audit suite over 36 URLs**, lefthook hooks, and CI. Branch protection is on; the repo is
  public (D-26).
- **`PAGES` in `web/e2e/audit.spec.ts` is still hand-written** (**TD-12**), so adding a step
  means editing that array by hand — thirteen times this round. A dead hash now fails; a missing
  one still audits nothing, which is the half that matters now.
- **Not deployed yet, but the repo is ready for it** (`W-5`, 2026-08-04). `engines.node` pins
  the Node version Vercel reads, `metadataBase` is set, and `sitemap.ts` / `robots.ts` cover the
  19 public URLs. **The one blocker is a dashboard setting**: the Vercel project
  (`acp-development-playbook`) needs Root Directory `web`, because the app is not at the repo
  root. `NEXT_PUBLIC_SITE_URL` overrides the origin without a code change.
- **Branch/push:** work happens on `feat/`|`fix/`|`docs/<date>-` branches, merged to `main`
  with `--no-ff` and a hand-written subject, never squashed. **The user handles pushes.**
  **Stage 03 is merged and pushed**: `feat/stage-03-app-port` landed on `main` as
  **`790b3e4`** (`--no-ff`, 106 commits, 91 files, +20k/−0.5k, branch deleted), and
  `origin/main` is at `2f42753`. **TD-17's harness is merged and not yet pushed** (`99f60cd`),
  so `main` is **7 commits ahead of the remote**. Two merged branches still sit on the remote
  and can be deleted: `origin/feat/stage-03-app-port` and
  `origin/feat/stage-03-standard-practices`.

### This round's scope

**Stage 03 is done and merged.** The D-52 round's twelve tasks, W-3.3's eight doc gaps,
cold-reader run 4 and its fix wave, and the whole-branch re-review's five Important findings
all landed on `main` as `790b3e4` (`--no-ff`, 106 commits, branch deleted). **TD-23 is
closed.** The next round is a new stage — 15 Observability is the recommended one — or `W-5`,
the deploy. Nothing below blocks either; it is history worth carrying.

**Read these two first, in this order:**

1. `.superpowers/sdd/2026-07-31-step-panel-weight/progress.md` — the ledger. Every task, its
   commits, every deviation from the plan and why. It is git-ignored scratch, so read it before
   running anything that cleans the tree.
2. `docs/superpowers/plans/2026-07-31-step-panel-weight.md` — the plan. **All twelve tasks are
   done.** Its spec is `docs/superpowers/specs/2026-07-31-step-panel-weight-design.md`, and the
   plan's own Verification section is the checklist for what comes next.

**What that merge carried.** 106 commits, doc and app as one unit (D-51). The whole-branch
review has run and returned **seven blocking findings**, plus two minors promoted for being
reader-visible and introduced by this branch, and sixteen deferred to the tracker. All nine are
fixed. Four per-task reviews had found **fourteen** before it, and the rate did not fall off:
the last task reviewed, Task 11, produced three, and the branch pass then produced seven. Two of
those fourteen were factual errors about Postgres in teaching material, which is the class of
mistake a per-task review catches and a casual read does not — and the branch pass caught the
class above that, a green verification gate measuring almost nothing.

**The re-review's headline is worth carrying forward as a method, not a fact.** Its I1 was a
backfill instruction that told the reader to paginate a `WHERE col IS NULL` loop by remembering
the highest id touched. It reads as careful advice. Run it and the guard has already removed
the rows the cursor is skipping past: **5000 of 5000 rows silently unmigrated, reported as
success**. Nothing but execution finds that — which is D-50 arriving a second time, on
*behaviour* rather than on syntax.

**Five things this round has taught, all of which cost time to learn:**

- **The plan is wrong about the shape of the work more often than the implementation is.**
  Five of six tasks found a brief that did not match the tree: two seams that measured wrong, a
  compression lever already applied years earlier, a step-count assumption, and a play count
  taken from a status doc rather than from the doc. **The exit condition of a split is the
  measurement, not the edit** — re-cut and re-measure rather than assuming the seam is right.
- **A panel that measures 4.0 against a limit of 4.0 has not passed.** It passes today and
  fails on the next font change. Cut again.
- **A step name in prose is a citation and it stales silently.** Seven shipped on this branch,
  each found by grep and none by a test: `steps.ts` makes a nonexistent *id* a compile error and
  can say nothing about a name written in a sentence. Grep for step names whenever a step
  splits, and re-point `TRACE_ROWS[].stepId` — that one finally fired for real in Task 9.
- **A test name is a claim, and it goes stale like one.** Four times during the round, and four
  more found by the whole-branch review; twice the offending test had been cited in a commit
  body as the fix. Verify by running the regex against a counter-example, not by reading it —
  the four the review found were each run against one before being rewritten.
- **Count the doc; do not trust the brief.** Where a count is checkable, check it in a test
  against the doc itself — `evolve.test.ts`, `ai-plays.test.ts` and now `sketch.test.ts` all do.
- **Prose that counts a list belongs beside the list.** Three sentences hand-counted "six boxes"
  against a diagram of eight, in three files, and one of them contradicted itself in its own
  second clause. They now live in `sketch.ts` next to `SKETCH_NODES` with the counts derived in
  test — the same move `terms.ts` made for the glossary.

**Two cautions this stage earned earlier and still holds:**

- **Executable content gets executed** (**D-50**). Reading missed two defects in the doc's SQL
  that one `docker run` found.
- **Grep `terms.ts` when you fix a concept** (**D-47**), then `pnpm gen:glossary`. Never
  hand-edit `reference/glossary.md`. Every term this round needed already existed; two
  candidates were deliberately not added, because the glossary is generated and an entry the
  doc does not carry would be invention rather than porting.

---

## Quick reference — for you, not the new session

Notes for whoever is preparing this handoff:

- Refresh **Project state** and **This round's scope** before pasting. Delete closed
  items rather than leaving them ticked.
- Fill in the `[FILL IN: ...]` lean, or delete the line if genuinely undecided.
- If a round is already scoped, add a per-round sibling — `KICKOFF-W4.md` — rather than
  overwriting this one. The generic version stays useful.
- Open threads worth carrying forward:
  - The delivery loop has run many times now; stage 03's spec/plan pair
    (`docs/superpowers/{specs,plans}/2026-07-28-stage-03-architecture*`) is the fullest house
    example — 17 tasks, subagent-driven, with the ledger at
    `.superpowers/sdd/2026-07-28-stage-03-architecture/progress.md`.
  - **Cold-reader testing** (`docs/learnings/cold-reader-testing.md`) is how a stage doc is
    validated before it ships. Run the beginner-completeness pass **before** building the
    interactive stage, not after — stage 03 ran it last and now has a finished app on top of
    a doc with three blocking gaps.
  - **Most of stage 03's defects were plan-authored, not implementer error** (tracker,
    "Process observations"). A per-task review sees one diff; nothing but controller-level
    review catches a task whose output undermines another's. Budget for that.
  - **Cite doc sections by heading, never by line number** (D-42). An audit of `web/src/`
    found 14 of 33 citations wrong — four staled by this round, ten inherited from the
    stage 02 round, the worst off by ~86 lines. Nothing in the gate can detect it, and a
    grep for the pattern cannot either: it only sees citations that repeat the filename, so
    bare `:NNN` continuations and citations to other docs stay invisible. Open the lines.
  - `docs/learnings/contrast-checkers-lie.md` — read it before changing a token in response
    to a contrast number. Three of the failures reported in this repo were the checker.
