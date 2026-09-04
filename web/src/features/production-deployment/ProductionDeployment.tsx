// web/src/features/production-deployment/ProductionDeployment.tsx
import Link from 'next/link'
import { Stepper, type Step } from '@/components/Stepper'
import { Callout, Card, Prose, Section } from '@/components/ui'
import { Term } from '@/components/Term'
import { InlineCode } from '@/components/InlineCode'
import { AnnotatedArtifact } from '@/components/AnnotatedArtifact'
import { Figure } from '@/components/Figure'
import { References } from '@/components/References'
import { getStage } from '@/lib/stages'
import { AIPlays } from './AIPlays'
import { MIGRATION_ARTIFACT } from './migration-artifact'
import { PIPELINE_ARTIFACT } from './pipeline-artifact'
import {
  AWS_COSTS,
  STRATEGIES,
  ROLLING_CONFIG,
  CIRCUIT_BREAKER_CONFIG,
} from './aws-data'
import { DeploymentChecklist } from './DeploymentChecklist'
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
  /* ---- Panel 1: deploys ---- */
  {
    id: 'deploys',
    label: 'Small & frequent',
    hint: 'One change, one suspect',
    content: (
      <div className="space-y-16">
        <Section eyebrow="Before you begin" title="Entry criteria">
          <ul className="list-disc space-y-1 pl-5 text-sm">
            <li>
              CI is green (
              <Link href="/stages/11-ci-cd" className={stageLinkClass}>
                {stageTitle('11-ci-cd')}
              </Link>
              )
            </li>
            <li>
              Preview verified (
              <Link href="/stages/12-staging" className={stageLinkClass}>
                {stageTitle('12-staging')}
              </Link>
              )
            </li>
            <li>
              Code reviewed (
              <Link href="/stages/07-code-review" className={stageLinkClass}>
                {stageTitle('07-code-review')}
              </Link>
              )
            </li>
            <li>
              Any migration is backward compatible (see the next step &mdash;
              this is the one that bites)
            </li>
            <li>
              You know how to <Term id="rollback">roll back</Term>,
              specifically, without looking it up
            </li>
          </ul>
        </Section>

        <Section title="Small and frequent beats large and scheduled">
          <Prose>
            <p>
              A deploy containing one change has one suspect when something
              breaks. A deploy containing thirty changes has thirty, and you
              will bisect under pressure while users are affected.
            </p>
            <p>
              Merge to <InlineCode text="`main`" />, the CI/CD pipeline builds
              and promotes. The whole ceremony is a squash merge.
            </p>
          </Prose>
        </Section>

        <Section title="The asymmetry that governs everything">
          <div className="grid gap-3 sm:grid-cols-2">
            <Card>
              <p className="t-label text-go">Code</p>
              <p className="mt-2 text-sm leading-6 text-muted">
                Rolls back in seconds. Promoting a previous deployment is
                near-instant.
              </p>
            </Card>
            <Card>
              <p className="t-label text-danger">Data</p>
              <p className="mt-2 text-sm leading-6 text-muted">
                Does not roll back at all. A dropped column means the data is
                gone &mdash; rolling back the code leaves new-schema data and
                old-schema expectations.
              </p>
            </Card>
          </div>
          <Prose>
            <p>
              This asymmetry is why migrations get their own careful process and
              code deploys do not.
            </p>
          </Prose>
        </Section>
      </div>
    ),
  },

  /* ---- Panel 2: migrations ---- */
  {
    id: 'migrations',
    label: 'Migrations',
    hint: 'Expand, migrate, contract',
    content: (
      <div className="space-y-16">
        <Section title="Expand, migrate, contract">
          <Prose>
            <p>
              Never change schema and code in one deploy. Split every
              destructive change into three deploys, each independently safe.
            </p>
            <p>
              <strong>
                Renaming <InlineCode text="`users.name`" /> to{' '}
                <InlineCode text="`users.full_name`" />:
              </strong>
            </p>
          </Prose>
          <Figure
            n={1}
            caption="Three deploys to rename a column. At no point can a rollback corrupt anything. Wait at least a day between them."
          >
            <AnnotatedArtifact artifact={MIGRATION_ARTIFACT} />
          </Figure>
          <Prose>
            <p>
              The same <Term id="expand-contract">pattern</Term> covers:
              dropping columns, renaming tables, tightening constraints,
              changing types. Anything where old code and new schema must
              coexist &mdash; which, during any deploy, they always do.
            </p>
          </Prose>
          <Callout kind="warn" title="Batch large backfills">
            <p>
              A single <InlineCode text="`UPDATE`" /> over ten million rows
              takes a lock and stalls the application. Chunk it: update 1,000
              rows, sleep 100ms, repeat. Slower in wall-clock, invisible to
              users.
            </p>
          </Callout>
        </Section>

        <Section title="Migrations run separately from the build">
          <Prose>
            <p>
              Do not run migrations in the Next.js build step. Builds run
              multiple times, in parallel, and get retried &mdash; none of which
              you want for schema changes.
            </p>
            <p>
              Run them as a deliberate step before promoting. Because of
              expand/migrate/contract, running the migration <em>before</em> the
              code deploy is safe: the schema change is always backward
              compatible with the code currently running.
            </p>
          </Prose>
        </Section>
      </div>
    ),
  },

  /* ---- Panel 3: vercel ---- */
  {
    id: 'vercel',
    label: 'Vercel',
    hint: 'Skew protection + rollback',
    content: (
      <div className="space-y-16">
        <Section title="On Vercel, two mechanisms make deploys routine">
          <Prose>
            <p>
              When you deploy, browsers mid-session are still running the
              previous build&rsquo;s JavaScript. They will request assets and
              call server actions from a version that no longer exists.
            </p>
            <p>
              Enable <Term id="skew-protection">skew protection</Term> in
              Vercel. Without it, every deploy hands an error to every active
              user &mdash; a class of bug that is invisible to you (your browser
              is always freshly loaded) and consistently reported by users as
              &ldquo;it randomly broke.&rdquo;
            </p>
          </Prose>
        </Section>

        <Section title="Know this cold">
          <Prose>
            <p>
              Know these commands before you need them. Practise on a preview
              deployment, not in production for the first time at 3am.
            </p>
          </Prose>
          <Card className="overflow-x-auto">
            <pre className="text-sm leading-7">
              <code>
                <span className="text-muted">
                  {'# to the previous production deployment\n'}
                </span>
                {'vercel rollback\n\n'}
                <span className="text-muted">{'# list deployments\n'}</span>
                {'vercel ls\n\n'}
                <span className="text-muted">
                  {'# promote a specific one\n'}
                </span>
                {'vercel promote <deployment-url>'}
              </code>
            </pre>
          </Card>
        </Section>

        <Section title="Roll back first, diagnose second">
          <Prose>
            <p>
              The instinct to find the bug before reverting is the wrong order
              &mdash; every minute spent diagnosing is a minute users stay
              broken. Revert, then investigate calmly on a branch.
            </p>
          </Prose>
          <Callout kind="warn" title="Contract migrations block rollback">
            <p>
              If the deploy included a contract-phase migration,{' '}
              <Term id="rollback">rollback</Term> is not safe. That is exactly
              why contract deploys are separated and small: when the risky
              deploy contains only a <InlineCode text="`DROP COLUMN`" /> and
              nothing else, you know precisely what you are dealing with.
            </p>
          </Callout>
        </Section>
      </div>
    ),
  },

  /* ---- Panel 4: aws ---- */
  {
    id: 'aws',
    label: 'AWS / ECS',
    hint: 'Pipeline, rolling, blue/green',
    content: (
      <div className="space-y-16">
        <Section title="The pipeline">
          <Prose>
            <p>
              A push to <InlineCode text="`main`" /> triggers a GitHub Actions
              workflow that builds a Docker image, pushes it to ECR, renders a
              new task definition, and tells ECS to deploy it. No long-lived
              secrets: GitHub mints an OIDC token and AWS STS exchanges it for
              temporary credentials.
            </p>
          </Prose>
          <Figure
            n={2}
            caption="Six steps from push to stable. The pivot is wait-for-service-stability — without it, the pipeline reports success while the circuit breaker silently rolls back."
          >
            <AnnotatedArtifact artifact={PIPELINE_ARTIFACT} />
          </Figure>
        </Section>

        <Section title="Rolling updates">
          <Prose>
            <p>
              The ECS default is a{' '}
              <Term id="rolling-deployment">rolling deployment</Term>: new tasks
              start alongside old tasks, pass health checks, and then old tasks
              drain. Two numbers govern it:{' '}
              <InlineCode text="`minimumHealthyPercent`" /> (how many old tasks
              must stay up during the switch) and{' '}
              <InlineCode text="`maximumPercent`" /> (how many total tasks can
              exist at once).
            </p>
          </Prose>
          <Card className="overflow-x-auto">
            <pre className="text-sm leading-7">
              <code>
                <span className="text-muted">
                  {'// deploymentConfiguration\n'}
                </span>
                {JSON.stringify(
                  {
                    minimumHealthyPercent: ROLLING_CONFIG.minimumHealthyPercent,
                    maximumPercent: ROLLING_CONFIG.maximumPercent,
                    deploymentCircuitBreaker: CIRCUIT_BREAKER_CONFIG,
                  },
                  null,
                  2,
                )}
              </code>
            </pre>
          </Card>
          <Prose>
            <p>
              Enable the{' '}
              <Term id="deployment-circuit-breaker">
                deployment circuit breaker
              </Term>{' '}
              on every service. Without it, a bad image loops through
              start-crash-restart indefinitely and ECS never stops trying.
            </p>
          </Prose>
        </Section>

        <Section title="Blue/green and traffic shifting">
          <Prose>
            <p>
              For services where rolling updates are too coarse, ECS supports{' '}
              <Term id="blue-green-deployment">blue/green deployments</Term> —
              natively with <code>bakeTimeInMinutes</code> for simplicity, or
              through CodeDeploy for teams that need lifecycle hooks. Either
              way, traffic shifts from the old target group to the new one
              according to a preset schedule.
            </p>
          </Prose>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-line">
                  <th className="py-2 pr-4 text-left font-medium">Strategy</th>
                  <th className="py-2 text-left font-medium">Pattern</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {STRATEGIES.map((s) => (
                  <tr key={s.id}>
                    <td className="py-2 pr-4 font-mono text-xs">{s.name}</td>
                    <td className="py-2 text-muted">{s.pattern}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Prose>
            <p>
              Both canary and linear strategies integrate with CloudWatch
              alarms. Attach up to ten alarms &mdash; error rate, latency p99,
              custom business metrics &mdash; and if any alarm fires during the
              shift, the deployment stops and traffic reverts automatically.
            </p>
          </Prose>
          <Prose>
            <p>
              <Term id="canary">Canary</Term> strategies send a small slice of
              traffic first and wait, catching failures before the full fleet
              switches. Linear strategies widen gradually instead of jumping
              from the canary slice to 100%.
            </p>
          </Prose>
        </Section>
      </div>
    ),
  },

  /* ---- Panel 5: aws-ops ---- */
  {
    id: 'aws-ops',
    label: 'AWS Ops',
    hint: 'Rollback and costs',
    content: (
      <div className="space-y-16">
        <Section title="Rollback on AWS">
          <Prose>
            <p>Three paths, depending on what you deployed with.</p>
            <p>
              <strong>Rolling update:</strong> the{' '}
              <Term id="deployment-circuit-breaker">
                deployment circuit breaker
              </Term>{' '}
              handles it automatically if enabled. Manual rollback:
            </p>
          </Prose>
          <Card className="overflow-x-auto">
            <pre className="text-sm leading-7">
              <code>
                {'aws ecs update-service \\\n'}
                {'  --cluster my-cluster \\\n'}
                {'  --service my-service \\\n'}
                {'  --task-definition my-task:PREVIOUS_REVISION'}
              </code>
            </pre>
          </Card>
          <Prose>
            <p>
              <strong>Blue/green (ECS-native):</strong> during the bake time,{' '}
              <Term id="rollback">rollback</Term> reverts the ALB to the blue
              target group. After bake time ends and blue terminates, rollback
              is a new deployment &mdash; same as rolling.
            </p>
            <p>
              <strong>CodeDeploy:</strong> stop the deployment or let a
              CloudWatch alarm stop it. Traffic reverts to the original task
              set.
            </p>
          </Prose>
          <Card className="overflow-x-auto">
            <pre className="text-sm leading-7">
              <code>
                {'aws deploy stop-deployment --deployment-id d-XXXXXXXXX'}
              </code>
            </pre>
          </Card>
          <Callout
            kind="warn"
            title="Roll back first, diagnose second — on any platform"
          >
            <p>
              The same rule from the Vercel section applies universally. The
              AWS-specific nuance: &ldquo;roll back&rdquo; might mean waiting
              for a rolling update to complete, which takes minutes rather than
              seconds. Blue/green reverts are instant during the bake window.
            </p>
          </Callout>
        </Section>

        <Section title="Costs Vercel hides">
          <Prose>
            <p>
              Vercel bundles routing, TLS, load balancing, compute, and egress
              into a single price. On AWS, each layer bills separately. A
              minimal ECS Fargate service in US East costs roughly $85&ndash;200
              per month before your application does anything interesting.
            </p>
          </Prose>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-line">
                  <th className="py-2 pr-4 text-left font-medium">Service</th>
                  <th className="py-2 pr-4 text-right font-medium">
                    Low&nbsp;$/mo
                  </th>
                  <th className="py-2 pr-4 text-right font-medium">
                    High&nbsp;$/mo
                  </th>
                  <th className="py-2 text-left font-medium">
                    On Vercel, included in
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {AWS_COSTS.map((row) => (
                  <tr key={row.id}>
                    <td className="py-2 pr-4 font-medium">{row.service}</td>
                    <td className="py-2 pr-4 text-right font-mono text-xs">
                      ${row.low}
                    </td>
                    <td className="py-2 pr-4 text-right font-mono text-xs">
                      ${row.high}
                    </td>
                    <td className="py-2 text-muted">{row.vercelIncludes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Callout kind="warn" title="NAT Gateway is the surprise">
            <p>
              Every AWS API call from a private subnet goes through the NAT
              Gateway at $0.045/GB. ECR image pulls, CloudWatch log writes, SSM
              parameter reads &mdash; all NAT traffic unless you create VPC
              endpoints for those services.
            </p>
          </Callout>
        </Section>
      </div>
    ),
  },

  /* ---- Panel 6: flags ---- */
  {
    id: 'flags',
    label: 'Feature flags',
    hint: 'Decouple deploy from release',
    content: (
      <div className="space-y-16">
        <Section title="Feature flags decouple deploy from release">
          <Prose>
            <p>
              For anything large or risky, ship the code disabled and turn it on
              separately. Edge Config reads are fast enough to call per request.
              Now &ldquo;release&rdquo; is a config toggle, turning off takes
              seconds and needs no deploy, and you can enable for yourself
              first.
            </p>
          </Prose>
          <Card className="overflow-x-auto">
            <pre className="text-sm leading-7">
              <code>
                <span className="text-muted">{'// src/lib/flags.ts\n'}</span>
                {
                  'export async function isEnabled(flag: string, userId?: string) {\n'
                }
                {'  const config = await getEdgeConfig()\n'}
                {'  const rule = config.flags[flag]\n'}
                {'  if (!rule) return false\n'}
                {'  if (rule.enabled === true) return true\n'}
                {"  return rule.allowlist?.includes(userId ?? '') ?? false\n"}
                {'}'}
              </code>
            </pre>
          </Card>
          <Prose>
            <p>
              Delete <Term id="feature-flag">flags</Term> once a feature is
              fully rolled out. Stale flags are dead branches that accumulate
              until nobody knows which combinations are still real.
            </p>
          </Prose>
        </Section>
      </div>
    ),
  },

  /* ---- Panel 7: ai ---- */
  {
    id: 'ai',
    label: 'AI in Deployment',
    hint: 'Mechanical coverage, not judgment',
    content: (
      <div className="space-y-16">
        <Section title="AI in production deployment">
          <AIPlays />
        </Section>
      </div>
    ),
  },

  /* ---- Panel 8: traps ---- */
  {
    id: 'traps',
    label: 'Traps',
    hint: 'The mistakes that look like normal work',
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
              AWS-specific traps (4)
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
          <DeploymentChecklist />
        </Section>

        <References slug="13-production-deployment" />
      </div>
    ),
  },
]

export function ProductionDeployment() {
  return <Stepper steps={CONTENT_STEPS} />
}
