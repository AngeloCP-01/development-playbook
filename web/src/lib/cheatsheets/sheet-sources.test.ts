import { expect, test } from 'vitest'
import { CHEATSHEETS } from './index'
import { sheetSources } from './sheet-sources'
import type { Cheatsheet, SourceCitation } from './types'

const base: Cheatsheet = {
  slug: 'credits',
  title: 'Credits',
  group: 'Architecture',
  blurb: 'Fixture.',
  sections: [],
}
const primary: SourceCitation = {
  title: 'Primary',
  author: 'One',
  url: 'https://example.com/primary',
}
const supporting: SourceCitation = {
  title: 'Supporting',
  author: 'Two',
  url: 'https://example.com/supporting',
}

test('a sheet without sources has no invented credit', () => {
  expect(sheetSources(base)).toEqual([])
  expect(sheetSources({ ...base, additionalSources: [] })).toEqual([])
})
test('an existing primary-only sheet keeps its credited work', () => {
  expect(sheetSources({ ...base, source: primary })).toEqual([primary])
})
test('additional-only sources remain visible even without a primary image owner', () => {
  expect(sheetSources({ ...base, additionalSources: [supporting] })).toEqual([
    supporting,
  ])
})
test('credits retain authored order and do not mutate or silently deduplicate input', () => {
  const extras = [supporting, primary]
  const sheet = { ...base, source: primary, additionalSources: extras }
  const result = sheetSources(sheet)
  expect(result).toEqual([primary, supporting, primary])
  result.pop()
  expect(extras).toEqual([supporting, primary])
})
test('URL-less supporting references retain their title and author', () => {
  const offline = { title: 'Printed guide', author: 'Editor' }
  expect(sheetSources({ ...base, additionalSources: [offline] })).toEqual([
    offline,
  ])
})
test('every authored citation names its work and author, with no duplicate URL or supporting image', () => {
  for (const sheet of CHEATSHEETS) {
    const urls = new Set<string>()
    for (const citation of sheetSources(sheet)) {
      expect(citation.title.trim().length, sheet.slug).toBeGreaterThan(0)
      expect(citation.author.trim().length, sheet.slug).toBeGreaterThan(0)
      if (citation.url) {
        expect(
          urls.has(citation.url),
          `${sheet.slug}: duplicate ${citation.url}`,
        ).toBe(false)
        urls.add(citation.url)
      }
    }
    for (const citation of sheet.additionalSources ?? []) {
      expect(citation, sheet.slug).not.toHaveProperty('image')
    }
  }
})
