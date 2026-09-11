import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { expect, test } from 'vitest'

// The stage 15 doc round (W-3.12) rewrites `## The work` from eight
// subsections to twelve, and moves two pieces of content out of
// `## Definition of done` and `## Scaling to a team` into the body.
//
// Both moves are load-bearing. A cold reader asked five symptom-shaped
// lookup questions of the pre-round document and scored 2/5; two of the
// three failures were content filed where the audience will not look —
// baselines existed only as a DoD checkbox and a trap, and the verb for a
// noisy alert lived under a heading that tells a solo reader it is not for
// them.
//
// Nothing else in the suite can see a dropped or reordered section. The
// metadata tests check the H1 and the AI heading; the glossary test checks
// terms. Neither reads `## The work`.
const DOC = fileURLToPath(
  new URL('../../../docs/15-observability.md', import.meta.url),
)

const EXPECTED = [
  'Three things, in order of value',
  'Errors that are actually useful',
  'Structured logs',
  'Where logs go, and what they cost',
  'The four signals',
  'Health checks',
  'Alerts you will not learn to ignore',
  'Uptime monitoring from outside',
  'When nothing is reporting',
  'Jobs that nobody watches',
  'Dashboards',
  'AI in observability',
]

/**
 * Just the body of `## The work`, so an `###` added under `## Traps` fails
 * its own check rather than this one with a misleading message.
 */
function theWork(md: string): string {
  const start = md.indexOf('\n## The work')
  expect(
    start,
    'docs/15-observability.md has no "## The work" section',
  ).not.toBe(-1)
  const rest = md.slice(start + 1)
  const next = rest.indexOf('\n## ', 1)
  return next === -1 ? rest : rest.slice(0, next)
}

