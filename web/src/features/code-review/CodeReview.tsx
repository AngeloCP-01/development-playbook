import Link from 'next/link'
import { Stepper, type Step } from '@/components/Stepper'
import { Callout, Contrast, Prose, Section } from '@/components/ui'
import { Term } from '@/components/Term'
import { InlineCode } from '@/components/InlineCode'
import { RevealList } from '@/components/RevealList'
import { AnnotatedArtifact } from '@/components/AnnotatedArtifact'
import { References } from '@/components/References'
import { getStage } from '@/lib/stages'
import { SelfReviewMatch } from './SelfReviewMatch'
import { AREAS } from './review-areas'
import { CHECKLIST } from './checklist-items'
import { ReviewDrill } from './ReviewDrill'
import { PR_TEMPLATE } from './pr-template'
import { PRACTICES } from './team'
import { SeverityDrill } from './SeverityDrill'
import { AIPlays } from './AIPlays'
import { TRAPS } from './traps'
import { CodeReviewChecklist } from './CodeReviewChecklist'
import type { StepId } from './steps'

const stageLinkClass = 'underline hover:text-brand'

function stageTitle(slug: string) {
  return getStage(slug)?.title ?? slug
}

const CONTENT_STEPS: (Step & { id: StepId })[] = [
  /* ---- Panel 1: self-review ---- */
  {
    id: 'self-review',
    label: 'Creating Distance',
    hint: 'The discipline that makes self-review real',
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
            <li>The branch is rebased and history is clean</li>
            <li>The PR description explains why, not just what</li>
            <li>
              You have stepped away from the code for at least a few minutes
            </li>
          </ul>
        </Section>

        <Section title="Three techniques that change what you see">
          <Prose>
            <p>
              Solo, &ldquo;review&rdquo; sounds like theater. It is not &mdash;
              but it only works if you deliberately break the state that makes{' '}
              <Term id="self-review">self-review</Term> useless: you are still
              holding the intent in your head, so you read what you{' '}
              <em>meant</em> rather than what you <em>wrote</em>.
            </p>
          </Prose>
          <SelfReviewMatch />
        </Section>
      </div>
    ),
  },

  /* ---- Panel 2: what-to-find ---- */
  {
    id: 'what-to-find',
    label: 'What to Look For',
    hint: 'The seven areas machines cannot judge',
    content: (
      <div className="space-y-12">
        <Section title="What to actually look for">
          <Prose>
            <p>
              Automation handles formatting, types, and lint. Do not spend
              attention there. Look at what machines cannot judge:
            </p>
          </Prose>
          <RevealList
            idPrefix="review-areas"
            rows={AREAS.map((a) => ({
              id: a.id,
              title: <span className="font-semibold">{a.title}</span>,
              body: (
                <p>
                  <InlineCode text={a.body} />
                </p>
              ),
            }))}
          />
        </Section>

        <Section title="The checklist">
          <Prose>
            <p>Fast pass, in this order:</p>
          </Prose>
          <details className="group border border-line bg-sunken px-5 py-4">
            <summary className="flex cursor-pointer items-center justify-between text-sm font-medium text-fg">
              <span>Eleven checks, in order</span>
              <span className="t-label text-subtle group-open:hidden">
                Show
              </span>
              <span className="t-label hidden text-subtle group-open:inline">
                Hide
              </span>
            </summary>
            <ol className="mt-4 list-decimal space-y-1 pl-5 text-sm">
              {CHECKLIST.map((item) => (
                <li key={item.id}>
                  <InlineCode text={item.label} />
                </li>
              ))}
            </ol>
          </details>
        </Section>

        <Section title="Practice: find the issue">
          <Prose>
            <p>
              Each snippet below hides one issue from the checklist. Pick the
              category before seeing the answer.
            </p>
          </Prose>
          <ReviewDrill />
        </Section>
      </div>
    ),
  },

  /* ---- Panel 3: pr-discipline ---- */
  {
    id: 'pr-discipline',
    label: 'PR Discipline',
    hint: 'Descriptions, size, and testing the tests',
    content: (
      <div className="space-y-16">
        <Section title="PR descriptions">
          <Prose>
            <p>
              Write this before the review, not after. Articulating
              &ldquo;why&rdquo; is often when you notice the approach is wrong
              &mdash; and that is exactly the moment you want to notice.
            </p>
          </Prose>
          <AnnotatedArtifact artifact={PR_TEMPLATE} />
        </Section>

        <Section title="Size">
          <Prose>
            <p>
              <strong>Under 400 lines.</strong> Past that, review quality falls
              off a cliff &mdash; reviewers (including you) start skimming and
              approving on vibes.
            </p>
            <p>
              If a PR is genuinely large, split it: schema in one, backend in
              another, UI in a third. Each merges independently behind a flag.
            </p>
          </Prose>
          <Contrast
            bad={
              <div className="space-y-1 text-sm">
                <p className="font-semibold">1,200-line PR</p>
                <p>Feature + refactor + migration + test updates</p>
                <p className="text-subtle">Reviewer skims and approves</p>
              </div>
            }
            good={
              <div className="space-y-1 text-sm">
                <p className="font-semibold">Three PRs, ~400 lines each</p>
                <p>Schema migration → backend logic → UI component</p>
                <p className="text-subtle">
                  Each reviewed and reverted independently
                </p>
              </div>
            }
            badLabel="Bundled"
            goodLabel="Split"
          />
        </Section>

        <Section title="Test the tests">
          <Prose>
            <p>
              The most commonly skipped review step: confirm the test would fail
              without the fix. This is the{' '}
              <Term id="teeth-check">teeth check</Term> (
              <Link href="/stages/06-testing" className={stageLinkClass}>
                {stageTitle('06-testing')}
              </Link>
              ): break the implementation, run the test, watch it &mdash; and
              only it &mdash; fail, restore.
            </p>
            <p>
              If it still passes broken, it is not testing what you think. This
              takes twenty seconds and catches a surprising number of tests that
              assert nothing meaningful.
            </p>
          </Prose>
        </Section>
      </div>
    ),
  },

  /* ---- Panel 4: team ---- */
  {
    id: 'team',
    label: 'Scaling to a Team',
    hint: 'Severity, provenance, and team review culture',
    content: (
      <div className="space-y-16">
        <Section title="When review is someone else's job">
          <RevealList
            idPrefix="team-practices"
            rows={PRACTICES.map((p) => ({
              id: p.id,
              title: <span className="font-semibold">{p.title}</span>,
              body: (
                <p>
                  <InlineCode text={p.body} />
                </p>
              ),
            }))}
          />
        </Section>

        <Section title="Classify by severity">
          <Prose>
            <p>
              Label every review comment so the author knows what blocks the
              merge and what does not. Classify each comment below:
            </p>
          </Prose>
          <SeverityDrill />
        </Section>

        <Section title="Provenance and the duty to retract">
          <Prose>
            <p>
              Tag each finding with an ID (<code>C1</code>, <code>I1</code>,{' '}
              <code>M1</code>, <code>N1</code>) so follow-ups can reference it.
              Where <Term id="provenance">provenance</Term> matters, mark
              whether the finding is new, pre-existing (
              <code>PRE-EXISTING</code>), or introduced by the plan (
              <code>PLAN-AUTHORED ERROR</code>). The distinction changes who
              fixes it.
            </p>
            <p>
              A reviewer is expected to disprove as well as confirm. If you
              wrote &ldquo;this is a security issue&rdquo; and then discover it
              is not, say so and retract the finding &mdash; a retracted finding
              is more useful than a wrong one left standing.
            </p>
          </Prose>
        </Section>
      </div>
    ),
  },

  /* ---- Panel 5: ai ---- */
  {
    id: 'ai',
    label: 'AI in Code Review',
    hint: 'What AI catches, what it misses, and the human+AI split',
    content: (
      <div className="space-y-16">
        <Section title="AI in code review">
          <AIPlays />
        </Section>

        <Section title="Automated review has a place">
          <Prose>
            <p>
              Static analysis and AI review tools catch a real class of issue
              &mdash; missing null checks, unhandled promise rejections, subtle
              logic inversions &mdash; and they never get tired or assume they
              already know what the code does.
            </p>
            <p>
              Use them as an <em>additional</em> pass, not a replacement. They
              are poor at judging whether the change was worth making, whether
              the abstraction fits the domain, or whether the authorization
              model is right. Those are the parts that matter most.
            </p>
          </Prose>
        </Section>
      </div>
    ),
  },

  /* ---- Panel 6: traps ---- */
  {
    id: 'traps',
    label: 'Traps',
    hint: 'The review mistakes that look like normal work',
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
          <CodeReviewChecklist />
        </Section>

        <References slug="07-code-review" />
      </div>
    ),
  },
]

export function CodeReview() {
  return <Stepper steps={CONTENT_STEPS} />
}
