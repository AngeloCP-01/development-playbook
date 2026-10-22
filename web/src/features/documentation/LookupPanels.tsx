import Link from 'next/link'
import { Figure } from '@/components/Figure'
import { RevealList } from '@/components/RevealList'
import { Prose, Section } from '@/components/ui'
import { ARTIFACTS, CHANGES, FACTS, HISTORY, NEEDS } from './lookups'
import { LookupInspector } from './LookupInspector'
export function ChoosePanel() {
  return (
    <Section title="Choose the document for the reader's task">
      <Prose>
        <p>
          Documentation runs continuously, a little with each change. Start with
          the smallest set that answers a real reader&apos;s question: a README,
          significant decisions and configuration facts the application actually
          needs.
        </p>
      </Prose>
      <div className="mt-5">
        <LookupInspector title="What does the reader need?" entries={NEEDS} />
      </div>
      <p className="my-4 text-sm text-muted">
        <a href="https://diataxis.fr/start-here/">
          Diátaxis distinguishes four reader needs
        </a>
        ; it does not require four folders.
      </p>
      <RevealList
        idPrefix="documentation-artifacts"
        rows={ARTIFACTS.map((row) => ({
          id: row.id,
          title: <span className="t-ui font-medium">{row.label}</span>,
          body: <p>{row.summary}</p>,
        }))}
      />
      <Prose>
        <p>
          A small patch may need only one entry.{' '}
          <a href="https://keepachangelog.com/en/1.1.0/">Keep a Changelog</a>{' '}
          explains curated history;{' '}
          <a href="https://docs.github.com/en/repositories/releasing-projects-on-github/about-releases">
            GitHub releases
          </a>{' '}
          provides audience-facing release material. The gathered template menu
          is not a nine-document mandate.
        </p>
      </Prose>
    </Section>
  )
}
export function ReferencePanel() {
  return (
    <Section title="State exact facts and current boundaries">
      <Prose>
        <p>
          A useful view names its scope, components, relationships, owner and
          review trigger. Link decisions for reasons;{' '}
          <Link href="/stages/03-architecture">
            Stage 03 owns architecture design
          </Link>
          .
        </p>
      </Prose>
      <Figure
        n={1}
        caption="Illustrative Workshop scope: one application and its booking store. No payment or email dependency is implied."
      >
        <div className="flex flex-wrap items-center gap-3 border border-line bg-sunken p-4 text-sm text-fg">
          <span>Attendee</span>
          <span>→ books or cancels →</span>
          <span>Workshop app</span>
          <span>→ reads/writes →</span>
          <span>Booking store</span>
        </div>
      </Figure>
      <p className="mb-4 text-sm text-muted">
        The maintainer reviews this view when a boundary or dependency changes.{' '}
        <a href="https://c4model.com/diagrams/checklist">
          C4&apos;s review checklist
        </a>{' '}
        helps check readability.
      </p>
      <LookupInspector
        title="Illustrative Workshop reference"
        entries={FACTS}
      />
      <Prose>
        <p>
          Record the applicable version and authoritative source. Treat absent,
          null and empty as distinct possibilities; document the behavior your
          actual contract defines. Generation follows its input and does not
          establish that the source is correct.
        </p>
      </Prose>
    </Section>
  )
}
export function ChangesPanel() {
  return (
    <Section title="Trace the change to documents and checks">
      <Prose>
        <p>
          When working alone, you are the owner. Give each living document a
          review trigger. Select the change to trace its source, affected
          documents and check.
        </p>
      </Prose>
      <div className="mt-5">
        <LookupInspector title="Change-to-document check" entries={CHANGES} />
      </div>
      <div className="mt-5">
        <RevealList
          idPrefix="documentation-drift"
          rows={[
            {
              id: 'validator',
              title: (
                <span className="t-ui font-medium">
                  Does configuration enforce itself?
                </span>
              ),
              body: (
                <p>
                  .env.example lists configuration. A validator enforces
                  accepted values only if the application actually invokes it.
                  This static playbook needs no environment variables; Workshop
                  is illustrative. Use safe placeholders, never real
                  credentials.
                </p>
              ),
            },
            {
              id: 'automation',
              title: (
                <span className="t-ui font-medium">
                  What does automation establish?
                </span>
              ),
              body: (
                <p>
                  Types check some shapes. Tests check the behavior their
                  assertions cover. Generation follows its input. Inspect the
                  source and expected diff; choose the check for the claim you
                  need to trust.{' '}
                  <a href="https://www.writethedocs.org/guide/docs-as-code/">
                    Docs as code
                  </a>{' '}
                  adds version control, review and automation.{' '}
                  <Link href="/stages/06-testing">
                    Stage 06 owns test design
                  </Link>
                  .
                </p>
              ),
            },
          ]}
        />
      </div>
    </Section>
  )
}
export function HistoryPanel() {
  return (
    <Section title="Keep historical reasons and current instructions usable">
      <LookupInspector
        title="What kind of document is this?"
        entries={HISTORY}
      />
      <p className="my-4 text-sm text-muted">
        Skip obvious comments and duplicated inventories nobody will maintain.
        Current structure and exact facts still earn their cost when they answer
        real questions.
      </p>
      <RevealList
        idPrefix="documentation-history"
        rows={[
          {
            id: 'commits',
            title: <span className="t-ui font-medium">Commit context</span>,
            body: (
              <div>
                <p>
                  Use a body when a reason, constraint or rejected alternative
                  matters later; a clear subject can be enough for a small
                  self-explanatory change. History preserves mistakes and
                  superseded intent too. Keep current instructions where readers
                  expect them.
                </p>
                <p className="mt-3">
                  <Link href="/stages/05-development#commits">
                    Stage 05 commit guidance
                  </Link>
                </p>
              </div>
            ),
          },
        ]}
      />
    </Section>
  )
}
