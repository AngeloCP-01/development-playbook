import { describe, expect, test } from 'vitest'
import { render, screen, fireEvent, within } from '@testing-library/react'
import { PreviewOrStaging } from './PreviewOrStaging'
import { SCENARIOS, CHOICES } from './scenarios'

function escapeRegExp(text: string) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function rowFor(situation: string) {
  return screen.getByRole('radiogroup', {
    name: new RegExp(escapeRegExp(situation.slice(0, 30))),
  })
}

function pick(situation: string, choiceLabel: string) {
  const row = rowFor(situation)
  fireEvent.click(within(row).getByRole('radio', { name: choiceLabel }))
}

describe('PreviewOrStaging', () => {
  test('no score line before any pick (M2 guard)', () => {
    render(<PreviewOrStaging />)
    expect(screen.queryByText(/\d+\/\d+ right/)).toBeNull()
  })

  test('renders one radiogroup per scenario', () => {
    render(<PreviewOrStaging />)
    expect(screen.getAllByRole('radiogroup')).toHaveLength(SCENARIOS.length)
  })

  test('correct answer shows green verdict and increments score', () => {
    render(<PreviewOrStaging />)
    const s = SCENARIOS[0]
    const choice = CHOICES.find((c) => c.id === s.answer)!
    pick(s.situation, choice.label)
    expect(screen.getByText('1/1 right')).toBeTruthy()
  })

  test('wrong answer shows red verdict with the correct choice', () => {
    render(<PreviewOrStaging />)
    const s = SCENARIOS[0]
    const wrong = CHOICES.find((c) => c.id !== s.answer)!
    pick(s.situation, wrong.label)
    const correct = CHOICES.find((c) => c.id === s.answer)!
    const row = rowFor(s.situation)
    expect(
      within(row).getByText(new RegExp(escapeRegExp(correct.label))),
    ).toBeTruthy()
  })

  test('answer locks on first selection', () => {
    render(<PreviewOrStaging />)
    const s = SCENARIOS[0]
    const correct = CHOICES.find((c) => c.id === s.answer)!
    const wrong = CHOICES.find((c) => c.id !== s.answer)!
    pick(s.situation, correct.label)
    pick(s.situation, wrong.label)
    expect(screen.getByText('1/1 right')).toBeTruthy()
  })

  test('all radios disabled after commit', () => {
    render(<PreviewOrStaging />)
    const s = SCENARIOS[0]
    const choice = CHOICES.find((c) => c.id === s.answer)!
    pick(s.situation, choice.label)
    const row = rowFor(s.situation)
    for (const r of within(row).getAllByRole('radio')) {
      expect((r as HTMLButtonElement).disabled).toBe(true)
    }
  })

  test('score has aria-live polite after first pick', () => {
    render(<PreviewOrStaging />)
    const s = SCENARIOS[0]
    const choice = CHOICES.find((c) => c.id === s.answer)!
    pick(s.situation, choice.label)
    const score = screen.getByText(/\d+\/\d+ right/)
    expect(score.closest('[aria-live]')?.getAttribute('aria-live')).toBe(
      'polite',
    )
  })

  test('full score after all correct', () => {
    render(<PreviewOrStaging />)
    for (const s of SCENARIOS) {
      const choice = CHOICES.find((c) => c.id === s.answer)!
      pick(s.situation, choice.label)
    }
    expect(screen.getByText('5/5 right')).toBeTruthy()
  })
})
