/**
 * Source: `docs/14-post-deployment-verification.md`, "### AI in post-deployment
 * verification".
 *
 * `AI_PREMISE` is the opening paragraph: what an agent handles well (the
 * mechanical parts) and poorly (the judgment on top). `AI_LIMIT` is the
 * closing paragraph: the gap an agent cannot close — noticing what is
 * absent. Both are pinned against the doc in `ai-plays.test.ts`.
 *
 * `PLAYS` covers the four bulleted plays, each with a `kind` matching the
 * parenthetical in the doc: prompt, or the CLI + MCP command for the
 * ten-minute check.
 */
export const AI_PREMISE =
  'An agent is good at the mechanical parts of verification — running commands, parsing output, comparing numbers to a baseline — because the rules are explicit. It is bad at the judgment that sits on top: whether a metric that changed is a problem or expected, whether the absence of an error is itself suspicious, whether production traffic patterns expose a bug class that never appeared in preview.'

export const AI_LIMIT =
  'An agent that reports "no new errors" cannot see the error that should be there but is not — a silent failure, a dropped webhook, traffic that stopped arriving. The half-hour follow-up exists because some problems need a human who notices what is absent.'

export type Play = {
  id: string
  title: string
  kind: 'mcp' | 'command' | 'prompt' | 'cli'
  body: string
}

export const PLAYS: Play[] = [
  {
    id: 'generate-smoke-suite',
    title: 'Generate a smoke test suite from a manual checklist',
    kind: 'prompt',
    body: 'Describe the critical path you walk after every deploy — load homepage, sign in, create a record, check the dashboard — and the agent writes a Playwright @smoke suite that does it. Review the assertions; a smoke test with no assertions is a page-load test.',
  },
  {
    id: 'parse-anomalies',
    title: 'Parse Sentry or CloudWatch for anomaly patterns',
    kind: 'prompt',
    body: 'Paste the post-deploy error list and ask the agent to group by type, flag anything first-seen-after-this-deploy, and compare error volume to the baseline you give it. Faster than scanning a dashboard when the list is long.',
  },
  {
    id: 'run-ten-minute-check',
    title: 'Run the ten-minute check against a deployed URL',
    kind: 'mcp',
    body: 'claude-in-chrome or playwright can load the production URL, walk the critical path, and screenshot each step. The agent catches a broken page, a missing element, a console error. It does not catch "this feels slower" or "that number looks wrong."',
  },
  {
    id: 'compare-baseline',
    title: 'Compare CloudWatch metrics to a stored baseline',
    kind: 'prompt',
    body: "Give the agent the baseline numbers (p75 latency, error rate, request count) and the current numbers from aws cloudwatch get-metric-statistics. It flags anything outside the threshold you define. The threshold is yours; the arithmetic is the agent's.",
  },
]
