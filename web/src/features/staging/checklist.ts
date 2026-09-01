/**
 * Source: `docs/12-staging.md`, "## Artifacts" and "## Definition of done",
 * plus a four-note `TEAM` disclosure drawn from "## Scaling to a team".
 *
 * Same shape as stage 07's `done.ts`: a `DoneItem[]` keyed on stable ids
 * (position-independent, so reordering the doc's checkboxes cannot silently
 * reset a reader's ticks), an `ARTIFACT_LIST`, and a short `TEAM` array for
 * `StagingChecklist`'s disclosure. Unlike stage 07's two-note `TEAM`, this
 * stage's "Scaling to a team" section is short enough that all four bullets
 * fit without curating a subset.
 */

export type DoneItem = {
  id: string
  label: string
}

export const DONE: DoneItem[] = [
  {
    id: 'flow-works',
    label: 'The preview URL loads and the changed flow works end to end',
  },
  {
    id: 'edge-states',
    label: 'Checked signed-out, empty, and error states',
  },
  {
    id: 'viewports',
    label: 'Checked one narrow viewport and one wide one',
  },
  {
    id: 'regressions',
    label: 'Checked one adjacent feature for regressions',
  },
  {
    id: 'migration',
    label:
      'Any migration ran cleanly against a branched database, not production',
  },
  {
    id: 'e2e',
    label:
      'E2E passed against this preview URL — `BASE_URL=<preview-url> pnpm test:e2e`',
  },
]

export type TeamNote = {
  id: string
  title: string
  body: string
}

export const TEAM: TeamNote[] = [
  {
    id: 'review-artifact',
    title: 'Previews become the review artifact',
    body: '"Looks good" on a diff means less than "I clicked through the preview." Link the URL in the PR description; make it the norm.',
  },
  {
    id: 'staging-place',
    title: 'Now staging may earn its place',
    body: 'For cross-team integration testing, or for a QA process that needs a stable target.',
  },
  {
    id: 'data-hygiene',
    title: 'Establish preview data hygiene',
    body: 'With several engineers, someone will paste real customer data into a preview to reproduce a bug. Decide the rule before it happens.',
  },
  {
    id: 'visual-regression',
    title: 'Automate visual regression',
    body: 'If UI churn gets high enough that eyeballing every preview stops scaling.',
  },
]

export const ARTIFACT_LIST: string[] = [
  'A preview URL attached to every pull request',
  'An isolated database branch per preview',
  'A seed script with deliberately awkward data',
  'Deployment protection enabled where the product is not yet public',
]
