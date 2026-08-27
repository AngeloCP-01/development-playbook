import { expect, test } from 'vitest'
import { TRAPS } from './traps'
import { h2 } from './doc-source'

/**
 * The doc's traps are bolded leads followed by a paragraph. Counting them out
 * of the doc rather than pinning 8 here is the point: stage 04's plan counted
 * nine where the doc had seven, because an unbounded `indexOf` had run the
 * slice past the section.
 */
test('every trap in the doc is carried, and the count comes from the doc', () => {
  const leads = h2('Traps')
    .split('\n')
    .filter((l) => /^\*\*.+\*\*/.test(l))
  expect(TRAPS).toHaveLength(leads.length)
  expect(TRAPS).toHaveLength(8)
})

test("titles are the doc's bold leads verbatim, trailing full stop included", () => {
  const leads = h2('Traps')
    .split('\n')
    .filter((l) => /^\*\*.+\*\*/.test(l))
    .map((l) =>
      l
        .replace(/^\*\*/, '')
        .replace(/\*\*.*$/, '')
        .trim(),
    )
  expect(TRAPS.map((t) => t.title)).toEqual(leads)
})

test("the authorization trap keeps the doc's ranking of it", () => {
  const t = TRAPS.find((t) => t.id === 'no-authorization')
  expect(t?.body).toMatch(/most damaging omission in this doc/i)
})

test('the waitForTimeout trap keeps both the verdict and the mechanism', () => {
  const t = TRAPS.find((t) => t.id === 'wait-for-timeout')
  expect(t?.body).toMatch(/single largest source of E2E flakiness/i)
})
