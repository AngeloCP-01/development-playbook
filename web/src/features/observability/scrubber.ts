// web/src/features/observability/scrubber.ts
import type { DrillOption, DrillRow } from './drill-types'

/**
 * Source: `docs/15-observability.md`, "### Errors that are actually useful"
 * (the `beforeSend` fence and the "separate door" paragraph) and "###
 * Structured logs" ("`beforeSend` protects error reports; it does nothing
 * to log output"). Six values; does the scrubber shown in this step catch
 * each one?
 */
export const QUESTION = 'Does `beforeSend` scrub this before it leaves?'
export const SUBTITLE =
  'The scrubber above covers three surfaces. Six values are on their way out — which ones does it reach?'

export const OPTIONS: DrillOption[] = [
  { id: 'scrubbed', label: 'Scrubbed' },
  { id: 'reaches', label: 'Reaches Sentry' },
]

export const ROWS: DrillRow[] = [
  {
    id: 'authorization-header',
    prompt: "The request's `Authorization: Bearer …` header.",
    answer: 'scrubbed',
    why: 'Sentry captures request headers by default, and that is where credentials live.',
  },
  {
    id: 'form-body',
    prompt:
      'The body of the form post that was in flight when the error threw.',
    answer: 'scrubbed',
    why: 'It captures bodies too. A form post carries whatever the form carried.',
  },
  {
    id: 'exception-message',
    prompt:
      'An exception whose message contains `postgresql://app:hunter2@db/app`.',
    answer: 'scrubbed',
    why: 'an exception message is free text: a failed query prints the connection string, password included.',
  },
  {
    id: 'add-context-card',
    prompt:
      '`Sentry.setContext("checkout", { card: "4242…" })`, called from your own code.',
    answer: 'reaches',
    why: '`addContext` is a separate door: `Sentry.setContext` accepts whatever you hand it, and the deny-list above never runs over it.',
  },
  {
    id: 'breadcrumb-token',
    prompt:
      'A breadcrumb your code added that includes a session token in its message.',
    answer: 'reaches',
    why: 'Verify with a synthetic secret sent through every surface you actually use — context, breadcrumbs, tags — not only the request and exception fields `beforeSend` covers.',
  },
  {
    id: 'pino-log-line',
    prompt:
      'A `logger.warn` line whose message includes the same connection string.',
    answer: 'reaches',
    why: '`beforeSend` protects error reports; it does nothing to log output.',
  },
]
