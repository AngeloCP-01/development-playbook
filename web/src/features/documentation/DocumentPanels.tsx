'use client'
import Link from 'next/link'
import { useRef } from 'react'
import { RevealList } from '@/components/RevealList'
import { Term } from '@/components/Term'
import { Prose, Section } from '@/components/ui'
import { DocumentExample } from './DocumentExample'
import { ADRS, README } from './documents'
import { SelectionTabs } from './SelectionTabs'
export function ReadmePanel() {
  return (
    <Section title="Verify the README">
      <Prose>
        <p>
          The README is the entry point. Link detailed procedures when a short
          section would hide conditions. The outline below has project facts you
          must supply and check.
        </p>
      </Prose>
      <div className="mt-5">
        <DocumentExample example={README} />
      </div>
      <div className="mt-5">
        <RevealList
          idPrefix="documentation-readme"
          rows={[
            {
              id: 'fresh',
              title: 'Fresh-clone check',
              body: (
                <div>
                  <p>
                    Try a fresh clone without private instructions. Record
                    revision, prerequisites, configuration source, commands and
                    expected result. The first unresolved step becomes a fix.
                  </p>
                  <p className="mt-3">
                    A listed command is not evidence that anyone ran it.{' '}
                    <Link href="/stages/04-project-setup">
                      Stage 04 owns setup
                    </Link>
                    ; use{' '}
                    <Link href="/stages/13-production-deployment">
                      Stage 13 for releases
                    </Link>
                    ,{' '}
                    <Link href="/stages/14-post-deployment-verification">
                      Stage 14 for recovery checks
                    </Link>{' '}
                    and{' '}
                    <Link href="/stages/16-incident-management">
                      Stage 16 for incidents
                    </Link>
                    .
                  </p>
                </div>
              ),
            },
          ]}
        />
      </div>
    </Section>
  )
}
export function DecisionsPanel() {
  const root = useRef<HTMLDivElement>(null)
  function select(target: 'old' | 'replacement') {
    const tab = root.current?.querySelector<HTMLButtonElement>(
      `[data-selection-id="${target}"]`,
    )
    tab?.click()
    tab?.focus()
  }
  return (
    <Section title="Replace a decision without rewriting its history">
      <Prose>
        <p>
          A significant boundary, dependency, interface or deployment choice
          earns an <Term id="adr">ADR</Term>. Start with one page; include the
          reasons and consequences. Use sequential docs/adr/NNN-title.md names
          without reusing a number.
        </p>
        <p>
          These are illustrative Workshop records. Preserve the old reasoning,
          append a dated current-status notice, link both records and update any
          existing decision index.
        </p>
      </Prose>
      <div ref={root} className="mt-5">
        <SelectionTabs
          label="Decision records"
          items={(
            [
              ['old', 'ADR 004'],
              ['replacement', 'ADR 005'],
              ['template', 'Blank template'],
            ] as const
          ).map(([id, label]) => ({
            id,
            label,
            content: (
              <div>
                <DocumentExample
                  example={ADRS[id]}
                  relatedControl={
                    ADRS[id].related && (
                      <button
                        type="button"
                        onClick={() => select(ADRS[id].related!.target)}
                        className="t-ui mt-3 min-h-11 border border-line px-4 text-sm"
                      >
                        Read {ADRS[id].related!.label}
                      </button>
                    )
                  }
                />
              </div>
            ),
          }))}
        />
      </div>
      <div className="mt-5">
        <RevealList
          idPrefix="documentation-status"
          rows={[
            {
              id: 'format',
              title: 'Format and status',
              body: (
                <div>
                  <p>
                    Use Context, Decision, Reasoning, Consequences and
                    Alternatives with a date. Proposed means under
                    consideration; Rejected preserves a declined proposal&apos;s
                    reason; Accepted means adopted; Superseded links to a later
                    replacement.
                  </p>
                  <p className="mt-3">
                    Proposals can change during review. Accepted historical
                    reasons stay. The later notice states current status, while
                    the original acceptance remains historical.
                  </p>
                  <p className="mt-3">
                    <a href="https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions">
                      Nygard&apos;s ADR guidance
                    </a>{' '}
                    explains small decision records. The appended notice is this
                    playbook&apos;s preservation convention.
                  </p>
                </div>
              ),
            },
          ]}
        />
      </div>
    </Section>
  )
}
