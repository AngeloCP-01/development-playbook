import { expect, test } from 'vitest'
import type { Cheatsheet } from './types'
import { studySections } from './study-sections'

const nested = (): Cheatsheet => ({
  slug: 'nested',
  title: 'Nested',
  group: 'Languages',
  blurb: 'Study.',
  sections: [
    {
      title: 'Main',
      study: { id: 'main-topic', label: 'Main', hint: 'Study' },
      rows: [
        {
          term: 'First',
          what: 'First teaching',
          study: {
            id: 'first',
            summary: 'First summary',
            activityIds: ['two', 'one'],
          },
        },
        {
          code: 'Second',
          what: 'Second teaching',
          study: { id: 'second', summary: 'Second summary', activityIds: [] },
        },
      ],
    },
  ],
  activities: ['one', 'two'].map((id) => ({
    id,
    title: id,
    prompt: 'Try',
    context: 'Strict',
    answer: 'Answer',
    explanation: 'Why',
  })),
})

test('resolves subsection teaching and local activities in authored order', () => {
  const resolved = studySections(nested())!
  expect(resolved[0].activities.map((a) => a.id)).toEqual(['two', 'one'])
  expect(
    resolved[0].subsections?.map((s) => [
      s.row.term ?? s.row.code,
      s.activities.map((a) => a.id),
    ]),
  ).toEqual([
    ['First', ['two', 'one']],
    ['Second', []],
  ])
})

const invalid: [string, (sheet: Cheatsheet) => void][] = [
  [
    'partial rows',
    (s) => {
      delete s.sections[0].rows[1].study
    },
  ],
  [
    'ambiguous assignments',
    (s) => {
      s.sections[0].study!.activityIds = []
    },
  ],
  [
    'orphan rows',
    (s) => {
      delete s.sections[0].study
    },
  ],
  [
    'unsafe subsection',
    (s) => {
      s.sections[0].rows[0].study!.id = 'bad#id'
    },
  ],
  [
    'duplicate subsection',
    (s) => {
      s.sections[0].rows[1].study!.id = 'first'
    },
  ],
  [
    'blank summary',
    (s) => {
      s.sections[0].rows[0].study!.summary = ' '
    },
  ],
  [
    'blank title',
    (s) => {
      s.sections[0].rows[0].term = ' '
    },
  ],
  [
    'missing activity',
    (s) => {
      s.sections[0].rows[0].study!.activityIds = ['missing']
    },
  ],
  [
    'duplicate assignment',
    (s) => {
      s.sections[0].rows[1].study!.activityIds = ['one']
    },
  ],
  [
    'unassigned activity',
    (s) => {
      s.sections[0].rows[0].study!.activityIds = ['one']
    },
  ],
  [
    'missing legacy list',
    (s) => {
      s.sections[0].rows.forEach((r) => {
        delete r.study
      })
    },
  ],
]
for (const [name, mutate] of invalid)
  test(`rejects ${name}`, () => {
    const sheet = nested()
    mutate(sheet)
    expect(() => studySections(sheet)).toThrow(/nested study:/)
  })
