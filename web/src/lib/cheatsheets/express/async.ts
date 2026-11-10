import type { Section, SheetActivity } from '../types'
export const async: { sections: Section[]; activities: SheetActivity[] } = {
  sections: [
    {
      title: 'Async and events',
      study: {
        id: 'async-and-events',
        label: 'Async and events',
        hint: 'Explain the mechanism, change a condition, then repair the program',
      },
      introduction: [
        {
          id: 'async-and-events-intro',
          kind: 'paragraph',
          text: 'Follow one result through an error-first callback, a Promise and await. Then identify who owns a rejection or listener after the initiating function returns. Import syntax is shown; general JavaScript Promise syntax has a companion JavaScript reference.',
        },
      ],
      rows: [
        {
          term: 'Bridge one operation across three interfaces',
          what: 'Keep the same file operation and error owner while changing how the result is delivered.',
          study: {
            id: 'callbacks-to-await',
            summary:
              'Keep the same file operation and error owner while changing how the result is delivered.',
            activityIds: ['callbacks-to-await-practice'],
          },
          teaching: [
            {
              id: 'callbacks-to-await-model',
              kind: 'paragraph',
              text: 'An error-first callback receives either error or value later. Returning from that callback does not return from the function that scheduled it. A Promise stores one eventual outcome; await suspends its async continuation until that Promise settles. Wrapping fs does not move the file work to V8 or make the file operation synchronous.',
            },
            {
              id: 'callbacks-to-await-example',
              kind: 'code',
              label: 'read-text.mjs — visible callback and Promise adapters',
              code: "import { readFile } from 'node:fs';\nexport function readText(path, done) { readFile(path, 'utf8', done); }\nexport function readTextPromise(path) {\n return new Promise((resolve, reject) => {\n  readText(path, (error, value) => error ? reject(error) : resolve(value));\n });\n}",
            },
            {
              id: 'callbacks-consumer-example',
              kind: 'code',
              label: 'read-demo.mjs — same input through all three forms',
              code: "import { mkdtemp, writeFile, rm } from 'node:fs/promises';\nimport { tmpdir } from 'node:os';\nimport { join } from 'node:path';\nimport { readText, readTextPromise } from './read-text.mjs';\nconst dir = await mkdtemp(join(tmpdir(), 'book-report-'));\ntry {\n const path = join(dir, 'book.txt'); await writeFile(path, 'book');\n await new Promise((resolve, reject) => readText(path, (error, value) => {\n  if (error) return reject(error); console.log('callback', value); resolve();\n }));\n await readTextPromise(path).then(value => console.log('promise', value));\n const value = await readTextPromise(path); console.log('await', value);\n} finally { await rm(dir, { recursive: true, force: true }); }",
            },
            {
              id: 'callback-promise-trace',
              kind: 'table',
              label: 'Same file, different continuation interface',
              columns: ['Form', 'Where the value arrives', 'Failure owner'],
              rows: [
                [
                  'Callback',
                  'done(null, book) after native completion',
                  'The callback must check error before using value.',
                ],
                [
                  'Promise',
                  'The callback resolves the wrapper once',
                  'reject(error) makes the Promise consumer responsible.',
                ],
                [
                  'await',
                  'The async continuation resumes with book',
                  'try/catch around the await can handle its rejection.',
                ],
              ],
            },
            {
              id: 'callback-error-boundary',
              kind: 'paragraph',
              text: 'The demo prints callback book, promise book, await book because it explicitly waits between forms. Remove a file and fs reports an asynchronous callback error: a try/catch around readText(...) alone cannot catch it. The Promise executor does catch a synchronous throw while calling an adapter, but a throw inside a later callback is outside that executor stack. Reject or forward that callback error explicitly.',
            },
            {
              id: 'callbacks-to-await-interview',
              kind: 'interview',
              question: 'What changes when callback code becomes await code?',
              answer:
                'The result-delivery and error-consumption interface changes. The underlying file work and need for cleanup do not. A Promise adapter must resolve/reject from the callback, and the caller must await or return it.',
              followUp:
                'Why does return value inside done fail to return from readText?',
            },
          ],
        },
        {
          term: 'Return the work whose failure matters',
          what: 'Trace rejection through await/finally and contrast a deliberately detached operation with its own owner.',
          study: {
            id: 'promise-control',
            summary:
              'Trace rejection through await/finally and contrast a deliberately detached operation with its own owner.',
            activityIds: ['promise-control-practice'],
          },
          teaching: [
            {
              id: 'promise-control-model',
              kind: 'paragraph',
              text: 'An async function returns a Promise. Awaiting or returning a dependency connects its failure to that Promise. A detached task has a different lifetime and needs an explicit rejection owner. finally releases resources on either outcome; it does not cancel unrelated work.',
            },
            {
              id: 'promise-control-example',
              kind: 'code',
              label: 'release.mjs — rejection passes through finally',
              code: "const trace = [];\nasync function work() {\n try { return await Promise.reject(new Error('offline')); }\n finally { trace.push('released'); }\n}\ntry { await work(); } catch (error) { console.log(error.message, trace[0]); }",
            },
            {
              id: 'promise-control-trace',
              kind: 'table',
              label: 'Returned work and cleanup',
              columns: ['Moment', 'State', 'Why'],
              rows: [
                [
                  'Dependency rejects',
                  'work is suspended on its Promise',
                  'Control enters finally before the caller receives the rejection.',
                ],
                [
                  'finally completes',
                  'trace contains released',
                  'The same failure continues to the caller; cleanup did not turn it into success.',
                ],
                [
                  'Caller catches',
                  'offline released',
                  'The caller owns the awaited failure.',
                ],
              ],
            },
            {
              id: 'detached-owned-example',
              kind: 'code',
              label:
                'detached.mjs — explicit owner, different completion contract',
              code: "function schedule() {\n Promise.reject(new Error('late')).catch(error => console.log('owned', error.message));\n}\nschedule(); console.log('returned');",
            },
            {
              id: 'promise-control-contrast',
              kind: 'paragraph',
              text: 'Detached output is returned then owned late: schedule returned before its task outcome was handled. A surrounding try/catch cannot substitute for the attached catch. If completion is needed for the response or transaction, return/await the work instead of hiding it in a background task. Promise.all rejects early but does not stop its other operations; use cancellation-aware APIs when that is part of the contract.',
            },
            {
              id: 'promise-control-interview',
              kind: 'interview',
              question:
                'Can returning a Promise and returning its resolved value look the same to an await caller?',
              answer:
                'Yes, async return adopts the outcome. But return await inside try/finally is important when cleanup must happen after the operation settles; without awaiting there, finally can run before that work completes.',
              followUp:
                'Which operation actually stops if a response timeout merely stops waiting?',
            },
          ],
        },
        {
          term: 'Own listener lifetime',
          what: 'Trace synchronous dispatch, a once handler and deferred work, then remove only the listener you own.',
          study: {
            id: 'events-and-cleanup',
            summary:
              'Trace synchronous dispatch, a once handler and deferred work, then remove only the listener you own.',
            activityIds: ['events-and-cleanup-practice'],
          },
          teaching: [
            {
              id: 'events-and-cleanup-model',
              kind: 'paragraph',
              text: 'EventEmitter is synchronous dispatch: emit calls registered listeners in order and does not await their returned Promises. once unregisters before invoking its listener. A later async action started by a listener is separate work whose failure needs ownership. A shared emitter also retains its listener closures until they are removed.',
            },
            {
              id: 'events-and-cleanup-example',
              kind: 'code',
              label: 'dispatch.mjs — no hidden async completion barrier',
              code: "import { EventEmitter } from 'node:events';\nconst bus = new EventEmitter(); const seen = [];\nfunction persistent(id) { seen.push('on:'+id); }\nbus.on('book', persistent);\nbus.once('book', id => { seen.push('once:'+id); setImmediate(() => console.log('deferred', id)); });\nbus.emit('book', 1); seen.push('after:emit');\nbus.off('book', persistent); bus.emit('book', 2);\nconsole.log(seen.join(','), bus.listenerCount('book'));",
            },
            {
              id: 'emitter-trace',
              kind: 'table',
              label: 'Listener and deferred-work lifetime',
              columns: ['Moment', 'State', 'Consequence'],
              rows: [
                [
                  'First emit',
                  'on:1 then once:1 execute on the caller stack',
                  'after:emit is recorded only after both listeners return.',
                ],
                [
                  'Removal',
                  'once already removed; off removes persistent',
                  'Second emission reaches neither; listenerCount(book) is zero.',
                ],
                [
                  'Later check work',
                  'The once handler’s immediate is still scheduled',
                  'deferred 1 runs even though that listener is gone.',
                ],
              ],
            },
            {
              id: 'emitter-errors',
              kind: 'paragraph',
              text: 'An error emission is its own channel: install an error listener or an unhandled error throws and can terminate the process. An async listener rejection is not automatically an error event or part of emit’s return value under default behavior. Catch it in the listener-owned task or choose an explicit supported capture policy. Do not use removeAllListeners on a bus whose other subscriptions you do not own.',
            },
            {
              id: 'events-and-cleanup-interview',
              kind: 'interview',
              question:
                'Does removing a listener cancel work it already started?',
              answer:
                'No. Removal stops future dispatch to that callback; an existing timer, Promise or request has its own cancellation/lifetime. Keep the handler reference for exact removal and make repeated cleanup safe.',
              followUp:
                'How would you preserve another request’s listener on the same bus?',
            },
          ],
        },
      ],
    },
  ],
  activities: [
    {
      id: 'callbacks-to-await-practice',
      title: 'Bridge one operation across three interfaces practice',
      prompt:
        'Implement fromCallback(read, path). read(path, done) uses the Node error-first callback contract. The returned Promise must resolve with its value, reject callback errors and reject a synchronous throw from read. Do not throw later callback errors.',
      context:
        'Use the visible Node 22 files and stated context. Make your prediction or repair before opening the solution.',
      answer:
        'Resolve or reject inside the callback; let the Promise executor capture a synchronous invocation failure.',
      explanation:
        'The callback owns later delivery; the executor owns only the synchronous call to read. A throw from an asynchronously invoked callback would escape that original stack. Await/return the resulting Promise so its caller owns the outcome.',
      starter: {
        label: 'Incomplete error-first adapter',
        code: 'export function fromCallback(read, path) { /* TODO: return one outcome Promise */ }',
      },
      solution: {
        label: 'from-callback.mjs — executable reference repair',
        code: 'export function fromCallback(read, path) {\n return new Promise((resolve, reject) => {\n  read(path, (error, value) => error ? reject(error) : resolve(value));\n });\n}',
      },
    },
    {
      id: 'promise-control-practice',
      title: 'Return the work whose failure matters practice',
      prompt:
        'Change return await dependency() inside try/finally to return dependency(). If the dependency is still pending, when can cleanup run and which caller still sees rejection?',
      context:
        'Use the visible Node 22 files and stated context. Make your prediction or repair before opening the solution.',
      answer:
        'finally can run immediately as the Promise is returned, before dependency settles. An await caller still receives the adopted rejection, but the resource may have been released too early.',
      explanation:
        'Use return await where the protected operation must finish before finally. A separate detached task needs its own owner and cannot be assumed to complete before an HTTP response.',
    },
    {
      id: 'events-and-cleanup-practice',
      title: 'Own listener lifetime practice',
      prompt:
        'Implement subscribe(bus, ownerId, handle). Deliver only matching book IDs, return idempotent cleanup and preserve other owners’ listeners. Verify no delivery after cleanup.',
      context:
        'Use the visible Node 22 files and stated context. Make your prediction or repair before opening the solution.',
      answer:
        'Capture one named handler and remove exactly that reference on cleanup.',
      explanation:
        'The bus retains the handler closure while subscribed. off removes that ownership path, and the closed flag makes repeated cleanup harmless. It does not cancel already-started asynchronous work or prove that GC has run.',
      starter: {
        label: 'Incomplete subscription contract',
        code: 'export function subscribe(bus, ownerId, handle) { /* TODO: return cleanup */ }',
      },
      solution: {
        label: 'subscribe.mjs — executable reference repair',
        code: "export function subscribe(bus, ownerId, handle) {\n const listener = book => { if (book.ownerId === ownerId) handle(book.id); };\n bus.on('book', listener);\n let closed = false;\n return function cleanup() {\n  if (closed) return; closed = true;\n  bus.off('book', listener);\n };\n}",
      },
    },
  ],
}
