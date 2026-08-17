import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { expect, test } from 'vitest'
import { TRAPS } from './traps'

const DOC = readFileSync(
  fileURLToPath(
    new URL('../../../../docs/04-project-setup.md', import.meta.url),
  ),
  'utf8',
)

/**
 * The body of one `## ` section, up to the next `## `.
 *
 * `DOC.indexOf('## Traps')` — the obvious form, and the one the plan proposed —
 * is wrong for this doc. §7 refers to the section in running prose as
 * "the `## Traps` entry", so `indexOf` lands ~215 lines early and the slice
 * swallows §8's and §9's bold lead-ins. That form counts nine traps. The doc
 * has seven. Anchoring the heading to its own line is the fix.
 */
function h2(heading: string): string {
  const match = new RegExp(`^## ${heading}$`, 'm').exec(DOC)
  if (!match) throw new Error(`no section "## ${heading}" in the doc`)
  const rest = DOC.slice(match.index + match[0].length)
  const end = rest.search(/^## /m)
  return end === -1 ? rest : rest.slice(0, end)
}

const SECTION = h2('Traps')

/** Each trap opens with its whole title bolded on its own line. */
const DOC_TRAPS = SECTION.match(/^\*\*.+?\*\*/gm) ?? []

// A regex matching nothing would pass the count test against an empty array,
// so pin the match itself before pinning its length.
test('the doc-counting regex matches trap headings, not prose and not nothing', () => {
  expect(DOC_TRAPS.length).toBeGreaterThan(0)
  expect(DOC_TRAPS[0]).toBe('**Adding CI later.**')
  expect(DOC_TRAPS.at(-1)).toBe('**Perfecting the scaffold.**')
})

// The unanchored slice is a live hazard, not a hypothetical: it is what the
// plan specified. Hold the difference so nobody "simplifies" h2 back to it.
test('the unanchored indexOf slice overcounts, which is why h2 anchors the heading', () => {
  const naive =
    DOC.slice(DOC.indexOf('## Traps')).match(/^\*\*.+?\.\*\*/gm) ?? []
  expect(naive.length).toBeGreaterThan(DOC_TRAPS.length)
})

test('the app renders exactly the traps the doc lists', () => {
  expect(TRAPS).toHaveLength(DOC_TRAPS.length)
})

test('each trap keeps the doc title it was extracted from, so the count cannot be met by padding', () => {
  const titles = DOC_TRAPS.map((b) => b.replace(/\*\*/g, ''))
  expect(TRAPS.map((t) => t.title)).toEqual(titles)
})

test('ids are unique, because the traps panel keys on them', () => {
  const ids = TRAPS.map((t) => t.id)
  expect(new Set(ids).size).toBe(ids.length)
})

test('every trap explains the cost rather than restating its own title', () => {
  for (const trap of TRAPS) {
    expect(trap.body.trim().length, trap.id).toBeGreaterThan(60)
    expect(trap.body.trim()).not.toBe(trap.title.trim())
  }
})
