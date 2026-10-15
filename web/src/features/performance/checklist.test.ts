import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { expect, test } from 'vitest'
import { DONE, TEAM, ARTIFACTS } from './checklist'

test('completion checks are the canonical chapter checks rather than an index-by-reflex list', () => {
  const chapter = readFileSync(
    resolve(process.cwd(), '../docs/09-performance-optimization.md'),
    'utf8',
  )
  const done = chapter.split('## Definition of done')[1].split('---')[0]
  expect(DONE.map((row) => row.text)).toEqual(
    [...done.matchAll(/^- \[ \] (.+)$/gm)].map((match) => match[1]),
  )
  expect(ARTIFACTS).toHaveLength(4)
  expect(TEAM.map((row) => row.id)).toEqual([
    'targets',
    'budget',
    'plans',
    'owner',
  ])
})
