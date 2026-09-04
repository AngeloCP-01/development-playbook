import { describe, expect, test } from 'vitest'
import { SCENARIOS, CHOICES } from './scenarios'

describe('preview-or-staging scenario data', () => {
  test('five scenarios', () => {
    expect(SCENARIOS).toHaveLength(5)
  })

  test('two choices', () => {
    expect(CHOICES).toHaveLength(2)
    expect(CHOICES.map((c) => c.id)).toEqual(['preview', 'staging'])
  })

  test('unique scenario IDs', () => {
    const ids = SCENARIOS.map((s) => s.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  test('every answer is a valid choice', () => {
    const choiceIds = new Set(CHOICES.map((c) => c.id))
    for (const s of SCENARIOS) {
      expect(choiceIds.has(s.answer), `${s.id} → ${s.answer}`).toBe(true)
    }
  })

  test('distribution: at least 2 preview, at least 2 staging', () => {
    const tally: Record<string, number> = {}
    for (const s of SCENARIOS) tally[s.answer] = (tally[s.answer] ?? 0) + 1
    expect(tally['preview']).toBeGreaterThanOrEqual(2)
    expect(tally['staging']).toBeGreaterThanOrEqual(2)
  })

  test('every scenario has sufficient text', () => {
    for (const s of SCENARIOS) {
      expect(s.situation.length, `${s.id} situation`).toBeGreaterThan(20)
      expect(s.reasoning.length, `${s.id} reasoning`).toBeGreaterThan(20)
    }
  })
})
