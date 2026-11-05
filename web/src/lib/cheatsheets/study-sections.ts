import type { Cheatsheet, Section, SheetActivity } from './types'

export type StudySection = Section & {
  study: NonNullable<Section['study']>
  activities: SheetActivity[]
}

/** One checked traversal for the page and portable Markdown. Invalid authored
 * references fail at generation/build time rather than dropping teaching. */
export function studySections(sheet: Cheatsheet): StudySection[] | null {
  if (!sheet.sections.some((section) => section.study)) return null
  const fail = (reason: string): never => {
    throw new Error(`${sheet.slug} study: ${reason}`)
  }
  const activities = new Map<string, SheetActivity>()
  for (const activity of sheet.activities ?? []) {
    if (activities.has(activity.id)) fail(`duplicate activity ${activity.id}`)
    activities.set(activity.id, activity)
  }
  const hashes = new Set<string>()
  const assigned = new Set<string>()
  const sections = sheet.sections.map((section) => {
    const study = section.study
    if (!study) return fail('every section needs study metadata')
    if (!/^[a-z][a-z0-9-]*$/.test(study.id) || study.id === 'main')
      fail(`unsafe hash ${study.id}`)
    if (hashes.has(study.id)) fail(`duplicate hash ${study.id}`)
    hashes.add(study.id)
    const local = study.activityIds.map((id) => {
      const activity = activities.get(id)
      if (!activity) return fail(`missing activity ${id}`)
      if (assigned.has(id)) fail(`duplicate assignment ${id}`)
      assigned.add(id)
      return activity
    })
    return { ...section, study, activities: local }
  })
  if (assigned.size !== activities.size) fail('unassigned activity')
  return sections
}
