import { expect, test } from 'vitest'
import { PROBES } from './probes'
import { flat, section } from './doc-source'

/**
 * The six are the doc's own list, in the doc's order, pinned as literals. The
 * sentence they come from is the second of a two-sentence passage — the first
 * says edge cases are where bugs live, the second is the list that makes it
 * something a reader can do. That is the half stage 05 lost three times.
 */
test("the six probes are the doc's list, in the doc's order", () => {
  expect(PROBES.map((p) => p.id)).toEqual([
    'empty',
    'zero',
    'negative',
    'large',
    'null',
    'duplicates',
  ])
  const s = flat(section('Unit tests'))
  expect(s).toMatch(/Happy paths tend to work; edge cases are where bugs live/i)
  expect(s).toMatch(
    /empty input, zero, negative, very large, null, duplicates/i,
  )
})

test('every probe says what it would catch in the running example, not what it is', () => {
  for (const p of PROBES) {
    expect(p.catches, p.id).toMatch(/total|discount|tax|price|quantity|item/i)
  }
})

test('ids are unique', () => {
  expect(new Set(PROBES.map((p) => p.id)).size).toBe(PROBES.length)
})
