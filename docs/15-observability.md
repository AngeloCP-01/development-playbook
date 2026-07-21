# 15. Observability

> Know that something is wrong before your users tell you, and be able to work out why
> without redeploying.

**When this actually happens:** Basic error tracking on day one
([04 — Project Setup](04-project-setup.md)). Everything else grows continuously, usually
driven by incidents that were harder to diagnose than they should have been.

---

## Entry criteria

- [ ] The application is deployed and receiving real traffic
- [ ] Sentry is installed with verified source maps ([04](04-project-setup.md))

---

## The work

### Three things, in order of value

**1. Errors** — something broke. Install this first; it delivers value immediately.

**2. Metrics** — aggregate health over time. This is what tells you "normal" so that
"abnormal" is legible.

**3. Traces** — where request time went. Most valuable when debugging slowness rather than
failure.

Solo, errors plus a handful of metrics covers the large majority of real need. Add traces
when you have a performance problem you cannot locate ([09](09-performance-optimization.md)).

### Errors that are actually useful

Out of the box, Sentry tells you an exception occurred. Context is what turns that into a
fix.

```ts
// src/lib/observability.ts
import * as Sentry from '@sentry/nextjs'

export function identifyUser(user: { id: string; email: string }) {
  Sentry.setUser({ id: user.id, email: user.email })
}

export function addContext(key: string, data: Record<string, unknown>) {
  Sentry.setContext(key, data)
}
```

Attach the user to every authenticated request. "This error hit 400 users" and "this error
hit one user with unusual data" are entirely different problems with entirely different
urgency, and you cannot tell them apart without it.

Add breadcrumbs for meaningful actions — what the user was doing before it broke is often
the whole answer.

**Do not send secrets, passwords, tokens, or full payment details.** Sentry data is
retained, is accessible to anyone with account access, and lives on someone else's
infrastructure. Configure `beforeSend` to scrub aggressively.

### Structured logs

Log objects, not sentences. Sentences are unsearchable at volume.

```ts
// Bad: unqueryable
console.log(`User ${userId} failed to pay invoice ${invoiceId}`)

// Good
logger.error({
  event: 'invoice.payment_failed',
  userId,
  invoiceId,
  reason: 'card_declined',
  amountCents: 4500,
})
```

Now you can ask "how many `card_declined` events this week, by amount?" — a question that
is impossible against prose.

Name events as `noun.verb_past_tense`, consistently. Consistency is what makes the log
searchable a year later.

**Log the events that matter, not everything.** Log volume costs money and buries signal.
Worth logging: authentication events, payments, permission denials, external API failures,
background job outcomes, anything irreversible.

Never log: passwords, tokens, session IDs, full card numbers, or the contents of user
documents.

### The four signals

If you instrument only four things:

**Latency** — p50, p95, p99 of response time. Percentiles, never averages
([09](09-performance-optimization.md)).

**Traffic** — requests per minute. Its main value is that a sudden drop is one of the
clearest possible signals that something is badly broken.

**Errors** — rate as a percentage of requests, not an absolute count. Fifty errors means
nothing without a denominator.

**Saturation** — how close resources are to their limit. Database connections, function
concurrency, storage.

Vercel Analytics covers latency and traffic. Sentry covers errors. Your database
dashboard covers saturation. You do not need a unified platform to start.

### Health checks

```ts
// src/app/api/health/route.ts
export async function GET() {
  const checks = { database: false }

  try {
    await db.execute(sql`SELECT 1`)
    checks.database = true
  } catch { /* stays false */ }

  const healthy = Object.values(checks).every(Boolean)
  return Response.json(
    { status: healthy ? 'ok' : 'degraded', checks },
    { status: healthy ? 200 : 503 },
  )
}
```

Check real dependencies. An endpoint returning `200 OK` unconditionally tells you the
process is running, which you already knew.

But do not point uptime monitoring only at `/api/health`. Monitor a real user path too —
the health check can pass while the homepage throws.

