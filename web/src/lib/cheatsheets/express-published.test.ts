import { mkdtempSync, writeFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { spawn, spawnSync } from 'node:child_process'
import { expect, test } from 'vitest'
import { nodeExpress } from './express'

const moduleFiles: Record<
  string,
  { path: string; entry: string; output: string }
> = {
  'esm-counter-file': {
    path: 'counter.mjs',
    entry: 'main.mjs',
    output: 'esm 1 1',
  },
  'esm-and-commonjs-example': {
    path: 'main.mjs',
    entry: 'main.mjs',
    output: 'esm 1 1',
  },
  'cjs-counter-file': {
    path: 'counter.cjs',
    entry: 'main.cjs',
    output: 'cjs 1 2 true',
  },
  'cjs-main-file': {
    path: 'main.cjs',
    entry: 'main.cjs',
    output: 'cjs 1 2 true',
  },
  'cjs-cycle-a-file': {
    path: 'a.cjs',
    entry: 'a.cjs',
    output: 'cycle false true',
  },
  'cjs-cycle-b-file': {
    path: 'b.cjs',
    entry: 'a.cjs',
    output: 'cycle false true',
  },
}
const output: Record<string, string> = {
  'node-runtime': 'object undefined',
  'loop-and-pool': '499500',
  'parallel-work': "[ 'book', 'owner' ]",
  scheduling: 'sync\nend\npromise\ntick',
  'promise-control': 'offline released',
  'events-and-cleanup': '[ 1 ] 0',
  'package-contracts': 'module node --test ^5.3.0',
  configuration: '3200',
  'buffers-and-encoding': '1 2\né',
  'paths-and-files': 'one',
  'stream-backpressure': 'book-list',
  'deadlines-and-aborts': 'true deadline',
  'service-boundaries': "{ id: 'b1', ownerId: 'u1' }",
  'process-state': '1',
  'unit-and-http-tests': 'rules pass',
  'failure-matrix': 'malformed JSON:400',
  'diagnose-blocking-and-leaks': 'r1\nundefined',
  'scale-and-dependencies': '20',
  'resource-limits': 'done',
}
const sketches = {
  'atomicity-and-retries': 'Repository contract without a selected driver',
  'interview-capstone':
    'Deliberately broken repair prompt, commented to prevent accidental deployment',
}
const requests: Record<string, string> = {
  'raw-http': "assert.equal((await (await fetch(base)).json()).method, 'GET')",
  'methods-and-status':
    "assert.equal((await fetch(base+'/books', { method: 'HEAD' })).status, 200); assert.equal(await (await fetch(base+'/books/b1', {method:'DELETE'})).text(), '')",
  'app-and-router':
    "assert.deepEqual(await (await fetch(base+'/books/b1')).json(), {id:'b1',base:'/books'})",
  'middleware-order':
    "assert.deepEqual(await (await fetch(base+'/books')).json(), ['enter','route'])",
  'routing-five':
    "assert.deepEqual(await (await fetch(base+'/files/notes.txt')).json(), {file:'notes',ext:'txt'}); assert.equal((await fetch(base+'/')).status,404)",
  'parsing-and-validation': `for (const [body,status] of [['{"title":"book"}',201],['{',400],['[]',400],['{"title":42}',400],['{"title":"x","ownerId":"u2"}',400],[JSON.stringify({title:'x'.repeat(2000)}),413]]) { assert.equal((await fetch(base+'/books',{method:'POST',headers:{'Content-Type':'application/json'},body})).status,status); }`,
  'response-contracts':
    "assert.equal((await fetch(base+'/books/b1')).status,200); assert.equal((await fetch(base+'/books/no')).status,404)",
  'lists-and-pagination':
    "assert.deepEqual(await (await fetch(base+'/books')).json(),[{id:'b1',tag:'node'},{id:'b2',tag:'node'}]); assert.deepEqual(await (await fetch(base+'/books?limit=1')).json(),[{id:'b1',tag:'node'}]); for (const query of ['limit=1&limit=2','limit=0','limit=3','limit=1.5']) assert.equal((await fetch(base+'/books?'+query)).status,400)",
  'promise-errors':
    "const response=await fetch(base+'/books'); assert.equal(response.status,500); assert.deepEqual(await response.json(),{error:'internal'})",
  'callback-errors': "assert.equal((await fetch(base+'/books')).status,500)",
  'not-found-and-final-error':
    "assert.equal((await fetch(base+'/unknown')).status,404); const response=await fetch(base+'/fail'); assert.equal(response.status,500); assert.deepEqual(await response.json(),{error:'internal'})",
  'identity-and-access':
    "const denied=await fetch(base+'/books/b1'); assert.equal(denied.status,401); assert.match(denied.headers.get('www-authenticate'),/^Bearer/)",
  'cookies-and-tokens':
    "const cookie=(await fetch(base+'/cookie-demo')).headers.get('set-cookie'); for(const flag of ['HttpOnly','Secure','SameSite=Lax']) assert.ok(cookie.includes(flag))",
  'cors-and-csrf':
    "assert.equal((await fetch(base+'/books',{headers:{Origin:'https://reader.example'}})).headers.get('access-control-allow-origin'),'https://reader.example'); assert.equal((await fetch(base+'/books',{headers:{Origin:'https://evil.example'}})).headers.get('access-control-allow-origin'),null)",
  'proxy-and-input-defense':
    "assert.notEqual((await (await fetch(base+'/ip',{headers:{'X-Forwarded-For':'1.2.3.4'}})).json()).ip,'1.2.3.4')",
}
function run(code: string, context = 'module') {
  const result = spawnSync(
    process.execPath,
    ['--input-type=' + context, '-e', code],
    {
      cwd: process.cwd(),
      encoding: 'utf8',
      timeout: 8000,
      env: { ...process.env, NODE_ENV: 'development' },
    },
  )
  if (result.error || result.status !== 0 || result.stderr.trim())
    throw new Error(result.error?.message ?? result.stderr)
  return result.stdout.trim()
}
const examples = nodeExpress.sections.flatMap((s) =>
  s.rows.flatMap((r) =>
    r
      .teaching!.filter((b) => b.kind === 'code')
      .map((b) => ({ topic: r.study!.id, id: b.id, code: b.code })),
  ),
)
test('every displayed code location is classified by stable ID', () => {
  const ids = nodeExpress.sections
    .flatMap((s) => [
      ...(s.introduction ?? [])
        .filter((b) => b.kind === 'code')
        .map((b) => b.id),
      ...s.rows.flatMap((r) => [
        ...(r.teaching ?? []).filter((b) => b.kind === 'code').map((b) => b.id),
        ...(r.example ?? []).map((_, i) => r.study!.id + '-row-example-' + i),
      ]),
    ])
    .concat(
      (nodeExpress.activities ?? []).flatMap((a) => [
        ...(a.starter ? [a.id + '-starter'] : []),
        ...(a.solution ? [a.id + '-solution'] : []),
      ]),
    )
  const classified = [
    ...Object.keys(output),
    ...Object.keys(requests),
    ...Object.keys(sketches),
    'startup-and-shutdown',
  ]
    .map((id) => id + '-example')
    .concat(Object.keys(moduleFiles), 'interview-capstone-practice-solution')
  expect(ids.sort()).toEqual(classified.sort())
  expect(new Set(ids).size).toBe(ids.length)
})
test.each(examples)('published $id example', ({ topic, id, code }) => {
  if (id in moduleFiles) {
    runModuleFiles(id)
    return
  }
  if (topic in sketches) {
    expect(code.startsWith('//')).toBe(true)
    return
  }
  if (topic in output) {
    expect(run(code)).toContain(output[topic])
    return
  }
  if (topic === 'startup-and-shutdown') {
    run(
      code +
        `\nimport assert from 'node:assert/strict'; const {server,start,stop,isReady}=makeLifecycle(); await start(); assert.equal(isReady(),true); const a=stop(); assert.equal(a,stop()); await a; assert.equal(server.listening,false);`,
    )
    return
  }
  run(
    code +
      `\nimport assert from 'node:assert/strict'; const app=${topic === 'raw-http' ? 'makeServer()' : 'makeApp()'}; const server=${topic === 'raw-http' ? 'app' : 'app.listen(0,"127.0.0.1")'}; ${topic === 'raw-http' ? 'server.listen(0,"127.0.0.1");' : ''} await new Promise(r=>server.once('listening',r)); const base='http://127.0.0.1:'+server.address().port; try { ${requests[topic]} } finally { server.closeAllConnections(); await new Promise(r=>server.close(r)); }`,
  )
})
function codeFor(id: string) {
  return examples.find((e) => e.topic === id)!.code
}
test('CJS ordering is verified in its separate module context', () => {
  expect(run(codeFor('scheduling'), 'commonjs')).toBe(
    'sync\nend\ntick\npromise',
  )
})
test('configuration rejects malformed and out-of-range values', () => {
  run(
    codeFor('configuration') +
      `\nimport assert from 'node:assert/strict'; for(const value of [undefined,'','3200oops','0','65536','1.5']) assert.throws(()=>port(value));`,
  )
})
test('ownership covers allowed, forbidden and absent records and detects a removed check', () => {
  const source = codeFor('identity-and-access')
  const checks = `\nimport assert from 'node:assert/strict'; for(const [principal,path,status] of [[{id:'u1'},'/books/b1',200],[{id:'u2'},'/books/b1',403],[{id:'u1'},'/books/no',404]]) { const server=makeApp(principal).listen(0,'127.0.0.1'); await new Promise(r=>server.once('listening',r)); try { assert.equal((await fetch('http://127.0.0.1:'+server.address().port+path)).status,status); } finally {server.closeAllConnections();await new Promise(r=>server.close(r));} }`
  run(source + checks)
  expect(() =>
    run(
      source.replace(
        'if (book.ownerId !== principal.id) return res.status(403).end();',
        '',
      ) + checks,
    ),
  ).toThrow()
})
test('streams reject destination failure', () => {
  run(
    codeFor('stream-backpressure')
      .replace(
        'setImmediate(done)',
        'setImmediate(() => done(new Error("sink failed")))',
      )
      .replace('await pipeline(', 'await assert.rejects(pipeline(')
      .replace('}));', '})), /sink failed/);')
      .replace(
        'import { Readable',
        "import assert from 'node:assert/strict';\nimport { Readable",
      ),
  )
})
test('concurrency slot is released after failure and rejects overlapping work', () => {
  run(
    codeFor('resource-limits') +
      `\nimport assert from 'node:assert/strict'; let release; const first=run(()=>new Promise(r=>release=r)); await assert.rejects(run(async()=>{}),/busy/); release(); await first; await assert.rejects(run(async()=>{throw new Error('failure')})); assert.equal(await run(async()=>2),2);`,
  )
})

test('shutdown rejects stuck dependency cleanup and startup rejects occupied port', () => {
  const code = codeFor('startup-and-shutdown')
  run(
    code +
      `
import assert from 'node:assert/strict'; const life=makeLifecycle(()=>new Promise(()=>{}),20); await life.start(); await assert.rejects(life.stop(),/shutdown deadline/); assert.equal(life.isReady(),false);`,
  )
  run(
    code +
      `
import assert from 'node:assert/strict'; const first=makeLifecycle();await first.start();let closed=false;const second=makeLifecycle(async()=>{closed=true});try{await assert.rejects(second.start(first.server.address().port));assert.equal(closed,true)}finally{await first.stop()}`,
  )
})

test('capstone displayed repair awaits storage and derives identity from trusted fixture', () => {
  const code = nodeExpress.activities!.find(
    (a) => a.id === 'interview-capstone-practice',
  )!.solution!.code
  run(
    code +
      `\nimport assert from 'node:assert/strict'; for(const failure of [false,true]) { const server=makeApp({id:'u1'},{save:async b=>{if(failure)throw new Error('secret');return {id:'b1',...b}}}).listen(0,'127.0.0.1');await new Promise(r=>server.once('listening',r));try{const response=await fetch('http://127.0.0.1:'+server.address().port+'/books',{method:'POST',headers:{'Content-Type':'application/json','X-User-ID':'u2'},body:JSON.stringify({title:'book'})});assert.equal(response.status,failure?500:201);assert.deepEqual(await response.json(),failure?{error:'internal'}:{id:'b1',title:'book',ownerId:'u1'});}finally{server.closeAllConnections();await new Promise(r=>server.close(r));}}`,
  )
})
test('duplicate-response mutation is detected by stderr even when first status looks right', () => {
  const code = codeFor('response-contracts').replace(
    'return res.status(404)',
    'res.status(404)',
  )
  expect(() =>
    run(
      code +
        `\nconst server=makeApp().listen(0,'127.0.0.1');await new Promise(r=>server.once('listening',r));try{await fetch('http://127.0.0.1:'+server.address().port+'/books/no');await new Promise(setImmediate)}finally{server.closeAllConnections();await new Promise(r=>server.close(r));}`,
    ),
  ).toThrow(/headers/i)
})

function checkList(source: string, checks: string) {
  run(
    source +
      `\nimport assert from 'node:assert/strict'; const books=Object.freeze([Object.freeze({id:'b2',tag:'node'}),Object.freeze({id:'b1',tag:'node'}),Object.freeze({id:'b3',tag:'web'})]); const app=makeApp(books); app.get('/query-shape',(req,res)=>res.json(req.query)); const server=app.listen(0,'127.0.0.1'); await new Promise(r=>server.once('listening',r)); const base='http://127.0.0.1:'+server.address().port; try { ${checks} } finally {server.closeAllConnections();await new Promise(r=>server.close(r));}`,
  )
}
const listContract = `
const get=async q=>{const response=await fetch(base+'/books'+q);assert.equal(response.status,200);return response.json()};
assert.deepEqual(await get('?limit=1&offset=0'),[{id:'b1',tag:'node'}]);
assert.deepEqual(await get('?limit=1&offset=1'),[{id:'b2',tag:'node'}]);
assert.deepEqual(await get('?limit=1&offset=2'),[{id:'b3',tag:'web'}]);
assert.deepEqual(await get('?limit=1&offset=3'),[]);
assert.deepEqual(await get('?tag=web'),[{id:'b3',tag:'web'}]);
assert.deepEqual(await get('?tag=node&offset=1&limit=1'),[{id:'b2',tag:'node'}]);
assert.deepEqual(await get('?tag=web&offset=1'),[]);
assert.deepEqual(books.map(b=>b.id),['b2','b1','b3']);
for(const query of ['limit[value]=1','offset[value]=1','tag[value]=node','unknown=1','limit=1&limit=2','offset=1&offset=2','tag=node&tag=web','offset=-1','offset=1.5','offset=1001','limit=0','limit=3','tag=','tag=other']) assert.equal((await fetch(base+'/books?'+query)).status,400,query);
assert.deepEqual(await (await fetch(base+'/query-shape?limit[value]=1')).json(),{'limit[value]':'1'});
`
test('published list supports filter, successive pages and explicit query-shape policy without mutating fixtures', () => {
  checkList(codeFor('lists-and-pagination'), listContract)
})
test('list contract detects a simple-to-extended parser mutation', () => {
  expect(() =>
    checkList(
      codeFor('lists-and-pagination').replace("'simple'", "'extended'"),
      listContract,
    ),
  ).toThrow()
})

function runModuleFiles(id: string) {
  const dir = mkdtempSync(join(tmpdir(), 'published-modules-'))
  try {
    for (const [blockId, file] of Object.entries(moduleFiles)) {
      const block = examples.find((b) => b.id === blockId)
      expect(block, 'published module file ' + file.path).toBeDefined()
      writeFileSync(join(dir, file.path), block!.code)
    }
    const file = moduleFiles[id]
    const result = spawnSync(process.execPath, [join(dir, file.entry)], {
      encoding: 'utf8',
      timeout: 8000,
    })
    expect(result.error).toBeUndefined()
    expect(result.status).toBe(0)
    expect(result.stderr).toBe('')
    expect(result.stdout.trim()).toBe(file.output)
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
}
test('published module files demonstrate ESM bindings, CJS cache and a partial cycle', () => {
  for (const id of [
    'esm-and-commonjs-example',
    'cjs-main-file',
    'cjs-cycle-a-file',
  ])
    runModuleFiles(id)
})

async function assertSignalDrain(source: string) {
  const child = spawn(
    process.execPath,
    [
      '--input-type=module',
      '-e',
      source +
        `
const life=makeLifecycle(()=>new Promise((resolve,reject)=>process.send({event:'cleanup'},error=>error?reject(error):resolve())),4000);
life.server.removeAllListeners('request');
life.server.on('request',(req,res)=>{
 res.once('finish',()=>process.send({event:'response-finished'}));
 process.send({event:'inflight'});
 process.once('message',message=>{if(message!=='release')throw new Error('unexpected message');res.end('finished')});
});
await life.start();life.installSignals();
process.on('SIGTERM',()=>process.send({event:'draining',ready:life.isReady()}));
process.send({event:'ready',port:life.server.address().port});
`,
    ],
    {
      stdio: ['ignore', 'ignore', 'pipe', 'ipc'],
      env: { ...process.env, NODE_ENV: 'development' },
    },
  )
  const messages: { event: string; ready?: boolean; port?: number }[] = []
  let stderr = ''
  child.stderr!.on('data', (chunk) => (stderr += chunk))
  child.on('message', (message) =>
    messages.push(message as (typeof messages)[number]),
  )
  const exited = new Promise<{
    code: number | null
    signal: NodeJS.Signals | null
  }>((resolve) =>
    child.once('exit', (code, signal) => resolve({ code, signal })),
  )
  const deadline = setTimeout(() => child.kill('SIGKILL'), 8000)
  const controller = new AbortController()
  let request: Promise<string> | undefined
  function waitFor(event: string): Promise<(typeof messages)[number]> {
    const existing = messages.find((m) => m.event === event)
    if (existing) return Promise.resolve(existing)
    if (child.exitCode !== null || child.signalCode !== null)
      return Promise.reject(new Error('child exited before ' + event))
    return new Promise((resolve, reject) => {
      const cleanup = () => {
        child.off('message', onMessage)
        child.off('exit', onExit)
      }
      const onMessage = (message: unknown) => {
        const m = message as (typeof messages)[number]
        if (m.event === event) {
          cleanup()
          resolve(m)
        }
      }
      const onExit = () => {
        cleanup()
        reject(new Error('child exited before ' + event))
      }
      child.on('message', onMessage)
      child.once('exit', onExit)
    })
  }
  try {
    const ready = await waitFor('ready')
    request = fetch('http://127.0.0.1:' + ready.port, {
      signal: controller.signal,
      headers: { Connection: 'close' },
    }).then((r) => r.text())
    request.catch(() => {})
    await waitFor('inflight')
    child.kill('SIGTERM')
    expect((await waitFor('draining')).ready).toBe(false)
    child.send('release')
    expect(await request).toBe('finished')
    await waitFor('response-finished')
    await waitFor('cleanup')
    expect(await exited).toEqual({ code: 0, signal: null })
    expect(messages.map((m) => m.event)).toEqual([
      'ready',
      'inflight',
      'draining',
      'response-finished',
      'cleanup',
    ])
    expect(stderr).toBe('')
  } finally {
    controller.abort()
    if (request) await request.catch(() => {})
    if (child.exitCode === null && child.signalCode === null)
      child.kill('SIGKILL')
    await exited
    clearTimeout(deadline)
  }
}
test('SIGTERM drains an in-flight request and closes dependencies before successful exit', async () => {
  await assertSignalDrain(codeFor('startup-and-shutdown'))
}, 20000)
test('SIGTERM drain contract rejects an immediate-exit mutation', async () => {
  const mutant = codeFor('startup-and-shutdown').replace(
    'stop().then(() => process.exit(0), () => process.exit(1));',
    'process.exit(0);',
  )
  await expect(assertSignalDrain(mutant)).rejects.toThrow(
    /exited before draining|exited before cleanup/,
  )
}, 20000)
