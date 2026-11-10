import { expect, test } from 'vitest'
import {
  CHECKS,
  EMPTY_RECORD,
  FIELDS,
  hasRecord,
  normalizeRecord,
  RECORD_KEY,
  recordMarkdown,
  TEAM_NOTES,
} from './record'

test('the record names its eight decisions and separates seven change checks from three periodic checks', () => {
  expect(RECORD_KEY).toBe('playbook:documentation-change:v1')
  expect(FIELDS.map((f) => f.id)).toEqual([
    'change',
    'reader',
    'documents',
    'source',
    'check',
    'evidence',
    'owner',
    'trigger',
  ])
  expect(CHECKS.map((c) => c.id)).toEqual([
    'affected',
    'decisions',
    'current',
    'configuration',
    'privacy',
    'validation',
    'reviewed',
    'fresh-clone',
    'owners',
    'history',
  ])
  expect(CHECKS.filter((c) => c.periodic).map((c) => c.id)).toEqual([
    'fresh-clone',
    'owners',
    'history',
  ])
  expect(TEAM_NOTES).toHaveLength(5)
  for (const phrase of [
    'without coaching',
    'owner and a review trigger',
    'exceptions and review expectations',
    'did not attend',
    'runbooks and handover',
  ])
    expect(TEAM_NOTES.some((note) => note.includes(phrase))).toBe(true)
})

test('unknown storage keeps only known string fields and unique known checks', () => {
  for (const value of [null, [], 4, 'text', undefined])
    expect(normalizeRecord(value)).toEqual(EMPTY_RECORD)
  expect(
    normalizeRecord({
      change: 'Keep',
      owner: 'Me',
      evidence: 4,
      checked: ['history', 'history', 'unknown', 3],
      secret: 'drop',
    }),
  ).toEqual({
    ...EMPTY_RECORD,
    change: 'Keep',
    owner: 'Me',
    checked: ['history'],
  })
  expect(normalizeRecord({ checked: 'history' }).checked).toEqual([])
  expect(normalizeRecord({ change: null }).change).toBe('')
})

test('a periodic selection alone is an exportable record and unrecorded fields remain visible', () => {
  expect(hasRecord(EMPTY_RECORD)).toBe(false)
  expect(hasRecord({ ...EMPTY_RECORD, change: '  ' })).toBe(false)
  const value = { ...EMPTY_RECORD, checked: ['history' as const] }
  expect(hasRecord(value)).toBe(true)
  const md = recordMarkdown(value)
  expect(md).toContain('## Change and scope\n\nnot recorded')
  expect(md).toContain(
    '- [x] Historical records are labeled and linked; obsolete current procedures are corrected, redirected or retired.',
  )
  expect(md).toContain('- [ ] Affected documentation is identified')
  expect(md.indexOf('## Change and scope')).toBeLessThan(
    md.indexOf('## Review trigger and follow-up'),
  )
  expect(md.indexOf('## Per-change checks')).toBeLessThan(
    md.indexOf('## Periodic checks'),
  )
  expect(md).toContain(
    'Reader-entered claims and selections; recording them does not verify documentation.',
  )
})

test('export preserves the reader literal text and serializes checks in teaching order', () => {
  const value = {
    ...EMPTY_RECORD,
    change: '<img src=x onerror=alert(1)>',
    evidence: '[unknown](javascript:alert(1))',
    checked: ['history', 'affected'] as const,
  }
  const md = recordMarkdown({ ...value, checked: [...value.checked] })
  expect(md).toContain(value.change)
  expect(md).toContain(value.evidence)
  expect(md.indexOf('- [x] Affected documentation')).toBeLessThan(
    md.indexOf('- [x] Historical records'),
  )
  expect(normalizeRecord(EMPTY_RECORD)).not.toBe(EMPTY_RECORD)
})
