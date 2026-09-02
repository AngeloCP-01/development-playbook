// web/src/features/production-deployment/ProductionDeployment.tsx
import Link from 'next/link'
import { Stepper, type Step } from '@/components/Stepper'
import { Callout, Card, Prose, Section } from '@/components/ui'
import { Term } from '@/components/Term'
import { InlineCode } from '@/components/InlineCode'
import { RevealList, type RevealRow } from '@/components/RevealList'
import { AnnotatedArtifact } from '@/components/AnnotatedArtifact'
import { Figure } from '@/components/Figure'
import { References } from '@/components/References'
import { getStage } from '@/lib/stages'
import { AIPlays } from './AIPlays'
import { MIGRATION_ARTIFACT } from './migration-artifact'
import { DeploymentChecklist } from './DeploymentChecklist'
import { TRAPS } from './traps'
import type { StepId } from './steps'

const stageLinkClass = 'underline hover:text-brand'

function stageTitle(slug: string) {
  return getStage(slug)?.title ?? slug
}

/* ------------------------------------------------------------------ */
/*  Step 3 (safety) data — two rows, inline because it is only two    */
/* ------------------------------------------------------------------ */

const SAFETY_ROWS: RevealRow[] = [
  {
    id: 'skew-protection',
    title: 'Skew protection',
    summary:
      'Browsers mid-session are still running the previous build’s JavaScript.',
    body: (
      <div className="space-y-3 text-sm leading-6 text-muted">
        <p>
          When you deploy, browsers mid-session are still running the previous
          build&rsquo;s JavaScript. They will request assets and call server
          actions from a version that no longer exists.
        </p>
        <p>
          Enable <Term id="skew-protection">skew protection</Term> in Vercel.
          Without it, every deploy hands an error to every active user &mdash; a
          class of bug that is invisible to you (your browser is always freshly
          loaded) and consistently reported by users as &ldquo;it randomly
          broke.&rdquo;
        </p>
      </div>
    ),
  },
  {
    id: 'feature-flags',
    title: 'Feature flags decouple deploy from release',
    summary: 'Ship the code disabled, toggle on separately.',
    body: (
      <div className="space-y-3 text-sm leading-6 text-muted">
        <p>
          For anything large or risky, ship the code disabled and turn it on
          separately. Edge Config reads are fast enough to call per request. Now
          &ldquo;release&rdquo; is a config toggle, turning off takes seconds
          and needs no deploy, and you can enable for yourself first.
        </p>
        <p>
          Delete <Term id="feature-flag">flags</Term> once a feature is fully
          rolled out. Stale flags are dead branches that accumulate until nobody
          knows which combinations are still real.
        </p>
      </div>
    ),
  },
]

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
              Merge to <InlineCode text="`main`" />, Vercel builds and promotes.
              The whole ceremony is a squash merge.
            </p>
          </Prose>
        </Section>

        <Section title="The asymmetry that governs everything">
          <div className="grid gap-3 sm:grid-cols-2">
            <Card>
              <p className="t-label text-go">Code</p>
              <p className="mt-2 text-sm leading-6 text-muted">
                Rolls back in seconds. Promoting a previous Vercel deployment is
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

  /* ---- Panel 3: safety ---- */
  {
    id: 'safety',
    label: 'Safety nets',
    hint: 'Skew protection + feature flags',
    content: (
      <div className="space-y-16">
        <Section title="Two mechanisms that make deploys routine">
          <Prose>
            <p>
              Deploying several times a day is safe only if two things are true:
              active users survive the switch, and risky features can be turned
              off without a deploy.
            </p>
          </Prose>
          <RevealList idPrefix="deployment-safety" rows={SAFETY_ROWS} />
        </Section>
      </div>
    ),
  },

  /* ---- Panel 4: rollback ---- */
  {
    id: 'rollback',
    label: 'Rollback',
    hint: 'Roll back first, diagnose second',
    content: (
      <div className="space-y-16">
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

  /* ---- Panel 5: ai ---- */
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

  /* ---- Panel 6: traps ---- */
  {
    id: 'traps',
    label: 'Traps',
    hint: 'The mistakes that look like normal work',
    content: (
      <div className="space-y-16">
        <Section title="Traps">
          <div className="space-y-4">
            {TRAPS.map((trap) => (
              <Callout key={trap.id} kind="trap" title={trap.title}>
                <p>
                  <InlineCode text={trap.body} />
                </p>
              </Callout>
            ))}
          </div>
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
