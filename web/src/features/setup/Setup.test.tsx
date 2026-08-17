import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import { Setup } from './Setup'
import { STEP_IDS } from './steps'
import { TRAPS } from './traps'
import { ARTIFACT_ITEMS } from './checklist'

test('renders one rail tab per step id, because the audit derives its sweep from the rail', () => {
  render(<Setup />)
  for (const id of STEP_IDS) {
    expect(document.getElementById(`tab-${id}`), `tab-${id}`).not.toBeNull()
  }
})

// `getAttribute` rather than jest-dom's `toHaveAttribute`, which the plan
// reached for: this project does not install jest-dom, and `src/test/setup.ts`
// says in writing that a second responsibility there is a signal rather than a
// convenience. Every other dom test in the repo asserts attributes this way.
test('the first panel is the scaffold step, since the rail order is the reading order', () => {
  render(<Setup />)
  expect(screen.getByRole('tabpanel').getAttribute('id')).toBe('panel-scaffold')
})

// Only one panel exists at a time — `Stepper` renders the active step alone
// rather than hiding fourteen siblings — so a rail of fifteen tabs and a
// single tabpanel is the shape, not a symptom.
test('renders exactly one panel, since the stepper draws the active step alone', () => {
  render(<Setup />)
  expect(screen.getAllByRole('tabpanel')).toHaveLength(1)
})

// I9, from the Wave 3 review. `Setup.tsx` holds two `.map()`s over data — the
// seven traps and the artifacts inventory — and they are the only derived
// renders in this stage that do not live in a component with its own
// `*.test.tsx`. `traps.test.ts` and `checklist.test.ts` hold the data against
// the doc; nothing rendered it. `Stepper` draws the active step alone, so the
// two tests above only ever exercise `scaffold`.
//
// That is exactly TD-17's shape: a passing data test plus a component that
// ignores the data is green and wrong. Hardcoding one trap and deleting the
// loop passed every test in the repo.
function panelFor(stepId: string): HTMLElement {
  // jsdom implements no layout, so it has no `scrollIntoView`, and `Stepper`
  // calls it when the hash moves the active step. Stubbed here rather than in
  // `src/test/setup.ts`, whose header argues that a second responsibility there
  // is a signal about the tests — only these three navigate.
  Element.prototype.scrollIntoView = () => {}

  window.location.hash = `#${stepId}`
  const { container } = render(<Setup />)
  const panel = container.querySelector(`#panel-${stepId}`)
  if (!panel) throw new Error(`no panel rendered for ${stepId}`)
  return panel as HTMLElement
}

test('renders one callout per trap, so a trap added to the data is not silently dropped', () => {
  const panel = panelFor('traps')
  for (const trap of TRAPS) {
    expect(panel.textContent, trap.id).toContain(trap.title)
  }
})

test('renders every trap body through InlineCode rather than printing backticks', () => {
  const panel = panelFor('traps')
  expect(panel.textContent).not.toContain('`')
  expect(panel.querySelectorAll('code').length).toBeGreaterThan(0)
})

test('renders one row per artifact the doc inventories, for the same reason', () => {
  const panel = panelFor('checklist')
  expect(panel.querySelectorAll('[data-artifact-item]')).toHaveLength(
    ARTIFACT_ITEMS.length,
  )
})
