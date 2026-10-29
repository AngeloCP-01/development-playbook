# Kickoff: Stage 17 AI Plays correction required

Updated 2026-10-29. Follow [AGENTS.md](AGENTS.md), D-99 and D-100.
Coordinator review found a missing D-35 requirement: AI Plays is absent from
both the chapter and the page. Correct this before integration; the earlier
feature-complete status in task/tracker records needs a follow-up correction.

## Current state

- Branch: `feat/maintenance-page`, started from workflow handoff **23f481e**.
  Acceptance **c507a7a**; implementation and tested app tree **ebcb0ba**.
  Use `git log -1 --oneline` for the closing records tip.
- Six panels: triage, updates, expiry, data and recovery, debt and retirement,
  review record. Three scored exercises, all seven chapter traps, five generated
  glossary definitions and stage/rail registration reuse existing components.
- [Canonical chapter](docs/17-maintenance.md) and the
  [single source record](reference/stage-17-source-research.md) govern the content.
  The queue, proposals and record are fictional. The page links Fowler's quadrant
  and uses prose paraphrases; the retained source image was not published or changed.
- Feature branch: **17/18** interactive. Local develop **4f965e8** remains
  **16/18**, W-6 **23 drawn / 28 registered**. Chapter/workflow/feature branches
  remain unmerged; no push or production promotion.

## Verification

The following results apply to the earlier six-panel app tree **ebcb0ba**.
They do not establish D-35 completeness or verify the pending AI Plays addition.
The independent review missed this requirement.

App tree **ebcb0ba**: formatting, lint, generated-route typecheck,
**1,570 tests / 220 files**, **53-page production build**, development-console
**1/1**, and independent final content/page review PASS with no findings.
Production audit: **25 first-run passes retained plus two passing isolated timeout
reruns**, same app tree and unchanged assertions/timeouts. Focused browser checks
cover all six panels in both themes at 320/768/1440px, expanded/answered states,
keyboard, Back/reload, definition bounds and a clean console. Humanizer pass complete.
Commands and failure context are in the tracker completion row; records-only edits
retain these app checks rather than repeating them.

The development-console sweep used a temporary configuration against the verified
existing server on **3200**, preserving it. The owned production preview on **3100**
was stopped. No worktree was created. Local fonts/browser launches required sandbox
escalation; no application/configuration workaround was introduced.

## Next task and session

**Task:** add Stage 17 AI Plays to the chapter and interactive page, then return
for coordinator review. **Recommended model:** `gpt-6.1-sol`, **reasoning:** `high`.
The user explicitly requested continuing the existing implementation session
**01a1850c-d865-7d02-a3c0-23916ced0f66** for this correction. Continue the clean
`feat/maintenance-page` branch from handoff **1283526** plus this records commit;
record the exact starting commit. The main coordination/review session stays open
with recommended **gpt-6-astra / low**. The user selects model settings.

### Confirmed gap and acceptance checklist

[D-35](docs/tracker.md#decisions) and [the AI Plays pattern](web/PATTERNS.md)
require a chapter subsection and a dedicated app step. Current
`web/src/features/maintenance/steps.ts` has only six content steps;
`web/src/lib/stage-metadata.test.ts` explicitly lists only stages 01–16 for its
AI-section guard. This omission explains why the existing checks passed.

- [ ] Add `### AI in maintenance` inside the chapter's "The work" section.
- [ ] Add a seventh **AI Plays** step using existing stage-local/shared patterns;
  keep the chapter and page consistent. Update the step/rail mappings and
  affected six-step assertions or records.
- [ ] Teach useful assistance: compare supplied versioned migration guidance,
  summarize dependency/lockfile changes, organize evidenced debt and maintenance
  findings, and draft checks or review records. Name real available tools only
  where they help the reader; avoid provider or execution guarantees.
- [ ] Teach limits: missing evidence stays unknown; an AI suggestion does not
  establish vulnerability exposure, unused features, a retention policy or a
  successful restore. Keep secrets out of prompts and records. Destructive
  cleanup, credential changes and production actions need explicit human review
  and appropriate verified safeguards. Do not execute any live maintenance action.
- [ ] Extend the existing chapter AI guard to Stage 17 and add meaningful render
  coverage for the AI panel's guidance, accessible output and any interaction.
  For reproduced behavior/test gaps, demonstrate the relevant failing check
  before the fix; follow D-99 for static prose additions.
- [ ] Apply the humanizer pass to new prose. Run focused checks while editing,
  then the required final web gate for the changed application, a development-
  console sweep for changed interaction, and affected states in both themes with
  keyboard access at narrow/middle/wide widths. Retain old checks only where the
  inputs are unchanged and identify the tested commit and scope.
- [ ] Correct the feature-complete handoff/task/tracker status with the actual
  fix commit and checks, preserving the earlier results as dated evidence.
  Return the session reference, branch/commit, actual checks and unresolved
  issues here for Astra Low coordinator review of the actual diff and evidence.

Read the implementation thread before relying on its contents. The coordinator
has already read its latest handoff and inspected the missing chapter heading,
step list and guard. This is a confirmed omission; no application fix is included
in this records update. It is not a full review of the rest of the branch.

Integration into develop still needs separate user approval; main is the user's.
A later W-6 Maintenance companion assessment remains bounded and separate.
Stage 18, five language placeholders and W-6.4 also remain. See task **W-3.18**
and tracker **Current phase / Next up** for the earlier scope and evidence.
