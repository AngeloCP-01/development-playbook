import { fireEvent, render, screen, within } from '@testing-library/react'
import { expect, test } from 'vitest'
import { Testing } from './Testing'

/**
 * `Testing.tsx` holds two hand-authored arrays — `DISTRIBUTION` (Figure 1)
 * and `RESTRAINT_ROWS` — for the reason its own header comment gives: nothing
 * else in this feature needs these rows independently of the one figure that
 * renders them, so they stay local rather than becoming a sibling data
 * module with its own `*.test.ts` (same precedent as `Development.tsx`'s
 * `STUCK_MOVES`). That locality is exactly why Task 14's coverage walk found
 * these particular gaps: nothing rendered these two arrays' content against
 * the doc before. This file closes that gap the same way stage 04's
 * `Setup.test.tsx` does for its own hand-authored renders — through the
 * component `Stepper` actually draws, not a re-exported array.
 */
function panelFor(stepId: string): HTMLElement {
  // jsdom implements no layout, so it has no `scrollIntoView`, and `Stepper`
  // calls it when the hash moves the active step. Stubbed here rather than in
  // `src/test/setup.ts`, whose header argues that a second responsibility
  // there is a signal about the tests — only tests that navigate need it.
  Element.prototype.scrollIntoView = () => {}

  window.location.hash = `#${stepId}`
  const { container } = render(<Testing />)
  const panel = container.querySelector(`#panel-${stepId}`)
  if (!panel) throw new Error(`no panel rendered for ${stepId}`)
  return panel as HTMLElement
}

/**
 * Finding 1 of Task 14's coverage walk, the most misleading of the eight:
 * the doc's carve-out — "Testing that a component renders a prop tests
 * React, not your application. Test components with real logic; let the
 * rest be covered by E2E." — was never carried, so the panel read as "never
 * write component tests," contradicting this repo's own render-test rule.
 */
test('the restraint panel carries the component-test carve-out, not just "presentational"', () => {
  const panel = panelFor('restraint')
  // The row is a `RevealList` entry, collapsed until the reader expands it.
  fireEvent.click(
    within(panel).getByRole('button', {
      name: /trivial presentational components/i,
    }),
  )
  expect(panel.textContent).toContain(
    'Testing that a component renders a prop tests React, not your application.',
  )
  expect(panel.textContent).toContain(
    'Test components with real logic; let the rest be covered by E2E.',
  )
})

/**
 * Finding 2: the Coverage section's only actionable instruction.
 */
test('the restraint panel carries the CI-threshold scoping instruction', () => {
  const panel = panelFor('restraint')
  expect(panel.textContent).toContain(
    'If you enforce a threshold in CI, scope it to the modules that matter.',
  )
})

/**
 * Finding 8 (minor drift): the doc's "blanket 80% threshold" loses its
 * number in the panel's paraphrase.
 */
test('the restraint panel keeps the 80% threshold number, not a bare "a blanket threshold"', () => {
  const panel = panelFor('restraint')
  expect(panel.textContent).toContain('80%')
})

/**
 * Finding 3: the sentence that makes the unit tier a design instruction
 * rather than a description.
 */
test('Figure 1 carries the instruction to push logic into pure functions', () => {
  const panel = panelFor('triage')
  expect(panel.textContent).toContain(
    'Push logic into pure functions specifically so it can be tested this way.',
  )
})

/**
 * Finding 4: the ranking claim that tells a reader where the next hour of
 * testing effort goes.
 */
test('Figure 1 carries the best-value-per-test ranking claim for integration tests', () => {
  const panel = panelFor('triage')
  expect(panel.textContent).toContain(
    'The best value-per-test in the whole suite.',
  )
})

/**
 * Finding 8 (minor drift): the distribution is never scoped to "a Next.js
 * application," so it reads as universal.
 */
test('Figure 1 scopes the distribution to a Next.js application', () => {
  const panel = panelFor('triage')
  expect(panel.textContent).toContain('a Next.js application')
})

test('renders exactly one panel, since the stepper draws the active step alone', () => {
  render(<Testing />)
  expect(screen.getAllByRole('tabpanel')).toHaveLength(1)
})
