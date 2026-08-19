import { expect, test } from 'vitest'
import { SNIPPETS } from './snippets'
import { flat, section } from './doc-source'

/**
 * **The verdict assertion is a literal, on purpose.** A test shaped
 * `expect(rendered).toBe(String(snippet.safe))` reads both sides off the same
 * row, so flipping a snippet's verdict moves the expectation with it and the
 * test proves nothing. `docs/learnings/stage-implementation-101.md` names this
 * exact hole, found on a stage 04 render test that had it.
 *
 * Exactly two are safe, and they are the scoped-query pair.
 */
test('exactly two of the six are safe, and they are the scoped-query pair', () => {
  expect(SNIPPETS).toHaveLength(6)
  expect(SNIPPETS.filter((s) => s.safe).map((s) => s.id)).toEqual([
    'list-scoped',
    'detail-scoped',
  ])
})

test("both verbs are represented, since the doc's point is that the rule ignores the verb", () => {
  const ids = SNIPPETS.map((s) => s.id)
  expect(ids).toContain('detail-unscoped') // a read
  expect(ids).toContain('action-no-owner') // a write
})

test('the check-then-write gap is one of the six, because it is the version that looks right', () => {
  const gap = SNIPPETS.find((s) => s.id === 'action-check-then-write')
  expect(gap?.safe).toBe(false)
  expect(gap?.verdict).toMatch(/between the check and the write/i)
})

test('ids are unique, because the drill keys its state on them', () => {
  const ids = SNIPPETS.map((s) => s.id)
  expect(new Set(ids).size).toBe(ids.length)
})

test('every verdict gives a reason rather than restating the answer', () => {
  for (const s of SNIPPETS) {
    expect(s.verdict.trim().length, s.id).toBeGreaterThan(60)
    expect(s.verdict.toLowerCase(), s.id).not.toBe(s.safe ? 'safe' : 'unsafe')
  }
})

/**
 * The snippets are authored, but the reasoning they teach is not. Each verdict
 * has to be defensible from the doc, so the two load-bearing sentences are
 * pinned here — if the doc's argument changes, this reddens.
 */
test('the doc still argues what the unsafe verdicts rest on', () => {
  expect(flat(section('Authorize reads, not just writes'))).toContain(
    'The row was already loaded',
  )
  expect(
    flat(section('Server Actions need validation and authorization')),
  ).toContain('leaves a gap between the check and the write')
})
