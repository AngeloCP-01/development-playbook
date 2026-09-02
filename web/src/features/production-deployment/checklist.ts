/**
 * Source: `docs/13-production-deployment.md`, "## Artifacts", "## Definition
 * of done", and "## Scaling to a team".
 *
 * Same shape as staging's `checklist.ts`: `DONE` items keyed on stable IDs
 * (position-independent), `ARTIFACT_LIST`, and `TEAM` notes for the
 * `DeploymentChecklist` disclosure. All four scaling bullets fit.
 */

export type DoneItem = {
  id: string
  label: string
}

export const DONE: DoneItem[] = [
  {
    id: 'deploy-succeeded',
    label: 'Deploy succeeded and the commit is identifiable',
  },
  {
    id: 'migrations-clean',
    label: 'Migrations applied cleanly, with expand/migrate/contract respected',
  },
  {
    id: 'skew-on',
    label: 'Skew protection is on',
  },
  {
    id: 'rollback-known',
    label: 'Rollback command is known without looking it up',
  },
  {
    id: 'pdv-next',
    label: 'Post-Deployment Verification is next, not optional',
  },
]

export type TeamNote = {
  id: string
  title: string
  body: string
}

export const TEAM: TeamNote[] = [
  {
    id: 'deploy-own',
    title: 'Deploy your own changes',
    body: 'The person who wrote it knows what to check and what "wrong" looks like.',
  },
  {
    id: 'announce-risky',
    title: 'Announce risky deploys',
    body: 'Not every deploy — that becomes noise — but migrations and anything touching auth or payments.',
  },
  {
    id: 'multiple-rollback',
    title: 'More than one person can roll back',
    body: "A rollback gated on one person's availability is not a rollback.",
  },
  {
    id: 'deploy-freeze',
    title: 'Deploy freezes are rare',
    body: 'Only for genuinely high-stakes windows. Permanent freezes just batch changes into larger, riskier deploys.',
  },
]

export const ARTIFACT_LIST: string[] = [
  'Production deployment traceable to a specific commit',
  'Migrations applied as versioned, committed SQL files',
  'Skew protection enabled',
  'Feature flags for anything risky',
  'A rollback procedure you have actually executed at least once',
]
