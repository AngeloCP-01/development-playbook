import { describe, expect, test } from 'vitest'
import { DONE, ARTIFACT_LIST, TEAM } from './checklist'
import { flat, h2 } from './doc-source'

describe('observability checklist data', () => {
  test('done items match doc checkboxes', () => {
    const src = h2('Definition of done')
    const checks = src.split('\n').filter((l) => /^- \[/.test(l))
    expect(checks).toHaveLength(15)
    expect(DONE).toHaveLength(checks.length)
  })

  test('unique done item IDs', () => {
    const ids = DONE.map((d) => d.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  test('artifacts match doc list', () => {
    const src = h2('Artifacts')
    const items = src.split('\n').filter((l) => /^- /.test(l))
    expect(items).toHaveLength(10)
    expect(ARTIFACT_LIST).toHaveLength(items.length)
  })

  test('done pin: withholding a test ping', () => {
    const src = h2('Definition of done')
    expect(flat(src)).toContain(
      flat('watched the monitor page you by withholding a test ping'),
    )
  })

  test('done pin: liveness and readiness are separate endpoints', () => {
    const src = h2('Definition of done')
    expect(flat(src)).toContain(
      flat('Liveness and readiness are separate endpoints'),
    )
  })

  // I3 from the fix wave: the blanket ban was narrowed. The checklist must
  // carry the narrowed wording, not the old one.
  test('done pin: personal-data rule is the narrowed one', () => {
    const item = DONE.find((d) => d.id === 'no-secrets-or-personal-data')
    expect(item?.label).toMatch(/opaque identifiers/)
    expect(item?.label).not.toMatch(/^No secrets or personal data in/)
  })

  test('team notes match doc scaling bullets', () => {
    const src = h2('Scaling to a team')
    const boldLeads = src.match(/^- \*\*[\s\S]+?\*\*/gm) ?? []
    expect(boldLeads).toHaveLength(6)
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
