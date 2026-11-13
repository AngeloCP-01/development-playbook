import { expect, test } from 'vitest'
import { CHEATSHEETS, cheatsheetBySlug, isDrawn } from './index'
import { studySections } from './study-sections'

test('Python is a canonical drawn reference with exclusively owned transfer activities', () => {
  const sheet = cheatsheetBySlug('python')!
  expect(CHEATSHEETS).toHaveLength(31)
  expect(CHEATSHEETS.filter(isDrawn)).toHaveLength(29)
  expect(CHEATSHEETS.filter((s) => !isDrawn(s)).map((s) => s.slug)).toEqual([
    'java',
    'spring-boot',
  ])
  expect(sheet.stage).toBeUndefined()
  expect(sheet.sections.flatMap((s) => s.rows.map((r) => r.study!.id))).toEqual(
    [
      'execution-basics',
      'values-and-expressions',
      'control-flow',
      'binding-and-identity',
      'mutation-and-copying',
      'lifetime-and-resources',
      'sequences-and-slicing',
      'mappings-and-sets',
      'hash-and-equality',
      'collection-costs',
      'unicode-and-bytes',
      'text-parsing',
      'numeric-boundaries',
      'arguments-and-binding',
      'defaults-and-state',
      'lexical-scope',
      'closures-and-decorators',
      'iterable-and-iterator',
      'lazy-pipelines',
      'comprehensions-and-loop-tools',
      'instances-and-methods',
      'inheritance-and-composition',
      'protocols-and-special-methods',
      'dataclasses-and-typing',
      'exception-flow',
      'context-managers',
      'validation-boundaries',
      'text-files-and-paths',
      'json-and-records',
      'streaming-report',
      'imports-and-main',
      'package-layout',
      'environments-and-dependencies',
      'counting-and-grouping',
      'queues-and-heaps',
      'ordering-and-search',
      'coroutine-and-task',
      'taskgroups-and-cancellation',
      'bounded-async-work',
      'concurrency-and-parallelism',
      'shared-state-and-locks',
      'process-boundaries',
      'unit-and-boundary-tests',
      'debug-and-measure',
      'interview-capstone',
    ],
  )
  expect(sheet.activities!.filter((a) => a.solution && a.starter)).toHaveLength(
    15,
  )
  const sections = studySections(sheet)!
  expect(sections.length).toBe(sheet.sections.length)
  for (const section of sections)
    for (const { row, activities } of section.subsections!) {
      expect(activities).toHaveLength(1)
      expect(row.teaching?.some((b) => b.kind === 'table')).toBe(true)
      expect(row.teaching?.some((b) => b.kind === 'interview')).toBe(true)
    }
})
