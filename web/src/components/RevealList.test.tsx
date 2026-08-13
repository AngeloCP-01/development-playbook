import { fireEvent, render, screen, within } from '@testing-library/react'
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

// `badge` is a conditional render: nothing enforces that a row carrying one
// actually shows it, or that a row without one stays clean. Task 5's review
// found this field entirely untested — a badge that silently stopped
// rendering would leave both the data test and this component green.
test('renders a row badge when the row carries one, since a silently dropped badge would still pass every data test', () => {
  render(
    <RevealList
      rows={[{ ...rows[0], badge: <span>fails the test</span> }, rows[1]]}
      idPrefix="t"
    />,
  )
  expect(screen.getByText('fails the test')).toBeDefined()
})

// The previous version of this test used a fixture where no row carried a
// badge, so it could not catch cross-row leakage: row one's badge appearing
// on row two would be invisible to it. Giving row one a badge and scoping the
// negative assertion to row two with `within` makes the assertion about that
// row, not about the document.
test('renders no badge for a row that does not carry one, even when a sibling row does', () => {
  render(
    <RevealList
      rows={[{ ...rows[0], badge: <span>fails the test</span> }, rows[1]]}
      idPrefix="t"
    />,
  )
  const secondRow = screen.getByRole('button', { name: /Second/ })
  expect(within(secondRow).queryByText('fails the test')).toBeNull()
})

// `summary` is optional (Task 9b): `ContractCost` and two of the five
// unmigrated accordions have no summary line at all. Before this, an absent
// summary still rendered `<span className="mt-0.5 block text-sm
// text-subtle" />` into the DOM — an empty element a later reader cannot
// distinguish from an accidental omission. Scoped to the row with `within`,
// the way the badge-leakage test above is scoped, so a leaked summary from a
// sibling row would still be caught.
test('renders no summary element for a row that does not carry a summary', () => {
  const withoutSummary = {
    id: rows[0].id,
    title: rows[0].title,
    body: rows[0].body,
  }
  render(<RevealList rows={[withoutSummary, rows[1]]} idPrefix="t" />)
  const firstRow = screen.getByRole('button', { name: /First/ })
  expect(within(firstRow).queryByText('first summary')).toBeNull()
  expect(firstRow.querySelector('span.text-subtle')).toBeNull()
})
