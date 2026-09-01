import { describe, expect, test } from 'vitest'
import { CHECKLIST_CATEGORIES } from './checklist-items'
import { flat, section } from './doc-source'

describe('preview checklist categories', () => {
  const src = section('The preview checklist')

  test('four categories', () => {
    expect(CHECKLIST_CATEGORIES).toHaveLength(4)
  })

  test('unique IDs', () => {
    const ids = CHECKLIST_CATEGORIES.map((c) => c.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  test('first category title pins: Does it actually work?', () => {
    expect(flat(src)).toContain(flat('Does it actually work?'))
  })

  test('second category title pins: happy path', () => {
    expect(flat(src)).toContain(
      flat('Does it work when you are not the happy path?'),
    )
  })

  test('third category title pins: anything else break', () => {
    expect(flat(src)).toContain(flat('Did anything else break?'))
  })

  test('fourth category title pins: look right', () => {
    expect(flat(src)).toContain(flat('Does it look right?'))
  })
})
