import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import { AIPlays } from './AIPlays'
import { PLAYS } from './ai-plays'

/**
 * `ai-plays.test.ts` proves `PLAYS` and `AI_PREMISE` against the doc. This
 * file proves the component actually renders them.
 */

test('renders every play, derived from the data', () => {
  render(<AIPlays />)
  for (const p of PLAYS) {
    expect(screen.getByText(new RegExp(p.title.slice(0, 30)))).toBeDefined()
  }
})

/**
 * The premise's second sentence reaches the page, not only its first. This is
 * the exact loss stage 05 shipped: the component paraphrased the opening and
 * dropped the half that made it usable.
 */
test('the premise renders the question, not only the warning', () => {
  render(<AIPlays />)
  expect(screen.getByText(/has this test ever been red/i)).toBeDefined()
})
