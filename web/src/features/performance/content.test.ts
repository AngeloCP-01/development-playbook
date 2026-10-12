import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { expect, test } from 'vitest'
import { getTerm } from '@/lib/terms'
import { getReferences } from '@/lib/references'
import { AI_PROMPT, COVERAGE, FIXES, TRAPS } from './content'

const chapter = () =>
  readFileSync(
    resolve(process.cwd(), '../docs/09-performance-optimization.md'),
    'utf8',
  )

test('coverage names every canonical section including bold fix and trap items', () => {
  const md = chapter()
  const headings = [...md.matchAll(/^#{2,3} (.+)$/gm)]
    .map((m) => m[1])
    .filter((name) => name !== 'The work')
  expect(Object.keys(COVERAGE)).toEqual(headings)
  const fixes = md
    .split('### The fixes that usually matter')[1]
    .split('### When not to optimize')[0]
  const titles = (text: string) =>
    [...text.matchAll(/^\*\*([^*]+)\.\*\*/gm)].map((m) =>
      m[1].replace(/`/g, ''),
    )
  expect(FIXES.map((row) => row.title)).toEqual(titles(fixes))
  expect(TRAPS.map((row) => row.title)).toEqual(titles(md.split('## Traps')[1]))
})

test('new first-encounter terms and five extending references exist in their single sources', () => {
  for (const id of [
    'lcp',
    'inp',
    'cls',
    'n-plus-one',
    'query-plan',
    'cache-invalidation',
  ]) {
    expect(getTerm(id)?.see).toBe('09-performance-optimization')
  }
  expect(
    getReferences('09-performance-optimization').map((row) => row.url),
  ).toEqual([
    'https://web.dev/articles/vitals',
    'https://web.dev/articles/lab-and-field-data-differences',
    'https://www.postgresql.org/docs/18/using-explain.html',
    'https://nextjs.org/docs/app/api-reference/directives/use-cache',
    'https://opentelemetry.io/docs/concepts/context-propagation/',
  ])
  expect(AI_PROMPT).toContain('raw evidence')
  expect(AI_PROMPT).toContain('Do not invent measurements')
})
