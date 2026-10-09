import { fireEvent, render, screen } from '@testing-library/react'
import { expect, test, vi } from 'vitest'
import { Term } from './Term'

test('an open definition stays inside a narrower viewport and returns to its anchor when space grows', () => {
  const viewport = Object.getOwnPropertyDescriptor(window, 'innerWidth')!
  Object.defineProperty(window, 'innerWidth', {
    configurable: true,
    value: 1600,
    writable: true,
  })
  const layout = vi
    .spyOn(Element.prototype, 'getBoundingClientRect')
    .mockImplementation(function (this: Element) {
      if (this.getAttribute('role') !== 'note') return new DOMRect()
      const anchorLeft = window.innerWidth < 1024 ? 650 : 1200
      const margin =
        Number.parseFloat((this as HTMLElement).style.marginLeft) || 0
      return new DOMRect(anchorLeft + margin, 80, 352, 180)
    })
  try {
    render(<Term id="cls">Cumulative Layout Shift</Term>)
    fireEvent.click(
      screen.getByRole('button', { name: 'Cumulative Layout Shift' }),
    )
    const note = screen.getByRole('note')
    expect(note.getBoundingClientRect().left).toBe(1200)
    window.innerWidth = 768
    fireEvent(window, new Event('resize'))
    expect(note.getBoundingClientRect().right).toBeLessThanOrEqual(752)
    expect(note.getBoundingClientRect().left).toBeGreaterThanOrEqual(16)
    window.innerWidth = 1600
    fireEvent(window, new Event('resize'))
    expect(note.getBoundingClientRect().left).toBe(1200)
    expect(screen.getByRole('button').getAttribute('aria-expanded')).toBe(
      'true',
    )
  } finally {
    layout.mockRestore()
    Object.defineProperty(window, 'innerWidth', viewport)
  }
})
