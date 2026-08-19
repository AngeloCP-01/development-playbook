import { expect, test } from 'vitest'
import { docSource } from './doc-source'

const four = docSource('docs/04-project-setup.md')
const five = docSource('docs/05-development.md')

test('reads a doc by a repo-root-relative path', () => {
  expect(four.DOC).toContain('# 04. Project Setup')
  expect(five.DOC).toContain('# 05. Development')
})

test('two sources are independent, so a second stage cannot read the first', () => {
  expect(five.DOC).not.toContain('# 04. Project Setup')
})

/**
 * The bug this helper exists to prevent, held rather than described. An
 * unanchored `indexOf('## Traps')` matches stage 04's §7 prose two hundred
 * lines early; `h2` anchors the heading to its own line.
 */
test('h2 anchors the heading rather than finding the first mention', () => {
  const anchored = four.h2('Traps')
  const naive = four.DOC.slice(four.DOC.indexOf('## Traps'))
  expect(naive.length).toBeGreaterThan(anchored.length)
})

test('a section is bounded at the next heading of the same level or higher', () => {
  expect(five.section('Vertical slices')).not.toContain('Server Components')
})

/**
 * Never `^#{1,…}`: a single hash and a space is a shell comment, and both docs
 * are full of fenced bash blocks that open with one.
 */
test('a fenced shell comment does not end a section', () => {
  expect(five.section('Keep the feedback loop running')).toContain('pnpm dev')
})

test('fences returns whole blocks with the markers stripped', () => {
  const blocks = five.fences()
  expect(blocks).toHaveLength(14)
  expect(
    blocks.some((b) => b.startsWith('// src/app/(app)/invoices/page.tsx')),
  ).toBe(true)
  expect(blocks.every((b) => !b.includes('```'))).toBe(true)
})

test('flat collapses a hard-wrapped quote so a re-wrap does not redden a test', () => {
  expect(five.flat('a\n  b   c')).toBe('a b c')
})

test('an unknown heading throws rather than returning an empty slice', () => {
  expect(() => five.section('Nope')).toThrow(/no level-3 section/)
})
