import { fireEvent, render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import { AIPlays } from './AIPlays'
import { PLAYS } from './ai-plays'

/**
 * `ai-plays.test.ts` proves `PLAYS` against the doc. This file proves the
 * component actually renders it — the pairing `PATTERNS.md` requires, since a
 * green data test plus a component that ignores the data is green and wrong.
 */

test('renders one reveal row per play, so a play added to the data appears without touching this file', () => {
  render(<AIPlays />)
  expect(screen.getAllByRole('button', { expanded: false })).toHaveLength(
    PLAYS.length,
  )
})

test('renders each play’s kind as a badge beside its title', () => {
  render(<AIPlays />)
  const rows = screen.getAllByRole('button', { expanded: false })
  const allText = rows.map((r) => r.textContent).join(' ')
  // Loose on placement, strict on presence: the mechanism named in the doc's
  // parentheses has to be legible somewhere in the collapsed row, not split
  // into four grouped lists (two of six plays share the "command" kind).
  expect(allText).toMatch(/Skill/)
  expect(allText).toMatch(/Saved command/)
  expect(allText).toMatch(/Memory/)
  expect(allText).toMatch(/MCP/)
})

// The assertion that matters: a `RevealList` body that never renders is
// invisible to a test that only counts rows. This one opens the mcp play
// specifically and checks its body — carrying the unstable_retry correction —
// actually reaches the DOM.
test('opens the mcp play and shows its body, since a RevealList body that never renders is the silent failure here', () => {
  render(<AIPlays />)
  const mcpPlay = PLAYS.find((p) => p.kind === 'mcp')!

  fireEvent.click(
    screen.getByRole('button', {
      name: new RegExp(mcpPlay.title.slice(0, 20)),
    }),
  )

  expect(screen.getByText(/unstable_retry/)).toBeDefined()
})
