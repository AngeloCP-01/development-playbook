/**
 * Source: docs/03-architecture.md, "Sketch the system".
 *
 * The objection this section answers: if the answer is one application and one
 * database, the diagram is two boxes and a line. That is right about the
 * application and wrong about the system. Your application is one box; your
 * system takes payments, sends email, stores PDFs, and needs something to
 * notice an overdue invoice.
 *
 * `whenDown` is required on every external node by test, not by type, because
 * the failure question is the entire return on drawing this.
 */

import { type SchemaLine } from './scoring'

export type SketchNode = {
  id: string
  name: string
  kind: 'actor' | 'yours' | 'store' | 'external' | 'scheduled'
  does: string
  /** How it connects, written the way the container view labels an arrow. */
  edge: string
  /** Required on externals: what happens when this is down. */
  whenDown?: string
}

export const SKETCH_NODES: SketchNode[] = [
  {
    id: 'user',
    name: 'User',
    kind: 'actor',
    does: 'Creates invoices, sends them, and looks at whether they have been paid.',
    edge: 'browses the app over HTTPS',
  },
  {
    id: 'app',
    name: 'Next.js app',
    kind: 'yours',
    does: 'The only box you write code in. Everything else on this diagram is somebody else’s, which is the point of drawing it.',
    edge: 'the centre of the diagram',
  },
  {
    id: 'postgres',
    name: 'Postgres',
    kind: 'store',
    does: 'Holds every row, and is the source of truth for all of it. That last part is a design property, and the blob-storage answer below depends on it.',
    edge: 'app reads and writes, over a pooled connection',
  },
  {
    id: 'payments',
    name: 'Payment provider',
    kind: 'external',
    does: 'Takes the money, then tells you about it later over a webhook. You call it synchronously to charge; it calls you back asynchronously when the payment succeeds.',
    edge: 'app charges → provider; provider webhooks → app',
    whenDown:
      'Invoices still send, and payment reconciles late. Survivable, and it needs no code — which is worth knowing before you build a retry queue for it.',
  },
  {
    id: 'email',
    name: 'Email provider',
    kind: 'external',
    does: 'Delivers the invoice. Called synchronously on send, so if it fails the user finds out immediately.',
    edge: 'app sends → provider',
    whenDown:
      'This one is a decision, and the diagram is what forced it. The invoice must not be lost because the send failed. Either retry, or record the intent and send later — but pick one, because the default is losing the invoice.',
  },
  {
    id: 'blob',
    name: 'Blob storage',
    kind: 'external',
    does: 'Holds the rendered PDF of each invoice.',
    edge: 'app renders and stores → storage',
    whenDown:
      'An inconvenience rather than data loss, because PDFs are regenerable from the invoice row. That is only true because the row is the source of truth, which is a design property worth having noticed rather than assumed.',
  },
  {
    id: 'scheduled',
    name: 'Scheduled job',
    kind: 'scheduled',
    does: 'Runs daily, looks for sent invoices past their due date, and emails a reminder. It sends; it does not write a status. “Overdue” is computed, per the interrogation in Model.',
    edge: 'runs on a schedule; see 11 — CI/CD for where it lives',
  },
]

export type C4Level = {
  id: string
  name: string
  what: string
  /** Whether one person should actually draw it. */
  draw: boolean
  note: string
}

/** Four levels; draw two. */
export const C4_LEVELS: C4Level[] = [
  {
    id: 'context',
    name: 'Context',
    what: 'Your system and the world around it.',
    draw: true,
    note: 'Often folded into the container view, because the container view already carries the user and the external systems. Draw it separately once the outside world gets busy enough that mixing the two makes either unreadable.',
  },
  {
    id: 'container',
    name: 'Container',
    what: 'The deployable things inside your system.',
    draw: true,
    note: 'The one that pays for itself. It is where the external systems appear, and therefore where the failure question can be asked at all.',
  },
  {
    id: 'component',
    name: 'Component',
    what: 'The pieces inside one container.',
    draw: false,
    note: 'Worth drawing for the one subsystem complicated enough that you keep re-deriving how it fits together. Not for the rest.',
  },
  {
    id: 'code',
    name: 'Code',
    what: 'Classes, functions, the call graph.',
    draw: false,
    note: 'What your editor already draws, on demand, and more accurately than you would.',
  },
]

