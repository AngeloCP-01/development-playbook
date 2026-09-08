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
