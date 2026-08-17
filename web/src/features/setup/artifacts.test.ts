import { expect, test } from 'vitest'
import { ARTIFACTS } from './artifacts'
import { fences } from './doc-source'

const FENCES = fences()

// Held character-for-character, the way `ddl-sync.test.ts` holds stage 03's
// CREATE TABLE blocks. A config block that drifts from the doc is worse than a
// drifted diagram, because the reader is meant to paste this one.
//
// This compared with `toContain` until a review demonstrated it could not see
// a truncated artifact — a substring of a doc block is still contained by it,
// so dropping the last line stayed green. That is not a hypothetical line: the
// `env` artifact's last line is `export const env = schema.parse(process.env)`,
// which is the line §5 exists for, and deleting it passed. The plan specified
// `toContain` while citing `ddl-sync.test.ts` in this very comment, and
// ddl-sync extracts the block and compares it with `toBe`.
//
// So the block is matched whole. `id` rather than `$filename` in the title
// because three of the nine are `package.json` fragments and a failing run that
// names the same file three times says less than it could.
test.each(Object.entries(ARTIFACTS))(
  '%s is one whole fenced block of the doc, not a slice of one',
  (id, artifact) => {
    const rendered = artifact.lines.map((l) => l.text).join('\n')

    // Array containment, so the comparison against each candidate is equality
    // rather than substring. Matching a fence by its opening line first was the
    // obvious shape and it is wrong here — four of the nine open with `{`.
    expect(FENCES, id).toContain(rendered)
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
test('all nineteen artifacts are present, since a suite that iterates what exists cannot miss what does not', () => {
  expect(Object.keys(ARTIFACTS).sort()).toEqual([
    'boomRoute',
    'catFile',
    'ci',
    'enginesJson',
    'env',
    'envExample',
    'formatScripts',
    'lefthook',
    'lint',
    'npmrc',
    'nvmrc',
    'prepare',
    'prettierignore',
    'prettierrc',
    'repoCmd',
    'scaffoldCmd',
    'testScript',
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
