import { Stepper, type Step } from '@/components/Stepper'
import { Contrast, Prose, Section } from '@/components/ui'
import { Figure } from '@/components/Figure'
import { Term } from '@/components/Term'
import { RevealList } from '@/components/RevealList'
import { RevealFacet } from '@/components/RevealFacet'
import { AnnotatedArtifact } from '@/components/AnnotatedArtifact'
import { LoopFlow } from './LoopFlow'
import { ClientBoundary } from './ClientBoundary'
import { ARTIFACTS } from './artifacts'
import { type StepId } from './steps'

/**
 * Stage 05's thirteen panels.
 *
 * The stage goes `ready: true` before any of this has content, deliberately:
 * every content task's exit condition is a panel measurement at 1024×768, and
 * there is nothing to measure until the route renders.
 */
// No `as` cast here, deliberately. A cast is a place you told the compiler to
// stop helping, and this stage's own `## Definition of done` requires a comment
// on every one. Writing the array out means `StepId` is checked rather than
// asserted, which is the whole reason the tuple exists.
function placeholder(label: string, hint: string) {
  return (
    <Section eyebrow="Not yet drawn" title={label}>
      <Prose>
        <p>{hint}</p>
      </Prose>
    </Section>
  )
}

// Annotated on the source array, not asserted on the result: `id` has to be a
// `StepId` where it is written, so a typo fails here rather than being cast
// away downstream.
const PLACEHOLDER_RAIL: { id: StepId; label: string; hint: string }[] = [
  {
    id: 'drill',
    label: 'Safe or not',
    hint: 'Six snippets, scored',
  },
  {
    id: 'boundaries',
    label: 'Boundaries',
    hint: 'What gets parsed, and the one exception',
  },
  { id: 'states', label: 'Loading, error', hint: 'Where the waiting went' },
  {
    id: 'commits',
    label: 'Habits',
    hint: 'Commits, getting stuck, fast feedback',
  },
  {
    id: 'ai',
    label: 'AI plays',
    hint: 'Where it earns its place, and where it does not',
  },
  { id: 'checklist', label: 'Done', hint: 'What one slice owes before the PR' },
  { id: 'traps', label: 'Traps', hint: 'Failure modes worth naming' },
]

