import { getStage } from '@/lib/stages'
import { sheetSources } from './sheet-sources'
import { studySections } from './study-sections'
import { CHEATSHEETS, cheatsheetsByGroup } from './index'
import {
  CHEATSHEET_GROUPS,
  isDrawn,
  type Cheatsheet,
  type SheetActivity,
} from './types'

/** Escape inline citation syntax while leaving authored URLs to link formatting. */
function citationText(text: string): string {
  return text.replace(/[\\`*_\[\]<>!&]/g, '\\$&')
}

/** Activity prose is plain text, not authored Markdown or HTML. */
function activityText(text: string): string {
  return text.replace(/[\\`*_{}\[\]<>()!&#+\-.|~]/g, '\\$&')
}

function activityCode(example: SheetActivity['starter']): string[] {
  if (!example) return []
  const runs = example.code.match(/`+/g) ?? []
  const fence = '`'.repeat(Math.max(3, ...runs.map((run) => run.length + 1)))
  return [activityText(example.label), '', fence, example.code, fence, '']
}

function renderActivities(
  activities: SheetActivity[],
  practiceLevel = 3,
): string[] {
  if (!activities.length) return []
  const lines: string[] = [`${'#'.repeat(practiceLevel)} Practice`, '']
  for (const activity of activities) {
    lines.push(
      `${'#'.repeat(practiceLevel + 1)} ${activityText(activity.title)}`,
      '',
      activityText(activity.prompt),
      '',
      `Context: ${activityText(activity.context)}`,
      '',
      ...activityCode(activity.starter),
      `Solution: ${activityText(activity.title)}`,
      '',
      activityText(activity.answer),
      '',
      ...activityCode(activity.solution),
      'Why it works',
      '',
      activityText(activity.explanation),
      '',
    )
    if (activity.followUp)
      lines.push('Follow-up', '', activityText(activity.followUp), '')
  }
  return lines
}

/**
 * Renders reference/cheatsheets.md from the registry. The TS modules are the
 * single source; the markdown is a generated snapshot kept in sync by
 * render.test.ts and regenerated with `pnpm gen:cheatsheets`. Do not hand-edit
 * the markdown.
 *
 * A combined portable reference includes both ordinary lookup and local study
 * practice, in the same authored order as the web page.
 */
function renderSheet(sheet: Cheatsheet): string {
  const stage = sheet.stage ? getStage(sheet.stage) : undefined
  const study = studySections(sheet)
  const lines: string[] = [`## ${sheet.title}`, '', sheet.blurb, '']

  if (stage) {
    lines.push(
      `Belongs to [${stage.num} — ${stage.title}](../docs/${stage.slug}.md).`,
      '',
    )
  }

  if (!isDrawn(sheet)) {
    lines.push('*Not drawn yet.*', '')
  }

  const sections =
    study ??
    sheet.sections.map((section) => ({
      ...section,
      activities: [] as SheetActivity[],
    }))
  for (const section of sections) {
    lines.push(`### ${section.title}`, '')
    if (section.note) lines.push(section.note, '')
    if ('subsections' in section && section.subsections) {
      for (const subsection of section.subsections) {
        const row = subsection.row
        lines.push(
          `#### ${activityText((row.term ?? row.code)!)}`,
          '',
          activityText(row.study.summary),
          '',
          activityText(row.what),
          '',
        )
        for (const example of row.example ?? [])
          lines.push(...activityCode(example))
        if (row.when) lines.push(activityText(row.when), '')
        lines.push(...renderActivities(subsection.activities, 5))
      }
      continue
    }
    for (const row of section.rows) {
      const left = row.code ? `\`${row.code}\`` : `**${row.term}**`
      const when = row.when ? ` — ${row.when}` : ''
      lines.push(`- ${left} — ${row.what}${when}`)
      if (row.example) {
        lines.push('')
        for (const ex of row.example) {
          lines.push(
            `  *${ex.label}*`,
            '',
            '  ```',
            ...ex.code.split('\n').map((l) => (l ? `  ${l}` : '')),
            '  ```',
            '',
          )
        }
      }
    }
    lines.push('')
    if (study) lines.push(...renderActivities(section.activities, 4))
  }

  if (!study && isDrawn(sheet))
    lines.push(...renderActivities(sheet.activities ?? []))

  if (isDrawn(sheet) && sheet.source?.image?.origin === 'original') {
    lines.push(
      `![${sheet.source.image.alt}](../web/public${sheet.source.image.src})`,
      '',
      'Original diagram for this playbook.',
      '',
    )
  }

  const sources = sheetSources(sheet)
  if (sources.length > 1) lines.push('Sources:', '')
  for (const citation of sources) {
    const title = citation.url
      ? `[${citationText(citation.title)}](${citation.url})`
      : citationText(citation.title)
    lines.push(`Source: ${title} — ${citationText(citation.author)}.`, '')
  }

  return lines.join('\n')
}

export function renderCheatsheets(): string {
  const drawn = CHEATSHEETS.filter(isDrawn).length

  const intro = [
    '# Cheatsheets',
    '',
    '<!-- Generated from web/src/lib/cheatsheets/. Do not edit by hand.',
    '     Edit the sheet there and run `pnpm gen:cheatsheets` (from web/) to regenerate. -->',
    '',
    'Look up a command or study a focused topic. Study sheets include worked',
    'examples and local practice; stages teach lifecycle decisions.',
    '',
    `Drawn: ${drawn} of ${CHEATSHEETS.length}. A sheet listed as not drawn is`,
    'registered on purpose — the gap is the point, so it can be seen and filled.',
    '',
    '| Sheet | Group | Stage | Status |',
    '|---|---|---|---|',
  ]

  for (const sheet of CHEATSHEETS) {
    const stage = sheet.stage ? getStage(sheet.stage) : undefined
    intro.push(
      `| ${sheet.title} | ${sheet.group} | ${stage ? stage.num : '—'} | ${
        isDrawn(sheet) ? 'Drawn' : 'Not drawn'
      } |`,
    )
  }

  intro.push('', '---', '')

  const body = CHEATSHEET_GROUPS.flatMap((group) =>
    cheatsheetsByGroup(group).map(renderSheet),
  )

  return `${intro.join('\n')}\n${body.join('\n')}`
}
