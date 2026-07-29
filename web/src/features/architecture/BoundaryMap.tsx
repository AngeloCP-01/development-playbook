'use client'

import { useState } from 'react'
import { Card } from '@/components/ui'
import { BOUNDARY_EDGES, BOUNDARY_MODULES, type BoundaryEdge } from './scoring'

/**
 * Source: docs/03-architecture.md, "Boundaries inside the monolith".
 *
 * Structural reference: `OpportunityTree` (discovery) for the
 * click-node-plus-detail-panel shape; `SchemaInspector` (this stage) for
 * using a click-select with no wrong answer rather than a scored radiogroup.
 *
 * Ships as a labelled list of the three calls, not an arrow diagram. Three
 * edges between three boxes is thin enough content that a diagram earns its
 * complexity, and at 320px an arrow's direction is the first thing to
 * become illegible — exactly the property this component cannot let a
 * reader guess at, since the one rule here is which of three calls is not
 * allowed. A list reflows for free and keeps every edge's legality as text
 * that survives any width.
 *
 * Legality is carried three ways, deliberately redundant: the row's border
 * colour, a visible "Allowed" / "Not allowed" badge, and the button's
 * accessible name. Only the illegal edge gets `danger` — the two legal
 * edges use a neutral border, never `go`, because this is a rule being
 * stated, not two more rows in a scored exercise.
 */

const MODULE_INFO: Record<string, { path: string; note: string }> = {
  billing: {
    path: 'src/features/billing/',
    note: 'owns invoices, line items, payment state',
  },
  clients: {
    path: 'src/features/clients/',
    note: 'owns client records',
  },
  auth: {
    path: 'src/features/auth/',
    note: 'owns sessions, users',
  },
}

// The verb phrase is written out per edge, so the accessible name says
// exactly what a screen-reader user needs — "calls" for a legal function
// call, "queries ... table" for the illegal one that reaches into another
// module's storage directly — instead of a generic "from calls to" that
// would flatten the distinction the exercise is about. The verdict is
// deliberately not baked in here: it is appended from `edge.legal` at the
// call site, so the accessible name cannot go stale if `legal` ever flips
// without this map being touched.
const EDGE_VERB: Record<string, string> = {
  'clients-calls-billing': 'clients calls billing',
  'billing-calls-auth': 'billing calls auth',
  'clients-queries-invoices': "clients queries billing's table",
  'clients-writes-invoices': "clients writes billing's table",
}

function EdgeRow({
  edge,
  selected,
  onSelect,
}: {
  edge: BoundaryEdge
  selected: boolean
  onSelect: () => void
}) {
  const toneClasses = edge.legal
    ? 'border-line bg-raised text-fg hover:border-line-strong'
    : 'border-danger bg-danger-tint text-danger'

  return (
    <button
      type="button"
      aria-pressed={selected}
      aria-label={`${EDGE_VERB[edge.id] ?? `${edge.from} to ${edge.to}`} — ${edge.legal ? 'allowed' : 'not allowed'}`}
      onClick={onSelect}
      className={[
        'flex min-h-11 w-full flex-wrap items-center justify-between gap-2.5 border px-3.5 py-2.5 text-left transition-colors duration-150 lg:min-h-9',
        toneClasses,
        selected ? 'ring-2 ring-inset ring-brand' : '',
      ].join(' ')}
    >
      <span className="t-data text-[13px] sm:text-sm">
        {edge.from} → {edge.to}
      </span>
      <span
        className={[
          'shrink-0 border px-1.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide',
          edge.legal ? 'border-line text-subtle' : 'border-danger text-danger',
        ].join(' ')}
      >
        {edge.legal ? 'Allowed' : 'Not allowed'}
      </span>
    </button>
  )
}

export function BoundaryMap() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const selectedEdge = BOUNDARY_EDGES.find((e) => e.id === selectedId) ?? null

  return (
    <Card>
      <div className="grid gap-2.5 sm:grid-cols-3">
        {BOUNDARY_MODULES.map((m) => {
          const info = MODULE_INFO[m]
          return (
            <div key={m} className="border border-line bg-sunken p-3.5">
              <p className="t-data text-[13px] text-fg">{info?.path ?? m}</p>
              <p className="mt-1 text-sm leading-6 text-muted">{info?.note}</p>
            </div>
          )
        })}
      </div>

      <p className="mt-4 text-sm leading-6 text-muted">
        Features talk through exported functions, never by reaching into each
        other&rsquo;s internals. Select a call to see whether it holds.
      </p>

      <div className="mt-3 space-y-2">
        {BOUNDARY_EDGES.map((edge) => (
          <EdgeRow
            key={edge.id}
            edge={edge}
            selected={selectedId === edge.id}
            onSelect={() => setSelectedId(edge.id)}
          />
        ))}
      </div>

      <div
        aria-live="polite"
        className="mt-4 min-h-24 border border-line bg-raised p-4"
      >
        {selectedEdge ? (
          <>
            <span
              className={[
                'inline-block border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide',
                selectedEdge.legal
                  ? 'border-line text-subtle'
                  : 'border-danger bg-danger-tint text-danger',
              ].join(' ')}
            >
              {selectedEdge.legal ? 'Allowed' : 'Not allowed'}
            </span>
            <div
              tabIndex={0}
              aria-label="Call, scrolls horizontally"
              className="mt-2.5 overflow-x-auto"
            >
              <p className="t-data whitespace-pre text-[13px] text-fg">
                {selectedEdge.call}
              </p>
            </div>
            <p className="mt-1.5 text-sm leading-6 text-muted">
              {selectedEdge.why}
            </p>
          </>
        ) : (
          <p className="text-sm text-subtle">
            Select a call to see whether it is allowed.
          </p>
        )}
      </div>
    </Card>
  )
}
