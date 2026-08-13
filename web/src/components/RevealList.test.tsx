import { fireEvent, render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import { RevealList } from './RevealList'

const rows = [
  {
    id: 'one',
    title: 'First',
    summary: 'first summary',
    body: <p>first body</p>,
  },
  {
    id: 'two',
    title: 'Second',
    summary: 'second summary',
    body: <p>second body</p>,
  },
]

// The panel is a conditional render. A component that always mounted the body
// would satisfy every data test about `rows` while destroying the pattern —
// collapsed by default is what keeps a long stage from reading as a wall.
test('keeps every row collapsed until it is opened, since collapsed-by-default is the pattern', () => {
  render(<RevealList rows={rows} idPrefix="t" />)
  expect(screen.queryByText('first body')).toBeNull()
  expect(screen.getAllByRole('button')).toHaveLength(2)
})

// aria-controls is assembled in the component from idPrefix and row id. If it
// names an element that does not exist, a screen reader user is told there is
// a panel and cannot reach it, and nothing visual is wrong.
test('points aria-controls at the panel that actually mounts, since a dangling id is silent for sighted readers', () => {
  render(<RevealList rows={rows} idPrefix="t" />)
  fireEvent.click(screen.getByRole('button', { name: /First/ }))

  const control = screen.getByRole('button', { name: /First/ })
  expect(control.getAttribute('aria-expanded')).toBe('true')

  const panelId = control.getAttribute('aria-controls')
  expect(panelId).toBe('t-one')
  expect(document.getElementById(panelId!)).not.toBeNull()
  expect(screen.getByText('first body')).toBeDefined()
})

// Rows open independently rather than as a single-open accordion: a reader
// comparing two items has to be able to hold both open. This was a deliberate
// choice in DeferredList and is easy to lose in a rewrite.
test('lets two rows be open at once, since comparing items is why the list is not an accordion', () => {
  render(<RevealList rows={rows} idPrefix="t" />)
  fireEvent.click(screen.getByRole('button', { name: /First/ }))
  fireEvent.click(screen.getByRole('button', { name: /Second/ }))
  expect(screen.getByText('first body')).toBeDefined()
  expect(screen.getByText('second body')).toBeDefined()
})

test('renders header and footer slots outside the row list, since three callers close on a summarising paragraph', () => {
  render(
    <RevealList
      rows={rows}
      idPrefix="t"
      header={<p>the precondition</p>}
      footer={<p>the closing claim</p>}
    />,
  )
  expect(screen.getByText('the precondition')).toBeDefined()
  expect(screen.getByText('the closing claim')).toBeDefined()
})
