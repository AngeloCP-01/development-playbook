import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { expect, test } from 'vitest'

const path = fileURLToPath(
  new URL('../../../docs/09-performance-optimization.md', import.meta.url),
)
const doc = () => readFileSync(path, 'utf8')

function section(md: string, heading: string): string {
  const start = md.indexOf('### ' + heading + '\n')
  expect(start, 'missing ' + heading).not.toBe(-1)
  const rest = md.slice(start)
  const next = rest.indexOf('\n### ', 1)
  const top = rest.indexOf('\n## ', 1)
  const end = [next, top].filter((n) => n !== -1).sort((a, b) => a - b)[0]
  return end === undefined ? rest : rest.slice(0, end)
}

test('the first optimization step defines a comparable order-flow baseline', () => {
  const md = doc()
  const map = md.indexOf('### Map the order journey')
  const baseline = md.indexOf('### Measure the first baseline')
  const fixes = md.indexOf('### The fixes that usually matter')
  expect(map).toBeGreaterThan(-1)
  expect(baseline).toBeGreaterThan(map)
  expect(fixes).toBeGreaterThan(baseline)
  const first = section(md, 'Measure the first baseline')
  for (const field of [
    'outcome',
    'metric',
    'window',
    'sample',
    'segment',
    'deployment',
    'cache',
  ]) {
    expect(first.toLowerCase()).toContain(field)
  }
  expect(first).toMatch(/too few|insufficient|too sparse/i)
  expect(first).toMatch(/controlled/i)
})

test('order response, payment, and consumers have separate clocks', () => {
  const map = section(doc(), 'Map the order journey')
  expect(map).toMatch(/request.+response/s)
  expect(map).toMatch(/webhook.+paid/s)
  expect(map).toContain('OrderPaid')
  for (const consumer of ['inventory', 'logistics', 'notification']) {
    expect(map.toLowerCase()).toContain(consumer)
  }
  expect(map).toMatch(/branch|fan.out/i)
  expect(map).toMatch(/provider.+wait|payment.+wait/i)
})

test('the worked order fix is chosen from evidence and retested at the user boundary', () => {
  const md = doc()
  const diagnosis = section(md, 'Find the real bottleneck')
  expect(diagnosis).toContain('Illustrative example')
  expect(diagnosis).toContain('20-item cart')
  expect(diagnosis).toMatch(/21.+quer(y|ies)/s)
  expect(diagnosis).toMatch(/batch/i)
  expect(diagnosis).toMatch(/alternative|instead/i)
  expect(diagnosis).toMatch(/before.+after/is)
  expect(diagnosis).toContain(
    '| Outcome | Place order → response | Same outcome |',
  )
  expect(diagnosis).toMatch(/production/i)
  expect(diagnosis).toMatch(/correctness/i)
  expect(diagnosis).not.toContain('The database is usually the answer.')
})

test('a query plan is a diagnosis of one query, not the order-flow result', () => {
  const diagnosis = section(doc(), 'Find the real bottleneck')
  expect(diagnosis).toContain('EXPLAIN (ANALYZE, BUFFERS)')
  expect(diagnosis).toMatch(/single query|one query/i)
  expect(diagnosis).toMatch(/not.+p95/i)
  expect(diagnosis).toMatch(/sequential scan.+cheaper/is)
  expect(diagnosis).not.toContain(
    'Seq Scan` on a large table means a missing index.',
  )
})

test('fixes remain hypotheses and indexing advice respects plan and write cost', () => {
  const md = doc()
  expect(md).toContain('### AI in performance optimization')
  expect(md).toMatch(/index.+write cost/is)
  expect(md).toMatch(/CONCURRENTLY.+transaction/is)
  expect(md).toMatch(/invalid index/i)
  expect(md).toMatch(/updateTag.+Server Action/is)
  expect(md).toMatch(/bundle analyzer/i)
  expect(md).toMatch(/LCP.+eager/is)
  expect(md).not.toContain('Every column you filter or sort by')
  expect(md).not.toContain('Indexes exist for every filtered and sorted column')
  expect(md).not.toContain('Anything at low traffic.')
  expect(md).not.toContain('pnpm build   # review the route-level output')
})

test('completion is tied to the selected outcome and includes correctness', () => {
  const md = doc()
  const done = md.split('## Definition of done')[1]?.split('\n## ')[0] ?? ''
  expect(done).toMatch(/same outcome/i)
  expect(done).toMatch(/before and after/i)
  expect(done).toMatch(/sample/i)
  expect(done).toMatch(/production|field/i)
  expect(done).toMatch(/correctness|tests/i)
})
