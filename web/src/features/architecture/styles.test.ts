import { expect, test } from 'vitest'
import { CHARACTERISTICS } from './characteristics'
import {
  CHOSEN_STYLE_ID,
  DEPLOYMENT_STYLES,
  ORGANISATION_QUESTION,
  ORGANISATION_STYLES,
  SCALING_MOVES,
  STYLE_TRACE,
} from './styles'

test('four deployment shapes are compared, because a comparison of one is advice taken on faith', () => {
  expect(DEPLOYMENT_STYLES).toHaveLength(4)
})

test('every deployment shape says what it buys, what it costs, and what would have to be true', () => {
  for (const s of DEPLOYMENT_STYLES) {
    expect(s.buys.trim().length, `${s.id} buys`).toBeGreaterThan(0)
    expect(s.costs.trim().length, `${s.id} costs`).toBeGreaterThan(0)
    expect(s.trueWhen.trim().length, `${s.id} trueWhen`).toBeGreaterThan(0)
  }
})

test('the style this stage teaches is one of the four it compares, so the conclusion is on the table with its alternatives', () => {
  expect(DEPLOYMENT_STYLES.map((s) => s.id)).toContain(CHOSEN_STYLE_ID)
})

test('the microservices row names its benefit as organisational, which is the row people adopt for the wrong reason', () => {
  const micro = DEPLOYMENT_STYLES.find((s) => s.id === 'microservices')
  expect(micro?.buys).toMatch(/team/i)
})

test('internal organisation is a separate axis with two options, since collapsing it into the deployment question is the bad question the doc names', () => {
  expect(ORGANISATION_STYLES).toHaveLength(2)
  expect(ORGANISATION_STYLES.map((s) => s.id)).toEqual(['layered', 'hexagonal'])
})

test('the organisation axis is decided on one stated question, not on taste', () => {
  expect(ORGANISATION_QUESTION.trim().length).toBeGreaterThan(0)
})

// The trace is what makes the choice follow from the characteristics rather
// than from taste. If a trace row names a characteristic that no longer
// exists, the two files have drifted and the argument has a hole in it.
test('every trace row names a real characteristic, so styles.ts and characteristics.ts cannot drift apart', () => {
  const ids = new Set(CHARACTERISTICS.map((c) => c.id))
  for (const t of STYLE_TRACE) {
    expect(ids, `trace names ${t.characteristicId}`).toContain(
      t.characteristicId,
    )
  }
})

test('the trace covers three characteristics, matching the example pick it is derived from', () => {
  expect(STYLE_TRACE).toHaveLength(3)
})

// ── D-52 / TD-23: the scaling cluster the doc grew after the port ──────────

test('scaling names both axes and the precondition, since scaling out without statelessness is the thing that does not work', () => {
  const ids = SCALING_MOVES.map((m) => m.id)
  expect(ids).toContain('stateless')
  expect(ids).toContain('scale-up')
  expect(ids).toContain('scale-out')
})

test('statelessness is marked as the precondition rather than a peer, because more instances is not an option without it', () => {
  const stateless = SCALING_MOVES.find((m) => m.id === 'stateless')
  expect(stateless?.precondition).toBe(true)
  expect(SCALING_MOVES.filter((m) => m.precondition)).toHaveLength(1)
})

test('the serverless-to-Postgres pooling edge is carried, since it is the one that bites a solo developer on their first deploy', () => {
  const pooling = SCALING_MOVES.find((m) => m.id === 'pooling')
  expect(pooling).toBeDefined()
  expect(pooling?.what).toMatch(/pool/i)
})

// The doc names this caveat specifically because the stage teaches
// SELECT … FOR UPDATE, and a pooler in transaction mode breaks anything
// relying on session state. Now that locking is its own step, dropping the
// caveat would leave two steps quietly contradicting each other.
test('pooling carries the transaction-mode caveat, since this stage teaches the session-state feature it breaks', () => {
  const pooling = SCALING_MOVES.find((m) => m.id === 'pooling')
  expect(pooling?.catch).toMatch(
    /transaction mode|session state|advisory lock/i,
  )
})

test('read replicas say what they do not do, because "spreads load" without "writes still go to one place" is how people reach for one to fix a write problem', () => {
  const replicas = SCALING_MOVES.find((m) => m.id === 'read-replicas')
  expect(replicas?.what).toMatch(/write/i)
  expect(
    replicas?.catch,
    'replica lag is where eventual consistency stops being theory',
  ).toMatch(/lag|behind/i)
})

test('every move says what it is, so none of them is a name on a list', () => {
  for (const m of SCALING_MOVES) {
    expect(m.name.trim().length, `${m.id} name`).toBeGreaterThan(0)
    expect(m.what.trim().length, `${m.id} what`).toBeGreaterThan(0)
  }
})
