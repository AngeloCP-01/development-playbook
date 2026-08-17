import { render } from '@testing-library/react'
import { expect, test } from 'vitest'
import { STAGES } from '@/lib/stages'
import { STAGE_CONTENT } from './stage-content'
import { ProductDiscovery } from './discovery/ProductDiscovery'
import { Planning } from './planning/Planning'
import { Architecture } from './architecture/Architecture'
import { STEP_IDS as DISCOVERY_IDS } from './discovery/steps'
import { STEP_IDS as PLANNING_IDS } from './planning/steps'
import { STEP_IDS as ARCHITECTURE_IDS } from './architecture/steps'

/**
 * The half of TD-36 that a `STEP_IDS` tuple cannot close on its own.
 *
 * Typing each stage's `STEPS` array as `(Step & { id: StepId })[]` makes an id
 * that exists nowhere a compile error. It says nothing about a step *deleted*,
 * which is the direction TD-36's title names — and a review proved the gap by
 * removing a whole step object from `ProductDiscovery.tsx`: typecheck clean,
 * 385 tests green, and the audit sweep one URL shorter in silence, because
 * `e2e/audit-pages.ts` derives that sweep from the rendered rail.
 *
 * So the rail is compared against the tuple here, where the tuple stops being
 * a list nothing reads and becomes the count. Delete a step from a component
 * and this fails; delete it from both and the stage's own `steps.test.ts`
 * fails on the literal.
 *
 * **When a stage is ported, add it to `RAILS`.** The last test fails until you
 * do, on purpose — it is the same argument as the sweep's own derivation, one
 * level up: a stage that goes ready without an entry here would otherwise be
 * unguarded and nothing would say so.
 */
const RAILS = [
  {
    slug: '01-product-discovery',
    Component: ProductDiscovery,
    ids: DISCOVERY_IDS,
  },
  { slug: '02-planning', Component: Planning, ids: PLANNING_IDS },
  { slug: '03-architecture', Component: Architecture, ids: ARCHITECTURE_IDS },
] as const

for (const { slug, Component, ids } of RAILS) {
  test(`${slug} renders a rail tab per id in STEP_IDS, in order, since the audit sweeps what it draws`, () => {
    const { container } = render(<Component />)

    const rendered = [
      ...container.querySelectorAll(
        '[role="tablist"][aria-label="Stage steps"] [role="tab"][id^="tab-"]',
      ),
    ].map((tab) => tab.id.slice('tab-'.length))

    expect(rendered).toEqual([...ids])
  })
}

test('every ready stage has a rail guarded here, so porting one cannot skip this file', () => {
  const guarded = new Set<string>(RAILS.map((r) => r.slug))
  const ready = STAGES.filter((s) => s.ready).map((s) => s.slug)

  // Registered-but-not-ready would be the other half of the same mistake.
  expect(ready.filter((slug) => !guarded.has(slug))).toEqual([])
  expect(ready.sort()).toEqual(Object.keys(STAGE_CONTENT).sort())
})
