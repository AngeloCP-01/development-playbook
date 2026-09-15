// web/src/features/observability/panels-act.tsx
import Link from 'next/link'
import type { Step } from '@/components/Stepper'
import { Callout, Card, Prose, Section } from '@/components/ui'
import { Term } from '@/components/Term'
import { InlineCode } from '@/components/InlineCode'
import { AnnotatedArtifact } from '@/components/AnnotatedArtifact'
import { Figure } from '@/components/Figure'
import { References } from '@/components/References'
import { RevealList } from '@/components/RevealList'
import { RevealFacet } from '@/components/RevealFacet'
import { getStage } from '@/lib/stages'
import { Drill } from './Drill'
import { AIPlays } from './AIPlays'
import { ObservabilityChecklist } from './ObservabilityChecklist'
import { CANARY, HEALTH, HEARTBEAT } from './artifacts'
import * as triage from './alert-triage'
import * as silence from './silence'
import { TRAPS } from './traps'
import type { StepId } from './steps'

const stageLinkClass = 'underline hover:text-brand'

function stageTitle(slug: string) {
  return getStage(slug)?.title ?? slug
}

/**
 * Figure 4: which platform mechanism reads which endpoint. Static — two
 * columns, no interaction — because the lesson is the mapping itself.
 */
function RestartVsRouting() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <Card>
        <p className="t-label mb-2 text-brand">Restart decision</p>
        <p className="text-sm text-muted">
          Fly, ECS, Cloud Run, a Kubernetes liveness probe. Asks &ldquo;is this
          process wedged?&rdquo;
        </p>
        <p className="mt-3 border-t border-line pt-3 text-sm">
          Reads the <Term id="liveness">liveness</Term> endpoint &mdash;{' '}
          <code>/api/health/live</code>, <code>200</code> whenever the process
          is running.
        </p>
      </Card>
      <Card>
        <p className="t-label mb-2 text-brand">Routing decision</p>
        <p className="text-sm text-muted">
          A load balancer&rsquo;s health check, a Kubernetes readiness probe.
          Asks &ldquo;should traffic come here right now?&rdquo;
        </p>
        <p className="mt-3 border-t border-line pt-3 text-sm">
          Reads the <Term id="readiness">readiness</Term> endpoint &mdash;{' '}
          <code>/api/health</code>, which checks the database and returns{' '}
          <code>503</code> when it cannot.
        </p>
      </Card>
    </div>
  )
}

