'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { Card } from '@/components/ui'
import { Figure } from '@/components/Figure'
import { InlineCode } from '@/components/InlineCode'
import { getStage } from '@/lib/stages'
import { LOOP_STAGES } from './loop'

/**
 * Source: `docs/05-development.md`, "### The loop" — the doc's first fenced
 * block, seven arrows deep.
 *
 * Structural reference: `TreeInspector` (stage 04) for the click-node
 * inspector shape — a set of controls, a detail panel that updates on
 * selection, the panel holding its own empty state. Here the controls are a
 * flow rather than a tree, so they render as one row of steps chained by
 * `ChevronRight` separators instead of an indented list.
 *
 * The whole thing renders as **Fig 1** — figure numbers run across the whole
 * stage and are passed explicitly, and this is the first figure any panel in
 * this stage draws. The caption states the claim the loop makes (it repeats,
 * and three of its seven steps hand off elsewhere), not merely that a loop
 * exists.
 *
 * Three of the seven steps carry a `stage` slug — picking the slice, doing
 * the work, and cleaning it up are this stage's own and link nowhere. A
 * selected step with a `stage` renders a real `<Link>` to `/stages/<slug>`,
 * named for the target stage's own title (`getStage`), not the bare slug —
 * the same reasoning `CarryForward` and `ArchCarryForward` already apply to
 * their own cross-stage links.
 */

export function LoopFlow() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const selected = LOOP_STAGES.find((s) => s.id === selectedId) ?? null
  const target = selected?.stage ? getStage(selected.stage) : undefined

  return (
    <Figure
      n={1}
      caption="Seven steps loop rather than run once — shipping one slice is what starts the next — and three of the seven hand the reader off to a stage that lives elsewhere in the playbook."
    >
      <Card>
        <div className="overflow-x-auto">
          <div className="flex min-w-max items-center gap-1.5 pb-1">
            {LOOP_STAGES.map((stage, i) => {
              const active = stage.id === selectedId
              return (
                <div
                  key={stage.id}
                  className="flex shrink-0 items-center gap-1.5"
                >
                  <button
                    type="button"
                    aria-current={active ? 'step' : undefined}
                    aria-label={stage.label}
                    onClick={() => setSelectedId(stage.id)}
                    className={[
                      'flex min-h-11 max-w-48 items-center gap-2 border px-3 py-2 text-left transition-colors duration-150 lg:min-h-9',
                      active
                        ? 'border-brand bg-brand-tint text-fg'
                        : 'border-line bg-raised text-muted hover:border-brand hover:text-fg',
                    ].join(' ')}
                  >
                    <span className="t-data shrink-0 text-[13px] text-subtle">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="min-w-0 break-words text-sm leading-5">
                      {stage.label}
                    </span>
                  </button>
                  {i < LOOP_STAGES.length - 1 && (
                    <ChevronRight
                      className="size-4 shrink-0 text-subtle"
                      aria-hidden
                    />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        <div
          data-testid="loop-detail"
          aria-live="polite"
          className="mt-4 min-h-28 border border-line bg-raised p-4"
        >
          {selected ? (
            <>
              <p className="mb-2 text-sm font-medium text-fg">
                <InlineCode text={selected.label} />
              </p>
              <p className="text-sm leading-6 text-muted">
                <InlineCode text={selected.detail} />
              </p>
              {target && (
                <p className="mt-3 text-sm text-subtle">
                  Hands off to{' '}
                  <Link
                    href={`/stages/${target.slug}`}
                    className="text-brand underline underline-offset-2 hover:no-underline"
                  >
                    {target.title}
                  </Link>
                </p>
              )}
            </>
          ) : (
            <p className="text-sm text-subtle">
              Select a step to see why it is there — and, for three of them,
              which stage picks up from it.
            </p>
          )}
        </div>
      </Card>
    </Figure>
  )
}
