import { RevealList } from '@/components/RevealList'
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
 *
 * The "part not in the name" blocks keep their own `t-label` markup rather
 * than becoming `RevealFacet`s, the same exclusion `Normalisation` and
 * `SoftDelete` make and for the same reason: `t-label` is mono, tracked caps,
 * and `RevealFacet` hardcodes `text-xs font-semibold uppercase tracking-wide`
 * — a different family, size, weight and tracking. The migration did swap
 * them for one commit, which measured as Newsreader 12px/600 against
 * JetBrains Mono 11px/500 and widened each label by 50px; reverted, since a
 * refactor that says it changes where code lives should not change what
 * renders.
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
              <div>
                <p className="t-label text-warn">The part not in the name</p>
                <p className="mt-1 text-sm leading-6 text-muted">
                  {move.catch}
                </p>
              </div>
            )}
          </>
        ),
      }))}
    />
  )
}
