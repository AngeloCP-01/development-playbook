import { expect, test } from 'vitest'
import { runInNewContext } from 'node:vm'
import { dsaPatterns } from './dsa-patterns'

const code = dsaPatterns.sections
  .flatMap((s) => s.rows.flatMap((r) => r.teaching ?? []))
  .filter((b) => b.kind === 'code')
  .map((b) => b.code)
  .join('\n')
function call(name: string, ...args: unknown[]) {
  return runInNewContext(
    `${code}\n${name}(...args)`,
    { args },
    { timeout: 2000 },
  )
}
function arrays(n: number): number[][] {
  return n === 0
    ? [[]]
    : arrays(n - 1).flatMap((a) => [-1, 0, 1].map((x) => [...a, x]))
}
function pairCheck(a: number[], target: number, name: string) {
  const exists = a.some((x, i) => a.some((y, j) => i !== j && x + y === target))
  const result = call(name, a, target)
  if (!exists) expect(result).toBeNull()
  else {
    expect(result).toHaveLength(2)
    expect(result[0]).not.toBe(result[1])
    expect(a[result[0]] + a[result[1]]).toBe(target)
  }
}
test('published scans match independent exhaustive range/pair oracles and preserve arrays', () => {
  for (let n = 0; n <= 4; n++)
    for (const a of arrays(n)) {
      const original = [...a],
        sorted = [...a].sort((x, y) => x - y)
      let longest = 0
      for (let i = 0; i < a.length; i++)
        for (let j = i + 1; j <= a.length; j++)
          if (new Set(a.slice(i, j)).size === j - i)
            longest = Math.max(longest, j - i)
      expect(call('longestDistinct', a)).toBe(longest)
      const prefix = call('buildPrefix', a)
      for (let i = 0; i <= a.length; i++)
        for (let j = i; j <= a.length; j++)
          expect(call('rangeSum', prefix, i, j)).toBe(
            a.slice(i, j).reduce((s, x) => s + x, 0),
          )
      for (const target of [-2, 0, 2]) {
        pairCheck(a, target, 'findPair')
        pairCheck(sorted, target, 'findSortedPair')
        let count = 0
        for (let i = 0; i < a.length; i++)
          for (let j = i + 1; j <= a.length; j++)
            if (a.slice(i, j).reduce((s, x) => s + x, 0) === target) count++
        expect(call('countTargetRanges', a, target)).toBe(count)
        const index = sorted.findIndex((x) => x >= target)
        expect(call('lowerBound', sorted, target)).toBe(
          index < 0 ? sorted.length : index,
        )
      }
      expect(call('previousSmaller', a)).toEqual(
        a.map((x, i) => {
          for (let j = i - 1; j >= 0; j--) if (a[j] < x) return j
          return -1
        }),
      )
      for (let k = 0; k <= n + 1; k++)
        expect(call('kthLargest', a, k)).toBe(
          k < 1 || k > n ? null : sorted[n - k],
        )
      expect(a).toEqual(original)
    }
}, 60000)
test('interval sweep and greedy match occupancy and subset oracles', () => {
  const pool = [
    [0, 1],
    [1, 2],
    [0, 2],
    [2, 3],
    [1, 3],
  ]
  for (let mask = 0; mask < 1 << pool.length; mask++) {
    const a = pool.filter((_, i) => (mask >> i) & 1),
      before = JSON.stringify(a)
    expect(call('peakGuests', a)).toBe(
      Math.max(
        0,
        ...[0, 1, 2].map((t) => a.filter(([s, e]) => s <= t && t < e).length),
      ),
    )
    let best = 0
    for (let sub = 0; sub < 1 << a.length; sub++) {
      const chosen = a.filter((_, i) => (sub >> i) & 1)
      if (
        chosen.every(([s, e], i) =>
          chosen.every(([s2, e2], j) => i === j || e <= s2 || e2 <= s),
        )
      )
        best = Math.max(best, chosen.length)
    }
    expect(call('maxCompatible', a)).toBe(best)
    expect(JSON.stringify(a)).toBe(before)
  }
})
test('node identity, null and deep iterative structures', () => {
  expect(call('hasCycle', null)).toBe(false)
  const a = { value: 1, next: null as unknown }
  a.next = a
  expect(call('hasCycle', a)).toBe(true)
  expect(call('hasCycle', { value: 1, next: { value: 1, next: null } })).toBe(
    false,
  )
  expect(call('treeSize', null)).toBe(0)
  let root: unknown = null
  for (let i = 0; i < 10000; i++) root = { value: i, left: root, right: null }
  expect(call('treeSizeIterative', root)).toBe(10000)
  expect(
    call('treeSize', {
      value: 1,
      left: { value: 2, left: null, right: null },
      right: null,
    }),
  ).toBe(2)
})
function permutations(a: number[]): number[][] {
  return a.length
    ? a.flatMap((x, i) =>
        permutations(a.filter((_, j) => i !== j)).map((p) => [x, ...p]),
      )
    : [[]]
}
test('all small directed graphs: independent ordering oracle, valid minimum BFS paths', () => {
  for (let mask = 0; mask < 512; mask++) {
    const adj = Array.from({ length: 3 }, (_, v) =>
      [0, 1, 2].filter((w) => (mask >> (v * 3 + w)) & 1),
    )
    const valid = (order: number[]) =>
      adj.every((edges, v) =>
        edges.every((w) => order.indexOf(v) < order.indexOf(w)),
      )
    const exists = permutations([0, 1, 2]).some(valid),
      order = call('topologicalOrder', adj)
    if (!exists) expect(order).toBeNull()
    else {
      expect(new Set(order).size).toBe(3)
      expect(valid(order)).toBe(true)
    }
    for (let start = 0; start < 3; start++)
      for (let goal = 0; goal < 3; goal++) {
        const routes = permutations([0, 1, 2])
          .flatMap((p) => [p.slice(0, 1), p.slice(0, 2), p])
          .filter(
            (p) =>
              p[0] === start &&
              p.at(-1) === goal &&
              p.slice(1).every((v, i) => adj[p[i]].includes(v)),
          )
        const path = call('shortestPath', adj, start, goal)
        if (!routes.length) expect(path).toBeNull()
        else {
          expect(path.length).toBe(Math.min(...routes.map((p) => p.length)))
          expect(path[0]).toBe(start)
          expect(path.at(-1)).toBe(goal)
          expect(
            path
              .slice(1)
              .every((v: number, i: number) => adj[path[i]].includes(v)),
          ).toBe(true)
        }
      }
  }
  expect(call('countComponents', [[1], [0], []])).toBe(2)
  const deep = Array.from({ length: 10000 }, (_, i) =>
    i < 9999 ? [i + 1] : [],
  )
  expect(call('shortestPath', deep, 0, 9999)).toHaveLength(10000)
  expect(call('topologicalOrder', deep)).toHaveLength(10000)
}, 60000)
test('enumeration uniqueness and minimum coins match independent search', () => {
  for (const text of ['', 'a', 'aab', 'abca']) {
    const expected = new Set(
      permutations([...text].map((_, i) => i)).map((p) =>
        p.map((i) => text[i]).join(''),
      ),
    )
    const result = call('uniquePermutations', text)
    expect(new Set(result)).toEqual(expected)
    expect(result.length).toBe(expected.size)
  }
  for (const coins of [[], [2], [1, 3, 4], [2, 5]])
    for (let amount = 0; amount < 15; amount++) {
      let layer = new Set([0]),
        answer = -1
      for (let count = 0; count <= amount; count++) {
        if (layer.has(amount)) {
          answer = count
          break
        }
        layer = new Set(
          [...layer].flatMap((x) =>
            coins.map((c) => c + x).filter((x) => x <= amount),
          ),
        )
      }
      expect(call('minCoins', coins, amount)).toBe(answer)
    }
})

test('all local coding solutions are the executed published functions', () => {
  for (const activity of dsaPatterns.activities!.filter((a) => a.solution)) {
    expect(code).toContain(activity.solution!.code)
    expect(() => runInNewContext(activity.solution!.code)).not.toThrow()
  }
  expect(call('total', [2, -1, 3])).toBe(4)
  const deep = Array.from({ length: 10000 }, (_, i) => [
    ...(i ? [i - 1] : []),
    ...(i < 9999 ? [i + 1] : []),
  ])
  expect(call('countComponents', deep)).toBe(1)
  expect(call('countComponents', [])).toBe(0)
})

test('equal-height corruption disagrees with the independent strict-smaller expectation', () => {
  const corrupted = code.replace('>= values[i]', '> values[i]')
  expect(corrupted).not.toBe(code)
  const actual = runInNewContext(corrupted + '\npreviousSmaller([2,2])')
  expect(() => expect(actual).toEqual([-1, -1])).toThrow()
})
