import { expect, test } from 'vitest'
import { DONE, ARTIFACT_ITEMS, TEAM_MOVES } from './checklist'
import { flat, h2 } from './doc-source'

const DOC_DONE =
  h2('Definition of done').match(/^- \[ \] .+(\n {6}.+)*/gm) ?? []

test('the doc still lists eleven checkboxes under Definition of done', () => {
  expect(DOC_DONE).toHaveLength(11)
})

test('the app ticks exactly the boxes the doc sets', () => {
  expect(DONE).toHaveLength(DOC_DONE.length)
})

/**
 * Four of the eleven boxes carry a markdown link to another stage —
 * `([06](06-testing.md))` and the like. `checklist.ts`'s `label` values keep
 * everything about those boxes verbatim except that syntax, which this
 * directory's `prose.test.ts` forbids in any authored string (`InlineCode`
 * does not render it, so a surviving link would reach the reader as literal
 * brackets). Stripping `[06](06-testing.md)` down to `06` removes markup, not
 * wording — this transform is applied only to the doc side of the comparison
 * below (`DONE`'s labels are already in that stripped form), so "verbatim"
 * still means what it says everywhere else.
 */
const stripLinks = (s: string) => s.replace(/\[(\d+)\]\([^)]*\)/g, '$1')

test('each done item is the doc checkbox verbatim, not a paraphrase of it', () => {
  const doc = DOC_DONE.map((b) => flat(stripLinks(b.replace(/^- \[ \] /, ''))))
  expect(DONE.map((d) => flat(d.label))).toEqual(doc)
})

test('the typecheck item keeps the reason the bare tsc form is wrong (D-25)', () => {
  const item = DONE.find((d) => d.id === 'typecheck')
  expect(flat(item!.label)).toContain('not a bare')
  expect(flat(item!.label)).toContain('stale build')
})

test('ids are slugs, not positions, because progress persists against them', () => {
  for (const d of DONE) expect(d.id, d.id).toMatch(/^[a-z0-9-]+$/)
  expect(new Set(DONE.map((d) => d.id)).size).toBe(DONE.length)
})

test('the four artifacts and four team moves are carried', () => {
  expect(ARTIFACT_ITEMS).toHaveLength(4)
  expect(TEAM_MOVES).toHaveLength(4)
})

test('every team move explains the cost of not doing it', () => {
  for (const m of TEAM_MOVES) {
    expect(m.body.trim().length, m.id).toBeGreaterThan(50)
  }
})

/**
 * The four boxes whose link `stripLinks` reduced to a bare number carry the
 * slug separately in `stage`, mirroring `LoopStage.stage` in `loop.ts`. Same
 * check as `loop.test.ts`'s: a typo'd slug fails here rather than rendering a
 * dead link later.
 */
test('every stage slug a done item links to is a real stage', async () => {
  const { STAGES } = await import('@/lib/stages')
  const slugs = new Set(STAGES.map((s) => s.slug))
  for (const d of DONE) {
    if (d.stage) expect(slugs, d.id).toContain(d.stage)
  }
})
