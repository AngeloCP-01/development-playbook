export type FixRow = {
  id: string
  title: string
  evidence: string
  risk: string
  retest: string
}
export type TrapRow = { id: string; title: string; detail: string }

export const FIXES: readonly FixRow[] = [
  {
    id: 'index',
    title: 'Index or query shape',
    evidence:
      'A representative slow order-history plan can justify testing `(owner_id, created_at DESC)` for the owner filter and creation sort. Consider table size, selectivity and write cost.',
    risk: 'Normal CREATE INDEX blocks writes while building. CONCURRENTLY takes longer, cannot run inside a transaction block, and failure can leave an invalid index. Check the migration runner and cleanup.',
    retest:
      'Compare the same query and workload, then measure the selected user outcome. Keep correctness and write cost visible.',
  },
  {
    id: 'n-plus-one',
    title: 'N+1 queries',
    evidence:
      'The controlled 20-item cart shows 21 inventory queries: one list query and one availability query per item. Confirm repeated calls in the trace or query log.',
    risk: 'Batching or joining must preserve the same stock decision and order result. A query-count reduction alone does not establish a user improvement.',
    retest:
      'Repeat the cart reproduction and compare the same browser outcome, completed sample, failures and timeouts after deployment.',
  },
  {
    id: 'awaits',
    title: 'Serial awaits',
    evidence:
      'Independent operations may overlap with Promise.all. Two independent 150 ms calls explain the arithmetic example of 300 ms to 150 ms.',
    risk: 'The arithmetic is not a promised measurement. A dependent payment or inventory step must keep its dependency.',
    retest:
      'Measure the same outcome with comparable load, and verify dependency and failure behavior.',
  },
  {
    id: 'cache',
    title: 'Caching',
    evidence:
      'Repeated reads of data safe to share may justify Cache Components with `use cache`, `cacheLife` and `cacheTag`.',
    risk: '`updateTag` is Server Actions only; the next read waits for fresh data. TTL and other invalidation paths differ. Test freshness and authorization, especially for stock or pricing.',
    retest:
      'Measure the same cold or warm cache condition and test the read after a write, user scope and stale-data recovery.',
  },
  {
    id: 'bundles',
    title: 'Client bundles',
    evidence:
      'Use a version-appropriate analyzer to identify what an affected client route ships. Next.js 16 no longer prints route-level JS bundle sizes in next build.',
    risk: 'A production build checks build correctness. It is not a bundle-size budget or proof an import change helped users.',
    retest:
      'Measure the affected page experience after the import change, in the same device and network segment.',
  },
  {
    id: 'images',
    title: 'Images',
    evidence:
      'A measured image-loading bottleneck can justify responsive sizes and modern formats. A large image cannot explain the cart example’s repeated server queries.',
    risk: 'next/image is lazy by default; an LCP image may need eager loading or fetch priority. Static export needs a compatible loader for the default Image Optimization API.',
    retest:
      'Measure the same page LCP and device segment, preserving image dimensions and visual stability.',
  },
  {
    id: 'server-components',
    title: 'Server Components',
    evidence:
      'Eligible server fetching and rendering can reduce client JavaScript and a client-side fetch waterfall.',
    risk: 'This does not remove every loading state or make a slow server query fast. Keep sensitive data and server-only dependencies off the client.',
    retest:
      'Measure shipped client code and the affected user outcome, and verify fetching and loading behavior.',
  },
]

export const TRAPS: readonly TrapRow[] = [
  {
    id: 'measure',
    title: 'Optimizing without measuring',
    detail:
      'Record the observer, outcome and baseline first, so a later change has a comparable measurement.',
  },
  {
    id: 'averages',
    title: 'Averages instead of percentiles',
    detail:
      'An average can hide the slow tail. Keep sample count and the percentile population beside the result.',
  },
  {
    id: 'field',
    title: 'Treating a local run as field evidence',
    detail:
      'Controlled hardware, network and data support diagnosis. They may not represent the people using the application.',
  },
  {
    id: 'index',
    title: 'Adding an index by reflex',
    detail:
      'Check the plan, selectivity, workload and write cost. Plan migration locking before choosing an index.',
  },
  {
    id: 'freshness',
    title: 'Caching without a freshness rule',
    detail:
      'Test the read after a write. Faster stale stock or pricing is a correctness problem.',
  },
  {
    id: 'memo',
    title: 'memo and useMemo everywhere',
    detail:
      'Profile the user outcome and render work before adding memo comparison cost and complexity.',
  },
  {
    id: 'traffic',
    title: 'Dismissing low traffic',
    detail:
      'A rare workflow can still be critical. Decide from user impact and the target rather than request count alone.',
  },
  {
    id: 'span',
    title: 'Stopping at a faster internal span',
    detail:
      'Retest the same user outcome in field or production observations, with failures, timeouts and correctness visible.',
  },
]

export const AI_PLAYS = [
  {
    id: 'record',
    title: 'Organize the record',
    detail:
      'Ask an assistant to separate the user clock, scope, population and evidence. Verify each field against the raw source.',
  },
  {
    id: 'hypotheses',
    title: 'Compare hypotheses',
    detail:
      'Use superpowers:systematic-debugging to state competing causes and the measurement that could disprove each. A trace only contains instrumented work.',
  },
  {
    id: 'reproduce',
    title: 'Draft a controlled reproduction',
    detail:
      'Supply the device, network, data shape and cache state. Check the reproduction and arithmetic yourself; a lab run does not establish field p95.',
  },
] as const

export const AI_PROMPT = [
  'Review this redacted performance evidence.',
  'Outcome, observer and start/stop events:',
  'Metric, population, total attempts, completed samples, failures and timeouts:',
  'Route/event, deployment version, segment, data shape and cache state:',
  'Window, target and raw evidence:',
  'Separate field outcome evidence from traces, query plans and controlled runs.',
  'Suggest competing hypotheses and a controlled test that could disprove each.',
  'Cite source references and verify arithmetic against the raw evidence.',
  'Require a comparable after observation and correctness/rollback checks.',
  'Do not invent measurements or declare a production win from a local run.',
  'Exclude customer details, payment data and secrets.',
].join('\n')

export const COVERAGE: Record<string, readonly string[]> = {
  'Entry criteria': ['clock'],
  'Map the order journey': ['clock'],
  'Measure the first baseline': ['baseline', 'record'],
  'Decide what fast enough means': ['target'],
  'Find the real bottleneck': ['bottleneck', 'query', 'compare'],
  'The fixes that usually matter': ['fixes'],
  'When not to optimize': ['target', 'compare'],
  'AI in performance optimization': ['ai'],
  Artifacts: ['record', 'followup', 'done'],
  'Definition of done': ['done'],
  'Scaling to a team': ['done'],
  Traps: ['traps'],
}
