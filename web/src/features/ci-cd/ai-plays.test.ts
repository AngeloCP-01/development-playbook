import { describe, expect, test } from 'vitest'
import { AI_PREMISE, AI_LIMIT, PLAYS } from './ai-plays'
import { flat, section } from './doc-source'

describe('ci-cd AI plays data', () => {
  const src = section('AI in CI/CD')

  test('premise pins against doc', () => {
    expect(flat(src)).toContain(flat('working first draft of a workflow file'))
  })

  test('limit pins against doc — trigger conditions', () => {
    expect(flat(src)).toContain(flat('Trigger conditions'))
  })

  test('eight plays', () => {
    expect(PLAYS).toHaveLength(8)
  })

  test('unique IDs', () => {
    const ids = PLAYS.map((p) => p.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  test('all kinds are valid', () => {
    const valid = new Set(['command', 'prompt', 'cli', 'tool'])
    for (const p of PLAYS) {
      expect(valid.has(p.kind), `${p.id} kind "${p.kind}"`).toBe(true)
    }
  })

  test('every play has sufficient text', () => {
    for (const p of PLAYS) {
      expect(p.title.length, `${p.id} title`).toBeGreaterThan(5)
      expect(p.body.length, `${p.id} body`).toBeGreaterThan(15)
    }
  })

  test('premise and limit are non-trivial', () => {
    expect(AI_PREMISE.length).toBeGreaterThan(20)
    expect(AI_LIMIT.length).toBeGreaterThan(20)
  })

  test('at least one tool play with a command', () => {
    // The iron law from stage-implementation-101: at least one "run this command" play
    expect(PLAYS.some((p) => p.kind === 'command' || p.kind === 'cli')).toBe(
      true,
    )
  })

  test('has claude-code-ci play', () => {
    expect(PLAYS.some((p) => p.id === 'claude-code-ci')).toBe(true)
  })

  test('has copilot-review play', () => {
    expect(PLAYS.some((p) => p.id === 'copilot-review')).toBe(true)
  })

  test('has build-diagnosis play', () => {
    expect(PLAYS.some((p) => p.id === 'build-diagnosis')).toBe(true)
  })

  test('doc pin: Copilot code review', () => {
    expect(flat(src)).toContain(flat('Copilot code review'))
  })

  test('doc pin: claude-code-action', () => {
    expect(flat(src)).toContain(flat('claude-code-action'))
  })

  test('doc pin: Build failure diagnosis', () => {
    expect(flat(src)).toContain(flat('Build failure diagnosis'))
  })

  test('doc pin: Test gap analysis', () => {
    expect(flat(src)).toContain(flat('Test gap analysis'))
  })
})
