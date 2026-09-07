import { describe, expect, test } from 'vitest'
import { render, screen } from '@testing-library/react'
import CiCd from './CiCd'
import { STEP_IDS } from './steps'

describe('CiCd', () => {
  test('renders all step labels in the rail', () => {
    render(<CiCd />)
    // Scoped to role="tab": several labels ("Cheapest First") also appear as
    // the Stepper's "Next" nav button text, which getByText cannot disambiguate.
    // Each tab's accessible name also includes its zero-padded number
    // ("01 The Gate"), so the label is matched as a substring via regex.
    expect(screen.getByRole('tab', { name: /the gate/i })).toBeTruthy()
    expect(screen.getByRole('tab', { name: /cheapest first/i })).toBeTruthy()
    expect(screen.getByRole('tab', { name: /end-to-end/i })).toBeTruthy()
    expect(screen.getByRole('tab', { name: /branch protection/i })).toBeTruthy()
    expect(screen.getByRole('tab', { name: /dependencies/i })).toBeTruthy()
    expect(screen.getByRole('tab', { name: /scaling/i })).toBeTruthy()
    expect(screen.getByRole('tab', { name: /ai plays/i })).toBeTruthy()
    expect(screen.getByRole('tab', { name: /traps/i })).toBeTruthy()
  })

  test('step count matches STEP_IDS', () => {
    render(<CiCd />)
    const tabs = screen.getAllByRole('tab')
    expect(tabs).toHaveLength(STEP_IDS.length)
  })
})
