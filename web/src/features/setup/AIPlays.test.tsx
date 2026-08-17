import { fireEvent, render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import { AIPlays } from './AIPlays'
import { AI_LIMIT, PLAYS } from './ai-plays'

/**
 * `ai-plays.test.ts` proves the data against `docs/04-project-setup.md`. This
 * file proves the component actually renders that data — the pairing
 * `PATTERNS.md` requires, because a green data test plus a component that
 * ignores the data is green and wrong.
 */

test('renders one reveal row per play, so a play added to the data appears without touching this file', () => {
  render(<AIPlays />)
  expect(screen.getAllByRole('button', { expanded: false })).toHaveLength(
    PLAYS.length,
  )
})

// The dashboard limit is the section's closing point and the reason this panel
// is not a list of wins. Behind a disclosure it is the one paragraph a skimming
// reader never opens, so the assertion is not merely "it is in the document" —
// it is "it is not inside the row list".
test('states the limit outside the collapsed rows, because the dashboard is the point the reader must not miss', () => {
  render(<AIPlays />)
  const limit = screen.getByText(AI_LIMIT)
  expect(limit).not.toBeNull()
  expect(limit.closest('ul')).toBeNull()
})

// TD-34: `RevealList` hardcodes `<h3>` for every row heading and offers no prop
// to change it. The panel this renders into sits under `Section`, whose title is
// an `<h2>`, so h3 rows nest correctly — but only for as long as this component
// contributes no heading of its own at that level. Asserting "every heading here
// is an h3" pins that, and does it without counting rows, so dropping a play
// fails the count test above and this one alone stays honest.
test('contributes only h3 headings, so the rows nest under Section’s h2 instead of flattening the outline', () => {
  render(<AIPlays />)
  const headings = screen.getAllByRole('heading')
  expect(headings.length).toBeGreaterThan(0)
  expect(headings.map((h) => h.tagName)).toEqual(headings.map(() => 'H3'))
})

// Stage 04 is the first stage whose data carries markdown: `ai-plays.ts` keeps
// the doc's bold bullet leads verbatim, so two titles and three bodies quote a
// filename or a flag in backticks. Rendered raw those backticks are on the page.
// The row count is deliberately not part of this assertion, so it stays honest
// when a play is removed.
test('renders the data’s backticked spans as code rather than printing the backticks', () => {
  const { container } = render(<AIPlays />)
  for (const row of screen.getAllByRole('button', { expanded: false })) {
    fireEvent.click(row)
  }
  expect(container.querySelectorAll('code').length).toBeGreaterThan(0)
  expect(container.textContent).not.toContain('`')
})
