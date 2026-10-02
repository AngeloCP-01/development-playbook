import { describe, expect, test } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { OrderingExercise } from './OrderingExercise'
import { ORDERING_STEPS } from './ordering-exercise'

function slotFor(position: number) {
  return screen.getByRole('button', {
    name: new RegExp(`Position ${position}`),
  })
}

describe('OrderingExercise', () => {
  test('renders all five step names', () => {
    render(<OrderingExercise />)
    for (const step of ORDERING_STEPS) {
      expect(screen.getByText(step.name)).toBeTruthy()
    }
  })

  test('check button is disabled until all slots filled', () => {
    render(<OrderingExercise />)
    // Exact match: /check/i also matches "Place Typecheck" and, once placed,
    // "Position N: Typecheck" — a plan-authored ambiguity in the step names.
    const check = screen.getByRole('button', { name: 'Check my order' })
    expect((check as HTMLButtonElement).disabled).toBe(true)
  })

  test('clicking a step card fills the first empty slot', () => {
    render(<OrderingExercise />)
    const buildBtn = screen.getByRole('button', { name: /place build/i })
    fireEvent.click(buildBtn)
    // Position 1 slot should now contain "Build"
    expect(slotFor(1).textContent).toContain('Build')
  })

  test('after filling all five, check button enables', () => {
    render(<OrderingExercise />)
    // Click all five in scrambled order
    for (const name of ['Build', 'Typecheck', 'Test', 'Format', 'Lint']) {
      const btn = screen.getByRole('button', {
        name: new RegExp(`place ${name}`, 'i'),
      })
      fireEvent.click(btn)
    }
    const check = screen.getByRole('button', { name: 'Check my order' })
    expect((check as HTMLButtonElement).disabled).toBe(false)
  })

  test('after check, score region shows N/5 with literal value', () => {
    render(<OrderingExercise />)
    // Place in correct order: Format, Lint, Typecheck, Test, Build
    for (const name of ['Format', 'Lint', 'Typecheck', 'Test', 'Build']) {
      fireEvent.click(
        screen.getByRole('button', { name: new RegExp(`place ${name}`, 'i') }),
      )
    }
    fireEvent.click(screen.getByRole('button', { name: 'Check my order' }))
    // Literal assertion — not derived from data
    expect(screen.getByText('5/5')).toBeTruthy()
  })

  test('after check, step cards are no longer clickable', () => {
    render(<OrderingExercise />)
    for (const name of ['Build', 'Typecheck', 'Test', 'Format', 'Lint']) {
      fireEvent.click(
        screen.getByRole('button', { name: new RegExp(`place ${name}`, 'i') }),
      )
    }
    fireEvent.click(screen.getByRole('button', { name: 'Check my order' }))
    // All "Place" buttons should be gone (replaced by locked state)
    expect(screen.queryByRole('button', { name: /place build/i })).toBeNull()
  })

  test('score region has aria-live', () => {
    render(<OrderingExercise />)
    const live = document.querySelector('[aria-live="polite"]')
    expect(live).toBeTruthy()
  })

  test('after check, correct positions show check marks', () => {
    render(<OrderingExercise />)
    // Place all correct
    for (const name of ['Format', 'Lint', 'Typecheck', 'Test', 'Build']) {
      fireEvent.click(
        screen.getByRole('button', { name: new RegExp(`place ${name}`, 'i') }),
      )
    }
    fireEvent.click(screen.getByRole('button', { name: 'Check my order' }))
    // All five should be correct — look for the correct indicator
    const checks = screen.getAllByText('✓')
    expect(checks.length).toBe(5)
  })
})
