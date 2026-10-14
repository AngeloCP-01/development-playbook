# Stage 09 Reference Companions Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish practical caching and infrastructure-scaling lookups tethered to Stage 09, with complete source credits and verifiable decision limits.

**Architecture:** Two structured data modules reuse the existing registry, routes and reference renderer. A small optional supporting-citation field and pure helper supply the same ordered credits to the web and generated Markdown. Registration and snapshot regeneration follow independent review of both sheets.

**Tech Stack:** Installed Next.js 16.2.10, React 19.2.4, TypeScript, Tailwind CSS 4, Vitest unit/jsdom, React Testing Library and Playwright. No new dependencies.

**Spec:** [Approved Stage 09 reference design](../specs/2026-10-13-stage-09-reference-design.md), approved by the user's "proceed" on 2026-10-13.

**Execution:** approved 2026-10-13 by the user's "continue" after plan presentation. Proceed with the recommended Subagent-Driven method and existing isolated-worktree preference. Integration remains a separate decision.

## Global Constraints

- Next.js cache APIs in examples remain teaching content; `web/next.config.ts` is unchanged.
- No new dependencies are required.
- Match `web/DESIGN.md`, both themes and the existing reference layout.
- Row prose is plain text. Put API literals in `code` and snippets in `example`.
- TypeScript sheet data remains the content source. Generate `reference/cheatsheets.md` using `pnpm gen:cheatsheets`; never hand-edit it.
- W-3 stays 15/18. If both new sheets are drawn and registered, W-6 becomes 22 drawn / 27 registered.
- Additional citations cannot carry images. Existing `source` retains its primary-citation and image role.
- Diagrams, image republication, runtime infrastructure, chapter/port edits, W-6.4 and the five language sheets stay out of scope.
- Every production change follows RED, GREEN and isolated teeth verification. Raw terminal output and failure explanations belong in `docs/superpowers/reports/2026-10-13-stage-09-reference.md` during execution.
- Run app commands from `web/`; paths below are relative to repository root. Typecheck via `pnpm typecheck`, not bare tsc.
- Every commit includes `Co-Authored-By: Codex Opus 4.8 (1M context) <noreply@anthropic.com>`.
- Work stays on a branch descended from develop, carrying this approved spec/plan. No work directly on develop or main. Every merge needs a separate user decision.

## Review Focus

1. Supporting-only and empty-source sheets must render accurate credits or no footer, including beside an undrawn placeholder. Task 1 tests web and Markdown behavior.
2. URL-less and markup-looking titles/authors must remain readable text with ordered credits, without replacing an existing image plate. Task 1 tests these inputs.
3. A successful cache hit must not substitute for current business/authorization state; webhook callers must not receive Server Action-only advice. Task 2 tests data and the actual rendered sheet.
4. Uneven workload, incompatible ALB features and all-unhealthy targets must retain their decision caveats; retries must account for uncertain outcomes. Task 3 tests data and the actual rendered sheet.
5. Registration and derived artifacts must include both companions, all citations and literal examples, while preserving five language placeholders. Task 4 tests registry, Markdown and actual registered sheet rendering; live verification covers narrow and long content.

## File map and dependencies

| Task | Owns | Depends on |
|---|---|---|
| 1 | Citation types/helper, shared web/Markdown footer, citation tests | Existing renderer |
| 2 | Caching data and its unit/DOM tests | Task 1 citation contract |
| 3 | Scaling data and its unit/DOM tests | Task 1 citation contract |
| 4 | Registry integration, generated artifacts, source mapping, integrated tests and delivery evidence | Tasks 1–3 |

Tasks 2 and 3 own separate files; execute sequentially under the selected method. Task 4 is the only task that publishes these new routes. Do not dispatch agents while writing or self-reviewing this plan. At execution, read AGENTS/CLAUDE, the approved spec, installed Next.js guides and `docs/learnings/plans-are-unverified-101.md`; recheck refs before creating the implementation branch/worktree.

## Per-task evidence and review

Write each listed test before its production file/edit. Save the focused RED run and state why the failure is the expected missing behavior. Implement the complete source below, run the same tests, make the named temporary teeth mutation, check that the named regression test alone fails in that focused run, restore the source and rerun GREEN. Never commit a teeth mutation. Missing new modules can make an initial RED fail at collection; explain it as absent implementation, then use the teeth check to prove the actual behavior guard.

After the task's GREEN and format/lint/typecheck, commit the task using its listed subject plus the required trailer, then obtain a fresh read-only per-task review before the next task. AGENTS.md requires per-task review and final whole-branch review under either execution method. Subagent-Driven uses fresh implementers as well as fresh reviewers; Native keeps implementation in the controller while retaining those repository review gates.

---

### Task 1: Render complete supporting citations

**Files:**
- Modify: `web/src/lib/cheatsheets/types.ts`, `web/src/lib/cheatsheets/index.ts`, `web/src/lib/cheatsheets/render.ts`, `web/src/components/Cheatsheet.tsx`
- Create: `web/src/lib/cheatsheets/sheet-sources.ts`
- Tests: `web/src/lib/cheatsheets/sheet-sources.test.ts`, `web/src/lib/cheatsheets/render-citations.test.ts`, `web/src/components/CheatsheetSources.test.tsx`

**Interfaces:**
- Consumes: `Cheatsheet`, the legacy `source?: Source`, existing `CheatsheetView({ sheet }: { sheet: Cheatsheet })`, and `renderCheatsheets(): string`.
- Produces: `SourceCitation = { title: string; author: string; url?: string }`, optional `additionalSources?: SourceCitation[]`, and `sheetSources(sheet: Cheatsheet): SourceCitation[]` from `sheet-sources.ts`.
- The helper copies the array in primary/supporting order; it neither mutates nor deduplicates inputs. Additional references cannot own image plates. The named `SourceCitation` type is re-exported from `index.ts`.

- [x] **Step 1: Write these new tests.** Keep every existing renderer/image test.

#### Source: `web/src/lib/cheatsheets/sheet-sources.test.ts`

```ts
import { expect, test } from 'vitest'
import { CHEATSHEETS } from './index'
import { sheetSources } from './sheet-sources'
import type { Cheatsheet, SourceCitation } from './types'

const base: Cheatsheet = {
  slug: 'credits',
  title: 'Credits',
  group: 'Architecture',
  blurb: 'Fixture.',
  sections: [],
}
const primary: SourceCitation = {
  title: 'Primary',
  author: 'One',
  url: 'https://example.com/primary',
}
const supporting: SourceCitation = {
  title: 'Supporting',
  author: 'Two',
  url: 'https://example.com/supporting',
}

test('a sheet without sources has no invented credit', () => {
  expect(sheetSources(base)).toEqual([])
  expect(sheetSources({ ...base, additionalSources: [] })).toEqual([])
})
test('an existing primary-only sheet keeps its credited work', () => {
  expect(sheetSources({ ...base, source: primary })).toEqual([primary])
})
test('additional-only sources remain visible even without a primary image owner', () => {
  expect(sheetSources({ ...base, additionalSources: [supporting] })).toEqual([
    supporting,
  ])
})
test('credits retain authored order and do not mutate or silently deduplicate input', () => {
  const extras = [supporting, primary]
  const sheet = { ...base, source: primary, additionalSources: extras }
  const result = sheetSources(sheet)
  expect(result).toEqual([primary, supporting, primary])
  result.pop()
  expect(extras).toEqual([supporting, primary])
})
test('URL-less supporting references retain their title and author', () => {
  const offline = { title: 'Printed guide', author: 'Editor' }
  expect(sheetSources({ ...base, additionalSources: [offline] })).toEqual([
    offline,
  ])
})
test('every authored citation names its work and author, with no duplicate URL or supporting image', () => {
  for (const sheet of CHEATSHEETS) {
    const urls = new Set<string>()
    for (const citation of sheetSources(sheet)) {
      expect(citation.title.trim().length, sheet.slug).toBeGreaterThan(0)
      expect(citation.author.trim().length, sheet.slug).toBeGreaterThan(0)
      if (citation.url) {
        expect(
          urls.has(citation.url),
          `${sheet.slug}: duplicate ${citation.url}`,
        ).toBe(false)
        urls.add(citation.url)
      }
    }
    for (const citation of sheet.additionalSources ?? []) {
      expect(citation, sheet.slug).not.toHaveProperty('image')
    }
  }
})
```

#### Source: `web/src/lib/cheatsheets/render-citations.test.ts`

