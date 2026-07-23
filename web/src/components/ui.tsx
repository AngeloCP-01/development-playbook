import type { ReactNode } from 'react'
import { AlertTriangle, Check, Info, X } from 'lucide-react'

/**
 * Surfaces are drawn, not floated: hairline rules and flat fills, no shadows.
 * A drawing has linework and paper, and nothing hovers above the sheet.
 */

export function Section({
  id,
  eyebrow,
  title,
  children,
}: {
  id?: string
  eyebrow?: string
  title: string
  children: ReactNode
}) {
  return (
    <section id={id} className="scroll-mt-24">
      {eyebrow && (
        <div className="mb-4 flex items-center gap-3">
          <span className="t-label text-brand">{eyebrow}</span>
          <span className="h-px flex-1 bg-line" aria-hidden />
        </div>
      )}
      <h2 className="t-head mb-6 text-pretty text-xl sm:text-2xl">{title}</h2>
      {children}
    </section>
  )
}

export function Prose({ children }: { children: ReactNode }) {
  return (
    <div className="max-w-[64ch] space-y-4 text-[1.0625rem] leading-[1.75] text-muted">
      {children}
    </div>
  )
}

const CALLOUT = {
  info: { fg: 'text-blueprint', bg: 'bg-sunken', Icon: Info },
  warn: { fg: 'text-warn', bg: 'bg-warn-tint', Icon: AlertTriangle },
  trap: { fg: 'text-danger', bg: 'bg-danger-tint', Icon: AlertTriangle },
} as const

export function Callout({
  kind = 'info',
  title,
  children,
}: {
  kind?: keyof typeof CALLOUT
  title: string
  children: ReactNode
}) {
  const { fg, bg, Icon } = CALLOUT[kind]
  return (
    <div className={`border border-line ${bg} px-5 py-4`}>
      <p
        className={`t-ui mb-1.5 flex items-center gap-2 text-sm font-semibold ${fg}`}
      >
        <Icon className="size-4 shrink-0" aria-hidden />
        {title}
      </p>
      <div className="measure text-[0.9375rem] leading-relaxed text-muted">
        {children}
      </div>
    </div>
  )
}

/** A good/bad pair. Each side is labelled, so colour is never the only signal. */
export function Contrast({
  bad,
  good,
  badLabel = 'Weak',
  goodLabel = 'Strong',
}: {
  bad: ReactNode
  good: ReactNode
  badLabel?: string
  goodLabel?: string
}) {
  return (
    <div className="grid border border-line sm:grid-cols-2">
      <div className="border-b border-line p-4 sm:border-b-0 sm:border-r">
        <p className="t-label mb-2 flex items-center gap-1.5 text-danger">
          <X className="size-3.5" aria-hidden />
          {badLabel}
        </p>
        <div className="text-[0.9375rem] leading-relaxed">{bad}</div>
      </div>
      <div className="bg-sunken p-4">
        <p className="t-label mb-2 flex items-center gap-1.5 text-go">
          <Check className="size-3.5" aria-hidden />
          {goodLabel}
        </p>
        <div className="text-[0.9375rem] leading-relaxed">{good}</div>
      </div>
    </div>
  )
}

export function Card({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div className={`border border-line bg-raised p-5 sm:p-6 ${className}`}>
      {children}
    </div>
  )
}
