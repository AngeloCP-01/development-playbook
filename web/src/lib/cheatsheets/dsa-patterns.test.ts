import { expect, test } from 'vitest'
import { dsaPatterns } from './dsa-patterns'
import { CHEATSHEETS, CHEATSHEET_GROUPS, isDrawn } from './index'
import { studySections } from './study-sections'

test('all fifteen mechanisms have credited practice, unique ownership and stable hashes', () => {
  const core = [
    'hash-complements',
    'two-pointers',
    'sliding-window',
    'prefix-sums',
    'binary-search',
    'interval-sweep',
    'monotonic-stack',
    'top-k-heap',
    'fast-slow',
    'tree-dfs',
    'graph-traversal',
    'topological-order',
    'backtracking',
    'dynamic-programming',
    'greedy',
  ]
  const rows = dsaPatterns.sections.flatMap((s) => s.rows)
  expect(
    rows.filter((r) => core.includes(r.study!.id)).map((r) => r.study!.id),
  ).toEqual(core)
  expect(studySections(dsaPatterns)).toHaveLength(8)
  expect(dsaPatterns.activities).toHaveLength(18)
  for (const id of core) {
    const row = rows.find((r) => r.study!.id === id)!
    expect(row.teaching!.find((b) => b.id === id + '-solution')?.kind).toBe(
      'code',
    )
    expect(row.teaching!.some((b) => b.kind === 'table')).toBe(true)
    expect(row.teaching!.some((b) => b.kind === 'interview')).toBe(true)
    const activity = dsaPatterns.activities!.find(
      (a) => a.id === id + '-practice',
    )!
    expect(
      dsaPatterns.additionalSources!.some((s) =>
        activity.context.includes(s.url!),
      ),
    ).toBe(true)
  }
  expect(CHEATSHEETS).toHaveLength(31)
  expect(CHEATSHEETS.filter(isDrawn)).toHaveLength(28)
  expect(CHEATSHEET_GROUPS.at(-1)).toBe('Algorithms')
  expect(dsaPatterns.stage).toBeUndefined()
})
