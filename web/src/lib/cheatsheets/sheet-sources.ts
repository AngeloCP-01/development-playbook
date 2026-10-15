import type { Cheatsheet, SourceCitation } from './types'

/** One credit list for the web and Markdown; image ownership stays on source. */
export function sheetSources(sheet: Cheatsheet): SourceCitation[] {
  return [
    ...(sheet.source ? [sheet.source] : []),
    ...(sheet.additionalSources ?? []),
  ]
}