```ts
import { beforeEach, expect, test, vi } from 'vitest'
import type { Cheatsheet, CheatsheetGroup } from './types'

const fixtures = vi.hoisted(() => ({ sheets: [] as Cheatsheet[] }))
vi.mock('./index', () => ({
  CHEATSHEETS: fixtures.sheets,
  cheatsheetsByGroup: (group: CheatsheetGroup) =>
    fixtures.sheets.filter((sheet) => sheet.group === group),
}))
import { renderCheatsheets } from './render'
const base: Cheatsheet = {
  slug: 'credits',
  title: 'Fixture Credits',
  group: 'Architecture',
  blurb: 'Fixture.',
  sections: [],
}
beforeEach(() => {
  fixtures.sheets.length = 0
})

test('undrawn additional-only sheets retain the placeholder and their credit in Markdown', () => {
  fixtures.sheets.push({
    ...base,
    additionalSources: [{ title: 'Printed guide', author: 'Editor' }],
  })
  const text = renderCheatsheets()
  expect(text).toContain('*Not drawn yet.*')
  expect(text).toContain('Source: Printed guide — Editor.')
})
test('Markdown retains every citation in authored order, including URL-less work', () => {
  fixtures.sheets.push({
    ...base,
    sections: [
      { title: 'Section', rows: [{ term: 'Decision', what: 'Check it.' }] },
    ],
    source: { title: 'Primary', author: 'One', url: 'https://example.com/one' },
    additionalSources: [
      { title: 'Printed guide', author: 'Two' },
      {
        title: 'Supporting',
        author: 'Three',
        url: 'https://example.com/three',
      },
    ],
  })
  const text = renderCheatsheets()
  expect(text).toContain('Sources:')
  expect(text).toContain('Source: [Primary](https://example.com/one) — One.')
  expect(text).toContain('Source: Printed guide — Two.')
  expect(text).toContain(
    'Source: [Supporting](https://example.com/three) — Three.',
  )
  expect(text.indexOf('Source: [Primary]')).toBeLessThan(
    text.indexOf('Source: Printed guide'),
  )
  expect(text.indexOf('Source: Printed guide')).toBeLessThan(
    text.indexOf('Source: [Supporting]'),
  )
})
test('no citation means no empty Sources block in generated Markdown', () => {
  fixtures.sheets.push({ ...base, additionalSources: [] })
  expect(renderCheatsheets()).not.toContain('Source:')
  expect(renderCheatsheets()).not.toContain('Sources:')
})
```

#### Source: `web/src/components/CheatsheetSources.test.tsx`

```tsx
import { render, screen, within } from '@testing-library/react'
import { expect, test } from 'vitest'
import type { Cheatsheet } from '@/lib/cheatsheets'
import { security } from '@/lib/cheatsheets/security'
import { CheatsheetView } from './Cheatsheet'

const base: Cheatsheet = {
  slug: 'credits',
  title: 'Credits',
  group: 'Architecture',
  blurb: 'Fixture.',
  sections: [],
}

test('an additional-only undrawn sheet credits its source alongside the placeholder', () => {
  render(
    <CheatsheetView
      sheet={{
        ...base,
        additionalSources: [
          {
            title: 'Supporting guide',
            author: 'Editor',
            url: 'https://example.com/guide',
          },
        ],
      }}
    />,
  )
  expect(screen.getByText('Sheet not drawn')).toBeTruthy()
  expect(screen.getByText('Source', { exact: true })).toBeTruthy()
  expect(
    screen.getByRole('link', { name: 'Supporting guide' }).getAttribute('href'),
  ).toBe('https://example.com/guide')
  expect(screen.getByText(/Editor/)).toBeTruthy()
})
test('multiple citations retain their order, URL-less credit, and plural label', () => {
  render(
    <CheatsheetView
      sheet={{
        ...base,
        source: {
          title: 'Primary',
          author: 'One',
          url: 'https://example.com/one',
        },
        additionalSources: [
          { title: 'Printed guide', author: 'Two' },
          {
            title: 'Supporting',
            author: 'Three',
            url: 'https://example.com/three',
          },
        ],
      }}
    />,
  )
  const footer = document.querySelector('footer')!
  expect(within(footer).getByText('Sources', { exact: true })).toBeTruthy()
  const text = footer.textContent ?? ''
  expect(text.indexOf('Primary')).toBeLessThan(text.indexOf('Printed guide'))
  expect(text.indexOf('Printed guide')).toBeLessThan(text.indexOf('Supporting'))
  expect(
    within(footer).queryByRole('link', { name: 'Printed guide' }),
  ).toBeNull()
  expect(within(footer).getByText(/Two/)).toBeTruthy()
  expect(within(footer).getAllByRole('link')).toHaveLength(2)
})
test('empty supporting arrays do not create an empty attribution footer', () => {
  render(<CheatsheetView sheet={{ ...base, additionalSources: [] }} />)
  expect(document.querySelector('footer')).toBeNull()
})
test('markup-looking citation text is displayed as text rather than an image element', () => {
  render(
    <CheatsheetView
      sheet={{
        ...base,
        additionalSources: [
          {
            title: '<img src=x onerror=alert(1)>',
            author: '<script>alert(1)</script>',
          },
        ],
      }}
    />,
  )
  expect(screen.getByText('<img src=x onerror=alert(1)>')).toBeTruthy()
  expect(document.querySelector('img, script')).toBeNull()
})
test('supporting citations do not replace the existing primary security diagram', () => {
  render(
    <CheatsheetView
      sheet={{
        ...security,
        additionalSources: [{ title: 'Supporting policy', author: 'Editor' }],
      }}
    />,
  )
  const img = document.querySelector('img')!
  expect(decodeURIComponent(img.getAttribute('src') ?? '')).toContain(
    '/reference/security-invoice-audit.svg',
  )
  expect(img.getAttribute('alt')).toBe('')
  expect(img.getAttribute('width')).toBe('640')
  expect(img.getAttribute('height')).toBe('780')
  expect(screen.getByText('Original diagram')).toBeTruthy()
  expect(screen.getByText('Supporting policy')).toBeTruthy()
})
```

- [x] **Step 2: Run the focused RED.**

```bash
pnpm exec vitest run src/lib/cheatsheets/sheet-sources.test.ts src/lib/cheatsheets/render-citations.test.ts src/components/CheatsheetSources.test.tsx src/components/Cheatsheet.test.tsx
```

Expected: missing `sheet-sources.ts` plus failures because supporting-only credits never render. Existing legacy renderer tests should still pass. Save the unedited output; do not claim that a type-check failure by itself proves rendered behavior.

- [x] **Step 3: Apply the complete production source below.** In `index.ts`'s existing type re-export list, add `SourceCitation,` immediately after `Source,`; no new sheets are registered in this task.

#### Source: `web/src/lib/cheatsheets/types.ts`

```ts
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
  sections: Section[]
}

/**
 * Registered-but-empty is a deliberate state: the index doubles as a worklist,
 * so a gap should be visible rather than absent.
 */
export function isDrawn(sheet: Cheatsheet): boolean {
  return sheet.sections.length > 0
}
```

#### Source: `web/src/lib/cheatsheets/sheet-sources.ts`

```ts
import type { Cheatsheet, SourceCitation } from './types'

/** One credit list for the web and Markdown; image ownership stays on source. */
export function sheetSources(sheet: Cheatsheet): SourceCitation[] {
  return [
    ...(sheet.source ? [sheet.source] : []),
    ...(sheet.additionalSources ?? []),
  ]
}
```

#### Source: `web/src/components/Cheatsheet.tsx`

