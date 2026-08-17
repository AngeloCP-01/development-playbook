import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import { Setup } from './Setup'
import { STEP_IDS } from './steps'

test('renders one rail tab per step id, because the audit derives its sweep from the rail', () => {
  render(<Setup />)
  for (const id of STEP_IDS) {
    expect(document.getElementById(`tab-${id}`), `tab-${id}`).not.toBeNull()
  }
})

// `getAttribute` rather than jest-dom's `toHaveAttribute`, which the plan
// reached for: this project does not install jest-dom, and `src/test/setup.ts`
// says in writing that a second responsibility there is a signal rather than a
// convenience. Every other dom test in the repo asserts attributes this way.
test('the first panel is the scaffold step, since the rail order is the reading order', () => {
  render(<Setup />)
  expect(screen.getByRole('tabpanel').getAttribute('id')).toBe('panel-scaffold')
})

// Only one panel exists at a time — `Stepper` renders the active step alone
// rather than hiding fourteen siblings — so a rail of fifteen tabs and a
// single tabpanel is the shape, not a symptom.
test('renders exactly one panel, since the stepper draws the active step alone', () => {
  render(<Setup />)
  expect(screen.getAllByRole('tabpanel')).toHaveLength(1)
})
