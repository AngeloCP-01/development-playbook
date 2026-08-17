import { expect, test } from 'vitest'
import { STEP_IDS } from './steps'

/**
 * The four the Phase 5 re-cut authored split, to be merged into their partner
 * only if the combined panel measures under 3.2 screens (spec, `### Phase 5
 * re-cut`). These are the only ids Wave 3 may remove.
 */
const PROVISIONAL = ['structure', 'client', 'enforce', 'verify']

/** The eleven that no measurement can remove, in rail order. */
const FIRM = [
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
]

// Two tests, and the split between them is the point. This one pins the seam
// as it stands today, so a rename, a reorder, a drop or an addition all fail
// it. It is *expected* to be edited in Wave 3, once — a provisional pair that
// measures under 3.2 merges, an id goes, and this literal is where that gets
// recorded. Editing it is the deliberate act; the test below is what stops
// that edit from quietly becoming something else.
//
// The first version of this file held the count and the firm ids separately
// and asserted neither position nor the identity of the provisional four. A
// review renamed `structure` to `layout` and swapped the first two ids, and
// both mutations passed three green tests — under a comment claiming an id
// "must never silently rename".
test('the rail is these fifteen ids in this order, the seam the Phase 5 re-cut settled on', () => {
  expect([...STEP_IDS]).toEqual([
    'scaffold',
    'structure',
    'format',
    'strict',
    'env',
    'client',
    'hooks',
    'ci',
    'enforce',
    'deploy',
    'verify',
    'proof',
    'ai',
    'checklist',
    'traps',
  ])
})

// This one outlives the seam. A Wave 3 merge deletes a provisional id and
// edits the literal above; it must not touch this, because the eleven firm
// ids and their order are what the merge is not allowed to disturb. An id
// here that is neither firm nor one of the four provisional ones fails too,
// which is the case the earlier version missed: a renamed provisional id
// reads as a merge plus an addition, and looks like neither.
test('the eleven firm ids survive in rail order whatever the provisional four do', () => {
  expect(STEP_IDS.filter((id) => !PROVISIONAL.includes(id))).toEqual(FIRM)
  expect(STEP_IDS.filter((id) => PROVISIONAL.includes(id))).toEqual(
    PROVISIONAL.filter((id) => (STEP_IDS as readonly string[]).includes(id)),
  )
})

test('ids are unique, because two steps sharing one id makes the second unreachable by hash', () => {
  expect(new Set(STEP_IDS).size).toBe(STEP_IDS.length)
})
