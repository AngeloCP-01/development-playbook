import type { Cheatsheet } from './types'

// Original teaching and exercises; source mapping in reference/javascript-source-research.md.
export const javascript: Cheatsheet = {
  slug: 'javascript',
  title: 'JavaScript',
  group: 'Languages',
  blurb:
    'Write, debug and explain JavaScript through eight focused sections. Open a topic for worked examples and local practice, then compare your reasoning with the solution.',
  source: {
    title: 'JavaScript Guide',
    author: 'MDN contributors',
    url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide',
  },
  additionalSources: [
    {
      title: 'Promise constructor',
      author: 'MDN contributors',
      url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/Promise',
    },
    {
      title: 'Promise.then',
      author: 'MDN contributors',
      url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/then',
    },
    {
      title: 'Promise.finally',
      author: 'MDN contributors',
      url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/finally',
    },

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
    {
      title: 'Control flow and error handling',
      author: 'MDN contributors',
      url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Control_flow_and_error_handling',
    },
    {
      title: 'Loops and iteration',
      author: 'MDN contributors',
      url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Loops_and_iteration',
    },
    {
      title: 'Text formatting',
      author: 'MDN contributors',
      url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Text_formatting',
    },
    {
      title: 'Keyed collections',
      author: 'MDN contributors',
      url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Keyed_collections',
    },
    {
      title: 'Default and rest parameters',
      author: 'MDN contributors',
      url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions',
    },
    {
      title: 'Destructuring',
      author: 'MDN contributors',
      url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring',
    },
    {
      title: 'Optional chaining',
      author: 'MDN contributors',
      url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining',
    },
    {
      title: 'Promise.allSettled',
      author: 'MDN contributors',
      url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled',
    },
    {
      title: 'Map access guarantees',
      author: 'MDN contributors',
      url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map',
    },
    {
      title: 'JavaScript modules',
      author: 'MDN contributors',
      url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules',
    },
  ],
  sections: [
    {
      title: 'Fundamentals',
      study: {
        id: 'values',
        label: 'Fundamentals',
        hint: 'Choose by meaning, not truthiness',
      },
      note: 'Keep valid input while distinguishing values, identity and conversion. Examples use modern JavaScript; run independent blocks as strict scripts (add "use strict") or as ECMAScript modules. Explain it: when should zero count as a supplied value?',
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
          study: {
            id: 'identity',
            summary: 'Compare values, types and shared object identity.',
            activityIds: [],
          },
        },
        {
          term: 'Absence, defaults and equality',
          what: 'undefined often marks a missing value; null is an explicit absence by convention. Both are nullish. The ?? operator falls back only for those two values. The || operator instead falls back for every falsy value, including 0, false and empty text. Both short-circuit, so the right expression runs only when a fallback is needed.',
          when: "Common mistake: using a default as validation. ?? preserves NaN, and Number('') is 0. Validate the allowed type and range separately. NaN === NaN is false; Number.isNaN detects it. Object.is treats NaN as equal to itself and distinguishes signed zero, so it is not a universal replacement for ===.",
          study: {
            id: 'defaults',
            summary:
              'Choose absence rules without discarding valid falsy values.',
            activityIds: ['valid-default'],
          },
        },
        {
          term: 'Decisions, operators and loops',
          what: 'if/else selects a branch. Comparisons such as >= produce booleans; && and || short-circuit and return an operand, not necessarily a boolean. A conditional expression test ? yes : no selects one value. Use for...of for array values, an indexed for when the position matters, and while while a condition remains true. break exits a loop; continue skips to its next iteration. return exits the function. Here the first eligible value includes the minimum itself.',
          when: 'Common mistake: using > when the boundary is inclusive, forgetting a return after the loop, or using for...in (property keys) when you need array values. Explain it: why does the empty case reach null?',
          study: {
            id: 'decisions',
            summary: 'Write branches and stop at the first inclusive match.',
            activityIds: [],
          },
          example: [
            {
              label: 'First eligible age: boundary and empty input',
              code: `function firstEligibleAge(ages, minimum) {
  for (const age of ages) {
    if (age >= minimum) return age;
  }
  return null;
}
console.log(firstEligibleAge([15, 18, 21], 18)); // 18
console.log(firstEligibleAge([], 18));           // null`,
            },
          ],
        },
        {
          term: 'Process simple label text',
          what: 'Strings are immutable: trim, toLowerCase and slice return values rather than changing the original string. split separates text at a delimiter. For simple comma-delimited labels, trim each part, lowercase it, and skip empty results. Keep order and duplicates; this task is not deduplication.',
          when: 'Common mistake: forgetting to use a string method’s return value, or treating split as a full CSV parser. Inputs here are strings with simple commas; quoted CSV and Unicode normalization are outside the contract. Explain it: what should consecutive commas produce?',
          study: {
            id: 'strings',
            summary:
              'Split, trim and normalize labels without changing their order.',
            activityIds: ['normalize-labels'],
          },
          example: [
            {
              label: 'String operations return new values',
              code: `const text = ' JavaScript ';
console.log(text.trim().toLowerCase()); // javascript
console.log(text);                      // unchanged
console.log('JavaScript'.slice(0, 4));   // Java`,
            },
          ],
        },
      ],
    },
    {
      title: 'Scope and closures',
      study: {
        id: 'scope',
        label: 'Scope',
        hint: 'Trace bindings before tracing calls',
      },
      note: 'Modern JavaScript; run each block separately with \"use strict\". Locate the binding a function reads, then track when it becomes usable. Explain it: why can a name be in scope but still throw when read?',
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
          study: {
            id: 'initialization',
            summary: 'Find the binding and the moment it becomes usable.',
            activityIds: ['tdz-trace'],
          },
        },
        {
          term: 'Declaration availability and function values',
          what: 'An ordinary function declaration in a function body is available before its textual declaration. A const-held function expression cannot be read until the const initialization runs. The runtime initializes the binding before execution reaches the declaration; it does not move source lines. Both forms produce callable values once initialized.',
          when: 'Common mistake: assuming every way to write a function has identical early-call behavior. Explain it: is the second failure caused by calling the function or by reading its uninitialized binding?',
          study: {
            id: 'declarations',
            summary:
              'Distinguish an early callable declaration from an uninitialized const.',
            activityIds: [],
          },
          example: [
            {
              label: 'Keep the comparison inside an explicit function',
              code: `function inspectFunctions() {
  console.log(declared()); // ready
  function declared() { return 'ready'; }
  try { held(); }
  catch (error) { console.log(error.name); } // ReferenceError
  const held = () => 'ready';
  console.log(held()); // ready
}
inspectFunctions();`,
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
          study: {
            id: 'closures',
            summary: 'Read live lexical state after the creating call returns.',
            activityIds: ['closure-counter'],
          },
        },
      ],
    },
    {
      title: 'Functions and this',
      study: {
        id: 'functions',
        label: 'Functions',
        hint: 'Separate the function from its receiver',
      },
      note: 'Modern JavaScript; run each block separately with \"use strict\". Follow arguments, return values and the call site. Explain it: what information disappears when a method is passed as a callback?',
      rows: [
        {
          term: 'Default parameters and rest arguments',
          what: 'A default parameter is used for an omitted argument or undefined, not null or zero. A rest parameter collects remaining arguments into an array; it must be last. Spread at a call does the reverse, supplying values from an iterable as separate arguments. Use a numeric contract here instead of silently accepting strings.',
          when: 'Common mistake: using a default as validation or confusing ...values in a declaration with ...values at a call. Explain it: why do both total() and total(...[]) return zero?',
          study: {
            id: 'arguments',
            summary:
              'Define missing arguments and collect a numeric rest list.',
            activityIds: ['rest-total'],
          },
          example: [
            {
              label: 'Defaults are undefined-only',
              code: `function choose(value = 20) { return value; }
console.log(choose(), choose(undefined), choose(null), choose(0));
// 20, 20, null, 0`,
            },
          ],
        },
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
          study: {
            id: 'callbacks',
            summary: 'Pass a callable value and return the result you intend.',
            activityIds: [],
          },
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
          study: {
            id: 'receivers',
            summary: 'Keep the ordinary receiver or retain lexical this.',
            activityIds: ['receiver-repair'],
          },
        },
      ],
    },
    {
      title: 'Objects and data',
      study: {
        id: 'objects',
        label: 'Objects',
        hint: 'Distinguish own state, inherited behavior and shared references',
      },
      note: 'Modern JavaScript; run each block separately with \"use strict\". Trace property lookup and a changed object path. Explain it: what does an instance own, and what can it find through its prototype?',
      rows: [
        {
          term: 'Destructure and read optional data',
          what: 'Dot access uses a known property name; brackets allow a computed key. Destructuring extracts properties and can rename them. A destructuring default applies only to undefined. Optional chaining stops at null or undefined and returns undefined; combine it with ?? when nullish data should use a fallback. These examples assume an absent setting or a plain object, not arbitrary validation inputs.',
          when: 'Common mistake: describing a destructuring default as a null fallback. An existing null stays null until you apply a separate nullish policy. Explain it: how does optional access differ from validating pageSize?',
          study: {
            id: 'properties',
            summary:
              'Extract fields and preserve zero when optional settings are absent.',
            activityIds: ['read-settings'],
          },
          example: [
            {
              label: 'Renaming and defaults have their own rules',
              code: `const { pageSize: size = 20 } = { pageSize: null };
const { pageSize: missing = 20 } = {};
const key = 'pageSize';
console.log(size, missing, { pageSize: 0 }[key]); // null, 20, 0`,
            },
          ],
        },
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
          study: {
            id: 'prototypes',
            summary: 'Follow own properties and shared prototype methods.',
            activityIds: [],
          },
        },
        {
          term: 'A new outer object can still share nested state',
          what: 'Object spread copies own enumerable properties into a new outer object. If a property holds an object, the copied property still refers to that nested object. Copy every object on the path you intend to change when the original must remain untouched; untouched sibling objects may deliberately stay shared.',
          when: 'Common mistake: calling spread a deep clone. It does not copy the source prototype or non-enumerable properties either. The repair below concerns plain data objects; it is not a general cloning algorithm.',
          study: {
            id: 'copying',
            summary: 'Copy the changed path while keeping the original intact.',
            activityIds: ['nested-copy'],
          },
        },
      ],
    },
    {
      title: 'Collections and problem solving',
      study: {
        id: 'arrays',
        label: 'Collections',
        hint: 'Choose the result shape and check mutation',
      },
      note: 'Modern JavaScript; run each block separately with \"use strict\". Transform, select, aggregate and order values without surprising the caller. Explain it: which method expresses the result you need, and what happens on empty input?',
      rows: [
        {
          term: 'Choose by the result you need',
          what: 'map produces a transformed array; filter keeps all matches; find returns the first matching value or undefined. some asks whether at least one item matches, while every asks whether all do. Iteration fits side effects when no transformed result is needed. Array copies remain shallow, and callbacks can mutate the objects inside them. The worked doubledAboveTwo example uses filter then map: numbers greater than 2 become doubled values, with [] for empty input and no change to the numeric input.',
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
            {
              label: 'Select, then transform: unchanged input',
              code: `function doubledAboveTwo(values) {
  return values.filter(n => n > 2).map(n => n * 2);
}
console.log(doubledAboveTwo([1, 3, 2, 4]));
console.log(doubledAboveTwo([]));`,
            },
          ],
          study: {
            id: 'array-results',
            summary: 'Select a result shape before choosing an array method.',
            activityIds: [],
          },
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
          study: {
            id: 'sorting',
            summary:
              'Define the empty total and avoid changing a caller’s order.',
            activityIds: ['numeric-sort'],
          },
        },
        {
          term: 'Map, Set and a key policy',
          what: 'Map associates keys with values; use get/set/has/delete and size rather than object-property access. Set stores unique values with add/has/delete and size. Both iterate in insertion order. A frequency Map can count labels without object-prototype key collisions. Primitive keys use SameValueZero equality (including NaN with itself); object keys compare by identity. Two records with equal fields remain distinct unless you choose a field as their deduplication key.',
          when: 'Common mistake: assuming new Set(records) deduplicates equal-looking records. Decide which key identifies a record and which duplicate wins. The example uses id and keeps the last record for a repeated id, in first-seen key order. Explain it: why is the Set size different from the keyed Map size?',
          study: {
            id: 'keyed-collections',
            summary:
              'Count values and choose whether identity or a field defines a duplicate.',
            activityIds: [],
          },
          example: [
            {
              label: 'Counts, first-seen order and object identity',
              code: `const labels = ['js', 'css', 'js'];
const counts = new Map();
for (const label of labels) counts.set(label, (counts.get(label) ?? 0) + 1);
console.log([...counts]); // [['js', 2], ['css', 1]]
console.log([...new Set(labels)]); // ['js', 'css']
const records = [{ id: 1 }, { id: 1 }];
const keyed = new Map(records.map(record => [record.id, record]));
console.log(new Set(records).size, keyed.size); // 2, 1
console.log(keyed.get(1) === records[1]);        // true`,
            },
          ],
        },
        {
          term: 'Plan, test and explain a small algorithm',
          what: 'Clarify the contract first: case-sensitive string labels, unchanged input, first value appearing exactly once, null when none exists. Plan two passes: count each label in a Map, then scan original order for a count of one. Two sequential passes still make a linear number of visits; they are not a nested loop. Counting each candidate by scanning the array again can take quadratic comparisons.',
          when: 'Tests should include an empty list, one label, all repeated labels, mixed case, and an empty-string label. Under expected constant-time Map access and unit-cost key operations, the plan takes expected O(n) time and O(k) auxiliary entries for k distinct labels (at most n). JavaScript requires average sublinear Map access, not universal O(1); long string-key costs depend on the representation. Explain it: why does the second pass preserve the requested order?',
          study: {
            id: 'problem-solving',
            summary:
              'Plan two passes, test edges and state the cost assumptions.',
            activityIds: ['first-unique-label'],
          },
        },
      ],
    },
    {
      title: 'Promises and errors',
      study: {
        id: 'async',
        label: 'Promises',
        hint: 'Keep completion and failure observable',
      },
      note: 'Modern JavaScript. Run independent demonstrations separately; combine the shared lookup fixture with the definitions and caller named by each example. The optional fixture implementation follows its contract and adapter.',
      rows: [
        {
          term: 'The function returns before its result arrives',
          what: 'Separate the callback’s return from the caller’s completion.',
          study: {
            id: 'callback-contract',
            summary:
              'Separate the callback’s return from the caller’s completion.',
            activityIds: [],
          },
          teaching: [
            {
              id: 'lookup-contract',
              kind: 'paragraph',
              text: "Our simulated readProfile(id, done) lookup calls done once, after the current synchronous code finishes. It passes either an error or a profile. ID 1 supplies { name: 'Ada' }; ID 99 reports “Profile 99 was not found”. There is no network request or timer-duration assumption. Treat this contract as given; its optional implementation appears after the promise adapter.",
            },
            {
              id: 'callback-caller',
              kind: 'code',
              label: 'A caller using the callback directly',
              code: "readProfile(1, (error, profile) => {\n  if (error) {\n    console.log(`caught: ${error.message}`);\n    return;\n  }\n  console.log(profile.name);\n});\nconsole.log('request started');",
            },
            {
              id: 'callback-output',
              kind: 'paragraph',
              text: 'With the lookup fixture, this prints request started, then Ada. Registering a callback does not wait for it to run. The caller continues; later, the lookup invokes the callback.',
            },
            {
              id: 'wrong-callback-return',
              kind: 'code',
              label: 'A return from the wrong function',
              code: "function wrongName(id) {\n  readProfile(id, (error, profile) => {\n    if (error) return 'Guest';\n    return profile.name;\n  });\n}\nconsole.log(wrongName(1)); // undefined",
            },
            {
              id: 'callback-boundary',
              kind: 'paragraph',
              text: 'There are two functions here. return profile.name returns from the callback. wrongName has already reached its end without returning a value, and readProfile ignores the callback’s return value. A longer lookup cannot change which function a return belongs to. The caller needs a completion contract.',
            },
          ],
        },
        {
          term: 'Return a promise now, observe its outcome later',
          what: 'Distinguish the promise object from its eventual value.',
          study: {
            id: 'promise-states',
            summary: 'Distinguish the promise object from its eventual value.',
            activityIds: [],
          },
          teaching: [
            {
              id: 'promise-model',
              kind: 'paragraph',
              text: 'A promise is an object representing an eventual outcome. The caller can receive that object immediately and attach work to its outcome. The lookup still decides when its result becomes available; creating a promise does not move work onto another JavaScript thread.',
            },
            {
              id: 'states',
              kind: 'table',
              label: 'Promise states in the lookup',
              columns: ['State', 'Meaning here', 'What the caller has'],
              rows: [
                [
                  'Pending',
                  'The callback has not supplied an outcome yet.',
                  'The promise object.',
                ],
                [
                  'Fulfilled',
                  'The lookup supplied a profile.',
                  'A fulfillment handler can receive that profile.',
                ],
                [
                  'Rejected',
                  'The lookup supplied an error.',
                  'A rejection handler can receive that reason.',
                ],
              ],
            },
            {
              id: 'settled',
              kind: 'paragraph',
              text: 'Fulfilled and rejected are the two settled states. Once settled, a promise cannot switch to the other result. Resolved is a different term: a promise can adopt another promise that is still pending. The adapter below resolves with a plain profile object, so that particular resolution fulfills it.',
            },
          ],
        },
        {
          term: 'Connect the callback to a returned promise',
          what: 'Identify the executor and the two functions supplied to it.',
          study: {
            id: 'promise-adapter',
            summary:
              'Identify the executor and the two functions supplied to it.',
            activityIds: [],
          },
          teaching: [
            {
              id: 'executor',
              kind: 'paragraph',
              text: 'Wrap this callback boundary once. The function passed to new Promise is its executor. The constructor calls it immediately and supplies resolve and reject, two functions tied to that new promise. We do not define these arguments ourselves.',
            },
            {
              id: 'promise-adapter-code',
              kind: 'code',
              label: 'The lookup adapter',
              code: 'function loadProfile(id) {\n  return new Promise((resolve, reject) => {\n    readProfile(id, (error, profile) => {\n      if (error) {\n        reject(error);\n        return;\n      }\n      resolve(profile);\n    });\n  });\n}',
            },
            {
              id: 'two-callbacks',
              kind: 'paragraph',
              text: 'The constructor invokes the executor now; readProfile invokes (error, profile) => ... later. That later callback retains access to resolve and reject. Calling resolve(profile) supplies the promise’s outcome; it does not return the profile from loadProfile.',
            },
            {
              id: 'adapter-trace',
              kind: 'table',
              label: 'From call to reaction',
              columns: ['Moment', 'What happens', 'What has returned?'],
              rows: [
                [
                  'Call loadProfile(1).',
                  'The constructor creates a promise and runs its executor.',
                  'loadProfile is still running.',
                ],
                [
                  'Call readProfile.',
                  'The lookup registers its later callback.',
                  'readProfile returns; the executor reaches its end.',
                ],
                [
                  'Return from loadProfile.',
                  'The caller can attach handlers.',
                  'The pending promise, before the profile.',
                ],
                [
                  'Invoke the lookup callback.',
                  'Call resolve(profile) or reject(error).',
                  'The callback finishes.',
                ],
                [
                  'Run a registered reaction.',
                  'Receive the value or reason.',
                  'Its return determines a derived promise’s outcome.',
                ],
              ],
            },
            {
              id: 'executor-boundary',
              kind: 'paragraph',
              text: 'A synchronous executor throw can reject the promise. A throw from a later callback does not travel backward into the finished executor. This adapter explicitly passes reported callback errors to reject. Keep transformations in the promise chain so their throws become chain rejections.',
            },
          ],
        },
        {
          term: 'Optional: the simulated lookup implementation',
          what: 'Use this shared fixture when trying the demonstrations.',
          study: {
            id: 'lookup-fixture',
            summary: 'Use this shared fixture when trying the demonstrations.',
            activityIds: [],
          },
          teaching: [
            {
              id: 'fixture-scheduling',
              kind: 'paragraph',
              text: 'This fixture uses standard JavaScript promises to schedule its callback after current synchronous work. Promise.resolve() supplies a fulfilled promise; then schedules its handler. This is an implementation detail of the simulation, not a requirement for callback APIs in general. The Scheduling section covers queue ordering.',
            },
            {
              id: 'profile-fixture',
              kind: 'code',
              label: 'Shared lookup fixture',
              code: "const profiles = new Map([\n  [1, { name: 'Ada' }],\n  [2, { name: 'Lin' }],\n]);\n\nfunction readProfile(id, done) {\n  Promise.resolve().then(() => {\n    const profile = profiles.get(id);\n    if (!profile) {\n      done(new Error(`Profile ${id} was not found`));\n      return;\n    }\n    done(null, profile);\n  });\n}",
            },
            {
              id: 'fixture-usage',
              kind: 'paragraph',
              text: 'Combine this fixture with the adapter and the definitions needed by the caller you want to try. Run each demonstration independently so its output is clear. The fixture ignores the callback’s return. If that callback throws, then rejects its own derived promise, which this callback-style API does not return; avoid throwing from it. The adapter reports errors explicitly and leaves transformations to the returned chain.',
            },
          ],
        },
        {
          term: 'Transform the result and return the chain',
          what: 'Give the caller ownership of the complete display-name operation.',
          study: {
            id: 'chaining',
            summary:
              'Give the caller ownership of the complete display-name operation.',
            activityIds: [],
          },
          teaching: [
            {
              id: 'chain-task',
              kind: 'paragraph',
              text: 'The screen needs an uppercase display name and a completion message on either outcome. With the fixture and adapter defined, this version uses promise methods:',
            },
            {
              id: 'chain-version',
              kind: 'code',
              label: 'Display name with then',
              code: 'function displayNameWithThen(id) {\n  return loadProfile(id)\n    .then(profile => profile.name.toUpperCase())\n    .finally(() => console.log(`finished ${id}`));\n}',
            },
            {
              id: 'derived-promise',
              kind: 'paragraph',
              text: 'Each then creates a new promise. It does not replace the value inside the original promise.',
            },
            {
              id: 'chain-values',
              kind: 'table',
              label: 'Which promise carries which value?',
              columns: ['Expression', 'Eventual fulfillment value'],
              rows: [
                ['loadProfile(id)', "A profile such as { name: 'Ada' }."],
                [
                  '.then(profile => profile.name.toUpperCase())',
                  "The string 'ADA'.",
                ],
                ['.finally(...), when cleanup succeeds', "The same 'ADA'."],
              ],
            },
            {
              id: 'return-ownership',
              kind: 'paragraph',
              text: 'Returning the chain lets the caller observe the whole operation. Omitting the outer return makes this ordinary function return undefined while the lookup continues. Omitting the return inside a block-bodied handler instead fulfills its derived promise with undefined. Identify which function lost its return. A handler throw rejects the promise returned by then; returning another promise makes that link follow its outcome.',
            },
          ],
        },
        {
          term: 'Trace a failed lookup through cleanup',
          what: 'Follow id 99 without inventing a profile to transform.',
          study: {
            id: 'rejection-trace',
            summary: 'Follow id 99 without inventing a profile to transform.',
            activityIds: [],
          },
          teaching: [
            {
              id: 'missing-profile',
              kind: 'paragraph',
              text: 'For displayNameWithThen(99), the lookup fails before there is any profile to uppercase. Trace the same operation’s rejection:',
            },
            {
              id: 'rejection-path',
              kind: 'table',
              label: 'A rejection from lookup to caller',
              columns: ['Boundary', 'What happens'],
              rows: [
                [
                  'Callback → adapter',
                  'The callback supplies an error; reject(error) rejects the lookup promise.',
                ],
                [
                  'Lookup promise → then',
                  'The success handler is skipped. With no rejection handler here, the derived promise rejects with the same reason.',
                ],
                [
                  'Derived promise → finally',
                  'Cleanup prints finished 99. Successful cleanup preserves the rejection.',
                ],
                [
                  'Returned promise → awaited caller',
                  'Await throws that reason; the caller’s surrounding catch can handle it.',
                ],
              ],
            },
            {
              id: 'cleanup-contract',
              kind: 'paragraph',
              text: 'Successful cleanup does not turn a failed lookup into success. A throwing cleanup can replace the original outcome. Promise.finally ignores an ordinary returned value, but waits for a returned promise; a rejected cleanup promise replaces the outcome too. A return statement in a JavaScript finally block can override an earlier return or throw. Keep cleanup separate from choosing a result.',
            },
          ],
        },
        {
          term: 'Express the same operation with async and await',
          what: 'Compare the two forms, then trace the awaited caller.',
          study: {
            id: 'awaiting',
            summary: 'Compare the two forms, then trace the awaited caller.',
            activityIds: [],
          },
          teaching: [
            {
              id: 'await-version',
              kind: 'code',
              label: 'Display name with await',
              code: 'async function displayNameWithAwait(id) {\n  try {\n    const profile = await loadProfile(id);\n    return profile.name.toUpperCase();\n  } finally {\n    console.log(`finished ${id}`);\n  }\n}',
            },
            {
              id: 'await-mechanism',
              kind: 'paragraph',
              text: 'An async function returns a promise. At await, this invocation pauses until the awaited outcome is available; other JavaScript work can run. Fulfillment supplies profile. Rejection throws at that expression and travels through finally before this function’s returned promise rejects. A transformation error, such as uppercasing a non-string name, also propagates.',
            },
            {
              id: 'caller-recovery',
              kind: 'paragraph',
              text: 'There is no recovery in either display-name version. The caller decides whether to show a fallback, retry or report the error. Adding a catch that only logs and returns normally would turn rejection into fulfillment, possibly with undefined.',
            },
            {
              id: 'awaited-caller',
              kind: 'code',
              label: 'Caller: fixture, adapter and await version',
              code: 'async function demo() {\n  for (const id of [1, 99]) {\n    try {\n      console.log(await displayNameWithAwait(id));\n    } catch (error) {\n      console.log(`caught: ${error.message}`);\n    }\n  }\n}\ndemo().catch(error => console.error(error));',
            },
            {
              id: 'caller-output',
              kind: 'code',
              label: 'Caller output',
              code: 'finished 1\nADA\nfinished 99\ncaught: Profile 99 was not found',
            },
            {
              id: 'caller-order',
              kind: 'paragraph',
              text: 'Cleanup runs before the display-name promise settles. Only then does the caller’s await resume to print the name or catch the rejection. The loop awaits each call, so request 99 starts after the first result is handled. Replace displayNameWithAwait(id) with displayNameWithThen(id) for the same observable outcomes here.',
            },
          ],
        },
        {
          term: 'Validation, recovery and cleanup',
          what: 'throw transfers control to the nearest matching catch. Handle an expected invalid input at the boundary that owns its recovery; rethrow unexpected failures. finally runs on success, a return, or a thrown error, so it is a place for cleanup. Keep cleanup from overriding the result or failure: do not return from finally. Here work and cleanup are synchronous injected functions, and cleanup is assumed not to throw.',
          when: 'Common mistake: catching every failure and reporting success, or returning from finally and hiding an earlier error. The wrapper runs cleanup once after success or failure, including failed validation. InvalidInput marks the validation failure this boundary owns; other errors propagate. Explain it: which boundary decides whether an invalid input can be recovered?',
          study: {
            id: 'cleanup',
            summary:
              'Validate known inputs, recover selectively and always run cleanup.',
            activityIds: [],
          },
          example: [
            {
              label: 'Run cleanup without swallowing the work failure',
              code: "class InvalidInput extends Error {}\nfunction runChecked(value, work, cleanup) {\n  try {\n    if (!Number.isFinite(value)) throw new InvalidInput('finite number required');\n    return work(value);\n  } finally {\n    cleanup();\n  }\n}\nfunction recoverInput(value, work, cleanup) {\n  try { return runChecked(value, work, cleanup); }\n  catch (error) {\n    if (error instanceof InvalidInput) return null;\n    throw error;\n  }\n}\nconsole.log(runChecked(2, n => n + 5, () => console.log('cleanup')));\n// cleanup, then 7",
            },
          ],
        },
        {
          term: 'Choose what completes a batch',
          what: 'Compare an all-success result with a partial-results report.',
          study: {
            id: 'outcomes',
            summary:
              'Compare an all-success result with a partial-results report.',
            activityIds: [],
          },
          teaching: [
            {
              id: 'report-task',
              kind: 'paragraph',
              text: 'A report can still be useful when one profile is missing. With the fixture and adapter defined, give allSettled the lookup promises and inspect every outcome:',
            },
            {
              id: 'outcomes-example',
              kind: 'code',
              label: 'A report retaining both outcomes',
              code: "async function profileReport() {\n  const outcomes = await Promise.allSettled([\n    loadProfile(1),\n    loadProfile(99),\n  ]);\n  for (const outcome of outcomes) {\n    if (outcome.status === 'fulfilled') {\n      console.log(`ok: ${outcome.value.name}`);\n    } else {\n      console.log(`failed: ${outcome.reason.message}`);\n    }\n  }\n}\nprofileReport().catch(error => console.error(error));",
            },
            {
              id: 'report-output',
              kind: 'paragraph',
              text: 'This prints ok: Ada, then failed: Profile 99 was not found. allSettled waits for every input to settle, then fulfills with records in input order. Fulfilled records have value; rejected records have reason. profileReport prints the records and returns no value, so its own promise fulfills with undefined. It calls loadProfile directly, without display-name cleanup messages.',
            },
            {
              id: 'batch-choice',
              kind: 'table',
              label: 'Choose the completion contract',
              columns: ['Requirement', 'Method and result'],
              rows: [
                [
                  'Every lookup must succeed.',
                  'Promise.all fulfills with values or rejects when an input rejection reaches it. It does not give a full outcome report.',
                ],
                [
                  'Keep each success and failure.',
                  'Promise.allSettled fulfills with status records after every input settles, including an empty input.',
                ],
                [
                  'First fulfillment / first settlement.',
                  'Promise.any / Promise.race. any rejects if all inputs reject; race follows the first settlement.',
                ],
              ],
            },
            {
              id: 'batch-initiation',
              kind: 'paragraph',
              text: 'Calling the lookup functions initiates work; the join does not call them for you. Neither all nor allSettled cancels work already started. Concurrent initiation does not guarantee parallel JavaScript execution. Choose the caller’s contract before choosing the method.',
            },
          ],
        },
        {
          term: 'Explain promises and chaining in an interview',
          what: 'Give a model answer, then test the boundary with a follow-up.',
          study: {
            id: 'interview-promises',
            summary:
              'Give a model answer, then test the boundary with a follow-up.',
            activityIds: [],
          },
          teaching: [
            {
              id: 'interview-return',
              kind: 'interview',
              question:
                'What does loadProfile(1) return before the callback runs?',
              answer:
                'A promise representing the lookup. Its executor has already registered the callback, but the profile is not available to the caller yet. The caller observes its outcome through a handler or await.',
              weakAnswer: 'The profile itself.',
              followUp:
                'Returning a profile from the executor does not fulfill the promise; the executor’s return value is ignored.',
            },
            {
              id: 'interview-then',
              kind: 'interview',
              question: 'Does then change the original promise?',
              answer:
                'It returns a new promise. Returning a normal value fulfills that derived promise; throwing rejects it; returning another promise makes it follow that outcome.',
              weakAnswer: 'It updates the promise.',
              followUp:
                'A handler returning nothing supplies undefined to the derived promise.',
            },
          ],
        },
        {
          term: 'Explain awaiting and batch ownership',
          what: 'Identify who observes rejection and what keeps running.',
          study: {
            id: 'interview-boundaries',
            summary: 'Identify who observes rejection and what keeps running.',
            activityIds: [],
          },
          teaching: [
            {
              id: 'interview-await',
              kind: 'interview',
              question:
                'Does await block JavaScript? When does local try/catch need it?',
              answer:
                'Await suspends this async invocation while the operation is pending. Await inside a local try makes a rejection throw at that boundary. Simply returning a pending promise forwards its eventual rejection to the caller without that local catch seeing it.',
              followUp:
                'Use await when local error handling or cleanup must span the operation. Direct forwarding is useful when the caller owns those responsibilities.',
            },
            {
              id: 'interview-all',
              kind: 'interview',
              question:
                'Would Promise.all cancel the remaining lookups after one fails?',
              answer:
                'No. It joins the promises and rejects its aggregate when an input rejection reaches it; started work can continue. Use all when partial success is unusable, and allSettled when the caller needs each outcome.',
              followUp:
                'Calling the lookup functions initiates work. Promise.all does not call those functions for you.',
            },
          ],
        },
        {
          term: 'Transfer: save a batch in order',
          what: 'Make the caller observe each save, and stop initiation on failure.',
          study: {
            id: 'joining',
            summary:
              'Make the caller observe each save, and stop initiation on failure.',
            activityIds: ['async-iteration'],
          },
          teaching: [
            {
              id: 'save-task',
              kind: 'paragraph',
              text: 'The caller must observe every save; item 3 must not start if item 2 fails. Identify the returned promise. forEach discards callback results, so awaiting it cannot join those promises. Use for...of with await when one save must finish before the next starts.',
            },
            {
              id: 'save-try',
              kind: 'paragraph',
              text: 'Try Async iteration repair below, then check your saveAll with this fixture. The executor stores its supplied resolving function in releaseFirst so you can finish the first save manually.',
            },
            {
              id: 'save-test-fixture',
              kind: 'code',
              label: 'Check the repaired saveAll initiation order',
              code: "let releaseFirst;\nconst firstSave = new Promise(resolve => { releaseFirst = resolve; });\nconst started = [];\nconst save = item => {\n  started.push(item);\n  return item === 1 ? firstSave : Promise.resolve();\n};\nconst done = saveAll([1, 2], save);\nconsole.log(started.join(','));\nreleaseFirst();\ndone.then(result => console.log(result)).catch(error => console.error(error));",
            },
            {
              id: 'save-observation',
              kind: 'paragraph',
              text: 'The repair prints 1, then complete. At the first log, item 1 is still pending and item 2 has not started. The original bug prints 1,2 at that point. Naming for...of alone is not an explanation: show how rejection reaches the awaited caller.',
            },
            {
              id: 'save-contracts',
              kind: 'table',
              label: 'Test these contracts separately',
              columns: ['Input and save behavior', 'Required outcome'],
              rows: [
                ['Empty items', 'Fulfill with complete; never call save.'],
                [
                  '[1, 2], both fulfill',
                  'Start in order and fulfill only after both saves.',
                ],
                [
                  '[1, 2, 3], save 2 rejects',
                  'Reject saveAll with that error; save 3 never starts.',
                ],
              ],
            },
          ],
        },
        {
          term: 'Transfer: produce a partial-results report',
          what: 'Retain each result and explain its correspondence to the input.',
          study: {
            id: 'partial-practice',
            summary:
              'Retain each result and explain its correspondence to the input.',
            activityIds: ['partial-results'],
          },
          teaching: [
            {
              id: 'partial-task',
              kind: 'paragraph',
              text: 'Attempt Retain partial results below with one fulfillment, one rejection and empty input. Distinguish an outcome record from a recovered value. State input order versus completion order, and say what continues after failure. Choosing allSettled should follow from the report’s requirements.',
            },
            {
              id: 'explain-again',
              kind: 'paragraph',
              text: 'Then trace id 1 and id 99 through the producer, adapter, transformation, cleanup and caller without rereading. At each boundary, say what returns immediately, what arrives later and who owns an error. Explain what changes if the transformation throws. Return to the unclear boundary’s walkthrough and reconstruct the behavior.',
            },
          ],
        },
      ],
      introduction: [
        {
          id: 'problem',
          kind: 'paragraph',
          text: 'Imagine a screen needs a person’s display name. A profile lookup supplies the record later, but its caller continues now. How can that caller observe success, failure and cleanup? Follow one lookup from an error-first callback through a returned promise, a transformation and an awaited caller.',
        },
        {
          id: 'outcome',
          kind: 'paragraph',
          text: 'Start with functions, callbacks, basic loops and try/catch. By the end, trace what returns immediately, what becomes available later and who owns each failure. Open the topics in order for the connected walkthrough, then explain the model and apply it to two different tasks.',
        },
      ],
    },
    {
      title: 'Scheduling',
      study: {
        id: 'scheduling',
        label: 'Scheduling',
        hint: 'Separate current work, enqueued work and host rules',
      },
      note: 'Modern JavaScript; run each block separately with \"use strict\". Predict one isolated callback before making broader claims about a runtime. Explain it: does a zero-delay timer get to interrupt current synchronous code?',
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
          study: {
            id: 'queues',
            summary:
              'Finish synchronous work before processing the isolated queue.',
            activityIds: ['scheduling-trace'],
          },
        },
        {
          term: 'Keep the host boundary visible',
          what: 'A zero-delay timer cannot interrupt the current callback, and its delay is a threshold rather than an exact execution time. Browser tasks and microtask checkpoints are a browser host model. Node has event-loop phases; the terms are not interchangeable. The examples deliberately avoid unrelated work.',
          when: 'Common mistake: turning this trace into a browser paint rule or a timer-versus-I/O prediction. It establishes no nextTick/setImmediate, ES-module evaluation or I/O-phase ordering claim. Moving an enqueue can change microtask order without changing which lines are synchronous.',
          study: {
            id: 'hosts',
            summary:
              'Keep timer thresholds and runtime-specific claims separate.',
            activityIds: [],
          },
        },
      ],
    },
    {
      title: 'Modules',
      study: {
        id: 'modules',
        label: 'Modules',
        hint: 'Make file boundaries explicit',
      },
      note: 'These examples are ECMAScript modules, which are automatically strict. Treat the labelled files as separate modules; import/export requires module loading by the host. Explain it: which names are exported, and which are local?',
      rows: [
        {
          term: 'Named exports, a default and local scope',
          what: 'An ES module exposes only what it exports; other top-level names stay module-local. A named import must match an exported name (it may be renamed locally with as). A default import does not use braces and may choose a local name. This totals.js supplies one named currency and one default function; total is the function’s local name, not an additional named export.',
          when: 'Common mistake: assuming a function’s name makes a default export into a named export. Explain it: why can another file import currency but not the local name initial?',
          study: {
            id: 'exports',
            summary:
              'Supply a module with one named value and one default function.',
            activityIds: [],
          },
          example: [
            {
              label: 'totals.js — ECMAScript module',
              code: `export const currency = 'USD';
const initial = 0; // module-local
export default function total(values) {
  return values.reduce((sum, value) => sum + value, initial);
}`,
            },
          ],
        },
        {
          term: 'Run two real module files',
          what: 'Save the supplied source as totals.js and the importing file as main.js in the same directory. Load main.js as an ECMAScript module in a host with module support. The relative import includes the .js extension. The starter imports a name totals.js does not export, so module linking fails before its logs run. Repair main.js against that supplied file; the solution produces USD 5 0.',
          when: 'Common mistake: treating import/export as ordinary script syntax. Use the labelled ECMAScript module files here. Explain it: why can a default import use a local name different from total?',
          study: {
            id: 'imports',
            summary:
              'Repair main.js, then run it alongside the supplied module.',
            activityIds: ['module-boundary'],
          },
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
        'Modern JavaScript in strict mode. The starter intentionally leaves the factory body for you to write. Run the reference as a strict script (add "use strict") or an ECMAScript module.',
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
        'Modern JavaScript in strict mode. Each block starts with a fresh plain object. Use a strict script (add "use strict") or an ECMAScript module.',
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
        'Modern JavaScript in strict mode. Function definitions below take items and an injected save(item); no top-level await is needed. To try them, call report(items, save) from your async harness. Saves in the completion check are deliberately held pending.',
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
        'Modern JavaScript in strict mode. Execute these statements together inside one fresh timer callback, with no unrelated work. This isolates the trace from earlier async continuations; it is an order check, not a timer-duration check.',
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
        'Modern JavaScript in strict mode. Run independent blocks as strict scripts (add "use strict") or ECMAScript modules. Inputs are supplied in the snippet.',
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
        'Modern JavaScript in strict mode. Run independent blocks as strict scripts (add "use strict") or ECMAScript modules. Inputs are supplied in the snippet. The explicit function keeps the var follow-up function-scoped rather than host-global.',
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
        'Modern JavaScript in strict mode. Run independent blocks as strict scripts (add "use strict") or ECMAScript modules. Inputs are supplied in the snippet.',
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
      id: 'numeric-sort',
      title: 'Sort without mutating input',
      prompt:
        'Repair sorted so it returns ascending numbers while leaving the caller’s array unchanged. Predict the default sort result and the original array after the buggy call. Include empty input in your check.',
      context:
        'Modern JavaScript in strict mode. Run independent blocks as strict scripts (add "use strict") or ECMAScript modules. Inputs are supplied in the snippet.',
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
    {
      id: 'normalize-labels',
      title: 'Normalize simple labels',
      prompt:
        'Write normalizeLabels(text) for a string of simple comma-delimited labels. Trim and lowercase each part; discard empty parts, keeping order and duplicates. Check " JS, css , JS, ", "" and " , ". Quoted CSV and Unicode normalization are outside this contract.',
      context:
        'Modern JavaScript in strict mode. Run this block as a strict script (add "use strict") or an ECMAScript module.',
      answer: 'The results are ["js", "css", "js"], [] and [].',
      solution: {
        label: 'Reference solution',
        code: `function normalizeLabels(text) {
  const labels = [];
  for (const part of text.split(',')) {
    const label = part.trim().toLowerCase();
    if (label !== '') labels.push(label);
  }
  return labels;
}`,
      },
      explanation:
        'Iteration visits each split part in order. The explicit condition skips empty strings after trimming; it never removes a repeated nonempty label.',
      followUp:
        'Compare a filter/map pipeline with the loop. Where should the empty check happen?',
    },
    {
      id: 'rest-total',
      title: 'Total numeric rest arguments',
      prompt:
        'Write total(...values) for numeric arguments only. Return their sum, including zero and negatives; no arguments must produce 0. Try total(2, 3), total(), total(0, -2, 2) and total(...[2, 3]).',
      context:
        'Modern JavaScript in strict mode. Run this block as a strict script (add "use strict") or an ECMAScript module.',
      answer: 'The four results are 5, 0, 0 and 5.',
      solution: {
        label: 'Reference solution',
        code: `function total(...values) {
  return values.reduce((sum, value) => sum + value, 0);
}`,
      },
      explanation:
        'Rest collects arguments into an array. The initial zero makes the empty reduction defined. Spreading an array at the call supplies the same separate numeric arguments.',
      followUp:
        'What would change if strings were allowed? Choose a validation policy before broadening this numeric contract.',
    },
    {
      id: 'read-settings',
      title: 'Read optional settings',
      prompt:
        'Write readPageSize(settings). An absent setting, absent pageSize, undefined or null pageSize yields 20; preserve 0. Assume an absent setting or a plain object. Explain why destructuring defaults alone do not satisfy the null case.',
      context:
        'Modern JavaScript in strict mode. Run this block as a strict script (add "use strict") or an ECMAScript module.',
      answer: 'Missing or nullish data gives 20; { pageSize: 0 } gives 0.',
      solution: {
        label: 'Reference solution',
        code: `function readPageSize(settings) {
  return settings?.pageSize ?? 20;
}`,
      },
      explanation:
        'Optional chaining handles an absent settings object; ?? handles a nullish property. A destructuring default handles undefined but preserves a supplied null. Neither form validates a type or range.',
      followUp:
        'Check null, undefined, {}, {pageSize: undefined}, {pageSize: null} and {pageSize: 0}.',
    },
    {
      id: 'first-unique-label',
      title: 'Find the first unique label',
      prompt:
        'Given a case-sensitive string array, return its first label that occurs exactly once, or null if none exists. Keep input unchanged. State a plan, implement firstUniqueLabel(labels), test edges and compare its cost with repeated scanning. ["js", "css", "js", "html"] must return "css".',
      context:
        'Modern JavaScript in strict mode. Run this block as a strict script (add "use strict") or an ECMAScript module.',
      answer:
        'Count labels, then scan original order. [] and ["js", "js"] yield null; [""] yields "" and ["JS", "js"] yields "JS".',
      solution: {
        label: 'Reference solution',
        code: `function firstUniqueLabel(labels) {
  const counts = new Map();
  for (const label of labels) counts.set(label, (counts.get(label) ?? 0) + 1);
  for (const label of labels) {
    if (counts.get(label) === 1) return label;
  }
  return null;
}`,
      },
      explanation:
        'The first pass counts without modifying input. The second returns the earliest label with count one, including an empty string. With expected constant-time Map operations and unit-cost keys, two passes take expected O(n) time and O(k) auxiliary storage. Repeated scanning can take O(n²). Map access is only specified to be average sublinear; string-key costs need separate assumptions.',
      followUp:
        'Test empty input, one label, all repeated, mixed case, empty text and a unique label at the end. Why is testing the returned label’s truthiness wrong?',
    },
    {
      id: 'partial-results',
      title: 'Retain partial results',
      prompt:
        'Write collectOutcomes(promises) to return every fulfillment/rejection record in input order. Test Promise.resolve(2), Promise.reject("offline") and empty input. Use an awaited caller so the resulting records stay observable.',
      context:
        'Modern JavaScript in strict mode. Run this block as a strict script (add "use strict") or an ECMAScript module.',
      answer:
        'The records are {status: "fulfilled", value: 2} and {status: "rejected", reason: "offline"}; empty input gives [].',
      solution: {
        label: 'Reference solution',
        code: `async function collectOutcomes(promises) {
  return await Promise.allSettled(promises);
}`,
      },
      explanation:
        'allSettled observes every input and keeps failures as records rather than rejecting for them. Result order follows input order, even if completion order differs. Promise.all instead rejects on an input failure; neither operation cancels started work.',
      followUp:
        'Hold the first promise pending and settle the second first. Does the result array change order?',
    },
    {
      id: 'module-boundary',
      title: 'Repair a module boundary',
      prompt:
        'Using the supplied totals.js above, repair only main.js so it imports the default total function and named currency. Load main.js as an ECMAScript module; [2, 3] and [] must produce USD 5 0. Explain why the original import fails before logging.',
      context:
        'ECMAScript modules, automatically strict. Save the exact supplied totals.js from Named exports, a default and local scope beside main.js. This starter and solution are main.js only; load them as modules rather than ordinary scripts.',
      starter: {
        label: 'main.js — broken named import',
        code: `import { total, currency } from './totals.js';
console.log(currency, total([2, 3]), total([]));`,
      },
      answer:
        'Use a default import without braces for total, plus the named import currency. The repaired program logs USD 5 0.',
      solution: {
        label: 'main.js — repaired imports',
        code: `import total, { currency } from './totals.js';
console.log(currency, total([2, 3]), total([]));`,
      },
      explanation:
        'totals.js has no named export total. Its default export may be given the local name total by the importer; currency must match the named export. The helper initial remains local to totals.js.',
      followUp:
        'Rename the default import to sum and update its calls. Why would importing { initial } still fail?',
    },
  ],
}
