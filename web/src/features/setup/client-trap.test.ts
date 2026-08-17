import { expect, test } from 'vitest'
import { flat, section } from './doc-source'
import { CLIENT_FAILURE, GATES } from './client-trap'

const ENV = section('5. Environment variables, validated at boot')

// The whole point of the panel is that four of the five gates the stage spends
// an afternoon wiring are silent here. A set with two catchers is a different,
// much less interesting lesson.
test('exactly one gate catches the client-component failure, and it is loading the page', () => {
  const catching = GATES.filter((g) => g.catchesIt)
  expect(catching).toHaveLength(1)
  expect(catching[0].id).toBe('browser')
})

// Read out of the doc rather than asserted from memory: if the doc ever grows a
// gate that does catch it, this fails instead of the panel quietly lying.
test('the doc still says every wired gate stays green and only the browser shows it', () => {
  expect(flat(ENV)).toContain(
    'Every gate this stage wires stays green; only loading the page in a browser shows it.',
  )
})

test('the four wired gates come in the order the stage wires them, with the browser last', () => {
  expect(GATES.map((g) => g.id)).toEqual([
    'build',
    'checks',
    'tests',
    'ci',
    'browser',
  ])
})

test('every gate says why it is silent or why it fires, since a verdict without a reason is a quiz answer', () => {
  for (const gate of GATES) {
    expect(gate.label.trim().length, `${gate.id} label`).toBeGreaterThan(0)
    expect(gate.why.trim().length, `${gate.id} why`).toBeGreaterThan(40)
  }
})

// The failure shape is the reveal. Three claims, all in the doc: the build
// succeeds, the server-rendered HTML is correct, and it dies on hydration.
test('the failure description carries all three parts of the doc shape, not just "it breaks"', () => {
  expect(CLIENT_FAILURE).toMatch(/build/i)
  expect(CLIENT_FAILURE).toMatch(/server-rendered HTML|SSR/i)
  expect(CLIENT_FAILURE).toMatch(/hydrat/i)
})

test('the doc is still the source of that shape, so a rewrite there fails here first', () => {
  expect(flat(ENV)).toContain(
    '`pnpm build` succeeds, the server-rendered HTML is correct, and the page dies on hydration',
  )
})
