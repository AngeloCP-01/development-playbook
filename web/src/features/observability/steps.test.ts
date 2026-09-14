import { describe, expect, test } from 'vitest'
import { STEP_IDS } from './steps'

describe('observability steps', () => {
  test('ten steps in exact order', () => {
    expect(STEP_IDS).toEqual([
      'three',
      'errors',
      'logs',
      'where',
      'signals',
      'health',
      'alerts',
      'silence',
      'ai',
      'done',
    ])
  })

  test('unique IDs', () => {
    expect(new Set(STEP_IDS).size).toBe(STEP_IDS.length)
  })
})
