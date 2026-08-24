# TD-43 — the missing key that was never missing

Method: one live `next dev` server, the RSC payload read off the wire, and two temporary
probes compiled into the app — one wrapping `console.error` to call React's
`captureOwnerStack()`, one logging the shape of `step.content` at render time. Both probes
were removed before the branch was committed and their source is not preserved, so the
probe output quoted below is **not re-runnable from this record**. Everything else here is.

Environment: macOS, Next 16.2.10, React 19.2.4, Turbopack. Row ids and chunk names below are
**volatile** — they move when the payload changes, they differ between a direct RSC fetch and
the copy embedded in the dev HTML, and they should be re-derived rather than searched for.

**Verdict: there is no missing key. The warning is a false positive, and the mechanism is a
one-level unwrap in React's dev-only key-exemption bookkeeping meeting a doubly-wrapped lazy
RSC chunk.**

## The two code paths that disagree

React validates keys in two places, and they do not unwrap lazy nodes to the same depth.

`react/cjs/react-jsx-dev-runtime.development.js:267`, `validateChildKeys` — runs at element
creation and stamps the static-children exemption. It unwraps **one** level:

```js
function validateChildKeys(node) {
  isValidElement(node)
    ? node._store && (node._store.validated = 1)
    : "object" === typeof node &&
      null !== node &&
      node.$$typeof === REACT_LAZY_TYPE &&
      ("fulfilled" === node._payload.status
        ? isValidElement(node._payload.value) &&
          node._payload.value._store &&
          (node._payload.value._store.validated = 1)
        : node._store && (node._store.validated = 1));
}
```

`react-dom/cjs/react-dom-client.development.js:6586`, `warnOnInvalidKey` — runs at
reconciliation and unwraps **until it reaches an element**:

```js
case REACT_LAZY_TYPE:
  (child = resolveLazy(child)),
    warnOnInvalidKey(returnFiber, workInProgress, child, knownKeys);
```

A child that is `lazy → lazy → element` satisfies neither branch of the first. It is
fulfilled, so the `else` that would stamp the wrapper never runs; its value is another lazy
rather than an element, so the stamp the `then` branch would apply lands nowhere. The second
walks all the way down, finds an element with `key === null` and `_store.validated === 0`,
and reports it as a list child with no key. The warn condition, at `:26042`, is
`(!child._store.validated && null == child.key) || 2 === child._store.validated`.

The attribution is `getComponentNameFromFiber(returnFiber._debugOwner)` — the owner of the
**parent** element, not of the defective one. That is why the message says `Stepper` and why
reading `Stepper` finds nothing wrong with it.

This also settles the "recursing" note in the original entry. The only recursion in
`warnOnInvalidKey` is the `REACT_LAZY_TYPE` case above, so the stack was not evidence of a
nested array. It was evidence of a nested *lazy*.

## How the panel gets a doubly-lazy child

`Architecture` is a **server** component, so every step's `content` crosses the RSC boundary.
Read off the wire on a clean tree with `curl -H "RSC: 1"`, twenty-one of the twenty-two
contents are inline elements in the row carrying the `steps` prop, and exactly one is a
reference:

```
total steps: 22   inline: 21
references: [('traps', '$L7da')]
```

`$L` becomes `createLazyChunkWrapper(chunk, 0)` — lazy #1
(`react-server-dom-turbopack-client.browser.development.js:2626`). When that chunk
initialises, the element's own children are still unresolved references, so it is blocked and
wrapped again by the `createLazyChunkWrapper(parentObject, i)` call in the element revive
path at `:4695` — lazy #2, carrying the wire tuple's `validated` flag (`value[6]`, which is
`0`) forward.

The probe in `Stepper` printed that, against a step whose content arrived inline:

```
[TD43] id=reverse $$typeof=Symbol(react.transitional.element) validated=0 payloadStatus=undefined
[TD43] id=reverse $$typeof=Symbol(react.transitional.element) validated=1 payloadStatus=undefined
[TD43] id=traps   $$typeof=Symbol(react.lazy) validated=0 payloadStatus=fulfilled
                  innerTypeof=Symbol(react.lazy) innerValidated=0
```

`reverse` is stamped `validated=1` and is exempt from then on. `traps` is fulfilled, its value
is another lazy, and nothing is ever stamped.

### A measurement that was wrong, and why

The first capture of this payload was taken **with the `captureOwnerStack` probe still
installed**, which adds a client component to the page. That shifted the row ids by one and
deferred a second content, and it was written down as "twenty inline, `ai` and `traps`
referenced". It is not the shape of the page being diagnosed. A reviewer re-ran the doc's own
command on a clean tree and got the figures above; they are the ones that reproduce.

