/**
 * Source: `docs/05-development.md`, "### The loop" — the doc's first fenced
 * block, seven arrows deep.
 *
 * `label` is text lifted from that block, verbatim enough that
 * `loop.test.ts`'s `toContain` holds against it. The block's own markdown
 * links are not part of any label — the prose guard in this directory
 * (`prose.test.ts`) forbids link syntax in authored strings, and the doc's
 * `([06](06-testing.md))` style would reach `InlineCode` as literal brackets.
 *
 * `stage` carries the slug a node hands off to; three stages of the loop —
 * picking the slice, doing the work, and cleaning it up — are this stage's
 * own and link nowhere.
 */

export type LoopStage = {
  id: string
  label: string
  detail: string
  stage?: string
}

/**
 * Source: `docs/05-development.md`, `## Entry criteria` — the two checkboxes
 * that gate the loop, each linking to the stage that satisfies it (N10,
 * `coverage-walk.md`). Same shape as `checklist.ts`'s `DONE`: the doc's link
 * is stripped to a bare stage number in `label` (the prose guard in this
 * directory forbids markdown link syntax in an authored string) and the slug
 * it pointed to survives separately in `stage`, so a component can render a
 * real cross-reference instead of the dead parenthetical the label alone
 * would leave behind.
 */
export type EntryCriterion = {
  id: string
  label: string
  stage: string
}

export const ENTRY_CRITERIA: EntryCriterion[] = [
  {
    id: 'scaffolded',
    label: 'Project scaffolded, CI green, preview deploys working (04)',
    stage: '04-project-setup',
  },
  {
    id: 'scoped',
    label:
      'The next piece of work is scoped small enough to merge within two days (02)',
    stage: '02-planning',
  },
]

export const LOOP_STAGES: LoopStage[] = [
  {
    id: 'slice',
    label: 'Pick the smallest shippable slice',
    detail:
      'Anything that cannot merge within two days should be decomposed or hidden behind a flag — a boolean your code reads, defaulting to off, that lets half-built work merge without being reachable.',
  },
  {
    id: 'test',
    label: 'Write the test that proves it works',
    detail:
      'Proves the slice before any implementation exists. Nothing below this step should run until this one has failed for the right reason.',
    stage: '06-testing',
  },
  {
    id: 'work',
    label: 'Make it work',
    detail:
      '"Make it work, then make it clean" is an ordering, not permission to skip the second half.',
  },
  {
    id: 'clean',
    label: 'Make it clean',
    detail:
      'Cleanup happens before the PR, not in a follow-up ticket that never gets picked up once the slice already shipped.',
  },
  {
    id: 'pr',
    label: 'Open the pull request',
    detail: 'Carries a self-reviewed diff, rebased so history reads in order.',
    stage: '07-code-review',
  },
  {
    id: 'preview',
    label: 'Verify on the preview',
    detail:
      'The build host is the environment that actually checks a change — a green local run is not proof the deployed one behaves the same way.',
    stage: '12-staging',
  },
  {
    id: 'ship',
    label: 'Ship',
    detail:
      'Small slices ship often, which is what keeps this a loop rather than a queue of half-finished branches.',
    stage: '13-production-deployment',
  },
]
