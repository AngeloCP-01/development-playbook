/**
 * Stage 06's seven panels.
 *
 * `unit` → `integration` → `e2e` are deliberately consecutive: they carry one
 * feature — discounted checkout — at three altitudes, and the continuity is the
 * teaching. Three accurate snippets in isolation do not show a reader why the
 * layers are layers of one thing. `steps.test.ts` pins the adjacency.
 */
export const STEP_IDS = [
  'triage',
  'restraint',
  'unit',
  'integration',
  'e2e',
  'teeth',
  'done',
] as const

export type StepId = (typeof STEP_IDS)[number]
