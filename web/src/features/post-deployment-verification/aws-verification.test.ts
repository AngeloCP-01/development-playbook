import { describe, expect, test } from 'vitest'
import { AWS_VERIFICATION } from './aws-verification'

describe('AWS verification artifact data', () => {
  test('language is bash', () => {
    expect(AWS_VERIFICATION.language).toBe('bash')
  })

  test('has id and filename', () => {
    expect(AWS_VERIFICATION.id).toBeTruthy()
    expect(AWS_VERIFICATION.filename).toBeTruthy()
  })

  test('contains wait services-stable command', () => {
    const text = AWS_VERIFICATION.lines.map((l) => l.text).join('\n')
    expect(text).toContain('aws ecs wait services-stable')
  })

  test('contains describe-services command', () => {
    const text = AWS_VERIFICATION.lines.map((l) => l.text).join('\n')
    expect(text).toContain('aws ecs describe-services')
  })

  test('contains describe-target-health command', () => {
    const text = AWS_VERIFICATION.lines.map((l) => l.text).join('\n')
    expect(text).toContain('describe-target-health')
  })

  test('contains logs tail command', () => {
    const text = AWS_VERIFICATION.lines.map((l) => l.text).join('\n')
    expect(text).toContain('aws logs tail')
  })

  test('at least six annotated lines', () => {
    const annotated = AWS_VERIFICATION.lines.filter((l) => l.note)
    expect(annotated.length).toBeGreaterThanOrEqual(6)
  })

  test('exactly one pivot line on describe-target-health', () => {
    const pivots = AWS_VERIFICATION.lines.filter((l) => l.pivot)
    expect(pivots).toHaveLength(1)
    expect(pivots[0].text).toContain('describe-target-health')
  })
})
