export const STEP_IDS = [
  'first-response',
  'severity',
  'mitigation',
  'compromised-access',
  'escalation',
  'customer-updates',
  'diagnosis',
  'uncertain-outcomes',
  'recovery',
  'postmortem',
  'runbook',
  'ai',
  'done',
  'traps',
] as const

export type StepId = (typeof STEP_IDS)[number]
