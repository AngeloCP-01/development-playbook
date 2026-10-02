import { describe, expect, test } from 'vitest'
import {
  ORDERING_STEPS,
  CORRECT_ORDER,
  SCRAMBLED_ORDER,
  score,
} from './ordering-exercise'
import { flat, section } from './doc-source'

describe('ordering exercise data', () => {
  test('five CI steps', () => {
    expect(ORDERING_STEPS).toHaveLength(5)
  })

  test('unique IDs', () => {
    const ids = ORDERING_STEPS.map((s) => s.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  test('correct order matches doc', () => {
    const src = section('Ordering: cheapest failure first')
    // Doc says: "Lint, typecheck, test, build — in that order"
    // But format comes before lint (format:check is the first step in ci.yml)
    expect(flat(src)).toContain(flat('Lint, typecheck, test, build'))
    expect(CORRECT_ORDER).toEqual([
      'format',
      'lint',
      'typecheck',
      'test',
      'build',
    ])
  })

  test('scrambled order contains same IDs as correct order', () => {
    expect([...SCRAMBLED_ORDER].sort()).toEqual([...CORRECT_ORDER].sort())
  })

  test('scrambled order differs from correct order', () => {
    expect(SCRAMBLED_ORDER).not.toEqual(CORRECT_ORDER)
  })

  test('every step has a name, command, failTime, and reason', () => {
    for (const s of ORDERING_STEPS) {
      expect(s.name.length, `${s.id} name`).toBeGreaterThan(0)
      expect(s.command.length, `${s.id} command`).toBeGreaterThan(0)
      expect(s.failTime.length, `${s.id} failTime`).toBeGreaterThan(0)
      expect(s.reason.length, `${s.id} reason`).toBeGreaterThan(10)
    }
  })

  test('score returns 5 for perfect order', () => {
    const perfect: Record<string, number> = {}
    CORRECT_ORDER.forEach((id, i) => {
      perfect[id] = i + 1
    })
    expect(score(perfect)).toBe(5)
  })

  // A plain reversal of an odd-length list leaves its middle element in
  // place — CORRECT_ORDER has 5 entries, so reversing it still scores 1
  // (typecheck lands back on position 3). A rotation is a true derangement:
  // every step lands one position off from where it belongs, so all 5 miss.
  test('score returns 0 for a fully rotated (deranged) order', () => {
    const rotated: Record<string, number> = {}
    const shifted = [...CORRECT_ORDER.slice(1), CORRECT_ORDER[0]]
    shifted.forEach((id, i) => {
      rotated[id] = i + 1
    })
    expect(score(rotated)).toBe(0)
  })

  test('score returns partial for partial match', () => {
    const partial: Record<string, number> = {}
    CORRECT_ORDER.forEach((id, i) => {
      partial[id] = i + 1
    })
    // Swap the first two
    partial[CORRECT_ORDER[0]] = 2
    partial[CORRECT_ORDER[1]] = 1
    expect(score(partial)).toBe(3) // 3 of 5 correct
  })
})
