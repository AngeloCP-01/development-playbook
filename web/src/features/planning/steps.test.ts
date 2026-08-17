import { expect, test } from 'vitest'
import { STEP_IDS } from './steps'

// Stage 02 is built and its rail is settled, so unlike stage 04's this seam is
// not provisional — the whole tuple is the claim, and any edit to it should be
// a deliberate one that lands here too.
//
// This file exists for a second reason. TD-36 gave 01 and 02 a `STEP_IDS`
// tuple, and the `type StepId` half of it is consumed by the component; the
// value half had no consumer at all, which makes it the kind of export that
// drifts without anything noticing. A review caught that. It also caught the
// direction the tuple cannot guard on its own: deleting a whole step object
// from `Planning.tsx` while deleting its id here typechecks clean, and the
// audit sweep silently shrinks by one URL. The count below is what fails.
test('stage 02 renders these seven steps in this order', () => {
  expect([...STEP_IDS]).toEqual([
    'done',
    'cut',
    'sequence',
    'size',
    'ai',
    'write',
    'horizon',
  ])
})

test('ids are unique, because two steps sharing one id makes the second unreachable by hash', () => {
  expect(new Set(STEP_IDS).size).toBe(STEP_IDS.length)
})
