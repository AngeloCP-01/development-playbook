// web/src/features/post-deployment-verification/PostDeploymentVerification.test.tsx
import { describe, expect, test } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
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

  // Coverage walk, stage 14. The doc's "Why this stage exists" names four
  // things a green deploy can hide, and three of them are the failure patterns
  // the recovery panel later pays off. The app carried the claim (the
  // "deploy succeeded" trap) but none of the evidence for it.
  test('the opening panel names what a green deploy can still hide', () => {
    render(<PostDeploymentVerification />)
    const panel = screen.getByRole('tabpanel')
    expect(panel.textContent).toMatch(/logged-in users only/i)
    expect(panel.textContent).toMatch(/deploy log/i)
  })

  // The doc draws a line the app did not: suspicious keeps you in stage 14,
  // genuinely broken moves you to stage 16. Without it a reader whose site is
  // down learns to roll back and never learns an incident process exists.
  test('the recovery panel routes a genuine outage on to stage 16', () => {
    render(<PostDeploymentVerification />)
    fireEvent.click(screen.getByRole('tab', { name: /recovery/i }))
    const panel = screen.getByRole('tabpanel')
    expect(panel.textContent).toMatch(/incident management/i)
  })

  // The trap tells the reader alarms must exist; the doc says where they get
  // configured. The app had the requirement without the pointer.
  test('the alarm section says where deployment alarms get configured', () => {
    render(<PostDeploymentVerification />)
    fireEvent.click(screen.getByRole('tab', { name: /aws/i }))
    const panel = screen.getByRole('tabpanel')
    const alarms = panel.textContent ?? ''
    expect(alarms).toMatch(/CloudWatch deployment alarms/i)
    expect(alarms).toMatch(/Production Deployment/i)
  })
})
