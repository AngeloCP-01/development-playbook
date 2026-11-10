import { Figure } from '@/components/Figure'
import { RevealList } from '@/components/RevealList'
import { TeamNotes } from '@/components/TeamNotes'
import { Callout, Prose, Section } from '@/components/ui'
import { RECORD, TRAPS } from './content'

export function ReviewPanel() {
  return (
    <div className="space-y-8">
      <Section
        eyebrow="A usable record"
        title="Leave the next owner enough to act"
      >
        <Prose>
          <p>
            This is a fictional maintenance record, not evidence of an upgrade
            or incident in this repository. Open a field to see what your own
            record needs. Keep a maintenance queue, upgrade records, expiry
            inventory, approved retention policies, restore results and debt or
            retirement decisions in proportion to your application.
          </p>
        </Prose>
        <Figure
          n={3}
          caption="The chapter’s fictional build-plugin record. Proposed checks still need actual results."
        >
          <RevealList
            idPrefix="maintenance-record"
            rows={RECORD.map((field) => ({
              id: field.id,
              title: field.title,
              summary: field.summary,
              body: <p>{field.detail}</p>,
            }))}
          />
        </Figure>
      </Section>
      <Section title="Close this review, then set the next one">
        <Prose>
          <p>
            Maintenance continues. A reviewed queue may still contain work. Open
            each check and compare it with your actual records; opening these
            explanations does not record a completed maintenance action.
          </p>
        </Prose>
        <div className="my-6">
          <RevealList
            idPrefix="maintenance-done"
            rows={[
              {
                id: 'triage',
                title:
                  'Advisories, deadlines and service signals have follow-up',
                body: (
                  <p>
                    New advisories and dependency proposals have an owner and a
                    disposition. Urgent risks and deadlines have actions before
                    the next review. Unresolved errors and unexplained trends
                    have recorded follow-up.
                  </p>
                ),
              },
              {
                id: 'operations',
                title:
                  'Expiry, retention and recovery checks match the application',
                body: (
                  <p>
                    Applicable expiry and growth checks are current;
                    inapplicable ones are marked. Retention and recovery
                    arrangements fit current needs. The latest required restore
                    drill has evidence and its gaps are assigned.
                  </p>
                ),
              },
              {
                id: 'decisions',
                title: 'Completed and deferred work have evidence and dates',
                body: (
                  <p>
                    Completed changes include checks, observed results and
                    follow-up dates. Deferred debt and retirements still have a
                    reason, an owner and a review date.
                  </p>
                ),
              },
            ]}
          />
        </div>
        <TeamNotes>
          <p>
            Assign owners and backups, with access to the relevant dashboards
            and a handoff for urgent work.
          </p>
          <p>
            Reserve capacity from queue evidence, deadlines, repeated incidents
            and recurring manual work. Review the budget when those signals
            change.
          </p>
          <p>
            Keep renewal, upgrade and recovery instructions where the next owner
            can find them. Automate stable tasks with visible failures and a
            recovery path, then check whether recurring effort actually fell.
          </p>
        </TeamNotes>
      </Section>
      <Section title="Watch for maintenance traps">
        <RevealList
          idPrefix="maintenance-traps"
          rows={TRAPS.map((trap) => ({
            id: trap.id,
            title: trap.title,
            body: (
              <Callout kind="trap" title={trap.title}>
                <p>{trap.detail}</p>
              </Callout>
            ),
          }))}
        />
      </Section>
    </div>
  )
}
