import { describe, expect, test } from 'vitest'
import { render, screen, fireEvent, within } from '@testing-library/react'
import { ReviewDrill } from './ReviewDrill'
import { SNIPPETS, CATEGORIES } from './review-drill'

function rowFor(snippet: string) {
  return screen.getByRole('radiogroup', {
    name: new RegExp(snippet.slice(0, 30)),
  })
}

function pick(snippetLabel: string, categoryLabel: string) {
  const row = rowFor(snippetLabel)
  fireEvent.click(within(row).getByRole('radio', { name: categoryLabel }))
}

// Snippet code contains regex metacharacters (unbalanced parens, brackets)
// that make `new RegExp(rawSnippetText)` throw. Escape before building a
// pattern out of arbitrary source text.
function escapeRegExp(text: string) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

describe('ReviewDrill', () => {
  test('renders one radiogroup per snippet', () => {
    render(<ReviewDrill />)
    expect(screen.getAllByRole('radiogroup')).toHaveLength(SNIPPETS.length)
  })

  test('correct answer shows green verdict and increments score', () => {
    render(<ReviewDrill />)
    const s = SNIPPETS[0]
    const cat = CATEGORIES.find((c) => c.id === s.answer)!
    pick(s.label, cat.label)
    expect(screen.getByText('1/1 right')).toBeTruthy()
  })

  test('wrong answer shows red verdict with the correct category', () => {
    render(<ReviewDrill />)
    const s = SNIPPETS[0]
    const wrong = CATEGORIES.find((c) => c.id !== s.answer)!
    pick(s.label, wrong.label)
    const correct = CATEGORIES.find((c) => c.id === s.answer)!
    const row = rowFor(s.label)
    expect(within(row).getByText(new RegExp(correct.label))).toBeTruthy()
  })

  test('answer locks — second click does not change result', () => {
    render(<ReviewDrill />)
    const s = SNIPPETS[0]
    const correct = CATEGORIES.find((c) => c.id === s.answer)!
    const wrong = CATEGORIES.find((c) => c.id !== s.answer)!
    pick(s.label, correct.label)
    pick(s.label, wrong.label)
    expect(screen.getByText('1/1 right')).toBeTruthy()
  })

  test('all radios disabled after commit', () => {
    render(<ReviewDrill />)
    const s = SNIPPETS[0]
    const cat = CATEGORIES.find((c) => c.id === s.answer)!
    pick(s.label, cat.label)
    const row = rowFor(s.label)
    const radios = within(row).getAllByRole('radio')
    for (const r of radios) {
      expect((r as HTMLButtonElement).disabled).toBe(true)
    }
  })

  test('score has aria-live polite', () => {
    render(<ReviewDrill />)
    const s = SNIPPETS[0]
    const cat = CATEGORIES.find((c) => c.id === s.answer)!
    pick(s.label, cat.label)
    const score = screen.getByText(/\d+\/\d+ right/)
    expect(score.closest('[aria-live]')?.getAttribute('aria-live')).toBe(
      'polite',
    )
  })

  test('explanation hidden before selection', () => {
    render(<ReviewDrill />)
    const s = SNIPPETS[0]
    const row = rowFor(s.label)
    expect(
      within(row).queryByText(new RegExp(s.explanation.slice(0, 40))),
    ).toBeNull()
  })

  test('code block rendered for each snippet', () => {
    render(<ReviewDrill />)
    for (const s of SNIPPETS) {
      expect(
        screen.getByText(
          new RegExp(escapeRegExp(s.code.split('\n')[0].slice(0, 30))),
        ),
      ).toBeTruthy()
    }
  })

  test('full score after all correct answers', () => {
    render(<ReviewDrill />)
    for (const s of SNIPPETS) {
      const cat = CATEGORIES.find((c) => c.id === s.answer)!
      pick(s.label, cat.label)
    }
    expect(screen.getByText('6/6 right')).toBeTruthy()
  })
})
