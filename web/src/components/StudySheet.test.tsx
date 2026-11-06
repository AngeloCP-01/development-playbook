import { fireEvent, render, screen, within } from '@testing-library/react'
import { expect, test } from 'vitest'
import type { Cheatsheet } from '@/lib/cheatsheets'
import { CheatsheetView } from './Cheatsheet'

const sheet: Cheatsheet = {
  slug: 'lesson',
  title: 'Lesson',
  group: 'Languages',
  blurb: 'Study.',
  sections: [
    {
      title: 'First topic',
      note: 'Explain a binding.',
      study: {
        id: 'first',
        label: 'First',
        hint: 'Binding',
        activityIds: ['one'],
      },
      rows: [
        {
          term: 'Retained state',
          what: 'A function accesses its binding.',
          when: 'A snapshot would miss later changes.',
          example: [
            {
              label: 'Worked example',
              code: 'let count = 0;\n\n() => ++count',
            },
          ],
        },
      ],
    },
    {
      title: 'Second topic',
      study: {
        id: 'second',
        label: 'Second',
        hint: 'Copying',
        activityIds: ['two'],
      },
      rows: [{ term: 'Copy a path', what: 'Nested objects remain shared.' }],
    },
  ],
  activities: [
    {
      id: 'one',
      title: 'Counter',
      prompt: 'Predict the count.',
      context: 'Strict script.',
      answer: 'First answer.',
      explanation: 'First reasoning.',
    },
    {
      id: 'two',
      title: 'Copy',
      prompt: 'Repair the copy.',
      context: 'Plain object.',
      answer: 'Second answer.',
      explanation: 'Second reasoning.',
    },
  ],
  source: { title: 'Source guide', author: 'Editor' },
}

test('study composition exposes worked teaching and only local practice, with fresh hidden solutions when changing sections', () => {
  window.history.replaceState(null, '', '/reference/lesson')
  render(<CheatsheetView sheet={sheet} />)
  const rail = screen.getByRole('tablist', { name: 'Lesson sections' })
  expect(screen.getByText('Worked example')).toBeTruthy()
  expect(screen.getByText('let count = 0; () => ++count').textContent).toBe(
    'let count = 0;\n\n() => ++count',
  )
  expect(screen.getByText('Predict the count.')).toBeTruthy()
  expect(screen.queryByText('Repair the copy.')).toBeNull()
  expect(screen.queryByText('First answer.')).toBeNull()
  fireEvent.click(screen.getByRole('button', { name: 'Solution: Counter' }))
  expect(screen.getByText('First reasoning.')).toBeTruthy()
  expect(screen.getAllByRole('heading', { name: 'Practice' })).toHaveLength(1)
  fireEvent.click(within(rail).getByRole('tab', { name: /Second/ }))
  expect(screen.getByText('Repair the copy.')).toBeTruthy()
  expect(screen.queryByText('First answer.')).toBeNull()
  expect(screen.queryByText('Second answer.')).toBeNull()
  fireEvent.click(within(rail).getByRole('tab', { name: /First/ }))
  expect(screen.queryByText('First answer.')).toBeNull()
  expect(screen.getByText('Source guide')).toBeTruthy()
})

test('worked code is an explicit keyboard tab stop that can receive focus', () => {
  window.history.replaceState(null, '', '/reference/lesson')
  render(<CheatsheetView sheet={sheet} />)
  const block = screen.getByText('let count = 0; () => ++count').closest('pre')!
  expect(block.getAttribute('tabindex')).toBe('0')
  block.focus()
  expect(document.activeElement).toBe(block)
})

test('nested teaching is independently disclosed, has ordered headings and resets answers when closed or navigated away', () => {
  const nested = structuredClone(sheet)
  const first = nested.sections[0]
  delete first.study!.activityIds
  first.rows[0].study = {
    id: 'binding',
    summary: 'Trace retained access.',
    activityIds: ['one'],
  }
  first.rows.push({
    term: 'Second disclosure',
    what: 'Other teaching.',
    study: { id: 'other', summary: 'Compare bindings.', activityIds: [] },
  })
  window.history.replaceState(null, '', '/reference/lesson')
  render(<CheatsheetView sheet={nested} />)
  expect(screen.getByText('Trace retained access.')).toBeTruthy()
  expect(screen.queryByText('A function accesses its binding.')).toBeNull()
  expect(screen.queryByRole('button', { name: 'Solution: Counter' })).toBeNull()
  const binding = screen.getByRole('button', { name: /Retained state/ })
  expect(binding.closest('h3')).toBeTruthy()
  expect(binding.getAttribute('aria-controls')).toBe(
    'sheet-lesson-section-first-subsection-binding',
  )
  binding.focus()
  fireEvent.click(binding)
  expect(document.activeElement).toBe(binding)
  expect(screen.getByText('A function accesses its binding.')).toBeTruthy()
  expect(
    screen.getByRole('heading', { name: 'Practice', level: 4 }),
  ).toBeTruthy()
  const answer = screen.getByRole('button', { name: 'Solution: Counter' })
  expect(answer.closest('h5')).toBeTruthy()
  expect(screen.queryByText('First answer.')).toBeNull()
  fireEvent.click(answer)
  fireEvent.click(screen.getByRole('button', { name: /Second disclosure/ }))
  expect(screen.getByText('Other teaching.')).toBeTruthy()
  expect(screen.getByText('First answer.')).toBeTruthy()
  fireEvent.click(binding)
  expect(screen.queryByText('First answer.')).toBeNull()
  fireEvent.click(binding)
  expect(
    screen
      .getByRole('button', { name: 'Solution: Counter' })
      .getAttribute('aria-expanded'),
  ).toBe('false')
  fireEvent.click(screen.getByRole('tab', { name: /Second/ }))
  fireEvent.click(screen.getByRole('tab', { name: /First/ }))
  expect(screen.queryByText('A function accesses its binding.')).toBeNull()
  expect(screen.queryByText('Other teaching.')).toBeNull()
})
