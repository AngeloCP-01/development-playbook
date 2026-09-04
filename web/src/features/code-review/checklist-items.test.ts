import { describe, expect, test } from 'vitest'
import { CHECKLIST } from './checklist-items'
import { flat, section } from './doc-source'

describe('checklist items data', () => {
  const src = section('The checklist')

  test('eleven items', () => {
    expect(CHECKLIST).toHaveLength(11)
  })

  test('unique IDs', () => {
    const ids = CHECKLIST.map((c) => c.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  test('first item pins against doc', () => {
    expect(flat(src)).toContain(flat('Does the diff match the description'))
  })

  test('secrets item pins against doc', () => {
    expect(flat(src)).toContain(flat('No secrets, keys, or tokens in the diff'))
  })

  test('tests item pins against doc', () => {
    expect(flat(src)).toContain(
      flat('Tests exist and would actually fail without the change'),
    )
  })
})
