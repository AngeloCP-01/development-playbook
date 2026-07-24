import { expect, test } from 'vitest'
import { CUT_FEATURES, scoreCut, SLICES, scoreOrder } from './scoring'

test('the cut table carries all eight features from the doc, so the exercise matches the prose', () => {
  expect(CUT_FEATURES).toHaveLength(8)
})

test('exactly three features are core, because the definition of done fails without them', () => {
  expect(CUT_FEATURES.filter((f) => f.core)).toHaveLength(3)
})

test('every feature explains itself, since a revealed verdict without a reason teaches nothing', () => {
  for (const f of CUT_FEATURES) {
    expect(f.why.trim().length, `${f.id} has no why`).toBeGreaterThan(0)
  }
})

test('feature ids are unique, because answers are keyed by id', () => {
  expect(new Set(CUT_FEATURES.map((f) => f.id)).size).toBe(CUT_FEATURES.length)
})

test('scores only what was answered, so a partial run still reports honestly', () => {
  // Asymmetric on purpose: two matches (create-invoice, mark-paid) and one miss
  // (dark-mode). A symmetric fixture — one match, one miss — scores the same
  // whether the comparison is `===` or its negation, so it cannot tell a
  // correct implementation from an inverted one.
  const answers = {
    'create-invoice': true,
    'mark-paid': true,
    'dark-mode': true,
  }
  expect(scoreCut(answers)).toEqual({ answered: 3, correct: 2 })
})

test('counts matches against the core verdict, not mismatches, so guessing everything is core does not inflate the score', () => {
  const answers = Object.fromEntries(CUT_FEATURES.map((f) => [f.id, true]))
  // Only the three core features (create-invoice, mark-paid, overdue-list)
  // match a guess of `true`; the other five are wrong. If the comparison were
  // ever flipped, or the guard dropped so every answered id counted as
  // correct, this would report 5 or 8 instead of 3.
  expect(scoreCut(answers)).toEqual({ answered: 8, correct: 3 })
})

test('an empty run scores zero rather than dividing by nothing', () => {
  expect(scoreCut({})).toEqual({ answered: 0, correct: 0 })
})

test('ignores ids that are not features, so stale saved answers cannot inflate a score', () => {
  expect(scoreCut({ 'not-a-feature': true })).toEqual({
    answered: 0,
    correct: 0,
  })
})

const IDEAL = [
  'create-view',
  'mark-paid',
  'payments',
  'overdue',
  'clients',
  'auth',
]

test('there are six slices: the doc’s five plus the third-party one carrying the risk', () => {
  expect(SLICES).toHaveLength(6)
})

test('exactly one slice is the end-to-end starter and exactly one is the risky one', () => {
  expect(SLICES.filter((s) => s.endToEnd)).toHaveLength(1)
  expect(SLICES.filter((s) => s.risky)).toHaveLength(1)
})

test('the risky slice is the third-party integration, not auth, because that is what the doc names', () => {
  expect(SLICES.find((s) => s.risky)?.id).toBe('payments')
})

test('an order that opens end to end and probes the integration early satisfies both rules', () => {
  const verdict = scoreOrder(IDEAL)
  expect(verdict.endToEndFirst).toBe(true)
  expect(verdict.riskEarly).toBe(true)
})

test('an order that satisfies both rules gets the affirming note, and neither failure note', () => {
  // No coverage of notes existed for the all-correct path before this test — a
  // hardcoded notes string would pass every other assertion in this file, but
  // fails here because it never says both rules were satisfied.
  const joined = scoreOrder(IDEAL).notes.join(' ')
  expect(joined).toMatch(/both rules satisfied/i)
  expect(joined).not.toMatch(/does not work end to end/i)
  expect(joined).not.toMatch(/left it late/i)
})

test('payments first is right for the wrong reason: risk is early but nothing works end to end', () => {
  const verdict = scoreOrder([
    'payments',
    'create-view',
    'mark-paid',
    'overdue',
    'clients',
    'auth',
  ])
  expect(verdict.riskEarly).toBe(true)
  expect(verdict.endToEndFirst).toBe(false)
  // The end-to-end failure note must be the one that fires here, not the
  // risk-late note — riskEarly is already true, so nothing should be said
  // about the integration being left late.
  const joined = verdict.notes.join(' ')
  expect(joined).toMatch(/does not work end to end/i)
  expect(joined).not.toMatch(/left it late/i)
})

test('the integration left until last fails the risk rule even behind a correct opener', () => {
  const verdict = scoreOrder([
    'create-view',
    'mark-paid',
    'overdue',
    'clients',
    'auth',
    'payments',
  ])
  expect(verdict.endToEndFirst).toBe(true)
  expect(verdict.riskEarly).toBe(false)
  // Mirror of the case above: the risk-late note must fire, and the
  // end-to-end note must not, since endToEndFirst is already true here.
  const joined = verdict.notes.join(' ')
  expect(joined).toMatch(/left it late/i)
  expect(joined).not.toMatch(/does not work end to end/i)
})

test('early means within the first half: position 3 of 6 passes, position 4 does not', () => {
  const inside = [
    'create-view',
    'mark-paid',
    'payments',
    'overdue',
    'clients',
    'auth',
  ]
  const outside = [
    'create-view',
    'mark-paid',
    'overdue',
    'payments',
    'clients',
    'auth',
  ]
  expect(scoreOrder(inside).riskEarly).toBe(true)
  expect(scoreOrder(outside).riskEarly).toBe(false)
})

test('an incomplete order scores what it can rather than throwing', () => {
  const verdict = scoreOrder(['create-view'])
  expect(verdict.endToEndFirst).toBe(true)
  expect(verdict.riskEarly).toBe(false)
})

test('an empty order fails both rules and names both problems, not just one', () => {
  const verdict = scoreOrder([])
  expect(verdict.endToEndFirst).toBe(false)
  expect(verdict.riskEarly).toBe(false)
  expect(verdict.notes.length).toBeGreaterThan(0)
  const joined = verdict.notes.join(' ')
  expect(joined).toMatch(/nothing ordered yet/i)
  expect(joined).toMatch(/is unplaced/i)
})
