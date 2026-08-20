import { readFileSync, statSync } from 'node:fs'
import { dirname, join } from 'node:path'
import type { FullConfig } from '@playwright/test'
import { checkBuildFreshness } from '../src/test/build-freshness'

/**
 * Runs before the suite measures anything, so a stale server fails loudly
 * instead of producing numbers about a tree that no longer exists (TD-27).
 *
 * Two things here were established by running rather than by reasoning, and
 * both would have been wrong the other way.
 *
 * Playwright starts `webServer` *before* `globalSetup`, so the fetch below has
 * something to talk to. That was probed with a throwaway setup that only logged
 * a status; the design had assumed it and an assumption would have been a
 * plausible way to get a connection error that looks like a stale server.
 *
 * And `import.meta.url` is not available here: Playwright loads this file as
 * CJS, so the first version failed with *Cannot use 'import.meta' outside a
 * module*. `config.configFile` is the shipped way to find the project root and
 * does not care how the module was loaded.
 *
 * Under CI `reuseExistingServer` is already false, so the build is always fresh
 * and this always passes. That makes CI the place this check is least useful
 * and the place it is most likely to be mistaken for coverage. It earns its
 * keep locally or not at all, and both halves were teeth-checked locally
 * against genuinely stale servers before either was believed.
 */
export default async function globalSetup(config: FullConfig) {
  const webRoot = config.configFile ? dirname(config.configFile) : process.cwd()

  const buildIdPath = join(webRoot, '.next', 'BUILD_ID')
  const buildId = readFileSync(buildIdPath, 'utf8').trim()
  const buildIdMtimeMs = statSync(buildIdPath).mtimeMs

  const html = await (await fetch('http://localhost:3100/')).text()

  const problem = checkBuildFreshness({
    html,
    buildId,
    buildIdMtimeMs,
    // App source only. `e2e/` and `playwright.config.ts` were in this list
    // until the check fired on an edit to `audit.spec.ts` — a false positive,
    // because a spec runs from source and does not need a rebuild to be
    // current. A gate that cries wolf is a gate people learn to re-run past,
    // which is how it would end up as decoration.
    roots: [
      join(webRoot, 'src'),
      join(webRoot, 'public'),
      join(webRoot, 'next.config.ts'),
      join(webRoot, 'postcss.config.mjs'),
      join(webRoot, 'tsconfig.json'),
      join(webRoot, 'package.json'),
    ],
  })

  if (problem) throw new Error(problem)
}
