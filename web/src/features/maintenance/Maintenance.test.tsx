import { fireEvent, render, screen, within } from '@testing-library/react'
import { afterEach, expect, test } from 'vitest'
import { getStage } from '@/lib/stages'
import { STAGE_CONTENT } from '../stage-content'
import { STEP_IDS_BY_SLUG } from '../step-ids'
import { Maintenance } from './Maintenance'
import { STEP_IDS } from './steps'

afterEach(() => window.history.replaceState(null, '', '/'))

function openPanel(id: string) {
  fireEvent.click(document.getElementById(`tab-${id}`)!)
  return within(document.getElementById(`panel-${id}`)!)
}

function choose(prompt: RegExp, answer: string) {
  const group = screen.getByRole('radiogroup', { name: prompt })
  fireEvent.click(within(group).getByRole('radio', { name: answer }))
  return within(group.closest('li')!)
}

test('registers a continuous maintenance stage with the six approved lookups', () => {
  const ids = [
    'triage',
    'updates',
    'expiry',
    'data-recovery',
    'debt-retirement',
    'review-record',
  ]
  expect([...STEP_IDS]).toEqual(ids)
  expect(STEP_IDS_BY_SLUG['17-maintenance']).toEqual(ids)
  expect(STAGE_CONTENT['17-maintenance']).toBe(Maintenance)
  expect(getStage('17-maintenance')).toMatchObject({
    ready: true,
    timing: 'Continuously, in small amounts.',
  })
  render(<Maintenance />)
  const rail = screen.getByRole('tablist', { name: 'Stage steps' })
  expect([...rail.querySelectorAll('[role=tab]')].map((tab) => tab.id)).toEqual(
    ids.map((id) => `tab-${id}`),
  )
  for (const id of ids) {
    const panel = openPanel(id)
    expect(panel.getAllByRole('button').length).toBeGreaterThan(0)
  }
})

test('triage scores imminent expiry and keeps the first answer locked', () => {
  render(<Maintenance />)
  const row = choose(
    /credential expires tomorrow/,
    'Act before the routine review',
  )
  expect(row.getByText('Correct')).toBeTruthy()
  expect(screen.getByText('1/1 right')).toBeTruthy()
  expect(
    row.getByText(/deadline arrives before the next weekly slot/),
  ).toBeTruthy()
  choose(/credential expires tomorrow/, 'Schedule with an owner and date')
  expect(screen.getByText('1/1 right')).toBeTruthy()
})

test('an incorrect advisory judgment still reveals unknown exposure and build risk', () => {
  render(<Maintenance />)
  const group = screen.getByRole('radiogroup', {
    name: /advisory names an installed build dependency/,
  })
  const row = within(group.closest('li')!)
  expect(row.queryByText(/Unknown exposure is an investigation/)).toBeNull()
  fireEvent.click(
    within(group).getByRole('radio', {
      name: 'Schedule with an owner and date',
    }),
  )
  expect(screen.getByText('0/1 right')).toBeTruthy()
  expect(row.getByText(/Unknown exposure is an investigation/)).toBeTruthy()
  expect(
    row.getByText(/development dependencies can execute code too/),
  ).toBeTruthy()
  expect(
    row.getAllByRole('radio').every((r) => (r as HTMLButtonElement).disabled),
  ).toBe(true)
  fireEvent.click(screen.getByRole('button', { name: 'Reset' }))
  expect(row.queryByText(/Unknown exposure is an investigation/)).toBeNull()
  expect(
    row.getAllByRole('radio').every((r) => !(r as HTMLButtonElement).disabled),
  ).toBe(true)
})

test('recovery distinguishes provider completion from end-to-end validation', () => {
  render(<Maintenance />)
  openPanel('data-recovery')
  const incomplete = choose(
    /provider reports/,
    'Evidence supports the drill result',
  )
  expect(incomplete.getByText('Not quite')).toBeTruthy()
  expect(
    incomplete.getByText(/Measure through validation and reconnection/),
  ).toBeTruthy()
  const complete = choose(
    /An isolated drill/,
    'Evidence supports the drill result',
  )
  expect(complete.getByText('Correct')).toBeTruthy()
  expect(
    complete.getByText(/This is evidence for the tested scope/),
  ).toBeTruthy()
  expect(screen.getByText('1/2 right').getAttribute('aria-live')).toBe('polite')
})

