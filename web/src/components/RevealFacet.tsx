import type { ReactNode } from 'react'

/**
 * One labelled paragraph inside a `RevealList` row body. Thirteen of these
 * were written out longhand across five components in the architecture
 * feature before this existed.
 *
 * The tone map is not ceremony. Tailwind scans source for complete class
 * strings, so `text-${tone}` survives typecheck and lint and renders with no
 * colour at all — a defect no data test can see, which is why this component
 * carries a render test asserting the emitted class.
 */

type Tone = 'blueprint' | 'warn' | 'go' | 'danger' | 'subtle'

const TONE_CLASS: Record<Tone, string> = {
  blueprint: 'text-blueprint',
  warn: 'text-warn',
  go: 'text-go',
  danger: 'text-danger',
  subtle: 'text-subtle',
}

export function RevealFacet({
  label,
  tone = 'subtle',
  children,
}: {
  label: string
  tone?: Tone
  children: ReactNode
}) {
  return (
    <div>
      <p
        className={`text-xs font-semibold uppercase tracking-wide ${TONE_CLASS[tone]}`}
      >
        {label}
      </p>
      <p className="mt-1 text-sm leading-6 text-muted">{children}</p>
    </div>
  )
}
