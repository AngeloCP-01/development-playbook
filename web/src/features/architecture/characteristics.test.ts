import { expect, test } from 'vitest'
import {
  CHARACTERISTICS,
  EXAMPLE_DECLINED,
  EXAMPLE_PICK,
  FITNESS_EXAMPLES,
  FITNESS_FUNCTION_NOTE,
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

// ── The widened trace, and fitness functions ───────────────────────────────

// This was the doc round's actual deliverable: the section offers ten
// candidates and supplied a three-row trace, so a reader who picked
// availability, scalability or evolvability got the test with no material to
// pass it. Ten rows against ten candidates is the thing that makes the section
// honest rather than a vocabulary exercise.
test('the trace table covers all ten candidate characteristics, which was the doc round’s actual deliverable', () => {
  expect(TRACE_ROWS).toHaveLength(10)
  expect(new Set(TRACE_ROWS.map((r) => r.characteristicId))).toEqual(
    new Set(CHARACTERISTICS.map((c) => c.id)),
  )
})

test('every trace row names the decision the characteristic forces, since a characteristic that forces nothing is a label', () => {
  for (const r of TRACE_ROWS) {
    expect(
      r.forces.trim().length,
      `${r.characteristicId} forces`,
    ).toBeGreaterThan(30)
  }
})

test('every trace row points at a step that exists, since the row renders as a link', () => {
  for (const r of TRACE_ROWS) {
    expect(STEP_IDS, `${r.characteristicId} → ${r.stepId}`).toContain(r.stepId)
    expect(
      r.stepLabel.trim().length,
      `${r.characteristicId} label`,
    ).toBeGreaterThan(0)
  }
})

// The doc is emphatic that this stage does not build the check: "standing up an
// import-graph linter before your first table is exactly the kind of
// infrastructure this stage spends a section refusing". Porting it as a task
// rather than as a note would invert the section it belongs to.
test('fitness functions are framed as a note now and a test later, because standing up a linter before the first table is the infrastructure this stage refuses', () => {
  expect(FITNESS_FUNCTION_NOTE).toMatch(/06|testing/i)
  expect(
    FITNESS_FUNCTION_NOTE,
    'what belongs in this stage is the line, not the check',
  ).toMatch(/one line|in your notes|how would I know/i)
})

test('the cheapest fitness example is the schema assertion, since it is three lines and needs no tooling decision', () => {
  expect(FITNESS_EXAMPLES[0].what).toMatch(/constraint|schema/i)
  for (const e of FITNESS_EXAMPLES) {
    expect(e.defends.trim().length, `${e.id} defends`).toBeGreaterThan(0)
    expect(e.what.trim().length, `${e.id} what`).toBeGreaterThan(0)
  }
})

test('every fitness example defends a characteristic the picker actually offers, or it is an example of nothing', () => {
  for (const e of FITNESS_EXAMPLES) {
    expect(
      CHARACTERISTICS.map((c) => c.id),
      `${e.id} defends ${e.characteristicId}`,
    ).toContain(e.characteristicId)
  }
})
