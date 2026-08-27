import { expect, test } from 'vitest'
import { CHANGES, OPTIONS } from './triage'
import { flat, section } from './doc-source'

/**
 * The four options are the doc's four tiers, so the drill teaches the
 * distribution by making the reader place things into it rather than by
 * listing it. Pinned as literals: reading the labels off `OPTIONS` would let a
 * renamed tier move the expectation with it.
 */
test('the four options are the distribution, in descending volume', () => {
  expect(OPTIONS.map((o) => o.id)).toEqual([
    'unit',
    'integration',
    'e2e',
    'none',
  ])
})

test('every change offers the same four options, so the reader has to read the change', () => {
  for (const c of CHANGES) {
    expect(c.options, c.id).toBe(OPTIONS)
  }
})

test('six changes, unique ids, every answer a real option', () => {
  expect(CHANGES).toHaveLength(6)
  expect(new Set(CHANGES.map((c) => c.id)).size).toBe(6)
  const ids = OPTIONS.map((o) => o.id)
  for (const c of CHANGES) expect(ids, c.id).toContain(c.answer)
})

/**
 * The answer spread is itself the lesson: the shape of the set mirrors the
 * shape of a real suite. Asserted as a literal tally rather than "at least one
 * of each", which a set of six identical answers would also satisfy.
 */
test('the answers mirror the distribution the doc describes', () => {
  const tally = CHANGES.reduce<Record<string, number>>((acc, c) => {
    acc[c.answer] = (acc[c.answer] ?? 0) + 1
    return acc
  }, {})
  expect(tally).toEqual({ unit: 2, integration: 1, e2e: 1, none: 2 })
})

/**
 * Pins against the doc, one phrase per sentence — and, since Task 14's
 * coverage walk, against the drill itself. A prior version of this test only
 * ever read `docs/06-testing.md`: it never touched `CHANGES` or `OPTIONS`, so
 * it stayed green through a rewrite that dropped the drill entirely. The two
 * app-side checks below are hand-typed literals, not values sliced out of
 * `CHANGES`/`OPTIONS` at runtime, for the same reason the doc pins are
 * hand-typed rather than re-derived from the section they guard.
 *
 * The first sentence of the doc's sorting question is the famous half and the
 * one a transcription keeps. The second is the half that makes it usable —
 * it names both branches and what each implies — and it is the half stage 05
 * lost three times over. Both are pinned; the second is why this test exists.
 */
test('the sorting question keeps both halves, not just the memorable one', () => {
  // `flat()`, not raw `section()`: the doc hard-wraps at ~90 columns, so the
  // phrases below can straddle a line break. Flattening whitespace first lets
  // `.` stay a same-line match instead of reaching for the dotAll (`s`) regex
  // flag, which this project's `ES2017` TS target rejects (TS1501).
  const s = flat(section('The one question worth asking'))
  expect(s).toMatch(/if this breaks, how will I find out/i)
  expect(s).toMatch(/a user emails me.{0,40}write a test/i)
  expect(s).toMatch(
    /the typechecker\s+catches it.{0,60}you already have that coverage for free/i,
  )

  // The drill teaches both halves by letting the reader hit them rather than
  // by restating the sentence, so the app-side check lands on the two rows
  // that carry each half: the "none" tier's own free-coverage framing, and
  // the discount row's explanation of the trigger to write one.
  const none = OPTIONS.find((o) => o.id === 'none')
  expect(none?.label).toMatch(/coverage is already free/i)
  const discount = CHANGES.find((c) => c.id === 'discount')
  expect(discount?.explanation).toMatch(/doc.s own trigger for writing a test/i)
})

/**
 * Each explanation says why a wrong reading was tempting, not only why the
 * right answer is right. Enforced structurally: a one-sentence explanation
 * cannot do both jobs, and the failure mode here is an explanation that
 * restates the answer.
 */
test('every explanation is at least two sentences, because one cannot both answer and account for the temptation', () => {
  for (const c of CHANGES) {
    const sentences = c.explanation.split(/(?<=[.?])\s+/).filter(Boolean)
    expect(
      sentences.length,
      `${c.id}: ${c.explanation}`,
    ).toBeGreaterThanOrEqual(2)
  }
})

test('the two "nothing" rows refuse for different reasons, or one of them is redundant', () => {
  const none = CHANGES.filter((c) => c.answer === 'none')
  expect(none.map((c) => c.id)).toEqual(['badge', 'route'])
  expect(none[0].explanation).toMatch(/typechecker/i)
  expect(none[1].explanation).toMatch(/framework|Next\.js routing/i)
})
