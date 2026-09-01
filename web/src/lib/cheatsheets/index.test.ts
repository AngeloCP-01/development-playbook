import { expect, test } from 'vitest'
import { STAGES } from '@/lib/stages'
import {
  CHEATSHEETS,
  cheatsheetBySlug,
  cheatsheetsByGroup,
  cheatsheetsForStage,
} from './index'
import { CHEATSHEET_GROUPS, isDrawn } from './types'

test('every slug is unique, since two sheets on one route is a silent overwrite', () => {
  const slugs = CHEATSHEETS.map((s) => s.slug)
  expect(new Set(slugs).size).toBe(slugs.length)
})

// The tether is the whole point of the section living beside the stages rather
// than apart from them. A stage rename that silently orphans six sheets is the
// failure this catches.
test('every stage tether resolves to a real stage slug', () => {
  const stageSlugs = new Set(STAGES.map((s) => s.slug))
  for (const sheet of CHEATSHEETS) {
    if (sheet.stage === undefined) continue
    expect(stageSlugs.has(sheet.stage), `${sheet.slug} → ${sheet.stage}`).toBe(
      true,
    )
  }
})

test('every group in CHEATSHEET_GROUPS has at least one sheet, so the nav never renders an empty heading', () => {
  for (const group of CHEATSHEET_GROUPS) {
    expect(cheatsheetsByGroup(group).length, group).toBeGreaterThan(0)
  }
})

test('cheatsheetsByGroup partitions the registry with none lost or doubled', () => {
  const total = CHEATSHEET_GROUPS.flatMap((g) => cheatsheetsByGroup(g))
  expect(total).toHaveLength(CHEATSHEETS.length)
})

test('every sheet carries a non-empty title and blurb, because the index renders both', () => {
  for (const sheet of CHEATSHEETS) {
    expect(sheet.title.trim().length, sheet.slug).toBeGreaterThan(0)
    expect(sheet.blurb.trim().length, sheet.slug).toBeGreaterThan(0)
  }
})

// Empty is legal — that is D5 — but an empty *section* is not. A section with no
// rows renders a heading with nothing under it, which reads as a rendering bug.
test('a sheet that has sections has no empty ones', () => {
  for (const sheet of CHEATSHEETS) {
    for (const section of sheet.sections) {
      expect(
        section.rows.length,
        `${sheet.slug} / ${section.title}`,
      ).toBeGreaterThan(0)
    }
  }
})

test('every row has a what, since the middle column is the one that carries meaning', () => {
  for (const sheet of CHEATSHEETS) {
    for (const section of sheet.sections) {
      for (const row of section.rows) {
        expect(
          row.what.trim().length,
          `${sheet.slug} / ${section.title}`,
        ).toBeGreaterThan(0)
      }
    }
  }
})

test('isDrawn distinguishes a sheet with content from a registered placeholder', () => {
  const drawn = CHEATSHEETS.filter(isDrawn)
  expect(drawn.map((s) => s.slug).sort()).toEqual([
    'api-design',
    'architecture-patterns',
    'clean-code',
    'code-review',
    'coding-standards',
    'design-patterns',
    'git-branching',
    'git-commands',
    'playwright',
    'sdlc',
    'solid-principles',
    'testing',
  ])
})

test('cheatsheetBySlug finds a real sheet and returns undefined for a stranger', () => {
  expect(cheatsheetBySlug('architecture-patterns')?.title).toBe(
    'Software Architecture Patterns',
  )
  expect(cheatsheetBySlug('no-such-sheet')).toBeUndefined()
})

test('cheatsheetsForStage returns the sheets tethered to stage 03', () => {
  const slugs = cheatsheetsForStage('03-architecture').map((s) => s.slug)
  expect(slugs.sort()).toEqual([
    'api-design',
    'architecture-patterns',
    'design-patterns',
    'solid-principles',
  ])
})

test('cheatsheetsForStage returns the sheets tethered to stage 06', () => {
  const slugs = cheatsheetsForStage('06-testing').map((s) => s.slug)
  expect(slugs.sort()).toEqual(['playwright', 'testing'])
})

test('cheatsheetsForStage returns the sheet tethered to stage 07', () => {
  const slugs = cheatsheetsForStage('07-code-review').map((s) => s.slug)
  expect(slugs).toEqual(['code-review'])
})

// A sheet transcribed from someone else's graphic must credit them. The site is
// publicly deployed, so an uncredited transcription is a real problem rather
// than an untidy one.
test('a sheet with a source names both the work and its author', () => {
  for (const sheet of CHEATSHEETS) {
    if (!sheet.source) continue
    expect(sheet.source.title.trim().length, sheet.slug).toBeGreaterThan(0)
    expect(sheet.source.author.trim().length, sheet.slug).toBeGreaterThan(0)
  }
})

// A src typo ships a broken-image box and nothing catches it: the page renders,
// the build passes, and only a human looking at that one sheet notices. The
// files live in web/public, so a public path maps to disk by prefixing it.
test('every registered source image exists on disk', async () => {
  const { access } = await import('node:fs/promises')
  const { fileURLToPath } = await import('node:url')

  for (const sheet of CHEATSHEETS) {
    const image = sheet.source?.image
    if (!image) continue
    const onDisk = fileURLToPath(
      new URL(`../../../public${image.src}`, import.meta.url),
    )
    await expect(
      access(onDisk),
      `${sheet.slug} → ${image.src}`,
    ).resolves.toBeUndefined()
  }
})

test('every registered source image carries alt text, since on an undrawn sheet it is the only content', () => {
  for (const sheet of CHEATSHEETS) {
    const image = sheet.source?.image
    if (!image) continue
    expect(image.alt.trim().length, sheet.slug).toBeGreaterThan(0)
  }
})
