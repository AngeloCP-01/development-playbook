import { render, screen, within } from '@testing-library/react'
import { expect, test } from 'vitest'
import { LayerThread } from './LayerThread'
import { LAYERS, type Layer } from './layers'

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

/**
 * Whole-branch review M5: this test used to build its needle from
 * `l.blind.slice(0, 30)` — a slice of the very field the component renders,
 * the same defect family the review's own fix wave already swept out of the
 * hard-wrap tests once it saw it twice. A hand-typed literal, one per layer,
 * actually proves that layer's sentence reached the page rather than reading
 * both sides off one source. Scoped to each layer's own row — located via
 * the header holding its label — so a false pass can't hide behind another
 * row that happens to share a word.
 */
const BLIND_SPOT_PHRASE: Record<Layer['id'], string> = {
  unit: 'a column the schema has and the type does not',
  integration: 'a form that never submits',
  e2e: 'which of the three layers below it did',
}

test('every layer shows what it cannot see, which is the chain', () => {
  render(<LayerThread />)
  for (const l of LAYERS) {
    const header = screen.getByText(l.label).closest('.p-5') as HTMLElement
    const row = header.parentElement as HTMLElement
    expect(
      within(row).getByText(new RegExp(BLIND_SPOT_PHRASE[l.id])),
    ).toBeDefined()
  }
})

test('the level coding is not carried by colour alone', () => {
  render(<LayerThread />)
  for (const l of LAYERS) {
    expect(screen.getByText(l.label)).toBeDefined()
  }
})
