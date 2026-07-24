import { expect, test } from 'vitest'
import { CUT_FEATURES, scoreCut } from './scoring'

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
  const answers = { 'create-invoice': true, 'dark-mode': true }
  expect(scoreCut(answers)).toEqual({ answered: 2, correct: 1 })
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
