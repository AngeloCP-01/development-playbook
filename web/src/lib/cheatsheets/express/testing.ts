import type { Section, SheetActivity } from '../types'
export const testing: { sections: Section[]; activities: SheetActivity[] } = {
  sections: [
    {
      title: 'Test and debug',
      study: {
        id: 'test-and-debug',
        label: 'Test and debug',
        hint: 'Trace the example, then defend the boundary',
      },
      introduction: [
        {
          id: 'test-and-debug-intro',
          kind: 'paragraph',
          text: 'Choose a topic to inspect its worked example and interview answer. Try the local exercise before revealing its reasoning. Examples use Node 22 JavaScript (.mjs unless explicitly stated) and Express 5.3.0. HTTP factories do not listen until the test or startup owner calls listen.',
        },
      ],
      rows: [
        {
          term: 'Test functions and protocol separately',
          what: 'A pure function test isolates rules. A real HTTP test catches parser, route and response wiring. Give each test its own app, listener and fixture state, then close them in finally.',
          study: {
            id: 'unit-and-http-tests',
            summary:
              'A pure function test isolates rules. A real HTTP test catches parser, route and response wiring. Give each test its own app, listener and fixture state, then close them in finally.',
            activityIds: ['unit-and-http-tests-practice'],
          },
          teaching: [
            {
              id: 'unit-and-http-tests-model',
              kind: 'paragraph',
              text: 'A pure function test isolates rules. A real HTTP test catches parser, route and response wiring. Give each test its own app, listener and fixture state, then close them in finally.',
            },
            {
              id: 'unit-and-http-tests-example',
              kind: 'code',
              label:
                'Test functions and protocol separately — standalone .mjs / exported factory',
              code: "import assert from 'node:assert/strict';\nimport { createServer } from 'node:http';\nfunction validTitle(value) { return typeof value === 'string' && value.trim().length > 0; }\nassert.equal(validTitle('book'), true);\nassert.equal(validTitle('  '), false);\nassert.equal(validTitle(12), false);\nconst server = createServer((req, res) => {\n res.writeHead(200, { 'Content-Type': 'application/json' });\n res.end(JSON.stringify({ title: 'book' }));\n});\nawait new Promise((resolve, reject) => { server.once('error', reject); server.listen(0, '127.0.0.1', resolve); });\ntry {\n const response = await fetch('http://127.0.0.1:' + server.address().port);\n assert.equal(response.status, 200);\n assert.match(response.headers.get('content-type'), /application\\/json/);\n assert.deepEqual(await response.json(), { title: 'book' });\n console.log('rules pass; HTTP passes');\n} finally { server.closeAllConnections(); await new Promise(resolve => server.close(resolve)); }",
            },
            {
              id: 'unit-and-http-tests-trace',
              kind: 'table',
              label: 'Test functions and protocol separately result',
              columns: ['Observation', 'Reasoning'],
              rows: [
                [
                  'rules pass; HTTP passes: independent assertions check the pure validator and a real loopback status, JSON content type and response body. The finally block closes all connections and the server.',
                  'A pure function test isolates rules. A real HTTP test catches parser, route and response wiring. Give each test its own app, listener and fixture state, then close them in finally.',
                ],
              ],
            },
            {
              id: 'unit-and-http-tests-mistake',
              kind: 'paragraph',
              text: 'Common mistake: Mocking res.json everywhere can leave a broken route untested. Combine focused unit checks with real loopback request assertions.',
            },
            {
              id: 'unit-and-http-tests-interview',
              kind: 'interview',
              question: 'Why await the test request?',
              answer:
                'The test must observe completion and failure before cleanup. A floating promise can make a test pass before its assertion runs.',
              followUp: 'What does a parser-after-route mutation expose?',
            },
          ],
        },
        {
          term: 'Choose failures at each boundary',
          what: 'Test malformed bytes, oversized bodies, valid JSON with wrong shape, missing identity, wrong owner, absent resource and rejected dependencies separately. Each exercises a different boundary.',
          study: {
            id: 'failure-matrix',
            summary:
              'Test malformed bytes, oversized bodies, valid JSON with wrong shape, missing identity, wrong owner, absent resource and rejected dependencies separately. Each exercises a different boundary.',
            activityIds: ['failure-matrix-practice'],
          },
          teaching: [
            {
              id: 'failure-matrix-model',
              kind: 'paragraph',
              text: 'Test malformed bytes, oversized bodies, valid JSON with wrong shape, missing identity, wrong owner, absent resource and rejected dependencies separately. Each exercises a different boundary.',
            },
            {
              id: 'failure-matrix-example',
              kind: 'code',
              label:
                'Choose failures at each boundary — standalone .mjs / exported factory',
              code: "const cases = [\n ['malformed JSON', 400], ['oversized JSON', 413],\n ['wrong owner', 403], ['missing book', 404], ['dependency failure', 500]\n];\nconsole.log(cases.map(([name, status]) => `${name}:${status}`).join('|'));",
            },
            {
              id: 'failure-matrix-trace',
              kind: 'table',
              label: 'Choose failures at each boundary result',
              columns: ['Observation', 'Reasoning'],
              rows: [
                [
                  'The matrix distinguishes client syntax, capacity, permission, absence and server failure. Expected statuses are an API policy, not evidence until real requests assert them.',
                  'Test malformed bytes, oversized bodies, valid JSON with wrong shape, missing identity, wrong owner, absent resource and rejected dependencies separately. Each exercises a different boundary.',
                ],
              ],
            },
            {
              id: 'failure-matrix-mistake',
              kind: 'paragraph',
              text: 'Common mistake: Checking only successful responses leaves the data-leak branch and cleanup paths untested. Assert response bodies do not expose secrets on failures.',
            },
            {
              id: 'failure-matrix-interview',
              kind: 'interview',
              question: 'Should every error become 400?',
              answer:
                'No. That hides server failures and destroys operational meaning. Classify trusted validation errors; keep unknown failures generic 500.',
              followUp: 'Which mutation should your ownership test catch?',
            },
          ],
        },
        {
          term: 'Correlate work without leaking credentials',
          what: 'Measure event-loop delay, CPU and downstream timings together. A slow dependency can produce latency without blocking JavaScript. Growing listeners or retained request objects can cause leaks.',
          study: {
            id: 'diagnose-blocking-and-leaks',
            summary:
              'Measure event-loop delay, CPU and downstream timings together. A slow dependency can produce latency without blocking JavaScript. Growing listeners or retained request objects can cause leaks.',
            activityIds: ['diagnose-blocking-and-leaks-practice'],
          },
          teaching: [
            {
              id: 'diagnose-blocking-and-leaks-model',
              kind: 'paragraph',
              text: 'Measure event-loop delay, CPU and downstream timings together. A slow dependency can produce latency without blocking JavaScript. Growing listeners or retained request objects can cause leaks.',
            },
            {
              id: 'diagnose-blocking-and-leaks-example',
              kind: 'code',
              label:
                'Correlate work without leaking credentials — standalone .mjs / exported factory',
              code: "import { AsyncLocalStorage } from 'node:async_hooks';\nconst context = new AsyncLocalStorage();\nawait context.run({ requestId: 'r1' }, async () => {\n await Promise.resolve(); console.log(context.getStore().requestId);\n});\nconsole.log(context.getStore());",
            },
            {
              id: 'diagnose-blocking-and-leaks-trace',
              kind: 'table',
              label: 'Correlate work without leaking credentials result',
              columns: ['Observation', 'Reasoning'],
              rows: [
                [
                  'r1 then undefined: the async continuation carries its context, while the outer scope has no store.',
                  'Measure event-loop delay, CPU and downstream timings together. A slow dependency can produce latency without blocking JavaScript. Growing listeners or retained request objects can cause leaks.',
                ],
              ],
            },
            {
              id: 'diagnose-blocking-and-leaks-mistake',
              kind: 'paragraph',
              text: 'Common mistake: AsyncLocalStorage propagates context; it does not redact secrets. Log allowlisted fields, avoid credentials/full bodies, and compare heap/listener trends under repeatable load.',
            },
            {
              id: 'diagnose-blocking-and-leaks-interview',
              kind: 'interview',
              question: 'How do you distinguish CPU blocking from slow I/O?',
              answer:
                'Correlate event-loop delay and CPU profiles with request/dependency spans. Latency alone cannot identify the cause.',
              followUp:
                'A shared emitter gains one listener per request. What evidence helps?',
            },
          ],
        },
      ],
    },
  ],
  activities: [
    {
      id: 'unit-and-http-tests-practice',
      title: 'Test functions and protocol separately practice',
      prompt: 'What does a parser-after-route mutation expose?',
      context:
        'Original reading-list API exercise. State the assumption and explain the failure boundary before revealing the answer.',
      answer:
        'A real POST should stop returning 201. A pure validator test alone cannot detect the wiring defect.',
      explanation:
        'A real POST should stop returning 201. A pure validator test alone cannot detect the wiring defect. Mocking res.json everywhere can leave a broken route untested. Combine focused unit checks with real loopback request assertions.',
      followUp: 'Which test would fail if this boundary were removed?',
    },
    {
      id: 'failure-matrix-practice',
      title: 'Choose failures at each boundary practice',
      prompt: 'Which mutation should your ownership test catch?',
      context:
        'Original reading-list API exercise. State the assumption and explain the failure boundary before revealing the answer.',
      answer:
        'Removing or reversing the owner comparison must let a forbidden test fail. Include both allowed and denied branches so deny-all also fails.',
      explanation:
        'Removing or reversing the owner comparison must let a forbidden test fail. Include both allowed and denied branches so deny-all also fails. Checking only successful responses leaves the data-leak branch and cleanup paths untested. Assert response bodies do not expose secrets on failures.',
      followUp: 'Which test would fail if this boundary were removed?',
    },
    {
      id: 'diagnose-blocking-and-leaks-practice',
      title: 'Correlate work without leaking credentials practice',
      prompt:
        'A shared emitter gains one listener per request. What evidence helps?',
      context:
        'Original reading-list API exercise. State the assumption and explain the failure boundary before revealing the answer.',
      answer:
        'Track listener count after completion and take heap snapshots under controlled load. Confirm cleanup rather than only raising the listener-warning threshold.',
      explanation:
        'Track listener count after completion and take heap snapshots under controlled load. Confirm cleanup rather than only raising the listener-warning threshold. AsyncLocalStorage propagates context; it does not redact secrets. Log allowlisted fields, avoid credentials/full bodies, and compare heap/listener trends under repeatable load.',
      followUp: 'Which test would fail if this boundary were removed?',
    },
  ],
}
