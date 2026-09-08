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
