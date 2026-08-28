import { describe, expect, test } from 'vitest'
import { AREAS } from './review-areas'
import { flat, section } from './doc-source'

describe('review areas data', () => {
  const src = section('What to actually look for')

  test('seven areas', () => {
    expect(AREAS).toHaveLength(7)
  })

  test('unique IDs', () => {
    const ids = AREAS.map((a) => a.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  test('authorization area pins against doc', () => {
    expect(flat(src)).toContain(
      flat('Any query filtered only by an ID from the client is a finding'),
    )
  })

  test('error handling area pins against doc', () => {
    expect(flat(src)).toContain(
      flat('A caught error with an empty block is a bug hidden on purpose'),
    )
  })

  test('names area pins against doc', () => {
    expect(flat(src)).toContain(
      flat(
        'Renaming is cheap now and expensive after it spreads across thirty call sites',
      ),
    )
  })

  test('scope area pins against doc', () => {
    expect(flat(src)).toContain(
      flat(
        'An unrelated refactor bundled into a feature PR makes both harder to review and harder to revert',
      ),
    )
  })

  test('deletion area pins against doc', () => {
    expect(flat(src)).toContain(
      flat('Commented-out code is what version control is for'),
    )
  })

  test('reversibility area pins against doc', () => {
    expect(flat(src)).toContain(
      flat('A migration deserves more scrutiny than a copy change'),
    )
  })

  test('correctness area pins against doc', () => {
    expect(flat(src)).toContain(
      flat('What happens with zero items, a null, a duplicate submit'),
    )
  })

  test('every area has a title and body', () => {
    for (const a of AREAS) {
      expect(a.title.length, `${a.id} title`).toBeGreaterThan(0)
      expect(a.body.length, `${a.id} body`).toBeGreaterThan(20)
    }
  })
})
