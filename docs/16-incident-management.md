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


### Writing it down

For anything above minor, write a short post-mortem within a day, while you still remember.

```markdown
# Incident: Checkout failing — 2026-06-14

**Severity:** Critical
**Duration:** 47 minutes (14:12–14:59 UTC)
**Impact:** ~200 users could not complete checkout. 12 abandoned carts.

## Timeline
- 14:12  Deploy 8f3a2 promoted to production
- 14:18  Sentry alert: new error type, `NOT NULL violation on orders.tax_region`
- 14:23  Confirmed; began rollback
- 14:26  Rollback complete, checkout recovering
- 14:59  Fixed forward with a nullable column; verified

## Cause
The migration added `tax_region NOT NULL` in the same deploy as the code
that populates it. Existing in-flight orders had no value, so every
checkout insert failed.

## Why it was not caught
Preview database had no in-flight orders. The migration ran cleanly against
empty data.

## What we are changing
1. Expand/migrate/contract enforced for all migrations — no NOT NULL in the
   same deploy as the code that fills it ([13](13-production-deployment.md))
2. Seed data now includes in-flight records ([12](12-staging.md))
3. Alert on NOT NULL violations specifically — this failed silently for 6
   minutes before the generic error-rate alert fired
```

**Write about the system, not the person.** "I was careless" produces no change. "The
process allowed a schema and code change to ship together" produces a fix. Even in a
post-mortem you will only ever read yourself, this framing is what turns an incident into
an improvement.

**Include "why it was not caught."** Often more valuable than the cause itself — it points
at a gap in testing, monitoring, or review that will otherwise let a *different* incident
through the same hole.

**Give action items owners and dates**, or they do not happen. Solo, that means putting
them at the top of your list, not on a someday list.

### The runbook

Write this before you need it. During an incident you will not think clearly, and
following a list is far easier than reasoning from scratch.

```markdown
# Runbook

## Rollback
vercel rollback            # previous production deployment
vercel ls                  # list deployments
vercel promote <url>       # promote a specific one

## Where things are
- Errors: sentry.io/organizations/<org>/issues
- Logs: Better Stack
- Database: Neon console
- Uptime: Better Stack monitors
- Status page: <url>

## Common problems
**Site returns 500 on every route**
→ Check env vars in Vercel first. A missing variable after a rename is the
  most common cause.

**Database connection errors**
→ Check the Neon dashboard for connection limits. Pooler may need a restart.

**Slow but not down**
→ Check for a long-running query in the Neon dashboard. Kill it if it is a
  runaway backfill.

## Escalation
- Vercel support: <link>
- Neon support: <link>
- Stripe status: status.stripe.com
```

Keep it somewhere reachable when the application is down — not in the application.

---

## Artifacts

- A runbook with rollback commands, dashboard links, and common failure modes
- Post-mortems for major and critical incidents
- Action items with owners and dates
- A status page, if you have users to inform

---

## Definition of done

Per incident:

- [ ] Service restored
- [ ] Users informed, if affected
- [ ] Root cause identified — not just the symptom that stopped
- [ ] Permanent fix deployed and verified ([14](14-post-deployment-verification.md))
- [ ] Post-mortem written for major and critical
- [ ] "Why it was not caught" answered
- [ ] Action items recorded with dates
- [ ] Runbook updated if you learned something

---

## Scaling to a team

- **Define roles**, even informally: someone drives, someone communicates. Both at once is
  how updates stop going out.
- **Use a dedicated channel per incident** so the timeline reconstructs itself.
- **Blameless post-mortems, enforced.** The moment incidents become about fault, people
  hide problems, and hidden problems get worse.
- **Rotate on-call** with a real escalation path.
- **Review action items in a recurring meeting.** Unreviewed action items are decoration.
- **Track incident frequency and time-to-recovery.** Whether things are improving is
  otherwise a matter of opinion.

---

## Traps

**Diagnosing before mitigating.** The most common and most expensive incident mistake.
Users stay broken while you satisfy your curiosity.

**Treating rollback as defeat.** It is the correct first move for an unclear problem.

**Chasing the loudest error.** It is usually a downstream effect. Find the first
occurrence.

**Changing things randomly.** You may stop the symptom without understanding the cause,
and it returns next week having taught you nothing.

**No post-mortem because you already know what happened.** You will forget within a month,
and the systemic fix never gets made.

**Post-mortems that blame people.** Produce shame, not change. Fix the system that allowed
it.

**Action items without owners or dates.** They do not happen.

**A runbook stored inside the application.** Unreachable exactly when needed. So is one
that only exists in your head.

**Not checking third-party status first.** An hour debugging your code while your payment
provider is down.
