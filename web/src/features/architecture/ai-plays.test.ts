import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { expect, test } from 'vitest'
import { AI_MISLEADS, AI_PLAYS, AI_TOOLS } from './ai-plays'
import { EXPAND_CONTRACT_STEPS } from './evolve'

// The plan's brief says eleven plays, from `docs/stage-03-status.md`'s note
// that the doc grew four after the port. The doc has nine. The port has seven,
// all nine of the doc's contain all seven, and the two it lacks are the
// failure-mode enumeration and the expand-contract ordering — the second of
// which only exists because the doc grew section 9, which this round ported in
// Task 7. So: two plays and one mislead, not four and one. Counted rather than
// trusted, and pinned here so the next reader does not have to re-count.
test('nine plays are carried, which is what the doc actually has rather than what the brief said', () => {
  expect(AI_PLAYS).toHaveLength(9)
})

test('six misleads are carried, the half the doc says is worth reading twice', () => {
  expect(AI_MISLEADS).toHaveLength(6)
})

test('the two plays the port was missing are present, since a stale set teaches a stage that no longer exists', () => {
  const ids = AI_PLAYS.map((p) => p.id)
  expect(ids).toContain('failure-modes')
  expect(ids).toContain('expand-contract-order')
})

test('the resilience-layer mislead is present, because it is the reach-for-distribution failure wearing clothes the stage now teaches', () => {
  expect(AI_MISLEADS.map((m) => m.id)).toContain('resilience-layer')
})

test('play and mislead ids do not collide, since both render in one panel', () => {
  const ids = [...AI_PLAYS, ...AI_MISLEADS].map((x) => x.id)
  expect(new Set(ids).size).toBe(ids.length)
})

test('every entry states a claim and explains it, so neither list is a row of headlines', () => {
  for (const e of [...AI_PLAYS, ...AI_MISLEADS]) {
    expect(e.claim.trim().length, `${e.id} claim`).toBeGreaterThan(0)
    expect(e.body.trim().length, `${e.id} body`).toBeGreaterThan(40)
  }
})

// A play without the judgment half reads as an instruction to delegate the
// decision, which is the one thing this stage will not do. `youJudge` is
// optional rather than required on purpose: the doc states it for five of the
// nine, and inventing it for the other four would be writing playbook content
// under cover of porting it (D-51). These five are the doc's own.
test('the plays where the doc names the judgment half carry it, since that half is what stops a play being a delegation', () => {
  const withJudgment = [
    'options',
    'reversibility',
    'characteristics',
    'failure-modes',
    'expand-contract-order',
  ]
  for (const id of withJudgment) {
    const play = AI_PLAYS.find((p) => p.id === id)
    expect(
      play?.youJudge?.trim().length ?? 0,
      `${id} youJudge`,
    ).toBeGreaterThan(0)
  }
})

// An alternation of three loose fragments passed on "It never drops a step, so
// the old value is safe" — the opposite claim. The play has to name the step by
// number, say what the step does, and say that the model drops it; and the
// number is checked against the sequence rather than typed twice, so renumbering
// `EXPAND_CONTRACT_STEPS` fails here instead of leaving the play pointing at the
// wrong step.
test('the expand-contract play names the step the model drops, which is the whole reason to check its order', () => {
  const stop = EXPAND_CONTRACT_STEPS.find((s) =>
    /stop writing the old/i.test(s.what),
  )
  expect(
    stop,
    'the sequence has a stop-writing-the-old-column step',
  ).toBeDefined()

  const play = AI_PLAYS.find((p) => p.id === 'expand-contract-order')
  expect(play?.youJudge, 'named by number').toMatch(
    new RegExp(`step ${stop!.n}\\b`, 'i'),
  )
  expect(
    play?.youJudge,
    'and by what it does, since a number alone is not checkable',
  ).toMatch(/stops writing the old value/i)
  expect(
    play?.youJudge,
    'the play warns that a step goes missing, it does not reassure that none does',
  ).toMatch(/(tends to|often|likely to|will) drop/i)
})

test('the three named tools survive the move out of the component', () => {
  expect(AI_TOOLS.map((t) => t.name)).toEqual([
    'context7',
    'claude-mem',
    'A git worktree or sandbox',
  ])
})

// D-35 says every stage carries an "AI plays" section, and this stage's doc had
// to have one written before the app could mirror it. If the doc's two lists
// change again, the counts above are the thing that goes stale — so they are
// checked against the doc rather than only against themselves.
test('the counts match the doc, so a doc that grows another play fails here rather than drifting quietly', () => {
  const md = readFileSync(
    fileURLToPath(
      new URL('../../../../docs/03-architecture.md', import.meta.url),
    ),
    'utf8',
  )
  const section = md.slice(md.indexOf('### AI in architecture'))
  const helps = section.slice(
    section.indexOf('Where it earns its place'),
    section.indexOf('Where it misleads'),
  )
  const misleads = section.slice(
    section.indexOf('Where it misleads'),
    section.indexOf('The tools worth naming'),
  )
  const bullets = (s: string) => (s.match(/^- \*\*/gm) ?? []).length
  expect(bullets(helps), 'plays in the doc').toBe(AI_PLAYS.length)
  expect(bullets(misleads), 'misleads in the doc').toBe(AI_MISLEADS.length)
})

// Order is not load-bearing the way the expand-contract sequence's is, but
// drift in it is a tell that the port and the doc have stopped being read
// together. The two new plays were appended on first write, which put the
// schema pair before them and did not match the doc; this is what caught it.
test('the plays are in the doc’s order, since a port that reorders quietly is a port nobody re-read', () => {
  const md = readFileSync(
    fileURLToPath(
      new URL('../../../../docs/03-architecture.md', import.meta.url),
    ),
    'utf8',
  )
  const section = md.slice(
    md.indexOf('Where it earns its place'),
    md.indexOf('Where it misleads'),
  )
  const titles = [...section.matchAll(/^- \*\*(.+?)\*\*/gm)].map((m) =>
    m[1].replace(/[’']/g, "'").replace(/\.$/, ''),
  )
  expect(AI_PLAYS.map((p) => p.claim.replace(/[’']/g, "'"))).toEqual(titles)
})
