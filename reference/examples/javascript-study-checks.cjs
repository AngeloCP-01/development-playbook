"use strict";

const assert = require("node:assert/strict");

const command =
  "node --unhandled-rejections=strict reference/examples/javascript-study-checks.cjs";
let assertions = 0;
function equal(actual, expected) {
  assert.deepStrictEqual(actual, expected);
  assertions += 1;
}
function deferred() {
  let resolve;
  const promise = new Promise((resolvePromise) => {
    resolve = resolvePromise;
  });
  return { promise, resolve };
}

async function main() {
  const activities = [];

  function makeCounter() {
    let count = 0;
    return () => ++count;
  }
  const first = makeCounter();
  const second = makeCounter();
  const counterOutput = [first(), first(), second()];
  equal(counterOutput, [1, 2, 1]);
  equal([first(), second()], [3, 2]);
  activities.push({
    id: "A",
    topic: "independent closure bindings",
    snippet:
      "function makeCounter() {\n  let count = 0;\n  return () => ++count;\n}\nconst first = makeCounter();\nconst second = makeCounter();\nconsole.log(first(), first(), second());",
    result: counterOutput,
    explanation:
      "Each makeCounter call creates a separate count binding. Its returned function retains access to that binding; repeated calls through first share one count, while second retains another.",
  });

  const original = { name: "Ada", settings: { theme: "light" } };
  const copy = { ...original };
  equal(copy === original, false);
  equal(copy.settings === original.settings, true);
  copy.settings.theme = "dark";
  equal(original.settings.theme, "dark");
  const shallowResult = original.settings.theme;
  const updated = {
    ...original,
    settings: { ...original.settings, theme: "light" },
  };
  equal(updated.settings === original.settings, false);
  equal([original.settings.theme, updated.settings.theme], ["dark", "light"]);
  activities.push({
    id: "B",
    topic: "shallow spread and nested immutable update",
    snippet:
      "const original = { name: 'Ada', settings: { theme: 'light' } };\nconst copy = { ...original };\ncopy.settings.theme = 'dark';\nconsole.log(original.settings.theme);\nconst updated = {\n  ...original,\n  settings: { ...original.settings, theme: 'light' },\n};\nconsole.log(original.settings.theme, updated.settings.theme);",
    result: [shallowResult, [original.settings.theme, updated.settings.theme]],
    explanation:
      "The first spread makes a distinct outer object but shares settings. The nested update creates a distinct settings object before replacing theme, so it leaves the original at dark.",
  });

  const items = [1, 2];
  const releaseBrokenSaves = deferred();
  const brokenSavesFinished = deferred();
  const brokenTrace = [];
  let savedCount = 0;
  const delayedSave = async (item) => {
    await releaseBrokenSaves.promise;
    brokenTrace.push(`saved ${item}`);
    savedCount += 1;
    if (savedCount === items.length) brokenSavesFinished.resolve();
  };
  await items.forEach(async (item) => {
    await delayedSave(item);
  });
  brokenTrace.push("complete");
  equal(brokenTrace, ["complete"]);
  const brokenBeforeRelease = [...brokenTrace];
  releaseBrokenSaves.resolve();
  await brokenSavesFinished.promise;
  equal(brokenTrace, ["complete", "saved 1", "saved 2"]);

  async function saveAll(itemsToSave, save) {
    for (const item of itemsToSave) {
      await save(item);
    }
    return "complete";
  }
  const sequentialTrace = [];
  const firstSaveStarted = deferred();
  const secondSaveStarted = deferred();
  const firstSaveRelease = deferred();
  const secondSaveRelease = deferred();
  const sequentialRun = saveAll(items, async (item) => {
    sequentialTrace.push(`started ${item}`);
    if (item === 1) {
      firstSaveStarted.resolve();
      await firstSaveRelease.promise;
    } else {
      secondSaveStarted.resolve();
      await secondSaveRelease.promise;
    }
    sequentialTrace.push(`saved ${item}`);
  }).then((message) => {
    sequentialTrace.push(message);
  });
  await firstSaveStarted.promise;
  equal(sequentialTrace, ["started 1"]);
  firstSaveRelease.resolve();
  await secondSaveStarted.promise;
  equal(sequentialTrace, ["started 1", "saved 1", "started 2"]);
  secondSaveRelease.resolve();
  await sequentialRun;
  equal(sequentialTrace, [
    "started 1",
    "saved 1",
    "started 2",
    "saved 2",
    "complete",
  ]);

  const rejectionTrace = [];
  const saveError = new Error("save 2 failed");
  assertions += 1;
  await assert.rejects(
    saveAll([1, 2, 3], async (item) => {
      rejectionTrace.push(`started ${item}`);
      if (item === 2) throw saveError;
      rejectionTrace.push(`saved ${item}`);
    }),
    (error) => error === saveError,
  );
  equal(rejectionTrace, ["started 1", "saved 1", "started 2"]);
  activities.push({
    id: "C",
    topic: "forEach does not await asynchronous callbacks",
    brokenSnippet:
      "await items.forEach(async (item) => {\n  await save(item);\n});\nconsole.log('complete');",
    fixedSnippet:
      "async function saveAll(items, save) {\n  for (const item of items) {\n    await save(item);\n  }\n  return 'complete';\n}\ntry {\n  console.log(await saveAll(items, save));\n} catch (error) {\n  console.error(error.message);\n}",
    brokenBeforeRelease,
    brokenAfterRelease: brokenTrace,
    fixedSuccessTrace: sequentialTrace,
    fixedRejectionTrace: rejectionTrace,
    fixedRejection: saveError.message,
    explanation:
      "forEach returns undefined and ignores callback promises. Awaiting that return value does not collect or wait for saves. Sequential for...of awaits each save, preserves order, propagates a rejection to its caller, and skips later items after failure. Sequential execution is appropriate here because this activity explicitly requires one save to finish before the next begins.",
    harness:
      "Deferred promises hold save callbacks pending until the assertions release them. There are no sleeps or timing thresholds. The broken case uses successful saves; the fixed case separately asserts that the original rejection reaches the caller and item 3 never starts.",
  });

  // Schedule this activity in one fresh timer callback, ensuring a single
  // synchronous scheduling context independent of earlier async continuations.
  const eventLoopOutput = await new Promise((resolve) => {
    setTimeout(() => {
      const output = [];
      output.push("sync 1");
      Promise.resolve().then(() => output.push("promise"));
      queueMicrotask(() => output.push("microtask"));
      setTimeout(() => {
        output.push("timer");
        resolve(output);
      }, 0);
      output.push("sync 2");
    }, 0);
  });
  equal(eventLoopOutput, ["sync 1", "sync 2", "promise", "microtask", "timer"]);
  activities.push({
    id: "D",
    topic: "synchronous work, registered microtasks, then timer",
    snippet:
      "console.log('sync 1');\nPromise.resolve().then(() => console.log('promise'));\nqueueMicrotask(() => console.log('microtask'));\nsetTimeout(() => console.log('timer'), 0);\nconsole.log('sync 2');",
    result: eventLoopOutput,
    explanation:
      "Synchronous statements finish first. The promise reaction and queueMicrotask callback run in their registration order before the scheduled timer callback.",
    limits:
      "Observed in Node 22.23.4 CommonJS strict mode. The scheduling statements execute together inside one timer callback with no unrelated work; assertions run only after that activity ends. This is a queue-order example, not an elapsed-time guarantee. It makes no claims about nextTick, setImmediate, I/O phases, ES-module evaluation, or other runtimes.",
  });

  const evidence = {
    purpose:
      "Executable evidence for four original illustrative JavaScript learning activities; not product behavioral tests.",
    runtime: {
      actualNodeVersion: process.version,
      scriptMode: "strict CommonJS",
    },
    command,
    status: "passed",
    counts: { activities: activities.length, assertions },
    activities,
    limits: [
      "Runtime validation establishes only the outcomes of these snippets under this installed Node version; source-backed explanations and browser claims require separate documentation research.",
      "No network requests, environment reads, secret access, or filesystem writes. Evidence is emitted to stdout.",
      "No timer-duration threshold or arbitrary sleep is used; the event-loop example necessarily schedules timers.",
    ],
  };
  process.once("beforeExit", (exitStatus) => {
    evidence.actualExitStatus = exitStatus;
    console.log(JSON.stringify(evidence, null, 2));
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
