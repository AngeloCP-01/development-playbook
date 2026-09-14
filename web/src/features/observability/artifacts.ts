// web/src/features/observability/artifacts.ts
import type { Artifact } from '@/components/artifact'

/**
 * Source: `docs/15-observability.md`. Five fences quoted verbatim, one pivot
 * each, annotations only on lines that carry a decision. `artifacts.test.ts`
 * holds every `text` against `fences()` line for line.
 */

export const SCRUBBER: Artifact = {
  id: 'sentry-before-send',
  filename: 'sentry.server.config.ts',
  language: 'ts',
  lines: [
    {
      text: "// sentry.server.config.ts — edit the wizard's Sentry.init, do not add another",
      note: 'The stage 04 wizard already created this file and called `Sentry.init` in it. `Sentry.init` must not run twice, so `beforeSend` is added by editing, not by a new file — and the same edit goes in `instrumentation-client.ts` and `sentry.edge.config.ts`.',
    },
    {
      text: "import { redact } from './lib/redact'",
      note: 'One deny-list, shared with the logger, so a pattern added once covers both destinations.',
    },
    { text: '' },
    { text: 'Sentry.init({' },
    { text: '  dsn: process.env.SENTRY_DSN,' },
    { text: '  beforeSend(event) {' },
    {
      text: '    // Sentry captures request headers by default, and that is where',
    },
    { text: '    // credentials live.' },
    {
      text: "    for (const header of ['authorization', 'cookie', 'x-api-key']) {",
      note: 'Surface one: headers. Sentry captures them by default; credentials live here.',
    },
    { text: '      delete event.request?.headers?.[header]' },
    { text: '    }' },
    { text: '' },
    {
      text: '    // It captures bodies too. A form post carries whatever the form carried.',
    },
    {
      text: '    if (event.request) delete event.request.data',
      note: 'Surface two: the request body. A form post carries whatever the form carried, so the whole body goes.',
    },
    { text: '' },
    {
      text: '    // And an exception message is free text: a failed query prints the',
    },
    { text: '    // connection string, password included.' },
    { text: '    for (const value of event.exception?.values ?? []) {' },
    {
      text: '      if (value.value) value.value = redact(value.value)',
      note: 'Surface three: exception text. A failed query prints its connection string, password included; `redact` runs the three patterns over it. These three surfaces are all `beforeSend` sees — nothing here touches context, breadcrumbs or tags.',
      pivot: true,
    },
    { text: '    }' },
    { text: '' },
    { text: '    return event' },
    { text: '  },' },
    { text: '})' },
  ],
}

export const LOGGER: Artifact = {
  id: 'pino-logger',
  filename: 'src/lib/logger.ts',
  language: 'ts',
  lines: [
    { text: '// src/lib/logger.ts' },
    { text: "import { AsyncLocalStorage } from 'node:async_hooks'" },
    { text: "import pino from 'pino'" },
    {
      text: "import { redact } from './redact'",
      note: 'The same deny-list `beforeSend` uses. `beforeSend` protects error reports and does nothing to log output, so the logger needs its own call.',
    },
    { text: '' },
    {
      text: 'export const requestContext = new AsyncLocalStorage<{ requestId: string }>()',
    },
    { text: '' },
    { text: 'export const logger = pino({' },
    { text: "  level: process.env.LOG_LEVEL ?? 'info'," },
    { text: '  base: {' },
    { text: "    service: process.env.SERVICE_NAME ?? 'web'," },
    { text: '    env: process.env.NODE_ENV,' },
    { text: '  },' },
    {
      text: '  mixin: () => ({ requestId: requestContext.getStore()?.requestId }),',
      note: 'Runs on every log call, so the request id attaches itself and no call site has to remember it. Open the store once per request, in middleware.',
    },
    {
      text: '  redact: {',
      note: 'Pino redaction paths are case-sensitive and match specific object shapes. `*.token` covers one level of nesting, not arbitrary depth. They do not scrub free-text messages or stack traces — the serializer below does that.',
    },
    { text: '    paths: [' },
    { text: "      'req.headers.authorization', 'req.headers.cookie'," },
    { text: '      \'req.headers["x-api-key"]\',' },
    { text: "      'password', 'token', '*.password', '*.token'," },
    { text: '    ],' },
    { text: "    censor: '[redacted]'," },
    { text: '  },' },
    { text: '  serializers: {' },
    {
      text: '    error: (err: Error) => ({',
      note: 'An `Error` has no enumerable own properties, so `JSON.stringify` on one gives `{}`. Pino serializes a field only if a serializer is registered for its exact key — this one is `error`, because that is what the health check logs. A stock serializer would keep the message verbatim, connection string and all; this one redacts it.',
      pivot: true,
    },
    { text: '      type: err.name,' },
    { text: '      message: redact(err.message),' },
    { text: '      stack: err.stack ? redact(err.stack) : undefined,' },
    { text: '    }),' },
    { text: '  },' },
    { text: '})' },
  ],
}

