import { fireEvent, render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import { cheatsheetBySlug } from '@/lib/cheatsheets'
import { CheatsheetView } from './Cheatsheet'

test('the registered JavaScript page teaches the lookup mechanisms and reveals each actual activity with its reasoning', () => {
  const sheet = cheatsheetBySlug('javascript')!
  render(<CheatsheetView sheet={sheet} />)
  expect(screen.queryByText(/sheet not drawn/i)).toBeNull()
  expect(
    screen.getByRole('heading', { name: 'Values and bindings', level: 2 }),
  ).toBeTruthy()
  expect(
    screen.getByText(/inner declaration shadows the outer binding/),
  ).toBeTruthy()
  expect(screen.getByText(/map for a transformed array/)).toBeTruthy()
  expect(screen.getByText(/Rejection does not cancel/)).toBeTruthy()
  expect(
    screen
      .getByRole('link', { name: 'The Node.js event loop' })
      .getAttribute('href'),
  ).toBe(
    'https://nodejs.org/learn/asynchronous-work/event-loop-timers-and-nexttick',
  )
  expect(screen.queryByRole('link', { name: /belongs to/i })).toBeNull()
  for (const activity of sheet.activities!) {
    expect(screen.getByText(activity.prompt)).toBeTruthy()
    expect(screen.queryByText(activity.answer)).toBeNull()
    const control = screen.getByRole('button', {
      name: `Solution: ${activity.title}`,
    })
    fireEvent.click(control)
    const panel = document.getElementById(
      control.getAttribute('aria-controls')!,
    )!
    expect(panel.textContent).toContain(activity.answer)
    expect(panel.textContent).toContain(activity.explanation)
    if (activity.solution)
      expect(panel.querySelector('code')?.textContent).toBe(
        activity.solution.code,
      )
    expect(screen.getByText(activity.prompt)).toBeTruthy()
  }
  expect(screen.getByText(/The bug can return complete/)).toBeTruthy()
  expect(
    screen.getByText(/sync 1, sync 2, promise, microtask, timer/),
  ).toBeTruthy()
})
