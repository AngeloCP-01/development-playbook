import { expect, test } from 'vitest'
import { AI_LIMIT, PLAYS } from './ai-plays'
import { flat, section } from './doc-source'

const SECTION = section('AI in development')
const DOC_PLAYS = SECTION.match(/^- \*\*.+?\*\*/gm) ?? []

test('the bullet regex matches plays, not prose and not nothing', () => {
  expect(DOC_PLAYS.length).toBeGreaterThan(0)
  expect(DOC_PLAYS[0]).toContain('Write the failing test')
})

test('the app renders exactly the plays the doc lists', () => {
  expect(PLAYS).toHaveLength(6)
  expect(PLAYS).toHaveLength(DOC_PLAYS.length)
})

/**
 * `kind` is the mechanism the doc names in parentheses after each title. The
 * count and the kind tally are different questions — two of the six are saved
 * commands.
 */
test('kinds match the mechanism the doc names in parentheses', () => {
  const tally = PLAYS.reduce<Record<string, number>>((acc, p) => {
    acc[p.kind] = (acc[p.kind] ?? 0) + 1
    return acc
  }, {})
  expect(tally).toEqual({ skill: 2, command: 2, mcp: 1, memory: 1 })
})

test('the named tools the doc closes on are all present', () => {
  const all = PLAYS.map((p) => p.body).join(' ')
  for (const tool of [
    'test-driven-development',
    'systematic-debugging',
    'context7',
    'claude-mem',
  ]) {
    expect(all, tool).toContain(tool)
  }
})

test('the unstable_retry play keeps the correction, not just the tool name', () => {
  const play = PLAYS.find((p) => p.kind === 'mcp')
  expect(play?.body).toContain('unstable_retry')
  expect(play?.body).toMatch(/not a rename/i)
})

// The section's closing point, and the reason this stage's AI panel is not a
// list of wins. Stage 04's counterpart pins its own AI_LIMIT the same way;
// this is that fix, applied here after the omission was caught in review
// (Task 10).
test('the limit keeps the reading-the-diff claim, not just its topic', () => {
  expect(AI_LIMIT).toContain('reading the diff before you keep it')
})

// The clause that must not be lost: it ties the AI section back to the
// authorization gap this stage already covers elsewhere, which is the whole
// reason the closing paragraph exists rather than a generic "review your AI
// output" caution.
test('the limit keeps the authorization-gap sentence, not a generic caution', () => {
  expect(AI_LIMIT).toContain(
    'The authorization gap already covered on this page passes every test that never scopes a query by owner',
  )
})

test('the doc is still where that limit comes from', () => {
  expect(flat(SECTION)).toContain(flat(AI_LIMIT))
})
