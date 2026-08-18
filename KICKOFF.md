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

### Project state (as of 2026-08-18 — **stage 05's doc round is merged to `develop`** as `9ef3763`, `--no-ff`, local only, NOT deployed; W-3 is still 4/18, since the port is a separate round that is next and has not started)

- **Playbook content:** all 18 stage docs written (`P-0`…`P-4`).
  **Caution:** the "18/18 pass the seven-section template check" and "124/124 links resolve"
  figures quoted in the tracker came from **ad-hoc P-4 scripts that no longer exist** (TD-5).
  They are not committed tests and nothing re-runs them. Do not cite them as having passed.
  What *is* enforced: `stage-metadata.test.ts` (each doc's H1 matches `stages.ts`, and every
  built stage has its `### AI in …` heading), `glossary.test.ts`, `stage-03-structure.test.ts`
  (pins that doc's fourteen subsections in order), `source-citations.test.ts` (D-42), and
  `ddl-sync.test.ts` plus `evolve.test.ts`, which hold three SQL blocks in the app to the doc
  character-for-character.
- **Web app:** `web/` — Next 16, TypeScript, Tailwind 4, no backend. **Stages 01 through 04 are
  complete, interactive and merged** — stage 04 landed at `bb3c119`, and
  `feat/stage-04-app-port` no longer exists. **Stage 05's doc is corrected and merged
  to `develop` (`9ef3763`), but its app port has not started** — `05-development` stays
  `ready: false` and absent from `STAGE_CONTENT`; the doc merge is what the port now builds
  against, not a substitute for it. 03 is 22 steps, 04 is 15. Fourteen
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
  gitignored on purpose (**D-63**). **Do not start W-6 content work** — the stage 05 doc branch
  is merged; the stage 05 port (W-3.5b) is the next active thing.
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
- **Stage 04 is shipped and merged**, and so is the debt its reviews opened.
  `04-project-setup` renders fifteen steps, all under the 3.2 ceiling. All four provisional
  D-65 pairs stayed split, since combined they measure 4.80, 5.40, 3.54 and 4.23 — **the
  first seam in this repo to survive measurement unchanged**, where stage 03 re-cut five of
  six. **TD-36, TD-39, TD-40 and TD-41 are all closed**, so no debt from that round is
  outstanding. Panel table and evidence: the W-3.4 row in `docs/tracker.md`; coverage map:
  `docs/stage-04-status.md`.
- **Stage 05's doc is corrected.** `docs/05-development.md` went from **249 lines across six
  `##` and nine `###`** to **587 lines across six `##` and twelve `###`** — the three new
  sections are `### Authorize reads, not just writes`, `### Loading and error states` and
  `### AI in development`. Twenty defects were found by three instruments run before the
  port (**D-54**), closed across twelve tasks plus a five-item fix wave, then re-verified:
  completeness went **8 BLOCKING → 0**, consultability **4/5 → 5/5**. Four new decisions,
  **D-68**…**D-71**. Full evidence is the **2026-08-18 W-3.5 (doc round, correction)** row in
  `docs/tracker.md`. **Merged to `develop` as `9ef3763`, `--no-ff`, 2026-08-18** — 29 branch
  commits plus the merge, `fix/stage-05-doc-corrections` deleted, and the merged result
  re-gated on `develop`: `pnpm lint`, `pnpm typecheck`, `pnpm test` (**64 files / 529 tests**)
  and `pnpm build` all exit 0. `develop` has since been pushed — `origin/develop` is at the
  same commit; `main` is untouched by this round. **D-74**
  records why the doc round merged before the port started rather than after: this project
  already paid the double-port cost once, on stage 03's W-3.1b.
- **The whole-branch review caught what eleven per-task reviews could not, including its own
  earlier fix.** Four blocking findings: a stale `getInvoice` readback in `docs/06-testing.md`
  that a per-task fix left inconsistent, a form input with no accessible name, the records below
  (this file among them), and — the one worth remembering — a *false claim a per-task review's
  own fix had introduced*, asserting `reset` is `undefined` in this Next version when the
  framework passes it alongside `unstable_retry` and the shipped docs give it a heading. All
  four are fixed. **A correction is not verified by the fact that a review directed it.**
- **Two agent claims were corrected rather than transcribed, and that is the transferable
  half.** The completeness reader justified a real finding with a mechanism that could not
  be confirmed in Next's shipped docs, and it was dropped while the finding stood on other
  grounds. Its low-confidence `tsc` guess was promoted to confirmed on evidence it could not
  see. **Do not transcribe a subagent's reasoning because its conclusion is right** — and
  the caution applies to a controller's own directed fix as much as to an agent's.
- **Stages 05–18** render a "sheet not drawn" placeholder. Routing works for all 18.
- **Quality gates live and proven** (`W-4` done): prettier (skips markdown by design),
  eslint at `--max-warnings 0`, **527 vitest tests across 64 files** in two projects — `unit`
  (node, data invariants) and `dom` (jsdom, render tests, `*.test.tsx`) — a **17-test playwright
  audit suite over 63 derived URLs** (51 stage, 12 reference), lefthook hooks, and CI. Branch
  protection is on; the repo is public (D-26). Re-derive these rather than quoting them.
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
  **Cut the next branch from `develop`, never from `main`.** `develop` carries every round
  since stage 03 — the stage 04 doc correction, `RevealList`, TD-12, the two W-6
  reference-hub merges, the stage 04 port, its two debt branches, and now the **stage 05 doc
  correction** — so a branch cut from `main` builds against a tree many rounds behind.
  **No branch is in flight.** `fix/stage-05-doc-corrections` merged to `develop` as
  **`9ef3763`**, `--no-ff`, 2026-08-18 — 29 branch commits plus the merge (30 on `develop`
  since `07c7045`), full gate green pre-merge, whole-branch review clean after four blocking
  fixes, then re-gated on `develop` after the merge (same four commands, all exit 0). The
  branch is **deleted**, per convention. `docs/05-development.md` is corrected on `develop`;
  the port is a separate round (**W-3.5b**), it has not started, and it is the next branch to
  cut.

  **Derive every position rather than reading one here.** Every version of this paragraph
  has gone stale, and the local `origin/*` refs are only as fresh as the last fetch:

  ```
  git fetch
  git log --oneline -1 develop origin/develop main origin/main
  git rev-list --count origin/develop..develop
  ```

  Two things known to be true at the end of 2026-08-18 and worth checking rather than
  trusting: `develop` and `origin/develop` were level at `24c412e` — the doc round is
  pushed — and **local `main` at `8d5045c` was behind `origin/main` at `5d76b8a`**,
  so something reached the remote `main` that this local repository has not seen.
  Reconcile that before any promotion.

  Two merged branches still sit on the remote and can be deleted:
  `origin/feat/stage-03-app-port` and `origin/feat/stage-03-standard-practices`.

### Next round's scope: port stage 05 into the app

**The doc round (W-3.5) is done and merged. The next round is W-3.5b, the port, and it has
not begun.** `fix/stage-05-doc-corrections` merged to `develop` as `9ef3763`, `--no-ff`,
2026-08-18, branch deleted, gate re-run green on the merged result. **No merge decision is
outstanding** — build the port against `docs/05-development.md` as it now stands on `develop`.

Read these before starting the port:

1. `docs/05-development.md` itself — **587 lines, six `##`, twelve `###`.** Read it as the
   port's source of truth, not as a cold reader; that pass has run twice and its findings are
   closed (`docs/verification/cold-reader-stage-05-run2.md`).
2. `docs/tracker.md`'s **2026-08-18 W-3.5 (doc round, correction)** row — what the twelve
   tasks, the fix wave and the whole-branch review each caught, and what is still deferred.
3. `CLAUDE.md`'s "Making a stage interactive" — the three-file trace (`web/src/lib/stages.ts`
   → `web/src/features/<stage>/` → `web/src/features/stage-content.ts`), read from the source
   rather than from a summary.
