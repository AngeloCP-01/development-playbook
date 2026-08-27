import Link from 'next/link'
import { Stepper, type Step } from '@/components/Stepper'
import { Callout, Contrast, Prose, Section } from '@/components/ui'
import { Figure } from '@/components/Figure'
import { RevealList, type RevealRow } from '@/components/RevealList'
import { RevealFacet } from '@/components/RevealFacet'
import { AnnotatedArtifact } from '@/components/AnnotatedArtifact'
import { getStage } from '@/lib/stages'
import { TriageDrill } from './TriageDrill'
import { LayerThread } from './LayerThread'
import { ARTIFACTS } from './artifacts'
import { PROBES } from './probes'
import { type StepId } from './steps'

/**
 * Cross-stage link titles this stage's prose renders inline — same device as
 * `Development.tsx`. `getStage` returns `undefined` for an unknown slug; the
 * `??` fallback keeps the render safe without an `as` cast or a `!` assertion
 * even though these two slugs are guaranteed present.
 */
const stageTitle = (slug: string) => getStage(slug)?.title ?? slug
const stageLinkClass =
  'text-brand underline underline-offset-2 hover:no-underline'

/**
 * F1: the doc's distribution, as a shape rather than a list. Descending
 * volume, one line each in the doc's own words — hand-authored here rather
 * than in a data module because nothing else in this feature needs these
 * four rows independently of this one figure (same reasoning as
 * `Development.tsx`'s `STUCK_MOVES`).
 *
 * Order matches `triage.ts`'s `OPTIONS`, which `triage.test.ts` already pins
 * as "the distribution, in descending volume" — unit, integration, e2e, none.
 */
type DistributionTier = {
  id: string
  volume: string
  label: string
  detail: string
  width: string
}

const DISTRIBUTION: DistributionTier[] = [
  {
    id: 'unit',
    volume: 'Many',
    label: 'Unit tests',
    detail: 'Pure functions, business logic, Zod schemas, calculations.',
    width: 'w-full',
  },
  {
    id: 'integration',
    volume: 'Some',
    label: 'Integration tests',
    detail: 'A Server Action end to end against a real test database.',
    width: 'w-2/3',
  },
  {
    id: 'e2e',
    volume: 'Few',
    label: 'E2E tests',
    detail: 'The critical paths only — sign up, log in, the money path.',
    width: 'w-1/3',
  },
  {
    id: 'component',
    volume: 'Almost none',
    label: 'Component tests',
    detail: 'Most React components are presentational.',
    width: 'w-1/6',
  },
]

/**
 * The five things the doc says not to test, hand-authored here for the same
 * reason as `DISTRIBUTION` above. `summary` is the doc's bold lead verbatim;
 * `body` is the sentence that follows it, also verbatim. `title` is a plain
 * label repeating the lead without its trailing full stop, since `RevealRow`
 * requires one and the doc's lead is naturally short enough to double as it.
 */
const RESTRAINT_ROWS: RevealRow[] = [
  {
    id: 'framework',
    title: 'Framework behavior',
    summary: 'Framework behavior.',
    body: (
      <RevealFacet label="Not your responsibility" tone="subtle">
        Next.js routing works. That is not your responsibility.
      </RevealFacet>
    ),
  },
  {
    id: 'type-level',
    title: 'Type-level guarantees',
    summary: 'Type-level guarantees.',
    body: (
      <RevealFacet label="Redundant the day it is written" tone="subtle">
        If TypeScript proves it, a test is redundant.
      </RevealFacet>
    ),
  },
  {
    id: 'implementation-details',
    title: 'Implementation details',
    summary: 'Implementation details.',
    body: (
      <RevealFacet label="Breaks on every refactor" tone="warn">
        Tests asserting internal state break on every refactor while catching
        nothing. Test behavior through the public interface.
      </RevealFacet>
    ),
  },
  {
    id: 'presentational',
    title: 'Trivial presentational components',
    summary: 'Trivial presentational components.',
    body: (
      <RevealFacet label="Covered incidentally" tone="subtle">
        Covered incidentally by E2E.
      </RevealFacet>
    ),
  },
  {
    id: 'third-party',
    title: 'Third-party libraries',
    summary: 'Third-party libraries.',
    body: (
      <RevealFacet label="Test your usage" tone="subtle">
        Test your usage, not their correctness.
      </RevealFacet>
    ),
  },
]

