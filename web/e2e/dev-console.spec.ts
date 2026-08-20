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

/**
 * One known warning, tracked as **TD-43**, pinned so the rest of the sweep can
 * be green without covering for it.
 *
 * Missing key at `/stages/03-architecture#traps`, deterministic across five
 * fresh-context runs and absent from `04-project-setup#traps` and
 * `05-development#traps`. It fires during the hash-driven React update rather
 * than the initial paint, and it survives replacing the entire traps panel
 * content with a stub, so it is not that panel's markup. Pre-existing: found by
 * this spec on its first honest run, not introduced by the branch that added it.
 *
 * **The entry retires itself.** The assertion below requires it to still fire.
 * Fix TD-43 and this test goes red telling you to delete the entry, which is
 * the difference between a tracked exception and a check that cannot fail. An
 * allowlist nobody is forced to revisit is how a gate becomes decoration, and
 * that is the whole subject of the round this spec shipped in.
 */
const KNOWN = {
  path: '/stages/03-architecture#traps',
  pattern: /Each child in a list should have a unique "key" prop/,
  debt: 'TD-43',
}

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

  const known = warnings.filter(
    (w) => w.startsWith(KNOWN.path) && KNOWN.pattern.test(w),
  )
  const unknown = warnings.filter((w) => !known.includes(w))

  expect(unknown, unknown.join('\n')).toEqual([])

  // Fails when TD-43 is fixed, on purpose. See the KNOWN docblock.
  expect(
    known.length,
    `${KNOWN.debt} no longer reproduces at ${KNOWN.path}. That is good news: ` +
      `delete the KNOWN entry in this file and close ${KNOWN.debt}.`,
  ).toBeGreaterThan(0)
})
