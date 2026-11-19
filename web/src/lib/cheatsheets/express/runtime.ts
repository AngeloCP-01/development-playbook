import type { Section, SheetActivity } from '../types'
export const runtime: { sections: Section[]; activities: SheetActivity[] } = {
  sections: [
    {
      title: 'Runtime and concurrency',
      study: {
        id: 'runtime-and-concurrency',
        label: 'Runtime and concurrency',
        hint: 'Explain the mechanism, change a condition, then repair the program',
      },
      introduction: [
        {
          id: 'runtime-and-concurrency-intro',
          kind: 'paragraph',
          text: 'Start with a book-report request: JavaScript asks for bytes, transforms them and responds. Separate the language, execution engine and host resources before tracing the event loop. All examples target Node 22; .cjs and .mjs labels are part of their contracts.',
        },
      ],
      rows: [
        {
          term: 'Separate language, host and framework',
          what: 'Locate the stack, heap, Node APIs and native work in one file request.',
          study: {
            id: 'node-runtime',
            summary:
              'Locate the stack, heap, Node APIs and native work in one file request.',
            activityIds: ['node-runtime-practice'],
          },
          teaching: [
            {
              id: 'node-runtime-model',
              kind: 'paragraph',
              text: 'JavaScript defines values, functions and promises. V8 executes JavaScript and manages its heap: objects referenced by variables, closures and collections. The call stack holds the JavaScript currently running. Node adds file/socket/process APIs; libuv and the OS arrange native work and callback dispatch. Express later adds HTTP routing, not a second JavaScript engine.',
            },
            {
              id: 'node-runtime-example',
              kind: 'code',
              label: 'layers.cjs — run as an actual file',
              code: "const { readFile } = require('node:fs');\nconst report = { title: 'book' }; // heap object referenced by this module\nconsole.log('start', report.title);\nreadFile(__filename, (error, bytes) => {\n if (error) throw error; // isolated successful-read example\n console.log('file', Buffer.isBuffer(bytes));\n});\nconsole.log('end');",
            },
            {
              id: 'node-runtime-trace',
              kind: 'table',
              label: 'Who owns the file request?',
              columns: [
                'Moment',
                'Active JavaScript',
                'Native work / retained state',
              ],
              rows: [
                [
                  'start book',
                  'Entry stack holds report reference',
                  'V8 heap holds the object; no file read has completed.',
                ],
                [
                  'readFile returns; end prints',
                  'Entry continues without waiting for disk',
                  'Node has requested filesystem work; the callback is retained until completion.',
                ],
                [
                  'file true',
                  'Ready file callback gets the stack',
                  'Native completion supplied bytes; this callback can now inspect the Buffer.',
                ],
              ],
            },
            {
              id: 'node-runtime-sync-example',
              kind: 'code',
              label:
                'sync-layers.cjs — change only the file API and result delivery',
              code: "const { readFileSync } = require('node:fs');\nconst report = { title: 'book' };\nconsole.log('start', report.title);\nconst bytes = readFileSync(__filename);\nconsole.log('file', Buffer.isBuffer(bytes));\nconsole.log('end');",
            },
            {
              id: 'node-runtime-contrast',
              kind: 'paragraph',
              text: 'The synchronous contrast prints start book → file true → end: the file API returns its bytes before JavaScript can continue. The asynchronous version prints end first because its callback waits for dispatch. A browser has a different host API surface; a DOM is not automatically available in Node. Loading Express alone opens no socket.',
            },
            {
              id: 'node-runtime-interview',
              kind: 'interview',
              question:
                'Which component reads the file, and which executes the callback?',
              answer:
                'Node/libuv and the OS arrange the native filesystem operation, normally using the worker pool. V8 executes the callback later on the loop thread when Node dispatches it. The callback is not JavaScript running on the filesystem worker.',
              followUp: 'What remains outstanding after end prints?',
            },
          ],
        },
        {
          term: 'Find what blocks other requests',
          what: 'Watch an async function run a CPU loop before its promise can help.',
          study: {
            id: 'loop-and-pool',
            summary:
              'Watch an async function run a CPU loop before its promise can help.',
            activityIds: ['loop-and-pool-practice'],
          },
          teaching: [
            {
              id: 'loop-and-pool-model',
              kind: 'paragraph',
              text: 'A JavaScript callback keeps its loop thread until it returns or suspends. Marking a function async makes its result a Promise; it does not move the body to another thread. A long synchronous transform delays timers, ready file callbacks and other request handlers on that loop.',
            },
            {
              id: 'loop-and-pool-example',
              kind: 'code',
              label: 'cpu.mjs — finite CPU work, no timing claim',
              code: "setImmediate(() => console.log('heartbeat'));\nasync function checksum() {\n console.log('cpu:start'); let n = 0;\n for (let i = 0; i < 1000; i++) n += i;\n console.log('cpu:end', n); return n;\n}\nconst pending = checksum();\nconsole.log('caller:return');\nawait pending;",
            },
            {
              id: 'loop-and-pool-trace',
              kind: 'table',
              label: 'CPU work and the waiting heartbeat',
              columns: ['Point', 'Stack / ready work', 'Why'],
              rows: [
                [
                  'cpu:start → cpu:end 499500',
                  'checksum owns the JavaScript stack',
                  'No await has suspended it; the loop is ordinary synchronous work.',
                ],
                [
                  'caller:return',
                  'The function has produced its Promise',
                  'The caller regains control only after the CPU loop finishes.',
                ],
                [
                  'heartbeat',
                  'The stack and microtask checkpoint have cleared',
                  'The scheduled immediate can now run; its scheduling did not preempt the loop.',
                ],
              ],
            },
            {
              id: 'loop-and-pool-contrast',
              kind: 'paragraph',
              text: 'By contrast, readFile requests native I/O and returns without a synchronous JavaScript read loop. await Promise.resolve() only schedules a continuation in the microtask machinery; repeatedly doing that is not a fair I/O yield. For finite chunks, yield with setImmediate between batches. For substantial JavaScript CPU work, consider a bounded Worker pool, taught in Work and workers; built-in async I/O usually needs no Worker.',
            },
            {
              id: 'loop-and-pool-interview',
              kind: 'interview',
              question: 'Why can an async route freeze other clients?',
              answer:
                'Everything before suspension is still JavaScript on the request loop. Even after an await, a long synchronous continuation can block it again. Bound input/work, use suitable native async APIs, or offload CPU work with explicit Worker capacity.',
              followUp:
                'Would wrapping checksum in Promise.resolve(checksum()) offload it?',
            },
          ],
        },
        {
          term: 'Overlap independent work deliberately',
          what: 'Contrast a prerequisite chain with bounded independent jobs.',
          study: {
            id: 'parallel-work',
            summary:
              'Contrast a prerequisite chain with bounded independent jobs.',
            activityIds: ['parallel-work-practice'],
          },
          teaching: [
            {
              id: 'parallel-work-model',
              kind: 'paragraph',
              text: 'Concurrency means multiple operations can be outstanding; parallelism means execution at the same time. First load a book ID before reading that book: those operations depend on each other. A book summary and its independent author lookup can start together. Promise.all receives promises from calls already made; it neither starts them nor cancels other calls on rejection. The read function below is a controlled Promise fixture, not native file/network I/O; Work and workers executes the real native APIs.',
            },
            {
              id: 'parallel-work-example',
              kind: 'code',
              label: 'ordering.mjs — dependency versus independent starts',
              code: "const trace = [];\nasync function read(id) { trace.push('start:'+id); await Promise.resolve(); trace.push('done:'+id); return id; }\nconst id = await read('index'); await read(id+':book');\nconsole.log('dependent', trace.join(','));\ntrace.length = 0;\nawait Promise.all([read('book'), read('author')]);\nconsole.log('independent', trace.join(','));",
            },
            {
              id: 'parallel-work-trace',
              kind: 'table',
              label: 'Starting is different from joining',
              columns: ['Case', 'Intermediate state', 'Result'],
              rows: [
                [
                  'Dependent',
                  'index finishes before index:book starts',
                  'The second call can use the first result.',
                ],
                [
                  'Independent',
                  'book and author both start before either continuation',
                  'Their results retain input order when joined; completion order is separate.',
                ],
              ],
            },
            {
              id: 'parallel-work-boundary',
              kind: 'paragraph',
              text: 'Starting 10,000 operations at once can exhaust sockets, memory or downstream capacity. A bounded mapper gives only limit workers permission to claim indices. Claiming an index happens synchronously before await, so each value is assigned once. The repair below waits for all workers to settle before reporting failure; already-started work is not cancelled. It still needs operation deadlines when work can hang. Surviving workers continue claiming remaining jobs; this design does not stop admission at the first error.',
            },
            {
              id: 'parallel-work-interview',
              kind: 'interview',
              question: 'When is sequential await correct?',
              answer:
                'When the next operation needs the previous result or ordering is part of correctness. Otherwise overlap independent work within an explicit capacity budget. Neither Promise.all nor local concurrency limits provide transactions or cross-process limits.',
              followUp:
                'How would you preserve input order if completion order changes?',
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
      prompt:
        'Replace readFile with a synchronous read. Which line moves relative to file completion, and does the callback ever execute on V8’s heap?',
      context:
        'Use the visible Node 22 files and stated context. Make your prediction or repair before opening the solution.',
      answer:
        'end now follows the completed synchronous read. A heap is storage, not a thread; V8 executes JavaScript on a stack while Node/native APIs own the file operation.',
      explanation:
        'In the asynchronous file program end precedes the callback because native completion cannot interrupt the entry stack. Heap references and native resource lifetime are related but different concepts.',
    },
    {
      id: 'loop-and-pool-practice',
      title: 'Find what blocks other requests practice',
      prompt:
        'A report route adds await Promise.resolve() before a ten-million-item sort. Explain what still blocks; choose a bounded repair and what you would measure.',
      context:
        'Use the visible Node 22 files and stated context. Make your prediction or repair before opening the solution.',
      answer:
        'The continuation still sorts synchronously on its loop. Bound the dataset, chunk work with real event-loop yielding where possible, or send a bounded CPU task to Workers.',
      explanation:
        'A microtask continuation is not a CPU offload. Measure CPU/event-loop delay and dependency timings separately; a tiny checksum example establishes ordering, not throughput or a Worker speedup.',
    },
    {
      id: 'parallel-work-practice',
      title: 'Overlap independent work deliberately practice',
      prompt:
        'Implement mapLimit(values, limit, work): invoke work at most limit times concurrently, return results in input order, and wait for all claimed jobs to settle before throwing a failure. Reject an invalid limit.',
      context:
        'Use the visible Node 22 files and stated context. Make your prediction or repair before opening the solution.',
      answer:
        'Use synchronous index claims shared by a fixed number of asynchronous workers. Preserve each result by its original index.',
      explanation:
        'cursor++ happens before any suspension, so workers cannot claim the same index. Promise.allSettled owns all worker rejections and prevents an early caller return while another worker is still running. This is process-local scheduling, not automatic cancellation.',
      starter: {
        label: 'Incomplete interface — implement the body',
        code: 'export async function mapLimit(values, limit, work) { /* TODO */ }',
      },
      solution: {
        label: 'map-limit.mjs — executable reference repair',
        code: "export async function mapLimit(values, limit, work) {\n if (!Number.isInteger(limit) || limit < 1) throw new Error('positive limit required');\n const results = new Array(values.length); let cursor = 0;\n async function worker() {\n  while (cursor < values.length) {\n   const i = cursor++; results[i] = await work(values[i], i);\n  }\n }\n // Wait for every worker to settle before returning or throwing.\n const settled = await Promise.allSettled(Array.from({ length: Math.min(limit, values.length) }, worker));\n const failed = settled.find(result => result.status === 'rejected');\n if (failed) throw failed.reason;\n return results;\n}",
      },
      followUp:
        'If a work call never settles, which additional cancellation/deadline contract is needed?',
    },
  ],
}
