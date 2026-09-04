import { describe, expect, test } from 'vitest'
import { CI_ARTIFACT } from './ci-artifact'

describe('ci-artifact data', () => {
  test('language is yaml', () => {
    expect(CI_ARTIFACT.language).toBe('yaml')
  })

  test('filename is ci.yml', () => {
    expect(CI_ARTIFACT.filename).toBe('.github/workflows/ci.yml')
  })

  test('contains concurrency with cancel-in-progress', () => {
    const text = CI_ARTIFACT.lines.map((l) => l.text).join('\n')
    expect(text).toContain('cancel-in-progress')
  })

  test('contains frozen-lockfile', () => {
    const text = CI_ARTIFACT.lines.map((l) => l.text).join('\n')
    expect(text).toContain('--frozen-lockfile')
  })

  test('contains timeout-minutes', () => {
    const text = CI_ARTIFACT.lines.map((l) => l.text).join('\n')
    expect(text).toContain('timeout-minutes')
  })

  test('contains checkout@v7', () => {
    const text = CI_ARTIFACT.lines.map((l) => l.text).join('\n')
    expect(text).toContain('actions/checkout@v7')
  })

  test('at least four annotated lines', () => {
    const annotated = CI_ARTIFACT.lines.filter((l) => l.note)
    expect(annotated.length).toBeGreaterThanOrEqual(4)
  })

  test('at most one pivot line', () => {
    const pivots = CI_ARTIFACT.lines.filter((l) => l.pivot)
    expect(pivots.length).toBeLessThanOrEqual(1)
  })
})
