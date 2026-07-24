import { AlertTriangle } from 'lucide-react'
import { SLICES } from './scoring'

/**
 * Figure 5. Rendered only inside `SliceSequencer`'s post-lock reveal, plotted
 * against the reader's own chosen order — not the doc's order.
 *
 * Static: takes the locked order as a prop and draws it, it decides nothing.
 * Bar width stands in for cost of discovery, which rises with position. The
 * risky slice gets a second signal beyond colour — the triangle icon and the
 * word "Risky" — so the point survives being read in greyscale.
 *
 * Rows are `div`s with list roles rather than real `<li>`/`<p>` — `main :is(p,
 * li)` caps prose at 68ch globally, which is right for reading text but would
 * pinch a bar chart that needs the full card width to make its proportions
 * legible. `CutFunnel` in this same folder makes the same call for the same
 * reason.
 */

export function RiskOrder({ order }: { order: string[] }) {
  const n = order.length
  if (n === 0) return null

  return (
    <div className="border border-line bg-sunken p-4 sm:p-5">
      <p className="t-label mb-4 text-subtle">
        Your order, replotted as cost of discovery
      </p>
      <div role="list" className="space-y-3">
        {order.map((id, i) => {
          const slice = SLICES.find((s) => s.id === id)
          if (!slice) return null
          const pct = n > 1 ? 20 + (i / (n - 1)) * 80 : 100
          return (
            <div role="listitem" key={id} className="flex items-center gap-3">
              <span className="t-data w-5 shrink-0 text-right text-subtle">
                {i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
                  <span className="min-w-0 break-words text-sm text-fg">
                    {slice.label}
                  </span>
                  {slice.risky && (
                    <span className="t-label flex shrink-0 items-center gap-1 text-warn">
                      <AlertTriangle className="size-3" aria-hidden />
                      Risky
                    </span>
                  )}
                </div>
                <div className="h-2.5 w-full border border-line bg-raised">
                  <div
                    className={`h-full ${slice.risky ? 'bg-warn' : 'bg-blueprint'}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            </div>
          )
        })}
      </div>
      <div className="t-label mt-4 flex items-center justify-between text-subtle">
        <span>Cheap to discover a problem</span>
        <span>Expensive to discover a problem</span>
      </div>
    </div>
  )
}
