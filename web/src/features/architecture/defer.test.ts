import { expect, test } from 'vitest'
import { DEFERRED_ITEMS } from './defer'

// "Not empty" was what this asserted, which every placeholder in the world
// satisfies: replacing all seven `problem` fields with "x" kept it green. Each
// field is a reviewed paragraph the extraction moved, so the assertion is that
// each is still a paragraph, still finished, and still its own.
test('the existing deferral list survived the extraction intact, since this moved data that was already reviewed', () => {
  expect(DEFERRED_ITEMS.length).toBeGreaterThan(0)
  expect(new Set(DEFERRED_ITEMS.map((i) => i.id)).size).toBe(
    DEFERRED_ITEMS.length,
  )

  for (const field of ['summary', 'problem', 'notYet', 'costsToday'] as const) {
    const texts = DEFERRED_ITEMS.map((i) => i[field].trim())
    expect(
      new Set(texts).size,
      `two entries share a ${field}, so one of them is a stand-in`,
    ).toBe(texts.length)
  }

  for (const i of DEFERRED_ITEMS) {
    expect(i.summary.trim().length, `${i.id} summary`).toBeGreaterThan(30)
    for (const field of ['problem', 'notYet', 'costsToday'] as const) {
      expect(i[field].trim().length, `${i.id} ${field}`).toBeGreaterThan(80)
      expect(
        i[field].trim(),
        `${i.id} ${field} does not end as a finished sentence`,
      ).toMatch(/[.?]$/)
    }
  }
})

// The doc lists six things that pass the deferral test, then one that fails it
// — multi-tenancy, which the last test in this file pins. Seven rows, six
// deferrals. CQRS was the one the port was missing, and it is a row in the same
// list rather than a separate "named but not taught" set, because that is what
// the doc makes it: an item that passes the test, deferred for a reason of its
// own.
test('all seven of the doc’s rows are carried, since a list missing one teaches a test the reader cannot apply to it', () => {
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

// `/separate|read|write/i` could not fail: "Event sourcing: storing every
// change as the source of truth, read back by replay." passes it on the word
// "read", and those are three of the commonest words in the topic. What
// distinguishes CQRS is two models, one per direction — so assert that, and
// assert that the definition is not event sourcing's. The relation between them
// is real and belongs in `notYet`, which is what the second half checks.
test('the CQRS entry does not fold event sourcing into itself, which is the conflation the doc separates', () => {
  const cqrs = DEFERRED_ITEMS.find((i) => i.id === 'cqrs')
  const problem = cqrs?.problem ?? ''

  expect(
    problem.match(/\bmodels?\b/gi) ?? [],
    'two models is the idea; one model is not CQRS',
  ).toHaveLength(2)
  expect(problem, 'the model you write through').toMatch(/\bwrit(e|ing)\b/i)
  expect(problem, 'the model you read through').toMatch(/\bread(ing)?\b/i)
  expect(
    problem,
    'the definition of CQRS is not the definition of event sourcing',
  ).not.toMatch(/event.sourc/i)

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
