// web/src/features/staging/Staging.test.tsx
import { describe, expect, test } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Staging } from './Staging'

describe('Staging page', () => {
  test('renders six steps in the rail', () => {
    render(<Staging />)
    const steps = screen.getAllByRole('tab')
    expect(steps).toHaveLength(6)
  })

  test('first step label is "Preview or staging?"', () => {
    render(<Staging />)
    expect(
      screen.getByRole('tab', { name: /preview or staging/i }),
    ).toBeTruthy()
  })

  test('last step label is "Traps"', () => {
    render(<Staging />)
    expect(screen.getByRole('tab', { name: /traps/i })).toBeTruthy()
  })
})
