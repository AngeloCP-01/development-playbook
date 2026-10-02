export const STEP_IDS = [
  'gate',
  'ordering',
  'e2e',
  'protection',
  'deps',
  'scaling',
  'ai',
  'traps',
] as const

export type StepId = (typeof STEP_IDS)[number]
