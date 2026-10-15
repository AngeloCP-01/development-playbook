import { Figure } from '@/components/Figure'
import { Term } from '@/components/Term'
import { Card, Callout, Prose, Section } from '@/components/ui'
import { BaselineLab } from './BaselineLab'
import { OrderJourney } from './OrderJourney'

export function ClockPanel() {
  return (
    <Section eyebrow="Start with the user" title="Which outcome is slow?">
      <Prose>
        <p>
          Begin when a working feature is measurably slow, or when a launch will
          change its traffic shape. Correctness comes first. Choose the observer
          and start/stop events before recording a{' '}
          <Term id="baseline">baseline</Term>.
        </p>
      </Prose>
      <div className="mt-6">
        <Figure
          n={1}
          caption="The checkout request, visible payment status and three OrderPaid consumers have separate measurement boundaries."
        >
          <OrderJourney />
        </Figure>
      </div>
      <div className="mt-5">
        <Callout title="Join the evidence carefully">
          <p>
            Correlate records with an opaque order or event ID and propagated
            trace context. Keep customer details and payment secrets out of
            telemetry. Traces show instrumented work; absent spans do not prove
            an operation or provider wait was absent.
          </p>
        </Callout>
      </div>
    </Section>
  )
}

export function BaselinePanel() {
  return (
    <Section title="Record the first measurement">
      <Prose>
        <p>
          This practice uses browser checkout for the 20-item cart. Keep the
          duration <Term id="percentile">percentile</Term> population separate
          from failures and timeouts. A controlled run diagnoses one case; field
          observations establish what users experienced.
        </p>
        <p>
          Start page experience in real-user Web Vitals such as Speed Insights
          or PageSpeed Insights field data, segmented by mobile and desktop. For
          routes, use available route duration monitoring, noting plan-specific
          detail and retention. Payment intervals and consumer lag need
          timestamps joined by an opaque identifier.
        </p>
        <p>
          Reproduce the same action with stated device, network, cart size, data
          volume and cache state. If field traffic is too sparse, record that
          limitation, keep the controlled baseline and name the next observation
          window.
        </p>
      </Prose>
      <div className="mt-6">
        <BaselineLab />
      </div>
    </Section>
  )
}

export function TargetsPanel() {
  return (
    <Section title="Choose a target users need">
      <Prose>
        <p>
          Record the target and its reason before optimizing. Google&apos;s good
          Core Web Vitals thresholds use p75, separately for mobile and desktop.
          These concern page experience; they do not replace the checkout or
          payment clock.
        </p>
      </Prose>
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <Card>
          <p className="t-data mb-2">LCP ≤2.5 s</p>
          <p className="text-sm text-muted">
            <Term id="lcp">Largest Contentful Paint</Term> measures loading.
          </p>
        </Card>
        <Card>
          <p className="t-data mb-2">INP ≤200 ms</p>
          <p className="text-sm text-muted">
            <Term id="inp">Interaction to Next Paint</Term> measures response to
            interaction.
          </p>
        </Card>
        <Card>
          <p className="t-data mb-2">CLS ≤0.1</p>
          <p className="text-sm text-muted">
            <Term id="cls">Cumulative Layout Shift</Term> measures visual
            stability.
          </p>
        </Card>
      </div>
      <div className="mt-5">
        <Callout title="Product budgets need a reason">
          <p>
            API p95 of 300 ms and query time of 50 ms are example budgets, not
            web standards. A mean can help describe work but hides tails on its
            own. Do not add caching, memoization or indexes merely because a
            profiler lists a path. A 200 ms query may still block a critical
            low-traffic workflow; an already satisfactory high-traffic operation
            may need no change.
          </p>
        </Callout>
      </div>
      <a
        href="https://web.dev/articles/vitals"
        className="mt-4 inline-flex min-h-11 items-center text-sm underline"
      >
        Google Web Vitals thresholds
      </a>
    </Section>
  )
}
