/**
 * Source: `docs/15-observability.md`, "### AI in observability".
 *
 * `AI_PREMISE` is the opening paragraph; `AI_LIMIT` the closing one. `PLAYS`
 * covers the six bulleted plays, each with a `kind` matching the doc's
 * parenthetical — five prompts and one CLI + MCP command.
 */
export const AI_PREMISE =
  'An agent is good at the parts of observability that are pattern-matching over text you already have — grouping errors, spotting what changed, writing a query in a language you do not know. It is bad at the part that decides whether you are actually covered, because that requires noticing what is not in the data, and the data is all it has.'

export const AI_LIMIT =
  'What it cannot do is tell you what you failed to instrument. Every one of those plays reads the signals that exist, and the failure this stage is most concerned with — the job that never ran, the business failure that threw nothing, the alert routed to a dead phone number — produces no signal at all. An agent will summarise a dashboard confidently while the thing that mattered is not on it.'

export type Play = {
  id: string
  title: string
  kind: 'mcp' | 'command' | 'prompt' | 'cli' | 'cli-mcp'
  body: string
}

export const PLAYS: Play[] = [
  {
    id: 'draft-alert-set',
    title: 'Draft the alert set from your own event names',
    kind: 'prompt',
    body: 'Give it your structured log events, your four signals and your traffic shape, and ask for alert rules with thresholds, durations and a minimum-volume gate. The rules come back reasonable and the numbers come back invented — they are the part you replace with your own baselines.',
  },
  {
    id: 'which-events-stopped',
    title: 'Ask which events stopped',
    kind: 'prompt',
    body: "Paste a day of log events and yesterday's, and ask what appears in one and not the other. This is the one analysis that addresses the failure mode nothing else in this stage sees, and it is mechanical enough to hand over.",
  },
  {
    id: 'scrubbing-deny-list',
    title: 'Write the scrubbing deny-list from your own schema',
    kind: 'prompt',
    body: 'Point it at your schema and your environment variable names and ask which values would end up in an error payload. It finds the connection string you forgot; you verify by sending a test event and reading what arrived.',
  },
  {
    id: 'query-logs',
    title: 'Query logs in a language you do not know',
    kind: 'cli-mcp',
    body: 'Describe the question in English and let it write the CloudWatch Logs Insights query or the PromQL. Reading a query you did not write is much easier than writing it, which reverses the usual argument against generated code here.',
  },
  {
    id: 'incident-to-alert',
    title: 'Turn an incident into the alert you were missing',
    kind: 'prompt',
    body: 'Paste the timeline of something you found out about late, and ask what signal would have fired first. It reliably names one you do not have.',
  },
  {
    id: 'dashboard-as-config',
    title: 'Generate the dashboard as configuration',
    kind: 'prompt',
    body: 'Grafana and CloudWatch both take JSON. Describe the four signals and the deploy markers and edit what comes back, rather than clicking twelve panels into existence.',
  },
]
