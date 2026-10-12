import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, expect, test } from 'vitest'
import { PerformanceChecklist } from './PerformanceChecklist'
import { CHECKLIST_KEY, DONE, TEAM } from './checklist'

beforeEach(() => {
  window.localStorage.clear()
})

test('ticked evidence persists on remount and reset removes the checklist without touching the worksheet', () => {
  window.localStorage.setItem(
    'playbook:performance-worksheet:v1',
    '{"outcome":"Keep worksheet"}',
  )
  const view = render(<PerformanceChecklist />)
  fireEvent.click(screen.getByRole('checkbox', { name: DONE[0].text }))
  expect(screen.getByText('1 of 5 checks recorded')).toBeTruthy()
  view.unmount()
  render(<PerformanceChecklist />)
  expect(
    (screen.getByRole('checkbox', { name: DONE[0].text }) as HTMLInputElement)
      .checked,
  ).toBe(true)
  fireEvent.click(
    screen.getByRole('button', { name: 'Reset completion checks' }),
  )
  expect(screen.getByText('0 of 5 checks recorded')).toBeTruthy()
  expect(
    window.localStorage.getItem('playbook:performance-worksheet:v1'),
  ).toContain('Keep worksheet')
})

test('unknown, duplicate or malformed saved ids do not create a false completion count', () => {
  for (const raw of [
    'null',
    '{}',
    '42',
    JSON.stringify([DONE[0].id, DONE[0].id, 'obsolete', 9]),
  ]) {
    window.localStorage.setItem(CHECKLIST_KEY, raw)
    const view = render(<PerformanceChecklist />)
    expect(
      screen.getByText(
        raw.includes('obsolete')
          ? '1 of 5 checks recorded'
          : '0 of 5 checks recorded',
      ),
    ).toBeTruthy()
    view.unmount()
  }
})

test('team notes include a named budget, query-plan review and ownership of the after window', () => {
  render(<PerformanceChecklist />)
  const open = screen.getByRole('button', { name: /If you are not solo/i })
  fireEvent.click(open)
  for (const row of TEAM) expect(screen.getByText(row.detail)).toBeTruthy()
  expect(open.getAttribute('aria-expanded')).toBe('true')
})
