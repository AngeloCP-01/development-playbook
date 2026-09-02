// web/src/features/production-deployment/ProductionDeployment.test.tsx
import { describe, expect, test } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ProductionDeployment } from './ProductionDeployment'

describe('ProductionDeployment page', () => {
  test('renders six steps in the rail', () => {
    render(<ProductionDeployment />)
    const steps = screen.getAllByRole('tab')
    expect(steps).toHaveLength(6)
  })

  test('first step label contains "Small"', () => {
    render(<ProductionDeployment />)
    expect(screen.getByRole('tab', { name: /small/i })).toBeTruthy()
  })

  test('last step label is "Traps"', () => {
    render(<ProductionDeployment />)
    expect(screen.getByRole('tab', { name: /traps/i })).toBeTruthy()
  })
})
