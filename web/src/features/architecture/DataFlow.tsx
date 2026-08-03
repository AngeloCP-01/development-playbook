import { Card } from '@/components/ui'
import { FLOW_STEPS } from './sketch'

/**
 * Source: docs/03-architecture.md, "Sketch the system".
 *
 * One data flow, drawn end to end: the flow that crosses the most boundaries,
 * because that is where the design decisions hide.
 *
 * The kind badge is the payload. Steps 2 and 4 look alike in a numbered list
 * and are different in kind, and that difference is the decision the next
 * component poses. Labelling every step — including the three that are neither
 * — is what makes the two that are stand out without colour doing the work.
 *
 * A server component: nothing here is interactive.
 */

const KIND_LABEL: Record<string, string> = {
  sync: 'synchronous',
  async: 'asynchronous',
  local: 'your app',
}

export function DataFlow() {
  return (
    <Card>
      <ol className="space-y-3">
        {FLOW_STEPS.map((step) => (
          <li key={step.n} className="flex gap-3.5">
            <span
              className="t-data shrink-0 pt-0.5 text-[11px] text-brand"
              aria-hidden
            >
              {`0${step.n}`}
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium text-fg">
                  {step.event}
                </span>
                <span className="border border-line px-1.5 py-0.5 text-[11px] font-medium text-subtle">
                  {KIND_LABEL[step.kind]}
                </span>
              </span>
              <span className="mt-0.5 block text-sm leading-6 text-muted">
                {step.consequence}
              </span>
            </span>
          </li>
        ))}
      </ol>

      <p className="mt-4 border-t border-line pt-4 text-sm leading-6 text-muted">
        Steps 2 and 4 are different in kind, and the difference is a decision
        the stage has not posed yet.
      </p>
    </Card>
  )
}
