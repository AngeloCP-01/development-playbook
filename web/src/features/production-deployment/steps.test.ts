import { describe, expect, test } from 'vitest'
import { STEP_IDS } from './steps'

describe('production deployment steps', () => {
  test('six steps in order', () => {
    expect(STEP_IDS).toEqual([
      'deploys',
      'migrations',
      'safety',
      'rollback',
      'ai',
      'traps',
    ])
  })

  test('unique IDs', () => {
    expect(new Set(STEP_IDS).size).toBe(STEP_IDS.length)
  })
})
