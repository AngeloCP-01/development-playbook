import { describe, expect, test } from 'vitest'
import { STEP_IDS } from './steps'

describe('code-review step IDs', () => {
  test('six steps in order', () => {
    expect([...STEP_IDS]).toEqual([
      'self-review',
      'what-to-find',
      'pr-discipline',
      'team',
      'ai',
      'traps',
    ])
  })

  test('all IDs are unique', () => {
    expect(new Set(STEP_IDS).size).toBe(STEP_IDS.length)
  })
})
