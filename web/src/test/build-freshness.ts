import { readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

/**
 * TD-27. `playwright.config.ts` sets `reuseExistingServer: !process.env.CI`
 * against a `pnpm build && pnpm start` command, so the first run of a session
 * builds and every run after it reuses that server without rebuilding. A
 * session that runs the suite after each of eight tasks measures the first
 * task's build eight times, and the failure is silent and green: the suite
 * passes, the numbers look plausible, and they describe a tree that no longer
 * exists. It cost the doc-gaps round two panels sitting over D-52's limit for
 * five tasks while the gate called them passing.
 *
 * Reusing a server is what makes local iteration bearable, so the fix is not to
 * stop reusing it. It is to notice.
 *
 * Two questions, because either one alone leaves a hole. *Is this the build on
 * disk?* catches a `pnpm start` someone left running by hand, which no config
 * flag can see. *Is that build newer than the source?* catches the actual TD-27
 * failure, where nothing rebuilt because the server was already up.
 *
 * Pure on purpose: everything here takes a path or a string and returns a
 * value, so it is unit-testable without a browser or a build.
 */

type Newest = { path: string; mtimeMs: number }

/**
 * Directories whose mtimes say nothing about the working tree.
 *
 * `.next` is excluded because it *is* the build. Including it would make the
 * comparison compare the build against itself and pass every time, which is the
 * defect class this module was written to close.
 */
const IGNORED = new Set([
  '.next',
  'node_modules',
  'test-results',
  'playwright-report',
  '.turbo',
  '.git',
])

export function newestSourceMtime(roots: string[]): Newest | null {
  let newest: Newest | null = null

  const consider = (path: string, mtimeMs: number) => {
    if (newest === null || mtimeMs > newest.mtimeMs) newest = { path, mtimeMs }
  }

  const walk = (dir: string) => {
    let entries
    try {
      entries = readdirSync(dir, { withFileTypes: true })
    } catch {
      return
    }
    for (const entry of entries) {
      if (IGNORED.has(entry.name)) continue
      const full = join(dir, entry.name)
      if (entry.isDirectory()) walk(full)
      else if (entry.isFile()) consider(full, statSync(full).mtimeMs)
    }
  }

  for (const root of roots) {
    let stat
    try {
      stat = statSync(root)
    } catch {
      continue
    }
    if (stat.isDirectory()) walk(root)
    else consider(root, stat.mtimeMs)
  }

  return newest
}

/**
 * Next puts the build id in the RSC flight payload as `"b":"<id>"`. Asserting
 * containment rather than parsing that shape keeps this working when the
 * payload changes; the parse below exists only for the error message.
 */
export function servedCarriesBuildId(html: string, buildId: string): boolean {
  return html.includes(buildId)
}

/** Best effort, for the failure message only. Never gate on this. */
export function hintServedBuildId(html: string): string | null {
  const m = html.match(/\\?"b\\?":\\?"([A-Za-z0-9_-]{8,})\\?"/)
  return m ? m[1] : null
}

export function checkBuildFreshness(opts: {
  html: string
  buildId: string
  buildIdMtimeMs: number
  roots: string[]
}): string | null {
  if (!servedCarriesBuildId(opts.html, opts.buildId)) {
    const served = hintServedBuildId(opts.html) ?? 'unknown'
    return (
      `The server on this port is not serving the build in .next. ` +
      `.next/BUILD_ID is "${opts.buildId}"; the served page carries "${served}". ` +
      `Something else is listening, most likely a "pnpm start" left running from ` +
      `an earlier build. Kill it and let the suite start its own.`
    )
  }

  const newest = newestSourceMtime(opts.roots)
  if (newest && newest.mtimeMs > opts.buildIdMtimeMs) {
    return (
      `The served build predates the working tree (TD-27). ${newest.path} is ` +
      `newer than .next/BUILD_ID, so this run would measure an earlier build ` +
      `and report plausible numbers about a tree that no longer exists. Stop ` +
      `the reused server on this port and run again, or run "pnpm build" first.`
    )
  }

  return null
}