```tsx
import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'
import { isDrawn, type Cheatsheet } from '@/lib/cheatsheets'
import { getStage } from '@/lib/stages'
import { sheetSources } from '@/lib/cheatsheets/sheet-sources'

/**
 * One renderer for every sheet, so sheet number twelve costs no new UI.
 *
 * Rows are a grid rather than a table on purpose: a table sets its own minimum
 * width from its content and pushes the page into horizontal scroll at 320px,
 * which the audit suite fails on. The grid collapses to stacked rows instead.
 *
 * No copy button yet. Nothing in the registry has code rows today, and a control
 * with no content to act on is untestable — it arrives with the first sheet that
 * needs it.
 */
export function CheatsheetView({ sheet }: { sheet: Cheatsheet }) {
  const stage = sheet.stage ? getStage(sheet.stage) : undefined
  const sources = sheetSources(sheet)

  return (
    <div>
      {stage && (
        <p className="mb-10">
          <Link
            href={`/stages/${stage.slug}`}
            className="group inline-flex min-h-11 items-center gap-2 text-[0.9375rem] text-muted transition-colors duration-150 hover:text-fg"
          >
            <span className="t-data text-[11px] text-subtle transition-colors duration-150 group-hover:text-brand">
              {stage.num}
            </span>
            <span className="t-label text-subtle">Belongs to</span>
            <span className="t-ui">{stage.title}</span>
            <ArrowUpRight
              className="size-4 text-subtle transition-colors duration-150 group-hover:text-brand"
              aria-hidden
            />
          </Link>
        </p>
      )}

      {isDrawn(sheet) ? (
        <div className="space-y-12">
          {sheet.sections.map((section) => (
            <section key={section.title}>
              <h2 className="t-head text-lg">{section.title}</h2>
              {section.note && (
                <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted">
                  {section.note}
                </p>
              )}

              <dl className="mt-5 border-t border-line">
                {section.rows.map((row) => (
                  <div
                    key={row.code ?? row.term ?? row.what}
                    className="grid gap-x-6 gap-y-1 border-b border-line py-4 sm:grid-cols-[minmax(0,18rem)_1fr]"
                  >
                    <dt className="min-w-0">
                      {row.code ? (
                        <code className="t-data block break-words text-[0.8125rem] text-fg">
                          {row.code}
                        </code>
                      ) : (
                        <span className="t-ui font-medium text-fg">
                          {row.term}
                        </span>
                      )}
                    </dt>
                    <dd className="min-w-0">
                      <p className="text-[0.9375rem] leading-relaxed text-fg">
                        {row.what}
                      </p>
                      {row.when && (
                        <p className="mt-1 text-sm leading-relaxed text-muted">
                          {row.when}
                        </p>
                      )}
                      {row.example && (
                        <div className="mt-4 grid min-w-0 gap-3 sm:grid-cols-2">
                          {row.example.map((ex) => (
                            <div key={ex.label} className="min-w-0">
                              <p className="t-label mb-1.5 text-subtle">
                                {ex.label}
                              </p>
                              {ex.html ? (
                                // Pre-rendered by src/lib/highlight.ts at
                                // module load, from this same file's own
                                // ex.code — not user input.
                                <div
                                  className="overflow-x-auto border border-line bg-sunken p-3 text-[0.8125rem] [&_.shiki]:overflow-visible"
                                  dangerouslySetInnerHTML={{ __html: ex.html }}
                                />
                              ) : (
                                <pre className="overflow-x-auto border border-line bg-sunken p-3 text-[0.8125rem]">
                                  <code className="t-data whitespace-pre text-fg">
                                    {ex.code}
                                  </code>
                                </pre>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          ))}
        </div>
      ) : (
        <div className="border border-dashed border-line-strong p-10 text-center">
          <p className="t-label text-subtle">Sheet not drawn</p>
          <p className="mx-auto mt-3 max-w-[46ch] text-[0.9375rem] leading-relaxed text-muted">
            This sheet is registered so the gap is visible. The content has not
            been gathered yet.
          </p>
        </div>
      )}

      {sheet.source?.image && (
        <figure className="mt-14">
          {sheet.source.image.origin === 'original' && (
            <p className="t-ui mb-2 text-[0.8125rem] text-muted md:hidden">
              Scroll sideways to read the full diagram
            </p>
          )}
          {/* A plate, because these graphics have a light background
              and would punch a hole in the cyanotype unframed. The border and
              padding give it an edge to sit against in both themes.

              Not dimmed at rest: the obvious dark-mode trick is to drop opacity
              until hover, but the whole reason the graphic is here is to be
              read, and dimming content to make it blend is a worse trade than
              letting it be bright.

              next/image rather than a plain tag, despite these already being
              WebP: the win is not re-encoding, it is srcset. These are up to
              1536px tall and a phone has no use for the full file. */}
          <div className="overflow-x-auto border border-line-strong bg-sunken p-3 sm:p-4">
            <Image
              src={sheet.source.image.src}
              width={sheet.source.image.width}
              height={sheet.source.image.height}
              sizes="(min-width: 1024px) 55rem, 100vw"
              // The transcription below is a complete text equivalent, so on a
              // drawn sheet the graphic is decorative and announcing it would
              // make a screen reader read the page twice. On an undrawn sheet it
              // is the only content, so it has to describe itself.
              alt={isDrawn(sheet) ? '' : sheet.source.image.alt}
              aria-hidden={isDrawn(sheet) || undefined}
              className={
                sheet.source.image.origin === 'original'
                  ? 'h-auto w-full min-w-[560px]'
                  : 'h-auto w-full'
              }
            />
          </div>
          <figcaption className="t-label mt-3 text-subtle">
            {sheet.source.image.origin === 'original'
              ? 'Original diagram'
              : 'The gathered original'}
          </figcaption>
        </figure>
      )}

      {sources.length > 0 && (
        <footer className="mt-16 border-t border-line pt-6">
          <p className="t-label text-subtle">
            {sources.length === 1 ? 'Source' : 'Sources'}
          </p>
          {sources.map((citation, index) => (
            <p
              key={`${index}:${citation.title}`}
              className="mt-2 text-sm leading-relaxed text-muted"
            >
              {citation.url ? (
                <a
                  href={citation.url}
                  className="inline-flex min-h-11 items-center underline decoration-line-strong underline-offset-4 transition-colors duration-150 hover:text-fg"
                >
                  {citation.title}
                </a>
              ) : (
                citation.title
              )}
              <span> — {citation.author}</span>
            </p>
          ))}
        </footer>
      )}
    </div>
  )
}
```

#### Source: `web/src/lib/cheatsheets/render.ts`

```ts
import { getStage } from '@/lib/stages'
import { sheetSources } from './sheet-sources'
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
      ? `[${citation.title}](${citation.url})`
      : citation.title
    lines.push(`Source: ${title} — ${citation.author}.`, '')
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
```

- [x] **Step 4: Run the same focused tests for GREEN.** Also run the existing Markdown/security-image and generated-highlight guards; existing registered data has no new supporting credits yet, so their snapshots should remain unchanged.

```bash
pnpm exec vitest run src/lib/cheatsheets/render.test.ts src/lib/cheatsheets/generate-highlighted.test.ts
```

- [x] **Step 5: Prove the additional-only DOM guard has teeth.** Temporarily change the new citation anchor's `href={citation.url}` to `href={sheet.source ? citation.url : undefined}` in `Cheatsheet.tsx`. Run `pnpm exec vitest run src/components/CheatsheetSources.test.tsx` without a name filter; expect only the additional-only undrawn-sheet test to fail on its missing link role/target, with the other tests passing. Restore, rerun GREEN and retain raw output. Check the registry guard separately: in `incident-management.ts`, temporarily add `additionalSources: [{ title: 'Incident Response', author: 'Google SRE Workbook', url: 'https://sre.google/workbook/incident-response/' }],` after its primary `source` object. Run the complete `sheet-sources.test.ts` file; only the authored-citation guard must fail with the duplicate-URL assertion. Restore and rerun GREEN.

- [x] **Step 6: Format, lint, typecheck, commit and obtain the required task review.**

```bash
pnpm format
pnpm lint
pnpm typecheck
```

Restore any unrelated formatting change rather than including it. Run these from `web/`; `git -C ..` targets the repository root. Add the raw evidence to the report before staging.

```bash
git -C .. add web/src/lib/cheatsheets/types.ts web/src/lib/cheatsheets/index.ts web/src/lib/cheatsheets/sheet-sources.ts web/src/lib/cheatsheets/sheet-sources.test.ts web/src/lib/cheatsheets/render.ts web/src/lib/cheatsheets/render-citations.test.ts web/src/components/Cheatsheet.tsx web/src/components/CheatsheetSources.test.tsx docs/superpowers/reports/2026-10-13-stage-09-reference.md
git -C .. commit -m 'feat(reference): render supporting source citations' -m 'Co-Authored-By: Codex Opus 4.8 (1M context) <noreply@anthropic.com>'
```

Complete the required independent task review before moving on.

---

### Task 2: Author the caching lookup

**Files:**
- Create: `web/src/lib/cheatsheets/caching.ts`
- Tests: `web/src/lib/cheatsheets/caching.test.ts`, `web/src/components/CachingReference.test.tsx`

**Interfaces:**
- Consumes: `Cheatsheet` with `additionalSources?: SourceCitation[]`, `sheetSources(sheet: Cheatsheet): SourceCitation[]`, and `CheatsheetView({ sheet }: { sheet: Cheatsheet })` from Task 1.
- Produces: `export const caching: Cheatsheet` with slug `caching`, group `Architecture`, and stage `09-performance-optimization`. Task 4 will import this value; this task does not register it.

- [x] **Step 1: Write the tests below before the data module.**

#### Source: `web/src/lib/cheatsheets/caching.test.ts`

