import { expect, test } from 'vitest'
import {
  BOUNDARY_EDGES,
  BOUNDARY_MODULES,
  DECISIONS,
  INTERROGATIONS,
  judgeInterrogation,
  REVERSIBILITY_TEST,
  scoreReversibility,
  SCHEMA_LINES,
  SPLIT_CANDIDATES,
  scoreSplit,
} from './scoring'

test('the table carries six decisions, matching the exercise the stage describes', () => {
  expect(DECISIONS).toHaveLength(6)
})

test('the set is balanced three and three, so guessing one way scores half', () => {
  expect(DECISIONS.filter((d) => d.expensive)).toHaveLength(3)
  expect(DECISIONS.filter((d) => !d.expensive)).toHaveLength(3)
})

test('two rows are marked arguable, because a set of six gimmes teaches nothing', () => {
  expect(DECISIONS.filter((d) => d.arguable)).toHaveLength(2)
})

test('every decision explains itself, since a revealed verdict without a reason teaches nothing', () => {
  for (const d of DECISIONS) {
    expect(d.why.trim().length, `${d.id} has no why`).toBeGreaterThan(0)
  }
})

test('every decision names its undo cost, which is the axis the exercise is actually about', () => {
  for (const d of DECISIONS) {
    expect(d.undo.trim().length, `${d.id} has no undo cost`).toBeGreaterThan(0)
  }
})

test('decision ids are unique, because answers are keyed by id', () => {
  expect(new Set(DECISIONS.map((d) => d.id)).size).toBe(DECISIONS.length)
})

test('scores only what was answered, so a partial run still reports honestly', () => {
  // Asymmetric on purpose: two matches and one miss. A symmetric fixture scores
  // the same whether the comparison is `===` or its negation, so it cannot tell
  // a correct implementation from an inverted one.
  const answers = {
    'auth-strategy': true, // expensive — correct
    'invoice-delete': true, // expensive — correct
    'folder-names': true, // cheap — wrong
  }
  expect(scoreReversibility(answers)).toEqual({ answered: 3, correct: 2 })
})

test('guessing everything expensive scores exactly the expensive ones, so pessimism does not inflate the score', () => {
  const answers = Object.fromEntries(DECISIONS.map((d) => [d.id, true]))
  expect(scoreReversibility(answers)).toEqual({ answered: 6, correct: 3 })
})

test('credits a correct cheap call, so a reader who rightly shrugs at folder names is counted', () => {
  // Every other fixture guesses `true`, which cannot distinguish `expensive === guess`
  // from a scorer that ignores the guess and counts expensive decisions alone.
  expect(scoreReversibility({ 'folder-names': false })).toEqual({
    answered: 1,
    correct: 1,
  })
})

test('unknown ids are ignored rather than counted, so stale answers cannot inflate a score', () => {
  expect(scoreReversibility({ 'not-a-decision': true })).toEqual({
    answered: 0,
    correct: 0,
  })
})

test('an empty run scores zero rather than dividing by nothing', () => {
  expect(scoreReversibility({})).toEqual({ answered: 0, correct: 0 })
})

test('every question’s answer is one of its own options, so the right answer is reachable', () => {
  for (const q of INTERROGATIONS) {
    expect(
      q.options.map((o) => o.id),
      `${q.id} answer not in options`,
    ).toContain(q.answer)
  }
})

test('option ids are unique within a question, since a choice is keyed by id', () => {
  for (const q of INTERROGATIONS) {
    expect(new Set(q.options.map((o) => o.id)).size).toBe(q.options.length)
  }
})

test('question ids are unique across the set', () => {
  expect(new Set(INTERROGATIONS.map((q) => q.id)).size).toBe(
    INTERROGATIONS.length,
  )
})

test('overdue is computed rather than stored, which is the stage’s named trap', () => {
  const verdict = judgeInterrogation('overdue-status', 'computed')
  expect(verdict.correct).toBe(true)
  expect(verdict.why).toMatch(/drift|disagree/i)
})

test('storing overdue is judged wrong, and the reason names what breaks', () => {
  const verdict = judgeInterrogation('overdue-status', 'stored')
  expect(verdict.correct).toBe(false)
  expect(verdict.why.trim().length).toBeGreaterThan(0)
})

test('a wrong answer gets the same explanation as a right one, because the lesson is the reasoning', () => {
  // Not a formatting detail: an exercise that explains itself only when you are
  // right teaches the readers who least need it.
  for (const q of INTERROGATIONS) {
    const wrong = q.options.find((o) => o.id !== q.answer)
    expect(wrong, `${q.id} has no wrong option`).toBeDefined()
    const verdict = judgeInterrogation(q.id, wrong!.id)
    expect(
      verdict.why.trim().length,
      `${q.id} wrong answer why`,
    ).toBeGreaterThan(0)
  }
})

