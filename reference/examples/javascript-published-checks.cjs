"use strict";

// Node 22.23.4 can load this data-only TypeScript module by stripping types.
// Read the published fields directly; do not maintain another snippet copy.
const assert = require("node:assert/strict");
const { javascript } = require("../../web/src/lib/cheatsheets/javascript.ts");
let assertions = 0;
const equal = (actual, expected) => {
  assert.deepStrictEqual(actual, expected);
  assertions += 1;
};
const activity = (id) => javascript.activities.find((item) => item.id === id);
function deferred() {
  let resolve;
  const promise = new Promise((done) => {
    resolve = done;
  });
  return { promise, resolve };
}
// Direct eval inherits this strict CommonJS context. console is intentionally
// local so the exact authored logging statements can be checked without edits.
function execute(code, result, logs = [], errors = []) {
  const console = {
    log: (...values) => logs.push(values),
    error: (...values) => errors.push(values),
  };
  void console;
  return eval(result === undefined ? code : `${code}\n;${result}`);
}

const throws = (run, type) => {
  assert.throws(run, type);
  assertions += 1;
};
let completed = false;
process.once("beforeExit", () => {
  if (!completed) {
    console.error("Published checks did not reach completion.");
    process.exitCode = 1;
  }
});

async function main() {
  const logs = [];
  const counters = execute(
    activity("closure-counter").solution.code,
    "({first, second})",
    logs,
  );
  equal(logs.splice(0), [[1, 2, 1]]);
  equal([counters.first(), counters.second()], [3, 2]);

  execute(activity("nested-copy").starter.code, "undefined", logs);
  equal(logs.splice(0), [["dark"], [true]]);
  const copy = execute(
    activity("nested-copy").solution.code,
    "({original, updated})",
    logs,
  );
  equal(logs.splice(0), [["light", "dark"], [false]]);
  equal(copy.original === copy.updated, false);

  const broken = execute(activity("async-iteration").starter.code, "saveAll");
  const gate = deferred();
  const saved = [];
  const jobs = [];
  equal(
    await broken([1, 2], (item) => {
      const job = gate.promise.then(() => saved.push(item));
      jobs.push(job);
      return job;
    }),
    "complete",
  );
  equal(saved, []);
  gate.resolve();
  await Promise.all(jobs);
  equal(saved, [1, 2]);

  const errors = [];
  const fixed = execute(
    activity("async-iteration").solution.code,
    "({saveAll, report})",
    logs,
    errors,
  );
  const started = [deferred(), deferred()];
  const released = [deferred(), deferred()];
  const trace = [];
  const run = fixed.report([1, 2], async (item) => {
    trace.push(`started ${item}`);
    started[item - 1].resolve();
    await released[item - 1].promise;
    trace.push(`saved ${item}`);
  });
  await started[0].promise;
  equal(trace, ["started 1"]);
  equal(logs, []);
  released[0].resolve();
  await started[1].promise;
  equal(trace, ["started 1", "saved 1", "started 2"]);
  equal(logs, []);
  released[1].resolve();
  await run;
  equal(trace, ["started 1", "saved 1", "started 2", "saved 2"]);
  equal(logs.splice(0), [["complete"]]);

  const failure = new Error("save 2 failed");
  const rejected = [];
  const save = async (item) => {
    rejected.push(item);
    if (item === 2) throw failure;
  };
  await assert.rejects(
    fixed.saveAll([1, 2, 3], save),
    (error) => error === failure,
  );
  assertions += 1;
  equal(rejected.splice(0), [1, 2]);
  await fixed.report([1, 2, 3], save);
  equal(rejected, [1, 2]);
  equal(errors, [["save 2 failed"]]);
  equal(logs, []);

  // One fresh host callback, with no unrelated scheduling work. No elapsed-time
  // threshold, I/O phase, module evaluation or browser-rendering assertion.
  await new Promise((resolve) => {
    setTimeout(() => {
      const schedulingLogs = [];
      schedulingLogs.push = (...entries) => {
        Array.prototype.push.apply(schedulingLogs, entries);
        if (entries.some((entry) => entry[0] === "timer")) {
          equal(Array.from(schedulingLogs), [
            ["sync 1"],
            ["sync 2"],
            ["promise"],
            ["microtask"],
            ["timer"],
          ]);
          resolve();
        }
        return schedulingLogs.length;
      };
      execute(
        activity("scheduling-trace").starter.code,
        "undefined",
        schedulingLogs,
      );
    }, 0);
  });

  execute(activity("valid-default").starter.code, undefined, logs);
  equal(logs.splice(0), [
    [["missing", "missing", "missing", "missing", "missing"]],
  ]);
  const fallback = execute(
    activity("valid-default").solution.code,
    "fallback",
    logs,
  );
  equal(logs.splice(0), [[[0, false, "", "missing", "missing"]]]);
  equal(Number.isNaN(fallback(NaN)), true);
  execute(activity("tdz-trace").starter.code, undefined, logs);
  equal(logs.splice(0), [["outer"], ["ReferenceError"], ["outer"]]);
  throws(
    () =>
      execute(
        activity("tdz-trace").starter.code.replace(
          "let value = 'inner'",
          "var value = 'inner'",
        ),
      ),
    SyntaxError,
  );
  execute(
    activity("tdz-trace").starter.code.replace(
      "{ console.log(value);",
      "{ console.log(typeof value);",
    ),
    undefined,
    logs,
  );
  equal(logs.splice(0), [["outer"], ["ReferenceError"], ["outer"]]);
  throws(() => execute(activity("receiver-repair").starter.code), TypeError);
  const receiver = execute(
    activity("receiver-repair").solution.code,
    "({meter,read})",
    logs,
  );
  equal(logs.splice(0), [[7]]);
  const wrapper = () => receiver.meter.read();
  receiver.meter.read = () => 99;
  equal([receiver.read(), wrapper()], [7, 99]);
  const transform = execute(
    activity("collection-result").solution.code,
    "doubledAboveTwo",
    logs,
  );
  equal(logs.splice(0), [[[6, 8]], [[]]]);
  const collection = Object.freeze([1, 3, 2, 4]);
  equal(transform(collection), [6, 8]);
  equal(collection, [1, 3, 2, 4]);
  equal(transform([]), []);
  execute(activity("numeric-sort").starter.code, undefined, logs);
  equal(logs.splice(0), [[[1, 10, 2]], [[1, 10, 2]]]);
  const sorted = execute(
    activity("numeric-sort").solution.code,
    "sorted",
    logs,
  );
  equal(logs.splice(0), [[[1, 2, 10]], [[10, 2, 1]]]);
  const input = Object.freeze([10, 2, 1]);
  equal(sorted(input), [1, 2, 10]);
  equal(input, [10, 2, 1]);
  const empty = [];
  equal(sorted(empty), []);
  equal(sorted(empty) === empty, false);

  // Every visible worked example is checked from its actual authored field.
  const expected = [
    [[1], [true], [false], [false, true], [0]],
    [["inner"], ["outer", 7]],
    [[2]],
    [[6], [undefined]],
    [[7], [7]],
    [[true], [false], ["Ada"]],
    [[[2, 4, 6]], [[2, 3]], [undefined], [false], [true]],
    [[5, 0]],
    [["offline"]],
    [[5]],
    [["current"], ["still current"], ["queued"]],
  ];
  const examples = javascript.sections.flatMap((section) =>
    section.rows.flatMap((row) => row.example ?? []),
  );
  equal(examples.length, expected.length);
  for (const [index, example] of examples.entries()) {
    if (index === examples.length - 1) {
      await new Promise((resolve) =>
        setTimeout(() => {
          execute(example.code, undefined, logs);
          queueMicrotask(resolve);
        }, 0),
      );
    } else await execute(example.code, undefined, logs);
    equal(logs.splice(0), expected[index]);
  }

  // Move the actual enqueue line for the stated scheduling follow-up.
  const lines = activity("scheduling-trace").starter.code.split("\n");
  const enqueue = lines.find((line) => line.startsWith("queueMicrotask("));
  const variation = lines.filter((line) => line !== enqueue);
  variation.splice(1, 0, enqueue);
  await new Promise((resolve) =>
    setTimeout(() => {
      const output = [];
      output.push = (...entries) => {
        Array.prototype.push.apply(output, entries);
        if (entries.some((entry) => entry[0] === "timer")) {
          equal(Array.from(output), [
            ["sync 1"],
            ["sync 2"],
            ["microtask"],
            ["promise"],
            ["timer"],
          ]);
          resolve();
        }
        return output.length;
      };
      execute(variation.join("\n"), undefined, output);
    }, 0),
  );
  completed = true;
  console.log(
    JSON.stringify(
      {
        runtime: process.version,
        context: "strict CommonJS, published fields via direct eval",
        activities: javascript.activities.length,
        sections: javascript.sections.length,
        workedExamples: examples.length,
        assertions,
        status: "passed",
        limits:
          "Controlled save promises and isolated timer callbacks; no timer-duration, browser, ESM or I/O ordering claim.",
      },
      null,
      2,
    ),
  );
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