```ts
import { expect, test } from 'vitest'
import { caching } from './caching'
import { sheetSources } from './sheet-sources'
const rows = caching.sections.flatMap((section) => section.rows)
const text = rows
  .map((row) => `${row.code ?? row.term}: ${row.what} ${row.when ?? ''}`)
  .join('\n')
const api = (code: string) => rows.find((row) => row.code === code)!

test('the caching lookup belongs to stage 09 and covers the five agreed decisions', () => {
  expect(caching.stage).toBe('09-performance-optimization')
  expect(caching.sections.map((section) => section.title)).toEqual([
    'Choose the boundary',
    'Set lifetime and tags',
    'Invalidate after a write',
    'Read CDN evidence',
    'Verify the change',
  ])
})
test('read-your-own-write advice distinguishes caller boundaries from tolerated stale reads', () => {
  expect(api('updateTag(tag)').what).toMatch(/Server Actions only/)
  expect(api('updateTag(tag)').when).toMatch(/not available in Route Handlers/)
  expect(api("revalidateTag(tag, 'max')").what).toMatch(
    /stale data.*background/,
  )
  expect(api('revalidateTag(tag, { expire: 0 })').what).toMatch(
    /Route Handler.*block for fresh data/,
  )
})
test('cached descriptions never replace authoritative business checks or grant tenant access', () => {
  expect(text).toMatch(/stock, charge status and authorization.*authoritative/)
  expect(text).toMatch(/tenant-specific cache key does not grant access/)
  expect(text).toMatch(/two users or tenants/)
})
test('CDN evidence names its provider and does not claim a hit proves current application data', () => {
  expect(
    caching.sections.find((section) => section.title === 'Read CDN evidence')!
      .note,
  ).toMatch(/Cloudflare.*not Next.js/)
  expect(rows.find((row) => row.term === 'HIT')!.when).toMatch(
    /does not prove.*latest write/,
  )
  expect(rows.find((row) => row.term === 'MISS')!.when).toMatch(
    /without a fault/,
  )
  expect(rows.find((row) => row.term === 'BYPASS')!.what).toMatch(
    /response.*prevented/,
  )
  expect(rows.find((row) => row.term === 'DYNAMIC')!.what).toMatch(
    /ineligible.*request time/,
  )
})
test('the retest keeps comparable scope, failures and freshness rather than only a hit rate', () => {
  expect(text).toMatch(/cold\/warm cache state/)
  expect(text).toMatch(/timeout\/failure rule, errors and correctness/)
  expect(text).toMatch(/single lab run is not a field p95/)
  expect(text).toMatch(/other user or tenant/)
})
test('every publisher used in caching is credited and example syntax is literal data', () => {
  expect(sheetSources(caching).map((citation) => citation.author)).toEqual([
    'Next.js',
    'Next.js',
    'Next.js',
    'Next.js',
    'Next.js',
    'Cloudflare',
    'Cloudflare',
  ])
  expect(api("'use cache'").example![0].code).toContain("cacheLife('minutes')")
  expect(api("'use cache'").example![0].code).toContain(
    'cacheTag(`catalog:${productId}`)',
  )
  expect(text).toMatch(/instance-local and ephemeral/)
})
```

#### Source: `web/src/components/CachingReference.test.tsx`

```tsx
import { render, screen, within } from '@testing-library/react'
import { expect, test } from 'vitest'
import { caching } from '@/lib/cheatsheets/caching'
import { CheatsheetView } from './Cheatsheet'

test('the real caching sheet renders caller and freshness limits so data tests cannot hide dropped advice', () => {
  render(<CheatsheetView sheet={caching} />)
  const rows = Array.from(document.querySelectorAll('dl > div'))
  const action = rows.find(
    (row) => row.querySelector('dt')?.textContent === 'updateTag(tag)',
  ) as HTMLElement
  expect(within(action).getByText(/Server Actions only/)).toBeTruthy()
  expect(
    within(action).getByText(/not available in Route Handlers/),
  ).toBeTruthy()
  expect(
    screen.getByText(/From a Route Handler.*block for fresh data/),
  ).toBeTruthy()
  expect(screen.getByText(/does not prove.*latest write/)).toBeTruthy()
  expect(
    screen
      .getByRole('link', { name: /Performance Optimization/ })
      .getAttribute('href'),
  ).toBe('/stages/09-performance-optimization')
})
test('the real caching sheet credits Next.js and Cloudflare with exact targets and renders the literal example', () => {
  render(<CheatsheetView sheet={caching} />)
  const footer = document.querySelector('footer')!
  expect(within(footer).getAllByRole('link')).toHaveLength(7)
  expect(
    within(footer)
      .getByRole('link', { name: 'updateTag' })
      .getAttribute('href'),
  ).toBe('https://nextjs.org/docs/app/api-reference/functions/updateTag')
  expect(
    within(footer)
      .getByRole('link', { name: 'Cloudflare cache responses' })
      .getAttribute('href'),
  ).toBe('https://developers.cloudflare.com/cache/concepts/cache-responses/')
  expect(screen.getByText(/cacheTag\(`catalog:/)).toBeTruthy()
  expect(document.querySelector('pre code')?.textContent).toContain(
    'https://catalog.example/products/',
  )
  expect(document.querySelector('pre code')?.textContent).toContain(
    "'use cache'",
  )
})
```

- [x] **Step 2: Run RED.**

```bash
pnpm exec vitest run src/lib/cheatsheets/caching.test.ts src/components/CachingReference.test.tsx
```

Expected: the missing `caching.ts` import prevents the new tests running. Save that output as missing implementation, then use the behavioral teeth check after GREEN to disprove a vacuous test.

- [x] **Step 3: Add this complete authored data module.** Its examples are literal teaching strings, never executed by the app. Keep syntax in `code`/`example` and explanatory prose in `what`/`when`. Do not register this sheet yet.

#### Source: `web/src/lib/cheatsheets/caching.ts`

```ts
import type { Cheatsheet } from './types'