test('an unknown question id is judged incorrect rather than throwing, since this runs in render', () => {
  const verdict = judgeInterrogation('not-a-question', 'computed')
  expect(verdict.correct).toBe(false)
  expect(verdict.why.trim().length).toBeGreaterThan(0)
})

test('an unknown option on a real question is judged incorrect', () => {
  expect(judgeInterrogation('overdue-status', 'neither').correct).toBe(false)
})

test('six candidates: the doc’s four triggers and two of its named non-reasons', () => {
  expect(SPLIT_CANDIDATES).toHaveLength(6)
})

test('four are real triggers and two are not, so the set is not guessable by answering yes', () => {
  expect(SPLIT_CANDIDATES.filter((c) => c.valid)).toHaveLength(4)
  expect(SPLIT_CANDIDATES.filter((c) => !c.valid)).toHaveLength(2)
})

test('every candidate explains itself', () => {
  for (const c of SPLIT_CANDIDATES) {
    expect(c.why.trim().length, `${c.id} has no why`).toBeGreaterThan(0)
  }
})

test('candidate ids are unique', () => {
  expect(new Set(SPLIT_CANDIDATES.map((c) => c.id)).size).toBe(
    SPLIT_CANDIDATES.length,
  )
})

test('scoring is asymmetric, so an inverted comparison cannot pass', () => {
  const answers = {
    'execution-limit': true, // valid — correct
    'different-runtime': true, // valid — correct
    'will-scale-better': true, // not valid — wrong
  }
  expect(scoreSplit(answers)).toEqual({ answered: 3, correct: 2 })
})

test('answering yes to everything scores exactly the four real triggers', () => {
  const answers = Object.fromEntries(SPLIT_CANDIDATES.map((c) => [c.id, true]))
  expect(scoreSplit(answers)).toEqual({ answered: 6, correct: 4 })
})

test('rejecting “it will scale better” is credited, which is the row the exercise exists for', () => {
  expect(scoreSplit({ 'will-scale-better': false })).toEqual({
    answered: 1,
    correct: 1,
  })
})

test('unknown ids are ignored rather than counted', () => {
  expect(scoreSplit({ 'not-a-candidate': true })).toEqual({
    answered: 0,
    correct: 0,
  })
})

test('an empty run scores zero', () => {
  expect(scoreSplit({})).toEqual({ answered: 0, correct: 0 })
})

test('every schema line carries its SQL text, since the block is rendered from this data', () => {
  for (const l of SCHEMA_LINES) {
    expect(l.sql.length, `${l.id} has no sql`).toBeGreaterThan(0)
  }
})

test('annotated lines explain what the constraint buys, not what it says', () => {
  for (const l of SCHEMA_LINES.filter((x) => x.note)) {
    expect(l.note!.trim().length, `${l.id} note`).toBeGreaterThan(0)
  }
})

test('at least five lines are annotated, so the inspector has something to inspect', () => {
  expect(SCHEMA_LINES.filter((l) => l.note).length).toBeGreaterThanOrEqual(5)
})

test('the four constraints the doc calls out by name are all annotated', () => {
  // docs/03-architecture.md, "Design the database" names three of these (cents, CHECK, RESTRICT)
  // and :74 names the fourth (uniqueness scope). If a future
  // edit drops one, the inspector silently stops teaching the thing the prose
  // promises it teaches.
  for (const id of [
    'amount-cents',
    'status-check',
    'owner-fk',
    'unique-number',
  ]) {
    const line = SCHEMA_LINES.find((l) => l.id === id)
    expect(line, `${id} missing from the schema block`).toBeDefined()
    expect(line!.note, `${id} is not annotated`).toBeTruthy()
  }
})

test('the version and deleted_at lines each name the characteristic they trace to, since the doc’s point is that neither is a default', () => {
  const version = SCHEMA_LINES.find((l) => l.id === 'version')
  expect(version?.note, 'version is not annotated').toBeTruthy()
  expect(version!.note).toMatch(/correctness/i)

  const deleted = SCHEMA_LINES.find((l) => l.id === 'deleted-at')
  expect(deleted?.note, 'deleted_at is not annotated').toBeTruthy()
  expect(deleted!.note).toMatch(/auditability/i)
})

test('the deleted_at note names the tax it charges, because a soft delete that reads as free is the reason queries forget the filter', () => {
  const deleted = SCHEMA_LINES.find((l) => l.id === 'deleted-at')
  expect(deleted!.note).toMatch(/filter/i)
})

test('schema line ids are unique, because selection is keyed by id', () => {
  expect(new Set(SCHEMA_LINES.map((l) => l.id)).size).toBe(SCHEMA_LINES.length)
})

test('the boundary map has three modules, matching the doc’s example', () => {
  expect(BOUNDARY_MODULES).toEqual(['billing', 'clients', 'auth'])
})

test('every edge runs between declared modules, so the map cannot draw a dangling arrow', () => {
  for (const e of BOUNDARY_EDGES) {
    expect(BOUNDARY_MODULES, `${e.id} from`).toContain(e.from)
    expect(BOUNDARY_MODULES, `${e.id} to`).toContain(e.to)
  }
})

