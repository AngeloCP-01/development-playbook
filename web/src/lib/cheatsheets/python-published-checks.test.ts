import {
  chmodSync,
  existsSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs'
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

test('captures UTF-8 split across separate pipe writes without replacement characters', async () => {
  const result = await run(
    'import os, time\nos.write(1, b"\\xc3")\ntime.sleep(0.1)\nos.write(1, b"\\xa9")',
  )
  expect(result.stdout).toBe('é')
})

function sheet(code = 'print("ok")'): Cheatsheet {
  return {
    slug: 'fixture',
    title: 'Fixture',
    blurb: 'Synthetic checker fixture.',
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
  { version: '3.11.9', implementation: 'CPython', gil: true },
  { version: '3.12.16', implementation: 'PyPy', gil: true },
  { version: '3.15.2', implementation: 'CPython', gil: false },
])('rejects unsupported runtime metadata %j', async (metadata) => {
  const dir = mkdtempSync(join(tmpdir(), 'python-probe-'))
  const executable = join(dir, 'synthetic-runtime')
  // Real child process, synthetic probe metadata: exercises our acceptance policy.
  writeFileSync(
    executable,
    "#!/bin/sh\nprintf '%s' '" + JSON.stringify(metadata) + "'\n",
  )
  chmodSync(executable, 0o700)
  try {
    await expect(probePython(executable)).rejects.toThrow(/PLAYBOOK_PYTHON/)
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})
test('ignores inherited PYTHONHOME and PYTHONPATH while preserving explicit runtime selection', async () => {
  const oldHome = process.env.PYTHONHOME,
    oldPath = process.env.PYTHONPATH
  process.env.PYTHONHOME = '/no/such/home'
  process.env.PYTHONPATH = '/no/such/module/path'
  try {
    expect((await run()).stdout).toBe('ok\n')
  } finally {
    if (oldHome === undefined) delete process.env.PYTHONHOME
    else process.env.PYTHONHOME = oldHome
    if (oldPath === undefined) delete process.env.PYTHONPATH
    else process.env.PYTHONPATH = oldPath
  }
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
test('module execution preserves package-relative imports and validates the entry contract', async () => {
  const data = sheet('from .helper import value\nprint(value)')
  data.sections[0].introduction!.push({
    id: 'helper',
    kind: 'code',
    label: 'helper.py',
    code: 'value = 7',
  })
  const options = {
    sheet: data,
    files: { 'pkg/main.py': 'main', 'pkg/helper.py': 'helper' },
    entry: 'pkg/main.py',
    module: 'pkg.main',
  }
  expect((await runPythonCase(options)).stdout).toBe('7\n')
  await expect(
    runPythonCase({ ...options, module: 'pkg.helper' }),
  ).rejects.toThrow(/module.*entry/)
  await expect(
    runPythonCase({
      ...options,
      checkEntry: 'check.py',
      checks: { 'check.py': 'pass' },
    }),
  ).rejects.toThrow(/mutually exclusive/)
  await expect(
    runPythonCase({ ...options, module: undefined }),
  ).rejects.toThrow(/relative import/)
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
