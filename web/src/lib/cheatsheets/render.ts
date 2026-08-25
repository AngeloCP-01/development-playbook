import { getStage } from '@/lib/stages'
import { CHEATSHEETS, cheatsheetsByGroup } from './index'
import { CHEATSHEET_GROUPS, isDrawn, type Cheatsheet } from './types'

/**
 * Renders reference/cheatsheets.md from the registry. The TS modules are the
 * single source; the markdown is a generated snapshot kept in sync by
 * render.test.ts and regenerated with `pnpm gen:cheatsheets`. Do not hand-edit
 * the markdown.
 *
 * One combined file rather than one per sheet: ten of the eleven are empty, and
 * ten stub files would be noise. Split when that ratio inverts.
 */
function renderSheet(sheet: Cheatsheet): string {
  const stage = sheet.stage ? getStage(sheet.stage) : undefined
  const lines: string[] = [`## ${sheet.title}`, '', sheet.blurb, '']

  if (stage) {
    lines.push(
      `Belongs to [${stage.num} — ${stage.title}](../docs/${stage.slug}.md).`,
      '',
    )
  }

  if (!isDrawn(sheet)) {
    lines.push('*Not drawn yet.*', '')
    return lines.join('\n')
  }

  for (const section of sheet.sections) {
    lines.push(`### ${section.title}`, '')
    if (section.note) lines.push(section.note, '')
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
            ...ex.code.split('\n').map((l) => `  ${l}`),
            '  ```',
            '',
          )
        }
      }
    }
    lines.push('')
  }

  if (sheet.source) {
    const title = sheet.source.url
      ? `[${sheet.source.title}](${sheet.source.url})`
      : sheet.source.title
    lines.push(`Source: ${title} — ${sheet.source.author}.`, '')
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
    'Lookup material rather than reading material. A stage teaches a decision; a',
    'sheet answers what that command was.',
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
