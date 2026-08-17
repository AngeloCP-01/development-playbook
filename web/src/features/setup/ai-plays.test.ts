import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { expect, test } from 'vitest'
import { AI_LIMIT, PLAYS } from './ai-plays'

const DOC = readFileSync(
  fileURLToPath(
    new URL('../../../../docs/04-project-setup.md', import.meta.url),
  ),
  'utf8',
)

/** The body of one `### ` section, up to the next heading of any level. */
function section(heading: string): string {
  const start = DOC.indexOf(`### ${heading}`)
  if (start === -1) throw new Error(`no section "${heading}" in the doc`)
  const rest = DOC.slice(start + heading.length + 4)
  const end = rest.search(/^#{2,3} /m)
  return end === -1 ? rest : rest.slice(0, end)
}

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
// "(a saved command)", "(memory)", "(an MCP)". The kind is not decoration:
// AIPlays groups by it.
test('every play declares the mechanism the doc puts in its parentheses', () => {
  const kinds = new Set(['skill', 'command', 'memory', 'mcp'])
  for (const play of PLAYS) {
    expect(kinds.has(play.kind), `${play.id} kind=${play.kind}`).toBe(true)
  }
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
  expect(AI).toContain(
    'Root Directory, Framework Preset and the\nconnected repository live in a web UI no agent reads',
  )
})
