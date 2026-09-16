import { describe, expect, test } from 'vitest'
import { SIGNALS } from './signals'
import { flat, section } from './doc-source'

describe('four signals data', () => {
  // The table rows, in doc order. Emphasis stripped for the same reason as
  // the drills: the doc italicises "what broke" and "how often".
  const src = flat(section('The four signals')).replace(/\*/g, '')

  test('four signals in the golden-signals order', () => {
    expect(SIGNALS.map((s) => s.name)).toEqual([
      'Latency',
      'Traffic',
      'Errors',
      'Saturation',
    ])
  })

  test('every cell is a phrase from the doc table', () => {
    for (const s of SIGNALS) {
      expect(src, `${s.id} source`).toContain(flat(s.source))
      expect(src, `${s.id} vercel`).toContain(flat(s.vercel))
      expect(src, `${s.id} aws`).toContain(flat(s.aws))
    }
  })

  test('errors names both questions', () => {
    const errors = SIGNALS.find((s) => s.id === 'errors')
    expect(errors?.source).toMatch(/what broke/)
    expect(errors?.source).toMatch(/how often/)
  })
})
