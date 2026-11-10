import type { Section, SheetActivity } from '../types'
export const workers: { sections: Section[]; activities: SheetActivity[] } = {
  sections: [
    {
      title: 'Work and workers',
      study: {
        id: 'work-and-workers',
        label: 'Work and workers',
        hint: 'Explain the mechanism, change a condition, then repair the program',
      },
      introduction: [
        {
          id: 'work-and-workers-intro',
          kind: 'paragraph',
          text: 'Decide where a report’s work actually runs before choosing concurrency. Compare an asynchronous file operation, a CPU callback, a Worker and a child process. The examples demonstrate ownership/messages, not a speed benchmark or a universal pool-size recipe.',
        },
      ],
      rows: [
        {
          term: 'Allocate work to the right mechanism',
          what: 'Distinguish OS socket readiness, native pool jobs and JavaScript CPU work.',
          study: {
            id: 'io-and-worker-pool',
            summary:
              'Distinguish OS socket readiness, native pool jobs and JavaScript CPU work.',
            activityIds: ['io-and-worker-pool-practice'],
          },
          teaching: [
            {
              id: 'io-and-worker-pool-model',
              kind: 'paragraph',
              text: 'The event loop coordinates callbacks on its thread. Nonblocking network sockets usually use OS readiness/completion facilities; they do not need one waiting JavaScript thread per connection. Async filesystem operations and selected crypto/zlib APIs use a native worker pool. A Worker thread is different: it owns another JavaScript engine execution thread.',
            },
            {
              id: 'io-and-worker-pool-example',
              kind: 'code',
              label: 'allocation.cjs — real async file and crypto jobs',
              code: "const { readFile } = require('node:fs');\nconst { pbkdf2 } = require('node:crypto');\nconsole.log('submit');\nreadFile(__filename, (error, bytes) => { if (error) throw error; console.log('file', bytes.length > 0); });\npbkdf2('fixture', 'salt', 2, 8, 'sha256', (error, key) => { if (error) throw error; console.log('crypto', key.length); });\nconsole.log('entry:return');",
            },
            {
              id: 'work-allocation-trace',
              kind: 'table',
              label: 'Same API shape, different work owners',
              columns: ['Operation', 'Work owner', 'Where JavaScript resumes'],
              rows: [
                [
                  'readFile / selected crypto API',
                  'Native pool performs supported jobs',
                  'Their callbacks return to the loop thread; completion order here is open.',
                ],
                [
                  'Network socket readiness',
                  'OS poll/completion mechanism with libuv coordination',
                  'A ready callback still waits for a free JavaScript stack.',
                ],
                [
                  'JavaScript checksum or sort',
                  'The thread currently executing it',
                  'Adding async does not put this code into the native pool.',
                ],
              ],
            },
            {
              id: 'pool-boundary',
              kind: 'paragraph',
              text: 'Output begins submit, entry:return; file true and crypto 8 can follow in either order. The tiny PBKDF2 count is only a scheduling fixture, never a password-storage recommendation. This observation does not measure pool internals. Pool capacity is shared by supported jobs in the process; congestion can delay other users of that pool. Changing UV_THREADPOOL_SIZE does not move arbitrary JavaScript into it.',
            },
            {
              id: 'io-and-worker-pool-interview',
              kind: 'interview',
              question:
                'Would creating a Worker for every readFile improve the I/O model?',
              answer:
                'Usually it adds startup/message overhead to an API that already delegates its work asynchronously. Choose Workers for substantial JavaScript CPU work and bound both pool jobs and downstream I/O against actual capacity.',
              followUp:
                'Why can a free event loop still wait on a congested native pool?',
            },
          ],
        },
        {
          term: 'Send a bounded job to a Worker',
          what: 'Run a two-file checksum job with message, error, exit and deadline ownership.',
          study: {
            id: 'worker-threads',
            summary:
              'Run a two-file checksum job with message, error, exit and deadline ownership.',
            activityIds: ['worker-threads-practice'],
          },
          teaching: [
            {
              id: 'worker-threads-model',
              kind: 'paragraph',
              text: 'A Worker runs JavaScript on another thread with its own ordinary heap. postMessage normally structured-clones data; explicit transfer/shared-memory APIs have different contracts. Here a fresh Worker accepts one bounded integer array, returns one result and is terminated by its owner in finally. This is a teaching job, not a production worker pool.',
            },
            {
              id: 'sum-worker-file',
              kind: 'code',
              label: 'sum-worker.mjs — worker-side bounded job',
              code: "import { parentPort } from 'node:worker_threads';\nparentPort.once('message', values => {\n if (!Array.isArray(values) || values.length > 1000 || values.some(n => !Number.isSafeInteger(n) || Math.abs(n) > 1000000)) throw new Error('bounded integers required');\n parentPort.postMessage({ sum: values.reduce((sum, n) => sum + n, 0) });\n});",
            },
            {
              id: 'worker-threads-example',
              kind: 'code',
              label: 'worker-main.mjs — parent owns every terminal path',
              code: "import { Worker } from 'node:worker_threads';\nexport async function runJob(values, url = new URL('./sum-worker.mjs', import.meta.url)) {\n const worker = new Worker(url); let deadline;\n try {\n  return await new Promise((resolve, reject) => {\n   worker.once('message', resolve);\n   worker.once('error', reject);\n   worker.once('exit', code => reject(new Error('exit before result: '+code)));\n   deadline = setTimeout(() => reject(new Error('worker deadline')), 2000);\n   worker.postMessage(values);\n  });\n } finally { clearTimeout(deadline); await worker.terminate(); }\n}\nconsole.log('worker', (await runJob([1, 2, 3])).sum);",
            },
            {
              id: 'worker-state-trace',
              kind: 'table',
              label: 'Worker message and resource ownership',
              columns: ['Moment', 'Parent', 'Worker'],
              rows: [
                [
                  'Create / submit',
                  'Owns a Worker handle and deadline; posts a cloned array',
                  'Loads sum-worker.mjs; waits for one message.',
                ],
                [
                  'Compute / respond',
                  'Can service its own loop while awaiting the result',
                  'Validates bounds, sums in its JavaScript thread, posts {sum:6}.',
                ],
                [
                  'Result / error / early exit / deadline',
                  'Resolves or rejects once; finally terminates and clears deadline',
                  'Its resources are released; a message is not permission to forget cleanup.',
                ],
              ],
            },
            {
              id: 'worker-threads-contrast',
              kind: 'paragraph',
              text: 'Output is worker 6. The parent’s array is not a shared mutable counter: ordinary messages copy data. A thrown worker error reaches the parent error event; exit without a result is also failure. For repeated jobs use a bounded pool rather than a new Worker per tiny array. Startup, cloning/transfer cost and CPU capacity can dominate; no speedup is established by this example.',
            },
            {
              id: 'worker-threads-interview',
              kind: 'interview',
              question: 'Why observe both error and exit?',
              answer:
                'A worker may fail with an error, exit before a result or remain alive without replying. The parent owns rejection, a deadline and termination on every path. A result alone does not establish that all resources are closed.',
              followUp:
                'Would an in-memory Map in this parent become shared automatically?',
            },
          ],
        },
        {
          term: 'Compare a child’s memory boundary',
          what: 'Spawn an actual Node file without shell interpolation and observe independent state.',
          study: {
            id: 'process-isolation',
            summary:
              'Spawn an actual Node file without shell interpolation and observe independent state.',
            activityIds: ['process-isolation-practice'],
          },
          teaching: [
            {
              id: 'process-isolation-model',
              kind: 'paragraph',
              text: 'A child process has a separate OS process, V8 instance and ordinary memory. It can communicate through pipes or IPC; a forked Node process does not inherit a live shared module cache. Asynchronous spawn lets the parent continue; spawnSync/execFileSync block the calling thread and belong only in controlled checks here.',
            },
            {
              id: 'isolated-child-file',
              kind: 'code',
              label: 'report-child.cjs — independent process state',
              code: 'const state = { count: Number(process.argv[2]) };\nstate.count++;\nconsole.log(JSON.stringify(state));',
            },
            {
              id: 'process-isolation-example',
              kind: 'code',
              label:
                'report-parent.mjs — explicit argument array and bounded cleanup',
              code: "import { spawn } from 'node:child_process';\nimport { fileURLToPath } from 'node:url';\nconst state = { count: 1 };\nconst child = spawn(process.execPath, [fileURLToPath(new URL('./report-child.cjs', import.meta.url)), String(state.count)], { stdio: ['ignore', 'pipe', 'pipe'] });\nlet output = '', errors = '';\nchild.stdout.on('data', chunk => output += chunk);\nchild.stderr.on('data', chunk => errors += chunk);\nconst deadline = setTimeout(() => child.kill('SIGKILL'), 2000);\ntry {\n await new Promise((resolve, reject) => {\n  child.once('error', reject);\n  child.once('close', (code, signal) => code === 0 && !signal && !errors ? resolve() : reject(new Error('child failed: '+errors)));\n });\n console.log('child', JSON.parse(output).count, 'parent', state.count);\n} finally { clearTimeout(deadline); if (child.exitCode === null && child.signalCode === null) child.kill('SIGKILL'); }",
            },
            {
              id: 'process-isolation-trace',
              kind: 'paragraph',
              text: 'Output: child 2 parent 1. Passing 1 as an argument did not share the parent object: the child created and changed its own object. The visible fileURLToPath conversion preserves portable paths. Waiting for close includes output pipes closing; exit alone does not guarantee those pipes have finished. Parse the result only after a successful close.',
            },
            {
              id: 'process-isolation-interview',
              kind: 'interview',
              question:
                'When would a process be a more appropriate boundary than a Worker?',
              answer:
                'When separate process resources/failure isolation or running another executable matters. It costs more memory/startup and still needs supervision, bounded work and owned pipes. Workers suit JavaScript CPU parallelism with a different isolation boundary.',
              followUp:
                'Why should caller input never be concatenated into a shell command?',
            },
          ],
        },
      ],
    },
  ],
  activities: [
    {
      id: 'io-and-worker-pool-practice',
      title: 'Allocate work to the right mechanism practice',
      prompt:
        'A service has low JavaScript CPU but slow file and crypto callbacks; another route has a long synchronous sort. Which bottleneck can a larger native pool address, and which cannot it fix?',
      context:
        'Use the visible Node 22 files and stated context. Make your prediction or repair before opening the solution.',
      answer:
        'Supported native jobs may be waiting for pool capacity; a synchronous JavaScript sort remains on its executing thread.',
      explanation:
        'Measure before changing capacity. More pool threads can increase contention and do not offload arbitrary JavaScript. Bound native jobs; bound/chunk/offload the CPU work separately.',
    },
    {
      id: 'worker-threads-practice',
      title: 'Send a bounded job to a Worker practice',
      prompt:
        'Repair a parent that resolves on message but ignores worker errors, early exit and cleanup. Implement runJob(values, url), using the visible sum-worker.mjs. Reject failure/no result, bound the wait and terminate on every path.',
      context:
        'Use the visible Node 22 files and stated context. Make your prediction or repair before opening the solution.',
      answer:
        'Own message, error, exit and a deadline in one result Promise, then terminate in finally.',
      explanation:
        'A Worker can exit without replying or fail while processing a cloned input. The parent owns those outcomes and resource cleanup. Terminating after the result prevents a message-port/listener leak; this one-job fixture is not a pool or a speed claim.',
      starter: {
        label: 'Incomplete Worker parent — use visible sum-worker.mjs',
        code: 'export async function runJob(values, url) { /* TODO: result, failure, deadline, cleanup */ }',
      },
      solution: {
        label: 'worker-repair.mjs — executable reference parent',
        code: "import { Worker } from 'node:worker_threads';\nexport async function runJob(values, url = new URL('./sum-worker.mjs', import.meta.url)) {\n const worker = new Worker(url); let deadline;\n try {\n  return await new Promise((resolve, reject) => {\n   worker.once('message', resolve);\n   worker.once('error', reject);\n   worker.once('exit', code => reject(new Error('exit before result: '+code)));\n   deadline = setTimeout(() => reject(new Error('worker deadline')), 2000);\n   worker.postMessage(values);\n  });\n } finally { clearTimeout(deadline); await worker.terminate(); }\n}",
      },
    },
    {
      id: 'process-isolation-practice',
      title: 'Compare a child’s memory boundary practice',
      prompt:
        'Have the child increment count three times instead. Which parent value changes? What changes if the child exits nonzero after writing partial output?',
      context:
        'Use the visible Node 22 files and stated context. Make your prediction or repair before opening the solution.',
      answer:
        'Only the child’s own count changes. The parent must reject nonzero exit even if stdout contains parseable partial data.',
      explanation:
        'A pipe is communication, not shared memory or a success signal. Own child error/close, bound execution and clean up the process; a partial message must not masquerade as a completed job.',
    },
  ],
}
