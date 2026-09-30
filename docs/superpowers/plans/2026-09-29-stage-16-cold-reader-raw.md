# Stage 16 cold-reader raw reports

These four reports are copied verbatim from the read-only reader returns. Section labels and horizontal rules separate the copies.

---

## Initial completeness rerun, before Task 5a

Source: [docs/16-incident-management.md](/Users/angelito/personal/Development-Playbook/docs/16-incident-management.md). The actions and messages below are drafts, not claims that they occurred. Times use the scenario’s clock; its timezone is unknown.

**First response and decisions**

- **09:00 — Declare a provisional Major incident.** Label creation is important customer work and appears blocked. The available developer acts as incident commander, opens one restricted incident record, and records the first observed stall, customer retries, responder, and unknown impact count. Check completion records, oldest pending jobs, failures, and customer reports. Green web health does not establish worker health. Avoid a test that could create another label. (“First response: confirm impact and severity”)
- **Investigate safely.** Compare worker and database evidence with carrier results, first error timestamps, recent changes, and provider status. “The carrier accepted a label but its acknowledgment was lost” is a hypothesis to test, not a conclusion. No deploy today makes rollback less likely to help, but does not establish the cause. (“Diagnose with evidence”; “Choose a mitigation”)
- **09:08 — Escalate.** Record the carrier’s degradation notice as supporting evidence, not proof of causation. Contact the unreachable developer according to Parcel’s agreed acknowledgment deadline; that deadline and fallback route are unknown. Escalate immediately if harm is growing, and use the recorded provider or specialist route if the backup is unavailable. The available developer retains ownership until someone explicitly accepts handoff. (“Escalate when help is unavailable”)
- **Limit harm without guessing at controls.** Do not restart, scale, replay, or resend uncertain jobs blindly. A dispatch pause or admission control is appropriate only if Parcel has a tested control that preserves accepted work and its effects are understood. Hold uncertain outcomes for reconciliation; record each action, operator, time, stop condition, and observed effect. (“Choose a mitigation”)
- **09:20 — Keep the incident open.** Carrier recovery does not clear Parcel’s backlog or establish which labels were created. Compare each uncertain job with an authoritative carrier result or another reliable record. Hold items whose outcome cannot be established. Resume only work confirmed eligible and safe to send, using Parcel’s verified procedure. (“Verify recovery and account for delayed work”)

**Customer update drafts** — A human must verify facts and review each message before sending. Use an existing channel reachable during the outage; set the next update time from Parcel’s actual commitment.

> **Investigating:** Label creation is delayed, and some customers may have retried. We are checking job completion and carrier results. The affected count, cause, and recovery time are unknown. Next update: **[committed time]**.

> **09:08 update:** The carrier reports degradation. We are checking whether it affects Parcel’s stalled label jobs and are holding uncertain outcomes from repeat processing until we can establish their status. The affected count and recovery time remain unknown. Next update: **[committed time]**.

> **09:20 update:** The carrier reports recovery, but Parcel still has delayed label jobs. We are reconciling uncertain label outcomes before processing the backlog. We cannot yet give a recovery time. Next update: **[committed time]**.

> **Resolution template, only after verification:** Label creation is operating normally through **[documented observation window]**. **[Affected job count and dispositions]** have been accounted for; **[any remaining limitations and customer action]**. Our investigation and follow-up remain open.

**Parcel runbook skeleton**

```markdown
# Parcel label creation and background dispatch

Service and customer operation: Node/Express label API on AWS ECS;
Postgres-backed/background label work calling a carrier API.
Owner / backup / acknowledgment deadline / fallback support route:
[Names, deadline, and route unknown; fill and agree before rehearsal.]
Last rehearsed / next review: [Unknown.]
Independent document location and trusted access: [Unknown.]
Evidence locations and safe impact check:
[Worker completion records, oldest pending age, failures, customer reports,
carrier results, and provider status; actual links and safe queries unknown.]
Action prerequisites and operator procedure:
[Document tested dispatch/admission controls, their effect on accepted jobs,
and how to record operator, time, expected result, and observed result.]
Stop conditions and reversal limits:
[Hold work if carrier lookup is unavailable or inconclusive, unexpected side
effects appear, or dependency errors rise; exact controls unknown.]
Queued work and uncertain external side effects:
[Define stable job/operation identifier if available, authoritative carrier
lookup or reliable alternative, reconciliation, and reviewed hold procedure.
Do not assume Parcel has Nudge's example-specific capabilities.]
Recovery checks and observation window with rationale:
[Baseline error rate and latency; real label outcomes; oldest pending age,
completion rate, failures, and every affected job's disposition. Window unknown.]
Customer channel, update commitment, and incident record: [Unknown.]
Receiving owner and handoff acceptance: [Explicit acceptance of impact,
unknowns, and next action required.]
```

