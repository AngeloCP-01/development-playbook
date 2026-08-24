import type { Page } from '@playwright/test'

/**
 * Disclosures inside the current step panel, in both the forms this app uses.
 *
 * `aria-expanded` covers `RevealList`, `TeamNotes` and `Term`. `aria-selected`
 * covers `AuthPaths`' inner tabs, which the old sweep never touched at all, so
 * two of its three auth panels had never been contrast-checked (TD-26). Both
 * carry `aria-controls`, which is what lets one key identify either.
 *
 * Scoped to `[role=tabpanel]` for the reason the old helper was: `Stepper` puts
 * `aria-controls` on all the rail tabs, and an unscoped selector walks the rail
 * and unmounts the panel it was about to measure. The scope was re-checked
 * rather than inherited — the only `role="tabpanel"` in the app comes from
 * `Stepper.tsx` and `AuthPaths.tsx`, and the reference sheets render no
 * disclosures, so those twelve URLs sweeping nothing is correct rather than a
 * further hole.
 */
const DISCLOSURE =
  '[role=tabpanel] button[aria-expanded], [role=tabpanel] [role=tab][aria-selected]'

type Snapshot = { all: string[]; open: string[] }

async function snapshot(page: Page): Promise<Snapshot> {
  return page.evaluate((sel) => {
    const nodes = [...document.querySelectorAll(sel)]
    const key = (n: Element) => n.getAttribute('aria-controls')
    const isOpen = (n: Element) =>
      n.getAttribute('aria-expanded') === 'true' ||
      n.getAttribute('aria-selected') === 'true'
    const keys = (list: Element[]) =>
      list.map(key).filter((k): k is string => Boolean(k))
    return { all: keys(nodes), open: keys(nodes.filter(isOpen)) }
  }, DISCLOSURE)
}

/**
 * Open as much as can be open at once.
 *
 * Re-queried between passes, because opening one accordion reveals more of
 * them, and marked, because clicking a closed control in a single-open group
 * closes its sibling and an unmarked re-query oscillates instead of
 * terminating. The pass cap is a backstop, not the exit condition.
 */
async function openWhatever(page: Page) {
  for (let pass = 0; pass < 6; pass++) {
    const opened = await page.evaluate((sel) => {
      const closed = [...document.querySelectorAll(sel)].filter(
        (n) =>
          !n.hasAttribute('data-audit-opened') &&
          (n.getAttribute('aria-expanded') === 'false' ||
            n.getAttribute('aria-selected') === 'false'),
      )
      for (const n of closed) {
        n.setAttribute('data-audit-opened', '')
        ;(n as HTMLElement).click()
      }
      return closed.length
    }, DISCLOSURE)
    if (!opened) return
    await page.waitForTimeout(60)
  }
}

/**
 * Drive the current step panel through every state in which a different set of
 * disclosures is open, awaiting `visit` in each.
 *
 * The old sweep opened everything it could in one pass and the checks measured
 * the result once. Two of TD-26's open items follow from that shape rather than
 * from any selector: a single-open accordion group cannot be exhausted, because
 * clicking one closes the last, and `AuthPaths`' tabs are the same problem
 * wearing `aria-selected`.
 *
 * So: the first state opens everything that can be open together, and after
 * that any disclosure still never seen open is clicked directly and the panel
 * visited again. A single-open group contributes one state per member that way,
 * and `AuthPaths` one per tab. The loop stops when nothing is left unobserved,
 * or when clicking something fails to change that — and the caller's property
 * is what turns the second case into a failure rather than a quiet exit.
 *
 * Known limit, stated because a silent one reads as full coverage: `all` is
 * taken from the first state, so a disclosure that only ever appears nested
 * inside a *later* state is not counted. Nothing in the app does that today.
 */
export async function forEachPanelState(
  page: Page,
  visit: () => Promise<void>,
): Promise<{ all: string[]; observed: string[] }> {
  await openWhatever(page)
  await page.waitForTimeout(150)

  const first = await snapshot(page)
  const all = first.all
  const observed = new Set(first.open)
  await visit()

  for (let round = 0; round < 40; round++) {
    const missing = all.find((key) => !observed.has(key))
    if (!missing) break

    const clicked = await page.evaluate(
      ([sel, target]) => {
        const node = [...document.querySelectorAll(sel)].find(
          (n) => n.getAttribute('aria-controls') === target,
        )
        if (!node) return false
        ;(node as HTMLElement).click()
        return true
      },
      [DISCLOSURE, missing] as const,
    )
    if (!clicked) break

    await page.waitForTimeout(120)
    const next = await snapshot(page)
    const before = observed.size
    for (const key of next.open) observed.add(key)
    await visit()

    // Clicking it did not open it. Stop rather than spin; the caller's property
    // then reports it as never observed, which is the honest outcome.
    if (observed.size === before) break
  }

  return { all, observed: [...observed] }
}
