import { expect, test } from 'vitest'
import { python } from '../lib/cheatsheets/python'
import { assertStudyDisclosures } from '../../e2e/study-disclosures'

test.each(python.sections)(
  'Python $title rejects an omitted topic or solution',
  (section) => {
    const id = section.study!.id
    const all = section.rows.flatMap((r) => [
      `sheet-python-section-${id}-subsection-${r.study!.id}`,
      ...r.study!.activityIds.map((a) => `sheet-python-activity-${a}`),
    ])
    expect(() => assertStudyDisclosures(python, id, all)).not.toThrow()
    for (const missing of all)
      expect(() =>
        assertStudyDisclosures(
          python,
          id,
          all.filter((a) => a !== missing),
        ),
      ).toThrow()
  },
)
