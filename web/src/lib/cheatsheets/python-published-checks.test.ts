import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { expect, test } from 'vitest'
import type { Cheatsheet } from './types'
import {
  collectPythonLocations,
  probePython,
  runPythonCase,
  assertPythonCoverage,
} from './python-published-checks'

function sheet(code = 'print("ok")'): Cheatsheet {
  return {
    slug: 'fixture',
    title: 'Fixture',
    group: 'Languages',
    sections: [
      {
        title: 'Fixture',
        study: { id: 'fixture', label: 'Fixture', hint: 'Fixture' },
        introduction: [{ id: 'main', kind: 'code', label: 'main.py', code }],
        rows: [],
      },
    ],
  }
}
const run = (code = 'print("ok")', extra = {}) =>
  runPythonCase({
    sheet: sheet(code),
    files: { 'main.py': 'main' },
    entry: 'main.py',
    ...extra,
  })

test('collector includes introductions, legacy examples and both practice surfaces', () => {
  const data = sheet()
  data.sections[0].rows.push({
    what: 'x',
    study: { id: 'row', summary: 'x', activityIds: ['act'] },
    teaching: [{ id: 'worked', kind: 'code', label: 'x', code: 'pass' }],
    example: [{ label: 'legacy', code: 'pass' }],
  })
  data.activities = [
    {
      id: 'act',
      title: 'x',
      prompt: 'x',
      context: 'x',
      answer: 'x',
      explanation: 'x',
      starter: { label: 'x', code: 'pass' },
      solution: { label: 'x', code: 'pass' },
    },
  ]
  expect(collectPythonLocations(data).map((b) => b.id)).toEqual([
    'main',
    'worked',
    'row-row-example-0',
    'act-starter',
    'act-solution',
  ])
})
test('coverage rejects omitted, duplicate and stale classification', () => {
  expect(() => assertPythonCoverage(sheet(), [])).toThrow(/unclassified.*main/)
  expect(() => assertPythonCoverage(sheet(), ['main', 'main'])).toThrow(
    /duplicate/,
  )
  expect(() => assertPythonCoverage(sheet(), ['main', 'old'])).toThrow(
    /stale.*old/,
  )
  expect(() => assertPythonCoverage(sheet(), ['main'])).not.toThrow()
})
test('missing or incompatible runtime fails actionably', async () => {
  await expect(probePython('/no/such/python')).rejects.toThrow(
    /PLAYBOOK_PYTHON/,
  )
  await expect(probePython('/usr/bin/true')).rejects.toThrow(/CPython/)
})
test.each([
  { entry: 'missing.py' },
  { files: { 'main.py': 'unknown' } },
  { files: { '../main.py': 'main' }, entry: '../main.py' },
  { fixtures: { 'main.py': 'pass' } },
  { checks: { '/tmp/escape.py': 'pass' } },
  { fixtures: { pkg: 'x', 'pkg/child.py': 'pass' } },
])('rejects invalid file ownership before executing: %j', async (extra) => {
  await expect(run(undefined, extra)).rejects.toThrow(
    /entry|displayed|path|collision/,
  )
})
test('executes displayed sibling imports without inherited Python configuration', async () => {
  const data = sheet('from nested.helper import value\nprint(value)')
  data.sections[0].introduction!.push({
    id: 'helper',
    kind: 'code',
    label: 'helper.py',
    code: 'value = 42',
  })
  const result = await runPythonCase({
    sheet: data,
    files: { 'main.py': 'main', 'nested/helper.py': 'helper' },
    entry: 'main.py',
  })
  expect(result.stdout.trim()).toBe('42')
  expect(result.runtime.implementation).toBe('CPython')
  expect(result.runtime.version).toMatch(/^3\./)
})
test('matches status and specified error, rejecting accidental failures and warnings', async () => {
  await expect(run('raise ValueError("intended")')).rejects.toThrow(/exit/)
  await expect(
    run('import sys\nprint("noise", file=sys.stderr)'),
  ).rejects.toThrow(/stderr/)
  await expect(
    run('raise TypeError("other")', {
      exit: 1,
      stderr: /ValueError: intended/,
    }),
  ).rejects.toThrow(/stderr/)
  const result = await run('raise ValueError("intended")', {
    exit: 1,
    stderr: /ValueError: intended/,
  })
  expect(result.stderr).toContain('ValueError: intended')
  await expect(
    run('raise ValueError("intended")', { exit: 1 }),
  ).rejects.toThrow(/expected.*stderr/)
})
// Killing only the parent, leaking cwd, or ignoring output bounds breaks these.
test.each(['timeout', 'overflow', 'failure'] as const)(
  'cleans descendant and cwd after %s using a handshake',
  async (mode) => {
    const witness = mkdtempSync(join(tmpdir(), 'python-witness-'))
    const path = join(witness, 'state')
    const end =
      mode === 'overflow'
        ? 'print("x" * (2 * 1024 * 1024), flush=True)\ntime.sleep(60)'
        : mode === 'failure'
          ? 'raise ValueError("failure")'
          : 'time.sleep(60)'
    const code =
      `import subprocess, sys, os, time, json\nfrom pathlib import Path\nchild = subprocess.Popen([sys.executable, "-c", "import signal,time; signal.signal(signal.SIGTERM, signal.SIG_IGN); print('ready', flush=True); time.sleep(60)"], stdout=subprocess.PIPE, text=True)\nassert child.stdout.readline().strip() == "ready"\nPath(sys.argv[1]).write_text(json.dumps([child.pid, os.getcwd()]))\n` +
      end
    try {
      await expect(run(code, { args: [path] })).rejects.toThrow(
        mode === 'timeout'
          ? /timeout/
          : mode === 'overflow'
            ? /output/
            : /exit/,
      )
      const [pid, cwd] = JSON.parse(readFileSync(path, 'utf8')) as [
        number,
        string,
      ]
      expect(existsSync(cwd)).toBe(false)
      let alive = true
      for (let i = 0; i < 30 && alive; i++) {
        try {
          process.kill(pid, 0)
          await new Promise((resolve) => setTimeout(resolve, 20))
        } catch {
          alive = false
        }
      }
      expect(alive).toBe(false)
    } finally {
      rmSync(witness, { recursive: true, force: true })
    }
  },
  15000,
)
