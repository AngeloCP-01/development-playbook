import type { Section, SheetActivity } from '../types'
export const async: { sections: Section[]; activities: SheetActivity[] } = {
  sections: [
    {
      title: 'Async and events',
      study: {
        id: 'async-and-events',
        label: 'Async and events',
        hint: 'Trace the example, then defend the boundary',
      },
      introduction: [
        {
          id: 'async-and-events-intro',
          kind: 'paragraph',
          text: 'Choose a topic to inspect its worked example and interview answer. Try the local exercise before revealing its reasoning. Examples use Node 22 JavaScript (.mjs unless explicitly stated) and Express 5.3.0. HTTP factories do not listen until the test or startup owner calls listen.',
        },
      ],
      rows: [
        {
          term: 'Predict only guaranteed ordering',
          what: 'At a CommonJS entry point, nextTick drains before promise microtasks. ESM evaluation already runs as a microtask, changing this relationship. Timer delays are thresholds, not appointments.',
          study: {
            id: 'scheduling',
            summary:
              'At a CommonJS entry point, nextTick drains before promise microtasks. ESM evaluation already runs as a microtask, changing this relationship. Timer delays are thresholds, not appointments.',
            activityIds: ['scheduling-practice'],
          },
          teaching: [
            {
              id: 'scheduling-model',
              kind: 'paragraph',
              text: 'At a CommonJS entry point, nextTick drains before promise microtasks. ESM evaluation already runs as a microtask, changing this relationship. Timer delays are thresholds, not appointments.',
            },
            {
              id: 'scheduling-example',
              kind: 'code',
              label:
                'Predict only guaranteed ordering — CJS or ESM entry point',
              code: "console.log('sync');\nprocess.nextTick(() => console.log('tick'));\nPromise.resolve().then(() => console.log('promise'));\nconsole.log('end');",
            },
            {
              id: 'scheduling-trace',
              kind: 'table',
              label: 'Predict only guaranteed ordering result',
              columns: ['Observation', 'Reasoning'],
              rows: [
                [
                  'CJS: sync, end, tick, promise. ESM: sync, end, promise, tick. Neither establishes timeout versus immediate ordering.',
                  'At a CommonJS entry point, nextTick drains before promise microtasks. ESM evaluation already runs as a microtask, changing this relationship. Timer delays are thresholds, not appointments.',
                ],
              ],
            },
            {
              id: 'scheduling-mistake',
              kind: 'paragraph',
              text: 'Common mistake: A trace observed once is not a universal ordering proof. Recursive nextTick can starve I/O.',
            },
            {
              id: 'scheduling-interview',
              kind: 'interview',
              question: 'Why do module contexts change this example?',
              answer:
                'ESM evaluation runs within the microtask machinery; CJS entry evaluation reaches the nextTick drain first. State the entry context before predicting output.',
              followUp:
                'Add queueMicrotask after the promise. What relationship can you defend?',
            },
          ],
        },
        {
          term: 'Return the work whose failure matters',
          what: 'A caller can await and catch only the promise it receives. A detached promise needs its own failure owner. Use finally to release acquired resources on either outcome.',
          study: {
            id: 'promise-control',
            summary:
              'A caller can await and catch only the promise it receives. A detached promise needs its own failure owner. Use finally to release acquired resources on either outcome.',
            activityIds: ['promise-control-practice'],
          },
          teaching: [
            {
              id: 'promise-control-model',
              kind: 'paragraph',
              text: 'A caller can await and catch only the promise it receives. A detached promise needs its own failure owner. Use finally to release acquired resources on either outcome.',
            },
            {
              id: 'promise-control-example',
              kind: 'code',
              label:
                'Return the work whose failure matters — standalone .mjs / exported factory',
              code: "const trace = [];\nasync function work() { try { return await Promise.reject(new Error('offline')); } finally { trace.push('released'); } }\ntry { await work(); } catch (e) { console.log(e.message, trace[0]); }",
            },
            {
              id: 'promise-control-trace',
              kind: 'table',
              label: 'Return the work whose failure matters result',
              columns: ['Observation', 'Reasoning'],
              rows: [
                [
                  'offline released: finally runs before the rejection reaches the caller.',
                  'A caller can await and catch only the promise it receives. A detached promise needs its own failure owner. Use finally to release acquired resources on either outcome.',
                ],
              ],
            },
            {
              id: 'promise-control-mistake',
              kind: 'paragraph',
              text: 'Common mistake: Dropping a promise disconnects its failure from the surrounding try/catch. Return or await it; do not hide failure with an empty catch.',
            },
            {
              id: 'promise-control-interview',
              kind: 'interview',
              question: 'Does Promise.all cancel on rejection?',
              answer:
                'No. It rejects its aggregate result; already-started work continues unless the operation supports explicit cancellation.',
              followUp:
                'One of three writes fails. Is Promise.all a transaction?',
            },
          ],
        },
        {
          term: 'Own listener lifetime',
          what: 'EventEmitter calls listeners synchronously in registration order. An unhandled error event can terminate the process. Remove listeners when their owner ends.',
          study: {
            id: 'events-and-cleanup',
            summary:
              'EventEmitter calls listeners synchronously in registration order. An unhandled error event can terminate the process. Remove listeners when their owner ends.',
            activityIds: ['events-and-cleanup-practice'],
          },
          teaching: [
            {
              id: 'events-and-cleanup-model',
              kind: 'paragraph',
              text: 'EventEmitter calls listeners synchronously in registration order. An unhandled error event can terminate the process. Remove listeners when their owner ends.',
            },
            {
              id: 'events-and-cleanup-example',
              kind: 'code',
              label:
                'Own listener lifetime — standalone .mjs / exported factory',
              code: "import { EventEmitter } from 'node:events';\nconst bus = new EventEmitter();\nconst seen = [];\nbus.once('book', id => seen.push(id));\nbus.emit('book', 1); bus.emit('book', 2);\nconsole.log(seen, bus.listenerCount('book'));",
            },
            {
              id: 'events-and-cleanup-trace',
              kind: 'table',
              label: 'Own listener lifetime result',
              columns: ['Observation', 'Reasoning'],
              rows: [
                [
                  '[1] and 0: once removes the listener before a later emission.',
                  'EventEmitter calls listeners synchronously in registration order. An unhandled error event can terminate the process. Remove listeners when their owner ends.',
                ],
              ],
            },
            {
              id: 'events-and-cleanup-mistake',
              kind: 'paragraph',
              text: 'Common mistake: Registering a listener per request on a shared emitter without removing it retains closures and duplicates delivery.',
            },
            {
              id: 'events-and-cleanup-interview',
              kind: 'interview',
              question: 'Does an async listener make emit await it?',
              answer:
                'No. emit invokes listeners synchronously; returned promises do not make emit an asynchronous completion barrier. Own their rejection explicitly.',
              followUp:
                'How do you repair a subscription that outlives a disconnected client?',
            },
          ],
        },
      ],
    },
  ],
  activities: [
    {
      id: 'scheduling-practice',
      title: 'Predict only guaranteed ordering practice',
      prompt:
        'Add queueMicrotask after the promise. What relationship can you defend?',
      context:
        'Original reading-list API exercise. State the assumption and explain the failure boundary before revealing the answer.',
      answer:
        'The promise reaction and queueMicrotask preserve enqueue order within that queue. Do not extend that claim to arbitrary timers.',
      explanation:
        'The promise reaction and queueMicrotask preserve enqueue order within that queue. Do not extend that claim to arbitrary timers. A trace observed once is not a universal ordering proof. Recursive nextTick can starve I/O.',
      followUp: 'Which test would fail if this boundary were removed?',
    },
    {
      id: 'promise-control-practice',
      title: 'Return the work whose failure matters practice',
      prompt: 'One of three writes fails. Is Promise.all a transaction?',
      context:
        'Original reading-list API exercise. State the assumption and explain the failure boundary before revealing the answer.',
      answer:
        'No. Some writes may already have committed. Use a repository transaction where atomicity is required, or design explicit compensation.',
      explanation:
        'No. Some writes may already have committed. Use a repository transaction where atomicity is required, or design explicit compensation. Dropping a promise disconnects its failure from the surrounding try/catch. Return or await it; do not hide failure with an empty catch.',
      followUp: 'Which test would fail if this boundary were removed?',
    },
    {
      id: 'events-and-cleanup-practice',
      title: 'Own listener lifetime practice',
      prompt:
        'How do you repair a subscription that outlives a disconnected client?',
      context:
        'Original reading-list API exercise. State the assumption and explain the failure boundary before revealing the answer.',
      answer:
        'Keep the handler reference, remove it on disconnect/abort, and make cleanup idempotent. Also handle the emitter error channel.',
      explanation:
        'Keep the handler reference, remove it on disconnect/abort, and make cleanup idempotent. Also handle the emitter error channel. Registering a listener per request on a shared emitter without removing it retains closures and duplicates delivery.',
      followUp: 'Which test would fail if this boundary were removed?',
    },
  ],
}