test('the boundary rule applies to writes as much as reads, so there are now two illegal edges', () => {
  const illegal = BOUNDARY_EDGES.filter((e) => !e.legal)
  expect(illegal).toHaveLength(2)
  expect(illegal.map((e) => e.id)).toContain('clients-queries-invoices')
  expect(illegal.map((e) => e.id)).toContain('clients-writes-invoices')
})

test('legality is data, not styling, so a screen reader gets the same information as a sighted reader', () => {
  for (const e of BOUNDARY_EDGES) {
    expect(typeof e.legal, `${e.id} legal`).toBe('boolean')
    expect(e.why.trim().length, `${e.id} why`).toBeGreaterThan(0)
  }
})

test('every edge names the call it represents, since that is what the reader is meant to copy', () => {
  for (const e of BOUNDARY_EDGES) {
    expect(e.call.trim().length, `${e.id} call`).toBeGreaterThan(0)
  }
})

test('the model is interrogated with six questions, because the doc added the entity-versus-event one and an app short of it teaches a retracted set', () => {
  expect(INTERROGATIONS).toHaveLength(6)
})

test('the entity-versus-event question is asked before the actor-rights one, matching the order the doc walks a reader through', () => {
  const ids = INTERROGATIONS.map((q) => q.id)
  expect(ids.indexOf('approval-event')).toBeGreaterThan(-1)
  expect(ids.indexOf('approval-event')).toBeLessThan(
    ids.indexOf('actor-rights'),
  )
})

test('an approval is judged a thing rather than a status flip, since a column holds the current value and not the act', () => {
  expect(judgeInterrogation('approval-event', 'entity').correct).toBe(true)
  expect(judgeInterrogation('approval-event', 'status').correct).toBe(false)
})

test('the entity-versus-event explanation names what a status flip throws away, because “who did it and when” is the whole test', () => {
  const { why } = judgeInterrogation('approval-event', 'status')
  expect(why).toMatch(/who did it and when/i)
})

test('the actor-rights question answers with the relationship, since a users.role column is one global answer to a question asked per team', () => {
  expect(judgeInterrogation('actor-rights', 'membership').correct).toBe(true)
  expect(judgeInterrogation('actor-rights', 'column').correct).toBe(false)
  expect(judgeInterrogation('actor-rights', 'entity').correct).toBe(false)
})

test('every interrogation offers at least two options, since a question with one answer is not a judgment', () => {
  for (const q of INTERROGATIONS) {
    expect(q.options.length, `${q.id} has too few options`).toBeGreaterThan(1)
  }
})

test('the reversibility test has three questions, which is what makes it a test rather than an instinct', () => {
  expect(REVERSIBILITY_TEST).toHaveLength(3)
})

test('the last question is the stored-data one, because the doc says it dominates the other two', () => {
  expect(REVERSIBILITY_TEST.at(-1)?.id).toBe('stored-data')
})

test('every test question explains itself, since the questions alone read as a checklist', () => {
  for (const q of REVERSIBILITY_TEST) {
    expect(q.note.trim().length, `${q.id} has no note`).toBeGreaterThan(0)
  }
})

test('the due_date line is annotated, because date versus timestamptz is one of the two lines the doc argues about', () => {
  const line = SCHEMA_LINES.find((l) => l.id === 'due-date')
  expect(line?.note?.trim().length ?? 0).toBeGreaterThan(0)
})

test('the primary-key note names the alternative it rejected, so the choice reads as a choice', () => {
  const line = SCHEMA_LINES.find((l) => l.id === 'pk')
  expect(line?.note).toMatch(/bigserial/)
})

test('every annotated line is inside the table body, since the CREATE and the closing paren have nothing to teach', () => {
  for (const line of SCHEMA_LINES) {
    if (line.note) expect(line.indent, `${line.id} is annotated`).toBe(1)
  }
})

test('the boundary map shows a write crossing a boundary, which is the half of the rule that gets forgotten', () => {
  const write = BOUNDARY_EDGES.find((e) => e.id === 'clients-writes-invoices')
  expect(write).toBeDefined()
  expect(write?.legal).toBe(false)
})

test('the map is not all-illegal or all-legal, so the shape of the call is what decides and not the pairing', () => {
  expect(BOUNDARY_EDGES.filter((e) => e.legal).length).toBeGreaterThan(0)
  expect(BOUNDARY_EDGES.filter((e) => !e.legal).length).toBeGreaterThan(1)
})

test('every edge names modules the map actually draws, since an edge to nowhere renders as a dangling line', () => {
  for (const e of BOUNDARY_EDGES) {
    expect(BOUNDARY_MODULES, `${e.id} from`).toContain(e.from)
    expect(BOUNDARY_MODULES, `${e.id} to`).toContain(e.to)
  }
})
