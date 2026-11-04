import Link from 'next/link'
import { Figure } from '@/components/Figure'
import { RevealList } from '@/components/RevealList'
import { TeamNotes } from '@/components/TeamNotes'
import { Term } from '@/components/Term'
import { Callout, Prose, Section } from '@/components/ui'
import { Drill } from '@/features/observability/Drill'
import { DONE, RECORD, RESULT, RESULT_OPTIONS, TRAPS } from './content'

export function CyclePanel() {
  return (
    <Section
      eyebrow="Plan · Do · Study · Act"
      title="Compare the result with the prediction"
    >
      <Prose>
        <p>
          The <Term id="pdsa">PDSA cycle</Term> makes a prediction, tries a
          change, studies what happened and adjusts the approach. This
          playbook’s record adapts that learning cycle; its fields are not a
          prescribed standard.
        </p>
        <p>
          In this fictional invoice example, three observed participants
          overlook a required date field. Jo tries clearer guidance. Inspect the
          record, then judge the review evidence.
        </p>
      </Prose>
      <Figure
        n={4}
        caption="A fictional improvement record. Write the prediction, comparable baseline, owner and harm checks before changing anything."
      >
        <RevealList
          idPrefix="improvement-record"
          rows={RECORD.map((field) => ({
            id: field.id,
            title: field.title,
            summary: field.summary,
            body: <p>{field.detail}</p>,
          }))}
        />
      </Figure>
      <Figure
        n={5}
        caption="The count moves from 18/30 to 20/28, but a changed audience weakens the comparison."
      >
        <Drill
          idPrefix="improvement-result"
          question="What does the review establish?"
          subtitle="A higher proportion is not enough to claim causality."
          options={RESULT_OPTIONS}
          rows={RESULT}
        />
      </Figure>
      <RevealList
        idPrefix="improvement-experiment"
        rows={[
          {
            id: 'comparison',
            title: 'Choose a credible review method',
            summary:
              'Before/after, experiments and sparse traffic have different limits.',
            body: (
              <div className="space-y-3">
                <p>
                  A before/after change can reflect seasonality, audience
                  changes or other releases. If a randomized experiment fits,
                  plan the population, measures, sample needs and stopping
                  method first. Check assignment and telemetry quality; use
                  methods that account for repeated looks at the results.
                </p>
                <p>
                  Monitor harm throughout. Do not declare a winner from a
                  convenient early movement. With sparse traffic, a bounded
                  usability study may help more; label what it cannot establish
                  about population-wide impact. See{' '}
                  <a
                    className="underline"
                    href="https://www.microsoft.com/en-us/research/articles/patterns-of-trustworthy-experimentation-during-experiment-stage/"
                  >
                    Microsoft’s during-experiment guidance
                  </a>
                  .
                </p>
              </div>
            ),
          },
        ]}
      />
    </Section>
  )
}

