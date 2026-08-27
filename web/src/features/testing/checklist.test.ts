import { expect, test } from 'vitest'
import { ARTIFACT_LIST, DONE, TEAM } from './checklist'
import { flat, h2 } from './doc-source'

const bullets = (s: string, marker: RegExp) =>
  s.split('\n').filter((l) => marker.test(l))

test('every definition-of-done box in the doc is carried, and no extra', () => {
  const boxes = bullets(h2('Definition of done'), /^- \[ \] /)
  expect(DONE).toHaveLength(boxes.length)
  expect(DONE.map((d) => d.label)).toEqual(
    boxes.map((b) => b.replace(/^- \[ \] /, '').trim()),
  )
})

test('the doc still has seven boxes, so a silent addition surfaces here', () => {
  expect(bullets(h2('Definition of done'), /^- \[ \] /)).toHaveLength(7)
})

test('every artifact bullet is carried verbatim', () => {
  const items = bullets(h2('Artifacts'), /^- /)
  expect(ARTIFACT_LIST).toHaveLength(items.length)
  expect(ARTIFACT_LIST).toHaveLength(4)
})

test('four team notes, each keeping the second sentence that makes it actionable', () => {
  expect(TEAM).toHaveLength(4)
  const flaky = TEAM.find((t) => t.id === 'flakiness')
  expect(flat(flaky?.body ?? '')).toMatch(
    /everyone assumes someone else owns them/i,
  )
  expect(flaky?.body).toMatch(/retry-rate dashboard/i)
  const docs = TEAM.find((t) => t.id === 'documentation')
  expect(docs?.body).toMatch(/how a new engineer learns intended behavior/i)
  expect(docs?.body).toMatch(
    /sentences describing the behavior, not `?test1`?/i,
  )
})

test('ids are unique across all three lists', () => {
  const ids = [...DONE.map((d) => d.id), ...TEAM.map((t) => t.id)]
  expect(new Set(ids).size).toBe(ids.length)
})

/**
 * Finding 6 of Task 14's coverage walk: the "Require tests in review" note's
 * `(07)` was a bare, dead number while 04, 05 and 14 render as real links
 * elsewhere in this stage. `stage` mirrors `DoneItem.stage` in stage 05's
 * `checklist.ts` — a slug held beside the label so a component can render a
 * real cross-reference instead of scraping the bare number back into one.
 */
test('the review-requirement note points at a real stage', async () => {
  const { STAGES } = await import('@/lib/stages')
  const note = TEAM.find((t) => t.id === 'require-tests')
  expect(note?.stage).toBe('07-code-review')
  expect(STAGES.map((s) => s.slug)).toContain(note?.stage)
})
