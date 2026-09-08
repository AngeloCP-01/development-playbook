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

export function identifyUser(user: { id: string }) {
  Sentry.setUser({ id: user.id })
}

export function addContext(key: string, data: Record<string, unknown>) {
  Sentry.setContext(key, data)
}
```

An opaque id is enough, because it **resolves to a person in your own database** — which
you control, can query, and can delete. An email address in an error report is the same
fact stored a second time, on infrastructure you do not control, under a retention policy
you did not set.

Attach the user to every authenticated request. "This error hit 400 users" and "this error
hit one user with unusual data" are entirely different problems with entirely different
urgency, and you cannot tell them apart without it.

Add breadcrumbs for meaningful actions — what the user was doing before it broke is often
the whole answer.

**Do not send secrets, passwords, tokens, or payment details.** Sentry data is
retained, is accessible to anyone with account access, and lives on someone else's
infrastructure. Configure `beforeSend` to scrub aggressively.

```ts
// src/lib/observability.ts
const SECRETS = [
  /postgres(?:ql)?:\/\/\S+/gi, // connection strings carry the password inline
  /\bsk_live_[A-Za-z0-9]+/g, // provider secret keys
  /\bBearer\s+[A-Za-z0-9._-]+/gi,
]

function redact(text: string): string {
  return SECRETS.reduce((acc, pattern) => acc.replace(pattern, '[redacted]'), text)
}

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  beforeSend(event) {
    // Sentry captures request headers by default, and that is where
    // credentials live.
    for (const header of ['authorization', 'cookie', 'x-api-key']) {
      delete event.request?.headers?.[header]
    }

    // It captures bodies too. A form post carries whatever the form carried.
    if (event.request) delete event.request.data

    // And an exception message is free text: a failed query prints the
    // connection string, password included.
    for (const value of event.exception?.values ?? []) {
      if (value.value) value.value = redact(value.value)
    }

    return event
  },
})
```

Scrubbing is a deny-list, and a deny-list is only as current as the last time you read it.
The thing that actually protects you is sending less: an id instead of an email, a reason
code instead of a payload.

One loop can spend everything. A batch job that throws once per row, over five thousand
rows, sends five thousand events in a minute or two and empties a month's quota — after
which you are blind, and nothing tells you so, because the thing that would have told you
is the thing that ran out. Turn on spike protection, sample the noisy and expected, and
set one alert on quota consumption itself. It is the only alert in this stage about your
monitoring rather than your system, which is exactly why it gets forgotten.

### Structured logs

Log objects, not sentences. Sentences are unsearchable at volume.

```ts
// src/lib/logger.ts
import { AsyncLocalStorage } from 'node:async_hooks'
import pino from 'pino'

export const requestContext = new AsyncLocalStorage<{ requestId: string }>()

export const logger = pino({
  level: process.env.LOG_LEVEL ?? 'info',
  base: {
    service: process.env.SERVICE_NAME ?? 'web',
    env: process.env.NODE_ENV,
  },
  mixin: () => ({ requestId: requestContext.getStore()?.requestId }),
})
```

`pino` writes one JSON object per line to stdout, which is what every platform in this
playbook already collects. Any library that does that will do; what matters is that the
output is a line of JSON and not a sentence.

`mixin` runs on every log call, so the id attaches itself and no call site has to remember
it. Open the store once per request — in middleware, or the first line of the handler —
with the incoming `x-request-id` if there is one, or a fresh `crypto.randomUUID()` if
there is not. Platforms usually supply one already; use theirs when it exists, so your
line and their line agree.

One id is the difference between "here is an error" and "here is everything that happened
during the request that produced it". It is also the cheapest thing in this stage: one
field, no new vendor, no sampling decisions.

```ts
Sentry.setTag('requestId', requestId)
```

Now the error tracker and the logs are searchable by the same key, which is the whole of
what tracing buys you until requests start crossing service boundaries
([Scaling to a team](#scaling-to-a-team)).

```ts
// Bad: unqueryable
console.log(`User ${userId} failed to pay invoice ${invoiceId}`)

