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
