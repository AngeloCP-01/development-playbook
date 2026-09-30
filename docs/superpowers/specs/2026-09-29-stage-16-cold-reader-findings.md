# Stage 16 — initial cold-reader findings

Date: 2026-09-29. Baseline: `docs/16-incident-management.md` at `91a6838`.
Two independent readers read only that document: no linked stages, external sources,
existing reviews or conversation history. Neither edited files. This is an assessment
record, not an approved design spec. The original stage is unchanged.

## Repeatable instruments

### Completeness scenario

Reuse this scenario verbatim after repairs:

> Parcel, a two-developer Node/Express parcel-label API on AWS ECS with Postgres
> and a background worker calling a carrier API. At 09:00 label jobs stall and
> customers retry; web health stays green. No deploy today. At 09:08 carrier
> status shows degradation; one developer is unreachable. At 09:20 the carrier
> recovers but the backlog remains and duplicate-label outcomes are uncertain.

Task: produce first-response actions, severity and escalation decisions, incident
updates, a service-specific runbook skeleton, recovery criteria, and postmortem
actions. Mark unsupplied facts unknown; do not invent operational details.

The reader produced provisional Major severity, customer updates at 09:00, 09:08
and 09:20, and a partial runbook. It correctly left the incident open at 09:20.
Carrier degradation remained a hypothesis, not a proven cause. Safe mitigation,
backlog handling, duplicate reconciliation and unavailable-responder escalation
could not be derived from the document. Exact contacts, commands, impact counts,
owners and deadlines were left unknown.

### Consultability questions

The second reader predicted locations from headings before reading the body.
Reuse these questions verbatim:

1. The worker is failing but the homepage is healthy; how do I confirm customer impact?
2. My only teammate is unavailable; when and how do I escalate?
3. A provider recovered but queued jobs remain; when can I declare recovery?
4. What do I tell customers when I do not know the cause or recovery time?
5. A credential may be compromised; should I restore service or contain access first?

| Question | Predicted location | Result |
|---|---|---|
| 1 | First five minutes; Diagnosing | HIT, partial: impact guidance exists but centers on the site and defers diagnosis |
| 2 | The runbook / Escalation | HIT, partial: contacts exist, executable escalation does not |
| 3 | The order that matters; Definition of done | MISS: no recovery decision rule |
| 4 | First five minutes; Writing it down | HIT: impact, response underway and next update are a usable minimum |
| 5 | The order that matters | MISS: containment exception absent |

Result: 3/5 locations contain relevant guidance, but two of those answers are
partial. This is not a 3/5 completeness score. Raw heading extraction also found
headings inside fenced templates; these were excluded as document sections.

## Consolidated findings

All findings predate this preparation branch. IDs below consolidate the readers'
separate numbering. Blocking means the issue needs resolution before the port.

| ID | Severity | Evidence by heading | Assessment |
|---|---|---|---|
| I1 | Important (blocking) | Opening; First five minutes | Security breach is Critical, yet restore-first is unconditional. Add a containment/evidence-preservation boundary without turning the stage into a forensic manual. Found by consultability reader. |
| I2 | Important (blocking) | The order that matters; Diagnosing; Traps | Diagnosis is deferred until restoration, but third-party status must be checked first. Distinguish investigation needed to choose mitigation from later causal analysis. Both readers found this. |
| I3 | Important (blocking) | First five minutes | Homepage and external uptime checks do not establish worker/customer-path health. Both readers stalled on the Parcel example. |
| I4 | Important (blocking) | Definition of done; Diagnosing | Service restoration, permanent repair and follow-up closure are mixed. Teach application recovery checks and outstanding-work handling after a provider recovers. Both readers found this. |
| I5 | Important (blocking) | The runbook; Scaling to a team | Escalation lists contacts but no trigger, acknowledgment expectation or unavailable-person fallback. Both readers found this. |
| I6 | Important (blocking) | First five minutes | Fix-forward is allowed only when rollback is impossible. An available rollback can be irrelevant; the decision needs that branch. Found by completeness reader. |
| M1 | Minor | Writing it down | Sample actions omit owners and dates required by the surrounding prose. Both readers found this. |
| M2 | Minor | First five minutes | Unknown impact has no provisional severity/reassessment guidance. Found by completeness reader. |
| M3 | Minor | First five minutes; Artifacts | Body allows a status page or post; Artifacts requires a status page if users need informing. Align the minimum artifact with the teaching. Found by consultability reader. |

## Checks against overreach

