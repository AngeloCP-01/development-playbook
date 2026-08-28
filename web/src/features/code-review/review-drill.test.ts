import { describe, expect, test } from 'vitest'
import { SNIPPETS, CATEGORIES } from './review-drill'

describe('review drill data', () => {
  test('six snippets', () => {
    expect(SNIPPETS).toHaveLength(6)
  })

  test('seven categories', () => {
    expect(CATEGORIES).toHaveLength(7)
  })

  test('unique snippet IDs', () => {
    const ids = SNIPPETS.map((s) => s.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  test('unique category IDs', () => {
    const ids = CATEGORIES.map((c) => c.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  test('every snippet answer is a valid category', () => {
    const catIds = new Set(CATEGORIES.map((c) => c.id))
    for (const s of SNIPPETS) {
      expect(catIds.has(s.answer), `${s.id} → ${s.answer}`).toBe(true)
    }
  })

  test('six distinct categories used across snippets', () => {
    const used = new Set(SNIPPETS.map((s) => s.answer))
    expect(used.size).toBe(6)
  })

  test('every snippet has code and an explanation', () => {
    for (const s of SNIPPETS) {
      expect(s.code.length, `${s.id} code`).toBeGreaterThan(20)
      expect(s.explanation.length, `${s.id} explanation`).toBeGreaterThan(20)
    }
  })

  test('category labels are distinct from IDs', () => {
    for (const c of CATEGORIES) {
      expect(c.label).not.toBe(c.id)
    }
  })
})
