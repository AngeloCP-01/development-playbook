# Development Playbook — Tracker

**Purpose:** the log. What actually shipped, what was decided and why, and what
debt was taken on. Scope and planning live in [task.md](task.md).

**Last updated:** 2026-08-13
**Current phase:** W-3, and it is the only `W-` milestone still open — stages 01, 02 and
**03 (Architecture)** are interactive, fifteen remain. Stage 03 is the densest and the
**solutions architect's home** — the audience stage 02 feeds but does not serve (D-37).

**The site is live** at https://acp-dev-playbook.vercel.app and verifies itself with
`pnpm test:prod` (W-5, complete 2026-08-11). **`main` is production**: work branches merge to
`develop`, `main` is reachable by pull request only, and every merge is asked about first —
the flow is written up in `CLAUDE.md`'s Git conventions.

**Stage 03's doc and its port are level, and merged.** `W-3.1` closed **TD-18**,
**TD-21** and **TD-22**, taking `docs/03-architecture.md` to **14 subsections**; the doc-gaps
round and two fix waves since have taken it to **1,507 lines**, running requirements → HLD → LLD. `W-3.2` then ported it: `web/features/architecture/`
holds **22 steps** against those 14 subsections, which is what closes TD-23's content half.

**W-3.1b's doc half is done** (`1db6344`…`3cd19c4`). Its content, plus the whole doc, lives on
`feat/stage-03-app-port` — the doc branch was merged **into** the port rather than into `main`
(**D-51**), so the port has one stable target and the new material gets ported once.
**`feat/stage-03-app-port` landed on `main` as `790b3e4`** (`--no-ff`, 106 commits, branch
deleted), doc and port as one unit. Coverage is tracked continuously in `docs/stage-03-status.md`;
that now reads all 14 sections ported.

**How it was raised.** An architecture-completeness audit against standard
practice found five clusters of widely-taught material missing from all eighteen docs
(**TD-25**): resilience patterns, consistency and concurrency, safe schema evolution,
statelessness and scaling, and fitness functions. Scope call is **D-49** — completeness beats
length for this stage, standard practice only.

**`W-3.2` and `W-3.3` are merged.** The port is a twenty-two-step stage, and its whole-branch review has run — seven blocking findings, all
fixed. `W-3.3` then closed the eight doc gaps that review and run 3 had recorded, and a
**fourth cold-reader run returned COMPLETE** — the first run to do so. A whole-branch
re-review found five more Important findings, all fixed. Commit counts and test counts belong
in the rows below, where they are re-derived against the tree rather than restated here.

**Merged.** `feat/stage-03-architecture` landed on `main` as `249bd9d` (`--no-ff`, 47 commits,
branch deleted) after a whole-branch review that returned *Ready with fixes* — six blocking
items and five minor, all resolved, including SQL that would not run and a checklist item
ticked for work deliberately deferred. **Pushed** — `origin/main` is at `249bd9d`, so the
long-standing local-only backlog is cleared and CI has a real branch to run against.

**Stage 04's doc phase is done and unmerged.** `fix/stage-04-doc-corrections` corrected
`docs/04-project-setup.md` from 323 to 711 lines and **closed TD-28**, which turned out to
name four of the thirty-one defects the round found. **The interactive port is done too**,
on `feat/stage-04-app-port` and also unmerged: `04-project-setup` is `ready: true` with
fifteen steps, taking W-3 to 4/18. Both rows below carry the evidence and both branches
are waiting on the user's merge decision.

