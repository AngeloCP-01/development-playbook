import type { Section, SheetActivity } from '../types'
export const io: { sections: Section[]; activities: SheetActivity[] } = {
  sections: [
    {
      title: 'Files and streams',
      study: {
        id: 'files-and-streams',
        label: 'Files and streams',
        hint: 'Trace the example, then defend the boundary',
      },
      introduction: [
        {
          id: 'files-and-streams-intro',
          kind: 'paragraph',
          text: 'Choose a topic to inspect its worked example and interview answer. Try the local exercise before revealing its reasoning. Examples use Node 22 JavaScript (.mjs unless explicitly stated) and Express 5.3.0. HTTP factories do not listen until the test or startup owner calls listen.',
        },
      ],
      rows: [
        {
          term: 'Count bytes rather than letters',
          what: 'A Buffer stores bytes. UTF-8 uses multiple bytes for many characters; JavaScript string length counts UTF-16 code units. Transport limits are generally byte limits.',
          study: {
            id: 'buffers-and-encoding',
            summary:
              'A Buffer stores bytes. UTF-8 uses multiple bytes for many characters; JavaScript string length counts UTF-16 code units. Transport limits are generally byte limits.',
            activityIds: ['buffers-and-encoding-practice'],
          },
          teaching: [
            {
              id: 'buffers-and-encoding-model',
              kind: 'paragraph',
              text: 'A Buffer stores bytes. UTF-8 uses multiple bytes for many characters; JavaScript string length counts UTF-16 code units. Transport limits are generally byte limits.',
            },
            {
              id: 'buffers-and-encoding-example',
              kind: 'code',
              label:
                'Count bytes rather than letters — standalone .mjs / exported factory',
              code: "const text = 'é';\nconsole.log(text.length, Buffer.byteLength(text, 'utf8'));\nconsole.log(Buffer.from(text, 'utf8').toString('utf8'));",
            },
            {
              id: 'buffers-and-encoding-trace',
              kind: 'table',
              label: 'Count bytes rather than letters result',
              columns: ['Observation', 'Reasoning'],
              rows: [
                [
                  '1 2 then é: one code unit becomes two UTF-8 bytes.',
                  'A Buffer stores bytes. UTF-8 uses multiple bytes for many characters; JavaScript string length counts UTF-16 code units. Transport limits are generally byte limits.',
                ],
              ],
            },
            {
              id: 'buffers-and-encoding-mistake',
              kind: 'paragraph',
              text: 'Common mistake: Do not size Content-Length from string.length. Use Buffer.byteLength or let the HTTP library calculate it. Buffer.alloc initializes memory; unsafe allocation requires complete overwrite.',
            },
            {
              id: 'buffers-and-encoding-interview',
              kind: 'interview',
              question:
                'Can you decode each arbitrary stream chunk independently?',
              answer:
                'A multi-byte character may span chunks. Use an incremental decoder or stream encoding support that preserves incomplete sequences.',
              followUp:
                'What byte limit should accept exactly two copies of é?',
            },
          ],
        },
        {
          term: 'Clean up files even on failure',
          what: 'Use asynchronous fs APIs and explicit paths. Temporary directories isolate examples; finally removes them. URL-to-path conversion needs fileURLToPath when starting from import.meta.url.',
          study: {
            id: 'paths-and-files',
            summary:
              'Use asynchronous fs APIs and explicit paths. Temporary directories isolate examples; finally removes them. URL-to-path conversion needs fileURLToPath when starting from import.meta.url.',
            activityIds: ['paths-and-files-practice'],
          },
          teaching: [
            {
              id: 'paths-and-files-model',
              kind: 'paragraph',
              text: 'Use asynchronous fs APIs and explicit paths. Temporary directories isolate examples; finally removes them. URL-to-path conversion needs fileURLToPath when starting from import.meta.url.',
            },
            {
              id: 'paths-and-files-example',
              kind: 'code',
              label:
                'Clean up files even on failure — standalone .mjs / exported factory',
              code: "import { mkdtemp, writeFile, readFile, rm } from 'node:fs/promises';\nimport { tmpdir } from 'node:os';\nimport { join } from 'node:path';\nconst dir = await mkdtemp(join(tmpdir(), 'reading-'));\ntry { const file = join(dir, 'books.txt'); await writeFile(file, 'one'); console.log(await readFile(file, 'utf8')); }\nfinally { await rm(dir, { recursive: true, force: true }); }",
            },
            {
              id: 'paths-and-files-trace',
              kind: 'table',
              label: 'Clean up files even on failure result',
              columns: ['Observation', 'Reasoning'],
              rows: [
                [
                  'one: the write completes before the read and the temporary tree is removed afterwards.',
                  'Use asynchronous fs APIs and explicit paths. Temporary directories isolate examples; finally removes them. URL-to-path conversion needs fileURLToPath when starting from import.meta.url.',
                ],
              ],
            },
            {
              id: 'paths-and-files-mistake',
              kind: 'paragraph',
              text: 'Common mistake: path.normalize is lexical cleanup, not permission checking. Prefer a server-side ID-to-path allowlist; symlinks and filesystem races complicate containment checks.',
            },
            {
              id: 'paths-and-files-interview',
              kind: 'interview',
              question: 'Does async fs mean no threads?',
              answer:
                'Many filesystem operations use the libuv pool. Await releases the JavaScript continuation while native work proceeds, but pool capacity is still finite.',
              followUp:
                'Should a download route join an arbitrary user path to a root?',
            },
          ],
        },
        {
          term: 'Let a slow receiver limit production',
          what: 'Streams move chunks without loading the entire body. When write returns false, pause production until drain. pipeline coordinates backpressure, completion and error cleanup.',
          study: {
            id: 'stream-backpressure',
            summary:
              'Streams move chunks without loading the entire body. When write returns false, pause production until drain. pipeline coordinates backpressure, completion and error cleanup.',
            activityIds: ['stream-backpressure-practice'],
          },
          teaching: [
            {
              id: 'stream-backpressure-model',
              kind: 'paragraph',
              text: 'Streams move chunks without loading the entire body. When write returns false, pause production until drain. pipeline coordinates backpressure, completion and error cleanup.',
            },
            {
              id: 'stream-backpressure-example',
              kind: 'code',
              label:
                'Let a slow receiver limit production — standalone .mjs / exported factory',
              code: "import { Readable, Writable } from 'node:stream';\nimport { pipeline } from 'node:stream/promises';\nconst chunks = [];\nawait pipeline(Readable.from(['book', 'list']), new Writable({\n highWaterMark: 1,\n write(chunk, encoding, done) { chunks.push(chunk.toString()); setImmediate(done); }\n}));\nconsole.log(chunks.join('-'));",
            },
            {
              id: 'stream-backpressure-trace',
              kind: 'table',
              label: 'Let a slow receiver limit production result',
              columns: ['Observation', 'Reasoning'],
              rows: [
                [
                  'book-list appears after both writes finish. The low threshold makes the producer wait for the receiver.',
                  'Streams move chunks without loading the entire body. When write returns false, pause production until drain. pipeline coordinates backpressure, completion and error cleanup.',
                ],
              ],
            },
            {
              id: 'stream-backpressure-mistake',
              kind: 'paragraph',
              text: 'Common mistake: Ignoring write(false) can grow memory. highWaterMark is a pressure threshold, not a hard global memory cap; handle pipeline rejection and client aborts.',
            },
            {
              id: 'stream-backpressure-interview',
              kind: 'interview',
              question: 'Why prefer pipeline to manually chaining data events?',
              answer:
                'It handles flow control and propagates failures across the chain. Manual data listeners often ignore backpressure and leak resources on errors.',
              followUp:
                'A destination fails after the first chunk. What must the caller observe?',
            },
          ],
        },
      ],
    },
  ],
  activities: [
    {
      id: 'buffers-and-encoding-practice',
      title: 'Count bytes rather than letters practice',
      prompt: 'What byte limit should accept exactly two copies of é?',
      context:
        'Original reading-list API exercise. State the assumption and explain the failure boundary before revealing the answer.',
      answer:
        'Four UTF-8 bytes. A character-count limit and a byte-count limit are different contracts.',
      explanation:
        'Four UTF-8 bytes. A character-count limit and a byte-count limit are different contracts. Do not size Content-Length from string.length. Use Buffer.byteLength or let the HTTP library calculate it. Buffer.alloc initializes memory; unsafe allocation requires complete overwrite.',
      followUp: 'Which test would fail if this boundary were removed?',
    },
    {
      id: 'paths-and-files-practice',
      title: 'Clean up files even on failure practice',
      prompt: 'Should a download route join an arbitrary user path to a root?',
      context:
        'Original reading-list API exercise. State the assumption and explain the failure boundary before revealing the answer.',
      answer:
        'Prefer an allowlisted resource ID resolved on the server, then enforce authorization. Joining a path alone does not establish access rights.',
      explanation:
        'Prefer an allowlisted resource ID resolved on the server, then enforce authorization. Joining a path alone does not establish access rights. path.normalize is lexical cleanup, not permission checking. Prefer a server-side ID-to-path allowlist; symlinks and filesystem races complicate containment checks.',
      followUp: 'Which test would fail if this boundary were removed?',
    },
    {
      id: 'stream-backpressure-practice',
      title: 'Let a slow receiver limit production practice',
      prompt:
        'A destination fails after the first chunk. What must the caller observe?',
      context:
        'Original reading-list API exercise. State the assumption and explain the failure boundary before revealing the answer.',
      answer:
        'The pipeline promise rejects and the chain is destroyed. Catch the error at the owning boundary; do not report a successful complete export.',
      explanation:
        'The pipeline promise rejects and the chain is destroyed. Catch the error at the owning boundary; do not report a successful complete export. Ignoring write(false) can grow memory. highWaterMark is a pressure threshold, not a hard global memory cap; handle pipeline rejection and client aborts.',
      followUp: 'Which test would fail if this boundary were removed?',
    },
  ],
}
