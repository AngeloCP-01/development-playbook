import { expect, test } from 'vitest'
import {
  AUTHZ_PATTERNS,
  AUTHZ_SCENARIOS,
  CONTRACT_DECISIONS,
  CONTRACT_ROWS,
  ROUTE_ANSWERS,
  scoreAuthz,
} from './contracts'

test('three contracts are sorted, because the sort is the decision and one row is not a sort', () => {
  expect(CONTRACT_ROWS).toHaveLength(3)
})

test('the three costs are all different, so the row you are in is what changes the answer', () => {
  expect(new Set(CONTRACT_ROWS.map((r) => r.cost)).size).toBe(3)
})

test('the webhook row is not yours to change, which is the row that carries idempotency in with it', () => {
  const hook = CONTRACT_ROWS.find((r) => r.id === 'webhook')
  expect(hook?.cost).toBe('not-yours')
})

test('the verb problem has two workable answers, since the doc says picking either consistently beats agonising', () => {
  expect(ROUTE_ANSWERS).toHaveLength(2)
  for (const a of ROUTE_ANSWERS) {
    expect(a.example.trim().length, `${a.id} example`).toBeGreaterThan(0)
  }
})

test('three decisions are made before the first row exists', () => {
  expect(CONTRACT_DECISIONS).toHaveLength(3)
})

test('three authorization patterns, because the mistake is assuming there is only one', () => {
  expect(AUTHZ_PATTERNS.map((p) => p.id)).toEqual([
    'ownership',
    'role',
    'membership',
  ])
})

test('every pattern states the question it asks, which is what makes them distinguishable at all', () => {
  for (const p of AUTHZ_PATTERNS) {
    expect(p.question.trim().length, `${p.id} question`).toBeGreaterThan(0)
    expect(p.holdsFor.trim().length, `${p.id} holdsFor`).toBeGreaterThan(0)
  }
})

test('every scenario answers with a pattern that exists, so a typo cannot make one unanswerable', () => {
  const ids = new Set(AUTHZ_PATTERNS.map((p) => p.id))
  for (const s of AUTHZ_SCENARIOS) {
    expect(s.answer.length, `${s.id} answers nothing`).toBeGreaterThan(0)
    for (const a of s.answer) {
      expect(ids, `${s.id} answers ${a}`).toContain(a)
    }
  }
})

// The doc's point is that a system with a shared workspace uses all three. An
// exercise whose answers were all "ownership" could be passed without reading
// it, and would teach the exact mistake the section exists to correct.
test('all three patterns are the answer to at least one scenario, so the set cannot be passed by always answering ownership', () => {
  const used = new Set(AUTHZ_SCENARIOS.flatMap((s) => s.answer))
  for (const p of AUTHZ_PATTERNS) {
    expect(used, `${p.id} is never the answer`).toContain(p.id)
  }
})

test('every scenario explains itself, since a revealed verdict without a reason teaches nothing', () => {
  for (const s of AUTHZ_SCENARIOS) {
    expect(s.why.trim().length, `${s.id} has no why`).toBeGreaterThan(0)
  }
})

test('scoring counts only what was answered, so a partial run still reports honestly', () => {
  const [a, b, c] = AUTHZ_SCENARIOS
  const wrongForC = [AUTHZ_PATTERNS.find((p) => !c.answer.includes(p.id))!.id]
  // Asymmetric on purpose: two right and one wrong. A one-right-one-wrong
  // fixture scores the same whether the comparison is `===` or its negation,
  // so it cannot tell a working scorer from an inverted one.
  const result = scoreAuthz({
    [a.id]: a.answer,
    [b.id]: b.answer,
    [c.id]: wrongForC,
  })
  expect(result).toEqual({ answered: 3, correct: 2 })
})

// The doc's authorization section teaches that patterns COMPOSE — a claim needs
// Role AND Membership, because role alone is true of every manager in the company
// including one who manages a different team. A whole-branch review found the
// singular framing produces cross-team privilege escalation.
//
// The exercise has to teach the same thing or it teaches the defect: a reader who
// answers "role" for the manager-approves-a-swap case must NOT be told they were
// right, because that is precisely the wrong answer the doc exists to prevent.
test('the manager-approves-a-swap scenario needs two patterns, since role alone grants across teams', () => {
  const swap = AUTHZ_SCENARIOS.find((s) => s.id === 'approve-swap')!
  expect(swap.answer).toEqual(['role', 'membership'])
})

test('answering only role for a conjunction scenario is wrong, because the partial rule grants rather than errors', () => {
  expect(scoreAuthz({ 'approve-swap': ['role'] })).toEqual({
    answered: 1,
    correct: 0,
  })
})

test('order does not matter when a scenario needs two patterns, since a conjunction is not a sequence', () => {
  expect(scoreAuthz({ 'approve-swap': ['membership', 'role'] })).toEqual({
    answered: 1,
    correct: 1,
  })
})

test('scoring ignores ids it does not know, so stale storage cannot inflate a score', () => {
  expect(scoreAuthz({ 'not-a-scenario': ['ownership'] })).toEqual({
    answered: 0,
    correct: 0,
  })
})
