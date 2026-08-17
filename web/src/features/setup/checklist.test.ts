import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { expect, test } from 'vitest'
import { DONE, TEAM_MOVES } from './checklist'

const DOC = readFileSync(
  fileURLToPath(
    new URL('../../../../docs/04-project-setup.md', import.meta.url),
  ),
  'utf8',
)

/**
 * The body of one `## ` section, up to the next `## `.
 *
 * Anchored to the line rather than `DOC.indexOf('## …')`: §5 mentions
 * "the first Definition of done" in running prose, and an unanchored slice on a
 * doc that also names its own headings is one edit away from starting in the
 * wrong place. `## Traps` already has that problem in this same file.
 */
function h2(heading: string): string {
  const match = new RegExp(`^## ${heading}$`, 'm').exec(DOC)
  if (!match) throw new Error(`no section "## ${heading}" in the doc`)
  const rest = DOC.slice(match.index + match[0].length)
  const end = rest.search(/^## /m)
  return end === -1 ? rest : rest.slice(0, end)
}

const DONE_SECTION = h2('Definition of done')
const TEAM_SECTION = h2('Scaling to a team')

/**
 * Unchecked boxes at column zero. Continuation lines of a wrapped item are
 * indented six spaces, so the `^` anchor keeps them out — and `## Entry
 * criteria` has four boxes of its own that the bounded slice excludes.
 */
const DOC_BOXES = DONE_SECTION.match(/^- \[ \] /gm) ?? []
const DOC_MOVES = TEAM_SECTION.match(/^- \*\*.+?\*\*/gm) ?? []

// Both regexes get proved before their counts are trusted: a pattern that
// matches nothing passes a length comparison against an empty array.
test('the done-box regex matches the checklist and stops at the section boundary', () => {
  expect(DOC_BOXES.length).toBeGreaterThan(0)
  expect(DONE_SECTION).toContain('A fresh clone reaches a running app')
  expect(DONE_SECTION).not.toContain('You have accounts for: GitHub')
})

test('every Definition of done checkbox in the doc has an item in the app', () => {
  expect(DONE).toHaveLength(DOC_BOXES.length)
})

test('the team-move regex matches the four bold leads rather than the paragraphs under them', () => {
  expect(DOC_MOVES.length).toBeGreaterThan(0)
  expect(DOC_MOVES[0]).toBe('- **Enforce review.**')
})

test('every Scaling to a team move in the doc has an entry in the app', () => {
  expect(TEAM_MOVES).toHaveLength(DOC_MOVES.length)
})

test('each team move keeps the doc title it was extracted from, so the count cannot be met by padding', () => {
  const titles = DOC_MOVES.map((m) =>
    m.replace(/^- \*\*/, '').replace(/\*\*$/, ''),
  )
  expect(TEAM_MOVES.map((m) => m.title)).toEqual(titles)
})

test('ids are unique within each list, because the worksheet persists progress against them', () => {
  const doneIds = DONE.map((d) => d.id)
  const moveIds = TEAM_MOVES.map((m) => m.id)
  expect(new Set(doneIds).size).toBe(doneIds.length)
  expect(new Set(moveIds).size).toBe(moveIds.length)
})

// The persisted worksheet keys on id. A renamed id silently resets a reader's
// progress, so the ids are content, not implementation detail.
test('the done ids are stable slugs rather than positions, since a reordered list must not reset progress', () => {
  for (const item of DONE) {
    expect(item.id, item.label).toMatch(/^[a-z][a-z0-9-]*$/)
    expect(item.label.trim().length, item.id).toBeGreaterThan(20)
  }
})

test('every team move explains itself rather than restating its title', () => {
  for (const move of TEAM_MOVES) {
    expect(move.body.trim().length, move.id).toBeGreaterThan(40)
    expect(move.body.trim()).not.toBe(move.title.trim())
  }
})
