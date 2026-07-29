'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Check, Copy, Trash2 } from 'lucide-react'
import { Card, Callout } from '@/components/ui'

/**
 * Source: docs/02-planning.md:149-168, plus the "Spikes that become
 * production code" trap at docs/02-planning.md:371-372.
 *
 * The copy-artifact pattern (`AIWorkflow` prompts are the canonical example
 * in this codebase): a filled template the reader takes and reuses, not a
 * form they fill in. The clipboard write is wrapped in try/catch exactly as
 * `Worksheet.tsx` does it, because `navigator.clipboard.writeText` throws in
 * insecure contexts — the template stays visible on screen either way, so a
 * failed write costs the reader a manual select-and-copy, nothing more.
 *
 * Figure 7 (the spike loop) lives inside this component as the flow beneath
 * the template. This file does not wrap itself in `<Figure>` — the call site
 * numbers it and writes the caption, the same split `RiskOrder` and
 * `CutFunnel` use for their diagrams.
 */

const SPIKE = {
  question: 'Can Stripe Connect handle the payout model we need?',
  timebox: '4 hours',
  output: 'A decision, written down. The code is discarded.',
}

function toTemplate(): string {
  return [
    '# Spike',
    '',
    `Question: ${SPIKE.question}`,
    `Timebox: ${SPIKE.timebox}`,
    `Output: ${SPIKE.output}`,
  ].join('\n')
}

const LOOP_STEPS = [
  'Ask one hard question',
  'Timebox it, hard stop',
  'Build only enough to answer it',
  'Write the decision, discard the code',
]

export function SpikeCard() {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(toTemplate())
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard unavailable (insecure context or denied permission). The
      // template is still on screen for the reader to select by hand.
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm font-medium">A spike, filled in</p>
            <p className="mt-0.5 text-sm text-subtle">
              Copy it, then swap the question for your own before you start the
              clock.
            </p>
          </div>
          <button
            type="button"
            onClick={copy}
            aria-live="polite"
            className="flex min-h-11 shrink-0 items-center gap-2 bg-brand px-4 text-sm font-medium text-brand-fg transition-opacity duration-150 hover:opacity-90"
          >
            {copied ? (
              <Check className="size-4" aria-hidden />
            ) : (
              <Copy className="size-4" aria-hidden />
            )}
            {copied ? 'Copied' : 'Copy template'}
          </button>
        </div>

        <dl className="divide-y divide-line border border-line bg-sunken">
          <div className="grid gap-1 px-3.5 py-3 sm:grid-cols-[7rem_1fr] sm:gap-3">
            <dt className="t-label text-subtle">Question</dt>
            <dd className="min-w-0 break-words text-sm text-fg">
              {SPIKE.question}
            </dd>
          </div>
          <div className="grid gap-1 px-3.5 py-3 sm:grid-cols-[7rem_1fr] sm:gap-3">
            <dt className="t-label text-subtle">Timebox</dt>
            <dd className="min-w-0 break-words text-sm text-fg">
              {SPIKE.timebox}
            </dd>
          </div>
          <div className="grid gap-1 px-3.5 py-3 sm:grid-cols-[7rem_1fr] sm:gap-3">
            <dt className="t-label text-subtle">Output</dt>
            <dd className="min-w-0 break-words text-sm text-fg">
              {SPIKE.output}
            </dd>
          </div>
        </dl>

        <div className="mt-5 border-t border-line pt-4">
          <p className="t-label mb-3 text-subtle">The spike loop</p>
          <div className="flex flex-wrap items-stretch gap-2">
            {LOOP_STEPS.map((step, i) => (
              <div key={step} className="flex min-w-0 items-center gap-2">
                <div className="min-w-0 flex-1 border border-line bg-raised px-3 py-2.5">
                  <span className="break-words text-sm leading-5 text-fg">
                    {step}
                  </span>
                </div>
                {i < LOOP_STEPS.length - 1 && (
                  <ArrowRight
                    className="size-3.5 shrink-0 text-subtle"
                    aria-hidden
                  />
                )}
              </div>
            ))}
          </div>
          <p className="mt-2.5 flex items-start gap-2 text-sm leading-6 text-muted">
            <Trash2
              className="mt-0.5 size-3.5 shrink-0 text-subtle"
              aria-hidden
            />
            Still unresolved when the clock runs out? Tighten the question and
            spike again. A spike can repeat; it does not get to become
            production code.
          </p>
        </div>
      </Card>

      <Callout kind="trap" title="The trap this avoids">
        Untested, unreviewed exploration entering the codebase because it
        happened to work. If you are keeping the code, it was not a spike — it
        was production work that skipped review.
      </Callout>

      <p className="text-sm leading-6 text-muted">
        The written decision is the handoff, not the code — it gets discarded.{' '}
        <Link
          href="/stages/03-architecture"
          className="font-medium text-brand underline underline-offset-2 hover:no-underline"
        >
          03 — Architecture
        </Link>{' '}
        consumes that decision directly: a spike settling whether a provider can
        do what you need turns an architecture choice from a guess into
        something you can defend later.
      </p>
    </div>
  )
}
