import { describe, expect, test, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import {
  OBSERVABILITY_CHECKLIST_KEY,
  ObservabilityChecklist,
} from './ObservabilityChecklist'
import { DONE, ARTIFACT_LIST } from './checklist'

beforeEach(() => {
  window.localStorage.clear()
})

/**
 * Labels are matched on a backtick-free fragment since they render through
 * `InlineCode`; neither of these two happens to carry backticks, so the raw
 * label text doubles as its own accessible-name matcher.
 */
const FIRST = /Errors reach Sentry with readable stack traces/
const LAST = /Liveness and readiness are separate endpoints/

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

  test('checking an item survives a remount, since a worksheet that forgets is a worksheet nobody fills in', () => {
    const { unmount } = render(<ObservabilityChecklist />)
    fireEvent.click(screen.getByRole('checkbox', { name: FIRST }))

    // The tick has to reach storage, not just React state: without this the
    // assertion after the remount could be satisfied by any value that
    // happened to survive the unmount.
    expect(window.localStorage.getItem(OBSERVABILITY_CHECKLIST_KEY)).toContain(
      DONE[0].id,
    )

    unmount()
    render(<ObservabilityChecklist />)
    const box = screen.getByRole('checkbox', { name: FIRST })
    expect((box as HTMLInputElement).checked).toBe(true)
  })

  // The counter-example for the test above. If the second mount were reading
  // `useLocalStorage`'s module cache rather than storage, a tick would
  // survive a cleared browser — and the remount test would be green for a
  // reason that has nothing to do with persistence.
  test('forgets a tick once storage is cleared, since a value that outlives storage is coming from a cache and not from persistence', () => {
    const { unmount } = render(<ObservabilityChecklist />)
    fireEvent.click(screen.getByRole('checkbox', { name: FIRST }))
    unmount()

    window.localStorage.clear()
    render(<ObservabilityChecklist />)
    const box = screen.getByRole('checkbox', { name: FIRST })
    expect((box as HTMLInputElement).checked).toBe(false)
  })

  test('keys progress on the item id rather than its position, so reordering the data does not reset a reader’s ticks', () => {
    window.localStorage.setItem(
      OBSERVABILITY_CHECKLIST_KEY,
      JSON.stringify([DONE[DONE.length - 1].id]),
    )
    render(<ObservabilityChecklist />)
    expect(
      (screen.getByRole('checkbox', { name: LAST }) as HTMLInputElement)
        .checked,
    ).toBe(true)
    expect(
      (screen.getByRole('checkbox', { name: FIRST }) as HTMLInputElement)
        .checked,
    ).toBe(false)
  })
})
