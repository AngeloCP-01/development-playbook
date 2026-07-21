# 16. Incident Management

> Restore service first. Understand it second. Prevent it third. In that order, every
> time.

**When this actually happens:** When production is broken. Read this now, while nothing is
on fire, because you will not absorb new process at 3am.

---

## Entry criteria

Something is wrong in production: users are affected, an alert fired, or you found it
during [14 — Post-Deployment Verification](14-post-deployment-verification.md).

---

## The work

### The order that matters

**Mitigate → Diagnose → Fix → Prevent.**

The instinct is to find the cause first, because understanding feels like progress and
reverting feels like giving up. Resist it. Every minute spent diagnosing is a minute users
stay broken, and diagnosis is far easier once the pressure is off.

### First five minutes

**Confirm it is real.** Load the site yourself, in a private window. Check external uptime
monitoring. A dashboard can be wrong; a monitoring integration can break. Confirm before
acting.

**Assess severity**, because it determines everything else:

| Severity | Meaning | Response |
|---|---|---|
| **Critical** | Site down, data loss, security breach, payments broken | Drop everything, now |
| **Major** | A core feature broken for many users | Within the hour |
| **Minor** | Degraded, or broken for a few users | Next working session |

Be honest here. Treating everything as critical burns you out; treating a real outage as
minor loses users.

**Mitigate.** In order of preference:

1. **Roll back**, if this correlates with a recent deploy. It usually does.
   ```bash
   vercel rollback
   ```
2. **Disable the feature** via a flag ([13](13-production-deployment.md)).
3. **Scale or raise a limit**, if it is a saturation problem.
4. **Fix forward** — only when rollback is impossible, such as after a contract-phase
   migration.

**Rollback is not failure.** It is the correct response to an unclear problem affecting
real users. Revert first, satisfy curiosity afterward.

**Communicate**, if users are affected and you have any channel to reach them. Even solo,
a status page or a single post prevents a support inbox filling with reports of something
you already know about. Say what is broken, that you are on it, and when you will update.

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
