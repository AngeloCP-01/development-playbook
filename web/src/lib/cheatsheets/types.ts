/**
 * A cheatsheet is lookup material, not a stage. Stages teach a decision; a sheet
 * answers "what was that command again" in one screen.
 *
 * Sheets are structured data rather than components so the markdown in
 * reference/ can be generated from them, the same arrangement terms.ts has with
 * reference/glossary.md (D-36). That is also what keeps every row searchable
 * later — a diagram of the same content would not be.
 */
export type CheatsheetGroup =
  'Architecture' | 'Design Principles' | 'Git' | 'Standards' | 'Languages'

export const CHEATSHEET_GROUPS: CheatsheetGroup[] = [
  'Architecture',
  'Design Principles',
  'Git',
  'Standards',
  'Languages',
]

/**
 * A labelled code snippet, for a row where prose alone does not show the
 * thing being named — a principle's violation next to its correction, mainly.
 * Deliberately not markdown or a language field: this repo's rows are short
 * enough that mono text and a label carry the same information without
 * needing a syntax highlighter for a handful of sheets.
 */
export type RowExample = {
  label: string
  /** Plain text — the copy-paste source of truth, and what render.ts's
   *  generated markdown quotes. */
  code: string
  /** Pre-rendered syntax-highlighted markup, computed once at module load
   *  (see src/lib/highlight.ts) rather than in the render path. Optional so a
   *  future non-TypeScript example can still ship as plain code. */
  html?: string
}

export type Row = {
  /** Set in mono when present — a command, signature, or literal. */
  code?: string
  /** The left column when the thing being named is not code. */
  term?: string
  /** What it does. The one required field. */
  what: string
  /** When you reach for it, which is the part a syntax list omits. */
  when?: string
  /** Labelled code blocks — a violation next to its correction, typically. */
  example?: RowExample[]
}

export type Section = {
  title: string
  note?: string
  rows: Row[]
}

/**
 * The gathered graphic, served from `web/public/reference/`. Dimensions are
 * stored rather than measured so the plate reserves its space before the bytes
 * arrive; without them the page reflows as each sheet loads.
 *
 * `alt` describes the graphic for the case where it is the only content. A drawn
 * sheet does not use it — see the renderer.
 */
export type SourceImage = {
  src: string
  width: number
  height: number
  alt: string
}

/** Attribution for a sheet derived from someone else's work. */
export type Source = {
  title: string
  author: string
  url?: string
  image?: SourceImage
}

export type Cheatsheet = {
  slug: string
  title: string
  group: CheatsheetGroup
  /** A real STAGES slug, guarded by a test. Language sheets have none. */
  stage?: string
  blurb: string
  source?: Source
  /** Empty is legal and means "registered, not yet written" (D5). */
  sections: Section[]
}

/**
 * Registered-but-empty is a deliberate state: the index doubles as a worklist,
 * so a gap should be visible rather than absent.
 */
export function isDrawn(sheet: Cheatsheet): boolean {
  return sheet.sections.length > 0
}
