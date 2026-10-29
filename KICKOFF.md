# Kickoff: Stage 17 Maintenance chapter ready

Updated 2026-10-29. Follow [AGENTS.md](AGENTS.md), the shared D-99 policy.
The user selected Stage 17. Its research/chapter checkpoint is complete; the
interactive page is next. D-100 now specifies models and separate task sessions.

## Current state

- Current branch: `docs/2026-10-29-model-session-workflow`, starting from chapter
  handoff `1f66dfd`. The preserved chapter branch is
  `docs/2026-10-29-stage-17-research`, based on develop `4f965e8`; source commit
  **8ee4efc**. Use `git log -1 --oneline` for the current workflow records tip.
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

Workflow records were checked against `1f66dfd`: ledger **2/2**, **107 local
targets / 4 files**, exit 0; whitespace clean. Self-reviewed under D-99.
Application inputs are unchanged.

Retained chapter checks: **50/50 tests across three files** (stage metadata, cadence
and ledger guards), chapter/source formatting, changed Markdown links/anchors and
whitespace. Closing-record rechecks: ledger **2/2**, **128 local targets / 6 files**,
exit 0. The 50-test result is retained for unchanged chapter/metadata inputs.
The link check caught two abbreviated chapter filenames, fixed before
its passing run. Humanizer prose pass and one independent final content review
are complete; review PASS with no actionable findings. Read-only pnpm 10.33.0 help
checks verified the documented flags. No production operation, app suite/build or
browser audit was run for this documentation-only slice.

## Next task and session

**Task:** Stage 17 interactive Maintenance page. **Recommended model:**
`gpt-6.1-sol`, **reasoning:** `high`, in a **new implementation session**.
The user selects the setting before starting. Keep the existing main
research/brainstorming session open as coordinator; its recommended setting is
`gpt-6-astra`, `low`. This update does not change the active session model.

Start a scoped feature branch from the committed tip of the current workflow
branch, which includes the reviewed chapter and D-100; record the exact starting
commit. Both documentation branches remain unmerged. Return the implementation
session reference, branch/commit, actual checks and unresolved issues to this
coordinator for review before any merge decision. The coordinator reads the
referenced thread, then checks the actual diff and evidence.

Read [web patterns](web/PATTERNS.md) and [design](web/DESIGN.md), then shape
Stage 17's interactive page from the corrected chapter. Agree the short acceptance
checklist with the coordinator before implementation and use existing patterns.
Escalate only for new/shared behavior. The page
will need meaningful render coverage, the final app gate, affected states in both
themes and a development-console sweep. Keep a later W-6 companion assessment
bounded and decide which lookup rows add value beyond the stage.

See task **W-3.18** and the tracker **Current phase / Next up**. Integration needs
separate user approval. Preserve any running parent dev server; verify actual
listener ownership before server operations. No worktree or server was created
or stopped in this round.
