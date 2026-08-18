/**
 * A cheatsheet is lookup material, not a stage. Stages teach a decision; a sheet
 * answers "what was that command again" in one screen.
 *
 * Sheets are structured data rather than components so the markdown in
 * reference/ can be generated from them, the same arrangement terms.ts has with
 * reference/glossary.md (D-36). That is also what keeps every row searchable
 * later — a diagram of the same content would not be.
 */
export type CheatsheetGroup = 'Architecture' | 'Git' | 'Standards' | 'Languages'

export const CHEATSHEET_GROUPS: CheatsheetGroup[] = [
  'Architecture',
  'Git',
  'Standards',
  'Languages',
]

export type Row = {
  /** Set in mono when present — a command, signature, or literal. */
  code?: string
  /** The left column when the thing being named is not code. */
  term?: string
  /** What it does. The one required field. */
  what: string
  /** When you reach for it, which is the part a syntax list omits. */
  when?: string
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