**Recovery and postmortem**

Service recovery requires verified label outcomes against Parcel’s agreed baseline, an accounted-for backlog and uncertain side effects, a documented observation window long enough to see normal work finish, disclosure of any remaining limitation, and a customer recovery update. None is established by the 09:20 carrier notice. (“Verify recovery and account for delayed work”; “Definition of done”)

Start a Major-incident postmortem while evidence is fresh, ideally the next working day. Record the 09:00–recovery impact interval when verified, customer and job counts when known, one consistent timeline, competing causal explanations, the green-health detection gap, the unavailable responder and escalation path, and the reconciliation outcome. Assign named owners, dates, and completion checks for a worker completion-age alert, a tested uncertain-outcome reconciliation procedure, escalation coverage, and runbook rehearsal. Keep provider cause and any other unanswered question open with an owner; service recovery and follow-up closure are separate. (“Write the postmortem and track follow-up”; “Definition of done”)

**Findings and boundaries**

| Severity | Exact document heading | Finding |
|---|---|---|
| **Blocking for safe replay** | “Verify recovery and account for delayed work” | Parcel’s stable operation IDs, authoritative carrier lookup, and reliable alternative records are unknown. The Nudge example grants these capabilities only to Nudge. Uncertain labels must remain held for reviewed reconciliation. |
| **Blocking for a concrete mitigation** | “Choose a mitigation”; “Prepare and rehearse the runbook” | No tested Parcel pause, admission control, replay procedure, or stop/reversal procedure is supplied. The chapter explicitly does not provide universal queue or database commands. |
| **Important** | “Escalate when help is unavailable” | Primary/backup roles, acknowledgment deadline, and fallback support route are unknown. One unreachable developer cannot be treated as a completed handoff or a staffed coverage plan. |
| **Important** | “Verify recovery and account for delayed work” | Parcel’s baseline, acceptable backlog age, per-record disposition rule, and observation-window length are unknown; a resolved announcement needs these checks. |
| **Important** | “Communicate while the incident is open” | The reachable customer channel and promised update cadence are unknown. Draft messages need a real committed time and human review under “AI in incident management.” |
| **Boundary, no contradiction found** | “First response: confirm impact and severity”; “Choose a mitigation” | Provisional **Major** fits blocked label work. Escalate to **Critical** if evidence reveals widespread outage, credible compromise, data loss, or comparable serious harm. Carrier degradation and the absence of a deploy do not prove cause or justify rollback. |

**Clarification on the labelled blockers**

These are service-specific unknowns deliberately left to Parcel’s runbook and live incident evidence, not defects in the stage document. The document explicitly identifies Nudge’s lookup and dispatch controls as example-specific, supplies a reusable runbook skeleton, and says it does not invent universal operational commands. “Blocking” describes limits on what a Parcel responder could safely do from the given facts; it does not mean the chapter failed to specify a universal procedure.

---

## Initial consultability rerun, before Task 5a

# Stage 16 blind lookup review

Source read: `docs/16-incident-management.md` only. Headings were extracted outside code fences before the body was read. No linked stages or other sources were used.

## Heading-only predictions

1. Worker failing while homepage is healthy: “First response: confirm impact and severity.”
2. Only teammate unavailable: “Escalate when help is unavailable.”
3. Provider recovered but queued jobs remain: “Verify recovery and account for delayed work.”
4. Cause and recovery time unknown: “Communicate while the incident is open.”
5. Credential may be compromised: “When access may be compromised,” with priority framed by “The order that matters.”

## Lookup scores

