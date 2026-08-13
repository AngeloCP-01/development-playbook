import type { ReactNode } from 'react'

/**
 * One labelled paragraph inside a `RevealList` row body. Thirteen of these
 * were written out longhand across five components in the architecture
 * feature before this existed.
 *
 * `TONE_CLASS` is a static map, not a template literal, because Tailwind's
 * build-time scanner only keeps a class it can see written out whole in
 * source. `text-${tone}` survives typecheck and lint and compiles to a class
 * attribute Tailwind never generated a rule for, so it renders with no
 * colour — but that failure lives entirely in the compiled CSS, and jsdom
 * renders no CSS at all. So neither render test below can see it: the map
 * and the interpolation produce byte-identical `className` strings for
 * every tone, since each tone's name is, by construction, the exact suffix
 * of its own class. `RevealFacet.source.test.ts` is what actually catches
 * this — it reads this file's own text, the same thing Tailwind reads, and
 * checks each tone's class is still present as a complete literal.
 *
 * The two render tests below guard something real but different: that a
 * tone reaches the DOM as a class at all, and that an unspecified tone
 * falls back to `subtle` rather than to no colour.
 */

type Tone = 'blueprint' | 'warn' | 'go' | 'danger' | 'subtle'

const TONE_CLASS: Record<Tone, string> = {
  blueprint: 'text-blueprint',
  warn: 'text-warn',
  go: 'text-go',
  danger: 'text-danger',
  subtle: 'text-subtle',
}

/**
 * The body paragraph's colour. `muted` is the default and reproduces every
 * existing caller's rendered output byte-for-byte. `fg` exists for
 * `ADRAnatomy`'s worked-example block (Task 14): its body is full ink, not
 * muted graphite — genuinely different tokens in both themes, not a
 * near-match. Same static-map shape as `TONE_CLASS`, for the same reason:
 * `text-${bodyTone}` would survive typecheck and lint and ship unstyled.
 */
type BodyTone = 'muted' | 'fg'

const BODY_TONE_CLASS: Record<BodyTone, string> = {
  muted: 'text-muted',
  fg: 'text-fg',
}

export function RevealFacet({
  label,
  tone = 'subtle',
  bodyTone = 'muted',
  children,
}: {
  label: string
  tone?: Tone
  bodyTone?: BodyTone
  children: ReactNode
}) {
  return (
    <div>
      <p
        className={`text-xs font-semibold uppercase tracking-wide ${TONE_CLASS[tone]}`}
      >
        {label}
      </p>
      <p className={`mt-1 text-sm leading-6 ${BODY_TONE_CLASS[bodyTone]}`}>
        {children}
      </p>
    </div>
  )
}
