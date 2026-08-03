'use client'

import { useState } from 'react'
import { Card } from '@/components/ui'
import { CONTRACT_DECISIONS, ROUTE_ANSWERS } from './contracts'

/**
 * Source: docs/03-architecture.md, "Design the API contracts".
 *
 * A reveal, not a scorer. The doc says picking either consistently beats
 * agonising, so there is no defensible answer to score against — and D-49
 * gives this step one committed exercise, which is `AuthzPatterns`.
 *
 * The two answers sit side by side rather than one being the default with the
 * other in a footnote, because the second is the one carrying the insight: if
 * you would want to know later who approved what and when, the verb was an
 * entity all along.
 */

export function RouteShape() {
  const [openId, setOpenId] = useState<string | null>(null)

  return (
    <Card>
      <p className="text-sm font-medium text-fg">
        When the operation is a verb, not a document
      </p>
      <p className="mt-1 text-[0.9375rem] leading-relaxed text-muted">
        Approving a claim, withdrawing one, cancelling a shift: none of those is
        a create, read, update or delete on a noun. Two workable answers, and
        picking either consistently beats agonising over which.
      </p>

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {ROUTE_ANSWERS.map((answer) => {
          const open = openId === answer.id
          const panelId = `route-${answer.id}`
          return (
            <div key={answer.id}>
              <button
                type="button"
                onClick={() => setOpenId(open ? null : answer.id)}
                aria-expanded={open}
                aria-controls={panelId}
                className={[
                  'flex min-h-11 w-full flex-col items-start justify-center border px-3.5 py-2.5 text-left transition-colors duration-150 lg:min-h-9',
                  open
                    ? 'border-brand bg-brand-tint'
                    : 'border-line bg-raised hover:border-line-strong',
                ].join(' ')}
              >
                <span className="text-sm font-medium text-fg">
                  {answer.name}
                </span>
                <span className="t-data mt-0.5 text-[12px] leading-5 text-subtle">
                  {answer.example}
                </span>
              </button>
              {open && (
                <p
                  id={panelId}
                  className="mt-2 border border-line bg-sunken p-3.5 text-sm leading-6 text-muted"
                >
                  {answer.body}
                </p>
              )}
            </div>
          )
        })}
      </div>

      <div className="mt-5 space-y-3 border-t border-line pt-4">
        <p className="t-label text-subtle">
          Three decisions, before the first row exists
        </p>
        {CONTRACT_DECISIONS.map((d) => (
          <div key={d.id}>
            <p className="text-sm font-medium text-fg">{d.name}</p>
            <p className="mt-0.5 text-sm leading-6 text-muted">{d.body}</p>
          </div>
        ))}
      </div>
    </Card>
  )
}
