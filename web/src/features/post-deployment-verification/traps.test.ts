import { describe, expect, test } from 'vitest'
import { TRAPS } from './traps'
import { flat, h2 } from './doc-source'

describe('post-deployment verification traps data', () => {
  const src = h2('Traps')

  test('eleven traps from doc', () => {
    const boldLeads = src.match(/^\*\*.+?\*\*/gm) ?? []
    expect(boldLeads).toHaveLength(11)
    expect(TRAPS).toHaveLength(11)
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

  test('body pin: deploy-succeeded-as-done', () => {
    expect(flat(src)).toContain(
      flat('The build compiled. That is all you know'),
    )
  })

  test('body pin: cached-browser', () => {
    expect(flat(src)).toContain(
      flat('you are looking at the old build from your own cache'),
    )
  })

  test('body pin: services-stable-alone (AWS)', () => {
    expect(flat(src)).toContain(
      flat('does not verify that ALB targets are healthy'),
    )
  })

  test('every trap has text content', () => {
    for (const t of TRAPS) {
      expect(t.title.length, `${t.id} title`).toBeGreaterThan(10)
      expect(t.body.length, `${t.id} body`).toBeGreaterThan(15)
    }
  })
})
