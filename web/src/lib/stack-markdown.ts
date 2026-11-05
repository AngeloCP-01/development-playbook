import { getStage } from './stages'
import { STACK, type StackDocument } from './stack'

/** Plain content stays literal in Markdown; a field cannot create a row or HTML. */
function text(value: string): string {
  return value
    .replace(/\s+/g, ' ')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/[\\`*_[\]|#]/g, '\\$&')
}

export function renderStack(document: StackDocument = STACK): string {
  const lines = [
    `# ${text(document.title)}`,
    '',
    '<!-- Generated from web/src/lib/stack.ts. Do not edit by hand.',
    '     Edit that source and run `pnpm gen:stack` from web/ to regenerate. -->',
    '',
    ...document.introduction.flatMap((paragraph) => [text(paragraph), '']),
    '## Version policy',
    '',
    ...document.versionPolicy.flatMap((paragraph) => [text(paragraph), '']),
    text(document.reviewNote),
    '',
  ]

  for (const group of document.groups) {
    lines.push(
      `## ${text(group.title)}`,
      '',
      '| Concern | Choice | Version / support | Rationale and caveats |',
      '|---|---|---|---|',
    )
    for (const choice of group.choices) {
      const details = [choice.rationale, choice.note]
        .filter((value): value is string => Boolean(value))
        .map(text)
      const stage = choice.see ? getStage(choice.see) : undefined
      if (stage)
        details.push(
          `See [${stage.num} — ${text(stage.title)}](../docs/${stage.slug}.md).`,
        )
      for (const source of choice.sources ?? []) {
        const href = source.href.replace(/\(/g, '%28').replace(/\)/g, '%29')
        details.push(
          `[${text(source.label)}](${href})${source.reviewed ? ` (reviewed ${text(source.reviewed)})` : ''}.`,
        )
      }
      lines.push(
        `| ${text(choice.concern)} | ${text(choice.tool)} | ${choice.version ? text(choice.version) : '—'} | ${details.join(' ')} |`,
      )
    }
    lines.push('')
  }

  lines.push('## When to deviate', '', text(document.deviationIntro), '')
  const stage = document.deviationStage
    ? getStage(document.deviationStage)
    : undefined
  if (stage)
    lines.push(
      `See [${stage.num} — ${text(stage.title)}](../docs/${stage.slug}.md).`,
      '',
    )
  for (const deviation of document.deviations) {
    lines.push(`- **${text(deviation.title)}**: ${text(deviation.detail)}`)
  }
  lines.push(
    '',
    '## Keeping this file honest',
    '',
    ...document.upkeep.flatMap((paragraph) => [text(paragraph), '']),
  )
  return lines.join('\n')
}
