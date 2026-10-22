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
`.superpowers/sdd/2026-10-20-stage-10-interactive-port/`. Archive their exact bytes
and hashes before any cleanup. Static plan checks do not substitute for task RED,
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

## Task 9 verification

The four product style corrections are committed at `f06da40`.

The [heading coverage table](../../stage-10-status.md) maps the approved twelve
panels to the canonical chapter, implementation files and proving tests. The
Markdown and React content remain deliberately hand-ported. The research appendix
and future W-6 sheet do not satisfy chapter coverage.

The expanded production matrix measured 1,358 states across all twelve panels,
seven widths (320, 390, 768, 1024, 1440, 1920 and 2560px) and both themes. It
visited every lookup row and ADR specimen, all wrong/right practice verdicts, all
disclosures/team notes, filled fields, checked boxes, clipboard success and manual
fallback, and read/write/clear warnings. It found zero overflow, contrast,
touch-target or page-console failures. The 157 distinct measured
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
passed 27/27 and the development sweep passed 1/1 with zero React warnings. Reader
adjudication and independent reviews remain controller-owned.

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
execution workspace. The controller will preserve a verified archive before
cleanup; see the [evidence preservation
record](evidence/2026-10-20-stage-10-port/README.md). Full external article
snapshots are hash-verified locally; portable navigation metadata and short notes
enter the committed archive instead.

Pending delivery steps: independent readers/finding adjudication and final review.

Deferred: integration, deployment, W-6 companion/publication, W-6.4, five language
sheets, stages 17/18 and unrelated repairs remain outside this port. This feature
tree has 16/18 ready stages; develop remains 15/18 until an approved merge. W-6
remains 22 drawn / 27 registered.