test('an unavailable recovery point remains a gap even when the provider has a restore feature', () => {
  render(<Maintenance />)
  openPanel('data-recovery')
  const row = choose(
    /chosen recovery point is older/,
    'Recovery evidence is incomplete',
  )
  expect(row.getByText('Correct')).toBeTruthy()
  expect(row.getByText(/do not claim the drill passed/)).toBeTruthy()
})

test('retirement treats missing analytics and irreversible effects as unresolved risk', () => {
  render(<Maintenance />)
  openPanel('debt-retirement')
  const telemetry = choose(
    /admin feature has no analytics/,
    'Proceed with the bounded plan',
  )
  expect(telemetry.getByText('Not quite')).toBeTruthy()
  expect(
    telemetry.getByText(/Missing telemetry leaves usage unknown/),
  ).toBeTruthy()
  const rollback = choose(
    /retirement deletes customer data/,
    'Gather evidence or reduce risk first',
  )
  expect(rollback.getByText('Correct')).toBeTruthy()
  expect(rollback.getByText(/It cannot undo data deletion/)).toBeTruthy()
  const bounded = choose(
    /Consumers are identified/,
    'Proceed with the bounded plan',
  )
  expect(bounded.getByText('Correct')).toBeTruthy()
  expect(
    bounded.getByText(/does not automatically cancel a provider subscription/),
  ).toBeTruthy()
})

test('the fictional record reveals evidence limits and an actionable follow-up', () => {
  render(<Maintenance />)
  const panel = openPanel('review-record')
  expect(panel.getByText(/fictional maintenance record/)).toBeTruthy()
  expect(panel.queryByText(/does not supply a real notice/)).toBeNull()
  fireEvent.click(panel.getByRole('button', { name: /^Evidence/ }))
  expect(panel.getByText(/does not supply a real notice/)).toBeTruthy()
  fireEvent.click(panel.getByRole('button', { name: /^Follow-up/ }))
  expect(panel.getByText(/Choose an actual review date/)).toBeTruthy()
  fireEvent.click(
    panel.getByRole('button', {
      name: 'Completed and deferred work have evidence and dates',
    }),
  )
  expect(
    panel.getByText(/Deferred debt and retirements still have a reason/),
  ).toBeTruthy()
})

test('all seven chapter traps reveal their corrective actions', () => {
  render(<Maintenance />)
  const panel = openPanel('review-record')
  const cases = [
    ['Green CI becomes automatic approval', /Review the package’s role/],
    ['An unlimited cleanup job', /Approve retention and exclusions/],
    ['A universal maintenance percentage', /20% is not a universal standard/],
    ['Refactoring by preference', /Tie a structural change to repeated cost/],
    ['Deleting on missing analytics', /No events may mean no measurement/],
    [
      'Recovery measured only by the provider',
      /Measure through validation and reconnection against/,
    ],
    ['A queue without follow-up', /Deferral needs a reason/],
  ] as const
  for (const [title, correction] of cases) {
    fireEvent.click(panel.getByRole('button', { name: title }))
    expect(panel.getByText(correction)).toBeTruthy()
  }
})

test('rotation and restore definitions are reachable inside their disclosures', () => {
  render(<Maintenance />)
  let panel = openPanel('expiry')
  fireEvent.click(
    panel.getByRole('button', { name: /^Credentials and signing keys/ }),
  )
  fireEvent.click(panel.getByRole('button', { name: 'credential rotation' }))
  expect(panel.getByRole('note')).toBeTruthy()
  expect(
    panel
      .getByRole('link', { name: 'compromised-access response' })
      .getAttribute('href'),
  ).toBe('/stages/16-incident-management#compromised-access')
  panel = openPanel('data-recovery')
  fireEvent.click(
    panel.getByRole('button', { name: /^Prepare an isolated restore drill/ }),
  )
  fireEvent.click(panel.getByRole('button', { name: 'restore drill' }))
  expect(panel.getByRole('note')).toBeTruthy()
  expect(panel.getByText(/keep email, payments,/)).toBeTruthy()
})
