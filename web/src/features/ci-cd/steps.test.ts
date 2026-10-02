import { describe, expect, test } from 'vitest'
import { STEP_IDS } from './steps'

describe('ci-cd steps', () => {
  test('eight steps in order', () => {
    expect(STEP_IDS).toEqual([
      'gate',
      'ordering',
      'e2e',
      'protection',
      'deps',
      'scaling',
      'ai',
      'traps',
    ])
  })

  test('unique IDs', () => {
    expect(new Set(STEP_IDS).size).toBe(STEP_IDS.length)
  })
})
