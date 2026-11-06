import type { Cheatsheet, Row, Section, SheetActivity } from './types'

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
  if (!sheet.sections.some((section) => section.study)) {
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
  const safeId = (id: string) => /^[a-z][a-z0-9-]*$/.test(id)
  const sections = sheet.sections.map((section): StudySection => {
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
