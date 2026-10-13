import { beforeEach, expect, test, vi } from 'vitest'
import type { Cheatsheet, CheatsheetGroup } from './types'

const fixtures = vi.hoisted(() => ({ sheets: [] as Cheatsheet[] }))
vi.mock('./index', () => ({
  CHEATSHEETS: fixtures.sheets,
  cheatsheetsByGroup: (group: CheatsheetGroup) =>
    fixtures.sheets.filter((sheet) => sheet.group === group),
}))
import { renderCheatsheets } from './render'
const base: Cheatsheet = {
  slug: 'credits',
  title: 'Fixture Credits',
  group: 'Architecture',
  blurb: 'Fixture.',
  sections: [],
}
beforeEach(() => {
  fixtures.sheets.length = 0
})

test('undrawn additional-only sheets retain the placeholder and their credit in Markdown', () => {
  fixtures.sheets.push({
    ...base,
    additionalSources: [{ title: 'Printed guide', author: 'Editor' }],
  })
  const text = renderCheatsheets()
  expect(text).toContain('*Not drawn yet.*')
  expect(text).toContain('Source: Printed guide — Editor.')
})
test('Markdown retains every citation in authored order, including URL-less work', () => {
  fixtures.sheets.push({
    ...base,
    sections: [
      { title: 'Section', rows: [{ term: 'Decision', what: 'Check it.' }] },
    ],
    source: { title: 'Primary', author: 'One', url: 'https://example.com/one' },
    additionalSources: [
      { title: 'Printed guide', author: 'Two' },
      {
        title: 'Supporting',
        author: 'Three',
        url: 'https://example.com/three',
      },
    ],
  })
  const text = renderCheatsheets()
  expect(text).toContain('Sources:')
  expect(text).toContain('Source: [Primary](https://example.com/one) — One.')
  expect(text).toContain('Source: Printed guide — Two.')
  expect(text).toContain(
    'Source: [Supporting](https://example.com/three) — Three.',
  )
  expect(text.indexOf('Source: [Primary]')).toBeLessThan(
    text.indexOf('Source: Printed guide'),
  )
  expect(text.indexOf('Source: Printed guide')).toBeLessThan(
    text.indexOf('Source: [Supporting]'),
  )
})
test('no citation means no empty Sources block in generated Markdown', () => {
  fixtures.sheets.push({ ...base, additionalSources: [] })
  expect(renderCheatsheets()).not.toContain('Source:')
  expect(renderCheatsheets()).not.toContain('Sources:')
})
