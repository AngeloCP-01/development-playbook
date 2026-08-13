import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import { RevealFacet } from './RevealFacet'

// Tailwind scans source for complete class strings. A tone rendered as
// `text-${tone}` compiles, type-checks, passes any data test, and ships
// unstyled — the failure this component exists to make impossible. So the
// assertion is on the emitted class attribute, not on the prop.
test('emits a literal tone class, since a template-built one is purged and renders unstyled', () => {
  render(
    <RevealFacet label="The catch" tone="danger">
      body text
    </RevealFacet>,
  )
  const label = screen.getByText('The catch')
  expect(label.className).toContain('text-danger')
})

test('falls back to subtle rather than to no colour, so an unspecified tone is still legible', () => {
  render(<RevealFacet label="What it is">body text</RevealFacet>)
  expect(screen.getByText('What it is').className).toContain('text-subtle')
})