export function DeliveryPanel() {
  return (
    <Section
      eyebrow="Working conditions"
      title="Investigate friction before automating it"
    >
      <Prose>
        <p>
          Look at where work waited, needed rework, felt risky or repeatedly
          required manual effort. Ask why someone avoided a test or release:
          slowness, uncertainty, competing work and a missing permission suggest
          different fixes. A repeated workaround is a clue, not a diagnosis.
        </p>
      </Prose>
      <div className="my-6">
        <RevealList
          idPrefix="improvement-delivery"
          rows={[
            {
              id: 'dora',
              title: 'Read delivery measures together',
              summary:
                'Five DORA measures, in one application or service over time.',
              body: (
                <div className="space-y-3">
                  <dl className="space-y-3 text-sm leading-6 text-muted">
                    <div>
                      <dt className="font-medium text-fg">Change lead time</dt>
                      <dd>Time for a committed change to reach production.</dd>
                    </div>
                    <div>
                      <dt className="font-medium text-fg">
                        Deployment frequency
                      </dt>
                      <dd>How often changes reach production.</dd>
                    </div>
                    <div>
                      <dt className="font-medium text-fg">
                        Failed deployment recovery time
                      </dt>
                      <dd>
                        Recovery after a failed deployment requires
                        intervention, not every operational incident.
                      </dd>
                    </div>
                    <div>
                      <dt className="font-medium text-fg">Change fail rate</dt>
                      <dd>
                        The proportion of deployments requiring immediate
                        intervention.
                      </dd>
                    </div>
                    <div>
                      <dt className="font-medium text-fg">
                        Deployment rework rate
                      </dt>
                      <dd>
                        The proportion of unplanned deployments resulting from
                        production incidents.
                      </dd>
                    </div>
                  </dl>
                  <p>
                    <a
                      className="underline"
                      href="https://dora.dev/guides/dora-metrics/"
                    >
                      DORA’s guide
                    </a>{' '}
                    names these five measures (research checked 30 October
                    2026). Interpret them together, avoid quotas and comparisons
                    between unlike services, and keep product outcomes separate.
                  </p>
                </div>
              ),
            },
            {
              id: 'space',
              title: 'Pair measures with people’s experience',
              summary: 'Activity alone does not measure productivity.',
              body: (
                <p>
                  The{' '}
                  <a
                    className="underline"
                    href="https://www.microsoft.com/en-us/research/publication/the-space-of-developer-productivity-theres-more-to-it-than-you-think/"
                  >
                    SPACE research
                  </a>{' '}
                  explains why activity alone cannot measure developer
                  productivity. Commit counts, lines of code and AI-generated
                  output are not individual performance scores. Ask about
                  interruptions, uncertainty and rework alongside delivery data.
                </p>
              ),
            },
            {
              id: 'action',
              title: 'Own one manageable change when capacity is tight',
              summary: 'A starting heuristic, not a limit on urgent repairs.',
              body: (
                <p>
                  Choose an owner, review date and way to see whether the change
                  helped. Check the previous action before adding another list
                  of promises. The{' '}
                  <a
                    className="underline"
                    href="https://scrumguides.org/scrum-guide.html#sprint-retrospective"
                  >
                    2020 Scrum Guide
                  </a>{' '}
                  calls for useful changes, not exactly one action per
                  retrospective. Urgent repairs can proceed in parallel.
                </p>
              ),
            },
            {
              id: 'incidents',
              title: 'Look across incidents without assigning blame',
              summary: 'Recurring conditions need investigation and follow-up.',
              body: (
                <p>
                  Use{' '}
                  <Link
                    className="underline"
                    href="/stages/16-incident-management"
                  >
                    incident follow-ups
                  </Link>{' '}
                  to inspect repeated system conditions, selected remedies and
                  unfinished actions. Repeated incidents do not prove a single
                  root cause. A solo developer can use the same questions in a
                  short written review.
                </p>
              ),
            },
          ]}
        />
      </div>
      <Callout title="Check whether the process change helped">
        <p>
          A runbook, permission fix or clearer ownership may fit better than
          automation. Review useful outcomes and recurring effort, including
          ongoing maintenance cost.
        </p>
      </Callout>
    </Section>
  )
}

function ImprovementChecklist() {
  return (
    <Section title="Close this review with evidence">
      <Prose>
        <p>
          Keep an evidence list separating observations, interpretations and
          unknowns; a decision record for selected and deferred work; an
          improvement record with its actual result; and updated guidance where
          justified. Open each check against your own records. Opening it does
          not mark work complete.
        </p>
      </Prose>
      <div className="my-6">
        <RevealList
          idPrefix="improvement-done"
          rows={DONE.map((check) => ({
            id: check.id,
            title: check.title,
            body: <p>{check.detail}</p>,
          }))}
        />
      </div>
      <TeamNotes>
        <p>
          Review product findings with the people who build and support the
          service. Use retrospectives to inspect working conditions and choose
          practical changes.
        </p>
        <p>
          Make owners, tradeoffs and follow-up visible; rotate facilitation when
          useful. Look across incidents without ranking or blaming people. Keep
          outcomes alongside delivery data so shipping volume does not become
          the purpose.
        </p>
      </TeamNotes>
    </Section>
  )
}

export function ReviewPanel() {
  return (
    <div className="space-y-8">
      <Section
        eyebrow="Recurring review"
        title="Change the guidance, or pause feature work"
      >
        <Prose>
          <p>
            Stage 18 is not a finish line. Return to discovery when evidence
            changes; maintaining a useful product without adding features is a
            valid decision.
          </p>
        </Prose>
        <div className="my-6">
          <RevealList
            idPrefix="improvement-guidance"
            rows={[
              {
                id: 'guidance',
                title: 'Update advice from experience',
                summary:
                  'Keep the chapter, page and decision history consistent.',
                body: (
                  <p>
                    Record what happened, the conditions and a check that would
                    catch a recurrence. Update the relevant chapter and
                    hand-ported interactive page together, keep source findings
                    in one research record and completion evidence in the
                    tracker. If a practice is repeatedly skipped, inspect
                    whether it is unnecessary, too costly or poorly explained
                    before revising or retiring it. Preserve past decisions.
                  </p>
                ),
              },
              {
                id: 'pause',
                title: 'Pause features with an operating plan',
                summary:
                  'Useful restraint still needs maintenance and support.',
                body: (
                  <p>
                    Check whether the product still solves the intended problem,
                    remaining requests fit its audience and added value
                    justifies ongoing cost. Assign maintenance and support
                    responsibilities. For retirement, use{' '}
                    <Link className="underline" href="/stages/17-maintenance">
                      Maintenance
                    </Link>{' '}
                    for migration and recovery checks. Return to discovery if
                    needs change.
                  </p>
                ),
              },
            ]}
          />
        </div>
      </Section>
      <ImprovementChecklist />
      <Section title="Watch for improvement traps">
        <RevealList
          idPrefix="improvement-traps"
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
