export const STEP_IDS = [
  'self-review',
  'what-to-find',
  'pr-discipline',
  'team',
  'ai',
  'traps',
] as const

export type StepId = (typeof STEP_IDS)[number]
