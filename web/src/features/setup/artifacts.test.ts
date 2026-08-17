import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { expect, test } from 'vitest'
import { ARTIFACTS } from './artifacts'

const DOC = readFileSync(
  fileURLToPath(
    new URL('../../../../docs/04-project-setup.md', import.meta.url),
  ),
  'utf8',
)

// Held character-for-character, the way `ddl-sync.test.ts` holds stage 03's
// CREATE TABLE blocks. A config block that drifts from the doc is worse than a
// drifted diagram, because the reader is meant to paste this one.
test.each(Object.values(ARTIFACTS))(
  '$filename appears in the doc exactly as the app renders it',
  (artifact) => {
    const rendered = artifact.lines.map((l) => l.text).join('\n')
    expect(DOC).toContain(rendered)
  },
)

test('every artifact marks at most one pivot line, because a step holds one judgment', () => {
  for (const a of Object.values(ARTIFACTS)) {
    expect(a.lines.filter((l) => l.pivot).length, a.id).toBeLessThanOrEqual(1)
  }
})

test('lefthook.yml keeps the wide format glob, since the narrow one is the trap the doc names', () => {
  const glob = ARTIFACTS.lefthook.lines.find((l) => l.text.includes('glob:'))
  expect(glob?.text).toContain('md')
  expect(glob?.note).toMatch(/README|wider|CI/i)
})

// Added by the controller after the implementer flagged its absence, which is
// the right way round. Every other test here iterates `Object.values`, so
// deleting five of the nine keys left the suite green and simply ran fewer
// cases — a suite that gets quieter as it loses coverage. Five steps render
// these, and a missing key is a blank panel rather than a failure.
test('all nine artifacts are present, since a suite that iterates what exists cannot miss what does not', () => {
  expect(Object.keys(ARTIFACTS).sort()).toEqual([
    'ci',
    'env',
    'envExample',
    'lefthook',
    'lint',
    'prepare',
    'prettierrc',
    'tsconfig',
    'typecheck',
  ])
})

test('the lint script carries --max-warnings 0, which is what that step is about', () => {
  const rendered = ARTIFACTS.lint.lines.map((l) => l.text).join('\n')
  expect(rendered).toContain('--max-warnings 0')
})

test('the CI workflow runs cheapest-first, because the ordering is the teaching', () => {
  const runs = ARTIFACTS.ci.lines
    .map((l) => l.text.match(/- run: pnpm (\S+)/)?.[1])
    .filter(Boolean)
  expect(runs).toEqual([
    'install',
    'format:check',
    'lint',
    'typecheck',
    'test',
    'build',
  ])
})
