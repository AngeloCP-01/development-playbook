import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { expect, test } from 'vitest'
import { PIN_RULE, PIN_TARGETS } from './pins'

const DOC = readFileSync(
  fileURLToPath(
    new URL('../../../../docs/04-project-setup.md', import.meta.url),
  ),
  'utf8',
)

// The doc is hard-wrapped at 90 characters, so its sentences carry newlines the
// app has no use for. Collapsing runs of whitespace lets one constant be both
// the string a panel renders and the string the doc contains; it still catches
// a paraphrase, a dropped clause or a changed capital, which is what the check
// below is for.
const DOC_UNWRAPPED = DOC.replace(/\s+/g, ' ')

test('three environments, because the doc names three and the whole lesson is that they differ', () => {
  expect(PIN_TARGETS).toHaveLength(3)
})

test('the host reads engines.node, which is the correction TD-28 was opened for', () => {
  const host = PIN_TARGETS.find((t) => t.id === 'host')
  expect(host?.reads).toBe('package.json → engines.node')
})

test('no target claims the host reads .nvmrc, since that sentence is the defect this stage exists to fix', () => {
  const host = PIN_TARGETS.find((t) => t.id === 'host')
  expect(host?.reads).not.toMatch(/nvmrc/i)
  expect(host?.mistake).toMatch(/nvmrc/i)
})

test('every target explains itself past sixty characters, because a pairing with no reason is a flashcard', () => {
  for (const t of PIN_TARGETS) {
    expect(t.why.trim().length, `${t.id} why`).toBeGreaterThan(60)
  }
})

// The generalisation is the transferable half of §1. If the app states it
// differently from the doc, the two deliverables teach two rules.
test("the rule is the doc's own sentence, not a paraphrase of it", () => {
  expect(DOC_UNWRAPPED).toContain(PIN_RULE)
})
