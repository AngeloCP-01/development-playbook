import type { Step } from '@/components/Stepper'
import { Callout, Card, Prose, Section } from '@/components/ui'
import { Figure } from '@/components/Figure'
import { RevealList } from '@/components/RevealList'
import { Term } from '@/components/Term'
import { Drill } from '@/features/observability/Drill'
import { NudgeRehearsal } from './NudgeRehearsal'
import type { StepId } from './steps'

const EVIDENCE_OPTIONS = [
  { id: 'enough', label: 'Enough evidence' },
  { id: 'not-enough', label: 'Not enough' },
]

const SEVERITY_OPTIONS = [
  { id: 'critical', label: 'Critical' },
  { id: 'major', label: 'Major' },
  { id: 'minor', label: 'Minor' },
]

export const RESPONSE_STEPS: (Step & { id: StepId })[] = [
  {
    id: 'first-response',
    label: 'First response',
    hint: 'Confirm customer impact',
    content: (
      <div className="space-y-8">
        <Section
          eyebrow="Nudge · 10:05 UTC"
          title="Confirm the affected operation"
        >
          <Prose>
            <p>
              The homepage is healthy, but the worker sending appointment
              reminders is timing out. A healthy homepage cannot prove the
              worker completed its job. Inspect completion records, oldest
              pending work and customer reports without sending a duplicate
              reminder to test it.
            </p>
          </Prose>
          <Drill
            idPrefix="incident-impact"
            question="What proves the customer operation is healthy?"
            subtitle="Commit before reading the explanation."
            options={EVIDENCE_OPTIONS}
            rows={[
              {
                id: 'homepage',
                prompt:
                  'The homepage is healthy while reminder sends time out.',
                answer: 'not-enough',
                why: 'Check worker completion records, oldest pending work and customer reports. A healthy homepage cannot prove background work completed.',
              },
              {
                id: 'completion',
                prompt:
                  'Completion age is normal and the affected customer operation succeeds.',
                answer: 'enough',
                why: 'The check covers the operation customers rely on. Record the observation and watch for the chosen recovery window.',
              },
            ]}
          />
        </Section>
        <Callout title="Declare with unknowns">
          <p>
            Declare when impact or credible risk needs coordinated attention.
            Record when impact began, what is known, what remains unknown and
            who owns response. Check recent changes and provider status early;
            neither proves a cause.
          </p>
        </Callout>
      </div>
    ),
  },
  {
    id: 'severity',
    label: 'Severity',
    hint: 'Use provisional impact',
    content: (
      <Section eyebrow="Triage" title="Choose urgency from plausible harm">
        <Prose>
          <p>
            These are local policy examples, not universal SEV numbers. Use a
            provisional severity while impact is uncertain, then reassess as
            evidence arrives. A small user count does not make data loss minor.
          </p>
        </Prose>
        <Drill
          idPrefix="incident-severity"
          question="How urgent is the response?"
          subtitle="Classify impact, then read why the response fits."
          options={SEVERITY_OPTIONS}
          rows={[
            {
              id: 'nudge',
              prompt:
                'Appointment reminders are delayed; no safe workaround is confirmed.',
              answer: 'major',
              why: 'Important customer work is blocked. Start response promptly and escalate if impact grows.',
            },
            {
              id: 'credential',
              prompt:
                'A deployment credential may be exposed, though the site responds.',
              answer: 'critical',
              why: 'Credible compromise calls for immediate containment and specialist help. Availability is not proof of safety.',
            },
            {
              id: 'limited',
              prompt:
                'One nonessential feature is degraded with a safe customer workaround.',
              answer: 'minor',
              why: 'Name an owner and an agreed response time; watch for wider impact.',
            },
          ]}
        />
      </Section>
    ),
  },
  {
    id: 'mitigation',
    label: 'Mitigation',
    hint: 'Choose a safe action',
    content: (
      <div className="space-y-8">
        <Section eyebrow="Act" title="Choose by evidence and likely harm">
          <Prose>
            <p>
              Investigate enough to select a safe mitigation while users remain
              affected. A rollback needs a relevant recent change, a known-good
              target and a schema compatibility check. It may be available but
              irrelevant to a provider outage. For every action, say when to
              stop if harm grows, then check the affected operation afterward.
            </p>
          </Prose>
          <RevealList
            idPrefix="incident-mitigation"
            rows={[
              {
                id: 'rollback',
                title: 'Rollback',
                summary: 'Recent change, known-good target, compatible data',
                body: (
                  <p>
                    Old code may not read the current schema. Stop if
                    incompatible or harm grows; check the customer operation and
                    error rate. Application rollback does not undo a database
                    migration.
                  </p>
                ),
              },
              {
                id: 'flag',
                title: 'Disable a feature',
                summary: 'Tested flag and known effect on accepted work',
                body: (
                  <p>
                    It may strand queued work. Stop if unrelated paths fail;
                    account for accepted work and advertise degraded behavior.
                  </p>
                ),
              },
              {
                id: 'capacity',
                title: 'Add capacity',
                summary: 'Confirmed saturation and downstream headroom',
                body: (
                  <p>
                    More workers can overload a dependency. Stop if dependency
                    errors rise; check queue age and latency.
                  </p>
                ),
              },
              {
                id: 'fallback',
                title: 'Degrade around a dependency',
                summary: 'Known safe fallback or bounded queue',
                body: (
                  <p>
                    Lost work, stale results and repeated side effects are
                    possible. Stop when outcomes become uncertain.
                  </p>
                ),
              },
              {
                id: 'forward',
                title: 'Fix forward',
                summary: 'Bounded change supported by evidence',
                body: (
                  <p>
                    Use when rollback is unsafe or irrelevant. Stop on failed
                    checks and monitor recurrence after verifying the affected
                    operation.
                  </p>
                ),
              },
            ]}
          />
        </Section>
        <Callout kind="warn" title="When no action is known safe">
          <p>
            Limit further harm, escalate and explain the current limitation. Do
            not restart, scale or replay blindly.
          </p>
        </Callout>
      </div>
    ),
  },
  {
    id: 'compromised-access',
    label: 'Compromised access',
    hint: 'Contain before reopening',
    content: (
      <Section eyebrow="Security branch" title="Availability is not safety">
        <Prose>
          <p>
            If access may be compromised, use the service&apos;s security
            response procedure and trusted administrative access. Contain or
            revoke affected access, preserve available logs and action
            timestamps, and restrict access to evidence. Do not delay urgent
            containment to finish a timeline.
          </p>
        </Prose>
        <Figure
          n={1}
          caption="The response branches when access may be compromised. An availability check cannot close it."
        >
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              'Contain unauthorized access',
              'Check what the credential could change',
              'Reopen only after security review',
            ].map((label, i) => (
              <Card key={label}>
                <p className="t-label mb-2 text-brand">
                  {String(i + 1).padStart(2, '0')}
                </p>
                <p className="text-sm font-medium">{label}</p>
              </Card>
            ))}
          </div>
        </Figure>
        <Callout kind="warn" title="Rollback does not revoke access">
          <p>
            Rolling the app back alone does not revoke a leaked deployment
            credential. Escalate to the security contact or provider support;
            forensics and notification decisions belong to the security response
            process.
          </p>
        </Callout>
      </Section>
    ),
  },
  {
    id: 'escalation',
    label: 'Escalation',
    hint: 'Keep an owner',
    content: (
      <Section eyebrow="People" title="Help needs a fallback route">
        <Prose>
          <p>
            Write the primary, backup, acknowledgment deadline and provider or
            specialist route before the incident. In Nudge, Bo is unavailable,
            so Ana contacts provider support and retains ownership. Increasing
            harm can bypass the normal deadline.
          </p>
        </Prose>
        <Figure
          n={2}
          caption="A message sent is not a handoff. The current responder owns the incident until the next one accepts its state and next action."
        >
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              'Primary misses deadline',
              'Backup unavailable → provider support',
              'Receiving responder accepts ownership',
            ].map((label, i) => (
              <Card key={label}>
                <p className="t-label mb-2 text-brand">
                  {String(i + 1).padStart(2, '0')}
                </p>
                <p className="text-sm font-medium">{label}</p>
              </Card>
            ))}
          </div>
        </Figure>
        <Callout title="What to send">
          <p>
            Impact, provisional severity, incident link, actions and observed
            results, plus the exact help required. Never send credentials. The{' '}
            <Term id="incident-commander">incident commander</Term> owns
            coordination; one developer may hold that role alone.
          </p>
        </Callout>
      </Section>
    ),
  },
  {
    id: 'customer-updates',
    label: 'Customer updates',
    hint: 'Keep the promise',
    content: (
      <Section
        eyebrow="Nudge timeline"
        title="Say what you know, then return on time"
      >
        <Prose>
          <p>
            State observed impact, current action, unknowns and the next update
            time in a channel customers can reach during the outage. Update at
            the promised time even if nothing changed. A next-update time is not
            a recovery estimate.
          </p>
        </Prose>
        <NudgeRehearsal />
      </Section>
    ),
  },
  {
    id: 'diagnosis',
    label: 'Diagnosis',
    hint: 'Test a hypothesis',
    content: (
      <Section eyebrow="Evidence" title="Separate observation from cause">
        <Prose>
          <p>
            Start with the affected operation, recent changes, dependency health
            and relevant timestamps. The earliest observed error is not
            necessarily the cause: telemetry gaps and clock differences can hide
            earlier events. A provider status page may lag or describe another
            region.
          </p>
        </Prose>
        <Figure
          n={3}
          caption="A falsifiable hypothesis gives each piece of evidence a job."
        >
          <div className="grid gap-3 sm:grid-cols-3">
            <Card>
              <p className="t-label mb-2 text-brand">Hypothesis</p>
              <p className="text-sm">
                The provider accepted reminders but timed out before
                acknowledging them.
              </p>
            </Card>
            <Card>
              <p className="t-label mb-2 text-go">Supports</p>
              <p className="text-sm">
                Authoritative provider result: accepted for the stable operation
                ID.
              </p>
            </Card>
            <Card>
              <p className="t-label mb-2 text-danger">Refutes</p>
              <p className="text-sm">
                An explicit rejection for the same operation ID points
                elsewhere.
              </p>
            </Card>
          </div>
        </Figure>
        <Callout title="Change one thing you can check">
          <p>
            Record what would support or refute the hypothesis and when you will
            stop. Continue deeper diagnosis after limiting impact; provider
            downtime does not release you from owning retries, queued work and
            communication.
          </p>
        </Callout>
      </Section>
    ),
  },
]
