export const STEP_IDS = [
  'deploys',
  'migrations',
  'safety',
  'rollback',
  'ai',
  'traps',
] as const

export type StepId = (typeof STEP_IDS)[number]
