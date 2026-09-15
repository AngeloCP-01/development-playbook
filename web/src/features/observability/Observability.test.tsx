// web/src/features/observability/Observability.test.tsx
import { describe, expect, test, beforeEach } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { Observability } from './Observability'
import { STEP_IDS } from './steps'
import { ROWS as TRIAGE } from './alert-triage'
import { ROWS as LEVELS } from './log-levels'
import { ROWS as SILENCE } from './silence'
import { ROWS as SCRUBBER } from './scrubber'

beforeEach(() => {
  window.localStorage.clear()
})

const go = (label: RegExp) =>
  fireEvent.click(screen.getByRole('tab', { name: label }))

describe('Observability page', () => {
  test('renders sixteen steps in the rail, in STEP_IDS order', () => {
    render(<Observability />)
    const tabs = screen.getAllByRole('tab')
    expect(tabs).toHaveLength(STEP_IDS.length)
    expect(tabs).toHaveLength(16)
  })

  test('first step is the three things, last is the definition of done', () => {
    render(<Observability />)
    const tabs = screen.getAllByRole('tab')
    expect(tabs[0].textContent).toMatch(/Three things/)
    expect(tabs[15].textContent).toMatch(/Definition of done/)
  })

  // The four drills, each on its own step, each sized by its data. This is
  // the "component ignores the data" check PATTERNS.md asks for, across the
  // whole stage rather than one panel file.
  test('every drill mounts on its step with its row count', () => {
    render(<Observability />)
    const cases: [RegExp, number][] = [
      [/Scrubber reach/, SCRUBBER.length],
      [/Log levels/, LEVELS.length],
      [/Alerts/, TRIAGE.length],
      [/nothing reports/, SILENCE.length],
    ]
    for (const [label, count] of cases) {
      go(label)
      expect(screen.getAllByRole('radiogroup'), String(label)).toHaveLength(
        count,
      )
    }
  })

  test('the AI step has the D-35 heading', () => {
    render(<Observability />)
    go(/AI plays/)
    expect(screen.getByRole('tabpanel').textContent).toMatch(
      /AI in observability/,
    )
  })
})
