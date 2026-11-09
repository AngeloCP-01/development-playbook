import type {
  Cheatsheet,
  Row,
  Section,
  SheetActivity,
  TeachingBlock,
} from './types'

export type StudySubsection = {
  row: Row & { study: NonNullable<Row['study']> }
  activities: SheetActivity[]
}
export type StudySection = Section & {
  study: NonNullable<Section['study']>
  activities: SheetActivity[]
  subsections?: StudySubsection[]
}

/** One checked traversal for the page and portable Markdown. Invalid authored
 * references fail at generation/build time rather than dropping teaching. */
export function studySections(sheet: Cheatsheet): StudySection[] | null {
  const fail = (reason: string): never => {
    throw new Error(`${sheet.slug} study: ${reason}`)
  }
  const safeId = (id: string) => /^[a-z][a-z0-9-]*$/.test(id)
  const validate = (blocks: TeachingBlock[] | undefined, ids: Set<string>) => {
    if (blocks === undefined) return
    if (!Array.isArray(blocks) || !blocks.length) fail('empty teaching blocks')
    const text = (value: unknown) => typeof value === 'string' && !!value.trim()
    for (const block of blocks) {
      if (!block || !safeId(block.id)) fail('unsafe teaching id')
      if (ids.has(block.id)) fail(`duplicate teaching id ${block.id}`)
      ids.add(block.id)
      switch (block.kind) {
        case 'paragraph':
          if (!text(block.text)) fail('blank teaching paragraph')
          break
        case 'code':
          if (!text(block.label) || !text(block.code))
            fail('blank teaching code')
          break
        case 'table':
          if (
            !text(block.label) ||
            !Array.isArray(block.columns) ||
            !block.columns.length ||
            !block.columns.every(text) ||
            !Array.isArray(block.rows) ||
            !block.rows.length ||
            !block.rows.every(
              (row) =>
                Array.isArray(row) &&
                row.length === block.columns.length &&
                row.every((cell) => typeof cell === 'string'),
            )
          )
            fail('malformed teaching table')
          break
        case 'interview':
          if (
            !text(block.question) ||
            !text(block.answer) ||
            (block.weakAnswer !== undefined && !text(block.weakAnswer)) ||
            (block.followUp !== undefined && !text(block.followUp))
          )
            fail('blank interview teaching')
          break
        default:
          fail('unknown teaching block')
      }
    }
  }
  if (!sheet.sections.some((section) => section.study)) {
    if (
      sheet.sections.some(
        (section) =>
          section.introduction !== undefined ||
          section.rows.some((row) => row.teaching !== undefined),
      )
    )
      fail('orphan teaching data')
    if (sheet.sections.some((section) => section.rows.some((row) => row.study)))
      fail('orphan subsection metadata')
    return null
  }
  const activities = new Map<string, SheetActivity>()
  for (const activity of sheet.activities ?? []) {
    if (activities.has(activity.id)) fail(`duplicate activity ${activity.id}`)
    activities.set(activity.id, activity)
  }
  const hashes = new Set<string>()
  const assigned = new Set<string>()
  const resolve = (ids: string[] | undefined): SheetActivity[] => {
    if (!Array.isArray(ids)) return fail('activityIds list required')
    return ids.map((id) => {
      const activity = activities.get(id)
      if (!activity) return fail(`missing activity ${id}`)
      if (assigned.has(id)) fail(`duplicate assignment ${id}`)
      assigned.add(id)
      return activity
    })
  }
  const sections = sheet.sections.map((section): StudySection => {
    const blockIds = new Set<string>()
    validate(section.introduction, blockIds)
    section.rows.forEach((row) => validate(row.teaching, blockIds))
    const study = section.study
    if (!study) return fail('every section needs study metadata')
    if (!safeId(study.id) || study.id === 'main')
      fail(`unsafe hash ${study.id}`)
    if (hashes.has(study.id)) fail(`duplicate hash ${study.id}`)
    hashes.add(study.id)
    if (!section.rows.some((row) => row.study))
      return { ...section, study, activities: resolve(study.activityIds) }
    if ('activityIds' in study)
      fail('conflicting section and subsection assignments')
    const ids = new Set<string>()
    const subsections = section.rows.map((row): StudySubsection => {
      if (!row.study) return fail('every row needs subsection metadata')
      if (!safeId(row.study.id)) fail(`unsafe subsection ${row.study.id}`)
      if (ids.has(row.study.id)) fail(`duplicate subsection ${row.study.id}`)
      ids.add(row.study.id)
      if (!row.study.summary?.trim()) fail('blank subsection summary')
      if (!(row.term ?? row.code)?.trim()) fail('blank subsection title')
      return {
        row: { ...row, study: row.study },
        activities: resolve(row.study.activityIds),
      }
    })
    return {
      ...section,
      study,
      subsections,
      activities: subsections.flatMap((s) => s.activities),
    }
  })
  if (assigned.size !== activities.size) fail('unassigned activity')
  return sections
}
