import { describe, expect, test } from 'vitest'
import { DONE, ARTIFACT_LIST, TEAM } from './checklist'
import { flat, h2 } from './doc-source'

describe('deployment checklist data', () => {
  test('six done items from definition of done', () => {
    const src = h2('Definition of done')
    const checks = src.split('\n').filter((l) => /^- \[/.test(l))
    expect(checks).toHaveLength(6)
    expect(DONE).toHaveLength(6)
  })

  test('unique done item IDs', () => {
    const ids = DONE.map((d) => d.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  test('five artifacts from doc', () => {
    const src = h2('Artifacts')
    const items = src.split('\n').filter((l) => /^- /.test(l))
    expect(items).toHaveLength(5)
    expect(ARTIFACT_LIST).toHaveLength(5)
  })

  test('done pin: deploy succeeded', () => {
    const src = h2('Definition of done')
    expect(flat(src)).toContain(
      flat('Deploy succeeded and the commit is identifiable'),
    )
  })

  test('done pin: skew protection', () => {
    const src = h2('Definition of done')
    expect(flat(src)).toContain(flat('Skew protection is on'))
  })

  test('four team notes from scaling section', () => {
    const src = h2('Scaling to a team')
    // Each bullet is a list item ("- **Lead.** ..."), not a standalone bold
    // paragraph, so the match must include the leading "- " — a bare
    // `^\*\*` never matches a line that starts with the dash.
    const boldLeads = src.match(/^- \*\*.+?\*\*/gm) ?? []
    expect(boldLeads).toHaveLength(4)
    expect(TEAM).toHaveLength(4)
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
