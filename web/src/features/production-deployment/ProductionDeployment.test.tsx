// web/src/features/production-deployment/ProductionDeployment.test.tsx
import { describe, expect, test } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ProductionDeployment } from './ProductionDeployment'

describe('ProductionDeployment page', () => {
  test('renders seven steps in the rail', () => {
    render(<ProductionDeployment />)
    const steps = screen.getAllByRole('tab')
    expect(steps).toHaveLength(7)
  })

  test('first step label contains "Small"', () => {
    render(<ProductionDeployment />)
    expect(screen.getByRole('tab', { name: /small/i })).toBeTruthy()
  })

  test('has a Vercel step', () => {
    render(<ProductionDeployment />)
    expect(screen.getByRole('tab', { name: /vercel/i })).toBeTruthy()
  })

  test('has an AWS step', () => {
    render(<ProductionDeployment />)
    expect(screen.getByRole('tab', { name: /aws/i })).toBeTruthy()
  })

  test('has a Feature flags step', () => {
    render(<ProductionDeployment />)
    expect(screen.getByRole('tab', { name: /flag/i })).toBeTruthy()
  })

  test('last step label is "Traps"', () => {
    render(<ProductionDeployment />)
    expect(screen.getByRole('tab', { name: /traps/i })).toBeTruthy()
  })
})
