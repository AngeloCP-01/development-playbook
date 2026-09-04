export type Answer = 'preview' | 'staging'

export type Choice = {
  id: Answer
  label: string
}

export const CHOICES: Choice[] = [
  { id: 'preview', label: 'Preview deployment' },
  { id: 'staging', label: 'Staging environment' },
]

export type Scenario = {
  id: string
  situation: string
  answer: Answer
  reasoning: string
}

export const SCENARIOS: Scenario[] = [
  {
    id: 'stripe-webhook',
    situation:
      'You need to test a Stripe webhook integration with a sandbox account that requires a fixed callback URL.',
    answer: 'staging',
    reasoning:
      'A sandbox account with a fixed callback URL needs one stable URL to point at. The doc says staging matters when "you need one stable URL to point at — a third party integrating against you."',
  },
  {
    id: 'pr-review',
    situation:
      'A teammate wants to see your pull request running in a real browser before approving it.',
    answer: 'preview',
    reasoning:
      'Every pull request gets a preview deployment automatically. The teammate clicks the link in the PR — no staging needed.',
  },
  {
    id: 'migration-test',
    situation:
      'You want to test a database migration that adds a column, against production-shaped data.',
    answer: 'preview',
    reasoning:
      'With Neon database branching, the preview gets its own copy-on-write branch from production. You can run destructive migrations with no risk to production.',
  },
  {
    id: 'client-demo',
    situation:
      'A client demo next week needs a URL that stays the same regardless of new commits to the branch.',
    answer: 'staging',
    reasoning:
      'The doc says staging matters for "a stakeholder who cannot handle a new link each time." A client demo needs a stable URL that does not change when you push.',
  },
  {
    id: 'responsive-check',
    situation:
      'You want to check a UI change at 320px on a throttled network connection.',
    answer: 'preview',
    reasoning:
      'The preview checklist says to check "a narrow viewport, and one wide one" and "a slow network." This is exactly what a preview URL is for.',
  },
]
