# Stage 10 chapter coverage

The canonical prose is [Documentation](10-documentation.md). The interactive stage
is hand-ported into `web/src/features/documentation/`; it does not read that
Markdown at runtime. This duplication is deliberate. The coverage guard parses
chapter headings outside code fences, and render tests check the facts readers
actually see.

The twelve rows follow the approved [port
spec](superpowers/specs/2026-10-20-stage-10-interactive-port-design.md).
`steps.ts` declares their IDs and heading coverage. Paths below are relative to
`web/src/features/documentation/`. Test names describe the claim they guard. Live
observations and verification status are recorded below the table when available.

| Chapter heading / required material | Implementation | Panel ID | Public interaction | Proving test / observation |
| --- | --- | --- | --- | --- |
| Entry criteria; Choose the document for the reader’s task; Artifacts | `LookupPanels.tsx`, `LookupInspector.tsx`, `lookups.ts` | `choose` | Four reader needs select a form and Workshop example; seven artifact disclosures explain their cost. Curated changelog and audience-specific releases have separate source links. | `LookupPanels.test.tsx`: every selector reveals its actual row; artifact choices remain optional and release material distinguishes audiences. |
| Keep the README usable; README artifact | `DocumentPanels.tsx`, `DocumentExample.tsx`, `documents.ts` | `readme` | Inspect/copy the outline with explicit unknown facts; reveal the fresh-clone check and purpose-specific stage links. | `DocumentPanels.test.tsx`: README unknown setup facts remain visible and copying returns the same outline. |
| Record decisions and supersede them visibly; ADR artifact | `DocumentPanels.tsx`, `DocumentExample.tsx`, `documents.ts` | `decisions` | Select ADR 004, ADR 005 or the blank template; counterpart buttons change the specimen; expand format/status. | `DocumentPanels.test.tsx`: the old rendered ADR keeps its dated current supersession notice and original acceptance; blank template requires project facts. `e2e/documentation.spec.ts`: counterpart controls expose actual old/new regions. |
| Keep architecture and contract references current; architecture/reference artifacts | `LookupPanels.tsx`, `LookupInspector.tsx`, `lookups.ts` | `reference` | Read the scoped Attendee / Workshop app / Booking store relationship drawing; select setting or response facts. | `LookupPanels.test.tsx`: unset setting and omitted optional response stay distinct; injected row data reaches rendered details. |
| Write comments for non-obvious reasons; comment artifact | `PracticePanels.tsx`, `DecisionDrill.tsx`, `practice.ts` | `comments` | Commit answers for external constraint, deliberate deviation, tricky logic and known limitation; inspect wrong/right rationale, score, navigation and reset. | `DecisionDrill.test.tsx`: every authored case reveals reasoning after a wrong choice; reset clears draft/verdict and scores remain independent. `e2e/documentation.spec.ts`: native keyboard wrong answer retains rationale after leaving the panel. |
| Update and verify documentation with the change | `LookupPanels.tsx`, `LookupInspector.tsx`, `lookups.ts` | `changes` | Select all six source / affected documents / explicit check / owner-trigger chains; reveal invoked-validator and automation limits. | `LookupPanels.test.tsx`: six change chains require actual enforcement/source checks; all row selectors display their data. |
| Choose what to omit or archive; Commit messages preserve change context | `LookupPanels.tsx`, `LookupInspector.tsx`, `lookups.ts` | `history` | Select historical record versus current instructions; reveal commit context and Stage 05 `#commits` link. | `LookupPanels.test.tsx`: history distinguishes preservation from current instructions and points to actual commit guidance. |
| AI in documentation | `PracticePanels.tsx`, `DecisionDrill.tsx`, `practice.ts` | `ai` | Classify Read, Compile and Execute evidence; reveal grounded drafting, human review, privacy and execution limits. | `DecisionDrill.test.tsx`: evidence levels remain distinct; AI drafting needs source, reviewer and privacy checks beyond a score. |
| Update and verify documentation with the change, applied synthesis | `RecordPanels.tsx`, `DocumentationSession.tsx`, `record.ts` | `your-change` | Fill change/scope, reader/task, affected documents/action and source/revision; export or confirm clearing the whole record. | `RecordPanels.test.tsx`: all eight literal fields survive views and export only the personal record; failed storage still permits a cross-panel manual export. |
| Update and verify documentation with the change, applied synthesis | `RecordPanels.tsx`, `DocumentationSession.tsx`, `record.ts` | `your-evidence` | Fill check/expected result, observed evidence/limits, owner/reviewer and review trigger; whole-record export/clear. | `DocumentationSession.test.tsx`: hydration, read/write denial, recovery, subscriptions, cancellation and failed whole-record clearing. `e2e/documentation.spec.ts`: actual history/reload persistence and denied-storage draft. |
| Definition of done; Scaling to a team | `RecordPanels.tsx`, `record.ts` | `checklist` | Seven per-change and three periodic native checkboxes; self-recorded status; expand five team notes; export/clear the shared record. | `RecordPanels.test.tsx`: ten checks stay in their cadence groups and a periodic-only record exports from the other view. `e2e/documentation.spec.ts`: checked state survives reload. |
| All eight Traps | `closing.tsx` | `traps` | Independently reveal: waits-until-end; why-only rule; mandatory templates; lost history; assumed generation correctness; copied infrastructure/test claims; private data; unvalidated drafts. Every row names the correction. | `Documentation.test.tsx`: all eight traps reveal corrective action; five curated references add distinct sources. `coverage.test.ts`: every canonical section maps to a real panel. |

The research appendix and future W-6 companion satisfy none of these rows. W-6,
publication, W-6.4, five language sheets, stages 17/18, unrelated repairs,
integration and deployment remain deferred.


## Observed browser coverage

The expanded-state audit on 2026-10-22 measured 1,358 states: every panel above at
320,390,768,1024,1440,1920 and 2560px, in both themes. It visited all lookup
selections, three ADR specimens, every wrong/right practice verdict, every
disclosure, team notes, filled forms, checked boxes, clipboard success and manual
fallbacks, and read/write/clear warnings. There were no overflow, contrast,
touch-target or page-console findings. The 157 distinct measured
text/background/style pairs had a minimum ratio of 5.06:1. The 784 recorded
keyboard/disclosure observations had no missing opens, incorrect selections or
focus-outline findings.

At 1024×768 the largest initial panel was the checklist: 1,344.48px, or 1.75
screens. The largest expanded material state was its manual export: 1,927.11px, or
2.51 screens. The approved twelve panels clear D-52 without a split. The evidence
distinguishes these initial and expanded measurements.

All nine curated/inline source URLs opened to their expected primary pages. Stage
03/04/05/06/13/14/16 destinations rendered the expected route and visible panel. A
click from History's Stage 05 link landed on `#commits` and rendered
`panel-commits`.

The [execution report](superpowers/reports/2026-10-20-stage-10-port-execution.md)
records the gate, measurements, findings and archive location. The final gate
passed: 1,558 tests across 218 files, 27/27 production checks and the separate
development-console sweep. Independent readers/review remain pending. This feature
tree has 16 ready stages out of 18; develop remains 15/18 until an approved merge.
W-6 remains 22 drawn / 27 registered.
