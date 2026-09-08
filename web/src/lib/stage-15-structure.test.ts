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
  'The four signals',
  'Health checks',
  'Alerts you will not learn to ignore',
  'Uptime monitoring from outside',
  'When nothing is reporting',
  'Jobs that nobody watches',
  'Dashboards',
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

// C1. The pre-round document defined `identifyUser` as
// `Sentry.setUser({ id: user.id, email: user.email })` and then required, in
// `## Definition of done`, "No secrets or personal data in error reports or
// logs". Customer email is personal data. Following the code made the
// checkbox unsatisfiable, and the document never said which half was wrong.
// Scoped to the fenced block, not the whole section: the prose that explains
// why an id is enough has to be able to say the word "email", and a
// section-wide assertion would forbid the teaching along with the defect.
test('C1: the error-context example sends no email address', () => {
  const section = doc().slice(
    doc().indexOf('### Errors that are actually useful'),
  )
  const open = section.indexOf('```ts')
  const block = section.slice(open, section.indexOf('```', open + 5))
  expect(
    block,
    'the Sentry user-context example still sends an email address',
  ).not.toMatch(/email/i)
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

/** The body of one `###` subsection, by heading. */
function section(heading: string): string {
  const md = doc()
  const start = md.indexOf(`### ${heading}`)
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
test('C4: the dashboard carries all four signals', () => {
  const dash = section('Dashboards')
  expect(dash).toMatch(/saturation/i)
})

// C5. Errors were defined as a rate ("fifty errors means nothing without a
// denominator") and sourced from Sentry, which is sampled, beforeSend-filtered
// and has no request denominator. The numerator and the denominator lived in
// different products and the doc never said how to divide them.
test('C5: the error-rate source can produce a denominator', () => {
  const signals = section('The four signals')
  expect(signals).toMatch(/denominator/i)
  expect(signals).toMatch(/counts every request/i)
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
test('the four signals each name a category before a product', () => {
  const signals = section('The four signals')
  expect(signals).toMatch(/CloudWatch/i)
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
