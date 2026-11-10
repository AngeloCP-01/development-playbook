import { fireEvent, render, screen, within } from '@testing-library/react'
import { expect, test } from 'vitest'
import { studySections } from '@/lib/cheatsheets/study-sections'
import { cheatsheetBySlug } from '@/lib/cheatsheets'
import { CheatsheetView } from './Cheatsheet'

test.each(studySections(cheatsheetBySlug('javascript')!)!)(
  'the registered JavaScript $study.id section renders its teaching and local activities',
  (section) => {
    window.history.replaceState(
      null,
      '',
      `/reference/javascript#${section.study.id}`,
    )
    const sheet = cheatsheetBySlug('javascript')!
    render(<CheatsheetView sheet={sheet} />)
    expect(screen.queryByText(/sheet not drawn/i)).toBeNull()
    expect(
      screen.getByRole('tablist', { name: 'JavaScript sections' }),
    ).toBeTruthy()
    expect(
      screen.getByRole('link', { name: 'The Node.js event loop' }),
    ).toBeTruthy()
    const titles = [
      'Fundamentals',
      'Scope and closures',
      'Functions and this',
      'Objects and data',
      'Collections and problem solving',
      'Promises and errors',
      'Scheduling',
      'Modules',
    ]
    expect(sheet.sections.map((section) => section.title)).toEqual(titles)
    const observed = new Set<string>()
    {
      fireEvent.click(
        screen.getByRole('tab', { name: new RegExp(section.study!.label) }),
      )
      expect(
        screen.getByRole('heading', { name: section.title, level: 2 }),
      ).toBeTruthy()
      for (const { row, activities } of section.subsections!) {
        expect(screen.getByText(row.study.summary)).toBeTruthy()
        if (!row.teaching) expect(screen.queryByText(row.what)).toBeNull()
        const topicControl = screen
          .getByText((row.term ?? row.code)!)
          .closest('button')!
        expect(topicControl.getAttribute('aria-expanded')).toBe('false')
        fireEvent.click(topicControl)
        const topic = document.getElementById(
          topicControl.getAttribute('aria-controls')!,
        )!
        const body = within(topic)
        if (row.teaching) {
          for (const block of row.teaching) {
            if (block.kind === 'paragraph')
              expect(body.getByText(block.text)).toBeTruthy()
            if (block.kind === 'code')
              expect(
                [...topic.querySelectorAll('pre code')].some(
                  (node) => node.textContent === block.code,
                ),
              ).toBe(true)
            if (block.kind === 'table')
              expect(
                body.getByRole('table', { name: block.label }),
              ).toBeTruthy()
            if (block.kind === 'interview') {
              expect(
                body.getByRole('heading', { name: block.question, level: 4 }),
              ).toBeTruthy()
              expect(body.getByText(block.answer)).toBeTruthy()
            }
          }
        } else expect(body.getByText(row.what)).toBeTruthy()
        for (const example of row.example ?? [])
          expect(
            [...topic.querySelectorAll('pre code')].some(
              (node) => node.textContent === example.code,
            ),
          ).toBe(true)
        for (const activity of activities) {
          const control = body.queryByRole('button', {
            name: `Solution: ${activity.title}`,
          })
          expect(control).toBeTruthy()
          expect(screen.queryByText(activity.answer)).toBeNull()
          observed.add(activity.id)
          expect(screen.getByText(activity.prompt)).toBeTruthy()
          fireEvent.click(control!)
          const panel = document.getElementById(
            control!.getAttribute('aria-controls')!,
          )!
          expect(panel.textContent).toContain(activity.answer)
          expect(panel.textContent).toContain(activity.explanation)
          if (activity.solution)
            expect(panel.querySelector('code')?.textContent).toBe(
              activity.solution.code,
            )
          fireEvent.click(control!)
          expect(screen.queryByText(activity.answer)).toBeNull()
        }
        fireEvent.click(topicControl)
      }
    }
    expect([...observed]).toEqual(
      section.activities.map((activity) => activity.id),
    )
  },
)

test('the Promises opening is visible while worked details and answers remain collapsed', () => {
  window.history.replaceState(null, '', '/reference/javascript#async')
  render(<CheatsheetView sheet={cheatsheetBySlug('javascript')!} />)
  const opening = screen.getByText(/Imagine a screen needs a person/)
  expect(opening).toBeTruthy()
  expect(screen.queryByRole('table')).toBeNull()
  fireEvent.click(screen.getByRole('button', { name: /Return a promise now/ }))
  const table = screen.getByRole('table', {
    name: 'Promise states in the lookup',
  })
  expect(table.querySelector('th[scope="col"]')).toBeTruthy()
  expect(table.textContent).toContain('Pending')
  expect(table.textContent).toContain('Fulfilled')
  expect(table.textContent).toContain('Rejected')
  expect(
    screen.queryByRole('button', { name: 'Solution: Async iteration repair' }),
  ).toBeNull()
})
