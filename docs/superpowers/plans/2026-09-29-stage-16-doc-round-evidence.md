# Stage 16 document repair — Task 1 evidence

Date: 2026-09-29
Task: Make first response conditional and safe
Status: Implemented; awaiting controller's independent review.

## Scope

Changed the opening response guidance in `docs/16-incident-management.md`: first response now confirms customer impact and provisional severity; mitigation choices state preconditions, harms, stop conditions and checks; rollback requires relevance and schema compatibility; suspected compromise has a containment and escalation path. The opening quote and stage 16 blurb now read “Limit harm first. Verify recovery. Learn from what happened.” Stage title, cadence, group, timing and `ready: false` remain unchanged.

Added `web/src/lib/stage-16-structure.test.ts` to guard these prose contracts using the specified fence-aware section helper. Added the summary blurb contract in `web/src/lib/stages.test.ts`.

## Test evidence

RED, prose contracts, before document edit: `pnpm test --project unit src/lib/stage-16-structure.test.ts` failed with 4 failed / 1 passed. The missing first response, mitigation and compromise sections failed by assertion; the existing order section lacked the safe-mitigation instruction. The section helper test passed, so this was a content failure rather than syntax/import trouble.

RED, summary metadata, before changing `stages.ts`: `pnpm test --project unit src/lib/stages.test.ts` failed only the new stage 16 blurb test (1 failed / 13 passed), with the expected old blurb received.

GREEN after prose edit: `pnpm test --project unit src/lib/stage-16-structure.test.ts` — 1 file passed, 5 tests passed.

GREEN after metadata edit: `pnpm test --project unit src/lib/stages.test.ts` — 1 file passed, 14 tests passed.

Final restored verification repeated both focused commands: 5/5 and 14/14 passed. Full suite intentionally not run; baseline was 1351/179 passes and the controller requested focused suites only for this task.

## Teeth checks

- Mutated the rollback row from `schema compatibility checked` to `schema unexamined`. The structure test file reported exactly 1 failed / 4 passed, and only I6 failed because `schema compatibility` was absent. Restored immediately.
- Removed the urgent-containment clause from the compromise section. The structure test file reported exactly 1 failed / 4 passed, and only I1 failed because `without delaying urgent containment` was absent. Restored immediately.
- Restored the old stage 16 blurb. The stages test file reported exactly 1 failed / 13 passed, only the newly added blurb contract. Restored immediately.

Full terminal output and the raw failure excerpts are in `.superpowers/sdd/2026-09-29-stage-16-doc-round/task-1-report.md`.

## Review and deferred work

The user-directed controller will perform the independent read-only review after this immutable task commit. The later existing document sections remain for their owning tasks; in particular, the old Traps section still calls rollback the correct first move. That contradiction is outside Task 1's replacement boundary and must be reconciled by its owner before the document round is complete.

Deferred: escalation contacts and communication examples; diagnosis guidance; recovery and delayed-work criteria; runbook, worked incident and postmortem; AI section; remaining finding IDs and whole-document assessment. No interactive port, generated imagery, or stage readiness change.
