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

---

## Ask what the doc teaches that the app does not, section by section

Added after stage 04, where it was the single most valuable check of the round and nothing
in the gate could have replaced it.

The port was green on everything: 518 tests, a 17-test audit over 63 URLs, every panel
under the weight ceiling, five per-task reviews already closed. A reviewer then walked
`docs/04-project-setup.md` heading by heading against the panels and found **five sections
whose material the app never taught** — and they shared one shape:

> the app tells the reader to run a script, or set a value, that it never shows them how to
> create.

Both the CI artifact and the lefthook artifact invoked `pnpm test` while nothing said to
write that script. `format:check` the same. The three files that pin a Node version were
described in prose and never shown. Sentry's missing-token problem was diagnosed with no
fix given. Vercel's environment variables were absent entirely.

**Every one had been assigned to a panel by the plan's own line ranges.** They were silent
drops, not curations, and no test can see the difference: a data module asserted against
the doc proves the data it *has* matches, and says nothing about data it never got.

**The symptom is visible in the panel measurements, if you look for it.** Stage 04's median
panel was **1.74 screens** against stage 03's authored **3.02**. I read that as "either the
seam is finer than the content needs, or the panels are thin" and could not tell which. It
was neither. It was content that had gone missing, and the median moved to 2.28 once the
five sections landed. A stage measuring well under its comparable's median is a signal to
go looking, not a compliment.

**The method, which is cheap:** open the doc and the panel file side by side, walk every
heading including the closing sections, and write a row per section saying which panel
carries it and what specifically. Anything you cannot name lands in a "not ported"
list with a reason. That table is now `docs/stage-04-status.md`'s coverage section, and
writing it is what forces the question.

Do it **before** believing a port is complete, and do it with fresh eyes — the session that
wrote the panels is the worst reader of them, because it remembers intending to cover
things.

---

## A teeth check can lie, in two ways that both look like a pass

Stage 04 hit both, and one of them caught the controller rather than an implementer.

**The mutation did not land.** `perl -0pi -e 's/className="t-data"/.../'` without `/g`
replaces the *first* occurrence in the slurped file — which was a mention inside a docblock,
not the JSX. The test "survived" a mutation that never touched the code, and read as
toothless. Confirm the mutation is actually in the file before trusting what the run says.

The same shape bit twice more in a different guise: a Python edit script that `assert`s
several anchors and writes at the end will abort on the first miss and write **nothing**,
while its earlier substitutions look applied. Two rounds of "I already fixed that" turned
out to be that. Write unconditionally and report the misses.

**Both sides of the assertion came from the same source.** A render test read
`getAttribute('data-catches')` and compared it to `String(gate.catchesIt)` — both off the
same row. Flipping the data moves the expectation along with the render, so the plan's
prescribed mutation proved nothing at all. The fix is a literal: *exactly one gate catches,
and it is the browser*. Any assertion shaped `expect(rendered).toBe(String(row.flag))` has
this hole.

---

## Check which testing libraries the project actually installs

Stage 04's plan wrote every `.tsx` test against `@testing-library/jest-dom` and
`@testing-library/user-event`. This project installs neither. About twenty tests would have
failed on `Invalid Chai property: toBeInTheDocument` rather than on anything real, and the
first one to hit it read like a broken component.

The house convention is `fireEvent` from `@testing-library/react` plus plain DOM assertions
(`el.getAttribute(...)`, `(el as HTMLInputElement).checked`). `src/components/RevealList.test.tsx`
is the example. `src/test/setup.ts` argues in writing against growing a second
responsibility, which is the case against adding jest-dom now.
