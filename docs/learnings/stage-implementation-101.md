# Stage implementation 101

What building stage 01 taught, written down so stages 02–18 do not relearn it. These are
the things that cost real time and are not obvious from reading the code afterward.

The one habit underneath all of it: **verify against a live build, do not assert.** Every
bug below was found by checking — a screenshot, a measured edge, a contrast script — not
by reading the code and believing it. Eleven real defects in one stage came out that way.

---

## The 68ch measure cap bites layout, not just prose

`globals.css` caps running text at a readable width:

```css
main :is(p, li) { max-width: 68ch; }
```

This is right for paragraphs and wrong for anything structural that happens to be a `<p>`
or `<li>`. It caught me twice on the index:

- A navigation `<li>` row stayed capped at ~680px, so the row's content stopped
  mid-page and the right third sat empty.
- I "fixed" it by putting `.measure-full` on the `<ul>`. That did nothing, because the
  cap lands on the `<li>`, not its parent. The opt-out has to go on the same element the
  rule targets.

**Rule of thumb:** if you build a full-width row, table, or grid out of `<li>`/`<p>`, put
`.measure-full` on that element. And confirm it worked by measuring the element's right
edge against the content edge, not by looking — the difference was invisible until
measured.

---

## Expanded caps overflow narrow columns

The display face is Archivo pushed wide (`t-display`, `wdth` up to 118) and set in caps.
That lettering is much wider than it looks, and viewport-based `clamp()` sizing does not
know how narrow its column is.

Two overflows came from this:

- "DEVELOPMENT" needed 333px inside a 280px body at 320px wide.
- The hero, placed in a two-column grid, overflowed 137px at exactly 1024px — the point
  where the sidebar rail appears and steals 288px, so the hero's half-column is suddenly
  too small for the caps.

**Rule of thumb:** size display type with `clamp()`, then check the *longest real string*
at the *narrowest viewport where that layout applies*. For stage titles the stress case
is "Post-Deployment Verification". Keep big expanded caps full-width; do not put them in a
column whose width you cannot predict.

---

## Solve contrast numerically, against the worst-case surface

A new palette will have failures. `--faint` shipped at 2.99:1 on the darkest light
surface; the accent was 4.11:1 at small sizes. Both are below AA and neither was obvious
by eye.

Do not nudge hex values and re-screenshot. Compute the ratio against the *worst-case*
surface a colour ever sits on — for dark text that is the sunken fill, for light text the
raised surface — and pick the first value that clears the target. That turns three rounds
of guessing into one calculation.

The audit that finds these must resolve colours in the browser. Tailwind emits `oklab()`
for alpha backgrounds, and a naive parser reads that as black and reports a false 1.34:1.
Resolve computed colours through a throwaway DOM element so you always get rgb.

---

## Distrust a checker that reports mass failures

Two "disasters" this session were the checker, not the code:

- A link audit reported 124 broken links. The script was broken; every link resolved.
- A contrast audit reported 1.34:1 on visible white text. The parser could not read
  `oklab()`.

When a check reports that almost everything is broken, suspect the check first. Both were
investigated rather than "fixed" — and the second still paid off, because chasing it
surfaced a frosted-glass background that had no business in a print-derived design.

---

## JSX eats whitespace around inline components

`<Term>` renders inline, and JSX trims the whitespace between an element and adjacent
text on its own line. The result rendered as "solution treeis". Two fixes, both now
standard for any inline component:

- Put an explicit `{' '}` where a space must survive next to `<Term>`.
- Definitions are plain strings, so a straight double-quote inside one breaks the JSX
  attribute. Use typographic quotes in `terms.ts` copy.

---

## React 19 forbids setState in an effect

`react-hooks/set-state-in-effect` is an error, not a warning. Reading `localStorage` in a
`useEffect` and calling `setState` fails lint and causes a cascading render. Storage is an
external store: use `useSyncExternalStore` (see `src/lib/useLocalStorage.ts`), which also
gives correct hydration for free.

Related: anything persisted as JSON must be read back as JSON everywhere. The theme
inline-script silently stopped applying because it read a raw string while the hook wrote
`"dark"` with quotes.

---

## The verification passes, as a checklist

Run these against the finished stage before calling it done. They are currently ad hoc
scripts (TD-5); until they are committed, keep re-writing them.

- **Contrast** — every distinct text/background pair, both themes, all steps, WCAG AA.
  Expand every `Term` panel first, or you miss the popover surfaces.
- **Responsive** — no horizontal overflow and no sub-44px touch target, 320→2560px.
  Include the longest stage title as a stress case.
- **Console** — zero errors in a clean browser context (not a hot-reloaded one, which
  carries stale errors from mid-edit).

For anything visual, a screenshot review catches what scripts do not: invisible tokens, a
legend that promises colour coding the elements do not show, a layout that technically
passes but reads as dead space.
