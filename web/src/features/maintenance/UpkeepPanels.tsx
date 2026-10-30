import Link from 'next/link'
import { Figure } from '@/components/Figure'
import { RevealList } from '@/components/RevealList'
import { Term } from '@/components/Term'
import { Callout, Prose, Section } from '@/components/ui'
import { Drill } from '@/features/observability/Drill'
import { TRIAGE, TRIAGE_OPTIONS } from './content'

export function TriagePanel() {
  return (
    <Section
      eyebrow="Continuous upkeep"
      title="Choose the next maintenance action"
    >
      <Prose>
        <p>
          Libraries lose support, domains expire and small workarounds become
          expensive. Maintenance starts while you intend to keep operating or
          changing the software. Keep one queue with evidence, impact, an owner,
          a next action and a review date.
        </p>
        <p>
          A weekly thirty-minute review is a starting suggestion. Triage during
          it and schedule larger work separately. Urgent advisories, expiry and
          user harm need an event-driven response. These panels are lookups;
          maintenance does not wait for stage 16 or for an incident.
        </p>
      </Prose>
      <Figure
        n={1}
        caption="A fictional queue: choose a disposition from the evidence, then read the reason."
      >
        <Drill
          idPrefix="maintenance-triage"
          question="How should this item enter the queue?"
          subtitle="Commit one answer per item. Unknown exposure needs investigation."
          options={TRIAGE_OPTIONS}
          rows={TRIAGE}
        />
      </Figure>
      <RevealList
        idPrefix="maintenance-review"
        rows={[
          {
            id: 'entry',
            title: 'Before the review',
            summary: 'Find the owners, checks and production signals.',
            body: (
              <p>
                Someone owns dependencies, services and recovery arrangements.
                You can find the checks and signals needed to assess a change. A
                static site still has domains and build tooling; database and
                credential checks apply only where used.
              </p>
            ),
          },
          {
            id: 'signals',
            title: 'Errors and service trends',
            summary:
              'Assign a disposition, rather than just clearing an inbox.',
            body: (
              <p>
                Fix, assign, suppress with a reason, or accept with a review
                date. Keep the time window, baseline, affected workflow and
                ticket. Compare latency and errors with traffic and workload; a
                different request mix can change the aggregate. Use{' '}
                <Link className="underline" href="/stages/15-observability">
                  observability
                </Link>{' '}
                to establish user impact.
              </p>
            ),
          },
        ]}
      />
    </Section>
  )
}

