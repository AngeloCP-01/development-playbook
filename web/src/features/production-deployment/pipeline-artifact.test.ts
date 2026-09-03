import { describe, expect, test } from 'vitest'
import { PIPELINE_ARTIFACT } from './pipeline-artifact'

describe('pipeline artifact data', () => {
  test('language is yaml', () => {
    expect(PIPELINE_ARTIFACT.language).toBe('yaml')
  })

  test('has id and filename', () => {
    expect(PIPELINE_ARTIFACT.id).toBeTruthy()
    expect(PIPELINE_ARTIFACT.filename).toBeTruthy()
  })

  test('contains OIDC credential step', () => {
    const text = PIPELINE_ARTIFACT.lines.map((l) => l.text).join('\n')
    expect(text).toContain('role-to-assume')
  })

  test('contains ECR login step', () => {
    const text = PIPELINE_ARTIFACT.lines.map((l) => l.text).join('\n')
    expect(text).toContain('amazon-ecr-login')
  })

  test('contains deploy step', () => {
    const text = PIPELINE_ARTIFACT.lines.map((l) => l.text).join('\n')
    expect(text).toContain('deploy-task-definition')
  })

  test('contains wait-for-service-stability', () => {
    const text = PIPELINE_ARTIFACT.lines.map((l) => l.text).join('\n')
    expect(text).toContain('wait-for-service-stability')
  })

  test('at least three annotated lines', () => {
    const annotated = PIPELINE_ARTIFACT.lines.filter((l) => l.note)
    expect(annotated.length).toBeGreaterThanOrEqual(3)
  })

  test('exactly one pivot line', () => {
    const pivots = PIPELINE_ARTIFACT.lines.filter((l) => l.pivot)
    expect(pivots).toHaveLength(1)
  })
})