The probe changed the thing it was measuring, which is worth more than the correction itself:
an instrumented capture is evidence about the instrumented build, and this repo's records are
read as though every figure came from the shipped one.

## What decides whether it fires — and what is still uncharacterised

The old entry recorded two discriminators. Both were real observations, and the causes
attached to them were wrong. The account that replaces them is **conjunctive**, and it is not
fully pinned down.

What is measured:

| Configuration | Payload | Result |
|---|---|---|
| As shipped | `traps` outlined to its own row, blocked on revive | warns at `#traps` |
| `traps` moved to index 0 | last content still outlined | warns at `#ai` |
| `traps` removed entirely | nothing outlined | **clean** |
| every step's `content` replaced by `<p>{s.id}</p>` at module scope | all 22 inline, no reference at all | **clean** |

So it is not the id `traps`, and it is not the last *index* on its own. Two conditions have to
hold together: the last-rendered step's content must be deferred into its own streamed row,
**and** that row must still be blocked on its own children when it is revived. Both depend on
how much content the payload carries and on flush timing.

**This corrects the original entry's first probe rather than confirming it.** That probe
stubbed every step's content at module scope and recorded "still warns"; re-run at the base
revision it comes back clean, which is what the fourth row above shows. Content is not
irrelevant. Content volume is what causes the last content to be outlined at all. An earlier
version of this document called that probe correct, on no evidence beyond the entry's own
say-so, in a document whose subject is a record that could not be trusted.

What is **not** established: the size threshold, and whether some shape other than a double
wrap can reach the same warning. The general form of the gap is broader than "wrapped twice"
— any outer lazy that is not fulfilled-holding-an-element at element-creation time misses the
stamp. That is the class; the double wrap is the instance this app hit.

## The fix

The panel rendered `{step.content}` as the second of two children:

```jsx
<div ref={panelRef} …>
  <p className="t-label …">…</p>
  {step.content}
</div>
```

Two children is a *static* children array, which is exactly the case React's exemption exists
for. The exemption is correct; what fails is React's bookkeeping of it across the RSC
boundary. Nothing in app code can repair that, so the remedy available is a tree-shape change,
and this is the smallest one:

```jsx
<Fragment key="content">{step.content}</Fragment>
```

Keyed, not bare, and keyed for the reason `RevealList` already keys its `header`, `title`,
`badge` and `footer` slots: the reconciler warns only when the exemption is unset **and**
`key == null`, so a key closes the gap without depending on the exemption surviving the
boundary. `RevealList` reached that fix first, on the same warning, and attributed it to the
bundler's handling of `isStaticChildren`; TD-43 names a second mechanism that produces the
identical symptom. Both comments now point at each other.

The wrapper also keeps the streamed node out of the panel's children array. The array check
still runs, over the `<p>` and the fragment, and passes because `jsxs` stamps both at
creation — what changed is that the streamed node is no longer one of the candidates.

**This does not suppress genuine missing keys.** If a step's `content` were ever an array,
`createFiberFromFragment` puts it in the fragment fiber's `pendingProps`, `updateFragment`
reconciles it, and `reconcileChildrenArray` calls `warnOnInvalidKey` on every item exactly as
before. That was verified in review rather than assumed, because "a wrapper silenced a dev
warning" is the shape of a much worse outcome than the bug.

All five built stages are server components, so all five carried the same exposure. The fix
is at the one shared site.

## Evidence

| Step | How | Result |
|---|---|---|
| RED, without editing anything | `pnpm test:dev-console` at `33b782f` (base), where the run passes *only* because the pin asserts the warning still fires | warning printed at `/stages/03-architecture#traps` |
| RED, as run here | same command with the pin removed | 1 failed, same URL, same message |
| GREEN | fragment applied | 1 passed, ~42s over 76 URLs |
| Teeth | fragment reverted, explanatory comment left in place | 1 failed, same URL, same message |
| Restored | fragment reapplied, then keyed | 1 passed |

The teeth check removed *only* the fragment, so the fragment and not the recompile is what
closes it. A JSX comment compiles to no child, so leaving it in place genuinely restores the
two-child array.

The base-revision route in the first row is the one to prefer: it needs no edit, and the pin
failing with *"TD-43 no longer reproduces"* is itself a check that the warning is gone.

Rendered output is unchanged. `.next/server/app/stages/03-architecture.html` is **284,405
bytes at both revisions**, and normalising the build id and the chunk filenames leaves an
empty diff. `Fragment` renders no DOM.