export type FlowStep = {
  n: number
  event: string
  consequence: string
  kind: 'sync' | 'async' | 'local'
}

/**
 * Pick the flow that crosses the most boundaries, because that is where the
 * design decisions hide. Steps 2 and 4 are different in kind, and that
 * difference is the decision the sync/async comparison poses.
 */
export const FLOW_STEPS: FlowStep[] = [
  {
    n: 1,
    event: 'User clicks “send”',
    consequence: 'The app writes status = ‘sent’ and calls the email provider.',
    kind: 'local',
  },
  {
    n: 2,
    event: 'Email provider accepts',
    consequence:
      'Synchronous. If it fails, the user finds out now, which is the property you are buying.',
    kind: 'sync',
  },
  {
    n: 3,
    event: 'Client pays, days later',
    consequence:
      'The payment provider fires a webhook at your app. Nothing in your system initiated this.',
    kind: 'local',
  },
  {
    n: 4,
    event: 'App receives the webhook',
    consequence:
      'Asynchronous, and not by your choice. Nobody is waiting, and it may arrive twice.',
    kind: 'async',
  },
  {
    n: 5,
    event: 'App writes status = ‘paid’',
    consequence:
      'Must be safe to run twice. That is idempotency, and on a payment flow it is not optional.',
    kind: 'async',
  },
]

export type SyncAsyncRow = {
  id: string
  question: string
  sync: string
  async: string
}

export const SYNC_ASYNC_ROWS: SyncAsyncRow[] = [
  {
    id: 'learn',
    question: 'You learn about failure',
    sync: 'Immediately, inside the request.',
    async: 'Later, or never, unless you go looking.',
  },
  {
    id: 'waits',
    question: 'The caller waits',
    sync: 'Yes.',
    async: 'No.',
  },
  {
    id: 'fails-by',
    question: 'It fails by',
    sync: 'The callee being down, or slow.',
    async: 'The message being lost, delayed, or delivered twice.',
  },
  {
    id: 'needs',
    question: 'It needs',
    sync: 'A timeout and a retry policy.',
    async: 'Idempotency, and somewhere to put what failed.',
  },
]

/**
 * Making something idempotent is a schema decision, which is why it belongs in
 * this stage rather than in implementation.
 */
export const PROCESSED_EVENTS_LINES: SchemaLine[] = [
  { id: 'open', sql: 'CREATE TABLE processed_events (', indent: 0 },
  {
    id: 'provider',
    sql: 'provider   text NOT NULL,',
    indent: 1,
    note: 'Which sender this id came from. Two providers can issue the same event id without either being wrong, so the id alone is not unique and the pair is.',
  },
  {
    id: 'event-id',
    sql: 'event_id   text NOT NULL,',
    indent: 1,
    note: 'The id the sender gave the event. You store it rather than deriving one, because the sender is the only party who knows that two deliveries are the same delivery.',
  },
  {
    id: 'handled-at',
    sql: 'handled_at timestamptz NOT NULL DEFAULT now(),',
    indent: 1,
    note: 'Not load-bearing for correctness, and worth having anyway: when a duplicate storm happens you will want to know when you first saw the event.',
  },
  {
    id: 'pk',
    sql: 'PRIMARY KEY (provider, event_id)',
    indent: 1,
    note: 'The line doing all the work. Insert this row first and do the work second, both in one transaction: the second delivery fails the primary key, the transaction rolls back, and nothing happens twice. Order matters as soon as “the work” reaches outside the database, which is the case being taught here.',
  },
  { id: 'close', sql: ');', indent: 0 },
]
