import { describe, expect, test, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { DeploymentChecklist } from './DeploymentChecklist'
import { DONE, ARTIFACT_LIST } from './checklist'

beforeEach(() => {
  window.localStorage.clear()
})

describe('DeploymentChecklist', () => {
  test('renders all done checkboxes', () => {
    render(<DeploymentChecklist />)
    expect(screen.getAllByRole('checkbox')).toHaveLength(DONE.length)
  })

  test('ticking a checkbox persists and shows count', () => {
    render(<DeploymentChecklist />)
    const boxes = screen.getAllByRole('checkbox')
    fireEvent.click(boxes[0])
    expect((boxes[0] as HTMLInputElement).checked).toBe(true)
    expect(screen.getByText(/1 of \d/)).toBeTruthy()
  })

  test('artifact list renders all items', () => {
    render(<DeploymentChecklist />)
    for (const a of ARTIFACT_LIST) {
      expect(screen.getByText(new RegExp(a.slice(0, 30)))).toBeTruthy()
    }
  })

  test('team notes disclosure exists', () => {
    render(<DeploymentChecklist />)
    expect(
      screen.getByRole('button', { name: /if you are not solo/i }),
    ).toBeTruthy()
  })
})