export const HEALTH: Artifact = {
  id: 'health-route',
  filename: 'src/app/api/health/route.ts',
  language: 'ts',
  lines: [
    { text: '// src/app/api/health/route.ts' },
    {
      text: "import { logger } from '@/lib/logger'",
      note: 'The logger defined in the previous step. Shown so this is not mistaken for a standalone module.',
    },
    { text: "import { db } from '@/lib/db'" },
    { text: "import { sql } from 'drizzle-orm'" },
    { text: '' },
    { text: 'export async function GET() {' },
    { text: '  const checks = { database: false }' },
    { text: '  let timer: ReturnType<typeof setTimeout>' },
    { text: '' },
    { text: '  try {' },
    {
      text: '    await Promise.race([',
      note: 'The realistic failure is not refused, it is hung — an exhausted pool, a network partition. Without the race the health check hangs with it and never returns the `degraded` state it exists to report.',
      pivot: true,
    },
    { text: '      db.execute(sql`SELECT 1`),' },
    { text: '      new Promise((_, reject) => {' },
    {
      text: "        timer = setTimeout(() => reject(new Error('timeout')), 2000)",
    },
    { text: '      }),' },
    { text: '    ])' },
    { text: '    checks.database = true' },
    { text: '  } catch (error) {' },
    {
      text: '    // Not a fault, so not `error` — but the reason is the only evidence of',
    },
    { text: '    // how, and a bare `catch {}` destroys it.' },
    {
      text: "    logger.warn({ event: 'health.dependency_unreachable', error })",
      note: '`warn`, not `error`: a dependency being unreachable is not a fault in this code. But the reason is the only evidence of how, and a bare `catch {}` would destroy it.',
    },
    { text: '  } finally {' },
    {
      text: '    // The realistic failure is a hang, not a rejection — a pending timer on',
    },
    {
      text: '    // an invocation that already succeeded is exactly that shape.',
    },
    {
      text: '    clearTimeout(timer!)',
      note: 'Resource cleanup, not a success signal. This `finally` is fine; the heartbeat two steps later must not be in one, because there a `finally` reports success for a run that threw.',
    },
    { text: '  }' },
    { text: '' },
    { text: '  const healthy = Object.values(checks).every(Boolean)' },
    { text: '  return Response.json(' },
    { text: "    { status: healthy ? 'ok' : 'degraded', checks }," },
    {
      text: '    { status: healthy ? 200 : 503 },',
      note: 'The status code is what a platform reads. This is the readiness endpoint: point routing at it, never a restart trigger.',
    },
    { text: '  )' },
    { text: '}' },
  ],
}

export const CANARY: Artifact = {
  id: 'canary-route',
  filename: 'src/app/api/canary/route.ts',
  language: 'ts',
  lines: [
    {
      text: '// src/app/api/canary/route.ts — reads the real path, writes nothing',
    },
    { text: "import { db } from '@/lib/db'" },
    { text: '' },
    { text: 'export async function GET(request: Request) {' },
    {
      text: "  if (request.headers.get('x-monitor-token') !== process.env.MONITOR_TOKEN) {",
      note: 'One route, authenticated with a token issued to the monitor and nothing else.',
    },
    {
      text: "    return new Response('not found', { status: 404 })",
      note: "`404` rather than `401` for a bad token keeps the endpoint out of anyone's crawl results.",
    },
    { text: '  }' },
    { text: '' },
    {
      text: '  const latest = await db.query.orders.findFirst({',
      note: 'Read the last order back instead of creating one. A monitor that places an order every minute charges cards, fills tables, and pages you when your test data is wrong.',
    },
    { text: '    orderBy: (orders, { desc }) => [desc(orders.createdAt)],' },
    { text: '  })' },
    { text: '' },
    {
      text: '  // A service taking orders continuously should always have one: no row at',
    },
    {
      text: '  // all is the read path (or the write path behind it) failing silently, not',
    },
    {
      text: '  // a legitimately empty table. A status-only monitor only sees this if the',
    },
    {
      text: '  // assertion failing changes the HTTP status, not just the JSON body.',
    },
    { text: '  if (latest === undefined) {' },
    {
      text: '    return Response.json({ ok: false }, { status: 503 })',
      note: 'The assertion failing changes the HTTP status, not just the body. A status-only monitor cannot see `{"ok":false}` inside a `200`. A brand-new deployment with no orders yet is the one case this mistakenly fails — seed one known row rather than special-casing "no orders" as healthy.',
      pivot: true,
    },
    { text: '  }' },
    { text: '' },
    { text: '  return Response.json({ ok: true })' },
    { text: '}' },
  ],
}

export const HEARTBEAT: Artifact = {
  id: 'job-heartbeat',
  filename: 'the scheduled job',
  language: 'ts',
  lines: [
    {
      text: '// At the start and end of the job — after the work, on the success path only.',
      note: 'On the success path only. Not in a `finally`: a ping in a `finally` block reports success for a run that threw, which converts your only detector of silence into a source of false confidence.',
    },
    { text: 'const start = Date.now()' },
    { text: "// ...the job's work happens here..." },
    {
      text: 'await fetch(process.env.HEARTBEAT_URL!, {',
      note: 'The monitor pages you when this call does not arrive inside the window you set. Better Stack, Healthchecks.io and Cronitor all offer it; on AWS it is a CloudWatch alarm with `TreatMissingData` set to `breaching` explicitly.',
      pivot: true,
    },
    { text: "  method: 'POST'," },
    {
      text: '  body: JSON.stringify({ durationMs: Date.now() - start }),',
      note: 'Duration rides along with the ping, so a job that is slower every night is a threshold you can set rather than a trend you notice too late.',
    },
    { text: '})' },
  ],
}
