import { expect, test } from 'vitest'
import { LAYERS } from './layers'
import { flat, section } from './doc-source'

test('three layers, ascending, one feature', () => {
  expect(LAYERS.map((l) => l.id)).toEqual(['unit', 'integration', 'e2e'])
})

/**
 * The volumes are the doc's own words, pinned as literals. "Many / Some / Few"
 * is the distribution's whole claim compressed into three words, and a
 * paraphrase ("lots", "a handful") would keep the shape while losing the
 * doc's language.
 */
test("the volumes are the doc's, not a paraphrase", () => {
  expect(LAYERS.map((l) => l.volume)).toEqual(['Many', 'Some', 'Few'])
  const s = section('The distribution')
  expect(s).toMatch(/\*\*Many unit tests\*\*/)
  expect(s).toMatch(/\*\*Some integration tests\*\*/)
  expect(s).toMatch(/\*\*Few E2E tests\*\*/)
})

/**
 * The chain: each layer's blind spot is why the next one exists. Asserted as a
 * property of the set rather than by matching prose, so an editor who rewrites
 * a `blind` string still has to leave one there.
 */
test("every layer names what it cannot see, because that is the next layer's reason to exist", () => {
  for (const l of LAYERS) {
    expect(l.blind.length, l.id).toBeGreaterThan(30)
  }
})

test("the doc's claim about integration tests is carried, both halves", () => {
  const s = flat(section('The distribution'))
  expect(s).toMatch(/best value-per-test in the whole suite/i)
  expect(s).toMatch(
    /most real bugs live between the layers rather than inside them/i,
  )
})
