import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, expect, test, vi } from 'vitest'
import { AIPanel, TrapsPanel } from './panels-close'
import { FixesPanel, QueryPanel } from './panels-diagnose'
import { TargetsPanel } from './panels-measure'
import { AI_PROMPT, FIXES, TRAPS } from './content'
import { INVENTORY_PLAN } from './artifacts'

afterEach(() => {
  vi.unstubAllGlobals()
})

test('every candidate reveals evidence, correctness risk and comparable retest instead of a blanket recommendation', () => {
  render(<FixesPanel />)
  for (const row of FIXES) {
    const toggle = screen.getByRole('button', { name: row.title })
    fireEvent.click(toggle)
    const detail = document.getElementById(
      toggle.getAttribute('aria-controls')!,
    )!
    expect(detail.textContent).toContain(row.evidence.replace(/`/g, ''))
    expect(detail.textContent).toContain(row.risk.replace(/`/g, ''))
    expect(detail.textContent).toContain(row.retest)
  }
  const body = document.body.textContent ?? ''
  expect(body).toContain('CONCURRENTLY')
  expect(body).toContain('transaction block')
  expect(body).toContain('invalid index')
  expect(body).toContain('freshness and authorization')
  expect(body).toContain('Server Actions only')
  expect(body).toContain('300 ms to 150 ms')
  expect(body).toContain('no longer prints route-level JS bundle sizes')
  expect(body).toContain('LCP image')
  expect(body).toContain('compatible loader')
})

test('changed candidate data changes what the reader sees rather than only passing a data invariant', () => {
  render(
    <FixesPanel
      fixes={[{ ...FIXES[0], retest: 'Measure the changed user boundary.' }]}
    />,
  )
  fireEvent.click(screen.getByRole('button', { name: /Index or query shape/ }))
  expect(screen.getByText('Measure the changed user boundary.')).toBeTruthy()
})

test('every canonical trap is consultable by its own label', () => {
  render(<TrapsPanel />)
  for (const row of TRAPS) {
    fireEvent.click(screen.getByRole('button', { name: new RegExp(row.title) }))
    expect(screen.getByText(row.detail)).toBeTruthy()
  }
})

test('targets distinguish inclusive published thresholds from local product budgets', () => {
  render(<TargetsPanel />)
  expect(document.body.textContent).toContain('LCP ≤2.5 s')
  expect(document.body.textContent).toContain('INP ≤200 ms')
  expect(document.body.textContent).toContain('CLS ≤0.1')
  expect(document.body.textContent).toContain(
    'p75, separately for mobile and desktop',
  )
  expect(document.body.textContent).toContain('example budgets')
})

test('the SQL artifact renders its exact copyable lines separately from notes', () => {
  vi.stubGlobal(
    'ResizeObserver',
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  )
  const { container } = render(<QueryPanel />)
  const lines = [...container.querySelectorAll('[data-artifact-line]')].map(
    (node) => node.textContent,
  )
  expect(lines).toEqual(INVENTORY_PLAN.lines.map((line) => line.text))
})

test('the AI prompt requires real evidence and handles rejected copying without an unhandled promise', async () => {
  const writeText = vi.fn().mockRejectedValue(new Error('Clipboard denied'))
  vi.stubGlobal('navigator', { clipboard: { writeText } })
  render(<AIPanel />)
  await act(async () => {
    fireEvent.click(
      screen.getByRole('button', { name: 'Copy evidence prompt' }),
    )
  })
  expect(writeText).toHaveBeenCalledWith(AI_PROMPT)
  expect(
    (screen.getByLabelText('Evidence prompt') as HTMLTextAreaElement).value,
  ).toBe(AI_PROMPT)
  expect(
    screen.getByRole('status', { name: 'Copy status' }).textContent,
  ).toMatch(/Copy is unavailable/)
})
