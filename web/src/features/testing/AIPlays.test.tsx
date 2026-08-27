import { render, screen, within } from '@testing-library/react'
import { expect, test } from 'vitest'
import { AIPlays } from './AIPlays'
import { PLAYS } from './ai-plays'

/**
 * `ai-plays.test.ts` proves `PLAYS`, `AI_PREMISE` and `AI_LIMIT` against the
 * doc. This file proves the component actually renders them.
 */

/**
 * Whole-branch review M5: this used to match on `p.title.slice(0, 30)` — a
 * slice of the field the component renders, the same defect family the
 * review's own fix wave already swept out of the hard-wrap tests once it saw
 * it twice. None of these titles carries a backtick, so `InlineCode` renders
 * each whole, in one text node; asserting the full literal title, scoped to
 * its own row, proves the title reached the page in full rather than reading
 * both sides off a truncated echo of the same string.
 */
test('renders every play, with each title in full', () => {
  render(<AIPlays />)
  for (const p of PLAYS) {
    const row = screen.getByText(p.title).closest('li') as HTMLElement
    expect(within(row).getByText(p.title)).toBeDefined()
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
