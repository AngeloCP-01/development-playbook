import { expect, test } from 'vitest'
import { LOOP_STAGES } from './loop'
import { fences } from './doc-source'

/** The loop is the doc's first fenced block — a flow, not code. */
const BLOCK = fences()[0]

test("the flow block is still the doc's first fence", () => {
  expect(BLOCK).toContain('Pick the smallest shippable slice')
})

test("every stage of the loop appears in the doc's flow block", () => {
  for (const s of LOOP_STAGES) {
    expect(BLOCK, s.id).toContain(s.label)
  }
})

test('the loop has the seven stages the block draws, in order', () => {
  expect(LOOP_STAGES.map((s) => s.id)).toEqual([
    'slice',
    'test',
    'work',
    'clean',
    'pr',
    'preview',
    'ship',
  ])
})

/**
 * Five of the seven hand off to another stage, and the doc links each one. A
 * node that claims a link to a stage that does not exist would render a dead
 * end, which `source-citations.test.ts` cannot see because this is data.
 */
test('every stage slug a node links to is a real stage', async () => {
  const { STAGES } = await import('@/lib/stages')
  const slugs = new Set(STAGES.map((s) => s.slug))
  for (const s of LOOP_STAGES) {
    if (s.stage) expect(slugs, s.id).toContain(s.stage)
  }
})

test('"make it clean" is a stage of the loop, not an optional follow-up', () => {
  const clean = LOOP_STAGES.find((s) => s.id === 'clean')
  expect(clean?.detail).toMatch(/before the PR/i)
})
