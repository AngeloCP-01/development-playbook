'use client'

import { useState } from 'react'
import { Card } from '@/components/ui'
import { SKETCH_NODES, type SketchNode } from './sketch'

/**
 * Source: docs/03-architecture.md, "Sketch the system".
 *
 * A grouped, selectable node map rather than an arrow diagram, for the reason
 * `BoundaryMap` records in this same stage: at 320px an arrow's direction is
 * the first thing to become illegible, and here the direction is content —
 * you call the payment provider, it calls you back. So every connection is
 * written out as text on the node, which survives any width, and the grouping
 * carries what a diagram's layout would have.
 *
 * The grouping is the claim the section makes: your application is one box,
 * your system is not. "Yours" holds two nodes and "not yours" holds four, and
 * a reader who notices that ratio has taken the point.
 *
 * Selecting an external node answers two questions, not one. What it does is
 * ordinary documentation; what happens when it is down is the decision the
 * diagram exists to force, and one of the answers is real work you would
 * otherwise meet in production.
 *
 * External nodes are marked with a dashed border as well as a group heading,
 * so "not yours" is never carried by position alone. No semantic colour: none
 * of these boxes is wrong.
 */

const GROUPS: { id: string; heading: string; kinds: SketchNode['kind'][] }[] = [
  { id: 'actor', heading: 'Who uses it', kinds: ['actor'] },
  { id: 'yours', heading: 'Yours to write', kinds: ['yours', 'store'] },
  {
    id: 'theirs',
    heading: 'Not yours, and fails on its own schedule',
    kinds: ['external'],
  },
  { id: 'clock', heading: 'Runs without anyone asking', kinds: ['scheduled'] },
]

export function SystemSketch() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const selected = SKETCH_NODES.find((n) => n.id === selectedId) ?? null

  return (
    <Card>
      <div className="space-y-4">
        {GROUPS.map((group) => {
          const nodes = SKETCH_NODES.filter((n) => group.kinds.includes(n.kind))
          if (nodes.length === 0) return null
          return (
            <div key={group.id}>
              <p className="t-label mb-2 text-subtle">{group.heading}</p>
              <div className="grid gap-2 sm:grid-cols-3">
                {nodes.map((node) => {
                  const on = node.id === selectedId
                  const external = node.kind === 'external'
                  return (
                    <button
                      key={node.id}
                      type="button"
                      aria-pressed={on}
                      onClick={() => setSelectedId(node.id)}
                      className={[
                        'flex min-h-11 w-full flex-col items-start justify-center border px-3.5 py-2.5 text-left transition-colors duration-150 lg:min-h-9',
                        external ? 'border-dashed' : '',
                        on
                          ? 'border-brand bg-brand-tint'
                          : 'border-line bg-raised hover:border-line-strong',
                      ].join(' ')}
                    >
                      <span className="text-sm font-medium text-fg">
                        {node.name}
                      </span>
                      <span className="t-data mt-0.5 text-[12px] leading-5 text-subtle">
                        {node.edge}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      <p className="mt-4 text-sm leading-6 text-muted">
        Four of these six boxes are not yours. Select one to see what it does
        and, for the external ones, what happens when it is down.
      </p>

      <div
        aria-live="polite"
        className="mt-3 min-h-32 border border-line bg-raised p-4"
      >
        {selected ? (
          <>
            <span className="inline-block bg-brand px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-brand-fg">
              {selected.name}
            </span>
            <p className="mt-2.5 text-sm leading-6 text-muted">
              {selected.does}
            </p>
            {selected.whenDown && (
              <div className="mt-3 border-t border-line pt-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-warn">
                  When it is down
                </p>
                <p className="mt-1 text-sm leading-6 text-muted">
                  {selected.whenDown}
                </p>
              </div>
            )}
          </>
        ) : (
          <p className="text-sm text-subtle">
            Select a box to see what it does.
          </p>
        )}
      </div>

      <p className="mt-4 border-t border-line pt-4 text-sm leading-6 text-muted">
        Six boxes that are not yours, six answers, one of which is a genuine
        piece of work you would otherwise have discovered in production — and
        two of which get skipped, one because it is yours and one because it is
        somebody else&rsquo;s problem right up until it is not. That is the
        return on a diagram.
      </p>
    </Card>
  )
}
