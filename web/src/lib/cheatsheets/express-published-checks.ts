import assert from 'node:assert/strict'
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { spawnSync } from 'node:child_process'
import type { Cheatsheet } from './types'
import { nodeExpress } from './express'

export function collectPublishedLocations(sheet: Cheatsheet) {
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
export function publishedCode(id: string) {
  const block = collectPublishedLocations(nodeExpress).find((b) => b.id === id)
  assert.ok(block, 'missing displayed code: ' + id)
  return block.code
}
export function runPublishedFiles(options: {
  files: Record<string, string>
  entry: string
  append?: string
  overrides?: Record<string, string>
  fixtures?: Record<string, string>
  exit?: number
}) {
  const dir = mkdtempSync(join(tmpdir(), 'node-foundations-'))
  try {
    assert.ok(
      options.entry in options.files,
      'missing entry file ' + options.entry,
    )
    for (const [file, id] of Object.entries(options.files)) {
      assert.match(file, /^[\w.-]+\.(?:cjs|mjs)$/)
      const code = options.overrides?.[id] ?? publishedCode(id)
      writeFileSync(
        join(dir, file),
        code + (file === options.entry ? (options.append ?? '') : ''),
      )
    }
    for (const [file, code] of Object.entries(options.fixtures ?? {})) {
      assert.match(file, /^[\w.-]+\.(?:cjs|mjs)$/)
      assert.ok(!(file in options.files))
      writeFileSync(join(dir, file), code)
    }
    const result = spawnSync(process.execPath, [join(dir, options.entry)], {
      encoding: 'utf8',
      timeout: 8000,
      env: { ...process.env, NODE_ENV: 'development' },
    })
    assert.ifError(result.error)
    assert.equal(result.status, options.exit ?? 0, result.stderr)
    if ((options.exit ?? 0) === 0) assert.equal(result.stderr, '')
    return { stdout: result.stdout.trim(), stderr: result.stderr }
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
}
export function assertTrace(
  lines: string[],
  labels: string[],
  edges: [string, string][],
) {
  assert.deepEqual(
    [...lines].sort(),
    [...labels].sort(),
    'each expected event occurs once',
  )
  for (const [before, after] of edges)
    assert.ok(
      lines.indexOf(before) < lines.indexOf(after),
      before + ' must precede ' + after,
    )
}
