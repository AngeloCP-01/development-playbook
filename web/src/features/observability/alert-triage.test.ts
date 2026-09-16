// web/src/features/observability/alert-triage.test.ts
import { describe, expect, test } from 'vitest'
import { OPTIONS, ROWS, QUESTION } from './alert-triage'
import { flat, section } from './doc-source'

describe('alert triage drill data', () => {
  // Emphasis stripped: the doc bolds "hard ceiling" and italicises "before",
  // and a `why` rendered through InlineCode would show the asterisks.
  const src = flat(section('Alerts you will not learn to ignore')).replace(
    /\*/g,
    '',
  )

  test('two options: page or do not', () => {
    expect(OPTIONS.map((o) => o.id)).toEqual(['page', 'no-page'])
  })

  test('eleven rows: eight worth alerting on, three not', () => {
    expect(ROWS).toHaveLength(11)
    expect(ROWS.filter((r) => r.answer === 'page')).toHaveLength(8)
    expect(ROWS.filter((r) => r.answer === 'no-page')).toHaveLength(3)
  })

  test('unique ids, every answer is an option', () => {
    const ids = ROWS.map((r) => r.id)
    expect(new Set(ids).size).toBe(ids.length)
    const optionIds = new Set(OPTIONS.map((o) => o.id))
    for (const r of ROWS) expect(optionIds.has(r.answer), r.id).toBe(true)
  })

  test('every why is a sentence from the doc', () => {
    for (const r of ROWS) {
      expect(src, `${r.id} why`).toContain(flat(r.why))
    }
  })

  // The two rows the section's argument turns on.
  test('the new-signature row pages, and its why is the stated exception', () => {
    const row = ROWS.find((r) => r.id === 'new-signature')
    expect(row?.answer).toBe('page')
    expect(row?.why).toMatch(/one exception/)
  })

  test('the connection-pool row pages on the hard-ceiling rule', () => {
    const row = ROWS.find((r) => r.id === 'connections-near-limit')
    expect(row?.answer).toBe('page')
    expect(row?.why).toMatch(/hard ceiling/)
  })

  test('the question is a question', () => {
    expect(QUESTION).toMatch(/\?$/)
  })
})
