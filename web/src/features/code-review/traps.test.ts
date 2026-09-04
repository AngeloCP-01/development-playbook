import { describe, expect, test } from 'vitest'
import { TRAPS } from './traps'
import { flat, h2 } from './doc-source'

describe('traps data', () => {
  const src = h2('Traps')

  test('eight traps', () => {
    const boldLeads = src.split('\n').filter((l) => /^\*\*.+\*\*/.test(l))
    expect(boldLeads).toHaveLength(8)
    expect(TRAPS).toHaveLength(8)
  })

  test('unique IDs', () => {
    const ids = TRAPS.map((t) => t.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  test('titles match bold leads in doc', () => {
    const boldLeads = src
      .split('\n')
      .filter((l) => /^\*\*.+\*\*/.test(l))
      .map((l) => l.match(/^\*\*(.+?)\*\*/)?.[1] ?? '')
    for (let i = 0; i < TRAPS.length; i++) {
      expect(TRAPS[i].title, `trap ${i}`).toBe(boldLeads[i])
    }
  })

  test('reviewing immediately trap pins body against doc', () => {
    expect(flat(src)).toContain(
      flat('You will read your intent, not your code'),
    )
  })

  test('reviewing in editor trap pins against doc', () => {
    expect(flat(src)).toContain(flat('Same context that produced the bugs'))
  })

  test('performative agreement trap pins against doc', () => {
    expect(flat(src)).toContain(
      flat('confident-sounding wrong advice enters a codebase'),
    )
  })
})
