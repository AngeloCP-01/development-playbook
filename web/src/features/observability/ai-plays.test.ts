import { describe, expect, test } from 'vitest'
import { AI_PREMISE, AI_LIMIT, PLAYS } from './ai-plays'
import { flat, section } from './doc-source'

describe('observability AI plays data', () => {
  const src = flat(section('AI in observability')).replace(/\*/g, '')

  test('premise pins against doc', () => {
    expect(src).toContain(flat('pattern-matching over text you already have'))
    expect(flat(AI_PREMISE)).toContain(
      'pattern-matching over text you already have',
    )
  })

  test('limit pins against doc', () => {
    expect(src).toContain(flat('tell you what you failed to instrument'))
    expect(flat(AI_LIMIT)).toContain('tell you what you failed to instrument')
  })

  test('six plays, matching the six bold leads', () => {
    const leads = section('AI in observability').match(/^- \*\*.+?\*\*/gm) ?? []
    expect(leads).toHaveLength(6)
    expect(PLAYS).toHaveLength(6)
  })

  test('unique IDs', () => {
    const ids = PLAYS.map((p) => p.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  test('every title is a bold lead', () => {
    const leads = (
      section('AI in observability').match(/^- \*\*(.+?)\*\*/gm) ?? []
    ).map((b) => flat(b.replace(/^- /, '').replace(/\*\*/g, '')))
    for (const p of PLAYS) {
      expect(
        leads.some((l) => l.includes(flat(p.title))),
        p.id,
      ).toBe(true)
    }
  })

  test('all kinds are valid', () => {
    const valid = new Set(['mcp', 'command', 'prompt', 'cli', 'cli-mcp'])
    for (const p of PLAYS) expect(valid.has(p.kind), `${p.id} kind`).toBe(true)
  })

  // The doc labels one play "(A CLI + MCP command.)" and the other five
  // "(A prompt.)".
  test('the query-logs play is cli-mcp and the rest are prompts', () => {
    const query = PLAYS.find((p) => p.id === 'query-logs')
    expect(query?.kind).toBe('cli-mcp')
    expect(PLAYS.filter((p) => p.kind === 'prompt')).toHaveLength(5)
  })

  test('every play body is a phrase from the doc', () => {
    for (const p of PLAYS) {
      expect(src, `${p.id} body`).toContain(flat(p.body).slice(0, 60))
    }
  })
})
