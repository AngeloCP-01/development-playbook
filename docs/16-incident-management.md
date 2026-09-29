# 16. Incident Management

> Limit harm first. Verify recovery. Learn from what happened.

**When this actually happens:** When production is broken. Read this now, while nothing is
on fire, because you will not absorb new process at 3am.

---

## Entry criteria

Something is wrong in production: users are affected, an alert fired, or you found it
during [14 — Post-Deployment Verification](14-post-deployment-verification.md).

---

## The work

### The order that matters

**Limit harm, verify recovery, then finish the investigation and prevention work.**
Investigate enough to choose a safe mitigation; do not wait for a complete causal
explanation while users remain affected. Keep a timeline and communicate throughout.
If access may be compromised, use the containment path below. Restoring availability
is not always the first safe action.

### First response: confirm impact and severity

Confirm the affected customer operation using a safe check and existing evidence.
A healthy homepage does not prove that a worker completed its job. For background
work, inspect completion records, oldest pending work and customer reports. Avoid
creating duplicate side effects just to reproduce a failure. Record what you know,
what remains unknown, when impact began, and who is responding.

Declare an incident when impact or credible risk needs coordinated attention. Do
not wait for the exact cause or complete user counts. Check recent changes and
provider status early; a provider incident is a hypothesis, not proof of your cause.

These are local policy examples, not universal SEV numbers or response deadlines:

| Severity | Example impact | Response |
|---|---|---|
| Critical | Widespread outage, credible compromise, data loss or blocked payments | Respond immediately and seek help |
| Major | Important customer work blocked or significantly degraded | Start response promptly; escalate as impact grows |
| Minor | Limited impact with a safe workaround | Name an owner and an agreed response time |

Use provisional severity when impact is uncertain. Explain the evidence and unknowns,
choose the more urgent plausible response if harm may be serious, and reassess after
each new observation. A small user count does not make data loss minor.

### Choose a mitigation

Choose by evidence and likely harm, not a fixed list of commands. Record the action,
operator, time and observed effect. Stop or reverse a harmful action where safe.

| Option | Preconditions | Possible harm / Stop condition | Check effect |
|---|---|---|---|
| Rollback | Relevant recent change; known-good target; schema compatibility checked | Old code may not read current data; stop if incompatible or impact grows | Affected operation succeeds and errors fall |
| Disable a feature | Tested flag and understood effect on accepted work | May strand work; stop if unrelated paths fail | Failed operation is safely unavailable and accepted work is accounted for |
| Add capacity | Saturation confirmed and downstream capacity permits it | More workers can overload a dependency; stop if dependency errors rise | Queue age and latency improve without new failures |
| Degrade around a dependency | Known safe fallback, admission control or bounded queue | Lost work, stale results or repeated side effects; stop if outcomes are uncertain | Customer-visible behavior matches the advertised degraded service |
| Fix forward | Bounded change supported by evidence; rollback unsafe or irrelevant | Rushed change may widen impact; stop on failed checks | Verify the affected operation and monitor recurrence |

A rollback may be available but irrelevant to a provider outage. Do not restart,
scale or replay blindly. Keep uncertain outcomes for reconciliation and use the
service runbook. If no action is known safe, limit further harm, escalate and explain
the current limitation rather than inventing a repair.

For Vercel and AWS rollback procedures, use [13 — Production Deployment](13-production-deployment.md),
especially its platform-specific rollback sections. Those procedures still require
the relevance and compatibility checks above. Application rollback does not undo a
database migration. Validate customer recovery using [14 — Post-Deployment Verification](14-post-deployment-verification.md)
and the recovery criteria in this stage.

### When access may be compromised

Contain unauthorized access using the service's security response procedure and
trusted administrative access. Capture available logs and action timestamps without
delaying urgent containment. Restrict access to evidence; do not paste credentials
or customer data into public incident channels. Escalate to the security contact or
provider support with the affected resource, observed behavior and actions taken.

For example, a leaked deployment credential needs access containment and review of
what it could change. Rolling the app back alone does not revoke that credential.
Availability alone does not establish safety. Reopen access only after the responsible
responder has checked containment and recovery; involve specialist help when the
scope cannot be established. Detailed forensic work and notification obligations
belong to the security response process, not a generic availability checklist.

