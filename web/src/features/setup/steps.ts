/**
 * The rail order for stage 04, in one place.
 *
 * Mirrors `features/architecture/steps.ts`, and exists for the same reason: an
 * id that exists nowhere becomes a compile error, and the audit's derived sweep
 * resolves against one source rather than a copy.
 *
 * Fifteen came out of the port-planning pass, not from a target. The spec's
 * original table cut the doc nine ways when it was 323 lines; the correction
 * phase took it to 711, and all four of that table's heavy pairings failed the
 * floor arithmetic. Four of these fifteen are provisional and may merge back on
 * measurement — `scaffold`/`structure`, `env`/`client`, `ci`/`enforce`, and
 * `deploy`/`verify`. They are authored split because a merge undoes with a
 * delete while a split costs new ids and every reference to them.
 */
export const STEP_IDS = [
  'scaffold',
  'structure',
  'format',
  'strict',
  'env',
  'client',
  'hooks',
  'ci',
  'enforce',
  'deploy',
  'verify',
  'proof',
  'ai',
  'checklist',
  'traps',
] as const

export type StepId = (typeof STEP_IDS)[number]
