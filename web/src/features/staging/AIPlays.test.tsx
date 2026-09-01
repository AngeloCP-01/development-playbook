import { describe, expect, test } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AIPlays } from './AIPlays'
import { PLAYS } from './ai-plays'

describe('AIPlays', () => {
  test('renders every play title', () => {
    render(<AIPlays />)
    for (const p of PLAYS) {
      expect(screen.getByText(new RegExp(p.title.slice(0, 25)))).toBeTruthy()
    }
  })

  test('premise key phrase reaches the page', () => {
    render(<AIPlays />)
    expect(
      screen.getByText(/Mechanical coverage is the strength/i),
    ).toBeTruthy()
  })

  test('limit key phrase reaches the page', () => {
    render(<AIPlays />)
    expect(screen.getByText(/noticing what is absent/i)).toBeTruthy()
  })
})
