import type { Section, SheetActivity } from '../types'
export const modules: { sections: Section[]; activities: SheetActivity[] } = {
  sections: [
    {
      title: 'Modules and packages',
      study: {
        id: 'modules-and-packages',
        label: 'Modules and packages',
        hint: 'Trace the example, then defend the boundary',
      },
      introduction: [
        {
          id: 'modules-and-packages-intro',
          kind: 'paragraph',
          text: 'Choose a topic to inspect its worked example and interview answer. Try the local exercise before revealing its reasoning. Examples use Node 22 JavaScript (.mjs unless explicitly stated) and Express 5.3.0. HTTP factories do not listen until the test or startup owner calls listen.',
        },
      ],
      rows: [
        {
          term: 'Choose an explicit module contract',
          what: 'Load small ESM and CommonJS files twice, then trace an unfinished CommonJS export through a cycle.',
          study: {
            id: 'esm-and-commonjs',
            summary:
              'Load small ESM and CommonJS files twice, then trace an unfinished CommonJS export through a cycle.',
            activityIds: ['esm-and-commonjs-practice'],
          },
          teaching: [
            {
              id: 'esm-and-commonjs-model',
              kind: 'paragraph',
              text: 'Save each labelled block as its own file in one directory. Run node main.mjs, node main.cjs and node a.cjs separately in Node 22. Explicit extensions select the module system regardless of package type. Each entry runs in a fresh process; caching below is inside one process, not shared storage.',
            },
            {
              id: 'esm-counter-file',
              kind: 'code',
              label: 'counter.mjs — named ESM exports',
              code: 'export let count = 0;\nexport function next() { return ++count; }',
            },
            {
              id: 'esm-and-commonjs-example',
              kind: 'code',
              label: 'main.mjs — two imports of the same module URL',
              code: "import { count, next } from './counter.mjs';\nimport { count as again } from './counter.mjs';\nnext();\nconsole.log('esm', count, again);",
            },
            {
              id: 'esm-binding-trace',
              kind: 'paragraph',
              text: 'Output: esm 1 1. The two imports resolve to the same module URL, so its initializer runs once. count and again are live views of the same exported binding: next changes the value seen through both. Imports cannot be assigned by the consumer; the exporting module owns the update. Include .mjs on these relative imports.',
            },
            {
              id: 'cjs-counter-file',
              kind: 'code',
              label:
                'counter.cjs — replace module.exports with the public object',
              code: 'let count = 0;\nmodule.exports = { next() { return ++count; } };',
            },
            {
              id: 'cjs-main-file',
              kind: 'code',
              label: 'main.cjs — require uses its resolved-filename cache',
              code: "const first = require('./counter.cjs');\nconst second = require('./counter.cjs');\nconsole.log('cjs', first.next(), second.next(), first === second);",
            },
            {
              id: 'cjs-cache-trace',
              kind: 'paragraph',
              text: 'Output: cjs 1 2 true. Both requires resolve to the same filename and return the cached object, including its closure over count. This is why mutable module state can be shared by requests. A separate process starts its own counter; another resolved filename can also create a different module instance. ESM and CommonJS have different loading/cache machinery; this example does not assume interchangeable require/import interop.',
            },
            {
              id: 'cjs-cycle-a-file',
              kind: 'code',
              label: 'a.cjs — publishes an initial value before requiring b',
              code: "exports.ready = false;\nconst b = require('./b.cjs');\nexports.ready = true;\nconsole.log('cycle', b.sawReady, exports.ready);",
            },
            {
              id: 'cjs-cycle-b-file',
              kind: 'code',
              label: 'b.cjs — observes a before a finishes',
              code: "const a = require('./a.cjs');\nexports.sawReady = a.ready;",
            },
            {
              id: 'esm-and-commonjs-trace',
              kind: 'table',
              label: 'CommonJS cycle trace: node a.cjs',
              columns: ['Moment', 'State', 'Consequence'],
              rows: [
                [
                  'a begins',
                  'a.ready = false',
                  'a enters the cache before its evaluation finishes.',
                ],
                [
                  'a requires b; b requires a',
                  'b receives unfinished a exports',
                  'b snapshots false into sawReady.',
                ],
                [
                  'b returns; a resumes',
                  'a.ready = true',
                  'Output is cycle false true; the snapshot does not update.',
                ],
              ],
            },
            {
              id: 'esm-and-commonjs-mistake',
              kind: 'paragraph',
              text: 'Common mistake: exports = { next } only rebinds the local shortcut; it does not replace module.exports. Use exports.next = next to add a property, or module.exports = { next } to replace the public object. Avoid depending on partially initialized cycles: move shared initialization into a third module or pass dependencies explicitly. ESM cycles use live bindings and can throw on access before initialization, so do not transfer this CommonJS snapshot trace to ESM.',
            },
            {
              id: 'esm-and-commonjs-interview',
              kind: 'interview',
              question:
                'Why do two requests sometimes see the same module counter?',
              answer:
                'Within a process, loading the same resolved module can reuse its state. The ESM example reuses a module URL and exposes live bindings; the CommonJS example returns the same cached exports object. Neither cache makes that state durable or shared across processes.',
              followUp:
                'Which value did b snapshot before a finished, and what dependency change would remove the cycle?',
            },
          ],
        },
        {
          term: 'Distinguish install and runtime dependencies',
          what: 'Dependencies are packages needed at runtime; devDependencies support development and checks. A lockfile records a resolved dependency graph. Scripts are named commands, not Node module resolution rules.',
          study: {
            id: 'package-contracts',
            summary:
              'Dependencies are packages needed at runtime; devDependencies support development and checks. A lockfile records a resolved dependency graph. Scripts are named commands, not Node module resolution rules.',
            activityIds: ['package-contracts-practice'],
          },
          teaching: [
            {
              id: 'package-contracts-model',
              kind: 'paragraph',
              text: 'Dependencies are packages needed at runtime; devDependencies support development and checks. A lockfile records a resolved dependency graph. Scripts are named commands, not Node module resolution rules.',
            },
            {
              id: 'package-contracts-example',
              kind: 'code',
              label:
                'Distinguish install and runtime dependencies — standalone .mjs / exported factory',
              code: "import { mkdtemp, writeFile, readFile, rm } from 'node:fs/promises';\nimport { tmpdir } from 'node:os';\nimport { join } from 'node:path';\nconst dir = await mkdtemp(join(tmpdir(), 'package-contract-'));\ntry {\n const manifest = { type: 'module', scripts: { test: 'node --test' }, dependencies: { express: '^5.3.0' }, devDependencies: { typescript: '5.9.3' } };\n await writeFile(join(dir, 'package.json'), JSON.stringify(manifest));\n const installedContract = JSON.parse(await readFile(join(dir, 'package.json'), 'utf8'));\n console.log(installedContract.type, installedContract.scripts.test, installedContract.dependencies.express);\n} finally { await rm(dir, { recursive: true, force: true }); }\n// ^5.3.0 permits >=5.3.0 <6.0.0 under normal semver rules.\n// npm ci requires a matching package-lock.json and removes existing node_modules.\n// This filesystem demo does not install packages or simulate npm's resolver.",
            },
            {
              id: 'package-contracts-trace',
              kind: 'table',
              label: 'Distinguish install and runtime dependencies result',
              columns: ['Observation', 'Reasoning'],
              rows: [
                [
                  'The temporary package.json round-trips module, node --test and ^5.3.0. The caret permits compatible major-5 updates; a committed lockfile records exact resolutions. This example performs no install.',
                  'Dependencies are packages needed at runtime; devDependencies support development and checks. A lockfile records a resolved dependency graph. Scripts are named commands, not Node module resolution rules.',
                ],
              ],
            },
            {
              id: 'package-contracts-mistake',
              kind: 'paragraph',
              text: 'Common mistake: A caret range can resolve a newer compatible release on a fresh resolution. Commit a lockfile; npm ci rejects package/lock disagreement and performs a clean locked install. This repository uses pnpm.',
            },
            {
              id: 'package-contracts-interview',
              kind: 'interview',
              question: 'Does a lockfile prevent all supply-chain risk?',
              answer:
                'No. It makes resolution repeatable, but the locked package itself may be vulnerable or malicious. Review updates and test the installed graph.',
              followUp:
                'Should Express used only by example tests be a production dependency here?',
            },
          ],
        },
        {
          term: 'Reject invalid configuration before listening',
          what: 'Environment variables are strings or absent. Parse and bound configuration once during startup; do not discover invalid settings after accepting requests.',
          study: {
            id: 'configuration',
            summary:
              'Environment variables are strings or absent. Parse and bound configuration once during startup; do not discover invalid settings after accepting requests.',
            activityIds: ['configuration-practice'],
          },
          teaching: [
            {
              id: 'configuration-model',
              kind: 'paragraph',
              text: 'Environment variables are strings or absent. Parse and bound configuration once during startup; do not discover invalid settings after accepting requests.',
            },
            {
              id: 'configuration-example',
              kind: 'code',
              label:
                'Reject invalid configuration before listening — standalone .mjs / exported factory',
              code: "function port(value) {\n if (typeof value !== 'string' || !/^\\d+$/.test(value)) throw new Error('PORT required');\n const n = Number(value);\n if (!Number.isInteger(n) || n < 1 || n > 65535) throw new Error('PORT range');\n return n;\n}\nconsole.log(port('3200'));",
            },
            {
              id: 'configuration-trace',
              kind: 'table',
              label: 'Reject invalid configuration before listening result',
              columns: ['Observation', 'Reasoning'],
              rows: [
                [
                  '3200 is a number; empty strings, decimals and out-of-range values are rejected.',
                  'Environment variables are strings or absent. Parse and bound configuration once during startup; do not discover invalid settings after accepting requests.',
                ],
              ],
            },
            {
              id: 'configuration-mistake',
              kind: 'paragraph',
              text: "Common mistake: Number('') is zero and parseInt accepts trailing junk. Validate the full representation before conversion. Never print secret configuration values.",
            },
            {
              id: 'configuration-interview',
              kind: 'interview',
              question: 'Why fail before listen?',
              answer:
                'An invalid process should not advertise readiness or accept partial traffic. Startup validation yields a clear failure rather than scattered request errors.',
              followUp: 'What should happen for PORT=3200oops?',
            },
          ],
        },
      ],
    },
  ],
  activities: [
    {
      id: 'esm-and-commonjs-practice',
      title: 'Choose an explicit module contract practice',
      prompt:
        "Predict main.cjs after adding a third require and calling its next once. In a.cjs, move exports.ready = true before require('./b.cjs'): what changes? Explain what breaks if counter.cjs assigns exports = { next() { return ++count; } } instead.",
      context:
        'Use the six visible files. Each command starts a fresh process. Predict the cache and cycle states before opening the explanation.',
      answer:
        'A third require of the same counter.cjs returns the cached object; its next call returns 3. Moving ready = true before loading b makes node a.cjs print cycle true true. Assigning a new object to exports alone leaves module.exports unchanged, so the consumer receives an object without next.',
      explanation:
        'Require caches by resolved filename, not by the local variable name. The cycle exposes the value already published at the moment b reads it. Fix the broken public assignment with module.exports = { next() { return ++count; } }, or attach next to the existing exports object. Refactoring shared initialization out of the cycle is safer than relying on load order.',
      followUp:
        'Would a second OS process continue at 4? Why does the ESM alias count update while the CommonJS sawReady snapshot stays false?',
    },
    {
      id: 'package-contracts-practice',
      title: 'Distinguish install and runtime dependencies practice',
      prompt:
        'Should Express used only by example tests be a production dependency here?',
      context:
        'Original reading-list API exercise. State the assumption and explain the failure boundary before revealing the answer.',
      answer:
        'No. This static reference imports teaching data only. Express belongs in exact devDependencies for verification.',
      explanation:
        'No. This static reference imports teaching data only. Express belongs in exact devDependencies for verification. A caret range can resolve a newer compatible release on a fresh resolution. Commit a lockfile; npm ci rejects package/lock disagreement and performs a clean locked install. This repository uses pnpm.',
      followUp: 'Which test would fail if this boundary were removed?',
    },
    {
      id: 'configuration-practice',
      title: 'Reject invalid configuration before listening practice',
      prompt: 'What should happen for PORT=3200oops?',
      context:
        'Original reading-list API exercise. State the assumption and explain the failure boundary before revealing the answer.',
      answer:
        'Reject startup. Do not silently accept the numeric prefix or fall back to a surprising port.',
      explanation:
        "Reject startup. Do not silently accept the numeric prefix or fall back to a surprising port. Number('') is zero and parseInt accepts trailing junk. Validate the full representation before conversion. Never print secret configuration values.",
      followUp: 'Which test would fail if this boundary were removed?',
    },
  ],
}
