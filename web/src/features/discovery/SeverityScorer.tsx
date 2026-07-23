'use client'

import { useState } from 'react'
import { Card } from '@/components/ui'

type Level = {
  key: string
  label: string
  test: string
  verdict: string
  detail: string
  tone: 'danger' | 'warn' | 'ok' | 'strong'
}

const LEVELS: Level[] = [
  {
    key: 'annoying',
    label: 'Annoying',
    test: 'They shrug and carry on.',
    verdict: "Don't build it",
    detail:
      'People do not change tools over mild irritation. Switching costs — learning, migrating, trusting something new — are far higher than the pain you would remove. Most ideas land here, which is why most ideas should not be built.',
    tone: 'danger',
  },
  {
    key: 'costly',
    label: 'Costly',
    test: 'It measurably wastes their time or money.',
    verdict: 'Only if switching is effortless',
    detail:
      'There is real pain, but not enough to overcome friction. This is viable only if adopting your solution takes minutes and requires no migration. If onboarding needs a data import, the pain will not carry them through it.',
    tone: 'warn',
  },
  {
    key: 'painful',
    label: 'Painful',
    test: 'They have gone looking for a solution.',
    verdict: 'Worth building',
    detail:
      'They are already searching, already comparing, already frustrated with what exists. You are competing on quality rather than on convincing them a problem exists — a far easier fight.',
    tone: 'ok',
  },
  {
    key: 'blocking',
    label: 'Blocking',
    test: 'It stops them working, or costs them money today.',
    verdict: 'Build it now',
    detail:
      'They will pay before it is polished and tolerate rough edges to get relief. This is the strongest signal available, and it is rare. If you genuinely have it, stop reading and go build.',
    tone: 'strong',
  },
]

const TONE_CLASS = {
  danger: {
    chip: 'border-danger text-danger',
    active: 'bg-danger-tint border-danger',
    text: 'text-danger',
  },
  warn: {
    chip: 'border-warn text-warn',
    active: 'bg-warn-tint border-warn',
    text: 'text-warn',
  },
  ok: {
    chip: 'border-go text-go',
    active: 'bg-go-tint border-go',
    text: 'text-go',
  },
  strong: {
    chip: 'border-go text-go',
    active: 'bg-go-tint border-go',
    text: 'text-go',
  },
} as const

export function SeverityScorer() {
  const [selected, setSelected] = useState<string | null>(null)
  const level = LEVELS.find((l) => l.key === selected)

  return (
    <Card>
      <p className="mb-1 text-sm font-medium">
        How much does the problem hurt?
      </p>
      <p className="mb-4 text-sm text-subtle">
        Pick the honest answer, not the flattering one.
      </p>

      <div
        role="radiogroup"
        aria-label="Problem severity"
        className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4"
      >
        {LEVELS.map((l) => {
          const active = selected === l.key
          const tone = TONE_CLASS[l.tone]
          return (
            <button
              key={l.key}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => setSelected(active ? null : l.key)}
              className={[
                'min-h-11 border px-3 py-2.5 text-left transition-colors duration-150',
                active
                  ? tone.active
                  : 'border-line bg-sunken hover:border-line-strong',
              ].join(' ')}
            >
              <span
                className={`block text-sm font-semibold ${active ? tone.text : 'text-fg'}`}
              >
                {l.label}
              </span>
              <span className="mt-0.5 block text-xs leading-5 text-subtle">
                {l.test}
              </span>
            </button>
          )
        })}
      </div>

      <div aria-live="polite" className="mt-4">
        {level ? (
          <div className={`border ${TONE_CLASS[level.tone].active} p-4`}>
            <p
              className={`mb-1.5 text-sm font-semibold ${TONE_CLASS[level.tone].text}`}
            >
              {level.verdict}
            </p>
            <p className="measure text-sm leading-6 text-muted">
              {level.detail}
            </p>
          </div>
        ) : (
          <div className="border border-dashed border-line p-4">
            <p className="text-sm text-subtle">
              Select a level to see what it means for your decision.
            </p>
          </div>
        )}
      </div>
    </Card>
  )
}
