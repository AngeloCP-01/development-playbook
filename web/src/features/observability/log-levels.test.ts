// web/src/features/observability/log-levels.test.ts
import { describe, expect, test } from 'vitest'
import { OPTIONS, ROWS } from './log-levels'
import { flat, section } from './doc-source'

describe('log level drill data', () => {
  // The health-dependency `why` is a comment inside the Health checks fence,
  // so the pin reads both sections with `//` markers stripped.
  const strip = (t: string) => flat(t).replace(/\/\/ /g, '')
  const src =
    strip(section('Structured logs')) + ' ' + strip(section('Health checks'))

  test('five options in the ladder order', () => {
    expect(OPTIONS.map((o) => o.id)).toEqual([
      'debug',
      'info',
      'warn',
      'error',
      'fatal',
    ])
  })

  test('six rows, every level used at least once', () => {
    expect(ROWS).toHaveLength(6)
    const used = new Set(ROWS.map((r) => r.answer))
    for (const o of OPTIONS) expect(used.has(o.id), o.id).toBe(true)
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

  // The two cases the doc works through by name.
  test('a card decline is info, not error', () => {
    expect(ROWS.find((r) => r.id === 'card-declined')?.answer).toBe('info')
  })

  test('the health check dependency failure is warn', () => {
    expect(ROWS.find((r) => r.id === 'health-dependency')?.answer).toBe('warn')
  })
})
