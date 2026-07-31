'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { Card } from '@/components/ui'
import { RESILIENCE_PATTERNS } from './sketch'

/**
 * Source: docs/03-architecture.md, "Sketch the system" — its "Timeouts, retries
 * and failing well" subsection.
 *
 * Expand-to-reveal, modelled on `DeferredList` in this same feature: rows open
 * independently rather than as an accordion, because a reader comparing retries
 * against a breaker should be able to hold both open.
 *
 * The collapsed line is the failure rather than the mechanism. These are four
 * names a reader is likely to have heard and not been given a definition of, so
 * a list that reads "Circuit breaker — stops calling after failures" leaves them
 * exactly where they started; "your retries have made you part of the outage"
 * does not.
 */
export function ResiliencePatterns() {
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
        {RESILIENCE_PATTERNS.map((p) => {
          const open = openIds.has(p.id)
          const panelId = `resilience-${p.id}`
          return (
            <li key={p.id}>
              <h3>
                <button
                  type="button"
                  onClick={() => toggle(p.id)}
                  aria-expanded={open}
                  aria-controls={panelId}
                  className="flex min-h-11 w-full items-center gap-3.5 px-5 py-3.5 text-left transition-colors duration-150 hover:bg-sunken lg:min-h-9"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block font-medium">{p.name}</span>
                    <span className="mt-0.5 block text-sm text-subtle">
                      {p.summary}
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
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-warn">
                      The failure it answers
                    </p>
                    <p className="mt-1 text-sm leading-6 text-muted">
                      {p.failure}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-blueprint">
                      What it is
                    </p>
                    <p className="mt-1 text-sm leading-6 text-muted">
                      {p.what}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-go">
                      What earns it its place
                    </p>
                    <p className="mt-1 text-sm leading-6 text-muted">
                      {p.earnsItsPlace}
                    </p>
                  </div>
                  {p.catch && (
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-danger">
                        The catch
                      </p>
                      <p className="mt-1 text-sm leading-6 text-muted">
                        {p.catch}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </li>
          )
        })}
      </ul>

      <p className="border-t border-line bg-raised px-5 py-4 text-sm leading-6 text-muted">
        There is a fifth name worth knowing and not building:{' '}
        <strong className="font-medium text-fg">bulkhead</strong>, isolating
        resource pools so one saturated dependency cannot consume every thread.
        Real, and rarely earning its keep inside a single application. Building
        all four above around three third-party calls on day one is the same
        instinct as reaching for microservices, wearing different clothes.
      </p>
    </Card>
  )
}
