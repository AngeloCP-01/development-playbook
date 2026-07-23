'use client'

import { useState } from 'react'
import { Card } from '@/components/ui'

/**
 * The decision path through discovery. Two exits matter equally: "build" and
 * "stop", and the diagram gives them equal visual weight on purpose — most
 * renderings of this flow bury the stop path, which is the one people skip.
 */

type Step = {
  id: string
  kind: 'step' | 'gate' | 'stop' | 'go'
  label: string
  sub: string
  detail: string
}

const STEPS: Step[] = [
  {
    id: 'idea',
    kind: 'step',
    label: 'Idea arrives',
    sub: 'usually as a solution',
    detail:
      'Almost always phrased as "an app that does X". That framing is the first thing to dismantle — it has already chosen an answer before anyone stated the question.',
  },
  {
    id: 'reframe',
    kind: 'step',
    label: 'Reframe as a problem',
    sub: 'ask "why does that matter?"',
    detail:
      'Keep asking until you land on time, money, or risk. If you cannot get there, that is your answer — the problem may not be real.',
  },
  {
    id: 'evidence',
    kind: 'step',
    label: 'Gather evidence',
    sub: 'search → complaints → interviews',
    detail:
      'Cheapest first. Most ideas die on the free rungs, which is exactly what the free rungs are for.',
  },
  {
    id: 'gate',
    kind: 'gate',
    label: 'How much does it hurt?',
    sub: 'the honest answer',
    detail:
      'The gate everything turns on. Annoying and Costly route to stop; Painful and Blocking route to build. Answering this flatteringly is how three months get spent.',
  },
  {
    id: 'stop',
    kind: 'stop',
    label: 'Stop here',
    sub: 'annoying · costly',
    detail:
      'A successful outcome, not a failure. Cost: a few days. The alternative is discovering the same thing after three months of building, which costs three months.',
  },
  {
    id: 'go',
    kind: 'go',
    label: 'Write the one-pager',
    sub: 'painful · blocking',
    detail:
      'Problem, who, evidence, severity, success, and — most importantly — what this is NOT. Then move to Planning.',
  },
]

const KIND_STYLE = {
  step: { box: 'border-line bg-raised', dot: 'bg-subtle' },
  gate: { box: 'border-warn bg-warn-tint', dot: 'bg-warn' },
  stop: { box: 'border-danger bg-danger-tint', dot: 'bg-danger' },
  go: { box: 'border-go bg-go-tint', dot: 'bg-go' },
} as const

function Connector({ label }: { label?: string }) {
  return (
    <div className="flex items-center gap-2 py-1 pl-5" aria-hidden>
      <svg width="12" height="22" viewBox="0 0 12 22" className="shrink-0">
        <path
          d="M6 0 V16"
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-line-strong"
        />
        <path
          d="M6 21 L2 15 H10 Z"
          fill="currentColor"
          className="text-line-strong"
        />
      </svg>
      {label && (
        <span className="border border-line bg-sunken px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wide text-subtle">
          {label}
        </span>
      )}
    </div>
  )
}

function FlowNode({
  step,
  active,
  onToggle,
}: {
  step: Step
  active: boolean
  onToggle: () => void
}) {
  const s = KIND_STYLE[step.kind]
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={active}
      className={[
        'w-full border px-4 py-3 text-left transition-colors duration-150',
        s.box,
        active ? 'ring-2 ring-brand ring-offset-2 ring-offset-bg' : '',
      ].join(' ')}
    >
      <span className="flex items-center gap-2.5">
        <span className={`size-2 shrink-0 rounded-full ${s.dot}`} aria-hidden />
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-medium text-fg">
            {step.label}
          </span>
          <span className="mt-0.5 block font-mono text-[11px] text-subtle">
            {step.sub}
          </span>
        </span>
      </span>
      {active && (
        <span className="measure mt-2.5 block border-t border-line pt-2.5 text-sm leading-6 text-muted">
          {step.detail}
        </span>
      )}
    </button>
  )
}

export function DiscoveryFlow() {
  const [open, setOpen] = useState<string>('gate')
  const toggle = (id: string) => setOpen(open === id ? '' : id)

  const linear = STEPS.slice(0, 4)
  const stop = STEPS[4]
  const go = STEPS[5]

  return (
    <Card>
      {linear.map((step, i) => (
        <div key={step.id}>
          <FlowNode
            step={step}
            active={open === step.id}
            onToggle={() => toggle(step.id)}
          />
          {i < linear.length - 1 && <Connector />}
        </div>
      ))}

      {/* The fork. Both exits get equal weight. */}
      <div className="grid gap-3 pt-1 sm:grid-cols-2">
        <div>
          <Connector label="no" />
          <FlowNode
            step={stop}
            active={open === stop.id}
            onToggle={() => toggle(stop.id)}
          />
        </div>
        <div>
          <Connector label="yes" />
          <FlowNode
            step={go}
            active={open === go.id}
            onToggle={() => toggle(go.id)}
          />
        </div>
      </div>
    </Card>
  )
}
