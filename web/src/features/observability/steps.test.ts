import { describe, expect, test } from 'vitest'
import { STEP_IDS } from './steps'

describe('observability steps', () => {
  test('fourteen steps in exact order', () => {
    expect(STEP_IDS).toEqual([
      'three',
      'errors',
      'scrubbing',
      'reach',
      'logs',
      'levels',
      'fields',
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
