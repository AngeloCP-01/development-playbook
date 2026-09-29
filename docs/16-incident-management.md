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

### Diagnosing

Once service is restored, investigate calmly.

**Start with what changed.** Almost every incident traces to a change: a deploy, a config
edit, a dependency update, an expired certificate, a third-party outage, or crossing a
threshold like disk space or a rate limit.

The last of those is the sneaky category — nothing changed on your side, and the system
crossed a line it had been approaching for months.

**Work from the symptom backwards.**

1. What exactly is the user-visible failure?
2. Which request path produces it?
3. What does Sentry show for that path?
4. What do structured logs show around the first occurrence
   ([15](15-observability.md))?
5. What happened immediately before that timestamp?

**Find the first occurrence.** Not the loudest error — the earliest. The most common
diagnostic mistake is chasing the noisiest symptom, which is usually a downstream
consequence. The first error in the timeline is closest to the cause.

**Form a hypothesis and test it.** State it specifically: "the migration added a NOT NULL
column and old rows have nulls." Then find the evidence that would confirm or refute it.
Changing things until the symptom disappears produces a system that works for reasons you
do not know — which means it will break again for the same reasons.

**Check third parties.** Before assuming it is your code, check your provider status
pages. Sometimes the answer is that Stripe is down and there is nothing to fix.

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
