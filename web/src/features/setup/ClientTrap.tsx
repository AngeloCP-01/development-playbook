'use client'

import { useState } from 'react'
import { Check, Minus, RotateCcw, X } from 'lucide-react'
import { Callout, Card } from '@/components/ui'
import { InlineCode } from '@/components/InlineCode'
import { CLIENT_FAILURE, GATES } from './client-trap'

/**
 * Source: docs/04-project-setup.md, §5 — "One limit on 'everywhere': server
 * modules only, never a `'use client'` file."
 *
 * Structural reference: `ExpandContract` (architecture) for committing before
 * anything is revealed, and for the reset that follows.
 *
 * A guess-then-reveal because the answer is counter-intuitive at exactly this
 * point in the stage: §3 through §7 wire five gates, and the reader has just
 * been told each one is worth the trouble. Asked which of them catches an `env`
 * import in a client component, the honest guess is "one of the four I just
 * installed". None of them do.
 *
 * Every verdict is read off `gate.catchesIt`. The temptation here is to write
 * four rows that say "stays green" and one that says "the browser", which
 * renders identically today and stops being true the moment the data moves —
 * the failure `PATTERNS.md` requires a render test for.
 *
 * Colour: `go` for the gate that catches it, because catching a defect is what
 * a gate is for. The other four are neutral rather than `danger` — none of them
 * is broken, and none of them is lying; a formatter genuinely cannot see where
 * code runs. The caution belongs to the situation, so it sits in the `warn`
 * callout at the end rather than on four blameless rows.
 */

/** Inline code is quoted with markdown backticks in `client-trap.ts`. */

export function ClientTrap() {
  const [guess, setGuess] = useState<string | null>(null)
  const committed = guess !== null
  const right = committed && GATES.find((g) => g.id === guess)?.catchesIt

  return (
    <Card>
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium">
            Someone imports <code className="t-data text-[0.9em]">env</code>{' '}
            into a{' '}
            <code className="t-data text-[0.9em]">&apos;use client&apos;</code>{' '}
            file. Which of the five gates you just wired catches it?
          </p>
          <p className="mt-0.5 text-sm text-subtle">
            One of them. Pick before you read on — the answer only lands if you
            were wrong about it.
          </p>
        </div>
        {committed && (
          <button
            type="button"
            onClick={() => setGuess(null)}
            className="flex min-h-11 shrink-0 items-center gap-1.5 border border-line px-2.5 text-xs text-muted transition-colors duration-150 hover:bg-sunken hover:text-fg lg:min-h-9"
          >
            <RotateCcw className="size-3.5" aria-hidden />
            Reset
          </button>
        )}
      </div>

      <div
        role="radiogroup"
        aria-label="Which gate catches an env import in a client component?"
        className="space-y-2"
      >
        {GATES.map((gate) => {
          const picked = guess === gate.id
          const revealed = committed

          return (
            <div
              key={gate.id}
              data-testid={`gate-${gate.id}`}
              data-catches={String(gate.catchesIt)}
              className={[
                'border p-3.5',
                revealed && gate.catchesIt
                  ? 'border-go bg-go-tint'
                  : 'border-line bg-sunken',
              ].join(' ')}
            >
              <div className="flex flex-wrap items-center justify-between gap-2.5">
                <button
                  type="button"
                  role="radio"
                  aria-checked={picked}
                  aria-label={gate.label}
                  disabled={committed}
                  onClick={() => setGuess(gate.id)}
                  className={[
                    'flex min-h-11 min-w-0 flex-1 items-center gap-2.5 border px-3 py-2 text-left transition-colors duration-150 lg:min-h-9',
                    picked
                      ? 'border-brand bg-brand-tint text-fg'
                      : committed
                        ? 'cursor-not-allowed border-line bg-raised text-subtle'
                        : 'border-line bg-raised text-muted hover:border-line-strong',
                  ].join(' ')}
                >
                  <span className="t-data min-w-0 break-words text-[13px]">
                    {gate.label}
                  </span>
                  {picked && (
                    <span className="t-label shrink-0 text-brand">
                      Your guess
                    </span>
                  )}
                </button>

                {revealed && (
                  <span
                    className={[
                      't-label flex shrink-0 items-center gap-1.5 border px-1.5 py-1',
                      gate.catchesIt
                        ? 'border-go text-go'
                        : 'border-line text-subtle',
                    ].join(' ')}
                  >
                    {gate.catchesIt ? (
                      <Check className="size-3.5 shrink-0" aria-hidden />
                    ) : (
                      <Minus className="size-3.5 shrink-0" aria-hidden />
                    )}
                    {gate.catchesIt ? 'Catches it' : 'Stays green'}
                  </span>
                )}
              </div>

              {revealed && (
                <p className="mt-3 min-w-0 break-words text-sm leading-6 text-muted">
                  <InlineCode text={gate.why} />
                </p>
              )}
            </div>
          )
        })}
      </div>

      <div aria-live="polite">
        {committed && (
          <div className="mt-4">
            <p
              className={[
                'mb-2 flex flex-wrap items-center gap-1.5 text-xs font-semibold uppercase tracking-wide',
                right ? 'text-go' : 'text-danger',
              ].join(' ')}
            >
              {right ? (
                <Check className="size-3.5 shrink-0" aria-hidden />
              ) : (
                <X className="size-3.5 shrink-0" aria-hidden />
              )}
              {right
                ? 'The browser, and only the browser'
                : 'Only loading the page in a browser catches it'}
            </p>
            <Callout kind="warn" title="What the failure actually looks like">
              <InlineCode text={CLIENT_FAILURE} />
            </Callout>
            <p className="mt-3 text-sm leading-6 text-muted">
              When a client component needs a configured value, pass it down as
              a prop from a server component, or read{' '}
              <code className="t-data text-[0.9em]">
                process.env.NEXT_PUBLIC_APP_URL
              </code>{' '}
              directly — the static read Next does substitute.
            </p>
          </div>
        )}
      </div>
    </Card>
  )
}
