import { expect, test } from 'vitest'
import {
  C4_LEVELS,
  FLOW_STEPS,
  PROCESSED_EVENTS_LINES,
  SKETCH_NODES,
  SYNC_ASYNC_ROWS,
} from './sketch'

// The whole return on drawing the sketch is the question it forces: for each
// box that is not yours, what happens when it is down? A node that ships with
// a description and no failure mode is the failure this component exists to
// stop, so it fails here rather than in review.
test('every external system answers what happens when it is down, which is the only reason the diagram pays for itself', () => {
  for (const n of SKETCH_NODES) {
    if (n.kind !== 'external') continue
    expect(
      n.whenDown?.trim().length ?? 0,
      `${n.id} has no failure answer`,
    ).toBeGreaterThan(0)
  }
})

test('there are three external systems, matching the three answers the doc works through', () => {
  expect(SKETCH_NODES.filter((n) => n.kind === 'external')).toHaveLength(3)
})

test('the sketch is more than the application and its database, which is the objection the section answers', () => {
  expect(SKETCH_NODES.length).toBeGreaterThan(3)
})

test('every node says what it does and how it connects, so no box is unexplained', () => {
  for (const n of SKETCH_NODES) {
    expect(n.does.trim().length, `${n.id} does`).toBeGreaterThan(0)
    expect(n.edge.trim().length, `${n.id} edge`).toBeGreaterThan(0)
  }
})

test('node ids are unique, since selection is keyed by id', () => {
  expect(new Set(SKETCH_NODES.map((n) => n.id)).size).toBe(SKETCH_NODES.length)
})

test('C4 has four levels and two of them are worth drawing, which is the advice rather than the trivia', () => {
  expect(C4_LEVELS).toHaveLength(4)
  expect(C4_LEVELS.filter((l) => l.draw)).toHaveLength(2)
})

test('the drawn levels are context and container, not the two below them', () => {
  expect(C4_LEVELS.filter((l) => l.draw).map((l) => l.id)).toEqual([
    'context',
    'container',
  ])
})

test('the flow runs five numbered steps in order, because it is drawn end to end or it is not drawn', () => {
  expect(FLOW_STEPS.map((s) => s.n)).toEqual([1, 2, 3, 4, 5])
})

test('the flow crosses both integration styles, which is what makes it the flow worth picking', () => {
  const kinds = new Set(FLOW_STEPS.map((s) => s.kind))
  expect(kinds).toContain('sync')
  expect(kinds).toContain('async')
})

test('the sync/async comparison answers four questions on both sides', () => {
  expect(SYNC_ASYNC_ROWS).toHaveLength(4)
  for (const r of SYNC_ASYNC_ROWS) {
    expect(r.sync.trim().length, `${r.id} sync`).toBeGreaterThan(0)
    expect(r.async.trim().length, `${r.id} async`).toBeGreaterThan(0)
  }
})

test('the idempotency block annotates its primary key, since that is the line doing the work', () => {
  const pk = PROCESSED_EVENTS_LINES.find((l) => l.id === 'pk')
  expect(pk?.note?.trim().length ?? 0).toBeGreaterThan(0)
})
