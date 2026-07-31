import { expect, test } from 'vitest'
import { stepNumber } from './Stepper'

// The rail template-literalled a leading zero onto the index, which is correct
// for exactly nine steps and silently wrong for the tenth. D-52 removes the
// step-count ceiling that had kept every stage under that limit by accident.
test('a single-digit step is zero-padded, which is the rail’s existing visual treatment', () => {
  expect(stepNumber(0)).toBe('01')
  expect(stepNumber(8)).toBe('09')
})

test('the tenth step reads 10 rather than 010, which is what the old template literal produced', () => {
  expect(stepNumber(9)).toBe('10')
  expect(stepNumber(13)).toBe('14')
})
