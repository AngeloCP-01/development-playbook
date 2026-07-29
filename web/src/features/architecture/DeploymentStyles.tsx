'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { Card } from '@/components/ui'
import { CHOSEN_STYLE_ID, DEPLOYMENT_STYLES } from './styles'

/**
 * Source: docs/03-architecture.md, "The shapes a system can take".
 *
 * The doc's four-column table, as expand-to-reveal. A four-column comparison
 * does not survive 320px: it either scrolls sideways, which hides the column
 * that carries the decision, or it shrinks the type below readable. Every
 * cell here is a sentence rather than a value, which is the case
 * `PATTERNS.md` names expand-to-reveal for.
 *
 * The chosen row is marked, and marked with `brand` rather than `go`. It is
 * "you are here", not "this one is correct" — the whole point of the section
 * is that a different set of characteristics picks a different row.
 */

export function DeploymentStyles() {
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
        {DEPLOYMENT_STYLES.map((style) => {
          const open = openIds.has(style.id)
          const chosen = style.id === CHOSEN_STYLE_ID
          const panelId = `style-${style.id}`
          return (
            <li key={style.id}>
              <h3>
                <button
                  type="button"
                  onClick={() => toggle(style.id)}
                  aria-expanded={open}
                  aria-controls={panelId}
                  className="flex min-h-11 w-full items-center gap-3.5 px-5 py-3.5 text-left transition-colors duration-150 hover:bg-sunken lg:min-h-9"
                >
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="font-medium">{style.name}</span>
                      {chosen && (
                        <span className="border border-brand px-1.5 py-0.5 text-[11px] font-medium text-brand">
                          what this stage teaches
                        </span>
                      )}
                    </span>
                    <span className="mt-0.5 block text-sm text-subtle">
                      {style.summary}
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
                      What it buys
                    </p>
                    <p className="mt-1 text-sm leading-6 text-muted">
                      {style.buys}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-warn">
                      What it costs
                    </p>
                    <p className="mt-1 text-sm leading-6 text-muted">
                      {style.costs}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-subtle">
                      What would have to be true
                    </p>
                    <p className="mt-1 text-sm leading-6 text-muted">
                      {style.trueWhen}
                    </p>
                  </div>
                </div>
              )}
            </li>
          )
        })}
      </ul>

      <p className="border-t border-line bg-raised px-5 py-4 text-sm leading-6 text-muted">
        The microservices row is the one people adopt for the wrong reason. What
        it buys is organisational; what it costs is technical and arrives on day
        one. Alone you pay the full price for none of the return.
      </p>
    </Card>
  )
}
