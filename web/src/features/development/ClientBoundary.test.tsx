import { fireEvent, render } from '@testing-library/react'
import { expect, test } from 'vitest'
import { ClientBoundary } from './ClientBoundary'

const node = (c: HTMLElement, id: string) =>
  c.querySelector<HTMLElement>(`[data-node="${id}"]`)!

test('the boundary starts on the leaf that needs it, which is the advice', () => {
  const { container } = render(<ClientBoundary />)
  expect(node(container, 'form').getAttribute('data-directive')).toBe('true')
  expect(node(container, 'page').getAttribute('data-directive')).toBe('false')
})

test('a node below the directive ships to the browser', () => {
  const { container } = render(<ClientBoundary />)
  expect(node(container, 'input').getAttribute('data-ships')).toBe('true')
})

test('a node beside the directive does not', () => {
  const { container } = render(<ClientBoundary />)
  expect(node(container, 'table').getAttribute('data-ships')).toBe('false')
  expect(node(container, 'row').getAttribute('data-ships')).toBe('false')
})

test('moving the directive to the page puts the whole tree on the far side', () => {
  const { container } = render(<ClientBoundary />)
  fireEvent.click(node(container, 'page').querySelector('button')!)
  for (const id of ['page', 'table', 'row', 'form', 'input']) {
    expect(node(container, id).getAttribute('data-ships'), id).toBe('true')
  }
})

/**
 * The correction the doc exists to make. Every node is prerendered whatever the
 * directive does, so the readout must never say a client subtree is missing
 * from the HTML — that is what sends a reader debugging a slow page looking for
 * HTML that is already there.
 *
 * F1 fix: the original version of this test only ever sampled the all-shipping
 * state (after clicking `page`, where every node's `data-ships` is already
 * `true`). A `data-prerendered` that quietly mirrored `data-ships` would look
 * identical to the real, always-`true` value in that one state, so the guard
 * could never fire. Prerendering and shipping are supposed to be independent —
 * a node can ship AND be prerendered (`input`, once `form` holds the
 * directive), and a node can be prerendered WITHOUT shipping (`table`, in the
 * default state). Asserting both attributes on both of those nodes, in the
 * state where they actually diverge, is what pins the independence rather than
 * a coincidence of the click chosen.
 */
test('every node is prerendered, wherever the boundary sits', () => {
  const { container } = render(<ClientBoundary />)

  // Default state: `form` holds the directive, so `table` does not ship and
  // `input` does — the two halves of the claim, in the one state that can
  // actually tell a real "always true" apart from a mirrored one.
  expect(node(container, 'table').getAttribute('data-ships')).toBe('false')
  expect(node(container, 'table').getAttribute('data-prerendered')).toBe('true')
  expect(node(container, 'input').getAttribute('data-ships')).toBe('true')
  expect(node(container, 'input').getAttribute('data-prerendered')).toBe('true')

  fireEvent.click(node(container, 'page').querySelector('button')!)
  for (const id of ['page', 'table', 'row', 'form', 'input']) {
    expect(node(container, id).getAttribute('data-prerendered'), id).toBe(
      'true',
    )
  }
})

test('the readout names the real cost rather than a blank page', () => {
  const { container } = render(<ClientBoundary />)
  fireEvent.click(node(container, 'page').querySelector('button')!)
  const readout = container.querySelector('[data-readout]')!
  expect(readout.textContent).toMatch(/prerendered/i)
  expect(readout.textContent).not.toMatch(/blank/i)
})

test('a Server Component passed as children stays a Server Component', () => {
  const { container } = render(<ClientBoundary />)
  fireEvent.click(node(container, 'form').querySelector('button')!)
  expect(node(container, 'input').getAttribute('data-ships')).toBe('true')
  expect(container.querySelector('[data-children-note]')).not.toBeNull()
})

test('the readout is announced, since it swaps in place', () => {
  const { container } = render(<ClientBoundary />)
  expect(
    container.querySelector('[data-readout]')!.getAttribute('aria-live'),
  ).toBe('polite')
})
