// web/src/features/observability/scrubber.test.ts
import { describe, expect, test } from 'vitest'
import { OPTIONS, ROWS } from './scrubber'
import { flat, section } from './doc-source'

describe('scrubber drill data', () => {
  // Two of the `why`s quote comment lines inside the beforeSend fence, which
  // `flat()` joins with their `//` markers intact. Strip the markers so the
  // pin compares words, not comment syntax.
  const strip = (t: string) => flat(t).replace(/\/\/ /g, '')
  const errors = strip(section('Errors that are actually useful'))
  const logs = strip(section('Structured logs'))

  test('two options', () => {
    expect(OPTIONS.map((o) => o.id)).toEqual(['scrubbed', 'reaches'])
  })

  test('six rows, three scrubbed, three that get through', () => {
    expect(ROWS).toHaveLength(6)
    expect(ROWS.filter((r) => r.answer === 'scrubbed')).toHaveLength(3)
    expect(ROWS.filter((r) => r.answer === 'reaches')).toHaveLength(3)
  })

  test('unique ids, every answer is an option', () => {
    const ids = ROWS.map((r) => r.id)
    expect(new Set(ids).size).toBe(ids.length)
    const optionIds = new Set(OPTIONS.map((o) => o.id))
    for (const r of ROWS) expect(optionIds.has(r.answer), r.id).toBe(true)
  })

  test('every why is a sentence from the doc', () => {
    for (const r of ROWS) {
      expect(errors + ' ' + logs, `${r.id} why`).toContain(flat(r.why))
    }
  })

  // The row that carries the lesson the whole-branch review found: beforeSend
  // never sees a log line, and the logger needs its own redaction.
  test('the log-line row gets through beforeSend, and says why', () => {
    const row = ROWS.find((r) => r.id === 'pino-log-line')
    expect(row?.answer).toBe('reaches')
    expect(row?.why).toMatch(/does nothing to log output/)
  })
})
