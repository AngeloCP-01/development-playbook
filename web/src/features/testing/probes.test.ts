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

/**
 * Finding 8 (minor drift) of Task 14's coverage walk: the negative probe's
 * input is `discountPercent: 200`, a negative *total* forced by an
 * over-100% discount, so a reader is never prompted to try a negative
 * *price* — a distinct edge case the doc's own edge-case list also asks
 * for. `catches` (hidden until the reader expands the row, so this costs
 * `unit`'s panel no headroom) now names both.
 */
test('the negative probe also prompts a negative price, not only a negative total from the discount', () => {
  const negative = PROBES.find((p) => p.id === 'negative')
  expect(negative?.catches).toMatch(/negative price/i)
})

/**
 * Rendered strings in this stage use the typographic apostrophe (`’`), the
 * same convention `triage.ts` follows — a straight `'` here was the one
 * exception.
 */
test('the negative probe uses the typographic apostrophe, matching triage.ts', () => {
  const negative = PROBES.find((p) => p.id === 'negative')
  expect(negative?.catches).toContain('doc’s own second test')
  expect(negative?.catches).not.toContain("doc's own second test")
})
