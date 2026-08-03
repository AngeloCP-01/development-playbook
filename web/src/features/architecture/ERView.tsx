'use client'

import { useState } from 'react'
import { Card } from '@/components/ui'
import { ER_EDGES, ER_ENTITIES } from './schema-blocks'

/**
 * Source: docs/03-architecture.md, "Design the database".
 *
 * The nouns with their cardinality made explicit. Rendered as an entity list
 * plus an edge list rather than a drawn diagram, consistent with `BoundaryMap`
 * and `SystemSketch` in this stage: the reading of "one A has many B" is the
 * content, and at 320px a crow's foot is the first thing to become
 * indistinguishable from a line ending.
 *
 * The fourth edge is the reason this exists at all, so it is the only one that
 * expands. Three obvious edges and one argued edge is the shape of the lesson:
 * an ER view earns its place by making one decision visible, not by drawing
 * four relationships you already knew about.
 */

export function ERView() {
  const [openId, setOpenId] = useState<string | null>(null)

  return (
    <Card>
      <p className="t-label mb-2 text-subtle">Entities</p>
      <div className="flex flex-wrap gap-2">
        {ER_ENTITIES.map((entity) => (
          <span
            key={entity}
            className="t-data border border-line bg-sunken px-2.5 py-1 text-[13px] text-fg"
          >
            {entity}
          </span>
        ))}
      </div>

      <p className="t-label mb-2 mt-5 text-subtle">
        Relationships — read <span className="t-data">A ──1──&lt; B</span> as
        &ldquo;one A has many B&rdquo;
      </p>
      <ul className="space-y-2">
        {ER_EDGES.map((edge) => {
          const open = openId === edge.id
          const panelId = `er-${edge.id}`
          if (!edge.note) {
            return (
              <li
                key={edge.id}
                className="border border-line bg-sunken px-3.5 py-2.5"
              >
                <span className="t-data text-[13px] text-fg sm:text-sm">
                  {edge.from} ──1──&lt; {edge.to}
                </span>
              </li>
            )
          }
          return (
            <li key={edge.id}>
              <button
                type="button"
                onClick={() => setOpenId(open ? null : edge.id)}
                aria-expanded={open}
                aria-controls={panelId}
                className={[
                  'flex min-h-11 w-full flex-wrap items-center justify-between gap-2 border px-3.5 py-2.5 text-left transition-colors duration-150 lg:min-h-9',
                  open
                    ? 'border-brand bg-brand-tint'
                    : 'border-line bg-sunken hover:border-line-strong',
                ].join(' ')}
              >
                <span className="t-data text-[13px] text-fg sm:text-sm">
                  {edge.from} ──1──&lt; {edge.to}
                </span>
                <span className="shrink-0 border border-line px-1.5 py-0.5 text-[11px] font-medium text-subtle">
                  worth arguing about
                </span>
              </button>
              {open && (
                <p
                  id={panelId}
                  className="mt-2 border border-line bg-raised p-3.5 text-sm leading-6 text-muted"
                >
                  {edge.note}
                </p>
              )}
            </li>
          )
        })}
      </ul>
    </Card>
  )
}
