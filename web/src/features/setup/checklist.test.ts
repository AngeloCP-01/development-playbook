import { expect, test } from 'vitest'
import { flat, h2 } from './doc-source'
import { DONE, TEAM_MOVES } from './checklist'

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

// The count alone let a paraphrase through, and `checklist.ts` says in its own
// header that these are the doc's checkboxes verbatim because "a paraphrase
// there is a different bar" — a checklist the reader ticks against their real
// project is the one place a softened wording changes what they accept as done.
// A review paraphrased a label and all eight tests stayed green.
test('each label is the doc’s checkbox verbatim, since a softened one moves the bar it sets', () => {
  // Walked line by line rather than split on the `- [ ] ` marker. Splitting
  // ran the last checkbox into the `---` rule that closes the section, and a
  // label is not a line anyway — several wrap, and the continuation is indented.
  const fromDoc: string[] = []
  for (const line of DONE_SECTION.split('\n')) {
    if (line.startsWith('- [ ] ')) fromDoc.push(line.slice(6))
    else if (/^\s+\S/.test(line) && fromDoc.length)
      fromDoc[fromDoc.length - 1] += ` ${line.trim()}`
  }

  // Apostrophes normalised on both sides. One label curls the doc's `§6's`
  // into `§6’s`, which is correct typography for something rendered on a page
  // and is not the thing this test is about. "Verbatim" here means no
  // paraphrase, no softening, no dropped clause — every one of which still
  // fails below.
  const same = (s: string) => flat(s).replace(/[’‘]/g, "'")

  expect(fromDoc).toHaveLength(DONE.length)
  for (const [i, item] of DONE.entries()) {
    expect(same(item.label), item.id).toBe(same(fromDoc[i]))
  }
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
