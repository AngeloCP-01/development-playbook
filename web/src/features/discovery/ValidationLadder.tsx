'use client'

import { useState } from 'react'
import { Card } from '@/components/ui'

type Rung = {
  name: string
  cost: string
  what: string
  tells: string
  fails: string
}

const RUNGS: Rung[] = [
  {
    name: 'Search for it',
    cost: '10 minutes',
    what: 'Look for the words your users would type. Check volume and what already ranks.',
    tells:
      'Whether anyone is actively looking, and what vocabulary they use — which is often not yours.',
    fails:
      'Silence is ambiguous. It can mean no demand, or that you guessed the wrong words. Try three vocabularies before concluding anything.',
  },
  {
    name: 'Find where they complain',
    cost: '1 hour',
    what: 'Reddit, forums, support threads, one-star reviews of the nearest competitor.',
    tells:
      'The most useful research available — specific, unsolicited, and written by people with no idea you exist.',
    fails:
      'Complainers skew toward power users. The loudest gap is not always the most common one.',
  },
  {
    name: 'Do it manually',
    cost: '1–4 weeks',
    what: 'Deliver the outcome by hand for a few people. No product, just you doing the work.',
    tells:
      'Where the real difficulty is — which is almost never where you assumed. Many products are worth running manually for a month before writing a line of code.',
    fails:
      'Does not scale, and it is easy to mistake your own effort for product-market fit. You are the feature at this stage.',
  },
  {
    name: 'Fake the front door',
    cost: '1 afternoon',
    what: 'A landing page describing the product, with a signup form behind the button.',
    tells:
      'Actual interest rather than politeness. An email address is a small cost, but it is not zero — which is what makes it a signal.',
    fails:
      'Measures interest in your pitch, not your product. A great headline can validate an idea that would disappoint on delivery.',
  },
]

export function ValidationLadder() {
  const [open, setOpen] = useState(0)

  return (
    <Card className="p-0">
      <ul className="divide-y divide-line">
        {RUNGS.map((rung, i) => {
          const active = open === i
          return (
            <li key={rung.name}>
              <button
                type="button"
                onClick={() => setOpen(active ? -1 : i)}
                aria-expanded={active}
                className="flex w-full items-center gap-3.5 px-5 py-3.5 text-left transition-colors duration-150 hover:bg-sunken"
              >
                <span className="grid size-6 shrink-0 place-items-center bg-sunken font-mono text-[11px] tabular-nums text-subtle">
                  {i + 1}
                </span>
                <span className="flex-1 font-medium">{rung.name}</span>
                <span className="shrink-0 border border-line px-2 py-0.5 font-mono text-[11px] tabular-nums text-subtle">
                  {rung.cost}
                </span>
              </button>

              {active && (
                <div className="space-y-3 border-t border-line bg-sunken px-5 py-4">
                  <p className="measure text-sm leading-6 text-muted">{rung.what}</p>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-brand">
                      What it tells you
                    </p>
                    <p className="mt-1 text-sm leading-6 text-muted">
                      {rung.tells}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-warn">
                      Where it misleads
                    </p>
                    <p className="mt-1 text-sm leading-6 text-muted">
                      {rung.fails}
                    </p>
                  </div>
                </div>
              )}
            </li>
          )
        })}
      </ul>
    </Card>
  )
}
