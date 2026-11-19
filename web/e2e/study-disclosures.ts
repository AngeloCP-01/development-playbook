import assert from 'node:assert/strict'
import type { Cheatsheet } from '../src/lib/cheatsheets/types'

export function assertStudyDisclosures(
  sheet: Cheatsheet,
  sectionId: string,
  observed: string[],
) {
  const section = sheet.sections.find((s) => s.study?.id === sectionId)
  assert.ok(section, `unknown section ${sectionId}`)
  const expected = section.rows.flatMap((r) => [
    `sheet-${sheet.slug}-section-${sectionId}-subsection-${r.study!.id}`,
    ...r.study!.activityIds.map((id) => `sheet-${sheet.slug}-activity-${id}`),
  ])
  assert.deepEqual([...observed].sort(), expected.sort())
}
