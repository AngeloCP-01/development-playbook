import { beforeEach, expect, test } from 'vitest'
import { fireEvent, render, screen, within } from '@testing-library/react'
import { SecurityAudit } from './SecurityAudit'
import { POLICY, STEP_IDS } from './content'

beforeEach(() => {
  window.history.replaceState(null, '', '/stages/08-security-audit')
})

function go(label: RegExp) {
  fireEvent.click(screen.getByRole('tab', { name: label }))
  return screen.getByRole('tabpanel')
}

test('the stage gives each audit judgment a deep-linkable step', () => {
  render(<SecurityAudit />)
  expect(screen.getAllByRole('tab')).toHaveLength(STEP_IDS.length)
  expect(STEP_IDS).toEqual([
    'scope',
    'boundaries',
    'policy',
    'two-users',
    'query',
    'controls',
    'finding',
    'ai',
    'done',
    'traps',
  ])
})

test('the first unfamiliar security term opens a definition in place', () => {
  render(<SecurityAudit />)
  fireEvent.click(screen.getByRole('button', { name: 'authorization' }))
  expect(screen.getByRole('note').textContent).toMatch(/may read invoice 42/)
})

test('every policy operation renders the other user and anonymous as denied', () => {
  render(<SecurityAudit />)
  const panel = go(/Permission policy/)
  for (const row of POLICY) {
    const operation = within(panel).getByRole('button', {
      name: new RegExp(row.operation, 'i'),
    })
    fireEvent.click(operation)
    const detail = within(panel).getByTestId('policy-detail')
    expect(detail.textContent).toMatch(/User B: deny/)
    expect(detail.textContent).toMatch(/Anonymous: deny/)
    expect(detail.textContent).toMatch(/Admin without grant: deny/)
  }
})

test('the two-user probe locks a choice before explaining the denial', () => {
  render(<SecurityAudit />)
  const panel = go(/Two-user probe/)
  expect(panel.textContent).not.toMatch(/No PDF bytes returned/)
  fireEvent.click(
    within(panel).getByRole('button', { name: /Allow the export/ }),
  )
  expect(panel.textContent).toMatch(/No PDF bytes returned/)
  expect(panel.textContent).toMatch(/invoice remains unchanged/)
  expect(
    (
      within(panel).getByRole('button', {
        name: /Deny the export/,
      }) as HTMLButtonElement
    ).disabled,
  ).toBe(true)
})

test('the controls distinguish safe SQL and the finding carries a retest', () => {
  render(<SecurityAudit />)
  const controls = go(/Other checks/)
  fireEvent.click(
    within(controls).getByRole('button', { name: /SQL insertion/ }),
  )
  expect(controls.textContent).toMatch(/sql\.raw\(\)/)
  const finding = go(/Finding record/)
  for (const field of ['Evidence', 'Impact', 'Fix', 'Retest', 'Risk owner']) {
    expect(finding.textContent).toContain(field)
  }
  expect(go(/AI plays/).textContent).toMatch(/verify the permission policy/)
})