test('stage 15 "The work" carries its subsections in order', () => {
  const md = readFileSync(DOC, 'utf8')
  const headings = [...theWork(md).matchAll(/^### (.+)$/gm)].map((m) =>
    m[1].trim(),
  )
  expect(headings).toEqual(EXPECTED)
})

/** The whole document, for claims that are not scoped to `## The work`. */
function doc(): string {
  return readFileSync(DOC, 'utf8')
}

/** The body of one `##` section, by heading. */
function topLevelSection(heading: string): string {
  const md = doc()
  const anchor = new RegExp(
    `^## ${heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*$`,
    'm',
  )
  const start = md.search(anchor)
  expect(start, `docs/15-observability.md has no "## ${heading}"`).not.toBe(-1)
  const rest = md.slice(start)
  const next = rest.indexOf('\n## ', 1)
  return next === -1 ? rest : rest.slice(0, next)
}

// C1. The pre-round document defined `identifyUser` as
// `Sentry.setUser({ id: user.id, email: user.email })` and then required, in
// `## Definition of done`, "No secrets or personal data in error reports or
// logs". Customer email is personal data. Following the code made the
// checkbox unsatisfiable, and the document never said which half was wrong.
// Scoped to the fenced blocks, not the whole section: the prose that explains
// why an id is enough has to be able to say the word "email", and a
// section-wide assertion would forbid the teaching along with the defect.
// Every block, not the first — the section gained a second one (beforeSend),
// and a guard that reads only block one stops guarding as soon as the
// document grows.
test('C1: no code example in the error section sends an email address', () => {
  const errors = section('Errors that are actually useful')
  const blocks = [...errors.matchAll(/```ts\n([\s\S]*?)```/g)].map((m) => m[1])
  expect(blocks.length, 'no fenced ts block found').toBeGreaterThan(0)
  for (const block of blocks) {
    expect(block, 'a code example still sends an email address').not.toMatch(
      /email/i,
    )
  }
})

test('C1: the document says why an opaque id is enough', () => {
  expect(doc()).toMatch(/resolves? to a person in your own database/i)
})

// The two body rules were qualified — "full payment details", "full card
// numbers" — which permitted the partial payment data the DoD forbids
// outright. The qualifier is the defect: last four plus expiry is still
// personal data on someone else's infrastructure.
test('C1: the scrubbing rules are not qualified by "full"', () => {
  const md = doc()
  expect(md).not.toMatch(/full payment details/i)
  expect(md).not.toMatch(/full card numbers/i)
})

/**
 * The body of one `###` subsection, by heading.
 *
 * Anchored to a whole line. A plain `indexOf('### Structured logs')` also
 * matches an inline mention of that heading in another section's prose, and
 * when one was written during this round it silently re-pointed three
 * unrelated tests at the wrong slice.
 */
function section(heading: string): string {
  const md = doc()
  const anchor = new RegExp(
    `^### ${heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*$`,
    'm',
  )
  const start = md.search(anchor)
  expect(start, `docs/15-observability.md has no "### ${heading}"`).not.toBe(-1)
  const rest = md.slice(start)
  const next = rest.indexOf('\n### ', 1)
  const capped = next === -1 ? rest : rest.slice(0, next)
  const upper = capped.indexOf('\n## ', 1)
  return upper === -1 ? capped : capped.slice(0, upper)
}

// C2. "A new error type in production" sat in the worth-alerting list and
// "Any single error" in the not-worth list, two bullets apart. A new error
// type on first occurrence is a single error, so the reader was told both to
// page and not to page on the same event.
test('C2: the not-worth-alerting list no longer forbids what the list above requires', () => {
  const alerts = section('Alerts you will not learn to ignore')
  expect(alerts).not.toMatch(/^- Any single error$/m)
  expect(alerts).toMatch(/signature you have never seen/i)
})

// C3. The section bolds "Alert on symptoms, not causes" and then alerts on a
// database connection count. The distinction it was missing: a resource with
// a hard ceiling that does not recover on its own is worth alerting on before
// it becomes a symptom, because crossing it is a cliff rather than a slope.
test('C3: the symptoms-not-causes rule states its exception', () => {
  const alerts = section('Alerts you will not learn to ignore')
  expect(alerts).toMatch(/hard ceiling/i)
  expect(alerts).toMatch(/does not recover on its own/i)
})

// C4. `## Artifacts` required "the four signals" on one dashboard; the
// Dashboards section listed three of them plus deploy markers. Saturation —
// the signal most likely to be the actual incident on a small deployment —
// was the one dropped.
// Asserted as list items. The first version of this test matched /saturation/i
// anywhere in the section, which the defence paragraph below the list also
// satisfies — deleting the actual bullet left the suite green.
test('C4: the dashboard carries all four signals', () => {
  const dash = section('Dashboards')
  expect(dash).toMatch(/^- Requests per minute/m)
  expect(dash).toMatch(/^- Error rate/m)
  expect(dash).toMatch(/^- p95 latency/m)
  expect(dash).toMatch(/^- Saturation\b/m)
})

// C5. Errors were defined as a rate ("fifty errors means nothing without a
// denominator") and sourced from Sentry, which is sampled, beforeSend-filtered
// and has no request denominator. The numerator and the denominator lived in
// different products and the doc never said how to divide them.
// The first version asserted /denominator/i, which the section already said
// before this round, and /counts every request/i, which the table's Traffic
// row satisfies — so deleting the entire load-bearing paragraph left it green.
// It now pins the teaching itself.
test('C5: error rate is not sourced from the error tracker', () => {
  const signals = section('The four signals')
  expect(signals).toMatch(/rate\* does not come from your error tracker/)
  expect(signals).toMatch(
    /Both\s+halves come from the layer that counts every request/,
  )
  expect(signals).toMatch(/sampled numerator/)
})

// C6. The doc calls a traffic drop "one of the clearest possible signals that
// something is badly broken" and then left it out of the alert list.
test('C6: a traffic collapse is in the alert list', () => {
  const alerts = section('Alerts you will not learn to ignore')
  expect(alerts).toMatch(
    /traffic (dropping|collapsing|falling)|requests? (per minute )?(dropping|falling) to/i,
  )
})

// The transfer failure underneath all three: every signal states its category
// before it names a product, so a reader on neither platform still knows what
// to look for.
// The first version asserted only that "CloudWatch" appeared somewhere and one
// old sentence did not. Product-first prose naming CloudWatch passed it — the
// exact stage-transfer failure this round exists to fix. It now pins the table,
// whose "Where it comes from" column is what carries the category.
test('the four signals each name a category before a product', () => {
  const signals = section('The four signals')
  expect(signals).toMatch(
    /^\| Signal \| Where it comes from \| Vercel \| AWS \|$/m,
  )
  expect(signals).toMatch(/^\| Latency \|/m)
  expect(signals).toMatch(/^\| Traffic \|/m)
  expect(signals).toMatch(/^\| Errors \|/m)
  expect(signals).toMatch(/^\| Saturation \|/m)
  expect(signals).not.toMatch(/Vercel Analytics covers latency and traffic/)
})

// A1. "Configure beforeSend to scrub aggressively" was the doc's only defence
// against the risk it raises in bold, and it was a bare API name — no field
// list, no note that Sentry captures request headers and bodies by default.
test('A1: beforeSend is shown, not just named', () => {
  const errors = section('Errors that are actually useful')
  expect(errors).toMatch(/beforeSend\s*\(/)
  expect(errors).toMatch(/authorization/i)
  expect(errors).toMatch(/connection string/i)
})

// A2. `logger` appeared exactly once, in the "Good" half of the document's
// strongest teaching device, with no import and no library named. It is the
// only code in the document that could not be fixed by adding a plausible
// import, because the reader was not told which package.
//
// The call site is matched by pattern rather than by `logger.error(`: the
// same task drops the declined-card example to `warn`, so pinning the level
// here would have made this test fail for the fix rather than the defect.
test('A2: logger is constructed before it is used', () => {
  const logs = section('Structured logs')
  const construction = logs.indexOf('src/lib/logger.ts')
  const use = logs.search(/logger\.(warn|error|info|debug)\(/)
  expect(construction, 'no logger construction block').toBeGreaterThan(-1)
  expect(use, 'no logger call site').toBeGreaterThan(-1)
  expect(construction).toBeLessThan(use)
})

// The doc logged a declined card at `error`, which inflates the error rate it
// tells you to alert on. It showed no other level anywhere.
test('A2: the document states a level policy', () => {
  const logs = section('Structured logs')
  expect(logs).toMatch(/\bwarn\b/)
  expect(logs).toMatch(/expected outcome|routine business|not a fault/i)
})

// A3. "Dashboard shows deploy markers" was a DoD checkbox with no mechanism
// given for any stack — free and automatic on Vercel, deliberate work
// everywhere else, and the doc read as though it cost nothing.
test('A3: deploy markers have a mechanism', () => {
  const dash = section('Dashboards')
  expect(dash).toMatch(/release|annotation/i)
  expect(dash).toMatch(/deploy step|CI|workflow/i)
})

// A4. The only worked example for "monitor a real user path" was a homepage.
// An authenticated API has none, and its real paths mutate data and charge
// cards — a monitor hitting one every sixty seconds is a load test against
// your own payment provider.
test('A4: monitoring an authenticated API is covered', () => {
  const uptime = section('Uptime monitoring from outside')
  expect(uptime).toMatch(/canary/i)
  expect(uptime).toMatch(/writes nothing|read-only|without writing/i)
})

// M7. `## Traps` named certificate expiry as something internal monitoring
// will not catch, and no section ever said to switch the check on.
test('A4: certificate expiry has a countermeasure, not just a trap', () => {
  const uptime = section('Uptime monitoring from outside')
  expect(uptime).toMatch(/certificate/i)
})

// M2. The only lookup question with no answer anywhere: "a user reports
// checkout failed but the error tracker shows nothing". The material was on
// the page twice — a swallowed catch in the health-check example and a
// business failure in the logging example — and the lesson was never drawn.
test('M2: the document names the failures that raise no exception', () => {
  const silence = section('When nothing is reporting')
  expect(silence).toMatch(/swallow|caught and discarded/i)
  expect(silence).toMatch(/200/)
  expect(silence).toMatch(/absence/i)
})

// M1. A scheduled job that never runs produces no errors, no logs and no
// requests, so every mechanism in this stage reports healthy. The doc
// mentioned background jobs twice, both times assuming the job ran and failed.
test('M1: a job that never ran is detectable', () => {
  const jobs = section('Jobs that nobody watches')
  expect(jobs).toMatch(/heartbeat|dead man/i)
  expect(jobs).toMatch(/finally/)
  expect(jobs).toMatch(/CloudWatch/)
})

test('the two silence sections sit after uptime monitoring', () => {
  const md = doc()
  expect(md.indexOf('### Uptime monitoring from outside')).toBeLessThan(
    md.indexOf('### When nothing is reporting'),
  )
  expect(md.indexOf('### When nothing is reporting')).toBeLessThan(
    md.indexOf('### Jobs that nobody watches'),
  )
})

// M3. The exemplar log object was event/userId/invoiceId/reason/amountCents —
// no join key. Distributed tracing is deferred to Scaling to a team, which is
// fair, but a per-request id is not distributed tracing: it is one field, and
// without it "work out why" fails at two log lines.
test('M3: log lines carry a request id', () => {
  const logs = section('Structured logs')
  expect(logs).toMatch(/requestId/)
  expect(logs).toMatch(/AsyncLocalStorage|x-request-id/i)
})

test('M3: the request id joins logs to the error tracker', () => {
  const logs = section('Structured logs')
  expect(logs).toMatch(/setTag/)
})

// M4. "Log volume costs money" was the whole treatment, and it implied a paid
// destination the doc never told you to acquire. stdout on a container
// platform is a stream, not storage.
test('M4: the document says where logs go and how long they live', () => {
  const where = section('Where logs go, and what they cost')
  expect(where).toMatch(/retention/i)
  expect(where).toMatch(/stream, not storage|not storage/i)
  expect(where).toMatch(/never expire/i)
})

// M8. "Check real dependencies" is right for an uptime prober and wrong for a
// platform health check that restarts on failure, where a 30-second database
// blip becomes a rolling restart of every instance.
test('M8: liveness and readiness are distinguished', () => {
  const health = section('Health checks')
  expect(health).toMatch(/liveness/i)
  expect(health).toMatch(/readiness/i)
  expect(health).toMatch(/restart/i)
})

// M5. "Rate as a percentage of requests" is correct at scale and inverts below
// it: at four requests a minute, one 500 is a 25% error rate.
test('M5: the alerting section handles low traffic', () => {
  const alerts = section('Alerts you will not learn to ignore')
  expect(alerts).toMatch(/minimum|at least \d+ requests/i)
})

// M6. The DoD asked whether every alert is one you would act on at 2am and
// never asked whether any of them arrives.
test('M6: the document says to test that an alert arrives', () => {
  const md = doc()
  expect(md).toMatch(/fire (a|one) test alert|trigger it on purpose/i)
})

// M9. One error loop in a batch job burns a month of quota in minutes, after
// which you are blind and do not know it.
test('M9: quota exhaustion is covered', () => {
  const errors = section('Errors that are actually useful')
  expect(errors).toMatch(/quota|spike protection/i)
})

// S1. "Baselines documented for error rate and p95 latency" was a DoD
// checkbox and "No baseline" was a trap, so the only actionable statement
// lived in a closing checklist and the only explanation in a list of
// mistakes. A cold reader looking for "what does normal look like" found
// neither.
test('S1: baselines are taught in the body, not only in the checklist', () => {
  const signals = section('The four signals')
  expect(signals).toMatch(/baseline/i)
  expect(signals).toMatch(/write (them|the numbers) down|record/i)
})

// P1. p50/p95/p99 appeared throughout this stage, while neither this stage,
// stage 09 nor the glossary defined them. The threshold wording matters when
// measurements tie, and p99 still says nothing about the slowest request.
test('P1: percentiles are thresholds that include ties, not maxima', () => {
  const signals = section('The four signals')
  expect(signals).toMatch(/p95[^.]*95[^.]*at or below/i)
  expect(signals).toMatch(/p99[^.]*threshold[^.]*not (?:a |the )?maximum/i)
  expect(signals).toMatch(/percentiles do not average/i)
})

// P2. A request-success SLO budgets failed requests; only a time-based uptime
// SLO turns 0.1% into minutes. Conflating the two gives request volume a time
// budget it cannot have.
test('P2: the error budget keeps request and time-based SLO arithmetic separate', () => {
  const scaling = topLevelSection('Scaling to a team')
  expect(scaling).toMatch(/request-based[^.]*99\.9%[^.]*0\.1%[^.]*requests/i)
  expect(scaling).toMatch(
    /time-based[^.]*99\.9%[^.]*43\.2 minutes[^.]*30 days/i,
  )
  expect(scaling).toMatch(/error budget/i)
})

// S1. The disposal instruction for the commonest solo alerting failure was
// under a heading that tells solo readers it is not for them.
test('S1: deleting a noisy alert is in the alerting section', () => {
  const alerts = section('Alerts you will not learn to ignore')
  expect(alerts).toMatch(/delete/i)
  expect(alerts).toMatch(/raise the threshold|lengthen the window|tune/i)
})

// S3. The taxonomy promised three things and delivered two.
test('S3: traces get more than an announcement', () => {
  const three = section('Three things, in order of value')
  expect(three).toMatch(/you will know when you need|until then/i)
})

// The new mechanisms need mnemonic reminders in the existing Traps layer.
test('Traps covers silent jobs and forgotten retention policies', () => {
  const traps = topLevelSection('Traps')
  expect(traps).toMatch(/silence|never ran/i)
  expect(traps).toMatch(/retention/i)
})

test('alert delivery hands the reader to incident management for the response', () => {
  expect(section('Alerts you will not learn to ignore')).toMatch(
    /16-incident-management\.md/,
  )
})

// These guards pin the explanations missing from the gathered-reference pass.
test('structured logging teaches redaction boundaries as well as configuration', () => {
  const logs = section('Structured logs')
  expect(logs).toMatch(/redact:\s*\{/)
  expect(logs).toMatch(/free.text/i)
  expect(logs).toMatch(/case.sensitive/i)
})

test('the logging level ladder gives routine events a level below error', () => {
  const logs = section('Structured logs')
  for (const level of ['debug', 'info', 'warn', 'error', 'fatal']) {
    expect(logs).toContain(`| \`${level}\` |`)
  }
})

test('observability explains investigating questions not anticipated in monitoring', () => {
  const opening = section('Three things, in order of value')
  expect(opening).toMatch(/monitoring/i)
  expect(opening).toMatch(/did not anticipate/i)
})

test('identifying log fields are not recommended as metric labels', () => {
  expect(section('Structured logs')).toMatch(/cardinality/i)
  expect(section('Structured logs')).toMatch(/metric labels/i)
})

test('OpenTelemetry has a purpose and a boundary rather than a bare product name', () => {
  const team = topLevelSection('Scaling to a team')
  expect(team).toMatch(/OpenTelemetry/)
  expect(team).toMatch(/vendor.neutral/i)
  expect(team).toMatch(/backend/i)
})

test('dashboard requirements can be fulfilled across separate collection tools', () => {
  const dashboards = section('Dashboards')
  expect(dashboards).toMatch(/data sources/i)
  expect(dashboards).toMatch(/Grafana/)
})

// A routine decline is counted, not escalated as an unexpected condition.
test('the routine card decline example follows the info-level policy', () => {
  const logs = section('Structured logs')
  expect(logs).toMatch(/logger\.info\(\{\s*event: 'invoice\.payment_declined'/)
  expect(logs).toMatch(/routine business outcome[^:]*:\s*it is\s*`info`/)
})

// --- Task 15 fix wave: findings from the re-run against the merged doc. ---

// I1. `Response.json({ ok: latest !== undefined })` always returns HTTP 200,
// so a status-only monitor cannot see the canary's own assertion fail. An
// established service takes orders continuously, so no row at all is a read
// (or write) path failure, not a legitimately empty table.
test('I1: the canary fails its HTTP status when its assertion fails', () => {
  const uptime = section('Uptime monitoring from outside')
  expect(uptime).toMatch(/status:\s*503/)
  expect(uptime).toMatch(/ok:\s*false/)
  expect(uptime).toMatch(/no row at[\s/]+all/i)
})

// I2. `logger.warn({ event, error })` emits `error:{}` under pino's default
// serialization, because only keys with a registered serializer survive.
test('I2: the logger has a serializer for the error field the health check logs', () => {
  const logs = section('Structured logs')
  expect(logs).toMatch(/serializers:\s*\{/)
  expect(logs).toMatch(/stdSerializers\.err/)
})

// I3. Definition of done forbade all personal data while the reference code
// recommends an opaque id that resolves to one. Narrow the rule to what is
// deliberately allowed, and require minimization alongside the existing
// deletion requirement.
test('I3: Definition of done narrows to the allowed identifiers, not a blanket ban', () => {
  const md = doc()
  expect(md).toMatch(/no personal data beyond/i)
  expect(md).toMatch(/minimi[sz]ed/i)
})

// I4. `addContext(key, data: Record<string, unknown>)` accepted arbitrary
// records the scrubber never inspects — only headers, bodies and exception
// values are covered by `beforeSend`.
test('I4: addContext is constrained to values the scrubbing policy can reach', () => {
  const errors = section('Errors that are actually useful')
  expect(errors).toMatch(/SafeContext/)
  expect(errors).toMatch(/allowlist/i)
})

// I5. The jobs section required watching duration and overlap but the only
// checkable evidence was heartbeat absence.
test('I5: job duration and overlap have checkable evidence, not only prose', () => {
  const jobs = section('Jobs that nobody watches')
  expect(jobs).toMatch(/durationMs/)
  expect(jobs).toMatch(/advisory lock/i)
})

// I6. "Restarts or deregisters" sent both decisions to the same liveness
// endpoint. A restart decision and a routing decision are different
// questions, and readiness need not be all-or-nothing across dependencies.
test('I6: restart and routing decisions read different endpoints', () => {
  const health = section('Health checks')
  expect(health).toMatch(/routing decision/i)
  expect(health).toMatch(/restart decision/i)
  expect(health).toMatch(/need not fail every route/i)
})

// M1. The health route used `logger` and `db` with no import shown, so the
// scratch code could be mistaken for a standalone, copy-pasteable module.
test('M1: the health check shows its logger and db imports', () => {
  const health = section('Health checks')
  expect(health).toMatch(/import \{ logger \}/)
  expect(health).toMatch(/import \{ db \}/)
})
