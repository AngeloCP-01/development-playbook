# Stage 10 interactive port: execution evidence

Execution started 2026-10-22. The user's “proceed” approves the nine-task plan
and the recommended subagent-driven method. Plan commit: `c1c2ba0`; execution
starts from `1e0109e`. Develop review base is `79f9e31`; chapter tip `c092ac7`
is preserved on its original branch. No merge, push or deployment is authorized.

## Baseline

Existing linked worktree: `.worktrees/stage10-chapter`, branch
`feat/stage-10-documentation`. Installed dependencies are already copied locally;
no install, lockfile change or new worktree is needed. Parent files/server remain
separate. Fresh `pnpm test` from `web/` returned:

```text
 Test Files  208 passed (208)
      Tests  1512 passed (1512)
```

Raw baseline output and the recovery ledger are in this plan's ignored workspace:
`.superpowers/sdd/2026-10-20-stage-10-interactive-port/`. The [portable archive](evidence/2026-10-20-stage-10-port/README.md) preserves their exact bytes and hashes before scratch cleanup. Static plan checks do not substitute for task RED,
GREEN, actual sensitivity mutations or live UI checks.

## Task evidence

Task 1 is complete at `abae375`: record normalization and stable Markdown export.
The independent review found no issues. Actual behavior RED, 4-test GREEN and a
periodic-only record mutation are retained in `task-1-report.md`; the restored
full suite passed 1,516 tests across 209 files, plus lint/typecheck/format.

Task 2 implementation at `6ebcecf` passed 9 focused tests and the full 1,525-test
suite across 210 files. Independent review found I1 (blocking): read denial after
an already-loaded record loses the visible fields. This follows the proposed
plan source. The controller authorized a provider-local correction with a new
transition regression. Fix `962d675` passed scoped re-review: I1 addressed, no new
breakage. The two new regressions failed before the fix; restored GREEN is
15/15 and the full suite is 1,527/210. A targeted mutation failed only the new
edit-retention test; lint/typecheck/format pass. Provider placement and visible
warning/export/retry controls remain assigned to Tasks 7/8/9. The first test-probe ruling
also corrected an ambiguous status query without weakening its assertions.

Per-task reports in the workspace retain raw RED/GREEN output, failure reasons,
mutation diffs/restorations, commits and independent review verdicts. Task 3 is complete at `a90f45e`: selection and copy controls. The independent
review approved behavior with one nonblocking, plan-authored typography finding
(M1), carried to the final design pass. Both sensitivity mutations produced
one failed test and four passing tests; restored tests passed 5/5, and the full
suite passed 1,532 tests across 212 files. The first full-suite session ID was
lost, so a tracked rerun supplied the final result. An inconsistent mutation
excerpt was corrected using a saved raw rerun; its restoration also passed 5/5.

Task 4 is complete at `bab3beb`: README and ADR specimens, reciprocal controls
and Markdown copy. Independent review found no issues. Meaningful RED had
three expected failures; GREEN passed 3/3. Removing only the old specimen's
rendered supersession block failed its test while the other two passed.
Restoration was byte-exact. The full suite passed 1,535 tests across 213 files;
lint/typecheck/format passed. The initial no-files runner attempt is retained
and excluded from TDD evidence.

Task 5 is complete at `2102043`: document, reference, change and history inspectors.
Independent review found no issues. Meaningful RED had six expected failures;
GREEN passed 6/6. The narrowed authored-setting mutation ignored caller details,
failing only the injected-data test; the other five passed. Byte-exact restoration
and keyboard traversal of all six change rows and both facts passed. The full
suite passed 1,541 tests across 214 files; lint/typecheck/format passed.

Task 6 is complete at `1adf838`: comment/evidence drills and panels. Independent
review found no issues. Nonvacuous caller-provided cases establish behavior RED;
GREEN passed 6/6. Hiding wrong-answer reasoning failed only its regression, with
five tests passing. Byte-exact restoration and the full suite (1,547 tests across
215 files), lint/typecheck/format passed. Provider-owned drafts, commitments and
scores remain separate for each set and from the personal record.

