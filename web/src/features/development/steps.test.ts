import { expect, test } from 'vitest'
import { STEP_IDS } from './steps'

/**
 * An ordered literal, not a derivation. `rails.test.tsx` catches a step deleted
 * from the component and `STEP_IDS` typing catches an id that exists nowhere;
 * a step deleted from *both* still compiles, and this is what fails there.
 *
 * Thirteen, with `drill` and `boundaries` provisional — they merge into `reads`
 * and `action` if measurement says so, and this literal is the first thing the
 * merge edits.
 */
test('the rail is exactly these thirteen ids, in this order', () => {
  expect([...STEP_IDS]).toEqual([
    'loop',
    'server',
    'thin',
    'action',
    'callers',
    'reads',
    'drill',
    'boundaries',
    'states',
    'commits',
    'ai',
    'checklist',
    'traps',
  ])
})

test('ids are unique, because each is a URL hash', () => {
  expect(new Set(STEP_IDS).size).toBe(STEP_IDS.length)
})
