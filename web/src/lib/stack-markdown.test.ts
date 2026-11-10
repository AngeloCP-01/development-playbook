import { expect, test } from 'vitest'
import { renderStack } from './stack-markdown'
import { STACK, type StackDocument } from './stack'

const fixture: StackDocument = {
  title: 'Fixture stack',
  introduction: ['Starter guidance.'],
  versionPolicy: ['Review compatibility.'],
  reviewNote: 'Only this fixture was reviewed.',
  groups: [
    {
      id: 'tools',
      title: 'Tools',
      choices: [
        {
          id: 'first',
          concern: 'Build | check',
          tool: 'Tool [A]',
          version: '2.x',
          rationale: 'Use <plain> text.\nKeep *literal* markers.',
          note: 'Check support.',
          see: '06-testing',
          sources: [
            {
              label: 'Tool docs',
              href: 'https://example.com/docs',
              reviewed: '2026-11-04',
            },
          ],
        },
        {
          id: 'second',
          concern: 'Deploy',
          tool: 'Host',
          rationale: 'Optional fields absent.',
        },
      ],
    },
  ],
  deviationIntro: 'Record the reason.',
  deviationStage: '03-architecture',
  deviations: [
    { id: 'other', title: 'Other tool', detail: 'Choose deliberately.' },
  ],
  upkeep: ['Review next time.'],
}

test('publishes the source meaning, explicit source links and chapter links in portable Markdown', () => {
  const markdown = renderStack(fixture)
  expect(markdown).toContain('# Fixture stack')
  for (const text of [
    'Starter guidance.',
    'Review compatibility.',
    'Only this fixture was reviewed.',
    'Check support.',
    'Record the reason.',
    'Choose deliberately.',
    'Review next time.',
  ])
    expect(markdown).toContain(text)
  expect(markdown).toContain('[Tool docs](https://example.com/docs)')
  expect(markdown).toContain('2026-11-04')
  expect(markdown).toContain('../docs/03-architecture.md')
  expect(markdown).toContain('../docs/06-testing.md')
})

test('keeps plain content literal and table rows intact while omitting absent optional values', () => {
  const markdown = renderStack(fixture)
  expect(markdown).toContain('Build \\| check')
  expect(markdown).toContain('Tool \\[A\\]')
  expect(markdown).toContain('&lt;plain&gt;')
  expect(markdown).toContain('\\*literal\\*')
  expect(markdown).toContain('| Deploy | Host | — | Optional fields absent. |')
  expect(markdown).not.toMatch(/undefined|null|<plain>/)
})

test('omits a missing or unknown optional chapter instead of inventing a Markdown link', () => {
  expect(renderStack({ ...fixture, deviationStage: undefined })).not.toContain(
    '../docs/03-architecture.md',
  )
  expect(
    renderStack({ ...fixture, deviationStage: 'not-a-stage' }),
  ).not.toContain('../docs/03-architecture.md')
})

test('reference/stack.md is generated from the canonical source', async () => {
  await expect(renderStack()).toMatchFileSnapshot('../../../reference/stack.md')
})

test('stack fragment IDs remain unique and sources are explicit HTTPS links', () => {
  const document: StackDocument = STACK
  const ids = document.groups.flatMap((group) => [
    group.id,
    ...group.choices.map((choice) => choice.id),
  ])
  expect(new Set(ids).size).toBe(ids.length)
  for (const id of ids) expect(id).toMatch(/^[a-z][a-z0-9-]*$/)
  for (const group of document.groups)
    for (const choice of group.choices)
      for (const source of choice.sources ?? [])
        expect(new URL(source.href).protocol).toBe('https:')
})

test.each([undefined, 'missing-stage'])(
  'omits a missing or unknown choice stage reference (%s)',
  (see) => {
    const markdown = renderStack({
      ...fixture,
      deviationStage: undefined,
      groups: [
        {
          ...fixture.groups[0],
          choices: [{ ...fixture.groups[0].choices[0], see }],
        },
      ],
    })
    expect(markdown).not.toContain('../docs/')
  },
)
