import { describe, expect, test } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AIPlays } from './AIPlays'
import { PLAYS } from './ai-plays'

describe('AIPlays', () => {
  test('renders every play title', () => {
    render(<AIPlays />)
    for (const p of PLAYS) {
      expect(screen.getByText(p.title)).toBeTruthy()
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
