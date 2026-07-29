import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { expect, test } from 'vitest'

// The stage 03 round (W-3.1) restructured "The work" from eight subsections to
// thirteen, running requirements -> HLD -> LLD. TD-22's complaint was that the
// stage went from sorting decisions by reversibility straight to a CREATE TABLE
// — low-level design with no high-level design above it to justify its shape.
//
// The order is load-bearing, not cosmetic. "The shapes a system can take" sits
// BEFORE "Start with one application" so the recommendation arrives derived
// rather than asserted (D-44). A reader who meets the answer first reads the
// taxonomy as a footnote, which is the failure mode the round exists to fix.
//
// Nothing else in the suite would catch a reorder or a dropped section: the
// stage-metadata tests check the H1 and the AI heading, and the glossary test
// checks terms. The seven-section template check that P-4 ran was an ad-hoc
// script and no longer exists (TD-5).
const DOC = fileURLToPath(
  new URL('../../../docs/03-architecture.md', import.meta.url),
)

const EXPECTED = [
  'Sort decisions by reversibility',
  'What this system has to be',
  'Model the domain first',
  'The shapes a system can take',
  'Start with one application',
  'Boundaries inside the monolith',
  'Sketch the system',
  'Design the database',
  'Design the API contracts',
  'Authentication and authorization',
  'Write the ADRs',
  'Defer aggressively',
  'AI in architecture',
]

/**
 * Just the body of `## The work`, so an `###` added under Traps or Scaling to a
 * team fails its own check rather than this one with a misleading message.
 */
function theWork(md: string): string {
  const start = md.indexOf('\n## The work')
  expect(
    start,
    'docs/03-architecture.md has no "## The work" section',
  ).not.toBe(-1)
  const rest = md.slice(start + 1)
  const next = rest.indexOf('\n## ', 1)
  return next === -1 ? rest : rest.slice(0, next)
}

test('stage 03 "The work" carries its thirteen subsections in order', () => {
  const md = readFileSync(DOC, 'utf8')
  const headings = [...theWork(md).matchAll(/^### (.+)$/gm)].map((m) =>
    m[1].trim(),
  )
  expect(headings).toEqual(EXPECTED)
})
