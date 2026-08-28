import { describe, expect, test } from 'vitest'
import { BIASES, TECHNIQUES } from './self-review'
import { flat, section } from './doc-source'

describe('self-review data', () => {
  const src = section('Reviewing your own code')

  test('three techniques', () => {
    expect(TECHNIQUES).toHaveLength(3)
  })

  test('three biases', () => {
    expect(BIASES).toHaveLength(3)
  })

  test('unique technique IDs', () => {
    const ids = TECHNIQUES.map((t) => t.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  test('unique bias IDs', () => {
    const ids = BIASES.map((b) => b.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  test('every technique maps to a valid bias', () => {
    const biasIds = new Set(BIASES.map((b) => b.id))
    for (const t of TECHNIQUES) {
      expect(biasIds.has(t.bias), `${t.id} → ${t.bias}`).toBe(true)
    }
  })

  test('each bias is the answer for exactly one technique', () => {
    const tally: Record<string, number> = {}
    for (const t of TECHNIQUES) tally[t.bias] = (tally[t.bias] ?? 0) + 1
    for (const b of BIASES) {
      expect(tally[b.id], b.id).toBe(1)
    }
  })

  test('distance technique pins against doc', () => {
    expect(flat(src)).toContain(
      flat(
        'Bugs that are invisible while you are inside the problem become obvious once you are not',
      ),
    )
  })

  test('diff technique pins against doc', () => {
    expect(flat(src)).toContain(
      flat(
        'the diff view strips the surrounding code you have been staring at and shows only what changed',
      ),
    )
  })

  test('explain technique pins against doc', () => {
    expect(flat(src)).toContain(
      flat('If you cannot explain why a piece is necessary, that is a finding'),
    )
  })

  test('every technique has an explanation of at least one sentence', () => {
    for (const t of TECHNIQUES) {
      expect(t.explanation.length, t.id).toBeGreaterThan(20)
    }
  })
})
