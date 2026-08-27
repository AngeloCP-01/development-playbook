import { expect, test } from 'vitest'
import { ARTIFACTS } from './artifacts'
import { fences } from './doc-source'

const BLOCKS = fences()

test('the doc still has the three blocks this module was cut from', () => {
  expect(BLOCKS).toHaveLength(3)
})

test('the key list is pinned, so a new doc block does not surface here on its own', () => {
  expect(Object.keys(ARTIFACTS)).toEqual(['pricing', 'actions', 'checkout'])
})

/**
 * `toContain` over the whole-block array, never a substring match against one
 * block (D-66). A substring of a block is still contained, so containment
 * cannot see an artifact that has lost its last line — and the last line is
 * where the closing brace lives. The reader is meant to paste these.
 */
test.each(Object.entries(ARTIFACTS))(
  '%s equals a whole fenced block from the doc, not a substring of one',
  (key, artifact) => {
    const text = artifact.lines.map((l) => l.text).join('\n')
    expect(BLOCKS, key).toContain(text)
  },
)

test('every artifact carries at most one pivot, since a pivot is the line the panel turns on', () => {
  for (const [key, artifact] of Object.entries(ARTIFACTS)) {
    expect(
      artifact.lines.filter((l) => l.pivot === true).length,
      key,
    ).toBeLessThanOrEqual(1)
  }
})

/**
 * The three pivots, pinned as literals rather than read off the data. A test
 * shaped `expect(pivot).toBe(artifact.lines.find(l => l.pivot).text)` reads
 * both sides off one row and proves nothing.
 *
 * Each is the line its panel's judgment turns on, and each is a different kind
 * of judgment: an edge case that returns zero rather than a negative, an
 * assertion that an attacker was refused, and an assertion selected by what the
 * user can actually see.
 */
const pivotText = (key: keyof typeof ARTIFACTS) =>
  ARTIFACTS[key].lines.find((l) => l.pivot === true)?.text

test('the unit panel pivots on the edge case, not the happy path', () => {
  expect(pivotText('pricing')).toContain('never returns a negative total')
})

test('the integration panel pivots on the refusal, which the doc calls the more valuable test', () => {
  expect(pivotText('actions')).toContain(
    'refuses to update an invoice owned by someone else',
  )
})

test('the e2e panel pivots on the role-and-name selector', () => {
  expect(pivotText('checkout')).toContain(
    "getByRole('button', { name: 'Buy now' })",
  )
})
