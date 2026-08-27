import { expect, test } from 'vitest'
import { STEP_IDS } from './steps'

test('eight panels, in the order the doc builds its argument', () => {
  expect(STEP_IDS).toEqual([
    'triage',
    'restraint',
    'unit',
    'integration',
    'e2e',
    'teeth',
    'done',
    'traps',
  ])
})

test('ids are unique, because Stepper keys the URL hash on them', () => {
  expect(new Set(STEP_IDS).size).toBe(STEP_IDS.length)
})

/**
 * The three layer panels are consecutive and in ascending altitude. This is the
 * stage's one structural claim — panels 3-5 are one feature at three heights —
 * and it is asserted as literal index arithmetic rather than read off the data,
 * so reordering the tuple fails here rather than silently teaching three
 * unrelated snippets.
 */
test('unit, integration and e2e are consecutive and ascend', () => {
  const i = STEP_IDS.indexOf('unit')
  expect(STEP_IDS[i + 1]).toBe('integration')
  expect(STEP_IDS[i + 2]).toBe('e2e')
})
