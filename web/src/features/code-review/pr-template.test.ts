import { describe, expect, test } from 'vitest'
import { PR_TEMPLATE } from './pr-template'
import { fences } from './doc-source'

describe('PR template data', () => {
  test('template lines match the doc fenced code block', () => {
    const blocks = fences()
    const templateText = PR_TEMPLATE.lines.map((l) => l.text).join('\n')
    expect(blocks).toContain(templateText)
  })

  test('exactly one pivot line', () => {
    const pivots = PR_TEMPLATE.lines.filter((l) => l.pivot)
    expect(pivots).toHaveLength(1)
  })

  test('pivot is on the Why section', () => {
    const pivot = PR_TEMPLATE.lines.find((l) => l.pivot)!
    expect(pivot.text).toContain('Why')
  })
})
