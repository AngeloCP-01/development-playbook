import { expect, test } from 'vitest'
import { ENTRY_CRITERIA, LOOP_STAGES } from './loop'
import { fences, flat, h2 } from './doc-source'

/** The loop is the doc's first fenced block — a flow, not code. */
const BLOCK = fences()[0]

test("the flow block is still the doc's first fence", () => {
  expect(BLOCK).toContain('Pick the smallest shippable slice')
})

test("every stage of the loop appears in the doc's flow block", () => {
  for (const s of LOOP_STAGES) {
    expect(BLOCK, s.id).toContain(s.label)
  }
})

test('the loop has the seven stages the block draws, in order', () => {
  expect(LOOP_STAGES.map((s) => s.id)).toEqual([
    'slice',
    'test',
    'work',
    'clean',
    'pr',
    'preview',
    'ship',
  ])
})

/**
 * Five of the seven hand off to another stage, and the doc links each one. A
 * node that claims a link to a stage that does not exist would render a dead
 * end, which `source-citations.test.ts` cannot see because this is data.
 */
test('every stage slug a node links to is a real stage', async () => {
  const { STAGES } = await import('@/lib/stages')
  const slugs = new Set(STAGES.map((s) => s.slug))
  for (const s of LOOP_STAGES) {
    if (s.stage) expect(slugs, s.id).toContain(s.stage)
  }
})

test('"make it clean" is a stage of the loop, not an optional follow-up', () => {
  const clean = LOOP_STAGES.find((s) => s.id === 'clean')
  expect(clean?.detail).toMatch(/before the PR/i)
})

/**
 * N10 (coverage-walk.md): the doc's `## Entry criteria` links 04 and 02;
 * the app had flattened both to unlinked text. `ENTRY_CRITERIA` restores
 * them the way `DONE` restores its own four doc links (checklist.ts): a bare
 * stage number survives in the label, the slug that link pointed to moves to
 * its own field, and a component renders a real `<Link>` from it.
 */
const ENTRY_DOC = h2('Entry criteria').match(/^- \[ \] .+(\n {6}.+)*/gm) ?? []

test('the doc still lists two entry criteria', () => {
  expect(ENTRY_DOC).toHaveLength(2)
})

test('the app carries exactly the criteria the doc sets', () => {
  expect(ENTRY_CRITERIA).toHaveLength(ENTRY_DOC.length)
})

/**
 * Same transform as `checklist.test.ts`'s `stripLinks`, generalised to also
 * match the doc's one titled link (`[02 — Planning]`, not just a bare
 * `[06]`-style number) — only the leading digits survive, exactly as
 * `checklist.ts`'s bare-number convention already does for its own four.
 */
const LINK_PATTERN = /\[(\d+)[^\]]*\]\([^)]*\)/
const stripLinks = (s: string) => s.replace(new RegExp(LINK_PATTERN, 'g'), '$1')

test('each entry criterion is the doc bullet verbatim, not a paraphrase of it', () => {
  const doc = ENTRY_DOC.map((b) => flat(stripLinks(b.replace(/^- \[ \] /, ''))))
  expect(ENTRY_CRITERIA.map((c) => flat(c.label))).toEqual(doc)
})

test('every entry criterion links to a real stage', async () => {
  const { STAGES } = await import('@/lib/stages')
  const slugs = new Set(STAGES.map((s) => s.slug))
  for (const c of ENTRY_CRITERIA) expect(slugs, c.id).toContain(c.stage)
})

test('the first criterion points to project setup, the second to planning', () => {
  expect(ENTRY_CRITERIA.map((c) => c.stage)).toEqual([
    '04-project-setup',
    '02-planning',
  ])
})
