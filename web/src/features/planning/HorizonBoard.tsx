'use client'

import { useLocalStorage } from '@/lib/useLocalStorage'
import { EMPTY_PLAN, PLANNING_KEY, type PlanSheet } from './PlanWorksheet'
import { HorizonTriage } from './HorizonTriage'

/**
 * Bridges the plan worksheet (stepper step 5) to the horizon triage (step 6).
 *
 * The two live in different stepper panels, which are siblings rather than a
 * parent chain, so the reader's `notInV1` cannot be prop-drilled from one to the
 * other. It travels through `PLANNING_KEY` instead: the worksheet writes it, and
 * this reads it back through the same `useSyncExternalStore`-backed hook, so the
 * triage always reflects what the reader typed a step earlier — including edits
 * made after they first reached this step.
 */
export function HorizonBoard() {
  const { value } = useLocalStorage<PlanSheet>(PLANNING_KEY, EMPTY_PLAN)
  return <HorizonTriage notInV1={value.notInV1} />
}
