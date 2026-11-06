"use strict";

// Node 22.23.4 can load this data-only TypeScript module by stripping types.
// Read the published fields directly; do not maintain another snippet copy.
const assert = require("node:assert/strict");
const { mkdtempSync, writeFileSync, rmSync } = require("node:fs");
const { tmpdir } = require("node:os");
const { join } = require("node:path");
const { spawnSync } = require("node:child_process");
const { javascript } = require("../../web/src/lib/cheatsheets/javascript.ts");
let assertions = 0;
const equal = (actual, expected) => {
  assert.deepStrictEqual(actual, expected);
  assertions += 1;
};
const activity = (id) => javascript.activities.find((item) => item.id === id);
const publishedExamples = javascript.sections.flatMap((section) =>
  section.rows.flatMap((row) => row.example ?? []),
);
const example = (label) => {
  const found = publishedExamples.find((item) => item.label === label);
  assert.ok(found, `Missing authored example ${label}`);
  return found;
};
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
    example("Select, then transform: unchanged input").code,
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

  // Every CJS example is evaluated from its exact authored field. ESM is
  // deliberately excluded here and materialized as two real files below.
  const expected = new Map([
    [
      "Trace identity and conversion",
      [[1], [true], [false], [false, true], [0]],
    ],
    ["First eligible age: boundary and empty input", [[18], [null]]],
    [
      "String operations return new values",
      [["javascript"], [" JavaScript "], ["Java"]],
    ],
    ["Two different block behaviors", [["inner"], ["outer", 7]]],
    [
      "Keep the comparison inside an explicit function",
      [["ready"], ["ReferenceError"], ["ready"]],
    ],
    ["Read after the creating call returns", [[2]]],
    ["Defaults are undefined-only", [[20, 20, null, 0]]],
    ["An expression returns; a block needs return", [[6], [undefined]]],
    ["An arrow retains the explicit method boundary", [[7], [7]]],
    ["Renaming and defaults have their own rules", [[null, 20, 0]]],
    ["An instance owns its name, not its method", [[true], [false], ["Ada"]]],
    [
      "Different questions, different result shapes",
      [[[2, 4, 6]], [[2, 3]], [undefined], [false], [true]],
    ],
    ["Select, then transform: unchanged input", [[[6, 8]], [[]]]],
    ["A total with a defined empty case", [[5, 0]]],
    [
      "Counts, first-seen order and object identity",
      [
        [
          [
            ["js", 2],
            ["css", 1],
          ],
        ],
        [["js", "css"]],
        [2, 1],
        [true],
      ],
    ],
    ["Run cleanup without swallowing the work failure", [["cleanup"], [7]]],
    ["The awaited rejection reaches this catch", [["offline"]]],
    ["Join results before using them", [[5]]],
    [
      "Run together inside one fresh timer callback",
      [["current"], ["still current"], ["queued"]],
    ],
  ]);
  const esm = example("totals.mjs — Node 22.23.4 ESM");
  const examples = publishedExamples.filter((item) => item !== esm);
  equal(
    examples.map((item) => item.label),
    [...expected.keys()],
  );
  for (const item of examples) {
    if (item.label === "Run together inside one fresh timer callback") {
      await new Promise((resolve) =>
        setTimeout(() => {
          execute(item.code, undefined, logs);
          queueMicrotask(resolve);
        }, 0),
      );
    } else await execute(item.code, undefined, logs);
    equal(logs.splice(0), expected.get(item.label));
  }

  const normalize = execute(
    activity("normalize-labels").solution.code,
    "normalizeLabels",
  );
  for (const [input, result] of [
    [" JS, css , JS, ", ["js", "css", "js"]],
    ["", []],
    [" , ", []],
    ["X,,x", ["x", "x"]],
  ])
    equal(normalize(input), result);
  const eligible = execute(
    example("First eligible age: boundary and empty input").code,
    "firstEligibleAge",
    logs,
  );
  logs.length = 0;
  for (const [ages, minimum, result] of [
    [[15, 18, 21], 18, 18],
    [[], 18, null],
    [[15], 18, null],
    [[0], 0, 0],
  ])
    equal(eligible(ages, minimum), result);
  const total = execute(activity("rest-total").solution.code, "total");
  equal(
    [total(), total(2, 3), total(0, -2, 2), total(...[2, 3])],
    [0, 5, 0, 5],
  );
  const read = execute(activity("read-settings").solution.code, "readPageSize");
  equal(
    [
      undefined,
      null,
      {},
      { pageSize: undefined },
      { pageSize: null },
      { pageSize: 0 },
      { pageSize: 7 },
    ].map(read),
    [20, 20, 20, 20, 20, 0, 7],
  );
  const unique = execute(
    activity("first-unique-label").solution.code,
    "firstUniqueLabel",
  );
  for (const [input, result] of [
    [[], null],
    [["js"], "js"],
    [["js", "js"], null],
    [["js", "css", "js", "html"], "css"],
    [["JS", "js"], "JS"],
    [[""], ""],
    [["js", "js", ""], ""],
    [["__proto__", "x", "x"], "__proto__"],
  ]) {
    equal(unique(Object.freeze(input)), result);
  }
  const { runChecked, recoverInput } = execute(
    example("Run cleanup without swallowing the work failure").code,
    "({runChecked, recoverInput})",
    logs,
  );
  logs.length = 0;
  const cleaned = [];
  equal(
    runChecked(
      2,
      () => 7,
      () => cleaned.push("success"),
    ),
    7,
  );
  const unexpected = new TypeError("finite number required");
  throws(
    () =>
      runChecked(
        2,
        () => {
          throw unexpected;
        },
        () => cleaned.push("failure"),
      ),
    (error) => error === unexpected,
  );
  throws(
    () =>
      recoverInput(
        2,
        () => {
          throw unexpected;
        },
        () => cleaned.push("rethrow"),
      ),
    (error) => error === unexpected,
  );
  equal(
    recoverInput(
      NaN,
      () => {
        throw new Error("must not run");
      },
      () => cleaned.push("invalid"),
    ),
    null,
  );
  equal(cleaned, ["success", "failure", "rethrow", "invalid"]);
  const outcomes = execute(
    activity("partial-results").solution.code,
    "collectOutcomes",
  );
  const first = deferred();
  const report = outcomes([first.promise, Promise.reject("offline")]);
  first.resolve(2);
  equal(await report, [
    { status: "fulfilled", value: 2 },
    { status: "rejected", reason: "offline" },
  ]);
  equal(await outcomes([]), []);

  // Use a fresh directory for each run. A missing/stale fixture cannot masquerade
  // as the intended named-export error, and imports are never rewritten/evaled.
  const directory = mkdtempSync(join(tmpdir(), "javascript-published-esm-"));
  try {
    writeFileSync(join(directory, "totals.mjs"), esm.code);
    const path = join(directory, "main.mjs");
    writeFileSync(path, activity("module-boundary").starter.code);
    const brokenModule = spawnSync(process.execPath, [path], {
      encoding: "utf8",
    });
    equal(brokenModule.error, undefined);
    equal(brokenModule.status, 1);
    equal(brokenModule.stdout, "");
    equal(
      /does not provide an export named 'total'/.test(brokenModule.stderr),
      true,
    );
    writeFileSync(path, activity("module-boundary").solution.code);
    const repairedModule = spawnSync(process.execPath, [path], {
      encoding: "utf8",
    });
    equal(repairedModule.error, undefined);
    equal(repairedModule.status, 0);
    equal(repairedModule.stderr, "");
    equal(repairedModule.stdout.trim(), "USD 5 0");
  } finally {
    rmSync(directory, { recursive: true, force: true });
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
        workedExamples: publishedExamples.length,
        esm: "two real .mjs files, named-export failure then USD 5 0",
        assertions,
        status: "passed",
        limits:
          "Controlled save promises and isolated timer callbacks; real ESM import/export checks; no timer-duration, browser, ESM scheduling or I/O ordering claim.",
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
