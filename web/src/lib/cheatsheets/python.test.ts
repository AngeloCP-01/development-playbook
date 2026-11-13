import { expect, test } from 'vitest'
import { CHEATSHEETS, cheatsheetBySlug, isDrawn } from './index'
import { studySections } from './study-sections'

test('Python is a canonical drawn reference with exclusively owned transfer activities', () => {
  const sheet = cheatsheetBySlug('python')!
  expect(CHEATSHEETS).toHaveLength(31)
  expect(CHEATSHEETS.filter(isDrawn)).toHaveLength(29)
  expect(CHEATSHEETS.filter((s) => !isDrawn(s)).map((s) => s.slug)).toEqual([
    'java',
    'spring-boot',
  ])
  expect(sheet.stage).toBeUndefined()
  const sections = studySections(sheet)!
  expect(sections.length).toBe(sheet.sections.length)
  for (const section of sections)
    for (const { row, activities } of section.subsections!) {
      expect(activities).toHaveLength(1)
      expect(row.teaching?.some((b) => b.kind === 'table')).toBe(true)
      expect(row.teaching?.some((b) => b.kind === 'interview')).toBe(true)
    }
})
