import { describe, expect, test } from 'vitest'
import { MIGRATION_ARTIFACT } from './migration-artifact'
import { fences } from './doc-source'

describe('migration artifact data', () => {
  test('expand SQL matches doc fence', () => {
    const blocks = fences()
    expect(blocks).toContain('ALTER TABLE users ADD COLUMN full_name text;')
  })

  test('migrate SQL matches doc fence', () => {
    const blocks = fences()
    expect(blocks).toContain(
      'UPDATE users SET full_name = name WHERE full_name IS NULL;',
    )
  })

  test('contract SQL matches doc fence', () => {
    const blocks = fences()
    expect(blocks).toContain('ALTER TABLE users DROP COLUMN name;')
  })

  test('exactly one pivot line (the irreversible step)', () => {
    const pivots = MIGRATION_ARTIFACT.lines.filter((l) => l.pivot)
    expect(pivots).toHaveLength(1)
    expect(pivots[0].text).toContain('DROP COLUMN')
  })

  test('language is sql', () => {
    expect(MIGRATION_ARTIFACT.language).toBe('sql')
  })

  test('has id and filename', () => {
    expect(MIGRATION_ARTIFACT.id).toBeTruthy()
    expect(MIGRATION_ARTIFACT.filename).toBeTruthy()
  })
})