### Escalate when help is unavailable

Write the escalation path before an incident: primary contact, backup, acknowledgment
deadline, next contact or provider support route, and the conditions for immediate
escalation. Set deadlines appropriate to your service and coverage; a team of two
cannot promise continuous staffed coverage without making arrangements for it.

If the primary does not acknowledge by the agreed deadline, contact the backup. If
the backup is unavailable, use the recorded provider or specialist route and keep
ownership with the current responder. Do not wait through deadlines if harm is
increasing or specialist help is needed now. Send impact, severity, incident link,
actions already taken, observed results and the specific help required. Never include
credentials in the escalation message.

An **Incident commander** owns coordination and decisions during the incident; on a
small incident that may be the sole developer. Keep one timeline and set a reminder
for brief customer updates while you investigate. A handoff is complete when the
receiving responder explicitly accepts ownership, current impact, unknowns and the
next action. Until then, the original responder still owns it.

### Communicate while the incident is open

State observed impact, what you are doing, what is unknown and the next update time.
Use an existing customer channel that stays reachable during the outage. A public
status page is useful, but a support notice or agreed customer channel can meet the
minimum. Keep sensitive investigative details in the restricted incident record.
Update at the promised time even if nothing changed. A next-update time is not a
recovery estimate. Communicate throughout mitigation and investigation.

**Worked example: Nudge**, a fictional appointment-reminder service, uses a worker
and a messaging provider. On 2026-09-29, send timeouts start at 10:00 UTC while the
web UI stays healthy. Ana owns response; backup Bo is unavailable. The pre-agreed
fallback is provider support. Nudge has a tested dispatch pause that preserves
queued jobs. Each reminder has a stable operation ID; the fictional provider exposes
an authoritative result lookup by that ID. These are example-specific capabilities,
not promises made by every provider. Disable retries for uncertain outcomes until
that lookup establishes whether sending already succeeded.

> 10:05 UTC — Investigating: appointment reminders are delayed. We are checking delivery records and the messaging provider. Cause and recovery time are unknown. Next update: 10:15 UTC.

> 10:15 UTC — Update: the provider reports degradation. We have paused dispatch while checking uncertain send results; the provider's role is not yet confirmed. Recovery time remains unknown. Next update: 10:25 UTC.

> 10:25 UTC — Monitoring: the provider reports recovery. Dispatch is resuming only for reconciled eligible reminders; delayed work remains. Recovery time remains unknown. Next update: 10:40 UTC.

> 10:40 UTC — Resolved: checks from 10:30 to 10:40 UTC confirm normal dispatch. The affected reminder set is accounted for: confirmed sends were not repeated, remaining eligible reminders were sent, and expired reminders were marked expired with affected customers notified. Our follow-up review remains open.

The times above are commitments in this fictional incident, not a required cadence.
Internal updates also include the responder, evidence links and help needed. Do not
claim a cause simply because a provider reports a problem at the same time.

### Diagnose with evidence

Before acting, investigate enough to select and check a mitigation. After limiting
impact, continue the deeper investigation. Start with the affected operation,
recent changes, dependency health and the first relevant timestamps in
[15 — Observability](15-observability.md)'s logs and error reports. The earliest observed error is not necessarily the cause;
missing telemetry and clock differences can hide earlier events.

Write a falsifiable hypothesis: “The provider accepted reminders but timed out before
returning acknowledgments.” Compare provider operation results with local reminder
states. A provider result showing accepted delivery supports that hypothesis; an
explicit rejection points elsewhere. Preserve competing explanations until the
evidence separates them. A status page can lag or describe an unrelated region.

Do not change several things at once without recording them. For each change, write
what result would support your hypothesis, what would refute it and when you will
stop. Provider downtime may leave nothing to repair at the provider, but you still
own your application's retries, queued work and customer communication.

### Verify recovery and account for delayed work

Recovery means the affected customer operation meets its agreed criteria, not merely
that a provider turned green. Check error rate, latency and real operation outcomes
against your baseline. For background work, check oldest pending age, completion
rate, failures and the disposition of affected records; new requests alone do not
prove recovery. Use a service-specific observation window long enough to see normal
work complete, and record why that window fits. See
[14 — Post-Deployment Verification](14-post-deployment-verification.md) for checking the actual operation.

