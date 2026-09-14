// web/src/features/observability/log-levels.ts
import type { DrillOption, DrillRow } from './drill-types'

/**
 * Source: `docs/15-observability.md`, "### Structured logs" — the level
 * ladder table and "Levels are a filter, not a mood." Six events, one level
 * each. The `why` for each is the ladder row or the doc's own worked case.
 */
export const QUESTION = 'Which level does this line get?'
export const SUBTITLE =
  'Choose the level by the action it warrants, not by how it feels. `error` is the level your alerting reads.'

export const OPTIONS: DrillOption[] = [
  { id: 'debug', label: 'debug' },
  { id: 'info', label: 'info' },
  { id: 'warn', label: 'warn' },
  { id: 'error', label: 'error' },
  { id: 'fatal', label: 'fatal' },
]

export const ROWS: DrillRow[] = [
  {
    id: 'card-declined',
    prompt:
      "A customer's card was declined by the payment provider. The app showed them the retry screen.",
    answer: 'info',
    why: 'A declined card is a routine business outcome and not a fault: it is `info`.',
  },
  {
    id: 'health-dependency',
    prompt:
      "The health check's `SELECT 1` timed out. The endpoint returned `503` as designed.",
    answer: 'warn',
    why: 'Not a fault, so not `error` — but the reason is the only evidence of how, and a bare `catch {}` destroys it.',
  },
  {
    id: 'provider-threw',
    prompt:
      'The call to the payment provider threw an unexpected exception and the request failed.',
    answer: 'error',
    why: 'A fault you would investigate; a common input to alerts',
  },
  {
    id: 'port-in-use',
    prompt:
      'On startup, the process could not bind its port and is about to exit.',
    answer: 'fatal',
    why: 'A fault that prevents the process continuing',
  },
  {
    id: 'query-timing',
    prompt:
      'Per-query timing for every SQL statement, useful while tuning an index locally.',
    answer: 'debug',
    why: 'Diagnostic detail, normally disabled in production',
  },
  {
    id: 'upstream-200-with-failure',
    prompt:
      'An external API returned `200` with `{"success": false}` in the body. The app handled it and moved on.',
    answer: 'warn',
    why: 'An unexpected condition the application handled',
  },
]