Task 7 is complete at `fe93271`: two record views and the grouped checklist.
Independent review found no issues and closed I2. Controller diagnosis I2 had
reproduced a second read-failure transition: denial without notification before
an edit lost loaded fields. Its regression failed as expected (one failure, six
passes); the authorized provider correction now checks availability during the
update. All 22 focused tests pass. Count and stale-read mutations each caused
one intended failure and 21 passes; restoration was byte-exact. The full suite
passed 1,554 tests across 216 files; lint/typecheck/format passed.

Task 8 is complete at `7f803bc`: registered stage, twelve-panel rail, ready
metadata, curated references and retained production browser spec. Meaningful unit
RED had three expected failures; actual production placeholder RED had three
failures, separate from the retained font-fetch startup failure. GREEN passed 113
focused tests across 14 files, the full 1,558 tests across 218 files, and all
three targeted production flows. Trap and missing-step mutations each produced one
intended failure and one pass. Byte-exact restoration returned to the successful
production manifest. Independent task review approved the slice.

## Task 9 verification before the final reference cue

This section records the pre-cue source `f2a91fb65cdab8972153e1064bac8921d7f729761dfeb52d96af8d8ecf689c1a`. The final cue has its own source identity and affected-panel checks below.

The four product style corrections are committed at `f06da40`.

The [heading coverage table](../../stage-10-status.md) maps the approved twelve
panels to the canonical chapter, implementation files and proving tests. The
Markdown and React content remain deliberately hand-ported. The research appendix
and future W-6 sheet do not satisfy chapter coverage.

The expanded production matrix measured 1,358 states across all twelve panels,
seven widths (320, 390, 768, 1024, 1440, 1920 and 2560px) and both themes. It
visited every lookup row and ADR specimen, all wrong/right practice verdicts, all
disclosures/team notes, filled fields, checked boxes, clipboard success and manual
fallback, and read/write/clear warnings. It found zero overflow, contrast, touch-target or page-error failures. The denied-storage states did not originally attach a console-error listener; the separate C1 supplement below supplies that evidence. The 157 distinct measured
text/background/style pairs had a minimum contrast of 5.06:1. All 784 recorded
keyboard/disclosure checks passed. This covers each material state; it does not
claim every Cartesian combination or screen-reader certification.

At 1024x768, the largest initial panel was checklist, 1,344.48px (1.75 screens).
Its expanded manual export was the largest opened state, 1,927.11px (2.51
screens). All twelve panels clear D-52 without a split or exception change.
Twenty-six full-page screenshots and the exact per-state geometry, colors,
feedback, warnings and textarea values are retained in the execution workspace.

All nine curated/inline source destinations opened to their expected primary pages
on 2026-10-22. Stage 03/04/05/06/13/14/16 destinations rendered their expected
routes and visible panels. Clicking History's Stage 05 link landed on `#commits`
and rendered `panel-commits`.

The first full gate retained real failures: seven 5s unit timeouts and one Shiki
snapshot difference, plus two undersized links in the production touch sweep (26
browser tests passed, one failed). The separate development sweep passed with zero
React validation warnings. The unchanged Shiki snapshot passed in a focused
repeat; the two remaining timing failures passed when isolated. The controller
authorized `pnpm test --maxWorkers=1` for the final full suite, with every
file/assertion and the existing 5s limits preserved. No snapshot, timeout or
runner configuration changed. The final gate passed: format, lint, typecheck and
build exited 0; the full suite passed 1,558 tests across 218 files, production
passed 27/27 and the development sweep passed 1/1 with zero React warnings. Reader adjudication and independent review dispositions are recorded below.

