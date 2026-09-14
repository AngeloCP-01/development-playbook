// web/src/features/observability/steps.ts
export const STEP_IDS = [
  'three',
  'errors',
  'logs',
  'where',
  'signals',
  'health',
  'alerts',
  'silence',
  'ai',
  'done',
] as const

export type StepId = (typeof STEP_IDS)[number]