| Question | Placement | Answer completeness | Evidence |
|---|---|---|---|
| Worker fails, homepage healthy | HIT | Complete | “First response” says a healthy homepage does not prove worker completion; inspect completion records, oldest pending work, and customer reports, using a safe check (lines 27–32). |
| Only teammate unavailable | HIT | Complete | “Escalate” specifies a pre-agreed acknowledgment deadline, backup, provider or specialist fallback, and retained ownership until explicit handoff (lines 90–108). |
| Provider recovered, jobs queued | HIT | Complete | “Verify recovery” requires actual operation outcomes, queue age and completion rate, reconciliation of uncertain effects, disposition of affected records, and a justified observation window (lines 159–182). |
| Cause and recovery time unknown | HIT | Complete | “Communicate” requires observed impact, action, unknowns, and next update time; the Nudge messages demonstrate updates without inventing a recovery estimate (lines 110–137). |
| Credential may be compromised | HIT | Complete on priority | “The order that matters” says availability may not be the first safe action (lines 19–25). “When access may be compromised” directs containment, escalation, and access review before reopening; rollback alone does not revoke a leaked credential (lines 75–87). |

No answer was misfiled or missed. The question-specific answers are complete at the level of a generic incident-management chapter.

## Junior developer and small-team fit

The chapter defines incident commander, postmortem, and runbook; provides mitigation preconditions, possible harm, stop conditions, and effect checks; and follows one worker incident through customer updates, recovery, postmortem, and a worked runbook. It explicitly handles a sole responder, an unavailable backup, a provider fallback, update reminders, and ownership until a receiving responder accepts handoff. The Nudge deadlines are labeled local examples rather than universal targets.

Some service-specific terms and decisions remain for the reader to fill in, including baselines, recovery thresholds, observation windows, and the trusted procedure for a security event. The runbook skeleton asks for these operational details. No substantive contradiction was found in the Nudge chronology or its recovery criteria: the provider reports recovery at 10:25, affected work is accounted for by 10:30, and normal dispatch is observed through 10:40 before resolution.

## Defects and untaught requirements

- The compromise path presumes a “service's security response procedure” and a responsible security contact (lines 77–86), but the reusable runbook skeleton (lines 279–294), Artifacts (lines 323–328), and Definition of done (lines 332–348) do not explicitly require recording that procedure's location or contact. A small team could follow the chapter's preparation checklist and still lack a usable path for its most urgent branch.
- The incident record is a required artifact (line 326). Its contents are taught across first response, mitigation, escalation, communication, and diagnosis, but they are not gathered into a minimal template. This is a smaller usability gap for a junior responder.

The other artifact and Definition of done requirements are substantially taught: the rehearsed runbook has a worked example and skeleton; customer communication has a format and examples; the major or critical postmortem has a worked record; follow-up actions have owners, due dates, and completion evidence; and service recovery is separated from follow-up closure.

## Scope boundaries, not defects

Service-specific commands, thresholds, actual contacts, provider capabilities, forensic work, and notification obligations belong to the local runbook or security response process. The chapter explicitly avoids claiming universal commands or deadlines. These omissions do not make the five lookup answers incomplete.

---

## Final completeness rerun, after Task 5a

# Stage 16 blind incident exercise: Parcel label jobs

Source boundary: **only** `docs/16-incident-management.md`. Parcel facts below come from the scenario. This is a decision framework and draft incident record, not an executable production procedure. No Parcel metrics, logs, queue controls, carrier operation lookup, contacts, or agreed recovery thresholds were supplied.

## Verdict

The chapter gives a coherent response for this case: declare provisionally **Major** because important customer work is blocked; keep a sole responder in command; limit new harm using only a proven safe control; reconcile uncertain carrier outcomes before any replay; and leave the incident open after 09:20 until the backlog, duplicate risk, and actual customer operation are verified. It does not supply the service-specific facts needed to execute a safe pause, decide which jobs to retry, or declare Parcel recovered. Those are explicit runbook and evidence gaps, not contradictions in the chapter.

## First response and decision record