The controller checked these claims against the unchanged document. The communication
guidance is not absent: it already gives impact, response underway and next-update
time. Templates would make it easier to use, rather than repair a total omission.

Exact ECS commands and carrier retry semantics are service-specific. Their absence
alone is not a defect. I4 asks for a recovery decision framework, not an invented
generic replay command. The linked verification stage may supply more detail;
neither reader followed it, so this assessment makes no claim about its adequacy.

Independent preparation finding: the stage has no `AI in incident management`
section, required by the shared stage checklist. This was found by the controller,
not the blind readers.

## Source intake

Six article/page URLs and eight local images are inventoried in
`reference/cheatsheet-sources.md` under the September 29 stage 16 round. The clearer
NovelVista image is readable. Its delayed communication placement, premature
resolved label, and contradictory health summary require adaptation. No image is
published or selected as the W-6 plate.

## Recommended scope for discussion

Repair the document before porting: first response, bounded investigation, mitigation
choice, security exception, escalation, recovery/closure, usable examples and the AI
section. Preserve the solo/small-team audience and existing cross-stage boundaries.
Use one incident carried through the examples so updates and closure agree with the
same evidence. Rerun both instruments before declaring the document ready.

Alternatives: a minimal wording patch would leave the runbook and recovery gaps;
a full enterprise response manual would add roles and policy beyond this audience.

Deferred: production edits and tests until the design/plan workflow, interactive
panel design, W-6 implementation, unverified image provenance, full forensic response,
and organization-specific response-time promises. No merge or deployment occurred.

## Reassessment, 2026-09-30

The original Parcel completeness and five-question lookup instruments were rerun
against the repaired document by fresh readers restricted to that document. The first
lookup found a missing security response route in the reusable runbook. Task 5a added
the procedure location, responsible contact and fallback field, then both instruments
were repeated on the corrected document. The four raw reader reports are preserved
verbatim in [the cold-reader appendix](../plans/2026-09-29-stage-16-cold-reader-raw.md).
The final lookup scored **5 HIT, 0 MISFILED, 0 MISS**. The final Parcel reader found
no contradiction in the chapter; its inability to perform a safe replay or declare
recovery from the supplied scenario reflects missing Parcel-specific facts.

| ID | Disposition | Evidence heading | Reviewer rationale |
|---|---|---|---|
| I1 | Closed | The order that matters; When access may be compromised; Prepare and rehearse the runbook | Suspected compromise now routes to containment, trusted access and escalation before reopening. Task 5a made the route a field in the reusable runbook; final lookup found the answer under the predicted heading. |
| I2 | Closed | The order that matters; Choose a mitigation; Diagnose with evidence | The document permits the bounded checks needed to choose a safe action while separating later causal work. Parcel reader treated carrier status as a hypothesis, not proof. |
| I3 | Closed | First response: confirm impact and severity | Both final readers used worker completion, pending age and customer outcomes despite green web health. |
| I4 | Closed | Verify recovery and account for delayed work; Definition of done | Both readers kept Parcel open at carrier recovery, required uncertain-outcome reconciliation and an observation window, and separated service recovery from follow-up closure. |
| I5 | Closed | Escalate when help is unavailable; Prepare and rehearse the runbook | Final readers retained ownership with the reachable responder and used a pre-agreed deadline, backup and fallback. Parcel's actual contacts and deadline remain service-specific unknowns. |
| I6 | Closed | Choose a mitigation | The table conditions rollback on relevance and compatibility. The Parcel reader did not infer that no deploy today proved a cause or justified rollback. |
| M1 | Closed | Write the postmortem and track follow-up | The Nudge action table has named owners, dates and completion evidence. The corrected postmortem distinguishes reconciled records from a pending aggregate count. |
| M2 | Closed | First response: confirm impact and severity | Both readers selected provisional Major for blocked label creation and described reassessment as impact becomes known. |
| M3 | Closed | Communicate while the incident is open; Definition of done | An accessible existing channel can carry updates. Neither final reader treated a new status site as required. |

This disposition combines the content tests with the two final blind readings; a
passing structure test alone did not close any finding. The first lookup's incident
record template suggestion remains a minor usability idea: the record's contents are
taught across the chapter, and no response blocker was demonstrated. The final lookup
flagged one new **Minor** precision issue: Definition of done says affected users
“received” the recovery update, while the communication section permits publishing
through a status page or support notice. Final whole-branch review will decide the
wording. The original findings and their severity remain above unchanged.
