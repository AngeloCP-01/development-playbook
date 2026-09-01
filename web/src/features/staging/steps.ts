export const STEP_IDS = [
  'preview',
  'database',
  'checklist',
  'env',
  'ai',
  'traps',
] as const

export type StepId = (typeof STEP_IDS)[number]
