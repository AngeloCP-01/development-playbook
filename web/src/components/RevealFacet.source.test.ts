import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { expect, test } from 'vitest'

// RevealFacet.test.tsx asserts on the rendered `className` string, which
// looked at first like it covered the one failure this component exists to
// prevent: a tone rendered as `text-${tone}` rather than looked up in
// `TONE_CLASS`. It does not. `TONE_CLASS[tone]` and `text-${tone}` produce
// the identical runtime string for every one of the five tones — each
// tone's name is, by construction, the exact suffix of its own class — so
// no className assertion can tell the map from the interpolation apart. The
// defect only exists in Tailwind's compiled CSS: its build-time scanner
// looks for complete literal strings, so an interpolated class never gets a
// rule and renders with no colour. jsdom renders no CSS at all, so nothing
// in a render test, this component's or any other, can observe that.
//
// This test stands in for the scanner instead. It reads RevealFacet.tsx's
// own source text — the same thing Tailwind reads — and checks that every
// tone's class name is present there as a complete literal string. The
// moment the map is replaced with an interpolation, the literal disappears
// from the file even though both render tests keep passing.
const TONES = ['blueprint', 'warn', 'go', 'danger', 'subtle']

const SOURCE = readFileSync(
  fileURLToPath(new URL('./RevealFacet.tsx', import.meta.url)),
  'utf8',
)

test('every tone class is written out as a complete literal in RevealFacet.tsx, since an interpolated one is invisible to Tailwind and to jsdom alike', () => {
  const missing = TONES.filter((tone) => !SOURCE.includes(`text-${tone}`))
  expect(missing).toEqual([])
})

// `BODY_TONE_CLASS` (Task 15) is the same shape of map for the same reason —
// `text-${bodyTone}` would be just as invisible to Tailwind's scanner as
// `text-${tone}` above, and just as unable to fail a className-content
// render test, since `muted`/`fg` are each the literal suffix of their own
// class too. Covered separately from `TONES` because it is a distinct map
// in the source, not an extension of it.
const BODY_TONES = ['muted', 'fg']

test('every body tone class is written out as a complete literal in RevealFacet.tsx, for the same reason as the label tones above', () => {
  const missing = BODY_TONES.filter(
    (bodyTone) => !SOURCE.includes(`text-${bodyTone}`),
  )
  expect(missing).toEqual([])
})
