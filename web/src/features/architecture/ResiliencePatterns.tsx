import { RevealList } from '@/components/RevealList'
import { RevealFacet } from '@/components/RevealFacet'
import { RESILIENCE_PATTERNS } from './sketch'

/**
 * Source: docs/03-architecture.md, "Sketch the system" — its "Timeouts, retries
 * and failing well" subsection.
 *
 * Expand-to-reveal, modelled on `DeferredList` in this same feature: rows open
 * independently rather than as an accordion, because a reader comparing retries
 * against a breaker should be able to hold both open.
 *
 * The collapsed line is the failure rather than the mechanism. These are four
 * names a reader is likely to have heard and not been given a definition of, so
 * a list that reads "Circuit breaker — stops calling after failures" leaves them
 * exactly where they started; "your retries have made you part of the outage"
 * does not.
 */
export function ResiliencePatterns() {
  return (
    <RevealList
      idPrefix="resilience"
      rows={RESILIENCE_PATTERNS.map((p) => ({
        id: p.id,
        title: p.name,
        summary: p.summary,
        body: (
          <>
            <RevealFacet label="The failure it answers" tone="warn">
              {p.failure}
            </RevealFacet>
            <RevealFacet label="What it is" tone="blueprint">
              {p.what}
            </RevealFacet>
            <RevealFacet label="What earns it its place" tone="go">
              {p.earnsItsPlace}
            </RevealFacet>
            {p.catch && (
              <RevealFacet label="The catch" tone="danger">
                {p.catch}
              </RevealFacet>
            )}
          </>
        ),
      }))}
      footer={
        <p className="border-t border-line bg-raised px-5 py-4 text-sm leading-6 text-muted">
          One more name, worth knowing and not building:{' '}
          <strong className="font-medium text-fg">bulkhead</strong>, isolating
          resource pools so one saturated dependency cannot consume every
          thread. Real, and rarely earning its keep inside a single application.
          Building a timeout, retries, a breaker and a bulkhead around three
          third-party calls on day one is the same instinct as reaching for
          microservices, wearing different clothes — which is a claim about the
          machinery, not about the last row above. Deciding what still works
          without each dependency costs nothing and is the point of having drawn
          the diagram.
        </p>
      }
    />
  )
}
