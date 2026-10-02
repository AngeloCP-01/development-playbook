import { createElement } from 'react'
import { fireEvent, render, screen, within } from '@testing-library/react'
import { beforeEach, expect, test, vi } from 'vitest'
import { getStage } from '@/lib/stages'
import { STAGE_CONTENT } from './stage-content'

const slug = '16-incident-management'

beforeEach(() => window.localStorage.clear())

function mount() {
  const Stage = STAGE_CONTENT[slug]
  expect(Stage).toBeDefined()
  render(createElement(Stage))
}

function go(label: RegExp) {
  fireEvent.click(screen.getByRole('tab', { name: label }))
  return screen.getByRole('tabpanel')
}

test('incident management opens as a usable stage with a quick first response', () => {
  expect(getStage(slug)?.ready).toBe(true)
  mount()
  expect(screen.getByRole('tab', { name: /First response/i })).toBeDefined()
  expect(screen.getByRole('tabpanel').textContent).toMatch(/homepage.*worker/i)
})

test('the Nudge impact drill rejects a healthy homepage as recovery evidence', () => {
  mount()
  const row = screen.getByRole('radiogroup', { name: /homepage is healthy/i })
  expect(within(row).queryByText(/worker completion/i)).toBeNull()
  fireEvent.click(within(row).getByRole('radio', { name: 'Enough evidence' }))
  expect(screen.getByText('0/1 right')).toBeDefined()
  expect(
    within(row.closest('li') as HTMLElement).getByText(/worker completion/i),
  ).toBeDefined()
})

test('the rail offers direct lookup for every response and follow-up decision', () => {
  mount()
  expect(screen.getAllByRole('tab').map((tab) => tab.textContent)).toEqual([
    '01First response',
    '02Severity',
    '03Mitigation',
    '04Compromised access',
    '05Escalation',
    '06Customer updates',
    '07Diagnosis',
    '08Uncertain outcomes',
    '09Recovery',
    '10Postmortem',
    '11Runbook',
    '12AI plays',
    '13Definition of done',
    '14Traps',
  ])
})

test('mitigation requires relevance, compatibility, stop conditions and an effect check', () => {
  mount()
  const panel = go(/Mitigation/)
  for (const phrase of [
    'schema compatibility',
    'stop if',
    'affected operation',
    'provider outage',
  ])
    expect(panel.textContent?.toLowerCase()).toContain(phrase)
})

test('compromised access directs containment before availability claims', () => {
  mount()
  const panel = go(/Compromised access/)
  expect(panel.textContent).toMatch(/revoke|restrict access/i)
  expect(panel.textContent).toMatch(/rollback.*does not revoke/i)
  expect(panel.textContent).toMatch(/security response procedure/i)
})

test('escalation keeps ownership when the backup cannot acknowledge', () => {
  mount()
  const panel = go(/Escalation/)
  expect(panel.textContent).toMatch(/backup.*unavailable/i)
  expect(panel.textContent).toMatch(/provider support/i)
  expect(panel.textContent).toMatch(/accepts ownership/i)
})

test('customer updates separate next update time from a recovery estimate', () => {
  mount()
  const panel = go(/Customer updates/)
  expect(panel.textContent).toMatch(/not a recovery estimate/i)
  fireEvent.click(screen.getByRole('radio', { name: /declare the incident/i }))
  expect(panel.textContent).toMatch(/10:05[\s\S]*10:15/)
})

test('Nudge rehearsal reveals the next event only after a committed decision', () => {
  mount()
  go(/Customer updates/)
  expect(screen.getByText(/10:05 UTC/)).toBeDefined()
  expect(screen.queryByText(/10:15 UTC/)).toBeNull()
  fireEvent.click(
    screen.getByRole('radio', { name: /wait because the homepage/i }),
  )
  expect(screen.getByText(/reminders are still delayed/i)).toBeDefined()
  expect(
    screen
      .getByRole('radio', { name: /declare the incident/i })
      .getAttribute('disabled'),
  ).not.toBeNull()
  fireEvent.click(screen.getByRole('button', { name: /continue to 10:15/i }))
  expect(screen.getByText(/10:15 UTC/)).toBeDefined()
  fireEvent.click(screen.getByRole('radio', { name: /pause dispatch/i }))
  fireEvent.click(screen.getByRole('button', { name: /continue to 10:25/i }))
  fireEvent.click(screen.getByRole('radio', { name: /resolve now/i }))
  expect(screen.getByText(/delayed work remains/i)).toBeDefined()
  expect(
    screen.getByText(/correct course: reconcile work and keep monitoring/i),
  ).toBeDefined()
  expect(
    screen.getByText(/model customer update after correction/i),
  ).toBeDefined()
})

