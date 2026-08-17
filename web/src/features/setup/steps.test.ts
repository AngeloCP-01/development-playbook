import { expect, test } from 'vitest'
import { STEP_IDS } from './steps'

// The seam is the spec's, and it is the thing most likely to drift as panels
// are authored. Holding the count here means a step quietly dropped during
// assembly fails a test rather than shrinking the rail.
test('the rail is the fifteen steps the Phase 5 re-cut settled on', () => {
  expect(STEP_IDS).toHaveLength(15)
})

test('ids are unique, because two steps sharing one id makes the second unreachable by hash', () => {
  expect(new Set(STEP_IDS).size).toBe(STEP_IDS.length)
})

// The four provisional pairs may merge on measurement (spec, Phase 5 re-cut).
// A merge deletes an id; it must never silently rename one, because the hash is
// the deep link and `docs/` cites them.
test('the eleven firm ids are present, since only the provisional four may leave', () => {
  for (const id of [
    'scaffold',
    'format',
    'strict',
    'env',
    'hooks',
    'ci',
    'deploy',
    'proof',
    'ai',
    'checklist',
    'traps',
  ]) {
    expect(STEP_IDS).toContain(id)
  }
})
