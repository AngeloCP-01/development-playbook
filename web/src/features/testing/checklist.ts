/**
 * Source: `docs/06-testing.md`, "## Definition of done", "## Artifacts", and
 * "## Scaling to a team" — three adjacent closing lists grouped in one
 * module because panel 7 renders all three and nothing else consumes them.
 *
 * `DONE` labels are the doc's checkboxes verbatim: a reader works this list
 * against their own repository, and a paraphrase there is a different bar
 * than the one the stage set. Unlike stage 05's equivalent, none of this
 * doc's seven boxes carry a markdown link, so no stripping is needed here.
 *
 * `TEAM`'s bodies keep both sentences of each note. The "Require tests in
 * review" note is the one exception needing a strip: the doc closes it with
 * `([07](07-code-review.md))`, and this directory's `prose.test.ts` forbids
 * markdown link syntax in an authored string (`InlineCode` does not render
 * it) — stripped to the bare stage number, `(07)`.
 *
 * `stage` on that same note mirrors `DoneItem.stage` in stage 05's
 * `checklist.ts`: a slug held separately from the label, so `TestingChecklist`
 * can render a real `next/link` beside the note instead of leaving the
 * stripped `(07)` as a dead number while 04, 05 and 14 render as working
 * links elsewhere in this stage (Task 14 coverage walk, finding 6).
 */

export type DoneItem = { id: string; label: string }
export type TeamNote = {
  id: string
  title: string
  body: string
  stage?: string
}

export const DONE: DoneItem[] = [
  {
    id: 'unit-tests-edge-cases',
    label: 'New business logic has unit tests, including edge cases',
  },
  {
    id: 'authorization-refusal-test',
    label:
      'Every Server Action touching user data has an authorization-refusal test',
  },
  {
    id: 'regression-test',
    label: 'Bug fixes have a regression test that failed before the fix',
  },
  {
    id: 'e2e-coverage',
    label: 'Critical paths have E2E coverage',
  },
  {
    id: 'suite-under-30s',
    label: 'Full unit suite runs in under 30 seconds',
  },
  {
    id: 'no-wait-for-timeout',
    label: 'No `waitForTimeout` anywhere',
  },
  {
    id: 'no-unexplained-skips',
    label: 'No skipped tests without a comment explaining why',
  },
]

export const ARTIFACT_LIST: string[] = [
  '`*.test.ts` alongside source in `src/features/`',
  '`e2e/*.spec.ts` for critical paths, with `@smoke` tags',
  '`src/test/helpers.ts` — seeding and reset utilities',
  'Test database configuration for local and CI',
]

export const TEAM: TeamNote[] = [
  {
    id: 'documentation',
    title: 'Tests become documentation.',
    body: 'They are how a new engineer learns intended behavior. Name them as sentences describing the behavior, not `test1`.',
  },
  {
    id: 'test-boundary',
    title: 'Agree on the boundary',
    body: 'Of what gets tested, or you get one person testing getters and another testing nothing.',
  },
  {
    id: 'flakiness',
    title: 'Track flakiness visibly.',
    body: 'On a team, flaky tests get tolerated because everyone assumes someone else owns them. A retry-rate dashboard fixes that.',
  },
  {
    id: 'require-tests',
    title: 'Require tests in review.',
    body: '"Where’s the test for this?" is the highest-value review comment (07).',
    stage: '07-code-review',
  },
]