test('diagnosis compares a falsifiable hypothesis against provider results', () => {
  mount()
  const panel = go(/Diagnosis/)
  expect(panel.textContent).toMatch(/provider accepted reminders/i)
  expect(panel.textContent).toMatch(/explicit rejection/i)
  expect(panel.textContent).toMatch(/earliest observed error/i)
})

test('uncertain timeout drill stops blind replay', () => {
  mount()
  go(/Uncertain outcomes/)
  const row = screen.getByRole('radiogroup', { name: /send timed out/i })
  fireEvent.click(within(row).getByRole('radio', { name: 'Replay now' }))
  expect(screen.getByText('0/1 right')).toBeDefined()
  expect(
    within(row.closest('li') as HTMLElement).getByText(/authoritative result/i),
  ).toBeDefined()
})

test('recovery requires affected-record accounting and an observation window', () => {
  mount()
  const panel = go(/Recovery/)
  expect(panel.textContent).toMatch(/confirmed sends were not repeated/i)
  expect(panel.textContent).toMatch(/expired reminders/i)
  expect(panel.textContent).toMatch(/ten-minute observation window/i)
})

test('postmortem and runbook expose reusable artifacts, not just prose', () => {
  mount()
  const postmortem = go(/Postmortem/)
  expect(postmortem.textContent).toMatch(/completion evidence/i)
  expect(postmortem.textContent).toMatch(/10:00–10:40/)
  expect(postmortem.textContent).toMatch(/aggregate affected count.*pending/i)
  expect(postmortem.textContent).toMatch(
    /close impact totals and provider follow-up/i,
  )
  expect(go(/Runbook/).textContent).toMatch(/SERVICE-SPECIFIC runbook/)
  expect(screen.getByRole('tabpanel').textContent).toMatch(/Stop conditions/)
})

test('AI assistance has a read-only evidence boundary and human review', () => {
  mount()
  const panel = go(/AI plays/)
  expect(panel.textContent).toMatch(/read-only evidence/i)
  expect(panel.textContent).toMatch(/human review/i)
  expect(panel.textContent).toMatch(/10:25/i)
})

test('definition of done separates recovery from follow-up closure', () => {
  mount()
  const panel = go(/Definition of done/)
  expect(panel.textContent).toMatch(/Service recovery/)
  expect(panel.textContent).toMatch(/Follow-up closure/)
  expect(screen.getAllByRole('checkbox')).toHaveLength(9)
  expect(panel.textContent).toMatch(/rehearsed runbook/i)
  expect(panel.textContent).toMatch(/incident record/i)
  expect(panel.textContent).toMatch(/postmortem/i)
})

test('a recovery check stays ticked when its panel is reopened', () => {
  mount()
  go(/Definition of done/)
  const check = screen.getByRole('checkbox', {
    name: /affected customer operation/i,
  }) as HTMLInputElement
  fireEvent.click(check)
  expect(check.checked).toBe(true)
  go(/Traps/)
  go(/Definition of done/)
  expect(
    (
      screen.getByRole('checkbox', {
        name: /affected customer operation/i,
      }) as HTMLInputElement
    ).checked,
  ).toBe(true)
})

test('starting a new incident clears checks from the previous one', () => {
  mount()
  go(/Definition of done/)
  const check = screen.getByRole('checkbox', {
    name: /affected customer operation/i,
  }) as HTMLInputElement
  fireEvent.click(check)
  expect(check.checked).toBe(true)
  const confirm = vi.spyOn(window, 'confirm').mockReturnValue(true)
  fireEvent.click(screen.getByRole('button', { name: /start new incident/i }))
  expect(check.checked).toBe(false)
  expect(screen.getByText(/0 of 9 checks/i)).toBeDefined()
  confirm.mockRestore()
})

test('traps close the stage with the unsafe moves from the document', () => {
  mount()
  const panel = go(/Traps/)
  expect(panel.textContent).toMatch(/Replaying timeouts blindly/)
  expect(panel.textContent).toMatch(/only runbook inside the failing service/)
  expect(panel.textContent).toMatch(/first observed error/i)
  expect(panel.textContent).toMatch(/contacts without an escalation procedure/i)
  expect(panel.textContent).toMatch(/blame or undated promises/i)
  expect(
    within(panel).getAllByRole('link', { name: /opens in a new tab/i }),
  ).toHaveLength(3)
})