Quality gates remain live: prettier (skipping markdown, see the build note below), eslint at
`--max-warnings 0`, **350 vitest tests across 37 files** in two projects — `unit` (node, data
invariants) and `dom` (jsdom, render tests) — a **16-test audit suite sweeping 36
URLs** (derived from the ready set since TD-12 closed; stage 03's twenty-two hashes were added by hand before that), lefthook, and CI. Everything
since `82a980b` was local until 2026-07-29, when `main` was pushed and CI ran green on the
stage 03 merge (`30426083363`). The stage 03 merge (`790b3e4`) and TD-23's close were **pushed on 2026-08-04**;
`origin/main` is at `2f42753`. `main` is now **7 commits ahead** — the TD-17 spec, plan, four
implementation commits and the merge `99f60cd` — and the user handles pushes. Two merged
branches still exist on the remote and can be deleted: `origin/feat/stage-03-app-port` (three
commits behind what was merged) and `origin/feat/stage-03-standard-practices`.

**The gate proved itself.** CI's first real run went red on a genuine bug — `PageProps`
is generated into `.next/types/`, so typechecking before building fails on a clean
checkout while passing locally forever. Fixed at the source with a `typecheck` script
both CI and the hook call. This is the exact class of bug CI exists to catch, and it
arrived unprompted on day one.

**The gate is now enforced.** Branch protection required making the repository public —
GitHub Free enforces rulesets on public repos only (D-26). CI history reads red, red,
green, green across the typegen fix. TD-10 closed; W-4 is fully done.

~~Next round: stage 03 and W-5's repo side are both done. The live choice is the next stage — 15 — Observability by `docs/task.md`'s order, 04 by this file's own argument that stage 03 is the template everything after copies — or finishing W-5 by deploying.~~ ✓ **settled 2026-08-11** in stage 04's favour, and its doc phase has since run. What is left of stage 04 is `RevealList` and the port; see Next up.

---

## Completed

Conventions ported from `SmartJobSearchCRM`: evidence cites a SHA, a count, or what a
review caught — never just "done". Every entry records what it deliberately deferred,
because scope creep is invisible otherwise.

| Date | ID | What shipped | Evidence | Deferred |
|---|---|---|---|---|
| 2026-08-18 | W-3.5 (doc round, verification and planning) | **Stage 05 measured before it is corrected, and the measurement is the deliverable.** `docs/05-development.md` is 249 lines and next to be ported, so **D-54** put the cold-reader pass before the port rather than after. Three instruments ran, two of them dispatched read-only and unable to see each other: a completeness reader given the doc and a houseplant-watering app to ship, a consultability reader given only the heading list, and a compiler. They returned **nineteen distinct defects**, and a twentieth was added when the user assigned read-path authorization to this stage (**D-69**). **Three were found twice by inputs blind to each other** — the Server Action importing two of its five symbols, `InvoiceTable` being named three times and produced never, and the bare `tsc --noEmit`. The doc's failure has one shape: its judgement is good and it scored **4/5** on consultability, but **its code blocks are excerpts with their imports and their callers removed**, and its checklist has drifted from its own body. The completeness reader could not produce a single compiling file for its first slice and could not finish the second at all. Scope set to full close by the user: the doc goes to roughly 600 lines and gains `### Authorize reads, not just writes`, `### Loading and error states` and `### AI in development`. **No correction has landed** — this row covers the verification and the planning only | **4 commits** `e1f1c86`…`042737e` on `fix/stage-05-doc-corrections`, cut from `develop` at `07c7045`. Records: `docs/verification/stage-05-doc-execution.md`, `docs/verification/cold-reader-stage-05-run1.md`, and the spec/plan pair. **The execution pass compiled the doc's three TypeScript blocks against the versions `reference/stack.md` prescribes** (TS **7.0.2**, Zod **4.4.3**, Drizzle **0.45.2**, React **19.2.8**) in a scratch project, because `web/` installs neither Zod nor Drizzle — assuming it did is the trap that put a whole stage-04 test wave on `jest-dom` and `user-event`. Two passes (**D-68**): literal returned **7 errors in the Server Action alone**, charitable returned **exit 0**, teeth-checked with two reverted mutations (`TS2322` feeding a uuid string into an integer column, `TS2339` on a non-existent field) and a restore back to 0. **Two suspicions were checked and dropped rather than shipped**: `tsc` still exists on TypeScript 7 (`Version 7.0.2`), and `z.string().uuid()` is not deprecated in Zod 4 — the schema was run against four inputs and rejected a bad UUID, a negative and a non-integer, so all three constraints it advertises are real. **One factual error confirmed against the shipped framework docs rather than argued**: `### Server Components by default` and `## Traps` both say `'use client'` opts a tree out of server rendering, and `01-app/01-getting-started/05-server-and-client-components.md` says Client Components and the RSC payload "are used to **prerender** HTML", rendering entirely on the client only on *subsequent* navigations. **The bare `tsc --noEmit` finding grew twice.** The cold reader rated it **low confidence** (it could see one document); the execution pass had already confirmed it from stage 04 and `CLAUDE.md`; and writing this row found it **violates D-25** — *"Typechecking goes through a `typecheck` script, never bare `tsc`"* — while `docs/11-ci-cd.md` teaches the same trap under `## Traps`, citing this playbook's own CI catching it. **Four places address the question and stage 05 is the only one that gets it wrong**, which no instrument on this branch could have found: it came from grepping the other docs. Consultability's single MISS was branch lifetime, stated in **three sections in three numbers** (two days, two weeks, a day or two) with "branch" appearing in no heading | **Deferred:** every correction. `docs/05-development.md` is **untouched** — no defect is closed, the doc is still 249 lines, and `05-development` stays `ready: false` and absent from `STAGE_CONTENT`, so **W-3 stays at 4/18**. The twelve-task plan is written and not started. **Two agent claims were corrected rather than transcribed**, which is the half of this round worth keeping: the completeness reader justified the throw-to-return finding by asserting Next masks Server Action messages with a digest in production, and that mechanism **could not be confirmed in the shipped docs and is not carried** (D-70 stands on the doc's own prose/code mismatch instead); and its low-confidence `tsc` guess was **promoted to confirmed** on evidence it could not see. **One rename refused on evidence**: `### Server Actions need validation and authorization` keeps its name because three anchor citations in `docs/03-architecture.md` and `docs/07-code-review.md` resolve against it, so the change would have cost three edits in shipped documents and bought nothing once read authorization got its own section. **Scope creep declared rather than hidden**: extending `source-citations.test.ts` to markdown anchors (**D-71**) is not a stage 05 defect, it is a gate hole this round exposed, and it was flagged to the user as separable before the spec was approved. **Plan self-review caught the round reproducing its own defect** — the `loading.tsx` block imported a skeleton component it never showed, which is exactly the `InvoiceTable` failure being closed — plus a `getInvoice` no task defined, which forced a stated rule into Global Constraints about which symbols a block must produce and which may stay scenery. **`KICKOFF.md`'s own count was wrong**: it called the doc "four `##` sections and nine `###` ones"; nine is right and there are **six** `##`. **Not run:** `pnpm build`, the audit suite and `pnpm test:prod` — nothing on this branch touches app rendering, and `pnpm test` is Task 1's business. **Not merged, NOT pushed.** |
| 2026-08-17 | W-3.4 | **Stage 04 is interactive, and the seam it shipped is the one that was measured.** `docs/04-project-setup.md` ported to `web/src/features/setup/` as **fifteen steps**, taking W-3 to **4/18**. Content is extracted as data first — eight modules, seven of them asserted against the doc at run time rather than against a count copied into a brief — then rendered by eight components, then assembled. The four provisional pairs from **D-65** (`scaffold`/`structure`, `env`/`client`, `ci`/`enforce`, `deploy`/`verify`) **all stayed split**, decided by arithmetic: combined they measure 4.80, 5.40, 3.54 and 4.23 against a 3.2 ceiling. That makes this the first seam in this repo to survive measurement unchanged — stage 03 re-cut five of six. **TD-36 closed** on three guards, not one (see its entry: the tuple alone closes half). `e2e/audit-pages.spec.ts`'s thirty-six-URL literal was **deleted rather than updated**, on the instruction in its own header | **23 commits** `394e515`…HEAD, **60 files, +5402/−191**. Tests **382/41 → 521/63**. Audit **17/17** against a fresh build each time, including contrast in both themes, no overflow 320→2560, zero console errors. Sweep re-derived rather than quoted: **157 expandables / 119 ids over 51 URLs**, from 140/107 over 36. Stage 04 prerenders to 228KB of static HTML; the derived sweep covers **63 URLs**. `gen:glossary` re-run and `reference/glossary.md` **byte-identical** — no term was invented. **Final panel table, all fifteen under 3.2, median 2.28 max 2.99**: scaffold 2.99, structure 1.81, format 2.67, strict 1.58, env 2.90, client 2.50, hooks 2.83, ci 2.35, enforce 1.19, deploy 2.94, verify 1.29, proof 2.28, ai 1.28, checklist 2.25, traps 1.57. **Six reviews ran and found 26 blocking items**, none of which the gate would have caught. The one that mattered: a coverage walk found **five doc sections telling the reader to run a script or set a value the app never showed them how to create** — `.nvmrc`/`engines.node`/`.npmrc`, the `test` script, `format:check`, Vercel's environment variables, and `SENTRY_AUTH_TOKEN` — all five assigned to a panel by the plan's own line ranges. That, not lean writing, is why the median was 1.74 before the fix wave and 2.28 after. Fixing it took `scaffold` to **4.25**, past the ceiling and past the audit's own 4.0 gate; it came down 4.25 → 3.47 → 3.34 → 2.99 in three measured steps rather than one guess. **Nine plan defects found by executing rather than reading**, including a test that could never pass (`PIN_RULE` asserted against a hard-wrapped doc), a regex that counted nine traps where the doc has seven (`DOC.indexOf('## Traps')` matches §7's prose about `## Traps`), material sourced to a section that does not contain it (only three of four blockers are §8's), and every `.tsx` test in Wave 2 written against `jest-dom` and `user-event`, neither of which this project installs | **Deferred:** the `## Artifacts` inventory was initially dropped and is now ported, but `Entry criteria` is still surfaced nowhere — consistent with stages 01–03, and recorded because stage 04's entry criteria carry the database decision that `tree.ts` and the `env` artifact both depend on. §1's no-`gh`-CLI fallback (create an *empty* repo in the web UI, then `git remote add`), §8's `/robots.txt` canonical-origin check, and the AI section's closing named-tools line are not ported. `AnnotatedArtifact` shipped without a copy affordance and with a tab stop on every line (**TD-39**, **TD-40**); both were closed the following day on their own branches, along with **TD-41**, so no debt from this round is still open. Two components hand-roll type roles the design system already names. **The whole-branch review then found five more blocking items, all fixed here**: three literal backticks rendering on the live page from the reference cards, which D-67 exists to prevent and which nobody re-grepped for after the commit that added them; a locked-option contrast pair at 2.62:1 and 3.21:1 (**TD-41** files stage 03's seven instances of the same idiom, unfixed because they are merged UI this branch does not own); an `artifacts.ts` docblock still describing the pre-fix state and instructing a reader to delete three of the fix; two record files still saying the port had not started; and a sweep figure of 151/113 measured two content commits early and written into four files under the words *re-derived rather than quoted*. `pnpm test:prod` **not run** — it measures the deployed site and says nothing about this tree |
| 2026-08-14 | W-3.4 (port planning) | **The stage 04 port's seam, measured rather than inherited.** The round opened with planning because the spec's Phase 5 table cut the doc nine ways when it was 323 lines and the correction phase took it to **711**. The tracker's own framing — four steps at roughly a hundred lines each — was the thing that needed checking, and checking it required knowing what a doc line costs on screen. **It costs nothing predictable.** Fitting stage 03's fourteen doc sections against their measured panels, with step count, code lines, prose lines and table lines as predictors, returns `screens = 3.068*steps + 0.0016*code - 0.0032*prose - 0.0531*table`: every content coefficient is noise and two are negative. §14 renders 145 prose lines in 2.29 screens; §1 renders 21 in 3.17. **Panel weight tracks step count and nothing else**, because an author fills a panel to about three screens whatever the step covers, by choosing what to collapse and what to cut. So the gate can falsify a seam afterwards and cannot choose one, which is **D-64**. What the measurements do carry is a **floor**, and the floor settles the question: `scaffold` (§1+§2) reaches **3.74** on chrome plus artifacts before a word of teaching, past stage 03's heaviest authored panel, and `gates` (§6+§7) reaches 3.00 while owing **seven** judgments. All four heavy pairings fail, and they fail on D-52's *first* clause rather than its threshold. Nine steps become **fifteen**, eleven firm and four provisional, and the provisional four are authored **split** and merged only on measurement — **D-65**, inverting stage 03, which authored merged and split on failure in five of six tasks | **2 commits** `dc47580`…`126b3c8` on `feat/stage-04-app-port`, cut off `develop` at `49122f5`. **The measurement is the evidence**: all **35 panels** across stages 01–03 measured at 1024×768 with the audit's own method (`#panel-<id>` height ÷ 768), giving stage 03 a median of **3.02** and a max of **3.88** over 22 panels, against 2.36 and 2.47 medians for stages 01 and 02. Per-unit costs taken off the same build: minimal panel chrome **1.70 screens** (`03#require` 1.68, `02#done` 1.69), a rendered code line **20px = 0.026 screens** (`t-data`, 14px/20px, as `SchemaInspector` renders it), a `<pre>` line **0.033** (12px/24px plus 24px padding), a figure **0.87 median** and 3.29 at worst. The first pass at the code number found four code units in three stages and was **wrong** — stage 03 renders DDL as per-line elements with `whitespace-pre`, not `<pre>`, so the classifier missed them; corrected by measuring the computed line-height rather than counting tags. The fit's data is **censored and is recorded as censored**: every stage-03 panel is post-reshape, so none can exceed 4.0, and the counterfactual comes from the pre-reshape record instead (`require` at **4.7** before `trace` split out, six of nine original panels failing). Spec amended in place with the original nine-step table kept and marked superseded; plan is **1,610 lines, sixteen tasks in four waves**, every data module carrying a test that reads `docs/04-project-setup.md` rather than a count copied into a brief. **NOT merged, NOT pushed.** | **The port itself.** `04-project-setup` is still `ready: false` and absent from `STAGE_CONTENT`; W-3 stays at 3/18. The execution approach was recommended and not chosen — subagent-driven for the eleven independent data and component tasks, inline for the two assembly tasks where the merge-or-split calls need the whole panel table in one context. **Two findings filed rather than fixed**: `count-expandables.mjs` sweeps 36 URLs where `audit-pages.ts` now sweeps 48, because W-6 appended `/reference` and eleven sheets to the audit's derivation and not to the `.mjs` copy that mirrors it (**TD-37**); and lefthook's pre-commit reported `format (skip) no files for inspection` on a commit touching two markdown files under `docs/`, so the format hook does not reach them (**TD-38**) — the same shape as the glob trap stage 04's own §6 teaches. **Two corrections rode along**: the spec's Verification cited a sweep baseline three moves stale (108 expandables / 36 URLs against a re-measured **140 / 107 ids**), and `docs/stage-03-status.md:3` held a stray committed line reading `test`. **Not decided**: which of the four provisional pairs merge. That is Wave 3's measurement and it cannot be answered before the panels exist |
| 2026-08-14 | W-6.2 | **The gathered original is shown on each sheet, and converted off GIF first.** Closes the **D-63** amendment: the transcription stays primary and the graphic sits below it, framed on a plate because every one of these has a light background and would punch a hole in the cyanotype unframed. **Not dimmed at rest** — the obvious dark-mode trick is to drop opacity until hover, but the reason the graphic is there is to be read, and dimming content to make it blend is the worse trade. **The two GIFs were static images stored as GIF**, which is why they collapse so far. Originals stay untracked and gitignored; git keeps every version of a binary forever, and the converted copy is what the site serves | **1 commit** `6b62634`, merged `--no-ff` as `4727dc3`, 12 files. **5.2MB → 644K**: `MasterPlan-Api-Design.gif` 3817K→196K (−94.9%), `Software-Architecture-Patterns.gif` 1024K→121K (−88.2%), the two JPEGs −34.2% and −30.6%. **Legibility verified by reading the converted file**, not by trusting the quality number — every label in the fifteen-step roadmap survives at 196K. **382/382 tests** (6 new), **17/17 playwright** including WCAG AA both themes over the sheets carrying images, lint/typecheck/format/build clean on the merged result. **Teeth-checked** the on-disk guard by typoing a src: failed with `ENOENT … git-commandz.webp`, naming the exact path. **A correction is on the record**: the first pass used a plain `<img>` reasoning that already-WebP files gain nothing from re-optimising, which missed `srcset`. `@next/next/no-img-element` caught it; the rule was right and suppressing it would have been wrong. Dark mode confirmed by driving the real theme toggle rather than asserting — the first two attempts wrapped the system→light→dark cycle back to system and were caught by reading the computed `body` background | Transcribing the three gathered sources into `design-patterns`, `api-design` and `git-commands` — content work now that the frame exists. Two of the three still have no post URL or author recorded, which has to happen before anything derived from them ships publicly. The figure registry and the six architecture diagrams as drawn figures rather than a photographed original |
| 2026-08-14 | W-6.1 | **A reference section beside the eighteen stages.** Lookup material had nowhere to live, and `reference/glossary.md` and `reference/stack.md` had been unreachable from the app since they were written — no route rendered either. `/reference` now holds cheatsheets as structured TS data behind one `CheatsheetView`, following the `terms.ts` precedent (D-36): TS is the source, `reference/cheatsheets.md` generates from it by snapshot test via `pnpm gen:cheatsheets`. **Eleven sheets are registered and ten are deliberately empty** — an empty sheet renders "Sheet not drawn" and is chipped WIP in the rail, so the index doubles as a worklist of what still needs gathering (D-62). Sheets tether to stages by slug, guarded by a test that every tether resolves. Rows are a CSS grid, not a `<table>`, because a table sets its own min-width from content and pushes the page into horizontal scroll at 320px | **11 commits** `1778bea`…`2114346`, merged `--no-ff` as `0207fd6`, 23 files, **+3175/−86**. **376/376 tests across 41 files** (26 new: 11 registry, 8 renderer, 4 sidebar, 2 sitemap, 1 snapshot), **17/17 playwright**, format/lint/typecheck/build clean — all re-run on the merged result, not just the branch. **Every RED was real and every teeth check bit**: breaking a stage tether failed exactly one test naming `git-commands → 04-project-setups`; replacing the placeholder branch with `null` failed only the placeholder test; renaming the nav landmark failed three and left the stage-index guard green. **The suite caught a real integration miss** — `audit-pages.spec.ts` asserts the derived sweep equals the frozen thirty-six-URL fixture, and twelve new reference URLs broke it. Padding the fixture would have converted a migration guard into a restatement of whatever the deriver returns, which its own docblock forbids, so the assertion was split: stage paths still compared against the fixture, reference tail asserted separately. **Measured at 320px**: document 312px against a 320 viewport, zero offending elements | Source graphics displayed on the sheets (**D-63**, needs an asset pipeline — files sit outside `web/public/`, and 5.1MB of static infographic is stored as GIF). The figure registry and the six architecture diagrams; the sheet carries rows only. Glossary and stack surfaced in the hub — the reason `/reference` beat `/cheatsheets` as a name, but not needed for the skeleton to stand. Stage→sheet backlinks; the tether is one-directional today. Search, already unscheduled at `docs/task.md`. Copy-to-clipboard on code rows, since nothing registered has code rows yet and a control with nothing to act on is untestable. Transcribing the three gathered sources into `design-patterns`, `api-design` and `git-commands` |
| 2026-08-14 | TD-12 | **The audit's page list is derived, not listed.** `e2e/audit.spec.ts` held thirty-six hand-written URLs; stage 02 added six by hand and stage 03 thirteen more during its reshape. The failure ran in the direction nobody checks — a dead hash fails loudly, a **missing** one audits nothing while the suite reports green, which is how a stage could ship unaudited. `e2e/audit-pages.ts` now takes stages from `STAGES.filter(s => s.ready)`, the same flag the router reads, and step ids from the rail each stage renders, since `Stepper` emits one tab per step as `id="tab-<stepId>"`. Neither source can fall behind the app. **A ready stage that renders no rail throws** rather than contributing nothing, because live and broken should fail rather than disappear | **4 commits** `03f08a9`…`33bc2f6` and one more carrying this row, 9 files, **+448/−77** through `33bc2f6` — two to the close, one from the review (below), one to the records. Four of the nine are the working files, all under `web/e2e/`; the rest are records, plus one parked spec that rode in on the fix commit and belongs to no part of this work. **RED was real**: `Cannot find module './audit-pages'` before the module existed, an unresolved import rather than a failed assertion. **The equivalence test spells out all thirty-six URLs rather than recomputing them** from the source the implementation reads — an expectation derived the same way as the thing it checks asserts nothing, the defect class recorded seven times in Process observations. **Teeth-checked** by flipping `02-planning` to `ready: false`: the assertion failed with seven URLs missing, and the guard test stayed green, so exactly the intended one broke. Measured at the close: audit **14/14 → 16/16** over the same 36 URLs; sweep unchanged at **140 expandables / 107 ids**; vitest 350/37, lint, typecheck and `format:check` clean. **The review then found two blocking items, both this branch's own.** `2eb3c97` corrected `KICKOFF.md`'s stale audit figures and in the same commit left the identical numbers standing one file over in `docs/tracker.md`; `PATTERNS.md` and `count-expandables.mjs` both still described the `PAGES` array this branch had just deleted, the second inside a comment the branch itself rewrote. Three fresh instances of the trusted-but-false claim TD-12's own entry names, about the mechanism TD-12 is about. The second is the better finding: `count-expandables.mjs` paired `slug:` with `ready:` by a greedy match, correct today only because `slug` happens to precede `ready` in all eighteen entries — which TypeScript does not require, prettier does not enforce and no test covers. Swap two fields and it reads one stage's flag off its neighbour, drops the stage after it, and prints a plausible count over the wrong set; the comment above it claimed it would fail loudly, and the guard caught parsing *nothing*, not parsing *wrong*. Writing the completeness check that closes it **found its own bug** — counting bare `slug:` picks up the field on the `Stage` type, so it threw on every run until it counted `slug: '` — which is the third defect on this branch found by running something rather than reading it. **Post-fix, the whole gate re-run over the finished branch on 2026-08-14**: `format:check`, `lint --max-warnings 0` and `typecheck` (after typegen) all **exit 0**; vitest **350/350 across 37 files**; audit **16/16 in 1.1m**; and the sweep, stood up on a cold server per TD-27, still reports **140 expandables / 107 ids across 36 URLs** — the same three numbers the `RevealList` round measured, so the derivation covers exactly what the hand-written list did | **It broke a tool, which is the more useful half.** `e2e/count-expandables.mjs` — added during the `RevealList` round to make the 140/107 baseline obtainable — derived its URLs by scraping `const PAGES = [` out of `audit.spec.ts`. Deleting that array broke it on startup, and **nothing in the gate noticed**: `pnpm test:e2e` reported 16/16 while the script threw, because it is a tool no suite runs. Found by running it. Repaired to derive the same way, duplicated rather than imported because it is plain `.mjs`. **Not closed: the other direction.** The sweep follows what the app renders, so a step deleted by accident leaves it silently. Stage 03 is covered by construction — its `Step[]` is typed against `STEP_IDS` — and stages 01 and 02 have no equivalent, now **TD-36**, closing most cheaply as part of building the next stage rather than as its own round. **One file on this branch is not this branch's work**: `docs/superpowers/specs/2026-08-14-reference-hub-design.md`, a Reference-hub design brainstormed to four decisions and then **parked**, riding in on `33bc2f6` because it was written in the same session. It is marked parked in its own first line and ends on an unresolved question — which cheatsheet leads slice 1 — so it decides nothing and blocks nothing; recorded here because a spec appearing in a branch it has no relation to is the sort of thing a later reader treats as context for the branch. Its three source files under `reference/` are still untracked. **Merged to `develop` `--no-ff` on 2026-08-14**, the commit straight after this row (`a07a9b6`), taking `develop` to **112 ahead of `main`**. **Not pushed** — `main` is untouched at `8d5045c`, and both the push and the promotion are the user's |
| 2026-08-14 | W-3.4 (`RevealList`) | **`RevealList` and `RevealFacet`, extracted from stage 03's duplicated accordions.** The branch was scoped to replace **five** and replaced **eleven**. The five were exactly the ones whose own header comments admitted the duplication (`EvolutionNotes` and `ScalingMoves` said so in prose and deferred the fix as "a change of its own"); the other six never announced themselves, so the scope came from what was documented rather than from what was there. A grep for the shared button className, run while confirming Task 7 had finished the five, found `ADRAnatomy`, `AIArchitecturePlays`, `ContractCost`, `Normalisation`, `SoftDelete` and `TraceForward` carrying the identical signature down to `Card className="p-0"`, `divide-y divide-line` and the button's full class string. **The user extended the branch rather than deferring them**, on the reasoning that finishing at five would leave six copyable originals in front of stage 04 — which is the thing this branch existed to prevent. Eleven components now call `RevealList` (**twelve instances**; `AIArchitecturePlays` renders its internal `PlayList` twice), and `src/features/architecture/` holds no bespoke **accordion** — no copy of the collapsed-row, chevron, `Card p-0`/`divide-y` shape this branch existed to unify. It does still hold three hand-rolled **disclosures** (`ERView`, `InternalOrganisation`, `RouteShape`), which are a different pattern and were never in scope: single-open selected tiles in a grid, no chevron, no divider list. Not missed migrations, and named in `PATTERNS.md` so a stage-04 author does not read the folder as accordion-free and copy one. **Two shared components were widened** for two callers that genuinely did not fit, and both were **reported rather than forced** on first contact: `RevealRow.title` went `string` → `ReactNode`, because `AIArchitecturePlays`' claim rows are `text-sm` (14px measured) and `RevealList`'s fixed title slot renders at 17px, so migrating as-was would have grown every claim; and `RevealFacet` gained a `bodyTone` override, because one block per `ADRAnatomy` row is `text-fg` where the component hardcoded `text-muted` — different tokens in both themes, not a near-match. **Two visual changes, both deliberate, both declared in a commit subject before they landed**: `DeferredList`'s and `ContractCost`'s badges moved from below the title to beside it, because that is where the shared slot puts them. `TeamNotes` moved to `src/components/` (TD-13 made it every stage's convention), and `PATTERNS.md` now documents all three components including both of `RevealList`'s known hazards | **37 commits `437e945`…`23ecb10`** off `dd44b30`, 26 files, **+1675/−979** — 31 to the last migration, then **six from the whole-branch review** (below). The direction is the point: `src/features/architecture/` is **439 added against 1015 removed** across 13 files, `src/components/` **629 added** across six (`RevealList` 143 lines, `RevealFacet` 73, three test files, plus `TeamNotes` relocated). **vitest 332/33 → 350/37**, the four new files being `RevealList.test.tsx`, `RevealFacet.test.tsx`, `RevealFacet.source.test.ts` and `ScalingMoves.test.tsx`; test-file count verified against the tree at both ends with `git ls-tree`. **The equivalence proof is the sweep, not the suite**: `e2e/count-expandables.mjs` reports **140 expandables across 36 URLs and 107 distinct panel ids**, identical before the first migration and after the last, which is what distinguishes "eleven migrated" from "one silently renders nothing". Audit **14/14**, lint clean at `--max-warnings 0`, typecheck and `format:check` clean, build exit 0. **Every task was reviewed read-only in a fresh context and the reviews did the load-bearing work**: Task 10's returned **spec ❌** on a rendering regression no check on this branch could see, and reviewers reproduced findings independently rather than trusting reports — byte-identity across all twelve call sites by sha256 and djb2, badge coordinates to six decimal places, React's own source read to confirm the key-validation mechanism, and one throwaway unwrapped build stood up on a spare port purely to reproduce a 24px gap. **Seven checks that could not fail** were found and are recorded in Process observations, because that is the transferable half of this branch | **Not fixed, opened as debt:** `RevealList` hardcodes `<h3>` for row headings, flattening the outline for any caller whose section heading is also `<h3>` (**TD-34**); the audit's zero-console-errors test runs a production build and is structurally blind to dev-only React warnings (**TD-35**). **Not converted, and not debt:** the four hand-rolled disclosures in stages 01 and 02 (`ValidationLadder`, `AIWorkflow`, `WorkedExample`, `AIPlanningPlays`) each keep a single row open, so converting one is a behaviour change needing its own decision, now stated in `PATTERNS.md` rather than left implicit. **Left open:** TD-12 (the audit's hand-maintained `PAGES`), deliberately sequenced *after* this branch by user decision because it rewrites the file Tasks 5–8 verify against and would have moved the 140/107 baselines for an unrelated reason; TD-27 (a reused server serves a stale build), which bit an implementer mid-branch and cost one wrong measurement; and Task 15's minor, that `typeof row.title === 'string'` also drops the `font-medium` wrapper for a bare number or array, which no caller exposes. **Not advanced:** the stage 04 port. `04-project-setup` is still `ready: false` and absent from `STAGE_CONTENT`. **Whole-branch review run, and it earned its place**: seventeen per-task reviews had passed, and it still found two blocking defects neither could see. **I1** — the React key warning Task 16b was believed to have fixed was still live on `#tenancy`, `#trace` and `#indexes`; Task 16b keyed the row header's two sibling children and left `Card`'s three (`{header}`, `<ul>`, `{footer}`) unkeyed, and the test could not see it because its `jsxDEV` mock was scoped to the row-header span by className. Every live check on record had loaded `#ai` only, which passes neither slot. **I2** — a *third* visual change, undeclared: Task 5 moved `ScalingMoves`' four catch labels from `t-label` to a `RevealFacet` label (JetBrains Mono 11px/500 → Newsreader 12px/600, each label 448.78px → 498.24px), the exact swap `Normalisation` and `SoftDelete` had both written header comments refusing. Reverted, so "two visual changes" stays true rather than being amended into three. Four minors also fixed, all records-accuracy: a hypothetical stated as history in `PATTERNS.md`, a stale "the one visual change" comment, this row's own accordion claim, and TD-35's stated minimum comment. **The fix round drew the wrong lesson and the final re-review corrected it**, which is worth keeping in both halves. The fix round reported that the live dev probe only has teeth on a *cold* server, since Fast Refresh supposedly rebuilds without re-running React's creation-time key validation. **Disproved across three cold-server runs**: reverting the keys under a running server and reloading *does* warn, every time, once the rebuild settles. The real blind spot is narrower — Fast Refresh patching an already-open tab with no reload, and a reload that races an in-flight rebuild. The duller explanation is the true one: **every manual check loaded a single page**, and `#ai` exercises neither `header` nor `footer`. Corrected in `audit.spec.ts` and in TD-35 rather than rewritten away, because a wrong mechanism inside a comment written to explain a blind spot points the next reader at the wrong variable. Post-fix: vitest **350/37**, audit **14/14**, sweep still **140/107 across 36 URLs**, lint and typecheck clean. **NOT merged, NOT pushed** |
| 2026-08-13 | W-3 (04 doc) | **Stage 04's doc-correction phase.** `docs/04-project-setup.md` 323 → **711 lines at `38765e7`**, and **TD-28 closed as a subset of itself**: it named four defects, all in §8, and the round closed **31** across every numbered section, plus `## Artifacts` and `## Definition of done`. Three instruments ran in sequence and each found what the one before it structurally could not — reading the doc (8), executing every runnable block in a scratch directory (5 more), and a cold reader handed the corrected doc and a task to finish (14 more, 10 boundaries classified out and untouched); per-task reviews found the last four. `reference/stack.md`'s Node row now names the file each environment reads instead of the environment, which is the generalisation the whole defect rests on. `### AI in project setup` exists, so `stage-metadata.test.ts` covers 04. **The port has not happened**: `04-project-setup` is still `ready: false` and absent from `STAGE_CONTENT` | **37 commits `859a1b8`…`1418c77`**, 9 files, +3307/−40, counted against the tree as this record was written, so the range ends where the work ended and excludes the record commits that carry it — `git rev-list --count develop..HEAD` is the branch total, and it moves every time this row is edited. **332/332 vitest across 33 files** (331/33 before; the +1 is `AI_SECTION_STAGES` gaining `04-project-setup`), lint clean at `--max-warnings 0`, typecheck clean after typegen, `pnpm gen:glossary` re-run with `reference/glossary.md` byte-identical, and a fixed-string grep for the old *matches .nvmrc* sentence returning nothing doc-wide. **`format:check` passes and is not evidence about any prose here**: `web/.prettierignore` excludes `*.md` and prettier reports success on an empty match set, confirmed by feeding it a deliberately malformed markdown file and watching it pass, so on this branch it covers exactly one `.ts` file. **Task 1 ran the doc rather than reading it** — `docs/verification/stage-04-doc-execution.md`, 15 rows scored `6 CURRENT · 2 STALE · 3 WRONG · 4 not executed`, the score extracted by a pasted re-runnable command and recounted independently by the controller on a different `awk` field. Raw exit codes: an impossible `engines` range gives `WARN Unsupported engine` and **exit 0**, so "makes pnpm refuse to install" was never true without the `engine-strict=true` the doc never sets; `lefthook run pre-push` **exit 1** with two `ERR_PNPM_RECURSIVE_EXEC_FIRST_FAIL … not found`, because stage 04 wires a gate onto scripts it never creates; the `prepare` guard reproduced at **exit 1 / exit 1 / exit 0** across a bare invocation, `CI=1 VERCEL=1`, and the `\|\| true` form. **Task 3's teeth check ran three times with no invented test file in the scaffold for any of them:** BEFORE exit 1 (`not found` ×2) → INTERMEDIATE exit 1 (`No test files found, exiting with code 1`, the same defect one link further down the chain) → AFTER **exit 0** with zero test files. **Task 4 proved the `engines` format instead of adopting it**: `22.x` with Node v22.19.0 → exit 0, `23.x` with the same Node → `ERR_PNPM_UNSUPPORTED_ENGINE`, exit 1, so the local guard survives the change to Vercel's documented form. **Task 6 had a real RED** — `AssertionError: 04-project-setup has no "### AI in ..." subsection`, `1 failed \| 21 passed` with the title-sync test still green, teeth-checked by renaming the heading to `### AI for project setup` (one failure, same assertion) and reverting to `22 passed`. **Cold-reader run 1 ran before the port** (`docs/verification/cold-reader-stage-04-run1.md`): completeness `3 BLOCKING · 20 NON-BLOCKING · 8 BOUNDARY`, reclassified to **14 defects, 10 boundaries, 12 prioritised entries**, four of the nine drops disproven by this branch's own execution file; consultability **3/5** against stage 03's 4/5, and its MISS was verified as **this round's own doing** via `git show develop:` rather than assumed. Its review found a dropped row **by arithmetic** — 11 claimed entries against 10 actual — which no amount of re-reading a 218-line record produces. **All twelve entries closed**, three not as specified: entry 4 refused to add `.next/` to `.prettierignore` because Prettier reads `.gitignore` too and the instruction would have taught something false; entry 10 closed by verification with no edit; entry 11's cited source was checked and does not contain the material (`grep` for rollback, roll back, promote and previous deployment across `deploying-101.md`'s 139 lines returns nothing), so §10 now points at `docs/13-production-deployment.md`. **The fix wave executed rather than reasoned.** `SESSION_SECRET` blanked → HTTP 500 carrying the Zod `too_small` thrown from `env.ts` at module evaluation, restored → 200. A `'use client'` component importing `env` **builds clean, serves correct HTML, and dies in the browser** on a three-issue `ZodError`, with the secret's value in none of the 10 client chunks — so the cold reader's "secret leak" premise is wrong and the real cost is that every gate this stage wires stays green. With §6's globs as printed, `lefthook` reported `format (skip) no files for inspection`, exited green, and left three files `prettier --check .` then rejected; widened, all three were rewritten and re-staged at exit 0. **The `engines.node` overrides-the-dashboard claim rests on Vercel's own documentation, and this row had the ranking backwards until the whole-branch review** — it read "evidenced from W-5… corroborated against Vercel's own documentation", and the reverse is true. `docs/superpowers/specs/2026-08-04-w5-deploy-design.md:21` *asserts* the override in prose, `docs/learnings/deploying-101.md` asserts it again, and neither records a deploy where the dashboard held one major and `engines.node` won, so W-5 corroborates. The primary source is https://vercel.com/docs/functions/runtimes/node-js/node-js-versions, which defines `engines#node` as the way "to override the one you have selected in the Project Settings" and states the case outright: Project Settings on **20.x** with `24.x` in `package.json` deploys **24.x**. This branch's own execution file evidences none of it — `stage-04-doc-execution.md` §8 is marked *not executed*, there being no Vercel account on this machine — and citing it would have recorded a check that never ran as evidence, which is the exact failure this round spent itself finding. **The round reversed itself once, on the record**: entry 12 escalated N2 to live (pnpm 11 shipped mid-round, so `corepack use pnpm@latest` writes `pnpm@11.21.0` against `stack.md`'s `10.x`) and pinned `corepack use pnpm@10`; the whole-branch review reversed both, because `stack.md` calls its versions "floors, not pins" and calls a version number in a stage doc a bug in the stage doc, so `@latest` was compliant and the pin was the deviation. `@latest` restored, and the sentence above it — which had promised something the command never did — is what was actually wrong. **Whole-branch review of the fix wave: eight findings** (3 Important, 5 Minor, 2 record-only), all addressed in 6 commits `b77a21e`…`1418c77`, two sources re-fetched rather than taken on trust and the review right both times. **A second whole-branch review, over the finished branch, returned seven more** (4 blocking, 3 recommended) and made the same observation each time: not one is a defect in what the branch *asserts*, since every claim checked out, but a consequence of the branch's own corrections that nothing on the branch followed through on. All seven closed in 7 commits `d056b9e`…`4cca648`, report at `.superpowers/sdd/2026-08-12-stage-04-doc-corrections/final-fix-report.md`. Its two mechanical checks both held: `git cat-file -t 79ef7a7` still answers `Not a valid object name` (exit 128), and the GitHub API still returns `v7.0.1` / `v6.0.10` / `v7.0.0` for the three actions §7 pins | **The port itself.** `04-project-setup` stays `ready: false`; `RevealList` is not extracted; W-3 is not advanced. **TD-27** (stale e2e server) and **TD-12** (hand-written audit `PAGES`) were declined as non-goals up front and are still open. **TD-29** and **TD-30** were opened during the fix wave rather than closed — the Vercel rollback commands now live in two stage docs, and §5 still installs Vitest under an environment-variables heading, which needs a new numbered section. **`docs/11-ci-cd.md` was not edited and now disagrees with §7**, which pins the three actions at v7/v6/v7 while 11 still pins all three at `@v4` and sends its reader nowhere useful — §7's own opening line links there. Editing 11 was a non-goal at spec time and stayed one; the divergence is **TD-31**, opened by the whole-branch review, which found it on no deferred list at all. An unnoticed deferral is not a deliberate one, and this list only means anything if the difference is kept. **The ten boundary items stand untouched**: the completeness run's eight (test content → 06, `--passWithNoTests` removal → 06, full CI/CD → 11, documentation depth → 10, observability past first-pass error tracking → 15, repo naming → 01, structural decisions → 03, CODEOWNERS and `CONTRIBUTING.md` → "Scaling to a team") plus N9 and N13. **Nine NON-BLOCKING items dropped**, four of them disproven by this branch's own execution run. **One addition dropped for lack of evidence**: that GitHub offers a status-check name only once it has reported, true in memory and unsupported by two passes over GitHub's own branch-protection docs, with no runnable check available here. **Not executed, and labelled as such rather than implied**: `vercel link` and every dashboard setting (no account), the Sentry wizard (no org login), `gh repo create … --push` end to end (it would create a real repository under the user's account), and an actual `vercel rollback`. **Two hazards found and not fixed, now numbered**: Turbopack does not re-evaluate `env.ts` when `.env.local` changes, so **a reader testing their own env validation without restarting gets a false pass** — a check that cannot fail, placed in the reader's hands, and §5 says nothing about it (**TD-32**, rated High alongside TD-26 and TD-27, which are the same defect on our side of the line); and §9 may install Sentry twice, once directly and once via the wizard, which needs a wizard run against a real org to prove (**TD-33**, Low). Both were carried in this cell alone until the whole-branch review, which is the objection: debt is ranked by cost and revisited, and a hazard in a table cell is neither. **Per-task minors carried rather than fixed**: Task 1's `docs(setup)` scope against the stage-slug convention and its "on any pnpm version" cross-version claim tested only at 10.33.0; Task 2's citation of a dispatch-time resolution a reviewer could not find; Task 3's M1 and M4–M7, plus `2db28ce`'s commit message overclaiming what had been verified at the time, left uncorrected because history is appended to rather than rewritten; Task 4's five, including `79ef7a7` sitting on the line annotated `→ "commit"` when in the real incident it returned the opposite; Task 5's M1 and M2; Task 6's dropped ", so this is actionable" clause; and the fix wave's M5 (entry 3's trio-order provenance overclaimed, membership right and order wrong) and M8. **Cosmetic, all pre-existing**: `## Entry criteria`'s first two bullets at 97 and 99 columns, and the doc citing its own sections two ways (`§1` in three places, `### 1. Scaffold` in one). **This repository's own `lefthook.yml` still carries the narrow globs the doc just widened** — defensible for markdown, since `web/.prettierignore` excludes it from CI too, with a genuine one-file residue in `pnpm-workspace.yaml`, currently clean. **The humanizer ran over entries 1–6's prose (`93d881f`), was declined for 8b's and the fix wave's, and the whole-branch review reversed that** — the argument had been that the text already cleared a review, which is circular, since the pass is part of *done* under CLAUDE.md and its own output is what a review reads. Run over the whole document afterwards, it came back near-empty, which was the predicted and the correct outcome: em-dash density 5.9 per 100 lines on `develop` against 6.4 here, so the additions match the original's habit rather than inflating it; zero hits across the AI-vocabulary list; no superficial `-ing` tails, no copula avoidance, no filler or hedging, no signposting, and every `now` outside one line reading as the reader's own sequence rather than as narration of a diff. Three edits landed and all three were in prose written that same session: one genuinely diff-anchored sentence in §7 that told the reader what the branch had changed, one manufactured closer in the same paragraph, and one overclaim in §8 that no value could be copied from `.env.local` when only the URL cannot. **The skill's blanket "cut every em dash" was declined on the record**, as the skill itself allows: this is the house voice across all eighteen stage docs and CLAUDE.md, and stripping 48 of them from one document would leave it matching none of the others. **Not merged, not pushed** |
| 2026-08-11 | W-5 (verify) | **Post-deployment verification**, closing W-5's last open item. `pnpm test:prod` and `playwright.prod.ts` — no `webServer`, remote `baseURL`, `@smoke` tag, `retries: 2` because a remote host flakes where a localhost server does not. Five checks, each chosen by one rule: it must test something a local or CI build structurally cannot. That excluded contrast, overflow and panel weight, since the bytes CI checked are the bytes Vercel serves | 4 commits `5e348ca`…`c231501`, merged as `a977e17`. **5 passed** against the live site; **331/331 unit across 33 files**, lint, typecheck and `format:check` clean; `pnpm test:e2e` still **14 passed** and never reaches production, via `grepInvert` — which was verified by running it, since whether `grepInvert` matches the `tag` option rather than only the title was the one thing the plan could not settle by reading. Every check teeth-checked: `PROD_URL` at the old wrong hostname, an asserted origin of `example.com`, a 20-entry sitemap, an inverted status condition proving all 19 requests happen, a wrong stage title, and an injected `console.error` | **Not automated in CI** — a push to `main` and a live deployment are not simultaneous, so it needs a wait-for-deployment step, which is the usual source of flake. **No deployed-commit check**: it needs a build-stamp surface and Vercel's system env vars exposed, and the sitemap-resolves check covers most of the risk for free. **No Sentry, error rates or latency baselines** — `docs/14` asks for all three and they belong to `15 — Observability`, which is unbuilt. **The origin is now in two files** (`site.ts` and `playwright.prod.ts`); a Playwright config cannot import from `src/`, and `PROD_URL` overrides it, but if the domain changes both move. **A stage title is hard-coded** in the render check while titles are single-sourced in `stages.ts` (D-36) — accepted rather than fixed, because `audit.spec.ts` imports nothing from `src/` either and the no-import rule was written for `SITE_URL`, which varies by environment as a title does not | **A whole-branch review found one of the five checks decorative.** `/Allow:\s*\//i` was unanchored, so `Disallow: /admin` contains `allow: /` and the check passed against a `robots.txt` with no `Allow` directive at all — in a suite whose entire rule is that each check earns its place, and the missing teeth check is why it survived. Both robots assertions are now anchored, and the origin assertion moved off `toContain`, which admitted a longer hostname and, worse, the doubled slash a trailing-slash env var produces. Both closed with controlled-origin teeth checks serving deliberately wrong artefacts |
| 2026-08-11 | — | **TD-16 closed: worksheet placeholders reach AA, and the audit can see them.** The `/70` opacity dropped from all three worksheets — `--faint` was already tuned to 4.80:1 light / 7.93:1 dark, and the call site was discarding it. The audit's colour handling switched from parsing to **rasterising**, which fixes two blind spots at once: `oklab()` values were being skipped rather than checked (Tailwind emits oklab for every alpha modifier), and placeholders were never sampled at all because the sweep keyed off `el.textContent` and an empty field has none | The suite now reproduces the hand-measured numbers independently — **2.77:1 light, 4.44:1 dark** on all three worksheets — and nothing else fails on 36 pages in either theme. RED before the fix, GREEN after, teeth-checked by restoring `/70` on one worksheet and confirming only that page failed. 331/331 unit, 14/14 audit, lint, typecheck, format clean | Alpha-colour *backgrounds* are still resolved by the old parser, so an `oklab()` background still walks up to an opaque ancestor rather than being composited. No failure depends on it today; recorded rather than fixed. `docs/14` post-deployment verification still open |
| 2026-08-11 | W-5 (live) | **Deployed.** `https://acp-dev-playbook.vercel.app`. The repo side was done on 2026-08-04; getting a live site took three dashboard problems the repository could not express and this round did not predict — the project was connected to a placeholder repository, its Framework Preset was *Other*, and Root Directory was unset | Verified against the running site rather than the dashboard: `/robots.txt` returns `Allow: /` and names the sitemap; `/sitemap.xml` carries **19** `<loc>` entries on the real origin; `/stages/03-architecture` renders with the `%s · Development Playbook` title template applied. CI green on `main`. **The guessed origin was wrong** — `acp-dev-playbook`, not `acp-development-playbook` — which `NEXT_PUBLIC_SITE_URL` corrected in production before it reached anyone; the fallback in `site.ts` is now the verified value | **Post-deployment verification per `docs/14` still open**, and now unblocked for the first time: the audit suite assumes a local server on `:3100`, so pointing it at a deployed URL is its own slice. No CSP, no Open Graph, no custom domain |
| 2026-08-04 | W-5 (repo side) | **Deploy preparation.** `engines.node` pins the version Vercel actually reads — `.nvmrc` reaches local and CI only, so the one host that serves users was unpinned. One `SITE_URL` feeds `metadataBase`, `sitemap.ts` and `robots.ts`, because a deploy round that writes an origin into three files has built the drift it exists to prevent. Sitemap derives its 19 URLs from `STAGES`. Five `create-next-app` SVGs deleted from `public/`, unreferenced since W-0 — the directory itself is now gone | 3 commits `b9088c4`…`d15c1dd`. **331 tests across 33 files**, lint, typecheck, `format:check` clean, `pnpm build` with **no `metadataBase` warning** and `/robots.txt` + `/sitemap.xml` in the route table. Generated output read rather than inferred: `.next/server/app/sitemap.xml.body` carries exactly **19** `<loc>` entries, `robots.txt.body` reads `Allow: /` and names the sitemap. **audit 14/14** against a fresh build with `:3100` killed first (TD-27). Nine teeth checks in total, each failing alone — a trailing slash on the origin, a stage dropped from the sitemap, `Disallow: /` in both its string and array spellings, a probe file in `public/`, a `favicon.ico` in `public/`, an unguarded `prepare`, a wrong `engines.node`, and `metadataBase` deleted | **Deployed 2026-08-11** at `https://acp-dev-playbook.vercel.app` — see the W-5 (live) row above for what the deploy itself cost. Root Directory `web` was the blocker this round predicted. **A whole-branch review found the round had missed an earlier blocker entirely**: `prepare: lefthook install` exits 1 without a `.git`, Vercel's build environment has none, and pnpm runs `prepare` on every install — so the deploy would have failed at the install step, before Root Directory mattered. Fixed with `|| true` and guarded. The same review found the recorded `metadataBase` evidence vacuous: the build warning it cited fires only for relative Open Graph images, which this app deliberately has none of, so it could not fail either way. **No CSP**: the theme script runs via `dangerouslySetInnerHTML` before first paint, so a policy needs a nonce or hash and a wrong one ships a blank page — its own change, with its own verification. **No Open Graph or OG image**, scoped out. **No post-deployment verification**: the audit suite assumes `:3100` and cannot be retargeted until a deployment exists |
| 2026-08-04 | — | **Component test harness (TD-17).** `vitest.config.ts` split into two projects — `unit` (node, `*.test.ts`) and `dom` (jsdom, `*.test.tsx`) — so the extension picks the environment rather than a per-file docblock somebody has to remember; `extends: true` is what carries the `@/*` alias into both. Three dev dependencies (`jsdom`, `@testing-library/react`, `@testing-library/dom`); `jest-dom` and `@vitejs/plugin-react` deliberately not added. A written convention in `web/PATTERNS.md` and `CLAUDE.md` says which components get one | 4 commits `83ed997`…`3d5b147`, merged as `99f60cd`. **320 tests across 29 files** (was 313/26), lint, typecheck and `format:check` clean, `pnpm gen:glossary` re-run with `reference/glossary.md` byte-identical, e2e still 14/14. Both render tests **teeth-checked by injecting the defect they exist to catch** — gating the interrogation's reasoning on `correct`, and making `fieldName` return its argument unchanged — each failing alone out of the full suite and reverted. RED for the harness itself was real: the `.tsx` file matched no `include` glob until the config changed. **A whole-branch review then found the harness's first real customer on the same branch**: `ModelInterrogation` told readers “Five questions” while rendering six, having gained one when the doc did — a data test asserts the length and is perfectly happy, and the audit suite never reads the sentence. Fixed test-first. The review also raised two blocking record defects (the tracker header contradicting the row below it; three dependencies landing with no `reference/stack.md` entry) and eight minors, all closed here except two recorded deferrals | No backfill across stage 03's remaining components; the three Playwright stand-ins in `audit.spec.ts` stay, since deleting a real-browser check on the strength of an hour-old jsdom one has no evidence behind it. `matchMedia` is still unstubbed — jsdom does not implement it, and the first component that needs one adds it to `src/test/setup.ts`. **Two findings deferred rather than fixed:** `jsdom@30` declares `engines: node ^22.22.2`, and this machine runs 22.19.0 while `.nvmrc` pins the floating major `22` — nothing enforces it and all 320 tests pass, but the repo now carries a dependency whose floor its own dev Node misses, and bumping `.nvmrc` changes an environment rather than a file, so it is the user's call. And the six render-testable components stage 03 already ships are still uncovered — the backfill non-goal stands |
| 2026-08-03 | W-3.3 | Stage 03's **eight recorded doc gaps**, cold-reader **run 4**, and the whole-branch **re-review**. The gaps were the residue of three rounds: normal forms named and never defined, soft delete shown as one mechanic with no choice posed, the filter half of soft delete missing entirely, the tenancy tables, the partial unique index that is the only way to express "at most one approved claim per shift", the third-party-call cadence, the pull-import contract row, and the container diagram's auth box. Doc **1,346 → 1,507 lines**, app 22 steps unchanged — every gap landed inside an existing panel under D-52's four-screen rule, three of them behind expand-to-reveal (D-49) | 15 commits `c080be1`…`5afbe09`. **Cold-reader run 4: COMPLETE**, 4 stalls / 8 guesses, against run 3's "PARTIALLY" — `docs/verification/cold-reader-stage-03-run4.md`. Its fix wave got a **D-48 verification pass on a live Postgres 17 cluster**, which confirmed the partial-index and soft-delete claims. The **whole-branch re-review then found five Important**: the headline (**I1**) was a backfill instruction telling the reader to paginate a `WHERE col IS NULL` loop by remembering the highest id touched — the guard shrinks the candidate set every pass, so a keyset cursor skips exactly the rows the previous pass rewrote. Proved by running it: **5000 of 5000 rows silently unmigrated**, reported as success; the corrected instruction reports zero after six iterations. **I4** was three separate sentences hand-counting "six boxes" against a diagram of eight, one of them calling all six "not yours" in the same breath as explaining that one is skipped *because* it is yours. All five plus six minors fixed in `5afbe09`; **313/313** vitest across **26** files, **14/14** audit over 36 URLs, lint and typecheck clean, every new test teeth-checked by breaking its claim and confirming only that test fails | **M5** — 2NF is unviolatable under the `uuid` primary keys every DDL in this stage uses, so the worked 2NF example keys on `(invoice_id, line_no)` and nothing else does. Run 4 filed the same thing under "genuinely unusable". Fixing it means either changing the example's key or teaching why surrogate keys make 2NF vacuous, and both are content decisions, not patches. **M6** — the archive table's "when volume is the problem" gives no threshold. Also still open: the sixteen minors from the previous whole-branch review; **TD-26** (the audit green about surfaces it never evaluates) and **TD-27** (the second `test:e2e` of a session measures a stale build), both opened during this round |
| 2026-08-03 | W-3.2 | Stage 03's **app port**, closing TD-23's content gap and TD-25's app half. `web/src/features/architecture/` went from the **six** steps `W-3` shipped — `W-3.1` was doc-only (D-46) and left the app untouched — to **22**, mirroring all 14 doc subsections across **24** numbered figures. Ships **D-52** in place of D-38 (struck through, not edited): a step holds one judgment and its panel stays under four screens at 1024×768, enforced by `web/e2e/audit.spec.ts` rather than recorded, with `PANEL_EXCEPTIONS` back down to its two permanent baselines (`01#record` 6.7, `02#horizon` 5.6) | **90 commits** counted against the tree as this record landed, `c1a03b4`…`c080be1`; the branch finished at 106 and merged as `790b3e4`. **286/286** vitest across **24** files; **14/14** playwright audit over **36** URLs, including the panel-weight test — no panel over threshold. Lint, typecheck and `format:check` clean. Four per-task reviewer subagents (tasks 5–9 and 11) returned **fourteen blocking findings**, all verified real, including two factual errors about Postgres in teaching material — a `FOR UPDATE` described doing what `SKIP LOCKED` does (`4bc60aa`), and an overclaim that transaction-mode pooling breaks a transactional lock (`687a042`).  **Then the whole-branch review**, whose three headline findings no per-task review could have seen: the contrast gate (below), the `access` step teaching the singular authorization framing 100px above the exercise that corrects it (`97554b7`), and the *doc* still describing transaction pooling incorrectly after the app had been fixed, so the merge would have shipped a source of truth less accurate than its port (`70ddefe`). Fixed one commit per finding, `57a44d9`…`c080be1`, then `2734fb4`. **Scoped re-review: all nine addressed, 0 open, ready to merge** — it reproduced every measurement from an independent harness and teeth-checked with different injections than the fix used. Task 11's review caught a third: a trace row that named a timeout "graceful degradation", contradicting the definition the stage's own resilience step gives (`dcfe1ae`). The **whole-branch review then produced seven blocking findings of its own**, so the defect rate did not fall off: the last task reviewed produced three and the whole-branch pass produced seven. Its headline was that the branch's own verification claim was hollow — the contrast and touch-target gates walked the step rail instead of the panel and opened five expandables across 36 pages, so every page was checked on its stage's last step with nothing revealed (`e058333`; corrected, 108 expandables and 867 colour pairs against 717, zero failures in either theme) | Sixteen minors from the whole-branch review, deferred with the reviewer's provenance rather than fixed. **TD-26** carries the three further ways the audit can be green about a surface it never evaluates, all found while fixing the first. Also open: a `RevealList` component to de-duplicate five accordions sharing one markup; the step rail's own fit past ~12 entries at 1440px, which is the half of D-38 that D-52 dropped without saying so; and nine glossary terms defined and never wrapped, because the names live in data strings where JSX cannot go — a pattern decision, not a patch |
| 2026-07-21 | P-0 | README index, `reference/stack.md`, `reference/glossary.md` | 17 terms; versions checked against `npm view` that day | Search; per-stage frontmatter |
| 2026-07-21 | P-1 | Stages 04, 11, 12, 13, 14 | Template held under real config content — the reason this group went first | — |
| 2026-07-21 | P-2 | Stages 05, 06, 07, 09, 10 | — | — |
| 2026-07-21 | P-3 | Stages 01, 02, 03, 08 | — | — |
| 2026-07-21 | P-4 | Stages 15, 16, 17, 18 | 18/18 pass the seven-section template check; 124/124 internal links resolve | — |
| 2026-07-21 | W-0 | Next 16 scaffold, sidebar, 18 static stage routes | `pnpm build` prerenders 22 routes | Tests, CI, deploy (W-4/W-5) |
| 2026-07-21 | W-1 | Design system: whiteprint/cyanotype, Archivo/Newsreader/JetBrains Mono | Contrast audited across every distinct text/background pair, both themes | Print stylesheet; motion beyond the hero rule |
| 2026-07-21 | P-7 | `KICKOFF.md`, `web/DESIGN.md`, `docs/superpowers/{specs,plans}/`, `docs/learnings/` | Design tokens in DESIGN.md verified against `globals.css`; `218815a` | Per-round kickoff siblings |
| 2026-07-21 | W-2 | Stage 01: 6-step stepper, 9 numbered figures, 5 exercises, worksheet, 10 terms defined (5 used inline so far) | AA in both themes with all term panels expanded; 320–2560px clean; no console errors; `edb315b` | Stages 02–18; committed test suite |
| 2026-07-24 | W-2+ | Stage 01 references section: 5 curated outward links with what-it-adds notes; reusable `References` component | 3 invariants (cap 3–5, https + non-empty fields, unique urls) teeth-checked; all 5 urls verified live in a browser | References for stages 02–18 |
| 2026-07-23 | W-2+ | Stage 01 polish: three sentences humanized; index reworked to full-width per-group sections | Copy pass `11ce4f2`; index `e87286d`→`fd112c9`, no overflow 320–2560px | Broader humanizer sweep of the docs |
| 2026-07-23 | W-4 | Quality gates: prettier + eslint-config-prettier, 13 vitest invariants, 9-test playwright audit suite, lefthook hooks, 2-job CI | Teeth: slug corruption failed exactly 4 tests; --faint regression failed contrast with named pairs; a bad commit was rejected on the third probe after two real gate weaknesses were found and fixed. Final whole-branch review: Ready to merge, 0 blocking, 2 minors (prepare-in-CI noise; audit PAGES hard-codes step hashes) | Component/E2E behaviour tests (arrive with W-3); visual regression; branch protection (GitHub-side, after push) |
| 2026-07-23 | P-5 | Stack drift resolved: ESLint kept, Prettier added, Biome demoted to documented alternative; docs 04/stack.md/CLAUDE/KICKOFF amended | Every biome reference in doc 04 sections 3/6/7 replaced; `web/` and docs now agree | — |
| 2026-07-23 | — | First learning guide: `docs/learnings/stage-implementation-101.md` | Every claim drawn from a real bug this session | More guides as rounds teach them |
| 2026-07-23 | P-8 | Working standards documented: git + delivery-loop + review + TDD conventions, skills-as-process, humanizer pass, `web/PATTERNS.md` | Every convention verified against `SmartJobSearchCRM` git or the code; `218815a`, `5082e43`, `17b344e`, `a5901af` | Folding the same into the stage docs (P-6) |
| 2026-07-30 | W-3.1b | Stage 03 **standard-practice completeness**: 902 → **1,281 lines**, 13 → **14 subsections**, glossary 56 → **72 terms**. Closes **TD-25**'s doc half — resilience patterns (timeout · backoff+jitter · circuit breaker · degradation), consistency and concurrency (isolation levels · optimistic and pessimistic locking · CAP · eventual consistency), a new "Evolve the schema safely" section (expand-contract · strangler fig), statelessness and scaling (+ the serverless/Postgres pooling edge), and fitness functions. The **trace table went 3 rows → 10 of 10 candidates**, which was the round's actual deliverable — it could not be widened until the material existed | 9 commits `1db6344`…`3cd19c4`. **Third cold-reader run**, same product as runs 1 and 2: 2 clusters ACTIONABLE first pass, 3 PARTIAL and fixed, verdict PARTIALLY and "more than the last run". **G5 CLOSED** ("a clean close"). It also found a **security defect open across all three runs** — G3's edge, where "one pattern per entity" followed literally produces cross-team privilege escalation — plus **three contradictions this round introduced**, including two trace rows the worked DDL did not satisfy, and **three valid over-reach findings**, chiefly expand-contract stated unconditionally to a pre-launch solo reader. D-48 applied to the fix wave caught a dangling `full_name` column referenced once with nothing introducing it — the same class as last round's `REFERENCES teams(id)`. 136/136 across 11 files, lint and typecheck clean, **38/38 links resolving**, structure test teeth-checked on misplacement. Humanizer needed **no changes** (0 AI-vocab hits; em-dash density 0.096 against 02-planning's 0.124) | **The app port** — blocked on `feat/stage-03-app-port`; G1's property-vs-entity test; G6's general soft-delete mechanic; the auth box missing from the container diagram; outbox cadence's seam with stage 11 — all in `docs/verification/cold-reader-stage-03-run3.md` |
| 2026-07-29 | W-3.1 | Stage 03's **doc round**: `docs/03-architecture.md` 8 subsections → **13**, 300 → **902 lines**, running requirements → HLD → LLD. Closes **TD-22** (no high-level design: adds architecture characteristics with a trace-forward table, a system sketch with C4 and three views, database design past the DDL, API contract design), **TD-21** (styles landscape: monolith · modular monolith · microservices · serverless, plus bounded context and ubiquitous language — the stage had been teaching the modular monolith unnamed), and **TD-18** (14 cold-reader gaps). The TD-22 inversion was fixed by *splitting* "Model the domain first" — conceptual model stays, the `CREATE TABLE` moves below the sketch that justifies it | 14 commits `4afaec4`…`2e4162c`, the last three from the whole-branch review. **Cold-reader re-run** under identical constraints and the same shift-swap product as the baseline: **9 CLOSED · 3 PARTIAL · G9 correctly deferred · G5 thin**, 13 of 17 DoD boxes tickable on a first read against a previously unsatisfiable exit condition. It also found **five gaps this round introduced** — the headline being that the stage cites the shift-swap product three times and showed zero DDL for roles or tenancy, and that idempotency was a DoD gate taught nowhere — all fixed in `7a5108f`. Glossary 42 → 56 terms. **136/136 across 11 files** from a cleaned `.next`, lint and typecheck clean, **16/16 internal links verified resolving** by script. Two new tests, both teeth-checked: `stage-03-structure.test.ts` pins the thirteen headings in order, and `source-citations.test.ts` bans line-number citations outright and resolves every heading citation against the doc it names — closing D-42's own recorded follow-up | **The app port (W-3.2 / TD-23)** — the larger half, taken deliberately (D-46); **G9** still stage 10's (D-39); G1's strike test, G8's wall-clock/DST case, G5's isolation level, G6's soft-delete mechanic, and the characteristics trace table's three rows against ten candidates — all recorded in `docs/verification/cold-reader-stage-03-run2.md`, none silently dropped |
| 2026-07-28 | W-3 (03) | Stage 03 **Architecture** interactive: six steps (reverse · model · constrain · shape · decide · AI plays), nine figures, four judgment exercises, an annotated-DDL inspector, a domain worksheet carrying stage 02's answers forward, 7 new terms, 4 references. `docs/03-architecture.md` gained the `### AI in architecture` section it never had | 24 commits `21f555b`…`9758cef`. Gate from a deleted `.next`: lint 0 warnings, typecheck clean, **133/133 unit across 9 files**, **22 routes prerendered**, **10/10 e2e over 20 URLs**. Review caught two blocking defects: (1) `DomainSketch` rendered the status enum as `draft \| sent \| paid`, which **pre-answered the interrogation exercise rendered in the same stepper panel** — the doc's arc is naive sketch → interrogate → schema drops it, so `overdue` was restored (`83b6cba`); (2) `BoundaryMap`'s `EDGE_NAME` hardcoded "allowed"/"not allowed" into each accessible name while only the visible badge derived from `edge.legal`, so flipping the data would have told a sighted reader and a screen-reader user opposite things with nothing failing — the suffix now derives from the data, teeth-checked by flipping `legal` and proving the name followed (`7893272`). Two reviewers reproduced measurements independently rather than accepting reports: the 320px overflow numbers (page 305/305, container 621/213) and the reassembled DDL executed against a real PostgreSQL 17 instance | **TD-18** (14 cold-reader doc gaps, 3 blocking) — recorded, not fixed; TD-11 and TD-14 stay open; **TD-16** (placeholder contrast) and **TD-17** (no component-test harness) opened; no ADR worksheet (D-39); no schema validation — the worksheet records, it does not grade; no component-test harness — vitest is `environment: 'node'` and matches only `*.test.ts` |
| 2026-07-28 | W-3 (02) | Stage 02 **declared complete** for its scope, after an audience-readiness check | Two cold-reader persona tests (PM, solutions architect) reading only the doc: PM = primer not a tool (5 blocking-for-PM gaps, all scope-boundary), SA = feeder that defers architecture to stage 03 (6 gaps, all stage-03 content). Developer-completeness already confirmed by the earlier cold reader. Scope confirmed (D-37); method written up in `docs/learnings/cold-reader-testing.md` | PM support (whole-playbook scope expansion); SA support (build stage 03) |
| 2026-07-28 | — | Build: Prettier no longer checks markdown (`*.md` in `web/.prettierignore`); pre-commit format glob reverted to code extensions | Fixed a CI `format:check` failure on `web/PATTERNS.md` at the source. Markdown is documentation, not code, and the generated `reference/glossary.md` must not be reformatted out of sync with `renderGlossary()`. Teeth-checked: a bad-emphasis `.md` no longer trips the gate | — |
| 2026-07-27 | W-3 (02+) | Stage 02 "AI plays" section: a 7th step + `### AI in planning` doc subsection, mirroring stage 01. Six plays (exhaust, red-team MVP, spike, draft plan, value-vs-effort sort, memory), copyable prompts, opening on planning's inflate-don't-cut failure mode. Names real tools: Superpowers writing-plans/dispatching, claude-mem, context7, Vercel Sandbox; find-skills → deanpeters/product-manager-skills, phuryn/pm-skills as the ecosystem pointer | 57/57; audit 9-of-9 on a production build now sweeping `#ai` (contrast both themes, no overflow, zero console); live pass: 6 plays + 4 badges render, accordion single-open, copy present, `<pre>` scrolls internally; `47c6a64`…`a15d648` | Stage 01's doc still lacks AI content (TD-15); no copyable prompts in the doc (web-stage's job) |
| 2026-07-27 | W-3 (02+) | Stage 02 beginner-completeness fixes: cut-to-core reframed to "does the outcome fail" (was contradicting its own MVP warning); Risk vs Open-question defined + example de-duplicated; entry criteria made to point at stage 01 explicitly; Next-list ordering given a method (value-vs-effort, reusing S/M/L), 5th reference added. Doc + app kept in sync | A cold-reader agent (only the doc, own PM knowledge forbidden) planned a *different* product, stalled at 4 points; all 4 ruled FIXED on a re-run of the same test. lint/typecheck/57 tests/build/audit 9-of-9 clean; `6b8dbe0` | The stage-01-dependency in entry criteria (by design, not a bug); deeper prioritization frameworks (linked, not taught) |
| 2026-07-24 | W-3 (02) | Stage 02 **Product Planning**: doc reframed + retitled, six-step stepper, nine figures, five exercises, plan worksheet with 01→02 carry-forward, 7 terms, 4 references. `docs/02-planning.md` amended (MVP/roadmap/appetite/feasibility-risk named; now/next/later horizon added — "vision" was absent from all 18 docs) | 56 vitest (31 new); 9/9 audit suite on a production build (overflow 320–2560, touch ≥44px, WCAG AA both themes, zero console); full 01→02 chain verified live (seed fills + disables, reader's Not-in-v1 → horizon triage); every component reviewed clean by a fresh subagent; `2bd421b`…`1d7f327` | TD-2/TD-3 (due before 03); stage 01 team-section retrofit; deploy (W-5); edits to `docs/03` |

### Verification standard used

Every W milestone was checked with the same three passes, run against a live
build rather than asserted:

1. **Contrast** — every distinct text/background pair, both themes, all steps
2. **Responsive** — 320→2560px, horizontal overflow and sub-44px touch targets
3. **Console** — zero errors in a clean browser context

These scripts were written ad hoc and thrown away each time. Committing them is
**TD-5**, and it is the single highest-value item in W-4.

---

## Decisions

Recorded when made. Superseded by a new entry rather than edited — the record
of what was believed at the time is the point.

| # | Decision | Reasoning | Consequence |
|---|---|---|---|
| **D-71** | **A cross-document anchor link is resolved by test, the same way a source citation is** | **D-42** made a heading the unit of citation and built `source-citations.test.ts` to resolve them, and that test scans `web/src/` only. It cannot see `](05-development.md#commits)` in another document, and four such links point into stage 05 alone. The stage 05 round renames `### Commits`, which breaks one of them, and nothing in lint, typecheck, the unit suite or the audit would have said so. **TD-5** is why this cannot lean on precedent: the "124/124 links resolve" figure the tracker quotes came from a P-4 script that no longer exists and has never been re-run | The guard extends to every `](NN-name.md#anchor)` across `docs/`, resolved against the target's real headings under GitHub's slug rules. It asserts its corpus is non-empty before asserting it is clean, because a guard that resolves zero links is green and worthless, and this repo is past seven of those. Scope is deliberately narrow: anchors into `docs/*.md`, not a general link checker, which is TD-5's territory and once reported 124 false breaks |
| **D-70** | **A Server Action returns its expected failures and throws only the unexpected** | Stage 05 printed `throw new Error('Not found')` and, four lines below it, prose reading "**Return** 'Not found' rather than 'Forbidden'". Next's shipped guide (`01-app/01-getting-started/10-error-handling.md`) draws the line the prose was reaching for: expected errors "should be handled explicitly and returned to the client", and "avoid using `try`/`catch` blocks and throw errors. Instead, model expected errors as return values." A record that is not yours is a normal outcome, not a bug, and the caller needs the message in order to render it, which a thrown error does not give it. **The mechanism originally offered for this finding was dropped**: the cold reader justified it by asserting Next masks Server Action messages with a digest in production, which could not be confirmed in the shipped docs and is not carried | `updateInvoice` returns `{ ok: true } \| { ok: false, error }`, the form renders `state.error`, and `error.tsx` is left for what actually throws. This is a **teaching change**, not a correction of a typo: the doc's previous code was wrong rather than incomplete, so the port inherits a different lesson than the one the doc shipped |
| **D-69** | **Authorization is scoped to the query, not to the verb — reads included** | Stage 05 stated the authorize rule three times and scoped it to writes every time, so an unscoped list or detail route was shippable under a literal reading, and the doc's own example route had the hole. The classification record deliberately left this open as a content decision rather than a defect, since no reader could demonstrate it from the page alone; the user assigned it here. The doc already says "Never trust an ID from the client to belong to the caller", and that sentence says nothing about the verb | New `### Authorize reads, not just writes`. The owner becomes a parameter of the query rather than a check after it, because filtering a loaded row is the version that looks right: the row is already in memory, so anything that logs or errors can still put it somewhere it does not belong. The same move fixes the write path, where folding the owner into the `where` collapses check-then-act into one statement |
| **D-68** | **Executable content in a TypeScript document is compiled twice: once as printed, once with the gaps filled** | **D-50** said executable content gets executed, and stage 03's instrument was a `docker run` against SQL. A TypeScript document needs a different shape, because two distinct defects hide in the same snippet. Compiling **as printed** measures completeness and found that stage 05's Server Action imports two of the five symbols it uses. Compiling **with every missing symbol supplied** measures whether the logic is right, and returned exit 0, which is a real result and not the absence of one. Collapsing them into a single pass answers neither question: the literal pass's errors would drown the logic check, and the charitable pass alone would have called a block that does not compile correct | Two `tsconfig`s over the same extracted blocks in a scratch project pinned to `reference/stack.md`'s own versions, plus a teeth check on the charitable pass so its exit 0 is evidence. The distinction has to be stated in the report as well as run: **the compiler proves a block is complete, never that it is secure** — stage 05's check-then-act authorization compiles perfectly and is the defect |
| **D-67** | **A data module quoted from the doc keeps the doc's markdown; the rendering strips it, never the data** | Stage 04 is the first stage whose *data* carries markup. Stages 01–03 hold concepts and write their code spans as JSX by hand — `Architecture.tsx` has about thirty `<code className="t-data">` written out. Stage 04 holds filenames, flags and commands, so its seven data modules quote them the way the doc does, and there were about two hundred backticks across the wave. Stripping them at the source was the obvious fix and is not available: `CLIENT_FAILURE`, `PIN_RULE` and nineteen artifact blocks are asserted to appear in `docs/04-project-setup.md` character-for-character, and the doc has the backticks. Doc fidelity and clean rendering are both required, so one of them has to move, and the data is the half that cannot | `components/InlineCode.tsx` renders backticked spans as `<code>` and knows one construct — deliberately not a markdown renderer, because a half-markdown renderer invites data that assumes the other half. An unpaired backtick renders literally rather than swallowing the tail of a sentence, so a typo in the data looks like a typo. An accessible name cannot hold elements, so any data string used as one strips its markers instead (`plain()` in `DeployBlockers.tsx`). **Nothing tests that no backtick reaches the page**: the eleven that shipped raw were found by grepping the built HTML, and the same method is what would find the next |
| **D-66** | **Data held against a document is compared whole, never by containment** | `expect(DOC).toContain(rendered)` cannot see a truncated artifact, because a substring of a block is still contained by it. Demonstrated rather than argued: deleting the last line of the `env` artifact — `export const env = schema.parse(process.env)`, the line §5 exists for — left the suite green. The plan specified `toContain` in the same comment where it cited `ddl-sync.test.ts` as the precedent, and that file extracts the block and compares with `toBe`. The weaker form reads as equivalent and is not, in exactly the direction that matters: content going missing | `artifacts.test.ts` asserts each artifact is an element of the doc's fenced blocks, so equality rather than substring. Matching a fence by its opening line was the first shape and is wrong here — four of nineteen artifacts open with `{`. The wider rule for this repo: when a test's subject is *the doc still says this*, compare the whole unit and normalise only whitespace, because a hard-wrapped document re-flows and a re-wrap is not a content change |
| **D-65** | **A step seam is authored split and merged on measurement, never authored merged and split on failure** | Stage 03 did it the other way and paid in five of six tasks, where the plan's seam measured wrong and the split landed a task later than proposed. The two directions are not symmetric in cost. A merge is a deletion and a re-point: remove an id from `STEP_IDS`, fold two panel bodies into one, done. A split is a new component, a new id, a new hash, and every reference to the old one moved — plus the deep links in `docs/` that already cite it. The cheaper direction to be wrong in is the one that undoes with a delete | Stage 04 ships fifteen ids with **four pairs marked provisional** (`scaffold`/`structure`, `env`/`client`, `ci`/`enforce`, `deploy`/`verify`). Each is authored as two panels; a pair whose combined height measures under 3.2 screens merges in the assembly task that built it, and the merge is recorded with the number that caused it. `steps.test.ts` holds the eleven firm ids by name and the count separately, so a merge changes one assertion deliberately rather than loosening both. Plan: `docs/superpowers/plans/2026-08-14-stage-04-app-port.md` |
| **D-64** | **Panel weight can falsify a seam; it cannot choose one. The instrument for choosing is the floor, and the criterion is D-52's first clause** | D-52 has two halves — one judgment per step, and four screens at 1024×768 — and the second half has been doing the work because it is the one a test can run. Measuring all 35 panels across stages 01–03 showed the second half cannot do that work. Regressing stage 03's fourteen doc sections against their measured panels gives `screens = 3.068*steps` with every content coefficient at noise: 145 prose lines render in 2.29 screens and 21 render in 3.17, because an author fills a panel to about three screens whatever the step covers. Weight is a property of authoring, not of content, so it only reports afterwards that a seam was wrong. The data is also censored — no post-reshape panel *can* exceed the gate — and the pre-reshape record carries the counterfactual instead (`require` at 4.7, six of nine failing) | A stage's seam is cut by **enumerating the judgments** in each doc section, then sanity-checked against a **floor**: chrome 1.70 screens, plus 0.026 per rendered code line, plus about 0.87 per figure. A pairing whose floor is already near the ceiling fails before it is written, which is how stage 04's four heavy pairings were rejected without authoring any of them. The **working ceiling is 3.2, not 4.0** — stage 03's authored median is 3.02 and its max 3.88, so a panel arriving at 3.9 has no headroom for the corrections every stage has needed. The 4.0 gate in `audit.spec.ts` is unchanged and stays the backstop. Spec: `docs/superpowers/specs/2026-08-12-stage-04-project-setup-design.md`, Phase 5 re-cut |
| **D-63** | **A graphic of text is a source, not a deliverable.** Material gathered as an infographic is transcribed into structured content; the original is kept and credited, not shipped in place of the transcription | The request was a section of cheatsheets held as GIFs. A GIF of text fails on six counts this repo already cares about: it is not searchable (and search is in the backlog), not copyable (a git cheatsheet you cannot copy a command from is worse than a browser tab), not responsive (1152×1536 fixed, illegible at 320px, and `audit.spec.ts` enforces 320→2560), not themeable (a cream background punches a hole in the cyanotype), not accessible (one `alt` string standing in for forty labels), and not diffable (~1MB each). Shipping one would have required exempting the page from the project's own verification standard, and needing an exemption is the tell. The counter-argument was tested rather than assumed: `Software-Architecture-Patterns.gif` was read, cropped at 2× per panel to verify the small labels, and converted — which is also how the MVC arrow directions were caught, since `View →(User Action)→ Controller` and `Controller →(Renders View)→ View` run opposite ways | The `Cheatsheet` type carries a `source: { title, author, url? }`, so attribution is a visible empty field rather than something forgotten — the site is publicly deployed, and an uncredited transcription of someone's graphic is a real problem rather than an untidy one. **Amended the same day**: the user asked for the original to be displayed too. That does not reverse this decision — the transcription stays primary and the graphic sits beside it as the visual reference it was gathered to be — but it needs an asset pipeline the skeleton does not have, and is deferred on those grounds |
| **D-62** | **The eighteen is a closed set; lookup material gets a sibling section.** A nineteenth stage was rejected for the third time. Registered-but-empty is a valid state for an entry in that sibling section | Stage numbers are filing codes rather than a sequence, and filing codes only work if the set is closed — which is why `stages.test.ts` asserts eighteen in four places and `Sidebar.tsx` hard-codes it in the wordmark. Those guards are downstream of the claim, not the reason for it. The section name `/reference` was chosen over `/cheatsheets` because it mirrors the root `reference/` folder 1:1 and can absorb `glossary.md` and `stack.md`, which have been invisible in the app since they were written. The known hazard is recorded rather than fixed: `lib/references.ts` and `components/References.tsx` already mean *outward links per stage* — same word, different concept | Sheets tether to stages by slug with a test that every tether resolves, so the section sits beside the eighteen rather than apart from them. **Empty is diagnostic, not cosmetic**: ten of eleven sheets ship with `sections: []`, rendering a placeholder and chipping WIP in the rail, so the index advertises its gaps instead of hiding them. This mirrors the existing behaviour where a slug absent from `STAGE_CONTENT` renders a placeholder rather than 404ing |
| **D-61** | **A caller that does not fit a shared component is reported, not forced.** The implementer stops, says what the gap is in the component, and hands the decision back | Task 13 reached `AIArchitecturePlays` and found its claim rows are `text-sm` where `RevealList`'s fixed title slot renders at ambient body size. It measured both (14px against 17px on a live `SoftDelete` row), declined the migration, and named the gap as `RevealRow.title` being typed `string` with no size hook. It also rejected the workaround available to it — routing sized text through `badge`, which was already `ReactNode` — on the grounds that this would relocate the `summary: ''` workaround rather than solve it. Task 14 then reported a second gap of the same kind in `RevealFacet`. Holding both until the second one landed meant the user decided once, with two data points, instead of approving two component changes one at a time | The user chose to close both gaps and migrate the remainder (Tasks 15–17) rather than record them as debt, and every existing caller was proven byte-identical afterwards. The general rule: a shared component that eleven callers have been reviewed against is not quietly widened mid-branch by whoever hits the wall first. **The counter-case is also on record**: `ADRAnatomy`'s second facet block was left unconverted for one round because its body is `text-fg` against `RevealFacet`'s hardcoded `text-muted`, and it was converted only after the override existed |
| **D-60** | **A shared component is extracted at its second consumer, not its fifth.** Shared interaction components live in `src/components/`, not in the feature folder where the first one happened to be written | `RevealList` was extracted from **eleven** copies, and the branch that did it cost nineteen task units, seventeen commits of migration and two mid-branch scope extensions. Two of the eleven files carried header comments admitting they were duplicates and deferring the fix as "a change of its own"; the other nine never said anything, which is why the plan opened by describing five. The cost is superlinear in the copy count, because each copy drifts a little and every difference has to be proven deliberate or accidental before it can be collapsed. `TeamNotes` is the same lesson at the other end: it was built in `features/architecture/` and imported across a feature boundary by stage 01 within one round, at which point the move to `src/components/` was already correct and was instead deferred for two months | Two consequences. **Location:** anything a second stage will plausibly use goes in `src/components/` when the second use appears, and `PATTERNS.md` documents it there. **Timing:** "we will extract it when there are a few more" is a decision to pay more later, so the trigger is the second consumer. A component still in a feature folder at its second importer is a finding, not a style preference |
| **D-59** | **Rendered output is measured, not reasoned about.** A claim about what the browser produces — a gap, a font size, a colour, a coordinate — is only evidence if it came from a browser, on a server started fresh for that reading | `TraceForward` is the case that settles it. `RevealList`'s `space-y-3` injects a 12px `margin-block-end`, and the row's trailing `<a>` already carried `mt-3`. Three independent analyses — the implementer's, the controller's and a reviewer's — agreed the two 12px margins would collapse and the gap would be unchanged. Measured: **24px**. The anchor is `inline-flex`, and an inline-level box's margin does not collapse with a block sibling's. Had the consensus been trusted, a doubled gap would have shipped across a ten-row list, invisible to the expandable count, the panel ids, the audit and all 342 tests. `Normalisation` failed the same way in the opposite direction (4px became 12px, caught only by a computed-gap reading against the pre-branch original), and one of those readings was itself wrong the first time because a reused `:3100` tab served a stale build | Any visual-equivalence claim on a refactor cites a computed value read from a live page, before and after, on a port not used earlier in the session (**TD-27**). "The classes are the same so the rendering is the same" is not a verification. This is also why `e2e/count-expandables.mjs` exists and why it prints panel ids as well as a total: both are properties of a rendered page that no assertion in the suite was checking |
| **D-58** | **A Definition-of-done checkbox the document never teaches the reader to perform is not written.** An implementer handed one is expected to refuse it and say why | Task 5's brief specified a box reading "`pnpm install` succeeds in a checkout with no `.git`". §6 explains why that case matters and no section teaches anyone how to build such a checkout, so the box would have been unperformable — a checkbox that looks like verification and is not, which is the defect class the entire round was closing. The implementer declined it and routed the coverage to the existing preview-URL box instead, on the grounds that Vercel's build host *is* the `.git`-less environment. That is stronger than what was specified, because it checks against a real host rather than a simulated one | Coverage may be routed to a box that already exists, but the connection has to be stated on the page. Here it was left to a scratch report first, and saying it out loud became its own fix-wave entry. A spec or plan that mandates an unperformable box is a plan-authored error and is recorded as one, not as implementer drift |
| **D-57** | **Once a fix wave's entry list cites section numbers, the numbering is frozen for the duration of the wave.** New material lands inside existing sections | The cold reader's prioritised list names sections by heading, and those headings carry numbers: entries 8 through 11 all cite one. Giving the missing repository-creation step its own numbered section would have renumbered §7 onward and invalidated four entries mid-wave, inside a document whose presenting problem was that it disagreed with itself. The step went at the end of `### 1. Scaffold` instead | Anything that genuinely needs its own section becomes debt rather than an edit. **TD-30** is that debt, opened for §5 still installing Vitest under an environment-variables heading, and naming it costs less than silently carrying a section in the wrong place. D-42 does not cover this: an entry list is a work queue, not a citation, and it goes stale the same way a line number does |
| **D-56** | **A stage doc points at `reference/stack.md`'s floor and prints a command that resolves it at run time. It does not print the version.** Made under reversal | `corepack use pnpm@latest` sat under a sentence promising "the actual pnpm version from `reference/stack.md`", and when pnpm 11 shipped mid-round `@latest` began writing a major that file does not name. The round read that as the command breaking its promise and pinned `corepack use pnpm@10`. Review reversed it against two lines of `stack.md`: the versions there are "**floors, not pins**", and "if a stage doc contains a version number, that is a bug in the stage doc". Under its own rules `@latest` was compliant and the pin was the deviation — it rots the moment the floor moves, and it prints a major the referenced file forbids. What was wrong was always the sentence, not the command | `@latest` restored; the prose now describes floor semantics, so a newer major means the reader re-reads `stack.md` rather than pinning around it. The reversal is recorded rather than tidied away: `docs/verification/cold-reader-stage-04-run1.md`'s entry 12 row reads "Closed, after one reversal" and carries the whole arc, because the wrong call is part of what happened |
| **D-55** | **`reference/stack.md` names the file each environment reads, not the environment** | The Node row said to match the version "in CI, in Docker, and in Vercel project settings" — right, and unactionable. It names a setting without naming the file that overrides it, so a reader who writes `.nvmrc` has pinned local and CI and believes they have pinned all three. That belief is TD-28's headline defect and it cost this project a day of a deploy. The file whose entire job is that versions live in one place was the wrong place to leave the mechanism implicit | One clause on that row: `.nvmrc` for local shells and CI, `engines.node` in `package.json` for Vercel, which reads neither. It generalises past Node, and the generalisation is the teachable half — for each environment that runs your code, find the file *that* environment reads. `docs/04-project-setup.md` §1 teaches it, §8 defers to §1 rather than repeating it, and the Definition of done checks files instead of environments |
| **D-54** | **The cold-reader completeness pass runs before the app is built, not after** | `docs/learnings/stage-implementation-101.md` records stage 03 running it last and ending with a finished twenty-two-step app sitting on a doc with three blocking gaps. Run first on stage 04, the same pass returned three blocking findings — §5's schema cannot be run as written, no step creates the repository the later sections assume, and the Vercel Git connection is never instructed — and each one would otherwise have been ported into a component before anyone noticed. It also caught a findability regression the round had just created, which a pass run after the port would have blamed on the port | The pass moves into the doc phase and its fix wave is budgeted there; D-48 still applies to the wave itself. The cost is that a cold reader now reads a document mid-correction and can report defects the round introduced. That is worth having, provided the record says which is which: this round checked every such finding against `git show develop:` rather than assuming, and found one round-caused and one inherited |
| **D-53** | **A stage whose doc is wrong gets a doc-correction phase before the port, as its own branch and its own round** | Stage 03's round ported prose that was already right. Stage 04's doc was wrong where a reader acts on it, which is TD-28, and porting first means the app inherits the defects and two artifacts need correcting instead of one — the bill TD-23 and W-3.3 already paid once. The round's own arithmetic is the argument: 31 defects closed, 27 of them invisible to the reading that raised the debt. A port specified against any pre-correction state of that document would have been specified against a document that moved 37 commits underneath it | The branch order is doc correction, then `RevealList`, then the port cut off `develop` once both have landed (D-51 still governs how the doc and its port travel together once the port exists). A stage doc that comes through its correction phase unchanged skips this and ports directly, so the phase is a response to evidence rather than a new standard step. Spec: `docs/superpowers/specs/2026-08-12-stage-04-project-setup-design.md` |
| **D-52** | **A step holds one judgment, and its panel does not exceed four screens at 1024×768. Step count follows content.** Supersedes **D-38** | D-38 capped a dense stage at five content steps, and its stated reason was that “a stepper stops being navigable when a step is a scroll” — a claim about how much one panel holds, enforced by counting a different noun. The two pull opposite ways: fewer steps for the same content makes panels heavier, so the rule pushed toward the failure it existed to prevent. Measured at 1024×768, stage 03's *median* panel was **5.3 screens** against 2.4 and 2.5 for stages 01 and 02 — its typical panel was heavier than either of their worst non-outlier panels, while sitting inside a rule that only knew about counts. D-38 had also already been exceeded without a recorded deviation: **stage 02 shipped six content steps plus AI**, which satisfies `PATTERNS.md`'s four-to-six and breaks D-38, so the rule had been narrower than the documented guideline since the stage after the one it was written for. Four screens is taken from the data rather than chosen: stages 01 and 02 both have a next-heaviest panel at 3.2, so the threshold clears everything either stage has except one panel each, and it is not tuned to let anything on stage 03 pass — six of its nine panels failed | Enforced, not recorded: `web/e2e/audit.spec.ts` measures every panel and fails anything over the threshold, with a baselined `PANEL_EXCEPTIONS` list carrying `01#record` (6.7) and `02#horizon` (5.6) permanently and stage 03's oversized panels as temporary debt. A baselined panel that improves past its number fails too, and — after the first review of that test found the exemption unbounded — so does one that grows past it. `PATTERNS.md`'s four-to-six becomes the typical range rather than a ceiling. Spec and plan: `docs/superpowers/{specs,plans}/2026-07-31-step-panel-weight*` |
| **D-51** | **A stage's doc and its port never run concurrently, and they merge as one unit.** Supersedes **D-46** in practice | The divergence this rule prevents happened twice in four days. W-3.1 rewrote the doc after the app was built (TD-23). W-3.1b then rewrote it *while* the port was in flight, on the reasoning that the two branches touched disjoint files — which was true and irrelevant. The port's `styles.ts`, `sketch.ts`, `schema-blocks.ts` and `contracts.ts` **are** the doc's content in another form; that is what a port is. So the doc moving always changes what the port owes, whatever files each branch happens to touch. File-level non-overlap is not semantic non-overlap, and treating it as though it were is what produced an app teaching a security defect the doc had already fixed | `feat/stage-03-standard-practices` was merged **into** the port branch rather than into `main`, so the port has a target that has stopped moving and the new content gets ported once instead of twice. TD-25's "double-port cost accepted" line is therefore wrong and struck. Coverage is now tracked continuously in `docs/stage-03-status.md` rather than discovered by review |
| **D-50** | **Executable content in a doc gets executed, not read.** Any SQL, shell or config a stage document tells a reader to run is run against the real thing before the round closes | W-3.1b's plan said "read any SQL as SQL" (D-48) and the round did exactly that — and reading missed two defects a whole-branch reviewer then found in four minutes by starting a `postgres:17` container. The backfill example corrupted every single-word name (`strpos` returns 0, so `substr(name, 1)` returns the whole string, giving `last_name = first_name`) and its own "repeat until zero rows" comment was false, because one null name made the loop never terminate. Both were in the paragraph lecturing the reader about *silent, plausible* migration bugs. "Read code as code" and "run code" are different instructions, and only the second one catches a wrong result from correct-looking syntax | The W-3 review already executed the reassembled DDL against a live PostgreSQL, so this is a return to a standard this project had and dropped rather than a new one. Cheap: one `docker run`, and the whole round's DDL plus the backfill loop plus the partial-unique-index behaviour were verified in three commands. Applies to any stage doc that ships a runnable snippet — 04, 05, 11, 12 and 13 all will |
| **D-49** | For stage 03, **completeness beats length**, and the content stays to **standard, widely-used practice**. The doc may grow past 902 lines; it may not grow by reaching for the exotic | The project owner's call, made in response to the TD-25 audit and explicitly overriding the length caution recorded in D-45: *"03 may seem bloated now but I'll prefer that completeness instead of worrying about it having too many, let's just make sure we do the standard / widely used practices."* The reasoning holds up — the playbook's stated job is to teach ground the reader has not worked in, and a reader who meets resilience or consistency vocabulary for the first time in a job interview was failed by the stage, not by the length budget. The second half of the decision is the real constraint: **standard** is the filter. Circuit breaker and expand-contract are in every architecture curriculum; bulkhead, sharding and CQRS-with-event-sourcing are not things a solo developer needs taught, only named | D-45's "argue against this precedent" note is **superseded for stage 03 specifically** and still stands for stages 04–18, which have no comparable teaching load. Length stops being the check, which means something else has to be: the consultability pass (look three questions up from headings alone) becomes the gate that matters, and a table of contents moves from nice-to-have to likely necessary. Scope discipline moves from "how long is it" to "is this standard" |
| **D-48** | A round's **final fix wave gets its own verification pass**. The wave that answers a cold-reader or review report is not covered by the report that prompted it | W-3.1's last fix wave (`7a5108f`) shipped after the cold-reader pass, so nothing checked it — and it contained the doc's only unrunnable SQL (a `REFERENCES teams(id)` with no `teams` table) plus a tenant-key comment demonstrating the opposite of its own claim. Both were caught by the whole-branch review as I2. The pattern is structural, not carelessness: the wave exists *because* verification found something, so by construction it lands after verification ran | Re-run the cheap checks over the fix wave's own additions — the skim/consultability pass, and for anything with code in it, read it as code rather than as prose. A full cold-reader re-run is too expensive per wave; the point is that "verified" attaches to a commit range, not to a round |
| **D-47** | The glossary is a **source of doc defects, not only a convenience**. `terms.ts` gets audited when a doc gap is fixed, before the prose is called done | `Authorization` was defined as "the check that this particular record belongs to this particular caller" — TD-18's G3 defect verbatim, sitting in the single source (D-36) that generates `reference/glossary.md` and the app's inline definitions. Three tracker entries and a cold-reader pass had all missed it, because every one of them was reading prose. A doc-only fix would have shipped the corrected paragraph and left the wrong definition authoritative in two other surfaces | Cheap and mechanical: when a round fixes a concept in a stage doc, grep `terms.ts` for that concept first. The failure mode is specific to single-sourced content, so it will recur as more of the app moves that way |
| **D-46** | W-3.1 ships **doc-only**; the app port is its own round (**W-3.2**), and the divergence is recorded as **TD-23** rather than left implicit | Stage 03's app was already at D-38's ceiling of five content steps plus AI, and the round adds five sections — so the port needs a step structure that does not exist until the prose settles. Porting against moving prose means doing it twice, and the app mirrors more than the additions: `scoring.ts` carries the DDL annotations, the interrogation set and the reversibility lists, all three of which this round corrected. The alternative considered was one round covering both, rejected as a review surface the size of the original 24-commit stage build | `CLAUDE.md` permits the doc/app duplication but not widening it silently, so the debt is filed with its reasoning. W-3.2 supersedes D-38 with the shape the doc proved, and must state a new ceiling rather than "stage 03 is special" |
| **D-45** | Stage 03 takes the **full HLD/LLD treatment**, accepting a ~900-line doc — 2.4× the next longest stage *(recorded as 898 when written; the doc was 902. Corrected 2026-07-30 — the figure was propagated four more times before a review caught it)* | The project owner chose this over a lighter ~450-line option that would have taught the HLD questions without adding a named artifact. The brainstorm recommended the lighter one; the fuller one is defensible because stage 03 is the densest stage and the solutions architect's home (D-37), and because the lighter version leaves TD-22's core complaint standing — Artifacts asking only for "a one-paragraph description plus a diagram only if it clarifies". D-44's move applies a second time: teach the full apparatus, keep the stage's own answer, and name what is deliberately not adopted | The doc is now far out of family on length, and consultability becomes a real risk rather than a theoretical one. Mitigated by a check the cold-reader pass structurally cannot run (a cold reader reads linearly): three questions looked up from headings alone, scoring 4/5 with two misfilings found and fixed. If a future stage proposes the same treatment, this decision is the precedent to argue against, not for |
| **D-44** | Stage 03 will **teach the architecture styles trade-off, including microservices** — without changing its recommendation. Monolith-first, modular boundaries and defer-aggressively all stand | The playbook's stated job is that it "doubles as a learning tool — it will cover ground I have not worked in, so stages need to teach, not just remind." A reader who has never seen microservices cannot evaluate why monolith-first is right *for them*; they can only take it on faith, which is the same failure mode as G3 in TD-18 — a confident answer arrived at without understanding. Research confirmed the current recommendation is well-supported ("the days of building microservices-first as a default are over"), so the gap is not that the advice is wrong but that a reader cannot place it. The initial recommendation from research was to leave microservices out as off-stance for a solo developer; the project owner overrode it, correctly — knowing what you are not doing, and why, is the thing that makes the choice a decision | The round adds an architecture-characteristics step and a styles comparison covering monolith, modular monolith, microservices, event-driven and serverless, each stating what would have to be true to choose it. The stage's own answer stays where it is, but arrives as a conclusion. Recorded here because a future reader will otherwise read the microservices content as drift from the solo-first stance |
| **D-43** | `DeferredList` ships in the **decide** step, not `reverse` as the spec and plan both specified | The spec's argument for `reverse` — "the defer list is the reversibility test applied to infrastructure" — is real, but shipping it there would pull "Defer aggressively" from its own eighth position in the doc to first, breaking the 1:1 mapping the app's six steps otherwise hold against the doc's section order (reversibility → model → schema → one app → boundaries → auth → ADRs → defer aggressively). `decide` already closes on the defer list as the cheap end of the axis the stage opens on, which the whole-branch review found to be the tighter seam. `reverse` was also already an axis figure plus a six-row scored exercise before adding a fourth component | A deliberate deviation from the spec and plan, recorded at the level that authored it — the same convention D-40 established for `SplitTrigger`'s candidate count. Caught unrecorded by the whole-branch review (M2); no component moved to produce this entry, it only fills the gap in the record |
| **D-42** | Source citations in code comments and plans name a **heading**, not a line number. A range is used only where the exact lines are the point, and then it names the heading too | Line numbers are coordinates in a document that moves, and nothing in lint, typecheck, the unit suite or the audit suite can tell that one has drifted. The evidence is not theoretical: a single audit of `web/src/` found **14 of 33 citations wrong** — four staled by this round's own doc edits, ten inherited from the stage 02 round, the worst off by ~86 lines. Every one of them looked perfectly well-formed. Headings drift only when someone renames a section, which is a deliberate act that shows up in a diff, rather than a side effect of inserting a paragraph three sections earlier | Cite `docs/02-planning.md, "Cut to the core"` rather than `:63-64`. Six such citations already existed (`ReversibilityAxis`, `AIArchitecturePlays`, `CutTable`, `DoneStatement`, `HorizonBands`, `HorizonTriage`) and all were still correct after two rounds of doc edits, which is the argument in miniature. Where a range is genuinely needed — a transcribed DDL block, a quoted template — keep it and pair it with the heading, so a stale number is self-evidently repairable. A future check could assert that each cited heading exists |
| **D-41** | The pattern library gains **annotated artifact** (`SchemaInspector`); the taught-then-recorded pairing does **not** get a row | Two candidates were judged rather than assumed. The annotated artifact earns one because the authoring job is different from the click-node inspector it resembles: you *quote something real verbatim* and then choose which lines teach, rather than authoring a structure where every node is selectable. It carries constraints the existing row does not — leave structural lines inert, give the block its own `overflow-x-auto` container with `tabIndex={0}`, no semantic colour. The deciding argument is recurrence: setup has config files, CI/CD has workflow YAML, deployment has migration steps, and none of those is a "diagram, tree, or pipeline", so the existing row would not send an implementer here. The taught-then-recorded pairing (`ModelInterrogation` → `DomainWorksheet`) is a **composition of two rows that already exist** — no new component, no new constraint, no new a11y requirement — so it became a clause on the `Persisted worksheet` note instead | `PATTERNS.md` gains one row and two sharpened notes rather than two rows. The non-obvious half of the rejected candidate (reuse the *same questions* across exercise and worksheet) is recorded where an implementer will actually meet it |
| **D-40** | `SplitTrigger` ships **six** candidates, not the four-plus-one the spec proposed — and this is recorded as a **plan-authored refinement**, not implementer drift | A set where five of six answers are "yes" can be scored without reading it; the reader learns the pattern of the exercise instead of the judgment it teaches. Four-and-two forces every row to be read. The sixth entry (`codebase-tidier` — "the codebase is getting large and a service would be tidier") was confirmed by review as genuinely sourced from the doc's Traps and "Boundaries inside the monolith" sections rather than invented to pad the count | Deliberate deviations from a spec are recorded at the level that authored them. This one was the plan's, so a reviewer comparing component to spec finds the reasoning here rather than filing it as drift |
| **D-39** | Stage 03's worksheet records the **domain model**, not an ADR | The stage's five questions about your own domain are the thing the reader cannot get anywhere else, and they chain: the four interrogation questions are asked first against the doc's worked example, then again as free text against the reader's own product. An ADR worksheet was rejected on two grounds — `docs/03-architecture.md:165` defers ADR *format* to stage 10 by design, so stage 03 would have been inventing a template it does not own; and the cold-reader pass then confirmed the doc gives no example, length, status field, naming or location for an ADR (G9), so a worksheet would have had nothing to scaffold from | `architecture-sheet.ts` holds five keys; the ADR stays taught (`ADRAnatomy`) rather than filled in. If stage 10 later fixes a format, an ADR worksheet becomes cheap and belongs there or here by then, not before |
| **D-38** | ~~A dense stage may run to **five content steps plus the AI step**.~~ **Superseded by D-52** — kept for the record of what was believed. This is a **ceiling for dense stages, not the new default** | `PATTERNS.md` says 4–6 content steps and stage 03 is the densest of the eighteen — nine figures, four exercises, an inspector and a worksheet. Grouping it into four would have put the schema inspector and the boundary map in the same panel, which is two unrelated judgments competing for one screen. Five is the honest grouping for this content. It is explicitly not a licence: the guideline exists because a stepper stops being navigable when a step is a scroll, and stages 04–18 should still aim at 4–6 | The 4–6 guideline stands and governs *content* steps; the AI step remains standard beyond it (D-35). A stage proposing more than five content steps needs the same argument this one made, in its spec |
| **D-37** | The playbook's audience stays "solo but production-grade developer"; PM and solutions-architect readiness are deliberate boundaries, not gaps to close in stage 02 | Two cold-reader persona tests confirmed it empirically. A PM persona found the doc a *primer, not a tool* (it skips dates, stakeholder roadmaps, resourcing — the solo scope showing its edge, 5 blocking-for-PM gaps). An SA persona found it a *feeder* that scopes work and hands architecture off *by design* (6 blocking-for-SA gaps, all stage-03 content). Both sets of gaps are the scope boundary doing its job, not defects — patching them into stage 02 would blur the structure both tests confirmed works | Stage 02 is complete for its scope; SAs are served by building **stage 03** (their home), PMs would need a playbook-wide scope expansion (deferred, not planned). Reports in `.superpowers/sdd/cold-reader-{pm,sa}.md` |
| **D-36** | `terms.ts` is the single glossary source (markdown generated as a snapshot); stage metadata is guarded by detection, not generation | Exploration narrowed both debts. TD-3's richer shape belongs in code, and generation with `toMatchFileSnapshot` closes it with zero new tooling (regenerate via `pnpm gen:glossary`); the 16 arch/ops terms migrated in are used inline by stage 03+. TD-2's only real duplication is the title — the blurb is two purpose-built strings (doc subtitle vs UI tooltip) that diverge for 15/18 by design, so a title-only sync test is right and doc-header generation was rejected (it would inject generated lines into hand-authored prose for a two-field payoff) | `glossary.md` grew 18→35 and carries a "generated, do not edit" header; a term or a stage title now lives in one place; stage 03 is unblocked |
| **D-35** | Every stage carries its own "AI plays" section, in both the doc and the app, tuned to that stage's work | Stages 01 and 02 both earned real value from naming where agents help and where they mislead, and the failure modes are stage-specific (discovery: don't seek validation; planning: don't accept a padded plan; architecture, testing, incidents will each differ). Making it a standard per-stage section rather than a one-off means the guidance propagates instead of being reinvented. Generalizes D-34 | Added to the W-3 per-stage checklist and PATTERNS; a per-stage AI-plays tracker lives in `task.md`; the 7-step shape is now the norm for a built stage, not an exception |
| **D-34** | Stage 02's AI section goes in both the doc and the app, and the stage runs to 7 steps; the doc names stable in-environment tools, not install counts | The user asked for AI content "just like discovery," but chose doc+web where stage 01 is app-only — more complete, at the cost of an asymmetry (TD-15). The 7th "AI plays" step is the first past the 4–6 guideline, so `PATTERNS.md` records it as a recognized addition rather than drift. Install counts and unvetted third-party skill *contents* stay out of canonical prose — they date and I have not audited them — so the doc leans on the mechanism (Subagents/Skill/MCP/Slash command) plus stable tools, with find-skills/skills.sh as the pointer | New per-stage pattern (optional AI step) recorded in PATTERNS; stage 01 doc now lags (TD-15) |
| **D-33** | Stage 02 teaches value-vs-effort for backlog ordering, named as such, with RICE/ICE/MoSCoW as the heavier alternatives | A cold-reader test showed the stage had no method for ordering the "Next" list, only an anecdote. The user asked specifically for standard, widely-used practice. Research confirmed the impact-effort matrix is the named lightweight standard for small products, and it reuses the stage's own S/M/L sizing rather than inventing a scale. An earlier draft's "pain × frequency" was a homegrown coinage; it survives as the *value* half of value-vs-effort | The Risk/Open-question split is likewise grounded in the RAID vocabulary rather than invented; a 5th reference (Atlassian prioritization) points readers to the fuller frameworks |
| **D-32** | Doc completeness is tested with a "cold-reader" agent: it may read only the one stage doc, is forbidden its own domain knowledge, and must flag every gap rather than fill it | Opinion cannot tell whether a teaching doc works for a beginner; the author always knows too much. Running an agent that plans a *different* product from the doc alone turns "is this complete?" into an empirical list of exactly where a beginner stalls. It found two real content defects in stage 02 that four rounds of human-style review had missed | A reusable QA pass for every stage doc; stage 02's re-run confirmed all four fixes landed. Worth a `docs/learnings/` guide once a second stage uses it |
| **D-30** | The horizon roadmap lives inside stage 02, not as a 19th stage | Asking where a roadmap belongs surfaced that "vision" appears in none of the 18 docs. A separate Roadmap stage was considered at two placements and rejected at both: *after* architecture inverts a stated dependency (`docs/03`'s entry criteria already require 02's scope), and *before* it splits one activity in two — every source treats roadmapping as a step of product planning. Either placement renames 15 docs across 20 files and breaks the `exactly 18 stages` invariant | Stage 02 gains a dateless now/next/later section; the eighteen-stage count stays load-bearing and test-enforced (`stages.test.ts:9`) |
| **D-29** | Stage 02 is *product* planning, and the doc is amended to say so | The stage taught product planning (its "cut to the core" is Atlassian's roadmap step almost verbatim) but never named it; MVP and roadmap were absent from all 18 docs. Moving slicing/estimation into stage 03 was rejected — 02 attacks layer-first sequencing by name, so scheduling slices after architecture reintroduces the waterfall it exists to kill | `docs/02-planning.md` retitled and reframed; the doc/app agree per the README's own rule (`2bd421b`) |
| **D-28** | Stage 01→02 chain via a read-only shared sheet, not a shared store | The carry-forward makes the two stages a real chain. A shared `playbook:project` store was rejected as premature — it would make stage 01 a migration target and fix a schema before stages 03–18 have said what they need. Read-only carry-forward gets the chain with none of the coupling | `src/lib/discovery-sheet.ts` owns the shape both stages import; stage 02 reads, never writes, stage 01's key; the extraction also pays down one instance of the TD-2/TD-3 duplication |
| **D-1** | 18 flat stage docs, not 7 phases or 21 steps | Granular enough to look things up; flat enough to navigate | More files to maintain |
| **D-2** | Opinionated and stack-specific over stack-agnostic | Advice you can act on immediately beats advice you must translate | Docs age with the stack; **TD-1** is the first instance |
| **D-3** | Baseline is solo but production-grade, with team callouts | Matches how the author actually works | Every doc carries a "Scaling to a team" section |
| **D-4** | Reference docs only — no templates, no skills | Templates derive from good docs cheaply; the reverse does not | Deliberately narrower scope |
| **D-5** | Numbering is for lookup, not sequence | CI/CD (11) is wired during Setup (04); 13–18 loop. A numbered list implies waterfall, which the playbook rejects | Every stage states its real cadence in the title block |
| **D-6** | Web app in `web/`, markdown left intact | Keeps the playbook readable in a plain editor and on GitHub | Content now lives in two places — **TD-2** |
| **D-7** | `useSyncExternalStore` for localStorage, not `useEffect` | React 19's `set-state-in-effect` rule flagged the effect version as a real error; the effect also caused a cascading render | Slightly more code; correct hydration for free |
| **D-8** | Stepper state in the URL hash | Makes a step linkable and the back button work | Hash is taken; anchor links inside a step would need another scheme |
| **D-9** | Visual direction: whiteprint (light) / cyanotype (dark) | Both are real drawing artifacts, so dark mode is a second drawing rather than an inverted filter | Light mode is the primary designed mode, which is unusual for dev docs |
| **D-10** | Accent colour ≠ semantic colour | Orange means *attention*; green means *go*. They were the same token before, so "worth building" rendered in the brand colour | Components must pick the right one deliberately |
| **D-11** | Sidebar rail appears at `lg` (1024px), not `md` | At 768px a 288px rail left the prose column too narrow to read | Tablets get the drawer, same as phones |
| **D-12** | Terms expand on click, not hover | Hover excludes touch and keyboard; a definition unreachable on a phone is not a definition | Slightly more markup per term |
| **D-13** | Display type sized with `clamp()` | Expanded caps are wide by nature; "DEVELOPMENT" overflowed a 320px viewport at a fixed size | No per-breakpoint type steps to maintain |
| **D-14** | Removed the drafting grid background | Flagged as disruptive; softening was not enough. The sheet reads as technical from the title block and linework without it | Lost some texture; gained legibility |
| **D-15** | Wide container (1400px) + per-element measure cap | Wide screens wasted space, but unconstrained prose is unreadable. `main :is(p, li)` caps at 68ch by default | New text elements inherit the cap automatically; opt out with `.measure-full` |
| **D-17** | Adopt `SmartJobSearchCRM` working conventions wholesale | They are established across ~500 commits and already suit how the author works; inventing a second set would fragment two active projects | `CLAUDE.md` now carries git, review and TDD conventions verbatim. P-6 folds them into the stage docs |
| **D-27** | Stage 02 is built before stage 03, reversing the original order | The first ordering ranked by teaching value alone. It missed that stage 01 explicitly hands off to planning and currently lands on a placeholder, and that proving `PATTERNS.md` transfers is safer on a 211-line stage than on the densest one | `docs/task.md`'s W-3 order revised; `KICKOFF.md` scope updated |
| **D-26** | The repository is public | Branch protection is unenforceable on a private repo under GitHub Free, and this is a playbook with no secrets. Public also means unlimited Actions minutes, which the browser audit job consumes quickly | The gate is real rather than advisory; commit history and author emails are public |
| **D-25** | Typechecking goes through a `typecheck` script, never bare `tsc` | Route types are generated into `.next/types/`; a bare `tsc` passes locally off a stale build and fails on a clean checkout. Putting typegen inside one script means CI and the hooks cannot drift apart | `pnpm typecheck` = `next typegen && tsc --noEmit`, used by CI and pre-push |
| **D-24** | Stages close with 3–5 curated outward references, capped by a test | A reference list that grows unbounded stops being read; the cap forces the question "does this add something the stage does not". Each entry states what it adds so the click is judgeable | `src/lib/references.ts` + `References`; stage 01 cites Torres, Cagan, Scrum.org, Maze, Atlassian |
| **D-23** | The audit suite runs in CI against a production build, not as a local convenience | The dev server differs in rendering and console noise, and a check that only runs when remembered is TD-5 all over again | `test:e2e` uses playwright's webServer on :3100; CI's audit job needs verify first |
| **D-22** | ESLint kept over Biome; Prettier added; lint gated at `--max-warnings 0` | Biome is ~80% of the ESLint ecosystem, but this repo's best lint catch (`set-state-in-effect` on `useLocalStorage`) is ESLint-only and Next ships the config. The warnings gate exists because eslint exits 0 on warnings — proven by a teeth check that let an unused variable through twice | Closes TD-1; Biome documented in `stack.md` as the non-Next alternative |
| **D-21** | Stage 01's interaction patterns are documented as a reusable library, not left implicit | The reader praised the progressive disclosure, inline term popovers, and guess-then-reveal exercises specifically; those need to reach stages 02–18 rather than being reinvented or watered down | `web/PATTERNS.md`: the principle (interact to learn), the shared components, a pattern-per-content table, and the a11y baseline |
| **D-20** | Documentation gets a `humanizer:humanizer` pass before it is done | The stage docs are the product, not scaffolding, so they cannot read as generated filler; this project's prose leans on em-dashes and the rule of three | A documentation-pass convention in `CLAUDE.md`; P-6 and every W-3 stage carry the step |
| **D-19** | Superpowers skills are the process, not an optional aid | Every substantive change in `SmartJobSearchCRM` ran through them (`executing-plans` and `subagent-driven-development` alone appear 70+ times); TDD is the iron law the whole verification standard rests on | `CLAUDE.md` has a skills-as-process section with a phase→skill table; P-6 folds the same into stages 05/06/07 |
| **D-18** | Coordination docs are committed here, unlike the source project | There, `TASKS.md`/`TRACKER.md` sit untracked at a repo-pair root. This is a single repo and the tracker is part of the deliverable — a playbook that hides its own record would be odd | They appear in history and in review diffs |
| **D-16** | Figures numbered across the whole stage, not per step | "Figure 4" should mean one thing regardless of which step you entered on | Numbers are passed explicitly, so inserting a figure renumbers by hand |

---

## Technical debt

Ordered by cost of leaving it. Each names where it lives and what closes it.

### TD-1 — The playbook prescribes tooling the app does not use · **Closed 2026-07-23**

Resolved in ESLint's favour (D-22): Prettier added, Lefthook added, `stack.md` and
doc 04 amended, Biome documented as the non-Next alternative.

### TD-2 — Stage metadata duplicated · **Closed 2026-07-27**

~~Titles, blurbs, groups and cadence exist in both `docs/NN-*.md` and
`web/src/lib/stages.ts`, with nothing detecting the drift.~~ Closed, and narrowed on
inspection (D-36). Only the **title** is genuine duplication (identical across all 18);
`group`/`cadence`/`ready` are app-only, and the **blurb** turned out to be two
purpose-built strings — the doc's `>` subtitle vs `stages.ts`'s UI-tooltip `blurb` (its own
comment says so) — which diverge for 15 of 18 stages by design, like `timing` vs `cadence`.
`stage-metadata.test.ts` asserts each doc's H1 title equals `stages.ts` for all 18;
renaming one side without the other now fails a test. Detection, not generation — the docs
stay hand-written.

### TD-3 — Glossary duplicated · **Closed 2026-07-27**

~~`reference/glossary.md` and `web/src/lib/terms.ts` held two glossaries with different
coverage, shape, and audience, and could silently diverge.~~ Closed (D-36):
`terms.ts` is now canonical (the richer `{name, short, full, soWhat, see}` shape), the 16
doc-only architecture/ops terms migrated in, and `reference/glossary.md` is generated from
it as a vitest file snapshot (`renderGlossary()` + `toMatchFileSnapshot`, regenerated with
`pnpm gen:glossary`). The glossary grew 18→35 by design; a term now lives in exactly one
place, and drift fails a test.

### TD-4 — No tests · **Closed 2026-07-23**

13 vitest invariant tests over `stages.ts`/`terms.ts` (`e6dd51e`), teeth-checked.

### TD-5 — Verification is manual and uncommitted · **Closed 2026-07-23**

The audits are `web/e2e/audit.spec.ts` (`53fdfaf`), 9 tests run by CI against a
production build. On its first run the committed suite caught a case the ad-hoc
sweeps had masked (inline Term touch targets).

### TD-6 — No CI · **Closed 2026-07-23**

`.github/workflows/ci.yml` (`6c26784`): verify (format→lint→types→unit→build) then
audit. Branch protection remains a GitHub-side switch after push.

### TD-7 — `web/` is uncommitted · **Closed 2026-07-23**

~~The entire application is untracked, so none of the above is recoverable if the
working tree is lost.~~ Committed in `edb315b`; the app and all docs are now tracked on
`feat/playbook-web-app`.

### TD-8 — Playwright is a dependency with no committed usage · **Closed 2026-07-23**

Now `@playwright/test` with a committed suite; the dependency earns its place.

### TD-10 — CI is not yet enforced · **Closed 2026-07-24**

~~CI has never been observed running or failing.~~ **Half closed 2026-07-24.** CI ran on
push and went red on its first real run, catching a genuine bug no local check could see
(generated route types missing on a clean checkout — see the bug ledger). That is
stronger evidence than the planned deliberate break: the gate caught something real,
unprompted, on day one.

~~Remaining gap: branch protection is not on.~~ **Closed.** Enabling it surfaced a plan
constraint worth knowing: **GitHub Free enforces rulesets on public repositories only.**
On a private repo the ruleset saves but never fires, with only a banner to say so. The
repo was made public — it is a playbook with no secrets, and public repositories also get
unlimited Actions minutes, which matters because the audit job drives a browser.

Evidence, from the Actions history:

| Run | Commit | Result |
|---|---|---|
| CI #1 | `e7b3afd` | ❌ 35s — failed at typecheck |
| CI #2 | `cc5b4b0` | ❌ 35s — same failure |
| CI #3 | `e1fbdaa` | ✅ 2m12s — the typegen fix |
| CI #4 | `710cf49` | ✅ 1m54s |

The red runs failed in 35 seconds because the gate is ordered cheapest-first, so
typecheck fails long before the browser suite ever starts. That ordering paid for itself
on the first run.

### TD-9 — Figure numbers are manual · **Low**

`<Figure n={4}>` is passed explicitly (**D-16**). Inserting a figure mid-stage
means renumbering the rest by hand, and nothing catches a duplicate or a gap.

Now a confirmed instance, not a hypothetical: stage 02 numbers its figures
**1, 2, 3, 4, 6, 7, 8, 9** — `Planning.tsx` has no Figure 5. Found by stage 03's Task 15
review while checking its own numbering (which is correct: 1–9 ascending in DOM order,
verified by grepping all 17 sibling files for competing `<Figure>` numbering). A reader
who notices the gap has to wonder what they missed.

**Closes with:** a lint rule, or a build-time check that numbers are contiguous. The
stage-02 gap is a one-character fix once something detects it — but fixing it blind, with
nothing to catch the next one, is how it happened the first time.

### TD-11 — `DESIGN.md` names tokens the code does not expose · **Medium**

`web/DESIGN.md` documents the accent and semantic tokens as `signal` / `stop`, but every
shipped component and the CSS use `brand` / `danger` (with `-tint` / `-fg`). Found while
briefing stage 02's component agents — the doc nearly sent an implementer at a class name
that does not exist. Same class of drift as the resolved TD-1, one layer down.

**Closes with:** pick one naming and make the other match. The code is canonical (a
rename there is a wide diff for no behaviour change), so `DESIGN.md` should adopt
`brand`/`danger`, or note both names explicitly.

### ~~TD-12~~ — The audit `PAGES` list is hand-maintained · **CLOSED 2026-08-14**

`web/e2e/audit.spec.ts` hard-codes each step hash to sweep (`#done`, `#cut`, …). Every new
`ready` stage must add its hashes by hand, and nothing fails if they drift from the stages
actually live — a stage could ship unaudited and the suite would still pass green. First
flagged as a W-4 minor; stage 02 added six hashes by hand, and **stage 03 added thirteen more
by hand** as its reshape ran, taking its own entries from nine to twenty-two (36 URLs now). Raised to Medium because it has now cost a manual step in every stage
build, and `KICKOFF.md` asserted the opposite — that the suite "sweeps every ready stage's
step hashes" — which is exactly the kind of trusted-but-false claim that lets a stage ship
unaudited. That line is corrected.

**Closes with:** derive `PAGES` from `STAGES.filter(s => s.ready)` crossed with each
stage's step ids, so the sweep tracks the ready set automatically.

**Closed 2026-08-14** by `fix/derive-audit-pages`. `e2e/audit-pages.ts` takes stages from
`STAGES.filter(s => s.ready)` — the same flag the router reads to decide whether a stage
renders content at all — and step ids from the rail each one renders, since `Stepper` emits
one tab per step as `id="tab-<stepId>"`. Neither source can fall behind the app.

Two things about the closure are worth keeping. **A ready stage that renders no rail throws
rather than contributing nothing**, because "live and broken" should fail rather than
disappear, which is the shape of the bug this debt described. And **the equivalence test
spells out all thirty-six URLs rather than recomputing them** from the source the
implementation reads — an expectation derived the same way as the thing it checks asserts
nothing, which is the defect class recorded seven times in Process observations.

**It also broke a tool and that is the more useful half.** `e2e/count-expandables.mjs`, added
during the `RevealList` round to make the 140/107 baseline obtainable, derived its URL list by
scraping `const PAGES = [` out of `audit.spec.ts`. Deleting that array broke it, and nothing
in the gate noticed: `pnpm test:e2e` went 16/16 with the script throwing on startup, because
the script is a tool nobody's suite runs. Found by running it. It now derives the same way,
duplicated rather than imported because it is plain `.mjs` and `audit-pages.ts` is TypeScript.

**What this does not close**, stated because the debt's own wording only covered one
direction: the sweep now follows what the app renders, so a step deleted by accident leaves
the sweep silently instead of failing it. Stage 03 guards that direction for itself — its
`Step[]` is typed against `STEP_IDS`, so an id that exists nowhere is a compile error — and
stages 01 and 02 have no equivalent. **TD-36**.

### ~~TD-28~~ — Stage 04's deploy section is wrong, and this repo proved it · **CLOSED 2026-08-13**

`docs/04-project-setup.md`'s **§8 Connect Vercel** reads:

> *"In project settings, confirm the Node version matches `.nvmrc`."*

Vercel does not read `.nvmrc`. Its Node version comes from the project setting, overridden by
`engines.node` in `package.json`. A reader following that sentence pins local and CI, believes
they have pinned the host, and has not — which is the exact drift `reference/stack.md:19` calls
"a recurring source of 'works locally' bugs".

Three more omissions in the same section, all of which broke this project's own first deploy
on 2026-08-11 before any of the advice in §8 became relevant:

- **`prepare` scripts fail on a build host.** pnpm runs `prepare` on every install,
  `lefthook install` exits 1 outside a git repository, and Vercel's build environment has no
  `.git`. The install step dies first. Husky has the identical failure for the identical
  reason, so this is not a lefthook footnote.
- **Root Directory** is unmentioned, and an app in a subdirectory does not build without it.
- **Framework Preset** is unmentioned. A project created against an empty repository guesses,
  and `Other`'s output directory is `public` — which produces an error naming a symptom two
  steps from its cause.

**Why it is High rather than Medium.** The stage docs are the product, this section is
advice a reader acts on, and acting on it costs a day. It is also the one stage this
repository can check against itself: `docs/learnings/deploying-101.md` is the corrected
version, written from what actually happened.

**Closes with:** the stage 04 round, which is scoped as a doc-correction phase *before* the
port rather than a port alone — see the Next up section.

---

**Closed 2026-08-13** by `fix/stage-04-doc-corrections`, 37 commits `859a1b8`…`1418c77`,
`docs/04-project-setup.md` 323 → 690 lines. All four defects above are fixed. So are
twenty-seven others.

**TD-28 named four, and all four sit in §8** — the Node sentence, `prepare` failing on a
build host, Root Directory, Framework Preset. Reading the same document to write the spec
found eight, and three of the extra four are outside that section: the Definition of done
restated the Node error as a checkbox, so correcting §8 alone left the page arguing with
itself; §1 framed `engines.node` as a pnpm guard and never said it is the file the host
reads; and there was no `### AI in …` subsection at all, which `stage-metadata.test.ts`
treats as a build blocker. The fourth is §6 never adding a `prepare` script, which TD-28
touched only by assuming one existed — its own bullet describes what happens to a script
the document never tells anybody to write.

Eight was not the end of it either. Each later instrument found defects the previous one
could not see:

| Instrument | Defects it found | Running total |
|---|---|---|
| Reading the doc, for the spec (`docs/superpowers/specs/2026-08-12-stage-04-project-setup-design.md`) | 8, TD-28's four among them | 8 |
| **Running** it — every executable block, in a scratch directory (`docs/verification/stage-04-doc-execution.md`) | 5 | 13 |
| A **cold reader** given the corrected doc and a task to finish (`docs/verification/cold-reader-stage-04-run1.md`) | 14, with 10 boundaries classified out and left alone | 27 |
| **Per-task reviews**, on things no inventory had named | 4 | **31** |

The four the reviews found are the ones worth naming, because nothing in the first three
passes was looking for them: §5 tells the reader to import `zod` and no section installs
it (a reader hits `TS2307` before the test gate is reached, and it stayed hidden because
Task 1's verifier had run `pnpm add zod` unprompted, so the scaffold was more complete than
the document all along); §4 prints a copy-pasteable `tsc --noEmit` that its own next
sentence disowns for Next.js readers; §3's `lint` script omits `--max-warnings 0` while
§3's prose says a warning "sails through both hooks and CI" without it; and §1 instructed
`"engines": { "node": ">=22 <23" }`, a range format Vercel does not document, in the single
field whose job is pinning the host — while this repository's own `web/package.json`, the
one that actually deploys, uses `"22.x"`.

Two more findings came out of the consultability run and are navigation rather than fact:
`### 8. Connect Vercel` stopped answering "which file controls my host's Node version"
once the true answer moved to §1, and §7 never pointed at the teeth check that proves a CI
gate can fail. The first was **caused by this round**, traced to `79460eb` against
`git show develop:`, and is recorded that way rather than filed as inherited.

The defects reach every numbered section, §1 through §10, with §4 the only one that needed
a reviewer to find its own. They also reach `## Artifacts` and `## Definition of done`, and
a subsection that did not exist until this round wrote it. `## Traps` gained an entry
rather than losing a defect, and `## Entry criteria` was read repeatedly and came out
unedited.

**Why the debt was scoped wrong, since that generalises.** TD-28 was raised by reading one
section, days after a deploy, by someone who knew exactly what to look for and found it.
That is the best case for reading, and it still came in at four of thirty-one. Reading
catches claims that are wrong. It does not catch a claim that was never true (the
`engines` warning), a gate wired to scripts nobody creates (§6, §7), or a step that is
simply absent, because absence has no sentence to read. Only running the document catches
the second, and only making somebody finish the task catches the third.

### TD-27 — The second `pnpm test:e2e` of a session measures a stale build · **High**

Opened 2026-08-03, during the doc-gaps round, and it invalidated that round's own verification
until it was found.

`web/playwright.config.ts` sets `reuseExistingServer: !process.env.CI` against a
`pnpm build && pnpm start -p 3100` command. The first run of a session builds and starts a
server; **every subsequent run reuses that server without rebuilding**. A session that runs the
suite after each of eight tasks measures the first task's build eight times.

This is not a bug in Playwright — it is the documented behaviour of that flag, and reusing a
server is what makes local iteration fast. The defect is that nothing says so at the point of
use, and the failure is silent and green: the suite passes, the numbers look plausible, and
they describe a tree that no longer exists.

**What it cost, measured.** A server had been up for 97 minutes. Panel weights read through it
against the true values once it was killed:

| Panel | Through the stale server | Actual |
|---|---|---|
| `model` | 3.7 | **4.0 — over threshold** |
| `schema` | 3.6 | **4.3 — over threshold** |
| `sketch` | 2.3 | 2.5 |
| `evolve` | 3.4 | 3.6 |
| `indexes` | 1.9 | 2.2 |

Two panels had been over D-52's limit for five tasks while the gate reported them passing. Both
were fixed once the numbers were real.

**How it was found**, which is the part worth keeping: not by the suite, but by probing whether
the built page actually contained the component that had just been added
(`"First normal form"` → `false`) while the panel test was green. The same move that found
TD-26 — check what the tool loaded, not what it reported.

**Closes with:** either `reuseExistingServer: false` locally, accepting a rebuild per run, or a
freshness assertion in the suite itself — read a build id or a known-new string and fail if the
served tree predates the working tree. The second is better, because it also catches the case
where someone left `pnpm start` running by hand.

**Related:** TD-26 is the same family — a gate green about something it never evaluated — and
between them they cost this branch two false verification claims. Neither was caught by a test;
both were caught by asking what the tool actually did.

### TD-26 — The audit suite is green about surfaces it never evaluates · **High**

Opened 2026-08-03 by the whole-branch review of `feat/stage-03-app-port`, which found the
contrast gate had been measuring **one surface per stage** since it was written. It opened
expandables by clicking every `button[aria-controls]`; `Stepper` puts `aria-controls` on all
22 rail tabs, so the loop walked the rail and unmounted the panel it was about to measure.
Measured on `#trace`: before, tab `03 Trace` with 11 expandables; after, tab `22 Traps` with
**0 expandables and 0 open**. Every one of the 36 audited URLs was checked on its stage's last
step with nothing expanded.

Fixed in `e058333` — the sweep went from **5 expandables and 717 colour pairs to 108 and 867**
across the 36 URLs, and surfaced no real failures in either theme, so the claim was true and
simply unearned. `2734fb4` then narrowed the touch-target exemption that fix had widened: it
had gone from `p` to `p, li`, exempting 880 elements to excuse one, including 74 accordion
controls and 67 exercise radios. Role could not separate them — `Term` is itself a disclosure —
so the check now asks whether the target sits among running text. Exempt went 152 → 14 over
five representative pages, re-gating 138, all of which pass.

**What is still open, and why this is an entry rather than a closed line.** Three further ways
the same suite can be green about something it never looked at, all found while fixing the
first:

- The contrast collector **skips any element that has element children**, so a colour set on a
  container is only ever measured through its leaves. A container-level failure with
  correctly-coloured children is invisible.
- `openExpandables` **cannot exhaust a single-open accordion group** — clicking one closes the
  last — leaving ~28 buttons closed across 36 pages, almost all in stages 01 and 02.
- `AuthPaths`' inner tabs use `aria-selected` rather than `aria-expanded`, so **two of its three
  auth panels are never contrast-checked**. Same class, different attribute.

**Why High.** "Contrast AA across every distinct pair, both themes, all steps" is this repo's
headline verification claim (`CLAUDE.md`), quoted in the tracker, in `KICKOFF.md` and in every
stage's completion evidence. A gate that lies is worse than no gate, because the claim gets
made on its behalf. The first instance shipped for three stages before anything caught it, and
what caught it was a reviewer reading the selector rather than the results.

**Closes with:** a test of the test — assert the sweep opens a known count of expandables on a
known page, so the next selector change that silently stops opening things fails rather than
passes quietly. Related: ~~**TD-17**~~ (closed 2026-08-04) was the reason this class had to
be caught in e2e at all.

### ~~TD-16~~ — Worksheet placeholder text fails AA, and the audit suite cannot see it · **CLOSED 2026-08-11**

All three worksheets — `discovery/Worksheet.tsx:161`, `planning/PlanWorksheet.tsx:179`,
`architecture/DomainWorksheet.tsx:165` — carry the identical class
`placeholder:text-subtle/70`. Measured against a production build by rasterizing the
composited colour rather than parsing it:

| Theme | Effective placeholder | Field background | Ratio | AA (4.5:1) |
|---|---|---|---|---|
| Light | `rgb(129,137,150)` | `rgb(230,228,220)` | **2.77:1** | fails |
| Dark | `rgb(109,125,145)` | `rgb(7,19,34)` | **4.44:1** | fails, narrowly |

17 fields, both themes, 34 samples, all below AA. Stage 03 copied the existing class
string, which was the right call for consistency — this is repo-wide and pre-dates the
branch, not drift introduced by it.

It matters more than typical placeholder text because **these placeholders carry the
worked example**: they show the reader what a good answer looks like. That is
instructional content sitting below the contrast floor.

**The more valuable half of this finding is why the gate never caught it.**
`audit.spec.ts:155` samples `el.textContent` and skips anything shorter than three
characters. A `placeholder` has no text node, so no placeholder in the app has ever been
checked. The suite is green and correct about what it looked at.

**Closes with:** raise the placeholder token to meet AA in both themes (light needs a real
change; dark is one nudge away), **and** extend the audit suite to sample
`getComputedStyle(el, '::placeholder')`. Fixing the colour without closing the blind spot
leaves the next one undetected. Note that `text-subtle/70` resolves to `oklab()`, which the
suite's parser deliberately skips — see `docs/learnings/contrast-checkers-lie.md` before
writing that assertion.

**Raised Medium → High during the stage 03 whole-branch review**, not because the failure
got worse but because its cost compounds: every stage that copies the worksheet's class
string — and all built so far have — inherits the same failing pixels, and the gate will
not object. Worth stating plainly rather than leaving it implied: **by the letter of
`CLAUDE.md`'s verification standard ("Contrast — every distinct text/background pair, both
themes, all steps, WCAG AA"), `feat/stage-03-architecture` does not clear its own gate.**
CI is green on this branch *because* `audit.spec.ts` samples `el.textContent` and a
`<textarea>` placeholder has no text node to sample — not because the contrast passes.
Shipping anyway was the right call (stages 01 and 02 already ship under the same blind
spot, so holding stage 03 alone to the letter of the standard would be arbitrary rather
than principled), but "CI is green" should not be read as "the gate cleared" for this class
of failure until the blind spot itself closes.

**CLOSED 2026-08-11.** Both halves, as this entry required. The class string dropped its
`/70`, and that alone clears AA — `--faint` had already been tuned to exactly **4.80:1** on
`--sunk` in light and sits at **7.93:1** in dark, so the token was never the problem; the
opacity at the call site was throwing away contrast that had been deliberately bought.

The blind spot was two bugs, not one. `audit.spec.ts` keyed off `el.textContent`, and an
empty `<textarea>` has none — so placeholders were never sampled. And its colour parser
*rejected* every `oklab()` value while a comment above it claimed to resolve oklab "via the
browser itself", so any alpha colour went unchecked rather than checked. Tailwind emits
oklab for every alpha modifier, which made the effective rule: add an opacity and leave the
audit.

Both are fixed by rasterising — paint the background, paint the colour over it, read the
pixel — which resolves any colour space and composites alpha in one step, and refuses to
guess when the browser rejects a colour rather than reporting the background as the
foreground. `docs/learnings/contrast-checkers-lie.md` had described this exact technique a
round earlier, including the snippet; the suite stayed blind anyway, which is worth
remembering about written-down knowledge.

The audit now reproduces this entry's hand-measured numbers independently: **2.77:1 light**
and **4.44:1 dark**, on all three worksheets, and nothing else on 36 pages fails in either
theme. **The verification standard's letter is now met** — the caveat above about
`feat/stage-03-architecture` not clearing its own gate no longer applies to any branch.

### ~~TD-17~~ — No component-test harness, so a class of regression is ungated · **CLOSED 2026-08-04**

vitest runs `environment: 'node'` and its include glob matches only `*.test.ts`, so nothing
in this repo can render a component and assert on the output. Every test is module-level.

What that leaves unguarded, using the case that surfaced it: `judgeInterrogation` returns
`why` on both correct and incorrect answers, and `scoring.test.ts` holds it to that. But
nothing held `ModelInterrogation` to actually *rendering* it. Gating that paragraph on
`correct` would have passed lint, typecheck, all 133 unit tests and the audit suite — while
hiding the reasoning from exactly the readers who got it wrong, which is the stage's whole
teaching claim. The same shape covers `fieldName()` in `SchemaInspector` (token parsing
with no unit test) and any future "the data is right but the component ignores it" defect.

An interim gate landed instead: `audit.spec.ts:234-260` drives the real page, commits a
knowingly wrong answer, confirms the wrongness via `getByText('Not quite')` *before*
asserting, then checks the reasoning paragraph is present, is not the headline, and is over
80 characters. That is one assertion covering one component. It does not generalize.

**Closes with:** jsdom or happy-dom plus `@testing-library/react`, a `*.test.tsx` include,
and the vitest environment split per-file. A config and dependency change, correctly out of
scope for a stage build — but it is now the cheapest remaining way to raise the floor,
because every stage from here adds components nothing can render-test.

**CLOSED 2026-08-04.** `vitest.config.ts` runs two projects — `unit` (node, `*.test.ts`) and
`dom` (jsdom, `*.test.tsx`) — so the file extension picks the environment and no per-file
docblock has to be remembered. That is the one correction to the sentence above: it predicted a
per-file split, and vitest 4 has since removed `environmentMatchGlobs`, which made `projects`
the mechanism and structure the better answer anyway. jsdom, `@testing-library/react` 16 and
`@testing-library/dom` 10 are dev dependencies; `jest-dom` and `@vitejs/plugin-react` were both
deliberately not added, and the spec records why.

Two render tests prove it, both aimed at this entry's own examples: the interrogation's
reasoning surviving a wrong answer, and `fieldName()` — which is module-private, so the render
is the only surface it has. Each was teeth-checked by injecting exactly the defect it exists to
catch, and each failed alone.

**The convention is the half that makes this closed rather than possible.** `web/PATTERNS.md`
now states which components get a render test, and `CLAUDE.md` carries it into the verification
expectations. A capability with no rule attached is what D-38 was, and D-52 had to replace it.

**Deferred:** no backfill across stage 03's other components, and the three Playwright
stand-ins at `e2e/audit.spec.ts:323`, `:360`, `:391` stay — deleting a real-browser check
because a jsdom one now exists is a trade with no evidence behind it yet.

### TD-15 — Stage 01's doc has no AI content; stage 02's now does · **Closed 2026-07-27**

~~Stage 02's markdown doc gained an `### AI in planning` subsection (D-34), but stage 01's
"AI plays" still lived only in the web app.~~ Closed: `docs/01-product-discovery.md` now
carries a `### AI in discovery` subsection porting its `AIWorkflow` plays to prose, so both
built stages carry AI in the doc as well as the app. Consistent with D-35 (AI plays is a
standard per-stage section).

### ~~TD-18~~ — `docs/03-architecture.md` has 14 beginner-completeness gaps, 3 blocking · **CLOSED 2026-07-29**

> **Closed by W-3.1** (`4afaec4`…`2e4162c`, 14 commits). Verified by a cold-reader re-run under
> the same constraints and the same shift-swap product as the original pass, so the numbers
> compare: **9 CLOSED · 3 PARTIAL (G1, G2, G8) · G9 open and correctly deferred · G5 closed but
> thin.** G2 was then closed by the fix wave. The reader ticked 13 of 17 Definition-of-done
> boxes on a first read, against an exit condition that was previously unsatisfiable.
>
> **G3 first, as TD-18 asked.** The three-pattern split shipped in commit one, and the re-run
> confirmed it with the doc's own example: "a manager approving a shift swap between two other
> people owns none of the three rows involved." The same defect turned out to live in
> `terms.ts` — `Authorization` was defined as ownership — which no entry had recorded and which
> a doc-only fix would have left authoritative in the glossary and the app's inline terms.
>
> **What the re-run found that this round had introduced**, all fixed in `7a5108f`: roles and
> tenancy had no DDL anywhere despite the stage citing the shift-swap product three times;
> idempotency was a DoD gate taught nowhere; the DoD's "Derived values computed, not stored"
> contradicted the new prose; layered-vs-hexagonal had no criterion; API contracts broke on
> verb-shaped operations.
>
> **Still open, recorded not dropped:** G1's strike test needs a rule rather than one example;
> G8 has no wall-clock/DST case, which is where shift scheduling lives; G5 says use a
> transaction and nothing about isolation; G6 omits the soft-delete mechanic; the
> characteristics trace table has three rows against a ten-item candidate list. Full report:
> `docs/verification/cold-reader-stage-03-run2.md`.
>
> **Deferred:** the app port (**W-3.2** / **TD-23**); G9, still stage 10's by design (D-39).

Found by a cold-reader pass (D-32) run at the end of the stage 03 build: an agent allowed
to read only that one doc, forbidden from filling gaps with its own knowledge, taking a
shift-swap product through the stage's four artifacts (schema, reversibility sort, an ADR,
feature boundaries).

**These are pre-existing gaps in the doc, not defects the stage 03 branch introduced.** The
branch's one owned doc change — the AI section — is done. Ranked High anyway: they are
blocking for a reader using the stage as intended, and every fix is a two-file change
because the app mirrors the doc, so the cost grows as more stages copy the pattern.

**G3 is not like the other thirteen and should be fixed first.** The other gaps stall a
reader — they notice something is missing and have to guess or go elsewhere. G3 does not
stall anyone. The Definition of Done says "authorization pattern decided and written
down," not "using the pattern above," so a reader on a shared-workspace product can decide
ownership, tick the box, and believe they followed the playbook — while the doc's only
authorization concept ("proving the record belongs to the caller") is wrong for their
product. **A confident wrong answer is worse than a dead end**, because nothing downstream
flags it: no error, no stall, no reason to double back. The next round should prioritise
G3 above G4 (indexes) and G5 (conditional uniqueness), which are the quieter kind of gap a
reader notices and routes around.

**Blocking — the stage cannot be completed from the doc alone:**

| ID | Where the reader stalled | What is missing | The line that closes it |
|---|---|---|---|
| **G3** | Tasks (b)/(c). The DoD requires "authorization pattern decided and written down" | Ownership ("proving the record belongs to the caller") is the *only* authorization concept in the document. On a shared-workspace product almost nothing important is owned by its caller — a manager approves a swap between two other people. No second pattern is offered, so the exit condition is unsatisfiable from the doc | Name the ownership / role / membership split, keeping enforcement in stage 05 |
| **G4** | Task (a), the schema. Artifacts requires "constraints, keys, and indexes" | "indexes" appears **once**, in that Artifacts line, and nowhere else in the document. The annotated DDL has none | Add two indexes to the DDL with reasoning, or drop indexes from Artifacts |
| **G5** | Task (a), expressing "at most one approved claim per shift" | Races are named as *the* reason to push constraints into the database, then only PK / FK / CHECK / UNIQUE are supplied — none of which expresses a conditional uniqueness rule. Partial unique indexes are unmentioned; **transactions are unmentioned in the entire document** | A conditional-uniqueness annotation, plus one sentence that row-spanning invariants need a transaction |

**Friction — the reader proceeded, but had to guess:**

| ID | Where | Missing | Closes with |
|---|---|---|---|
| G1 | Deriving the entity list | No procedure from product description to nouns; it shows the finished invoicing block, and entry criteria assume the answer | 2–3 sentences deriving candidate nouns from stage 02's vertical slices |
| G2 | Is Manager an entity, a column, or a table | No treatment of role-bearing actors; the worked example has one actor type that owns everything it touches | A fifth interrogation question: "does every actor have the same rights over this entity?" |
| G6 | Deletion for cancelled shifts, withdrawn claims, departed workers | Only the financial-record heuristic; the sole audit-trail signal is "event sourcing, almost certainly not" | Generalize: keep what someone will later ask "where did that go?" about |
| G7 | Whether an approved swap rewrites a column or is recomputed | No criterion separating derived from stored (`overdue` computed, `paid` stored, difference unstated); normalization never appears | State the test — is it a pure function of other columns in the same row — and name the point-in-time exception |
| G8 | Typing `starts_at` / `ends_at` | `date` and `timestamptz` both appear in the DDL with no note of the difference; no timezone or midnight-crossing guidance | One annotation line on `date` vs `timestamptz` |
| G10 | Is "Next.js + Postgres" one ADR or three | No statement of what constitutes a single decision, so "every expensive decision has an ADR" is uncheckable | One ADR per thing reversible independently |
| G11 | Are `scheduling` and `swapping` one feature or two | The rule for *enforcing* boundaries is given, not for *choosing* them — and it is stated only for reads, while swap approval writes across the seam | Define a feature by the tables it alone writes; cross-feature writes go through the owner's exported function |
| G12 | The deferral list, which the DoD requires be explicit | No format, no location, no test separating a safe deferral from a dangerous one — "Defer aggressively" is six fixed infrastructure items, not a criterion | Defer anything whose reversal does not require migrating stored data |
| G13 | The first `CREATE TABLE` | `uuid PRIMARY KEY DEFAULT gen_random_uuid()` is unannotated while `amount_cents` and `ON DELETE RESTRICT` beside it are explained, though a PK type is stored data touching every row and every FK | One clause naming the alternative |
| G14 | Placing notification channel / hosting / real-time updates | The reversibility section gives two example lists but no test. The actual test — "what would have to change, how many call sites touch it, whether any of it is stored data" — is **buried in the AI section, framed as a prompt for a model** | Promote that sentence into the reversibility section as the rule the two lists exemplify |

**G9 (BOUNDARY, not blocking — do not rank it with the three above):** the ADR section
gives five section nouns, no example, no length, no status field, no naming or location,
yet an ADR is a stage-03 artifact required twice in the DoD. This is deliberate — the doc
defers ADR *format* to stage 10 (see D-39, which is why stage 03's worksheet records the
domain model instead). Closing it means inlining one short real ADR here and leaving the
rationale in 10.

**Self-contradictions:**

- **C1** (sharpest) — "Multi-tenancy beyond a `user_id` column" is on the defer list, but a
  tenant key is stored data on every table, which the reversibility section classifies as
  decide-now. The two rules point opposite ways with no tie-breaker.
- **C2** — that same line presumes the invoicing app's shape, where each user owns a private
  slice. Where the tenant is an organization and its data is shared, `user_id` is the wrong
  axis rather than a weaker version of the right one.
- **C3** — entry criteria require "you know roughly what data the system holds"; the stage's
  first work section is how to determine what data the system holds.
- **C4** — a single Next.js app on Postgres is prescribed as "the correct choice", yet the
  data store is stored data (expensive list) and every expensive decision needs an ADR.
  Next.js gets four supporting bullets; Postgres is asserted.

**Undefined or late-defined terms:** ~~ADR~~ and ~~DDL~~ ✓ expanded on first use
2026-07-28 (one clause each, the only fix taken in this round) · `immutable ledger` ·
`event sourcing` (dismissed without being defined) · `big ball of mud` (carries the
justification for the boundary rule) · `trigger` · `function execution limits` (presumes
serverless knowledge not established). `vertical slices` is stage 02's term — a boundary,
not a defect. Conway's law is named and glossed in the same line: the model the rest should
follow.

**What the same pass validated** — recorded because an entry listing only faults would
misrepresent the result, and evidence cuts both ways:

- **The four interrogation questions are the strongest thing in the document.** All four
  fired productively on a product they were not written for. "Can a client belong to two
  users?" transposed directly into "can a posted shift have two claimants?" — which told the
  reader that Claim is a table with a row per worker, not a nullable `claimed_by` column.
  That is the most consequential decision in their schema, and the doc handed it to them.
- **The reversibility sort held** — two concrete lists, an explicit instruction on where to
  spend thinking, a named failure mode.
- **The annotated DDL teaches by its annotations, not its SQL.** Money as integer cents,
  `CHECK` for fixed value sets and `ON DELETE RESTRICT` all transferred to a different
  domain unmodified.
- **"Constraints live in the database" is argued, not asserted** — three specific reasons,
  and it changed what the reader wrote.
- **"Defer aggressively" did real work** — no queue, cache or feature-flag service in the
  reader's design, and the doc is the reason.
- **Traps functions as a self-audit** — it caught a real cascade bug in the reader's draft.

**Closes with:** its own round, with a spec. Full findings at
`.superpowers/sdd/2026-07-28-stage-03-architecture/cold-reader-findings.md`. Expect matching
app changes for anything touching the DDL annotations, the interrogation set or the
reversibility lists, since those are ported into `scoring.ts` — G2 and G14 in particular are
two-file changes.

### ~~TD-21~~ — Stage 03 never names the architecture styles landscape · **CLOSED 2026-07-29**

> **Closed by W-3.1** (`fdb2abd`, `bf97a7b`). Section 4, "The shapes a system can take",
> compares monolith · modular monolith · microservices · serverless, each with what it buys,
> what it costs, and what would have to be true to choose it — and names the stage's own
> approach as a **modular monolith**, which it had been teaching unnamed. Section 6 names
> **bounded context** and **ubiquitous language** for what "Boundaries inside the monolith" was
> groping at. Layered and hexagonal are separated onto the internal-organisation axis, which is
> the distinction that makes "monolith or microservices" a bad question.
>
> **D-44 held.** The recommendation did not change. The section was read in isolation as the
> plan required, and the microservices row's "what would have to be true" is *separate teams
> need to ship without coordinating* — a condition a solo reader plainly fails. Section 5 now
> states the single application as a conclusion drawn from characteristics and alternatives,
> with an explicit invitation to disagree if the same trace comes out differently.
>
> Event sourcing and CQRS got definitions before their verdicts, with the boundary the cold
> reader needed: an audit table alongside normal rows is not event sourcing, and you should
> keep it. Glossary 42 → 56 terms.
>
> **Deferred:** the app port (**W-3.2**); the internal-organisation axis got a selection
> criterion only after the cold reader found it missing.

Raised by the project owner after walking the built stage. Distinct from TD-18, which is
about gaps a cold reader hits while *doing* the stage's four artifacts. This one is about
vocabulary: a reader finishes stage 03 having made good decisions and still cannot place
them among the words they will meet in every job description, conference talk and code
review.

**What the doc does today.** It prescribes a single Next.js application on Postgres, gives
four concrete triggers for splitting a service out, and teaches feature modules that talk
through exported functions. That advice is correct and matches current industry consensus.
The problem is that it is delivered as a prescription a reader has to take on faith.

**What is missing, in rough order of cost:**

| Gap | What is absent | Why it matters here |
|---|---|---|
| **Architecture characteristics** *(owned by **TD-22**, listed here because it is the input this entry depends on — build it once)* | The stage never asks what the system needs to *be* — available, auditable, low-latency, cheap to run, secure. It goes straight to structure | This is the input that makes style selection a decision rather than a preference. Richards & Ford put it as "architecture is mainly about quality attributes, not features"; arc42 makes quality goals section 1.2 because every later decision is supposed to trace back to one. Most readers will meet it as **non-functional requirements** — same activity, different name. Its absence is the root cause of the next row |
| **The styles taxonomy** | **Modular monolith**, layered, hexagonal / ports-and-adapters, event-driven, microkernel, serverless, SOA — none named. Microservices appear only as the thing not to do | The sharpest instance: the stage *already teaches* the modular monolith in "Boundaries inside the monolith" and never uses the term. The reader is doing the industry-standard thing without the word for it |
| **DDD vocabulary** | Bounded context, ubiquitous language, aggregates, context mapping | "Boundaries inside the monolith" is groping toward bounded context unnamed. Fowler's reasoning — "total unification of the domain model for a large system will not be feasible or cost-effective", boundaries follow human language — is the missing justification for the stage's own rule |
| **Integration style** | Synchronous REST/RPC versus asynchronous messaging is never posed as a decision | It is the fork that leads to event-driven architecture, and it has different failure modes on each branch. Ties directly to TD-18's G5, where the doc names races and supplies no tool for them |
| **Diagramming standard** | Artifacts asks for "a diagram only if it clarifies" without saying what kind | **C4**'s context → container → component levels are the widely-used answer and would give the stage's boundary map a home |
| **Terms dismissed undefined** | Event sourcing gets "almost certainly not" with no definition; CQRS is absent entirely | The cold reader could not tell whether its own approval-history table counted as event sourcing. Overlaps TD-18's undefined-terms list |

**The scope call is D-44: teach the trade-off, do not change the recommendation.** Solo-first,
defer aggressively, monolith default all stay. The round adds the landscape *around* that
advice so the reader can see it derived rather than asserted.

**Closes with:** one round, shared with TD-18 since both live in the same doc and both force
matching app changes. Expect a new step before the monolith advice — what does this system
need to be — and a styles comparison that states honestly what would have to be true to pick
each one.

### ~~TD-22~~ — Stage 03 produces low-level design without ever doing high-level design · **CLOSED 2026-07-29**

> **Closed by W-3.1** (`6e24fff`, `eaafe0a`, `08975f2`, `3a6ed8c`). The stage now runs
> requirements → HLD → LLD across thirteen subsections.
>
> **The inversion was fixed by splitting a section, not only by adding them.** "Model the
> domain first" had fused the conceptual model (HLD) with the `CREATE TABLE` (LLD). The DDL
> moved into its own "Design the database" section, positioned after the system sketch that
> justifies its shape, and the domain section kept its name and its claim.
>
> All five missing pieces shipped: architecture characteristics with a trace-forward table,
> the system sketch with container/deployment/data-flow views and C4 named, database design
> past the DDL (ER view, normalisation, indexes), and API contract design.
>
> **Both open questions answered rather than assumed.** Functional requirements stay stage
> 02's — verified against its headings, and the doc now states it consumes them. Ceremony:
> the full HLD/LLD *thinking*, none of the paperwork, and the doc says so in text so an
> enterprise-background reader reads the omission as a decision.
>
> **The failure mode this could have had, avoided deliberately:** if the answer is one
> application and one database, the component view is two boxes and the section proves HLD is
> pointless. The worked example scaled instead — an invoicing app really does take payments,
> send email, store PDFs and need something scheduled — which also gave TD-18's
> integration-style gap concrete material to close on.
>
> **Deferred:** the app port (**W-3.2** / **TD-23**), which is the larger half; the doc grew
> 300 → 902 lines and the app is still six steps.

Raised by the project owner alongside TD-21, and structurally the more serious of the two.
TD-21 is about vocabulary the reader never learns. This is about an **activity the stage
never runs**.

**The inversion.** The industry sequence is requirements → HLD → LLD. HLD settles what the
components are, how they talk, what the deployment shape is, and which non-functional
requirements the design has to satisfy; LLD then produces schemas, API contracts and error
handling. Stage 03 goes from "sort decisions by reversibility" **directly to a concrete
`CREATE TABLE` statement** — which is LLD — with no HLD in between. The schema is the most
detailed artifact in the stage and it arrives with nothing above it to justify its shape.

**What is missing:**

| Missing | Where it should sit | Note |
|---|---|---|
| **Non-functional requirements** | A step before the structural advice | Same thing as TD-21's "architecture characteristics" under the name most readers will meet. **Owned here**, referenced from TD-21 — do not build it twice |
| **A high-level design artifact** | Between the domain model and the schema | Components, how they interact, external systems, data flow, deployment shape. The doc's Artifacts asks only for "a one-paragraph description of the system, plus a diagram only if it clarifies", which is the HLD in one sentence and no structure |
| **Component / deployment / data-flow views** | The HLD artifact | Ties to TD-21's C4 row — its context → container → component levels are exactly these views |
| **Database design beyond the DDL** | The existing schema section | Has domain model and constraints. Missing: indexes (**TD-18 G4**), an ER view, normalisation vocabulary, and any sizing or access-pattern thinking that would justify the index choices |
| **API / contract design** | LLD, alongside the schema | Never posed. Route shape, request/response contracts and versioning are architecture decisions with different reversibility costs |

**Functional requirements are deliberately NOT on that list.** Stage 02 owns them — "define
done before defining work", the cut, the vertical slices. Stage 03 should **state that it
consumes them** rather than restate them, the same way it consumes stage 02's spike decision.
Getting this boundary wrong would duplicate stage 02 and break the filing-code claim the whole
playbook rests on. Worth deciding explicitly during the brainstorm rather than by default.

**The ceremony question, which the round has to answer.** Full HLD/LLD practice comes with
system specification documents, governance and sign-off — all wrong for a solo developer, and
exactly the kind of thing this playbook's "defer aggressively" section exists to refuse. But
the *thinking* is not ceremony: what are the pieces, how do they talk, what does this need to
be, what happens when a piece fails. The round should take the thinking and leave the
paperwork, and say so in the doc so a reader coming from an enterprise background knows the
omission is deliberate.

**Closes with:** the same round as TD-18 and TD-21. This one probably drives the stage's step
structure, so brainstorm it first — if a new HLD step lands between Model and Constrain, the
app's six steps and nine figures both change shape.

### ~~TD-24~~ — The `.agents/` skill library arrived unrecorded · **CLOSED 2026-07-29**

> **Resolved by the project owner: the library is deliberate and stays.** That was the open
> question, and it is now answered — the entry below stands as the record of what arrived and
> when, not as an outstanding decision.
>
> The two remaining observations are noted and explicitly **not** being acted on: the root
> `.agents/` tree is a byte-identical subset of `web/.agents/` (verified by `md5`), and
> `8063587`'s commit message does not follow the repo's Conventional Commits rule. Neither is
> worth rewriting history for. Left here so a future reader finds the explanation rather than
> re-deriving it.

`8063587` added ~8,500 lines of vendored agent skills plus `skills-lock.json`, on this branch,
outside the delivery loop. Flagged by the whole-branch review as I6. Not deleted or rewritten
here, because it is the project owner's commit and the content may well be wanted — recorded
so it stops being invisible.

**Two trees, one redundant.** `.agents/skills/` holds `brandkit`, `design-taste-frontend` and
`minimalist-ui`. `web/.agents/skills/` holds those three plus six more. Verified by `md5`: all
three root files are **byte-identical** to their `web/` counterparts, so the root tree is a
strict subset with nothing of its own. `web/.agents/` additionally carries both
`design-taste-frontend/` and `design-taste-frontend-v1/`. Whichever tree is authoritative, one
copy of each skill is enough.

**Nothing records what these are for.** No tracker entry, no decision, no mention in
`CLAUDE.md`'s Tooling section, which otherwise names every tool in regular use. A future
reader finds 8,500 lines of skill markdown with no statement of whether they are load-bearing,
experimental, or left over.

**The commit itself does not follow this repo's conventions**: no scope, a subject describing
two unrelated changes (`feat: establish agentic skill library and update local development
server configuration`), a `feat` type for a change that ships no product code, and **no
`Co-Authored-By` trailer** — the only commit on the branch without one. Three unrelated
dev-server port edits rode along inside it; `c8ac043` finished that change properly.

**DISPROVED, and worth stating because the review claimed otherwise:** I6 asserted that
`CLAUDE.md`'s *"`frontend-design` … (the only project-enabled plugin)"* is now false.
It is **true**. `.claude/settings.local.json` lists exactly one entry under `enabledPlugins`,
and these skills are a separate mechanism (`skills-lock.json`), not plugins. The line stands
unedited.

**Closes with:** the owner deciding whether the library stays. If it does — a decision entry
saying what it is for, one tree rather than two, and a line in `CLAUDE.md`'s Tooling section.
If it does not, it comes out on its own branch.

### ~~TD-25~~ — Stage 03 is missing five clusters of standard architecture practice · **CLOSED (doc) 2026-07-30**

> **Doc closed by W-3.1b** (`1db6344`…`3cd19c4`, 9 commits). `docs/03-architecture.md` 902 →
> 1,281 lines, 13 → 14 subsections, glossary 56 → 72 terms. **The app port remains open** and is
> tracked as the last item of W-3.1b, blocked until `feat/stage-03-app-port` merges.
>
> **All five clusters landed, and the third cold-reader run rated two ACTIONABLE on the first
> pass** — consistency/concurrency ("the only cluster that fully closes") and
> statelessness/scaling ("best-scoped cluster in the amendment", with the connection-pooling
> passage called the strongest writing in the document because it gives the failure *signature*).
> The other three came back PARTIAL and were fixed in the wave: the breaker had no numbers to
> code against, the six-step migration could be recited but not executed, and fitness functions
> were close to vocabulary with all three examples drawn from this repository's infrastructure
> rather than the reader's.
>
> **The trace table now covers 10 of 10 candidates**, verified by script rather than counted.
> That was the round's actual deliverable: it could not be widened until the material existed.
>
> **The round's most serious finding was a security defect it had inherited, not created.** G3's
> edge had been open across all three runs — the doc said to record "which pattern applies to
> which entity", singular, and a reader following that literally produced cross-team privilege
> escalation. Patterns compose, and the doc now says so with the conjunction written out.
>
> **And three contradictions the round introduced itself**, all caught by the re-run: widening
> the trace table made Auditability force soft delete and Correctness force a locking strategy
> while the worked DDL had neither column; a circuit breaker's in-memory failure count collides
> with the statelessness rule added in the same round; and the over-reach check found
> expand-contract stated unconditionally, which told a pre-launch solo developer to spend six
> deploys renaming a column — ceremony against imagined traffic, in a document that refuses
> imagined scale.
>
> **Deferred:** the app port; G1's property-vs-entity strike test; G6's general soft-delete
> mechanic; the missing auth box in the container diagram; outbox cadence's seam with stage 11.
> Full report: `docs/verification/cold-reader-stage-03-run3.md`.

### ~~TD-25 (original entry)~~ — the audit that raised it

Raised by the project owner asking a direct question after W-3.1 merged: is the stage complete
against standard, widely-used software architecture practice? Audited by grepping all eighteen
docs for the vocabulary a reader would meet in Richards & Ford, Kleppmann or Newman. The answer
was no, and the gaps are **absent from the whole playbook** rather than deferred to a later
stage — which is the distinction that makes this debt rather than scope.

| Missing | Grep result | Why it belongs in stage 03 |
|---|---|---|
| **Resilience patterns** — timeout, retry with backoff, circuit breaker, graceful degradation | `circuit break` 0 · `backoff` 0, across all 18 docs | "Sketch the system" asks *"what happens when each dependency is down?"* — the right question — and answers with no patterns. It sets the question up and drops it |
| **Consistency and concurrency** — CAP, eventual consistency, isolation levels, optimistic/pessimistic locking | `CAP theorem` 0 · `optimistic lock` 0 · `eventual consistency` 0 · `isolation level` only in this tracker | The doc says "use a transaction" and stops. The cold reader already flagged the hole. A version column is stored data, so it is decide-now by the stage's own reversibility axis |
| **Safe schema evolution** — expand-contract / parallel change, strangler fig | `expand-contract` 0 · `strangler` 0 | The sharpest one. The stage's thesis is that stored data is expensive to reverse, and it teaches the *cost* without the *technique* |
| **Statelessness and scaling mechanics** — statelessness, horizontal/vertical, load balancing, read replicas, connection pooling | `stateless` 0 · `load balanc` 0 · `read replica` 0 | Statelessness is what makes the serverless style the stage teaches work. Pooling is the best-known failure mode of serverless-plus-Postgres, which is the prescribed stack |
| **Fitness functions** | `fitness function` 0 | Closes the characteristics section's loop. This repo already practises it in two tests without naming it |

**The unifying tell.** "What this system has to be" offers a **ten-item candidate list** and a
**three-row trace table** — the cold reader flagged that a reader choosing availability,
security or evolvability gets the trace test with nothing to pass it. The missing seven map
onto exactly the clusters above. It is one gap wearing several hats: the stage teaches you to
choose characteristics it cannot then help you satisfy.

**Worth stating plainly, because it is the uncomfortable part:** for a stage whose entire
thesis is the cost of reversing decisions, it is thinnest on what happens when things fail or
change.

**Not gaps, and not to be closed here:** caching *patterns* belong to stage 09 (already
linked), observability to 15, threat modelling and secrets to 08. Those are boundaries doing
their job.

**Closes with:** **W-3.1b**, scheduled **after** the app port. It was first scoped to run
before, to avoid porting twice — sound reasoning on a wrong premise, since `W-3.2` was already
31 commits and a built nine-step stage in a parallel session when this was written. The
double-port cost is accepted and folded into W-3.1b rather than deferred to a third round.

### ~~TD-23~~ — Stage 03's doc and app now disagree about what the stage contains · **CLOSED 2026-08-03**

> **Coverage is now tracked in `docs/stage-03-status.md`** — section by section, doc against
> app, with the remaining port tasks listed. This entry stays open until that file shows no
> partial or unported rows. Written because the divergence was twice *discovered* by a review
> rather than tracked (D-51).

Opened deliberately by W-3.1 on 2026-07-29, which was scoped doc-only. This is a debt the
round chose, not one it discovered, and it is recorded so the choice is visible rather than
silent — `CLAUDE.md` permits the doc/app duplication but not widening it unnoted.

`docs/03-architecture.md` is fourteen subsections and 1,507 lines. Live coverage:
`docs/stage-03-status.md`.

**Status 2026-08-03, content done and the review run.** `web/src/features/architecture/` is
**22 steps**, up from the six built in W-3 and the nine it carried when this round opened. All
five clusters are ported — resilience, consistency and concurrency, safe schema evolution,
statelessness and scaling, and (closing in `9798286`) fitness functions with the widened
ten-row trace and the event-sourcing / CQRS definitions — plus the AI section's two missing
plays and sixth mislead, and section 9, which had no app step at all. `docs/stage-03-status.md`
now shows no partial or unported rows, and both whole-branch passes have run with every
finding fixed.

**CLOSED 2026-08-03 by the merge.** `feat/stage-03-app-port` landed on `main` as `790b3e4`
(`--no-ff`, 106 commits, branch deleted), doc and port as one unit per D-51 — which is what
makes the two halves agree on `main` rather than on a branch. The gate was re-run on the merged
result before the branch was deleted: 313/313 across 26 files, 14/14 audit over 36 URLs, lint,
typecheck and format clean. Not pushed.

**Why the round took the debt rather than avoiding it.** Stage 03's app already sat at D-38's
ceiling of five content steps plus the AI step, and the round added five sections. The port
therefore needs a step structure that did not exist until the prose settled, and porting
against a moving target means doing it twice. The reasoning is in the spec's Non-goals.

**It is not only additions.** `scoring.ts` holds the DDL annotations, the interrogation set
and the reversibility lists, and all three changed: the actor-rights interrogation question —
recorded here as "a fifth" and now the sixth, since W-3.1b inserted one before it — indexes
and a partial unique index in the DDL, and the reversibility test promoted out of the AI
section. A port that only adds components would leave the app stating things the doc has
corrected.

**Closes with:** **W-3.2**, which supersedes D-38 with the shape the doc proved. The 14 new
terms `terms.ts` already carried from the doc round are wired in as each concept was ported
(`fitness-function` inline in `trace`, for one); CQRS and event sourcing stay named rather
than taught, which is D-49's call and not debt.

### ~~TD-41~~ — Stage 03's locked exercise options fail AA · **CLOSED 2026-08-18**

Seven of stage 03's exercises style a committed-but-unpicked option
`text-subtle opacity-60` on `bg-raised`: `AuthzPatterns` (twice), `ExpandContract` (twice),
`LockingChoice`, `ModelInterrogation`, `ReversibilityTable` and `SplitTrigger`.

Composited, that measures **2.62:1 in light and 3.21:1 in dark** on 13–14px text, against
the 4.5:1 this repo's verification standard requires of "every distinct text/background
pair, both themes, all steps". Those options are content the reader is meant to re-read
beside the verdict, not unavailable controls, so the greying is doing the wrong job as well
as failing the number.

**The audit cannot see it**, which is why it survived three stages. `audit.spec.ts` visits
each panel in its default state; this pair only exists after a reader commits an answer.
That is TD-26's shape (the audit is green about surfaces it never evaluates) narrowed to a
specific, measured instance.

Found by the whole-branch review of the stage 04 port, which measured it after that
branch's own `DeployBlockers` was flagged for copying the idiom. **Stage 04 is already
fixed** — it drops the opacity and keeps `text-subtle`, matching `ClientTrap` and
`PinExercise`, which never adopted it and measure 5.19–12.71. The one-word fix is the same
in all seven.

**Fixed 2026-08-18** on `fix/stage-04-debt` (`6cd5869`), once that became its own branch
rather than a widening of the port.

Measured after the change: **6.92–7.09 in light and 8.20 in dark** on `ModelInterrogation`,
`AuthzPatterns`, `SplitTrigger` and `ReversibilityTable`. The first probe missed
`ExpandContract` (it is `role="checkbox"`, not `radio`) and `LockingChoice`, and rather than
keep rewriting throwaway probe code the gap was closed the conclusive way: all **ten**
locked-state sites across the eight components now carry the identical class string
`cursor-not-allowed border-line bg-raised text-subtle`, and contrast is a pure function of
the two colours, so the four measured ratios are the ratios. `grep opacity-60` over both
feature directories returns only a comment.

### ~~TD-39~~ — The annotated config blocks cannot be copied · **CLOSED 2026-08-18**

`artifacts.ts` says in its own header that the reader is meant to paste these, and
nineteen of them render across five panels. They cannot be pasted.

`AnnotatedArtifact` lays each line out as `<div>[code cell][note]</div>`, so the notes are
interleaved into the DOM *between* the code lines. Selecting a block and copying it yields
code line 1, annotation 1, code line 2, annotation 2, and so on. There is no copy button
either.

`SchemaInspector`, the component this one was copied from, does not have the problem — it
puts the note in a separate click-to-select panel rather than beside each line. The
interleaving came with the side-by-side layout, which was itself chosen for a measured
reason (see `PATTERNS.md`): a single wide scroller would push every note past 700px at the
1024px the panels are measured at.

**Closed 2026-08-18** (`40a9403`, `fc915bb`), in two parts, because the two halves fix
different paths.

`select-none` on the note column fixes the manual path: a drag-selection now returns only
the config. `CopyArtifact` is the direct one, and it hands over exactly
`lines.map(l => l.text).join('\n')` — the same string `artifacts.test.ts` builds to hold the
block against the doc, so what a reader pastes is what the test verifies. It confirms the
copy and reverts after two seconds, since a click that silently succeeds reads the same as
one that silently failed.

The `select-none` test asserts a class rather than behaviour and says so in place: jsdom
computes no selection, so that half was confirmed in a browser and the class is what a
test can hold.

Original entry follows.

**Closed with** either a copy button that reads `lines.map(l => l.text).join('\n')` — the
same string the doc-fidelity test already builds — or a `user-select: none` on the note
column, which fixes copy without adding a control. The first is better and neither is
large. Found by the Wave 3 review, not by any test; nothing in the gate can see it.

### ~~TD-40~~ — Eighteen tab stops on one config block · **CLOSED 2026-08-18**

Each line of an `AnnotatedArtifact` is its own `overflow-x: auto` region with
`tabIndex={0}`. That is the correct WCAG 2.1.1 treatment for a scrollable region — a
keyboard user must be able to reach and scroll it — and it is applied to every line rather
than to the lines that actually overflow.

`ci.yml` is 20 lines, `lefthook.yml` 18, and the `hooks` panel carries two artifacts, so a
keyboard reader tabs roughly twenty stops through one panel. Each takes the global
`:focus-visible` outline, so it looks like a control and is not, and perhaps two of them
scroll anything at 1024px.

Not a WCAG failure — the mechanism is right and the alternative (no focusable scroller) is
worse. Recorded because the cost is real, it is paid on six panels, and the component's
header currently reads as though the question were settled.

**Closed 2026-08-18** (`fc915bb`) with exactly that, and the measurement is the evidence.
`OverflowFocus` sets `tabIndex` from `scrollWidth > clientWidth` per cell, re-running on
resize through a `ResizeObserver`.

Measured against a real build on `strict`'s eleven lines: **5 focusable at 320px, 2 at 768
and 1024, 1 at 1440** — matching the overflow count exactly at each width, against eleven
at every width before. `ci.yml`'s twenty lines contribute **none** at 1024px, which also
corrects the component docblock: the 92-character line that justified per-line scrollers is
the exception, not the rule.

The second measurement is the one that matters. Checking only 1024px would have shown zero
stops and looked identical to a mechanism that always answered "not focusable".

Implemented with a ref callback rather than an effect, because
`react-hooks/set-state-in-effect` is an error here and measuring into state would fail lint
and cascade a render. It sets `tabindex` imperatively on nodes React owns, which is safe
only while the lines are static markup — recorded in the component, since it stops being
safe the moment a line becomes dynamic.

### TD-19 — Scored radiogroups have no roving tabindex · **Medium**

`SeverityScorer` and `Toolkit` (discovery), `SizeScorer`, `HorizonTriage` and
`DoneStatement` (planning), `ReversibilityTable`, `ModelInterrogation` and `SplitTrigger`
(architecture) — every scored or tabbed exercise across the three built stages — departs
from the WAI-ARIA APG's radiogroup pattern: each `role="radio"` is its own tab stop rather
than the group being a single stop with arrow keys moving focus inside it.

Raised and ruled on four separate times during three stage builds (T9/M2, T10/M4, T10/M5,
T11/M1), correctly each time — matching the existing convention beat inventing a
one-stage fix — but no ruling landed anywhere durable, so the same finding kept
resurfacing with nothing to point at. Recorded here so the fifth stage to raise it finds a
tracker entry instead of reopening the question.

**Closes with:** one shared roving-tabindex behaviour (`tabIndex` 0 on the checked or
first option, -1 on the rest, arrow keys move and check, Home/End jump to the ends) that
every scored radiogroup adopts, so the fix lands once rather than per component.

### TD-20 — Score live regions mount already populated, so the first exercise commit is announced silently · **Medium**

`ReversibilityTable.tsx:51-58`, `ModelInterrogation.tsx:49-56` and `SplitTrigger.tsx:44-51`
(stage 03), and their stage 01/02 equivalents, wrap the running score as
`{answered > 0 && (<span aria-live="polite">…)}`. The live region does not exist in the DOM
until the reader's first answer, so it arrives already holding content — a screen reader
has nothing to have been watching, and content that appears pre-populated is not reliably
announced. The first scored commit of every exercise in the app is silent for that reader.

The correct pattern already exists three lines below the incorrect one in the same files:
each row's verdict region is `<div aria-live="polite">`, always mounted, with only its
contents conditional on whether that row has been answered. Nobody had to invent a fix,
only apply the one already sitting in the file.

Same provenance as TD-19: raised and correctly deferred to existing convention four times
(T9/M2, T10/M4, T10/M5, T11/M1) with no tracker entry until now. Worth recording precisely
because this stage's own Definition of Done says "Deferred decisions listed explicitly, so
deferral is visible rather than forgotten" — four deferrals of the same finding, recorded
nowhere a future reader would look, is the playbook not taking its own advice.

**Closes with:** always mount the score header's `aria-live` region and make only its
contents conditional, matching the per-row verdict pattern already in each file. A single
shared score-header component (paired with TD-19's roving-tabindex fix) would close both
at once.

### TD-14 — Stage 02 exercise cards render at two different widths · **Low**

`HorizonTriage` builds its item cards from `role="list"` divs (full container
width), while `CutTable`, `DoneStatement` and `SliceSequencer` use real `<li>`
cards that hit the 68ch measure cap. On a wide screen the horizon cards are about
twice the width of the others on the same stage. Found by the final whole-branch
review (M2). Cosmetic, not wrong — the `<li>` cap is the established stage-01
pattern (`QuestionLab`), and the horizon divs were a deliberate escape for their
own reason — but the two now sit in one stage at visibly different widths.

**Closes with:** pick one width for exercise cards stage-wide — either cap the
horizon cards to the measure, or lift the others. A polish-pass call, not a bug.

### TD-13 — Stage 02 has a "Scaling to a team" block; stage 01 does not · **Closed 2026-07-28**

~~Stage 02's interactive build includes a collapsed "If you are not solo" disclosure porting
the doc's team section; stage 01 silently dropped its equivalent.~~ Closed in `cf1aada` by
retrofitting stage 01 rather than by removing stage 02's — 32 insertions, 0 deletions, one
file, every added line either the import or inside the `TeamNotes` block. Content matched
line-for-line against `docs/01-product-discovery.md:221-230`.

**The rule, which is the actual deliverable:** every stage ships its doc's "Scaling to a
team" section as a **collapsed disclosure**, in the final content step, after the content
and before the traps. Collapsed because the solo reader is the baseline (D-3) and must never
be slowed by team material; present because the doc has it and the app is not allowed to
quietly hold less than the doc. `TeamNotes` is the shared component — do not re-invent it
per stage. Stages 04–18 now copy a convention instead of choosing a precedent.

### TD-29 — The Vercel rollback commands now live in two stage docs · **Low**

`docs/04-project-setup.md`'s **§10 Write the README before the code** and
`docs/13-production-deployment.md`'s **§Rollback** both print `vercel rollback`,
`vercel ls` and `vercel promote`. Opened by the fix wave on
`fix/stage-04-doc-corrections`: §10 needed a rollback mechanism to make its own README
artifact producible (cold-reader N19), and 13 is where the material properly lives, so §10
gives the command and links onward.

The duplication is deliberate and small. What makes it debt is that **only one copy carries
the Hobby-plan caveat** — that `vercel rollback` will only return to the *previous*
production deployment, which is why `promote` exists as the way further back. §10 has it
because its reader is on the free plan by default; 13 does not. Two prints of the same
command, one of which is missing the constraint that decides whether it works, is the
`.nvmrc`/`engines.node` shape at lower stakes.

Closes by either putting the caveat in 13 as well, or cutting §10 to a pure cross-reference
once a reader arriving at §10 can be trusted to follow it. Not resolved on the branch that
opened it, because 13 is outside stage 04's scope and editing it there would widen a fix
wave that had already grown past its plan.

### TD-30 — Stage 04's §5 installs Vitest under an env-variables heading · **Low**

`### 5. Environment variables, validated at boot` ends by running `pnpm add -D vitest`,
adding the `test` script, and explaining `--passWithNoTests` — roughly a fifth of the
section, about neither environment variables nor booting.

Pre-existing, and it read as a reasonable aside when §5 was short. The fix wave on
`fix/stage-04-doc-corrections` roughly tripled the section (the required/optional key split,
the `.env.example` step, the client-boundary limit), and the tail now reads as though it
were appended to whatever section happened to be last. The reader consulting §5 for an env
question scrolls past a test runner to reach it.

Closes by giving the test-runner install its own numbered section, or folding it into §7,
which is the gate that calls `pnpm test` and the reason it is installed this early at all.
Renumbering is the cost, and it is why this was not done inline: entries 8–11 of the
cold-reader list cite `### 7`, `### 8` and `### 10` by number, and renumbering mid-wave
would have invalidated the brief the next agent was working from.

### TD-31 — Stage 11 still carries the action pins stage 04 just corrected · **Medium**

`docs/04-project-setup.md`'s **§7 CI, on day one** opens "Full detail in
[11 — CI/CD](11-ci-cd.md)" and then pins `actions/checkout@v7`, `pnpm/action-setup@v6` and
`actions/setup-node@v7`, each verified live against the GitHub API during the fix wave and
re-verified when this entry was written (`v7.0.1`, `v6.0.10`, `v7.0.0`).
`docs/11-ci-cd.md` still pins all three at `@v4`, in both of its workflows, plus
`actions/upload-artifact@v4` against a current `v7.0.1`.

The stale pins are **pre-existing** — 11 has never been through a correction round. The
*divergence* is this branch's, and it is worse than either state alone: §7's own first
sentence sends the reader to the document holding the version §7 exists to fix. Ranked
above TD-29 and TD-30 for that reason and no other; the `@v4` pins all still resolve, so
nothing breaks, and what a reader loses is the ability to trust either page.

Closes when 11 gets its own correction round, which is where the edit belongs — it has two
workflows, an artifact upload and a caching story that this branch never read. Editing it
from stage 04's branch was a non-goal at spec time and stayed one. Opened by the
whole-branch review, which found it on no `Deferred:` list: an unnoticed deferral rather
than a deliberate one, and the difference between those is the whole point of keeping the
list.

### TD-32 — Stage 04's §5 hands the reader a check that cannot fail · **High**

`### 5. Environment variables, validated at boot` is the section whose entire promise is
that a missing variable stops the app. The obvious way to confirm that promise is the one
a reader will take: leave `pnpm dev` running, blank `SESSION_SECRET` in `.env.local`, and
reload the page. **Turbopack does not re-evaluate `env.ts` when `.env.local` changes.** The
fix wave on `fix/stage-04-doc-corrections` watched it log `Reload env: .env.local` and go
on serving **200** off the cached module; the same edit followed by a restart gave **HTTP
500** carrying the Zod `too_small` thrown from `env.ts` at module evaluation. Observed
there and not re-run for this entry, which is why the restart is stated as the fix rather
than as the only fix.

That is worse than an undocumented quirk. The reader who verifies without restarting sees
the app keep working and concludes the validation is wired when the only thing proved is
that a module was cached — a green result that a broken implementation produces too. Rated
alongside **TD-26** and **TD-27** because it is the same defect, in the reader's hands
rather than ours: a check whose passing outcome carries no information. §5 says nothing
about it.

Closes with one sentence in §5 saying to restart the dev server, and the reason. It is
deliberately not a one-line drive-by: the cheap phrasing ("restart after editing
`.env.local`") teaches the ritual and not the reason, and the reason is the transferable
half — a validation that runs once at module evaluation can only be re-tested by causing
another module evaluation.

### TD-33 — Stage 04's §9 may install the Sentry SDK twice · **Low**

`### 9. Error tracking` runs `pnpm add @sentry/nextjs && pnpm dlx @sentry/wizard@latest -i
nextjs` as one line. The wizard installs the SDK itself, so the explicit `pnpm add` is
plausibly redundant — and if the wizard resolves a different version than the one already
in `package.json`, the reader watches their dependency change during a step that claims to
be about configuration.

Unproven, and that is the whole reason it is debt rather than a fix. Confirming it needs
the wizard run against a real Sentry org, which this machine has no login for; §9 is
marked *not executed* in `docs/verification/stage-04-doc-execution.md` for that reason.
Guessing at the resolution would put an unverified instruction in the section whose
subject is that unverified instrumentation fails silently.

Closes the next time anyone runs the wizard against a real org: either drop the `pnpm add`
or keep it and say why. Low because both orderings leave the reader with a working SDK.

### TD-35 — The audit's console check cannot see a dev-only warning · **High**

`e2e/audit.spec.ts`'s "zero console errors across every page and step" runs against a
production build, deliberately: the dev overlay pollutes the console and the dev server
renders differently, which is why `playwright.config.ts` builds and serves rather than
reusing `pnpm dev`. **React strips its development-mode validation from a production
build.** Everything in that family is therefore invisible to the gate: missing-key
warnings, invalid DOM nesting, `act()` warnings, hydration-mismatch detail, prop-type
complaints.

This is not hypothetical here. `RevealList` logged *Each child in a list should have a
unique "key" prop* on **every** `pnpm dev` page load of `/stages/03-architecture#ai` from
`1772555` until `f1a23e7` fixed it, while the audit reported 14/14 throughout. It was found
by an implementer opening the dev server for an unrelated visual measurement, which is
luck rather than process. **It then happened a second time on the same branch**: the fix
keyed the row header and left `Card`'s three children, so `#tenancy`, `#trace` and
`#indexes` warned on every dev load until the whole-branch review caught it, with the audit
reporting 14/14 the entire time. Two notes now recorded in `audit.spec.ts` for anyone
checking by hand: React attributes the warning to the *rendering* component (`Card`), not
the defective one; and the blind spot is narrow — Fast Refresh patching an already-open tab
does not fire it, and a reload within a second or two of saving can race the rebuild, but a
settled reload fires reliably. **An earlier version of this entry said the warning only
fires on a cold server and that any edit-and-reload reads clean. That was wrong**, disproved
across three cold-server runs by the final scoped re-review, and it is corrected here rather
than rewritten away: what actually let both instances survive is that every manual check
loaded a single page, and `#ai` exercises neither `header` nor `footer`.

CLAUDE.md states the standard as "**zero console errors in a clean browser context**". The
production-only check does not meet its own wording, and nothing says so at the point where
someone reads the result. Same defect class as **TD-26** (a sweep green about surfaces it
never evaluated), **TD-27** and **TD-32**: a check whose passing outcome carries less
information than a reader will assume. Rated alongside them.

Closing it is not simply "also run it in dev". The dev overlay is a real source of noise
and the reason for the current shape, so the fix has to distinguish React's own warnings
from the overlay's — plausibly a second, narrow spec that loads a small set of pages
against `pnpm dev` and fails on `console.error` matching React's warning prefixes only.
Until then, `audit.spec.ts` should at minimum say in a comment what its console check
cannot see, so the next person reading 14/14 knows what it excludes.

### TD-37 — The equivalence instrument no longer sweeps what the audit sweeps · **Medium**

`e2e/count-expandables.mjs` exists to make the before-and-after count obtainable for a
refactor that replaces disclosure components — the 140 expandables / 107 distinct ids that
proved eleven migrations on the `RevealList` branch. Its own header states the constraint it
runs on: the URL derivation mirrors `audit-pages.ts`, duplicated rather than imported because
the file is plain `.mjs`, and *if that changes, change this with it, or the two stop measuring
the same thing.*

That is what happened. W-6 appended `/reference` and eleven cheatsheet URLs to
`audit-pages.ts`, taking the audit's sweep from 36 URLs to **48**. The `.mjs` copy was not
updated and still derives the stage URLs only, so it reports over **36**. Measured on
`develop` at `49122f5`: the audit sweeps 48, the instrument sweeps 36, and the instrument does
not say so.

Nothing is wrong with either number in isolation, which is why this is debt rather than a bug.
The cost is that a future refactor touching a disclosure on a **reference sheet** would be
verified by a count that never loaded it, and the count would look exactly as authoritative
as the one that proved the eleven migrations.

Found while writing the stage 04 port plan, by running the instrument rather than quoting
its last recorded output.

**Closes with** appending the `CHEATSHEETS` slugs to the `.mjs` derivation, or by making both
read one generated list. The stage 04 port does not need this — it moves stage panels only,
and the 36-URL set covers all of them — so the plan states which set its number covers rather
than fixing it mid-round.

### TD-38 — The pre-commit format hook does not reach `docs/` · **Low**

A commit touching two markdown files under `docs/` printed
`format (skip) no files for inspection` and `lint (skip) no files for inspection`, then
committed. The hook did not check them and did not claim to; it reported success on a commit
it had inspected nothing in.

This is the shape stage 04's own §6 teaches, which is what makes it worth recording rather
than shrugging at: a glob narrower than what CI covers produces a hook that reports success on
a commit CI then rejects, and `README.md` is the file the doc names as likeliest to slip
through. Here the exposure is smaller — CI runs `format:check` over the repository, so the
gate that matters still fires — but the local hook is decoration for every markdown file
outside its glob, and this repository's markdown *is* half the product.

Not yet diagnosed: whether the cause is the glob, the `root:` scoping in `lefthook.yml`, or
the hook running with `web/` as its working directory. Diagnose before fixing — the three have
different fixes and only one of them is the glob.

**Closes with** a hook run that reports the two files by name on a `docs/`-only commit, and a
teeth check that a deliberately mis-formatted markdown file fails it.

### ~~TD-36~~ — Nothing catches a step that disappears from stages 01 and 02 · **CLOSED 2026-08-17**

TD-12 closed by deriving the audit's sweep from the rail each ready stage renders, which
means a step that ships is always swept. The reverse is now unguarded: a step deleted or
renamed by accident simply leaves the sweep, and nothing fails.

Stage 03 is covered by construction. `features/architecture/steps.ts` exports `STEP_IDS`,
`Architecture.tsx` types its `Step[]` against it, and `TRACE_ROWS[].stepId` resolves against
the same list — so an id that exists nowhere is a compile error. Stages 01 and 02 declare
their ids inline in the component and have no equivalent.

The asymmetry is deliberate rather than an oversight: a declared list is a specification and
the rendered rail is an observation, and TD-12's recorded failure was the sweep falling behind
the app, not the app falling behind the sweep. Both are real; only one was costing anything.

**Closes with** a `steps.ts` per stage on the stage-03 pattern, most cheaply as part of
building the next stage rather than as its own round — the stage-04 port will write one
anyway if it follows stage 03's shape.

**One thing to do at the same time, because it comes due on the same commit.**
`e2e/audit-pages.spec.ts` pins today's thirty-six URLs as a literal. That was a one-shot
migration proof, and it is the only check that would catch `auditPages` covering stage 01
and then stopping — an early `break`, a stray `.slice`, a `continue` that swallows a stage.
It goes red the moment stage 04 ships, for a correct reason, and the obvious fix is to paste
in whatever the derivation now emits. That would make the expectation generated by the thing
it checks, which is the defect this project has recorded seven times. **Delete the test and
its array; do not edit them.** If the coverage is wanted, assert stage coverage instead —
the set of stage paths in the derived list equals `STAGES.filter(s => s.ready)` mapped to
`/stages/<slug>`, which checks the filter rather than checking step ids against themselves.
The file says this too, at the point someone will be looking.


---

**Closed 2026-08-17**, on the stage 04 port (`394e515`, `08131ac`, `0b18150`).

**Read the "Closes with" clause and the title together, because they are not the same
thing, and the first commit satisfied one while claiming the other.** A `steps.ts` per
stage on the stage-03 pattern makes an id *renamed* in one place and not the other a
compile error. It says nothing about a step *deleted*, which is what the title names — a
review proved it by removing a whole step object from `ProductDiscovery.tsx`: typecheck
clean, 385 tests green, and the sweep one URL shorter in silence.

So this closes on three guards rather than one, and it is worth knowing which does what:

- **`steps.ts` per stage** (`394e515`) — an id that exists nowhere is a compile error.
  Stages 01 and 02 gained one; stage 03 already had it.
- **`features/rails.test.tsx`** (`08131ac`) — renders every ready stage and compares the
  rail it draws to that stage's tuple, in jsdom, in the unit gate. This is the direction
  the type cannot reach. It also fails when a stage goes ready with no entry, which is how
  stage 04 was caught before it had one.
- **`e2e/audit-pages.spec.ts`** (`0b18150`) — the same comparison against the *built* app,
  so a `readStepIds` selector that returns half a rail fails rather than shrinking the
  sweep. Teeth-checked by making it drop the last tab.

**This entry's own premise was partly wrong** and is left standing above rather than
edited: it says stage 03 "is covered by construction" for the deletion direction. It was
not — stage 03 had the identical one-directional guard, and gained the second one here
along with 01 and 02.

**What is still not covered**, stated so the strike-through does not overstate: a step
deleted from *both* the tuple and the component compiles and renders consistently. Only
that stage's own `steps.test.ts` ordered literal fails, which is why each stage has one.
### TD-34 — `RevealList` hardcodes `<h3>` for row headings · **Low**

Every `RevealList` row wraps its trigger button in a literal `<h3>`, with no prop to change
the level. A caller whose own section heading is also `<h3>` therefore gets a flat outline
where a nested one is correct, and cannot do anything about it.

Two callers are in that state. `ScalingMoves` already was before the extraction, so it is
inherited rather than caused. `AIArchitecturePlays` **acquired** it in `1772555`: its rows
were `<h4>` under an `<h3>` section heading and became `<h3>` siblings of it. Verified
against `11cbec0` that the `ScalingMoves` precedent is real and not a deflection.

Nothing renders differently — `globals.css` sets no global `h3`/`h4` rule — so the entire
cost falls on heading-based navigation in a screen reader, where each list's claim rows now
present as peers of the `<h3>` that introduces them rather than as its children. Low
because it degrades an outline rather than breaking a control, and because no automated
check in this repo currently looks at heading order at all, which is arguably the larger
gap it points at.

Closes with a `headingLevel?: 'h3' | 'h4'` prop on `RevealList` defaulting to `h3`, so
existing callers are untouched and `AIArchitecturePlays` passes `h4` to get its original
outline back. Structural to the shared component, which is why it was reported rather than
fixed mid-branch: eleven migrations were reviewed against a stable `RevealList`, and
changing its markup at task sixteen would have invalidated the byte-identity evidence every
earlier review rested on.

---

## Bugs found and fixed

Kept because the pattern is more useful than the individual fixes: nearly all of
these were found by checking rather than by reading.

| Where | Bug | How it surfaced |
|---|---|---|
| `useLocalStorage` | setState inside an effect caused a cascading render | React 19 lint rule, treated as a real error rather than suppressed |
| `layout.tsx` | Theme script read a raw string, but the hook writes JSON — theme silently stopped applying | Checked the stored value rather than trusting the toggle looked right |
| `Worksheet` | Referenced `hydrated` after the hook stopped returning it | Build failure |
| `DiscoveryFlow` | `bg-fg-subtle` is not a real token; three status dots rendered invisible | Screenshot review, then a sweep of every colour class |
| `OpportunityTree` | Legend promised colour coding the nodes did not show | Screenshot review |
| `DiscoveryFlow` | Component defined inside render — state reset every render | Lint |
| Sidebar | Group labels were `<h2>` before the page `<h1>`, breaking the heading outline | Accessibility structure check |
| `concurrency.ts` | Taught that two workers on a queue both get a row under `SELECT … FOR UPDATE`. That is `SKIP LOCKED` behaviour; at read committed the second worker re-evaluates the predicate after the first commits and gets **zero** rows | Per-task reviewer subagent, reasoning about Postgres semantics rather than reading the prose |
| `styles.ts` | Claimed transaction-mode pooling breaks the `SELECT … FOR UPDATE` the stage teaches. It does not — the pooler holds one server connection for a whole transaction, so a row lock inside it is safe; the doc's three items are all *session*-scoped. The app therefore contradicted itself four steps apart, since `races` scores `FOR UPDATE` as the right answer | Same, and the same class: a factual claim about an external system, added beyond the doc, in the one clause the doc did not write |
| `LockingChoice` / `concurrency.ts` | "SERIALIZABLE is the answer to none of these" — stronger than the doc and than Postgres, which aborts one writer in two of the three cases. The overstatement had been written into a test *name*, which is how it became durable | Reviewer checked the claim per case instead of accepting the framing |
| `ResiliencePatterns` | One card told the reader graceful degradation is "always, and it costs nothing" and then that "building all four on day one is over-engineering" — the port had swapped it into the doc's four and kept the doc's closing sentence | Reviewer read the panel as a reader rather than as a diff |
| `evolve.ts` | Applied the doc's rule about ***destructive*** migrations to the one purely additive step, while the same card rendered that rule with "destructive" intact four lines below | Reviewer traced the rule back to the doc's stated reason (rollback) rather than to its wording |
| `ExpandContract` | All six checkboxes had the accessible name "I'd skip it", so a screen-reader user in focus mode got six identical controls with nothing tying them to a step | Reviewer compared against the component's own cited model, `AuthzPatterns` |
| `LockingStrategies` | SQL blocks sat in a grid; grid children default to `min-width: auto`, so `overflow-x-auto` did nothing and the page scrolled sideways 204px at 320px | The audit suite, on the first run after the component landed |
| `styles.test.ts`, ×2 | Two tests passed on strings asserting the **opposite** of their names — `/transaction mode\|session state\|advisory lock/` passes on "transaction mode is fine and breaks nothing" | Reviewer ran the regexes against counter-examples instead of reading them |
| Palette | `--faint` at 2.99:1, accent at 4.11:1 — both below AA | Exhaustive contrast audit |
| Home hero | "DEVELOPMENT" needed 333px in a 280px box at 320px wide | Responsive sweep |
| `ProductDiscovery` | JSX dropped the space around inline `<Term>`, rendering "solution treeis" | DOM inspection after spotting it in a screenshot |
| Home index | Hero placed in a 2-col grid overflowed 137px at 1024px — expanded caps do not fit a half column once the sidebar appears | Responsive sweep at the exact breakpoint |
| Home index | `.measure-full` sat on the `<ul>`, but the global 68ch cap lands on the `<li>`; rows stayed capped and cadence stopped mid-page | Measured the row's right edge against the content edge |
| Lint gate | eslint exits 0 on warnings, so an unused variable passed both the hook and the script — twice | Hook teeth check; fixed with `--max-warnings 0` in both places |
| Ad-hoc audits | The old touch-target sweep excluded `aria-controls` elements wholesale, silently masking inline Term buttons | The committed suite's first run; resolved per WCAG 2.5.8's inline exemption |
| CI typecheck | `PageProps` is generated into `.next/types/` by the build, so `tsc --noEmit` before `build` fails on a clean checkout. Local passed only because `.next` lingered | **CI's first real run.** Reproduced locally by deleting `.next`; fixed with a `typecheck` script running `next typegen` first, used by both CI and the pre-push hook |
| `DomainSketch` | The naive-sketch figure rendered `draft \| sent \| paid`, **pre-answering the interrogation exercise in the same stepper panel** — which asks whether "overdue" is a status or computed | Controller review holding cross-task context. The task reviewer had passed it as faithful to its brief, correctly on its own terms: the brief said three, and the brief was wrong |
| `BoundaryMap` | `EDGE_NAME` hardcoded "allowed"/"not allowed" into each accessible name while only the visible badge derived from `edge.legal`. Correct output today, but flipping the data would tell a sighted reader and a screen-reader user opposite things with nothing failing | Task review. Fixed by appending the suffix from `edge.legal`, teeth-checked by flipping `legal` and proving the name followed — then proving the revert with an empty `git diff` |
| Worksheet placeholders | All three worksheets ship instructional placeholder text at 2.77:1 in light mode | Sampling `::placeholder` by hand after noticing the audit suite keys on `el.textContent`, which a placeholder does not have. **TD-16** |

**Four false alarms worth remembering.** A link checker once reported 124 broken
links — the checker was broken, not the links. A contrast audit reported 1.34:1
— the parser could not read `oklab()`. Both were investigated rather than
"fixed", and the second one still led somewhere useful: it exposed a frosted
alpha background that had no business in a print-derived design.

Stage 03 added two more, both colour, both disproved rather than "fixed":

- A **phantom AA failure** from flipping `data-theme` and calling `getComputedStyle` in the
  same evaluate call. The elements carry `transition-colors duration-150` and
  `getComputedStyle` returns the *used* value, so the read sampled a colour mid-interpolation
  that belongs to neither theme. Decisive evidence: the offending `rgb(173,192,212)` is dark
  mode's `--graphite`, and on a clean reload it exists nowhere in a light render.
- A placeholder probe reporting **7.64:1 light / 1.09:1 dark** for the same colour. It
  resolved colours by assigning to `canvas.fillStyle` and reading the string back; Chromium
  echoes `oklab()` unchanged, so the regex read oklab's lightness/a/b channels as R/G/B. The
  giveaway was physical impossibility — `oklab(0.7334 …)` is pale and cannot composite to
  `rgb(3,6,10)`. Rasterizing instead of parsing gave the real numbers (2.77:1 / 4.44:1), which
  is TD-16.

That is three oklab-parsing incidents. Both traps, and the "the gate is green because it never
looked" case, are written up in `docs/learnings/contrast-checkers-lie.md`.

---

## Process observations

Kept separate from the bug ledger because these are about how the work was run, not
about the code.

### Most of stage 03's defects were plan-authored, not implementer error

Three of the findings on `feat/stage-03-architecture` originated in the **plan**, and the
implementers followed it correctly:

| Finding | What the plan got wrong |
|---|---|
| Task 2 | The task's test block omitted `import '@/test/localstorage-polyfill'`, without which the suite cannot run under `environment: 'node'` |
| Task 5 | Every `docs/03-architecture.md:NNN` citation was written before Task 1 inserted ~48 lines at line 186, so all citations into later sections were stale on arrival |
| Task 8 | `DomainSketch`'s status enum was specified as `draft \| sent \| paid`, which pre-answers the interrogation exercise Task 10 renders in the same panel |

**The pattern worth carrying:** a per-task review sees one diff and judges it against one
brief. All three of these were invisible at that altitude — the Task 8 reviewer explicitly
passed the figure as faithful to its brief, which it was. They surfaced at controller level,
where the cross-task context lives. Two consequences for the next stage build:

1. **Budget for controller-level review of task *interactions*,** not only per-task review of
   task *outputs*. The question "does this task's output undermine another task's output?"
   has no owner otherwise.
2. **Line-number citations go stale the moment anything edits the doc above them**, and
   nothing in the toolchain detects it. See D-42 — the convention is now to cite by heading.
   This round hit it four times: the plan's briefs, the committed `scoring.ts` comment, the
   five citations shifted by Task 17's own two-clause doc fix, and finally `AuthPaths`.
   Auditing the class then found **ten more in stage 02**, stale since that stage's own AI
   section was inserted, one of them off by ~86 lines. Fourteen wrong citations in total.

3. **A grep confirms the shape of a citation; only opening the file confirms it is true.**
   The sweep that missed `AuthPaths` matched `docs/03-architecture\.md:[0-9]*-[0-9]*`, so it
   could only see citations on a line repeating the filename. Invisible to it: bare `:NNN`
   continuations on their own line (the miss), single-line citations with no range
   (`SpikeCard`'s `:285`), and every citation to a different doc (all eleven stage 02
   ones). Two citations were caught **by luck**, sharing a line with their primary. The audit
   that worked opened all 33 cited ranges and checked each against what the comment claimed —
   which also caught two comments that were *misquoting* the doc, a kind of wrong that
   renumbering would never have surfaced.

A fourth finding is the mirror image and worth recording as such: an implementer proposed
adding a rule to `PATTERNS.md` (that a `<Term>` must never be the first child of a `<p>`)
and **review disproved it** by transpiling with the repo's own TypeScript. Position in the
paragraph is irrelevant; the real variable is whether the whitespace between the tag and the
adjacent text contains a newline. The rule would have forbidden a safe shape and still
permitted the unsafe one. It was not added. `PATTERNS.md`'s existing note was sharpened to
state the mechanic instead, so the same false rule is not proposed a third time.

### Long-running agents lose work; persistence has to be incremental

Four agents on this round were terminated mid-flight — a watchdog stall, an account session
limit, and two connection drops. What survived in every case was whatever had already been
written to a file. The instruction that worked was "write the report first, then do the
work, saving after each step": one agent's report persisted at 286 lines with its evidence
intact and the remaining sections explicitly marked OUTSTANDING, which made resumption cheap
rather than a redo. This is now standard for reviewers as well as implementers.

### A per-task read-only reviewer pays for itself; the same session cannot self-review

Four reviewer subagents ran across tasks 5–9 and 11 of the D-52 round and returned **fourteen blocking
findings**, every one real on verification. Two were factual errors about Postgres — a `SELECT
… FOR UPDATE` that was described doing what `SKIP LOCKED` does, and a pooler caveat that
claimed transaction-mode pooling breaks a transactional lock. Both read plausibly, both sat in
the one clause of an entry that the doc had not written, and both were in content the
implementer had also written the test for. That is the shape of the defect a self-review cannot
catch: the same reading that produced the claim produces the check.

Two mechanical lessons came with it.

**A test name is a claim, and it goes stale like one.** Four times on this branch a test's name
promised more than its assertion — `/transaction mode|session state|advisory lock/` passes on
"transaction mode is fine and breaks nothing". Twice the offending test had been cited in a
commit body *as the fix*. The reviewer's method is the one that works: run the regex against a
counter-example rather than reading it.

**Most of the round's errors were still plan-authored.** Five of six tasks found the plan's
brief wrong about the shape of the work — two seams that measured wrong, a compression lever
that had been applied years earlier, a step-count assumption, and a play count taken from a
status doc rather than from the doc. The plan was written by the same agent that wrote the
spec, which is the same failure mode one level up.

### A per-task reviewer can only check what it can see

Implementers on the stage 04 doc round received numbered ambiguity resolutions in their
dispatch message. Reviewers received the brief, the report and the diff. So an implementer
writing "per the brief's ambiguity resolution #1" was citing something that existed, was
correct, and was unfindable by the one person whose job was checking it. Two reports did
exactly that before anybody noticed. Task 5's reviewer flagged the citation as unverifiable
and was right to — the substance was sound (it was the controller's resolution #3, "the
scripts matter as much as the files"), the traceability was not there at all. Task 2 had
produced the same shape one task earlier.

The problem is not that the resolutions were wrong. Every one of them held up on the
merits. It is that a *review clean* verdict covering a requirement the reviewer never
received is a verdict about something smaller than it looks, and nothing in the artifacts
says which requirements were in that state.

Fixed from Task 6 onward: the reviewer dispatch carries the resolutions verbatim, so a
citation to one can be checked. Worth carrying past this round, because anything a
controller settles at dispatch time is a requirement — an ambiguity call, a scope
decision, an instruction to trust a command over the plan — and a requirement only one side
of the review can see is being enforced on trust.

### An agent that batches its work for one commit at the end looks hung

Task 8's first attempt took all twelve fix entries in a single dispatch. The watchdog fired
at 600 seconds. `git log` and `git status` were both clean and no report file existed: the
agent had reached entry 7 of 12 and was holding every edit in memory for one commit at the
end, so the stall cost all seven.

The retry split the task in half and made "commit after each entry" the first instruction
rather than the last. Task 8a then ran **1034 seconds without stalling**, nearly twice the
first attempt's whole lifetime, and left seven commits behind on the way. The work was not
faster and it was not smaller. It was visible. A watchdog waiting on silence cannot tell a
working agent from a hung one, and batching makes every long task look like the second kind.

Only half of that is infrastructure. Stalls are a known pattern here — three of five
dispatches stalled on 2026-08-11 and every retry succeeded — so one stall is treated as
infrastructure and a second on the same prompt as signal. The recoverable half was the
controller's: the brief said "commit in coherent groups" and never said commit *as you go*,
so a stall cost everything instead of the last group. That sharpens the note above about
incremental persistence rather than repeating it. Writing the report incrementally is not
enough by itself, because a report describing uncommitted edits describes a tree that no
longer exists.

### Seven checks that could not fail, on one branch

`refactor/reveal-list` was a relocation. Nothing about it was supposed to be interesting,
and it produced the strongest evidence this project has that **a green check is not
evidence until something has watched it go red**. Seven separate checks on that branch
returned a passing result they would also have returned if the code were broken. Six of
them were written by this session's own controller, in a plan whose whole subject is
proving that eleven components still render what they used to.

The sequence, because the order is half the lesson. The ledger numbers the third, sixth
and seventh explicitly; the others are placed by where they were found.

1. **The expandable baseline was stale and unobtainable at once.** The plan said "expandable
   count unchanged at 108 across 36 URLs". 108 was TD-26's figure from 2026-08-03; measured
   on the branch's own tree it was **140**, with no defect in between, because stage content
   had grown. Worse, `audit.spec.ts` opens disclosures per page and never aggregates, so
   nothing anywhere printed a total. The check could not have been run even against the right
   number. `e2e/count-expandables.mjs` exists because of this, and derives `PAGES` from
   `audit.spec.ts` rather than repeating it.
2. **`RevealFacet`'s tone-map teeth check could not fail.** Mutating `TONE_CLASS[tone]` to
   `` `text-${tone}` `` left all 334 tests green. Each tone's class is its own name with a
   prefix, so the map and the interpolation emit **byte-identical** `className` strings; the
   defect exists only in Tailwind's compiled CSS, which jsdom never produces. The component's
   doc comment claimed the render test caught this. It could not, and never could have. The
   implementer found this itself rather than reporting a pass.
3. **The panel-id check grepped built HTML that never contains the ids.** These disclosures
   sit in non-default `Stepper` panels and their ids are computed inside a client component,
   so no static artifact holds the string. The grep returned zero on a working migration and
   on a broken one alike, and it shipped in **three separate task briefs** before an
   implementer questioned it. A later review ruled the general case precisely: a Server
   Component's literal JSX children do serialise into the RSC flight payload and are
   greppable, but a template literal evaluated in a Client Component never reduces to a
   literal substring.
4. **A badge test that a deletion mutation could not fail.** "Renders no badge for a row that
   does not carry one" survived `{row.badge}` → `{null}`, because no fixture row carried a
   badge and absence is indistinguishable from deletion. The review's ruling is the useful
   part: **the controller's instruction was wrong, not the test.** A different mutation, a
   wrongly-added default badge, does fail it. Insensitive to one mutation is not vacuous. The
   fixture was strengthened anyway so a badge leaking across rows is caught.
5. **A gap changed and nothing saw it.** `RevealList` applies `space-y-3` unconditionally;
   Tailwind v4 compiles that to a `margin-block-end` on every child but the last, so
   `Normalisation` went 4px → 12px and `TraceForward` 12px → 24px. **The count stayed 140,
   the ids stayed 107, the audit stayed 14/14 and all 342 tests passed.** Only measuring the
   computed gap in a real browser, against the pre-branch original, finds it. `TraceForward`
   is the sharper half: three independent analyses, two reviewers and the controller, agreed
   the margins would collapse to 12px, and the browser said 24px, because the trailing `<a>`
   is `inline-flex` and an inline box's margin does not collapse with a block sibling's.
6. **The same interpolation blindness, a second time, and anticipated.** Removing
   `BODY_TONE_CLASS` left both new render tests green for exactly the reason found in Task 1.
   Only `RevealFacet.source.test.ts` went red, which is what that file exists for.
7. **A dev-only React warning behind three stacked blind spots.** Once a caller passed a
   `ReactNode` title built inside its own render, React logged a missing-key warning on every
   `pnpm dev` page load. The audit's "zero console errors" test **runs a production build,
   where React strips dev-only validation** — 14/14 while the dev server warned continuously.
   CLAUDE.md's standard is zero console errors in a clean browser context; the gate cannot
   see this class at all. The test written earlier to cover `ReactNode` titles missed it
   because its element was built at module scope and so had no owner. And the obvious
   correction to that test **still** could not fail: React's reconciler gates the check on
   `_store.validated`, which the JSX dev-runtime pre-sets for statically-written sibling
   children, and Vite/oxc marks `RevealList`'s exact shape static where Turbopack does not.
   Rendering the real, unmodified component through Vitest stayed silent. Confirmed
   empirically before being assumed, then verified again by a reviewer reading React's own
   source.

Three things worth carrying:

**A check inherits the authority of the thing it is written into.** Six of these were
plan-authored, and every implementer that ran one ran it in good faith. The plan is the
last place anyone looks for a bug, which is exactly why an unfalsifiable check survives
there. This is the same finding as "most of stage 03's defects were plan-authored", one
altitude further up: it is now the *verification* that is plan-authored and wrong.

**Measure rather than reason about rendered output** (D-59). Items 5 and 7 were both
settled by a browser contradicting a consensus, not by anyone spotting the flaw.

**A teeth check is only meaningful against a mutation the test could plausibly catch.**
Item 4 is the correction to items 2 and 6, not a repeat of them: "the mutation did not fail
the test" is a finding about the pair, and the reviewer's job is to say which half is wrong.

### A commit body is written while finishing; a report is written while accounting

Two task implementers on this branch committed their work and never wrote a report. Both
gaps were caught by the reviewer, not by review of the commit. One was asked to write its
report retroactively, with an explicit instruction to say so if anything in the commit body
had not actually happened. It corrected **four** of its own claims: "1440px" was the MCP
default viewport it never queried, "both themes" was three of the four combinations, the
console check ran once and before the theme switch and resize rather than after, and it
never ran `getBoundingClientRect` at all, that having been the reviewer's work.

That is the second commit-body overstatement caught this way (`2db28ce` on the stage 04 doc
branch was the first). History here is appended to rather than rewritten, so the commit
stands and the correction lives in the report and the ledger.

The generalisation is in the heading. A commit body is written in the same breath as the
last edit, by an agent that wants to be finished; a report is written afterwards against a
tree that has stopped moving. The second reliably catches the first, which is an argument
for reports being mandatory and *checked* rather than nice-to-have. Of the branch's
nineteen task units, two have no report file at all, and Task 16's record — including the
seventh check-that-cannot-fail — survives only as ledger entries.

### A staged brief is a snapshot of a plan, not a view of it

Briefs for Tasks 4–8 were extracted early so dispatches could be immediate. The plan was
then corrected mid-branch, and the extracts kept the old text — including the vacuous
built-HTML grep from item 3 above. **Task 5 ran it.** It was saved only because its dispatch
independently required a browser check as well, so it did both; Task 7 would have been the
same gamble.

Cheap to prevent and easy to repeat: regenerate every unsent brief whenever the plan
changes, and grep the briefs, not just the plan, when a defect is corrected. The remaining
briefs were regenerated and verified to carry no surviving copy.

---

## Next up

**Next round: execute `docs/superpowers/plans/2026-08-14-stage-04-app-port.md`. The planning
pass it came out of is done, and the seam is settled.**

State to resume from, verified at the close of 2026-08-14:

- **Branch `feat/stage-04-app-port`**, cut off `develop` at `49122f5`, holding **2 commits** —
  `dc47580` (the Phase 5 re-cut) and `126b3c8` (the plan). **Not merged, not pushed.**
- `develop` is **131 commits ahead of `main`** and **is pushed**; `origin/develop` sits at
  `49122f5`. `main` stays at `8d5045c`. The promotion is the user's.
- **Nothing is half-built.** The branch is records only. No file under `web/src/` has been
  touched, `04-project-setup` is still `ready: false`, and the working tree is clean.

**Start at Task 1** of the plan. It is written to be executed task-by-task, and the two
things a fresh session most needs to know are already inside it: `audit-pages.spec.ts` goes
red the moment `ready: true` lands and must be **deleted** rather than updated (Task 2, and
the file says so in its own header), and every assembly task ends in a **measurement** rather
than an edit.

**Execution approach, recommended and not yet chosen.** Subagent-driven for the eleven
independent data and component tasks — Wave 1's six modules share no state, and stage 03's
per-task reviewers returned fourteen blocking findings a self-review would not have caught.
Inline for Tasks 12 and 13, where the merge-or-split calls on the four provisional pairs need
the whole panel table in one context rather than a subagent seeing eight panels in isolation.

**What the planning pass changed**, in one line each, with the full reasoning in the row above
and in the spec: panel weight tracks step count and nothing else, so it can only falsify a
seam (**D-64**); the seam is cut by judgment and sanity-checked against a floor; nine steps
became **fifteen**; and provisional pairs are authored split and merged on measurement
(**D-65**), which inverts stage 03's direction.

Everything below this line is the recommendation the planning pass acted on. It is kept
because the question it posed is the one the pass answered, and the answer was not the one it
expected.

---

Five branches had landed at the time it was written and all five are in `develop`: the
doc correction (`dd44b30`), `RevealList` (`e29f3fe`), TD-12 (`a07a9b6`), and the two W-6
reference-hub merges (`0207fd6`, `4727dc3`). What is left of stage 04 is the port itself, and
the first thing it needs is a seam that has been measured rather than inherited.

**W-6 is paused, not in flight.** It was a detour taken between the TD-12 close and this
round, it is finished and merged as far as it goes, and its remaining work is content that
would compete with `W-3`. It touches nothing the port touches — no `src/features/`, no stage
data, no `docs/04-project-setup.md`. The one thing to carry forward is that
`web/e2e/audit-pages.ts` now derives twelve reference URLs on top of the stage sweep, so the
audit suite's baseline is 48 URLs rather than 36.

**The spec's nine-step table is stale in a specific, checkable way.** Phase 5 of
`docs/superpowers/specs/2026-08-12-stage-04-project-setup-design.md` cuts the doc into nine
steps. It was written when `docs/04-project-setup.md` was 323 lines; the correction round took
it to **711**. Mapping the same table onto today's doc:

| Step | Doc source | Lines |
|---|---|---|
| `scaffold` | §1 Scaffold + §2 Folder structure | **129** |
| `gates` | §6 Git hooks + §7 CI | **109** |
| `strict` | §3 Lint/format + §4 TypeScript | **105** |
| `env` | §5 Environment variables | **103** |
| `deploy` | §8 Connect Vercel | 70 |
| `proof` | §9 Error tracking + §10 README | 56 |
| `ai` | AI in project setup | 38 |
| `checklist` | Definition of done + Scaling to a team | 30 |
| `traps` | Traps | 29 |

Three of the four heavy steps are **pairings the spec made when each half was about half its
current length**. Whether they still hold is a D-52 panel-weight question, and D-52's answer
comes from measuring the rendered panel, not from re-reading the table. The exit condition of
a split is the measurement, not the edit.

**Two things fold into the same round rather than waiting for their own:**

- **TD-36.** Stage 04's `steps.ts` should type its `Step[]` against `STEP_IDS` the way stage
  03's does, and extending that guard to stages 01 and 02 is a few lines inside a round that
  is already in those files.
- **`web/e2e/audit-pages.spec.ts` will go red the moment `ready: true` lands**, correctly. Its
  thirty-six-URL literal proves the TD-12 migration and nothing after it. **Delete the test
  rather than update it** — pasting in what the derivation emits makes the expectation
  generated by the thing it checks, which is the defect class this repo has now found seven
  times. The file carries that instruction in its own header.

**Also live, and not part of any branch:** `docs/superpowers/specs/2026-08-14-reference-hub-design.md`
is a **parked** design for a Reference hub, brainstormed to four decisions and stopped on an
open question (which cheatsheet leads slice 1). It rode into `develop` on the TD-12 branch
because it was written in the same session; it decides nothing about stage 04. Its three
source files under `reference/` are still untracked.

---

**Recommendation (2026-08-11): stage 04 — Project Setup, next. Decided.**

The deciding evidence was neither of the two arguments that had been sitting in the records.
Reading `docs/04-project-setup.md` to compare it against 15 turned up that its **§8 Connect
Vercel is factually wrong** — it tells the reader to match the Node version to `.nvmrc`, which
Vercel does not read — and silent on the three things that actually broke this project's first
deploy. That is **TD-28**, and it reframes the choice: not "port 04" against "port 15", but
*fix a doc that misleads* against *port a doc that is fine but unexercised*.

Three reasons it wins on this project's own standards:

1. **It is checkable.** The verification standard here is checking against something real, and
   every strong round this month came from executing something — Postgres, the live site, a
   controlled origin. Stage 04 can be checked against *this repository*, which is a project
   that was set up, deployed, and broken in instructive ways. Stage 15 has no backend, no
   Sentry and no metrics to check against; it would be the most speculative stage yet, and the
   cold-reader method would have the least purchase on it.
2. **The material is fresh and it cost something.** `docs/learnings/deploying-101.md` was
   written the same day, from scars rather than memory.
3. **It exercises the template while it is fresh.** Three rounds running, the defects landed in
   the template rather than the content. Stage 04 is where TD-16's fix, the render-test
   convention and the panel-weight rule find out whether they transfer.

**Shape of the round, decided up front rather than discovered halfway: a doc-correction phase
before the port.** Stage 03's round was a port of prose that was already right. This one is not.

**The case for 15, recorded because it is real and lost anyway.** `docs/14` defers Sentry,
error rates and latency baselines to it, so there is a dangling dependency; and "unfamiliar
ground" is a genuine argument for reader value. It loses because unfamiliar also means
research-heavy with nothing to ground it against, and stage 03 — also unfamiliar — cost 106
commits and four cold-reader runs.

Two earlier recommendations are kept below as written rather than edited, per the decisions
convention. Both are superseded: W-3.2 merged, TD-17 closed, W-5 complete.

The reasoning, rather than the assertion. All twelve tasks of the D-52 round are done, and so
is the whole-branch review the round was pointed at. Nothing is left to build on this branch.

**The whole-branch review earned its place, again.** Four per-task reviews found fourteen
blocking defects; the whole-branch pass then found seven more, so the rate did not fall off —
the last task reviewed produced three and the branch pass produced seven. A per-task review
sees one diff; only a whole-branch pass catches a task whose output undermines another's, and
this round produced two of those: a pooler caveat in `shape` contradicting the locking answer
in `races` four steps apart, and a doc paragraph still carrying the error its own port had
been corrected for.

**The finding worth carrying past this stage** is that a verification gate can be green and
measuring almost nothing. The contrast sweep clicked `button[aria-controls]`, which `Stepper`
puts on all 22 rail tabs; the loop walked the rail, unmounted the panel, and opened five
expandables across 36 pages while reporting a clean sweep of both themes.

**Then stage 04.** Not before: stage 03 is the reference implementation everything after it
copies, and it is currently a stage whose doc and app agree in most places and whose agreement
has been checked in none of them end to end.

Two things worth deciding at the same time, both surfaced by this round rather than planned:

- **Five accordions in one feature share the same markup** (`DeferredList`, `DeploymentStyles`,
  `ResiliencePatterns`, `EvolutionNotes`, `ScalingMoves`). Each was written to match the last,
  which is the right call per task and the wrong one five times. A `RevealList` component is a
  clean standalone refactor, and it is easier before stage 04 copies the pattern a sixth time.
- **The step rail holds twenty-two steps** and stopped fitting at 1440px somewhere around
  twelve. It scrolls inside its own container, so nothing fails, and D-52 deliberately says
  nothing about count — but "the rail is navigable" was the premise D-38 was defending, and
  no rule now checks it.

**Also open, in rough order:**

- ~~**`W-5` (deploy)**~~ — **complete 2026-08-11.** Live at
  `https://acp-dev-playbook.vercel.app`, and `pnpm test:prod` verifies the deployment itself.
  Automating that in CI is deferred: a push to `main` and a live build are not simultaneous.
- ~~**`TD-17`**~~ (no component-test harness) — **closed 2026-08-04.** It was the cheapest
  remaining way to raise the floor, and it paid on the same branch: the whole-branch review
  found the interrogation panel telling readers "Five questions" while rendering six, which is
  the defect class the harness exists to catch, in the component it was built around.
- ~~**`TD-16`**~~ (placeholder contrast) — **closed 2026-08-11**, both halves. The blind spot
  turned out to be two: placeholders had no text node to sample, and every `oklab()` colour was
  skipped rather than checked. Rasterising fixed both.
- ~~**`TD-12`**~~ (audit `PAGES` hand-maintained) — **closed 2026-08-14.** Stage 03 added
  thirteen hashes by hand, one per new step, which is what raised it to Medium. The sweep now
  derives from `STAGES.filter(s => s.ready)` and the rail each stage renders, so the half that
  mattered — a *missing* hash auditing nothing while the suite stays green — cannot recur.
  What it does not cover is the reverse, and that is **TD-36**.
- **`P-6`** — the remaining conventions to fold into the stage docs.

Carry into whichever round is next:

- **`TeamNotes` is the convention now** (TD-13 closed): every stage ships its doc's team
  section as a collapsed disclosure, using the shared component.
- **The AI-plays section is enforced, not remembered** — `stage-metadata.test.ts` fails any
  stage whose doc lacks the `### AI in <stage>` heading. Stage 03's doc did not have one.
- **`PATTERNS.md` gained "annotated artifact"** (D-41) — reach for it for config files,
  workflow YAML and migrations, not just schemas.
- **A step name in prose is a citation.** Seven stale ones shipped on this branch, by the
  round ledger's own count, each found by grep and none by a test: `steps.ts` makes a nonexistent id a compile error and can say
  nothing about a name written in a sentence. Grep for step names whenever a step splits.
- **Count the doc, do not trust the brief.** Two ports this round were specified against counts
  that were wrong by the time they were read. Where the count is checkable, check it in a test
  against the doc itself — `evolve.test.ts` and `ai-plays.test.ts` both do.

