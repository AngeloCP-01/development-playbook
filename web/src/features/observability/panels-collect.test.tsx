// web/src/features/observability/panels-collect.test.tsx
import { describe, expect, test } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { Stepper } from '@/components/Stepper'
import { COLLECT_STEPS } from './panels-collect'
import { ROWS as SCRUBBER_ROWS } from './scrubber'
import { ROWS as LEVEL_ROWS } from './log-levels'
import { SIGNALS } from './signals'

const go = (label: RegExp) =>
  fireEvent.click(screen.getByRole('tab', { name: label }))

describe('collect panels', () => {
  test('seven steps, in order', () => {
    render(<Stepper steps={COLLECT_STEPS} />)
    expect(COLLECT_STEPS.map((s) => s.id)).toEqual([
      'three',
      'errors',
      'scrubbing',
      'logs',
      'fields',
      'where',
      'signals',
    ])
    expect(screen.getAllByRole('tab')).toHaveLength(7)
  })

  test('three: the traces row says you will know when you need them', () => {
    render(<Stepper steps={COLLECT_STEPS} />)
    const panel = screen.getByRole('tabpanel')
    expect(panel.textContent).toMatch(
      /Monitoring checks the failures you anticipated/,
    )
    fireEvent.click(screen.getByRole('button', { name: /Traces/ }))
    expect(panel.textContent).toMatch(/You will know when you need them/)
  })

  test('errors: context is what turns an exception into a fix', () => {
    render(<Stepper steps={COLLECT_STEPS} />)
    go(/Errors that are useful/)
    const panel = screen.getByRole('tabpanel')
    expect(panel.textContent).toMatch(
      /Context is what turns an exception into a fix/,
    )
    expect(panel.textContent).toMatch(/Add breadcrumbs for meaningful actions/)
  })

  test('scrubbing: the scrubber artifact and the scrubber drill both mount', () => {
    render(<Stepper steps={COLLECT_STEPS} />)
    go(/Scrubbing/)
    const panel = screen.getByRole('tabpanel')
    expect(panel.textContent).toMatch(/sentry\.server\.config\.ts/)
    expect(screen.getAllByRole('radiogroup')).toHaveLength(SCRUBBER_ROWS.length)
    expect(panel.textContent).toMatch(/One loop can spend everything/)
  })

  test('logs: the logger artifact, the ladder and the level drill mount', () => {
    render(<Stepper steps={COLLECT_STEPS} />)
    go(/Structured logs/)
    const panel = screen.getByRole('tabpanel')
    expect(panel.textContent).toMatch(/src\/lib\/logger\.ts/)
    expect(screen.getAllByRole('radiogroup')).toHaveLength(LEVEL_ROWS.length)
    // Five options per row — the only drill that is not binary.
    const radios = screen.getAllByRole('radio')
    expect(radios).toHaveLength(LEVEL_ROWS.length * 5)
    expect(panel.textContent).toMatch(/Levels are a filter, not a mood/)
  })

  test('fields: request id, naming, and cardinality rows all render', () => {
    render(<Stepper steps={COLLECT_STEPS} />)
    go(/What goes on the line/)
    const panel = screen.getByRole('tabpanel')
    expect(panel.textContent).toMatch(/A request id on every line/)
    expect(panel.textContent).toMatch(
      /Name events noun\.verb_past_tense, consistently/,
    )
    expect(panel.textContent).toMatch(
      /Identifiers in logs, never as metric labels/,
    )
  })

  test('where: both platforms and the stream-not-storage claim', () => {
    render(<Stepper steps={COLLECT_STEPS} />)
    go(/Where logs go/)
    const panel = screen.getByRole('tabpanel')
    expect(panel.textContent).toMatch(/stream, not storage/)
    expect(screen.getByRole('button', { name: /Vercel/ })).toBeTruthy()
    expect(screen.getByRole('button', { name: /AWS/ })).toBeTruthy()
  })

  test('signals: four rows from the data, and the error-rate warning', () => {
    render(<Stepper steps={COLLECT_STEPS} />)
    go(/four signals/)
    for (const s of SIGNALS) {
      // Assert on the row's own `source` text, not the button name: the
      // "Reading the numbers" prose further down this same panel also
      // renders an inline <Term id="saturation"> button whose accessible
      // name starts with "Saturation", so a name-based query on "button"
      // stays green even if the Saturation row itself is removed from
      // SIGNALS — `source` is unique, row-specific prose that only the
      // RevealList row renders.
      expect(screen.getByText(s.source)).toBeTruthy()
    }
    const panel = screen.getByRole('tabpanel')
    expect(panel.textContent).toMatch(/does not come from your error tracker/)
    expect(panel.textContent).toMatch(/Write the numbers down/)
  })
})
