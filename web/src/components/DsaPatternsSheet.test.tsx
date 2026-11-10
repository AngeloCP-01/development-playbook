import { fireEvent, render, screen, within } from '@testing-library/react'
import { expect, test } from 'vitest'
import { studySections } from '@/lib/cheatsheets/study-sections'
import { cheatsheetBySlug } from '@/lib/cheatsheets'
import { CheatsheetView } from './Cheatsheet'

test.each(studySections(cheatsheetBySlug('dsa-patterns')!)!)(
  'the registered DSA Patterns $study.id section renders its teaching and local activities',
  (section) => {
    window.history.replaceState(
      null,
      '',
      `/reference/dsa-patterns#${section.study.id}`,
    )
    const sheet = cheatsheetBySlug('dsa-patterns')!
    render(<CheatsheetView sheet={sheet} />)
    expect(screen.queryByText(/sheet not drawn/i)).toBeNull()
    expect(
      screen.getByRole('tablist', { name: 'DSA Patterns sections' }),
    ).toBeTruthy()
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
            if (block.kind === 'table') {
              const table = within(
                body.getByRole('table', { name: block.label }),
              )
              for (const col of block.columns)
                expect(
                  table.getByRole('columnheader', { name: col }),
                ).toBeTruthy()
              for (const cells of block.rows)
                for (const cell of cells)
                  expect(
                    table.getAllByRole('cell', { name: cell }).length,
                  ).toBeGreaterThan(0)
            }
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

test('mixed-choice solution reveals why a later refund makes early discarding unsafe', () => {
  window.history.replaceState(
    null,
    '',
    '/reference/dsa-patterns#defend-a-choice',
  )
  render(<CheatsheetView sheet={cheatsheetBySlug('dsa-patterns')!} />)
  fireEvent.click(screen.getByText('Mixed choice').closest('button')!)
  expect(screen.queryByText(/The later refund makes the initial 4/)).toBeNull()
  const solution = screen.getByRole('button', {
    name: 'Solution: Mixed choice practice',
  })
  fireEvent.click(solution)
  const panel = document.getElementById(
    solution.getAttribute('aria-controls')!,
  )!
  expect(panel.textContent).toContain(
    'The later refund makes the initial 4 part of a valid total.',
  )
  expect(panel.textContent).toContain('Positive-sum shrinking would lose it.')
  expect(panel.textContent).toContain(
    'Seed zero and query earlier prefixes before adding the current one.',
  )
  fireEvent.click(solution)
  expect(screen.queryByText(/The later refund makes the initial 4/)).toBeNull()
})
