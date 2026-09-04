// web/src/features/post-deployment-verification/PostDeploymentVerification.test.tsx
import { describe, expect, test } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PostDeploymentVerification } from './PostDeploymentVerification'

describe('PostDeploymentVerification page', () => {
  test('renders six steps in the rail', () => {
    render(<PostDeploymentVerification />)
    const steps = screen.getAllByRole('tab')
    expect(steps).toHaveLength(6)
  })

  test('first step label contains "ten-minute"', () => {
    render(<PostDeploymentVerification />)
    expect(screen.getByRole('tab', { name: /ten-minute/i })).toBeTruthy()
  })

  test('has a Vercel step', () => {
    render(<PostDeploymentVerification />)
    expect(screen.getByRole('tab', { name: /vercel/i })).toBeTruthy()
  })

  test('has an AWS step', () => {
    render(<PostDeploymentVerification />)
    expect(screen.getByRole('tab', { name: /aws/i })).toBeTruthy()
  })

  test('has a Recovery step', () => {
    render(<PostDeploymentVerification />)
    expect(screen.getByRole('tab', { name: /recovery/i })).toBeTruthy()
  })

  test('last step label contains "Traps" or "checklist"', () => {
    render(<PostDeploymentVerification />)
    expect(screen.getByRole('tab', { name: /traps|checklist/i })).toBeTruthy()
  })
})
