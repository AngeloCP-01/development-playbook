import { fireEvent, render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import { cheatsheetBySlug } from '@/lib/cheatsheets'
import { CheatsheetView } from './Cheatsheet'

test('the registered JavaScript study page renders worked teaching and reveals only the selected section’s activities', () => {
  window.history.replaceState(null, '', '/reference/javascript')
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
    'Values and equality',
    'Scope and closures',
    'Functions and this',
    'Objects and prototypes',
    'Arrays',
    'Promises and errors',
    'Scheduling',
  ]
  expect(sheet.sections.map((section) => section.title)).toEqual(titles)
  const observed = new Set<string>()
  for (const section of sheet.sections) {
    fireEvent.click(
      screen.getByRole('tab', { name: new RegExp(section.study!.label) }),
    )
    expect(
      screen.getByRole('heading', { name: section.title, level: 2 }),
    ).toBeTruthy()
    for (const row of section.rows) {
      expect(screen.getByText(row.what)).toBeTruthy()
      for (const example of row.example ?? [])
        expect(
          [...document.querySelectorAll('pre code')].some(
            (node) => node.textContent === example.code,
          ),
        ).toBe(true)
    }
    for (const activity of sheet.activities!) {
      const local = section.study!.activityIds.includes(activity.id)
      const control = screen.queryByRole('button', {
        name: `Solution: ${activity.title}`,
      })
      expect(Boolean(control)).toBe(local)
      expect(screen.queryByText(activity.answer)).toBeNull()
      if (!local) continue
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
  }
  expect(observed.size).toBe(9)
})