| When | Observed or given | Action and decision | Must remain unknown until checked |
|---|---|---|---|
| 09:00 | Label jobs stall; customers retry; web health is green; no deploy today. | Declare incident and assign the reachable developer incident command, technical response, and customer updates. Open one restricted record and timeline. Confirm the affected operation through existing job completion records, oldest pending age, failures, and customer reports. Establish first affected timestamp, affected jobs/customers, queue inflow/outflow, and whether requests are being accepted. Do not create another label to test a suspected failure. Check recent changes beyond deployments and dependency status. | Exact impact start, number affected, whether carrier accepted any timed-out requests, whether customer retries create new label operations, whether work is being lost, and the cause. Green web health does not answer these. |
| 09:08 | Carrier status reports degradation; one developer is unreachable. | Record status as evidence supporting a carrier hypothesis, not proof of Parcel's cause or the affected region/operation. The reachable developer retains ownership. Use the **pre-agreed** backup acknowledgment deadline and fallback provider/specialist route if they exist; escalate immediately if harm increases or specialist help is needed. Send impact, provisional severity, record link, actions/results and specific request, excluding credentials. Set a customer-update reminder. | Whether unreachable developer is the primary or backup, any acknowledgment deadline, fallback route, and whether carrier degradation explains all stalled work. |
| During degradation | Retries plus uncertain carrier outcomes create possible duplicate external side effects. | Inspect whether a tested control can hold dispatch or retries **while preserving accepted queued work**; if confirmed, use it and record operator, time, expected effect, stop condition, and observed effect. Consider admission control or a clearly advertised degraded mode only if known safe. If no control is known safe, do not invent a pause, restart, scale-up, rollback, or replay. Limit further harm through the safe controls actually available, escalate, and disclose the limitation. Preserve each uncertain operation for reconciliation. | Whether Parcel has a tested pause/admission control, stable operation IDs, carrier result lookup, idempotency guarantees, queue durability, or a safe way to reverse an action. |
| 09:20 | Carrier reports recovery; backlog remains; duplicate-label outcomes are uncertain. | Continue the incident and customer updates. Compare carrier results or another reliable authoritative record with local job and label state. Exclude confirmed successful labels from replay; resume only confirmed eligible unsent work if a safe procedure exists. Hold inconclusive jobs for reviewed reconciliation. Measure backlog age, completion rate, failures, customer-visible results, and new errors after any change. | Which requests succeeded, which are safely retryable, whether carrier is healthy for Parcel, how large the backlog is, and the recovery time. |

Working hypothesis: carrier requests may have timed out after the carrier accepted a label, leaving Parcel uncertain and perhaps retrying. Supporting evidence would be carrier operation results showing accepted labels for locally uncertain jobs; explicit carrier rejection or evidence that jobs never reached the carrier would refute that explanation for those jobs. Check local worker and queue evidence too. The carrier status report alone cannot settle causality. This follows **“Diagnose with evidence.”**

Provisional severity is **Major** under **“First response: confirm impact and severity”** because label creation, an important customer operation, is blocked or significantly degraded. Reassess toward **Critical** if evidence shows widespread outage, actual data loss or another listed critical condition, or a plausible serious harm requiring the more urgent response. Use **Minor** only if impact proves limited and there is a safe workaround. Customer retries and duplicate-label uncertainty demand urgent investigation, but the scenario does not establish their actual count, cost, or severity. No universal SEV number or response deadline can be inferred from the chapter.

## Customer and internal updates

These are **drafts for human review**. Publication time and the next-update commitments must be chosen and honored by the responder using Parcel's reachable customer channel. The example times below are possible commitments, not facts about an already-sent message or a prescribed cadence. Keep evidence links and sensitive details in the restricted incident record.

> 09:00 investigation draft — Label creation is delayed. We are checking job completion and customer impact. Our web health check remains green, but it does not verify labels. The cause, affected count and recovery time are unknown. Next update: 09:10.

> 09:08 investigation draft — Label jobs remain delayed. The carrier reports degradation; we are checking whether it explains the stalled jobs and holding uncertain outcomes where a safe control allows it. Duplicate-label outcomes and recovery time remain unknown. Next update: 09:20.

> 09:20 monitoring draft — The carrier reports recovery, but Parcel still has delayed jobs and some label outcomes are uncertain. We are reconciling those outcomes before replay and checking the backlog. Parcel is **not yet confirmed recovered**. Next update: 09:30.

> Resolution template, use only after checks pass — Label creation has returned to its agreed service level over [documented observation window]. We accounted for [affected set and dispositions], and [remaining limitation, if any] has been communicated to affected customers. We are continuing the investigation and corrective work.

Update at each promised time even with no change; a next-update time is not a recovery estimate. An earlier update may set a new next-update commitment: a published 09:08 update with a 09:20 commitment would supersede the 09:00 draft's 09:10 commitment. Internal updates should add the sole responder's name, timestamps, evidence links, help requested, and observed effect of every action. The unreachable developer cannot be treated as a completed handoff; **“Escalate when help is unavailable”** requires explicit acceptance of ownership, impact, unknowns and next action.

