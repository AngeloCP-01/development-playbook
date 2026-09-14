// web/src/features/observability/panels-act.test.tsx
import { describe, expect, test, beforeEach } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { Stepper } from '@/components/Stepper'
import { ACT_STEPS } from './panels-act'
import { ROWS as TRIAGE_ROWS } from './alert-triage'
import { ROWS as SILENCE_ROWS } from './silence'
import { TRAPS } from './traps'
import { DONE } from './checklist'

beforeEach(() => {
  window.localStorage.clear()
})

const go = (label: RegExp) =>
  fireEvent.click(screen.getByRole('tab', { name: label }))

describe('act panels', () => {
  test('five steps, in order', () => {
    render(<Stepper steps={ACT_STEPS} />)
    expect(ACT_STEPS.map((s) => s.id)).toEqual([
      'health',
      'alerts',
      'silence',
      'ai',
      'done',
    ])
    expect(screen.getAllByRole('tab')).toHaveLength(5)
  })

  test('health: the readiness artifact, the liveness route, and the figure', () => {
    render(<Stepper steps={ACT_STEPS} />)
    const panel = screen.getByRole('tabpanel')
    expect(panel.textContent).toMatch(/src\/app\/api\/health\/route\.ts/)
    expect(panel.textContent).toMatch(/return new Response\('ok'\)/)
    expect(panel.textContent).toMatch(/Restart decision/)
    expect(panel.textContent).toMatch(/Routing decision/)
    expect(panel.textContent).toMatch(/need not fail every route/)
  })

  test('alerts: the triage drill mounts with eleven rows', () => {
    render(<Stepper steps={ACT_STEPS} />)
    go(/Alerts/)
    expect(screen.getAllByRole('radiogroup')).toHaveLength(TRIAGE_ROWS.length)
    const panel = screen.getByRole('tabpanel')
    expect(panel.textContent).toMatch(/A ratio needs a floor/)
    expect(panel.textContent).toMatch(/Incident Management/)
  })

  test('silence: canary and heartbeat artifacts, and the silence drill', () => {
    render(<Stepper steps={ACT_STEPS} />)
    go(/nothing reports/)
    const panel = screen.getByRole('tabpanel')
    expect(panel.textContent).toMatch(/src\/app\/api\/canary\/route\.ts/)
    expect(panel.textContent).toMatch(/HEARTBEAT_URL/)
    expect(screen.getAllByRole('radiogroup')).toHaveLength(SILENCE_ROWS.length)
    expect(panel.textContent).toMatch(
      /Absence of a signal is not evidence of health/,
    )
    expect(panel.textContent).toMatch(/Withhold a ping/)
  })

  test('ai: six plays', () => {
    render(<Stepper steps={ACT_STEPS} />)
    go(/AI plays/)
    expect(screen.getAllByText('Prompt')).toHaveLength(5)
    expect(screen.getByText('CLI + browser tool')).toBeTruthy()
  })

  test('done: dashboards, every trap, the checklist, and references', () => {
    render(<Stepper steps={ACT_STEPS} />)
    go(/Traps/)
    const panel = screen.getByRole('tabpanel')
    expect(panel.textContent).toMatch(/is the application healthy right now/)
    expect(panel.textContent).toMatch(/sentry-cli releases new/)
    for (const t of TRAPS) {
      expect(panel.textContent, t.id).toContain(t.title.replace(/`/g, ''))
    }
    expect(screen.getAllByRole('checkbox')).toHaveLength(DONE.length)
    expect(panel.textContent).toMatch(/Four Golden Signals/)
  })
})
