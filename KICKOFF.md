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
- `docs/learnings/README.md` — six guides written after rounds that cost real time. Three
  bear on stage 04's port: `stage-implementation-101.md` (the layout traps and verification
  checklist for building a stage), `cold-reader-testing.md` (the method, now run before the
  app rather than after — D-54), and `decisions-need-tests-101.md`, which is about what makes
  a recorded decision actually hold

### Project state (as of 2026-08-13 — stage 04's doc phase done and unmerged, TD-28 closed, stage 03 merged, the site live and self-verifying)

- **Playbook content:** all 18 stage docs written (`P-0`…`P-4`).
  **Caution:** the "18/18 pass the seven-section template check" and "124/124 links resolve"
  figures quoted in the tracker came from **ad-hoc P-4 scripts that no longer exist** (TD-5).
  They are not committed tests and nothing re-runs them. Do not cite them as having passed.
  What *is* enforced: `stage-metadata.test.ts` (each doc's H1 matches `stages.ts`, and every
  built stage has its `### AI in …` heading), `glossary.test.ts`, `stage-03-structure.test.ts`
  (pins that doc's fourteen subsections in order), `source-citations.test.ts` (D-42), and
  `ddl-sync.test.ts` plus `evolve.test.ts`, which hold three SQL blocks in the app to the doc
  character-for-character.
- **Web app:** `web/` — Next 16, TypeScript, Tailwind 4, no backend. **Stages 01, 02 and 03 are
  complete, interactive and merged**; 03 is 22 steps with every panel under four screens.
  Fifteen stages remain, which is all that is left of `W-3` and of the project. See
  `docs/stage-03-status.md` for section-by-section coverage of 03.
- **The D-52 reshape is done, and D-52 stands in place of D-38** (superseded, kept struck
  through for the record). `PANEL_EXCEPTIONS` in `web/e2e/audit.spec.ts` is back to its two
  permanent entries, which was the exit condition. **Twenty-two steps was not a target**: every
  split was forced by a measurement, and several landed one section later than the plan proposed
  because the plan's seam measured wrong.
- **Stage 03's port content is complete, and so are its eight recorded doc gaps** (W-3.3).
  The doc is at **1,507 lines / 14 sections**; the app is still 22 steps, because every gap
  landed inside an existing panel under the four-screen rule and three went behind
  expand-to-reveal (D-49). **TD-23 is closed** — it always waited on the merge rather than
  on content, and `790b3e4` is that merge.
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
- **Stage 04's doc is corrected and `TD-28` is closed**, on `fix/stage-04-doc-corrections`,
  **37 commits, reviewed, not merged and not pushed**. `docs/04-project-setup.md` went
  **323 → 690 lines**. The number that matters for how you read any debt entry here:
  **TD-28 named four defects and the round closed 31.** Reading the doc found 8, running
  every executable block of it found 5 more, a cold reader given the corrected doc and a
  task to finish found 14, and per-task reviews found the last 4. The evidence, the
  `Deferred:` list and six new decisions (**D-53**…**D-58**) are in `docs/tracker.md`.
- **Stage 04's port has not started.** `04-project-setup` is still `ready: false` and absent
  from `STAGE_CONTENT`, `RevealList` is not extracted, and **W-3 is not advanced**. What is
  left of the stage is in `docs/task.md`'s **W-3.4**.
- **Stages 04–18** render a "sheet not drawn" placeholder. Routing works for all 18.
- **Quality gates live and proven** (`W-4` done): prettier (skips markdown by design),
  eslint at `--max-warnings 0`, **332 vitest tests across 33 files** in two projects — `unit`
  (node, data invariants) and `dom` (jsdom, render tests, `*.test.tsx`) — a **14-test playwright
  audit suite over 36 URLs**, lefthook hooks, and CI. Branch protection is on; the repo is
  public (D-26).
- **`PAGES` in `web/e2e/audit.spec.ts` is still hand-written** (**TD-12**), so adding a step
  means editing that array by hand — thirteen times this round. A dead hash now fails; a missing
  one still audits nothing, which is the half that matters now.
- **Deployed** (`W-5`, live 2026-08-11): **https://acp-dev-playbook.vercel.app**, verified
  against the running site — `/robots.txt`, a 19-URL `/sitemap.xml`, and stage pages rendering
  with the title template. The Vercel project is `acp-development-playbook`; the **assigned
  origin is `acp-dev-playbook`**, which is not derivable from the project name and was guessed
  wrong once. `NEXT_PUBLIC_SITE_URL` is set in Vercel and overrides `src/lib/site.ts`.
  Three dashboard settings were needed and none is expressible in the repo: **Root Directory
  `web`**, **Framework Preset Next.js** (it was *Other*, whose output directory is `public` —
  which this round had deleted), and the **connected repository**, which pointed at a
  placeholder. See `docs/learnings/deploying-101.md` before deploying anything else.
- **W-5 is complete.** `pnpm test:prod` verifies the deployment itself — five `@smoke` checks
  covering what CI structurally cannot: the env-var-dependent `robots.txt` and `sitemap.xml`,
  whether the 19 advertised URLs resolve, and the real edge's console. It is **not** part of the
  pre-merge gate; run it after a promotion to `main`.
- **Branch/push:** work happens on `feat/`|`fix/`|`chore/`|`docs/<date>-` branches, merged
  with `--no-ff` and a hand-written subject, never squashed. **Since 2026-08-11 `main` is
  production** — the site deploys from it — so work branches merge to **`develop`** and never
  to `main`. You may open a PR to `main`; the user merges it. **Ask before every merge**,
  including into `develop`. **The user handles pushes.**
  **Stage 03 is merged and pushed**: `feat/stage-03-app-port` landed on `main` as
  **`790b3e4`** (`--no-ff`, 106 commits, 91 files, +20k/−0.5k, branch deleted). Local `main`
  is at **`8d5045c`** as of 2026-08-13. **Do not quote an ahead-of-remote count from this
  file** — every version of it has gone stale, and the local `origin/main` ref is only as
  fresh as the last fetch. Derive it: `git fetch && git rev-list --count origin/main..main`.
  Two merged branches still sit on the remote and can be deleted:
  `origin/feat/stage-03-app-port` and `origin/feat/stage-03-standard-practices`.

### Next round's scope: stage 04 — `RevealList`, then the port

**The doc-correction phase is done** and is the reason this section no longer opens with
TD-28. `fix/stage-04-doc-corrections` corrected `docs/04-project-setup.md` from 323 to 690
lines and closed that debt, which named four of the thirty-one defects the round found. The
branch is **not merged**. Settle the merge before planning against the doc, because a plan
specified against prose that then moves is the failure stage 03 hit five times out of six
(**D-51**).

Two pieces remain, in this order:

1. **`RevealList`** (`refactor/reveal-list`). Five stage-03 accordions share one markup —
   `DeferredList`, `DeploymentStyles`, `ResiliencePatterns`, `EvolutionNotes`,
   `ScalingMoves` — and stage 04 needs the same shape for its Traps and Artifacts lists.
   Extracting before the port means writing three new callers; extracting after means
   rewriting three components that were just reviewed. **The equivalence check is the
   control**: the audit sweep counts 108 expandables across 36 URLs, and the same count with
   the same contrast result is what proves five components were replaced and nothing was
   lost. A green suite alone would not. If the count moves at all, the refactor is wrong,
   not the checker.
2. **The port** (`feat/stage-04-app-port`), cut off `develop` once both have landed.
   `web/src/features/setup/`, a `steps.ts` holding `STEP_IDS` so a nonexistent id is a
   compile error, `ready: true` in `stages.ts`, and `DeployBlockers` as the headline
   component: guess-then-reveal over four real deploy failures, one of which has success as
   its symptom. The seam table and the nine provisional steps are in the spec.

**Read these first, in this order:**

1. `docs/superpowers/specs/2026-08-12-stage-04-project-setup-design.md` — the round's spec.
   Phases 4 and 5 are the two pieces above and are the only parts still open. Note that its
   defect table is the *starting* inventory of eight, not the final thirty-one.
2. `docs/tracker.md`, the **2026-08-13 W-3 (04 doc)** row — what the correction phase found,
   and more usefully the long `Deferred:` list of what it deliberately did not do. Also
   **D-53**…**D-58**, the decisions that round produced.
3. `docs/verification/cold-reader-stage-04-run1.md` — the twelve entries with their close-out
   state, and the ten boundary items the port has to leave alone as well.
4. `web/PATTERNS.md` — the interaction patterns, and the render-test rule added with TD-17.
   Read before building any stage.
5. `docs/learnings/stage-implementation-101.md` — the layout traps and the verification
   checklist for building a stage.

**`docs/learnings/deploying-101.md` is no longer the raw material** — §8 has absorbed it, and
the round found one entry over-claiming it as a source for material it does not contain. Read
it for the incident, not as a specification.

**What the doc phase cost, as calibration for the port:** 37 commits over two days, three
verification instruments, twelve fix entries, and a whole-branch review that returned eight
findings after every task had already been reviewed clean. The doc is a third of stage 03's
length. Expect the port to be smaller than stage 03's 106 commits, and expect the review to
find something, because it has every time.

**The method that keeps paying, stated as a method rather than a war story.** Twice this month
a recorded piece of evidence turned out to be a check that could not fail: a `metadataBase`
build warning that only fires for a feature this app deliberately lacks, and a `robots.txt`
regex that matched the substring inside `Disallow:`. Neither would have been caught by running
the suite again. **The teeth check is what separates evidence from decoration**, and in both
cases the assertion that turned out decorative was the one nobody teeth-checked.

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
    interactive stage, not after — stage 03 ran it last and ended with a finished app on top
    of a doc with three blocking gaps. Now **D-54**, after stage 04 ran it first and the pass
    returned three blocking findings that would otherwise have been ported into components.
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
