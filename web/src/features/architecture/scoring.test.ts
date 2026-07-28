import { expect, test } from 'vitest'
import { DECISIONS, scoreReversibility } from './scoring'

test('the table carries six decisions, matching the exercise the stage describes', () => {
  expect(DECISIONS).toHaveLength(6)
})

test('the set is balanced three and three, so guessing one way scores half', () => {
  expect(DECISIONS.filter((d) => d.expensive)).toHaveLength(3)
  expect(DECISIONS.filter((d) => !d.expensive)).toHaveLength(3)
})

test('two rows are marked arguable, because a set of six gimmes teaches nothing', () => {
  expect(DECISIONS.filter((d) => d.arguable)).toHaveLength(2)
})

test('every decision explains itself, since a revealed verdict without a reason teaches nothing', () => {
  for (const d of DECISIONS) {
    expect(d.why.trim().length, `${d.id} has no why`).toBeGreaterThan(0)
  }
})

test('every decision names its undo cost, which is the axis the exercise is actually about', () => {
  for (const d of DECISIONS) {
    expect(d.undo.trim().length, `${d.id} has no undo cost`).toBeGreaterThan(0)
  }
})

test('decision ids are unique, because answers are keyed by id', () => {
  expect(new Set(DECISIONS.map((d) => d.id)).size).toBe(DECISIONS.length)
})

test('scores only what was answered, so a partial run still reports honestly', () => {
  // Asymmetric on purpose: two matches and one miss. A symmetric fixture scores
  // the same whether the comparison is `===` or its negation, so it cannot tell
  // a correct implementation from an inverted one.
  const answers = {
    'auth-strategy': true, // expensive — correct
    'invoice-delete': true, // expensive — correct
    'folder-names': true, // cheap — wrong
  }
  expect(scoreReversibility(answers)).toEqual({ answered: 3, correct: 2 })
})

test('guessing everything expensive scores exactly the expensive ones, so pessimism does not inflate the score', () => {
  const answers = Object.fromEntries(DECISIONS.map((d) => [d.id, true]))
  expect(scoreReversibility(answers)).toEqual({ answered: 6, correct: 3 })
})

test('credits a correct cheap call, so a reader who rightly shrugs at folder names is counted', () => {
  // Every other fixture guesses `true`, which cannot distinguish `expensive === guess`
  // from a scorer that ignores the guess and counts expensive decisions alone.
  expect(scoreReversibility({ 'folder-names': false })).toEqual({
    answered: 1,
    correct: 1,
  })
})

test('unknown ids are ignored rather than counted, so stale answers cannot inflate a score', () => {
  expect(scoreReversibility({ 'not-a-decision': true })).toEqual({
    answered: 0,
    correct: 0,
  })
})

test('an empty run scores zero rather than dividing by nothing', () => {
  expect(scoreReversibility({})).toEqual({ answered: 0, correct: 0 })
})
