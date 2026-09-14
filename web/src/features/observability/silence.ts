// web/src/features/observability/silence.ts
import type { DrillOption, DrillRow } from './drill-types'

/**
 * Source: `docs/15-observability.md`, "### When nothing is reporting" — the
 * five bulleted failures that raise no exception, plus one control the
 * tracker does see, so the answer is not always the same and the reader
 * has to read. The control sits second, not last.
 */
export const QUESTION = 'Does your error tracker see this?'
export const SUBTITLE =
  'Six failures. Some reach Sentry; some produce nothing at all. The answers are not all the same.'

export const OPTIONS: DrillOption[] = [
  { id: 'seen', label: 'Sentry sees it' },
  { id: 'unseen', label: 'Nothing is reported' },
]

export const ROWS: DrillRow[] = [
  {
    id: 'swallowed-catch',
    prompt:
      'The database is down. The code that calls it has `catch {}` with nothing inside.',
    answer: 'unseen',
    why: 'A bare `catch {}` swallows the reason: the dependency is down, the code knows, and why is gone forever.',
  },
  {
    id: 'unhandled-throw',
    prompt:
      'A route handler throws a `TypeError` that nothing catches. The user gets a 500.',
    answer: 'seen',
    why: 'Out of the box, Sentry tells you an exception occurred — this is the case it was built for, and the one the rest of this list is not.',
  },
  {
    id: 'declined-card',
    prompt:
      'A card is declined. The app logs `invoice.payment_declined` and shows the retry screen.',
    answer: 'unseen',
    why: 'is a business failure that throws nothing. So is every handled `4xx`.',
  },
  {
    id: 'third-party-200',
    prompt:
      'A third-party API returns `200` with `{"status": "failed"}` in the body.',
    answer: 'unseen',
    why: 'Your HTTP client is satisfied. Your integration is not.',
  },
  {
    id: 'client-side',
    prompt:
      'A JavaScript error in the browser stops the checkout button working. No request is ever made.',
    answer: 'unseen',
    why: 'It never reached your server, so your server has nothing to say about it.',
  },
  {
    id: 'dropped-by-config',
    prompt:
      "An error fires inside a batch loop after the month's Sentry quota ran out.",
    answer: 'unseen',
    why: 'sampling, a quota, or the `beforeSend` you just wrote.',
  },
]
