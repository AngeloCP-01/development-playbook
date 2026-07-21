'use client'

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'

export type Step = {
  id: string
  label: string
  hint: string
  content: ReactNode
}

/**
 * Interaction model is tabs (arrow-key roving focus, one panel at a time), with
 * step numbering as the visual treatment. The URL hash carries the active step
 * so a step is linkable and the browser back button walks the history.
 */
export function Stepper({ steps }: { steps: Step[] }) {
  const [active, setActive] = useState(0)
  const [seen, setSeen] = useState<Set<string>>(new Set([steps[0].id]))
  const tabsRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const isFirstRender = useRef(true)

  const indexOfHash = useCallback(() => {
    const id = window.location.hash.slice(1)
    const i = steps.findIndex((s) => s.id === id)
    return i === -1 ? null : i
  }, [steps])

  // Adopt the hash on load, and follow it on back/forward.
  useEffect(() => {
    const sync = () => {
      const i = indexOfHash()
      if (i !== null) {
        setActive(i)
        setSeen((prev) => new Set(prev).add(steps[i].id))
      }
    }
    sync()
    window.addEventListener('hashchange', sync)
    return () => window.removeEventListener('hashchange', sync)
  }, [indexOfHash, steps])

  const go = useCallback(
    (i: number, { focusTab = false } = {}) => {
      const next = Math.max(0, Math.min(steps.length - 1, i))
      setActive(next)
      setSeen((prev) => new Set(prev).add(steps[next].id))
      history.pushState(null, '', `#${steps[next].id}`)
      if (focusTab) {
        tabsRef.current
          ?.querySelectorAll<HTMLButtonElement>('[role="tab"]')
          [next]?.focus()
      }
    },
    [steps],
  )

  // Long panels leave you mid-document after switching; put the reader back at
  // the top of the new step. Skipped on first paint so deep links do not jump.
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    panelRef.current?.scrollIntoView({ block: 'start', behavior: 'smooth' })
  }, [active])

  const onKeyDown = (e: React.KeyboardEvent) => {
    const map: Record<string, number> = {
      ArrowRight: active + 1,
      ArrowLeft: active - 1,
      Home: 0,
      End: steps.length - 1,
    }
    if (e.key in map) {
      e.preventDefault()
      go(map[e.key], { focusTab: true })
    }
  }

  const step = steps[active]
  const prev = active > 0 ? steps[active - 1] : null
  const next = active < steps.length - 1 ? steps[active + 1] : null

  return (
    <div>
      {/* Sticky so the map stays reachable inside a long step. Below lg it must
          clear the mobile top bar (61px: a 44px control plus 8px padding and
          the border); at lg the sidebar is a rail and the bar is gone. */}
      <div className="sticky top-[61px] z-30 -mx-6 border-b border-line bg-bg px-6 sm:-mx-10 sm:px-10 lg:top-0">
        <div
          ref={tabsRef}
          role="tablist"
          aria-label="Stage steps"
          onKeyDown={onKeyDown}
          className="flex overflow-x-auto"
        >
          {steps.map((s, i) => {
            const on = i === active
            const done = seen.has(s.id) && !on
            return (
              <button
                key={s.id}
                role="tab"
                id={`tab-${s.id}`}
                aria-selected={on}
                aria-controls={`panel-${s.id}`}
                tabIndex={on ? 0 : -1}
                onClick={() => go(i)}
                className={[
                  't-ui flex min-h-11 shrink-0 items-center gap-2 border-b-2 px-3 text-sm transition-colors duration-150 lg:min-h-10',
                  on
                    ? 'border-brand text-fg'
                    : 'border-transparent text-subtle hover:border-line-strong hover:text-fg',
                ].join(' ')}
              >
                <span
                  className={[
                    't-data text-[10px]',
                    on ? 'text-brand' : done ? 'text-go' : 'text-subtle',
                  ].join(' ')}
                >
                  {done ? (
                    <Check className="size-3" aria-hidden />
                  ) : (
                    `0${i + 1}`
                  )}
                </span>
                <span className="whitespace-nowrap">{s.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div
        ref={panelRef}
        role="tabpanel"
        id={`panel-${step.id}`}
        aria-labelledby={`tab-${step.id}`}
        tabIndex={-1}
        className="scroll-mt-20 pt-8"
      >
        <p className="t-label mb-8 flex items-center gap-3 text-subtle">
          <span className="text-brand">
            {String(active + 1).padStart(2, '0')} /{' '}
            {String(steps.length).padStart(2, '0')}
          </span>
          <span className="h-px w-6 bg-line" aria-hidden />
          <span className="tracking-[0.08em] normal-case">{step.hint}</span>
        </p>

        {step.content}
      </div>

      <nav
        aria-label="Step navigation"
        className="mt-12 grid gap-3 border-t border-line pt-6 sm:grid-cols-2"
      >
        {prev ? (
          <button
            type="button"
            onClick={() => go(active - 1)}
            className="group flex min-h-11 items-center gap-3 border border-line bg-raised px-4 py-3 text-left transition-colors duration-150 hover:border-fg"
          >
            <ArrowLeft
              className="size-4 shrink-0 text-subtle transition-colors duration-150 group-hover:text-brand"
              aria-hidden
            />
            <span className="min-w-0">
              <span className="t-label block text-subtle">Previous</span>
              <span className="t-ui mt-1 block truncate text-sm">
                {prev.label}
              </span>
            </span>
          </button>
        ) : (
          <span />
        )}

        {next && (
          <button
            type="button"
            onClick={() => go(active + 1)}
            className="group flex min-h-11 items-center gap-3 border border-line bg-raised px-4 py-3 text-right transition-colors duration-150 hover:border-fg sm:col-start-2"
          >
            <span className="min-w-0 flex-1">
              <span className="t-label block text-subtle">Next</span>
              <span className="t-ui mt-1 block truncate text-sm">
                {next.label}
              </span>
            </span>
            <ArrowRight
              className="size-4 shrink-0 text-subtle transition-colors duration-150 group-hover:text-brand"
              aria-hidden
            />
          </button>
        )}
      </nav>
    </div>
  )
}

export { type Step as StepperStep }
