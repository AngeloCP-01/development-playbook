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
    id: 'copilot-review',
    title: 'Copilot code review in PRs',
    kind: 'tool',
    body: 'Mention `@copilot` in a PR comment. It runs an agentic analysis — exploring the repo, tracing cross-file dependencies, posting line-specific feedback. Runs on GitHub Actions minutes. Cannot gate a merge, so treat it as a fast first pass before the human reviewer.',
  },
  {
    id: 'copilot-autofix',
    title: 'Copilot Autofix for security alerts',
    kind: 'tool',
    body: 'Reviews Dependabot security alerts, explores your codebase, generates a fix, reruns CodeQL to verify it closes the vulnerability, iterates if needed, and opens a draft PR. The human touchpoint is at the end, not the beginning.',
  },
  {
    id: 'claude-code-ci',
    title: 'Claude Code as a CI step',
    kind: 'cli',
    body: '`anthropics/claude-code-action@v1` runs a headless `claude -p` inside a workflow step — automated PR review, test generation, or documentation checks on every push. Pass instructions via `prompt`, scope with `--max-turns`, and let the agent commit to a branch for human review.',
  },
  {
    id: 'code-review-ci',
    title: 'Run /code-review on workflow changes',
    kind: 'command',
    body: 'Run `/code-review` on PRs that modify `.github/workflows/`. Catches unused env vars, missing `if:` guards, and redundant steps. Five effort levels; `--fix` auto-applies.',
  },
  {
    id: 'build-diagnosis',
    title: 'Build failure diagnosis',
    kind: 'cli',
    body: 'Pipe a failed CI log into Claude Code and it identifies the root cause — missing dependency, version mismatch, environment variable not set — with the exact file path and line number. Faster than reading the log yourself when the failure is three pages of webpack output.',
  },
  {
    id: 'flakiness-detection',
    title: 'Flaky test detection and quarantine',
    kind: 'tool',
    body: 'Pattern recognition across test runs surfaces tests that fail intermittently before the team learns to ignore red builds. Tools like Trunk Flaky Tests, BuildPulse, and Datadog CI Visibility automate quarantine and tracking.',
  },
  {
    id: 'test-gap-analysis',
    title: 'Test gap analysis from coverage',
    kind: 'cli',
    body: 'Point Claude Code at a coverage report and it identifies untested code paths — not just uncovered lines, but the specific conditions and edge cases no test exercises. Useful after a coverage gate flags a drop.',
  },
]