Carried Task 3 M1 was confirmed and corrected: sampled copy/selection controls
inherited Newsreader 14px before the prescribed `t-ui` addition and now compute to
Archivo 14px, matching the design role. The initial measurement-only probe exited
0 before the first style edit; it was not TDD RED. The delete-and-redo cycle then
produced actual guarded RED for both leaves before minimum implementation, GREEN,
exactly one CopyMarkdown failure under mutation, and byte-exact restored
GREEN/rebuild. A premature post-change probe returned zero rows and is excluded
from evidence; its corrected helper waits for the actual hash panel and requires
all four controls.

I3 (blocking; omission in the approved plan) identified the standalone Stage 05
and Stage 16 links at 17px and 16px. The authorized minimum hit-area classes make
both 44px. A single-link mutation fails only Stage 05 at 29.75px; byte-exact
restoration and rebuild return both to a pass. The expanded matrix covers the
corrected links in both themes and every prescribed width. T8-M1 remains a
pre-existing Node environment warning: inherited `NO_COLOR` is removed only from
new verification subprocesses, with older raw logs preserved.

The matrix's application source manifest has identity
`f2a91fb65cdab8972153e1064bac8921d7f729761dfeb52d96af8d8ecf689c1a` and BUILD_ID
`29mYNccRtinNPndJePt1c`. The completed production gate served BUILD_ID
`t_p1bXF5ivZnonnPNheqP` and matched all 567 application-file hashes in the matrix
manifest. The post-redo reader server serves fresh BUILD_ID
`YDyl-9Cl-MRjn8rpkfEza`, matching all 567 application hashes again. Fresh
font/target guards and five existing control behavior tests pass. The controller
authorized reuse of the identical-source gate and matrix evidence. All twelve
parent file hashes remain unchanged and its port-3200 server remains PID 93201.
Raw logs, harness sources, mutations, restorations and report live in the
execution workspace. The controller preserves a verified archive before cleanup; see the [evidence preservation record](evidence/2026-10-20-stage-10-port/README.md). Full external article
snapshots are hash-verified locally; portable navigation metadata and short notes
enter the committed archive instead.

The [same-case reader report](2026-10-20-stage-10-port-reader-rerun.md) records completed independent assessments: no completeness gap and lookup 4 HIT / 1 MISFILED. R-M1 is a Minor findability issue: the explicit document-form distinction is in the chooser, while the first-choice exact-facts panel demonstrates reference material. Public-panel and chapter checks confirm the teaching exists. The whole-branch review confirmed the navigation issue; the final cue and targeted recheck below address it. Reader access worked, unknown project facts stayed explicit and the synthetic record was cleared between visits.

## C1: separate denied-storage console evidence

The 2026-10-23 supplement checks 168 asserted states in 14 fresh contexts: three record panels, four read/write/clear/manual states, two themes and seven widths. Console-error and page-error listeners attach before navigation; both counts are zero. Actual denial counters, warnings, actions, literal export text and clear/retry behavior are asserted. The first attempt incorrectly assumed hash navigation restarted the provider; the retained correction reloads the baseline per panel and changes only the harness.

This check used the unchanged pre-cue reader build and matched all 567 application hashes before and after. It closes Task 9 C1 separately, without expanding the original matrix's console scope. Full report `task-9-denied-console-followup.md` and both attempts remain in the archive. The whole-branch reviewer independently checked the harness, raw result and source provenance.

## Final combined fix wave: 2026-10-23

Product/test commit `bd90a05` adds a short reference/tutorial/explanation distinction to the reference panel and one render regression. The existing six tests remain intact. Record commit `2e3ccc8` corrects the unsupported contention diagnosis and makes develop/feature counts and the remaining handoff explicit. These are the single combined wave for T9-M1, R-M1 and WBR-M1.

The new test failed for the expected reason: direct form classification was absent. RED and the deliberate cue-removal teeth check each produced exactly one new failure and six existing passes. Restored GREEN passed 7/7 with byte-exact source restoration. The full implementer report retains raw excerpts and complete logs in `final-fix-wave-report.md` and `final-fix-evidence/`.

