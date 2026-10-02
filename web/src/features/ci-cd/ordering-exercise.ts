export type OrderingStep = {
  id: string
  name: string
  command: string
  failTime: string
  reason: string
}

/** Steps in the CORRECT order — cheapest failure first. */
export const ORDERING_STEPS: OrderingStep[] = [
  {
    id: 'format',
    name: 'Format',
    command: '`pnpm format:check`',
    failTime: '~3 seconds',
    reason: 'Catches spacing and semicolons. Fails fastest of all five.',
  },
  {
    id: 'lint',
    name: 'Lint',
    command: '`pnpm lint`',
    failTime: '~8 seconds',
    reason:
      'Catches unused variables, missing deps arrays, hook violations. Slightly slower than format.',
  },
  {
    id: 'typecheck',
    name: 'Typecheck',
    command: '`pnpm typecheck`',
    failTime: '~15 seconds',
    reason:
      'Catches type mismatches. Runs typegen first so generated types exist.',
  },
  {
    id: 'test',
    name: 'Test',
    command: '`pnpm vitest run`',
    failTime: '~1 minute',
    reason: 'Catches logic bugs. Slowest check that still runs in seconds.',
  },
  {
    id: 'build',
    name: 'Build',
    command: '`pnpm build`',
    failTime: '~2 minutes',
    reason: 'Catches missing imports and broken pages. Slowest — runs last.',
  },
]

export const CORRECT_ORDER = ORDERING_STEPS.map((s) => s.id)

/** Display order — deliberately not the correct order. */
export const SCRAMBLED_ORDER = [
  'build',
  'typecheck',
  'test',
  'format',
  'lint',
] as const

/**
 * Score a placement. `placements` maps step id → assigned position (1-based).
 * Returns how many match the correct order.
 */
export function score(placements: Record<string, number>): number {
  return ORDERING_STEPS.filter((step, i) => placements[step.id] === i + 1)
    .length
}
