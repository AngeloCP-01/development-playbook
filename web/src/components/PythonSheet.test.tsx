import { fireEvent, render, screen, within } from '@testing-library/react'
import { expect, test } from 'vitest'
import { cheatsheetBySlug } from '@/lib/cheatsheets'
import { CheatsheetView } from './Cheatsheet'

test('registered Python lesson shows the shared child trace and a local repair that resets', () => {
  window.history.replaceState(null, '', '/reference/python#names-and-objects')
  render(<CheatsheetView sheet={cheatsheetBySlug('python')!} />)
  fireEvent.click(
    screen.getByText('Copy the child you intend to own').closest('button')!,
  )
  const trace = within(
    screen.getByRole('table', { name: 'Two dictionaries, one child list' }),
  )
  expect(
    trace.getByRole('cell', {
      name: 'Both dictionaries still refer to the tags list.',
    }),
  ).toBeTruthy()
  expect(
    screen.getByText(/Replacing an entry differs from mutating its child/),
  ).toBeTruthy()
  const name = 'Solution: Independent report requests'
  const control = screen.getByRole('button', { name })
  expect(control.getAttribute('aria-expanded')).toBe('false')
  fireEvent.click(control)
  expect(screen.getByText(/deepcopy preserves internal sharing/)).toBeTruthy()
  fireEvent.click(control)
  expect(control.getAttribute('aria-expanded')).toBe('false')
  fireEvent.click(control)
  fireEvent.click(screen.getByRole('tab', { name: /Runtime and syntax/ }))
  fireEvent.click(screen.getByRole('tab', { name: /Names and objects/ }))
  fireEvent.click(
    screen.getByText('Copy the child you intend to own').closest('button')!,
  )
  expect(
    screen.getByRole('button', { name }).getAttribute('aria-expanded'),
  ).toBe('false')
})
