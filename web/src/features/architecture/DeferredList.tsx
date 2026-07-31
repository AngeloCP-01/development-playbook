'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { Card } from '@/components/ui'
import { DEFERRED_ITEMS } from './defer'

/**
 * Source: docs/03-architecture.md, "Defer aggressively".
 *
 * Six of the doc's seven items. The seventh is the closing claim — "each of
 * these solves a real problem, none of them solves a problem you have yet" —
 * which reads better as the prose it already is than as a row with nothing
 * to expand, so it closes the list instead of joining it. (Decision left to
 * this task by the brief; recorded in the commit body.)
 *
 * Modelled on `ValidationLadder` (discovery) for the collapsed-row shape,
 * with one change: items open independently, tracked as a `Set` of ids,
 * rather than as an accordion with one panel open at a time. There is no
 * ordering here for a single-open panel to defend, and a reader comparing
 * two items should be able to hold both open.
 *
 * Each expanded panel carries three lines, not two: the real problem the
 * thing solves, why it is not needed yet, and — the line most writing on
 * this topic skips — what carrying it costs today, before it has paid for
 * itself once.
 */

export function DeferredList() {
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
        {DEFERRED_ITEMS.map((item) => {
          const open = openIds.has(item.id)
          const panelId = `deferred-${item.id}`
          return (
            <li key={item.id}>
              <h3>
                <button
                  type="button"
                  onClick={() => toggle(item.id)}
                  aria-expanded={open}
                  aria-controls={panelId}
                  className="flex min-h-11 w-full items-center gap-3.5 px-5 py-3.5 text-left transition-colors duration-150 hover:bg-sunken lg:min-h-9"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block font-medium">{item.name}</span>
                    {item.failsTest && (
                      <span className="mt-1 inline-block border border-warn px-1.5 py-0.5 text-[11px] font-medium text-warn">
                        fails the test
                      </span>
                    )}
                    <span className="mt-0.5 block text-sm text-subtle">
                      {item.summary}
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
                    <p className="text-xs font-semibold uppercase tracking-wide text-blueprint">
                      The real problem it solves
                    </p>
                    <p className="mt-1 text-sm leading-6 text-muted">
                      {item.problem}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-subtle">
                      Why it is not yours yet
                    </p>
                    <p className="mt-1 text-sm leading-6 text-muted">
                      {item.notYet}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-warn">
                      What it costs you today
                    </p>
                    <p className="mt-1 text-sm leading-6 text-muted">
                      {item.costsToday}
                    </p>
                  </div>
                </div>
              )}
            </li>
          )
        })}
      </ul>

      <p className="border-t border-line bg-raised px-5 py-4 text-sm leading-6 text-muted">
        The test: defer anything whose reversal does not require migrating
        stored data. Adding a cache later touches code. Adding a queue later
        touches code. Those are afternoons, and you will make the decision with
        information you do not have today. One item above fails that test, which
        is why it is split into the part you decide now and the part you defer.
      </p>
    </Card>
  )
}
