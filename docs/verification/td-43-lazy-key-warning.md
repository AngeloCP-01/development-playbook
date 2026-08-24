# TD-43 — the missing key that was never missing

Method: one live `next dev` server, the RSC payload read straight off the wire, and two
temporary probes compiled into the app — one wrapping `console.error` to call React's
`captureOwnerStack()`, one logging the shape of `step.content` at render time. Every
finding below is a value observed at runtime or a line of React's shipped source, not an
inference from a bisection.

Environment: macOS, Next 16.2.10, React 19.2.4, Turbopack.

**Verdict: there is no missing key. The warning is a false positive, and the mechanism is
a one-level unwrap in React's dev-only key-exemption bookkeeping meeting a doubly-wrapped
lazy RSC chunk.**

## What the entry said, and why eighteen probes could not close it

The entry hunted for an array whose children lacked keys, and ruled out, correctly, the
content of every step, the step count, and the panel. It could not close because the thing
it was looking for does not exist. Its two irreconcilable results — "the warning needs a
step whose id is `traps`" and "stubbing the tablist out still warns" — were both true and
both irrelevant: the discriminator is not the id, it is *which step's content the server
flushes last*, and `traps` is last.

## The two code paths that disagree

React validates keys in two places, and they do not unwrap lazy nodes to the same depth.

`react/cjs/react-jsx-dev-runtime.development.js`, `validateChildKeys` — runs at element
creation, and stamps the static-children exemption. It unwraps **one** level:

```js
isValidElement(node)
  ? node._store && (node._store.validated = 1)
  : node.$$typeof === REACT_LAZY_TYPE &&
    ("fulfilled" === node._payload.status
      ? isValidElement(node._payload.value) &&
        node._payload.value._store &&
        (node._payload.value._store.validated = 1)
      : node._store && (node._store.validated = 1))
```

`react-dom/cjs/react-dom-client.development.js`, `warnOnInvalidKey` — runs at
reconciliation, and unwraps **until it reaches an element**:

```js
case REACT_LAZY_TYPE:
  (child = resolveLazy(child)),
    warnOnInvalidKey(returnFiber, workInProgress, child, knownKeys);
```

A child that is `lazy → lazy → element` therefore satisfies neither branch of the first —
it is fulfilled, but its value is another lazy rather than an element — so nothing is
stamped. The second walks all the way down, finds an element with `key === null` and
`_store.validated === 0`, and reports it as a list child with no key.

## How the panel gets a doubly-lazy child

`Architecture` is a **server** component: `STEPS` is built there, so every `content` node
crosses the RSC boundary. Read off the wire with `curl -H "RSC: 1"`, twenty of the
twenty-two contents are inline elements in row `88`, and the last two are references:

```
access   content=ELEMENT key=None validated=0
record   content=ELEMENT key=None validated=0
ai       content=$L7da
traps    content=$L7db
```

`$L` becomes `createLazyChunkWrapper(chunk, 0)` — lazy #1. When chunk `7db` initialises,
its own children are still pending, so the element is blocked and gets wrapped again
(`react-server-dom-turbopack-client.browser.development.js`, the
`createLazyChunkWrapper(parentObject, i)` call in the element revive path) — lazy #2.

The probe in `Stepper` printed exactly that, and printed the contrast with a step whose
content arrived inline:

```
[TD43] id=reverse $$typeof=Symbol(react.transitional.element) validated=0 payloadStatus=undefined
[TD43] id=reverse $$typeof=Symbol(react.transitional.element) validated=1 payloadStatus=undefined
[TD43] id=traps   $$typeof=Symbol(react.lazy) validated=0 payloadStatus=fulfilled
                  innerTypeof=Symbol(react.lazy) innerValidated=0
```

`reverse` is stamped `validated=1` on its second render and is exempt forever after.
`traps` is fulfilled, its value is another lazy, and nothing is ever stamped.

This also settles the "recursing" note in the original entry. The only recursion in
`warnOnInvalidKey` is the `REACT_LAZY_TYPE` case, so the stack was not evidence of a nested
array. It was evidence of a nested *lazy*, which is the whole bug.

## Two claims the entry recorded that this replaces

**"It follows the last index."** It follows the last content the server flushes, which is
the last index only because the two coincide. Moving `traps` to index 0 moved the warning
to `ai` because `ai` then became the last thing flushed, not because the last index is
special.

**"The discriminator is a step whose id is `traps`."** It is not. Removing that step
changed which content was flushed last, which changed which content arrived doubly
wrapped.

## The fix, and why it is not a workaround for our own bug

The panel rendered `{step.content}` as the second of two children:

```jsx
<div ref={panelRef} …>
  <p className="t-label …">…</p>
  {step.content}
</div>
```

Two children is a *static* children array, which is exactly the case React's exemption
exists for — and the exemption is the part that fails to survive the double lazy. Wrapping
the streamed node in a fragment keeps it out of a multi-child array entirely, so React
takes the single-child path and the array key check never runs.

Nothing else changes. The prerendered HTML for `/stages/03-architecture` is **byte-identical
before and after** (284,405 bytes both; the only textual differences are the build id and
one chunk hash, and normalising those two leaves an empty diff). A fragment renders no DOM.

## Evidence

| Step | Command | Result |
|---|---|---|
| RED | `pnpm test:dev-console`, pin removed | 1 failed — `/stages/03-architecture#traps Each child in a list should have a unique "key" prop` |
| GREEN | same, fragment applied | 1 passed, 42.4s over 76 URLs |
| Teeth | fragment reverted, comment left in place | 1 failed, same URL, same message |
| Restored | fragment reapplied | 1 passed |

The teeth check removed *only* `<>{step.content}</>`, so the fragment and not the recompile
is what closes it.
