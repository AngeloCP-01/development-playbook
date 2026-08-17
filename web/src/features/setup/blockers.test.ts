import { expect, test } from 'vitest'
import { BLOCKERS } from './blockers'

// Three from §8's table plus `prepare`, which is §6's. The name of this test
// said "what the doc's table holds" and the table holds three — a reader
// trusting the name would have "corrected" the data down to three and deleted
// the one that bites before the dashboard ones do.
test('four blockers: §8’s three, plus the install-step failure §6 describes', () => {
  expect(BLOCKERS).toHaveLength(4)
  expect(BLOCKERS.map((b) => b.id)).toContain('prepare')
})

test('every answer is one of that blocker’s own options, or the exercise cannot be scored', () => {
  for (const b of BLOCKERS) {
    expect(
      b.options.map((o) => o.id),
      b.id,
    ).toContain(b.answer)
  }
})

// Reported honestly, because a review asked what this can catch: all four
// blockers reference one shared `CAUSES` array, so while that array has four
// entries no edit to the four blocker literals can redden this. It is one
// assertion wearing four, and it survives as a guard on a future blocker that
// narrows its own options rather than as a live check on today's data.
test('every blocker offers at least three options, since a coin flip teaches nothing', () => {
  for (const b of BLOCKERS) {
    expect(b.options.length, b.id).toBeGreaterThanOrEqual(3)
  }
})

// The fourth row is the reason this section is an exercise at all. If every
// symptom reads as a failure, the set has lost what makes it worth guessing.
test('one symptom is a successful build, because that is the case a reader cannot reason their way to', () => {
  const green = BLOCKERS.filter((b) => /green|succee|success/i.test(b.symptom))
  expect(green).toHaveLength(1)
  expect(green[0].answer).toBe('wrong-repo')
})

test('no symptom names its own answer, or the guess is free', () => {
  for (const b of BLOCKERS) {
    const correct = b.options.find((o) => o.id === b.answer)!
    expect(b.symptom.toLowerCase(), b.id).not.toContain(
      correct.label.toLowerCase(),
    )
  }
})
