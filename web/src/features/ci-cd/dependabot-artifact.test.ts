import { describe, expect, test } from 'vitest'
import { DEPENDABOT_ARTIFACT } from './dependabot-artifact'

describe('dependabot-artifact data', () => {
  test('language is yaml', () => {
    expect(DEPENDABOT_ARTIFACT.language).toBe('yaml')
  })

  test('filename is dependabot.yml', () => {
    expect(DEPENDABOT_ARTIFACT.filename).toBe('.github/dependabot.yml')
  })

  test('contains groups', () => {
    const text = DEPENDABOT_ARTIFACT.lines.map((l) => l.text).join('\n')
    expect(text).toContain('groups')
  })

  test('contains open-pull-requests-limit', () => {
    const text = DEPENDABOT_ARTIFACT.lines.map((l) => l.text).join('\n')
    expect(text).toContain('open-pull-requests-limit')
  })

  test('at least two annotated lines', () => {
    const annotated = DEPENDABOT_ARTIFACT.lines.filter((l) => l.note)
    expect(annotated.length).toBeGreaterThanOrEqual(2)
  })

  test('at most one pivot line', () => {
    const pivots = DEPENDABOT_ARTIFACT.lines.filter((l) => l.pivot)
    expect(pivots.length).toBeLessThanOrEqual(1)
  })
})
