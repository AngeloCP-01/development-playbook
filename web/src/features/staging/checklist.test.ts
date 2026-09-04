import { describe, expect, test } from 'vitest'
import { DONE, ARTIFACT_LIST, TEAM } from './checklist'
import { flat, h2 } from './doc-source'

describe('staging checklist data', () => {
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

  test('four artifacts', () => {
    const src = h2('Artifacts')
    const items = src.split('\n').filter((l) => /^- /.test(l))
    expect(items).toHaveLength(4)
    expect(ARTIFACT_LIST).toHaveLength(4)
  })

  test('first done item pins against doc', () => {
    const src = h2('Definition of done')
    expect(flat(src)).toContain(
      flat('The preview URL loads and the changed flow works end to end'),
    )
  })

  test('migration done item pins against doc', () => {
    const src = h2('Definition of done')
    expect(flat(src)).toContain(
      flat(
        'Any migration ran cleanly against a branched database, not production',
      ),
    )
  })

  test('team notes exist', () => {
    expect(TEAM.length).toBeGreaterThanOrEqual(2)
    for (const n of TEAM) {
      expect(n.title.length).toBeGreaterThan(5)
      expect(n.body.length).toBeGreaterThan(10)
    }
  })
})
