import type { Cheatsheet } from './types'

/** Original examples; claim-to-source mapping and host limits live in
 * reference/javascript-source-research.md. Activity code stays plain text. */
export const javascript: Cheatsheet = {
  slug: 'javascript',
  title: 'JavaScript',
  group: 'Languages',
  blurb:
    'Explain bindings, object identity and async completion, then practise with four small programs. Representative interview practice, not a frequency ranking.',
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
  ],
  sections: [
    {
      title: 'Values and bindings',
      note: 'Explain it: what is shared when a const binding refers to an object? Examples use Node 22.23.4, strict CommonJS (.cjs with "use strict"). Browser globals and module evaluation can differ.',
      rows: [
        {
          term: 'Values, equality and coercion',
          what: '0 === "0" is false; 0 == "0" is true after conversion. Prefer explicit Number("0") when conversion is intended. Two separate objects with the same fields are not strictly equal; two references to one object are.',
          when: 'NaN === NaN is false; use Number.isNaN to check it. Object.is treats NaN as equal to itself and distinguishes +0 from -0, so it is not a drop-in improvement over ===.',
        },
        {
          term: 'Lexical scope and the temporal dead zone',
          what: 'let and const belong to their enclosing block. An inner declaration shadows the outer binding throughout that block, including before initialization, when reading it throws ReferenceError. An undeclared name has no binding; typeof can report "undefined" for it, but throws for a binding in its temporal dead zone.',
          when: 'const prevents reassignment of the binding. It does not freeze object properties or the objects nested inside them.',
        },
      ],
    },
    {
      title: 'Functions and objects',
      note: 'Explain it: which binding or object does the function reach at the moment you call it?',
      rows: [
        {
          term: 'Closures',
          what: 'A returned function retains access to the lexical bindings where it was created. It observes later changes to those bindings; it does not capture a frozen snapshot. Separate factory invocations can own independent state.',
          when: 'Use a small factory when callers need private state. Trace each factory invocation separately before tracing its returned functions.',
        },
        {
          term: 'Ordinary-function this and arrows',
          what: 'For an ordinary method, obj.read() supplies obj as this. Assigning that method to detached and calling detached() supplies undefined in strict mode; reading this.value then throws TypeError. bind(obj) can preserve that receiver.',
          when: 'An arrow uses the surrounding this binding. An arrow created inside an ordinary method can retain that method call’s receiver. Putting an arrow in an object literal does not bind it to that object. Avoid top-level this guesses: script, module and host contexts differ.',
        },
        {
          term: 'Object identity and shallow copying',
          what: 'Object spread makes a new outer object by copying own enumerable properties. Nested objects still have the same identity. Copy each object along the changed path when an update must preserve the original.',
          when: 'These examples use plain data objects. Spread does not copy a source object’s prototype or non-enumerable properties, and is not a general deep clone.',
        },
        {
          term: 'Prototypes and classes',
          what: 'Property lookup checks an object’s own properties, then follows its prototype chain until a match or null. An own property shadows an inherited one. Ordinary class instance methods live on the class prototype and are shared by instances.',
          when: 'class syntax uses JavaScript’s prototype mechanism. Distinguish an instance’s own fields from inherited methods rather than assuming each constructor call copies every method.',
        },
      ],
    },
    {
      title: 'Working with collections',
      note: 'Explain it: do you need every transformed value, matching values, one value, or a yes/no answer?',
      rows: [
        {
          term: 'Array operations and mutation',
          what: 'Use map for a transformed array, filter for all matches, find for the first matching value (or undefined), and some for a boolean. sort mutates its array; toSorted returns a sorted copy. Supply (a, b) => a - b for ascending numbers instead of the default string ordering.',
          when: 'A new array can still hold the original objects. map/filter callbacks can mutate those objects too. Choose by the result needed, and check both array identity and nested identity when avoiding mutation.',
        },
      ],
    },
    {
      title: 'Asynchronous work',
      note: 'Explain it: who can observe completion and failure, and what has actually finished before the next statement?',
      rows: [
        {
          term: 'Promises, await and error handling',
          what: 'Return or await asynchronous work so its caller can observe completion and rejection. A try/catch around an awaited promise catches its rejection. forEach discards callback results and does not join callback promises; awaiting forEach does not wait for saves.',
          when: 'Use for...of with await when each operation must finish before the next starts. For independent operations, await Promise.all(items.map(save)) joins their promises and preserves input order in its results. Rejection does not cancel the other operations.',
        },
        {
          term: 'Synchronous execution and queued callbacks',
          what: 'Current synchronous code finishes before the queued promise reaction and queueMicrotask callback in the trace below. Those microtasks run in registration order, followed by the timer callback. A zero-delay timer cannot interrupt the current code and does not promise an exact delay.',
          when: 'The trace is one isolated Node callback. Browser tasks/microtask checkpoints and Node event-loop phases are host models, not interchangeable names. It predicts no browser paint, I/O race, nextTick/setImmediate order or ES-module evaluation order.',
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
        'Move the sync 2 line before Promise.resolve. It is still synchronous and still precedes both microtasks. Explain why the queue order is unchanged.',
    },
  ],
}
