'use client'

import Link from 'next/link'
import { ArrowRight, Check } from 'lucide-react'
import { useLocalStorage } from '@/lib/useLocalStorage'
import { DISCOVERY_KEY, EMPTY_SHEET } from '@/lib/discovery-sheet'

/**
 * The first of the stage's two carry-forwards: stage 01's answers, offered as
 * seeds for this stage's own worksheet.
 *
 * Read-only by construction. This component only destructures `value` off
 * `useLocalStorage` — `setValue` and `reset` are never called, so stage 01's
 * key is never written here, only read. Reading through the same hook stage 01
 * writes with (rather than a one-shot `readDiscoverySheet()` call in the render
 * body) avoids a hydration mismatch: `useSyncExternalStore` returns the empty
 * sheet on the server and the first client pass, then swaps to the real value,
 * matching what `useLocalStorage` already guarantees everywhere else.
 *
 * Seeding is offered, never forced. Each button is disabled once its target
 * field already holds text — `canSeed` is the parent's source of truth for
 * that, computed from the live worksheet state, so this component cannot seed
 * over something the reader typed.
 */

type SeedField = 'doneMeans' | 'notInV1'

type Seed = {
  field: SeedField
  sourceLabel: string
  targetLabel: string
  text: string
}

export function CarryForward({
  onSeed,
  canSeed,
}: {
  onSeed: (field: SeedField, text: string) => void
  canSeed: (field: SeedField) => boolean
}) {
  const { value: sheet } = useLocalStorage(DISCOVERY_KEY, EMPTY_SHEET)

  const seeds: Seed[] = []
  if (sheet.success.trim()) {
    seeds.push({
      field: 'doneMeans',
      sourceLabel: 'Stage 01 — what success looks like',
      targetLabel: 'Done means',
      text: sheet.success.trim(),
    })
  }
  if (sheet.notThis.trim()) {
    seeds.push({
      field: 'notInV1',
      sourceLabel: 'Stage 01 — what this is NOT',
      targetLabel: 'Not in v1',
      text: sheet.notThis.trim(),
    })
  }

  if (seeds.length === 0) {
    return (
      <p className="mb-5 text-sm text-subtle">
        Fill in stage 01&rsquo;s worksheet and it carries forward here —{' '}
        <Link
          href="/stages/01-product-discovery"
          className="text-brand underline underline-offset-2 hover:no-underline"
        >
          go answer Product Discovery
        </Link>
        .
      </p>
    )
  }

  return (
    <div className="mb-5 space-y-3 border border-line bg-sunken p-4">
      <p className="t-label text-subtle">Carried forward from stage 01</p>
      {seeds.map((s) => {
        const already = !canSeed(s.field)
        return (
          <div
            key={s.field}
            className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4"
          >
            <div className="min-w-0">
              <p className="t-label text-subtle">{s.sourceLabel}</p>
              <p className="mt-0.5 min-w-0 break-words text-sm italic leading-6 text-muted">
                &ldquo;{s.text}&rdquo;
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
              <span className="min-w-0 break-words">
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
