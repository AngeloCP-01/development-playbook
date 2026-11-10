import { expect, test } from 'vitest'
import { cheatsheetBySlug } from './index'
import { studySections } from './study-sections'
test('express is a complete study reference with owned practice', () => {
  const sheet = cheatsheetBySlug('express')!
  expect(sheet.title).toBe('Node.js & Express')
  expect(studySections(sheet)).toHaveLength(12)
  expect(sheet.sections.flatMap((s) => s.rows)).toHaveLength(38)
  expect(sheet.activities).toHaveLength(38)
})
