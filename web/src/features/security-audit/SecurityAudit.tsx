import { Figure } from '@/components/Figure'
import { RevealList } from '@/components/RevealList'
import { Stepper, type Step } from '@/components/Stepper'
import { Term } from '@/components/Term'
import { Callout, Card, Contrast, Prose, Section } from '@/components/ui'
import { CONTROLS, FINDING, STEP_IDS } from './content'
import { IdorProbe } from './IdorProbe'
import { PolicyMatrix } from './PolicyMatrix'

const steps: (Step & { id: (typeof STEP_IDS)[number] })[] = [
  {
    id: 'scope',
    label: 'What to protect',
    hint: 'Name the data, actions, and consequences',
    content: (
      <Section eyebrow="Start here" title="Give the audit a target">
        <Prose>
          <p>
            This worked audit follows a small invoice application. Customers
            read, change, and export invoices. A security checklist cannot tell
            you which invoice each person should be allowed to touch. Write the{' '}
            <Term id="authorization">authorization</Term> rule before looking
            for its enforcement.
          </p>
        </Prose>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {[
            ['Data', 'Invoice body, PDF, billing address'],
            ['Actions', 'Read, update, delete, export'],
            ['Consequence', 'Disclosure or change to another customer’s bill'],
          ].map(([name, detail]) => (
            <Card key={name}>
              <p className="t-label mb-2 text-brand">{name}</p>
              <p className="text-sm text-muted">{detail}</p>
            </Card>
          ))}
        </div>
      </Section>
    ),
  },
  {
    id: 'boundaries',
    label: 'Trust boundaries',
    hint: 'Find where an untrusted ID crosses into data access',
    content: (
      <Section title="Follow the invoice ID">
        <Prose>
          <p>
            A signed-in browser can still send someone else&apos;s invoice ID.
            Each server entry point must establish the caller and check the
            requested operation. A hidden button is no boundary.
          </p>
        </Prose>
        <Figure
          n={1}
          caption="The invoice ID crosses from the browser to a server entry point, then to storage. Authorization belongs on the server side of the first boundary."
        >
          <div className="mt-6 grid gap-3 sm:grid-cols-[1fr_auto_1fr_auto_1fr] sm:items-center">
            <Card>
              <span className="t-label text-brand">Browser</span>
              <p className="mt-2 text-sm">URL, form, action argument</p>
            </Card>
            <span
              className="hidden text-center text-brand sm:block"
              aria-hidden
            >
              →
            </span>
            <Card>
              <span className="t-label text-brand">Server</span>
              <p className="mt-2 text-sm">Action or route handler</p>
            </Card>
            <span
              className="hidden text-center text-brand sm:block"
              aria-hidden
            >
              →
            </span>
            <Card>
              <span className="t-label text-brand">Storage</span>
              <p className="mt-2 text-sm">Invoice row or PDF</p>
            </Card>
          </div>
        </Figure>
        <Callout title="Entry point inventory">
          <p>
            Find page reads, update and delete actions, and the PDF export
            handler. Include paths the UI does not currently show.
          </p>
        </Callout>
        <a
          href="https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html"
          className="mt-4 inline-flex min-h-11 items-center text-sm underline hover:text-brand"
        >
          OWASP threat modeling
        </a>
      </Section>
    ),
  },
  {
    id: 'policy',
    label: 'Permission policy',
    hint: 'Choose an operation and inspect every actor',
    content: (
      <Section title="State the permission before testing it">
        <Prose>
          <p>
            For this invoice, only its owner may read, update, delete, or
            export. User B, an anonymous visitor, and an admin without a
            recorded grant are denied. Select an operation to inspect its probe.
          </p>
        </Prose>
        <div className="mt-6">
          <PolicyMatrix />
        </div>
      </Section>
    ),
  },
  {
    id: 'two-users',
    label: 'Two-user probe',
    hint: 'Commit to an answer before the result appears',
    content: (
      <Section title="A known UUID is still untrusted">
        <Prose>
          <p>
            Create two users and an invoice owned by each. Sign in as User B,
            then submit User A&apos;s invoice ID through each reachable
            operation. Decide what the export handler should do.
          </p>
        </Prose>
        <div className="mt-6">
          <IdorProbe />
        </div>
        <a
          href="https://cheatsheetseries.owasp.org/cheatsheets/Insecure_Direct_Object_Reference_Prevention_Cheat_Sheet.html"
          className="mt-4 inline-flex min-h-11 items-center text-sm underline hover:text-brand"
        >
          OWASP IDOR prevention
        </a>
        <p className="mt-5 text-sm text-muted">
          Repeat the probe for read, update, and delete. Check that User
          A&apos;s record is unchanged after each denial.
        </p>
      </Section>
    ),
  },
  {
    id: 'query',
    label: 'Enforce the rule',
    hint: 'Compare an authenticated query with an authorized one',
    content: (
      <Section title="Bind the owner to the lookup">
        <Contrast
          badLabel="Authenticated only"
          goodLabel="Owner-scoped"
          bad={<code>where: eq(invoices.id, invoiceId)</code>}
          good={
            <code>
              where: and(eq(invoices.id, invoiceId), eq(invoices.ownerId,
              user.id))
            </code>
          }
        />
        <Prose>
          <p>
            The first query accepts any known invoice ID from a signed-in user.
            The second derives the user from the trusted session and only
            returns that user&apos;s row. A post-fetch permission check can
            work, but a caller-scoped data access function makes the check
            harder to omit.
          </p>
        </Prose>
        <Callout kind="warn" title="Do not copy the actor from a form">
          <p>
            The browser supplies the invoice ID. The server obtains the caller
            from its session, then applies the written policy.
          </p>
        </Callout>
        <a
          href="https://nextjs.org/docs/app/guides/data-security"
          className="mt-4 inline-flex min-h-11 items-center text-sm underline hover:text-brand"
        >
          Next.js data security
        </a>
      </Section>
    ),
  },
  {
    id: 'controls',
    label: 'Other checks',
    hint: 'Open the controls this application actually uses',
    content: (
      <Section title="Check the paths that exist">
        <Prose>
          <p>
            Object access is the center of this audit. These checks catch other
            ways the same application can expose data or invite abuse. Open a
            row when the path exists; record “not applicable” with a reason when
            it does not.
          </p>
        </Prose>
        <div className="mt-6">
          <RevealList
            idPrefix="security-controls"
            rows={CONTROLS.map((item) => ({
              id: item.id,
              title: item.title,
              body: (
                <div>
                  <p>{item.detail}</p>
                  <a
                    href={item.source[1]}
                    className="mt-2 inline-flex min-h-11 items-center text-sm underline hover:text-brand"
                  >
                    {item.source[0]}
                  </a>
                </div>
              ),
            }))}
          />
        </div>
      </Section>
    ),
  },
  {
    id: 'finding',
    label: 'Finding record',
    hint: 'Leave reproduction and retest evidence',
    content: (
      <Section title="Record the failure so it can be retested">
        <Prose>
          <p>
            This is a worked record for a vulnerable export handler. A real
            audit stores redacted requests and responses, dates, and the person
            who owns the decision.
          </p>
        </Prose>
        <dl className="mt-6 border border-line">
          {FINDING.map(([field, detail]) => (
            <div
              key={field}
              className="grid gap-1 border-b border-line p-4 last:border-b-0 sm:grid-cols-[8rem_1fr]"
            >
              <dt className="t-label text-brand">{field}</dt>
              <dd className="text-sm leading-relaxed">{detail}</dd>
            </div>
          ))}
        </dl>
        <Callout kind="warn" title="Accepted risk needs an owner">
          <p>
            If a finding stays open, record who accepted it, why, and the review
            date. An unguessable ID is not a reason to accept cross-user access.
          </p>
        </Callout>
      </Section>
    ),
  },
  {
    id: 'ai',
    label: 'AI plays',
    hint: 'Draft with an assistant; verify against the application',
    content: (
      <Section title="AI in security audit">
        <Prose>
          <p>
            An assistant can draft an entry-point inventory, suggest a missing
            actor, or turn the written policy into test cases. Use synthetic
            invoices and redacted requests. Keep customer data, session cookies,
            and secrets out of prompts.
          </p>
          <p>
            Watch the test deny User B and preserve User A&apos;s record. You
            must verify the permission policy, the finding&apos;s impact, and
            the fix with the application owner. A convincing report is not a
            reproduced request.
          </p>
        </Prose>
      </Section>
    ),
  },
  {
    id: 'done',
    label: 'Done',
    hint: 'What evidence closes this audit pass',
    content: (
      <Section title="Close the pass with evidence">
        <ul className="list-disc space-y-3 pl-5 text-sm leading-relaxed">
          <li>
            Threat model names actors, assets, entry points, and boundaries.
          </li>
          <li>
            Every applicable object operation has owner, other-user, anonymous,
            and privileged-actor probes.
          </li>
          <li>
            Findings carry reproduction, impact, fix, retest, and accepted-risk
            owner.
          </li>
          <li>
            Relevant controls were checked; non-applicable paths have reasons.
          </li>
          <li>
            Retests show the other user denied and the owner still able to work.
          </li>
        </ul>
      </Section>
    ),
  },
  {
    id: 'traps',
    label: 'Traps',
    hint: 'Common ways an audit overclaims',
    content: (
      <Section title="What a clean scan does not prove">
        <RevealList
          idPrefix="security-traps"
          rows={[
            {
              id: 'auth',
              title: 'Authenticated is not authorized',
              body: (
                <p>
                  A signed-in user can still send another user&apos;s ID. Check
                  the operation on the object.
                </p>
              ),
            },
            {
              id: 'uuid',
              title: 'UUID is not permission',
              body: (
                <p>
                  Complex IDs reduce guessing. A known foreign UUID must still
                  be denied.
                </p>
              ),
            },
            {
              id: 'scanner',
              title: 'Scanner output is not the policy',
              body: (
                <p>
                  Generic tools cannot decide whether User B should read User
                  A&apos;s invoice. Write the policy and run the probes.
                </p>
              ),
            },
            {
              id: 'one-time',
              title: 'One audit is one snapshot',
              body: (
                <p>
                  New actions, handlers, and data paths need new probes. Repeat
                  after significant auth or data-access changes.
                </p>
              ),
            },
          ]}
        />
      </Section>
    ),
  },
]

export function SecurityAudit() {
  return <Stepper steps={steps} />
}
