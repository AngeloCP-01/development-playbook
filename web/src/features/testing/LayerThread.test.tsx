import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import { LayerThread } from './LayerThread'
import { LAYERS } from './layers'

/**
 * F2 draws one feature at three altitudes. The assertions that matter: the
 * doc's own volume words render as literals, every layer's blind spot
 * reaches the page (the chain the figure exists to show), and the level
 * coding never rides on colour alone — the label text is always there too.
 */

test("renders all three layers with the doc's volumes as literals", () => {
  render(<LayerThread />)
  expect(screen.getByText('Many')).toBeDefined()
  expect(screen.getByText('Some')).toBeDefined()
  expect(screen.getByText('Few')).toBeDefined()
})

test('every layer shows what it cannot see, which is the chain', () => {
  render(<LayerThread />)
  for (const l of LAYERS) {
    expect(screen.getByText(new RegExp(l.blind.slice(0, 30)))).toBeDefined()
  }
})

test('the level coding is not carried by colour alone', () => {
  render(<LayerThread />)
  for (const l of LAYERS) {
    expect(screen.getByText(l.label)).toBeDefined()
  }
})