## Parcel runbook skeleton

Store the completed, rehearsed runbook outside Parcel and accessible during an outage. Brackets are fields to establish, not assumptions. This follows **“Prepare and rehearse the runbook.”**

```markdown
# Parcel label creation and worker recovery
Service/customer operation: Node/Express label API on AWS ECS; Postgres; background worker calls carrier API. Customer operation: obtain a valid parcel label.
Owner / backup / acknowledgment deadline / fallback support route: [names, actual coverage, deadline, carrier/AWS/specialist route; unknown]
Security response procedure / responsible contact / fallback: [unknown; use if compromise appears]
Last rehearsed / next review: [unknown]
Independent document location / trusted access: [unknown; verify reachable if Parcel is down]
Evidence: [job and label completion records, oldest pending age, worker errors, queue depth and inflow/outflow, customer reports, carrier status and per-operation results; real links and permissions unknown]

## Trigger and safe impact check
Stalled label completions, rising oldest-pending age, worker failures, or customer reports.
Read existing records and compare customer label outcomes. Green web health is supporting evidence only. Do not create or resend a label merely to test a timeout.

## Action prerequisites and procedure
[Document a tested hold/admission control that preserves accepted jobs, its exact operator steps, queue durability, effect on customer requests and reversal limits. Unknown today.]
[Document how local job IDs relate to carrier operation IDs, whether carrier offers authoritative lookup or idempotency, and the per-record reconciliation procedure. Unknown today.]
If no action is known safe, hold only what can safely be held, keep evidence, escalate and communicate the limitation. Record every action, operator, timestamp, expected/observed effect and stop condition.

## Stop conditions
Carrier result lookup absent or inconclusive; accepted work might be lost; unexpected extra labels; dependency errors rise; or a change widens impact. Stop/reverse where safe and retain uncertain records for reviewed reconciliation. Never blindly restart, scale or replay.

## Queued work and external side effects
Classify affected jobs using reliable records: confirmed successful, confirmed eligible unsent, ineligible/expired if applicable, or uncertain. Exclude successes from replay. Send only confirmed eligible unsent jobs under the tested procedure. Hold unresolved cases and disclose remaining limitations. Preserve per-record disposition and aggregate counts.

## Recovery checks
[Set Parcel's accepted success/error and latency baselines, backlog-age and completion-rate thresholds, affected-set accounting rules, and observation window with rationale. Unknown today.]
Check real completed customer labels, error rate, latency, oldest pending age, completion rate, failures and all affected dispositions. Observe stable operation through the documented window before publishing resolution.

## Escalation, communication and handoff
[Customer channel reachable during outage, next-update cadence, incident record, primary/backup acknowledgment deadline, fallback support route and security path. Unknown today.]
Current responder keeps ownership until a receiving responder explicitly accepts impact, unknowns and next action.
```

## Recovery gate and postmortem

At 09:20, carrier status alone fails **“Verify recovery and account for delayed work”** and **“Definition of done.”** Service recovery requires a service-specific observation window long enough to see normal label jobs complete; real label success, error rate and latency against Parcel's baseline; falling oldest-pending age and healthy completion rate; all affected jobs assigned defensible dispositions; uncertain carrier side effects reconciled or held with a disclosed limitation; and a recovery update to affected users. Actual thresholds, affected set, and window remain unknown. Service recovery can be declared while provider root cause or permanent fixes remain open, but not while the affected customer operation and delayed work remain unaccounted for.

For a Major incident, begin a blameless postmortem while evidence is fresh, ideally the next working day, under **“Write the postmortem and track follow-up.”** Record the customer-impact interval from evidence, the label/backlog and duplicate-outcome counts, a timestamped timeline, responder and escalation attempts, customer updates, chosen mitigations and measured effects, contributing conditions, detection gaps created by green web health, and competing causal hypotheses. Keep carrier internal cause and any count unknown until evidenced. Separate service recovery from investigation closure. Give each action an owner, due date and completion check; review overdue work.

Candidate actions, conditional on the investigation: alert on label completion age and test by withholding a completion; rehearse accepted-but-timed-out reconciliation and verify it does not produce a second label; document and test a queue-preserving dispatch hold and reversal; establish actual backup/fallback coverage; obtain and document reliable carrier result lookup or another reconciliation record; and close affected counts and carrier follow-up with attached evidence or a documented unresolved disposition. These are proposed follow-ups, not assertions that Parcel lacks all of them or that the carrier caused the incident.

