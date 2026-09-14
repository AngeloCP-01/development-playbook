// web/src/features/observability/Observability.tsx
import { Stepper } from '@/components/Stepper'
import { COLLECT_STEPS } from './panels-collect'
import { ACT_STEPS } from './panels-act'

/**
 * Stage 15. Ten steps in two files by phase — what to collect
 * (`panels-collect.tsx`), then what to do with it (`panels-act.tsx`) —
 * because one file holding ten panels, four drills and five artifacts is
 * past what a reviewer can hold at once. `steps.test.ts` pins the order;
 * this is where the two halves meet it.
 */
export function Observability() {
  return <Stepper steps={[...COLLECT_STEPS, ...ACT_STEPS]} />
}
