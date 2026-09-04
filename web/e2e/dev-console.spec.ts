import { expect, test } from '@playwright/test'
import { auditPages } from './audit-pages'

/**
 * TD-35. `audit.spec.ts`'s console check runs against a production build, where
 * React has stripped its development validation, so a whole family of real
 * defects is invisible to it: missing keys, invalid DOM nesting, `act()`
 * warnings, hydration-mismatch detail, prop-type complaints.
 *
 * `RevealList` logged *Each child in a list should have a unique "key" prop* on
 * every `pnpm dev` load of `#ai` from `1772555` to `f1a23e7`, then on
 * `#tenancy`, `#trace` and `#indexes` for the rest of that branch, while the
 * audit reported 14/14 throughout. Both times it was found by someone opening
 * the dev server for an unrelated reason, which is luck rather than process.
 *
 * Two things this had to get right. It loads *every* audited page, because what
 * let both instances survive is that every manual check loaded one page and
 * `#ai` exercises neither `header` nor `footer`. And it loads them cold: Fast
 * Refresh patching an already-open tab does not fire the warning, while a
 * settled reload fires it reliably.
 *
 * Not part of `pnpm test:e2e` and not in CI, by decision. A dev server in the
 * merge gate costs a second build and brings the overlay's noise with it. This
 * runs per stage round, the standing `pnpm test:prod` already has.
 */
const REACT_WARNING =
  /(Each child in a list|unique "key" prop|Encountered two children with the same key|validateDOMNesting|cannot appear as a descendant|cannot be a descendant|Hydration failed|Text content does(?: not|n't) match|not wrapped in act|Invalid DOM property|Received `true` for a non-boolean attribute|Warning: )/

test('@dev no React development warnings on any audited page, which the production audit cannot see at all', async ({
  browser,
}) => {
  const context = await browser.newContext()
  const page = await context.newPage()

  const warnings: string[] = []
  const other: string[] = []

  const classify = (text: string, path: string) => {
    if (REACT_WARNING.test(text)) warnings.push(`${path} ${text.slice(0, 200)}`)
    else other.push(text.slice(0, 120))
  }

  const paths = await auditPages(page)
  // A sweep that quietly visited three pages would pass for the wrong reason,
  // which is the family of defect this whole branch is closing.
  expect(paths.length).toBeGreaterThan(50)

  // React names the *rendering* component and not the defective one, so a
  // warning on its own sends you to read `Stepper` when the array is somewhere
  // else entirely. The URL is the half that locates it.
  //
  // Attached and detached per page rather than once for the run, and given a
  // settle before moving on. A single listener writing against a mutable
  // "current path" races: console events arrive asynchronously, and the first
  // version of this reported a warning against the page *after* the one that
  // emitted it. That is worse than no path at all, because it is believed.
  for (const path of paths) {
    const onConsole = (m: import('@playwright/test').ConsoleMessage) => {
      if (m.type() !== 'error' && m.type() !== 'warning') return
      classify(m.text(), path)
    }
    const onPageError = (e: Error) =>
      warnings.push(`${path} pageerror: ${e.message}`)

    page.on('console', onConsole)
    page.on('pageerror', onPageError)
    await page.goto(path, { waitUntil: 'networkidle' })
    await page.waitForTimeout(250)
    page.off('console', onConsole)
    page.off('pageerror', onPageError)
  }

  await context.close()

  // Printed, never asserted on. The pattern above was tuned against real dev
  // output rather than guessed, and this is what makes the next person's tuning
  // possible instead of speculative. A warning sitting in here that belongs in
  // `warnings` is a defect in the pattern, not in the app.
  if (other.length) {
    console.log(
      `[dev-console] ${other.length} console messages not matched as React warnings:\n` +
        [...new Set(other)].slice(0, 40).join('\n'),
    )
  }

  expect(warnings, warnings.join('\n')).toEqual([])
})
