import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { expect, test } from 'vitest'

const path = fileURLToPath(
  new URL('../../../docs/16-incident-management.md', import.meta.url),
)
const doc = () => readFileSync(path, 'utf8')

// Ignore headings inside fences, but retain fenced content in returned sections.
function section(heading: string, source = doc()): string {
  const lines = source.split('\n')
  let fence: string | undefined
  let start = -1
  let level = 0
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const marker = line.match(/^\s*(`{3,}|~{3,})/)
    if (marker) {
      if (!fence) fence = marker[1]
      else if (marker[1][0] === fence[0] && marker[1].length >= fence.length)
        fence = undefined
      continue
    }
    if (fence) continue
    const match = line.match(/^(#{1,6}) (.+)$/)
    if (!match) continue
    if (start >= 0 && match[1].length <= level)
      return lines.slice(start, i).join('\n')
    if (match[2] === heading) {
      start = i
      level = match[1].length
    }
  }
  if (start < 0) throw new Error(`Missing section: ${heading}`)
  return lines.slice(start).join('\n')
}

const text = (heading: string) => section(heading).replace(/\s+/g, ' ')

test('fenced template headings do not hide the artifact being checked', () => {
  const sample =
    '### Outer\n```markdown\n## Inner\nowner: Ana\n```\n### Next\nstop'
  expect(section('Outer', sample)).toContain('owner: Ana')
  expect(section('Outer', sample)).not.toContain('stop')
  expect(() => section('Absent', sample)).toThrow('Missing section: Absent')
})

test('I2: mitigation permits the investigation needed to choose an action', () => {
  expect(text('The order that matters')).toContain(
    'Investigate enough to choose a safe mitigation',
  )
})
test('I3/M2: impact follows the customer operation even with green web health', () => {
  const s = text('First response: confirm impact and severity')
  expect(s).toContain(
    'A healthy homepage does not prove that a worker completed its job',
  )
  expect(s).toContain('provisional severity')
})
test('I6: rollback suitability includes relevance and compatibility', () => {
  const s = section('Choose a mitigation')
  for (const phrase of [
    'Relevant recent change',
    'schema compatibility',
    'irrelevant',
    'Stop condition',
    'Check effect',
  ])
    expect(s).toContain(phrase)
})
test('I1: suspected compromise has a containment path', () => {
  const s = text('When access may be compromised')
  expect(s).toContain('Contain unauthorized access')
  expect(s).toContain('without delaying urgent containment')
  expect(s).toContain('Availability alone does not establish safety')
})

test('I5: escalation continues when the backup is unreachable', () => {
  const s = text('Escalate when help is unavailable')
  for (const phrase of [
    'acknowledgment deadline',
    'backup is unavailable',
    'explicitly accepts',
  ])
    expect(s).toContain(phrase)
})
test('updates promise a next update without guessing a recovery time', () => {
  const s = section('Communicate while the incident is open')
  const updates = [...s.matchAll(/^> (.+)$/gm)].map((m) => m[1])
  expect(updates).toHaveLength(4)
  for (const update of updates.slice(0, 3))
    expect(update).toMatch(/Next update: \d{2}:\d{2} UTC/)
  expect(updates[0]).toContain('Cause and recovery time are unknown')
  expect(updates[1]).toContain('not yet confirmed')
  expect(updates[3]).toContain('10:40 UTC')
})
test('I4: provider recovery does not authorize replay or incident resolution', () => {
  const s = text('Verify recovery and account for delayed work')
  for (const phrase of [
    'Reconcile uncertain outcomes before replay',
    'new requests alone',
    'service-specific observation window',
  ])
    expect(s).toContain(phrase)
})
test('diagnosis treats early errors as evidence rather than proof', () => {
  expect(text('Diagnose with evidence')).toContain(
    'earliest observed error is not necessarily the cause',
  )
})
