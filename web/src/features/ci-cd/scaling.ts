export type ScalingMove = {
  id: string
  title: string
  trigger: string
  reason: string
  whyNotSooner: string
}

export const SCALING_MOVES: ScalingMove[] = [
  {
    id: 'approvals',
    title: 'Require approvals',
    trigger: 'Any team, from day one.',
    reason: 'One reviewer minimum; branch protection enforces it.',
    whyNotSooner:
      'Solo, you are the reviewer. The gate adds latency for no signal.',
  },
  {
    id: 'split-jobs',
    title: 'Split jobs when the suite grows',
    trigger: 'Past five minutes total pipeline time.',
    reason:
      'Parallel jobs start paying off despite the duplicated install cost. Matrix the test job by directory.',
    whyNotSooner:
      'Below five minutes, each parallel job pays the checkout-and-install cost and finishes slower than sequential.',
  },
  {
    id: 'merge-queue',
    title: 'Add a merge queue',
    trigger: 'Around four or five active engineers.',
    reason:
      'Tests each PR against the actual post-merge state rather than a stale branch point.',
    whyNotSooner:
      'Concurrent merge conflicts are rare below four people. The queue adds complexity for a problem you do not have.',
  },
  {
    id: 'remote-cache',
    title: 'Cache aggressively',
    trigger: 'Multiple engineers rebuilding identical artifacts.',
    reason:
      'Shared Turborepo remote cache stops every engineer rebuilding what the last one already produced.',
    whyNotSooner:
      'Solo, your local cache is the remote cache. The infra cost buys nothing.',
  },
  {
    id: 'flakiness-data',
    title: 'Publish flakiness data',
    trigger: 'Any team with a shared test suite.',
    reason:
      'Flaky tests get tolerated because everyone assumes someone else will fix them. A visible retry rate makes the cost legible.',
    whyNotSooner:
      'Solo, you know which tests are flaky because you wrote them. The dashboard has an audience of one.',
  },
]
