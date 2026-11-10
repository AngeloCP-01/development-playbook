import { fireEvent, render, screen, within } from '@testing-library/react'
import { expect, test } from 'vitest'
import { studySections } from '@/lib/cheatsheets/study-sections'
import { cheatsheetBySlug } from '@/lib/cheatsheets'
import { CheatsheetView } from './Cheatsheet'

test.each(studySections(cheatsheetBySlug('express')!)!)(
  'the registered Node.js & Express $study.id section renders its teaching and local activities',
  (section) => {
    window.history.replaceState(
      null,
      '',
      `/reference/express#${section.study.id}`,
    )
    const sheet = cheatsheetBySlug('express')!
    render(<CheatsheetView sheet={sheet} />)
    expect(screen.queryByText(/sheet not drawn/i)).toBeNull()
    expect(
      screen.getByRole('tablist', { name: 'Node.js & Express sections' }),
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
              expect(body.getAllByText(block.text)).toBeTruthy()
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
          expect(screen.getAllByText(activity.prompt)).toBeTruthy()
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

test('ownership lesson explains the caller-header trust boundary independently', () => {
  window.history.replaceState(null, '', '/reference/express#security')
  render(<CheatsheetView sheet={cheatsheetBySlug('express')!} />)
  fireEvent.click(
    screen
      .getByText('Check ownership after trusted identity')
      .closest('button')!,
  )
  expect(screen.getByText(/An X-User-ID header is caller input/)).toBeTruthy()
  expect(screen.getByText(/No principal gives 401/)).toBeTruthy()
})

test('errors stay generic and state race reasoning renders independently; panel switch resets solutions', () => {
  window.history.replaceState(
    null,
    '',
    '/reference/express#errors-and-boundaries',
  )
  render(<CheatsheetView sheet={cheatsheetBySlug('express')!} />)
  fireEvent.click(
    screen
      .getByText('Separate missing routes from failures')
      .closest('button')!,
  )
  expect(screen.getByText(/Blindly trusting err.status/)).toBeTruthy()
  fireEvent.click(screen.getByRole('tab', { name: /Data and state/ }))
  fireEvent.click(
    screen.getByText('Reproduce an await race').closest('button')!,
  )
  expect(
    screen.getByText(/1 rather than 2: both operations read zero/),
  ).toBeTruthy()
  const solution = screen.getByRole('button', {
    name: 'Solution: Reproduce an await race practice',
  })
  fireEvent.click(solution)
  expect(solution.getAttribute('aria-expanded')).toBe('true')
  fireEvent.click(screen.getByRole('tab', { name: /Security/ }))
  fireEvent.click(screen.getByRole('tab', { name: /Data and state/ }))
  fireEvent.click(
    screen.getByText('Reproduce an await race').closest('button')!,
  )
  expect(
    screen
      .getByRole('button', {
        name: 'Solution: Reproduce an await race practice',
      })
      .getAttribute('aria-expanded'),
  ).toBe('false')
})

test('CSRF lesson distinguishes an unreadable mutation from rejected session-token intent', () => {
  window.history.replaceState(null, '', '/reference/express#security')
  render(<CheatsheetView sheet={cheatsheetBySlug('express')!} />)
  fireEvent.click(
    screen
      .getByText('Separate browser sharing from permission')
      .closest('button')!,
  )
  const table = screen.getByRole('table', {
    name: 'Cookie-authenticated mutation: each row starts with b1 present',
  })
  expect(
    within(table).getByRole('cell', {
      name: '204; b1 deleted; attacker script cannot read the response',
    }),
  ).toBeTruthy()
  expect(
    within(table).getByRole('cell', {
      name: '403; b1 remains: a token for another session is not valid.',
    }),
  ).toBeTruthy()
  expect(
    screen.getByText(/SameSite=Lax normally withholds this cookie/),
  ).toBeTruthy()
})
