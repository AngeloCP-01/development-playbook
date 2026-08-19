import { expect, test } from 'vitest'
import { h2 } from './doc-source'
import { TRAPS } from './traps'

const SECTION = h2('Traps')

/** Each trap opens with its whole title bolded on its own line. */
const DOC_TRAPS = SECTION.match(/^\*\*.+?\*\*/gm) ?? []

// A regex matching nothing would pass the count test against an empty array,
// so pin the match itself before pinning its length.
test('the doc-counting regex matches trap headings, not prose and not nothing', () => {
  expect(DOC_TRAPS.length).toBeGreaterThan(0)
  expect(DOC_TRAPS[0]).toBe('**Long-lived branches.**')
  expect(DOC_TRAPS.at(-1)).toBe('**Commit messages that describe the diff.**')
})

test('the app renders exactly the traps the doc lists', () => {
  expect(TRAPS).toHaveLength(8)
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
