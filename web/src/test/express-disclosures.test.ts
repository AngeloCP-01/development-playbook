import { expect, test } from 'vitest'
import { nodeExpress } from '../lib/cheatsheets/express'
import { assertStudyDisclosures } from '../../e2e/study-disclosures'

test.each(nodeExpress.sections)(
  'Express $title rejects an omitted topic or solution',
  (section) => {
    const id = section.study!.id
    const all = section.rows.flatMap((r) => [
      `sheet-express-section-${id}-subsection-${r.study!.id}`,
      ...r.study!.activityIds.map((a) => `sheet-express-activity-${a}`),
    ])
    expect(() => assertStudyDisclosures(nodeExpress, id, all)).not.toThrow()
    for (const missing of all)
      expect(() =>
        assertStudyDisclosures(
          nodeExpress,
          id,
          all.filter((a) => a !== missing),
        ),
      ).toThrow()
  },
)
