import { RevealList } from '@/components/RevealList'
import { CONTRACT_ROWS } from './contracts'

/**
 * Source: docs/03-architecture.md, "Design the API contracts".
 *
 * Expand-to-reveal rather than the doc's three-column table, for the reason
 * this stage now applies four times: a cell that is a sentence is a paragraph
 * pretending to be a cell.
 *
 * The cost badge is deliberately not colour-coded good-to-bad. "Expensive" is
 * not a failure — a public API you meant to publish is a correct expensive
 * contract — and `danger` on that row would say otherwise. Neutral borders,
 * with the word doing the work.
 *
 * Built on `RevealList`. The cost badge — this file's own name for it, above
 * — moves from below the row title to beside it in the move: `RevealList`
 * has one badge slot, and it sits beside the title, matching `DeferredList`
 * and `DeploymentStyles`. There is no separate summary line here; the row
 * never had one, so `RevealList`'s summary slot goes unused rather than
 * carrying invented text.
 */

const COST_LABEL: Record<string, string> = {
  cheap: 'cheap to change',
  expensive: 'expensive to change',
  'not-yours': 'not yours to change',
}

export function ContractCost() {
  return (
    <RevealList
      idPrefix="contract"
      rows={CONTRACT_ROWS.map((row) => ({
        id: row.id,
        title: row.contract,
        badge: (
          <span className="border border-line px-1.5 py-0.5 text-[11px] font-medium text-subtle">
            {COST_LABEL[row.cost]}
          </span>
        ),
        summary: '',
        body: <p className="text-sm leading-6 text-muted">{row.why}</p>,
      }))}
      footer={
        <p className="border-t border-line bg-raised px-5 py-4 text-sm leading-6 text-muted">
          If your whole list lands in the first row, the sort is still worth
          thirty seconds. The value is noticing that you have nothing in rows
          two and three yet, and knowing which item would move there first.
        </p>
      }
    />
  )
}
