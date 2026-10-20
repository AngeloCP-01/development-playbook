import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { expect, test } from 'vitest'

type Heading = { title: string; depth: number; line: number }

function headings(md: string): Heading[] {
  const result: Heading[] = []
  let fence: { marker: string; size: number } | undefined
  md.split('\n').forEach((line, index) => {
    const delimiter = line.match(/^ {0,3}(`{3,}|~{3,})(.*)$/)
    if (delimiter) {
      const marker = delimiter[1][0]
      const size = delimiter[1].length
      if (!fence) fence = { marker, size }
      else if (
        marker === fence.marker &&
        size >= fence.size &&
        delimiter[2].trim() === ''
      )
        fence = undefined
      return
    }
    if (fence) return
    const match = line.match(/^(#{1,6}) (.+)$/)
    if (match)
      result.push({ title: match[2], depth: match[1].length, line: index })
  })
  return result
}

function activeTeaching(md: string): string {
  const appendix = headings(md).find(
    (heading) =>
      heading.depth === 2 &&
      heading.title === 'Research findings for chapter review',
  )
  return appendix ? md.split('\n').slice(0, appendix.line).join('\n') : md
}

function section(md: string, title: string): string {
  const active = activeTeaching(md)
  const list = headings(active)
  const index = list.findIndex((heading) => heading.title === title)
  expect(index, 'missing active teaching heading: ' + title).toBeGreaterThan(-1)
  const start = list[index]
  const next = list
    .slice(index + 1)
    .find((heading) => heading.depth <= start.depth)
  return active
    .split('\n')
    .slice(start.line + 1, next?.line)
    .join('\n')
}

const path = fileURLToPath(
  new URL('../../../docs/10-documentation.md', import.meta.url),
)
const raw = () => readFileSync(path, 'utf8')
const doc = () => activeTeaching(raw())
const flat = (text: string) => text.replace(/\s+/g, ' ')

test('fenced specimen headings do not end active chapter sections', () => {
  const fixture = [
    '### Keep the README usable',
    '````markdown',
    '## Deploying',
    '```text',
    '## Research findings for chapter review',
    '```',
    '````',
    'fresh clone check belongs here',
    '### Next teaching section',
    'outside',
  ].join('\n')
  expect(headings(fixture).map((heading) => heading.title)).toEqual([
    'Keep the README usable',
    'Next teaching section',
  ])
  expect(section(fixture, 'Keep the README usable')).toContain(
    'fresh clone check belongs here',
  )
  expect(section(fixture, 'Keep the README usable')).not.toContain('outside')
})

test('planned answers in the research appendix cannot satisfy active teaching', () => {
  const fixture = [
    '## The work',
    '### Current advice',
    'old wording',
    '## Research findings for chapter review',
    '### Choose the document for the reader’s task',
    'desired answer',
  ].join('\n')
  expect(activeTeaching(fixture)).toContain('old wording')
  expect(activeTeaching(fixture)).not.toContain('desired answer')
  expect(
    headings(activeTeaching(fixture)).map((heading) => heading.title),
  ).not.toContain('Choose the document for the reader’s task')
})

test('documentation keeps its continuous cadence and all house sections', () => {
  expect(doc()).toMatch(/^# 10\. Documentation\n/)
  expect(doc()).toContain('Continuously')
  expect(
    headings(doc())
      .filter((heading) => heading.depth === 2)
      .map((heading) => heading.title),
  ).toEqual([
    'Entry criteria',
    'The work',
    'Artifacts',
    'Definition of done',
    'Scaling to a team',
    'Traps',
  ])
})

test('the teaching order exposes document selection and verification as lookup tasks', () => {
  expect(
    headings(section(doc(), 'The work'))
      .filter((heading) => heading.depth === 3)
      .map((heading) => heading.title),
  ).toEqual([
    'Choose the document for the reader’s task',
    'Keep the README usable',
    'Record decisions and supersede them visibly',
    'Keep architecture and contract references current',
    'Write comments for non-obvious reasons',
    'Update and verify documentation with the change',
    'Choose what to omit or archive',
    'Commit messages preserve change context',
    'AI in documentation',
  ])
})

test('reader needs choose a small useful set without making every template mandatory', () => {
  const text = section(doc(), 'Choose the document for the reader’s task')
  for (const kind of ['Tutorial', 'How-to guide', 'Reference', 'Explanation'])
    expect(text).toContain(kind)
  expect(text).toMatch(/optional/i)
  expect(text).toContain('README')
  expect(text).toContain('ADR')
  expect(text).toContain('Changelog')
  expect(text).toContain('Release notes')
  expect(doc()).not.toContain('Everything else rots.')
  expect(doc()).not.toContain('Code says what. Documentation says why.')
})

test('README verification is taught where a new maintainer looks for setup guidance', () => {
  const text = flat(section(doc(), 'Keep the README usable'))
  for (const phrase of [
    'prerequisites',
    'configuration',
    'expected result',
    'fresh clone',
    'revision',
    'first point',
  ]) {
    expect(text.toLowerCase()).toContain(phrase)
  }
})

test('replaced ADRs expose current status while preserving their historical reasoning', () => {
  const text = flat(
    section(doc(), 'Record decisions and supersede them visibly'),
  )
  for (const phrase of [
    'Context',
    'Decision',
    'Consequences',
    'Alternatives',
    'Proposed',
    'Rejected',
    'Accepted',
    'Superseded',
  ]) {
    expect(text).toContain(phrase)
  }
  expect(text).toContain('[ADR 005](005-generated-contract-reference.md)')
  expect(text).toContain('[ADR 004](004-manual-field-reference.md)')
  const previous = section(
    doc(),
    'Record decisions and supersede them visibly',
  ).match(/```markdown\n(# ADR 004:[\s\S]*?)\n```/)?.[1]
  expect(previous).toBeDefined()
  expect(previous).toContain('## Supersession notice (appended)')
  expect(previous).toMatch(/\d{4}-\d{2}-\d{2} — Current status: Superseded\./)
  expect(text).toMatch(/append[\s\S]+supersession/i)
  expect(text).toMatch(/preserve[\s\S]+historical/i)
  expect(text).toContain('docs/adr/NNN-title.md')
  expect(doc()).not.toMatch(/Never edit an accepted ADR/i)
})

test('a current contract reference states defaults and optional-field absence explicitly', () => {
  const text = section(
    doc(),
    'Keep architecture and contract references current',
  )
  for (const phrase of [
    'scope',
    'relationships',
    'owner',
    'BOOKING_WINDOW_DAYS',
    'waitlistPosition',
    '1–365',
    '30',
    'omitted when not waitlisted',
  ]) {
    expect(text).toContain(phrase)
  }
  expect(text).toMatch(/source|contract|schema/i)
})

test('documentation checks include configuration and response contracts with an owner', () => {
  const text = flat(
    section(doc(), 'Update and verify documentation with the change'),
  )
  for (const phrase of [
    'Authoritative fact',
    'Affected document',
    'Check',
    'Owner',
    '.env.example',
    'response',
    'validator',
    'generation',
    'review trigger',
  ]) {
    expect(text).toContain(phrase)
  }
  expect(text).toMatch(/alone[\s\S]+owner/i)
  expect(text).toContain('only if the application actually invokes it')
  expect(doc()).not.toContain('the app stops booting when it drifts')
  expect(doc()).not.toContain('The best documentation cannot drift')
})

test('provider comments teach a documented limit without inventing truncation or diagnosis', () => {
  const text = section(doc(), 'Write comments for non-obvious reasons')
  expect(text).toContain('500')
  expect(text).toMatch(/external[\s\S]+ID/)
  expect(doc()).not.toMatch(
    /silently truncated|past 5 attempts|means our handler is broken/i,
  )
  expect(text).toContain('Known limitations')
})

test('current instructions can be retired while historical decisions remain discoverable', () => {
  const archive = section(doc(), 'Choose what to omit or archive')
  const done = section(doc(), 'Definition of done')
  const traps = section(doc(), 'Traps')
  for (const text of [archive, done, traps]) {
    expect(text).toMatch(/historical/i)
    expect(text).toMatch(/current/i)
  }
  expect(doc()).not.toContain(
    'No documentation describes things that no longer exist',
  )
})

test('AI validation claims require observed evidence and a responsible reviewer', () => {
  const text = flat(section(doc(), 'AI in documentation'))
  for (const phrase of [
    'source and version',
    'named reviewer',
    'missing facts',
    'synthetic',
    'command',
    'environment',
    'observed result',
  ]) {
    expect(text).toContain(phrase)
  }
  for (const evidence of ['Read', 'Compile', 'Execute'])
    expect(text).toContain(evidence)
})

test('the example is illustrative and the assessment case stays held out', () => {
  expect(doc()).toContain('Workshop')
  expect(doc()).toMatch(/Illustrative/i)
  expect(doc()).not.toContain('Toolshare')
})

test('review notes are removed after their accepted findings enter active teaching', () => {
  expect(headings(raw()).map((heading) => heading.title)).not.toContain(
    'Research findings for chapter review',
  )
  expect(raw()).not.toContain('Research status, 2026-10-15')
  expect(raw()).toContain('../reference/stage-10-source-research.md')
})
