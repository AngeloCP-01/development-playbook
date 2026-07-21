import type { ReactNode } from 'react'

/**
 * A numbered, captioned figure.
 *
 * Diagrams that float in the text read as decoration. Numbering and captioning
 * them makes them referenceable ("see figure 3") and, more importantly, forces
 * each one to state what it is claiming — which is the difference between a
 * picture and an explanation.
 */
export function Figure({
  n,
  caption,
  children,
}: {
  n: number
  caption: string
  children: ReactNode
}) {
  return (
    <figure className="my-6">
      {children}
      <figcaption className="mt-3 flex gap-3 text-[0.9375rem] leading-relaxed text-muted">
        <span className="t-label shrink-0 pt-1 text-brand">Fig {n}</span>
        <span className="measure">{caption}</span>
      </figcaption>
    </figure>
  )
}
