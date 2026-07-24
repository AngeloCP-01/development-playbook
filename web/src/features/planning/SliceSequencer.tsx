'use client'

import { useState } from 'react'
import { Check, RotateCcw, X } from 'lucide-react'
import { Card } from '@/components/ui'
import { Figure } from '@/components/Figure'
import { SLICES, scoreOrder, type OrderVerdict } from './scoring'
import { RiskOrder } from './RiskOrder'

/**
 * Source: docs/02-planning.md:70-84.
 *
 * Click-to-order, not drag-and-drop — drag needs a keyboard fallback to clear
 * the a11y baseline and its reorder math is where bugs live. Clicking an
 * unchosen slice appends it; clicking a chosen one removes it, and because
 * every position is computed from `order.indexOf` at render time, the rest
 * renumber for free rather than needing a separate reindex step.
 *
 * The verdict reports two rules, never one combined score: a reader who opens
 * with the risky slice satisfies "risk early" and fails "end-to-end first" —
 * the right instinct, wrong slot — and collapsing that into one pass/fail
 * would hide exactly the mistake worth naming.
 */

export function SliceSequencer() {
  const [order, setOrder] = useState<string[]>([])
  const [locked, setLocked] = useState(false)

  const toggle = (id: string) => {
    if (locked) return
    setOrder((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    )
  }

  const allPlaced = order.length === SLICES.length
  const verdict: OrderVerdict | null = locked ? scoreOrder(order) : null

  const reset = () => {
    setOrder([])
    setLocked(false)
  }

  return (
    <Card>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium">Put these slices in build order</p>
          <p className="text-sm text-subtle">
            Click a slice to place it next. Click it again to remove it.
          </p>
        </div>
        {locked && (
          <button
            type="button"
            onClick={reset}
            className="flex min-h-11 items-center gap-1.5 border border-line px-2.5 text-xs text-muted transition-colors duration-150 hover:bg-sunken hover:text-fg lg:min-h-9"
          >
            <RotateCcw className="size-3.5" aria-hidden />
            Try again
          </button>
        )}
      </div>

      <ul className="space-y-2">
        {SLICES.map((slice) => {
          const position = order.indexOf(slice.id)
          const chosen = position !== -1

          return (
            <li key={slice.id}>
              <button
                type="button"
                onClick={() => toggle(slice.id)}
                disabled={locked}
                aria-pressed={chosen}
                className={[
                  'flex min-h-11 w-full items-center gap-3 border px-3.5 py-2.5 text-left transition-colors duration-150 disabled:cursor-default',
                  chosen
                    ? 'border-brand bg-brand-tint'
                    : 'border-line bg-raised hover:border-line-strong',
                ].join(' ')}
              >
                <span
                  className={[
                    't-data flex size-7 shrink-0 items-center justify-center border text-xs',
                    chosen
                      ? 'border-brand bg-brand text-brand-fg'
                      : 'border-line text-subtle',
                  ].join(' ')}
                >
                  {chosen ? position + 1 : ''}
                </span>
                <span className="min-w-0 flex-1 break-words text-sm text-fg">
                  {slice.label}
                </span>
                <span className="t-data shrink-0 text-xs text-subtle">
                  {slice.size}
                </span>
                <span className="sr-only">
                  {chosen ? `, position ${position + 1}` : ', not yet placed'}
                </span>
              </button>
            </li>
          )
        })}
      </ul>

      {!locked && (
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => allPlaced && setLocked(true)}
            disabled={!allPlaced}
            className="min-h-11 border border-line bg-raised px-4 text-sm font-medium text-fg transition-colors duration-150 enabled:hover:border-brand enabled:hover:text-brand disabled:cursor-not-allowed disabled:text-subtle"
          >
            Lock in order
          </button>
          {!allPlaced && (
            <span className="t-data text-xs text-subtle">
              {SLICES.length - order.length} left to place
            </span>
          )}
        </div>
      )}

      <div aria-live="polite">
        {verdict && (
          <div className="mt-5 space-y-4 border-t border-line pt-5">
            <ul className="space-y-2">
              <RuleLine
                ok={verdict.endToEndFirst}
                name="Something works end to end first"
              />
              <RuleLine
                ok={verdict.riskEarly}
                name="The risky slice is scheduled early"
              />
            </ul>

            {verdict.notes.length > 0 && (
              <ul className="space-y-2">
                {verdict.notes.map((note) => (
                  <li
                    key={note}
                    className="border-l-2 border-line pl-3 text-sm leading-6 text-muted"
                  >
                    {note}
                  </li>
                ))}
              </ul>
            )}

            <div>
              <p className="t-label mb-2 text-subtle">
                Your order, with the reasoning
              </p>
              <ul className="space-y-2">
                {order.map((id, i) => {
                  const slice = SLICES.find((s) => s.id === id)
                  if (!slice) return null
                  return (
                    <li key={id} className="border border-line bg-sunken p-3.5">
                      <p className="mb-1 flex items-baseline gap-2 text-sm font-medium text-fg">
                        <span className="t-data shrink-0 text-subtle">
                          {i + 1}.
                        </span>
                        <span className="min-w-0 break-words">
                          {slice.label}
                        </span>
                      </p>
                      <p className="measure text-sm leading-6 text-muted">
                        {slice.why}
                      </p>
                    </li>
                  )
                })}
              </ul>
            </div>

            <Figure
              n={5}
              caption="Your locked order, replotted as cost of discovery. It rises with position, which is the whole argument for scheduling the risky slice early rather than first — early enough to catch a bad surprise, not so early that nothing else is demonstrable yet."
            >
              <RiskOrder order={order} />
            </Figure>
          </div>
        )}
      </div>
    </Card>
  )
}

function RuleLine({ ok, name }: { ok: boolean; name: string }) {
  return (
    <li
      className={[
        'flex items-center gap-2 text-sm font-semibold',
        ok ? 'text-go' : 'text-danger',
      ].join(' ')}
    >
      {ok ? (
        <Check className="size-4 shrink-0" aria-hidden />
      ) : (
        <X className="size-4 shrink-0" aria-hidden />
      )}
      {name}
    </li>
  )
}
