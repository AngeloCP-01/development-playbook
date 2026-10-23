import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { expect, test } from 'vitest'
import { CHECKS } from './record'
import { COVERAGE, STEP_IDS } from './steps'
function headings(md: string): string[] {
  let fence: { marker: string; size: number } | undefined
  const result: string[] = []
  for (const line of md.split('\n')) {
    const delimiter = line.match(/^ {0,3}(`{3,}|~{3,})(.*)$/)
    if (delimiter) {
      const marker = delimiter[1][0]
      const size = delimiter[1].length
      if (!fence) fence = { marker, size }
      else if (
        fence.marker === marker &&
        size >= fence.size &&
        delimiter[2].trim() === ''
      )
        fence = undefined
      continue
    }
    const heading = !fence && line.match(/^#{2,3} (.+)$/)
    if (heading && heading[1] !== 'The work') result.push(heading[1])
  }
  return result
}
test('every canonical section has a real panel while specimen headings stay inside their fence', () => {
  expect(
    headings('## Entry criteria\n```markdown\n## Fake\n```\n### Real'),
  ).toEqual(['Entry criteria', 'Real'])
  const chapter = readFileSync(
    resolve(process.cwd(), '../docs/10-documentation.md'),
    'utf8',
  )
  expect(Object.keys(COVERAGE)).toEqual(headings(chapter))
  for (const ids of Object.values(COVERAGE)) {
    expect(ids.length).toBeGreaterThan(0)
    for (const id of ids) expect(STEP_IDS).toContain(id)
  }
  const expectedChecks = chapter
    .split('## Definition of done')[1]
    .split('## Scaling to a team')[0]
  expect(CHECKS.map((check) => check.text)).toEqual(
    [...expectedChecks.matchAll(/^- \[ \] (.+)$/gm)].map((match) => match[1]),
  )
})
