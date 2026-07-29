'use client'

import { useState } from 'react'
import { Check, RotateCcw } from 'lucide-react'
import { Callout, Card } from '@/components/ui'
import { useLocalStorage } from '@/lib/useLocalStorage'
import {
  CHARACTERISTICS,
  EXAMPLE_DECLINED,
  EXAMPLE_PICK,
  MAX_PICKS,
  TRADES,
} from './characteristics'
import {
  CHARACTERISTICS_KEY,
  NO_PICKS,
  togglePick,
} from './characteristics-store'

/**
 * Source: docs/03-architecture.md, "What this system has to be".
 *
 * Not a scored exercise, because the doc offers a set to choose from rather
 * than a set to complete — there is no right three for a system it has not
 * seen. So no `go` and no `danger` anywhere in here: the only accent is
 * `brand` on a selected chip, which means "you are here" and not "correct".
 *
 * The teeth are in the cap. A reader who tries for a fifth is told why, in
 * the terms the section is about, and the trades are what the message names.
 * Refusing rather than evicting is the point — see `togglePick`.
 *
 * The picks persist, because step 04 asks the reader to run the same trace
 * against their own three and cannot do that if the answer was thrown away on
 * navigation.
 */

const NAME_BY_ID = new Map(CHARACTERISTICS.map((c) => [c.id, c.name]))

export function CharacteristicPicker() {
  const {
    value: picks,
    setValue: setPicks,
    reset,
  } = useLocalStorage<string[]>(CHARACTERISTICS_KEY, NO_PICKS)
  const [revealed, setRevealed] = useState(false)
  const [blocked, setBlocked] = useState(false)

  const toggle = (id: string) => {
    const next = togglePick(picks, id, MAX_PICKS)
    setBlocked(next === picks && !picks.includes(id))
    setPicks(next)
  }

  return (
    <Card>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium">
            What does your system have to be?
          </p>
          <p className="text-sm text-subtle">
            Pick three or four. Not because a longer list is hard to write.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span
            aria-live="polite"
            className="font-mono text-sm tabular-nums text-muted"
          >
            {picks.length}/{MAX_PICKS} chosen
          </span>
          {picks.length > 0 && (
            <button
              type="button"
              onClick={() => {
                reset()
                setBlocked(false)
                setRevealed(false)
              }}
              className="flex min-h-11 items-center gap-1.5 border border-line px-2.5 text-xs text-muted transition-colors duration-150 hover:bg-sunken hover:text-fg lg:min-h-9"
            >
              <RotateCcw className="size-3.5" aria-hidden />
              Reset
            </button>
          )}
        </div>
      </div>

      <div
        role="group"
        aria-label="Architecture characteristics"
        className="grid gap-2 sm:grid-cols-2"
      >
        {CHARACTERISTICS.map((c) => {
          const on = picks.includes(c.id)
          return (
            <button
              key={c.id}
              type="button"
              aria-pressed={on}
              onClick={() => toggle(c.id)}
              className={[
                'flex min-h-11 w-full items-start gap-2.5 border px-3.5 py-2.5 text-left transition-colors duration-150 lg:min-h-9',
                on
                  ? 'border-brand bg-brand-tint'
                  : 'border-line bg-raised hover:border-line-strong',
              ].join(' ')}
            >
              <span
                className={`mt-0.5 w-3.5 shrink-0 text-sm ${on ? 'text-brand' : 'text-subtle'}`}
                aria-hidden
              >
                {on ? '▪' : '▫'}
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-medium text-fg">
                  {c.name}
                </span>
                <span className="mt-0.5 block text-sm leading-6 text-muted">
                  {c.meaning}
                </span>
              </span>
            </button>
          )
        })}
      </div>

      <div aria-live="polite">
        {blocked && (
          <div className="mt-4">
            <Callout kind="warn" title="Four is the cap, and it is the lesson">
              <p>
                They trade against each other, so a longer list is not a more
                ambitious system. It is a system with no priorities, which means
                the next hard call gets made by whoever is closest to it.
              </p>
              <ul className="mt-2 space-y-1">
                {TRADES.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </Callout>
          </div>
        )}
      </div>

      {!revealed ? (
        <button
          type="button"
          onClick={() => setRevealed(true)}
          className="mt-4 flex min-h-11 items-center gap-2 border border-line bg-raised px-4 text-sm font-medium transition-colors duration-150 hover:border-fg lg:min-h-9"
        >
          Show what the invoicing example chose
        </button>
      ) : (
        <div className="mt-4 space-y-4 border-t border-line pt-4">
          <div>
            <p className="t-label mb-2 text-subtle">The example chose</p>
            <ul className="space-y-1.5">
              {EXAMPLE_PICK.map((id) => (
                <li key={id} className="flex items-center gap-2 text-sm">
                  <Check className="size-3.5 shrink-0 text-brand" aria-hidden />
                  <span className="font-medium text-fg">
                    {NAME_BY_ID.get(id) ?? id}
                  </span>
                  {picks.includes(id) && (
                    <span className="text-xs text-subtle">
                      (you chose this too)
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="t-label mb-2 text-subtle">And declined, out loud</p>
            <ul className="space-y-2.5">
              {EXAMPLE_DECLINED.map((d) => (
                <li key={d.id}>
                  <span className="block text-sm font-medium text-fg">
                    {NAME_BY_ID.get(d.id) ?? d.id}
                  </span>
                  <span className="mt-0.5 block text-sm leading-6 text-muted">
                    {d.because}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <p className="text-sm leading-6 text-muted">
            A characteristic you never considered is not the same as one you
            rejected. Writing the declines down is what stops the list being
            three things that happened to come to mind.
          </p>
        </div>
      )}
    </Card>
  )
}
