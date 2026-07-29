'use client'

import { Card } from '@/components/ui'
import { useLocalStorage } from '@/lib/useLocalStorage'
import { CHARACTERISTICS } from './characteristics'
import { CHARACTERISTICS_KEY, NO_PICKS } from './characteristics-store'
import { STYLE_TRACE } from './styles'

/**
 * Source: docs/03-architecture.md, "The shapes a system can take" — "Run the
 * same trace against your own three."
 *
 * Read-only by construction, the same way `ArchCarryForward` is: this
 * destructures `value` only, so `setValue` and `reset` are never called and
 * step 02's key cannot be written from here. Reading through the same hook
 * step 02 writes with, rather than a one-shot localStorage read in the render
 * body, is also what avoids a hydration mismatch.
 *
 * With no picks it says so and links back rather than rendering an empty box.
 * A reader who skipped step 02 is told what they skipped and why it mattered,
 * which is more useful than a blank.
 */

const NAME_BY_ID = new Map(CHARACTERISTICS.map((c) => [c.id, c.name]))
const TRACED = new Set(STYLE_TRACE.map((t) => t.characteristicId))

export function YourCharacteristics() {
  const { value: picks } = useLocalStorage<string[]>(
    CHARACTERISTICS_KEY,
    NO_PICKS,
  )

  if (picks.length === 0) {
    return (
      <Card>
        <p className="text-sm leading-6 text-muted">
          You have not chosen characteristics yet.{' '}
          <a href="#require" className="text-brand">
            Go back to Require
          </a>{' '}
          and pick three or four. This section&rsquo;s conclusion is derived
          from them, so without them it is a preference you are being asked to
          take on trust.
        </p>
      </Card>
    )
  }

  return (
    <Card>
      <p className="t-label mb-3 text-subtle">Your three, traced</p>
      <ul className="space-y-2.5">
        {picks.map((id) => {
          const trace = STYLE_TRACE.find((t) => t.characteristicId === id)
          return (
            <li key={id} className="border-l-2 border-line pl-3.5">
              <p className="text-sm font-medium text-fg">
                {NAME_BY_ID.get(id) ?? id}
              </p>
              <p className="mt-0.5 text-sm leading-6 text-muted">
                {trace
                  ? trace.rules
                  : 'The worked example does not trace this one. Do it yourself: what does it rule in, and what does it rule out? If the answer is nothing, it was listed rather than chosen.'}
              </p>
            </li>
          )
        })}
      </ul>

      {picks.some((id) => !TRACED.has(id)) && (
        <p className="mt-4 border-t border-line pt-4 text-sm leading-6 text-muted">
          At least one of your picks is not in the worked trace, which is the
          normal case and the useful one. If it produces a different answer than
          this section, this section is wrong for your system, and you should be
          able to say why.
        </p>
      )}
    </Card>
  )
}
