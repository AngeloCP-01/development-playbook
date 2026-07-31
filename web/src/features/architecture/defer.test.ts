import { expect, test } from 'vitest'
import { DEFERRED_ITEMS } from './defer'

test('the existing deferral list survived the extraction intact, since this moved data that was already reviewed', () => {
  expect(DEFERRED_ITEMS.length).toBeGreaterThan(0)
  expect(new Set(DEFERRED_ITEMS.map((i) => i.id)).size).toBe(
    DEFERRED_ITEMS.length,
  )
  for (const i of DEFERRED_ITEMS) {
    expect(i.problem.trim().length, `${i.id} problem`).toBeGreaterThan(0)
    expect(i.notYet.trim().length, `${i.id} notYet`).toBeGreaterThan(0)
    expect(i.costsToday.trim().length, `${i.id} costsToday`).toBeGreaterThan(0)
  }
})

// The doc lists CQRS as one of the things that passes the deferral test, and
// the port had six of its seven. It is not a separate "named but not taught"
// set — it is a row in the same list, deferred for a reason of its own.
test('all seven of the doc’s deferrals are carried, since a list missing one teaches a test the reader cannot apply to it', () => {
  const ids = DEFERRED_ITEMS.map((i) => i.id)
  expect(ids).toContain('event-sourcing')
  expect(ids).toContain('cqrs')
  expect(DEFERRED_ITEMS).toHaveLength(7)
})

// The boundary is the whole reason the doc spends four lines on event sourcing
// rather than one: people talk themselves into thinking they are already doing
// it. An entry that only says "almost certainly not" leaves that intact.
test('event sourcing carries the boundary, because an audit table alongside normal rows is the thing readers mistake for it', () => {
  const es = DEFERRED_ITEMS.find((i) => i.id === 'event-sourcing')
  expect(es?.problem).toMatch(/source of truth|the log is the truth/i)
  expect(
    [es?.problem, es?.notYet, es?.costsToday].join(' '),
    'the audit-table boundary is missing',
  ).toMatch(/audit table|history of who approved/i)
})

test('the CQRS entry does not fold event sourcing into itself, which is the conflation the doc separates', () => {
  const cqrs = DEFERRED_ITEMS.find((i) => i.id === 'cqrs')
  expect(cqrs?.problem).toMatch(/separate|read|write/i)
  expect(
    cqrs?.notYet,
    'it travels with event sourcing rather than being it',
  ).toMatch(/travels with|alongside|same reason/i)
})

// One item fails the deferral test and the list says which. Losing that flag
// turns a section about a tie-break into a list of six things not to build.
test('exactly one item is marked as failing the test, since the tie-break is the section’s point', () => {
  const failing = DEFERRED_ITEMS.filter((i) => i.failsTest)
  expect(failing).toHaveLength(1)
  expect(failing[0].id).toBe('multi-tenancy')
})
