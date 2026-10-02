// web/src/features/observability/checklist.ts
/**
 * Source: `docs/15-observability.md`, "## Artifacts", "## Definition of
 * done", and "## Scaling to a team". Same shape as stage 14's `checklist.ts`:
 * `DONE` keyed on stable ids (position-independent), `ARTIFACT_LIST`, and
 * `TEAM` notes for the checklist's disclosure.
 */

export type DoneItem = {
  id: string
  label: string
}

export const DONE: DoneItem[] = [
  {
    id: 'errors-reach-sentry',
    label: 'Errors reach Sentry with readable stack traces and user context',
  },
  {
    id: 'no-secrets-or-personal-data',
    label:
      'No secrets, and no personal data beyond the opaque identifiers this stage allows — each one minimized to what a fix needs',
  },
  {
    id: 'know-how-to-delete',
    label:
      "You know how to delete a person's data from your error tracker and your logs, and have checked the retention window on both",
  },
  {
    id: 'key-events-structured',
    label: 'Key events logged as structured objects',
  },
  {
    id: 'health-check-verifies-db',
    label: 'Health check verifies the database, not just the process',
  },
  {
    id: 'external-uptime-active',
    label: 'External uptime monitoring is active',
  },
  {
    id: 'every-alert-actionable',
    label: 'Every configured alert is one you would act on at 2am',
  },
  {
    id: 'alerts-interrupt',
    label: 'Alerts route somewhere that interrupts you',
  },
  {
    id: 'test-alert-fired',
    label:
      'At least one alert has been fired deliberately and confirmed to arrive',
  },
  {
    id: 'baselines-documented',
    label: 'Baselines documented for error rate and p95 latency',
  },
  {
    id: 'deploy-markers',
    label: 'Dashboard shows deploy markers',
  },
  {
    id: 'heartbeat-on-every-job',
    label:
      'Every scheduled job pings a heartbeat on success, and you have watched the monitor page you by withholding a test ping',
  },
  {
    id: 'request-id-joins',
    label: "A single request id joins a request's log line to its error report",
  },
  {
    id: 'retention-chosen',
    label: 'Log retention is a number you chose, and you know what it costs',
  },
  {
    id: 'liveness-readiness-separate',
    label:
      "Liveness and readiness are separate endpoints, and the platform's restart trigger uses the one that does not check dependencies",
  },
]

export type TeamNote = {
  id: string
  title: string
  body: string
}

export const TEAM: TeamNote[] = [
  {
    id: 'define-slo',
    title: 'Define an SLO, and the error budget that follows from it',
    body: 'For a request-based SLO, "99.9% of requests succeed" allows 0.1% of requests to fail during the measurement window. For a time-based uptime SLO, 99.9% allows 43.2 minutes of unavailability in 30 days. Both are error budgets, but their units are different. Exceeding it is the rule that says to stop shipping features and fix reliability.',
  },
  {
    id: 'consider-opentelemetry',
    title:
      'Consider OpenTelemetry when instrumentation needs to work across backends',
    body: 'It provides vendor-neutral APIs, SDKs and tools for generating, collecting and exporting telemetry. Your backend still stores the data and supplies dashboards. A solo service can start with its platform integration; revisit this when multiple services or a provider change make that integration a constraint.',
  },
  {
    id: 'on-call-rotation',
    title: 'Set up on-call rotation',
    body: 'With a real escalation path, once the team can sustain it.',
  },
  {
    id: 'alerts-need-an-owner',
    title: 'Alerts need an owner',
    body: 'Unowned alerts are ignored by everyone, each assuming someone else has it.',
  },
  {
    id: 'review-alert-noise-monthly',
    title: 'Review alert noise monthly, as a team',
    body: 'The monthly review is where ownership gets assigned or the alert gets deleted.',
  },
  {
    id: 'add-distributed-tracing',
    title: 'Add distributed tracing',
    body: 'Once requests cross service boundaries and you cannot follow them in one place.',
  },
]

export const ARTIFACT_LIST: string[] = [
  'Sentry with user context, breadcrumbs, and scrubbing configured',
  'Structured logging with consistent event names',
  '`/api/health` checking real dependencies, and a separate liveness endpoint that does not',
  'External uptime monitoring on a real user path',
  'A small set of actionable alerts routed to a channel that interrupts you',
  'One dashboard with the four signals and deploy markers',
  'A heartbeat monitor on every scheduled job, alerting on a missing ping',
  'A read-only canary endpoint for an authenticated service',
  'A retention policy on every log group or drain, chosen rather than defaulted',
  'A request id on request-scoped log lines and matching error-tracker events',
]