Reconcile uncertain outcomes before replay. A timeout does not prove an operation
failed: it might have completed before its acknowledgment was lost. Check the
provider's authoritative result or another reliable record. If the outcome cannot
be established, hold the item for reviewed reconciliation; do not send, charge or
create again merely to test it. Document any remaining limitation to customers.

In Nudge, stable IDs and authoritative lookup allow confirmed sends to be excluded
from replay. The responder resumes only eligible unsent work, marks expired
reminders expired, notifies affected customers and accounts for the whole affected
set. The worked incident observes normal dispatch for ten minutes after that work
is accounted for. Another service must choose its own criteria and observation window.

Record service recovery separately from follow-up closure. Diagnosis, prevention
and provider questions can remain open after impact ends. Keep owners and dates on
that work; never invent a root cause to tick a checkbox.

### Write the postmortem and track follow-up

A **Postmortem** records impact, response, contributing conditions and changes that
reduce recurrence. Write about the system rather than blaming the responder. Start
while evidence is fresh, ideally the next working day for major or critical incidents.
Keep unanswered questions visible. Separate service recovery from the completion of
investigation and corrective work. Give actions an owner, date and completion check.

This fictional record carries the same Nudge incident as the customer updates:

```markdown
# Nudge incident — delayed appointment reminders, 2026-09-29

Severity: Major
Customer-impact interval: 10:00–10:40 UTC (40 minutes)
Impact: reminders delayed. Affected records reconciled and dispositions complete by 10:30 UTC.
Aggregate affected count: pending attachment from the reconciliation report.
Service: recovered. Follow-up: open.

## Timeline
- 10:00 — Provider send timeouts begin; web UI remains healthy.
- 10:05 — Ana declares the incident and publishes the first update.
- 10:15 — Provider reports degradation; dispatch paused; uncertain results held.
- 10:25 — Provider reports recovery; only reconciled eligible work resumes.
- 10:30 — Affected records accounted for; expired reminders marked and customers notified.
- 10:40 — Ten-minute observation confirms normal dispatch; customer resolution update sent.

## Contributing conditions and unknowns
Provider request timeouts coincided with degradation. Local timeouts could not tell
whether a reminder was accepted. Authoritative operation lookup was required to
avoid duplicate sends. The provider's internal cause remains unknown; Ana owns the
support follow-up. The aggregate count from the completed per-record reconciliation
will be attached to this report.

## Why detection and response were harder
Web uptime stayed green while reminders stalled. The existing monitor did not check
reminder completion age. Bo was unavailable; Ana used the agreed provider escalation
route and kept customer updates on a timer.

## Actions
| ID | Change | Owner | Due | Completion evidence |
|---|---|---|---|---|
| A1 | Alert on reminder completion age | Ana | 2026-10-01 | Withheld test completion triggers an actionable alert |
| A2 | Rehearse timeout reconciliation | Bo | 2026-10-02 | Accepted-but-timed-out fixture is not resent |
| A3 | Close impact totals and provider follow-up | Ana | 2026-10-03 | Reconciliation counts attached; provider answer or documented uncertainty recorded |
```

An unknown provider cause need not keep service marked down. It does keep an
investigation item open until its owner records the evidence and disposition.
Review overdue actions; do not count a ticket's existence as risk reduction.

### Prepare and rehearse the runbook

A **Runbook** is a service-specific procedure tested before it is needed. Keep it
outside the affected application with access available during an outage. Validate
links, permissions and recovery checks during rehearsal and after relevant changes.
A provider dashboard URL is not a complete escalation procedure.

Worked Nudge runbook, with fictional operational facts:

