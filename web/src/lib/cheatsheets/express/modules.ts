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
          what: 'Use .mjs for ESM and .cjs for CommonJS when teaching standalone files. ESM has import/export and top-level await; CommonJS has require/module.exports. Package type affects .js.',
          study: {
            id: 'esm-and-commonjs',
            summary:
              'Use .mjs for ESM and .cjs for CommonJS when teaching standalone files. ESM has import/export and top-level await; CommonJS has require/module.exports. Package type affects .js.',
            activityIds: ['esm-and-commonjs-practice'],
          },
          teaching: [
            {
              id: 'esm-and-commonjs-model',
              kind: 'paragraph',
              text: 'Use .mjs for ESM and .cjs for CommonJS when teaching standalone files. ESM has import/export and top-level await; CommonJS has require/module.exports. Package type affects .js.',
            },
            {
              id: 'esm-and-commonjs-example',
              kind: 'code',
              label:
                'Choose an explicit module contract — standalone .mjs / exported factory',
              code: "import { basename } from 'node:path';\nconsole.log(basename('/reading/books.json'));",
            },
            {
              id: 'esm-and-commonjs-trace',
              kind: 'table',
              label: 'Choose an explicit module contract result',
              columns: ['Observation', 'Reasoning'],
              rows: [
                [
                  'books.json: this .mjs file imports a named built-in export.',
                  'Use .mjs for ESM and .cjs for CommonJS when teaching standalone files. ESM has import/export and top-level await; CommonJS has require/module.exports. Package type affects .js.',
                ],
              ],
            },
            {
              id: 'esm-and-commonjs-mistake',
              kind: 'paragraph',
              text: 'Common mistake: Do not assume every require/import interop shape is identical. Pin the package contract; include relative ESM file extensions. Module caches and cycles can expose partially initialized state.',
            },
            {
              id: 'esm-and-commonjs-interview',
              kind: 'interview',
              question: 'Is module state per request?',
              answer:
                'No. A loaded module is reused within its process/module graph. Exported mutable objects can become shared state across requests.',
              followUp:
                'Two modules import a shared Map. Is it shared across separate processes?',
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
        'Two modules import a shared Map. Is it shared across separate processes?',
      context:
        'Original reading-list API exercise. State the assumption and explain the failure boundary before revealing the answer.',
      answer:
        'No. Each process has its own memory and module cache; use an external store when cross-process state is required.',
      explanation:
        'No. Each process has its own memory and module cache; use an external store when cross-process state is required. Do not assume every require/import interop shape is identical. Pin the package contract; include relative ESM file extensions. Module caches and cycles can expose partially initialized state.',
      followUp: 'Which test would fail if this boundary were removed?',
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
