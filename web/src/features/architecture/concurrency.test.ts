import { expect, test } from 'vitest'
import {
  CONCURRENCY_CASES,
  ISOLATION_LEVELS,
  LOCKING_STRATEGIES,
  MECHANISMS,
  scoreConcurrency,
} from './concurrency'

test('both locking strategies are carried, since the rule is a choice between them and not a single answer', () => {
  expect(LOCKING_STRATEGIES.map((s) => s.id)).toEqual([
    'optimistic',
    'pessimistic',
  ])
})

test('each strategy names when it is wrong, because a strategy without its failure case reads as the answer', () => {
  for (const s of LOCKING_STRATEGIES) {
    expect(s.useWhen.trim().length, `${s.id} useWhen`).toBeGreaterThan(0)
    expect(s.wrongWhen.trim().length, `${s.id} wrongWhen`).toBeGreaterThan(0)
  }
})

test('pessimistic names the human-in-the-gap case as its failure, which is the one the doc says catches people', () => {
  const p = LOCKING_STRATEGIES.find((s) => s.id === 'pessimistic')
  expect(p?.wrongWhen).toMatch(/person|human|reads their email|waits on/i)
})

test('optimistic carries the version-is-stored-data consequence, since that makes it a decide-now column', () => {
  const o = LOCKING_STRATEGIES.find((s) => s.id === 'optimistic')
  expect(o?.note).toMatch(/stored data|decide-now|expand-contract/i)
})

// The doc is specific that the default is not the strictest, and that reaching
// for the strictest is a comfortable way to ship the bug anyway. Carrying the
// two levels without the default, or without what serializable costs, turns a
// decision back into a setting.
test('both isolation levels are carried and read committed is marked the Postgres default, which is the fact that changes what you build', () => {
  expect(ISOLATION_LEVELS.map((l) => l.id)).toEqual([
    'read-committed',
    'serializable',
  ])
  const rc = ISOLATION_LEVELS.find((l) => l.id === 'read-committed')
  expect(rc?.isDefault).toBe(true)
})

test('serializable names the retry path as its cost, since that is code you did not previously need', () => {
  const s = ISOLATION_LEVELS.find((l) => l.id === 'serializable')
  expect(s?.costs).toMatch(/retry/i)
})

test('both levels give the same answer to what they cannot relate, because the limit is not something read committed has and serializable fixes', () => {
  for (const l of ISOLATION_LEVELS) {
    expect(l.cannot.trim().length, `${l.id} cannot`).toBeGreaterThan(0)
    expect(
      l.cannot,
      `${l.id} does not say the limit is across transactions`,
    ).toMatch(/transaction|person|human/i)
  }
})

test('the exercise runs three cases with three different answers, so the reader has to tell the mechanisms apart rather than repeat the one just taught', () => {
  expect(CONCURRENCY_CASES).toHaveLength(3)
  expect(new Set(CONCURRENCY_CASES.map((c) => c.answer)).size).toBe(3)
})

// "Setting SERIALIZABLE and believing the next problem is handled is a
// specific and comfortable way to ship it anyway." An exercise that never
// offers the comfortable wrong answer cannot catch anyone believing it.
//
// The claim is deliberately narrow. SSI would abort one writer in two of these
// three cases, so "it would not work" would be false; what is true is that it
// is never the tool the answer names, and every case has to say why rather
// than mark the reader wrong and move on.
test('a stricter isolation level is offered and is never what a case answers with, and every case says why rather than leaving it unexplained', () => {
  expect(MECHANISMS.map((m) => m.id)).toContain('serializable')
  expect(CONCURRENCY_CASES.map((c) => c.answer)).not.toContain('serializable')
  for (const c of CONCURRENCY_CASES) {
    expect(
      c.why,
      `${c.id} never says what a stricter isolation level does here`,
    ).toMatch(/isolation level|serializable/i)
  }
})

test('the mechanisms on offer are exactly the four the stage has taught, since an exercise is not the place to meet a name for the first time', () => {
  expect(MECHANISMS.map((m) => m.id)).toEqual([
    'optimistic',
    'pessimistic',
    'serializable',
    'constraint',
  ])
  for (const m of MECHANISMS) {
    expect(m.label.trim().length, `${m.id} label`).toBeGreaterThan(0)
  }
})

// The statement is the lesson rather than "put a version on the row", and the
// component says so out loud. Asserting the prose around a statement while
// leaving the statement itself unasserted is how a wrong one ships: an earlier
// version of the pessimistic case described SKIP LOCKED behaviour while
// quoting a bare FOR UPDATE, and nothing here could see it.
test('each strategy carries the statement it turns on, since that is what the panel claims the lesson is', () => {
  const o = LOCKING_STRATEGIES.find((s) => s.id === 'optimistic')
  expect(o?.sql).toMatch(/version = version \+ 1/)
  expect(o?.sql, 'the WHERE clause is the whole mechanism').toMatch(
    /version = \$2/,
  )
  const p = LOCKING_STRATEGIES.find((s) => s.id === 'pessimistic')
  expect(p?.sql).toMatch(/FOR UPDATE/)
})

// The queue shape needs SKIP LOCKED to behave the way a queue reads, and
// neither the doc nor this stage teaches it. So the pessimistic case must not
// be a queue: under a bare FOR UPDATE at read committed the second worker
// blocks, re-evaluates, finds the row no longer matches, and gets nothing.
test('the pessimistic case is same-row contention rather than a work queue, because a bare FOR UPDATE does not hand the second reader the next row', () => {
  const hotRow = CONCURRENCY_CASES.find((c) => c.answer === 'pessimistic')
  expect(hotRow?.scenario).not.toMatch(/queue|next unprocessed|next row/i)
  expect(hotRow?.why).toMatch(/same|that row|re-read/i)
})

// The trap the doc is emphatic about. A reader who has just learned optimistic
// locking answers this one wrong, which is exactly why it is scored rather
// than asserted.
test('the two-claims-on-one-shift case answers with the constraint, not with either lock, since neither lock protects a rule that spans rows', () => {
  const crossRow = CONCURRENCY_CASES.find((c) => c.id === 'cross-row')
  expect(crossRow?.answer).toBe('constraint')
  expect(crossRow?.why).toMatch(/spans rows|cross-row|different rows/i)
})

test('the human-in-the-gap case rules out isolation rather than choosing between locks, because that is the belief the doc says people ship on', () => {
  const gap = CONCURRENCY_CASES.find((c) => c.id === 'human-gap')
  expect(gap?.answer).toBe('optimistic')
  expect(gap?.why).toMatch(/isolation|serializable|same transaction/i)
})

test('every case explains itself whichever way it was answered, since the reasoning is the lesson and not the reward', () => {
  for (const c of CONCURRENCY_CASES) {
    expect(c.scenario.trim().length, `${c.id} scenario`).toBeGreaterThan(0)
    expect(c.why.trim().length, `${c.id} why`).toBeGreaterThan(0)
  }
})

test('scoring counts only what was answered, matching the other exercises in this stage', () => {
  const first = CONCURRENCY_CASES[0]
  expect(scoreConcurrency({})).toEqual({ answered: 0, correct: 0 })
  expect(scoreConcurrency({ [first.id]: first.answer })).toEqual({
    answered: 1,
    correct: 1,
  })
  expect(scoreConcurrency({ [first.id]: 'serializable' })).toEqual({
    answered: 1,
    correct: first.answer === 'serializable' ? 1 : 0,
  })
})
