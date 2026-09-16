# Records refresh report — 2026-09-16

Branch confirmed: `develop` (not a feature branch) throughout.

## Part 1 — tracker.md → tracker-archive.md

- Moved **45 Completed rows** dated 2026-09-07 or earlier (originally lines 98–142 of
  `docs/tracker.md`, from `2026-09-07 | Coverage walk` down to `2026-08-03 | W-3.2`) into
  `docs/tracker-archive.md`, verbatim, reversed into ascending date order and appended
  after the archive's existing last row (`2026-07-24 | W-3 (02)`).
- Live `docs/tracker.md` Completed table now holds exactly the **8 rows** dated
  2026-09-08 through 2026-09-15 (the current round: `W-3.12 (port)`, `W-3.12 (port,
  planned)`, `W-3.12 (cont. 2)`, `W-3.12 (cont.)`, `TD-46 · D-97`, `Context budget`,
  `W-3.12`, `TD-44`).
- Updated the archive's own description line: "Rows dated before 2026-08-01" →
  "Rows dated 2026-09-07 or earlier."
- Did **not** touch `## Technical debt` or `## Decisions` in either file (confirmed via
  `git diff --stat`/`@@` hunks — only the header block, the Completed table, and `## Next
  up` changed in `docs/tracker.md`).
- Spot checks: `2026-08-03 | W-3.2`, `2026-09-07 | Coverage walk`, `2026-08-11 | W-5
  (live)` each appear exactly once, only in the archive. All 8 rows dated 2026-09-08+
  appear exactly once, only in the live file.

## Part 2 — docs/task-archive.md (new)

Created `docs/task-archive.md` with a header mirroring `tracker-archive.md`'s. Moved
**10** fully-completed `### <id>` sections out of `docs/task.md`, verbatim, in this
order: `P-5`, `W-3.1`, `W-3.1b`, `W-3.3`, `W-3.2`, `W-3.4`, `W-3.5`, `W-3.6`, `W-4`,
`W-5`.

**Correction made before archiving W-3.6** (as instructed): its status line said "built
2026-08-27 on `feat/stage-06-testing`, 28 commits, not yet merged." Checked
`docs/tracker.md`'s W-3.6 row (in `docs/tracker-archive.md` now) and found: **merged to
`develop` as `cad21c1`, `--no-ff`, 2026-08-27, branch deleted** — the tracker row itself
says this claim was false from 2026-08-28 onward. Corrected using the strikethrough
convention used elsewhere in the file (matching `W-3.1b`'s own pattern):

> `### W-3.6 — Stage 06, port ☑ *(built 2026-08-27 on `feat/stage-06-testing`, 28 commits; ~~not yet merged~~ ✓ merged to `develop` as `cad21c1`, `--no-ff`, 2026-08-27, branch deleted)*`

Also corrected two other stale claims inside the same section body before moving it: a
trailing `**Not merged, NOT pushed.**` sentence and an unchecked `- [ ] Merge into
develop` checkbox, both updated to reflect the real `cad21c1` merge.

**Discrepancy in the task instructions, flagged rather than silently resolved:** the
task's own bullet list names exactly 10 sections to archive (P-5, W-3.1, W-3.1b, W-3.3,
W-3.2, W-3.4, W-3.5, W-3.6, W-4, W-5), but its Verification step 3 says `grep -c "^###"
docs/task-archive.md` should equal **9**. I archived all 10 named sections (matching the
explicit list, and matching the "keep live" list, which correctly excludes only P-6,
W-3, W-3.12, W-6, Backlog). The actual `grep -c "^###"` count is **11**, not 9 or 10,
because one archived section (`W-3.2`) contains an internal `#### AI-plays coverage, per
stage` subheading, and `grep -c "^###"` (a string-prefix match) also matches `####`
lines. Both the "9" and a plain top-level count of "10" undercount for that reason. I
verified correctness a different way: `grep -n "^### " docs/task-archive.md` lists
exactly the 10 intended sections plus the one internal `####` line, and `docs/task.md`
now retains exactly `P-6`, `W-3` (parent), `W-3.12`, `W-6`, `## Backlog` as its only
`##`/`###`-level content besides `## Overview`/`## Milestones`/`## Task detail`. I'm
confident the split is correct; the numeric mismatch is in the task instructions, not in
the result.

Added to `docs/task.md`, near its header: "Older completed task-detail sections live in
[task-archive.md](task-archive.md) — grep it by id, don't read it whole."

Added a `docs/task-archive.md` row to `CLAUDE.md`'s Project artifacts table, and
reworded `docs/task.md`'s own row to mention it holds "open task detail" now.

**Not done, noted as a follow-up per instructions:** no automated guard test
(mirroring `web/src/lib/tracker-ledger.test.ts`) was added for the task/task-archive
split. This would be a small standalone task if the split ever needs enforcing.

## Part 3 — refresh for the next round

**`docs/tracker.md`:**
- Header (`Last updated`, `Current phase`) updated: 2026-09-16, stage 15 merged as
  `9d834e8`, `develop` pushed and matching `origin/develop`.
