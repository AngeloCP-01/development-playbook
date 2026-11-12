import type { Section, SheetActivity } from '../types'
export const errors: { sections: Section[]; activities: SheetActivity[] } = {
  sections: [
    {
      title: 'Errors and boundaries',
      study: {
        id: 'errors-and-boundaries',
        label: 'Errors and boundaries',
        hint: 'Trace the example, then defend the boundary',
      },
      introduction: [
        {
          id: 'errors-and-boundaries-intro',
          kind: 'paragraph',
          text: 'Choose a topic to inspect its worked example and interview answer. Try the local exercise before revealing its reasoning. Examples use Node 22 JavaScript (.mjs unless explicitly stated) and Express 5.3.0. HTTP factories do not listen until the test or startup owner calls listen.',
        },
      ],
      rows: [
        {
          term: 'Forward the promise you return',
          what: 'Express 5 forwards rejected promises returned by handlers. Awaiting a failing dependency inside an async handler connects its rejection to the request error boundary.',
          study: {
            id: 'promise-errors',
            summary:
              'Express 5 forwards rejected promises returned by handlers. Awaiting a failing dependency inside an async handler connects its rejection to the request error boundary.',
            activityIds: ['promise-errors-practice'],
          },
          teaching: [
            {
              id: 'promise-errors-model',
              kind: 'paragraph',
              text: 'Express 5 forwards rejected promises returned by handlers. Awaiting a failing dependency inside an async handler connects its rejection to the request error boundary.',
            },
            {
              id: 'promise-errors-example',
              kind: 'code',
              label:
                'Forward the promise you return — standalone .mjs / exported factory',
              code: "import express from 'express';\nexport function makeApp() { const app = express();\n app.get('/books', async () => { await Promise.reject(new Error('private database detail')); });\n app.use((err, req, res, next) => { if (res.headersSent) return next(err); res.status(500).json({ error: 'internal' }); });\n return app;\n}",
            },
            {
              id: 'promise-errors-trace',
              kind: 'table',
              label: 'Forward the promise you return result',
              columns: ['Observation', 'Reasoning'],
              rows: [
                [
                  'GET /books produces a generic 500 without leaking the dependency error message.',
                  'Express 5 forwards rejected promises returned by handlers. Awaiting a failing dependency inside an async handler connects its rejection to the request error boundary.',
                ],
              ],
            },
            {
              id: 'promise-errors-mistake',
              kind: 'paragraph',
              text: 'Common mistake: Starting a promise without returning or awaiting it detaches the failure. Do not both call next(err) and rethrow the same error.',
            },
            {
              id: 'promise-errors-interview',
              kind: 'interview',
              question: 'Does a fulfilled async handler advance automatically?',
              answer:
                'No. It must respond or call next. Promise rejection forwarding only supplies the error path.',
              followUp:
                'A dependency rejects after a route has responded. Can Express replace the response?',
            },
          ],
        },
        {
          term: 'Bridge callbacks explicitly',
          what: 'A future callback runs after the surrounding handler stack has returned. A try/catch around scheduling does not catch a later throw; pass callback errors to next.',
          study: {
            id: 'callback-errors',
            summary:
              'A future callback runs after the surrounding handler stack has returned. A try/catch around scheduling does not catch a later throw; pass callback errors to next.',
            activityIds: ['callback-errors-practice'],
          },
          teaching: [
            {
              id: 'callback-errors-model',
              kind: 'paragraph',
              text: 'A future callback runs after the surrounding handler stack has returned. A try/catch around scheduling does not catch a later throw; pass callback errors to next.',
            },
            {
              id: 'callback-errors-example',
              kind: 'code',
              label:
                'Bridge callbacks explicitly — standalone .mjs / exported factory',
              code: "import express from 'express';\nexport function makeApp() { const app = express();\n app.get('/books', (req, res, next) => { setImmediate(() => { next(new Error('offline')); }); });\n app.use((err, req, res, next) => { if (res.headersSent) return next(err); res.status(500).json({ error: 'internal' }); });\n return app;\n}",
            },
            {
              id: 'callback-errors-trace',
              kind: 'table',
              label: 'Bridge callbacks explicitly result',
              columns: ['Observation', 'Reasoning'],
              rows: [
                [
                  'The scheduled error reaches the four-argument handler and returns 500.',
                  'A future callback runs after the surrounding handler stack has returned. A try/catch around scheduling does not catch a later throw; pass callback errors to next.',
                ],
              ],
            },
            {
              id: 'callback-errors-mistake',
              kind: 'paragraph',
              text: 'Common mistake: Throwing inside setImmediate bypasses the original handler try/catch and can crash the process. Bridge once, or use a promise adapter and await it.',
            },
            {
              id: 'callback-errors-interview',
              kind: 'interview',
              question: 'Which error channel should a callback API use?',
              answer:
                'Its documented callback error argument. Convert or forward that error at the boundary; do not assume Express can see arbitrary future throws.',
              followUp:
                'How would you repair readFile(path, callback) in a route?',
            },
          ],
        },
        {
          term: 'Separate missing routes from failures',
          what: 'No matching route is an ordinary 404, not an exception. Install a 404 fallback after routes, then a four-argument final error handler. Expose only explicitly trusted error types.',
          study: {
            id: 'not-found-and-final-error',
            summary:
              'No matching route is an ordinary 404, not an exception. Install a 404 fallback after routes, then a four-argument final error handler. Expose only explicitly trusted error types.',
            activityIds: ['not-found-and-final-error-practice'],
          },
          teaching: [
            {
              id: 'not-found-and-final-error-model',
              kind: 'paragraph',
              text: 'No matching route is an ordinary 404, not an exception. Install a 404 fallback after routes, then a four-argument final error handler. Expose only explicitly trusted error types.',
            },
            {
              id: 'not-found-and-final-error-example',
              kind: 'code',
              label:
                'Separate missing routes from failures — standalone .mjs / exported factory',
              code: "import express from 'express';\nexport function makeApp() { const app = express();\n app.get('/fail', () => { throw Object.assign(new Error('secret'), { status: 401 }); });\n app.use((req, res) => res.status(404).json({ error: 'missing' }));\n app.use((err, req, res, next) => { if (res.headersSent) return next(err); return res.status(500).json({ error: 'internal' }); });\n return app;\n}",
            },
            {
              id: 'not-found-and-final-error-trace',
              kind: 'table',
              label: 'Separate missing routes from failures result',
              columns: ['Observation', 'Reasoning'],
              rows: [
                [
                  '/unknown returns 404; /fail returns 500 even though an arbitrary error object carries status 401.',
                  'No matching route is an ordinary 404, not an exception. Install a 404 fallback after routes, then a four-argument final error handler. Expose only explicitly trusted error types.',
                ],
              ],
            },
            {
              id: 'not-found-and-final-error-mistake',
              kind: 'paragraph',
              text: 'Common mistake: Blindly trusting err.status or exposing err.message can leak implementation details or misclassify failures. Use a controlled application error class when deliberate exposure is needed.',
            },
            {
              id: 'not-found-and-final-error-interview',
              kind: 'interview',
              question: 'Why does the handler need four parameters?',
              answer:
                'Express identifies error middleware by its error-handling signature. Keep err, req, res and next even if some are used only in delegation.',
              followUp:
                'What if a streamed response fails after headers are sent?',
            },
          ],
        },
      ],
    },
  ],
  activities: [
    {
      id: 'promise-errors-practice',
      title: 'Forward the promise you return practice',
      prompt:
        'A dependency rejects after a route has responded. Can Express replace the response?',
      context:
        'Original reading-list API exercise. State the assumption and explain the failure boundary before revealing the answer.',
      answer:
        'No. Own detached work outside the response lifecycle, or await it before responding. Log safely and never attempt a second send.',
      explanation:
        'No. Own detached work outside the response lifecycle, or await it before responding. Log safely and never attempt a second send. Starting a promise without returning or awaiting it detaches the failure. Do not both call next(err) and rethrow the same error.',
      followUp: 'Which test would fail if this boundary were removed?',
    },
    {
      id: 'callback-errors-practice',
      title: 'Bridge callbacks explicitly practice',
      prompt: 'How would you repair readFile(path, callback) in a route?',
      context:
        'Original reading-list API exercise. State the assumption and explain the failure boundary before revealing the answer.',
      answer:
        'Check err and return next(err); otherwise send once. Alternatively await the fs/promises API in an async handler.',
      explanation:
        'Check err and return next(err); otherwise send once. Alternatively await the fs/promises API in an async handler. Throwing inside setImmediate bypasses the original handler try/catch and can crash the process. Bridge once, or use a promise adapter and await it.',
      followUp: 'Which test would fail if this boundary were removed?',
    },
    {
      id: 'not-found-and-final-error-practice',
      title: 'Separate missing routes from failures practice',
      prompt: 'What if a streamed response fails after headers are sent?',
      context:
        'Original reading-list API exercise. State the assumption and explain the failure boundary before revealing the answer.',
      answer:
        'Delegate with next(err); the default error handler may close the connection. A new JSON 500 cannot replace bytes already sent.',
      explanation:
        'Delegate with next(err); the default error handler may close the connection. A new JSON 500 cannot replace bytes already sent. Blindly trusting err.status or exposing err.message can leak implementation details or misclassify failures. Use a controlled application error class when deliberate exposure is needed.',
      followUp: 'Which test would fail if this boundary were removed?',
    },
  ],
}
