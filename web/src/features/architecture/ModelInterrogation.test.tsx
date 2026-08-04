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
