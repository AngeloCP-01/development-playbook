import { describe, expect, test } from 'vitest'
import { TRAPS } from './traps'
import { flat, h2 } from './doc-source'

describe('ci-cd traps data', () => {
  const src = h2('Traps')

  test('nine traps from doc', () => {
    const boldLeads = src.match(/^\*\*.+?\*\*/gm) ?? []
    expect(boldLeads).toHaveLength(9)
    expect(TRAPS).toHaveLength(9)
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

  test('body pin: building deploys in actions', () => {
    expect(flat(src)).toContain(flat('reimplementing what Vercel'))
  })

  test('body pin: tolerating flaky tests', () => {
    expect(flat(src)).toContain(
      flat('a test you do not trust has negative value'),
    )
  })

  test('body pin: frozen-lockfile trap', () => {
    expect(flat(src)).toContain(flat('silently resolves different versions'))
  })

  test('body pin: unenforced branch protection', () => {
    expect(flat(src)).toContain(flat('a gate that was never actually required'))
  })

  test('body pin: ungrouped dependabot', () => {
    expect(flat(src)).toContain(
      flat('Fifteen PRs a week becomes zero PRs read'),
    )
  })

  test('every trap has text content', () => {
    for (const t of TRAPS) {
      expect(t.title.length, `${t.id} title`).toBeGreaterThan(10)
      expect(t.body.length, `${t.id} body`).toBeGreaterThan(15)
    }
  })
})