### Alerts you will not learn to ignore

**The only rule that matters: every alert must be actionable.** An alert you cannot act on
trains you to dismiss alerts, and after a few weeks of that you will dismiss the real one
without reading it. Alert fatigue is not a discipline failure; it is the predictable
result of noisy alerts.

Worth alerting on:

- Error rate above baseline for 5+ minutes
- A *new* error type in production
- The site being unreachable from outside
- p95 latency doubling and staying there
- Payment or auth failures spiking
- Database connections near the limit
- A background job failing repeatedly

Not worth alerting on:

- Any single error
- CPU spikes that self-resolve
- Anything that has resolved itself every time for months

**Alert on symptoms, not causes.** "Users cannot check out" is actionable. "CPU is at 80%"
is not — 80% CPU with everything working is fine.

Route to somewhere that will actually interrupt you: push notification or SMS. Email
alerts are read the next morning, which for an outage is not a response.

### Uptime monitoring from outside

Everything above runs inside your infrastructure. If Vercel has a regional problem or your
DNS breaks, internal monitoring reports that everything is fine because nothing is
reaching it.

An external check every minute against a real page is the cheapest meaningful monitoring
you can buy. Better Stack or similar, five minutes to set up.

### Dashboards

One dashboard, visible in one screen, answering: **is the application healthy right now?**

- Requests per minute
- Error rate
- p95 latency
- Recent deploys, marked on the timeline

That last item is disproportionately useful. Most problems correlate with a deploy, and
seeing deploy markers against a metrics graph often collapses an investigation into a
glance.

Resist adding more. A dashboard with forty charts is not read.

---

## Artifacts

- Sentry with user context, breadcrumbs, and scrubbing configured
- Structured logging with consistent event names
- `/api/health` checking real dependencies
- External uptime monitoring on a real user path
- A small set of actionable alerts routed to a channel that interrupts you
- One dashboard with the four signals and deploy markers

---

## Definition of done

- [ ] Errors reach Sentry with readable stack traces and user context
- [ ] No secrets or personal data in error reports or logs
- [ ] Key events logged as structured objects
- [ ] Health check verifies the database, not just the process
- [ ] External uptime monitoring is active
- [ ] Every configured alert is one you would act on at 2am
- [ ] Alerts route somewhere that interrupts you
- [ ] Baselines documented for error rate and p95 latency
      ([14](14-post-deployment-verification.md))
- [ ] Dashboard shows deploy markers

---

## Scaling to a team

- **Define SLOs.** "99.9% of requests succeed" makes reliability a shared target rather
  than an individual preference.
- **Set up on-call rotation** with a real escalation path, once the team can sustain it.
- **Alerts need an owner.** Unowned alerts are ignored by everyone, each assuming someone
  else has it.
- **Review alert noise monthly.** Delete alerts that never led to action. This is the
  single most effective way to keep alerting trustworthy.
- **Add distributed tracing** once requests cross service boundaries and you cannot follow
  them in one place.

---

## Traps

**Alerting on everything.** Guarantees you will ignore alerts, including the important
one. Fewer, sharper alerts beat comprehensive coverage.

**Alerting on causes, not symptoms.** High CPU is not a problem. Users unable to check out
is.

**Health checks that check nothing.** A hardcoded `200 OK` tells you the process is
running.

**Only monitoring from inside.** You will not detect DNS failures, regional outages, or
certificate expiry.

**Unstructured logs.** Fine at ten lines a day, useless at ten thousand.

**Logging secrets.** Retained for a long time, visible to everyone with account access,
and shipped to a third party.

**Averages instead of percentiles.** The average is always fine.

**No baseline.** Without knowing normal, every number is unreadable during an incident,
which is exactly when you need to read it fastest.

**Dashboards nobody looks at.** If it is not glanceable in one screen, it will not be
glanced at.

**Email alerts for urgent problems.** Read tomorrow morning. The outage was tonight.
