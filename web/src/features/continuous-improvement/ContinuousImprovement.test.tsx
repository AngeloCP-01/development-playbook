import { fireEvent, render, screen, within } from '@testing-library/react'
import { afterEach, expect, test } from 'vitest'
import { getStage } from '@/lib/stages'
import { STAGE_CONTENT } from '../stage-content'
import { STEP_IDS_BY_SLUG } from '../step-ids'

afterEach(() => window.history.replaceState(null, '', '/'))

function mount() {
  const Page = STAGE_CONTENT['18-continuous-improvement']
  expect(Page, 'stage 18 has an interactive page').toBeDefined()
  render(<Page />)
}

function panel(id: string) {
  fireEvent.click(document.getElementById(`tab-${id}`)!)
  return within(screen.getByRole('tabpanel'))
}

function choose(prompt: RegExp, answer: string) {
  const group = screen.getByRole('radiogroup', { name: prompt })
  fireEvent.click(within(group).getByRole('radio', { name: answer }))
  return within(group.closest('li')!)
}

test('registers seven recurring lookups, each with an interaction', () => {
  expect(getStage('18-continuous-improvement')?.ready).toBe(true)
  mount()
  const ids = [
    'measures',
    'evidence',
    'action',
    'cycle',
    'delivery',
    'ai',
    'review',
  ]
  expect(STEP_IDS_BY_SLUG['18-continuous-improvement']).toEqual(ids)
  const rail = screen.getByRole('tablist', { name: 'Stage steps' })
  expect([...rail.querySelectorAll('[role=tab]')].map((tab) => tab.id)).toEqual(
    ids.map((id) => `tab-${id}`),
  )
  for (const id of ids)
    expect(panel(id).getAllByRole('button').length).toBeGreaterThan(0)
})

test('wrong classifications reveal the distinction and lock the first judgment until reset', () => {
  mount()
  const row = choose(/18 of 30 eligible/, 'Delivery signal')
  expect(row.getByText('Not quite')).toBeTruthy()
  expect(
    row.getByText(/cannot explain why the other attempts stopped/),
  ).toBeTruthy()
  expect(screen.getByText('0/1 right').getAttribute('aria-live')).toBe('polite')
  expect(
    row.getAllByRole('radio').every((r) => (r as HTMLButtonElement).disabled),
  ).toBe(true)
  fireEvent.click(screen.getByRole('button', { name: 'Reset' }))
  expect(row.queryByText('Not quite')).toBeNull()
  choose(/18 of 30 eligible/, 'Product outcome')
  expect(screen.getByText('1/1 right')).toBeTruthy()
})

test('signal inspectors distinguish possible explanations from checks', () => {
  mount()
  const p = panel('evidence')
  expect(p.queryByText(/seasonal use/)).toBeNull()
  fireEvent.click(p.getByRole('button', { name: /^Few recorded uses/ }))
  expect(p.getByText(/seasonal use/)).toBeTruthy()
  expect(p.getByText(/whether successful uses are recorded/)).toBeTruthy()
  fireEvent.click(p.getByRole('button', { name: /^A sharp funnel drop/ }))
  expect(p.getByText(/comparable cohorts/)).toBeTruthy()
})

test('bounded decisions protect serious minority needs and avoid inventing demand', () => {
  mount()
  panel('action')
  const rare = choose(/keyboard user cannot/, 'Defer deliberately')
  expect(rare.getByText('Not quite')).toBeTruthy()
  expect(rare.getByText(/One serious access barrier/)).toBeTruthy()
  const request = choose(/asks for invoice templates/, 'Investigate first')
  expect(request.getByText('Correct')).toBeTruthy()
  expect(request.getByText(/does not prove recurring invoices/)).toBeTruthy()
})

test('the invoice record retains counts, guardrails and an inconclusive review on a wrong answer', () => {
  mount()
  const p = panel('cycle')
  fireEvent.click(p.getByRole('button', { name: /^Baseline and outcome/ }))
  expect(p.getByText(/18 of 30/)).toBeTruthy()
  fireEvent.click(p.getByRole('button', { name: /^Guardrails/ }))
  expect(p.getByText(/invalid date/)).toBeTruthy()
  const row = choose(/20 of 28/, 'The copy caused the improvement')
  expect(row.getByText('Not quite')).toBeTruthy()
  expect(row.getByText(/campaign changed the audience/)).toBeTruthy()
  expect(row.getByText(/target was not met/)).toBeTruthy()
})

test('delivery inspection includes all five DORA measures and keeps recovery scope explicit', () => {
  mount()
  const p = panel('delivery')
  fireEvent.click(
    p.getByRole('button', { name: /^Read delivery measures together/ }),
  )
  for (const measure of [
    'Change lead time',
    'Deployment frequency',
    'Failed deployment recovery time',
    'Change fail rate',
    'Deployment rework rate',
  ]) {
    expect(p.getByText(measure, { exact: false })).toBeTruthy()
  }
  expect(p.getByText(/not every operational incident/)).toBeTruthy()
  fireEvent.click(p.getByRole('button', { name: /^Pair measures with/ }))
  expect(p.getByText(/individual performance scores/)).toBeTruthy()
})

test('all four AI plays expose inputs, requested output and source verification', () => {
  mount()
  const p = panel('ai')
  for (const name of [
    'Group feedback',
    'Critique a measure',
    'Draft a small experiment',
    'Review process friction',
  ]) {
    const button = p.getByRole('button', { name: new RegExp(`^${name}`) })
    expect(button.getAttribute('aria-expanded')).toBe('false')
    fireEvent.click(button)
    const body = within(
      document.getElementById(button.getAttribute('aria-controls')!)!,
    )
    for (const label of ['Supply', 'Ask', 'Verify'])
      expect(body.getByText(label)).toBeTruthy()
  }
  expect(p.getByText(/distinct users from repeat messages/)).toBeTruthy()
  expect(p.getByText(/reject invented baselines/)).toBeTruthy()
  expect(
    p.getByText(/cannot replace observations from intended users/),
  ).toBeTruthy()
})

test('review exposes all chapter traps and distinguishes task completion from learning', () => {
  mount()
  const p = panel('review')
  fireEvent.click(p.getByRole('button', { name: /^Pause features with/ }))
  fireEvent.click(
    p.getByRole('button', { name: /^Review the previous action/ }),
  )
  expect(p.getByText(/inconclusive/)).toBeTruthy()
  for (const title of [
    'Treating a signal as a diagnosis',
    'Counting only the loudest requests',
    'Deleting from usage counts alone',
    'Calling before/after causal',
    'Optimizing the metric',
    'Closing the action without its result',
    'Assigning blame',
    'Letting AI summaries become evidence',
    'Pruning a skipped safeguard',
  ]) {
    const button = p.getByRole('button', { name: title })
    fireEvent.click(button)
    expect(
      document.getElementById(button.getAttribute('aria-controls')!)
        ?.textContent?.length,
    ).toBeGreaterThan(title.length)
  }
  expect(
    p.getByRole('link', { name: 'Maintenance' }).getAttribute('href'),
  ).toBe('/stages/17-maintenance')
})
