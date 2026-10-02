// web/src/features/observability/silence.test.ts
import { describe, expect, test } from 'vitest'
import { OPTIONS, ROWS } from './silence'
import { flat, section } from './doc-source'

describe('silence drill data', () => {
  const src = flat(section('When nothing is reporting'))

  test('two options', () => {
    expect(OPTIONS.map((o) => o.id)).toEqual(['seen', 'unseen'])
  })

  test('six rows, exactly one the tracker sees', () => {
    expect(ROWS).toHaveLength(6)
    expect(ROWS.filter((r) => r.answer === 'seen')).toHaveLength(1)
  })

  // Not last: a reader who has answered "unseen" five times in a row is not
  // exercising judgment on the sixth. The control sits early.
  test('the control row is in the first three', () => {
    const idx = ROWS.findIndex((r) => r.answer === 'seen')
    expect(idx).toBeGreaterThanOrEqual(0)
    expect(idx).toBeLessThan(3)
  })

  test('unique ids, every answer is an option', () => {
    const ids = ROWS.map((r) => r.id)
    expect(new Set(ids).size).toBe(ids.length)
    const optionIds = new Set(OPTIONS.map((o) => o.id))
    for (const r of ROWS) expect(optionIds.has(r.answer), r.id).toBe(true)
  })

  test('every unseen why is a sentence from the silence section', () => {
    for (const r of ROWS.filter((r) => r.answer === 'unseen')) {
      expect(src, `${r.id} why`).toContain(flat(r.why))
    }
  })
})
