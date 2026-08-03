'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { Card } from '@/components/ui'
import { EVOLUTION_NOTES } from './evolve'

/**
 * Source: docs/03-architecture.md, "Evolve the schema safely".
 *
 * The four things the six-step sequence does not carry on its own, behind an
 * expand-to-reveal so the panel stays under D-52's four screens with the
 * teaching intact rather than trimmed.
 *
 * Same collapsed-row shape as `DeferredList` and `ResiliencePatterns` in this
 * feature. Three near-identical accordions is duplication worth naming: it is
 * left alone here because folding them into one component would edit two
 * reviewed files to land a third, and that is a change of its own.
 */

export function EvolutionNotes() {
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
        {EVOLUTION_NOTES.map((note) => {
          const open = openIds.has(note.id)
          const panelId = `evolution-${note.id}`
          return (
            <li key={note.id}>
              <h3>
                <button
                  type="button"
                  onClick={() => toggle(note.id)}
                  aria-expanded={open}
                  aria-controls={panelId}
                  className="flex min-h-11 w-full items-center gap-3.5 px-5 py-3.5 text-left transition-colors duration-150 hover:bg-sunken lg:min-h-9"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block font-medium">{note.title}</span>
                    <span className="mt-0.5 block text-sm text-subtle">
                      {note.summary}
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
                  <p className="text-sm leading-6 text-muted">{note.body}</p>
                </div>
              )}
            </li>
          )
        })}
      </ul>
    </Card>
  )
}
