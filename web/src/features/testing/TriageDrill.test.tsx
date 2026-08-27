import { fireEvent, render, screen, within } from '@testing-library/react'
import { expect, test } from 'vitest'
import { TriageDrill } from './TriageDrill'
import { CHANGES } from './triage'

// Every change offers the same four options, so an unscoped
// `getByRole('radio', { name })` matches six elements and throws. Each row is
// reached by the one thing that differs — its change text, which is also the
// radiogroup's accessible name.
const rowFor = (change: string) =>
  screen.getByRole('radiogroup', {
    name: new RegExp(
      change
        .replace(/`/g, '')
        .split(' ')
        .slice(0, 6)
        .join(' ')
        .replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
    ),
  })

const pick = (change: string, optionLabel: string) =>
  fireEvent.click(
    within(rowFor(change)).getByRole('radio', { name: optionLabel }),
  )

test('renders one row per change, derived from the data rather than hardcoded', () => {
  render(<TriageDrill />)
  expect(screen.getAllByRole('radiogroup')).toHaveLength(CHANGES.length)
})

test('every row offers all four options, so the reader has to read the change', () => {
  render(<TriageDrill />)
  for (const c of CHANGES) {
    expect(within(rowFor(c.change)).getAllByRole('radio')).toHaveLength(4)
  }
})

/**
 * The score is asserted against literals, never against `CHANGES[i].answer`.
 * A test shaped `pick(c.change, labelFor(c.answer))` then expecting "1/1"
 * reads both sides off one row: change the answer in the data and the test
 * follows it, so it cannot see a component that scores against the wrong
 * field. These two name the change and the option in full.
 */
test('a pricing rule scored as a unit test is right', () => {
  render(<TriageDrill />)
  pick(
    'A new discount rule: a percentage off, applied before tax.',
    'A unit test over a pure function',
  )
  expect(screen.getByText('1/1 right')).toBeDefined()
})

test('a typed presentational prop scored as a unit test is wrong', () => {
  render(<TriageDrill />)
  pick(
    'A presentational <Badge> gains a tone prop typed',
    'A unit test over a pure function',
  )
  expect(screen.getByText('0/1 right')).toBeDefined()
})

test('the explanation is hidden until the reader commits, because a revealed answer teaches nothing', () => {
  render(<TriageDrill />)
  const c = CHANGES[0]
  expect(screen.queryByText(new RegExp(c.explanation.slice(0, 40)))).toBeNull()
  pick(c.change, 'A unit test over a pure function')
  expect(screen.getByText(new RegExp(c.explanation.slice(0, 40)))).toBeDefined()
})

test('a committed row locks, so a second guess cannot score hindsight', () => {
  render(<TriageDrill />)
  const change = 'A new discount rule: a percentage off, applied before tax.'
  pick(change, 'An E2E test on the critical path')
  expect(screen.getByText('0/1 right')).toBeDefined()

  pick(change, 'A unit test over a pure function')
  expect(screen.getByText('0/1 right')).toBeDefined()

  const radios = within(rowFor(change)).getAllByRole('radio')
  expect(radios.every((r) => (r as HTMLButtonElement).disabled)).toBe(true)
})

test('the running score is announced, since it changes in place', () => {
  render(<TriageDrill />)
  pick(
    'A new discount rule: a percentage off, applied before tax.',
    'A unit test over a pure function',
  )
  const live = screen.getByText('1/1 right')
  expect(live.getAttribute('aria-live')).toBe('polite')
})

test('reset clears every answer and the score with it', () => {
  render(<TriageDrill />)
  pick(
    'A new discount rule: a percentage off, applied before tax.',
    'A unit test over a pure function',
  )
  fireEvent.click(screen.getByRole('button', { name: /reset/i }))
  expect(screen.queryByText(/right$/)).toBeNull()
  const radios = within(
    rowFor('A new discount rule: a percentage off, applied before tax.'),
  ).getAllByRole('radio')
  expect(radios.every((r) => (r as HTMLButtonElement).disabled)).toBe(false)
})
