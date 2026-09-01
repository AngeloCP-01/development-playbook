import type { Cheatsheet } from './types'

/**
 * Six deployment environments from local to production, plus a focused
 * preview-vs-staging comparison. Tethered to stage 12 (Staging), which
 * teaches preview deployments in depth; this sheet places them in the
 * full chain a reader meets across stages 04, 11, 12, 13 and 14.
 *
 * Primary source: Northflank's "Dev, QA, preview, test, staging, and
 * production environments". The preview-vs-staging dimension table draws
 * on Autonoma's "Staging Environment vs Preview Environment" for the
 * isolation, lifecycle, and confidence framing.
 */
export const deploymentEnvironments: Cheatsheet = {
  slug: 'deployment-environments',
  title: 'Deployment Environments',
  group: 'Standards',
  stage: '12-staging',
  blurb:
    'Six environments from local to production — what each catches and what it cannot.',
  source: {
    title: 'Dev, QA, preview, test, staging, and production environments',
    author: 'Northflank',
    url: 'https://northflank.com/blog/what-are-dev-qa-preview-test-staging-and-production-environments',
  },
  sections: [
    {
      title: 'Six environments',
      note: 'Not every project uses all six. Solo, you typically run local, preview and production. The middle three earn their place when a team, a compliance process, or a third-party integration demands them.',
      rows: [
        {
          term: 'Local / Dev',
          what: 'Your machine. Fast iteration, expected errors, no shared state. The only environment where a broken build costs nobody else.',
          when: 'Always. Every change starts here.',
        },
        {
          term: 'Preview',
          what: 'A per-branch deploy at its own URL, created automatically on every pull request and torn down on merge. Fully isolated from other branches.',
          when: 'Every pull request. The default pre-production check for solo and small-team work.',
        },
        {
          term: 'QA',
          what: 'A structured testing hub owned by a QA function. A release candidate is deployed here, tested against production-shaped data, and signed off before promotion.',
          when: 'When a dedicated QA role owns regression sign-off and needs a stable target that is not production.',
        },
        {
          term: 'Test / Integration',
          what: 'Validates that components talk to each other. Runs integration and contract tests against real (or realistic) dependencies rather than mocks.',
          when: 'When integration tests need infrastructure CI cannot provide — a real database, a message queue, an external API sandbox.',
        },
        {
          term: 'Staging',
          what: 'A long-lived deploy mirroring production as closely as possible. Tracks a shared branch, runs production-equivalent infrastructure, connects to production-shaped data.',
          when: 'When something demands a stable URL: a third-party callback, a client demo, a compliance sign-off, or a QA process that compares one release to the last.',
        },
        {
          term: 'Production',
          what: 'Live, serving real users. The only environment whose failures have real consequences.',
          when: 'After every other environment has done its job. Changes arrive here via the deployment pipeline, never directly.',
        },
      ],
    },
    {
      title: 'Preview vs staging',
      note: 'The choice stage 12 teaches. Most solo developers need preview and not staging. Add staging when something concrete demands a stable URL.',
      rows: [
        {
          term: 'Isolation',
          what: 'Preview: one per PR, fully isolated — your work cannot break another branch. Staging: shared, all in-flight work deploys to the same environment.',
        },
        {
          term: 'Lifecycle',
          what: 'Preview: spins up on PR open, torn down on merge. Staging: long-lived, maintained continuously whether or not anyone is using it.',
        },
        {
          term: 'Who tests',
          what: 'Preview: the author and their reviewers. Staging: QA engineers, stakeholders, third-party integrators who need a stable URL.',
        },
        {
          term: 'Feedback speed',
          what: 'Preview: minutes from push to a live URL. Staging: hours to days, because deploys are queued and shared state must be coordinated.',
        },
        {
          term: 'Cost model',
          what: 'Preview: pay per use, scales to zero when no PRs are open. Staging: fixed cost, runs idle, still drifts and still generates alerts.',
        },
        {
          term: 'Confidence',
          what: 'Preview: high confidence that one change works. Staging: lower for any single change, higher for the release as a whole.',
        },
        {
          term: 'What breaks when it fails',
          what: "Preview: one PR's review is blocked. Staging: the whole team's deployment queue backs up, and isolating the cause is forensic work.",
        },
      ],
    },
  ],
}