Final-source verification passed format, lint, generated-route typecheck and **1,559 tests across 218 files** using `pnpm test --maxWorkers=1`, with the original five-second limits. The restricted build attempt failed fetching existing Google Fonts; the network-capable build and subsequent post-development rebuild passed, producing 52 pages without dependency/configuration changes. The existing Stage 10 production flows passed **3/3**. The separate development-console sweep passed **1/1**, with zero detected React warnings.

The final affected-reference matrix passed **28 states**: both selections, both themes and seven widths. It measured 20 theme/color pairs, or 56 observations including typography, with minimum contrast **5.2555:1**. All 264 non-exempt target observations below lg were at least 44px high. Four keyboard actions per context gave **14 sequences / 56 actions** with the expected selection and visible focus. No overflow, contrast, target, console-error or page-error failure occurred. Twenty-eight screenshots and per-state measurements are retained.

The changed reference panel measured **968.890625px / 1.261576 screens** at 1024×768, in both themes and both selections. This is its measured height, not a new whole-stage maximum. The earlier twelve-panel 1,358-state matrix and 27/27 production audit remain explicitly **pre-cue** evidence. Only `LookupPanels.tsx` and its test differ among all 567 application inputs; unchanged components retain their earlier checks. The focused final matrix, production flows and development sweep cover the changed source without claiming a rerun of the whole-stage matrix or 27-test audit.

Final application source identity: `912cb2864b5b6602ac539b8d7e88aae44de92cbd91c19aa8733d463ea4604c79`. The browser-spec/matrix build was `Q_KQzP9ZTQ2jkpZ9V3E8p`; the post-development stable preview build is `2Pb3LZ-1ODrVTInRsi9Dv`. The controller independently rehashed all 567 inputs and all twelve preserved parent files. Matching source is provenance, not identical build output. The stable server is port 3100, PID 42455, owned by this worktree; parent port 3200 remains PID 93201.

The original lookup reader's separate unchanged-Q3 recheck returned **HIT at the original reference panel without navigation**. The original blind result remains **4 HIT / 1 MISFILED**. See the same-case reader report for its prior-knowledge limitation.

## Independent reviews and closure

Task 9 review approved the checkpoint with Minor T9-M1 and the C1 evidence limitation. C1 is closed by the supplement. The [combined whole-branch review](2026-10-20-stage-10-port-whole-branch-review.md) covers `79f9e31..534b681` and returned Ready with fixes, with no Critical or Important finding. Its three Minor findings drove the combined fix wave above. Its declined-scope items retain explicit controller dispositions in the archived ledger.

The [one scoped fix re-review](2026-10-23-stage-10-port-fix-review.md), covering `534b681..2e3ccc8`, returned **review clean; Ready to merge within its code scope**. T9-M1, R-M1 and WBR-M1 are all addressed; no new breakage was found. This closes Task 9 and the nine-task implementation plan. It does not authorize integration.

The closing records and archive are controller-owned. The archive manifest verifies every retained member's bytes/hash; `closure-verification.json` beside it records an independent archive, source and parent-preservation check. The canonical review reports remain unchanged after their verdicts. Final prose received a humanizer review; raw output, original reader scores and failed attempts remain intact.

Current handoff: `feat/stage-10-documentation` is implemented, verified and reviewed, ready for a separate integration decision into develop. The preserved chapter branch remains at `c092ac7`; local develop and tracked origin/develop remain `79f9e31`. No merge, push, fetch or deployment ran. The parent checkout and its server are preserved. The plan workspace is retired only after verified archival; recover its ledger with `tar -xOf execution-workspace.tar.gz progress.md` from the evidence directory.

Deferred: integration, deployment, W-6 companion/publication, W-6.4, five language
sheets, stages 17/18 and unrelated repairs remain outside this port. This feature
tree has 16/18 ready stages; develop remains 15/18 until an approved merge. W-6
remains 22 drawn / 27 registered.
