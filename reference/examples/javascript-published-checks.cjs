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
function execute(code, result = "undefined", logs = [], errors = []) {
  const console = {
    log: (...values) => logs.push(values),
    error: (...values) => errors.push(values),
  };
  void console;
  return eval(`${code}\n;${result}`);
}

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
  console.log(
    JSON.stringify(
      {
        runtime: process.version,
        context: "strict CommonJS, published fields via direct eval",
        activities: 4,
        assertions,
        status: "passed",
        limits:
          "Controlled save promises and one isolated timer callback; no timer-duration, browser, ESM or I/O ordering claim.",
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
