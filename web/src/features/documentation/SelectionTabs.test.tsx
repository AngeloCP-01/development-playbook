import { fireEvent, render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import { SelectionTabs } from './SelectionTabs'
test('each choice exposes its own named panel and keyboard navigation moves both focus and content', () => {
  render(
    <SelectionTabs
      label="Document choices"
      items={[
        { id: 'old', label: 'Old', content: <p>Old content</p> },
        { id: 'new', label: 'New', content: <p>New content</p> },
      ]}
    />,
  )
  const old = screen.getByRole('tab', { name: 'Old' })
  const next = screen.getByRole('tab', { name: 'New' })
  expect(old.getAttribute('aria-controls')).not.toBe(
    next.getAttribute('aria-controls'),
  )
  fireEvent.keyDown(old, { key: 'ArrowRight' })
  expect(document.activeElement).toBe(next)
  expect(screen.getByRole('tabpanel', { name: 'New' }).textContent).toBe(
    'New content',
  )
  fireEvent.keyDown(next, { key: 'Home' })
  expect(document.activeElement).toBe(old)
  expect(screen.queryByText('New content')).toBeNull()
  fireEvent.keyDown(old, { key: 'End' })
  expect(document.activeElement).toBe(next)
  expect(next.getAttribute('aria-selected')).toBe('true')
})
