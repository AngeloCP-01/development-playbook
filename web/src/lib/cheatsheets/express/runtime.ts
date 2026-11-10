import type { Section, SheetActivity } from '../types'
export const runtime: { sections: Section[]; activities: SheetActivity[] } = {
  sections: [
    {
      title: 'Runtime and concurrency',
      study: {
        id: 'runtime-and-concurrency',
        label: 'Runtime and concurrency',
        hint: 'Trace the example, then defend the boundary',
      },
      introduction: [
        {
          id: 'runtime-and-concurrency-intro',
          kind: 'paragraph',
          text: 'Choose a topic to inspect its worked example and interview answer. Try the local exercise before revealing its reasoning. Examples use Node 22 JavaScript (.mjs unless explicitly stated) and Express 5.3.0. HTTP factories do not listen until the test or startup owner calls listen.',
        },
      ],
      rows: [
        {
          term: 'Separate language, host and framework',
          what: 'JavaScript defines language behavior. Node supplies files, sockets and process APIs; Express adds routing over Node HTTP. A browser supplies a different host, including the DOM.',
          study: {
            id: 'node-runtime',
            summary:
              'JavaScript defines language behavior. Node supplies files, sockets and process APIs; Express adds routing over Node HTTP. A browser supplies a different host, including the DOM.',
            activityIds: ['node-runtime-practice'],
          },
          teaching: [
            {
              id: 'node-runtime-model',
              kind: 'paragraph',
              text: 'JavaScript defines language behavior. Node supplies files, sockets and process APIs; Express adds routing over Node HTTP. A browser supplies a different host, including the DOM.',
            },
            {
              id: 'node-runtime-example',
              kind: 'code',
              label:
                'Separate language, host and framework — standalone .mjs / exported factory',
              code: 'console.log(typeof process, typeof document)',
            },
            {
              id: 'node-runtime-trace',
              kind: 'table',
              label: 'Separate language, host and framework result',
              columns: ['Observation', 'Reasoning'],
              rows: [
                [
                  'object undefined: a server process has no browser document.',
                  'JavaScript defines language behavior. Node supplies files, sockets and process APIs; Express adds routing over Node HTTP. A browser supplies a different host, including the DOM.',
                ],
              ],
            },
            {
              id: 'node-runtime-mistake',
              kind: 'paragraph',
              text: 'Common mistake: Importing Express does not create a listening socket. Create an app, register routes, then explicitly listen.',
            },
            {
              id: 'node-runtime-interview',
              kind: 'interview',
              question: 'Is Node a language?',
              answer:
                'No. V8 executes JavaScript; Node supplies host APIs and a process lifecycle. Express is an optional library.',
              followUp:
                'Would moving this file to a browser preserve its file access?',
            },
          ],
        },
        {
          term: 'Find what blocks other requests',
          what: 'A callback runs JavaScript to completion on its event-loop thread. Network readiness usually uses OS polling; file and some crypto work uses the libuv pool. Worker threads run JavaScript on separate threads.',
          study: {
            id: 'loop-and-pool',
            summary:
              'A callback runs JavaScript to completion on its event-loop thread. Network readiness usually uses OS polling; file and some crypto work uses the libuv pool. Worker threads run JavaScript on separate threads.',
            activityIds: ['loop-and-pool-practice'],
          },
          teaching: [
            {
              id: 'loop-and-pool-model',
              kind: 'paragraph',
              text: 'A callback runs JavaScript to completion on its event-loop thread. Network readiness usually uses OS polling; file and some crypto work uses the libuv pool. Worker threads run JavaScript on separate threads.',
            },
            {
              id: 'loop-and-pool-example',
              kind: 'code',
              label:
                'Find what blocks other requests — standalone .mjs / exported factory',
              code: 'async function sum() { let n = 0; for (let i = 0; i < 1000; i++) n += i; return n; }\nconsole.log(await sum())',
            },
            {
              id: 'loop-and-pool-trace',
              kind: 'table',
              label: 'Find what blocks other requests result',
              columns: ['Observation', 'Reasoning'],
              rows: [
                [
                  '499500: async wraps the result in a promise but the loop still executes synchronously.',
                  'A callback runs JavaScript to completion on its event-loop thread. Network readiness usually uses OS polling; file and some crypto work uses the libuv pool. Worker threads run JavaScript on separate threads.',
                ],
              ],
            },
            {
              id: 'loop-and-pool-mistake',
              kind: 'paragraph',
              text: 'Common mistake: Adding async to CPU work does not offload it. Bound the work, split it carefully, or use a worker pool for CPU-heavy tasks.',
            },
            {
              id: 'loop-and-pool-interview',
              kind: 'interview',
              question: 'Why can an async route freeze other clients?',
              answer:
                'Its synchronous segment monopolizes the event loop. Await only yields when execution suspends; it does not move prior work to another thread.',
              followUp:
                'A route calls a costly synchronous hash before await. Where do you intervene?',
            },
          ],
        },
        {
          term: 'Overlap independent work deliberately',
          what: 'Concurrency keeps several operations in flight. Parallelism executes work simultaneously. Start independent I/O together, but wait for a prerequisite before consuming its result.',
          study: {
            id: 'parallel-work',
            summary:
              'Concurrency keeps several operations in flight. Parallelism executes work simultaneously. Start independent I/O together, but wait for a prerequisite before consuming its result.',
            activityIds: ['parallel-work-practice'],
          },
          teaching: [
            {
              id: 'parallel-work-model',
              kind: 'paragraph',
              text: 'Concurrency keeps several operations in flight. Parallelism executes work simultaneously. Start independent I/O together, but wait for a prerequisite before consuming its result.',
            },
            {
              id: 'parallel-work-example',
              kind: 'code',
              label:
                'Overlap independent work deliberately — standalone .mjs / exported factory',
              code: "const trace = [];\nasync function read(id) { trace.push(id); return id; }\nconsole.log(await Promise.all([read('book'), read('owner')]));\nconsole.log(trace)",
            },
            {
              id: 'parallel-work-trace',
              kind: 'table',
              label: 'Overlap independent work deliberately result',
              columns: ['Observation', 'Reasoning'],
              rows: [
                [
                  'Both calls start before Promise.all receives their promises; results preserve input order.',
                  'Concurrency keeps several operations in flight. Parallelism executes work simultaneously. Start independent I/O together, but wait for a prerequisite before consuming its result.',
                ],
              ],
            },
            {
              id: 'parallel-work-mistake',
              kind: 'paragraph',
              text: 'Common mistake: Promise.all neither starts work by itself nor cancels surviving operations when one fails. Limit fan-out for a large list.',
            },
            {
              id: 'parallel-work-interview',
              kind: 'interview',
              question: 'When is sequential await required?',
              answer:
                'When the second operation needs the first result or ordering is part of correctness. Independent I/O can overlap, subject to capacity limits.',
              followUp:
                'How would you fetch 10,000 records without 10,000 concurrent requests?',
            },
          ],
        },
      ],
    },
  ],
  activities: [
    {
      id: 'node-runtime-practice',
      title: 'Separate language, host and framework practice',
      prompt: 'Would moving this file to a browser preserve its file access?',
      context:
        'Original reading-list API exercise. State the assumption and explain the failure boundary before revealing the answer.',
      answer:
        'No. Host capabilities change; use a server endpoint or a browser-supported file API.',
      explanation:
        'No. Host capabilities change; use a server endpoint or a browser-supported file API. Importing Express does not create a listening socket. Create an app, register routes, then explicitly listen.',
      followUp: 'Which test would fail if this boundary were removed?',
    },
    {
      id: 'loop-and-pool-practice',
      title: 'Find what blocks other requests practice',
      prompt:
        'A route calls a costly synchronous hash before await. Where do you intervene?',
      context:
        'Original reading-list API exercise. State the assumption and explain the failure boundary before revealing the answer.',
      answer:
        'Use an appropriate asynchronous password-hashing API and bound concurrent jobs; for custom CPU work consider a bounded Worker pool.',
      explanation:
        'Use an appropriate asynchronous password-hashing API and bound concurrent jobs; for custom CPU work consider a bounded Worker pool. Adding async to CPU work does not offload it. Bound the work, split it carefully, or use a worker pool for CPU-heavy tasks.',
      followUp: 'Which test would fail if this boundary were removed?',
    },
    {
      id: 'parallel-work-practice',
      title: 'Overlap independent work deliberately practice',
      prompt:
        'How would you fetch 10,000 records without 10,000 concurrent requests?',
      context:
        'Original reading-list API exercise. State the assumption and explain the failure boundary before revealing the answer.',
      answer:
        'Use a fixed worker count or bounded batches; choose the limit against downstream capacity and cancellation requirements.',
      explanation:
        'Use a fixed worker count or bounded batches; choose the limit against downstream capacity and cancellation requirements. Promise.all neither starts work by itself nor cancels surviving operations when one fails. Limit fan-out for a large list.',
      followUp: 'Which test would fail if this boundary were removed?',
    },
  ],
}
