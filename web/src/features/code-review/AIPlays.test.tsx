import { describe, expect, test } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AIPlays } from './AIPlays'
import { PLAYS } from './ai-plays'

describe('AIPlays', () => {
  test('renders every play title', () => {
    render(<AIPlays />)
    for (const p of PLAYS) {
      // Titles with backticks are split across <code> nodes by InlineCode,
      // so match a non-backtick fragment rather than the full string.
      const fragment = p.title
        .replace(/`[^`]+`/g, '')
        .trim()
        .slice(0, 20)
      expect(
        screen.getByText(
          new RegExp(fragment.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')),
        ),
      ).toBeTruthy()
    }
  })

  test('premise key phrase reaches the page', () => {
    render(<AIPlays />)
    expect(screen.getByText(/They do not get tired/i)).toBeTruthy()
  })

  test('limit key phrase reaches the page', () => {
    render(<AIPlays />)
    expect(screen.getByText(/treating AI review as the review/i)).toBeTruthy()
  })
})
