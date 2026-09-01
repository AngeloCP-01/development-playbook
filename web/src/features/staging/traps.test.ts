// web/src/features/staging/traps.test.ts
import { describe, expect, test } from 'vitest'
import { TRAPS } from './traps'
import { flat, h2 } from './doc-source'

describe('staging traps data', () => {
  const src = h2('Traps')

  test('six traps from doc', () => {
    const boldLeads = src.match(/^\*\*.+?\*\*/gm) ?? []
    expect(boldLeads).toHaveLength(6)
    expect(TRAPS).toHaveLength(6)
  })

  test('unique IDs', () => {
    const ids = TRAPS.map((t) => t.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  test('every title matches a bold lead in the doc', () => {
    const boldLeads = (src.match(/^\*\*(.+?)\*\*/gm) ?? []).map((b) =>
      flat(b.replace(/\*\*/g, '')),
    )
    for (const t of TRAPS) {
      expect(
        boldLeads.some((b) => b.includes(flat(t.title))),
        `"${t.title}" not found in doc bold leads`,
      ).toBe(true)
    }
  })

  test('body pin: preview-as-proof trap', () => {
    expect(flat(src)).toContain(
      flat('this query is fine on 50 rows and times out on 5 million'),
    )
  })

  test('body pin: sterile seed data trap', () => {
    expect(flat(src)).toContain(
      flat('Clean seeds produce clean-looking UIs that shatter on contact'),
    )
  })

  test('every trap has text content', () => {
    for (const t of TRAPS) {
      expect(t.title.length, `${t.id} title`).toBeGreaterThan(10)
      expect(t.body.length, `${t.id} body`).toBeGreaterThan(20)
    }
  })
})
