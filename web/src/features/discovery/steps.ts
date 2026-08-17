/**
 * The rail order for stage 01, in one place.
 *
 * This is TD-36's guard, not a new convention: stage 03 has had it since D-52
 * made splitting steps routine, and stages 01 and 02 had nothing. The audit
 * sweeps whatever rail a ready stage renders (`e2e/audit-pages.ts`), so a step
 * that disappears leaves the sweep silently — the sweep shrinks and stays
 * green. Typing `STEPS` against this tuple makes an id that exists nowhere a
 * compile error, which is the direction nothing else covered.
 *
 * Read off `ProductDiscovery.tsx`'s own `STEPS` array, in the order it renders.
 */
export const STEP_IDS = [
  'frame',
  'research',
  'ai',
  'talk',
  'decide',
  'record',
] as const

export type StepId = (typeof STEP_IDS)[number]
