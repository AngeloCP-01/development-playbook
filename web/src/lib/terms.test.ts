import { expect, test } from 'vitest'
import { TERMS, getTerm } from './terms'

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
