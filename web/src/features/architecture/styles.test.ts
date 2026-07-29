import { expect, test } from 'vitest'
import { CHARACTERISTICS } from './characteristics'
import {
  CHOSEN_STYLE_ID,
  DEPLOYMENT_STYLES,
  ORGANISATION_QUESTION,
  ORGANISATION_STYLES,
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
