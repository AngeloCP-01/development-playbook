import { describe, expect, test } from 'vitest'
import { STEP_IDS } from './steps'

describe('post-deployment verification steps', () => {
  test('six steps in exact order', () => {
    expect(STEP_IDS).toEqual([
      'verify',
      'vercel',
      'aws',
      'recovery',
      'ai',
      'done',
    ])
  })

  test('unique IDs', () => {
    expect(new Set(STEP_IDS).size).toBe(STEP_IDS.length)
  })
})
