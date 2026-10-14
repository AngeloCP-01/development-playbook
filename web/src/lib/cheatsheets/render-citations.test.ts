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

test('blank snippet lines stay empty so generated Markdown passes whitespace checks without losing code indentation', () => {
  fixtures.sheets.push({
    ...base,
    sections: [
      {
        title: 'Example',
        rows: [
          {
            term: 'Read',
            what: 'Keep the separated statements.',
            example: [{ label: 'Separated code', code: 'first()\n\nsecond()' }],
          },
        ],
      },
    ],
  })
  const text = renderCheatsheets()
  expect(text.split('\n').filter((line) => /^ +$/.test(line))).toEqual([])
  expect(text).toContain('  ```\n  first()\n\n  second()\n  ```')
})

test('citation text stays literal across primary/supporting and linked/URL-less credits instead of becoming Markdown or HTML', () => {
  const title =
    '<img src=x onerror=alert(1)> *guide* [label](target) `code` \\ &amp;'
  const author = '<script>alert(1)</script> _editor_ ![plate](image)'
  const escapedTitle = String.raw`\<img src=x onerror=alert(1)\> \*guide\* \[label\](target) \`code\` \\ \&amp;`
  const escapedAuthor = String.raw`\<script\>alert(1)\</script\> \_editor\_ \!\[plate\](image)`
  for (const primaryLinked of [true, false]) {
    fixtures.sheets.length = 0
    fixtures.sheets.push({
      ...base,
      source: {
        title,
        author,
        ...(primaryLinked
          ? { url: 'https://example.com/primary?q=one&n=two' }
          : {}),
      },
      additionalSources: [
        {
          title,
          author,
          ...(!primaryLinked ? { url: 'https://example.com/supporting' } : {}),
        },
      ],
    })
    const credits = renderCheatsheets()
      .split('\n')
      .filter((line) => line.startsWith('Source:'))
    expect(credits).toEqual([
      `Source: ${primaryLinked ? `[${escapedTitle}](https://example.com/primary?q=one&n=two)` : escapedTitle} — ${escapedAuthor}.`,
      `Source: ${!primaryLinked ? `[${escapedTitle}](https://example.com/supporting)` : escapedTitle} — ${escapedAuthor}.`,
    ])
  }
})
