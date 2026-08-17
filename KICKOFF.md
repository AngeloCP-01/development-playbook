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

### Project state (as of 2026-08-17 — **stage 04 is built, reviewed and merged into `develop`** as `bb3c119`; W-3 is 4/18; `develop` is unpushed and `main` is untouched; the site live and self-verifying)

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
  complete, interactive and merged**; **stage 04 is complete and interactive but NOT merged**
  — it is the 20 commits on `feat/stage-04-app-port`. 03 is 22 steps, 04 is 15. Fourteen
  stages remain, which is all that is left of `W-3` and of the project. See
  `docs/stage-03-status.md` and `docs/stage-04-status.md` for section-by-section coverage.
- **There is a second top-level section now: `/reference` (W-6), and it is PAUSED.** Eleven
  cheatsheets registered behind one renderer, ten of them deliberately empty and chipped WIP,
  because an index that advertises its gaps doubles as a worklist (**D-62**). The rail carries
  a second nav landmark under the eighteen. `reference/cheatsheets.md` is generated from
  `web/src/lib/cheatsheets/` by snapshot test, the same arrangement `terms.ts` has with the
  glossary — do not hand-edit it; run `pnpm gen:cheatsheets`. **Eighteen is still eighteen**:
  this is a sibling section, not a nineteenth stage, which was rejected for the third time.
  Source graphics are served from `web/public/reference/` as WebP; the gathered originals are
  gitignored on purpose (**D-63**). **Do not start W-6 content work** — the stage 04 port is
  the next active thing.
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
- **Stage 04's doc is corrected and `TD-28` is closed** — `fix/stage-04-doc-corrections`
  merged into `develop` as **`dd44b30`**, `--no-ff`.
  `docs/04-project-setup.md` went **323 → 711 lines at `38765e7`**.
  The number that matters for how you read any debt entry here:
  **TD-28 named four defects and the round closed 31.** Reading the doc found 8, running
  every executable block of it found 5 more, a cold reader given the corrected doc and a
  task to finish found 14, and per-task reviews found the last 4. The evidence, the
  `Deferred:` list and six new decisions (**D-53**…**D-58**) are in `docs/tracker.md`.
