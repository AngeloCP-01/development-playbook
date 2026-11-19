import { expect, test } from 'vitest'
import { python } from './python'
import { pythonCases, pythonFragments } from './python-published-cases'
import {
  assertPythonCoverage,
  probePython,
  runPythonCase,
} from './python-published-checks'

test('capstone command succeeds from only its published files, including the input', async () => {
  const item = pythonCases.find(
    (c) => c.name === 'report entry and all boundary contracts',
  )!
  const result = await runPythonCase({ ...item, sheet: python, fixtures: {} })
  expect(result.stdout).toBe('hill: 0\nriver: 5\n')
})

test('capstone prefixes produce the intermediate totals shown in its walkthrough', async () => {
  const item = pythonCases.find(
    (c) => c.name === 'report entry and all boundary contracts',
  )!
  const result = await runPythonCase({
    ...item,
    sheet: python,
    args: [],
    checkEntry: 'trace.py',
    checks: {
      'trace.py':
        'import json\nfrom pathlib import Path\nfrom report import summarize\n\nlines = Path("books.jsonl").read_text(encoding="utf-8").splitlines(keepends=True)\nstates = []\nfor length in [1, 2, 3]:\n    prefix = Path("prefix.jsonl")\n    prefix.write_text("".join(lines[:length]), encoding="utf-8")\n    states.append(summarize(prefix))\nprint(json.dumps(states))',
    },
  })
  const states = JSON.parse(result.stdout) as Record<string, number>[]
  expect(states).toEqual([
    { river: 2 },
    { river: 2, hill: 0 },
    { river: 5, hill: 0 },
  ])
  const topic = python.sections
    .flatMap((section) => section.rows)
    .find((row) => row.study?.id === 'interview-capstone')!
  const trace = topic.teaching!.find(
    (block) => block.id === 'interview-capstone-trace',
  )!
  expect(trace.kind).toBe('table')
  if (trace.kind !== 'table') throw new Error('missing capstone trace table')
  const notation = (state: Record<string, number>) =>
    '{' +
    Object.entries(state)
      .map(([key, value]) => `${key}:${value}`)
      .join(', ') +
    '}'
  expect(trace.rows[0][1]).toBe(notation(states[1]))
  expect(trace.rows[1][1]).toBe(notation(states[2]))
}, 15000)

test('published package owns a direct-script failure contrast using its original files', async () => {
  const item = pythonCases.find(
    (c) => c.name === 'package-layout module context',
  )!
  const direct = item.variants?.find(
    (v) => v.module === undefined && v.exit === 1,
  )
  expect(
    direct,
    'missing direct-script contrast for the published package',
  ).toBeDefined()
  const result = await runPythonCase({ ...item, ...direct, sheet: python })
  expect(result.stdout).toBe('')
  expect(result.stderr).toContain(
    'ImportError: attempted relative import with no known parent package',
  )
})

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
