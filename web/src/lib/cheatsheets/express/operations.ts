import type { Section, SheetActivity } from '../types'
export const operations: { sections: Section[]; activities: SheetActivity[] } =
  {
    sections: [
      {
        title: 'Operate and explain',
        study: {
          id: 'operate-and-explain',
          label: 'Operate and explain',
          hint: 'Trace the example, then defend the boundary',
        },
        introduction: [
          {
            id: 'operate-and-explain-intro',
            kind: 'paragraph',
            text: 'Choose a topic to inspect its worked example and interview answer. Try the local exercise before revealing its reasoning. Examples use Node 22 JavaScript (.mjs unless explicitly stated) and Express 5.3.0. HTTP factories do not listen until the test or startup owner calls listen.',
          },
        ],
        rows: [
          {
            term: 'Give lifecycle one owner',
            what: 'Validate configuration and initialize dependencies before readiness. On SIGTERM stop admitting new work, drain current requests, close dependencies and enforce a final deadline. Liveness and readiness answer different questions.',
            study: {
              id: 'startup-and-shutdown',
              summary:
                'Validate configuration and initialize dependencies before readiness. On SIGTERM stop admitting new work, drain current requests, close dependencies and enforce a final deadline. Liveness and readiness answer different questions.',
              activityIds: ['startup-and-shutdown-practice'],
            },
            teaching: [
              {
                id: 'startup-and-shutdown-model',
                kind: 'paragraph',
                text: 'Validate configuration and initialize dependencies before readiness. On SIGTERM stop admitting new work, drain current requests, close dependencies and enforce a final deadline. Liveness and readiness answer different questions.',
              },
              {
                id: 'startup-and-shutdown-example',
                kind: 'code',
                label:
                  'Give lifecycle one owner — standalone .mjs / exported factory',
                code: "import { createServer } from 'node:http';\nexport function makeLifecycle(closeDependencies = async () => {}, budget = 1000) {\n let ready = false, stopping;\n const server = createServer((req, res) => {\n  res.statusCode = ready ? 200 : 503; res.end(ready ? 'ready' : 'draining');\n });\n async function start(port = 0) {\n  try {\n   await new Promise((resolve, reject) => { server.once('error', reject); server.listen(port, '127.0.0.1', resolve); });\n   ready = true;\n  } catch (error) { await closeDependencies(); throw error; }\n }\n function stop() {\n  if (stopping) return stopping;\n  ready = false;\n  stopping = (async () => {\n   let deadline;\n   try {\n    await Promise.race([\n     (async () => { await new Promise((resolve, reject) => server.close(error => error ? reject(error) : resolve())); await closeDependencies(); })(),\n     new Promise((resolve, reject) => { deadline = setTimeout(() => { server.closeAllConnections(); reject(new Error('shutdown deadline')); }, budget); })\n    ]);\n   } finally { clearTimeout(deadline); }\n  })();\n  return stopping;\n }\n function installSignals() {\n  const terminate = () => { stop().then(() => process.exit(0), () => process.exit(1)); };\n  process.once('SIGTERM', terminate);\n  return () => process.off('SIGTERM', terminate);\n }\n return { server, start, stop, installSignals, isReady: () => ready };\n}\n// Startup owner: initialize dependencies, await start(), then installSignals().\n// Final process exit bounds handles the application does not own explicitly.\n// Upgraded sockets need separate tracking; closeAllConnections covers HTTP.",
              },
              {
                id: 'startup-and-shutdown-trace',
                kind: 'table',
                label: 'Give lifecycle one owner result',
                columns: ['Observation', 'Reasoning'],
                rows: [
                  [
                    'start marks readiness only after listening. stop clears readiness immediately and returns the same promise on repeat calls. Draining plus dependency cleanup has one total budget; timeout rejects and the signal owner exits unsuccessfully. HTTP and upgraded connections have different cleanup needs.',
                    'Validate configuration and initialize dependencies before readiness. On SIGTERM stop admitting new work, drain current requests, close dependencies and enforce a final deadline. Liveness and readiness answer different questions.',
                  ],
                ],
              },
              {
                id: 'startup-and-shutdown-mistake',
                kind: 'paragraph',
                text: 'Common mistake: A real process also owns dependency handles and upgraded connections. Bound their cleanup and exit on a final process deadline. Do not continue normal service after a fatal uncaught exception.',
              },
              {
                id: 'startup-and-shutdown-interview',
                kind: 'interview',
                question: 'When should readiness turn false?',
                answer:
                  'Before draining, so routing stops admitting new work. A process can still be alive while not ready to accept traffic.',
                followUp: 'What if the listener fails with EADDRINUSE?',
              },
            ],
          },
          {
            term: 'Budget capacity across processes',
            what: 'Processes isolate JavaScript heaps. Workers can parallelize CPU work; more processes also multiply connection pools and local caches. Shared durable state belongs outside a single process.',
            study: {
              id: 'scale-and-dependencies',
              summary:
                'Processes isolate JavaScript heaps. Workers can parallelize CPU work; more processes also multiply connection pools and local caches. Shared durable state belongs outside a single process.',
              activityIds: ['scale-and-dependencies-practice'],
            },
            teaching: [
              {
                id: 'scale-and-dependencies-model',
                kind: 'paragraph',
                text: 'Processes isolate JavaScript heaps. Workers can parallelize CPU work; more processes also multiply connection pools and local caches. Shared durable state belongs outside a single process.',
              },
              {
                id: 'scale-and-dependencies-example',
                kind: 'code',
                label:
                  'Budget capacity across processes — standalone .mjs / exported factory',
                code: 'const processes = 4; const poolPerProcess = 5;\nconsole.log(processes * poolPerProcess);',
              },
              {
                id: 'scale-and-dependencies-trace',
                kind: 'table',
                label: 'Budget capacity across processes result',
                columns: ['Observation', 'Reasoning'],
                rows: [
                  [
                    '20 potential connections: a per-process pool limit is multiplied by the process count.',
                    'Processes isolate JavaScript heaps. Workers can parallelize CPU work; more processes also multiply connection pools and local caches. Shared durable state belongs outside a single process.',
                  ],
                ],
              },
              {
                id: 'scale-and-dependencies-mistake',
                kind: 'paragraph',
                text: 'Common mistake: Scaling replicas without a dependency budget can overload the database. Retries multiply load too; use bounded attempts, backoff/jitter and an explicit retryable-error policy.',
              },
              {
                id: 'scale-and-dependencies-interview',
                kind: 'interview',
                question: 'Will more workers fix a slow database?',
                answer:
                  'Not necessarily. They may increase pressure on the bottleneck. Measure saturation, limit concurrency and tune the whole dependency budget.',
                followUp:
                  'Four replicas each retry three times. Why can an outage worsen?',
              },
            ],
          },
          {
            term: 'Bound memory and work explicitly',
            what: 'Payload size, concurrent work and request rate are different limits. A process-local counter demonstrates admission control but cannot enforce a global distributed quota.',
            study: {
              id: 'resource-limits',
              summary:
                'Payload size, concurrent work and request rate are different limits. A process-local counter demonstrates admission control but cannot enforce a global distributed quota.',
              activityIds: ['resource-limits-practice'],
            },
            teaching: [
              {
                id: 'resource-limits-model',
                kind: 'paragraph',
                text: 'Payload size, concurrent work and request rate are different limits. A process-local counter demonstrates admission control but cannot enforce a global distributed quota.',
              },
              {
                id: 'resource-limits-example',
                kind: 'code',
                label:
                  'Bound memory and work explicitly — standalone .mjs / exported factory',
                code: "export function gate(limit) { let active = 0;\n return async function run(work) {\n if (active >= limit) throw new Error('busy');\n active++; try { return await work(); } finally { active--; }\n };\n}\nconst run = gate(1); console.log(await run(async () => 'done'));",
              },
              {
                id: 'resource-limits-trace',
                kind: 'table',
                label: 'Bound memory and work explicitly result',
                columns: ['Observation', 'Reasoning'],
                rows: [
                  [
                    'done: the slot is released on success or rejection. A second overlapping operation is rejected while one is active.',
                    'Payload size, concurrent work and request rate are different limits. A process-local counter demonstrates admission control but cannot enforce a global distributed quota.',
                  ],
                ],
              },
              {
                id: 'resource-limits-mistake',
                kind: 'paragraph',
                text: 'Common mistake: A concurrency gate is not requests-per-minute rate limiting. Local counters reset on restart and diverge across replicas; queues need bounded capacity too.',
              },
              {
                id: 'resource-limits-interview',
                kind: 'interview',
                question: 'Why release in finally?',
                answer:
                  'Both rejected and successful work must release their slot, or capacity leaks until all future requests are rejected.',
                followUp:
                  'A job never resolves. Does finally guarantee a bounded lifetime?',
              },
            ],
          },
          {
            term: 'Explain, repair and defend a reading-list API',
            what: 'Review the API as a chain: trusted identity, bounded parsing, shape validation, ownership, awaited service, one response and a safe error boundary. Keep each boundary visible when constraints change.',
            study: {
              id: 'interview-capstone',
              summary:
                'Review the API as a chain: trusted identity, bounded parsing, shape validation, ownership, awaited service, one response and a safe error boundary. Keep each boundary visible when constraints change.',
              activityIds: ['interview-capstone-practice'],
            },
            teaching: [
              {
                id: 'interview-capstone-model',
                kind: 'paragraph',
                text: 'Review the API as a chain: trusted identity, bounded parsing, shape validation, ownership, awaited service, one response and a safe error boundary. Keep each boundary visible when constraints change.',
              },
              {
                id: 'interview-capstone-example',
                kind: 'code',
                label:
                  'Explain, repair and defend a reading-list API — standalone .mjs / exported factory',
                code: "// Deliberately broken interface sketch; do not run as an API.\n// app.post('/books', async (req, res) => {\n//   const ownerId = req.get('X-User-ID');\n//   repository.save({ ...req.body, ownerId });\n//   res.status(201);\n// });",
              },
            ],
          },
        ],
      },
    ],
    activities: [
      {
        id: 'startup-and-shutdown-practice',
        title: 'Give lifecycle one owner practice',
        prompt: 'What if the listener fails with EADDRINUSE?',
        context:
          'Original reading-list API exercise. State the assumption and explain the failure boundary before revealing the answer.',
        answer:
          'Treat startup as failed, close initialized dependencies and exit unsuccessfully. Never report readiness after listen failure.',
        explanation:
          'Treat startup as failed, close initialized dependencies and exit unsuccessfully. Never report readiness after listen failure. A real process also owns dependency handles and upgraded connections. Bound their cleanup and exit on a final process deadline. Do not continue normal service after a fatal uncaught exception.',
        followUp: 'Which test would fail if this boundary were removed?',
      },
      {
        id: 'scale-and-dependencies-practice',
        title: 'Budget capacity across processes practice',
        prompt:
          'Four replicas each retry three times. Why can an outage worsen?',
        context:
          'Original reading-list API exercise. State the assumption and explain the failure boundary before revealing the answer.',
        answer:
          'They amplify failing work and compete for exhausted capacity. Bound retries and use idempotent effects, backoff and admission control.',
        explanation:
          'They amplify failing work and compete for exhausted capacity. Bound retries and use idempotent effects, backoff and admission control. Scaling replicas without a dependency budget can overload the database. Retries multiply load too; use bounded attempts, backoff/jitter and an explicit retryable-error policy.',
        followUp: 'Which test would fail if this boundary were removed?',
      },
      {
        id: 'resource-limits-practice',
        title: 'Bound memory and work explicitly practice',
        prompt:
          'A job never resolves. Does finally guarantee a bounded lifetime?',
        context:
          'Original reading-list API exercise. State the assumption and explain the failure boundary before revealing the answer.',
        answer:
          'No. The operation needs its own cancellation/deadline contract. finally runs only when control leaves the try block.',
        explanation:
          'No. The operation needs its own cancellation/deadline contract. finally runs only when control leaves the try block. A concurrency gate is not requests-per-minute rate limiting. Local counters reset on restart and diverge across replicas; queues need bounded capacity too.',
        followUp: 'Which test would fail if this boundary were removed?',
      },
      {
        id: 'interview-capstone-practice',
        title: 'Explain, repair and defend a reading-list API practice',
        prompt:
          'Repair the sketch, name tests, then change the constraint to retries after a timeout.',
        context:
          'Original reading-list API exercise. State the assumption and explain the failure boundary before revealing the answer.',
        solution: {
          label:
            'Reference repair — .mjs factory with trusted injected test identity',
          code: "import express from 'express';\nexport function makeApp(principal, repository) {\n const app = express(); app.use(express.json({ limit: '1kb' }));\n app.use((err, req, res, next) => { if (res.headersSent) return next(err); return res.status(err.type === 'entity.too.large' ? 413 : 400).json({error:'invalid body'}); });\n app.post('/books', async (req, res) => {\n  if (!principal) return res.set('WWW-Authenticate', 'Bearer').status(401).end();\n  const b = req.body;\n  if (!b || Array.isArray(b) || typeof b.title !== 'string' || !b.title.trim() || b.title.length > 100 || Object.keys(b).some(k => k !== 'title')) return res.status(400).end();\n  const book = await repository.save({ title: b.title.trim(), ownerId: principal.id });\n  return res.status(201).json(book);\n });\n app.use((err, req, res, next) => { if (res.headersSent) return next(err); return res.status(500).json({error:'internal'}); });\n return app;\n}",
        },
        answer:
          'Use trusted verifier middleware and JSON size limits before the route; derive ownerId from verified identity, select title only, await save, and return status(201).json(book). Test missing identity, malformed/oversized input, wrong types, denied access, rejected save and success. For retries define durable idempotency keys tied to principal/input and atomic result storage; a Map is insufficient.',
        explanation:
          'Use trusted verifier middleware and JSON size limits before the route; derive ownerId from verified identity, select title only, await save, and return status(201).json(book). Test missing identity, malformed/oversized input, wrong types, denied access, rejected save and success. For retries define durable idempotency keys tied to principal/input and atomic result storage; a Map is insufficient. Fixing only the missing send still leaves authorization and persistence failures. Review the entire request lifecycle, not the first visible symptom.',
        followUp: 'Which test would fail if this boundary were removed?',
      },
    ],
  }