const CONTENT_STEPS: (Step & { id: StepId })[] = [
  {
    id: 'loop',
    label: 'The loop',
    hint: 'How to cut two days of work',
    content: (
      <div className="space-y-16">
        <Section eyebrow="Entry criteria" title="What has to be true first">
          <Prose>
            <p>
              Two things are already settled by the time this loop starts, and
              neither is this stage&rsquo;s to teach: the project is scaffolded
              with CI green and preview deploys working, and the next piece of
              work is scoped small enough to merge within two days. What belongs
              here is the loop itself.
            </p>
          </Prose>
        </Section>

        <Section
          eyebrow="The work"
          title="The loop you run dozens of times a day"
        >
          <Prose>
            <p>
              The discipline is in &ldquo;smallest shippable slice.&rdquo;
              Anything that cannot merge within two days should be decomposed or
              hidden behind a <Term id="feature-flag">feature flag</Term>.
              Long-lived branches diverge, conflict, and stop being reviewable
              &mdash; and a branch you cannot review is a branch you cannot
              trust.
            </p>
          </Prose>
          <LoopFlow />
          <Prose>
            <p>
              &ldquo;Make it work, then make it clean&rdquo; is an ordering, not
              permission to skip the second half. Cleanup happens before the PR,
              not in a follow-up ticket that never gets picked up once the slice
              already shipped.
            </p>
          </Prose>
        </Section>

        <Section
          eyebrow="The cut"
          title="Vertical slices, not horizontal layers"
        >
          <Prose>
            <p>
              A <Term id="vertical-slice">vertical slice</Term> builds through
              every layer for one narrow case rather than one layer completely
              across all cases. You also learn about the design from the first
              slice, before it is baked into thirty files.
            </p>
          </Prose>
          <div className="mt-5">
            <Contrast
              badLabel="Horizontal"
              goodLabel="Vertical"
              bad={
                <p>
                  Build the whole schema, then all the queries, then all the UI
                  &mdash; for user profiles, every field before any of them
                  ship.
                  <span className="mt-2 block text-subtle">
                    Nothing is demonstrable until everything is done, and you
                    learn nothing about the design until the end.
                  </span>
                </p>
              }
              good={
                <p>
                  <em>View your own display name</em> end to end &mdash; column,
                  query, component, test. Ship it. Then add editing. Then
                  avatars.
                  <span className="mt-2 block text-subtle">
                    Each slice is demonstrable, independently valuable, and
                    independently revertible.
                  </span>
                </p>
              }
            />
          </div>
        </Section>
      </div>
    ),
  },
  {
    id: 'server',
    label: 'Server first',
    hint: 'Where the client boundary goes',
    content: (
      <div className="space-y-16">
        <Section eyebrow="The default" title="Server Components by default">
          <Prose>
            <p>
              Next.js 16&rsquo;s App Router makes{' '}
              <Term id="server-component">Server Components</Term> the default.
              Keep it that way.
            </p>
          </Prose>
          <div className="mt-5">
            <AnnotatedArtifact artifact={ARTIFACTS.invoicesPage} />
          </div>
          <Prose>
            <p className="mt-6">
              No <code className="t-data break-words">useEffect</code>, no
              loading state, no client-side fetch, no API route in between. The
              data access happens where the data lives. Add{' '}
              <Term id="client-component">
                <code className="t-data break-words">
                  &apos;use client&apos;
                </code>
              </Term>{' '}
              only when you need interactivity, and push it to the leaves.
            </p>
          </Prose>
        </Section>

        <Section
          eyebrow="The boundary"
          title="What the directive actually moves"
        >
          <Prose>
            <p>
              <code className="t-data break-words">&apos;use client&apos;</code>{' '}
              does not mean &ldquo;not rendered on the server.&rdquo; A Client
              Component is still prerendered to HTML on first load &mdash; what
              the directive marks is a boundary: everything below it ships to
              the browser and, on later navigations, renders entirely on the
              client.
            </p>
          </Prose>
          <Figure
            n={2}
            caption="Moving the directive changes what ships and what stays server-only; it never changes what gets prerendered — that stays true everywhere, always."
          >
            <ClientBoundary />
          </Figure>
        </Section>
      </div>
    ),
  },
  {
    id: 'thin',
    label: 'Thin routes',
    hint: 'What belongs one directory away',
    content: (
      <div className="space-y-16">
        <Section eyebrow="The rule" title="Route files stay thin">
          <Prose>
            <p>
              Files under <code className="t-data break-words">src/app/</code>{' '}
              handle routing, auth checks, and composition. Every symbol a file
              uses is imported in that file &mdash; a block you cannot paste and
              run is a block you cannot check.
            </p>
          </Prose>
          <div className="mt-5">
            <AnnotatedArtifact artifact={ARTIFACTS.billingPage} />
          </div>
        </Section>

        <Section
          eyebrow="One directory away"
          title="Where the logic actually lives"
        >
          <Prose>
            <p>
              Feature code lives under{' '}
              <code className="t-data break-words">
                src/features/&lt;feature&gt;/
              </code>
              , and that includes its components.{' '}
              <code className="t-data break-words">invoice-table.tsx</code> sits
              beside <code className="t-data break-words">queries.ts</code>{' '}
              because they change together.
            </p>
          </Prose>
          <div className="mt-5">
            <AnnotatedArtifact artifact={ARTIFACTS.getInvoices} />
          </div>
          <div className="mt-5">
            <RevealList
              idPrefix="thin-component"
              rows={[
                {
                  id: 'invoice-table',
                  title: 'The component the query hands off to',
                  summary:
                    'invoice-table.tsx — expand to see it, queried above.',
                  body: <AnnotatedArtifact artifact={ARTIFACTS.invoiceTable} />,
                },
              ]}
            />
          </div>
        </Section>

        <Section
          eyebrow="Why it matters"
          title="What a route file costs a test"
        >
          <div className="mt-5">
            <RevealList
              idPrefix="thin-untested"
              rows={[
                {
                  id: 'function',
                  title: 'Query it as an ordinary function',
                  summary: 'No framework, no request, no mocking.',
                  body: (
                    <RevealFacet label="What a test does">
                      Calls it with an id and checks what comes back &mdash; the
                      same test either query above owes.
                    </RevealFacet>
                  ),
                },
                {
                  id: 'route',
                  title: 'Bury the same logic inside the route file instead',
                  summary:
                    'The test now has to boot the whole framework to reach it.',
                  body: (
                    <RevealFacet label="The cost" tone="warn">
                      Not because anyone decided to skip the test, but because
                      the friction of booting Next.js just to reach a function
                      is high enough that it usually does not get written.
                    </RevealFacet>
                  ),
                },
              ]}
            />
          </div>
        </Section>
      </div>
    ),
  },
  {
    id: 'action',
    label: 'Actions',
    hint: 'Authenticate, validate, authorize',
    content: (
      <div className="space-y-16">
        <Section
          eyebrow="Every action, every time"
          title="Server Actions need validation and authorization"
        >
          <Prose>
            <p>
              A <Term id="server-action">Server Action</Term> is a public HTTP
              endpoint that looks like a function call &mdash; which is exactly
              what makes it dangerous. Four things below are what it owes every
              caller.
            </p>
          </Prose>
          <div className="mt-5">
            <AnnotatedArtifact artifact={ARTIFACTS.updateInvoice} />
          </div>
          <div className="mt-5">
            <RevealList
              idPrefix="action-owes"
              rows={[
                {
                  id: 'authenticate',
                  title: '1. Authenticate',
                  summary: 'Who is calling, before anything else runs.',
                  body: (
                    <RevealFacet label="Why first" tone="blueprint">
                      <Term id="authorization">Authorization</Term> only means
                      something once you know who the caller is.{' '}
                      <code className="t-data break-words">requireUser()</code>{' '}
                      gets that answer before the input is even parsed.
                    </RevealFacet>
                  ),
                },
                {
                  id: 'validate',
                  title: '2. Validate',
                  summary:
                    'The input is typed unknown, not the schema’s output.',
                  body: (
                    <RevealFacet label="Why unknown" tone="blueprint">
                      A Server Action receives whatever the network sends. Only{' '}
                      <code className="t-data break-words">safeParse</code> gets
                      to decide it matches the shape the rest of the function
                      assumes.
                    </RevealFacet>
                  ),
                },
                {
                  id: 'authorize',
                  title: '3. Authorize, and get the disclosure right for free',
                  summary:
                    'The one step people omit, and the most common serious bug here.',
                  body: (
                    <div className="space-y-3">
                      <RevealFacet label="Not a separate read" tone="warn">
                        The owner belongs in the{' '}
                        <code className="t-data break-words">where</code>, not
                        in a check run before it. Fetching the row, comparing
                        its owner, then updating by id alone leaves a gap
                        between the check and the write; putting the owner in
                        the <code className="t-data break-words">where</code>{' '}
                        makes the check and the write the same statement.
                      </RevealFacet>
                      <RevealFacet label="Why not Forbidden" tone="subtle">
                        Zero rows means either the invoice does not exist or it
                        is not yours, and the caller cannot tell which &mdash;
                        so &ldquo;Not found&rdquo; is the honest answer as well
                        as the safe one. Answering &ldquo;Forbidden&rdquo; would
                        confirm the record exists.
                      </RevealFacet>
                    </div>
                  ),
                },
                {
                  id: 'return',
                  title: 'Return, don’t throw',
                  summary: 'A rejected update is a normal outcome, not a bug.',
                  body: (
                    <RevealFacet label="What crosses the network" tone="subtle">
                      Next&rsquo;s error handling draws the line at unexpected
                      versus expected: throw for the unexpected and let an error
                      boundary catch it, return the expected. The narrowest
                      thing that works &mdash;{' '}
                      <code className="t-data break-words">
                        {'{ ok: true }'}
                      </code>
                      , an id, a count &mdash; keeps your table&rsquo;s shape
                      from becoming a public contract.
                    </RevealFacet>
                  ),
                },
              ]}
            />
          </div>
        </Section>
      </div>
    ),
  },
  {
    id: 'callers',
    label: 'Callers',
    hint: 'A form, and a button with nothing to type',
    content: (
      <div className="space-y-16">
        <Section
          eyebrow="The other half"
          title="An action nothing calls is half an endpoint"
        >
          <Prose>
            <p>
              This is where{' '}
              <code className="t-data break-words">&apos;use client&apos;</code>{' '}
              earns itself: the form needs a pending state and an error to
              display. It stays a leaf &mdash; the page holding it is still a
              Server Component.
            </p>
          </Prose>
          <div className="mt-5">
            <AnnotatedArtifact artifact={ARTIFACTS.amountForm} />
          </div>
        </Section>

        <Section
          eyebrow="What each owes"
          title="Two callers, the same endpoint underneath"
        >
          <Prose>
            <p>
              Not every action needs a form. A button that already has an id and
              an amount on screen can call it directly &mdash; that does not
              change what the action owes the caller.
            </p>
          </Prose>
          <div className="mt-5">
            <RevealList
              idPrefix="callers-owe"
              rows={[
                {
                  id: 'form',
                  title: 'What the form owes',
                  summary: 'A pending state, and somewhere to put the error.',
                  body: (
                    <RevealFacet label="What it adds">
                      <code className="t-data break-words">useActionState</code>{' '}
                      hands back the last result alongside the action, so a
                      failed save renders{' '}
                      <code className="t-data break-words">state.error</code> in
                      place rather than tripping a boundary the user cannot act
                      on.
                    </RevealFacet>
                  ),
                },
                {
                  id: 'button',
                  title: 'What the button owes',
                  summary:
                    'Every step the form’s call ran, because the endpoint cannot tell the difference — expand for the code.',
                  body: (
                    <div className="space-y-4">
                      <AnnotatedArtifact artifact={ARTIFACTS.retryButton} />
                      <RevealFacet label="No shortcut" tone="warn">
                        Authenticate, validate, authorize still all run.{' '}
                        <code className="t-data break-words">invoice.id</code>{' '}
                        is still an id from the client, and step three has to
                        check it before trusting it, exactly as it does for the
                        form.
                      </RevealFacet>
                    </div>
                  ),
                },
              ]}
            />
          </div>
        </Section>
      </div>
    ),
  },
  {
    id: 'reads',
    label: 'Reads',
    hint: 'The rule says nothing about the verb',
    content: (
      <div className="space-y-16">
        <Section
          eyebrow="The same bug, a quieter symptom"
          title="Authorize reads, not just writes"
        >
          <Prose>
            <p>
              &ldquo;Never trust an ID from the client to belong to the
              caller&rdquo; says nothing about the verb. A detail route can
              carry the identical bug, with a quieter symptom &mdash; nothing
              throws, the page just shows someone else&rsquo;s invoice.
            </p>
          </Prose>
          <div className="mt-5 space-y-5">
            <AnnotatedArtifact artifact={ARTIFACTS.getInvoice} />
            <AnnotatedArtifact artifact={ARTIFACTS.invoiceDetailPage} />
          </div>
        </Section>

        <Section
          eyebrow="The rule, restated for a read"
          title="Scope the query, don't filter the result"
        >
          <div className="mt-5">
            <Contrast
              badLabel="Filter the result"
              goodLabel="Scope the query"
              bad={
                <p>
                  Load the row by id alone, then check whether{' '}
                  <code className="t-data break-words">invoice.ownerId</code>{' '}
                  matches the caller before rendering it.
                  <span className="mt-2 block text-subtle">
                    The row was already loaded. A stray logging line, an error
                    message, or a debug{' '}
                    <code className="t-data break-words">console.log</code> left
                    in can still put it somewhere it does not belong.
                  </span>
                </p>
              }
              good={
                <p>
                  The owner is a parameter of the query itself &mdash;{' '}
                  <code className="t-data break-words">
                    and(eq(invoices.id, id), eq(invoices.ownerId, ownerId))
                  </code>
                  .
                  <span className="mt-2 block text-subtle">
                    A row that is not yours is never fetched at all, which is
                    the same discipline{' '}
                    <code className="t-data break-words">getInvoices</code>{' '}
                    already applies to a list.
                  </span>
                </p>
              }
            />
          </div>
        </Section>
      </div>
    ),
  },
]

const STEPS: (Step & { id: StepId })[] = [
  ...CONTENT_STEPS,
  ...PLACEHOLDER_RAIL.map(({ id, label, hint }) => ({
    id,
    label,
    hint,
    content: placeholder(label, hint),
  })),
]

export function Development() {
  return <Stepper steps={STEPS} />
}
