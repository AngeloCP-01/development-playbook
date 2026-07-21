'use client'

import { ArrowRight } from 'lucide-react'
import { Card } from '@/components/ui'

/**
 * Where discovery output lands in the spec → plan → subagent-TDD pipeline.
 * Mirrors the superpowers convention (docs/superpowers/specs, then plans) so
 * stage 01 hands off into a workflow that already exists rather than inventing
 * a parallel one.
 */

type Stage = {
  step: string
  artifact: string
  tool: string
  current: boolean
}

const PIPELINE: Stage[] = [
  {
    step: 'Discovery',
    artifact: 'docs/discovery.md',
    tool: 'the worksheet below',
    current: true,
  },
  {
    step: 'Brainstorm',
    artifact: 'docs/superpowers/specs/YYYY-MM-DD-<slug>-design.md',
    tool: 'superpowers:brainstorming',
    current: false,
  },
  {
    step: 'Plan',
    artifact: 'docs/superpowers/plans/YYYY-MM-DD-<slug>.md',
    tool: 'superpowers:writing-plans',
    current: false,
  },
  {
    step: 'Build',
    artifact: 'checkbox tasks, TDD, per-task review',
    tool: 'superpowers:subagent-driven-development',
    current: false,
  },
]

export function PipelineFit() {
  return (
    <Card>
      <p className="text-sm font-medium">Where this output goes</p>
      <p className="mt-0.5 text-sm text-subtle">
        Discovery is the missing first step in front of a pipeline you already
        run.
      </p>

      <ol className="mt-4 space-y-2">
        {PIPELINE.map((s, i) => (
          <li key={s.step}>
            <div
              className={[
                'border px-3.5 py-3',
                s.current
                  ? 'border-brand bg-brand-tint'
                  : 'border-line bg-sunken',
              ].join(' ')}
            >
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={[
                    'grid size-6 shrink-0 place-items-center font-mono text-[11px] tabular-nums',
                    s.current
                      ? 'bg-brand text-brand-fg'
                      : 'bg-raised text-subtle',
                  ].join(' ')}
                >
                  {i + 1}
                </span>
                <span className="text-sm font-medium text-fg">{s.step}</span>
                {s.current && (
                  <span className="bg-brand px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-brand-fg">
                    you are here
                  </span>
                )}
              </div>
              <p className="mt-2 overflow-x-auto font-mono text-[11px] leading-5 text-muted">
                {s.artifact}
              </p>
              <p className="mt-1 text-xs text-subtle">{s.tool}</p>
            </div>
            {i < PIPELINE.length - 1 && (
              <div className="flex justify-center py-1" aria-hidden>
                <ArrowRight className="size-4 rotate-90 text-line-strong" />
              </div>
            )}
          </li>
        ))}
      </ol>

      <p className="mt-4 border-t border-line pt-3.5 text-sm leading-6 text-subtle">
        Note what step 1 replaces. Jumping straight to a spec that opens with
        Overview, Goals, and Tech Stack means the problem was never written down
        — only the solution was. That is a comfortable way to build the wrong
        thing well.
      </p>
    </Card>
  )
}
