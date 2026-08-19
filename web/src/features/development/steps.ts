/**
 * The rail order for stage 05, in one place.
 *
 * Thirteen came out of the port-planning pass against a doc of fourteen fenced
 * blocks across 587 lines. `docs/task.md` predicted "well under fifteen" from
 * line count; the doc is denser than its length, and a rendered code line costs
 * 20px in `AnnotatedArtifact`.
 *
 * Two are **provisional** and merge on measurement: `drill` into `reads`, and
 * `boundaries` into `action`. They are authored split because a merge undoes
 * with a delete while a split costs new ids and every reference to them — stage
 * 04's practice, where four of fifteen were provisional and all four survived.
 *
 * `action` and `callers` are **not** provisional. `### Server Actions need
 * validation and authorization` is 141 doc lines with three code blocks, the
 * heaviest section in any doc ported so far.
 */
export const STEP_IDS = [
  'loop',
  'server',
  'thin',
  'action',
  'callers',
  'reads',
  'drill',
  'boundaries',
  'states',
  'commits',
  'ai',
  'checklist',
  'traps',
] as const

export type StepId = (typeof STEP_IDS)[number]