## Blockers, contradictions and boundaries

| Severity | Exact stage heading | Finding and consequence |
|---|---|---|
| **Important (blocking for safe replay)** | **“Choose a mitigation”**; **“Verify recovery and account for delayed work”** | The scenario gives no tested queue-preserving hold, rollback-safe control, or carrier result/reconciliation method. The chapter explicitly forbids blind restart, scaling and replay; uncertain outcomes must remain held until a reliable determination or reviewed reconciliation. |
| **Important (blocking for a recovered declaration)** | **“Verify recovery and account for delayed work”**; **“Definition of done”** | Parcel's affected-set dispositions, baseline, thresholds and justified observation window are unknown. The 09:20 carrier-green signal and healthy web check cannot prove customer recovery. |
| **Important (response readiness gap)** | **“Escalate when help is unavailable”**; **“Prepare and rehearse the runbook”** | One developer is unreachable, but the primary/backup order, acknowledgment deadline, fallback route, coverage agreement and independently accessible runbook are unknown. The reachable responder must retain ownership and escalate as harm requires; no deadline or contact can be invented. |
| **Minor (communication detail to decide now)** | **“Communicate while the incident is open”** | The reachable customer channel and feasible next-update cadence are unspecified. Draft updates must be human-reviewed and the chosen commitment honored even if nothing changes. |
| **No contradiction found** | **“The order that matters”**; **“Choose a mitigation”**; **“Verify recovery and account for delayed work”** | Limiting harm first is consistent with holding ambiguous label outcomes and keeping the incident open after carrier recovery. The text deliberately conditions operational steps on service-specific evidence rather than offering universal commands. |

Boundary: The chapter points to other stages for platform rollback, observability and operation verification; those linked materials were outside this exercise and were not read. It also refers to a service security procedure, but the scenario provides no sign of compromise. No rollback is justified solely by this incident because no deploy happened today and no relevant recent change is established. The chapter provides no Parcel-specific AWS ECS, Postgres, carrier, or queue command. AI may draft and compare evidence, but **“AI in incident management”** requires human review before changing production or sending customer updates, and neither an assistant nor this report has live service access.

---

## Final consultability rerun, after Task 5a

# Stage 16 blind lookup report

## Heading-only predictions (recorded before reading the body)

1. Worker failing, homepage healthy, confirm customer impact → **First response: confirm impact and severity**. Secondary: **Diagnose with evidence** for the checks to run.
2. Only teammate unavailable, escalation timing and path → **Escalate when help is unavailable**.
3. Provider recovered, jobs queued, recovery declaration → **Verify recovery and account for delayed work**.
4. Unknown cause and recovery time, customer message → **Communicate while the incident is open**.
5. Possible credential compromise, restore versus contain → **When access may be compromised**. Secondary: **The order that matters** and **Choose a mitigation**.

Each prediction is based only on the headings outside code fences. Lookup placement and answer completeness will be scored separately after reading the document.

## Lookup results

**Scoring:** HIT = the predicted heading contains the operative answer; MISFILED = the operative answer is elsewhere; MISS = no usable answer. Completeness is a separate judgment about whether the answer can be used without an unstated decision or capability.

| Question | Placement | Answer completeness | Evidence |
|---|---|---|---|
| Worker failing, homepage healthy | **HIT** | **Complete as a decision method; service data must exist.** Check the affected customer operation, completion records, oldest pending work and customer reports without creating duplicate side effects; record impact start and unknowns. | **First response: confirm impact and severity**, lines 29–37. **Verify recovery and account for delayed work**, lines 161–165, adds completion rate, failures and affected-record disposition. |
| Sole teammate unavailable | **HIT** | **Complete if the team has made the prior agreement.** Use the agreed acknowledgment deadline, then backup, then recorded provider/specialist route; escalate immediately for growing harm; current responder retains ownership until explicit acceptance. | **Escalate when help is unavailable**, lines 92–108. The **Prepare and rehearse the runbook** example, lines 265–269, gives a fictional five-minute deadline and provider fallback. |
| Provider recovered, jobs queued | **HIT** | **Complete as recovery criteria.** Provider green is insufficient. Reconcile uncertain outcomes, account for the affected set, check actual operation outcomes and queue age/completion/failures, observe a justified service-specific window, then publish recovery. | **Verify recovery and account for delayed work**, lines 161–183. **Communicate while the incident is open**, lines 132–136, shows monitoring at provider recovery and resolution after reconciliation plus observation. |
| Unknown cause and ETA | **HIT** | **Complete.** State observed impact, action, unknowns and next-update time; update when promised even without change. The worked message names cause and recovery time as unknown, without treating the next update as an ETA. | **Communicate while the incident is open**, lines 112–138. |
| Credential may be compromised | **HIT** | **Complete at the decision level; execution requires a service security procedure.** Contain access with trusted administration, preserve available evidence, restrict sensitive detail, escalate to the security contact/provider, and reopen only after responsible review. A rollback cannot revoke a leaked credential. | **When access may be compromised**, lines 77–88; **The order that matters**, lines 21–25. |

