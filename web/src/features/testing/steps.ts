/**
 * Stage 06's eight panels.
 *
 * `unit` → `integration` → `e2e` are deliberately consecutive: they carry one
 * feature — discounted checkout — at three altitudes, and the continuity is the
 * teaching. Three accurate snippets in isolation do not show a reader why the
 * layers are layers of one thing. `steps.test.ts` pins the adjacency.
 *
 * `traps` closes the stage, after `done`, matching the doc's own order
 * (Artifacts → Definition of done → Scaling to a team → Traps) and
 * `PATTERNS.md`'s convention of ending on a `Callout kind="trap"` set.
 */
export const STEP_IDS = [
  'triage',
  'restraint',
  'unit',
  'integration',
  'e2e',
  'teeth',
  'done',
  'traps',
] as const

export type StepId = (typeof STEP_IDS)[number]
