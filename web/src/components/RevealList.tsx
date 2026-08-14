'use client'

import { Fragment, useState, type ReactNode } from 'react'
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
    // `header`, the list and `footer` are three sibling expression children of
    // `Card`, the same shape — and the same hazard — as `title` and `badge` in
    // the row header below, one level up. Task 16b keyed the inner one and left
    // this one, so `#tenancy`, `#trace` and `#indexes` all still logged "Each
    // child in a list should have a unique key prop" on every load in `pnpm
    // dev`, attributed to `Card`. `#ai` passes neither slot, which is why the
    // one page checked live read clean. See the long note on the row header
    // span for why the keys settle it regardless of which JSX runtime compiled
    // the file; `Fragment` adds no DOM node, so a caller passing no slot at all
    // renders byte-identically to before.
    <Card className="p-0">
      <Fragment key="header">{header}</Fragment>

      <ul key="rows" className="divide-y divide-line">
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
                    {/*
                      `title` and `badge` are two sibling expression children of
                      this span. React's automatic JSX runtime marks statically-
                      written sibling children as pre-validated at creation time
                      (`isStaticChildren`), which normally means no key is
                      needed here — but that marking is a compiler-time
                      optimisation, not a language guarantee, and Turbopack
                      (this project's dev server) does not appear to apply it
                      the same way Vite/oxc (this project's Vitest transform)
                      does for this exact shape. With a plain `string` title the
                      wrapper span below is built inside `RevealList` itself, so
                      it has no external `_owner` and nothing ever surfaced.
                      `AIArchitecturePlays` (Task 16) was the first caller to
                      pass a `ReactNode` title built inside its own render —
                      giving that element an owner — and Turbopack logged
                      "Each child in a list should have a unique key prop" on
                      every load (confirmed live; Task 16b). Explicit `key`s
                      settle it independent of that flag: React's reconciler
                      only warns when both `_store.validated` is unset *and*
                      `key == null`, so a `key` closes the gap regardless of
                      which JSX runtime compiled this file. `Fragment` adds no
                      DOM node, so the string-title branch renders
                      byte-identically to before.
                    */}
                    <span className="flex flex-wrap items-center gap-2">
                      {typeof row.title === 'string' ? (
                        <span key="title" className="font-medium">
                          {row.title}
                        </span>
                      ) : (
                        <Fragment key="title">{row.title}</Fragment>
                      )}
                      <Fragment key="badge">{row.badge}</Fragment>
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

      <Fragment key="footer">{footer}</Fragment>
    </Card>
  )
}
