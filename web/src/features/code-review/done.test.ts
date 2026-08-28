import { describe, expect, test } from 'vitest'
import { ARTIFACT_LIST, DONE } from './done'
import { flat, h2 } from './doc-source'

describe('done data', () => {
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

  test('three artifacts', () => {
    const src = h2('Artifacts')
    const items = src.split('\n').filter((l) => /^- /.test(l))
    expect(items).toHaveLength(3)
    expect(ARTIFACT_LIST).toHaveLength(3)
  })

  test('first done item pins against doc', () => {
    const src = h2('Definition of done')
    expect(flat(src)).toContain(
      flat('Diff read in the PR view, not the editor, after a real break'),
    )
  })

  test('tests verified pins against doc', () => {
    const src = h2('Definition of done')
    expect(flat(src)).toContain(
      flat('Tests verified to fail without the change'),
    )
  })
})
