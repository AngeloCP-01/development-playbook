import { describe, expect, test } from 'vitest'
import { AI_PREMISE, AI_LIMIT, PLAYS } from './ai-plays'
import { flat, section } from './doc-source'

describe('staging AI plays data', () => {
  const src = section('AI in staging')

  test('premise pins against doc', () => {
    expect(flat(src)).toContain(flat('Mechanical coverage is the strength'))
  })

  test('limit pins against doc', () => {
    expect(flat(src)).toContain(
      flat(
        'noticing what is absent, which is the one thing a mechanical pass cannot do',
      ),
    )
  })

  test('four plays', () => {
    expect(PLAYS).toHaveLength(4)
  })

  test('unique IDs', () => {
    const ids = PLAYS.map((p) => p.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  test('all kinds are valid', () => {
    const valid = new Set(['mcp', 'command', 'prompt', 'cli'])
    for (const p of PLAYS) {
      expect(valid.has(p.kind), `${p.id} kind "${p.kind}"`).toBe(true)
    }
  })

  test('every play has sufficient text', () => {
    for (const p of PLAYS) {
      expect(p.title.length, `${p.id} title`).toBeGreaterThan(10)
      expect(p.body.length, `${p.id} body`).toBeGreaterThan(20)
    }
  })

  test('premise and limit are non-trivial', () => {
    expect(AI_PREMISE.length).toBeGreaterThan(20)
    expect(AI_LIMIT.length).toBeGreaterThan(20)
  })
})
