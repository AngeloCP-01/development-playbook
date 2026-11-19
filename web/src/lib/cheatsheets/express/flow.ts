import type { Section, SheetActivity } from '../types'
export const flow: { sections: Section[]; activities: SheetActivity[] } = {
  sections: [
    {
      title: 'Express flow',
      study: {
        id: 'express-flow',
        label: 'Express flow',
        hint: 'Trace the example, then defend the boundary',
      },
      introduction: [
        {
          id: 'express-flow-intro',
          kind: 'paragraph',
          text: 'Choose a topic to inspect its worked example and interview answer. Try the local exercise before revealing its reasoning. Examples use Node 22 JavaScript (.mjs unless explicitly stated) and Express 5.3.0. HTTP factories do not listen until the test or startup owner calls listen.',
        },
      ],
      rows: [
        {
          term: 'Mount a small API without starting it',
          what: 'An app factory registers behavior and returns an app. The listener belongs to startup. Routers group paths; a mount prefix combines with their local route paths.',
          study: {
            id: 'app-and-router',
            summary:
              'An app factory registers behavior and returns an app. The listener belongs to startup. Routers group paths; a mount prefix combines with their local route paths.',
            activityIds: ['app-and-router-practice'],
          },
          teaching: [
            {
              id: 'app-and-router-model',
              kind: 'paragraph',
              text: 'An app factory registers behavior and returns an app. The listener belongs to startup. Routers group paths; a mount prefix combines with their local route paths.',
            },
            {
              id: 'app-and-router-example',
              kind: 'code',
              label:
                'Mount a small API without starting it — standalone .mjs / exported factory',
              code: "import express from 'express';\nexport function makeApp() { const app = express(); const router = express.Router();\n router.get('/:id', (req, res) => res.json({ id: req.params.id, base: req.baseUrl }));\n app.use('/books', router); return app;\n}",
            },
            {
              id: 'app-and-router-trace',
              kind: 'table',
              label: 'Mount a small API without starting it result',
              columns: ['Observation', 'Reasoning'],
              rows: [
                [
                  '/books/b1 returns id b1 and base /books. The router route sees its local /:id path.',
                  'An app factory registers behavior and returns an app. The listener belongs to startup. Routers group paths; a mount prefix combines with their local route paths.',
                ],
              ],
            },
            {
              id: 'app-and-router-mistake',
              kind: 'paragraph',
              text: 'Common mistake: Calling listen during import makes tests contend for ports and creates hidden lifecycle ownership.',
            },
            {
              id: 'app-and-router-interview',
              kind: 'interview',
              question: 'Why inject services into a factory?',
              answer:
                'Tests can supply deterministic dependencies, while production startup wires real ones. Route code stays separate from connection and shutdown ownership.',
              followUp: 'How do two tests use this API without sharing a port?',
            },
          ],
        },
        {
          term: 'Trace enter, next and response',
          what: 'Middleware runs in registration order. next hands control to the next matching layer; it does not end the current JavaScript function. Returning prevents fall-through in your function.',
          study: {
            id: 'middleware-order',
            summary:
              'Middleware runs in registration order. next hands control to the next matching layer; it does not end the current JavaScript function. Returning prevents fall-through in your function.',
            activityIds: ['middleware-order-practice'],
          },
          teaching: [
            {
              id: 'middleware-order-model',
              kind: 'paragraph',
              text: 'Middleware runs in registration order. next hands control to the next matching layer; it does not end the current JavaScript function. Returning prevents fall-through in your function.',
            },
            {
              id: 'middleware-order-example',
              kind: 'code',
              label:
                'Trace enter, next and response — standalone .mjs / exported factory',
              code: "import express from 'express';\nexport function makeApp() { const app = express();\n app.use((req, res, next) => { res.locals.trace = ['enter']; next(); res.locals.trace.push('exit'); });\n app.get('/books', (req, res) => { res.locals.trace.push('route'); return res.json(res.locals.trace); });\n return app;\n}",
            },
            {
              id: 'middleware-order-trace',
              kind: 'table',
              label: 'Trace enter, next and response result',
              columns: ['Observation', 'Reasoning'],
              rows: [
                [
                  'The serialized body is [enter, route]. The exit entry is added after the downstream handler returns, after serialization.',
                  'Middleware runs in registration order. next hands control to the next matching layer; it does not end the current JavaScript function. Returning prevents fall-through in your function.',
                ],
              ],
            },
            {
              id: 'middleware-order-mistake',
              kind: 'paragraph',
              text: 'Common mistake: Sending a response and then calling next can reach another sender. A fulfilled async middleware promise does not automatically call next.',
            },
            {
              id: 'middleware-order-interview',
              kind: 'interview',
              question: 'Does return res.json call the next middleware?',
              answer:
                'No. json ends the response; return exits that function. A middleware that neither responds nor calls next leaves the request pending.',
              followUp:
                'Put a JSON parser after a body-reading route. Why does input disappear?',
            },
          ],
        },
        {
          term: 'Use Express 5 path and query rules',
          what: 'Path params, query parameters and body are separate inputs. Set the query parser explicitly to simple. Express 5 wildcard names are required; braces express optional path portions.',
          study: {
            id: 'routing-five',
            summary:
              'Path params, query parameters and body are separate inputs. Set the query parser explicitly to simple. Express 5 wildcard names are required; braces express optional path portions.',
            activityIds: ['routing-five-practice'],
          },
          teaching: [
            {
              id: 'routing-five-model',
              kind: 'paragraph',
              text: 'Path params, query parameters and body are separate inputs. Set the query parser explicitly to simple. Express 5 wildcard names are required; braces express optional path portions.',
            },
            {
              id: 'routing-five-example',
              kind: 'code',
              label:
                'Use Express 5 path and query rules — standalone .mjs / exported factory',
              code: "import express from 'express';\nexport function makeApp() { const app = express(); app.set('query parser', 'simple');\n app.get('/files/:file{.:ext}', (req, res) => res.json(req.params));\n app.get('/{*rest}', (req, res) => res.status(404).json({ missing: true }));\n return app;\n}",
            },
            {
              id: 'routing-five-trace',
              kind: 'table',
              label: 'Use Express 5 path and query rules result',
              columns: ['Observation', 'Reasoning'],
              rows: [
                [
                  '/files/notes.txt yields file notes and ext txt. /files/notes also matches. The final wildcard includes the root.',
                  'Path params, query parameters and body are separate inputs. Set the query parser explicitly to simple. Express 5 wildcard names are required; braces express optional path portions.',
                ],
              ],
            },
            {
              id: 'routing-five-mistake',
              kind: 'paragraph',
              text: 'Common mistake: A broad route registered first can swallow a specific route. Express 4 path syntax is not a safe copy into Express 5.',
            },
            {
              id: 'routing-five-interview',
              kind: 'interview',
              question: 'Is req.query.page always a string?',
              answer:
                'No. Repeated keys can produce arrays; nested-looking keys remain parser-dependent. Validate the actual shape and reject ambiguous input.',
              followUp: 'What should ?page=1&page=2 do in a bounded list API?',
            },
          ],
        },
      ],
    },
  ],
  activities: [
    {
      id: 'app-and-router-practice',
      title: 'Mount a small API without starting it practice',
      prompt: 'How do two tests use this API without sharing a port?',
      context:
        'Original reading-list API exercise. State the assumption and explain the failure boundary before revealing the answer.',
      answer:
        'Each creates its own app and listens on loopback port 0; each closes its listener in finally.',
      explanation:
        'Each creates its own app and listens on loopback port 0; each closes its listener in finally. Calling listen during import makes tests contend for ports and creates hidden lifecycle ownership.',
      followUp: 'Which test would fail if this boundary were removed?',
    },
    {
      id: 'middleware-order-practice',
      title: 'Trace enter, next and response practice',
      prompt:
        'Put a JSON parser after a body-reading route. Why does input disappear?',
      context:
        'Original reading-list API exercise. State the assumption and explain the failure boundary before revealing the answer.',
      answer:
        'The route runs before parsing. Register parsing before consumers; then validate the parsed value separately.',
      explanation:
        'The route runs before parsing. Register parsing before consumers; then validate the parsed value separately. Sending a response and then calling next can reach another sender. A fulfilled async middleware promise does not automatically call next.',
      followUp: 'Which test would fail if this boundary were removed?',
    },
    {
      id: 'routing-five-practice',
      title: 'Use Express 5 path and query rules practice',
      prompt: 'What should ?page=1&page=2 do in a bounded list API?',
      context:
        'Original reading-list API exercise. State the assumption and explain the failure boundary before revealing the answer.',
      answer:
        'Reject ambiguity rather than picking a hidden first/last policy. Document any different policy explicitly.',
      explanation:
        'Reject ambiguity rather than picking a hidden first/last policy. Document any different policy explicitly. A broad route registered first can swallow a specific route. Express 4 path syntax is not a safe copy into Express 5.',
      followUp: 'Which test would fail if this boundary were removed?',
    },
  ],
}
