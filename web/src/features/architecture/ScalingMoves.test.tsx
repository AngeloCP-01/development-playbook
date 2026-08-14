import { fireEvent, render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import { ScalingMoves } from './ScalingMoves'

// `t-label` is a declared type role — mono, tracked caps — not an arbitrary
// class, and `RevealFacet`'s label is a different one: Newsreader, 12px, 600,
// 0.3px tracking. The migration to `RevealList` swapped these four labels from
// the first to the second, which is a visual change, undeclared, and against a
// rule this branch wrote down in two other files: `Normalisation` and
// `SoftDelete` both carry header comments saying their label blocks stay
// bespoke precisely because `RevealFacet` "would change what renders".
//
// Nothing in the data tests can see a class, so without this test the swap is
// invisible to the suite — which is how it survived a per-task review.
test('renders the catch label with the t-label type role, not RevealFacet’s sans label, since the two are different declared roles', () => {
  render(<ScalingMoves />)

  fireEvent.click(screen.getByRole('button', { name: /Vertical scaling/ }))

  const label = screen.getByText('The part not in the name')
  expect(label.className).toContain('t-label')
  expect(label.className).toContain('text-warn')
  expect(label.className).not.toContain('font-semibold')
})

// The precondition is not a row, and its `catch` is a plain paragraph with no
// label at all. If the four labelled ones were ever regenerated from the data
// rather than written per row, this is the case that would sprout a fifth.
test('labels exactly the four rows, leaving the precondition paragraph unlabelled', () => {
  render(<ScalingMoves />)

  document
    .querySelectorAll<HTMLButtonElement>('button[aria-controls^="scaling-"]')
    .forEach((button) => fireEvent.click(button))

  expect(screen.getAllByText('The part not in the name')).toHaveLength(4)
})
