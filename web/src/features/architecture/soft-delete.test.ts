import { expect, test } from 'vitest'
import { FILTER_RULE, SOFT_DELETE_MECHANICS } from './soft-delete'

test('all three mechanics are carried, since the gap was that the doc showed one and posed no choice', () => {
  expect(SOFT_DELETE_MECHANICS.map((m) => m.id)).toEqual([
    'column',
    'status',
    'archive-table',
  ])
})

test('exactly one is marked the default, because three peers is a menu rather than advice', () => {
  const defaults = SOFT_DELETE_MECHANICS.filter((m) => m.isDefault)
  expect(defaults).toHaveLength(1)
  expect(defaults[0].id).toBe('column')
})

test('every mechanic says when it is the wrong reach, since each of the three has a case where it is', () => {
  for (const m of SOFT_DELETE_MECHANICS) {
    expect(m.useWhen.trim().length, `${m.id} useWhen`).toBeGreaterThan(20)
    expect(m.wrongWhen.trim().length, `${m.id} wrongWhen`).toBeGreaterThan(20)
  }
})

// The status enum is the common alternative and the one the doc argues against
// on a specific ground: it conflates a lifecycle the row already has with
// whether the row exists at all. Losing that argument leaves three options and
// no reason to prefer any.
test('the status mechanic names the conflation as its cost, which is the argument against the option most people reach for', () => {
  const status = SOFT_DELETE_MECHANICS.find((m) => m.id === 'status')
  expect(status?.wrongWhen).toMatch(/lifecycle|conflat|at once|one thing/i)
})

// The half the doc skipped entirely. A filter every query must remember is a
// filter some query will forget, and the answer is structural rather than
// cultural — so the rule has to reject discipline by name.
test('the filter rule rejects remembering as the mechanism, which is the half that actually bites', () => {
  expect(FILTER_RULE, 'no structural answer offered').toMatch(
    /view|accessor|one place|repository/i,
  )
  expect(FILTER_RULE, 'remembering is not a mechanism').toMatch(
    /forget|remember|discipline/i,
  )
})

// It renders collapsed, because `tenancy` measured 4.1 screens with the three
// mechanics open. PATTERNS.md wants a one-line summary on a collapsed row, and
// every other accordion in this feature has one — the collapsed state is what
// the panel rule optimises the reader into, so it has to say something.
test('every mechanic has a scannable one-liner, since collapsed is the state the reader meets it in', () => {
  for (const m of SOFT_DELETE_MECHANICS) {
    expect(m.summary.trim().length, `${m.id} summary`).toBeGreaterThan(0)
    expect(m.summary.length, `${m.id} summary is a paragraph`).toBeLessThan(90)
  }
})
