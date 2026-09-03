export const STEP_IDS = [
  'deploys',
  'migrations',
  'vercel',
  'aws',
  'aws-ops',
  'flags',
  'ai',
  'traps',
] as const

export type StepId = (typeof STEP_IDS)[number]
