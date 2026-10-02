# Stage 15 (Observability) — cold-reader findings

**Date:** 2026-09-08. **Instrument:** two cold readers per D-54 and
`docs/learnings/cold-reader-testing.md`, each allowed to read only
`docs/15-observability.md` — no other file, no links followed, no web.

This is not a spec in the Problem/Goals/Non-goals sense. It is the evidence
`docs/superpowers/plans/2026-09-08-stage-15-doc-round.md` argues from, recorded
so an implementer working from a task slice can see why a change is being asked
for. Every finding below carries an ID the plan cites.

## Method

**Run 1 — completeness (beginner persona).** Task: build the stage's artifacts
for a product that is *not* the doc's own example, so nothing can be copied.
The scenario, reused verbatim on the re-run so results compare:

> **Loaf** — a Node/Express REST API for a five-location bakery chain's
> inventory and wholesale orders. Deployed on Fly.io, Postgres on Neon, a
> nightly background job that reconciles stock counts, a Stripe integration for
> wholesale invoices. Two developers, no ops person.

**Run 2 — consultability + audience fit.** Five symptom-shaped lookup questions
answered from headings alone before reading, then junior-developer and
SRE personas.

**Consultability score: 2/5.** Two HIT, two MISFILED, one MISS. The pattern:
the doc is organised by *tool* (Sentry, logs, signals, health checks, alerts,
uptime, dashboards) and readers look things up by *symptom* ("nothing is
reporting", "this is too noisy", "is this number bad"). Three of five questions
were symptom-shaped; three of five failed.

---

## C — Contradictions

The doc telling the reader two incompatible things. Both readers found C1
independently, which is the strongest signal in the set.

**C1 — the reference implementation ships the PII the checklist forbids.**
`### Errors that are actually useful` defines
`Sentry.setUser({ id: user.id, email: user.email })`. `## Definition of done`
requires "No secrets or **personal data** in error reports or logs." Customer
email is personal data. A reader who follows the code cannot tick the box.
Compounding it, two body rules are qualified — "full payment details", "full
card numbers" — so the body permits partial payment data that the checklist
forbids outright.

**C2 — alert on a new error type / never alert on a single error.** Adjacent
lists in `### Alerts you will not learn to ignore`. Worth alerting on: "A *new*
error type in production." Not worth alerting on: "Any single error." A new
error type on first occurrence is a single error. On a two-developer team
shipping regularly this is also the most reliable generator of the alert
fatigue the section opens by warning about.

**C3 — alert on symptoms, not causes / alert on database connections.** The
section bolds "**Alert on symptoms, not causes.**" and argues "CPU is at 80%"
is not actionable. Its own worth-alerting list contains "Database connections
near the limit" — the same species of number. The fix is the missing
distinction (a saturation number with a hard ceiling and no recovery path is
predictive of a symptom; a CPU percentage is not), **not** deleting the bullet.

**C4 — the four-signal dashboard shows three signals.** `## Artifacts` requires
"One dashboard with **the four signals** and deploy markers." `### Dashboards`
lists requests per minute, error rate, p95 latency, recent deploys.
**Saturation is absent** — the fourth signal was silently replaced by deploy
markers.

**C5 — an error rate whose numerator and denominator live in different
products.** `### The four signals` defines errors as "rate as a percentage of
requests, not an absolute count. Fifty errors means nothing without a
denominator", then assigns the signal to Sentry. Sentry is a sampled,
`beforeSend`-filtered exception tracker with no request denominator. The
metric the doc insists on is the one its own toolchain cannot produce.

**C6 — the clearest signal is not in the alert list.** `### The four signals`
says of traffic that "a sudden drop is one of the clearest possible signals
that something is badly broken." The worth-alerting list contains no
traffic-drop alert.

---

## A — Required by the stage, never taught

Each of these is an `## Artifacts` entry or a `## Definition of done` checkbox
of *this* stage. None is deferred to another stage, so each is a defect rather
than a boundary.

**A1 — `beforeSend` is bolded, required twice, and never shown.** "Configure
`beforeSend` to scrub aggressively" is the doc's only defence against the risk
it raises in bold, and it is a bare API name. The two-line `setContext`
passthrough gets a code block. No field list, no note that Sentry captures
request headers and bodies by default. A reader on Neon cannot know that a
connection string carries its password inline and lands in error messages.

**A2 — `logger` is undefined.** One occurrence, in the "Good" half of the
document's strongest teaching device, with no import, no library named, no
transport, no destination. The file's only `import` is Sentry's. A reader
copies the block, gets `logger is not defined`, and reverts to `console.log` —
the exact thing the block argues against. It is the only code in the document
that cannot be fixed by adding a plausible import, because the reader is not
told which package.

**A3 — deploy markers have no mechanism.** "Dashboard shows deploy markers" is
a DoD checkbox, and the doc never says how a marker gets onto a graph on any
stack. It is free and automatic on Vercel and deliberate work everywhere else;
the doc reads as though it costs nothing because on its own stack it does.

**A4 — external monitoring of a "real user path" assumes a homepage.** "Monitor
a real user path too — the health check can pass while the homepage throws." An
authenticated headless API has no homepage, and its real user paths mutate data
and charge cards. No synthetic account, no read-only canary, no warning against
a monitor that creates a real order every sixty seconds.

---

## M — Missing entirely

Ranked by how likely a reader is to be hurt by the omission.

**M1 — nothing detects a scheduled job that never ran.** A job that does not
fire produces no errors, no logs and no requests, so every mechanism in this
document reports healthy. The stage mentions background jobs twice, both times
assuming the job ran and failed. The missing category is inverted: the job
pings a monitor on success and the monitor alerts on *absence* of the ping.
Also absent: alerting on job duration, and on a run overrunning into the next.

**M2 — "nothing is reporting and something is still wrong" has no answer.** The
only lookup question with no answer anywhere in the document. Swallowed
catches, handled 4xx, a third party returning 200 with a failure body,
client-side failures, `beforeSend` filtering the event. **The material is on
the page twice and never named**: the health check contains
`catch { /* stays false */ }`, an exception deliberately discarded, and the log
example is `event: 'invoice.payment_failed'` — a business failure that throws
nothing.

**M3 — no correlation ID.** The exemplar log object has no `requestId`, no
`traceId`, no timestamp, no level, no service and no environment. Distributed
tracing is deferred to `## Scaling to a team` legitimately, but a per-request
id is not distributed tracing: it costs one field and it is what makes the
stage's own promise — "work out why without redeploying" — possible at two log
lines.

**M4 — where logs go, how long they live, what they cost.** "Log volume costs
money and buries signal" is the entire treatment, and it implies a paid
destination the doc never tells you to acquire. A reader on a container
platform does everything the stage says, has an incident on Thursday, and finds
Monday's logs are gone. Cost is in voice for this playbook — 01, 03, 06, 09 and
13 all discuss it — so its absence here is not a scope boundary.

**M5 — alerting arithmetic at low traffic.** "Errors — rate as a percentage of
requests" is correct at scale and inverts below it: at four requests a minute
overnight, one 500 is a 25% error rate and pages you; at lunchtime a broken
checkout path failing twenty orders is 2.5% and does not. No minimum-volume
gate, no absolute-count companion, no note that the right threshold changes
across the day.

**M6 — nothing verifies that the alerting works.** DoD asks "Every configured
alert is one you would act on at 2am" and never "you have confirmed once that
it arrives at 2am." An alert routed to a dead phone number is indistinguishable
from a healthy system until the incident. In a repository whose standard is
evidence over assertion, this is the conspicuous omission.

**M7 — certificate expiry is named as a failure mode with no countermeasure.**
`## Traps` says internal-only monitoring will not detect "DNS failures,
regional outages, or certificate expiry." `### Uptime monitoring from outside`
never mentions enabling certificate-expiry checking, which is a separate toggle
from an HTTP check.

**M8 — liveness versus readiness.** "Check real dependencies" is right for an
uptime prober and wrong for a platform health check that restarts or
deregisters on failure, where a thirty-second database blip becomes a rolling
restart of every instance. Not a solo simplification: Fly, Railway, ECS, Cloud
Run and Kubernetes all act on health-check status.

**M9 — quota exhaustion.** One error loop in a batch job burns a month of error
budget in minutes, after which you are blind and do not know it. No sampling,
no rate limiting, no spike protection, no alert on quota consumption.

Also noted, smaller: no timeout on the health check's dependency query, so the
realistic failure (a hung pool, not a refused connection) never returns the
`degraded` state the endpoint exists to report; and `invoice.payment_failed`
does not follow the `noun.verb_past_tense` rule stated eight lines below it.

---

## S — Structural

**S1 — content filed where the audience will not look.** Two of the five lookup
failures were this. "Baselines documented for error rate and p95 latency" is a
DoD checkbox and "**No baseline.**" is a trap, so the only *actionable*
statement about baselines is in a closing checklist and the only *explanation*
is in a list of mistakes. Neither is where a reader looks. Likewise the verb
for a noisy alert — "Review alert noise monthly. Delete alerts that never led
to action" — sits under `## Scaling to a team`, a heading that tells a solo
reader it is not for them.

**S2 — Traps duplicates the body 9 times out of 10.** Three near-verbatim.
The one original idea is "No baseline", which is the answer to a lookup
question, filed as a mistake instead of as instruction. The section is not
worthless — its phrasing is consistently sharper than the prose it repeats, so
it works as a mnemonic layer — but it must stop being the only home for
anything.

**S3 — `### Three things, in order of value` announces a taxonomy the doc
abandons.** Errors / metrics / traces, and everything after it is organised by
artifact instead. Traces get a third of the framing and one sentence of
coverage. Either fold its metrics line into the four signals and drop the rest,
or give traces an honest paragraph.

**S4 — the doc's real index is invisible.** Its most consultable claims are
bold lead-ins — "Log the events that matter, not everything", "every alert must
be actionable" — and neither is reachable by scanning headings.

---

## P — Playbook-level, found by checking neighbours

**P1 — `p50`/`p95`/`p99` is defined nowhere.** Used four times here and
cross-referenced to stage 09, which does not define it either — 09 *uses* it
("API responses under 300ms at p95") and asserts "measure at percentiles, never
averages". There is no `percentile` entry in `web/src/lib/terms.ts`. The most
repeated concept in the stage is undefined in all three places a reader would
look.

**P2 — `error-budget` is a glossary term pointing at a stage that never
mentions it.** `web/src/lib/terms.ts` tethers three terms to `15-observability`:
`golden-signals`, `slo`, `error-budget`. The doc defines the first as "The four
signals", mentions SLOs once in a team-scaling bullet, and never uses the phrase
"error budget" at all.

---

## Downgraded, or disproved

A reviewer is expected to disprove as well as confirm. These were raised and
did not survive checking.

**DISPROVED — "no triage procedure when an alert fires".** Run 1 rated this
missing and explicitly noted no other stage is cited for it. It could not see
other files. `docs/16-incident-management.md` carries *First five minutes*,
*Diagnosing*, *The runbook* and *Escalation*. This is a **boundary**; the fix is
a cross-reference, not a section.

**HELD, not accepted — "`Sentry.setUser` leaks identity across concurrent
requests".** True of naive usage on a long-lived server, but Sentry's Node SDK
isolates scope per request through its HTTP integration, and the doc's own
`@sentry/nextjs` flavour isolates per invocation. The *documentation* gap is
real — the doc gives no scope guidance at all — but the strong claim must be
checked against the installed SDK version before any sentence is written.

**DOWNGRADED to Minor — `Object.values(checks).every(Boolean)` breaks on
extension.** True in principle (a `'degraded'` string is truthy, a latency of 0
is falsy) but speculative about code the reader invented. Worth one line if the
health-check section is being rewritten anyway; not worth a task.

**BOUNDARY — retention and deletion of personal data already sent.**
`docs/08-security-audit.md` covers personal data and runs quarterly. One clause
and a cross-reference here, not a section.

**BOUNDARY — on-call arrangements for exactly two people.** `## Scaling to a
team` defers on-call deliberately. Fair, though two developers is the
playbook's own target case, so a single sentence on acknowledgement is worth
considering.

**CORRECTION to `KICKOFF.md`, not to the doc.** Two claims in the handoff are
wrong and were believed going in. The doc has **8** `###` subsections, not 9.
And `stage-metadata.test.ts` does not "fail any `ready: true` stage whose doc
lacks that heading" — `AI_SECTION_STAGES` is an explicit list, deliberately so,
"so the section lands with the doc amendment at the start of a stage round
rather than at the end when `ready` flips". Reading it also found that
`11-ci-cd` is missing from that list although stage 11 shipped with an AI
section, so the guard has a hole.


## Re-run, after the fix waves

**2026-09-09, Task 14.** The readers examined the Stage 15 document at `1243f92`.
While they ran, the interrupted Task 12/13 reviews closed: Task 12 was clean;
Task 13 needed its two closing dividers moved below the new list items. That
formatting-only correction is `382bbde`; a token comparison confirmed unchanged
prose, and the structure/citation checks passed **43/43**. No findings below are
silently treated as fixed by that formatting change.

### Method and limits

A fresh completeness reader used the **same Loaf scenario quoted under Method**,
reading only the stage document. It produced an artifact plan covering error
tracking, request-correlated logs, a log destination and retention policy, the
four-signal dashboard with deploy markers, baselines, separate health endpoints,
a read-only canary, external monitoring, reconciliation-job monitoring, actionable
alerts and expected-business-outcome counts. It could identify the artifacts but
could not implement every provider-specific step for Express/Fly.io/Neon from this
document alone. The scope judgment for that limitation is recorded below.

A separate fresh lookup reader chose headings before reading the corresponding
sections. **The original record did not retain all five questions.** Repository
and memory searches did not recover them. This pass preserved three recorded
themes and fixed two new questions, so **5/5 is a new baseline, not a measured
improvement from the earlier 2/5**. Future reruns can use these exact questions:

| Question | Heading chosen before reading | Result |
|---|---|---|
| A user reports failure but nothing is reporting; where should I look? | When nothing is reporting | HIT |
| Alerts are too noisy; how do I tune or retire them? | Alerts you will not learn to ignore | HIT |
| Is this error-rate or p95 number bad; how do I establish normal? | The four signals | HIT |
| My API has no public homepage; how can an external monitor check a real path safely? | Uptime monitoring from outside | HIT |
| How do I connect an error report to the logs for its request? | Structured logs | HIT |

All five destinations contained an answer. A lookup HIT does not establish code
correctness: the canary was findable and still has the runtime defect below.
The reader found the material useful for junior developers and introductory for
SREs; deeper service policy and wiring remain application decisions.

### Original findings, reconciled with the file

| IDs | Result after checking |
|---|---|
| C1 | **Still open, I3 below.** Removing email did not reconcile the absolute personal-data prohibition with a resolvable user ID. |
| C2, C3, C4, C5, C6 | **Closed.** New-signature exception, hard-ceiling saturation exception, fourth dashboard signal, shared numerator/denominator and traffic-drop alert are explicit. |
| A1 | **Original omission closed:** `beforeSend` is shown. Its remaining coverage problem is I4. |
| A2 | **Original omission closed, M1 remains.** The document now defines and names Pino's logger. The reader called it undefined in the health route; that route still omits the import and application DB declarations. Do not conflate missing module wiring with no logger definition anywhere. |
| A3 | **Closed as a mechanism.** Post-success deploy markers have a timestamp and CLI example; Fly-specific wiring is outside the two-platform round. |
| A4 | **Pattern taught, implementation incomplete:** the authenticated read-only canary exists, but I1 can hide its failure. |
| M1, M2, M3, M4, M5, M6, M7, M9 | **Original omissions closed.** Heartbeats, silence, request correlation, retention/cost, low-volume arithmetic, alert-delivery proof, certificate expiry and quota are taught. I5 retains a job-verification gap. |
| M8 | **Partially closed, I6.** Definitions are present, but the platform instruction conflates restarting with removing from traffic. The completeness reader marked this closed; controller checking disproved that conclusion. |
| P1, P2 | **Closed.** Percentile thresholds and separate request/time error-budget units are defined. |
| S1, S3 | **Covered by the new lookup check and body additions.** Baselines and alert disposal have body homes; tracing has an explanation of its current boundary. |
| S2, S4 | **Deferred as before.** Traps is the house mnemonic layer; bold-lead-in navigation belongs to the port. |

### Task 15 fix queue

**I1 (blocking) — canary failure returns success status.** Introduced by the round's
canary example, reproduced from its actual fenced code. A successful query with no
matching order returns HTTP `200` with `{"ok":false}`. A status-only monitor misses
the failed assertion. Define the expected empty-state policy, return a failing status
when that assertion fails, and verify both result branches. Do not make a legitimate
empty table an accidental outage without stating what the canary expects.

**I2 (blocking) — health logging drops the exception.** Introduced by the health
example's new diagnostic log. With the shown default Pino configuration,
`logger.warn({ event, error })` emits `error:{}` for an Error. The comment promises
the reason survives. An `err` control preserves it, but blindly logging raw exception
text could violate the stage's own redaction policy. Preserve useful diagnostics
through an explicit safe serialization policy, then test the emitted record.

**I3 (blocking) — C1 persists as an inconsistent data policy.** The document recommends
an opaque identifier precisely because it resolves to a person, while Definition of
done forbids personal data without exception. Narrow the policy to the deliberately
allowed identifiers and require minimization, retention and deletion for them.
The existing deletion link is present; the cold reader's suggestion that no deletion
rule exists was too broad.

**I4 (blocking) — arbitrary context bypasses the demonstrated scrubber.** Pre-existing
`addContext(key, data: Record<string, unknown>)` accepts arbitrary records. The new
hook covers selected headers, request data and exception values, not those records,
breadcrumbs or every other SDK surface. The prose acknowledges deny-list limits but
the helper still invites unrestricted context. Constrain the example to allowlisted
fields and verify synthetic secrets against the payload surfaces it actually uses;
do not claim a universal scrubber from a short list of patterns.

**I5 (blocking) — duration and overlap have no completion evidence.** The new job
section requires watching slow and overlapping runs, but the added checklist only
verifies heartbeat absence. Add checkable evidence for both behaviors. The reader's
forty-minute example is illustrative; it is not a universal threshold to copy.

**I6 (blocking) — platform restart and routing checks are conflated.** The new health
section sends every platform check that “restarts or deregisters” to liveness. Those
actions serve different purposes: restart decisions use liveness; routing decisions
need readiness. Kubernetes explicitly distinguishes these effects in its
[probe documentation](https://kubernetes.io/docs/concepts/workloads/pods/probes/),
checked 2026-09-09. Teach the action-to-check mapping and qualify platform mechanisms
that combine replacement and routing. Also explain why a dependency affecting one
feature need not make the entire instance unready; the reader raised this as the
unresolved Stripe-readiness policy. A full Stripe design is not required here.

**M1 — clarify snippet boundaries.** The logger is defined, but the health route does
not import it and its DB/schema dependencies are implicit. Annotate the application
scenery or show the imports when correcting I2; the scratch declarations must not be
mistaken for proof of a standalone copy-paste module.

### Findings that do not expand this round

- **Fly.io/Express/Neon cookbook:** a real transfer limitation for Loaf, not a new
  requirement to implement a third platform. D-94 scoped this round to Vercel and AWS.
  The principles should transfer; adapter code and provider selection remain work
  for that application.
- **Stripe webhook lifecycle contract:** receipt, signature checks, processing and
  invoice correlation are application/integration design. Stage 15 teaches counting
  important outcomes; it cannot select Loaf's complete event contract.
- **Response, ownership and prerequisites:** incident response points to Stage 16;
  source maps to Stage 04; deletion to Stage 08. Ownership and monthly review already
  appear under Scaling to a team. The lookup reader did not read that section, so its
  ownership concern is not a whole-document omission.
- **Baseline seasonality, refresh cadence, token lifecycle and deeper tracing:** useful
  operational depth, deferred. Complete middleware wiring can be illustrated when
  clarifying snippet boundaries, without porting this document to Express.

### Executable evidence

All eight TypeScript fences were combined, with the Task 0 Node-SDK substitution,
distinct names for the two GET handlers, and declared application DB/schema/id
scenery. This checks the examples together against the scratch Node SDK; it does
not establish a deployed Next.js integration.

```text
$ python3 /private/tmp/stage15-codex-harness/extract.py
Extracted 8 TypeScript blocks; only SDK adapter, route name disambiguation and app dependency declarations added.
$ ./node_modules/.bin/tsc --noEmit
```

Both commands exited 0; TypeScript produced no diagnostics. Scratch dependencies:
Sentry 10.73.0, Pino 10.3.1, TypeScript 7.0.2. Runtime transpilation used the site's
TypeScript 5.9.3 API. Offline probes used synthetic values and a controlled database:

```text
$ node runtime.mjs
{"probe":"sentry beforeSend","headers":{"accept":"application/json"},"hasData":false,"exceptionValues":["connect [redacted] failed","provider [redacted] refused [redacted]"]}
{"probe":"logger request correlation","correlation":{"probe.b":"request-b","probe.a":"request-a"}}
{"probe":"pino Error serialization","errorKey":{},"errControl":{"type":"Error","message":"database unavailable"}}
{"probe":"logger redaction regression scaffold","status":"PASS","leaked":[]}
{"probe":"health success","status":200,"body":{"status":"ok","checks":{"database":true}}}
{"probe":"health rejected dependency","status":503,"body":{"status":"degraded","checks":{"database":false}},"loggedError":{}}
{"probe":"health hung dependency","status":503,"body":{"status":"degraded","checks":{"database":false}},"elapsedMs":2004}
{"probe":"canary unauthorized","status":404,"body":"not found"}
{"probe":"canary present result","status":200,"body":{"ok":true}}
{"probe":"canary empty result","status":200,"body":{"ok":false}}
{"probe":"heartbeat placement","calls":[{"url":"https://heartbeat.invalid/task","method":"POST"}]}
{"probe":"finding summary","findings":[{"id":"canary-status","reproduced":true,"evidence":"empty query result returned HTTP 200"},{"id":"health-error-serialization","reproduced":true,"evidence":"Pino emitted error={}"}]}
```

The runtime harness exits 0 when its probes reproduce the expected findings; that
status does **not** say the examples are defect-free. The safe-header/exception
scrubbing cases, request isolation, configured logger redaction, health success and
timeout, bad-token canary response and success-only heartbeat placement passed.
I1 and I2 were reproduced. Task 15 remains necessary.

No full app gate was rerun for this findings-only record. The interactive port,
reference sheet and production promotion remain deferred. **Not merged or deployed.**
