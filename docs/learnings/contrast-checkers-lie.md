# When the contrast checker is the bug

Four times now a colour audit in this repo has reported a failure that did not exist. Each
one cost real time before it was disproved. The failures have nothing in common except the
thing that matters: **the checker was wrong, not the design.**

This is the guide for the next person who gets a scary number.

## The rule

A contrast checker reads colours through two lenses that can each distort them: **when** it
reads, and **how** it converts what it read. Get either wrong and you get a confident,
precise, entirely fictional ratio.

Before you touch a token, reproduce the failure a second way. If the second method
disagrees, the checker is the suspect.

---

## Trap 1: reading during a theme transition

This one produced a phantom AA failure on the stage 03 branch and was chased before it was
disproved.

The pattern that causes it:

```js
// WRONG — the read happens while the colour is still moving
await page.evaluate(() => {
  document.documentElement.dataset.theme = 'light'
  return getComputedStyle(el).color // interpolated, not final
})
```

Elements in this app carry `transition-colors duration-150`. `getComputedStyle` returns the
**used** value, and mid-transition the used value is a blend of the old colour and the new
one. Flip the theme and read in the same call and you sample a colour that exists for about
a tenth of a second and belongs to neither theme. It is not the light value, it is not the
dark value, and it can easily fail AA against either background.

**The decisive evidence** that settled it: the reported failing colour was
`rgb(173,192,212)` — which is dark mode's `--graphite`. On a clean reload in light mode,
that colour appears **nowhere in the render**. A colour that is absent from the page cannot
be failing on the page. That check is the one to run: if the offending value only shows up
when you flip, it is an artifact of flipping.

**How to avoid it.** Do not flip the theme at all. Open a separate browser context per
theme, which is what the committed suite does:

```js
const context = await browser.newContext({ colorScheme: 'dark' })
```

Each context loads already in its theme, so nothing is in flight. If you must flip in a
live page, wait past the transition — comfortably past it, 400ms for a 150ms transition —
before reading anything.

The same caution applies to any read of a computed style after a class change, not only
colour. Layout reads are usually safe because layout is not transitioned here; colour reads
are not.

**It recurred on the stage 06 branch (2026-08-27).** A standalone committed-drill contrast
sweep drove the theme toggle with a script, then read six pairs — and reported six
failures, every one matching a stale light-mode token exactly, in what the sweep's own
context claimed was dark mode. Nothing had regressed; the read landed mid-transition again,
for the identical reason as the first instance, on a different script written by a
different session. Resolved the same way: reproduce clean-loaded per theme instead of
toggling and reading in the same call, and treat a token match to the *other* theme's known
value as the tell rather than trusting the label the script put on the run.

---

## Trap 2: parsing `oklab()` with a regex

Tailwind emits `oklab()` for any colour with an alpha modifier — `text-subtle/70` becomes
`oklab(0.495531 -0.00800876 -0.0355571 / 0.7)`. A regex that scrapes numbers out of a
colour string will happily pull `0.495531`, `-0.008`, `-0.0356` and treat them as R, G and
B in the 0–255 range.

The result is not an error. It is a number, and the number is garbage. This has now
happened twice:

- A parser once reported **1.34:1** on a pair that was fine.
- A probe I wrote while verifying stage 03 reported **7.64:1 in light and 1.09:1 in dark**
  for the same placeholder colour. Both were arithmetic on oklab's lightness/a/b channels.
  The giveaway was that `oklab(0.7334 …)` is a *pale* colour, and a pale colour cannot
  composite to `rgb(3,6,10)`.

**Do not parse colours. Rasterize them.** Paint the colour and read the pixel back, so the
browser does the conversion and the alpha compositing:

```js
const cv = document.createElement('canvas')
const ctx = cv.getContext('2d', { willReadFrequently: true })
// paint the opaque background, then the semi-transparent colour over it
ctx.fillStyle = 'rgb(230,228,220)'
ctx.fillRect(0, 0, 4, 4)
ctx.fillStyle = getComputedStyle(el, '::placeholder').color // oklab(...) is fine
ctx.fillRect(0, 0, 4, 4)
const [r, g, b] = ctx.getImageData(2, 2, 1, 1).data // real sRGB
```

Assigning to `fillStyle` and reading the *string* back does **not** work — Chromium echoes
`oklab()` unchanged. Only the rasterized pixel is trustworthy.

The committed suite used to dodge this differently, by skipping any colour it could not
parse (`!/okl|lab|lch/.test(c)`). That is honest but it means alpha colours go **unchecked**
rather than checked, and the comment above it claimed the opposite — that it resolved oklab
"via the browser itself".

**That gap was live for a round after this guide described it.** Tailwind emits oklab for
*any* alpha colour, so the rule the suite actually enforced was: add an opacity and leave the
audit. Three worksheets shipped placeholders at 2.75:1 that way, against a `--faint` token
deliberately tuned to 4.80:1 — the dilution happened at the call site and nothing looked.

Closed 2026-08-11 (**TD-16**): the suite now rasterises, using the snippet above, and refuses
to guess when `fillStyle` rejects a colour rather than silently reporting the background as
the foreground. Writing the trap down is not the same as closing it.

---

## Trap 3: the checker cannot see the thing at all

The quietest failure. The audit suite samples elements with a text node:

```js
const t = el.textContent?.trim()
if (!t || t.length < 3 || el.children.length) continue
```

A `placeholder` has no text node. So every placeholder in the app has been invisible to the
contrast gate since it was written, and all three worksheets have shipped placeholder text
at **2.77:1** in light mode. Green suite, real failure.

Same shape, different cause: the suite opens every `button[aria-controls]` before sampling,
but never commits a `role="radio"`. Every revealed verdict surface — the `go` and `danger`
colours, the score line — is therefore never sampled either.

**A passing checker is evidence about what it looked at, and silent about the rest.** When
you add a surface that appears only after an interaction, or that has no text node, assume
the gate does not cover it until you have proved otherwise.

Placeholders were the sharpest case of "no text node": the sweep keyed off `el.textContent`,
and an empty field has none, so seventeen fields across three worksheets were never sampled
in either theme. They are also the worst ones to lose here, because in this app the
placeholder *is* the worked example — it shows the reader what a good answer looks like.
`input, textarea` are now sampled explicitly through `getComputedStyle(el, '::placeholder')`
(**TD-16**).

**Confirmed still true on stage 06 (2026-08-27), one radio button later.** The committed
audit walks `aria-expanded` and `aria-selected` to open every disclosure before sampling,
but a locked `TriageDrill`/`TeethCheck` row is a `role="radio"` set to `disabled` — neither
attribute the walker looks for, so a locked option and its revealed verdict block go
unsampled the same way the uncommitted `button[aria-controls]` verdicts did at the stage
this trap was first written for. A standalone committed-state sweep built to check found
**zero failures across all eight panels, both themes** — so nothing is actually broken
today — but the audit itself still cannot see the surface, and a future stage's colours
there are unverified by the suite until the walker learns to commit a radiogroup the way it
already opens a disclosure. Flagged for stage 07 to budget for, not fixed here.

---

## The habit

1. **Reproduce a failure a second way before believing it.** Different method, not the same
   script run twice.
2. **Sanity-check the checker against a pair you know passes.** A rasterizer that reads
   12.27:1 on body text is probably reading the placeholder correctly too. One that reports
   mass failures across unrelated pairs is broken.
3. **Ask whether the value is physically possible.** A pale colour cannot composite to near
   black. This caught both oklab bugs faster than any amount of code reading.
4. **Ask what the checker did not look at.** That is where the real bug was, all three
   times the checker itself was fine.
