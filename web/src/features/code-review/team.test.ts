import { describe, expect, test } from 'vitest'
import { PRACTICES } from './team'
import { flat, h2 } from './doc-source'

describe('team practices data', () => {
  const src = h2('Scaling to a team')

  test('six practices from the bullet list', () => {
    expect(PRACTICES).toHaveLength(6)
  })

  test('unique IDs', () => {
    const ids = PRACTICES.map((p) => p.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  test('distance practice pins against doc', () => {
    expect(flat(src)).toContain(
      flat('they have the distance you have to manufacture'),
    )
  })

  test('severity practice pins against doc', () => {
    expect(flat(src)).toContain(
      flat(
        'Without labels, every comment reads as a demand and reviews turn adversarial',
      ),
    )
  })

  test('receiving review practice pins against doc', () => {
    expect(flat(src)).toContain(
      flat(
        'agreeing with a wrong suggestion to be agreeable puts a bug in the codebase with two names on it',
      ),
    )
  })
})
