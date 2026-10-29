# Kickoff: Stage 17 AI Plays correction reviewed; integration pending

Updated 2026-10-29. Follow [AGENTS.md](AGENTS.md), D-99 and D-100.
Coordinator review found a missing D-35 requirement after the original six-panel
completion. This correction follows the checklist committed as **345c972**.

## Current state

- Branch `feat/maintenance-page`, correction starting commit **345c972**.
  App/chapter correction **01b8dc2**; test-only selector correction **28d4410**.
  Use `git log -1 --oneline` for the latest records tip.
- [Chapter](docs/17-maintenance.md) now has `### AI in maintenance`. The page has
  the six original lookups plus the dedicated seventh **AI Plays** step at `#ai`,
  before the closing review record. Existing panel hashes are unchanged.
- Four plays compare versioned migration guidance, summarize dependency/lockfile
  changes, organize evidenced findings and draft checks/records. Each separates
  supplied input, the request and human verification. Privacy, evidence and
  operational authorization limits stay visible outside the disclosures.
- The [single source record](reference/stage-17-source-research.md) documents this
  hand-port. No live maintenance action or new provider guarantee is included.
- Feature branch **17/18** interactive; local develop **4f965e8** remains **16/18**,
  W-6 **23/28**. No merge, push or production promotion.

## Verification

On **28d4410** (app unchanged from **01b8dc2**): format/lint, generated-route
typecheck, **1,573 tests / 220 files** and **53-page build** pass. The guard first
failed on missing ready-stage coverage, then the chapter heading; rail/render tests
failed on the missing AI step before the fix. A later render selector matched both
a play and the visible limits; scoping it to the opened play fixed the test.

Six production AI-panel cases cover light/dark at 320/768/1440px, all four plays
opened/closed with Enter, Supply/Ask/Verify output, zero overflow and clean console.
Arrow navigation reaches the closing record; Back/reload restores `#ai`.
Humanizer pass and scoped independent content/page review PASS with no findings.
The full production audit passes **27/27** in one run with one worker and unchanged
assertions/timeouts. Development-console **1/1** passes with no React warnings;
the temporary config reuses the verified existing 3200 server. Commands and limits
are in the latest tracker completion row. These are fresh correction checks;
later records-only edits retain them for the unchanged application tree.

Earlier **ebcb0ba** six-panel checks and review remain historical evidence in
[tracker](docs/tracker.md); they did not establish D-35 completeness. They do not
verify this addition. The existing **3200** dev server is preserved. The owned
**3100** production preview was stopped after the audit.

## Coordinator review (2026-10-29)

The coordinator read the implementation thread and reviewed **345c972..98688ec**
against the correction checklist, chapter/page consistency and regression coverage.
No actionable findings in this scoped correction review; the original six-panel
implementation was not re-reviewed in full. Fresh checks at **98688ec**:
`pnpm test src/features/maintenance/Maintenance.test.tsx src/lib/stage-metadata.test.ts src/lib/tracker-ledger.test.ts --maxWorkers=1`,
**48/48 across three files**, exit 0. Raw full-test/build/production/dev-console
logs were checked; `git diff --exit-code 28d4410 HEAD -- web docs/17-maintenance.md`
confirmed identical application/chapter inputs. Retain the identified full gate
above; no full-suite/build/browser rerun was needed. Later edits here are records only.

## Next task and session

**Task:** user integration decision for the corrected Maintenance branch.
**Recommended model:** `gpt-6-astra`, **reasoning:** `low`, in the main coordinator.
The AI Plays correction is complete; no further implementation task is identified.

Implementation recommendation was **gpt-6.1-sol / high**. The user explicitly chose
continuation of session **01a1850c-d865-7d02-a3c0-23916ced0f66** for this correction.
The runtime does not report the active implementation model.

The implementation thread and actual correction diff have now been reviewed by
the coordinator as recorded above. Further application edits require the relevant
checks and review of their new diff.

Integration into develop needs separate user approval; main is the user's. W-6
Maintenance companion assessment, Stage 18, five language placeholders and W-6.4
remain separate tasks. See task **W-3.18** and tracker **Current phase / Next up**.
