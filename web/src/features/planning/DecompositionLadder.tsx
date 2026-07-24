import { Check } from 'lucide-react'

/**
 * Figure 6. Static — takes no props and holds no state; it draws one worked
 * example of the claim `SizeScorer` makes about Large.
 *
 * A task first sized Large splits into smaller tasks, and the branch that is
 * still Large keeps splitting until nothing Large remains. The size chip
 * carries a letter, not colour alone, so the point survives greyscale; only
 * the still-Large chip gets `warn`, matching `SizeScorer` — Small and Medium
 * are unmarked because reaching them is simply the expected outcome, not a
 * success worth flagging.
 *
 * Rows are `div`s with list roles rather than real `<li>`/`<p>`. `main :is(p,
 * li)` caps prose at 68ch globally, which would pinch a ladder that needs the
 * full card width to show three tiers side by side — the same call
 * `RiskOrder` and `CutFunnel` make in this same folder.
 */

type Size = 'S' | 'M' | 'L'

type Node = {
  label: string
  size: Size
}

const TIER_0: Node[] = [{ label: 'Accept payments', size: 'L' }]

const TIER_1: Node[] = [
  { label: 'Integrate a payment provider', size: 'M' },
  { label: 'Store and reconcile transactions', size: 'L' },
]

const TIER_2: Node[] = [
  { label: 'Record a transaction against an invoice', size: 'S' },
  { label: 'Reconcile provider payouts against invoices', size: 'M' },
]

function SizeChip({ size }: { size: Size }) {
  const isLarge = size === 'L'
  return (
    <span
      className={[
        't-data flex size-6 shrink-0 items-center justify-center border text-[11px]',
        isLarge
          ? 'border-warn bg-warn-tint text-warn'
          : 'border-line text-subtle',
      ].join(' ')}
    >
      {size}
    </span>
  )
}

function Tier({ nodes }: { nodes: Node[] }) {
  return (
    <div
      role="list"
      className={[
        'grid gap-2.5 grid-cols-1',
        nodes.length > 1 ? 'sm:grid-cols-2' : '',
      ].join(' ')}
    >
      {nodes.map((node) => (
        <div
          role="listitem"
          key={node.label}
          className={[
            'flex min-w-0 items-start gap-2.5 border p-3',
            node.size === 'L'
              ? 'border-warn bg-warn-tint'
              : 'border-line bg-sunken',
          ].join(' ')}
        >
          <SizeChip size={node.size} />
          <span className="min-w-0 break-words text-sm leading-5 text-fg">
            {node.label}
          </span>
        </div>
      ))}
    </div>
  )
}

function SplitArrow({ note }: { note: string }) {
  return (
    <div className="my-3 flex items-center gap-3 pl-3" aria-hidden>
      <svg width="14" height="22" viewBox="0 0 14 22" className="shrink-0">
        <path
          d="M7 0 V16"
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-line-strong"
        />
        <path
          d="M7 21 L2.5 14.5 H11.5 Z"
          fill="currentColor"
          className="text-line-strong"
        />
      </svg>
      <span className="t-label text-subtle">{note}</span>
    </div>
  )
}

export function DecompositionLadder() {
  return (
    <div className="border border-line bg-raised p-4 sm:p-5">
      <p className="t-label mb-3 text-subtle">Still Large — split again</p>
      <Tier nodes={TIER_0} />

      <SplitArrow note="splits into" />
      <Tier nodes={TIER_1} />

      <SplitArrow note="the Large branch splits again" />
      <Tier nodes={TIER_2} />

      <div className="mt-4 flex items-center gap-2.5 border-t border-line pt-3.5">
        <span className="flex size-6 shrink-0 items-center justify-center border border-line text-go">
          <Check className="size-3.5" aria-hidden />
        </span>
        <p className="text-sm text-muted">
          Nothing Large remains. Every branch bottoms out in Small or Medium —
          an estimate worth trusting instead of a guess wearing a number.
        </p>
      </div>
    </div>
  )
}
