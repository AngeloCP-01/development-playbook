import { render, screen, within } from '@testing-library/react'
import { expect, test } from 'vitest'
import { scaling } from '@/lib/cheatsheets/scaling'
import { CheatsheetView } from './Cheatsheet'

test('the real scaling lookup renders provider limits and fail-open behavior rather than just the algorithm names', () => {
  render(<CheatsheetView sheet={scaling} />)
  expect(screen.getByText(/This is infrastructure scaling/)).toBeTruthy()
  expect(
    screen.getByText(/If all registered targets are unhealthy.*fails open/),
  ).toBeTruthy()
  expect(
    screen.getByText(/does not support sticky sessions or slow start/),
  ).toBeTruthy()
  expect(
    screen.getByText(/do not establish more capacity in a shared database/),
  ).toBeTruthy()
  expect(
    screen
      .getByRole('link', { name: /Performance Optimization/ })
      .getAttribute('href'),
  ).toBe('/stages/09-performance-optimization')
})
test('the scaling sheet credits both publishers and exposes the read-only attribute command', () => {
  render(<CheatsheetView sheet={scaling} />)
  const footer = document.querySelector('footer')!
  expect(within(footer).getAllByRole('link')).toHaveLength(3)
  expect(
    within(footer)
      .getByRole('link', { name: 'Handling Overload' })
      .getAttribute('href'),
  ).toBe('https://sre.google/sre-book/handling-overload/')
  expect(within(footer).getAllByText(/AWS/)).toHaveLength(2)
  expect(
    screen.getByText(/aws elbv2 describe-target-group-attributes/),
  ).toBeTruthy()
  expect(screen.queryByText(/modify-target-group-attributes/)).toBeNull()
})
