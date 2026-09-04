export const STEP_IDS = [
  'verify',
  'vercel',
  'aws',
  'recovery',
  'ai',
  'done',
] as const

export type StepId = (typeof STEP_IDS)[number]
