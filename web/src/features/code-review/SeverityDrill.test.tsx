import { describe, expect, test } from 'vitest'
import { render, screen, fireEvent, within } from '@testing-library/react'
import { SeverityDrill } from './SeverityDrill'
import { COMMENTS, SEVERITIES } from './severity-drill'

// Comment text can contain regex metacharacters (backticks are safe, but a
// period or parenthesis in the first 30 chars is not guaranteed absent).
// Escape before building a pattern out of arbitrary source text.
function escapeRegExp(text: string) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function rowFor(comment: string) {
  return screen.getByRole('radiogroup', {
    name: new RegExp(escapeRegExp(comment.slice(0, 30))),
  })
}

function pick(commentText: string, severityLabel: string) {
  const row = rowFor(commentText)
  fireEvent.click(within(row).getByRole('radio', { name: severityLabel }))
}

describe('SeverityDrill', () => {
  test('renders one radiogroup per comment', () => {
    render(<SeverityDrill />)
    expect(screen.getAllByRole('radiogroup')).toHaveLength(COMMENTS.length)
  })

  test('correct answer shows green verdict and increments score', () => {
    render(<SeverityDrill />)
    const c = COMMENTS[0]
    const sev = SEVERITIES.find((s) => s.id === c.severity)!
    pick(c.comment, sev.label)
    expect(screen.getByText('1/1 right')).toBeTruthy()
  })

  test('wrong answer shows red verdict with the correct severity', () => {
    render(<SeverityDrill />)
    const c = COMMENTS[0]
    const wrong = SEVERITIES.find((s) => s.id !== c.severity)!
    pick(c.comment, wrong.label)
    const correct = SEVERITIES.find((s) => s.id === c.severity)!
    const row = rowFor(c.comment)
    expect(
      within(row).getByText(new RegExp(escapeRegExp(correct.label))),
    ).toBeTruthy()
  })

  test('answer locks on first selection', () => {
    render(<SeverityDrill />)
    const c = COMMENTS[0]
    const correct = SEVERITIES.find((s) => s.id === c.severity)!
    const wrong = SEVERITIES.find((s) => s.id !== c.severity)!
    pick(c.comment, correct.label)
    pick(c.comment, wrong.label)
    expect(screen.getByText('1/1 right')).toBeTruthy()
  })

  test('all radios disabled after commit', () => {
    render(<SeverityDrill />)
    const c = COMMENTS[0]
    const sev = SEVERITIES.find((s) => s.id === c.severity)!
    pick(c.comment, sev.label)
    const row = rowFor(c.comment)
    for (const r of within(row).getAllByRole('radio')) {
      expect((r as HTMLButtonElement).disabled).toBe(true)
    }
  })

  test('score has aria-live polite', () => {
    render(<SeverityDrill />)
    const c = COMMENTS[0]
    const sev = SEVERITIES.find((s) => s.id === c.severity)!
    pick(c.comment, sev.label)
    const score = screen.getByText(/\d+\/\d+ right/)
    expect(score.closest('[aria-live]')?.getAttribute('aria-live')).toBe(
      'polite',
    )
  })

  test('full score after all correct', () => {
    render(<SeverityDrill />)
    for (const c of COMMENTS) {
      const sev = SEVERITIES.find((s) => s.id === c.severity)!
      pick(c.comment, sev.label)
    }
    expect(screen.getByText('5/5 right')).toBeTruthy()
  })
})
