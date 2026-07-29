'use client'

import Link from 'next/link'
import { ArrowRight, Check } from 'lucide-react'
import { useLocalStorage } from '@/lib/useLocalStorage'
import { PLANNING_KEY, EMPTY_PLAN } from '@/features/planning/PlanWorksheet'

/**
 * Stage 02's plan, offered as seeds for this stage's domain sheet.
 *
 * Read-only by construction, the same way `planning/CarryForward` is. This
 * component destructures `value` only — `setValue` and `reset` are never
 * called, so stage 02's key is read here and never written. Reading through
 * the same hook stage 02 writes with (rather than a one-shot
 * `localStorage.getItem` in the render body) is also what avoids a hydration
 * mismatch: `useSyncExternalStore` returns the empty plan on the server and on
 * the first client pass, then swaps to the stored value.
 *
 * Seeding is offered, never forced. Each button is disabled once its target
 * field already holds text, and `canSeed` — the parent's live worksheet state —
 * is the source of truth for that, so this component cannot seed over
 * something the reader typed.
 *
 * The second seed is labelled "risks you logged", not "decisions". What is
 * sitting in that box usually is not a decision yet, and renaming it on the
 * way across would be dishonest about what was carried; the point is that a
 * risk is a decision waiting to be made.
 */

export type SeedField = 'entities' | 'decisions'

type Seed = {
  field: SeedField
  sourceLabel: string
  targetLabel: string
  helper: string
  text: string
}

export function ArchCarryForward({
  onSeed,
  canSeed,
}: {
  onSeed: (field: SeedField, text: string) => void
  canSeed: (field: SeedField) => boolean
}) {
  const { value: plan } = useLocalStorage(PLANNING_KEY, EMPTY_PLAN)

  const seeds: Seed[] = []
  if (plan.slices.trim()) {
    seeds.push({
      field: 'entities',
      sourceLabel: 'Stage 02 — your slices',
      targetLabel: 'Nouns and relationships',
      helper: 'The nouns in your slices are your entities.',
      text: plan.slices.trim(),
    })
  }
  if (plan.risks.trim()) {
    seeds.push({
      field: 'decisions',
      sourceLabel: 'Stage 02 — risks you logged',
      targetLabel: 'Decisions that need an ADR',
      helper:
        'A risk with a fork in it is a decision you have not made yet. Not all of these will become one.',
      text: plan.risks.trim(),
    })
  }

  if (seeds.length === 0) {
    return (
      <p className="mb-5 text-sm text-subtle">
        Fill in stage 02&rsquo;s plan and it carries forward here —{' '}
        <Link
          href="/stages/02-planning"
          className="text-brand underline underline-offset-2 hover:no-underline"
        >
          go write the one-page plan
        </Link>
        .
      </p>
    )
  }

  return (
    <div className="mb-5 space-y-3 border border-line bg-sunken p-4">
      <p className="t-label text-subtle">Carried forward from stage 02</p>
      {seeds.map((s) => {
        const already = !canSeed(s.field)
        return (
          <div
            key={s.field}
            className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4"
          >
            <div className="min-w-0">
              <p className="t-label text-subtle">{s.sourceLabel}</p>
              <p className="mt-0.5 min-w-0 whitespace-pre-line break-words text-sm italic leading-6 text-muted">
                &ldquo;{s.text}&rdquo;
              </p>
              <p className="mt-1 min-w-0 break-words text-sm leading-6 text-subtle">
                {s.helper}
              </p>
            </div>
            <button
              type="button"
              onClick={() => onSeed(s.field, s.text)}
              disabled={already}
              className="flex min-h-11 shrink-0 items-center gap-1.5 border border-line bg-raised px-3.5 text-sm text-fg transition-colors duration-150 hover:border-brand hover:text-brand disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-line disabled:hover:text-fg"
            >
              {already ? (
                <Check className="size-3.5 shrink-0" aria-hidden />
              ) : (
                <ArrowRight className="size-3.5 shrink-0" aria-hidden />
              )}
              <span className="min-w-0 break-words text-left">
                {already
                  ? `Already in “${s.targetLabel}”`
                  : `Use as “${s.targetLabel}”`}
              </span>
            </button>
          </div>
        )
      })}
    </div>
  )
}
