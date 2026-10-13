import { expect, test } from 'vitest'
import { scaling } from './scaling'
import { sheetSources } from './sheet-sources'
const rows = scaling.sections.flatMap((section) => section.rows)
const find = (term: string) => rows.find((row) => row.term === term)!
const text = rows.map((row) => `${row.what} ${row.when ?? ''}`).join('\n')

test('infrastructure scaling is a stage 09 lookup without rewriting its team-scaling lesson', () => {
  expect(scaling.title).toBe('Infrastructure Scaling')
  expect(scaling.stage).toBe('09-performance-optimization')
  expect(scaling.sections.map((section) => section.title)).toEqual([
    'Locate the limit',
    'Choose routing',
    'Check health and overload',
    'Prove the outcome',
  ])
  expect(scaling.sections[0].note).toMatch(/team practice/)
})
test('adding targets and distributing requests do not pretend to remove a shared dependency limit', () => {
  expect(find('Routing and dependencies').what).toMatch(
    /do not establish more capacity in a shared database/,
  )
  expect(find('Horizontal capacity').when).toMatch(
    /state, session and connection/,
  )
})
test('ALB routing choices keep workload and incompatible-feature caveats close to the choice', () => {
  expect(scaling.sections[1].note).toMatch(/AWS.*ALB/)
  expect(find('Round robin').when).toMatch(/similarly costly requests/)
  expect(find('Least outstanding requests').when).toMatch(
    /does not support slow start/,
  )
  expect(find('Weighted random').when).toMatch(
    /does not support sticky sessions or slow start/,
  )
})
test('failed health checks are not a guarantee of zero traffic when ALB fails open', () => {
  expect(find('Health checks and fail-open').what).toMatch(
    /all registered targets are unhealthy.*fails open.*regardless of health/,
  )
  expect(find('Health checks and fail-open').when).toMatch(
    /not proof that all traffic.*stopped/,
  )
})
test('overload guidance keeps queues and retries bounded while uncertain side effects await reconciliation', () => {
  expect(find('Admission and degradation').what).toMatch(/queues bounded/)
  expect(find('Retries and uncertain outcomes').what).toMatch(
    /bounded retry.*already succeeded before replay/,
  )
  expect(text).toMatch(/oldest pending work/)
  expect(text).toMatch(/correctness regresses/)
})
test('scaling credits AWS and Google SRE and inspects attributes without a mutation command', () => {
  expect(sheetSources(scaling).map((citation) => citation.author)).toEqual([
    'AWS',
    'AWS',
    'Google SRE',
  ])
  expect(rows.find((row) => row.code?.startsWith('aws '))!.code).toContain(
    'describe-target-group-attributes',
  )
  expect(rows.some((row) => row.code?.includes('modify-target-group'))).toBe(
    false,
  )
})
