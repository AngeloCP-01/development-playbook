# Kickoff — Stage 10 chapter specification

Updated 2026-10-20. The user selected Stage 10 — Documentation, with research,
chapter review/corrections, then a separately designed interactive port.
Research and the initial cold-reader assessment are complete. The written
chapter spec is proposed and awaits the user's review. No implementation plan,
chapter corrections or new regression tests have been written.

## Active workspace

- Worktree: `/Users/angelito/personal/Development-Playbook/.worktrees/stage10-chapter`
- Branch: `docs/2026-10-20-stage-10-chapter`, created from develop `79f9e31`.
- Source collection: `e30c9a4`, a separate documentation commit preserving the
  earlier gathered research, chapter appendix, source ledger and four images.
- Query `git log -1 --oneline` for the spec/records tip; do not put a commit's own
  SHA into the handoff it commits.
- This branch is not merged, pushed or deployed. No merge or push was attempted.

The parent checkout remains on `docs/2026-10-15-stage-10-kickoff`. It still has
its original modified research/records, the user's `AGENTS.md` changes and
untracked `image.png`. Its files were copied selectively, not moved or stashed.
The source branch does not contain a merge of that handoff branch. Do not discard
or commit the parent's unrelated files when continuing here.

Installed dependencies are reused through `web/node_modules`, a symlink to the
parent's existing dependencies. No installation or application code change was
needed for this specification round. The source/spec work did not start or stop
a development server.

## Next checkpoint

Read:

1. `AGENTS.md`, the user-provided Codex instructions and the current Superpowers
   skills.
2. [The proposed chapter spec](docs/superpowers/specs/2026-10-20-stage-10-documentation-design.md).
3. [The initial cold-reader findings](docs/superpowers/reports/2026-10-20-stage-10-cold-reader.md),
   including the exact Toolshare scenario and five lookup questions.
4. [The builder check](docs/superpowers/reports/2026-10-20-stage-10-spec-review.md).
5. [The chapter](docs/10-documentation.md), [source notes](reference/stage-10-source-research.md)
   and the Stage 10 gathering/follow-up sections in
   [the source ledger](reference/cheatsheet-sources.md).
6. `docs/task.md`, W-3.17; `docs/tracker.md`, Next up; decisions D-35, D-39,
   D-42, D-47, D-48, D-54, D-68 and D-95. Read
   `docs/learnings/plans-are-unverified-101.md` before writing the plan.

**Await the user's review of the written spec before implementation planning.**
Once approved, invoke `superpowers:writing-plans`. The plan needs targeted RED
checks before corrections, source/contract checks, same-scenario reader reruns,
per-task review and a whole-branch implementation review. Recommend inline or
subagent-driven execution based on the actual plan, not an older stage's choice.

The spec's major proposed choices are a Workshop booking-app worked example,
append-only ADR supersession notices with reciprocal links, a small documentation
change/check matrix, and correction of the shared ADR glossary definition.
The Toolshare cold-reader case stays held out from authored examples.

## Verified state

- **W-3: 15/18 ready.** Stage 10 remains `ready: false`; stages 17 and 18 are
  separate. Documentation runs continuously; stage numbers are filing codes.
- **W-6: 22 drawn / 27 registered.** Five language placeholders remain. This
  research does not register a new documentation sheet or complete W-6.4.
- Initial consultability: **0 HIT / 3 PARTIAL / 0 MISFILED / 2 MISS** for the
  five preserved questions. This is a baseline, not a corrected-chapter result.
- Completeness: useful README/ADR skeletons are possible; configuration enforcement,
  changed contract documentation and historical/current guidance need correction.
  Missing scenario facts were separated from chapter defects.
- Fresh builder check of the written spec: **nothing important left**. This
  checks whether planning is possible, not whether implementation is correct.
- Targeted baseline verification: **51/51 tests across 4 files** (stage metadata,
  tracker ledger, terms and glossary sync). The full app gate was not run for
  this spec-only round; do not reuse older build/audit results as fresh evidence.

Local develop and tracked origin/develop are `79f9e31` at this check. Local main
is `d659d32`; tracked origin/main is `bd6c837`. No fetch or deployed check ran,
so tracked remote refs are snapshots and make no deployment claim.

## Deferred

Chapter implementation and its correction rerun; new regression guards; the
interactive port, exercises and registration; W-6 sheet design/publication;
stages 17/18; language sheets and W-6.4; unrelated shared repairs; promotion.

The user handles pushes and promotion to main. Ask before every merge, including
a merge into develop. The later implementation review must cover the entire
branch, including the source-collection commit; this spec's builder check does
not substitute for that review.
