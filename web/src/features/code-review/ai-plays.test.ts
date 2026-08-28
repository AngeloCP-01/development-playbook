import { describe, expect, test } from 'vitest'
import { AI_LIMIT, AI_PREMISE, PLAYS } from './ai-plays'
import { flat, section } from './doc-source'

describe('AI plays data', () => {
  const src = section('AI in code review')

  test('premise pins against doc', () => {
    expect(flat(src)).toContain(
      flat(
        'They do not get tired, and they do not assume they already know what the code does',
      ),
    )
  })

  test('limit pins against doc', () => {
    expect(flat(src)).toContain(
      flat(
        'Agent-authored PRs get reviewed less often, merged faster, and discussed less',
      ),
    )
  })

  test('five plays', () => {
    expect(PLAYS).toHaveLength(5)
  })

  test('unique play IDs', () => {
    const ids = PLAYS.map((p) => p.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  test('all kinds are valid', () => {
    const validKinds = new Set(['skill', 'command', 'mcp', 'memory'])
    for (const p of PLAYS) {
      expect(validKinds.has(p.kind), `${p.id}: ${p.kind}`).toBe(true)
    }
  })

  test('AI_PREMISE is non-empty', () => {
    expect(AI_PREMISE.length).toBeGreaterThan(20)
  })

  test('AI_LIMIT is non-empty', () => {
    expect(AI_LIMIT.length).toBeGreaterThan(20)
  })
})
