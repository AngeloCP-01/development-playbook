import { expect, test } from 'vitest'
import { cheatsheetsForStage, CHEATSHEETS, isDrawn } from './index'
import { renderCheatsheets } from './render'
import { sheetSources } from './sheet-sources'

test('stage 09 retains both drawn companion sheets alongside the language sheets', () => {
  const sheets = cheatsheetsForStage('09-performance-optimization')
  expect(sheets.map((sheet) => sheet.slug).sort()).toEqual([
    'caching',
    'scaling',
  ])
  expect(sheets.every(isDrawn)).toBe(true)
  expect(CHEATSHEETS.filter(isDrawn)).toHaveLength(28)
  expect(CHEATSHEETS).toHaveLength(31)
  expect(
    CHEATSHEETS.filter((sheet) => !isDrawn(sheet))
      .map((sheet) => sheet.slug)
      .sort(),
  ).toEqual(['java', 'python', 'spring-boot'])
})
test('generated Markdown includes each companion, its load-bearing caveats and every supporting source', () => {
  const markdown = renderCheatsheets()
  expect(markdown).toContain('## Caching')
  expect(markdown).toContain('## Infrastructure Scaling')
  expect(markdown).toContain('Server Actions only')
  expect(markdown).toContain('revalidateTag(tag, { expire: 0 })')
  expect(markdown).toContain('all registered targets are unhealthy')
  expect(markdown).toContain('fails open')
  for (const sheet of cheatsheetsForStage('09-performance-optimization')) {
    for (const citation of sheetSources(sheet)) {
      expect(markdown).toContain(
        `Source: [${citation.title}](${citation.url}) — ${citation.author}.`,
      )
    }
  }
})
