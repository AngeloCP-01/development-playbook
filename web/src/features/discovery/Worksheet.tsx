'use client'

import { useState } from 'react'
import { Check, Copy, RotateCcw, Save } from 'lucide-react'
import { Card } from '@/components/ui'
import { useLocalStorage } from '@/lib/useLocalStorage'

type Field = {
  key: keyof Sheet
  label: string
  hint: string
  placeholder: string
  rows: number
}

type Sheet = {
  problem: string
  who: string
  today: string
  evidence: string
  severity: string
  success: string
  notThis: string
}

const EMPTY: Sheet = {
  problem: '',
  who: '',
  today: '',
  evidence: '',
  severity: '',
  success: '',
  notThis: '',
}

const FIELDS: Field[] = [
  {
    key: 'problem',
    label: 'The problem',
    hint: 'State it without naming a solution. If your sentence contains "an app that", rewrite it.',
    placeholder:
      'Freelancers with 5+ clients lose track of unpaid invoices and chase them late, or not at all.',
    rows: 3,
  },
  {
    key: 'who',
    label: 'Who has it',
    hint: 'Specific enough to design for. "Small businesses" is not an answer.',
    placeholder:
      'Solo freelancers, 5–20 active clients, currently on a spreadsheet plus manual email.',
    rows: 2,
  },
  {
    key: 'today',
    label: 'What they do today',
    hint: 'Your real competitor. Everyone already solves this somehow, even if the solution is tolerating it.',
    placeholder:
      'A spreadsheet with a "paid?" column, checked when they remember.',
    rows: 2,
  },
  {
    key: 'evidence',
    label: 'Evidence',
    hint: 'What people did, not what they said they would do. Quotes beat summaries.',
    placeholder:
      '6 conversations; 4 named chasing payments as their worst admin task; 2 had built spreadsheet reminders themselves.',
    rows: 4,
  },
  {
    key: 'severity',
    label: 'Severity, honestly',
    hint: 'Annoying / Costly / Painful / Blocking — and why you picked that one.',
    placeholder:
      'Painful. One person wrote off ~$3k last year purely from not following up.',
    rows: 2,
  },
  {
    key: 'success',
    label: 'What success looks like',
    hint: 'A state of the world, not a feature list.',
    placeholder:
      'A user knows, without thinking about it, which invoices are overdue and who to chase.',
    rows: 2,
  },
  {
    key: 'notThis',
    label: 'What this is NOT',
    hint: 'The most valuable box on this page, and the one people skip. Scope creep is easier to resist against something you wrote down while thinking clearly.',
    placeholder:
      'Not an accounting tool. Not tax filing. Not expense tracking.',
    rows: 3,
  },
]

function toMarkdown(s: Sheet): string {
  const section = (title: string, body: string) =>
    `## ${title}\n\n${body.trim() || '_(not answered)_'}\n`
  return [
    '# Product Discovery',
    '',
    section('Problem', s.problem),
    section('Who', s.who),
    section('What they do today', s.today),
    section('Evidence', s.evidence),
    section('Severity', s.severity),
    section('What success looks like', s.success),
    section('What this is NOT', s.notThis),
  ].join('\n')
}

export function Worksheet() {
  const { value, setValue, reset } = useLocalStorage<Sheet>(
    'playbook:discovery-worksheet',
    EMPTY,
  )
  const [copied, setCopied] = useState(false)

  const filled = FIELDS.filter((f) => value[f.key].trim().length > 0).length
  const complete = filled === FIELDS.length

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(toMarkdown(value))
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard blocked (insecure context or denied permission). The textareas
      // still hold the text, so the user can copy manually.
    }
  }

  return (
    <Card>
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium">Your one-page problem statement</p>
          <p className="mt-0.5 text-sm text-subtle">
            Saved in this browser as you type. Nothing leaves your machine.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="flex items-center gap-1.5 font-mono text-xs tabular-nums text-subtle"
            aria-live="polite"
          >
            {complete ? (
              <Check className="size-3.5 text-brand" aria-hidden />
            ) : (
              <Save className="size-3.5" aria-hidden />
            )}
            {filled}/{FIELDS.length}
          </span>
        </div>
      </div>

      <div className="space-y-5">
        {FIELDS.map((f) => {
          const id = `ws-${f.key}`
          return (
            <div key={f.key}>
              <label htmlFor={id} className="block text-sm font-medium text-fg">
                {f.label}
              </label>
              <p id={`${id}-hint`} className="mb-2 mt-0.5 text-sm text-subtle">
                {f.hint}
              </p>
              <textarea
                id={id}
                aria-describedby={`${id}-hint`}
                rows={f.rows}
                value={value[f.key]}
                placeholder={f.placeholder}
                onChange={(e) =>
                  setValue({ ...value, [f.key]: e.target.value })
                }
                className="w-full resize-y border border-line bg-sunken px-3.5 py-2.5 text-[15px] leading-6 text-fg transition-colors duration-150 placeholder:text-subtle/70 hover:border-line-strong focus:border-brand focus:outline-none focus-visible:outline-2 focus-visible:outline-brand"
              />
            </div>
          )
        })}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-line pt-4">
        <button
          type="button"
          onClick={copy}
          disabled={filled === 0}
          className="flex min-h-11 items-center gap-2 bg-brand px-4 text-sm font-medium text-brand-fg transition-opacity duration-150 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {copied ? (
            <Check className="size-4" aria-hidden />
          ) : (
            <Copy className="size-4" aria-hidden />
          )}
          {copied ? 'Copied' : 'Copy as Markdown'}
        </button>
        <button
          type="button"
          onClick={() => {
            if (window.confirm('Clear the worksheet? This cannot be undone.')) {
              reset()
            }
          }}
          disabled={filled === 0}
          className="flex min-h-11 items-center gap-2 border border-line px-3.5 text-sm text-muted transition-colors duration-150 hover:bg-sunken hover:text-fg disabled:cursor-not-allowed disabled:opacity-40"
        >
          <RotateCcw className="size-4" aria-hidden />
          Clear
        </button>
        <p className="text-sm text-subtle" aria-live="polite">
          {complete
            ? 'Complete — paste it into the repo and go decide.'
            : 'Paste the result into your project as docs/discovery.md'}
        </p>
      </div>
    </Card>
  )
}
