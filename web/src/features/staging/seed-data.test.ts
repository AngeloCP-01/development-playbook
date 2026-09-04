import { describe, expect, test } from 'vitest'
import { SEED_ARTIFACT } from './seed-data'
import { fences } from './doc-source'

describe('seed data artifact', () => {
  test('language is ts', () => {
    expect(SEED_ARTIFACT.language).toBe('ts')
  })

  test('filename is src/db/seed.ts', () => {
    expect(SEED_ARTIFACT.filename).toBe('src/db/seed.ts')
  })

  test('lines match the fenced code block in the doc', () => {
    const docFences = fences()
    const tsBlock = docFences.find((f) => f.startsWith('// src/db/seed.ts'))
    expect(tsBlock, 'ts fenced block not found in doc').toBeTruthy()
    const docLines = tsBlock!.split('\n')
    const artifactLines = SEED_ARTIFACT.lines.map((l) => l.text)
    expect(artifactLines).toEqual(docLines)
  })

  test('at least 3 lines carry a note', () => {
    const annotated = SEED_ARTIFACT.lines.filter((l) => l.note)
    expect(annotated.length).toBeGreaterThanOrEqual(3)
  })

  test('at most one pivot line', () => {
    const pivots = SEED_ARTIFACT.lines.filter((l) => l.pivot)
    expect(pivots.length).toBeLessThanOrEqual(1)
  })
})