export const caching: Cheatsheet = {
  slug: 'caching',
  title: 'Caching',
  group: 'Architecture',
  stage: '09-performance-optimization',
  blurb:
    'Choose reusable work, set a freshness rule, invalidate after writes, and verify the same user outcome.',
  source: {
    title: 'use cache',
    author: 'Next.js',
    url: 'https://nextjs.org/docs/app/api-reference/directives/use-cache',
  },
  additionalSources: [
    {
      title: 'cacheLife',
      author: 'Next.js',
      url: 'https://nextjs.org/docs/app/api-reference/functions/cacheLife',
    },
    {
      title: 'cacheTag',
      author: 'Next.js',
      url: 'https://nextjs.org/docs/app/api-reference/functions/cacheTag',
    },
    {
      title: 'updateTag',
      author: 'Next.js',
      url: 'https://nextjs.org/docs/app/api-reference/functions/updateTag',
    },
    {
      title: 'revalidateTag',
      author: 'Next.js',
      url: 'https://nextjs.org/docs/app/api-reference/functions/revalidateTag',
    },
    {
      title: 'Cloudflare cache responses',
      author: 'Cloudflare',
      url: 'https://developers.cloudflare.com/cache/concepts/cache-responses/',
    },
    {
      title: 'Retention vs Freshness (TTL)',
      author: 'Cloudflare',
      url: 'https://developers.cloudflare.com/cache/concepts/retention-vs-freshness/',
    },
  ],
  sections: [
    {
      title: 'Choose the boundary',
      note: 'Cache a result only when its ownership scope and tolerated staleness are defined. These are application decisions, not a command to add a cache everywhere.',
      rows: [
        {
          term: 'Reusable result',
          what: 'A public catalog description can be a candidate for reuse. A faster response is useful only if it still answers the intended user operation.',
          when: 'Use evidence that the repeated work contributes to the measured slow path.',
        },
        {
          term: 'Current business decision',
          what: 'Validate stock, charge status and authorization against the appropriate authoritative state. A cached description is not permission to sell, charge or disclose.',
          when: 'Before accepting an order, confirming payment or returning protected data.',
        },
        {
          term: 'Key and ownership',
          what: 'Include every input that changes the result, such as product, locale or tenant. A tenant-specific cache key does not grant access; authorization still belongs at the data boundary.',
          when: 'Test the same identifier as two users or tenants before sharing a cached result.',
        },
      ],
    },
    {
      title: 'Set lifetime and tags',
      note: 'TTL means time to live: a freshness or expiry interval under the chosen cache policy. Retention is how long an entry remains stored; neither term promises persistence on every host.',
      rows: [
        {
          code: 'cacheComponents: true',
          what: 'Enable Cache Components in the example application before using the Next.js use cache directive. This playbook is teaching the API; it does not enable runtime caching here.',
          when: 'Check the installed framework version and hosting behavior.',
        },
        {
          code: "'use cache'",
          what: 'Mark an async function, component or module scope for caching. Read cookies, headers and other request-specific values outside that scope, then pass the needed inputs.',
          when: 'Reuse an eligible result, with its input and ownership boundaries already defined.',
          example: [
            {
              label:
                'Illustrative public-description read; example domain, not this app',
              code: "import { cacheLife, cacheTag } from 'next/cache'\n\nexport async function readDescription(productId: string) {\n  'use cache'\n  cacheLife('minutes')\n  cacheTag(`catalog:${productId}`)\n  const response = await fetch(\n    `https://catalog.example/products/${encodeURIComponent(productId)}`,\n  )\n  if (!response.ok) throw new Error('Catalog read failed')\n  const { id, description } = await response.json()\n  return { id, description }\n}",
            },
          ],
        },
        {
          code: 'cacheLife / cacheTag',
          what: 'Choose a lifetime consistent with tolerated staleness and tag the reads a successful write will invalidate. Tags label entries; they are not authorization checks.',
          when: 'Describe the expected read after a write, not only how long the entry might be retained.',
        },
        {
          term: 'Hosting and retention',
          what: 'Default runtime memory can be instance-local and ephemeral, especially on serverless hosts. Check the configured cache handler before assuming reuse across requests or deployments.',
          when: 'A published lifetime is not evidence that a particular instance still holds the entry.',
        },
      ],
    },
    {
      title: 'Invalidate after a write',
      note: 'The write must succeed before invalidating affected reads. Invalidation changes the next matching data read; it does not automatically refresh every open browser view.',
      rows: [
        {
          code: 'updateTag(tag)',
          what: 'Server Actions only: expire matching entries immediately so the next matching read waits for fresh data.',
          when: 'Use after a successful write when the actor must read their own change. It is not available in Route Handlers.',
        },
        {
          code: "revalidateTag(tag, 'max')",
          what: 'Server Actions or Route Handlers: mark tagged data stale; the next visit can receive stale data while revalidation runs in the background.',
          when: 'Use when stale-while-revalidate behavior is acceptable. The call itself does not eagerly refresh every tagged page.',
        },
        {
          code: 'revalidateTag(tag, { expire: 0 })',
          what: 'From a Route Handler that requires immediate expiry, make the next matching read block for fresh data.',
          when: 'Use when stale content is unacceptable and updateTag is unavailable. Avoid the deprecated single-argument revalidateTag form.',
        },
      ],
    },
    {
      title: 'Read CDN evidence',
      note: 'CDN means content delivery network. CF-Cache-Status describes Cloudflare response caching, not Next.js application-cache entries. These examples do not imply this site uses Cloudflare.',
      rows: [
        {
          term: 'HIT',
          what: 'Cloudflare found the response in its cache.',
          when: 'A hit does not prove the application data reflects the latest write.',
        },
        {
          term: 'MISS',
          what: 'The request was eligible for Cloudflare caching but the response was absent, so the origin served it.',
          when: 'A first or cold request can miss without a fault.',
        },
        {
          term: 'BYPASS',
          what: 'Cloudflare considered the request eligible, but the response or policy prevented storing the response.',
          when: 'Inspect the relevant response headers and cache rules before changing the policy.',
        },
        {
          term: 'DYNAMIC',
          what: 'Cloudflare considered the request ineligible for cache at request time.',
          when: 'Check eligibility rules; do not treat this as a missing Next.js tag.',
        },
        {
          term: 'Freshness and retention',
          what: 'A freshness interval controls when origin validation is required. An expired entry may still be retained; stale serving depends on the applicable revalidation policy.',
          when: 'Keep CDN headers and application-cache tags as separate controls.',
        },
        {
          code: 'curl -sS -D - -o /dev/null https://catalog.example/products/demo',
          what: 'Read response headers for an explicitly illustrative URL. Inspect CF-Cache-Status and the applicable Cache-Control headers on a real test endpoint.',
          when: 'Use a safe read endpoint; do not infer application-cache behavior from a CDN header.',
        },
      ],
    },
    {
      title: 'Verify the change',
      note: 'A cache hit is diagnostic evidence, not proof of a better or correct user outcome.',
      rows: [
        {
          term: 'Comparable outcome',
          what: 'Compare the same observer, start/end events, segment, workload, observation window and cold/warm cache state. A p95 is the duration at the 95th percentile of the stated population.',
          when: 'Record the sample, timeout/failure rule, errors and correctness as well as latency; a single lab run is not a field p95.',
        },
        {
          term: 'Freshness and isolation',
          what: 'After the write, confirm the intended reader sees the expected state. Repeat as another user or tenant and confirm protected data is not disclosed.',
          when: 'Keep the cache change only when the freshness rule, authorization and user target still hold.',
        },
      ],
    },
  ],
}
```

- [x] **Step 4: Run the same command for GREEN, then perform the named teeth check.**

Temporarily replace `Server Actions only:` in the updateTag row's `what` with `Route Handlers allowed:`. Run `pnpm exec vitest run src/lib/cheatsheets/caching.test.ts`; expect only the read-your-own-write test to fail on caller scope, with the other unit tests passing. Restore the data and rerun the full Task 2 command for GREEN. Retain raw RED/GREEN and teeth output.

- [x] **Step 5: Apply the humanizer review to authored prose.** Preserve the specified caller/provider limits, the explanatory abbreviation definitions and the meaning pinned by the tests. Do not replace factual caveats with generic encouragement.

- [x] **Step 6: Format, lint, typecheck, commit and obtain the required task review.**

```bash
pnpm format
pnpm lint
pnpm typecheck
```

Snapshots do not include the new sheet until Task 4, so do not regenerate them here. Add raw evidence to the report, then stage only this task's files and obtain its independent review.

```bash
git -C .. add web/src/lib/cheatsheets/caching.ts web/src/lib/cheatsheets/caching.test.ts web/src/components/CachingReference.test.tsx docs/superpowers/reports/2026-10-13-stage-09-reference.md
git -C .. commit -m 'feat(caching): add a freshness and invalidation lookup' -m 'Co-Authored-By: Codex Opus 4.8 (1M context) <noreply@anthropic.com>'
```

---

### Task 3: Author the scaling lookup

**Files:**
- Create: `web/src/lib/cheatsheets/scaling.ts`
- Tests: `web/src/lib/cheatsheets/scaling.test.ts`, `web/src/components/ScalingReference.test.tsx`

**Interfaces:**
- Consumes: `Cheatsheet` with `additionalSources?: SourceCitation[]`, `sheetSources(sheet: Cheatsheet): SourceCitation[]`, and `CheatsheetView({ sheet }: { sheet: Cheatsheet })` from Task 1.
- Produces: `export const scaling: Cheatsheet` with slug `scaling`, group `Architecture`, and stage `09-performance-optimization`. Task 4 will import this value; this task does not register it.

- [x] **Step 1: Write the tests below before the data module.**

#### Source: `web/src/lib/cheatsheets/scaling.test.ts`

```ts
import { expect, test } from 'vitest'
import { scaling } from './scaling'
import { sheetSources } from './sheet-sources'
const rows = scaling.sections.flatMap((section) => section.rows)
const find = (term: string) => rows.find((row) => row.term === term)!
const text = rows.map((row) => `${row.what} ${row.when ?? ''}`).join('\n')

test('infrastructure scaling is a stage 09 lookup without rewriting its team-scaling lesson', () => {
  expect(scaling.title).toBe('Infrastructure Scaling')
  expect(scaling.stage).toBe('09-performance-optimization')
  expect(scaling.sections.map((section) => section.title)).toEqual([
    'Locate the limit',
    'Choose routing',
    'Check health and overload',
    'Prove the outcome',
  ])
  expect(scaling.sections[0].note).toMatch(/team practice/)
})
test('adding targets and distributing requests do not pretend to remove a shared dependency limit', () => {
  expect(find('Routing and dependencies').what).toMatch(
    /do not establish more capacity in a shared database/,
  )
  expect(find('Horizontal capacity').when).toMatch(
    /state, session and connection/,
  )
})
test('ALB routing choices keep workload and incompatible-feature caveats close to the choice', () => {
  expect(scaling.sections[1].note).toMatch(/AWS.*ALB/)
  expect(find('Round robin').when).toMatch(/similarly costly requests/)
  expect(find('Least outstanding requests').when).toMatch(
    /does not support slow start/,
  )
  expect(find('Weighted random').when).toMatch(
    /does not support sticky sessions or slow start/,
  )
})
test('failed health checks are not a guarantee of zero traffic when ALB fails open', () => {
  expect(find('Health checks and fail-open').what).toMatch(
    /all registered targets are unhealthy.*fails open.*regardless of health/,
  )
  expect(find('Health checks and fail-open').when).toMatch(
    /not proof that all traffic.*stopped/,
  )
})
test('overload guidance keeps queues and retries bounded while uncertain side effects await reconciliation', () => {
  expect(find('Admission and degradation').what).toMatch(/queues bounded/)
  expect(find('Retries and uncertain outcomes').what).toMatch(
    /bounded retry.*already succeeded before replay/,
  )
  expect(text).toMatch(/oldest pending work/)
  expect(text).toMatch(/correctness regresses/)
})
test('scaling credits AWS and Google SRE and inspects attributes without a mutation command', () => {
  expect(sheetSources(scaling).map((citation) => citation.author)).toEqual([
    'AWS',
    'AWS',
    'Google SRE',
  ])
  expect(rows.find((row) => row.code?.startsWith('aws '))!.code).toContain(
    'describe-target-group-attributes',
  )
  expect(rows.some((row) => row.code?.includes('modify-target-group'))).toBe(
    false,
  )
})
```

#### Source: `web/src/components/ScalingReference.test.tsx`

```tsx
import { render, screen, within } from '@testing-library/react'
import { expect, test } from 'vitest'
import { scaling } from '@/lib/cheatsheets/scaling'
import { CheatsheetView } from './Cheatsheet'

