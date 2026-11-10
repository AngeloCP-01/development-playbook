'use client'
import Link from 'next/link'
import { useId } from 'react'
import { TeamNotes } from '@/components/TeamNotes'
import { Card, Section } from '@/components/ui'
import { CopyMarkdown } from './CopyMarkdown'
import { useDocumentationSession } from './DocumentationSession'
import { CHECKS, FIELDS, hasRecord, recordMarkdown, TEAM_NOTES } from './record'
function RecordActions() {
  const { record, warning, clear, clearFailed } = useDocumentationSession()
  const filled = FIELDS.filter((f) => record[f.id].trim()).length
  const present = hasRecord(record)
  return (
    <div className="mt-5">
      <p aria-live="polite" className="t-data text-sm text-muted">
        {filled} of 8 fields recorded
      </p>
      <p className="mt-2 text-sm text-muted">
        Recording fields and checks does not verify documentation. Documentation
        remains continuous work.
      </p>
      <p aria-live="polite" className="mt-2 text-sm text-warn">
        {warning}
      </p>
      <CopyMarkdown text={recordMarkdown(record)} disabled={!present} />
      <button
        type="button"
        disabled={!present && !clearFailed}
        onClick={clear}
        className="t-ui mt-3 min-h-11 border border-line px-4 text-sm disabled:text-subtle"
      >
        Clear whole record
      </button>
    </div>
  )
}
export function RecordPanel({ view }: { view: 'change' | 'evidence' }) {
  const root = useId()
  const { record, setField } = useDocumentationSession()
  return (
    <Section
      title={
        view === 'change'
          ? 'Plan your documentation change'
          : 'Plan the check and record evidence'
      }
    >
      <Card>
        <p className="mb-4 text-sm text-muted">
          Your application only. No example answers are inserted. Saved in this
          browser when storage is available; export the whole record from either
          view.
        </p>
        <div className="space-y-5">
          {FIELDS.filter((f) => f.view === view).map((field) => (
            <div key={field.id}>
              <label
                htmlFor={`${root}-${field.id}`}
                className="t-ui block text-sm font-medium"
              >
                {field.label}
              </label>
              <p
                id={`${root}-${field.id}-hint`}
                className="my-2 text-sm text-muted"
              >
                {field.hint}
              </p>
              <textarea
                id={`${root}-${field.id}`}
                aria-describedby={`${root}-${field.id}-hint`}
                value={record[field.id]}
                rows={2}
                onChange={(e) => setField(field.id, e.target.value)}
                className="t-ui w-full resize-y border border-line bg-sunken px-3 py-2 text-[15px] leading-6 text-fg focus-visible:outline-2 focus-visible:outline-brand"
              />
            </div>
          ))}
        </div>
        <RecordActions />
      </Card>
    </Section>
  )
}
export function ChecklistPanel() {
  const { record, toggleCheck } = useDocumentationSession()
  return (
    <Section title="Review this change and keep periodic checks visible">
      <Card>
        <p className="mb-4 text-sm text-muted">
          These are self-recorded selections. Periodic checks have their own
          cadence; they do not certify this stage as finished.
        </p>
        {[false, true].map((periodic) => (
          <fieldset key={String(periodic)} className="mb-5 min-w-0">
            <legend className="t-head mb-3 text-lg">
              {periodic ? 'Periodic' : 'Per-change'} checks
            </legend>
            <div className="space-y-2">
              {CHECKS.filter((c) => c.periodic === periodic).map((check) => (
                <label
                  key={check.id}
                  className="t-ui relative flex min-h-11 cursor-pointer items-start gap-3 border border-line p-3 text-sm focus-within:outline-2 focus-within:outline-brand"
                >
                  <input
                    type="checkbox"
                    checked={record.checked.includes(check.id)}
                    onChange={() => toggleCheck(check.id)}
                    className="peer absolute inset-0 h-full w-full cursor-pointer opacity-0"
                  />
                  <span
                    aria-hidden
                    className="mt-1 size-4 shrink-0 border border-line peer-checked:border-brand peer-checked:bg-brand"
                  />
                  <span className="min-w-0 break-words">{check.text}</span>
                </label>
              ))}
            </div>
          </fieldset>
        ))}
        <RecordActions />
        <div className="mt-6">
          <TeamNotes>
            <ul className="space-y-3">
              {TEAM_NOTES.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
            <p className="mt-3">
              <Link
                href="/stages/16-incident-management"
                className="t-ui inline-flex min-h-11 items-center"
              >
                Stage 16 incident response
              </Link>
            </p>
          </TeamNotes>
        </div>
      </Card>
    </Section>
  )
}
