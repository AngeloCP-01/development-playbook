// web/src/features/observability/panels-collect.tsx
import Link from 'next/link'
import type { Step } from '@/components/Stepper'
import { Callout, Card, Prose, Section } from '@/components/ui'
import { Term } from '@/components/Term'
import { InlineCode } from '@/components/InlineCode'
import { AnnotatedArtifact } from '@/components/AnnotatedArtifact'
import { Figure } from '@/components/Figure'
import { RevealList } from '@/components/RevealList'
import { RevealFacet } from '@/components/RevealFacet'
import { getStage } from '@/lib/stages'
import { Drill } from './Drill'
import { LOGGER, SCRUBBER } from './artifacts'
import * as scrubber from './scrubber'
import * as levels from './log-levels'
import { SIGNALS } from './signals'
import type { StepId } from './steps'

const stageLinkClass = 'underline hover:text-brand'

function stageTitle(slug: string) {
  return getStage(slug)?.title ?? slug
}

const LEVEL_LADDER: [string, string][] = [
  ['debug', 'Diagnostic detail, normally disabled in production'],
  ['info', 'Routine events and business outcomes you want to count'],
  ['warn', 'An unexpected condition the application handled'],
  ['error', 'A fault you would investigate; a common input to alerts'],
  ['fatal', 'A fault that prevents the process continuing'],
]