4. `web/PATTERNS.md` — **must be read before building the stage.** It catalogues which
   interaction pattern fits which content; the default is something the reader clicks, not a
   paragraph, and a stage that is only prose blocks is the anti-pattern this repo names.
5. `docs/learnings/stage-implementation-101.md` — the layout traps, the verification
   checklist, and the coverage walk added after stage 04's port.
6. `docs/stage-04-status.md` — what a finished coverage map looks like, as a model for stage 05's.

**What the port is working from.** The doc gained three sections this round —
`### Authorize reads, not just writes`, `### Loading and error states`, `### AI in
development` — and corrected several others (`'use client'`'s framing, the check-then-act
authorization example, the throw-vs-return contradiction). It is roughly a third of stage 04's
711 lines, so expect a seam well under fifteen steps; let the measurement say how much
smaller, the way D-65 did for stage 04. **D-35 already applies**: an "AI plays" section is
mandatory per stage, and `### AI in development` already exists in the doc, so the port
inherits it rather than inventing it.

**Two things carried from the doc round, worth knowing before the port starts:**

- **`getInvoice` has two defensible, different-looking shapes across documents** —
  `docs/05-development.md` takes the owner as a parameter, `docs/08-security-audit.md`
  derives it from the session internally — deliberately not harmonised (out of scope for a
  stage 05 branch to rewrite stage 08). The port only needs stage 05's shape.
- **A whole-branch review found a false claim introduced by an earlier per-task review's own
  fix** (`reset` wrongly said to be `undefined`; it exists and does a narrower job than
  `unstable_retry`). The lesson for the port: verify a framework claim yourself before
  transcribing it into a component, even one this doc round already "corrected" once.

