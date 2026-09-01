import Link from 'next/link'
import { GitBranch, Hammer, Link2, Trash2 } from 'lucide-react'
import { Stepper, type Step } from '@/components/Stepper'
import { Callout, Prose, Section } from '@/components/ui'
import { Term } from '@/components/Term'
import { InlineCode } from '@/components/InlineCode'
import { RevealList } from '@/components/RevealList'
import { AnnotatedArtifact } from '@/components/AnnotatedArtifact'
import { Figure } from '@/components/Figure'
import { References } from '@/components/References'
import { getStage } from '@/lib/stages'
import { PreviewOrStaging } from './PreviewOrStaging'
import { CHECKLIST_CATEGORIES } from './checklist-items'
import { SEED_ARTIFACT } from './seed-data'
import { AIPlays } from './AIPlays'
import { TRAPS } from './traps'
import { StagingChecklist } from './StagingChecklist'
import type { StepId } from './steps'

const stageLinkClass = 'underline hover:text-brand'

function stageTitle(slug: string) {
  return getStage(slug)?.title ?? slug
}

/**
 * The Neon–Vercel branching lifecycle, as a minimal step flow rather than a
 * schematic. Five nodes, matching "Databases for previews": the doc names a
 * git push, an isolated branch created from production, migrations run
 * during the build, the preview URL live against that branch, and the branch
 * cleaned up when the git branch goes away. Kept to icons and short labels —
 * an SVG here would draw the same five boxes with more code and no clearer
 * claim.
 */
function NeonLifecycle() {
  const nodes = [
    {
      Icon: GitBranch,
      label: 'Branch pushed',
      detail: 'A pull request opens or a commit lands on it.',
    },
    {
      Icon: GitBranch,
      label: 'Neon branches the database',
      detail: (
        <>
          <InlineCode text="preview/<git-branch>" /> — a copy-on-write branch
          from production, created automatically by the integration.
        </>
      ),
    },
    {
      Icon: Hammer,
      label: 'Build runs migrations',
      detail: <InlineCode text="npx prisma migrate deploy && npm run build" />,
    },
    {
      Icon: Link2,
      label: 'Preview URL goes live',
      detail: (
        <>
          Vercel injects <InlineCode text="DATABASE_URL" /> pointing at the
          branch — no application code changes.
        </>
      ),
    },
    {
      Icon: Trash2,
      label: 'Branch cleans up',
      detail: 'Deleting the git branch deletes the database branch with it.',
    },
  ]

  return (
    <ol className="grid gap-3 sm:grid-cols-5">
      {nodes.map((n, i) => (
        <li
          key={n.label}
          className="flex flex-col gap-1.5 border border-line bg-sunken px-3.5 py-3"
        >
          <div className="flex items-center gap-2">
            <span className="grid size-6 shrink-0 place-items-center bg-raised text-subtle">
              <n.Icon className="size-3.5" aria-hidden />
            </span>
            <span className="t-label text-subtle">
              {String(i + 1).padStart(2, '0')}
            </span>
          </div>
          <p className="text-sm font-medium text-fg">{n.label}</p>
          <p className="text-[0.8125rem] leading-5 text-muted">{n.detail}</p>
        </li>
      ))}
    </ol>
  )
}

