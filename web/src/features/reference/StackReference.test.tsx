import { render, screen, within } from '@testing-library/react'
import { expect, test } from 'vitest'
import { STACK, type StackDocument } from '@/lib/stack'
import { StackReference } from './StackReference'

const fixture: StackDocument = {
  title: 'A fixture stack',
  introduction: ['A starter, not an inventory.'],
  versionPolicy: ['Check compatibility.'],
  reviewNote: 'Only this example reviewed.',
  groups: [
    {
      id: 'tools',
      title: 'Tools',
      choices: [
        {
          id: 'compiler',
          concern: 'Compile',
          tool: 'Compiler <X>',
          version: '2.x',
          rationale: 'The whole reason.',
          note: 'A material caveat.',
          sources: [
            {
              label: 'Compiler docs',
              href: 'https://example.com/compiler',
              reviewed: '2026-11-04',
            },
          ],
        },
        {
          id: 'host',
          concern: 'Host',
          tool: 'Static host',
          rationale: 'No optional fields.',
        },
      ],
    },
  ],
  deviationIntro: 'Choose deliberately.',
  deviationStage: '03-architecture',
  deviations: [
    {
      id: 'special-case',
      title: 'A different context',
      detail: 'Record the decision.',
    },
  ],
  upkeep: ['Review on change.'],
}

test('shows complete choice rationale, support caveats and sources with stable fragments', () => {
  const { container } = render(<StackReference document={fixture} />)
  expect(screen.getByRole('heading', { level: 1 }).textContent).toBe(
    'A fixture stack',
  )
  for (const text of [
    'A starter, not an inventory.',
    'Check compatibility.',
    'Only this example reviewed.',
    'The whole reason.',
    'A material caveat.',
    '2.x',
    'Record the decision.',
    'Review on change.',
  ])
    expect(screen.getByText(text)).toBeTruthy()
  const choice = container.querySelector('#compiler') as HTMLElement
  expect(
    within(choice)
      .getByRole('link', { name: 'Compiler docs' })
      .getAttribute('href'),
  ).toBe('https://example.com/compiler')
  expect(choice.textContent).toContain('2026-11-04')
  expect(
    screen.getByRole('link', { name: /03.*Architecture/ }).getAttribute('href'),
  ).toBe('/stages/03-architecture')
  expect(
    within(container.querySelector('#host') as HTMLElement).queryByText(
      /undefined|Source|Reviewed/,
    ),
  ).toBeNull()
  expect(screen.getByText('Compiler <X>')).toBeTruthy()
  expect(container.querySelector('x')).toBeNull()
})

test('omits absent or unknown optional stage links', () => {
  const { container, rerender } = render(
    <StackReference document={{ ...fixture, deviationStage: undefined }} />,
  )
  expect(container.querySelector('a[href^="/stages/"]')).toBeNull()
  rerender(
    <StackReference
      document={{ ...fixture, deviationStage: 'missing-stage' }}
    />,
  )
  expect(container.querySelector('a[href^="/stages/"]')).toBeNull()
})

test('the actual page renders each canonical choice and all deviation/upkeep guidance', () => {
  const { container } = render(<StackReference />)
  for (const group of STACK.groups)
    for (const choice of group.choices) {
      const entry = container.querySelector(`#${choice.id}`)
      expect(entry, choice.id).not.toBeNull()
      expect(entry?.textContent).toContain(choice.tool)
      expect(entry?.textContent).toContain(choice.rationale)
    }
  for (const deviation of STACK.deviations)
    expect(screen.getByText(deviation.detail)).toBeTruthy()
  for (const paragraph of STACK.upkeep)
    expect(screen.getByText(paragraph)).toBeTruthy()
  const ids = [...container.querySelectorAll('[id]')].map(
    (element) => element.id,
  )
  expect(new Set(ids).size).toBe(ids.length)
})
