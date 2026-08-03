'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { Card } from '@/components/ui'
import { NORMAL_FORMS } from './normal-forms'

/**
 * Source: docs/03-architecture.md, "Design the database" — its Normalisation
 * subsection.
 *
 * Behind an expand-to-reveal because `schema` is the second-heaviest panel in
 * the stage and this is reference rather than judgment: a reader who already
 * knows the forms should not scroll past three definitions to reach the DDL,
 * and one who does not should be able to open them where they meet the names.
 *
 * Sixth accordion in this feature with the same markup, which is recorded debt
 * (`RevealList`, docs/tracker.md). Copied rather than invented, per the
 * decision to leave that refactor to its own change.
 */

export function Normalisation() {
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
        {NORMAL_FORMS.map((form) => {
          const open = openIds.has(form.id)
          const panelId = `normal-form-${form.id}`
          return (
            <li key={form.id}>
              <h3>
                <button
                  type="button"
                  onClick={() => toggle(form.id)}
                  aria-expanded={open}
                  aria-controls={panelId}
                  className="flex min-h-11 w-full items-center gap-3.5 px-5 py-3.5 text-left transition-colors duration-150 hover:bg-sunken lg:min-h-9"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block font-medium">{form.name}</span>
                    <span className="mt-0.5 block text-sm text-subtle">
                      {form.rule}
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
                  <p className="t-label text-warn">The violation</p>
                  <p className="mt-1 text-sm leading-6 text-muted">
                    {form.violation}
                  </p>
                  {form.exception && (
                    <div className="mt-3">
                      <p className="t-label text-blueprint">
                        Where this stage breaks it on purpose
                      </p>
                      <p className="mt-1 text-sm leading-6 text-muted">
                        {form.exception}
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
        Third is the one worth aiming at. Past it the forms get stricter and the
        returns get thinner, and you would be reaching for them to satisfy a
        definition rather than to fix something.
      </p>
    </Card>
  )
}
