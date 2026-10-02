# Development Playbook — Tracker

**Purpose:** the log. What actually shipped, what was decided and why, and what
debt was taken on. Scope and planning live in [task.md](task.md).

**Last updated:** 2026-10-01
**Current phase:** W-3 and W-6 remain open. Thirteen of eighteen stages are
interactive on `develop` (01–07 and 11–16); five remain. Stage 16's port landed
as no-ff merge `3d2c266`. Nineteen of twenty-four reference sheets are drawn
on local `develop`; the Stage 16 companion merged as `a992d74`.
Re-derive every count here rather than quoting it.

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
| 2026-10-02 | W-6.3o (merge) | **The Stage 16 `incident-management` reference companion merged locally into `develop`.** The feature branch was deleted after the approved `--no-ff` merge. | Merge `a992d74` brought `017655a` and records commit `70cecc6` into `develop`. The merged tree matched the reviewed feature tip. Post-merge gate: **1389/1389 across 181 files**, lint, typecheck and format clean. | **Not pushed or deployed.** W-6.4 and the five language sheets remain open. |
| 2026-10-01 | W-6.3o | **`incident-management` is drawn on `feat/incident-management-reference`, tethered to Stage 16.** Four lookup sections cover declaration and severity, mitigation and updates, recovery proof, and follow-up. The Google SRE Incident Response chapter is credited. No plate was selected: the NovelVista candidate contradicts the chapter's communication and recovery order; the other captures have provenance or content gaps. The sheet is generated into `reference/cheatsheets.md`. | Feature commit `017655a`. RED: the new Stage 16 registry test failed with `expected [] to deeply equal ['incident-management']`. GREEN: **1389/1389 across 181 files**, format/lint/typecheck clean, production build prerendered 49 pages, and production browser audit **18/18** including both-theme contrast, responsive widths, touch targets and console. The sandboxed build and audit initially stopped at Google Fonts fetches; both passed with network access. A final diff review found no blocking issue; it was a self-review, without an independent reviewer. | **Not merged, pushed or deployed.** W-6.4 glossary/stack surfacing, five language sheets, image provenance and publication, worked runbook and completed postmortem remain outside this slice. |
| 2026-10-01 | W-3.13 (port) | **Stage 16's interactive port is merged locally into `develop`.** Fourteen direct-link steps turn the repaired chapter into a Nudge decision rehearsal and a live lookup rail. Impact, severity and replay drills lock choices before showing reasons. The connected four-decision rehearsal reveals the next incident event only after a committed choice; after an unsafe choice it names the correction and labels the following update as a model. The nine-check recovery/follow-up list persists locally and has an explicit new-incident reset. All ten doc traps, the unresolved postmortem action A3 and three verified outward references are present. `ready: true` and the two registries landed atomically. | Feature commit `eef16d7` on `feat/stage-16-incident-port`; no-ff merge `3d2c266` into `develop`. RED: the initial 2 render tests failed on `ready: false`/missing registration; the expanded 12 tests failed on missing panels; later tests failed on the absent reset, connected rehearsal and A3, then on the unsafe-choice contradiction. GREEN: **1388/1388 across 181 files**, format/lint/typecheck clean, production audit **18/18** (both-theme contrast, 320–2560px overflow, touch targets, console, hashes, panel height), development-console audit **1/1** with no React warnings. Teeth check: changing the homepage verdict made only its regression test fail, then restoring it passed. One read-only whole-branch reviewer found two Important issues (old checklist state in a new incident; Nudge path not truly sequential), then a third in its re-review (unsafe choice followed by a safe-action update); all were fixed and the reviewer returned **Ready to merge**. The merged tree matched the reviewed tip, and `pnpm test` passed **1388/1388 across 181 files** again. Post-merge records commit `8d815f0`; feature branch deleted. | **Merged locally into `develop` with the user's separate approval; not pushed or deployed.** W-3 is 13/18. The W-6 incident-management reference companion and two minor doc-review follow-ups remain for later. The user chose a lean round without a separate port spec/plan or per-task reviews; the final whole-branch review and all gates remained. |
| 2026-09-15 | W-3.12 (port) | **The stage 15 port is executed, reviewed task-by-task and whole-branch, fixed, and merged to `develop` — W-3 to 12/18, six stages remaining.** Ten steps as planned grew to **sixteen** during verification (see Deferred/D-52 below), all through the one `Drill` component the spec called for: alert triage, log level (a five-option radiogroup), silence, scrubber. Tasks 1–10 ran per the plan — subagent-driven, TDD, a per-task reviewer on every task — and all ten closed clean or clean-after-fix, with the one plan-authored gap worth naming: Task 1's team-notes count regex missed a bold span the doc itself wraps across two source lines (fixed in the test, not the data), and Task 8's Saturation assertion was vacuous on arrival (an inline `<Term>` decoy satisfied `getByRole`), caught by the reviewer's own teeth check and fixed to a row-specific string match. Task 10 (the atomic `stages.ts` + two-registry flip to `ready: true`) got the escalated **Opus** review per `CLAUDE.md`'s tier table, which independently re-ran the full suite and confirmed the diff was genuinely one line plus two pure-addition registries — no repeat of the `AI_SECTION_STAGES` gap CLAUDE.md's own history names. **The final whole-branch review (opus) found two blocking issues** — the persisted 15-item Definition-of-done checklist had no test covering its persistence path, and two step-count references were left stale by the D-52 reshape below — **both fixed** (`3604e59`) **and independently re-verified with a teeth check**. | **18 commits** `d9b4da2..2ea6414` on `feat/stage-15-observability-port`, cut from `develop`, plus the fix commit `3604e59` and the merge commit **`9d834e8`** (`Merge feat/stage-15-observability-port: stage 15 (Observability) interactive port`, `--no-ff`) landing it on `develop`. Per-task reviews: sonnet for Tasks 1–9 and 11's split rounds, opus for Task 10 (touches `stages.ts`/registries, per the measurement rule). Final measured **179 files / 1348 tests**, all green pre-fix; **post-merge gate re-run on `develop` at `9d834e8`: `pnpm test` 179 files/1351 tests all green, `pnpm lint` clean, `pnpm typecheck` clean** (the three-test rise is the checklist-persistence coverage the final review required). Expandable count **379** (122 URLs, 269 unique ids — URLs rose from 116 pre-split as the six new step routes now exist; ids and total unchanged, confirming the split moved content rather than adding or losing interactive elements). `pnpm test:e2e` **18/18** after the fixes below; `pnpm test:dev-console` **1/1, zero React dev-mode warnings**, re-run after the user stopped a competing `next dev`. | **The D-52 split deviated from the plan's own pre-authorized scope, and that deviation is the finding worth keeping** (`docs/learnings/plans-are-unverified-101.md`, one level further in than where it was written): the plan pre-decided a fix for exactly one panel (`#silence`) going over the 4.0-screen budget; Task 11's actual measurement found **four** — `#errors` (4.8), `#logs` (5.7), `#silence` (5.5), `#done` (6.3) — and the implementer correctly stopped rather than improvising a wider fix under a narrower authorization. Brainstormed with the user and executed in two files, two rounds each: `panels-collect.tsx`'s `errors`→`errors`+`scrubbing`(round 1)→further to `scrubbing`+`reach`(round 2), `logs`→`logs`+`fields`(round 1)→further to `logs`+`levels`(round 2); `panels-act.tsx`'s `silence`→`silence`+`jobs`, `done`→`traps`+`done`, with a fix round making `traps` the true final step to match the doc's own section order (Traps is genuinely last) and stage 11's precedent. `STEP_IDS` grew 10→16; every split panel re-measured under budget (errors 0.69, scrubbing 2.34, reach 1.85, logs 2.44, levels 2.59, fields 0.80, silence 3.76, jobs 1.78, done 3.12, traps 3.07). Also found and fixed in the same task: an e2e-suite-wide 60s timeout too tight for an 18th stage in the sweep (raised to 120s, `2bb64e9`, re-verified WCAG AA both themes and the disclosure sweep individually), and two touch-target failures (`#where`'s "Security Audit" link, `#signals`' "baseline" `Term`) from two `Callout` call sites passing raw text instead of `<p>`-wrapped text, missing the audit's inline-exemption — fixed to match every other `Callout` in the file (`7c47d33`). **Carried forward, unchanged:** the baselines/alert-set persisted worksheet, its own bounded round, user's call (2026-09-11); migrating `TriageDrill`/`AuthorizationDrill` onto the shared `Drill` component; the `observability` reference sheet (ten images, still no provenance); the doc's five review minors (a breadcrumb code sample, a `requestContext.run()` sample, deletion how-to, Fly.io absent from the comparison tables, the canary's non-timing-safe comparison); `docs/tracker.md`'s "Next up" section, still stale. **New from this round's reviews, both cosmetic Minor:** `Callout` `eyebrow` text on the split panels wasn't updated to match the new step boundaries, and the panel-file comment numbering scheme is inconsistent across the split. Humanizer pass over `panels-collect.tsx`/`panels-act.tsx`: zero edits needed. **Merged to `develop` as `9d834e8`** (`--no-ff`), 2026-09-16, branch deleted, and `develop` is pushed — `origin/develop` matches at `9d834e8`. `develop` is 116 ahead of `main`, `main` 2 ahead of `develop`; `main` is untouched by this round. |
| 2026-09-11 | W-3.12 (port, planned) | **The stage 15 port is specced and planned, not executed.** Brainstorm on Opus per the session model: classified architectural (every prior port had a spec and plan; a `W-` milestone needs the loop). Ten steps — the largest port since stage 04, which D-52 allows because the count follows the panels. Four guess-then-reveal drills chosen by the user from four offered — alert triage (11 rows, the doc's two lists), log level (6 rows, a five-option radiogroup), silence (6, one control the tracker *does* see), scrubber (6, `beforeSend`'s three surfaces against `addContext`, breadcrumbs and a log line) — all through **one stage-local `Drill` component** generalising stage 06's `TriageDrill`, so four exercises cost one component and one render test. Five annotated artifacts quoted from the doc's fences (`fences()[2,3,6,8,9]`), each held line-for-line with `toBe`. One figure that is not an artifact: restart-vs-routing. Eight glossary terms, four references. S4 (bold lead-ins invisible to a ToC) closes by construction: each becomes a row or Section title. | Spec `f670aab` (`docs/superpowers/specs/2026-09-11-stage-15-interactive-port-design.md`), plan `2071f9f` (`docs/superpowers/plans/2026-09-11-stage-15-interactive-port.md`, 3,924 lines, 12 tasks, full source inline). Plan self-review fixed four things before commit: figure numbers out of reading order, and three drill `why` pins quoting fence comment lines that `flat()` keeps the `//` markers of. **`e4750ad`**, authored by the user between the spec and the plan commits and already on `origin`, holds the plan at its 3,665-line intermediate state under the subject "feat: scaffold data modules and test infrastructure" — no code, only markdown; the subject is wrong about itself, left as is since it is pushed. `develop` at `2071f9f`, 93 ahead of `main`, **1218/1218 across 162 files** unchanged — nothing under `web/src` moved. | **Deferred, recorded in the spec:** the baselines/alert-set persisted worksheet — its own bounded round after the port, the user's call; migrating `TriageDrill`/`AuthorizationDrill` onto `Drill`; the `observability` sheet (ten images, no provenance); the doc's five review minors; the tracker's stale "Next up". **One deviation decided in the plan, not the spec:** artifacts are numbered `Figure`s 1–6 with the grid at 4, per stage 14's precedent and `PATTERNS.md`. **The pre-decided D-52 split** (if `silence` measures over four screens, `jobs` splits out) is written into Task 11 so it is a decision already made. Execution: next session, Sonnet, subagent-driven; Task 10's review escalates to Opus (it touches `stages.ts` and both registries). NOT executed, NOT merged, NOT deployed. |
| 2026-09-11 | W-3.12 (cont. 2) | **Task 15 (the fix wave), the D-48 re-run and the whole-branch review the mid-round merge skipped are all done; the round is closed except for the port.** `docs/15-observability.md` **743 → 853 lines**, section count unchanged (6 `##`, 12 `###`). Task 15 closed all seven fix-queue items (I1–I6, M1) test-first, each pinned in `stage-15-structure.test.ts` before the fix. Two verified against the scratch harness at `/private/tmp/stage15-codex-harness/`, not just asserted: the canary now returns `503`/`{"ok":false}` on an empty result, and the health check's logged error carries `type`/`message`/`stack` instead of `{}`. The D-48 re-run — a fresh cold reader, blind to the fixes, same Loaf scenario and five lookup questions verbatim — confirmed I1–I5 closed with no regressions and surfaced one new gap the fix queue hadn't named: Definition of done required a liveness endpoint but no code example existed for one. Fixed the same way, test-first. The whole-branch review that followed (opus, covering the full round from `fdc4811`) found **two blocking defects the fix wave itself had introduced** — `Sentry.init` shown in a module `@sentry/nextjs` never runs it from, so the scrubber would silently never fire; and the I2 fix logging a database connection string's password to stdout verbatim, in the same doc whose own SECRETS list exists to redact that pattern out of Sentry — plus a vacuous test (asserted `serializers: {` and `stdSerializers.err` without checking the *key*; reverting to the original bug kept the suite green) and one Definition-of-done checkbox with no teaching behind it (withholding a test heartbeat ping). All four fixed and independently re-reviewed (haiku) against the actual diff; seven of the review's minors fixed alongside since they were cheap and clearly correct. | **Three commits** `96ff914`…`b1deecb` on `fix/stage-15-fix-wave`, cut from `develop`. Full round (doc round + fix wave) is 21 commits `a1f0738`…`b1deecb` since `fdc4811`. Gate on the branch: lint 0, typecheck clean, format clean, **1218/1218 across 162 files** (was 1207 at the mid-round merge). Doc's 10 TypeScript fences typecheck clean (`tsc --noEmit` exit 0) and run clean against the runtime harness (exit 0). Teeth checks run and reverted for both the canary fix and the I2 serializer fix — reintroducing either defect fails exactly the test that pins it and nothing else. ~~`fix/stage-15-fix-wave` is 3 ahead of `origin/develop`, 87 ahead of `main`; not merged, not pushed, not deployed.~~ **Merged to `develop` as `7418684` (`--no-ff`) at the user's request, plus a fourth commit `99c8a90` recording Task 16 and a `quality-gates-101.md` addition for the two vacuous-verification lessons above (the untested key pairing, the untested secret-bearing input). Branch deleted. Gate re-run on `develop`: 1218/1218. `develop` and `origin/develop` are level.** | **The port** (W-3.12 proper — W-3 stays 11/18, `ready` stays `false`). **The `observability` reference sheet** — five text sources now registered in `reference/cheatsheet-sources.md` (Task 16, this round), but the ten already-committed images (`450190c`) still lack provenance and stay unregistered until the user supplies authors/URLs. Trimming Traps and deleting Artifacts (rejected under D-95, unchanged). On-call arrangements for exactly two people (a boundary, but the playbook's own target case). The pre-existing glossary orphans Task 12 surfaces in other stages. S4, the bold-lead-in navigability finding — belongs to the port, would be solved twice in markdown. Five minors the review raised and this round didn't take: a breadcrumb code sample, a `requestContext.run()` code sample, deletion how-to (stage 08's job), Fly.io named but absent from the comparison tables (D-94 scoped this round to Vercel/AWS), and the canary's non-timing-safe token comparison. **`docs/tracker.md`'s own "Next up" section is now roughly ten days stale** (still describes an 8/18 W-3 and a stage-04 step-splitting question from before stages 11/13/14/15 shipped) — found while writing this row, not fixed here: refreshing it is a separate pass, not part of this round's scope. |
| 2026-09-10 | W-3.12 (cont.) | **Stage 15's doc round is executed through Task 14 of 16 and merged mid-round.** `docs/15-observability.md` 261 → **743 lines**, 6 `##` and **12 `###`** (was 8): errors, structured logs, where logs go, the four signals, health checks, alerts, uptime from outside, the two sections about silence (*When nothing is reporting*, *Jobs that nobody watches*), dashboards, and `### AI in observability`. Guards first: `stage-15-structure.test.ts` (section order), `term-usage.test.ts`, `terms.test.ts`; `AI_SECTION_STAGES` gains `11-ci-cd` (the guard had been blind to a shipped stage) and `15-observability`. Task 14 re-ran both instruments on the corrected doc: artifacts **5/5** on the same Loaf scenario; lookup **5/5** is a *new baseline, not an improvement* — the original five questions were never retained, and the re-run record now carries them so the next one can measure. The re-run also produced **six blocking findings** (I1–I6) plus M1, two reproduced by a runtime harness rather than inferred: the canary returns `200` on an empty result, and Pino serialises the promised exception reason to `{}`. Both were introduced by this round. | 25 commits `a2d3552`…`906cb32` (rewritten, see the row below), merged `fcd46f1` into `develop` at the user's direction. Gate on `develop` after both merges: lint 0, typecheck clean, format clean, **1207/1207 across 162 files**. | **Deferred, and this is not a closing ceremony (D-48):** Task 15, the fix wave for I1–I6 and M1 — queued in the findings file under *Task 15 fix queue*; Task 16's records, done here in its place. **No whole-branch review ran** before the merge; the branch merged mid-round so the records could catch up, and the review is owed before the fix wave closes the round. The port; the `observability` sheet; registering the ten gathered images (tracked since `450190c`, no provenance recorded). |
| 2026-09-10 | TD-46 · D-97 | **The résumé and the cover letter were committed, and the unpushed history was rewritten to take them back out.** `c4f2a68 fix: stage 15 doc` (2026-09-08, `git add -A` by the shape of it) added the ten stage-15 images, a root `AGENTS.md`, three test files — and `reference/angelito_paa_software_developer.pdf` and `reference/cover-letter-ai-fullstack.md`. KICKOFF had warned against exactly this the day before; TD-44 had named the hazard. Found by the records pass grepping `git ls-files reference`. Nothing had reached `origin`. | `git filter-branch --index-filter` over `origin/develop..develop` (30 commits, two merges, shape preserved): `develop` `8e94b1f` → `bf0070e`, `c4f2a68` → `450190c`. `git diff --stat backup/pre-filter-2026-09-10 develop` is exactly the two deletions; `git merge-base --is-ancestor c4f2a68 develop` is false. Files copied to `~/personal/parked-from-playbook/` first. `.gitignore` now carries `reference/*.pdf`, `reference/cover-letter*`, `*resume*`, `*cv*`. | **Deferred:** the old objects still exist locally under `refs/original/refs/heads/develop` and the tag `backup/pre-filter-2026-09-10` — delete both and `git gc --prune=now` once the rewritten `develop` is pushed and trusted; until then **never `git push --tags` or `--mirror`**. A pre-commit guard (TD-46) rather than an ignore pattern, since the pattern only covers the names it anticipates. |
| 2026-09-10 | Context budget | **The tracker got an archive, and no session reads either file whole.** Triggered by the Max → Pro downgrade and `docs/audits/2026-09-10-context-usage-audit.md`, which measured the tracker at ~104k tokens with KICKOFF telling every new session to read it. 34 closed debt headings (33 entries; TD-25 carries its struck original) and 23 Completed rows dated before 2026-08-01 moved verbatim to `docs/tracker-archive.md`: 415,081 → 303,135 bytes live, 110,136 archived, **0 lines lost** (line-multiset diff against `HEAD`). `web/src/lib/tracker-ledger.test.ts` (2 tests, `unit`) asserts every TD/D id appears exactly once across the two files and that the archive holds only closed debt. RED for the right reason (ENOENT on the archive); GREEN after the split; teeth check: a planted open TD-9 in the archive failed both tests and only those. The test found one bug in itself on the way — the `(original entry)` lookahead let `TD-25` backtrack to `TD-2`, fixed with `\b`. KICKOFF's read list now says grep, not read, for both tracker files and names the one `task.md` section a round needs. | D-96; commit on `docs/2026-09-10-context-audit` | **Deferred:** a later cut line (2026-08-15 would move 11 more rows, ~7k tokens); archiving old Process observations; touching `task.md`'s content; any change to the Decisions ledger, which stays whole by design. |
| 2026-09-08 | W-3.12 | **Stage 15's doc round is specified, not executed.** Two cold readers ran per D-54, each allowed to read only `docs/15-observability.md`, one building the stage's artifacts for a deliberately foreign scenario and one scoring consultability from headings alone. They returned **six contradictions**, **four things the stage requires in `## Artifacts` or `## Definition of done` and never teaches**, **nine it never mentions**, and **2/5 on symptom-shaped lookup**. The reference implementation sent customer email to Sentry while the DoD forbade personal data — found independently by both readers. `beforeSend` was bolded, required twice and never shown; `logger` appeared once with no import in the stage's best teaching device. Nothing in the stage detected a scheduled job that never ran, and "nothing is reporting and something is still wrong" had no answer anywhere — while the material sat on the page twice, in a deliberately swallowed `catch` and a business failure that throws nothing. **Three findings were rejected or downgraded on checking**, which is the half worth keeping: the missing-triage finding is stage 16's job and it has the sections for it; the Sentry scope-leak claim is held pending a check against the installed SDK rather than written up as fact; and the cost complaint fails because 01, 03, 06, 09 and 13 all discuss cost, so it is in voice | **Four commits** `a2d3552`…`6c5f816` on `fix/stage-15-doc-round`, cut from `develop` at `fdc4811`. Findings recorded in `docs/superpowers/specs/2026-09-08-stage-15-cold-reader-findings.md` (273 lines) with the Loaf scenario verbatim, because the re-run has to reuse it. Plan in `docs/superpowers/plans/2026-09-08-stage-15-doc-round.md` — **18 tasks, 2447 lines**. Two claims in `KICKOFF.md` were checked and are wrong: the doc has **8** `###` subsections, not 9, and `stage-metadata.test.ts` does **not** gate on `ready` — `AI_SECTION_STAGES` is an explicit list, deliberately, so the slug is added at the start of a round. Reading it also found `11-ci-cd` missing from that list although stage 11 shipped an AI section on 2026-09-07, so the guard has been blind to a shipped stage; Task 1 closes it. **No gate was run and none was due — `docs/15-observability.md` is byte-identical to its state at `fdc4811`** | **Nothing is executed.** The plan is written to be run from its task slices in a new session. **Deferred:** the interactive port (W-3 is not advanced, `ready` stays `false`); the `observability` reference sheet, though five sources are now gathered and logged; trimming `## Traps` and deleting `## Artifacts`, both rejected under **D-95**; on-call arrangements for exactly two people, a boundary the playbook's own target case makes worth revisiting; the pre-existing glossary orphans Task 12 will surface in other stages; and the bold-lead-in navigability finding, which belongs to the port. ~~NOT merged, NOT pushed, NOT deployed~~ — merged `fcd46f1` and pushed 2026-09-10, mid-round; see the W-3.12 (cont.) row |
| 2026-09-08 | TD-44 | **The contradiction about whether gathered originals are committed is closed in favour of what the repo already did.** `reference/cheatsheet-sources.md` and `docs/task.md`'s W-6.2 both said originals stay untracked and gitignored; 65 files under `reference/` are tracked and `.gitignore` never mentioned them. Both paragraphs now describe tracking, and carry the reasoning that was missing the first time | **The rule's own justification was measured and does not hold.** "The originals run 1–4MB each and git keeps every version forever" is true in general and empty for these: a gathered capture is written once and never edited, and every image under `reference/` has exactly one commit touching it. Ignoring them now also reclaims nothing — ~18MB is already in history and `.git` measures 64MB before and after, so only a history rewrite over commits already pushed to `origin/develop` would recover it. Against that, an untracked original makes the ledger name files that exist only on the gatherer's disk. Docs-only change; no code, no gate movement | **The decision creates a hazard, recorded beside it rather than left implicit**: a committed `reference/` means anything parked there is one `git add -A` from a public repo. Three unrelated files were sitting in the directory during this round — a résumé PDF, a cover letter, and one ungathered capture — and **none was committed**. The Filing section now says not to park unrelated files there. **Deferred:** the ungathered `system-design-tradeoffs.jpeg` is not claimed by any sheet, so it stays untracked until a round wants it. **Merged to `develop` as `8d6bd39`, `--no-ff`, 2026-09-08**, branch deleted. Docs only, no code touched: gate re-run on the merged result for lint 0, typecheck 0, 1161/160; `test:e2e` deliberately not re-run, since nothing the app renders changed and `reference/cheatsheets.md` (the one generated file with a snapshot test) was not edited. **Merged without a whole-branch review, on the user's call**, the fifth this session |

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
| **D-97** | **Unpushed history may be rewritten to remove personal data, and that is not an exception to "never rebase".** The no-rebase rule protects merge shape and the record of what shipped as one unit; it was never a rule about publishing a résumé. The line is `origin`: anything a remote has seen is history, anything it has not is a draft | `c4f2a68` carried two personal files into 30 unpushed commits. Removing them from the tree alone (`git rm --cached`) leaves the blobs retrievable from history the moment `develop` is pushed. The rewrite was done with `filter-branch --index-filter`, which keeps every merge and every message, so the shape the rule protects is intact | A backup tag is taken before any rewrite and deleted after the push is verified. The rewrite is recorded in the tracker with the before and after SHAs. `.gitignore` guards the file kinds; TD-46 asks for a guard that does not depend on guessing the name |
| **D-96** | **The tracker is two files, and neither is read whole.** `docs/tracker.md` keeps decisions (all of them, superseded included), open debt, Completed rows from the current round, bugs, process observations and next-up. `docs/tracker-archive.md` takes closed debt and older Completed rows, verbatim, at each KICKOFF refresh. IDs never renumber | On Pro, a 104k-token file that the kickoff paste told every session to read was the single largest avoidable read in the project. Splitting by section was rejected: 45 specs and plans cite `docs/tracker.md` by path, and a ledger's value is being one grep away. Archiving decisions was rejected: they are the "did I already decide this" lookup and superseded entries are the record. Numbered D-96, not D-94, because D-94 and D-95 exist on `fix/stage-15-doc-round` and had not merged when this was written | `tracker-ledger.test.ts` fails on an id in both files or neither, and on an open TD in the archive. The archive rule lives in CLAUDE.md → *Recording work*. KICKOFF's read list says grep, and names the one `task.md` section a round needs |
| **D-95** | **A template section that is weak in one stage doc is a playbook-wide question, and is not answered inside a stage round** | Stage 15's cold readers recommended trimming `## Traps`, where 9 of 10 entries duplicate the body, and deleting `## Artifacts` as a restatement of `## The work`. Both observations are correct. Both sections are the house template across all eighteen stage docs, so acting on either in one document would have made that document inconsistent with seventeen others | Rejected in the plan, with the reasoning recorded beside the finding rather than the finding dropped. The Traps complaint had a real core — it was the *only* home for "No baseline", the answer to a lookup question — and that is fixed by teaching baselines in the body instead, which is a content fix rather than a structural one. If either section should go, it is a decision about the playbook and belongs here as its own number, not in a stage round's diff |
| **D-94** | **Stage 15 is platform-aware, Vercel and AWS, continuing what 13 and 14 started** | Stage 15's doc was written around one hosting account, and the cold reader's sharpest structural finding was the shape of the damage: latency and traffic were given a product name, saturation was given a category, **and only the category survived contact with a different stack**. Stage 13 is already platform-aware and stage 14 already uses CloudWatch, so leaving 15 Vercel-only would have made it the outlier in the pipeline it closes. User decision, 2026-09-08 | Every mechanism the round adds states the general category first and names the tool on each platform second — the signal-to-source mapping becomes a table with a "where it comes from" column, and the AWS column is filled in from checked documentation rather than memory, the same rule `web/AGENTS.md` applies to Next.js. The transfer test is now the doc's own: a reader on neither platform should still know what to look for |
| **D-93** | **A data-module test asserting only against the source doc, never an app export, is vacuous by construction and gets fixed the same way regardless of which module it is** | A context-starved coverage walk (Task 14, stage 06) found three tests — `triage.test.ts`, `layers.test.ts`, `ai-plays.test.ts` — comparing `docs/06-testing.md`'s own text to itself and never touching `OPTIONS`/`CHANGES`/`LAYERS`/`AI_LIMIT`. Two were named for content the same walk found missing from the app, so each had been green for a reason unrelated to what it claimed to guard — never red for the reason it existed, the exact failure this stage's own `AI in testing` section teaches against, shipped inside it | All three tests now pin an app-export literal alongside the doc-derived one, teeth-checked by mutating the export directly rather than the doc. A new `Testing.test.tsx` closes the sub-case no data-module test could reach at all: `DISTRIBUTION` and `RESTRAINT_ROWS` are hand-authored inside `Testing.tsx`, not in a module, so nothing rendered them against the page before this — it now asserts each of six restored findings against `#panel-<id>` textContent. Going forward: a doc-source constant proves the doc reads as expected and says nothing about whether the app reads from it, so any module holding doc-anchored data needs a second assertion, against the app, before it counts as covered |
| **D-92** | **A panel over the 4.0 ceiling gets split along the doc's own section boundaries, not compressed further** | Stage 06's `done` panel measured **4.69** once `<References>` was wired in — Task 13's own required scope, not padding. The overage traced to the plan itself: three of the doc's closing sections (Artifacts, Definition of done, Scaling to a team) had been compressed into one panel before any content existed to measure the compression against. Folding `TestingChecklist`/`AIPlays`/`TRAPS` behind more disclosure would have hidden the cause rather than fixed it, and a `PANEL_EXCEPTIONS` entry was ruled out by this round's own constraint | Eight panels, not seven. `done` keeps the checklist and the AI plays; a new `traps` panel closes last with the eight trap callouts plus `<References>` — matching the doc's own order (Artifacts → Definition of done → Scaling to a team → Traps) and `PATTERNS.md`'s convention of ending a stage on a `Callout kind="trap"` set, so this reads as a better structure than the plan's, not merely a lighter one. Fully reversible: one extra panel and a `steps.test.ts` literal changed, with the uniqueness and unit/integration/e2e adjacency tests kept byte-identical. Panel weight after: `done` 2.51, `traps` 2.41, both well under the ceiling. Eight panels is unremarkable in this repo — stage 03 has 22, stage 04 has 15, stage 05 has 13 |
| **D-91** | **Cheatsheet code examples are highlighted at generate time, not import time or render time** | The first attempt called Shiki via a top-level `await` inside `solid-principles.ts`/`clean-code.ts` themselves. `pnpm test` and `next build` both resolved it fine — both use module loaders that handle top-level await transparently. `pnpm test:e2e` did not: Playwright's own test transform failed outright on `e2e/audit-pages.ts`'s import of the registry, with `SyntaxError: Unexpected identifier`, which is a parse failure, not a runtime one — the tool cannot even load the file. Two gates staying green while a third breaks on the same import is the exact shape TD-12's audit-pages derivation exists to prevent for *pages*; this is the same failure one level down, in data a page is built from | `generate-highlighted.ts` walks the registry, calls Shiki once per unique example `code`, and `renderHighlighted()` writes `highlighted.generated.ts` — a plain `Record<string, string>` keyed by the code string, committed and checked by a snapshot test (`generate-highlighted.test.ts`, `pnpm gen:highlighted`), the identical arrangement `render.ts`/`cheatsheets.md` and `terms.ts`/`glossary.md` already use. `solid-principles.ts` and `clean-code.ts` do a synchronous object lookup; nothing in the data modules is async, and nothing in the render path is either — `Row.example.html` is now populated the same way whether or not Shiki is even installed. A code string not yet in the generated table renders as plain text (the field stays optional) rather than throwing, so a forgotten `pnpm gen:highlighted` degrades gracefully instead of breaking the build. **A second instance of the same generated-file-vs-tooling class turned up one commit later**: `.prettierignore` exempts `*.md` because Prettier reformatting `glossary.md`/`cheatsheets.md` would fight their generators, but `highlighted.generated.ts` is real TypeScript, so nothing exempted it — the pre-commit hook's own `format` step reformatted the committed file (quote style, mainly), and the next `pnpm test` failed the sync check against content the generator itself never produces. `.prettierignore` now names this file explicitly, next to the `.md` rule it extends the same reasoning to |
| **D-90** | **SOLID and Clean Code are design principles, not coding standards — split into their own sheets under a new group** | Both were first drafted as sections of `coding-standards`, following D-89's plan. Writing them made the mis-fit obvious: `coding-standards`'s other content (code smells) is about noticing a symptom in code already in front of you, while SOLID and Clean Code are things you carry into how you write anything — closer in kind to `design-patterns` (concrete solutions) than to a local style guide. A third bucket, not a forced choice between the two existing ones | New `CheatsheetGroup`, `'Design Principles'` — the rail's existing group→sheets nesting gives it a real "category with items under it" shape for free, no new UI. `solid-principles` and `clean-code` are new sheets, each carrying its own `source`; `coding-standards` is left with one section (code smells) and room to grow (naming conventions, code review checklist, refactoring techniques — all still unclaimed). **Supersedes D-89's premise**, not its reasoning: D-89's "one plate, prose-credit the rest" rule was written for `coding-standards` carrying three sources at once, and that sheet no longer does — each split-out sheet now has exactly one source of its own, so the question D-89 answered does not currently arise anywhere. The rule stays recorded for the next sheet that does draw on more than one graphic |
| ~~**D-89**~~ | ~~A sheet built from more than one gathered graphic displays one plate and credits the rest in prose~~ | `coding-standards` drew on three distinct, independently attributed graphics (SOLID, code smells, clean code) at the time this was written. Pluralising `Cheatsheet.source` to an array would have touched the type, `render.ts`, `Cheatsheet.tsx`, and nine existing tests in `Cheatsheet.test.tsx` for a need only one sheet had | **Superseded by D-90** within the same round: SOLID and Clean Code moved to their own sheets, so `coding-standards` no longer carries three sources and this decision's premise no longer holds for any registered sheet. The reasoning is kept, not deleted — a future sheet drawing on more than one graphic still has this precedent to reach for, or to revisit deliberately |
| **D-88** | **W-6 resumes on a per-stage cadence, by explicit user override, not by the pause condition being satisfied** | The 2026-08-14 pause reasoned that content work competes with `W-3`, and that reasoning has not changed — stage 06 still has not been chosen. What changed is the user's own call: after each `W-3` stage ships, check for related reference material and run a bounded W-6 round before choosing the next stage, rather than treating W-6 as fully blocked until some future resume condition. This round followed stage 05 | `docs/task.md`'s W-6 section is rewritten to state the cadence explicitly rather than a pause with an expired condition, so a future session reads intent rather than staleness. Nine sheets tethered to or sitting under stages 03–05 are now drawn (D-90 added a fifth group along the way); nothing tethered to an unbuilt stage (`containers` → 11) was gathered this round on that same "finished or ongoing stage" logic |
| **D-87** | **A dev-mode warning names a symptom; it does not name a defect until the mechanism is read out of the framework's own source** | TD-43 was recorded as a missing key and hunted as one across eighteen probes, and there was no missing key. React validates keys in two places — `validateChildKeys` at element creation and `warnOnInvalidKey` at reconciliation — and they unwrap lazy nodes to different depths, one level against all of them. A server component's children cross the RSC boundary as lazy chunks, and the last one flushed arrives wrapped twice, so it is never stamped exempt and is then reported as an unkeyed list child. Reading those two functions took minutes; bisecting the app for the array they were complaining about could not have worked at any length, because the array does not exist | The panel wraps the streamed node in a keyed fragment, `<Fragment key="content">{step.content}</Fragment>`, matching `RevealList`'s existing precedent — a bare `<>{step.content}</>` closed the same warning but was replaced on review, since a key settles it without depending on the exemption surviving the RSC boundary. Before bisecting an app for a framework warning, read the code that emits it — `node_modules` is checked out and greppable. `web/AGENTS.md` already applies that rule to Next's bundled docs; this extends it to React's compiled source and to warnings, which is a widening of the precedent rather than an instance of it. The generalisation: **an unexplained discriminator is a sign the model is wrong, not a finding to record**. TD-43's own entry flagged its two irreconcilable results honestly and still filed them as characterisation; both were true observations with the wrong cause attached |
| **D-86** | **A pinned known failure must assert that it still fires** | TD-35's spec found a real pre-existing bug (TD-43) on its first honest run. Shipping the command red would make it a command nobody runs; shipping it with a silent allowlist would make it the thing this round exists to delete. The pin therefore carries `expect(known.length).toBeGreaterThan(0)`, so fixing TD-43 turns the test red telling you to remove the entry | An exception that cannot outlive the bug it covers. The failure message names the debt and says to delete the entry. Teeth-checked by pointing the pin at a clean URL, which trips the retire assertion, and by planting a second missing key, which surfaced three pages the pin does not cover **✓ retired 2026-08-24**: TD-43 was fixed, the retire assertion fired, and the `KNOWN` entry was deleted. The decision worked exactly as specified — removing the pin is what produced the failing test the fix was written against. |
| **D-85** | **A debt's recorded diagnosis is evidence, not a finding — re-run it before porting it into a deliverable** | TD-32 recorded that "Turbopack does not re-evaluate `env.ts` when `.env.local` changes", and flagged its own exposure: "observed there and not re-run for this entry". Running it disproved the mechanism. Turbopack re-evaluates in place, in the same process, with one `Ready in` for the session; the first request after the save is answered by the evaluation already in memory and returns 200, and every request after it returns 500. Deterministic over four trials on Next 16.2.10 and again on 16.3.1 | §5 teaches the measured mechanism, and a test pins it — §5 must say the module *is* re-evaluated, because the simpler wrong mechanism is the one the tracker carried and the one a future editor tightening the paragraph would reach for. Extends **D-50** from executable content to recorded diagnoses |
| **D-84** | **`pnpm test:dev-console` stays outside `pnpm test:e2e` and outside CI** | React's development validation exists only against `next dev`, and the audit deliberately runs a production build because the dev overlay pollutes the console. Putting a dev server in the merge gate costs a second build per run and brings that noise into the thing that blocks merges. The cost of leaving it out is honest and stated: it depends on someone remembering | Its own config on port 3101, `reuseExistingServer: false`, `grepInvert: /@smoke\|@dev/` on the main config so `test:e2e` cannot collect it. Documented in `CLAUDE.md` as a stage-round step, the standing `pnpm test:prod` already has. 42s over 76 URLs, which is cheap enough that the remembering is the only real cost |
| **D-83** | **TD-27 closes with a freshness assertion rather than `reuseExistingServer: false`, and it scans app source only** | The flag would force a rebuild per run and still miss the case that matters: a `pnpm start` left running by hand from an older build. The assertion catches both — identity (the served page carries `.next/BUILD_ID`) and freshness (that build is newer than every source file). `e2e/` and `playwright.config.ts` were in the scanned roots until the check fired on an edit to `audit.spec.ts`, which is a false positive: a spec runs from source and needs no rebuild | Roots are `src`, `public`, `next.config.ts`, `postcss.config.mjs`, `tsconfig.json`, `package.json`. `.next` is excluded because it *is* the build, and including it would compare the build against itself and pass every time. Under CI the flag is already false, so this always passes there — which makes CI the place it is least useful and most likely to be mistaken for coverage, and why both halves were teeth-checked locally against genuinely stale servers |
| **D-82** | **TD-26's guard is a property, not the pinned count its own entry specified** | The entry asks to "assert the sweep opens a known count of expandables on a known page". `e2e/count-expandables.mjs`, written *after* that entry, records the count at 108 on 2026-08-03 and 140 on 2026-08-13 with no defect in between, and says in its header that the number is not a constant to assert against. A pinned count stales the way a step name in prose stales, and it stales silently | The guard is: every disclosure inside `[role=tabpanel]` was observed open in at least one state, on every audited page. It cannot stale as content grows. It is paired with a **floor** on how much the sweep observed, because the gap check alone is vacuous under exactly the failure it exists to catch — nulling the selector empties the candidate set, so nothing is missing and the test passes having observed nothing. A floor rather than a count, far enough below the measured figure never to stale upward |
| **D-81** | **D-80 is superseded and its premise was false: `blurb` and `timing` are purpose-built UI strings that diverge from the doc by design, which D-36 settled in 2027-07 and this round rediscovered without checking** | D-80 claimed no stage's app carries its doc's front-matter blockquote. Three do, verbatim — `01`, `02` and `03`'s `blurb` **is** the doc's `>` line character for character. The claim came from checking stage 04, which paraphrases, and generalising one silence into a rule; the same failure D-73 records against this project's previous round, reproduced by the round that recorded it. **D-36 had already decided this question on the same evidence**: closing TD-2, it found the blurb to be "two purpose-built strings (doc subtitle vs UI tooltip) that diverge for 15/18 by design", chose a title-only sync test, and rejected doc-header generation. Fifteen of eighteen is the exact figure this round measured before proposing to reverse it. `stage-metadata.test.ts` carries the reasoning in a comment directly above the code that would have been changed. So the coverage walk's N9 is **not a defect**: it names two sentences the app does not carry, and under D-36 that is the convention working rather than failing — `blurb` was never meant to carry the whole blockquote, any more than `cadence` is meant to carry `timing` | D-36 stands unchanged. No code change; `blurb` and `timing` stay editorial. `stage-metadata.test.ts`'s comment now cites **D-36** by number, which is what would have stopped this: the reasoning was written down and the decision it came from was not, so a reader could mistake a decision for an unexamined habit. N9 is struck from `docs/stage-05-status.md`'s not-ported list as not-a-defect rather than deferred |
| **D-80** | ~~No stage's app carries its doc's front-matter blockquote; whether that should change is a cross-stage question, not a stage-05 defect.~~ **Superseded by D-81** — kept for the record of what was believed. Three stages carry it verbatim, and **D-36 had already decided the question** | The stage 05 coverage walk's tenth finding (N9) was that `docs/05-development.md`'s opening framing — "small improvements here compound harder than anywhere else in the playbook," "this is where most of your hours go" — appears nowhere in `stages.ts` or any panel. Before fixing it, the controller checked stage 04's app against its own doc blockquote: not carried there either. Fixing stage 05 alone would have made it the inconsistent stage rather than the corrected one, on a question — should a stage's opening framing render somewhere in its app — that has an answer for all eighteen stages or none | N9 stays open, in `docs/stage-05-status.md`'s "Not ported" list rather than folded into the round's fix wave. A future round deciding this either adds the convention everywhere at once or explicitly declines it; no stage gets it piecemeal |
| **D-79** | **D-52's panel-weight cap applies to a panel holding two judgments, not to one judgment repeated across a scored set** | Stage 05's `drill` panel measured 3.82 against the round's 3.2 aspiration, and a reviewer was asked to push back on whether that was acceptable rather than have the controller wave it through on its own reasoning. It did, with the sharper argument: D-52's text caps a panel asking the reader to hold two judgments at once, and `drill` is one judgment (safe or unsafe) applied six times inside a single scored set — the shape D-52's own rewrite exists to permit. `drill` remains under the enforced 4.0 ceiling with room, needs no `PANEL_EXCEPTIONS` entry, and roughly half its height traces to one snippet that grew on instruction to fix a scoring defect (D-77) | A scored-exercise panel that repeats one judgment across several rows is measured against 4.0, not 3.2. `PANEL_EXCEPTIONS` stays reserved for panels that clear neither number, which `drill` does |
| **D-78** | **A checklist item that links to another stage carries a `stage` slug field, rendered as a real `<Link>`, and a test derived from the doc's own link markup holds the field present exactly when the doc box carried a link** | `loop.ts` already had this shape (`LoopStage.stage`); `checklist.ts`'s `DoneItem` did not, so four of stage 05's eleven Definition-of-done boxes — the ones the doc links to another stage — would have rendered as a dead bare number ("(06)") or forced `DevChecklist` to regex-scrape a slug back out of prose. Caught because Tasks 6 and 7 were batched into one review: the inconsistency between two modules of the same shape is exactly what a per-task review of either alone would have missed. The first guard written was conditional (`if (d.stage)`) and could catch a typo'd slug but not a removed one; closed in a second round by reusing the file's own link-detecting regex to assert `stage` is defined if and only if the doc box matched, in both directions | Every future stage's `checklist.ts` (or equivalent) follows this shape by default: a `stage?: string` field beside any label whose doc source links elsewhere, with a bidirectional test tying its presence to the doc's own markup rather than to a hardcoded id list |
| **D-77** | **When a drill's code and the question being asked are the same object, a wrong verdict is fixed by changing the code, not by softening the prompt** | A reviewer found `button-caller`'s verdict said "the snippet itself is fine" while scoring `safe: false` — a reader who correctly read the code as safe was marked wrong. Reframing all six drill prompts to "is this enough to ship?" was rejected: it would have softened the four snippets that are plainly about the code into something vaguer, for one snippet's sake. Instead the code changed — `button-caller`'s action grew the authorization check it was missing, behind an inline comment rationalising why it was skipped, so the snippet shown is genuinely unsafe and the binary the reader is scored against stays honest | The authorization drill's answer key is the source of truth for what "safe" means; a scoring complaint against a snippet is resolved in `snippets.ts`, not in the surrounding prompt copy |
| **D-76** | **Every authored prose string in a stage's data modules is guarded against markdown link syntax, since `InlineCode` deliberately never renders it** | `artifacts.ts:24` shipped `[03](03-architecture.md)` inside a note — lifted faithfully from the plan's own worked example — and rendered as literal brackets, because `InlineCode`'s docblock states plainly that links pass through as written. A reviewer found it after the fact; the fix that mattered was not the one typo but a guard against the whole class, since four more authored-data tasks were still to come against a doc dense with `[NN](NN-name.md)` links an implementer lifting prose would naturally carry across. `prose.test.ts` walks every sibling data module in a stage folder generically (`node:fs` plus per-file dynamic import, not `import.meta.glob`, which broke typecheck here) and exempts only `text`/`code` fields, which are lifted verbatim and must stay byte-identical to the doc | A stage's authored prose (notes, verdicts, summaries — not lifted code) cannot silently ship markdown link syntax again; the guard was verified empirically against a throwaway module before being trusted, and covers every data module a stage adds after it, not only the ones open when it was written |
| **D-75** | **A shared component's test that renders another stage's data lives beside that data, not beside the component it exercises** | `AnnotatedArtifact.test.tsx` moved to `src/components/` along with the component in the first pass of stage 05's port, then moved back to `src/features/setup/` on review: the test renders `ARTIFACTS.lefthook`, stage 04's data, and pins a blank line in `lefthook.yml`, so its home is with the data it tests. The rejected alternative — a bridge module re-exporting stage 04's data from `src/components/` — was worse than the cross-feature import it was meant to avoid: it made the shared component's own folder depend on one stage's feature folder, inverting the layering the extraction existed to establish. A synthetic fixture was also rejected: it would have lost the guarantee (**D-66**) that the test pins content copied from the doc, not a stand-in for it | `src/components/AnnotatedArtifact.tsx` has no test living beside it — a reader finds its coverage one folder away, in the stage whose data exercises it — which is the accepted cost of not inverting the dependency |
| **D-74** | **The stage 05 doc round is merged to `develop` before the port starts, deliberately, so the port works from a corrected document rather than porting twice** | This project already paid the double-port cost once. `docs/task.md`'s **W-3.1b** section records it directly: that round was "originally scoped to run *before* the port, on the reasoning that amending the doc again would mean porting twice," and the reasoning held — the premise under it did not, because `W-3.2` was already substantially built in a parallel session by the time W-3.1b was scoped, so the port was the thing already in flight and W-3.1b's new content needed a second pass into the app afterwards. Stage 05 has no port in flight: `05-development` is still `ready: false` and absent from `STAGE_CONTENT`, so merging the doc round now, before W-3.5b starts, is the same reasoning applied while its premise still holds rather than after it has already failed | `fix/stage-05-doc-corrections` merged to `develop` as `9ef3763`, `--no-ff`, before any port work began. The next round (W-3.5b) builds the three-file trace against `docs/05-development.md` as it stands on `develop`, once, rather than against the feature branch followed by a second pass once the doc round lands |
| **D-73** | **A directed fix is checked against the source the same way an agent's claim is — a controller's own correction is not exempt** | The whole-branch review's I1 traced back to Task 6's fix, which itself corrected an earlier false claim (`reset` "will not compile"). The replacement — `reset` arrives `undefined` — was also false, and it was written by the controller, reasoning from one document's silence (`10-error-handling.md` never mentions `reset`) generalised to the whole framework, on a branch whose own Global Constraints require framework claims to be checked against `web/node_modules/next/dist/docs/`. No compiler pass could have caught it: the block declares its own prop types, so nothing validates them against the runtime. A per-task review reads the diff it was handed; it does not re-derive the fact behind a claim that already reads as a correction | Verification-before-completion applies to a controller's own directed edit, not only to what an implementer or a subagent produces. A claim that replaces a wrong claim is not evidence of being right — it has to clear the same bar the wrong one failed: checked against the shipped docs or the installed runtime, not inferred from an adjacent one |
| **D-72** | **`getInvoice` keeps two shapes across documents, declared rather than harmonised** | `docs/05-development.md` defines `getInvoice(id, ownerId)`, taking the owner as a parameter; `docs/08-security-audit.md` defines `getInvoice(invoiceId)`, deriving the owner internally via `requireUser()` and folding it into the same `where`. Both are correct instances of the same rule — authorize the query, not the result — differing only in whether the caller or the callee holds the session. A stage 05 branch has no business rewriting stage 08's document, and 05's shape is the one this stage's own examples and `docs/06-testing.md`'s tests need to agree with | `docs/06-testing.md`'s two `getInvoice` readbacks now pass the owner id, matching 05's signature. `docs/08-security-audit.md` is left exactly as it stood; the divergence is recorded here as a known cross-document fact rather than silently harmonised, so a reader moving between the two stages meets the same name with two signatures, both safe, and the difference does not read as an oversight |
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

### TD-46 — `reference/` is a committed directory that personal files keep landing in · **High**

`reference/` holds gathered source images (tracked since TD-44 settled it) and is also
where the user parks whatever is on the desk — a résumé PDF and a cover letter sat there
untracked for weeks. On 2026-09-08 a `fix: stage 15 doc` commit added the directory
wholesale and both went in. KICKOFF had said "stage the résumé and the cover letter
nowhere" the day before. A warning in a document is not a guard; it was read and the
commit happened anyway, because `git add -A` does not read documents.

**Where it lives:** `.gitignore` now ignores `reference/*.pdf`, `reference/cover-letter*`,
`reference/*resume*`, `reference/*cv*`. That covers the names this incident had and no
others.

**What closes it:** a `lefthook` pre-commit check that refuses any staged path under
`reference/` that is not registered in `reference/cheatsheet-sources.md` — the registry
already exists and provenance is already required at capture time, so "unregistered file
in reference/" is precisely the condition that should block. The history rewrite that
undid this instance is D-97.

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

### A branch merged mid-round so the records could catch up, and the records found a leak

Stage 15's branch had 25 commits and a stale tracker row saying "specified, not
executed". The user asked for it merged so the records could be brought current, which
inverts the usual order (records land, then the merge). Two things followed. The merge
went in without the whole-branch review the standard calls for — the fourth-to-eighth
unreviewed merges in the log now, counting 2026-09-07's four. And the records pass, doing
the mechanical thing of listing what the branch had added, found two personal files in it
that no review would have been looking for either. The lesson is not "review harder"; it
is that `git ls-files reference/` is a one-line check that belongs in the KICKOFF refresh
next to the stale-merge grep, and it is there now.

### The debt round shipped with no reviewer at any tier, and it is the first one to do so

Every stage round so far ran per-task reviews and a whole-branch review, and every one of
them found something a green gate did not: fourteen blocking defects on stage 03's port,
seven more from its whole-branch pass, four on stage 05's including a false claim a
per-task review's own fix had introduced. **This round ran neither.** Implementation was
inline in one session, and the merge was taken without a final pass.

What stood in for it, and it is not equivalent: every assertion was teeth-checked, and the
teeth checks caught three defects in this round's own work. That is a real substitute for
"does this code do what it says" and no substitute at all for "does this task undermine
another one", which is the altitude a reviewer occupies and a teeth check cannot reach.

**Read anything this round shipped as less checked than the surrounding history.** The
tracker rows and `KICKOFF.md` both say so at the point where the evidence is quoted, which
is the only place a later reader will look.

### Three defects in the round's own work, and two of them were authored before any code

Consistent with what stage 03 found: the plan is wrong about the shape of the work more
often than the implementation is.

| Defect | Where it came from |
|---|---|
| The teeth check for TD-26's new guard could not fail — nulling the sweep's selector empties the candidate set, so the gap check passes having observed nothing | **Plan-authored.** Written into the plan as the proof that the guard had teeth |
| TD-27's freshness scan included `e2e/` and `playwright.config.ts`, so editing a spec tripped it — a false positive, since a spec runs from source and needs no rebuild | **Plan-authored.** In the spec's Architecture section and copied into the plan |
| The dev-console spec's path attribution raced: one listener writing against a mutable "current path" reported a warning against the page *after* the one that emitted it | **Implementation.** Mine, in Task 7 |

The count is now past ten for this project's "a check that could not fail" family, and the
proportion authored by the controller rather than by implementers has not moved. **They are
written into briefs and plans more often than into code**, and the plan for a round whose
entire subject was vacuous checks contained one.

### A wrong attribution is worse than a missing one, because it gets acted on

The dev-console spec named `/stages/04-project-setup#scaffold` as the page emitting a
missing-key warning. It was `/stages/03-architecture#traps`. Console events arrive
asynchronously and the listener read a variable that had already advanced.

The cost was not the wrong string. It was that **I read `Setup.tsx` looking for an unkeyed
array, found none, and kept looking**, through `RevealList`, `PinExercise`,
`AnnotatedArtifact` and `InlineCode`, all of which are correctly keyed. The label was
believed because a tool produced it. An independent scan with a fresh browser context per
URL is what disagreed, and only then did the attribution get fixed and start agreeing with
it.

Same family as the stage 05 caution about not transcribing a subagent's reasoning because
its conclusion is right. **A machine-produced label is a claim, and it is checkable.**

### Three of four debt entries were wrong about themselves

Not stale. Wrong, in ways that would have propagated into the deliverable if the entries
had been trusted. TD-32's mechanism was false and the corrected paragraph would have
taught it. TD-26 specified a closing check this repo had already learned not to write, and
named one of the two components it missed. TD-35 was accurate.

The entries are not sloppy; they are the most carefully written records this project keeps.
**What made them wrong is that each was written from a single observation at the moment of
discovery, and never re-run.** TD-32's own text says so: *"Observed there and not re-run
for this entry."* Recorded as **D-85**.

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

### W-6.3a's first commit landed directly on `develop`, and the fix needed a permission the controller does not have

The round started right after the TD-43 merge, on a session still checked out on
`develop` from that merge — and the first commit of new work went there too, rather
than to a branch cut for it, breaking the rule this file states plainly (`main` is
the user's; work happens on `feat/`/`fix/` branches). Caught immediately after the
commit, not later: `git branch feat/reference-w6-round1 <sha>` pointed a proper
branch at the misplaced commit, but putting `develop` back where it belonged needed
`git reset --hard`, which this session's sandbox refuses to run without the user's
own `!`-prefixed command — a destructive action the controller cannot authorise for
itself even having caused the problem. **The generalisation**: checking out the base
branch to merge one thing (TD-43) leaves a session sitting on it, and nothing forces
a new branch before the next commit — the discipline has to be checked at the start
of new work, not assumed to survive from the last `git checkout`.

---

## Next up

**2026-10-02: W-6 `incident-management` merged locally into `develop` as
`a992d74`.** The approved no-ff merge carried the Stage 16 lookup companion
and generated markdown. The feature branch was deleted. W-6 is **19/24**;
W-3 remains **13/18**. The merged tree passed 1389/1389 tests across 181 files,
plus lint, typecheck and format. No push or deployment occurred.

Next: choose the next W-3 stage from 08–10, 17 and 18. W-6.4 glossary and
stack surfacing remains a separate reference-hub task.

Deferred: the Stage 16 document-review follow-ups, optional incident-record
template, image publication and provenance, Stage 13 rollback wording repair,
and production promotion.

**Historical next-up record, 2026-10-01 (before the W-6 merge):**

**2026-10-01: Stage 16 port merged locally into `develop` as `3d2c266`.**
The no-ff merge carried the fourteen-step incident experience (`eef16d7`) and
prior records handoff (`61f27a5`). The post-merge handoff is `8d815f0` and
the feature branch was deleted. The merged tree matched the reviewed tip;
`pnpm test` passed **1388/1388 across 181 files**. The full pre-merge gate and
development-console audit passed, and the final reviewer returned Ready to merge
after three blocking findings were fixed. Stage 16 is `ready: true` and `develop`
is **13/18**. Nothing was pushed or deployed.

Next: review the W-6 `incident-management` companion on
`feat/incident-management-reference` and decide whether to merge it to `develop`.
After that, choose the next W-3 stage from 08–10, 17 and 18.

Deferred: the two nonblocking document-review follow-ups (recovery-update receipt
wording and rollback-row test scope), optional incident-record template, image
publication and incomplete provenance, the separate Stage 13 rollback
wording repair, and production promotion.

**Historical execution record, 2026-09-30 (before merge): stage 16 document repair.** The approved
[spec](superpowers/specs/2026-09-29-stage-16-doc-round-design.md) and
[plan](superpowers/plans/2026-09-29-stage-16-doc-round.md) are being executed
sequentially on `docs/2026-09-29-stage-16-preparation` from `91a6838`. Tasks 1–4
and Task 5a are implemented through `d1b22b0` and have independent per-task review:
Task 1 `0f32ffa`/evidence `ce33524`; Task 2 `9a3d7ee`; Task 3 `b2da11a`,
with the reviewed postmortem correction `79b8e08`; Task 4 `839a78f`; Task 5a
`d1b22b0`. The source images were committed separately as `1abea37`, before
implementation. Focused RED/GREEN and teeth output, reviews and raw cold-reader
returns are linked from the
[evidence](superpowers/plans/2026-09-29-stage-16-doc-round-evidence.md) and
[findings](superpowers/specs/2026-09-29-stage-16-cold-reader-findings.md).

The first cold-reader rerun exposed the reusable runbook's missing security response
route. Task 5a added a procedure location, responsible contact and fallback field;
the final lookup scored 5/5 HIT with no misfiled or missing answer. The final Parcel
reader found no document contradiction and kept Parcel's unresolved operational
facts unknown. The final lookup raised one new Minor: Definition of done says users
“received” a recovery update although publication through an existing status or
support channel is permitted. An incident-record template was suggested as a Minor
usability improvement; its required contents are already taught. The final reviewer
subsequently triaged both, along with two earlier review minors: the Task 1 rollback assertion
could target its table row more narrowly, and phrase assertions alone cannot prove
Task 2's operational sequence.

The post-plan PagerDuty incident-command page was inaccessible. The already used
Google SRE incident-response chapter was checked as a fallback; it supported
small-team ownership and an incident record, with no new correction. No live
rollback, query termination, credential revocation or replay was executed; the
document contains no executable incident command block. The full local gate passed:
**1370 tests across 180 files**, format, lint, typecheck, production build,
production audit **18/18** (responsive 320–2560, touch targets, light/dark contrast
and production console), and development-console audit **1/1** with no React
warnings or other browser messages. The read-only whole-branch review of
`91a6838..6df86f3` returned **Ready to merge**, zero Critical and zero Important;
its [full report](superpowers/plans/2026-09-29-stage-16-doc-round-review.md) is
preserved. The round is complete on the branch, awaiting the user's separate
integration decision. Stage 16 stays unready and W-3 stays 12/18. No merge or
deployment.

The reviewer retained two nonblocking Minors as follow-ups: **M1** recovery-update
receipt wording should match publication through the agreed channel; **M2** the
rollback regression should inspect the rollback row rather than the whole table.
Current guidance and the rollback row are usable. It confirmed that phrase guards
alone cannot prove operational sequence, while direct reading and the cold-reader
reruns support that sequence. A consolidated incident-record template is optional.

Deferred: interactive port, W-6 plate and images without established provenance,
production promotion, and Stage 13's rollback-first wording and its interactive
counterpart as a separate cross-stage slice. Service-specific thresholds, contacts
and retry semantics belong to filled runbooks; specialist forensics and legal
obligations belong to the security process. No deployed-site claim or production
smoke test was made because there was no promotion.

**2026-09-29: user selected stage 16 — Incident Management.** Preparation is on
`docs/2026-09-29-stage-16-preparation`, based on `develop` at `91a6838`.
Two independent initial cold readers completed the document assessment. The
[findings](superpowers/specs/2026-09-29-stage-16-cold-reader-findings.md) preserve
the scenario and five lookup questions. The
[document-repair spec](superpowers/specs/2026-09-29-stage-16-doc-round-design.md)
is approved. The [implementation plan](superpowers/plans/2026-09-29-stage-16-doc-round.md)
contains five sequential tasks and awaits review and an execution-method choice.
No product edits yet. Gathered sources and image
caveats are recorded in `reference/cheatsheet-sources.md` under the stage 16 round.
W-3 remains 12/18; W-6 follows the stage. Deferred: implementation, publication of
reference graphics, and promotion to `main`.

The following is the historical 2026-09-16 handoff; its stage-choice instruction
is superseded by the selection above.

**W-3 is at 12/18.** Stage 15 (Observability) is interactive and merged to `develop` as
`9d834e8`. Stages 01–07, 11, 12, 13, 14 and 15 are done. **Six remain, no priority chosen
yet**: `08-security-audit` (Security Audit), `09-performance-optimization` (Performance
Optimization), `10-documentation` (Documentation), `16-incident-management` (Incident
Management), `17-maintenance` (Maintenance), `18-continuous-improvement` (Continuous
Improvement) — titles confirmed against `web/src/lib/stages.ts`. Ask the user, or default
to numeric order (08 next) if there is no preference, rather than picking one unilaterally.

State at the close of 2026-09-16 (this round):

- `develop` is pushed — `origin/develop` matches at `9d834e8`. `develop` is 116 ahead of
  `main`, `main` 2 ahead of `develop` (pre-existing merge-history commits, untouched this
  round). No branch is in flight.
- **179 files / 1351 tests, `pnpm lint` clean, `pnpm typecheck` clean** — measured on
  `develop` at `9d834e8` this round, not carried over from before the fix wave.
- Records archived this round (D-96 pattern): 45 Completed rows (2026-09-07 and earlier)
  moved to `docs/tracker-archive.md`; ten fully-completed `docs/task.md` sections moved to
  the new `docs/task-archive.md`. Grep either archive by ID rather than reading it whole.
- This section itself was stale (still read "W-3 is at 8/18") — refreshed as part of this
  round; `docs/task.md`'s own "Next up"-shaped staleness was checked too (see that file).

**Remaining deferred item, carried forward:** `humanizer:humanizer` over panel prose (doc
correction sections passed; panel prose not separately run).

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
