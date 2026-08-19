'use client'

import { useState } from 'react'
import { MousePointerClick } from 'lucide-react'
import { Card } from '@/components/ui'

/**
 * Source: docs/05-development.md, "Server Components by default" — the
 * paragraph correcting the belief that `'use client'` means "not rendered on
 * the server". Checked against
 * `node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md`
 * and `.../01-directives/use-client.md`, not from memory or from this plan:
 *
 * - Client Components are still used, with the RSC payload, to prerender HTML
 *   on first load ("Client Components and the RSC Payload are used to
 *   prerender HTML"); that HTML shows before hydration runs.
 * - `'use client'` marks a **boundary**: once a file carries it, everything it
 *   directly imports and renders is pulled into the client module graph and
 *   ships in the bundle.
 * - On later navigations Client Components "render entirely on the client,
 *   without the server-rendered HTML" — a real cost, and a different one from
 *   "the page was blank".
 * - A Server Component passed through as `children` (or another prop) is the
 *   documented exception: it "is not imported into the Client Component's
 *   module graph. It is rendered on the server and passed to the Client
 *   Component as rendered output" — never pulled in, whatever the boundary
 *   above it does.
 *
 * The tree below is the doc's own worked example, five nodes:
 * `InvoicesPage` → `InvoiceTable` → `InvoiceRow`, and
 * `InvoicesPage` → `InvoiceAmountForm` → `AmountInput`. One `useState<NodeId>`
 * holds which node currently carries the directive; moving it recomputes, for
 * every node, whether it ships (directive node plus its descendants) — never
 * whether it is prerendered, which stays true everywhere, always. That
 * invariant is the test that matters most in the sibling test file: a reader
 * who believes the wrong thing goes looking for missing HTML instead of
 * measuring bundle weight and hydration cost, which are the real prices.
 *
 * Structural reference: `TreeInspector` (stage 04) for the flatten-and-render
 * shape — a small tree, indentation by depth, one control per node. This
 * component departs from it on purpose: `TreeInspector` selects a node to
 * *read about* it; this one's click moves *where the directive sits*, so the
 * whole tree's `data-ships` set changes together, which is the demonstration.
 */

type NodeId = 'page' | 'table' | 'row' | 'form' | 'input'

type BoundaryNode = {
  id: NodeId
  component: string
  children?: BoundaryNode[]
}

const TREE: BoundaryNode = {
  id: 'page',
  component: 'InvoicesPage',
  children: [
    {
      id: 'table',
      component: 'InvoiceTable',
      children: [{ id: 'row', component: 'InvoiceRow' }],
    },
    {
      id: 'form',
      component: 'InvoiceAmountForm',
      children: [{ id: 'input', component: 'AmountInput' }],
    },
  ],
}

type FlatNode = { node: BoundaryNode; depth: number }

function flatten(node: BoundaryNode, depth = 0): FlatNode[] {
  return [
    { node, depth },
    ...(node.children ?? []).flatMap((child) => flatten(child, depth + 1)),
  ]
}

const FLAT = flatten(TREE)

/** `id` plus every id beneath it in `TREE` — the set that ships once `id` carries the directive. */
function subtreeIds(node: BoundaryNode): NodeId[] {
  return [node.id, ...(node.children ?? []).flatMap(subtreeIds)]
}

function findNode(id: NodeId, root: BoundaryNode = TREE): BoundaryNode {
  if (root.id === id) return root
  for (const child of root.children ?? []) {
    if (subtreeIds(child).includes(id)) return findNode(id, child)
  }
  // Unreachable for any id drawn from `FLAT`, which is every id `TREE` has.
  throw new Error(`no node ${id}`)
}

/** The component tree renders it, so the directive itself is never a leaf that needs the click twice. */
const DEFAULT_DIRECTIVE: NodeId = 'form'

