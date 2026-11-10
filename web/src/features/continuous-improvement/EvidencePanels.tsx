import Link from 'next/link'
import { Figure } from '@/components/Figure'
import { RevealList } from '@/components/RevealList'
import { Term } from '@/components/Term'
import { Callout, Prose, Section } from '@/components/ui'
import { Drill } from '@/features/observability/Drill'
import {
  ACTIONS,
  ACTION_OPTIONS,
  MEASURES,
  MEASURE_OPTIONS,
  SIGNALS,
} from './content'

export function MeasuresPanel() {
  return (
    <Section
      eyebrow="Two questions"
      title="What kind of improvement are you measuring?"
    >
      <Prose>
        <p>
          Can intended users accomplish something they value, with acceptable
          effort and risk? Can maintainers make useful changes safely and
          sustainably? Keep these questions separate.
        </p>
        <p>
          Start with a product, prototype or delivery question, evidence you can
          inspect (or a named gap), and someone who can choose an action and
          review its result. Before launch, use observed task attempts and
          delivery experience; label what remains untested with real users.
        </p>
      </Prose>
      <Figure
        n={1}
        caption="Fictional signals answer different questions. Shipping faster does not establish product value."
      >
        <Drill
          idPrefix="improvement-measures"
          question="Which question does this evidence address most directly?"
          subtitle="Choose before reading the limits of the measure."
          options={MEASURE_OPTIONS}
          rows={MEASURES}
        />
      </Figure>
      <RevealList
        idPrefix="improvement-goal"
        rows={[
          {
            id: 'goal',
            title: 'Goal → signal → metric',
            summary: 'Choose the task before choosing a number.',
            body: (
              <p>
                The{' '}
                <a
                  className="underline"
                  href="https://research.google/pubs/measuring-the-user-experience-on-a-large-scale-user-centered-metrics-for-web-applications/"
                >
                  HEART work by Rodden, Hutchinson and Fu
                </a>{' '}
                connects goals to observable signals and then metrics. For an
                invoice task, use eligible attempts reaching a useful draft,
                with follow-up on task quality. Clicks or time spent alone
                cannot establish value: more time may mean engagement in a
                reading product and difficulty in a form.
              </p>
            ),
          },
        ]}
      />
      <div className="mt-6">
        <Callout title="Examples, not project analytics">
          <p>
            All scenarios and counts here are fictional teaching examples. This
            repository’s traffic, support volume and product outcomes are
            unknown.
          </p>
        </Callout>
      </div>
    </Section>
  )
}

export function EvidencePanel() {
  return (
    <Section
      eyebrow="Evidence inspection"
      title="Keep observation separate from explanation"
    >
      <Prose>
        <p>
          Usage, errors and support conversations suggest investigations. Open
          an observation to compare possible explanations with checks that could
          distinguish them, following{' '}
          <a
            className="underline"
            href="https://www.gov.uk/service-manual/user-research/analyse-a-research-session"
          >
            GOV.UK’s research analysis guidance
          </a>
          .
        </p>
      </Prose>
      <Figure
        n={2}
        caption="An observation can support several explanations; inspect the task and the measurement before acting."
      >
        <RevealList
          idPrefix="improvement-signal"
          rows={SIGNALS.map((signal) => ({
            id: signal.id,
            title: signal.title,
            body: (
              <dl className="space-y-3 text-sm leading-6 text-muted">
                <div>
                  <dt className="t-label mb-1 text-blueprint">
                    Possible explanations
                  </dt>
                  <dd>{signal.possible}</dd>
                </div>
                <div>
                  <dt className="t-label mb-1 text-blueprint">
                    Check before acting
                  </dt>
                  <dd>{signal.check}</dd>
                </div>
              </dl>
            ),
          }))}
        />
      </Figure>
      <RevealList
        idPrefix="improvement-evidence"
        rows={[
          {
            id: 'counts',
            title: 'Make a rate interpretable',
            summary: 'Population, window, counts and event definitions.',
            body: (
              <p>
                Record the population and date window. The numerator counts
                qualifying successes; the{' '}
                <Term id="denominator">denominator</Term> counts eligible
                opportunities. Distinguish users, sessions and repeated
                attempts. Inspect retries, missing events and changed
                definitions before comparing rates.
              </p>
            ),
          },
          {
            id: 'voices',
            title: 'Check who is missing',
            summary: 'Low usage and quiet users still matter.',
            body: (
              <p>
                Include people whose access needs or low usage make them easy to
                miss. Count independent users and affected tasks, not repeated
                messages as separate demand. Keep contradictory observations
                beside supporting cases. One report of serious harm can outweigh
                many requests for convenience.
              </p>
            ),
          },
        ]}
      />
    </Section>
  )
}

export function ActionPanel() {
  return (
    <Section
      eyebrow="Decision practice"
      title="Choose the smallest useful next action"
    >
      <Prose>
        <p>
          Compare harm, reach, urgency, uncertainty and minority needs. Consider
          a small repair, a new capability, further research and doing nothing.
          Include effort, ongoing maintenance and reversibility; a score can
          organize discussion without deciding for you.
        </p>
      </Prose>
      <div className="my-6">
        <Callout
          kind="warn"
          title="Contain active harm before a routine review"
        >
          <p>
            Route active incidents through{' '}
            <Link className="underline" href="/stages/16-incident-management">
              Incident Management
            </Link>{' '}
            and urgent security issues through{' '}
            <Link className="underline" href="/stages/08-security-audit">
              Security Audit
            </Link>
            . Do not wait for the improvement review.
          </p>
        </Callout>
      </div>
      <Figure
        n={3}
        caption="Fictional cases: choose from the stated evidence. Serious minority needs do not disappear in a popularity ranking."
      >
        <Drill
          idPrefix="improvement-action"
          question="What is the next disposition?"
          subtitle="These are bounded cases, not a universal priority formula."
          options={ACTION_OPTIONS}
          rows={ACTIONS}
        />
      </Figure>
      <RevealList
        idPrefix="improvement-request"
        rows={[
          {
            id: 'conversation',
            title: 'Ask what the requested feature replaces',
            summary: '“Can you add invoice templates?”',
            body: (
              <div className="space-y-3">
                <p>
                  Ask: “What are you doing today that templates would replace?”
                  The fictional answer is: “I copy last month’s invoice and
                  change the date and amount.” Observe which items, recipients
                  and amounts vary, who approves the result and whether
                  automatic sending would be safe.
                </p>
                <p>
                  Record the task and source observations, explain the selected
                  action and why alternatives can wait. Use{' '}
                  <Link
                    className="underline"
                    href="/stages/01-product-discovery"
                  >
                    Product Discovery
                  </Link>{' '}
                  to investigate the need and{' '}
                  <Link className="underline" href="/stages/02-planning">
                    Planning
                  </Link>{' '}
                  to make the tradeoff explicit.
                </p>
              </div>
            ),
          },
        ]}
      />
    </Section>
  )
}
