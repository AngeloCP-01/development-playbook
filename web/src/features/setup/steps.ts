/**
 * The rail order for stage 04, in one place.
 *
 * Mirrors `features/architecture/steps.ts`, and exists for the same reason: an
 * id that exists nowhere becomes a compile error.
 *
 * Note what this does and does not buy, because the wording it replaced
 * claimed more. It does not feed the audit — `e2e/audit-pages.ts` reads the
 * rendered rail out of the DOM and imports nothing from here, so the sweep
 * follows what the app draws rather than what this file says. What the tuple
 * catches is an id typed wrong or renamed in one place and not the other. What
 * it cannot catch is a step deleted from both this tuple and the panel array
 * together: that compiles, and the sweep quietly shrinks. `steps.test.ts` holds
 * the count for exactly that direction.
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
