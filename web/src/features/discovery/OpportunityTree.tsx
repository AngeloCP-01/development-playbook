'use client'

import { useState } from 'react'
import { Card } from '@/components/ui'

/**
 * Teresa Torres' Opportunity Solution Tree, rendered as nested flex rows with
 * CSS connectors rather than SVG — it reflows on narrow screens, where a fixed
 * SVG viewBox would either shrink to unreadable or force horizontal scroll.
 */

type Node = {
  id: string
  label: string
  detail: string
  children?: Node[]
}

const TREE: Node = {
  id: 'outcome',
  label: 'Freelancers get paid on time',
  detail:
    'The outcome. One measurable change in customer behaviour — not a feature, not a revenue target. Everything below exists to move this.',
  children: [
    {
      id: 'o1',
      label: 'I lose track of who owes me',
      detail:
        'An opportunity: a customer need, pain, or desire stated in their words. Comes from interviews, never from a brainstorm.',
      children: [
        {
          id: 's1',
          label: 'Overdue list on the dashboard',
          detail:
            'A solution. Cheap to build, directly addresses the opportunity. Note there are several — you compare solutions within one opportunity, not across the whole tree.',
        },
        {
          id: 's2',
          label: 'Weekly digest email',
          detail:
            'A competing solution for the same opportunity. Listing more than one is the point — the first idea is rarely the best one.',
        },
      ],
    },
    {
      id: 'o2',
      label: 'Chasing feels rude, so I delay it',
      detail:
        'An emotional opportunity, and often the more valuable kind. No amount of tracking fixes reluctance — this branch needs a different sort of solution entirely.',
      children: [
        {
          id: 's3',
          label: 'Pre-written polite reminder',
          detail:
            'Removes the emotional cost rather than the tracking cost. A feature you would never reach by thinking about invoices as a data problem.',
        },
      ],
    },
    {
      id: 'o3',
      label: 'I do not know if chasing even works',
      detail:
        'An opportunity that may not deserve a solution yet. Mapping it is still worth it — you are documenting the problem space, not committing to build every branch.',
    },
  ],
}

// Three visually separate levels: the anchor in ink, the problem space in
// blueprint blue, candidate actions in annotation orange. Amber was dropped —
// it sat too close to the orange accent to read as a distinct level.
const LEVEL_STYLE = [
  { ring: 'border-fg', chip: 'bg-fg text-bg', name: 'Outcome' },
  { ring: 'border-blueprint', chip: 'bg-blueprint text-bg', name: 'Opportunity' },
  { ring: 'border-brand', chip: 'bg-brand text-brand-fg', name: 'Solution' },
] as const

function TreeNode({
  node,
  level,
  selected,
  onSelect,
}: {
  node: Node
  level: number
  selected: string
  onSelect: (n: Node, level: number) => void
}) {
  const style = LEVEL_STYLE[Math.min(level, 2)]
  const active = selected === node.id

  return (
    <li className="relative">
      <button
        type="button"
        onClick={() => onSelect(node, level)}
        aria-pressed={active}
        className={[
          'flex min-h-11 w-full items-center gap-2.5 border px-3 py-2 text-left text-sm transition-colors duration-150 lg:min-h-0',
          active
            ? `${style.ring} bg-sunken font-medium`
            : 'border-line bg-raised hover:border-line-strong',
        ].join(' ')}
      >
        {/* Level is already carried by indentation; the dot makes the legend
            meaningful without relying on colour as the only signal. */}
        <span
          className={`size-2.5 shrink-0 rounded-full ${style.chip}`}
          aria-hidden
        />
        <span className="min-w-0">{node.label}</span>
        <span className="sr-only">({style.name})</span>
      </button>

      {node.children && (
        <ul className="mt-2 space-y-2 border-l-2 border-line pl-3 sm:pl-4">
          {node.children.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              level={level + 1}
              selected={selected}
              onSelect={onSelect}
            />
          ))}
        </ul>
      )}
    </li>
  )
}

export function OpportunityTree() {
  const [sel, setSel] = useState<{ node: Node; level: number }>({
    node: TREE,
    level: 0,
  })
  const style = LEVEL_STYLE[Math.min(sel.level, 2)]

  return (
    <Card>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {LEVEL_STYLE.map((s) => (
          <span
            key={s.name}
            className="flex items-center gap-1.5 text-xs text-subtle"
          >
            <span className={`size-2.5 rounded-full ${s.chip}`} aria-hidden />
            {s.name}
          </span>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.2fr_1fr]">
        <ul className="space-y-2">
          <TreeNode
            node={TREE}
            level={0}
            selected={sel.node.id}
            onSelect={(node, level) => setSel({ node, level })}
          />
        </ul>

        <div
          aria-live="polite"
          className="h-fit border border-line bg-sunken p-4 lg:sticky lg:top-6"
        >
          <span
            className={`inline-block px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${style.chip}`}
          >
            {style.name}
          </span>
          <p className="mt-2.5 text-sm font-medium text-fg">{sel.node.label}</p>
          <p className="mt-1.5 text-sm leading-6 text-muted">
            {sel.node.detail}
          </p>
        </div>
      </div>

      <p className="mt-4 border-t border-line pt-3.5 text-sm leading-6 text-subtle">
        The discipline the tree enforces: you cannot add a solution without
        attaching it to an opportunity, and you cannot add an opportunity you
        have not heard from a real user. A feature with no evidence behind it
        has nowhere to hang.
      </p>
    </Card>
  )
}
