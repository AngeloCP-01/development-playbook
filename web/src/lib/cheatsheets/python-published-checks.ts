// Test-only POSIX checker. Never import this module from production content.
import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import type { Cheatsheet } from './types'

export function collectPythonLocations(sheet: Cheatsheet) {
  return sheet.sections
    .flatMap((s) => [
      ...(s.introduction ?? []).flatMap((b) =>
        b.kind === 'code'
          ? [{ id: b.id, code: b.code, location: s.study!.id }]
          : [],
      ),
      ...s.rows.flatMap((r) => [
        ...(r.teaching ?? []).flatMap((b) =>
          b.kind === 'code'
            ? [{ id: b.id, code: b.code, location: r.study!.id }]
            : [],
        ),
        ...(r.example ?? []).map((b, i) => ({
          id: r.study!.id + '-row-example-' + i,
          code: b.code,
          location: r.study!.id,
        })),
      ]),
    ])
    .concat(
      (sheet.activities ?? []).flatMap((a) => [
        ...(a.starter
          ? [{ id: a.id + '-starter', code: a.starter.code, location: a.id }]
          : []),
        ...(a.solution
          ? [{ id: a.id + '-solution', code: a.solution.code, location: a.id }]
          : []),
      ]),
    )
}
export function assertPythonCoverage(sheet: Cheatsheet, ids: string[]) {
  const displayed = collectPythonLocations(sheet).map((b) => b.id)
  assert.equal(
    new Set(displayed).size,
    displayed.length,
    'duplicate displayed ID',
  )
  assert.equal(new Set(ids).size, ids.length, 'duplicate classification')
  for (const id of displayed)
    assert.ok(ids.includes(id), 'unclassified displayed code: ' + id)
  for (const id of ids)
    assert.ok(displayed.includes(id), 'stale classification: ' + id)
}
export type PythonRuntime = {
  executable: string
  version: string
  implementation: string
  build: string
  platform: string
  gil: boolean
}
export type PythonRun = {
  stdout: string
  stderr: string
  status: number | null
  runtime: PythonRuntime
}
export type PythonCase = {
  sheet: Cheatsheet
  files: Record<string, string>
  entry: string
  fixtures?: Record<string, string>
  checks?: Record<string, string>
  checkEntry?: string
  args?: string[]
  exit?: number
  stderr?: RegExp
  module?: string
  executable?: string
}
const pause = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
async function execute(executable: string, args: string[], cwd?: string) {
  assert.ok(
    process.platform === 'darwin' || process.platform === 'linux',
    'Python checker supports POSIX macOS/Linux hosts',
  )
  const child = spawn(executable, ['-E', '-s', '-B', ...args], {
    cwd,
    shell: false,
    detached: true,
    stdio: ['ignore', 'pipe', 'pipe'],
    env: { ...process.env },
  })
  const stdout: Buffer[] = [],
    stderr: Buffer[] = []
  const closed = new Promise<void>((resolve) =>
    child.once('close', () => resolve()),
  )
  let bytes = 0
  let status: number | null = null
  let failure: Error | undefined
  let timer: ReturnType<typeof setTimeout> | undefined
  const signal = (kind: NodeJS.Signals) => {
    if (!child.pid) return
    try {
      process.kill(-child.pid, kind)
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'ESRCH') throw error
    }
  }
  try {
    status = await new Promise<number | null>((resolve, reject) => {
      const stop = (error: Error) => {
        if (!failure) {
          failure = error
          reject(error)
        }
      }
      timer = setTimeout(
        () => stop(new Error('Python case timeout (8 seconds)')),
        8000,
      )
      child.once('error', (error) =>
        stop(
          new Error(
            'Cannot launch Python; set PLAYBOOK_PYTHON to a provisioned CPython 3.12+ executable: ' +
              error.message,
          ),
        ),
      )
      child.stdout.on('data', (chunk: Buffer) => {
        bytes += chunk.length
        if (bytes > 1024 * 1024) stop(new Error('Python output exceeds 1 MiB'))
        else stdout.push(chunk)
      })
      child.stderr.on('data', (chunk: Buffer) => {
        bytes += chunk.length
        if (bytes > 1024 * 1024) stop(new Error('Python output exceeds 1 MiB'))
        else stderr.push(chunk)
      })
      // exit, not close: a descendant may retain inherited output descriptors.
      child.once('exit', (code) => resolve(code))
    })
  } finally {
    if (timer) clearTimeout(timer)
    signal('SIGTERM')
    let groupAlive = false
    if (child.pid) {
      try {
        process.kill(-child.pid, 0)
        groupAlive = true
      } catch {}
    }
    if (groupAlive) {
      await pause(1000)
      signal('SIGKILL')
    }
    if (child.exitCode === null && child.signalCode === null && child.pid)
      await new Promise<void>((resolve) => child.once('exit', () => resolve()))
    await closed
  }
  if (failure) throw failure
  return {
    stdout: Buffer.concat(stdout).toString('utf8'),
    stderr: Buffer.concat(stderr).toString('utf8'),
    status,
  }
}
export async function probePython(
  executable: string = process.env.PLAYBOOK_PYTHON ?? 'python3',
): Promise<PythonRuntime> {
  const result = await execute(executable, [
    '-c',
    'import sys,platform,json; print(json.dumps(dict(executable=sys.executable,version=platform.python_version(),implementation=platform.python_implementation(),build=sys.version,platform=platform.platform(),gil=getattr(sys,"_is_gil_enabled",lambda: True)())))',
  ])
  let runtime: PythonRuntime
  try {
    runtime = JSON.parse(result.stdout) as PythonRuntime
  } catch {
    throw new Error(
      'Expected CPython metadata; set PLAYBOOK_PYTHON to CPython 3.12+',
    )
  }
  const [major, minor] = runtime.version.split('.').map(Number)
  assert.ok(
    result.status === 0 &&
      result.stderr === '' &&
      runtime.implementation === 'CPython' &&
      major === 3 &&
      minor >= 12 &&
      runtime.gil,
    'Unsupported runtime; set PLAYBOOK_PYTHON to conventional GIL-enabled CPython 3.12+',
  )
  return runtime
}
function safePath(path: string) {
  assert.ok(
    /^[\w.-]+(?:\/[\w.-]+)*$/.test(path) &&
      path.split('/').every((p) => p !== '.' && p !== '..'),
    'unsafe path: ' + path,
  )
}
export async function runPythonCase(options: PythonCase): Promise<PythonRun> {
  assert.ok(
    options.entry in options.files,
    'missing entry file: ' + options.entry,
  )
  assert.ok(
    !options.module || !options.checkEntry,
    'module and checkEntry are mutually exclusive',
  )
  if (options.module) {
    assert.match(
      options.module,
      /^[a-zA-Z_]\w*(?:\.[a-zA-Z_]\w*)*$/,
      'unsafe module name',
    )
    assert.equal(
      options.module.replaceAll('.', '/') + '.py',
      options.entry,
      'module must match entry',
    )
  }
  if (options.checkEntry)
    assert.ok(
      options.checkEntry in (options.checks ?? {}),
      'missing check entry',
    )
  assert.ok(
    (options.exit ?? 0) === 0 || options.stderr,
    'intentional failure requires expected stderr',
  )
  const locations = collectPythonLocations(options.sheet)
  assert.equal(
    new Set(locations.map((b) => b.id)).size,
    locations.length,
    'duplicate displayed ID',
  )
  const materialized: Record<string, string> = {}
  for (const [file, id] of Object.entries(options.files)) {
    const block = locations.find((b) => b.id === id)
    assert.ok(block, 'unknown displayed ID: ' + id)
    materialized[file] = block.code
  }
  for (const group of [options.fixtures ?? {}, options.checks ?? {}])
    for (const [file, code] of Object.entries(group)) {
      assert.ok(!(file in materialized), 'path collision: ' + file)
      materialized[file] = code
    }
  const paths = Object.keys(materialized)
  for (const path of paths) {
    safePath(path)
    assert.ok(
      !paths.some((other) => other.startsWith(path + '/')),
      'path collision: ' + path,
    )
  }
  const runtime = await probePython(options.executable)
  const dir = await mkdtemp(join(tmpdir(), 'python-published-'))
  try {
    for (const [file, code] of Object.entries(materialized)) {
      await mkdir(dirname(join(dir, file)), { recursive: true })
      await writeFile(join(dir, file), code)
    }
    const result = await execute(
      runtime.executable,
      [
        ...(options.module
          ? ['-m', options.module]
          : [options.checkEntry ?? options.entry]),
        ...(options.args ?? []),
      ],
      dir,
    )
    assert.equal(
      result.status,
      options.exit ?? 0,
      'unexpected Python exit: ' + result.stderr,
    )
    if (options.stderr)
      assert.match(result.stderr, options.stderr, 'unexpected Python stderr')
    else assert.equal(result.stderr, '', 'unexpected Python stderr')
    return { ...result, runtime }
  } finally {
    await rm(dir, { recursive: true, force: true })
  }
}
