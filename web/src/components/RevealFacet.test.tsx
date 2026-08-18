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

// Task 14 found one of `ADRAnatomy`'s two facet-shaped blocks uses `text-fg`
// for its body while `RevealFacet` hardcoded `text-muted` with no override —
// genuinely different tokens in both themes. `bodyTone` closes that gap.
// Default must stay byte-identical to what every existing caller already
// gets, so this asserts the *exact* className, not a substring — a stray
// extra class here would be a regression the `toContain` checks above
// wouldn't catch.
test('defaults the body to the exact class it has always rendered, so existing callers are untouched', () => {
  render(<RevealFacet label="What it is for">body text</RevealFacet>)
  expect(screen.getByText('body text').className).toBe(
    'mt-1 text-sm leading-6 text-muted',
  )
})

test('renders the body in the fg tone when bodyTone="fg" is passed, closing the ADRAnatomy gap', () => {
  render(
    <RevealFacet label="Filled in" bodyTone="fg">
      body text
    </RevealFacet>,
  )
  expect(screen.getByText('body text').className).toBe(
    'mt-1 text-sm leading-6 text-fg',
  )
})
