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
