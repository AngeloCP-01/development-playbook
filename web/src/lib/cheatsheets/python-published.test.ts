import { expect, test } from 'vitest'
import { python } from './python'
import { pythonCases, pythonFragments } from './python-published-cases'
import {
  assertPythonCoverage,
  probePython,
  runPythonCase,
} from './python-published-checks'

test('every displayed Python block has exactly one executable or explained fragment owner', () => {
  assertPythonCoverage(python, [
    ...pythonCases.flatMap((c) => Object.values(c.files)),
    ...pythonFragments.map((f) => f.id),
  ])
  for (const fragment of pythonFragments)
    expect(fragment.reason.length).toBeGreaterThan(15)
})
test('reports the selected runtime without silently skipping', async () => {
  const runtime = await probePython()
  console.info('Python published checks:', JSON.stringify(runtime))
  expect(runtime.implementation).toBe('CPython')
})
test.each(pythonCases)(
  'actual displayed code: $name',
  async (item) => {
    const result = await runPythonCase({ ...item, sheet: python })
    if (item.stdout !== undefined) expect(result.stdout).toBe(item.stdout)
    for (const text of item.contains ?? [])
      expect(result.stdout).toContain(text)
  },
  15000,
)
