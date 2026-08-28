import { describe, expect, test } from 'vitest'
import { COMMENTS, SEVERITIES } from './severity-drill'

describe('severity drill data', () => {
  test('five comments', () => {
    expect(COMMENTS).toHaveLength(5)
  })

  test('four severity levels', () => {
    expect(SEVERITIES).toHaveLength(4)
    expect(SEVERITIES.map((s) => s.id)).toEqual([
      'critical',
      'important',
      'minor',
      'nit',
    ])
  })

  test('unique comment IDs', () => {
    const ids = COMMENTS.map((c) => c.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  test('every comment maps to a valid severity', () => {
    const sevIds = new Set(SEVERITIES.map((s) => s.id))
    for (const c of COMMENTS) {
      expect(sevIds.has(c.severity), `${c.id} → ${c.severity}`).toBe(true)
    }
  })

  test('severity distribution: 2 critical, 1 important, 1 minor, 1 nit', () => {
    const tally: Record<string, number> = {}
    for (const c of COMMENTS) tally[c.severity] = (tally[c.severity] ?? 0) + 1
    expect(tally).toEqual({ critical: 2, important: 1, minor: 1, nit: 1 })
  })

  test('every comment has text and an explanation', () => {
    for (const c of COMMENTS) {
      expect(c.comment.length, `${c.id} comment`).toBeGreaterThan(20)
      expect(c.explanation.length, `${c.id} explanation`).toBeGreaterThan(20)
    }
  })
})
