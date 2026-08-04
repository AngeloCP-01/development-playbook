import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { expect, test } from 'vitest'

/**
 * The whole-branch review's M6: nothing guarded the harness itself. Delete the
 * `dom` project from `vitest.config.ts` and `pnpm test` reports a green 313 —
 * every render test stops running and no gate says so. Delete `setupFiles` and
 * it stays green too, because today each `.test.tsx` holds few enough tests
 * that `cleanup` never has to do anything.
 *
 * That is the shape this branch's own closing argument names: a capability with
 * no rule attached is what D-38 was, and D-52 had to replace it. So the config
 * is asserted rather than assumed.
 *
 * This lives in the `unit` project on purpose — it reads a file, it does not
 * render — and it is the one test in the repo whose subject is the test setup.
 */

const config = readFileSync(
  fileURLToPath(new URL('../../vitest.config.ts', import.meta.url)),
  'utf8',
)

test('both vitest projects are still configured, since deleting the dom project makes every render test vanish into a green run', () => {
  expect(config, 'the unit project is gone').toMatch(/name:\s*'unit'/)
  expect(config, 'the dom project is gone').toMatch(/name:\s*'dom'/)
})

test('the dom project still runs jsdom and still loads the cleanup setup, because losing either fails as a passing suite rather than as an error', () => {
  expect(config, 'jsdom is no longer the dom environment').toMatch(
    /environment:\s*'jsdom'/,
  )
  expect(config, 'the cleanup setup file is not loaded').toMatch(
    /setupFiles:\s*\['\.\/src\/test\/setup\.ts'\]/,
  )
})

// `extends: true` is the line that carries the root `resolve.alias` into each
// project. Without it every `@/…` import fails — which is at least loud, unlike
// the two above. It is asserted anyway because the failure is remote from the
// cause: the error names a component's import, not the config.
test('each project extends the root config, which is what carries the @/* alias into it', () => {
  // Line-anchored: the comment above the projects array says the words
  // "extends: true" too, and counting that occurrence made this assert 3.
  const extendsCount = [...config.matchAll(/^\s*extends: true,$/gm)].length
  expect(extendsCount, 'a project is not extending the root').toBe(2)
})

// The globs are the mechanism: the file extension picks the environment, and a
// test file matching neither project runs nowhere and reports nothing.
test('the two include globs stay disjoint and cover both extensions, since a file matching neither is a test that silently does not run', () => {
  expect(config).toMatch(/include:\s*\['src\/\*\*\/\*\.test\.ts'\]/)
  expect(config).toMatch(/include:\s*\['src\/\*\*\/\*\.test\.tsx'\]/)
})
