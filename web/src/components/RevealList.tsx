'use client'

import { useState, type ReactNode } from 'react'
import { ChevronDown } from 'lucide-react'
import { Card } from '@/components/ui'

/**
 * The expand-to-reveal list, extracted from five byte-identical copies in
 * `features/architecture/` (`DeferredList`, `DeploymentStyles`,
 * `ResiliencePatterns`, `EvolutionNotes`, `ScalingMoves`). Two of those files
 * named the duplication in their own headers and deferred the fix as "a change
 * of its own"; this is that change, made before stage 04 produced copies six
 * through eight.
 *
 * Rows open independently, tracked as a `Set` of ids, rather than as an
 * accordion with one panel open at a time. There is no ordering here for a
 * single-open panel to defend, and a reader comparing two items should be able
 * to hold both open. That was `DeferredList`'s reasoning and it carries over.
 */

export type RevealRow = {
  id: string
  /**
   * A plain string is wrapped in this component's own `font-medium` span, as
   * before. A caller that needs a pre-styled title — a different size, a mix
   * of weights — can pass a `ReactNode` instead; it renders as-is, with no
   * wrapper forced around it, the same way `badge` and `body` already work.
   * `AIArchitecturePlays`' 14px claim text is the motivating case (Task 13).
   */
  title: ReactNode
  /** Rendered beside the title, not below it. See `DeferredList`'s migration note. */
  badge?: ReactNode
  summary?: string
  body: ReactNode
}

export function RevealList({
  rows,
  idPrefix,
  header,
  footer,
}: {
  rows: RevealRow[]
  idPrefix: string
  header?: ReactNode
  footer?: ReactNode
}) {
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
      {header}

      <ul className="divide-y divide-line">
        {rows.map((row) => {
          const open = openIds.has(row.id)
          const panelId = `${idPrefix}-${row.id}`
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
                    <span className="flex flex-wrap items-center gap-2">
                      {typeof row.title === 'string' ? (
                        <span className="font-medium">{row.title}</span>
                      ) : (
                        row.title
                      )}
                      {row.badge}
                    </span>
                    {row.summary && (
                      <span className="mt-0.5 block text-sm text-subtle">
                        {row.summary}
                      </span>
                    )}
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
                  {row.body}
                </div>
              )}
            </li>
          )
        })}
      </ul>

      {footer}
    </Card>
  )
}
