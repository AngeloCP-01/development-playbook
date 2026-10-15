import { fireEvent, render, screen, within } from '@testing-library/react'
import { beforeEach, expect, test } from 'vitest'
import { getStage } from '@/lib/stages'
import { STAGE_CONTENT } from '@/features/stage-content'
import { STEP_IDS_BY_SLUG } from '@/features/step-ids'
import { PerformanceOptimization } from './PerformanceOptimization'
import { COVERAGE } from './content'

const IDS = [
  'clock',
  'baseline',
  'target',
  'bottleneck',
  'query',
  'fixes',
  'compare',
  'record',
  'followup',
  'ai',
  'done',
  'traps',
]
const LABELS = [
  'Choose a clock',
  'First baseline',
  'User target',
  'Find the bottleneck',
  'Read the plan',
  'Candidate fixes',
  'Compare outcomes',
  'Your baseline',
  'Your follow-up',
  'AI plays',
  'Done',
  'Traps',
]

beforeEach(() => {
  window.localStorage.clear()
  window.history.replaceState(null, '', '/stages/09-performance-optimization')
})

function go(id: string) {
  fireEvent.click(document.getElementById(`tab-${id}`)!)
  return screen.getByRole('tabpanel')
}

test('the rail names the outcome judgments in order rather than treating internal progress as the verdict', () => {
  render(<PerformanceOptimization />)
  const tabs = screen.getAllByRole('tab')
  expect(tabs.map((node) => node.id)).toEqual(IDS.map((id) => `tab-${id}`))
  LABELS.forEach((label, index) =>
    expect(tabs[index].textContent).toContain(label),
  )
})

test('ready, registration and declared ids expose the same stage', () => {
  expect(getStage('09-performance-optimization')?.ready).toBe(true)
  expect(STAGE_CONTENT['09-performance-optimization']).toBe(
    PerformanceOptimization,
  )
  expect(STEP_IDS_BY_SLUG['09-performance-optimization']).toEqual(IDS)
})

test('the stage actually renders the mapped judgments and their interactive evidence', () => {
  render(<PerformanceOptimization />)
  const assigned = new Set(Object.values(COVERAGE).flat())
  expect([...assigned].filter((id) => !IDS.includes(id))).toEqual([])
  expect(
    within(go('clock')).getByRole('region', { name: 'Selected measurement' }),
  ).toBeTruthy()
  expect(
    within(go('baseline')).getByRole('button', { name: 'Commit measurement' }),
  ).toBeTruthy()
  expect(go('target').textContent).toContain(
    'p75, separately for mobile and desktop',
  )
  expect(within(go('bottleneck')).getAllByRole('radio')).toHaveLength(3)
  expect(go('query').querySelectorAll('[data-artifact-line]')).toHaveLength(2)
  expect(
    within(go('fixes')).getByRole('button', { name: 'Caching' }),
  ).toBeTruthy()
  expect(
    within(go('compare')).getByRole('table', {
      name: 'Before and after evidence',
    }),
  ).toBeTruthy()
  expect(within(go('record')).getAllByRole('textbox')).toHaveLength(6)
  expect(within(go('followup')).getAllByRole('textbox')).toHaveLength(5)
  expect(
    within(go('ai')).getByRole('button', { name: 'Copy evidence prompt' }),
  ).toBeTruthy()
  expect(within(go('done')).getAllByRole('checkbox')).toHaveLength(5)
  expect(
    within(go('traps')).getByRole('button', {
      name: 'Stopping at a faster internal span',
    }),
  ).toBeTruthy()
  expect(screen.getAllByRole('link')).toHaveLength(5)
})

test('first appearances open all six new terms where the reader encounters them', () => {
  render(<PerformanceOptimization />)
  const cases = [
    ['target', 'Largest Contentful Paint'],
    ['target', 'Interaction to Next Paint'],
    ['target', 'Cumulative Layout Shift'],
    ['bottleneck', 'N+1 queries'],
    ['query', 'query plan'],
    ['fixes', 'cache invalidation'],
  ] as const
  for (const [id, name] of cases) {
    const panel = go(id)
    fireEvent.click(within(panel).getByRole('button', { name }))
    expect(within(panel).getByRole('note').textContent).toContain(
      'Why it matters.',
    )
    fireEvent.keyDown(window, { key: 'Escape' })
  }
})

test('saved baseline and follow-up fields remain one record after the actual stepper switches panels', () => {
  render(<PerformanceOptimization />)
  fireEvent.change(
    within(go('record')).getByLabelText('Outcome and observer'),
    { target: { value: 'Browser start to visible stop' } },
  )
  fireEvent.change(
    within(go('followup')).getByLabelText('Verdict and open gap'),
    { target: { value: 'Observe again next week' } },
  )
  expect(
    (
      within(go('record')).getByLabelText(
        'Outcome and observer',
      ) as HTMLTextAreaElement
    ).value,
  ).toBe('Browser start to visible stop')
  expect(
    (
      within(go('followup')).getByLabelText(
        'Verdict and open gap',
      ) as HTMLTextAreaElement
    ).value,
  ).toBe('Observe again next week')
})
