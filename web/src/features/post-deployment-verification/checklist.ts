/**
 * Source: `docs/14-post-deployment-verification.md`, "## Artifacts",
 * "## Definition of done", and "## Scaling to a team".
 *
 * Same shape as stage 13's `checklist.ts`: `DONE` items keyed on stable IDs
 * (position-independent), `ARTIFACT_LIST`, and `TEAM` notes for the
 * checklist disclosure.
 */

export type DoneItem = {
  id: string
  label: string
}

export const DONE: DoneItem[] = [
  {
    id: 'url-loads',
    label: 'Production URL loads in a real browser',
  },
  {
    id: 'critical-path-walked',
    label: 'Critical path walked manually or via smoke tests',
  },
  {
    id: 'no-new-error-types',
    label: 'No new error types in Sentry since the deploy',
  },
  {
    id: 'error-volume-baseline',
    label: 'Error volume at baseline',
  },
  {
    id: 'p75-latency-baseline',
    label: 'p75 latency at baseline',
  },
  {
    id: 'traffic-flowing',
    label: 'Traffic still flowing normally',
  },
  {
    id: 'shipped-change-verified',
    label: 'The specific shipped change verified with production data',
  },
  {
    id: 'aws-rollout-completed',
    label:
      'On AWS: ECS rolloutState: COMPLETED, runningCount matches desiredCount',
  },
  {
    id: 'aws-alb-healthy',
    label: 'On AWS: all ALB targets report State: healthy',
  },
  {
    id: 'aws-alarms-ok',
    label:
      'On AWS: CloudWatch deployment alarms stayed in OK through the bake period',
  },
  {
    id: 'rechecked-30-min',
    label: 'Re-checked at ~30 minutes and still healthy',
  },
]

export type TeamNote = {
  id: string
  title: string
  body: string
}

export const TEAM: TeamNote[] = [
  {
    id: 'deployer-verifies',
    title: 'The deployer verifies',
    body: 'Ownership must not diffuse — "someone will check the dashboard" means nobody does.',
  },
  {
    id: 'post-results-shared',
    title: 'Post results in a shared channel',
    body: 'A short "deployed X, error rates normal, checked Y" builds a searchable history that is invaluable during later incidents.',
  },
  {
    id: 'automated-checks-rollback',
    title: 'Automated post-deploy checks with auto-rollback',
    body: 'Become worthwhile once deploy frequency exceeds what humans can babysit. Vercel can gate promotion on checks passing.',
  },
  {
    id: 'rotate-after-hours',
    title: 'Rotate who watches after hours',
    body: 'So one person is not permanently on the hook.',
  },
]

export const ARTIFACT_LIST: string[] = [
  'A smoke test suite runnable against production',
  'A short verification checklist, adapted per change type',
  'Documented baselines for error rate and p75 latency',
]
