'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { Card } from '@/components/ui'
import { CONTRACT_ROWS } from './contracts'

/**
 * Source: docs/03-architecture.md, "Design the API contracts".
 *
 * Expand-to-reveal rather than the doc's three-column table, for the reason
 * this stage now applies four times: a cell that is a sentence is a paragraph
 * pretending to be a cell.
 *
 * The cost badge is deliberately not colour-coded good-to-bad. "Expensive" is
 * not a failure — a public API you meant to publish is a correct expensive
 * contract — and `danger` on that row would say otherwise. Neutral borders,
 * with the word doing the work.
 */

const COST_LABEL: Record<string, string> = {
  cheap: 'cheap to change',
  expensive: 'expensive to change',
  'not-yours': 'not yours to change',
}

export function ContractCost() {
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
        {CONTRACT_ROWS.map((row) => {
          const open = openIds.has(row.id)
          const panelId = `contract-${row.id}`
          return (
            <li key={row.id}>
              <h3>
                <button
                  type="button"
                  onClick={() => toggle(row.id)}
                  aria-expanded={open}
                  aria-controls={panelId}
                  className="flex min-h-11 w-full items-center gap-3.5 px-5 py-3.5 text-left transition-colors duration-150 hover:bg-sunken lg:min-h-9"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block font-medium">{row.contract}</span>
                    <span className="mt-1 inline-block border border-line px-1.5 py-0.5 text-[11px] font-medium text-subtle">
                      {COST_LABEL[row.cost]}
                    </span>
                  </span>
                  <ChevronDown
                    className={`size-4 shrink-0 text-subtle transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
                    aria-hidden
                  />
                </button>
              </h3>

              {open && (
                <p
                  id={panelId}
                  className="border-t border-line bg-sunken px-5 py-4 text-sm leading-6 text-muted"
                >
                  {row.why}
                </p>
              )}
            </li>
          )
        })}
      </ul>

      <p className="border-t border-line bg-raised px-5 py-4 text-sm leading-6 text-muted">
        If your whole list lands in the first row, the sort is still worth
        thirty seconds. The value is noticing that you have nothing in rows two
        and three yet, and knowing which item would move there first.
      </p>
    </Card>
  )
}
