import { fireEvent, render, screen, within } from '@testing-library/react'
import { expect, test } from 'vitest'
import { DeployBlockers } from './DeployBlockers'
import { BLOCKERS } from './blockers'

// Every blocker offers the same four causes (`blockers.ts` shares one `CAUSES`
// array), so an unscoped `getByRole('radio', { name })` matches four elements
// and throws on ambiguity. Each card is reached by the one thing that differs
// between them — its symptom, which is also the radiogroup's accessible name.
const cardFor = (symptom: string) =>
  screen.getByRole('radiogroup', { name: symptom })

test('renders one card per blocker, derived from the data rather than hardcoded', () => {
  render(<DeployBlockers />)
  expect(screen.getAllByRole('radiogroup')).toHaveLength(BLOCKERS.length)
  for (const b of BLOCKERS) {
    expect(screen.getByText(b.symptom)).toBeDefined()
  }
})

// The lesson is the guess. A verdict visible before a choice is made turns the
// exercise into a table with extra clicks.
test('hides every verdict until that blocker has been answered', () => {
  render(<DeployBlockers />)
  for (const b of BLOCKERS) {
    expect(screen.queryByText(b.explanation)).toBeNull()
  }
})

test('reveals only the answered blocker’s verdict, not the whole set', () => {
  render(<DeployBlockers />)
  const first = BLOCKERS[0]
  fireEvent.click(
    within(cardFor(first.symptom)).getByRole('radio', {
      name: first.options[0].label,
    }),
  )
  expect(screen.getByText(first.explanation)).toBeDefined()
  expect(screen.queryByText(BLOCKERS[1].explanation)).toBeNull()
})

test('a locked answer cannot be changed, since scoring a second guess scores hindsight', () => {
  render(<DeployBlockers />)
  const first = BLOCKERS[0]
  const card = cardFor(first.symptom)
  fireEvent.click(
    within(card).getByRole('radio', { name: first.options[0].label }),
  )
  const other = within(card).getByRole('radio', {
    name: first.options[1].label,
  })
  expect((other as HTMLButtonElement).disabled).toBe(true)

  // `disabled` is the half this level can actually see: jsdom suppresses the
  // click on a disabled button, so the recorded answer survives a second one.
  // Checked rather than assumed — deleting the component's `id in prev` state
  // guard leaves this file green, and only flipping `disabled` off fails it.
  // The state guard stays as a backstop for the paths a render test cannot
  // dispatch, untested here on purpose rather than by oversight.
  fireEvent.click(other)
  const picked = within(card).getByRole('radio', {
    name: first.options[0].label,
  })
  expect(picked.getAttribute('aria-checked')).toBe('true')
  expect(other.getAttribute('aria-checked')).toBe('false')
})

// The set is scored, not the card: a reader who reaches `wrong-repo` by
// elimination still had to commit to the other three first, and the running
// count is what makes that visible.
test('scores across the whole set of four rather than per blocker', () => {
  render(<DeployBlockers />)

  const answer = (b: (typeof BLOCKERS)[number], optionId: string) =>
    fireEvent.click(
      within(cardFor(b.symptom)).getByRole('radio', {
        name: b.options.find((o) => o.id === optionId)!.label,
      }),
    )

  answer(BLOCKERS[0], BLOCKERS[0].answer)
  expect(screen.getByText('1/1 right')).toBeDefined()

  const wrong = BLOCKERS[1].options.find((o) => o.id !== BLOCKERS[1].answer)!
  answer(BLOCKERS[1], wrong.id)
  expect(screen.getByText('1/2 right')).toBeDefined()
})
