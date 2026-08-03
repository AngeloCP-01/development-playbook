'use client'

import { useState } from 'react'
import { ArrowRight, ChevronDown } from 'lucide-react'
import { Card } from '@/components/ui'
import { CHARACTERISTICS, TRACE_ROWS } from './characteristics'

/**
 * Source: docs/03-architecture.md, "What this system has to be".
 *
 * The doc's trace-forward table, as expand-to-reveal rather than a table:
 * every row's payload is a paragraph, which is the case `PATTERNS.md` names
 * this pattern for, and a three-column table at 320px is an overflow risk for
 * content that reflows perfectly well as prose.
 *
 * Each row links to the step where the decision it forces actually gets made.
 * That link is the section's argument in one gesture — the characteristic is
 * not a label, it is the reason a later step goes the way it does.
 */

const NAME_BY_ID = new Map(CHARACTERISTICS.map((c) => [c.id, c.name]))

export function TraceForward() {
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

  return (
    <Card className="p-0">
      <ul className="divide-y divide-line">
        {TRACE_ROWS.map((row) => {
          const open = openIds.has(row.characteristicId)
          const panelId = `trace-${row.characteristicId}`
          return (
            <li key={row.characteristicId}>
              <h3>
                <button
                  type="button"
                  onClick={() => toggle(row.characteristicId)}
                  aria-expanded={open}
                  aria-controls={panelId}
                  className="flex min-h-11 w-full items-center gap-3.5 px-5 py-3.5 text-left transition-colors duration-150 hover:bg-sunken lg:min-h-9"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block font-medium">
                      {NAME_BY_ID.get(row.characteristicId) ??
                        row.characteristicId}
                    </span>
                    <span className="mt-0.5 block text-sm text-subtle">
                      forces a decision in {row.stepLabel}
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
                  className="border-t border-line bg-sunken px-5 py-4"
                >
                  <p className="text-sm leading-6 text-muted">{row.forces}</p>
                  <a
                    href={`#${row.stepId}`}
                    className="mt-3 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-brand lg:min-h-9"
                  >
                    Go to {row.stepLabel}
                    <ArrowRight className="size-3.5 shrink-0" aria-hidden />
                  </a>
                </div>
              )}
            </li>
          )
        })}
      </ul>

      <p className="border-t border-line bg-raised px-5 py-4 text-sm leading-6 text-muted">
        Every row is a decision this stage makes anyway. Choosing the
        characteristic first is what turns it from a preference into something
        with a reason attached. Which gives you the test: a characteristic that
        traces to no decision was not chosen, it was listed. If
        &ldquo;secure&rdquo; is on your list and nothing downstream changed
        because of it, delete it. It is doing no work, and it is crowding out
        one that would.
      </p>
    </Card>
  )
}
