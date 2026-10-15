import { fireEvent, render, screen, within } from '@testing-library/react'
import { expect, test } from 'vitest'
import { OrderJourney } from './OrderJourney'
import { OUTCOMES } from './journey'

test('each selected clock renders its real observer and boundaries, since a fast route cannot prove a fast user outcome', () => {
  render(<OrderJourney />)
  expect(screen.getByText('Hypothetical exercise')).toBeTruthy()
  for (const outcome of OUTCOMES) {
    fireEvent.click(screen.getByRole('button', { name: outcome.label }))
    const detail = screen.getByRole('region', { name: 'Selected measurement' })
    expect(detail.textContent).toContain(outcome.observer)
    expect(detail.textContent).toContain(outcome.start)
    expect(detail.textContent).toContain(outcome.stop)
    expect(detail.textContent).toContain(outcome.limits)
  }
})

test('OrderPaid has three independent consumer branches and never promises notification delivery', () => {
  render(<OrderJourney />)
  const branches = screen.getByRole('list', {
    name: 'Independent OrderPaid consumers',
  })
  expect(within(branches).getAllByRole('listitem')).toHaveLength(3)
  expect(branches.textContent).toMatch(
    /Inventory[\s\S]*Logistics[\s\S]*Notification/,
  )
  fireEvent.click(screen.getByRole('button', { name: 'Notification consumer' }))
  expect(
    screen.getByRole('region', { name: 'Selected measurement' }).textContent,
  ).toMatch(/not prove.*received or saw/i)
})

test('the detail follows changed input data rather than an outcome-id lookup hidden in the component', () => {
  const custom = {
    ...OUTCOMES[0],
    observer: 'Test browser observer',
    stop: 'Test visible stop',
  }
  render(<OrderJourney outcomes={[custom]} />)
  const detail = screen.getByRole('region', { name: 'Selected measurement' })
  expect(detail.textContent).toContain('Test browser observer')
  expect(detail.textContent).toContain('Test visible stop')
})
