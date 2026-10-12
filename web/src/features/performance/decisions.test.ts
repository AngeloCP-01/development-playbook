import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { expect, test } from 'vitest'
import { BOTTLENECK_CASES, COMPARISON_CASES, QUERY_CASES } from './decisions'
import { INVENTORY_PLAN } from './artifacts'

test('the quoted SQL is the chapter artifact rather than a query the site claims to execute', () => {
  const chapter = readFileSync(
    resolve(process.cwd(), '../docs/09-performance-optimization.md'),
    'utf8',
  )
  const sql = chapter.match(/```sql\n([\s\S]*?)\n```/)?.[1]
  expect(INVENTORY_PLAN.lines.map((line) => line.text).join('\n')).toBe(sql)
})

test('every case has a selectable answer and distinct option ids, since a missing answer makes a drill unfinishable', () => {
  for (const set of [BOTTLENECK_CASES, QUERY_CASES, COMPARISON_CASES]) {
    expect(new Set(set.map((row) => row.id)).size).toBe(set.length)
    for (const row of set) {
      expect(row.options.some((option) => option.id === row.answer)).toBe(true)
      expect(new Set(row.options.map((option) => option.id)).size).toBe(
        row.options.length,
      )
    }
  }
})

test('the comparison distinguishes missing evidence, changed scope, an acceptable outcome and harmful behavior', () => {
  expect(COMPARISON_CASES.map((row) => row.answer)).toEqual([
    'observe',
    'repeat',
    'stop',
    'revert',
  ])
  for (const row of COMPARISON_CASES) {
    expect(row.comparison?.map((field) => field.field)).toEqual([
      'Outcome and observer',
      'Population',
      'Scope',
      'Window and version',
      'Completed sample',
      'Failures and timeouts',
      'User outcome and target',
      'Correctness',
    ])
  }
})

test('missing browser evidence cannot inherit an adequate completed sample or recorded attempt rates', () => {
  const item = COMPARISON_CASES.find((row) => row.id === 'internal')!
  expect(
    item.comparison?.find((row) => row.field === 'Completed sample')?.after,
  ).toBe('Browser completed count and sample limitations are not yet recorded')
  expect(
    item.comparison?.find((row) => row.field === 'Population')?.after,
  ).toBe(
    'Same planned completed-outcome duration rule; total attempts are not yet recorded',
  )
  expect(
    item.comparison?.find((row) => row.field === 'Failures and timeouts')
      ?.after,
  ).toBe(
    'Browser failure and timeout rates and attempt counts are not yet recorded',
  )
})
