import { RevealList } from '@/components/RevealList'
import { RevealFacet } from '@/components/RevealFacet'
import { SCALING_MOVES } from './styles'

/**
 * Source: docs/03-architecture.md, "The shapes a system can take" and "Start
 * with one application".
 *
 * The precondition is lifted out of the list rather than sitting in it as the
 * first row. The doc's claim is that statelessness decides whether the
 * deployment table is available to you at all, and a list renders every entry
 * as a peer — a reader scanning five collapsed rows would read "statelessness"
 * as one option among five, which is the exact misreading the section exists
 * to prevent. It goes in `RevealList`'s `header` slot, never as a row.
 */

export function ScalingMoves() {
  const precondition = SCALING_MOVES.find((m) => m.precondition)
  const moves = SCALING_MOVES.filter((m) => !m.precondition)

  return (
    <RevealList
      idPrefix="scaling"
      header={
        precondition ? (
          <div className="border-b border-line bg-raised px-5 py-4">
            <h3 className="flex flex-wrap items-center gap-2">
              <span className="font-medium">{precondition.name}</span>
              <span className="border border-brand px-1.5 py-0.5 text-[11px] font-medium text-brand">
                the precondition
              </span>
            </h3>
            <p className="mt-1.5 text-sm leading-6 text-muted">
              {precondition.what}
            </p>
            {precondition.catch && (
              <p className="mt-2 text-sm leading-6 text-muted">
                {precondition.catch}
              </p>
            )}
          </div>
        ) : undefined
      }
      rows={moves.map((move) => ({
        id: move.id,
        title: move.name,
        summary: move.summary,
        body: (
          <>
            <p className="text-sm leading-6 text-muted">{move.what}</p>
            {move.catch && (
              <RevealFacet label="The part not in the name" tone="warn">
                {move.catch}
              </RevealFacet>
            )}
          </>
        ),
      }))}
    />
  )
}
