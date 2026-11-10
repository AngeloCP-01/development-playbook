import type { Section, SheetActivity } from '../types'
export const http: { sections: Section[]; activities: SheetActivity[] } = {
  sections: [
    {
      title: 'HTTP foundations',
      study: {
        id: 'http-foundations',
        label: 'HTTP foundations',
        hint: 'Trace the example, then defend the boundary',
      },
      introduction: [
        {
          id: 'http-foundations-intro',
          kind: 'paragraph',
          text: 'Choose a topic to inspect its worked example and interview answer. Try the local exercise before revealing its reasoning. Examples use Node 22 JavaScript (.mjs unless explicitly stated) and Express 5.3.0. HTTP factories do not listen until the test or startup owner calls listen.',
        },
      ],
      rows: [
        {
          term: 'See the server beneath Express',
          what: 'A native HTTP request is a readable stream and its response is writable. Headers describe the representation; end terminates the message. This example exposes a factory so tests choose loopback port 0.',
          study: {
            id: 'raw-http',
            summary:
              'A native HTTP request is a readable stream and its response is writable. Headers describe the representation; end terminates the message. This example exposes a factory so tests choose loopback port 0.',
            activityIds: ['raw-http-practice'],
          },
          teaching: [
            {
              id: 'raw-http-model',
              kind: 'paragraph',
              text: 'A native HTTP request is a readable stream and its response is writable. Headers describe the representation; end terminates the message. This example exposes a factory so tests choose loopback port 0.',
            },
            {
              id: 'raw-http-example',
              kind: 'code',
              label:
                'See the server beneath Express — standalone .mjs / exported factory',
              code: "import { createServer } from 'node:http';\nexport function makeServer() { return createServer((req, res) => {\n res.writeHead(200, { 'Content-Type': 'application/json' });\n res.end(JSON.stringify({ method: req.method }));\n}); }",
            },
            {
              id: 'raw-http-trace',
              kind: 'table',
              label: 'See the server beneath Express result',
              columns: ['Observation', 'Reasoning'],
              rows: [
                [
                  'GET produces 200 with a JSON object containing method GET. No socket is opened until listen is called.',
                  'A native HTTP request is a readable stream and its response is writable. Headers describe the representation; end terminates the message. This example exposes a factory so tests choose loopback port 0.',
                ],
              ],
            },
            {
              id: 'raw-http-mistake',
              kind: 'paragraph',
              text: 'Common mistake: Receiving request headers does not imply the entire body has arrived. Bound and validate streamed input before using it.',
            },
            {
              id: 'raw-http-interview',
              kind: 'interview',
              question: 'What does Express add here?',
              answer:
                'Routing, middleware composition and request/response conveniences over the same HTTP lifecycle. It does not remove streaming or disconnect concerns.',
              followUp: 'Who closes a server created by an integration test?',
            },
          ],
        },
        {
          term: 'Choose the intended HTTP effect',
          what: 'GET is safe: it requests retrieval. PUT and DELETE are idempotent in intended effect; repeating DELETE may return a different status. POST generally needs an explicit deduplication contract for retries.',
          study: {
            id: 'methods-and-status',
            summary:
              'GET is safe: it requests retrieval. PUT and DELETE are idempotent in intended effect; repeating DELETE may return a different status. POST generally needs an explicit deduplication contract for retries.',
            activityIds: ['methods-and-status-practice'],
          },
          teaching: [
            {
              id: 'methods-and-status-model',
              kind: 'paragraph',
              text: 'GET is safe: it requests retrieval. PUT and DELETE are idempotent in intended effect; repeating DELETE may return a different status. POST generally needs an explicit deduplication contract for retries.',
            },
            {
              id: 'methods-and-status-example',
              kind: 'code',
              label:
                'Choose the intended HTTP effect — standalone .mjs / exported factory',
              code: "import express from 'express';\nexport function makeApp() { const app = express();\n app.get('/books', (req, res) => res.json([{ id: 'b1' }]));\n app.delete('/books/:id', (req, res) => res.status(204).end());\n return app;\n}",
            },
            {
              id: 'methods-and-status-trace',
              kind: 'table',
              label: 'Choose the intended HTTP effect result',
              columns: ['Observation', 'Reasoning'],
              rows: [
                [
                  'GET returns JSON; DELETE ends with 204 and no body. Express HEAD on the GET route sends headers without the response body.',
                  'GET is safe: it requests retrieval. PUT and DELETE are idempotent in intended effect; repeating DELETE may return a different status. POST generally needs an explicit deduplication contract for retries.',
                ],
              ],
            },
            {
              id: 'methods-and-status-mistake',
              kind: 'paragraph',
              text: 'Common mistake: Do not send JSON with 204 or assume status(200) ends a response. PATCH is not inherently idempotent; it depends on the operation.',
            },
            {
              id: 'methods-and-status-interview',
              kind: 'interview',
              question: 'Does idempotent mean identical responses?',
              answer:
                'No. It describes the intended server effect across repeated identical requests, not identical status codes, timestamps or logs.',
              followUp:
                'A retry increments a counter twice. Can you call that operation idempotent?',
            },
          ],
        },
        {
          term: 'Cancel the operation that owns the work',
          what: 'An outbound deadline should signal cancellation to fetch, and the owner must catch failure. An incoming response timeout does not automatically cancel downstream work.',
          study: {
            id: 'deadlines-and-aborts',
            summary:
              'An outbound deadline should signal cancellation to fetch, and the owner must catch failure. An incoming response timeout does not automatically cancel downstream work.',
            activityIds: ['deadlines-and-aborts-practice'],
          },
          teaching: [
            {
              id: 'deadlines-and-aborts-model',
              kind: 'paragraph',
              text: 'An outbound deadline should signal cancellation to fetch, and the owner must catch failure. An incoming response timeout does not automatically cancel downstream work.',
            },
            {
              id: 'deadlines-and-aborts-example',
              kind: 'code',
              label:
                'Cancel the operation that owns the work — standalone .mjs / exported factory',
              code: "import { createServer } from 'node:http';\nconst server = createServer((req, res) => {\n // Deliberately never respond: the caller must bound its wait.\n res.on('close', () => {});\n});\nawait new Promise((resolve, reject) => { server.once('error', reject); server.listen(0, '127.0.0.1', resolve); });\nconst controller = new AbortController();\nconst deadline = setTimeout(() => controller.abort(new Error('deadline')), 50);\ntry {\n await fetch('http://127.0.0.1:' + server.address().port, { signal: controller.signal });\n throw new Error('unexpected completion');\n} catch (error) {\n console.log(controller.signal.aborted, error.message);\n} finally {\n clearTimeout(deadline); server.closeAllConnections();\n await new Promise(resolve => server.close(resolve));\n}",
            },
            {
              id: 'deadlines-and-aborts-trace',
              kind: 'table',
              label: 'Cancel the operation that owns the work result',
              columns: ['Observation', 'Reasoning'],
              rows: [
                [
                  'true deadline: the local server deliberately leaves the response pending. The deadline aborts the fetch; finally clears the timer and closes the server. The check depends on cancellation, never on exact elapsed milliseconds.',
                  'An outbound deadline should signal cancellation to fetch, and the owner must catch failure. An incoming response timeout does not automatically cancel downstream work.',
                ],
              ],
            },
            {
              id: 'deadlines-and-aborts-mistake',
              kind: 'paragraph',
              text: 'Common mistake: A Promise.race timeout only stops waiting. It does not terminate the losing operation. Clear timers in finally and propagate cancellation to APIs that support it.',
            },
            {
              id: 'deadlines-and-aborts-interview',
              kind: 'interview',
              question: 'Is client disconnect the same as server timeout?',
              answer:
                'No. A disconnect means the peer is gone; a server timeout is a local deadline policy. Either may require cancelling owned work and releasing resources.',
              followUp:
                'A timed-out report continues using database capacity. What is missing?',
            },
          ],
        },
      ],
    },
  ],
  activities: [
    {
      id: 'raw-http-practice',
      title: 'See the server beneath Express practice',
      prompt: 'Who closes a server created by an integration test?',
      context:
        'Original reading-list API exercise. State the assumption and explain the failure boundary before revealing the answer.',
      answer:
        'The fixture owner, in finally, including connections that could otherwise keep the process alive.',
      explanation:
        'The fixture owner, in finally, including connections that could otherwise keep the process alive. Receiving request headers does not imply the entire body has arrived. Bound and validate streamed input before using it.',
      followUp: 'Which test would fail if this boundary were removed?',
    },
    {
      id: 'methods-and-status-practice',
      title: 'Choose the intended HTTP effect practice',
      prompt:
        'A retry increments a counter twice. Can you call that operation idempotent?',
      context:
        'Original reading-list API exercise. State the assumption and explain the failure boundary before revealing the answer.',
      answer:
        'No. Replace with an explicit target state or define a durable idempotency key and result contract.',
      explanation:
        'No. Replace with an explicit target state or define a durable idempotency key and result contract. Do not send JSON with 204 or assume status(200) ends a response. PATCH is not inherently idempotent; it depends on the operation.',
      followUp: 'Which test would fail if this boundary were removed?',
    },
    {
      id: 'deadlines-and-aborts-practice',
      title: 'Cancel the operation that owns the work practice',
      prompt:
        'A timed-out report continues using database capacity. What is missing?',
      context:
        'Original reading-list API exercise. State the assumption and explain the failure boundary before revealing the answer.',
      answer:
        'Cancellation or a bounded downstream operation. A response status alone cannot reclaim unrelated ongoing work.',
      explanation:
        'Cancellation or a bounded downstream operation. A response status alone cannot reclaim unrelated ongoing work. A Promise.race timeout only stops waiting. It does not terminate the losing operation. Clear timers in finally and propagate cancellation to APIs that support it.',
      followUp: 'Which test would fail if this boundary were removed?',
    },
  ],
}
