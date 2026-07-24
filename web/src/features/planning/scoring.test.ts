import { expect, test } from 'vitest'
import {
  CUT_FEATURES,
  scoreCut,
  SLICES,
  scoreOrder,
  HORIZON_ITEMS,
  judgeHorizon,
} from './scoring'

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

test('every horizon item explains itself', () => {
  for (const i of HORIZON_ITEMS) {
    expect(i.why.trim().length, `${i.id} has no why`).toBeGreaterThan(0)
  }
})

test('all three horizons appear among the items, so the exercise exercises all three', () => {
  const used = new Set(HORIZON_ITEMS.map((i) => i.best))
  expect(used).toEqual(new Set(['now', 'next', 'later']))
})

test('the best horizon is recognised as best', () => {
  const item = HORIZON_ITEMS[0]
  expect(judgeHorizon(item.id, item.best).verdict).toBe('best')
})

test('the best verdict returns that item’s own explanation, not a generic placeholder', () => {
  // A hardcoded string that is the same for every branch would still satisfy
  // "verdict is best" and "why is non-empty" — this pins the why to the
  // specific item's prose, and the next case pins a *different* item's prose,
  // so a shared placeholder fails both.
  const item = HORIZON_ITEMS[0]
  const result = judgeHorizon(item.id, item.best)
  expect(result.why).toBe(item.why)
})

test('a second defensible horizon is called defensible, not wrong, because this is judgment', () => {
  const item = HORIZON_ITEMS.find((i) => i.alsoDefensible)
  expect(item, 'at least one item must be defensible two ways').toBeDefined()
  const result = judgeHorizon(item!.id, item!.alsoDefensible!)
  expect(result.verdict).toBe('defensible')
})

test('the defensible verdict also returns that item’s own explanation', () => {
  const item = HORIZON_ITEMS.find((i) => i.alsoDefensible)!
  const result = judgeHorizon(item.id, item.alsoDefensible!)
  expect(result.why).toBe(item.why)
  // Negative check: the defensible verdict must not be dressed up as the
  // "off" wording for some other item's best horizon.
  expect(result.why).not.toMatch(/fits better here/i)
})

test('a clearly wrong placement is called off, and says why', () => {
  const nowItem = HORIZON_ITEMS.find(
    (i) => i.best === 'now' && i.alsoDefensible !== 'later',
  )
  const result = judgeHorizon(nowItem!.id, 'later')
  expect(result.verdict).toBe('off')
  expect(result.why.trim().length).toBeGreaterThan(0)
})

test('the off verdict is grounded in the specific item, so two different wrong placements explain themselves differently', () => {
  // Guards against a single hardcoded "why" shared across every branch: if the
  // off explanation were a generic placeholder, these two calls — different
  // items, both wrongly placed — would return the identical string.
  const nowItem = HORIZON_ITEMS.find(
    (i) => i.best === 'now' && i.alsoDefensible !== 'later',
  )!
  const laterItem = HORIZON_ITEMS.find(
    (i) => i.best === 'later' && i.alsoDefensible !== 'now',
  )!
  const offA = judgeHorizon(nowItem.id, 'later')
  const offB = judgeHorizon(laterItem.id, 'now')
  expect(offA.why).not.toBe(offB.why)
  expect(offA.why).toContain(nowItem.why)
  expect(offB.why).toContain(laterItem.why)
})

test('the off verdict names the horizon that actually fits, since a label pointing at the wrong one teaches the opposite of the lesson', () => {
  // The prefix is what tells the reader where the item belongs. Pinning only the
  // trailing `why` leaves the label free to say "Now fits better here" about a
  // Later item — wrong, and invisible to a test that checks the explanation alone.
  const nowItem = HORIZON_ITEMS.find(
    (i) => i.best === 'now' && i.alsoDefensible !== 'later',
  )!
  const laterItem = HORIZON_ITEMS.find(
    (i) => i.best === 'later' && i.alsoDefensible !== 'now',
  )!
  expect(judgeHorizon(nowItem.id, 'later').why).toMatch(
    /^Now fits better here\./,
  )
  expect(judgeHorizon(laterItem.id, 'now').why).toMatch(
    /^Later fits better here\./,
  )
})

test('an unknown id is off rather than a crash, since ids come from user state', () => {
  const result = judgeHorizon('nope', 'now')
  expect(result.verdict).toBe('off')
  // Pinned to non-empty: this string is all a reader gets when their saved answer
  // references an item that no longer exists, so an empty one is a dead end.
  expect(result.why.trim().length).toBeGreaterThan(0)
})
