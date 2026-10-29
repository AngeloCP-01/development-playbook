# Kickoff: Technical Debt Review scope approved

Updated 2026-10-29. Follow [AGENTS.md](AGENTS.md), D-99 and D-100.

## Current state

- Current branch: `docs/2026-10-29-maintenance-reference-assessment`, based on
  reviewed Maintenance feature tip **dd069e7**. Use `git log -1 --oneline` for the
  committed assessment tip. The source feature branch `feat/maintenance-page`
  is preserved. No merge, push or deployment.
- [Assessment](reference/stage-17-source-research.md#w-6-assessment-technical-debt-review-2026-10-29):
  approved one **Technical Debt Review** sheet at `/reference/technical-debt`,
  four sections/fourteen rows using the existing renderer and the attributed,
  unchanged Fowler quadrant. The user selected this scope with "proceed" after
  the four-section/fourteen-row proposal. Implementation is authorized but unstarted.
- The broad Maintenance checklist and dependency-command card are deferred.
  The existing seven-panel stage keeps teaching examples, exercises and AI Plays;
  the proposed sheet adds all-visible lookup. The quadrant explains debt categories,
  not repayment urgency. Its four cases need full equivalent text in the sheet.
- Stage 17 source/chapter **8ee4efc**; page **ebcb0ba**; AI Plays correction
  **01b8dc2** and test-only **28d4410**. Coordinator review **dd069e7** records no
  actionable correction findings. Implementation session:
  **01a1850c-d865-7d02-a3c0-23916ced0f66**; read it before relying on its contents.
- Feature W-3 **17/18**, local develop **4f965e8** still **16/18**; references
  remain **23 drawn / 28 registered**. A future sheet would make **24/29**.

## Verification scope

This round changes assessment/handoff documentation only. Selected source pages
and illustration permission were reopened; the source record preserves the
URLs, authors, dates and supported findings. The 512 × 384 original PNG is
46,955 bytes. No public image or application source changed; no app suite/build
or browser sweep is required for this assessment. Content/link and ledger checks
are recorded in the latest tracker completion row.

Retained page evidence: **1573 tests / 220 files**, **53-page build**, production
**27/27**, dev-console **1/1**, tested **28d4410**; correction coordinator checks
**48/48** at **98688ec**. These are identified earlier app checks, not fresh
assessment checks. See task **W-3.18** and tracker completion rows for commands,
limits and the earlier six-panel omission. The original six-panel implementation
was not re-reviewed in full by the coordinator.

## Next task and session

**Task:** implement the approved W-6.3s Technical Debt Review sheet.
**Recommended model:** `gpt-6.1-sol`, **reasoning:** `high`, in a **new session**
under D-100. Scope approval is recorded; do not ask for it again. The runtime
cannot create that user-selected session or confirm the active model setting.

Start `feat/technical-debt-reference` from the committed tip of this assessment/
handoff branch, which contains assessment **c5f945c** and this scope approval.
Record the exact starting SHA with `git log -1 --oneline`; the branch includes
the unmerged Stage 17 feature. Use the source record's compact acceptance scope:
existing registry/renderer, unchanged gathered image and adjacent credit,
full text equivalent, meaningful render tests, generated Markdown, final web gate,
focused image/theme/width/keyboard checks and one final independent review.
Return session reference, branch/commit, actual checks and issues here for review.

### Implementation pointers

- Add `web/src/lib/cheatsheets/technical-debt.ts`: Standards group, tether
  `17-maintenance`. Sections/rows: Recognize the debt (4), Decide from evidence
  (4), Choose a response (3), Retire with evidence (3). The assessment specifies
  the content boundary and separates source classification from editorial prompts.
- Register it in `web/src/lib/cheatsheets/index.ts`; update the explicit drawn
  slug guard in `index.test.ts`. Reuse `CheatsheetView`; no renderer/API changes.
- Copy `reference/stage-17-tech-debt-quadrant.png` unchanged into
  `web/public/reference/stage-17-tech-debt-quadrant.png`; dimensions 512 x 384.
  Register it as gathered (omit `origin: 'original'`). Keep Fowler's author credit,
  original-article link and an explicit unchanged-illustration statement in the
  existing adjacent source area. The four rows and section note must provide both
  axes and all four cases because the drawn sheet's image is hidden from assistive
  technology. Inspect narrow rendering; do not upscale/edit the source as a workaround.
- Add `web/src/components/TechnicalDebtReference.test.tsx`, following
  `DocumentationReference.test.tsx`, with meaningful visible/accessible output
  coverage, stage tether, attribution, caveat and the image/text relationship.
  Regenerate `reference/cheatsheets.md` with `pnpm gen:cheatsheets`.
- Apply humanizer to new prose; run focused checks and the completed-branch web
  gate once, then focused image/theme/width/keyboard checks and one independent
  final content/page review. Static data through unchanged components may retain
  the D-99 development-console exception; new interaction/shared behavior cannot.

Main coordination/review remains recommended **gpt-6-astra / low**. No broad
Maintenance sheet, dependency-command card, new controls, AI panel or live
maintenance actions are included. Update task/tracker/KICKOFF with the real
implementation commit, results and limits; **24/29** references remains a forecast
until registration and implementation are complete.

Stage 17 integration needs separate user approval and remains pending. W-6
implementation does not imply that approval. Main promotion belongs to the user.
Stage 18, five language placeholders and W-6.4 remain separate. Preserve any
existing dev server and verify ownership before server operations.
