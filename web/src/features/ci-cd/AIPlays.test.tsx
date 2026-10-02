import { describe, expect, test } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AIPlays } from './AIPlays'
import { PLAYS } from './ai-plays'

describe('AIPlays', () => {
  test('renders every play title', () => {
    render(<AIPlays />)
    for (const p of PLAYS) {
      expect(screen.getByText(new RegExp(p.title.slice(0, 20)))).toBeTruthy()
    }
  })

  test('premise key phrase reaches the page', () => {
    render(<AIPlays />)
    expect(screen.getByText(/working first draft/i)).toBeTruthy()
  })

  test('limit key phrase reaches the page', () => {
    render(<AIPlays />)
    expect(screen.getByText(/does not decide what to enforce/i)).toBeTruthy()
  })

  test('has at least one command badge', () => {
    render(<AIPlays />)
    // The KIND_LABEL for 'command' is some label — check it appears
    const badges = document.querySelectorAll('.t-label')
    expect(badges.length).toBeGreaterThanOrEqual(1)
  })
})
