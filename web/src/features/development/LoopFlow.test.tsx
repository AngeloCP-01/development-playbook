import { fireEvent, render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import { LoopFlow } from './LoopFlow'
import { LOOP_STAGES } from './loop'
import { STAGES } from '@/lib/stages'

/**
 * `loop.test.ts` proves `LOOP_STAGES` against the doc. This file proves the
 * component actually renders it — a click-node inspector, so the shape under
 * test is TreeInspector's: one control per node, a detail panel that updates
 * on selection, and exactly one node current at a time.
 */

function stageTitle(slug: string): string {
  return STAGES.find((s) => s.slug === slug)!.title
}

test('renders one node per loop stage, so a stage added to the data appears without touching this file', () => {
  render(<LoopFlow />)
  expect(screen.getAllByRole('button')).toHaveLength(LOOP_STAGES.length)
})

test('shows the selected node’s own detail, since a panel that ignores the selection is a list with decoration', () => {
  render(<LoopFlow />)
  const testStage = LOOP_STAGES.find((s) => s.id === 'test')!
  const work = LOOP_STAGES.find((s) => s.id === 'work')!

  fireEvent.click(screen.getByRole('button', { name: testStage.label }))
  expect(screen.getByTestId('loop-detail').textContent).toContain(
    testStage.detail,
  )

  fireEvent.click(screen.getByRole('button', { name: work.label }))
  const panel = screen.getByTestId('loop-detail')
  expect(panel.textContent).toContain(work.detail)
  expect(panel.textContent).not.toContain(testStage.detail)
})

test('marks exactly one node current at a time, via aria-current', () => {
  render(<LoopFlow />)
  fireEvent.click(screen.getByRole('button', { name: LOOP_STAGES[2].label }))

  const current = screen
    .getAllByRole('button')
    .filter((b) => b.hasAttribute('aria-current'))
  expect(current).toHaveLength(1)
  expect(current[0].getAttribute('aria-label')).toBe(LOOP_STAGES[2].label)

  fireEvent.click(screen.getByRole('button', { name: LOOP_STAGES[4].label }))
  const currentAfter = screen
    .getAllByRole('button')
    .filter((b) => b.hasAttribute('aria-current'))
  expect(currentAfter).toHaveLength(1)
  expect(currentAfter[0].getAttribute('aria-label')).toBe(LOOP_STAGES[4].label)
})

// The claim this pins: a node that hands off to another stage gives the
// reader a real way to get there, not just a slug printed as text.
test('links the selected node to its target stage with a real href, named for the stage', () => {
  render(<LoopFlow />)
  const withStage = LOOP_STAGES.find((s) => s.id === 'test')!
  fireEvent.click(screen.getByRole('button', { name: withStage.label }))

  const link = screen.getByRole('link', { name: stageTitle(withStage.stage!) })
  expect(link.getAttribute('href')).toBe(`/stages/${withStage.stage}`)
})

test('renders no link for a node that does not hand off to another stage', () => {
  render(<LoopFlow />)
  const noStage = LOOP_STAGES.find((s) => !s.stage)!
  fireEvent.click(screen.getByRole('button', { name: noStage.label }))
  expect(screen.queryByRole('link')).toBeNull()
})
