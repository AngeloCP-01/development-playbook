'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { Callout, Card } from '@/components/ui'
import { FILTER_RULE, SOFT_DELETE_MECHANICS } from './soft-delete'

/**
 * Source: docs/03-architecture.md, "Design the database".
 *
 * Expand-to-reveal rather than an open list: `tenancy` measured 4.1 screens
 * with the three mechanics rendered open, and D-49 says the threshold is met
 * by disclosure rather than by cutting. Collapsed, each row names its trade,
 * which is what a reader comparing three options needs to see at once.
 *
 * The default is marked with `brand` — "you are here", the sense
 * `DeploymentStyles` uses for the row this stage teaches, not "correct". The
 * other two have cases where they win, which the rows say.
 *
 * Seventh accordion in this feature with the same markup, which is recorded
 * debt (`RevealList`, docs/tracker.md). Copied rather than invented.
 */

export function SoftDelete() {
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
        {SOFT_DELETE_MECHANICS.map((m) => {
          const open = openIds.has(m.id)
          const panelId = `soft-delete-${m.id}`
          return (
            <li key={m.id}>
              <h3>
                <button
                  type="button"
                  onClick={() => toggle(m.id)}
                  aria-expanded={open}
                  aria-controls={panelId}
                  className="flex min-h-11 w-full items-center gap-3.5 px-5 py-3.5 text-left transition-colors duration-150 hover:bg-sunken lg:min-h-9"
                >
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="font-medium">{m.name}</span>
                      {m.isDefault && (
                        <span className="border border-brand px-1.5 py-0.5 text-[11px] font-medium text-brand">
                          the default
                        </span>
                      )}
                    </span>
                    <span className="mt-0.5 block text-sm text-subtle">
                      {m.summary}
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
                  <p className="text-sm leading-6 text-muted">{m.what}</p>
                  <div>
                    <p className="t-label text-go">Reach for it when</p>
                    <p className="mt-1 text-sm leading-6 text-muted">
                      {m.useWhen}
                    </p>
                  </div>
                  <div>
                    <p className="t-label text-danger">
                      It is the wrong reach when
                    </p>
                    <p className="mt-1 text-sm leading-6 text-muted">
                      {m.wrongWhen}
                    </p>
                  </div>
                </div>
              )}
            </li>
          )
        })}
      </ul>

      <div className="border-t border-line bg-raised px-5 py-4">
        <Callout
          kind="warn"
          title="The column is easy; the filter is what bites"
        >
          {FILTER_RULE}
        </Callout>
      </div>
    </Card>
  )
}
