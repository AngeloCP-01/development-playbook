import { ArrowRight } from 'lucide-react'
import { RevealList } from '@/components/RevealList'
import { CHARACTERISTICS, TRACE_ROWS } from './characteristics'

/**
 * Source: docs/03-architecture.md, "What this system has to be".
 *
 * The doc's trace-forward table, as expand-to-reveal rather than a table:
 * every row's payload is a paragraph, which is the case `PATTERNS.md` names
 * this pattern for, and a three-column table at 320px is an overflow risk for
 * content that reflows perfectly well as prose.
 *
 * Each row links to the step where the decision it forces actually gets made.
 * That link is the section's argument in one gesture — the characteristic is
 * not a label, it is the reason a later step goes the way it does.
 *
 * Built on `RevealList`; state, markup and the chevron now live there. The
 * body's `<p>` and `<a>` are wrapped in a `<div>` so `RevealList`'s panel
 * `space-y-3` — which sets `margin-block-end` on every non-last direct child
 * — never reaches the `<p>`. Without the wrapper the `<p>` picks up an
 * unopposed 12px bottom margin that does not collapse with the `<a>`'s own
 * `mt-3`, because the `<a>` is `inline-flex` and margins of inline-level
 * boxes do not collapse with a block sibling's; measured live, that widened
 * the gap from 12px to 24px. Wrapping restores the original 12px, the same
 * fix `Normalisation` needed for the same reason.
 */

const NAME_BY_ID = new Map(CHARACTERISTICS.map((c) => [c.id, c.name]))

export function TraceForward() {
  return (
    <RevealList
      idPrefix="trace"
      rows={TRACE_ROWS.map((row) => ({
        id: row.characteristicId,
        title: NAME_BY_ID.get(row.characteristicId) ?? row.characteristicId,
        summary: `forces a decision in ${row.stepLabel}`,
        body: (
          <div>
            <p className="text-sm leading-6 text-muted">{row.forces}</p>
            <a
              href={`#${row.stepId}`}
              className="mt-3 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-brand lg:min-h-9"
            >
              Go to {row.stepLabel}
              <ArrowRight className="size-3.5 shrink-0" aria-hidden />
            </a>
          </div>
        ),
      }))}
      footer={
        <p className="border-t border-line bg-raised px-5 py-4 text-sm leading-6 text-muted">
          Every row is a decision this stage makes anyway. Choosing the
          characteristic first is what turns it from a preference into something
          with a reason attached. Which gives you the test: a characteristic
          that traces to no decision was not chosen, it was listed. If
          &ldquo;secure&rdquo; is on your list and nothing downstream changed
          because of it, delete it. It is doing no work, and it is crowding out
          one that would.
        </p>
      }
    />
  )
}
