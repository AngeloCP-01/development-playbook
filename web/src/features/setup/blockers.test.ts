import { expect, test } from 'vitest'
import { BLOCKERS } from './blockers'

test('four blockers, which is what the doc’s table holds', () => {
  expect(BLOCKERS).toHaveLength(4)
})

test('every answer is one of that blocker’s own options, or the exercise cannot be scored', () => {
  for (const b of BLOCKERS) {
    expect(
      b.options.map((o) => o.id),
      b.id,
    ).toContain(b.answer)
  }
})

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