const CONTENT_STEPS: (Step & { id: StepId })[] = [
  /* ---- Panel 1: preview ---- */
  {
    id: 'preview',
    label: 'Preview or staging?',
    hint: 'Two different tools, easily conflated',
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
            <li>The change is complete enough to exercise end to end</li>
            <li>
              Preview deploys are producing URLs (
              <Link href="/stages/04-project-setup" className={stageLinkClass}>
                {stageTitle('04-project-setup')}
              </Link>
              )
            </li>
          </ul>
        </Section>

        <Section title="Preview deployments are not staging">
          <Prose>
            <p>
              Worth being precise about, because conflating them causes real
              mistakes.
            </p>
            <p>
              A <Term id="preview-deployment">preview deployment</Term>:
              per-branch, ephemeral, and automatic. Every pull request gets one.
              This is where nearly all pre-production verification happens.
            </p>
            <p>
              A <Term id="staging-environment">staging environment</Term>, by
              contrast, is a single long-lived deployment tracking a shared
              branch. It matters when you need one stable URL to point at
              &mdash; a third party integrating against you, a stakeholder who
              cannot handle a new link each time, or a sandbox account with an
              external provider.
            </p>
            <p>
              <strong>Solo, you usually do not need staging.</strong> Preview
              deployments cover the need, and a long-lived staging environment
              is a second production to maintain, with its own drift, its own
              broken data, and its own confusing failures. Add it when something
              concrete demands a stable URL. Not before.
            </p>
          </Prose>
        </Section>

        <Section title="Which one does this need?">
          <Prose>
            <p>
              Five situations, each needing a preview deployment or a staging
              environment. Pick before revealing the reasoning.
            </p>
          </Prose>
          <PreviewOrStaging />
        </Section>
      </div>
    ),
  },

  /* ---- Panel 2: database ---- */
  {
    id: 'database',
    label: 'Databases for Previews',
    hint: 'Branch it — never point at production',
    content: (
      <div className="space-y-16">
        <Section title="Never point a preview at production">
          <Prose>
            <p>
              The default question: does the preview point at production data?{' '}
              <strong>No.</strong> Not once real users exist. A migration tested
              against production data is a migration that can destroy production
              data, and preview environments get treated casually by definition.
            </p>
          </Prose>
        </Section>

        <Section title="The Neon branching lifecycle">
          <Prose>
            <p>
              With <Term id="database-branching">database branching</Term>, the
              Neon&ndash;Vercel integration does this automatically. On every
              preview deployment, Neon creates an isolated branch from your
              production database &mdash; no application code changes needed.
            </p>
          </Prose>
          <Figure
            n={1}
            caption="A per-preview database branch, from push to cleanup. The branch is copy-on-write from production's schema and data, so a destructive migration in step 3 costs nothing outside the branch."
          >
            <NeonLifecycle />
          </Figure>
          <Prose>
            <p>
              Because the branch starts as a copy of production&rsquo;s schema,
              run migrations during the build so the preview reflects the
              changes in that commit. Set this in Vercel&rsquo;s Build Command
              (Settings &rarr; General &rarr; Build &amp; Development).
            </p>
            <p>
              This is the single highest-value thing in this stage. A
              per-preview database branch means you can run destructive
              migrations, seed weird data, and delete everything &mdash; with a
              production-shaped dataset and no risk to production.
            </p>
            <p>
              If branching is unavailable, use a seeded scratch database. A tiny
              seeded dataset is worse for catching data-shaped bugs than a
              branch, but far better than pointing at production.
            </p>
          </Prose>
        </Section>

        <Section title="Seed data that is not sterile">
          <Prose>
            <p>
              The strongest argument for database branching is that seeded data
              is always too clean. Real data has names with apostrophes, empty
              descriptions, records from 2019, users with no avatar, and one
              account with 400 line items that breaks your table layout.
            </p>
            <p>
              Every line below has broken a layout or a query somewhere. Seeding{' '}
              <InlineCode text="`Alice`, `Bob`, and `Carol`" /> tests nothing.
            </p>
          </Prose>
          <AnnotatedArtifact artifact={SEED_ARTIFACT} />
        </Section>
      </div>
    ),
  },

  /* ---- Panel 3: checklist ---- */
  {
    id: 'checklist',
    label: 'The Preview Checklist',
    hint: 'What machines are bad at',
    content: (
      <div className="space-y-16">
        <Section title="The preview checklist">
          <Prose>
            <p>
              CI already covered lint, types, tests, and build. Do not repeat
              machine work by hand. Check what machines are bad at &mdash; four
              questions, each with its own failure mode.
            </p>
          </Prose>
          <RevealList
            idPrefix="staging-checklist"
            rows={CHECKLIST_CATEGORIES}
          />
        </Section>
      </div>
    ),
  },

  /* ---- Panel 4: env ---- */
  {
    id: 'env',
    label: 'Environment Variables',
    hint: 'Scoping secrets, protecting URLs',
    content: (
      <div className="space-y-16">
        <Section title="Environment variables for previews">
          <Prose>
            <p>
              Preview deploys often need different credentials from production
              &mdash; a sandbox Stripe key, a test OAuth provider, a development
              webhook URL. Vercel scopes environment variables by environment:
              Production, Preview, and Development. Set preview-specific values
              under the Preview scope so they apply automatically to every
              preview deployment without touching production.
            </p>
            <p>
              The most common &ldquo;works locally, broken in preview&rdquo;
              cause is a missing or wrong environment variable. Two habits
              prevent it:
            </p>
          </Prose>

          <div className="space-y-4">
            <Callout kind="info" title="Add both at once">
              <p>
                When you add a new secret to production, add its preview
                equivalent in the same sitting. A variable that exists only in
                Production is invisible in every preview, and the failure looks
                like a code bug.
              </p>
            </Callout>
            <Callout kind="info" title="Use sandbox mode">
              <p>
                When a third-party integration offers a sandbox or test mode,
                use it for previews. A preview that hits the live Stripe API is
                a preview that can charge a real card.
              </p>
            </Callout>
          </div>
        </Section>

        <Section title="Password-protect previews">
          <Prose>
            <p>
              If the product is not public yet, or previews touch anything
              sensitive, enable Vercel&rsquo;s{' '}
              <Term id="deployment-protection">deployment protection</Term>.
              Preview URLs are unlisted, not secret &mdash; they end up in
              Slack, in issue trackers, and occasionally in search indexes.
            </p>
          </Prose>
        </Section>
      </div>
    ),
  },

  /* ---- Panel 5: ai ---- */
  {
    id: 'ai',
    label: 'AI in Staging',
    hint: 'Mechanical coverage, not judgment',
    content: (
      <div className="space-y-16">
        <Section title="AI in staging">
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
          {/* InlineCode wraps every trap body so that any body carrying
              backticks gets <code> spans. The five bodies without backticks
              pass through unchanged (InlineCode returns a plain Fragment
              when there is nothing to split). */}
          <div className="space-y-4">
            {TRAPS.map((trap) => {
              const pdvTitle = stageTitle('14-post-deployment-verification')
              const [before, after] = trap.body.includes(pdvTitle)
                ? trap.body.split(pdvTitle)
                : [trap.body, null]
              return (
                <Callout key={trap.id} kind="trap" title={trap.title}>
                  <p>
                    <InlineCode text={before} />
                    {after !== null && (
                      <>
                        <Link
                          href="/stages/14-post-deployment-verification"
                          className={stageLinkClass}
                        >
                          {pdvTitle}
                        </Link>
                        <InlineCode text={after} />
                      </>
                    )}
                  </p>
                </Callout>
              )
            })}
          </div>
        </Section>

        <Section title="Done">
          <StagingChecklist />
          <Callout kind="info" title="E2E against a preview URL in CI">
            <p>
              Wire the preview URL from Vercel&rsquo;s{' '}
              <InlineCode text="`repository_dispatch`" /> event (
              <InlineCode text="`github.event.client_payload.url`" />
              ). If deployment protection is on, set{' '}
              <InlineCode text="`x-vercel-protection-bypass`" /> from a{' '}
              <InlineCode text="`VERCEL_AUTOMATION_BYPASS_SECRET`" /> so
              Playwright can reach the page.
            </p>
          </Callout>
        </Section>

        <References slug="12-staging" />
      </div>
    ),
  },
]

export function Staging() {
  return <Stepper steps={CONTENT_STEPS} />
}
