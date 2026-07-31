import { Callout, Card } from '@/components/ui'
import {
  CHARACTERISTICS,
  FITNESS_EXAMPLES,
  FITNESS_FUNCTION_NOT_NOW,
} from './characteristics'

/**
 * Source: docs/03-architecture.md, "What this system has to be".
 *
 * Four examples, cheapest first, which is the doc's ordering and its argument:
 * the answers are more ordinary than the term suggests, and the cheapest is a
 * three-line assertion about your own schema.
 *
 * Not an accordion. Each entry is two short lines, so hiding them behind a
 * click would cost a reader the scan and buy back almost no height — and this
 * feature already carries five accordions with the same markup.
 *
 * The closing callout is the part that keeps this a note rather than a task,
 * and it renders `FITNESS_FUNCTION_NOT_NOW` rather than restating it: the two
 * were hand-copied apart once already, which left the constant asserted and
 * unread.
 *
 * A server component: nothing here is interactive.
 */

export function FitnessExamples() {
  return (
    <Card className="p-0">
      <ul className="divide-y divide-line">
        {FITNESS_EXAMPLES.map((e) => {
          const defends = CHARACTERISTICS.find(
            (c) => c.id === e.characteristicId,
          )
          return (
            <li key={e.id} className="px-5 py-4">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <p className="min-w-0 flex-1 text-sm font-medium text-fg">
                  {e.what}
                </p>
                <span className="t-label shrink-0 text-subtle">
                  {defends?.name}
                </span>
              </div>
              <p className="mt-1 text-sm leading-6 text-muted">{e.defends}</p>
            </li>
          )
        })}
      </ul>

      <div className="border-t border-line bg-raised px-5 py-4">
        <Callout kind="info" title="A line in your notes now, a test in 06">
          {FITNESS_FUNCTION_NOT_NOW}
        </Callout>
      </div>
    </Card>
  )
}
