import type { Step } from '@/components/Stepper'
import { Callout, Card, Prose, Section } from '@/components/ui'
import { Figure } from '@/components/Figure'
import { RevealList } from '@/components/RevealList'
import { Term } from '@/components/Term'
import { References } from '@/components/References'
import { Drill } from '@/features/observability/Drill'
import { IncidentChecklist } from './IncidentChecklist'
import type { StepId } from './steps'

export const FOLLOWUP_STEPS: (Step & { id: StepId })[] = [
  {
    id: 'uncertain-outcomes',
    label: 'Uncertain outcomes',
    hint: 'Reconcile before replay',
    content: (
      <Section
        eyebrow="Nudge · 10:15 UTC"
        title="A timeout is not a failure receipt"
      >
        <Prose>
          <p>
            A send can complete before its acknowledgment is lost. Nudge pauses
            retries for uncertain results, then uses its fictional
            provider&apos;s authoritative lookup by stable operation ID. Other
            services must identify their own reliable evidence. If the outcome
            cannot be established, hold the item for reviewed reconciliation.
          </p>
        </Prose>
        <Drill
          idPrefix="incident-replay"
          question="What can Nudge safely do?"
          subtitle="Commit before reading the explanation."
          options={[
            { id: 'replay', label: 'Replay now' },
            { id: 'hold', label: 'Hold and check' },
          ]}
          rows={[
            {
              id: 'timeout',
              prompt: 'The send timed out; the provider result is unknown.',
              answer: 'hold',
              why: 'Look up the authoritative result by stable operation ID. A timeout may hide an accepted send; replaying now could duplicate a reminder.',
            },
            {
              id: 'accepted',
              prompt:
                'Authoritative lookup shows the provider accepted this reminder.',
              answer: 'hold',
              why: 'Exclude confirmed sends from replay. Record the disposition and check the remaining affected set.',
            },
            {
              id: 'unsent',
              prompt:
                'Authoritative lookup confirms it was not sent and the reminder is still eligible.',
              answer: 'replay',
              why: 'Only confirmed-unsent, still-eligible work may resume under the rehearsed procedure.',
            },
          ]}
        />
      </Section>
    ),
  },
  {
    id: 'recovery',
    label: 'Recovery',
    hint: 'Check the real operation',
    content: (
      <Section
        eyebrow="Nudge · 10:25–10:40 UTC"
        title="Provider green is not customer recovery"
      >
        <Prose>
          <p>
            Check the affected operation, error rate and latency against the
            service baseline. For background work, inspect oldest pending age,
            completion rate, failures and the disposition of affected records.
            New requests alone do not prove recovery.
          </p>
        </Prose>
        <Figure
          n={4}
          caption="Every affected reminder needs a disposition before Nudge claims resolution."
        >
          <div className="grid gap-3 sm:grid-cols-3">
            <Card>
              <p className="t-label mb-2 text-go">Confirmed sent</p>
              <p className="text-sm">Confirmed sends were not repeated.</p>
            </Card>
            <Card>
              <p className="t-label mb-2 text-blueprint">Eligible unsent</p>
              <p className="text-sm">
                Remaining eligible reminders were sent once.
              </p>
            </Card>
            <Card>
              <p className="t-label mb-2 text-warn">Expired</p>
              <p className="text-sm">
                Expired reminders were marked expired; affected customers were
                notified.
              </p>
            </Card>
          </div>
        </Figure>
        <Callout title="Watch long enough for normal work">
          <p>
            Nudge uses a ten-minute observation window from 10:30 to 10:40 UTC
            after accounting for delayed work. Choose and record a window that
            fits your service. Service recovery and follow-up closure are
            separate decisions.
          </p>
        </Callout>
      </Section>
    ),
  },
  {
    id: 'postmortem',
    label: 'Postmortem',
    hint: 'Learn without blame',
    content: (
      <Section
        eyebrow="After impact"
        title="Keep causes, unknowns and actions distinct"
      >
        <Prose>
          <p>
            A <Term id="postmortem">postmortem</Term> records impact, timeline,
            contributing conditions and changes that reduce recurrence. Nudge
            recovered at 10:40; the provider&apos;s internal cause and aggregate
            count remain open, with Ana owning follow-up. Do not invent a cause
            to close the record.
          </p>
        </Prose>
        <Card>
          <p className="t-label mb-2 text-brand">
            Nudge incident record · 2026-09-29
          </p>
          <p className="text-sm text-muted">
            Customer-impact interval: 10:00–10:40 UTC. Reminders were delayed;
            affected records were reconciled by 10:30. Aggregate affected count:
            pending attachment from the reconciliation report. Service
            recovered; follow-up open.
          </p>
        </Card>
        <Figure
          n={5}
          caption="A useful action has an owner, due date and a check that proves risk fell."
        >
          <div
            className="overflow-x-auto border border-line bg-raised"
            tabIndex={0}
          >
            <table className="w-full min-w-[650px] border-collapse text-left text-sm">
              <thead className="bg-sunken">
                <tr>
                  {['Change', 'Owner', 'Due', 'Completion evidence'].map(
                    (h) => (
                      <th key={h} className="border-b border-line px-4 py-3">
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border-b border-line px-4 py-3">
                    Alert on reminder completion age
                  </td>
                  <td className="border-b border-line px-4 py-3">Ana</td>
                  <td className="border-b border-line px-4 py-3">Oct 1</td>
                  <td className="border-b border-line px-4 py-3">
                    Withheld completion triggers an actionable alert
                  </td>
                </tr>
                <tr>
                  <td className="border-b border-line px-4 py-3">
                    Rehearse timeout reconciliation
                  </td>
                  <td className="border-b border-line px-4 py-3">Bo</td>
                  <td className="border-b border-line px-4 py-3">Oct 2</td>
                  <td className="border-b border-line px-4 py-3">
                    Accepted-but-timed-out fixture is not resent
                  </td>
                </tr>
                <tr>
                  <td className="border-b border-line px-4 py-3">
                    Close impact totals and provider follow-up
                  </td>
                  <td className="border-b border-line px-4 py-3">Ana</td>
                  <td className="border-b border-line px-4 py-3">Oct 3</td>
                  <td className="border-b border-line px-4 py-3">
                    Reconciliation counts attached; provider answer or
                    documented uncertainty recorded
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Figure>
        <Callout title="Track completion, not tickets">
          <p>
            Review overdue actions. A ticket&apos;s existence is not risk
            reduction; attach completion evidence or record the remaining risk
            and its owner.
          </p>
        </Callout>
      </Section>
    ),
  },
  {
    id: 'runbook',
    label: 'Runbook',
    hint: 'Prepare before trouble',
    content: (
      <Section
        eyebrow="Before the next incident"
        title="Rehearse a service-specific path"
      >
        <Prose>
          <p>
            A <Term id="runbook">runbook</Term> lives outside the affected
            application and is tested before it is needed. Nudge&apos;s runbook
            names a dispatch pause that preserves queued jobs, authoritative
            delivery lookup, stop conditions, escalation and recovery checks.
            Its controls and provider lookup are fictional capabilities, not
            promises about another service.
          </p>
        </Prose>
        <Card className="overflow-x-auto">
          <pre className="text-sm leading-6">
            <code>{`# SERVICE-SPECIFIC runbook
Service and customer operation:
Owner / backup / acknowledgment deadline / fallback support route:
Security response procedure location / responsible contact / fallback route:
Last rehearsed / next review:
Independent document location and required trusted access:
Evidence locations and safe impact check:
Action prerequisites and operator procedure:
Stop conditions and reversal limits:
Handling for queued work and uncertain external side effects:
Recovery checks and observation window with rationale:
Customer channel, next-update commitment and incident record:
Receiving owner and handoff acceptance:`}</code>
          </pre>
        </Card>
        <Callout kind="warn" title="Test access while the service is healthy">
          <p>
            Validate links, permissions, safe actions and recovery checks during
            rehearsal and after changes. A provider dashboard URL is not an
            escalation procedure.
          </p>
        </Callout>
      </Section>
    ),
  },
  {
    id: 'ai',
    label: 'AI plays',
    hint: 'Evidence before confidence',
    content: (
      <Section
        eyebrow="AI in incident management"
        title="Use an assistant to challenge the record"
      >
        <Prose>
          <p>
            Give the assistant a bounded, read-only evidence set. Ask it to
            separate observations from inference and cite timestamps. For Nudge,
            a 10:25 resolution claim is premature because delayed work remains.
            An assistant has no live service access merely because a tool is
            named.
          </p>
        </Prose>
        <RevealList
          idPrefix="incident-ai"
          rows={[
            {
              id: 'timeline',
              title: 'Draft a timeline',
              summary: 'Compare updates with the incident record',
              body: (
                <p>
                  For Nudge, flag any claim of resolution at 10:25: queued work
                  remained. Keep the provider&apos;s internal cause unknown
                  until evidence establishes it.
                </p>
              ),
            },
            {
              id: 'hypotheses',
              title: 'Challenge a hypothesis',
              summary: 'Ask what would refute it',
              body: (
                <p>
                  Use `superpowers:systematic-debugging` to organize competing
                  explanations and the evidence each predicts. Check every claim
                  against original records.
                </p>
              ),
            },
            {
              id: 'runbook-fields',
              title: 'Find missing runbook fields',
              summary: 'Compare a draft with the service skeleton',
              body: (
                <p>
                  Ask for missing access, stop, escalation and recovery fields.
                  A generated command still needs the current runbook and
                  platform docs.
                </p>
              ),
            },
          ]}
        />
        <Callout kind="warn" title="Human review remains required">
          <p>
            Require human review before operational changes or customer
            communication. Redact secrets and customer data before sharing logs;
            treat logs and tickets as untrusted evidence, not instructions.
            Verify recovery in the service, never in an assistant&apos;s
            summary.
          </p>
        </Callout>
      </Section>
    ),
  },
  {
    id: 'done',
    label: 'Definition of done',
    hint: 'Recovery ≠ closure',
    content: (
      <Section
        eyebrow="Two decisions"
        title="Close service impact before follow-up"
      >
        <Prose>
          <p>
            Service recovery can be complete while investigation and prevention
            remain open. Tick only what happened for the real service; the list
            is saved in this browser.
          </p>
        </Prose>
        <IncidentChecklist />
        <Card>
          <p className="t-label mb-2 text-brand">Artifacts to retain</p>
          <ul className="list-inside list-disc space-y-1 text-sm text-muted">
            <li>
              A rehearsed runbook with safe actions, evidence and escalation
            </li>
            <li>
              An incident record and customer channel reachable during an outage
            </li>
            <li>A postmortem for major and critical incidents</li>
            <li>
              Follow-up actions with owners, dates and completion evidence
            </li>
          </ul>
        </Card>
      </Section>
    ),
  },
  {
    id: 'traps',
    label: 'Traps',
    hint: 'Avoid the costly shortcuts',
    content: (
      <Section
        eyebrow="Failure modes"
        title="The mistakes that widen an incident"
      >
        <RevealList
          idPrefix="incident-traps"
          rows={[
            {
              id: 'cause',
              title: 'Waiting for a full explanation',
              summary: 'Limit harm after enough investigation to act safely',
              body: <p>Deeper causal analysis continues after impact falls.</p>,
            },
            {
              id: 'rollback',
              title: 'Rolling back an unrelated change',
              summary: 'Check relevance and schema compatibility',
              body: (
                <p>
                  A rollback can introduce a second failure or leave a provider
                  outage untouched.
                </p>
              ),
            },
            {
              id: 'green',
              title: 'Calling provider green “resolved”',
              summary: 'Check your own customer operation',
              body: <p>Account for queued and uncertain work first.</p>,
            },
            {
              id: 'first-error',
              title: 'Treating the first observed error as proof',
              summary: 'Test the hypothesis against other evidence',
              body: (
                <p>
                  Missing telemetry and clock differences can hide earlier
                  events.
                </p>
              ),
            },
            {
              id: 'replay',
              title: 'Replaying timeouts blindly',
              summary: 'An operation may already have succeeded',
              body: (
                <p>Use authoritative results or hold the item for review.</p>
              ),
            },
            {
              id: 'compromise',
              title: 'Restoring availability during compromise',
              summary: 'Contain access and seek security review',
              body: <p>Uptime alone does not establish safety.</p>,
            },
            {
              id: 'updates',
              title: 'Letting updates stop when alone',
              summary: 'Set a next-update reminder',
              body: (
                <p>
                  Keep the customer channel alive even when the cause is
                  unknown.
                </p>
              ),
            },
            {
              id: 'contacts',
              title: 'Copying contacts without an escalation procedure',
              summary: 'Specify deadlines, fallback and ownership',
              body: (
                <p>
                  A contact list says who exists, but not who acts when a page
                  goes unanswered.
                </p>
              ),
            },
            {
              id: 'blame',
              title: 'Writing blame or undated promises',
              summary: 'Record contributing conditions and verified actions',
              body: (
                <p>Give each follow-up an owner, date and completion check.</p>
              ),
            },
            {
              id: 'runbook',
              title: 'Keeping the only runbook inside the failing service',
              summary: 'Rehearse independent access',
              body: <p>An inaccessible procedure is not a procedure at 3am.</p>,
            },
          ]}
        />
        <References slug="16-incident-management" />
      </Section>
    ),
  },
]