export function ClientBoundary() {
  const [directiveId, setDirectiveId] = useState<NodeId>(DEFAULT_DIRECTIVE)

  const shipsIds = subtreeIds(findNode(directiveId))
  const directiveComponent = findNode(directiveId).component
  const shippedComponents = FLAT.filter(({ node }) =>
    shipsIds.includes(node.id),
  )
    .filter(({ node }) => node.id !== directiveId)
    .map(({ node }) => node.component)
  const heldBackComponents = FLAT.filter(
    ({ node }) => !shipsIds.includes(node.id),
  ).map(({ node }) => node.component)

  return (
    <Card>
      <p className="mb-4 text-sm text-muted">
        Move <code className="t-data text-[13px]">&apos;use client&apos;</code>{' '}
        between nodes and watch what changes — and, in the readout below, what
        does not.
      </p>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="border border-line bg-sunken p-2">
          {FLAT.map(({ node, depth }) => {
            const isDirective = node.id === directiveId
            const ships = shipsIds.includes(node.id)
            return (
              <div
                key={node.id}
                data-node={node.id}
                data-directive={String(isDirective)}
                data-ships={String(ships)}
                data-prerendered="true"
                style={{ paddingInlineStart: `${0.5 + depth * 0.85}rem` }}
                className="flex flex-wrap items-center gap-2 border border-transparent py-1"
              >
                <button
                  type="button"
                  aria-pressed={isDirective}
                  onClick={() => setDirectiveId(node.id)}
                  className={[
                    'flex min-h-11 items-center gap-2 border px-2 py-1.5 text-left transition-colors duration-150 lg:min-h-9',
                    isDirective
                      ? 'border-brand bg-brand-tint text-fg'
                      : 'border-line bg-raised text-muted hover:border-line-strong',
                  ].join(' ')}
                >
                  <span className="t-data text-[13px]">{node.component}</span>
                  {isDirective && (
                    <span className="t-label shrink-0 text-brand">
                      &apos;use client&apos;
                    </span>
                  )}
                </button>
                <span
                  className={[
                    't-label shrink-0 border px-1.5 py-0.5',
                    ships ? 'border-warn text-warn' : 'border-line text-subtle',
                  ].join(' ')}
                >
                  {ships ? 'Ships' : 'Server-only'}
                </span>
              </div>
            )
          })}
        </div>

        <div
          data-readout
          aria-live="polite"
          className="min-h-40 border border-line bg-raised p-4"
        >
          <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted">
            <MousePointerClick className="size-3.5 shrink-0" aria-hidden />
            What this position costs
          </p>
          <p className="text-sm leading-6 text-fg">
            <code className="t-data text-[13px]">&apos;use client&apos;</code>{' '}
            sits on <strong>{directiveComponent}</strong>.{' '}
            {shippedComponents.length > 0
              ? `${shippedComponents.join(', ')} ${
                  shippedComponents.length === 1 ? 'joins' : 'join'
                } it in the client bundle and hydrate${
                  shippedComponents.length === 1 ? 's' : ''
                } on first load.`
              : 'Nothing below it ships along.'}{' '}
            {heldBackComponents.length > 0
              ? `${heldBackComponents.join(', ')} stay${
                  heldBackComponents.length === 1 ? 's' : ''
                } server-only — no client JavaScript for ${
                  heldBackComponents.length === 1 ? 'it' : 'them'
                }.`
              : 'Nothing is held back: the whole tree ships.'}
          </p>
          <p className="mt-2 text-sm leading-6 text-muted">
            Every node above is <strong>prerendered</strong> to HTML on first
            load regardless — that never changes with the boundary. What moves
            is bundle weight and hydration, not whether the HTML is there.
          </p>
        </div>
      </div>

      <div data-children-note className="mt-4 border border-line bg-sunken p-4">
        <p className="t-label mb-2 text-subtle">The exception</p>
        <p className="text-sm leading-6 text-muted">
          If <code className="t-data text-[13px]">AmountInput</code> were passed
          to <code className="t-data text-[13px]">InvoiceAmountForm</code> as{' '}
          <code className="t-data text-[13px]">children</code> — written from{' '}
          <code className="t-data text-[13px]">InvoicesPage</code>, the way{' '}
          <code className="t-data text-[13px]">
            &lt;Modal&gt;&lt;Cart /&gt;&lt;/Modal&gt;
          </code>{' '}
          is in Next&apos;s own docs — it would never enter{' '}
          <code className="t-data text-[13px]">InvoiceAmountForm</code>&apos;s
          module graph, however the boundary above moves. Next renders it on the
          server and hands the Client Component already-built output. A node
          reached this way carries its own, permanent mark:
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-2 border border-transparent py-1">
          <span className="flex min-h-11 items-center gap-2 border border-line bg-raised px-2 py-1.5 text-left lg:min-h-9">
            <span className="t-data text-[13px] text-muted">
              AmountInput (as children)
            </span>
          </span>
          <span
            data-ships="false"
            data-prerendered="true"
            className="t-label shrink-0 border border-line px-1.5 py-0.5 text-subtle"
          >
            Server-only
          </span>
        </div>
      </div>
    </Card>
  )
}
