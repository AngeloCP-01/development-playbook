import type { Section, SheetActivity } from '../types'
export const io: { sections: Section[]; activities: SheetActivity[] } = {
  sections: [
    {
      title: 'Files and streams',
      study: {
        id: 'files-and-streams',
        label: 'Files and streams',
        hint: 'Explain the mechanism, change a condition, then repair the program',
      },
      introduction: [
        {
          id: 'files-and-streams-intro',
          kind: 'paragraph',
          text: 'A transport delivers bytes in arbitrary chunks, not complete characters or records. First distinguish bytes and text, then repair split decoding, own file cleanup and apply backpressure. The manual and pipeline paths use fresh streams with explicit completion/error owners.',
        },
      ],
      rows: [
        {
          term: 'Count bytes rather than letters',
          what: 'Compare UTF-16 code units, UTF-8 bytes and a shared Buffer view.',
          study: {
            id: 'buffers-and-encoding',
            summary:
              'Compare UTF-16 code units, UTF-8 bytes and a shared Buffer view.',
            activityIds: ['buffers-and-encoding-practice'],
          },
          teaching: [
            {
              id: 'buffers-and-encoding-model',
              kind: 'paragraph',
              text: 'A JavaScript string’s length counts UTF-16 code units. A Buffer stores bytes; an encoding tells Node how those bytes represent text. A network limit or Content-Length is generally a byte count. Buffer.alloc initializes its storage; unsafe allocation must be fully overwritten before use.',
            },
            {
              id: 'buffers-and-encoding-example',
              kind: 'code',
              label: 'bytes.mjs — representation and shared storage',
              code: "const text = '🦉'; const bytes = Buffer.from(text, 'utf8');\nconsole.log('units', text.length, 'bytes', bytes.length);\nconst original = Buffer.from([65, 66]);\nconst view = original.subarray(0, 1), copy = Buffer.from(view);\nview[0] = 90;\nconsole.log(original.toString(), copy.toString());",
            },
            {
              id: 'byte-view-trace',
              kind: 'table',
              label: 'Representation and ownership',
              columns: ['Observation', 'Intermediate state', 'Reason'],
              rows: [
                [
                  'units 2 bytes 4',
                  'One code point uses two UTF-16 code units and four UTF-8 bytes',
                  'String length is not the UTF-8 transport size.',
                ],
                [
                  'ZB A',
                  'view shares original storage; copy has separate storage',
                  'Changing the view changes original, while copy retains A.',
                ],
              ],
            },
            {
              id: 'buffer-retention-boundary',
              kind: 'paragraph',
              text: 'A small subarray can keep a large backing allocation reachable. Copy only the slice when that ownership tradeoff matters. This observation proves sharing, not when memory is collected. Buffer.byteLength(text, utf8) or the library’s framing should supply byte lengths; never infer message boundaries from a Buffer boundary.',
            },
            {
              id: 'buffers-and-encoding-interview',
              kind: 'interview',
              question: 'Why can one visible character span two stream chunks?',
              answer:
                'Chunking follows transport/buffering behavior, not text boundaries. A four-byte UTF-8 character can be split anywhere. Decode incrementally before interpreting application records.',
              followUp:
                'Which memory remains reachable through a tiny subarray?',
            },
          ],
        },
        {
          term: 'Repair a split character before framing records',
          what: 'Watch StringDecoder hold incomplete UTF-8 bytes, then separate decoding from newline framing.',
          study: {
            id: 'incremental-decoding',
            summary:
              'Watch StringDecoder hold incomplete UTF-8 bytes, then separate decoding from newline framing.',
            activityIds: ['incremental-decoding-practice'],
          },
          teaching: [
            {
              id: 'incremental-decoding-model',
              kind: 'paragraph',
              text: 'StringDecoder retains an incomplete multibyte sequence across writes and combines it with later bytes. Decoding each chunk independently replaces incomplete sequences and corrupts a split character. Once text is decoded, a record delimiter such as newline still needs its own carry state.',
            },
            {
              id: 'incremental-decoding-example',
              kind: 'code',
              label: 'decode.mjs — deliberately split inside the owl',
              code: "import { StringDecoder } from 'node:string_decoder';\nconst text = 'book:🦉\\n'; const bytes = Buffer.from(text);\nconst parts = [bytes.subarray(0, 7), bytes.subarray(7)];\nconst wrong = parts.map(part => part.toString('utf8')).join('');\nconst decoder = new StringDecoder('utf8');\nconst first = decoder.write(parts[0]), second = decoder.write(parts[1]);\nconsole.log(JSON.stringify({ wrong, first, decoded: first + second + decoder.end() }));",
            },
            {
              id: 'decoder-trace',
              kind: 'table',
              label: 'Bytes, decoded text and record state',
              columns: ['Moment', 'Decoder output', 'What is still waiting'],
              rows: [
                [
                  'First 7 bytes',
                  'book:',
                  'Two leading bytes of the four-byte owl are retained by the decoder.',
                ],
                [
                  'Remaining bytes',
                  '🦉 plus newline',
                  'The character can now be decoded; newline completes one record.',
                ],
                [
                  'End',
                  'No extra text for this complete input',
                  'An application still needs to reject or accept a truncated final record by policy.',
                ],
              ],
            },
            {
              id: 'decoder-framing',
              kind: 'paragraph',
              text: 'The repair activity uses newline-delimited UTF-8 records. Count wire bytes between newlines to reject an overlong record even across a split character; carry decoded text until newline arrives. Reject an unfinished final record instead of silently treating it as complete. StringDecoder is not strict UTF-8 validation: invalid bytes can become replacement characters. The record limit also does not bound the number of records retained in the result; a live parser needs a total/consumer capacity policy.',
            },
            {
              id: 'incremental-decoding-interview',
              kind: 'interview',
              question:
                'Does correct UTF-8 decoding tell you where a JSON record ends?',
              answer:
                'No. Text encoding and application framing are separate layers. Multiple records can share a chunk, or one record can span many chunks. State the delimiter, byte bounds and truncated-input policy.',
              followUp:
                'What fails if the owl is split after its first byte instead?',
            },
          ],
        },
        {
          term: 'Clean up files even on failure',
          what: 'Compare callback and Promise fs outcomes while owning an explicit temporary path.',
          study: {
            id: 'paths-and-files',
            summary:
              'Compare callback and Promise fs outcomes while owning an explicit temporary path.',
            activityIds: ['paths-and-files-practice'],
          },
          teaching: [
            {
              id: 'paths-and-files-model',
              kind: 'paragraph',
              text: 'Resolve paths explicitly and release files/directories in finally. A file URL is not a platform path: use fileURLToPath for import.meta.url. Await writes before reading the same file; concurrent mutations require coordination rather than an assumption that async APIs serialize them.',
            },
            {
              id: 'paths-and-files-example',
              kind: 'code',
              label: 'files.mjs — success, callback error and Promise error',
              code: "import { readFile as readCallback } from 'node:fs';\nimport { mkdtemp, writeFile, readFile, rm } from 'node:fs/promises';\nimport { tmpdir } from 'node:os'; import { join } from 'node:path';\nimport { fileURLToPath } from 'node:url';\nconsole.log('path', typeof fileURLToPath(import.meta.url));\nconst dir = await mkdtemp(join(tmpdir(), 'reading-'));\ntry {\n const path = join(dir, 'book.txt'), missing = join(dir, 'missing.txt');\n await writeFile(path, 'one'); console.log('read', await readFile(path, 'utf8'));\n await new Promise(resolve => readCallback(missing, 'utf8', error => { console.log('callback', error.code); resolve(); }));\n try { await readFile(missing, 'utf8'); } catch (error) { console.log('promise', error.code); }\n} finally { await rm(dir, { recursive: true, force: true }); }\nconsole.log('cleaned');",
            },
            {
              id: 'file-lifetime-trace',
              kind: 'table',
              label: 'File ownership through failure',
              columns: ['Point', 'Resource state', 'Error path'],
              rows: [
                [
                  'Temporary directory created',
                  'This invocation owns the path',
                  'It must be removed even if a later operation rejects.',
                ],
                [
                  'Write awaited; read succeeds',
                  'book.txt contains one',
                  'Read begins after write completion, not concurrently with it.',
                ],
                [
                  'Missing read',
                  'No file exists at missing.txt',
                  'Callback receives ENOENT; Promise read rejects with ENOENT.',
                ],
                [
                  'finally',
                  'Temporary tree removed',
                  'The operation’s owner releases it before reporting cleaned.',
                ],
              ],
            },
            {
              id: 'path-access-boundary',
              kind: 'paragraph',
              text: 'Normalizing/joining a caller-selected path is not authorization or guaranteed filesystem containment; symlinks and races complicate it. Prefer a server-side ID-to-path allowlist plus resource permission checks. These temporary paths are trusted fixtures, not a public file-serving recipe.',
            },
            {
              id: 'paths-and-files-interview',
              kind: 'interview',
              question:
                'Why does a try/catch around readCallback not replace its error argument?',
              answer:
                'The function call returns before a later callback executes. Its documented error argument belongs to that later outcome; a Promise adapter rejects it so an await caller can catch. Cleanup must surround the whole owned operation.',
              followUp:
                'Which failure should remain visible if cleanup itself fails?',
            },
          ],
        },
        {
          term: 'Pause after an accepted write',
          what: 'Control a slow writable, wait for drain/error/close, and never retry the chunk that returned false.',
          study: {
            id: 'manual-backpressure',
            summary:
              'Control a slow writable, wait for drain/error/close, and never retry the chunk that returned false.',
            activityIds: ['manual-backpressure-practice'],
          },
          teaching: [
            {
              id: 'manual-backpressure-model',
              kind: 'paragraph',
              text: 'write(false) accepted that chunk but asks the producer to stop submitting more. drain permits production to resume; it does not mean a remote peer received or durably stored the bytes. A close/error can replace drain, so waiting for drain alone can hang. highWaterMark is a pressure threshold, not a hard global memory cap.',
            },
            {
              id: 'drain-helper-file',
              kind: 'code',
              label: 'drain.mjs — settle and remove only these wait listeners',
              code: "export function waitDrain(sink) {\n return new Promise((resolve, reject) => {\n  const cleanup = () => { sink.off('drain', drained); sink.off('error', failed); sink.off('close', closed); };\n  const drained = () => { cleanup(); resolve(); };\n  const failed = error => { cleanup(); reject(error); };\n  const closed = () => failed(new Error('closed before drain'));\n  sink.once('drain', drained); sink.once('error', failed); sink.once('close', closed);\n  if (sink.destroyed) closed();\n });\n}",
            },
            {
              id: 'manual-backpressure-example',
              kind: 'code',
              label:
                'controlled-write.mjs — explicitly release the first write',
              code: "import { Writable } from 'node:stream';\nimport { finished } from 'node:stream/promises';\nimport { waitDrain } from './drain.mjs';\nconst seen = [], releases = [];\nconst sink = new Writable({ highWaterMark: 1, write(chunk, encoding, done) { seen.push(chunk.toString()); releases.push(done); } });\nconst done = finished(sink, { cleanup: true }); done.catch(() => {});\ntry {\n console.log('accepted A', sink.write('A'));\n const draining = waitDrain(sink);\n setImmediate(() => { console.log('release'); releases.shift()(); });\n await draining; console.log('drain');\n sink.write('B'); releases.shift()(); sink.end(); await done;\n console.log('accepted', seen.join(''));\n} finally { sink.destroy(); await done.catch(() => {}); }",
            },
            {
              id: 'manual-backpressure-trace',
              kind: 'table',
              label: 'Admission, pause and release',
              columns: ['Moment', 'Producer / receiver state', 'Rule'],
              rows: [
                [
                  'accepted A false',
                  'A is admitted; the write callback is held',
                  'Do not submit B yet and do not retry A.',
                ],
                [
                  'release → drain',
                  'Receiver completes A; drain wait settles',
                  'Drain/error/close listeners for this wait are removed.',
                ],
                [
                  'accepted AB',
                  'Only now submit B, end, await completion',
                  'Exactly two chunks, once each; completion is a separate boundary.',
                ],
              ],
            },
            {
              id: 'manual-backpressure-interview',
              kind: 'interview',
              question:
                'Why is retrying the false write a data-corruption bug?',
              answer:
                'The first call already admitted that chunk. Retrying duplicates it. Pause before the next chunk, and reject on error/premature close rather than wait forever for a drain that cannot occur.',
              followUp:
                'Which owner watches errors while no drain wait is active?',
            },
          ],
        },
        {
          term: 'Let a pipeline own completion and failure',
          what: 'Compare manual admission with fresh pipeline streams and cancellation.',
          study: {
            id: 'stream-backpressure',
            summary:
              'Compare manual admission with fresh pipeline streams and cancellation.',
            activityIds: ['stream-backpressure-practice'],
          },
          teaching: [
            {
              id: 'stream-backpressure-model',
              kind: 'paragraph',
              text: 'pipeline connects readable/writable lifetimes, handles backpressure and rejects when a stage fails. Use fresh streams for each attempt: pipeline can leave listeners after failure. Destruction during an HTTP transfer may close the socket, so a later JSON error response is not always possible.',
            },
            {
              id: 'pipeline-streams-file',
              kind: 'code',
              label:
                'pipeline-streams.mjs — fresh streams and an observed-write hook',
              code: "import { Readable, Writable } from 'node:stream';\nexport function makeStreams(mode = 'ok', onWrite = () => {}) {\n const received = [];\n const source = Readable.from((async function* () { yield 'book'; if (mode === 'source') throw new Error('source failed'); yield 'list'; })());\n const sink = new Writable({ highWaterMark: 1, write(chunk, encoding, done) {\n  received.push(chunk.toString()); onWrite();\n  setImmediate(() => done(mode === 'sink' ? new Error('sink failed') : undefined));\n } });\n return { source, sink, received };\n}",
            },
            {
              id: 'stream-backpressure-example',
              kind: 'code',
              label: 'pipeline.mjs — await the completed transfer',
              code: "import { pipeline } from 'node:stream/promises';\nimport { makeStreams } from './pipeline-streams.mjs';\nconst { source, sink, received } = makeStreams();\nawait pipeline(source, sink); console.log(received.join('-'));",
            },
            {
              id: 'pipeline-abort-example',
              kind: 'code',
              label: 'abort-pipeline.mjs — cancel at an observed first write',
              code: "import { pipeline } from 'node:stream/promises';\nimport { makeStreams } from './pipeline-streams.mjs';\nconst controller = new AbortController();\nconst streams = makeStreams('ok', () => controller.abort());\ntry { await pipeline(streams.source, streams.sink, { signal: controller.signal }); }\ncatch (error) { console.log(error.name, streams.source.destroyed, streams.sink.destroyed); }",
            },
            {
              id: 'pipeline-state-trace',
              kind: 'table',
              label: 'Pipeline outcome ownership',
              columns: ['Path', 'Observation', 'Owner action'],
              rows: [
                [
                  'Success',
                  'book-list only after pipeline resolves',
                  'Both chunks were handled; fresh streams completed.',
                ],
                [
                  'Source or destination fails',
                  'The Promise rejects and streams are destroyed',
                  'Catch at the owning operation; do not reuse failed streams or claim a full response.',
                ],
                [
                  'Abort at first write',
                  'AbortError true true',
                  'Cancellation is signalled to the transfer, not merely a Promise.race that abandons it.',
                ],
              ],
            },
            {
              id: 'stream-backpressure-interview',
              kind: 'interview',
              question: 'Does pipeline solve application record framing too?',
              answer:
                'No. It coordinates stream flow and terminal outcomes. The decoder/framing transform still owns character and record boundaries, input limits and application validation.',
              followUp:
                'Why may a streamed HTTP error require closing rather than sending a new status/body?',
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
      prompt:
        'Change bytes.mjs to keep a one-byte subarray from a large Buffer for a cache entry. Explain the memory ownership and when making a copy is justified.',
      context:
        'Use the visible Node 22 files and stated context. Make your prediction or repair before opening the solution.',
      answer:
        'The view can retain the whole backing allocation. Copy the needed bytes when retaining the larger buffer would be wasteful and sharing is unnecessary.',
      explanation:
        'Copying costs memory/work now but separates lifetime. A reference/count demonstration does not establish GC timing or an RSS drop.',
    },
    {
      id: 'incremental-decoding-practice',
      title: 'Repair a split character before framing records practice',
      prompt:
        'Implement decodeLines(chunks, maxBytes): Buffer chunks may split UTF-8 or newlines. Return complete newline-delimited records, bound wire bytes per record and reject a truncated final record. State the invalid-encoding and total-output limits.',
      context:
        'Use the visible Node 22 files and stated context. Make your prediction or repair before opening the solution.',
      answer:
        'Use one StringDecoder plus a carried text fragment; count raw bytes between newline bytes before decoding.',
      explanation:
        'The decoder handles split characters; the carry handles split records. Counting wire bytes prevents a split multibyte sequence escaping the record limit. Invalid UTF-8 can become replacement text; this is not a strict UTF-8 validator or an unbounded streaming result collector.',
      starter: {
        label: 'Incomplete decoding and framing contract',
        code: 'export function decodeLines(chunks, maxBytes = 64) { /* TODO: decode, frame, bound, finish */ }',
      },
      solution: {
        label: 'decode-lines.mjs — executable reference repair',
        code: "import { StringDecoder } from 'node:string_decoder';\nexport function decodeLines(chunks, maxBytes = 64) {\n if (!Number.isSafeInteger(maxBytes) || maxBytes < 1) throw new Error('positive byte bound required');\n const decoder = new StringDecoder('utf8'); const records = [];\n let pending = '', lineBytes = 0;\n for (const chunk of chunks) {\n  if (!Buffer.isBuffer(chunk)) throw new Error('Buffer chunks required');\n  for (const byte of chunk) {\n   if (byte === 10) lineBytes = 0;\n   else if (++lineBytes > maxBytes) throw new Error('record too long');\n  }\n  pending += decoder.write(chunk);\n  let newline;\n  while ((newline = pending.indexOf('\\n')) !== -1) {\n   records.push(pending.slice(0, newline)); pending = pending.slice(newline + 1);\n  }\n }\n pending += decoder.end();\n if (pending) throw new Error('truncated final record');\n return records;\n}",
      },
    },
    {
      id: 'paths-and-files-practice',
      title: 'Clean up files even on failure practice',
      prompt:
        'Let the Promise read fail before the callback example is reached. Which finally still runs, and why is joining an arbitrary caller path insufficient for a download endpoint?',
      context:
        'Use the visible Node 22 files and stated context. Make your prediction or repair before opening the solution.',
      answer:
        'The directory owner’s finally removes the temporary tree as the failure propagates. A joined path still needs an allowlisted resource and permission boundary.',
      explanation:
        'Resource cleanup belongs around the entire operation. Lexical path manipulation does not account for symlink traversal, races or object authorization.',
    },
    {
      id: 'manual-backpressure-practice',
      title: 'Pause after an accepted write practice',
      prompt:
        'Implement writeAll(sink, chunks) using visible drain.mjs. Accept each chunk once, pause on false, reject close/error while waiting, end the sink and await completion. Own errors even between drain waits and destroy on failure.',
      context:
        'Use the visible Node 22 files and stated context. Make your prediction or repair before opening the solution.',
      answer:
        'Register finished before producing, wait on drain/error/close only after a false result, then end and await the completion Promise.',
      explanation:
        'finished owns terminal errors throughout the operation, while waitDrain prevents a stuck drain-only wait. The already accepted chunk is not retried. Both helper and completion listeners are cleaned up on the settled paths.',
      starter: {
        label: 'Incomplete producer — visible drain.mjs is a prerequisite',
        code: 'export async function writeAll(sink, chunks) { /* TODO: one admission per chunk and terminal cleanup */ }',
      },
      solution: {
        label: 'write-all.mjs — executable reference repair',
        code: "import { finished } from 'node:stream/promises';\nimport { waitDrain } from './drain.mjs';\nexport async function writeAll(sink, chunks) {\n const done = finished(sink, { cleanup: true }); done.catch(() => {});\n try {\n  for (const chunk of chunks) {\n   if (!sink.write(chunk)) await waitDrain(sink);\n  }\n  sink.end(); await done;\n } catch (error) { sink.destroy(); await done.catch(() => {}); throw error; }\n}",
      },
    },
    {
      id: 'stream-backpressure-practice',
      title: 'Let a pipeline own completion and failure practice',
      prompt:
        'Change mode from ok to source, then sink. Which success statement becomes invalid, and what should happen if cancellation arrives after a first write?',
      context:
        'Use the visible Node 22 files and stated context. Make your prediction or repair before opening the solution.',
      answer:
        'A failure means the transfer did not complete successfully even if an earlier chunk was accepted. Catch the rejection, discard failed streams and release resources; abort must reach the pipeline’s signal.',
      explanation:
        'A partial body is not a completed report. Do not retry by reusing the same destroyed streams or try to replace already-sent HTTP headers with a JSON status.',
    },
  ],
}
