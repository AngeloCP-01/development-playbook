import { TERMS } from './terms'
import { getStage } from './stages'

/**
 * Renders reference/glossary.md from TERMS. terms.ts is the single source; the
 * markdown is a generated snapshot, kept in sync by glossary.test.ts and
 * regenerated with `pnpm test -u`. Do not hand-edit the markdown.
 */
export function renderGlossary(): string {
  const intro = [
    '# Glossary',
    '',
    '<!-- Generated from web/src/lib/terms.ts. Do not edit by hand.',
    '     Edit the term there and run `pnpm gen:glossary` (from web/) to regenerate. -->',
    '',
    'Terms used across the stage docs, defined once. Authored in `terms.ts` and',
    'generated here, so the inline definitions in the app and this reference cannot',
    'drift apart.',
    '',
    '---',
    '',
    '',
  ].join('\n')

  const entries = Object.values(TERMS)
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((t) => {
      const stage = t.see ? getStage(t.see) : undefined
      const link = stage
        ? ` See [${stage.num} — ${stage.title}](../docs/${stage.slug}.md).`
        : ''
      return `**${t.name}** — ${t.full}${link}`
    })

  return `${intro}${entries.join('\n\n')}\n`
}
