import { expect, test } from 'vitest'
import { flat, section } from './doc-source'
import { AI_LIMIT, PLAYS } from './ai-plays'

const AI = section('AI in project setup')

/**
 * Top-level bold bullets only. Every play in the section opens `- **Title**`
 * at column zero; the continuation lines of a play are indented two spaces, so
 * the `^` anchor is what keeps a wrapped line out of the count.
 */
const DOC_PLAYS = AI.match(/^- \*\*.+?\*\*/gm) ?? []

// A count regex that matches nothing passes against an empty array, so assert
// the regex found something before asserting the number it found.
test('the doc-counting regex actually matches the section bullets, not nothing', () => {
  expect(DOC_PLAYS.length).toBeGreaterThan(0)
  expect(DOC_PLAYS[0]).toContain(
    'Generate the config, then make it prove itself',
  )
})

test('the app renders exactly the plays the doc lists', () => {
  expect(PLAYS).toHaveLength(DOC_PLAYS.length)
})

test('each play keeps the doc title it was extracted from, so the count cannot be met by padding', () => {
  const titles = DOC_PLAYS.map((b) =>
    b.replace(/^- \*\*/, '').replace(/\*\*$/, ''),
  )
  expect(PLAYS.map((p) => p.title)).toEqual(titles)
})

// The doc names the mechanism in parentheses after each title — "(a skill)",
// "(a saved command)", "(memory)", "(an MCP)". `AIPlays` renders it as the row
// badge, so a play carrying the wrong one mislabels itself on the page.
//
// This test used to assert `new Set(['skill','command','memory','mcp'])` had
// each `play.kind` — the same four literals as the `Play['kind']` union, which
// TypeScript already guarantees. A review flipped a play from `skill` to `mcp`
// and it stayed green. It read its own type and called it reading the doc.
const PARENTHETICAL: Record<string, string> = {
  'a skill': 'skill',
  'a saved command': 'command',
  memory: 'memory',
  'an MCP': 'mcp',
}

test('every play carries the mechanism the doc puts in its parentheses, not merely a legal one', () => {
  const bullets = AI.match(/^- \*\*.+?\*\* \((.+?)\)/gm)
  expect(bullets, 'no parenthesised bullets found in the doc').not.toBeNull()
  expect(bullets).toHaveLength(PLAYS.length)

  const fromDoc = bullets!.map((b) => {
    const inner = b.match(/\((.+?)\)$/)![1]
    const kind = PARENTHETICAL[inner]
    expect(kind, `doc says "(${inner})", which maps to no kind`).toBeDefined()
    return kind
  })

  expect(PLAYS.map((p) => p.kind)).toEqual(fromDoc)
})

test('ids are unique, because the reveal list keys on them', () => {
  const ids = PLAYS.map((p) => p.id)
  expect(new Set(ids).size).toBe(ids.length)
})

test('every play has a body worth revealing rather than a restated headline', () => {
  for (const play of PLAYS) {
    expect(play.body.trim().length, play.id).toBeGreaterThan(60)
    expect(play.body.trim()).not.toBe(play.title.trim())
  }
})

// The section's closing point, and the reason this stage's AI panel is not a
// list of wins: all three of these blocked this playbook's own first deploy.
test('the limit names the three dashboard settings no agent reads', () => {
  expect(AI_LIMIT).toContain('Root Directory')
  expect(AI_LIMIT).toContain('Framework Preset')
  expect(AI_LIMIT).toContain('connected repository')
})

test('the limit keeps the reason it bites: every local check stayed green', () => {
  expect(AI_LIMIT).toContain('every local check stayed green')
})

test('the doc is still where that limit comes from', () => {
  expect(flat(AI)).toContain(
    'Root Directory, Framework Preset and the connected repository live in a web UI no agent reads',
  )
})
