/**
 * Source: `docs/06-testing.md`, "## Traps".
 *
 * Titles carry the doc's trailing full stop because the doc bolds the whole
 * sentence, and `traps.test.ts` compares against exactly that.
 */

export type Trap = { id: string; title: string; body: string }

export const TRAPS: Trap[] = [
  {
    id: 'mocking-database',
    title: 'Mocking the database.',
    body: 'You end up testing that your mock returns what you told it to. Integration tests against real Postgres catch constraint violations, transaction bugs, and query errors that mocks cannot.',
  },
  {
    id: 'no-authorization',
    title: 'No authorization tests.',
    body: 'The most damaging omission in this doc.',
  },
  {
    id: 'testing-implementation-details',
    title: 'Testing implementation details.',
    body: 'Tests that break on every refactor get deleted or ignored, and then you have neither tests nor confidence.',
  },
  {
    id: 'css-selectors',
    title: 'CSS selectors in E2E.',
    body: '`.btn-primary-2` breaks on restyle and tells you nothing about user-visible behavior.',
  },
  {
    id: 'wait-for-timeout',
    title: '`waitForTimeout`.',
    body: 'The single largest source of E2E flakiness.',
  },
  {
    id: 'coverage-as-target',
    title: 'Coverage as a target.',
    body: 'Optimizes for the easy code, not the risky code.',
  },
  {
    id: 'skipping-regression-test',
    title: 'Skipping the regression test on a bug fix.',
    body: 'Without it you cannot prove the fix works, and nothing prevents it coming back.',
  },
  {
    id: 'slow-unit-suite',
    title: 'A slow unit suite.',
    body: 'Past thirty seconds, watch mode stops being usable, and the tight feedback loop that makes tests valuable disappears.',
  },
]