**Thirteen minors were deferred out of the whole-branch review rather than fixed** — full
catalogue in `.superpowers/sdd/2026-08-18-stage-05-doc-corrections/final-branch-review.md`,
"Minor" and "Triage of the thirteen deferred minors". The two or three most likely to matter
to the port:

- **M9 — `<div aria-busy="true" aria-label="…">` in the `loading.tsx` block has no exposed
  accessible name** on a role-less `<div>`; the port's actual loading component should not
  inherit this. `role="status"` on the wrapper, or visible text, fixes it.
- **M3 — the doc's two route examples (`/invoices` and `/billing`) are now character-identical
  bodies**, but only `/billing` is downstream-consistent (`revalidatePath`, `loading.tsx`,
  `error.tsx`, `[id]/page.tsx`); the port needs to pick one route shape rather than port both
  literally and leave `/invoices` orphaned.
- **`InvoiceDetail` is imported in one code block and never defined anywhere in the doc** —
  the review's call was "leave it, but say so", not "produce it"; the port should not treat
  the missing component as something it owes the reader.

**One defect from this round's method, found in a document this round did not touch, worth
recording explicitly because it will bite:** `docs/06-testing.md`'s `### Integration tests`
uses `getInvoice` and `asUser` in its example block without importing either — the same
"excerpt with its imports and callers removed" defect class this round closed nineteen times
in stage 05, still alive in stage 06. Not this round's branch to fix; worth a future doc-round
finding rather than an assumption that stage 06 is clean.

### Three things stage 04 learned that will save this round time

**Walk the doc against the app, section by section, before believing a port is complete.**
This was the single most valuable check of that round and nothing in the gate can replace
it. On a branch already green on its whole gate and five closed reviews, it
found **five doc sections whose material the app never taught**, all sharing one shape: the
app told the reader to run a script or set a value it never showed them how to create. All
five had been assigned to a panel by the plan's own line ranges, so they were silent drops
rather than curations. The tell was visible in the numbers and I misread it — a panel median
of 1.74 against stage 03's 3.02 is a signal to go looking, not a compliment. The method and
the output shape are in `docs/learnings/stage-implementation-101.md` and
`docs/stage-04-status.md`.

**Nine plan defects were found by executing rather than reading.** A test that could never
pass, because it asserted `toContain` against a sentence the doc hard-wraps mid-clause. A
regex that counted nine traps where the doc has seven, because `DOC.indexOf('## Traps')`
matches §7's prose *about* `## Traps`. Material sourced to a section that does not contain
it. And every `.tsx` test in one wave written against `jest-dom` and `user-event`, neither
of which this project installs.

**A teeth check can lie, and so can a fix that reaches zero.** Two mutations "passed" on
that round without ever landing: a `perl -0p` without `/g` replaced a mention inside a
docblock, and an edit script that asserts before writing aborted and wrote nothing while
its earlier substitutions looked applied. Separately, a fix that drove twenty tab stops to
zero looked conclusive and was indistinguishable from a mechanism that always answered
"not focusable" — it needed the widths where the answer should *not* be zero.
`docs/learnings/quality-gates-101.md` has both.

**Read these first, in this order:**

1. `docs/05-development.md` — the corrected doc, 587 lines, six `##`, twelve `###`.
   **Do not read it as a cold reader** — that pass has run twice over and its findings are
   in `docs/verification/`. Read it as the port's source of truth, section by section.
2. `docs/learnings/stage-implementation-101.md` — the layout traps, the verification
   checklist, and the coverage walk added after stage 04.
3. `web/PATTERNS.md` — the interaction patterns and the render-test rule from TD-17, plus
   `InlineCode`, `RevealList` and `AnnotatedArtifact`. Read before building any stage.
4. `docs/tracker.md`, the **2026-08-17 W-3.4** row and **D-64**…**D-67** — how the last
   stage was measured and what it deliberately did not do.
5. `docs/stage-04-status.md` — what a finished coverage map looks like, and the shape to
   produce for 05.
6. `docs/superpowers/{specs,plans}/2026-08-1*-stage-04-*` — the freshest house example of a
   spec and plan, **read as an example rather than as instructions**.

**`docs/learnings/deploying-101.md` is no longer the raw material** — §8 has absorbed it, and
the round found one entry over-claiming it as a source for material it does not contain. Read
it for the incident, not as a specification.

**What the doc phase cost, as calibration for the port:** 28 commits (this file's own
commit not among them), three verification instruments (two runs each), twelve tasks
plus a five-item fix wave, and a whole-branch review that returned four blocking
findings after every task had already been reviewed clean. The doc is a third of stage 03's length. Expect the port to be smaller than stage
03's 106 commits, and expect the review to find something, because it has every time.

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
