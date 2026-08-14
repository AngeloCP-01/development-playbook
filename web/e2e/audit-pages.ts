import type { Page } from '@playwright/test'
import { STAGES } from '../src/lib/stages'

/**
 * The URLs the audit sweeps, derived rather than listed (TD-12).
 *
 * This used to be a thirty-six line array in `audit.spec.ts`, extended by hand
 * every time a stage shipped — six hashes for stage 02, thirteen more during
 * stage 03's reshape. Its failure mode was silent in the direction that
 * mattered: a stage could go `ready: true` and simply never appear in the
 * list, and the suite would report green while never having loaded it. A
 * *dead* hash failed loudly; a *missing* one audited nothing.
 *
 * So the list now comes from two places that cannot fall behind:
 *
 * - which stages to sweep, from `STAGES.filter(s => s.ready)` — the same flag
 *   the router uses to decide whether a stage renders content at all
 * - which steps each has, from the rail it actually renders
 *
 * The trade this makes, stated because it is real: the sweep now follows what
 * the app renders, so a step deleted by accident leaves the sweep silently
 * rather than failing it. That direction is `steps.ts`'s job where a stage has
 * one — stage 03 types its `Step[]` against `STEP_IDS`, so an id that exists
 * nowhere is a compile error. Nothing guards it for stages 01 and 02, and that
 * gap is recorded as debt rather than papered over here.
 */

/**
 * `Stepper` renders one tab per step with `id="tab-<stepId>"`, inside the rail's
 * own `role="tablist"`. The selector is scoped to that tablist rather than the
 * document: `AuthPaths` already renders `role="tab"` with `auth-tab-*` ids, and
 * misses `[id^="tab-"]` only by the prefix anchor. An in-panel tablist that ids
 * its tabs `tab-*` would otherwise inject phantom steps into the sweep.
 */
const TAB_ID_PREFIX = 'tab-'

/**
 * The step ids a stage's rail actually renders, in rail order.
 *
 * Throws when a stage renders none. That is not defensive padding: `ready:
 * true` with no rail means the stage is live and broken, and returning an
 * empty list would drop it from the sweep without failing anything — the exact
 * shape of the bug this derivation exists to prevent.
 */
export async function readStepIds(page: Page, slug: string): Promise<string[]> {
  await page.goto(`/stages/${slug}`, { waitUntil: 'networkidle' })

  const ids = await page.$$eval(
    '[role="tablist"][aria-label="Stage steps"] [role="tab"][id^="tab-"]',
    (tabs, prefix) => tabs.map((tab) => tab.id.slice(prefix.length)),
    TAB_ID_PREFIX,
  )

  if (ids.length === 0) {
    throw new Error(
      `${slug} is ready: true but renders no steps. Either it is missing from ` +
        `STAGE_CONTENT, or its Stepper rendered nothing — both mean a live ` +
        `stage the audit would otherwise skip in silence.`,
    )
  }

  return ids
}

let cached: string[] | null = null

/**
 * Every URL the audit sweeps: the home page, then one hash per step of every
 * ready stage.
 *
 * Cached across tests in a run. The derivation costs one page load per ready
 * stage, and six loops in `audit.spec.ts` call this; paying that once keeps
 * the suite's runtime where it was.
 */
export async function auditPages(page: Page): Promise<string[]> {
  if (cached) return cached

  const paths = ['/']

  for (const stage of STAGES.filter((s) => s.ready)) {
    const ids = await readStepIds(page, stage.slug)
    paths.push(...ids.map((id) => `/stages/${stage.slug}#${id}`))
  }

  cached = paths
  return paths
}
