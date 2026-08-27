import { expect, test } from 'vitest'
import { CASES } from './teeth'
import { flat, section } from './doc-source'

/**
 * The verdict assertion is a literal, on purpose. A test shaped
 * `expect(rendered).toBe(String(c.proven))` reads both sides off the same row,
 * so flipping a case's verdict moves the expectation with it and the test
 * proves nothing — which is, with some irony, the exact failure this module
 * is about.
 */
test('exactly one of the three bites, and it is the literal-assertion case', () => {
  expect(CASES).toHaveLength(3)
  expect(CASES.filter((c) => c.proven).map((c) => c.id)).toEqual(['literal'])
})

test('the two failures are different failures, or the second teaches nothing new', () => {
  const notProven = CASES.filter((c) => !c.proven)
  expect(notProven.map((c) => c.id)).toEqual(['same-source', 'stray-mutation'])
  expect(notProven[0].verdict).toMatch(/same row|both sides/i)
  expect(notProven[1].verdict).toMatch(
    /never (landed|reached)|did not (land|apply)/i,
  )
})

test('ids are unique, because the drill keys its state on them', () => {
  expect(new Set(CASES.map((c) => c.id)).size).toBe(CASES.length)
})

/**
 * Pins the doc's teeth-check section, one phrase per sentence.
 *
 * "Prove it bites" is the memorable half. "Both outputs go in the task report"
 * is the half that makes it a practice rather than a sentiment, and it is the
 * kind of trailing clause that goes missing in a transcription.
 */
test('the teeth-check section keeps the procedure and the reporting requirement', () => {
  const s = flat(section('The teeth check'))
  expect(s).toMatch(/green proves nothing, because the test never failed/i)
  expect(s).toMatch(/deliberately break the implementation/i)
  expect(s).toMatch(/and only that test.{0,20}fails/i)
  expect(s).toMatch(/Both outputs go in the task report/i)
})

/**
 * The doc grounds the section in this repo's own gate. That sentence is
 * evidence rather than decoration — it is what makes the section a report
 * instead of advice — so it is pinned separately.
 */
test('the section keeps the evidence that the gate passed a bad commit twice', () => {
  const s = flat(section('The teeth check'))
  expect(s).toMatch(/passed a deliberately bad commit twice/i)
  expect(s).toMatch(/eslint exits 0 on warnings/i)
})
