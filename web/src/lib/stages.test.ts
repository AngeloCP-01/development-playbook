import { describe, expect, test } from 'vitest'
import { STAGE_CONTENT } from '@/features/stage-content'
import { STAGES, STAGE_GROUPS, getStage, stagesByGroup } from './stages'

// These are the mistakes actually made while editing this file by hand:
// duplicated numbers, a slug that stopped matching its number, a stage
// flipped ready without being registered. W-3 edits it seventeen more times.

test('there are exactly 18 stages, because the playbook says so', () => {
  expect(STAGES).toHaveLength(18)
})

test('stage numbers are unique and zero-padded two digits', () => {
  const nums = STAGES.map((s) => s.num)
  expect(new Set(nums).size).toBe(18)
  for (const n of nums) expect(n).toMatch(/^\d{2}$/)
})

test('every slug is unique and starts with its own number', () => {
  const slugs = STAGES.map((s) => s.slug)
  expect(new Set(slugs).size).toBe(18)
  for (const s of STAGES) expect(s.slug.startsWith(`${s.num}-`)).toBe(true)
})

test('every stage carries a non-empty cadence, the title-block field', () => {
  for (const s of STAGES) expect(s.cadence.trim().length).toBeGreaterThan(0)
})

test('every group in STAGE_GROUPS has at least one stage', () => {
  for (const g of STAGE_GROUPS) {
    expect(stagesByGroup(g).length).toBeGreaterThan(0)
  }
})

test('stagesByGroup partitions all 18 stages with none lost or doubled', () => {
  const total = STAGE_GROUPS.flatMap((g) => stagesByGroup(g))
  expect(total).toHaveLength(18)
})

describe('getStage', () => {
  test('finds a stage by slug', () => {
    expect(getStage('01-product-discovery')?.title).toBe('Product Discovery')
  })
  test('returns undefined for an unknown slug instead of throwing', () => {
    expect(getStage('99-nope')).toBeUndefined()
  })
})

test('every ready stage is registered in STAGE_CONTENT, so no live route renders the placeholder', () => {
  for (const s of STAGES.filter((s) => s.ready)) {
    expect(
      STAGE_CONTENT[s.slug],
      `${s.slug} is ready but unregistered`,
    ).toBeDefined()
  }
})

test('stage 02 is titled Product Planning, since that is the discipline it teaches', () => {
  expect(getStage('02-planning')?.title).toBe('Product Planning')
})

test('stage 02 cadence does not pin it to a slot in a sequence, per the playbook’s central claim', () => {
  const cadence = getStage('02-planning')?.cadence ?? ''
  expect(cadence.toLowerCase()).not.toContain('before architecture')
  expect(cadence.trim().length).toBeGreaterThan(0)
})

test('every STAGE_CONTENT key is a real stage slug, so no dead registration lingers', () => {
  for (const key of Object.keys(STAGE_CONTENT)) {
    expect(getStage(key), `${key} registered but not a stage`).toBeDefined()
  }
})
