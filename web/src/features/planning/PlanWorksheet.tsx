'use client'

import { useState } from 'react'
import { Check, Copy, RotateCcw, Save } from 'lucide-react'
import { Card } from '@/components/ui'
import { useLocalStorage } from '@/lib/useLocalStorage'
import { CarryForward } from './CarryForward'

/**
 * The stage's persisted output: the one-page plan from `docs/02-planning.md:158-182`,
 * structurally copied from `discovery/Worksheet.tsx` — same key shape, same
 * counter, same copy/clear behaviour, under its own storage key so the two
 * stages never collide.
 *
 * `CarryForward` renders above the fields and can seed `doneMeans`/`notInV1`
 * from stage 01's answers. The horizon triage that reads this plan's `notInV1`
 * back lives in the next stepper step, not here: stepper panels are siblings,
 * not a parent chain, so that step reads `PLANNING_KEY` from storage (the reads
 * stay in sync through `useSyncExternalStore`) rather than receiving a prop
 * across a panel boundary it cannot cross.
 */

export type PlanSheet = {
  doneMeans: string
  slices: string
  notInV1: string
  risks: string
  openQuestions: string
}

export const PLANNING_KEY = 'playbook:planning-worksheet'

export const EMPTY_PLAN: PlanSheet = {
  doneMeans: '',
  slices: '',
  notInV1: '',
  risks: '',
  openQuestions: '',
}

type Field = {
  key: keyof PlanSheet
  label: string
  hint: string
  placeholder: string
  rows: number
}

const FIELDS: Field[] = [
  {
    key: 'doneMeans',
    label: 'Done means',
    hint: 'One sentence, checkable — a state you can hold the running product up against, not a feature list.',
    placeholder:
      'A freelancer can add a client, issue an invoice, and see which are overdue.',
    rows: 2,
  },
  {
    key: 'slices',
    label: 'Slices',
    hint: 'Numbered, each end to end, sized, riskiest scheduled early.',
    placeholder:
      '1. Create + view an invoice — M\n2. Mark paid — S\n3. Overdue list — S\n4. Clients as records — M\n5. Auth + multi-user — M',
    rows: 5,
  },
  {
    key: 'notInV1',
    label: 'Not in v1',
    hint: 'The part that does actual work over the following weeks. Write it down while you can still think clearly — one item per line, since it becomes the list you triage below.',
    placeholder:
      'Email reminders\nPDF export\nMulti-currency\nTeam accounts\nDark mode',
    rows: 4,
  },
  {
    key: 'risks',
    label: 'Risks',
    hint: 'Named while they are still cheap to name, with where each gets decided.',
    placeholder:
      'Auth choice affects the data model — decide before slice 4.\nDate/timezone handling for "overdue" is fiddlier than it looks.',
    rows: 3,
  },
  {
    key: 'openQuestions',
    label: 'Open questions',
    hint: 'Listed with a plan to resolve them, not a promise to remember them.',
    placeholder:
      'Do overdue calculations use the client’s timezone or the user’s?',
    rows: 2,
  },
]

function toMarkdown(s: PlanSheet): string {
  const section = (title: string, body: string) =>
    `## ${title}\n\n${body.trim() || '_(not answered)_'}\n`
  return [
    '# One-page plan',
    '',
    section('Done means', s.doneMeans),
    section('Slices', s.slices),
    section('Not in v1', s.notInV1),
    section('Risks', s.risks),
    section('Open questions', s.openQuestions),
  ].join('\n')
}

export function PlanWorksheet() {
  const { value, setValue, reset } = useLocalStorage<PlanSheet>(
    PLANNING_KEY,
    EMPTY_PLAN,
  )
  const [copied, setCopied] = useState(false)

  const filled = FIELDS.filter((f) => value[f.key].trim().length > 0).length
  const complete = filled === FIELDS.length

  const canSeed = (field: 'doneMeans' | 'notInV1') =>
    value[field].trim().length === 0

  const onSeed = (field: 'doneMeans' | 'notInV1', text: string) => {
    if (!canSeed(field)) return
    setValue({ ...value, [field]: text })
  }

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(toMarkdown(value))
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard blocked (insecure context or denied permission). The
      // textareas still hold the text, so the reader can copy manually.
    }
  }

  return (
    <Card>
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium">Your one-page plan</p>
          <p className="mt-0.5 text-sm text-subtle">
            Saved in this browser as you type. Nothing leaves your machine.
          </p>
        </div>
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

      <CarryForward onSeed={onSeed} canSeed={canSeed} />

      <div className="space-y-5 border-t border-line pt-5">
        {FIELDS.map((f) => {
          const id = `plan-${f.key}`
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
        <span aria-live="polite" className="sr-only">
          {copied ? 'Copied to clipboard' : ''}
        </span>
        <button
          type="button"
          onClick={() => {
            if (window.confirm('Clear the plan? This cannot be undone.')) {
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
            ? 'Complete — paste it into the repo as your plan.'
            : 'Paste the result into your project as docs/plan.md'}
        </p>
      </div>
    </Card>
  )
}
