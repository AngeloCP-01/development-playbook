import { describe, expect, test } from 'vitest'
import { TRAPS } from './traps'
import { flat, h2 } from './doc-source'

describe('production deployment traps data', () => {
  const src = h2('Traps')

  test('twelve traps from doc', () => {
    const boldLeads = src.match(/^\*\*.+?\*\*/gm) ?? []
    expect(boldLeads).toHaveLength(12)
    expect(TRAPS).toHaveLength(12)
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

  test('body pin: schema-code-together', () => {
    expect(flat(src)).toContain(
      flat('The single most common way to make a rollback impossible'),
    )
  })

  test('body pin: untested-rollback', () => {
    expect(flat(src)).toContain(
      flat('A procedure you have never run is a hypothesis'),
    )
  })

  test('body pin: health-check-grace', () => {
    expect(flat(src)).toContain(
      flat('ECS kills tasks before they finish starting'),
    )
  })

  test('body pin: min-max-deadlock', () => {
    expect(flat(src)).toContain(flat('The scheduler cannot start the new task'))
  })

  test('every trap has text content', () => {
    for (const t of TRAPS) {
      expect(t.title.length, `${t.id} title`).toBeGreaterThan(10)
      expect(t.body.length, `${t.id} body`).toBeGreaterThan(15)
    }
  })
})
