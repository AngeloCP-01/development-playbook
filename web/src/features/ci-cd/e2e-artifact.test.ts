import { describe, expect, test } from 'vitest'
import { E2E_ARTIFACT } from './e2e-artifact'

describe('e2e-artifact data', () => {
  test('language is yaml', () => {
    expect(E2E_ARTIFACT.language).toBe('yaml')
  })

  test('filename is e2e.yml', () => {
    expect(E2E_ARTIFACT.filename).toBe('.github/workflows/e2e.yml')
  })

  test('contains deployment_status trigger', () => {
    const text = E2E_ARTIFACT.lines.map((l) => l.text).join('\n')
    expect(text).toContain('deployment_status')
  })

  test('contains upload-artifact on failure', () => {
    const text = E2E_ARTIFACT.lines.map((l) => l.text).join('\n')
    expect(text).toContain('upload-artifact')
    expect(text).toContain('failure()')
  })

  test('contains BASE_URL from deployment', () => {
    const text = E2E_ARTIFACT.lines.map((l) => l.text).join('\n')
    expect(text).toContain('BASE_URL')
    expect(text).toContain('environment_url')
  })

  test('at least three annotated lines', () => {
    const annotated = E2E_ARTIFACT.lines.filter((l) => l.note)
    expect(annotated.length).toBeGreaterThanOrEqual(3)
  })

  test('exactly one pivot line', () => {
    const pivots = E2E_ARTIFACT.lines.filter((l) => l.pivot)
    expect(pivots).toHaveLength(1)
  })
})
