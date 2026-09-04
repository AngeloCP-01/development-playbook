import { describe, expect, test, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { VerificationChecklist } from './VerificationChecklist'
import { DONE, ARTIFACT_LIST } from './checklist'

beforeEach(() => {
  window.localStorage.clear()
})

describe('VerificationChecklist', () => {
  test('renders all done checkboxes', () => {
    render(<VerificationChecklist />)
    expect(screen.getAllByRole('checkbox')).toHaveLength(DONE.length)
  })

  test('ticking a checkbox persists and shows count', () => {
    render(<VerificationChecklist />)
    const boxes = screen.getAllByRole('checkbox')
    fireEvent.click(boxes[0])
    expect((boxes[0] as HTMLInputElement).checked).toBe(true)
    expect(screen.getByText(/1 of \d/)).toBeTruthy()
  })

  test('artifact list renders all items', () => {
    render(<VerificationChecklist />)
    for (const a of ARTIFACT_LIST) {
      expect(screen.getByText(new RegExp(a.slice(0, 30)))).toBeTruthy()
    }
  })

  test('team notes disclosure exists', () => {
    render(<VerificationChecklist />)
    expect(
      screen.getByRole('button', { name: /if you are not solo/i }),
    ).toBeTruthy()
  })
})
