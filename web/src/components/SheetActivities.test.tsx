import { fireEvent, render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import type { Cheatsheet } from '@/lib/cheatsheets'
import { CheatsheetView } from './Cheatsheet'

const sheet: Cheatsheet = {
  slug: 'fixture',
  title: 'Fixture',
  group: 'Languages',
  blurb: 'Practice.',
  sections: [
    {
      title: 'Bindings',
      rows: [{ term: 'Closure', what: 'Retains a binding.' }],
    },
  ],
  activities: [
    {
      id: 'counter',
      title: 'Counter factory',
      prompt: 'Predict the calls.',
      context: 'Strict CommonJS.',
      starter: { label: 'Starter', code: 'first()\n\nsecond()' },
      answer: 'Independent counts.',
      solution: {
        label: 'Reference code',
        code: 'let count = 0;\nreturn () => ++count;',
      },
      explanation: 'Each call owns its binding.',
      followUp: 'Move count outside.',
    },
    {
      id: 'copy',
      title: 'Nested copy',
      prompt: 'Repair the copy.',
      context: 'Plain objects.',
      answer: 'Copy the changed path.',
      explanation: 'Spread is shallow.',
    },
  ],
}

test('keeps prompts/context/code visible and answers hidden until individually revealed, preserving focus on re-collapse', () => {
  render(<CheatsheetView sheet={sheet} />)
  expect(
    screen.getByRole('heading', { name: 'Practice', level: 2 }),
  ).toBeTruthy()
  expect(screen.getByText('Predict the calls.')).toBeTruthy()
  expect(screen.getByText('Strict CommonJS.')).toBeTruthy()
  expect(screen.getByText('first() second()').textContent).toBe(
    'first()\n\nsecond()',
  )
  expect(screen.queryByText('Independent counts.')).toBeNull()
  expect(screen.queryByText('Each call owns its binding.')).toBeNull()
  const counter = screen.getByRole('button', {
    name: 'Solution: Counter factory',
  })
  const copy = screen.getByRole('button', { name: 'Solution: Nested copy' })
  expect(counter.getAttribute('aria-expanded')).toBe('false')
  counter.focus()
  fireEvent.click(counter)
  expect(document.activeElement).toBe(counter)
  expect(counter.getAttribute('aria-expanded')).toBe('true')
  expect(counter.getAttribute('aria-controls')).toBe(
    'sheet-fixture-activity-counter',
  )
  const panel = document.getElementById(counter.getAttribute('aria-controls')!)
  expect(panel?.textContent).toContain('Independent counts.')
  expect(panel?.textContent).toContain('Each call owns its binding.')
  expect(panel?.querySelector('code')?.textContent).toBe(
    'let count = 0;\nreturn () => ++count;',
  )
  expect(screen.getByText('Move count outside.')).toBeTruthy()
  fireEvent.click(copy)
  expect(screen.getByText('Copy the changed path.')).toBeTruthy()
  expect(screen.getByText('Independent counts.')).toBeTruthy()
  expect(
    document
      .getElementById(copy.getAttribute('aria-controls')!)
      ?.querySelector('pre'),
  ).toBeNull()
  counter.focus()
  fireEvent.click(counter)
  expect(document.activeElement).toBe(counter)
  expect(counter.getAttribute('aria-expanded')).toBe('false')
  expect(screen.queryByText('Independent counts.')).toBeNull()
  expect(screen.getByText('Predict the calls.')).toBeTruthy()
  expect(screen.getByText('Copy the changed path.')).toBeTruthy()
})

test('ordinary and undrawn sheets acquire no practice heading or controls', () => {
  const { rerender } = render(
    <CheatsheetView sheet={{ ...sheet, activities: undefined }} />,
  )
  expect(screen.queryByRole('heading', { name: 'Practice' })).toBeNull()
  rerender(<CheatsheetView sheet={{ ...sheet, activities: [] }} />)
  expect(screen.queryByRole('button')).toBeNull()
  rerender(<CheatsheetView sheet={{ ...sheet, sections: [] }} />)
  expect(screen.queryByRole('heading', { name: 'Practice' })).toBeNull()
})

test('sheet-prefixed IDs avoid collisions and a new sheet starts with its own closed solutions', () => {
  const { rerender } = render(<CheatsheetView sheet={sheet} />)
  fireEvent.click(
    screen.getByRole('button', { name: 'Solution: Counter factory' }),
  )
  rerender(<CheatsheetView sheet={{ ...sheet, slug: 'another' }} />)
  const control = screen.getByRole('button', {
    name: 'Solution: Counter factory',
  })
  expect(control.getAttribute('aria-controls')).toBe(
    'sheet-another-activity-counter',
  )
  expect(control.getAttribute('aria-expanded')).toBe('false')
  expect(screen.queryByText('Independent counts.')).toBeNull()
})

test('starter and revealed solution code are explicit keyboard tab stops that can receive focus', () => {
  render(<CheatsheetView sheet={sheet} />)
  const starter = screen.getByText('first() second()').closest('pre')!
  expect(starter.getAttribute('tabindex')).toBe('0')
  starter.focus()
  expect(document.activeElement).toBe(starter)

  fireEvent.click(
    screen.getByRole('button', { name: 'Solution: Counter factory' }),
  )
  const solution = screen
    .getByText('let count = 0; return () => ++count;')
    .closest('pre')!
  expect(solution.getAttribute('tabindex')).toBe('0')
  solution.focus()
  expect(document.activeElement).toBe(solution)
})