export const ACT_STEPS: (Step & { id: StepId })[] = [
  /* ---- Panel 10: health ---- */
  {
    id: 'health',
    label: 'Health checks',
    hint: 'Liveness vs readiness',
    content: (
      <div className="space-y-16">
        <Section eyebrow="Health" title="Check real dependencies">
          <Prose>
            <p>
              An endpoint returning <code>200 OK</code> unconditionally tells
              you the process is running, which you already knew. The realistic
              failure is not <em>refused</em>, it is <em>hung</em> &mdash; an
              exhausted pool, a network partition &mdash; and without the{' '}
              <Term id="timeout">timeout</Term> the health check hangs with it
              and never returns the <code>degraded</code> state it exists to
              report.
            </p>
          </Prose>
          <Figure
            n={3}
            caption="The readiness endpoint. The pivot is the race: without it the check fails in exactly the case it was written for."
          >
            <AnnotatedArtifact artifact={HEALTH} />
          </Figure>
        </Section>

        <Section title="Two different things ask whether you are up">
          <Prose>
            <p>
              <strong>
                <Term id="liveness">Liveness</Term>
              </strong>{' '}
              is &ldquo;is this process wedged, should the platform restart
              it&rdquo; &mdash; and the honest answer depends on nothing but the
              process, because a restart cannot fix a database.{' '}
              <strong>
                <Term id="readiness">Readiness</Term>
              </strong>
              , which is what the endpoint above does, is &ldquo;should traffic
              come here, is everything it depends on reachable&rdquo;.
            </p>
          </Prose>
          <Figure
            n={4}
            caption="A restart decision and a routing decision read different endpoints. Wire the restart trigger to the dependency check and a thirty-second database blip restarts every instance you have, simultaneously."
          >
            <RestartVsRouting />
          </Figure>
          <Prose>
            <p>
              The liveness endpoint is the trivial one, deliberately &mdash; it
              has nothing to check:
            </p>
          </Prose>
          <Card className="overflow-x-auto">
            <pre className="text-sm leading-6">
              <code>{`// src/app/api/health/live/route.ts — wire the platform's restart trigger here
export async function GET() {
  return new Response('ok')
}`}</code>
            </pre>
          </Card>
          <Prose>
            <p>
              If this ever grows a dependency check, it has stopped being a
              liveness endpoint.
            </p>
            <p>
              Readiness does not have to be all-or-nothing, either. If a service
              depends on several things a request might not all need, one
              dependency being down does not have to fail every route: treat
              each dependency&rsquo;s health as a fact a handler can read, and
              let the handler decide whether its own dependency is required. A
              payment provider outage need not fail every route.
            </p>
            <p>
              Point your uptime monitor at the dependency-checking one &mdash;
              but not only at <code>/api/health</code>. Monitor a real user path
              too; the health check can pass while the page a user actually
              loads throws.
            </p>
          </Prose>
        </Section>
      </div>
    ),
  },

  /* ---- Panel 11: alerts ---- */
  {
    id: 'alerts',
    label: 'Alerts you will act on',
    hint: 'Actionable, or deleted',
    content: (
      <div className="space-y-16">
        <Section
          eyebrow="Alerts"
          title="The only rule that matters: every alert must be actionable"
        >
          <Prose>
            <p>
              An alert you cannot act on trains you to dismiss alerts, and after
              a few weeks of that you will dismiss the real one without reading
              it. <Term id="alert-fatigue">Alert fatigue</Term> is not a
              discipline failure; it is the predictable result of noisy alerts.
            </p>
          </Prose>
          <Drill
            idPrefix="obs-triage"
            question={triage.QUESTION}
            subtitle={triage.SUBTITLE}
            options={triage.OPTIONS}
            rows={triage.ROWS}
          />
        </Section>

        <Section title="The rules behind the verdicts">
          <RevealList
            idPrefix="obs-alert-rules"
            rows={[
              {
                id: 'symptoms',
                title: 'Alert on symptoms, not causes — with one exception',
                summary:
                  '"Users cannot check out" is actionable. "CPU is at 80%" is not.',
                body: (
                  <p className="measure text-sm leading-6 text-muted">
                    The exception is the reason &ldquo;database connections near
                    the limit&rdquo; pages: a resource with a{' '}
                    <strong>hard ceiling</strong> that{' '}
                    <strong>does not recover on its own</strong> &mdash; a
                    connection pool, a disk, an API quota &mdash; is worth
                    alerting on <em>before</em> it becomes a symptom, because
                    crossing it is a cliff rather than a slope. CPU has the
                    ceiling but not the second half: it is elastic, it comes
                    back on its own, and crossing 80% degrades rather than
                    fails.
                  </p>
                ),
              },
              {
                id: 'floor',
                title: 'A ratio needs a floor',
                summary:
                  '"Error rate above 5%" is sensible at a thousand requests a minute and nonsense at four.',
                body: (
                  <p className="measure text-sm leading-6 text-muted">
                    One failed request overnight is a 25% error rate, and it
                    will page you. Gate every ratio alert on a minimum volume
                    &mdash;{' '}
                    <em>above 5% and at least twenty requests in the window</em>{' '}
                    &mdash; and add a plain count alongside it for the traffic
                    levels where the ratio is noise.
                  </p>
                ),
              },
              {
                id: 'three-moves',
                title:
                  'Three moves for an alert that woke you four times without needing action',
                summary:
                  'Raise the threshold, lengthen the window, or delete it. Reach for the first two before the third.',
                body: (
                  <p className="measure text-sm leading-6 text-muted">
                    Four fires a week is usually a threshold set from a guess
                    rather than from a baseline. Delete without hesitation when
                    it has never once led to action; an alert nobody acts on is
                    training you to ignore the one that matters.
                  </p>
                ),
              },
            ]}
          />
        </Section>

        <Callout kind="warn" title="Fire a test alert on purpose">
          Route to somewhere that will actually interrupt you &mdash; push
          notification or SMS; email is read the next morning. Then confirm it
          reaches you on the device you expect to be woken by. An alert routed
          to a dead phone number, an expired webhook, or an app whose
          notifications you silenced in a meeting is indistinguishable from a
          healthy system, forever. Do it when you set the alert up, and again
          when you change how you are reachable.
        </Callout>

        <Prose>
          <p>
            This stage stops at the alert arriving. What you do in the five
            minutes after it is{' '}
            <Link
              href="/stages/16-incident-management"
              className={stageLinkClass}
            >
              {stageTitle('16-incident-management')}
            </Link>
            . Read it before the alert.
          </p>
        </Prose>
      </div>
    ),
  },

  /* ---- Panel 12: silence ---- */
  {
    id: 'silence',
    label: 'When nothing reports',
    hint: 'Absence is not evidence of health',
    content: (
      <div className="space-y-16">
        <Section
          eyebrow="From outside"
          title="Monitor a real user path from outside"
        >
          <Prose>
            <p>
              If Vercel has a regional problem or your DNS breaks, internal
              monitoring reports that everything is fine because nothing is
              reaching it. An external check every minute against a real page is
              the cheapest meaningful monitoring you can buy. Turn on
              certificate-expiry checking while you are there &mdash; it is the
              one failure here that arrives on a schedule you could have read
              months in advance.
            </p>
            <p>
              If you are an API behind authentication, you need a{' '}
              <Term id="canary">canary</Term> endpoint: one route, authenticated
              with a token issued to the monitor and nothing else, that reads
              far enough down the real path to prove it works and{' '}
              <strong>writes nothing</strong>.
            </p>
          </Prose>
          <Figure
            n={5}
            caption="Reads the last order back instead of creating one. The pivot is the empty-result branch: a status-only monitor cannot see a failure inside a 200."
          >
            <AnnotatedArtifact artifact={CANARY} />
          </Figure>
        </Section>

        <Section title="Absence of a signal is not evidence of health">
          <Prose>
            <p>
              Everything above fires when something happens. Nothing above fires
              when something <strong>stops</strong>, and a system that has gone
              quiet looks exactly like a system that is fine.
            </p>
          </Prose>
          <Drill
            idPrefix="obs-silence"
            question={silence.QUESTION}
            subtitle={silence.SUBTITLE}
            options={silence.OPTIONS}
            rows={silence.ROWS}
          />
          <Prose>
            <p>
              The fix is not more error tracking. It is to{' '}
              <strong>
                count the outcomes you care about, not just the exceptions
              </strong>
              . Once <code>order.created</code> is a counted event, its{' '}
              <em>absence</em> is measurable, and &ldquo;no orders in ninety
              minutes on a Tuesday afternoon&rdquo; is an alert you can actually
              write. When someone reports a failure your tools did not see, that
              gap is the finding &mdash; not the report.
            </p>
          </Prose>
        </Section>
      </div>
    ),
  },

  /* ---- Panel 13: jobs ---- */
  {
    id: 'jobs',
    label: 'Jobs that nobody watches',
    hint: 'Heartbeats catch silence, not errors',
    content: (
      <div className="space-y-16">
        <Section eyebrow="Silence" title="Jobs that nobody watches">
          <Prose>
            <p>
              A scheduled job that <strong>never ran</strong> produces no
              exception, no log line and no request. Every mechanism in this
              stage reports that the system is healthy, and it is &mdash; the
              job is simply not part of it any more. The instrument is a{' '}
              <Term id="heartbeat">heartbeat</Term>, and it is the only monitor
              here that alerts on silence.
            </p>
          </Prose>
          <Figure
            n={6}
            caption="On the success path only. The pivot is the ping itself; the duration rides along with it."
          >
            <AnnotatedArtifact artifact={HEARTBEAT} />
          </Figure>
          <RevealList
            idPrefix="obs-jobs"
            rows={[
              {
                id: 'not-in-finally',
                title: 'Not in a finally',
                summary:
                  'A ping in a finally block reports success for a run that threw.',
                body: (
                  <p className="measure text-sm leading-6 text-muted">
                    Which converts your only detector of silence into a source
                    of false confidence. The health check&rsquo;s{' '}
                    <code>finally</code> three steps back is resource cleanup;
                    this one would be a false success signal.
                  </p>
                ),
              },
              {
                id: 'aws',
                title: 'On AWS: TreatMissingData, set explicitly',
                summary:
                  'A CloudWatch alarm over a custom metric the job emits, with TreatMissingData set to breaching.',
                body: (
                  <p className="measure text-sm leading-6 text-muted">
                    The default is <code>missing</code>, which tells the alarm
                    to disregard absent data points when deciding its state
                    &mdash; which is precisely the condition you are trying to
                    catch. Better Stack, Healthchecks.io and Cronitor all offer
                    the heartbeat URL directly.
                  </p>
                ),
              },
              {
                id: 'withhold',
                title:
                  'Withhold a ping on purpose and confirm the page arrives',
                summary:
                  'A heartbeat you have only ever seen succeed has never actually been tested.',
                body: (
                  <p className="measure text-sm leading-6 text-muted">
                    Disable the job, or comment out the fetch call, for one
                    window on a non-production schedule, and watch the monitor
                    treat the silence as a failure &mdash; the same way you
                    tested alert delivery. The day it needs to catch silence is
                    the wrong day to find out its threshold was set from a
                    guess.
                  </p>
                ),
              },
              {
                id: 'duration-overlap',
                title: 'Slower every night, or overlapping itself',
                summary:
                  'Two failure shapes neither an error rate nor a heartbeat will show.',
                body: (
                  <div className="space-y-3">
                    <RevealFacet label="duration">
                      A reconciliation that has gone from four minutes to forty
                      is on its way to overrunning its window. The heartbeat
                      already sends <code>durationMs</code> &mdash; set a
                      threshold on it if your monitor supports one.
                    </RevealFacet>
                    <RevealFacet label="overlap">
                      Two copies running concurrently is a different bug from
                      either of them failing. Take an advisory lock (or check a
                      &ldquo;job running&rdquo; flag) before starting, so a
                      second invocation logs the conflict and exits.
                    </RevealFacet>
                  </div>
                ),
              },
            ]}
          />
        </Section>
      </div>
    ),
  },

  /* ---- Panel 14: ai ---- */
  {
    id: 'ai',
    label: 'AI plays',
    hint: 'Where agents help',
    content: (
      <div className="space-y-16">
        <Section title="AI in observability">
          <AIPlays />
        </Section>
      </div>
    ),
  },

  /* ---- Panel 15: done ---- */
  {
    id: 'done',
    label: 'Definition of done',
    hint: 'The dashboard and the checklist',
    content: (
      <div className="space-y-16">
        <Section
          eyebrow="Dashboards"
          title="One screen: is the application healthy right now?"
        >
          <ul className="list-disc space-y-1 pl-5 text-sm">
            <li>Requests per minute</li>
            <li>Error rate</li>
            <li>p95 latency</li>
            <li>
              Saturation of whatever is closest to its ceiling &mdash; usually
              database connections
            </li>
            <li>Recent deploys, marked on the timeline</li>
          </ul>
          <Prose>
            <p>
              Saturation is the one most likely to be the actual incident on a
              small deployment, and the one that gets dropped first. Deploy
              markers are disproportionately useful: most problems correlate
              with a deploy. A deploy marker is not a feature of your dashboard.
              It is an <strong>event with a timestamp</strong>, emitted by
              whatever performs the deploy &mdash; so the work is in your deploy
              step.
            </p>
          </Prose>
          <Card className="overflow-x-auto">
            <pre className="text-sm leading-6">
              <code>{`# In the deploy job, after the deploy succeeds.
sentry-cli releases new "$GITHUB_SHA"
sentry-cli releases set-commits "$GITHUB_SHA" --auto
sentry-cli releases finalize "$GITHUB_SHA"`}</code>
            </pre>
          </Card>
          <Prose>
            <p>
              On Vercel, the Sentry integration creates releases for you. On
              AWS, nothing emits the event unless you do: add the step above to
              the deploy workflow, and a CloudWatch or Grafana annotation for
              the dashboard. Resist adding more &mdash; a dashboard with forty
              charts is not read. You can keep separate collection tools and
              still see all four signals together: a visualization layer such as
              Grafana can query several data sources in one dashboard.
            </p>
          </Prose>
        </Section>

        <Section title="Done">
          <ObservabilityChecklist />
        </Section>
      </div>
    ),
  },

  /* ---- Panel 16: traps ---- */
  {
    id: 'traps',
    label: 'Traps',
    hint: 'Fifteen ways this goes wrong',
    content: (
      <div className="space-y-16">
        <Section title="Traps">
          <div className="space-y-4">
            {TRAPS.map((trap) => (
              <Callout
                key={trap.id}
                kind="trap"
                title={trap.title.replace(/`/g, '')}
              >
                <p>
                  <InlineCode text={trap.body} />
                </p>
              </Callout>
            ))}
          </div>
          <References slug="15-observability" />
        </Section>
      </div>
    ),
  },
]
