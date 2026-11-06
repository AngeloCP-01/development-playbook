'use strict';

// Validate the literal examples in the teaching prototype, without a second
// copy of its implementations. This is separate from published-page evidence.
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const { spawnSync } = require('node:child_process');
const vm = require('node:vm');

const draft = readFileSync(
  join(__dirname, '../../docs/superpowers/specs/2026-11-06-javascript-promises-mini-lesson.md'),
  'utf8',
);
const examples = new Map();
for (const match of draft.matchAll(/<!-- example: ([\w-]+) -->\s*```js\n([\s\S]*?)\n```/g)) {
  assert(!examples.has(match[1]), `duplicate example ${match[1]}`);
  examples.set(match[1], match[2]);
}
let assertions = 0;
let completed = false;
process.once('beforeExit', () => {
  if (!completed) {
    console.error('Prototype checks did not reach completion.');
    process.exitCode = 1;
  }
});
function equal(actual, expected) {
  assert.deepStrictEqual(actual, expected);
  assertions += 1;
}
function source(...ids) {
  return ids.map((id) => {
    assert(examples.has(id), `missing example ${id}`);
    return examples.get(id);
  }).join('\n\n');
}
function child(ids, expected, definitions = '') {
  const result = spawnSync(process.execPath, ['--unhandled-rejections=strict', '-'], {
    input: "'use strict';\n" + definitions + '\n' + source(...ids),
    encoding: 'utf8', timeout: 10_000,
  });
  equal(result.error, undefined);
  equal(result.status, 0);
  equal(result.stderr, '');
  equal(result.stdout.trim(), expected);
}

async function main() {
  child(['profile-fixture', 'callback-caller'], 'request started\nAda');
  child(['profile-fixture', 'wrong-callback-return'], 'undefined');
  child(
    ['profile-fixture', 'promise-adapter', 'await-version', 'awaited-caller'],
    'finished 1\nADA\nfinished 99\ncaught: Profile 99 was not found',
  );
  child(
    ['profile-fixture', 'promise-adapter', 'outcomes-example'],
    'ok: Ada\nfailed: Profile 99 was not found',
  );
  const { javascript } = require('../../web/src/lib/cheatsheets/javascript.ts');
  const exercise = javascript.activities.find((item) => item.id === 'async-iteration');
  child(['save-test-fixture'], '1\ncomplete', exercise.solution.code);
  child(['save-test-fixture'], '1,2\ncomplete', exercise.starter.code);

  const logs = [];
  const capturedConsole = { log: (...values) => logs.push(values) };
  const context = vm.createContext({
    Map, Promise, Error, queueMicrotask, console: capturedConsole,
  });
  const api = vm.runInContext(
    source('profile-fixture', 'promise-adapter', 'chain-version', 'await-version') +
      '\n;({ profiles, loadProfile, displayNameWithThen, displayNameWithAwait })',
    context,
  );

  let settled = false;
  const pending = api.loadProfile(1);
  pending.then(() => { settled = true; });
  equal(pending instanceof Promise, true);
  equal(settled, false);
  const profile = await pending;
  equal(settled, true);
  equal(profile.name, 'Ada');

  const original = api.loadProfile(1);
  const derived = original.then((value) => value.name.toUpperCase());
  equal(original === derived, false);
  equal(await derived, 'ADA');
  equal((await original).name, 'Ada');

  // Operation failure and transformation failure are distinct paths. Both
  // returned forms must preserve rejection and run their cleanup once.
  api.profiles.set(3, { name: null });
  for (const name of ['displayNameWithThen', 'displayNameWithAwait']) {
    for (const [id, expected] of [[1, 'ADA'], [2, 'LIN']]) {
      logs.length = 0;
      equal(await api[name](id), expected);
      equal(logs, [[`finished ${id}`]]);
    }
    logs.length = 0;
    await assert.rejects(api[name](99), /Profile 99 was not found/);
    assertions += 1;
    equal(logs, [['finished 99']]);

    logs.length = 0;
    await assert.rejects(api[name](3), (error) => error.name === 'TypeError');
    assertions += 1;
    equal(logs, [['finished 3']]);
  }

  const cleanupFailure = new Error('cleanup failed');
  capturedConsole.log = () => { throw cleanupFailure; };
  for (const name of ['displayNameWithThen', 'displayNameWithAwait']) {
    for (const id of [1, 99]) {
      await assert.rejects(api[name](id), (error) => error === cleanupFailure);
      assertions += 1;
    }
  }

  console.log(JSON.stringify({
    runtime: process.version,
    context: 'strict CommonJS; in-memory callback fixture; no network',
    literalExamples: examples.size,
    assertions,
    checked: [
      'callback timing and lost outer return', 'immediate pending promise',
      'distinct chained promise values', 'both display-name implementations',
      'operation and transformation rejection', 'cleanup once and failure override',
      'exact sequential caller output',
    ],
    status: 'passed',
    limits: 'Prototype examples only; no browser or published-page claim.',
  }, null, 2));
  completed = true;
}
main().catch((error) => { console.error(error); process.exitCode = 1; });
