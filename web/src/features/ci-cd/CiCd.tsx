import { Stepper, type Step } from '@/components/Stepper'
import { AnnotatedArtifact } from '@/components/AnnotatedArtifact'
import { Figure } from '@/components/Figure'
import { References } from '@/components/References'
import { RevealList } from '@/components/RevealList'
import { RevealFacet } from '@/components/RevealFacet'
import { InlineCode } from '@/components/InlineCode'
import { Term } from '@/components/Term'
import { Callout, Contrast, Prose, Section } from '@/components/ui'
import { TeamNotes } from '@/components/TeamNotes'
import type { StepId } from './steps'
import { CI_ARTIFACT } from './ci-artifact'
import { E2E_ARTIFACT } from './e2e-artifact'
import { DEPENDABOT_ARTIFACT } from './dependabot-artifact'
import { TRAPS } from './traps'
import { SCALING_MOVES } from './scaling'
import { OrderingExercise } from './OrderingExercise'
import { AIPlays } from './AIPlays'

const CONTENT_STEPS: (Step & { id: StepId })[] = [
  {
    id: 'gate',
    label: 'The Gate',
    hint: 'Actions is the gate; Vercel is the deployer',
    content: (
      <div className="space-y-16">
        <Section eyebrow="Step 01" title="The division of labor">
          <Prose>
            <p>
              Two systems, two jobs, and keeping them separate is what keeps
              both understandable. <Term id="merge-gate">GitHub Actions</Term>{' '}
              is the gate — it decides whether code is allowed into{' '}
              <InlineCode text="`main`" />. Vercel is the deployer — it builds
              and ships every push, with no configuration.
            </p>
          </Prose>
          <Callout kind="info" title="Do not build deployment in Actions">
            Vercel&rsquo;s Git integration already does it, does it faster with
            warm caches, and gives you preview URLs for free. Actions exists to
            say yes or no.
          </Callout>
          <Figure
            n={1}
            caption="The CI workflow — the merge gate that says yes or no."
          >
            <AnnotatedArtifact artifact={CI_ARTIFACT} />
          </Figure>
        </Section>
      </div>
    ),
  },
  {
    id: 'ordering',
    label: 'Cheapest First',
    hint: 'Why the order matters more than the checks',
    content: (
      <div className="space-y-16">
        <Section eyebrow="Step 02" title="Ordering: cheapest failure first">
          <Prose>
            <p>
              Format, lint, typecheck, test, build — in that order,
              deliberately. Lint fails in seconds, typecheck in a few more,
              tests in a minute, build last. Putting the build first means
              waiting two minutes to learn about a formatting error.
            </p>
          </Prose>
          <Figure
            n={2}
            caption="Arrange these CI steps in the order that fails cheapest first."
          >
            <OrderingExercise />
          </Figure>
          <Contrast
            bad="Build first — wait 2 minutes to learn about a missing semicolon."
            good="Format first — 3 seconds to the same answer."
          />
          <Prose>
            <p>
              Sequential steps in one job, not parallel jobs. Parallel jobs each
              pay the checkout-and-install cost, which for a pipeline this size
              exceeds what parallelism saves. Revisit that when the suite passes
              roughly five minutes.
            </p>
          </Prose>
        </Section>
      </div>
    ),
  },
  {
    id: 'e2e',
    label: 'End-to-End',
    hint: 'Test the real deployment, not a dev server',
    content: (
      <div className="space-y-16">
        <Section eyebrow="Step 03" title="End-to-end tests">
          <Prose>
            <p>
              E2E is slow and flakier than unit tests, so it does not belong in
              the same job blocking every push. Run it against the actual
              preview deployment, triggered by the{' '}
              <Term id="deployment-status">deployment status</Term> event.
            </p>
          </Prose>
          <Figure
            n={3}
            caption="The E2E workflow — tests the real preview URL, not a dev server."
          >
            <AnnotatedArtifact artifact={E2E_ARTIFACT} />
          </Figure>
          <Prose>
            <p>
              The trigger means these run after Vercel finishes, against the
              real preview URL — a real build, real edge network, real database.
              That is a meaningfully better signal than testing a dev server.
            </p>
            <p>
              Uploading the report on failure matters. A failed E2E run with no
              trace is a debugging session that starts from nothing;
              Playwright&rsquo;s trace viewer starts you at the failing step
              with a DOM snapshot.
            </p>
          </Prose>
        </Section>
      </div>
    ),
  },
  {
    id: 'protection',
    label: 'Branch Protection',
    hint: 'The pipeline is decoration until this is on',
    content: (
      <div className="space-y-16">
        <Section eyebrow="Step 04" title="Branch protection">
          <Prose>
            <p>
              The pipeline is decoration until{' '}
              <Term id="branch-protection">branch protection</Term> is on.
            </p>
          </Prose>
          <Callout
            kind="warn"
            title="GitHub Free only enforces on public repos"
          >
            On a private repo the ruleset saves, shows a banner, and never
            fires. Enforcement on private repos needs Pro, Team, or Enterprise.
            Check that your plan actually enforces what you just configured,
            because the setting looks identical either way.
          </Callout>
          <RevealList
            idPrefix="protection"
            rows={[
              {
                id: 'status-checks',
                title: 'Required status checks',
                summary: 'The verify job must pass before merging.',
                body: (
                  <div className="space-y-2">
                    <RevealFacet label="what it prevents" tone="blueprint">
                      Merging code that breaks the build, fails tests, or has
                      lint errors.
                    </RevealFacet>
                    <RevealFacet label="the catch" tone="warn">
                      The check name must match the job name in your workflow
                      exactly. A rename in the YAML silently disconnects the
                      rule.
                    </RevealFacet>
                  </div>
                ),
              },
              {
                id: 'up-to-date',
                title: 'Up-to-date branches',
                summary:
                  'The PR branch must include the latest from the target.',
                body: (
                  <div className="space-y-2">
                    <RevealFacet label="what it prevents" tone="blueprint">
                      Two PRs that are each green independently but break when
                      merged together.
                    </RevealFacet>
                    <RevealFacet label="the catch" tone="warn">
                      Requires a fresh CI run after every rebase, even if no
                      code changed. On a busy repo, this creates a queue — which
                      is when you add a{' '}
                      <Term id="merge-queue">merge queue</Term>.
                    </RevealFacet>
                  </div>
                ),
              },
              {
                id: 'linear-history',
                title: 'Linear history and auto-merge',
                summary:
                  'Squash or rebase only. Approve a PR, let it merge itself.',
                body: (
                  <div className="space-y-2">
                    <RevealFacet label="what it prevents" tone="blueprint">
                      Merge commits that make history unreadable and bisect
                      useless.
                    </RevealFacet>
                    <RevealFacet label="auto-merge" tone="go">
                      Approve a PR, enable auto-merge, stop babysitting. It
                      merges itself when checks go green.
                    </RevealFacet>
                  </div>
                ),
              },
              {
                id: 'secrets',
                title: 'Secrets and OIDC',
                summary: 'Short-lived credentials, not long-lived tokens.',
                body: (
                  <div className="space-y-2">
                    <RevealFacet label="the rule" tone="blueprint">
                      Secrets live in GitHub Actions secrets and Vercel
                      environment variables. Never in the repository, never in
                      workflow files, never echoed to logs.
                    </RevealFacet>
                    <RevealFacet label="prefer OIDC" tone="go">
                      Prefer <Term id="oidc">OIDC</Term> over long-lived tokens
                      where the provider supports it — short-lived credentials
                      minted per run cannot leak from a config file that no
                      longer holds them.
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
  {
    id: 'deps',
    label: 'Dependencies',
    hint: 'Grouped updates, not fifteen PRs a week',
    content: (
      <div className="space-y-16">
        <Section eyebrow="Step 05" title="Dependency updates">
          <Prose>
            <p>
              Grouping is what makes this survivable. Ungrouped, you get fifteen
              pull requests a week, stop reading them, and the automation
              becomes noise you route around. Grouped, you get two: one for dev
              dependencies (merge if CI is green) and one for production minors
              (skim the changelogs). Majors arrive individually, which is
              correct — they deserve attention.
            </p>
          </Prose>
          <Figure
            n={4}
            caption="Grouped Dependabot — two PRs a week instead of fifteen."
          >
            <AnnotatedArtifact artifact={DEPENDABOT_ARTIFACT} />
          </Figure>
          <Contrast
            bad="Ungrouped: fifteen PRs a week → zero PRs read. Worse than no automation, because you believe you are covered."
            good="Grouped: two PRs — dev deps (merge if green) and production minors (skim changelogs). Majors arrive individually."
          />
        </Section>
      </div>
    ),
  },
  {
    id: 'scaling',
    label: 'Scaling',
    hint: 'When a solo pipeline meets a team',
    content: (
      <div className="space-y-16">
        <Section eyebrow="Step 06" title="Scaling to a team">
          <Prose>
            <p>
              Five practices that a solo pipeline does not need — and the
              trigger that tells you when each one starts earning its cost.
            </p>
          </Prose>
          <RevealList
            idPrefix="scaling"
            rows={SCALING_MOVES.map((move) => ({
              id: move.id,
              title: move.title,
              summary: move.trigger,
              body: (
                <div className="space-y-2">
                  <RevealFacet label="what it does" tone="blueprint">
                    {move.reason}
                  </RevealFacet>
                  <RevealFacet label="why not sooner" tone="warn">
                    {move.whyNotSooner}
                  </RevealFacet>
                </div>
              ),
            }))}
          />
          <TeamNotes>
            <p>
              The five moves above are the team scaling path. A solo developer
              running this playbook needs none of them until the trigger fires.
            </p>
          </TeamNotes>
        </Section>
      </div>
    ),
  },
  {
    id: 'ai',
    label: 'AI Plays',
    hint: 'Where agents help and where they mislead',
    content: (
      <div className="space-y-16">
        <Section eyebrow="Step 07" title="AI in CI/CD">
          <AIPlays />
        </Section>
      </div>
    ),
  },
  {
    id: 'traps',
    label: 'Traps',
    hint: 'The failures that look like someone else’s problem',
    content: (
      <div className="space-y-16">
        <Section eyebrow="Step 08" title="Traps">
          <Prose>
            <p>
              Nine failure modes, each of which looks like someone else&rsquo;s
              problem until it is yours.
            </p>
          </Prose>
          <div className="space-y-4">
            {TRAPS.map((trap) => (
              <Callout key={trap.id} kind="trap" title={trap.title}>
                <p>
                  <InlineCode text={trap.body} />
                </p>
              </Callout>
            ))}
          </div>
          <References slug="11-ci-cd" />
        </Section>
      </div>
    ),
  },
]

export default function CiCd() {
  return <Stepper steps={CONTENT_STEPS} />
}
