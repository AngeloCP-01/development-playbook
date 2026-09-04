import { describe, expect, test } from 'vitest'
import { DONE, ARTIFACT_LIST, TEAM } from './checklist'
import { flat, h2 } from './doc-source'

describe('post-deployment verification checklist data', () => {
  test('done items match doc checkboxes', () => {
    const src = h2('Definition of done')
    const checks = src.split('\n').filter((l) => /^- \[/.test(l))
    expect(DONE).toHaveLength(checks.length)
  })

  test('unique done item IDs', () => {
    const ids = DONE.map((d) => d.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  test('artifacts match doc list', () => {
    const src = h2('Artifacts')
    const items = src.split('\n').filter((l) => /^- /.test(l))
    expect(ARTIFACT_LIST).toHaveLength(items.length)
  })

  test('done pin: production URL loads', () => {
    const src = h2('Definition of done')
    expect(flat(src)).toContain(flat('Production URL loads in a real browser'))
  })

  test('done pin: re-checked at 30 minutes', () => {
    const src = h2('Definition of done')
    expect(flat(src)).toContain(flat('Re-checked at ~30 minutes'))
  })

  test('team notes match doc scaling bullets', () => {
    const src = h2('Scaling to a team')
    const boldLeads = src.match(/^- \*\*.+?\*\*/gm) ?? []
    expect(TEAM).toHaveLength(boldLeads.length)
  })

  test('unique team IDs', () => {
    const ids = TEAM.map((t) => t.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  test('team notes have content', () => {
    for (const n of TEAM) {
      expect(n.title.length, `${n.id} title`).toBeGreaterThan(5)
      expect(n.body.length, `${n.id} body`).toBeGreaterThan(10)
    }
  })
})
