import Link from 'next/link'
import { Figure } from '@/components/Figure'
import { RevealList } from '@/components/RevealList'
import { Term } from '@/components/Term'
import { Callout, Prose, Section } from '@/components/ui'
import { Drill } from '@/features/observability/Drill'
import {
  RECOVERY,
  RECOVERY_OPTIONS,
  RETIREMENT,
  RETIREMENT_OPTIONS,
} from './content'

export function DataPanel() {
  return (
    <Section
      eyebrow="Stored data"
      title="Approve what to keep; prove what you can restore"
    >
      <Prose>
        <p>
          Check growth, slow queries and query plans against the workload.
          Before deleting anything, agree a{' '}
          <Term id="retention-policy">retention policy</Term>: what stays, why,
          for how long, who approves removal and which records are excluded.
          Logs, sessions, events and customer records need different policies.
        </p>
      </Prose>
      <div className="my-6">
        <RevealList
          idPrefix="maintenance-data"
          rows={[
            {
              id: 'retention',
              title: 'Preview and bound cleanup',
              summary:
                'An illustrative policy, with no runnable delete or universal duration.',
              body: (
                <p>
                  Expired sessions become eligible only after the application’s
                  approved grace period. Preview candidate counts, verify
                  timestamp meaning and exclusions, and test on isolated data.
                  Choose a bounded batch size, monitor load, confirm the result
                  and check failure handling before scheduling. Preserve
                  required audit evidence and account for recovery copies;
                  deleting from the database does not erase every backup.
                </p>
              ),
            },
            {
              id: 'vacuum',
              title: 'Check storage behavior',
              summary:
                'Deleting rows does not necessarily shrink the database file.',
              body: (
                <p>
                  In PostgreSQL, old row versions remain after a delete. Routine
                  vacuuming makes space reusable; standard vacuum generally does
                  not return it to the operating system. Check autovacuum
                  health. <code>VACUUM FULL</code> takes an exclusive lock and
                  is not the routine answer. See{' '}
                  <a
                    className="underline"
                    href="https://www.postgresql.org/docs/18/routine-vacuuming.html"
                  >
                    PostgreSQL 18’s vacuuming guide
                  </a>
                  .
                </p>
              ),
            },
            {
              id: 'drill',
              title: 'Prepare an isolated restore drill',
              summary:
                'Agree acceptable data loss and recovery time before testing.',
              body: (
                <div className="space-y-3">
                  <p>
                    A <Term id="restore-drill">restore drill</Term> tests the
                    recovery arrangement against those targets. Restrict access
                    to copied production data and keep email, payments, webhooks
                    and scheduled-job effects disabled. Choose a point, restore,
                    check expected records and application access, measure
                    through reconnection, and clean up resources.
                  </p>
                  <p>
                    Neon recovery depends on the project’s configured history
                    window, plan and settings. Check the actual window first;
                    see{' '}
                    <a
                      className="underline"
                      href="https://neon.com/docs/introduction/branching#restore-and-recover-data"
                    >
                      Neon’s recovery overview
                    </a>
                    . Other stores, files, credentials and configuration need
                    their own arrangements. A quarterly drill is a possible
                    starting policy; repeat at a service-appropriate cadence and
                    after material changes.
                  </p>
                </div>
              ),
            },
          ]}
        />
      </div>
      <Figure
        n={2}
        caption="Fictional restore reports: distinguish a provider operation from validated recovery."
      >
        <Drill
          idPrefix="maintenance-recovery"
          question="Does this report establish a recovery result?"
          subtitle="Judge the evidence for this scope, not the provider’s advertised capability."
          options={RECOVERY_OPTIONS}
          rows={RECOVERY}
        />
      </Figure>
      <Callout title="Keep the drill result">
        <p>
          Record the newest recoverable data, observed loss, elapsed recovery
          time, checks and gaps with owners. A backup is useful only if you can
          restore and validate it.
        </p>
      </Callout>
    </Section>
  )
}

export function DebtPanel() {
  return (
    <Section
      eyebrow="Cost of change"
      title="Repay a cost; check consumers before retiring"
    >
      <Prose>
        <p>
          <Term id="technical-debt">Technical debt</Term> may be deliberate or
          discovered later. Look for repeated fixes, duplicated decisions, slow
          changes and unclear ownership. Record the cost, the smallest useful
          change and how you will check its effect. A recurring bug warrants
          investigation; it does not prove the whole design needs replacing.
        </p>
        <p>
          <a
            className="underline"
            href="https://martinfowler.com/bliki/TechnicalDebtQuadrant.html"
          >
            Martin Fowler’s debt quadrant
          </a>{' '}
          separates intent from care in the decision. The four cases below are
          illustrative paraphrases; they explain how debt arises, rather than
          ranking what to repay.
        </p>
      </Prose>
      <div className="my-6">
        <RevealList
          idPrefix="maintenance-debt"
          rows={[
            {
              id: 'reckless-deliberate',
              title: 'Reckless · deliberate',
              summary:
                'A known design concern is dismissed without examining its cost.',
              body: (
                <p>
                  Ignoring a known constraint can make the next change
                  expensive. Establish today’s impact before choosing the
                  repayment scope.
                </p>
              ),
            },
            {
              id: 'prudent-deliberate',
              title: 'Prudent · deliberate',
              summary:
                'A team accepts a specific trade-off with its cost understood.',
              body: (
                <p>
                  Keep the reason and the conditions for revisiting it. An
                  intentional shortcut still needs an owner and a review date.
                </p>
              ),
            },
            {
              id: 'reckless-inadvertent',
              title: 'Reckless · inadvertent',
              summary:
                'A design problem results from missing relevant knowledge.',
              body: (
                <p>
                  Improve understanding and verify current behavior before
                  changing the structure. Use the category to explain the
                  decision, rather than blame its author.
                </p>
              ),
            },
            {
              id: 'prudent-inadvertent',
              title: 'Prudent · inadvertent',
              summary: 'Working with the system reveals a better design later.',
              body: (
                <p>
                  Learning can expose a cost that was hard to see earlier.
                  Reassess with the new evidence; this does not make every
                  previous choice careless.
                </p>
              ),
            },
            {
              id: 'refactor',
              title: 'Choose a bounded refactor',
              summary:
                'Three changes edited one validation rule in two places.',
              body: (
                <p>
                  Before the next change, cover current accepted and rejected
                  inputs, move the shared rule behind one interface, and check
                  both callers. Nearby refactoring can fit feature work; larger
                  migrations may need planned increments, compatibility steps
                  and an owner. Keep behavior changes reviewable. See{' '}
                  <Link className="underline" href="/stages/06-testing">
                    testing
                  </Link>{' '}
                  for meaningful coverage.
                </p>
              ),
            },
          ]}
        />
      </div>
      <Drill
        idPrefix="maintenance-retirement"
        question="Is the retirement plan ready to proceed?"
        subtitle="Fictional proposals. Check runtime use, callers, jobs, integrations and support knowledge."
        options={RETIREMENT_OPTIONS}
        rows={RETIREMENT}
      />
    </Section>
  )
}
