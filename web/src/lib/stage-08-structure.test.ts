import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { expect, test } from 'vitest'

const path = fileURLToPath(
  new URL('../../../docs/08-security-audit.md', import.meta.url),
)
const doc = () => readFileSync(path, 'utf8')

test('a second user tests the same invoice across every object operation', () => {
  const source = doc()
  expect(source).toContain('### Test the policy with two users')
  for (const operation of ['read', 'update', 'delete', 'export']) {
    expect(source).toContain(`| ${operation} |`)
  }
  expect(source).toContain('User B')
  expect(source).toContain('unchanged')
})

test('the audit has a threat model and a finding that can be retested', () => {
  const source = doc()
  expect(source).toContain('### Draw the trust boundaries')
  expect(source).toContain('### Record and retest a finding')
  for (const field of ['Evidence', 'Impact', 'Fix', 'Retest', 'Risk owner']) {
    expect(source).toContain(`| ${field} |`)
  }
})

test('SQL guidance distinguishes bound parameters from raw insertion', () => {
  const source = doc()
  expect(source).toContain('sql.raw()')
  expect(source).toContain('parameterized')
  expect(source).toContain('unescaped')
  expect(source).not.toContain(
    'Any interpolated user input in a raw query is a finding.',
  )
})

test('operational caveats and AI limits accompany the examples', () => {
  const source = doc()
  expect(source).toContain('includeSubDomains')
  expect(source).toMatch(/every\s+subdomain/)
  expect(source).toContain('### AI in security audit')
  expect(source).toContain('verify the permission policy')
})
