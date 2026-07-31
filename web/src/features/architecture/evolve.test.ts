import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { expect, test } from 'vitest'
import {
  BACKFILL_SQL,
  EVOLUTION_NOTES,
  EXPAND_CONTRACT_STEPS,
  PRE_LAUNCH_EXEMPTION,
} from './evolve'

test('the sequence is six steps, which is what makes it a sequence rather than "add a column carefully"', () => {
  expect(EXPAND_CONTRACT_STEPS).toHaveLength(6)
})

test('steps two and five are the skipped ones, because those are the two with no visible effect when you are the only user', () => {
  const skipped = EXPAND_CONTRACT_STEPS.filter((s) => s.commonlySkipped).map(
    (s) => s.n,
  )
  expect(skipped).toEqual([2, 5])
})

test('every step says what breaks if it is skipped, since the sequence without its failure modes is a checklist', () => {
  for (const s of EXPAND_CONTRACT_STEPS) {
    expect(s.ifSkipped.trim().length, `step ${s.n} ifSkipped`).toBeGreaterThan(
      60,
    )
  }
})

// The two that look redundant are the two whose explanation has to do work,
// and both explanations rest on the same fact: a deploy is a rollover, so for
// a while both versions of the code are serving traffic. An explanation that
// does not reach that fact has not explained why the step is not redundant.
test('the two skipped steps both explain themselves by the rollover, because that is the only reason either one is not redundant', () => {
  for (const s of EXPAND_CONTRACT_STEPS.filter((x) => x.commonlySkipped)) {
    expect(s.ifSkipped, `step ${s.n} does not reach the rollover`).toMatch(
      /rollover|instances|both serving/i,
    )
  }
})

test('step numbers are contiguous from one, because the order is the whole content', () => {
  expect(EXPAND_CONTRACT_STEPS.map((s) => s.n)).toEqual([1, 2, 3, 4, 5, 6])
})

// The doc opens the section by refusing to be hypocritical: this stage spends a
// whole section refusing imagined scale, so the technique that protects against
// traffic has to say out loud that it is not needed before there is any. An app
// that teaches the six steps without the exemption teaches ceremony.
test('the pre-launch exemption is carried, since the stage refuses imagined scale everywhere else and would be teaching ceremony without it', () => {
  // Both halves, not either: the exemption is "before there is traffic" AND
  // "it is one statement". An alternation passed on the word "nobody" alone.
  expect(PRE_LAUNCH_EXEMPTION).toMatch(/one statement/i)
  expect(PRE_LAUNCH_EXEMPTION).toMatch(/nobody is using|pre-launch/i)
  expect(PRE_LAUNCH_EXEMPTION).toMatch(/adopt it/i)
})

test('the four notes beyond the sequence are carried, because the sequence alone does not tell you what a deploy is or what to do about ALTER', () => {
  const ids = EVOLUTION_NOTES.map((n) => n.id)
  expect(ids).toEqual([
    'rollover',
    'backfill-guards',
    'alter-lock',
    'same-shape',
    'strangler-fig',
  ])
  for (const n of EVOLUTION_NOTES) {
    expect(n.body.trim().length, `${n.id} body`).toBeGreaterThan(0)
  }
})

// D-50: a whole-branch review found two defects in this exact SQL by running
// it — a backfill that corrupted every single-word name, and a loop whose own
// "repeat until zero" comment was false. Both are fixed in the doc. A
// hand-retyped copy in the app is precisely how a correction that expensive
// gets lost, so this holds the two character-for-character, the way
// ddl-sync.test.ts holds the CREATE TABLE blocks.
test('the backfill in the app is the backfill in the doc, character for character, because this is the block that was wrong twice', () => {
  const md = readFileSync(
    fileURLToPath(
      new URL('../../../../docs/03-architecture.md', import.meta.url),
    ),
    'utf8',
  )
  const block = [...md.matchAll(/```sql\n([\s\S]*?)```/g)]
    .map((m) => m[1].trimEnd())
    .find((b) => b.includes('UPDATE users'))
  expect(
    block,
    'docs/03-architecture.md has no UPDATE users backfill block',
  ).toBeDefined()
  expect(BACKFILL_SQL).toBe(block)
})

test('both guards survive in whatever the app renders, since each one is load-bearing and neither failure announces itself', () => {
  expect(BACKFILL_SQL).toMatch(/first_name IS NULL/)
  expect(BACKFILL_SQL).toMatch(/name IS NOT NULL/)
  expect(BACKFILL_SQL).toMatch(/LIMIT 1000/)
})
