export const AI_PREMISE =
  'AI generates a working first draft of a workflow file faster than writing it from scratch. Use it — then read every line, because the three things a draft gets wrong are exactly the three that matter.'

export const AI_LIMIT =
  'AI does not decide what to enforce. The human owns the protection rules, the secrets perimeter, and the decision of which failures block a merge. An AI draft optimises for a file that parses, not a pipeline that protects.'

export type Play = {
  id: string
  title: string
  kind: 'command' | 'prompt' | 'cli' | 'tool'
  body: string
}

export const PLAYS: Play[] = [
  {
    id: 'copilot-workflow',
    title: 'Copilot: generate a workflow draft',
    kind: 'prompt',
    body: 'GitHub Copilot fills in `on:` triggers, step sequences, and caching from a one-line comment. Start from that draft, then verify trigger conditions, secrets boundaries, and concurrency logic by hand.',
  },
  {
    id: 'copilot-autofix',
    title: 'Copilot Autofix for security alerts',
    kind: 'tool',
    body: 'Reviews Dependabot security advisories and opens a PR with a fix. Faster than reading the advisory yourself and correct often enough to be worth reviewing.',
  },
  {
    id: 'code-review-ci',
    title: 'Run /code-review on workflow changes',
    kind: 'command',
    body: 'Run `/code-review` on PRs that modify `.github/workflows/`. Catches unused env vars, missing `if:` guards, and redundant steps. Five effort levels; `--fix` auto-applies.',
  },
  {
    id: 'flakiness-detection',
    title: 'AI-assisted flakiness detection',
    kind: 'tool',
    body: 'Pattern recognition across test runs surfaces tests that fail intermittently before the team learns to ignore red builds. A pattern-matching problem AI handles better than people do.',
  },
]
