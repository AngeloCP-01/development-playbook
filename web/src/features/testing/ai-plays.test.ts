import { expect, test } from 'vitest'
import { AI_LIMIT, AI_PREMISE, PLAYS } from './ai-plays'
import { flat, section } from './doc-source'

test("every bullet in the doc's AI section is carried, and the count comes from the doc", () => {
  const bullets = section('AI in testing')
    .split('\n')
    .filter((l) => /^- \*\*/.test(l))
  expect(PLAYS).toHaveLength(bullets.length)
  expect(PLAYS).toHaveLength(6)
})

/**
 * The premise is lifted verbatim, all three of the doc's opening sentences.
 * A prior pass here kept the warning and the closing question but dropped
 * the middle sentence as "just a restatement" — it isn't: its second clause
 * ("gets larger without anyone's confidence growing with it") is a distinct
 * claim about a whole suite compounding over time, and it is the antecedent
 * of the section's closing "ballast" line pinned below. The middle pin below
 * is specifically the *second* clause of that sentence, not its restating
 * first clause, because a pin on the first clause would not have caught the
 * earlier loss (the first clause alone reads like the warning already
 * covers it).
 */
test('the premise keeps the question, not only the warning', () => {
  expect(AI_PREMISE).toMatch(/green either way/i)
  expect(AI_PREMISE).toMatch(/without anyone's confidence growing with it/i)
  expect(AI_PREMISE).toMatch(/has this test ever been red/i)
  // Both sides flattened: `AI_PREMISE` is one line, the doc hard-wraps at ~90 columns.
  expect(flat(section('AI in testing'))).toContain(
    flat(AI_PREMISE).slice(0, 120),
  )
})

test('the jest-dom play keeps the specific number, which is what makes it evidence', () => {
  const p = PLAYS.find((p) => p.id === 'installed-version')
  expect(p?.kind).toBe('mcp')
  expect(p?.body).toMatch(/toBeInTheDocument/)
  expect(p?.body).toMatch(/Invalid Chai property/)
})

/**
 * A prior version of this test only ever read `docs/06-testing.md` — it
 * never touched an app export, so it stayed green through a rewrite that
 * dropped the closing paragraph entirely, which is exactly what happened
 * (Task 14's coverage walk, finding 5). `AI_LIMIT` is that paragraph,
 * restored into the app; the three checks below repeat against it, as
 * literals, not derived from `AI_LIMIT` itself.
 */
test('the closing claim survives: a generated test that has never been red is a decoration', () => {
  const s = flat(section('AI in testing'))
  expect(s).toMatch(/watching the test fail/i)
  expect(s).toMatch(/never been red is a decoration/i)
  expect(s).toMatch(/assuming it happened is how a suite becomes ballast/i)

  expect(AI_LIMIT).toMatch(/watching the test fail/i)
  expect(AI_LIMIT).toMatch(/never been red is a decoration/i)
  expect(AI_LIMIT).toMatch(
    /assuming it happened is how a suite becomes ballast/i,
  )
})

test("kinds are drawn from the doc's own parenthetical, and every play has one", () => {
  for (const p of PLAYS) {
    expect(['skill', 'command', 'mcp', 'memory'], p.id).toContain(p.kind)
  }
})

/**
 * Finding 7 of Task 14's coverage walk: the doc's closing line names
 * `test-driven-development` as "from the Superpowers plugin" so a reader
 * knows it is something installable, not a generic principle. Stage 05 has
 * the same test for the same reason (N6, coverage-walk.md); stage 06
 * reintroduced the gap.
 */
test('the skill play says it ships from the Superpowers plugin, not just its own name', () => {
  const skill = PLAYS.find((p) => p.kind === 'skill')
  expect(skill?.body).toContain('Superpowers plugin')
})