export const COLLECT_STEPS: (Step & { id: StepId })[] = [
  /* ---- Panel 1: three ---- */
  {
    id: 'three',
    label: 'Three things',
    hint: 'In order of value',
    content: (
      <div className="space-y-16">
        <Section
          eyebrow="Why this stage exists"
          title="Monitoring, and then observability"
        >
          <Prose>
            <p>
              Monitoring checks the failures you anticipated: an error-rate
              threshold, a missing <Term id="heartbeat">heartbeat</Term>, a slow
              response. Observability is the ability to investigate questions
              you did not anticipate, using the evidence the system emits. Both
              matter: predefined checks tell you to look, and contextual
              evidence helps you work out what happened.
            </p>
            <p>
              Solo, errors plus a handful of metrics covers the large majority
              of real need.
            </p>
          </Prose>
        </Section>

        <Section eyebrow="Before you begin" title="Entry criteria">
          <ul className="list-disc space-y-1 pl-5 text-sm">
            <li>The application is deployed and receiving real traffic</li>
            <li>
              Sentry is installed with verified source maps (
              <Link href="/stages/04-project-setup" className={stageLinkClass}>
                {stageTitle('04-project-setup')}
              </Link>
              )
            </li>
          </ul>
        </Section>

        <Section title="Three things, in order of value">
          <RevealList
            idPrefix="obs-three"
            rows={[
              {
                id: 'errors',
                title: '1. Errors',
                summary:
                  'Something broke. Install this first; it delivers value immediately.',
                body: (
                  <p className="measure text-sm leading-6 text-muted">
                    Out of the box, Sentry tells you an exception occurred. The
                    next step is about turning that into a fix.
                  </p>
                ),
              },
              {
                id: 'metrics',
                title: '2. Metrics',
                summary: 'Aggregate health over time.',
                body: (
                  <p className="measure text-sm leading-6 text-muted">
                    This is what tells you &ldquo;normal&rdquo; so that
                    &ldquo;abnormal&rdquo; is legible. The four signals, and the{' '}
                    <Term id="baseline">baseline</Term> you write down after a
                    week of ordinary traffic.
                  </p>
                ),
              },
              {
                id: 'traces',
                title: '3. Traces',
                summary:
                  'Where request time went, across every hop. Not set up in this stage — and that is not an oversight.',
                body: (
                  <div className="space-y-3">
                    <p className="measure text-sm leading-6 text-muted">
                      With one application and one database, a trace tells you
                      what a slow query log already told you.{' '}
                      <strong className="text-fg">
                        You will know when you need them
                      </strong>{' '}
                      &mdash; the symptom is a slowness you cannot locate after
                      checking the obvious two places, and it usually arrives
                      with the second service (
                      <Link
                        href="/stages/09-performance-optimization"
                        className={stageLinkClass}
                      >
                        {stageTitle('09-performance-optimization')}
                      </Link>
                      ).
                    </p>
                    <p className="measure text-sm leading-6 text-muted">
                      Until then the <Term id="request-id">request id</Term>{' '}
                      from the structured-logs step does the job traces would.
                    </p>
                  </div>
                ),
              },
            ]}
          />
        </Section>
      </div>
    ),
  },

  /* ---- Panel 2: errors ---- */
  {
    id: 'errors',
    label: 'Errors that are useful',
    hint: 'Context first',
    content: (
      <div className="space-y-16">
        <Section
          eyebrow="Errors"
          title="Context is what turns an exception into a fix"
        >
          <Prose>
            <p>
              Attach the user to every authenticated request &mdash;{' '}
              <code>Sentry.setUser(&#123; id: user.id &#125;)</code>.
              &ldquo;This error hit 400 users&rdquo; and &ldquo;this error hit
              one user with unusual data&rdquo; are entirely different problems
              with entirely different urgency, and you cannot tell them apart
              without it.
            </p>
            <p>
              An opaque id is enough, because it{' '}
              <strong>resolves to a person in your own database</strong> &mdash;
              which you control, can query, and can delete. An email address in
              an error report is the same fact stored a second time, on
              infrastructure you do not control, under a retention policy you
              did not set. Sentry&rsquo;s retention window is a project setting,
              not something you configure in code &mdash; check it once.
            </p>
            <p>
              Add breadcrumbs for meaningful actions &mdash; what the user was
              doing before it broke is often the whole answer.
            </p>
          </Prose>
        </Section>
      </div>
    ),
  },

  /* ---- Panel 3: scrubbing ---- */
  {
    id: 'scrubbing',
    label: 'Scrubbing',
    hint: 'What never leaves the process',
    content: (
      <div className="space-y-16">
        <Section
          eyebrow="Errors"
          title="Do not send secrets, passwords, tokens, or payment details"
        >
          <Prose>
            <p>
              Sentry data is retained, is accessible to anyone with account
              access, and lives on someone else&rsquo;s infrastructure. The
              stage 04 wizard already created three runtime config files and
              called <code>Sentry.init</code> in each &mdash;{' '}
              <code>instrumentation-client.ts</code>,{' '}
              <code>sentry.server.config.ts</code>,{' '}
              <code>sentry.edge.config.ts</code>. <code>beforeSend</code> is
              added by editing those, not by adding a new one, and the same edit
              goes in all three.
            </p>
          </Prose>
          <Figure
            n={1}
            caption="beforeSend reaches three surfaces &mdash; headers, the body, exception text. The pivot is the redact call: a failed query prints its connection string, password included."
          >
            <AnnotatedArtifact artifact={SCRUBBER} />
          </Figure>
          <Prose>
            <p>
              Scrubbing is a deny-list, and a deny-list is only as current as
              the last time you read it. Reduce what you send in the first
              place: an id instead of an email, a reason code instead of a
              payload.
            </p>
          </Prose>
        </Section>

        <Section title="Which of these does the scrubber reach?">
          <Prose>
            <p>
              <code>beforeSend</code> only sees what Sentry&rsquo;s own capture
              puts on the event. <code>addContext</code> is a separate door:{' '}
              <code>Sentry.setContext</code> accepts whatever you hand it, and
              the deny-list never runs over it &mdash; which is why the helper
              constrains its argument to a flat record of primitives (
              <code>SafeContext</code>) rather than{' '}
              <code>Record&lt;string, unknown&gt;</code>.
            </p>
          </Prose>
          <Drill
            idPrefix="obs-scrubber"
            question={scrubber.QUESTION}
            subtitle={scrubber.SUBTITLE}
            options={scrubber.OPTIONS}
            rows={scrubber.ROWS}
          />
        </Section>

        <Callout kind="warn" title="One loop can spend everything">
          A batch job that throws once per row, over five thousand rows, sends
          five thousand events in a minute or two and empties a month&rsquo;s
          quota &mdash; after which you are blind, and nothing tells you so,
          because the thing that would have told you is the thing that ran out.
          Turn on spike protection, sample the noisy and expected, and set one
          alert on quota consumption itself. It is the only alert in this stage
          about your monitoring rather than your system, which is exactly why it
          gets forgotten.
        </Callout>
      </div>
    ),
  },

  /* ---- Panel 4: logs ---- */
  {
    id: 'logs',
    label: 'Structured logs',
    hint: 'Objects, not sentences',
    content: (
      <div className="space-y-16">
        <Section eyebrow="Logs" title="Log objects, not sentences">
          <Prose>
            <p>
              Sentences are unsearchable at volume.{' '}
              <Term id="structured-logging">Structured logging</Term> means one
              JSON object per line to stdout, which is what every platform in
              this playbook already collects. Any library that does that will
              do; <code>pino</code> is the one shown.
            </p>
          </Prose>
          <Figure
            n={2}
            caption="The logger, configured once so every call shares the same policy. The pivot is the error serializer: a bare Error stringifies to {}, and a stock serializer would keep the message verbatim, connection string and all."
          >
            <AnnotatedArtifact artifact={LOGGER} />
          </Figure>
        </Section>

        <Section title="Levels are a filter, not a mood">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-line">
                  <th className="py-2 pr-4 text-left font-medium">Level</th>
                  <th className="py-2 text-left font-medium">For</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {LEVEL_LADDER.map(([level, use]) => (
                  <tr key={level}>
                    <td className="py-2 pr-4 font-mono text-xs">{level}</td>
                    <td className="py-2 text-muted">{use}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Prose>
            <p>
              <code>error</code> means <em>a fault you would investigate</em>{' '}
              &mdash; it is the level your alerting reads, so anything routine
              that lands there is a false page waiting to happen. A declined
              card is a routine business outcome and not a fault: it is{' '}
              <code>info</code>.
            </p>
          </Prose>
          <Drill
            idPrefix="obs-levels"
            question={levels.QUESTION}
            subtitle={levels.SUBTITLE}
            options={levels.OPTIONS}
            rows={levels.ROWS}
          />
        </Section>
      </div>
    ),
  },

  /* ---- Panel 5: fields ---- */
  {
    id: 'fields',
    label: 'What goes on the line',
    hint: 'Request id, naming, cardinality',
    content: (
      <div className="space-y-16">
        <Section eyebrow="Logs" title="What goes on the line">
          <RevealList
            idPrefix="obs-logline"
            rows={[
              {
                id: 'request-id',
                title: 'A request id on every line',
                summary:
                  'One field, not distributed tracing, and it is what makes "work out why" possible at two log lines.',
                body: (
                  <div className="space-y-3">
                    <p className="measure text-sm leading-6 text-muted">
                      <code>mixin</code> runs on every log call, so the{' '}
                      <Term id="request-id">request id</Term> attaches itself
                      and no call site has to remember it. Open the store once
                      per request &mdash; in middleware, or the first line of
                      the handler &mdash; with the incoming{' '}
                      <code>x-request-id</code> if there is one, or a fresh{' '}
                      <code>crypto.randomUUID()</code> if there is not.
                    </p>
                    <p className="measure text-sm leading-6 text-muted">
                      Then tag the error report with the same key:{' '}
                      <code>
                        Sentry.setTag(&apos;requestId&apos;, requestId)
                      </code>
                      . Now the error tracker and the logs are searchable by the
                      same id, which is the whole of what tracing buys you until
                      requests start crossing service boundaries.
                    </p>
                  </div>
                ),
              },
              {
                id: 'naming',
                title: 'Name events noun.verb_past_tense, consistently',
                summary:
                  'invoice.payment_declined, order.created. Consistency is what makes the log searchable a year later.',
                body: (
                  <Card className="overflow-x-auto">
                    <pre className="text-sm leading-6">
                      <code>{`logger.info({
  event: 'invoice.payment_declined',
  userId,
  invoiceId,
  reason: 'card_declined',
  amountCents: 4500,
})`}</code>
                    </pre>
                  </Card>
                ),
              },
              {
                id: 'what-to-log',
                title: 'Log the events that matter, not everything',
                summary:
                  'Authentication events, payments, permission denials, external API failures, job outcomes, anything irreversible.',
                body: (
                  <RevealFacet label="never log" tone="danger">
                    Passwords, tokens, session IDs, card numbers, or the
                    contents of user documents. The last four digits and an
                    expiry date are still personal data, and &ldquo;it is only
                    partial&rdquo; is not a retention policy.
                  </RevealFacet>
                ),
              },
              {
                id: 'cardinality',
                title: 'Identifiers in logs, never as metric labels',
                summary:
                  'userId, invoiceId and requestId help you find an event. As labels, each combination is another time series.',
                body: (
                  <p className="measure text-sm leading-6 text-muted">
                    <Term id="cardinality">Cardinality</Term> that is useful for
                    log lookup can make metrics expensive. A bounded event name
                    such as <code>invoice.payment_declined</code> is a fine
                    label; a unique invoice id is not.
                  </p>
                ),
              },
            ]}
          />
        </Section>
      </div>
    ),
  },

  /* ---- Panel 6: where ---- */
  {
    id: 'where',
    label: 'Where logs go',
    hint: 'Stream, not storage',
    content: (
      <div className="space-y-16">
        <Section eyebrow="Retention" title="stdout is a stream, not storage">
          <Prose>
            <p>
              <code>pino</code> writes to stdout. On every platform in this
              playbook, something collects it, keeps it for a while, and then
              does not. Deciding what that something is, and for how long, is
              part of this stage; discovering it during an incident is not.
            </p>
          </Prose>
          <RevealList
            idPrefix="obs-where"
            rows={[
              {
                id: 'vercel',
                title: 'Vercel',
                summary:
                  'Runtime logs. Retention is short, and shorter on lower plans.',
                body: (
                  <RevealFacet label="what to set">
                    A drain to a log store if you need more than the built-in
                    window.
                  </RevealFacet>
                ),
              },
              {
                id: 'aws',
                title: 'AWS',
                summary: 'CloudWatch Logs. Retention default: never expire.',
                body: (
                  <div className="space-y-3">
                    <RevealFacet label="what to set" tone="warn">
                      A retention policy per log group, explicitly.
                    </RevealFacet>
                    <p className="measure text-sm leading-6 text-muted">
                      The AWS default is the one that bites. A log group with no
                      retention policy keeps everything forever and bills for it
                      forever, and nobody chose that &mdash; it is what happens
                      when nobody chooses.
                    </p>
                  </div>
                ),
              },
            ]}
          />
          <Prose>
            <p>
              Order of magnitude for a small production service: error tracking
              free to ~$30/month at low volume, uptime monitoring free to ~$10,
              logs the variable one &mdash; single-digit dollars if you keep a
              week and log events rather than everything, and unbounded if you
              keep everything forever. Check current pricing rather than
              trusting this paragraph.
            </p>
          </Prose>
        </Section>

        <Callout
          kind="info"
          title="Retention is a privacy decision, not only a cost one"
        >
          <p>
            Whatever you kept is what you have to be able to delete (
            <Link href="/stages/08-security-audit" className={stageLinkClass}>
              {stageTitle('08-security-audit')}
            </Link>
            ).
          </p>
        </Callout>
      </div>
    ),
  },

  /* ---- Panel 7: signals ---- */
  {
    id: 'signals',
    label: 'The four signals',
    hint: 'And what normal looks like',
    content: (
      <div className="space-y-16">
        <Section eyebrow="Metrics" title="If you instrument only four things">
          <Prose>
            <p>
              These are the <Term id="golden-signals">golden signals</Term>.
              Every row states its category before it names a product, so a
              reader on neither platform still knows what to look for.
            </p>
          </Prose>
          <RevealList
            idPrefix="obs-signals"
            rows={SIGNALS.map((s) => ({
              id: s.id,
              title: s.name,
              summary: s.source,
              body: (
                <div className="space-y-3">
                  <RevealFacet label="Vercel">
                    <InlineCode text={s.vercel} />
                  </RevealFacet>
                  <RevealFacet label="AWS">
                    <InlineCode text={s.aws} />
                  </RevealFacet>
                </div>
              ),
            }))}
          />
        </Section>

        <Callout
          kind="warn"
          title="Error rate does not come from your error tracker"
        >
          Sentry tells you what broke and how many times it was reported; it is
          sampled, it is filtered by <code>beforeSend</code>, and it never sees
          a request that succeeded &mdash; so it can give you neither half of
          the fraction. Both halves come from the layer that counts every
          request: failed responses over total responses, same source, same
          window. Divide a sampled numerator by an unsampled denominator and the
          percentage you get is not a percentage of anything.
        </Callout>

        <Section title="Reading the numbers">
          <Prose>
            <p>
              <strong>Latency</strong> at p50, p95 and p99. A p95 of 400ms means
              at least 95 requests out of every hundred finished at or below
              400ms. A p99 is the threshold at or below which at least 99%
              finished, not a maximum; the slowest request can take much longer.
              Watch the tail. <Term id="percentile">Percentiles</Term> do not
              average: the p95 across three instances is not the mean of their
              three p95s.
            </p>
            <p>
              <strong>Traffic</strong> &mdash; requests per minute. Its main
              value is that a sudden drop is one of the clearest possible
              signals that something is badly broken. <strong>Errors</strong>{' '}
              &mdash; rate as a percentage of requests, not an absolute count.
              Fifty errors means nothing without a denominator.{' '}
              <strong>
                <Term id="saturation">Saturation</Term>
              </strong>{' '}
              &mdash; how close resources are to their limit. Database
              connections, function concurrency, storage.
            </p>
            <p>
              Check which number you are reading. Every platform sells you two
              different latencies &mdash; the user&rsquo;s experience in the
              browser and the time your server spent &mdash; and the table above
              means the second. On Vercel the per-route latency breakdown is an
              Observability Plus feature; below it you get invocation counts and
              error rate but not the latency split.
            </p>
          </Prose>
        </Section>

        <Callout kind="info" title="Write the numbers down">
          <p>
            Instrumenting these gives you numbers. It does not give you{' '}
            <em>normal</em>, and without normal none of them is readable: 12
            errors in the last hour is a catastrophe or a Tuesday. Once you have
            a week of ordinary traffic, record the{' '}
            <Term id="baseline">baseline</Term> &mdash; error rate, p95 latency,
            requests per minute at your busy hour and your quiet one &mdash;
            somewhere you will find it at 2am, which means the repository and
            not your memory. Stage 14 uses the same baselines to judge a deploy.
          </p>
        </Callout>
      </div>
    ),
  },
]
