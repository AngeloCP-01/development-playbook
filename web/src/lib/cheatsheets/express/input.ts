import type { Section, SheetActivity } from '../types'
export const input: { sections: Section[]; activities: SheetActivity[] } = {
  sections: [
    {
      title: 'Input and responses',
      study: {
        id: 'input-and-responses',
        label: 'Input and responses',
        hint: 'Trace the example, then defend the boundary',
      },
      introduction: [
        {
          id: 'input-and-responses-intro',
          kind: 'paragraph',
          text: 'Choose a topic to inspect its worked example and interview answer. Try the local exercise before revealing its reasoning. Examples use Node 22 JavaScript (.mjs unless explicitly stated) and Express 5.3.0. HTTP factories do not listen until the test or startup owner calls listen.',
        },
      ],
      rows: [
        {
          term: 'Reject malformed and unexpected input',
          what: 'Parsing turns bytes into values. Validation decides whether those values meet the API contract. Authorization is a later permission decision. Restrict media type, body size, object shape, keys and value ranges.',
          study: {
            id: 'parsing-and-validation',
            summary:
              'Parsing turns bytes into values. Validation decides whether those values meet the API contract. Authorization is a later permission decision. Restrict media type, body size, object shape, keys and value ranges.',
            activityIds: ['parsing-and-validation-practice'],
          },
          teaching: [
            {
              id: 'parsing-and-validation-model',
              kind: 'paragraph',
              text: 'Parsing turns bytes into values. Validation decides whether those values meet the API contract. Authorization is a later permission decision. Restrict media type, body size, object shape, keys and value ranges.',
            },
            {
              id: 'parsing-and-validation-example',
              kind: 'code',
              label:
                'Reject malformed and unexpected input — standalone .mjs / exported factory',
              code: "import express from 'express';\nexport function makeApp() { const app = express(); app.use(express.json({ limit: '1kb' }));\n app.post('/books', (req, res) => { const b = req.body;\n if (!b || Array.isArray(b) || typeof b.title !== 'string' || !b.title.trim() || b.title.length > 100 || Object.keys(b).some(k => k !== 'title')) return res.status(400).json({ error: 'invalid book' });\n return res.status(201).json({ id: 'b1', title: b.title.trim() });\n }); app.use((err, req, res, next) => { if (res.headersSent) return next(err); res.status(err.type === 'entity.too.large' ? 413 : 400).json({ error: 'invalid body' }); }); return app;\n}",
            },
            {
              id: 'parsing-and-validation-trace',
              kind: 'table',
              label: 'Reject malformed and unexpected input result',
              columns: ['Observation', 'Reasoning'],
              rows: [
                [
                  'A valid title produces 201; missing body, arrays, unknown keys and bad types produce 400. Malformed JSON fails in the parser before the route.',
                  'Parsing turns bytes into values. Validation decides whether those values meet the API contract. Authorization is a later permission decision. Restrict media type, body size, object shape, keys and value ranges.',
                ],
              ],
            },
            {
              id: 'parsing-and-validation-mistake',
              kind: 'paragraph',
              text: 'Common mistake: Never spread req.body into a privileged record. Explicitly select allowed properties; a parser is not a schema validator.',
            },
            {
              id: 'parsing-and-validation-interview',
              kind: 'interview',
              question: 'Why reject unknown keys?',
              answer:
                'It prevents accidental mass assignment and makes the input contract explicit. Whether to reject or ignore is a deliberate API policy.',
              followUp: 'Try title=42 and an ownerId field. What happens?',
            },
          ],
        },
        {
          term: 'Send exactly one response',
          what: 'Set status and headers before writing the body. json serializes and ends; end terminates without requiring a body. A JavaScript return only exits the current function.',
          study: {
            id: 'response-contracts',
            summary:
              'Set status and headers before writing the body. json serializes and ends; end terminates without requiring a body. A JavaScript return only exits the current function.',
            activityIds: ['response-contracts-practice'],
          },
          teaching: [
            {
              id: 'response-contracts-model',
              kind: 'paragraph',
              text: 'Set status and headers before writing the body. json serializes and ends; end terminates without requiring a body. A JavaScript return only exits the current function.',
            },
            {
              id: 'response-contracts-example',
              kind: 'code',
              label:
                'Send exactly one response — standalone .mjs / exported factory',
              code: "import express from 'express';\nexport function makeApp() { const app = express();\n app.get('/books/:id', (req, res) => {\n if (req.params.id !== 'b1') return res.status(404).json({ error: 'missing' });\n return res.status(200).json({ id: 'b1' });\n }); return app;\n}",
            },
            {
              id: 'response-contracts-trace',
              kind: 'table',
              label: 'Send exactly one response result',
              columns: ['Observation', 'Reasoning'],
              rows: [
                [
                  'b1 returns 200; another ID returns one 404 response and never reaches the success sender.',
                  'Set status and headers before writing the body. json serializes and ends; end terminates without requiring a body. A JavaScript return only exits the current function.',
                ],
              ],
            },
            {
              id: 'response-contracts-mistake',
              kind: 'paragraph',
              text: 'Common mistake: Without the first return, execution reaches the success branch and attempts a second response. headersSent means headers are committed, not that delivery succeeded.',
            },
            {
              id: 'response-contracts-interview',
              kind: 'interview',
              question:
                'Can changing status after write repair a partial response?',
              answer:
                'No. Once headers are committed, delegate errors to the appropriate close/error path; do not append a new JSON error document.',
              followUp: 'A route only calls res.status(202). Is it finished?',
            },
          ],
        },
        {
          term: 'Bound and order list queries',
          what: 'Choose defaults for absent input, reject repeats and malformed shapes, then bound the page size. Stable ordering prevents arbitrary reshuffling; concurrent dataset changes may still require cursor/snapshot semantics.',
          study: {
            id: 'lists-and-pagination',
            summary:
              'Choose defaults for absent input, reject repeats and malformed shapes, then bound the page size. Stable ordering prevents arbitrary reshuffling; concurrent dataset changes may still require cursor/snapshot semantics.',
            activityIds: ['lists-and-pagination-practice'],
          },
          teaching: [
            {
              id: 'lists-and-pagination-model',
              kind: 'paragraph',
              text: 'Choose defaults for absent input, reject repeats and malformed shapes, then bound the page size. Stable ordering prevents arbitrary reshuffling; concurrent dataset changes may still require cursor/snapshot semantics.',
            },
            {
              id: 'lists-and-pagination-example',
              kind: 'code',
              label:
                'Bound and order list queries — standalone .mjs / exported factory',
              code: "import express from 'express';\nexport function makeApp() { const app = express(); app.set('query parser', 'simple');\n const books = [{ id: 'b2' }, { id: 'b1' }];\n app.get('/books', (req, res) => { const value = req.query.limit;\n if (value !== undefined && (typeof value !== 'string' || !/^[1-9]\\d*$/.test(value) || Number(value) > 2)) return res.status(400).end();\n return res.json([...books].sort((a,b) => a.id.localeCompare(b.id)).slice(0, value === undefined ? 2 : Number(value)));\n }); return app;\n}",
            },
            {
              id: 'lists-and-pagination-trace',
              kind: 'table',
              label: 'Bound and order list queries result',
              columns: ['Observation', 'Reasoning'],
              rows: [
                [
                  'Absent limit returns b1,b2; limit=1 returns b1. Repeated keys, zero, decimals and values above two fail.',
                  'Choose defaults for absent input, reject repeats and malformed shapes, then bound the page size. Stable ordering prevents arbitrary reshuffling; concurrent dataset changes may still require cursor/snapshot semantics.',
                ],
              ],
            },
            {
              id: 'lists-and-pagination-mistake',
              kind: 'paragraph',
              text: 'Common mistake: Sorting the shared array in place mutates process state. Copy before sorting; bound work as well as output size for real large collections.',
            },
            {
              id: 'lists-and-pagination-interview',
              kind: 'interview',
              question:
                'Does offset pagination guarantee no duplicates during writes?',
              answer:
                'No. Insertions and deletions can shift offsets. Use a defined stable cursor and ordering key when that matters.',
              followUp: 'What does limit[bad]=1 mean with simple parsing?',
            },
          ],
        },
      ],
    },
  ],
  activities: [
    {
      id: 'parsing-and-validation-practice',
      title: 'Reject malformed and unexpected input practice',
      prompt: 'Try title=42 and an ownerId field. What happens?',
      context:
        'Original reading-list API exercise. State the assumption and explain the failure boundary before revealing the answer.',
      answer:
        'Both are rejected. The server must derive ownership from trusted identity rather than accepting a caller-selected owner.',
      explanation:
        'Both are rejected. The server must derive ownership from trusted identity rather than accepting a caller-selected owner. Never spread req.body into a privileged record. Explicitly select allowed properties; a parser is not a schema validator.',
      followUp: 'Which test would fail if this boundary were removed?',
    },
    {
      id: 'response-contracts-practice',
      title: 'Send exactly one response practice',
      prompt: 'A route only calls res.status(202). Is it finished?',
      context:
        'Original reading-list API exercise. State the assumption and explain the failure boundary before revealing the answer.',
      answer:
        'No. It must send or end the response, or explicitly continue to a handler that does.',
      explanation:
        'No. It must send or end the response, or explicitly continue to a handler that does. Without the first return, execution reaches the success branch and attempts a second response. headersSent means headers are committed, not that delivery succeeded.',
      followUp: 'Which test would fail if this boundary were removed?',
    },
    {
      id: 'lists-and-pagination-practice',
      title: 'Bound and order list queries practice',
      prompt: 'What does limit[bad]=1 mean with simple parsing?',
      context:
        'Original reading-list API exercise. State the assumption and explain the failure boundary before revealing the answer.',
      answer:
        'It is a different literal key, not limit. This example ignores unknown query keys; a stricter API can explicitly reject them.',
      explanation:
        'It is a different literal key, not limit. This example ignores unknown query keys; a stricter API can explicitly reject them. Sorting the shared array in place mutates process state. Copy before sorting; bound work as well as output size for real large collections.',
      followUp: 'Which test would fail if this boundary were removed?',
    },
  ],
}