test('the real scaling lookup renders provider limits and fail-open behavior rather than just the algorithm names', () => {
  render(<CheatsheetView sheet={scaling} />)
  expect(screen.getByText(/This is infrastructure scaling/)).toBeTruthy()
  expect(
    screen.getByText(/If all registered targets are unhealthy.*fails open/),
  ).toBeTruthy()
  expect(
    screen.getByText(/does not support sticky sessions or slow start/),
  ).toBeTruthy()
  expect(
    screen.getByText(/do not establish more capacity in a shared database/),
  ).toBeTruthy()
  expect(
    screen
      .getByRole('link', { name: /Performance Optimization/ })
      .getAttribute('href'),
  ).toBe('/stages/09-performance-optimization')
})
test('the scaling sheet credits both publishers and exposes the read-only attribute command', () => {
  render(<CheatsheetView sheet={scaling} />)
  const footer = document.querySelector('footer')!
  expect(within(footer).getAllByRole('link')).toHaveLength(3)
  expect(
    within(footer)
      .getByRole('link', { name: 'Handling Overload' })
      .getAttribute('href'),
  ).toBe('https://sre.google/sre-book/handling-overload/')
  expect(within(footer).getAllByText(/AWS/)).toHaveLength(2)
  expect(
    screen.getByText(/aws elbv2 describe-target-group-attributes/),
  ).toBeTruthy()
  expect(screen.queryByText(/modify-target-group-attributes/)).toBeNull()
})
```

- [x] **Step 2: Run RED.**

```bash
pnpm exec vitest run src/lib/cheatsheets/scaling.test.ts src/components/ScalingReference.test.tsx
```

Expected: the missing `scaling.ts` import prevents the new tests running. Save that output as missing implementation, then use the behavioral teeth check after GREEN to disprove a vacuous test.

- [x] **Step 3: Add this complete authored data module.** Its examples are literal teaching strings, never executed by the app. Keep syntax in `code`/`example` and explanatory prose in `what`/`when`. Do not register this sheet yet.

#### Source: `web/src/lib/cheatsheets/scaling.ts`

```ts
import type { Cheatsheet } from './types'

export const scaling: Cheatsheet = {
  slug: 'scaling',
  title: 'Infrastructure Scaling',
  group: 'Architecture',
  stage: '09-performance-optimization',
  blurb:
    'Find the constrained resource, compare routing choices, plan for overload, and prove the user outcome.',
  source: {
    title: 'Application Load Balancer target-group attributes',
    author: 'AWS',
    url: 'https://docs.aws.amazon.com/elasticloadbalancing/latest/application/edit-target-group-attributes.html',
  },
  additionalSources: [
    {
      title: 'Application Load Balancer target-group health checks',
      author: 'AWS',
      url: 'https://docs.aws.amazon.com/elasticloadbalancing/latest/application/target-group-health-checks.html',
    },
    {
      title: 'Handling Overload',
      author: 'Google SRE',
      url: 'https://sre.google/sre-book/handling-overload/',
    },
  ],
  sections: [
    {
      title: 'Locate the limit',
      note: "This is infrastructure scaling. Stage 09's Scaling to a team section describes team practice. Routing and added capacity are candidates to justify with evidence, not routine fixes for every slow request.",
      rows: [
        {
          term: 'Constrained resource',
          what: 'Name the user outcome, workload and limiting resource using measurements. CPU, memory, connections, storage or a shared dependency can constrain different operations.',
          when: 'A utilization chart alone does not define the observer, duration or customer harm.',
        },
        {
          term: 'Vertical capacity',
          what: 'Increase resources on one instance when evidence shows its resource limit is the constraint.',
          when: 'Check the remaining limit, failure exposure and cost rather than assuming a larger instance is faster.',
        },
        {
          term: 'Horizontal capacity',
          what: 'Add replicas when the work can be safely distributed and the shared dependencies can support it.',
          when: 'Check state, session and connection assumptions before adding targets.',
        },
        {
          term: 'Routing and dependencies',
          what: 'A load balancer distributes requests. More application replicas do not establish more capacity in a shared database; reducing expensive work is a different candidate.',
          when: 'Check the dependency that remains shared and identify what the proposed change actually relieves.',
        },
      ],
    },
    {
      title: 'Choose routing',
      note: 'The following are AWS Application Load Balancer (ALB) target-group algorithms. A provider-specific setting is not a universal algorithm list. Sticky sessions can bypass subsequent routing choices.',
      rows: [
        {
          term: 'Round robin',
          what: 'Distribute requests across healthy targets in sequential order under normal routing conditions.',
          when: 'An ALB default suited to similarly costly requests and similarly capable targets; stickiness affects subsequent target selection.',
        },
        {
          term: 'Least outstanding requests',
          what: 'Choose the target with the fewest in-flight requests.',
          when: 'An ALB option for varying request cost or target capability. It does not support slow start; sticky sessions affect subsequent selection.',
        },
        {
          term: 'Weighted random',
          what: 'Randomly distribute requests across healthy targets; optional Automatic Target Weights anomaly mitigation can adjust distribution.',
          when: 'ALB weighted random does not support sticky sessions or slow start. Check the intended workload and feature compatibility.',
        },
        {
          code: 'aws elbv2 describe-target-group-attributes --target-group-arn "$TARGET_GROUP_ARN"',
          what: 'Read target-group attributes without changing routing. TARGET_GROUP_ARN must name your permitted test group; AWS credentials and read permission are required.',
          when: 'Inspect routing, stickiness and health settings before proposing a mutation.',
        },
      ],
    },
    {
      title: 'Check health and overload',
      note: 'Health checks and routing do not create unlimited capacity. Define the operation the probe represents and the behavior when capacity or targets fail.',
      rows: [
        {
          term: 'Health checks and fail-open',
          what: 'ALB normally routes to healthy targets. If all registered targets are unhealthy, it fails open and can route to them regardless of health status.',
          when: 'A failed probe is not proof that all traffic to that target has stopped; inspect health/routing thresholds as well as the reason code.',
        },
        {
          term: 'Draining and failure capacity',
          what: 'Deregistration allows in-flight work time to finish. Check remaining target and dependency capacity while a target or zone is unavailable.',
          when: 'A connection terminated before draining completes can fail a request; do not equate a removed target with completed customer work.',
        },
        {
          term: 'Admission and degradation',
          what: 'Keep admitted work and queues bounded. Under overload, use a defined safe degraded response or reject excess work instead of letting backlog grow without a limit.',
          when: 'Degrade only when the user contract permits it; stale payment or authorization state is not a safe shortcut.',
        },
        {
          term: 'Retries and uncertain outcomes',
          what: 'Retries add work to an overloaded service. Use a bounded retry policy and establish whether a timed-out side effect already succeeded before replay.',
          when: 'A charge or write may have completed before the timeout. Reconcile uncertain outcomes rather than assuming retry means recovery.',
        },
      ],
    },
    {
      title: 'Prove the outcome',
      note: 'There is no universal requests-per-second target or replica count. Example workloads are illustrative; measure the same operation before and after.',
      rows: [
        {
          term: 'User latency and errors',
          what: 'Compare the same start/end observer, segment, workload and collection window. Define the percentile population and keep failures visible. A p95 is the duration at the 95th percentile of that population.',
          when: 'A faster routing or server span does not prove the user operation improved.',
        },
        {
          term: 'Resource and delayed work',
          what: 'Check the limiting resource, shared dependencies and oldest pending work where applicable. Verify capacity during failure as well as normal traffic.',
          when: 'A healthy homepage or an empty request queue does not prove that downstream work completed.',
        },
        {
          term: 'Correctness and cost',
          what: 'Retest state/session assumptions and actual customer outcomes. Compare resource cost, record unresolved limits, and keep or revert the change from that evidence.',
          when: 'Adding replicas is not a win if the outcome still misses its target or correctness regresses.',
        },
      ],
    },
  ],
}
```

- [x] **Step 4: Run the same command for GREEN, then perform the named teeth check.**

Temporarily replace `it fails open and can route to them regardless of health status` in the health row with `it blocks all traffic to unhealthy targets`. Run `pnpm exec vitest run src/lib/cheatsheets/scaling.test.ts`; expect only the failed-health-checks guard to fail, with the other unit tests passing. Restore the data and rerun the full Task 3 command for GREEN. Retain raw output.

- [x] **Step 5: Apply the humanizer review to authored prose.** Preserve the specified caller/provider limits, the explanatory abbreviation definitions and the meaning pinned by the tests. Do not replace factual caveats with generic encouragement.

- [x] **Step 6: Format, lint, typecheck, commit and obtain the required task review.**

```bash
pnpm format
pnpm lint
pnpm typecheck
```

Snapshots do not include the new sheet until Task 4, so do not regenerate them here. Add raw evidence to the report, then stage only this task's files and obtain its independent review.

```bash
git -C .. add web/src/lib/cheatsheets/scaling.ts web/src/lib/cheatsheets/scaling.test.ts web/src/components/ScalingReference.test.tsx docs/superpowers/reports/2026-10-13-stage-09-reference.md
git -C .. commit -m 'feat(scaling): add a routing and overload lookup' -m 'Co-Authored-By: Codex Opus 4.8 (1M context) <noreply@anthropic.com>'
```

---

### Task 4: Publish both lookups and reconcile generated evidence

**Files:**
- Modify: `web/src/lib/cheatsheets/index.ts`, `web/src/lib/cheatsheets/index.test.ts`
- Tests: `web/src/lib/cheatsheets/stage09-reference.test.ts`, `web/src/components/Stage09Reference.test.tsx`
- Generate: `reference/cheatsheets.md`, `web/src/lib/cheatsheets/highlighted.generated.ts`
- Append: `reference/cheatsheet-sources.md`, `reference/stage-09-performance-sources.md`, `docs/superpowers/reports/2026-10-13-stage-09-reference.md`
- Update at handoff: `docs/task.md`, `docs/tracker.md`, `KICKOFF.md`
- Append at handoff: `docs/superpowers/specs/2026-08-14-reference-hub-design.md` (dated citation-support follow-up; retain its original decisions)

**Interfaces:**
- Consumes: `caching: Cheatsheet`, `scaling: Cheatsheet`, `sheetSources(sheet): SourceCitation[]` from Tasks 1–3.
- Produces: both registry entries/routes, 22 drawn of 27 registered, unchanged five language placeholders, generated Markdown/highlight snapshots and delivery evidence.
- Existing route params, sitemap and audit discovery already derive from `CHEATSHEETS`; no hand-maintained URL list or framework configuration edit is required.

- [ ] **Step 1: Add these integrated tests.** They must fail before registry edits.

#### Source: `web/src/lib/cheatsheets/stage09-reference.test.ts`

```ts
import { expect, test } from 'vitest'
import { cheatsheetsForStage, CHEATSHEETS, isDrawn } from './index'
import { renderCheatsheets } from './render'
import { sheetSources } from './sheet-sources'

