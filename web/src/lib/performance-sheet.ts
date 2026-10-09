export type PerformanceSheet = {
  outcome: string
  metric: string
  scope: string
  window: string
  evidence: string
  target: string
  hypothesis: string
  change: string
  after: string
  correctness: string
  verdict: string
}

export type SheetField = {
  key: keyof PerformanceSheet
  label: string
  hint: string
}

export const PERFORMANCE_KEY = 'playbook:performance-worksheet:v1'
export const EMPTY_PERFORMANCE_SHEET: PerformanceSheet = {
  outcome: '',
  metric: '',
  scope: '',
  window: '',
  evidence: '',
  target: '',
  hypothesis: '',
  change: '',
  after: '',
  correctness: '',
  verdict: '',
}

export const BASELINE_FIELDS: readonly SheetField[] = [
  {
    key: 'outcome',
    label: 'Outcome and observer',
    hint: 'Who observes the delay? Name the start event and the visible stop event.',
  },
  {
    key: 'metric',
    label: 'Metric and population',
    hint: 'Name the duration percentile and completed-outcome population. Record total attempts, failures and timeouts separately; categories can overlap.',
  },
  {
    key: 'scope',
    label: 'Scope',
    hint: 'Route or event, version, device/network segment, cart/data shape, and cold or warm cache.',
  },
  {
    key: 'window',
    label: 'Window and sample',
    hint: 'Collection dates, completed sample count and traffic shape. State when field data is insufficient and when you will observe again.',
  },
  {
    key: 'evidence',
    label: 'Baseline evidence',
    hint: 'Reference the user-outcome record separately from the diagnostic trace or controlled run.',
  },
  {
    key: 'target',
    label: 'Target and rationale',
    hint: 'What outcome target do users need, and why? Product budgets need a reason.',
  },
]

export const FOLLOWUP_FIELDS: readonly SheetField[] = [
  {
    key: 'hypothesis',
    label: 'Hypothesis and alternative',
    hint: 'What evidence points to the cause? Record a plausible alternative and why you rejected it.',
  },
  {
    key: 'change',
    label: 'Change and version',
    hint: 'What changed, on which deployment, and which stock, order or payment behavior must stay correct?',
  },
  {
    key: 'after',
    label: 'After evidence',
    hint: 'Same observer, outcome, population, segment, data and cache state. Record the new dates, version, sample, failures and timeouts.',
  },
  {
    key: 'correctness',
    label: 'Correctness and rollback',
    hint: 'Test the behavior, freshness and authorization. Name when to revert or investigate a harmful change.',
  },
  {
    key: 'verdict',
    label: 'Verdict and open gap',
    hint: 'Does the user outcome meet its target? Record remaining evidence, unresolved gap, owner and follow-up window.',
  },
]

export const SHEET_FIELDS = [...BASELINE_FIELDS, ...FOLLOWUP_FIELDS]

export function normalizePerformanceSheet(value: unknown): PerformanceSheet {
  const result = { ...EMPTY_PERFORMANCE_SHEET }
  if (typeof value !== 'object' || value === null || Array.isArray(value))
    return result
  const source = value as Record<string, unknown>
  for (const { key } of SHEET_FIELDS) {
    if (typeof source[key] === 'string') result[key] = source[key]
  }
  return result
}

export function performanceMarkdown(sheet: PerformanceSheet): string {
  return [
    '# Performance measurement record',
    '',
    ...SHEET_FIELDS.map(
      ({ key, label }) =>
        `## ${label}\n\n${sheet[key].trim() || 'not recorded'}\n`,
    ),
  ].join('\n')
}
