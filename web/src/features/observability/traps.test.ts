import { describe, expect, test } from 'vitest'
import { TRAPS } from './traps'
import { flat, h2 } from './doc-source'

describe('observability traps data', () => {
  const src = h2('Traps')

  test('fifteen traps from doc', () => {
    const boldLeads = src.match(/^\*\*.+?\*\*/gm) ?? []
    expect(boldLeads).toHaveLength(15)
    expect(TRAPS).toHaveLength(15)
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

  test('body pin: heartbeat in a finally block', () => {
    expect(flat(src)).toContain(flat('It reports success for a run that threw'))
  })

  test('body pin: health checks wired to the thing that restarts you', () => {
    expect(flat(src)).toContain(
      flat('restart healthy instances during a database outage'),
    )
  })

  test('body pin: monitoring that only fires on events', () => {
    expect(flat(src)).toContain(
      flat('Check for missing expected events as well as failures'),
    )
  })

  test('every trap has text content', () => {
    for (const t of TRAPS) {
      expect(t.title.length, `${t.id} title`).toBeGreaterThan(8)
      expect(t.body.length, `${t.id} body`).toBeGreaterThan(15)
    }
  })
})