// Good
logger.warn({
  event: 'invoice.payment_declined',
  userId,
  invoiceId,
  reason: 'card_declined',
  amountCents: 4500,
})
```

Now you can ask "how many `card_declined` events this week, by amount?" — a question that
is impossible against prose.

**Levels are a filter, not a mood.** `error` means *a fault you would investigate* — it is
the level your alerting reads, so anything routine that lands there is a false page
waiting to happen. A declined card is a routine business outcome and not a fault: it is
`warn`. Reserve `error` for the things that should not have happened, and `info` for the
events you want to count later.

Name events as `noun.verb_past_tense`, consistently. Consistency is what makes the log
searchable a year later.

**Log the events that matter, not everything.** Log volume costs money and buries signal.
Worth logging: authentication events, payments, permission denials, external API failures,
background job outcomes, anything irreversible.

Never log: passwords, tokens, session IDs, card numbers, or the contents of user
documents. The last four digits and an expiry date are still personal data, and "it is
only partial" is not a retention policy.

### Where logs go, and what they cost

`pino` writes to stdout. On every platform in this playbook,
**stdout is a stream, not storage** — something collects it, keeps it for a while, and
then does not. Deciding what that something is, and for how long, is part of this stage;
discovering it during an incident is not.

| | Collector | Retention default | What to set |
|---|---|---|---|
| **Vercel** | Runtime logs | Short, and shorter on lower plans | A drain to a log store if you need more than the built-in window |
| **AWS** | CloudWatch Logs | **Never expire** | A retention policy per log group, explicitly |

The AWS default is the one that bites. A log group with no retention policy keeps
everything forever and bills for it forever, and nobody chose that — it is what happens
when nobody chooses.

Order of magnitude for a small production service, so you can tell whether this stage is
an afternoon or a commitment: error tracking free to ~$30/month at low volume, uptime
monitoring free to ~$10, logs the variable one — single-digit dollars if you keep a week
and log events rather than everything, and unbounded if you keep everything forever. Check
current pricing rather than trusting this paragraph; it is here to set expectations, not
to quote.

Retention is also a privacy decision, not only a cost one — whatever you kept is what you
have to be able to delete ([08](08-security-audit.md)).

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

| Signal | Where it comes from | Vercel | AWS |
|---|---|---|---|
| Latency | The HTTP layer in front of your app, which already times every request | Vercel Observability, per route | ALB or API Gateway CloudWatch metrics |
| Traffic | The same layer — it counts every request, which is also your denominator | The same place | The same CloudWatch metrics |
| Errors | Two questions, not one: *what broke* and *how often*. Sentry answers the first; the request-counting layer answers the second | Edge Requests by status code; Sentry for what broke | ALB 5XX over request count; Sentry for what broke |
| Saturation | Whatever owns the resource with the ceiling | Your database dashboard, function concurrency | CloudWatch per-service metrics, RDS connections |

Error *rate* does not come from your error tracker. Sentry tells you what broke and how
many times it was reported; it is sampled, it is filtered by `beforeSend`, and it never
sees a request that succeeded — so it can give you neither half of the fraction. Both
halves come from the layer that counts every request: failed responses over total
responses, same source, same window. Divide a sampled numerator by an unsampled
denominator and the percentage you get is not a percentage of anything. Sentry answers the
question you ask second, which is *which* error and *why*.

Check which number you are reading. Every platform sells you two different latencies.
Vercel's Web Analytics counts visits and its Speed Insights measures Core Web Vitals in
the browser; on AWS the same split is CloudWatch's `TargetResponseTime` against whatever
RUM you have bolted on. One is the user's experience, the other is the time your server
spent, and the table above means the second. A p95 that doubles in one is not the same
event as a p95 that doubles in the other, and an alert that does not say which will wake
you for the wrong one.

One tier note, because it changes what you can actually see: on Vercel the per-route
latency breakdown is an Observability Plus feature. Below it you get invocation counts and
error rate but not the latency split, which is worth knowing before you write an alert
against a number your plan does not show you.

You do not need a unified platform to start.

### Health checks

```ts
// src/app/api/health/route.ts
export async function GET() {
  const checks = { database: false }

  try {
    await Promise.race([
      db.execute(sql`SELECT 1`),
      new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 2000)),
    ])
    checks.database = true
  } catch (error) {
    // Not a fault, so not `error` — but the reason is the only evidence of
    // how, and a bare `catch {}` destroys it.
    logger.warn({ event: 'health.dependency_unreachable', error })
  }

  const healthy = Object.values(checks).every(Boolean)
  return Response.json(
    { status: healthy ? 'ok' : 'degraded', checks },
    { status: healthy ? 200 : 503 },
  )
}
```

Check real dependencies. An endpoint returning `200 OK` unconditionally tells you the
process is running, which you already knew.

The realistic failure is not *refused*, it is *hung* — an exhausted pool, a network
partition. Without the timeout the health check hangs with it and never returns the
`degraded` state it exists to report, which means the endpoint fails in exactly the case
it was written for.

Two different things ask whether you are up, and they want different answers. **Liveness**
is "is this process wedged, should the platform restart it" — and the honest answer
depends on nothing but the process, because a restart cannot fix a database.
**Readiness**, which is what this endpoint does, is "should traffic come here, is
everything it depends on reachable".

Point your uptime monitor at the dependency-checking one. Point your *platform* — Fly,
ECS, Cloud Run, Kubernetes, anything that restarts or deregisters on a failed check — at a
liveness endpoint that returns `200` whenever the process is running. Wire the platform to
the dependency check and a thirty-second database blip restarts every instance you have,
simultaneously, turning a recoverable hiccup into an outage with a restart storm on top.

But do not point uptime monitoring only at `/api/health`. Monitor a real user path too —
the health check can pass while the page a user actually loads throws.

### Alerts you will not learn to ignore

**The only rule that matters: every alert must be actionable.** An alert you cannot act on
trains you to dismiss alerts, and after a few weeks of that you will dismiss the real one
without reading it. Alert fatigue is not a discipline failure; it is the predictable
result of noisy alerts.

Worth alerting on:

- Error rate above baseline for 5+ minutes
- A **new** error — a signature you have never seen before. This is the one exception to
  the rule below, and it earns it: a novel error after a deploy is the highest-information
  event your system produces.
- The site being unreachable from outside
- p95 latency doubling and staying there
- Payment or auth failures spiking
- Database connections near the limit
- A background job failing repeatedly
- Traffic falling to near zero outside a pattern you recognise — the fastest signal that
  something upstream of your application is broken

Not worth alerting on:

- A single occurrence of an error signature you have seen before
- CPU spikes that self-resolve
- Anything that has resolved itself every time for months

**Alert on symptoms, not causes.** "Users cannot check out" is actionable. "CPU is at 80%"
is not — 80% CPU with everything working is fine.

One exception, and it is the reason "database connections near the limit" is in the list
above: a resource with a **hard ceiling** that **does not recover on its own** — a
connection pool, a disk, an API quota — is worth alerting on *before* it becomes a symptom,
because crossing it is a cliff rather than a slope. By the time users feel a full
connection pool, every request is already failing. CPU has the ceiling but not the second
half: it is elastic, it comes back on its own, and crossing 80% degrades rather than
fails. That is the difference, and it is the whole of the difference.

**A ratio needs a floor.** "Error rate above 5%" is a sensible rule at a thousand requests
a minute and nonsense at four: one failed request overnight is a 25% error rate, and it
will page you. Gate every ratio alert on a minimum volume — *above 5% **and** at least
twenty requests in the window* — and add a plain count alongside it for the traffic levels
where the ratio is noise. The threshold that is right at lunchtime is wrong at 3am, and
the volume gate is what keeps one rule usable across both.

Route to somewhere that will actually interrupt you: push notification or SMS. Email
alerts are read the next morning, which for an outage is not a response.

**Fire a test alert on purpose, and confirm it reaches you on the device you expect to be
woken by.** An alert routed to a dead phone number, an expired webhook, or an app whose
notifications you silenced in a meeting is indistinguishable from a healthy system,
forever, and the only thing that tells you is the incident. Do it when you set the alert
up, and again when you change how you are reachable.

### Uptime monitoring from outside

Everything above runs inside your infrastructure. If Vercel has a regional problem or your
DNS breaks, internal monitoring reports that everything is fine because nothing is
reaching it.

An external check every minute against a real page is the cheapest meaningful monitoring
you can buy. Better Stack or similar, five minutes to set up.

Turn on **certificate expiry** checking while you are there. It is a separate toggle from
the HTTP check on every service that offers it, it is the one failure in this section that
arrives on a schedule you could have read months in advance, and the default notice period
is usually shorter than the time you will need.

"A real user path" means a request that exercises the same machinery a user's would. If
you have a page, monitor the page. If you are an API behind authentication, you need a
**canary endpoint**: one route, authenticated with a token issued to the monitor and
nothing else, that reads far enough down the real path to prove it works and **writes
nothing**.

The temptation is to have the monitor place an order every minute, because that is the
real path. Do not: you will charge cards, fill tables, and page yourself when your payment
provider is fine and your test data is not. Read the last order back instead of creating
one.

```ts
// src/app/api/canary/route.ts — reads the real path, writes nothing
export async function GET(request: Request) {
  if (request.headers.get('x-monitor-token') !== process.env.MONITOR_TOKEN) {
    return new Response('not found', { status: 404 })
  }

  const latest = await db.query.orders.findFirst({
    orderBy: (orders, { desc }) => [desc(orders.createdAt)],
  })

  return Response.json({ ok: latest !== undefined })
}
```

Returning `404` rather than `401` for a bad token keeps the endpoint out of anyone's crawl
results.

### When nothing is reporting

Everything above fires when something happens. Nothing above fires when something
**stops**, and a system that has gone quiet looks exactly like a system that is fine.

- **An exception that was caught and discarded.** A bare `catch {}` swallows the reason:
  the dependency is down, the code knows, and why is gone forever. The health check
  earlier in this stage logs its catch instead, for exactly this reason.
- **A failure that is a normal response.** `invoice.payment_declined` — the logging
  example above — is a business failure that throws nothing. So is every handled `4xx`.
- **A third party returning `200` with a failure inside it.** Your HTTP client is
  satisfied. Your integration is not.
- **A failure on the client.** It never reached your server, so your server has nothing to
  say about it.
- **An event your own configuration dropped** — sampling, a quota, or the `beforeSend` you
  just wrote.

The fix is not more error tracking. It is to **count the outcomes you care about, not just
the exceptions** — you already are, if you took the structured-logging section seriously.
Once `order.created` is a counted event, its *absence* is measurable, and "no orders in
ninety minutes on a Tuesday afternoon" is an alert you can actually write. An exception
count falling to zero tells you nothing; a business event falling to zero tells you almost
everything.

**Absence of a signal is not evidence of health.** When someone reports a failure your
tools did not see, that gap is the finding — not the report.

### Jobs that nobody watches

A scheduled job that fails is easy: it throws, and everything above catches it. A
scheduled job that **never ran** produces no exception, no log line and no request. Every
mechanism in this stage reports that the system is healthy, and it is — the job is simply
not part of it any more.

The instrument is a **heartbeat**, sometimes called a dead man's switch, and it is the
only monitor here that alerts on silence: the job calls a URL when it finishes
successfully, and the monitor pages you when the call does not arrive inside the window
you set.

```ts
// At the end of the job — after the work, on the success path only.
await fetch(process.env.HEARTBEAT_URL!, { method: 'POST' })
```

Not in a `finally`. A ping in a `finally` block reports success for a run that threw,
which converts your only detector of silence into a source of false confidence.

Any monitor that can page you on a *missing* check will do — Better Stack, Healthchecks.io
and Cronitor all offer this as a heartbeat URL. On **AWS**, the equivalent is a CloudWatch
alarm over a custom metric the job emits, with `TreatMissingData` set to `breaching`
explicitly. The default is `missing`, which tells the alarm to disregard absent data
points when deciding its state — which is precisely the condition you are trying to catch.

- **A job that is slower every night.** Alert on duration as well as absence; a
  reconciliation that has gone from four minutes to forty is on its way to overrunning its
  window.
- **A job that overlaps itself.** Two copies of a reconciliation running concurrently is a
  different bug from either of them failing, and neither an error rate nor a heartbeat
  will show it.

### Dashboards

One dashboard, visible in one screen, answering: **is the application healthy right now?**

- Requests per minute
- Error rate
- p95 latency
- Saturation of whatever is closest to its ceiling — usually database connections
- Recent deploys, marked on the timeline

Saturation is the one most likely to be the actual incident on a small deployment: a
connection pool exhausted by a batch job running alongside daytime traffic. It is also the
one that gets dropped first, because it is the only one of the four that does not have an
obvious single number.

Deploy markers are disproportionately useful. Most problems correlate with a deploy, and
seeing them against a metrics graph often collapses an investigation into a glance.

A deploy marker is not a feature of your dashboard. It is an **event with a timestamp**,
emitted by whatever performs the deploy, that the dashboard knows how to draw. Which means
the work is in your deploy step, not your dashboard.

```bash
# In the deploy job, after the deploy succeeds.
# Sentry: create the release and associate the commits.
sentry-cli releases new "$GITHUB_SHA"
sentry-cli releases set-commits "$GITHUB_SHA" --auto
sentry-cli releases finalize "$GITHUB_SHA"
```

On **Vercel**, the Sentry integration creates releases for you, which is why this looks
free — it is being done on your behalf. On **AWS**, nothing emits the event unless you do:
add the step above to the deploy workflow, and for a CloudWatch dashboard,
`aws cloudwatch put-dashboard` with an annotation, or a Grafana annotation if you are
drawing the graphs there. Check the current flags before copying: `sentry-cli` and the
CloudWatch dashboard schema both move.

Resist adding more. A dashboard with forty charts is not read.

### AI in observability

An agent is good at the parts of observability that are pattern-matching over text you
already have — grouping errors, spotting what changed, writing a query in a language you
do not know. It is bad at the part that decides whether you are actually covered, because
that requires noticing what is *not* in the data, and the data is all it has.

Where it earns its place:

- **Draft the alert set from your own event names.** Give it your structured log events,
  your four signals and your traffic shape, and ask for alert rules with thresholds,
  durations and a minimum-volume gate. The rules come back reasonable and the *numbers*
  come back invented — they are the part you replace with your own baselines. (A prompt.)
- **Ask which events stopped.** Paste a day of log events and yesterday's, and ask what
  appears in one and not the other. This is the one analysis that addresses the failure
  mode nothing else in this stage sees, and it is mechanical enough to hand over.
  (A prompt.)
- **Write the scrubbing deny-list from your own schema.** Point it at your schema and your
  environment variable names and ask which values would end up in an error payload. It
  finds the connection string you forgot; you verify by sending a test event and reading
  what arrived. (A prompt.)
- **Query logs in a language you do not know.** Describe the question in English and let
  it write the CloudWatch Logs Insights query or the PromQL. Reading a query you did not
  write is much easier than writing it, which reverses the usual argument against
  generated code here. (A CLI + MCP command.)
- **Turn an incident into the alert you were missing.** Paste the timeline of something
  you found out about late, and ask what signal would have fired first. It reliably names
  one you do not have. (A prompt.)
- **Generate the dashboard as configuration.** Grafana and CloudWatch both take JSON.
  Describe the four signals and the deploy markers and edit what comes back, rather than
  clicking twelve panels into existence. (A prompt.)

What it cannot do is tell you what you failed to instrument. Every one of those plays
reads the signals that exist, and the failure this stage is most concerned with — the job
that never ran, the business failure that threw nothing, the alert routed to a dead phone
number — produces no signal at all. An agent will summarise a dashboard confidently while
the thing that mattered is not on it.

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
- [ ] You know how to delete a person's data from your error tracker and your
      logs, and have checked the retention window on both
      ([08](08-security-audit.md))
- [ ] Key events logged as structured objects
- [ ] Health check verifies the database, not just the process
- [ ] External uptime monitoring is active
- [ ] Every configured alert is one you would act on at 2am
- [ ] Alerts route somewhere that interrupts you
- [ ] At least one alert has been fired deliberately and confirmed to arrive
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
