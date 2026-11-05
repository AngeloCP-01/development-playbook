import { beforeEach, expect, test, vi } from 'vitest'
import type { Cheatsheet, CheatsheetGroup } from './types'
const fixtures = vi.hoisted(() => ({ sheets: [] as Cheatsheet[] }))
vi.mock('./index', () => ({
  CHEATSHEETS: fixtures.sheets,
  cheatsheetsByGroup: (group: CheatsheetGroup) =>
    fixtures.sheets.filter((s) => s.group === group),
}))
import { renderCheatsheets } from './render'
const base: Cheatsheet = {
  slug: 'fixture',
  title: 'Fixture',
  group: 'Languages',
  blurb: 'Fixture.',
  sections: [
    { title: 'Topic', rows: [{ term: 'Binding', what: 'Retained access.' }] },
  ],
}
const activity = {
  id: 'counter',
  title: 'Counter *factory*',
  prompt: 'Predict <count> & [explain](x).',
  context: 'Strict CommonJS.',
  starter: {
    label: 'Try `this`',
    code: 'function count() {\n\n  return "```";\n}',
  },
  answer: 'Two **independent** bindings.',
  solution: { label: 'Reference', code: 'let n = 0;\n\n() => ++n' },
  explanation: '# Access a binding, not a snapshot.',
  followUp: 'Move _n_ outside.',
}
beforeEach(() => {
  fixtures.sheets.length = 0
})
test('exports every activity field literally and keeps code indentation, blank lines and embedded fences intact', () => {
  fixtures.sheets.push({ ...base, activities: [activity] })
  const text = renderCheatsheets()
  expect(text).toContain('### Practice')
  expect(text).toContain('#### Counter \\*factory\\*')
  expect(text).toContain('Predict \\<count\\> \\& \\[explain\\]\\(x\\)\\.')
  expect(text).toContain('Strict CommonJS\\.')
  expect(text).toContain('Try \\`this\\`')
  expect(text).toContain('````\nfunction count() {\n\n  return "```";\n}\n````')
  expect(text).toContain('Two \\*\\*independent\\*\\* bindings\\.')
  expect(text).toContain('```\nlet n = 0;\n\n() => ++n\n```')
  expect(text).toContain('\\# Access a binding, not a snapshot\\.')
  expect(text).toContain('Move \\_n\\_ outside\\.')
  expect(text.indexOf('Predict')).toBeLessThan(text.indexOf('Two \\*'))
})
test('omits absent optional fields without inventing code or a variation', () => {
  const { starter, solution, followUp, ...required } = activity
  void starter
  void solution
  void followUp
  fixtures.sheets.push({ ...base, activities: [required] })
  const text = renderCheatsheets()
  expect(text).toContain('Two \\*\\*independent\\*\\* bindings')
  expect(text).not.toMatch(/undefined|```|Follow-up/)
})
test('absent and empty activities retain the exact old Markdown; undrawn sheets do not acquire practice', () => {
  fixtures.sheets.push(base)
  const old = renderCheatsheets()
  fixtures.sheets[0] = { ...base, activities: [] }
  expect(renderCheatsheets()).toBe(old)
  expect(old).not.toContain('Practice')
  fixtures.sheets[0] = { ...base, sections: [], activities: [activity] }
  expect(renderCheatsheets()).not.toContain('Practice')
})

const study = () => ({
  ...base,
  sections: [
    {
      ...base.sections[0],
      title: 'First topic',
      study: {
        id: 'first',
        label: 'First',
        hint: 'Read first',
        activityIds: ['counter'],
      },
    },
    {
      title: 'Second topic',
      rows: [{ term: 'Second', what: 'Later teaching.' }],
      study: {
        id: 'second',
        label: 'Second',
        hint: 'Read second',
        activityIds: ['copy'],
      },
    },
  ],
  activities: [
    activity,
    { ...activity, id: 'copy', title: 'Copy task', prompt: 'Copy prompt' },
  ],
})

test('study Markdown places each activity after its own teaching, without a duplicated global practice block', () => {
  fixtures.sheets.push(study())
  const text = renderCheatsheets()
  expect(text.indexOf('Predict')).toBeLessThan(text.indexOf('### Second topic'))
  expect(text.indexOf('### Second topic')).toBeLessThan(
    text.indexOf('Copy prompt'),
  )
  expect(text.match(/#### Counter/g)).toHaveLength(1)
})

for (const [name, mutate] of [
  [
    'missing activity',
    (sheet: ReturnType<typeof study>) => {
      sheet.sections[0].study.activityIds = ['missing']
    },
  ],
  [
    'duplicate assignment',
    (sheet: ReturnType<typeof study>) => {
      sheet.sections[1].study.activityIds = ['counter', 'copy']
    },
  ],
  [
    'unassigned activity',
    (sheet: ReturnType<typeof study>) => {
      sheet.sections[0].study.activityIds = []
    },
  ],
  [
    'unsafe hash',
    (sheet: ReturnType<typeof study>) => {
      sheet.sections[0].study.id = 'bad#hash'
    },
  ],
  [
    'duplicate hash',
    (sheet: ReturnType<typeof study>) => {
      sheet.sections[1].study.id = 'first'
    },
  ],
  [
    'partial metadata',
    (sheet: ReturnType<typeof study>) => {
      delete (sheet.sections[0] as { study?: unknown }).study
    },
  ],
  [
    'duplicate activity IDs',
    (sheet: ReturnType<typeof study>) => {
      sheet.activities[1].id = 'counter'
    },
  ],
] as const) {
  test(`study guard rejects ${name} rather than silently losing content`, () => {
    const sheet = study()
    mutate(sheet)
    fixtures.sheets.push(sheet)
    expect(() => renderCheatsheets()).toThrow(/study/i)
  })
}
