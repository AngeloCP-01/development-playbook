import type { Section, SheetActivity } from '../types'
export const state: { sections: Section[]; activities: SheetActivity[] } = {
  sections: [
    {
      title: 'Data and state',
      study: {
        id: 'data-and-state',
        label: 'Data and state',
        hint: 'Trace the example, then defend the boundary',
      },
      introduction: [
        {
          id: 'data-and-state-intro',
          kind: 'paragraph',
          text: 'Choose a topic to inspect its worked example and interview answer. Try the local exercise before revealing its reasoning. Examples use Node 22 JavaScript (.mjs unless explicitly stated) and Express 5.3.0. HTTP factories do not listen until the test or startup owner calls listen.',
        },
      ],
      rows: [
        {
          term: 'Inject the reading-list repository',
          what: 'Routes translate HTTP. Services enforce application rules. Repositories own storage access. This fixture is a single-process Map, not a database or a durable store.',
          study: {
            id: 'service-boundaries',
            summary:
              'Routes translate HTTP. Services enforce application rules. Repositories own storage access. This fixture is a single-process Map, not a database or a durable store.',
            activityIds: ['service-boundaries-practice'],
          },
          teaching: [
            {
              id: 'service-boundaries-model',
              kind: 'paragraph',
              text: 'Routes translate HTTP. Services enforce application rules. Repositories own storage access. This fixture is a single-process Map, not a database or a durable store.',
            },
            {
              id: 'service-boundaries-example',
              kind: 'code',
              label:
                'Inject the reading-list repository — standalone .mjs / exported factory',
              code: "export function service(repository) { return {\n async read(id) { const book = await repository.find(id); return book ?? null; }\n}; }\nconst fixture = new Map([['b1', { id: 'b1', ownerId: 'u1' }]]);\nconsole.log(await service({ find: async id => fixture.get(id) }).read('b1'));",
            },
            {
              id: 'service-boundaries-trace',
              kind: 'table',
              label: 'Inject the reading-list repository result',
              columns: ['Observation', 'Reasoning'],
              rows: [
                [
                  'The service returns b1 from the injected fixture. A missing lookup returns null rather than inventing an HTTP status.',
                  'Routes translate HTTP. Services enforce application rules. Repositories own storage access. This fixture is a single-process Map, not a database or a durable store.',
                ],
              ],
            },
            {
              id: 'service-boundaries-mistake',
              kind: 'paragraph',
              text: 'Common mistake: Importing a global connection into every route hides dependencies and couples tests to production startup. Keep wiring at the application boundary.',
            },
            {
              id: 'service-boundaries-interview',
              kind: 'interview',
              question: 'Where does a database error become HTTP 500?',
              answer:
                'At the HTTP error boundary. The repository reports storage failure; the route/service must not disguise failure as a successful empty list.',
              followUp:
                'How do you test dependency failure without a live database?',
            },
          ],
        },
        {
          term: 'Reproduce an await race',
          what: 'A single JavaScript thread can still race across await. Each continuation can act on a stale read. Module state is process-local and disappears on restart.',
          study: {
            id: 'process-state',
            summary:
              'A single JavaScript thread can still race across await. Each continuation can act on a stale read. Module state is process-local and disappears on restart.',
            activityIds: ['process-state-practice'],
          },
          teaching: [
            {
              id: 'process-state-model',
              kind: 'paragraph',
              text: 'A single JavaScript thread can still race across await. Each continuation can act on a stale read. Module state is process-local and disappears on restart.',
            },
            {
              id: 'process-state-example',
              kind: 'code',
              label:
                'Reproduce an await race — standalone .mjs / exported factory',
              code: 'let count = 0;\nasync function increment() { const previous = count; await Promise.resolve(); count = previous + 1; }\nawait Promise.all([increment(), increment()]);\nconsole.log(count);',
            },
            {
              id: 'process-state-trace',
              kind: 'table',
              label: 'Reproduce an await race result',
              columns: ['Observation', 'Reasoning'],
              rows: [
                [
                  '1 rather than 2: both operations read zero before either resumed to write.',
                  'A single JavaScript thread can still race across await. Each continuation can act on a stale read. Module state is process-local and disappears on restart.',
                ],
              ],
            },
            {
              id: 'process-state-mistake',
              kind: 'paragraph',
              text: 'Common mistake: Assuming single-threaded means race-free loses updates. Local locks do not coordinate independent processes or provide durability.',
            },
            {
              id: 'process-state-interview',
              kind: 'interview',
              question: 'Can moving the Map to another module fix the race?',
              answer:
                'No. Module organization does not make read-modify-write atomic. Use an appropriate atomic storage operation or transaction for shared durable state.',
              followUp:
                'Four workers each enforce a local limit of ten. Is the global limit ten?',
            },
          ],
        },
        {
          term: 'Define a durable deduplication contract',
          what: 'A transaction groups writes so they commit together. A uniqueness constraint arbitrates duplicate keys under concurrency. An idempotency record must bind the key to the request and committed result.',
          study: {
            id: 'atomicity-and-retries',
            summary:
              'A transaction groups writes so they commit together. A uniqueness constraint arbitrates duplicate keys under concurrency. An idempotency record must bind the key to the request and committed result.',
            activityIds: ['atomicity-and-retries-practice'],
          },
          teaching: [
            {
              id: 'atomicity-and-retries-model',
              kind: 'paragraph',
              text: 'A transaction groups writes so they commit together. A uniqueness constraint arbitrates duplicate keys under concurrency. An idempotency record must bind the key to the request and committed result.',
            },
            {
              id: 'atomicity-and-retries-example',
              kind: 'code',
              label:
                'Define a durable deduplication contract — standalone .mjs / exported factory',
              code: '// Interface-only repository sketch; no database driver is implied.\n// transaction(async tx => {\n//   const existing = await tx.lookupKey(ownerId, key);\n//   if (existing) return tx.sameRequestOrConflict(existing, input);\n//   const book = await tx.insertBook(input);\n//   await tx.saveKeyAndResult(ownerId, key, input, book);\n//   return book;\n// });',
            },
            {
              id: 'atomicity-and-retries-trace',
              kind: 'table',
              label: 'Define a durable deduplication contract result',
              columns: ['Observation', 'Reasoning'],
              rows: [
                [
                  'The repository must enforce a unique owner/key and atomically commit the book with its result record. A conflicting concurrent transaction retries or reads the committed result.',
                  'A transaction groups writes so they commit together. A uniqueness constraint arbitrates duplicate keys under concurrency. An idempotency record must bind the key to the request and committed result.',
                ],
              ],
            },
            {
              id: 'atomicity-and-retries-mistake',
              kind: 'paragraph',
              text: 'Common mistake: A Map cache before a write can lose keys on crash or diverge across workers. It cannot provide distributed exactly-once effects.',
            },
            {
              id: 'atomicity-and-retries-interview',
              kind: 'interview',
              question:
                'Why store a request fingerprint with an idempotency key?',
              answer:
                'Reusing a key for different input must conflict rather than silently returning an unrelated result. Define retention and retry behavior too.',
              followUp:
                'A payment provider is outside your DB transaction. What remains unresolved?',
            },
          ],
        },
      ],
    },
  ],
  activities: [
    {
      id: 'service-boundaries-practice',
      title: 'Inject the reading-list repository practice',
      prompt: 'How do you test dependency failure without a live database?',
      context:
        'Original reading-list API exercise. State the assumption and explain the failure boundary before revealing the answer.',
      answer:
        'Inject a repository whose method rejects, send a real local request, then assert generic 500 and resource cleanup.',
      explanation:
        'Inject a repository whose method rejects, send a real local request, then assert generic 500 and resource cleanup. Importing a global connection into every route hides dependencies and couples tests to production startup. Keep wiring at the application boundary.',
      followUp: 'Which test would fail if this boundary were removed?',
    },
    {
      id: 'process-state-practice',
      title: 'Reproduce an await race practice',
      prompt:
        'Four workers each enforce a local limit of ten. Is the global limit ten?',
      context:
        'Original reading-list API exercise. State the assumption and explain the failure boundary before revealing the answer.',
      answer:
        'No. Independent memory can permit forty aggregate operations; use coordinated state for a global policy.',
      explanation:
        'No. Independent memory can permit forty aggregate operations; use coordinated state for a global policy. Assuming single-threaded means race-free loses updates. Local locks do not coordinate independent processes or provide durability.',
      followUp: 'Which test would fail if this boundary were removed?',
    },
    {
      id: 'atomicity-and-retries-practice',
      title: 'Define a durable deduplication contract practice',
      prompt:
        'A payment provider is outside your DB transaction. What remains unresolved?',
      context:
        'Original reading-list API exercise. State the assumption and explain the failure boundary before revealing the answer.',
      answer:
        'Atomicity across the external effect and local record. Use provider idempotency plus a durable workflow/outbox and reconciliation; do not promise exactly-once from this sketch.',
      explanation:
        'Atomicity across the external effect and local record. Use provider idempotency plus a durable workflow/outbox and reconciliation; do not promise exactly-once from this sketch. A Map cache before a write can lose keys on crash or diverge across workers. It cannot provide distributed exactly-once effects.',
      followUp: 'Which test would fail if this boundary were removed?',
    },
  ],
}
