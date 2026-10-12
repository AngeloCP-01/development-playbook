export const CHECKLIST_KEY = 'playbook:performance-checklist:v1'
export const EMPTY_CHECKS: readonly string[] = []
export const DONE = [
  {
    id: 'comparable',
    text: 'The same outcome is measured before and after, with comparable segment, data and cache state',
  },
  {
    id: 'field',
    text: 'The production or field comparison records the window, sample, percentile, failures and timeouts',
  },
  {
    id: 'target',
    text: 'The measured outcome meets its stated target, or the unresolved gap is recorded',
  },
  {
    id: 'correctness',
    text: 'Correctness tests pass and the order, payment and inventory behavior remains intact',
  },
  {
    id: 'disposition',
    text: 'A failed or harmful change is reverted or explicitly carried as an open problem',
  },
] as const

export const ARTIFACTS = [
  'A baseline record naming the outcome, metric, scope, window, sample and target',
  'The trace, query plan or controlled run that supports the chosen hypothesis',
  'The change and its correctness/rollback checks',
  'A comparable before and after record, including unsuccessful attempts',
] as const

export const TEAM = [
  {
    id: 'targets',
    title: 'Publish the targets',
    detail:
      'Publish the outcome, target and scope so everyone measures the same thing.',
  },
  {
    id: 'budget',
    title: 'Name the CI budget',
    detail:
      'State the CI metric, threshold and representative run. A passing build alone is not a bundle-size budget.',
  },
  {
    id: 'plans',
    title: 'Review query plans',
    detail:
      'Review relevant query plans when data access changes on a measured slow path.',
  },
  {
    id: 'owner',
    title: 'Own the observation window',
    detail:
      'Assign who observes the outcome after deployment and decides whether the change helped.',
  },
] as const
