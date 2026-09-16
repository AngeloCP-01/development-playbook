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

  test('the premise and limit reach the page', () => {
    render(<AIPlays />)
    expect(screen.getByText(/pattern-matching over text/)).toBeTruthy()
    expect(screen.getByText(/failed to instrument/)).toBeTruthy()
  })

  test('the CLI + MCP play carries the combined badge', () => {
    render(<AIPlays />)
    expect(screen.getByText('CLI + browser tool')).toBeTruthy()
    expect(screen.getAllByText('Prompt')).toHaveLength(5)
  })
})
