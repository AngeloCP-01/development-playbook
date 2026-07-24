'use client'

import { useState } from 'react'
import { AlertTriangle, Check, Info } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Card } from '@/components/ui'
import { HORIZON_ITEMS, judgeHorizon, type Horizon } from './scoring'

/**
 * The second carry-forward, and the one that turns the doc's claim — that
 * "Not in v1" is the list doing actual work — into something performed rather
 * than read.
 *
 * The board is `HORIZON_ITEMS` (the worked examples, source: docs/02-planning.md
 * horizon section) plus whatever non-empty lines the reader wrote in the
 * worksheet's own `notInV1` field, passed down as a prop rather than read from
 * storage a second time. Reader items have no entry in `HORIZON_ITEMS`, so
 * `judgeHorizon` is only ever called for worked items — a reader item shows the
 * chosen horizon's own definition instead of a verdict, and is excluded from
 * the "N/6 placed" tally, which only counts worked examples.
 *
 * Three verdict states, three treatments, each with its own icon, colour and
 * word so none of it rides on colour alone: `best` is `go` (Check), `off` is
 * `warn` (AlertTriangle — a suboptimal placement, not a failure, so never
 * `danger`), and `defensible` gets a third, distinct pairing (`blueprint` +
 * Info) rather than being folded into either neighbour. The reader-item
 * definition panel is deliberately greyscale — no colour accent at all — so it
 * cannot be mistaken for any of the three verdicts.
 */

type Item = {
  id: string
  label: string
  worked: boolean
}

const HORIZONS: { key: Horizon; label: string }[] = [
  { key: 'now', label: 'Now' },
  { key: 'next', label: 'Next' },
  { key: 'later', label: 'Later' },
]

const HORIZON_DEFINITION: Record<Horizon, string> = {
  now: 'Now is the MVP — whatever the cut left standing.',
  next: 'Next is what earns its way in on evidence rather than a date: three people asking, or a client’s volume making it necessary.',
  later:
    'Later is the product you are actually building toward, written as a paragraph — without it, nothing in Next has anything to be judged against.',
}

type VerdictKind = 'best' | 'defensible' | 'off'

const VERDICT_STYLE: Record<
  VerdictKind,
  { border: string; bg: string; text: string; Icon: LucideIcon; word: string }
> = {
  best: {
    border: 'border-go',
    bg: 'bg-go-tint',
    text: 'text-go',
    Icon: Check,
    word: 'Best fit',
  },
  defensible: {
    border: 'border-blueprint',
    bg: 'bg-sunken',
    text: 'text-blueprint',
    Icon: Info,
    word: 'Defensible',
  },
  off: {
    border: 'border-warn',
    bg: 'bg-warn-tint',
    text: 'text-warn',
    Icon: AlertTriangle,
    word: 'Off — reconsider',
  },
}

function parseReaderItems(notInV1: string): Item[] {
  return notInV1
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map((line, i) => ({ id: `reader-${i}`, label: line, worked: false }))
}

function VerdictPanel({
  verdict,
}: {
  verdict: { verdict: VerdictKind; why: string }
}) {
  const style = VERDICT_STYLE[verdict.verdict]
  const Icon = style.Icon
  return (
    <div className={`border ${style.border} ${style.bg} p-3`}>
      <p
        className={`mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide ${style.text}`}
      >
        <Icon className="size-3.5 shrink-0" aria-hidden />
        {style.word}
      </p>
      <p className="min-w-0 break-words text-sm leading-6 text-muted">
        {verdict.why}
      </p>
    </div>
  )
}

function DefinitionPanel({ horizon }: { horizon: Horizon }) {
  const label = HORIZONS.find((h) => h.key === horizon)?.label ?? horizon
  return (
    <div className="border border-line bg-raised p-3">
      <p className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-subtle">
        <Info className="size-3.5 shrink-0" aria-hidden />
        What &ldquo;{label}&rdquo; means
      </p>
      <p className="min-w-0 break-words text-sm leading-6 text-muted">
        {HORIZON_DEFINITION[horizon]}
      </p>
    </div>
  )
}

export function HorizonTriage({ notInV1 }: { notInV1: string }) {
  const [selections, setSelections] = useState<
    Partial<Record<string, Horizon>>
  >({})

  const readerItems = parseReaderItems(notInV1)
  const items: Item[] = [
    ...HORIZON_ITEMS.map((i) => ({ id: i.id, label: i.label, worked: true })),
    ...readerItems,
  ]

  const answeredWorked = HORIZON_ITEMS.filter((i) => selections[i.id]).length

  return (
    <Card>
      <div className="mb-5">
        <p className="text-sm font-medium">Place each item on the horizon</p>
        <p className="mt-0.5 text-sm text-subtle">
          Six worked examples, plus whatever you wrote under &ldquo;Not in
          v1&rdquo; above. Your own items get no answer key — only the
          definition of wherever you put them.
        </p>
      </div>

      <div role="list" className="space-y-3">
        {items.map((item) => {
          const choice = selections[item.id]
          const verdict =
            item.worked && choice ? judgeHorizon(item.id, choice) : null

          return (
            <div
              role="listitem"
              key={item.id}
              className="border border-line bg-sunken p-4"
            >
              <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
                <p className="min-w-0 break-words text-sm text-fg">
                  {item.label}
                </p>
                {!item.worked && (
                  <span className="t-label shrink-0 text-subtle">
                    Your item
                  </span>
                )}
              </div>

              <div
                role="radiogroup"
                aria-label={`Horizon for ${item.label}`}
                className="grid grid-cols-3 gap-2"
              >
                {HORIZONS.map((h) => {
                  const active = choice === h.key
                  return (
                    <button
                      key={h.key}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      onClick={() =>
                        setSelections((prev) => ({ ...prev, [item.id]: h.key }))
                      }
                      className={[
                        'min-h-11 min-w-0 border px-2 text-sm font-medium transition-colors duration-150',
                        active
                          ? 'border-brand bg-brand-tint text-fg'
                          : 'border-line bg-raised text-muted hover:border-line-strong',
                      ].join(' ')}
                    >
                      {h.label}
                    </button>
                  )
                })}
              </div>

              <div aria-live="polite" className="mt-3">
                {verdict && <VerdictPanel verdict={verdict} />}
                {!item.worked && choice && <DefinitionPanel horizon={choice} />}
              </div>
            </div>
          )
        })}
      </div>

      <p className="mt-4 text-sm text-subtle" aria-live="polite">
        {answeredWorked}/{HORIZON_ITEMS.length} worked examples placed
      </p>
    </Card>
  )
}
