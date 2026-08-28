/**
 * Source: `docs/07-code-review.md`, "## Artifacts" and "## Definition of
 * done", with two curated `TEAM` notes for `CodeReviewChecklist`'s
 * disclosure.
 *
 * `TEAM` here is deliberately not `team.ts`'s `PRACTICES`. `PRACTICES` is
 * all six "Scaling to a team" bullets for its own panel; these two notes
 * are a short pointer — rotate reviewers, and a cross-link to the severity
 * exercise this stage already built — same role as stage 06's
 * `checklist.ts` keeping its own short `TEAM` beside the fuller module.
 *
 * `preview` keeps the doc's `(12)` reference as backticked plain text; the
 * component turns it into a working `next/link` via `getStage`, the same
 * device stage 06's `require-tests` note uses for its own `(07)`.
 */

export type DoneItem = {
  id: string
  label: string
}

export const DONE: DoneItem[] = [
  {
    id: 'diff-read',
    label: 'Diff read in the PR view, not the editor, after a real break',
  },
  { id: 'checklist', label: 'Checklist above completed' },
  {
    id: 'tests-verified',
    label: 'Tests verified to fail without the change',
  },
  {
    id: 'description',
    label: 'Description covers what, why, how, verification',
  },
  { id: 'under-400', label: 'Under 400 lines, or deliberately split' },
  { id: 'preview', label: 'Preview URL checked (`12`)' },
]

export type TeamNote = {
  id: string
  title: string
  body: string
  stage?: string
}

export const TEAM: TeamNote[] = [
  {
    id: 'reviewer-assignment',
    title: 'Assign reviewers deliberately',
    body: 'Rotate so knowledge spreads. Include someone unfamiliar with the area — their confusion is a signal, not a cost.',
  },
  {
    id: 'severity-system',
    title: 'Adopt the severity system',
    body: 'Critical / Important / Minor / Nit, with finding IDs and provenance tags. See the severity exercise above.',
    stage: '07-code-review',
  },
]

export const ARTIFACT_LIST: string[] = [
  'PR descriptions explaining what, why, how, and how it was verified',
  'Review comments recorded on the PR, including your own self-review notes',
  'Merged commits with clean, linear history',
]
