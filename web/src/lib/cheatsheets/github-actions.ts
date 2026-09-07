import type { Cheatsheet } from './types'

/**
 * No source plate — content original to this playbook, tethered to stage 11.
 * The tool-specific half of the pair: `ci-cd` carries the platform-agnostic
 * pipeline, this sheet the syntax for one runner.
 */
export const githubActions: Cheatsheet = {
  slug: 'github-actions',
  title: 'GitHub Actions',
  group: 'Standards',
  stage: '11-ci-cd',
  blurb:
    'Workflow syntax, common patterns, and secrets handling for the CI gate this playbook teaches.',
  sections: [
    {
      title: 'Workflow syntax',
      note: 'The skeleton every workflow starts from — the seven triggers this playbook actually uses.',
      rows: [
        {
          term: '`on: push`',
          what: 'Runs on every push to matched branches.',
          when: 'The CI gate — `push: { branches: [main] }` plus `pull_request`.',
        },
        {
          term: '`on: pull_request`',
          what: 'Runs when a PR is opened, updated, or reopened.',
          when: 'Every PR gets a gate run. Pairs with `push` on the main branch.',
        },
        {
          term: '`on: deployment_status`',
          what: 'Fires when an external deploy (Vercel) reports success or failure.',
          when: 'E2E tests against the real preview URL, not a dev server.',
        },
        {
          term: '`on: schedule`',
          what: 'Cron-syntax trigger — `schedule: [{ cron: "0 6 * * 1" }]`.',
          when: 'Weekly tasks: dependency audits, stale-branch cleanup.',
        },
        {
          term: '`on: workflow_dispatch`',
          what: 'Manual trigger with optional input parameters.',
          when: 'One-off tasks: database migrations, manual deploys, cache clears.',
        },
        {
          term: '`jobs:` → `steps:`',
          what: 'A job runs on one runner. Steps run sequentially inside it.',
          when: 'One job for a pipeline under five minutes. Split to parallel jobs past that. For what the steps should *be*, see `ci-cd`.',
        },
        {
          term: '`uses:` vs `run:`',
          what: '`uses` calls a published action. `run` executes a shell command.',
          when: '`uses` for checkout, setup, and artifact upload. `run` for your own scripts.',
        },
      ],
    },
    {
      title: 'Common patterns',
      note: 'Patterns that keep a pipeline fast, cheap, and maintainable.',
      rows: [
        {
          term: 'Concurrency + cancel-in-progress',
          what: '`concurrency: { group: ci-${{ github.ref }}, cancel-in-progress: true }` — one run per branch.',
          when: 'Every CI workflow. Three pushes cost one run, not three.',
        },
        {
          term: 'Matrix strategy',
          what: '`strategy: { matrix: { node: [18, 20] } }` — runs the job once per combination.',
          when: 'Testing across Node versions or OS variants. Not needed for a single-target pipeline.',
        },
        {
          term: 'Conditional steps',
          what: "`if: failure()` or `if: github.event_name == 'pull_request'` — run a step only when a condition holds.",
          when: 'Upload artifacts on failure. Skip expensive steps on draft PRs.',
        },
        {
          term: 'Artifact upload/download',
          what: '`actions/upload-artifact` saves files between jobs or for download. `download-artifact` retrieves them.',
          when: 'Playwright traces on failure. Build output passed to a deploy job.',
        },
        {
          term: 'Cache',
          what: '`actions/setup-node` with `cache: pnpm` caches the package store across runs.',
          when: 'Every Node.js workflow. Cuts install from ~25s to ~5s on a warm cache.',
        },
        {
          term: 'Reusable workflows',
          what: '`on: workflow_call` turns a workflow into a callable subroutine with inputs and secrets.',
          when: 'Monorepos or multiple services sharing the same CI shape.',
        },
      ],
    },
    {
      title: 'Secrets and permissions',
      note: 'Credential handling — the part where mistakes are not recoverable by re-running.',
      rows: [
        {
          term: '`secrets.*` context',
          what: 'Repository or environment secrets, never echoed to logs.',
          when: 'API tokens, deploy keys, any credential. Never in the workflow file itself.',
        },
        {
          term: 'OIDC token exchange',
          what: '`permissions: { id-token: write }` lets the runner mint a short-lived JWT. The cloud provider exchanges it for temporary credentials.',
          when: 'AWS, GCP, Azure deployments. Replaces long-lived access keys with per-run tokens that cannot leak.',
        },
        {
          term: '`permissions:` block',
          what: 'Scopes the `GITHUB_TOKEN` to only what the workflow needs.',
          when: 'Every workflow. Principle of least privilege — `contents: read` unless you need to push.',
        },
        {
          term: 'Environment protection rules',
          what: 'Require manual approval, restrict to specific branches, add wait timers.',
          when: 'Production deploy workflows. A human gate before the automated one ships.',
        },
      ],
    },
  ],
}
