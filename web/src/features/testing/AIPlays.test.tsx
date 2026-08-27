import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import { AIPlays } from './AIPlays'
import { PLAYS } from './ai-plays'

/**
 * `ai-plays.test.ts` proves `PLAYS`, `AI_PREMISE` and `AI_LIMIT` against the
 * doc. This file proves the component actually renders them.
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

/**
 * The closing paragraph renders too, not only the premise and the rows —
 * finding 5 of Task 14's coverage walk: the panel named AI's failure mode
 * and never gave the counter-move.
 */
test('the closing paragraph renders, naming the one thing generation does not replace', () => {
  render(<AIPlays />)
  expect(screen.getByText(/watching the test fail/i)).toBeDefined()
})
