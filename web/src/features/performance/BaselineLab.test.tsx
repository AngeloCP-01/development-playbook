import { fireEvent, render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import { BaselineLab } from './BaselineLab'
import { BASELINE_PRACTICE } from './baseline'

function finish(wrongFirst = false) {
  for (const [index, field] of BASELINE_PRACTICE.entries()) {
    const option = field.options.find((row) =>
      wrongFirst && index === 0
        ? row.id !== field.answer
        : row.id === field.answer,
    )!
    fireEvent.click(screen.getByRole('radio', { name: option.label }))
    fireEvent.click(screen.getByRole('button', { name: 'Commit measurement' }))
    fireEvent.click(
      screen.getByRole('button', {
        name:
          index === BASELINE_PRACTICE.length - 1
            ? 'Inspect record'
            : 'Next field',
      }),
    )
  }
}

test('a wrong observer remains visible in the assembled record, since a completed form is not a valid baseline', () => {
  render(<BaselineLab />)
  finish(true)
  const record = screen.getByRole('region', {
    name: 'Practice baseline record',
  })
  expect(record.textContent).toContain(
    'Server handler entry to server response',
  )
  expect(record.textContent).toContain('Needs correction')
  expect(record.textContent).toContain('completed outcomes')
  expect(record.textContent).toContain('failures and timeouts separately')
  expect(screen.getByText('4 of 5 choices correct')).toBeTruthy()
  expect(
    window.localStorage.getItem('playbook:performance-worksheet:v1'),
  ).toBeNull()
})

test('reasoning appears only after commit and reset clears committed hindsight', () => {
  render(<BaselineLab />)
  const first = BASELINE_PRACTICE[0]
  expect(screen.queryByText(first.why)).toBeNull()
  const commit = screen.getByRole('button', {
    name: 'Commit measurement',
  }) as HTMLButtonElement
  expect(commit.disabled).toBe(true)
  fireEvent.click(screen.getByRole('radio', { name: first.options[1].label }))
  fireEvent.click(commit)
  expect(screen.getByText(first.why)).toBeTruthy()
  for (const radio of screen.getAllByRole('radio'))
    expect((radio as HTMLInputElement).disabled).toBe(true)
  fireEvent.click(commit)
  expect(screen.getByText('0 of 1 choices correct')).toBeTruthy()
  fireEvent.click(screen.getByRole('button', { name: 'Reset practice' }))
  expect(screen.queryByText(first.why)).toBeNull()
  expect(
    (
      screen.getByRole('button', {
        name: 'Commit measurement',
      }) as HTMLButtonElement
    ).disabled,
  ).toBe(true)
})

test('a completed practice preserves field evidence and the correct clock without inventing a field p95', () => {
  render(<BaselineLab />)
  finish()
  const text =
    screen.getByRole('region', { name: 'Practice baseline record' })
      .textContent ?? ''
  for (const field of BASELINE_PRACTICE)
    expect(text).toContain(
      field.options.find((row) => row.id === field.answer)!.label,
    )
  expect(text).toContain('Place order click to response receipt in the browser')
  expect(text).toContain('p95 not yet recorded')
  expect(screen.getByText('5 of 5 choices correct')).toBeTruthy()
})
