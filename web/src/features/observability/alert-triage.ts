// web/src/features/observability/alert-triage.ts
import type { DrillOption, DrillRow } from './drill-types'

/**
 * Source: `docs/15-observability.md`, "### Alerts you will not learn to
 * ignore" — the "Worth alerting on" (8) and "Not worth alerting on" (3)
 * lists. The stage's central exercise: is this alert one you would act on?
 */
export const QUESTION = 'Would you page on this?'
export const SUBTITLE =
  'Eleven candidates. Commit before the verdict shows — the only rule that matters is whether you would act on it at 2am.'

export const OPTIONS: DrillOption[] = [
  { id: 'page', label: 'Page me' },
  { id: 'no-page', label: 'Do not page' },
]

export const ROWS: DrillRow[] = [
  {
    id: 'error-rate-above-baseline',
    prompt:
      'The error rate has been above your written-down baseline for six minutes.',
    answer: 'page',
    why: 'Error rate above baseline for 5+ minutes',
  },
  {
    id: 'new-signature',
    prompt:
      'One error, seen once, with a stack trace you have never seen before — ten minutes after a deploy.',
    answer: 'page',
    why: 'This is the one exception to the rule below, and it earns it: a novel error after a deploy is the highest-information event your system produces.',
  },
  {
    id: 'unreachable-from-outside',
    prompt:
      'Your external monitor cannot reach the site. Internal dashboards look normal.',
    answer: 'page',
    why: 'The site being unreachable from outside',
  },
  {
    id: 'p95-doubled',
    prompt: 'p95 latency doubled twenty minutes ago and has stayed there.',
    answer: 'page',
    why: 'p95 latency doubling and staying there',
  },
  {
    id: 'payment-failures-spiking',
    prompt: 'Payment failures are running at five times their usual rate.',
    answer: 'page',
    why: 'Payment or auth failures spiking',
  },
  {
    id: 'connections-near-limit',
    prompt:
      'Database connections are at 92 of a 100-connection pool. Every request is still succeeding.',
    answer: 'page',
    why: 'a resource with a hard ceiling that does not recover on its own — a connection pool, a disk, an API quota — is worth alerting on before it becomes a symptom, because crossing it is a cliff rather than a slope.',
  },
  {
    id: 'job-failing-repeatedly',
    prompt:
      'The nightly reconciliation job has thrown on each of its last four runs.',
    answer: 'page',
    why: 'A background job failing repeatedly',
  },
  {
    id: 'traffic-near-zero',
    prompt:
      'Requests per minute dropped to almost nothing at 2pm on a weekday. Nothing is erroring.',
    answer: 'page',
    why: 'Traffic falling to near zero outside a pattern you recognise — the fastest signal that something upstream of your application is broken',
  },
  {
    id: 'single-known-error',
    prompt: 'One occurrence of an error you have seen forty times this month.',
    answer: 'no-page',
    why: 'A single occurrence of an error signature you have seen before',
  },
  {
    id: 'cpu-spike-self-resolved',
    prompt:
      'CPU hit 85% for ninety seconds and came back down. Latency never moved.',
    answer: 'no-page',
    why: 'CPU spikes that self-resolve',
  },
  {
    id: 'resolves-itself-for-months',
    prompt:
      'A warning that has fired and cleared on its own every Sunday night for four months.',
    answer: 'no-page',
    why: 'Anything that has resolved itself every time for months',
  },
]
