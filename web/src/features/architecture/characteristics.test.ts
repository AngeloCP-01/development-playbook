import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { expect, test } from 'vitest'
import {
  CHARACTERISTICS,
  EXAMPLE_DECLINED,
  EXAMPLE_PICK,
  FITNESS_EXAMPLES,
  FITNESS_FUNCTION_CLAIM,
  FITNESS_FUNCTION_NOT_NOW,
  MAX_PICKS,
  TRACE_ROWS,
  TRADES,
} from './characteristics'
import { STEP_IDS } from './steps'

const IDS = new Set(CHARACTERISTICS.map((c) => c.id))

const source = (file: string) =>
  readFileSync(fileURLToPath(new URL(file, import.meta.url)), 'utf8')

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

// The row renders as a link: `stepId` is the href and `stepLabel` is what the
// link says, so a row needs both or it is a dead end on the page.
test('every trace row points at a step the stepper actually has, and says which', () => {
  for (const r of TRACE_ROWS) {
    expect(STEP_IDS, `${r.characteristicId} points at ${r.stepId}`).toContain(
      r.stepId,
    )
    expect(
      r.stepLabel.trim().length,
      `${r.characteristicId} has no step label`,
    ).toBeGreaterThan(0)
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

// The row used to read "The three answers have a name — graceful degradation"
// directly after listing a timeout, a retry policy and the dependency-down
// decision, which teaches that a timeout is graceful degradation. The doc
// (docs/03-architecture.md, "Timeouts, retries and failing well") has it the
// other way round: degradation is the per-feature outcome and the patterns are
// the vocabulary for producing it. `trace` is five steps before `resilience`,
// so this row is the first referent a reader gets, and it was the wrong one.
test('where the trace names graceful degradation it names the per-feature decision, not the timeout and retry policy sitting beside it', () => {
  const availability = TRACE_ROWS.find(
    (r) => r.characteristicId === 'availability',
  )
  const naming = (availability?.forces ?? '')
    .split(/(?<=\.)\s+/)
    .filter((s) => /graceful degradation/i.test(s))

  expect(naming, 'the availability row names it exactly once').toHaveLength(1)
  expect(naming[0], 'named as the per-feature outcome').toMatch(/per feature/i)
  expect(
    naming[0],
    'a timeout or a retry policy must not be what the name attaches to',
  ).not.toMatch(/timeout|retr(y|ies|ying)/i)
})

test('every trace row names the decision the characteristic forces, since a characteristic that forces nothing is a label', () => {
  for (const r of TRACE_ROWS) {
    expect(
      r.forces.trim().length,
      `${r.characteristicId} forces`,
    ).toBeGreaterThan(30)
  }
})

// The security row shipped "often two patterns joined by *and*", and
// `TraceForward` renders `forces` as text, so the asterisks were on the page.
// Scoped to this module. `contracts.ts` had the same class and now sweeps for
// it itself — it was introduced on this branch too (bd018a9), not pre-existing,
// which is what an earlier version of this comment claimed. `terms.ts` sweeps
// for it as well. The instance left in `scoring.ts` genuinely does predate the
// branch and is deferred.
test('no string in this module ships literal markdown, since every one of them renders as text and the reader would see the punctuation', () => {
  const shipped: { where: string; text: string }[] = [
    ...CHARACTERISTICS.map((c) => ({
      where: `${c.id} meaning`,
      text: c.meaning,
    })),
    ...TRADES.map((t, i) => ({ where: `trade ${i}`, text: t })),
    ...EXAMPLE_DECLINED.map((d) => ({
      where: `${d.id} because`,
      text: d.because,
    })),
    ...TRACE_ROWS.map((r) => ({
      where: `${r.characteristicId} forces`,
      text: r.forces,
    })),
    ...FITNESS_EXAMPLES.flatMap((e) => [
      { where: `${e.id} what`, text: e.what },
      { where: `${e.id} defends`, text: e.defends },
    ]),
    {
      where: 'the fitness claim',
      text: Object.values(FITNESS_FUNCTION_CLAIM).join(' '),
    },
    { where: 'FITNESS_FUNCTION_NOT_NOW', text: FITNESS_FUNCTION_NOT_NOW },
  ]

  for (const { where, text } of shipped) {
    expect(text, `${where} carries markdown`).not.toMatch(/[*`_]/)
  }
})

// The doc is emphatic that this stage does not build the check: "standing up an
// import-graph linter before your first table is exactly the kind of
// infrastructure this stage spends a section refusing". Porting it as a task
// rather than as a note would invert the section it belongs to.
test('fitness functions are framed as a note now and a test later, because standing up a linter before the first table is the infrastructure this stage refuses', () => {
  expect(FITNESS_FUNCTION_NOT_NOW).toMatch(/06|testing/i)
  expect(
    FITNESS_FUNCTION_NOT_NOW,
    'the refusal is what makes it a note rather than a task',
  ).toMatch(/import-graph linter/i)
  expect(
    FITNESS_FUNCTION_NOT_NOW,
    'what belongs in this stage is the line, not the check',
  ).toMatch(/one line|in your notes|how would I know/i)
})

// The framing shipped exported, asserted in this file, and rendered nowhere:
// both halves had been hand-copied into JSX, so the test above asserted a
// string no reader ever saw and deleting the callout left the suite green. A
// data test cannot see whether anything renders a string, so this reads the two
// render sites — the same trick `ddl-sync.test.ts` uses on the doc.
test('both halves of the fitness-function framing render from the constant, since a string asserted here and copied into JSX is two strings that drift', () => {
  const claimSite = source('./Architecture.tsx')
  const notNowSite = source('./FitnessExamples.tsx')

  expect(claimSite, 'the section intro must render the claim').toContain(
    'FITNESS_FUNCTION_CLAIM',
  )
  expect(notNowSite, 'the callout must render the refusal').toContain(
    'FITNESS_FUNCTION_NOT_NOW',
  )
  expect(claimSite, 'the claim is hand-copied into JSX again').not.toContain(
    'a characteristic you are',
  )
  expect(notNowSite, 'the refusal is hand-copied into JSX again').not.toContain(
    'import-graph linter',
  )
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

// Cold-reader run 4's only hard stall. The stage requires "one line per
// characteristic on how you would know if it stopped holding", and its examples
// covered correctness, evolvability and latency — while the worked example
// picks auditability and cheap-to-run, neither of which had one. The reader
// wrote proxies it said it had no confidence in. A stated refusal is usable;
// an absence is not.
test('the examples cover the characteristics this stage’s own worked example picks, or it does not survive its own requirement', () => {
  const covered = new Set(FITNESS_EXAMPLES.map((e) => e.characteristicId))
  for (const id of EXAMPLE_PICK) {
    expect(
      covered,
      `${id} is picked by the worked example and has no fitness line`,
    ).toContain(id)
  }
})

test('the one that cannot be a test says so, since refusing honestly is what this stage does elsewhere', () => {
  const cost = FITNESS_EXAMPLES.find(
    (e) => e.characteristicId === 'cheap-to-run',
  )
  // The alternation used to include bill|reminder|calendar, which passes on
  // "a test asserting the monthly bill stays under fifty dollars" — precisely
  // the invented assertion this entry exists to refuse. Match the refusal.
  expect(cost?.what, 'it has to refuse, not merely mention money').toMatch(
    /not a test|no test/i,
  )
  expect(cost?.defends, 'and say why there is nothing to assert').toMatch(
    /not in your repository|lives on a bill|nothing to assert/i,
  )
})