```markdown
# Nudge reminder dispatch
Owner: Ana. Backup: Bo. Last rehearsed: 2026-09-22.
Access: trusted operator account; dispatch pause and read-only delivery lookup.
Location: restricted team operations workspace independent of Nudge.
Evidence: worker completion-age dashboard, delivery ledger and provider status page.

## Trigger and checks
Delayed reminder alert or customer report: inspect completion age and affected IDs.
Web uptime is supporting evidence only. Never send another reminder to test a timeout.

## Safe action
Use the rehearsed dispatch-pause control; it retains accepted queued records.
Look up uncertain operations by stable ID. Exclude accepted sends from resubmission.
Resume only confirmed-unsent, still-eligible records; mark expired ones and notify customers.

## Stop conditions
Lookup unavailable or inconclusive, unexpected new side effects, or rising provider errors:
keep affected records held, retain evidence, contact provider support and update customers.

## Escalation and updates
Primary Ana; backup Bo after the agreed five-minute acknowledgment deadline.
If Bo is unavailable, Ana opens the provider support case and retains ownership.
Escalate immediately for suspected compromise or increasing harm.
Publish impact, unknowns and next-update time; use a timer while responding alone.

## Recovery checks
Account for the affected record set; inspect completion age, errors and delivery results.
Observe normal dispatch for the example's ten-minute window and publish the outcome.
Handoff only after the receiving owner accepts the state and next action.
```

The five-minute acknowledgment and ten-minute observation windows are Nudge policy,
not service-independent targets. Store actual access links and contact details in
its restricted operations workspace. Here is the reusable skeleton for a different service:

```markdown
# SERVICE-SPECIFIC runbook
Service and customer operation:
Owner / backup / acknowledgment deadline / fallback support route:
Last rehearsed / next review:
Independent document location and required trusted access:
Evidence locations and safe impact check:
Action prerequisites and operator procedure:
Stop conditions and reversal limits:
Handling for queued work and uncertain external side effects:
Recovery checks and observation window with rationale:
Customer channel, next-update commitment and incident record:
Receiving owner and handoff acceptance:
```

Fill each field for the real service and rehearse it. For deploy-related incidents,
attach the tested Vercel or AWS procedure from [13](13-production-deployment.md)
and its schema constraints. This chapter supplies the decision framework; it does
not invent a universal database restart, query-kill or queue-replay command.

---

## Artifacts

- A rehearsed runbook with safe action conditions, evidence links and escalation
- An incident record and customer communication channel reachable during the outage
- A postmortem for major and critical incidents
- Follow-up actions with owners, dates and completion evidence

---

## Definition of done

**Service recovery**

- [ ] The affected customer operation meets the service's recovery criteria
- [ ] Delayed work and uncertain side effects are accounted for; limitations disclosed
- [ ] Stability was observed for the documented service-specific window
- [ ] Affected users received the recovery update

**Follow-up closure**

- [ ] Evidence supports the explanation; unresolved questions have owners and dispositions
- [ ] Permanent corrections are verified, or remaining risk has an explicit owner and decision
- [ ] Major/critical postmortem includes detection gaps and a consistent impact timeline
- [ ] Actions have owners, dates and completion evidence; overdue work is reviewed
- [ ] Runbook and rehearsal reflect what the incident taught

---

## Scaling to a team

Assign coordination, technical work and communication explicitly; one responder can
hold several roles until help arrives. Keep one incident channel and record. A handoff
requires acceptance, not merely a message sent. Agree coverage and escalation with
backups before promising on-call availability. Review actions and repeat incidents
regularly; compare recovery intervals defined consistently rather than mixing time
to restore service with time to finish every follow-up.

---

## Traps

**Waiting for a full explanation before limiting harm.** Investigate enough to choose
and validate mitigation; deeper analysis continues after impact falls.

**Rolling back an unrelated change.** Check relevance and schema compatibility first.

**Calling the provider green while your customers remain blocked.** Verify your own
operation and account for queued or uncertain work.

**Treating the first observed error as proof.** Test the hypothesis against other evidence.

**Replaying timeouts blindly.** An operation may have succeeded before its reply was lost.

**Restoring availability during ongoing compromise.** Contain access and involve the
responsible security responder; uptime alone does not establish safety.

**Letting updates stop when you are alone.** Name the next-update time and set a reminder.

**Copying contacts without an escalation procedure.** Include deadlines, fallback and ownership.

**Writing blame or undated promises.** Record contributing conditions and owned, verifiable actions.

**Keeping the only runbook inside the failing service.** Rehearse access during an outage.