export function UpdatesPanel() {
  return (
    <Section eyebrow="Dependencies" title="A bot proposes; an owner reviews">
      <Prose>
        <p>
          Read changed versions, release notes and the lockfile diff.{' '}
          <Term id="semver">Semantic Versioning</Term> describes a publisher’s
          compatibility intent for its public API; it cannot prove compatibility
          with your app. Versions below 1.0.0 have weaker stability
          expectations. Development packages also run in builds and CI.
        </p>
      </Prose>
      <div className="my-6">
        <RevealList
          idPrefix="maintenance-upgrade"
          rows={[
            {
              id: 'target',
              title: 'Identify the target',
              summary:
                'Installed version, target version, support and migration guide.',
              body: (
                <p>
                  Use the official guide for the selected version. In pnpm 10,{' '}
                  <code>pnpm update</code> normally follows manifest ranges;{' '}
                  <code>--latest</code> ignores them. Choose a target
                  deliberately.
                  <a
                    className="ml-1 underline"
                    href="https://pnpm.io/10.x/cli/update"
                  >
                    pnpm 10 update reference
                  </a>
                  .
                </p>
              ),
            },
            {
              id: 'family',
              title: 'Bound the change',
              summary:
                'Use a branch and one independently testable package or compatible family.',
              body: (
                <p>
                  A framework, its React peer and matching tooling may need to
                  move together. Review migration steps and every codemod diff.
                  Commit manifest and lockfile together. Split unrelated changes
                  so their effects remain understandable and reversible.
                </p>
              ),
            },
            {
              id: 'verify',
              title: 'Check the affected behavior',
              summary:
                'Match checks to the package’s role and record warnings.',
              body: (
                <p>
                  Run relevant tests, a build or an affected user flow as
                  needed. Green CI does not establish package trustworthiness or
                  cover every workflow. Review supply-chain exposure and
                  unresolved warnings as well as the test result.
                </p>
              ),
            },
            {
              id: 'release',
              title: 'Prepare deployment and recovery',
              summary:
                'Decide how to verify release and recover before promotion.',
              body: (
                <p>
                  A code rollback may not reverse a database migration or an
                  external effect. Keep the deployment checks and recovery
                  approach alongside the upgrade record; see{' '}
                  <Link
                    className="underline"
                    href="/stages/13-production-deployment"
                  >
                    production deployment
                  </Link>
                  .
                </p>
              ),
            },
            {
              id: 'advisories',
              title: 'Review advisory fixes and bot groups',
              summary: 'An override or grouped PR still needs a risk decision.',
              body: (
                <div className="space-y-3">
                  <p>
                    In pnpm 10, <code>pnpm audit --fix</code> adds dependency
                    overrides. Review and test them; a quieter report does not
                    prove compatibility or removal of risk. Check exposure and
                    mitigation as well as severity.
                  </p>
                  <p>
                    Dependabot normally proposes individual version-update PRs.
                    Grouping requires configured rules; security and version
                    grouping have separate scopes. Keep groups small enough to
                    understand and revert.
                  </p>
                  <p>
                    Sources:{' '}
                    <a
                      className="underline"
                      href="https://pnpm.io/10.x/cli/audit"
                    >
                      pnpm 10 audit
                    </a>{' '}
                    and{' '}
                    <a
                      className="underline"
                      href="https://docs.github.com/en/code-security/reference/supply-chain-security/dependabot-options-reference#groups--"
                    >
                      GitHub’s grouping reference
                    </a>
                    .
                  </p>
                </div>
              ),
            },
          ]}
        />
      </div>
      <Callout title="Keep an upgrade record">
        <p>
          Record affected versions, the owner, migration decisions, actual
          checks, release and recovery decisions, and follow-up. A proposed PR
          does not establish that the upgrade is complete.
        </p>
      </Callout>
    </Section>
  )
}

export function ExpiryPanel() {
  return (
    <Section
      eyebrow="Domains and access"
      title="Verify renewal before the deadline"
    >
      <Prose>
        <p>
          Keep an inventory of the service, owner, due date, renewal mechanism,
          validation step and next reminder. Include domains, TLS certificates,
          API credentials, OAuth secrets and signing keys where used. Leave time
          for provider support, approval and a staged change; two weeks may be
          too late.
        </p>
      </Prose>
      <div className="my-6">
        <RevealList
          idPrefix="maintenance-expiry"
          rows={[
            {
              id: 'domain',
              title: 'Domain registration',
              summary:
                'Confirm renewal, ownership, payment and notice delivery.',
              body: (
                <p>
                  Renewing a TLS certificate does not renew the domain. Check
                  the registrar’s status and who receives its notices. Verify
                  automation succeeded and assign a backup owner for a missed
                  payment or inaccessible account.
                </p>
              ),
            },
            {
              id: 'tls',
              title: 'TLS certificates',
              summary:
                'Check which provider issues them and who must renew them.',
              body: (
                <p>
                  Vercel automatically attempts renewal for certificates it
                  issues, subject to correct domain configuration. Uploaded
                  certificates have different responsibilities. Verify the
                  actual status; see{' '}
                  <a
                    className="underline"
                    href="https://vercel.com/docs/domains/working-with-ssl"
                  >
                    Vercel’s SSL guidance
                  </a>
                  .
                </p>
              ),
            },
            {
              id: 'credential',
              title: 'Credentials and signing keys',
              summary: 'Identify consumers before changing a secret.',
              body: (
                <p>
                  For a planned{' '}
                  <Term id="credential-rotation">credential rotation</Term>,
                  identify consumers, distribute the replacement securely,
                  verify those consumers work, then revoke the old credential.
                  Overlap depends on the provider and situation. Exposure may
                  require immediate revocation; use the{' '}
                  <Link
                    className="underline"
                    href="/stages/16-incident-management#compromised-access"
                  >
                    compromised-access response
                  </Link>{' '}
                  when access is compromised.
                </p>
              ),
            },
          ]}
        />
      </div>
      <Callout
        kind="warn"
        title="The inventory contains references, not secret values"
      >
        <p>
          Keep credential values out of the queue, screenshots and exported
          notes. Record where authorized owners retrieve them securely and how
          successful rotation is checked.
        </p>
      </Callout>
    </Section>
  )
}
