// web/src/features/post-deployment-verification/PostDeploymentVerification.tsx
import Link from 'next/link'
import { Stepper, type Step } from '@/components/Stepper'
import { Callout, Card, Prose, Section } from '@/components/ui'
import { Term } from '@/components/Term'
import { InlineCode } from '@/components/InlineCode'
import { AnnotatedArtifact } from '@/components/AnnotatedArtifact'
import { Figure } from '@/components/Figure'
import { References } from '@/components/References'
import { RevealList } from '@/components/RevealList'
import { getStage } from '@/lib/stages'
import { AIPlays } from './AIPlays'
import { AWS_VERIFICATION } from './aws-verification'
import { VerificationChecklist } from './VerificationChecklist'
import { TRAPS } from './traps'
import type { StepId } from './steps'

const stageLinkClass = 'underline hover:text-brand'

function stageTitle(slug: string) {
  return getStage(slug)?.title ?? slug
}

/* ------------------------------------------------------------------ */
/*  Steps                                                             */
/* ------------------------------------------------------------------ */

const CONTENT_STEPS: (Step & { id: StepId })[] = [
  /* ---- Panel 1: verify ---- */
  {
    id: 'verify',
    label: 'The ten-minute check',
    hint: 'Five phases, one flow',
    content: (
      <div className="space-y-16">
        <Section eyebrow="Before you begin" title="Entry criteria">
          <ul className="list-disc space-y-1 pl-5 text-sm">
            <li>
              The deploy succeeded (
              <Link
                href="/stages/13-production-deployment"
                className={stageLinkClass}
              >
                {stageTitle('13-production-deployment')}
              </Link>
              )
            </li>
            <li>You have access to logs, error tracking, and analytics</li>
            <li>
              You know what &ldquo;normal&rdquo; looks like &mdash; a{' '}
              <Term id="baseline">baseline</Term> error rate and latency (
              <Link href="/stages/15-observability" className={stageLinkClass}>
                {stageTitle('15-observability')}
              </Link>
              )
            </li>
          </ul>
          <Prose>
            <p>
              That last one is the prerequisite people lack. Without a baseline,
              &ldquo;12 errors in the last hour&rdquo; is unreadable. It could
              be a catastrophe or a Tuesday.
            </p>
          </Prose>
        </Section>

        <Section title="The ten-minute check">
          <RevealList
            idPrefix="pdv-ten-min"
            rows={[
              {
                id: 'minute-0-1',
                title: 'Minute 0–1: Is it up?',
                body: (
                  <p className="measure text-sm leading-6 text-muted">
                    Load the production URL. Not the deploy dashboard &mdash;
                    the actual site, in a real browser. Hard refresh to bypass
                    your cache.
                  </p>
                ),
              },
              {
                id: 'minute-1-3',
                title: 'Minute 1–3: Walk the critical path',
                body: (
                  <div className="space-y-3">
                    <p className="measure text-sm leading-6 text-muted">
                      Whatever the money path is &mdash; sign up, log in,
                      checkout, create the core object. Do it as a user. If you
                      have a <Term id="smoke-test">smoke test</Term>, run it
                      now:
                    </p>
                    <Card className="overflow-x-auto">
                      <pre className="text-sm leading-7">
                        <code>
                          {
                            'pnpm exec playwright test --grep @smoke --config=playwright.prod.ts'
                          }
                        </code>
                      </pre>
                    </Card>
                    <p className="measure text-sm leading-6 text-muted">
                      Smoke tests against production must be{' '}
                      <strong>read-mostly and idempotent</strong>. They confirm
                      pages render, auth works, and key queries return. They
                      must not create records that pollute real data, and they
                      must not be destructive. Use a dedicated test account.
                    </p>
                  </div>
                ),
              },
              {
                id: 'minute-3-5',
                title: 'Minute 3–5: Check error rates',
                body: (
                  <div className="space-y-3">
                    <p className="measure text-sm leading-6 text-muted">
                      Open Sentry. You are looking for:
                    </p>
                    <ul className="list-disc space-y-1 pl-5 text-sm text-muted">
                      <li>
                        Any <em>new</em> issue type first seen after this deploy
                        &mdash; the strongest signal there is
                      </li>
                      <li>
                        A rise in overall error volume against your{' '}
                        <Term id="baseline">baseline</Term>
                      </li>
                      <li>Errors mentioning files you just changed</li>
                    </ul>
                    <p className="measure text-sm leading-6 text-muted">
                      A new error type appearing within minutes of a deploy is
                      your change until proven otherwise. Do not talk yourself
                      out of that.
                    </p>
                  </div>
                ),
              },
              {
                id: 'minute-5-7',
                title: 'Minute 5–7: Check latency and traffic',
                body: (
                  <div className="space-y-3">
                    <p className="measure text-sm leading-6 text-muted">
                      In Vercel analytics:
                    </p>
                    <ul className="list-disc space-y-1 pl-5 text-sm text-muted">
                      <li>
                        Did p75 latency change? A deploy that doubles response
                        time is a bad deploy even with zero errors.
                      </li>
                      <li>
                        Is traffic still flowing? A sudden drop to zero means
                        something is broken upstream of your error tracking
                        &mdash; DNS, routing, a redirect loop.
                      </li>
                      <li>Any spike in 4xx or 5xx?</li>
                    </ul>
                  </div>
                ),
              },
              {
                id: 'minute-7-10',
                title: 'Minute 7–10: Check the specific thing you shipped',
                body: (
                  <p className="measure text-sm leading-6 text-muted">
                    Everything above was general health. Now verify the actual
                    change did what it was supposed to do, in production, with
                    production data. If you shipped a new report, open it and
                    confirm the numbers are right. If you changed a payment
                    flow, run a real transaction if you can safely do so.
                  </p>
                ),
              },
            ]}
          />
        </Section>

        <Section title="Verify with production data volumes">
          <Prose>
            <p>
              The bug class previews cannot catch: a query that is instant
              against 50 seeded rows and takes eight seconds against 5 million.
            </p>
            <p>
              After deploying anything touching data access, check actual query
              timing in production. Neon&rsquo;s dashboard shows slow queries;
              Sentry performance traces show the request-level picture. A query
              that got slower is worth investigating <em>before</em> it becomes
              a timeout on a busy Monday.
            </p>
          </Prose>
        </Section>
      </div>
    ),
  },

  /* ---- Panel 2: vercel ---- */
  {
    id: 'vercel',
    label: 'Vercel',
    hint: 'Where to look',
    content: (
      <div className="space-y-16">
        <Section title="Vercel: where to look">
          <Prose>
            <p>
              The ten-minute check is platform-agnostic. On Vercel, the specific
              tools are:
            </p>
          </Prose>
          <RevealList
            idPrefix="pdv-vercel"
            rows={[
              {
                id: 'vercel-analytics',
                title: 'Vercel Analytics',
                body: (
                  <p className="measure text-sm leading-6 text-muted">
                    p75 latency and traffic volume, filterable by route. A
                    deploy that doubles p75 on one route is a bad deploy even
                    with zero errors.
                  </p>
                ),
              },
              {
                id: 'deployment-url',
                title: 'Deployment URL',
                body: (
                  <p className="measure text-sm leading-6 text-muted">
                    <InlineCode text="`https://<project>-<hash>.vercel.app`" />{' '}
                    is the immutable deployment URL. Load it directly to confirm
                    the right build is live, not a cached older version.
                  </p>
                ),
              },
              {
                id: 'sentry-by-release',
                title: 'Sentry, filtered by release',
                body: (
                  <p className="measure text-sm leading-6 text-muted">
                    Tag releases with the deployment ID (
                    <InlineCode text="`VERCEL_DEPLOYMENT_ID`" /> is available at
                    build time). Filter by release to isolate errors from this
                    deploy versus background noise.
                  </p>
                ),
              },
              {
                id: 'test-prod',
                title: (
                  <span className="font-medium">
                    <InlineCode text="`pnpm test:prod`" />
                  </span>
                ),
                body: (
                  <p className="measure text-sm leading-6 text-muted">
                    The <InlineCode text="`@smoke`" /> suite pointed at the live
                    URL. The same critical path you would walk manually,
                    automated so it runs the same way every time.
                  </p>
                ),
              },
            ]}
          />
        </Section>
      </div>
    ),
  },

  /* ---- Panel 3: aws ---- */
  {
    id: 'aws',
    label: 'AWS',
    hint: 'Where to look',
    content: (
      <div className="space-y-16">
        <Section title="AWS: where to look">
          <Prose>
            <p>
              On ECS/Fargate, &ldquo;is it up&rdquo; requires checking three
              layers &mdash; the ECS service, the load balancer, and the
              application logs. The commands, in order:
            </p>
          </Prose>
          <Figure
            n={1}
            caption="Six commands to verify an ECS/Fargate deploy. The pivot is describe-target-health &mdash; the check services-stable does not do."
          >
            <AnnotatedArtifact artifact={AWS_VERIFICATION} />
          </Figure>
        </Section>

        <Section title="CloudWatch deployment alarms">
          <Prose>
            <p>
              If you have <Term id="deployment-alarm">deployment alarms</Term>{' '}
              configured, ECS watches CloudWatch metrics during a{' '}
              <Term id="bake-time">bake period</Term> after the new tasks go
              healthy. The key metrics:{' '}
              <InlineCode text="`HTTPCode_ELB_5XX_Count`" />,{' '}
              <InlineCode text="`TargetResponseTime`" />,{' '}
              <InlineCode text="`CPUUtilization`" />,{' '}
              <InlineCode text="`MemoryUtilization`" />.
            </p>
            <p>
              If an alarm fires during the bake window, ECS marks the deployment{' '}
              <InlineCode text="`FAILED`" /> and can auto-rollback to the
              previous task definition. An alarm already in{' '}
              <InlineCode text="`ALARM`" /> state before the deploy starts is
              ignored for that deployment, so a pre-existing incident does not
              block a fix.
            </p>
          </Prose>
        </Section>
      </div>
    ),
  },

  /* ---- Panel 4: recovery ---- */
  {
    id: 'recovery',
    label: 'Recovery',
    hint: 'When something goes wrong',
    content: (
      <div className="space-y-16">
        <Section title="When something is wrong">
          <Prose>
            <p>
              <strong>Roll back first.</strong> See{' '}
              <Link
                href="/stages/13-production-deployment"
                className={stageLinkClass}
              >
                {stageTitle('13-production-deployment')}
              </Link>
              . Do not diagnose a live incident on production time. Revert,
              confirm the site recovers, then investigate on a branch.
            </p>
          </Prose>
        </Section>

        <Section title="Four failure patterns that look like code bugs but are not">
          <RevealList
            idPrefix="pdv-failures"
            rows={[
              {
                id: 'env-var-misconfig',
                title: 'Environment variable misconfiguration',
                body: (
                  <p className="measure text-sm leading-6 text-muted">
                    A variable set in staging but missing in production, or set
                    to the wrong value. The deploy succeeds, the build compiled,
                    but a third-party integration silently fails because the key
                    is blank.
                  </p>
                ),
              },
              {
                id: 'partial-migration',
                title: 'Partial migration state',
                body: (
                  <p className="measure text-sm leading-6 text-muted">
                    The expand step ran, the migrate step did not. New code
                    reads from the new column; old data is still in the old one.
                    Everything works for new records and breaks for existing
                    ones.
                  </p>
                ),
              },
              {
                id: 'cold-caches',
                title: 'Cold caches',
                body: (
                  <p className="measure text-sm leading-6 text-muted">
                    The new deployment starts with empty caches. A query that
                    was instant against warm caches now hits the database for
                    every request until the cache fills. The spike is real, but
                    it is transient &mdash; wait before rolling back if latency
                    is elevated but error rates are flat.
                  </p>
                ),
              },
              {
                id: 'flag-defaults',
                title: 'Wrong feature flag defaults',
                body: (
                  <p className="measure text-sm leading-6 text-muted">
                    A flag defaults to <InlineCode text="`true`" /> in
                    development and <InlineCode text="`false`" /> in production,
                    or vice versa. The feature works in preview and is invisible
                    in production. Check flag values in the production
                    environment, not just flag existence.
                  </p>
                ),
              },
            ]}
          />
        </Section>

        <Section title="The half-hour follow-up">
          <Prose>
            <p>
              Some problems are not immediate. Cache-related bugs surface as
              caches expire, cron-driven failures surface on the next run, and
              memory leaks surface as instances stay warm.
            </p>
            <p>
              Check back once at around thirty minutes. If error rates and
              latency are still at <Term id="baseline">baseline</Term>, the
              deploy is genuinely done.
            </p>
          </Prose>
        </Section>

        <Section title="Automate what you repeat">
          <Prose>
            <p>
              Anything you check manually after every deploy should become a{' '}
              <Term id="smoke-test">smoke test</Term>. The manual list is the
              specification for the automated one.
            </p>
            <p>
              But keep doing the manual walk-through for the specific change you
              shipped. Automation covers what you already knew to check; your
              eyes catch what you did not.
            </p>
          </Prose>
        </Section>
      </div>
    ),
  },

  /* ---- Panel 5: ai ---- */
  {
    id: 'ai',
    label: 'AI plays',
    hint: 'Where agents help',
    content: (
      <div className="space-y-16">
        <Section title="AI in post-deployment verification">
          <AIPlays />
        </Section>
      </div>
    ),
  },

  /* ---- Panel 6: done ---- */
  {
    id: 'done',
    label: 'Traps & checklist',
    hint: 'The last step',
    content: (
      <div className="space-y-16">
        <Section title="Traps">
          <div className="space-y-4">
            {TRAPS.slice(0, 8).map((trap) => (
              <Callout key={trap.id} kind="trap" title={trap.title}>
                <p>
                  <InlineCode text={trap.body} />
                </p>
              </Callout>
            ))}
          </div>
          <details className="mt-6 rounded-md border border-line">
            <summary className="cursor-pointer px-4 py-3 text-sm font-medium">
              AWS-specific traps (3)
            </summary>
            <div className="space-y-4 px-4 pb-4 pt-2">
              {TRAPS.slice(8).map((trap) => (
                <Callout key={trap.id} kind="trap" title={trap.title}>
                  <p>
                    <InlineCode text={trap.body} />
                  </p>
                </Callout>
              ))}
            </div>
          </details>
        </Section>

        <Section title="Done">
          <VerificationChecklist />
        </Section>

        <References slug="14-post-deployment-verification" />
      </div>
    ),
  },
]

export function PostDeploymentVerification() {
  return <Stepper steps={CONTENT_STEPS} />
}
