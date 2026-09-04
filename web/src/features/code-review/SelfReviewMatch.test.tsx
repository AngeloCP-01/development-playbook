import { describe, expect, test } from 'vitest'
import { render, screen, fireEvent, within } from '@testing-library/react'
import { SelfReviewMatch } from './SelfReviewMatch'
import { TECHNIQUES, BIASES } from './self-review'

function rowFor(technique: string) {
  return screen.getByRole('radiogroup', {
    name: new RegExp(technique.slice(0, 30)),
  })
}

function pick(technique: string, biasLabel: string) {
  const row = rowFor(technique)
  fireEvent.click(within(row).getByRole('radio', { name: biasLabel }))
}

describe('SelfReviewMatch', () => {
  test('renders one radiogroup per technique', () => {
    render(<SelfReviewMatch />)
    expect(screen.getAllByRole('radiogroup')).toHaveLength(TECHNIQUES.length)
  })

  test('correct answer shows green verdict and increments score', () => {
    render(<SelfReviewMatch />)
    const t = TECHNIQUES[0]
    const bias = BIASES.find((b) => b.id === t.bias)!
    pick(t.title, bias.label)
    // Score uses a literal
    expect(screen.getByText('1/1 right')).toBeTruthy()
  })

  test('wrong answer shows red verdict', () => {
    render(<SelfReviewMatch />)
    const t = TECHNIQUES[0]
    const wrongBias = BIASES.find((b) => b.id !== t.bias)!
    pick(t.title, wrongBias.label)
    const row = rowFor(t.title)
    // Verdict contains the correct answer
    const correctBias = BIASES.find((b) => b.id === t.bias)!
    expect(within(row).getByText(new RegExp(correctBias.label))).toBeTruthy()
  })

  test('answer locks on first selection — second click does not change it', () => {
    render(<SelfReviewMatch />)
    const t = TECHNIQUES[0]
    const correctBias = BIASES.find((b) => b.id === t.bias)!
    const wrongBias = BIASES.find((b) => b.id !== t.bias)!
    pick(t.title, correctBias.label)
    // Try picking wrong after correct
    pick(t.title, wrongBias.label)
    // Score should still be 1/1
    expect(screen.getByText('1/1 right')).toBeTruthy()
  })

  test('all radios in a committed row are disabled', () => {
    render(<SelfReviewMatch />)
    const t = TECHNIQUES[0]
    const bias = BIASES.find((b) => b.id === t.bias)!
    pick(t.title, bias.label)
    const row = rowFor(t.title)
    const radios = within(row).getAllByRole('radio')
    for (const r of radios) {
      expect((r as HTMLButtonElement).disabled).toBe(true)
    }
  })

  test('score element has aria-live polite', () => {
    render(<SelfReviewMatch />)
    const score = screen.getByText(/\d+\/\d+ right/)
    expect(score.closest('[aria-live]')?.getAttribute('aria-live')).toBe(
      'polite',
    )
  })

  test('explanation is hidden before selection', () => {
    render(<SelfReviewMatch />)
    const t = TECHNIQUES[0]
    const row = rowFor(t.title)
    expect(
      within(row).queryByText(new RegExp(t.explanation.slice(0, 40))),
    ).toBeNull()
  })

  test('full score after all correct answers', () => {
    render(<SelfReviewMatch />)
    for (const t of TECHNIQUES) {
      const bias = BIASES.find((b) => b.id === t.bias)!
      pick(t.title, bias.label)
    }
    expect(screen.getByText('3/3 right')).toBeTruthy()
  })
})
