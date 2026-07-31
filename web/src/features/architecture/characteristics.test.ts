import { expect, test } from 'vitest'
import {
  CHARACTERISTICS,
  EXAMPLE_DECLINED,
  EXAMPLE_PICK,
  MAX_PICKS,
  TRACE_ROWS,
  TRADES,
} from './characteristics'
import { STEP_IDS } from './steps'

const IDS = new Set(CHARACTERISTICS.map((c) => c.id))

test('ten candidates are offered, because the exercise is choosing from a list and not completing one', () => {
  expect(CHARACTERISTICS).toHaveLength(10)
})

test('candidate ids are unique, since a pick is stored by id', () => {
  expect(IDS.size).toBe(CHARACTERISTICS.length)
})

test('every candidate says what choosing it commits you to, so the list is not ten words to nod at', () => {
  for (const c of CHARACTERISTICS) {
    expect(c.meaning.trim().length, `${c.id} has no meaning`).toBeGreaterThan(0)
  }
})

test('the cap is four, which is what makes the exercise a trade rather than a checklist', () => {
  expect(MAX_PICKS).toBe(4)
})

test('the worked example picks three and declines three, because a characteristic you never considered is not one you rejected', () => {
  expect(EXAMPLE_PICK).toHaveLength(3)
  expect(EXAMPLE_DECLINED).toHaveLength(3)
})

test('the example picks and declines name real candidates, so neither list can drift from the ten', () => {
  for (const id of EXAMPLE_PICK) expect(IDS, `picked ${id}`).toContain(id)
  for (const d of EXAMPLE_DECLINED)
    expect(IDS, `declined ${d.id}`).toContain(d.id)
})

test('nothing is both picked and declined, which would make the worked example incoherent', () => {
  const declined = new Set(EXAMPLE_DECLINED.map((d) => d.id))
  for (const id of EXAMPLE_PICK) expect(declined, `${id}`).not.toContain(id)
})

test('every declined characteristic says why, since declining out loud is the whole point of the list', () => {
  for (const d of EXAMPLE_DECLINED) {
    expect(d.because.trim().length, `${d.id} has no reason`).toBeGreaterThan(0)
  }
})

// The doc's own test, expressed as an invariant: "a characteristic that traces
// to no decision was not chosen, it was listed." If this fails, the trace table
// and the worked example have drifted apart, and the section teaches vocabulary.
test('every picked characteristic traces to a decision, which is the doc test this section closes on', () => {
  const traced = new Set(TRACE_ROWS.map((r) => r.characteristicId))
  for (const id of EXAMPLE_PICK)
    expect(traced, `${id} traces nowhere`).toContain(id)
})

test('every trace row points at a step the stepper actually has', () => {
  for (const r of TRACE_ROWS) {
    expect(STEP_IDS, `${r.characteristicId} points at ${r.stepId}`).toContain(
      r.stepId,
    )
  }
})

// The hardcoded list this replaced could not fail when a step split: the row
// kept naming a step that still existed while the decision it described had
// moved. Deriving the list does not fix that either — nothing can tell a
// reader's intent from a string — so this asserts the weaker thing honestly
// and the split tasks carry the re-pointing as an explicit step.
test('the id list is in rail order and has no duplicates, since it is what the trace links resolve against', () => {
  expect(new Set(STEP_IDS).size).toBe(STEP_IDS.length)
  expect(STEP_IDS[0]).toBe('reverse')
  // The stage closes on its trap set and its reading list, which is how stage
  // 02 closes too. This used to assert `ai` was last, which was true of this
  // stage and never a rule — stage 02 puts its AI step fifth of seven. What
  // D-35 requires is that the step exists, not where it sits.
  expect(STEP_IDS).toContain('ai')
  expect(STEP_IDS.at(-1)).toBe('traps')
})

test('the trades are stated, because the cap needs a reason and "pick fewer" is not one', () => {
  expect(TRADES.length).toBeGreaterThan(0)
  for (const t of TRADES) expect(t.trim().length).toBeGreaterThan(0)
})