const CONTENT_STEPS: (Step & { id: StepId })[] = [
  {
    id: 'triage',
    label: 'If this breaks, how will I find out?',
    hint: 'Six changes, scored',
    content: (
      <div className="space-y-16">
        <Section eyebrow="Entry criteria" title="What has to be true first">
          <blockquote className="border-l-2 border-brand pl-5 text-lg leading-relaxed text-fg">
            Enough confidence to change code without fear, bought at the lowest
            maintenance cost you can manage.
          </blockquote>
          <Prose>
            <p className="mt-6">
              <span className="t-label text-subtle">
                When this actually happens —{' '}
              </span>
              During{' '}
              <Link href="/stages/05-development" className={stageLinkClass}>
                {stageTitle('05-development')}
              </Link>
              , usually before the code. Numbered after Development because that
              is where people look for it, not because it comes after.
            </p>
          </Prose>
          <ul className="mt-5 space-y-2">
            <li className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
              <span className="min-w-0 break-words text-sm leading-6 text-muted">
                Vitest and Playwright installed
              </span>
              <Link
                href="/stages/04-project-setup"
                className="t-label flex min-h-11 shrink-0 items-center border border-line px-1.5 py-0.5 text-brand transition-colors duration-150 hover:border-brand lg:min-h-9"
              >
                {stageTitle('04-project-setup')}
              </Link>
            </li>
            <li className="text-sm leading-6 text-muted">
              You can state what the code should do, specifically enough to
              assert on
            </li>
          </ul>
          <Prose>
            <p className="mt-4">
              That second criterion is the real one. If you cannot write the
              assertion, you do not yet know what you are building &mdash; and
              writing the test first is how you find that out cheaply.
            </p>
          </Prose>
        </Section>

        <Section
          eyebrow="The one question worth asking"
          title="Six changes, scored"
        >
          <Prose>
            <p>
              Not &ldquo;what is my coverage?&rdquo; but:{' '}
              <strong>if this breaks, how will I find out?</strong> Sort each
              change below by that question, not by habit.
            </p>
          </Prose>
          <div className="mt-5">
            <TriageDrill />
          </div>
        </Section>

        <Section eyebrow="The shape" title="Four tiers, in descending volume">
          <Figure
            n={1}
            caption="The distribution the six changes above were being sorted into — many unit tests, some integration tests, few E2E tests, almost no component tests."
          >
            <div className="divide-y divide-line border border-line">
              {DISTRIBUTION.map((tier) => (
                <div key={tier.id} className="p-4">
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="t-label text-fg">{tier.label}</span>
                    <span className="t-data text-sm text-subtle">
                      {tier.volume}
                    </span>
                  </div>
                  <div className="mt-2 h-1.5 bg-sunken">
                    <div
                      className={`h-full bg-brand ${tier.width}`}
                      aria-hidden
                    />
                  </div>
                  <p className="mt-2 text-sm leading-6 text-muted">
                    {tier.detail}
                  </p>
                </div>
              ))}
            </div>
          </Figure>
        </Section>
      </div>
    ),
  },
  {
    id: 'restraint',
    label: 'The tests not to write',
    hint: 'The coverage you already have',
    content: (
      <div className="space-y-16">
        <Section eyebrow="What not to test" title="The tests not to write">
          <Prose>
            <p>
              Deleting a bad test is as valuable as writing a good one. Expand
              each of the five for the sentence that follows it.
            </p>
          </Prose>
          <div className="mt-5">
            <RevealList idPrefix="restraint" rows={RESTRAINT_ROWS} />
          </div>
        </Section>

        <Section eyebrow="Coverage" title="A diagnostic, not a target">
          <div className="mt-5">
            <Contrast
              badLabel="Payment logic, 40%"
              goodLabel="Settings page, 40%"
              bad={
                <p>
                  Is a problem.
                  <span className="mt-2 block text-subtle">
                    The same number, over code that moves money, is a different
                    risk than the same number anywhere else.
                  </span>
                </p>
              }
              good={
                <p>
                  Probably is not.
                  <span className="mt-2 block text-subtle">
                    Read the report and ask whether anything important is
                    uncovered, not whether the percentage cleared a line.
                  </span>
                </p>
              }
            />
          </div>
          <Prose>
            <p className="mt-6">
              Coverage is useful as a diagnostic and useless as a target. A
              blanket threshold is satisfied by testing whatever is easiest,
              which is rarely whatever is riskiest.
            </p>
          </Prose>
        </Section>
      </div>
    ),
  },
  {
    id: 'unit',
    label: 'Underneath: the pure function',
    hint: 'Edge cases, and money in cents',
    content: (
      <div className="space-y-16">
        <Section
          eyebrow="One feature, three heights"
          title="Underneath: the pure function"
        >
          <Prose>
            <p>
              From here, one feature &mdash; a discounted checkout &mdash; runs
              through three altitudes: a pure function underneath, a Server
              Action one layer up, and the money path on top. They are one
              feature shown three ways, not three snippets that happen to share
              a domain.
            </p>
          </Prose>
          <Figure
            n={2}
            caption="One feature, three altitudes. Each layer's blind spot is the next layer's reason to exist."
          >
            <LayerThread />
          </Figure>
        </Section>

        <Section
          eyebrow="The test"
          title="Assert the arithmetic, then assert the edge"
        >
          <div className="mt-5">
            <AnnotatedArtifact artifact={ARTIFACTS.pricing} />
          </div>
          <Prose>
            <p className="mt-6">
              Money in integer cents, never floats.{' '}
              <code className="t-data break-words">0.1 + 0.2 !== 0.3</code> is a
              real bug that reaches real invoices.
            </p>
          </Prose>
        </Section>

        <Section
          eyebrow="Edge cases"
          title="Six questions, applied to one function"
        >
          <Prose>
            <p>
              The second test above is the more valuable one. Happy paths tend
              to work; edge cases are where bugs live. For each function, ask
              the same six questions.
            </p>
          </Prose>
          <div className="mt-5">
            <RevealList
              idPrefix="probes"
              rows={PROBES.map((probe) => ({
                id: probe.id,
                title: (
                  <code className="t-data break-words">{probe.input}</code>
                ),
                body: (
                  <RevealFacet label="Catches" tone="warn">
                    {probe.catches}
                  </RevealFacet>
                ),
              }))}
            />
          </div>
        </Section>
      </div>
    ),
  },
  {
    id: 'integration',
    label: 'One layer up: the action',
    hint: 'The second test, and why it matters most',
    content: (
      <div className="space-y-16">
        <Section eyebrow="One layer up" title="The same feature, one layer up">
          <Prose>
            <p>
              The same feature, one layer up: a Server Action end to end against
              a real database, rather than a pure function in isolation.
            </p>
          </Prose>
          <div className="mt-5">
            <AnnotatedArtifact artifact={ARTIFACTS.actions} />
          </div>
        </Section>

        <Section
          eyebrow="The one that matters most"
          title="Write the second test"
        >
          <div className="mt-5">
            <Callout kind="warn" title="The second test is not optional">
              Write the second test for every action that touches user-owned
              data. Authorization bugs are the most damaging class of bug in
              this kind of application and the easiest to introduce during a
              refactor. A test that proves an attacker is refused is worth more
              than a hundred tests of the happy path.
            </Callout>
          </div>
          <Prose>
            <p className="mt-6">
              Use a real Postgres instance, not mocks. Mocking the database
              tests your mock. Docker locally, a service container in CI.
            </p>
          </Prose>
        </Section>
      </div>
    ),
  },
  {
    id: 'e2e',
    label: 'On top: the money path',
    hint: 'Placeholder',
    content: (
      <Section title="Placeholder">
        <Prose>
          <p>Panel under construction.</p>
        </Prose>
      </Section>
    ),
  },
  {
    id: 'teeth',
    label: 'Proving a test bites',
    hint: 'Placeholder',
    content: (
      <Section title="Placeholder">
        <Prose>
          <p>Panel under construction.</p>
        </Prose>
      </Section>
    ),
  },
  {
    id: 'done',
    label: 'Done, and done on a team',
    hint: 'Placeholder',
    content: (
      <Section title="Placeholder">
        <Prose>
          <p>Panel under construction.</p>
        </Prose>
      </Section>
    ),
  },
]

export function Testing() {
  return <Stepper steps={CONTENT_STEPS} />
}
