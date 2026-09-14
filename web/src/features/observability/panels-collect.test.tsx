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
  test('five steps, in order', () => {
    render(<Stepper steps={COLLECT_STEPS} />)
    expect(COLLECT_STEPS.map((s) => s.id)).toEqual([
      'three',
      'errors',
      'logs',
      'where',
      'signals',
    ])
    expect(screen.getAllByRole('tab')).toHaveLength(5)
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

  test('errors: the scrubber artifact and the scrubber drill both mount', () => {
    render(<Stepper steps={COLLECT_STEPS} />)
    go(/Errors/)
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
      // getAllByRole, not getByRole: "Saturation" also names the inline
      // <Term id="saturation"> button in the "Reading the numbers" prose
      // below, so a single-match query throws on that one signal.
      expect(
        screen.getAllByRole('button', { name: new RegExp(`^${s.name}`) })
          .length,
      ).toBeGreaterThan(0)
    }
    const panel = screen.getByRole('tabpanel')
    expect(panel.textContent).toMatch(/does not come from your error tracker/)
    expect(panel.textContent).toMatch(/Write the numbers down/)
  })
})