test('stage 09 exposes both drawn companion sheets without consuming the five language placeholders', () => {
  const sheets = cheatsheetsForStage('09-performance-optimization')
  expect(sheets.map((sheet) => sheet.slug).sort()).toEqual([
    'caching',
    'scaling',
  ])
  expect(sheets.every(isDrawn)).toBe(true)
  expect(CHEATSHEETS.filter(isDrawn)).toHaveLength(22)
  expect(CHEATSHEETS).toHaveLength(27)
  expect(
    CHEATSHEETS.filter((sheet) => !isDrawn(sheet))
      .map((sheet) => sheet.slug)
      .sort(),
  ).toEqual(['express', 'java', 'javascript', 'python', 'spring-boot'])
})
test('generated Markdown includes each companion, its load-bearing caveats and every supporting source', () => {
  const markdown = renderCheatsheets()
  expect(markdown).toContain('## Caching')
  expect(markdown).toContain('## Infrastructure Scaling')
  expect(markdown).toContain('Server Actions only')
  expect(markdown).toContain('revalidateTag(tag, { expire: 0 })')
  expect(markdown).toContain('all registered targets are unhealthy')
  expect(markdown).toContain('fails open')
  for (const sheet of cheatsheetsForStage('09-performance-optimization')) {
    for (const citation of sheetSources(sheet)) {
      expect(markdown).toContain(
        `Source: [${citation.title}](${citation.url}) — ${citation.author}.`,
      )
    }
  }
})
```

#### Source: `web/src/components/Stage09Reference.test.tsx`

```tsx
import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import { cheatsheetsForStage } from '@/lib/cheatsheets'
import { CheatsheetView } from './Cheatsheet'

test.each(['caching', 'scaling'])(
  'the registered %s route data renders drawn content and its stage tether',
  (slug) => {
    const sheet = cheatsheetsForStage('09-performance-optimization').find(
      (sheet) => sheet.slug === slug,
    )
    expect(sheet).toBeDefined()
    render(<CheatsheetView sheet={sheet!} />)
    expect(screen.queryByText('Sheet not drawn')).toBeNull()
    expect(screen.getAllByRole('heading', { level: 2 }).length).toBeGreaterThan(
      0,
    )
    expect(
      screen
        .getByRole('link', { name: /Performance Optimization/ })
        .getAttribute('href'),
    ).toBe('/stages/09-performance-optimization')
    expect(screen.getByText('Sources', { exact: true })).toBeTruthy()
  },
)
```

- [ ] **Step 2: Run integrated RED.**

```bash
pnpm exec vitest run src/lib/cheatsheets/stage09-reference.test.ts src/components/Stage09Reference.test.tsx
```

Expected: Stage 09 lookup returns no sheets, so both registered-render cases and the new drawn-count/Markdown assertions fail. Save the output and identify the missing-registration failure rather than treating it as a renderer defect.

- [ ] **Step 3: Add the following imports and registry entries.** Place the imports beside existing local imports and both values before `...PLANNED` in `CHEATSHEETS`. Keep every old value.

```ts
import { caching } from './caching'
import { scaling } from './scaling'
```

```ts
  caching,
  scaling,
  ...PLANNED,
```

The existing `isDrawn distinguishes a sheet with content from a registered placeholder` guard in `index.test.ts` contains the sorted drawn slug list. Insert `'caching',` between `'aws-deployment',` and `'ci-cd',` and `'scaling',` between `'post-deploy-verification',` and `'sdlc',`. Do not change any other expected slug.

- [ ] **Step 4: Run the integrated test command for GREEN, then expose stale generated artifacts before regenerating.**

```bash
pnpm exec vitest run src/lib/cheatsheets/render.test.ts src/lib/cheatsheets/generate-highlighted.test.ts
```

Expected: snapshot mismatch because registry content changed. Preserve that RED. Then regenerate using the repository commands and rerun the same guards:

```bash
pnpm gen:cheatsheets
pnpm gen:highlighted
pnpm exec vitest run src/lib/cheatsheets/index.test.ts src/lib/cheatsheets/stage09-reference.test.ts src/lib/cheatsheets/render.test.ts src/lib/cheatsheets/generate-highlighted.test.ts src/components/Stage09Reference.test.tsx
```

Expected: all focused guards GREEN. The generated highlighting map grows because the generator gathers every snippet, even when a row currently renders it as plain code; do not hand-edit or omit that snapshot.

- [ ] **Step 5: Prove integrated registration has teeth.** Temporarily replace only the `scaling,` registry value with `{ ...scaling, stage: '03-architecture' },`; run `pnpm exec vitest run src/lib/cheatsheets/stage09-reference.test.ts` without a name filter. Expect only the Stage 09 companion/tether test to fail, while the generated-Markdown content test passes. Restore the entry and rerun the full integrated GREEN command. Never regenerate snapshots while the teeth mutation is present.

- [ ] **Step 6: Append this source mapping to the source ledger.** The audit receives a dated follow-up linking to that new ledger section; keep its 2026-10-08 findings as history. Text sources are consulted; no local image is copied, converted or published.

#### Source: `reference/cheatsheet-sources.md (append section)`

```markdown
### Stage 09 lookup companions · W-6.3q

