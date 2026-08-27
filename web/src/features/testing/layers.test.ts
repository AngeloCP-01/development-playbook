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

/**
 * A prior version of this test only ever read `docs/06-testing.md` — it
 * never touched `LAYERS`, so it stayed green through a rewrite that dropped
 * the figure entirely. The doc's "best value-per-test" ranking claim itself
 * is restored into the app in Figure 1 (`triage`'s `DISTRIBUTION`, not this
 * module — `unit`'s panel has no headroom left for it), so the app-side
 * check here is a different, already-true `LAYERS` literal that carries the
 * same "bugs live between the layers" idea the doc-side check above pins:
 * the integration layer's own blind spot, which is exactly a bug a layer
 * below cannot see. Hand-typed, not sliced out of `LAYERS` at runtime.
 *
 * The ranking claim itself ("best value-per-test in the whole suite") is
 * pinned against the app in `Testing.test.tsx`'s Figure 1 integration-tier
 * test, not here — follow the trail there rather than assuming it is
 * unguarded.
 */
test('the doc still ranks integration tests highest, and the integration layer names what it cannot see', () => {
  const s = flat(section('The distribution'))
  expect(s).toMatch(/best value-per-test in the whole suite/i)
  expect(s).toMatch(
    /most real bugs live between the layers rather than inside them/i,
  )

  const integration = LAYERS.find((l) => l.id === 'integration')
  expect(integration?.blind).toMatch(
    /it calls the action directly, so it cannot see a form that never submits/i,
  )
})
