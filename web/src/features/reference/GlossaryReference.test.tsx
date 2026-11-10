import { render, screen, within } from '@testing-library/react'
import { expect, test } from 'vitest'
import { TERMS } from '@/lib/terms'
import { GlossaryReference } from './GlossaryReference'

test('sorts by displayed name, preserves stable keys and shows full definitions with optional real stage links', () => {
  const { container } = render(
    <GlossaryReference
      terms={{
        'first-key': {
          name: 'Zulu',
          short: 'Abbreviated.',
          full: 'The complete Zulu definition.',
        },
        'stable-key': {
          name: 'Alpha',
          short: 'Short Alpha.',
          full: 'The complete Alpha definition.',
          see: '03-architecture',
        },
      }}
    />,
  )
  expect(screen.getAllByRole('term').map((term) => term.textContent)).toEqual([
    'Alpha',
    'Zulu',
  ])
  const alpha = container.querySelector('#stable-key')!
  expect(
    within(alpha as HTMLElement).getByText('The complete Alpha definition.'),
  ).toBeTruthy()
  expect(
    within(alpha as HTMLElement)
      .getByRole('link', { name: /03.*Architecture/ })
      .getAttribute('href'),
  ).toBe('/stages/03-architecture')
  expect(
    within(container.querySelector('#first-key') as HTMLElement).queryByRole(
      'link',
      { name: /See/ },
    ),
  ).toBeNull()
  expect(screen.queryByText('Short Alpha.')).toBeNull()
  expect(
    within(alpha as HTMLElement)
      .getByRole('link', { name: 'Alpha' })
      .getAttribute('href'),
  ).toBe('#stable-key')
})

test('renders definition text literally and ignores unknown optional stage references', () => {
  const { container } = render(
    <GlossaryReference
      terms={{
        literal: {
          name: '<b>Term</b>',
          short: 'Short.',
          full: '<em>plain</em> [link](https://example.com)',
          see: 'missing-stage',
        },
      }}
    />,
  )
  expect(
    screen.getByText('<em>plain</em> [link](https://example.com)'),
  ).toBeTruthy()
  expect(container.querySelector('em, b')).toBeNull()
  expect(container.querySelector('a[href="/stages/missing-stage"]')).toBeNull()
})

test('the actual glossary exposes every canonical full definition at its stable fragment', () => {
  const { container } = render(<GlossaryReference />)
  for (const [id, term] of Object.entries(TERMS)) {
    const entry = container.querySelector(`[id="${id}"]`)
    expect(entry, id).not.toBeNull()
    expect(entry?.textContent, id).toContain(term.full)
  }
})
