import { expect, test } from 'vitest'
import { TERM_VISUALS } from '@/components/term-visuals'
import { TERMS, getTerm } from './terms'
import { getStage } from './stages'

test('every term has a non-empty display name, since the glossary is generated from it', () => {
  for (const [id, t] of Object.entries(TERMS)) {
    expect(t.name?.trim().length, `${id} has no name`).toBeGreaterThan(0)
  }
})

test('every term’s see (when present) is a real stage slug', () => {
  for (const [id, t] of Object.entries(TERMS)) {
    if (t.see) expect(getStage(t.see), `${id} see=${t.see}`).toBeDefined()
  }
})

test('a known key returns its entry', () => {
  expect(getTerm('opportunity-solution-tree')?.short).toBeTruthy()
})

test('an unknown key returns undefined, because <Term> must degrade to plain text', () => {
  expect(getTerm('not-a-real-term')).toBeUndefined()
})

test('every term has a non-empty short and full definition', () => {
  for (const [key, t] of Object.entries(TERMS)) {
    expect(t.short.trim().length, `${key}.short`).toBeGreaterThan(0)
    expect(t.full.trim().length, `${key}.full`).toBeGreaterThan(0)
  }
})

test('npm and pnpm are defined, since stage 04 leans on them', () => {
  expect(getTerm('npm')).toBeDefined()
  expect(getTerm('pnpm')).toBeDefined()
})

test('every term visual is registered against a real term id', () => {
  for (const key of Object.keys(TERM_VISUALS)) {
    expect(getTerm(key), `${key} has a visual but no definition`).toBeDefined()
  }
})

test('stage 02 vocabulary is defined, since the stage introduces words the playbook never used', () => {
  for (const id of [
    'mvp',
    'product-roadmap',
    'product-vision',
    'appetite',
    'vertical-slice',
    'spike',
    'feasibility-risk',
  ]) {
    expect(TERMS[id], `${id} is missing`).toBeDefined()
  }
})
