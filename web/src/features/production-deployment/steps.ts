export const STEP_IDS = [
  'deploys',
  'migrations',
  'vercel',
  'aws',
  'flags',
  'ai',
  'traps',
] as const

export type StepId = (typeof STEP_IDS)[number]