- **`RevealList` is extracted and merged** (`e29f3fe`). It was scoped as five stage-03
  accordions sharing one markup and there were **eleven** — the five were the ones whose
  header comments admitted the duplication, and the other six never said so. All eleven now
  call `RevealList` (twelve instances), with `RevealFacet` for row bodies and `TeamNotes`
  moved to `src/components/`. **Use it for any new list-of-disclosures; do not hand-roll a
  twelfth.** Debt it opened: **TD-34** (`RevealList` hardcodes `<h3>` for row headings) and
  **TD-35** (the audit's console check cannot see a dev-only warning).
- **Stage 04's port is done and unmerged.** `04-project-setup` is `ready: true`, registered
  in `STAGE_CONTENT`, and rendering fifteen steps. **W-3 is 4/18.** All four provisional
  D-65 pairs stayed split, since combined they measure 4.80, 5.40, 3.54 and 4.23 against a
  3.2 ceiling — **the first seam in this repo to survive measurement unchanged**. Panel
  table and evidence: the W-3.4 row in `docs/tracker.md`.
- **Stages 05–18** render a "sheet not drawn" placeholder. Routing works for all 18.
- **Quality gates live and proven** (`W-4` done): prettier (skips markdown by design),
  eslint at `--max-warnings 0`, **521 vitest tests across 63 files** in two projects — `unit`
  (node, data invariants) and `dom` (jsdom, render tests, `*.test.tsx`) — a **17-test playwright
  audit suite over 63 derived URLs** (51 stage, 12 reference), lefthook hooks, and CI. Branch
  protection is on; the repo is public (D-26). Those figures are the branch's, not `develop`'s.
- **The audit sweeps the ready set automatically** (**TD-12 closed 2026-08-14**).
  `e2e/audit-pages.ts` takes stages from `STAGES.filter(s => s.ready)` and step ids from the
  rail each renders, so a new stage or step is swept without editing a list. A ready stage
  that renders no rail throws. **TD-36 closed 2026-08-17** on the stage 04 port, and on
  three guards rather than one: a `STEP_IDS` tuple per stage catches a *renamed* id,
  `features/rails.test.tsx` catches a step *deleted* from a component, and
  `e2e/audit-pages.spec.ts` makes the same comparison against the built app. A step deleted
  from both the tuple and the component still compiles — that is what each stage's
  `steps.test.ts` ordered literal is for.
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
  is at **`8d5045c`** as of 2026-08-14, and **`main` has had nothing pushed to it since**.
  `develop` **has** been pushed — `origin/develop` was at `49122f5` at the close of
  2026-08-14 — and it carries five merged rounds ahead of `main`: the stage 04 doc correction
  (`dd44b30`), `RevealList` (`e29f3fe`), TD-12 (`a07a9b6`) and the two W-6 reference-hub
  merges (`0207fd6`, `4727dc3`). So **cut the next branch from `develop`, not from `main`**,
  or you will be building against a tree that is five rounds behind. The one branch currently
  in flight is **`feat/stage-04-app-port`**, which now carries the whole stage 04 port and is
  **unmerged and unpushed**. **Do not quote an ahead-of-remote count from this
  file** — every version of it has gone stale, and the local `origin/main` ref is only as
  fresh as the last fetch. Derive it: `git fetch && git rev-list --count origin/main..main`.
  Two merged branches still sit on the remote and can be deleted:
  `origin/feat/stage-03-app-port` and `origin/feat/stage-03-standard-practices`.

### Next round's scope: close the branch, then pick stage 05

**The stage 04 port is built.** `feat/stage-04-app-port` holds **20 commits**,
`394e515`…`dc4c46d`, cut off `develop` at `49122f5`. Not merged, not pushed. What remains
of *this* round is the whole-branch review and the merge decision, both of which are the
user's to call — see `superpowers:finishing-a-development-branch`.

**What the round produced, kept short because `docs/tracker.md`'s W-3.4 row is the record.**
Fifteen steps, all under the 3.2 ceiling, median 2.28 and max 2.99. Tests 382/41 → 521/63.
Audit 17/17 over 63 URLs. Sweep 157 expandables / 119 ids over 51 URLs. Six new decisions
are **D-66** and **D-67**; **TD-36 closed**, **TD-39** and **TD-40** opened.

**The thing worth carrying into the next stage, above everything else.** Five reviews ran
and found 21 blocking items, and the single most valuable was a **coverage walk of the doc
against the app** — section by section, asking *what does the doc teach that the app does
not*. It found five sections in one shape: the app told the reader to run a script or set a
value it never showed them how to create. All five had been assigned to a panel by the
plan's own line ranges, so they were silent drops rather than curations, and the symptom
was visible in the numbers the whole time — the panel median was 1.74 where stage 03's is
3.02, and that gap was missing content, not lean writing. **Run that walk before believing
a port is complete.** Nothing in the gate can see it.

**Second: nine plan defects were found by executing rather than reading**, which is the
same lesson the last two rounds recorded and it did not stop being true. A test that could
never pass (`PIN_RULE` asserted with `toContain` against a hard-wrapped doc). A regex that
counted nine traps where the doc has seven, because `DOC.indexOf('## Traps')` matches §7's
prose *about* `## Traps`. Material sourced to a section that does not contain it. And every
`.tsx` test in Wave 2 written against `jest-dom` and `user-event`, neither of which this
project installs — about twenty tests that would have failed on `Invalid Chai property`
rather than on anything real.

**Third, and it caught two people including the controller: a teeth check can lie.** One
`perl -0p` mutation without `/g` replaced the first occurrence in the slurped file — a
mention inside a docblock — leaving the JSX untouched, so a real test looked toothless.
Another derived *both* sides of its assertion from the same data row, so the prescribed
mutation moved the expectation along with the render and proved nothing. **Verify that the
mutation actually landed before trusting what the run tells you.**

**Read these first, in this order:**

1. `docs/tracker.md`, the **2026-08-17 W-3.4** row — what the port shipped, with the panel
   table, and more usefully its `Deferred:` list. Then **D-64**…**D-67**, and **TD-39** /
   **TD-40**, which this round opened and did not fix.
2. `docs/stage-04-status.md` — the coverage map, doc against app, section by section. It
   also records the three sections deliberately not ported.
3. `web/PATTERNS.md` — the interaction patterns, the render-test rule added with TD-17, and
   the two entries this round added: `InlineCode` and `AnnotatedArtifact`. Read before
   building any stage.
4. `docs/learnings/stage-implementation-101.md` — the layout traps and the verification
   checklist for building a stage.
5. `docs/superpowers/plans/2026-08-14-stage-04-app-port.md` — **only if you are auditing
   what happened**, not as instructions. It carries two in-execution amendments and its
   Global Constraints are the round's rules; nine of its task specifications turned out to
   be wrong about the tree, which is the point of the second lesson above.

**`docs/learnings/deploying-101.md` is no longer the raw material** — §8 has absorbed it, and
the round found one entry over-claiming it as a source for material it does not contain. Read
it for the incident, not as a specification.

**What the doc phase cost, as calibration for the port:** 37 commits over two days, three
verification instruments, twelve fix entries, and a whole-branch review that returned eight
findings after every task had already been reviewed clean. The doc is a third of stage 03's
length. Expect the port to be smaller than stage 03's 106 commits, and expect the review to
find something, because it has every time.

**The method that keeps paying, stated as a method rather than a war story.** A recorded piece
of evidence turning out to be **a check that could not fail** is now this repo's most common
defect, and the count is past seven — a `metadataBase` build warning that only fires for a
feature this app deliberately lacks, a `robots.txt` regex that matched the substring inside
`Disallow:`, three greps for panel ids that are computed inside client components and so
return zero either way, a prettier run over markdown that `.prettierignore` excludes, and a
guard that caught parsing *nothing* rather than parsing *wrong*. The `RevealList` round alone
contributed seven, **six of them authored by the controller rather than the implementers** —
they are written into briefs and plans more often than into code. `docs/tracker.md`'s Process
observations has the catalogue. None would have been caught by running the suite again.
**The teeth check is what separates evidence from decoration**, and in every case the
assertion that turned out decorative was the one nobody teeth-checked.

**Three habits that caught more than reasoning did, on the last two branches:**

- **The file wins.** Where a plan's table and the source disagree, the source is right — say so
  in the brief. Three words in a task brief caught an accordion count that was eleven and not
  five, a badge the plan denied existed, and a tone token named wrong.
- **Run it, do not read it.** Three defects on the TD-12 branch were found by executing
  something and none by reading: a tool that threw on startup while the suite reported 16/16,
  a completeness check that threw on every run, and a regex that paired the wrong fields.
- **A margin claim needs the browser.** Two spacing regressions shipped because three people
  reasoned that adjacent margins would collapse. They do not collapse between `inline-flex`
  siblings, and Tailwind v4's `space-y-*` sets `margin-block-end` on `:not(:last-child)`.

**Six things the stage 03 and 04 rounds taught, all of which cost time to learn** (the header
said five over six bullets until 2026-08-14, which is the smallest possible version of the
count-the-thing-in-front-of-you problem the first bullet is about):

- **The plan is wrong about the shape of the work more often than the implementation is.**
  Five of six tasks found a brief that did not match the tree: two seams that measured wrong, a
  compression lever already applied years earlier, a step-count assumption, and a play count
  taken from a status doc rather than from the doc. **The exit condition of a split is the
  measurement, not the edit** — re-cut and re-measure rather than assuming the seam is right.
- **A panel that measures 4.0 against a limit of 4.0 has not passed.** It passes today and
  fails on the next font change. Cut again.
- **A step name in prose is a citation and it stales silently.** Seven shipped on stage 03's branch,
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

- Refresh **Project state** and **Next round's scope** before pasting. Delete closed
  items rather than leaving them ticked.
- There is no longer a `[FILL IN: …]` line; the older note telling you to fill one in outlived
  the line itself, which is the failure mode this whole file is exposed to.
- **Untracked and deliberately parked**, so a new session does not read them as the round's
  material: `docs/superpowers/specs/2026-08-14-reference-hub-design.md` (a Reference hub
  design taken to four decisions and stopped on which cheatsheet leads slice 1 — it is
  tracked, and it rode into `develop` on the TD-12 branch by accident of session, not
  relevance), plus its three source files under `reference/`, which are still untracked.
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