The caching/scaling sheets are original practical lookups, not transcriptions of a gathered graphic. Their TypeScript modules are the source of the generated reference Markdown. The source list is displayed on each sheet through the primary citation and supporting citations. No image plate is selected in this round.

| Sheet / sections | First-party reference | What it supports |
|---|---|---|
| caching / boundary, lifetime | [Next.js use cache](https://nextjs.org/docs/app/api-reference/directives/use-cache) | Cache Components prerequisite, async scopes, request-value boundaries and hosting caveats |
| caching / lifetime | [Next.js cacheLife](https://nextjs.org/docs/app/api-reference/functions/cacheLife), [cacheTag](https://nextjs.org/docs/app/api-reference/functions/cacheTag) | Lifetime profiles and tagged reads |
| caching / invalidation | [Next.js updateTag](https://nextjs.org/docs/app/api-reference/functions/updateTag), [revalidateTag](https://nextjs.org/docs/app/api-reference/functions/revalidateTag) | Caller scope, immediate expiry, stale-while-revalidate and non-deprecated signatures |
| caching / CDN evidence | [Cloudflare cache responses](https://developers.cloudflare.com/cache/concepts/cache-responses/), [retention versus freshness](https://developers.cloudflare.com/cache/concepts/retention-vs-freshness/) | Provider-specific response status, retention and freshness |
| scaling / routing, failure | [AWS ALB attributes](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/edit-target-group-attributes.html), [target-group health checks](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/target-group-health-checks.html) | Algorithm conditions, incompatible features, draining and fail-open behavior |
| scaling / capacity, overload | [Google SRE Handling Overload](https://sre.google/sre-book/handling-overload/) | Workload-dependent capacity, admission, degradation and overload limits |

The comparable-outcome, authorization and uncertain-side-effect checks are this playbook's application discipline, carried from the reviewed Stage 09 chapter and incident guidance. They are not a universal checklist attributed to one provider. Read-only commands use illustrative domains or a caller-supplied permitted target-group ARN. No backend or infrastructure was measured to author these rows.

Deferred: diagrams, image republication, runtime configuration, Stage 09 chapter/port edits, glossary/stack surfacing and the five language sheets. The source date and actual execution/verification evidence are recorded in the round's execution report.
```

#### Source: `reference/stage-09-performance-sources.md (append section)`

```markdown
## W-6.3q lookup follow-up

The caching and infrastructure-scaling lookup companions use the references mapped in [the source ledger](cheatsheet-sources.md), under Stage 09 lookup companions. The original chapter audit above remains a record of the 2026-10-08 research pass. See the round's [execution report](../docs/superpowers/reports/2026-10-13-stage-09-reference.md) for the actual source-check date, source corrections and verification evidence.

The sheets are original structured lookups. No source image was selected, copied, converted or registered in this round. Their TypeScript modules are the content source; the generated Markdown preserves the same text and citation list.
```

- [ ] **Step 7: Recheck first-party references after reading the complete plan.** In the execution report, record the date and specifically confirm `updateTag` caller scope, `revalidateTag` profiles, Cloudflare status distinctions, ALB feature compatibility and all-unhealthy fail-open. Compare the final authored rows against the approved spec. If a factual mismatch emerges, record provenance and repair test-first within approved scope; do not silently widen the chapter or renderer.

- [ ] **Step 8: Run the full verification section below, then commit app/generated/source-ledger changes.** Use these commands from `web/` after the gate and raw report update:

```bash
git -C .. add web/src/lib/cheatsheets/index.ts web/src/lib/cheatsheets/index.test.ts web/src/lib/cheatsheets/stage09-reference.test.ts web/src/components/Stage09Reference.test.tsx reference/cheatsheets.md web/src/lib/cheatsheets/highlighted.generated.ts reference/cheatsheet-sources.md reference/stage-09-performance-sources.md docs/superpowers/reports/2026-10-13-stage-09-reference.md
git -C .. commit -m 'feat(reference): register stage 09 lookup companions' -m 'Co-Authored-By: Codex Opus 4.8 (1M context) <noreply@anthropic.com>'
```

Keep records-only updates in a separate `docs(tracker): record stage 09 reference verification` commit. Both include the required co-author trailer.

- [ ] **Step 9: Record actual evidence and hand off.** The report must contain raw RED/GREEN/teeth fences for Tasks 1–4, command exits, current refs, measured UI results, cold lookup outcomes, review findings and deferrals. Task/tracker/KICKOFF record 22/27 only for the implementation branch until a separately approved merge lands. On develop, keep 20/25 until then. Do not predict future test counts, merge SHAs or deployment status. Append an approved citation-support decision after rederiving the next available D id; preserve prior decision rows. Update W-6.3q checkboxes only when the named work actually completes.

Append the following dated follow-up to the existing reference-hub design, in the records commit. It documents the new contract without rewriting the original single-source decision.

```markdown
## W-6.3q supporting citations (design approved 2026-10-13)

The [Stage 09 companion design](2026-10-13-stage-09-reference-design.md) adds optional `additionalSources` containing text-only `SourceCitation` entries. The existing `source` remains the primary citation and sole image-plate owner. The web and generated Markdown consume `sheetSources(sheet)` in primary/supporting order, preserving title, author and optional URL. Existing single-source sheets retain their credit and image behavior. Supporting-only sheets receive a credit without inventing a primary image owner.

This extends the original attribution contract for lookups that combine first-party guidance from several publishers. The original decisions above remain the record of the skeleton round; see the W-6.3q execution report and tracker for implementation and integration evidence.
```

---

## Verification (after all tasks)

- [ ] Run the cheapest-first gate from `web/`, one command at a time, preserving actual stdout/stderr and exit status:

```bash
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm test:e2e
pnpm test:dev-console
```

The production and development browser runs use different servers/build modes; report them separately. Do not count earlier Stage 09 browser results as evidence for the changed shared renderer. Do not run `pnpm test:prod` as a working-tree check. Build/audits require the repository's existing environment; report any unavailable dependency rather than claiming a pass.

- [ ] Inspect `/reference/caching` and `/reference/scaling` in both themes at 320, 375, 768, 1024, 1440, 1920 and 2560px. Check all distinct text/background pairs for AA, no page overflow and source links at least 44px below lg. Inspect each literal/snippet and the seven-source caching footer. Scroll within code containers if needed; never allow page-wide overflow. Preserve measurements/screenshots with page, width and theme provenance. There is no stage-panel height limit for these sheets.
- [ ] Verify both routes through the reference index, direct URL, Stage 09 tether, sitemap and generated Markdown. Existing audits derive reference URLs from the registry; confirm they included the new routes.
- [ ] Perform a cold lookup pass blind to the plan/spec. Ask the reader: which invalidation can this webhook call; does a HIT prove current application data; which ALB algorithm fits uneven in-flight work; do failed probes stop all traffic? Record answer, located section and caveat. Repair real misses test-first and rerun only affected checks before the final gate.
- [ ] Obtain the final independent whole-branch review across the complete diff, including shared citation rendering, actual source content, generated snapshots, source ledger and documentation. Review must cite evidence, severities, provenance and branch state. Resolve blocking findings and verify fixes before proposing integration.
- [ ] Recheck `git diff --check`, tracked state, new registry counts and refs. Present the concrete merge/PR/as-is choices using finishing-a-development-branch, with a plan-specific recommendation. Every merge into develop requires explicit new approval; main promotion belongs to the user.

## Planning validation and execution handoff

Planning checks validate source structure, types and lint in a virtual overlay; they are not RED/GREEN implementation runs, a passing app gate, or a browser audit. No production files are changed while writing this plan. The plan and records are committed separately from future implementation.

Planning evidence, 2026-10-13: all 15 proposed TypeScript/TSX source blocks plus the two registry/test edits passed a full-project virtual TypeScript check and ESLint with zero diagnostics or warnings. The first pass caught an unsupported `exact` option on Testing Library's role query; it was removed before the final pass. Self-review checked all spec requirements, the five Review Focus cases, task interfaces, placeholder absence, test declarations and source claims against first-party documentation after drafting. The prose review retained the required caveats and plain reference voice. Nine new test files propose 34 cases, including the two-case registered-render table; none was executed during planning. Raw planning validation and its inputs are retained locally under `.superpowers/planning/2026-10-13-stage-09-reference/`.

Please review the written plan before execution. The prior Subagent-Driven choice applied to the completed Stage 09 port, not this new reference round. Recommended for this four-task plan: Subagent-Driven, because the shared citation change affects existing sheets and deserves an independent gate before the two content tasks and final registry assembly. Native keeps implementation in this session and saves the fresh implementer contexts; repository-required per-task and final independent reviews still apply.