Result: **5 HIT, 0 MISFILED, 0 MISS**. The headings make each first lookup easy. Cross-references to later sections add useful checks but do not carry a missing primary answer.

## Junior-developer and small-team fit

The chapter gives a usable order of operations: confirm the failing customer operation, classify provisionally, choose a bounded mitigation, communicate on a timer, verify actual recovery and keep follow-up separate (lines 19–49, 51–67, 110–117, 159–183). The Nudge sequence shows why a healthy UI, a provider status page and a timeout are each insufficient evidence (lines 119–138, 148–152, 169–179). The explicit hold on uncertain sends is particularly useful to a junior responder who might otherwise replay a queue.

Small-team constraints are taken seriously. One developer may coordinate, investigate and communicate; the text says to keep ownership when backup is unavailable and use a provider/specialist route, while warning that two people cannot promise unarranged continuous coverage (lines 92–108, 352–359). The worked runbook supplies a concrete timer, safe dispatch pause, stop conditions and fallback (lines 243–279). It marks those as Nudge-specific, preventing the example's five- and ten-minute windows from becoming accidental universal policy.

The operational limit is explicit rather than hidden: a junior cannot derive the safe command, authoritative lookup, contacts, recovery threshold or security containment procedure from this generic chapter. The reusable runbook skeleton asks each service to fill and rehearse them in advance (lines 281–300). If that preparation has not happened, the text still gives a safe fallback: hold uncertain work, limit harm, escalate and explain the limitation (lines 64–67, 169–173). This is a **scope boundary**, not a missing universal command.

## Contradictions and untaught requirements

No direct contradiction found in the five answers. The worked timeline is internally consistent: provider recovery at 10:25, affected records accounted for at 10:30, normal dispatch observed until 10:40, then resolution (lines 128–134, 175–179, 204–210). The postmortem can leave the aggregate count and provider cause open while marking service recovered, because follow-up has a separate state (lines 198–202, 215–234, 181–183). That separation is also reflected in the two Definition of done groups (lines 335–348).

The artifact list is taught: runbook and rehearsal (lines 236–300), incident record/timeline and customer channel (lines 21–23, 104–117, 193–230), postmortem and owned actions (lines 185–234). The Definition of done checks follow the recovery, reconciliation, observation, communications and follow-up guidance (lines 159–191, 232–240, 333–348). No wholly untaught artifact or completion criterion found.

**Minor wording gap:** “Affected users received the recovery update” in **Definition of done** (line 340) promises delivery, while **Communicate while the incident is open** permits a public status page or support notice as the customer channel (lines 112–115) and the example says the resolution update was sent (line 134). A published status update does not establish that every affected user received it. If the intended gate is publication through the agreed channel, say that; if it is direct delivery, teach how to identify recipients and verify delivery. This is a precision defect in the completion wording, not a lookup failure.

**Scope boundaries, not defects:** The security procedure and any legal notification obligations are delegated to the service's security response process (lines 77–88); platform rollback mechanics are delegated to Stage 13, and operation verification detail to Stage 14 (lines 69–73, 167, 297–300). This review did not inspect those linked stages or assume their content. The Nudge provider result lookup and dispatch pause are declared fictional capabilities (lines 119–126); services lacking them must hold unresolved outcomes rather than copy the replay steps (lines 169–173).

## Verdict

**Lookup clean: 5/5 HIT.** Answers are sufficient at the chapter's decision-framework level and well fitted to a junior on a small team when the required service runbook exists. One minor Definition of done wording issue merits correction; no answer is misfiled or absent.
