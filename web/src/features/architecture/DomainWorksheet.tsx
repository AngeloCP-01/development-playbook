'use client'

import { useState } from 'react'
import { Check, Copy, RotateCcw, Save } from 'lucide-react'
import { Card } from '@/components/ui'
import { useLocalStorage } from '@/lib/useLocalStorage'
import {
  ARCHITECTURE_KEY,
  EMPTY_DOMAIN,
  type DomainSheet,
} from '@/lib/architecture-sheet'
import { ArchCarryForward, type SeedField } from './ArchCarryForward'

/**
 * The stage's persisted output: four of the five interrogation questions turned
 * on the reader's own domain, plus the decisions that earned an ADR. The fifth
 * — whether every actor has the same rights over an entity — is not a field
 * here, because the doc has its answer land in the authorization pattern
 * instead (docs/03-architecture.md, "Authentication and authorization"). Adding
 * a fifth field would also change the persisted `DomainSheet` shape under
 * readers who already have answers saved.
 *
 * Structurally `PlanWorksheet` (planning) — same key shape, same counter, same
 * copy/clear behaviour — under its own storage key so the two stages never
 * collide.
 *
 * The hints deliberately ask the question rather than answer it. This sheet
 * sits in the same panel as `ModelInterrogation`, which scores all five of those
 * questions on the doc's invoice domain, so a hint that said "compute it, do not
 * store it" would hand the reader the verdict for an exercise they have not
 * committed to yet. The placeholders are drawn from a different domain for the
 * same reason.
 */

type Field = {
  key: keyof DomainSheet
  label: string
  hint: string
  placeholder: string
  rows: number
}

const FIELDS: Field[] = [
  {
    key: 'entities',
    label: 'Nouns and relationships',
    hint: 'Your domain in sentences, before any table exists. One line per relationship, with the verb that says how — and the cardinality you actually mean, including the ones that could plausibly change later.',
    placeholder:
      'A User has many Projects.\nA Project has many Tasks.\nA Task has many Comments.',
    rows: 4,
  },
  {
    key: 'derived',
    label: 'Stored or computed',
    hint: 'Which of your values are derived from other values? Name each one and what it derives from, then decide which way each is held.',
    placeholder:
      '“Progress” — from tasks done ÷ tasks total\n“Last active” — from the newest comment',
    rows: 3,
  },
  {
    key: 'deletion',
    label: 'On delete',
    hint: 'Per entity: what happens when someone deletes one, and what happens to everything pointing at it. The answer is different for a comment and for a financial record.',
    placeholder:
      'Project — and what becomes of its Tasks\nComment — and whether the author can take it back',
    rows: 3,
  },
  {
    key: 'uniqueness',
    label: 'Unique, and in what scope',
    hint: 'What must be unique — and unique within what? “Unique” with no scope named is the half that bites months later.',
    placeholder:
      'Project name — globally, or per workspace?\nInvite code — globally',
    rows: 3,
  },
  {
    key: 'decisions',
    label: 'Decisions that need an ADR',
    hint: 'The ones expensive to undo. A line each: the decision, the alternative you turned down, and what would have to be true for you to revisit it.',
    placeholder:
      'Where user identity lives — a provider, not our own tables. Decide before the first migration.\nWhich database. Postgres, because everything here assumes relational.',
    rows: 4,
  },
]

function toMarkdown(s: DomainSheet): string {
  const section = (title: string, body: string) =>
    `## ${title}\n\n${body.trim() || '_(not answered)_'}\n`
  return [
    '# Domain model',
    '',
    ...FIELDS.map((f) => section(f.label, s[f.key])),
  ].join('\n')
}

export function DomainWorksheet() {
  const { value, setValue, reset } = useLocalStorage<DomainSheet>(
    ARCHITECTURE_KEY,
    EMPTY_DOMAIN,
  )
  const [copied, setCopied] = useState(false)

  const filled = FIELDS.filter((f) => value[f.key].trim().length > 0).length
  const complete = filled === FIELDS.length

  // The worksheet is the source of truth for whether a field is empty, so the
  // carry-forward cannot seed over text the reader typed.
  const canSeed = (field: SeedField) => value[field].trim().length === 0

  const onSeed = (field: SeedField, text: string) => {
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
          <p className="text-sm font-medium">Your domain model</p>
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

      <ArchCarryForward onSeed={onSeed} canSeed={canSeed} />

      <div className="space-y-5 border-t border-line pt-5">
        {FIELDS.map((f) => {
          const id = `domain-${f.key}`
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
            if (
              window.confirm('Clear the domain model? This cannot be undone.')
            ) {
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
            ? 'Complete — the answers are your first migration and your first ADR.'
            : 'Paste the result into your project as docs/domain.md'}
        </p>
      </div>
    </Card>
  )
}
