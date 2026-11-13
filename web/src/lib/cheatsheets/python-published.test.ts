import { expect, test } from 'vitest'
import { python } from './python'
import { pythonCases, pythonFragments } from './python-published-cases'
import {
  assertPythonCoverage,
  probePython,
  runPythonCase,
} from './python-published-checks'

test.each([
  [
    'mutation-and-copying-practice-solution',
    'return deepcopy(report)',
    'return report.copy()',
  ],
  [
    'lazy-pipelines-practice-solution',
    'for line in lines:\n        yield int(line)',
    'return iter([int(line) for line in lines])',
  ],
  ['context-managers-practice-solution', 'handle.close()', 'pass'],
])(
  'published oracle rejects the consequential mutant in %s',
  async (id, before, after) => {
    const mutant = structuredClone(python)
    const activity = mutant.activities!.find((a) => a.id + '-solution' === id)!
    expect(activity.solution!.code).toContain(before)
    activity.solution!.code = activity.solution!.code.replace(before, after)
    const owner = pythonCases.find((c) => Object.values(c.files).includes(id))!
    await expect(runPythonCase({ ...owner, sheet: mutant })).rejects.toThrow(
      /Python exit/,
    )
  },
  15000,
)

test('every displayed Python block has exactly one executable or explained fragment owner', () => {
  for (const item of pythonCases) {
    for (const id of item.owns ?? Object.values(item.files))
      expect(Object.values(item.files)).toContain(id)
  }
  assertPythonCoverage(python, [
    ...pythonCases.flatMap((c) => c.owns ?? Object.values(c.files)),
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
    for (const variant of item.variants ?? []) {
      const run = await runPythonCase({ ...item, ...variant, sheet: python })
      if (variant.stdout !== undefined) expect(run.stdout).toBe(variant.stdout)
    }
  },
  15000,
)