- The 2026-09-15 `W-3.12 (port)` Completed row updated in place (not re-dated, since
  D-96 archives by original date and this is still the current round's own work):
  - Opening sentence now says "reviewed task-by-task and whole-branch, fixed, and
    merged to `develop`" instead of "NOT merged."
  - Added, inline near the top of the Evidence column (not buried in Deferred, since
    it's resolved not deferred): the final whole-branch review (opus) found two
    blocking issues — untested checklist-persistence, two stale step-count references
    from the D-52 reshape — both fixed (`3604e59`) and independently re-verified with a
    teeth check.
  - Added merge commit `9d834e8` (`Merge feat/stage-15-observability-port: stage 15
    (Observability) interactive port`, `--no-ff`) and the fix commit `3604e59`.
  - Replaced the pre-fix test count (179 files/1348 tests) with the **real post-merge
    gate re-run measured this session**: `pnpm test` 179 files/1351 tests all green,
    `pnpm lint` clean, `pnpm typecheck` clean (kept the pre-fix number too, labelled as
    such, since it's part of the round's own history).
  - Replaced the `**NOT merged, NOT pushed, NOT deployed**` ending with the actual
    merge/push state: merged `9d834e8` --no-ff 2026-09-16, branch deleted, `develop`
    pushed (`origin/develop` matches), 116 ahead of `main`, `main` 2 ahead of `develop`
    (pre-existing, unrelated commits).
  - Kept the existing Deferred list intact (still accurate — baselines worksheet,
    Drill migration, ten unregistered images, doc review minors, two cosmetic Minor
    findings).
- **No new Decision row added.** Checked: D-52 (the panel-weight/step-count rule) is
  already recorded; this round's four-panel split and the traps-last-step ordering are
  applications of that existing rule, not new architectural decisions, and the row's own
  prose already captures the specifics (which panels, which order, why). Used judgment
  per the task's own instruction not to invent one if genuinely unsure — I'm not unsure
  here, I judged it unnecessary.
- `## Next up` rewritten: stage 15 done and merged (`9d834e8`), W-3 at 12/18, the six
  remaining stages named with their real titles from `web/src/lib/stages.ts`
  (`08-security-audit` Security Audit, `09-performance-optimization` Performance
  Optimization, `10-documentation` Documentation, `16-incident-management` Incident
  Management, `17-maintenance` Maintenance, `18-continuous-improvement` Continuous
  Improvement), explicitly no priority chosen, real branch/test state for this round,
  and a note about the two new archive files. Left the older historical narrative
  further down in `## Next up` (the 2026-08-11 stage-04 recommendation write-up, the
  D-52 review retrospective, etc.) untouched — it's explicitly kept "as written... per
  the decisions convention" per its own surrounding text, and rewriting it was outside
  this task's scope.
- Checked `docs/task.md` for its own "Next up"-shaped staleness: it has no `## Next up`
  section (that concept only exists in `tracker.md`), so nothing to address there beyond
  the W-3/W-3.12 updates already made.

**`docs/task.md`:**
- `### W-3` (parent) status text: "DONE and MERGED to `develop` as `9d834e8`" (was
  "branch awaits whole-branch review and the user's merge decision").
- `### W-3.12`: marker changed ◐ → ☑; status text now says doc round + port both merged
  (`7418684`, `9d834e8`), final whole-branch review findings and fixes, and the real
  post-merge gate numbers (179 files/1351 tests, lint/typecheck clean) instead of the
  pre-merge 1348.
- Body text's trailing "Not merged, not pushed, not deployed" sentence replaced with the
  actual merge/push state and post-merge gate re-run numbers.
- `## Milestones`'s `W-3` summary row (line ~63) also said "awaiting the whole-branch
  review and the user's merge decision" — this was NOT already consistent as assumed;
  updated it too, to "ported and merged... Six stages remain, no priority chosen."

**Real gate numbers measured this session (`develop` at `9d834e8`, `web/` directory):**
- `pnpm test` → **179 files passed / 1351 tests passed**, ~16s.
- `pnpm lint` → clean, no output (0 warnings, 0 errors).
- `pnpm typecheck` → `next typegen` succeeded, `tsc --noEmit` clean.
- (Per instructions, did not run `pnpm test:e2e` or `pnpm test:dev-console` as part of
  this pass — the tracker/task rows cite the branch's own last measured e2e 18/18 and
  dev-console 1/1 from the merge commit message, not a number I re-measured.)

**`KICKOFF.md`:** fully rewritten (not incrementally patched), since KICKOFF has no
archive and is meant to be overwritten each round.
- Project state: 12/18, stage 15 merged (`9d834e8`), post-merge gate numbers, date
  2026-09-16.
- Branch state re-derived for real: `git fetch`; `develop` = `origin/develop` =
  `9d834e8` (0 ahead, pushed); `main` = `d659d32`; `develop` is 116 ahead of `main`,
  `main` 2 ahead of `develop` (two pre-existing merge-history commits, `d659d32` and
  `5d76b8a`, unrelated to this round). `git branch`/`git worktree list` both confirmed
  single-line/clean (port branch deleted on merge).
- "Start here" section replaced entirely: branch check, re-derive numbers, the two
  one-line grep checks, then "pick the next W-3 stage before cutting a branch" (six
  named, explicitly no default chosen, ask the user or default to numeric order only if
  they have no preference), then run-the-loop guidance. Did not unilaterally pick a
  next stage.
- Removed the entire "Stage 15 — the fix queue closed..." section, the "Reference
  material for stage 15" subsection, and all three "What this session did (2026-09-1{0,1,5})"
  narrative sections — that level of detail now lives only in `docs/tracker.md`'s row
  and (for the older two sessions) `docs/tracker-archive.md`.
- "Open threads": removed resolved items (stage 15 port itself, D-52 split as an open
  question, dev-console re-run, "next W-3 stage not chosen" — replaced by the "Start
  here" guidance instead of duplicating it, the personal-files-history item since it was
  already fully resolved and struck through, and the "docs/tracker.md's Next up is
  stale" item since that's fixed now). Kept genuinely still-open items: the ten
  unregistered observability images, the baselines/alert-set worksheet, migrating
  `TriageDrill`/`AuthorizationDrill` onto `Drill`, `sql-reference`/`api-reference`
  parked, the two cosmetic D-52 Minor findings, and the various `docs/learnings/*`
  pointers. Added a note about the two archive files (tracker-archive's new content,
  and the brand-new task-archive.md) and the missing task-archive guard test as a
  follow-up.
- Condensed history section: refreshed test counts (1351/179), stage 15 now "interactive
  and merged" rather than "on its own branch, unmerged."

## Guard test

```
$ cd web && pnpm vitest run src/lib/tracker-ledger.test.ts
 RUN  v4.1.10 .../web
 Test Files  1 passed (1)
      Tests  2 passed (2)
```

Passed both before Part 1's edits (baseline) and again after all edits (final check).

## Verification counts

- `grep -c "^###" docs/task-archive.md` → **11** (see Part 2 discrepancy note above —
  10 intended top-level sections + 1 internal `####` false-positive match; not 9 as the
  task's verification step predicted).
- Live `docs/tracker.md` Completed rows: **8**. Archived this round: **45**.
  `docs/tracker-archive.md` total Completed rows: **68** (23 original + 45 new).
- `docs/task.md` retains exactly 5 `### <id>` sections in `## Task detail` (`P-6`,
  `W-3`, `W-3.12`, `W-6`) plus `## Backlog` — confirmed via `grep -n "^## \|^### "
  docs/task.md`.
- No duplicated or dropped content found on spot checks (see Part 1/Part 2 above).
- "12/18" is consistent across `docs/tracker.md`, `docs/task.md`, and `KICKOFF.md`. No
  live (non-historical) "8/18" claim remains anywhere; the only "8/18" hits left are
  inside historical Completed-row prose describing past states, which is correct and
  expected (history shouldn't be rewritten).

## Files changed

- `CLAUDE.md` — Project artifacts table: added `docs/task-archive.md` row, reworded
  `docs/task.md` row.
- `KICKOFF.md` — fully rewritten for the next round.
- `docs/task.md` — 10 sections archived out; W-3/W-3.12/Milestones updated; one-line
  archive pointer added near header.
- `docs/task-archive.md` — new file, 10 archived sections plus header.
- `docs/tracker.md` — 45 rows archived out; header, W-3.12 row, and `## Next up`
  updated; Technical debt and Decisions untouched.
- `docs/tracker-archive.md` — 45 rows appended to the Completed table; description line
  updated; Technical debt (closed) and Decisions sections untouched.

## Concerns

1. **The 9-vs-10-vs-11 section-count discrepancy** in the task's own instructions (Part
   2). Resolved in favour of the explicit named list (10 sections) over the numeric
   verification hint (9), since the named list is unambiguous and matches the "keep
   live" list exactly. Flagged above rather than silently picked.
2. **`develop` was already pushed and level with `origin/develop`** before this session
   started (0 ahead), contradicting the stale "not merged, not pushed" language found in
   several places (`docs/tracker.md`'s row, `KICKOFF.md`, `docs/task.md`) — all of which
   I corrected using freshly-run `git` commands rather than trusting any prior note.
3. Did not archive or rewrite the older historical narrative inside `docs/tracker.md`'s
   `## Next up` section (the 2026-08-11 stage-04 recommendation essay and its
   surrounding retrospective) — only the top "current state" block was refreshed, per
   the task's own framing ("Update `## Next up`... to reflect: stage 15 done...") and
   because that older material is explicitly marked as kept-as-written history within
   the file itself.
4. No new `TD-N`/`D-N` entries were opened or closed this round, so the guard test's
   pass is confirmation that Part 1/Part 2 didn't disturb those sections — not evidence
   about the quality of the Completed-row move itself (the task's own caveat, restated
   here for the record).
