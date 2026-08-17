import { render } from '@testing-library/react'
import { expect, test } from 'vitest'
import { STAGES } from '@/lib/stages'
import { STAGE_CONTENT } from './stage-content'
import { STEP_IDS_BY_SLUG } from './step-ids'

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
 * fails on its ordered literal.
 *
 * The component under test comes from `STAGE_CONTENT` rather than a mapping of
 * this file's own, so what is rendered here is what the route renders. A local
 * table was the first version and a review named it a third copy of the same
 * mapping; the ids come from `step-ids.ts` for the same reason, shared with the
 * e2e sweep.
 *
 * **When a stage is ported, add it to `STEP_IDS_BY_SLUG`.** The last test fails
 * until you do, on purpose.
 */
for (const [slug, ids] of Object.entries(STEP_IDS_BY_SLUG)) {
  test(`${slug} renders a rail tab per id in STEP_IDS, in order, since the audit sweeps what it draws`, () => {
    const Component = STAGE_CONTENT[slug]
    expect(
      Component,
      `${slug} is in STEP_IDS_BY_SLUG but not STAGE_CONTENT`,
    ).toBeDefined()

    const { container } = render(<Component />)

    const rendered = [
      ...container.querySelectorAll(
        '[role="tablist"][aria-label="Stage steps"] [role="tab"][id^="tab-"]',
      ),
    ].map((tab) => tab.id.slice('tab-'.length))

    expect(rendered).toEqual([...ids])
  })
}

test('every ready stage declares a rail here, so porting one cannot skip this file', () => {
  const declared = new Set(Object.keys(STEP_IDS_BY_SLUG))
  const ready = STAGES.filter((s) => s.ready).map((s) => s.slug)

  expect(ready.filter((slug) => !declared.has(slug))).toEqual([])
})
