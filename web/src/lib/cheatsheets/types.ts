/**
 * Sheets provide lookup material or focused study sections. They remain
 * references, without a stage number or lifecycle cadence.
 *
 * Sheets are structured data rather than components so the markdown in
 * reference/ can be generated from them, the same arrangement terms.ts has with
 * reference/glossary.md (D-36). That is also what keeps every row searchable
 * later — a diagram of the same content would not be.
 */
export type CheatsheetGroup =
  | 'Architecture'
  | 'Design Principles'
  | 'Git'
  | 'Standards'
  | 'Languages'
  | 'Algorithms'

export const CHEATSHEET_GROUPS: CheatsheetGroup[] = [
  'Architecture',
  'Design Principles',
  'Git',
  'Standards',
  'Languages',
  'Algorithms',
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

/** Ordered, plain-text teaching shared by study pages and portable Markdown. */
export type TeachingBlock = { id: string } & (
  | { kind: 'paragraph'; text: string }
  | { kind: 'code'; label: string; code: string }
  | { kind: 'table'; label: string; columns: string[]; rows: string[][] }
  | {
      kind: 'interview'
      question: string
      answer: string
      weakAnswer?: string
      followUp?: string
    }
)

export type Row = {
  /** Replaces legacy what/example/when output when present. */
  teaching?: TeachingBlock[]
  /** Topic disclosure and exclusive local activity assignment on study sheets. */
  study?: { id: string; summary: string; activityIds: string[] }
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
  /** Visible before topic disclosures on study sheets. */
  introduction?: TeachingBlock[]
  title: string
  note?: string
  rows: Row[]
  /** All sections on a study sheet opt in; activity IDs are assigned once. */
  study?: { id: string; label: string; hint: string; activityIds?: string[] }
}

/**
 * A gathered graphic or original diagram, served from `web/public/reference/`. Dimensions are
 * stored rather than measured so the plate reserves its space before the bytes
 * arrive; without them the page reflows as each sheet loads.
 *
 * `alt` describes the graphic for the case where it is the only content and
 * for Markdown exports of original diagrams. The web renderer treats a drawn
 * sheet's image as decorative because its rows are the text equivalent.
 */
export type SourceImage = {
  src: string
  width: number
  height: number
  alt: string
  /** A diagram drawn for this playbook rather than a gathered source capture. */
  origin?: 'original'
}

/** A credited text reference. Supporting citations never own image plates. */
export type SourceCitation = {
  title: string
  author: string
  url?: string
}

/** The primary citation may also own the sheet's one image plate. */
export type Source = SourceCitation & {
  image?: SourceImage
}

/** Original practice content shared by the page and generated Markdown.
 * Code is literal text; activities never execute in the reader's browser. */
export type SheetActivity = {
  /** Stable and unique within the owning sheet. */
  id: string
  title: string
  prompt: string
  context: string
  starter?: Pick<RowExample, 'label' | 'code'>
  answer: string
  solution?: Pick<RowExample, 'label' | 'code'>
  explanation: string
  followUp?: string
}

export type Cheatsheet = {
  slug: string
  title: string
  group: CheatsheetGroup
  /** A real STAGES slug, guarded by a test. Language sheets have none. */
  stage?: string
  blurb: string
  source?: Source
  /** Supporting text references in authored order, after the primary source. */
  additionalSources?: SourceCitation[]
  /** Empty is legal and means "registered, not yet written" (D5). */
  /** Optional practice for drawn sheets; ordinary sections remain required. */
  activities?: SheetActivity[]
  sections: Section[]
}

/**
 * Registered-but-empty is a deliberate state: the index doubles as a worklist,
 * so a gap should be visible rather than absent.
 */
export function isDrawn(sheet: Cheatsheet): boolean {
  return sheet.sections.length > 0
}
