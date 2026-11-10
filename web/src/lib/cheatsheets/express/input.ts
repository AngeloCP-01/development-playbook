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
          what: 'Filter a small reading list, then request stable, bounded pages without mutating its shared fixture.',
          study: {
            id: 'lists-and-pagination',
            summary:
              'Filter a small reading list, then request stable, bounded pages without mutating its shared fixture.',
            activityIds: ['lists-and-pagination-practice'],
          },
          teaching: [
            {
              id: 'lists-and-pagination-model',
              kind: 'paragraph',
              text: 'This single-process fixture accepts only limit (1–2, default 2), offset (0–1000, default 0) and tag (node or web, absent means all). All supplied values must be single strings. Reject repeated, unknown and nested-looking keys with 400. Filter first, copy and sort by unique ID, then slice; an offset past the end returns an empty array. This bounds the demonstration input/output, not the cost of a production database query.',
            },
            {
              id: 'lists-and-pagination-example',
              kind: 'code',
              label:
                'Bound and order list queries — standalone .mjs / exported factory',
              code: "import express from 'express';\nexport function makeApp(books = [\n { id: 'b2', tag: 'node' }, { id: 'b1', tag: 'node' }, { id: 'b3', tag: 'web' }\n]) {\n const app = express(); app.set('query parser', 'simple');\n app.get('/books', (req, res) => {\n  const q = req.query;\n  if (Object.keys(q).some(k => !['limit', 'offset', 'tag'].includes(k))) return res.status(400).end();\n  const integer = (value, fallback, min, max) => {\n   if (value === undefined) return fallback;\n   if (typeof value !== 'string' || !/^(0|[1-9]\\d*)$/.test(value)) return null;\n   const n = Number(value); return Number.isSafeInteger(n) && n >= min && n <= max ? n : null;\n  };\n  const limit = integer(q.limit, 2, 1, 2), offset = integer(q.offset, 0, 0, 1000);\n  if (limit === null || offset === null || (q.tag !== undefined && (typeof q.tag !== 'string' || !['node', 'web'].includes(q.tag)))) return res.status(400).end();\n  const selected = books.filter(b => q.tag === undefined || b.tag === q.tag);\n  selected.sort((a, b) => a.id.localeCompare(b.id));\n  return res.json(selected.slice(offset, offset + limit));\n }); return app;\n}",
            },
            {
              id: 'lists-and-pagination-trace',
              kind: 'table',
              label: 'Bound and order list queries result',
              columns: ['Request', 'Result IDs', 'Why'],
              rows: [
                [
                  'GET /books',
                  'b1, b2',
                  'Default page: sort the three records and take two.',
                ],
                [
                  'GET /books?limit=1&offset=1',
                  'b2',
                  'Skip b1, then take one; the next offset of 2 returns b3.',
                ],
                [
                  'GET /books?tag=web&limit=1',
                  'b3',
                  'Filter before paginating; slicing before filtering would incorrectly hide this book.',
                ],
                [
                  'GET /books?tag=web&offset=1',
                  '[]',
                  'The filtered list has only one entry; offset 1 is its end.',
                ],
                [
                  'GET /books?limit[value]=1',
                  '400',
                  'simple parsing retains the literal unknown key limit[value]; the allowlist rejects it.',
                ],
                [
                  'GET /books?offset=1&offset=2',
                  '400',
                  'Repeated scalars are ambiguous arrays, not a chosen first or last value.',
                ],
              ],
            },
            {
              id: 'lists-and-pagination-mistake',
              kind: 'paragraph',
              text: 'Common mistake: Slice before filtering and a matching book can disappear from the first filtered page. Sorting the original books array also changes process state; filter creates the copy sorted here. Even stable offset ordering cannot prevent shifts when concurrent inserts/deletes change the dataset. A real API may need cursor/snapshot semantics.',
            },
            {
              id: 'lists-and-pagination-interview',
              kind: 'interview',
              question:
                'Does offset pagination guarantee no duplicates during writes?',
              answer:
                'No. Insertions and deletions can shift offsets. Use a defined stable cursor and ordering key when that matters.',
              followUp:
                'For tag=node, limit=1 and offset=1, which book is returned? Why would slicing before filtering fail for tag=web?',
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
      prompt:
        'Predict GET /books?tag=node&limit=1&offset=1, then change offset to 2. Repair an implementation that slices the full list before filtering. What happens for ?offset[value]=1?',
      context:
        'Original reading-list API exercise. State the assumption and explain the failure boundary before revealing the answer.',
      answer:
        'The responses contain b2, then []. Filter to b1,b2 before taking the requested slice. Apply the tag filter before pagination; otherwise the web book at position 2 can be lost from page zero. The nested-looking offset[value] key is unknown and is rejected with 400.',
      explanation:
        'The offset counts records in the filtered, ID-sorted list. Each request derives a fresh selected array, so paging does not reorder or consume shared data. Repeated or nested input never silently chooses a scalar. Independent requests still do not give a snapshot across concurrent writes.',
      followUp: 'Which test would fail if this boundary were removed?',
    },
  ],
}
