'use client'

import { useState } from 'react'
import { Card, Contrast } from '@/components/ui'
import {
  ORDERING_STEPS,
  CORRECT_ORDER,
  SCRAMBLED_ORDER,
  score,
} from './ordering-exercise'

const stepById = Object.fromEntries(ORDERING_STEPS.map((s) => [s.id, s]))

export function OrderingExercise() {
  const [slots, setSlots] = useState<(string | null)[]>([
    null,
    null,
    null,
    null,
    null,
  ])
  const [locked, setLocked] = useState(false)

  const placed = new Set(slots.filter(Boolean))
  const allFilled = slots.every((s) => s !== null)
  const result = locked
    ? score(Object.fromEntries(slots.map((id, i) => [id as string, i + 1])))
    : null

  function placeStep(id: string) {
    if (locked) return
    setSlots((prev) => {
      const next = [...prev]
      const emptyIdx = next.indexOf(null)
      if (emptyIdx !== -1) next[emptyIdx] = id
      return next
    })
  }

  function removeSlot(idx: number) {
    if (locked) return
    setSlots((prev) => {
      const next = [...prev]
      next[idx] = null
      return next
    })
  }

  function check() {
    setLocked(true)
  }

  return (
    <Card>
      <div className="space-y-6">
        <div className="flex items-baseline justify-between gap-4">
          <p className="t-label text-subtle">
            Arrange these CI steps — cheapest failure first
          </p>
          <div aria-live="polite" className="t-label shrink-0 text-subtle">
            {result !== null && <span>{result}/5</span>}
          </div>
        </div>

        {/* Slots */}
        <div className="space-y-2">
          {slots.map((id, i) => {
            const correct = locked && id === CORRECT_ORDER[i]
            const incorrect = locked && id !== null && id !== CORRECT_ORDER[i]
            const step = id ? stepById[id] : null
            return (
              <div key={i} className="flex items-center gap-3">
                <span className="t-label w-6 shrink-0 text-right text-subtle">
                  {i + 1}
                </span>
                {step ? (
                  <button
                    type="button"
                    aria-label={`Position ${i + 1}: ${step.name}`}
                    className={`flex min-h-11 w-full items-center justify-between rounded border px-3 py-2 text-left text-sm lg:min-h-0 ${
                      correct
                        ? 'border-go bg-go-tint text-fg'
                        : incorrect
                          ? 'border-danger bg-danger-tint text-fg'
                          : 'border-line bg-raised text-fg hover:border-line-strong'
                    }`}
                    onClick={() => removeSlot(i)}
                    disabled={locked}
                  >
                    <span className="font-medium">{step.name}</span>
                    {locked && (
                      <span className={correct ? 'text-go' : 'text-danger'}>
                        {correct ? '✓' : '✗'}
                      </span>
                    )}
                  </button>
                ) : (
                  <button
                    type="button"
                    aria-label={`Position ${i + 1}: empty`}
                    className="min-h-11 w-full rounded border border-dashed border-line px-3 py-2 text-left text-sm text-subtle lg:min-h-0"
                    disabled
                  >
                    —
                  </button>
                )}
              </div>
            )
          })}
        </div>

        {/* Reveal: cost reasoning per step */}
        {locked && (
          <div className="space-y-1.5 rounded border border-line bg-sunken p-3">
            <p className="t-label text-subtle">Correct order</p>
            {ORDERING_STEPS.map((step, i) => (
              <div key={step.id} className="flex gap-2 text-sm">
                <span className="t-label shrink-0 text-subtle">{i + 1}.</span>
                <span>
                  <strong>{step.name}</strong>{' '}
                  <span className="text-muted">({step.failTime})</span>
                  {' — '}
                  <span className="text-muted">{step.reason}</span>
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Step cards (unplaced) */}
        {!locked && (
          <div className="flex flex-wrap gap-2">
            {SCRAMBLED_ORDER.map((id) => {
              const step = stepById[id]
              if (placed.has(id)) return null
              return (
                <button
                  key={id}
                  type="button"
                  aria-label={`Place ${step.name}`}
                  className="min-h-11 rounded border border-line bg-raised px-3 py-2 text-sm font-medium text-fg hover:border-line-strong lg:min-h-0"
                  onClick={() => placeStep(id)}
                >
                  {step.name}
                </button>
              )
            })}
          </div>
        )}

        {/* Check button */}
        <button
          type="button"
          className="min-h-11 rounded border border-brand bg-brand-tint px-4 py-2 text-sm font-medium text-fg disabled:cursor-not-allowed disabled:opacity-40 lg:min-h-0"
          disabled={!allFilled || locked}
          onClick={check}
        >
          Check my order
        </button>

        {locked && (
          <Contrast
            badLabel="Build first"
            bad="Wait 2 minutes to learn about a semicolon."
            goodLabel="Format first"
            good="3 seconds to the same answer."
          />
        )}
      </div>
    </Card>
  )
}
