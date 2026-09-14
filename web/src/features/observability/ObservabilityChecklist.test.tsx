import { describe, expect, test, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ObservabilityChecklist } from './ObservabilityChecklist'
import { DONE, ARTIFACT_LIST } from './checklist'

beforeEach(() => {
  window.localStorage.clear()
})

describe('ObservabilityChecklist', () => {
  test('renders all fifteen done checkboxes', () => {
    render(<ObservabilityChecklist />)
    expect(screen.getAllByRole('checkbox')).toHaveLength(DONE.length)
    expect(DONE).toHaveLength(15)
  })

  test('ticking a checkbox persists and shows the count', () => {
    render(<ObservabilityChecklist />)
    const boxes = screen.getAllByRole('checkbox')
    fireEvent.click(boxes[0])
    expect((boxes[0] as HTMLInputElement).checked).toBe(true)
    expect(screen.getByText(/1 of 15/)).toBeTruthy()
  })

  test('the ten artifacts render', () => {
    const { container } = render(<ObservabilityChecklist />)
    // `InlineCode` splits a backticked span into its own element, so an
    // artifact string that opens with one (`` `/api/health` checking... ``)
    // is not one text node — assert against the rendered text content
    // rather than `getByText`, which only matches within a single node.
    for (const a of ARTIFACT_LIST) {
      expect(container.textContent).toContain(a.replace(/`/g, '').slice(0, 28))
    }
  })

  test('team notes disclosure exists and is collapsed', () => {
    render(<ObservabilityChecklist />)
    const button = screen.getByRole('button', { name: /if you are not solo/i })
    expect(button.getAttribute('aria-expanded')).toBe('false')
  })
})
