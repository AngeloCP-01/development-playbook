import { RevealList } from '@/components/RevealList'
import { RevealFacet } from '@/components/RevealFacet'
import { DEFERRED_ITEMS } from './defer'

/**
 * Source: docs/03-architecture.md, "Defer aggressively".
 *
 * Six of the doc's seven items. The seventh is the closing claim — "each of
 * these solves a real problem, none of them solves a problem you have yet" —
 * which reads better as the prose it already is than as a row with nothing
 * to expand, so it closes the list instead of joining it. (Decision left to
 * this task by the brief; recorded in the commit body.)
 *
 * Modelled on `ValidationLadder` (discovery) for the collapsed-row shape,
 * with one change: items open independently, tracked as a `Set` of ids,
 * rather than as an accordion with one panel open at a time. There is no
 * ordering here for a single-open panel to defend, and a reader comparing
 * two items should be able to hold both open.
 *
 * Each expanded panel carries three lines, not two: the real problem the
 * thing solves, why it is not needed yet, and — the line most writing on
 * this topic skips — what carrying it costs today, before it has paid for
 * itself once.
 *
 * Built on `RevealList`, extracted from this file and four byte-identical
 * copies elsewhere in this directory. The "fails the test" badge moved from
 * below the row title to beside it in the move, matching `DeploymentStyles`
 * — the first of the branch's two deliberate visual changes. `ContractCost`
 * made the same move later, for the same reason, and this comment was written
 * before that one existed.
 */

export function DeferredList() {
  return (
    <RevealList
      idPrefix="deferred"
      rows={DEFERRED_ITEMS.map((item) => ({
        id: item.id,
        title: item.name,
        badge: item.failsTest ? (
          <span className="border border-warn px-1.5 py-0.5 text-[11px] font-medium text-warn">
            fails the test
          </span>
        ) : undefined,
        summary: item.summary,
        body: (
          <>
            <RevealFacet label="The real problem it solves" tone="blueprint">
              {item.problem}
            </RevealFacet>
            <RevealFacet label="Why it is not yours yet" tone="subtle">
              {item.notYet}
            </RevealFacet>
            <RevealFacet label="What it costs you today" tone="warn">
              {item.costsToday}
            </RevealFacet>
          </>
        ),
      }))}
      footer={
        <p className="border-t border-line bg-raised px-5 py-4 text-sm leading-6 text-muted">
          The test: defer anything whose reversal does not require migrating
          stored data. Adding a cache later touches code. Adding a queue later
          touches code. Those are afternoons, and you will make the decision
          with information you do not have today. One item above fails that
          test, which is why it is split into the part you decide now and the
          part you defer.
        </p>
      }
    />
  )
}
