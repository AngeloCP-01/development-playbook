import type { Cheatsheet } from './types'

// Original teaching and exercises; source mapping in reference/javascript-source-research.md.
export const javascript: Cheatsheet = {
  slug: 'javascript',
  title: 'JavaScript',
  group: 'Languages',
  blurb:
    'Study JavaScript mechanisms through seven focused sections, worked examples and nine small activities. Predict, explain and repair code; representative interview practice, not a frequency ranking.',
  source: {
    title: 'JavaScript Guide',
    author: 'MDN contributors',
    url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide',
  },
  additionalSources: [
    {
      title: 'Equality comparisons and sameness',
      author: 'MDN contributors',
      url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Equality_comparisons_and_sameness',
    },
    {
      title: 'let: scope and temporal dead zone',
      author: 'MDN contributors',
      url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let',
    },
    {
      title: 'Closures',
      author: 'MDN contributors',
      url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Closures',
    },
    {
      title: 'this',
      author: 'MDN contributors',
      url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this',
    },
    {
      title: 'Spread syntax',
      author: 'MDN contributors',
      url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax',
    },
    {
      title: 'Inheritance and the prototype chain',
      author: 'MDN contributors',
      url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Inheritance_and_the_prototype_chain',
    },
    {
      title: 'Array: choosing methods and avoiding mutation',
      author: 'MDN contributors',
      url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array',
    },
    {
      title: 'forEach: callback results and promises',
      author: 'MDN contributors',
      url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach',
    },
    {
      title: 'Using promises',
      author: 'MDN contributors',
      url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises',
    },
    {
      title: 'Event loops (browser host)',
      author: 'WHATWG HTML Living Standard',
      url: 'https://html.spec.whatwg.org/multipage/webappapis.html#event-loops',
    },
    {
      title: 'The Node.js event loop',
      author: 'Node.js project',
      url: 'https://nodejs.org/learn/asynchronous-work/event-loop-timers-and-nexttick',
    },
    {
      title: 'Data types and data structures',
      author: 'MDN contributors',
      url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Data_structures',
    },
    {
      title: 'Nullish coalescing',
      author: 'MDN contributors',
      url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing',
    },
    {
      title: 'Function bind',
      author: 'MDN contributors',
      url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind',
    },
    {
      title: 'Array reduce',
      author: 'MDN contributors',
      url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce',
    },
  ],
  sections: [
    {
      title: 'Values and equality',
      study: {
        id: 'values',
        label: 'Values',
        hint: 'Choose by meaning, not truthiness',
        activityIds: ['valid-default'],
      },
      note: 'Keep valid input while distinguishing values, identity and conversion. All examples use Node 22.23.4, strict CommonJS (.cjs with "use strict"). Explain it: when should zero count as a supplied value?',
      rows: [
        {
          term: 'Values and references',
          what: 'A primitive, such as a number, boolean or string, is an immutable value. An object can be mutated. Assigning an object value to another binding gives both bindings access to the same object; making a new object creates a different identity even if its fields look equal. Strict equality (===) compares without type conversion: 0 and the string "0" have different types, so they are not strictly equal. Loose equality (==) applies defined conversions; in this example the string becomes a number, producing true. Number("0") makes that conversion explicit.',
          when: 'Common mistake: treating equal-looking objects as equal references. JavaScript passes argument values; an object argument is not a new copy of its contents.',
          example: [
            {
              label: 'Trace identity and conversion',
              code: `const original = { count: 0 };
const alias = original;
alias.count = 1;
console.log(original.count);          // 1
console.log(alias === original);      // true
console.log({ count: 1 } === alias);  // false
console.log(0 === '0', 0 == '0');      // false, true
console.log(Number('0'));             // 0`,
            },
          ],
        },
        {
          term: 'Absence, defaults and equality',
          what: 'undefined often marks a missing value; null is an explicit absence by convention. Both are nullish. The ?? operator falls back only for those two values. The || operator instead falls back for every falsy value, including 0, false and empty text. Both short-circuit, so the right expression runs only when a fallback is needed.',
          when: "Common mistake: using a default as validation. ?? preserves NaN, and Number('') is 0. Validate the allowed type and range separately. NaN === NaN is false; Number.isNaN detects it. Object.is treats NaN as equal to itself and distinguishes signed zero, so it is not a universal replacement for ===.",
        },
      ],
    },
    {
      title: 'Scope and closures',
      study: {
        id: 'scope',
        label: 'Scope',
        hint: 'Trace bindings before tracing calls',
        activityIds: ['tdz-trace', 'closure-counter'],
      },
      note: 'Locate the binding a function reads, then track when it becomes usable. Explain it: why can a name be in scope but still throw when read?',
      rows: [
        {
          term: 'Blocks, functions and initialization',
          what: 'let and const belong to their enclosing block. var belongs to the containing function; top-level behavior depends on script, module and host context. A plain nested block does not contain it. An inner let or const shadows an outer name throughout its block. Before its declaration initializes that binding, reads throw ReferenceError: this interval is the temporal dead zone.',
          when: 'Common mistake: saying let does not exist until its line runs. The binding already shadows the outer name. typeof an undeclared name can return "undefined", but typeof a binding in its temporal dead zone throws. const prevents reassignment, not property mutation.',
          example: [
            {
              label: 'Two different block behaviors',
              code: `let label = 'outer';
{
  let label = 'inner';
  var escaped = 7;
  console.log(label); // inner
}
console.log(label, escaped); // outer, 7`,
            },
          ],
        },
        {
          term: 'A closure keeps access to a binding',
          what: 'A function carries access to the lexical environment in which it was created, even after the surrounding call returns. It reads the current binding rather than a frozen snapshot. In the example, set changes the same value that read later observes. A separate makeReader call would create another value binding.',
          when: 'Common mistake: putting private state outside a factory when instances need independent state. Calls through one returned function share that factory invocation’s bindings; separate factory calls can keep separate bindings.',
          example: [
            {
              label: 'Read after the creating call returns',
              code: `function makeReader() {
  let value = 1;
  return {
    read: () => value,
    set: (next) => { value = next; },
  };
}
const reader = makeReader();
reader.set(2);
console.log(reader.read()); // 2`,
            },
          ],
        },
      ],
    },
    {
      title: 'Functions and this',
      study: {
        id: 'functions',
        label: 'Functions',
        hint: 'Separate the function from its receiver',
        activityIds: ['receiver-repair'],
      },
      note: 'Follow arguments, return values and the call site. Explain it: what information disappears when a method is passed as a callback?',
      rows: [
        {
          term: 'Functions as values and callbacks',
          what: 'A function declaration names a callable value; an expression or arrow can produce a function value too. Parameters receive arguments, and return supplies the result. Falling through without returning produces undefined. Passing a callback passes the function itself; the receiving code decides when and how to call it.',
          when: 'Common mistake: writing a block-bodied arrow without return when a result is required. Do not call a callback while registering it unless you mean to pass its result.',
          example: [
            {
              label: 'An expression returns; a block needs return',
              code: `const double = (value) => value * 2;
const forgot = (value) => { value * 2; };
console.log(double(3)); // 6
console.log(forgot(3)); // undefined`,
            },
          ],
        },
        {
          term: 'Ordinary receivers and lexical arrows',
          what: 'For an ordinary function, the receiver follows the call. meter.read() supplies meter as this. A detached strict call supplies undefined, so reading this.value throws. bind creates a new function that preserves the receiver; it neither calls nor changes the original function. An arrow instead retains the surrounding this binding.',
          when: 'Common mistake: expecting an object literal to bind an arrow to that object. Create an arrow inside an ordinary method when it should retain that method call’s receiver. Calling bind on that arrow cannot replace its lexical this; avoid host-dependent top-level this puzzles.',
          example: [
            {
              label: 'An arrow retains the explicit method boundary',
              code: `const meter = {
  value: 7,
  makeReader() { return () => this.value; },
};
const read = meter.makeReader();
console.log(read());                         // 7
console.log(read.bind({ value: 99 })());     // 7`,
            },
          ],
        },
      ],
    },
    {
      title: 'Objects and prototypes',
      study: {
        id: 'objects',
        label: 'Objects',
        hint: 'Distinguish own state, inherited behavior and shared references',
        activityIds: ['nested-copy'],
      },
      note: 'Trace property lookup and a changed object path. Explain it: what does an instance own, and what can it find through its prototype?',
      rows: [
        {
          term: 'Own properties and inherited methods',
          what: 'Read a property with dot notation for a known name or brackets for a computed key. Lookup checks the object’s own properties, then follows its prototype chain until a match or null. An own property can shadow an inherited one. Class syntax uses this mechanism: ordinary instance methods live on the class prototype, while this.name below creates an own field.',
          when: 'Common mistake: assuming every constructor call copies the method into the instance. Instances share the prototype method; their own state can differ.',
          example: [
            {
              label: 'An instance owns its name, not its method',
              code: `class Account {
  constructor(name) { this.name = name; }
  label() { return this.name; }
}
const account = new Account('Ada');
console.log(Object.hasOwn(account, 'name'));  // true
console.log(Object.hasOwn(account, 'label')); // false
console.log(account['label']());             // Ada`,
            },
          ],
        },
        {
          term: 'A new outer object can still share nested state',
          what: 'Object spread copies own enumerable properties into a new outer object. If a property holds an object, the copied property still refers to that nested object. Copy every object on the path you intend to change when the original must remain untouched; untouched sibling objects may deliberately stay shared.',
          when: 'Common mistake: calling spread a deep clone. It does not copy the source prototype or non-enumerable properties either. The repair below concerns plain data objects; it is not a general cloning algorithm.',
        },
      ],
    },
    {
      title: 'Arrays',
      study: {
        id: 'arrays',
        label: 'Arrays',
        hint: 'Choose the result shape and check mutation',
        activityIds: ['collection-result', 'numeric-sort'],
      },
      note: 'Transform, select, aggregate and order values without surprising the caller. Explain it: which method expresses the result you need, and what happens on empty input?',
      rows: [
        {
          term: 'Choose by the result you need',
          what: 'map produces a transformed array; filter keeps all matches; find returns the first matching value or undefined. some asks whether at least one item matches, while every asks whether all do. Iteration fits side effects when no transformed result is needed. Array copies remain shallow, and callbacks can mutate the objects inside them.',
          when: 'Common mistake: confusing no matches with an empty result of the same type. On an empty array, some is false, every is true, find is undefined, and map/filter return empty arrays.',
          example: [
            {
              label: 'Different questions, different result shapes',
              code: `const values = [1, 2, 3];
console.log(values.map(n => n * 2));    // [2, 4, 6]
console.log(values.filter(n => n > 1)); // [2, 3]
console.log(values.find(n => n > 5));   // undefined
console.log(values.some(n => n > 5));   // false
console.log([].every(n => n > 5));      // true`,
            },
          ],
        },
        {
          term: 'Aggregate explicitly; sort deliberately',
          what: 'reduce passes the returned accumulator into the next callback. An explicit starting value explains the result for an empty collection. For sorting, sort changes its input array, whereas toSorted creates a sorted copy. Default ordering compares strings; an ascending numeric comparator returns a - b.',
          when: 'Common mistake: omitting the initial accumulator and then failing on an empty array, or mutating a caller’s input with sort. A loop may be clearer than reduce for complicated logic.',
          example: [
            {
              label: 'A total with a defined empty case',
              code: `const sum = values => values.reduce((total, n) => total + n, 0);
console.log(sum([2, 3]), sum([])); // 5, 0`,
            },
          ],
        },
      ],
    },
    {
      title: 'Promises and errors',
      study: {
        id: 'async',
        label: 'Promises',
        hint: 'Keep completion and failure observable',
        activityIds: ['async-iteration'],
      },
      note: 'Track the promise returned to the caller, then decide whether operations depend on one another. Explain it: what must a caller await to catch a failure?',
      rows: [
        {
          term: 'Return the chain; await inside the catch boundary',
          what: 'A promise represents eventual fulfillment or rejection. then returns another promise: returning a value fulfills the next link, while throwing rejects it. An async function returns a promise too. await suspends that function until the value settles; a rejection throws at the await, where a surrounding try/catch can observe it.',
          when: 'Common mistake: starting asynchronous work without returning or awaiting it. The caller can then report success before the work finishes, and a surrounding synchronous try/catch cannot observe a later rejection.',
          example: [
            {
              label: 'The awaited rejection reaches this catch',
              code: `async function read() { throw new Error('offline'); }
async function show() {
  try { await read(); }
  catch (error) { console.log(error.message); }
}
show(); // offline`,
            },
          ],
        },
        {
          term: 'Sequential dependencies or concurrent initiation',
          what: 'Use for...of with await when one operation must finish before the next begins. For independent work, Promise.all joins the input promises and returns results in input order, regardless of completion order. It rejects when an input rejects; it does not cancel work already started. Concurrent initiation is not a guarantee of parallel JavaScript execution.',
          when: 'Common mistake: awaiting forEach and assuming it joins async callbacks. forEach discards callback results. The local repair asks for sequential completion, so starting all saves together would change its requirement.',
          example: [
            {
              label: 'Join results before using them',
              code: `async function total() {
  const values = await Promise.all([
    Promise.resolve(2), Promise.resolve(3),
  ]);
  return values[0] + values[1];
}
total().then(value => console.log(value)); // 5`,
            },
          ],
        },
      ],
    },
    {
      title: 'Scheduling',
      study: {
        id: 'scheduling',
        label: 'Scheduling',
        hint: 'Separate current work, enqueued work and host rules',
        activityIds: ['scheduling-trace'],
      },
      note: 'Predict one isolated callback before making broader claims about a runtime. Explain it: does a zero-delay timer get to interrupt current synchronous code?',
      rows: [
        {
          term: 'Finish current code before queued callbacks',
          what: 'Current synchronous statements run to completion. A fulfilled promise can enqueue a reaction; queueMicrotask explicitly enqueues another microtask. In the worked example, queued waits for both synchronous lines. Microtasks added in this isolated context run in enqueue order before the later timer in the practice trace.',
          when: 'Common mistake: reading the position of a callback’s function body in the source as its execution time. Enqueuing it and running it are separate events.',
          example: [
            {
              label: 'Run together inside one fresh timer callback',
              code: `console.log('current');
queueMicrotask(() => console.log('queued'));
console.log('still current');
// current, still current, queued`,
            },
          ],
        },
        {
          term: 'Keep the host boundary visible',
          what: 'A zero-delay timer cannot interrupt the current callback, and its delay is a threshold rather than an exact execution time. Browser tasks and microtask checkpoints are a browser host model. Node has event-loop phases; the terms are not interchangeable. The examples deliberately avoid unrelated work.',
          when: 'Common mistake: turning this trace into a browser paint rule or a timer-versus-I/O prediction. It establishes no nextTick/setImmediate, ES-module evaluation or I/O-phase ordering claim. Moving an enqueue can change microtask order without changing which lines are synchronous.',
        },
      ],
    },
  ],
  activities: [
    {
      id: 'closure-counter',
      title: 'Closure factory',
      prompt:
        'Implement makeCounter so each factory call starts at zero and returns a function that increments before returning. Predict the three logged values, then explain which invocation owns each count binding.',
      context:
        'Node 22.23.4, strict CommonJS. The starter intentionally leaves the factory body for you to write. Run the reference as a .cjs file with "use strict" at the top.',
      starter: {
        label: 'Starter: complete the factory',
        code: `function makeCounter() {
  // Return an incrementing counter.
}
const first = makeCounter();
const second = makeCounter();
console.log(first(), first(), second());`,
      },
      answer:
        'The reference logs 1, 2, 1. Further calls through first and second return 3 and 2.',
      solution: {
        label: 'Reference solution',
        code: `function makeCounter() {
  let count = 0;
  return () => ++count;
}
const first = makeCounter();
const second = makeCounter();
console.log(first(), first(), second());`,
      },
      explanation:
        'Each makeCounter call creates its own count binding. The function returned as first keeps access to the first binding and changes it on each call. second retains the other binding. Both functions access live bindings.',
      followUp:
        'Move count outside makeCounter. Predict the same calls when both returned functions now share one binding.',
    },
    {
      id: 'nested-copy',
      title: 'Nested-copy repair',
      prompt:
        'The spread copy below unexpectedly changes original. Explain why, then repair the update so original stays light and the updated settings object is distinct. Start the repair from fresh input.',
      context:
        'Node 22.23.4, strict CommonJS. Each block starts with a fresh plain object. Add "use strict" at the top of its .cjs file.',
      starter: {
        label: 'Bug: one level copied',
        code: `const original = { name: 'Ada', settings: { theme: 'light' } };
const copy = { ...original };
copy.settings.theme = 'dark';
console.log(original.settings.theme);
console.log(copy.settings === original.settings);`,
      },
      answer:
        'The bug logs dark and true. The repaired block logs light, dark and false. Running a repair after the bug without fresh input would not undo the earlier mutation.',
      solution: {
        label: 'Repair: copy the changed path',
        code: `const original = { name: 'Ada', settings: { theme: 'light' } };
const updated = {
  ...original,
  settings: { ...original.settings, theme: 'dark' },
};
console.log(original.settings.theme, updated.settings.theme);
console.log(updated.settings === original.settings);`,
      },
      explanation:
        'The first spread creates a different outer object but copies the settings reference. The repair creates a new settings object before changing theme, leaving the fresh original untouched. Only the changed path needs copying here.',
      followUp:
        'Add an untouched sibling object named profile. It can deliberately stay shared; explain why that does not make the settings repair fail.',
    },
    {
      id: 'async-iteration',
      title: 'Async iteration repair',
      prompt:
        'save returns a promise. Repair saveAll so saves finish one at a time in input order, complete is reported only after the last save, and a rejection reaches the awaited caller. What happens to item 3 if saving item 2 fails?',
      context:
        'Node 22.23.4, strict CommonJS. Function definitions below take items and an injected save(item); no top-level await is needed. To try them, call report(items, save) from your async harness. Saves in the completion check are deliberately held pending.',
      starter: {
        label: 'Bug: completion before saves finish',
        code: `async function saveAll(items, save) {
  await items.forEach(async (item) => {
    await save(item);
  });
  return 'complete';
}`,
      },
      answer:
        'The bug can return complete while saves are pending. The repair finishes saving 1 before starting 2. If save 2 rejects, saveAll rejects with that error and item 3 never starts; report catches the error from its awaited call.',
      solution: {
        label: 'Repair and awaited caller',
        code: `async function saveAll(items, save) {
  for (const item of items) {
    await save(item);
  }
  return 'complete';
}

async function report(items, save) {
  try {
    console.log(await saveAll(items, save));
  } catch (error) {
    console.error(error.message);
  }
}`,
      },
      explanation:
        'forEach returns undefined and discards the promises returned by its async callbacks. Awaiting that return value cannot join them. The for...of repair awaits each save and propagates failure. With successful saves the caller logs complete only after all saves finish.',
      followUp:
        'If saves are independent and may start together, await Promise.all(items.map(save)) can join them instead. It rejects when an input rejects, but does not cancel saves already started. Choose this only when sequential completion is not required.',
    },
    {
      id: 'scheduling-trace',
      title: 'Scheduling trace',
      prompt:
        'Predict the five log lines and explain why the zero-delay timer cannot run between the two synchronous lines. Account for both the promise reaction and queueMicrotask registration.',
      context:
        'Node 22.23.4, strict CommonJS. Execute these statements together inside one fresh timer callback, with no unrelated work. This isolates the trace from earlier async continuations; it is an order check, not a timer-duration check.',
      starter: {
        label: 'Predict this isolated trace',
        code: `console.log('sync 1');
Promise.resolve().then(() => console.log('promise'));
queueMicrotask(() => console.log('microtask'));
setTimeout(() => console.log('timer'), 0);
console.log('sync 2');`,
      },
      answer: 'sync 1, sync 2, promise, microtask, timer.',
      explanation:
        'The current synchronous statements finish first. The fulfilled promise queues its reaction before queueMicrotask queues the next callback, so those run in that order before the timer. A timer delay is a threshold, not an appointment. This trace establishes no browser rendering, Node I/O-phase race, nextTick/setImmediate or ES-module ordering claim.',
      followUp:
        'Move the queueMicrotask statement above Promise.resolve. Predict sync 1, sync 2, microtask, promise, timer: the synchronous lines still finish first, but the enqueue order changes.',
    },
    {
      id: 'valid-default',
      title: 'Preserve valid defaults',
      prompt:
        'Repair fallback so 0, false and empty text stay supplied values, while null and undefined become missing. Predict the full output before revealing the repair. Does your operator also validate numeric input?',
      context:
        'Node 22.23.4, strict CommonJS. Run each block separately in a .cjs file with "use strict" at the top. Inputs are supplied in the snippet.',
      starter: {
        label: 'Bug: valid values disappear',
        code: `function fallback(value) { return value || 'missing'; }
console.log([0, false, '', null, undefined].map(fallback));`,
      },
      answer:
        'The bug returns five missing strings. The repair returns [0, false, "", "missing", "missing"].',
      solution: {
        label: 'Repair: default only for absence',
        code: `function fallback(value) { return value ?? 'missing'; }
console.log([0, false, '', null, undefined].map(fallback));`,
      },
      explanation:
        '?? chooses the right value only for null or undefined. It preserves the other inputs even though they are falsy. This is an absence policy, not validation: NaN would remain NaN.',
      followUp:
        'Choose a separate validation rule for a nonnegative finite quantity. Explain why defaulting and validating answer different questions.',
    },
    {
      id: 'tdz-trace',
      title: 'Shadowing and initialization',
      prompt:
        'Predict the log sequence. Explain why the inner read cannot use the outer value, even though the inner initialization appears later. What changes if the inner declaration becomes var?',
      context:
        'Node 22.23.4, strict CommonJS. Run each block separately in a .cjs file with "use strict" at the top. Inputs are supplied in the snippet. The explicit function keeps the var follow-up function-scoped rather than host-global.',
      starter: {
        label: 'Trace the inner name',
        code: `function inspect() {
  let value = 'outer';
  try {
    console.log(value);
    { console.log(value); let value = 'inner'; }
  } catch (error) { console.log(error.name); }
  console.log(value);
}
inspect();`,
      },
      answer:
        'The logs are outer, ReferenceError, outer. The inner initialization is never reached.',
      explanation:
        'The inner lexical binding shadows the outer binding throughout the nested block, but is uninitialized at the read. The catch observes its temporal-dead-zone error; execution then continues after the try/catch. Replacing inner let with var is a SyntaxError here, because var would conflict with the function’s existing let value.',
      followUp:
        'Read typeof value in the inner block before initialization. It still throws; typeof only avoids an error for an undeclared name.',
    },
    {
      id: 'receiver-repair',
      title: 'Repair a detached receiver',
      prompt:
        'The detached function below throws in strict mode. Supply a callback named read that returns 7 when invoked without a receiver. Explain both bind and a wrapper alternative; could binding an arrow replace its captured this?',
      context:
        'Node 22.23.4, strict CommonJS. Run each block separately in a .cjs file with "use strict" at the top. Inputs are supplied in the snippet.',
      starter: {
        label: 'Bug: the method loses its receiver',
        code: `const meter = { value: 7, read() { return this.value; } };
const read = meter.read;
console.log(read());`,
      },
      answer:
        'The bug throws TypeError. The bound callback in the repair logs 7.',
      solution: {
        label: 'Repair: carry the receiver with the function',
        code: `const meter = { value: 7, read() { return this.value; } };
const read = meter.read.bind(meter);
console.log(read());`,
      },
      explanation:
        'Detachment keeps the function value but loses the method call’s receiver. bind creates a new function that carries meter. A wrapper, () => meter.read(), also works by making a method call when invoked; it looks up the current method at that time. An arrow already has lexical this, so bind cannot replace it.',
      followUp:
        'Replace meter.read after creating each callback. The bound callback keeps the original function; the wrapper looks up the replacement when called.',
    },
    {
      id: 'collection-result',
      title: 'Transform a collection',
      prompt:
        'Implement doubledAboveTwo: keep numbers greater than 2, double them, and return the resulting array. Keep input unchanged. What should an empty input produce, and why would forEach be a poor return-value choice?',
      context:
        'Node 22.23.4, strict CommonJS. Run each block separately in a .cjs file with "use strict" at the top. Inputs are supplied in the snippet.',
      starter: {
        label: 'Starter: choose by result shape',
        code: `function doubledAboveTwo(values) {
  // Return the selected, doubled values.
}
console.log(doubledAboveTwo([1, 3, 2, 4]));
console.log(doubledAboveTwo([]));`,
      },
      answer:
        'The reference logs [6, 8] and []. The original array keeps its original values.',
      solution: {
        label: 'Reference: select, then transform',
        code: `function doubledAboveTwo(values) {
  return values.filter(n => n > 2).map(n => n * 2);
}
console.log(doubledAboveTwo([1, 3, 2, 4]));
console.log(doubledAboveTwo([]));`,
      },
      explanation:
        'filter keeps the requested values and map returns their transformed values. Empty input flows through both as an empty array. forEach returns undefined rather than a transformed result. These number callbacks do not mutate input; object callbacks would still need a separate mutation check.',
      followUp:
        'Would some or find express the same request? Explain their different result shapes.',
    },
    {
      id: 'numeric-sort',
      title: 'Sort without mutating input',
      prompt:
        'Repair sorted so it returns ascending numbers while leaving the caller’s array unchanged. Predict the default sort result and the original array after the buggy call. Include empty input in your check.',
      context:
        'Node 22.23.4, strict CommonJS. Run each block separately in a .cjs file with "use strict" at the top. Inputs are supplied in the snippet.',
      starter: {
        label: 'Bug: default ordering and mutation',
        code: `function sorted(values) { return values.sort(); }
const values = [10, 2, 1];
console.log(sorted(values));
console.log(values);`,
      },
      answer:
        'The bug logs [1, 10, 2] twice. The repair logs [1, 2, 10] and then the unchanged [10, 2, 1]. It returns a distinct empty array for empty input.',
      solution: {
        label: 'Repair: copying numeric sort',
        code: `function sorted(values) { return values.toSorted((a, b) => a - b); }
const values = [10, 2, 1];
console.log(sorted(values));
console.log(values);`,
      },
      explanation:
        'sort orders string forms by default and mutates the array it receives. toSorted copies the array and uses the numeric comparator. Its copy is shallow: sorting objects would still preserve their identities.',
      followUp:
        'Compare [...values].sort((a, b) => a - b) with this repair. Both copy the outer array before returning the sorted result.',
    },
  ],
}
