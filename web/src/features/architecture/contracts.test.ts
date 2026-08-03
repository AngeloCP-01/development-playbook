import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { expect, test } from 'vitest'
import {
  AUTHZ_PATTERNS,
  AUTHZ_SCENARIOS,
  CONTRACT_DECISIONS,
  CONTRACT_ROWS,
  ROUTE_ANSWERS,
  scoreAuthz,
} from './contracts'

const source = (file: string) =>
  readFileSync(fileURLToPath(new URL(file, import.meta.url)), 'utf8')

test('four contracts are sorted, because the sort is the decision and one row is not a sort', () => {
  expect(CONTRACT_ROWS).toHaveLength(4)
})

// Three costs across four rows: the pull row shares `not-yours` with the
// webhook, which is the point — both are somebody else's shape. The sort is
// still what the section teaches, so the spread has to survive a fifth row
// being added carelessly.
test('the sort still spreads across all three costs, since a table where every row costs the same teaches nothing', () => {
  expect(new Set(CONTRACT_ROWS.map((r) => r.cost)).size).toBe(3)
  expect(
    CONTRACT_ROWS.filter((r) => r.cost === 'not-yours')
      .map((r) => r.id)
      .sort(),
  ).toEqual(['pull', 'webhook'])
})

// Cold-reader run 4 stalled here: its shifts table is sourced from the
// restaurant's existing rota system by a nightly pull. That is received data
// whose shape it does not own, it is not a webhook, nobody pushes it, and the
// table had no row for it — so the reader transferred the webhook machinery by
// choice rather than by instruction.
test('data you pull is its own row, since received-and-not-pushed had no shape and is most integrations', () => {
  const pull = CONTRACT_ROWS.find((r) => r.id === 'pull')
  expect(pull, 'no row for data you pull or import').toBeDefined()
  expect(pull?.why, 'the cadence is yours where a webhook’s is not').toMatch(
    /cadence|when you ask|you decide/i,
  )
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

// `AuthzPatterns` renders every one of these as plain JSX, so an asterisk meant
// as emphasis arrives as punctuation. This module's instance was introduced by
// bd018a9 on this branch; the same class in `scoring.ts` predates it and is
// scoped out here rather than swept in silently.
test('nothing this module renders ships literal markdown, since the asterisks reach the page as punctuation', () => {
  const shipped: { where: string; text: string }[] = [
    ...CONTRACT_ROWS.flatMap((r) => [
      { where: `${r.id} contract`, text: r.contract },
      { where: `${r.id} why`, text: r.why },
    ]),
    ...ROUTE_ANSWERS.flatMap((a) => [
      { where: `${a.id} name`, text: a.name },
      { where: `${a.id} body`, text: a.body },
    ]),
    ...CONTRACT_DECISIONS.flatMap((d) => [
      { where: `${d.id} name`, text: d.name },
      { where: `${d.id} body`, text: d.body },
    ]),
    ...AUTHZ_PATTERNS.flatMap((p) => [
      { where: `${p.id} question`, text: p.question },
      { where: `${p.id} holdsFor`, text: p.holdsFor },
    ]),
    ...AUTHZ_SCENARIOS.flatMap((s) => [
      { where: `${s.id} scenario`, text: s.scenario },
      { where: `${s.id} why`, text: s.why },
    ]),
  ]

  for (const { where, text } of shipped) {
    expect(text, `${where} carries markdown`).not.toMatch(/\*/)
  }
})

// `AuthzPatterns` renders about a hundred pixels below `AuthPaths`, and its
// whole subject is that there are three patterns and the mistake is assuming
// there is only one. The closer above it defined authorization as "proving the
// record belongs to the caller" — which is ownership, one of the three — and
// then told the reader to decide the pattern and apply it uniformly, which is
// the framing characteristics.ts names as what produces cross-team privilege
// escalation. The line predates this branch; bd018a9 fixed the exercise and
// left the prose answering it wrongly in advance.
test('the auth-paths closer introduces the authorization exercise rather than pre-empting it with one of its three answers', () => {
  const prose = source('./AuthPaths.tsx')
  expect(
    prose,
    'ownership offered as the definition of authorization',
  ).not.toMatch(/belongs to the caller/i)
  expect(
    prose,
    'one pattern applied uniformly is the framing the exercise exists to break',
  ).not.toMatch(/apply it uniformly|decide the pattern/i)
  expect(prose, 'the doc\u2019s own definition is the one to use').toMatch(
    /may do this thing to this record/i,
  )
})

// The webhook's mechanism is "insert the event id first, then do the work, in
// one transaction" — chosen because the work reaches outside the database. A
// pull's work usually *is* the write, so the mechanism that fits is the other
// one: make the write itself repeatable. The row said "exactly as the webhook
// does", which points the reader at the wrong half of the pair and at a
// transaction shape that does not apply.
test('the pull row attributes upsert to the repeatable-write mechanism, not to the webhook’s insert-first-then-work', () => {
  const pull = CONTRACT_ROWS.find((r) => r.id === 'pull')
  expect(pull?.why, 'still points at the webhook').not.toMatch(
    /exactly as the webhook|as the webhook does/i,
  )
  expect(pull?.why, 'no mechanism named').toMatch(
    /second of the two|repeatable|second mechanism/i,
  )
})
