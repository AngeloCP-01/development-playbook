'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { Card } from '@/components/ui'
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
 * to prevent.
 *
 * Fifth expand-to-reveal in this feature with the same markup (DeferredList,
 * DeploymentStyles, ResiliencePatterns, EvolutionNotes). Named rather than
 * fixed: folding them into one component touches four files that have been
 * reviewed and is a change of its own, not a rider on this one.
 */

export function ScalingMoves() {
  const [openIds, setOpenIds] = useState<Set<string>>(new Set())

  const toggle = (id: string) =>
    setOpenIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })

  const precondition = SCALING_MOVES.find((m) => m.precondition)
  const moves = SCALING_MOVES.filter((m) => !m.precondition)

  return (
    <Card className="p-0">
      {precondition && (
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
      )}

      <ul className="divide-y divide-line">
        {moves.map((move) => {
          const open = openIds.has(move.id)
          const panelId = `scaling-${move.id}`
          return (
            <li key={move.id}>
              <h3>
                <button
                  type="button"
                  onClick={() => toggle(move.id)}
                  aria-expanded={open}
                  aria-controls={panelId}
                  className="flex min-h-11 w-full items-center gap-3.5 px-5 py-3.5 text-left transition-colors duration-150 hover:bg-sunken lg:min-h-9"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block font-medium">{move.name}</span>
                    <span className="mt-0.5 block text-sm text-subtle">
                      {move.summary}
                    </span>
                  </span>
                  <ChevronDown
                    className={`size-4 shrink-0 text-subtle transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
                    aria-hidden
                  />
                </button>
              </h3>

              {open && (
                <div
                  id={panelId}
                  className="space-y-3 border-t border-line bg-sunken px-5 py-4"
                >
                  <p className="text-sm leading-6 text-muted">{move.what}</p>
                  {move.catch && (
                    <div>
                      <p className="t-label text-warn">
                        The part not in the name
                      </p>
                      <p className="mt-1 text-sm leading-6 text-muted">
                        {move.catch}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </li>
          )
        })}
      </ul>
    </Card>
  )
}
