export type ComparisonRow = { field: string; before: string; after: string }
export type DecisionCase = {
  id: string
  prompt: string
  options: readonly { id: string; label: string }[]
  answer: string
  why: string
  comparison?: readonly ComparisonRow[]
}

export const BOTTLENECK_CASES: readonly DecisionCase[] = [
  {
    id: 'cart',
    prompt:
      'A controlled 20-item cart shows 21 inventory queries. Repeated round trips dominate server time. Which hypothesis is supported?',
    options: [
      {
        id: 'batch',
        label: 'Batch the availability lookup and preserve the stock decision',
      },
      {
        id: 'image',
        label: 'Resize the checkout image to fix server inventory time',
      },
      { id: 'observe', label: 'Declare a production win from the query count' },
    ],
    answer: 'batch',
    why: 'The repeated calls support a batching experiment. The image cannot explain the observed server time. Retest the browser outcome and preserve stock and order behavior.',
  },
  {
    id: 'unknown',
    prompt:
      'Customers report slow checkout, but you have only one uninstrumented local run and no browser baseline. What comes first?',
    options: [
      {
        id: 'batch',
        label: 'Batch inventory without evidence of repeated calls',
      },
      { id: 'image', label: 'Resize the image because the page has one' },
      {
        id: 'observe',
        label:
          'Define the user clock and collect baseline and diagnostic evidence',
      },
    ],
    answer: 'observe',
    why: 'Record the chosen browser outcome before naming a cause. An absent database span does not prove no database work occurred. Instrument the relevant path and state when field samples are insufficient.',
  },
]

const QUERY_OPTIONS = [
  {
    id: 'keep',
    label: 'Keep the plan if the measured outcome meets its target',
  },
  {
    id: 'investigate',
    label:
      'Investigate statistics, data and the actual plan before choosing a change',
  },
  {
    id: 'index',
    label: 'Test the owner and creation index against the same workload',
  },
] as const

export const QUERY_CASES: readonly DecisionCase[] = [
  {
    id: 'small',
    prompt:
      'A small inventory table uses a sequential scan. Its measured query and user outcome meet their targets. What does the scan imply?',
    options: QUERY_OPTIONS,
    answer: 'keep',
    why: 'A sequential scan can be cheaper for a small or low-selectivity table. The scan name alone does not diagnose a missing index or justify added write cost.',
  },
  {
    id: 'estimates',
    prompt:
      'Actual rows differ greatly from estimated rows on a slow query. Is the plan enough to name a missing index?',
    options: QUERY_OPTIONS,
    answer: 'investigate',
    why: 'Inspect actual versus estimated rows, rows filtered, buffers and time. Statistics and workload are hypotheses to investigate. Planner cost is not milliseconds; one executed plan is not a production p95.',
  },
  {
    id: 'history',
    prompt:
      'A measured slow order-history query filters by owner and sorts by creation. The representative plan supports testing that access path. What experiment fits?',
    options: QUERY_OPTIONS,
    answer: 'index',
    why: 'Test (owner_id, created_at DESC) as a candidate for this filter and sort. Compare the same workload and write cost; plan locking, transaction handling and failed-index cleanup.',
  },
]

const COMPARE_OPTIONS = [
  { id: 'observe', label: 'Collect the missing user-outcome evidence' },
  { id: 'repeat', label: 'Repeat with a comparable scope and population' },
  { id: 'stop', label: 'Stop this optimization pass and observe the outcome' },
  { id: 'revert', label: 'Investigate or revert the harmful change' },
] as const

const COMPARABLE: readonly ComparisonRow[] = [
  {
    field: 'Outcome and observer',
    before: 'Browser: Place order click to response receipt',
    after: 'Same browser observer and start/stop events',
  },
  {
    field: 'Population',
    before: 'Completed-outcome duration p95; failures/timeouts separate',
    after: 'Same population rule; total attempts also recorded',
  },
  {
    field: 'Scope',
    before:
      'POST /orders; mobile Chrome; mobile-4g-v1 network; 10000-SKU fixture; 20-item cart; warm cache',
    after:
      'Same route, mobile Chrome segment, mobile-4g-v1 network, 10000-SKU fixture, cart and warm cache',
  },
  {
    field: 'Window and version',
    before: 'Seven-day baseline; order-before',
    after: 'Different seven-day post-deploy window; order-after',
  },
  {
    field: 'Completed sample',
    before: 'Completed count and sample limitations documented',
    after:
      'New completed count documented; adequate for this hypothetical comparison',
  },
  {
    field: 'Failures and timeouts',
    before: 'Both rates and attempts recorded separately',
    after: 'Same definitions; no observed increase in this case',
  },
  {
    field: 'User outcome and target',
    before: 'Observed browser outcome misses the stated user target',
    after: 'Comparable browser outcome meets that same target',
  },
  {
    field: 'Correctness',
    before: 'Stock, payment and order behavior tested',
    after: 'Same behavior passes correctness checks',
  },
]

function compared(
  changes: Partial<Record<string, string>>,
): readonly ComparisonRow[] {
  return COMPARABLE.map((row) => ({
    ...row,
    after: changes[row.field] ?? row.after,
  }))
}

export const COMPARISON_CASES: readonly DecisionCase[] = [
  {
    id: 'internal',
    prompt:
      'Batching reduced the controlled inventory round trips. The after browser record is missing. Has production checkout improved?',
    options: COMPARE_OPTIONS,
    answer: 'observe',
    comparison: compared({
      'User outcome and target':
        'Browser p95 and its sample are not recorded; only query count improved',
      'Completed sample':
        'Browser completed count and sample limitations are not yet recorded',
      Population:
        'Same planned completed-outcome duration rule; total attempts are not yet recorded',
      'Failures and timeouts':
        'Browser failure and timeout rates and attempt counts are not yet recorded',
    }),
    why: 'The faster internal work is diagnostic. Collect the same browser outcome, sample, failures and timeouts before claiming a production win.',
  },
  {
    id: 'scope',
    prompt:
      'The after result looks faster, but changes the device segment, cache state and duration population. What can be concluded?',
    options: COMPARE_OPTIONS,
    answer: 'repeat',
    comparison: compared({
      Scope: 'Desktop, cold cache and a different cart/data shape',
      Population: 'Success-only percentile; timeout population omitted',
    }),
    why: 'The comparison changed segment, workload, cache and population. Repeat the same outcome under a comparable scope, keeping failures and timeouts visible.',
  },
  {
    id: 'meets',
    prompt:
      'The comparable user outcome meets its target, failures and timeouts did not rise, and correctness is preserved. What next?',
    options: COMPARE_OPTIONS,
    answer: 'stop',
    comparison: COMPARABLE,
    why: 'Stop this optimization pass and observe the documented field window. Low or high traffic alone does not justify another change when the user target is met.',
  },
  {
    id: 'harm',
    prompt:
      'The browser outcome looks faster, but a stock check now accepts an unavailable item and failed orders increased. Is that a win?',
    options: COMPARE_OPTIONS,
    answer: 'revert',
    comparison: compared({
      'Failures and timeouts': 'Failed order rate increased',
      Correctness: 'Stock correctness check fails on an unavailable item',
    }),
    why: 'The change harms stock correctness and failures. Investigate or revert, then record the unresolved outcome gap. Faster duration does not close this pass.',
  },
]
