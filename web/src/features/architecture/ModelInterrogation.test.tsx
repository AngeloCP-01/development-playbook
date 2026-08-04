import { fireEvent, render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import { ModelInterrogation } from './ModelInterrogation'
import { INTERROGATIONS, judgeInterrogation } from './scoring'

// TD-17's original case, tested at the level it actually lives at.
// `scoring.test.ts` already proves judgeInterrogation returns `why` for a wrong
// answer; nothing proved the component puts it on screen. Gating that paragraph
// on `correct` would pass lint, typecheck, every unit test and the audit suite,
// while hiding the reasoning from exactly the readers who got it wrong.
test('shows the reasoning after a wrong answer, since an exercise that explains itself only when you are right teaches the readers who least need it', () => {
  const question = INTERROGATIONS[0]
  const wrong = question.options.find((o) => o.id !== question.answer)
  expect(wrong, 'the first interrogation has no wrong option').toBeDefined()

  render(<ModelInterrogation />)

  // fireEvent, not element.click(). RTL wraps the dispatch in act(), and a raw
  // .click() produces a React 19 act() warning — a warning the harness itself
  // emits is the kind that gets normalised.
  fireEvent.click(screen.getByRole('radio', { name: wrong!.label }))

  // The verdict has to be wrong, or the assertion below proves nothing: a test
  // that reads the `why` after a CORRECT answer passes against the defect.
  expect(screen.getByText('Not quite')).toBeDefined()

  const why = judgeInterrogation(question.id, wrong!.id).why
  expect(screen.getByText(why)).toBeDefined()
})

// Found by the whole-branch review, and the harness's first real customer: the
// panel said "Five questions" while INTERROGATIONS held six, having gained one
// when the doc did. A data test cannot see this — `scoring.test.ts` asserts the
// length and is perfectly happy — and neither can the audit suite, which never
// reads the sentence. It is the exact shape the render harness was built for.
test('counts the questions it actually renders, since a hand-written number in prose goes stale the moment the list grows', () => {
  const WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven']
  render(<ModelInterrogation />)

  const expected = WORDS[INTERROGATIONS.length]
  const blurb = screen.getByText(/questions that surface design errors/i)
  expect(blurb.textContent?.toLowerCase()).toContain(`${expected} questions`)

  // And the list really does render that many, so the sentence is checked
  // against the DOM rather than against the data it was already copied from.
  expect(screen.getAllByRole('radiogroup')).toHaveLength(INTERROGATIONS.length)
})
