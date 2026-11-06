# JavaScript study-sheet source assessment

Date: 2026-11-05. Scope: W-6.3u / D-101, JavaScript only. Starting branch:
`docs/2026-11-05-javascript-reference-assessment`, based on `6f1f67e`.

**Current work:** [fundamentals and interview-content reassessment](#fundamentals-and-interview-content-reassessment-2026-11-06),
requested after the user read the accepted implementation. Recommendations are
pending selection. The latest selected delivery is the [sectioned expansion](#sectioned-expansion-selected-2026-11-05);
earlier findings and checks retain their original context.

## Research boundary

The reader should explain a small program, repair a mistake and justify a choice.
The proposal is nine topics in four groups, with four activities. These are an
editorial selection, not a ranking of interview frequency. Amazon's own
[software-development interview guidance](https://www.amazon.jobs/content/en-gb/how-we-hire/interview-prep/software-development-topics)
(Amazon Jobs, undated, accessed 2026-11-05) recommends applying fundamentals and
practising code outside an IDE. It also directs candidates to their recruiter for
role-specific expectations. This supports practical exercises, but does not
establish a universal JavaScript syllabus or endorse these particular prompts.

Use Node.js **22.23.4**, a `.cjs` file and an explicit `"use strict";` directive as
the proposed executable-example context. The coordinator records actual execution
and version evidence separately below. Node is a repeatable checking environment;
it is not a claim that browser scripts and CommonJS have identical globals or
scheduling. Avoid top-level `this` puzzles, DOM APIs, `process.nextTick`,
`setImmediate`, I/O races and top-level `await` in this first sheet.

## Proposed topic groups

| Group | Selected topic | Reader task and useful boundary |
| --- | --- | --- |
| Values and bindings | 1. Values, equality and coercion | Explain why `0 === "0"` differs from `0 == "0"`; distinguish identity from equal-looking object contents. Include explicit conversion and the `NaN` exception, without a coercion puzzle catalogue. |
| Values and bindings | 2. Lexical scope and the temporal dead zone | Trace block shadowing and distinguish access before initialization from an undeclared name. Explain `const` as a binding restriction, not deep immutability. |
| Functions and objects | 3. Closures | Explain retained lexical bindings and independent factory calls; write a small counter rather than memorize a definition. |
| Functions and objects | 4. Ordinary-function `this` and arrows | Trace a method call and a detached call under strict mode. An arrow retains surrounding `this`; placing it in an object literal does not bind it to that object. |
| Functions and objects | 5. Object identity and shallow copying | Identify the nested object shared by a spread copy and copy the changed path. Keep examples to plain data objects. |
| Functions and objects | 6. Prototypes and classes | Explain own-property lookup, fallback through the prototype chain and where ordinary class methods live. Avoid implying classes introduce a separate inheritance mechanism. |
| Working with collections | 7. Array operations and mutation | Choose `map`, `filter`, `find` or `some` from the required result; contrast mutating `sort` with copying `toSorted`. A new array can still contain shared objects, and callbacks can mutate them. |
| Asynchronous work | 8. Promises, `await` and error handling | Return or await work so completion and failure remain observable; contrast sequential `for...of` with `Promise.all` for independent operations. `Promise.all` rejection does not cancel other work. |
| Asynchronous work | 9. Synchronous execution and queued callbacks | Predict one synchronous/promise/timer trace and explain why a zero-delay timer cannot interrupt the current code. Distinguish browser task/microtask terminology from Node's phases. |

## Language and platform sources

All sources below were accessed **2026-11-05**. MDN entries are original Mozilla /
MDN contributor documentation, continuously maintained and used here as explanatory
sources. They are not the normative specification. The TC39 live page identifies
itself as the ECMAScript 2027 language specification; treat that as the current
draft, not as a declaration that Node 22 implements every feature it describes.
The selected mechanisms predate that draft.

| Source and organization | Finding supported | Context or limit |
| --- | --- | --- |
| [Abstract operations: IsStrictlyEqual](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-isstrictlyequal), Ecma International / TC39, live draft | Strict comparison rejects differing types; loose comparison has defined conversion rules; SameValue differs for signed zero and NaN. | Normative algorithm, not an interview teaching sequence. Use stable named anchors rather than section numbers. |
| [Equality comparisons and sameness](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Equality_comparisons_and_sameness), MDN | Object comparison uses identity; `NaN` is not strictly equal to itself; equality mechanisms differ. | Explain the few distinctions needed by examples. Do not describe `Object.is` as simply a better `===`. |
| [`let`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let), MDN | Block scoping, shadowing and the temporal dead zone before initialization. | Avoid the oversimplification that declarations are physically moved or that lexical bindings do not exist before the declaration executes. |
| [Closures](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Closures), MDN | Functions retain their lexical environment; separate factory invocations can maintain independent state. | A closure retains access to bindings, not a frozen snapshot of every value. |
| [`this`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this), MDN | Ordinary-function receivers depend on the call; strict detached calls have undefined `this`; arrows use the enclosing binding. | Top-level context differs across scripts, modules and Node. Teach within an explicit function/method boundary. |
| [Spread syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax), MDN | Spread copies one level; nested identities survive. Object spread omits the original prototype and non-enumerable properties. | Copying a changed path suits the proposed plain-object example. Do not sell spread or JSON round trips as general deep cloning. |
| [Inheritance and the prototype chain](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Inheritance_and_the_prototype_chain), MDN | Property lookup follows prototypes; class syntax uses prototypal inheritance. | Keep static methods, private fields, exotic objects and prototype mutation out of the first explanation. |
| [Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array), MDN | Copying versus mutating methods; copies are shallow. | A method that returns a new array does not guarantee that its callback is free of side effects. |
| [`forEach`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach), MDN | The callback result is discarded and `forEach` does not await promises. | Awaiting `forEach` itself cannot join its callbacks. |
| [Using promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises), MDN | Promise chaining, failure propagation and composition; `Promise.all` rejects while other operations continue. | Concurrent initiation is a choice for independent work, not evidence of parallel JavaScript execution or cancellation. |
| [Event loops](https://html.spec.whatwg.org/multipage/webappapis.html#event-loops), WHATWG HTML Living Standard, updated 2026-11-04 | Browser event-loop processing includes microtask checkpoints; a checkpoint drains queued microtasks. | A browser host specification. It does not define Node's event-loop phases or guarantee a paint after every task. |
| [The Node.js event loop](https://nodejs.org/learn/asynchronous-work/event-loop-timers-and-nexttick), Node.js project, undated | Host phases and timer thresholds; timer handling changed with libuv 1.45 / Node 20. | A timer delay is not an exact execution time. Do not generalize the small trace into a timer-versus-I/O ordering guarantee. |

## Proposed activities

Each prompt is an original illustrative exercise. Reveal the reference answer,
reasoning and variation only after the reader has had a chance to attempt it.
These are activity briefs; executable solutions and observed results belong in
the coordinator's evidence section.

1. **Closure factory:** implement `makeCounter()` so two returned functions
   advance independently. Ask the reader to predict three calls before running
   them. Explain which invocation owns each binding. Variation: moving the state
   outside the factory makes callers share it.
2. **Nested copy repair:** changing `copy.settings.theme` after `{ ...original }`
   unexpectedly changes the original. Repair the update by copying `settings` too.
   Check both the original value and nested identity. Variation: an untouched
   sibling object can deliberately remain shared.
3. **Async iteration repair:** an async function uses `forEach(async ...)` and
   reports completion too early. Produce an ordered, sequential `for...of`
   solution; explain when `Promise.all(items.map(...))` is suitable instead.
   Include a rejection case that reaches an awaited caller's `try/catch`.
4. **Scheduling trace:** order synchronous logging, a fulfilled promise's `.then`
   callback, a `queueMicrotask` callback and one zero-delay timer. Explain the
   current execution, microtask registration order and later timer callback.
   Variation: move the extra synchronous line. Keep browser rendering and Node phase races
   outside the expected answer.

## Visual-source assessment and deferred scope

Priority 4 in `cheatsheet-sources.md` favors mental models over syntax posters.
The Node.js guide above contains a useful phase diagram with identifiable project
provenance, but its detail would pull this sheet toward the separate Express &
Node topic. Its diagram-specific reuse license was not established in this
assessment. Link to the original; do not capture, copy or adapt the image.

A small original sequence beside the trace activity can show current code,
promise reaction and timer callback without reproducing a source graphic. It
must be labelled as the example's order, not a complete event-loop diagram.
No external image asset is needed. Modules, iterators/generators, DOM events,
workers, networking, engine internals and algorithm practice remain outside this
first sheet. The humanizer editing pass retained the technical limits and removed
unnecessary framing; no separate prose-review artifact is required.

## Executable activity evidence (2026-11-05)

The [standalone checker](examples/javascript-study-checks.cjs) retains the original
activity snippets, deterministic fixtures, observed results and assertions.
Run from the repository root with the installed Node **22.23.4** binary:

```sh
/Users/angelito/.nvm/versions/node/v22.23.4/bin/node --unhandled-rejections=strict reference/examples/javascript-study-checks.cjs
```

Independent example validation and coordinator execution both returned **exit 0**,
**4 activities / 15 assertions**, actual runtime **v22.23.4**, strict CommonJS.
The portable command in the checker's JSON is `node --unhandled-rejections=strict
reference/examples/javascript-study-checks.cjs`; select the supported Node binary
before using that form. JSON goes to stdout; the checker does not write project
files or access a network. It checks examples, not the future sheet renderer.

| Activity | Actual evidence | Explanation and limit |
| --- | --- | --- |
| A. Closure factory | Calls through two counters produce `1, 2, 1`; subsequent calls produce `3, 2` | Returned functions from one factory call share its lexical binding; separate factory calls keep independent bindings. The checked base case starts at zero. |
| B. Nested copy | The first spread has a distinct outer object but shared `settings`; mutation prints `dark`. Copying the changed path then yields `dark, light`, with distinct nested identities. | The repair preserves the original's current value; it does not undo the earlier mutation or deep-clone arbitrary objects. |
| C. Async iteration | With saves deliberately blocked, `await forEach` reaches `complete`. The sequential repair traces `started 1, saved 1, started 2, saved 2, complete`. A rejection from save 2 is the same error observed by the caller, and item 3 never starts. | Deferred promises control progress without sleeps or timing thresholds. Snippet excerpts using `await` live inside the async harness with supplied `items`/`save`; they are not complete top-level CommonJS files. Sequential execution is the stated requirement for this activity. |
| D. Scheduling trace | `sync 1, sync 2, promise, microtask, timer` | The scheduling statements run together in one fresh callback, isolated from earlier async continuations. This validates queue order in that context, not timer duration, browser rendering, ES-module behavior, I/O ordering, `nextTick` or `setImmediate`. |

The checked B activity uses `settings.theme`; the earlier plain-object sketch has
the same shallow-copy teaching purpose. Exact snippets and fixture boundaries are
in the checker. If the implementation edits or adds examples, rerun the relevant
checks on the actual published examples rather than carrying this result forward
by resemblance. A coding prompt can intentionally leave work for the reader, but
its reference solution must declare its inputs/context and be checked.

**Additional host source:** Node.js project,
[`queueMicrotask`](https://nodejs.org/api/globals.html#queuemicrotaskcallback),
accessed 2026-11-05. The live page identifies Node **26.13.0** and describes the
V8-managed microtask queue; the attempted version-22 documentation URL was not
available through the browsing tool. This is supporting API context, not a Node
22 compatibility result. The checked Node 22 example supplies that bounded
execution evidence. WHATWG remains the browser-host source.

## Proposed scope selection and compact design

**Status:** assessment recommendation, not yet user-selected implementation.
The accepted D-101 brief governs; this proposes its first bounded delivery.

**Metadata:** retain slug **`javascript`**, title **JavaScript**, group
**Languages**, no stage tether. Move that existing placeholder into
`web/src/lib/cheatsheets/javascript.ts` when implementing; do not register a
second JavaScript route. One newly drawn sheet would make the count **26/30**;
current count remains **25/30**, with **18/18** stages.

**Select the nine topics above**, grouped as Values and bindings (2), Functions
and objects (4), Working with collections (1), Asynchronous work (2). Use one
concise mechanism/pitfall lookup per topic, with a small example where helpful.
Use section notes for a representative explanation question; do not add an
interview-question catalogue or another new row field solely for that label.
Keep examples short enough to reason about without scrolling through scaffolding.

**Select the four checked activities**, A-D. Each combines a visible prompt and
small code context with a reference answer, reason and a variation to consider.
The first activity includes a small coding task; B and C ask for repairs; D
asks for a prediction and explanation. Show the baseline context near the
examples: Node **22.23.4**, strict CommonJS. Distinguish language mechanisms from
host scheduling. Future `.cjs` examples must not silently use top-level `await`.

Retain sources in the existing primary/supporting footer. MDN's JavaScript Guide
can serve as the primary text reference; include selected specific references for
scope/closures, `this`/objects, arrays, promises and host scheduling from the table
above. The research table retains the full claim-to-source mapping. Employer
preparation guidance supports the editorial approach, not the language answers;
keep it in this assessment rather than presenting employer endorsement on the
sheet. Original concise examples and explanations are the deliverable.

### Small optional activity contract

Extend `Cheatsheet` with an **optional activities collection**; leave the existing
section/row meanings and `isDrawn` contract intact. Activities require a drawn
sheet with ordinary sections. Empty/absent activities produce no extra heading,
placeholder or interactive controls on current sheets.

A proposed activity record carries these meanings, not a full quiz engine:

- stable sheet-local `id`, descriptive `title`, visible `prompt` and execution
  `context`;
- optional labelled starter/example code, stored as literal text;
- reference `answer`, optional labelled solution code, required `explanation`,
  and an optional short `followUp` or variation.

These names can be tightened in implementation without adding features. Reuse the
existing labelled-code shape where useful; plain preformatted code is sufficient
for this slice. No new language-highlighting pipeline is required. Keep all
prompts, code, answers, explanations and variations in the same structured module;
web and generated Markdown must consume those exact fields.

### Activity presentation and interaction

Use a small `SheetActivities` composer after the ordinary topic sections and
before source/image material. It should show one card per activity, with its
prompt, context and code visible before opening the answer. Reuse the existing
`RevealList` disclosure for one solution per card where it fits; its header slot
can carry the prompt/code and its body the answer, code, explanation and variation.
A plain card title can label the activity region; keep heading levels meaningful
without changing unrelated disclosure users. Do not pull TD-34's general heading
refactor into this feature merely to use a component.

The disclosure's accessible name includes the activity title, e.g. "Solution:
Closure factory". Stable, sheet-prefixed IDs connect control and panel. Each
solution opens/closes independently; multiple can remain open for comparison.
Hide answers initially, preserve the visible prompt when open, and keep focus on
the triggering control when toggling. Collapsing the answer supports another
attempt without a new score/reset model. New route visits need no saved progress;
no attempt is graded or claimed to have run in the browser.

```text
Practice
  Closure factory                     [context]
  Prompt and starter code remain visible
  [ Solution: Closure factory              v ]
      Reference answer / solution code
      Why it works
      Follow-up variation
```

Follow the existing whiteprint/cyanotype tokens, Archivo headings, Newsreader
body and mono code. Keep code blocks scroll-contained on narrow screens; the
page itself must not scroll sideways. Accent means attention. No success score,
new palette, celebration or decorative infographic is needed.

The frontend-design pass retained the site's established drawing system; the
proposed signature is the visible-prompt/hidden-solution practice card. UI/UX
lookup found relevant visible-focus and focus-not-obscured guidance. Its follow-up
search did **not** return a verified disclosure-specific match; control semantics
above come from the repository's existing pattern, not that unrelated result.
No rendered layout or browser accessibility result is claimed by this assessment.

### Generated Markdown and backward compatibility

Append a clearly labelled Practice section to a drawn sheet only when it has
activities. Emit the prompt, execution context and starter code first, then a
labelled solution, explanation and optional follow-up. Markdown solutions can be
visible below their prompts; no HTML-only interaction is needed for the portable
lookup. Preserve authored code indentation and blank lines, choose fences that
cannot be broken by literal code, and keep plain labels/prose literal. Missing
optional code/follow-up must not print `undefined`, empty code fences or invented
solutions. Do not hand-edit `reference/cheatsheets.md`.

Existing sheets without activities must retain their previous generated output,
lookup behavior, source credit and image semantics. The current syntax-highlighting
snapshot should remain unchanged if no highlighted source examples change. If topic
rows add highlighted examples, regenerate that output through its existing script,
not import-time or render-time Shiki work. Activity code can remain plain text.

### Compact implementation plan and acceptance

This changes shared type/render/generator behavior. Use D-99's consequential path:
approve this compact design, use TDD for behavior, retain the static-content
exception, and obtain one independent review of the actual completed branch.

| Step | Files/interfaces | Acceptance and evidence |
| --- | --- | --- |
| 1. Add the optional contract and Markdown support | `web/src/lib/cheatsheets/types.ts`, `render.ts`, focused generator/registry tests | First observe missing-activity output failures. Check prompt/context/code/solution/reason/follow-up, absence handling, literal text/code fencing and all current no-activity output. Require unique IDs and a drawn owner; existing sheet/stage/native-resource counts remain meaningful. |
| 2. Compose accessible practice cards | Proposed `web/src/components/SheetActivities.tsx` and render test; `Cheatsheet.tsx` conditional composition | Test actual visible prompt/code and initially hidden answer, named keyboard-operable control, accurate expanded/controlled state, independent reveal/re-collapse, optional fields and unchanged ordinary-sheet rendering. Reuse disclosure behavior rather than implementing scoring. Use stable prefixed IDs and no client code execution. |
| 3. Author the JavaScript module | `javascript.ts`, `index.ts`, `planned.ts`, actual-sheet render/example checks | Nine selected topics/four groups and four activities, original concise copy and precise sources. Remove only JavaScript's empty placeholder. Expected drawn count becomes **26/30**; four other placeholders remain. Verify the actual sheet's mechanisms and revealed explanations, not only literal row counts. |
| 4. Validate examples and generated artifacts | Actual published snippets/solutions and contextual checks; `reference/cheatsheets.md`; highlighted snapshot only if affected | Execute the edited examples on supported Node, including sequential completion/rejection and the bounded scheduling trace. Prefer controlled fixtures over sleeps. Generated Markdown shows the same activity fields; retain labelled partial snippets where input fixtures are necessary. Research's **4/15** result covers only its preserved examples. |
| 5. Verify the shared behavior and deliver | Final application tree, affected shared sheet routes, source/task/tracker/KICKOFF | Run format, lint, generated-route typecheck, unit/DOM tests, production build/audit once. Run dev-console once. Check JavaScript all four solutions in closed/open/re-collapsed and multiple-open states in both themes at narrow/middle/wide widths, keyboard/focus, fragment/Back/reload where used, code overflow, contrast, non-inline 44px targets and clean console. Sample a prior static sheet and native resource/navigation. Verify the audit visits JavaScript and opens every new solution; do not accept a selector that silently skips answers. One independent final content/page/branch review must cover the actual diff and evidence. |

The current audit understands `button[aria-expanded]` disclosures. Reusing that
pattern lets it check open answer content. If another mechanism is needed, extend
and test the sweep to observe it; do not leave new content outside contrast,
layout and console checks. Later edits invalidate only the checks they affect.

**Implementation recommendation:** **GPT-6.1 Sol / High**, fresh user-selected
session under D-100 after scope selection. Create `feat/javascript-study-sheet`
from this assessment branch's committed tip and record the exact SHA. The earlier
W-6.4 inline exception does not apply to this task.

Return branch/commit, actual commands/results and limits, unresolved issues and
implementation session ID to coordinator **01a18acc-3b54-7202-92f3-404cc94fd0ad**.
Coordinator reads that thread and reviews the actual diff. Ask separately before
any no-ff merge into develop; main promotion belongs to the user.

Scope excludes the other four sheets, a complete JavaScript course, algorithm
practice catalogue, browser DOM lessons, Node-specific I/O/phase puzzles,
modules/generators/workers, code runner, persistence, scoring, copy/export controls,
new diagrams, dependency upgrades and unrelated shared-component refactors.
No sheet data, renderer, generator or app behavior has changed in this assessment.
Self-review and the humanizer editing pass apply to this new research/design prose;
source findings and example evidence do not establish future reader benefit or
browser behavior.


## Scope selected (2026-11-05)

Following assessment **cd724c4** and handoff **eddec43**, the user selected the
recommendation with "lets go with that": nine topics/four groups, four checked
activities and the small optional shared solution-disclosure/Markdown contract.
The proposed compact design, five-step plan and acceptance checks above are
approved unchanged. This supersedes the earlier pending-selection status, without
claiming an implementation or browser result.

Implementation is authorized in a fresh user-selected **GPT-6.1 Sol / High**
session under D-100, starting from this assessment branch's committed tip. Record
that exact SHA and create `feat/javascript-study-sheet`. KICKOFF carries return
instructions. The earlier W-6.4 inline exception does not carry forward, and
scope approval does not authorize integration into develop.


## Implementation evidence (2026-11-05)

The later [sectioned expansion](#sectioned-expansion-selected-2026-11-05)
supersedes the delivery target below. These results remain evidence for the
original application tree, not for the expansion.

Implemented W-6.3u.1 on `feat/javascript-study-sheet`, from exact base
**8ff159f5820caa18966e7358bea8dac5cc56fc69**. Application commit
**0dcfe2da558e13f5d4b2c194bd6a023809043697** delivers the selected nine
lookups/four groups and four activities at the existing JavaScript route.
The branch has **26/30** drawn sheets and **18/18** stages; local develop
and production have not been changed by this implementation session.

`SheetActivity` stores prompt/context, optional labelled starter and solution,
answer, explanation and optional follow-up. `SheetActivities` reuses `RevealList`;
prompts stay visible while solutions open independently. Generated Markdown
consumes the same fields, escapes literal prose and sizes code fences around
embedded backticks. All **29 non-JavaScript sheet bodies** remain byte-identical
to the base Markdown; the highlighted snapshot is unchanged.

The [published-example checker](examples/javascript-published-checks.cjs) loads
those actual fields using Node's TypeScript stripping and evaluates their exact
code in strict CommonJS. Run from the repository root:

```sh
/Users/angelito/.nvm/versions/node/v22.23.4/bin/node --unhandled-rejections=strict reference/examples/javascript-published-checks.cjs
```

Actual runtime **v22.23.4**, **4 activities / 20 assertions**, exit 0.
Unlike the earlier assessment's nested-copy example, the published repair starts
with fresh light input and produces light/dark with distinct settings identities.
The checker covers pending saves, sequential completion, original rejection
identity, the awaited caller's catch and the bounded scheduling trace. It retains
no copied snippet strings. Its injected save fixtures and isolated timer callback
establish no browser, ES-module, I/O ordering or elapsed-time guarantee. The
assessment's original **4/15** evidence remains historical and unchanged.

Behavior TDD observed missing generated Practice output and missing page
controls before implementation. Registry/ordinary-sheet guards and actual-sheet
render checks cover the finished data. Inspection also found that the audit's
selector only opened disclosures in stage panels. A browser regression returned
zero solution IDs before the selector repair and all four afterward. Expanded
buttons now use main-content scope; selected tabs retain panel scope so the
stage rail cannot unmount the content under audit.

Independent final review covered **0dcfe2d** and the published checker, with no
actionable findings. The same reviewer independently inspected desktop/dark and
narrow/light final layouts after the scoped prose-measure override. Final gate
results and the review's provenance/limits are recorded once in
[the tracker](../docs/tracker.md); KICKOFF carries the coordinator handoff.

## Sectioned expansion selected (2026-11-05)

**Reader outcome:** explain a fundamental JavaScript mechanism, trace a small
program and repair a related mistake without needing a full tutorial course.
After seeing the implementation, the user found it too short and asked for
sections like a stage. They selected **6–8 focused sections, worked examples
and 1–2 activities per section**. This supersedes the earlier nine-topic/four-
activity delivery target. The original verification remains historical evidence;
integration still requires separate approval.

Inspection of **bd72e70031d13d7e47dcfa9e083d6c396bbc18dc**, application
**0dcfe2d**, confirms the depth problem: nine compressed lookup rows in four
groups, followed by all four activities. Those rows contain useful caveats, but
few worked examples. Dividing the existing copy into tabs would leave the same
teaching gap. The expansion must add explanations and examples as well as navigation.

### Teaching structure

The recommended structure within the selected range is **seven sections and
nine activities**. Section IDs below are stable URL hashes; activities remain
small original exercises with a visible prompt and independently hidden solution.

| Section / hash | Teaching and worked example | Practice |
| --- | --- | --- |
| Values / `values` | Primitive values, object identity, `null`/`undefined`, truthiness, explicit conversion and equality. Trace `0`, empty text and absent input through defaults; distinguish equality from validation. | Repair a default that discards valid `0`/`false`/empty text. |
| Scope and closures / `scope` | `let`/`const` versus function-scoped `var`, initialization and TDZ, shadowing and retained lexical bindings. Contrast two factory calls with two calls to the same returned function. | Predict a shadowing/TDZ trace; retain and explain the independent-counter activity. |
| Functions and this / `functions` | Declarations/expressions, parameters/returns, callbacks, ordinary call-site receivers and lexical arrow `this`. Compare a method call, a detached call and a bound callback. | Repair a detached receiver; explain a wrapper alternative and why binding an arrow does not replace its receiver. |
| Objects and prototypes / `objects` | Property access, identity, shallow copying, prototype lookup and class methods versus instance fields. Trace an own field, inherited method and nested copy. | Retain the fresh-input nested-copy repair; explain which untouched references may stay shared. |
| Arrays / `arrays` | Choose `map`, `filter`, `find`, `some`/`every`, `reduce` or iteration by desired result; distinguish copying from mutation. Work a numeric total and numeric sort. | Transform/filter a small collection, including empty input; repair a numeric sort that mutates its input. |
| Promises and errors / `async` | Returned promises, chaining, `await`, error propagation, sequential versus concurrent work and `Promise.all` ordering/no cancellation. Trace completion and failure through a caller. | Retain the async-`forEach` repair with deterministic completion/rejection fixtures and a concurrency follow-up. |
| Scheduling / `scheduling` | Current synchronous work, microtask enqueue order and timer callbacks. Annotate the existing trace by queue and explain its host/context limits. | Retain the bounded scheduling prediction and explain how moving an enqueue changes the trace. |

Each section needs a reader outcome, a plain-language mechanism, at least one
worked example with expected behavior and an explanation, a nearby common
mistake, a representative interview explanation prompt, and its local activity.
Use two or three teaching units where possible; a table of terse definitions
alone does not satisfy the outcome. Introduce unfamiliar terms before using
them in the explanation. Do not add paragraphs merely to meet a word count.

### Additional primary-source findings

MDN contributor documentation, accessed **2026-11-05**. These references support
behavior, not interview-frequency claims; the seven-section organization and
exercise choices are editorial recommendations. Existing MDN/TC39/WHATWG/Node
sources above continue to govern the retained material.

| Source | Finding supported and boundary |
| --- | --- |
| [MDN: data types and data structures](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Data_structures) | Primitives are immutable; objects can be mutable and functions are callable objects. `typeof null` is a historical exception. Distinguish assignment of a value/reference from mutation; avoid saying JavaScript passes objects by reference. |
| [MDN: nullish coalescing](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing) | `??` falls back for `null`/`undefined`; `||` falls back for falsy input. Both short-circuit. `??` preserves `NaN` and is not input validation; mixed logical expressions need parentheses. |
| [MDN: this](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this) | Ordinary receivers follow the call site; arrows capture enclosing `this`. Object literals do not establish a receiver scope. Use explicit functions/methods rather than host-dependent top-level `this`. |
| [MDN: bind](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind) | `bind` creates a function without calling or modifying the original. It cannot replace an arrow's lexical receiver. Constructor-specific binding behavior is outside the selected example. |
| [MDN: Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) | Methods have different result shapes; copying is shallow. `sort` mutates, while `toSorted` returns a new array. A callback can still mutate shared objects. |
| [MDN: reduce](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce) | The returned accumulator feeds the next call. An explicit initial accumulator handles empty input; an empty array without one throws. A loop or specialized method may be clearer, and repeated copying can increase cost. |

### Presentation and content contract

Keep `/reference/javascript`, Languages membership and **18/18** stages. Use
the existing whiteprint/cyanotype design, type roles, `Stepper` and solution
disclosures. The section rail supports direct selection, URL hashes, back/
forward and keyboard navigation. Visited checks mean visited, not mastery.
Reference sections are independently useful; no stage number or AI-plays panel
is required. Keep sources outside the changing panel.

Retain `Cheatsheet.sections`, `Row.example` and `Cheatsheet.activities` as the
single content source. Add optional `Section.study` metadata with
`{ id, label, hint, activityIds: string[] }`. Every section on a study sheet
has this metadata; ordinary sheets have none. Each activity ID resolves to
one existing activity, assigned to exactly one section. IDs are unique, stable
and safe as hashes. Guard missing/duplicate/unassigned references and partial
study metadata in registry tests. Do not maintain a second lesson-content array.

A focused server composer builds `Step[]` from these sections and renders
teaching units vertically, including their labelled examples, followed by the
section's activities. `CheatsheetView` selects it when study metadata exists;
ordinary sheets keep their current rendering. Give `Stepper` an optional
`ariaLabel` prop, default **Stage steps**, and pass **JavaScript sections** here.
Keep its navigation/history behavior unchanged. Reuse `SheetActivities` and
avoid rendering the global activities again at the page bottom.

Generated Markdown follows the same section order and places each activity
under its section, including solution, reason and follow-up. Non-study output
must stay byte-identical. Update the pure-lookup descriptions in type/generator
comments and the generated introduction to acknowledge selective study sheets.
This is a scoped shared presentation extension, not a new content backend.

Measure every default panel against the existing **four screens at 1024×768**
guideline. Put supporting elaboration behind disclosure if necessary; retain
the mechanism, example and visible activity prompt. Open solutions must remain
readable without horizontal page overflow. Check both themes, narrow/middle/
wide widths and keyboard focus. The audit currently discovers only stage hashes
and reference base URLs: it must discover the rendered reference section rail,
assert nonempty IDs and visit every panel. A base-page-only pass is insufficient.

### Implementation boundary and handoff

Follow the [compact expansion plan](../docs/superpowers/plans/2026-11-05-javascript-study-expansion.md).
Use a fresh **GPT-6.1 Sol / High** session under D-100, starting a new feature
branch from the committed documentation tip descended from **bd72e70**. Preserve
the original feature history; do not integrate the shorter version first.
Coordinator review returns to **01a18acc-3b54-7202-92f3-404cc94fd0ad**.

Retain the Node **22.23.4**, strict CommonJS example baseline. Extend the
published checker to load the actual added examples/activities, including valid
falsy inputs, TDZ, bound/arrow receivers, empty collections and nonmutating
numeric sorting. Historical **4/20** assertions do not validate new snippets.
Keep async fixtures deterministic and scheduling in its isolated callback.

Deferred: the other four sheets, a comprehensive syntax/API course, algorithm
catalogues, DOM/Node I/O puzzles, modules/generators/workers, scoring, persistence,
browser code execution, images/dependencies, integration, push and production
promotion. Future sheets can reuse this presentation after their own scope
assessment; this decision does not silently expand all five at once.

### Expansion implementation evidence (2026-11-05)

W-6.3u.1a starts at exact design commit
**17c480821240eb74261b5c18fb7864d6c377ca40** on
`feat/javascript-study-sections`. Application checkpoint **be5cf77** implements
seven focused sections, nine local activities and eleven worked examples.
`studySections()` validates the shared web/Markdown traversal; the browser audit
reads every rendered reference rail hash and rejects an empty rail. The stage
Stepper label and navigation behavior retain their defaults.

The same published checker now reads the expanded data and passes **52 assertions**
on actual **Node v22.23.4**, strict CommonJS. It covers all nine activities and
all eleven worked examples, including valid falsy defaults, TDZ, bound/arrow
receivers, empty collections, a numeric copying sort, controlled async completion
and rejection, and isolated scheduling callbacks. Expected traces remain bounded
to that context. The earlier **4/20** result validates only the original sheet.
The additional primary-source findings above were checked again during this
implementation; no external image or new dependency was introduced.

All **29 other generated sheet bodies** remain byte-identical to **17c4808**;
the introduction now acknowledges study references. Highlighted output was
regenerated for the eleven added row examples. Initial checkpoint panel heights
at 1024×768 ranged **1,438–2,412px**, below the unchanged four-screen limit.
The initial keyboard matrix exposed a sticky-rail focus offset; measured scroll-margin
correction stays scoped to study solution buttons. Independent review of
**be5cf77** found duplicate browser-test registration and an implicit equality
mechanism; **3d4b140** moves the test outside the matrix loop and explicitly
explains strict comparison, numeric coercion and conversion. This explanation
was required teaching within the selected scope, not deferred polish. The final
**40/40** production audit includes the unchanged panel-weight limit. Final
verification and review details are retained in the tracker.

## Fundamentals and interview-content reassessment (2026-11-06)

Recommendation research only; this does not select implementation scope or change
an approved section count. Compared against
`web/src/lib/cheatsheets/javascript.ts` at application checkpoint **322c873**
(branch tip **d0ae353**). Its seven sections already teach equality/defaults,
closures, receivers, object identity/prototypes, array transformations, promises
and scheduling. The strongest opportunity is to connect those mechanisms to
small programs that readers can write and explain. MDN's learning curriculum
includes strings, conditionals, loops and function return values [F1]; this is a
coverage reference, not evidence of interview frequency.

### Language coverage findings and candidate activities

**First priority: branching, operators and ordinary iteration.** Dedicated instruction
is absent, although comparisons occur in callbacks and `for...of` appears in the
async repair. Teach `if`/early return, `&&`/`!`, arithmetic, a bounded `for` loop,
`for...of`, and `break`/`continue`. Explain that `for...in` visits enumerable
property names rather than array values [F2–F4]. Keep `switch` as a short lookup.
Activity: implement `firstEligibleAge(ages, minimum)`; `[15, 18, 21], 18` returns
`18`, while `[], 18` returns `undefined`. Specify numeric inputs. Ask the learner
to stop at the first match and explain the inclusive boundary. This exercises a
predicate, return contract and termination without an output trick.

**First priority: strings as working data.** Strings currently appear only as primitive
values or labels. Cover template interpolation, `trim`, `toLowerCase`, `includes`,
`slice` and `split`, with immutable results [F1, F9]. Activity: convert
`' JS, css , JS, '` into `['js', 'css', 'js']`, preserving duplicates and dropping
empty fields; `''` produces `[]`. Require the original string to remain unchanged.
This combines text processing with already-taught array methods. Give one bounded
Unicode caveat: indexes/length use UTF-16 code units, and code-point iteration
still does not count visible grapheme clusters [F9]. Defer Unicode algorithms.

**First priority: Map and Set.** Both are absent. Teach keyed lookup/counting with `Map`
and uniqueness/membership with `Set`; connect object keys to existing identity
teaching [F5]. Activity: count `['js', 'css', 'js']` into entries
`[['js', 2], ['css', 1]]` and produce unique labels `['js', 'css']`;
empty input gives empty collections. Follow up with two distinct `{id: 1}` objects:
a Set retains both, so deduplicating records requires an explicit key policy.
This develops collection choice and avoids pretending structural equality exists.

**DEEPEN: function inputs and object access.** Calls, returns, callbacks, arrows,
closures and `this` already exist. Missing pieces are parameter defaults/rest,
destructuring/renaming and optional chaining [F3, F6, F10]. Add a brief comparison
of calling a declaration before its source line versus reading a function held
in a not-yet-initialized `const` binding [F6]; the current TDZ lesson is useful
prerequisite knowledge. Spread is already
taught as a shallow copy; distinguish gathering rest arguments from spreading
them. Activity: read `settings?.pageSize ?? 20`; absent settings produces `20`,
`{pageSize: 0}` preserves `0`. Then compare destructuring defaults: a missing
`pageSize` gets its default, but `null` remains `null`. These are useful API-input
contracts, not interchangeable shorthand. A separate small `sum(...values)` task
can reuse the existing empty-sum requirement rather than repeat its lesson.

**DEEPEN: errors and promise composition.** Awaited rejection, catch boundaries,
`Promise.all`, input-order results and non-cancellation already have meaningful
coverage. Add synchronous validation with `throw new Error`, selective recovery
or rethrow, and `finally` for cleanup [F2]. Activity: injected work returns `7`
or throws; cleanup must run once in either case and the error must reach the
caller. Avoid returning from `finally`. Add `allSettled` where partial results
matter [F8]: one fulfilled `2` and one rejected `'offline'` should yield both
status records; empty input yields `[]`. Introduce `any`/`race` through requirement
selection only after those contracts, not another timing puzzle.

**DEFER, explicitly: modules and specialist breadth.** Modules are absent and
previously deferred. Named/default imports and exports merit later introductory
coverage [F7], but executable examples need an explicitly labeled ESM context;
the current strict CommonJS baseline cannot simply run them. Defer module-cycle
puzzles, custom iterators/generators, weak collections, advanced regex and further
host-scheduling detail. Prioritize the missing fundamentals before more TDZ,
receiver or event-loop traces. These topic groups are not a proposed rail count.

### Primary-source claim map

All ten sources: **MDN contributors / MDN Web Docs**, living documentation,
accessed **2026-11-06**. Links were opened during this research. Candidate examples
above are original proposed exercises; they were **not executed**.

- **F1 — curriculum coverage:** [Dynamic scripting with JavaScript](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting).
- **F2 — conditionals, throw/catch/finally:** [Control flow and error handling](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Control_flow_and_error_handling).
- **F3 — logical/arithmetic operators and optional chaining:** [Expressions and operators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Expressions_and_operators).
- **F4 — loop choice, break/continue, property names versus values:** [Loops and iteration](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Loops_and_iteration).
- **F5 — Map/Set operations, insertion order and identity-based object equality:** [Keyed collections](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Keyed_collections).
- **F6 — default and rest parameters:** [Functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions).
- **F7 — import/export and module execution context:** [JavaScript modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules).
- **F8 — composition choices and retained outcomes:** [Using promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises).
- **F9 — string methods and Unicode representation limits:** [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String).
- **F10 — extraction, renaming, rest and undefined-only defaults:** [Destructuring](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring).

### Interview preparation evidence

Organizations' own guidance, opened and accessed **2026-11-06**; undated living
pages. These sources support the preparation approach and named competencies.
They do not provide a representative JavaScript question-frequency dataset.

| Source / owner | Supported finding | Editorial consequence |
| --- | --- | --- |
| [Technical interviewing](https://careers.microsoft.com/v2/global/en/hiring-tips/technical-interviewing), Microsoft Careers | Candidates should clarify ambiguous requirements, plan, write actual code, test boundaries/errors and explain algorithm complexity. Its representative data-structure list includes arrays, strings and hash maps/sets. | Add short construction tasks with edge tests and a time/space discussion, plus collection-choice practice. This does not make the employer's entire algorithms syllabus a requirement for this reference. |
| [Front-End Engineer Interview Prep](https://amazon.jobs/content/en/how-we-hire/fee-interview-prep), Amazon Jobs | Frontend candidates write runnable code, handle edge cases and discuss maintainable solutions. Its coding resources include data structures/algorithms and frontend technologies; its walkthrough includes testing and runtime refinement. | Assess a solution beyond the predicted output. Browser-specific activities belong in an explicitly selected frontend extension rather than the general language baseline. |
| [Software development interview topics](https://www.amazon.jobs/content/en-gb/how-we-hire/interview-prep/software-development-topics), Amazon Jobs | Preparation emphasizes applying computer-science fundamentals and practising coding; the recruiter provides role-specific expectations. | Keep mechanisms, construction and explanation connected. No universal employer or seniority coverage is established. |
| [JavaScript Basic](https://www.hackerrank.com/skills-directory/javascript_basic), HackerRank Skills Directory | Its own assessment taxonomy names functions/errors, scope/hoisting, closures, inheritance and modules. | Most listed language mechanisms already exist here. Modules are an acknowledged follow-up gap; a basic label alone does not determine our teaching order. Use MDN/spec sources for mechanisms: the directory's shorthand about declarations being moved is unsuitable as a literal explanation of hoisting. |
| [JavaScript Intermediate](https://www.hackerrank.com/skills-directory/javascript_intermediate), HackerRank Skills Directory | Its taxonomy includes promises, memory management, concurrency and event loops. | The current sheet already has meaningful intermediate coverage. Another scheduling puzzle is lower priority than the absent everyday programming skills. The directory is evidence of that platform's categories, not interview prevalence. |

### Recommended first content slice

**Recommendation:** add the missing control-flow, string and keyed-collection
foundations, with one small problem-solving exercise that connects them. Then
deepen everyday function/object syntax and error/composition contracts. The
ranking is the coordinator's inference from the coverage comparison and source
evidence; it has not been selected as implementation scope.

Current content has **14 teaching entries** and nine activities. An editorial
classification of their main task gives **two construction, five repair and two
prediction activities**. None explicitly asks for a plan, a test-case set and
complexity reasoning together. The present review established that the page
implements its approved scope correctly; this reassessment asks whether that
scope gives the learner enough practical coverage.

| Priority | Add or deepen | Concrete outcome |
| --- | --- | --- |
| First | Control flow and text | Write a bounded loop/condition, return the right result at a boundary and normalize a simple comma-delimited label list. State that quoted CSV fields are outside that exercise. |
| First | Map, Set and collection choice | Count labels, preserve first-seen order, distinguish value equality from object identity, and choose an explicit key when deduplicating records. |
| First | A complete interview-style coding task | Clarify inputs, explain an approach, implement it, test empty/repeated inputs and discuss costs. Use first-unique-label or a small frequency problem; avoid a large algorithm catalogue. |
| Next | Everyday function and object syntax | Supply default/rest arguments, destructure/rename fields and safely read optional nested data. Preserve valid zero/false values and explain undefined-only defaults. |
| Next | Error ownership and asynchronous results | Validate synchronously, propagate unexpected failures, run cleanup on success/failure, and choose between an all-success contract and retained partial outcomes. |
| Follow-up | Introductory modules | Learn named/default exports, imports and module-local scope with a small two-file exercise. Use a separately labelled ESM setup; do not paste imports into the current `.cjs` baseline. Module cycles, loader internals and bundler configuration remain outside this proposal. |

For the complete coding task, propose `firstUniqueLabel(labels)` with
case-sensitive string inputs. `['js', 'css', 'js', 'html']` returns `'css'`;
`[]` and `['js', 'js']` return `null`. Keep input unchanged. The reader should
justify a counting map and second pass, compare it with repeated scanning,
and give time/space assumptions. This is an original practice task, not an
employer's question or a measured common question. Expected results are proposed
contracts, not execution evidence.

Complexity teaching needs one explicit boundary: MDN's
[Map reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)
(MDN contributors, accessed **2026-11-06**) describes the specification's
average sublinear access requirement. A hash-map lookup assumption can support
the usual expected-linear counting analysis, but JavaScript does not promise
universal constant-time `Map` operations. Also distinguish two sequential passes
from nested repeated scans and count auxiliary storage; avoid assigning a
guaranteed complexity to the engine's built-in sort.

### Keeping the reference bounded

The selected **6–8-section / 1–2-activities-per-section** direction remains the
layout constraint until the user changes it. One possible delivery is an eighth
**Control flow and text** section and a strengthened existing **Arrays** section
covering collections and the coding task. Keep its existing hash stable. This is
a layout option, not an approved rail redesign or activity-count target.

Fit the added work through task selection and concise worked examples. When an
activity repeats the same skill, it can become a worked example or follow-up;
do not simply append every candidate below the existing two activities. Preserve
the four original closure/copy/async/scheduling exercises unless a later selected
design explicitly changes that commitment. Respect the four-screen default-panel
budget; do not pack several unrelated lessons into one panel merely to retain a
number. Assess exact placement when selecting the next implementation slice.

For each new coding activity, provide the input contract, expected result,
reference solution, explanation, edge tests and a short cost discussion where
useful. Include answer checkpoints for explanation prompts so readers can assess
their reasoning. Keep a mixture of building, debugging and prediction.

Modules are worth a later beginner introduction; their execution-context work
is a reason to scope them separately, not to omit them indefinitely. DOM/event
delegation/fetch/debounce can form a later frontend extension if that interview
profile is selected. Node I/O phases, framework questions, graph/DP catalogues,
advanced regex, generators and more coercion/timer trivia remain deferred here.

No app, generated content, section count or activity contract changes in this
research. The suggested examples have not been published or executed. A selected
next slice needs a compact acceptance checklist/design before a fresh
**GPT-6.1 Sol / High** implementation session; research and planning remain
**GPT-6 Astra / Low** in coordinator **01a18acc-3b54-7202-92f3-404cc94fd0ad**.
No merge or deployment authorization is inferred from the research request.
