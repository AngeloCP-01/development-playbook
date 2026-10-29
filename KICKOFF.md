# Kickoff: Stage 17 Maintenance chapter ready

Updated 2026-10-29. Follow [AGENTS.md](AGENTS.md), the shared D-99 policy.
The user selected Stage 17. Its research/chapter checkpoint is complete; the
interactive page is next.

## Current state

- Branch: `docs/2026-10-29-stage-17-research`, based on local develop `4f965e8`.
  Chapter/source commit **8ee4efc**; use `git log -1 --oneline` for closing records.
  No merge, push or production promotion.
- [Canonical chapter](docs/17-maintenance.md): update triage, debt/refactoring,
  feature retirement, expiry, retention and restore checks, plus a clearly
  fictional maintenance record. Provider facts are separate from suggested routines.
- [One source record](reference/stage-17-source-research.md) captures versioned
  package-manager behavior, primary claims, provider limits, image provenance and
  possible W-6 lookups. Fowler's original debt quadrant is embedded with author
  credit, original link and reuse permission; it is unchanged.
- Application source is unchanged. Stage 17 remains `ready: false`; local develop
  W-3 is **16/18**, W-6 **23/28**. Stages 17/18, five language placeholders and
  W-6.4 remain. Stage numbers are filing codes, not a delivery sequence.

## Verification and next work

Fresh chapter checks: **50/50 tests across three files** (stage metadata, cadence
and ledger guards), chapter/source formatting, changed Markdown links/anchors and
whitespace. Closing-record rechecks: ledger **2/2**, **128 local targets / 6 files**,
exit 0. The 50-test result is retained for unchanged chapter/metadata inputs.
The link check caught two abbreviated chapter filenames, fixed before
its passing run. Humanizer prose pass and one independent final content review
are complete; review PASS with no actionable findings. Read-only pnpm 10.33.0 help
checks verified the documented flags. No production operation, app suite/build or
browser audit was run for this documentation-only slice.

Next: read [web patterns](web/PATTERNS.md) and [design](web/DESIGN.md), then shape
Stage 17's interactive page from the corrected chapter. Use a short acceptance
checklist and existing patterns; escalate only for new/shared behavior. The page
will need meaningful render coverage, the final app gate, affected states in both
themes and a development-console sweep. Keep a later W-6 companion assessment
bounded and decide which lookup rows add value beyond the stage.

See task **W-3.18** and the tracker **Current phase / Next up**. Integration needs
separate user approval. Preserve any running parent dev server; verify actual
listener ownership before server operations. No worktree or server was created
or stopped in this round.
