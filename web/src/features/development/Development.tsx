import { Stepper, type Step } from '@/components/Stepper'
import { Callout, Contrast, Prose, Section } from '@/components/ui'
import { Figure } from '@/components/Figure'
import { Term } from '@/components/Term'
import { RevealList, type RevealRow } from '@/components/RevealList'
import { RevealFacet } from '@/components/RevealFacet'
import { AnnotatedArtifact } from '@/components/AnnotatedArtifact'
import { InlineCode } from '@/components/InlineCode'
import { References } from '@/components/References'
import { LoopFlow } from './LoopFlow'
import { ClientBoundary } from './ClientBoundary'
import { AuthorizationDrill } from './AuthorizationDrill'
import { AIPlays } from './AIPlays'
import { DevChecklist } from './DevChecklist'
import { ARTIFACTS } from './artifacts'
import { TRAPS } from './traps'
import { type StepId } from './steps'

/**
 * Stage 05's thirteen panels.
 */

/**
 * The four moves for "When you get stuck", hand-authored here rather than in
 * a data module: unlike `checklist.ts` or `traps.ts`, nothing elsewhere in
 * the app needs these four independently of this one panel.
 */
const STUCK_MOVES: RevealRow[] = [
  {
    id: 'say-it',
    title: 'Say the problem out loud',
    summary: 'Rubber-ducking works because articulation forces precision.',
    body: (
      <RevealFacet label="Why it works" tone="blueprint">
        Putting it into words is often enough on its own — half the time the gap
        between what you say and what is actually true is where the bug was
        hiding.
      </RevealFacet>
    ),
  },
  {
    id: 'check-assumptions',
    title: 'Check assumptions with real output',
    summary: 'Log the value. It is very often not what you assumed.',
    body: (
      <RevealFacet label="Why it works" tone="blueprint">
        Everything downstream of a false premise is correct reasoning from a
        wrong starting point, and no amount of it will find the bug.
      </RevealFacet>
    ),
  },
  {
    id: 'reduce-it',
    title: 'Reduce it',
    summary: 'Smallest possible reproduction.',
    body: (
      <RevealFacet label="Why it works" tone="blueprint">
        Half the time the reduction itself reveals the bug, before you have
        written a single line meant to fix anything.
      </RevealFacet>
    ),
  },
  {
    id: 'walk-away',
    title: 'Walk away',
    summary: 'Genuinely effective and consistently undervalued.',
    body: (
      <RevealFacet label="Why it works" tone="blueprint">
        Nothing about the code changes while you are gone, only your view of it
        — which is usually exactly what was missing.
      </RevealFacet>
    ),
  },
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
  {
    id: 'drill',
    label: 'Safe or not',
    hint: 'Six snippets, scored',
    content: (
      <div className="space-y-16">
        <Section eyebrow="The exercise" title="Six snippets, scored">
          <AuthorizationDrill />
        </Section>
      </div>
    ),
  },
  {
    id: 'boundaries',
    label: 'Boundaries',
    hint: 'What gets parsed, and the one exception',
    content: (
      <div className="space-y-16">
        <Section eyebrow="At the edge" title="Types at the boundaries">
          <Prose>
            <p>
              Parse untrusted input into typed values with{' '}
              <Term id="zod">Zod</Term> at the edge; keep the inside of the
              application fully typed.
            </p>
          </Prose>
          <div className="mt-5">
            <RevealList
              idPrefix="boundaries"
              rows={[
                {
                  id: 'http-bodies',
                  title: 'HTTP request bodies',
                  summary:
                    'Whatever a Server Action or route receives, before anything trusts its shape.',
                  body: (
                    <RevealFacet label="Same schema, same job" tone="blueprint">
                      The <code className="t-data break-words">safeParse</code>{' '}
                      already shown for{' '}
                      <code className="t-data break-words">updateInvoice</code>{' '}
                      is this rule applied &mdash; the compiler never treats the
                      network&rsquo;s input as typed until a schema has looked
                      at it.
                    </RevealFacet>
                  ),
                },
                {
                  id: 'env-vars',
                  title: 'Environment variables',
                  summary: 'Parsed once, at boot (04).',
                  body: (
                    <RevealFacet label="Once, not per request" tone="blueprint">
                      A schema over{' '}
                      <code className="t-data break-words">process.env</code>{' '}
                      checked at startup, so a missing or malformed variable
                      fails the boot rather than the first request that happens
                      to touch it.
                    </RevealFacet>
                  ),
                },
                {
                  id: 'third-party',
                  title: 'Third-party API responses',
                  summary: 'Their contract can change without warning.',
                  body: (
                    <RevealFacet
                      label="You do not control the other side"
                      tone="blueprint"
                    >
                      A field renamed or dropped upstream is not something your
                      own types would ever catch. Only a parse step run against
                      the actual response would.
                    </RevealFacet>
                  ),
                },
                {
                  id: 'database-rows',
                  title: 'Database rows — the one exception',
                  summary: 'Inferred by Drizzle, never checked at runtime.',
                  body: (
                    <div className="space-y-3">
                      <RevealFacet
                        label="Inference, not validation"
                        tone="warn"
                      >
                        Drizzle types a row from your schema, so the compiler
                        knows its shape without a parse step. Nothing checks at
                        runtime that the row actually matches &mdash; if the
                        table drifts from the schema, the types keep insisting
                        everything is fine.
                      </RevealFacet>
                      <RevealFacet
                        label="A choice, not a closed boundary"
                        tone="subtle"
                      >
                        It is a boundary you are choosing to trust rather than
                        one you have closed, and it is worth being exact about
                        that rather than treating a typed row as validated data.
                      </RevealFacet>
                    </div>
                  ),
                },
              ]}
            />
          </div>
          <Prose>
            <p className="mt-6">
              Inside those boundaries: no{' '}
              <code className="t-data break-words">any</code>, no unchecked
              casts. Every <code className="t-data break-words">as</code> is a
              place you told the compiler to stop helping, so it carries a
              comment saying what you know that it does not.
            </p>
          </Prose>
        </Section>
      </div>
    ),
  },
  {
    id: 'states',
    label: 'Loading, error',
    hint: 'Where the waiting went',
    content: (
      <div className="space-y-16">
        <Section
          eyebrow="Where the waiting went"
          title="Loading and error states"
        >
          <Prose>
            <p>
              &ldquo;No loading state&rdquo; earlier on this page was about
              client-side fetching: no{' '}
              <code className="t-data break-words">useEffect</code>, so no{' '}
              <code className="t-data break-words">isLoading</code> flag to
              manage. The waiting did not disappear &mdash; it moved to the
              route, where the framework handles it. Two files, neither of which
              you import anywhere; the App Router finds them by name.
            </p>
          </Prose>
          <div className="mt-5 space-y-5">
            <AnnotatedArtifact artifact={ARTIFACTS.loadingFile} />
            <AnnotatedArtifact artifact={ARTIFACTS.errorFile} />
          </div>
          <Prose>
            <p className="mt-6">
              <code className="t-data break-words">loading.tsx</code> shows
              while the segment&rsquo;s data resolves.{' '}
              <code className="t-data break-words">error.tsx</code> is an{' '}
              <Term id="error-boundary">error boundary</Term>: it catches what
              throws below it, and has to be a Client Component because error
              boundaries always are &mdash; one of the few places the directive
              is not a choice.
            </p>
          </Prose>
        </Section>

        <Section
          eyebrow="Two kinds of failure"
          title="Expected returns, unexpected throws"
        >
          <Prose>
            <p>
              Those two files cover the unexpected. An expected failure is a
              different shape, and does not belong in either of them.
            </p>
          </Prose>
          <div className="mt-5">
            <Contrast
              badLabel="Thrown"
              goodLabel="Returned"
              bad={
                <p>
                  An invalid amount, or a record that is not the caller&rsquo;s,
                  reaches an error boundary the user cannot act on &mdash; a
                  generic &ldquo;Try again&rdquo; for a problem retrying will
                  not fix.
                  <span className="mt-2 block text-subtle">
                    Next&rsquo;s error handling draws the line at unexpected
                    versus expected, and treating an expected outcome as a throw
                    puts it on the wrong side of that line.
                  </span>
                </p>
              }
              good={
                <p>
                  <code className="t-data break-words">updateInvoice</code>{' '}
                  hands back{' '}
                  <code className="t-data break-words">
                    {'{ ok: false, error }'}
                  </code>{' '}
                  instead, for the form to render{' '}
                  <code className="t-data break-words">state.error</code> in
                  place.
                  <span className="mt-2 block text-subtle">
                    The caller gets the actual message, which is the whole
                    reason it needed to be returned rather than thrown.
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
    id: 'commits',
    label: 'Habits',
    hint: 'Commits, getting stuck, fast feedback',
    content: (
      <div className="space-y-16">
        <Section eyebrow="Small and focused" title="Commits and branches">
          <Prose>
            <p>
              A commit that changes one thing can be reverted, cherry-picked,
              and understood.
            </p>
          </Prose>
          <div
            className="mt-5 overflow-x-auto border border-line bg-sunken p-4"
            tabIndex={0}
          >
            <pre className="t-data whitespace-pre text-[13px] leading-6">
              {`feat(billing): add invoice status filter

Users with many invoices could not find unpaid ones. Adds a status
query param, defaulting to all.`}
            </pre>
          </div>
          <Prose>
            <p className="mt-6">
              Subject in imperative mood, under about seventy characters. The
              body explains <em>why</em> &mdash; the diff already shows what.
              Six months from now,{' '}
              <code className="t-data break-words">git log</code> is the only
              record of your reasoning, and &ldquo;fix bug&rdquo; tells future
              you nothing.
            </p>
            <p>
              A branch that cannot merge within two days is too big &mdash; the
              same rule as &ldquo;smallest shippable slice,&rdquo; seen from the
              other end. Decompose it, or put the unfinished part behind a flag
              and merge what works. <Term id="rebase">Rebase</Term> before you
              open the pull request, so history reads in order.
            </p>
          </Prose>
        </Section>

        <Section eyebrow="The habit" title="When you get stuck">
          <Prose>
            <p>
              A timebox prevents the two-hour hole. After roughly thirty minutes
              without progress, four moves &mdash; expand each for why it works.
            </p>
          </Prose>
          <div className="mt-5">
            <RevealList
              idPrefix="stuck"
              rows={STUCK_MOVES}
              footer={
                <p>
                  For anything gnarlier than a typo, the systematic-debugging
                  discipline is the same shape at a larger scale: form a
                  hypothesis, design the smallest test that would disprove it,
                  run it, repeat. Randomly changing code until it works produces
                  code that works for reasons you do not know.
                </p>
              }
            />
          </div>
        </Section>

        <Section eyebrow="Fast feedback" title="Keep the feedback loop running">
          <Prose>
            <p>
              Vitest in watch mode in a spare terminal is the highest-leverage
              habit on this page. The gap between writing a bug and seeing it
              fail shrinks to seconds.
            </p>
          </Prose>
          <div className="mt-5">
            <AnnotatedArtifact artifact={ARTIFACTS.feedbackLoop} />
          </div>
        </Section>
      </div>
    ),
  },
  {
    id: 'ai',
    label: 'AI plays',
    hint: 'Where it earns its place, and where it does not',
    content: (
      <div className="space-y-16">
        <Section
          eyebrow="AI in development"
          title="Where it earns its place, and where it does not"
        >
          <div className="mt-5">
            <AIPlays />
          </div>
        </Section>
      </div>
    ),
  },
  {
    id: 'checklist',
    label: 'Done',
    hint: 'What one slice owes before the PR',
    content: (
      <div className="space-y-16">
        <Section eyebrow="Closing" title="What one slice owes before the PR">
          <Prose>
            <p>
              This is the stage&rsquo;s{' '}
              <Term id="definition-of-done">definition of done</Term>. Tick it
              against the slice you are actually shipping, not the whole
              project.
            </p>
          </Prose>
          <div className="mt-5">
            <DevChecklist />
          </div>
        </Section>
      </div>
    ),
  },
  {
    id: 'traps',
    label: 'Traps',
    hint: 'Failure modes worth naming',
    content: (
      <div className="space-y-16">
        <Section eyebrow="Closing" title="Traps">
          <Prose>
            <p>
              Each of these has a specific cost and a specific tell, in the
              order the doc lists them.
            </p>
          </Prose>
          <div className="mt-5 space-y-4">
            {TRAPS.map((trap) => (
              <Callout key={trap.id} kind="trap" title={trap.title}>
                <p>
                  <InlineCode text={trap.body} />
                </p>
              </Callout>
            ))}
          </div>
        </Section>

        <References slug="05-development" />
      </div>
    ),
  },
]

export function Development() {
  return <Stepper steps={CONTENT_STEPS} />
}
