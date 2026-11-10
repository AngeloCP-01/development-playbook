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
          text: 'Apply the Node model to network messages: headers, streamed bytes, one response and a separately owned cancellation/deadline. The native factory remains a testable static example, not a backend added to this site.',
        },
      ],
      rows: [
        {
          term: 'See the server beneath Express',
          what: 'Follow headers, body chunks, end and response completion through one native HTTP request.',
          study: {
            id: 'raw-http',
            summary:
              'Follow headers, body chunks, end and response completion through one native HTTP request.',
            activityIds: ['raw-http-practice'],
          },
          teaching: [
            {
              id: 'raw-http-model',
              kind: 'paragraph',
              text: 'Node calls the server handler when request headers are available, before the whole body necessarily arrives. req is a readable stream; its data/end/error events reach listeners on the loop. res is writable: status and headers must precede the body, and end finishes the response message. A chunk is neither a character boundary nor a whole request record.',
            },
            {
              id: 'raw-http-example',
              kind: 'code',
              label:
                'http.mjs — bounded-retention request fixture; startup owns listen',
              code: "import { createServer } from 'node:http';\nexport function makeServer() { return createServer((req, res) => {\n const chunks = []; let size = 0, oversized = false;\n req.on('data', chunk => { size += chunk.length; if (size > 1024) oversized = true; if (!oversized) chunks.push(chunk); });\n req.on('aborted', () => { chunks.length = 0; });\n req.on('error', () => { chunks.length = 0; if (!res.headersSent) res.writeHead(400).end(); else res.destroy(); });\n req.on('end', () => {\n  if (res.writableEnded || res.destroyed) return;\n  if (oversized) return res.writeHead(413).end();\n  const body = Buffer.concat(chunks).toString('utf8');\n  res.writeHead(200, { 'Content-Type': 'application/json' });\n  res.end(JSON.stringify({ method: req.method, bytes: size, body }));\n });\n}); }",
            },
            {
              id: 'raw-http-trace',
              kind: 'table',
              label: 'From request headers to response end',
              columns: ['Moment', 'JavaScript / resource state', 'Result'],
              rows: [
                [
                  'Headers available',
                  'Server handler registers readable listeners; socket/body can still be outstanding',
                  'No full body is assumed yet.',
                ],
                [
                  'Body chunks',
                  'Callbacks accumulate at most 1024 bytes of retained chunks',
                  'POST é uses two UTF-8 bytes; decode after concatenating, not per arbitrary chunk.',
                ],
                [
                  'end',
                  'All retained body bytes can form the fixture response',
                  'GET has empty body; POST reports method, byte count and decoded text.',
                ],
                [
                  'res.end',
                  'Headers are already committed; writable message ends',
                  'Returning from JavaScript alone would not complete the response.',
                ],
              ],
            },
            {
              id: 'raw-http-boundary',
              kind: 'paragraph',
              text: 'The fixture stops retaining chunks above its limit but drains the request until end before returning 413; it does not bound an adversary’s total connection lifetime. A service also needs request deadlines, admission limits and cancellation. An aborted request is not a successful completed body; a partially sent response cannot be replaced with a fresh JSON error. Express parsers later add convenience, not a replacement execution model.',
            },
            {
              id: 'raw-http-interview',
              kind: 'interview',
              question:
                'Is the body complete when the server request handler begins?',
              answer:
                'No. Headers can arrive before body completion. Own readable data/end/error/abort and response lifetime separately. Native network readiness makes callbacks eligible; it does not run them in parallel with your current JavaScript stack.',
              followUp:
                'Why should a CPU-heavy body transform be bounded or offloaded?',
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
