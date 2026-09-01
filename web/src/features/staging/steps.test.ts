// web/src/features/staging/steps.test.ts
import { describe, expect, test } from 'vitest'
import { STEP_IDS } from './steps'

describe('staging steps', () => {
  test('six steps in order', () => {
    expect(STEP_IDS).toEqual([
      'preview',
      'database',
      'checklist',
      'env',
      'ai',
      'traps',
    ])
  })

  test('unique IDs', () => {
    expect(new Set(STEP_IDS).size).toBe(STEP_IDS.length)
  })
})
